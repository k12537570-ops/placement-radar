import { create } from 'zustand';
import api, { setAccessToken } from '../services/api';

const USER_CACHE_KEY = 'pr_user_cache';

function getCachedUser() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setCachedUser(user) {
  try {
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_CACHE_KEY);
    }
  } catch (e) { }
}

export const useAuthStore = create((set, get) => ({
  user: getCachedUser(),
  isGuest: Boolean(getCachedUser()?.isGuest),
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  showOnboarding: false,

  clearError: () => set({ error: null }),

  checkAuth: async () => {
    // If we have a cached guest session, maintain it without making server calls
    const cached = getCachedUser();
    if (cached && cached.isGuest) {
      set({ user: cached, isGuest: true, isCheckingAuth: false });
      return cached;
    }

    try {
      set({ isCheckingAuth: true });
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data?.data) {
        const user = res.data.data;
        setCachedUser(user);
        set({
          user,
          isGuest: false,
          isCheckingAuth: false,
          showOnboarding: !user.onboardingDone
        });
        return user;
      }
    } catch (err) {
      // Fallback to guest if user was guest
      const cachedGuest = getCachedUser();
      if (cachedGuest && cachedGuest.isGuest) {
        set({ user: cachedGuest, isGuest: true, isCheckingAuth: false });
        return cachedGuest;
      }
      setCachedUser(null);
      set({ user: null, isGuest: false, isCheckingAuth: false });
    }
    return null;
  },

  closeOnboarding: async () => {
    const { user } = get();
    if (!user) {
      set({ showOnboarding: false });
      return;
    }

    if (user.isGuest) {
      const updatedUser = { ...user, onboardingDone: true, hasSeenOnboarding: true };
      setCachedUser(updatedUser);
      set({ user: updatedUser, showOnboarding: false });
      return;
    }

    try {
      await api.patch('/users/settings', { onboardingDone: true });
      const updatedUser = { ...user, onboardingDone: true, hasSeenOnboarding: true };
      setCachedUser(updatedUser);
      set({ user: updatedUser, showOnboarding: false });
    } catch (err) {
      // Fallback
      set({ showOnboarding: false });
    }
  },

  signup: async ({ name, email, password, gradYear, college }) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        college: college ? college.trim() : undefined,
        graduationYear: gradYear ? parseInt(gradYear, 10) : 2026
      };

      const res = await api.post('/auth/signup', payload);
      const { user, accessToken } = res.data.data;

      setAccessToken(accessToken);
      setCachedUser(user);

      set({
        user,
        isLoading: false,
        error: null,
        showOnboarding: true
      });

      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Signup failed';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  login: async ({ email, password, rememberMe = true }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });

      const { user, accessToken } = res.data.data;

      setAccessToken(accessToken);
      setCachedUser(user);

      set({
        user,
        isLoading: false,
        error: null,
        showOnboarding: !user.onboardingDone
      });

      return { success: true, user };
    } catch (err) {
      const message = err.response?.status === 401
        ? 'Invalid email or password.'
        : (err.response?.data?.message || 'Login failed');
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  continueAsGuest: () => {
    const guestUser = {
      id: 'guest_session',
      name: 'Guest Explorer',
      email: 'guest@placementradar.local',
      college: 'Placement Radar Explorer',
      graduationYear: 2026,
      isGuest: true,
      onboardingDone: true,
      hasSeenOnboarding: true,
      createdAt: new Date().toISOString()
    };

    setAccessToken(null);
    setCachedUser(guestUser);

    set({
      user: guestUser,
      isGuest: true,
      isLoading: false,
      error: null,
      showOnboarding: false
    });

    return { success: true, user: guestUser };
  },

  loginAsGuest: () => {
    return get().continueAsGuest();
  },

  logout: async () => {
    const { user } = get();
    if (user?.isGuest) {
      setAccessToken(null);
      setCachedUser(null);
      set({ user: null, isGuest: false, showOnboarding: false, error: null });
      return;
    }

    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore errors on logout
    } finally {
      setAccessToken(null);
      setCachedUser(null);
      set({ user: null, isGuest: false, showOnboarding: false, error: null });
    }
  },

  updateProfile: async ({ name, college, gradYear }) => {
    const { user } = get();
    if (!user) return { success: false, error: 'Not authenticated' };

    if (user.isGuest) {
      const updatedUser = {
        ...user,
        name: name !== undefined ? name : user.name,
        college: college !== undefined ? college : user.college,
        graduationYear: gradYear ? parseInt(gradYear, 10) : user.graduationYear
      };
      setCachedUser(updatedUser);
      set({ user: updatedUser });
      return { success: true, user: updatedUser };
    }

    try {
      const payload = {
        name,
        college,
        graduationYear: gradYear ? parseInt(gradYear, 10) : undefined
      };

      const res = await api.patch('/users/profile', payload);
      const updatedUser = { ...user, ...res.data.data };
      setCachedUser(updatedUser);
      set({ user: updatedUser });
      return { success: true, user: updatedUser };
    } catch (err) {
      const error = err.response?.data?.message || 'Failed to update profile';
      return { success: false, error };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const { user } = get();
    if (!user || user.isGuest) {
      return { success: false, error: 'Cannot change password in guest demo mode.' };
    }

    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to change password.'
      };
    }
  },

  deleteAccount: async () => {
    const { user } = get();
    if (!user) return;

    try {
      await api.delete('/users/me');
    } catch (err) {
      console.error('Delete account failed', err);
    } finally {
      setAccessToken(null);
      setCachedUser(null);
      set({ user: null, showOnboarding: false });
    }
  }
}));

// Listen for session expired events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:session_expired', () => {
    useAuthStore.getState().logout();
  });
}

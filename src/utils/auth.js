/**
 * Placement Radar Authentication Utility
 * Uses browser SubtleCrypto SHA-256 for password hashing and localStorage for demo persistence.
 * Note: For demo/hackathon purposes only. Not production authentication.
 */

const USERS_KEY = 'placement_radar_users';
const SESSION_KEY = 'placement_radar_session';

export async function hashPassword(password) {
  if (!password) return '';
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(user) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
  } else {
    // Exclude passwordHash from session payload
    const { passwordHash, ...safeUser } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  }
}

export async function registerUser({ name, email, password, gradYear, college }) {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    gradYear: gradYear || '2026',
    college: college ? college.trim() : 'Tech Institute',
    createdAt: new Date().toISOString(),
    isFirstLogin: true
  };

  users.push(newUser);
  saveAllUsers(users);
  setSession(newUser);
  return newUser;
}

export async function loginUser({ email, password }) {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    throw new Error('No account found with this email.');
  }

  const incomingHash = await hashPassword(password);
  if (user.passwordHash !== incomingHash) {
    throw new Error('Incorrect password. Please try again.');
  }

  setSession(user);
  return user;
}

export function loginAsGuest() {
  const guestUser = {
    id: 'guest_user',
    name: 'Alex Chen (Guest)',
    email: 'alex.guest@placementradar.demo',
    gradYear: '2026',
    college: 'Stanford Tech',
    createdAt: new Date().toISOString(),
    isGuest: true
  };
  setSession(guestUser);
  return guestUser;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function updateUserProfile(updates) {
  const session = getCurrentSession();
  if (!session) return null;

  const users = getAllUsers();
  const index = users.findIndex(u => u.id === session.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveAllUsers(users);
  }

  const updatedSession = { ...session, ...updates };
  setSession(updatedSession);
  return updatedSession;
}

export async function changePassword(oldPassword, newPassword) {
  const session = getCurrentSession();
  if (!session) throw new Error('Not logged in.');

  const users = getAllUsers();
  const user = users.find(u => u.id === session.id);
  if (!user) throw new Error('User not found.');

  const oldHash = await hashPassword(oldPassword);
  if (user.passwordHash !== oldHash) {
    throw new Error('Current password does not match.');
  }

  user.passwordHash = await hashPassword(newPassword);
  saveAllUsers(users);
  return true;
}

// Scoped Storage Helpers (isolates user data so multiple accounts do not collide)
export function getScopedKey(baseKey) {
  const session = getCurrentSession();
  const userId = session ? session.id : 'anonymous';
  return `pr_${userId}_${baseKey}`;
}

export function getScopedData(baseKey, fallback = null) {
  try {
    const raw = localStorage.getItem(getScopedKey(baseKey));
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setScopedData(baseKey, value) {
  try {
    localStorage.setItem(getScopedKey(baseKey), JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

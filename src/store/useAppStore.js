import { create } from 'zustand';
import api from '../services/api';
import { DEFAULT_RESUME } from '../data/resumeTemplates';
import { calculateRoleMatch, ROLES } from '../data/roles';
import { SKILLS } from '../data/skills';

// Initial starter skills for demo / new user
const INITIAL_SKILLS = {
  'dsa': 3,
  'algorithms': 2,
  'system-design': 2,
  'os': 2,
  'cn': 2,
  'dbms': 3,
  'python': 3,
  'java': 2,
  'cpp': 1,
  'javascript': 3,
  'sql': 3,
  'html-css': 3,
  'react': 3,
  'nodejs': 2,
  'rest-apis': 3,
  'typescript': 2,
  'statistics': 1,
  'machine-learning': 0,
  'data-analysis': 2,
  'pandas-numpy': 1,
  'data-viz': 2,
  'git-github': 3,
  'docker': 1,
  'linux-cli': 2,
  'cloud': 1,
  'ci-cd': 1,
  'communication': 3,
  'teamwork': 4,
  'problem-solving': 3,
  'time-mgmt': 3
};

const INITIAL_CONFIDENCE = {
  'dsa': true,
  'python': true,
  'javascript': true,
  'sql': true,
  'html-css': true,
  'react': true,
  'git-github': true,
  'teamwork': true
};

const UI_SETTINGS_CACHE = 'pr_ui_settings';
const GUEST_STORAGE_KEY = 'pr_guest_workspace';

function getGuestData() {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveGuestData(data) {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

const INITIAL_SNAPSHOTS = [
  {
    id: 'snap-1',
    date: new Date(Date.now() - 14 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: 54,
    roleTitle: 'Software Engineer'
  },
  {
    id: 'snap-2',
    date: new Date(Date.now() - 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: 63,
    roleTitle: 'Software Engineer'
  }
];

function getCachedUISettings() {
  try {
    const raw = localStorage.getItem(UI_SETTINGS_CACHE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setCachedUISettings(settings) {
  try {
    localStorage.setItem(UI_SETTINGS_CACHE, JSON.stringify(settings));
  } catch (e) {}
}

function applyDOMSettings(mode, theme, fontSize, reduceMotion) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Theme & Mode
  root.setAttribute('data-mode', mode || 'light');
  root.setAttribute('data-theme', theme || 'brick-red');
  root.setAttribute('data-font-size', fontSize || 'medium');
  root.setAttribute('data-reduce-motion', String(Boolean(reduceMotion)));

  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Apply cached settings immediately on script evaluation to avoid flash
const cachedUI = getCachedUISettings() || {
  mode: 'light',
  theme: 'brick-red',
  fontSize: 'medium',
  reduceMotion: false
};
applyDOMSettings(cachedUI.mode, cachedUI.theme, cachedUI.fontSize, cachedUI.reduceMotion);

// Debounce timer holders
let skillDebounceTimer = null;
let pendingSkillUpdates = {};
let resumeDebounceTimer = null;
let roleDebounceTimer = null;

export const useAppStore = create((set, get) => ({
  currentUserEmail: 'guest',
  isGuest: false,
  isLoadingData: false,
  isSaving: false,
  lastSavedAt: null,
  error: null,

  // Skill ratings & confidence
  skills: { ...INITIAL_SKILLS },
  confidence: { ...INITIAL_CONFIDENCE },

  // Target Role & Company Mode
  targetRole: 'swe',
  companyMode: 'product',

  // Appearance & Themes
  theme: cachedUI.theme || 'brick-red',
  mode: cachedUI.mode || 'light',
  fontSize: cachedUI.fontSize || 'medium',
  reduceMotion: Boolean(cachedUI.reduceMotion),

  // Roadmap Progress
  roadmapWeeks: 8,
  roadmapHoursPerDay: 3,
  completedTasks: {},
  streak: { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] },

  // Resume Builder Data
  resume: JSON.parse(JSON.stringify(DEFAULT_RESUME)),

  // Report History Snapshots
  reportSnapshots: [ ...INITIAL_SNAPSHOTS ],

  // What-If Simulator Overrides (Transient)
  simulatorOverrides: {},
  isSimulatorActive: false,

  // Save guest state locally to localStorage
  persistGuest: () => {
    if (!get().isGuest) return;
    const s = get();
    saveGuestData({
      skills: s.skills,
      confidence: s.confidence,
      targetRole: s.targetRole,
      companyMode: s.companyMode,
      roadmapWeeks: s.roadmapWeeks,
      roadmapHoursPerDay: s.roadmapHoursPerDay,
      completedTasks: s.completedTasks,
      streak: s.streak,
      resume: s.resume,
      reportSnapshots: s.reportSnapshots
    });
  },

  clearGuestData: () => {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch (e) {}

    const freshGuest = {
      skills: { ...INITIAL_SKILLS },
      confidence: { ...INITIAL_CONFIDENCE },
      targetRole: 'swe',
      companyMode: 'product',
      roadmapWeeks: 8,
      roadmapHoursPerDay: 3,
      completedTasks: {},
      streak: { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] },
      resume: JSON.parse(JSON.stringify(DEFAULT_RESUME)),
      reportSnapshots: [ ...INITIAL_SNAPSHOTS ],
      simulatorOverrides: {},
      isSimulatorActive: false,
      lastSavedAt: 'Reset to Defaults'
    };
    saveGuestData(freshGuest);
    set(freshGuest);
  },

  // Fetch user state from backend or load from guest localStorage
  initUserData: async (userEmail, isGuestMode = false) => {
    const isGuest = Boolean(isGuestMode) || userEmail === 'guest' || userEmail === 'guest@placementradar.local';
    set({ currentUserEmail: userEmail || 'guest', isGuest, isLoadingData: false });

    if (isGuest) {
      const guestSaved = getGuestData();
      if (guestSaved) {
        set({
          skills: guestSaved.skills || { ...INITIAL_SKILLS },
          confidence: guestSaved.confidence || { ...INITIAL_CONFIDENCE },
          targetRole: guestSaved.targetRole || 'swe',
          companyMode: guestSaved.companyMode || 'product',
          roadmapWeeks: guestSaved.roadmapWeeks || 8,
          roadmapHoursPerDay: guestSaved.roadmapHoursPerDay || 3,
          completedTasks: guestSaved.completedTasks || {},
          streak: guestSaved.streak || { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] },
          resume: guestSaved.resume || JSON.parse(JSON.stringify(DEFAULT_RESUME)),
          reportSnapshots: guestSaved.reportSnapshots || [ ...INITIAL_SNAPSHOTS ],
          isLoadingData: false,
          lastSavedAt: 'Local Guest Storage'
        });
      } else {
        const initialGuestData = {
          skills: { ...INITIAL_SKILLS },
          confidence: { ...INITIAL_CONFIDENCE },
          targetRole: 'swe',
          companyMode: 'product',
          roadmapWeeks: 8,
          roadmapHoursPerDay: 3,
          completedTasks: {},
          streak: { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] },
          resume: JSON.parse(JSON.stringify(DEFAULT_RESUME)),
          reportSnapshots: [ ...INITIAL_SNAPSHOTS ]
        };
        saveGuestData(initialGuestData);
        set({
          ...initialGuestData,
          isLoadingData: false,
          lastSavedAt: 'Local Guest Storage'
        });
      }
      return;
    }

    set({ isLoadingData: true });

    try {
      // 1. Fetch skills & confidence
      const skillsPromise = api.get('/skills').catch(() => null);
      // 2. Fetch role & company mode
      const rolePromise = api.get('/role').catch(() => null);
      // 3. Fetch roadmap
      const roadmapPromise = api.get('/roadmap').catch(() => null);
      // 4. Fetch resume
      const resumePromise = api.get('/resume').catch(() => null);
      // 5. Fetch history snapshots
      const historyPromise = api.get('/analysis/history').catch(() => null);
      // 6. Fetch user profile for theme settings
      const mePromise = api.get('/auth/me').catch(() => null);

      const [skillsRes, roleRes, roadmapRes, resumeRes, historyRes, meRes] = await Promise.all([
        skillsPromise,
        rolePromise,
        roadmapPromise,
        resumePromise,
        historyPromise,
        mePromise
      ]);

      const stateUpdates = {};

      if (skillsRes?.data?.success && skillsRes.data.data) {
        const { ratings, confidence } = skillsRes.data.data;
        if (ratings && Object.keys(ratings).length > 0) {
          stateUpdates.skills = { ...INITIAL_SKILLS, ...ratings };
        }
        if (confidence) {
          stateUpdates.confidence = { ...confidence };
        }
      }

      if (roleRes?.data?.success && roleRes.data.data) {
        stateUpdates.targetRole = roleRes.data.data.targetRole || 'swe';
        stateUpdates.companyMode = roleRes.data.data.companyMode || 'product';
      }

      if (roadmapRes?.data?.success && roadmapRes.data.data) {
        const rm = roadmapRes.data.data;
        stateUpdates.roadmapWeeks = rm.durationWeeks || 8;
        stateUpdates.roadmapHoursPerDay = rm.hoursPerDay || 3;
        
        const completed = {};
        if (Array.isArray(rm.weeks)) {
          rm.weeks.forEach(w => {
            if (Array.isArray(w.tasks)) {
              w.tasks.forEach(t => {
                completed[t.id] = Boolean(t.done);
              });
            }
          });
        }
        stateUpdates.completedTasks = completed;
        stateUpdates.streak = {
          count: rm.streakCurrent || 1,
          longest: rm.streakLongest || 1,
          lastActiveDate: rm.lastActiveDate || new Date().toISOString().split('T')[0]
        };
      }

      if (resumeRes?.data?.success && resumeRes.data.data) {
        stateUpdates.resume = resumeRes.data.data;
      }

      if (historyRes?.data?.success && Array.isArray(historyRes.data.data)) {
        stateUpdates.reportSnapshots = historyRes.data.data.map(snap => ({
          id: snap.id,
          date: snap.date,
          score: snap.readinessScore,
          roleTitle: snap.role
        }));
      }

      if (meRes?.data?.success && meRes.data.data) {
        const u = meRes.data.data;
        const theme = u.accent ? (u.accent.includes('-') ? u.accent : `${u.accent}-red`) : 'brick-red';
        const mode = u.mode || 'light';
        const fontSize = u.fontScale > 105 ? 'large' : (u.fontScale < 95 ? 'small' : 'medium');
        const reduceMotion = Boolean(u.reduceMotion);

        stateUpdates.theme = theme;
        stateUpdates.mode = mode;
        stateUpdates.fontSize = fontSize;
        stateUpdates.reduceMotion = reduceMotion;

        setCachedUISettings({ mode, theme, fontSize, reduceMotion });
        applyDOMSettings(mode, theme, fontSize, reduceMotion);
      }

      set({
        ...stateUpdates,
        isLoadingData: false,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err) {
      console.warn('Backend load failed, running with initial local state', err);
      set({ isLoadingData: false });
    }
  },

  // Skill management with optimistic updates & debounced sync
  setSkill: (skillId, level) => {
    const numLevel = Math.max(0, Math.min(5, Number(level)));
    set((state) => ({
      skills: { ...state.skills, [skillId]: numLevel },
      isSaving: true
    }));

    if (get().isGuest) {
      get().persistGuest();
      set({
        isSaving: false,
        lastSavedAt: 'Local Guest Storage'
      });
      return;
    }

    pendingSkillUpdates[skillId] = {
      level: numLevel,
      liveConfidence: Boolean(get().confidence[skillId])
    };

    if (skillDebounceTimer) clearTimeout(skillDebounceTimer);
    skillDebounceTimer = setTimeout(async () => {
      const updatesToSend = { ...pendingSkillUpdates };
      pendingSkillUpdates = {};
      try {
        await api.put(`/skills/${skillId}`, {
          level: numLevel,
          liveConfidence: Boolean(get().confidence[skillId])
        });
        set({
          isSaving: false,
          lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      } catch (err) {
        console.error('Failed to save skill rating', err);
        set({ isSaving: false });
      }
    }, 400);
  },

  setConfidence: (skillId, isConfident) => {
    const confident = Boolean(isConfident);
    set((state) => ({
      confidence: { ...state.confidence, [skillId]: confident },
      isSaving: true
    }));

    if (get().isGuest) {
      get().persistGuest();
      set({
        isSaving: false,
        lastSavedAt: 'Local Guest Storage'
      });
      return;
    }

    if (skillDebounceTimer) clearTimeout(skillDebounceTimer);
    skillDebounceTimer = setTimeout(async () => {
      try {
        await api.put(`/skills/${skillId}`, {
          level: Number(get().skills[skillId]) || 0,
          liveConfidence: confident
        });
        set({
          isSaving: false,
          lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      } catch (err) {
        console.error('Failed to save confidence', err);
        set({ isSaving: false });
      }
    }, 400);
  },

  resetAllSkills: async () => {
    const reset = {};
    SKILLS.forEach(s => { reset[s.id] = 0; });
    set({ skills: reset, confidence: {}, isSaving: true });

    if (get().isGuest) {
      get().persistGuest();
      set({
        isSaving: false,
        lastSavedAt: 'Local Guest Storage'
      });
      return;
    }

    try {
      await api.delete('/skills');
      set({
        isSaving: false,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err) {
      console.error('Reset skills failed on backend', err);
      set({ isSaving: false });
    }
  },

  // Role & Company Mode
  setTargetRole: (roleId) => {
    set({ targetRole: roleId, isSaving: true });

    if (get().isGuest) {
      get().persistGuest();
      set({
        isSaving: false,
        lastSavedAt: 'Local Guest Storage'
      });
      return;
    }

    if (roleDebounceTimer) clearTimeout(roleDebounceTimer);
    roleDebounceTimer = setTimeout(async () => {
      try {
        await api.put('/role', {
          targetRole: roleId,
          companyMode: get().companyMode
        });
        set({
          isSaving: false,
          lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      } catch (err) {
        console.error('Failed to save target role', err);
        set({ isSaving: false });
      }
    }, 300);
  },

  setCompanyMode: (mode) => {
    set({ companyMode: mode, isSaving: true });

    if (get().isGuest) {
      get().persistGuest();
      set({
        isSaving: false,
        lastSavedAt: 'Local Guest Storage'
      });
      return;
    }

    if (roleDebounceTimer) clearTimeout(roleDebounceTimer);
    roleDebounceTimer = setTimeout(async () => {
      try {
        await api.put('/role', {
          targetRole: get().targetRole,
          companyMode: mode
        });
        set({
          isSaving: false,
          lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      } catch (err) {
        console.error('Failed to save company mode', err);
        set({ isSaving: false });
      }
    }, 300);
  },

  // Themes & Preferences
  setTheme: (theme) => {
    set({ theme });
    const s = get();
    applyDOMSettings(s.mode, theme, s.fontSize, s.reduceMotion);
    setCachedUISettings({ mode: s.mode, theme, fontSize: s.fontSize, reduceMotion: s.reduceMotion });

    // Sync to backend settings
    api.patch('/users/settings', { accent: theme }).catch(() => {});
  },

  toggleDarkMode: () => {
    const newMode = get().mode === 'dark' ? 'light' : 'dark';
    set({ mode: newMode });
    const s = get();
    applyDOMSettings(newMode, s.theme, s.fontSize, s.reduceMotion);
    setCachedUISettings({ mode: newMode, theme: s.theme, fontSize: s.fontSize, reduceMotion: s.reduceMotion });

    api.patch('/users/settings', { mode: newMode }).catch(() => {});
  },

  setFontSize: (fontSize) => {
    set({ fontSize });
    const s = get();
    applyDOMSettings(s.mode, s.theme, fontSize, s.reduceMotion);
    setCachedUISettings({ mode: s.mode, theme: s.theme, fontSize, reduceMotion: s.reduceMotion });

    const fontScale = fontSize === 'large' ? 115 : (fontSize === 'small' ? 90 : 100);
    api.patch('/users/settings', { fontScale }).catch(() => {});
  },

  setReduceMotion: (reduceMotion) => {
    const rm = Boolean(reduceMotion);
    set({ reduceMotion: rm });
    const s = get();
    applyDOMSettings(s.mode, s.theme, s.fontSize, rm);
    setCachedUISettings({ mode: s.mode, theme: s.theme, fontSize: s.fontSize, reduceMotion: rm });

    api.patch('/users/settings', { reduceMotion: rm }).catch(() => {});
  },

  // Roadmap actions
  setRoadmapConfig: async (weeks, hoursPerDay) => {
    set({
      roadmapWeeks: weeks,
      roadmapHoursPerDay: hoursPerDay,
      isSaving: true
    });

    if (get().isGuest) {
      get().persistGuest();
      set({
        isSaving: false,
        lastSavedAt: 'Local Guest Storage'
      });
      return;
    }

    try {
      await api.patch('/roadmap/settings', {
        durationWeeks: weeks,
        hoursPerDay
      });
      set({
        isSaving: false,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err) {
      set({ isSaving: false });
    }
  },

  generateRoadmap: async (weeks, hoursPerDay) => {
    set({ isSaving: true });

    if (get().isGuest) {
      get().persistGuest();
      set({ isSaving: false });
      return;
    }

    try {
      const res = await api.post('/roadmap/generate', {
        durationWeeks: weeks || get().roadmapWeeks,
        hoursPerDay: hoursPerDay || get().roadmapHoursPerDay
      });
      if (res.data?.success && res.data.data) {
        const rm = res.data.data;
        const completed = {};
        if (Array.isArray(rm.weeks)) {
          rm.weeks.forEach(w => {
            if (Array.isArray(w.tasks)) {
              w.tasks.forEach(t => {
                completed[t.id] = Boolean(t.done);
              });
            }
          });
        }
        set({
          roadmapWeeks: rm.durationWeeks,
          roadmapHoursPerDay: rm.hoursPerDay,
          completedTasks: completed,
          streak: {
            count: rm.streakCurrent,
            longest: rm.streakLongest,
            lastActiveDate: rm.lastActiveDate
          },
          isSaving: false
        });
      }
      return res.data?.data;
    } catch (err) {
      set({ isSaving: false });
      throw err;
    }
  },

  toggleTask: (taskId) => {
    const isNowDone = !get().completedTasks[taskId];

    // Optimistic toggle
    set((state) => ({
      completedTasks: {
        ...state.completedTasks,
        [taskId]: isNowDone
      }
    }));

    // Local streak update fallback
    get().updateStreak();

    if (get().isGuest) {
      get().persistGuest();
      return;
    }

    // Async backend toggle
    api.patch(`/roadmap/tasks/${taskId}`, { done: isNowDone })
      .then((res) => {
        if (res.data?.success && res.data?.data?.streak) {
          const { streak } = res.data.data;
          set({
            streak: {
              count: streak.current,
              longest: streak.longest,
              lastActiveDate: streak.lastActiveDate
            }
          });
        }
      })
      .catch((err) => {
        console.error('Failed to sync task toggle', err);
      });
  },

  updateStreak: () => {
    const today = new Date().toISOString().split('T')[0];
    const { streak } = get();

    if (streak.lastActiveDate === today) return;

    const last = new Date(streak.lastActiveDate);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

    let newCount = 1;
    if (diffDays === 1) {
      newCount = (streak.count || 0) + 1;
    }

    set({ streak: { count: newCount, lastActiveDate: today } });
    if (get().isGuest) {
      get().persistGuest();
    }
  },

  // Resume builder actions with debounced autosave
  updateResume: (newResumeData) => {
    set({ resume: newResumeData, isSaving: true });

    if (get().isGuest) {
      get().persistGuest();
      set({
        isSaving: false,
        lastSavedAt: 'Local Guest Storage'
      });
      return;
    }

    if (resumeDebounceTimer) clearTimeout(resumeDebounceTimer);
    resumeDebounceTimer = setTimeout(async () => {
      try {
        await api.put('/resume', newResumeData);
        set({
          isSaving: false,
          lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      } catch (err) {
        console.error('Failed to save resume', err);
        set({ isSaving: false });
      }
    }, 500);
  },

  syncSkillsToResume: async () => {
    if (get().isGuest) {
      const { skills, resume } = get();
      const highSkills = SKILLS
        .filter(s => (skills[s.id] || 0) >= 3)
        .map(s => s.name);

      const merged = Array.from(new Set([...highSkills, ...(resume.skills || [])]));
      const updatedResume = { ...resume, skills: merged };
      set({ resume: updatedResume });
      get().persistGuest();
      return merged;
    }

    try {
      const res = await api.post('/resume/sync-skills', { minLevel: 3 });
      if (res.data?.success && res.data.data) {
        set({ resume: res.data.data });
        return res.data.data.skills;
      }
    } catch (err) {
      // Local fallback
      const { skills, resume } = get();
      const highSkills = SKILLS
        .filter(s => (skills[s.id] || 0) >= 3)
        .map(s => s.name);

      const merged = Array.from(new Set([...highSkills, ...(resume.skills || [])]));
      const updatedResume = { ...resume, skills: merged };
      set({ resume: updatedResume });
      return merged;
    }
  },

  // Simulator for Radar Page
  setSimulatorOverride: (skillId, val) => {
    set((state) => ({
      isSimulatorActive: true,
      simulatorOverrides: {
        ...state.simulatorOverrides,
        [skillId]: Number(val)
      }
    }));
  },

  resetSimulator: () => {
    set({ simulatorOverrides: {}, isSimulatorActive: false });
  },

  applySimulatorToRealSkills: async () => {
    const { skills, simulatorOverrides, confidence } = get();
    const updated = { ...skills, ...simulatorOverrides };
    set({ skills: updated, simulatorOverrides: {}, isSimulatorActive: false, isSaving: true });

    if (get().isGuest) {
      get().persistGuest();
      set({
        isSaving: false,
        lastSavedAt: 'Local Guest Storage'
      });
      return;
    }

    try {
      // Bulk update skills on backend
      const ratingsArray = Object.entries(updated).map(([skillId, level]) => ({
        skillId,
        level: Number(level),
        liveConfidence: Boolean(confidence[skillId])
      }));

      await api.put('/skills/bulk', { ratings: ratingsArray });
      set({
        isSaving: false,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err) {
      console.error('Failed to save simulated skills', err);
      set({ isSaving: false });
    }
  },

  // Report snapshot
  recordReportSnapshot: async () => {
    if (get().isGuest) {
      const { skills, confidence, targetRole, companyMode, reportSnapshots } = get();
      const match = calculateRoleMatch(skills, confidence, targetRole, companyMode);
      const roleObj = ROLES.find(r => r.id === targetRole) || ROLES[0];

      const newSnapshot = {
        id: `snap_${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: match.readinessScore,
        roleTitle: roleObj.title
      };

      set({ reportSnapshots: [...reportSnapshots, newSnapshot] });
      get().persistGuest();
      return;
    }
    try {
      const res = await api.post('/analysis/snapshot');
      if (res.data?.success && res.data.data) {
        const snap = res.data.data;
        set((state) => ({
          reportSnapshots: [
            ...state.reportSnapshots.filter(s => s.date !== snap.date),
            {
              id: snap.id,
              date: snap.date,
              score: snap.readinessScore,
              roleTitle: snap.role
            }
          ]
        }));
      }
    } catch (err) {
      // Local fallback
      const { skills, confidence, targetRole, companyMode, reportSnapshots } = get();
      const match = calculateRoleMatch(skills, confidence, targetRole, companyMode);
      const roleObj = ROLES.find(r => r.id === targetRole) || ROLES[0];

      const newSnapshot = {
        id: `snap_${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: match.readinessScore,
        roleTitle: roleObj.title
      };

      set({ reportSnapshots: [...reportSnapshots, newSnapshot] });
    }
  },

  // Export / Import
  exportAllData: async () => {
    try {
      const res = await api.get('/users/export');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend export failed, falling back to local snapshot', err);
    }

    const s = get();
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      userEmail: s.currentUserEmail,
      skills: s.skills,
      confidence: s.confidence,
      targetRole: s.targetRole,
      companyMode: s.companyMode,
      theme: s.theme,
      mode: s.mode,
      fontSize: s.fontSize,
      reduceMotion: s.reduceMotion,
      roadmapWeeks: s.roadmapWeeks,
      roadmapHoursPerDay: s.roadmapHoursPerDay,
      completedTasks: s.completedTasks,
      streak: s.streak,
      resume: s.resume,
      reportSnapshots: s.reportSnapshots
    };
  },

  importAllData: async (jsonData) => {
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Invalid JSON data format');
    }

    try {
      const res = await api.post('/users/import', jsonData);
      if (res.data?.success) {
        await get().initUserData(get().currentUserEmail);
        return true;
      }
    } catch (err) {
      console.warn('Backend import failed, applying locally', err);
    }

    set({
      skills: jsonData.skills || { ...INITIAL_SKILLS },
      confidence: jsonData.confidence || {},
      targetRole: jsonData.targetRole || 'swe',
      companyMode: jsonData.companyMode || 'product',
      theme: jsonData.theme || 'brick-red',
      mode: jsonData.mode || 'light',
      fontSize: jsonData.fontSize || 'medium',
      reduceMotion: Boolean(jsonData.reduceMotion),
      roadmapWeeks: jsonData.roadmapWeeks || 8,
      roadmapHoursPerDay: jsonData.roadmapHoursPerDay || 3,
      completedTasks: jsonData.completedTasks || {},
      streak: jsonData.streak || { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] },
      resume: jsonData.resume || JSON.parse(JSON.stringify(DEFAULT_RESUME)),
      reportSnapshots: jsonData.reportSnapshots || []
    });

    applyDOMSettings(
      jsonData.mode || 'light',
      jsonData.theme || 'brick-red',
      jsonData.fontSize || 'medium',
      Boolean(jsonData.reduceMotion)
    );
    return true;
  }
}));

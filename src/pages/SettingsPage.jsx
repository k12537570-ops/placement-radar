import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Lock,
  Palette,
  Database,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Sun,
  Moon,
  Type,
  Activity,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';

const ACCENT_THEMES = [
  { id: 'brick-red', name: 'Brick Red', hex: '#C8442B' },
  { id: 'ocean-blue', name: 'Ocean Blue', hex: '#1D63B8' },
  { id: 'forest-green', name: 'Forest Green', hex: '#2D6A4F' },
  { id: 'royal-purple', name: 'Royal Purple', hex: '#6D28D9' },
  { id: 'sunset-orange', name: 'Sunset Orange', hex: '#D95D28' },
  { id: 'slate-mono', name: 'Slate Mono', hex: '#334155' }
];

export default function SettingsPage() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuthStore();
  const {
    theme,
    mode,
    fontSize,
    reduceMotion,
    setTheme,
    toggleDarkMode,
    setFontSize,
    setReduceMotion,
    exportAllData,
    importAllData,
    clearGuestData
  } = useAppStore();

  const { addToast } = useToastStore();
  const navigate = useNavigate();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [gradYear, setGradYear] = useState(user?.gradYear || '2026');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Delete Confirm Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Hidden file input for import
  const fileInputRef = useRef(null);

  // Profile update submit
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, college, gradYear });
    addToast('Profile updated successfully!', 'success');
  };

  // Password update submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      addToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.error || 'Failed to change password.');
    }
  };

  // Export JSON handler
  const handleExportJSON = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `placement-radar-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('Backup JSON exported successfully!', 'success');
    } catch (err) {
      addToast('Failed to export backup.', 'error');
    }
  };

  // Import JSON handler
  const handleImportFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        await importAllData(parsed);
        addToast('Data successfully imported and synchronized!', 'success');
      } catch (err) {
        addToast('Failed to parse backup JSON. Invalid file format.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Delete Account / Reset Guest Data
  const handleDeleteAccount = async () => {
    if (user?.isGuest) {
      clearGuestData();
      setShowDeleteModal(false);
      addToast('Guest workspace data has been reset to defaults!', 'info');
      navigate('/dashboard');
    } else {
      await deleteAccount();
      setShowDeleteModal(false);
      addToast('Account and data deleted.', 'info');
      navigate('/login');
    }
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <PageHeader
        stepLabel="STUDIO SETTINGS"
        title="Settings & Preferences"
        subtitle="Manage your profile, visual theme swatches, password, and export your entire studio workspace as JSON."
        handwrittenNote="make it your own!"
      />

      {/* Guest Mode Banner */}
      {user?.isGuest && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-card border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 shadow-xs">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">You are exploring in Guest Mode</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wide rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  pr_guest_workspace
                </span>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
                Visual themes, font sizes, and local workspace exports are fully functional. Password management and permanent cloud sync require a free registered account.
              </p>
            </div>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-accent text-accent-contrast hover:bg-accent-hover shadow-xs transition-colors shrink-0"
          >
            <span>Create a Free Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Theme & Appearance Section */}
      <section className="p-6 rounded-card bg-bg-card border border-border shadow-card space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border">
          <Palette className="w-5 h-5 text-accent" />
          <h3 className="font-serif font-bold text-lg text-text">
            Appearance & Visual Theme
          </h3>
        </div>

        {/* Light / Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-text uppercase tracking-wider">
              Display Mode
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Choose between warm cream light mode and deep contrast dark mode.
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-bg hover:bg-bg-hover text-xs font-medium text-text transition-all"
          >
            {mode === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-text-muted" />
                <span>Switch to Dark</span>
              </>
            )}
          </button>
        </div>

        {/* 6 Accent Themes */}
        <div>
          <div className="text-xs font-semibold text-text uppercase tracking-wider mb-1">
            Accent Color Swatch
          </div>
          <p className="text-xs text-text-muted mb-3">
            Applies to buttons, slider thumbs, charts, and resume headers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ACCENT_THEMES.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-accent bg-accent-light shadow-xs ring-1 ring-accent'
                      : 'border-border bg-bg hover:border-text-subtle'
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-full shadow-xs"
                    style={{ backgroundColor: t.hex }}
                  />
                  <span className="font-medium text-xs text-text truncate">
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size & Motion Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/60">
          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
              Base Font Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`py-1.5 text-xs font-mono capitalize rounded-lg border transition-all ${
                    fontSize === size
                      ? 'border-accent bg-accent-light text-accent font-bold'
                      : 'border-border bg-bg text-text-muted hover:text-text'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1">
              Accessibility
            </label>
            <label className="flex items-center gap-3 p-2 rounded-lg border border-border bg-bg cursor-pointer">
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent w-4 h-4"
              />
              <span className="text-xs text-text">
                Reduce animations & transitions
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="p-6 rounded-card bg-bg-card border border-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-lg text-text">
              Student Profile Details
            </h3>
          </div>
          {user?.isGuest && (
            <span className="text-xs font-mono font-medium text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-800">
              Guest Session Profile
            </span>
          )}
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-bg text-text"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-bg-secondary text-text-subtle font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-bg text-text"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Graduation Year
              </label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-bg text-text"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </section>

      {/* Change Password Section */}
      {!user?.isGuest && (
        <section className="p-6 rounded-card bg-bg-card border border-border shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border">
            <Lock className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-lg text-text">
              Change Password
            </h3>
          </div>

          {passwordError && (
            <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-lg">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full p-2.5 text-xs rounded-lg border border-border bg-bg text-text"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  required
                  className="w-full p-2.5 text-xs rounded-lg border border-border bg-bg text-text"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full p-2.5 text-xs rounded-lg border border-border bg-bg text-text"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Workspace Data Management (Export & Import JSON) */}
      <section className="p-6 rounded-card bg-bg-card border border-border shadow-card space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border">
          <Database className="w-5 h-5 text-accent" />
          <h3 className="font-serif font-bold text-lg text-text">
            Workspace Data & Portability
          </h3>
        </div>

        <p className="text-xs text-text-muted leading-relaxed">
          Export your entire studio state (ratings, resume, target role, roadmap progress, and snapshot history) into a portable JSON file. You can import this backup on another computer or browser anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg border border-border text-xs font-semibold text-text hover:bg-bg-hover transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-accent" />
            <span>Export All Data (JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg border border-border text-xs font-semibold text-text hover:bg-bg-hover transition-all shadow-xs"
          >
            <Upload className="w-4 h-4 text-accent" />
            <span>Import Workspace Backup</span>
          </button>
        </div>
      </section>

      {/* Danger Zone: Delete Account or Reset Guest Workspace */}
      <section className="p-6 rounded-card bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-sm text-red-600 dark:text-red-400">
              {user?.isGuest ? 'Reset Guest Workspace Data' : 'Delete Account & Workspace'}
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              {user?.isGuest
                ? 'Permanently clear all guest session skills, custom ratings, and local simulations from this browser.'
                : "Permanently purge your account credentials and calibrated data from this browser's localStorage."}
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3.5 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shrink-0"
          >
            {user?.isGuest ? 'Reset Guest Data' : 'Delete Account'}
          </button>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-md w-full bg-bg-card p-6 rounded-card border border-border shadow-modal space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-text">
                {user?.isGuest ? 'Reset guest workspace data?' : 'Permanently delete account?'}
              </h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {user?.isGuest
                ? 'This will reset all your guest skills, mock assessments, resume edits, and roadmaps back to baseline defaults. Are you sure?'
                : 'This will remove all your data, skill ratings, resumes, and study progress from your browser. Are you absolutely sure?'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3.5 py-2 rounded-lg border border-border text-xs font-medium text-text hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                {user?.isGuest ? 'Yes, Reset Workspace' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

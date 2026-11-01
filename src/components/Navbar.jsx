import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Sliders,
  Target,
  PieChart,
  ShieldCheck,
  Video,
  Map,
  FileText,
  Award,
  Sun,
  Moon,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { ROLES } from '../data/roles';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { mode, toggleDarkMode, targetRole } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = ROLES.find((r) => r.id === targetRole) || ROLES[0];

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/skills', label: 'Skills', icon: Sliders },
    { to: '/role', label: 'Role', icon: Target },
    { to: '/radar', label: 'Radar', icon: PieChart },
    { to: '/verify', label: 'Verify', icon: ShieldCheck },
    { to: '/interview', label: 'Interview', icon: Video },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/resume', label: 'Resume', icon: FileText },
    { to: '/report', label: 'Report', icon: Award }
  ];

  const handleLogout = () => {
    const message = user?.isGuest
      ? 'Exit Guest Mode? Your local progress will be preserved in this browser.'
      : 'Are you sure you want to log out?';

    if (window.confirm(message)) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-bg/95 backdrop-blur-md border-b border-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Compass Logo & Brand */}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-1 shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-accent-light flex items-center justify-center text-accent shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="hidden sm:block">
              <div className="font-serif font-bold text-base leading-tight tracking-tight text-text">
                PLACEMENT RADAR
              </div>
              <div className="font-mono text-[8px] uppercase tracking-widest text-text-muted font-semibold">
                Readiness & Gap Studio
              </div>
            </div>
          </NavLink>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                      isActive
                        ? 'bg-accent-light text-accent font-semibold shadow-xs'
                        : 'text-text-muted hover:text-text hover:bg-bg-hover'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Medium Screens (MD to XL): Dropdown / Compact Nav */}
          <nav className="hidden md:flex xl:hidden items-center gap-1">
            {navLinks.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                      isActive
                        ? 'bg-accent-light text-accent font-semibold shadow-xs'
                        : 'text-text-muted hover:text-text hover:bg-bg-hover'
                    }`
                  }
                  title={item.label}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-2 py-1.5 text-xs text-text-muted hover:text-text rounded-lg border border-border"
            >
              More...
            </button>
          </nav>

          {/* Right: Guest Badge, Role Badge, Theme Toggle, Settings, Logout */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Guest Mode Indicator & Create Account CTA */}
            {user?.isGuest && (
              <div className="flex items-center gap-1.5 mr-1">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Guest Mode</span>
                </span>
                <NavLink
                  to="/signup"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent text-accent-contrast hover:bg-accent-hover shadow-xs transition-transform"
                >
                  <span>Create Account</span>
                </NavLink>
              </div>
            )}

            {/* Target Role Badge */}
            <NavLink
              to="/role"
              title="Click to change target role"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:scale-105 transition-transform"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate max-w-[120px]">{currentRole.title}</span>
            </NavLink>

            {/* Dark Mode Quick Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 text-text-muted hover:text-text hover:bg-bg-hover rounded-lg transition-colors"
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {mode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-text-muted" />
              )}
            </button>

            {/* Settings Gear */}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'text-accent bg-accent-light'
                    : 'text-text-muted hover:text-text hover:bg-bg-hover'
                }`
              }
              aria-label="Settings"
              title="Studio Settings"
            >
              <Settings className="w-4 h-4" />
            </NavLink>

            {/* Logout / Exit Guest */}
            <button
              onClick={handleLogout}
              className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              aria-label={user?.isGuest ? 'Exit Guest Mode' : 'Sign out'}
              title={user?.isGuest ? 'Exit Guest Mode' : `Sign out (${user?.name || 'User'})`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-text-muted hover:text-text rounded-lg"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-muted hover:text-text rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-bg-card px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-text">{currentRole.title}</span>
            </div>
            <span className="text-xs font-mono text-text-subtle">{user?.email}</span>
          </div>

          {user?.isGuest && (
            <div className="p-2.5 mb-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Guest Mode</span>
              </div>
              <NavLink
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-accent hover:underline"
              >
                Create Account →
              </NavLink>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive
                        ? 'bg-accent-light text-accent font-semibold'
                        : 'text-text-muted hover:bg-bg-hover hover:text-text'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <NavLink
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs text-text-muted hover:text-text py-2 px-1"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 py-2 px-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

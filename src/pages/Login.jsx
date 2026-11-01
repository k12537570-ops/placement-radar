import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState('');

  const { login, loginAsGuest, isLoading, error, clearError } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!email.trim() || !password) {
      setValidationError('Please enter both your email and password.');
      return;
    }

    const res = await login({ email, password, rememberMe });
    if (res.success) {
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      navigate('/skills');
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    addToast('Welcome! Exploring Placement Radar in Guest Mode.', 'info');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Left Branding Split */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-bg-secondary border-r border-border p-12 flex-col justify-between overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C8442B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-accent shadow-sm">
              <Compass className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif font-bold text-2xl tracking-tight text-text">
                PLACEMENT RADAR
              </span>
              <p className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                Readiness & Gap Studio
              </p>
            </div>
          </div>
        </div>

        {/* Center: Animated Mini Radar SVG Visualization */}
        <div className="relative z-10 flex flex-col items-center my-8">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Concentric radar rings */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" className="text-border" strokeWidth="1" />
              <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="15" y1="100" x2="185" y2="100" stroke="currentColor" className="text-border/70" strokeWidth="1" />
              <line x1="100" y1="15" x2="100" y2="185" stroke="currentColor" className="text-border/70" strokeWidth="1" />
              <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" className="text-border/40" strokeWidth="1" />
              <line x1="40" y1="160" x2="160" y2="40" stroke="currentColor" className="text-border/40" strokeWidth="1" />

              {/* Target Role Shape (dashed complement) */}
              <polygon
                points="100,25 165,55 170,140 100,175 35,135 40,60"
                fill="none"
                stroke="#66615B"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-60"
              />

              {/* User Dynamic Polygon (Accent colored) */}
              <polygon
                points="100,45 155,75 145,130 100,150 50,120 60,70"
                fill="var(--color-accent)"
                fillOpacity="0.25"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                className="animate-pulse"
              />

              {/* Central Pulsing Beacon */}
              <circle cx="100" cy="100" r="4" fill="var(--color-accent)" />
            </svg>

            {/* Sweep radar arm simulation */}
            <div className="absolute inset-0 rounded-full border border-accent/20 pointer-events-none animate-spin [animation-duration:10s]">
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-accent transform origin-right translate-y-36" />
            </div>
          </div>

          <p className="mt-4 font-handwriting text-2xl text-accent font-bold transform -rotate-2">
            "Stop guessing your placement readiness. Measure it."
          </p>
        </div>

        {/* Bottom Feature Highlights */}
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-text-muted">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Calibrate 30 skills against 10 industry roles with dynamic Company Modes.</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-text-muted">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Auto-generated weekly roadmap with free resources & real-time ATS resume analyzer.</span>
          </div>
        </div>
      </div>

      {/* Right Form Split */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center text-accent">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-serif font-bold text-lg text-text">PLACEMENT RADAR</span>
            </div>

            <h2 className="font-serif text-3xl font-bold text-text">Welcome back</h2>
            <p className="mt-2 text-sm text-text-muted">
              Sign in to resume your skill calibration and learning roadmap.
            </p>
          </div>

          {(error || validationError) && (
            <div className="p-3.5 rounded-card bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs leading-relaxed">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-subtle"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-subtle"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-text-subtle hover:text-text p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent w-4 h-4"
                />
                <span>Remember me</span>
              </label>
              <span className="text-xs text-text-subtle">Local Demo Session</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-accent-contrast font-medium text-sm hover:bg-accent-hover active:scale-[0.99] transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest One-Click Button */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg px-2 text-text-subtle font-mono">or explore first</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-bg-card hover:bg-bg-hover text-text font-medium text-sm transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Continue as Guest</span>
            </button>
            <p className="text-[11px] text-text-subtle text-center mt-2 font-mono">
              Explore Placement Radar without creating an account.
            </p>
          </div>

          <div className="text-center text-xs text-text-muted pt-2">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-accent font-semibold hover:underline">
              Sign up for free
            </Link>
          </div>

          <div className="pt-4 text-center">
            <span className="text-[11px] font-mono text-text-subtle">
              Demo Auth (localStorage + SHA-256 WebCrypto) • No backend needed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


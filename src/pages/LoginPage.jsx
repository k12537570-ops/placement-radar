import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { loginUser, loginAsGuest } from '../utils/auth';
import { Compass, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, showToast } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser({ email, password });
      setUser(user);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/skills');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guest = loginAsGuest();
    setUser(guest);
    showToast('Logged in as Guest Explorer', 'info');
    navigate('/skills');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row text-text selection:bg-accent-light selection:text-accent">
      
      {/* Left Branding Panel */}
      <div className="md:w-5/12 bg-bg-secondary p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border relative overflow-hidden">
        
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/5 pointer-events-none blur-2xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent/5 pointer-events-none blur-2xl" />

        {/* Brand header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent-light border border-accent/20 flex items-center justify-center text-accent shadow-sm">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl tracking-tight text-text">
                PLACEMENT RADAR
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                READINESS & GAP STUDIO
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-1 rounded-md">
              CAMPUS HIRING BENCHMARK
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-text leading-tight">
              Calibrate your skills.<br />
              Target top roles.<br />
              Bridge the gaps.
            </h2>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm pt-2">
              An evidence-based readiness studio that maps student competencies against realistic engineering hiring bars.
            </p>
          </div>
        </div>

        {/* Animated Mini Radar SVG Graphic */}
        <div className="my-8 flex justify-center items-center relative z-10">
          <div className="w-64 h-64 relative flex items-center justify-center">
            {/* Concentric radar circles */}
            <svg className="w-full h-full text-border" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
              
              {/* Radial crosshairs */}
              <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />

              {/* Dynamic polygon representing calibrated student skills */}
              <polygon
                points="100,35 155,75 140,150 70,160 45,90"
                className="fill-accent/20 stroke-accent"
                strokeWidth="2"
              />
              {/* Radar sweep beam animation */}
              <line
                x1="100"
                y1="100"
                x2="180"
                y2="50"
                className="stroke-accent/60"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-mono text-[10px] text-accent font-semibold bg-bg-card/90 px-2 py-0.5 rounded-full border border-border shadow-xs">
                RADAR ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-text-muted space-y-1">
          <div className="flex items-center gap-1.5 text-text-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero paid APIs. 100% in-browser client persistence.</span>
          </div>
          <p className="text-[11px] text-text-subtle font-mono">
            Demo auth mode: Passwords securely hashed with browser SubtleCrypto SHA-256.
          </p>
        </div>

      </div>

      {/* Right Login Form Card */}
      <div className="md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-20">
        <div className="w-full max-w-md bg-bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-card">
          
          <div className="mb-6">
            <span className="font-handwriting text-accent text-xl block -rotate-2">
              welcome back!
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text mt-1">
              Sign in to your Studio
            </h2>
            <p className="text-text-muted text-xs sm:text-sm mt-1">
              Access your skill calibration, target roles, and personalized roadmaps.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium dark:bg-red-950/40 dark:text-red-300 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.chen@university.edu"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-text uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent accent-accent"
                />
                <span className="text-text-muted">Remember my session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Guest Access */}
          <div className="mt-6 pt-6 border-t border-border">
            <button
              onClick={handleGuestLogin}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl border border-border hover:bg-bg-hover text-text text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Continue as Guest (Instant Demo)</span>
            </button>
            <p className="text-[11px] text-text-subtle text-center mt-2 font-mono">
              Preloads sample engineering ratings for instant exploration.
            </p>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center text-xs text-text-muted">
            Don't have a studio account?{' '}
            <Link to="/signup" className="text-accent font-semibold hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

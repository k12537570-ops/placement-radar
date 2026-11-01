import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, Lock, Mail, User, GraduationCap, Building2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gradYear, setGradYear] = useState('2026');
  const [college, setCollege] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { signup, continueAsGuest, isLoading, error, clearError } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    continueAsGuest();
    addToast('Exploring Placement Radar in Guest Mode.', 'info');
    navigate('/dashboard');
  };

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-transparent' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: '', color: 'bg-transparent' };
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please re-enter.');
      return;
    }

    const res = await signup({
      name,
      email,
      password,
      gradYear,
      college
    });

    if (res.success) {
      addToast('Account created successfully! Welcome to Placement Radar.', 'success');
      navigate('/skills');
    }
  };

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Left Split Branding */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-bg-secondary border-r border-border p-12 flex-col justify-between overflow-hidden">
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

        <div className="relative z-10 my-auto py-12">
          <h2 className="font-serif text-3xl font-bold text-text leading-tight mb-4">
            Build your competitive edge for campus placements.
          </h2>
          <p className="text-text-muted text-sm leading-relaxed mb-6">
            Calibrate your skills across 30 technical and behavioral competencies. Compare against real hiring benchmarks, spot critical deficits, and turn them into strengths.
          </p>

          <div className="space-y-4 font-mono text-xs text-text-subtle">
            <div className="p-4 rounded-xl bg-bg-card border border-border shadow-xs">
              <div className="font-semibold text-text mb-1">✓ Isolated Per-User Storage</div>
              <div>Your calibrations and notes are stored exclusively under your local account key.</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-card border border-border shadow-xs">
              <div className="font-semibold text-text mb-1">✓ Privacy First & Free</div>
              <div>Runs 100% in your browser. Passwords hashed client-side with WebCrypto SHA-256.</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-text-subtle font-mono">
          © {new Date().getFullYear()} Placement Radar Studio
        </div>
      </div>

      {/* Right Form Split */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          <div>
            <div className="lg:hidden flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center text-accent">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-serif font-bold text-lg text-text">PLACEMENT RADAR</span>
            </div>

            <h2 className="font-serif text-3xl font-bold text-text">Create your account</h2>
            <p className="mt-1 text-sm text-text-muted">
              Start your free skill calibration in under 2 minutes.
            </p>
          </div>

          {(error || validationError) && (
            <div className="p-3.5 rounded-card bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs leading-relaxed">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                Full Name <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                Email Address <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.vance@campus.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* College & Grad Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Graduation Year
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026 (Upcoming)</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  College / Institute (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. NIT / IIT / State Univ"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-text-subtle hover:text-text p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-text-subtle">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-text">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                Confirm Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-accent-contrast font-medium text-sm hover:bg-accent-hover active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account & Start</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest One-Click Button */}
          <div className="relative my-2">
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
              onClick={handleContinueAsGuest}
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
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


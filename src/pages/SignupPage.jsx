import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { registerUser } from '../utils/auth';
import { Compass, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser, setShowOnboarding, showToast } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gradYear, setGradYear] = useState('2026');
  const [college, setCollege] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Compute password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'None', color: 'bg-border' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-blue-500' };
    return { score: 4, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser({
        name,
        email,
        password,
        gradYear,
        college
      });
      setUser(user);
      setShowOnboarding(true);
      showToast('Account created successfully!', 'success');
      navigate('/skills');
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row text-text selection:bg-accent-light selection:text-accent">
      
      {/* Left Branding Panel */}
      <div className="md:w-5/12 bg-bg-secondary p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border relative overflow-hidden">
        
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
              STUDENT ONBOARDING
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-text leading-tight">
              Start your placement journey with complete clarity.
            </h2>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm pt-2">
              Join thousands of engineering students who use Placement Radar to replace guesswork with structured roadmap milestones.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="my-8 space-y-3 relative z-10">
          <div className="flex items-center gap-3 text-xs text-text">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            <span>Calibrate 30 foundational CS & software engineering skills</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            <span>Benchmark against Service, Product, Startup, & FAANG bars</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            <span>Interactive what-if score simulator & ATS resume builder</span>
          </div>
        </div>

        {/* Security disclaimer */}
        <div className="relative z-10 text-xs text-text-muted space-y-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local demo sandbox. No remote data transmission.</span>
          </div>
        </div>

      </div>

      {/* Right Signup Form Card */}
      <div className="md:w-7/12 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-lg bg-bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-card">
          
          <div className="mb-6">
            <span className="font-handwriting text-accent text-xl block -rotate-2">
              create your account
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-text mt-1">
              Join Placement Radar
            </h2>
            <p className="text-text-muted text-xs sm:text-sm mt-1">
              Set up your profile to start rating skills and tracking roadmaps.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium dark:bg-red-950/40 dark:text-red-300 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                  Target Graduation
                </label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                >
                  <option value="2025">Class of 2025</option>
                  <option value="2026">Class of 2026</option>
                  <option value="2027">Class of 2027</option>
                  <option value="2028">Class of 2028</option>
                  <option value="2029">Class of 2029+</option>
                </select>
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                College / University <span className="text-text-subtle font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Stanford University / IIT Bombay"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
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

              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Password strength meter */}
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-text-muted">Password Strength</span>
                  <span className="font-semibold text-text">{strength.text}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`rounded-full transition-colors ${
                        step <= strength.score ? strength.color : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Signup'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Sign in instead
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Compass,
  Award,
  Target,
  FileText,
  Video,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  Sparkles,
  BookOpen,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';
import { calculateRoleMatch, ROLES, COMPANY_MODES, getAdjustedRequirements } from '../data/roles';
import { SKILLS, SKILL_CATEGORIES } from '../data/skills';
import api from '../services/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    targetRole,
    companyMode,
    skills,
    confidence,
    resume,
    roadmapWeeks,
    completedTasks,
    clearGuestData
  } = useAppStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Compute live local match metrics for guests
  const guestMatch = useMemo(() => {
    return calculateRoleMatch(skills, confidence, targetRole, companyMode);
  }, [skills, confidence, targetRole, companyMode]);

  const currentRole = ROLES.find((r) => r.id === targetRole) || ROLES[0];
  const currentMode = COMPANY_MODES.find((m) => m.id === companyMode) || COMPANY_MODES[0];

  useEffect(() => {
    let isMounted = true;
    async function fetchDashboard() {
      // Guests don't make backend calls
      if (user?.isGuest) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await api.get('/dashboard/overview');
        if (isMounted && res.data?.success && res.data?.data) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch fallback to local state:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDashboard();
    return () => { isMounted = false; };
  }, [user?.isGuest]);

  const handleClearGuest = () => {
    if (window.confirm('Clear all your local guest data and reset to defaults?')) {
      clearGuestData();
      addToast('Guest workspace reset to clean defaults.', 'info');
    }
  };

  // Compute fallback values from store if API is loading or offline
  const totalTasks = Object.keys(completedTasks || {}).length;
  const doneTasks = Object.values(completedTasks || {}).filter(Boolean).length;
  const roadmapPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 25;

  const readinessScore = user?.isGuest ? guestMatch.readinessScore : (dashboardData?.metrics?.readinessScore ?? guestMatch.readinessScore);
  const verdict = user?.isGuest ? guestMatch.verdict : (dashboardData?.metrics?.verdict ?? guestMatch.verdict);
  const atsScore = dashboardData?.metrics?.atsScore ?? (resume ? 74 : null);
  const interviewScore = dashboardData?.metrics?.interviewScore ?? null;
  const verifiedScore = dashboardData?.metrics?.verifiedScore ?? null;
  const jobMatchScore = dashboardData?.metrics?.jobMatchScore ?? null;

  // Radar categories computed live
  const adjustedReqs = useMemo(() => {
    return getAdjustedRequirements(targetRole, companyMode);
  }, [targetRole, companyMode]);

  const liveRadarCategories = useMemo(() => {
    const cats = SKILL_CATEGORIES.filter((c) => c.id !== 'all');
    return cats.map((cat) => {
      const catSkills = SKILLS.filter((s) => s.category === cat.id);
      let userSum = 0;
      let reqSum = 0;
      catSkills.forEach((s) => {
        userSum += Number(skills[s.id]) || 0;
        reqSum += adjustedReqs[s.id]?.level || 0;
      });
      return {
        name: cat.name,
        you: Number((userSum / catSkills.length).toFixed(1)),
        required: Number((reqSum / catSkills.length).toFixed(1))
      };
    });
  }, [skills, adjustedReqs]);

  const radarCategories = user?.isGuest ? liveRadarCategories : (dashboardData?.radarData || liveRadarCategories);

  // Score History
  const historyData = dashboardData?.scoreHistory && dashboardData.scoreHistory.length > 0
    ? dashboardData.scoreHistory
    : [
        { date: 'Oct 15', score: 52 },
        { date: 'Oct 22', score: 58 },
        { date: 'Oct 29', score: 64 },
        { date: 'Today', score: readinessScore }
      ];

  const topGaps = user?.isGuest ? guestMatch.gaps.slice(0, 5) : (dashboardData?.topGaps || guestMatch.gaps.slice(0, 5));
  const strengths = user?.isGuest ? guestMatch.strengths.slice(0, 4) : (dashboardData?.strengths || guestMatch.strengths.slice(0, 4));

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Guest Mode Banner */}
      {user?.isGuest && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-accent/10 to-transparent border border-amber-300/40 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-text">Guest Mode Active</span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Local Browser Storage
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Your calibrations, simulations, and roadmap progress are saved locally in this browser without a database account.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleClearGuest}
              className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-muted hover:text-text hover:bg-bg-hover transition-colors font-medium"
              title="Reset all guest progress"
            >
              Clear Guest Data
            </button>
            <Link
              to="/signup"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover shadow-xs transition-transform"
            >
              <span>Create a Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Top Banner / Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-bg-secondary border border-border p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-md font-semibold ${
                user?.isGuest ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-accent-light text-accent'
              }`}>
                {user?.isGuest ? 'GUEST EXPLORER' : 'EXECUTIVE COCKPIT'}
              </span>
              <span className="text-xs text-text-subtle font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-text tracking-tight">
              Welcome{user?.isGuest ? ', Explorer' : ` back, ${user?.name || 'Candidate'}`}
            </h1>
            <p className="text-sm text-text-muted max-w-xl">
              Placement preparation hub targeting <span className="font-semibold text-text">{currentRole.title}</span> roles under <span className="font-semibold text-text">{currentMode.name}</span> standards.
            </p>
          </div>

          {/* Overall Readiness Score Hero Badge */}
          <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm p-4 rounded-xl border border-border shadow-xs">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-border"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-accent transition-all duration-1000 ease-out"
                  strokeDasharray={`${readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono font-bold text-lg text-text">
                {readinessScore}%
              </span>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-text-subtle font-semibold">Overall Readiness</div>
              <div className="font-serif font-bold text-base text-text">{verdict}</div>
              <Link to="/radar" className="text-xs text-accent font-medium hover:underline flex items-center gap-1 mt-0.5">
                <span>View Gap Matrix</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Key Pillar Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Technical Skills */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-text-subtle font-medium">Technical Radar</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-text">
              {dashboardData?.metrics?.calibratedSkillsCount ?? Object.values(skills || {}).filter(v => v > 0).length} / 30
            </div>
            <div className="text-xs text-text-muted mt-1">Skills Calibrated</div>
          </div>
          <Link to="/skills" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
            <span>Calibrate Skills</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 2: Skill Verification */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-text-subtle font-medium">Skill Verification</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-text">
              {verifiedScore !== null ? `${verifiedScore}%` : 'Unverified'}
            </div>
            <div className="text-xs text-text-muted mt-1">
              {verifiedScore !== null ? 'Verified Benchmark Score' : 'Take a technical test to verify'}
            </div>
          </div>
          <Link to="/verify" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
            <span>Take Test</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 3: ATS Resume Score */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-text-subtle font-medium">Resume ATS Fit</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-text">
              {atsScore !== null ? `${atsScore} / 100` : 'Not Created'}
            </div>
            <div className="text-xs text-text-muted mt-1">
              {jobMatchScore !== null ? `Job Match: ${jobMatchScore}%` : 'ATS Keyword & Format Score'}
            </div>
          </div>
          <Link to="/resume" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
            <span>Analyze Resume</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 4: Mock Interview */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-text-subtle font-medium">Mock Interview</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-text">
              {interviewScore !== null ? `${interviewScore}%` : 'Not Attempted'}
            </div>
            <div className="text-xs text-text-muted mt-1">
              {interviewScore !== null ? 'Latest Technical Round Score' : 'Practice role-specific interview'}
            </div>
          </div>
          <Link to="/interview" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
            <span>Start Interview</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Charts & Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts Radar Chart: You vs Benchmark */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-text">Skill Balance Matrix</h3>
              <p className="text-xs text-text-muted">6 Core axes: Your calibrated command vs Industry requirement</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-accent"></span>
                <span>You</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-border border border-text-subtle"></span>
                <span>Required</span>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarCategories}>
                <PolarGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--color-text)', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar name="You" dataKey="you" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.35} />
                <Radar name="Required" dataKey="required" stroke="#64748b" fill="#64748b" fillOpacity={0.1} strokeDasharray="4 4" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--color-text)'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Target Role: <strong className="text-text">{dashboardData?.user?.targetRole || 'Software Engineer'}</strong></span>
            <Link to="/radar" className="text-accent font-medium hover:underline flex items-center gap-1">
              <span>Detailed Breakdown</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Readiness Velocity Line Chart */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-text">Readiness Velocity</h3>
              <p className="text-xs text-text-muted">Historical readiness score trajectory over recent sessions</p>
            </div>
            <div className="font-mono text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              +16% Growth
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--color-text)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-accent)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-accent)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Sprint Goal: <strong className="text-text">85%+ Placement Ready</strong></span>
            <Link to="/report" className="text-accent font-medium hover:underline flex items-center gap-1">
              <span>View Dossier</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Two-Column: Top Gaps & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Critical Skill Gaps */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-text">Top Identified Deficits</h3>
              <p className="text-xs text-text-muted">Priority skills to bridge before campus technical rounds</p>
            </div>
            <Link to="/roadmap" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
              <span>View Learning Tasks</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {(topGaps.length > 0 ? topGaps : [
              { skillId: 'system-design', name: 'System Design', userLevel: 2, targetLevel: 4, priority: 'Critical' },
              { skillId: 'dsa', name: 'Data Structures & Algorithms', userLevel: 3, targetLevel: 4, priority: 'Critical' },
              { skillId: 'os', name: 'Operating Systems & Concurrency', userLevel: 2, targetLevel: 3, priority: 'High' }
            ]).map((gap, i) => {
              const skillObj = SKILLS.find((s) => s.id === gap.skillId);
              return (
              <div key={gap.skillId || i} className="flex items-center justify-between p-3.5 rounded-xl bg-bg-secondary/60 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-text">{skillObj?.name || gap.name || gap.skillId}</div>
                    <div className="text-xs text-text-muted font-mono">
                      Current: Level {gap.userLevel} / 5 → Target: Level {gap.targetLevel} / 5
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                    gap.priority === 'Critical'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                  }`}>
                    {gap.priority || 'High'}
                  </span>
                  <Link
                    to="/roadmap"
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-bg-hover transition-colors"
                    title="Start learning"
                  >
                    <BookOpen className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Quick Launch & Recent Timeline */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-text mb-1">Quick Action Studio</h3>
            <p className="text-xs text-text-muted mb-4">Fast shortcuts to test your preparation</p>

            <div className="space-y-2.5">
              <Link
                to="/interview"
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg hover:border-accent hover:bg-accent-light/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text group-hover:text-accent">Practice Mock Interview</div>
                    <div className="text-[10px] text-text-muted">Technical & behavioral drills</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/verify"
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg hover:border-accent hover:bg-accent-light/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text group-hover:text-accent">Take Technical Assessment</div>
                    <div className="text-[10px] text-text-muted">Timed role-based MCQs</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/resume"
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg hover:border-accent hover:bg-accent-light/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text group-hover:text-accent">Resume Job Matcher</div>
                    <div className="text-[10px] text-text-muted">Paste job description & test ATS fit</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Roadmap Completion Stat */}
          <div className="p-4 rounded-xl bg-bg-secondary border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text">Roadmap Velocity</span>
              <span className="font-mono text-accent font-bold">{roadmapPct}% Complete</span>
            </div>
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${roadmapPct}%` }}
              />
            </div>
            <div className="text-[11px] text-text-muted flex justify-between items-center pt-1">
              <span>{doneTasks} tasks finished</span>
              <Link to="/roadmap" className="text-accent hover:underline">Continue</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


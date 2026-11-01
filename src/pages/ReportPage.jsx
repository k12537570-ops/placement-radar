import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Printer,
  Copy,
  Calendar,
  Award,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Compass,
  Sparkles,
  Share2,
  ShieldCheck,
  Video,
  FileSearch,
  Layers,
  ExternalLink,
  HelpCircle,
  FileText
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import PageHeader from '../components/PageHeader';
import { SKILLS, SKILL_CATEGORIES } from '../data/skills';
import { ROLES, COMPANY_MODES, getAdjustedRequirements, calculateRoleMatch } from '../data/roles';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';
import api from '../services/api';

export default function ReportPage() {
  const { user } = useAuthStore();
  const {
    skills,
    confidence,
    targetRole,
    companyMode,
    completedTasks,
    streak,
    reportSnapshots,
    recordReportSnapshot
  } = useAppStore();

  const { addToast } = useToastStore();

  const [overview, setOverview] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [latestInterview, setLatestInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentRole = ROLES.find((r) => r.id === targetRole) || ROLES[0];
  const currentMode = COMPANY_MODES.find((m) => m.id === companyMode) || COMPANY_MODES[0];
  const adjustedRequirements = useMemo(() => {
    return getAdjustedRequirements(targetRole, companyMode);
  }, [targetRole, companyMode]);

  const match = useMemo(() => {
    return calculateRoleMatch(skills, confidence, targetRole, companyMode);
  }, [skills, confidence, targetRole, companyMode]);

  // Load backend assessment history
  useEffect(() => {
    async function loadReportData() {
      if (user?.isGuest) {
        setLoading(false);
        return;
      }
      try {
        const [ovRes, verRes, intRes] = await Promise.allSettled([
          api.get('/dashboard/overview'),
          api.get('/verify/history'),
          api.get('/interview/history')
        ]);

        if (ovRes.status === 'fulfilled' && ovRes.value.data?.success) {
          setOverview(ovRes.value.data.data);
        }
        if (verRes.status === 'fulfilled' && verRes.value.data?.success) {
          setVerifications(verRes.value.data.data.verifications || []);
        }
        if (intRes.status === 'fulfilled' && intRes.value.data?.success) {
          const sessions = intRes.value.data.data.sessions || [];
          if (sessions.length > 0) {
            setLatestInterview(sessions[0]);
          }
        }
      } catch (e) {
        console.error('Failed to load assessment report records', e);
      } finally {
        setLoading(false);
      }
    }

    loadReportData();
  }, [user?.isGuest]);

  // Record a snapshot on initial load if none recorded today
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const hasToday = reportSnapshots.some((s) => s.date === today && s.score === match.readinessScore);
    if (!hasToday && reportSnapshots.length < 10) {
      recordReportSnapshot();
    }
  }, []);

  // Category Radar Data
  const radarData = useMemo(() => {
    const cats = SKILL_CATEGORIES.filter((c) => c.id !== 'all');
    return cats.map((cat) => {
      const catSkills = SKILLS.filter((s) => s.category === cat.id);
      let userSum = 0;
      let reqSum = 0;
      catSkills.forEach((s) => {
        userSum += Number(skills[s.id]) || 0;
        reqSum += adjustedRequirements[s.id]?.level || 0;
      });
      return {
        subject: cat.name,
        You: Number((userSum / catSkills.length).toFixed(1)),
        Required: Number((reqSum / catSkills.length).toFixed(1))
      };
    });
  }, [skills, adjustedRequirements]);

  // Assessment topics comparison list
  const assessedTopics = useMemo(() => {
    const coreTopics = [
      { id: 'dsa', name: 'DSA & Algorithms', skillId: 'dsa' },
      { id: 'python', name: 'Python Programming', skillId: 'python' },
      { id: 'java', name: 'Java & Collections', skillId: 'java' },
      { id: 'cpp', name: 'C++ Systems', skillId: 'cpp' },
      { id: 'dbms', name: 'DBMS & SQL', skillId: 'dbms' },
      { id: 'oop', name: 'Object-Oriented Design', skillId: 'oop' },
      { id: 'os', name: 'Operating Systems', skillId: 'os' },
      { id: 'cn', name: 'Computer Networks', skillId: 'cn' },
      { id: 'web', name: 'Web & React.js', skillId: 'react' }
    ];

    return coreTopics.map((t) => {
      const verifiedRecord = verifications.find((v) => v.topic === t.id);
      const userRating = Number(skills[t.skillId]) || 0;
      return {
        ...t,
        userRating,
        isVerified: Boolean(verifiedRecord),
        verifiedScore: verifiedRecord ? verifiedRecord.score : null,
        difficulty: verifiedRecord ? verifiedRecord.difficulty : null,
        passed: verifiedRecord ? verifiedRecord.passed : null,
        date: verifiedRecord ? new Date(verifiedRecord.createdAt).toLocaleDateString() : null
      };
    });
  }, [verifications, skills]);

  // Next 30 Days Action Plan Generator
  const actionPlan = useMemo(() => {
    const top3 = match.gaps.slice(0, 3);
    const plan = [];

    if (top3[0]) {
      const s = SKILLS.find((sk) => sk.id === top3[0].skillId);
      plan.push({
        days: 'Days 1 — 10',
        title: `Bridge Critical Gap: ${s?.name}`,
        detail: `Focus exclusively on core concepts and implement 3 practical drills. Target moving from level ${top3[0].userLevel} to ${top3[0].targetLevel}.`
      });
    }

    if (top3[1]) {
      const s = SKILLS.find((sk) => sk.id === top3[1].skillId);
      plan.push({
        days: 'Days 11 — 20',
        title: `Reinforce Secondary Gap: ${s?.name}`,
        detail: `Study curated free tutorials and practice interview questions under 30-minute timed conditions.`
      });
    }

    if (top3[2]) {
      const s = SKILLS.find((sk) => sk.id === top3[2].skillId);
      plan.push({
        days: 'Days 21 — 27',
        title: `Build Hands-On Feature: ${s?.name}`,
        detail: `Integrate this skill directly into your resume project repo and document the architecture decision in the README.`
      });
    }

    plan.push({
      days: 'Days 28 — 30',
      title: 'Mock Interview & ATS Resume Calibration',
      detail: 'Take a comprehensive technical mock assessment and synchronize your updated ratings to your resume.'
    });

    return plan;
  }, [match.gaps]);

  // Copy shareable summary text to clipboard
  const handleCopySummary = () => {
    const summaryText = `🎯 PLACEMENT RADAR REPORT
Student: ${user?.name || 'Candidate'}
Target Role: ${currentRole.title} (${currentMode.name})
Readiness Score: ${match.readinessScore}/100 [${match.verdict}]
Strengths: ${match.strengths.slice(0, 3).map((s) => SKILLS.find((sk) => sk.id === s.skillId)?.name).join(', ')}
Top Priority Gaps: ${match.gaps.slice(0, 3).map((g) => `${SKILLS.find((sk) => sk.id === g.skillId)?.name} (-${g.rawGap})`).join(', ')}
Study Streak: ${streak.count} Days active
Generated via Placement Radar Studio`;

    navigator.clipboard.writeText(summaryText);
    addToast('Shareable summary copied to clipboard!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pb-24">
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: #fff !important; color: #111 !important; }
          .no-print { display: none !important; }
          .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
          .print-border { border: 1px solid #e2e8f0 !important; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print">
        <PageHeader
          stepLabel="REPORT"
          title="Placement Readiness Dossier"
          subtitle="Comprehensive executive evaluation of technical competencies, skill verification assessments, mock interviews, ATS resume compatibility, and 30-day action plan."
          handwrittenNote="track your growth!"
          actions={
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium text-text hover:bg-bg-hover transition-colors"
                title="Copy markdown text summary"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Summary</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover shadow-sm active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Main Printable Report Sheet */}
      <div className="bg-bg-card rounded-card border border-border shadow-card p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center font-bold">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-serif font-bold text-xl text-text">
                PLACEMENT READINESS DOSSIER
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Candidate: <strong className="text-text">{user?.name || 'Alex Vance'}</strong> •{' '}
              {user?.college || 'Engineering Institute'} • Class of {user?.gradYear || '2026'}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-text-subtle">
            <div>Target: <strong className="text-text">{currentRole.title}</strong></div>
            <div>Benchmark: {currentMode.name}</div>
            <div className="text-[11px] mt-0.5">
              Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Readiness Overview: Gauge & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center print-avoid-break">
          {/* Big Score Box (5 cols) */}
          <div className="md:col-span-5 p-6 rounded-2xl bg-bg-secondary/60 border border-border/80 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs uppercase tracking-wider text-text-subtle font-semibold mb-2">
              Overall Placement Readiness
            </span>
            <div className="font-mono text-5xl sm:text-6xl font-black text-text tracking-tight my-2">
              {match.readinessScore}
              <span className="text-xl font-normal text-text-subtle">/100</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 ${match.verdictBadge}`}>
              {match.verdict}
            </span>
            <p className="text-xs text-text-muted mt-3 max-w-xs leading-relaxed">
              {match.verdictDesc}
            </p>
          </div>

          {/* Quick Metrics (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-bg border border-border">
              <div className="font-mono text-xs text-text-subtle uppercase">Target Role Demand</div>
              <div className="font-bold text-base text-text mt-1">{currentRole.marketDemand}</div>
              <div className="text-[11px] text-text-muted mt-1">{currentRole.salaryRange}</div>
            </div>

            <div className="p-4 rounded-xl bg-bg border border-border">
              <div className="font-mono text-xs text-text-subtle uppercase">Sprint Streak</div>
              <div className="font-bold text-base text-text mt-1 flex items-center gap-1.5">
                <span>{streak.count} Days Active</span>
                <span className="text-xs">🔥</span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">Consistent practice</div>
            </div>

            <div className="p-4 rounded-xl bg-bg border border-border">
              <div className="font-mono text-xs text-text-subtle uppercase">Critical Gaps</div>
              <div className="font-mono font-bold text-base text-red-600 mt-1">
                {match.criticalGaps} Skills
              </div>
              <div className="text-[11px] text-text-muted mt-1">Requires immediate drill</div>
            </div>

            <div className="p-4 rounded-xl bg-bg border border-border">
              <div className="font-mono text-xs text-text-subtle uppercase">Target Strengths</div>
              <div className="font-mono font-bold text-base text-emerald-600 mt-1">
                {match.strengths.length} Skills
              </div>
              <div className="text-[11px] text-text-muted mt-1">Meets or beats rubric</div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Verified Technical Assessment & Calibration */}
        <div className="pt-6 border-t border-border print-avoid-break">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h3 className="font-serif font-bold text-base text-text">
                Technical Skill Verification Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-text-subtle">
              Self-Assessed Level vs Timed Code Quiz Verification
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-secondary text-text-subtle font-mono text-[11px] uppercase tracking-wider border-y border-border">
                <tr>
                  <th className="py-2.5 px-3">Subject / Topic</th>
                  <th className="py-2.5 px-3 text-center">Self Rating</th>
                  <th className="py-2.5 px-3 text-center">Verified Score</th>
                  <th className="py-2.5 px-3">Test Difficulty</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Verification Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {assessedTopics.map((top) => (
                  <tr key={top.id} className="hover:bg-bg-hover transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-text">
                      {top.name}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-text">
                      {top.userRating > 0 ? `Lvl ${top.userRating}/5` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      {top.isVerified ? (
                        <span className={top.verifiedScore >= 70 ? 'text-emerald-600' : 'text-amber-600'}>
                          {top.verifiedScore}%
                        </span>
                      ) : (
                        <span className="text-text-subtle font-normal italic">Not yet assessed</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] capitalize text-text-muted">
                      {top.difficulty || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {top.isVerified ? (
                        top.passed ? (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                            Review Needed
                          </span>
                        )
                      ) : (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-text-subtle">
                          Pending Assessment
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[11px] text-text-subtle">
                      {top.date || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Mock Interview & ATS Alignment 2-Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border print-avoid-break">
          {/* Left: Mock Interview Diagnostic */}
          <div className="p-5 rounded-card bg-bg border border-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-accent" />
                  <h4 className="font-serif font-bold text-sm text-text">
                    Mock Interview Assessment
                  </h4>
                </div>
                {latestInterview ? (
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {latestInterview.overallScore}% Score
                  </span>
                ) : (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-text-subtle">
                    Not yet attempted
                  </span>
                )}
              </div>

              {latestInterview ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-text-muted">Target Role Tested:</span>
                    <span className="font-semibold text-text">{latestInterview.roleTitle}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-text-muted">Session Difficulty:</span>
                    <span className="font-mono capitalize text-text">{latestInterview.difficulty}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-text-muted">Interviewer Verdict:</span>
                    <span className="font-semibold text-emerald-600">{latestInterview.verdict}</span>
                  </div>
                  {latestInterview.weakTopics && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono uppercase text-text-subtle block mb-1">
                        Diagnosed Weak Areas:
                      </span>
                      <p className="text-[11px] text-text-muted bg-bg-card p-2 rounded border border-border">
                        {Array.isArray(latestInterview.weakTopics)
                          ? latestInterview.weakTopics.join(', ')
                          : latestInterview.weakTopics}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-text-muted mb-3">
                    No technical mock interview completed yet. Practice written technical questions evaluated on Relevance, Correctness, and Completeness.
                  </p>
                  <Link
                    to="/interview"
                    className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent text-accent-contrast hover:bg-accent-hover"
                  >
                    <span>Start Mock Interview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: ATS Resume & Job Match Diagnostic */}
          <div className="p-5 rounded-card bg-bg border border-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-accent" />
                  <h4 className="font-serif font-bold text-sm text-text">
                    ATS Resume & Job Match Alignment
                  </h4>
                </div>
                {overview?.metrics?.atsScore ? (
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {overview.metrics.atsScore}/100 ATS
                  </span>
                ) : (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-text-subtle">
                    Pending Analysis
                  </span>
                )}
              </div>

              {overview?.metrics?.atsScore ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-text-muted">Resume ATS Score:</span>
                    <span className="font-mono font-bold text-text">{overview.metrics.atsScore}/100</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-text-muted">Target Job Match:</span>
                    <span className="font-mono font-bold text-accent">
                      {overview.metrics.jobMatchScore ? `${overview.metrics.jobMatchScore}% Match` : 'Not tested yet'}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted pt-2 leading-relaxed">
                    Resume structured for automated ATS scanners with action-driven bullet phrasing and quantifiable impact statements.
                  </p>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-text-muted mb-3">
                    Upload your PDF/Text resume or paste a job description to calculate keyword match density and ATS parseability.
                  </p>
                  <Link
                    to="/resume"
                    className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent text-accent-contrast hover:bg-accent-hover"
                  >
                    <span>Run ATS Resume Analyzer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: Radar & Gap Matrix Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-border print-avoid-break">
          {/* Radar Chart (6 cols) */}
          <div className="md:col-span-6">
            <h3 className="font-serif font-bold text-base text-text mb-3">
              Competency Radar Distribution
            </h3>
            <div className="w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text)', fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={false} />
                  <Radar name="Required" dataKey="Required" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} strokeDasharray="3 3" />
                  <Radar name="You" dataKey="You" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Deficits (6 cols) */}
          <div className="md:col-span-6 space-y-3">
            <h3 className="font-serif font-bold text-base text-text">
              Primary Skill Deficits
            </h3>
            <div className="space-y-2">
              {match.gaps.slice(0, 5).map((gap) => {
                const s = SKILLS.find((sk) => sk.id === gap.skillId);
                return (
                  <div
                    key={gap.skillId}
                    className="p-2.5 rounded-lg bg-bg border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-text">{s?.name}</span>
                      <span className="text-[10px] text-text-subtle ml-2">({s?.categoryName})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-red-600 font-bold">-{gap.rawGap} Lvl</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        gap.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 5: Auto-Generated Next 30 Days Action Plan */}
        <div className="pt-6 border-t border-border print-avoid-break">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-serif font-bold text-base text-text">
              Auto-Generated Next 30 Days Action Plan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actionPlan.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-bg border border-border/80 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded uppercase">
                    {step.days}
                  </span>
                  <h4 className="font-semibold text-xs text-text mt-2 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Progress History Line Chart */}
        <div className="pt-6 border-t border-border no-print">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h3 className="font-serif font-bold text-base text-text">
                Readiness Score Velocity Over Time
              </h3>
            </div>
            <span className="text-xs font-mono text-text-subtle">
              {reportSnapshots.length} Snapshots Logged
            </span>
          </div>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportSnapshots} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-subtle)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
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
        </div>
      </div>
    </div>
  );
}

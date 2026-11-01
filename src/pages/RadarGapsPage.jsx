import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ROLES_DATA, COMPANY_MODES } from '../data/roles';
import { SKILLS_DATA } from '../data/skills';
import {
  calculateReadinessScore,
  getScoreVerdict,
  getCategoryRadarData,
  getSkillsRadarData,
  calculateSkillGaps,
  identifyStrengths
} from '../utils/scoring';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  Radar as RadarIcon,
  Sliders,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  RotateCcw,
  Check,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function RadarGapsPage() {
  const navigate = useNavigate();
  const {
    skills,
    setSkillLevel,
    confidenceChecks,
    targetRoleId,
    companyModeId,
    showToast
  } = useAppStore();

  const [radarView, setRadarView] = useState('category'); // 'category' | 'skills'

  // What-if simulator state (temporary clone of skills)
  const [simulatorSkills, setSimulatorSkills] = useState({ ...skills });
  const [simulatorActive, setSimulatorActive] = useState(false);

  const currentRole = ROLES_DATA.find((r) => r.id === targetRoleId) || ROLES_DATA[0];
  const activeCompanyMode = COMPANY_MODES.find((m) => m.id === companyModeId) || COMPANY_MODES[0];

  // Active skills set for calculations (either simulator or real)
  const activeSkillsForCalc = simulatorActive ? simulatorSkills : skills;

  // Readiness Score
  const score = useMemo(() => {
    return calculateReadinessScore(activeSkillsForCalc, targetRoleId, companyModeId, confidenceChecks);
  }, [activeSkillsForCalc, targetRoleId, companyModeId, confidenceChecks]);

  const baseScore = useMemo(() => {
    return calculateReadinessScore(skills, targetRoleId, companyModeId, confidenceChecks);
  }, [skills, targetRoleId, companyModeId, confidenceChecks]);

  const verdict = getScoreVerdict(score);

  // Radar chart data
  const radarData = useMemo(() => {
    return radarView === 'category'
      ? getCategoryRadarData(activeSkillsForCalc, targetRoleId, companyModeId)
      : getSkillsRadarData(activeSkillsForCalc, targetRoleId, companyModeId);
  }, [radarView, activeSkillsForCalc, targetRoleId, companyModeId]);

  // Skill gaps
  const gaps = useMemo(() => {
    return calculateSkillGaps(activeSkillsForCalc, targetRoleId, companyModeId);
  }, [activeSkillsForCalc, targetRoleId, companyModeId]);

  // Strengths
  const strengths = useMemo(() => {
    return identifyStrengths(activeSkillsForCalc, targetRoleId, companyModeId);
  }, [activeSkillsForCalc, targetRoleId, companyModeId]);

  // Top 5 gaps
  const topGaps = useMemo(() => {
    return gaps.filter((g) => g.gap > 0).slice(0, 5);
  }, [gaps]);

  // Calibrated count
  const calibratedCount = useMemo(() => {
    return Object.values(skills).filter((lvl) => Number(lvl) > 0).length;
  }, [skills]);

  // Handle simulator slider
  const handleSimulatorSlider = (skillId, val) => {
    setSimulatorActive(true);
    setSimulatorSkills((prev) => ({
      ...prev,
      [skillId]: Number(val)
    }));
  };

  const handleApplySimulator = () => {
    Object.entries(simulatorSkills).forEach(([sid, lvl]) => {
      setSkillLevel(sid, lvl);
    });
    setSimulatorActive(false);
    showToast('Simulated skills applied permanently to your profile!', 'success');
  };

  const handleResetSimulator = () => {
    setSimulatorSkills({ ...skills });
    setSimulatorActive(false);
  };

  // Empty state if nothing calibrated
  if (calibratedCount === 0) {
    return (
      <div className="min-h-screen bg-bg text-text max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-bg-card border border-border rounded-2xl p-12 shadow-card">
          <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold text-text">No Skills Calibrated Yet</h2>
          <p className="text-text-muted text-sm mt-2 max-w-md mx-auto">
            You haven't calibrated any of your 30 skills. Return to Step 1 to rate your abilities before generating radar gap analysis.
          </p>
          <button
            onClick={() => navigate('/skills')}
            className="mt-6 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors inline-flex items-center gap-2"
          >
            <span>Go to Step 1: Calibrate Skills</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Circular gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-bg text-text pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Block with Step, Serif Title & Handwritten Note */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase bg-accent-light px-2.5 py-1 rounded-md">
                STEP 3 OF 3
              </span>
              <span className="font-mono text-xs text-text-muted">
                GAP & READINESS STUDIO
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text">
                Radar & Gap Analysis
              </h1>
              <span className="font-handwriting text-accent text-2xl -rotate-2 select-none">
                see the full picture!
              </span>
            </div>

            <p className="text-text-muted text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Evaluating your calibrated skills against <strong className="text-text font-semibold">{currentRole.name}</strong> ({activeCompanyMode.name} bar).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/role')}
              className="px-3.5 py-2.5 rounded-xl border border-border hover:bg-bg-hover text-xs font-medium text-text-muted transition-colors flex items-center gap-1.5"
            >
              <span>Change Role</span>
            </button>

            <button
              onClick={() => navigate('/roadmap')}
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              <span>Generate Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Split: Circular Gauge & Recharts Radar Chart */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Readiness Score Circular Gauge Card (4 cols) */}
          <div className="lg:col-span-5 bg-bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted">
                  OVERALL READINESS
                </span>
                <span
                  className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${verdict.badgeClass}`}
                >
                  {verdict.text}
                </span>
              </div>

              {/* Animated Circular Gauge */}
              <div className="flex flex-col items-center justify-center my-4">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-border"
                    />
                    {/* Progress arc */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={verdict.color}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  
                  {/* Inner text score */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-text">
                      {score}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted uppercase tracking-widest mt-0.5">
                      OUT OF 100
                    </span>
                  </div>
                </div>

                {simulatorActive && (
                  <div className="mt-2 text-xs font-mono text-accent bg-accent-light px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulated: {score > baseScore ? `+${score - baseScore} points` : `${score - baseScore} points`}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-text-muted text-center leading-relaxed max-w-xs mx-auto mt-2">
                {verdict.description}
              </p>
            </div>

            {/* Quick summary metrics */}
            <div className="mt-6 pt-5 border-t border-border grid grid-cols-2 gap-3 text-center">
              <div className="bg-bg-secondary p-3 rounded-xl">
                <span className="font-mono text-[10px] text-text-subtle uppercase block">
                  Identified Strengths
                </span>
                <span className="font-serif text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {strengths.length}
                </span>
              </div>
              <div className="bg-bg-secondary p-3 rounded-xl">
                <span className="font-mono text-[10px] text-text-subtle uppercase block">
                  Critical Gaps
                </span>
                <span className="font-serif text-xl font-bold text-accent">
                  {topGaps.length}
                </span>
              </div>
            </div>

          </div>

          {/* Recharts Interactive Radar Chart (7 cols) */}
          <div className="lg:col-span-7 bg-bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted">
                  COMPETENCY OVERLAY
                </span>
                <h3 className="font-serif text-xl font-bold text-text">
                  You vs. Role Benchmark
                </h3>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-bg-secondary p-1 rounded-xl text-xs font-mono">
                <button
                  onClick={() => setRadarView('category')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    radarView === 'category'
                      ? 'bg-bg-card text-accent font-semibold shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  6 Core Axes
                </button>
                <button
                  onClick={() => setRadarView('skills')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    radarView === 'skills'
                      ? 'bg-bg-card text-accent font-semibold shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  Top Skills
                </button>
              </div>
            </div>

            {/* Radar chart container */}
            <div className="w-full h-72 sm:h-80 my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'var(--color-text)', fontSize: 11, fontFamily: 'Inter' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 5]}
                    tick={{ fill: 'var(--color-text-subtle)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  />
                  <Radar
                    name="Your Level"
                    dataKey="You"
                    stroke="var(--color-accent)"
                    fill="var(--color-accent)"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Required Benchmark"
                    dataKey="Required"
                    stroke="#2563EB"
                    fill="#2563EB"
                    fillOpacity={0.15}
                    strokeDasharray="4 4"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: 'var(--color-text)'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border">
              <span>Scale: 0 (None) to 5 (Expert)</span>
              <span className="font-mono text-accent">■ You | ■ Required</span>
            </div>
          </div>

        </div>

        {/* Strengths & Top 5 Gaps Two-Column Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths Card */}
          <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-subtle">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif text-xl font-bold text-text">
                Your Competitive Strengths
              </h3>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Areas where your proficiency already meets or exceeds the {activeCompanyMode.name} hiring standard.
            </p>

            {strengths.length === 0 ? (
              <p className="text-xs text-text-subtle py-4 text-center">
                No skills currently match the required level for this role tier.
              </p>
            ) : (
              <div className="space-y-2.5">
                {strengths.slice(0, 5).map((s) => (
                  <div
                    key={s.skillId}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50"
                  >
                    <div>
                      <div className="font-serif font-bold text-sm text-text">
                        {s.name}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                        {s.category}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        Level {s.userLevel} / {s.requiredLevel}
                      </span>
                      {s.surplus > 0 && (
                        <span className="block text-[10px] font-mono text-emerald-600">
                          +{s.surplus} above bar
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top 5 Critical Gaps Card */}
          <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-subtle">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-accent" />
              <h3 className="font-serif text-xl font-bold text-text">
                Top 5 Priority Gaps
              </h3>
            </div>
            <p className="text-xs text-text-muted mb-4">
              The highest-weighted bottlenecks directly lowering your placement probability.
            </p>

            <div className="space-y-2.5">
              {topGaps.map((g) => (
                <div
                  key={g.skillId}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-bg border border-border hover:border-accent/40 transition-colors"
                >
                  <div>
                    <div className="font-serif font-bold text-sm text-text">
                      {g.name}
                    </div>
                    <span className="text-[10px] font-mono text-text-muted">
                      {g.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        g.priority === 'Critical'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                          : g.priority === 'High'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}
                    >
                      {g.priority}
                    </span>
                    <span className="text-xs font-mono font-bold text-accent">
                      -{g.gap} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* UNIQUE: "What-If Simulator" Card */}
        <div className="mt-10 bg-bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  WHAT-IF SIMULATOR
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-text mt-1">
                Simulate Your Skill Upgrades
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Slide skills to test how studying specific topics raises your readiness score live without modifying your permanent ratings.
              </p>
            </div>

            {simulatorActive && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSimulator}
                  className="px-3.5 py-2 rounded-xl border border-border hover:bg-bg-hover text-xs font-medium text-text-muted transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Simulation</span>
                </button>
                <button
                  onClick={handleApplySimulator}
                  className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Profile</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Simulation Sliders for Top Gaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topGaps.map((gapItem) => {
              const currentSimLevel = Number(simulatorSkills[gapItem.skillId] || 0);
              return (
                <div key={gapItem.skillId} className="p-4 rounded-xl bg-bg border border-border space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-sm text-text">
                      {gapItem.name}
                    </span>
                    <span className="font-mono text-xs text-accent font-bold">
                      {currentSimLevel} / {gapItem.requiredLevel} req
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={currentSimLevel}
                    onChange={(e) => handleSimulatorSlider(gapItem.skillId, e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-text-subtle">
                    <span>None (0)</span>
                    <span>Expert (5)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complete Gap Breakdown Table */}
        <div className="mt-10 bg-bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-text">
                Full Role Gap Ledger
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Detailed comparison for all skills demanded by {currentRole.name}.
              </p>
            </div>
            <span className="font-mono text-xs text-text-subtle">
              Sorted by weighted gap
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-secondary text-text-muted font-mono uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Skill</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Your Level</th>
                  <th className="py-3 px-4 text-center">Required ({activeCompanyMode.name})</th>
                  <th className="py-3 px-4 text-center">Gap</th>
                  <th className="py-3 px-4 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {gaps.map((row) => (
                  <tr key={row.skillId} className="hover:bg-bg-hover/50 transition-colors">
                    <td className="py-3 px-4 font-serif font-bold text-sm text-text">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-text-muted">
                      {row.category}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">
                      {row.userLevel} / 5
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-text-muted">
                      {row.requiredLevel} / 5
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {row.gap > 0 ? (
                        <span className="text-accent">-{row.gap}</span>
                      ) : (
                        <span className="text-emerald-600">✓ Met</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          row.priority === 'Critical'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                            : row.priority === 'High'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : row.priority === 'Medium'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {row.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

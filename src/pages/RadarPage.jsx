import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  PieChart,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle,
  AlertOctagon,
  AlertTriangle,
  Award,
  Sliders,
  Check,
  Search,
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { SKILLS, SKILL_CATEGORIES } from '../data/skills';
import { ROLES, COMPANY_MODES, getAdjustedRequirements, calculateRoleMatch } from '../data/roles';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';

export default function RadarPage() {
  const [radarView, setRadarView] = useState('category'); // 'category' | 'comparison' | 'skills'
  const [tableSearch, setTableSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const {
    skills,
    confidence,
    targetRole,
    companyMode,
    simulatorOverrides,
    isSimulatorActive,
    setSimulatorOverride,
    resetSimulator,
    applySimulatorToRealSkills
  } = useAppStore();

  const { addToast } = useToastStore();
  const navigate = useNavigate();

  // Active role and requirements
  const currentRole = ROLES.find((r) => r.id === targetRole) || ROLES[0];
  const currentMode = COMPANY_MODES.find((m) => m.id === companyMode) || COMPANY_MODES[0];
  const adjustedRequirements = useMemo(() => {
    return getAdjustedRequirements(targetRole, companyMode);
  }, [targetRole, companyMode]);

  // Combined effective skills (with what-if simulator overrides)
  const effectiveSkills = useMemo(() => {
    return { ...skills, ...simulatorOverrides };
  }, [skills, simulatorOverrides]);

  // Baseline Match without simulator (Actual Readiness)
  const baseMatch = useMemo(() => {
    return calculateRoleMatch(skills, confidence, targetRole, companyMode);
  }, [skills, confidence, targetRole, companyMode]);

  // Simulated Match (Simulated Readiness)
  const currentMatch = useMemo(() => {
    return calculateRoleMatch(effectiveSkills, confidence, targetRole, companyMode);
  }, [effectiveSkills, confidence, targetRole, companyMode]);

  const scoreDelta = currentMatch.readinessScore - baseMatch.readinessScore;

  // Highest Potential Impact Skills calculation
  const highestImpactSkills = useMemo(() => {
    if (!baseMatch.gaps || baseMatch.gaps.length === 0) return [];

    const impacts = baseMatch.gaps.map((gap) => {
      const simulatedSingle = { ...skills, [gap.skillId]: gap.targetLevel };
      const simulatedResult = calculateRoleMatch(simulatedSingle, confidence, targetRole, companyMode);
      const gain = simulatedResult.readinessScore - baseMatch.readinessScore;
      const skillObj = SKILLS.find((s) => s.id === gap.skillId);
      return {
        skillId: gap.skillId,
        skillName: skillObj?.name || gap.skillId,
        categoryName: skillObj?.categoryName || '',
        currentLevel: gap.userLevel,
        targetLevel: gap.targetLevel,
        priority: gap.priority,
        gain: Math.max(gain, 1)
      };
    });

    return impacts.sort((a, b) => b.gain - a.gain).slice(0, 4);
  }, [baseMatch.gaps, skills, confidence, targetRole, companyMode]);

  // Total calibrated count
  const calibratedCount = Object.values(skills).filter((v) => Number(v) > 0).length;

  // Radar Data - Category View (6 axes) with Actual, Simulated, Required
  const categoryRadarData = useMemo(() => {
    const cats = SKILL_CATEGORIES.filter((c) => c.id !== 'all');
    return cats.map((cat) => {
      const catSkills = SKILLS.filter((s) => s.category === cat.id);
      
      let baseUserSum = 0;
      let simUserSum = 0;
      let reqSum = 0;
      let count = catSkills.length;

      catSkills.forEach((s) => {
        baseUserSum += Number(skills[s.id]) || 0;
        simUserSum += Number(effectiveSkills[s.id]) || 0;
        reqSum += adjustedRequirements[s.id]?.level || 0;
      });

      return {
        subject: cat.name,
        Actual: Number((baseUserSum / count).toFixed(1)),
        Simulated: Number((simUserSum / count).toFixed(1)),
        Required: Number((reqSum / count).toFixed(1)),
        fullMark: 5
      };
    });
  }, [skills, effectiveSkills, adjustedRequirements]);

  // Radar Data - Top 8 Skills View for the Role
  const skillsRadarData = useMemo(() => {
    const roleReqEntries = Object.entries(adjustedRequirements)
      .filter(([_, req]) => req.level > 0)
      .sort((a, b) => b[1].level - a[1].level)
      .slice(0, 8);

    return roleReqEntries.map(([skillId, req]) => {
      const skillObj = SKILLS.find((s) => s.id === skillId);
      return {
        subject: skillObj ? skillObj.name : skillId,
        Actual: Number(skills[skillId]) || 0,
        Simulated: Number(effectiveSkills[skillId]) || 0,
        Required: req.level,
        fullMark: 5
      };
    });
  }, [skills, effectiveSkills, adjustedRequirements]);

  // Filtered Gaps Table
  const filteredGaps = useMemo(() => {
    return currentMatch.gaps.filter((gap) => {
      const skillObj = SKILLS.find((s) => s.id === gap.skillId);
      const matchesSearch =
        skillObj?.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        skillObj?.categoryName.toLowerCase().includes(tableSearch.toLowerCase());
      const matchesPriority =
        priorityFilter === 'all' || gap.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesPriority;
    });
  }, [currentMatch.gaps, tableSearch, priorityFilter]);

  // Top 5 critical gaps for simulator
  const topGapsForSimulator = useMemo(() => {
    return baseMatch.gaps.slice(0, 5);
  }, [baseMatch.gaps]);

  const handleApplySimulator = () => {
    applySimulatorToRealSkills();
    addToast('Simulated skills applied to your permanent ratings!', 'success');
  };

  const handleSimulateUpgrade = (skillId, targetLevel, skillName) => {
    setSimulatorOverride(skillId, targetLevel);
    addToast(`Simulated: ${skillName} upgraded to Level ${targetLevel}`, 'info');
  };

  // Circular gauge SVG parameters
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (currentMatch.readinessScore / 100) * circumference;

  // Empty state if nothing calibrated
  if (calibratedCount === 0) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto bg-bg-card rounded-card border border-border p-8 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-accent-light text-accent flex items-center justify-center mx-auto mb-4">
          <PieChart className="w-8 h-8 stroke-[2]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-text mb-2">
          No skills calibrated yet
        </h2>
        <p className="text-sm text-text-muted mb-6 leading-relaxed">
          To generate your technical radar chart and identify placement gaps, you need to calibrate your skills first.
        </p>
        <Link
          to="/skills"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-contrast font-medium text-sm hover:bg-accent-hover shadow-sm"
        >
          <span>Go to Step 1: Calibrate Skills</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <PageHeader
        step="3"
        stepTotal={3}
        stepLabel="ANALYSIS"
        title="Readiness Radar & Skill Deficits"
        subtitle={`Benchmarked for ${currentRole.title} (${currentMode.name}). Identify priority blindspots and test score trajectories with the What-if simulator.`}
        handwrittenNote="know your blindspots!"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/roadmap')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover shadow-sm active:scale-95 transition-all"
            >
              <span>Next: Study Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Top Split: Circular Readiness Gauge & Recharts Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left: Readiness Score Gauge (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-card bg-bg-card border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-text-subtle font-semibold">
                {isSimulatorActive ? 'Simulated vs Actual Readiness' : 'Overall Placement Readiness'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${currentMatch.verdictBadge}`}>
                {currentMatch.verdict}
              </span>
            </div>

            {/* Circular Gauge Graphic */}
            <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-border"
                  fill="transparent"
                />
                {/* Actual Baseline Ring (Dotted or faded if simulator active) */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={isSimulatorActive ? 'var(--color-border)' : 'var(--color-accent)'}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (baseMatch.readinessScore / 100) * circumference}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                  fill="transparent"
                />
                {/* Simulated Progress Ring (only when active) */}
                {isSimulatorActive && (
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="var(--color-accent)"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                    fill="transparent"
                  />
                )}
              </svg>

              {/* Central Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-text tracking-tight">
                  {currentMatch.readinessScore}
                </span>
                <span className="font-mono text-[10px] text-text-subtle uppercase">
                  {isSimulatorActive ? 'Simulated / 100' : 'Score / 100'}
                </span>
              </div>
            </div>

            {/* Actual vs Simulated Comparison Pills */}
            {isSimulatorActive ? (
              <div className="flex items-center justify-center gap-3 mt-1 mb-2">
                <div className="px-3 py-1 rounded-lg bg-bg-secondary border border-border text-center">
                  <span className="text-[10px] font-mono uppercase text-text-subtle block">Actual</span>
                  <span className="font-mono text-sm font-bold text-text">{baseMatch.readinessScore}%</span>
                </div>
                <div className="text-text-subtle font-mono text-sm">→</div>
                <div className="px-3 py-1 rounded-lg bg-accent-light border border-accent/30 text-center">
                  <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Simulated</span>
                  <span className="font-mono text-sm font-bold text-accent">{currentMatch.readinessScore}%</span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-300 font-semibold block">Boost</span>
                  <span className="font-mono text-sm font-bold text-emerald-600">+{scoreDelta}%</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted text-center leading-relaxed max-w-xs mx-auto mt-2">
                {currentMatch.verdictDesc}
              </p>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-bg-secondary">
              <div className="font-mono text-base font-bold text-red-600">
                {currentMatch.criticalGaps}
              </div>
              <div className="text-[10px] text-text-subtle uppercase">Critical Gaps</div>
            </div>
            <div className="p-2 rounded-lg bg-bg-secondary">
              <div className="font-mono text-base font-bold text-text">
                {currentMatch.totalGaps}
              </div>
              <div className="text-[10px] text-text-subtle uppercase">Total Deficits</div>
            </div>
            <div className="p-2 rounded-lg bg-bg-secondary">
              <div className="font-mono text-base font-bold text-emerald-600">
                {currentMatch.strengths.length}
              </div>
              <div className="text-[10px] text-text-subtle uppercase">Strengths</div>
            </div>
          </div>
        </div>

        {/* Right: Recharts Radar / Comparison Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-card bg-bg-card border border-border shadow-card flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="font-serif font-bold text-base text-text">
                Competency Distribution Comparison
              </h3>
              <p className="text-xs text-text-muted">
                Benchmarked against {currentRole.title} requirements polygon.
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-bg-secondary p-0.5 rounded-lg border border-border self-start sm:self-auto">
              <button
                onClick={() => setRadarView('category')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  radarView === 'category'
                    ? 'bg-bg-card text-text shadow-xs font-semibold'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Radar Polygon
              </button>
              <button
                onClick={() => setRadarView('comparison')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  radarView === 'comparison'
                    ? 'bg-bg-card text-text shadow-xs font-semibold'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Comparison Bars
              </button>
              <button
                onClick={() => setRadarView('skills')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  radarView === 'skills'
                    ? 'bg-bg-card text-text shadow-xs font-semibold'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Top Skills
              </button>
            </div>
          </div>

          {/* Recharts Chart Container */}
          <div className="w-full h-72 sm:h-80 flex items-center justify-center">
            {radarView === 'comparison' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryRadarData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="subject"
                    tick={{ fill: 'var(--color-text-subtle)', fontSize: 10 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 5]} tick={{ fill: 'var(--color-text-subtle)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'JetBrains Mono, monospace' }} />
                  <Bar dataKey="Actual" fill="#94a3b8" name="Actual Rating" radius={[4, 4, 0, 0]} />
                  {isSimulatorActive && (
                    <Bar dataKey="Simulated" fill="var(--color-accent)" name="Simulated" radius={[4, 4, 0, 0]} />
                  )}
                  <Bar dataKey="Required" fill="#818cf8" name="Required Level" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={radarView === 'category' ? categoryRadarData : skillsRadarData}
                  margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
                >
                  <PolarGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'var(--color-text)', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 5]}
                    tick={{ fill: 'var(--color-text-subtle)', fontSize: 9 }}
                  />
                  
                  {/* Required Benchmark Polygon */}
                  <Radar
                    name="Required Level"
                    dataKey="Required"
                    stroke="#818cf8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="#818cf8"
                    fillOpacity={0.12}
                  />

                  {/* Actual Rating Polygon */}
                  <Radar
                    name="Actual Rating"
                    dataKey="Actual"
                    stroke={isSimulatorActive ? '#94a3b8' : 'var(--color-accent)'}
                    strokeWidth={isSimulatorActive ? 1.5 : 2.5}
                    fill={isSimulatorActive ? '#94a3b8' : 'var(--color-accent)'}
                    fillOpacity={isSimulatorActive ? 0.15 : 0.35}
                  />

                  {/* Simulated Rating Polygon (When active) */}
                  {isSimulatorActive && (
                    <Radar
                      name="Simulated Rating"
                      dataKey="Simulated"
                      stroke="var(--color-accent)"
                      strokeWidth={2.5}
                      fill="var(--color-accent)"
                      fillOpacity={0.4}
                    />
                  )}

                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'var(--color-text)'
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: '11px',
                      paddingTop: '8px',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* UNIQUE: What-If Simulator Panel */}
      <div className="mb-8 p-6 rounded-card bg-bg-card border-2 border-accent/30 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent text-accent-contrast flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-text">
                  What-If Career Simulator
                </h3>
                <span className="font-mono text-[10px] uppercase font-bold text-accent bg-accent-light px-2 py-0.5 rounded">
                  Live Sandbox
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Test skill upgrades without overwriting your real profile. See the exact score trajectory in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSimulatorActive && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-text-subtle">Potential Improvement:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                  +{scoreDelta}% Score
                </span>
              </div>
            )}

            {isSimulatorActive && (
              <button
                onClick={resetSimulator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sandbox</span>
              </button>
            )}

            {isSimulatorActive && (
              <button
                onClick={handleApplySimulator}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Apply to Real Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Highest Potential Impact Skills Recommendation Card */}
        {highestImpactSkills.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-bg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-text">
                Highest Potential Impact Skills (Score Maximizers)
              </h4>
            </div>
            <p className="text-[11px] text-text-muted mb-3">
              Upgrading these specific gaps to role benchmarks delivers the fastest placement readiness boost:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {highestImpactSkills.map((item) => {
                const isAlreadySimulated =
                  Number(simulatorOverrides[item.skillId]) >= item.targetLevel;

                return (
                  <div
                    key={item.skillId}
                    className="p-3 rounded-lg bg-bg-card border border-border flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-text truncate">{item.skillName}</span>
                        <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                          +{item.gain}%
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-text-subtle">
                        Lvl {item.currentLevel} → Req {item.targetLevel} • {item.priority}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSimulateUpgrade(item.skillId, item.targetLevel, item.skillName)}
                      disabled={isAlreadySimulated}
                      className={`mt-2.5 w-full py-1 text-[11px] font-mono font-semibold rounded transition-all ${
                        isAlreadySimulated
                          ? 'bg-bg-secondary text-text-subtle cursor-default'
                          : 'bg-accent-light text-accent hover:bg-accent hover:text-white'
                      }`}
                    >
                      {isAlreadySimulated ? '✓ Simulated' : '⚡ Simulate Upgrade'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5 Simulator Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-1">
          {topGapsForSimulator.map((gap) => {
            const skillObj = SKILLS.find((s) => s.id === gap.skillId);
            const currentSimVal =
              simulatorOverrides[gap.skillId] !== undefined
                ? simulatorOverrides[gap.skillId]
                : gap.userLevel;

            return (
              <div key={gap.skillId} className="p-3.5 rounded-xl bg-bg border border-border/80">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-xs text-text truncate">
                    {skillObj?.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-accent">
                    {currentSimVal} / {gap.targetLevel}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-text-subtle mb-2">
                  Actual: Lvl {gap.userLevel} • Req: {gap.targetLevel}
                </div>

                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={currentSimVal}
                  onChange={(e) => setSimulatorOverride(gap.skillId, e.target.value)}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Top 5 Gaps 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths Card */}
        <div className="p-5 rounded-card bg-bg-card border border-border shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif font-bold text-base text-text">
              Key Strengths ({currentMatch.strengths.length})
            </h3>
          </div>

          {currentMatch.strengths.length === 0 ? (
            <p className="text-xs text-text-muted italic py-4">
              No skills currently meet the target benchmarks. Rate your skills higher or follow the roadmap to build your first strength!
            </p>
          ) : (
            <div className="space-y-2.5">
              {currentMatch.strengths.slice(0, 5).map((s) => {
                const skillObj = SKILLS.find((sk) => sk.id === s.skillId);
                return (
                  <div
                    key={s.skillId}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold text-text">{skillObj?.name}</span>
                        <span className="text-[10px] font-mono text-text-subtle ml-2">
                          {skillObj?.categoryName}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      Level {s.userLevel} / Req {s.targetLevel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top 5 Priority Gaps Card */}
        <div className="p-5 rounded-card bg-bg-card border border-border shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            <h3 className="font-serif font-bold text-base text-text">
              Top 5 Priority Deficits
            </h3>
          </div>

          <div className="space-y-2.5">
            {currentMatch.gaps.slice(0, 5).map((gap) => {
              const skillObj = SKILLS.find((sk) => sk.id === gap.skillId);
              return (
                <div
                  key={gap.skillId}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-bg border border-border text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        gap.priority === 'Critical'
                          ? 'bg-red-500'
                          : gap.priority === 'High'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-text">{skillObj?.name}</span>
                      <span className="text-[10px] font-mono text-text-subtle ml-2">
                        {skillObj?.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-text-subtle text-[11px]">
                      {gap.userLevel} → {gap.targetLevel}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                        gap.priority === 'Critical'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                          : gap.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                      }`}
                    >
                      {gap.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comprehensive Skill Deficit Table */}
      <div className="p-6 rounded-card bg-bg-card border border-border shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-text">
              Skill Gap Matrix
            </h3>
            <p className="text-xs text-text-muted">
              Complete list of skill gaps sorted by weighted placement priority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-text-subtle absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search gap table..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-bg text-text focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-lg border border-border bg-bg text-text focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-secondary text-text-subtle font-mono text-[11px] uppercase tracking-wider border-y border-border">
              <tr>
                <th className="py-2.5 px-3">Skill Competency</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Your Level</th>
                <th className="py-2.5 px-3 text-center">Required</th>
                <th className="py-2.5 px-3 text-center">Deficit</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredGaps.map((gap) => {
                const skillObj = SKILLS.find((sk) => sk.id === gap.skillId);
                return (
                  <tr key={gap.skillId} className="hover:bg-bg-hover transition-colors">
                    <td className="py-3 px-3 font-semibold text-text">
                      {skillObj?.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-text-subtle text-[11px]">
                      {skillObj?.categoryName}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-text">
                      {gap.userLevel}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-text-muted">
                      {gap.targetLevel}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-red-600">
                      -{gap.rawGap}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded ${
                          gap.priority === 'Critical'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                            : gap.priority === 'High'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[10px]">
                      {gap.isConfident ? (
                        <span className="text-emerald-600 font-semibold">Live Verified</span>
                      ) : (
                        <span className="text-text-subtle">Unverified</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


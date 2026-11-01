import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Layout,
  Server,
  Layers,
  BarChart3,
  Cpu,
  Terminal,
  Cloud,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Building,
  HelpCircle,
  Check
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { ROLES, COMPANY_MODES, calculateRoleMatch } from '../data/roles';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';

// Map icon string names to Lucide icon components
const ROLE_ICONS = {
  Code2,
  Layout,
  Server,
  Layers,
  BarChart3,
  Cpu,
  Terminal,
  Cloud,
  Smartphone,
  ShieldCheck
};

export default function RolePage() {
  const [showComparePanel, setShowComparePanel] = useState(true);
  const { targetRole, companyMode, skills, confidence, setTargetRole, setCompanyMode } = useAppStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  // Active role object
  const activeRoleObj = ROLES.find((r) => r.id === targetRole) || ROLES[0];
  const activeModeObj = COMPANY_MODES.find((m) => m.id === companyMode) || COMPANY_MODES[0];

  // Calculate Match % for ALL 10 roles sorted highest first
  const allRoleComparisons = useMemo(() => {
    return ROLES.map((role) => {
      const match = calculateRoleMatch(skills, confidence, role.id, companyMode);
      return {
        role,
        score: match.readinessScore,
        verdict: match.verdict,
        criticalGaps: match.criticalGaps,
        totalGaps: match.totalGaps
      };
    }).sort((a, b) => b.score - a.score);
  }, [skills, confidence, companyMode]);

  const handleSelectRole = (roleId) => {
    setTargetRole(roleId);
    const selected = ROLES.find((r) => r.id === roleId);
    addToast(`Target role set to ${selected?.title || roleId}`, 'success');
  };

  const handleSelectCompanyMode = (modeId) => {
    setCompanyMode(modeId);
    const selected = COMPANY_MODES.find((m) => m.id === modeId);
    addToast(`Company benchmark adjusted to ${selected?.name}`, 'info');
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <PageHeader
        step="2"
        stepTotal={3}
        stepLabel="ROLE BENCHMARK"
        title="Select Target Role & Company Mode"
        subtitle="Benchmark your calibrated skills against real technical hiring rubrics. Adjust the company tier to simulate requirements from service giants to FAANG."
        handwrittenNote="aim high, prepare smart!"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/radar')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover shadow-sm active:scale-95 transition-all"
            >
              <span>Next: Radar & Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Top Banner: Company Mode Selector */}
      <div className="mb-8 p-5 rounded-card bg-bg-card border border-border shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-light text-accent flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">
                Company Target Tier (Company Mode)
              </h2>
              <p className="text-xs text-text-muted">
                Dynamically scales required competency thresholds across all 30 skills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-subtle font-mono">Current Multiplier:</span>
            <span className="font-mono text-xs font-bold text-accent bg-accent-light px-2 py-0.5 rounded">
              {activeModeObj.multiplier}x
            </span>
          </div>
        </div>

        {/* 4 Company Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COMPANY_MODES.map((mode) => {
            const isSelected = companyMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleSelectCompanyMode(mode.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-accent bg-accent-light/30 shadow-xs ring-1 ring-accent'
                    : 'border-border bg-bg hover:bg-bg-hover'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-text">
                      {mode.name.split(' (')[0]}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-accent shrink-0 stroke-[3]" />
                    )}
                  </div>
                  <div className="font-mono text-[10px] text-text-subtle truncate mb-2">
                    {mode.tagline}
                  </div>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* UNIQUE: Compare Roles Panel */}
      <div className="mb-8 p-5 rounded-card bg-bg-card border border-border shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h3 className="font-serif font-bold text-base text-text">
              Role Match Comparison (All 10 Roles)
            </h3>
          </div>
          <span className="text-xs text-text-subtle font-mono">
            Sorted by highest match %
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {allRoleComparisons.map((item) => {
            const isCurrent = item.role.id === targetRole;
            const Icon = ROLE_ICONS[item.role.icon] || Code2;

            return (
              <div
                key={item.role.id}
                onClick={() => handleSelectRole(item.role.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-accent bg-accent-light/40 shadow-xs'
                    : 'border-border hover:border-text-subtle bg-bg'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-accent' : 'text-text-muted'}`} />
                  <span
                    className={`font-mono text-xs font-bold ${
                      item.score >= 70
                        ? 'text-emerald-600'
                        : item.score >= 45
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {item.score}%
                  </span>
                </div>
                <div className="text-xs font-semibold text-text truncate">
                  {item.role.title}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-[10px] font-mono text-text-subtle">
                  <span>{item.criticalGaps} crit gaps</span>
                  {isCurrent && <span className="text-accent font-bold">ACTIVE</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of 10 Job Role Cards */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif font-bold text-xl text-text">
          Target Role Cards
        </h3>
        <span className="text-xs font-mono text-text-subtle">
          10 Profiles Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES.map((role) => {
          const isSelected = targetRole === role.id;
          const Icon = ROLE_ICONS[role.icon] || Code2;
          const match = calculateRoleMatch(skills, confidence, role.id, companyMode);

          return (
            <div
              key={role.id}
              onClick={() => handleSelectRole(role.id)}
              className={`p-5 rounded-card bg-bg-card border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-accent shadow-card ring-2 ring-accent/30'
                  : 'border-border hover:border-text-subtle hover:shadow-card'
              }`}
            >
              <div>
                {/* Header: Icon, Title, Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-accent text-accent-contrast'
                          : 'bg-accent-light text-accent'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-text">
                        {role.title}
                      </h4>
                      <p className="text-xs text-text-subtle font-mono">
                        {role.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Target Role</span>
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-bold text-text-muted bg-bg-secondary px-2 py-0.5 rounded">
                      {match.readinessScore}% Match
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-text-muted leading-relaxed my-3">
                  {role.description}
                </p>

                {/* Key Metrics: Salary & Demand */}
                <div className="flex items-center gap-4 py-2 border-y border-border/50 text-xs">
                  <div>
                    <span className="text-text-subtle">Market Range: </span>
                    <span className="font-mono font-semibold text-text">{role.salaryRange}</span>
                  </div>
                  <div>
                    <span className="text-text-subtle">Hiring Demand: </span>
                    <span className="font-semibold text-emerald-600">{role.marketDemand}</span>
                  </div>
                </div>

                {/* Top Required Skills Tags */}
                <div className="mt-3">
                  <div className="text-[11px] font-mono text-text-subtle mb-1.5 uppercase tracking-wider">
                    Core Focus Skills:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.topSkills.map((sName) => (
                      <span
                        key={sName}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-secondary border border-border/50 text-text"
                      >
                        {sName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-text-subtle font-mono">
                  {match.criticalGaps > 0
                    ? `⚠️ ${match.criticalGaps} critical gaps to target`
                    : '✓ Requirements satisfied'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRole(role.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-accent text-accent-contrast'
                      : 'border border-border text-text hover:bg-bg-hover'
                  }`}
                >
                  {isSelected ? 'Active Target' : 'Select This Role'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


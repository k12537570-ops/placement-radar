import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ROLES_DATA, COMPANY_MODES } from '../data/roles';
import { compareAllRoles, calculateReadinessScore, getScoreVerdict } from '../utils/scoring';
import {
  Target,
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function TargetRolePage() {
  const navigate = useNavigate();
  const {
    skills,
    confidenceChecks,
    targetRoleId,
    setTargetRole,
    companyModeId,
    setCompanyMode,
    showToast
  } = useAppStore();

  const currentRole = ROLES_DATA.find((r) => r.id === targetRoleId) || ROLES_DATA[0];
  const activeCompanyMode = COMPANY_MODES.find((m) => m.id === companyModeId) || COMPANY_MODES[0];

  // Compare all 10 roles sorted by readiness percentage
  const comparedRoles = useMemo(() => {
    return compareAllRoles(skills, companyModeId, confidenceChecks);
  }, [skills, companyModeId, confidenceChecks]);

  // Current selected role readiness score
  const currentScore = useMemo(() => {
    return calculateReadinessScore(skills, targetRoleId, companyModeId, confidenceChecks);
  }, [skills, targetRoleId, companyModeId, confidenceChecks]);

  const currentVerdict = getScoreVerdict(currentScore);

  const handleSelectRole = (roleId, roleName) => {
    setTargetRole(roleId);
    showToast(`Target role set to ${roleName}`, 'success');
  };

  return (
    <div className="min-h-screen bg-bg text-text pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Block with Step, Serif Title & Handwritten Note */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase bg-accent-light px-2.5 py-1 rounded-md">
                STEP 2 OF 3
              </span>
              <span className="font-mono text-xs text-text-muted">
                TARGET ROLE BENCHMARKING
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text">
                Pick Your Target Role
              </h1>
              <span className="font-handwriting text-accent text-2xl -rotate-2 select-none">
                aim high – be strategic!
              </span>
            </div>

            <p className="text-text-muted text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Every job category and company tier sets different expectations. Select your primary target and company mode to calculate your real readiness score.
            </p>
          </div>

          {/* Action button to Step 3 */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/skills')}
              className="px-3.5 py-2.5 rounded-xl border border-border hover:bg-bg-hover text-xs font-medium text-text-muted transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Back to Skills</span>
            </button>

            <button
              onClick={() => navigate('/radar')}
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
            >
              <span>Next: View Radar & Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Company Mode Selector Banner (UNIQUE) */}
        <div className="mt-8 bg-bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-subtle flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                DYNAMIC COMPANY MODE
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-text">
              Scale Hiring Thresholds by Company Tier
            </h3>
            <p className="text-xs text-text-muted max-w-xl">
              {activeCompanyMode.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            {COMPANY_MODES.map((mode) => {
              const isActive = mode.id === companyModeId;
              return (
                <button
                  key={mode.id}
                  onClick={() => setCompanyMode(mode.id)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left border ${
                    isActive
                      ? 'bg-accent-light border-accent text-accent font-semibold shadow-xs'
                      : 'bg-bg border-border text-text-muted hover:text-text hover:bg-bg-hover'
                  }`}
                >
                  <div className="font-sans font-semibold text-text">{mode.name}</div>
                  <div className="font-mono text-[10px] text-text-muted mt-0.5">
                    {mode.multiplier}x scale
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Selected Role Spotlight Banner */}
        <div className="mt-6 p-6 rounded-2xl bg-bg-secondary border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Current Target
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="font-serif text-2xl font-bold text-text">
                {currentRole.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                {currentVerdict.text} ({currentScore}%)
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">
              {currentRole.tagline}
            </p>
          </div>

          <button
            onClick={() => navigate('/radar')}
            className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Analyze Radar & Gaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 10 Role Cards Grid */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-text">
              Available Engineering Roles (10)
            </h2>
            <span className="font-mono text-xs text-text-muted">
              Click to select
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES_DATA.map((role) => {
              const isSelected = role.id === targetRoleId;
              const roleScore = calculateReadinessScore(skills, role.id, companyModeId, confidenceChecks);
              const verdict = getScoreVerdict(roleScore);

              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id, role.name)}
                  className={`group bg-bg-card border rounded-2xl p-5 cursor-pointer transition-all shadow-subtle hover:shadow-card flex flex-col justify-between ${
                    isSelected
                      ? 'border-accent ring-2 ring-accent/20 bg-accent-light/10'
                      : 'border-border hover:border-text-muted'
                  }`}
                >
                  <div>
                    {/* Top Tag & Verdict Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-text-subtle">
                        {role.category}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${verdict.badgeClass}`}
                      >
                        {roleScore}% Match
                      </span>
                    </div>

                    {/* Role Title */}
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-text group-hover:text-accent transition-colors">
                        {role.name}
                      </h3>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-text-muted mt-1.5 leading-relaxed line-clamp-2">
                      {role.tagline}
                    </p>
                  </div>

                  {/* Critical Skills Highlights */}
                  <div className="mt-5 pt-4 border-t border-border/70 space-y-3">
                    <div>
                      <span className="text-[10px] font-mono text-text-subtle uppercase tracking-wider block mb-1.5">
                        Critical Skill Requirements
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(role.requiredSkills)
                          .filter(([_, req]) => req.weight === 'critical')
                          .slice(0, 4)
                          .map(([skillId]) => (
                            <span
                              key={skillId}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-secondary text-text-muted"
                            >
                              {skillId.replace('-', ' ')}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-text-muted text-[11px] font-sans">
                        Verdict: <strong className="text-text font-medium">{verdict.text}</strong>
                      </span>
                      <span className="text-accent text-xs font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                        {isSelected ? 'Active Target' : 'Select Role'}
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* UNIQUE: Compare Roles Panel */}
        <div className="mt-14 bg-bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  AUTOMATED FIT RADAR
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-text mt-1">
                Role Match Leaderboard
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Roles sorted from highest to lowest probability based on your current skill ratings.
              </p>
            </div>
            <span className="font-mono text-xs text-text-subtle bg-bg-secondary px-3 py-1.5 rounded-lg shrink-0">
              {activeCompanyMode.name} Mode Active
            </span>
          </div>

          <div className="space-y-3">
            {comparedRoles.map((item, idx) => {
              const isSelected = item.roleId === targetRoleId;
              return (
                <div
                  key={item.roleId}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-4 ${
                    isSelected
                      ? 'bg-accent-light/20 border-accent'
                      : 'bg-bg border-border hover:bg-bg-hover'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-subtle w-6 text-center font-bold">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-text">
                          {item.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono font-bold bg-accent text-white px-2 py-0.2 rounded-full">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-text-muted">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Match Meter Bar & Button */}
                  <div className="flex items-center gap-4 sm:w-72 justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-text-muted text-[11px]">{item.verdict.text}</span>
                        <strong className="text-text">{item.score}%</strong>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-500 rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectRole(item.roleId, item.name)}
                      disabled={isSelected}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-accent text-white opacity-80 cursor-default'
                          : 'border border-border hover:bg-bg-card text-text'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Choose'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

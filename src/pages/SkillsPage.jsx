import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw, ArrowRight, CheckCircle2, ShieldCheck, Filter, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { SKILLS, SKILL_CATEGORIES, SKILL_LEVEL_LABELS } from '../data/skills';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { skills, confidence, setSkill, setConfidence, resetAllSkills, lastSavedAt } = useAppStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  // Count calibrated skills (level > 0)
  const calibratedCount = useMemo(() => {
    return Object.values(skills).filter((val) => Number(val) > 0).length;
  }, [skills]);

  // Filter skills based on search query and category
  const filteredSkills = useMemo(() => {
    return SKILLS.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' || skill.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Group filtered skills by category for category headings
  const groupedSkills = useMemo(() => {
    const groups = {};
    filteredSkills.forEach((skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = {
          name: skill.categoryName,
          items: []
        };
      }
      groups[skill.category].items.push(skill);
    });
    return groups;
  }, [filteredSkills]);

  // Get count per category chip
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return SKILLS.length;
    return SKILLS.filter((s) => s.category === categoryId).length;
  };

  const handleReset = () => {
    resetAllSkills();
    setShowResetConfirm(false);
    addToast('All skills have been reset to 0.', 'info');
  };

  return (
    <div className="pb-24">
      {/* Page Header */}
      <PageHeader
        step="1"
        stepTotal={3}
        stepLabel="CALIBRATION"
        title="Calibrate Your Skills"
        subtitle="Rate your current command on a 0 to 5 scale. Be strictly honest — our gap engine is calibrated to find blindspots before recruiters do."
        handwrittenNote="start here – be realistic!"
        actions={
          <div className="flex items-center gap-3">
            {/* Live Saved Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-subtle font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-saved {lastSavedAt ? `at ${lastSavedAt}` : '✓'}</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Next Step Button */}
            <button
              onClick={() => navigate('/role')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover shadow-sm active:scale-95 transition-all"
            >
              <span>Next: Pick Target Role</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Calibration Progress Bar */}
      <div className="mb-6 p-4 rounded-card bg-bg-card border border-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center font-mono font-bold text-sm">
            {calibratedCount}
          </div>
          <div>
            <div className="text-sm font-semibold text-text">
              {calibratedCount} of {SKILLS.length} skills calibrated
            </div>
            <div className="text-xs text-text-muted">
              {calibratedCount === 0
                ? 'Rate at least 5 skills to generate your initial radar chart'
                : calibratedCount < 15
                  ? 'Great progress! Rate across languages and tools for higher accuracy'
                  : 'Excellent coverage! Ready to compute role alignment'}
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs font-mono text-text-subtle mb-1">
            <span>Progress</span>
            <span>{Math.round((calibratedCount / SKILLS.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${(calibratedCount / SKILLS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (e.g. Dynamic Programming, Docker, React, SQL)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SKILL_CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${isActive
                    ? 'bg-accent text-accent-contrast shadow-xs'
                    : 'bg-bg-card border border-border text-text-muted hover:text-text hover:bg-bg-hover'
                  }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-black/20 text-white' : 'bg-bg-secondary text-text-subtle'
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid Grouped by Category */}
      {Object.keys(groupedSkills).length === 0 ? (
        <div className="text-center py-16 bg-bg-card rounded-card border border-border p-8">
          <Filter className="w-8 h-8 text-text-subtle mx-auto mb-2" />
          <h3 className="font-serif text-lg font-bold text-text">No skills found</h3>
          <p className="text-xs text-text-muted mt-1">
            No skills match "{searchQuery}". Try searching for another term or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 px-4 py-1.5 rounded-lg bg-accent text-accent-contrast text-xs font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedSkills).map(([catKey, categoryGroup]) => (
            <section key={catKey}>
              {/* Category Heading with count */}
              <div className="flex items-center gap-2.5 mb-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-text">
                  {categoryGroup.name}
                </h2>
                <span className="font-mono text-xs text-text-subtle bg-bg-secondary px-2 py-0.5 rounded-md">
                  {categoryGroup.items.length} skills
                </span>
              </div>

              {/* 3-Column Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryGroup.items.map((skill) => {
                  const currentVal = Number(skills[skill.id]) || 0;
                  const isConfident = Boolean(confidence[skill.id]);
                  const isCalibrated = currentVal > 0;
                  const levelLabel = SKILL_LEVEL_LABELS[currentVal];

                  return (
                    <div
                      key={skill.id}
                      className={`p-5 rounded-card bg-bg-card border transition-all duration-200 flex flex-col justify-between hover:shadow-card ${isCalibrated
                          ? 'border-border shadow-xs'
                          : 'border-border/60 opacity-90'
                        }`}
                    >
                      <div>
                        {/* Top: Title & Level Badge */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-serif font-bold text-base text-text leading-snug">
                            {skill.name}
                          </h3>
                          <span
                            className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold shrink-0 transition-colors ${currentVal === 0
                                ? 'bg-bg-secondary text-text-subtle'
                                : currentVal >= 4
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                  : 'bg-accent-light text-accent'
                              }`}
                          >
                            {currentVal} • {levelLabel}
                          </span>
                        </div>

                        {/* One-line Description */}
                        <p className="text-xs text-text-muted leading-relaxed min-h-[36px] mb-4">
                          {skill.description}
                        </p>
                      </div>

                      <div className="space-y-4 pt-2 border-t border-border/50">
                        {/* 0-5 Range Slider with tick labels */}
                        <div>
                          <div className="relative flex items-center">
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="1"
                              value={currentVal}
                              onChange={(e) => setSkill(skill.id, e.target.value)}
                              className="w-full"
                              aria-label={`${skill.name} level slider`}
                            />
                          </div>

                          {/* Tick Labels */}
                          <div className="flex justify-between text-[10px] font-mono text-text-subtle mt-1.5 px-0.5 select-none">
                            <span className={currentVal === 0 ? 'font-bold text-text' : ''}>0 None</span>
                            <span className={currentVal === 1 ? 'font-bold text-accent' : ''}>1 Beg</span>
                            <span className={currentVal === 2 ? 'font-bold text-accent' : ''}>2 Basic</span>
                            <span className={currentVal === 3 ? 'font-bold text-accent' : ''}>3 Int</span>
                            <span className={currentVal === 4 ? 'font-bold text-accent' : ''}>4 Adv</span>
                            <span className={currentVal === 5 ? 'font-bold text-accent' : ''}>5 Exp</span>
                          </div>
                        </div>

                        {/* UNIQUE: Confidence Check Toggle */}
                        <div className="flex items-center justify-between pt-1">
                          <label
                            className="flex items-center gap-2 cursor-pointer select-none group"
                            title="I can write or solve this live without looking up Google or documentation"
                          >
                            <input
                              type="checkbox"
                              checked={isConfident}
                              onChange={(e) => setConfidence(skill.id, e.target.checked)}
                              className="rounded border-border text-accent focus:ring-accent w-3.5 h-3.5"
                            />
                            <span className="text-[11px] text-text-muted group-hover:text-text transition-colors">
                              Solve live without Google
                            </span>
                          </label>

                          {isConfident && (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-bg-card p-6 rounded-card border border-border shadow-modal space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-text">Reset all skills?</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              This will set all 30 skill ratings to 0 and clear your verified confidence checks. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 rounded-lg border border-border text-xs font-medium text-text hover:bg-bg-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Progress Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg-card border-t border-border p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-accent">{calibratedCount}/30</span>
          <span className="text-xs text-text-muted">calibrated</span>
        </div>
        <button
          onClick={() => navigate('/role')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-contrast text-xs font-semibold"
        >
          <span>Next: Pick Role</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

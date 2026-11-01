import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Map,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  CheckSquare,
  Square,
  ArrowRight,
  Sparkles,
  List,
  GitCommit,
  Award,
  Layers,
  FolderGit2,
  Briefcase,
  Check
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PomodoroTimer from '../components/PomodoroTimer';
import { generateRoadmap, ROADMAP_STAGES } from '../data/roadmapData';
import { ROLES, calculateRoleMatch } from '../data/roles';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';

export default function RoadmapPage() {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'timeline'
  const [selectedStage, setSelectedStage] = useState('all'); // 'all' | 1 | 2 | 3

  const {
    skills,
    confidence,
    targetRole,
    companyMode,
    roadmapWeeks,
    roadmapHoursPerDay,
    completedTasks,
    streak,
    setRoadmapConfig,
    toggleTask
  } = useAppStore();

  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const currentRole = ROLES.find((r) => r.id === targetRole) || ROLES[0];

  // Calculate gaps to prioritize topics
  const match = useMemo(() => {
    return calculateRoleMatch(skills, confidence, targetRole, companyMode);
  }, [skills, confidence, targetRole, companyMode]);

  // Generate roadmap data
  const weeks = useMemo(() => {
    return generateRoadmap({
      gaps: match.gaps,
      weeksCount: roadmapWeeks,
      hoursPerDay: roadmapHoursPerDay,
      targetRoleTitle: currentRole.title
    });
  }, [match.gaps, roadmapWeeks, roadmapHoursPerDay, currentRole.title]);

  // Filtered by selected stage
  const filteredWeeks = useMemo(() => {
    if (selectedStage === 'all') return weeks;
    return weeks.filter((w) => w.stageId === Number(selectedStage));
  }, [weeks, selectedStage]);

  // Task statistics
  const totalTasks = useMemo(() => {
    return weeks.reduce((acc, w) => acc + w.tasks.length, 0);
  }, [weeks]);

  const completedCount = useMemo(() => {
    return Object.values(completedTasks).filter(Boolean).length;
  }, [completedTasks]);

  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Trigger confetti when a week is completed
  const handleTaskToggle = (taskId, weekIndex) => {
    const isNowCompleting = !completedTasks[taskId];
    toggleTask(taskId);

    if (isNowCompleting) {
      // Check if all tasks in this week are now completed
      const week = weeks[weekIndex];
      if (week) {
        const otherTasksInWeek = week.tasks.filter((t) => t.id !== taskId);
        const allOthersDone = otherTasksInWeek.every((t) => completedTasks[t.id]);

        if (allOthersDone) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Fallback if confetti blocked
          }
          addToast(`🎉 Week ${week.weekNumber} completed! Great dedication!`, 'success');
        }
      }
    }
  };

  // Milestone projects matching current filter
  const activeStages = useMemo(() => {
    if (selectedStage === 'all') return ROADMAP_STAGES;
    return ROADMAP_STAGES.filter((s) => s.id === Number(selectedStage));
  }, [selectedStage]);

  return (
    <div className="pb-24">
      {/* Page Header */}
      <PageHeader
        stepLabel="ROADMAP"
        title="Curated Learning Roadmap"
        subtitle={`Custom week-by-week sprint engineered from your top deficits for ${currentRole.title}. Free verified resources and daily practice drills.`}
        handwrittenNote="consistency over intensity!"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/resume')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover shadow-sm active:scale-95 transition-all"
            >
              <span>Next: ATS Resume Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Top Banner: Progress, Streak, and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left: Sprint Controls & Stats (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-card bg-bg-card border border-border shadow-card flex flex-col justify-between space-y-6">
          {/* Streak & Completion Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs">
                <Flame className="w-7 h-7 fill-orange-500 stroke-orange-600 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-text">
                    {streak.count} Day Streak
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold">
                    Active Today
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Log practice drills daily to protect your placement momentum.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-accent text-accent-contrast border-accent'
                    : 'border-border bg-bg text-text-muted hover:text-text'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-accent text-accent-contrast border-accent'
                    : 'border-border bg-bg text-text-muted hover:text-text'
                }`}
              >
                <GitCommit className="w-4 h-4" />
                <span>Timeline View</span>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div>
            <div className="flex justify-between text-xs font-mono text-text-subtle mb-1.5">
              <span>Sprint Completion: {completedCount} of {totalTasks} Tasks</span>
              <span className="font-bold text-accent">{completionPercentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Duration & Daily Hours Controls */}
          <div className="pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Sprint Duration:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[4, 8, 12, 16].map((w) => (
                  <button
                    key={w}
                    onClick={() => setRoadmapConfig(w, roadmapHoursPerDay)}
                    className={`py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
                      roadmapWeeks === w
                        ? 'border-accent bg-accent-light text-accent'
                        : 'border-border bg-bg text-text-muted hover:text-text'
                    }`}
                  >
                    {w} Wks
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Hours Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Daily Commitment:
                </label>
                <span className="font-mono text-xs font-bold text-accent">
                  {roadmapHoursPerDay} hrs / day ({roadmapHoursPerDay * 6}h/wk)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={roadmapHoursPerDay}
                onChange={(e) => setRoadmapConfig(roadmapWeeks, Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Right: Pomodoro Timer Widget (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <PomodoroTimer />
        </div>
      </div>

      {/* Multi-Tier Roadmap Stage Selector */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-text">
              Curriculum Stages & Portfolio Milestones
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedStage('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedStage === 'all'
                  ? 'bg-accent text-accent-contrast font-bold shadow-xs'
                  : 'bg-bg-secondary text-text-muted hover:text-text'
              }`}
            >
              All Stages ({weeks.length} Wks)
            </button>
            {ROADMAP_STAGES.map((stg) => (
              <button
                key={stg.id}
                onClick={() => setSelectedStage(stg.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedStage === stg.id
                    ? 'bg-accent text-accent-contrast font-bold shadow-xs'
                    : 'bg-bg-secondary text-text-muted hover:text-text'
                }`}
              >
                {stg.tier}
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Portfolio Project Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {activeStages.map((stage) => (
            <div
              key={stage.id}
              className="p-5 rounded-card bg-bg-card border border-border shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${stage.badgeColor}`}>
                    {stage.tier} PROJECT
                  </span>
                  <span className="text-[10px] font-mono text-text-subtle uppercase">
                    Portfolio Asset
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-text mb-1 flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-accent shrink-0" />
                  <span>{stage.milestoneProject.title}</span>
                </h4>

                <p className="text-xs text-text-muted leading-relaxed mb-3">
                  {stage.milestoneProject.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <span className="text-[10px] font-mono uppercase text-text-subtle block font-semibold">
                    Target Deliverables:
                  </span>
                  {stage.milestoneProject.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-1.5 text-[11px] text-text">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Week-by-Week Content */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {filteredWeeks.map((week, wIdx) => {
            const isWeekFullyDone = week.tasks.every((t) => completedTasks[t.id]);
            const currentStageObj = ROADMAP_STAGES.find((s) => s.id === week.stageId) || ROADMAP_STAGES[0];

            return (
              <div
                key={week.weekNumber}
                className={`p-6 rounded-card bg-bg-card border transition-all duration-200 ${
                  isWeekFullyDone
                    ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-border hover:shadow-card'
                }`}
              >
                {/* Week Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-accent bg-accent-light px-2.5 py-1 rounded-lg">
                      WEEK {week.weekNumber}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${currentStageObj.badgeColor}`}>
                      {currentStageObj.tier}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-text">
                        {week.themeTitle}
                      </h3>
                      <p className="text-xs text-text-muted">{week.goal}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="font-mono text-xs text-text-subtle">
                      ~{week.targetHours}h study
                    </span>
                    {isWeekFullyDone && (
                      <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                  {/* Left: Free Curated Resources (5 cols) */}
                  <div className="md:col-span-5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-subtle">
                      <BookOpen className="w-3.5 h-3.5 text-accent" />
                      <span>Free Curated Learning:</span>
                    </div>

                    <div className="space-y-2">
                      {week.resources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-bg border border-border/80 hover:border-accent text-xs group transition-all"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="font-mono text-[10px] text-accent bg-accent-light px-1.5 py-0.5 rounded shrink-0">
                              {res.platform}
                            </span>
                            <span className="text-text font-medium truncate group-hover:text-accent">
                              {res.name}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-text-subtle group-hover:text-accent shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Right: Hands-on Practice Tasks (7 cols) */}
                  <div className="md:col-span-7 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-subtle">
                      <CheckSquare className="w-3.5 h-3.5 text-accent" />
                      <span>Placement Practice Tasks:</span>
                    </div>

                    <div className="space-y-2">
                      {week.tasks.map((task) => {
                        const isDone = Boolean(completedTasks[task.id]);
                        return (
                          <div
                            key={task.id}
                            onClick={() => handleTaskToggle(task.id, wIdx)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                              isDone
                                ? 'bg-bg-secondary/60 border-border line-through text-text-subtle'
                                : 'bg-bg border-border hover:border-text-subtle text-text'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 shrink-0 text-accent focus:outline-none"
                              aria-label={isDone ? 'Mark task incomplete' : 'Mark task complete'}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                              ) : (
                                <Square className="w-4 h-4 text-border hover:text-accent" />
                              )}
                            </button>
                            <div className="flex-1 text-xs leading-relaxed">
                              {task.text}
                            </div>
                            <span className="text-[10px] font-mono text-text-subtle shrink-0">
                              ~{task.estimatedHours}h
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Timeline View */
        <div className="relative pl-6 border-l-2 border-accent/40 space-y-8 my-4 ml-4">
          {filteredWeeks.map((week, wIdx) => {
            const isWeekFullyDone = week.tasks.every((t) => completedTasks[t.id]);
            const currentStageObj = ROADMAP_STAGES.find((s) => s.id === week.stageId) || ROADMAP_STAGES[0];

            return (
              <div key={week.weekNumber} className="relative group">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-5 h-5 rounded-full border-4 border-bg flex items-center justify-center transition-colors ${
                    isWeekFullyDone ? 'bg-emerald-500' : 'bg-accent'
                  }`}
                />

                <div className="p-5 rounded-card bg-bg-card border border-border shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-accent">
                        WEEK {week.weekNumber}: {week.skillTitle}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${currentStageObj.badgeColor}`}>
                        {currentStageObj.tier}
                      </span>
                    </div>
                    {isWeekFullyDone && (
                      <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base text-text mb-1">
                    {week.themeTitle}
                  </h4>
                  <p className="text-xs text-text-muted mb-4">{week.goal}</p>

                  <div className="space-y-1.5">
                    {week.tasks.map((task) => {
                      const isDone = Boolean(completedTasks[task.id]);
                      return (
                        <div
                          key={task.id}
                          onClick={() => handleTaskToggle(task.id, wIdx)}
                          className="flex items-center gap-2 text-xs cursor-pointer py-1"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-text-subtle shrink-0" />
                          )}
                          <span className={isDone ? 'line-through text-text-subtle' : 'text-text'}>
                            {task.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

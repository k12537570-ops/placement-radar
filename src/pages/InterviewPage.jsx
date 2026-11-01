import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Send,
  Sliders,
  TrendingUp,
  History,
  Lock
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { ROLES } from '../data/roles';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';
import api from '../services/api';

export default function InterviewPage() {
  const { user } = useAuthStore();
  const { targetRole } = useAppStore();
  const { addToast } = useToastStore();

  // Mode: 'setup' | 'session' | 'results' | 'history'
  const [viewState, setViewState] = useState('setup');
  const [selectedRole, setSelectedRole] = useState(targetRole || 'swe');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [questionCount, setQuestionCount] = useState(4);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  // Active Session State
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch past interview sessions
  const fetchHistory = async () => {
    if (user?.isGuest) return;
    setLoadingHistory(true);
    try {
      const res = await api.get('/interview/history');
      if (res.data?.success && res.data?.data) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load interview history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (!user?.isGuest) {
      fetchHistory();
    }
  }, [user?.isGuest]);

  // Start a new interview session
  const handleStartSession = async () => {
    if (user?.isGuest) {
      setShowGuestPrompt(true);
      return;
    }

    try {
      const res = await api.get('/interview/questions', {
        params: { roleId: selectedRole, difficulty, count: questionCount }
      });
      if (res.data?.success && res.data?.data?.questions) {
        setQuestions(res.data.data.questions);
        setAnswers({});
        setCurrentIdx(0);
        setShowHint(false);
        setViewState('session');
      }
    } catch (err) {
      addToast('Failed to generate interview questions. Using standard technical set.', 'error');
    }
  };

  // Submit session for evaluation
  const handleSubmitSession = async () => {
    setEvaluating(true);
    try {
      const formattedAnswers = questions.map(q => ({
        questionId: q.id,
        questionText: q.text,
        category: q.category,
        topic: q.topic,
        answer: answers[q.id] || ''
      }));

      const res = await api.post('/interview/evaluate', {
        roleId: selectedRole,
        difficulty,
        answers: formattedAnswers
      });

      if (res.data?.success && res.data?.data) {
        setEvaluationResult(res.data.data);
        setViewState('results');
        addToast('Interview evaluated and saved to your performance record!', 'success');
        fetchHistory();
      }
    } catch (err) {
      addToast('Evaluation submission failed. Please try again.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = questions[currentIdx];
  const currentAnswer = currentQ ? (answers[currentQ.id] || '') : '';
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        stepLabel="AI INTERVIEW MODULE"
        title="Interactive Mock Technical Interview"
        subtitle="Role-tailored technical & behavioral interview simulations with real-time NLP conceptual analysis and personalized weak topic diagnostics."
        handwrittenNote="be structured – use STAR method!"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (viewState === 'history') {
                  setViewState('setup');
                } else {
                  setViewState('history');
                  fetchHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
            >
              <History className="w-4 h-4" />
              <span>{viewState === 'history' ? 'Back to Setup' : 'Interview History'}</span>
            </button>
          </div>
        }
      />

      {/* Guest Mode Notice */}
      {user?.isGuest && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-card border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 shadow-xs">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Account-Only Feature: AI Mock Technical Interview</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wide rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  Guest Mode
                </span>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
                Mock technical interviews evaluate responses using semantic rubric scoring and record history on your permanent student profile. Create a free account to unlock interview simulations.
              </p>
            </div>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-accent text-accent-contrast hover:bg-accent-hover shadow-xs transition-colors shrink-0"
          >
            <span>Create a Free Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* VIEW 1: SETUP SCREEN */}
      {viewState === 'setup' && (
        <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-xl text-text">Configure Interview Session</h2>
            <p className="text-xs text-text-muted">Tailor the simulated panel to match your upcoming company interview round.</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text uppercase tracking-wider font-mono">
              Target Career Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedRole === r.id
                      ? 'border-accent bg-accent-light text-accent font-semibold shadow-xs'
                      : 'border-border bg-bg text-text-muted hover:border-text-subtle'
                  }`}
                >
                  <div className="font-semibold truncate">{r.title}</div>
                  <div className="text-[10px] text-text-subtle truncate mt-0.5">{r.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text uppercase tracking-wider font-mono">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-3 rounded-xl border text-xs capitalize text-center transition-all ${
                      difficulty === d
                        ? 'border-accent bg-accent-light text-accent font-semibold'
                        : 'border-border bg-bg text-text-muted hover:border-text-subtle'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text uppercase tracking-wider font-mono">
                Question Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 5].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`py-2 px-3 rounded-xl border text-xs text-center transition-all ${
                      questionCount === count
                        ? 'border-accent bg-accent-light text-accent font-semibold'
                        : 'border-border bg-bg text-text-muted hover:border-text-subtle'
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Guidelines Banner */}
          <div className="p-4 rounded-xl bg-bg-secondary border border-border text-xs text-text-muted space-y-1.5">
            <div className="font-semibold text-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Evaluation Criteria</span>
            </div>
            <p>
              Your written responses are graded on <strong>Relevance (35%)</strong>, <strong>Technical Correctness (40%)</strong>, and <strong>Completeness & Trade-off Depth (25%)</strong> using transparent semantic rubric matching.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartSession}
              className="w-full py-3.5 rounded-xl bg-accent text-accent-contrast font-semibold text-sm hover:bg-accent-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Begin Technical Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE INTERVIEW SESSION */}
      {viewState === 'session' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress bar & Question status */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-accent bg-accent-light px-2.5 py-1 rounded-md">
                QUESTION {currentIdx + 1} OF {questions.length}
              </span>
              <span className="text-xs font-medium text-text-muted capitalize">
                {currentQ.category} • {currentQ.topic}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-text-subtle">
              <Clock className="w-3.5 h-3.5" />
              <span>Self-Paced Mock</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-3">
              <h2 className="font-serif font-bold text-lg sm:text-xl text-text leading-snug">
                {currentQ.text}
              </h2>

              {/* Hint Accordion */}
              {currentQ.hints && (
                <div>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Show Approach Hint'}</span>
                  </button>
                  {showHint && (
                    <div className="mt-2 p-3 rounded-lg bg-bg-secondary text-xs text-text-muted border border-border italic animate-in fade-in">
                      {currentQ.hints}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Answer Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <label className="font-mono font-semibold uppercase tracking-wider text-[11px]">
                  Your Technical Response
                </label>
                <span className="font-mono text-[11px]">
                  {wordCount} words {wordCount < 25 && <span className="text-amber-600">(aim for 50+ words)</span>}
                </span>
              </div>
              <textarea
                rows={9}
                value={currentAnswer}
                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                placeholder="Type your structured explanation here. Describe the concept, underlying mechanism, trade-offs, and practical application..."
                className="w-full rounded-xl border border-border bg-bg p-4 text-sm text-text placeholder-text-subtle focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-y font-sans leading-relaxed"
              />
            </div>

            {/* Step Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                disabled={currentIdx === 0}
                onClick={() => {
                  setCurrentIdx(prev => prev - 1);
                  setShowHint(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-text-muted hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentIdx(prev => prev + 1);
                      setShowHint(false);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover transition-colors shadow-xs"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={evaluating}
                    onClick={handleSubmitSession}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{evaluating ? 'Analyzing Answers...' : 'Submit Interview'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: RESULTS & REPORT */}
      {viewState === 'results' && evaluationResult && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Score Banner */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-light text-accent font-mono text-xs font-semibold">
                EVALUATION REPORT
              </div>
              <h2 className="font-serif font-bold text-2xl text-text">
                Session Performance Score
              </h2>
              <p className="text-xs text-text-muted max-w-lg">
                {evaluationResult.feedback}
              </p>
            </div>

            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-bg-secondary border border-border min-w-[140px]">
              <span className="font-mono text-4xl font-bold text-accent">
                {evaluationResult.overallScore}%
              </span>
              <span className="text-[11px] font-mono uppercase text-text-muted font-semibold mt-1">
                Overall Grade
              </span>
            </div>
          </div>

          {/* Sub-Scores Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-xl border border-border space-y-1">
              <div className="text-xs text-text-muted font-mono">Relevance</div>
              <div className="text-xl font-bold font-mono text-text">{evaluationResult.relevanceScore}%</div>
              <div className="text-[11px] text-text-subtle">Topical alignment & terminology</div>
            </div>
            <div className="bg-card p-4 rounded-xl border border-border space-y-1">
              <div className="text-xs text-text-muted font-mono">Correctness</div>
              <div className="text-xl font-bold font-mono text-text">{evaluationResult.correctnessScore}%</div>
              <div className="text-[11px] text-text-subtle">Accurate core concept coverage</div>
            </div>
            <div className="bg-card p-4 rounded-xl border border-border space-y-1">
              <div className="text-xs text-text-muted font-mono">Completeness</div>
              <div className="text-xl font-bold font-mono text-text">{evaluationResult.completenessScore}%</div>
              <div className="text-[11px] text-text-subtle">Explanation depth & trade-offs</div>
            </div>
          </div>

          {/* Question by Question Detailed Diagnostics */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-text">Question-by-Question Review</h3>
            <div className="space-y-4">
              {evaluationResult.evaluatedQuestions?.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-bg-secondary/70 border border-border space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-accent font-bold">
                        Q{idx + 1} • {q.topic}
                      </span>
                      <h4 className="font-medium text-sm text-text mt-0.5">{q.questionText}</h4>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-card border border-border text-text">
                      {q.overallScore}%
                    </span>
                  </div>

                  <div className="text-xs text-text-muted space-y-1">
                    <div className="font-semibold text-text text-[11px]">Your Submission:</div>
                    <p className="italic bg-card p-2.5 rounded-lg border border-border/80">{q.userAnswer || '(No answer provided)'}</p>
                  </div>

                  {q.feedback && (
                    <div className="text-xs text-text-subtle space-y-1">
                      <div className="font-semibold text-text text-[11px]">Evaluator Notes:</div>
                      <p>{q.feedback}</p>
                    </div>
                  )}

                  {q.keyPointsMissed && q.keyPointsMissed.length > 0 && (
                    <div className="text-xs space-y-1 pt-1">
                      <div className="font-semibold text-amber-600 dark:text-amber-400 text-[11px]">Key Points To Incorporate:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-text-muted text-[11px]">
                        {q.keyPointsMissed.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Curated Weak Topic Resources */}
          {evaluationResult.resources && evaluationResult.resources.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-lg text-text">Recommended Learning Modules</h3>
              <p className="text-xs text-text-muted">Reinforce identified technical weak spots using these verified free guides:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {evaluationResult.resources.map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-border bg-bg hover:border-accent hover:bg-accent-light/30 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium text-xs text-text group-hover:text-accent">{res.title}</div>
                      <div className="text-[10px] text-text-subtle mt-0.5">{res.platform}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={() => setViewState('setup')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Another Mock Session</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: PAST INTERVIEW HISTORY */}
      {viewState === 'history' && (
        <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-text">Interview Performance Log</h2>
              <p className="text-xs text-text-muted">Track score progression across past mock sessions.</p>
            </div>
            <button
              onClick={() => setViewState('setup')}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>+ New Session</span>
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center text-xs text-text-muted">Loading interview history...</div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <div className="font-semibold text-sm text-text">No interview sessions recorded yet.</div>
              <p className="text-xs text-text-muted">Complete your first session to track performance over time.</p>
              <button
                onClick={() => setViewState('setup')}
                className="mt-3 px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold"
              >
                Launch Interview
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((sess) => (
                <div key={sess.id} className="p-4 rounded-xl border border-border bg-bg-secondary/60 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-text">{sess.roleTitle}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono capitalize bg-card border border-border text-text-muted">
                        {sess.difficulty}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">
                      {sess.date} • {sess.questionsCount} questions evaluated
                    </div>
                    {sess.weakTopics && sess.weakTopics.length > 0 && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400">
                        Weak topics: {sess.weakTopics.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xl text-accent">{sess.overallScore}%</div>
                    <div className="text-[10px] text-text-subtle font-mono">Score</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guest Account Required Modal */}
      {showGuestPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-md w-full bg-bg-card p-6 rounded-card border border-border shadow-modal space-y-4">
            <div className="flex items-center gap-3 text-accent">
              <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-text">
                  Create a Free Account
                </h3>
                <p className="text-xs text-text-muted">Unlock AI Mock Interviews & Scoring</p>
              </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Interactive technical interview simulations, STAR rubric evaluations, and scoring diagnostics are tied directly to your permanent student profile. Sign up in seconds to start practicing!
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowGuestPrompt(false)}
                className="px-3.5 py-2 rounded-lg border border-border text-xs font-medium text-text hover:bg-bg-hover"
              >
                Continue Exploring
              </button>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


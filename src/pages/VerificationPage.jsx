import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Zap,
  ArrowRight,
  RotateCcw,
  BarChart2,
  History,
  Check,
  Code,
  Terminal,
  Cpu,
  Database,
  Layers,
  Globe,
  Layout,
  Box,
  Lock,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import PageHeader from '../components/PageHeader';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';
import api from '../services/api';

const TOPIC_ICONS = {
  'dsa': Code,
  'python': Terminal,
  'java': Cpu,
  'cpp': Zap,
  'dbms-sql': Database,
  'oop': Box,
  'os': Layers,
  'cn': Globe,
  'web-react': Layout
};

export default function VerificationPage() {
  const { user } = useAuthStore();
  const { skills } = useAppStore();
  const { addToast } = useToastStore();

  // Mode: 'topics' | 'quiz' | 'results' | 'history'
  const [viewState, setViewState] = useState('topics');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('dsa');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [selfRatings, setSelfRatings] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load available topics on mount
  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await api.get('/verify/topics');
        if (res.data?.success && res.data?.data) {
          setTopics(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to fetch topics', err);
      }
    }
    loadTopics();
    if (!user?.isGuest) {
      fetchHistory();
    }
  }, [user?.isGuest]);

  // Fetch assessment history
  const fetchHistory = async () => {
    if (user?.isGuest) return;
    setLoadingHistory(true);
    try {
      const res = await api.get('/verify/history');
      if (res.data?.success && res.data?.data) {
        setHistory(res.data.data.history || []);
        setSelfRatings(res.data.data.selfRatings || {});
      }
    } catch (err) {
      console.warn('Failed to load verification history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Timer countdown during active quiz
  useEffect(() => {
    let timer = null;
    if (viewState === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewState, timeLeft]);

  // Start Quiz
  const handleStartQuiz = async (topicId) => {
    if (user?.isGuest) {
      setShowGuestPrompt(true);
      return;
    }

    const topicToUse = topicId || selectedTopic;
    setSelectedTopic(topicToUse);
    try {
      const res = await api.get('/verify/quiz', {
        params: { topicId: topicToUse, difficulty, count: 5 }
      });
      if (res.data?.success && res.data?.data?.questions) {
        setQuestions(res.data.data.questions);
        setSelectedAnswers({});
        setCurrentIdx(0);
        setTimeLeft(300); // 5 minutes
        setViewState('quiz');
      }
    } catch (err) {
      addToast('Failed to start assessment. Try again.', 'error');
    }
  };

  // Auto-submit on timer expiry
  const handleAutoSubmit = () => {
    addToast('Time has expired! Submitting answers automatically.', 'info');
    handleSubmitQuiz();
  };

  // Submit Quiz for Grading
  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    const timeSpent = 300 - timeLeft;
    try {
      const res = await api.post('/verify/submit', {
        topicId: selectedTopic,
        difficulty,
        answers: selectedAnswers,
        timeSpentSeconds: timeSpent
      });

      if (res.data?.success && res.data?.data) {
        setQuizResult(res.data.data);
        setViewState('results');
        addToast(`Assessment completed! Score: ${res.data.data.score}%`, 'success');
        fetchHistory();
      }
    } catch (err) {
      addToast('Assessment submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];

  // Self vs Verified comparison data
  const comparisonData = history.slice(0, 5).map(item => {
    // Map topic to self assessed level scaled to 100%
    const selfLevel = selfRatings[item.topic] || skills[item.topic] || 3;
    const selfPct = Math.round((selfLevel / 5) * 100);
    return {
      topic: item.topic.toUpperCase(),
      SelfAssessed: selfPct,
      Verified: item.score
    };
  });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        stepLabel="SKILL VERIFICATION"
        title="Technical Assessment & Verification Engine"
        subtitle="Timed topic-wise technical assessments and coding logic challenges to validate self-reported proficiency with verified benchmarks."
        handwrittenNote="prove your command!"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (viewState === 'history') {
                  setViewState('topics');
                } else {
                  setViewState('history');
                  fetchHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-text-muted hover:text-text hover:bg-bg-hover transition-colors"
            >
              <History className="w-4 h-4" />
              <span>{viewState === 'history' ? 'Back to Topics' : 'Verification History'}</span>
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
                <span className="font-semibold text-sm">Account-Only Feature: Proctored Skill Verification</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wide rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  Guest Mode
                </span>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
                Official skill verification quizzes certify your competency scores and award verified badges on your permanent student profile. Create a free account to take assessments.
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

      {/* VIEW 1: TOPIC SELECTION GRID */}
      {viewState === 'topics' && (
        <div className="space-y-6">
          {/* Difficulty Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
            <div>
              <h2 className="font-serif font-bold text-base text-text">Select Assessment Domain</h2>
              <p className="text-xs text-text-muted">Choose a technical topic to take a timed 5-question verification test.</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-bg border border-border">
              {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    difficulty === lvl
                      ? 'bg-accent text-accent-contrast shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(topics.length > 0 ? topics : [
              { id: 'dsa', name: 'Data Structures & Algorithms', questionsCount: 15 },
              { id: 'python', name: 'Python Programming', questionsCount: 15 },
              { id: 'java', name: 'Java & JVM', questionsCount: 15 },
              { id: 'cpp', name: 'C++ Systems', questionsCount: 12 },
              { id: 'dbms-sql', name: 'DBMS & SQL', questionsCount: 15 },
              { id: 'oop', name: 'Object-Oriented Programming', questionsCount: 12 },
              { id: 'os', name: 'Operating Systems', questionsCount: 12 },
              { id: 'cn', name: 'Computer Networks', questionsCount: 12 },
              { id: 'web-react', name: 'Modern Web & React', questionsCount: 15 }
            ]).map((t) => {
              const IconComponent = TOPIC_ICONS[t.id] || Code;
              return (
                <div
                  key={t.id}
                  className="bg-card rounded-2xl border border-border p-5 shadow-xs hover:border-accent/60 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase font-semibold text-text-subtle bg-bg-secondary px-2 py-0.5 rounded">
                      5 Qs • 5 Min
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-text group-hover:text-accent transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Covers memory allocation, time complexities, core syntax, and algorithmic logic.
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(t.id)}
                    className="w-full py-2.5 rounded-xl border border-border bg-bg group-hover:bg-accent group-hover:text-accent-contrast group-hover:border-accent text-xs font-semibold text-text flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE TIMED QUIZ */}
      {viewState === 'quiz' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Bar: Progress & Live Countdown Timer */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-accent bg-accent-light px-2.5 py-1 rounded-md">
                QUESTION {currentIdx + 1} OF {questions.length}
              </span>
              <span className="text-xs font-medium text-text-muted capitalize">
                {selectedTopic} • {difficulty}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 rounded-lg border ${
              timeLeft < 60
                ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 animate-pulse'
                : 'bg-bg-secondary text-text border-border'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-text leading-snug">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options?.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: optIdx })}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-accent bg-accent-light/40 text-accent font-medium shadow-xs'
                        : 'border-border bg-bg text-text hover:border-text-subtle'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold ${
                      isSelected
                        ? 'border-accent bg-accent text-accent-contrast'
                        : 'border-text-subtle text-text-subtle'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="text-sm">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-text-muted hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled={submitting}
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>{submitting ? 'Grading Answers...' : 'Submit Assessment'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: RESULTS & EXPLANATIONS */}
      {viewState === 'results' && quizResult && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Result Score Card */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-light text-accent font-mono text-xs font-semibold">
                VERIFICATION OUTCOME
              </div>
              <h2 className="font-serif font-bold text-2xl text-text">
                {quizResult.passed ? 'Skill Verified Successfully! 🎉' : 'Assessment Incomplete'}
              </h2>
              <p className="text-xs text-text-muted max-w-md">
                You answered {quizResult.correctAnswers} of {quizResult.totalQuestions} questions correctly in {quizResult.timeSpentSeconds} seconds.
                {quizResult.passed ? ' This score has been added to your verified profile credentials.' : ' Passing benchmark is 60%.'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-bg-secondary border border-border min-w-[140px]">
              <span className="font-mono text-4xl font-bold text-accent">
                {quizResult.score}%
              </span>
              <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded mt-1.5 ${
                quizResult.passed
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
              }`}>
                {quizResult.passed ? 'VERIFIED ✓' : 'NOT PASSED'}
              </span>
            </div>
          </div>

          {/* Question Explanations */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-text">Detailed Answer Explanations</h3>
            <div className="space-y-4">
              {quizResult.detailedResults?.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2.5 ${
                    item.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800'
                      : 'border-red-200 bg-red-50/40 dark:bg-red-950/20 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span className="font-medium text-sm text-text">
                        Q{idx + 1}: {item.question}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-card border border-border">
                      {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="text-xs text-text-muted pl-6 space-y-1">
                    <div>
                      Your answer: <strong>{item.selectedAnswer >= 0 ? item.options[item.selectedAnswer] : 'No answer'}</strong>
                    </div>
                    {!item.isCorrect && (
                      <div className="text-emerald-700 dark:text-emerald-400">
                        Correct answer: <strong>{item.options[item.correctAnswer]}</strong>
                      </div>
                    )}
                    <div className="p-2.5 rounded-lg bg-card border border-border/80 text-[11px] text-text-subtle">
                      <strong>Explanation: </strong>{item.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={() => setViewState('topics')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Choose Another Topic</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: VERIFICATION HISTORY & SELF VS VERIFIED COMPARISON */}
      {viewState === 'history' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Comparison Chart */}
          {comparisonData.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-text">Self-Assessed vs Verified Score Comparison</h3>
                <p className="text-xs text-text-muted">Compare how your honest rating stacks up against empirical timed quiz scores.</p>
              </div>

              <div className="w-full h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="topic" tick={{ fill: 'var(--color-text)', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        borderColor: 'var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="SelfAssessed" name="Self-Assessed %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Verified" name="Verified Test %" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* History List */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-text">Assessment History Log</h3>
                <p className="text-xs text-text-muted">Past test attempts and pass credentials.</p>
              </div>
              <button
                onClick={() => setViewState('topics')}
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                <span>+ Take New Test</span>
              </button>
            </div>

            {loadingHistory ? (
              <div className="py-12 text-center text-xs text-text-muted">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="py-12 text-center text-xs text-text-muted">No assessments taken yet.</div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-border bg-bg-secondary/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-text uppercase">{item.topic}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono capitalize bg-card border border-border text-text-muted">
                          {item.difficulty}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {item.date} • {item.correctAnswers} of {item.totalQuestions} correct ({item.timeSpentSeconds}s)
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-lg text-accent">{item.score}%</div>
                      <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                        item.passed
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {item.passed ? 'PASSED ✓' : 'FAILED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                <p className="text-xs text-text-muted">Unlock Skill Verifications & Badges</p>
              </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Skill verification tests validate your true mastery with timed quizzes, award verifiable badges, and recalibrate your readiness radar. Create a free account in 10 seconds to get certified!
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


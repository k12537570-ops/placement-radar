import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Flame, Bell } from 'lucide-react';

export default function PomodoroTimer() {
  const [mode, setMode] = useState('focus'); // 'focus' (25 min) or 'break' (5 min)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed timer
      if (mode === 'focus') {
        setCompletedSessions((c) => c + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
      try {
        // Notification sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        // AudioContext disabled or blocked
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="p-4 rounded-xl bg-bg-card border border-border shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {mode === 'focus' ? (
            <Flame className="w-4 h-4 text-accent" />
          ) : (
            <Coffee className="w-4 h-4 text-emerald-500" />
          )}
          <span className="font-semibold text-xs uppercase tracking-wider text-text">
            {mode === 'focus' ? 'Focus Sprint' : 'Short Break'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-text-subtle">
          <span>{completedSessions}</span>
          <span>sprints done</span>
        </div>
      </div>

      <div className="text-center my-2">
        <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-text">
          {minutes}:{seconds}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isRunning
              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
              : 'bg-accent text-accent-contrast hover:bg-accent-hover'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-1.5 text-text-subtle hover:text-text hover:bg-bg-hover rounded-lg transition-colors"
          title="Reset Timer"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          onClick={() => switchMode(mode === 'focus' ? 'break' : 'focus')}
          className="text-xs text-text-muted hover:text-accent font-medium px-2 py-1 rounded transition-colors"
        >
          {mode === 'focus' ? 'Switch to 5m Break' : 'Switch to 25m Focus'}
        </button>
      </div>
    </div>
  );
}

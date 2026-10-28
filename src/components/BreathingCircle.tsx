import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale';

export const BreathingCircle: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Cycle transition: Inhale (4s) -> Hold (7s) -> Exhale (8s)
        if (phase === 'Inhale') {
          setPhase('Hold');
          return 7;
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return 8;
        } else {
          setPhase('Inhale');
          setCyclesCompleted((c) => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('Inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white/90 border border-purple-100 rounded-3xl shadow-sm">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          4-7-8 Diaphragmatic Relaxing Technique
        </span>
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mt-2">Vagus Nerve Calming Circle</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Inhale deeply through your nose for 4s, gently hold for 7s, and exhale smoothly through your mouth for 8s.
        </p>
      </div>

      {/* Dynamic Animated Breathing Orb */}
      <div className="relative w-64 h-64 flex items-center justify-center my-2">
        {/* Ambient Outer Halo */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-1000 ${
            phase === 'Inhale'
              ? 'scale-115 bg-purple-200/50'
              : phase === 'Hold'
              ? 'scale-115 bg-sky-200/60 ring-4 ring-sky-300/40'
              : 'scale-90 bg-orange-100/60'
          }`}
        />

        {/* Pulsing Core Circle */}
        <div
          className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-xl select-none ${
            phase === 'Inhale'
              ? 'scale-105 bg-gradient-to-tr from-purple-600 to-indigo-500 text-white'
              : phase === 'Hold'
              ? 'scale-105 bg-gradient-to-tr from-sky-500 to-teal-400 text-white'
              : 'scale-90 bg-gradient-to-tr from-orange-400 to-amber-500 text-white'
          }`}
        >
          <span className="text-4xl font-extrabold tracking-tight tabular-nums">{secondsLeft}s</span>
          <span className="text-xs font-bold tracking-widest uppercase mt-1">
            {phase === 'Inhale' ? 'Breathe In' : phase === 'Hold' ? 'Hold Breath' : 'Release Slowly'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={toggleExercise}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all ${
            isActive
              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause Routine' : 'Start 4-7-8 Breathing'}</span>
        </button>

        <button
          onClick={resetExercise}
          title="Reset timer"
          className="p-2.5 rounded-2xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <span>
          Completed cycles: <strong className="text-slate-800 font-bold">{cyclesCompleted}</strong>
        </span>
        <span>·</span>
        <span>Recommended: 4 cycles per session</span>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Smile,
  Calendar,
  CheckCircle2,
  Circle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  MessageSquareHeart,
  BookOpen,
  Users,
  Plus,
  Clock,
} from 'lucide-react';
import { Storage } from '../../lib/storage';
import { MoodEntry, DailyGoal } from '../../types';
import { NavTab } from '../Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [goals, setGoals] = useState<DailyGoal[]>([]);

  useEffect(() => {
    setMoods(Storage.getMoods());
    setGoals(Storage.getGoals());
  }, []);

  const toggleGoal = (id: string) => {
    const updated = goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g));
    setGoals(updated);
    Storage.saveGoals(updated);
  };

  const latestMood = moods[0];
  const completedGoalsCount = goals.filter((g) => g.completed).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-100 via-sky-50 to-orange-50/50 border border-purple-200">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Namaste & Welcome</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Your Personal Sanctuary</h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Take a slow, gentle breath. Here is how you have been feeling this week.
          </p>
        </div>

        <button
          onClick={() => onNavigate('mood')}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition"
        >
          <Smile className="w-4 h-4" />
          <span>Log Current Mood</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Latest Recorded State */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <span>Current Emotional Pulse</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>

            {latestMood ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl p-2 rounded-2xl bg-purple-50">
                    {latestMood.mood === 'Happy' && '😊'}
                    {latestMood.mood === 'Calm' && '😌'}
                    {latestMood.mood === 'Okay' && '😐'}
                    {latestMood.mood === 'Sad' && '😔'}
                    {latestMood.mood === 'Stressed' && '😰'}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-800">{latestMood.mood}</h3>
                    <p className="text-xs text-slate-500 font-medium">Intensity: {latestMood.intensity}/10</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl line-clamp-2 italic border border-slate-100">
                  &ldquo;{latestMood.note || 'No note attached to this entry.'}&rdquo;
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {latestMood.tags?.map((t) => (
                    <span key={t} className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No moods logged yet. Click below to begin!
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('mood')}
            className="mt-4 text-xs font-bold text-purple-700 flex items-center gap-1 hover:underline self-start"
          >
            <span>Open Mood Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Weekly Trendline SVG */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Weekly Energy Equilibrium</span>
              <TrendingUp className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-xs text-slate-500 mb-3">Intensity levels across your last 6 check-ins</p>

            <div className="w-full h-28 flex items-end gap-2.5 pt-4 border-b border-slate-100 pb-1">
              {moods.slice(0, 6).reverse().map((m, idx) => {
                const heightPct = Math.max(20, (m.intensity / 10) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="text-[10px] text-slate-400 font-bold tabular-nums">
                      {m.intensity}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-purple-300 via-sky-300 to-sky-400 rounded-t-lg transition-all group-hover:from-purple-500 group-hover:to-sky-500"
                    />
                    <span className="text-[9px] text-slate-400 truncate w-full text-center">
                      {m.mood.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
              {moods.length === 0 && (
                <div className="w-full text-center text-xs text-slate-400 pb-4">No data recorded</div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            A balanced range (5-8) reflects steady academic coping capacity.
          </p>
        </div>

        {/* Card 3: Fast Mitra AI Prompt */}
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-200 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Mitra AI Standing By</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">Need to unpack your thoughts?</h3>
            <p className="text-xs text-purple-100 mt-2 leading-relaxed">
              Express worries in English or Hindi without fear of judgment. Mitra is tuned specifically for campus students.
            </p>
          </div>

          <button
            onClick={() => onNavigate('chat')}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white hover:bg-purple-50 text-purple-700 font-bold text-xs shadow-sm transition"
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Start Session with Mitra</span>
          </button>
        </div>
      </div>

      {/* Habits & Quick Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goals Checklist */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Daily Micro-Wellness Habits</h3>
              <p className="text-xs text-slate-500">
                Non-intrusive actions to ground your body and clear study fatigue
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
              {completedGoalsCount} of {goals.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left border transition ${
                  goal.completed
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-400 line-through'
                    : 'bg-slate-50/70 border-slate-100 text-slate-800 hover:bg-purple-50/40 hover:border-purple-200'
                }`}
              >
                {goal.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className="text-xs font-medium leading-relaxed">{goal.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Instant Grounding Hub</h3>
            <p className="text-xs text-slate-500 mb-4">Jump straight into active exercises</p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('self-care')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-sky-50 border border-sky-100 hover:bg-sky-100 text-left transition"
              >
                <div className="p-2.5 rounded-xl bg-sky-200 text-sky-700 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">4-7-8 Breathing Circle</h4>
                  <p className="text-[11px] text-slate-500">Regulate fast pulse & palpitations</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('assessment')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-orange-50 border border-orange-100 hover:bg-orange-100 text-left transition"
              >
                <div className="p-2.5 rounded-xl bg-orange-200 text-orange-700 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Pre-Assessment Form</h4>
                  <p className="text-[11px] text-slate-500">5-factor non-diagnostic check</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('counselors')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-purple-50 border border-purple-100 hover:bg-purple-100 text-left transition"
              >
                <div className="p-2.5 rounded-xl bg-purple-200 text-purple-700 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Counselor Appointment</h4>
                  <p className="text-[11px] text-slate-500">Request demo consultation slot</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

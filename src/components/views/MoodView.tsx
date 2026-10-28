import React, { useState, useEffect } from 'react';
import { MoodType, MoodEntry } from '../../types';
import { Storage } from '../../lib/storage';
import { Smile, Trash2, Edit2, Calendar, Tag, Check, Sparkles } from 'lucide-react';

const MOOD_OPTIONS: { type: MoodType; emoji: string; desc: string; bg: string }[] = [
  { type: 'Happy', emoji: '😊', desc: 'Joyful, proud, energised', bg: 'hover:border-amber-400' },
  { type: 'Calm', emoji: '😌', desc: 'Peaceful, relaxed, balanced', bg: 'hover:border-emerald-400' },
  { type: 'Okay', emoji: '😐', desc: 'Neutral, getting by', bg: 'hover:border-sky-400' },
  { type: 'Sad', emoji: '😔', desc: 'Gloomy, lonely, heavy', bg: 'hover:border-indigo-400' },
  { type: 'Stressed', emoji: '😰', desc: 'Overwhelmed, tense, hurried', bg: 'hover:border-rose-400' },
];

const PRESET_TAGS = [
  'Exams',
  'Hostel',
  'Family',
  'Sleep',
  'Friends',
  'Health',
  'Placements',
  'Assignments',
  'Campus Life',
];

export const MoodView: React.FC = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType>('Calm');
  const [intensity, setIntensity] = useState<number>(7);
  const [note, setNote] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Hostel']);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  useEffect(() => {
    setMoods(Storage.getMoods());
  }, []);

  const toggleTag = (t: string) => {
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      Storage.updateMood(editingId, {
        mood: selectedMood,
        intensity,
        note,
        tags: selectedTags,
      });
      setEditingId(null);
    } else {
      Storage.saveMood({
        mood: selectedMood,
        intensity,
        note,
        tags: selectedTags,
      });
    }

    setMoods(Storage.getMoods());
    setNote('');
    setSelectedTags([]);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleStartEdit = (entry: MoodEntry) => {
    setEditingId(entry.id);
    setSelectedMood(entry.mood);
    setIntensity(entry.intensity);
    setNote(entry.note);
    setSelectedTags(entry.tags || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this mood entry permanently?')) {
      Storage.deleteMood(id);
      setMoods(Storage.getMoods());
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNote('');
    setSelectedTags([]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
          <Smile className="w-4 h-4" />
          Emotional Tracking & Awareness
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Daily Mood Tracker</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Acknowledge and log how you feel without pressure. Noticing emotional shifts is key to sustaining mental resilience.
        </p>
      </div>

      {/* Main Logging Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-base">
            {editingId ? 'Edit Mood Record' : 'How are you feeling right now?'}
          </h2>
          {savedToast && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              Check-in recorded!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* 5 Mood Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MOOD_OPTIONS.map((item) => {
              const isSelected = selectedMood === item.type;
              return (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setSelectedMood(item.type)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition border ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/80 shadow-xs scale-102 ring-2 ring-purple-400/20'
                      : `border-slate-200 bg-slate-50/60 hover:bg-slate-100 ${item.bg}`
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                  <span className="text-xs font-extrabold text-slate-800">{item.type}</span>
                  <span className="text-[10px] text-slate-500 text-center leading-tight">{item.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Intensity Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-purple-50/30 border border-purple-100">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Felt Intensity: {intensity}/10</span>
              <span className="text-slate-400 font-normal">1 = Subtle · 10 = Very Intense</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Context Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Optional Context or Trigger Notes</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What events, interactions, or thoughts contributed to this mood? (e.g. good seminar marks, missed lunch, hostel gossip...)"
              className="w-full p-3.5 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none text-slate-800 transition"
            />
          </div>

          {/* Preset Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-600" />
              <span>Select Context Tags</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map((t) => {
                const isSelected = selectedTags.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 font-semibold shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    #{t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition"
            >
              {editingId ? 'Update Mood Check-in' : 'Save Today’s Mood'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Mood History Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">
            Timeline of Logged Moods ({moods.length})
          </h3>
          <span className="text-xs text-slate-400">Stored safely on your device</span>
        </div>

        {moods.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-purple-100 text-slate-400 text-xs">
            No entries logged yet. Record your first mood above!
          </div>
        ) : (
          <div className="space-y-3">
            {moods.map((entry) => (
              <div
                key={entry.id}
                className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-purple-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl p-2.5 bg-slate-50 rounded-2xl shrink-0 border border-slate-100">
                    {entry.mood === 'Happy' && '😊'}
                    {entry.mood === 'Calm' && '😌'}
                    {entry.mood === 'Okay' && '😐'}
                    {entry.mood === 'Sad' && '😔'}
                    {entry.mood === 'Stressed' && '😰'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{entry.mood}</h4>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                        Intensity: {entry.intensity}/10
                      </span>
                    </div>

                    {entry.note && (
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        &ldquo;{entry.note}&rdquo;
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(entry.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {entry.tags?.map((tg) => (
                        <span key={tg} className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-medium">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleStartEdit(entry)}
                    className="p-2 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition"
                    title="Edit entry"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

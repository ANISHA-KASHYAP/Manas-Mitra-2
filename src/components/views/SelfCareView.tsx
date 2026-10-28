import React, { useState } from 'react';
import { BreathingCircle } from '../BreathingCircle';
import {
  Sparkles,
  Eye,
  Hand,
  Ear,
  Flower2,
  Utensils,
  BookOpen,
  Moon,
  Coffee,
  CheckCircle2,
  Clock,
  Send,
  Check,
} from 'lucide-react';

const GROUNDING_STEPS = [
  { count: '5', label: 'Things you can SEE', desc: 'Look around your room or library. Spot 5 specific objects, colors, or shadows.', icon: Eye },
  { count: '4', label: 'Things you can TOUCH', desc: 'Notice 4 physical textures (your pen, desk wood, jeans fabric, cool water bottle).', icon: Hand },
  { count: '3', label: 'Things you can HEAR', desc: 'Focus on 3 distinct sounds (ceiling fan whir, distant hallway footsteps, birds).', icon: Ear },
  { count: '2', label: 'Things you can SMELL', desc: 'Inhale gently. Detect room freshness, pages of your textbook, or hand sanitizer.', icon: Flower2 },
  { count: '1', label: 'Thing you can TASTE', desc: 'A sip of cold water, mint, or simply notice the neutral taste in your mouth.', icon: Utensils },
];

const JOURNAL_PROMPTS = [
  'What is 1 worry you are carrying today that you have zero direct control over?',
  'Write down 3 tiny efforts you made this week that deserve gentle self-appreciation.',
  'If a close friend were in your exact college shoes today, what loving advice would you give them?',
  'What is one boundary you need to set this week to protect your sleep and peace?',
];

export const SelfCareView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathe' | 'grounding' | 'journal' | 'hygiene'>('breathe');
  const [groundingState, setGroundingState] = useState<Record<string, boolean>>({});
  const [journalText, setJournalText] = useState<string>('');
  const [savedJournalToast, setSavedJournalToast] = useState<boolean>(false);

  const toggleGrounding = (count: string) => {
    setGroundingState((prev) => ({ ...prev, [count]: !prev[count] }));
  };

  const resetGrounding = () => {
    setGroundingState({});
  };

  const handleSaveJournal = () => {
    if (!journalText.trim()) return;
    try {
      const existing = localStorage.getItem('manas_mitra_journal') || '[]';
      const parsed = JSON.parse(existing);
      parsed.unshift({
        id: 'j_' + Date.now(),
        text: journalText,
        date: new Date().toISOString(),
      });
      localStorage.setItem('manas_mitra_journal', JSON.stringify(parsed));
      setSavedJournalToast(true);
      setTimeout(() => setSavedJournalToast(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          Empirical Wellness Protocols
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Personalized Self-Care Suite</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Evidence-grounded exercises to calm racing thoughts and lower sympathetic nervous tension.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'breathe', label: '4-7-8 Breathing Circle' },
          { id: 'grounding', label: '5-4-3-2-1 Sensory Grounding' },
          { id: 'journal', label: 'Expressive Journal' },
          { id: 'hygiene', label: 'Sleep & Study Hygiene' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Breathing */}
      {activeTab === 'breathe' && (
        <div className="space-y-6">
          <BreathingCircle />

          <div className="p-6 bg-white rounded-3xl border border-purple-100 text-xs text-slate-600 space-y-2">
            <h4 className="font-extrabold text-slate-800 text-sm">How Diaphragmatic Breathing Modulates Stress</h4>
            <p className="leading-relaxed">
              When students face exam anxiety or presentations, the autonomic nervous system accelerates heart rate and shallow chest breathing. Prolonging the exhalation phase (8 seconds) activates the vagus nerve, initiating acetylcholine release which physically lowers cardiac rhythm and relieves chest tightness within minutes.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Grounding */}
      {activeTab === 'grounding' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-center justify-between">
            <p>
              <strong>De-escalation Protocol:</strong> Touch and name each sensory input around your current room to disrupt cognitive panic loops.
            </p>
            <button
              onClick={resetGrounding}
              className="px-3 py-1 bg-white border border-sky-300 rounded-xl font-bold text-sky-700 hover:bg-sky-100"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            {GROUNDING_STEPS.map((step) => {
              const Icon = step.icon;
              const isChecked = !!groundingState[step.count];
              return (
                <button
                  key={step.count}
                  type="button"
                  onClick={() => toggleGrounding(step.count)}
                  className={`w-full p-4 md:p-5 rounded-2xl border text-left flex items-start gap-4 transition ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      : 'bg-white border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 ${
                      isChecked ? 'bg-emerald-600 text-white' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {step.count}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                        {step.label}
                      </h4>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  <Icon className={`w-5 h-5 shrink-0 mt-1 ${isChecked ? 'text-emerald-600' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Journal */}
      {activeTab === 'journal' && (
        <div className="p-6 md:p-8 bg-white rounded-3xl border border-purple-100 shadow-xs space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Unfiltered Expressive Processing</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a guided prompt or dump whatever thoughts are cluttering your headspace today.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              Student Guided Prompts (Click to Insert)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {JOURNAL_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setJournalText((prev) => (prev ? `${prev}\n\nPrompt: ${prompt}\n` : `Prompt: ${prompt}\n`))
                  }
                  className="p-3 text-left text-xs rounded-2xl bg-purple-50/60 border border-purple-100 text-purple-800 hover:bg-purple-100/70 transition"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <textarea
              rows={8}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Start typing freely. Your journal is private and stays in your browser..."
              className="w-full p-4 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-800"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{journalText.length} characters</span>
              <span>Client-side local storage only</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleSaveJournal}
              disabled={!journalText.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span>Save Journal Entry</span>
            </button>

            {savedJournalToast && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                Saved to local journal!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Sleep & Study Hygiene */}
      {activeTab === 'hygiene' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-sky-100 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base">Hostel Room Sleep Architecture</h4>
              <p className="text-xs text-slate-500">How to wind down in noisy dorm environments</p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>Keep phone screen out of arm’s reach 30 minutes before sleep to stop late-night doomscrolling.</li>
              <li>Switch off harsh fluorescent tube lights after 10:30 PM; use warm desk lamps.</li>
              <li>Limit tea, coffee, or caffeinated fizzy drinks after 5:00 PM.</li>
              <li>Use earplugs or white noise apps if roommates have varying study hours.</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-orange-100 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base">Productive Study Pacing</h4>
              <p className="text-xs text-slate-500">Beat burnout during long revision sprints</p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li><strong>45 + 10 Rule:</strong> 45 minutes focused reading followed by a 10-minute screen-free walk.</li>
              <li><strong>20-20-20 Eye Rest:</strong> Every 20 minutes of coding or reading, look at an object 20 feet away for 20 seconds.</li>
              <li>Hydrate with a glass of water at every subject transition.</li>
              <li>Study standing or change chairs when drowsiness sets in.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

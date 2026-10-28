import React, { useState } from 'react';
import { Storage } from '../../lib/storage';
import { ClipboardCheck, Sparkles, AlertCircle, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { NavTab } from '../Sidebar';

interface AssessmentViewProps {
  onNavigate: (tab: NavTab) => void;
}

interface QuestionDef {
  key: string;
  category: string;
  title: string;
  description: string;
  options: { score: number; label: string; desc: string }[];
}

const ASSESSMENT_QUESTIONS: QuestionDef[] = [
  {
    key: 'stress',
    category: 'Pillar 01 · Academics & Routine',
    title: 'Study Workload & Examination Pressure',
    description: 'How manageable have your course assignments, labs, and deadlines felt over the last two weeks?',
    options: [
      { score: 1, label: 'Severely Overwhelming', desc: 'Constantly drowning in tasks; feeling helpless' },
      { score: 2, label: 'Frequently Strained', desc: 'Often anxious about keeping up with pace' },
      { score: 3, label: 'Fairly Manageable', desc: 'Challenging at times, but able to cope' },
      { score: 4, label: 'Comfortably in Control', desc: 'Well-paced study rhythm and clarity' },
    ],
  },
  {
    key: 'sleep',
    category: 'Pillar 02 · Circadian Health',
    title: 'Sleep Restfulness & Sleep Latency',
    description: 'How sound, restorative, and consistent has your hostel or home sleep pattern been?',
    options: [
      { score: 1, label: 'Very Poor (<4 hrs)', desc: 'Severe insomnia, frequent panic wakeups' },
      { score: 2, label: 'Broken & Erratic', desc: 'Delayed sleep due to late-night ruminating' },
      { score: 3, label: 'Adequate (6-7 hrs)', desc: 'Reasonable sleep, minor daytime sluggishness' },
      { score: 4, label: 'Sound & Refreshing (7-8+ hrs)', desc: 'Wake up clear-headed and energized' },
    ],
  },
  {
    key: 'mood',
    category: 'Pillar 03 · Emotional Equilibrium',
    title: 'Baseline Emotional Disposition',
    description: 'What has been your dominant emotional baseline during daily campus interactions?',
    options: [
      { score: 1, label: 'Persistent Heaviness / Emptiness', desc: 'Frequent feeling of numbness or sorrow' },
      { score: 2, label: 'Fluctuating & Easily Agitated', desc: 'Quick to anger, frustration, or sadness' },
      { score: 3, label: 'Neutral & Balanced', desc: 'Even-keeled with normal everyday ups and downs' },
      { score: 4, label: 'Optimistic & Cheerful', desc: 'Looking forward to activities and projects' },
    ],
  },
  {
    key: 'energy',
    category: 'Pillar 04 · Physical Vitality',
    title: 'Physical & Cognitive Stamina',
    description: 'Do you feel you have the physical stamina and concentration to attend lectures and labs?',
    options: [
      { score: 1, label: 'Completely Drained', desc: 'Brain fog, heavy fatigue from morning' },
      { score: 2, label: 'Low Daytime Stamina', desc: 'Struggling to sustain attention in class' },
      { score: 3, label: 'Moderate Energy', desc: 'Tired by evening but manage essential work' },
      { score: 4, label: 'High & Sustained Vitality', desc: 'Alert, focused, and proactive' },
    ],
  },
  {
    key: 'functioning',
    category: 'Pillar 05 · Social & Campus Connection',
    title: 'Interpersonal & Hostel Connection',
    description: 'Are you able to engage comfortably with friends, project teammates, and peer groups?',
    options: [
      { score: 1, label: 'Isolated & Withdrawn', desc: 'Avoiding friends; staying alone in room' },
      { score: 2, label: 'Hesitant & Strained', desc: 'Feeling out of place or misunderstood' },
      { score: 3, label: 'Selective but Connected', desc: 'Spend time with a few trusted buddies' },
      { score: 4, label: 'Socially Vibrant & Supported', desc: 'Actively bonding with classmates' },
    ],
  },
];

export const AssessmentView: React.FC<AssessmentViewProps> = ({ onNavigate }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({
    stress: 3,
    sleep: 2,
    mood: 3,
    energy: 2,
    functioning: 3,
  });
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    summary: string;
    suggestedSteps: string[];
    nonDiagnosticNotice: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: answers,
          notes,
        }),
      });

      const data = await res.json();
      setResult(data);

      Storage.saveAssessment({
        id: 'asm_' + Date.now(),
        date: new Date().toISOString(),
        scores: {
          stress: answers.stress,
          sleep: answers.sleep,
          mood: answers.mood,
          energy: answers.energy,
          functioning: answers.functioning,
        },
        notes,
        aiSummary: data.summary,
        suggestedSteps: data.suggestedSteps,
      });
    } catch (err) {
      alert('Unable to process assessment. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
          <ClipboardCheck className="w-4 h-4" />
          5-Pillar Supportive Reflection
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">AI Pre-Assessment Check-in</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          A gentle, structured 5-dimension check-in tailored for student realities. Completely non-diagnostic and private.
        </p>
      </div>

      {/* Strict Ethical & Non-Diagnostic Notice */}
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Non-Diagnostic Clarification:</strong> This pre-assessment is an algorithmically supported self-reflection tool. It does <em>not</em> diagnose clinical conditions like Depression, Anxiety Disorder, or ADHD. It helps you notice wellness signals and take actionable self-care steps.
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {ASSESSMENT_QUESTIONS.map((q) => (
            <div key={q.key} className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                  {q.category}
                </span>
                <h3 className="font-extrabold text-slate-800 text-base mt-0.5">{q.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{q.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt) => {
                  const isSelected = answers[q.key] === opt.score;
                  return (
                    <button
                      type="button"
                      key={opt.score}
                      onClick={() => setAnswers({ ...answers, [q.key]: opt.score })}
                      className={`p-3.5 rounded-2xl text-left transition border ${
                        isSelected
                          ? 'bg-purple-100/70 border-purple-400 text-slate-900 ring-2 ring-purple-300/30'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{opt.label}</span>
                        <span className="text-[10px] text-purple-700 font-bold">{opt.score}/4</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Context Notes Box */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-2">
            <label className="font-bold text-slate-800 text-sm">
              Any personal context notes? (e.g. practical exams this week, sick recently)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific context to help tailor your supportive summary..."
              className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition disabled:opacity-50"
          >
            {loading ? 'Evaluating Pillars with AI...' : 'Generate Supportive Insights'}
          </button>
        </form>
      ) : (
        /* Results View */
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-purple-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Your Reflection Summary</h2>
              <p className="text-xs text-slate-500">Structured assessment evaluated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 text-slate-700 text-xs md:text-sm leading-relaxed">
            {result.summary}
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Recommended Gentle Next Steps</span>
            </h4>
            <div className="space-y-2.5">
              {result.suggestedSteps?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
            {result.nonDiagnosticNotice}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleRetake}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Check-in</span>
            </button>

            <button
              onClick={() => onNavigate('self-care')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
            >
              <span>Practice Recommended Self-Care</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

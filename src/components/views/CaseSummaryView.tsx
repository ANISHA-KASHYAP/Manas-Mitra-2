import React, { useState, useEffect } from 'react';
import { Storage } from '../../lib/storage';
import { MoodEntry, AssessmentResponse } from '../../types';
import {
  FileText,
  ShieldCheck,
  Printer,
  CheckSquare,
  Square,
  Lock,
  ArrowLeft,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const CaseSummaryView: React.FC = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [assessments, setAssessments] = useState<AssessmentResponse[]>([]);
  const [selectedMoodIds, setSelectedMoodIds] = useState<string[]>([]);
  const [includeAssessment, setIncludeAssessment] = useState<boolean>(true);
  const [studentAlias, setStudentAlias] = useState<string>('Student (Self-Reported)');
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    const loadedMoods = Storage.getMoods();
    const loadedAssessments = Storage.getAssessments();
    setMoods(loadedMoods);
    setAssessments(loadedAssessments);
    setSelectedMoodIds(loadedMoods.slice(0, 5).map((m) => m.id));
  }, []);

  const toggleMood = (id: string) => {
    setSelectedMoodIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectAllMoods = () => {
    setSelectedMoodIds(moods.map((m) => m.id));
  };

  const deselectAllMoods = () => {
    setSelectedMoodIds([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedEntries = moods.filter((m) => selectedMoodIds.includes(m.id));
  const latestAssessment = assessments[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
          <FileText className="w-4 h-4" />
          Consent-Driven Data Sharing
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          Clinical Briefing Case Summary
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Selectively export a structured, confidential overview of your mood history to discuss with a campus therapist or counselor.
        </p>
      </div>

      {!isPreviewMode ? (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
          {/* Privacy Guarantee Note */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Zero Auto-Sharing Policy:</strong> Your sensitive emotional logs are NEVER uploaded or automatically sent to university administration or counselors. You have total autonomy over what entries to include and export.
            </div>
          </div>

          {/* Student Identifier Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Briefing Header Identifier (Name or Pseudonym)
            </label>
            <input
              type="text"
              value={studentAlias}
              onChange={(e) => setStudentAlias(e.target.value)}
              placeholder="e.g. Rahul V. / Anonymous B.Tech Student"
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Select Mood Logs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-sm">
                1. Choose Mood Entries ({selectedMoodIds.length} of {moods.length} chosen)
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={selectAllMoods}
                  className="text-purple-600 font-bold hover:underline"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllMoods}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {moods.map((m) => {
                const isSelected = selectedMoodIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMood(m.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left text-xs transition ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-300 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-purple-700 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="font-extrabold text-slate-800">{m.mood}</span>
                      <span className="text-slate-400">({new Date(m.createdAt).toLocaleDateString()})</span>
                      {m.note && <span className="italic truncate text-slate-600">&ldquo;{m.note}&rdquo;</span>}
                    </div>
                    <span className="font-bold text-purple-700 tabular-nums shrink-0">
                      {m.intensity}/10
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Include Pre-assessment checkbox */}
          {latestAssessment && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAssessment}
                  onChange={(e) => setIncludeAssessment(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">
                    Include Latest 5-Pillar Wellness Check-in ({new Date(latestAssessment.date).toLocaleDateString()})
                  </span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Attaches average scores for Academic Pressure, Sleep, Energy, and Functioning.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Explicit Consent Declaration */}
          <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="mt-1 w-4 h-4 text-purple-600 rounded border-slate-300"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                <strong>Explicit Informed Consent:</strong> I confirm that I am assembling this summary for my own personal wellness review or to facilitate a direct voluntary conversation with a campus counselor. I understand this platform does not dispatch emergency services.
              </span>
            </label>
          </div>

          <button
            onClick={() => setIsPreviewMode(true)}
            disabled={!hasConsented || selectedMoodIds.length === 0}
            className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-200 transition"
          >
            Generate & Preview Briefing Summary
          </button>
        </div>
      ) : (
        /* Preview & Print Mode */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsPreviewMode(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Selection</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print or Save as PDF</span>
            </button>
          </div>

          {/* Printable Report Sheet */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-300 shadow-md text-slate-800 space-y-6 print:shadow-none print:border-none print:p-0">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                  Campus Health Coordination Protocol
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  STUDENT WELLNESS BRIEFING SUMMARY
                </h2>
                <p className="text-xs text-slate-500">
                  Prepared via MANAS MITRA (मानस मित्र) Platform · Self-Reported Metrics
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p><strong>Subject:</strong> {studentAlias}</p>
                <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Verification Metadata */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Points</span>
                <span className="font-bold text-slate-800">{selectedEntries.length} selected entries</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Intensity Average</span>
                <span className="font-bold text-slate-800">
                  {(selectedEntries.reduce((a, b) => a + b.intensity, 0) / (selectedEntries.length || 1)).toFixed(1)} / 10
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sharing Basis</span>
                <span className="font-bold text-emerald-700">Explicit Student Consent</span>
              </div>
            </div>

            {/* Selected Mood Trajectory Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Chronological Mood Check-in Trajectory
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Primary State</th>
                      <th className="p-3">Intensity</th>
                      <th className="p-3">Context & Tags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedEntries.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {new Date(e.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3 font-bold text-slate-800">{e.mood}</td>
                        <td className="p-3 font-semibold text-purple-700 tabular-nums">{e.intensity} / 10</td>
                        <td className="p-3 text-slate-600">
                          {e.note || <span className="text-slate-400 italic">No notes</span>}
                          {e.tags?.length > 0 && (
                            <span className="text-[10px] text-slate-400 ml-2">
                              ({e.tags.join(', ')})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assessment Details if toggled */}
            {includeAssessment && latestAssessment && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent 5-Pillar Reflection Profile ({new Date(latestAssessment.date).toLocaleDateString()})
                </h4>
                <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 text-xs space-y-2">
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Algorithmic Reflection:</strong> {latestAssessment.aiSummary}
                  </p>
                  {latestAssessment.notes && (
                    <p className="text-slate-500 italic">
                      Student Context Notes: &ldquo;{latestAssessment.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mandatory Disclaimer */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 leading-relaxed">
              <strong>Clinical & Academic Notice:</strong> This summary is an educational self-report artifact generated with explicit student consent. It does not constitute a psychiatric diagnosis, hospital triage, or medical prescription. In case of acute distress, call Tele-MANAS: 14416.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

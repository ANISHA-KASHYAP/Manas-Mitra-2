import React, { useState, useEffect } from 'react';
import { Storage } from '../../lib/storage';
import {
  Settings,
  Shield,
  Download,
  Trash2,
  Check,
  Languages,
  Database,
  Lock,
  RefreshCw,
  Bell,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [exportedToast, setExportedToast] = useState<boolean>(false);
  const [clearedToast, setClearedToast] = useState<boolean>(false);
  const [chatsClearedToast, setChatsClearedToast] = useState<boolean>(false);

  useEffect(() => {
    const s = Storage.getSettings();
    setLanguage(s.language);
  }, []);

  const handleLanguageChange = (lang: 'English' | 'Hindi') => {
    setLanguage(lang);
    Storage.saveSettings({ language: lang, consentGiven: true });
  };

  const handleExportData = () => {
    const jsonString = Storage.exportAllData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manas_mitra_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExportedToast(true);
    setTimeout(() => setExportedToast(false), 3000);
  };

  const handleClearChatsOnly = () => {
    if (confirm('Delete all stored conversation logs with Mitra?')) {
      Storage.clearChats();
      setChatsClearedToast(true);
      setTimeout(() => setChatsClearedToast(false), 3000);
    }
  };

  const handleWipeAll = () => {
    if (
      confirm(
        'CRITICAL: This will permanently wipe all your mood logs, assessments, chat messages, and bookings from this browser. Do you wish to proceed?'
      )
    ) {
      Storage.wipeAll();
      setClearedToast(true);
      setTimeout(() => {
        setClearedToast(false);
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
          <Settings className="w-4 h-4" />
          User Autonomy & Settings
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Settings & Data Privacy</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Full data sovereignty. Manage your preferences, download personal data backups, or purge your records.
        </p>
      </div>

      {/* Language Preference */}
      <div className="p-6 bg-white rounded-3xl border border-purple-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Primary Interface Language</h3>
            <p className="text-xs text-slate-500">Choose between English and Hindi</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => handleLanguageChange('English')}
            className={`p-3 rounded-2xl font-bold text-xs border transition ${
              language === 'English'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('Hindi')}
            className={`p-3 rounded-2xl font-bold text-xs border transition ${
              language === 'Hindi'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </div>

      {/* Architectural Security & Privacy Disclosure */}
      <div className="p-6 md:p-8 bg-white rounded-3xl border border-purple-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Privacy Architecture Disclosure</h3>
            <p className="text-xs text-slate-500">Transparent design for college review</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p>
            • <strong>Local-First Storage Sandbox:</strong> Your journal entries, daily mood scores, and pre-assessments are saved exclusively in your browser’s local storage. They are never transmitted to unauthorized cloud databases.
          </p>
          <p>
            • <strong>Server-Side Secret Isolation:</strong> Gemini AI API requests are routed strictly through `/api/chat` and `/api/assessment` on the server. Your API credentials are never bundled into client-side JavaScript.
          </p>
          <p>
            • <strong>Tele-MANAS Integration:</strong> Crisis keywords trigger immediate, verified contact information for India's 24/7 mental health helpline (14416 / 1-800-891-4416).
          </p>
          <p>
            • <strong>Zero Third-Party Telemetry:</strong> No analytics trackers or commercial trackers operate on this platform.
          </p>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export JSON */}
        <div className="p-6 bg-white rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm mb-1">Export Full JSON Backup</h4>
            <p className="text-xs text-slate-500 mb-4">
              Download your complete wellness history (mood logs, check-ins, bookings) into an interoperable JSON file.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold text-xs transition"
          >
            {exportedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
            <span>{exportedToast ? 'Downloaded JSON Backup' : 'Export Data File'}</span>
          </button>
        </div>

        {/* Clear Chats */}
        <div className="p-6 bg-white rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm mb-1">Reset Chat History Only</h4>
            <p className="text-xs text-slate-500 mb-4">
              Clear your conversation transcripts with Mitra while keeping all your mood logs and questionnaires intact.
            </p>
          </div>

          <button
            onClick={handleClearChatsOnly}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-xs transition"
          >
            {chatsClearedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Trash2 className="w-4 h-4" />}
            <span>{chatsClearedToast ? 'Chat Transcript Cleared' : 'Clear Chat Records'}</span>
          </button>
        </div>
      </div>

      {/* Complete Data Purge */}
      <div className="p-6 bg-white rounded-3xl border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-rose-700 text-sm">Permanent Zero-Footprint Wipe</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Erase all records, moods, assessments, and bookings from this browser. This cannot be undone.
          </p>
        </div>

        <button
          onClick={handleWipeAll}
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-bold text-xs transition shrink-0"
        >
          {clearedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Trash2 className="w-4 h-4" />}
          <span>{clearedToast ? 'Purged Completely' : 'Purge All Local Data'}</span>
        </button>
      </div>
    </div>
  );
};

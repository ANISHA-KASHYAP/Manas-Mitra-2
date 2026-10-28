import React from 'react';
import { ShieldAlert, X, PhoneCall, Heart, ExternalLink } from 'lucide-react';
import { TELE_MANAS_PRIMARY, TELE_MANAS_SECONDARY, KHANDWALA_KIRAN_HELPLINE } from '../lib/safety';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, reason }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg p-6 md:p-8 bg-white border border-rose-200 rounded-3xl shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close emergency support dialog"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4 text-rose-600">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-7 h-7 text-rose-600" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Immediate Support Is Available</h3>
            <p className="text-xs font-semibold text-rose-600">Free · 100% Confidential · 24/7 National Care</p>
          </div>
        </div>

        {reason && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-800 leading-relaxed">
            {reason}
          </div>
        )}

        <p className="text-xs md:text-sm text-slate-600 mb-5 leading-relaxed">
          If you are going through acute emotional distress, feeling overwhelmed, or experiencing thoughts of self-harm, please connect with a compassionate human counselor right now. You are valuable, and help is just one call away.
        </p>

        {/* Tele-MANAS Highlight Box */}
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-amber-50 border border-rose-200 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-md">
              Govt. of India Initiative (MoHFW)
            </span>
            <span className="text-[11px] text-slate-500">20+ Indian Languages</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">National Tele-MANAS Helpline</h4>
          <p className="text-xs text-slate-600 mb-4">
            Comprehensive 24/7 mental health tele-counseling support by trained counselors and psychologists.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`tel:${TELE_MANAS_PRIMARY}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Toll-Free: {TELE_MANAS_PRIMARY}</span>
            </a>
            <a
              href={`tel:${TELE_MANAS_SECONDARY}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 font-semibold text-xs transition"
            >
              <span>Alt: {TELE_MANAS_SECONDARY}</span>
            </a>
          </div>

          <div className="mt-3 pt-3 border-t border-rose-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Social Justice KIRAN Helpline:</span>
            <a href={`tel:${KHANDWALA_KIRAN_HELPLINE}`} className="font-semibold text-slate-700 hover:underline">
              {KHANDWALA_KIRAN_HELPLINE}
            </a>
          </div>
        </div>

        {/* Immediate Coping Steps */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2 mb-5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Right now in this moment:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Reach out to a trusted roommate, close friend, hostel warden, or family member.</li>
            <li>Step into an open, well-lit campus space with gentle air circulation.</li>
            <li>Inhale slowly for 4 seconds, pause for 4, and exhale softly for 6.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-xs transition"
        >
          Return to Platform
        </button>
      </div>
    </div>
  );
};

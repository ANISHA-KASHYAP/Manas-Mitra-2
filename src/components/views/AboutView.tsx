import React from 'react';
import {
  HeartHandshake,
  ShieldAlert,
  Award,
  PhoneCall,
  ExternalLink,
  BookOpen,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import {
  TELE_MANAS_PRIMARY,
  TELE_MANAS_SECONDARY,
  KHANDWALA_KIRAN_HELPLINE,
  SAFETY_DISCLAIMER,
} from '../../lib/safety';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
          <HeartHandshake className="w-4 h-4" />
          Academic Capstone Documentation
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          About MANAS MITRA (मानस मित्र)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          AI-Powered Mental Wellness and Healthcare Coordination Platform for Higher Education.
        </p>
      </div>

      {/* College Project Evaluation Summary */}
      <div className="p-6 md:p-8 bg-white rounded-3xl border border-purple-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Project Context & Academic Objective</h3>
            <p className="text-xs text-slate-500">2nd-Year B.Tech Software Engineering & AI Project</p>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          <strong>Manas Mitra</strong> was conceptualized and engineered to address the growing psychological pressures faced by engineering and university students across India. Moving away from home, adjusting to hostel living, managing semester GPA expectations, and navigating placement anxiety often produce acute isolation. Manas Mitra builds a bridge between everyday self-care, empathetic AI companion support, and human counselor escalation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
            <span className="font-bold text-slate-800">Stack Architecture:</span>
            <p className="text-slate-600">
              React SPA, TypeScript, Tailwind CSS, Express Backend, Google Gemini 3.8 Flash, Local-First Persistence.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
            <span className="font-bold text-slate-800">Key Innovation:</span>
            <p className="text-slate-600">
              Consent-driven clinical briefing generation paired with automatic Tele-MANAS crisis pre-screening.
            </p>
          </div>
        </div>
      </div>

      {/* Official Tele-MANAS Resource Profile */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-amber-50 border border-rose-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              National Tele-MANAS Integration (Govt. of India)
            </h3>
            <p className="text-xs text-rose-700 font-semibold">
              Ministry of Health and Family Welfare (MoHFW) Verified Service
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Tele-MANAS (National Tele Mental Health Programme of India) was launched to provide free, round-the-clock tele-mental health services across all 36 States and Union Territories in 20+ regional Indian languages. Manas Mitra integrates its emergency dialers directly into every view.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs">
            <span className="text-[10px] font-bold text-rose-700 uppercase">Primary Short-Code</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {TELE_MANAS_PRIMARY}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Direct toll-free shortcode on all Indian networks.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Alternate Toll-Free</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {TELE_MANAS_SECONDARY}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">11-digit national toll-free support line.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase">MSJE KIRAN Helpline</span>
            <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
              1800-599-0019
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Department of Empowerment of PwDs helpline.</p>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimers & Ethics */}
      <div className="p-6 md:p-8 bg-white rounded-3xl border border-purple-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
          <FileCheck className="w-5 h-5 text-purple-600" />
          <span>Ethical & Clinical Boundaries</span>
        </div>

        <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-5 leading-relaxed">
          <li>
            <strong>Non-Diagnostic Nature:</strong> No algorithm, questionnaire score, or chat interaction in Manas Mitra provides DSM-5 or ICD-11 psychiatric diagnoses.
          </li>
          <li>
            <strong>Not an Emergency Dispatcher:</strong> This platform does not connect to police, ambulance services, or campus security dispatchers automatically. Students in critical physical danger must use emergency helplines directly.
          </li>
          <li>
            <strong>No Pharmaceutical Guidance:</strong> Manas Mitra does not recommend, evaluate, or prescribe medicines or psychiatric pharmaceuticals.
          </li>
          <li>
            <strong>Synthetic Campus Counselors:</strong> As documented throughout the platform, counselor profiles are representative demo data for college examination evaluation.
          </li>
        </ul>
      </div>

      {/* College Project Viva & Architecture Dossier */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50/50 rounded-3xl border border-purple-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              College Project Viva & Evaluation Dossier
            </h3>
            <p className="text-xs text-purple-700 font-semibold">
              Complete Reference for Evaluators & External Examiners
            </p>
          </div>
        </div>

        {/* System Architecture Flow */}
        <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-purple-700">
            System Architecture & Data Flow
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="font-bold text-purple-900 block">1. Client Layer</span>
              <span className="text-[11px] text-slate-600">React 19 + TypeScript + Tailwind CSS (Responsive Web + Mobile)</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="font-bold text-indigo-900 block">2. Express Proxy</span>
              <span className="text-[11px] text-slate-600">Secure Node.js API with API-Key encapsulation & port resilience</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
              <span className="font-bold text-sky-900 block">3. AI & Safety Engine</span>
              <span className="text-[11px] text-slate-600">Gemini 3.8 Flash + 4-Tier Tele-MANAS crisis detection</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block">4. Local Sanctuary</span>
              <span className="text-[11px] text-slate-600">Zero-footprint LocalStorage + Three.js WebGL 3D Zen Vatika</span>
            </div>
          </div>
        </div>

        {/* Top 3 Viva Questions & Answers */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-purple-700">
            Expected Viva Questions & Verified Answers
          </h4>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <strong className="text-slate-900 block">
              Q1. How is user privacy handled for sensitive mental health journals and chats?
            </strong>
            <p className="text-slate-600">
              <strong>Answer:</strong> Following the <em>Digital Personal Data Protection (DPDP) Act 2023</em> and privacy-by-design principles, Manas Mitra stores all chat logs, mood history, and journal reflections strictly in the student's browser sandbox (Local-First). No sensitive mental health data is retained on external database servers without explicit, signed consent.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <strong className="text-slate-900 block">
              Q2. What happens if a student expresses acute distress or self-harm thoughts?
            </strong>
            <p className="text-slate-600">
              <strong>Answer:</strong> The platform implements a two-stage crisis triage mechanism. The server first evaluates distress patterns across English and Hindi keywords. If detected, standard chatbot generation is safely suspended and the system displays verified Indian Tele-MANAS helplines (14416 and 1-800-891-4416) with immediate 1-click calling links.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <strong className="text-slate-900 block">
              Q3. Why is an interactive 3D Zen Vatika included alongside standard self-care tools?
            </strong>
            <p className="text-slate-600">
              <strong>Answer:</strong> The 3D Dhyan Vatika uses Three.js procedural graphics and Web Audio API pink-noise synthesis to offer a sensory digital bio-feedback pacer. The floating lotus expands and contracts in synchronization with the vagus nerve 4-7-8 breathing cadence, grounding anxious students who struggle with plain text instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

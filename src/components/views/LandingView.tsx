import React from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  MessageSquareHeart,
  Smile,
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  Lock,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { NavTab } from '../Sidebar';
import { TELE_MANAS_PRIMARY, TELE_MANAS_SECONDARY } from '../../lib/safety';

interface LandingViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenEmergency: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenEmergency }) => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100/90 via-sky-50/70 to-orange-50/60 border border-purple-200/80 p-6 md:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-purple-200 text-purple-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Empathetic Student Wellness · Powered by Google Gemini AI
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A gentle sanctuary for your <span className="text-purple-700">mental peace</span> & campus life.
            </h1>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-xl">
              <strong>MANAS MITRA (मानस मित्र)</strong> supports students through syllabus pressure, hostel loneliness, and emotional fatigue. Featuring empathetic bilingual AI support, daily mood logs, active grounding routines, and direct linkage to campus counselors and India’s Tele-MANAS.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition hover:-translate-y-0.5"
              >
                <span>Enter Your Sanctuary</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('chat')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-purple-50 border border-purple-200 text-slate-700 font-semibold text-xs shadow-xs transition"
              >
                <MessageSquareHeart className="w-4 h-4 text-purple-600" />
                <span>Talk to Mitra (Hindi / English)</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Local-first privacy
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Tele-MANAS crisis safety
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Non-diagnostic reflection
              </span>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white group">
              <img
                src="/src/assets/images/hero_wellness_illustration_1793210097979.jpg"
                alt="Mindful student in tranquility"
                className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-4 text-white">
                <p className="text-xs font-bold">Safe, calm, and judgment-free</p>
                <p className="text-[11px] text-slate-200">Reflect anytime between study sessions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tele-MANAS & Safety Banner */}
      <section className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs text-amber-900 space-y-0.5">
            <p className="font-bold text-sm">Academic Project · Non-Diagnostic Supportive Protocol</p>
            <p className="text-amber-800 leading-relaxed">
              Manas Mitra is an educational capstone platform. For acute mental health distress or crisis intervention, dial India's official 24x7 Tele-MANAS toll-free line: <strong>{TELE_MANAS_PRIMARY}</strong> or <strong>{TELE_MANAS_SECONDARY}</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenEmergency}
          className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs whitespace-nowrap shadow-xs transition shrink-0"
        >
          View Helplines
        </button>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Comprehensive Ecosystem</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
            Engineered For Student Wellness Realities
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Carefully crafted features addressing academic burnout, semester anxiety, and hostel transition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('chat')}
            className="p-6 bg-white rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">Bilingual Mitra AI Companion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Powered by Gemini 3.8 Flash via isolated server-side endpoints. Seamlessly talk in English, Hindi, or conversational Hinglish with zero-tolerance distress screening.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1">
              Start chat session <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('mood')}
            className="p-6 bg-white rounded-3xl border border-sky-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">Daily Mood Tracker & Trends</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record your state across 5 primary tones with intensity rating (1-10), personal notes, and contextual tags. Review interactive weekly stability curves.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-sky-600 flex items-center gap-1">
              Log daily mood <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('self-care')}
            className="p-6 bg-white rounded-3xl border border-orange-100 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">Evidence-Grounded Self-Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                4-7-8 breathing circle animation to stimulate the vagus nerve, 5-4-3-2-1 sensory grounding checklist, hostel sleep hygiene tips, and expressive journaling.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-orange-600 flex items-center gap-1">
              Open self-care tools <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white rounded-3xl border border-purple-100 p-8 md:p-10 shadow-xs">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 text-center mb-8">
          How Manas Mitra Coordinates Care
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Check In Daily',
              desc: 'Log your mood in 20 seconds to notice emotional shifts before overwhelm builds.',
            },
            {
              step: '02',
              title: 'Express Safely',
              desc: 'Chat with Mitra about late-night study anxiety or loneliness in Hindi or English.',
            },
            {
              step: '03',
              title: 'De-escalate & Breathe',
              desc: 'Use guided 4-7-8 rhythm and sensory grounding before entering examination halls.',
            },
            {
              step: '04',
              title: 'Consent-Based Connect',
              desc: 'Generate a briefing sheet of your mood logs to consult campus counselors easily.',
            },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100">
              <span className="text-2xl font-extrabold text-purple-300 tabular-nums">{item.step}</span>
              <h4 className="font-bold text-slate-800 text-sm mt-1">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

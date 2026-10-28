import React, { useState } from 'react';
import {
  HeartHandshake,
  Menu,
  X,
  PhoneCall,
  MessageSquareHeart,
  Sparkles,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenEmergency: () => void;
}

const TAB_TITLES: Record<NavTab, string> = {
  home: 'Home & Platform Overview',
  dashboard: 'Student Wellness Dashboard',
  chat: 'AI Mitra Companion',
  mood: 'Mood Tracker & Timeline',
  assessment: 'Supportive Pre-Assessment',
  'self-care': 'Self-Care & Grounding Suite',
  'zen-3d': '3D Dhyan Vatika (Zen Sanctuary)',
  counselors: 'Campus Counselor Directory',
  summary: 'Consent-Based Case Summary',
  settings: 'Settings & Data Sovereignty',
  about: 'About Project & Tele-MANAS',
};

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenEmergency }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-purple-100 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Zone 1: Brand & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 md:hidden text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 tracking-tight">MANAS MITRA</span>
        </button>

        {/* Desktop View Title */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-slate-400">Section</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-800">{TAB_TITLES[currentTab]}</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Clean single-line prose without pill enclosures) */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`hover:text-purple-700 transition ${currentTab === 'dashboard' ? 'text-purple-700 font-bold' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('chat')}
          className={`hover:text-purple-700 transition ${currentTab === 'chat' ? 'text-purple-700 font-bold' : ''}`}
        >
          Mitra Chat
        </button>
        <button
          onClick={() => onSelectTab('zen-3d')}
          className={`hover:text-purple-700 transition ${currentTab === 'zen-3d' ? 'text-purple-700 font-bold' : ''}`}
        >
          3D Vatika
        </button>
        <button
          onClick={() => onSelectTab('mood')}
          className={`hover:text-purple-700 transition ${currentTab === 'mood' ? 'text-purple-700 font-bold' : ''}`}
        >
          Mood Tracker
        </button>
        <button
          onClick={() => onSelectTab('self-care')}
          className={`hover:text-purple-700 transition ${currentTab === 'self-care' ? 'text-purple-700 font-bold' : ''}`}
        >
          Self-Care
        </button>
        <button
          onClick={() => onSelectTab('counselors')}
          className={`hover:text-purple-700 transition ${currentTab === 'counselors' ? 'text-purple-700 font-bold' : ''}`}
        >
          Counselors
        </button>
      </nav>

      {/* Zone 3: Primary Action & Emergency Helpline */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenEmergency}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
          <span className="hidden sm:inline">Emergency Helpline</span>
          <span className="sm:hidden">14416</span>
        </button>

        {currentTab !== 'chat' && (
          <button
            onClick={() => onSelectTab('chat')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-200 transition"
          >
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Talk to Mitra</span>
            <span className="sm:hidden">Chat</span>
          </button>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-white/95 backdrop-blur-md z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-2">
            {[
              { id: 'home', label: 'Home Overview' },
              { id: 'dashboard', label: 'My Sanctuary (Dashboard)' },
              { id: 'chat', label: 'AI Mitra Chat' },
              { id: 'mood', label: 'Mood Tracker' },
              { id: 'assessment', label: 'Pre-Assessment Check' },
              { id: 'self-care', label: 'Self-Care Suite' },
              { id: 'zen-3d', label: '3D Dhyan Vatika' },
              { id: 'counselors', label: 'Campus Counselors' },
              { id: 'summary', label: 'Clinical Case Summary' },
              { id: 'settings', label: 'Settings & Privacy' },
              { id: 'about', label: 'About & Tele-MANAS' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleMobileNav(item.id as NavTab)}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition ${
                  currentTab === item.id
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEmergency();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>National Tele-MANAS (14416)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

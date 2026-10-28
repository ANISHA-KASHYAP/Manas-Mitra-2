import React from 'react';
import {
  HeartHandshake,
  LayoutDashboard,
  MessageSquareHeart,
  Smile,
  ClipboardCheck,
  Sparkles,
  Users,
  FileText,
  Settings,
  ShieldAlert,
  PhoneCall,
  Home,
  Compass,
} from 'lucide-react';
import { TELE_MANAS_PRIMARY } from '../lib/safety';

export type NavTab =
  | 'home'
  | 'dashboard'
  | 'chat'
  | 'mood'
  | 'assessment'
  | 'self-care'
  | 'zen-3d'
  | 'counselors'
  | 'summary'
  | 'settings'
  | 'about';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenEmergency: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home Overview', icon: Home },
  { id: 'dashboard', label: 'My Sanctuary', icon: LayoutDashboard },
  { id: 'chat', label: 'AI Mitra Chat', icon: MessageSquareHeart },
  { id: 'mood', label: 'Mood Tracker', icon: Smile },
  { id: 'assessment', label: 'Wellness Check', icon: ClipboardCheck },
  { id: 'self-care', label: 'Self-Care Suite', icon: Sparkles },
  { id: 'zen-3d', label: '3D Dhyan Vatika', icon: Compass },
  { id: 'counselors', label: 'Counselor Connect', icon: Users },
  { id: 'summary', label: 'Case Summary', icon: FileText },
  { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  { id: 'about', label: 'About & Safety', icon: ShieldAlert },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenEmergency }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-purple-100 p-5 shrink-0 select-none shadow-sm h-screen sticky top-0">
      {/* Brand Header */}
      <button
        onClick={() => onSelectTab('home')}
        className="flex items-center gap-3 mb-6 px-2 text-left hover:opacity-90 transition"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-purple-200 shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">MANAS MITRA</h1>
          <p className="text-[11px] font-semibold text-purple-600">मानस मित्र · Student Care</p>
        </div>
      </button>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-100/80 text-purple-800 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tele-MANAS Quick Support Box */}
      <div className="mt-auto pt-4 border-t border-purple-50">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50/70 border border-rose-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Tele-MANAS Active</span>
            <span className="text-[10px] text-slate-500">24/7 Helpline</span>
          </div>
          <p className="text-xs font-extrabold text-slate-800 mb-2">Dial {TELE_MANAS_PRIMARY}</p>
          <button
            onClick={onOpenEmergency}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

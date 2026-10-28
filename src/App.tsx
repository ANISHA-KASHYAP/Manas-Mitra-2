/**
 * MANAS MITRA (मानस मित्र) — AI-Powered Mental Wellness and Healthcare Coordination Platform
 * College Project Capstone - 2nd Year B.Tech
 */

import React, { useState } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { EmergencyModal } from './components/EmergencyModal';
import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { ChatView } from './components/views/ChatView';
import { MoodView } from './components/views/MoodView';
import { AssessmentView } from './components/views/AssessmentView';
import { SelfCareView } from './components/views/SelfCareView';
import { CounselorView } from './components/views/CounselorView';
import { CaseSummaryView } from './components/views/CaseSummaryView';
import { SettingsView } from './components/views/SettingsView';
import { AboutView } from './components/views/AboutView';
import { ZenSanctuary3D } from './components/3d/ZenSanctuary3D';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [emergencyReason, setEmergencyReason] = useState<string | undefined>(undefined);

  const handleOpenEmergency = (reason?: string) => {
    setEmergencyReason(reason);
    setIsEmergencyOpen(true);
  };

  const handleCloseEmergency = () => {
    setIsEmergencyOpen(false);
    setEmergencyReason(undefined);
  };

  const handleNavigate = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8FF] text-slate-900 font-sans">
      {/* Persistent Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        onOpenEmergency={() => handleOpenEmergency('National 24x7 crisis support protocol')}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Navbar
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          onOpenEmergency={() => handleOpenEmergency('National 24x7 crisis support protocol')}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {currentTab === 'home' && (
            <LandingView
              onNavigate={handleNavigate}
              onOpenEmergency={() => handleOpenEmergency('National 24x7 crisis support protocol')}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardView onNavigate={handleNavigate} />
          )}

          {currentTab === 'chat' && (
            <ChatView
              onOpenEmergency={() =>
                handleOpenEmergency(
                  'Distress or crisis indicators were recognized in your conversation. Please reach out to India’s Tele-MANAS helpline immediately.'
                )
              }
            />
          )}

          {currentTab === 'mood' && <MoodView />}

          {currentTab === 'assessment' && (
            <AssessmentView onNavigate={handleNavigate} />
          )}

          {currentTab === 'self-care' && <SelfCareView />}

          {currentTab === 'zen-3d' && <ZenSanctuary3D />}

          {currentTab === 'counselors' && <CounselorView />}

          {currentTab === 'summary' && <CaseSummaryView />}

          {currentTab === 'settings' && <SettingsView />}

          {currentTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Emergency Helpline Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={handleCloseEmergency}
        reason={emergencyReason}
      />
    </div>
  );
}

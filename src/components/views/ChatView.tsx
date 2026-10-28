import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  ShieldAlert,
  Languages,
  Trash2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Info,
  BrainCircuit,
  HeartHandshake,
  CheckCircle2,
  X,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { Storage } from '../../lib/storage';
import { TELE_MANAS_PRIMARY } from '../../lib/safety';

interface ChatViewProps {
  onOpenEmergency: () => void;
}

const QUICK_TOPIC_PILLS = [
  { label: '📚 Exam & Syllabus Panic', prompt: 'Exam ka syllabus bohot bacha hai aur time kam hai, bohot panic ho raha hai.' },
  { label: '🌙 Late-Night Overthinking', prompt: 'Raat ko late overthinking hoti hai aur neend nahi aati, kya karun?' },
  { label: '🫂 Hostel Loneliness', prompt: 'Hostel me sab aage nikal rahe hain, mujhe lagta hai mai peeche reh gaya.' },
  { label: '💼 Placement / Viva Fear', prompt: 'Placement / Viva ke liye confidence bilkul down ho gaya hai.' },
  { label: '📱 Screen Guilt & Slump', prompt: 'Padhai me mann nahi lag raha aur din bhar phone scroll karke guilt hota hai.' },
  { label: '✨ 5-Min Grounding', prompt: 'Mujhe abhi bohot बेचैनी lag rahi hai, sath me koi calming exercise karwao.' },
];

const FOLLOW_UP_SUGGESTIONS = [
  'Mujhe ek practical 5-minute trick batao.',
  'Kya hum abhi sath me 4-7-8 breathing kar sakte hain?',
  'Agar kal bhi darr lage toh kya karun?',
  'Thank you, thoda relax feel ho raha hai.',
];

export const ChatView: React.FC<ChatViewProps> = ({ onOpenEmergency }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [serverNotice, setServerNotice] = useState<string | null>(null);
  const [showIntelligenceModal, setShowIntelligenceModal] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = Storage.getChats();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      const initialGreeting: ChatMessage = {
        id: 'init-1',
        sender: 'bot',
        text: 'Namaste! I am Manas Mitra (मानस मित्र), your confidential peer-support AI companion. You can speak with me openly in English, Hindi, or conversational Hinglish about syllabus pressure, hostel life, low energy, or whatever is weighing on your mind today. How are you feeling right now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialGreeting]);
      Storage.saveChats([initialGreeting]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = (userPrompt || input).trim();
    if (!textToSend || loading) return;

    setServerNotice(null);

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    Storage.saveChats(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          history: updated.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();

      if (data.isCrisis) {
        onOpenEmergency();
      }

      if (data.isMissingKey) {
        setServerNotice(data.reply);
      }

      const botReplyMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: data.reply || 'I am here with you. Please take a gentle, deep breath.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisis: data.isCrisis,
        isOfflineFallback: data.isMissingKey,
      };

      const finalMessages = [...updated, botReplyMsg];
      setMessages(finalMessages);
      Storage.saveChats(finalMessages);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'system',
        text: 'Server connection issue. Please verify local network connectivity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updated, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear your conversation history with Mitra?')) {
      Storage.clearChats();
      const freshGreeting: ChatMessage = {
        id: 'fresh_' + Date.now(),
        sender: 'bot',
        text: 'Conversation history cleared. I am right here whenever you are ready to reflect or talk again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([freshGreeting]);
      Storage.saveChats([freshGreeting]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden relative">
      {/* Chat Top Header */}
      <div className="bg-slate-50/90 border-b border-purple-100 p-3 md:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm text-slate-900">Mitra AI Companion</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                Gemini 3.8 Flash
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active & Empathetic
              </span>
              <span>·</span>
              <span>Tele-MANAS Safe</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Understanding & Intelligence Info Button */}
          <button
            onClick={() => setShowIntelligenceModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition"
            title="How Mitra understands your words and feelings"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mitra's AI Brain</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
            <button
              onClick={() => setLanguage('English')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                language === 'English' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('Hindi')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                language === 'Hindi' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी / Hinglish
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Server Notice Banner */}
      {serverNotice && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Server AI Notice:</strong> {serverNotice}
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-purple-50/15">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user'
                ? 'items-end'
                : msg.sender === 'system'
                ? 'items-center'
                : 'items-start'
            }`}
          >
            {msg.sender === 'system' ? (
              <span className="text-[11px] bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1 rounded-full">
                {msg.text}
              </span>
            ) : (
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-4 md:px-5 py-3.5 text-xs md:text-sm shadow-xs whitespace-pre-wrap leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : msg.isCrisis
                    ? 'bg-rose-50 text-rose-950 border-2 border-rose-300 rounded-bl-none'
                    : 'bg-white border border-purple-100 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.text}

                {msg.isCrisis && (
                  <div className="mt-3 pt-3 border-t border-rose-200 flex flex-wrap items-center gap-2">
                    <button
                      onClick={onOpenEmergency}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Tele-MANAS ({TELE_MANAS_PRIMARY})</span>
                    </button>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 text-right font-medium tabular-nums ${
                    msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Quick Follow-up chips for the user if last message was from bot and not loading */}
        {!loading && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
          <div className="pt-1 flex flex-wrap gap-1.5">
            <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mr-1">
              <Zap className="w-3 h-3" /> Quick follow-ups:
            </span>
            {FOLLOW_UP_SUGGESTIONS.map((suggestion, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleSend(suggestion)}
                className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium px-2.5 py-1 rounded-lg border border-purple-200 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 bg-white border border-purple-100 px-4 py-3 rounded-2xl rounded-bl-none text-slate-500 shadow-xs text-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-medium text-purple-700 ml-1">Mitra is understanding & crafting guidance...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Topic Chips */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Campus Scenarios:</span>
        {QUICK_TOPIC_PILLS.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill.prompt)}
            className="text-[11px] whitespace-nowrap bg-purple-50 hover:bg-purple-100 text-purple-800 font-medium px-3 py-1.5 rounded-xl border border-purple-200 transition shrink-0"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Input Box Form */}
      <div className="p-3 md:p-4 bg-white border-t border-purple-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'Hindi'
                ? 'अपने विचार यहाँ साझा करें (जैसे: परीक्षा को लेकर बहुत घबराहट हो रही है)...'
                : 'Write your thoughts or worries here (e.g. syllabus stress, feeling down)...'
            }
            className="flex-1 px-4 py-3 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition shadow-md shadow-purple-200 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Confidential student peer AI · Non-diagnostic companion</span>
          <span>Emergency? Dial 14416</span>
        </div>
      </div>

      {/* Mitra AI Intelligence Modal for Viva/Demonstration */}
      {showIntelligenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Mitra AI Cognitive Engine</h3>
                  <p className="text-xs text-purple-700 font-semibold">Gemini 3.8 Flash + Indian Psychosocial Protocol</p>
                </div>
              </div>
              <button
                onClick={() => setShowIntelligenceModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-700" />
                  1. Hinglish & Hindi Sentiment Understanding (भाषा की समझ)
                </h4>
                <p>
                  Mitra does not just match keywords. It understands casual conversational Hinglish used by college students:
                  <em className="text-purple-800"> "yaar padhai nahi ho rahi", "marks ko lekar anxiety hai", "attendance short hai", "sab aage nikal rahe hain"</em>.
                  It extracts the underlying emotional state (overwhelm, loneliness, fear of failure) and responds like a caring senior or mentor.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-indigo-700" />
                  2. 4-Stage Empathetic Response Protocol
                </h4>
                <ul className="space-y-1 list-disc list-inside text-indigo-950">
                  <li><strong>Emotional Validation:</strong> Acknowledges feelings first without dismissing them.</li>
                  <li><strong>Realistic Micro-Step:</strong> Offers 1-2 small, 5-minute actionable steps.</li>
                  <li><strong>Perspective Shift:</strong> Reminds the student that a semester is not their entire identity.</li>
                  <li><strong>Interactive Follow-up:</strong> Closes with a gentle check-in question.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
                <h4 className="font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  3. Indian Crisis Safety Filter (Tele-MANAS)
                </h4>
                <p>
                  If high distress or self-harm keywords are detected (English or Hindi), the bot halts standard conversational flow and immediately presents direct 24/7 national helplines:
                  <strong> 14416</strong> and <strong>1-800-891-4416</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  4. Offline & Low-Latency Fallback Engine
                </h4>
                <p>
                  If college Wi-Fi drops or upstream latency occurs, an intelligent offline contextual engine provides tailored relief for exams, sleep, and loneliness without showing an error screen.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowIntelligenceModal(false)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition"
              >
                Close & Start Chatting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

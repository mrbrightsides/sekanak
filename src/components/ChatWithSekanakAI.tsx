import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { APP_LOGOS } from '../constants/logos';
import { Bot, Send, Sparkles, User, Loader2, RefreshCw, HelpCircle, ShieldCheck, HeartPulse } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ChatWithSekanakAIProps {
  user: UserProfile | null;
}

const QUICK_QUESTIONS = [
  '🍬 Berapa batas aman gula harian untuk anak sekolah?',
  '🧂 Mengapa bumbu mi instan berbahaya jika dikonsumsi berlebih?',
  '🥤 Apa minuman pengganti es boba yang sehat di kantin?',
  '🧈 Berapa batas minyak/gorengan per hari?',
  '🏫 Bagaimana tips memilih jajanan aman di MTs / SD?',
];

export const ChatWithSekanakAI: React.FC<ChatWithSekanakAIProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Halo ${user?.name || 'Siswa SEKANAK'}! Saya **Dr. SEKANAK AI**, konsultan gizi dari Tim Peneliti Universitas Sriwijaya (UNSRI).\n\nSaya siap menjawab pertanyaan seputar acuan batas Gula, Garam, dan Lemak (GGL) Kemenkes RI, memilih jajanan sehat di kantin, atau saran pola makan berprestasi! Ada yang ingin kamu tanyakan hari ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat-nutritionist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userProfile: user,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Maaf, terjadi masalah saat menghubungkan dengan pakar gizi AI.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Maaf, sambungan AI terputus. Pastikan koneksi internet stabil lalu coba lagi.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] max-h-[80vh] rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center ring-2 ring-emerald-300 overflow-hidden shadow-xs">
              <img
                src={APP_LOGOS.sekanak}
                alt="Logo SEKANAK"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-800"></span>
          </div>
          <div>
            <h3 className="text-xs font-black flex items-center gap-1.5">
              <span>Chat Konsultan Gizi SEKANAK AI</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-300 text-slate-950 font-bold">
                UNSRI
              </span>
            </h3>
            <p className="text-[10px] text-emerald-100 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-300" />
              <span>Tim Peneliti Nutrisi SEKANAK 2024–2026</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'ai',
                text: 'Percakapan direset. Silakan tanyakan hal seputar GGL atau gizi anak!',
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }}
          className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-100 transition"
          title="Reset Percakapan"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs overflow-hidden ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 p-0.5 border border-emerald-300 dark:border-emerald-700'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <img
                  src={APP_LOGOS.sekanak}
                  alt="SEKANAK AI"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs font-medium'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs space-y-1'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <span
                className={`text-[9px] block text-right mt-1 ${
                  msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Dr. SEKANAK AI sedang mengetik jawaban...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Question Chips */}
      <div className="p-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 shrink-0">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block px-1 mb-1">
          Pertanyaan Cepat:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 text-[10px] font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 whitespace-nowrap transition active:scale-95 shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Tanyakan ke Dr. SEKANAK AI (misal: 'berapa batas gula boba?')..."
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-40 transition active:scale-95 shadow-xs"
          title="Kirim Pertanyaan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

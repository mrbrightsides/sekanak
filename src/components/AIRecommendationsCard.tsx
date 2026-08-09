import React, { useState, useEffect } from 'react';
import { UserProfile, FoodItem, GGLStatus, AIRecommendationResult } from '../types';
import { Sparkles, MessageCircle, RefreshCw, Send, CheckCircle, AlertCircle, Apple, HeartPulse, Loader2 } from 'lucide-react';

interface AIRecommendationsCardProps {
  user: UserProfile | null;
  todayLogs: FoodItem[];
  gglStatus: GGLStatus;
}

export const AIRecommendationsCard: React.FC<AIRecommendationsCardProps> = ({
  user,
  todayLogs,
  gglStatus,
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Interactive AI Chat State
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `Halo ${user?.name || 'Sahabat SEKANAK'}! Saya Dr. SEKANAK AI dari Tim Universitas Sriwijaya. Ada yang ingin kamu tanyakan seputar jajanan sekolah, bahaya minuman manis/chiki, atau alternatif menu sehat?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Fetch AI Recommendations
  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: user,
          totals: {
            sugarGram: gglStatus.sugarGram,
            saltGram: gglStatus.saltGram,
            fatGram: gglStatus.fatGram,
          },
          limits: {
            sugarLimit: gglStatus.sugarLimit,
            saltLimit: gglStatus.saltLimit,
            fatLimit: gglStatus.fatLimit,
          }
        })
      });

      if (!res.ok) throw new Error('Gagal mengambil rekomendasi AI');
      const data = await res.json();
      setRecommendations(data);
    } catch (err: any) {
      console.warn('Error fetching AI recommendations, applying client fallback:', err);
      // Client fallback recommendation
      const isSugarOver = gglStatus.sugarGram > gglStatus.sugarLimit;
      const isSaltOver = gglStatus.saltGram > gglStatus.saltLimit;
      const isFatOver = gglStatus.fatGram > gglStatus.fatLimit;

      setRecommendations({
        sugarAdvice: isSugarOver
          ? `Konsumsi gula (${gglStatus.sugarGram}g) telah melebihi batas aman (${gglStatus.sugarLimit}g). Kurangi minuman manis kemasan.`
          : `Bagus! Asupan gula (${gglStatus.sugarGram}g) masih dalam batas aman.`,
        saltAdvice: isSaltOver
          ? `Asupan garam (${gglStatus.saltGram}g) melebihi rekomendasi (${gglStatus.saltLimit}g). Kurangi camilan gurih/asin.`
          : `Asupan garam (${gglStatus.saltGram}g) masih aman.`,
        fatAdvice: isFatOver
          ? `Konsumsi lemak (${gglStatus.fatGram}g) berada di atas batas (${gglStatus.fatLimit}g). Kurangi makanan gorengan.`
          : `Kadar lemak (${gglStatus.fatGram}g) terkontrol dengan baik.`,
        healthyAlternatives: [
          'Potongan buah segar (Apel, Semangka, Pisang)',
          'Air putih dingin / infused water',
          'Kacang rebus atau telur rebus'
        ],
        overallSummary: `Rapor Konsumsi GGL Hari Ini: ${gglStatus.sugarGram}g Gula, ${gglStatus.saltGram}g Garam, ${gglStatus.fatGram}g Lemak.`,
        encouragement: 'Terus catat konsumsi harianmu di SEKANAK UNSRI untuk tumbuh sehat dan berprestasi! 🌟'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [gglStatus.sugarGram, gglStatus.saltGram, gglStatus.fatGram, user?.userType]);

  // Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat-nutritionist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          userProfile: user,
        })
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: 'ai', text: data.reply || 'Maaf, saya tidak dapat merespons saat ini.' }]);
    } catch {
      setChatMessages((prev) => [...prev, { sender: 'ai', text: 'Koneksi ke AI terganggu, silakan coba lagi.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">
              Personalisasi Rekomendasi AI SEKANAK
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Disesuaikan dengan riwayat makanan {user?.name || 'kamu'} hari ini
            </p>
          </div>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
          title="Muat Ulang Analisis AI"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
            AI Gemini UNSRI sedang menganalisis pola konsumsi GGL...
          </p>
        </div>
      ) : recommendations ? (
        <div className="space-y-3">
          {/* Overall AI Encouragement Summary */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xs">
            <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">
              Pesan Kesehatan AI Hari Ini
            </div>
            <p className="text-xs font-medium mt-1 leading-relaxed">
              {recommendations.overallSummary}
            </p>
            <div className="mt-2 text-[11px] font-bold text-amber-200 flex items-center gap-1.5">
              <span>🌟</span>
              <span>{recommendations.encouragement}</span>
            </div>
          </div>

          {/* 4 Structured Recommendation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Card 1: Kurangi Gula */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                <span className="text-base">🍬</span>
                <span>Rekomendasi Gula</span>
              </div>
              <p className="text-[11px] text-amber-950 dark:text-amber-100 leading-relaxed">
                {recommendations.sugarAdvice}
              </p>
            </div>

            {/* Card 2: Kurangi Garam */}
            <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                <span className="text-base">🧂</span>
                <span>Rekomendasi Garam</span>
              </div>
              <p className="text-[11px] text-blue-950 dark:text-blue-100 leading-relaxed">
                {recommendations.saltAdvice}
              </p>
            </div>

            {/* Card 3: Kurangi Lemak */}
            <div className="p-3.5 rounded-2xl bg-orange-50/90 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 dark:text-orange-300">
                <span className="text-base">🧈</span>
                <span>Rekomendasi Lemak</span>
              </div>
              <p className="text-[11px] text-orange-950 dark:text-orange-100 leading-relaxed">
                {recommendations.fatAdvice}
              </p>
            </div>

            {/* Card 4: Pilihan Makanan Sehat */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pilihan Makanan Sehat</span>
              </div>
              <ul className="space-y-1">
                {recommendations.healthyAlternatives?.map((alt, idx) => (
                  <li key={idx} className="text-[11px] text-emerald-950 dark:text-emerald-100 flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      ) : null}

      {/* Interactive AI Chat Trigger */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Tanya Dr. SEKANAK AI (Konsultan Gizi)
            </span>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {showChat ? 'Tutup Chat' : 'Buka Obrolan 💬'}
          </button>
        </div>

        {showChat && (
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
            <div className="max-h-52 overflow-y-auto space-y-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 custom-scrollbar text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p className="text-[11px] leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-500 text-[10px] flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    <span>AI sedang berpikir...</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tanyakan tentang jajanan, gula, atau gizi..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputMessage.trim()}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

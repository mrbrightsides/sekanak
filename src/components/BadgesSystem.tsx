import React, { useState } from 'react';
import { FoodItem, UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { Award, Trophy, ShieldCheck, Heart, Sparkles, CheckCircle2, Lock, Star, Share2 } from 'lucide-react';

interface BadgesSystemProps {
  logs: FoodItem[];
  user: UserProfile | null;
  gglLimits: { sugarLimit: number; saltLimit: number; fatLimit: number };
}

export interface BadgeItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: 'amber' | 'emerald' | 'blue' | 'orange' | 'purple';
  isUnlocked: boolean;
  progressText: string;
  unlockedDate?: string;
  description: string;
}

export const BadgesSystem: React.FC<BadgesSystemProps> = ({ logs, user, gglLimits }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  // Calculate unique days recorded
  const uniqueDates = Array.from(new Set(logs.map((l) => l.date)));
  
  // Calculate daily totals map
  const dailyTotalsMap: Record<string, { sugar: number; salt: number; fat: number }> = {};
  logs.forEach((log) => {
    if (!dailyTotalsMap[log.date]) {
      dailyTotalsMap[log.date] = { sugar: 0, salt: 0, fat: 0 };
    }
    dailyTotalsMap[log.date].sugar += log.sugarGram || 0;
    dailyTotalsMap[log.date].salt += log.saltGram || 0;
    dailyTotalsMap[log.date].fat += log.fatGram || 0;
  });

  const recordedDaysCount = uniqueDates.length;

  // Rule 1: Low Sugar Hero (At least 2 days with sugar <= sugarLimit)
  const lowSugarDays = Object.values(dailyTotalsMap).filter((d) => d.sugar <= gglLimits.sugarLimit).length;
  const isLowSugarHero = lowSugarDays >= 2 || (recordedDaysCount >= 1 && (logs.length > 0 && logs[0].sugarGram <= 10));

  // Rule 2: Balanced Eater (All GGL <= limit in at least 1 day)
  const balancedDays = Object.values(dailyTotalsMap).filter(
    (d) => d.sugar <= gglLimits.sugarLimit && d.salt <= gglLimits.saltLimit && d.fat <= gglLimits.fatLimit
  ).length;
  const isBalancedEater = balancedDays >= 1;

  // Rule 3: Salt Guard (Salt <= limit in at least 2 days)
  const saltGuardDays = Object.values(dailyTotalsMap).filter((d) => d.salt <= gglLimits.saltLimit).length;
  const isSaltGuard = saltGuardDays >= 2 || recordedDaysCount >= 1;

  // Rule 4: Low Fat Champion (Fat <= limit in at least 2 days)
  const lowFatDays = Object.values(dailyTotalsMap).filter((d) => d.fat <= gglLimits.fatLimit).length;
  const isLowFatChampion = lowFatDays >= 2;

  // Rule 5: 7-Day Streaker / Consistent Logging
  const isStreaker = recordedDaysCount >= 3;

  // Rule 6: Master Gizi Sekolah UNSRI
  const isMasterGizi = isBalancedEater && recordedDaysCount >= 2;

  const badgesList: BadgeItem[] = [
    {
      id: 'low-sugar-hero',
      title: 'Low Sugar Hero',
      subtitle: 'Pahlawan Bebas Gula',
      icon: '🍬',
      color: 'amber',
      isUnlocked: isLowSugarHero,
      progressText: isLowSugarHero ? 'Tercapai! (>=2 Hari)' : `${lowSugarDays}/2 Hari Bebas Gula`,
      unlockedDate: 'Minggu Ini',
      description: 'Berhasil menjaga konsumsi gula harian di bawah 25 gram sesuai rekomendasi Kemenkes RI.',
    },
    {
      id: 'balanced-eater',
      title: 'Balanced Eater',
      subtitle: 'Penyantap Seimbang',
      icon: '🥗',
      color: 'emerald',
      isUnlocked: isBalancedEater,
      progressText: isBalancedEater ? 'Tercapai!' : `${balancedDays}/1 Hari GGL Seimbang`,
      unlockedDate: 'Minggu Ini',
      description: 'Semua konsumsi Gula, Garam, dan Lemak harian berada di zona AMAN.',
    },
    {
      id: 'salt-guard',
      title: 'Salt Guard',
      subtitle: 'Penjaga Garam',
      icon: '🧂',
      color: 'blue',
      isUnlocked: isSaltGuard,
      progressText: isSaltGuard ? 'Tercapai!' : `${saltGuardDays}/2 Hari Garam Aman`,
      unlockedDate: 'Minggu Ini',
      description: 'Membatasi jajanan asin dan bumbu natrium berlebih untuk melindungi tekanan darah.',
    },
    {
      id: 'low-fat-champion',
      title: 'Low Fat Champion',
      subtitle: 'Juara Bebas Lemak',
      icon: '🧈',
      color: 'orange',
      isUnlocked: isLowFatChampion,
      progressText: isLowFatChampion ? 'Tercapai!' : `${lowFatDays}/2 Hari Bebas Minyak`,
      unlockedDate: 'Minggu Ini',
      description: 'Menghindari gorengan minyak berulang dan memilih makanan sehat bergizi.',
    },
    {
      id: 'sekanak-streaker',
      title: '7-Day Streaker',
      subtitle: 'Pencatat Setia SEKANAK',
      icon: '⭐',
      color: 'purple',
      isUnlocked: isStreaker,
      progressText: isStreaker ? 'Tercapai!' : `${recordedDaysCount}/3 Hari Mencatat`,
      unlockedDate: 'Minggu Ini',
      description: 'Konsisten mencatat asupan makanan harian secara rutin di aplikasi SEKANAK.',
    },
    {
      id: 'master-gizi-unsri',
      title: 'Master Gizi UNSRI',
      subtitle: 'Dokter Cilik Sekolah',
      icon: '🏆',
      color: 'emerald',
      isUnlocked: isMasterGizi,
      progressText: isMasterGizi ? 'Tercapai!' : 'Mencatat & Menjaga GGL',
      unlockedDate: 'Minggu Ini',
      description: 'Prestasi tertinggi! Menjadi teladan kesehatan gizi bagi teman-teman di sekolah.',
    },
  ];

  const unlockedCount = badgesList.filter((b) => b.isUnlocked).length;

  const handleSelectBadge = (badge: BadgeItem) => {
    setSelectedBadge(badge);
    if (badge.isUnlocked) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
      {/* Badge Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Lencana Prestasi Sehat (Badges)
            </h3>
            <p className="text-[10px] text-slate-500">
              Pencapaian gizi seimbang harian siswa
            </p>
          </div>
        </div>

        <div className="bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{unlockedCount} / {badgesList.length} Terbuka</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {badgesList.map((badge) => (
          <button
            key={badge.id}
            onClick={() => handleSelectBadge(badge)}
            className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
              badge.isUnlocked
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-300 dark:border-amber-700 shadow-xs hover:scale-[1.02]'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 opacity-60 grayscale hover:grayscale-0'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{badge.icon}</span>
                {badge.isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2 leading-tight">
                {badge.title}
              </h4>
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                {badge.subtitle}
              </p>
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[9px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{badge.progressText}</span>
              {badge.isUnlocked && <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Badge Modal Detail */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner">
              {selectedBadge.icon}
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                {selectedBadge.isUnlocked ? 'LENCANA TERBUKA! 🎉' : 'LENCANA TERKUNCI 🔒'}
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-2">
                {selectedBadge.title} ({selectedBadge.subtitle})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs space-y-1 text-left border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-slate-500">
                <span>Status Progres:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBadge.progressText}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Pencapaian:</span>
                <span className="font-bold text-emerald-600">{selectedBadge.isUnlocked ? 'Sudah Tercapai' : 'Belum Tercapai'}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

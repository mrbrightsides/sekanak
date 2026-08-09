import React from 'react';
import { GGLStatus, UserProfile } from '../types';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info, Sparkles } from 'lucide-react';

interface GGLGaugesProps {
  status: GGLStatus;
  user: UserProfile | null;
  onNavigateToCatat: () => void;
}

export const GGLGauges: React.FC<GGLGaugesProps> = ({ status, user, onNavigateToCatat }) => {
  const getBadgeColor = (st: 'aman' | 'waspada' | 'bahaya') => {
    switch (st) {
      case 'aman':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'waspada':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'bahaya':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    }
  };

  const getBarColor = (st: 'aman' | 'waspada' | 'bahaya') => {
    switch (st) {
      case 'aman':
        return 'bg-emerald-500';
      case 'waspada':
        return 'bg-amber-500';
      case 'bahaya':
        return 'bg-rose-500';
    }
  };

  const getStatusIcon = (st: 'aman' | 'waspada' | 'bahaya') => {
    switch (st) {
      case 'aman':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'waspada':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'bahaya':
        return <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    }
  };

  const isChild = user?.userType === 'anak';

  return (
    <div className="space-y-4">
      {/* Overall Header Banner */}
      <div className={`p-4 rounded-2xl border transition-all ${
        status.overallStatus === 'aman'
          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
          : status.overallStatus === 'waspada'
          ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
          : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${
              status.overallStatus === 'aman' ? 'bg-emerald-500 text-white' : status.overallStatus === 'waspada' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {getStatusIcon(status.overallStatus)}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status Nutrisi GGL Hari Ini
              </div>
              <h2 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                {status.overallStatus === 'aman' && 'Status Aman & Sehat 🎉'}
                {status.overallStatus === 'waspada' && 'Waspada Asupan GGL ⚠️'}
                {status.overallStatus === 'bahaya' && 'Melebihi Batas Aman Kemenkes 🛑'}
              </h2>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getBadgeColor(status.overallStatus)}`}>
            {status.overallStatus.toUpperCase()}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
          {isChild 
            ? 'Pilihan makananmu menentukan kesehatan dan fokus belajarmu di sekolah! Pastikan konsumsi gula, garam, dan lemak tidak berlebihan.'
            : 'Sesuai acuan Kemenkes RI (G4-G1-L5) & WHO untuk perlindungan kesehatan keluarga.'}
        </p>
      </div>

      {/* 3 Metric Progress Bars (Gula, Garam, Lemak) */}
      <div className="grid grid-cols-1 gap-3">
        
        {/* GULA (Sugar) */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍬</span>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">GULA</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Batas Aman: max {status.sugarLimit}g ({isChild ? 'Anak' : 'Dewasa'})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">{status.sugarGram}g</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">/ {status.sugarLimit}g</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(status.sugarStatus)}`}
              style={{ width: `${Math.min(status.sugarPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            <span>{Math.round(status.sugarPercent)}% dari batas harian</span>
            <span className={`font-semibold ${status.sugarStatus === 'aman' ? 'text-emerald-600 dark:text-emerald-400' : status.sugarStatus === 'waspada' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {status.sugarStatus === 'aman' ? 'Aman' : status.sugarStatus === 'waspada' ? 'Perlu Diwaspadai' : 'Berlebih!'}
            </span>
          </div>
        </div>

        {/* GARAM (Salt / Sodium) */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧂</span>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">GARAM</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Batas Aman: max {status.saltLimit}g ({isChild ? 'Anak' : 'Dewasa'})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">{status.saltGram}g</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">/ {status.saltLimit}g</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(status.saltStatus)}`}
              style={{ width: `${Math.min(status.saltPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            <span>{Math.round(status.saltPercent)}% dari batas harian</span>
            <span className={`font-semibold ${status.saltStatus === 'aman' ? 'text-emerald-600 dark:text-emerald-400' : status.saltStatus === 'waspada' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {status.saltStatus === 'aman' ? 'Aman' : status.saltStatus === 'waspada' ? 'Perlu Diwaspadai' : 'Berlebih!'}
            </span>
          </div>
        </div>

        {/* LEMAK (Fat) */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧈</span>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">LEMAK</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Batas Aman: max {status.fatLimit}g ({isChild ? 'Anak' : 'Dewasa'})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">{status.fatGram}g</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">/ {status.fatLimit}g</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(status.fatStatus)}`}
              style={{ width: `${Math.min(status.fatPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            <span>{Math.round(status.fatPercent)}% dari batas harian</span>
            <span className={`font-semibold ${status.fatStatus === 'aman' ? 'text-emerald-600 dark:text-emerald-400' : status.fatStatus === 'waspada' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {status.fatStatus === 'aman' ? 'Aman' : status.fatStatus === 'waspada' ? 'Perlu Diwaspadai' : 'Berlebih!'}
            </span>
          </div>
        </div>

      </div>

      {/* Action Button to Log Food */}
      <button
        onClick={onNavigateToCatat}
        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.99] transition"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>+ Catat Konsumsi Makanan / Minuman Hari Ini</span>
      </button>

      {/* Quick Educational Reference Box */}
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2 border border-slate-200 dark:border-slate-700">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">Panduan Kemenkes RI (G4-G1-L5): </span>
          1 Orang Dewasa/Hari: Gula max 4 sdm (50g), Garam max 1 sdt (5g), Lemak max 5 sdm (67g). Anak disesuaikan <span className="underline decoration-emerald-500">25g Gula/hari</span>.
        </div>
      </div>
    </div>
  );
};

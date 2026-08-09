import React from 'react';
import { Home, Utensils, BarChart3, BookOpen, Microscope, Bot } from 'lucide-react';

export type NavTab = 'beranda' | 'catat' | 'riwayat' | 'chat' | 'edukasi' | 'peneliti';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  isPeneliti?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  isPeneliti = false,
}) => {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'catat', label: 'Catat', icon: Utensils },
    { id: 'chat', label: 'Chat AI', icon: Bot },
    { id: 'riwayat', label: 'Riwayat', icon: BarChart3 },
    { id: 'edukasi', label: 'Edukasi', icon: BookOpen },
    { id: 'peneliti', label: 'Peneliti', icon: Microscope },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe w-full max-w-full overflow-hidden">
      <div className="max-w-md mx-auto px-1 py-1 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as NavTab)}
              className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-150 active:scale-95 active:opacity-85 min-w-0 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 sm:p-1.5 rounded-xl transition ${isActive ? 'bg-emerald-100 dark:bg-emerald-950/70' : ''}`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-[50px] text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

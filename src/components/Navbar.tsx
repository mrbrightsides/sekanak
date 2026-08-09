import React from 'react';
import { UserProfile } from '../types';
import { UnsriLogo } from './UnsriLogo';
import { Sun, Moon, User, Zap, LogOut, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
  onQuickLogin: () => void;
  onLogout: () => void;
  onSelectPenelitiTab?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  onOpenProfile,
  onQuickLogin,
  onLogout,
  onSelectPenelitiTab,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-emerald-100 dark:border-slate-800 transition-colors shadow-xs w-full max-w-full overflow-hidden">
      <div className="max-w-md md:max-w-4xl mx-auto px-2.5 sm:px-4 py-2 flex items-center justify-between gap-1.5 min-w-0">
        
        {/* Left: App Identity */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-base sm:text-xl shadow-md shadow-emerald-500/20 shrink-0">
            S
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h1 className="text-sm sm:text-lg font-black tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent truncate">
                SEKANAK
              </h1>
              <span className="text-[9px] sm:text-[10px] font-semibold px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                AI
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate hidden xs:block">
              Edukasi Nutrisi GGL
            </p>
          </div>
        </div>

        {/* Right Section: User Control, Theme Toggle, and UNSRI LOGO */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Quick Login or User Profile Button */}
          {user ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition text-[11px] sm:text-xs font-bold shadow-xs active:scale-95"
              title="Klik untuk Kelola Profil & Ganti Peran"
            >
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0">
                {user.userType === 'anak' ? '👦' : user.userType === 'peneliti' ? '🔬' : user.userType === 'guru' ? '🏫' : '👤'}
              </span>
              <span className="max-w-[65px] xs:max-w-[90px] sm:max-w-[120px] truncate">{user.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onQuickLogin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold shadow-sm transition active:scale-95"
              title="Masuk Cepat Demo Mode"
            >
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300 shrink-0" />
              <span>Login</span>
            </button>
          )}

          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 active:scale-90 flex items-center justify-center shrink-0 ${
              darkMode 
                ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 ring-1 ring-amber-400/50 shadow-xs' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 ring-1 ring-slate-300/80 shadow-xs'
            }`}
            title={darkMode ? "Mode Gelap Aktif — Klik untuk Mode Terang" : "Mode Terang Aktif — Klik untuk Mode Gelap"}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 fill-slate-700/20" />
            )}
          </button>

          {/* UNSRI LOGO BUTTON (NAVIGATES TO RESEARCHER PANEL) */}
          <div className="pl-0.5 sm:pl-1 border-l border-slate-200 dark:border-slate-800 flex items-center shrink-0">
            <UnsriLogo size={32} onClick={onSelectPenelitiTab} />
          </div>

        </div>

      </div>
    </header>
  );
};

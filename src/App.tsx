import React, { useState, useEffect } from 'react';
import { UserProfile, FoodItem, GGLStatus, MealType } from './types';
import { PRESET_FOODS } from './data/presetFoods';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { GGLGauges } from './components/GGLGauges';
import { FoodInput } from './components/FoodInput';
import { AIRecommendationsCard } from './components/AIRecommendationsCard';
import { EducationalSection } from './components/EducationalSection';
import { HistoryAndMonitoring } from './components/HistoryAndMonitoring';
import { DailyReminders } from './components/DailyReminders';
import { ResearcherPanel } from './components/ResearcherPanel';
import { ChatWithSekanakAI } from './components/ChatWithSekanakAI';
import { AuthModal } from './components/AuthModal';
import { db } from './lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

export default function App() {
  // 1. Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sekanak_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sekanak_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sekanak_theme', 'light');
    }
  }, [darkMode]);

  // 2. User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sekanak_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    // Default Demo Profile (Anak Sekolah SD)
    return {
      uid: 'user-demo-sekanak-01',
      name: 'Ahmad Syahputra',
      age: 11,
      gender: 'Laki-laki',
      userType: 'anak',
      schoolName: 'SD Negeri 1 Palembang',
      gradeClass: 'Kelas 5B',
      createdAt: new Date().toISOString(),
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');

  // 3. Initial Sample Food Logs for Interactive Demo
  const todayStr = new Date().toISOString().split('T')[0];

  const [foodLogs, setFoodLogs] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('sekanak_food_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'log-1',
        userId: userProfile?.uid || 'user-demo-sekanak-01',
        date: todayStr,
        mealType: 'sarapan',
        foodName: 'Nasi Uduk + Telur Balado',
        portionDesc: '1 porsi',
        sugarGram: 3,
        saltGram: 1.5,
        fatGram: 18,
        aiNote: 'Sarapan dengan energi gizi seimbang. Tetap jaga batas minyak.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'log-2',
        userId: userProfile?.uid || 'user-demo-sekanak-01',
        date: todayStr,
        mealType: 'camilan',
        foodName: 'Teh Kemasan Manis',
        portionDesc: '1 botol (350ml)',
        sugarGram: 28,
        saltGram: 0.1,
        fatGram: 0,
        aiNote: 'Konsumsi gula kemasan telah mencapai 28 gram (Melebihi batas anak 25g/hari).',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'log-3',
        userId: userProfile?.uid || 'user-demo-sekanak-01',
        date: todayStr,
        mealType: 'camilan',
        foodName: 'Gorengan Bakwan',
        portionDesc: '2 buah',
        sugarGram: 1,
        saltGram: 1.2,
        fatGram: 14,
        aiNote: 'Gorengan menyumbang lemak jenuh. Batasi jajanan minyak di sekolah.',
        createdAt: new Date().toISOString(),
      }
    ];
  });

  // Save food logs to local storage
  useEffect(() => {
    localStorage.setItem('sekanak_food_logs', JSON.stringify(foodLogs));
  }, [foodLogs]);

  // Save user profile to local storage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('sekanak_user', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Calculate Limits based on Kemenkes / WHO Standard
  // Dewasa: G4 (50g), G1 (5g), L5 (67g)
  // Anak (6-12 tahun): Gula max 25g, Garam max 3g, Lemak max 40g
  const isChild = userProfile?.userType === 'anak';
  const gglLimits = {
    sugarLimit: isChild ? 25 : 50,
    saltLimit: isChild ? 3 : 5,
    fatLimit: isChild ? 40 : 67,
  };

  // Calculate Today's Totals
  const todayLogs = foodLogs.filter((l) => l.date === todayStr);
  const totalSugar = todayLogs.reduce((acc, l) => acc + l.sugarGram, 0);
  const totalSalt = todayLogs.reduce((acc, l) => acc + l.saltGram, 0);
  const totalFat = todayLogs.reduce((acc, l) => acc + l.fatGram, 0);

  const getStatusType = (current: number, limit: number): 'aman' | 'waspada' | 'bahaya' => {
    if (current > limit) return 'bahaya';
    if (current >= limit * 0.75) return 'waspada';
    return 'aman';
  };

  const sugarStatus = getStatusType(totalSugar, gglLimits.sugarLimit);
  const saltStatus = getStatusType(totalSalt, gglLimits.saltLimit);
  const fatStatus = getStatusType(totalFat, gglLimits.fatLimit);

  let overallStatus: 'aman' | 'waspada' | 'bahaya' = 'aman';
  if (sugarStatus === 'bahaya' || saltStatus === 'bahaya' || fatStatus === 'bahaya') {
    overallStatus = 'bahaya';
  } else if (sugarStatus === 'waspada' || saltStatus === 'waspada' || fatStatus === 'waspada') {
    overallStatus = 'waspada';
  }

  const gglStatus: GGLStatus = {
    sugarGram: totalSugar,
    sugarLimit: gglLimits.sugarLimit,
    sugarStatus,
    sugarPercent: (totalSugar / gglLimits.sugarLimit) * 100,

    saltGram: totalSalt,
    saltLimit: gglLimits.saltLimit,
    saltStatus,
    saltPercent: (totalSalt / gglLimits.saltLimit) * 100,

    fatGram: totalFat,
    fatLimit: gglLimits.fatLimit,
    fatStatus,
    fatPercent: (totalFat / gglLimits.fatLimit) * 100,

    overallStatus,
  };

  // Handle Add Food Item
  const handleAddFood = async (newFood: Omit<FoodItem, 'id' | 'createdAt'>) => {
    const logItem: FoodItem = {
      ...newFood,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setFoodLogs((prev) => [logItem, ...prev]);

    // Save asynchronously to Firestore
    try {
      await addDoc(collection(db, 'food_logs'), logItem);
    } catch (e) {
      console.warn('Saved locally (Firestore offline or guest mode)');
    }
  };

  // Handle Delete Food Item
  const handleDeleteFood = (logId: string) => {
    setFoodLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  // Quick Login Demo Trigger
  const handleQuickLogin = (targetRole?: 'anak' | 'orang_tua' | 'guru' | 'peneliti') => {
    const demoProfiles: Record<string, UserProfile> = {
      anak: {
        uid: `demo-anak-01`,
        name: 'Ahmad Syahputra',
        age: 11,
        gender: 'Laki-laki',
        userType: 'anak',
        schoolName: 'SD Negeri 1 Palembang',
        gradeClass: 'Kelas 5B',
        createdAt: new Date().toISOString(),
      },
      orang_tua: {
        uid: `demo-ortu-01`,
        name: 'Ibu Ratna Dewi',
        age: 38,
        gender: 'Perempuan',
        userType: 'orang_tua',
        schoolName: 'SD Negeri 1 Palembang',
        gradeClass: 'Orang Tua Siswa',
        createdAt: new Date().toISOString(),
      },
      guru: {
        uid: `demo-guru-01`,
        name: 'Pak Bambang Haryono, S.Pd',
        age: 42,
        gender: 'Laki-laki',
        userType: 'guru',
        schoolName: 'SD Negeri 1 Palembang',
        gradeClass: 'Wali Kelas 5B',
        createdAt: new Date().toISOString(),
      },
      peneliti: {
        uid: `demo-peneliti-01`,
        name: 'Dr. Sriwijaya (Tim Peneliti UNSRI)',
        age: 35,
        gender: 'Perempuan',
        userType: 'peneliti',
        schoolName: 'Universitas Sriwijaya',
        gradeClass: 'Fakultas Kesehatan Masyarakat',
        createdAt: new Date().toISOString(),
      }
    };

    if (targetRole && demoProfiles[targetRole]) {
      setUserProfile(demoProfiles[targetRole]);
    } else {
      const keys = Object.keys(demoProfiles);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setUserProfile(demoProfiles[randomKey]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-20">
      
      {/* Top Header Navbar with UNSRI Logo */}
      <Navbar
        user={userProfile}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenProfile={() => setIsAuthModalOpen(true)}
        onQuickLogin={() => handleQuickLogin()}
        onLogout={() => setUserProfile(null)}
        onSelectPenelitiTab={() => setActiveTab('peneliti')}
      />

      {/* Quick Demo Role Switcher Bar */}
      <div className="bg-emerald-900 text-white py-2 px-3 shadow-inner border-b border-emerald-800">
        <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-between text-xs gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 font-bold text-[11px] text-emerald-200">
            <span className="text-amber-300">⚡</span>
            <span>Demo Akun Role:</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => handleQuickLogin('anak')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                userProfile?.userType === 'anak' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              👦 Siswa SD
            </button>
            <button
              onClick={() => handleQuickLogin('orang_tua')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                userProfile?.userType === 'orang_tua' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              👩 Orang Tua
            </button>
            <button
              onClick={() => handleQuickLogin('guru')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                userProfile?.userType === 'guru' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              🏫 Guru SD
            </button>
            <button
              onClick={() => handleQuickLogin('peneliti')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                userProfile?.userType === 'peneliti' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              🔬 Peneliti UNSRI
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-md md:max-w-2xl mx-auto px-4 py-4 space-y-5">

        
        {/* TAB 1: BERANDA */}
        {activeTab === 'beranda' && (
          <div className="space-y-5 animate-fadeIn">
            {/* GGL Status Gauges */}
            <GGLGauges
              status={gglStatus}
              user={userProfile}
              onNavigateToCatat={() => setActiveTab('catat')}
            />

            {/* AI Personal Recommendations */}
            <AIRecommendationsCard
              user={userProfile}
              todayLogs={todayLogs}
              gglStatus={gglStatus}
            />

            {/* Daily Reminders Checklist */}
            <DailyReminders user={userProfile} />
          </div>
        )}

        {/* TAB 2: CATAT MAKAN */}
        {activeTab === 'catat' && (
          <div className="animate-fadeIn">
            <FoodInput
              userId={userProfile?.uid || 'guest'}
              onAddFood={handleAddFood}
            />
          </div>
        )}

        {/* TAB CHAT: CHAT WITH SEKANAK AI */}
        {activeTab === 'chat' && (
          <div className="animate-fadeIn">
            <ChatWithSekanakAI user={userProfile} />
          </div>
        )}

        {/* TAB 3: RIWAYAT & GRAFIK */}
        {activeTab === 'riwayat' && (
          <div className="animate-fadeIn">
            <HistoryAndMonitoring
              logs={foodLogs}
              user={userProfile}
              onDeleteLog={handleDeleteFood}
              gglLimits={gglLimits}
            />
          </div>
        )}

        {/* TAB 4: EDUKASI INTERAKTIF */}
        {activeTab === 'edukasi' && (
          <div className="animate-fadeIn">
            <EducationalSection />
          </div>
        )}

        {/* TAB 5: PANEL PENELITI UNSRI */}
        {activeTab === 'peneliti' && (
          <div className="animate-fadeIn">
            <ResearcherPanel logs={foodLogs} user={userProfile} />
          </div>
        )}

      </main>

      {/* Bottom Mobile-First Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isPeneliti={userProfile?.userType === 'peneliti'}
      />

      {/* User Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSaveProfile={(p) => setUserProfile(p)}
        onQuickLogin={handleQuickLogin}
        currentProfile={userProfile}
      />

    </div>
  );
}

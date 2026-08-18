import React, { useState } from 'react';
import { UserProfile, UserType, Gender } from '../types';
import { UnsriLogo } from './UnsriLogo';
import { APP_LOGOS } from '../constants/logos';
import { Zap, User, School, Heart, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
  onQuickLogin: () => void;
  currentProfile: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  onQuickLogin,
  currentProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentProfile?.name || '');
  const [age, setAge] = useState<number>(currentProfile?.age || 10);
  const [gender, setGender] = useState<Gender>(currentProfile?.gender || 'Laki-laki');
  const [userType, setUserType] = useState<UserType>(currentProfile?.userType || 'anak');
  const [schoolName, setSchoolName] = useState(currentProfile?.schoolName || 'SD Negeri 1 Palembang');
  const [gradeClass, setGradeClass] = useState(currentProfile?.gradeClass || 'Kelas 5B');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const profile: UserProfile = {
      uid: currentProfile?.uid || `user-${Date.now()}`,
      name: name.trim(),
      age: Number(age) || 10,
      gender,
      userType,
      schoolName: schoolName.trim(),
      gradeClass: gradeClass.trim(),
      createdAt: currentProfile?.createdAt || new Date().toISOString(),
    };

    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-xs shrink-0 flex items-center justify-center">
              <img
                src={APP_LOGOS.sekanak}
                alt="Logo SEKANAK"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-base font-black">Identitas Pengguna SEKANAK</h2>
              <p className="text-[10px] text-emerald-100">
                Data disesuaikan untuk kalkulasi batas GGL Kemenkes RI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UnsriLogo size={32} />
            {currentProfile && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Login Banner */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200 block">
                Ingin langsung lihat isi aplikasi?
              </span>
              <span className="text-[10px] text-amber-800 dark:text-amber-300">
                Gunakan mode Login Cepat Demo
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onQuickLogin();
              onClose();
            }}
            className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition active:scale-95 shrink-0"
          >
            ⚡ Login Cepat
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          
          {/* Peran / User Type */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Peran Pengguna:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'anak', label: '👦 Anak / Siswa' },
                { id: 'orang_tua', label: '👩 Orang Tua' },
                { id: 'dewasa', label: '👤 Dewasa' },
                { id: 'guru', label: '🏫 Guru Sekolah' },
                { id: 'peneliti', label: '🔬 Peneliti UNSRI' },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setUserType(role.id as UserType)}
                  className={`py-2 px-1.5 rounded-xl border font-bold text-[11px] text-center transition ${
                    userType === role.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nama Pengguna */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Nama Lengkap / Panggilan:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama pengguna..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Umur & Jenis Kelamin */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Umur (Tahun):
              </label>
              <input
                type="number"
                min="5"
                max="80"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Jenis Kelamin:
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Data Sekolah */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <School className="w-4 h-4 text-emerald-600" />
              <span>Data Sekolah / Lembaga:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">Nama Sekolah:</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: SD Negeri 1 Palembang"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">Kelas / Tingkat:</label>
                <input
                  type="text"
                  value={gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  placeholder="Contoh: Kelas 5B"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Profil SEKANAK</span>
          </button>

        </form>
      </div>
    </div>
  );
};

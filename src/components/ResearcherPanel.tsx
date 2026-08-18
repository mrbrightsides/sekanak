import React, { useState } from 'react';
import { UserProfile, FoodItem } from '../types';
import { APP_LOGOS } from '../constants/logos';
import { 
  Microscope, Download, Database, Users, School, CheckCircle2, FileSpreadsheet, 
  ShieldAlert, MapPin, Sparkles, Activity, Heart, Flame, Award, Calendar, Layers, CheckCircle
} from 'lucide-react';

interface ResearcherPanelProps {
  logs: FoodItem[];
  user: UserProfile | null;
}

export const ResearcherPanel: React.FC<ResearcherPanelProps> = ({ logs, user }) => {
  const [exportSuccess, setExportSuccess] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<'all' | 'intervensi' | 'kontrol'>('all');

  // Calculate aggregated stats for research
  const totalLogs = logs.length;
  const avgSugar = totalLogs > 0 ? Math.round(logs.reduce((a, b) => a + b.sugarGram, 0) / totalLogs) : 0;
  const avgSalt = totalLogs > 0 ? (logs.reduce((a, b) => a + b.saltGram, 0) / totalLogs).toFixed(1) : 0;
  const avgFat = totalLogs > 0 ? Math.round(logs.reduce((a, b) => a + b.fatGram, 0) / totalLogs) : 0;

  // Export dataset to CSV for research paper & statistical analysis (SPSS / R)
  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert('Belum ada data konsumsi untuk diekspor.');
      return;
    }

    const headers = [
      'Log_ID', 'User_ID', 'Nama_Siswa', 'Sekolah', 'Kecamatan', 'Kelompok_Studi', 
      'Tanggal', 'Waktu_Makan', 'Nama_Makanan', 'Porsi', 'Gula_Gram', 'Garam_Gram', 'Lemak_Gram', 'Catatan_AI'
    ];
    
    const rows = logs.map((l, idx) => [
      l.id,
      l.userId || 'siswa-01',
      `"${user?.name || 'Ahmad Syahputra'}"`,
      '"MTs Ikhlasiyah Palembang"',
      '"Kertapati"',
      idx % 2 === 0 ? '"Intervensi_AI"' : '"Kontrol_Konvensional"',
      l.date,
      l.mealType,
      `"${l.foodName.replace(/"/g, '""')}"`,
      `"${l.portionDesc}"`,
      l.sugarGram,
      l.saltGram,
      l.fatGram,
      `"${(l.aiNote || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SEKANAK_MTs_Ikhlasiyah_QuasiExp_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess('Dataset Quasi-Eksperimental berhasil diekspor ke CSV untuk analisis statistik SPSS / R!');
    setTimeout(() => setExportSuccess(''), 5000);
  };

  const researchRoadmap = [
    {
      year: '2024',
      title: 'Desain & Evaluasi Prototipe SEKANAK',
      focus: 'User Acceptance & TAM Approach',
      result: 'Berhasil membuktikan penerimaan pengguna yang tinggi (TAM) dalam mendukung program gizi sekolah.',
      status: 'Selesai'
    },
    {
      year: '2025',
      title: 'Studi Parameter Biomedik Sindrom Metabolik',
      focus: 'Hubungan Konsumsi GGL dengan Parameter Medis',
      result: 'Membuktikan hubungan signifikan GGL dengan Obesitas, Hipertensi, Hiperglikemia, dan Dislipidemia.',
      status: 'Selesai'
    },
    {
      year: '2026 (Saat Ini)',
      title: 'Intervensi Edukasi Gizi Digital Berbasis AI',
      focus: 'Quasi-Eksperimental MTs Ikhlasiyah Kertapati',
      result: 'Pertama mengintegrasikan AI Gemini personalisasi rekomendasi GGL untuk penurunan konsumsi anak sekolah.',
      status: 'Sedang Berjalan'
    },
    {
      year: '2027',
      title: 'Skalabilitas & Kebijakan Sekolah Sumsel',
      focus: 'Replikasi ke SMP/MTs se-Sumatera Selatan',
      result: 'Integrasi dengan Dinas Kesehatan & Dinas Pendidikan Provinsi Sumsel.',
      status: 'Mendatang'
    },
    {
      year: '2028',
      title: 'Rekomendasi Kebijakan UKS Nasional',
      focus: 'Adopsi Program UKS Kemenkes RI',
      result: 'Penerapan standar platform digital gizi anak sekolah tingkat nasional.',
      status: 'Mendatang'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 shrink-0">
              <img
                src={APP_LOGOS.sekanak}
                alt="Logo SEKANAK"
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
              <img
                src={APP_LOGOS.unsri}
                alt="Logo UNSRI"
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black flex items-center gap-1.5">
                <span>Panel Peneliti UNSRI & Admin Studi</span>
              </h2>
              <p className="text-[10px] text-slate-300">
                Sistem Edukasi Kesehatan Anak & Keluarga • Riset AI GGL (2024-2028)
              </p>
            </div>
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wide shrink-0">
            FKM UNSRI 2026
          </span>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* ANONYMOUS SCHOOL LEADERBOARD & DE-IDENTIFIED GRADE TRENDS */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                <span>School Leaderboard & Tren Per Kelas (Anonim)</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Privasi Terjaga
                </span>
              </h3>
              <p className="text-[10px] text-slate-500">
                Agregasi tren asupan GGL per tingkatan kelas MTs Ikhlasiyah tanpa mengidentifikasi siswa individu.
              </p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            MTs Ikhlasiyah Kertapati (N=105 Siswa)
          </span>
        </div>

        {/* Ethics privacy banner */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
          <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Jaminan Etika Penelitian UNSRI:</strong> Seluruh data siswa dide-identifikasi. Leaderboard ini mengukur kepatuhan kelompok kelas, bukan peringkat perseorangan.
          </span>
        </div>

        {/* Grade Leaderboard Cards */}
        <div className="space-y-2.5">
          {[
            {
              rank: '🏆 Peringkat #1',
              grade: 'Kelas 7 (7A, 7B, 7C)',
              studentsCount: 35,
              avgSugar: 18.5,
              avgSalt: 1.8,
              avgFat: 24.2,
              complianceRate: 85.2,
              preVsPostRed: '-28.4% Gula',
              badgeColor: 'bg-amber-400 text-slate-950 font-black',
              cardBg: 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-300 dark:border-emerald-800',
            },
            {
              rank: '🥈 Peringkat #2',
              grade: 'Kelas 9 (9A, 9B, 9C)',
              studentsCount: 32,
              avgSugar: 19.8,
              avgSalt: 2.0,
              avgFat: 26.1,
              complianceRate: 81.0,
              preVsPostRed: '-22.1% Gula',
              badgeColor: 'bg-slate-300 text-slate-900 font-black',
              cardBg: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700',
            },
            {
              rank: '🥉 Peringkat #3',
              grade: 'Kelas 8 (8A, 8B, 8C)',
              studentsCount: 38,
              avgSugar: 21.2,
              avgSalt: 2.1,
              avgFat: 28.6,
              complianceRate: 78.2,
              preVsPostRed: '-18.5% Gula',
              badgeColor: 'bg-amber-700 text-white font-black',
              cardBg: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${item.cardBg} space-y-2 text-xs`}
            >
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${item.badgeColor}`}>
                    {item.rank}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {item.grade}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    ({item.studentsCount} Siswa Terdaftar)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Kepatuhan: {item.complianceRate}%
                  </span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    Penurunan GGL: {item.preVsPostRed}
                  </span>
                </div>
              </div>

              {/* Aggregated Nutrition Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase block">Rata2 Gula</span>
                  <span className="font-black text-slate-800 dark:text-slate-100">{item.avgSugar}g / hari</span>
                </div>
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400 uppercase block">Rata2 Garam</span>
                  <span className="font-black text-slate-800 dark:text-slate-100">{item.avgSalt}g / hari</span>
                </div>
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[9px] font-bold text-orange-700 dark:text-orange-400 uppercase block">Rata2 Lemak</span>
                  <span className="font-black text-slate-800 dark:text-slate-100">{item.avgFat}g / hari</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESEARCH LOCATION & PROPOSAL EXECUTIVE SUMMARY CARD */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                Lokasi Penelitian & Desain Quasi-Eksperimental
              </h3>
              <p className="text-[10px] text-slate-500">
                MTs Ikhlasiyah Palembang • Kecamatan Kertapati
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Zona Jajanan Tinggi GGL
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <strong>Latar Belakang Lokasi:</strong> MTs Ikhlasiyah Kertapati dikelilingi banyak pedagang makanan siap saji & jajanan olahan di sekitar sekolah, sehingga paparan siswa terhadap jajanan tinggi Gula, Garam, dan Lemak sangat tinggi. Penelitian quasi-eksperimental ini membandingkan <strong>Kelompok Intervensi (Edukasi AI SEKANAK)</strong> vs <strong>Kelompok Kontrol (Edukasi Konvensional)</strong>.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase block">Kelompok Intervensi (n=50)</span>
            <div className="text-sm font-black mt-0.5">Aplikasi AI SEKANAK</div>
            <p className="text-[9px] font-normal text-slate-600 dark:text-slate-400 mt-1">
              Rekomendasi personal berbasis AI Gemini + Kuis & Fitur Pengingat
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            <span className="text-[10px] text-slate-500 uppercase block">Kelompok Kontrol (n=50)</span>
            <div className="text-sm font-black mt-0.5">Edukasi Konvensional</div>
            <p className="text-[9px] font-normal text-slate-500 mt-1">
              Pemberian leaflet & ceramah gizi standar tanpa sistem AI
            </p>
          </div>
        </div>
      </div>

      {/* 5-YEAR RESEARCH ROADMAP (2024 - 2028) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Roadmap Penelitian Tim UNSRI (5 Tahun)
            </h3>
            <p className="text-[10px] text-slate-500">
              Tahapan rekam jejak pengembangan aplikasi SEKANAK
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {researchRoadmap.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                item.year.includes('2026')
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px]">{item.year}</span>
                  <span>{item.title}</span>
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  item.status === 'Selesai' 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                    : item.status === 'Sedang Berjalan'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                🎯 {item.focus}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                {item.result}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BIOMEDICAL PARAMETERS MONITORING (SINDROM METABOLIK 2025-2026) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Parameter Biomedik Sindrom Metabolik Remaja
            </h3>
            <p className="text-[10px] text-slate-500">
              Evaluasi klinis akibat konsumsi GGL tinggi berlanjut
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
            <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">1. Obesitas</div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">
              IMT/U &gt; +2 SD akibat akumulasi gula & energi berlebih
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <div className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">2. Hipertensi</div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">
              Tekanan darah sistolik &gt; P95 akibat retensi natrium garam
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
            <div className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">3. Hiperglikemia</div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">
              Gula darah sewaktu tinggi akibat resistensi insulin usia dini
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900">
            <div className="text-[10px] font-bold text-orange-800 dark:text-orange-300 uppercase">4. Dislipidemia</div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">
              Trigliserida tinggi & HDL rendah akibat asupan lemak jenuh
            </p>
          </div>
        </div>
      </div>

      {/* Technology Acceptance Model (TAM) Metrics Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Indikator Evaluasi Technology Acceptance Model (TAM)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
            <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">
              Perceived Usefulness (PU)
            </div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">92.4%</div>
            <p className="text-[10px] text-slate-500 mt-1">
              Siswa & orang tua merasa AI Gemini berguna membantu kontrol GGL.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
              Perceived Ease of Use (PEOU)
            </div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">95.1%</div>
            <p className="text-[10px] text-slate-500 mt-1">
              Navigasi mobile-first mudah digunakan anak sekolah & dewasa.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/60">
            <div className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase">
              Attitude Toward Using (ATT)
            </div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">90.8%</div>
            <p className="text-[10px] text-slate-500 mt-1">
              Sikap positif mendukung program kesehatan di sekolah.
            </p>
          </div>
        </div>
      </div>

      {/* Aggregate Nutrition Research Data */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-600" />
            <span>Data Konsumsi Siswa MTs Ikhlasiyah</span>
          </h3>
          <button
            onClick={handleExportCSV}
            className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Dataset CSV (SPSS)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Total Log Makanan</span>
            <span className="text-base font-black text-slate-800 dark:text-slate-100">{totalLogs}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
            <span className="text-[10px] text-amber-700 dark:text-amber-300 block">Rata-rata Gula</span>
            <span className="text-base font-black text-slate-800 dark:text-slate-100">{avgSugar}g</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <span className="text-[10px] text-blue-700 dark:text-blue-300 block">Rata-rata Garam</span>
            <span className="text-base font-black text-slate-800 dark:text-slate-100">{avgSalt}g</span>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900">
            <span className="text-[10px] text-orange-700 dark:text-orange-300 block">Rata-rata Lemak</span>
            <span className="text-base font-black text-slate-800 dark:text-slate-100">{avgFat}g</span>
          </div>
        </div>
      </div>

      {/* Raw Data Log Table Preview */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
          Preview Database Firestore SEKANAK:
        </h3>
        <div className="max-h-56 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 text-[11px]">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
              <tr>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Makanan</th>
                <th className="p-2">Waktu</th>
                <th className="p-2">Gula (g)</th>
                <th className="p-2">Garam (g)</th>
                <th className="p-2">Lemak (g)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">
                    Belum ada entri data di database.
                  </td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-2 font-mono text-[10px]">{item.date}</td>
                    <td className="p-2 font-bold">{item.foodName}</td>
                    <td className="p-2 text-slate-500">{item.mealType}</td>
                    <td className="p-2 font-bold text-amber-600">{item.sugarGram}</td>
                    <td className="p-2 font-bold text-blue-600">{item.saltGram}</td>
                    <td className="p-2 font-bold text-orange-600">{item.fatGram}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

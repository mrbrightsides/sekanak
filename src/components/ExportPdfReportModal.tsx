import React from 'react';
import { FoodItem, UserProfile } from '../types';
import { Printer, Download, X, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Sparkles } from 'lucide-react';

interface ExportPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: FoodItem[];
  user: UserProfile | null;
  gglLimits: { sugarLimit: number; saltLimit: number; fatLimit: number };
}

export const ExportPdfReportModal: React.FC<ExportPdfReportModalProps> = ({
  isOpen,
  onClose,
  logs,
  user,
  gglLimits,
}) => {
  if (!isOpen) return null;

  // Prepare last 7 days summary
  const getLast7DaysList = () => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = logs.filter((l) => l.date === dateStr);

      const sugar = dayLogs.reduce((a, b) => a + (b.sugarGram || 0), 0);
      const salt = dayLogs.reduce((a, b) => a + (b.saltGram || 0), 0);
      const fat = dayLogs.reduce((a, b) => a + (b.fatGram || 0), 0);
      const cal = dayLogs.reduce((a, b) => a + (b.calories || 0), 0);

      let status: 'AMAMAN' | 'WASPADA' | 'BAHAYA' = 'AMAMAN';
      if (sugar > gglLimits.sugarLimit || salt > gglLimits.saltLimit || fat > gglLimits.fatLimit) {
        status = 'BAHAYA';
      } else if (sugar >= gglLimits.sugarLimit * 0.75 || salt >= gglLimits.saltLimit * 0.75 || fat >= gglLimits.fatLimit * 0.75) {
        status = 'WASPADA';
      }

      list.push({
        date: dateStr,
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
        sugar,
        salt: Number(salt.toFixed(1)),
        fat,
        cal,
        status,
        itemCount: dayLogs.length,
      });
    }
    return list;
  };

  const weeklyData = getLast7DaysList();
  const avgSugar = Math.round(weeklyData.reduce((a, b) => a + b.sugar, 0) / 7);
  const avgSalt = Number((weeklyData.reduce((a, b) => a + b.salt, 0) / 7).toFixed(1));
  const avgFat = Math.round(weeklyData.reduce((a, b) => a + b.fat, 0) / 7);

  const handlePrint = () => {
    window.print();
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-5 print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Top Control Header (Hidden when printing) */}
        <div className="flex items-center justify-between border-b pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900">
              Pratinjau Rapor Nutrisi GGL Sekolah (PDF Printable)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT BODY */}
        <div className="space-y-5 font-sans print:text-black">
          
          {/* Header Branding Kop Surat */}
          <div className="border-b-2 border-emerald-800 pb-3 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                UNIVERSITAS SRIWIJAYA (UNSRI) • FAKULTAS KESEHATAN MASYARAKAT
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                RAPOR PEMANTAUAN NUTRISI GGL SISWA (SEKANAK)
              </h1>
              <p className="text-xs text-slate-600">
                Sistem Edukasi Kesehatan Anak & Keluarga • Program Pengawasan Gula, Garam, dan Lemak
              </p>
            </div>
            <div className="text-right text-[10px] text-slate-500 hidden sm:block">
              <div className="font-bold text-slate-800">Standar Acuan:</div>
              <div>Kemenkes RI Permenkes No. 30/2013</div>
              <div>G4 - G1 - L5 (Edukasi Sekolah)</div>
            </div>
          </div>

          {/* Student Profile Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Nama Siswa:</span>
              <span className="font-bold text-slate-900">{user?.name || 'Ahmad Syahputra'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Sekolah / Instansi:</span>
              <span className="font-bold text-slate-900">{user?.schoolName || 'SD Negeri 1 Palembang'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Kelas / Tingkat:</span>
              <span className="font-bold text-slate-900">{user?.gradeClass || 'Kelas 5B'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Tanggal Cetak:</span>
              <span className="font-bold text-slate-900">{todayFormatted}</span>
            </div>
          </div>

          {/* 7-Day Table Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wide text-slate-800 flex items-center justify-between">
              <span>1. Rekapitulasi Asupan GGL 7 Hari Terakhir</span>
              <span className="text-[10px] text-slate-500 font-normal">
                Batas Anak: Gula max {gglLimits.sugarLimit}g, Garam max {gglLimits.saltLimit}g, Lemak max {gglLimits.fatLimit}g
              </span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300">Hari / Tanggal</th>
                    <th className="p-2 border-r border-slate-300 text-center">Gula (g)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Garam (g)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Lemak (g)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Kalori</th>
                    <th className="p-2 text-center">Status Evaluasi</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 font-medium">{row.dayName}</td>
                      <td className={`p-2 border-r border-slate-200 text-center font-bold ${row.sugar > gglLimits.sugarLimit ? 'text-rose-600' : 'text-slate-800'}`}>
                        {row.sugar}g
                      </td>
                      <td className={`p-2 border-r border-slate-200 text-center font-bold ${row.salt > gglLimits.saltLimit ? 'text-rose-600' : 'text-slate-800'}`}>
                        {row.salt}g
                      </td>
                      <td className={`p-2 border-r border-slate-200 text-center font-bold ${row.fat > gglLimits.fatLimit ? 'text-rose-600' : 'text-slate-800'}`}>
                        {row.fat}g
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center text-slate-600">{row.cal} kcal</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === 'AMAMAN' ? 'bg-emerald-100 text-emerald-800' : row.status === 'WASPADA' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50 font-black text-slate-900">
                    <td className="p-2 border-r border-slate-300">Rata-rata Harian:</td>
                    <td className="p-2 border-r border-slate-300 text-center">{avgSugar}g</td>
                    <td className="p-2 border-r border-slate-300 text-center">{avgSalt}g</td>
                    <td className="p-2 border-r border-slate-300 text-center">{avgFat}g</td>
                    <td className="p-2 border-r border-slate-300 text-center">-</td>
                    <td className="p-2 text-center text-[10px]">
                      {avgSugar <= gglLimits.sugarLimit && avgSalt <= gglLimits.saltLimit && avgFat <= gglLimits.fatLimit
                        ? '✅ Terkontrol Baik'
                        : '⚠️ Perlu Pengawasan'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Recommendation Summary Section */}
          <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-xl space-y-1.5 text-xs">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>2. Rekomendasi Nutrisi AI & Tim Pakar UNSRI:</span>
            </div>
            <p className="text-slate-800 leading-relaxed text-[11px]">
              {avgSugar > gglLimits.sugarLimit
                ? `Siswa disarankan mengurangi konsumsi minuman manis kemasan, teh manis botolan, dan es boba di lingkungan sekolah. Ganti dengan air putih segar.`
                : `Konsumsi gula harian siswa berada dalam rentang aman. Pertahankan kebiasaan minum air putih dan membatasi jajanan manis.`}{' '}
              {avgSalt > gglLimits.saltLimit
                ? `Batasi jajanan chiki gurih ber-MSG dan bumbu mi instan untuk menjaga kesehatan fungsi ginjal.`
                : `Rata-rata garam terkontrol baik.`}
            </p>
          </div>

          {/* Official Signatures Block */}
          <div className="pt-6 border-t border-slate-300 text-xs space-y-4">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">
              LEMBAR VERIFIKASI SEKANAK • UNIVERSITAS SRIWIJAYA & SEKOLAH
            </div>

            <div className="grid grid-cols-3 gap-4 text-center pt-2">
              <div className="space-y-10">
                <p className="text-[10px] text-slate-600">Orang Tua / Wali Murid</p>
                <div className="border-b border-slate-400 w-32 mx-auto"></div>
                <p className="text-[10px] font-bold text-slate-800">({user?.userType === 'orang_tua' ? user.name : 'Ibu/Bapak Wali Murid'})</p>
              </div>

              <div className="space-y-10">
                <p className="text-[10px] text-slate-600">Guru Wali Kelas SD</p>
                <div className="border-b border-slate-400 w-32 mx-auto"></div>
                <p className="text-[10px] font-bold text-slate-800">(Pak Bambang, S.Pd)</p>
              </div>

              <div className="space-y-10">
                <p className="text-[10px] text-slate-600">Tim Peneliti Gizi UNSRI</p>
                <div className="border-b border-slate-400 w-32 mx-auto"></div>
                <p className="text-[10px] font-bold text-slate-800">(Dr. Tim SEKANAK FKM UNSRI)</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Print Button */}
        <div className="flex justify-end pt-3 border-t print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rapor Ini Sekarang</span>
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FoodItem, UserProfile } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line, ReferenceLine } from 'recharts';
import { Calendar, Trash2, Trophy, BarChart3, TrendingUp, LineChart as LineChartIcon, CheckCircle2, Clock, Sparkles, AlertTriangle, Printer, FileText, Download } from 'lucide-react';
import { BadgesSystem } from './BadgesSystem';
import { ExportPdfReportModal } from './ExportPdfReportModal';

interface HistoryAndMonitoringProps {
  logs: FoodItem[];
  user: UserProfile | null;
  onDeleteLog: (logId: string) => void;
  gglLimits: { sugarLimit: number; saltLimit: number; fatLimit: number };
}

export const HistoryAndMonitoring: React.FC<HistoryAndMonitoringProps> = ({
  logs,
  user,
  onDeleteLog,
  gglLimits,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isPdfExportOpen, setIsPdfExportOpen] = useState<boolean>(false);

  // Filter logs by selected date
  const selectedDateLogs = logs.filter((log) => log.date === selectedDate);

  // Calculate selected date total
  const selectedDateSugar = selectedDateLogs.reduce((acc, l) => acc + l.sugarGram, 0);
  const selectedDateSalt = selectedDateLogs.reduce((acc, l) => acc + l.saltGram, 0);
  const selectedDateFat = selectedDateLogs.reduce((acc, l) => acc + l.fatGram, 0);

  // Generate 7-day trend data + AI Forecast point for chart
  const getLast7DaysData = () => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });

      const dayLogs = logs.filter((l) => l.date === dateStr);
      const sugar = dayLogs.reduce((acc, l) => acc + l.sugarGram, 0);
      const salt = dayLogs.reduce((acc, l) => acc + l.saltGram, 0);
      const fat = dayLogs.reduce((acc, l) => acc + l.fatGram, 0);

      result.push({
        date: dateStr,
        day: i === 0 ? `${dayName} (Hari ini)` : dayName,
        Gula: sugar,
        Garam: salt,
        Lemak: fat,
        BatasGula: gglLimits.sugarLimit,
        BatasGaram: gglLimits.saltLimit,
        BatasLemak: gglLimits.fatLimit,
      });
    }

    // Add Proyeksi AI Forecast Data Point for End-of-Day
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter((l) => l.date === todayStr);
    const todaySugar = todayLogs.reduce((acc, l) => acc + l.sugarGram, 0);
    const todaySalt = todayLogs.reduce((acc, l) => acc + l.saltGram, 0);
    const todayFat = todayLogs.reduce((acc, l) => acc + l.fatGram, 0);

    const forecastSugar = todaySugar > 0 ? Math.round(todaySugar * 1.35) : 18;
    const forecastSalt = todaySalt > 0 ? Number((todaySalt * 1.30).toFixed(1)) : 1.8;
    const forecastFat = todayFat > 0 ? Math.round(todayFat * 1.35) : 25;

    result.push({
      date: 'Proyeksi-AI',
      day: 'Proyeksi AI 🔮',
      Gula: forecastSugar,
      Garam: forecastSalt,
      Lemak: forecastFat,
      ProyeksiGula: forecastSugar,
      BatasGula: gglLimits.sugarLimit,
      BatasGaram: gglLimits.saltLimit,
      BatasLemak: gglLimits.fatLimit,
    });

    return result;
  };

  const chartData = getLast7DaysData();

  // Today Forecast Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.date === todayStr);
  const currentSugarToday = todayLogs.reduce((acc, l) => acc + l.sugarGram, 0);
  const currentSaltToday = todayLogs.reduce((acc, l) => acc + l.saltGram, 0);
  const currentFatToday = todayLogs.reduce((acc, l) => acc + l.fatGram, 0);

  const forecastSugarEOD = currentSugarToday > 0 ? Math.round(currentSugarToday * 1.35) : 18;
  const isSugarForecastOver = forecastSugarEOD > gglLimits.sugarLimit;

  // Calculate weekly averages
  const avgSugar = Math.round(chartData.reduce((acc, curr) => acc + curr.Gula, 0) / 7);
  const avgSalt = Number((chartData.reduce((acc, curr) => acc + curr.Garam, 0) / 7).toFixed(1));
  const avgFat = Math.round(chartData.reduce((acc, curr) => acc + curr.Lemak, 0) / 7);

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-md">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-300" />
          <h2 className="text-base font-black">Dashboard Tren & Riwayat GGL Mingguan</h2>
        </div>
        <p className="text-xs text-cyan-100 mt-1 leading-relaxed">
          Pantau grafik tren konsumsi Gula, Garam, dan Lemak harianmu dengan acuan ambang batas aman Kemenkes RI.
        </p>
      </div>

      {/* AI CONSUMPTION FORECAST CARD */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white border border-indigo-500/40 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <span>AI Consumption Forecast Status</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold">
                  Predictive Model
                </span>
              </h3>
              <p className="text-[10px] text-slate-300">
                Proyeksi akhir hari berdasarkan catatan sarapan & siang hari ini ({currentSugarToday}g gula saat ini).
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
            isSugarForecastOver 
              ? 'bg-rose-500 text-white animate-pulse' 
              : 'bg-emerald-400 text-slate-950'
          }`}>
            {isSugarForecastOver ? '⚠️ Resiko Melebihi Batas' : '✅ Proyeksi Aman'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60">
            <span className="text-[9px] font-bold text-amber-300 uppercase block">Proyeksi Gula Akhir Hari</span>
            <div className="text-base font-black text-amber-200 mt-0.5">~{forecastSugarEOD}g</div>
            <span className="text-[9px] text-slate-400 block">Batas Kemenkes: {gglLimits.sugarLimit}g</span>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/60">
            <span className="text-[9px] font-bold text-blue-300 uppercase block">Proyeksi Garam Akhir Hari</span>
            <div className="text-base font-black text-blue-200 mt-0.5">~{currentSaltToday > 0 ? (currentSaltToday * 1.3).toFixed(1) : 1.8}g</div>
            <span className="text-[9px] text-slate-400 block">Batas Kemenkes: {gglLimits.saltLimit}g</span>
          </div>

          <div className="p-2.5 rounded-xl bg-orange-950/60 border border-orange-800/60">
            <span className="text-[9px] font-bold text-orange-300 uppercase block">Proyeksi Lemak Akhir Hari</span>
            <div className="text-base font-black text-orange-200 mt-0.5">~{currentFatToday > 0 ? Math.round(currentFatToday * 1.35) : 25}g</div>
            <span className="text-[9px] text-slate-400 block">Batas Kemenkes: {gglLimits.fatLimit}g</span>
          </div>
        </div>

        {/* Proactive Dinner Guidance */}
        <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs space-y-1">
          <span className="font-bold text-amber-300 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Saran Rekomendasi Makan Malam Proaktif (Dinner Choice):</span>
          </span>
          <p className="text-[11px] text-slate-200 leading-relaxed">
            {isSugarForecastOver
              ? '⚠️ Asupan gula harianmu terproyeksi melebihi batas 25g. Untuk dinner malam ini, prioritaskan menu BEBAS GULA: Sup Bening Tahu Tempe, Sayur Bayam, Ayam Bakar Tanpa Kecap Manis, dan Air Putih Hangat.'
              : '🌟 Proyeksi GGL akhir hari masih sangat terkontrol! Pilih menu makan malam seimbang seperti Ikan Panggang / Telur Rebus, Capcay Sayur, dan Segelas Air Putih.'}
          </p>
        </div>
      </div>

      {/* Recharts Weekly Trend Line Chart Dashboard */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Grafik Tren Konsumsi GGL (7 Hari Terakhir)</span>
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Satuan: Gram (g)</p>
          </div>

          {/* Toggle Line Chart vs Bar Chart */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                chartType === 'line'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span>Line Chart</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                chartType === 'bar'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar Chart</span>
            </button>
          </div>
        </div>

        {/* Weekly Summary Cards */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">Rata-rata Gula</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{avgSugar}g / hari</div>
            <span className="text-[9px] text-slate-500 block">Batas: {gglLimits.sugarLimit}g</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300">Rata-rata Garam</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{avgSalt}g / hari</div>
            <span className="text-[9px] text-slate-500 block">Batas: {gglLimits.saltLimit}g</span>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60">
            <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300">Rata-rata Lemak</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{avgFat}g / hari</div>
            <span className="text-[9px] text-slate-500 block">Batas: {gglLimits.fatLimit}g</span>
          </div>
        </div>

        {/* Recharts Visualization */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    fontSize: '11px',
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <ReferenceLine y={gglLimits.sugarLimit} label={{ value: `Max Gula (${gglLimits.sugarLimit}g)`, fill: '#F59E0B', fontSize: 9 }} stroke="#F59E0B" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="Gula" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Garam" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Lemak" stroke="#F97316" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    fontSize: '11px',
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Gula" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Garam" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Lemak" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Date Picker & History Summary Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Pilih Tanggal Detail Riwayat:</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Selected Day Stats Cards */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">GULA HARI INI</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{selectedDateSugar}g</div>
            <span className="text-[9px] text-slate-500 block">max {gglLimits.sugarLimit}g</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300">GARAM HARI INI</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{selectedDateSalt}g</div>
            <span className="text-[9px] text-slate-500 block">max {gglLimits.saltLimit}g</span>
          </div>
          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900">
            <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300">LEMAK HARI INI</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">{selectedDateFat}g</div>
            <span className="text-[9px] text-slate-500 block">max {gglLimits.fatLimit}g</span>
          </div>
        </div>
      </div>

      {/* List of Food Logs for Selected Date */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
          <span>Daftar Makanan Dicatat ({selectedDateLogs.length}):</span>
          <span className="text-[10px] text-slate-500 font-normal">{selectedDate}</span>
        </h3>

        {selectedDateLogs.length === 0 ? (
          <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            Belum ada catatan makanan pada tanggal ini.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDateLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {log.foodName}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold uppercase">
                      {log.mealType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Porsi: {log.portionDesc} | Gula: <span className="font-semibold text-amber-600">{log.sugarGram}g</span>, Garam: <span className="font-semibold text-blue-600">{log.saltGram}g</span>, Lemak: <span className="font-semibold text-orange-600">{log.fatGram}g</span>
                  </div>
                  {log.aiNote && (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 line-clamp-1 italic">
                      ✨ {log.aiNote}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                  title="Hapus catatan ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRINTABLE PDF REPORT EXPORT ACTION CARD */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider">
                Rapor Pemantauan Nutrisi GGL Sekolah
              </h3>
              <p className="text-[10px] text-emerald-100">
                Ekspor rekapitulasi 7 hari & rekomendasi AI untuk guru, orang tua, atau dokter
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md">PDF Ready</span>
        </div>

        <button
          onClick={() => setIsPdfExportOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
        >
          <Printer className="w-4 h-4 text-emerald-700" />
          <span>Cetak / Download Rapor GGL PDF</span>
        </button>
      </div>

      {/* GAMIFIED BADGES & ACHIEVEMENTS SYSTEM */}
      <BadgesSystem logs={logs} user={user} gglLimits={gglLimits} />

      {/* Export PDF Modal */}
      <ExportPdfReportModal
        isOpen={isPdfExportOpen}
        onClose={() => setIsPdfExportOpen(false)}
        logs={logs}
        user={user}
        gglLimits={gglLimits}
      />
    </div>
  );
};


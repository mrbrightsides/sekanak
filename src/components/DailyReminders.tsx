import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Bell, BellOff, CheckSquare, Square, Droplets, Apple, Heart, ShieldCheck, Sparkles, Clock, Volume2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface DailyRemindersProps {
  user: UserProfile | null;
}

interface SnackAlarmSlot {
  id: string;
  time: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export const DailyReminders: React.FC<DailyRemindersProps> = ({ user }) => {
  // Toggle feature state for Daily Notification Reminders
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('sekanak_notifications_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Snack Rush Hour Alarms Configuration
  const [alarmSlots, setAlarmSlots] = useState<SnackAlarmSlot[]>(() => {
    const saved = localStorage.getItem('sekanak_alarm_slots');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'istirahat-1',
        time: '09:30',
        label: '🔔 Jam Istirahat Pertama Sekolah',
        description: 'Pilih minuman air putih / buah di kantin, hindari es manis berlebih.',
        enabled: true,
        icon: '🏫',
      },
      {
        id: 'makan-siang',
        time: '12:00',
        label: '🍲 Jam Makan Siang Sekolah',
        description: 'Batasi bumbu mi instan & kuah santan berlebih.',
        enabled: true,
        icon: '🍱',
      },
      {
        id: 'pulang-sekolah',
        time: '15:00',
        label: '🧋 Jam Jajan Sore / Pulang Sekolah',
        description: 'Waspadai es boba, gorengan jelantah, dan chiki gurih.',
        enabled: true,
        icon: '🎒',
      },
      {
        id: 'evaluasi-malam',
        time: '19:00',
        label: '🌙 Rekap GGL Malam Hari',
        description: 'Cek grafik asupan harianmu di aplikasi SEKANAK.',
        enabled: true,
        icon: '📊',
      },
    ];
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const [testNotificationSent, setTestNotificationSent] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('sekanak_notifications_enabled', JSON.stringify(remindersEnabled));
  }, [remindersEnabled]);

  useEffect(() => {
    localStorage.setItem('sekanak_alarm_slots', JSON.stringify(alarmSlots));
  }, [alarmSlots]);

  // Active background interval scheduler for local time alerts (e.g. 09:30 & 12:00 WIB)
  useEffect(() => {
    if (!remindersEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const timeString = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().split('T')[0];

      alarmSlots.forEach((slot) => {
        if (slot.enabled && slot.time === timeString) {
          const key = `sekanak_fired_${slot.id}_${todayDateStr}`;
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, 'true');
            handleTestNotification(slot.label, slot.description);
          }
        }
      });
    }, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, [remindersEnabled, alarmSlots]);

  const toggleAlarmSlot = (id: string) => {
    setAlarmSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, enabled: !slot.enabled } : slot))
    );
  };

  const updateAlarmTime = (id: string, newTime: string) => {
    setAlarmSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, time: newTime } : slot))
    );
  };

  // Request native browser Push Notification permissions
  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('Aplikasi SEKANAK UNSRI', {
          body: 'Notifikasi pengingat jam jajan sekolah berhasil diaktifkan! 🔔',
          icon: '/favicon.ico',
        });
      }
    }
  };

  const handleTestNotification = (slotLabel?: string, slotDesc?: string) => {
    const title = slotLabel || 'Pengingat Jajan Sehat SEKANAK';
    const body = slotDesc || `Halo ${user?.name || 'Siswa'}! Saatnya catat jajanan & konsumsi GGL hari ini di SEKANAK! 🥤`;

    setTestNotificationSent(`${title}: "${body}"`);

    // Try web browser Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch {}
    }

    // Play web audio alert chime
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}

    setTimeout(() => {
      setTestNotificationSent(null);
    }, 5000);
  };

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    airPutih: true,
    buah: false,
    batasiGula: false,
    olahraga: true,
    catatSEKANAK: true,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalTasks = Object.keys(checklist).length;

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-md">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-300" />
          <h2 className="text-base font-black">Notifikasi Pengingat Lokal & Jam Rawan Jajan</h2>
        </div>
        <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
          Sistem alarm otomatis pada jam-jam rawan jajan anak sekolah (09:30, 12:00, 15:00 WIB) untuk mencegah lonjakan gula & gorengan berlebih.
        </p>
      </div>

      {/* TOGGLE FEATURE: DAILY NOTIFICATION REMINDER CONTROL CARD */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {remindersEnabled ? (
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 ring-1 ring-emerald-400/40">
                <Bell className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400">
                <BellOff className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <span>Push Reminders Jam Rawan Jajan</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-400/30">
                  Auto Alarm
                </span>
              </h3>
              <p className="text-[10px] text-slate-500">
                {remindersEnabled ? 'Status: AKTIF (4 Alarm Jam Sekolah Berjalan)' : 'Status: NONAKTIF (Notifikasi Dimatikan)'}
              </p>
            </div>
          </div>

          {/* Master Toggle Switch */}
          <button
            type="button"
            onClick={() => setRemindersEnabled(!remindersEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              remindersEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            role="switch"
            aria-checked={remindersEnabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                remindersEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Browser Push Permission Request Banner */}
        {notificationPermission !== 'granted' && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Izinkan notifikasi browser untuk menerima alarm pop-up saat sekolah:</span>
            </div>
            <button
              type="button"
              onClick={requestBrowserPermission}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-xs transition"
            >
              Aktifkan Notifikasi Browser
            </button>
          </div>
        )}

        {/* Schedule Settings when Enabled */}
        {remindersEnabled && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
              ⏰ Jadwal Alarm Jam Rawan Jajan Anak Sekolah:
            </span>

            {/* List of 4 Rush Hour Alarm Slots */}
            <div className="space-y-2">
              {alarmSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                    slot.enabled
                      ? 'bg-emerald-50/70 dark:bg-slate-900/80 border-emerald-300 dark:border-slate-700'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{slot.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {slot.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {slot.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e) => updateAlarmTime(slot.id, e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() => handleTestNotification(slot.label, slot.description)}
                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-emerald-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                      title="Uji Alarm Suara & Notifikasi"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleAlarmSlot(slot.id)}
                      className={`w-8 h-5 rounded-full relative transition-colors ${
                        slot.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          slot.enabled ? 'transform translate-x-3' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {testNotificationSent && (
              <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{testNotificationSent}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Target Kebiasaan Sehat Hari Ini:
          </span>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {completedCount} / {totalTasks} Selesai
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalTasks) * 100}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => toggleCheck('airPutih')}
            className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${
              checklist.airPutih
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-semibold'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <span>Minum 8 Gelas Air Putih Hari Ini</span>
            </div>
            {checklist.airPutih ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleCheck('buah')}
            className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${
              checklist.buah
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-semibold'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Apple className="w-4 h-4 text-rose-500" />
              <span>Makan Minimal 1 Porsi Buah Segar</span>
            </div>
            {checklist.buah ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleCheck('batasiGula')}
            className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${
              checklist.batasiGula
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-semibold'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Hindari Minuman Kemasan Manis saat Sekolah</span>
            </div>
            {checklist.batasiGula ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleCheck('catatSEKANAK')}
            className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${
              checklist.catatSEKANAK
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-semibold'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Catat Makanan Harian di Aplikasi SEKANAK</span>
            </div>
            {checklist.catatSEKANAK ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


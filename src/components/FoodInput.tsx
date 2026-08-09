import React, { useState, useMemo } from 'react';
import { MealType, PresetFood, FoodItem } from '../types';
import { PRESET_FOODS } from '../data/presetFoods';
import { PALEMBANG_LOCAL_FOODS, LocalFoodItem, searchLocalFoods } from '../data/localFoodData';
import { Sparkles, Plus, Loader2, Check, SlidersHorizontal, Info, Camera, Search, MapPin, ChevronDown } from 'lucide-react';
import { SmartLabelScanner } from './SmartLabelScanner';

interface FoodInputProps {
  onAddFood: (food: Omit<FoodItem, 'id' | 'createdAt'>) => void;
  userId: string;
}

export const FoodInput: React.FC<FoodInputProps> = ({ onAddFood, userId }) => {
  const [mealType, setMealType] = useState<MealType>('sarapan');
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState('1 porsi');
  const [sugarGram, setSugarGram] = useState<number>(0);
  const [saltGram, setSaltGram] = useState<number>(0);
  const [fatGram, setFatGram] = useState<number>(0);
  const [aiNote, setAiNote] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showManualSliders, setShowManualSliders] = useState(false);
  const [showSmartScanner, setShowSmartScanner] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Local Sumsel Food Search & Autocomplete state
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [showAutocompleteDropdown, setShowAutocompleteDropdown] = useState(false);

  // Filtered local foods list
  const filteredLocalFoods = useMemo(() => {
    let list = PALEMBANG_LOCAL_FOODS;
    if (selectedCategory !== 'Semua') {
      list = list.filter((item) => item.category.includes(selectedCategory));
    }
    if (localSearchQuery.trim()) {
      const q = localSearchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, localSearchQuery]);

  // Handle tap on local Sumsel food item
  const handleSelectLocalFood = (item: LocalFoodItem) => {
    setSelectedPreset(item.name);
    setFoodName(item.name);
    setPortion(item.defaultPortion);
    setSugarGram(item.sugarGram);
    setSaltGram(item.saltGram);
    setFatGram(item.fatGram);
    setAiNote(`[Database Khas Sumsel/Palembang] ${item.description} - Tip SEKANAK: ${item.sekanakTip}`);
    setShowAutocompleteDropdown(false);
    setSuccessMessage(`Pilihan "${item.name}" berhasil diisi!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle tap on a preset item
  const handleSelectPreset = (item: PresetFood) => {
    setSelectedPreset(item.name);
    setFoodName(item.name);
    setPortion(item.defaultPortion);
    setSugarGram(item.sugarGram);
    setSaltGram(item.saltGram);
    setFatGram(item.fatGram);
    setAiNote(`Analisis cepat dari daftar jajanan populer SEKANAK (${item.category}).`);
  };

  // AI Gemini Real-time Food Analyzer
  const handleAnalyzeWithAI = async () => {
    if (!foodName.trim()) return;
    setIsAnalyzing(true);
    setAiNote('');

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodInput: foodName, portion })
      });
      const data = await res.json();

      if (data) {
        setSugarGram(data.sugarGram || 0);
        setSaltGram(data.saltGram || 0);
        setFatGram(data.fatGram || 0);
        setAiNote(data.aiNote || 'Berhasil dianalisis oleh AI Gemini');
      }
    } catch (err) {
      console.error('Failed to analyze food with AI:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Food Log
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];

    onAddFood({
      userId,
      date: todayStr,
      mealType,
      foodName: foodName.trim(),
      portionDesc: portion,
      sugarGram,
      saltGram,
      fatGram,
      aiNote,
    });

    // Reset Form
    setFoodName('');
    setPortion('1 porsi');
    setSugarGram(0);
    setSaltGram(0);
    setFatGram(0);
    setAiNote('');
    setSelectedPreset(null);

    setSuccessMessage('Makanan berhasil dicatat!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-black flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Input Makanan & Analisis AI Gemini</span>
          </h2>
          <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
            Pilih dari jajanan populer anak, ketik nama makanan, atau gunakan Kamera Smart Scanner untuk membaca Informasi Nilai Gizi kemasan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSmartScanner(!showSmartScanner)}
          className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
        >
          <Camera className="w-4 h-4 text-slate-950" />
          <span>{showSmartScanner ? 'Tutup Scanner' : '📷 Smart Label Scanner'}</span>
        </button>
      </div>

      {/* SMART LABEL SCANNER COMPONENT */}
      {showSmartScanner && (
        <SmartLabelScanner
          onApplyScanResults={(results) => {
            setFoodName(results.foodName);
            setSugarGram(results.sugarGram);
            setSaltGram(results.saltGram);
            setFatGram(results.fatGram);
            setAiNote(results.aiNote);
            setShowSmartScanner(false);
            setSuccessMessage(`Hasil scan "${results.foodName}" telah dimasukkan ke form!`);
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
          onClose={() => setShowSmartScanner(false)}
        />
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Meal Time Selector */}
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
          Waktu Makan / Jajanan:
        </label>
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          {(['sarapan', 'makan_siang', 'makan_malam', 'camilan'] as MealType[]).map((mt) => {
            const labels: Record<MealType, string> = {
              sarapan: '🌅 Sarapan',
              makan_siang: '☀️ Siang',
              makan_malam: '🌙 Malam',
              camilan: '🍿 Camilan',
            };
            return (
              <button
                key={mt}
                type="button"
                onClick={() => setMealType(mt)}
                className={`py-2 px-1 text-[11px] font-bold rounded-lg transition text-center ${
                  mealType === mt
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {labels[mt]}
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCHABLE AUTOCOMPLETE DATABASE JAJANAN KHAS SUMSEL / PALEMBANG */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
              <span>Database Jajanan Khas Sumsel / Palembang</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Autocomplete GGL
              </span>
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            20+ Menu Pempek, Model, Celimpungan, Es Kacang Merah, dll.
          </span>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => {
                setLocalSearchQuery(e.target.value);
                setShowAutocompleteDropdown(true);
              }}
              onFocus={() => setShowAutocompleteDropdown(true)}
              placeholder="Cari kuliner Sumsel (contoh: pempek telur, es kacang merah, model, celimpungan)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] custom-scrollbar">
            {['Semua', 'Pempek', 'Ikan', 'Santan', 'Es', 'Kue'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowAutocompleteDropdown(true);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Autocomplete Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 custom-scrollbar">
          {filteredLocalFoods.slice(0, 8).map((item) => {
            const isSelected = selectedPreset === item.name || foodName === item.name;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectLocalFood(item)}
                className={`p-2.5 rounded-xl text-left border transition flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/50'
                    : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold truncate">{item.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-bold shrink-0">
                      {item.calories} kcal
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.defaultPortion}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-bold">
                    <span className="text-amber-600 dark:text-amber-400">🍬 {item.sugarGram}g</span>
                    <span className="text-blue-600 dark:text-blue-400">🧂 {item.saltGram}g</span>
                    <span className="text-orange-600 dark:text-orange-400">🧈 {item.fatGram}g</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Foods Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Jajanan & Makanan Populer (Sekolah / Rumah):
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Klik untuk langsung pilih</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 custom-scrollbar">
          {PRESET_FOODS.map((item) => {
            const isSelected = selectedPreset === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleSelectPreset(item)}
                className={`p-2.5 rounded-xl text-left border transition flex items-start gap-2 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/50'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Gula: {item.sugarGram}g | Lemak: {item.fatGram}g
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Input Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3.5 shadow-xs">
        <div className="relative">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Nama Makanan / Minuman:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={foodName}
              onChange={(e) => {
                setFoodName(e.target.value);
                setSelectedPreset(null);
                setShowAutocompleteDropdown(true);
              }}
              onFocus={() => setShowAutocompleteDropdown(true)}
              placeholder="Contoh: Pempek telur, es kacang merah, model, mi goreng..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzing || !foodName.trim()}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition active:scale-95 shrink-0"
              title="Analisis kandungan GGL dengan AI Gemini"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span className="hidden sm:inline">Analisis</span> AI
            </button>
          </div>

          {/* Live Autocomplete Suggestions Popover */}
          {showAutocompleteDropdown && foodName.trim().length >= 2 && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-emerald-500/50 rounded-2xl shadow-xl max-h-60 overflow-y-auto p-2 space-y-1 animate-fadeIn">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-1">
                <span>Rekomendasi Autocomplete Khas Sumsel:</span>
                <button
                  type="button"
                  onClick={() => setShowAutocompleteDropdown(false)}
                  className="text-slate-400 hover:text-slate-600 text-[10px]"
                >
                  Tutup ✕
                </button>
              </div>
              {searchLocalFoods(foodName).slice(0, 5).map((match) => (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => handleSelectLocalFood(match)}
                  className="w-full p-2 rounded-xl text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{match.icon}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 dark:text-slate-100 truncate">{match.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{match.defaultPortion}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold shrink-0 text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    🍬 {match.sugarGram}g | 🧂 {match.saltGram}g | 🧈 {match.fatGram}g
                  </div>
                </button>
              ))}
              {searchLocalFoods(foodName).length === 0 && (
                <div className="p-3 text-center text-xs text-slate-500">
                  Tidak ada kecocokan di database lokal. Klik tombol <strong>Analisis AI</strong> untuk estimasi Gemini AI!
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Perkiraan Porsi:
          </label>
          <input
            type="text"
            value={portion}
            onChange={(e) => setPortion(e.target.value)}
            placeholder="Contoh: 1 gelas, 2 buah, 1 porsi sedang"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* AI Note Result */}
        {aiNote && (
          <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Hasil Analisis AI SEKANAK:</span>
              <p className="mt-0.5 text-[11px] leading-relaxed">{aiNote}</p>
            </div>
          </div>
        )}

        {/* GGL Content Display & Manual Adjust Toggle */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Estimasi Kandungan GGL (Gula, Garam, Lemak):
            </span>
            <button
              type="button"
              onClick={() => setShowManualSliders(!showManualSliders)}
              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showManualSliders ? 'Sembunyikan Slider' : 'Ubah Gram Manual'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">🍬 Gula</span>
              <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{sugarGram} <span className="text-xs font-normal">g</span></div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">🧂 Garam</span>
              <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{saltGram} <span className="text-xs font-normal">g</span></div>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60">
              <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400 uppercase">🧈 Lemak</span>
              <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{fatGram} <span className="text-xs font-normal">g</span></div>
            </div>
          </div>

          {/* Manual Sliders */}
          {showManualSliders && (
            <div className="mt-3 space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 animate-fadeIn text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-700 dark:text-slate-300">
                  <span>Gula (gram):</span>
                  <span className="font-bold">{sugarGram}g</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={sugarGram}
                  onChange={(e) => setSugarGram(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-700 dark:text-slate-300">
                  <span>Garam (gram):</span>
                  <span className="font-bold">{saltGram}g</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={saltGram}
                  onChange={(e) => setSaltGram(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-700 dark:text-slate-300">
                  <span>Lemak (gram):</span>
                  <span className="font-bold">{fatGram}g</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fatGram}
                  onChange={(e) => setFatGram(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!foodName.trim()}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Simpan Catatan Makanan ke SEKANAK</span>
        </button>
      </form>
    </div>
  );
};

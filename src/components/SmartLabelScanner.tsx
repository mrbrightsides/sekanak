import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Loader2, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';

interface SmartLabelScannerProps {
  onApplyScanResults: (results: {
    foodName: string;
    sugarGram: number;
    saltGram: number;
    fatGram: number;
    aiNote: string;
  }) => void;
  onClose?: () => void;
}

// Preset label samples for instant testing without camera access
const PRESET_LABEL_SAMPLES = [
  {
    name: '🧃 Susu UHT Cokelat 200ml',
    desc: 'Label Nilai Gizi Susu Kemasan',
    sugar: 18,
    salt: 0.2,
    fat: 6,
    cal: 140,
    note: 'Terlihat gula 18g per kemasan 200ml (72% dari batas harian anak).',
  },
  {
    name: '🍜 Mi Instan Kuah 75g',
    desc: 'Label Bumbu & Natrium Mi Kemasan',
    sugar: 3,
    salt: 3.2,
    fat: 14,
    cal: 340,
    note: 'Tinggi natrium/garam (3.2g) & lemak (14g). Melebihi rekomendasi harian!',
  },
  {
    name: '🥤 Teh Manis Kemasan 350ml',
    desc: 'Label Minuman Teh Berperisa',
    sugar: 26,
    salt: 0.1,
    fat: 0,
    cal: 110,
    note: 'Gula 26g langsung melampaui batas harian anak (25g) dalam 1 botol!',
  },
  {
    name: '🥔 Chiki Keripik Kentang 50g',
    desc: 'Label Snack Gurih & MSG',
    sugar: 2,
    salt: 1.6,
    fat: 11,
    cal: 250,
    note: 'Lemak jenuh 11g & garam 1.6g dari minyak goreng & bumbu gurih.',
  },
];

export const SmartLabelScanner: React.FC<SmartLabelScannerProps> = ({
  onApplyScanResults,
  onClose,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{
    foodName: string;
    sugarGram: number;
    saltGram: number;
    fatGram: number;
    calories?: number;
    aiNote: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File / Camera Capture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Silakan pilih berkas foto/gambar label yang valid.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      analyzeLabelImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Process label image via Gemini Vision API
  const analyzeLabelImage = async (base64Data: string, mimeType: string) => {
    setIsAnalyzing(true);
    setScannedResult(null);

    try {
      const res = await fetch('/api/scan-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });

      const data = await res.json();

      if (data && !data.error) {
        setScannedResult({
          foodName: data.foodName || 'Produk Kemasan Hasil Scan',
          sugarGram: data.sugarGram ?? 0,
          saltGram: data.saltGram ?? 0,
          fatGram: data.fatGram ?? 0,
          calories: data.calories,
          aiNote: data.aiNote || 'Nilai Informasi Gizi berhasil diekstrak oleh SEKANAK Vision.',
        });
      } else {
        setErrorMessage(data.error || 'Gagal memproses gambar label nutrisi.');
      }
    } catch (err) {
      console.error('Error scanning label:', err);
      setErrorMessage('Terjadi kendala koneksi saat memproses foto.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select preset sample
  const handleSelectSample = (sample: typeof PRESET_LABEL_SAMPLES[0]) => {
    setScannedResult({
      foodName: sample.name.replace(/^[^\s]+\s/, ''), // Remove emoji
      sugarGram: sample.sugar,
      saltGram: sample.salt,
      fatGram: sample.fat,
      calories: sample.cal,
      aiNote: sample.note,
    });
    setImagePreview(null);
  };

  // Apply to form
  const handleApply = () => {
    if (!scannedResult) return;
    onApplyScanResults({
      foodName: scannedResult.foodName,
      sugarGram: scannedResult.sugarGram,
      saltGram: scannedResult.saltGram,
      fatGram: scannedResult.fatGram,
      aiNote: scannedResult.aiNote,
    });
    if (onClose) onClose();
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/90 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40">
            <Camera className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-black flex items-center gap-1.5">
              <span>Smart Label Scanner GGL</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                Gemini Vision AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Foto tabel &quot;Informasi Nilai Gizi&quot; makanan kemasan untuk ekstrak otomatis Gula, Garam, dan Lemak.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera / Upload Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95"
        >
          <Camera className="w-4 h-4 text-amber-300" />
          <span>Ambil Foto Kamera</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition active:scale-95"
        >
          <Upload className="w-4 h-4 text-emerald-400" />
          <span>Unggah Berkas Gambar</span>
        </button>
      </div>

      {/* Quick Sample Presets */}
      <div>
        <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
          Atau Coba Contoh Foto Kemasan Jajanan:
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_LABEL_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-950/80 border border-slate-700 hover:border-emerald-500/50 text-left transition group"
            >
              <div className="text-[11px] font-bold text-slate-100 group-hover:text-emerald-300 truncate">
                {sample.name}
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                Gula: {sample.sugar}g | Garam: {sample.salt}g | Lemak: {sample.fat}g
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Preview & Loading Indicator */}
      {isAnalyzing && (
        <div className="p-4 rounded-xl bg-slate-800/90 border border-emerald-500/40 text-center space-y-2 animate-pulse">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-emerald-300">
            SEKANAK Vision AI sedang membaca Informasi Nilai Gizi...
          </p>
          <p className="text-[10px] text-slate-400">
            Menganalisis angka Gula, Garam/Natrium, dan Lemak Total per porsi.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Scan Result Summary Card */}
      {scannedResult && !isAnalyzing && (
        <div className="p-3.5 rounded-xl bg-slate-800 border border-emerald-500/50 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Hasil Deteksi AI Vision
              </span>
              <h4 className="text-xs font-black text-white">{scannedResult.foodName}</h4>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-800/60">
              <span className="text-[9px] font-bold text-amber-300 uppercase block">Gula</span>
              <span className="text-sm font-black text-amber-200">{scannedResult.sugarGram}g</span>
            </div>
            <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-800/60">
              <span className="text-[9px] font-bold text-blue-300 uppercase block">Garam</span>
              <span className="text-sm font-black text-blue-200">{scannedResult.saltGram}g</span>
            </div>
            <div className="p-2 rounded-lg bg-orange-950/50 border border-orange-800/60">
              <span className="text-[9px] font-bold text-orange-300 uppercase block">Lemak</span>
              <span className="text-sm font-black text-orange-200">{scannedResult.fatGram}g</span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-300 italic leading-relaxed">
            ✨ {scannedResult.aiNote}
          </p>

          <button
            type="button"
            onClick={handleApply}
            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gunakan Hasil Scan ke Form Makanan</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { EDUCATIONAL_MODULES } from '../data/presetFoods';
import { EducationalItem } from '../types';
import confetti from 'canvas-confetti';
import { 
  BookOpen, Video, Award, CheckCircle2, XCircle, HelpCircle, ChevronRight, Play, 
  AlertTriangle, ShieldAlert, Heart, Activity, Flame, Stethoscope, Sparkles, RefreshCw, 
  Trophy, GraduationCap, HelpCircle as QuizIcon
} from 'lucide-react';

export const EducationalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'modul' | 'infografis'>('quiz');
  const [activeModule, setActiveModule] = useState<EducationalItem>(EDUCATIONAL_MODULES[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(0);
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'sugar' | 'salt' | 'fat'>('all');

  // Dedicated Comprehensive Edukasi Quiz Suite
  const dedicatedQuizzes = [
    {
      id: 'q1-gula-g4',
      topic: 'Gula (G4)',
      question: 'Berapa batas maksimal konsumsi GULA harian menurut rumus Kemenkes RI (Aturan G4) untuk orang dewasa?',
      options: [
        '2 Sendok Makan (25 gram)',
        '4 Sendok Makan (50 gram)',
        '6 Sendok Makan (75 gram)',
        'Bebas tanpa batas harian'
      ],
      correctIndex: 1,
      explanation: 'Benar! Rumus G4 berarti Gula maksimal 4 Sendok Makan (50 gram/hari) untuk dewasa. Untuk anak sekolah disarankan < 25 gram per hari.'
    },
    {
      id: 'q2-gula-anak',
      topic: 'Gula Anak',
      question: 'Berapa batas aman konsumsi gula per hari untuk anak usia sekolah (6–12 tahun) agar terhindar dari risiko karies & diabetes?',
      options: [
        'Maksimal 25 gram (~2 Sendok Makan)',
        'Maksimal 80 gram (~6 Sendok Makan)',
        'Maksimal 150 gram',
        '10 Sendok Makan'
      ],
      correctIndex: 0,
      explanation: 'Tepat sekali! Rekomendasi Kemenkes RI dan WHO menyatakan batas aman gula anak usia sekolah adalah di bawah 25 gram per hari.'
    },
    {
      id: 'q3-garam-g1',
      topic: 'Garam (G1)',
      question: 'Berapa jumlah GARAM maksimal per hari menurut standar Kemenkes RI (Aturan G1)?',
      options: [
        '1 Sendok Teh (5 gram / 2.000 mg Natrium)',
        '3 Sendok Teh (15 gram)',
        '1 Sendok Makan (15 gram)',
        '5 Sendok Teh'
      ],
      correctIndex: 0,
      explanation: 'Hebat! Aturan G1 berarti Garam maksimal 1 sendok teh (5 gram atau setara 2.000 mg Natrium) per hari untuk melindungi tekanan darah.'
    },
    {
      id: 'q4-lemak-l5',
      topic: 'Lemak (L5)',
      question: 'Berapa batas maksimal konsumsi LEMAK harian sesuai aturan Kemenkes RI (Aturan L5)?',
      options: [
        '2 Sendok Makan (25 gram)',
        '5 Sendok Makan (67 gram)',
        '10 Sendok Makan (130 gram)',
        'Tidak ada pembatasan'
      ],
      correctIndex: 1,
      explanation: 'Sempurna! Aturan L5 berarti Lemak maksimal 5 sendok makan (67 gram/hari). Hati-hati dengan gorengan bersantan dan minyak jelantah.'
    },
    {
      id: 'q5-kantin-sehat',
      topic: 'Pilihan Kantin',
      question: 'Di kantin sekolah, pilihan minuman manakah yang PALING SEHAT dan aman dikonsumsi setiap hari?',
      options: [
        'Air Putih / Air Mineral Segar',
        'Teh Kemasan Sangat Manis',
        'Minuman Bersoda Warna-warni',
        'Es Boba Brown Sugar'
      ],
      correctIndex: 0,
      explanation: 'Luar biasa! Air putih murni mengandung 0g gula dan 0 kalori, sangat baik untuk kesehatan ginjal dan konsentrasi belajar.'
    },
    {
      id: 'q6-label-gizi',
      topic: 'Membaca Label',
      question: 'Saat membeli jajanan kemasan, bagian mana yang harus diperiksa pada tabel Informasi Nilai Gizi untuk mengetahui kadar gula total?',
      options: [
        'Kolom "Gula / Sugars" dikalikan dengan Jumlah Sajian Per Kemasan',
        'Hanya melihat warna kemasan depan',
        'Melihat harga jajanan',
        'Melihat tanggal kadaluarsa saja'
      ],
      correctIndex: 0,
      explanation: 'Jawaban cerdas! Perhatikan "Jumlah Sajian per Kemasan". Jika 1 bungkus berisi 2 sajian dan per sajian ada 15g gula, totalnya adalah 30g gula!'
    }
  ];

  const handleAnswerSelect = (quizId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleSubmitQuiz = (quizId: string, correctIdx: number) => {
    if (selectedAnswers[quizId] === undefined || quizSubmitted[quizId]) return;

    const isCorrect = selectedAnswers[quizId] === correctIdx;
    setQuizSubmitted((prev) => ({ ...prev, [quizId]: true }));

    if (isCorrect) {
      setScore((prev) => prev + 25);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted({});
    setScore(0);
  };

  const completedQuizCount = Object.keys(quizSubmitted).length;

  // Educational Articles & Risk Infographics
  const gglRisks = [
    {
      id: 'diabetes',
      category: 'sugar',
      title: 'Diabetes Melitus Tipe 2 & Obesitas Anak',
      cause: 'Konsumsi Gula Berlebih (>25g/hari)',
      icon: Flame,
      color: 'amber',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      badgeColor: 'bg-amber-500 text-slate-950',
      description: 'Minuman manis botolan, es boba, dan teh manis kemasan dapat menyebabkan lonjakan kadar gula darah secara drastis, memicu resistensi insulin sejak usia sekolah.',
      stats: '8 dari 10 anak sekolah mengonsumsi gula di atas ambang batas Kemenkes.',
      tips: 'Ganti minuman bersoda / teh manis dengan air putih dingin atau infused water buah segar.'
    },
    {
      id: 'hipertensi',
      category: 'salt',
      title: 'Hipertensi & Beban Kerja Ginjal',
      cause: 'Konsumsi Garam / Natrium Berlebih (>3g/hari)',
      icon: Activity,
      color: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      badgeColor: 'bg-blue-500 text-white',
      description: 'Jajanan gurih tinggi MSG (chiki, bumbu mi instan, keripik asin) menahan cairan dalam pembuluh darah, meningkatkan tekanan darah tinggi sejak usia dini.',
      stats: '1 saset bumbu mi instan mengandung hingga 1.800mg natrium (60% kuota harian).',
      tips: 'Kurangi penggunaan bumbu instan dan ganti dengan rempah alami seperti bawang & ketumbar.'
    },
    {
      id: 'jantung',
      category: 'fat',
      title: 'Kolesterol Tinggi & Jantung Koroner',
      cause: 'Konsumsi Lemak Jenuh / Minyak berulang (>40g/hari)',
      icon: Heart,
      color: 'orange',
      bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900',
      badgeColor: 'bg-orange-500 text-white',
      description: 'Gorengan yang digoreng dengan minyak jelatah berulang kali mengandung lemak trans tinggi, yang menyumbat pembuluh darah arteri.',
      stats: '2 buah bakwan goreng menyumbang hingga 18g lemak jenuh.',
      tips: 'Pilih metode memasak dikukus, direbus, atau dipanggang sebagai alternatif gorengan.'
    },
    {
      id: 'karies',
      category: 'sugar',
      title: 'Kerusakan Gigi & Karies Anak',
      cause: 'Sisa Gula Asam pada Email Gigi',
      icon: Stethoscope,
      color: 'rose',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      badgeColor: 'bg-rose-500 text-white',
      description: 'Gula dari permen, cokelat manis, dan minuman perisa menjadi makanan utama bakteri mulut yang menghasilkan asam perusak email gigi.',
      stats: '93% anak usia 10-12 tahun mengalami karies gigi akibat konsumsi gula harian.',
      tips: 'Kumur air putih setelah makan manis dan sikat gigi 2x sehari dengan pasta gigi berfluorida.'
    }
  ];

  const filteredRisks = selectedRisk === 'all' 
    ? gglRisks 
    : gglRisks.filter(r => r.category === selectedRisk);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-700 to-emerald-700 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-black">Pusat Edukasi & Kuis GGL Kemenkes RI</h2>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Skor Kuis: {score} Pts</span>
          </div>
        </div>
        <p className="text-xs text-teal-100 mt-1 leading-relaxed">
          Pelajari aturan medis G4-G1-L5 dan uji pengetahuanmu melalui Kuis Edukasi Interaktif!
        </p>
      </div>

      {/* Sub-Section Navigation Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'quiz'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>🎯 Edukasi Quiz</span>
        </button>
        <button
          onClick={() => setActiveTab('modul')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'modul'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-teal-300" />
          <span>📚 Modul & Video</span>
        </button>
        <button
          onClick={() => setActiveTab('infografis')}
          className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'infografis'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-300" />
          <span>🛡️ Infografis Risiko</span>
        </button>
      </div>

      {/* SUB-SECTION 1: EDUKASI QUIZ (UJI PEMAHAMAN) */}
      {activeTab === 'quiz' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 animate-fadeIn">
          {/* Quiz Header */}
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Edukasi Quiz: Uji Pemahaman Batas Sehat GGL
                </h3>
                <p className="text-[10px] text-slate-500">
                  Jawab pertanyaan di bawah dan dapatkan umpan balik instan (+25 poin per jawaban benar)!
                </p>
              </div>
            </div>

            <button
              onClick={handleResetQuiz}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 transition"
              title="Ulangi Kuis"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Score & Progress Status */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-emerald-950 dark:text-emerald-100">
                Progres Soal: {completedQuizCount} / {dedicatedQuizzes.length} Dijawab
              </span>
            </div>
            <div className="font-black text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700">
              Total Skor: {score} Pts
            </div>
          </div>

          {/* Quiz List */}
          <div className="space-y-4">
            {dedicatedQuizzes.map((quiz, qIdx) => {
              const isSubmitted = quizSubmitted[quiz.id];
              const userSelected = selectedAnswers[quiz.id];
              const isCorrect = userSelected === quiz.correctIndex;

              return (
                <div
                  key={quiz.id}
                  className={`p-4 rounded-2xl border transition space-y-3 ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      Soal #{qIdx + 1} • {quiz.topic}
                    </span>
                    {isSubmitted && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {isCorrect ? 'BENAR +25 Pts 🎉' : 'BELUM TEPAT 💡'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {quiz.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-1.5">
                    {quiz.options.map((opt, optIdx) => {
                      const isOptionSelected = userSelected === optIdx;
                      const isOptionCorrect = optIdx === quiz.correctIndex;

                      let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                      if (isOptionSelected && !isSubmitted) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                      } else if (isSubmitted) {
                        if (isOptionCorrect) {
                          btnStyle = 'bg-emerald-100 dark:bg-emerald-900/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-950 dark:text-rose-100 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleAnswerSelect(quiz.id, optIdx)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </span>

                          {isSubmitted && isOptionCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          {isSubmitted && isOptionSelected && !isOptionCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit Button or Immediate Feedback Explanation */}
                  {!isSubmitted ? (
                    <button
                      type="button"
                      disabled={userSelected === undefined}
                      onClick={() => handleSubmitQuiz(quiz.id, quiz.correctIndex)}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition"
                    >
                      Kirim Jawaban Soal #{qIdx + 1}
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Penjelasan Edukasi Kemenkes RI:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        {quiz.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: MODUL & VIDEO PEMBELAJARAN */}
      {activeTab === 'modul' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Module Selector Tabs */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Modul Pembelajaran Kemenkes RI G4-G1-L5:</span>
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {EDUCATIONAL_MODULES.map((mod) => {
                const isSelected = activeModule.id === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModule(mod)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {mod.title.split(' ')[0]} {mod.title.split(' ')[1]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Module Detail Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                Materi SEKANAK UNSRI
              </span>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mt-1">
                {activeModule.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {activeModule.summary}
              </p>
            </div>

            {/* Video or Graphic Component */}
            <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Video className="w-4 h-4" />
                <span>Video & Visual Edukasi Kesehatan</span>
              </div>
              <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg cursor-pointer hover:scale-110 transition">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <p className="text-xs font-bold text-slate-200">
                    Media Edukasi SEKANAK - {activeModule.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Dikembangkan oleh Tim Peneliti Universitas Sriwijaya (2024)
                  </p>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line border border-slate-200/80 dark:border-slate-700/80">
              {activeModule.content}
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: INFOGRAFIS ARTIKEL RISKO GGL */}
      {activeTab === 'infografis' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Infografis Artikel Risiko Kesehatan GGL
                </h3>
                <p className="text-[10px] text-slate-500">
                  Penyakit metabolik akibat akumulasi Gula, Garam, dan Lemak
                </p>
              </div>
            </div>

            {/* Filter Categories */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setSelectedRisk('all')}
                className={`px-2 py-1 rounded-lg transition ${selectedRisk === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Semua Risiko
              </button>
              <button
                onClick={() => setSelectedRisk('sugar')}
                className={`px-2 py-1 rounded-lg transition ${selectedRisk === 'sugar' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Gula
              </button>
              <button
                onClick={() => setSelectedRisk('salt')}
                className={`px-2 py-1 rounded-lg transition ${selectedRisk === 'salt' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Garam
              </button>
              <button
                onClick={() => setSelectedRisk('fat')}
                className={`px-2 py-1 rounded-lg transition ${selectedRisk === 'fat' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Lemak
              </button>
            </div>
          </div>

          {/* Article & Infographic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRisks.map((risk) => {
              const IconComp = risk.icon;
              return (
                <div
                  key={risk.id}
                  className={`p-3.5 rounded-2xl border ${risk.bg} space-y-2 flex flex-col justify-between transition hover:shadow-md`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${risk.badgeColor}`}>
                        {risk.cause}
                      </span>
                      <IconComp className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </div>

                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 leading-snug">
                      {risk.title}
                    </h4>

                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {risk.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1 text-[10px]">
                    <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Fakta Riset: {risk.stats}</span>
                    </div>
                    <div className="text-emerald-800 dark:text-emerald-300 font-medium">
                      💡 Solusi: {risk.tips}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};



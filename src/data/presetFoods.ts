import { PresetFood, EducationalItem } from '../types';

export const PRESET_FOODS: PresetFood[] = [
  // Jajanan Khas Sumsel / Palembang
  {
    name: 'Pempek Telur Kecil (3 buah + Cuko)',
    category: 'Jajanan',
    defaultPortion: '1 porsi (3 pempek + cuko)',
    sugarGram: 14,
    saltGram: 1.8,
    fatGram: 8,
    icon: '🥟',
  },
  {
    name: 'Pempek Kapal Selam Besar + Cuko',
    category: 'Makanan Utama',
    defaultPortion: '1 porsi besar lengkap',
    sugarGram: 22,
    saltGram: 2.8,
    fatGram: 16,
    icon: '🥟',
  },
  {
    name: 'Pempek Adaan / Kulit Goreng',
    category: 'Jajanan',
    defaultPortion: '2 buah + cuko',
    sugarGram: 12,
    saltGram: 2.1,
    fatGram: 14,
    icon: '🥟',
  },
  {
    name: 'Es Kacang Merah Palembang',
    category: 'Minuman',
    defaultPortion: '1 gelas dengan es serut & susu',
    sugarGram: 32,
    saltGram: 0.2,
    fatGram: 5,
    icon: '🍧',
  },
  {
    name: 'Model Ikan / Tekwan Kuah Kaldu',
    category: 'Makanan Utama',
    defaultPortion: '1 mangkuk kuah hangat',
    sugarGram: 4,
    saltGram: 3.2,
    fatGram: 7,
    icon: '🍲',
  },
  {
    name: 'Celimpungan / Laksan Kuah Santan',
    category: 'Makanan Utama',
    defaultPortion: '1 porsi santan kental',
    sugarGram: 3,
    saltGram: 2.9,
    fatGram: 18,
    icon: '🥣',
  },
  {
    name: 'Martabak HAR + Kuah Kari Daging',
    category: 'Makanan Utama',
    defaultPortion: '1 porsi (2 telur + kari)',
    sugarGram: 2,
    saltGram: 3.1,
    fatGram: 22,
    icon: '🍳',
  },
  {
    name: 'Burgo / Lakso Palembang',
    category: 'Makanan Utama',
    defaultPortion: '1 mangkuk kuah gurih',
    sugarGram: 3,
    saltGram: 2.5,
    fatGram: 15,
    icon: '🍜',
  },
  {
    name: 'Es Mambo / Es Lilin Kantin',
    category: 'Jajanan',
    defaultPortion: '1 bungkus es lilin',
    sugarGram: 20,
    saltGram: 0.1,
    fatGram: 2,
    icon: '🍦',
  },
  {
    name: 'Kemplang Panggang + Sambal Terasi',
    category: 'Jajanan',
    defaultPortion: '3 keping sedang',
    sugarGram: 2,
    saltGram: 1.4,
    fatGram: 3,
    icon: '🍘',
  },
  {
    name: 'Kue Maksuba / 8 Jam Palembang',
    category: 'Jajanan',
    defaultPortion: '1 potong kecil (50g)',
    sugarGram: 28,
    saltGram: 0.3,
    fatGram: 12,
    icon: '🍰',
  },
  {
    name: 'Kue Srikaya Palembang',
    category: 'Jajanan',
    defaultPortion: '1 mangkuk kecil',
    sugarGram: 24,
    saltGram: 0.2,
    fatGram: 8,
    icon: '🍮',
  },
  // Jajanan Populer & Minuman Umum
  {
    name: 'Teh Kemasan Manis',
    category: 'Minuman',
    defaultPortion: '1 botol/kotak (350ml)',
    sugarGram: 28,
    saltGram: 0.1,
    fatGram: 0,
    icon: '🥤',
  },
  {
    name: 'Es Boba / Milk Tea',
    category: 'Minuman',
    defaultPortion: '1 gelas sedang',
    sugarGram: 38,
    saltGram: 0.2,
    fatGram: 8,
    icon: '🧋',
  },
  {
    name: 'Gorengan (Bakwan/Tempe/Tahu)',
    category: 'Jajanan',
    defaultPortion: '2 buah',
    sugarGram: 1,
    saltGram: 1.2,
    fatGram: 14,
    icon: '🧆',
  },
  {
    name: 'Snack Chiki / Keripik Gurih',
    category: 'Jajanan',
    defaultPortion: '1 bungkus sedang (50g)',
    sugarGram: 4,
    saltGram: 1.8,
    fatGram: 12,
    icon: '🍿',
  },
  {
    name: 'Mi Instan Kuah/Goreng',
    category: 'Makanan Utama',
    defaultPortion: '1 bungkus (85g)',
    sugarGram: 5,
    saltGram: 3.8,
    fatGram: 16,
    icon: '🍜',
  },
  {
    name: 'Es Krim Cokelat/Vanila',
    category: 'Jajanan',
    defaultPortion: '1 cup/stik',
    sugarGram: 22,
    saltGram: 0.2,
    fatGram: 10,
    icon: '🍦',
  },
  {
    name: 'Nasi Uduk + Telur Balado',
    category: 'Makanan Utama',
    defaultPortion: '1 porsi',
    sugarGram: 3,
    saltGram: 1.5,
    fatGram: 18,
    icon: '🍚',
  },
  {
    name: 'Bakso Sapi Semangkuk',
    category: 'Makanan Utama',
    defaultPortion: '1 porsi kuah lengkap',
    sugarGram: 2,
    saltGram: 2.8,
    fatGram: 15,
    icon: '🍲',
  },
  {
    name: 'Susu UHT Cokelat Anak',
    category: 'Minuman',
    defaultPortion: '1 kotak (200ml)',
    sugarGram: 16,
    saltGram: 0.3,
    fatGram: 5,
    icon: '🥛',
  },
  {
    name: 'Buah Apel / Pisang Segar',
    category: 'Sehat',
    defaultPortion: '1 buah sedang',
    sugarGram: 12,
    saltGram: 0,
    fatGram: 0.2,
    icon: '🍎',
  },
  {
    name: 'Air Putih',
    category: 'Sehat',
    defaultPortion: '1 gelas (250ml)',
    sugarGram: 0,
    saltGram: 0,
    fatGram: 0,
    icon: '💧',
  },
  {
    name: 'Nasi Putih + Ayam Bakar',
    category: 'Makanan Utama',
    defaultPortion: '1 porsi sedang',
    sugarGram: 2,
    saltGram: 1.1,
    fatGram: 9,
    icon: '🍗',
  }
];

export const EDUCATIONAL_MODULES: EducationalItem[] = [
  {
    id: 'edu-ggl-kemenkes',
    title: 'Batas Aman GGL Kemenkes RI (Aturan G4-G1-L5)',
    category: 'kemenkes',
    summary: 'Anjuran Konsumsi Gula, Garam, dan Lemak Per Orang Per Hari dari Kementerian Kesehatan RI.',
    content: `Menurut Permenkes No. 30 Tahun 2013, batas konsumsi harian GGL untuk orang dewasa adalah:
- GULA: Maksimal 4 Sendok Makan (50 gram/hari)
- GARAM: Maksimal 1 Sendok Teh (5 gram / 2.000 mg Natrium/hari)
- LEMAK: Maksimal 5 Sendok Makan (67 gram/hari)

Untuk anak sekolah (usia 6–12 tahun), batas asupan gula sebaiknya < 25 gram per hari agar mencegah bahaya diabetes usia dini, obesitas anak, serta gigi berlubang!`,
    quiz: {
      question: 'Berapakah batas maksimal konsumsi gula harian yang dianjurkan Kemenkes RI untuk dewasa (Aturan G4)?',
      options: ['2 Sendok Makan (25 gram)', '4 Sendok Makan (50 gram)', '6 Sendok Makan (75 gram)', 'Tidak ada batas'],
      correctIndex: 1,
      explanation: 'Benar! Rumus G4 berarti batas gula maksimal adalah 4 sendok makan atau setara 50 gram per hari.'
    }
  },
  {
    id: 'edu-gula-anak',
    title: 'Bahaya Gula Berlebih pada Anak & Jajanan Sekolah',
    category: 'gula',
    summary: 'Waspadai minuman kemasan manis dan boba yang bisa melebihi batas gula harian dalam 1 gelas.',
    content: `Minuman manis kemasan atau es boba seringkali mengandung hingga 35–45 gram gula dalam satu porsi. Jumlah ini langsung MELAMPAUI batas aman harian anak (25 gram)!

Dampak gula berlebih:
1. Obesitas pada anak dan remaja.
2. Kerusakan gigi (karies).
3. Mudah lelah dan penurunan konsentrasi belajar akibat 'sugar crash'.
4. Risiko Diabetes Melitus Tipe 2 di usia muda.`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder / embeddable educational link
    quiz: {
      question: 'Apa risiko utama bagi siswa yang sering mengonsumsi minuman sangat manis saat sekolah?',
      options: ['Gigi tetap bersih', 'Konsentrasi bertambah', 'Risiko obesitas & kerusakan gigi', 'Tidur lebih nyenyak'],
      correctIndex: 2,
      explanation: 'Tepat sekali! Asupan gula tinggi berulang memicu kerusakan gigi dan risiko kelebihan berat badan.'
    }
  },
  {
    id: 'edu-garam-hipertensi',
    title: 'Garam Tersembunyi di Mi Instan & Snack Gurih',
    category: 'garam',
    summary: 'Satu bungkus mi instan kuah dapat mengandung hingga 80% batas garam harianmu.',
    content: `Rasa gurih pada mi instan, keripik kemasan, dan bumbu tabur berasal dari garam dan MSG (natrium).
Satu bungkus mi instan mengandung rata-rata 3,5 hingga 4 gram garam (1.500–1.800 mg Natrium). Padahal batas harian cuma 5 gram (1 sendok teh)!

Tips Mengurangi Garam:
- Gunakan setengah bumbu saja jika memasak mi instan.
- Ganti snack gurih olahan dengan buah segar atau kacang rebus.
- Kurangi saus dan penyedap rasa berlebih.`,
    quiz: {
      question: 'Berapa jumlah garam maksimal per hari menurut standar Kemenkes RI (Aturan G1)?',
      options: ['1 Sendok Teh (5 gram)', '3 Sendok Teh (15 gram)', '1 Sendok Makan (15 gram)', '5 Sendok Teh'],
      correctIndex: 0,
      explanation: 'Tepat! Garam maksimal 1 sendok teh (5g atau 2000mg natrium) per hari.'
    }
  },
  {
    id: 'edu-lemak-gorengan',
    title: 'Lemak Jenuh & Gorengan Jajanan Anak',
    category: 'lemak',
    summary: 'Minyak jelantah berulang kali pakai pada gorengan jalanan meningkatkan lemak jenuh dan trans.',
    content: `Gorengan seperti bakwan, tempe goreng, atau tahu isi yang digoreng dengan minyak yang dipanaskan berulang kali mengandung tinggi lemak jenuh dan trans.
Dua buah gorengan dapat menyumbang hingga 14 gram lemak. Batas harian lemak anak adalah sekitar 40 gram.

Pilihan Lemak Sehat:
- Alpukat, kacang-kacangan, telur rebus.
- Pilih makanan dengan metode kukus, panggang, atau tumis sedikit minyak.`,
    quiz: {
      question: 'Metode memasak apa yang paling disarankan untuk mengurangi asupan lemak jenuh?',
      options: ['Menggoreng deep-fry', 'Mengukus atau memanggang', 'Memakai minyak berulang kali', 'Menggoreng dengan margarin tebal'],
      correctIndex: 1,
      explanation: 'Hebat! Mengukus, merebus, atau memanggang menjaga kadar lemak tetap rendah.'
    }
  }
];

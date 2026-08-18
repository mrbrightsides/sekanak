<div align="center">

  <img src="https://i.imgur.com/KcQRTiO.png" alt="SEKANAK Logo" width="130" height="130" style="margin-right: 20px;" />
  <img src="https://i.imgur.com/OuoFtOD.png" alt="Universitas Sriwijaya Logo" width="130" height="130" />

  # 🌟 SEKANAK — GGL AI Sriwijaya
  ### Sistem Edukasi Kesehatan Anak & Keluarga Berbasis AI
  **Pemantauan & Pengendalian Konsumsi Gula, Garam, dan Lemak (GGL) Anak Sekolah Dasar Berstandar Kemenkes RI & WHO**

  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-sekanak.vercel.app-059669?style=for-the-badge)](https://sekanak.vercel.app/)
  [![GitHub Repository](https://img.shields.io/badge/📂_GitHub_Repo-mrbrightsides%2Fsekanak-181717?style=for-the-badge&logo=github)](https://github.com/mrbrightsides/sekanak)
  [![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)
  [![Firebase Firestore](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

</div>

---

## 📖 Tentang Aplikasi SEKANAK

**SEKANAK** (*Sistem Edukasi Kesehatan Anak dan Keluarga*) adalah platform web progresif berbasis Kecerdasan Buatan (AI) yang dikembangkan bersama **Universitas Sriwijaya (UNSRI)** untuk meneliti, mengedukasi, dan memitigasi risiko penyakit degeneratif (diabetes melitus, hipertensi, obesitas anak) akibat konsumsi berlebih **Gula, Garam, dan Lemak (GGL)** pada anak usia sekolah dasar, khususnya di wilayah Sumatera Selatan dan sekitarnya.

Aplikasi ini mengintegrasikan panduan batas konsumsi harian **Kementerian Kesehatan RI & WHO** dengan basis data kuliner lokal khas Palembang/Sumsel serta kecerdasan buatan multimodal **Google Gemini AI**.

---

## 🔗 Tautan Penting

- 🌐 **Aplikasi Live (Produksi)**: [https://sekanak.vercel.app/](https://sekanak.vercel.app/)
- 📂 **Repositori GitHub**: [https://github.com/mrbrightsides/sekanak](https://github.com/mrbrightsides/sekanak)

---

## ✨ Fitur-Fitur Unggulan

### 1. 🥟 Database & Autocomplete Jajanan Khas Sumsel / Palembang
- **20+ Katalog Kuliner Lokal Lengkap**: Pempek Telur, Pempek Kapal Selam, Pempek Kulit, Model Ikan, Model Gandum, Celimpungan, Laksan, Burgo, Lakso, Mie Celor, Martabak HAR, Es Kacang Merah, Es Mambo, Kemplang Panggang, Kue Maksuba, Kue 8 Jam, Kue Srikaya, dll.
- **Kandungan GGL Bawaan**: Setiap menu dilengkapi estimasi gramasi Gula, Garam, Lemak, dan Kalori yang terstandarisasi.
- **Pencarian Cepat & Filter Kategori**: Filter instan untuk kategori *Pempek, Ikan, Santan, Es, dan Kue*.

### 2. 📸 Kamera Foto Makanan AI & Smart Label Scanner (Gemini Vision)
- **Kamera Foto Makanan Langsung (*Food Camera AI*)**: Pengguna dapat mengambil foto makanan secara *real-time* via kamera gawai. AI Gemini Vision mengevaluasi visual makanan (minyak, kuah, porsi) untuk memberikan estimasi kasar GGL secara instan.
- **Smart Label Scanner (OCR Kemasan)**: Memindai label *Informasi Nilai Gizi* (*Nutrition Facts*) produk kemasan berlisensi BPOM dan mengekstrak gramasi gula, garam, serta lemak secara otomatis.

### 3. 📊 Indikator Status GGL Berstandar Kemenkes RI
- **Ambang Batas Harian Anak (Anjuran Kemenkes RI)**:
  - 🍬 **Gula**: Maksimal **25 gram / hari** (± 2 sendok makan)
  - 🧂 **Garam / Natrium**: Maksimal **3 gram / hari** (± ½ sendok teh)
  - 🧈 **Lemak**: Maksimal **67 gram / hari** (± 5 sendok makan)
- **Visual Status Adaptif**:
  - 🟢 **Aman**: Intake masih dalam batas sehat harian.
  - 🟡 **Waspada**: Intake mendekati ambang batas toleransi.
  - 🔴 **Bahaya / Berlebih**: Intake melampaui batas dengan notifikasi koreksi nutrisi dari AI.

### 4. 🤖 Asisten Konsultan Nutrisi Virtual Dr. SEKANAK AI
- Obrolan interaktif langsung dengan AI berlatar belakang dokter spesialis gizi anak untuk bertanya seputar tips bekal sehat, trik membatasi jajanan manis/asin, dan solusi gizi keluarga.

### 5. 🔔 Pengingat & Alarm Jam Rawan Jajan Sekolah
- Notifikasi audio & browser push pada jam-jam kritis:
  - 🏫 **09:30 WIB** — Alarm Istirahat Pertama Sekolah
  - 🍱 **12:00 WIB** — Alarm Makan Siang
  - 🎒 **15:00 WIB** — Alarm Jajan Sore Pulang Sekolah
  - 📊 **19:00 WIB** — Alarm Rekapitulasi GGL Harian

### 6. 👥 Multi-Role User Access System
- 👦 **Siswa SD**: Antarmuka gamifikasi dengan poin, lencana prestasi, dan karakter ramah anak.
- 👩‍👧 **Orang Tua**: Dashboard pemantauan riwayat makan anak, grafik mingguan, dan tips bekal.
- 🏫 **Guru / Wali Kelas**: Pemantauan rata-rata asupan gizi untuk satu rombongan belajar.
- 🔬 **Peneliti UNSRI**: Panel studi intervensi nutrisi, metrik TAM (*Technology Acceptance Model*), dan instrumen penelitian lapangan.

### 7. 📄 Cetak & Ekspor Rapor Nutrisi Siswa PDF Resmi
- Menghasilkan lembar evaluasi rapor nutrisi resmi ber-kop Universitas Sriwijaya (UNSRI) dan SEKANAK yang dapat dicetak atau disimpan ke format PDF.

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

| Lapisan / Komponen | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Styling & Design System** | Tailwind CSS v4, Lucide React Icons |
| **Visualisasi & Gamifikasi** | Recharts, Canvas Confetti |
| **Backend Server** | Node.js, Express.js (Single CommonJS bundle with `esbuild`) |
| **Kecerdasan Buatan (AI)** | Google GenAI SDK (`@google/genai`), Gemini 2.5 Flash |
| **Database & Cloud Storage** | Firebase Firestore |
| **Hosting & Deployment** | Vercel (Production) & Google Cloud Run |

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18+ atau 20+
- [npm](https://www.npmjs.com/) atau [bun](https://bun.sh/)

### 1. Kloning Repositori
```bash
git clone https://github.com/mrbrightsides/sekanak.git
cd sekanak
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env`)
Salin berkas contoh konfigurasi:
```bash
cp .env.example .env
```
Isi variabel berikut di berkas `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Dapatkan kunci API Gemini secara gratis melalui [Google AI Studio](https://aistudio.google.com/)).*

### 4. Menjalankan Server Pengembangan (Development)
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:3000`.

### 5. Build Produksi
```bash
npm run build
npm run start
```

---

## 📂 Struktur Direktori Proyek

```
sekanak/
├── public/                  # Aset statis & logo
├── src/
│   ├── components/          # Komponen antarmuka (Navbar, FoodInput, FoodCameraModal, dll.)
│   ├── constants/           # Konstanta aplikasi
│   ├── data/                # Data lokal Sumsel (localFoodData.ts, presetFoods.ts)
│   ├── lib/                 # Konfigurasi Firebase Firestore (firebase.ts)
│   ├── App.tsx              # Komponen utama aplikasi
│   ├── main.tsx             # Entry point React
│   ├── index.css            # Styling global Tailwind CSS v4
│   └── types.ts             # Definisi TypeScript & konstanta APP_LOGOS
├── server.ts                # Backend Express & Integrasi Google Gemini API
├── PANDUAN_SEKANAK.md       # Dokumentasi & manual penggunaan lengkap
├── package.json             # Konfigurasi dependensi & skrip build
├── vite.config.ts           # Konfigurasi Vite
└── README.md                # Dokumentasi utama proyek
```

---

## 🏛️ Institusi & Kolaborasi Riset

Proyek ini dikembangkan dalam rangka riset intervensi kesehatan dan gizi anak:
- **Institusi**: Universitas Sriwijaya (UNSRI)
- **Fokus Riset**: Edukasi Interaktif Konsumsi Gula, Garam, dan Lemak (GGL) pada Anak Sekolah Dasar
- **Model Evaluasi**: *Technology Acceptance Model* (TAM)

---

<div align="center">
  <sub>Dibuat dengan ❤️ dan dedikasi untuk kesehatan generasi penerus bangsa bersama <strong>SEKANAK — Universitas Sriwijaya</strong>.</sub>
</div>

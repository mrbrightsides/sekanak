# 📘 Panduan Penggunaan & Dokumentasi Sistem SEKANAK (GGL AI Sriwijaya)

**SEKANAK** (*Sistem Edukasi & Konsumsi Nutrisi Anak - Universitas Sriwijaya*) adalah aplikasi berbasis Kecerdasan Buatan (AI) yang dirancang untuk memantau, mengontrol, dan mengedukasi konsumsi **Gula, Garam, dan Lemak (GGL)** pada anak-anak sekolah dasar, khususnya di wilayah Sumatera Selatan dan sekitarnya.

---

## 🚀 Ringkasan Fitur Utama yang Sudah Tersedia

### 1. 🥟 Database & Autocomplete Jajanan Khas Sumsel / Palembang
* **20+ Katalog Kuliner Lokal**: Menyediakan database komprehensif jajanan lokal seperti Pempek Telur Kecil, Pempek Kapal Selam, Model Ikan, Model Gandum, Celimpungan, Laksan, Burgo, Lakso, Mie Celor, Martabak HAR, Es Kacang Merah, Es Mambo, Kemplang Panggang, Kue Maksuba, Kue 8 Jam, dan Kue Srikaya.
* **Presisi Estimasi GGL & Kalori**: Setiap jajanan dilengkapi dengan takaran bawaan estimasi kandungan Gula (g), Garam (g), Lemak (g), serta Kalori (kcal).
* **Fitur Autocomplete & Kategori Filter**: Memudahkan siswa/orang tua mencari makanan berdasarkan nama atau kategori (*Pempek, Olahan Ikan, Santan, Es/Minuman, Kue*).

### 2. 📸 Kamera Foto Makanan AI & Smart Label Scanner (Gemini Vision)
* **Kamera Foto Makanan Langsung (Food Camera AI)**: Pengguna dapat mengambil foto makanan secara *real-time* via kamera web/HP atau mengunggah foto makanan. Sistem AI Vision menganalisis visual makanan (tekstur minyak, kuah/saus, porsi) untuk memberikan estimasi GGL kasar sebagai acuan input instan.
* **Smart Label Scanner (OCR Kemasan)**: Menggunakan teknologi AI Google Gemini Vision untuk memindai label informasi nilai gizi pada kemasan snack/minuman kemasan.
* **Auto-Populate ke Form Input**: Hasil analisis foto otomatis mengisi nama makanan, takaran porsi, gramasi Gula, Garam, Lemak, dan Kalori ke dalam formulir.

### 3. 📊 Indikator Status Nutrisi & Batas Aman Anak (GGL Gauges)
* **Standar Kementerian Kesehatan RI**:
  * 🍬 **Gula**: Maksimal **25g / hari** (~2 sendok makan)
  * 🧂 **Garam**: Maksimal **3g / hari** (~1/2 sendok teh)
  * 🧈 **Lemak**: Maksimal **67g / hari** (~5 sendok makan)
* **Visual Status Interaktif**:
  * 🟢 **Aman**: Konsumsi di bawah batas rekomendasi.
  * 🟡 **Waspada**: Konsumsi mendekati ambang batas.
  * 🔴 **Bahaya / Berlebih**: Konsumsi melebihi batas harian dengan rekomendasi tindakan korektif AI.

### 4. 🔔 Alarm & Push Notifications Jam Rawan Jajan Sekolah
* **Web Push Notification & Chime Sound**: Notifikasi berbasis browser dengan nada pengingat bawaan.
* **4 Slot Jam Kritis Sekolah**:
  * 🏫 **09:30 WIB**: Alarm Jam Istirahat Pertama Sekolah.
  * 🍱 **12:00 WIB**: Alarm Jam Makan Siang Sekolah.
  * 🎒 **15:00 WIB**: Alarm Jam Jajan Sore / Pulang Sekolah.
  * 📊 **19:00 WIB**: Alarm Rekap Intake GGL Malam Hari.
* **Pengaturan Fleksibel**: Masing-masing alarm dapat diaktifkan/dimatikan serta disesuaikan jamnya.

### 5. 👥 Multi-Role User Access System (4 Akses Peran)
* 👦 **Siswa SD**: Antarmuka berbasis gamifikasi (*poin, lencana prestasi, karakter ramah anak*).
* 👩‍👧 **Orang Tua**: Dashboard pemantauan riwayat harian anak, grafik tren, dan tips pencegahan obesitas/diabetes anak.
* 🏫 **Guru SD**: Fitur pemantauan kebiasaan jajan kantin sekolah untuk satu kelas.
* 🔬 **Peneliti UNSRI**: Dashboard analisis data agregat intake GGL siswa di Palembang/Sumsel untuk studi nutrisi.

### 6. 📄 Ekspor Laporan PDF Rekapitutasi
* **Fitur Cetak Laporan**: Menghasilkan dokumen PDF rekapitutasi konsumsi GGL harian/mingguan yang siap dicetak untuk konsultasi dengan dokter, ahli gizi, atau wali kelas.

### 7. 📖 Edukasi Interaktif, Komik & Kuis Nutrisi
* **Modul Pembelajaran Anak**: Materi interaktif berbentuk komik visual yang menjelaskan bahaya kelebihan gula, garam, dan minyak gorengan secara menyenangkan.
* **Kuis Berhadiah Poin**: Kuis interaktif untuk menguji pemahaman siswa mengenai pola makan sehat.

---

## 🛠️ Cara Penggunaan Aplikasi

### A. Memilih Peran / Akses Pengguna
1. Pada bagian atas layar (*Quick Demo Role Bar*), pilih salah satu peran:
   * **Siswa SD**
   * **Orang Tua**
   * **Guru SD**
   * **Peneliti UNSRI**
2. Atau klik tombol profil di pojok kanan atas untuk mengubah nama, usia, dan target nutrisi khusus.

---

### B. Mencatat Makanan & Jajanan Harian
1. Buka Tab **Input Makanan** (atau ikon ➕ di navigasi bawah).
2. Terdapat **3 Cara Input**:
   * **Cara 1 (Autocomplete Kuliner Sumsel)**: Ketik nama jajanan (misal: *Pempek Telur*, *Es Kacang Merah*, *Model*) di kolom pencarian. Pilih item yang muncul untuk mengisi takaran GGL secara otomatis.
   * **Cara 2 (Scan Foto Kemasan / Analisis AI)**: Masukkan nama makanan lalu klik **Analisis AI** atau gunakan modul **Scan Label Gizi** untuk membaca foto kemasan secara otomatis.
   * **Cara 3 (Input Manual)**: Masukkan gramasi Gula, Garam, dan Lemak secara manual sesuai pengetahuan Anda.
3. Pilih jenis waktu makan (*Sarapan, Istirahat Sekolah, Makan Siang, Jajan Sore, Makan Malam*).
4. Klik tombol **Tambah Catatan Makanan**.

---

### C. Mengaktifkan Alarm & Push Reminders
1. Buka Tab **Pengingat Harian** (ikon 🔔).
2. Aktifkan sakelar **Push Reminders Jam Rawan Jajan**.
3. Klik tombol **Aktifkan Notifikasi Browser** apabila muncul instruksi di layar.
4. Anda dapat menekan tombol **Uji Alarm Suara** (ikon speaker) untuk mendengarkan nada pengingat.

---

### D. Mengunduh Laporan PDF Nutrisi
1. Buka Tab **Riwayat & Grafik** (ikon 📊).
2. Klik tombol **Cetak Laporan PDF / Ekspor**.
3. Pilih rentang waktu (*Hari Ini, 7 Hari Terakhir, atau Bulan Ini*), lalu klik **Unduh Dokumen PDF**.

---

## 📱 Desain Responsif & Pengalaman Mobile
* **Mobile-First Layout**: Tampilan disesuaikan secara presisi untuk perangkat HP Android/iOS tanpa *horizontal overflow*.
* **Tactile Press Animation**: Dilengkapi animasi tekan halus (*active scale effect*) pada seluruh tombol dan kartu interaktif untuk kenyamanan sentuhan jari.
* **Mode Terang & Gelap**: Sakelar mode malam (ikon matahari/bulan) di bilah navigasi atas untuk kenyamanan mata.

---

*Dikembangkan oleh Tim Riset Nutrisi & AI Universitas Sriwijaya (UNSRI) - 2024-2026.*

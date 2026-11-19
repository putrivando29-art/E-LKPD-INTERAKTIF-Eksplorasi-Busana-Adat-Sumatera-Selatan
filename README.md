# Butik Warisan Sriwijaya

E-LKPD interaktif Matematika SMP kelas VIII: peluang teoretis, frekuensi relatif, dan frekuensi harapan, dengan tema busana adat perempuan Palembang. Alokasi waktu 2 JP (2 × 40 menit).

## Isi

| Halaman | Isi |
| --- | --- |
| 1. Sampul | Judul, topik, karakter chibi yang berganti 6 pasangan busana tiap 1 detik, identitas peserta didik, tautan "Mulai sebagai siswa baru" |
| 2. Petunjuk | Petunjuk penggunaan, alokasi waktu, capaian dan 3 tujuan pembelajaran, apersepsi (3 soal) |
| 3. Butik | Aktivitas 1 (Kenali Busananya, butik bermanekin, tabel 3 × 2), pertanyaan pemantik, Ayo Isi, pengertian peluang teoretis, Aktivitas 2 (2.1–2.4) |
| 4. Frekuensi Harapan | Pengertian frekuensi harapan, Aktivitas 3 (3.1–3.2), dikerjakan sebelum roda diputar |
| 5. Roda Putar | Pengertian frekuensi relatif, Aktivitas 4 (4.1 roda 30 kali, 4.2–4.4, 4.5 Putar Cepat 300 Kali) |
| 6. Kumpulkan | Kesimpulan, refleksi, daftar semua jawaban dengan tombol Ubah, Kumpulkan Jawaban, Unduh PDF |

`informasi-media.html` (Informasi Media) berisi kesesuaian materi dengan kurikulum, sumber setiap detail busana, bagian ilustrasi yang disederhanakan, dan catatan musik latar. Dokumen produk lengkap, termasuk kunci jawaban 24 butir, ada di `product.md`.

## Perilaku penting

- Soal hitungan berupa **jawaban uraian**: siswa menulis sendiri Diketahui, Ditanya, dan Jawab baris demi baris, lalu kalimat "Jadi". Setiap baris memakai kotak rumus MathLive (`vendor/mathlive`), jadi pecahan tampil bertumpuk; di HP muncul papan ketik berisi tombol pecahan. Kalimat Jadi dinilai otomatis, langkahnya dinilai guru dari PDF. Setiap soal diberi label Mudah, Sedang, atau Sulit.
- Pertanyaan alasan tertulis dan kesimpulan dengan kalimat sendiri dinilai guru dari PDF.
- Kode Songket ditulis **Sg** agar tidak tertukar dengan lambang ruang sampel S.
- Setiap pasangan pakaian hanya bisa disimpan satu kali. Pasangan yang sama memunculkan "Pasangan pakaian ini sudah kamu pilih!" disertai layar bergetar.
- Roda putar memakai `crypto.getRandomValues` dengan rejection sampling, sehingga peluang tiap sektor tepat 1/6. Total percobaan dikunci tepat 30.
- **Pengumpulan hanya satu kali.** Pengumpulan pertama disimpan per identitas (nama + kelas + nomor presensi) di `localStorage`, sehingga tetap diingat walau web ditutup. Sesudahnya siswa melihat ✓/✗ dan petunjuk **Cara** untuk soal yang salah, lalu boleh berlatih (Periksa Jawaban Latihan) tanpa mengubah nilai akhir.
- Tombol **Unduh PDF** langsung mengunduh `Hasil-ELKPD-<nama siswa>.pdf` berisi pengumpulan pertama, termasuk gambar pasangan kesukaan. Siswa mengirim file ini ke WhatsApp guru.
- Keterbatasan: kunci disimpan di browser, jadi siswa masih bisa mengumpulkan ulang dari perangkat atau browser lain. Gunakan PDF pertama dan kolom "Kiriman ke-" di Google Sheet sebagai pengaman.

## Suara

- Efek suara dibuat oleh browser lewat Web Audio, tanpa file.
- Musik latar diputar berulang dari `audio/musik-latar.mp3`: komposisi orisinal berupa melodi dan petikan senar sintetis (G mayor, tempo 112), **bukan rekaman alat musik tradisional**. Cara mengganti dengan rekaman asli ada di `audio/README.md`.
- Panel Suara di kanan atas: musik dan efek suara, masing-masing dengan tombol aktif dan volume.

## Mencatat hasil ke Google Sheet (opsional)

Tanpa pengaturan, hasil dikumpulkan lewat PDF ke WhatsApp guru. Agar pengumpulan pertama juga tercatat di Google Sheet:

1. Ikuti petunjuk di `tools/google-apps-script.gs`. Membuka URL `/exec` di browser harus menampilkan "Penerima hasil E-LKPD Butik Warisan Sriwijaya aktif".
2. Tempel URL aplikasi web ke `submitUrl` di `js/config.js`, lalu deploy ulang.

Sheet "Jawaban" punya kolom "Kiriman ke-". Nilai 2 ke atas (baris merah muda) berarti siswa yang sama mengumpulkan lagi dari perangkat lain. Pakai baris dengan nilai 1.

Browser tidak bisa membaca balasan Google Apps Script (mode `no-cors`), jadi pesan "tercatat" berarti permintaan terkirim. Periksa sheet untuk memastikan baris baru masuk.

## Menjalankan

Situs statis tanpa proses build. Buka `index.html` lewat server lokal, misalnya:

```bash
python3 -m http.server 8000
```

## Deploy

Vercel: impor repositori, pilih Framework Preset "Other", kosongkan build command, output directory `.`.

Netlify: impor repositori, kosongkan build command, publish directory `.`.

KaTeX (rumus), MathLive (kotak rumus), dan jsPDF sudah disertakan di folder `vendor`, sehingga tetap berjalan walau CDN diblokir jaringan sekolah. Font Google (Fredoka, Nunito) butuh internet; tanpa internet browser memakai font cadangan.

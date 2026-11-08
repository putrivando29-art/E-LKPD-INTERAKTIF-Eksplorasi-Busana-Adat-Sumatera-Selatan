# Stylist Studio – Sriwijaya Heritage Edition

E-LKPD interaktif Matematika SMP kelas VIII: peluang teoretis, frekuensi relatif, dan frekuensi harapan, dengan tema busana adat perempuan Palembang.

## Isi

| Halaman | Isi |
| --- | --- |
| 1. Sampul | Judul, topik, karakter chibi yang berganti 6 pasangan busana tiap 1 detik, identitas peserta didik (nama, kelas/semester, nomor presensi) |
| 2. Petunjuk | Petunjuk penggunaan, capaian dan tujuan pembelajaran, apersepsi (3 soal) |
| 3. Butik Digital | Aktivitas 1 (butik bermanekin, tabel silang 3 × 2), pertanyaan pemantik pasangan pakaian kesukaan, pengertian peluang teoretis, Aktivitas 2 (2 soal) |
| 4. Roda Putar | Pengertian frekuensi relatif, 3.1 Eksperimen Roda Putar 30 kali, 3.2 Menentukan Frekuensi Relatif |
| 5. Frekuensi Harapan | Pengertian frekuensi harapan, 3.3 Menghitung Frekuensi Harapan, 3.4 Membandingkan (2 langkah bertahap), 3.5 Kesimpulan |
| 6. Kumpulkan | Daftar semua jawaban dengan tombol Ubah, tombol Kumpulkan Jawaban, skor, Unduh PDF |

`informasi-media.html` (Informasi Media) berisi kesesuaian materi dengan kurikulum, sumber setiap detail busana, bagian ilustrasi yang disederhanakan, dan catatan musik latar. Dokumen produk lengkap, termasuk kunci jawaban 23 butir, ada di `product.md`.

## Perilaku penting

- Setiap pasangan pakaian hanya bisa disimpan satu kali. Notifikasi muncul di tengah layar; pasangan yang sama memunculkan "Pasangan pakaian ini sudah kamu pilih!" disertai layar bergetar.
- Pasangan pakaian kesukaan yang dipilih siswa pada pertanyaan pemantik menjadi kejadian A di Aktivitas 1, 2, dan 3. Pasangan teman di Aktivitas 2 diacak sekali lalu tetap.
- Aktivitas 2 terbuka setelah keenam sel tabel terisi.
- Roda putar memakai `crypto.getRandomValues` dengan rejection sampling, sehingga peluang tiap sektor tepat 1/6.
- Total percobaan dikunci tepat 30. "Putar Acak 30 Kali" selalu mulai dari nol lalu memutar tepat 30 kali.
- "Atur Ulang Data" hanya menghapus data percobaan. Jawaban dan tabel Aktivitas 1 tetap tersimpan.
- Jawaban tidak pernah dikunci. Setiap aktivitas hanya menampilkan status "Terisi x dari y"; benar atau salah baru ditampilkan setelah siswa menekan Kumpulkan Jawaban.
- Jika siswa mengubah jawaban setelah mengumpulkan, halaman Kumpulkan meminta pengumpulan ulang. Nomor pengumpulan ikut tercatat.
- Tombol **Unduh PDF** langsung mengunduh file `Hasil-ELKPD-<nama siswa>.pdf` (dibuat di browser dengan jsPDF, tanpa dialog cetak) yang selalu berisi **hasil pengumpulan pertama** (jawaban, skor, dan data percobaan saat itu), walaupun siswa sudah mengumpulkan ulang. Tombol aktif setelah pengumpulan pertama.
- Jawaban tersimpan di `sessionStorage` (kunci `stylist-studio-sriwijaya-v7`) selama tab browser terbuka, termasuk saat halaman dimuat ulang.

## Suara

- Efek suara (klik, pilih manekin, simpan berhasil, pasangan ganda, putaran roda, detak roda, roda berhenti, kumpulkan) dibuat oleh browser lewat Web Audio, tanpa file.
- Musik latar diputar berulang dari `audio/musik-latar.mp3`: komposisi orisinal berupa melodi dan petikan senar sintetis (G mayor, tempo 112, tanpa bas dan kendang), **bukan rekaman alat musik tradisional**. Cara mengganti dengan rekaman asli ada di `audio/README.md`.
- Panel Suara di kanan atas: musik aktif atau nonaktif, volume musik, efek suara aktif atau nonaktif, volume efek. Musik otomatis dikecilkan sebentar setiap efek suara berbunyi.

## Mengirim jawaban ke guru (opsional)

Tanpa pengaturan, jawaban dikumpulkan lewat tombol Unduh PDF. Agar jawaban otomatis masuk ke Google Sheet:

1. Ikuti petunjuk di `tools/google-apps-script.gs`.
2. Tempel URL aplikasi web ke `submitUrl` di `js/config.js`, lalu deploy ulang.

Browser tidak bisa membaca balasan Google Apps Script (mode `no-cors`), jadi pesan "sudah dikirim" berarti permintaan terkirim. Periksa sheet untuk memastikan baris baru masuk.

## Menjalankan

Situs statis tanpa proses build. Buka `index.html` lewat server lokal, misalnya:

```bash
python3 -m http.server 8000
```

## Deploy

Vercel: impor repositori, pilih Framework Preset "Other", kosongkan build command, output directory `.`.

Netlify: impor repositori, kosongkan build command, publish directory `.`.

KaTeX (rumus) sudah disertakan di `vendor/katex`, sehingga rumus tetap tampil walau CDN diblokir jaringan sekolah. Font Google (Fredoka, Nunito) butuh internet; tanpa internet browser memakai font cadangan.

# Stylist Studio – Palembang Heritage Edition

E-LKPD interaktif Matematika SMP kelas VIII: peluang teoretis, frekuensi relatif, dan frekuensi harapan, dengan tema busana adat perempuan Palembang.

## Isi

| Halaman | Isi |
| --- | --- |
| 1. Sampul | Judul, topik, karakter chibi yang berganti 6 pasangan busana tiap 1 detik, identitas kelompok |
| 2. Petunjuk | Petunjuk penggunaan, capaian pembelajaran, apersepsi (3 soal) |
| 3. Butik Digital | Aktivitas 1 (butik dengan manekin badan dan manekin kaki, tabel silang 3 × 2) dan Aktivitas 2 (peluang teoretis) |
| 4. Roda Spin | Aktivitas 3.1 sampai 3.4 (frekuensi harapan, roda spin 6 sektor, frekuensi relatif, perbandingan) |
| 5. Kumpulkan | Daftar semua jawaban dengan tombol Ubah, tombol Kumpulkan Jawaban, skor, cetak atau simpan PDF |

`referensi.html` berisi catatan guru: sumber setiap detail busana, bagian ilustrasi yang disederhanakan, dan catatan musik latar.

## Perilaku penting

- Setiap pasangan pakaian hanya bisa disimpan satu kali. Pasangan yang sama memunculkan notifikasi "Pasangan pakaian ini sudah kamu pilih!".
- Aktivitas 2 terbuka setelah keenam sel tabel terisi.
- Roda spin memakai `crypto.getRandomValues` dengan rejection sampling, sehingga peluang tiap sektor tepat 1/6.
- Total percobaan dikunci tepat 20. "Randomize 20 Kali" selalu mulai dari nol lalu memutar tepat 20 kali.
- "Reset Data" hanya menghapus data simulasi. Jawaban dan tabel Aktivitas 1 tetap tersimpan.
- Jawaban tidak pernah dikunci. Setiap aktivitas hanya menampilkan status "Terisi x dari y"; benar atau salah baru ditampilkan setelah siswa menekan Kumpulkan Jawaban.
- Jika siswa mengubah jawaban setelah mengumpulkan, halaman Kumpulkan meminta pengumpulan ulang. Nomor pengumpulan ikut tercatat.
- Jawaban tersimpan di `sessionStorage` selama tab browser terbuka, termasuk saat halaman dimuat ulang.

## Suara

- Efek suara (klik, pilih manekin, simpan berhasil, pasangan ganda, spin, detak roda, roda berhenti, kumpulkan) dibuat oleh browser lewat Web Audio, tanpa file.
- Musik latar diputar berulang dari `audio/musik-latar.mp3`. File ini **belum disertakan**; lihat `audio/README.md`.
- Panel Suara di kanan atas: musik aktif atau nonaktif, volume musik, efek suara aktif atau nonaktif, volume efek. Musik otomatis dikecilkan sebentar setiap efek suara berbunyi.

## Mengirim jawaban ke guru (opsional)

Tanpa pengaturan, jawaban dikumpulkan lewat tombol Cetak / Simpan PDF. Agar jawaban otomatis masuk ke Google Sheet:

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

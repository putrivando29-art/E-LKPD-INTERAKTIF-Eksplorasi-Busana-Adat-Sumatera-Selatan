# Stylist Studio – Palembang Heritage Edition

E-LKPD interaktif Matematika SMP kelas VIII: peluang teoretis, frekuensi relatif, dan frekuensi harapan, dengan tema busana adat perempuan Palembang.

## Isi

| Halaman | Isi |
| --- | --- |
| 1. Sampul | Judul, topik, karakter chibi yang berganti 6 pasangan busana tiap 1 detik, identitas kelompok |
| 2. Petunjuk | Petunjuk penggunaan, capaian pembelajaran, apersepsi (3 soal) |
| 3. Butik Digital | Aktivitas 1 (lemari butik, karakter, tabel silang 3 × 2) dan Aktivitas 2 (peluang teoretis) |
| 4. Roda Spin | Aktivitas 3.1 sampai 3.4 (frekuensi harapan, roda spin 6 sektor, frekuensi relatif, perbandingan) |
| 5. Rekap | Ringkasan jawaban kelompok, cetak atau simpan PDF |

`referensi.html` berisi catatan guru: sumber setiap detail busana dan bagian ilustrasi yang disederhanakan.

## Perilaku penting

- Setiap pasangan pakaian hanya bisa disimpan satu kali. Pasangan yang sama memunculkan notifikasi "Pasangan pakaian ini sudah kamu pilih!".
- Aktivitas 2 terbuka setelah keenam sel tabel terisi.
- Roda spin memakai `crypto.getRandomValues` dengan rejection sampling, sehingga peluang tiap sektor tepat 1/6.
- Total percobaan dikunci tepat 20. "Randomize 20 Kali" selalu mulai dari nol lalu memutar tepat 20 kali.
- "Reset Data" hanya menghapus data simulasi. Jawaban dan tabel Aktivitas 1 tetap tersimpan.
- Jawaban tersimpan di `sessionStorage` selama tab browser terbuka, termasuk saat halaman dimuat ulang.

## Menjalankan

Situs statis tanpa proses build. Buka `index.html` lewat server lokal, misalnya:

```bash
python3 -m http.server 8000
```

## Deploy

Vercel: impor repositori, pilih Framework Preset "Other", kosongkan build command, output directory `.`.

Netlify: impor repositori, kosongkan build command, publish directory `.`.

KaTeX (rumus) sudah disertakan di `vendor/katex`, sehingga rumus tetap tampil walau CDN diblokir jaringan sekolah. Font Google (Fredoka, Nunito) butuh internet; tanpa internet browser memakai font cadangan.

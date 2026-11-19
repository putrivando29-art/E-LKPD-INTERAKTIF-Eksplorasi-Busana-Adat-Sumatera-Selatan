# Butik Warisan Sriwijaya

Dokumen produk lengkap untuk E-LKPD (Lembar Kerja Peserta Didik Elektronik) interaktif Matematika SMP kelas VIII.

| | |
| --- | --- |
| Nama produk | Butik Warisan Sriwijaya |
| Jenis | E-LKPD interaktif berbasis web (situs statis) |
| Mata pelajaran | Matematika, Fase D, kelas VIII SMP/MTs |
| Materi | Peluang teoretis, frekuensi relatif, frekuensi harapan |
| Tema | Butik busana adat perempuan Palembang, Sumatera Selatan |
| Alokasi waktu | 2 JP (2 × 40 menit) |
| Pengguna | Siswa (perorangan); guru dan peneliti sebagai pengelola |
| Perangkat | Laptop dan HP (lebar layar 320 piksel ke atas) |
| Hosting | Vercel, Netlify, atau server statis apa pun; tanpa proses build |
| Bahasa | Indonesia |

---

## 1. Ringkasan

Siswa berperan sebagai penata busana di Butik Warisan Sriwijaya. Mereka memasangkan 3 atasan adat dengan 2 kain bawahan untuk menyusun ruang sampel (6 pasangan), lalu memilih **pasangan pakaian kesukaan** yang menjadi kejadian A. Siswa menghitung peluang teoretis, menghitung frekuensi harapan sebelum roda diputar, memutar roda 30 kali, menghitung frekuensi relatif, membandingkan hasilnya, lalu melihat hasil 300 putaran.

Soal hitungan memakai langkah **Diketahui, Ditanya, Jawab**, dengan tingkat kesulitan Mudah, Sedang, dan Sulit. Siswa menulis sendiri Diketahui, Ditanya, dan Jawab baris demi baris seperti jawaban uraian, memakai kotak rumus (MathLive) sehingga pecahan tampil bertumpuk, lalu menutup dengan kalimat "Jadi, ...". Ada juga pertanyaan alasan tertulis yang dinilai guru.

Siswa hanya bisa mengumpulkan **satu kali**. Pengumpulan pertama menjadi nilai akhir dan diingat oleh browser walaupun web ditutup. Sesudah itu siswa melihat tanda ✓/✗ dan petunjuk **Cara** untuk soal yang salah, lalu boleh berlatih memperbaiki jawaban tanpa mengubah nilai akhir. PDF yang diunduh selalu berisi pengumpulan pertama dan dikirim ke WhatsApp guru.

---

## 2. Tujuan dan landasan kurikulum

**Capaian Pembelajaran** (mengikuti E-LKPD versi sebelumnya, SK Kepala BSKAP Nomor 046/H/KR/2025):

> Murid dapat menjelaskan dan menggunakan pengertian peluang dan frekuensi relatif untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana (semua hasil percobaan dapat muncul secara merata).

**Tujuan Pembelajaran** (tampil di halaman Petunjuk bagian B). Peserta didik dapat:

1. menentukan ruang sampel percobaan sederhana dengan tabel;
2. menjelaskan pengertian peluang teoretis dan menggunakannya untuk menentukan frekuensi harapan suatu kejadian pada percobaan sederhana dengan tepat;
3. menjelaskan pengertian frekuensi relatif dan menggunakannya untuk memperkirakan frekuensi harapan, serta membandingkannya dengan peluang teoretis pada percobaan sederhana.

Kaitan TP dengan aktivitas: TP 1 lewat Aktivitas 1. TP 2 lewat Aktivitas 2 dan 3. TP 3 lewat Aktivitas 4 dan Kesimpulan. Bagian TP 3 "memperkirakan frekuensi harapan memakai frekuensi relatif" tidak dilatih secara eksplisit.

Rumusan CP dan TP perlu dicocokkan lagi dengan dokumen resmi SK sebelum instrumen divalidasi.

**Alur konsep di dalam E-LKPD** (selalu dimulai dari pasangan pakaian kesukaan siswa, lalu diperluas):

1. Pecahan dan perkalian sebagai prasyarat (apersepsi).
2. Ruang sampel dengan tabel silang, n(S) = 3 × 2 = 6, disertai alasan tertulis.
3. Pertanyaan pemantik: siswa memilih pasangan pakaian kesukaan, yang menjadi kejadian A.
4. Peluang teoretis: P(A) = 1/6 (Mudah), pasangan teman (Mudah, dengan alasan), pasangan bersongket 3/6 (Sedang), pasangan ber-Aesan Gede 2/6 (Sedang).
5. Frekuensi harapan sebelum roda diputar: 30 × 1/6 = 5 (Sedang) dan 60 × 3/6 = 30 (Sulit).
6. Percobaan roda 30 kali, lalu frekuensi relatif k/30.
7. Perbandingan banyak muncul nyata dengan frekuensi harapan, disertai alasan.
8. Putar cepat 300 kali: frekuensi relatif cenderung lebih dekat ke 1/6.
9. Kesimpulan dan refleksi.

---

## 2A. Kesesuaian materi dengan kurikulum

**Kesimpulan:** materi sesuai dengan CP Fase D. Fase D mencakup kelas VII sampai IX, sehingga penempatan per kelas ditentukan oleh ATP sekolah. [Kemungkinan Besar]

| Jenjang | Materi peluang | Keterangan |
| --- | --- | --- |
| Fase C (SD kelas V–VI) | Menentukan kejadian dengan kemungkinan lebih besar, secara kualitatif | Prasyarat |
| Fase D, kelas VIII | Buku siswa Kemendikbudristek Bab 6 Peluang: frekuensi relatif dari percobaan, cara menentukan peluang | Posisi E-LKPD ini |
| Fase D, kelas IX | Buku siswa Kemendikbudristek Bab 4 Peluang dan Pemilihan Sampel: peluang empiris, frekuensi harapan, sampel | Frekuensi harapan dibahas lebih dalam |
| Fase E (kelas X) | Frekuensi harapan kejadian majemuk, kejadian saling lepas dan saling bebas | Tidak dimasukkan |
| Fase F (kelas XI–XII) | Peluang bersyarat | Tidak dimasukkan |

Hasil pemeriksaan:

- **Cakupan sesuai:** satu kejadian sederhana dengan 6 hasil berpeluang sama. Tidak ada materi Fase E atau F.
- **Ruang sampel 3 × 2** hanya memakai perkalian dasar, sesuai kelas VIII.
- **Frekuensi harapan** tercantum di CP Fase D, tetapi di buku siswa resmi pembahasan utamanya ada di kelas IX. Mengajarkannya di kelas VIII sah jika ATP sekolah menempatkannya di kelas VIII; cantumkan ATP sekolah di laporan penelitian.
- **Urutan berbeda dari buku kelas VIII:** buku memulai dari percobaan, E-LKPD memulai dari peluang teoretis. Keduanya sah.
- **30 percobaan** cukup untuk menunjukkan bahwa hasil bisa berbeda dari teori, tetapi tidak cukup untuk membuktikan bahwa F_r mendekati P(A). Kesimpulan itu diberikan sebagai pengetahuan.

Rincian dan tautannya ada di halaman Informasi Media (`informasi-media.html`).

---

## 3. Alur halaman

Laptop dan tablet memakai 6 tab di bagian atas (label pendek di lebar 761–1050 px). Di HP (≤ 760 px) tab diganti satu baris navigasi: tombol ‹, daftar pilihan "3 dari 6 · Butik", dan tombol ›.

| Halaman | Isi |
| --- | --- |
| 1. Sampul | Judul, topik, karakter berganti busana, identitas peserta didik, pemberitahuan jika identitas itu sudah mengumpulkan, tautan "Mulai sebagai siswa baru" |
| 2. Petunjuk | Petunjuk (7 butir), alokasi waktu, CP dan 3 TP, apersepsi |
| 3. Butik | Aktivitas 1, Kenali Busananya, tabel, pertanyaan pemantik, Ayo Isi, pengertian peluang teoretis, Aktivitas 2 (2.1–2.4) |
| 4. Frekuensi Harapan | Pengertian frekuensi harapan, Aktivitas 3 (3.1–3.2) |
| 5. Roda Putar | Pengertian frekuensi relatif, Aktivitas 4 (4.1–4.5) |
| 6. Kumpulkan | Kesimpulan, refleksi, periksa semua jawaban, kumpulkan, unduh PDF |

Setiap kotak pengertian memakai susunan yang sama: definisi formal dengan kalimat sederhana, rumus, keterangan simbol tersusun ke bawah, lalu satu baris contoh.

### 3.1 Halaman 1: Sampul

- Teks: "Butik Warisan Sriwijaya", "Lembar Kerja Peserta Didik (E-LKPD Interaktif)", subjudul "Petualangan Matematika di Butik Warisan Sriwijaya", topik, tiga label konsep, dan "Matematika SMP Kelas VIII · 2 JP (2 × 40 menit)".
- Karakter chibi berganti busana **setiap 1 detik** melalui keenam pasangan (crossfade 0,35 detik). Animasi berhenti saat siswa pindah halaman atau tab browser disembunyikan.
- **Identitas Peserta Didik** (perorangan): nama lengkap, kelas/semester, nomor presensi.
- Jika identitas yang diketik sudah pernah mengumpulkan di perangkat itu, muncul kotak: "Nama ini sudah mengumpulkan pada [waktu]. Nilai akhirnya [skor]. Kamu boleh berlatih lagi, tetapi nilai akhir tidak berubah."
- **Mulai sebagai siswa baru:** untuk perangkat yang dipakai bergantian. Menghapus jawaban yang sedang terbuka, tetapi hasil yang sudah dikumpulkan tetap tersimpan.

### 3.2 Halaman 2: Petunjuk

- **A. Petunjuk penggunaan** (7 butir): berdoa; isi identitas; kerjakan sesuai urutan; tulis langkah dan alasan; periksa lalu kumpulkan; kamu hanya bisa mengumpulkan satu kali; unduh PDF lalu kirim ke WhatsApp guru. Alokasi waktu 2 JP (2 × 40 menit).
- **B. Capaian dan Tujuan Pembelajaran:** CP dengan sumber SK, lalu 3 TP.
- **C. Apersepsi:** sederhanakan 2/6; 60 × 1/6; 3 baju dan 2 kain, berapa pasangan.

### 3.3 Halaman 3: Butik

**Aktivitas 1: Menyusun Ruang Sampel.** Kotak lipat **Kenali Busananya** berisi penjelasan singkat AG, AP, BK, Songket (Sg), dan Jumputan (J).

Adegan butik: atap kain bergaris, dua lampu, dinding bergaris, lantai kayu. Kiri **Manekin Atasan** (3 manekin badan), tengah karakter di cermin dengan tombol **Simpan Pasangan Pakaian**, kanan **Manekin Bawahan** (2 manekin kaki). Di HP urutannya cermin, manekin atasan, manekin bawahan.

Tombol Simpan memunculkan notifikasi di tengah layar dengan ornamen silang emas: "Belum lengkap", "Pasangan pakaian tersimpan!", atau "Pasangan pakaian ini sudah kamu pilih!" (bingkai merah, layar bergetar, sel tabel berkedip, data lama tidak ditimpa).

Tabel silang 3 × 2. Keterangan kode: AG = Aesan Gede, AP = Aesan Paksangko, BK = Baju Kurung Palembang, **Sg = Songket**, J = Jumputan. Kode Songket diubah dari S menjadi Sg agar tidak tertukar dengan lambang ruang sampel S.

**Pertanyaan pemantik:** "Pasangan pakaian mana yang paling kamu suka?" Pasangan terpilih menjadi **kejadian A** dan namanya muncul otomatis di soal berikutnya.

**Ayo Isi:** n(S), n(A), dan "Jelaskan cara kamu menghitung banyak semua pasangan pakaian."

**Aktivitas 2: Menentukan Peluang Teoretis** (terbuka setelah keenam sel tabel terisi):

| Soal | Tingkat | Isi |
| --- | --- | --- |
| 2.1 | Mudah | Peluang pasangan kesukaanmu (kejadian A), langkah Diketahui/Ditanya/Jawab |
| 2.2 | Mudah | Peluang pasangan teman (diacak sekali, lalu tetap) dan "Apakah peluang pasangan temanmu sama dengan peluang pasanganmu? Jelaskan alasannya." |
| 2.3 | Sedang | Peluang kejadian B = pasangan bersongket, langkah Diketahui/Ditanya/Jawab |
| 2.4 | Sedang | Peluang kejadian C = pasangan ber-Aesan Gede, langkah Diketahui/Ditanya/Jawab |

**Format jawaban uraian** (soal 2.1, 2.3, 2.4, 3.1, 3.2, 4.2). Tidak ada pilihan; semua ditulis siswa:

- **Diketahui** (2 baris awal), **Ditanya** (1 baris), **Jawab** (3 baris awal). Tombol **+ Tambah baris** menambah baris sampai 8.
- Setiap baris adalah kotak rumus MathLive 0.109.2 (`vendor/mathlive`, lisensi MIT). Mengetik `1/6` langsung menjadi pecahan bertumpuk. Di HP muncul papan ketik khusus "Angka" berisi angka, a/b, ×, =, +, −, n( ), P( ), F_h, F_r, A, B, C, S, N, k, kurung, dan tab "abc" untuk huruf.
- Ditutup dengan kalimat **Jadi, ... [hasil akhir]**, misalnya "Jadi, peluang terpilihnya pasangan kesukaanmu adalah ▢."
- Di atas Aktivitas 2 ada kotak "Cara menulis di kotak jawaban". Kotak pengertian peluang teoretis memuat contoh penulisan jawaban lengkap (butik mini 2 × 2).

### 3.4 Halaman 4: Frekuensi Harapan

Aktivitas 3 dikerjakan **sebelum** roda diputar.

| Soal | Tingkat | Isi |
| --- | --- | --- |
| 3.1 | Sedang | Roda diputar 30 kali. Frekuensi harapan pasangan kesukaanmu. Jawaban uraian, ditutup "Jadi, pasangan kesukaanmu diharapkan muncul ▢ kali." |
| 3.2 | Sulit | Roda diputar 60 kali. Frekuensi harapan pasangan bersongket. Jawaban uraian |

### 3.5 Halaman 5: Roda Putar

**4.1 Putar Roda 30 Kali:** karakter berganti sesuai hasil terakhir, roda 6 sektor sama besar, tabel k real-time (pasangan kesukaan bertanda ★). Tombol Putar 1 Kali, Putar Acak 30 Kali, Atur Ulang Data.

Soal 4.2 sampai 4.5 terbuka setelah pasangan kesukaan dipilih dan roda diputar tepat 30 kali.

- **4.2 (Mudah):** frekuensi relatif pasangan kesukaan, jawaban uraian.
- **4.3:** tabel frekuensi relatif lima pasangan lain; baris ★ menampilkan jawaban 4.2.
- **4.4:** dua kartu (frekuensi harapan dari 3.1 dan banyak muncul nyata), pilihan lebih sering / sama dengan / lebih jarang, lalu "Mengapa hasil putaran roda tidak selalu sama dengan frekuensi harapan? Jelaskan."
- **4.5 Putar Lebih Banyak:** tombol **Putar Cepat 300 Kali** (hasil 30 putaran tidak berubah). Muncul diagram batang frekuensi relatif 30 putaran dan 300 putaran untuk keenam pasangan dengan garis 1/6, lalu soal "Hasil mana yang secara umum lebih dekat ke 1/6?"

### 3.6 Halaman 6: Kesimpulan dan Pengumpulan

- **Kesimpulan:** 3 soal pilihan ganda dan satu kotak kesimpulan dengan kalimat sendiri.
- **Refleksi** (tidak dinilai): apa yang dipelajari, bagian yang masih sulit, dan tingkat pemahaman (Sangat paham sampai Belum paham).
- **Periksa dan Kumpulkan:** kotak aturan "hanya bisa mengumpulkan satu kali", kartu identitas dengan gambar pasangan kesukaan, kartu per aktivitas (jawaban, tombol **Ubah**), kartu Jawaban Tertulis, lalu tombol **Kumpulkan Jawaban** dan **Unduh PDF**.

---

## 4. Busana adat dan ilustrasi

### 4.1 Pilihan busana

**Atasan** (setiap atasan membawa paket tata rambut, hiasan kepala, dan perhiasannya sendiri; tidak bisa dipilih terpisah):

| Kode | Atasan | Ciri pada ilustrasi |
| --- | --- | --- |
| AG | Aesan Gede | Dodot merah bertabur bintang emas, teratai penutup bahu berbentuk kelopak, kalung kebo munggah tiga susun, pending, selempang sawit, lengan terbuka dengan kecak bahu dan gelang. Kepala: kesuhun tinggi bermotif teratai dengan permata dan melati, gandik beludru merah berhias melati, bungo cempako, kembang goyang, kelapo standan. Rambut disisir licin. |
| AP | Aesan Paksangko | Baju kurung lengan panjang merah bata bertabur bintang emas, teratai penutup dada, kalung tapak jajo tiga susun, gelang. Kepala: mahkota paksangko di kening dengan motif lingkaran, bunga teratai, dan setangkai mawar, kembang goyang, kelapo standan, sanggul. |
| BK | Baju Kurung Palembang | Baju kurung longgar ungu tua/plum (#4E2A5A), polos, menutupi pinggul; lengan panjang mengecil di pergelangan; leher bulat dengan belahan kecil tanpa kerah; tiga kancing emas di depan; kalung emas besar berbentuk lempeng berukir yang menutupi dada atas; gelang emas di kedua pergelangan. Kepala: rambut disisir ke atas dan disanggul tinggi di puncak kepala tanpa poni, hiasan bunga emas di sisi kanan sanggul, anting emas menjuntai panjang. Tanpa selendang. |

**Bawahan:**

| Kode | Bawahan | Ciri pada ilustrasi |
| --- | --- | --- |
| Sg | Songket Palembang | Songket lepus: dasar maroon dengan benang emas rapat bermotif belah ketupat, tumpal (kepala kain) di depan, tepi bermotif pucuk rebung |
| J | Tenun Jumputan Palembang | Satu desain merah tua (#7E1C2A) untuk semua atasan, motif bintik tujuh (satu titik besar dikelilingi enam titik kecil dalam satu lingkaran) berwarna cream |

**Enam pasangan:** (AG, Sg), (AG, J), (AP, Sg), (AP, J), (BK, Sg), (BK, J).

### 4.2 Karakter

- Perempuan bergaya chibi: kepala besar, mata besar dengan kilau, pipi merona.
- Warna kulit **kuning langsat** (#F6D8B4, bayangan #E3B68C, rona pipi #F3A592).
- Busana dasar (sebelum memilih): blus cream lengan panjang, rok cokelat, rambut sebahu berponi.
- Manekin berwarna abu netral (#E3DED5) dengan wajah polos agar jelas berbeda dari karakter.
- Seluruh gambar berupa SVG yang dibuat dengan kode (`js/outfits.js`), sehingga tajam di semua ukuran layar dan tidak memerlukan file gambar.

### 4.3 Status keakuratan budaya

Rincian per detail beserta tautan sumbernya ada di halaman Informasi Media (`informasi-media.html`). Ringkasnya:

- **Ada di sumber:** komponen busana dan aksesori AG dan AP pada tabel 4.1; pada BK: bentuk baju kurung, lengan mengecil di pergelangan, dan tiga kancing sebagai tanda gadis (satu sumber, perlu dicek).
- **Disederhanakan:** bentuk kelapo standan dan kembang goyang, jumlah kelopak teratai, jumlah gelang, proporsi mahkota, dan motif songket (dibuat kisi belah ketupat, bukan motif bernama seperti Nago Besaung).
- **Pilihan desain, bukan klaim autentik:** warna plum BK, sanggul tinggi, anting, kalung lempeng, gelang BK (mengikuti foto referensi pengembang), warna merah bata Paksangko, warna kulit, sepatu, dan busana dasar.
- **Belum terverifikasi:** hiasan bunga emas BK disebut sebagai bunga cempaka dan bunga sundur emas oleh pengembang; sumbernya belum ditemukan dalam penelusuran.
- Sumber yang dipakai sebagian besar berupa artikel populer, situs pariwisata, dan beberapa jurnal. Antarsumber kadang berbeda istilah dan rincian. Untuk penelitian, ilustrasi perlu divalidasi oleh ahli budaya atau perias pengantin adat Palembang.

---

## 5. Kunci jawaban dan penilaian

Total **24 butir** yang dinilai otomatis. Skor = pembulatan (benar ÷ 24 × 100). Setiap butir punya petunjuk **Cara** yang ditampilkan jika jawabannya salah, tanpa menyebut angka jawaban akhir.

| Bagian | Butir | Kunci |
| --- | --- | --- |
| Apersepsi (3) | 2/6 disederhanakan; 60 × 1/6; 3 × 2 | 1/3 (harus paling sederhana); 10; 6 |
| Aktivitas 1 (3) | Tabel; n(S); n(A) | 6 dari 6 pasangan; 6; 1 |
| Aktivitas 2 (4) | Jadi 2.1; 2.2; Jadi 2.3; Jadi 2.4 | 1/6; 1/6; 3/6; 2/6 (pecahan senilai dan desimal tepat diterima) |
| Aktivitas 3 (2) | Jadi 3.1; Jadi 3.2 | 5; 30 |
| Aktivitas 4 (2) | 30 putaran; Jadi 4.2 | 30 dari 30; k/30 sesuai data siswa |
| 4.3 (5) | F_r lima pasangan lain | k/30 sesuai data siswa |
| 4.4 (1) | Dibanding yang diharapkan | lebih sering jika k > 5, sama dengan jika k = 5, lebih jarang jika k < 5 |
| 4.5 (1) | Lebih dekat ke 1/6 | Dihitung dari data siswa: hasil dengan rata-rata selisih \|F_r − 1/6\| lebih kecil |
| Kesimpulan (3) | Soal 1; 2; 3 | "Ya" hanya jika keenam k = 5, selain itu "Tidak"; hasil acak dan 30 putaran masih sedikit; cenderung makin dekat ke 1/6 |

Kotak "Jadi" dibaca dari bagian sesudah tanda = terakhir, sehingga `P(A)=\frac{1}{6}` dan `\frac16` sama-sama diterima.

**Dinilai guru dari PDF:** Diketahui, Ditanya, dan Jawab pada keenam soal uraian (di PDF ditandai "Dinilai guru", pecahan ditulis a/b), serta empat jawaban tertulis (cara menghitung n(S), alasan 2.2, alasan 4.4, kesimpulan dengan kalimat sendiri). **Tidak dinilai:** refleksi dan pasangan kesukaan.

---

## 6. Keadilan roda putar

- Pemilihan hasil memakai `crypto.getRandomValues` dengan *rejection sampling*: nilai acak 0–255 yang ≥ 252 dibuang, lalu sisanya dibagi 6. Hasilnya setiap pasangan berpeluang tepat 1/6.
- Hasil ditentukan lebih dulu, baru roda diputar ke sektor itu (ditambah geseran acak ±20° di dalam sektor agar tidak selalu berhenti di tengah).
- Total percobaan dikunci tepat 30: Putar 1 Kali nonaktif di 30, dan Putar Acak 30 Kali selalu mulai dari 0 lalu berhenti tepat di 30.
- Tidak ada data contoh. Semua angka di tabel berasal dari putaran siswa.

---

## 7. Sistem jawaban dan pengumpulan

| Kondisi | Perilaku |
| --- | --- |
| Saat mengerjakan | Jawaban bisa diubah. Tiap bagian hanya menampilkan "Terisi x dari y". Benar atau salah belum ditampilkan. |
| Tekan Kumpulkan Jawaban (pertama kali) | Identitas wajib lengkap. Muncul konfirmasi "Kamu hanya bisa mengumpulkan satu kali" beserta daftar bagian yang masih kosong, dengan tombol "Periksa Dulu" atau "Kumpulkan Sekarang". |
| Setelah dikumpulkan | Nilai akhir, jumlah benar, dan waktu tampil. Setiap butir diberi ✓ atau ✗; butir ✗ diberi petunjuk **Cara**. Hasil dikunci untuk identitas itu (nama + kelas + nomor presensi). |
| Latihan sesudahnya | Siswa boleh memperbaiki jawaban. Tombol berubah menjadi **Periksa Jawaban Latihan**: tanda ✓/✗ diperbarui dan tampil "Hasil latihan terakhir: X. Nilai akhirmu tetap Y." Nilai akhir tidak pernah berubah. |
| Web ditutup lalu dibuka lagi | Kunci tetap ada. Mengetik identitas yang sama memunculkan pemberitahuan bahwa nama itu sudah mengumpulkan. |
| Unduh PDF | Nonaktif sebelum pengumpulan pertama. Setelah itu **selalu berisi pengumpulan pertama**. |

**Unduh PDF:** dibuat di browser dengan jsPDF dan jspdf-autotable (`vendor/jspdf`, MIT, dimuat saat tombol pertama kali ditekan), langsung terunduh tanpa dialog cetak. Nama file `Hasil-ELKPD-<nama siswa>.pdf`, ukuran sekitar 100 KB. Isi: judul "Hasil Pengumpulan Pertama", waktu kumpul, identitas, pasangan kesukaan dan pasangan teman, kotak nilai akhir, **gambar pasangan kesukaan**, tabel per aktivitas (Soal, Jawaban, Benar/Salah), jawaban tertulis, data roda (30 dan 300 putaran), refleksi, baris Paraf Guru, dan pesan "Kirim file PDF ini ke WhatsApp gurumu."

**Google Sheet (opsional):** jika `submitUrl` diisi, hanya pengumpulan pertama dari setiap perangkat yang dikirim. Kolom "Kiriman ke-" dihitung oleh Apps Script dari nama, kelas, dan nomor presensi; nilai 2 ke atas (baris berwarna merah muda) menandakan siswa mengumpulkan lagi dari perangkat, browser, atau mode penyamaran lain. Pakai baris "Kiriman ke-" = 1.

---

## 8. Penyimpanan data

| Data | Tempat | Masa simpan |
| --- | --- | --- |
| Jawaban yang sedang dikerjakan, pasangan kesukaan dan teman, tabel, data roda, hasil latihan, halaman terakhir | `localStorage`, kunci `butik-warisan-sriwijaya-v2:draft` | Permanen di browser itu sampai "Mulai sebagai siswa baru" atau data browser dihapus |
| Pengumpulan pertama per identitas | `localStorage`, kunci `butik-warisan-sriwijaya-v2:locks` | Permanen di browser itu; tidak pernah ditimpa oleh website |
| Pengaturan suara | `localStorage`, kunci `stylist-studio-audio` | Permanen di perangkat itu |
| Hasil pengumpulan | Google Sheet milik guru | Permanen, jika `submitUrl` diisi |

**Keterbatasan kunci:** kunci disimpan di browser, bukan di server. Siswa masih bisa mengumpulkan ulang dengan mengganti perangkat, browser, mode penyamaran, menghapus data browser, atau mengubah ejaan nama. Pengamannya: (1) PDF pertama yang dikirim ke WhatsApp guru mencantumkan waktu kumpul, (2) kolom "Kiriman ke-" di Google Sheet. Kunci yang benar-benar tidak bisa diakali membutuhkan login dan server.

---

## 9. Suara

**Efek suara** (dibuat browser lewat Web Audio API, tanpa file, tanpa masalah lisensi):

| Kejadian | Bunyi |
| --- | --- |
| Klik tombol, tab, tautan, pilihan ganda | Klik pendek |
| Klik manekin | Dua nada naik |
| Simpan pasangan berhasil | Arpeggio empat nada |
| Pasangan ganda atau belum memilih | Dua nada turun |
| Mulai putaran roda | Desis berputar |
| Roda melewati batas sektor | Detak kecil |
| Roda berhenti | Denting lonceng |
| Kumpulkan jawaban | Fanfare pendek |

**Musik latar:**

- File `audio/musik-latar.mp3` (sekitar 51 detik, 96 kbps, sekitar 600 KB) diputar berulang.
- Isinya komposisi orisinal: melodi dan petikan senar sintetis dalam G mayor, tempo 112, ritme sedikit berayun, tanpa bas dan kendang. Bagian akhir lebih tenang agar tidak monoton.
- **Bukan rekaman alat musik tradisional dan bukan lagu Batanghari Sembilan.** Jangan disebut musik tradisional dalam laporan penelitian.
- Dibuat ulang dengan `python3 tools/buat-musik-latar.py` (butuh numpy dan ffmpeg). Bisa diganti rekaman asli berizin dengan menimpa file yang sama (lihat `audio/README.md`).
- Instrumen yang disebut sumber sebagai bagian musik tradisional Sumatera Selatan: gitar tunggal Batanghari Sembilan, getak-getuk, redap, kenung, serdam, ginggung, carak, burdah, kenong basemah. Akordeon disebut sebagai pengiring yang masuk pada masa penjajahan Barat.

**Panel Suara** (tombol "Suara" di kanan atas): musik aktif/nonaktif, volume musik (awal 25%), efek suara aktif/nonaktif, volume efek (awal 60%).

**Aturan pemutaran:**

- Musik baru berbunyi setelah interaksi pertama, karena browser melarang suara otomatis.
- Musik berhenti saat tab disembunyikan.
- Musik dikecilkan menjadi 35% selama 0,45 detik setiap efek suara berbunyi (kecuali detak roda), supaya tidak bertumpuk.
- Jika file musik tidak ada, tombol musik nonaktif dan tampil "Musik latar belum tersedia".

---

## 10. Desain visual

**Warna utama** (semua warna padat, tanpa transparansi):

| Token | Warna | Pemakaian |
| --- | --- | --- |
| `--bg` | #FFF4E2 | Latar halaman (cream) |
| `--card` | #FFFBF3 | Kartu (ivory) |
| `--ink` | #3A2318 | Teks utama |
| `--ink-soft` | #6A4A3A | Teks sekunder |
| `--maroon` | #7A1F2B | Header, tombol utama, judul |
| `--maroon-dk` | #5E1520 | Hover, tab |
| `--bata` | #B5482F | Aksen merah bata |
| `--brown` | #6B3E26 | Panggung, kayu |
| `--gold` | #D9A82E | Bingkai, tombol sekunder, ornamen |
| `--gold-lt` | #F6E2A8 | Sorotan |
| `--ok` / `--bad` | #2F6B3A / #A3271B | Benar / salah |

**Huruf:** Fredoka untuk judul dan tombol, Nunito untuk teks, keduanya dari Google Fonts. Ukuran dasar 17 px di laptop dan 16 px di HP.

**Ornamen:** garis segitiga pucuk rebung (motif tepi songket) di bawah header, di atas sampul, dan di panggung manekin. Ornamen dibatasi agar tampilan tetap bersih.

**Rumus:** KaTeX 0.16.9 disertakan di dalam proyek (`vendor/katex`), sehingga rumus tetap tampil walau jaringan sekolah memblokir CDN.

**Responsif:**

- Di atas 1100 px, butik 3 kolom.
- Antara 760 dan 1100 px, butik 2 kolom.
- Di bawah 760 px, satu kolom dengan susunan khusus HP.
- Header muat satu baris mulai lebar 850 px; di lebar 761–1280 px tombol Suara hanya berupa ikon. Di HP tab diganti navigasi ‹ daftar halaman ›.
- Diuji tanpa geser horizontal di lebar 320, 360, 390, 412, 761–1100, 1280, dan 1366 piksel.

**Aksesibilitas:** tombol berukuran sentuh minimal sekitar 40–46 px, garis fokus terlihat untuk keyboard, `aria-pressed` pada manekin, `aria-live` pada hasil putaran, modal bisa ditutup dengan Escape, dan animasi dipercepat untuk pengguna yang mengaktifkan mode kurangi gerakan.

---

## 11. Arsitektur teknis

Situs statis HTML, CSS, dan JavaScript murni, tanpa framework dan tanpa proses build.

```
index.html                 Struktur 6 halaman, modal, notifikasi, panel suara
informasi-media.html       Informasi Media: kesesuaian kurikulum, sumber busana, status detail, musik
product.md                 Dokumen ini
README.md                  Ringkasan teknis dan cara deploy
css/style.css              Seluruh gaya, termasuk responsif
js/config.js               Pengaturan guru: submitUrl, musicSrc
js/outfits.js              Gambar SVG karakter, busana, manekin, kain
js/audio.js                Efek suara Web Audio dan pemutar musik
js/app.js                  Navigasi, butik, tabel, roda, penilaian, kunci pengumpulan, umpan balik, unduh PDF
audio/musik-latar.mp3      Musik latar
audio/README.md            Keterangan dan syarat musik pengganti
tools/buat-musik-latar.py  Pembuat musik latar
tools/google-apps-script.gs Penerima hasil di Google Sheet, dengan kolom Kiriman ke-
vendor/katex/              KaTeX 0.16.9 (lisensi MIT)
vendor/jspdf/              jsPDF 2.5.1 dan jspdf-autotable 3.8.2 (lisensi MIT)
vendor/mathlive/           MathLive 0.109.2, kotak rumus dan papan ketik (lisensi MIT)
```

**Urutan pemuatan skrip:** KaTeX, MathLive, `config.js`, `outfits.js`, `audio.js`, `app.js` (semuanya `defer`).

**Modul utama:**

- `Outfits.character(top, bottom, opts)`: SVG karakter. `top` ∈ {AG, AP, BK, null}, `bottom` ∈ {S, J, null} (kunci internal S tetap, kode tampilan `Sg`), `opts.view = 'bust'` untuk potongan setengah badan.
- `Outfits.mannequinTop(top)` dan `Outfits.mannequinBottom(bottom)`: SVG manekin.
- `Outfits.combos()`: daftar 6 pasangan.
- `Sfx.play(nama)`: efek suara (`click`, `select`, `success`, `error`, `spin`, `tick`, `stop`, `submit`).
- `app.js`: `state` disimpan ke `localStorage` setiap ada perubahan; `locks` menyimpan pengumpulan pertama per identitas. `GROUPS` berisi definisi butir (24 dinilai otomatis, langkah uraian bertanda `graded: false`) (label, kunci isian, tampilan, aturan benar, petunjuk Cara). `WRITTEN` dan `REFLECT` berisi isian tertulis.

---

## 12. Pengaturan dan deploy

**Pengaturan guru** (`js/config.js`):

```js
window.ELKPD_CONFIG = {
  submitUrl: '',                       // URL Web App Google Apps Script, kosongkan jika tidak dipakai
  musicSrc: 'audio/musik-latar.mp3'    // lokasi file musik latar
};
```

**Mengaktifkan Google Sheet:**

1. Buat Google Sheet, buka Ekstensi, lalu Apps Script.
2. Tempel isi `tools/google-apps-script.gs`, lalu simpan.
3. Terapkan sebagai Aplikasi web: jalankan sebagai "Saya", akses "Siapa saja".
4. Salin URL berakhiran `/exec` ke `submitUrl`, lalu deploy ulang situs.

Browser tidak bisa membaca balasan Apps Script (mode `no-cors`), jadi pesan "sudah dikirim" hanya berarti permintaan terkirim. Periksa sheet untuk memastikan barisnya masuk.

**Deploy:**

- Vercel: impor repositori, Framework Preset "Other", kosongkan build command, output directory `.`.
- Netlify: impor repositori, kosongkan build command, publish directory `.`.
- Vercel hanya memperbarui situs utama dari branch utama. Branch lain hanya mendapat link pratinjau.

**Menjalankan lokal:** `python3 -m http.server 8000`, lalu buka `http://localhost:8000`.

**Kebutuhan internet:** Google Fonts butuh internet. Tanpa internet, browser memakai font cadangan. Fitur lain berjalan tanpa internet setelah halaman termuat.

---

## 13. Pengujian yang sudah dilakukan

Uji otomatis di Chromium headless (Playwright), versi 12 dan 13, di HP 360 px dan laptop 1280 px:

- Enam pasangan tersimpan; kode sel tampil "AG, Sg".
- Versi 13: semua kotak Jawab kosong sebelum diisi; isian benar kecuali satu rumus salah (2.4) dan satu langkah masukkan angka salah (3.2) menghasilkan 96 (52 dari 54) dengan dua petunjuk Cara yang sesuai.
- Soal 4.2–4.5 terkunci sampai 30 putaran; Putar Cepat 300 Kali menampilkan diagram 6 baris dan soal 4.5.
- Pengumpulan pertama dengan 3 jawaban salah sengaja: nilai 92 (36 dari 39), 3 petunjuk Cara tampil.
- Memperbaiki satu jawaban lalu Periksa Jawaban Latihan: hasil latihan 95, nilai akhir tetap 92, jawaban di kunci tetap jawaban lama.
- Tab ditutup lalu web dibuka lagi: tombol tetap Periksa Jawaban Latihan dan PDF tetap aktif.
- PDF terunduh (sekitar 97 KB) berisi gambar pasangan kesukaan, nilai, dan tabel per aktivitas.
- Mulai sebagai siswa baru mengosongkan jawaban, kunci tetap ada; mengetik identitas yang sama (beda huruf besar dan spasi) memunculkan pemberitahuan sudah mengumpulkan.
- Tidak ada geser horizontal di lebar 320, 360, 768, 1024, 1280 px dan tidak ada error JavaScript.

Belum diuji: HP fisik, Safari iOS, dan pengiriman ke Google Sheet sungguhan.

---

## 14. Keterbatasan dan risiko

| Risiko | Dampak | Penanganan |
| --- | --- | --- |
| Detail busana belum divalidasi ahli | Validitas isi instrumen penelitian dipertanyakan | Validasi ahli budaya; lihat Informasi Media |
| Musik bukan rekaman tradisional | Klaim "musik tradisional" tidak sah | Sebut sebagai musik latar orisinal, atau ganti dengan rekaman berizin |
| Kunci pengumpulan hanya di browser | Siswa bisa mengumpulkan lagi dari perangkat atau browser lain | Pakai PDF pertama di WhatsApp dan kolom Kiriman ke- di Google Sheet |
| Kunci jawaban bisa dibaca di kode sumber | Siswa yang paham kode bisa melihat kunci | Wajar untuk LKPD formatif; untuk tes sumatif butuh server |
| CP mengutip PDF lama | Bisa berbeda dengan teks resmi | Cocokkan dengan SK BSKAP 046/H/KR/2025 |
| Frekuensi harapan di buku resmi dibahas di kelas IX | Penguji bisa mempertanyakan penempatan di kelas VIII | Lampirkan ATP sekolah yang menempatkannya di kelas VIII |
| Detail BK (sanggul, anting, kalung, hiasan bunga) mengikuti foto, bukan sumber tertulis | Klaim keaslian lemah | Sebut sebagai pilihan desain; validasi ahli |

---

## 15. Riwayat perubahan

| Versi | Perubahan |
| --- | --- |
| 1 | E-LKPD dibangun: karakter chibi SVG, 3 atasan dan 2 bawahan, tabel silang tanpa duplikat, roda adil 20 kali, KaTeX lokal, halaman referensi |
| 2 | Jumputan satu warna merah tua; butik bermanekin seperti PDF lama; cek per aktivitas diganti status terisi; halaman Periksa dan Kumpulkan dengan skor; pengiriman Google Sheet; efek suara dan pemutar musik; CP dan apersepsi mengikuti PDF lama |
| 3 | Musik latar ditambahkan; hasil cetak dikunci pada pengumpulan pertama |
| 4 | Musik dibuat ceria (G mayor, tempo 112); bas, genjrengan, dan kendang dihapus, melodi dipertahankan |
| 5 | Kulit kuning langsat; tampilan HP dirapikan (tab, rumus, roda spin, butik, rekap) |
| 6 | BH diganti Baju Kurung Palembang (BK); tema menjadi Sriwijaya Heritage; catatan guru menjadi Informasi Media dengan analisis kesesuaian kurikulum; TP ditampilkan; pertanyaan pemantik kejadian A; pengertian konsep sebelum aktivitas; bagian 3.4 perbandingan; keterangan rumus tersusun ke bawah; notifikasi di tengah dengan ornamen silang dan layar bergetar |
| 7 | Bagian 3.4 disederhanakan menjadi langkah bertahap dengan dua kartu sebelum/sesudah roda diputar |
| 8 | Langkah 3 di 3.4 diganti frekuensi harapan 60 putaran |
| 9 | Langkah 3 di 3.4 dihapus; isian frekuensi harapan dan frekuensi relatif memakai kotak pecahan karena keyboard angka HP tidak punya tanda / |
| 10 | Cetak / Simpan PDF diganti Unduh PDF dengan jsPDF, tanpa dialog cetak di HP |
| 11 | Istilah "set" menjadi "pasangan pakaian"; Roda Spin menjadi Roda Putar (Putar 1 Kali, Putar Acak 30 Kali, Atur Ulang Data); Aktivitas 2 langsung dua soal dengan pasangan teman acak-tetap; percobaan 30 kali (F_r = k/30, F_h = 5, opsi "sama dengan"); halaman dipecah menjadi 6; definisi formal dengan kalimat sederhana; identitas perorangan; 23 butir |
| 12 | Revisi validator: nama menjadi Butik Warisan Sriwijaya; langkah Diketahui/Ditanya/Jawab; soal Mudah/Sedang/Sulit (2.3, 2.4, 3.2); kotak Tulis alasanmu; frekuensi harapan sebelum roda diputar; 4.5 Putar Cepat 300 Kali; refleksi; TP ruang sampel; alokasi 2 JP; Kenali Busananya; kode Songket menjadi Sg; pengumpulan hanya satu kali dan diingat browser; umpan balik ✓/✗ dan Cara; mode latihan; PDF dengan gambar pasangan kesukaan untuk WhatsApp; kolom Kiriman ke- di Google Sheet; navigasi HP; 39 butir |
| 13 | Bagian Jawab tidak lagi terisi otomatis; Jawab menjadi tiga langkah (pilih rumus, masukkan angka, hasil); 2.4 memakai Diketahui/Ditanya/Jawab; kalimat "Tulis alasanmu" diganti pertanyaan langsung; Apps Script punya doGet untuk cek aktif; 54 butir |
| 14 | Pilihan rumus dan pilihan Ditanya dihapus; soal 2.1, 2.3, 2.4, 3.1, 3.2, 4.2 menjadi jawaban uraian yang ditulis siswa baris demi baris di kotak rumus MathLive dengan papan ketik pecahan; kalimat Jadi dinilai otomatis, langkah dinilai guru; contoh penulisan jawaban; 24 butir otomatis |
---

## 16. Sumber

**Busana adat**

- [Wikipedia: Aesan gede](https://id.wikipedia.org/wiki/Aesan_gede)
- [Indonesia.travel: Aesan Gede](https://www.indonesia.travel/us/en/travel-ideas/culture/aesan-gede)
- [Jurnal Trisakti: Busana Pengantin Aesan Gede](https://e-journal.trisakti.ac.id/index.php/jsrr/article/download/6735/5079)
- [Detik Sumbagsel: Aesan Gede, benang emas dan terate](https://www.detik.com/sumbagsel/budaya/d-7331229/aesan-gede-zaman-sriwijaya-tentang-benang-emas-dan-terate)
- [Kompas.com Skola: Aesan Gede](https://www.kompas.com/skola/read/2021/02/17/161500469/aesan-gede-pakaian-tradisional-sumatera-selatan?page=all)
- [Wikipedia: Paksangko](https://id.wikipedia.org/wiki/Paksangko)
- [Budaya Indonesia: Aesan Paksangko](https://versilama.budaya-indonesia.org/aesan-paksangko)
- [Popbela: Baju adat Palembang](https://www.popbela.com/fashion/style-trends/baju-adat-palembang-00-m97rq-83k7h5)
- [Wedding Market: Atribut baju pengantin adat Palembang](https://weddingmarket.com/artikel/makna-baju-pengantin-adat-palembang)
- [Traveloka: Pakaian adat Palembang](https://www.traveloka.com/id-id/explore/destination/pakaian-adat-palembang-aesan-gede-songket/1005999)
- [Kabar Sumatra: Sulam angkinan](https://www.kabarsumatra.com/2026/06/19/mengenal-lebih-dekat-kain-sulam-angkinan-kerajinan-khas-palembang-dengan-benang-emas/)
- [Roots.gov.sg: Baju kurung dari Palembang](https://www.roots.gov.sg/Collection-Landing/listing/1039963)

**Baju Kurung Palembang**

- [Detik Edu: Baju adat Palembang, jenis, makna, dan simbolnya](https://www.detik.com/edu/detikpedia/d-6670077/baju-adat-palembang-jenis-makna-dan-simbolnya)

**Kesesuaian kurikulum**

- [Penelitian.id: daftar isi Buku Siswa Matematika Kelas VIII](https://www.penelitian.id/2023/09/buku-siswa-matematika-kelas-viii.html)
- [Kherysuryawan.id: sub-bab Bab 6 Peluang kelas VIII](https://www.kherysuryawan.id/2022/08/materi-matematika-kelas-8-semester-1.html)
- [Kompas.com Skola: frekuensi relatif tutup botol, Bab VI kelas VIII](https://www.kompas.com/skola/read/2022/12/23/160000969/soal-dan-jawaban-kemungkinan-kejadian)
- [Portal Edukasi: Matematika kelas IX Bab 4](https://portaledukasi.org/2024/07/01/matematika-kelas-9-bab-4-kurikulum-merdeka/)
- [Defantri.com: CP Matematika Fase D](https://www.defantri.com/2022/05/capaian-pembelajaran-matematika-smp-fase-d.html)
- [CP Matematika sesuai Keputusan Kepala BSKAP 2025](https://www.mtssmusliminbjp.sch.id/2025/08/cp-matematika-tahun-2025.html)
- [Kurikulummerdeka.com: CP Matematika Fase E dan F](https://kurikulummerdeka.com/capaian-pembelajaran-cp-matematika-sma-fase-e-dan-f-kurikulum-merdeka-2024/)

**Kain**

- [Serupa (UNP): Songket Tradisional Palembang](https://ejournal.unp.ac.id/index.php/serupa/article/view/5528)
- [Wikipedia: Songket Palembang](https://id.wikipedia.org/wiki/Songket_Palembang)
- [ANTARA Sumsel: Jenis dan motif songket Palembang](https://sumsel.antaranews.com/berita/789305/kain-songket-palembang-beragam-jenis-dan-motifnya)
- [Repositori Unsri: Motif kain jumputan Palembang](https://repository.unsri.ac.id/83382/)
- [Digilib Unimed: Kajian Jumputan Pelangi Palembang](https://digilib.unimed.ac.id/id/eprint/1241/1/Full%20Text%2C%20Cover.pdf)
- [Kompasiana: Bintik tujuh](https://www.kompasiana.com/ellysuryani/5bb2d6ebaeebe160a27f67e4/titik-tujuh-motif-khas-batik-jumputan-palembang)

**Musik**

- [Detik Sumbagsel: 10 alat musik tradisional Sumatera Selatan](https://www.detik.com/sumbagsel/budaya/d-6741672/10-contoh-alat-musik-tradisional-sumatera-selatan-tahu-burdah)
- [BPS Sumatera Selatan: Gitar tunggal](https://sumsel.bps.go.id/en/news/2023/04/11/183/gitar-tunggal--tembang-dari-alam.html)
- [Detik Sumbagsel: Warisan tak benda asal Sumsel](https://www.detik.com/sumbagsel/budaya/d-7045627/3-warisan-tak-benda-asal-sumsel-dari-pertunjukan-teater-hingga-keagamaan)

Catatan: saat penyusunan, sumber di atas dibaca lewat cuplikan hasil pencarian karena jaringan pengembangan memblokir pembukaan halaman langsung. Setiap tautan perlu dibuka dan dicocokkan sendiri sebelum dikutip dalam laporan penelitian.

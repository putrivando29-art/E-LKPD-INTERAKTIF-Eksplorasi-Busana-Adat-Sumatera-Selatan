# Stylist Studio – Sriwijaya Heritage Edition

Dokumen produk lengkap untuk E-LKPD (Lembar Kerja Peserta Didik Elektronik) interaktif Matematika SMP kelas VIII.

| | |
| --- | --- |
| Nama produk | Stylist Studio – Sriwijaya Heritage Edition |
| Jenis | E-LKPD interaktif berbasis web (situs statis) |
| Mata pelajaran | Matematika, Fase D, kelas VIII SMP/MTs |
| Materi | Peluang teoretis, frekuensi relatif, frekuensi harapan |
| Tema | Butik digital busana adat perempuan Palembang, Sumatera Selatan |
| Pengguna | Siswa (berkelompok); guru dan peneliti sebagai pengelola |
| Perangkat | Laptop dan HP (lebar layar 320 piksel ke atas) |
| Hosting | Vercel, Netlify, atau server statis apa pun; tanpa proses build |
| Bahasa | Indonesia |

---

## 1. Ringkasan

Siswa berperan sebagai penata busana di butik digital. Mereka memasangkan 3 atasan adat dengan 2 kain bawahan untuk menyusun ruang sampel (6 pasangan), lalu memilih **set kesukaan** yang menjadi kejadian A. Dari set kesukaan itu siswa menghitung peluang teoretis dan frekuensi harapan, melakukan percobaan acak dengan roda spin sebanyak 20 kali, menghitung frekuensi relatif, lalu membandingkan frekuensi harapan dengan frekuensi relatif.

Semua jawaban bisa diubah sampai siswa menekan **Kumpulkan Jawaban**. Setelah itu skor tampil, dan hasil cetak atau PDF selalu memakai pengumpulan pertama.

---

## 2. Tujuan dan landasan kurikulum

**Capaian Pembelajaran** (mengikuti E-LKPD versi sebelumnya, SK Kepala BSKAP Nomor 046/H/KR/2025):

> Murid dapat menjelaskan dan menggunakan pengertian peluang dan frekuensi relatif untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana (semua hasil percobaan dapat muncul secara merata).

**Tujuan Pembelajaran** (dari E-LKPD versi sebelumnya, tanpa kode dan alokasi JP; tampil di halaman Petunjuk bagian B). Peserta didik dapat:

1. menjelaskan pengertian peluang teoretis dan menggunakannya untuk menentukan frekuensi harapan suatu kejadian pada percobaan sederhana dengan tepat;
2. menjelaskan pengertian frekuensi relatif dan menggunakannya untuk memperkirakan frekuensi harapan, serta membandingkannya dengan peluang teoretis pada percobaan sederhana.

Kaitan TP dengan aktivitas: TP 1 dicapai lewat Aktivitas 1, 2, dan 3.1. TP 2 dicapai lewat Aktivitas 3.2 sampai 3.5, termasuk perkiraan 60 putaran memakai frekuensi relatif.

Rumusan CP dan TP perlu dicocokkan lagi dengan dokumen resmi SK sebelum instrumen divalidasi.

**Alur konsep di dalam E-LKPD** (selalu dimulai dari set kesukaan siswa, lalu diperluas ke semua set):

1. Pecahan dan perkalian sebagai prasyarat (apersepsi).
2. Ruang sampel dengan tabel silang, n(S) = 3 × 2 = 6.
3. Pertanyaan pemantik: siswa memilih set kesukaan, yang menjadi kejadian A.
4. Pengertian peluang teoretis (contoh butik mini), lalu P(A) set kesukaan = 1/6, lalu peluang set kesukaan teman.
5. Pengertian frekuensi harapan dan frekuensi relatif dengan contoh set kesukaan.
6. Frekuensi harapan set kesukaan F_h = 20 × 1/6 = 10/3 ≈ 3,33.
7. Percobaan acak 20 kali, frekuensi relatif F_r = k / N, mulai dari set kesukaan lalu semua set.
8. Perbandingan bertahap untuk set kesukaan: banyak muncul nyata, dibanding frekuensi harapan, lalu perkiraan 60 putaran dari hasil percobaan.
9. Kesimpulan: F_r bisa berbeda dari P(A) dan cenderung mendekatinya jika percobaan diperbanyak.

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
- **20 percobaan** cukup untuk menunjukkan bahwa hasil bisa berbeda dari teori, tetapi tidak cukup untuk membuktikan bahwa F_r mendekati P(A). Kesimpulan itu diberikan sebagai pengetahuan.

Rincian dan tautannya ada di halaman Informasi Media (`informasi-media.html`).

---

## 3. Alur halaman

Navigasi berupa 5 tab di bagian atas. Di laptop labelnya panjang, di HP labelnya pendek dan kelima tab muat dalam satu baris.

| Tab | Label HP | Isi |
| --- | --- | --- |
| 1. Sampul | Sampul | Judul, topik, karakter berganti busana, identitas kelompok |
| 2. Petunjuk | Petunjuk | Petunjuk, capaian dan tujuan pembelajaran, apersepsi |
| 3. Butik Digital | Butik | Aktivitas 1, pertanyaan pemantik, pengertian peluang teoretis, Aktivitas 2 |
| 4. Roda Spin | Spin | Pengertian frekuensi harapan dan relatif, Aktivitas 3.1 sampai 3.5 |
| 5. Kumpulkan | Kumpul | Periksa semua jawaban, kumpulkan, skor, cetak |

### 3.1 Halaman 1: Sampul

- Teks: "Stylist Studio · Sriwijaya Heritage Edition", "Lembar Kerja Peserta Didik (E-LKPD Interaktif)", subjudul "Petualangan Matematika di Butik Digital Stylist Studio", baris topik, dan tiga label: Peluang Teoretis, Frekuensi Relatif, Frekuensi Harapan.
- Karakter chibi di tengah berganti busana **setiap 1 detik** melalui keenam pasangan, dengan efek memudar (crossfade 0,35 detik). Nama pasangan tampil di bawahnya. Animasi berhenti saat siswa pindah halaman atau tab browser disembunyikan.
- **Identitas kelompok:** nama kelompok, kelas/semester, serta 5 baris nama anggota dengan nomor presensi.

### 3.2 Halaman 2: Petunjuk

- **A. Petunjuk penggunaan** (6 butir): berdoa, isi identitas, baca petunjuk, gunakan butik digital, kerjakan berurutan, periksa sebelum mengumpulkan.
- **B. Capaian dan Tujuan Pembelajaran:** CP beserta sumber SK, lalu dua TP bernomor (tanpa kode TP dan tanpa JP).
- **C. Apersepsi** (3 soal):
  1. Sederhanakan 2/6.
  2. 60 × 1/6.
  3. Ada 3 baju dan 2 kain, berapa pasangan? (3 × 2)

### 3.3 Halaman 3: Butik Digital

**Aktivitas 1: Menyusun Ruang Sampel**

Adegan butik:
- Atap kain bergaris maroon dan cream, dua lampu gantung, dinding bergaris, dan lantai kayu.
- Kiri: **Manekin Atasan**, berupa 3 manekin badan di atas panggung. Setiap manekin memakai atasan lengkap dengan tata rambut dan hiasan kepalanya.
- Tengah: karakter chibi di dalam cermin berbingkai emas di atas karpet, label pasangan yang sedang dipilih, dan tombol **Simpan Set Pakaian**.
- Kanan: **Manekin Bawahan**, berupa 2 manekin kaki yang memakai kain.
- Di HP urutannya: cermin dan tombol simpan, lalu manekin atasan, lalu manekin bawahan.

Interaksi:
- Klik manekin badan untuk memilih atasan, klik manekin kaki untuk memilih bawahan. Karakter langsung berganti busana. Manekin terpilih diberi tanda ✓ dan cahaya emas.
- Tombol **Simpan Set Pakaian**:
  - Semua pesan muncul sebagai **notifikasi di tengah layar**: kotak ivory berbingkai emas dengan **ornamen silang emas** di keempat sudut, gambar karakter memakai set tersebut, dan tombol × untuk menutup. Notifikasi hilang sendiri setelah sekitar 2,5 detik, atau ditutup dengan ×, klik di luar kotak, atau Escape.
  - Jika atasan atau bawahan belum dipilih: "Belum lengkap. Pilih satu atasan dan satu bawahan dulu."
  - Jika pasangan baru: "Set tersimpan!" beserta nama set dan jumlah set yang sudah tersimpan.
  - Jika pasangan sudah pernah disimpan: "Pasangan pakaian ini sudah kamu pilih!" dengan bingkai merah, **layar bergetar**, sel tabelnya berkedip merah, dan data lama tidak ditimpa. Getaran dimatikan untuk pengguna yang mengaktifkan mode kurangi gerakan.

Tabel silang 3 × 2 (baris atasan, kolom Songket dan Tenun Jumputan). Sel yang terisi menampilkan gambar karakter mini, kode pasangan, dan bingkai hijau. Keterangan kode: AG = Aesan Gede, AP = Aesan Paksangko, BK = Baju Kurung Palembang, S = Songket, J = Jumputan.

**Pertanyaan pemantik:** "Set pakaian mana yang paling kamu suka?" Siswa memilih satu dari 6 kartu (gambar karakter, kode, dan nama set). Kartu terpilih diberi tanda ★. Set ini menjadi **kejadian A** dan namanya otomatis muncul di Ayo Isi, Aktivitas 2, Aktivitas 3.1, tabel roda spin (★), tabel frekuensi relatif (baris ★), dan bagian 3.4. Set kesukaan tidak dinilai dan bisa diganti kapan saja.

**Ayo Isi:** kejadian A = terpilihnya set kesukaan. Isian:
- n(S): banyak semua set pakaian yang bisa dibuat (semua sel di tabel).
- n(A): banyak set di tabel yang sama persis dengan set kesukaan.

**Mengenal Peluang Teoretis** (tampil bersama Aktivitas 2): pengertian, rumus P(A) = n(A) / n(S) dengan keterangan simbol tersusun ke bawah, dan contoh butik mini (2 atasan × 2 bawahan = 4 set, P(B) = 1/4). Contoh sengaja memakai butik lain agar tidak memberi jawaban Aktivitas 2.

**Aktivitas 2: Menentukan Peluang Teoretis** (terbuka setelah keenam sel tabel terisi), dalam tiga langkah:
1. "Lihat tabel Aktivitas 1. Ada berapa set yang sama persis dengan set kesukaanmu? Tulis di n(A)."
2. "Ada berapa set pakaian seluruhnya di tabel? Tulis di n(S)."
3. "Bagi n(A) dengan n(S)." (kotak pecahan P(A))

Pertanyaan perluasan: "Temanmu memilih set kesukaan yang berbeda darimu. Berapa peluang teoretis set kesukaan temanmu?"

### 3.4 Halaman 4: Roda Spin

**Mengenal Frekuensi Harapan dan Frekuensi Relatif** (di awal halaman, dua kotak berdampingan):
- Frekuensi harapan: roda diputar 12 kali, peluang set kesukaan 1/6, maka 12 × 1/6 = 2 kali. Dihitung sebelum percobaan, dari peluang teoretis. Rumus umum F_h = N × P(A).
- Frekuensi relatif: misalnya dari 10 putaran set kesukaan muncul 3 kali, maka 3/10. Dihitung sesudah percobaan, dari data nyata. Disebut juga peluang empiris. Rumus umum F_r = k / N.
- Contoh memakai N = 12 dan N = 10 supaya tidak memberi jawaban untuk N = 20.

**3.1 Menghitung Frekuensi Harapan:** "Roda akan diputar 20 kali. Tentukan frekuensi harapan munculnya set kesukaanmu." Rumus F_h = N × P(A), keterangan simbol tersusun ke bawah (F_h, N, P(A)), isian N, P(A) (pecahan), dan hasil. Hasil boleh berupa pecahan atau desimal.

**3.2 Eksperimen Digital Roda Spin:**

- Kiri: karakter dengan busana dasar, berganti sesuai hasil spin terakhir.
- Tengah: roda dengan 6 sektor sama besar (masing-masing 60°), berlabel kode pasangan, dengan penunjuk di atas.
- Kanan: tabel statistik real-time berisi frekuensi (k) setiap pasangan dan totalnya. Baris hasil terakhir disorot, dan set kesukaan diberi tanda ★.
- Tombol:
  - **Spin 1 Kali:** roda berputar sekitar 2,6 detik. Tombol nonaktif setelah total mencapai 20.
  - **Randomize 20 Kali:** jika sudah ada data, sistem minta konfirmasi, mengosongkan data, lalu memutar tepat 20 kali (sekitar 0,65 detik per putaran).
  - **Reset Data:** mengosongkan data simulasi saja. Jawaban dan tabel Aktivitas 1 tidak terhapus.
- Di HP: karakter kecil di samping nama hasil, roda di bawahnya, tombol Spin dan Randomize berdampingan, Reset selebar penuh.

**3.3 Menentukan Frekuensi Relatif:** siswa mulai dari set kesukaan (baris ★ berlatar kuning), lalu semua set. Rumus F_r = k / N dengan N = 20, keterangan simbol tersusun ke bawah. Tabel 6 baris berisi kode pasangan, k (diambil otomatis dari hasil spin), N = 20, dan kotak isian F_r. Kotak baru bisa diisi setelah percobaan genap 20 kali.

**3.4 Membandingkan Frekuensi Harapan dan Frekuensi Relatif** (bertahap; langkah berikutnya muncul setelah langkah sebelumnya diisi, dan semua jawaban tetap bisa diubah). Terbuka setelah set kesukaan dipilih dan roda diputar genap 20 kali.
1. **Langkah 1:** "Lihat tabel roda spin. Berapa kali set kesukaanmu muncul dari 20 putaran?" (isian kali).
2. **Langkah 2:** dua kartu berdampingan. Kartu "Sebelum roda diputar, frekuensi harapan" berisi jawaban siswa di 3.1. Kartu "Sesudah roda diputar, frekuensi relatif" berisi banyak kemunculan dari langkah 1 dan frekuensi relatifnya (k/20). Lalu soal pilihan: set kesukaan muncul lebih sering atau lebih jarang dari yang diharapkan.
3. **Langkah 3:** "Roda akan diputar 60 kali, yaitu 3 kali lipat dari 20. Menurut hasil percobaanmu, kira-kira berapa kali set kesukaanmu muncul?" Langkah ini memenuhi TP 2 (memperkirakan memakai frekuensi relatif).
4. Setelah langkah 3 terisi, muncul kotak "Ingat" satu kalimat tentang perbedaan keduanya.

Versi sebelumnya (tabel perbandingan 5 baris, paragraf hubungan bersimbol, dan 4 isian) dihapus karena terlalu padat untuk siswa.

**3.5 Kesimpulan:** rumus P(A) = 1/6 dan F_r = k/20, tiga soal pilihan ganda, dan satu kotak kesimpulan bebas.

### 3.5 Halaman 5: Periksa dan Kumpulkan

- Kartu identitas (termasuk set kesukaan) dan kartu tiap aktivitas. Setiap butir menampilkan nama soal, jawaban siswa (atau "Belum diisi"), dan tombol **Ubah** yang membuka halaman soal sekaligus menempatkan kursor di kotak jawabannya.
- Kotak pengumpulan berisi tombol **Kumpulkan Jawaban** (setelah pengumpulan pertama berubah menjadi **Kumpulkan Ulang**) dan **Cetak / Simpan PDF**.
- Rincian alurnya ada di bagian 7.

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
| S | Songket Palembang | Songket lepus: dasar maroon dengan benang emas rapat bermotif belah ketupat, tumpal (kepala kain) di depan, tepi bermotif pucuk rebung |
| J | Tenun Jumputan Palembang | Satu desain merah tua (#7E1C2A) untuk semua atasan, motif bintik tujuh (satu titik besar dikelilingi enam titik kecil dalam satu lingkaran) berwarna cream |

**Enam pasangan:** (AG, S), (AG, J), (AP, S), (AP, J), (BK, S), (BK, J).

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

Total **26 butir**. Skor = pembulatan (benar ÷ 26 × 100). Set kesukaan tidak dinilai.

| Kelompok | Butir | Kunci | Aturan |
| --- | --- | --- | --- |
| Apersepsi | Sederhanakan 2/6 | 1/3 | Harus bentuk paling sederhana |
| | 60 × 1/6 | 10 | |
| | 3 × 2 | 6 | |
| Aktivitas 1 | Tabel ruang sampel | 6 dari 6 pasangan tersimpan | Otomatis dari tabel |
| | n(S) | 6 | |
| | n(A), set kesukaan | 1 | |
| Aktivitas 2 | n(A) | 1 | |
| | n(S) | 6 | |
| | P(A) | 1/6 | Pecahan senilai diterima (misal 2/12) |
| | Peluang set kesukaan teman | 1/6 | Pecahan senilai diterima |
| Aktivitas 3.1 | N | 20 | |
| | P(A) | 1/6 | Pecahan senilai diterima |
| | Frekuensi harapan set kesukaan | 10/3 | Diterima: 10/3, 20/6, 3 1/3, 3,33, 3.33 (toleransi 0,006) |
| Aktivitas 3.2–3.3 | Banyak percobaan | 20 | Otomatis dari roda spin |
| | F_r untuk tiap 6 pasangan | k/20 sesuai data siswa sendiri | Pecahan atau desimal, koma atau titik |
| Aktivitas 3.4 | Banyak muncul set kesukaan | k set kesukaan dari data spin | Butuh set kesukaan dan 20 percobaan |
| | Dibanding yang diharapkan | "lebih sering" jika k > 10/3, "lebih jarang" jika k < 10/3 | k tidak mungkin sama dengan 10/3, jadi hanya dua pilihan |
| | Perkiraan 60 putaran | 3 × k set kesukaan | |
| Aktivitas 3.5 | Soal 1 | Tidak, ada yang berbeda | Selalu benar secara matematis: 20/6 bukan bilangan bulat, jadi keenam k tidak mungkin sama |
| | Soal 2 | Hasil setiap putaran acak dan percobaan hanya 20 kali | |
| | Soal 3 | F_r bisa berbeda, tetapi cenderung mendekati 1/6 jika percobaan diperbanyak | |

Kotak kesimpulan bebas tidak dinilai, tetapi ikut tercetak dan terkirim.

Catatan: frekuensi harapan 10/3 bukan bilangan bulat. Hitungan ini benar, tetapi siswa mungkin mengira jawabannya harus bulat. Guru perlu siap menjelaskannya.

---

## 6. Keadilan roda spin

- Pemilihan hasil memakai `crypto.getRandomValues` dengan *rejection sampling*: nilai acak 0–255 yang ≥ 252 dibuang, lalu sisanya dibagi 6. Hasilnya setiap pasangan berpeluang tepat 1/6.
- Hasil ditentukan lebih dulu, baru roda diputar ke sektor itu (ditambah geseran acak ±20° di dalam sektor agar tidak selalu berhenti di tengah).
- Total percobaan dikunci tepat 20: Spin 1 Kali nonaktif di 20, dan Randomize selalu mulai dari 0 lalu berhenti tepat di 20.
- Tidak ada data contoh. Semua angka di tabel berasal dari putaran siswa.

---

## 7. Sistem jawaban dan pengumpulan

| Kondisi | Perilaku |
| --- | --- |
| Saat mengerjakan | Jawaban tidak pernah dikunci. Tiap aktivitas hanya menampilkan "Terisi x dari y". Benar atau salah belum ditampilkan. |
| Tekan Kumpulkan Jawaban | Muncul konfirmasi. Jika ada yang kosong, ditampilkan daftar aktivitas yang belum lengkap beserta pilihan "Periksa Lagi" atau "Ya, Kumpulkan". |
| Setelah dikumpulkan | Skor /100, jumlah benar, waktu, dan nomor pengumpulan tampil. Setiap butir di halaman Kumpulkan diberi tanda ✓ atau ✗. |
| Mengubah jawaban setelah dikumpulkan | Tetap bisa. Muncul pesan "Ada jawaban yang diubah setelah dikumpulkan", dan tombol berubah menjadi Kumpulkan Ulang. |
| Kumpulkan ulang | Skor di layar diperbarui, nomor pengumpulan bertambah. |
| Cetak / Simpan PDF | Nonaktif sebelum pengumpulan pertama. Setelah itu **selalu berisi hasil pengumpulan pertama**, walaupun siswa sudah mengumpulkan ulang. |

**Isi lembar cetak:** judul "Hasil Pengumpulan Pertama", waktu kumpul, identitas, kotak skor, tabel jawaban per aktivitas dengan ✓/✗, data roda spin, kesimpulan kelompok, dan baris "Paraf Guru". Navigasi dan tombol tidak ikut tercetak.

**Pengiriman ke Google Sheet (opsional):** jika `submitUrl` diisi, setiap pengumpulan dikirim sebagai satu baris berisi waktu, kelompok, kelas, anggota, skor, jumlah benar, total butir, nomor pengumpulan, kesimpulan, tabel Aktivitas 1, data simulasi, hasil per butir, dan semua jawaban. Baris dengan "Pengumpulan ke-" = 1 adalah percobaan pertama.

---

## 8. Penyimpanan data

| Data | Tempat | Masa simpan |
| --- | --- | --- |
| Jawaban, set kesukaan, tabel, simulasi, halaman terakhir, pengumpulan | `sessionStorage` (kunci `stylist-studio-sriwijaya-v3`; kunci diganti setiap struktur soal berubah) | Selama tab browser terbuka, termasuk saat halaman dimuat ulang |
| Salinan pengumpulan pertama | Di dalam data yang sama (`firstSubmission`) | Sama seperti di atas; tidak pernah ditimpa |
| Pengaturan suara | `localStorage` (kunci `stylist-studio-audio`) | Permanen di perangkat itu |
| Hasil pengumpulan | Google Sheet milik guru | Permanen, jika `submitUrl` diisi |

Keterbatasan: data di browser hilang jika tab ditutup atau data browser dihapus. Siswa yang sengaja membuka tab baru bisa membuat "pengumpulan pertama" baru. Untuk bukti yang tidak bisa diakali, gunakan Google Sheet.

---

## 9. Suara

**Efek suara** (dibuat browser lewat Web Audio API, tanpa file, tanpa masalah lisensi):

| Kejadian | Bunyi |
| --- | --- |
| Klik tombol, tab, tautan, pilihan ganda | Klik pendek |
| Klik manekin | Dua nada naik |
| Simpan pasangan berhasil | Arpeggio empat nada |
| Pasangan ganda atau belum memilih | Dua nada turun |
| Mulai spin | Desis berputar |
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
- Diuji tanpa geser horizontal di lebar 320, 360, 390, 412, 820, dan 1366 piksel.

**Aksesibilitas:** tombol berukuran sentuh minimal sekitar 40–46 px, garis fokus terlihat untuk keyboard, `aria-pressed` pada manekin, `aria-live` pada hasil spin, modal bisa ditutup dengan Escape, dan animasi dipercepat untuk pengguna yang mengaktifkan mode kurangi gerakan.

---

## 11. Arsitektur teknis

Situs statis HTML, CSS, dan JavaScript murni, tanpa framework dan tanpa proses build.

```
index.html                 Struktur 5 halaman, modal, panel suara
informasi-media.html       Informasi Media: kesesuaian kurikulum, sumber busana, status detail, musik
product.md                 Dokumen ini
README.md                  Ringkasan teknis dan cara deploy
css/style.css              Seluruh gaya, termasuk responsif dan cetak
js/config.js               Pengaturan guru: submitUrl, musicSrc
js/outfits.js              Gambar SVG karakter, busana, manekin, kain
js/audio.js                Efek suara Web Audio dan pemutar musik
js/app.js                  Navigasi, butik, tabel, roda, penilaian, kumpul, cetak
audio/musik-latar.mp3      Musik latar
audio/README.md            Keterangan dan syarat musik pengganti
tools/buat-musik-latar.py  Pembuat musik latar
tools/google-apps-script.gs Penerima jawaban di Google Sheet
vendor/katex/              KaTeX 0.16.9 (lisensi MIT)
```

**Urutan pemuatan skrip:** KaTeX, `config.js`, `outfits.js`, `audio.js`, `app.js` (semuanya `defer`).

**Modul utama:**

- `Outfits.character(top, bottom, opts)`: SVG karakter. `top` ∈ {AG, AP, BK, null}, `bottom` ∈ {S, J, null}, `opts.view = 'bust'` untuk potongan setengah badan.
- `Outfits.mannequinTop(top)` dan `Outfits.mannequinBottom(bottom)`: SVG manekin.
- `Outfits.combos()`: daftar 6 pasangan.
- `Sfx.play(nama)`: efek suara (`click`, `select`, `success`, `error`, `spin`, `tick`, `stop`, `submit`).
- `app.js`: `state` tunggal disimpan ke `sessionStorage` setiap ada perubahan. `GROUPS` berisi definisi 26 butir (label, kunci isian, tampilan, aturan benar).

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

Uji otomatis di Chromium headless (Playwright):

- Enam pasangan tersimpan di sel yang benar, dan pasangan ganda ditolak dengan notifikasi.
- Warna jumputan sama (#7E1C2A) di keenam sel tabel.
- Randomize menghasilkan tepat 20 percobaan, dan Spin 1 Kali nonaktif di 20.
- Reset Data tidak menghapus jawaban maupun tabel Aktivitas 1.
- Jawaban tetap ada setelah halaman dimuat ulang.
- Penilaian: dua kesalahan yang disengaja menghasilkan 21/23 (skor 91), dan setelah satu diperbaiki menjadi 22/23 (skor 96). Diuji pada versi 23 butir.
- Versi 6: set kesukaan (AP, J) tampil di semua bagian yang merujuk kejadian A.
- Versi 7: langkah 3.4 muncul bertahap (langkah 2 setelah langkah 1 diisi, langkah 3 setelah langkah 2), ketiga isian dinilai benar memakai k set kesukaan, total 26 butir, di laptop dan HP 360 px.
- Notifikasi set tepat di tengah layar; pasangan ganda memicu getaran pada konten halaman.
- Halaman Informasi Media terbuka dengan judul baru, dan tidak ada sisa teks "Palembang Heritage" atau kode BH.
- Tombol Ubah membuka halaman yang benar dan memfokuskan kotak jawaban.
- Cetak: setelah kumpul ulang dengan jawaban yang sudah diperbaiki, PDF tetap berisi jawaban dan skor pengumpulan pertama.
- Musik: tidak berbunyi sebelum interaksi, berulang di volume 25% setelah klik, berhenti saat dimatikan. Tanpa file, tombol musik nonaktif.
- Musik latar diperiksa lewat analisis frekuensi (nada sesuai tangga nada G mayor), tetapi **belum didengarkan oleh pengembang**.
- Tidak ada error JavaScript di konsol.

Belum diuji: HP fisik, Safari iOS, dan pengiriman ke Google Sheet sungguhan.

---

## 14. Keterbatasan dan risiko

| Risiko | Dampak | Penanganan |
| --- | --- | --- |
| Detail busana belum divalidasi ahli | Validitas isi instrumen penelitian dipertanyakan | Validasi ahli budaya; lihat Informasi Media |
| Musik bukan rekaman tradisional | Klaim "musik tradisional" tidak sah | Sebut sebagai musik latar orisinal, atau ganti dengan rekaman berizin |
| Data hanya di browser | Hilang jika tab ditutup; pengumpulan pertama bisa diakali dengan tab baru | Aktifkan Google Sheet |
| Kunci jawaban bisa dibaca di kode sumber | Siswa yang paham kode bisa melihat kunci | Wajar untuk LKPD formatif; untuk tes sumatif butuh server |
| CP mengutip PDF lama | Bisa berbeda dengan teks resmi | Cocokkan dengan SK BSKAP 046/H/KR/2025 |
| F_h = 10/3 bukan bilangan bulat | Siswa bisa bingung | Guru siapkan penjelasan |
| Frekuensi harapan di buku resmi dibahas di kelas IX | Penguji bisa mempertanyakan penempatan di kelas VIII | Lampirkan ATP sekolah yang menempatkannya di kelas VIII |
| Detail BK (sanggul, anting, kalung, hiasan bunga) mengikuti foto, bukan sumber tertulis | Klaim keaslian lemah | Sebut sebagai pilihan desain; validasi ahli |

---

## 15. Riwayat perubahan

| Versi | Perubahan |
| --- | --- |
| 1 | E-LKPD dibangun: karakter chibi SVG, 3 atasan dan 2 bawahan, tabel silang tanpa duplikat, roda spin adil 20 kali, KaTeX lokal, halaman referensi |
| 2 | Jumputan satu warna merah tua; butik bermanekin seperti PDF lama; cek per aktivitas diganti status terisi; halaman Periksa dan Kumpulkan dengan skor; pengiriman Google Sheet; efek suara dan pemutar musik; CP dan apersepsi mengikuti PDF lama |
| 3 | Musik latar ditambahkan; hasil cetak dikunci pada pengumpulan pertama |
| 4 | Musik dibuat ceria (G mayor, tempo 112); bas, genjrengan, dan kendang dihapus, melodi dipertahankan |
| 5 | Kulit kuning langsat; tampilan HP dirapikan (tab, rumus, roda spin, butik, rekap) |
| 7 | Bagian 3.4 disederhanakan: tabel perbandingan dan paragraf bersimbol dihapus, diganti 3 langkah bertahap dengan dua kartu sebelum/sesudah roda diputar (26 butir) |
| 6 | BH diganti Baju Kurung Palembang (BK); tema menjadi Sriwijaya Heritage; catatan guru menjadi Informasi Media dengan analisis kesesuaian kurikulum; TP ditampilkan; pertanyaan pemantik set kesukaan sebagai kejadian A; bahasa Aktivitas 2 diperjelas; pengertian peluang teoretis, frekuensi harapan, dan frekuensi relatif sebelum aktivitas; bagian 3.4 perbandingan frekuensi harapan dan relatif (27 butir); keterangan rumus tersusun ke bawah; notifikasi di tengah dengan ornamen silang dan layar bergetar |

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

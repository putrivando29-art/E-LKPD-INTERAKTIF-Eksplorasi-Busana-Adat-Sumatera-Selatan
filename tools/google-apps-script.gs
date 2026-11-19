/**
 * Penerima hasil E-LKPD Butik Warisan Sriwijaya ke Google Sheet.
 *
 * Cara pasang:
 * 1. Buat Google Sheet baru, lalu buka Ekstensi > Apps Script.
 * 2. Hapus isi editor, tempel seluruh kode ini, lalu simpan.
 * 3. Klik Terapkan > Deployment baru > pilih jenis "Aplikasi web".
 *    Jalankan sebagai: Saya. Yang memiliki akses: Siapa saja.
 * 4. Salin URL aplikasi web (berakhiran /exec) ke submitUrl di js/config.js.
 *
 * Website hanya mengirim pengumpulan PERTAMA dari satu perangkat.
 * Jika siswa yang sama mengumpulkan lagi dari perangkat lain, browser lain,
 * atau mode penyamaran, kolom "Kiriman ke-" akan bernilai 2, 3, dan seterusnya.
 * Nilai yang dipakai adalah baris dengan "Kiriman ke-" = 1.
 */
var HEADERS = [
  'Diterima', 'Waktu kumpul', 'Nama', 'Kelas/Semester', 'Nomor presensi',
  'Kiriman ke-', 'Skor', 'Benar', 'Total butir', 'Pasangan kesukaan', 'Kesimpulan',
  'Tabel Aktivitas 1', 'Simulasi (k)', 'Hasil per butir', 'Semua jawaban'
];

function norm(s) {
  return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

// Dibuka lewat browser untuk memeriksa bahwa penerima sudah aktif.
function doGet() {
  return ContentService.createTextOutput('Penerima hasil E-LKPD Butik Warisan Sriwijaya aktif. Hasil siswa masuk ke tab Jawaban.');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Jawaban') || ss.insertSheet('Jawaban');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    var d = JSON.parse(e.postData.contents);

    // Hitung kiriman sebelumnya dengan nama, kelas, dan nomor presensi yang sama.
    var key = [norm(d.nama), norm(d.kelas), norm(d.presensi)].join('|');
    var count = 1;
    if (sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2, 3, sheet.getLastRow() - 1, 3).getValues();
      rows.forEach(function (r) {
        if ([norm(r[0]), norm(r[1]), norm(r[2])].join('|') === key) count += 1;
      });
    }

    sheet.appendRow([
      new Date(), d.waktu, d.nama, d.kelas, d.presensi,
      count, d.skor, d.benar, d.total, d.pasanganKesukaan || '', d.kesimpulan,
      (d.tabelAktivitas1 || []).join(', '),
      JSON.stringify(d.simulasi || {}),
      JSON.stringify(d.hasilButir || {}),
      JSON.stringify(d.jawaban || {})
    ]);
    if (count > 1) sheet.getRange(sheet.getLastRow(), 1, 1, HEADERS.length).setBackground('#FBE3DC');
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

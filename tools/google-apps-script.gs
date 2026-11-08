/**
 * Penerima jawaban E-LKPD Stylist Studio ke Google Sheet.
 *
 * Cara pasang:
 * 1. Buat Google Sheet baru, lalu buka Ekstensi > Apps Script.
 * 2. Hapus isi editor, tempel seluruh kode ini, lalu simpan.
 * 3. Klik Terapkan > Deployment baru > pilih jenis "Aplikasi web".
 *    Jalankan sebagai: Saya. Yang memiliki akses: Siapa saja.
 * 4. Salin URL aplikasi web (berakhiran /exec) ke submitUrl di js/config.js.
 */
var HEADERS = [
  'Diterima', 'Waktu kumpul', 'Nama', 'Kelas/Semester', 'Nomor presensi',
  'Skor', 'Benar', 'Total butir', 'Pengumpulan ke-', 'Kesimpulan',
  'Tabel Aktivitas 1', 'Simulasi (k)', 'Hasil per butir', 'Semua jawaban'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Jawaban') || ss.insertSheet('Jawaban');
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(), d.waktu, d.nama, d.kelas, d.presensi,
      d.skor, d.benar, d.total, d.pengumpulanKe, d.kesimpulan,
      (d.tabelAktivitas1 || []).join(', '),
      JSON.stringify(d.simulasi || {}),
      JSON.stringify(d.hasilButir || {}),
      JSON.stringify(d.jawaban || {})
    ]);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

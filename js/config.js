/*
 * Pengaturan yang boleh diubah guru.
 *
 * submitUrl : alamat Web App Google Apps Script untuk menerima jawaban
 *             (lihat tools/google-apps-script.gs dan README). Biarkan kosong
 *             jika hasil cukup dikumpulkan lewat PDF ke WhatsApp guru.
 * musicSrc  : lokasi file musik latar instrumental. Letakkan file rekaman
 *             yang izin pemakaiannya jelas di folder audio/.
 */
window.ELKPD_CONFIG = {
  submitUrl: '',
  musicSrc: 'audio/musik-latar.mp3'
};

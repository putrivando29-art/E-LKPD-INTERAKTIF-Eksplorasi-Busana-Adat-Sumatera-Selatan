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
  submitUrl: 'https://script.google.com/macros/s/AKfycbz8hx2yK4s8fi-XtcDneCmFPDVT750Xktqd1MJeaGubvfzgVtEaHNXSrq0WeplM95sN-w/exec',
  musicSrc: 'audio/musik-latar.mp3'
};

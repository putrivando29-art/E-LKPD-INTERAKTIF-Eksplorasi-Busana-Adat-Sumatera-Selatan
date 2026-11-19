(function () {
  'use strict';

  var O = window.Outfits;
  var CFG = window.ELKPD_CONFIG || {};
  var COMBOS = O.combos();
  var N_TRIALS = 30;
  var N_FAST = 300;
  var PAGES = 6;

  // Jawaban disimpan di localStorage agar tetap ada walau web ditutup.
  // Pengumpulan pertama tiap siswa (nama + kelas + presensi) disimpan terpisah
  // dan tidak pernah ditimpa: itulah nilai akhir.
  var STORE = 'butik-warisan-sriwijaya-v2';
  var DRAFT_KEY = STORE + ':draft';
  var LOCK_KEY = STORE + ':locks';

  // Warna sektor roda dan swatch tabel statistik
  var SECTOR = {
    'AG-S': { fill: '#7A1F2B', text: '#FFF4E2' },
    'AG-J': { fill: '#D9A82E', text: '#3A2318' },
    'AP-S': { fill: '#B5482F', text: '#FFF4E2' },
    'AP-J': { fill: '#FFF3DC', text: '#7A1F2B' },
    'BK-S': { fill: '#4E2A5A', text: '#FFF4E2' },
    'BK-J': { fill: '#2B1E1A', text: '#F3D57E' }
  };

  // Pilihan untuk bagian "Ditanya"
  var ASK = [
    ['', 'Pilih yang ditanya'],
    ['P', 'Peluang teoretis'],
    ['Fh', 'Frekuensi harapan'],
    ['Fr', 'Frekuensi relatif'],
    ['nS', 'Banyak anggota ruang sampel']
  ];

  function sfx(name) { if (window.Sfx) window.Sfx.play(name); }

  /* ---------- penyimpanan ---------- */

  function freshSim() {
    var counts = {};
    COMBOS.forEach(function (c) { counts[c.key] = 0; });
    return { counts: counts, total: 0, last: null, rotation: 0 };
  }
  function freshState() {
    return { page: 1, answers: {}, boutique: { top: null, bottom: null, saved: {} }, sim: freshSim(), sim300: null, practice: null };
  }

  function readJSON(key) {
    try { var raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function writeJSON(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* penyimpanan tidak tersedia */ }
  }

  var state = readJSON(DRAFT_KEY) || freshState();
  var locks = readJSON(LOCK_KEY) || {};

  function save() { writeJSON(DRAFT_KEY, state); }
  function saveLocks() { writeJSON(LOCK_KEY, locks); }

  function norm(s) { return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase(); }
  function idKey() {
    var parts = [a('id_nama'), a('id_kelas'), a('id_no')].map(norm);
    return parts.every(Boolean) ? parts.join('|') : '';
  }
  function myLock() { var k = idKey(); return k ? locks[k] || null : null; }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function code(b) { return O.BOTTOMS[b].code; }
  function comboName(key) {
    var p = key.split('-');
    return O.TOPS[p[0]].name + ' + ' + O.BOTTOMS[p[1]].short;
  }
  function comboCode(key) { var p = key.split('-'); return '(' + p[0] + ', ' + code(p[1]) + ')'; }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; });
  }
  function comma(x) { return x.toFixed(2).replace('.', ','); }

  /* ---------- toast ---------- */

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2800);
  }

  /* ---------- rumus (KaTeX) ---------- */

  function tex(el, src, display) {
    if (window.katex) window.katex.render(src, el, { throwOnError: false, displayMode: !!display });
    else el.textContent = src.replace(/\\[dt]?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2').replace(/\\times/g, '×').replace(/\\ldots/g, '…').replace(/[{}\\]/g, '');
  }
  function renderTex(root) {
    $all('.tex', root).forEach(function (el) { tex(el, el.getAttribute('data-tex'), el.getAttribute('data-display') === '1'); });
  }

  // Bagian Jawab: tiga langkah yang diisi siswa sendiri.
  // kind P = peluang teoretis, Fh = frekuensi harapan, Fr = frekuensi relatif.
  var JAWAB = {
    a21: { ev: 'A', kind: 'P', res: ['a21_pNum', 'a21_pDen'] },
    a23: { ev: 'B', kind: 'P', res: ['a23_pNum', 'a23_pDen'] },
    a24: { ev: 'C', kind: 'P', res: ['a24_num', 'a24_den'] },
    a31: { ev: 'A', kind: 'Fh', res: ['a31_res'] },
    a32: { ev: 'B', kind: 'Fh', res: ['a32_res'] },
    a42: { ev: 'A', kind: 'Fr', res: ['a42_num', 'a42_den'] }
  };
  function formulaTex(kind, ev) {
    if (kind === 'P') return 'P(' + ev + ')=\\dfrac{n(' + ev + ')}{n(S)}';
    if (kind === 'Fh') return 'F_h=N\\times P(' + ev + ')';
    return 'F_r=\\dfrac{k}{N}';
  }
  function formulaText(kind, ev) {
    if (kind === 'P') return 'P(' + ev + ') = n(' + ev + ')/n(S)';
    if (kind === 'Fh') return 'Fh = N × P(' + ev + ')';
    return 'Fr = k/N';
  }
  function lhsTex(kind, ev) { return kind === 'P' ? 'P(' + ev + ')=' : kind === 'Fh' ? 'F_h=' : 'F_r='; }
  function fracBox(nk, dk, label) {
    return '<span class="frac-input"><input type="text" inputmode="numeric" data-key="' + nk + '" aria-label="Pembilang ' + label + '">' +
      '<span class="bar"></span><input type="text" inputmode="numeric" data-key="' + dk + '" aria-label="Penyebut ' + label + '"></span>';
  }
  function buildJawab() {
    $all('[data-jawab]').forEach(function (box) {
      var id = box.getAttribute('data-jawab');
      var j = JAWAB[id];
      var no = id.charAt(1) + '.' + id.charAt(2);
      var opts = ['P', 'Fh', 'Fr'].map(function (k) {
        return '<label><input type="radio" name="' + id + '_f" value="' + k + '" data-key="' + id + '_f"><span class="tex" data-tex="' + formulaTex(k, j.ev) + '"></span></label>';
      }).join('');
      var step2 = j.kind === 'Fh'
        ? '<input type="text" inputmode="numeric" class="box" data-key="' + id + '_sN" aria-label="Angka N"><span class="tex" data-tex="\\times"></span>' + fracBox(id + '_sNum', id + '_sDen', 'peluang')
        : fracBox(id + '_sNum', id + '_sDen', 'langkah 2');
      var step3 = j.kind === 'Fh'
        ? '<input type="text" inputmode="numeric" class="box" data-key="' + j.res[0] + '" aria-label="Hasil soal ' + no + '"><span>kali</span>'
        : fracBox(j.res[0], j.res[1], 'hasil soal ' + no);
      box.innerHTML = '<p class="ddj-title">Jawab</p><ol class="jawab-steps">' +
        '<li><p>Pilih rumus yang dipakai.</p><div class="rumus" role="radiogroup" aria-label="Rumus soal ' + no + '">' + opts + '</div></li>' +
        '<li><p>Masukkan angka dari bagian Diketahui ke dalam rumus.</p><div class="eq-row"><span class="tex" data-tex="' + lhsTex(j.kind, j.ev) + '"></span>' + step2 + '</div></li>' +
        '<li><p>' + (j.kind === 'Fh' ? 'Hitung hasilnya.' : 'Tulis hasilnya. Sederhanakan jika bisa.') + '</p><div class="eq-row"><span class="tex" data-tex="' + lhsTex(j.kind, j.ev) + '"></span>' + step3 + '</div></li>' +
        '</ol>';
    });
  }

  /* ---------- navigasi halaman ---------- */

  function showPage(n, focusKey) {
    n = Math.max(1, Math.min(PAGES, n));
    state.page = n;
    save();
    $all('.page').forEach(function (p) { p.hidden = Number(p.getAttribute('data-page')) !== n; });
    $all('.tab').forEach(function (t) {
      if (Number(t.getAttribute('data-page')) === n) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
    $('#mnav-page').value = String(n);
    $('#mnav-prev').disabled = n === 1;
    $('#mnav-next').disabled = n === PAGES;
    if (n === 1) startCover(); else stopCover();
    if (n === 5) { renderFrTable(); renderAkt4(); }
    if (n === 6) { renderRecap(); renderSubmission(); }
    var target = focusKey && $('[data-key="' + focusKey + '"]');
    if (target && !target.closest('[hidden]')) {
      target.scrollIntoView({ block: 'center' });
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
    }
  }

  /* ---------- sampul: pergantian busana tiap 1 detik ---------- */

  var coverSvgs = COMBOS.map(function (c) { return O.character(c.top, c.bottom); });
  var coverIdx = 0;
  var coverTimer = null;
  var coverFront = 'a';

  function startCover() {
    if (coverTimer) return;
    coverTimer = setInterval(function () {
      coverIdx = (coverIdx + 1) % COMBOS.length;
      var next = coverFront === 'a' ? 'b' : 'a';
      var inEl = $('#cover-' + next);
      var outEl = $('#cover-' + coverFront);
      inEl.innerHTML = coverSvgs[coverIdx];
      inEl.classList.add('is-on');
      outEl.classList.remove('is-on');
      coverFront = next;
      $('#cover-caption').textContent = comboName(COMBOS[coverIdx].key);
    }, 1000);
  }
  function stopCover() { clearInterval(coverTimer); coverTimer = null; }

  /* ---------- isian jawaban ---------- */

  function onAnswer(key) {
    save();
    updateStatuses();
    renderAkt4();
    if (key.indexOf('id_') === 0) renderLockUI();
  }

  function bindInputs(root) {
    $all('[data-key]', root).forEach(function (el) {
      if (el.dataset.bound) return;
      el.dataset.bound = '1';
      var key = el.getAttribute('data-key');
      if (el.type === 'radio') {
        el.checked = state.answers[key] === el.value;
        el.addEventListener('change', function () { state.answers[key] = el.value; onAnswer(key); });
      } else {
        if (state.answers[key] != null) el.value = state.answers[key];
        el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', function () { state.answers[key] = el.value; onAnswer(key); });
      }
    });
  }

  function buildAsks() {
    $all('select.ask').forEach(function (sel) {
      sel.innerHTML = ASK.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('');
    });
  }

  /* ---------- kunci jawaban & penilaian ---------- */

  function a(key) { return state.answers[key] == null ? '' : String(state.answers[key]).trim(); }
  function isInt(key, n) { return a(key) === String(n); }
  function fracEq(numKey, denKey, tNum, tDen) {
    var num = a(numKey), den = a(denKey);
    if (!/^\d+$/.test(num) || !/^\d+$/.test(den) || Number(den) === 0) return false;
    return Number(num) * tDen === Number(den) * tNum;
  }
  function frac(numKey, denKey) { return (a(numKey) || '…') + '/' + (a(denKey) || '…'); }
  function val(key) { return a(key) || '…'; }
  function askName(key) { var o = ASK.filter(function (x) { return x[0] === a(key); })[0]; return o && o[0] ? o[1] : '…'; }

  // Pasangan pakaian kesukaan siswa menjadi kejadian A.
  function fav() { var k = a('fav'); return COMBOS.some(function (c) { return c.key === k; }) ? k : ''; }
  function simDone() { return state.sim.total === N_TRIALS; }
  function favReady() { return !!fav() && simDone(); }
  function favK() { return fav() ? state.sim.counts[fav()] : 0; }
  function friend() { var k = a('friend'); return k && k !== fav() && COMBOS.some(function (c) { return c.key === k; }) ? k : ''; }
  function allCountsEqual() { return COMBOS.every(function (c) { return state.sim.counts[c.key] === N_TRIALS / 6; }); }
  function savedCount() { return COMBOS.filter(function (c) { return state.boutique.saved[c.key]; }).length; }

  // Selisih rata-rata frekuensi relatif keenam pasangan terhadap 1/6.
  function meanGap(counts, total) {
    return COMBOS.reduce(function (s, c) { return s + Math.abs(counts[c.key] / total - 1 / 6); }, 0) / COMBOS.length;
  }

  var MCQ = {
    cmp_dir: { a: 'Lebih sering dari yang diharapkan.', b: 'Sama dengan yang diharapkan.', c: 'Lebih jarang dari yang diharapkan.' },
    q45: { a: 'Hasil 30 putaran.', b: 'Hasil 300 putaran.' },
    k1: { a: 'Ya, semuanya tepat 1/6.', b: 'Tidak, ada yang lebih besar atau lebih kecil dari 1/6.' },
    k2: { a: 'Bagian roda untuk setiap pasangan tidak sama besar.', b: 'Hasil setiap putaran acak, dan 30 putaran masih sedikit.', c: 'Peluang teoretis hanya berlaku jika roda diputar 6 kali.', d: 'Pasangan kesukaanmu lebih mudah muncul.' },
    k3: { a: 'Frekuensi relatif setiap pasangan pasti tepat 1/6.', b: 'Frekuensi relatif setiap pasangan cenderung makin dekat ke 1/6.', c: 'Frekuensi relatif setiap pasangan makin jauh dari 1/6.', d: 'Pasangan yang paling sering muncul di 30 putaran akan tetap paling sering muncul.' },
    ref3: { a: 'Sangat paham', b: 'Paham', c: 'Kurang paham', d: 'Belum paham' }
  };

  function num(id, label, key, target, how) {
    return { id: id, label: label, keys: [key], show: function () { return val(key); }, ok: function () { return isInt(key, typeof target === 'function' ? target() : target); }, how: how };
  }
  function fr(id, label, nk, dk, tn, td, how) {
    return { id: id, label: label, keys: [nk, dk], show: function () { return frac(nk, dk); },
      ok: function () { return fracEq(nk, dk, typeof tn === 'function' ? tn() : tn, td); }, how: how };
  }
  function ask(id, label, key, target) {
    return { id: id, label: label, keys: [key], show: function () { return askName(key); }, ok: function () { return a(key) === target; },
      how: 'Baca lagi kalimat tanyanya. Pilih besaran yang diminta soal.' };
  }
  // Langkah 1 (rumus) dan langkah 2 (substitusi) pada bagian Jawab.
  var KIND_NAME = { P: 'peluang teoretis', Fh: 'frekuensi harapan', Fr: 'frekuensi relatif' };
  function steps(id, no, sub) {
    var j = JAWAB[id];
    var keys = j.kind === 'Fh' ? [id + '_sN', id + '_sNum', id + '_sDen'] : [id + '_sNum', id + '_sDen'];
    return [
      { id: id + '_f', label: no + ' Langkah 1: rumus', keys: [id + '_f'],
        show: function () { return a(id + '_f') ? formulaText(a(id + '_f'), j.ev) : '…'; },
        ok: function () { return a(id + '_f') === j.kind; },
        how: 'Lihat lagi bagian Ditanya. Yang ditanya ' + KIND_NAME[j.kind] + ', jadi pakai rumus ' + KIND_NAME[j.kind] + '.' },
      { id: id + '_s', label: no + ' Langkah 2: masukkan angka', keys: keys,
        show: function () { return j.kind === 'Fh' ? val(id + '_sN') + ' × ' + frac(id + '_sNum', id + '_sDen') : frac(id + '_sNum', id + '_sDen'); },
        ok: sub,
        how: j.kind === 'P' ? 'Ganti n(' + j.ev + ') dan n(S) pada rumus dengan angka di bagian Diketahui.'
          : j.kind === 'Fh' ? 'Ganti N dan P(' + j.ev + ') pada rumus dengan angka di bagian Diketahui.'
          : 'Ganti k dan N pada rumus dengan angka di bagian Diketahui.' }
    ];
  }
  function exactFrac(nk, dk, n, d) { return isInt(nk, n) && isInt(dk, d); }

  function mcq(id, label, key, target, how) {
    return { id: id, label: label, keys: [key], show: function () { return MCQ[key][a(key)] || '…'; },
      ok: function () { return a(key) === (typeof target === 'function' ? target() : target); }, how: how };
  }

  // Setiap butir: id, label, kunci isian, tampilan jawaban, aturan benar, dan
  // cara menyelesaikan (umpan balik tanpa angka jawaban akhir).
  var GROUPS = [
    { id: 'apersepsi', title: 'Apersepsi', page: 2, items: [
      fr('ap1', '1. Sederhanakan 2/6', 'ap1_num', 'ap1_den', 1, 3, 'Bagi pembilang dan penyebut dengan bilangan yang sama sampai tidak bisa dibagi lagi.'),
      num('ap2', '2. 60 × 1/6', 'ap2', 10, 'Kalikan 60 dengan pembilang, lalu bagi dengan penyebut.'),
      num('ap3', '3. Banyak pasangan dari 3 baju dan 2 kain', 'ap3', 6, 'Setiap baju bisa dipasangkan dengan setiap kain. Kalikan banyak baju dengan banyak kain.')
    ] },
    { id: 'akt1', title: 'Aktivitas 1: Ruang Sampel', page: 3, items: [
      { id: 'tabel', label: 'Tabel Aktivitas 1', keys: [], filled: function () { return savedCount() === COMBOS.length; }, show: function () { return savedCount() + ' dari 6 pasangan'; },
        ok: function () { return savedCount() === COMBOS.length; }, how: 'Simpan semua pasangan atasan dan bawahan yang berbeda sampai tabel penuh.' },
      num('a1_nS', 'n(S), semua pasangan', 'a1_nS', 6, 'Hitung semua sel di tabel Aktivitas 1.'),
      num('a1_nA', 'n(A), pasangan kesukaanmu', 'a1_nA', 1, 'Cari sel yang sama dengan pasangan kesukaanmu. Hitung ada berapa.')
    ] },
    { id: 'akt2', title: 'Aktivitas 2: Peluang Teoretis', page: 3, items: [].concat(
      num('a21_nA', '2.1 Diketahui n(A)', 'a21_nA', 1, 'Cari sel yang sama dengan pasangan kesukaanmu di tabel. Hitung ada berapa.'),
      num('a21_nS', '2.1 Diketahui n(S)', 'a21_nS', 6, 'Hitung semua sel di tabel Aktivitas 1.'),
      ask('a21_q', '2.1 Ditanya', 'a21_q', 'P'),
      steps('a21', '2.1', function () { return exactFrac('a21_sNum', 'a21_sDen', 1, 6); }),
      fr('a21_p', '2.1 Langkah 3: hasil P(A)', 'a21_pNum', 'a21_pDen', 1, 6, 'Bagi n(A) dengan n(S).'),
      fr('a22', '2.2 Peluang pasangan teman', 'a22_num', 'a22_den', 1, 6, 'Setiap pasangan punya kesempatan sama. Hitung seperti peluang pasanganmu.'),
      num('a23_nB', '2.3 Diketahui n(B)', 'a23_nB', 3, 'Lihat kolom Songket di tabel. Hitung pasangan yang memakai Songket.'),
      num('a23_nS', '2.3 Diketahui n(S)', 'a23_nS', 6, 'Hitung semua sel di tabel Aktivitas 1.'),
      ask('a23_q', '2.3 Ditanya', 'a23_q', 'P'),
      steps('a23', '2.3', function () { return exactFrac('a23_sNum', 'a23_sDen', 3, 6); }),
      fr('a23_p', '2.3 Langkah 3: hasil P(B)', 'a23_pNum', 'a23_pDen', 3, 6, 'Bagi n(B) dengan n(S). Pecahan boleh disederhanakan.'),
      num('a24_nC', '2.4 Diketahui n(C)', 'a24_nC', 2, 'Lihat baris Aesan Gede di tabel. Hitung pasangan yang memakai Aesan Gede.'),
      num('a24_nS', '2.4 Diketahui n(S)', 'a24_nS', 6, 'Hitung semua sel di tabel Aktivitas 1.'),
      ask('a24_q', '2.4 Ditanya', 'a24_q', 'P'),
      steps('a24', '2.4', function () { return exactFrac('a24_sNum', 'a24_sDen', 2, 6); }),
      fr('a24', '2.4 Langkah 3: hasil P(C)', 'a24_num', 'a24_den', 2, 6, 'Bagi n(C) dengan n(S). Pecahan boleh disederhanakan.')
    ) },
    { id: 'akt3', title: 'Aktivitas 3: Frekuensi Harapan', page: 4, items: [].concat(
      num('a31_N', '3.1 Diketahui N', 'a31_N', N_TRIALS, 'N adalah banyak putaran roda yang disebut di soal.'),
      fr('a31_p', '3.1 Diketahui P(A)', 'a31_pNum', 'a31_pDen', 1, 6, 'Pakai peluang pasangan kesukaanmu dari soal 2.1.'),
      ask('a31_q', '3.1 Ditanya', 'a31_q', 'Fh'),
      steps('a31', '3.1', function () { return isInt('a31_sN', N_TRIALS) && fracEq('a31_sNum', 'a31_sDen', 1, 6); }),
      num('a31_res', '3.1 Langkah 3: hasil Fh', 'a31_res', N_TRIALS / 6, 'Kalikan N dengan pembilang, lalu bagi dengan penyebut.'),
      num('a32_N', '3.2 Diketahui N', 'a32_N', 60, 'N adalah banyak putaran roda yang disebut di soal.'),
      fr('a32_p', '3.2 Diketahui P(B)', 'a32_pNum', 'a32_pDen', 3, 6, 'Pakai peluang pasangan bersongket dari soal 2.3.'),
      ask('a32_q', '3.2 Ditanya', 'a32_q', 'Fh'),
      steps('a32', '3.2', function () { return isInt('a32_sN', 60) && fracEq('a32_sNum', 'a32_sDen', 3, 6); }),
      num('a32_res', '3.2 Langkah 3: hasil Fh', 'a32_res', 30, 'Kalikan N dengan pembilang, lalu bagi dengan penyebut.')
    ) },
    { id: 'akt4', title: 'Aktivitas 4: Frekuensi Relatif', page: 5, items: [
      { id: 'sim', label: '4.1 Banyak putaran', keys: [], filled: simDone, show: function () { return state.sim.total + ' dari ' + N_TRIALS; },
        ok: simDone, how: 'Putar roda sampai 30 kali.' },
      num('a42_k', '4.2 Diketahui k', 'a42_k', favK, 'Lihat angka pasangan kesukaanmu di tabel hasil roda.'),
      num('a42_N', '4.2 Diketahui N', 'a42_N', N_TRIALS, 'N adalah banyak putaran roda.'),
      ask('a42_q', '4.2 Ditanya', 'a42_q', 'Fr')
    ].concat(
      steps('a42', '4.2', function () { return simDone() && exactFrac('a42_sNum', 'a42_sDen', favK(), N_TRIALS); }),
      fr('a42_fr', '4.2 Langkah 3: hasil Fr', 'a42_num', 'a42_den', favK, N_TRIALS, 'Bagi k dengan N.')
    ) },
    { id: 'akt43', title: 'Aktivitas 4.3: Frekuensi Relatif Semua Pasangan', page: 5, items: function () {
      return COMBOS.filter(function (c) { return c.key !== fav(); }).map(function (c) {
        return { id: 'a43_' + c.key, label: 'Fr ' + comboCode(c.key) + ', k = ' + state.sim.counts[c.key], keys: ['a43n_' + c.key, 'a43d_' + c.key],
          show: function () { return frac('a43n_' + c.key, 'a43d_' + c.key); },
          ok: function () { return simDone() && fracEq('a43n_' + c.key, 'a43d_' + c.key, state.sim.counts[c.key], N_TRIALS); },
          how: 'Frekuensi relatif = k dibagi 30. Ambil k dari tabel hasil roda.' };
      });
    } },
    { id: 'akt44', title: 'Aktivitas 4.4 dan 4.5: Membandingkan', page: 5, items: [
      mcq('cmp_dir', '4.4 Dibanding yang diharapkan', 'cmp_dir', function () { var h = N_TRIALS / 6; return favK() > h ? 'a' : favK() === h ? 'b' : 'c'; },
        'Bandingkan banyak muncul pasangan kesukaanmu dengan frekuensi harapannya di soal 3.1.'),
      { id: 'q45', label: '4.5 Lebih dekat ke 1/6', keys: ['q45'], filled: function () { return !!state.sim300 && a('q45') !== ''; },
        show: function () { return MCQ.q45[a('q45')] || '…'; },
        ok: function () { return !!state.sim300 && simDone() && a('q45') === (meanGap(state.sim300.counts, N_FAST) <= meanGap(state.sim.counts, N_TRIALS) ? 'b' : 'a'); },
        how: 'Lihat diagram 4.5. Bandingkan jarak batang 30 putaran dan 300 putaran dari garis 1/6.' }
    ] },
    { id: 'kesimpulan', title: 'Kesimpulan', page: 6, items: [
      mcq('k1', 'Kesimpulan 1', 'k1', function () { return allCountsEqual() ? 'a' : 'b'; }, 'Lihat tabel 4.3. Apakah semua frekuensi relatif sama dengan 1/6?'),
      mcq('k2', 'Kesimpulan 2', 'k2', 'b', 'Ingat, bagian roda sama besar, tetapi hasil setiap putaran acak.'),
      mcq('k3', 'Kesimpulan 3', 'k3', 'b', 'Lihat lagi hasil Putar Cepat 300 Kali di 4.5.')
    ] }
  ];

  // Isian tertulis dinilai guru dari PDF, tidak dinilai otomatis.
  var WRITTEN = [
    { key: 'r1', page: 3, label: 'Jelaskan cara kamu menghitung banyak semua pasangan pakaian.' },
    { key: 'r2', page: 3, label: 'Apakah peluang pasangan temanmu sama dengan peluang pasanganmu? Jelaskan alasannya.' },
    { key: 'r3', page: 5, label: 'Mengapa hasil putaran roda tidak selalu sama dengan frekuensi harapan?' },
    { key: 'k_text', page: 6, label: 'Kesimpulan dengan kalimatmu sendiri' }
  ];
  var REFLECT = [
    { key: 'ref1', label: 'Apa yang kamu pelajari hari ini?' },
    { key: 'ref2', label: 'Bagian mana yang masih sulit untukmu?' },
    { key: 'ref3', label: 'Seberapa paham kamu tentang materi ini?', choice: true }
  ];

  function groupItems(g) { return typeof g.items === 'function' ? g.items() : g.items; }
  function itemFilled(it) {
    if (it.filled) return it.filled();
    return it.keys.every(function (k) { return a(k) !== ''; });
  }
  function allItems() {
    var list = [];
    GROUPS.forEach(function (g) { groupItems(g).forEach(function (it) { list.push(it); }); });
    return list;
  }
  function evaluate() {
    var results = {};
    var correct = 0;
    var items = allItems();
    items.forEach(function (it) { var ok = !!it.ok(); results[it.id] = ok; if (ok) correct += 1; });
    return { results: results, correct: correct, total: items.length, score: Math.round(correct / items.length * 100) };
  }

  // Status terisi per bagian, tanpa membuka benar atau salah.
  function updateStatuses() {
    $all('[data-status]').forEach(function (el) {
      var gid = el.getAttribute('data-status');
      var g = GROUPS.filter(function (x) { return x.id === gid; })[0];
      if (!g) return;
      var items = groupItems(g).filter(function (it) { return it.keys.length; });
      var done = items.filter(itemFilled).length;
      el.textContent = 'Terisi ' + done + ' dari ' + items.length + '.';
      el.classList.toggle('is-done', done === items.length);
    });
  }

  /* ---------- butik ---------- */

  function buildWardrobe() {
    $('#top-choices').innerHTML = ['AG', 'AP', 'BK'].map(function (t) {
      return '<button type="button" class="mannequin" data-top="' + t + '" data-sfx="select" aria-pressed="false">' +
        '<span class="mq-fig">' + O.mannequinTop(t) + '</span><span class="mq-name">' + O.TOPS[t].name + '</span></button>';
    }).join('');
    $('#bottom-choices').innerHTML = ['S', 'J'].map(function (b) {
      return '<button type="button" class="mannequin mannequin-legs" data-bottom="' + b + '" data-sfx="select" aria-pressed="false">' +
        '<span class="mq-fig">' + O.mannequinBottom(b) + '</span><span class="mq-name">' + O.BOTTOMS[b].name + '</span></button>';
    }).join('');
    $all('[data-top]').forEach(function (btn) {
      btn.addEventListener('click', function () { state.boutique.top = btn.getAttribute('data-top'); save(); updateDressing(); });
    });
    $all('[data-bottom]').forEach(function (btn) {
      btn.addEventListener('click', function () { state.boutique.bottom = btn.getAttribute('data-bottom'); save(); updateDressing(); });
    });
  }

  function updateDressing() {
    var b = state.boutique;
    $all('[data-top]').forEach(function (el) { el.setAttribute('aria-pressed', String(el.getAttribute('data-top') === b.top)); });
    $all('[data-bottom]').forEach(function (el) { el.setAttribute('aria-pressed', String(el.getAttribute('data-bottom') === b.bottom)); });
    $('#dress-stage').innerHTML = O.character(b.top, b.bottom);
    var label;
    if (b.top && b.bottom) label = comboName(b.top + '-' + b.bottom) + ' ' + comboCode(b.top + '-' + b.bottom);
    else if (b.top) label = O.TOPS[b.top].name + ', pilih bawahan';
    else if (b.bottom) label = O.BOTTOMS[b.bottom].short + ', pilih atasan';
    else label = 'Pilih atasan dan bawahan';
    $('#dress-label').textContent = label;
  }

  var noticeTimer;
  function notice(kind, title, text, key) {
    var box = $('#notice-box');
    box.className = 'notice-box notice-' + kind;
    $('#notice-title').textContent = title;
    $('#notice-text').textContent = text;
    var p = key ? key.split('-') : null;
    $('#notice-fig').innerHTML = p ? O.character(p[0], p[1]) : '';
    $('#notice').hidden = false;
    void box.offsetWidth;
    box.classList.add('pop');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(hideNotice, kind === 'ok' ? 2400 : 2800);
  }
  function hideNotice() { clearTimeout(noticeTimer); $('#notice').hidden = true; }

  // Layar bergetar sebagai tanda pasangan sudah pernah dipilih.
  function shakeScreen() {
    if (reduceMotion()) return;
    var m = $('main');
    m.classList.remove('shake');
    void m.offsetWidth;
    m.classList.add('shake');
  }

  function saveSet() {
    var b = state.boutique;
    if (!b.top || !b.bottom) { sfx('error'); notice('warn', 'Belum lengkap', 'Pilih satu atasan dan satu bawahan dulu.'); return; }
    var key = b.top + '-' + b.bottom;
    if (b.saved[key]) {
      sfx('error');
      shakeScreen();
      notice('dup', 'Pasangan pakaian ini sudah kamu pilih!', comboName(key) + ' ' + comboCode(key) + ' sudah ada di tabel. Coba pasangan lain.', key);
      var cell = $('#cell-' + key);
      if (cell) { cell.classList.remove('flash'); void cell.offsetWidth; cell.classList.add('flash'); }
      return;
    }
    b.saved[key] = true;
    save();
    sfx('success');
    renderCross();
    updateStatuses();
    var n = savedCount();
    notice('ok', 'Pasangan pakaian tersimpan!', comboName(key) + ' ' + comboCode(key) + (n === COMBOS.length ? '. Tabel sudah lengkap. Aktivitas 2 sudah terbuka.' : '. ' + n + ' dari 6 pasangan tersimpan.'), key);
  }

  function renderCross() {
    $('#cross-table tbody').innerHTML = ['AG', 'AP', 'BK'].map(function (t) {
      return '<tr><th scope="row">' + O.TOPS[t].name + '</th>' + ['S', 'J'].map(function (bt) {
        var key = t + '-' + bt;
        if (state.boutique.saved[key]) {
          return '<td id="cell-' + key + '" class="filled"><div class="cell-fig">' + O.character(t, bt) + '</div><span class="cell-code">' + t + ', ' + code(bt) + '</span></td>';
        }
        return '<td id="cell-' + key + '">Belum diisi</td>';
      }).join('') + '</tr>';
    }).join('');
    var n = savedCount();
    $('#akt1-progress').textContent = n + ' dari 6';
    var done = n === COMBOS.length;
    $('#akt2-lock').hidden = done;
    $('#akt2').hidden = !done;
  }

  /* ---------- pasangan pakaian kesukaan ---------- */

  function buildFav() {
    $('#fav-choices').innerHTML = COMBOS.map(function (c) {
      return '<button type="button" class="fav-choice" role="radio" aria-checked="false" data-fav="' + c.key + '" data-sfx="select">' +
        '<span class="fav-fig">' + O.character(c.top, c.bottom) + '</span>' +
        '<span class="fav-code">' + comboCode(c.key) + '</span><span class="fav-name">' + comboName(c.key) + '</span></button>';
    }).join('');
    $all('[data-fav]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.answers.fav = btn.getAttribute('data-fav');
        pickFriend();
        save();
        renderFav();
        renderSim();
        updateStatuses();
      });
    });
  }

  // Pasangan teman dipilih acak sekali dari 5 pasangan lain, lalu tetap.
  // Diacak ulang hanya jika siswa mengganti kesukaannya menjadi pasangan teman.
  function pickFriend() {
    if (friend()) return;
    var others = COMBOS.filter(function (c) { return c.key !== fav(); });
    state.answers.friend = others[fairIndex(others.length)].key;
  }

  function renderFav() {
    var k = fav();
    $all('[data-fav]').forEach(function (el) { el.setAttribute('aria-checked', String(el.getAttribute('data-fav') === k)); });
    $all('.fav-ref').forEach(function (el) {
      if (!el.dataset.empty) el.dataset.empty = el.textContent;
      el.textContent = k ? comboName(k) + ' ' + comboCode(k) : el.dataset.empty;
    });
    $('#fav-note').innerHTML = k
      ? 'Pasangan kesukaanmu: <b>' + esc(comboName(k) + ' ' + comboCode(k)) + '</b>. Pasangan ini menjadi kejadian <i>A</i> di aktivitas berikutnya.'
      : 'Pilih satu pasangan pakaian. Pasangan ini menjadi kejadian <i>A</i> di aktivitas berikutnya.';
    var f = friend();
    $('#friend-ref').textContent = f ? comboName(f) + ' ' + comboCode(f) : '(pilih pasangan kesukaanmu dulu)';
    renderAkt4();
  }

  /* ---------- roda putar ---------- */

  function buildWheel() {
    var r = 100;
    var parts = [];
    COMBOS.forEach(function (c, i) {
      var a0 = (i * 60) * Math.PI / 180;
      var a1 = ((i + 1) * 60) * Math.PI / 180;
      var x0 = (r * Math.sin(a0)).toFixed(3), y0 = (-r * Math.cos(a0)).toFixed(3);
      var x1 = (r * Math.sin(a1)).toFixed(3), y1 = (-r * Math.cos(a1)).toFixed(3);
      var col = SECTOR[c.key];
      parts.push('<path d="M0,0 L' + x0 + ',' + y0 + ' A' + r + ',' + r + ' 0 0,1 ' + x1 + ',' + y1 + ' Z" fill="' + col.fill + '" stroke="#3A2318" stroke-width="2"/>');
      parts.push('<g transform="rotate(' + (i * 60 + 30) + ') translate(0,-64)"><text text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="17" fill="' + col.text + '"><tspan x="0" dy="-2">' + c.top + '</tspan><tspan x="0" dy="19">' + code(c.bottom) + '</tspan></text></g>');
    });
    var ring = '<circle r="104" fill="none" stroke="#D9A82E" stroke-width="8"/><circle r="108" fill="none" stroke="#3A2318" stroke-width="2"/>';
    var hub = '<circle r="16" fill="#D9A82E" stroke="#3A2318" stroke-width="2"/><circle r="6" fill="#7A1F2B"/>';
    $('#wheel').innerHTML = '<svg viewBox="-112 -112 224 224" role="img" aria-label="Roda putar enam pasangan pakaian dengan bagian sama besar">' + parts.join('') + ring + hub + '</svg>';
    setWheel(state.sim.rotation || 0, 0);
  }

  function setWheel(deg, ms) {
    var w = $('#wheel');
    w.style.transitionDuration = ms + 'ms';
    w.style.transform = 'rotate(' + deg + 'deg)';
  }

  // Bilangan acak 0..n-1 yang adil (rejection sampling di atas crypto).
  function fairIndex(n) {
    var c = window.crypto || window.msCrypto;
    if (c && c.getRandomValues) {
      var buf = new Uint8Array(1);
      var limit = 256 - (256 % n);
      do { c.getRandomValues(buf); } while (buf[0] >= limit);
      return buf[0] % n;
    }
    return Math.floor(Math.random() * n);
  }

  // Bunyi detak setiap kali batas sektor melewati penunjuk.
  function watchTicks(ms) {
    var wheel = $('#wheel');
    var lastSector = null;
    var lastTick = 0;
    var end = performance.now() + ms;
    (function frame(now) {
      var m = getComputedStyle(wheel).transform;
      var parts = m && m !== 'none' ? m.slice(m.indexOf('(') + 1, -1).split(',') : null;
      if (parts) {
        var ang = Math.atan2(Number(parts[1]), Number(parts[0])) * 180 / Math.PI;
        var sector = Math.floor((ang + 360) % 360 / 60);
        if (lastSector !== null && sector !== lastSector && now - lastTick > 45) { sfx('tick'); lastTick = now; }
        lastSector = sector;
      }
      if (now < end) requestAnimationFrame(frame);
    })(performance.now());
  }

  var spinning = false;

  function spinOnce(ms) {
    return new Promise(function (resolve) {
      var idx = fairIndex(COMBOS.length);
      // Sektor i berada di sudut [60i, 60i+60) searah jarum jam dari atas.
      // Roda diputar R derajat sehingga titik sudut target berada di bawah penunjuk.
      var target = idx * 60 + 30 + (fairIndex(41) - 20);
      var cur = state.sim.rotation || 0;
      var curMod = ((cur % 360) + 360) % 360;
      var want = (360 - target) % 360;
      var delta = ((want - curMod) + 360) % 360;
      var next = cur + (ms > 1000 ? 4 : 2) * 360 + delta;
      state.sim.rotation = next;
      sfx('spin');
      setWheel(next, ms);
      watchTicks(ms);
      setTimeout(function () {
        sfx('stop');
        record(COMBOS[idx].key);
        resolve();
      }, ms + 40);
    });
  }

  function record(key) {
    var sim = state.sim;
    if (sim.total >= N_TRIALS) return;
    sim.counts[key] += 1;
    sim.total += 1;
    sim.last = key;
    save();
    renderSim();
  }

  function renderSim() {
    var sim = state.sim;
    $('#stats-table tbody').innerHTML = COMBOS.map(function (c) {
      var star = fav() === c.key ? ' <span class="star" title="Pasangan kesukaanmu">★</span>' : '';
      return '<tr class="' + (sim.last === c.key ? 'hit' : '') + '"><td><span class="swatch" style="background:' + SECTOR[c.key].fill + '"></span>' + comboCode(c.key) + star + '</td><td class="num">' + sim.counts[c.key] + '</td></tr>';
    }).join('');
    $('#stats-total').textContent = sim.total;
    var p = sim.last ? sim.last.split('-') : [null, null];
    $('#spin-stage').innerHTML = O.character(p[0], p[1]);
    $('#spin-label').textContent = sim.last ? comboName(sim.last) : 'Belum ada hasil';
    $('#spin-result').textContent = sim.last
      ? 'Percobaan ke-' + sim.total + ' dari ' + N_TRIALS + ': ' + comboCode(sim.last)
      : 'Percobaan ke-0 dari ' + N_TRIALS;
    updateSpinButtons();
    renderFrTable();
    renderAkt4();
  }

  function updateSpinButtons() {
    $('#spin-once').disabled = spinning || state.sim.total >= N_TRIALS;
    $('#spin-auto').disabled = spinning;
    $('#spin-reset').disabled = spinning;
  }

  function resetSim() {
    var rot = state.sim.rotation || 0;
    state.sim = freshSim();
    state.sim.rotation = rot;
    state.sim300 = null;
    save();
    renderSim();
    renderBars();
    updateStatuses();
  }

  function bindSpin() {
    $('#spin-once').addEventListener('click', function () {
      if (spinning || state.sim.total >= N_TRIALS) return;
      spinning = true;
      updateSpinButtons();
      spinOnce(reduceMotion() ? 600 : 2600).then(function () {
        spinning = false;
        updateSpinButtons();
        updateStatuses();
        if (state.sim.total === N_TRIALS) toast('30 putaran selesai. Lanjutkan ke soal 4.2.');
      });
    });

    $('#spin-auto').addEventListener('click', function () {
      if (spinning) return;
      if (state.sim.total > 0 && !window.confirm('Data putaran akan dihapus, lalu roda diputar 30 kali dari awal. Lanjutkan?')) return;
      resetSim();
      spinning = true;
      updateSpinButtons();
      var step = reduceMotion() ? 250 : 650;
      (function loop() {
        if (state.sim.total >= N_TRIALS) {
          spinning = false;
          updateSpinButtons();
          updateStatuses();
          toast('30 putaran selesai. Lanjutkan ke soal 4.2.');
          return;
        }
        spinOnce(step).then(loop);
      })();
    });

    $('#spin-reset').addEventListener('click', function () {
      if (spinning) return;
      resetSim();
      toast('Data putaran sudah dihapus.');
    });

    $('#spin-300').addEventListener('click', function () {
      if (!simDone()) { toast('Selesaikan 30 putaran di 4.1 dulu.'); return; }
      var counts = {};
      COMBOS.forEach(function (c) { counts[c.key] = 0; });
      for (var i = 0; i < N_FAST; i++) counts[COMBOS[fairIndex(COMBOS.length)].key] += 1;
      state.sim300 = { counts: counts, total: N_FAST };
      save();
      sfx('stop');
      renderBars();
      updateStatuses();
    });
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- aktivitas 4 ---------- */

  function renderAkt4() {
    var ready = favReady();
    var lock = $('#fr-lock');
    lock.hidden = ready;
    lock.textContent = !fav() ? 'Pilih pasangan kesukaanmu di halaman Butik dulu.' : 'Putar roda sampai 30 kali untuk membuka soal 4.2 sampai 4.5.';
    $('#akt4-body').hidden = !ready;
    $('#cmp-fh').textContent = a('a31_res') || '…';
    $('#cmp-k').textContent = a('a42_k') || '…';
    $('#cmp-fr').textContent = a('a42_k') ? a('a42_k') + '/' + N_TRIALS : '…';
    var favCell = $('#fr-table .fr-fav');
    if (favCell) favCell.textContent = favFr();
  }
  function favFr() { return a('a42_num') && a('a42_den') ? frac('a42_num', 'a42_den') : 'isi di 4.2'; }

  function renderFrTable() {
    var sim = state.sim;
    var body = $('#fr-table tbody');
    body.innerHTML = COMBOS.map(function (c) {
      var isFav = fav() === c.key;
      var cell = isFav
        ? '<td class="fr-fav">' + esc(favFr()) + '</td>'
        : '<td><span class="frac-input">' +
          '<input type="text" inputmode="numeric" data-key="a43n_' + c.key + '" aria-label="Pembilang frekuensi relatif ' + comboCode(c.key) + '">' +
          '<span class="bar"></span>' +
          '<input type="text" inputmode="numeric" data-key="a43d_' + c.key + '" aria-label="Penyebut frekuensi relatif ' + comboCode(c.key) + '">' +
          '</span></td>';
      return '<tr' + (isFav ? ' class="fav-row"' : '') + '><td>' + comboCode(c.key) + (isFav ? ' <span class="star" title="Pasangan kesukaanmu">★</span>' : '') + '</td>' +
        '<td class="num">' + sim.counts[c.key] + '</td><td class="num">' + N_TRIALS + '</td>' + cell + '</tr>';
    }).join('');
    bindInputs(body);
    updateStatuses();
  }

  // Diagram batang: frekuensi relatif 30 putaran dan 300 putaran, dengan garis 1/6.
  function renderBars() {
    var box = $('#bars300');
    var q = $('#q45-box');
    if (!state.sim300) { box.hidden = true; q.hidden = true; return; }
    var max = 0.5;
    var line = (1 / 6) / max * 100;
    box.innerHTML = '<p class="bars-legend"><span><i class="key k30"></i>30 putaran</span><span><i class="key k300"></i>300 putaran</span><span><i class="key kline"></i>garis 1/6</span></p>' +
      COMBOS.map(function (c) {
        var f30 = state.sim.counts[c.key] / N_TRIALS;
        var f300 = state.sim300.counts[c.key] / N_FAST;
        var w = function (f) { return Math.min(100, f / max * 100).toFixed(1); };
        return '<div class="bar-row"><span class="bar-label">' + comboCode(c.key) + '</span><div class="bar-track" style="--mark:' + line.toFixed(1) + '%">' +
          '<span class="bar-line"><span class="bar-fill b30" style="width:' + w(f30) + '%"></span><span class="bar-val">' + comma(f30) + '</span></span>' +
          '<span class="bar-line"><span class="bar-fill b300" style="width:' + w(f300) + '%"></span><span class="bar-val">' + comma(f300) + '</span></span>' +
          '</div></div>';
      }).join('') +
      '<p class="hint">Nilai 1/6 kira-kira 0,17.</p>';
    box.hidden = false;
    q.hidden = false;
  }

  /* ---------- kunci pengumpulan pertama ---------- */

  function fmtWhen(ms) {
    var d = new Date(ms);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
      ' pukul ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  function renderLockUI() {
    var lock = myLock();
    $all('[data-lock-banner]').forEach(function (el) {
      el.hidden = !lock;
      if (lock) el.textContent = 'Nama ini sudah mengumpulkan pada ' + fmtWhen(lock.at) + '. Nilai akhirnya ' + lock.score + '. Kamu boleh berlatih lagi, tetapi nilai akhir tidak berubah.';
    });
    if (state.page === 6) { renderRecap(); renderSubmission(); }
  }

  // Hasil yang ditandai di daftar periksa: latihan terbaru jika ada, jika tidak pengumpulan pertama.
  function shownResults() {
    var lock = myLock();
    if (!lock) return null;
    var p = state.practice;
    if (p && p.id === idKey() && p.at > lock.at) return p.results;
    return lock.results;
  }

  function figure(key, cls) {
    if (!key) return '';
    var p = key.split('-');
    return '<figure class="' + cls + '">' + O.character(p[0], p[1]) + '<figcaption>' + esc(comboName(key)) + '<br>' + comboCode(key) + '</figcaption></figure>';
  }

  function renderRecap() {
    var results = shownResults();
    var html = '<div class="card recap-id"><div class="recap-head"><h2>Identitasmu</h2><button type="button" class="btn-edit" data-edit="1" data-focus="id_nama">Ubah</button></div>' +
      '<div class="recap-id-body"><ul class="recap-list">' +
      '<li><span>Nama lengkap</span><span>' + esc(a('id_nama') || '-') + '</span></li>' +
      '<li><span>Kelas/Semester</span><span>' + esc(a('id_kelas') || '-') + '</span></li>' +
      '<li><span>Nomor presensi</span><span>' + esc(a('id_no') || '-') + '</span></li>' +
      '<li><span>Tabel Aktivitas 1</span><span>' + savedCount() + ' dari 6 pasangan</span></li></ul>' +
      (fav() ? figure(fav(), 'recap-fav') : '<p class="status-empty">Pasangan kesukaan belum dipilih.</p>') +
      '</div></div>';

    html += '<div class="recap-grid">';
    GROUPS.forEach(function (g) {
      html += '<div class="card"><div class="recap-head"><h2>' + esc(g.title) + '</h2></div><ul class="recap-list">';
      groupItems(g).forEach(function (it) {
        var filled = itemFilled(it);
        var mark = '';
        var how = '';
        if (results && it.id in results) {
          mark = results[it.id] ? '<span class="mark mark-ok" title="Benar">✓</span>' : '<span class="mark mark-bad" title="Belum tepat">✗</span>';
          if (!results[it.id]) how = '<p class="cara"><b>Cara:</b> ' + esc(it.how) + '</p>';
        }
        var focus = it.keys[0] || '';
        html += '<li class="r-row"><span class="r-lbl">' + esc(it.label) + '</span><span class="r-ans">' +
          (filled ? esc(it.show()) : '<span class="status-empty">Belum diisi</span>') + mark + '</span>' +
          '<button type="button" class="btn-edit" data-edit="' + g.page + '"' + (focus ? ' data-focus="' + focus + '"' : '') + '>Ubah</button>' + how + '</li>';
      });
      html += '</ul></div>';
    });
    html += '<div class="card"><div class="recap-head"><h2>Jawaban Tertulis</h2></div><p class="hint">Bagian ini dinilai guru.</p><ul class="recap-list">' +
      WRITTEN.map(function (w) {
        return '<li class="r-row"><span class="r-lbl">' + esc(w.label) + '</span><span class="r-ans r-text">' +
          (a(w.key) ? esc(a(w.key)) : '<span class="status-empty">Belum ditulis</span>') + '</span>' +
          '<button type="button" class="btn-edit" data-edit="' + w.page + '" data-focus="' + w.key + '">Ubah</button></li>';
      }).join('') + '</ul></div>';
    html += '</div>';
    $('#recap').innerHTML = html;
    $all('#recap [data-edit]').forEach(function (b) {
      b.addEventListener('click', function () { showPage(Number(b.getAttribute('data-edit')), b.getAttribute('data-focus')); });
    });
  }

  function renderSubmission() {
    var lock = myLock();
    var box = $('#submit-result');
    $('#print-btn').disabled = !lock;
    if (!lock) {
      box.innerHTML = '<p>Jawabanmu belum dikumpulkan.</p>';
      $('#submit-btn').textContent = 'Kumpulkan Jawaban';
      return;
    }
    var html = '<p class="score">Nilai akhir: <b>' + lock.score + '</b> / 100</p>' +
      '<p>' + lock.correct + ' dari ' + lock.total + ' jawaban benar. Dikumpulkan ' + fmtWhen(lock.at) + '.</p>' +
      '<p>Soal yang belum tepat diberi tanda ✗ dan petunjuk <b>Cara</b>. Perbaiki jawabanmu, lalu tekan <b>Periksa Jawaban Latihan</b>.</p>';
    var p = state.practice;
    if (p && p.id === idKey() && p.at > lock.at) {
      html += '<p class="first-note">Hasil latihan terakhir: <b>' + p.score + '</b> / 100. Nilai akhirmu tetap <b>' + lock.score + '</b>.</p>';
    }
    if (lock.sent === 'ok') html += '<p class="status-ok">Hasil pertama sudah tercatat di data guru.</p>';
    else if (lock.sent === 'fail') html += '<p class="status-bad">Hasil gagal tercatat di data guru. Tetap kirim PDF ke WhatsApp gurumu.</p>';
    box.innerHTML = html;
    $('#submit-btn').textContent = 'Periksa Jawaban Latihan';
  }

  function openModal(title, bodyHtml, okLabel, cancelLabel, onOk) {
    var m = $('#modal');
    var okBtn = $('#modal-ok'), cancelBtn = $('#modal-cancel');
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = bodyHtml;
    okBtn.textContent = okLabel;
    cancelBtn.textContent = cancelLabel;
    m.hidden = false;
    okBtn.focus();
    function close() { m.hidden = true; okBtn.removeEventListener('click', ok); cancelBtn.removeEventListener('click', close); }
    function ok() { close(); onOk(); }
    okBtn.addEventListener('click', ok);
    cancelBtn.addEventListener('click', close);
  }

  function askSubmit() {
    if (!idKey()) {
      openModal('Identitas belum lengkap', '<p>Isi nama lengkap, kelas/semester, dan nomor presensi dulu.</p>', 'Isi Identitas', 'Tutup', function () { showPage(1, 'id_nama'); });
      return;
    }
    if (myLock()) { practice(); return; }
    var missing = [];
    GROUPS.forEach(function (g) {
      var n = groupItems(g).filter(function (it) { return !itemFilled(it); }).length;
      if (n) missing.push('<li>' + esc(g.title) + ': ' + n + ' belum diisi</li>');
    });
    var body = '<p><b>Kamu hanya bisa mengumpulkan satu kali.</b> Pengumpulan ini menjadi nilai akhirmu.</p>' +
      (missing.length ? '<p>Masih ada jawaban yang kosong:</p><ul>' + missing.join('') + '</ul>' : '<p>Semua jawaban sudah terisi.</p>');
    openModal('Kumpulkan jawaban?', body, 'Kumpulkan Sekarang', 'Periksa Dulu', submitFirst);
  }

  function submitFirst() {
    var ev = evaluate();
    var lock = JSON.parse(JSON.stringify({
      at: Date.now(),
      identity: { nama: a('id_nama'), kelas: a('id_kelas'), no: a('id_no') },
      results: ev.results,
      correct: ev.correct,
      total: ev.total,
      score: ev.score,
      answers: state.answers,
      saved: state.boutique.saved,
      sim: state.sim,
      sim300: state.sim300,
      sent: CFG.submitUrl ? 'sending' : null
    }));
    var key = idKey();
    locks[key] = lock;
    saveLocks();
    state.practice = null;
    save();
    sfx('submit');
    renderLockUI();
    renderRecap();
    renderSubmission();
    toast('Jawaban terkumpul. Nilai akhirmu ' + lock.score + '.');
    if (CFG.submitUrl) send(key);
  }

  // Latihan sesudah pengumpulan pertama: dinilai ulang, tetapi nilai akhir tetap.
  function practice() {
    var ev = evaluate();
    state.practice = { id: idKey(), at: Date.now(), results: ev.results, score: ev.score };
    save();
    sfx('submit');
    renderRecap();
    renderSubmission();
    toast('Hasil latihan ' + ev.score + '. Nilai akhirmu tetap ' + myLock().score + '.');
  }

  function newStudent() {
    openModal('Mulai sebagai siswa baru?', '<p>Jawaban yang sedang terbuka di perangkat ini akan dihapus. Hasil yang sudah dikumpulkan tetap tersimpan.</p>',
      'Ya, Mulai Baru', 'Batal', function () {
        state = freshState();
        save();
        window.location.reload();
      });
  }

  // Isi sementara state dengan salinan pengumpulan pertama, agar butir soal
  // membaca jawaban saat itu, lalu kembalikan.
  function withSnapshot(snap, fn) {
    var keep = { answers: state.answers, boutique: state.boutique, sim: state.sim, sim300: state.sim300 };
    state.answers = snap.answers;
    state.boutique = { top: null, bottom: null, saved: snap.saved };
    state.sim = snap.sim;
    state.sim300 = snap.sim300;
    try { return fn(); } finally {
      state.answers = keep.answers;
      state.boutique = keep.boutique;
      state.sim = keep.sim;
      state.sim300 = keep.sim300;
    }
  }

  /* ---------- PDF ---------- */

  // PDF dibuat langsung di browser (jsPDF) lalu diunduh, tanpa dialog cetak.
  // Library dimuat saat tombol pertama kali ditekan agar halaman tetap ringan.
  var pdfLibs = null;
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var el = document.createElement('script');
      el.src = src;
      el.onload = resolve;
      el.onerror = reject;
      document.head.appendChild(el);
    });
  }
  function loadPdfLibs() {
    if (!pdfLibs) {
      pdfLibs = loadScript('vendor/jspdf/jspdf.umd.min.js')
        .then(function () { return loadScript('vendor/jspdf/jspdf.plugin.autotable.min.js'); })
        .catch(function (e) { pdfLibs = null; throw e; });
    }
    return pdfLibs;
  }

  // Gambar pasangan kesukaan diubah dari SVG ke JPEG agar bisa masuk PDF dengan ukuran kecil.
  function svgToImg(svg, w, h) {
    return new Promise(function (resolve) {
      var src = svg.replace('<svg ', '<svg width="' + w + '" height="' + h + '" ');
      var img = new Image();
      img.onload = function () {
        var cv = document.createElement('canvas');
        cv.width = w;
        cv.height = h;
        var ctx = cv.getContext('2d');
        ctx.fillStyle = '#FCE9C8';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(cv.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = function () { resolve(null); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
    });
  }

  var MAROON = [122, 31, 43];
  var INK = [58, 35, 24];
  var HEAD = { fillColor: MAROON, textColor: [255, 244, 226] };

  function makePdf(lock, favPng) {
    return withSnapshot(lock, function () {
      var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
      var W = 210, M = 14;

      doc.setFillColor(122, 31, 43);
      doc.rect(0, 0, W, 27, 'F');
      doc.setFillColor(217, 168, 46);
      doc.rect(0, 27, W, 1.8, 'F');
      doc.setTextColor(255, 244, 226);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Hasil Pengumpulan Pertama', M, 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text('Butik Warisan Sriwijaya - E-LKPD Matematika Kelas VIII', M, 17.5);
      doc.text('Dikumpulkan ' + fmtWhen(lock.at), M, 23);

      var bx = W - M - 38, by = 34;
      doc.setDrawColor(122, 31, 43);
      doc.setLineWidth(0.8);
      doc.setFillColor(255, 251, 243);
      doc.roundedRect(bx, by, 38, 30, 3, 3, 'FD');
      doc.setTextColor(58, 35, 24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Nilai akhir', bx + 19, by + 7, { align: 'center' });
      doc.setTextColor(122, 31, 43);
      doc.setFontSize(24);
      doc.text(String(lock.score), bx + 19, by + 19, { align: 'center' });
      doc.setTextColor(58, 35, 24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(lock.correct + ' dari ' + lock.total + ' benar', bx + 19, by + 26, { align: 'center' });

      if (favPng) doc.addImage(favPng, 'JPEG', bx + 5, by + 33, 28, 39.5);

      doc.autoTable({
        startY: 33,
        margin: { left: M, right: M + 44 },
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1.4, textColor: INK },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 38 } },
        body: [
          ['Nama lengkap', lock.identity.nama || '-'],
          ['Kelas/Semester', lock.identity.kelas || '-'],
          ['Nomor presensi', lock.identity.no || '-'],
          ['Pasangan kesukaan', fav() ? comboName(fav()) + ' ' + comboCode(fav()) : '-'],
          ['Pasangan teman (2.2)', friend() ? comboName(friend()) + ' ' + comboCode(friend()) : '-'],
          ['Tabel Aktivitas 1', savedCount() + ' dari 6 pasangan']
        ]
      });
      var y = Math.max(doc.lastAutoTable.finalY, by + 76) + 4;

      GROUPS.forEach(function (g) {
        if (y > 255) { doc.addPage(); y = 16; }
        doc.autoTable({
          startY: y,
          margin: { left: M, right: M },
          head: [[g.title, 'Jawaban', 'Hasil']],
          body: groupItems(g).map(function (it) {
            var shown = itemFilled(it) || !it.keys.length ? it.show() : '(kosong)';
            return [it.label, shown, lock.results[it.id] ? 'Benar' : 'Salah'];
          }),
          styles: { fontSize: 9.5, cellPadding: 1.8, textColor: INK },
          headStyles: HEAD,
          columnStyles: { 0: { cellWidth: 78 }, 2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' } },
          didParseCell: function (d) {
            if (d.section === 'body' && d.column.index === 2) d.cell.styles.textColor = d.cell.raw === 'Benar' ? [47, 107, 58] : [163, 39, 27];
          }
        });
        y = doc.lastAutoTable.finalY + 5;
      });

      doc.autoTable({
        startY: y,
        margin: { left: M, right: M },
        head: [['Jawaban tertulis (dinilai guru)', 'Jawaban siswa']],
        body: WRITTEN.map(function (w) { return [w.label, a(w.key) || '(kosong)']; }),
        styles: { fontSize: 9.5, cellPadding: 1.8, textColor: INK },
        headStyles: HEAD,
        columnStyles: { 0: { cellWidth: 70 } }
      });
      y = doc.lastAutoTable.finalY + 5;

      doc.autoTable({
        startY: y,
        margin: { left: M, right: M },
        head: [['Data roda putar', 'Muncul dari 30', 'Muncul dari 300']],
        body: COMBOS.map(function (c) {
          return [comboName(c.key) + ' ' + comboCode(c.key), String(state.sim.counts[c.key]), state.sim300 ? String(state.sim300.counts[c.key]) : '-'];
        }),
        styles: { fontSize: 9.5, cellPadding: 1.8, textColor: INK },
        headStyles: HEAD,
        columnStyles: { 1: { cellWidth: 32, halign: 'center' }, 2: { cellWidth: 32, halign: 'center' } }
      });
      y = doc.lastAutoTable.finalY + 5;

      doc.autoTable({
        startY: y,
        margin: { left: M, right: M },
        head: [['Refleksi (tidak dinilai)', 'Jawaban siswa']],
        body: REFLECT.map(function (r) { return [r.label, (r.choice ? MCQ.ref3[a(r.key)] : a(r.key)) || '(kosong)']; }),
        styles: { fontSize: 9.5, cellPadding: 1.8, textColor: INK },
        headStyles: HEAD,
        columnStyles: { 0: { cellWidth: 70 } }
      });
      y = doc.lastAutoTable.finalY + 10;

      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.setTextColor(58, 35, 24);
      doc.text('Paraf Guru:', M, y);
      doc.setDrawColor(58, 35, 24);
      doc.setLineWidth(0.3);
      doc.line(M + 22, y + 1, M + 80, y + 1);
      doc.setFont('helvetica', 'bold');
      doc.text('Kirim file PDF ini ke WhatsApp gurumu.', M, y + 9);
      return doc;
    });
  }

  function pdfName(lock) {
    var g = (lock.identity.nama || 'siswa').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'siswa';
    return 'Hasil-ELKPD-' + g + '.pdf';
  }

  function downloadPdf() {
    var lock = myLock();
    if (!lock) { toast('Kumpulkan jawaban dulu, lalu unduh PDF.'); return; }
    var btn = $('#print-btn');
    btn.disabled = true;
    btn.textContent = 'Membuat PDF…';
    var fk = lock.answers.fav;
    var p = fk ? fk.split('-') : null;
    loadPdfLibs()
      .then(function () { return p ? svgToImg(O.character(p[0], p[1]), 440, 620) : null; })
      .then(function (png) {
        var name = pdfName(lock);
        makePdf(lock, png).save(name);
        toast('PDF diunduh: ' + name + '. Kirim ke WhatsApp gurumu.');
      })
      .catch(function () { toast('PDF gagal dibuat. Periksa koneksi internet, lalu coba lagi.'); })
      .then(function () {
        btn.disabled = !myLock();
        btn.textContent = 'Unduh PDF';
      });
  }

  // Hanya pengumpulan pertama yang dikirim ke Google Sheet guru.
  // Google Apps Script menerima teks JSON; mode no-cors menghindari preflight.
  function send(key) {
    var lock = locks[key];
    var payload = {
      waktu: new Date(lock.at).toISOString(),
      nama: lock.identity.nama,
      kelas: lock.identity.kelas,
      presensi: lock.identity.no,
      skor: lock.score,
      benar: lock.correct,
      total: lock.total,
      kesimpulan: lock.answers.k_text || '',
      pasanganKesukaan: lock.answers.fav || '',
      pasanganTeman: lock.answers.friend || '',
      jawaban: lock.answers,
      hasilButir: lock.results,
      tabelAktivitas1: Object.keys(lock.saved),
      simulasi: lock.sim.counts
    };
    fetch(CFG.submitUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function () { lock.sent = 'ok'; })
      .catch(function () { lock.sent = 'fail'; })
      .then(function () { saveLocks(); renderSubmission(); });
  }

  /* ---------- mulai ---------- */

  function init() {
    buildJawab();
    renderTex();
    buildAsks();
    buildWardrobe();
    buildWheel();
    buildFav();
    bindInputs(document);
    updateDressing();
    renderCross();
    renderSim();
    renderBars();
    if (fav()) pickFriend();
    renderFav();
    renderLockUI();
    updateStatuses();

    $('#cover-a').innerHTML = coverSvgs[0];
    $('#cover-caption').textContent = comboName(COMBOS[0].key);

    $all('.tab').forEach(function (t) { t.addEventListener('click', function () { showPage(Number(t.getAttribute('data-page'))); }); });
    $all('[data-go]').forEach(function (b) { b.addEventListener('click', function () { showPage(Number(b.getAttribute('data-go'))); }); });
    $('#mnav-page').addEventListener('change', function (e) { showPage(Number(e.target.value)); });
    $('#mnav-prev').addEventListener('click', function () { showPage(state.page - 1); });
    $('#mnav-next').addEventListener('click', function () { showPage(state.page + 1); });
    $('#save-set').addEventListener('click', saveSet);
    $('#notice-close').addEventListener('click', hideNotice);
    $('#submit-btn').addEventListener('click', askSubmit);
    $('#print-btn').addEventListener('click', downloadPdf);
    $('#new-student').addEventListener('click', newStudent);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('#modal').hidden) $('#modal-cancel').click();
      else if (!$('#notice').hidden) hideNotice();
    });
    bindSpin();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopCover(); else if (state.page === 1) startCover();
    });

    showPage(state.page || 1);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

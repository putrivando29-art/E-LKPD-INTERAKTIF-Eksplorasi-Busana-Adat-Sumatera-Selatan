(function () {
  'use strict';

  var O = window.Outfits;
  var CFG = window.ELKPD_CONFIG || {};
  var COMBOS = O.combos();
  var N_TRIALS = 20;
  var STORE_KEY = 'stylist-studio-palembang-v1';
  var MEMBER_ROWS = 5;

  // Warna sektor roda dan swatch tabel statistik
  var SECTOR = {
    'AG-S': { fill: '#7A1F2B', text: '#FFF4E2' },
    'AG-J': { fill: '#D9A82E', text: '#3A2318' },
    'AP-S': { fill: '#B5482F', text: '#FFF4E2' },
    'AP-J': { fill: '#FFF3DC', text: '#7A1F2B' },
    'BH-S': { fill: '#6B3E26', text: '#FFF4E2' },
    'BH-J': { fill: '#2B1E1A', text: '#F3D57E' }
  };

  function sfx(name) { if (window.Sfx) window.Sfx.play(name); }

  /* ---------- state & penyimpanan sesi ---------- */

  function freshSim() {
    var counts = {};
    COMBOS.forEach(function (c) { counts[c.key] = 0; });
    return { counts: counts, total: 0, last: null, rotation: 0 };
  }

  var state = load() || { page: 1, answers: {}, boutique: { top: null, bottom: null, saved: {} }, sim: freshSim() };
  state.submission = state.submission || null;

  function load() {
    try {
      var raw = window.sessionStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function save() {
    try { window.sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* penyimpanan tidak tersedia */ }
  }

  // Setiap perubahan jawaban setelah dikumpulkan ditandai agar siswa tahu perlu mengumpulkan ulang.
  function touched() {
    if (state.submission && !state.submission.changed) state.submission.changed = true;
    save();
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function comboName(key) {
    var p = key.split('-');
    return O.TOPS[p[0]].name + ' + ' + O.BOTTOMS[p[1]].short;
  }
  function comboCode(key) { var p = key.split('-'); return '(' + p[0] + ', ' + p[1] + ')'; }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; });
  }

  /* ---------- toast ---------- */

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  /* ---------- rumus (KaTeX) ---------- */

  function renderTex(root) {
    $all('.tex', root).forEach(function (el) {
      var tex = el.getAttribute('data-tex');
      if (window.katex) {
        window.katex.render(tex, el, { throwOnError: false, displayMode: el.getAttribute('data-display') === '1' });
      } else {
        el.textContent = tex.replace(/\\[dt]?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2').replace(/\\times/g, '×').replace(/[{}\\]/g, '');
      }
    });
  }

  /* ---------- navigasi halaman ---------- */

  function showPage(n, focusKey) {
    state.page = n;
    save();
    $all('.page').forEach(function (p) { p.hidden = Number(p.getAttribute('data-page')) !== n; });
    $all('.tab').forEach(function (t) {
      if (Number(t.getAttribute('data-page')) === n) {
        t.setAttribute('aria-current', 'page');
        var bar = t.parentNode;
        bar.scrollLeft = t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2;
      } else t.removeAttribute('aria-current');
    });
    if (n === 1) startCover(); else stopCover();
    if (n === 4) renderFrTable();
    if (n === 5) { renderRecap(); renderSubmission(); }
    var target = focusKey && $('[data-key="' + focusKey + '"]');
    if (target) {
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

  /* ---------- identitas ---------- */

  function buildMembers() {
    var html = '';
    for (var i = 1; i <= MEMBER_ROWS; i++) {
      html += '<tr><td>' + i + '</td>' +
        '<td><input type="text" data-key="id_m' + i + '_nama" aria-label="Nama anggota ' + i + '" autocomplete="off"></td>' +
        '<td><input type="text" inputmode="numeric" data-key="id_m' + i + '_no" aria-label="Nomor presensi anggota ' + i + '" autocomplete="off"></td></tr>';
    }
    $('#member-rows').innerHTML = html;
  }

  /* ---------- isian jawaban ---------- */

  function bindInputs(root) {
    $all('[data-key]', root).forEach(function (el) {
      if (el.dataset.bound) return;
      el.dataset.bound = '1';
      var key = el.getAttribute('data-key');
      if (el.type === 'radio') {
        el.checked = state.answers[key] === el.value;
        el.addEventListener('change', function () { state.answers[key] = el.value; touched(); updateStatuses(); });
      } else {
        if (state.answers[key] != null) el.value = state.answers[key];
        el.addEventListener('input', function () { state.answers[key] = el.value; touched(); updateStatuses(); });
      }
    });
  }

  /* ---------- kunci jawaban & penilaian ---------- */

  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/\s+/g, ' ').replace(/,/g, '.');
    var m;
    if ((m = s.match(/^(\d+) (\d+)\/(\d+)$/))) return Number(m[3]) === 0 ? NaN : Number(m[1]) + Number(m[2]) / Number(m[3]);
    if ((m = s.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/))) return Number(m[2]) === 0 ? NaN : Number(m[1]) / Number(m[2]);
    if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
    return NaN;
  }
  function a(key) { return state.answers[key] == null ? '' : String(state.answers[key]).trim(); }
  function isInt(key, n) { return a(key) === String(n); }
  function fracEq(numKey, denKey, tNum, tDen) {
    var num = a(numKey), den = a(denKey);
    if (!/^\d+$/.test(num) || !/^\d+$/.test(den) || Number(den) === 0) return false;
    return Number(num) * tDen === Number(den) * tNum;
  }
  function near(key, target, tol) { var v = parseNum(a(key)); return !isNaN(v) && Math.abs(v - target) <= tol; }
  function frac(numKey, denKey) { return (a(numKey) || '…') + '/' + (a(denKey) || '…'); }
  function val(key) { return a(key) || '…'; }

  var MCQ = {
    a34_1: { a: 'Ya, semuanya sama persis.', b: 'Tidak, ada yang berbeda.' },
    a34_2: { a: 'Roda spin tidak adil.', b: 'Hasil setiap putaran acak dan percobaan hanya 20 kali.', c: 'Peluang teoretisnya salah dihitung.' },
    a34_3: { a: 'Hasil percobaan selalu sama dengan peluang teoretis.', b: 'Frekuensi relatif bisa berbeda, tetapi cenderung mendekati 1/6 jika percobaan diperbanyak.', c: 'Pasangan yang paling sering muncul pasti memiliki peluang teoretis terbesar.' }
  };

  // Setiap butir: id, judul, kunci isian, tampilan jawaban, dan aturan benar.
  var GROUPS = [
    { id: 'apersepsi', title: 'Apersepsi', page: 2, items: [
      { id: 'ap1', label: 'Sederhanakan 2/6', keys: ['ap1_num', 'ap1_den'], show: function () { return frac('ap1_num', 'ap1_den'); }, ok: function () { return isInt('ap1_num', 1) && isInt('ap1_den', 3); } },
      { id: 'ap2', label: '60 × 1/6', keys: ['ap2'], show: function () { return val('ap2'); }, ok: function () { return near('ap2', 10, 1e-9); } },
      { id: 'ap3', label: '3 × 2', keys: ['ap3'], show: function () { return val('ap3'); }, ok: function () { return isInt('ap3', 6); } }
    ] },
    { id: 'akt1', title: 'Aktivitas 1', page: 3, items: [
      { id: 'tabel', label: 'Tabel ruang sampel', keys: [], filled: function () { return savedCount() === COMBOS.length; }, show: function () { return savedCount() + ' dari 6 pasangan'; }, ok: function () { return savedCount() === COMBOS.length; } },
      { id: 'a1_nS', label: 'n(S)', keys: ['a1_nS'], show: function () { return val('a1_nS'); }, ok: function () { return isInt('a1_nS', 6); } },
      { id: 'a1_nA', label: 'n(A)', keys: ['a1_nA'], show: function () { return val('a1_nA'); }, ok: function () { return isInt('a1_nA', 1); } }
    ] },
    { id: 'akt2', title: 'Aktivitas 2', page: 3, items: [
      { id: 'a2_nA', label: 'n(A)', keys: ['a2_nA'], show: function () { return val('a2_nA'); }, ok: function () { return isInt('a2_nA', 1); } },
      { id: 'a2_nS', label: 'n(S)', keys: ['a2_nS'], show: function () { return val('a2_nS'); }, ok: function () { return isInt('a2_nS', 6); } },
      { id: 'a2_p', label: 'P(A)', keys: ['a2_pNum', 'a2_pDen'], show: function () { return frac('a2_pNum', 'a2_pDen'); }, ok: function () { return fracEq('a2_pNum', 'a2_pDen', 1, 6); } },
      { id: 'a2_q', label: 'Peluang satu pasangan tertentu', keys: ['a2_qNum', 'a2_qDen'], show: function () { return frac('a2_qNum', 'a2_qDen'); }, ok: function () { return fracEq('a2_qNum', 'a2_qDen', 1, 6); } }
    ] },
    { id: 'akt31', title: 'Aktivitas 3.1', page: 4, items: [
      { id: 'a31_N', label: 'N', keys: ['a31_N'], show: function () { return val('a31_N'); }, ok: function () { return isInt('a31_N', N_TRIALS); } },
      { id: 'a31_p', label: 'P(A)', keys: ['a31_pNum', 'a31_pDen'], show: function () { return frac('a31_pNum', 'a31_pDen'); }, ok: function () { return fracEq('a31_pNum', 'a31_pDen', 1, 6); } },
      { id: 'a31_res', label: 'Frekuensi harapan', keys: ['a31_res'], show: function () { return val('a31_res'); }, ok: function () { return near('a31_res', N_TRIALS / 6, 0.006); } }
    ] },
    { id: 'akt33', title: 'Aktivitas 3.2 dan 3.3', page: 4, items: [
      { id: 'sim', label: 'Banyak percobaan', keys: [], filled: function () { return state.sim.total === N_TRIALS; }, show: function () { return state.sim.total + ' dari 20'; }, ok: function () { return state.sim.total === N_TRIALS; } }
    ].concat(COMBOS.map(function (c) {
      return { id: 'a33_' + c.key, label: 'Fr ' + comboCode(c.key) + ', k = ' + state.sim.counts[c.key], dynamicLabel: true, keys: ['a33_' + c.key],
        show: function () { return val('a33_' + c.key); },
        ok: function () { return state.sim.total === N_TRIALS && near('a33_' + c.key, state.sim.counts[c.key] / N_TRIALS, 1e-6); } };
    })) },
    { id: 'akt34', title: 'Aktivitas 3.4', page: 4, items: [
      { id: 'a34_1', label: 'Pertanyaan 1', keys: ['a34_1'], show: function () { return MCQ.a34_1[a('a34_1')] || '…'; }, ok: function () { return a('a34_1') === 'b'; } },
      { id: 'a34_2', label: 'Pertanyaan 2', keys: ['a34_2'], show: function () { return MCQ.a34_2[a('a34_2')] || '…'; }, ok: function () { return a('a34_2') === 'b'; } },
      { id: 'a34_3', label: 'Pertanyaan 3', keys: ['a34_3'], show: function () { return MCQ.a34_3[a('a34_3')] || '…'; }, ok: function () { return a('a34_3') === 'b'; } }
    ] }
  ];

  function itemLabel(it) {
    if (!it.dynamicLabel) return it.label;
    var key = it.id.replace('a33_', '');
    return 'Fr ' + comboCode(key) + ', k = ' + state.sim.counts[key];
  }
  function itemFilled(it) {
    if (it.filled) return it.filled();
    return it.keys.every(function (k) { return a(k) !== ''; });
  }
  function allItems() {
    var list = [];
    GROUPS.forEach(function (g) { g.items.forEach(function (it) { list.push(it); }); });
    return list;
  }

  // Status terisi per aktivitas, tanpa membuka benar atau salah.
  function updateStatuses() {
    var map = { apersepsi: ['apersepsi'], akt1: ['akt1'], akt2: ['akt2'], akt31: ['akt31'], akt33: ['akt33'], akt34: ['akt34'] };
    $all('[data-status]').forEach(function (el) {
      var gid = el.getAttribute('data-status');
      var items = [];
      GROUPS.forEach(function (g) { if (map[gid].indexOf(g.id) >= 0) items = items.concat(g.items.filter(function (it) { return it.keys.length; })); });
      var done = items.filter(itemFilled).length;
      el.textContent = 'Terisi ' + done + ' dari ' + items.length + '. Jawaban bisa diubah kapan saja sebelum dikumpulkan.';
      el.classList.toggle('is-done', done === items.length);
    });
  }

  /* ---------- butik digital ---------- */

  function buildWardrobe() {
    $('#top-choices').innerHTML = ['AG', 'AP', 'BH'].map(function (t) {
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

  function saveSet() {
    var b = state.boutique;
    if (!b.top || !b.bottom) { sfx('error'); toast('Pilih satu atasan dan satu bawahan dulu.'); return; }
    var key = b.top + '-' + b.bottom;
    if (b.saved[key]) {
      sfx('error');
      toast('Pasangan pakaian ini sudah kamu pilih!');
      var cell = $('#cell-' + key);
      if (cell) { cell.classList.remove('flash'); void cell.offsetWidth; cell.classList.add('flash'); }
      return;
    }
    b.saved[key] = true;
    touched();
    sfx('success');
    renderCross();
    updateStatuses();
    var n = savedCount();
    toast(n === COMBOS.length ? 'Keenam pasangan lengkap! Aktivitas 2 sudah terbuka.' : 'Tersimpan: ' + comboCode(key) + '. ' + n + ' dari 6 pasangan.');
  }

  function savedCount() { return COMBOS.filter(function (c) { return state.boutique.saved[c.key]; }).length; }

  function renderCross() {
    $('#cross-table tbody').innerHTML = ['AG', 'AP', 'BH'].map(function (t) {
      return '<tr><th scope="row">' + O.TOPS[t].name + '</th>' + ['S', 'J'].map(function (bt) {
        var key = t + '-' + bt;
        if (state.boutique.saved[key]) {
          return '<td id="cell-' + key + '" class="filled"><div class="cell-fig">' + O.character(t, bt) + '</div><span class="cell-code">' + t + ', ' + bt + '</span></td>';
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

  /* ---------- roda spin ---------- */

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
      parts.push('<g transform="rotate(' + (i * 60 + 30) + ') translate(0,-64)"><text text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="17" fill="' + col.text + '"><tspan x="0" dy="-2">' + c.top + '</tspan><tspan x="0" dy="19">' + c.bottom + '</tspan></text></g>');
    });
    var ring = '<circle r="104" fill="none" stroke="#D9A82E" stroke-width="8"/><circle r="108" fill="none" stroke="#3A2318" stroke-width="2"/>';
    var hub = '<circle r="16" fill="#D9A82E" stroke="#3A2318" stroke-width="2"/><circle r="6" fill="#7A1F2B"/>';
    $('#wheel').innerHTML = '<svg viewBox="-112 -112 224 224" role="img" aria-label="Roda spin enam pasangan pakaian dengan sektor sama besar">' + parts.join('') + ring + hub + '</svg>';
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
    touched();
    renderSim();
  }

  function renderSim() {
    var sim = state.sim;
    $('#stats-table tbody').innerHTML = COMBOS.map(function (c) {
      return '<tr class="' + (sim.last === c.key ? 'hit' : '') + '"><td><span class="swatch" style="background:' + SECTOR[c.key].fill + '"></span>' + comboCode(c.key) + '</td><td class="num">' + sim.counts[c.key] + '</td></tr>';
    }).join('');
    $('#stats-total').textContent = sim.total;
    var p = sim.last ? sim.last.split('-') : [null, null];
    $('#spin-stage').innerHTML = O.character(p[0], p[1]);
    $('#spin-label').textContent = sim.last ? comboName(sim.last) : 'Belum ada hasil';
    $('#spin-result').textContent = sim.last
      ? 'Percobaan ke-' + sim.total + ' dari 20: ' + comboCode(sim.last)
      : 'Percobaan ke-0 dari 20';
    updateSpinButtons();
    renderFrTable();
  }

  function updateSpinButtons() {
    $('#spin-once').disabled = spinning || state.sim.total >= N_TRIALS;
    $('#spin-20').disabled = spinning;
    $('#spin-reset').disabled = spinning;
  }

  function resetSim() {
    var rot = state.sim.rotation || 0;
    state.sim = freshSim();
    state.sim.rotation = rot;
    touched();
    renderSim();
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
        if (state.sim.total === N_TRIALS) toast('20 percobaan selesai! Lanjutkan ke bagian 3.3.');
      });
    });

    $('#spin-20').addEventListener('click', function () {
      if (spinning) return;
      if (state.sim.total > 0 && !window.confirm('Data percobaan akan diulang dari nol, lalu roda diputar 20 kali. Lanjutkan?')) return;
      resetSim();
      spinning = true;
      updateSpinButtons();
      var step = reduceMotion() ? 250 : 650;
      (function loop() {
        if (state.sim.total >= N_TRIALS) {
          spinning = false;
          updateSpinButtons();
          updateStatuses();
          toast('20 percobaan selesai! Lanjutkan ke bagian 3.3.');
          return;
        }
        spinOnce(step).then(loop);
      })();
    });

    $('#spin-reset').addEventListener('click', function () {
      if (spinning) return;
      resetSim();
      toast('Data simulasi direset ke nol.');
    });
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function renderFrTable() {
    var sim = state.sim;
    var ready = sim.total === N_TRIALS;
    $('#fr-lock').hidden = ready;
    var body = $('#fr-table tbody');
    body.innerHTML = COMBOS.map(function (c) {
      return '<tr><td>' + comboCode(c.key) + '</td><td class="num">' + (ready ? sim.counts[c.key] : '–') + '</td><td class="num">20</td>' +
        '<td><input type="text" inputmode="decimal" data-key="a33_' + c.key + '" aria-label="Frekuensi relatif ' + comboCode(c.key) + '"' + (ready ? '' : ' disabled') + '></td></tr>';
    }).join('');
    bindInputs(body);
  }

  /* ---------- periksa & kumpulkan ---------- */

  function renderRecap() {
    var sub = state.submission;
    var results = sub ? sub.results : null;
    var members = [];
    for (var i = 1; i <= MEMBER_ROWS; i++) {
      var nm = a('id_m' + i + '_nama');
      if (nm) members.push('<li><span>' + esc(nm) + '</span><span>No. ' + esc(a('id_m' + i + '_no') || '-') + '</span></li>');
    }
    var html = '<div class="card"><div class="recap-head"><h2>Identitas</h2><button type="button" class="btn-edit" data-edit="1" data-focus="id_kelompok">Ubah</button></div><ul class="recap-list">' +
      '<li><span>Nama kelompok</span><span>' + esc(a('id_kelompok') || '-') + '</span></li>' +
      '<li><span>Kelas/Semester</span><span>' + esc(a('id_kelas') || '-') + '</span></li>' +
      (members.join('') || '<li><span>Anggota</span><span class="status-empty">Belum diisi</span></li>') + '</ul></div>';

    html += '<div class="recap-grid">';
    GROUPS.forEach(function (g) {
      html += '<div class="card"><div class="recap-head"><h2>' + g.title + '</h2></div><ul class="recap-list">';
      g.items.forEach(function (it) {
        var filled = itemFilled(it);
        var mark = '';
        if (results && it.id in results) mark = results[it.id] ? '<span class="mark mark-ok" title="Benar">✓</span>' : '<span class="mark mark-bad" title="Belum tepat">✗</span>';
        var focus = it.keys[0] || (it.id === 'tabel' ? '' : '');
        html += '<li><span>' + esc(itemLabel(it)) + '</span><span class="ans">' +
          (filled ? esc(it.show()) : '<span class="status-empty">Belum diisi</span>') + mark +
          '<button type="button" class="btn-edit" data-edit="' + g.page + '"' + (focus ? ' data-focus="' + focus + '"' : '') + '>Ubah</button></span></li>';
      });
      html += '</ul></div>';
    });
    html += '<div class="card"><div class="recap-head"><h2>Kesimpulan Kelompok</h2><button type="button" class="btn-edit" data-edit="4" data-focus="a34_text">Ubah</button></div><p>' +
      (a('a34_text') ? esc(a('a34_text')) : '<span class="status-empty">Belum ditulis</span>') + '</p></div>';
    html += '</div>';
    $('#recap').innerHTML = html;
    $all('#recap [data-edit]').forEach(function (b) {
      b.addEventListener('click', function () { showPage(Number(b.getAttribute('data-edit')), b.getAttribute('data-focus')); });
    });
  }

  function renderSubmission() {
    var sub = state.submission;
    var box = $('#submit-result');
    if (!sub) {
      box.innerHTML = '<p>Jawaban belum dikumpulkan. Kamu masih bisa mengubah semua jawaban.</p>';
      $('#submit-btn').textContent = 'Kumpulkan Jawaban';
      return;
    }
    var when = new Date(sub.at);
    var html = '<p class="score">Skor: <b>' + sub.score + '</b> / 100</p>' +
      '<p>' + sub.correct + ' dari ' + sub.total + ' jawaban benar. Dikumpulkan ' + when.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
      ' pukul ' + when.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' (pengumpulan ke-' + sub.count + ').</p>';
    if (sub.sent === 'ok') html += '<p class="status-ok">Jawaban sudah dikirim ke guru.</p>';
    else if (sub.sent === 'fail') html += '<p class="status-bad">Jawaban gagal dikirim. Simpan sebagai PDF sebagai cadangan.</p>';
    if (sub.changed) html += '<p class="status-bad">Ada jawaban yang diubah setelah dikumpulkan. Tekan Kumpulkan Ulang untuk memperbarui.</p>';
    box.innerHTML = html;
    $('#submit-btn').textContent = 'Kumpulkan Ulang';
  }

  function openModal(title, bodyHtml, onOk) {
    var m = $('#modal');
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = bodyHtml;
    m.hidden = false;
    $('#modal-ok').focus();
    function close() { m.hidden = true; okBtn.removeEventListener('click', ok); cancelBtn.removeEventListener('click', close); }
    function ok() { close(); onOk(); }
    var okBtn = $('#modal-ok'), cancelBtn = $('#modal-cancel');
    okBtn.addEventListener('click', ok);
    cancelBtn.addEventListener('click', close);
  }

  function askSubmit() {
    var missing = [];
    GROUPS.forEach(function (g) {
      var n = g.items.filter(function (it) { return !itemFilled(it); }).length;
      if (n) missing.push('<li>' + g.title + ': ' + n + ' belum diisi</li>');
    });
    var body = missing.length
      ? '<p>Masih ada jawaban yang kosong:</p><ul>' + missing.join('') + '</ul><p>Tetap kumpulkan sekarang?</p>'
      : '<p>Semua jawaban sudah terisi. Setelah dikumpulkan, skor akan ditampilkan.</p>';
    openModal('Kumpulkan jawaban?', body, submit);
  }

  function submit() {
    var results = {};
    var correct = 0;
    var items = allItems();
    items.forEach(function (it) { var ok = !!it.ok(); results[it.id] = ok; if (ok) correct += 1; });
    var prev = state.submission;
    state.submission = {
      at: Date.now(),
      count: prev ? prev.count + 1 : 1,
      correct: correct,
      total: items.length,
      score: Math.round(correct / items.length * 100),
      results: results,
      changed: false,
      sent: CFG.submitUrl ? 'sending' : null
    };
    save();
    sfx('submit');
    renderRecap();
    renderSubmission();
    if (CFG.submitUrl) send();
  }

  // Google Apps Script menerima teks JSON; mode no-cors menghindari preflight.
  function send() {
    var members = [];
    for (var i = 1; i <= MEMBER_ROWS; i++) {
      if (a('id_m' + i + '_nama')) members.push(a('id_m' + i + '_nama') + ' (' + (a('id_m' + i + '_no') || '-') + ')');
    }
    var sub = state.submission;
    var payload = {
      waktu: new Date(sub.at).toISOString(),
      kelompok: a('id_kelompok'),
      kelas: a('id_kelas'),
      anggota: members.join('; '),
      skor: sub.score,
      benar: sub.correct,
      total: sub.total,
      pengumpulanKe: sub.count,
      kesimpulan: a('a34_text'),
      jawaban: state.answers,
      hasilButir: sub.results,
      tabelAktivitas1: Object.keys(state.boutique.saved),
      simulasi: state.sim.counts
    };
    fetch(CFG.submitUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function () { sub.sent = 'ok'; })
      .catch(function () { sub.sent = 'fail'; })
      .then(function () { save(); renderSubmission(); });
  }

  /* ---------- mulai ---------- */

  function init() {
    renderTex();
    buildMembers();
    buildWardrobe();
    buildWheel();
    bindInputs(document);
    updateDressing();
    renderCross();
    renderSim();
    updateStatuses();

    $('#cover-a').innerHTML = coverSvgs[0];
    $('#cover-caption').textContent = comboName(COMBOS[0].key);

    $all('.tab').forEach(function (t) { t.addEventListener('click', function () { showPage(Number(t.getAttribute('data-page'))); }); });
    $all('[data-go]').forEach(function (b) { b.addEventListener('click', function () { showPage(Number(b.getAttribute('data-go'))); }); });
    $('#save-set').addEventListener('click', saveSet);
    $('#submit-btn').addEventListener('click', askSubmit);
    $('#print-btn').addEventListener('click', function () { renderRecap(); window.print(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#modal').hidden) $('#modal-cancel').click(); });
    bindSpin();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopCover(); else if (state.page === 1) startCover();
    });

    showPage(state.page || 1);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

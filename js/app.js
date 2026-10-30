(function () {
  'use strict';

  var O = window.Outfits;
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

  /* ---------- state & penyimpanan sesi ---------- */

  function freshSim() {
    var counts = {};
    COMBOS.forEach(function (c) { counts[c.key] = 0; });
    return { counts: counts, total: 0, last: null, rotation: 0 };
  }

  var state = load() || { page: 1, answers: {}, boutique: { top: null, bottom: null, saved: {} }, sim: freshSim(), checks: {} };

  function load() {
    try {
      var raw = window.sessionStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function save() {
    try { window.sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* penyimpanan tidak tersedia */ }
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function comboName(key) {
    var p = key.split('-');
    return O.TOPS[p[0]].name + ' + ' + O.BOTTOMS[p[1]].short;
  }
  function comboCode(key) { var p = key.split('-'); return '(' + p[0] + ', ' + p[1] + ')'; }

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

  function renderTex() {
    $all('.tex').forEach(function (el) {
      var tex = el.getAttribute('data-tex');
      if (window.katex) {
        window.katex.render(tex, el, { throwOnError: false, displayMode: el.getAttribute('data-display') === '1' });
      } else {
        el.textContent = tex.replace(/\\[dt]?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2').replace(/\\times/g, '×').replace(/[{}\\]/g, '');
      }
    });
  }

  /* ---------- navigasi halaman ---------- */

  function showPage(n) {
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
    if (n === 5) renderRecap();
    window.scrollTo(0, 0);
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
    var body = $('#member-rows');
    var html = '';
    for (var i = 1; i <= MEMBER_ROWS; i++) {
      html += '<tr><td>' + i + '</td>' +
        '<td><input type="text" data-key="id_m' + i + '_nama" aria-label="Nama anggota ' + i + '" autocomplete="off"></td>' +
        '<td><input type="text" inputmode="numeric" data-key="id_m' + i + '_no" aria-label="Nomor presensi anggota ' + i + '" autocomplete="off"></td></tr>';
    }
    body.innerHTML = html;
  }

  /* ---------- isian jawaban ---------- */

  function bindInputs(root) {
    $all('[data-key]', root).forEach(function (el) {
      if (el.dataset.bound) return;
      el.dataset.bound = '1';
      var key = el.getAttribute('data-key');
      if (el.type === 'radio') {
        el.checked = state.answers[key] === el.value;
        el.addEventListener('change', function () { state.answers[key] = el.value; save(); clearMarks(el.closest('[data-group]') || el.closest('.card')); });
      } else {
        if (state.answers[key] != null) el.value = state.answers[key];
        el.addEventListener('input', function () { state.answers[key] = el.value; el.classList.remove('ok', 'bad'); save(); });
      }
    });
  }

  function clearMarks(root) {
    if (!root) return;
    $all('.mcq', root).forEach(function (f) { f.classList.remove('ok', 'bad'); });
  }

  /* ---------- pemeriksaan jawaban ---------- */

  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/\s+/g, ' ').replace(/,/g, '.');
    var m;
    if ((m = s.match(/^(\d+) (\d+)\/(\d+)$/))) return Number(m[3]) === 0 ? NaN : Number(m[1]) + Number(m[2]) / Number(m[3]);
    if ((m = s.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/))) return Number(m[2]) === 0 ? NaN : Number(m[1]) / Number(m[2]);
    if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
    return NaN;
  }
  function isInt(s, n) { return String(s == null ? '' : s).trim() === String(n); }
  function fracEq(num, den, tNum, tDen) {
    var a = Number(String(num).trim()), b = Number(String(den).trim());
    if (!/^\d+$/.test(String(num).trim()) || !/^\d+$/.test(String(den).trim()) || b === 0) return false;
    return a * tDen === b * tNum;
  }
  function near(s, target, tol) { var v = parseNum(s); return !isNaN(v) && Math.abs(v - target) <= tol; }
  function a(key) { return state.answers[key] == null ? '' : String(state.answers[key]).trim(); }

  // Setiap item: kunci isian yang terlibat dan fungsi benar/salah.
  function items(group) {
    switch (group) {
      case 'apersepsi': return [
        { keys: ['ap1_num', 'ap1_den'], ok: function () { return isInt(a('ap1_num'), 1) && isInt(a('ap1_den'), 4); } },
        { keys: ['ap2'], ok: function () { return near(a('ap2'), 5, 1e-9); } },
        { keys: ['ap3'], ok: function () { return isInt(a('ap3'), 6); } }
      ];
      case 'akt1': return [
        { keys: ['a1_nS'], ok: function () { return isInt(a('a1_nS'), 6); } },
        { keys: ['a1_nA'], ok: function () { return isInt(a('a1_nA'), 1); } }
      ];
      case 'akt2': return [
        { keys: ['a2_nA'], ok: function () { return isInt(a('a2_nA'), 1); } },
        { keys: ['a2_nS'], ok: function () { return isInt(a('a2_nS'), 6); } },
        { keys: ['a2_pNum', 'a2_pDen'], ok: function () { return fracEq(a('a2_pNum'), a('a2_pDen'), 1, 6); } },
        { keys: ['a2_qNum', 'a2_qDen'], ok: function () { return fracEq(a('a2_qNum'), a('a2_qDen'), 1, 6); } }
      ];
      case 'akt31': return [
        { keys: ['a31_N'], ok: function () { return isInt(a('a31_N'), N_TRIALS); } },
        { keys: ['a31_pNum', 'a31_pDen'], ok: function () { return fracEq(a('a31_pNum'), a('a31_pDen'), 1, 6); } },
        { keys: ['a31_res'], ok: function () { return near(a('a31_res'), N_TRIALS / 6, 0.006); } }
      ];
      case 'akt33': return COMBOS.map(function (c) {
        return { keys: ['a33_' + c.key], ok: function () { return state.sim.total === N_TRIALS && near(a('a33_' + c.key), state.sim.counts[c.key] / N_TRIALS, 1e-6); } };
      });
      case 'akt34': return [
        { keys: ['a34_1'], radio: true, ok: function () { return a('a34_1') === 'b'; } },
        { keys: ['a34_2'], radio: true, ok: function () { return a('a34_2') === 'b'; } },
        { keys: ['a34_3'], radio: true, ok: function () { return a('a34_3') === 'b'; } }
      ];
    }
    return [];
  }

  function evaluate(group) {
    var list = items(group);
    var filled = list.every(function (it) { return it.keys.every(function (k) { return a(k) !== ''; }); });
    var correct = list.filter(function (it) { return it.ok(); }).length;
    return { list: list, filled: filled, correct: correct, total: list.length };
  }

  function runCheck(group) {
    var fb = $('[data-feedback="' + group + '"]');
    if (group === 'akt33' && state.sim.total !== N_TRIALS) {
      fb.className = 'feedback bad';
      fb.textContent = 'Selesaikan 20 percobaan dulu.';
      return;
    }
    var r = evaluate(group);
    if (!r.filled) {
      fb.className = 'feedback bad';
      fb.textContent = 'Isi semua jawaban dulu, ya.';
      return;
    }
    r.list.forEach(function (it) {
      var good = it.ok();
      if (it.radio) {
        var fs = $('input[name="' + it.keys[0] + '"]').closest('.mcq');
        fs.classList.toggle('ok', good);
        fs.classList.toggle('bad', !good);
      } else {
        it.keys.forEach(function (k) {
          var el = $('[data-key="' + k + '"]');
          if (!el) return;
          el.classList.toggle('ok', good);
          el.classList.toggle('bad', !good);
        });
      }
    });
    state.checks[group] = { correct: r.correct, total: r.total };
    save();
    if (r.correct === r.total) {
      fb.className = 'feedback ok';
      fb.textContent = 'Semua jawaban benar!';
    } else {
      fb.className = 'feedback bad';
      fb.textContent = (r.total - r.correct) + ' jawaban belum tepat. Periksa kotak merah, lalu coba lagi.';
    }
  }

  /* ---------- butik digital ---------- */

  function buildWardrobe() {
    var tops = $('#top-choices');
    var bottoms = $('#bottom-choices');
    tops.innerHTML = ['AG', 'AP', 'BH'].map(function (t) {
      return '<button type="button" class="choice" data-top="' + t + '" aria-pressed="false">' +
        '<span class="thumb-top">' + O.character(t, null, { view: 'bust' }) + '</span>' + O.TOPS[t].name + '</button>';
    }).join('');
    bottoms.innerHTML = ['S', 'J'].map(function (b) {
      return '<button type="button" class="choice" data-bottom="' + b + '" aria-pressed="false">' +
        '<span class="thumb-kain">' + O.kainCard(b) + '</span>' + O.BOTTOMS[b].name + '</button>';
    }).join('');
    $all('[data-top]', tops).forEach(function (btn) {
      btn.addEventListener('click', function () { state.boutique.top = btn.getAttribute('data-top'); save(); updateDressing(); });
    });
    $all('[data-bottom]', bottoms).forEach(function (btn) {
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
    if (!b.top || !b.bottom) { toast('Pilih satu atasan dan satu bawahan dulu.'); return; }
    var key = b.top + '-' + b.bottom;
    if (b.saved[key]) {
      toast('Pasangan pakaian ini sudah kamu pilih!');
      var cell = $('#cell-' + key);
      if (cell) { cell.classList.remove('flash'); void cell.offsetWidth; cell.classList.add('flash'); }
      return;
    }
    b.saved[key] = true;
    save();
    renderCross();
    var n = savedCount();
    toast(n === COMBOS.length ? 'Keenam pasangan lengkap! Aktivitas 2 sudah terbuka.' : 'Tersimpan: ' + comboCode(key) + '. ' + n + ' dari 6 pasangan.');
  }

  function savedCount() { return COMBOS.filter(function (c) { return state.boutique.saved[c.key]; }).length; }

  function renderCross() {
    var body = $('#cross-table tbody');
    body.innerHTML = ['AG', 'AP', 'BH'].map(function (t) {
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
      var mid = i * 60 + 30;
      var col = SECTOR[c.key];
      parts.push('<path d="M0,0 L' + x0 + ',' + y0 + ' A' + r + ',' + r + ' 0 0,1 ' + x1 + ',' + y1 + ' Z" fill="' + col.fill + '" stroke="#3A2318" stroke-width="2"/>');
      parts.push('<g transform="rotate(' + mid + ') translate(0,-64)"><text text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="700" font-size="17" fill="' + col.text + '"><tspan x="0" dy="-2">' + c.top + '</tspan><tspan x="0" dy="19">' + c.bottom + '</tspan></text></g>');
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

  var spinning = false;

  function spinOnce(ms) {
    return new Promise(function (resolve) {
      var idx = fairIndex(COMBOS.length);
      // Sektor i berada di sudut [60i, 60i+60) searah jarum jam dari atas.
      // Roda diputar R derajat sehingga titik sudut target berada di bawah penunjuk.
      var jitter = (fairIndex(41) - 20);
      var target = idx * 60 + 30 + jitter;
      var cur = state.sim.rotation || 0;
      var curMod = ((cur % 360) + 360) % 360;
      var want = (360 - target) % 360;
      var delta = ((want - curMod) + 360) % 360;
      var turns = ms > 1000 ? 4 : 2;
      var next = cur + turns * 360 + delta;
      state.sim.rotation = next;
      setWheel(next, ms);
      setTimeout(function () {
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
    var body = $('#stats-table tbody');
    body.innerHTML = COMBOS.map(function (c) {
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
    var full = state.sim.total >= N_TRIALS;
    $('#spin-once').disabled = spinning || full;
    $('#spin-20').disabled = spinning;
    $('#spin-reset').disabled = spinning;
  }

  function resetSim() {
    var rot = state.sim.rotation || 0;
    state.sim = freshSim();
    state.sim.rotation = rot;
    delete state.checks.akt33;
    var fb = $('[data-feedback="akt33"]');
    fb.textContent = '';
    fb.className = 'feedback';
    $all('#fr-table input').forEach(function (el) { el.classList.remove('ok', 'bad'); });
    save();
    renderSim();
  }

  function bindSpin() {
    $('#spin-once').addEventListener('click', function () {
      if (spinning) return;
      if (state.sim.total >= N_TRIALS) { toast('Percobaan sudah 20 kali. Tekan Reset Data untuk mengulang.'); return; }
      spinning = true;
      updateSpinButtons();
      spinOnce(reduceMotion() ? 600 : 2600).then(function () {
        spinning = false;
        updateSpinButtons();
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

  /* ---------- rekap ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; });
  }

  function statusText(group) {
    var r = evaluate(group);
    if (group === 'akt33' && state.sim.total !== N_TRIALS) return '<span class="status-empty">Percobaan belum 20 kali</span>';
    if (!r.filled) return '<span class="status-empty">Belum lengkap</span>';
    var cls = r.correct === r.total ? 'status-ok' : 'status-bad';
    return '<span class="' + cls + '">Benar ' + r.correct + ' dari ' + r.total + '</span>';
  }

  function renderRecap() {
    var members = [];
    for (var i = 1; i <= MEMBER_ROWS; i++) {
      var nm = a('id_m' + i + '_nama');
      if (nm) members.push('<li><span>' + esc(nm) + '</span><span>No. ' + esc(a('id_m' + i + '_no') || '-') + '</span></li>');
    }
    var sim = state.sim;
    var simRows = COMBOS.map(function (c) {
      var fr = a('a33_' + c.key);
      return '<li><span>' + comboCode(c.key) + ' k = ' + sim.counts[c.key] + '</span><span>Fr = ' + (fr ? esc(fr) : '-') + '</span></li>';
    }).join('');
    var html =
      '<div class="recap-grid">' +
      '<div class="card"><h2>Identitas</h2><ul class="recap-list">' +
      '<li><span>Nama kelompok</span><span>' + esc(a('id_kelompok') || '-') + '</span></li>' +
      '<li><span>Kelas/Semester</span><span>' + esc(a('id_kelas') || '-') + '</span></li>' +
      (members.join('') || '<li><span>Anggota</span><span>-</span></li>') + '</ul></div>' +
      '<div class="card"><h2>Hasil Aktivitas</h2><ul class="recap-list">' +
      '<li><span>Apersepsi</span>' + statusText('apersepsi') + '</li>' +
      '<li><span>Aktivitas 1: pasangan tersimpan</span><span>' + savedCount() + ' dari 6</span></li>' +
      '<li><span>Aktivitas 1: n(S) dan n(A)</span>' + statusText('akt1') + '</li>' +
      '<li><span>Aktivitas 2: peluang teoretis</span>' + statusText('akt2') + '</li>' +
      '<li><span>Aktivitas 3.1: frekuensi harapan</span>' + statusText('akt31') + '</li>' +
      '<li><span>Aktivitas 3.3: frekuensi relatif</span>' + statusText('akt33') + '</li>' +
      '<li><span>Aktivitas 3.4: perbandingan</span>' + statusText('akt34') + '</li>' +
      '</ul></div>' +
      '<div class="card"><h2>Data Percobaan (N = ' + sim.total + ')</h2><ul class="recap-list">' + simRows + '</ul></div>' +
      '<div class="card"><h2>Kesimpulan Kelompok</h2><p>' + (a('a34_text') ? esc(a('a34_text')) : '<span class="status-empty">Belum ditulis</span>') + '</p></div>' +
      '</div>';
    $('#recap').innerHTML = html;
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

    $('#cover-a').innerHTML = coverSvgs[0];
    $('#cover-caption').textContent = comboName(COMBOS[0].key);

    $all('.tab').forEach(function (t) { t.addEventListener('click', function () { showPage(Number(t.getAttribute('data-page'))); }); });
    $all('[data-go]').forEach(function (b) { b.addEventListener('click', function () { showPage(Number(b.getAttribute('data-go'))); }); });
    $all('[data-check]').forEach(function (b) { b.addEventListener('click', function () { runCheck(b.getAttribute('data-check')); }); });
    $('#save-set').addEventListener('click', saveSet);
    $('#print-btn').addEventListener('click', function () { renderRecap(); window.print(); });
    bindSpin();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopCover(); else if (state.page === 1) startCover();
    });

    showPage(state.page || 1);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

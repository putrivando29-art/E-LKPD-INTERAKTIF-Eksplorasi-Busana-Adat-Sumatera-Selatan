/*
 * Efek suara (disintesis dengan Web Audio, tanpa file) dan musik latar
 * (file rekaman dari ELKPD_CONFIG.musicSrc, diputar berulang).
 */
(function () {
  'use strict';

  var cfg = window.ELKPD_CONFIG || {};
  var PREF_KEY = 'stylist-studio-audio';
  var prefs = { music: true, musicVol: 25, sfx: true, sfxVol: 60 };

  try {
    var saved = JSON.parse(window.localStorage.getItem(PREF_KEY) || 'null');
    if (saved) for (var k in prefs) if (k in saved) prefs[k] = saved[k];
  } catch (e) { /* penyimpanan tidak tersedia */ }

  function savePrefs() {
    try { window.localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { /* abaikan */ }
  }

  /* ---------- efek suara ---------- */

  var ctx = null;
  var bus = null;

  function audioCtx() {
    if (!ctx) {
      var A = window.AudioContext || window.webkitAudioContext;
      if (!A) return null;
      ctx = new A();
      bus = ctx.createGain();
      bus.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    bus.gain.value = prefs.sfxVol / 100;
    return ctx;
  }

  function tone(freq, at, dur, type, vol, freqEnd) {
    var t0 = ctx.currentTime + at;
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(bus);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function whoosh(dur, vol) {
    var t0 = ctx.currentTime;
    var len = Math.floor(ctx.sampleRate * dur);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(400, t0);
    bp.frequency.exponentialRampToValueAtTime(2400, t0 + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(bus);
    src.start(t0);
  }

  var SOUNDS = {
    click: function () { tone(880, 0, 0.06, 'sine', 0.22, 620); },
    select: function () { tone(660, 0, 0.09, 'triangle', 0.26); tone(990, 0.07, 0.13, 'triangle', 0.22); },
    success: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * 0.08, 0.24, 'triangle', 0.26); });
    },
    error: function () { tone(330, 0, 0.14, 'square', 0.1); tone(220, 0.15, 0.24, 'square', 0.1); },
    spin: function () { whoosh(0.5, 0.25); },
    tick: function () { tone(1600, 0, 0.025, 'square', 0.05); },
    stop: function () { tone(1318.5, 0, 0.9, 'sine', 0.22); tone(1975.5, 0.02, 0.7, 'sine', 0.09); },
    submit: function () {
      [523.25, 659.25, 783.99].forEach(function (f, i) { tone(f, i * 0.12, 0.2, 'triangle', 0.24); });
      tone(1046.5, 0.36, 0.6, 'triangle', 0.28);
      tone(1318.5, 0.36, 0.6, 'sine', 0.12);
    }
  };

  var QUIET = { tick: true };

  function play(name) {
    if (!prefs.sfx || !SOUNDS[name]) return;
    if (!audioCtx()) return;
    SOUNDS[name]();
    if (!QUIET[name]) duck();
  }

  /* ---------- musik latar ---------- */

  var music = null;
  var musicReady = false;
  var duckTimer = null;
  var duckFactor = 1;

  function applyMusicVolume() {
    if (music) music.volume = Math.min(1, (prefs.musicVol / 100) * duckFactor);
  }

  // Musik dikecilkan sebentar saat efek suara berbunyi agar tidak bertumpuk.
  function duck() {
    if (!music || music.paused) return;
    duckFactor = 0.35;
    applyMusicVolume();
    clearTimeout(duckTimer);
    duckTimer = setTimeout(function () { duckFactor = 1; applyMusicVolume(); }, 450);
  }

  function startMusic() {
    if (!musicReady || !prefs.music || document.hidden) return;
    applyMusicVolume();
    var p = music.play();
    if (p && p.catch) p.catch(function () { /* menunggu interaksi pengguna */ });
  }
  function stopMusic() { if (music) music.pause(); }

  function setupMusic() {
    if (!cfg.musicSrc) { markMusicMissing(); return; }
    music = new Audio();
    music.loop = true;
    music.preload = 'auto';
    music.addEventListener('canplaythrough', function () {
      if (musicReady) return;
      musicReady = true;
      $('#music-on').disabled = false;
      $('#music-vol').disabled = false;
      $('#music-note').hidden = true;
      if (userInteracted) startMusic();
    });
    music.addEventListener('error', markMusicMissing);
    music.src = cfg.musicSrc;
  }

  function markMusicMissing() {
    musicReady = false;
    $('#music-on').disabled = true;
    $('#music-vol').disabled = true;
    $('#music-note').hidden = false;
  }

  /* ---------- panel kontrol ---------- */

  function $(s) { return document.querySelector(s); }

  var userInteracted = false;

  function bindPanel() {
    var toggle = $('#sound-toggle');
    var panel = $('#sound-panel');
    toggle.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      play('click');
    });
    document.addEventListener('click', function (e) {
      if (!panel.hidden && !e.target.closest('.sound')) {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    var mOn = $('#music-on'), mVol = $('#music-vol'), sOn = $('#sfx-on'), sVol = $('#sfx-vol');
    mOn.checked = prefs.music;
    mVol.value = prefs.musicVol;
    sOn.checked = prefs.sfx;
    sVol.value = prefs.sfxVol;
    mOn.disabled = true;
    mVol.disabled = true;

    mOn.addEventListener('change', function () {
      prefs.music = mOn.checked;
      savePrefs();
      if (prefs.music) startMusic(); else stopMusic();
    });
    mVol.addEventListener('input', function () { prefs.musicVol = Number(mVol.value); savePrefs(); applyMusicVolume(); });
    sOn.addEventListener('change', function () { prefs.sfx = sOn.checked; savePrefs(); play('click'); });
    sVol.addEventListener('input', function () { prefs.sfxVol = Number(sVol.value); savePrefs(); });
    sVol.addEventListener('change', function () { play('click'); });
  }

  function init() {
    bindPanel();
    setupMusic();

    // Browser baru mengizinkan suara setelah ada interaksi pertama.
    var firstGesture = function () {
      userInteracted = true;
      audioCtx();
      startMusic();
      document.removeEventListener('pointerdown', firstGesture, true);
      document.removeEventListener('keydown', firstGesture, true);
    };
    document.addEventListener('pointerdown', firstGesture, true);
    document.addEventListener('keydown', firstGesture, true);

    // Bunyi klik untuk semua elemen interaktif, kecuali yang punya bunyi sendiri.
    document.addEventListener('click', function (e) {
      var el = e.target.closest('button, a, input[type="radio"], input[type="checkbox"]');
      if (!el || el.disabled) return;
      var name = el.getAttribute('data-sfx');
      if (name === 'none') return;
      play(name || 'click');
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopMusic(); else if (userInteracted) startMusic();
    });
  }

  window.Sfx = { play: play };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

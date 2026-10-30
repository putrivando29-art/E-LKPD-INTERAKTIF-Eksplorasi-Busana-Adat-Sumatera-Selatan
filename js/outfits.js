/*
 * Ilustrasi SVG karakter chibi dan busana adat perempuan Palembang.
 * Setiap komponen busana mengacu pada sumber yang dicatat di informasi-media.html.
 * Bagian yang bentuknya tidak dijelaskan rinci oleh sumber digambar sederhana
 * dan ditandai "disederhanakan" di informasi-media.html.
 */
(function (global) {
  'use strict';

  var C = {
    line: '#3B2416',
    skin: '#F6D8B4',
    skinShade: '#E3B68C',
    blush: '#F3A592',
    mouth: '#9C4436',
    eye: '#2B1A12',
    iris: '#6E3B22',
    hair: '#2A1A14',
    hairHi: '#4F3427',
    gold: '#D9A82E',
    goldDk: '#8C6412',
    goldLt: '#F3D57E',
    maroon: '#7A1F2B',
    red: '#B3202E',
    redDk: '#86141F',
    bata: '#B5482F',
    bataDk: '#8E3420',
    cream: '#FFF3DC',
    ivory: '#FFFBF2',
    brown: '#6B3E26',
    brownLt: '#8B5A3C',
    plum: '#4E2A5A',
    plumDk: '#341A3E',
    plumHi: '#68407A',
    melati: '#FFFFFF',
    permata: '#C0182B',
    shoe: '#5A3320',
    mannequin: '#E3DED5',
    mannequinDk: '#C4BCAE'
  };

  var TOPS = {
    AG: { code: 'AG', name: 'Aesan Gede' },
    AP: { code: 'AP', name: 'Aesan Paksangko' },
    BK: { code: 'BK', name: 'Baju Kurung Palembang' }
  };
  var BOTTOMS = {
    S: { code: 'S', name: 'Songket Palembang', short: 'Songket' },
    J: { code: 'J', name: 'Tenun Jumputan Palembang', short: 'Jumputan' }
  };

  // Satu kain jumputan merah tua yang sama untuk semua atasan.
  var JUMPUTAN = { base: '#7E1C2A', halo: '#9D3B46', dot: C.cream };

  var uidCounter = 0;
  function uid() { uidCounter += 1; return 'ss' + uidCounter; }

  function attrs(o) {
    var s = '';
    for (var k in o) { if (o[k] !== undefined && o[k] !== null) s += ' ' + k + '="' + o[k] + '"'; }
    return s;
  }
  function path(d, fill, stroke, sw, extra) {
    return '<path' + attrs(Object.assign({ d: d, fill: fill || 'none', stroke: stroke || 'none', 'stroke-width': sw, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, extra || {})) + '/>';
  }
  function circle(cx, cy, r, fill, stroke, sw) {
    return '<circle' + attrs({ cx: cx, cy: cy, r: r, fill: fill || 'none', stroke: stroke || 'none', 'stroke-width': sw }) + '/>';
  }
  function ellipse(cx, cy, rx, ry, fill, stroke, sw, extra) {
    return '<ellipse' + attrs(Object.assign({ cx: cx, cy: cy, rx: rx, ry: ry, fill: fill || 'none', stroke: stroke || 'none', 'stroke-width': sw }, extra || {})) + '/>';
  }

  /* ---------- pola kain ---------- */

  function defs(id) {
    var j = JUMPUTAN;
    // Songket lepus: benang emas rapat menutupi hampir seluruh permukaan kain.
    var lepus =
      '<pattern id="' + id + '-lepus" width="10" height="10" patternUnits="userSpaceOnUse">' +
      '<rect width="10" height="10" fill="' + C.maroon + '"/>' +
      '<path d="M5,0.8 L9.2,5 L5,9.2 L0.8,5 Z" fill="' + C.gold + '"/>' +
      '<path d="M5,3 L7,5 L5,7 L3,5 Z" fill="' + C.maroon + '"/>' +
      '<circle cx="5" cy="5" r="0.9" fill="' + C.goldLt + '"/>' +
      '</pattern>';
    // Jumputan bintik tujuh: satu titik besar dikelilingi titik kecil dalam satu lingkaran.
    function unit(cx, cy) {
      var s = circle(cx, cy, 7.2, j.halo) + circle(cx, cy, 6.2, 'none', j.dot, 0.9) + circle(cx, cy, 2.1, j.dot);
      for (var i = 0; i < 6; i++) {
        var a = (Math.PI / 3) * i;
        s += circle((cx + Math.cos(a) * 4.3).toFixed(2), (cy + Math.sin(a) * 4.3).toFixed(2), 0.95, j.dot);
      }
      return s;
    }
    var jump =
      '<pattern id="' + id + '-jump" width="30" height="30" patternUnits="userSpaceOnUse">' +
      '<rect width="30" height="30" fill="' + j.base + '"/>' + unit(7.5, 7.5) + unit(22.5, 22.5) +
      '</pattern>';
    // Taburan bintang emas pada dodot / baju kurung pengantin.
    function stars(pid, bg) {
      return '<pattern id="' + id + '-' + pid + '" width="14" height="14" patternUnits="userSpaceOnUse">' +
        '<rect width="14" height="14" fill="' + bg + '"/>' +
        star(3.5, 3.5, 2.2, C.gold) + star(10.5, 10.5, 2.2, C.gold) +
        '</pattern>';
    }
    return '<defs>' + lepus + jump + stars('starAG', C.red) + stars('starAP', C.bata) +
      '<clipPath id="' + id + '-kain"><path d="' + KAIN_D + '"/></clipPath></defs>';
  }

  function star(cx, cy, r, fill) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var rad = i % 2 === 0 ? r : r * 0.45;
      var a = -Math.PI / 2 + (Math.PI / 5) * i;
      pts.push((cx + Math.cos(a) * rad).toFixed(2) + ',' + (cy + Math.sin(a) * rad).toFixed(2));
    }
    return '<polygon points="' + pts.join(' ') + '" fill="' + fill + '"/>';
  }

  function flower(cx, cy, r, fill, center) {
    var s = '';
    for (var i = 0; i < 5; i++) {
      var a = -Math.PI / 2 + (2 * Math.PI / 5) * i;
      s += circle((cx + Math.cos(a) * r).toFixed(2), (cy + Math.sin(a) * r).toFixed(2), r * 0.72, fill, C.goldDk, 0.6);
    }
    return s + circle(cx, cy, r * 0.55, center || C.goldLt, C.goldDk, 0.5);
  }

  /* ---------- kain (bawahan) ---------- */

  var KAIN_D = 'M84,214 C100,211 120,211 136,214 L143,289 Q110,296 77,289 Z';

  function kain(id, bottom) {
    if (bottom === 'S') {
      // Pada kain perempuan, tumpal (kepala kain) berada di depan dari pinggul
      // hingga mata kaki; tepi kain bermotif pucuk rebung (segitiga).
      var tumpal = '<rect x="100" y="210" width="20" height="90" fill="' + C.maroon + '"/>';
      for (var y = 216; y < 286; y += 9) {
        tumpal += path('M100,' + y + ' L109,' + (y + 4.5) + ' L100,' + (y + 9) + ' Z', C.gold);
        tumpal += path('M120,' + y + ' L111,' + (y + 4.5) + ' L120,' + (y + 9) + ' Z', C.gold);
      }
      tumpal += path('M100,210 L100,300 M120,210 L120,300', 'none', C.goldLt, 1.4);
      var hem = '<rect x="70" y="279" width="80" height="12" fill="' + C.maroon + '"/>';
      for (var x = 72; x < 148; x += 6) hem += path('M' + x + ',290 L' + (x + 3) + ',281 L' + (x + 6) + ',290 Z', C.gold);
      return '<g clip-path="url(#' + id + '-kain)">' +
        '<rect x="70" y="205" width="80" height="95" fill="url(#' + id + '-lepus)"/>' + tumpal + hem +
        '</g>' + path(KAIN_D, 'none', C.line, 2.4) +
        path('M86,222 Q110,218 134,222', 'none', C.goldDk, 1.2);
    }
    if (bottom === 'J') {
      return '<g clip-path="url(#' + id + '-kain)"><rect x="70" y="205" width="80" height="95" fill="url(#' + id + '-jump)"/></g>' +
        path(KAIN_D, 'none', C.line, 2.4) +
        path('M118,216 Q121,250 124,290', 'none', JUMPUTAN.halo, 1.6);
    }
    // rok dasar netral
    return path(KAIN_D, C.brown, C.line, 2.4) + path('M104,222 Q105,256 103,290 M116,222 Q117,256 119,290', 'none', C.brownLt, 1.5);
  }

  /* ---------- badan & atasan ---------- */

  var KURUNG_BODY = 'M90,174 C100,170 120,170 130,174 L140,182 C143,200 144,222 145,241 Q110,248 75,241 C76,222 77,200 80,182 Z';
  var SLEEVE_L = 'M82,178 C70,186 63,210 59,233 L74,238 C76,220 80,205 88,194 Z';
  var SLEEVE_R = 'M138,178 C150,186 157,210 161,233 L146,238 C144,220 140,205 132,194 Z';

  function hands() {
    return circle(66, 241, 7, C.skin, C.line, 2) + circle(154, 241, 7, C.skin, C.line, 2);
  }
  function neck() {
    return path('M102,160 L102,178 Q110,182 118,178 L118,160 Z', C.skin, C.line, 2) +
      path('M103,170 Q110,174 117,170', 'none', C.skinShade, 1.4);
  }

  // Kelopak teratai disusun mengelilingi leher; kelopak tengah digambar paling akhir.
  function lotusCollar(cx, cy, count, from, to, len, wid, fill) {
    var order = [];
    for (var i = 0; i < count; i++) order.push(i);
    var mid = (count - 1) / 2;
    order.sort(function (x, y) { return Math.abs(y - mid) - Math.abs(x - mid); });
    var s = '';
    order.forEach(function (i) {
      var ang = from + (to - from) * (i / (count - 1));
      var rad = ang * Math.PI / 180;
      var ox = (cx + Math.cos(rad) * 13).toFixed(2);
      var oy = (cy + Math.sin(rad) * 5).toFixed(2);
      var d = 'M0,0 C' + wid + ',' + (len * 0.25) + ' ' + wid + ',' + (len * 0.7) + ' 0,' + len +
        ' C-' + wid + ',' + (len * 0.7) + ' -' + wid + ',' + (len * 0.25) + ' 0,0 Z';
      s += '<g transform="translate(' + ox + ',' + oy + ') rotate(' + (ang - 90) + ')">' +
        path(d, C.goldDk, 'none') + path(d, fill, C.gold, 1.3, { transform: 'scale(0.86) translate(0,1)' }) + '</g>';
    });
    return s;
  }

  // Kalung kebo munggah / tapak jajo: lempengan emas bersusun tiga.
  function keboMunggah(y0, widths) {
    var s = '';
    for (var i = 0; i < 3; i++) {
      var w = widths[i];
      var y = y0 + i * 7;
      s += path('M' + (110 - w) + ',' + y + ' Q110,' + (y + 7) + ' ' + (110 + w) + ',' + y + ' L' + (110 + w - 2) + ',' + (y + 4) +
        ' Q110,' + (y + 11) + ' ' + (110 - w + 2) + ',' + (y + 4) + ' Z', C.gold, C.goldDk, 1);
      s += circle(110, y + 5.6, 1.3, C.permata);
    }
    return s;
  }

  function topAG(id) {
    // Lengan terbuka dengan kecak bahu (gelang lengan atas) dan gelang di pergelangan.
    var armL = 'M84,180 C73,188 66,210 61,232 L73,236 C76,219 81,205 88,194 Z';
    var armR = 'M136,180 C147,188 154,210 159,232 L147,236 C144,219 139,205 132,194 Z';
    var s = path(armL, C.skin, C.line, 2) + path(armR, C.skin, C.line, 2);
    s += path('M70,198 L83,203', 'none', C.gold, 4.5) + path('M150,198 L137,203', 'none', C.gold, 4.5);
    s += path('M70,198 L83,203', 'none', C.goldDk, 0.8) + path('M150,198 L137,203', 'none', C.goldDk, 0.8);
    s += path('M61,228 L74,232 M62,233 L73,236', 'none', C.gold, 3.2) + path('M159,228 L146,232 M158,233 L147,236', 'none', C.gold, 3.2);
    s += hands();
    // dodot merah bertabur bintang emas
    s += path('M88,176 C100,172 120,172 132,176 L138,188 C140,198 140,208 139,219 L81,219 C80,208 80,198 82,188 Z', 'url(#' + id + '-starAG)', C.line, 2.2);
    s += neck();
    // pending (ikat pinggang emas)
    s += '<rect x="80" y="213" width="60" height="8" rx="2" fill="' + C.gold + '" stroke="' + C.goldDk + '" stroke-width="1.2"/>';
    s += ellipse(110, 217, 9, 6.5, C.goldLt, C.goldDk, 1.3) + circle(110, 217, 2.3, C.permata);
    // selempang sawit (selempang emas menyilang badan)
    s += path('M86,186 L136,214', 'none', C.goldDk, 4.6) + path('M86,186 L136,214', 'none', C.gold, 3, { 'stroke-dasharray': '3 1.6' });
    // teratai: penutup bahu dan dada dari songket berbentuk kelopak teratai
    s += lotusCollar(110, 172, 9, 10, 170, 30, 11, C.red);
    s += ellipse(110, 174, 12, 5.5, C.gold, C.goldDk, 1.2);
    s += keboMunggah(184, [9, 12, 15]);
    return s;
  }

  function topAP(id) {
    var fill = 'url(#' + id + '-starAP)';
    var s = path(SLEEVE_L, fill, C.line, 2.2) + path(SLEEVE_R, fill, C.line, 2.2);
    s += path('M60,229 L74,233', 'none', C.gold, 3.4) + path('M160,229 L146,233', 'none', C.gold, 3.4);
    s += hands();
    s += path(KURUNG_BODY, fill, C.line, 2.2);
    s += path('M110,190 L110,243', 'none', C.bataDk, 1.2);
    s += neck();
    // teratai penutup dada (lebih kecil, tidak menutup bahu)
    s += lotusCollar(110, 173, 7, 30, 150, 21, 9, C.red);
    s += ellipse(110, 175, 11, 5, C.gold, C.goldDk, 1.2);
    s += keboMunggah(182, [8, 11, 14]);
    return s;
  }

  // Baju kurung longgar polos warna plum (pilihan desain), lengan panjang yang
  // mengecil di pergelangan, leher bulat berbelah kecil, tiga kancing emas.
  var SLEEVE_BK_L = 'M82,178 C64,188 57,208 61,231 L72,235 C73,221 79,206 88,194 Z';
  var SLEEVE_BK_R = 'M138,178 C156,188 163,208 159,231 L148,235 C147,221 141,206 132,194 Z';
  var BODY_BK = 'M90,174 C100,170 120,170 130,174 L141,182 C145,202 146,226 148,250 Q110,258 72,250 C74,226 75,202 79,182 Z';

  // Kalung emas besar berbentuk lempeng berukir yang menutupi dada atas
  // (bentuk mengikuti foto referensi, pilihan desain).
  function kalungLempeng() {
    var s = path('M86,176 Q88,204 110,207 Q132,204 134,176 Q126,173 120,178 Q110,186 100,178 Q94,173 86,176 Z', C.gold, C.goldDk, 1.6);
    s += path('M92,180 Q95,199 110,201 Q125,199 128,180', 'none', C.goldDk, 1);
    s += path('M97,183 Q100,195 110,196 Q120,195 123,183', 'none', C.goldLt, 1.2);
    for (var i = 0; i < 7; i++) {
      var t = i / 6;
      var x = 92 + t * 36;
      var y = 181 + Math.sin(t * Math.PI) * 17;
      s += circle(x.toFixed(1), y.toFixed(1), 1.1, C.goldDk);
    }
    s += flower(110, 192, 2.6, C.goldLt) + circle(110, 192, 1.3, C.permata);
    for (var k = 0; k < 9; k++) {
      var tk = k / 8;
      var dx = 90 + tk * 40;
      var dy = 179 + Math.sin(tk * Math.PI) * 27 + (tk > 0 && tk < 1 ? 1 : 0);
      s += path('M' + dx.toFixed(1) + ',' + (dy - 2).toFixed(1) + ' L' + dx.toFixed(1) + ',' + (dy + 2).toFixed(1), 'none', C.goldDk, 0.9);
      s += ellipse(dx.toFixed(1), (dy + 3.4).toFixed(1), 1.4, 2, C.gold, C.goldDk, 0.6);
    }
    return s;
  }

  function topBK() {
    var s = path(SLEEVE_BK_L, C.plum, C.line, 2.2) + path(SLEEVE_BK_R, C.plum, C.line, 2.2);
    s += path('M70,200 Q66,214 66,228 M150,200 Q154,214 154,228', 'none', C.plumHi, 1.6);
    // gelang emas di kedua pergelangan
    s += path('M61,227 L72,231 M61,232 L72,236', 'none', C.gold, 3.4) + path('M159,227 L148,231 M159,232 L148,236', 'none', C.gold, 3.4);
    s += path('M61,227 L72,231 M61,232 L72,236', 'none', C.goldDk, 0.7) + path('M159,227 L148,231 M159,232 L148,236', 'none', C.goldDk, 0.7);
    s += hands();
    s += path(BODY_BK, C.plum, C.line, 2.2);
    s += path('M86,196 Q84,224 82,246 M134,196 Q136,224 138,246', 'none', C.plumDk, 1.6);
    s += neck();
    // leher bulat dengan belahan kecil di tengah depan, tanpa kerah
    s += path('M97,174 Q110,184 123,174', 'none', C.line, 2);
    s += path('M110,181 L110,191', 'none', C.plumDk, 1.6);
    s += kalungLempeng();
    // tiga kancing emas di depan
    [212, 221, 230].forEach(function (y) { s += circle(110, y, 2.4, C.gold, C.goldDk, 0.9) + circle(109.3, y - 0.7, 0.7, C.goldLt); });
    return s;
  }

  function topBase() {
    var s = path(SLEEVE_L, C.cream, C.line, 2.2) + path(SLEEVE_R, C.cream, C.line, 2.2);
    s += hands();
    s += path(KURUNG_BODY.replace('C143,200 144,222 145,241 Q110,248 75,241 C76,222 77,200 80,182', 'C142,196 142,208 141,222 Q110,226 79,222 C78,208 78,196 80,182'), C.cream, C.line, 2.2);
    s += neck();
    s += path('M98,174 Q110,184 122,174', 'none', C.brownLt, 2);
    return s;
  }

  /* ---------- kepala ---------- */

  var FACE_D = 'M58,112 C58,78 84,66 110,66 C136,66 162,78 162,112 C162,146 140,166 110,166 C80,166 58,146 58,112 Z';
  var SLEEK_D = 'M56,118 C52,76 80,58 110,58 C140,58 168,76 164,118 C158,104 150,94 136,90 C126,88 116,90 110,97 C104,90 94,88 84,90 C70,94 62,104 56,118 Z';
  var BANGS_D = 'M55,124 C48,72 80,56 110,56 C140,56 172,72 165,124 C162,112 158,104 152,100 L150,113 C144,104 136,98 127,96 L123,109 C117,100 111,98 104,98 L100,111 C94,103 86,100 78,103 L72,114 C66,109 60,114 55,124 Z';

  function face(blank) {
    var s = ellipse(58, 122, 7, 9, C.skin, C.line, 2) + ellipse(162, 122, 7, 9, C.skin, C.line, 2);
    s += path(FACE_D, C.skin, C.line, 2.4);
    if (blank) return s;
    [88, 132].forEach(function (cx, i) {
      s += ellipse(cx, 125, 8.5, 10.5, C.eye);
      s += ellipse(cx, 127, 6, 7.6, C.iris);
      s += ellipse(cx, 129, 3.2, 4, C.eye);
      s += circle(cx - 3, 120, 3, C.melati) + circle(cx + 3, 130, 1.4, C.melati);
      var dir = i === 0 ? -1 : 1;
      s += path('M' + (cx - 10) + ',117 Q' + cx + ',110 ' + (cx + 10) + ',117', 'none', C.line, 3);
      s += path('M' + (cx + dir * 10) + ',117 L' + (cx + dir * 13) + ',114', 'none', C.line, 2);
      s += path('M' + (cx - 7) + ',104 Q' + cx + ',100 ' + (cx + 7) + ',103', 'none', C.hair, 2.2);
    });
    s += ellipse(75, 141, 8, 4.4, C.blush) + ellipse(145, 141, 8, 4.4, C.blush);
    s += path('M108,135 Q110,137 112,135', 'none', C.skinShade, 1.6);
    s += path('M103,146 Q110,155 117,146 Q110,149 103,146 Z', C.mouth, C.line, 1.4);
    return s;
  }

  function sleekHair() {
    return path(SLEEK_D, C.hair, C.line, 2.2) +
      path('M108,64 C96,66 84,72 74,84', 'none', C.hairHi, 2) + path('M112,64 C124,66 136,72 146,84', 'none', C.hairHi, 2);
  }
  var UPSWEPT_D = 'M56,118 C52,76 80,58 110,58 C140,58 168,76 164,118 C158,102 142,90 110,90 C78,90 62,102 56,118 Z';
  function upsweptHair() {
    return path(UPSWEPT_D, C.hair, C.line, 2.2) +
      path('M76,92 C84,76 96,66 106,62 M144,92 C136,76 124,66 114,62 M92,90 C98,76 104,68 110,64', 'none', C.hairHi, 1.8);
  }

  // Sanggul tinggi di puncak kepala, hiasan bunga emas di sisi kanan sanggul,
  // anting emas menjuntai di kedua telinga.
  function headBK() {
    var s = path('M96,62 C96,52 124,52 124,62 Z', C.hair, C.line, 2);
    s += ellipse(110, 42, 21, 17, C.hair, C.line, 2.2);
    s += path('M94,40 Q110,28 126,40 M97,47 Q110,38 123,47', 'none', C.hairHi, 1.8);
    s += path('M126,40 L134,30 M127,44 L140,38 M127,49 L142,48 M126,53 L139,58', 'none', C.goldDk, 1.3);
    s += flower(134, 29, 3.2, C.gold) + flower(141, 37, 3.4, C.gold) + flower(143, 48, 3.4, C.gold) + flower(139, 58, 3, C.gold);
    s += ellipse(131, 46, 4, 2.2, C.gold, C.goldDk, 0.8, { transform: 'rotate(-20 131 46)' });
    [58, 162].forEach(function (x) {
      s += circle(x, 132, 2.2, C.gold, C.goldDk, 0.8);
      s += path('M' + x + ',134 L' + x + ',146', 'none', C.goldDk, 1);
      s += circle(x, 147, 1.8, C.gold, C.goldDk, 0.7);
      s += path('M' + x + ',149 C' + (x + 4) + ',154 ' + (x + 3) + ',160 ' + x + ',163 C' + (x - 3) + ',160 ' + (x - 4) + ',154 ' + x + ',149 Z', C.gold, C.goldDk, 0.9);
      s += path('M' + (x - 2) + ',163 L' + (x - 2) + ',168 M' + x + ',163 L' + x + ',170 M' + (x + 2) + ',163 L' + (x + 2) + ',168', 'none', C.gold, 1);
    });
    return s;
  }

  function backSleek() { return ellipse(110, 112, 59, 56, C.hair, C.line, 2.2); }
  function bun(cy, r) { return circle(110, cy, r, C.hair, C.line, 2.2) + path('M' + (110 - r * 0.6) + ',' + (cy - r * 0.2) + ' Q110,' + (cy - r * 0.8) + ' ' + (110 + r * 0.6) + ',' + (cy - r * 0.2), 'none', C.hairHi, 1.8); }

  // Kelapo standan: perhiasan di bagian belakang kepala. Dari depan hanya
  // terlihat sebagian di sisi kepala (bentuk disederhanakan).
  function kelapoStandan() {
    var s = '';
    [[52, -1], [168, 1]].forEach(function (p) {
      for (var i = 0; i < 4; i++) {
        var x = p[0] + p[1] * (i % 2) * 4;
        var y = 78 + i * 7;
        s += path('M' + (p[0] - p[1] * 6) + ',' + (y - 4) + ' L' + x + ',' + y, 'none', C.goldDk, 1.2);
        s += ellipse(x, y + 2.5, 2.6, 3.4, C.gold, C.goldDk, 0.8);
      }
    });
    return s;
  }

  // Kembang goyang: tangkai bunga emas yang dipasang di kepala.
  function kembangGoyang(stems) {
    var s = '';
    stems.forEach(function (p) {
      s += path('M' + p[0] + ',' + p[1] + ' Q' + ((p[0] + p[2]) / 2 + p[4]) + ',' + ((p[1] + p[3]) / 2) + ' ' + p[2] + ',' + p[3], 'none', C.goldDk, 1.4);
      s += flower(p[2], p[3], 3.2, C.gold);
    });
    return s;
  }

  function headAG() {
    var s = '';
    // gandik: ikat kepala beludru merah berhias melati
    s += path('M60,110 C70,94 90,88 110,92 C130,88 150,94 160,110 L159,117 C149,101 130,96 110,99 C90,96 71,101 61,117 Z', C.red, C.line, 1.8);
    for (var i = 0; i < 9; i++) {
      var t = i / 8;
      var x = 64 + t * 92;
      var y = 106 - Math.sin(t * Math.PI) * 10;
      s += circle(x.toFixed(1), y.toFixed(1), 2, C.melati, C.goldDk, 0.5);
    }
    // bungo cempako di sisi kepala
    s += flower(60, 100, 3.6, C.gold) + flower(160, 100, 3.6, C.gold);
    s += kembangGoyang([[84, 70, 70, 34, -6], [136, 70, 150, 34, 6], [96, 64, 88, 16, -4], [124, 64, 132, 16, 4]]);
    // kesuhun: mahkota tinggi berlapis kelopak teratai, permata di tengah, hiasan melati
    s += path('M58,90 C54,74 58,62 64,52 C70,62 76,74 76,86 Z', C.gold, C.goldDk, 1.4);
    s += path('M162,90 C166,74 162,62 156,52 C150,62 144,74 144,86 Z', C.gold, C.goldDk, 1.4);
    s += path('M70,84 C64,62 72,44 82,30 C90,46 98,60 98,78 Z', C.gold, C.goldDk, 1.5);
    s += path('M150,84 C156,62 148,44 138,30 C130,46 122,60 122,78 Z', C.gold, C.goldDk, 1.5);
    s += path('M77,76 C76,62 80,50 82,42 M143,76 C144,62 140,50 138,42', 'none', C.goldLt, 1.4);
    s += path('M88,78 C88,48 104,30 110,10 C116,30 132,48 132,78 Z', C.gold, C.goldDk, 1.6);
    s += path('M95,74 C96,52 106,38 110,24 C114,38 124,52 125,74 Z', C.goldLt, C.goldDk, 1);
    s += ellipse(110, 54, 6, 8, C.permata, C.goldDk, 1.2) + circle(108, 51, 1.6, C.cream);
    [[110, 36], [101, 64], [119, 64], [110, 70]].forEach(function (p) { s += circle(p[0], p[1], 2.1, C.melati, C.goldDk, 0.5); });
    s += path('M60,92 C72,66 148,66 160,92 L153,96 C142,76 78,76 67,96 Z', C.gold, C.goldDk, 1.6);
    for (var k = 0; k < 7; k++) {
      var tk = k / 6;
      s += circle((70 + tk * 80).toFixed(1), (88 - Math.sin(tk * Math.PI) * 13).toFixed(1), 1.9, C.melati, C.goldDk, 0.5);
    }
    return s;
  }

  function headAP() {
    var s = '';
    s += kembangGoyang([[100, 60, 86, 36, -5], [110, 56, 110, 30, 0], [120, 60, 134, 36, 5]]);
    // mahkota paksangko dipakai di kening: motif dasar lingkaran, teratai, setangkai mawar
    s += path('M60,106 C74,82 146,82 160,106 L155,112 C142,92 78,92 65,112 Z', C.gold, C.goldDk, 1.6);
    for (var i = 0; i < 9; i++) {
      var t = i / 8;
      var x = 66 + t * 88;
      var y = 104 - Math.sin(t * Math.PI) * 13;
      s += circle(x.toFixed(1), y.toFixed(1), 3.6, C.goldLt, C.goldDk, 1) + circle(x.toFixed(1), y.toFixed(1), 1.2, C.goldDk);
    }
    s += path('M103,86 C103,74 107,66 110,58 C113,66 117,74 117,86 Z', C.gold, C.goldDk, 1.3);
    s += path('M101,88 C94,80 91,72 91,64 C99,68 105,76 108,85 Z', C.gold, C.goldDk, 1.3);
    s += path('M119,88 C126,80 129,72 129,64 C121,68 115,76 112,85 Z', C.gold, C.goldDk, 1.3);
    s += circle(110, 84, 2.6, C.permata, C.goldDk, 0.8);
    s += path('M138,92 Q142,80 146,70', 'none', C.goldDk, 1.6);
    s += ellipse(140, 81, 4, 2, C.gold, C.goldDk, 0.8, { transform: 'rotate(-40 140 81)' });
    s += circle(147, 66, 5.6, C.gold, C.goldDk, 1.2) + path('M147,66 m-2.6,0 a2.6,2.6 0 1,1 2.6,2.6 a1.4,1.4 0 1,1 -1.4,-1.4', 'none', C.goldDk, 1);
    return s;
  }

  /* ---------- perakitan ---------- */

  function svgOpen(viewBox, label) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" role="img" aria-label="' + label + '">';
  }

  function label(top, bottom) {
    var t = top ? TOPS[top].name : 'baju dasar';
    var b = bottom ? BOTTOMS[bottom].short : 'rok dasar';
    return 'Karakter memakai ' + t + ' dan ' + b;
  }

  function character(top, bottom, opts) {
    opts = opts || {};
    var id = uid();
    var view = opts.view === 'bust' ? '30 0 160 262' : '0 0 220 310';
    var s = svgOpen(view, label(top, bottom)) + defs(id);
    var bride = top === 'AG' || top === 'AP';

    // lapisan belakang
    if (bride) s += kelapoStandan();
    if (top === 'AP') s += bun(64, 17);
    if (top) s += backSleek();
    else s += path('M52,118 C46,62 174,62 168,118 L171,168 C161,175 151,171 147,163 L73,163 C69,171 59,175 49,168 Z', C.hair, C.line, 2.2);

    // kaki dan bawahan
    s += ellipse(99, 296, 9, 4.6, C.shoe, C.line, 1.6) + ellipse(121, 296, 9, 4.6, C.shoe, C.line, 1.6);
    s += kain(id, bottom);

    // atasan
    if (top === 'AG') s += topAG(id);
    else if (top === 'AP') s += topAP(id);
    else if (top === 'BK') s += topBK();
    else s += topBase();

    // kepala
    s += face();
    if (top === 'BK') s += upsweptHair();
    else if (top) s += sleekHair();
    else s += path(BANGS_D, C.hair, C.line, 2.2) + path('M80,70 C90,64 100,62 108,62', 'none', C.hairHi, 2);

    if (top === 'AG') s += headAG();
    else if (top === 'AP') s += headAP();
    else if (top === 'BK') s += headBK();

    return s + '</svg>';
  }

  // Manekin memakai warna netral pengganti kulit.
  function withMannequinSkin(fn) {
    var skin = C.skin, shade = C.skinShade;
    C.skin = C.mannequin;
    C.skinShade = C.mannequinDk;
    try { return fn(); } finally { C.skin = skin; C.skinShade = shade; }
  }

  // Manekin badan: atasan lengkap dengan tata rambut dan hiasan kepalanya,
  // berdiri di atas tiang berkaki tiga.
  function mannequinTop(top) {
    return withMannequinSkin(function () {
      var id = uid();
      var s = svgOpen('26 0 168 312', 'Manekin badan memakai ' + TOPS[top].name) + defs(id);
      if (top === 'AG' || top === 'AP') s += kelapoStandan();
      if (top === 'AP') s += bun(64, 17);
      s += backSleek();
      s += path('M110,236 L110,290', 'none', C.brown, 5);
      s += path('M110,288 L86,306 M110,288 L134,306 M110,288 L110,308', 'none', C.brown, 4);
      s += path('M82,212 C90,222 130,222 138,212 L137,240 Q110,250 83,240 Z', C.mannequin, C.line, 2);
      if (top === 'AG') s += topAG(id);
      else if (top === 'AP') s += topAP(id);
      else s += topBK();
      s += face(true) + (top === 'BK' ? upsweptHair() : sleekHair());
      if (top === 'AG') s += headAG();
      else if (top === 'AP') s += headAP();
      else s += headBK();
      return s + '</svg>';
    });
  }

  // Manekin kaki: kain dikenakan dari pinggang sampai mata kaki.
  function mannequinBottom(bottom) {
    var id = uid();
    var s = svgOpen('62 196 96 116', 'Manekin kaki memakai ' + BOTTOMS[bottom].name) + defs(id);
    s += '<rect x="78" y="302" width="64" height="7" rx="3" fill="' + C.brown + '" stroke="' + C.line + '" stroke-width="1.6"/>';
    s += ellipse(99, 297, 8, 4.6, C.mannequin, C.line, 1.6) + ellipse(121, 297, 8, 4.6, C.mannequin, C.line, 1.6);
    s += path('M86,200 Q110,196 134,200 L136,214 Q110,209 84,214 Z', C.mannequin, C.line, 2);
    s += kain(id, bottom);
    return s + '</svg>';
  }

  global.Outfits = {
    TOPS: TOPS,
    BOTTOMS: BOTTOMS,
    COLORS: C,
    character: character,
    mannequinTop: mannequinTop,
    mannequinBottom: mannequinBottom,
    combos: function () {
      var list = [];
      ['AG', 'AP', 'BK'].forEach(function (t) {
        ['S', 'J'].forEach(function (b) { list.push({ top: t, bottom: b, key: t + '-' + b, code: '(' + t + ', ' + b + ')' }); });
      });
      return list;
    }
  };
})(window);

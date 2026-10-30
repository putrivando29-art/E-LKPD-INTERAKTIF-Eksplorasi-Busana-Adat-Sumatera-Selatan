"""
Membuat audio/musik-latar.mp3: komposisi instrumental orisinal untuk musik latar.

Bunyi gitar dibuat dengan sintesis senar petik Karplus-Strong, ditambah bunyi
kendang bingkai sintetis yang pelan. Ini BUKAN rekaman alat musik tradisional
dan BUKAN lagu Batanghari Sembilan. Ganti file hasilnya dengan rekaman asli
yang berizin bila tersedia.

Jalankan:  python3 tools/buat-musik-latar.py   (butuh numpy dan ffmpeg)
"""
import os
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100
BPM = 112
BEAT = 60 / BPM
BAR = 4 * BEAT
RNG = np.random.default_rng(1945)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def pluck(freq, dur, bright=0.5, decay=0.996):
    """Senar petik Karplus-Strong."""
    n = int(SR * dur)
    # filter rata-rata menambah tunda setengah sampel, jadi periodenya dikurangi
    period = max(2, int(round(SR / freq - 0.5)))
    buf = RNG.uniform(-1, 1, period)
    # lowpass awal: makin kecil bright, makin lembut petikannya
    for _ in range(int((1 - bright) * 4) + 1):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.empty(n)
    for i in range(n):
        j = i % period
        out[i] = buf[j]
        buf[j] = decay * 0.5 * (buf[j] + buf[(j + 1) % period])
    # serangan halus agar tidak berbunyi klik
    att = min(n, int(0.004 * SR))
    out[:att] *= np.linspace(0, 1, att)
    return out


def drum_low(dur=0.35):
    t = np.arange(int(SR * dur)) / SR
    f = 95 * np.exp(-t * 6) + 55
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
    hit = RNG.uniform(-1, 1, len(t)) * np.exp(-t * 90) * 0.25
    return body + hit


def drum_slap(dur=0.12):
    t = np.arange(int(SR * dur)) / SR
    noise = RNG.uniform(-1, 1, len(t))
    # bandpass sederhana: selisih dua lowpass
    a = np.convolve(noise, np.ones(4) / 4, mode='same')
    b = np.convolve(noise, np.ones(24) / 24, mode='same')
    return (a - b) * np.exp(-t * 40)


def add(track, start_s, sig, gain):
    i = int(start_s * SR)
    end = min(len(track), i + len(sig))
    track[i:end] += sig[:end - i] * gain


# Akord: (bass, tiga nada atas) dalam nomor MIDI. Kunci G mayor agar terdengar ceria.
CHORDS = {
    'G': (43, (55, 59, 62)),
    'D': (50, (54, 57, 62)),
    'Em': (40, (55, 59, 64)),
    'C': (48, (55, 60, 64)),
}
PROGRESSION = ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'D',
               'Em', 'C', 'G', 'D', 'C', 'D', 'G', 'G',
               'G', 'C', 'G', 'D', 'G', 'C', 'D', 'G']

def swing(beat):
    """Ketukan setengah digeser sedikit agar ritmenya berayun riang."""
    return (beat + 0.08) * BEAT if beat % 1 == 0.5 else beat * BEAT


def render():
    loop_len = len(PROGRESSION) * BAR
    tail = 3.0
    track = np.zeros(int(SR * (loop_len + tail)))
    cache = {}

    def note(m, dur, bright, decay):
        key = (m, round(dur, 2), bright, decay)
        if key not in cache:
            cache[key] = pluck(midi_hz(m), dur, bright, decay)
        return cache[key]

    for b, name in enumerate(PROGRESSION):
        bass, upper = CHORDS[name]
        t0 = b * BAR
        # pola "dum-crek": bas di ketukan 1 dan 3, genjrengan akord di 2 dan 4
        for beat, m in ((0, bass), (2, bass + 7 if bass + 7 <= 52 else bass - 5)):
            add(track, t0 + swing(beat), note(m, 1.6, 0.4, 0.995), 0.40)
        # genjrengan dibuat lembut (bright rendah) agar tidak berdenting
        for beat in (1, 3):
            for i, m in enumerate(upper):
                add(track, t0 + swing(beat) + i * 0.012, note(m, 0.9, 0.2, 0.991), 0.17)
        # kendang bingkai: dum di 1 dan 3, tak di 2 dan 4, kocokan halus tiap setengah ketukan
        add(track, t0, drum_low(), 0.08)
        add(track, t0 + swing(2), drum_low(), 0.06)
        add(track, t0 + swing(1), drum_slap(), 0.05)
        add(track, t0 + swing(3), drum_slap(), 0.05)
        for h in range(8):
            add(track, t0 + swing(h / 2), drum_slap(0.04), 0.012 if h % 2 else 0.02)

    # gema ruang: konvolusi dengan derau yang meluruh
    ir_t = np.arange(int(SR * 1.1)) / SR
    ir = RNG.uniform(-1, 1, len(ir_t)) * np.exp(-ir_t * 5.5)
    ir[0] = 0
    n = len(track) + len(ir) - 1
    nfft = 1 << (n - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(track, nfft) * np.fft.rfft(ir, nfft), nfft)[:len(track)]
    wet /= np.max(np.abs(wet)) + 1e-9
    mix = track / (np.max(np.abs(track)) + 1e-9) + 0.18 * wet

    # sambungan putar ulang mulus: ekor setelah akhir dijumlahkan ke awal
    loop_n = int(SR * loop_len)
    out = mix[:loop_n].copy()
    rest = mix[loop_n:]
    out[:len(rest)] += rest
    out = 0.7 * out / np.max(np.abs(out))
    return out


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target = os.path.join(root, 'audio', 'musik-latar.mp3')
    pcm = (render() * 32767).astype(np.int16)
    with tempfile.TemporaryDirectory() as tmp:
        wav_path = os.path.join(tmp, 'musik.wav')
        with wave.open(wav_path, 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav_path, '-codec:a', 'libmp3lame', '-b:a', '96k',
                        '-metadata', 'title=Musik Latar Stylist Studio',
                        '-metadata', 'comment=Komposisi orisinal, gitar petik dan kendang bingkai sintetis',
                        target], check=True)
    print('Tersimpan:', target, os.path.getsize(target) // 1024, 'KB')


if __name__ == '__main__':
    main()

"""Code-made sound clips, added to library/sfx/ so sfx.py uses them like any library clip (no API, no cost).

    python <skill>/scripts/synth_sfx.py --list        what it can make, with the exact clips entry to paste
    python <skill>/scripts/synth_sfx.py rain thunder  make those (all, with no names) into library/sfx/

Each clip is keyed like a generated one (name + prompt + length), so an episode's "clips" entry must copy the
entry --list prints exactly. Everything is seeded: the same clip comes out every time. Run from the studio folder.
"""
import subprocess
import sys
import tempfile
import zlib

import numpy as np
from scipy.signal import butter, sosfilt

from wi import SR, clip_path, write_wav

rng = np.random.default_rng(7)


def band(x, lo=None, hi=None, order=4):
    if lo and hi:
        sos = butter(order, [lo, hi], 'bandpass', fs=SR, output='sos')
    elif lo:
        sos = butter(order, lo, 'highpass', fs=SR, output='sos')
    else:
        sos = butter(order, hi, 'lowpass', fs=SR, output='sos')
    return sosfilt(sos, x)


def t_(secs):
    return np.arange(int(secs * SR)) / SR


def loopable(x, fade=0.4):
    """Crossfade the tail into the head so a bed loops without a seam."""
    n = int(fade * SR)
    out = x[:-n].copy()
    k = np.linspace(0, 1, n)
    out[:n] = x[:n] * k + x[-n:] * (1 - k)
    return out


def rain(secs):
    """Steady monsoon rain: a hiss bed plus thousands of small drop ticks, a few heavier plops."""
    n = int((secs + 0.4) * SR)
    hiss = band(rng.standard_normal(n), 500, 7000) * 0.35
    hiss += band(rng.standard_normal(n), 120, 600) * 0.25  # the body of rain on ground and leaves
    drops = np.zeros(n)
    for _ in range(int(secs * 260)):
        i = rng.integers(0, n - 2000)
        f = rng.uniform(2200, 6500)
        L = rng.integers(200, 900)
        tt = np.arange(L) / SR
        drops[i:i + L] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(250, 600)) * rng.uniform(0.05, 0.25)
    for _ in range(int(secs * 6)):
        i = rng.integers(0, n - 6000)
        tt = np.arange(5000) / SR
        drops[i:i + 5000] += np.sin(2 * np.pi * (700 + 900 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 60) * 0.25
    x = hiss + drops
    x *= 1 + 0.12 * np.sin(2 * np.pi * 0.11 * np.arange(n) / SR)  # slow gusts
    return loopable(x)


def thunder(secs):
    """A close crack, then a long rolling rumble."""
    n = int(secs * SR)
    tt = t_(secs)
    crack = band(rng.standard_normal(n), 800, 6000) * np.exp(-tt * 18) * 0.8
    rumble = band(rng.standard_normal(n), None, 140, 2) * 2.2
    roll = np.exp(-tt * 1.1) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 1.7 * tt + np.sin(2 * np.pi * 0.6 * tt))))
    att = np.clip(tt / 0.05, 0, 1)
    return (crack + rumble * roll) * att


def splash(secs):
    """Something leaping out of water: a wet burst and a few bubbles."""
    n = int(secs * SR)
    tt = t_(secs)
    x = band(rng.standard_normal(n), 400, 5000) * np.exp(-tt * 9) * np.clip(tt / 0.01, 0, 1)
    for k in range(5):
        st = int((0.05 + k * 0.06) * SR)
        b = t_(0.08)
        f = 500 + k * 180 + 1600 * b / 0.08
        seg = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-b * 40) * 0.3
        x[st:st + len(seg)] += seg[: max(0, min(len(seg), n - st))]
    return x


def frog(secs):
    """A two-part frog croak: a buzzy pulse train through a vocal-ish formant."""
    out = np.zeros(int(secs * SR))
    for st, L, f0 in ((0.0, 0.16, 26), (0.22, 0.2, 22)):
        tt = t_(L)
        pulses = np.sin(2 * np.pi * f0 * tt) > 0.6
        buzz = np.sign(np.sin(2 * np.pi * 180 * tt)) * pulses
        v = band(buzz.astype(float), 300, 1400, 2) * np.sin(np.pi * tt / L) ** 0.6
        i = int(st * SR)
        out[i:i + len(v)] += v
    return out


def plip(secs):
    """A single bright water drop."""
    tt = t_(secs)
    f = 900 + 1700 * (1 - np.exp(-tt * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 28)


def lap(secs):
    """Calm water lapping at a hull or a wall: slow low swells with soft wet slaps on top, loopable."""
    n = int((secs + 0.4) * SR)
    tt = np.arange(n) / SR
    body = band(rng.standard_normal(n), 80, 700) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.35 * tt) ** 2) * 0.5
    slaps = np.zeros(n)
    for k in range(int(secs * 1.6)):
        i = int((k / 1.6 + rng.uniform(-0.15, 0.15)) * SR) % (n - 9000)
        L = 8000
        e = np.exp(-np.arange(L) / SR * 18) * np.clip(np.arange(L) / (0.02 * SR), 0, 1)
        slaps[i:i + L] += band(rng.standard_normal(L), 300, 3000) * e * rng.uniform(0.3, 0.6)
    return loopable(body + slaps)


def oar(secs):
    """One paddle stroke: the blade dips in, a rushing swish of water, a few drips as it lifts."""
    n = int(secs * SR)
    tt = t_(secs)
    dip = band(rng.standard_normal(n), 250, 2500) * np.exp(-tt * 14) * np.clip(tt / 0.015, 0, 1)
    swish = band(rng.standard_normal(n), 150, 1200) * np.sin(np.pi * np.clip(tt / 0.55, 0, 1)) ** 2 * 0.6
    x = dip + swish
    for k in range(3):
        st = int((0.55 + k * 0.07) * SR)
        b = t_(0.06)
        seg = np.sin(2 * np.pi * np.cumsum(1200 + 1500 * (1 - np.exp(-b * 60))) / SR) * np.exp(-b * 45) * 0.25
        x[st:st + len(seg)] += seg[: max(0, min(len(seg), n - st))]
    return x


def motor(secs):
    """A small outboard boat engine putt-putting at idle, loopable."""
    n = int((secs + 0.4) * SR)
    tt = np.arange(n) / SR
    f = 11 + 0.6 * np.sin(2 * np.pi * 0.3 * tt)
    pulses = (np.sin(2 * np.pi * np.cumsum(f) / SR) > 0.7).astype(float)
    x = band(pulses * rng.standard_normal(n) * 0.6 + pulses, 60, 900, 2)
    x += band(rng.standard_normal(n), 900, 4000) * 0.04
    return loopable(x)


SYNTH = {
    'rain': (rain, 'synth: steady monsoon rain on leaves and ground, drop ticks, slow gusts, loopable', 10.0),
    'thunder': (thunder, 'synth: close thunder crack then a long rolling rumble', 3.5),
    'splash': (splash, 'synth: a fish leaping out of water, wet burst and bubbles', 0.6),
    'frog': (frog, 'synth: a two-part frog croak, buzzy', 0.5),
    'plip': (plip, 'synth: a single bright water drop plip', 0.35),
    'lap': (lap, 'synth: calm water lapping at a boat hull, slow swells and soft slaps, loopable', 8.0),
    'oar': (oar, 'synth: one paddle stroke, blade dip, water swish and drips', 0.8),
    'motor': (motor, 'synth: a small outboard boat engine putt-putting at idle, loopable', 4.0),
}

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    if '--list' in sys.argv:
        for name, (_, prompt, secs) in SYNTH.items():
            print(f'"{name}": ["{prompt}", {secs}],')
        sys.exit(0)
    for name in args or SYNTH:
        fn, prompt, secs = SYNTH[name]
        rng = np.random.default_rng(zlib.crc32(name.encode()))  # per-clip seed: the same clip whatever else is made
        x = fn(secs)
        x = x / max(1e-9, np.abs(x).max()) * 0.89
        p = clip_path(name, prompt, secs)
        with tempfile.TemporaryDirectory() as d:
            w = f'{d}/{name}.wav'
            write_wav(w, x)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', w, '-b:a', '128k', str(p)], check=True)
        print('made', p.name)

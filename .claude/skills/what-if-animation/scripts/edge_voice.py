"""Step 2, the default route: edge-tts reads the script one line at a time, then voice_file.py times it.

python <skill>/scripts/edge_voice.py <slug> [--force]
Run from the studio folder. Needs `pip install edge-tts` and ffmpeg.

Reads  src/episodes/<slug>/episode.json: "voice" {"engine": "edge-tts", "id": "ml-IN-SobhanaNeural", "rate": "+0%"},
       "script" (each line can carry "hold": seconds of extra silence after it, so a visual gag lands in a real pause)
Writes out/<slug>/voice-edge.mp3, out/<slug>/blocks/ (one cached take per script line), sets "gaps.pairs" in
       episode.json from the holds, then runs voice_file.py, which writes public/<slug>/voice.wav and words.json.

Each line is cached by its text, voice and rate, so changing one line re-reads only that line, and changing a hold or
the gaps is free. Stops if the take is near-silent (mean under -40 dB): a good take sits about -20 dB.
"""
import asyncio, hashlib, json, re, subprocess, sys, unicodedata
from pathlib import Path

from wi import ep_dir, load_episode, out_dir

try:
    import edge_tts
except ImportError:
    raise SystemExit('edge-tts is missing: pip install edge-tts')

SR = 44100
TAIL = 0.6  # seconds of silence after every line before its hold, so lines never run together


def bare(word):
    return ''.join(c for c in word if re.match(r'\w', c) or unicodedata.category(c) in ('Mn', 'Mc') or c in '‌‍')


async def read(text, voice, rate, path):
    await edge_tts.Communicate(text, voice, rate=rate).save(str(path))


def mean_db(path):
    err = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'volumedetect', '-f', 'null', '-'],
                         capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
    m = re.search(r'mean_volume: (-?[\d.]+) dB', err)
    return float(m.group(1)) if m else -99.0


def main(slug, force):
    ep = load_episode(slug)
    V = {'id': 'ml-IN-SobhanaNeural', 'rate': '+0%'}
    V.update(ep.get('voice', {}))
    if V.get('engine', 'edge-tts') != 'edge-tts':
        raise SystemExit(f'episode.json voice engine is {V["engine"]!r}, not edge-tts. Use azure_voice.py for Azure.')
    od = out_dir(slug)
    blocks_dir = od / 'blocks'
    blocks_dir.mkdir(exist_ok=True)
    lines = ep['script']

    takes, pairs = [], {}
    for i, b in enumerate(lines):
        text = b['text'].strip()
        p = blocks_dir / (hashlib.sha1((text + V['id'] + V['rate']).encode()).hexdigest()[:12] + '.mp3')
        if force or not p.exists():
            print(f'line {i + 1}/{len(lines)}: reading')
            asyncio.run(read(text, V['id'], V['rate'], p))
        hold = float(b.get('hold', 0))
        takes.append((p, hold))
        if hold and i + 1 < len(lines):
            a, n = bare(text.split()[-1]), bare(lines[i + 1]['text'].split()[0])
            pairs[f'{a}|{n}'] = round(hold + TAIL, 2)

    # each line: trailing silence trimmed, then the tail plus its hold added, so pauses are exactly what we asked for
    listing = []
    for k, (p, hold) in enumerate(takes):
        w = blocks_dir / f'{k:03d}.wav'
        af = f'silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-45dB,apad=pad_dur={TAIL + hold}'
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(p), '-af', af, '-ac', '1', '-ar', str(SR), str(w)], check=True)
        listing.append(f"file '{w.resolve().as_posix()}'")
    (blocks_dir / 'list.txt').write_text('\n'.join(listing), encoding='utf-8')
    mp3 = od / 'voice-edge.mp3'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(blocks_dir / 'list.txt'),
                    '-b:a', '192k', str(mp3)], check=True)

    level = mean_db(mp3)
    print(f'take: {mp3} (mean {level:.1f} dB)')
    if level < -40:
        raise SystemExit('The take is near-silent: check the voice id and your connection, then run again with --force.')

    # holds become gaps.pairs, so voice.py keeps these pauses when it tightens the rest
    path = ep_dir(slug) / 'episode.json'
    raw = json.loads(path.read_text(encoding='utf-8'))
    raw.setdefault('gaps', {})['pairs'] = pairs
    path.write_text(json.dumps(raw, ensure_ascii=False, indent=2), encoding='utf-8')

    subprocess.run([sys.executable, str(Path(__file__).with_name('voice_file.py')), slug, str(mp3)], check=True)


if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1].startswith('--'):
        raise SystemExit(__doc__)
    main(sys.argv[1], '--force' in sys.argv)

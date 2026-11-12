"""Step 2, from a voice you made elsewhere (Clipchamp text-to-speech, a recording): no ElevenLabs credits.

python <skill>/scripts/voice_file.py <slug> <audio file>
Converts the file to public/<slug>/voice_raw.mp3, times every word of the script with faster-whisper (model "small",
word timestamps), writes out/<slug>/words_raw.json and marks the take as current, then runs voice.py to tighten the
pauses as usual. The script's own words and punctuation are kept; whisper only supplies the times, matched in order
(numbers it writes as digits are spread over the spoken words they stand for). Malayalam, or any take whisper
matches under half of, is timed from its pauses instead (see by_pauses).
"""
import difflib, hashlib, json, re, subprocess, sys, unicodedata
from pathlib import Path

import numpy as np

from wi import SR, decode, ep_dir, load_episode, load_json, out_dir, pub_dir, save_json



def wordy(ch):
    return bool(re.match(r"[\w'’]", ch)) or unicodedata.category(ch) in ('Mn', 'Mc') or ch in '‌‍'


slug, src = sys.argv[1], Path(sys.argv[2])
ep = load_episode(slug)
V = {'id': 'TX3LPaxmHKxFdv7VOQHJ', 'model': 'eleven_multilingual_v2', 'settings': {'stability': 0.4, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True}}
V.update(ep.get('voice', {}))
text = ' '.join(b['text'].strip() for b in ep['script'])
sig = hashlib.sha1(json.dumps([text, V], sort_keys=True).encode()).hexdigest()[:12]  # the same key voice.py checks

raw_mp3 = pub_dir(slug) / 'voice_raw.mp3'
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(src), '-vn', '-ac', '1', '-ar', '44100', '-b:a', '192k', str(raw_mp3)], check=True)

# the script's words, with the punctuation after each (voice.py reads it to size the pauses)
script, cur = [], None
for ch in text:  # the same word test as voice.py, so Indic vowel signs stay inside their word
    if wordy(ch):
        if cur is None:
            cur = {'w': '', 'p': ''}
            script.append(cur)
        cur['w'] += ch
    else:
        if ch.strip() and script:
            script[-1]['p'] += ch
        cur = None
lang = ep.get('language') or ('hi' if re.search('[ऀ-ॿ]', text) else 'ml' if re.search('[ഀ-ൿ]', text) else 'en')

def by_pauses():
    """Time words from the take's silences: a TTS read pauses at every . , : ? and ...; the longest silences are
    taken as those phrase breaks, and each phrase's words share its speech by their length. For languages whisper
    can't read (Malayalam), and as a fallback when it matches under half the words."""
    x = decode(raw_mp3)
    hop = int(0.01 * SR)
    rms = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, 'same')[::hop] + 1e-12)
    quiet = 20 * np.log10(rms / rms.max()) < -38
    gaps, k = [], 0
    while k < len(quiet):
        if quiet[k]:
            j = k
            while j < len(quiet) and quiet[j]:
                j += 1
            gaps.append((k * 0.01, j * 0.01))
            k = j
        else:
            k += 1
    loud = np.flatnonzero(~quiet)
    t_on, t_off = loud[0] * 0.01, (loud[-1] + 1) * 0.01
    inner = [g for g in gaps if g[0] > t_on and g[1] < t_off and g[1] - g[0] >= 0.02]
    phrases, cur_p = [], []
    for n, w in enumerate(script):
        cur_p.append(n)
        if re.search(r"[.,:;?!।…]", w['p']) or n == len(script) - 1:
            phrases.append(cur_p)
            cur_p = []
    # Fit the breaks: each phrase should last about its letter count times the read's pace, and a break prefers a
    # long silence (more so after a full stop than a comma). Dynamic programming over the candidate silences.
    size = [sum(len(script[n]['w']) + 1 for n in ph) for ph in phrases]
    pace = (t_off - t_on - sum(e - s for s, e in inner)) / sum(size)
    full = [bool(re.search(r"[.:;?!।…]", script[ph[-1]]['p'])) for ph in phrases]
    edge = [(None, t_on)] + [(g[0], g[1]) for g in inner] + [(t_off, None)]  # (speech ends, next speech starts)
    n_p, n_e = len(phrases), len(edge)
    INF = float('inf')
    best = [[INF] * n_e for _ in range(n_p + 1)]
    back = [[0] * n_e for _ in range(n_p + 1)]
    best[0][0] = 0.0
    for i in range(1, n_p + 1):
        want = size[i - 1] * pace
        last = i == n_p
        for b in range(1, n_e):
            if last != (b == n_e - 1):
                continue
            gap = 0.0 if last else edge[b][1] - edge[b][0]
            reward = gap * (2.0 if full[i - 1] else 1.0)
            for a in range(b):
                if best[i - 1][a] == INF:
                    continue
                dur = edge[b][0] - edge[a][1]
                if dur <= 0:
                    continue
                c = best[i - 1][a] + (dur - want) ** 2 / want - reward
                if c < best[i][b]:
                    best[i][b], back[i][b] = c, a
    spans, b = [], n_e - 1
    for i in range(n_p, 0, -1):
        a = back[i][b]
        spans.append((edge[a][1], edge[b][0]))
        b = a
    spans.reverse()
    out = [None] * len(script)
    for ph, (s, e) in zip(phrases, spans):
        weight = [len(script[n]['w']) + 2 for n in ph]
        pos = s
        for n, wt in zip(ph, weight):
            d = (e - s) * wt / sum(weight)
            out[n] = (pos, pos + d)
            pos += d
    return out


heard, times, matched = [], [None] * len(script), 0
if lang != 'ml':  # whisper's small model can't read Malayalam: go straight to the pauses
    from faster_whisper import WhisperModel

    model = WhisperModel('small', device='cpu', compute_type='int8')
    segs, _ = model.transcribe(str(raw_mp3), language=lang, word_timestamps=True, initial_prompt=text)
    for s in segs:
        for w in s.words:
            parts = [p for p in re.split(r"[\s.,!?।:;\-]+", w.word) if p] or ['']
            for part in parts:
                heard.append({'w': part, 's': w.start, 'e': w.end})


def key(w):
    return ''.join(ch for ch in w.lower() if wordy(ch) and ch not in "'’")


if heard:
    sm = difflib.SequenceMatcher(None, [key(w['w']) for w in script], [key(h['w']) for h in heard], autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            times[a + k] = (heard[b + k]['s'], heard[b + k]['e'])
    matched = sum(t is not None for t in times)
how = f'{matched} matched by whisper'
if matched < len(script) / 2:
    times, how = by_pauses(), 'timed from the pauses'
# unmatched runs (300,000 heard for "three hundred thousand"): spread them over the gap between their neighbours
i = 0
while i < len(script):
    if times[i] is None:
        j = i
        while j < len(script) and times[j] is None:
            j += 1
        t0 = times[i - 1][1] if i else 0.0
        t1 = times[j][0] if j < len(script) else heard[-1]['e']
        step = (t1 - t0) / (j - i)
        for k in range(i, j):
            times[k] = (t0 + step * (k - i), t0 + step * (k - i + 1))
        print(f'  spread {j - i} unmatched word(s): {" ".join(w["w"] for w in script[i:j])}')
        i = j
    else:
        i += 1

words = [{'w': w['w'], 's': round(s, 3), 'e': round(e, 3), 'p': w['p']} for w, (s, e) in zip(script, times)]
save_json(out_dir(slug) / 'words_raw.json', words)
meta = load_json(out_dir(slug) / 'voice_meta.json', {})
save_json(out_dir(slug) / 'voice_meta.json', {**meta, 'sig': sig, 'chars': len(text), 'source': str(src)})
print(f'{len(words)} words timed from {src.name} ({how})')

subprocess.run([sys.executable, str(Path(__file__).with_name('voice.py')), slug], check=True)

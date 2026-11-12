"""Step 2, the licensed route: Azure Speech reads the script, then voice_file.py times it. Run from the studio folder.

python <skill>/scripts/azure_voice.py --check   tests the key and looks up the voice (costs nothing)
python <skill>/scripts/azure_voice.py <slug>    voices the episode

Needs AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in the environment or the nearest .env above the studio. Never printed.
episode.json: "voice": {"engine": "azure", "id": "ml-IN-SobhanaNeural", "language": "Malayalam (India)", "rate": "+0%"}
Long scripts go in several requests, split at sentence ends, because one request stops at 10 minutes of audio.
"""
import os, re, subprocess, sys, time, wave
from pathlib import Path
from xml.sax.saxutils import escape, quoteattr

import numpy as np
import requests

from wi import STUDIO, load_episode, out_dir, read_env

VOICE = 'ml-IN-SobhanaNeural'
RATE_HZ = 48000
CHUNK = 3000  # characters per request: about 5 minutes of Malayalam, well under the limit
JOIN = 0.6  # seconds of silence between requests, so a join reads as a sentence break
AGENT = 'what-if-azure-voice'


def settings():
    """The key and region, by name only."""
    names = ['AZURE_SPEECH_KEY', 'AZURE_SPEECH_REGION']
    found = {n: os.environ.get(n) for n in names}
    for d in [STUDIO, *STUDIO.parents]:
        p = d / '.env'
        if p.exists():
            for line in read_env(p).splitlines():
                k, _, v = line.partition('=')
                if k.strip() in names and not found[k.strip()]:
                    found[k.strip()] = v.strip().strip('"\'')
    missing = [n for n in names if not found[n]]
    if missing:
        raise SystemExit(f'Missing {" and ".join(missing)}: add to the .env file at the top of the project.')
    region = found['AZURE_SPEECH_REGION'].lower().replace(' ', '')
    if not re.fullmatch('[a-z0-9]+', region):
        raise SystemExit('AZURE_SPEECH_REGION should look like centralindia.')
    return found['AZURE_SPEECH_KEY'], region


def chunks(text, limit=CHUNK):
    out, cur = [], ''
    for s in re.split(r'(?<=[.?!…:।])\s+', text):
        if cur and len(cur) + len(s) + 1 > limit:
            out.append(cur)
            cur = s
        else:
            cur = f'{cur} {s}'.strip()
    return out + [cur] if cur else out


def ssml(text, voice, rate):
    lang = voice[:5]
    return (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang={quoteattr(lang)}>'
            f'<voice name={quoteattr(voice)}><prosody rate={quoteattr(rate)}>{escape(text)}</prosody></voice></speak>')


def fail(r):
    if r.status_code in (401, 403):
        raise SystemExit(f'Azure refused the key ({r.status_code}): check AZURE_SPEECH_KEY and AZURE_SPEECH_REGION.')
    raise SystemExit(f'Azure error {r.status_code}: {r.text[:200]}')


def speak(text, voice, rate, key, region):
    """One request, as raw 16-bit mono samples. Retries when Azure says to slow down."""
    for attempt in range(6):
        r = requests.post(f'https://{region}.tts.speech.microsoft.com/cognitiveservices/v1',
                          data=ssml(text, voice, rate).encode('utf-8'), timeout=300,
                          headers={'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml',
                                   'X-Microsoft-OutputFormat': 'raw-48khz-16bit-mono-pcm', 'User-Agent': AGENT})
        if r.status_code == 200:
            return r.content
        if r.status_code != 429 and r.status_code < 500:
            fail(r)
        time.sleep(float(r.headers.get('Retry-After') or 2 ** attempt))
    fail(r)


def check():
    key, region = settings()
    r = requests.get(f'https://{region}.tts.speech.microsoft.com/cognitiveservices/voices/list', timeout=60,
                     headers={'Ocp-Apim-Subscription-Key': key, 'User-Agent': AGENT})
    if r.status_code != 200:
        fail(r)
    hit = [v for v in r.json() if v.get('ShortName') == VOICE]
    if not hit:
        raise SystemExit(f'The key works, but {VOICE} is not offered in {region}.')
    print(f'Key works. {VOICE} is available in {region} ({hit[0].get("VoiceType", "type unknown")}).')


def main(slug):
    ep = load_episode(slug)
    V = ep.get('voice', {})
    if V.get('engine') != 'azure':
        raise SystemExit(f'{slug}: set "engine": "azure" in the episode.json voice block first.')
    voice, rate = V.get('id', VOICE), V.get('rate', '+0%')
    text = ' '.join(b['text'].strip() for b in ep['script'])
    key, region = settings()
    parts = chunks(text)
    print(f'{len(text)} characters to Azure ({voice}, {len(parts)} request(s))')
    gap = bytes(2 * int(RATE_HZ * JOIN))
    pcm = gap.join(speak(p, voice, rate, key, region) for p in parts)
    x = np.frombuffer(pcm, dtype='<i2').astype(np.float64) / 32768
    mean_db = 10 * np.log10(np.mean(x ** 2) + 1e-12)
    print(f'{len(x) / RATE_HZ:.1f} s of audio, {mean_db:.1f} dB mean')
    if mean_db < -45:
        raise SystemExit('The audio is near-silent: stopping before it reaches the episode.')
    take = out_dir(slug) / 'voice_azure.wav'
    with wave.open(str(take), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE_HZ)
        w.writeframes(pcm)
    subprocess.run([sys.executable, str(Path(__file__).with_name('voice_file.py')), slug, str(take)], check=True)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    check() if sys.argv[1] == '--check' else main(sys.argv[1])

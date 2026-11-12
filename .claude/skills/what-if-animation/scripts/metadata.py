"""YouTube metadata generator for What If Malayalam episodes.

Reads episode.json and produces youtube-metadata.json with:
  - YouTube title (Malayalam | English | What If Malayalam)
  - Description with science facts, timestamps, and Manglish SEO
  - Tags (Malayalam, Manglish, English)
  - Shorts title

Usage:
    python <skill>/scripts/metadata.py <slug>
    python <skill>/scripts/metadata.py fly-ml
    python <skill>/scripts/metadata.py --all          # generate for every episode with a final video
"""
import json, pathlib, re, sys, unicodedata

sys.stdout.reconfigure(encoding='utf-8')
STUDIO = pathlib.Path.cwd()
if not (STUDIO / 'src' / 'episodes').exists():
    raise SystemExit('Run this from the studio folder (the one with src/episodes and package.json).')

FINAL = STUDIO.parent / 'final-videos'

# ---------------------------------------------------------------- transliteration map
# Simple Malayalam → Manglish transliteration for SEO keywords
TRANSLIT = {
    'ചന്ദ്രൻ': 'chandran', 'ഗുരുത്വാകർഷണം': 'guruthwakarshnam',
    'പറക്കാൻ': 'parakkan', 'വേഗത': 'vegatha', 'സമയം': 'samayam',
    'മൃഗങ്ങൾ': 'mrugangal', 'മനസ്സ്': 'manass', 'നിശ്ചലം': 'nishchalam',
    'എലികൾ': 'elikal', 'ഭൂകമ്പം': 'bhookampam', 'ഓക്സിജൻ': 'oxygen',
    'മരണ': 'marana', 'ശാസ്ത്രം': 'shaasthram', 'ആനിമേഷൻ': 'animation',
}

# Common What If topics → English keywords
TOPIC_KEYWORDS = {
    'fly': ['fly', 'flying', 'flight', 'oxygen', 'altitude'],
    'gravity': ['gravity', 'reverse gravity', 'zero gravity', 'floating'],
    'moon': ['moon', 'moon vanish', 'tides', 'moonlight'],
    'speed': ['speed', '10x speed', 'fast', 'reaction time'],
    'freeze': ['freeze time', 'time stop', 'frozen', 'pause time'],
    'animals': ['talk to animals', 'animal language', 'rats', 'birds'],
    'mind': ['mind reading', 'telepathy', 'thoughts'],
    'snap': ['snap', 'disappear', 'vanish'],
    'blink': ['blink', 'teleport'],
    'rewind': ['rewind time', 'time travel', 'go back'],
    'invisible': ['invisible', 'invisibility'],
    'shrink': ['shrink', 'tiny', 'microscopic'],
    'rain': ['rain', 'kerala rain', 'monsoon', 'heavy rain'],
    'flood': ['flood', 'kerala flood', '2018 flood'],
    'monsoon': ['monsoon', 'kerala monsoon', 'mazha'],
    'sea': ['sea level rise', 'sea level', 'coast'],
}

# ---------------------------------------------------------------- helpers

def load_episode(slug):
    p = STUDIO / 'src' / 'episodes' / slug / 'episode.json'
    if not p.exists():
        raise SystemExit(f'No episode.json at {p}')
    return json.loads(p.read_text(encoding='utf-8'))


def extract_topic_keys(slug, topic):
    """Find matching topic keywords from slug and topic string."""
    keys = set()
    slug_base = slug.replace('-ml', '').replace('-short', '')
    for key, words in TOPIC_KEYWORDS.items():
        if key in slug_base or key in topic.lower():
            keys.update(words)
    return list(keys)


def mal_title_to_line(title_arr):
    """Join the title array into a single Malayalam title line."""
    return ' '.join(title_arr).strip()


def extract_english_title(topic):
    """Pull the English description from the topic field."""
    # topic is like "What if you could fly? Part 1 (Malayalam, long-form)"
    # Strip the parenthetical
    clean = re.sub(r'\s*\(.*?\)\s*', '', topic).strip()
    # Remove trailing punctuation clutter
    clean = clean.rstrip('.')
    return clean


def get_science_section(ep):
    """Format science claims for the description."""
    science = ep.get('science', [])
    if not science:
        return ''
    lines = ['', '🔬 ശാസ്ത്ര വസ്തുതകൾ / Science Facts:']
    for i, s in enumerate(science, 1):
        claim = s.get('claim', '')
        source = s.get('source', '')
        lines.append(f'  {i}. {claim}')
        if source:
            lines.append(f'     📚 {source}')
    return '\n'.join(lines)


def get_script_text(ep):
    """Get the full script text for word count."""
    return ' '.join(b['text'] for b in ep.get('script', []))


def transliterate_title(title_arr):
    """Try to transliterate Malayalam title words to Manglish."""
    result = []
    for word in ' '.join(title_arr).split():
        if word in TRANSLIT:
            result.append(TRANSLIT[word])
        else:
            result.append(word)
    return ' '.join(result)


def generate_metadata(slug):
    ep = load_episode(slug)
    title_arr = ep.get('title', [slug])
    topic = ep.get('topic', '')
    mal_title = mal_title_to_line(title_arr)
    eng_title = extract_english_title(topic)
    # An episode's own "seo": {"keywords": [...]} comes first: the generic map can't know every topic.
    seo = ep.get('seo', {})
    topic_keys = list(dict.fromkeys(seo.get('keywords', []) + extract_topic_keys(slug, topic)))
    script_text = get_script_text(ep)
    accent = ep.get('accent', '')

    # --- YouTube Title ---
    # Format: [Malayalam Title] | [English Translation] | What If Malayalam
    yt_title = f'{mal_title} | {eng_title} | What If Malayalam'

    # --- Shorts Title ---
    # Short, punchy, with emoji and hashtags
    short_mal = mal_title if len(mal_title) < 30 else title_arr[0] if title_arr else mal_title[:30]
    shorts_title = f'{short_mal} 😱 #WhatIfMalayalam #Shorts'

    # --- Tags ---
    base_tags = [
        'what if malayalam',
        'malayalam science video',
        'malayalam animation',
        'what if enthaavum',
        'stick figure animation malayalam',
        'malayalam cartoon',
        'science malayalam',
        'enthu sambhavikkum',
        'malayalam explainer',
        'what if scenario malayalam',
    ]
    # Add topic-specific tags
    topic_tags = list(seo.get('keywords', []))
    # never stack the words a keyword already has ('what if what if malayalam', 'kochi malayalam malayalam')
    topic_tags += [f'what if {k}' for k in topic_keys[:5] if 'what if' not in k.lower()]
    topic_tags += [f'{k} malayalam' for k in topic_keys[:3] if 'malayalam' not in k.lower()]
    # Add Manglish transliteration
    manglish = transliterate_title(title_arr)
    if manglish != mal_title:
        topic_tags.append(manglish)
    # Add the accent word transliterated
    if accent and accent in TRANSLIT:
        topic_tags.append(TRANSLIT[accent])
    tags = base_tags + topic_tags
    # Deduplicate preserving order
    seen = set()
    tags = [t for t in tags if not (t.lower() in seen or seen.add(t.lower()))]

    # --- Description ---
    # First line: the question in Malayalam
    first_beat = ep.get('script', [{}])[0].get('text', '')
    # Find the premise beat (usually beat 2 or the title card)
    premise = ''
    for b in ep.get('script', []):
        if 'premise' in b.get('beat', '').lower() or 'title' in b.get('beat', '').lower():
            premise = b['text']
            break
    if not premise:
        premise = mal_title + '?'

    science_section = get_science_section(ep)

    # Check for multi-part
    part_info = ''
    if ep.get('continues'):
        part_info = f'\n▶️ അടുത്ത ഭാഗം ചാനലിൽ! / Next part on the channel!'
    if ep.get('teaser_for'):
        part_info = f'\n▶️ Full video: search "{ep["teaser_for"]}" on this channel!'

    # Second paragraph: the comment question (the last line), never a repeat of the opening line.
    last_line = (ep.get('script') or [{}])[-1].get('text', '')
    second = seo.get('hook') or (f'💬 {last_line} കമന്റ് ചെയ്യൂ!' if last_line and last_line != premise else '')
    if first_beat and first_beat != premise and not seo.get('hook'):
        second = (first_beat[:200] + '\n\n' + second).strip()
    kw_line = ', '.join(['Malayalam science video', 'What if Malayalam'] + topic_keys[:6])

    desc = f"""{premise}

{second}

🎬 What If Malayalam - ശാസ്ത്രവും ഭാവനയും ഒന്നിക്കുന്ന ആനിമേഷൻ!
Science + Imagination in Malayalam animation.
{science_section}
{part_info}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Search keywords / തിരയൽ:
{kw_line}
{manglish if manglish != mal_title else ''}

#WhatIfMalayalam #MalayalamScience #MalayalamAnimation #ScienceMalayalam #WhatIf
{' '.join('#' + k.replace(' ', '') for k in topic_keys[:4] if k.replace(' ', '').lower() not in ('whatifmalayalam', 'malayalamscience', 'malayalamanimation', 'sciencemalayalam', 'whatif'))}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

© What If Malayalam — Original stick-figure animation.
All science facts are sourced and checked. See the claims above.
""".strip()

    # Clean up multiple blank lines
    desc = re.sub(r'\n{3,}', '\n\n', desc)

    metadata = {
        'youtube_title': yt_title,
        'shorts_title': shorts_title,
        'description': desc,
        'tags': tags[:30],  # YouTube allows max ~500 chars of tags
        'language': 'ml',
        'category': 'Education',  # YouTube category
    }

    return metadata


def main():
    if len(sys.argv) < 2:
        raise SystemExit('Usage: python metadata.py <slug> or python metadata.py --all')

    if sys.argv[1] == '--all':
        # Generate for every episode that has a final video
        ep_dir = STUDIO / 'src' / 'episodes'
        slugs = sorted(d.name for d in ep_dir.iterdir() if d.is_dir() and (d / 'episode.json').exists())
        for slug in slugs:
            try:
                meta = generate_metadata(slug)
                out = STUDIO / 'out' / slug
                out.mkdir(parents=True, exist_ok=True)
                out_path = out / 'youtube-metadata.json'
                out_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
                print(f'✓ {slug}: {out_path}')
            except Exception as e:
                print(f'✗ {slug}: {e}')
        return

    slug = sys.argv[1]
    meta = generate_metadata(slug)
    out = STUDIO / 'out' / slug
    out.mkdir(parents=True, exist_ok=True)
    out_path = out / 'youtube-metadata.json'
    out_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'✓ Written to {out_path}')
    print(f'\n📋 YouTube Title:\n   {meta["youtube_title"]}')
    print(f'\n📋 Shorts Title:\n   {meta["shorts_title"]}')
    print(f'\n📋 Tags ({len(meta["tags"])}):\n   {", ".join(meta["tags"][:10])}...')
    print(f'\n📋 Description preview:\n   {meta["description"][:300]}...')


if __name__ == '__main__':
    main()

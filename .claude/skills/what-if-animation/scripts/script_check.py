"""Step 1 check, before voicing: the mechanical half of the script rules in references/formula.md.
Flags banned stock phrases, three-word phrases reused from other episodes, an even (machine-like) rhythm, a word
count off the format's budget, a missing "നീ", and a missing mid or closing question. It can't judge whether the
script is good: the read-aloud questions in formula.md do that.

python <skill>/scripts/script_check.py <slug>
"""
import re, statistics, sys

from wi import STUDIO, load_episode

BANNED = ['ഇത് സത്യമാണ്', "that's real", 'ഇതൊരു യാഥാർത്ഥ്യമാണ്', 'പക്ഷേ ഒരു പ്രശ്നമുണ്ട്', 'പക്ഷേ ഒരു കുഴപ്പമുണ്ട്',
          'ആലോചിച്ചു നോക്കൂ', 'സങ്കൽപ്പിച്ചു നോക്കൂ', 'നമുക്ക് നോക്കാം', 'അതിശയകരം', 'അവിശ്വസനീയം']
YOU = ['നീ', 'നിന്റെ', 'നിനക്ക്', 'നിന്നെ', 'നിന്നോട്']


def words(t):
    return re.findall(r'[\wഀ-ൿ‌‍]+', t.lower())


def grams(t, n=3):
    w = words(t)
    return {' '.join(w[i:i + n]) for i in range(len(w) - n + 1)}


slug = sys.argv[1]
ep = load_episode(slug)
lines = [s['text'] for s in ep['script']]
text = ' '.join(lines)
short = bool(ep.get('format'))
flags = []

n = len(words(text))
lo, hi = (30, 50) if short else (220, 400)  # talk less (user, 11 Nov 2026): the picture carries the story
if not lo <= n <= hi:
    flags.append(f'{n} words; a {"Short" if short else "long video"} wants {lo}-{hi} (about 1.7 words a second)')

for b in BANNED:
    for i, t in enumerate(lines, 1):
        if b in t.lower():
            flags.append(f'line {i}: stock phrase "{b}"')

def base(s):
    return s.replace('-short', '').removesuffix('-ml')


others = {}
for p in (STUDIO / 'src' / 'episodes').glob('*/episode.json'):
    if base(p.parent.name) == base(slug):  # itself, or a Short cut from its own long video
        continue
    try:
        o = load_episode(p.parent.name)
    except Exception:
        continue
    for g in grams(' '.join(s.get('text', '') for s in o.get('script', []))):
        others.setdefault(g, p.parent.name)
for i, t in enumerate(lines, 1):
    hits = [f'"{g}" ({others[g]})' for g in sorted(grams(t)) if g in others]
    if hits:
        flags.append(f'line {i}: reused from another episode: {", ".join(hits[:3])}')

lens = [len(words(t)) for t in lines]
if len(lens) > 4:
    spread = statistics.pstdev(lens)
    if spread < 2.0:
        flags.append(f'even rhythm: every line {min(lens)}-{max(lens)} words (spread {spread:.1f}); mix very short '
                     'lines with longer ones')
    if min(lens) > 3:
        flags.append('no line of three words or fewer; short lines are what land a moment')

if not any(y in w for w in words(text) for y in YOU):
    flags.append('no "നീ" anywhere; the viewer must be in it (true-story mode too: open on their own day)')
qs = [i for i, t in enumerate(lines) if '?' in t]
if not qs or qs[-1] < len(lines) - 2:
    flags.append('no comment question at the end')
mid = [i for i in qs if 0.2 * len(lines) <= i <= 0.75 * len(lines)]
if not mid:
    flags.append('no question to the viewer near the middle')
elif not ep['script'][mid[0]].get('hold'):
    flags.append(f'line {mid[0] + 1}: the mid question needs a "hold" of about 1 s')

print(f'{slug}: {n} words, {len(lines)} lines')
for f in flags:
    print('  FLAG', f)
print('  clean' if not flags else f'  {len(flags)} flag(s): fix, then answer the read-aloud questions in formula.md')

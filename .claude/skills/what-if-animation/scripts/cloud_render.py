"""Render on GitHub Actions instead of the laptop (same output as master.py, the laptop stays cool).

python <skill>/scripts/cloud_render.py <slug> [--preview] [--no-wait]   push, upload audio, start, wait, download
python <skill>/scripts/cloud_render.py <slug> --fetch [--preview]       download the latest finished cloud render

Needs: `gh auth login` done once and the what-if folder pushed to a GitHub repo (public = unlimited free minutes).
Steps: commit + push the code, upload public/<slug> as release asset assets-<slug>/public.zip (skipped when the
audio has not changed), start .github/workflows/render.yml, wait for it, download the MP4 (+ report.json) into
out/<slug>/. A final that meets -14 LUFS / -1 dBTP is copied to final-videos/ like master.py does.
A long video takes about 1-3 hours on the runner; use --no-wait and --fetch later, or run it in the background.
"""
import hashlib, json, pathlib, shutil, subprocess, sys, tempfile, time, zipfile

from wi import STUDIO, out_dir, pub_dir

slug = sys.argv[1]
args = sys.argv[2:]
mode = 'preview' if '--preview' in args else 'final'
ROOT = STUDIO.parent
od = out_dir(slug)
title = f'render {slug} {mode}'


def run(cmd, **kw):
    return subprocess.run(cmd, cwd=ROOT, check=True, text=True, encoding='utf-8', **kw)


def out(cmd):
    return run(cmd, capture_output=True).stdout.strip()


def latest_run(status=None, since=None):
    q = ['gh', 'run', 'list', '--workflow', 'render.yml', '--limit', '30', '--json', 'databaseId,displayTitle,status,conclusion,createdAt']
    for r in json.loads(out(q)):
        if r['displayTitle'] != title or (status and r['conclusion'] != status) or (since and r['createdAt'] < since):
            continue
        return r
    return None


def fetch(run_id):
    tmp = tempfile.mkdtemp()
    run(['gh', 'run', 'download', str(run_id), '-n', f'{slug}-{mode}', '-D', tmp])
    for f in pathlib.Path(tmp).iterdir():
        shutil.copy2(f, od / f.name)
        print('downloaded', od / f.name)
    shutil.rmtree(tmp, ignore_errors=True)
    if mode == 'preview':
        print('preview ready, not a final:', od / f'{slug}-240p.mp4')
        return
    rep = json.loads((od / 'report.json').read_text(encoding='utf-8'))
    final = od / f'{slug}-final.mp4'
    ok = abs(rep['lufs'] + 14) <= 0.5 and rep['true_peak_dbtp'] <= -1.0
    print(f"{rep['seconds']} s, {rep['lufs']} LUFS, {rep['true_peak_dbtp']} dBTP:", 'loudness OK' if ok else '! loudness off target')
    if ok:
        shelf = ROOT / 'final-videos'
        shelf.mkdir(exist_ok=True)
        shutil.copy2(final, shelf / final.name)
        print('copied to', shelf / final.name)


if subprocess.run(['gh', 'auth', 'status'], capture_output=True).returncode:
    sys.exit('GitHub CLI is not logged in: run `gh auth login` once, then try again.')

if '--fetch' in args:
    r = latest_run(status='success')
    if not r:
        sys.exit(f'no finished cloud render for "{title}"')
    fetch(r['databaseId'])
    sys.exit()

# 1. code: commit and push whatever the render needs (the .gitignore whitelists it)
run(['git', 'add', '-A'])
if subprocess.run(['git', 'diff', '--cached', '--quiet'], cwd=ROOT).returncode:
    run(['git', 'commit', '-q', '-m', f'{slug}: cloud {mode} render'])
run(['git', 'push', '-q'])

# 2. audio: public/<slug> as a release asset, only when it changed
src = pub_dir(slug)
files = sorted(f for f in src.iterdir() if f.is_file() and '_raw' not in f.stem)
if not any(f.stem == 'voice' for f in files):
    sys.exit(f'no voice in {src}: make the voice first')
h = hashlib.sha1()
for f in files:
    h.update(f.name.encode()); h.update(f.read_bytes())
sha = h.hexdigest()
mark = od / '.cloud_assets_sha'
tag = f'assets-{slug}'
have = subprocess.run(['gh', 'release', 'view', tag], cwd=ROOT, capture_output=True).returncode == 0
if not have or not mark.exists() or mark.read_text() != sha:
    zd = pathlib.Path(tempfile.mkdtemp())
    z = zd / 'public.zip'  # the asset name the workflow downloads (a #label would only change the display name)
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_STORED) as zf:
        for f in files:
            zf.write(f, f.name)
    print(f'uploading audio ({z.stat().st_size / 1e6:.0f} MB)')
    if not have:
        run(['gh', 'release', 'create', tag, '--title', f'{slug} audio', '--notes', 'Audio for the cloud render.', '--latest=false'])
    run(['gh', 'release', 'upload', tag, str(z), '--clobber'])
    shutil.rmtree(zd, ignore_errors=True)
    mark.write_text(sha)
else:
    print('audio unchanged, not re-uploading')

# 3. start the workflow and find its run
since = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(time.time() - 5))
run(['gh', 'workflow', 'run', 'render.yml', '-f', f'slug={slug}', '-f', f'mode={mode}'])
r = None
for _ in range(30):
    time.sleep(3)
    r = latest_run(since=since)
    if r:
        break
if not r:
    sys.exit('started, but could not find the run: check the Actions tab, then use --fetch')
rid = r['databaseId']
print('cloud render started:', out(['gh', 'run', 'view', str(rid), '--json', 'url', '-q', '.url']))
if '--no-wait' in args:
    print(f'later: python <skill>/scripts/cloud_render.py {slug} --fetch' + (' --preview' if mode == 'preview' else ''))
    sys.exit()

# 4. wait, then download
t0 = time.time()
if subprocess.run(['gh', 'run', 'watch', str(rid), '-i', '60', '--exit-status'], cwd=ROOT, stdout=subprocess.DEVNULL).returncode:
    run(['gh', 'run', 'view', str(rid), '--log-failed'])
    sys.exit('cloud render failed (log above)')
print(f'cloud render done in {(time.time() - t0) / 60:.0f} min')
fetch(rid)

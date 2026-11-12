import React from 'react';
import { AbsoluteFill, Freeze } from 'remotion';
import { FONT } from './fonts';

/**
 * The live storyboard: every shot of an episode at its key frame, in one frame, in Remotion Studio. Edit a shot and
 * the sheet redraws on save (hot reload), so a board needs no render while you work: render `stills.mjs` + `board.py`
 * only once, for the approval sheet.
 * It also checks itself on every redraw: a tile whose text runs outside the frame (or into a Short's YouTube
 * button zone) gets a red border and a line in the list at the bottom. Dashed lines mark the Short's safe zone.
 *   Studio: http://localhost:3430/<Id>Sheet
 */
type SheetEp = {
  id: string;
  Board: React.FC;
  shotCount: number;
  width?: number;
  height?: number;
  timeline: { shots: { id: string; key: number; len: number; size?: string; note?: string }[] };
};

export const sheetSize = (ep: { shotCount: number; width?: number; height?: number }) => {
  const W = ep.width ?? 1920;
  const H = ep.height ?? 1080;
  const tall = H > W;
  const cols = tall ? 6 : 4;
  const tw = tall ? 320 : 470;
  const th = Math.round((tw * H) / W);
  const rows = Math.ceil(ep.shotCount / cols);
  return { W, H, tall, cols, tw, th, width: cols * (tw + 20) + 20, height: rows * (th + 70) + 20 + 200 };
};

export const Sheet: React.FC<{ ep: SheetEp }> = ({ ep }) => {
  const g = sheetSize(ep);
  const k = g.tw / g.W;
  const ref = React.useRef<HTMLDivElement>(null);
  const [bad, setBad] = React.useState<Record<string, string[]>>({});
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const check = () => {
      const found: Record<string, string[]> = {};
      root.querySelectorAll<HTMLDivElement>('[data-shot]').forEach((tile) => {
        const id = tile.dataset.shot as string;
        const box = tile.getBoundingClientRect();
        const s = box.width / g.W;
        tile.querySelectorAll('text').forEach((tx) => {
          const b = tx.getBoundingClientRect();
          if (!b.width || !tx.textContent?.trim() || b.height / s < 34) return; // prop scribbles and calendar digits are set dressing
          const l = (b.left - box.left) / s;
          const r = (b.right - box.left) / s;
          const tp = (b.top - box.top) / s;
          const bt = (b.bottom - box.top) / s;
          const name = `"${tx.textContent.trim().slice(0, 18)}"`;
          if (l < 24 || r > g.W - 24 || tp < 24 || bt > g.H - 24) (found[id] ??= []).push(`${name} clipped`);
          else if (g.tall && bt > g.H * 0.78 && tp > 200) (found[id] ??= []).push(`${name} in the button zone`);
        });
      });
      setBad((old) => (JSON.stringify(old) === JSON.stringify(found) ? old : found));
    };
    const h = setTimeout(check, 300);
    document.fonts?.ready.then(check);
    return () => clearTimeout(h);
  });
  const ids = Object.keys(bad);
  return (
    <AbsoluteFill style={{ backgroundColor: '#14111E', fontFamily: FONT.ui, color: '#F6EFE3' }}>
      <div ref={ref} style={{ position: 'absolute', left: 20, top: 20, display: 'grid', gridTemplateColumns: `repeat(${g.cols}, ${g.tw}px)`, gap: '50px 20px' }}>
        {ep.timeline.shots.map((s, i) => (
          <div key={s.id}>
            <div data-shot={s.id} style={{ position: 'relative', width: g.tw, height: g.th, overflow: 'hidden', outline: bad[s.id] ? '6px solid #FF4A4A' : '1px solid #3A3446' }}>
              <div style={{ width: g.W, height: g.H, transform: `scale(${k})`, transformOrigin: '0 0' }}>
                <Freeze frame={i}><ep.Board /></Freeze>
              </div>
              {g.tall ? (
                <svg width={g.tw} height={g.th} style={{ position: 'absolute', inset: 0 }}>
                  <line x1={0} x2={g.tw} y1={g.th * 0.78} y2={g.th * 0.78} stroke="#FFFFFF" strokeOpacity={0.35} strokeDasharray="6 6" />
                  <line x1={g.tw * 0.86} x2={g.tw * 0.86} y1={g.th * 0.45} y2={g.th} stroke="#FFFFFF" strokeOpacity={0.35} strokeDasharray="6 6" />
                </svg>
              ) : null}
            </div>
            <div style={{ fontSize: 18, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: g.tw }}>
              <b style={{ color: '#FFB15A' }}>{i + 1} {s.id}</b> {s.size ?? ''} · key {s.key} · {(s.len / 30).toFixed(1)} s
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 20, bottom: 20, fontSize: 24, color: ids.length ? '#FF8A8A' : '#7FE0A0' }}>
        {ids.length ? ids.map((id) => `${id}: ${bad[id].join(', ')}`).join('   |   ') : 'text check: every line inside the frame'}
      </div>
    </AbsoluteFill>
  );
};

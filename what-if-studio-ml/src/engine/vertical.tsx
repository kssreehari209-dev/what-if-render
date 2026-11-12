import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { segAt, EpisodeDef, Timeline } from './episode';
import { clamp, easeOut, backOut } from './anim';
import { FONT } from './fonts';

/**
 * A 9:16 cut of a 16:9 episode, re-rendered (so it stays sharp) and reframed per shot: `x`, `y` the point of the
 * 1920x1080 frame to centre, `s` its scale (1.78 fills the height, 0.5625 fits the width). Shots that don't fill the
 * height sit on a blurred, darkened copy of themselves. Render it muted and lay the 16:9 master's audio under it.
 * Shorts extras, all optional: word-by-word captions from words.json, a hook header, a punch-in on every cut and a
 * progress bar.
 */
export type Reframe = Record<string, { x: number; s: number; y?: number }>;
export type Word = { w: string; s: number; e: number; p: string };
export type VerticalExtras = {
  words?: Word[];
  header?: [string, string];
  noHeader?: string[]; // shots that hide the header (the title card already says it)
  hot?: string[]; // words drawn in the accent colour
};

const Layer: React.FC<{ ep: EpisodeDef; x: number; y: number; s: number; filter?: string }> = ({ ep, x, y, s, filter }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${540 - x * s}px, ${960 - y * s}px) scale(${s})`, filter }}>
    <ep.Main />
  </div>
);

/** Words grouped into short caption lines: a break after punctuation, or every three words. */
const chunks = (words: Word[]) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w) => {
    cur.push(w);
    if (w.p.trim() || cur.length === 3) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
};

const Captions: React.FC<{ words: Word[]; sec: number; hot: string[] }> = ({ words, sec, hot }) => {
  const lines = React.useMemo(() => chunks(words), [words]);
  const line = lines.find((l, i) => sec >= l[0].s - 0.05 && sec < (lines[i + 1]?.[0].s ?? l[l.length - 1].e + 0.6) - 0.05);
  if (!line) return null;
  const inT = clamp((sec - line[0].s + 0.05) / 0.12);
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: 1540, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 22px', transform: `scale(${0.85 + 0.15 * backOut(inT)})`, opacity: inT }}>
      {line.map((w, i) => {
        const on = sec >= w.s && sec < w.e + 0.08;
        const said = sec >= w.s;
        const pop = on ? 1 + 0.12 * Math.sin(clamp((sec - w.s) / 0.18) * Math.PI) : 1;
        const isHot = hot.includes(w.w);
        return (
          <span key={i} style={{
            fontFamily: FONT.title, fontWeight: 800, fontSize: 92, lineHeight: 1.25, display: 'inline-block', transform: `scale(${pop})`,
            color: on ? (isHot ? '#FF8A3D' : '#FFE27A') : said ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
            WebkitTextStroke: '14px #120E22', paintOrder: 'stroke fill', textShadow: '0 8px 18px rgba(0,0,0,0.55)',
          }}>{w.w}{w.p.replace(/[^?!]/g, '')}</span>
        );
      })}
    </div>
  );
};

export const Vertical: React.FC<{ ep: EpisodeDef; tl: Timeline; frame: Reframe; extras?: VerticalExtras }> = ({ ep, tl, frame, extras = {} }) => {
  const f = useCurrentFrame();
  const seg = segAt(tl, f);
  const r = frame[seg.shot] ?? { x: 960, s: 1 };
  const y = r.y ?? 540;
  // a quick punch-in on every cut: the shot lands 7% big and settles
  const punch = 1 + 0.07 * (1 - easeOut(clamp((f - seg.a) / 7)));
  const s = r.s * punch;
  const fills = s * 1080 >= 1920;
  const sec = f / tl.fps;
  const showHead = extras.header && !(extras.noHeader ?? []).includes(seg.shot);
  const headIn = backOut(clamp(f / 8));
  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0C1E', overflow: 'hidden' }}>
      {fills ? null : <Layer ep={ep} x={r.x} y={540} s={(1920 / 1080) * 1.05} filter="blur(28px) brightness(0.4) saturate(1.2)" />}
      <Layer ep={ep} x={r.x} y={y} s={s} />
      {showHead && extras.header ? (
        <div style={{ position: 'absolute', top: 120, left: 20, right: 20, textAlign: 'center', transform: `scale(${headIn})` }}>
          <div style={{ fontFamily: FONT.ui, fontSize: 34, letterSpacing: 10, color: '#FFE27A', marginBottom: 6 }}>WHAT IF...</div>
          {extras.header.map((l, i) => (
            <div key={i} style={{ fontFamily: FONT.title, fontWeight: 800, fontSize: i ? 66 : 54, lineHeight: 1.25, whiteSpace: 'nowrap', color: i ? '#FF8A3D' : '#FFFFFF', WebkitTextStroke: '12px #120E22', paintOrder: 'stroke fill' }}>{l}</div>
          ))}
        </div>
      ) : null}
      {extras.words ? <Captions words={extras.words} sec={sec} hot={extras.hot ?? []} /> : null}
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 12, width: `${(f / Math.max(1, tl.total - 1)) * 100}%`, background: 'linear-gradient(90deg, #FFB15A, #FF5A4A)' }} />
    </AbsoluteFill>
  );
};

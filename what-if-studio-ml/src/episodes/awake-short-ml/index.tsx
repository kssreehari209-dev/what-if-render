import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, segAt, ShotMap, Timeline, clamp } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

// A native 9:16 episode (1080 x 1920): the engine's Episode and Board, with the frame, grade and fx drawn tall.
const W = 1080;
const H = 1920;
const tl = timeline as Timeline;
const SHOTS = shots as unknown as ShotMap;

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <KitDefs />
    <SetDefs />
    {children}
  </svg>
);

const Grade: React.FC<{ f: number }> = ({ f }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <defs>
      <radialGradient id="vVig" cx="50%" cy="50%" r="75%">
        <stop offset="55%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.55} />
      </radialGradient>
      <filter id="vGrain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(f / 2) % 97} />
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0" />
      </filter>
    </defs>
    <rect width={W} height={H} fill="url(#vVig)" />
    <rect width={W} height={H} filter="url(#vGrain)" />
  </svg>
);

const fxAt = (f: number) => {
  let flash = 0;
  let x = 0;
  let y = 0;
  for (const e of tl.fx) {
    if (e.kind === 'flash') flash = Math.max(flash, f === e.f ? e.o ?? 0.85 : f === e.f + 1 ? (e.o ?? 0.85) * 0.35 : 0);
    else if (f >= e.f && f < e.f + (e.len ?? 8)) {
      const k = (e.amp ?? 12) * (1 - (f - e.f) / (e.len ?? 8));
      x += Math.sin(f * 2.9) * k;
      y += Math.cos(f * 3.7) * k * 0.7;
    }
  }
  return { flash, x, y };
};

const Main: React.FC = () => {
  const f = useCurrentFrame();
  const seg = segAt(tl, f);
  const Shot = SHOTS[seg.shot];
  const info = tl.shots.find((s) => s.id === seg.shot);
  const t = seg.t0 + (f - seg.a);
  const { flash, x, y } = fxAt(f);
  const A = tl.audio;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0C1E' }}>
      <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${x || y ? 1.02 : 1})` }}>
        <Frame>{Shot ? <Shot t={t} len={info?.len ?? seg.b - seg.a} f={f} /> : null}</Frame>
      </AbsoluteFill>
      <Grade f={f} />
      {flash ? <AbsoluteFill style={{ backgroundColor: '#FFFFFF', opacity: flash }} /> : null}
      {/* a thin progress bar, as on the other Shorts */}
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 10, width: `${clamp(f / Math.max(1, tl.total - 1)) * 100}%`, background: 'linear-gradient(90deg, #FFB15A, #FF5A4A)' }} />
      {A.voice ? <Audio src={staticFile(A.voice)} volume={A.voiceVol ?? 1} /> : null}
      {A.sfx ? <Audio src={staticFile(A.sfx)} volume={A.sfxVol ?? 1} /> : null}
      {A.music ? <Audio src={staticFile(A.music)} volume={A.musicVol ?? 1} /> : null}
    </AbsoluteFill>
  );
};

const Board: React.FC = () => {
  const f = useCurrentFrame();
  const info = tl.shots[Math.min(f, tl.shots.length - 1)];
  const Shot = SHOTS[info.id];
  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0C1E' }}>
      <Frame>{Shot ? <Shot t={info.key} len={info.len} f={info.first + info.key} /> : null}</Frame>
      <Grade f={info.key} />
    </AbsoluteFill>
  );
};

export const awakeShortMl = {
  id: 'AwakeShortMl', timeline: tl, total: tl.total, shotCount: tl.shots.length, Main, Board, width: W, height: H,
};

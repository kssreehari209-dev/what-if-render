// net-ml's own pieces: the STD booth and its meter, the desk phone, the router, the ration counter and e-PoS, the sea
// floor and its cable, the volcano, the old radios, the Dubai bunk room, the hospital, the deed and the blue diary.
import React from 'react';
import { FONT, Glow, clamp, backOut, rnd, Look, Pose, SCH } from '../../engine';
import { Fig, Palm } from '../fly-ml/kit';
import { feet, Land } from '../monsoon-ml/kit';
import { CROWD } from '../phone-ml/kit';

export const INK = '#1A1230';
export const fig = (look: Look, x: number, g: number, s: number, extra: Partial<Pose> = {}, rim = 'rimR', shadow = 0.5) => (
  <Fig look={look} pose={{ x, y: feet(g, s), scale: s, ...extra }} rimId={rim} shadow={shadow} />
);

/** A pill with a day or a place on it, top left. */
export const Chip: React.FC<{ t: number; text: string; x?: number; y?: number; size?: number }> = ({ t, text, x = 70, y = 62, size = 46 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 6));
  const w = text.length * size * 0.56 + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={0} y={0} width={w} height={size + 46} rx={(size + 46) / 2} fill="#120E22" opacity={0.82} />
      <rect x={0} y={0} width={w} height={size + 46} rx={(size + 46) / 2} fill="none" stroke="#FFB15A" strokeWidth={4} />
      <text x={w / 2} y={size + 10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#F6EFE3">{text}</text>
    </g>
  );
};
/** Big outlined words, for a number on a story shot. */
export const Say: React.FC<{ x?: number; y: number; text: string; size?: number; color?: string; t?: number }> = ({ x = 960, y, text, size = 110, color = '#F6EFE3', t = 99 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  return <text x={x} y={y} textAnchor="middle" transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#120E22" strokeWidth={size / 7} paintOrder="stroke">{text}</text>;
};
/** The loading ring: an arc going round. */
export const Spinner: React.FC<{ x: number; y: number; r: number; t: number; c?: string }> = ({ x, y, r, t, c = '#F6EFE3' }) => (
  <g transform={`translate(${x} ${y}) rotate(${t * 9})`}>
    <circle r={r} fill="none" stroke={c} strokeOpacity={0.2} strokeWidth={r / 4.5} />
    <path d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`} fill="none" stroke={c} strokeWidth={r / 4.5} strokeLinecap="round" />
  </g>
);
/** No-signal mark: dead bars and a red cross. */
export const NoNet: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 99 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 6)) * s;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r={46} fill="#120E22" opacity={0.85} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-27 + i * 14} y={16 - i * 10} width={10} height={8 + i * 10} fill="#6A6478" />)}
      <path d="M -30 -30 L 30 30 M 30 -30 L -30 30" stroke="#FF4A3E" strokeWidth={9} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------- the junction and the booth
/** The STD booth seen from the road. Feet of the box at y. */
export const Booth: React.FC<{ x: number; y: number; s?: number; lit?: number; web?: number }> = ({ x, y, s = 1, lit = 1, web = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={210} ry={18} fill="#000" opacity={0.32} />
    <rect x={-170} y={-540} width={340} height={540} fill="#E2B02C" stroke={INK} strokeWidth={7} />
    <rect x={-186} y={-650} width={372} height={116} rx={8} fill="#C8352E" stroke={INK} strokeWidth={7} />
    <text y={-606} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={42} fill="#FFE27A">STD ISD</text>
    <text y={-556} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={36} fill="#F6EFE3">PCO</text>
    <rect x={-124} y={-490} width={248} height={490} fill="#23303E" stroke={INK} strokeWidth={6} />
    <rect x={-112} y={-478} width={224} height={300} fill="#8FBFCC" opacity={0.42 * lit + 0.1} />
    <path d="M -90 -470 L -30 -200 M 10 -470 L 70 -220" stroke="#fff" strokeOpacity={0.2} strokeWidth={14} />
    <circle cx={92} cy={-250} r={11} fill="#D9D0B4" stroke={INK} strokeWidth={4} />
    {web ? <path d={`M -170 -540 q 70 18 110 70 M -170 -540 q 18 74 66 118 M -170 -440 q 44 -30 78 -56 M -110 -540 q 0 36 -22 62`} stroke="#E8E4DA" strokeOpacity={0.7 * web} strokeWidth={3} fill="none" /> : null}
  </g>
);
/** The people in a line, drawn far to near, from (x0, g0) towards (x1, g1). */
export const Line: React.FC<{ x0: number; g0: number; s0: number; x1: number; g1: number; s1: number; n: number; t: number; seed?: number; face?: number; shift?: (i: number) => number }> = ({ x0, g0, s0, x1, g1, s1, n, t, seed = 3, face = 1, shift }) => (
  <g>
    {Array.from({ length: n }).map((_, j) => {
      const i = n - 1 - j;
      const k = i / Math.max(1, n - 1);
      const e = Math.pow(k, 1.5);
      const s = s0 + (s1 - s0) * e;
      const x = x0 + (x1 - x0) * e + (shift ? shift(i) : 0);
      const g = g0 + (g1 - g0) * e + (rnd(seed, i) - 0.5) * 8;
      const look = CROWD[Math.floor(rnd(seed + 1, i) * CROWD.length)];
      const ex: Partial<Pose> = { yaw: 0.55 * face, look: 0.4 * face, tilt: Math.sin(t / 34 + i) * 1.4, armR: { a: 8 + rnd(seed + 2, i) * 26, b: -14 }, expr: rnd(seed + 3, i) > 0.6 ? 'tired' : 'neutral' };
      return <g key={i}>{fig(look, x, g, s, ex, 'rimR', 0.35)}</g>;
    })}
  </g>
);
/** The kavala in the noon heat. Ground from y 700, road from 790. */
export const Kavala: React.FC<{ t: number; id: string; mode?: string; sun?: [number, number, number] }> = ({ t, id, mode = 'haze', sun = [1560, 150, 90] }) => (
  <g>
    <Land t={t} id={id} mode={mode} dry={0.55} y={660} sun={sun} palms={[-40, 1890]} hills={false} />
    {[[150, 300, '#8E6E58'], [460, 360, '#7A6456'], [1340, 340, '#86705E'], [1650, 280, '#7A5E52']].map(([x, h, c], i) => (
      <g key={i}>
        <rect x={(x as number) - 140} y={700 - (h as number)} width={280} height={h as number} fill={c as string} stroke={INK} strokeWidth={5} />
        <rect x={(x as number) - 160} y={700 - (h as number) - 20} width={320} height={26} fill="#5A3A30" stroke={INK} strokeWidth={4} />
        <rect x={(x as number) - 110} y={700 - (h as number) + 40} width={220} height={54} fill={['#2E7E5A', '#B8452E', '#2F6E9C', '#C9842E'][i]} stroke={INK} strokeWidth={4} />
        <rect x={(x as number) - 90} y={570} width={180} height={130} fill="#2C2432" stroke={INK} strokeWidth={4} />
      </g>
    ))}
    <rect x={-3000} y={700} width={8000} height={22} fill="#A6968A" stroke={INK} strokeWidth={3} />
    <rect x={-3000} y={722} width={8000} height={2000} fill="#6A6268" />
    {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-500 + i * 260} y={940} width={140} height={12} rx={4} fill="#EDE6D6" opacity={0.5} />)}
  </g>
);
/** Inside the booth: the wall, the shelf, the desk phone's place, the meter, and the glass door on the left. Shelf at y 640. */
export const BoothIn: React.FC<{ t: number; meter?: string; on?: number; glare?: number }> = ({ t, meter = '00:00', on = 1, glare = 1 }) => (
  <g>
    <rect x={-400} y={-300} width={2800} height={1700} fill="#4A3628" />
    {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-300 + i * 260} y={-300} width={6} height={1700} fill="#33241A" />)}
    {/* the glass door, bright street behind it */}
    <rect x={-400} y={-300} width={860} height={1700} fill="#E8C98E" />
    <rect x={-400} y={-300} width={860} height={1700} fill="#8FBFCC" opacity={0.25} />
    <Line x0={210} g0={930} s0={0.5} x1={60} g1={1180} s1={1.3} n={6} t={t} seed={8} face={1} />
    <rect x={440} y={-300} width={34} height={1700} fill="#1E1620" />
    <path d="M -40 -200 L 240 900 M 120 -200 L 400 900" stroke="#fff" strokeOpacity={0.14 * glare} strokeWidth={40} />
    <Glow x={120} y={440} r={700} kind="warm" o={0.45} />
    {/* the wall of numbers people wrote */}
    {Array.from({ length: 14 }).map((_, i) => <text key={i} x={1320 + rnd(5, i) * 420} y={110 + rnd(6, i) * 380} fontFamily={FONT.hand} fontSize={26} fill="#C9B69A" opacity={0.3} transform={`rotate(${(rnd(7, i) - 0.5) * 16} 1500 300)`}>{`${Math.floor(rnd(8, i) * 90000 + 10000)}`}</text>)}
    {/* the meter */}
    <g transform="translate(1540 300)">
      <rect x={-170} y={-70} width={340} height={140} rx={12} fill="#14101A" stroke={INK} strokeWidth={6} />
      <text y={34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={86} fill="#FF3A2E" opacity={on}>{meter}</text>
      <Glow x={0} y={0} r={190} kind="red" o={0.3 * on} />
    </g>
    <rect x={460} y={640} width={2000} height={34} fill="#6E4E36" stroke={INK} strokeWidth={5} />
    <rect x={460} y={674} width={2000} height={900} fill="#2E2028" />
  </g>
);
/** The push-button desk phone. `off` lifts the handset away. */
export const DeskPhone: React.FC<{ x: number; y: number; s?: number; off?: boolean }> = ({ x, y, s = 1, off }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={210} ry={18} fill="#000" opacity={0.35} />
    <path d="M -190 0 L -150 -150 L 150 -150 L 190 0 Z" fill="#B8A98E" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-58 + (i % 3) * 42} y={-132 + Math.floor(i / 3) * 31} width={34} height={25} rx={5} fill="#E8E0CC" stroke={INK} strokeWidth={3} />)}
    {off ? null : <path d="M -190 -170 Q 0 -240 190 -170 L 190 -130 Q 150 -146 130 -176 Q 0 -196 -130 -176 Q -150 -146 -190 -130 Z" fill="#8E8068" stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
  </g>
);
/** The keypad, huge, for the insert. `lit` is the index of a pressed key, -1 for none. */
export const Keypad: React.FC<{ x: number; y: number; s?: number; lit?: number }> = ({ x, y, s = 1, lit = -1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-380} width={600} height={760} rx={40} fill="#B8A98E" stroke={INK} strokeWidth={8} />
    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((d, i) => (
      <g key={d} transform={`translate(${-170 + (i % 3) * 170} ${-260 + Math.floor(i / 3) * 170})`}>
        <rect x={-68} y={-60} width={136} height={120} rx={18} fill={i === lit ? '#FFD27E' : '#EDE6D6'} stroke={INK} strokeWidth={6} />
        <text y={24} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={72} fill={INK}>{d}</text>
      </g>
    ))}
  </g>
);
export const Handset: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -240 -40 Q 0 -120 240 -40 L 240 40 Q 180 30 150 -30 Q 0 -60 -150 -30 Q -180 30 -240 40 Z" fill="#8E8068" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  </g>
);
export const CallRings: React.FC<{ x: number; y: number; t: number; c?: string }> = ({ x, y, t, c = '#FFE27A' }) => (
  <g>{[0, 1, 2].map((i) => { const p = ((t + i * 12) % 36) / 36; return <circle key={i} cx={x} cy={y} r={50 + p * 190} fill="none" stroke={c} strokeWidth={7} opacity={(1 - p) * 0.8} />; })}</g>
);

// ---------------------------------------------------------------- phones, router
/** The phone's chat with dad: header, the old number, a bubble. */
export const ChatHead: React.FC<{ name?: string; sub?: string }> = ({ name = 'അച്ഛൻ', sub = '+91 94•• ••• •••' }) => (
  <g>
    <rect x={-175} y={-340} width={350} height={120} fill="#2E3A4E" />
    <circle cx={-125} cy={-280} r={38} fill="#B98562" stroke="#F6EFE3" strokeWidth={4} />
    <text x={-74} y={-284} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3">{name}</text>
    <text x={-74} y={-246} fontFamily={FONT.ui} fontSize={22} fill="#AEB8C8">{sub}</text>
  </g>
);
export const Bubble: React.FC<{ y: number; text: string; ticks?: number; size?: number; me?: boolean }> = ({ y, text, ticks = 0, size = 30, me = false }) => (
  <g>
    <rect x={me ? -130 : -160} y={y} width={290} height={118} rx={18} fill={me ? '#CFE9C8' : '#FFFFFF'} stroke="#8E98A8" strokeWidth={2} />
    <text x={me ? 15 : -15} y={y + 56} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={size} fill="#1A1230">{text}</text>
    {ticks ? <g transform={`translate(${me ? 130 : 130} ${y + 96})`} stroke="#6A7484" strokeWidth={4} fill="none" strokeLinecap="round">
      <path d="M -20 0 l 6 7 l 12 -14" />
      {ticks > 1 ? <path d="M -8 0 l 6 7 l 12 -14" /> : null}
    </g> : null}
  </g>
);
export const Router: React.FC<{ x: number; y: number; s?: number; t: number; dead?: boolean; droop?: number }> = ({ x, y, s = 1, t, dead, droop = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={200} ry={15} fill="#000" opacity={0.35} />
    <path d={`M -130 -60 L ${-150 - droop * 90} ${-210 + droop * 120}`} stroke="#1A1622" strokeWidth={16} strokeLinecap="round" />
    <path d={`M 130 -60 L ${150 + droop * 90} ${-210 + droop * 120}`} stroke="#1A1622" strokeWidth={16} strokeLinecap="round" />
    <rect x={-180} y={-70} width={360} height={70} rx={14} fill="#E4DED0" stroke={INK} strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={-110 + i * 56} cy={-34} r={11} fill={dead ? (i === 3 ? (Math.floor(t / 8) % 2 ? '#FF4A3E' : '#5A2A2E') : '#3A3A44') : '#5CE08A'} />)}
  </g>
);

// ---------------------------------------------------------------- town at dusk
/** Rows of flat roofs, a tiny figure with a phone up on each. */
export const Roofs: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[0, 1, 2].map((r) => (
      <g key={r}>
        {Array.from({ length: 9 }).map((_, i) => {
          const s = 0.34 + r * 0.14;
          const w = 300 + r * 90;
          const x = -280 + i * (w + 22) + ((r * 130) % 260);
          const top = 520 + r * 130 + rnd(r + 3, i) * 46;
          const c = ['#3E3048', '#4E3A4C', '#5E4450'][r];
          return (
            <g key={i}>
              <rect x={x} y={top} width={w} height={700} fill={c} stroke={INK} strokeWidth={4} />
              <rect x={x - 8} y={top - 12} width={w + 16} height={16} fill="#6E5A62" stroke={INK} strokeWidth={3} />
              {Array.from({ length: 4 }).map((_, k) => <rect key={k} x={x + 26 + k * (w / 4.2)} y={top + 40} width={w / 7} height={56} fill={rnd(r * 7 + i, k) > 0.5 ? '#FFD27E' : '#2C2434'} opacity={0.75} />)}
              {fig(CROWD[(i + r) % CROWD.length], x + w * (0.3 + rnd(r, i) * 0.4), top - 8, s, { yaw: 0.2, armR: { a: 168 + Math.sin(t / 7 + i) * 8, b: -6 }, armL: { a: 10, b: -6 }, look: 0.1 }, 'rimR', 0)}
              {rnd(r + 11, i) > 0.45 ? fig(CROWD[(i + r + 2) % CROWD.length], x + w * 0.82, top - 8, s * 0.94, { yaw: -0.2, armL: { a: 165 + Math.sin(t / 6 + i * 2) * 9, b: -8 }, armR: { a: 12, b: -6 } }, 'rimR', 0) : null}
            </g>
          );
        })}
      </g>
    ))}
  </g>
);
export const Coconut: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 30 }) => <g><circle cx={x} cy={y} r={r} fill="#5C3E28" stroke={INK} strokeWidth={4} /><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.22} fill="#7E5A3E" /></g>;
/** Half or whole of a newspaper, held out. */
export const Paper: React.FC<{ x: number; y: number; s?: number; rot?: number; w?: number }> = ({ x, y, s = 1, rot = 0, w = 240 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-w / 2} y={-130} width={w} height={260} fill="#E4DCC8" stroke={INK} strokeWidth={5} />
    <rect x={-w / 2 + 14} y={-114} width={w - 28} height={34} fill="#3A3238" />
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-w / 2 + 14} y={-68 + i * 20} width={(w - 28) * (i % 3 === 2 ? 0.6 : 1)} height={8} fill="#8A8278" />)}
  </g>
);
/** The cardboard reel frame with hearts down its side. */
export const ReelFrame: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -210 -380 H 210 V 380 H -210 Z M -176 -346 V 346 H 176 V -346 Z" fillRule="evenodd" fill="#C9A06A" stroke={INK} strokeWidth={6} />
    <text x={140} y={120} textAnchor="middle" fontSize={46} fill="#E0402E">♥</text>
    <text x={140} y={166} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={28} fill="#F6EFE3" stroke={INK} strokeWidth={4} paintOrder="stroke">0</text>
    <text x={-30} y={322} textAnchor="middle" fontFamily={FONT.hand} fontSize={32} fill="#F6EFE3" stroke={INK} strokeWidth={4} paintOrder="stroke">#reels</text>
  </g>
);
/** A hand-painted board on a stick. */
export const Placard: React.FC<{ x: number; y: number; s?: number; text: string; text2?: string; c?: string; w?: number; post?: number }> = ({ x, y, s = 1, text, text2, c = '#E8DCC0', w = 380, post = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {post ? <rect x={-10} y={0} width={20} height={post} fill="#5A3E2C" stroke={INK} strokeWidth={4} /> : null}
    <rect x={-w / 2} y={-(text2 ? 150 : 96)} width={w} height={text2 ? 180 : 116} rx={8} fill={c} stroke={INK} strokeWidth={6} />
    <text y={text2 ? -82 : -18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#2A1A12">{text}</text>
    {text2 ? <text y={-18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#A02A1E">{text2}</text> : null}
  </g>
);

// ---------------------------------------------------------------- ration shop
export const Sack: React.FC<{ x: number; y: number; s?: number; label?: string }> = ({ x, y, s = 1, label = 'അരി' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={130} ry={14} fill="#000" opacity={0.3} />
    <path d="M -110 0 Q -130 -130 -96 -230 Q 0 -262 96 -230 Q 130 -130 110 0 Z" fill="#D8CDB4" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -96 -230 Q 0 -196 96 -230" stroke="#9E9078" strokeWidth={5} fill="none" />
    <text y={-90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#7A2E1E">{label}</text>
  </g>
);
export const EPos: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -130 0 L -100 -260 L 100 -260 L 130 0 Z" fill="#3A3E4C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-84} y={-240} width={168} height={120} rx={8} fill="#BFE4C8" stroke={INK} strokeWidth={4} />
    <Spinner x={0} y={-180} r={34} t={t} c="#1E3A2A" />
    <rect x={-46} y={-96} width={92} height={70} rx={14} fill="#16121E" stroke="#6E7A8E" strokeWidth={4} />
    <rect x={-30} y={-84} width={60} height={46} rx={10} fill="#E0403A" opacity={0.6 + 0.4 * Math.sin(t / 6)} />
  </g>
);
export const Shop: React.FC<{ x: number; y: number; s?: number; shut?: number; c?: string }> = ({ x, y, s = 1, shut = 0, c = '#7A5A4E' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-85} y={-300} width={170} height={300} fill={c} stroke={INK} strokeWidth={5} />
    <rect x={-85} y={-300} width={170} height={56} fill="#2E7E5A" stroke={INK} strokeWidth={4} />
    <text y={-258} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#F6EFE3">റേഷൻ</text>
    <rect x={-66} y={-232} width={132} height={232} fill="#FFD27E" opacity={0.85} />
    <rect x={-66} y={-232} width={132} height={232 * shut} fill="#5A5E6C" stroke={INK} strokeWidth={3} />
    {Array.from({ length: Math.floor(shut * 11) }).map((_, i) => <line key={i} x1={-66} x2={66} y1={-218 + i * 20} y2={-218 + i * 20} stroke="#3A3E4C" strokeWidth={3} />)}
  </g>
);

// ---------------------------------------------------------------- the sea
/** Under the sea. Bed at y; a light from above. */
export const SeaBed: React.FC<{ id: string; t: number; y?: number; dark?: number }> = ({ id, t, y = 860, dark = 0 }) => (
  <g>
    <defs>
      <linearGradient id={`sb_${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={-200} x2={0} y2={1000}>
        <stop offset="0" stopColor="#1E6E8C" /><stop offset="0.6" stopColor="#0E3A5C" /><stop offset="1" stopColor="#081E38" />
      </linearGradient>
    </defs>
    <rect x={-3000} y={-1500} width={8000} height={4500} fill={`url(#sb_${id})`} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${200 + i * 460} -300 L ${60 + i * 460 + Math.sin(t / 40 + i) * 40} 900 L ${320 + i * 460 + Math.sin(t / 40 + i) * 40} 900 L ${320 + i * 460} -300 Z`} fill="#BFEFFF" opacity={0.05} />)}
    {Array.from({ length: 16 }).map((_, i) => { const p = ((t * 0.8 + rnd(3, i) * 900) % 900); return <circle key={i} cx={rnd(5, i) * 1920 + Math.sin(p / 40 + i) * 12} cy={900 - p} r={3 + rnd(6, i) * 7} fill="none" stroke="#BFEFFF" strokeWidth={2} opacity={0.4} />; })}
    <path d={`M -2000 ${y} Q -300 ${y - 50} 400 ${y - 16} T 1300 ${y - 26} T 3000 ${y} V 2400 H -2000 Z`} fill="#3A3C4E" stroke={INK} strokeWidth={5} />
    {Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={rnd(7, i) * 2000} cy={y + 26 + rnd(8, i) * 170} rx={40 + rnd(9, i) * 70} ry={12 + rnd(2, i) * 14} fill="#2A2C3C" />)}
    {[[210, 0.9], [1620, 1.2], [1020, 0.7]].map(([x, s], i) => (
      <path key={i} d={`M ${x} ${y} q ${-14 + Math.sin(t / 19 + i) * 10} -70 ${Math.sin(t / 16 + i) * 18} ${-150 * (s as number)} M ${(x as number) + 26} ${y} q ${10 + Math.sin(t / 21 + i) * 10} -60 ${Math.sin(t / 15 + i) * 14 + 20} ${-120 * (s as number)}`} stroke="#2E7A5E" strokeWidth={10} fill="none" strokeLinecap="round" />
    ))}
    {dark ? <rect x={-3000} y={-1500} width={8000} height={4500} fill="#02060E" opacity={dark} /> : null}
  </g>
);
/** The cable along the bed, with light pulses running. `cut` is an x where it ends; pulse 0 stops them. */
export const Cable: React.FC<{ y: number; t: number; pulse?: number; x0?: number; x1?: number; w?: number }> = ({ y, t, pulse = 1, x0 = -400, x1 = 2400, w = 26 }) => (
  <g>
    <path d={`M ${x0} ${y} C ${x0 + 700} ${y - 20} ${x1 - 900} ${y + 22} ${x1} ${y - 8}`} stroke="#14141C" strokeWidth={w + 8} fill="none" strokeLinecap="round" />
    <path d={`M ${x0} ${y} C ${x0 + 700} ${y - 20} ${x1 - 900} ${y + 22} ${x1} ${y - 8}`} stroke="#3E4256" strokeWidth={w} fill="none" strokeLinecap="round" />
    {pulse > 0 ? Array.from({ length: 12 }).map((_, i) => {
      const k = ((t * 0.013 + i / 12) % 1);
      const x = x0 + (x1 - x0) * k;
      return <g key={i} opacity={pulse}><circle cx={x} cy={y + Math.sin(k * 3.1) * 6 - 2} r={w * 0.28} fill="#FFE9A8" /><Glow x={x} y={y} r={46} kind="warm" o={0.7} /></g>;
    }) : null}
  </g>
);
export const Crab: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((d) => <g key={d}>
      <path d={`M ${d * 24} -8 q ${d * 34} -4 ${d * 44} ${-30 + Math.sin(t / 3) * 5}`} stroke="#B8452E" strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={d * 70} cy={-38 + Math.sin(t / 3) * 5} r={15} fill="#D8583E" stroke={INK} strokeWidth={4} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${d * 26} ${2 + i * 5} l ${d * 30} ${14 + i * 2}`} stroke="#B8452E" strokeWidth={6} strokeLinecap="round" />)}
    </g>)}
    <ellipse rx={38} ry={24} fill="#D8583E" stroke={INK} strokeWidth={5} />
    <circle cx={-12} cy={-28} r={7} fill="#fff" stroke={INK} strokeWidth={3} /><circle cx={12} cy={-28} r={7} fill="#fff" stroke={INK} strokeWidth={3} />
  </g>
);
/** The volcano out at sea with its plume. e 0..1 how far the blast has grown. */
export const Volcano: React.FC<{ x: number; y: number; e: number; t: number }> = ({ x, y, e, t }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: 26 }).map((_, i) => {
      const k = i / 25;
      const h = 760 * e * k;
      const r = (50 + 210 * k * k) * (0.5 + e * 0.6) * (0.85 + rnd(4, i) * 0.3);
      const dx = (rnd(5, i) - 0.5) * 240 * k + Math.sin(t / 16 + i) * 10;
      return <circle key={i} cx={dx} cy={-150 - h} r={r} fill={i % 3 ? '#4A424E' : '#6A5E62'} stroke="#2A2430" strokeWidth={3} />;
    })}
    <Glow x={0} y={-180} r={400} kind="red" o={0.9 * e} />
    <path d="M -420 0 L -70 -170 L 70 -170 L 420 0 Z" fill="#2E2830" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -60 -170 L -24 -60 L 8 -130 L 40 -40 L 66 -170 Z" fill="#FF6A2E" />
  </g>
);

// ---------------------------------------------------------------- the old world
export const Radio: React.FC<{ x: number; y: number; s?: number; t?: number; on?: number }> = ({ x, y, s = 1, t = 0, on = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 90 -200 L 170 -340" stroke="#A9A7AE" strokeWidth={7} strokeLinecap="round" />
    <rect x={-190} y={-200} width={380} height={200} rx={20} fill="#6E4A30" stroke={INK} strokeWidth={6} />
    <rect x={-168} y={-178} width={190} height={156} rx={10} fill="#2C2228" />
    {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={-160} x2={14} y1={-166 + i * 17} y2={-166 + i * 17} stroke="#4E3E3E" strokeWidth={5} />)}
    <rect x={40} y={-178} width={130} height={56} rx={6} fill="#FFE9A8" opacity={0.3 + on * 0.6} />
    <circle cx={76} cy={-70} r={28} fill="#C9B69A" stroke={INK} strokeWidth={5} /><circle cx={140} cy={-70} r={20} fill="#C9B69A" stroke={INK} strokeWidth={5} />
    {on ? [0, 1, 2].map((i) => { const p = ((t + i * 14) % 42) / 42; return <path key={i} d={`M ${-230 - p * 60} ${-150 + i * 8} q -30 50 0 100`} stroke="#FFE27A" strokeWidth={6} fill="none" opacity={1 - p} />; }) : null}
  </g>
);
export const PostBox: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={120} ry={14} fill="#000" opacity={0.3} />
    <path d="M -90 0 V -320 Q 0 -400 90 -320 V 0 Z" fill="#C8352E" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-60} y={-290} width={120} height={18} rx={6} fill="#1E1420" />
    <rect x={-62} y={-210} width={124} height={70} rx={6} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
    <text y={-162} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#A02A1E">തപാൽ</text>
  </g>
);
export const Letter: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-38} width={120} height={76} fill="#E8DCC0" stroke={INK} strokeWidth={4} />
    <path d="M -60 -38 L 0 8 L 60 -38" stroke={INK} strokeWidth={3} fill="none" />
    <rect x={34} y={-30} width={18} height={22} fill="#C8352E" />
  </g>
);
export const HamRig: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-210} y={-150} width={420} height={150} rx={10} fill="#2C2E3A" stroke={INK} strokeWidth={6} />
    <rect x={-186} y={-126} width={210} height={70} fill="#7CE0B0" opacity={0.85} />
    <path d={`M -180 -90 ${Array.from({ length: 14 }).map((_, i) => `L ${-180 + i * 15} ${-92 + Math.sin(t / 2 + i) * 18 * rnd(3, i)}`).join(' ')}`} stroke="#1E3A2A" strokeWidth={4} fill="none" />
    <circle cx={110} cy={-90} r={38} fill="#8A8E9C" stroke={INK} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={-160 + i * 50} cy={-30} r={11} fill="#D8583E" />)}
  </g>
);
/** A mast with a dipole, from y up. */
export const Aerial: React.FC<{ x: number; y: number; h?: number; t?: number }> = ({ x, y, h = 560, t = 0 }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y - h} stroke="#B8B4BC" strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={x - 120 + i * 24} x2={x + 120 - i * 24} y1={y - h + 20 + i * 40} y2={y - h + 20 + i * 40} stroke="#B8B4BC" strokeWidth={6} />)}
    {[0, 1, 2].map((i) => { const p = ((t + i * 16) % 48) / 48; return <circle key={i} cx={x} cy={y - h + 20} r={30 + p * 170} fill="none" stroke="#7CE0B0" strokeWidth={4} opacity={(1 - p) * 0.6} />; })}
  </g>
);
export const Bunk: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-300, 300].map((px) => <rect key={px} x={px - 12} y={-560} width={24} height={560} fill="#7A7E8C" stroke={INK} strokeWidth={4} />)}
    {[-180, -470].map((py, i) => <g key={py}>
      <rect x={-306} y={py} width={612} height={54} fill="#E4DCC8" stroke={INK} strokeWidth={5} />
      <rect x={-306} y={py + 40} width={612} height={22} fill="#5A5E6C" stroke={INK} strokeWidth={4} />
      <rect x={i ? 150 : -290} y={py - 30} width={140} height={36} rx={14} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
    </g>)}
  </g>
);
export const Frame: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-150} width={240} height={300} fill="#5A3A28" stroke={INK} strokeWidth={6} />
    <rect x={-96} y={-126} width={192} height={252} fill="#D8C8A8" />
    <rect x={-96} y={-126} width={192} height={120} fill="#C9A06A" />
    <circle cx={0} cy={-26} r={52} fill="#B98562" stroke={INK} strokeWidth={4} />
    <path d="M -50 -46 Q 0 -96 50 -46" fill="#1E1716" />
    <path d="M -22 -6 q 22 -10 44 0" stroke="#1E1716" strokeWidth={7} fill="none" />
    <path d="M -92 126 Q 0 20 92 126 Z" fill="#6E86A8" stroke={INK} strokeWidth={4} />
  </g>
);
export const Pills: React.FC<{ x: number; y: number; s?: number; rot?: number; left?: number }> = ({ x, y, s = 1, rot = 0, left = 4 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-120} width={600} height={240} rx={18} fill="#C8CCD8" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 10 }).map((_, i) => {
      const cx = -240 + (i % 5) * 120;
      const cy = -54 + Math.floor(i / 5) * 108;
      return i < left ? <g key={i}><circle cx={cx} cy={cy} r={38} fill="#F6EFE3" stroke="#8E94A4" strokeWidth={5} /></g> : <g key={i}><circle cx={cx} cy={cy} r={38} fill="#8E94A4" stroke={INK} strokeWidth={3} /><path d={`M ${cx - 24} ${cy - 18} L ${cx + 20} ${cy + 22}`} stroke={INK} strokeWidth={3} /></g>;
    })}
  </g>
);
export const Notes: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }).map((_, i) => <g key={i} transform={`translate(${(i % 2) * 12} ${-i * 15})`}>
      <rect x={-120} y={-44} width={240} height={88} rx={5} fill="#D8B8A8" stroke={INK} strokeWidth={3} />
      <circle r={26} fill="#C8A090" stroke="#8A6252" strokeWidth={3} />
      <rect x={-12} y={-44} width={24} height={88} fill="#E8D8C8" stroke="#8A6252" strokeWidth={2} opacity={i === n - 1 ? 1 : 0} />
    </g>)}
  </g>
);
/** The old stamp paper of the house. */
export const Deed: React.FC<{ x: number; y: number; s?: number; rot?: number; torn?: number }> = ({ x, y, s = 1, rot = 0, torn = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-1, 1].map((d) => (
      <g key={d} transform={`translate(${d * torn * 170} ${torn * 40}) rotate(${d * torn * 16})`}>
        <clipPath id={`deed${d}`}><path d={d < 0 ? 'M -400 -500 H 8 L -14 -300 L 14 -80 L -12 120 L 10 500 H -400 Z' : 'M 400 -500 H 8 L -14 -300 L 14 -80 L -12 120 L 10 500 H 400 Z'} /></clipPath>
        <g clipPath={`url(#deed${d})`}>
          <rect x={-300} y={-420} width={600} height={840} fill="#E8DFC4" stroke={INK} strokeWidth={6} />
          <rect x={-262} y={-386} width={524} height={130} fill="none" stroke="#7A5A8C" strokeWidth={5} />
          <text y={-296} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#6A2E7C">ആധാരം</text>
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-250} y={-214 + i * 34} width={i % 4 === 3 ? 310 : 500} height={10} fill="#8E8270" />)}
          <path d="M -250 300 H 60" stroke={INK} strokeWidth={4} strokeDasharray="14 10" />
          <circle cx={190} cy={310} r={62} fill="none" stroke="#A02A1E" strokeWidth={7} />
        </g>
      </g>
    ))}
  </g>
);
export const Pen: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 28 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 0 L -14 -46 L 14 -46 Z" fill="#E8C86A" stroke={INK} strokeWidth={4} />
    <rect x={-16} y={-300} width={32} height={256} rx={8} fill="#1E2A5E" stroke={INK} strokeWidth={4} />
  </g>
);
/** The blue diary, shut. */
export const DiaryShut: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-96} width={140} height={192} rx={8} fill="#2E5E9C" stroke={INK} strokeWidth={5} />
    <rect x={-70} y={-96} width={22} height={192} fill="#1E4478" />
    <rect x={-26} y={-52} width={78} height={40} fill="#E8DCC0" stroke={INK} strokeWidth={3} />
  </g>
);
/** The open diary, pages in amma's hand. `rows` are [name, number]. */
export const DiaryOpen: React.FC<{ rows: [string, string][]; t: number; hi?: number; size?: number }> = ({ rows, t, hi = -1, size = 56 }) => (
  <g>
    <rect x={200} y={70} width={1520} height={960} rx={18} fill="#2E5E9C" stroke={INK} strokeWidth={7} />
    <rect x={232} y={96} width={728} height={908} fill="#F1E9D4" stroke={INK} strokeWidth={4} />
    <rect x={960} y={96} width={728} height={908} fill="#F6EFE0" stroke={INK} strokeWidth={4} />
    {Array.from({ length: 11 }).map((_, i) => <g key={i}><line x1={250} x2={944} y1={190 + i * 76} y2={190 + i * 76} stroke="#B8C8DC" strokeWidth={3} /><line x1={976} x2={1672} y1={190 + i * 76} y2={190 + i * 76} stroke="#B8C8DC" strokeWidth={3} /></g>)}
    {rows.map(([n, d], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = col ? 1000 : 276;
      const y = 176 + row * 152;
      const on = t > i * 3;
      return on ? <g key={i} opacity={clamp((t - i * 3) / 6)}>
        <text x={x} y={y} fontFamily={FONT.title} fontWeight={700} fontSize={size} fill={i === hi ? '#A02A1E' : '#1E2A5E'}>{n}</text>
        <text x={x} y={y + 72} fontFamily={FONT.hand} fontSize={size * 0.9} fill={i === hi ? '#A02A1E' : '#3A4A7E'}>{d}</text>
      </g> : null;
    })}
  </g>
);
export const Hospital: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-560} y={-560} width={1120} height={560} fill="#C8C0B8" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={-510 + (i % 6) * 176} y={-510 + Math.floor(i / 6) * 150} width={110} height={100} fill={rnd(4, i) > 0.5 ? '#FFD27E' : '#3A4A5E'} stroke={INK} strokeWidth={4} opacity={0.85} />)}
    <rect x={-110} y={-200} width={220} height={200} fill="#FFE9B8" stroke={INK} strokeWidth={6} />
    <rect x={-46} y={-650} width={92} height={92} fill="#F6EFE3" stroke={INK} strokeWidth={5} />
    <path d="M -32 -604 H 32 M 0 -636 V -572" stroke="#D0352E" strokeWidth={20} />
  </g>
);

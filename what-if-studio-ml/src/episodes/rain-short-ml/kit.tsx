// rain-short-ml's own pieces: rain in screen space, the day tag, paper boat, chappal, frog, schoolbag, cot,
// rice sack, a laterite step, a flood-roof row and the August 2018 calendar. All pure functions of the shot clock.
import React from 'react';
import { clamp, rnd, FONT, Glow } from '../../engine';
import { Rain } from '../fly-ml/kit';
import { Ripple } from '../ice-short-ml/kit';

const INK = '#16121E';

/** Heavy rain over the whole 9:16 frame (draw it outside the camera group). */
export const VRain: React.FC<{ t: number; o?: number; n?: number; seed?: number }> = ({ t, o = 0.5, n = 150, seed = 11 }) => (
  <g transform="translate(-260 0) scale(1 1.45)">
    <Rain t={t} o={o} n={n} slant={0.18} seed={seed} />
  </g>
);

/** Rain rings popping on a water surface between y0 and y1. */
export const RainRings: React.FC<{ t: number; x0?: number; x1?: number; y0: number; y1: number; n?: number; seed?: number; s?: number }> = ({
  t, x0 = -60, x1 = 1140, y0, y1, n = 14, seed = 4, s = 1,
}) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const per = 18 + Math.floor(rnd(seed, i) * 14);
      const ph = (t + rnd(seed, i + 9) * per) % per;
      const cyc = Math.floor((t + rnd(seed, i + 9) * per) / per);
      const x = x0 + rnd(seed + cyc, i + 3) * (x1 - x0);
      const y = y0 + rnd(seed + cyc, i + 5) * (y1 - y0);
      const k = ph / per;
      const depth = 0.5 + 0.5 * ((y - y0) / Math.max(1, y1 - y0));
      return <g key={i} opacity={1 - k}><Ripple x={x} y={y} r={(10 + k * 46) * depth * s} /></g>;
    })}
  </g>
);

export const PaperBoat: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string }> = ({ x, y, s = 1, rot = 0, c = '#F2EEE2' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={70} ry={10} fill="#000" opacity={0.25} />
    <path d="M -70 -6 L 70 -6 L 46 14 L -46 14 Z" fill="#D8D2C2" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -46 -6 L 0 -66 L 46 -6 Z" fill={c} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 0 -66 L 0 -6" stroke={INK} strokeWidth={2} opacity={0.5} />
    <text x={-30} y={-16} fontFamily={FONT.ui} fontSize={12} fill="#5A6A8A" opacity={0.7}>2+2=4</text>
  </g>
);

/** A blue-strap rubber chappal seen from above. */
export const Chappal: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -34 -90 Q 0 -110 34 -90 Q 46 -10 30 80 Q 0 100 -30 80 Q -46 -10 -34 -90 Z" fill="#EDEBE4" stroke={INK} strokeWidth={5} />
    <path d="M -36 -84 Q 0 -100 36 -84 Q 44 -10 28 74 Q 0 90 -28 74 Q -44 -10 -36 -84 Z" fill="#2F6EC4" opacity={0.25} />
    <path d="M -30 -10 L 0 -64 L 30 -10" stroke="#2F6EC4" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={0} cy={-64} r={8} fill="#2F6EC4" stroke={INK} strokeWidth={3} />
  </g>
);

/** A small green frog, sitting; `pop` 0..1 opens the mouth and widens the eyes. */
export const Frog: React.FC<{ x: number; y: number; s?: number; pop?: number }> = ({ x, y, s = 1, pop = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={78} ry={46} fill="#5E9A3C" stroke={INK} strokeWidth={6} />
    <ellipse cx={0} cy={24} rx={50} ry={24} fill="#B8D88A" />
    {[-44, 44].map((ex) => (
      <g key={ex}>
        <circle cx={ex} cy={-30} r={30 + pop * 6} fill="#5E9A3C" stroke={INK} strokeWidth={6} />
        <circle cx={ex} cy={-30} r={19 + pop * 5} fill="#FFFFFF" />
        <circle cx={ex + 3} cy={-28} r={10} fill={INK} />
      </g>
    ))}
    <path d={`M -36 14 Q 0 ${30 + pop * 26} 36 14`} stroke={INK} strokeWidth={6} fill={pop > 0.3 ? '#8A2E3A' : 'none'} strokeLinecap="round" />
    {[-1, 1].map((d) => <path key={d} d={`M ${d * 60} 40 q ${d * 30} 22 ${d * 56} 12`} stroke={INK} strokeWidth={6} fill="#5E9A3C" strokeLinecap="round" />)}
  </g>
);

export const SchoolBag: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -40 -96 Q 0 -140 40 -96" stroke="#14203A" strokeWidth={14} fill="none" />
    <rect x={-80} y={-100} width={160} height={190} rx={28} fill="#24407A" stroke={INK} strokeWidth={6} />
    <rect x={-60} y={10} width={120} height={64} rx={14} fill="#1C3262" stroke={INK} strokeWidth={5} />
    <path d="M -60 18 L 60 18" stroke="#FFB15A" strokeWidth={6} />
    <rect x={-80} y={-100} width={30} height={190} rx={14} fill="#31539A" opacity={0.6} />
  </g>
);

/** A jute rice sack. */
export const RiceSack: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -90 -70 Q -110 20 -84 80 Q 0 100 84 80 Q 110 20 90 -70 Q 70 -96 50 -86 L 0 -100 L -50 -86 Q -70 -96 -90 -70 Z" fill="#C8A46A" stroke={INK} strokeWidth={6} />
    {[-50, 0, 50].map((sx) => <path key={sx} d={`M ${sx} -84 L ${sx} 84`} stroke="#A8844C" strokeWidth={4} opacity={0.6} />)}
    <path d="M -40 -10 L 40 -10 M -30 20 L 30 20" stroke="#8A2E24" strokeWidth={8} strokeLinecap="round" />
  </g>
);

/** A wooden cot (kattil), side on: top at y, from x0 to x1, legs `leg` long. */
export const Cot: React.FC<{ x0: number; x1: number; y: number; leg?: number }> = ({ x0, x1, y, leg = 210 }) => (
  <g>
    {[x0 + 20, x1 - 40].map((lx) => <rect key={lx} x={lx} y={y} width={22} height={leg} fill="#4A2E1E" stroke={INK} strokeWidth={5} />)}
    <rect x={x0} y={y - 26} width={x1 - x0} height={40} rx={6} fill="#6E4430" stroke={INK} strokeWidth={6} />
    <rect x={x0 + 10} y={y - 46} width={x1 - x0 - 20} height={22} rx={8} fill="#B85A4A" stroke={INK} strokeWidth={5} />
    <rect x={x0 - 10} y={y - 150} width={26} height={190} rx={6} fill="#5A3624" stroke={INK} strokeWidth={5} />
  </g>
);

/** A laterite block band (a step, a well wall): x0..x1, y0..y1. */
export const Laterite: React.FC<{ x0: number; x1: number; y0: number; y1: number; seed?: number }> = ({ x0, x1, y0, y1, seed = 2 }) => {
  const bw = 150;
  const bh = Math.max(30, (y1 - y0) / 2);
  const rows = Math.ceil((y1 - y0) / bh);
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#A2583E" stroke={INK} strokeWidth={6} />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: Math.ceil((x1 - x0) / bw) + 1 }).map((__, c) => {
          const bx = x0 + c * bw - (r % 2) * bw * 0.5;
          return (
            <g key={`${r}_${c}`}>
              <rect x={bx + 4} y={y0 + r * bh + 4} width={bw - 8} height={bh - 8} fill="#8E4A32" opacity={0.55} />
              {[0, 1, 2].map((k) => <circle key={k} cx={bx + 20 + rnd(seed + r, c * 3 + k) * (bw - 40)} cy={y0 + r * bh + 10 + rnd(seed + c, r * 3 + k) * (bh - 20)} r={4} fill="#6A321E" opacity={0.6} />)}
            </g>
          );
        }))}
      <rect x={x0} y={y0} width={x1 - x0} height={10} fill="#C87A58" />
    </g>
  );
};

/** A bare bulb hanging from the eave, with its glow. */
export const Bulb: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 0.75 }) => (
  <g>
    <line x1={x} y1={y - 200 * s} x2={x} y2={y - 26 * s} stroke={INK} strokeWidth={5} />
    <rect x={x - 12 * s} y={y - 34 * s} width={24 * s} height={16 * s} fill="#3A3446" />
    <circle cx={x} cy={y} r={20 * s} fill="#FFE7A8" stroke="#E8B860" strokeWidth={4} />
    <Glow x={x} y={y} r={300 * s} kind="warm" o={o} />
  </g>
);

/** The wall calendar of August 2018 (1 Aug a Wednesday), `circle` 0..3 rings 15, 16, 17 in turn. */
export const Aug2018: React.FC<{ x: number; y: number; w?: number; circle?: number; mud?: number }> = ({ x, y, w = 560, circle = 0, mud = 0 }) => {
  const h = w * 1.3;
  const top = h * 0.32;
  const cw = (w - 40) / 7;
  const ch = (h - top - 60) / 5;
  const days = ['ഞാ', 'തി', 'ചൊ', 'ബു', 'വ്യാ', 'വെ', 'ശ'];
  const cell = (d: number) => {
    const i = d + 2;
    return { cx: x - w / 2 + 20 + (i % 7) * cw + cw / 2, cy: y + top + 46 + Math.floor(i / 7) * ch + ch / 2 };
  };
  return (
    <g>
      <rect x={x - w / 2 + 10} y={y + 14} width={w} height={h} fill="#000" opacity={0.3} />
      <rect x={x - w / 2} y={y} width={w} height={h} fill="#F2ECDC" stroke={INK} strokeWidth={6} />
      <rect x={x - w / 2} y={y} width={w} height={top} fill="#B8452E" />
      <path d={`M ${x - w / 2 + 30} ${y + top - 20} Q ${x - w / 4} ${y + top - 120} ${x} ${y + top - 60} Q ${x + w / 4} ${y + top - 140} ${x + w / 2 - 30} ${y + top - 30}`} stroke="#E8B860" strokeWidth={6} fill="none" opacity={0.6} />
      <text x={x} y={y + 78} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.11} fill="#F6EFE3">ആഗസ്റ്റ് 2018</text>
      <circle cx={x} cy={y - 10} r={10} fill="#3A3446" />
      {days.map((d, i) => (
        <text key={d} x={x - w / 2 + 20 + i * cw + cw / 2} y={y + top + 34} textAnchor="middle" fontFamily={FONT.title} fontSize={w * 0.04} fill={i === 0 ? '#B8452E' : '#4A4458'}>{d}</text>
      ))}
      {Array.from({ length: 31 }).map((_, k) => {
        const c = cell(k + 1);
        return <text key={k} x={c.cx} y={c.cy + w * 0.022} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.056} fill={(k + 3) % 7 === 0 ? '#B8452E' : '#2A2438'}>{k + 1}</text>;
      })}
      {[15, 16, 17].map((d, i) => {
        const p = clamp(circle - i);
        if (p <= 0) return null;
        const c = cell(d);
        const r = cw * 0.46;
        const L = 2 * Math.PI * r;
        return <circle key={d} cx={c.cx} cy={c.cy} r={r} fill="none" stroke="#D8282A" strokeWidth={7} strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform={`rotate(-80 ${c.cx} ${c.cy})`} strokeLinecap="round" />;
      })}
      {mud > 0 ? <rect x={x - w / 2} y={y + h * (1 - mud)} width={w} height={h * mud} fill="#6A4E2E" opacity={0.45} /> : null}
    </g>
  );
};

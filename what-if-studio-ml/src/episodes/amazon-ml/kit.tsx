// amazon-ml's own pieces, for a 1080 x 1920 world: the Kerala auto, the jungle, the mud, the eel, the sky river, the
// maps and the trip counter. Pure functions of the clock.
import React from 'react';
import { FONT, Glow, Sun, clamp, backOut, rnd, Stars } from '../../engine';
import { Sky } from '../fly-ml/kit';

export const INK = '#14101F';
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------------------------------------------------------------- the auto
export const Wheel: React.FC<{ x: number; y: number; r: number; spin?: number; mud?: boolean }> = ({ x, y, r, spin = 0, mud }) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`}>
    <circle r={r} fill="#17141C" stroke={INK} strokeWidth={r * 0.08} />
    <circle r={r * 0.56} fill="#8E8A90" stroke={INK} strokeWidth={r * 0.07} />
    {[0, 60, 120].map((a) => <rect key={a} x={-r * 0.5} y={-r * 0.05} width={r} height={r * 0.1} fill="#3C3842" transform={`rotate(${a})`} />)}
    <circle r={r * 0.15} fill="#E8B52E" />
    {mud ? [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={Math.cos(i * 1.3) * r * 0.82} cy={Math.sin(i * 1.3) * r * 0.82} r={r * 0.17} fill="#6A3E28" />) : null}
  </g>
);

/** A Kerala auto from the side, facing right. y is the road; `children` sit inside, in the auto's own units. */
export const Auto: React.FC<{ x: number; y: number; s?: number; spin?: number; dir?: 1 | -1; rot?: number; mud?: number; lamp?: boolean; children?: React.ReactNode }> = ({
  x, y, s = 1, spin = 0, dir = 1, rot = 0, mud = 0, lamp = true, children,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * dir} ${s})`}>
    {lamp ? <Glow x={330} y={-120} r={240} o={0.7} /> : null}
    {/* inside */}
    <path d="M -240 -200 L -240 -350 L 150 -350 L 205 -200 Z" fill="#241C24" />
    <rect x={-236} y={-345} width={120} height={140} rx={10} fill="#3A2A2E" />
    {children}
    {/* the cab */}
    <path d="M -262 -60 L -262 -212 L 205 -212 Q 262 -130 268 -66 L 150 -60 A 62 62 0 0 0 40 -60 L -70 -60 A 62 62 0 0 0 -200 -60 Z" fill="#1C1C24" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -258 -160 L 234 -160 L 246 -132 L -258 -132 Z" fill="#E8B52E" />
    <text x={-120} y={-168} fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#E8B52E">KL-07</text>
    {/* the hood */}
    <path d="M -272 -206 Q -280 -376 -190 -384 L 130 -384 Q 176 -380 196 -340 L 214 -206 L 192 -206 L 168 -338 Q 150 -354 128 -354 L -128 -354 L -128 -206 Z" fill="#E8B52E" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -260 -300 Q -250 -372 -190 -372 L 120 -372" stroke="#FFD86A" strokeWidth={7} fill="none" opacity={0.75} />
    {/* windscreen edge and lamp */}
    <path d="M 196 -340 L 240 -160" stroke="#A8D2DC" strokeWidth={9} opacity={0.6} />
    <circle cx={258} cy={-118} r={15} fill="#FFE9A8" stroke={INK} strokeWidth={4} />
    <Wheel x={-135} y={-58} r={58} spin={spin} mud={mud > 0.3} />
    <Wheel x={95} y={-58} r={58} spin={spin} mud={mud > 0.3} />
    {/* mud up the side */}
    {mud > 0 ? Array.from({ length: 16 }).map((_, i) => (
      <ellipse key={i} cx={-250 + rnd(4, i) * 500} cy={-70 - rnd(5, i) * 110 * mud} rx={14 + rnd(6, i) * 34} ry={8 + rnd(7, i) * 16} fill="#6A3E28" opacity={0.92} />
    )) : null}
  </g>
);

/** The auto from behind, for the long road. */
export const AutoBack: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 2.5) * 2}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={150} ry={18} fill="#000" opacity={0.4} />
    <rect x={-120} y={-58} width={46} height={58} rx={12} fill="#17141C" />
    <rect x={74} y={-58} width={46} height={58} rx={12} fill="#17141C" />
    <path d="M -130 -50 L 130 -50 L 124 -190 L -124 -190 Z" fill="#1C1C24" stroke={INK} strokeWidth={5} />
    <rect x={-128} y={-122} width={256} height={20} fill="#E8B52E" />
    <path d="M -140 -186 Q -146 -300 -90 -306 L 90 -306 Q 146 -300 140 -186 Z" fill="#E8B52E" stroke={INK} strokeWidth={5} />
    <rect x={-84} y={-280} width={168} height={76} rx={14} fill="#3A3040" stroke={INK} strokeWidth={4} />
    <circle cx={-100} cy={-84} r={13} fill="#FF4A3A" /><circle cx={100} cy={-84} r={13} fill="#FF4A3A" />
    <Glow x={-100} y={-84} r={60} kind="red" o={0.8} /><Glow x={100} y={-84} r={60} kind="red" o={0.8} />
  </g>
);

// ---------------------------------------------------------------- the jungle
export const Canopy: React.FC<{ y: number; seed: number; c: string; hi?: string; r?: number; h?: number; n?: number; dx?: number }> = ({ y, seed, c, hi, r = 120, h = 110, n = 18, dx = 0 }) => {
  const b = Array.from({ length: n }).map((_, i) => ({ x: -300 + (i / (n - 1)) * 1680 + dx + (rnd(seed, i) - 0.5) * 70, y: y - rnd(seed + 1, i) * h, r: r * (0.7 + rnd(seed + 2, i) * 0.6) }));
  return (
    <g>
      {b.map((o, i) => <circle key={i} cx={o.x} cy={o.y} r={o.r} fill={c} />)}
      {hi ? b.map((o, i) => <circle key={`h${i}`} cx={o.x + o.r * 0.22} cy={o.y - o.r * 0.3} r={o.r * 0.62} fill={hi} opacity={0.22} />) : null}
      <rect x={-1000} y={y} width={3200} height={2400} fill={c} />
    </g>
  );
};

export const Trunk: React.FC<{ x: number; y0: number; y1: number; w: number; c?: string; lean?: number }> = ({ x, y0, y1, w, c = '#0E1A16', lean = 0 }) => (
  <path d={`M ${x - w * 1.5} ${y1} Q ${x - w * 0.6} ${y1 - 120} ${x - w * 0.5 + lean} ${y0} L ${x + w * 0.5 + lean} ${y0} Q ${x + w * 0.6} ${y1 - 120} ${x + w * 1.5} ${y1} Z`} fill={c} />
);

export const Vine: React.FC<{ x: number; y: number; l: number; t?: number; c?: string; seed?: number }> = ({ x, y, l, t = 0, c = '#0E1A16', seed = 1 }) => {
  const sw = Math.sin(t / 26 + seed) * 16;
  return (
    <g>
      <path d={`M ${x} ${y} Q ${x + 30} ${y + l / 2} ${x + sw} ${y + l}`} stroke={c} strokeWidth={7} fill="none" />
      {[0.35, 0.55, 0.75, 0.95].map((k, i) => <ellipse key={i} cx={x + sw * k + (i % 2 ? 18 : -18) + 14 * Math.sin(k * 3)} cy={y + l * k} rx={22} ry={10} fill={c} transform={`rotate(${i % 2 ? 26 : -26} ${x + sw * k} ${y + l * k})`} />)}
    </g>
  );
};

/** Sky, low sun, three layers of forest, a band of mist. y is where the forest meets the ground. */
export const Jungle: React.FC<{ t: number; id: string; y?: number; mode?: string; sun?: [number, number]; pan?: number }> = ({ t, id, y = 1260, mode = 'dusk', sun = [730, 800], pan = 0 }) => {
  const night = mode === 'night' || mode === 'storm';
  return (
    <g>
      <Sky id={id} mode={mode} y0={0} y1={y - 260} stars={mode === 'night' ? 60 : 0} t={t} />
      {night ? null : <Sun x={sun[0]} y={sun[1]} r={84} t={t} />}
      <Canopy y={y - 330} seed={11} c={night ? '#10182C' : '#5A4464'} r={130} h={150} dx={pan * 0.15} />
      <Canopy y={y - 190} seed={12} c={night ? '#0C1A22' : '#2F4A46'} hi={night ? undefined : '#F0A050'} r={120} h={120} dx={pan * 0.3} />
      <rect x={-200} y={y - 240} width={1500} height={150} fill={night ? '#2A3A5A' : '#F0B080'} opacity={0.14} />
      {[90, 330, 800, 1030].map((x, i) => <Trunk key={i} x={x + ((pan * 0.5) % 300)} y0={y - 500} y1={y + 20} w={26 + i * 3} c={night ? '#060C10' : '#16261F'} />)}
      <Canopy y={y - 40} seed={13} c={night ? '#07120E' : '#14281F'} hi={night ? undefined : '#8FB04E'} r={78} h={46} n={24} dx={pan * 0.6} />
    </g>
  );
};

/** The red road. Wet ruts catch the sky. */
export const Mud: React.FC<{ y: number; t?: number; scroll?: number; night?: boolean; c?: string }> = ({ y, scroll = 0, night, c }) => {
  const base = c ?? (night ? '#20140F' : '#6A3A26');
  return (
    <g>
      <rect x={-1000} y={y} width={3200} height={1600} fill={base} />
      <rect x={-1000} y={y} width={3200} height={16} fill={night ? '#3A2820' : '#A8623C'} opacity={0.8} />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = ((((rnd(21, i) * 1800 + scroll * (0.6 + (i % 4) * 0.25)) % 1800) + 1800) % 1800) - 360;
        const yy = y + 50 + (i % 4) * 110 + rnd(22, i) * 50;
        return <ellipse key={i} cx={x} cy={yy} rx={120 + rnd(23, i) * 170} ry={12 + (i % 4) * 7} fill={i % 3 ? (night ? '#14100E' : '#4E2A1C') : night ? '#34405E' : '#E08A58'} opacity={i % 3 ? 0.85 : 0.5} />;
      })}
    </g>
  );
};

/** The wet edge drawn over a wheel or a leg, so it sits in the mud. */
export const MudFront: React.FC<{ y: number; t?: number; night?: boolean }> = ({ y, t = 0, night }) => {
  let d = `M -300 ${y}`;
  for (let x = -300; x <= 1400; x += 100) d += ` Q ${x + 50} ${y - 16 - Math.sin(x / 90 + t / 30) * 12} ${x + 100} ${y}`;
  return (
    <g>
      <path d={`${d} L 1400 2400 L -300 2400 Z`} fill={night ? '#20140F' : '#6A3A26'} />
      <path d={d} stroke={night ? '#3A2820' : '#B0683E'} strokeWidth={7} fill="none" />
    </g>
  );
};

/** Clods thrown off a wheel in an arc. */
export const Clods: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1; n?: number; pow?: number; seed?: number }> = ({ x, y, t, dir = -1, n = 22, pow = 1, seed = 2 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = ((t * 0.05 + rnd(seed, i)) % 1);
      const v = (260 + rnd(seed + 1, i) * 520) * pow;
      const up = (260 + rnd(seed + 2, i) * 420) * pow;
      return <ellipse key={i} cx={x + dir * v * ph} cy={y - up * ph + 760 * ph * ph} rx={9 + rnd(seed + 3, i) * 20} ry={7 + rnd(seed + 4, i) * 12} fill={i % 3 ? '#6A3E28' : '#472A1C'} />;
    })}
  </g>
);

export const Eyes: React.FC<{ x: number; y: number; s?: number; t?: number; seed?: number; o?: number }> = ({ x, y, s = 1, t = 0, seed = 1, o = 1 }) => {
  const blink = Math.sin(t / 19 + seed * 4) > 0.965 ? 0.1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <Glow x={0} y={0} r={110} o={0.34} />
      {[-34, 34].map((d) => (
        <g key={d} transform={`translate(${d} 0) rotate(${d < 0 ? 12 : -12}) scale(1 ${blink})`}>
          <ellipse rx={22} ry={13} fill="#F6D24A" />
          <ellipse rx={5} ry={12} fill="#120E10" />
        </g>
      ))}
    </g>
  );
};

/** Looking straight down on the forest. */
export const CanopySea: React.FC<{ t: number; seed?: number }> = ({ t, seed = 31 }) => {
  const greens = ['#17392B', '#1E4A33', '#26593A', '#2F6A40', '#123023'];
  return (
    <g>
      <rect x={-1400} y={-1400} width={3900} height={4800} fill="#0E2A1E" />
      {Array.from({ length: 420 }).map((_, i) => {
        const x = -420 + (i % 21) * 94 + rnd(seed, i) * 74;
        const y = -520 + Math.floor(i / 21) * 150 + rnd(seed + 1, i) * 120;
        const r = 56 + rnd(seed + 2, i) * 54;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={greens[Math.floor(rnd(seed + 3, i) * 5)]} />
            <circle cx={x + r * 0.26} cy={y - r * 0.26} r={r * 0.54} fill="#E8A050" opacity={0.13} />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- the river
export const Raft: React.FC<{ x: number; y: number; s?: number; t?: number; children?: React.ReactNode; over?: React.ReactNode }> = ({ x, y, s = 1, t = 0, children, over }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 13) * 7}) rotate(${Math.sin(t / 17) * 1.4}) scale(${s})`}>
    {children}
    <rect x={-470} y={0} width={940} height={38} fill="#6A4A30" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${-470 + i * 80} 0 v 38`} stroke={INK} strokeWidth={4} />)}
    <rect x={-450} y={38} width={900} height={36} fill="#3E2C20" />
    {over}
  </g>
);

export const Zap: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; seed?: number; w?: number }> = ({ x1, y1, x2, y2, t, seed = 1, w = 7 }) => {
  const f = Math.floor(t / 2);
  let d = `M ${x1} ${y1}`;
  for (let k = 1; k < 7; k++) d += ` L ${lerp(x1, x2, k / 7) + (rnd(seed + f, k) - 0.5) * 80} ${lerp(y1, y2, k / 7) + (rnd(seed + f + 3, k) - 0.5) * 80}`;
  d += ` L ${x2} ${y2}`;
  return (
    <g>
      <path d={d} stroke="#7FE8FF" strokeWidth={w * 2.6} fill="none" opacity={0.3} strokeLinejoin="round" />
      <path d={d} stroke="#F2FDFF" strokeWidth={w} fill="none" strokeLinejoin="round" />
    </g>
  );
};

/** An electric eel, tail to head: a long body waving from (x, y0) up to (x, y1). */
export const Eel: React.FC<{ x: number; y0: number; y1: number; t: number; w?: number; amp?: number; mood?: 'calm' | 'cross' }> = ({ x, y0, y1, t, w = 92, amp = 130, mood = 'calm' }) => {
  const at = (u: number) => [x + Math.sin(u * 6.2 + t / 7) * amp * (1 - u * 0.86), lerp(y0, y1, u)];
  let d = '';
  for (let u = 0; u <= 1.0001; u += 0.04) { const [a, b] = at(u); d += `${u === 0 ? 'M' : 'L'} ${a} ${b} `; }
  const [hx, hy] = at(1);
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={w + 12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#3A4C3E" strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#D8843C" strokeWidth={w * 0.26} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(15 0)" />
      <g transform={`translate(${hx} ${hy})`}>
        <ellipse rx={w * 0.74} ry={w * 0.92} fill="#3A4C3E" stroke={INK} strokeWidth={6} />
        <circle cx={-w * 0.3} cy={-w * 0.32} r={w * 0.2} fill="#F4EEDC" stroke={INK} strokeWidth={4} />
        <circle cx={w * 0.3} cy={-w * 0.32} r={w * 0.2} fill="#F4EEDC" stroke={INK} strokeWidth={4} />
        <circle cx={-w * 0.27} cy={-w * 0.36} r={w * 0.08} fill={INK} /><circle cx={w * 0.27} cy={-w * 0.36} r={w * 0.08} fill={INK} />
        {mood === 'cross' ? <path d={`M ${-w * 0.56} ${-w * 0.66} L ${-w * 0.1} ${-w * 0.46} M ${w * 0.56} ${-w * 0.66} L ${w * 0.1} ${-w * 0.46}`} stroke={INK} strokeWidth={8} /> : null}
        <path d={`M ${-w * 0.36} ${w * 0.34} Q 0 ${w * (mood === 'cross' ? 0.14 : 0.52)} ${w * 0.36} ${w * 0.34}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

export const Phone: React.FC<{ x: number; y: number; s?: number; pct?: number; rot?: number }> = ({ x, y, s = 1, pct = 0.1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-46} y={-86} width={92} height={172} rx={14} fill="#16121E" stroke="#4A4458" strokeWidth={4} />
    <rect x={-38} y={-74} width={76} height={148} rx={6} fill="#0E2A1E" />
    <rect x={-22} y={-28} width={44} height={70} rx={5} fill="none" stroke="#F6EFE3" strokeWidth={5} />
    <rect x={-8} y={-38} width={16} height={10} fill="#F6EFE3" />
    <rect x={-16} y={36 - 58 * pct} width={32} height={58 * pct} fill={pct > 0.5 ? '#6FE08A' : '#FF5A4A'} />
  </g>
);

// ---------------------------------------------------------------- the sky river
const flow = (x: number, base: number, amp: number) => base + Math.sin(x / 190) * amp;

export const SkyRiver: React.FC<{ y: number; t: number; h?: number; amp?: number; o?: number }> = ({ y, t, h = 170, amp = 70, o = 1 }) => {
  const top = (k: number) => {
    let d = '';
    for (let x = -300; x <= 1400; x += 40) d += `${x === -300 ? 'M' : 'L'} ${x} ${flow(x + t * 3, y, amp) + k} `;
    return d;
  };
  let rev = '';
  for (let x = 1400; x >= -300; x -= 40) rev += `L ${x} ${flow(x + t * 3, y, amp) + h} `;
  return (
    <g opacity={o}>
      <Glow x={540} y={y + h / 2} r={760} kind="cool" o={0.45} />
      <path d={`${top(0)} ${rev} Z`} fill="#6FC4E8" opacity={0.72} />
      <path d={`${top(h * 0.28)}`} stroke="#E4F8FF" strokeWidth={8} strokeDasharray="90 70" strokeDashoffset={-t * 8} fill="none" opacity={0.9} />
      <path d={`${top(h * 0.62)}`} stroke="#B8ECFF" strokeWidth={6} strokeDasharray="60 90" strokeDashoffset={-t * 11} fill="none" opacity={0.8} />
    </g>
  );
};

/** Vapour rising in threads from the trees. */
export const Vapour: React.FC<{ y0: number; y1: number; t: number; n?: number; seed?: number; x0?: number; w?: number; r?: number }> = ({ y0, y1, t, n = 70, seed = 7, x0 = -40, w = 1160, r = 9 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const k = (t * (0.008 + rnd(seed, i) * 0.01) + rnd(seed + 1, i)) % 1;
      const x = x0 + rnd(seed + 2, i) * w + Math.sin(k * 7 + i) * 26;
      return <ellipse key={i} cx={x} cy={lerp(y0, y1, k)} rx={r * 0.7} ry={r * 1.3} fill="#BCEBFF" opacity={0.85 * Math.sin(k * Math.PI) ** 0.5} />;
    })}
  </g>
);

export const Umbrella: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -150 V 110 Q 0 146 -36 146" stroke="#2A2230" strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M -200 -40 Q -160 -190 0 -190 Q 160 -190 200 -40 Q 150 -74 100 -40 Q 50 -74 0 -40 Q -50 -74 -100 -40 Q -150 -74 -200 -40 Z" fill="#23233A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 0 -190 Q -48 -110 -50 -58 M 0 -190 Q 48 -110 50 -58" stroke="#4A4A70" strokeWidth={5} fill="none" />
  </g>
);

// ---------------------------------------------------------------- the desert
export const Camel: React.FC<{ x: number; y: number; s?: number; dir?: 1 | -1; c?: string; t?: number }> = ({ x, y, s = 1, dir = 1, c = '#1E1420', t = 0 }) => {
  const w = Math.sin(t / 4) * 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`} fill={c}>
      <path d="M -130 -120 Q -120 -170 -80 -170 Q -60 -240 -14 -180 Q 30 -240 54 -160 Q 84 -160 104 -176 L 120 -250 Q 130 -278 164 -272 L 206 -256 L 200 -236 L 152 -236 L 138 -150 Q 120 -104 74 -104 L -96 -100 Z" />
      <path d={`M -104 -110 L ${-112 + w} 0 M -76 -106 L ${-70 - w} 0 M 58 -106 L ${50 + w} 0 M 88 -106 L ${94 - w} 0`} stroke={c} strokeWidth={15} strokeLinecap="round" />
      <path d="M -130 -130 Q -150 -110 -144 -76" stroke={c} strokeWidth={7} fill="none" />
    </g>
  );
};

export const Dune: React.FC<{ y: number; c: string; amp?: number; ph?: number }> = ({ y, c, amp = 90, ph = 0 }) => {
  let d = `M -300 ${y}`;
  for (let x = -300; x <= 1400; x += 40) d += ` L ${x} ${y + Math.sin(x / 260 + ph) * amp + Math.sin(x / 110 + ph * 2) * amp * 0.25}`;
  return <path d={`${d} L 1400 2400 L -300 2400 Z`} fill={c} />;
};

export const Grains: React.FC<{ x0: number; y0: number; w: number; h: number; t: number; n?: number; vx?: number; vy?: number; seed?: number; c?: string; r?: number }> = ({ x0, y0, w, h, t, n = 110, vx = -6, vy = 3, seed = 3, c = '#F2C27A', r = 4 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 0.6 + rnd(seed, i) * 0.8;
      const x = x0 + ((((rnd(seed + 1, i) * w + t * vx * sp) % w) + w) % w);
      const y = y0 + ((((rnd(seed + 2, i) * h + t * vy * sp) % h) + h) % h);
      return <circle key={i} cx={x} cy={y} r={r * (0.6 + rnd(seed + 3, i))} fill={c} opacity={0.75} />;
    })}
  </g>
);

// ---------------------------------------------------------------- the maps
export const SA_PATH = 'M 180 20 L 300 10 L 370 70 L 470 130 L 590 230 L 570 330 L 510 420 L 470 520 L 400 590 L 330 680 L 300 780 L 300 880 L 250 890 L 220 780 L 230 640 L 240 520 L 190 440 L 90 370 L 40 280 L 70 170 L 120 90 Z';
export const FOREST_PATH = 'M 90 180 Q 200 90 340 130 Q 460 170 520 240 Q 480 340 380 380 Q 240 420 130 340 Q 70 270 90 180 Z';
export const AFRICA_PATH = 'M 640 200 L 860 170 L 1040 230 L 1120 400 L 1200 470 L 1130 640 L 1100 820 L 1020 980 L 940 1000 L 890 820 L 860 650 L 740 600 L 620 520 L 590 340 Z';
export const KERALA_PATH = 'M 20 0 L 70 10 L 120 130 L 170 300 L 215 470 L 270 640 L 300 820 L 270 960 L 230 1000 L 190 900 L 140 720 L 100 540 L 60 370 L 20 180 Z';
export const keralaAt = (k: number): [number, number] => [lerp(45, 245, k) + Math.sin(k * 3.1) * 8, lerp(14, 982, k)];

export const MapBg: React.FC<{ id: string; a?: string; b?: string }> = ({ id, a = '#0B1830', b = '#143044' }) => (
  <g>
    <defs>
      <linearGradient id={`mb_${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
    </defs>
    <rect x={-400} y={-400} width={1900} height={2800} fill={`url(#mb_${id})`} />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M -100 ${i * 130} H 1200`} stroke="#6FD0E0" strokeWidth={1.5} opacity={0.07} />)}
    {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${i * 130} -100 V 2100`} stroke="#6FD0E0" strokeWidth={1.5} opacity={0.07} />)}
  </g>
);

// ---------------------------------------------------------------- readouts
/** The film's thread: where the auto is on the 885 km road. */
export const TripChip: React.FC<{ km: number; t: number; y?: number }> = ({ km, t, y = 230 }) => {
  const k = backOut(clamp(t / 6));
  const p = clamp(km / 885);
  return (
    <g transform={`translate(540 ${y}) scale(${k})`}>
      <rect x={-400} y={-82} width={800} height={164} rx={34} fill="#0E120E" opacity={0.82} />
      <rect x={-400} y={-82} width={800} height={164} rx={34} fill="none" stroke="#E8B52E" strokeWidth={4} />
      <text y={-14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#F6EFE3"><tspan fill="#E8B52E">{Math.round(km)}</tspan> / 885 കി.മീ</text>
      <rect x={-340} y={26} width={680} height={10} rx={5} fill="#4A4458" />
      <rect x={-340} y={26} width={680 * p} height={10} rx={5} fill="#E8B52E" />
      <circle cx={-340 + 680 * p} cy={31} r={15} fill="#E8B52E" stroke="#0E120E" strokeWidth={4} />
      <text x={-340} y={72} fontFamily={FONT.title} fontWeight={700} fontSize={31} fill="#CFC6B4">മനാസ്</text>
      <text x={340} y={72} textAnchor="end" fontFamily={FONT.title} fontWeight={700} fontSize={31} fill="#CFC6B4">പോർട്ടോ വെല്ലോ</text>
    </g>
  );
};

export const Sign: React.FC<{ x: number; y: number; s?: number; rot?: number; top: string; sub?: string; c?: string }> = ({ x, y, s = 1, rot = 0, top, sub, c = '#1E5A3A' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-190} y={0} width={20} height={380} fill="#5A5048" /><rect x={170} y={0} width={20} height={380} fill="#5A5048" />
    <rect x={-240} y={-130} width={480} height={220} rx={14} fill={c} stroke="#F2EEE2" strokeWidth={7} />
    <text y={-34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3">{top}</text>
    {sub ? <text y={46} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={50} fill="#F2D88A">{sub}</text> : null}
  </g>
);

export { Stars };

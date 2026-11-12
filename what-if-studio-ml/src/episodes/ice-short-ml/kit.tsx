// ice-short-ml's own pieces, drawn for a 1080 x 1920 world: the penguin who runs through the episode, ice, the
// houseboat, the bund, station boards, the Chinese net, the flat tower. Pure functions of the clock.
import React from 'react';
import { Pose, FONT, Glow, clamp, backOut, rnd } from '../../engine';
import { Water, headAt } from '../fly-ml/kit';

const INK = '#1A1230';

/** Dusk water: fly-ml's Water, with the sun's glitter down it at sunX. */
export const Sea: React.FC<{ t: number; y: number; sunX?: number; rough?: number }> = ({ t, y, sunX = 820, rough = 0 }) => (
  <g>
    <Water t={t} y={y} rough={rough} />
    <rect x={-300} y={y} width={1700} height={2400} fill="#2A1E4A" opacity={0.42} />
    {Array.from({ length: 16 }).map((_, i) => {
      const yy = y + 14 + i * i * 3.4;
      const w = 50 + i * 12 + Math.sin(t / 5 + i * 1.7) * 18;
      return <rect key={i} x={sunX - w / 2 + Math.sin(t / 7 + i) * 14} y={yy} width={w} height={5 + i * 0.4} rx={3} fill="#FFC27A" opacity={0.62 - i * 0.026} />;
    })}
  </g>
);

/** The ring a thing makes where it meets the water. */
export const Ripple: React.FC<{ x: number; y: number; r: number; t?: number }> = ({ x, y, r, t = 0 }) => (
  <g fill="none" stroke="#D8F0EE">
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.16} strokeWidth={5} opacity={0.75} />
    <ellipse cx={x} cy={y + 4} rx={r * (1.3 + 0.08 * Math.sin(t / 6))} ry={r * 0.24} strokeWidth={3} opacity={0.35} />
  </g>
);

// ---------------------------------------------------------------- the penguin
/** Feet at (x, y), about 210 tall at s = 1. dir is the way he looks; front looks at camera. */
export const Penguin: React.FC<{ x: number; y: number; s?: number; dir?: 1 | -1; front?: boolean; mood?: 'calm' | 'shock' | 'sad'; flap?: number; rot?: number }> = ({
  x, y, s = 1, dir = 1, front = false, mood = 'calm', flap = 0, rot = 0,
}) => {
  const big = mood === 'shock';
  const eyes = front ? [-20, 20] : [14, 40];
  const er = big ? 15 : 11;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * (front ? 1 : dir)} ${s})`}>
      <ellipse cx={0} cy={2} rx={62} ry={10} fill="#000" opacity={0.28} />
      {[-26, 26].map((fx, i) => <ellipse key={i} cx={fx + (front ? 0 : 8)} cy={-4} rx={28} ry={10} fill="#F09A2E" stroke={INK} strokeWidth={5} />)}
      <path d={`M -56 -92 Q ${-96 - flap * 26} ${-64 - flap * 40} ${-84 - flap * 18} ${-36 - flap * 66}`} stroke={INK} strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d={`M -56 -92 Q ${-96 - flap * 26} ${-64 - flap * 40} ${-84 - flap * 18} ${-36 - flap * 66}`} stroke="#34405F" strokeWidth={20} strokeLinecap="round" fill="none" />
      <path d="M 0 -210 C 78 -210 78 -120 74 -70 C 70 -22 44 -8 0 -8 C -44 -8 -70 -22 -74 -70 C -78 -120 -78 -210 0 -210 Z" fill="#2E3A58" stroke={INK} strokeWidth={6} />
      <path d={`M ${front ? 0 : 12} -128 C ${front ? 56 : 66} -128 ${front ? 56 : 66} -16 ${front ? 0 : 12} -16 C ${front ? -56 : -42} -16 ${front ? -56 : -42} -128 ${front ? 0 : 12} -128 Z`} fill="#F4F0E6" />
      <path d="M 40 -196 C 74 -176 74 -110 70 -70" stroke="#FFB15A" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d={`M 56 -92 Q ${94 + flap * 26} ${-64 - flap * 40} ${82 + flap * 18} ${-36 - flap * 66}`} stroke={INK} strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d={`M 56 -92 Q ${94 + flap * 26} ${-64 - flap * 40} ${82 + flap * 18} ${-36 - flap * 66}`} stroke="#34405F" strokeWidth={20} strokeLinecap="round" fill="none" />
      {eyes.map((ex, i) => (
        <g key={i}>
          <circle cx={ex} cy={-164} r={er + 5} fill="#FFFFFF" />
          <circle cx={ex + (front ? 0 : 3)} cy={-163} r={er - 3} fill="#14121C" />
        </g>
      ))}
      {mood === 'sad' ? eyes.map((ex, i) => <path key={i} d={`M ${ex - 16} ${-186 + (i ? -7 : 7) * (front ? 1 : 1)} L ${ex + 16} ${-186 + (i ? 7 : -7) * -1}`} stroke="#14121C" strokeWidth={5} strokeLinecap="round" />) : null}
      {front
        ? <path d={big ? 'M -16 -146 L 16 -146 L 0 -116 Z' : 'M -16 -146 L 16 -146 L 0 -128 Z'} fill="#F09A2E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        : <path d={big ? 'M 44 -152 L 92 -146 L 46 -122 Z' : 'M 44 -150 L 92 -138 L 46 -128 Z'} fill="#F09A2E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
    </g>
  );
};

/** A chunk of ice afloat: y is the waterline. */
export const IceChunk: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 9) * 4}) rotate(${Math.sin(t / 13) * 1.6}) scale(${s})`}>
    <path d="M -170 0 L -120 56 L 40 74 L 150 44 L 176 0 Z" fill="#7FC6D8" opacity={0.5} />
    <path d="M -180 0 L -150 -46 L -74 -58 L -30 -46 L 60 -60 L 134 -44 L 182 0 Z" fill="#E6F7FA" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -74 -58 L -44 -8 L -112 0 M 60 -60 L 34 -12 L 118 -6" stroke="#A9DDE8" strokeWidth={5} fill="none" />
    <path d="M -182 0 L 184 0" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" />
  </g>
);

export const Suitcase: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = '#B8452E', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -24 -56 L -24 -76 L 24 -76 L 24 -56" stroke={INK} strokeWidth={8} fill="none" />
    <rect x={-66} y={-56} width={132} height={92} rx={12} fill={c} stroke={INK} strokeWidth={6} />
    <path d="M -38 -56 V 36 M 38 -56 V 36" stroke="#000" strokeOpacity={0.3} strokeWidth={9} />
    <rect x={-12} y={-20} width={24} height={16} rx={3} fill="#E8C86A" stroke={INK} strokeWidth={3} />
  </g>
);

export const Fish: React.FC<{ x: number; y: number; s?: number; dir?: 1 | -1; c?: string; rot?: number }> = ({ x, y, s = 1, dir = 1, c = '#E8A23E', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * dir} ${s})`}>
    <path d="M -46 0 L -82 -28 L -74 0 L -82 28 Z" fill={c} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={0} cy={0} rx={56} ry={27} fill={c} stroke={INK} strokeWidth={5} />
    <path d="M 18 -22 Q 8 0 18 22" stroke={INK} strokeOpacity={0.5} strokeWidth={4} fill="none" />
    <circle cx={32} cy={-6} r={6} fill="#FFFFFF" /><circle cx={33} cy={-6} r={3} fill="#14121C" />
  </g>
);

export const Duck: React.FC<{ x: number; y: number; s?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, dir = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
    <path d="M -70 -28 Q -92 -60 -60 -52 Q -20 -70 30 -44 Q 66 -20 40 -2 Q -40 12 -70 -28 Z" fill="#F2EEE2" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 28 -44 Q 24 -66 40 -84" stroke={INK} strokeWidth={29} strokeLinecap="round" fill="none" />
    <path d="M 28 -44 Q 24 -66 40 -84" stroke="#F2EEE2" strokeWidth={19} strokeLinecap="round" fill="none" />
    <circle cx={44} cy={-92} r={24} fill="#F2EEE2" stroke={INK} strokeWidth={5} />
    <circle cx={52} cy={-97} r={5} fill="#14121C" />
    <path d="M 64 -96 L 96 -88 L 64 -78 Z" fill="#F09A2E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

// ---------------------------------------------------------------- boats
/** A kettuvallam. x, y is the middle of the waterline; dir -1 has the open bow deck at the left. */
export const Houseboat: React.FC<{ x: number; y: number; s?: number; t?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, t = 0, dir = -1 }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 10) * 4}) scale(${s * -dir} ${s})`}>
    {/* the roof, ribbed cane over a lit cabin */}
    <rect x={-330} y={-170} width={560} height={130} fill="#4A2F22" stroke={INK} strokeWidth={6} />
    {[-300, -200, -100, 0, 100].map((wx) => (
      <g key={wx}>
        <rect x={wx} y={-144} width={70} height={74} fill="#FFC867" stroke={INK} strokeWidth={5} />
        <line x1={wx + 35} y1={-144} x2={wx + 35} y2={-70} stroke={INK} strokeWidth={4} />
      </g>
    ))}
    <Glow x={-120} y={-110} r={300} kind="warm" o={0.45} />
    <path d="M -372 -160 Q -340 -300 -60 -306 Q 220 -300 270 -160 Z" fill="#C49A5A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[-290, -220, -140, -60, 20, 100, 180].map((rx, i) => <path key={i} d={`M ${rx} -162 Q ${rx + 8} -250 ${rx * 0.84 - 8} ${-296 - (i % 2) * 3}`} stroke="#9A7238" strokeWidth={5} fill="none" />)}
    <path d="M -372 -160 Q -360 -196 -336 -222" stroke="#E4C07E" strokeWidth={6} fill="none" />
    {/* the hull, long and rising at both ends */}
    <path d="M -560 -120 Q -500 -44 -360 -40 L 300 -40 Q 460 -44 520 -116 Q 520 -40 430 18 Q 0 44 -440 18 Q -552 -30 -560 -120 Z" fill="#3E2619" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M -520 -74 Q -400 -24 -340 -24 L 300 -24 Q 420 -24 500 -72" stroke="#7A4E32" strokeWidth={6} fill="none" />
  </g>
);

/** A chundan: low and black, stern rearing up, a row of paddlers. */
export const Chundan: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 13 }).map((_, i) => {
      const px = -440 + i * 66;
      const pull = Math.sin(t / 3 + i * 0.25);
      return (
        <g key={i}>
          <line x1={px} y1={-30} x2={px + pull * 6} y2={-74} stroke="#EFE8D8" strokeWidth={12} strokeLinecap="round" />
          <circle cx={px + pull * 8} cy={-92} r={15} fill={['#B98562', '#C69A74', '#A9775A'][i % 3]} stroke={INK} strokeWidth={3} />
          <line x1={px + pull * 5} y1={-60} x2={px + 34 + pull * 20} y2={24} stroke="#D8B26A" strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    })}
    <path d="M -600 -300 Q -590 -80 -420 -34 L 420 -30 Q 500 -30 560 -60 Q 460 12 330 14 L -420 14 Q -660 -60 -600 -300 Z" fill="#1A1420" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -590 -270 Q -570 -70 -420 -22 L 420 -18" stroke="#C9A24A" strokeWidth={6} fill="none" />
    <path d="M -606 -300 l 26 -30 l 14 34 Z" fill="#E8C86A" stroke={INK} strokeWidth={4} />
  </g>
);

// ---------------------------------------------------------------- Kerala bits
/** A yellow railway-style station board. x, y is the middle of its bottom edge. */
export const StationBoard: React.FC<{ x: number; y: number; name: string; s?: number; rot?: number; posts?: boolean }> = ({ x, y, name, s = 1, rot = 0, posts = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {posts ? [-230, 230].map((px) => <rect key={px} x={px - 11} y={-20} width={22} height={1200} fill="#2C2A34" stroke={INK} strokeWidth={4} />) : null}
    <rect x={-300} y={-190} width={600} height={190} rx={6} fill="#F2C53A" stroke={INK} strokeWidth={8} />
    <rect x={-284} y={-174} width={568} height={158} fill="none" stroke="#1E1716" strokeWidth={5} />
    <text y={-68} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={94} fill="#16121E">{name}</text>
  </g>
);

/** A palm-leaf farmer's hat on any figure. */
export const Hat: React.FC<{ pose: Partial<Pose> }> = ({ pose }) => {
  const h = headAt(pose);
  const s = pose.scale ?? 1;
  return (
    <g transform={`translate(${h.x} ${h.y - 40 * s}) rotate(${(pose.tilt ?? 0) + (pose.headTilt ?? 0)}) scale(${s})`}>
      <path d="M -104 8 Q 0 -74 104 8 Q 0 34 -104 8 Z" fill="#C9A45A" stroke="#16121E" strokeWidth={5} strokeLinejoin="round" />
      <path d="M -60 -2 Q 0 -46 60 -2 M -32 -18 Q 0 -44 32 -18" stroke="#9A7A3E" strokeWidth={4} fill="none" />
    </g>
  );
};

/** Paddy rows on the field, from x0 to x1 at ground y. */
export const Paddy: React.FC<{ x0: number; x1: number; y: number; h?: number; t?: number; seed?: number }> = ({ x0, x1, y, h = 60, t = 0, seed = 3 }) => (
  <g strokeLinecap="round" fill="none">
    {Array.from({ length: Math.floor((x1 - x0) / 26) }).map((_, i) => {
      const x = x0 + i * 26 + rnd(seed, i) * 12;
      const hh = h * (0.75 + rnd(seed + 1, i) * 0.5);
      const w = Math.sin(t / 14 + i) * 5;
      return (
        <g key={i} stroke={i % 3 ? '#6E9E46' : '#8AB856'} strokeWidth={h / 13}>
          <path d={`M ${x} ${y} Q ${x - 3} ${y - hh * 0.6} ${x - 12 + w} ${y - hh}`} />
          <path d={`M ${x} ${y} Q ${x + 3} ${y - hh * 0.6} ${x + 12 + w} ${y - hh * 0.92}`} />
        </g>
      );
    })}
  </g>
);

/** The big copper biriyani pot, sealed with dough. */
export const Handi: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-50, 0, 50].map((sx, i) => {
      const ph = ((t + i * 11) % 34) / 34;
      return <path key={i} d={`M ${sx} ${-100 - ph * 110} q 22 -26 0 -52 q -22 -26 0 -52`} stroke="#F6EFE3" strokeWidth={13} strokeLinecap="round" fill="none" opacity={(1 - ph) * 0.7} />;
    })}
    <path d="M -150 -40 Q -170 90 -80 112 L 80 112 Q 170 90 150 -40 Z" fill="#B8703A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M -128 -10 Q -136 70 -74 92" stroke="#E0A06A" strokeWidth={9} fill="none" strokeLinecap="round" />
    <rect x={-162} y={-62} width={324} height={30} rx={14} fill="#EFE1BE" stroke={INK} strokeWidth={6} />
    <path d="M -130 -62 Q 0 -128 130 -62 Z" fill="#8E5A30" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={0} cy={-100} r={15} fill="#C9A24A" stroke={INK} strokeWidth={5} />
  </g>
);

/** A Chinese net at Fort Kochi: the frame swings out from the bank at left, and the bag hangs at (bx, by). */
export const ChinaNet: React.FC<{ bx: number; by: number; children?: React.ReactNode }> = ({ bx, by, children }) => {
  const tip = { x: bx - 40, y: by - 640 };
  const a = { x: bx - 360, y: by - 90 };
  const b = { x: bx + 360, y: by - 110 };
  return (
    <g>
      {/* the frame */}
      <path d={`M -40 1500 L ${tip.x} ${tip.y} M 120 1560 L ${tip.x} ${tip.y}`} stroke="#3A2A22" strokeWidth={26} strokeLinecap="round" fill="none" />
      <path d={`M -40 1500 L ${tip.x} ${tip.y}`} stroke="#7A5A3E" strokeWidth={10} strokeLinecap="round" fill="none" />
      <path d={`M ${tip.x} ${tip.y} L ${a.x} ${a.y} M ${tip.x} ${tip.y} L ${b.x} ${b.y}`} stroke="#3A2A22" strokeWidth={14} strokeLinecap="round" />
      {children}
      {/* the bag */}
      <path d={`M ${a.x} ${a.y} Q ${bx - 340} ${by + 330} ${bx} ${by + 340} Q ${bx + 340} ${by + 330} ${b.x} ${b.y}`} fill="#E8E0CC" fillOpacity={0.08} stroke="#E8E0CC" strokeWidth={6} />
      {Array.from({ length: 13 }).map((_, i) => {
        const k = i / 12;
        return <path key={i} d={`M ${a.x + (b.x - a.x) * k} ${a.y + (b.y - a.y) * k} Q ${bx + (k - 0.5) * 520} ${by + 260} ${bx + (k - 0.5) * 120} ${by + 340}`} stroke="#E8E0CC" strokeWidth={2.5} fill="none" opacity={0.55} />;
      })}
      {[0.35, 0.6, 0.82].map((k, i) => <path key={i} d={`M ${a.x + 10 + k * 18} ${a.y + k * 320} Q ${bx} ${by + 150 + k * 300} ${b.x - 10 - k * 18} ${b.y + k * 320}`} stroke="#E8E0CC" strokeWidth={2.5} fill="none" opacity={0.5} />)}
    </g>
  );
};

/** A block of flats, floors tall, its top at y. Window lights scatter by seed. */
export const Tower: React.FC<{ x: number; top: number; floors?: number; fh?: number; w?: number; seed?: number; banner?: string }> = ({ x, top, floors = 23, fh = 56, w = 440, seed = 9, banner }) => (
  <g>
    <rect x={x - w / 2} y={top} width={w} height={floors * fh + 200} fill="#4C4556" stroke={INK} strokeWidth={7} />
    <rect x={x - w / 2 - 14} y={top - 16} width={w + 28} height={24} fill="#332E3E" stroke={INK} strokeWidth={5} />
    <rect x={x - 70} y={top - 76} width={140} height={60} fill="#7A7484" stroke={INK} strokeWidth={5} />
    {Array.from({ length: floors }).map((_, r) => (
      <g key={r}>
        <rect x={x - w / 2} y={top + r * fh + fh - 7} width={w} height={6} fill="#332E3E" />
        {[0, 1, 2, 3].map((c) => {
          const lit = rnd(seed, r * 4 + c) > 0.5;
          return <rect key={c} x={x - w / 2 + 28 + c * ((w - 56) / 4)} y={top + r * fh + 10} width={(w - 56) / 4 - 22} height={fh - 26} fill={lit ? '#FFC867' : '#1E1B2A'} stroke={INK} strokeWidth={3} />;
        })}
      </g>
    ))}
    {banner ? (
      <g>
        <rect x={x - w / 2 - 34} y={top + 30} width={w + 68} height={92} rx={6} fill="#C8352E" stroke={INK} strokeWidth={6} />
        <text x={x} y={top + 95} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFF2D8">{banner}</text>
      </g>
    ) : null}
  </g>
);

/** The sea-level readout. */
export const LevelChip: React.FC<{ text: string; t: number; y?: number }> = ({ text, t, y = 300 }) => {
  const k = backOut(clamp(t / 6));
  return (
    <g transform={`translate(540 ${y}) scale(${k})`}>
      <rect x={-250} y={-74} width={500} height={148} rx={36} fill="#120E22" opacity={0.8} />
      <rect x={-250} y={-74} width={500} height={148} rx={36} fill="none" stroke="#6FD0E0" strokeWidth={4} />
      <text y={24} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3">{text}</text>
    </g>
  );
};

/** Something standing in the sea: local y = 0 is the waterline, nothing below it shows. */
export const Tip: React.FC<{ id: string; x: number; y: number; s?: number; t?: number; children: React.ReactNode }> = ({ id, x, y, s = 1, t = 0, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <clipPath id={`tip_${id}`}><rect x={-900} y={-1600} width={1800} height={1600} /></clipPath>
    <g clipPath={`url(#tip_${id})`}>{children}</g>
    <Ripple x={0} y={0} r={110} t={t} />
  </g>
);

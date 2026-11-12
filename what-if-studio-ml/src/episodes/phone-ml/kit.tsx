// phone-ml's own pieces, drawn for a 1080 x 1920 world: the cast's Kerala extras (tea man, uncle, neighbour, the
// brother in the Gulf), the tea shop, the road, the bus stop, the terrace and the veranda. Pure functions of the clock.
import React from 'react';
import { Look, Pose, FONT, Glow, clamp, backOut, rnd, LEG_LEN, SCH } from '../../engine';
import { Fig, full, headAt, Palm, Sky } from '../fly-ml/kit';

const INK = '#1A1230';
export const ground = (g: number, s: number) => g - LEG_LEN * s;
/** The vertical camera: world point (cx, cy) at the frame centre, scaled by s. */
export const vcam = (cx: number, cy: number, s: number) => `translate(540 960) scale(${s}) translate(${-cx} ${-cy})`;

// ---------------------------------------------------------------- cast
const person = (skin: string, shade: string, shirt: string, shirtD: string, limb: string, hair: string): Look => ({
  skin, skinShade: shade, hand: skin, jacket: shirt, jacketShade: shirtD, accent: shirtD, limb, line: '#16121E', shoe: '#3A2A22', face: '#241C2E', hair,
});
export const TEAMAN = person('#B98562', '#A06F50', '#E4DCC8', '#C6BCA4', '#B98562', '#1E1716');
export const UNCLE = person('#C69A74', '#AC835F', '#EFE8D8', '#D2C8B2', '#EFE8D8', '#A9A7AE');
export const NBR = person('#A9775A', '#92644A', '#3E6E8C', '#2F566E', '#2F3A4E', '#1E1716');
export const BRO = person('#C08C68', '#A67656', '#2F7E7C', '#236260', '#343A50', '#17141A');
export const CROWD: Look[] = [
  person('#C08C68', '#A67656', '#A0524A', '#82403A', '#343A50', '#1E1716'),
  person('#A9775A', '#92644A', '#5C6E9C', '#48587E', '#2E2B3D', '#1E1716'),
  person('#D0A67E', '#B68E68', '#8A7A3E', '#6E6030', '#3A3446', '#3A2620'),
  person('#B98562', '#A06F50', '#7A5A8C', '#604670', '#2E2B3D', '#1E1716'),
  person('#C69A74', '#AC835F', '#3E8C6E', '#2F6E56', '#343A50', '#2A1C18'),
];

/** A white mundu over the legs, drawn after the figure. */
export const Mundu: React.FC<{ pose: Partial<Pose>; c?: string; border?: string }> = ({ pose, c = '#EFE8D8', border = '#C9A24A' }) => {
  const p = full(pose);
  const s = p.scale;
  const h = LEG_LEN * s * 0.92;
  const d = `M ${p.x - 44 * s} ${p.y - 18 * s} L ${p.x + 44 * s} ${p.y - 18 * s} L ${p.x + 56 * s} ${p.y + h} L ${p.x - 56 * s} ${p.y + h} Z`;
  return (
    <g>
      <path d={d} fill={c} stroke="#16121E" strokeWidth={4 * s} strokeLinejoin="round" />
      <path d={`M ${p.x + 10 * s} ${p.y - 16 * s} L ${p.x + 20 * s} ${p.y + h}`} stroke="#000" strokeOpacity={0.14} strokeWidth={5 * s} />
      <rect x={p.x - 55 * s} y={p.y + h - 12 * s} width={110 * s} height={8 * s} fill={border} />
    </g>
  );
};

/** A moustache on any figure, with optional glasses and grey sides (the uncle). */
export const Tache: React.FC<{ pose: Partial<Pose>; c?: string; specs?: boolean; sides?: string }> = ({ pose, c = '#1E1716', specs, sides }) => {
  const p = full(pose);
  const s = p.scale;
  const h = headAt(pose);
  const fx = h.x + p.yaw * 26 * s;
  return (
    <g>
      {sides ? <path d={`M ${h.x - 60 * s} ${h.y - 8 * s} q ${-4 * s} ${-44 * s} ${30 * s} ${-54 * s} q ${-14 * s} ${30 * s} ${-12 * s} ${54 * s} Z`} fill={sides} /> : null}
      <path d={`M ${fx - 26 * s} ${h.y + 24 * s} q ${26 * s} ${-16 * s} ${52 * s} 0 q ${-26 * s} ${6 * s} ${-52 * s} 0 Z`} fill={c} stroke={c} strokeWidth={3 * s} strokeLinejoin="round" />
      {specs ? (
        <g fill="none" stroke="#2A2230" strokeWidth={4 * s}>
          <rect x={fx - 34 * s} y={h.y - 16 * s} width={28 * s} height={22 * s} rx={7 * s} />
          <rect x={fx + 6 * s} y={h.y - 16 * s} width={28 * s} height={22 * s} rx={7 * s} />
          <path d={`M ${fx - 6 * s} ${h.y - 8 * s} h ${12 * s}`} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- text and chips
export const Say: React.FC<{ y: number; text: string; size?: number; color?: string; t?: number; x?: number }> = ({ y, text, size = 84, color = '#F6EFE3', t = 99, x = 540 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  return (
    <text x={x} y={y} textAnchor="middle" transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#120E22" strokeWidth={size / 7} paintOrder="stroke">{text}</text>
  );
};

/** The episode's readout: which day it is, with seven dots. */
export const DayChip: React.FC<{ day: number; t: number }> = ({ day, t }) => {
  const k = backOut(clamp(t / 6));
  return (
    <g transform={`translate(540 300) scale(${k})`}>
      <rect x={-210} y={-74} width={420} height={148} rx={36} fill="#120E22" opacity={0.78} />
      <rect x={-210} y={-74} width={420} height={148} rx={36} fill="none" stroke="#FFB15A" strokeWidth={4} />
      <text y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">ദിവസം <tspan fill="#FFB15A">{day}</tspan></text>
      {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={-120 + i * 40} cy={46} r={10} fill={i < day ? '#FFB15A' : '#4A4458'} />)}
    </g>
  );
};

// ---------------------------------------------------------------- tea shop
export const TeaGlass: React.FC<{ x: number; y: number; s?: number; fill?: number; t?: number; steam?: boolean }> = ({ x, y, s = 1, fill = 0.82, t = 0, steam = false }) => {
  const h = 100;
  const top = -h * fill;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={3} rx={42} ry={7} fill="#000" opacity={0.3} />
      {fill > 0 ? (
        <g>
          <path d={`M -32 0 L ${-32 - 6 * fill} ${top} L ${32 + 6 * fill} ${top} L 32 0 Z`} fill="#A8652E" />
          <rect x={-38} y={top - 2} width={76} height={13} rx={6} fill="#E8C89A" />
        </g>
      ) : null}
      <path d={`M -32 0 L -40 ${-h} L 40 ${-h} L 32 0 Z`} fill="#DDEBF0" fillOpacity={fill > 0 ? 0.14 : 0.3} stroke="#E8F1F4" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M -22 -10 L -28 -86" stroke="#FFF" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
      {steam ? [0, 1, 2].map((i) => {
        const ph = ((t * 1.3 + i * 22) % 66) / 66;
        return <path key={i} d={`M ${-16 + i * 16} ${-112 - ph * 90} q 12 -16 0 -32 q -12 -16 0 -32`} stroke="#FFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.42 * (1 - ph)} />;
      }) : null}
    </g>
  );
};

/** A leaning tower of washed glasses: `rows` from the ground up, `sway` tips the top. */
export const GlassTower: React.FC<{ x: number; y: number; rows: number; s?: number; sway?: number; wide?: number }> = ({ x, y, rows, s = 1, sway = 0, wide = 5 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={wide * 56} ry={18} fill="#000" opacity={0.3} />
    {Array.from({ length: rows }).map((_, r) => {
      const n = Math.max(1, wide - Math.floor(r / 3));
      const off = sway * (r / rows) * (r / rows) * 90 + (rnd(4, r) - 0.5) * 8;
      return Array.from({ length: n }).map((__, i) => (
        <g key={`${r}-${i}`} transform={`translate(${(i - (n - 1) / 2) * 92 + off} ${-r * 96}) scale(1 -1) translate(0 -100)`}>
          <path d="M -32 0 L -40 -100 L 40 -100 L 32 0 Z" fill="#CFE4EC" fillOpacity={0.24} stroke="#F2F8FA" strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M -20 -14 L -26 -84" stroke="#FFF" strokeWidth={4.5} opacity={0.45} strokeLinecap="round" />
        </g>
      ));
    })}
  </g>
);

const Bulb: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 420, o = 0.75 }) => (
  <g>
    <path d={`M ${x} ${y - 700} L ${x} ${y - 16}`} stroke="#16121E" strokeWidth={5} />
    <Glow x={x} y={y} r={r} kind="warm" o={o} />
    <circle cx={x} cy={y} r={20} fill="#FFE9A8" />
    <circle cx={x} cy={y} r={11} fill="#FFFFFF" />
  </g>
);

/** Behind the tea shop: a laterite wall, a stone sink with a tap, one bulb. The floor starts at y 1480. */
export const BackYard: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <rect x={-400} y={-300} width={1900} height={1780} fill="#5C3A32" />
    {Array.from({ length: 34 }).map((_, r) => Array.from({ length: 13 }).map((__, i) => (
      <rect key={`${r}-${i}`} x={-340 + i * 150 + (r % 2) * 75} y={-200 + r * 58} width={144} height={52} fill={rnd(11, r * 13 + i) > 0.5 ? '#6A4438' : '#553429'} opacity={0.8} />
    )))}
    <rect x={-400} y={1480} width={1900} height={800} fill="#2C2230" />
    <rect x={-400} y={1474} width={1900} height={12} fill="#1A1420" />
    <Bulb x={260} y={520} r={560} o={0.8} />
    <Dusty t={t} id={id} />
  </g>
);
const Dusty: React.FC<{ t: number; id: string }> = ({ t }) => (
  <g>{Array.from({ length: 16 }).map((_, i) => {
    const y = 300 + ((rnd(2, i) * 900 + t * (0.6 + rnd(3, i))) % 900);
    return <circle key={i} cx={80 + rnd(1, i) * 620} cy={y} r={2 + rnd(5, i) * 3} fill="#FFE2B0" opacity={0.3} />;
  })}</g>
);

export const Sink: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-250} y={0} width={500} height={250} fill="#6E6A72" stroke={INK} strokeWidth={6} />
    <rect x={-270} y={-24} width={540} height={34} rx={8} fill="#8C8890" stroke={INK} strokeWidth={6} />
    <rect x={-200} y={40} width={400} height={16} fill="#57535C" />
    <path d="M 170 -24 L 170 -128 q 0 -24 -34 -24 L 92 -152" stroke="#B8B4BC" strokeWidth={18} fill="none" strokeLinecap="round" />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${88 + i * 4} -142 L ${88 + Math.sin(t / 2 + i) * 3} -30`} stroke="#BFE3F2" strokeWidth={5} opacity={0.7} />)}
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-140 + i * 60 + Math.sin(t / 7 + i) * 6} cy={-32 - (i % 2) * 12} r={13 + (i % 3) * 5} fill="#F6FBFD" opacity={0.75} />)}
  </g>
);

/** The tea shop from the road. Counter top at y 1160; the road starts at y 1540. */
export const ChayaFront: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Sky id="chaya" mode="dusk" y0={-200} y1={1500} />
    <rect x={-300} y={520} width={1700} height={1020} fill="#3A2830" />
    {/* inside: shelves, jars, a calendar */}
    <rect x={40} y={640} width={1000} height={18} fill="#21161E" />
    <rect x={40} y={820} width={1000} height={18} fill="#21161E" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <g key={i}>
      <rect x={70 + i * 118} y={536} width={78} height={104} rx={14} fill={['#C9842E', '#D9B45A', '#B4552E'][i % 3]} opacity={0.72} />
      <rect x={70 + i * 118} y={716} width={78} height={104} rx={14} fill={['#A9602E', '#C9A24A', '#8A5A3E'][(i + 1) % 3]} opacity={0.6} />
      <rect x={78 + i * 118} y={524} width={62} height={16} rx={4} fill="#E8E0D0" opacity={0.6} />
    </g>)}
    {/* banana bunch and the bulb */}
    <path d="M 170 450 L 170 880" stroke="#16121E" strokeWidth={5} />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${120 + (i % 4) * 34} ${900 + Math.floor(i / 4) * 56} q 16 42 44 46`} stroke="#E9C35A" strokeWidth={22} fill="none" strokeLinecap="round" />)}
    <Bulb x={560} y={700} r={620} o={0.75} />
    {/* tiled awning and sign */}
    <path d="M -300 500 L 1400 500 L 1400 300 L -300 300 Z" fill="#7A2E1E" stroke={INK} strokeWidth={7} />
    {Array.from({ length: 5 }).map((_, i) => <line key={i} x1={-300} x2={1400} y1={330 + i * 36} y2={330 + i * 36} stroke="#5A1F14" strokeWidth={6} />)}
    <rect x={190} y={420} width={700} height={132} rx={10} fill="#F2C53D" stroke={INK} strokeWidth={7} />
    <text x={540} y={514} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#8A2A1E">ചായക്കട</text>
    <rect x={-300} y={1540} width={1700} height={500} fill="#272030" />
  </g>
);

/** The shop counter, drawn in front of whoever stands behind it. */
export const Counter: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-300} y={1160} width={1700} height={400} fill="#5E3C2A" stroke={INK} strokeWidth={7} />
    <rect x={-300} y={1140} width={1700} height={34} fill="#8A5E3E" stroke={INK} strokeWidth={6} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-260 + i * 340} y={1200} width={300} height={320} fill="none" stroke="#45291C" strokeWidth={6} />)}
    {/* the samovar */}
    <g transform="translate(860 1140)">
      <rect x={-78} y={-210} width={156} height={210} rx={26} fill="#C8B98E" stroke={INK} strokeWidth={6} />
      <rect x={-78} y={-150} width={156} height={16} fill="#8E8056" />
      <rect x={-20} y={-238} width={40} height={30} rx={8} fill="#8E8056" stroke={INK} strokeWidth={5} />
      <path d="M -78 -60 L -112 -60 L -112 -38" stroke="#8E8056" strokeWidth={14} fill="none" />
      {[0, 1].map((i) => {
        const ph = ((t * 1.1 + i * 30) % 60) / 60;
        return <path key={i} d={`M ${-6 + i * 20} ${-246 - ph * 90} q 14 -18 0 -36 q -14 -18 0 -36`} stroke="#FFF" strokeWidth={7} fill="none" opacity={0.36 * (1 - ph)} strokeLinecap="round" />;
      })}
    </g>
  </g>
);

export const QRStand: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -150 0 L -120 -400 L 120 -400 L 150 0 Z" fill="#E8E2D2" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-95} y={-360} width={190} height={190} fill="#fff" />
    {Array.from({ length: 121 }).map((_, i) => {
      const r = Math.floor(i / 11);
      const c = i % 11;
      const corner = (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
      return corner || rnd(21, i) > 0.5 ? <rect key={i} x={-88 + c * 16} y={-353 + r * 16} width={16} height={16} fill="#16121E" /> : null;
    })}
    <text y={-98} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={56} fill="#3A2A5A">UPI</text>
  </g>
);

/** The cardboard that goes over the QR: a hand-lettered sign. */
export const CashSign: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-210} y={-130} width={420} height={260} fill="#C9A06A" stroke={INK} strokeWidth={7} />
    <path d="M -210 -130 L -170 -100 M 210 130 L 170 104" stroke="#9E7A4A" strokeWidth={5} />
    <text y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={88} fill="#2A1A12">കാശ്</text>
    <text y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#A02A1E">മാത്രം!</text>
  </g>
);

// ---------------------------------------------------------------- schematic ground
export const SchBg: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs>
      <pattern id={`${id}g`} width={54} height={54} patternUnits="userSpaceOnUse">
        <path d="M 54 0 L 0 0 0 54" fill="none" stroke={SCH.grid} strokeWidth={1.5} />
      </pattern>
    </defs>
    <rect x={-100} y={-100} width={1280} height={2120} fill={SCH.ground} />
    <rect x={-100} y={-100} width={1280} height={2120} fill={`url(#${id}g)`} />
  </g>
);

/** Payments as a field of dots; the block at the bottom left is Kerala. `out` 0..1 blacks that block out and drops it. */
export const DotField: React.FC<{ t: number; out?: number }> = ({ t, out = 0 }) => {
  const cols = 15;
  const rows = 18;
  return (
    <g>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const ker = c >= 1 && c <= 3 && r >= 12 && r <= 16;
        const on = Math.sin(t / 3 + rnd(7, i) * 40) > 0.1;
        const x = 120 + c * 60;
        const y = 620 + r * 58;
        if (ker) {
          const fall = out * out * (300 + rnd(9, i) * 700);
          return <circle key={i} cx={x} cy={y + fall} r={15} fill={out > 0.05 ? '#4A4458' : '#FF8A3D'} opacity={1 - out * 0.8} />;
        }
        return <circle key={i} cx={x} cy={y} r={on ? 13 : 9} fill={on ? '#F6EFE3' : SCH.dim} opacity={on ? 0.9 : 0.42} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- the road
/** The long road, dusk, x from -300 to 3400: low shops, palms, poles. Road starts at y 1420. */
export const RoadSet: React.FC<{ t: number; id: string; mode?: string }> = ({ t, id, mode = 'dusk' }) => (
  <g>
    <Sky id={`rd${id}`} mode={mode} y0={-100} y1={1400} />
    <Glow x={1300} y={1160} r={760} kind="warm" o={0.45} />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = -260 + i * 430;
      const h = 330 + rnd(31, i) * 200;
      return (
        <g key={i}>
          <rect x={x} y={1350 - h} width={380} height={h} fill={['#4A3A52', '#54405A', '#42344C'][i % 3]} stroke={INK} strokeWidth={5} />
          <rect x={x - 10} y={1350 - h - 16} width={400} height={20} fill="#2C2236" />
          {[0, 1, 2].map((k) => <rect key={k} x={x + 40 + k * 110} y={1350 - h + 50} width={76} height={92} fill={rnd(33, i * 3 + k) > 0.35 ? '#FFC867' : '#2C2438'} stroke={INK} strokeWidth={4} />)}
          <rect x={x + 30} y={1210} width={320} height={140} fill="#2C2236" stroke={INK} strokeWidth={4} />
          <rect x={x + 44} y={1226} width={292} height={124} fill="#FFB45E" opacity={0.42} />
        </g>
      );
    })}
    {[-120, 860, 1760, 2800].map((x, i) => <Palm key={i} x={x} y={1370} s={1.2} t={t + i * 30} dark />)}
    <rect x={-400} y={1350} width={4200} height={80} fill="#5C5262" />
    <rect x={-400} y={1420} width={4200} height={800} fill="#2B2733" />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-300 + i * 280} y={1640} width={150} height={14} rx={4} fill="#EDE6D6" opacity={0.5} />)}
  </g>
);

export const AtmKiosk: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={6} rx={260} ry={20} fill="#000" opacity={0.3} />
    <rect x={-210} y={-520} width={420} height={520} fill="#2F4A6E" stroke={INK} strokeWidth={7} />
    <rect x={-170} y={-400} width={340} height={400} fill="#BFE4F4" opacity={0.85} stroke={INK} strokeWidth={6} />
    <rect x={-210} y={-520} width={420} height={106} fill="#E4544A" stroke={INK} strokeWidth={7} />
    <text y={-436} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={84} fill="#fff">ATM</text>
    <rect x={-60} y={-320} width={120} height={320} fill="#3A4256" stroke={INK} strokeWidth={5} />
    <rect x={-40} y={-296} width={80} height={60} fill="#7EE0A6" />
    <Glow x={0} y={-230} r={320} kind="cool" o={0.5} />
  </g>
);

/** The junction's signboard. */
export const JunctionBoard: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-12} y={-420} width={24} height={420} fill="#40384C" stroke={INK} strokeWidth={5} />
    <rect x={-250} y={-500} width={500} height={150} rx={8} fill="#2E7E5A" stroke="#F6EFE3" strokeWidth={8} />
    <text y={-400} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3">ജംഗ്ഷൻ</text>
  </g>
);

// ---------------------------------------------------------------- day 2
/** A dead phone on a table under a cobweb. */
export const Cobweb: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 0.8 }) => (
  <g stroke="#E8EEF4" strokeWidth={3} fill="none" opacity={o}>
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 7) * (Math.PI / 2);
      return <path key={i} d={`M ${x} ${y} L ${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`} />;
    })}
    {[0.3, 0.52, 0.74, 0.96].map((k, j) => {
      const pts = Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 7) * (Math.PI / 2);
        return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k];
      });
      return <path key={j} d={pts.map((p, i) => (i ? `Q ${(p[0] + pts[i - 1][0]) / 2 - 7} ${(p[1] + pts[i - 1][1]) / 2 - 7} ${p[0]} ${p[1]}` : `M ${p[0]} ${p[1]}`)).join(' ')} />;
    })}
  </g>
);
export const Spider: React.FC<{ x: number; y: number; top: number; s?: number }> = ({ x, y, top, s = 1 }) => (
  <g>
    <path d={`M ${x} ${top} L ${x} ${y}`} stroke="#E8EEF4" strokeWidth={2.5} />
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((d) => [0, 1, 2].map((i) => <path key={`${d}${i}`} d={`M 0 ${6 + i * 6} q ${d * 26} ${-14 + i * 8} ${d * 40} ${12 + i * 12}`} stroke="#120E22" strokeWidth={5} fill="none" />))}
      <circle r={22} cy={10} fill="#120E22" />
      <circle cx={-8} cy={6} r={4} fill="#fff" /><circle cx={8} cy={6} r={4} fill="#fff" />
    </g>
  </g>
);

/** Printed Good Morning card: a rose, a sunrise, the works. */
export const RoseCard: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <linearGradient id="rosebg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF7FA8" /><stop offset="0.6" stopColor="#FFC15E" /><stop offset="1" stopColor="#FFE9A8" /></linearGradient>
    </defs>
    <rect x={-300} y={-400} width={600} height={800} rx={14} fill="url(#rosebg)" stroke="#fff" strokeWidth={14} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <path key={i} d={`M 0 40 L ${Math.cos(a) * 400} ${40 + Math.sin(a) * 400}`} stroke="#fff" strokeWidth={10} opacity={0.2} />;
    })}
    <path d="M 0 90 Q 18 200 -10 330" stroke="#2E7E4A" strokeWidth={14} fill="none" />
    <path d="M 2 220 q 80 -50 130 -6 q -70 40 -130 6 Z" fill="#3E9E5E" />
    <path d="M -2 262 q -80 -40 -124 8 q 72 32 124 -8 Z" fill="#3E9E5E" />
    {[[0, 0, 96, '#C8123E'], [-58, 28, 62, '#E0204E'], [58, 28, 62, '#E0204E'], [0, 54, 60, '#D4184A'], [0, -6, 56, '#F03A6A'], [10, 6, 32, '#A00E30']].map((c, i) => (
      <circle key={i} cx={c[0] as number} cy={(c[1] as number) + 30} r={c[2] as number} fill={c[3] as string} />
    ))}
    <path d="M -24 18 q 30 -30 56 4 q -8 30 -36 26" stroke="#7A0A26" strokeWidth={6} fill="none" />
    <text y={-250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#fff" stroke="#B0185E" strokeWidth={14} paintOrder="stroke">GOOD</text>
    <text y={-150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#fff" stroke="#B0185E" strokeWidth={14} paintOrder="stroke">MORNING</text>
    <text y={368} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#8A1A4A">ശുഭദിനം</text>
  </g>
);

/** A bicycle in profile with a stack of cards on the carrier. */
export const Cycle: React.FC<{ x: number; y: number; s?: number; t?: number; stack?: boolean }> = ({ x, y, s = 1, t = 0, stack = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={220} ry={14} fill="#000" opacity={0.3} />
    {[-140, 140].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-84} r={84} fill="none" stroke="#16121E" strokeWidth={13} />
        {[0, 1, 2, 3].map((i) => {
          const a = t / 3 + (i * Math.PI) / 4;
          return <line key={i} x1={wx - Math.cos(a) * 78} y1={-84 - Math.sin(a) * 78} x2={wx + Math.cos(a) * 78} y2={-84 + Math.sin(a) * 78} stroke="#7A7486" strokeWidth={3} />;
        })}
      </g>
    ))}
    <path d="M -140 -84 L -20 -84 L 104 -210 L -66 -210 Z M -66 -210 L -20 -84 M 104 -210 L 140 -84 M 104 -210 L 90 -270 L 138 -280" stroke="#2E5E4A" strokeWidth={13} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M -100 -232 L -30 -232" stroke="#16121E" strokeWidth={18} strokeLinecap="round" />
    {stack ? (
      <g>
        <rect x={-200} y={-188} width={120} height={14} fill="#4A3A52" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={-196 + (i % 2) * 5} y={-204 - i * 14} width={108} height={14} fill={i % 2 ? '#FF9FBF' : '#FFC15E'} stroke="#B0185E" strokeWidth={2} />)}
      </g>
    ) : null}
  </g>
);

/** Compound wall and a gate (the near layer of the house shots). */
export const Gate: React.FC<{ x: number; y: number; open?: number }> = ({ x, y, open = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-1200} y={-150} width={1040} height={150} fill="#7A6A66" stroke={INK} strokeWidth={6} />
    <rect x={160} y={-150} width={1200} height={150} fill="#7A6A66" stroke={INK} strokeWidth={6} />
    {[-160, 160].map((px) => <rect key={px} x={px - 34} y={-220} width={68} height={220} fill="#8E7E7A" stroke={INK} strokeWidth={6} />)}
    <g transform={`scale(${1 - open * 0.7} 1) translate(-126 0)`}>
      <rect x={0} y={-170} width={252} height={170} fill="none" stroke="#2E2A3A" strokeWidth={10} />
      {[1, 2, 3, 4, 5].map((i) => <line key={i} x1={i * 42} x2={i * 42} y1={-170} y2={0} stroke="#2E2A3A" strokeWidth={8} />)}
    </g>
  </g>
);

// ---------------------------------------------------------------- day 3
export const Pocket: React.FC<{ t: number; buzz: number }> = ({ t, buzz }) => {
  const jx = Math.sin(t * 4.6) * 8 * buzz;
  return (
    <g>
      <rect x={-100} y={-100} width={1280} height={2120} fill="#2E3C5A" />
      {Array.from({ length: 70 }).map((_, i) => <line key={i} x1={-100} x2={1180} y1={i * 30 - 80} y2={i * 30 - 60} stroke="#263250" strokeWidth={5} />)}
      <g transform={`translate(${jx} 0)`}>
        <path d="M 110 640 Q 520 860 960 620 L 1020 1560 Q 560 1680 170 1560 Z" fill="#354666" stroke="#E0A63E" strokeWidth={7} strokeDasharray="26 16" />
        <path d="M 110 640 Q 520 860 960 620" fill="none" stroke="#1E2840" strokeWidth={16} />
        <rect x={420} y={760} width={250} height={520} rx={40} fill="#2A3656" opacity={0.0} />
      </g>
      {buzz > 0.02 ? [0, 1, 2].map((i) => (
        <g key={i} stroke="#FFE27A" strokeWidth={13} fill="none" strokeLinecap="round" opacity={buzz * (0.9 - i * 0.22)}>
          <path d={`M ${180 - i * 56} ${880 + i * 10} q ${-46} 110 0 220`} />
          <path d={`M ${900 + i * 56} ${880 + i * 10} q 46 110 0 220`} />
        </g>
      )) : null}
    </g>
  );
};

// ---------------------------------------------------------------- day 4
export const BusShelter: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={8} rx={560} ry={24} fill="#000" opacity={0.3} />
    <rect x={-470} y={-560} width={940} height={520} fill="#4A3F52" stroke={INK} strokeWidth={6} />
    <rect x={-420} y={-500} width={380} height={240} fill="#D9B45A" opacity={0.6} stroke={INK} strokeWidth={5} />
    <text x={-230} y={-360} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#3A2412">സിനിമ</text>
    <rect x={20} y={-500} width={400} height={240} fill="#7E9C8C" opacity={0.55} stroke={INK} strokeWidth={5} />
    <text x={220} y={-360} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#14281E">ട്യൂഷൻ</text>
    {[-470, 470].map((px) => <rect key={px} x={px - 22} y={-620} width={44} height={620} fill="#6E5F76" stroke={INK} strokeWidth={6} />)}
    <path d="M -560 -600 L 560 -600 L 520 -680 L -520 -680 Z" fill="#7A2E1E" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <text y={-622} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#F6EFE3">ബസ് സ്റ്റോപ്പ്</text>
    <rect x={-400} y={-130} width={800} height={26} fill="#8A5E3E" stroke={INK} strokeWidth={5} />
    {[-340, 340].map((px) => <rect key={px} x={px - 11} y={-106} width={22} height={106} fill="#3A2C3E" />)}
    <Glow x={0} y={-500} r={420} kind="warm" o={0.45} />
  </g>
);

export const Bus: React.FC<{ x: number; y: number; s?: number; t?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, t = 0, dir = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
    <ellipse cx={0} cy={18} rx={580} ry={24} fill="#000" opacity={0.3} />
    <rect x={-540} y={-360} width={1080} height={320} rx={36} fill="#B22E2A" stroke={INK} strokeWidth={8} />
    <rect x={-540} y={-120} width={1080} height={60} fill="#F2E6C8" />
    <rect x={-540} y={-360} width={1080} height={40} rx={20} fill="#8A1E1E" />
    {Array.from({ length: 7 }).map((_, i) => (
      <g key={i}>
        <rect x={-500 + i * 130} y={-306} width={112} height={130} rx={10} fill="#E8D8A8" opacity={0.9} stroke={INK} strokeWidth={5} />
        <circle cx={-446 + i * 130} cy={-222} r={26} fill={['#B98562', '#C69A74', '#A9775A'][i % 3]} stroke={INK} strokeWidth={3} />
      </g>
    ))}
    <rect x={410} y={-306} width={110} height={130} rx={10} fill="#BFE4F4" stroke={INK} strokeWidth={5} />
    {[-340, 340].map((wx) => <g key={wx}>
      <circle cx={wx} cy={-30} r={62} fill="#1E1A26" stroke={INK} strokeWidth={6} />
      <circle cx={wx} cy={-30} r={26} fill="#8A8494" />
      <line x1={wx - 24 * Math.cos(t)} y1={-30 - 24 * Math.sin(t)} x2={wx + 24 * Math.cos(t)} y2={-30 + 24 * Math.sin(t)} stroke="#3A3446" strokeWidth={6} />
    </g>)}
  </g>
);

/** An old photo album, held open. */
export const Album: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-70} width={240} height={140} rx={6} fill="#7A2E2E" stroke={INK} strokeWidth={5} />
    <rect x={-110} y={-60} width={106} height={120} fill="#F2E8D4" /><rect x={4} y={-60} width={106} height={120} fill="#F2E8D4" />
    <rect x={-94} y={-46} width={74} height={52} fill="#8A7A6A" /><rect x={20} y={-46} width={74} height={52} fill="#6E7A8A" />
  </g>
);

// ---------------------------------------------------------------- day 5
export const Terrace: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Sky id={`tr${id}`} mode="dusk" y0={-200} y1={1400} />
    <Glow x={820} y={1050} r={560} kind="warm" o={0.65} />
    <circle cx={820} cy={1060} r={120} fill="#FFD27E" />
    {[-40, 240, 980].map((x, i) => <Palm key={i} x={x} y={1320} s={1.25 + i * 0.1} t={t + i * 40} dark />)}
    <rect x={-300} y={1270} width={1700} height={120} fill="#7A6A72" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-260 + i * 130} y={1294} width={60} height={70} rx={8} fill="#3A2C3E" />)}
    <rect x={-300} y={1390} width={1700} height={800} fill="#4A3F52" />
    {/* a washing line, because it's a terrace */}
    <path d="M -80 760 Q 540 860 1160 760" stroke="#1A1230" strokeWidth={4} fill="none" />
    {[[150, '#D9534F'], [320, '#F6EFE3'], [740, '#3E8C86']].map(([x, c], i) => (
      <rect key={i} x={x as number} y={808 + (i === 1 ? 14 : 0)} width={100} height={150} fill={c as string} stroke={INK} strokeWidth={4} transform={`rotate(${Math.sin(t / 18 + i) * 3} ${x} 808)`} />
    ))}
  </g>
);

export const Carrom: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={170} rx={230} ry={30} fill="#000" opacity={0.3} />
    <rect x={-20} y={30} width={40} height={140} fill="#3A2636" stroke={INK} strokeWidth={5} />
    <path d="M -270 0 L -180 -92 L 180 -92 L 270 0 Z" fill="#E8C98E" stroke="#5A2E1E" strokeWidth={15} strokeLinejoin="round" />
    <rect x={-274} y={0} width={548} height={26} fill="#5A2E1E" stroke={INK} strokeWidth={4} />
    <ellipse cx={0} cy={-46} rx={52} ry={18} fill="none" stroke="#7A3E2A" strokeWidth={4} />
    {[[-60, -56, '#16121E'], [10, -70, '#F6EFE3'], [52, -40, '#16121E'], [-16, -28, '#E4544A'], [100, -22, '#F6EFE3']].map(([cx, cy, c], i) => (
      <ellipse key={i} cx={cx as number} cy={cy as number} rx={15} ry={7} fill={c as string} stroke={INK} strokeWidth={2} />
    ))}
  </g>
);

// ---------------------------------------------------------------- day 6
/** The veranda at night: pillar, thinna, the lit door, the moon. Thinna top at y 1210. */
export const Veranda: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <rect x={-300} y={-200} width={1700} height={2300} fill="#2A2436" />
    <rect x={-300} y={1200} width={1700} height={900} fill="#1E1A28" />
    <rect x={600} y={400} width={320} height={800} fill="#FFC867" />
    <rect x={600} y={400} width={320} height={800} fill="none" stroke="#120E22" strokeWidth={10} />
    <Glow x={760} y={800} r={620} kind="warm" o={0.6} />
    <rect x={-120} y={460} width={340} height={300} fill="#141A38" stroke="#120E22" strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={-80 + i * 80} x2={-80 + i * 80} y1={460} y2={760} stroke="#3A2C2A" strokeWidth={6} />)}
    <circle cx={90} cy={560} r={46} fill="#F1EBD0" />
    <Glow x={90} y={560} r={220} kind="cool" o={0.4} />
    <rect x={-300} y={1210} width={1700} height={60} fill="#7A3B2E" stroke="#120E22" strokeWidth={6} />
    <rect x={-300} y={1270} width={1700} height={380} fill="#5A2C24" />
    <rect x={-300} y={1650} width={1700} height={500} fill="#141018" />
  </g>
);

/** A skyline for the Gulf night: glass towers, lit windows. */
export const Towers: React.FC<{ t: number; y?: number }> = ({ t, y = 1500 }) => (
  <g>
    {Array.from({ length: 12 }).map((_, i) => {
      const x = -140 + i * 120;
      const h = 620 + rnd(41, i) * 760;
      return (
        <g key={i}>
          <path d={`M ${x} ${y} L ${x} ${y - h} L ${x + 50} ${y - h - 50 - rnd(43, i) * 60} L ${x + 100} ${y - h} L ${x + 100} ${y} Z`} fill={i % 2 ? '#1A2148' : '#232C5A'} stroke="#0C1028" strokeWidth={4} />
          {Array.from({ length: 34 }).map((_, k) => {
            const on = rnd(47, i * 34 + k) > 0.58;
            return on ? <rect key={k} x={x + 12 + (k % 3) * 28} y={y - h + 26 + Math.floor(k / 3) * 54} width={16} height={26} fill="#FFD27E" opacity={0.75} /> : null;
          })}
        </g>
      );
    })}
  </g>
);

/** Calls from the Gulf across the sea, each stopping dead at a dark coast. p 0..1 how far they've come. */
export const CallArcs: React.FC<{ t: number; p: number }> = ({ t, p }) => (
  <g>
    {/* the sea between */}
    {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M -40 ${760 + i * 80} q 280 -30 560 0 t 620 0`} stroke="#1C3C5C" strokeWidth={3} fill="none" opacity={0.7} />)}
    {/* far shore: the Gulf, full of lit windows */}
    <path d="M -100 470 L 1180 470 L 1180 590 Q 800 700 420 650 Q 160 620 -100 690 Z" fill="#2B3C5A" stroke={SCH.dim} strokeWidth={3} />
    {Array.from({ length: 70 }).map((_, i) => {
      const on = Math.sin(t / 4 + rnd(61, i) * 30) > -0.3;
      return <circle key={i} cx={30 + rnd(63, i) * 1020} cy={575 + rnd(65, i) * 44} r={7} fill={on ? '#FFC867' : SCH.dim} />;
    })}
    {/* near shore: Kerala, a dark strip of coast */}
    <path d="M 700 1720 Q 720 1500 840 1300 Q 910 1200 1200 1160 L 1200 1760 Z" fill="#141018" stroke={SCH.dim} strokeWidth={3} />
    {Array.from({ length: 34 }).map((_, i) => {
      const k = (i % 17) / 17;
      const x0 = 60 + rnd(69, i) * 880;
      const x1 = 760 + k * 280;
      const y1 = 1660 - k * 460 + rnd(71, i) * 30;
      const ph = clamp(p * 1.4 - rnd(73, i) * 0.4);
      const n = 24;
      const pts = Array.from({ length: n + 1 }).map((_, j) => {
        const u = (j / n) * ph;
        const mx = (x0 + x1) / 2 - 80;
        const my = 900 + rnd(75, i) * 180;
        const x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * mx + u * u * x1;
        const y = (1 - u) * (1 - u) * 640 + 2 * (1 - u) * u * my + u * u * y1;
        return `${j ? 'L' : 'M'} ${x} ${y}`;
      }).join(' ');
      return <g key={i}><path d={pts} stroke="#FF8A3D" strokeWidth={3.5} fill="none" opacity={0.65} />{ph >= 0.99 ? <circle cx={x1} cy={y1} r={9} fill="#E4544A" /> : null}</g>;
    })}
  </g>
);

export { Fig };

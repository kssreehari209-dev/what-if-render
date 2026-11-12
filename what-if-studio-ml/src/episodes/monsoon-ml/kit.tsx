// monsoon-ml's own pieces: a Kerala that dries out. Land takes `dry` 0..1, so one outdoor set runs from green June to
// brown year three. The rest are the props the story needs. Pure functions of the shot clock.
import React from 'react';
import { Look, Pose, Glow, Sun, Haze, FONT, clamp, rnd, LEG_LEN } from '../../engine';
import { Fig, Palm, KHouse, Sky, Cloud } from '../fly-ml/kit';

const INK = '#1A1230';
export const feet = (y: number, s = 1) => y - LEG_LEN * s;

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mix = (a: string, b: string, k: number) => {
  const [x, y] = [hex(a), hex(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * clamp(k)).toString(16).padStart(2, '0')).join('')}`;
};

// ---------------------------------------------------------------- cast extras
const person = (skin: string, shade: string, shirt: string, shirtD: string, limb: string, hair: string): Look => ({
  skin, skinShade: shade, hand: skin, jacket: shirt, jacketShade: shirtD, accent: shirtD, limb, line: '#16121E', shoe: '#3A2A22', face: '#241C2E', hair,
});
export const DAD = person('#B98562', '#A06F50', '#6E86A8', '#566C8A', '#EFE8D8', '#1E1716');
export const GRAN = person('#C69A74', '#AC835F', '#EFE8D8', '#CFC6B2', '#EFE8D8', '#D8D4CC');
export const SHOPKEEPER = person('#A9775A', '#92644A', '#D9C27A', '#B8A25E', '#EFE8D8', '#6A6660');
export const FISHMAN = person('#A0704F', '#885C40', '#3E6E8C', '#2F566E', '#D8CDB4', '#1E1716');
export const TODDLER = person('#D0A67E', '#B68E68', '#E9A23B', '#C4851E', '#D0A67E', '#1E1716');

// ---------------------------------------------------------------- land and sky
const SKY3: Record<string, [string, string, string]> = {
  blaze: ['#2C6DB2', '#7FB6DE', '#FBE7B8'],
  haze: ['#6E5A52', '#B98A5E', '#F4C98C'],
  grey: ['#2A2A3A', '#4C4C5E', '#7E7A80'],
  morning: ['#3E78B8', '#9CC8E0', '#FFE3B0'],
  rainy: ['#1C2230', '#343E52', '#59657A'],
};
export const HSky: React.FC<{ id: string; mode: string; y1?: number }> = ({ id, mode, y1 = 860 }) => {
  const c = SKY3[mode];
  if (!c) return <Sky id={id} mode={mode} y1={y1} />;
  return (
    <g>
      <defs>
        <linearGradient id={`hs_${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={y1}>
          <stop offset="0" stopColor={c[0]} /><stop offset="0.6" stopColor={c[1]} /><stop offset="1" stopColor={c[2]} />
        </linearGradient>
      </defs>
      <rect x={-3000} y={-3000} width={8000} height={3000} fill={c[0]} />
      <rect x={-3000} y={0} width={8000} height={y1} fill={`url(#hs_${id})`} />
      <rect x={-3000} y={y1} width={8000} height={3000} fill={c[2]} />
    </g>
  );
};
const ridge = (y: number, seed: number, amp: number) => {
  let d = `M -1600 ${y + 900}`;
  for (let i = 0; i <= 26; i++) d += ` L ${-1600 + i * 200} ${y - rnd(seed, i) * amp}`;
  return `${d} L 3600 ${y + 900} Z`;
};
/** Outdoors. `dry` 0 is green June, 1 is the brown of year three. Ground starts at y. */
export const Land: React.FC<{ t: number; id: string; mode?: string; dry?: number; y?: number; sun?: [number, number, number]; palms?: number[]; hills?: boolean }> = ({
  t, id, mode = 'blaze', dry = 0, y = 800, sun = [1520, 170, 95], palms = [], hills = true,
}) => {
  const g0 = mix('#4E8A3E', '#B08A56', dry);
  const g1 = mix('#2F6A32', '#8A6642', dry);
  return (
    <g>
      <HSky id={id} mode={mode} y1={y + 60} />
      {sun[2] ? <Sun x={sun[0]} y={sun[1]} r={sun[2]} t={t} /> : null}
      {sun[2] ? <Glow x={sun[0]} y={sun[1]} r={sun[2] * 6} kind="warm" o={0.5} /> : null}
      {hills ? <path d={ridge(y - 40, 21, 150)} fill={mix('#6E9A86', '#B69A7A', dry)} opacity={0.7} /> : null}
      {hills ? <path d={ridge(y, 9, 90)} fill={mix('#3F7A52', '#94704E', dry)} /> : null}
      <rect x={-3000} y={y} width={8000} height={3000} fill={g0} />
      {Array.from({ length: 34 }).map((_, i) => (
        <ellipse key={i} cx={-400 + rnd(5, i) * 2800} cy={y + 40 + rnd(6, i) * 330} rx={60 + rnd(7, i) * 120} ry={7 + rnd(8, i) * 10} fill={g1} opacity={0.5} />
      ))}
      {palms.map((x, i) => <Palm key={i} x={x} y={y + 10} s={1.05} t={t + i * 30} dark={dry > 0.55} />)}
      <Haze y={y - 170} h={230} o={0.22 + dry * 0.25} />
    </g>
  );
};
export const Cracks: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; c?: string; o?: number }> = ({ x, y, w, h, seed = 3, c = '#3E2A1E', o = 0.9 }) => (
  <g opacity={o} stroke={c} fill="none" strokeLinecap="round" strokeLinejoin="round">
    {Array.from({ length: 13 }).map((_, i) => {
      const px = x + rnd(seed, i) * w;
      const py = y + rnd(seed + 1, i) * h;
      const a = rnd(seed + 2, i) * 6.28;
      const l = 70 + rnd(seed + 3, i) * 150;
      const mx = px + Math.cos(a) * l * 0.5 + 20;
      const my = py + Math.sin(a) * l * 0.2 - 8;
      const ex = px + Math.cos(a) * l;
      const ey = py + Math.sin(a) * l * 0.34;
      return <path key={i} d={`M ${px} ${py} L ${mx} ${my} L ${ex} ${ey} M ${mx} ${my} L ${mx + 30} ${my + 26}`} strokeWidth={4 + rnd(seed + 4, i) * 5} />;
    })}
  </g>
);
export const Bank: React.FC<{ y: number; c?: string; hi?: string }> = ({ y, c = '#7A5A3E', hi = '#9E7A52' }) => (
  <g>
    <rect x={-3000} y={y} width={8000} height={3000} fill={c} />
    <rect x={-3000} y={y} width={8000} height={14} fill={hi} />
  </g>
);

// ---------------------------------------------------------------- people's things
export const Kudam: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string }> = ({ x, y, s = 1, rot = 0, c = '#D9A23E' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -30 -92 Q -24 -70 -44 -58 Q -78 -36 -78 -2 Q -78 42 0 44 Q 78 42 78 -2 Q 78 -36 44 -58 Q 24 -70 30 -92 Z" fill={c} stroke={INK} strokeWidth={5} />
    <ellipse cx={0} cy={-92} rx={40} ry={11} fill="#8A5E1E" stroke={INK} strokeWidth={5} />
    <path d="M 34 -30 Q 60 -10 52 20" stroke="#FFE7A8" strokeWidth={9} strokeLinecap="round" fill="none" />
  </g>
);
export const Umbrella: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number; closed?: boolean }> = ({ x, y, s = 1, c = '#1E1E2C', rot = 0, closed }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -10 L 0 150 Q 0 176 -26 172" stroke="#E2C080" strokeWidth={7} fill="none" strokeLinecap="round" />
    {closed ? (
      <path d="M 0 -30 L 24 112 Q 0 124 -24 112 Z" fill={c} stroke={INK} strokeWidth={5} />
    ) : (
      <g>
        <path d="M -150 34 Q -130 -92 0 -96 Q 130 -92 150 34 Q 125 12 100 34 Q 75 12 50 34 Q 25 12 0 34 Q -25 12 -50 34 Q -75 12 -100 34 Q -125 12 -150 34 Z" fill={c} stroke={INK} strokeWidth={5} />
        <path d="M -50 34 Q -56 -50 0 -96 Q 56 -50 50 34" stroke={INK} strokeWidth={3} fill="none" opacity={0.6} />
        <path d="M -118 -8 Q -96 -68 -34 -84" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.3} strokeLinecap="round" />
      </g>
    )}
    <rect x={-3} y={closed ? -48 : -114} width={6} height={20} fill="#E2C080" />
  </g>
);
/** A pitch-dark-free steel water tanker, side on, facing right. Wheels on y. */
export const Tanker: React.FC<{ x: number; y: number; s?: number; t?: number; drip?: boolean }> = ({ x, y, s = 1, t = 0, drip = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={430} ry={22} fill="#000" opacity={0.3} />
    <rect x={-400} y={-120} width={650} height={40} fill="#2A2A36" stroke={INK} strokeWidth={5} />
    <rect x={-400} y={-300} width={590} height={190} rx={88} fill="#3C7FA8" stroke={INK} strokeWidth={6} />
    <rect x={-380} y={-286} width={540} height={36} rx={18} fill="#7FB9D6" opacity={0.7} />
    <rect x={-180} y={-328} width={110} height={30} rx={6} fill="#2F668A" stroke={INK} strokeWidth={5} />
    <text x={-105} y={-178} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={62} fill="#F6EFE3">കുടിവെള്ളം</text>
    <path d="M 205 -300 L 340 -300 Q 410 -290 420 -190 L 424 -80 L 205 -80 Z" fill="#D9A23E" stroke={INK} strokeWidth={6} />
    <path d="M 240 -272 L 330 -272 Q 372 -262 382 -196 L 240 -196 Z" fill="#BFE3F2" stroke={INK} strokeWidth={5} />
    {[-280, -130, 310].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-46} r={50} fill="#17141E" stroke={INK} strokeWidth={5} />
        <circle cx={wx} cy={-46} r={21} fill="#8A8A96" />
        <line x1={wx} y1={-46} x2={wx + Math.cos(t / 3) * 20} y2={-46 + Math.sin(t / 3) * 20} stroke="#2A2A36" strokeWidth={5} />
      </g>
    ))}
    <rect x={-418} y={-150} width={22} height={70} fill="#6A6A76" stroke={INK} strokeWidth={4} />
    {drip ? [0, 1, 2].map((i) => <circle key={i} cx={-408} cy={-74 + ((t * 5 + i * 26) % 74)} r={6} fill="#9CD4FF" />) : null}
  </g>
);
/** A real elephant, side on, facing left. Feet on y. `pot` hangs a kudam from the trunk. */
export const Tusker: React.FC<{ x: number; y: number; s?: number; t?: number; pot?: boolean; flip?: boolean; c?: string }> = ({ x, y, s = 1, t = 0, pot, flip, c = '#6E6878' }) => {
  const d = mix(c, '#000000', 0.2);
  const ear = Math.sin(t / 9) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={20} cy={6} rx={300} ry={20} fill="#000" opacity={0.3} />
      <rect x={150} y={-180} width={78} height={180} rx={24} fill={d} stroke={INK} strokeWidth={6} />
      <rect x={-100} y={-180} width={78} height={180} rx={24} fill={d} stroke={INK} strokeWidth={6} />
      <path d="M -170 -220 Q -180 -430 40 -440 Q 280 -440 290 -240 Q 296 -140 240 -130 L -120 -130 Q -170 -140 -170 -220 Z" fill={c} stroke={INK} strokeWidth={6} />
      <rect x={90} y={-170} width={78} height={170} rx={24} fill={c} stroke={INK} strokeWidth={6} />
      <rect x={-160} y={-170} width={78} height={170} rx={24} fill={c} stroke={INK} strokeWidth={6} />
      <path d="M -130 -360 Q -300 -420 -320 -290 Q -336 -230 -300 -170 Q -280 -60 -340 -30 Q -360 -20 -374 -40" fill="none" stroke={INK} strokeWidth={70} strokeLinecap="round" />
      <path d="M -130 -360 Q -300 -420 -320 -290 Q -336 -230 -300 -170 Q -280 -60 -340 -30 Q -360 -20 -374 -40" fill="none" stroke={c} strokeWidth={58} strokeLinecap="round" />
      <path d="M -210 -360 Q -130 -440 -100 -340 Q -80 -250 -180 -270" fill={c} stroke={INK} strokeWidth={6} />
      <path d={`M -120 -400 Q ${-10 + ear} -420 ${10 + ear} -320 Q ${6 + ear} -220 -70 -210 Q -130 -240 -120 -400 Z`} fill={d} stroke={INK} strokeWidth={6} />
      <circle cx={-218} cy={-352} r={11} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
      <circle cx={-222} cy={-351} r={5} fill={INK} />
      <path d="M -255 -255 Q -320 -240 -350 -280" stroke="#F4EDDC" strokeWidth={15} fill="none" strokeLinecap="round" />
      <path d="M 288 -270 Q 322 -210 306 -150" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
      {pot ? <Kudam x={-378} y={70} s={0.95} /> : null}
    </g>
  );
};
/** An old laterite well with a post and pulley. Rim top at y. */
export const Well: React.FC<{ x: number; y: number; s?: number; rope?: boolean }> = ({ x, y, s = 1, rope = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={132} rx={210} ry={26} fill="#000" opacity={0.3} />
    {[-170, 170].map((px) => <rect key={px} x={px - 11} y={-250} width={22} height={260} fill="#5A3E2C" stroke={INK} strokeWidth={5} />)}
    <rect x={-190} y={-262} width={380} height={22} fill="#6E4A32" stroke={INK} strokeWidth={5} />
    <circle cx={0} cy={-226} r={25} fill="#3A2C2A" stroke={INK} strokeWidth={5} />
    {rope ? <line x1={0} y1={-226} x2={0} y2={-30} stroke="#D8C08E" strokeWidth={5} /> : null}
    <path d="M -160 0 L -160 126 Q 0 170 160 126 L 160 0 Z" fill="#A2583E" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-150 + (i % 4) * 76 + (Math.floor(i / 4) % 2) * 20} y={14 + Math.floor(i / 4) * 40} width={56} height={26} fill="#8A4630" opacity={0.7} />)}
    <ellipse cx={0} cy={0} rx={160} ry={38} fill="#C87A58" stroke={INK} strokeWidth={6} />
    <ellipse cx={0} cy={0} rx={126} ry={26} fill="#120C14" />
  </g>
);
export const Fan: React.FC<{ x: number; y: number; s?: number; spin?: number }> = ({ x, y, s = 1, spin = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-7} y={-80} width={14} height={80} fill="#4A4658" />
    {[0, 1, 2].map((i) => {
      const a = (spin + i * 120) * (Math.PI / 180);
      return <ellipse key={i} cx={Math.cos(a) * 130} cy={Math.sin(a) * 18} rx={Math.abs(Math.cos(a)) * 118 + 12} ry={11} fill="#6E6A7E" stroke={INK} strokeWidth={4} />;
    })}
    <ellipse cx={0} cy={0} rx={36} ry={20} fill="#3E3A4E" stroke={INK} strokeWidth={4} />
  </g>
);
export const SteelPlate: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse rx={70} ry={70} fill="#C4CAD4" stroke={INK} strokeWidth={5} />
    <ellipse rx={50} ry={50} fill="#E2E6EC" />
  </g>
);
/** A roof tank, side on. Base on y. `lock` hangs a padlock on the lid. */
export const Tank: React.FC<{ x: number; y: number; s?: number; lock?: boolean }> = ({ x, y, s = 1, lock = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-96} y={-14} width={192} height={14} fill="#55505E" stroke={INK} strokeWidth={4} />
    <path d="M -82 -14 L -92 -176 Q -60 -206 0 -206 Q 60 -206 92 -176 L 82 -14 Z" fill="#26303E" stroke={INK} strokeWidth={5} />
    {[-130, -86, -42].map((yy) => <line key={yy} x1={-88} x2={88} y1={yy} y2={yy} stroke="#3C4A5C" strokeWidth={5} />)}
    <ellipse cx={0} cy={-207} rx={42} ry={12} fill="#3C4A5C" stroke={INK} strokeWidth={4} />
    {lock ? (
      <g transform="translate(0 -176)">
        <path d="M -17 -6 V -26 Q 0 -44 17 -26 V -6" stroke="#D0D4DC" strokeWidth={7} fill="none" />
        <rect x={-25} y={-8} width={50} height={40} rx={6} fill="#F1B93C" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={10} r={5} fill={INK} />
      </g>
    ) : null}
  </g>
);
export const Solar: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={0} y1={0} x2={0} y2={-70} stroke="#55505E" strokeWidth={10} />
    <path d="M -130 -60 L 110 -60 L 150 -150 L -90 -150 Z" fill="#1C3560" stroke="#C8D0DA" strokeWidth={5} />
    {[-1, 0, 1].map((k) => <line key={k} x1={k * 72 - 6} y1={-60} x2={k * 72 + 54} y2={-150} stroke="#6A8AB8" strokeWidth={3} />)}
    <line x1={-110} y1={-105} x2={130} y2={-105} stroke="#6A8AB8" strokeWidth={3} />
    <path d="M 40 -142 L 96 -142 L 66 -70 L 10 -70 Z" fill="#FFFFFF" opacity={0.12} />
  </g>
);
export const Fish: React.FC<{ x: number; y: number; s?: number; c?: string; flip?: boolean }> = ({ x, y, s = 1, c = '#B8C8D8', flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -60 0 Q -10 -30 44 0 Q -10 28 -60 0 Z" fill={c} stroke={INK} strokeWidth={4} />
    <path d="M 40 0 L 74 -22 L 66 0 L 74 22 Z" fill={c} stroke={INK} strokeWidth={4} />
    <circle cx={-38} cy={-4} r={5} fill={INK} />
  </g>
);
export const Basket: React.FC<{ x: number; y: number; s?: number; fish?: number }> = ({ x, y, s = 1, fish = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: fish }).map((_, i) => <Fish key={i} x={-74 + i * 56} y={-52 - (i % 2) * 14} s={0.8} flip={i % 2 === 0} />)}
    <path d="M -160 -40 L -120 60 Q 0 84 120 60 L 160 -40 Z" fill="#B8894E" stroke={INK} strokeWidth={6} />
    {[-14, 14, 42].map((yy) => <path key={yy} d={`M -148 ${yy} Q 0 ${yy + 22} 148 ${yy}`} stroke="#8A6236" strokeWidth={5} fill="none" />)}
    <ellipse cx={0} cy={-40} rx={160} ry={24} fill="#3A2820" stroke={INK} strokeWidth={6} opacity={0.75} />
  </g>
);
/** The offer: a slip of paper with a sum on it. */
export const Offer: React.FC<{ x: number; y: number; s?: number; rot?: number; text?: string }> = ({ x, y, s = 1, rot = 0, text = '₹ 5,00,00,000' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-210} y={-120} width={420} height={240} rx={6} fill="#F4EDDC" stroke={INK} strokeWidth={5} />
    <text textAnchor="middle" y={22} fontFamily={FONT.hand ?? FONT.ui} fontWeight={700} fontSize={52} fill="#1A2A5A">{text}</text>
    <line x1={-150} x2={150} y1={46} y2={46} stroke="#9A8E78" strokeWidth={3} />
    <path d="M 60 84 Q 90 60 110 86 Q 124 70 150 84" stroke="#1A2A5A" strokeWidth={4} fill="none" />
  </g>
);
export const ScreenPhone: React.FC<{ x: number; y: number; s?: number; rot?: number; id: string; bg?: string; children?: React.ReactNode }> = ({ x, y, s = 1, rot = 0, id, bg = '#F4F6FA', children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs><clipPath id={`sp_${id}`}><rect x={-175} y={-340} width={350} height={680} rx={14} /></clipPath></defs>
    <rect x={-190} y={-360} width={380} height={720} rx={42} fill="#14141C" stroke="#3A3A48" strokeWidth={5} />
    <rect x={-175} y={-340} width={350} height={680} rx={14} fill={bg} />
    <g clipPath={`url(#sp_${id})`}>{children}</g>
  </g>
);
/** A big dark arm coming in from a frame edge: sleeve and mitten, for inserts. */
export const Arm: React.FC<{ from: [number, number]; to: [number, number]; c?: string; skin?: string; w?: number }> = ({ from, to, c = '#2E2A3E', skin = '#E8C4A0', w = 110 }) => (
  <g>
    <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={INK} strokeWidth={w + 10} strokeLinecap="round" />
    <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={c} strokeWidth={w} strokeLinecap="round" />
    <circle cx={to[0]} cy={to[1]} r={w * 0.62} fill={skin} stroke={INK} strokeWidth={5} />
  </g>
);
/** Drawn figures in a line, front to back, each carrying a kudam. */
export const Queue: React.FC<{ x: number; y: number; n: number; gap?: number; s?: number; looks: Look[]; dir?: 1 | -1; t?: number }> = ({ x, y, n, gap = 130, s = 0.62, looks, dir = 1, t = 0 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const px = x + i * gap * -dir;
      const pose: Partial<Pose> = { x: px, y: feet(y, s), scale: s, yaw: 0.6 * dir, look: 0.4 * dir, armR: { a: 20, b: -30 }, expr: i % 3 === 1 ? 'tired' : 'neutral', tilt: Math.sin(t / 30 + i) * 1.5 };
      return (
        <g key={i}>
          <Fig look={looks[i % looks.length]} pose={pose} rimId="rimR" shadow={0.4} />
          <Kudam x={px + 42 * dir} y={y - 42 * s} s={0.55 * s + 0.2} />
        </g>
      );
    })}
  </g>
);
export const CloudPuff: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 0.8, c = '#D8B890' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {[[-70, 0, 46], [-20, -28, 60], [46, -14, 52], [90, 10, 34], [-110, 16, 26]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={c} />)}
  </g>
);

export { Cloud, KHouse };

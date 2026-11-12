// nosleep-ml's own pieces: the kavala at night (chaya kada, streetlight, bus shelter, three roads), inside the tea
// shop, the thattukada, the hall (tube light, TV, fridge, switchboard), the veranda with mats, the Dubai site, the
// schematics (life bar, brain, cells, rat cage, globe) and the moonlit sea floor with its jellyfish.
// Pure functions of the shot clock.
import React from 'react';
import { FONT, Glow, Dust, LightVeil, Stars, Moon, clamp, rnd, kf, Look, Pose, SCH, Schematic, DrawOn, SchLabel, LEG_LEN, WallClock } from '../../engine';
import { Fig, Palm, KHouse, Sky } from '../fly-ml/kit';
import { INK } from '../net-ml/kit';

export { INK };
export const feet = (g: number, s: number) => g - LEG_LEN * s;
export const fig = (look: Look, x: number, g: number, s: number, extra: Partial<Pose> = {}, rim = 'rimR', shadow = 0.5) => (
  <Fig look={look} pose={{ x, y: feet(g, s), scale: s, ...extra }} rimId={rim} shadow={shadow} />
);
export const push = (t: number, len: number, a: number, b: number) => kf(t, [[0, a], [len, b]]);

// ============================================================ small props
export const StreetLight: React.FC<{ x: number; y: number; s?: number; on?: number; t?: number }> = ({ x, y, s = 1, on = 1, t = 0 }) => (
  <g>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-10} y={-620} width={20} height={620} fill="#3A3446" stroke={INK} strokeWidth={4} />
      <path d="M 0 -610 Q 0 -660 120 -650" stroke="#3A3446" strokeWidth={14} fill="none" />
      <path d="M 90 -660 L 170 -660 L 160 -640 L 100 -640 Z" fill="#2A2436" stroke={INK} strokeWidth={4} />
      <rect x={104} y={-642} width={52} height={10} fill={on ? '#FFF0C8' : '#5A5462'} />
    </g>
    {on ? <g opacity={on * (0.95 + Math.sin(t / 3) * 0.03)}>
      <path d={`M ${x + 130 * s} ${y - 636 * s} L ${x - 260 * s} ${y + 40 * s} L ${x + 520 * s} ${y + 40 * s} Z`} fill="#FFE2A0" opacity={0.12} />
      <Glow x={x + 130 * s} y={y - 630 * s} r={260 * s} kind="warm" o={0.8} />
      <Glow x={x + 130 * s} y={y} r={420 * s} kind="warm" o={0.35} />
    </g> : null}
  </g>
);
export const Bag: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = '#2E3A2E', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={12} fill="#000" opacity={0.35} />
    <path d="M -64 0 Q -80 -70 -30 -100 L -14 -122 L 0 -108 L 14 -124 L 28 -100 Q 80 -70 64 0 Z" fill={c} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -40 -70 Q -20 -40 -34 -14" stroke="#FFFFFF" strokeWidth={6} opacity={0.18} fill="none" />
  </g>
);
export const Kettle: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={76} ry={12} fill="#000" opacity={0.3} />
    <path d="M -60 0 Q -70 -90 -40 -110 L 40 -110 Q 70 -90 60 0 Z" fill="#C8B98E" stroke={INK} strokeWidth={6} />
    <path d="M 56 -70 L 110 -110 L 118 -100 L 66 -50" fill="#C8B98E" stroke={INK} strokeWidth={5} />
    <rect x={-46} y={-126} width={92} height={18} rx={6} fill="#8E8056" stroke={INK} strokeWidth={5} />
    {[0, 1].map((i) => { const ph = ((t * 1.2 + i * 25) % 50) / 50; return <path key={i} d={`M ${110 + i * 10} ${-116 - ph * 70} q 12 -14 0 -28 q -12 -14 0 -28`} stroke="#FFF" strokeWidth={6} fill="none" opacity={0.35 * (1 - ph)} strokeLinecap="round" />; })}
  </g>
);
export const Ball: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => (
  <g><circle cx={x} cy={y} r={r} fill="#B8322A" stroke={INK} strokeWidth={4} /><path d={`M ${x - r * 0.7} ${y - r * 0.4} Q ${x} ${y + r * 0.2} ${x + r * 0.7} ${y - r * 0.4}`} stroke="#F6EFE3" strokeWidth={2} fill="none" /></g>
);
export const Bat: React.FC<{ x: number; y: number; rot: number; s?: number }> = ({ x, y, rot, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-6} y={-10} width={12} height={60} rx={4} fill="#3A2A22" stroke={INK} strokeWidth={3} />
    <rect x={-16} y={46} width={32} height={150} rx={8} fill="#E2C890" stroke={INK} strokeWidth={4} />
  </g>
);
export const Wickets: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={50} ry={8} fill="#000" opacity={0.3} />
    {[-28, 0, 28].map((dx) => <rect key={dx} x={dx - 5} y={-130} width={10} height={130} fill="#E8DCC0" stroke={INK} strokeWidth={3} />)}
    <rect x={-40} y={-140} width={80} height={10} rx={4} fill="#C9A24A" stroke={INK} strokeWidth={3} />
  </g>
);
/** Malayalam board, with an optional painted-over first line. */
export const Board: React.FC<{ x: number; y: number; w: number; h: number; lines: string[]; c?: string; ink?: string; size?: number; cross?: number; rot?: number }> = ({ x, y, w, h, lines, c = '#F2C53D', ink = '#8A2A1E', size = 48, cross = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={c} stroke={INK} strokeWidth={6} />
    {lines.map((l, i) => <text key={i} x={0} y={-h / 2 + (i + 1) * (h / (lines.length + 0.4))} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={ink}>{l}</text>)}
    {cross > 0 ? <rect x={-w / 2 + 16} y={-h / 2 + h / (lines.length + 0.4) - size * 0.85} width={(w - 32) * cross} height={size * 1.05} fill="#F6EFE3" opacity={0.95} /> : null}
  </g>
);
/** A woven paaya: unrolled 0..1 from the left end at (x, y), length w, seen at a low angle (depth d). */
export const Paaya: React.FC<{ x: number; y: number; w?: number; d?: number; open?: number; c?: string }> = ({ x, y, w = 520, d = 120, open = 1, c = '#C9A86A' }) => {
  const L = w * clamp(open);
  const rr = 26 + (1 - open) * 30;
  return (
    <g>
      <path d={`M ${x} ${y} L ${x + L} ${y} L ${x + L + 30} ${y + d} L ${x - 30} ${y + d} Z`} fill={c} stroke={INK} strokeWidth={4} />
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={x - 20} y1={y + (i + 1) * d / 7} x2={x + L + 20} y2={y + (i + 1) * d / 7} stroke="#9A7A44" strokeWidth={3} />)}
      <rect x={x - 30} y={y + d - 10} width={L + 60} height={10} fill="#7A3A2A" />
      {open < 1 ? <ellipse cx={x + L + 10} cy={y + d / 2} rx={rr} ry={d / 2 + 6} fill={c} stroke={INK} strokeWidth={4} /> : null}
    </g>
  );
};
export const Switchboard: React.FC<{ x: number; y: number; s?: number; off?: number }> = ({ x, y, s = 1, off = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-160} width={600} height={320} rx={16} fill="#EDE6D8" stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => {
      const o = clamp(off * 4 - i);
      return (
        <g key={i} transform={`translate(${-210 + i * 140} -20)`}>
          <rect x={-44} y={-70} width={88} height={140} rx={10} fill="#D8D0C0" stroke={INK} strokeWidth={5} />
          <rect x={-30} y={o > 0.5 ? 0 : -56} width={60} height={56} rx={8} fill="#F6F2EA" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={-100} r={10} fill={o > 0.5 ? '#5A2A2A' : '#FF5A3A'} />
        </g>
      );
    })}
    <rect x={-60} y={100} width={120} height={36} rx={6} fill="#D8D0C0" stroke={INK} strokeWidth={4} />
  </g>
);
export const Bharani: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -60 0 Q -80 -80 -50 -120 L 50 -120 Q 80 -80 60 0 Z" fill="#B8864E" stroke={INK} strokeWidth={6} />
    <rect x={-46} y={-150} width={92} height={32} rx={8} fill="#8A5E3E" stroke={INK} strokeWidth={5} />
    <rect x={-52} y={-150} width={104} height={14} fill="#E8DCC0" stroke={INK} strokeWidth={3} />
    <path d="M -40 -90 Q 0 -70 40 -90" stroke="#D8A86E" strokeWidth={6} fill="none" />
  </g>
);
export const MilkPacket: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 0 L -56 -110 Q 0 -126 56 -110 L 50 0 Q 0 10 -50 0 Z" fill="#E8F0F8" stroke={INK} strokeWidth={5} />
    <rect x={-40} y={-80} width={80} height={44} fill="#2F6E9C" />
    <text x={0} y={-50} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#F6EFE3">പാൽ</text>
  </g>
);
export const Pot: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string }> = ({ x, y, s = 1, t = 0, c = '#B8452E' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-80} rx={130} ry={34} fill="#3A2A22" stroke={INK} strokeWidth={6} />
    <ellipse cx={0} cy={-78} rx={112} ry={26} fill={c} />
    {[0, 1, 2].map((i) => <circle key={i} cx={-60 + i * 50} cy={-80 + Math.sin(t / 4 + i) * 3} r={8} fill="#E8A040" opacity={0.8} />)}
    <path d="M -130 -80 Q -140 0 -70 6 L 70 6 Q 140 0 130 -80" fill="#4A3A34" stroke={INK} strokeWidth={6} />
    {[0, 1].map((i) => { const ph = ((t + i * 30) % 60) / 60; return <path key={i} d={`M ${-30 + i * 60} ${-110 - ph * 120} q 16 -20 0 -40 q -16 -20 0 -40`} stroke="#FFF" strokeWidth={8} fill="none" opacity={0.3 * (1 - ph)} strokeLinecap="round" />; })}
  </g>
);
/** A fridge, door open (0..1) on the right, with what's inside. */
export const Fridge: React.FC<{ x: number; y: number; s?: number; open?: number; children?: React.ReactNode }> = ({ x, y, s = 1, open = 0, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={170} ry={18} fill="#000" opacity={0.35} />
    <rect x={-150} y={-620} width={300} height={620} rx={16} fill="#8A96A8" stroke={INK} strokeWidth={7} />
    {open > 0 ? <g>
      <rect x={-134} y={-604} width={268} height={588} fill="#DCEAF2" />
      <Glow x={0} y={-320} r={340} kind="cool" o={0.7} />
      {[-430, -260].map((sy) => <rect key={sy} x={-134} y={sy} width={268} height={8} fill="#9AB0C0" />)}
      {children}
      <path d={`M 150 -620 L ${150 + 230 * open} -650 L ${150 + 230 * open} 30 L 150 0 Z`} fill="#9AA6B8" stroke={INK} strokeWidth={6} />
    </g> : <g>
      <line x1={-150} y1={-440} x2={150} y2={-440} stroke={INK} strokeWidth={5} />
      <rect x={110} y={-400} width={14} height={140} rx={6} fill="#5A6272" />
      <rect x={-100} y={-560} width={90} height={60} fill="#F2C53D" stroke={INK} strokeWidth={3} transform="rotate(-6 -55 -530)" />
    </g>}
  </g>
);

// ============================================================ the kavala at night
/** The kavala: a row of shops with the chaya kada lit at x 520-1020, a streetlight at 1300, the bus shelter at
 * 1620, palms, the road (ground y 860). mode night (3 am) or dusk (day 7). bags: garbage piled at the corner. */
export const Street: React.FC<{ t: number; id: string; mode?: 'night' | 'dusk'; bags?: number; lit?: number; shelter?: boolean; roads?: boolean; children?: React.ReactNode; front?: React.ReactNode }> = ({
  t, id, mode = 'night', bags = 0, lit = 1, shelter = true, roads = false, children, front,
}) => {
  const night = mode === 'night';
  return (
    <g>
      <Sky id={`st${id}`} mode={night ? 'night' : 'dusk'} y0={-600} y1={720} />
      {night ? <g><Stars seed={4} x0={-400} y0={-500} w={2700} h={700} t={t} n={50} /><Moon x={1640} y={150} r={46} /></g> : <Glow x={300} y={560} r={700} kind="warm" o={0.5} />}
      {[-200, 180, 2100].map((x, i) => <Palm key={i} x={x} y={640} s={0.9 + i * 0.05} t={t + i * 40} dark />)}
      {/* shops */}
      {[[-200, 300, '#6E5A62'], [130, 340, '#5E4E5A'], [1060, 300, '#6A5664'], [1400, 360, '#5A4A58'], [1780, 320, '#66525E']].map(([x, h, c], i) => (
        <g key={i}>
          <rect x={x as number} y={720 - (h as number)} width={320} height={h as number} fill={c as string} stroke={INK} strokeWidth={5} />
          <path d={`M ${(x as number) - 20} ${720 - (h as number)} L ${(x as number) + 160} ${720 - (h as number) - 70} L ${(x as number) + 340} ${720 - (h as number)} Z`} fill="#6A2A22" stroke={INK} strokeWidth={5} />
          <rect x={(x as number) + 30} y={720 - (h as number) + 30} width={260} height={44} fill={['#2E7E5A', '#B8452E', '#2F6E9C', '#C9842E', '#7A4A8A'][i]} stroke={INK} strokeWidth={4} />
          <rect x={(x as number) + 40} y={560} width={240} height={160} fill={rnd(7, i) * lit > 0.3 ? '#FFC867' : '#2C2432'} opacity={0.85} stroke={INK} strokeWidth={4} />
        </g>
      ))}
      {/* the chaya kada */}
      <g>
        <rect x={500} y={360} width={540} height={360} fill="#D8C49A" stroke={INK} strokeWidth={6} />
        <path d="M 460 372 L 770 230 L 1080 372 Z" fill="#A2432C" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 4 }).map((_, i) => <line key={i} x1={500 + i * 20} y1={355 - i * 30} x2={1040 - i * 20} y2={355 - i * 30} stroke="#7A2E1E" strokeWidth={5} />)}
        <rect x={540} y={390} width={460} height={60} rx={6} fill="#F2C53D" stroke={INK} strokeWidth={5} />
        <text x={770} y={436} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={42} fill="#8A2A1E">ബാബുവിന്റെ ചായക്കട</text>
        <rect x={530} y={470} width={480} height={250} fill="#FFC867" stroke={INK} strokeWidth={6} />
        <rect x={560} y={520} width={420} height={14} fill="#7A4A2E" />
        {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={572 + i * 58} y={486} width={40} height={34} rx={6} fill={['#C9842E', '#D9B45A', '#B4552E'][i % 3]} stroke={INK} strokeWidth={2} />)}
        <Glow x={770} y={600} r={460} kind="warm" o={0.8 * lit} />
      </g>
      {shelter ? <g transform="translate(1620 720)">
        <rect x={-250} y={-300} width={500} height={300} fill="#4A3F52" stroke={INK} strokeWidth={5} />
        <path d="M -300 -290 L 300 -290 L 270 -340 L -270 -340 Z" fill="#7A2E1E" stroke={INK} strokeWidth={6} />
        <text y={-306} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#F6EFE3">ബസ് സ്റ്റോപ്പ്</text>
        <rect x={-210} y={-90} width={420} height={18} fill="#8A5E3E" stroke={INK} strokeWidth={4} />
        <rect x={-220} y={-260} width={200} height={130} fill="#D9B45A" opacity={0.6} />
        <rect x={20} y={-260} width={200} height={130} fill="#7E9C8C" opacity={0.55} />
      </g> : null}
      {/* pavement and road */}
      <rect x={-3000} y={720} width={8000} height={30} fill="#7A6E6E" stroke={INK} strokeWidth={4} />
      <rect x={-3000} y={750} width={8000} height={3000} fill={night ? '#2E2A36' : '#4E4652'} />
      {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-500 + i * 240} y={900} width={130} height={12} rx={4} fill="#EDE6D6" opacity={0.45} />)}
      {roads ? <g>
        <path d="M 300 2000 L 820 760 L 1100 760 L 1700 2000 Z" fill={night ? '#34303E' : '#56505C'} />
        <path d="M -400 1000 L 820 790 L 800 860 L -400 1300 Z" fill={night ? '#34303E' : '#56505C'} />
        <path d="M 2400 1000 L 1100 790 L 1120 860 L 2400 1300 Z" fill={night ? '#34303E' : '#56505C'} />
        <g transform="translate(400 760)">
          <rect x={-6} y={-200} width={12} height={200} fill="#3A3446" />
          {[['തൃശൂർ', -1, -180], ['ഗുരുവായൂർ', 1, -130], ['വീട്?', -1, -80]].map(([txt, dir, y]) => (
            <g key={txt as string} transform={`translate(${(dir as number) * 70} ${y as number})`}>
              <path d={`M ${-80 * (dir as number) - 0} -20 L ${70 * (dir as number)} -20 L ${100 * (dir as number)} 0 L ${70 * (dir as number)} 20 L ${-80 * (dir as number)} 20 Z`} fill={txt === 'വീട്?' ? '#5A5462' : '#2E6E4A'} stroke={INK} strokeWidth={3} />
              <text x={0} y={9} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={24} fill="#F6EFE3">{txt === 'വീട്?' ? '' : txt}</text>
            </g>
          ))}
        </g>
      </g> : null}
      {bags > 0 ? <g>
        {Array.from({ length: Math.round(bags) }).map((_, i) => (
          <Bag key={i} x={1330 + (i % 6) * 70 + (Math.floor(i / 6) % 2) * 35} y={760 - Math.floor(i / 6) * 60} s={0.9} c={['#2E3A2E', '#3A3446', '#4A3A2E', '#2A3646'][i % 4]} rot={rnd(9, i) * 20 - 10} />
        ))}
      </g> : null}
      <StreetLight x={1300} y={740} s={1} on={night ? 1 : 0.6} t={t} />
      {children}
      <LightVeil id={`sv${id}`} lights={[[770, 600, 520], [1430, 700, 460]]} o={night ? 0.4 : 0.22} />
      {front}
    </g>
  );
};

/** Inside the tea shop: back wall shelves, a clock, a calendar, the counter with the samovar (top y 760). */
export const ChayaIn: React.FC<{ t: number; id: string; clock?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ t, id, clock = 3, children, front }) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="#4A3436" />
    <rect x={-3000} y={180} width={8000} height={16} fill="#2A1E22" />
    {[300, 470].map((y) => <rect key={y} x={100} y={y} width={1000} height={16} fill="#2A1E22" />)}
    {Array.from({ length: 10 }).map((_, i) => <g key={i}>
      <rect x={120 + i * 96} y={220} width={70} height={80} rx={12} fill={['#C9842E', '#D9B45A', '#B4552E'][i % 3]} opacity={0.8} stroke={INK} strokeWidth={3} />
      <rect x={120 + i * 96} y={390} width={70} height={80} rx={12} fill={['#A9602E', '#C9A24A', '#8A5A3E'][(i + 1) % 3]} opacity={0.75} stroke={INK} strokeWidth={3} />
    </g>)}
    {/* the clock */}
    <g transform="translate(1380 330)">
      <circle r={110} fill="#E8E0CC" stroke={INK} strokeWidth={10} />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={84 * Math.sin(i * Math.PI / 6)} y1={-84 * Math.cos(i * Math.PI / 6)} x2={96 * Math.sin(i * Math.PI / 6)} y2={-96 * Math.cos(i * Math.PI / 6)} stroke={INK} strokeWidth={6} />)}
      <line x1={0} y1={0} x2={56 * Math.sin(clock * Math.PI / 6)} y2={-56 * Math.cos(clock * Math.PI / 6)} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={-86} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <line x1={0} y1={0} x2={80 * Math.sin(t / 5)} y2={-80 * Math.cos(t / 5)} stroke="#C8302A" strokeWidth={3} />
      <circle r={10} fill={INK} />
    </g>
    {/* a calendar from the shop */}
    <g transform="translate(1680 360)">
      <rect x={-110} y={-150} width={220} height={300} fill="#F2EADA" stroke={INK} strokeWidth={5} />
      <rect x={-110} y={-150} width={220} height={120} fill="#3E7A5A" />
      <circle cx={0} cy={-90} r={40} fill="#E9C46A" />
      <text x={0} y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#B8423A">വൃശ്ചികം</text>
      {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-90 + (i % 5) * 38} y={30 + Math.floor(i / 5) * 28} width={26} height={16} fill="#C8BCA8" />)}
    </g>
    <rect x={1150} y={140} width={30} height={60} fill="#3A3446" />
    <circle cx={1165} cy={210} r={22} fill="#FFF0C8" />
    <Glow x={1165} y={240} r={700} kind="warm" o={0.7} />
    {children}
    {/* counter */}
    <rect x={-3000} y={760} width={8000} height={400} fill="#5E3C2A" stroke={INK} strokeWidth={7} />
    <rect x={-3000} y={740} width={8000} height={30} fill="#8A5E3E" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-100 + i * 300} y={800} width={260} height={300} fill="none" stroke="#45291C" strokeWidth={6} />)}
    <LightVeil id={`ci${id}`} lights={[[1165, 300, 700]]} o={0.32} />
    {front}
  </g>
);

/** The thattukada at night: a cart with a tawa, string lights, a stool row. Tawa top at (900, 640). */
export const Thattu: React.FC<{ t: number; id: string; board?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ t, id, board = 0, children, front }) => (
  <g>
    <Sky id={`th${id}`} mode="night" y0={-600} y1={800} />
    <Stars seed={9} x0={-400} y0={-500} w={2700} h={800} t={t} n={40} />
    {[-100, 2000].map((x, i) => <Palm key={i} x={x} y={760} s={1.1} t={t + i * 30} dark />)}
    <rect x={-3000} y={760} width={8000} height={3000} fill="#2A2632" />
    {/* string lights */}
    <path d="M -200 200 Q 960 330 2120 200" stroke="#16121E" strokeWidth={3} fill="none" />
    {Array.from({ length: 22 }).map((_, i) => {
      const x = -150 + i * 100;
      const y = 200 + 130 * (1 - Math.pow((x - 960) / 1160, 2)) - 4;
      const on = 0.6 + 0.4 * Math.sin(t / 5 + i * 1.7);
      return <g key={i}><circle cx={x} cy={y + 14} r={10} fill={['#FFC867', '#FF8A5A', '#8AE0FF', '#F6EFE3'][i % 4]} opacity={on} /><Glow x={x} y={y + 14} r={60} kind="warm" o={0.4 * on} /></g>;
    })}
    {/* the cart */}
    <g>
      <rect x={560} y={500} width={760} height={30} fill="#5A2E1E" stroke={INK} strokeWidth={5} />
      <rect x={580} y={530} width={720} height={240} fill="#2E6E8A" stroke={INK} strokeWidth={6} />
      <rect x={600} y={560} width={680} height={60} fill="#F2C53D" stroke={INK} strokeWidth={4} />
      <text x={940} y={604} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#8A2A1E">ചേട്ടന്റെ തട്ടുകട</text>
      {[640, 1240].map((x) => <rect key={x} x={x - 8} y={240} width={16} height={270} fill="#3A3446" />)}
      <path d="M 560 250 L 1320 250 L 1280 200 L 600 200 Z" fill="#B8452E" stroke={INK} strokeWidth={5} />
      <ellipse cx={900} cy={498} rx={150} ry={22} fill="#1A1A22" stroke={INK} strokeWidth={4} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={830 + i * 60} cy={490} rx={34} ry={10} fill="#E8C47A" stroke="#A07A3A" strokeWidth={3} />)}
      <Glow x={900} y={460} r={260} kind="warm" o={0.6} />
      {[700, 1180].map((x) => <circle key={x} cx={x} cy={790} r={26} fill="#1E1A26" stroke={INK} strokeWidth={4} />)}
      <Board x={1110} y={380} w={300} h={120} lines={['രാത്രി 11 വരെ', '24 മണിക്കൂർ']} size={36} cross={board} c="#F6EFE3" />
    </g>
    {children}
    <LightVeil id={`tv${id}`} lights={[[900, 460, 520]]} o={0.4} />
    {front}
  </g>
);

// ============================================================ the hall
/** The hall at night, side-on: back wall y 120-800, floor below. Tube light at (960, 170), window with a grille
 * 1240-1600, TV on its stand at 380, a calendar, Achan's photo, the switchboard at (1780, 520), a dining table. */
export const Hall: React.FC<{ t: number; id: string; lights?: number; tv?: React.ReactNode; table?: boolean; children?: React.ReactNode; front?: React.ReactNode; wall?: boolean }> = ({
  t, id, lights = 1, tv, table = false, children, front, wall = true,
}) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={3800} fill="#6A5E72" />
    <rect x={-3000} y={640} width={8000} height={14} fill="#4A3E52" />
    <rect x={-3000} y={654} width={8000} height={146} fill="#5E4E64" />
    <rect x={-3000} y={800} width={8000} height={3000} fill="#7A3B2E" />
    <rect x={-3000} y={800} width={8000} height={10} fill="#4A2A22" />
    {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={-400 + i * 300} y1={810} x2={-800 + i * 380} y2={1300} stroke="#6A3328" strokeWidth={3} />)}
    {/* the window: night outside, grille */}
    <rect x={1240} y={260} width={360} height={300} fill={lights > 0.5 ? '#141A38' : '#0E1430'} stroke="#2A2230" strokeWidth={12} />
    <Stars seed={5} x0={1250} y0={270} w={340} h={280} t={t} n={12} />
    {[1300, 1360, 1420, 1480, 1540].map((x) => <line key={x} x1={x} y1={260} x2={x} y2={560} stroke="#2A2230" strokeWidth={6} />)}
    <line x1={1240} y1={410} x2={1600} y2={410} stroke="#2A2230" strokeWidth={6} />
    <path d="M 1220 250 L 1300 250 L 1290 580 L 1230 580 Z" fill="#B8423A" opacity={0.85} />
    {wall ? <g>
      {/* calendar and photo */}
      <g transform="translate(860 400)">
        <rect x={-90} y={-120} width={180} height={240} fill="#F2EADA" stroke={INK} strokeWidth={5} />
        <rect x={-90} y={-120} width={180} height={90} fill="#2F6E9C" />
        <text x={0} y={-60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#F6EFE3">വൃശ്ചികം</text>
        {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-76 + (i % 5) * 32} y={-10 + Math.floor(i / 5) * 28} width={22} height={16} fill="#C8BCA8" />)}
      </g>
      <g transform="translate(620 330)">
        <rect x={-80} y={-100} width={160} height={200} fill="#5A3A22" stroke={INK} strokeWidth={5} />
        <rect x={-64} y={-84} width={128} height={168} fill="#8A9AA8" />
        <circle cx={0} cy={-20} r={34} fill="#B98562" />
        <path d="M -20 0 Q 0 -6 20 0" stroke="#1E1716" strokeWidth={8} />
        <rect x={-50} y={20} width={100} height={64} fill="#6E86A8" />
      </g>
    </g> : null}
    {/* TV on its stand */}
    <g>
      <rect x={180} y={640} width={400} height={160} fill="#5A3A26" stroke={INK} strokeWidth={5} />
      <ellipse cx={380} cy={806} rx={220} ry={14} fill="#000" opacity={0.35} />
      <g transform="translate(220 400)">
        <rect x={-12} y={-12} width={344} height={214} rx={8} fill="#0C0C12" stroke="#2A2A36" strokeWidth={4} />
        <rect x={0} y={0} width={320} height={190} fill={tv ? '#101828' : '#1A1A22'} />
        {tv}
        <rect x={140} y={202} width={40} height={38} fill="#1A1A22" />
      </g>
    </g>
    {/* switchboard */}
    <g transform="translate(1780 520) scale(0.25)"><Switchboard x={0} y={0} off={1 - lights} /></g>
    {/* the tube light */}
    <rect x={820} y={150} width={280} height={22} rx={10} fill={lights > 0.5 ? '#F6FAFF' : '#5A5A66'} stroke={INK} strokeWidth={4} />
    {lights > 0.5 ? <g><Glow x={960} y={180} r={700} kind="cool" o={0.45} /><Glow x={960} y={500} r={900} kind="warm" o={0.25} /></g> : <Glow x={1420} y={410} r={420} kind="cool" o={0.4} />}
    {table ? <g>
      <ellipse cx={1100} cy={1020} rx={420} ry={24} fill="#000" opacity={0.35} />
      <rect x={760} y={800} width={680} height={36} fill="#7A4A2E" stroke={INK} strokeWidth={5} />
      {[790, 1400].map((x) => <rect key={x} x={x} y={836} width={22} height={190} fill="#5A3A26" stroke={INK} strokeWidth={4} />)}
    </g> : null}
    {children}
    <LightVeil id={`hv${id}`} lights={lights > 0.5 ? [[960, 420, 760]] : [[1420, 420, 380]]} o={lights > 0.5 ? 0.26 : 0.55} />
    {front}
  </g>
);

// ============================================================ the veranda
/** The sit-out at night, seen from the yard: red-oxide floor (top y 760), two pillars, a grille, the door glow,
 * the moon over the palms. dark: the house lights off. */
export const Veranda: React.FC<{ t: number; id: string; dark?: number; children?: React.ReactNode; front?: React.ReactNode; yard?: boolean }> = ({ t, id, dark = 1, children, front, yard = true }) => (
  <g>
    <Sky id={`vr${id}`} mode="night" y0={-700} y1={500} />
    <Stars seed={13} x0={-400} y0={-600} w={2700} h={800} t={t} n={60} />
    <Moon x={1600} y={60} r={56} />
    {[-160, 2100].map((x, i) => <Palm key={i} x={x} y={500} s={1} t={t + i * 50} dark />)}
    {/* the house wall */}
    <rect x={-400} y={120} width={2700} height={640} fill="#4A4058" stroke={INK} strokeWidth={6} />
    <path d="M -600 150 L 960 -160 L 2500 150 Z" fill="#3A1C1E" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={-500 + i * 60} y1={140 - i * 52} x2={2400 - i * 60} y2={140 - i * 52} stroke="#2A1416" strokeWidth={5} />)}
    {/* door */}
    <rect x={820} y={300} width={280} height={460} fill={dark ? '#1A1626' : '#FFC867'} stroke={INK} strokeWidth={8} />
    {!dark ? <Glow x={960} y={520} r={500} kind="warm" o={0.6} /> : null}
    {/* windows with grilles */}
    {[380, 1460].map((x) => <g key={x}>
      <rect x={x - 130} y={330} width={260} height={220} fill={dark ? '#141A30' : '#FFC867'} stroke={INK} strokeWidth={8} />
      {[0, 1, 2, 3].map((k) => <line key={k} x1={x - 78 + k * 52} y1={330} x2={x - 78 + k * 52} y2={550} stroke="#2A2230" strokeWidth={6} />)}
    </g>)}
    {/* pillars */}
    {[120, 1800].map((x) => <rect key={x} x={x - 40} y={150} width={80} height={610} fill="#D8CEC0" stroke={INK} strokeWidth={6} />)}
    {/* floor */}
    <rect x={-400} y={760} width={2700} height={140} fill="#8A2E22" stroke={INK} strokeWidth={6} />
    <rect x={-400} y={760} width={2700} height={14} fill="#A8463A" />
    <rect x={-400} y={900} width={2700} height={40} fill="#5A1E18" stroke={INK} strokeWidth={5} />
    {yard ? <rect x={-3000} y={940} width={8000} height={3000} fill="#2A2A2E" /> : null}
    {/* chappals at the step */}
    {[700, 780, 1180].map((x, i) => <ellipse key={x} cx={x} cy={922} rx={34} ry={10} fill={['#3E6E8C', '#B8423A', '#E9C46A'][i]} stroke={INK} strokeWidth={3} />)}
    <Glow x={1600} y={300} r={1200} kind="cool" o={0.35} />
    {children}
    <LightVeil id={`vv${id}`} lights={[[1200, 700, 760]]} o={0.42} />
    <Dust t={t} seed={2} x0={600} y0={300} w={900} h={500} n={14} o={0.25} />
    {front}
  </g>
);

/** A wide of the house and its neighbours at night, windows lit (lit 0..1, dark: our house goes dark). */
export const Village: React.FC<{ t: number; id: string; ours?: number; others?: number }> = ({ t, id, ours = 1, others = 1 }) => (
  <g>
    <Sky id={`vg${id}`} mode="night" y0={-600} y1={800} />
    <Stars seed={21} x0={-400} y0={-500} w={2700} h={900} t={t} n={70} />
    <Moon x={1500} y={170} r={52} />
    {[[-60, 700, 0.55], [1800, 690, 0.5], [420, 640, 0.35], [1400, 630, 0.32]].map(([x, y, s], i) => <KHouse key={i} x={x as number} y={y as number} s={s as number} night lit={others} />)}
    {[60, 300, 700, 1240, 1660, 1980].map((x, i) => <Palm key={i} x={x} y={760 + (i % 2) * 30} s={0.8 + (i % 3) * 0.1} t={t + i * 20} dark />)}
    <rect x={-3000} y={760} width={8000} height={3000} fill="#1E2422" />
    <KHouse x={960} y={860} s={0.8} night lit={ours} />
    {ours > 0.3 ? <Glow x={960} y={760} r={500} kind="warm" o={0.35 * ours} /> : null}
    <LightVeil id={`vgv${id}`} lights={[[960, 720, 600], [1500, 170, 300]]} o={0.3} />
  </g>
);

// ============================================================ Dubai
export const Dubai: React.FC<{ t: number; id: string; children?: React.ReactNode }> = ({ t, id, children }) => (
  <g>
    <Sky id={`db${id}`} mode="night" y0={-600} y1={900} />
    {Array.from({ length: 12 }).map((_, i) => {
      const x = -300 + i * 220;
      const h = 380 + rnd(41, i) * 420 + (i === 6 ? 300 : 0);
      return (
        <g key={i}>
          <path d={`M ${x} 800 L ${x} ${800 - h} L ${x + 60} ${800 - h - (i === 6 ? 160 : 20)} L ${x + 160} ${800 - h} L ${x + 160} 800 Z`} fill={['#232A44', '#2A3050', '#1E2440'][i % 3]} stroke={INK} strokeWidth={4} />
          {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={x + 20 + (k % 3) * 44} y={800 - h + 40 + Math.floor(k / 3) * 70} width={26} height={30} fill={rnd(43, i * 10 + k) > 0.3 ? '#FFD88A' : '#2C3050'} />)}
        </g>
      );
    })}
    {/* crane and the site */}
    <g>
      <rect x={1460} y={120} width={30} height={700} fill="#E9A23B" stroke={INK} strokeWidth={4} />
      <rect x={1100} y={120} width={700} height={26} fill="#E9A23B" stroke={INK} strokeWidth={4} />
      <line x1={1200} y1={146} x2={1200} y2={420 + Math.sin(t / 20) * 20} stroke={INK} strokeWidth={4} />
      <rect x={1160} y={420 + Math.sin(t / 20) * 20} width={80} height={40} fill="#8A8494" stroke={INK} strokeWidth={3} />
      {[300, 1700].map((x) => <g key={x}><rect x={x - 6} y={400} width={12} height={460} fill="#5A5462" /><rect x={x - 50} y={380} width={100} height={40} fill="#F6FAFF" /><Glow x={x} y={420} r={420} kind="cool" o={0.65} /></g>)}
    </g>
    <rect x={-3000} y={860} width={8000} height={3000} fill="#5A4E46" />
    {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-200 + i * 260} y={800} width={180} height={60} fill="#7A6A5A" stroke={INK} strokeWidth={3} />)}
    {children}
    <LightVeil id={`dbv${id}`} lights={[[300, 600, 460], [1700, 600, 460]]} o={0.38} />
  </g>
);

/** A hard hat on whoever's head point (x, y), scale s. */
export const HardHat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y - 46 * s}) scale(${s})`}>
    <path d="M -66 0 Q -64 -60 0 -64 Q 64 -60 66 0 Z" fill="#F2C53D" stroke={INK} strokeWidth={5} />
    <rect x={-80} y={-6} width={160} height={14} rx={6} fill="#E0B030" stroke={INK} strokeWidth={4} />
  </g>
);

// ============================================================ schematics
/** A life bar: 75 years in 25 boxes of 3, the nights (one in three) lighting up with p. */
export const LifeBar: React.FC<{ t: number; p: number }> = ({ t, p }) => (
  <g>
    {Array.from({ length: 75 }).map((_, i) => {
      const x = 260 + (i % 25) * 56;
      const y = 380 + Math.floor(i / 25) * 120;
      const night = i % 3 === 2;
      const on = clamp(t / 1.2 - i * 0.12);
      const lit = night ? clamp(p * 30 - i * 0.35) : 0;
      return (
        <g key={i} opacity={on}>
          <rect x={x} y={y} width={46} height={90} rx={6} fill={night ? (lit > 0.5 ? '#FFB15A' : '#2A3A5C') : '#3E6E8C'} stroke={SCH.line} strokeWidth={2} opacity={0.9} />
          {night ? <circle cx={x + 23} cy={y + 30} r={10} fill={lit > 0.5 ? '#FFF0C8' : '#C8D8F0'} opacity={0.8} /> : null}
        </g>
      );
    })}
    <SchLabel x={260} y={330} t={t - 10} text="0 വയസ്സ്" size={34} anchor="start" />
    <SchLabel x={1660} y={330} t={t - 10} text="75 വയസ്സ്" size={34} anchor="end" />
    <SchLabel x={960} y={800} t={t - 30} text="ഓരോ മൂന്നിലും ഒന്ന്: ഉറക്കം" size={40} />
  </g>
);
/** A brain in outline, centred at (x, y), radius r. */
export const BrainIcon: React.FC<{ x: number; y: number; r?: number; t: number; c?: string; fill?: string }> = ({ x, y, r = 260, t, c = SCH.line, fill = 'none' }) => {
  const d = `M ${x - r} ${y + r * 0.2} C ${x - r * 1.1} ${y - r * 0.6} ${x - r * 0.4} ${y - r} ${x} ${y - r * 0.8} C ${x + r * 0.5} ${y - r * 1.05} ${x + r * 1.15} ${y - r * 0.5} ${x + r} ${y + r * 0.15} C ${x + r * 1.05} ${y + r * 0.6} ${x + r * 0.5} ${y + r * 0.75} ${x + r * 0.2} ${y + r * 0.6} L ${x + r * 0.15} ${y + r * 0.95} L ${x - r * 0.05} ${y + r * 0.95} L ${x - r * 0.1} ${y + r * 0.62} C ${x - r * 0.6} ${y + r * 0.75} ${x - r * 0.95} ${y + r * 0.6} ${x - r} ${y + r * 0.2} Z`;
  return (
    <g>
      <path d={d} fill={fill} opacity={fill === 'none' ? 1 : 0.25} />
      <DrawOn d={d} t={t} dur={14} color={c} width={6} />
      <DrawOn d={`M ${x} ${y - r * 0.8} Q ${x - r * 0.1} ${y - r * 0.2} ${x + r * 0.05} ${y + r * 0.5}`} t={t - 8} dur={10} color={c} width={4} />
      <DrawOn d={`M ${x - r * 0.7} ${y - r * 0.2} Q ${x - r * 0.4} ${y - r * 0.4} ${x - r * 0.3} ${y} Q ${x - r * 0.5} ${y + r * 0.3} ${x - r * 0.75} ${y + r * 0.25}`} t={t - 10} dur={10} color={c} width={4} />
      <DrawOn d={`M ${x + r * 0.7} ${y - r * 0.3} Q ${x + r * 0.35} ${y - r * 0.45} ${x + r * 0.35} ${y - r * 0.05} Q ${x + r * 0.55} ${y + r * 0.3} ${x + r * 0.8} ${y + r * 0.2}`} t={t - 12} dur={10} color={c} width={4} />
    </g>
  );
};
/** Brain cells with the gaps between them (gap 0..1) and the waste specks (out 0..1 washed away, pile 0..1 stuck). */
export const Cells: React.FC<{ t: number; gap: number; out: number; pile: number }> = ({ t, gap, out, pile }) => (
  <g>
    {Array.from({ length: 24 }).map((_, i) => {
      const cx = 360 + (i % 6) * 240 + (Math.floor(i / 6) % 2) * 120;
      const cy = 260 + Math.floor(i / 6) * 170;
      const r = 92 - gap * 26;
      return <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.8} fill="#2A3A5C" stroke={SCH.line} strokeWidth={4} />;
    })}
    {Array.from({ length: 50 }).map((_, i) => {
      const x0 = 300 + rnd(51, i) * 1400;
      const y0 = 200 + rnd(52, i) * 640;
      const dx = out * (1900 - x0 + rnd(53, i) * 300);
      const jig = Math.sin(t / 6 + i) * 4;
      const big = 1 + pile * 1.4;
      return <circle key={i} cx={x0 + dx + jig} cy={y0 + Math.cos(t / 7 + i) * 4} r={7 * big} fill="#C8A040" opacity={0.85 * (1 - out * 0.9)} />;
    })}
    {gap > 0.2 ? Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${250 + ((t * 8 + i * 160) % 1500)} ${300 + i * 50} q 30 -10 60 0`} stroke="#6FD0E0" strokeWidth={5} fill="none" opacity={gap * 0.7} />) : null}
  </g>
);
/** A lab cage with a rat; day counter alongside. */
export const RatCage: React.FC<{ x: number; y: number; s?: number; t: number; awake?: number }> = ({ x, y, s = 1, t, awake = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-220} width={600} height={300} fill="none" stroke={SCH.line} strokeWidth={5} />
    {Array.from({ length: 13 }).map((_, i) => <line key={i} x1={-300 + i * 50} y1={-220} x2={-300 + i * 50} y2={80} stroke={SCH.dim} strokeWidth={3} />)}
    <path d="M -300 80 L 300 80" stroke={SCH.line} strokeWidth={8} />
    <g transform={`translate(${Math.sin(t / 9) * 60} 0)`}>
      <ellipse cx={0} cy={40} rx={80} ry={40} fill="#C8C0B8" stroke={INK} strokeWidth={4} />
      <circle cx={70} cy={20} r={30} fill="#C8C0B8" stroke={INK} strokeWidth={4} />
      <circle cx={62} cy={-6} r={12} fill="#E8A0A0" stroke={INK} strokeWidth={3} />
      <circle cx={84} cy={14} r={awake ? 6 : 2} fill={INK} />
      <path d="M -80 50 Q -160 80 -200 40" stroke="#E8A0A0" strokeWidth={6} fill="none" />
    </g>
  </g>
);
export const Globe: React.FC<{ t: number; id: string; x?: number; y?: number; r?: number }> = ({ t, id, x = 960, y = 1180, r = 900 }) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="#03040C" />
    <Stars seed={31} x0={-400} y0={-400} w={2700} h={1800} t={t} n={90} />
    <defs><clipPath id={`gl${id}`}><circle cx={x} cy={y} r={r} /></clipPath></defs>
    <circle cx={x} cy={y} r={r + 30} fill="#2A4A8A" opacity={0.25} />
    <circle cx={x} cy={y} r={r} fill="#0A1430" />
    <g clipPath={`url(#gl${id})`}>
      <g transform={`translate(${-t * 0.6} 0)`}>
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${-200 + i * 420} ${300 + rnd(61, i) * 200} q ${120 + rnd(62, i) * 200} -120 ${300} ${40} q 80 160 -60 300 q -200 60 -240 -140 Z`} fill="#1A2440" />)}
        {Array.from({ length: 260 }).map((_, i) => {
          const px = -200 + rnd(63, i) * 3200;
          const py = 300 + rnd(64, i) * 900;
          return <circle key={i} cx={px} cy={py} r={2 + rnd(65, i) * 4} fill="#FFD88A" opacity={0.5 + 0.5 * Math.sin(t / 5 + i)} />;
        })}
      </g>
      <Glow x={x} y={y - r * 0.5} r={r} kind="warm" o={0.35} />
    </g>
  </g>
);

// ============================================================ the sea floor
/** An upside-down jellyfish on the sand, pulsing; p is its pulse phase speed (1 awake, 0.3 asleep). */
export const Jelly: React.FC<{ x: number; y: number; s?: number; t: number; rate?: number; c?: string }> = ({ x, y, s = 1, t, rate = 1, c = '#9AD8E8' }) => {
  const ph = Math.sin(t * 0.25 * rate);
  const k = 1 + ph * 0.08;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={8} rx={120} ry={16} fill="#000" opacity={0.3} />
      <ellipse cx={0} cy={0} rx={110 * k} ry={30 / k} fill={c} opacity={0.6} stroke="#E8FAFF" strokeWidth={3} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const ex = Math.cos(a) * 70 * k;
        return <path key={i} d={`M ${ex * 0.4} -10 Q ${ex * 0.8} ${-60 - ph * 10} ${ex} ${-90 - (i % 3) * 14 - ph * 12}`} stroke="#C8F0F8" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.75} />;
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={`b${i}`} cx={Math.cos(a) * 66 * k} cy={-96 - (i % 3) * 14 - ph * 12} r={14} fill="#7AC8A8" opacity={0.8} />;
      })}
      <Glow x={0} y={-40} r={180} kind="cool" o={0.35} />
    </g>
  );
};
export const SeaFloor: React.FC<{ t: number; id: string; children?: React.ReactNode }> = ({ t, id, children }) => (
  <g>
    <defs>
      <linearGradient id={`sf${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1A4A6A" /><stop offset="0.6" stopColor="#0C2238" /><stop offset="1" stopColor="#081428" />
      </linearGradient>
    </defs>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill={`url(#sf${id})`} />
    {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${200 + i * 300 + Math.sin(t / 30 + i) * 40} -100 L ${100 + i * 300} 900 L ${260 + i * 300} 900 Z`} fill="#BFE6F4" opacity={0.06} />)}
    <Glow x={1500} y={-60} r={700} kind="cool" o={0.5} />
    <path d="M -400 820 Q 400 760 960 800 T 2400 780 L 2400 2000 L -400 2000 Z" fill="#C8B488" />
    <path d="M -400 820 Q 400 760 960 800 T 2400 780" stroke="#8A7A5A" strokeWidth={6} fill="none" />
    {[[180, 820], [1720, 800], [1400, 830]].map(([x, y], i) => <g key={i}>{Array.from({ length: 5 }).map((_, k) => <path key={k} d={`M ${x + k * 16} ${y} q ${Math.sin(t / 15 + k) * 20} -80 ${k * 6 - 10} -${140 + k * 20}`} stroke="#3A7A5A" strokeWidth={10} fill="none" strokeLinecap="round" />)}</g>)}
    {Array.from({ length: 20 }).map((_, i) => <circle key={i} cx={rnd(71, i) * 1920} cy={1000 - ((t * (1 + rnd(72, i)) + i * 50) % 1100)} r={4 + rnd(73, i) * 6} fill="none" stroke="#DFF6FF" strokeWidth={2} opacity={0.4} />)}
    {children}
  </g>
);

// ============================================================ the desk at night
/** Ramu's study desk by the window at night: a lamp, books, a steel tumbler. Desk top y 700. */
export const DeskNight: React.FC<{ t: number; id: string; clock?: string; children?: React.ReactNode; front?: React.ReactNode }> = ({ t, id, children, front }) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="#2E2A40" />
    <rect x={1100} y={160} width={420} height={360} fill="#0E1430" stroke="#1E1A2A" strokeWidth={14} />
    <Stars seed={17} x0={1110} y0={170} w={400} h={340} t={t} n={14} />
    <Moon x={1400} y={260} r={36} />
    {[1180, 1260, 1340, 1420].map((x) => <line key={x} x1={x} y1={160} x2={x} y2={520} stroke="#1E1A2A" strokeWidth={6} />)}
    <WallClock x={560} y={260} r={60} t={t} />
    {children}
    <rect x={-3000} y={700} width={8000} height={40} fill="#6A4A32" stroke={INK} strokeWidth={6} />
    <rect x={-3000} y={740} width={8000} height={3000} fill="#3A2A22" />
    {/* lamp */}
    <g>
      <rect x={300} y={680} width={140} height={24} rx={8} fill="#2E2A36" stroke={INK} strokeWidth={4} />
      <path d="M 370 690 L 400 520 L 470 470" stroke="#2E2A36" strokeWidth={14} fill="none" />
      <path d="M 430 430 L 560 470 L 520 530 L 400 500 Z" fill="#E9A23B" stroke={INK} strokeWidth={5} />
      <Glow x={560} y={640} r={480} kind="warm" o={0.8} />
    </g>
    {front}
    <LightVeil id={`dn${id}`} lights={[[620, 620, 520]]} o={0.45} />
  </g>
);

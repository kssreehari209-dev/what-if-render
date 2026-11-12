// sea-ml's own pieces: the drowned Kuttanad field and house, the vallam and its rower, the loft and the seed sack,
// the relief camp, the flooded tea shop, Chellanam's tetrapod wall and Appu's house, the Thanneermukkom bund,
// the maps and the sea-level graph, the pokkali field.
import React from 'react';
import { FONT, Glow, Dust, LightVeil, Stars, Moon, Sun, clamp, rnd, kf, Look, Pose, SCH, Schematic, DrawOn, SchLabel } from '../../engine';
import { Fig, Palm, KHouse, Sky, Water } from '../fly-ml/kit';
import { feet } from '../monsoon-ml/kit';
import { Paddy } from '../ice-short-ml/kit';
import { INK } from '../net-ml/kit';

export { INK };
export const fig = (look: Look, x: number, g: number, s: number, extra: Partial<Pose> = {}, rim = 'rimR', shadow = 0.5) => (
  <Fig look={look} pose={{ x, y: feet(g, s), scale: s, ...extra }} rimId={rim} shadow={shadow} />
);
export const push = (t: number, len: number, a: number, b: number) => kf(t, [[0, a], [len, b]]);

// ============================================================ water and light
/** A sun or moon's long reflection on the water. */
export const Streak: React.FC<{ x: number; y: number; t: number; w?: number; h?: number; c?: string; o?: number }> = ({ x, y, t, w = 160, h = 300, c = '#FFC07A', o = 0.7 }) => (
  <g opacity={o} style={{ mixBlendMode: 'screen' }}>
    {Array.from({ length: 12 }).map((_, i) => {
      const yy = y + i * (h / 12);
      const ww = w * (1 - i / 16) * (0.6 + 0.4 * Math.sin(t / 6 + i * 1.7));
      return <rect key={i} x={x - ww / 2 + Math.sin(t / 9 + i) * 10} y={yy} width={ww} height={6} rx={3} fill={c} />;
    })}
  </g>
);
/** Little rings where something breaks the surface. */
export const Rings: React.FC<{ x: number; y: number; t: number; s?: number; c?: string }> = ({ x, y, t, s = 1, c = '#CDE6EA' }) => (
  <g fill="none" stroke={c} strokeWidth={3 * s}>
    {[0, 1, 2].map((k) => {
      const p = ((t / 30 + k / 3) % 1);
      return <ellipse key={k} cx={x} cy={y} rx={(20 + p * 120) * s} ry={(6 + p * 30) * s} opacity={(1 - p) * 0.7} />;
    })}
  </g>
);
/** A row of far palms as a dark silhouette line on the horizon. */
export const FarPalms: React.FC<{ y: number; t: number; c?: string; seed?: number; n?: number }> = ({ y, t, c = '#1E1530', seed = 5, n = 22 }) => (
  <g>
    <path d={`M -1200 ${y} Q 400 ${y - 30} 960 ${y - 10} T 3200 ${y} L 3200 ${y + 60} L -1200 ${y + 60} Z`} fill={c} />
    {Array.from({ length: n }).map((_, i) => {
      const x = -1100 + i * 190 + rnd(seed, i) * 90;
      const h = 120 + rnd(seed + 1, i) * 90;
      const sw = Math.sin(t / 30 + i) * 4;
      return (
        <g key={i} fill={c} stroke={c}>
          <path d={`M ${x} ${y} Q ${x + 10} ${y - h / 2} ${x + 6 + sw} ${y - h}`} strokeWidth={8} fill="none" />
          {[-60, -25, 15, 50, 85].map((a, k) => (
            <path key={k} d={`M ${x + 6 + sw} ${y - h} q ${Math.cos((a * Math.PI) / 180) * 40} ${-14 + Math.abs(a) * 0.5} ${Math.cos((a * Math.PI) / 180) * 70} ${18 + Math.abs(a) * 0.4}`} strokeWidth={9} fill="none" strokeLinecap="round" />
          ))}
        </g>
      );
    })}
  </g>
);
type Mode = 'dusk' | 'night' | 'dawn' | 'day';
const skyMode = (m: Mode) => (m === 'dawn' ? 'day' : m);
/** The sky, the light and the far shore for every outdoor Kuttanad shot. Horizon at hy. */
export const Heaven: React.FC<{ t: number; id: string; mode: Mode; hy?: number; sun?: [number, number] }> = ({ t, id, mode, hy = 560, sun = [1380, 470] }) => (
  <g>
    <Sky id={id} mode={skyMode(mode)} y0={-200} y1={hy + 40} />
    {mode === 'night' ? <g><Stars seed={7} x0={-300} y0={-200} w={2500} h={hy} t={t} n={90} o={0.8} /><Moon x={sun[0]} y={sun[1] - 200} r={56} /><Glow x={sun[0]} y={sun[1] - 200} r={360} kind="cool" o={0.45} /></g> : null}
    {mode === 'dusk' ? <g><Sun x={sun[0]} y={sun[1]} r={96} t={t} /><Glow x={sun[0]} y={sun[1]} r={620} kind="warm" o={0.7} /></g> : null}
    {mode === 'dawn' ? <g><rect x={-3000} y={hy - 200} width={8000} height={240} fill="#F2B98A" opacity={0.45} /><Sun x={sun[0]} y={hy - 10} r={80} t={t} rays={false} /><Glow x={sun[0]} y={hy - 10} r={560} kind="warm" o={0.55} /></g> : null}
    <FarPalms y={hy} t={t} c={mode === 'night' ? '#0C1022' : mode === 'dusk' ? '#2A1838' : '#3E4A5A'} />
  </g>
);
const waterNight = (m: Mode) => m === 'night';
/** The drowned world: the house roof and palms standing in water at level lv. */
export const Drowned: React.FC<{ t: number; id: string; mode?: Mode; lv?: number; house?: [number, number, number]; palms?: [number, number, number][]; tips?: boolean; lit?: number }> = ({
  t, id, mode = 'dusk', lv = 640, house = [1240, 820, 0.7], palms = [[300, 900, 0.9], [560, 860, 0.75], [1700, 880, 0.85]], tips = true, lit = 0,
}) => (
  <g>
    <Heaven t={t} id={id} mode={mode} />
    {palms.map(([x, y, s], i) => <Palm key={i} x={x} y={y} s={s} t={t + i * 30} dark={mode !== 'day'} />)}
    <KHouse x={house[0]} y={house[1]} s={house[2]} night={mode === 'night'} lit={lit} />
    <Water t={t} y={lv} night={waterNight(mode)} />
    <rect x={-3000} y={lv} width={8000} height={3000} fill={mode === 'dusk' ? '#5A2A48' : mode === 'dawn' ? '#7AA2B0' : '#06101E'} opacity={mode === 'night' ? 0.3 : 0.35} />
    {mode === 'dusk' ? <Streak x={1380} y={lv + 6} t={t} /> : mode === 'night' ? <Streak x={1380} y={lv + 6} t={t} c="#C8D8F0" o={0.45} w={110} /> : <Streak x={1380} y={lv + 6} t={t} c="#FFE8C0" o={0.5} />}
    {tips ? <g opacity={0.85}><Paddy x0={-300} x1={900} y={lv + 160} h={34} t={t} seed={4} /><Paddy x0={1500} x1={2300} y={lv + 220} h={30} t={t} seed={9} /></g> : null}
  </g>
);

/** Dry Kuttanad at night or dusk: the paddy, the varamba, the canal in front. Canal level cl (rises over the bank at about 780). */
export const Field: React.FC<{ t: number; id: string; mode?: Mode; cl?: number; yellow?: number; houseLit?: number }> = ({ t, id, mode = 'night', cl = 900, yellow = 0, houseLit = 1 }) => {
  const g = mode === 'night' ? '#1E3020' : '#4A6A34';
  return (
    <g>
      <Heaven t={t} id={id} mode={mode} />
      <Palm x={1640} y={640} s={0.62} t={t} dark />
      <KHouse x={1360} y={620} s={0.42} night={mode === 'night'} lit={houseLit} />
      <Palm x={1110} y={630} s={0.55} t={t + 40} dark />
      <rect x={-3000} y={560} width={8000} height={260} fill={g} />
      {[600, 650, 710, 780].map((y, i) => (
        <g key={y} opacity={0.95}>
          <Paddy x0={-400} x1={2400} y={y} h={26 + i * 12} t={t + i * 9} seed={i + 2} />
        </g>
      ))}
      {yellow > 0 ? <rect x={-3000} y={560} width={8000} height={260} fill="#C8A23A" opacity={yellow * 0.55} style={{ mixBlendMode: 'multiply' }} /> : null}
      {/* the varamba, a mud bank with a path */}
      <path d="M -3000 800 L 5000 800 L 5000 850 L -3000 850 Z" fill={mode === 'night' ? '#3A2C26' : '#7A5A3E'} stroke={INK} strokeWidth={5} />
      <rect x={-3000} y={800} width={8000} height={10} fill={mode === 'night' ? '#4E3E32' : '#9E7A52'} />
      <g opacity={1}><Water t={t} y={cl} night={mode === 'night'} /></g>
      {mode === 'night' ? <Streak x={1380} y={cl + 8} t={t} c="#C8D8F0" o={0.4} w={100} h={200} /> : <Streak x={1380} y={cl + 8} t={t} h={200} />}
    </g>
  );
};

// ============================================================ the boat
/** A Kuttanad country boat, side on: the inside (draw before the people) and the hull (after). x, y the waterline middle. */
export const VallamIn: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -330 -60 Q 0 -40 330 -60 L 300 -50 Q 0 -30 -300 -50 Z" fill="#2A1A12" />
  </g>
);
export const Vallam: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string }> = ({ x, y, s = 1, rot = 0, c = '#4A2E1E' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={360} ry={22} fill="#000" opacity={0.25} />
    <path d="M -370 -96 Q -350 -60 -300 -50 Q 0 -30 300 -50 Q 350 -60 370 -96 Q 360 -20 250 10 Q 0 40 -250 10 Q -360 -20 -370 -96 Z" fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -330 -48 Q 0 -22 330 -48" stroke="#7A4E32" strokeWidth={7} fill="none" />
    {[-200, -60, 80, 220].map((px) => <line key={px} x1={px} y1={-36} x2={px + 6} y2={24} stroke="#2E1C12" strokeWidth={4} opacity={0.6} />)}
  </g>
);
/** A paddle from a hand down into the water. */
export const Oar: React.FC<{ from: [number, number]; to: [number, number]; s?: number }> = ({ from, to, s = 1 }) => {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={INK} strokeWidth={16 * s} strokeLinecap="round" />
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke="#9A6A42" strokeWidth={9 * s} strokeLinecap="round" />
      <ellipse cx={to[0]} cy={to[1]} rx={22 * s} ry={50 * s} transform={`rotate(${(a * 180) / Math.PI - 90} ${to[0]} ${to[1]})`} fill="#9A6A42" stroke={INK} strokeWidth={5 * s} />
    </g>
  );
};
/** Someone sitting in the boat at waterline (x, y), paddling with phase t. Returns the figure; draw Vallam after. */
export const rowerPose = (x: number, y: number, s: number, t: number, extra: Partial<Pose> = {}): Partial<Pose> => {
  const k = Math.sin(t / 9);
  return {
    x, y: y - 70 * s, scale: s, yaw: 0.55, look: 0.5, tilt: 6 + k * 6,
    armR: { a: 60 + k * 26, b: -30 }, armL: { a: 40 + k * 20, b: -40 }, legL: { a: 80, b: -90 }, legR: { a: 80, b: -90 }, ...extra,
  };
};

// ============================================================ the loft
/** The loft under the tiles: rafters, a gap of light at (gx, 120), planks, junk, the seed sack. */
export const Loft: React.FC<{ t: number; id: string; gx?: number; children?: React.ReactNode }> = ({ t, id, gx = 1180, children }) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="#1C1218" />
    {/* the underside of the roof: tiles and battens */}
    <path d="M -400 520 L 960 -60 L 2320 520 L 2320 -600 L -400 -600 Z" fill="#3A2420" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-400 + i * 40} ${520 - i * 17} L ${2320 - i * 40} ${520 - i * 17}`} stroke="#2A1814" strokeWidth={6} opacity={0.0} />)}
    {Array.from({ length: 16 }).map((_, i) => {
      const k = i / 15;
      return <line key={i} x1={-400 + k * 1360} y1={520 - k * 580} x2={-400 + k * 1360} y2={1200} stroke="#2A1A16" strokeWidth={0} />;
    })}
    {Array.from({ length: 9 }).map((_, i) => <path key={`b${i}`} d={`M -400 ${470 - i * 64} L 2320 ${470 - i * 64}`} stroke="#4A2E24" strokeWidth={10} clipPath={`url(#roof${id})`} />)}
    <defs><clipPath id={`roof${id}`}><path d="M -400 520 L 960 -60 L 2320 520 L 2320 -600 L -400 -600 Z" /></clipPath></defs>
    {[-200, 260, 720, 1200, 1660, 2120].map((x) => <line key={x} x1={x} y1={-600} x2={x < 960 ? x + 300 : x - 300} y2={1000} stroke="#5A3826" strokeWidth={30} clipPath={`url(#roof${id})`} />)}
    <path d="M -400 520 L 960 -60 L 2320 520" stroke="#6E4630" strokeWidth={34} fill="none" />
    {/* the tie beam and the floor planks */}
    <rect x={-400} y={560} width={2720} height={40} fill="#4A2E20" stroke={INK} strokeWidth={5} />
    <rect x={-400} y={760} width={2720} height={600} fill="#3A2418" />
    {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={-400} y1={780 + i * 34} x2={2320} y2={780 + i * 34} stroke="#2A1810" strokeWidth={4} />)}
    {/* the gap in the tiles and its beam */}
    <path d={`M ${gx - 40} 150 L ${gx + 40} 130 L ${gx + 360} 880 L ${gx + 60} 900 Z`} fill="#FFD9A0" opacity={0.18} style={{ mixBlendMode: 'screen' }} />
    <rect x={gx - 40} y={120} width={80} height={30} fill="#FFE2B0" transform={`rotate(-22 ${gx} 135)`} />
    <Glow x={gx} y={135} r={160} kind="warm" o={0.8} />
    {/* junk: a tin trunk, coconuts, an old fan, a bicycle wheel */}
    <rect x={120} y={640} width={260} height={150} rx={8} fill="#3E4A5A" stroke={INK} strokeWidth={5} />
    <rect x={120} y={640} width={260} height={30} fill="#506070" stroke={INK} strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={460 + i * 52 + (i % 2) * 20} cy={770 - (i > 1 ? 40 : 0)} r={30} fill="#5C3E28" stroke={INK} strokeWidth={4} />)}
    <circle cx={1700} cy={690} r={90} fill="none" stroke="#5A5060" strokeWidth={10} />
    {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={1700} y1={690} x2={1700 + Math.cos(i * 0.785) * 90} y2={690 + Math.sin(i * 0.785) * 90} stroke="#5A5060" strokeWidth={3} />)}
    {children}
    <LightVeil id={`lf${id}`} lights={[[gx + 200, 640, 380]]} o={0.4} />
    <Dust t={t} seed={5} x0={gx - 40} y0={200} w={420} h={680} n={26} o={0.6} />
  </g>
);
/** The seed sack: jute, tied at the top, a painted label; wet darkens it from the bottom (0..1). open shows the grain. */
export const SeedSack: React.FC<{ x: number; y: number; s?: number; wet?: number; open?: number; id: string }> = ({ x, y, s = 1, wet = 0, open = 0, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={150} ry={20} fill="#000" opacity={0.35} />
    <defs>
      <clipPath id={`sk${id}`}><path d="M -130 0 Q -150 -150 -100 -280 Q 0 -310 100 -280 Q 150 -150 130 0 Q 0 16 -130 0 Z" /></clipPath>
    </defs>
    <path d="M -130 0 Q -150 -150 -100 -280 Q 0 -310 100 -280 Q 150 -150 130 0 Q 0 16 -130 0 Z" fill="#B89A62" stroke={INK} strokeWidth={6} />
    <g clipPath={`url(#sk${id})`}>
      {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-150} y1={-10 - i * 22} x2={150} y2={-10 - i * 22} stroke="#9E8250" strokeWidth={3} />)}
      {Array.from({ length: 14 }).map((_, i) => <line key={`v${i}`} x1={-140 + i * 22} y1={-300} x2={-140 + i * 22} y2={20} stroke="#9E8250" strokeWidth={2} opacity={0.6} />)}
      {wet > 0 ? <path d={`M -160 20 L -160 ${-wet * 140} Q -80 ${-wet * 140 - 20} 0 ${-wet * 140 + 6} Q 80 ${-wet * 140 + 18} 160 ${-wet * 140 - 4} L 160 20 Z`} fill="#3E3420" opacity={0.75} /> : null}
    </g>
    <text x={0} y={-150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#7A2E1E">വിത്ത്</text>
    {open > 0 ? (
      <g>
        <ellipse cx={0} cy={-286} rx={96 * open + 4} ry={26 * open + 2} fill="#D8B860" stroke={INK} strokeWidth={5} />
        {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={(rnd(3, i) - 0.5) * 160 * open} cy={-286 + (rnd(4, i) - 0.5) * 36 * open} rx={7} ry={4} fill="#E8C870" stroke="#8A6A2A" strokeWidth={1.5} transform={`rotate(${rnd(5, i) * 180} ${(rnd(3, i) - 0.5) * 160 * open} ${-286 + (rnd(4, i) - 0.5) * 36 * open})`} />)}
      </g>
    ) : <path d="M -40 -290 Q 0 -330 40 -290 M -10 -300 L -30 -340 M 10 -300 L 30 -340" stroke="#7A5A2E" strokeWidth={8} fill="none" strokeLinecap="round" />}
  </g>
);
/** A wooden ladder from (x, y0) up to (x, y1). */
export const Ladder: React.FC<{ x: number; y0: number; y1: number; w?: number }> = ({ x, y0, y1, w = 160 }) => (
  <g>
    {[-w / 2, w / 2].map((d) => <line key={d} x1={x + d} y1={y0} x2={x + d * 0.85} y2={y1} stroke="#6E4A30" strokeWidth={22} />)}
    {Array.from({ length: Math.floor((y0 - y1) / 90) }).map((_, i) => <line key={i} x1={x - w / 2} y1={y0 - 40 - i * 90} x2={x + w / 2} y2={y0 - 40 - i * 90} stroke="#5A3A26" strokeWidth={16} />)}
  </g>
);

// ============================================================ inside the house and the camp
/** A hurricane lantern with its glow. */
export const Lantern: React.FC<{ x: number; y: number; s?: number; t?: number; o?: number }> = ({ x, y, s = 1, t = 0, o = 1 }) => (
  <g>
    <Glow x={x} y={y - 60 * s} r={520 * s} kind="warm" o={(0.7 + Math.sin(t / 5) * 0.06) * o} />
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -30 -150 Q 0 -190 30 -150" stroke="#2A2A30" strokeWidth={6} fill="none" />
      <rect x={-34} y={-150} width={68} height={16} rx={4} fill="#5A5A62" stroke={INK} strokeWidth={4} />
      <path d="M -30 -134 Q -46 -80 -30 -30 L 30 -30 Q 46 -80 30 -134 Z" fill="#FFE2A0" opacity={0.9} stroke={INK} strokeWidth={4} />
      <path d={`M 0 -96 q -8 -14 0 -30 q 8 16 0 30`} fill="#FF9A3A" />
      <rect x={-40} y={-30} width={80} height={30} rx={6} fill="#B8423A" stroke={INK} strokeWidth={4} />
    </g>
  </g>
);
/** The relief camp: a classroom at night, a blackboard with the camp's name, mats, bags, benches; a lantern on the desk. */
export const Camp: React.FC<{ t: number; id: string; morning?: boolean; children?: React.ReactNode }> = ({ t, id, morning, children }) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={3840} fill={morning ? '#5E5A6A' : '#3A3446'} />
    <rect x={-3000} y={300} width={8000} height={260} fill={morning ? '#6E6A76' : '#443E50'} />
    <rect x={-3000} y={840} width={8000} height={3000} fill="#4A3A34" />
    <rect x={-3000} y={834} width={8000} height={14} fill="#2A2026" />
    {/* the blackboard */}
    <rect x={420} y={250} width={760} height={360} fill="#22362E" stroke="#5A3A26" strokeWidth={18} />
    <text x={800} y={360} textAnchor="middle" fontFamily={FONT.hand} fontSize={50} fill="#E8E8DC" opacity={0.85}>ദുരിതാശ്വാസ ക്യാമ്പ്</text>
    <text x={800} y={440} textAnchor="middle" fontFamily={FONT.hand} fontSize={36} fill="#E8E8DC" opacity={0.6}>കുടുംബങ്ങൾ: 46</text>
    <text x={800} y={500} textAnchor="middle" fontFamily={FONT.hand} fontSize={36} fill="#E8E8DC" opacity={0.6}>ആളുകൾ: 183</text>
    {/* a barred window with the sky */}
    <rect x={1400} y={260} width={300} height={300} fill={morning ? '#9EB8C8' : '#14203A'} stroke="#2A2230" strokeWidth={12} />
    {!morning ? <Stars seed={3} x0={1410} y0={270} w={280} h={280} t={t} n={10} /> : null}
    {[1460, 1520, 1580, 1640].map((x) => <line key={x} x1={x} y1={260} x2={x} y2={560} stroke="#2A2230" strokeWidth={8} />)}
    {morning ? <Glow x={1550} y={410} r={500} kind="warm" o={0.5} /> : null}
    {/* a clock and a chart of the alphabet */}
    <circle cx={260} cy={320} r={56} fill="#E8E0CC" stroke={INK} strokeWidth={6} />
    <path d="M 260 320 L 260 284 M 260 320 L 286 332" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <rect x={1820} y={260} width={200} height={260} fill="#E8D8A8" stroke={INK} strokeWidth={5} />
    {['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ'].map((c, i) => <text key={c} x={1860 + (i % 2) * 100} y={330 + Math.floor(i / 2) * 70} fontFamily={FONT.title} fontSize={50} fill="#7A2E1E">{c}</text>)}
    {/* mats, bags and steel plates along the floor */}
    {[-200, 300, 900, 1500, 2000].map((x, i) => (
      <g key={x}>
        <rect x={x} y={880 + (i % 2) * 40} width={420} height={60} rx={8} fill={['#7A5A8A', '#3E6E8C', '#9A5A3A', '#5A7A4A', '#7A3A4A'][i]} stroke={INK} strokeWidth={4} />
        <rect x={x + 30} y={850 + (i % 2) * 40} width={110} height={50} rx={10} fill="#E8E0CC" stroke={INK} strokeWidth={4} />
      </g>
    ))}
    {children}
    {!morning ? <LightVeil id={`cp${id}`} lights={[[960, 600, 560]]} o={0.42} /> : <LightVeil id={`cp${id}`} lights={[[1550, 420, 640]]} o={0.3} />}
    <Dust t={t} seed={8} x0={600} y0={300} w={800} h={500} n={16} o={0.35} />
  </g>
);
/** A school bench, side on. */
export const Bench: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 520 }) => (
  <g>
    <ellipse cx={x + w / 2} cy={y + 150} rx={w / 2 + 20} ry={14} fill="#000" opacity={0.3} />
    <rect x={x} y={y} width={w} height={34} fill="#7A4E32" stroke={INK} strokeWidth={5} />
    {[x + 30, x + w - 50].map((lx) => <rect key={lx} x={lx} y={y + 34} width={22} height={116} fill="#5A3826" stroke={INK} strokeWidth={4} />)}
  </g>
);
/** An aluminium charuvam (a wide, low cooking vessel) seen three-quarter from above. */
export const Charuvam: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={30} rx={200} ry={80} fill="#8E949C" stroke={INK} strokeWidth={6} />
    <ellipse cx={0} cy={0} rx={200} ry={80} fill="#C8CED6" stroke={INK} strokeWidth={6} />
    <ellipse cx={0} cy={6} rx={170} ry={62} fill="#6E747C" />
    <path d="M -150 -40 Q -60 -76 60 -74" stroke="#F0F4F8" strokeWidth={8} fill="none" opacity={0.8} />
  </g>
);
/** A steel tumbler. */
export const Tumbler: React.FC<{ x: number; y: number; s?: number; salt?: number; rot?: number }> = ({ x, y, s = 1, salt = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -50 -140 L 50 -140 L 40 0 L -40 0 Z" fill="#B8C0C8" stroke={INK} strokeWidth={5} />
    <path d="M -30 -130 L -22 -10" stroke="#EEF2F6" strokeWidth={8} opacity={0.8} />
    <ellipse cx={0} cy={-140} rx={50} ry={12} fill="#8A929A" stroke={INK} strokeWidth={4} />
    {salt > 0 ? <g opacity={salt}><ellipse cx={0} cy={-136} rx={46} ry={10} fill="none" stroke="#FFFFFF" strokeWidth={7} strokeDasharray="5 4" />{Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-44 + i * 8} y={-128 + (i % 3) * 5} width={5} height={5} fill="#FFFFFF" />)}</g> : null}
  </g>
);
/** An almirah (steel cupboard), doors open by `open`. */
export const Almirah: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-560} width={320} height={560} fill="#4A5A6A" stroke={INK} strokeWidth={6} />
    <rect x={-140} y={-540} width={280} height={520} fill="#2A2430" />
    {[-400, -260, -130].map((yy) => <rect key={yy} x={-140} y={yy} width={280} height={12} fill="#5A6A7A" />)}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-120 + i * 60} y={-390} width={50} height={110} fill={['#9A5A3A', '#E8D8A8', '#3E6E8C', '#7A3A4A'][i]} stroke={INK} strokeWidth={3} />)}
    <rect x={-140 - open * 0} y={-540} width={140 * (1 - open * 0.85)} height={520} fill="#5E6E7E" stroke={INK} strokeWidth={5} />
    <rect x={140 - 140 * (1 - open * 0.85)} y={-540} width={140 * (1 - open * 0.85)} height={520} fill="#5E6E7E" stroke={INK} strokeWidth={5} />
  </g>
);
/** A framed photo; children draw inside a 0..w, 0..h box. */
export const Photo: React.FC<{ x: number; y: number; w: number; h: number; s?: number; rot?: number; id: string; children?: React.ReactNode }> = ({ x, y, w, h, s = 1, rot = 0, id, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-24} y={-24} width={w + 48} height={h + 48} fill="#4A2E1E" stroke={INK} strokeWidth={6} />
    <defs><clipPath id={`ph${id}`}><rect x={0} y={0} width={w} height={h} /></clipPath></defs>
    <g clipPath={`url(#ph${id})`}><rect x={0} y={0} width={w} height={h} fill="#C8B08A" />{children}<rect x={0} y={0} width={w} height={h} fill="#8A6A3A" opacity={0.35} style={{ mixBlendMode: 'multiply' }} /></g>
  </g>
);

// ============================================================ the town in the water
/** The flooded junction: a two-storey tea shop (upstairs window at 1180, 420), a bus shelter, palms. Water at lv. */
export const Junction: React.FC<{ t: number; id: string; lv?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ t, id, lv = 760, children, front }) => (
  <g>
    <Heaven t={t} id={id} mode="day" hy={600} sun={[300, 300]} />
    <Palm x={200} y={760} s={0.9} t={t} />
    <Palm x={1780} y={760} s={0.8} t={t + 30} />
    {/* the tea shop */}
    <g>
      <rect x={880} y={300} width={600} height={520} fill="#D8C49A" stroke={INK} strokeWidth={6} />
      <rect x={880} y={300} width={600} height={30} fill="#B8A47A" />
      <path d="M 840 310 L 1180 170 L 1520 310 Z" fill="#A2432C" stroke={INK} strokeWidth={6} />
      <rect x={900} y={560} width={560} height={50} fill="#2E6E4A" stroke={INK} strokeWidth={5} />
      <text x={1180} y={598} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#F6EFE3">ബാബുവിന്റെ ചായക്കട</text>
      <rect x={1080} y={360} width={200} height={150} fill="#FFC867" stroke={INK} strokeWidth={6} />
      <Glow x={1180} y={430} r={240} kind="warm" o={0.45} />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={910 + i * 92} y={630} width={80} height={200} fill="#6A6A72" stroke={INK} strokeWidth={4} />)}
    </g>
    {children}
    <Water t={t} y={lv} />
    <rect x={-3000} y={lv} width={8000} height={3000} fill="#6A5A3A" opacity={0.3} />
    {front}
  </g>
);

// ============================================================ Chellanam
/** A concrete tetrapod. */
export const Tetrapod: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string }> = ({ x, y, s = 1, rot = 0, c = '#9A9AA2' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[0, 120, 240].map((a) => (
      <path key={a} d="M -22 0 L -12 -90 Q 0 -100 12 -90 L 22 0 Z" fill={c} stroke={INK} strokeWidth={4} transform={`rotate(${a})`} />
    ))}
    <path d="M -16 0 L -10 60 Q 0 70 10 60 L 16 0 Z" fill="#6E6E78" stroke={INK} strokeWidth={4} />
    <circle cx={0} cy={0} r={28} fill={c} stroke={INK} strokeWidth={4} />
    <circle cx={-8} cy={-8} r={8} fill="#C8C8D0" opacity={0.7} />
  </g>
);
/** The tetrapod wall along the coast at y (the sea beyond it), from x0 to x1. */
export const TetraWall: React.FC<{ y: number; x0?: number; x1?: number; s?: number; seed?: number }> = ({ y, x0 = -600, x1 = 2600, s = 1, seed = 3 }) => (
  <g>
    {[0, 1, 2].map((row) => Array.from({ length: Math.floor((x1 - x0) / (110 * s)) }).map((_, i) => (
      <Tetrapod key={`${row}-${i}`} x={x0 + i * 110 * s + (row % 2) * 55 * s + rnd(seed + row, i) * 20} y={y + row * 50 * s} s={s * (0.85 + row * 0.12)} rot={rnd(seed + 7, i + row * 40) * 120} c={row === 2 ? '#8A8A92' : '#A8A8B0'} />
    )))}
  </g>
);
/** Chellanam from the road: the sea, the tetrapod wall at 640, Appu's little blue house at hx. Water from the backwater at lv (none: 2000). */
export const Coast: React.FC<{ t: number; id: string; lv?: number; hx?: number; sunset?: boolean; children?: React.ReactNode }> = ({ t, id, lv = 2000, hx = 1300, sunset, children }) => (
  <g>
    <Sky id={id} mode={sunset ? 'dusk' : 'day'} y0={-200} y1={560} />
    {sunset ? <g><Sun x={600} y={470} r={90} t={t} /><Glow x={600} y={470} r={600} kind="warm" o={0.7} /></g> : <Sun x={500} y={180} r={70} t={t} rays={false} />}
    {/* the sea and its waves */}
    <rect x={-3000} y={520} width={8000} height={200} fill={sunset ? '#6A3A5A' : '#3E7C9A'} />
    {[0, 1, 2, 3].map((k) => {
      let d = `M -2000 ${540 + k * 26}`;
      for (let x = -2000; x <= 4000; x += 90) d += ` q 45 ${-10 - Math.sin(t / 7 + x / 100 + k) * 8} 90 0`;
      return <path key={k} d={d} stroke="#E8F0F4" strokeWidth={4 - k * 0.6} fill="none" opacity={0.5} />;
    })}
    {sunset ? <Streak x={600} y={526} t={t} h={140} /> : null}
    <TetraWall y={630} s={0.9} />
    {/* the road and the house */}
    <rect x={-3000} y={760} width={8000} height={3000} fill="#8A7A62" />
    <rect x={-3000} y={760} width={8000} height={12} fill="#6A5A48" />
    <g transform={`translate(${hx} 800)`}>
      <ellipse cx={0} cy={10} rx={300} ry={18} fill="#000" opacity={0.3} />
      <rect x={-240} y={-230} width={480} height={240} fill="#5A8AB0" stroke={INK} strokeWidth={6} />
      <path d="M -280 -220 L 0 -330 L 280 -220 Z" fill="#8A8A90" stroke={INK} strokeWidth={6} />
      {Array.from({ length: 7 }).map((_, i) => <line key={i} x1={-240 + i * 80} y1={-236 + i * 0} x2={-200 + i * 70} y2={-310 + i * 0} stroke="#6E6E74" strokeWidth={4} />)}
      <rect x={-50} y={-160} width={100} height={170} fill="#3A2A22" stroke={INK} strokeWidth={5} />
      <rect x={-200} y={-170} width={100} height={80} fill="#2A3A4A" stroke={INK} strokeWidth={5} />
      <rect x={100} y={-170} width={100} height={80} fill="#2A3A4A" stroke={INK} strokeWidth={5} />
      <path d="M -300 -40 Q -340 -100 -300 -170 Q -260 -100 -300 -40" fill="none" stroke="#C8B890" strokeWidth={3} />
      <path d="M 260 0 L 260 -180 M 230 -170 Q 300 -120 330 -20" stroke="#C8B890" strokeWidth={3} fill="none" />
    </g>
    {children}
    {lv < 2000 ? <g><Water t={t} y={lv} /><rect x={-3000} y={lv} width={8000} height={3000} fill="#6A5A3A" opacity={0.3} /></g> : null}
  </g>
);
/** Inside Appu's kitchen: a blue wall, a hearth, pots stacked on a cot, water at lv. */
export const AppuIn: React.FC<{ t: number; id: string; lv?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ t, id, lv = 820, children, front }) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="#3E5A72" />
    <rect x={-3000} y={-3000} width={8000} height={3260} fill="#4A6A84" />
    <rect x={1300} y={240} width={300} height={260} fill="#D8E8F0" stroke={INK} strokeWidth={10} />
    <Glow x={1450} y={370} r={600} kind="warm" o={0.55} />
    {[1375, 1450, 1525].map((x) => <line key={x} x1={x} y1={240} x2={x} y2={500} stroke={INK} strokeWidth={6} />)}
    {/* shelf with steel plates and a calendar of a saint */}
    <rect x={300} y={360} width={480} height={20} fill="#6E4A30" stroke={INK} strokeWidth={4} />
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={340 + i * 90} cy={330} rx={40} ry={30} fill="#C8CED6" stroke={INK} strokeWidth={4} />)}
    <rect x={880} y={220} width={160} height={220} fill="#E8D8A8" stroke={INK} strokeWidth={4} />
    <circle cx={960} cy={290} r={40} fill="#C8A060" />
    {/* the hearth */}
    <rect x={200} y={600} width={420} height={300} fill="#8A4630" stroke={INK} strokeWidth={6} />
    <ellipse cx={330} cy={600} rx={70} ry={20} fill="#2A1A14" /><ellipse cx={500} cy={600} rx={70} ry={20} fill="#2A1A14" />
    {children}
    <Water t={t} y={lv} />
    <rect x={-3000} y={lv} width={8000} height={3000} fill="#6A5A3A" opacity={0.3} />
    {front}
    <LightVeil id={`ai${id}`} lights={[[1450, 420, 560]]} o={0.36} />
  </g>
);

// ============================================================ the bund, the city, pokkali
/** Thanneermukkom: a long low concrete bridge of shutters across the lake. Levels left (sea side) and right. */
export const Bund: React.FC<{ t: number; id: string; seaLv?: number; lakeLv?: number; close?: boolean }> = ({ t, id, seaLv = 690, lakeLv = 720, close }) => {
  const y = close ? 520 : 600;
  const n = close ? 7 : 26;
  const w = close ? 300 : 90;
  return (
    <g>
      <Heaven t={t} id={id} mode="dusk" hy={close ? 420 : 560} sun={[1500, close ? 360 : 470]} />
      <Water t={t} y={Math.min(seaLv, lakeLv)} />
      {/* the deck and its piers */}
      <g>
        {Array.from({ length: n }).map((_, i) => {
          const x = (close ? -120 : -60) + i * w;
          return (
            <g key={i}>
              <rect x={x} y={y} width={w * 0.82} height={close ? 420 : 160} fill="#6E6A74" stroke={INK} strokeWidth={close ? 6 : 3} />
              <rect x={x + w * 0.08} y={y + (close ? 40 : 14)} width={w * 0.66} height={close ? 300 : 110} fill="#4A5260" stroke={INK} strokeWidth={close ? 5 : 2} />
              {close ? [0, 1, 2, 3].map((k) => <line key={k} x1={x + w * 0.1} y1={y + 80 + k * 70} x2={x + w * 0.72} y2={y + 80 + k * 70} stroke="#3A4250" strokeWidth={6} />) : null}
            </g>
          );
        })}
        <rect x={-3000} y={y - (close ? 60 : 24)} width={8000} height={close ? 60 : 24} fill="#8A8690" stroke={INK} strokeWidth={close ? 6 : 3} />
        {close ? [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-100 + i * 380} y={y - 130} width={20} height={70} fill="#5A5660" />) : null}
      </g>
      <Water t={t + 20} y={close ? seaLv : lakeLv + 60} />
      <rect x={-3000} y={close ? seaLv : lakeLv + 60} width={8000} height={3000} fill="#3A2A48" opacity={0.25} />
    </g>
  );
};
/** A row of city towers (Kochi), bases at y. */
export const Skyline: React.FC<{ y: number; t: number; lit?: number }> = ({ y, t, lit = 0.6 }) => (
  <g>
    {[[-80, 420, 260], [220, 560, 220], [470, 360, 300], [800, 640, 240], [1080, 480, 280], [1380, 700, 220], [1630, 420, 260], [1900, 520, 240]].map(([x, h, w], i) => (
      <g key={i}>
        <rect x={x} y={y - h} width={w} height={h + 400} fill={['#3A3450', '#443E5A', '#36304A'][i % 3]} stroke={INK} strokeWidth={5} />
        {Array.from({ length: Math.floor(h / 60) * 4 }).map((_, k) => (
          <rect key={k} x={x + 20 + (k % 4) * (w - 40) / 4} y={y - h + 26 + Math.floor(k / 4) * 60} width={(w - 40) / 4 - 14} height={30} fill={rnd(i + 3, k) < lit ? '#FFC867' : '#2A2438'} />
        ))}
      </g>
    ))}
  </g>
);
/** Pokkali: tall rice standing in tidal water, with a wooden sluice. */
export const Pokkali: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Heaven t={t} id={id} mode="dusk" hy={520} sun={[600, 440]} />
    <Water t={t} y={700} />
    {[700, 760, 830, 910].map((y, i) => (
      <g key={y}>
        {Array.from({ length: 40 }).map((_, k) => {
          const x = -300 + k * 64 + rnd(i + 1, k) * 30;
          if (i === 3 && x > 600 && x < 1200) return null;
          const h = 220 + i * 50 + rnd(i + 5, k) * 60;
          const w = Math.sin(t / 16 + k + i) * 8;
          return (
            <g key={k} stroke={i % 2 ? '#8AB856' : '#6E9E46'} strokeWidth={6 + i} fill="none" strokeLinecap="round">
              <path d={`M ${x} ${y} Q ${x - 6} ${y - h * 0.6} ${x - 24 + w} ${y - h}`} />
              <path d={`M ${x} ${y} Q ${x + 6} ${y - h * 0.6} ${x + 22 + w} ${y - h * 0.9}`} />
              <path d={`M ${x - 24 + w} ${y - h} q -10 30 -2 60`} stroke="#D8B860" strokeWidth={10 + i} />
            </g>
          );
        })}
      </g>
    ))}
    {/* the sluice */}
    <g transform="translate(900 960)">
      <rect x={-20} y={-300} width={40} height={340} fill="#5A3A26" stroke={INK} strokeWidth={5} />
      <rect x={280} y={-300} width={40} height={340} fill="#5A3A26" stroke={INK} strokeWidth={5} />
      <rect x={20} y={-200} width={260} height={160} fill="#7A5A3A" stroke={INK} strokeWidth={5} />
      {[0, 1, 2].map((k) => <line key={k} x1={20} y1={-160 + k * 40} x2={280} y2={-160 + k * 40} stroke="#4A3020" strokeWidth={5} />)}
      <rect x={-40} y={-320} width={380} height={30} fill="#6E4A30" stroke={INK} strokeWidth={5} />
    </g>
  </g>
);
/** A man-in-a-tie's big white car, side on, facing left. */
export const WhiteCar: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={420} ry={22} fill="#000" opacity={0.35} />
    <path d="M -400 -40 L -380 -130 L -250 -150 L -160 -260 L 250 -260 L 360 -150 L 400 -130 L 410 -40 Z" fill="#ECEEF2" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -140 -240 L -60 -240 L -60 -150 L -230 -150 Z M -40 -240 L 120 -240 L 120 -150 L -40 -150 Z M 140 -240 L 240 -240 L 330 -150 L 140 -150 Z" fill="#2A3444" stroke={INK} strokeWidth={4} />
    <path d="M -380 -110 L 400 -110" stroke="#C8CCD4" strokeWidth={6} />
    <rect x={-400} y={-80} width={60} height={24} rx={6} fill="#FFE8A0" />
    {[-250, 250].map((wx) => <g key={wx}><circle cx={wx} cy={-30} r={64} fill="#1A1A20" stroke={INK} strokeWidth={5} /><circle cx={wx} cy={-30} r={28} fill="#8A8E96" /></g>)}
  </g>
);

// ============================================================ maps and graphs
const KERALA_COAST: [number, number][] = [[700, 70], [745, 190], [790, 310], [840, 430], [890, 550], [945, 660], [1000, 760], [1065, 870], [1130, 990]];
const KERALA_IN: [number, number][] = [[1130, 990], [1200, 900], [1200, 780], [1150, 660], [1130, 560], [1060, 430], [1000, 330], [930, 200], [830, 80], [760, 50]];
export const keralaPath = () => 'M ' + [...KERALA_COAST, ...KERALA_IN].map(([x, y]) => `${x} ${y}`).join(' L ') + ' Z';
export const coastPath = () => 'M ' + KERALA_COAST.map(([x, y]) => `${x} ${y}`).join(' L ');
const DIST = ['കാസർകോട്', 'കണ്ണൂർ', 'കോഴിക്കോട്', 'മലപ്പുറം', 'തൃശ്ശൂർ', 'എറണാകുളം', 'ആലപ്പുഴ', 'കൊല്ലം', 'തിരുവനന്തപുരം'];
/** Kerala on the schematic: the outline, the coast drawing on in orange, the nine coastal districts dotting on. */
export const KeralaMap: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Schematic t={t} id={id} />
    <rect x={-3000} y={-3000} width={3700 + 40} height={8000} fill="#0E2A44" opacity={0.6} />
    <path d={keralaPath()} fill="#1E3A2A" stroke={SCH.dim} strokeWidth={4} />
    <SchLabel x={460} y={560} t={t - 4} text="അറബിക്കടൽ" size={44} color="#6FB0D0" />
    <DrawOn d={coastPath()} t={t - 6} dur={60} color={SCH.live} width={12} />
    {KERALA_COAST.map(([x, y], i) => (t > 10 + i * 9 ? (
      <g key={i}>
        <circle cx={x} cy={y} r={14} fill={SCH.glow} />
        <Glow x={x} y={y} r={60} kind="warm" o={0.6} />
        <text x={x + 40} y={y + 12} fontFamily={FONT.title} fontSize={30} fill={SCH.line} opacity={clamp((t - 10 - i * 9) / 6)}>{DIST[i]}</text>
      </g>
    ) : null))}
  </g>
);
/** Kochi on the schematic: sea, the islands and the backwater; the 1 m flood spreading in blue by p (0..1). */
export const KochiMap: React.FC<{ t: number; id: string; p: number }> = ({ t, id, p }) => (
  <g>
    <Schematic t={t} id={id} />
    <rect x={-3000} y={-3000} width={3700} height={8000} fill="#0E2A44" opacity={0.7} />
    <path d="M 700 -100 L 760 300 L 820 560 L 900 900 L 980 1200 L 3000 1200 L 3000 -100 Z" fill="#1E3A2A" stroke={SCH.dim} strokeWidth={4} />
    {/* the backwater and its islands */}
    <path d="M 900 -100 Q 1000 300 1050 520 Q 1100 700 1080 1200 L 1240 1200 Q 1260 700 1200 520 Q 1140 300 1080 -100 Z" fill="#0E2A44" stroke={SCH.dim} strokeWidth={3} />
    {[[1120, 260, 50], [1140, 420, 70], [1170, 640, 60]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 1.6} fill="#1E3A2A" stroke={SCH.dim} strokeWidth={3} />)}
    <g opacity={0.75}>
      <defs><clipPath id={`kc${id}`}><path d="M 700 -100 L 760 300 L 820 560 L 900 900 L 980 1200 L 3000 1200 L 3000 -100 Z" /></clipPath></defs>
      <g clipPath={`url(#kc${id})`}>
        {[[880, 400], [1000, 700], [1260, 500], [1300, 860], [950, 1000], [1100, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={p * (90 + i * 18)} fill="#3E9AD8" />)}
      </g>
    </g>
    <SchLabel x={1500} y={300} t={t - 6} text="കൊച്ചി" size={60} />
    <SchLabel x={420} y={540} t={t - 4} text="അറബിക്കടൽ" size={44} color="#6FB0D0" />
  </g>
);
/** The cross-section: the sea on the left at seaY, the land falling to Kuttanad's fields below it. */
export const Section: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Schematic t={t} id={id} />
    <path d="M -200 480 L 560 480 L 560 1200 L -200 1200 Z" fill="#1E5A8A" opacity={0.7} />
    <DrawOn d="M -200 640 Q 300 650 520 560 L 640 500 L 760 520 Q 900 660 1100 660 L 1700 660 Q 1800 620 1900 500 L 2200 470" t={t - 2} dur={24} color={SCH.line} width={7} />
    <path d="M -200 1200 L -200 640 Q 300 650 520 560 L 640 500 L 760 520 Q 900 660 1100 660 L 1700 660 Q 1800 620 1900 500 L 2200 470 L 2200 1200 Z" fill="#3A2C22" opacity={clamp((t - 10) / 10)} />
    <line x1={-200} y1={480} x2={2200} y2={480} stroke={SCH.live} strokeWidth={5} strokeDasharray="22 14" opacity={clamp((t - 14) / 8)} />
    <SchLabel x={240} y={440} t={t - 14} text="കടൽ നിരപ്പ്" size={44} color={SCH.glow} />
    <SchLabel x={240} y={760} t={t - 6} text="കടൽ" size={50} color="#8EC8F0" />
    {t > 22 ? <g><Paddy x0={820} x1={1700} y={660} h={40} t={t} seed={3} /></g> : null}
    <SchLabel x={1300} y={760} t={t - 22} text="കുട്ടനാട്" size={56} />
    {t > 30 ? <g>
      <line x1={1300} y1={490} x2={1300} y2={640} stroke={SCH.glow} strokeWidth={6} />
      <path d="M 1284 620 L 1300 646 L 1316 620" fill={SCH.glow} />
      <path d="M 1284 510 L 1300 484 L 1316 510" fill={SCH.glow} />
    </g> : null}
  </g>
);
/** The sea-level graph, 1900 to 2100. p0 draws the observed line, p1 the projection. */
export const Graph: React.FC<{ t: number; id: string; p0: number; p1: number }> = ({ t, id, p0, p1 }) => {
  const X = (yr: number) => 260 + ((yr - 1900) / 200) * 1440;
  const Y = (m: number) => 600 - m * 430;
  const obs = Array.from({ length: 24 }).map((_, i) => { const yr = 1900 + i * 5; return [X(Math.min(yr, 2018)), Y(0.2 * Math.pow((Math.min(yr, 2018) - 1900) / 118, 1.5))]; });
  const obsD = 'M ' + obs.map(([x, y]) => `${x} ${y}`).join(' L ');
  const hi = `M ${X(2018)} ${Y(0.2)} Q ${X(2070)} ${Y(0.42)} ${X(2100)} ${Y(1.17)}`;
  const lo = `M ${X(2018)} ${Y(0.2)} Q ${X(2070)} ${Y(0.36)} ${X(2100)} ${Y(0.79)}`;
  return (
    <g>
      <Schematic t={t} id={id} />
      <line x1={X(1900)} y1={Y(0)} x2={X(2100) + 40} y2={Y(0)} stroke={SCH.dim} strokeWidth={4} />
      <line x1={X(1900)} y1={Y(0)} x2={X(1900)} y2={Y(1.2)} stroke={SCH.dim} strokeWidth={4} />
      {[1900, 1950, 2000, 2050, 2100].map((yr) => <text key={yr} x={X(yr)} y={Y(0) + 56} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim}>{yr}</text>)}
      {[0, 0.5, 1].map((m) => <text key={m} x={X(1900) - 24} y={Y(m) + 12} textAnchor="end" fontFamily={FONT.ui} fontSize={32} fill={SCH.dim}>{m === 0 ? '0' : `${m} മീ`}</text>)}
      <line x1={X(1900)} y1={Y(1)} x2={X(2100)} y2={Y(1)} stroke={SCH.dim} strokeWidth={2} strokeDasharray="10 10" />
      {p0 > 0 ? <DrawOn d={obsD} t={p0 * 30} dur={30} color="#8EC8F0" width={10} /> : null}
      {p1 > 0 ? <g opacity={clamp(p1 * 2)}>
        <path d={`${hi} L ${X(2100)} ${Y(0.79)} Q ${X(2070)} ${Y(0.36)} ${X(2018)} ${Y(0.2)} Z`} fill={SCH.live} opacity={0.25 * clamp(p1 * 1.5)} />
        <DrawOn d={hi} t={p1 * 30} dur={30} color={SCH.live} width={8} />
        <DrawOn d={lo} t={p1 * 30} dur={30} color={SCH.glow} width={5} />
      </g> : null}
      {p0 > 0.9 ? <circle cx={X(2018)} cy={Y(0.2)} r={14} fill="#8EC8F0" /> : null}
    </g>
  );
};

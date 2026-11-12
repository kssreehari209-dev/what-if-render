// fly-ml's own pieces: skies, clouds, Kerala outdoors (palms, mango tree, tiled house, backwaters, tea hills),
// a plane, weather, flood water, a radar, and the power's gust. All pure functions of the shot clock.
import React from 'react';
import {
  Hero, basePose, Pose, joints, toWorld, clamp, rnd, kf, Glow, Stars, Moon, FONT, SCH, LOOKS, Look,
} from '../../engine';

export const Fig: React.FC<{ look: Look; pose: Partial<Pose>; shadow?: number; rimId?: string }> = ({ look, pose, shadow = 0, rimId = 'rimR' }) => (
  <Hero look={look} pose={{ ...basePose, ...pose }} shadow={shadow} rimId={rimId} />
);
export const full = (p: Partial<Pose>): Pose => ({ ...basePose, ...p });

// ---------------------------------------------------------------- poses
/** Superman flight to the right (dir 1) or left (-1): body near horizontal, arms ahead, legs trailing. */
export const flyPose = (x: number, y: number, t: number, s = 0.8, dir: 1 | -1 = 1, extra: Partial<Pose> = {}): Partial<Pose> => {
  const w = Math.sin(t / 5);
  return {
    x, y: y + w * 6, scale: s, spin: 72 * dir, yaw: 0.55 * dir, facing: dir, look: 0.6 * dir,
    armL: { a: 168, b: 6 }, armR: { a: 172, b: -6 },
    legL: { a: 6 + w * 4, b: 8 }, legR: { a: -4 - w * 4, b: 14 },
    sway: 14, ...extra,
  };
};
/** Rising upright: arms up, legs dangling, a little bob. */
export const risePose = (x: number, y: number, t: number, s = 0.8, extra: Partial<Pose> = {}): Partial<Pose> => {
  const w = Math.sin(t / 6);
  return {
    x, y: y + w * 5, scale: s, armL: { a: 150, b: 14 }, armR: { a: 150, b: 14 },
    legL: { a: 10 + w * 4, b: 18 }, legR: { a: -10 - w * 4, b: 22 }, sway: 10, ...extra,
  };
};
/** Floating in place, calm: arms out a little, toes pointed. */
export const hoverPose = (x: number, y: number, t: number, s = 0.8, extra: Partial<Pose> = {}): Partial<Pose> => {
  const w = Math.sin(t / 8);
  return {
    x, y: y + w * 8, scale: s, armL: { a: 38, b: -12 }, armR: { a: 38, b: -12 },
    legL: { a: 8, b: 16 }, legR: { a: -6, b: 22 }, sway: 6, ...extra,
  };
};

// ---------------------------------------------------------------- skies
const SKIES: Record<string, [string, string, string]> = {
  night: ['#060918', '#131C3E', '#2B3566'],
  dusk: ['#24173F', '#7B3A68', '#F0905E'],
  day: ['#3D76B5', '#82B4DC', '#F3D9B4'],
  noon: ['#4A86C6', '#93C2E6', '#E8EEF0'],
  high: ['#07102E', '#1E4485', '#6F9CD2'],
  storm: ['#04050A', '#0E1220', '#1C2234'],
  dark: ['#0A0716', '#1A1030', '#3A1E3E'],
};
export const Sky: React.FC<{ id: string; mode: keyof typeof SKIES | string; y0?: number; y1?: number; stars?: number; t?: number; moon?: [number, number, number] }> = ({
  id, mode, y0 = 0, y1 = 1080, stars = 0, t = 0, moon,
}) => {
  const c = SKIES[mode] ?? SKIES.dusk;
  return (
    <g>
      <defs>
        <linearGradient id={`sky_${id}`} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}>
          <stop offset="0" stopColor={c[0]} />
          <stop offset="0.55" stopColor={c[1]} />
          <stop offset="1" stopColor={c[2]} />
        </linearGradient>
      </defs>
      <rect x={-3000} y={-3000} width={8000} height={7000} fill={c[2]} />
      <rect x={-3000} y={y0 - 3000} width={8000} height={3000} fill={c[0]} />
      <rect x={-3000} y={y0} width={8000} height={y1 - y0} fill={`url(#sky_${id})`} />
      {stars ? <Stars seed={3} x0={-400} y0={-400} w={2720} h={1100} t={t} n={stars} o={0.8} /> : null}
      {moon ? <Moon x={moon[0]} y={moon[1]} r={moon[2]} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- clouds
export const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number; lit?: string; body?: string; shade?: string; seed?: number }> = ({
  x, y, s = 1, o = 1, lit = '#F6E7EE', body = '#C4B2D2', shade = '#7F6F9E', seed = 1,
}) => {
  const k = (i: number) => 0.8 + rnd(seed, i) * 0.4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={34} rx={250} ry={52} fill={shade} />
      <circle cx={-160} cy={10} r={78 * k(1)} fill={body} />
      <circle cx={-60} cy={-28} r={112 * k(2)} fill={body} />
      <circle cx={65} cy={-46} r={122 * k(3)} fill={body} />
      <circle cx={175} cy={4} r={84 * k(4)} fill={body} />
      <rect x={-230} y={10} width={470} height={60} rx={30} fill={body} />
      <circle cx={-80} cy={-52} r={62 * k(2)} fill={lit} opacity={0.75} />
      <circle cx={40} cy={-86} r={70 * k(3)} fill={lit} opacity={0.75} />
      <circle cx={-175} cy={-14} r={40} fill={lit} opacity={0.6} />
    </g>
  );
};
export const CLOUD_TONES = {
  night: { lit: '#9FA9CF', body: '#5A6493', shade: '#323A63' },
  dusk: { lit: '#FBE2D6', body: '#D59AA8', shade: '#8A5E86' },
  day: { lit: '#FFFFFF', body: '#E6EEF6', shade: '#AFC0D6' },
  storm: { lit: '#4B5370', body: '#2A3048', shade: '#171B2C' },
};
/** A drifting row of clouds. speed is world units per frame (negative drifts left). */
export const CloudRow: React.FC<{ t: number; y: number; n?: number; s?: number; seed?: number; speed?: number; tone?: keyof typeof CLOUD_TONES; o?: number; span?: number }> = ({
  t, y, n = 6, s = 1, seed = 1, speed = -1, tone = 'dusk', o = 1, span = 3200,
}) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const base = -800 + (i * span) / n + rnd(seed, i) * 160;
      const x = ((((base + t * speed + 800) % span) + span) % span) - 800;
      return <Cloud key={i} x={x} y={y + (rnd(seed, i + 9) - 0.5) * 90} s={s * (0.75 + rnd(seed, i + 3) * 0.5)} o={o} seed={seed + i} {...CLOUD_TONES[tone]} />;
    })}
  </g>
);
/** A sea of cloud tops seen from above, filling the frame below y. */
export const CloudSea: React.FC<{ t: number; y: number; tone?: keyof typeof CLOUD_TONES; speed?: number }> = ({ t, y, tone = 'night', speed = -0.6 }) => {
  const c = CLOUD_TONES[tone];
  return (
    <g>
      <rect x={-3000} y={y + 40} width={8000} height={3000} fill={c.shade} />
      <CloudRow t={t} y={y + 160} n={9} s={1.3} seed={7} speed={speed * 0.7} tone={tone} />
      <CloudRow t={t} y={y + 40} n={8} s={1.0} seed={4} speed={speed} tone={tone} />
      <rect x={-3000} y={y + 260} width={8000} height={3000} fill={c.shade} opacity={0.6} />
    </g>
  );
};

// ---------------------------------------------------------------- Kerala outdoors
export const Palm: React.FC<{ x: number; y: number; s?: number; t?: number; lean?: number; dark?: boolean; nuts?: boolean }> = ({
  x, y, s = 1, t = 0, lean = 60, dark = false, nuts = true,
}) => {
  const h = 620;
  const cx = lean;
  const cy = -h;
  const sway = Math.sin(t / 22 + x / 300) * 4;
  const trunk = dark ? '#1A1426' : '#6B4A34';
  const frond = dark ? '#121A1C' : '#2F6A3A';
  const frond2 = dark ? '#0D1414' : '#24542E';
  const angles = [-170, -140, -110, -70, -40, -10, 20, 200];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -18 0 Q ${lean * 0.3} ${-h * 0.5} ${cx - 10} ${cy} L ${cx + 10} ${cy} Q ${lean * 0.3 + 24} ${-h * 0.5} 18 0 Z`} fill={trunk} stroke="#1A1230" strokeWidth={5} />
      {Array.from({ length: 12 }).map((_, i) => {
        const k = (i + 1) / 13;
        const px = lean * 0.3 * 2 * k * (1 - k) + (cx) * k * k;
        return <line key={i} x1={px - 16} y1={-h * k} x2={px + 16} y2={-h * k + 4} stroke="#1A1230" strokeWidth={3} opacity={0.35} />;
      })}
      {angles.map((a0, i) => {
        const a = ((a0 + sway * (i % 2 ? 1 : -1)) * Math.PI) / 180;
        const L = 300 + (i % 3) * 30;
        const ex = cx + Math.cos(a) * L;
        const ey = cy + Math.sin(a) * L * 0.55 + 120;
        const mx = cx + Math.cos(a) * L * 0.5;
        const my = cy + Math.sin(a) * L * 0.4 - 70;
        return (
          <g key={i}>
            <path d={`M ${cx} ${cy} Q ${mx} ${my} ${ex} ${ey}`} stroke={i % 2 ? frond : frond2} strokeWidth={26} fill="none" strokeLinecap="round" />
            <path d={`M ${cx} ${cy} Q ${mx} ${my} ${ex} ${ey}`} stroke={i % 2 ? frond : frond2} strokeWidth={46} fill="none" strokeLinecap="round" strokeDasharray="6 22" />
          </g>
        );
      })}
      {nuts ? (
        <g>
          <circle cx={cx - 22} cy={cy + 26} r={24} fill={dark ? '#1C2416' : '#7C8F2C'} stroke="#1A1230" strokeWidth={4} />
          <circle cx={cx + 18} cy={cy + 30} r={24} fill={dark ? '#1C2416' : '#8FA234'} stroke="#1A1230" strokeWidth={4} />
          <circle cx={cx - 2} cy={cy + 50} r={22} fill={dark ? '#1C2416' : '#6E8226'} stroke="#1A1230" strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
};

export const MangoTree: React.FC<{ x: number; y: number; s?: number; t?: number; dark?: boolean }> = ({ x, y, s = 1, t = 0, dark = false }) => {
  const g1 = dark ? '#101A14' : '#2E5B30';
  const g2 = dark ? '#17231B' : '#3C7340';
  const sw = Math.sin(t / 30) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -40 0 L -22 -260 L -90 -360 L -70 -370 L -6 -290 L 30 -380 L 50 -372 L 20 -250 L 40 0 Z" fill={dark ? '#1A1426' : '#5A3E2C'} stroke="#1A1230" strokeWidth={5} />
      <g transform={`translate(${sw} 0)`}>
        {[[-180, -380, 150], [0, -470, 190], [170, -390, 150], [-90, -540, 140], [100, -560, 130], [0, -360, 140]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? g1 : g2} stroke="#1A1230" strokeWidth={5} />
        ))}
        {[[-60, -560, 70], [80, -600, 60], [-170, -440, 60]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={dark ? '#1E2C22' : '#5C9A50'} opacity={0.6} />
        ))}
      </g>
    </g>
  );
};

/** A Kerala house: cream walls, a steep red-tile roof with a deep overhang, wooden door, windows. */
export const KHouse: React.FC<{ x: number; y: number; s?: number; lit?: number; night?: boolean; door?: number }> = ({ x, y, s = 1, lit = 0, night = false, door = 0 }) => {
  const wall = night ? '#4A4058' : '#E6D3AE';
  const wallS = night ? '#342C42' : '#C2AC86';
  const roof = night ? '#4A2224' : '#A2432C';
  const roofD = night ? '#2E1517' : '#7A2E1E';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={8} rx={560} ry={26} fill="#000" opacity={0.3} />
      <rect x={-470} y={-300} width={940} height={300} fill={wall} stroke="#1A1230" strokeWidth={6} />
      <rect x={-470} y={-300} width={940} height={40} fill={wallS} />
      <rect x={-480} y={-20} width={960} height={24} fill={wallS} stroke="#1A1230" strokeWidth={5} />
      {/* windows */}
      {[-330, 230].map((wx, i) => (
        <g key={i}>
          <rect x={wx} y={-220} width={110} height={120} fill={lit ? '#FFC867' : '#3A3446'} stroke="#1A1230" strokeWidth={6} />
          <line x1={wx + 55} y1={-220} x2={wx + 55} y2={-100} stroke="#1A1230" strokeWidth={5} />
          {[0, 1, 2, 3].map((k) => <line key={k} x1={wx + 8 + k * 26} y1={-220} x2={wx + 8 + k * 26} y2={-100} stroke="#5A3E2C" strokeWidth={4} />)}
          {lit ? <Glow x={wx + 55} y={-160} r={140} kind="warm" o={0.5 * lit} /> : null}
        </g>
      ))}
      {/* door */}
      <rect x={-70} y={-240} width={140} height={240} fill="#2A1A14" stroke="#1A1230" strokeWidth={6} />
      <g transform={`translate(-70 0) scale(${1 - door * 0.8} 1)`}>
        <rect x={0} y={-240} width={140} height={240} fill="#6B4430" stroke="#1A1230" strokeWidth={6} />
        <rect x={16} y={-220} width={108} height={90} fill="none" stroke="#4A2E20" strokeWidth={5} />
        <rect x={16} y={-110} width={108} height={90} fill="none" stroke="#4A2E20" strokeWidth={5} />
      </g>
      {door > 0 && lit ? <Glow x={0} y={-120} r={200} kind="warm" o={0.4 * door} /> : null}
      {/* roof */}
      <path d="M -600 -280 L -360 -470 L 360 -470 L 600 -280 Z" fill={roof} stroke="#1A1230" strokeWidth={7} strokeLinejoin="round" />
      {Array.from({ length: 6 }).map((_, i) => {
        const k = (i + 1) / 7;
        const yy = -470 + 190 * k;
        const xx = 360 + 240 * k;
        return <line key={i} x1={-xx} y1={yy} x2={xx} y2={yy} stroke={roofD} strokeWidth={5} />;
      })}
      <path d="M -360 -470 L -300 -540 L 300 -540 L 360 -470 Z" fill={roofD} stroke="#1A1230" strokeWidth={6} />
      <path d="M -300 -540 L -330 -575 M 300 -540 L 330 -575" stroke="#1A1230" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

/** Grass ground band from y down, with a few tufts. */
export const Grass: React.FC<{ y: number; night?: boolean; c?: string }> = ({ y, night = false, c }) => (
  <g>
    <rect x={-3000} y={y} width={8000} height={3000} fill={c ?? (night ? '#141C1A' : '#4C7A3A')} />
    <rect x={-3000} y={y} width={8000} height={16} fill={night ? '#1C2622' : '#5E8F45'} />
    {Array.from({ length: 30 }).map((_, i) => (
      <path key={i} d={`M ${-200 + i * 80} ${y + 40 + (i % 3) * 30} l 8 -22 l 6 22 l 8 -18 l 4 18`} stroke={night ? '#0E1412' : '#365C28'} strokeWidth={4} fill="none" />
    ))}
  </g>
);

/** Water band: the backwaters or a flood. level is its top. */
export const Water: React.FC<{ t: number; y: number; night?: boolean; muddy?: boolean; rough?: number }> = ({ t, y, night = false, muddy = false, rough = 0 }) => {
  const base = muddy ? (night ? '#2A2A26' : '#7A6A4A') : night ? '#0E1A2E' : '#3E7C8A';
  const hi = muddy ? (night ? '#4A4A40' : '#A08C62') : night ? '#2A4466' : '#8CC4C8';
  const amp = 6 + rough * 18;
  const wave = (yy: number, ph: number) => {
    let d = `M -2000 ${yy}`;
    for (let x = -2000; x <= 4000; x += 80) d += ` Q ${x + 40} ${yy - amp * Math.sin(t / 8 + x / 140 + ph)} ${x + 80} ${yy}`;
    return d;
  };
  return (
    <g>
      <rect x={-3000} y={y} width={8000} height={3000} fill={base} />
      <path d={`${wave(y, 0)} L 4000 ${y + 3000} L -2000 ${y + 3000} Z`} fill={base} />
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={wave(y + 30 + k * 60, k * 1.7)} stroke={hi} strokeWidth={4 - k * 0.5} fill="none" opacity={0.6 - k * 0.08} />
      ))}
    </g>
  );
};

/** A country boat (vallam) with two people looking up. */
export const Boat: React.FC<{ x: number; y: number; s?: number; t: number; look?: number; tossing?: number }> = ({ x, y, s = 1, t, look = 0, tossing = 0 }) => {
  const rock = Math.sin(t / 9) * (3 + tossing * 12);
  return (
    <g transform={`translate(${x} ${y + Math.sin(t / 7) * (3 + tossing * 10)}) rotate(${rock}) scale(${s})`}>
      {[-60, 60].map((px, i) => (
        <g key={i}>
          <line x1={px} y1={-40} x2={px} y2={-110} stroke="#1A1230" strokeWidth={10} strokeLinecap="round" />
          <circle cx={px + look * 6} cy={-138 - look * 8} r={26} fill={i ? '#E8C8A0' : '#D8B088'} stroke="#1A1230" strokeWidth={5} />
          <line x1={px} y1={-90} x2={px + 34} y2={-60 - look * 40} stroke="#1A1230" strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
      <path d="M -230 -50 Q -260 -70 -250 -90 L -190 -40 L 190 -40 L 250 -90 Q 260 -70 230 -50 Q 120 10 0 10 Q -120 10 -230 -50 Z" fill="#4A2E1E" stroke="#1A1230" strokeWidth={6} />
      <path d="M -190 -40 L 190 -40" stroke="#7A4E32" strokeWidth={6} />
    </g>
  );
};

export const TeaHills: React.FC<{ t: number; y: number }> = ({ t, y }) => (
  <g>
    {[
      { y: y - 180, c: '#3E6E5A', amp: 120, ph: 0.4, rows: '#335E4C' },
      { y: y - 60, c: '#4E8A4E', amp: 140, ph: 1.6, rows: '#3E7340' },
      { y: y + 80, c: '#5E9E4A', amp: 120, ph: 2.6, rows: '#4C8A3C' },
    ].map((h, i) => {
      let d = `M -2000 ${h.y + 2000} L -2000 ${h.y}`;
      for (let x = -2000; x <= 4000; x += 100) d += ` L ${x} ${h.y - h.amp * Math.max(0, Math.sin(x / 520 + h.ph)) }`;
      d += ` L 4000 ${h.y + 2000} Z`;
      return (
        <g key={i}>
          <path d={d} fill={h.c} stroke="#1A1230" strokeWidth={4} />
          {Array.from({ length: 6 }).map((_, k) => {
            let r = '';
            for (let x = -2000; x <= 4000; x += 100) r += `${r ? ' L' : 'M'} ${x} ${h.y + 30 + k * 34 - h.amp * Math.max(0, Math.sin(x / 520 + h.ph)) * (1 - k * 0.12)}`;
            return <path key={k} d={r} stroke={h.rows} strokeWidth={8} fill="none" strokeDasharray="22 10" />;
          })}
        </g>
      );
    })}
    <rect x={-3000} y={y - 260} width={8000} height={180} fill="#F3E4D6" opacity={0.18 + 0.04 * Math.sin(t / 30)} />
  </g>
);

/** A small two-storey concrete building with a flat roof (the flood shot). */
export const FlatBuilding: React.FC<{ x: number; y: number; s?: number; night?: boolean }> = ({ x, y, s = 1, night = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-420} width={440} height={420} fill={night ? '#3A3A4A' : '#B8B0A0'} stroke="#1A1230" strokeWidth={6} />
    <rect x={-236} y={-436} width={472} height={26} fill={night ? '#2A2A38' : '#9A9282'} stroke="#1A1230" strokeWidth={5} />
    {[[-160, -360], [40, -360], [-160, -200], [40, -200]].map(([wx, wy], i) => (
      <rect key={i} x={wx} y={wy} width={120} height={100} fill="#15151F" stroke="#1A1230" strokeWidth={5} />
    ))}
  </g>
);

// ---------------------------------------------------------------- vehicles
/** An airliner seen head-on, landing lights blazing. s grows as it closes in. */
export const PlaneFront: React.FC<{ x: number; y: number; s: number; t: number; bank?: number }> = ({ x, y, s, t, bank = 0 }) => {
  const blink = Math.floor(t / 12) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${bank}) scale(${s})`}>
      <path d="M -30 -40 L -12 -230 L 12 -230 L 30 -40 Z" fill="#9AA2B4" stroke="#1A1230" strokeWidth={5} />
      <path d="M -560 -10 L -60 20 L 60 20 L 560 -10 L 560 6 L 60 50 L -60 50 L -560 6 Z" fill="#B8BFCC" stroke="#1A1230" strokeWidth={5} />
      <path d="M -180 -60 L -30 -50 L 30 -50 L 180 -60 L 180 -50 L 30 -36 L -30 -36 L -180 -50 Z" fill="#9AA2B4" stroke="#1A1230" strokeWidth={4} transform="translate(0 -140)" />
      {[-220, 220].map((ex, i) => (
        <g key={i}>
          <circle cx={ex} cy={74} r={46} fill="#7A8296" stroke="#1A1230" strokeWidth={5} />
          <circle cx={ex} cy={74} r={30} fill="#1A1E2A" />
          <circle cx={ex} cy={74} r={10} fill="#5A6070" />
        </g>
      ))}
      <circle cx={0} cy={0} r={80} fill="#C9CED8" stroke="#1A1230" strokeWidth={6} />
      <path d="M -52 -22 Q 0 -50 52 -22 L 46 -6 Q 0 -26 -46 -6 Z" fill="#1A2030" />
      <circle cx={-560} cy={0} r={8} fill="#FF4040" opacity={blink ? 1 : 0.3} />
      <circle cx={560} cy={0} r={8} fill="#40FF80" opacity={blink ? 1 : 0.3} />
      {[-110, 110].map((lx, i) => (
        <g key={i}>
          <circle cx={lx} cy={34} r={16} fill="#FFFBE8" />
          <Glow x={lx} y={34} r={220} kind="warm" o={0.9} />
        </g>
      ))}
      <Glow x={0} y={30} r={520} kind="warm" o={0.35} />
    </g>
  );
};

/** A black car, side view, facing left. */
export const BlackCar: React.FC<{ x: number; y: number; s?: number; t?: number; lights?: number }> = ({ x, y, s = 1, t = 0, lights = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={330} ry={22} fill="#000" opacity={0.35} />
    <path d="M -320 -30 Q -320 -90 -260 -96 L -170 -100 L -100 -170 L 140 -170 L 220 -100 L 300 -92 Q 330 -88 330 -40 L 330 -10 L -320 -10 Z" fill="#14141C" stroke="#05050A" strokeWidth={6} />
    <path d="M -80 -156 L 10 -156 L 10 -104 L -140 -104 Z" fill="#2E3446" />
    <path d="M 26 -156 L 130 -156 L 196 -104 L 26 -104 Z" fill="#2E3446" />
    <line x1={-300} y1={-60} x2={320} y2={-60} stroke="#3A3A4A" strokeWidth={3} />
    {[-200, 200].map((wx, i) => (
      <g key={i} transform={`translate(${wx} -8) rotate(${-t * 8})`}>
        <circle r={52} fill="#0A0A10" stroke="#05050A" strokeWidth={5} />
        <circle r={24} fill="#5A5E6A" />
        <line x1={-24} y1={0} x2={24} y2={0} stroke="#2A2E3A" strokeWidth={5} />
      </g>
    ))}
    <rect x={-322} y={-70} width={20} height={16} rx={4} fill="#FFF6D8" opacity={0.4 + lights * 0.6} />
    {lights ? <Glow x={-330} y={-62} r={160} kind="warm" o={0.6 * lights} /> : null}
  </g>
);

// ---------------------------------------------------------------- power + weather + fx
/** The lift-off gust: rings flattening out from under the feet and streaks shooting down. t0 is when it fires. */
export const Gust: React.FC<{ x: number; y: number; t: number; s?: number; color?: string }> = ({ x, y, t, s = 1, color = '#BFEFFF' }) => {
  if (t < 0 || t > 40) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 5, 10].map((d, i) => {
        const k = clamp((t - d) / 22);
        if (k <= 0) return null;
        return <ellipse key={i} cx={0} cy={0} rx={60 + k * 360} ry={14 + k * 60} fill="none" stroke={color} strokeWidth={10 * (1 - k) + 2} opacity={(1 - k) * 0.9} />;
      })}
      {Array.from({ length: 10 }).map((_, i) => {
        const k = clamp((t - i * 1.2) / 18);
        const ang = -60 + i * 13;
        const r0 = 40 + k * 120;
        const r1 = r0 + 80 * (1 - k);
        const a = (ang * Math.PI) / 180;
        return k > 0 && k < 1 ? (
          <line key={i} x1={Math.sin(a) * r0} y1={Math.cos(a) * r0 * 0.4} x2={Math.sin(a) * r1} y2={Math.cos(a) * r1 * 0.4} stroke={color} strokeWidth={6} strokeLinecap="round" opacity={0.8 * (1 - k)} />
        ) : null;
      })}
      <Glow x={0} y={-40} r={220} kind="cool" o={0.5 * (1 - clamp(t / 30))} />
    </g>
  );
};

export const SpeedLines: React.FC<{ t: number; dir?: 1 | -1; o?: number; n?: number; speed?: number; seed?: number; vertical?: boolean }> = ({ t, dir = 1, o = 0.5, n = 26, speed = 60, seed = 5, vertical = false }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const len = 160 + rnd(seed, i) * 340;
      const span = 2600;
      const p = (((rnd(seed, i + 40) * span + t * speed) % span) + span) % span;
      const q = rnd(seed, i + 80) * 1200 - 60;
      if (vertical) return <line key={i} x1={q * 1.6} y1={-300 + p} x2={q * 1.6} y2={-300 + p - len} stroke="#F4F8FF" strokeWidth={3 + (i % 3)} strokeLinecap="round" />;
      const x = dir === 1 ? 2200 - p : -300 + p;
      return <line key={i} x1={x} y1={q} x2={x + len * dir} y2={q} stroke="#F4F8FF" strokeWidth={3 + (i % 3)} strokeLinecap="round" />;
    })}
  </g>
);

export const Rain: React.FC<{ t: number; o?: number; n?: number; slant?: number; seed?: number }> = ({ t, o = 0.55, n = 140, slant = 0.28, seed = 11 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const x = rnd(seed, i) * 2600 - 340;
      const sp = 50 + rnd(seed, i + 7) * 30;
      const y = ((rnd(seed, i + 3) * 1500 + t * sp) % 1500) - 200;
      const L = 50 + rnd(seed, i + 5) * 50;
      return <line key={i} x1={x + y * slant} y1={y} x2={x + (y + L) * slant} y2={y + L} stroke="#BFD4F0" strokeWidth={2.5} strokeLinecap="round" />;
    })}
  </g>
);

/** A lightning bolt that strikes at t0 and fades over ~6 frames. */
export const Bolt: React.FC<{ x: number; y: number; t: number; t0: number; seed?: number; h?: number }> = ({ x, y, t, t0, seed = 2, h = 700 }) => {
  const k = t - t0;
  if (k < 0 || k > 7) return null;
  const o = k < 2 ? 1 : 1 - (k - 2) / 5;
  let d = `M ${x} ${y}`;
  let cx = x;
  for (let i = 1; i <= 9; i++) {
    cx += (rnd(seed, i) - 0.5) * 120;
    d += ` L ${cx} ${y + (h * i) / 9}`;
  }
  return (
    <g opacity={o}>
      <path d={d} stroke="#9FD0FF" strokeWidth={22} fill="none" opacity={0.4} strokeLinejoin="round" />
      <path d={d} stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinejoin="round" />
      <Glow x={x} y={y + h * 0.4} r={600} kind="cool" o={0.6} />
    </g>
  );
};

/** Full-frame white wash for a lightning flash, peaking at t0. */
export const Whiteout: React.FC<{ t: number; t0: number; len?: number; o?: number }> = ({ t, t0, len = 12, o = 0.9 }) => {
  const k = t - t0;
  if (k < 0 || k > len) return null;
  return <rect x={-3000} y={-3000} width={8000} height={8000} fill="#EEF4FF" opacity={o * (1 - k / len)} />;
};

/** Vision closing: a black frame with a shrinking hole. */
export const Tunnel: React.FC<{ id: string; x: number; y: number; r: number; o?: number }> = ({ id, x, y, r, o = 1 }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id={`tun_${id}`} gradientUnits="userSpaceOnUse" cx={x} cy={y} r={Math.max(r, 1) * 1.4}>
        <stop offset="0" stopColor="#000" stopOpacity={0} />
        <stop offset="0.6" stopColor="#000" stopOpacity={0.2} />
        <stop offset="1" stopColor="#000" stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill={`url(#tun_${id})`} />
  </g>
);

export const Drops: React.FC<{ x: number; y: number; t: number; n?: number; w?: number; color?: string; seed?: number }> = ({ x, y, t, n = 10, w = 120, color = '#9CD4FF', seed = 4 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const ph = (t * 2.4 + rnd(seed, i) * 60) % 60;
      const dx = (rnd(seed, i + 9) - 0.5) * w;
      return <path key={i} d={`M ${x + dx} ${y + ph * 3} q 6 10 0 14 q -6 -4 0 -14 z`} fill={color} opacity={1 - ph / 60} />;
    })}
  </g>
);

/** Breath puffs from a mouth point, drifting left. */
export const Breath: React.FC<{ x: number; y: number; t: number; dir?: number }> = ({ x, y, t, dir = -1 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const k = ((t + i * 14) % 42) / 42;
      return <circle key={i} cx={x + dir * k * 120} cy={y - k * 30} r={10 + k * 30} fill="#EAF2FF" opacity={0.45 * (1 - k)} />;
    })}
  </g>
);

/** Frost specks over a figure's torso. */
export const Frost: React.FC<{ x: number; y: number; s: number; o: number; seed?: number }> = ({ x, y, s, o, seed = 8 }) => (
  <g opacity={o}>
    {Array.from({ length: 34 }).map((_, i) => (
      <path key={i} d={`M ${x + (rnd(seed, i) - 0.5) * 120 * s} ${y - rnd(seed, i + 3) * 140 * s} l 5 0 l -2.5 -5 z`} fill="#F2FBFF" transform={`rotate(${rnd(seed, i + 5) * 90} ${x} ${y})`} />
    ))}
    {Array.from({ length: 10 }).map((_, i) => (
      <circle key={`c${i}`} cx={x + (rnd(seed, i + 30) - 0.5) * 110 * s} cy={y - rnd(seed, i + 33) * 130 * s} r={5 * s} fill="#E6F6FF" opacity={0.8} />
    ))}
  </g>
);

/** Swimming goggles over a figure's eyes (Mo's old ones). */
export const Goggles: React.FC<{ pose: Partial<Pose>; o?: number }> = ({ pose, o = 1 }) => {
  const p = full(pose);
  const j = joints(p);
  const hw = toWorld(p, j.head);
  const s = p.scale;
  const yawX = p.yaw * 14;
  return (
    <g transform={`translate(${hw.x} ${hw.y}) rotate(${p.spin + p.tilt}) scale(${s})`} opacity={o}>
      <path d="M -64 -8 Q 0 -18 64 -8" stroke="#1F6FB0" strokeWidth={9} fill="none" />
      {[-22, 22].map((ex, i) => (
        <g key={i}>
          <ellipse cx={ex + yawX} cy={-4} rx={21} ry={16} fill="#7FD0FF" opacity={0.55} stroke="#1A5A92" strokeWidth={6} />
          <ellipse cx={ex + yawX - 6} cy={-9} rx={6} ry={4} fill="#FFFFFF" opacity={0.7} />
        </g>
      ))}
      <line x1={-1 + yawX} y1={-4} x2={1 + yawX} y2={-4} stroke="#1A5A92" strokeWidth={6} />
    </g>
  );
};

/** Hands tinted blue (oxygen running out). */
export const BlueHands: React.FC<{ pose: Partial<Pose>; o: number }> = ({ pose, o }) => {
  const p = full(pose);
  const j = joints(p);
  return (
    <g opacity={o}>
      {[j.armL.end, j.armR.end].map((e, i) => {
        const w = toWorld(p, e);
        return <circle key={i} cx={w.x} cy={w.y} r={24 * p.scale} fill="#5A8CFF" opacity={0.7} />;
      })}
    </g>
  );
};

/** The world-point of a figure's head, for props and labels. */
export const headAt = (pose: Partial<Pose>) => {
  const p = full(pose);
  return toWorld(p, joints(p).head);
};
export const handAt = (pose: Partial<Pose>, side: 'L' | 'R') => {
  const p = full(pose);
  const j = joints(p);
  return toWorld(p, side === 'L' ? j.armL.end : j.armR.end);
};

// ---------------------------------------------------------------- screens
export const Radar: React.FC<{ x: number; y: number; r: number; t: number; blips: { x: number; y: number; c?: string }[]; id: string }> = ({ x, y, r, t, blips, id }) => {
  const ang = (t * 4) % 360;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={`rad_${id}`}>
          <stop offset="0" stopColor="#0E3A22" />
          <stop offset="1" stopColor="#04140C" />
        </radialGradient>
      </defs>
      <circle r={r + 30} fill="#1A1E24" stroke="#05080A" strokeWidth={8} />
      <circle r={r} fill={`url(#rad_${id})`} />
      {[0.25, 0.5, 0.75, 1].map((k) => <circle key={k} r={r * k} fill="none" stroke="#2FCB6A" strokeWidth={2} opacity={0.35} />)}
      <line x1={-r} y1={0} x2={r} y2={0} stroke="#2FCB6A" strokeWidth={2} opacity={0.3} />
      <line x1={0} y1={-r} x2={0} y2={r} stroke="#2FCB6A" strokeWidth={2} opacity={0.3} />
      {/* coastline */}
      <path d={`M ${-r * 0.1} ${-r} Q ${r * 0.05} ${-r * 0.4} ${-r * 0.15} 0 Q ${-r * 0.3} ${r * 0.5} ${-r * 0.2} ${r}`} stroke="#2FCB6A" strokeWidth={3} fill="none" opacity={0.55} />
      <g transform={`rotate(${ang})`}>
        <path d={`M 0 0 L ${r} 0 A ${r} ${r} 0 0 0 ${r * Math.cos(-0.5)} ${r * Math.sin(-0.5)} Z`} fill="#3CFF88" opacity={0.25} />
        <line x1={0} y1={0} x2={r} y2={0} stroke="#7CFFB0" strokeWidth={4} />
      </g>
      {blips.map((b, i) => {
        const ba = ((Math.atan2(b.y, b.x) * 180) / Math.PI + 360) % 360;
        const since = (ang - ba + 360) % 360;
        const o = 0.35 + 0.65 * (1 - since / 360);
        return (
          <g key={i} opacity={o}>
            <circle cx={b.x} cy={b.y} r={14} fill={b.c ?? '#7CFFB0'} />
            <circle cx={b.x} cy={b.y} r={30} fill="none" stroke={b.c ?? '#7CFFB0'} strokeWidth={3} opacity={0.6} />
          </g>
        );
      })}
    </g>
  );
};

/** A flat-screen TV on a stand; children draw inside the 760x430 screen at (0,0). */
export const TV: React.FC<{ x: number; y: number; s?: number; id: string; children?: React.ReactNode }> = ({ x, y, s = 1, id, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <clipPath id={`tv_${id}`}>
        <rect x={0} y={0} width={760} height={430} />
      </clipPath>
    </defs>
    <rect x={-24} y={-24} width={808} height={478} rx={14} fill="#0C0C12" stroke="#2A2A36" strokeWidth={4} />
    <rect x={0} y={0} width={760} height={430} fill="#101828" />
    <g clipPath={`url(#tv_${id})`}>{children}</g>
    <rect x={330} y={454} width={100} height={30} fill="#1A1A22" />
    <rect x={240} y={480} width={280} height={16} rx={6} fill="#1A1A22" />
  </g>
);

/** News lower-third inside a TV screen. */
export const NewsBar: React.FC<{ t: number; text: string }> = ({ t, text }) => (
  <g>
    <rect x={0} y={340} width={760} height={90} fill="#B3202A" />
    <rect x={0} y={340} width={150} height={90} fill="#F6EFE3" />
    <text x={75} y={398} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#B3202A">LIVE</text>
    <text x={170 - ((t * 3) % 300)} y={398} fontFamily={FONT.ui} fontSize={34} fill="#FFFFFF">{text}</text>
  </g>
);

// ---------------------------------------------------------------- schematic icons
export const Elephant: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = SCH.line }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={c} strokeWidth={4} strokeLinejoin="round">
    <path d="M -30 -8 Q -34 -50 -6 -52 L 22 -52 Q 38 -50 40 -34 L 40 -8 Z" fill={c} opacity={0.35} stroke="none" />
    <path d="M -30 0 L -30 -24 Q -34 -50 -6 -52 L 22 -52 Q 38 -50 40 -34 Q 54 -30 52 -8 L 48 6 M 40 -34 L 40 0 M -16 -10 L -16 0 M 20 -10 L 20 0" />
    <circle cx={28} cy={-40} r={3} fill={c} />
  </g>
);
export const Goose: React.FC<{ x: number; y: number; s?: number; c?: string; flip?: boolean }> = ({ x, y, s = 1, c = SCH.line, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M -40 0 Q -10 -14 20 -4 L 40 -26 L 52 -24 L 30 2 Q 6 16 -40 0 Z" />
    <path d="M -14 -4 L -40 -40 L 4 -8" />
  </g>
);
export const Hummingbird: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const flap = Math.sin(t * 2.2) * 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={SCH.line} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={60} ry={24} transform="rotate(-20)" />
      <circle cx={58} cy={-34} r={20} />
      <line x1={76} y1={-38} x2={160} y2={-52} />
      <path d="M -54 18 L -110 50 L -96 20 L -120 24" />
      <path d={`M -6 -10 Q -40 ${-80 - flap} -110 ${-90 - flap}`} />
      <path d={`M 10 -14 Q -10 ${-70 - flap} -70 ${-110 - flap}`} />
    </g>
  );
};
export const Heart: React.FC<{ x: number; y: number; s?: number; t: number; rate?: number }> = ({ x, y, s = 1, t, rate = 1 }) => {
  const beat = 1 + 0.18 * Math.max(0, Math.sin(t * rate * 1.3));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * beat})`}>
      <path d="M 0 30 C -60 -10 -50 -60 -18 -60 C 0 -60 0 -40 0 -36 C 0 -40 0 -60 18 -60 C 50 -60 60 -10 0 30 Z" fill={SCH.live} stroke={SCH.glow} strokeWidth={4} />
    </g>
  );
};

export const SchHead: React.FC<{ text: string; t: number }> = ({ text, t }) => (
  <text x={160} y={150} fontFamily={FONT.title} fontWeight={700} fontSize={50} fill={SCH.dim} opacity={clamp(t / 6)}>{text}</text>
);
export const Big: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; t?: number; anchor?: 'start' | 'middle' | 'end' }> = ({
  x, y, text, size = 100, color = SCH.line, t = 99, anchor = 'middle',
}) => {
  const k = clamp(t / 7);
  return (
    <text x={x} y={y + (1 - k) * 20} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} opacity={k}>
      {text}
    </text>
  );
};
/** The genre's "That's real." stamp, in Malayalam. */
export const Real: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t < 0) return null;
  const k = clamp(t / 6);
  return (
    <g transform={`translate(${x} ${y}) rotate(-6) scale(${1.4 - 0.4 * k})`} opacity={k}>
      <rect x={-210} y={-56} width={420} height={100} rx={14} fill="none" stroke="#7CE08A" strokeWidth={7} />
      <text y={16} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#7CE08A">ഇത് സത്യമാണ്</text>
    </g>
  );
};

export const Fade: React.FC<{ t: number; len: number; n?: number }> = ({ t, len, n = 12 }) =>
  t > len - n ? <rect x={-3000} y={-3000} width={8000} height={8000} fill="#000" opacity={clamp((t - (len - n)) / n)} /> : null;
export const FadeIn: React.FC<{ t: number; n?: number }> = ({ t, n = 10 }) =>
  t < n ? <rect x={-3000} y={-3000} width={8000} height={8000} fill="#000" opacity={1 - clamp(t / n)} /> : null;

export { kf };
export const PIP = LOOKS.ramu;
export const MO = LOOKS.appu;
export const SIS = LOOKS.sis;
export const MOM = LOOKS.mom;
export const SUIT = LOOKS.suit;

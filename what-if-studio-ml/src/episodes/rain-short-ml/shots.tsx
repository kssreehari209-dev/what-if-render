// rain-short-ml: "What if it rained 40 days non-stop in Kerala?" 9:16. Ramu (black hoodie) and Appu, amma.
import React from 'react';
import { faceAt, kf, clamp, ShotProps, FONT, Pose, LOOKS, Glow, rnd, FitSay as Say, FactCard, TimeTag } from '../../engine';
import { Fig, Sky, Palm, KHouse, Water, Boat, Bolt, Drops, handAt } from '../fly-ml/kit';
import { ground, vcam } from '../phone-ml/kit';
import { Umbrella, Well, SteelPlate, Kudam } from '../monsoon-ml/kit';
import { Fish, Ripple } from '../ice-short-ml/kit';
import { VRain, RainRings, PaperBoat, Chappal, Frog, SchoolBag, RiceSack, Cot, Laterite, Bulb, Aug2018 } from './kit';

const RAMU = LOOKS.ramu;
const APPU = LOOKS.appu;
const MOM = LOOKS.mom;
const INK = '#16121E';
type P = Partial<Pose>;
const at = (x: number, g: number, s: number, extra: P = {}): P => ({ x, y: ground(g, s), scale: s, ...extra });
const push = (t: number, len: number, a: number, b: number) => kf(t, [[0, a], [len, b]]);
/** Idle life: breathing, weight shift, head drift. Seeded so two figures never sync. */
const life = (p: P, t: number, seed = 0, amt = 0.5): P => ({
  ...p,
  squash: (p.squash ?? 0) + Math.sin(t / 9 + seed) * 0.018 * amt,
  tilt: (p.tilt ?? 0) + Math.sin(t / 23 + seed * 2) * 2.2 * amt,
  headTilt: (p.headTilt ?? 0) + Math.sin(t / 17 + seed * 3) * 3 * amt,
  sway: 8,
});
const FACT = { big: '414 mm', line: '3 ദിവസത്തെ മഴ · 2018 ആഗസ്റ്റ് 15-17', src: 'ഉറവിടം: കേന്ദ്ര ജല കമ്മീഷൻ (CWC), 2018' };

/** A rain-dark dusk sky band. */
const RainSky: React.FC<{ id: string; y0?: number; y1: number; dim?: number }> = ({ id, y0 = -300, y1, dim = 0.35 }) => (
  <g>
    <Sky id={id} mode="dusk" y0={y0} y1={y1} />
    <rect x={-600} y={y0 - 400} width={2400} height={y1 - y0 + 800} fill="#160E2A" opacity={dim} />
  </g>
);

/** The yard: sky, palms, the tiled house with lit windows, wet mud; `wl` floods it from that line down. */
const Yard: React.FC<{ t: number; id: string; hy: number; hs: number; wl?: number; hx?: number; door?: number }> = ({ t, id, hy, hs, wl, hx = 540, door = 1 }) => (
  <g>
    <RainSky id={id} y1={hy + 40} />
    <Palm x={-20} y={hy + 30} s={1.25} t={t} lean={70} />
    <Palm x={1110} y={hy + 30} s={1.1} t={t + 30} lean={-70} />
    <KHouse x={hx} y={hy} s={hs} lit={1} door={door} />
    <rect x={-600} y={hy} width={2400} height={3000} fill="#4E3C2C" />
    <rect x={-600} y={hy} width={2400} height={3000} fill="#2A2440" opacity={0.25} />
    {wl !== undefined ? <Water t={t} y={wl} muddy /> : null}
  </g>
);

// ------------------------------------------------------------------ A: the hook
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const r = life(at(540, 1455, 1.45, {
    yaw: 0.12, look: kf(t, [[0, 0.1], [36, -0.3]]), headTilt: -14, armR: { a: 150, b: -18 },
    ...faceAt(t, [[0, 'worried']]),
  }), t, 1);
  const h = handAt(r, 'R');
  return (
    <g>
      <g transform={vcam(540, 1020, push(t, len, 1.06, 1))}>
        <RainSky id="a1" y1={1460} />
        <Palm x={-30} y={1460} s={1.4} t={t} lean={80} />
        <Palm x={1120} y={1460} s={1.25} t={t + 30} lean={-80} />
        <KHouse x={540} y={1460} s={1.12} lit={1} door={1} />
        <Laterite x0={-200} x1={1280} y0={1455} y1={1560} />
        <Water t={t} y={1525} muddy rough={0.4} />
        <RainRings t={t} y0={1545} y1={1900} n={16} />
        <Chappal x={kf(t, [[0, 200], [len, 300]])} y={1640} s={0.8} rot={70 + t} />
        <PaperBoat x={kf(t, [[0, 860], [len, 790]])} y={1590 + Math.sin(t / 6) * 6} s={1.2} rot={Math.sin(t / 7) * 6} />
        <Fig look={RAMU} pose={r} rimId="rimR" />
        <Umbrella x={h.x} y={h.y - 170} s={1.45} rot={-8} c="#2A2A40" />
        <Drops x={h.x} y={h.y - 120} t={t} n={14} w={420} />
      </g>
      <VRain t={t} o={0.55} n={170} />
      <text x={540} y={250} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={12} fill="#FFE27A">WHAT IF...</text>
      <Say y={420} text="40 ദിവസം" size={150} color="#FFB15A" />
      <Say y={565} text="തോരാതെ പെയ്താൽ?" size={88} />
    </g>
  );
};

export const A2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#5E4E36" />
    <g transform="translate(0 -200)"><Water t={t} y={200} muddy rough={0.3} /></g>
    <Glow x={540} y={300} r={700} kind="warm" o={0.35} />
    {/* the step from above, Ramu's shoes on its edge */}
    <Laterite x0={-40} x1={1120} y0={-40} y1={420} seed={5} />
    <rect x={-40} y={400} width={1160} height={40} fill="#3A2A20" opacity={0.6} />
    {[400, 640].map((x, i) => (
      <g key={x} transform={`translate(${x} ${300 + i * 10})`}>
        <rect x={-70} y={-360} width={140} height={300} fill="#232327" />
        <ellipse cx={0} cy={-40} rx={90} ry={70} fill="#2E8A8A" stroke={INK} strokeWidth={7} />
        <ellipse cx={-20} cy={-60} rx={30} ry={16} fill="#5CC0B8" opacity={0.6} />
      </g>
    ))}
    <RainRings t={t} y0={520} y1={1900} n={22} s={1.6} />
    <Chappal x={kf(t, [[0, 260], [42, 520]])} y={kf(t, [[0, 980], [42, 900]])} s={2.2} rot={kf(t, [[0, 30], [42, 70]])} />
    <PaperBoat x={kf(t, [[0, 880], [42, 700]])} y={1400 + Math.sin(t / 5) * 10} s={3} rot={Math.sin(t / 6) * 8} />
    <SteelPlate x={kf(t, [[0, 160], [42, 260]])} y={1640} s={1.6} rot={t * 2} />
    <VRain t={t} o={0.4} n={90} seed={3} />
  </g>
);

// ------------------------------------------------------------------ B: day 1, a holiday
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const hop = Math.abs(Math.sin(t / 5)) * 50;
  const r = life(at(330, 1660 - hop, 1.2, {
    yaw: 0.35, look: 0.4, armL: { a: 160, b: 10 }, armR: { a: 150, b: -10 },
    legL: { a: 20 + hop / 3, b: -30 }, legR: { a: -10, b: 20 }, squash: hop > 40 ? -0.04 : 0.02, ...faceAt(t, [[0, 'happy']]),
  }), t, 1);
  const a = life(at(760, 1680, 1.15, {
    yaw: -0.45, look: -0.4, armL: { a: 110, b: -20 }, armR: { a: 90, b: 20 },
    legR: { a: kf(t, [[0, 0], [8, -10], [14, 60], [22, 40], [40, 0], [48, 60]]), b: -10 }, ...faceAt(t, [[0, 'happy']]),
  }), t, 4);
  const m = life(at(540, 1260, 0.62, { yaw: 0, look: -0.2, armL: { a: 30, b: 70 }, armR: { a: 30, b: 70 }, ...faceAt(t, [[0, 'smug']]) }), t, 7);
  return (
    <g>
      <g transform={vcam(540, 1100, push(t, len, 1, 1.05))}>
        <Yard t={t} id="b1" hy={1260} hs={0.92} />
        <Fig look={MOM} pose={m} rimId="rimR" />
        <ellipse cx={560} cy={1770} rx={420} ry={70} fill="#7C8CA8" opacity={0.75} />
        <ellipse cx={300} cy={1480} rx={180} ry={30} fill="#7C8CA8" opacity={0.6} />
        <RainRings t={t} x0={180} x1={940} y0={1730} y1={1810} n={8} />
        <PaperBoat x={470 + Math.sin(t / 8) * 20} y={1770} s={1} rot={-6} />
        <PaperBoat x={700} y={1790} s={0.8} rot={8} c="#F4D27A" />
        <Fig look={APPU} pose={a} rimId="rimL" />
        <Fig look={RAMU} pose={r} rimId="rimR" />
        <Drops x={760} y={1650} t={t} n={10} w={200} />
      </g>
      <VRain t={t} o={0.35} n={110} />
      <TimeTag t={t - 2} label="ദിവസം" value="1" />
    </g>
  );
};

export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const L0 = 40; // the leap lands in the hold after the line
  const lift = kf(t, [[0, 0], [L0, 0], [L0 + 5, -24], [L0 + 12, 300], [L0 + 30, 340], [L0 + 60, 280]]) + (t < L0 ? Math.abs(Math.sin(t / 4)) * 18 : 0);
  const r = at(540, 2020 - lift, 2.1, {
    yaw: 0.1, look: 0.2, headTilt: -10,
    armL: { a: kf(t, [[0, 60], [L0, 70], [L0 + 5, 20], [L0 + 12, 165]]), b: 10 }, armR: { a: kf(t, [[0, 60], [L0, 70], [L0 + 5, 20], [L0 + 10, 175]]), b: -8 },
    legL: { a: kf(t, [[L0, 10], [L0 + 12, 70]]), b: kf(t, [[L0, 0], [L0 + 12, -100]]) }, legR: { a: kf(t, [[L0, -10], [L0 + 12, 40]]), b: kf(t, [[L0, 0], [L0 + 12, -80]]) },
    squash: kf(t, [[L0, 0], [L0 + 5, 0.08], [L0 + 9, -0.08], [L0 + 16, 0]]), ...faceAt(t, [[0, 'smug'], [L0 + 4, 'happy']]),
  });
  // the bag hangs from his hand, swinging, until he lets go at the top of the leap
  const hr = handAt(r, 'R');
  const rel = L0 + 8;
  const free = t >= rel;
  const bx = free ? kf(t, [[rel, hr.x], [L0 + 40, 1000]]) : hr.x;
  const by = free ? kf(t, [[rel, hr.y + 60], [L0 + 26, 520], [L0 + 40, 260]]) : hr.y + 90;
  return (
    <g>
      <g transform={vcam(540, 960, push(t, len, 1, 1.04))}>
        <RainSky id="b2" y0={-200} y1={2100} dim={0.25} />
        <Palm x={-60} y={2300} s={2.4} t={t} lean={220} />
        <Palm x={1160} y={2300} s={2.2} t={t + 30} lean={-220} />
        <Fig look={RAMU} pose={r} rimId="rimR" />
        <SchoolBag x={bx} y={by} s={1.2} rot={free ? (t - rel) * 9 : Math.sin(t / 5) * 10} />
        {t > L0 + 8 && t < L0 + 34 ? <text x={bx + 120} y={by + 40} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFE27A" opacity={1 - clamp((t - L0 - 24) / 10)}>!</text> : null}
      </g>
      <VRain t={t} o={0.5} n={140} seed={7} />
    </g>
  );
};

// ------------------------------------------------------------------ C: day 10, the uniform
const Veranda: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <RainSky id={id} y1={1500} dim={0.5} />
    <Palm x={260} y={1520} s={1.1} t={t} lean={-40} dark />
    <Palm x={900} y={1520} s={0.9} t={t + 20} lean={50} dark />
    <rect x={-200} y={1380} width={1500} height={200} fill="#1E2A26" />
    <g transform="translate(0 0)"><VRain t={t + 40} o={0.45} n={80} seed={21} /></g>
    {/* the eave and rafters */}
    <rect x={-200} y={-100} width={1500} height={380} fill="#3A2420" />
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-60 + i * 150} y={180} width={34} height={110} fill="#5A3626" stroke={INK} strokeWidth={4} />)}
    <rect x={-200} y={270} width={1500} height={34} fill="#7A2E1E" stroke={INK} strokeWidth={5} />
    {/* pillars */}
    {[60, 1020].map((x) => (
      <g key={x}>
        <rect x={x - 50} y={300} width={100} height={1260} fill="#D8CDB4" stroke={INK} strokeWidth={6} />
        <rect x={x - 50} y={300} width={30} height={1260} fill="#B8AC94" />
      </g>
    ))}
    {/* red oxide floor */}
    <rect x={-200} y={1560} width={1500} height={800} fill="#7A2A22" />
    <rect x={-200} y={1560} width={1500} height={16} fill="#A8463A" />
    <ellipse cx={540} cy={1720} rx={500} ry={60} fill="#FFB15A" opacity={0.1} />
  </g>
);

const Line: React.FC<{ t: number; frog?: number }> = ({ t }) => (
  <g>
    <path d="M -60 830 Q 540 900 1140 830" stroke="#D8C08E" strokeWidth={5} fill="none" />
    {/* towel */}
    <g transform="translate(150 862)">
      <rect x={-70} y={0} width={140} height={300} fill="#E8E0CC" stroke={INK} strokeWidth={5} />
      {[40, 70, 230, 260].map((y) => <rect key={y} x={-70} y={y} width={140} height={10} fill="#B8452E" />)}
    </g>
    {/* uniform shirt */}
    <g transform="translate(430 880)">
      <path d="M -120 0 L -40 -8 Q 0 20 40 -8 L 120 0 L 150 110 L 100 120 L 96 300 L -96 300 L -100 120 L -150 110 Z" fill="#B8D4E8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -40 -8 L 0 60 L 40 -8" stroke={INK} strokeWidth={5} fill="none" />
      <rect x={20} y={100} width={56} height={60} fill="none" stroke="#7A9AB8" strokeWidth={5} />
      <path d="M -96 250 Q 0 280 96 250" stroke="#7A9AB8" strokeWidth={6} fill="none" opacity={0.7} />
      {[0, 1, 2].map((k) => <path key={k} d={`M ${-50 + k * 50} -30 q 16 -30 0 -60 q -16 -30 0 -60`} stroke="#8AB04A" strokeWidth={6} fill="none" opacity={0.55 + 0.3 * Math.sin(t / 5 + k)} transform={`translate(0 ${-((t * 2 + k * 20) % 40)})`} />)}
    </g>
    <Drops x={430} y={1180} t={t} n={8} w={180} />
    {/* navy shorts */}
    <g transform="translate(720 870)">
      <path d="M -90 0 L 90 0 L 110 220 L 20 220 L 0 90 L -20 220 L -110 220 Z" fill="#24305A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </g>
    <Drops x={720} y={1090} t={t + 5} n={8} w={200} />
  </g>
);

export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const r = life(at(600, 1720, 1.5, {
    yaw: -0.5, facing: -1, look: -0.6, headTilt: kf(t, [[0, 6], [14, 18]]), tilt: kf(t, [[0, 0], [14, -8]]),
    ...faceAt(t, [[0, 'neutral'], [22, 'dizzy']]),
  }), t, 1);
  const a = life(at(900, 1740, 1.45, {
    yaw: -0.55, facing: -1, look: -0.5, tilt: kf(t, [[0, 0], [24, 10]]), headTilt: 12,
    armL: { a: kf(t, [[0, 20], [26, 80]]), b: -10 }, ...faceAt(t, [[0, 'neutral'], [26, 'oops']]),
  }), t, 5);
  return (
    <g>
      <g transform={vcam(540, 1150, push(t, len, 1.02, 1.08))}>
        <Veranda t={t} id="c1" />
        <Bulb x={780} y={560} />
        <Line t={t} />
        <Fig look={APPU} pose={a} rimId="rimL" />
        <Fig look={RAMU} pose={r} rimId="rimR" />
      </g>
      <TimeTag t={t - 2} label="ദിവസം" value="10" />
    </g>
  );
};

export const C2: React.FC<ShotProps> = ({ t }) => {
  const up = kf(t, [[0, 0], [16, 0], [20, 1], [23, 0.85]]);
  const r = at(860, 2640, 3.4, { yaw: -0.5, facing: -1, look: -0.7, headTilt: 10, ...faceAt(t, [[0, 'neutral'], [20, 'shock']]), squash: kf(t, [[18, 0], [21, -0.05], [26, 0]]) });
  return (
    <g transform={vcam(540, 960, kf(t, [[0, 1], [56, 1.08]]))}>
      <rect x={-200} y={-200} width={1480} height={2320} fill="#2A1E2E" />
      <Glow x={760} y={300} r={700} kind="warm" o={0.5} />
      <g transform="translate(380 760) scale(2.6)">
        <path d="M -150 -260 L 150 -260 L 170 260 L -170 260 Z" fill="#B8D4E8" stroke={INK} strokeWidth={4} />
        <path d="M -150 120 Q 0 160 170 110" stroke="#7A9AB8" strokeWidth={5} fill="none" opacity={0.6} />
        <path d="M -150 -260 L -60 -260 L -20 -200 L -150 -150 Z M 150 -260 L 60 -260 L 20 -200 L 150 -150 Z" fill="#CFE2F0" stroke={INK} strokeWidth={4} />
        <line x1={-140} y1={-200} x2={-140} y2={260} stroke="#7A9AB8" strokeWidth={5} />
        {[-120, 0, 120, 220].map((by) => <circle key={by} cx={-155} cy={by} r={10} fill="#F6F2E8" stroke={INK} strokeWidth={3} />)}
        <g transform={`translate(0 ${30 - up * 95 + (t > 23 ? Math.sin((t - 23) / 3) * 6 : 0)})`}><Frog x={0} y={0} s={0.8} pop={Math.max(up > 0.95 && t < 26 ? 1 : 0, kf(t, [[36, 0], [39, 1], [44, 0]]))} /></g>
        <rect x={-90} y={-40} width={180} height={190} fill="#B8D4E8" stroke="#7A9AB8" strokeWidth={6} />
        <path d="M -90 -40 L 90 -40" stroke={INK} strokeWidth={4} />
      </g>
      <Drops x={380} y={1460} t={t} n={10} w={500} />
      <Fig look={RAMU} pose={r} rimId="rimR" />
      {up > 0.5 ? <text x={170} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFE27A" stroke={INK} strokeWidth={14} paintOrder="stroke">!?</text> : null}
    </g>
  );
};

// ------------------------------------------------------------------ D: the mid question
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const r = life(at(540, 2150, 3.1, {
    yaw: 0.15, look: kf(t, [[0, 0], [20, 0.5]]), headTilt: kf(t, [[0, 0], [20, 12]]), ...faceAt(t, [[0, 'neutral'], [14, 'worried']]),
  }), t, 2, 0.7);
  return (
    <g>
      <g transform={vcam(540, 1100, push(t, len, 1, 1.08))}>
        <rect x={-200} y={-200} width={1500} height={2400} fill="#5A3E34" />
        <Glow x={540} y={900} r={900} kind="warm" o={0.6} />
        <g transform="translate(830 820)">
          <rect x={-90} y={-110} width={180} height={220} fill="#3A2A20" stroke={INK} strokeWidth={6} />
          <rect x={-70} y={-90} width={140} height={180} fill="#C8B898" />
          <circle cx={0} cy={-20} r={40} fill="#8A7A62" />
          {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-90 + i * 16.4} cy={110 + Math.sin(i / 11 * Math.PI) * 40} r={11} fill="#F0A030" />)}
        </g>
        <g transform="translate(230 800)">
          <circle r={70} fill="#E8DCC0" stroke={INK} strokeWidth={6} />
          <line x1={0} y1={0} x2={0} y2={-46} stroke={INK} strokeWidth={6} />
          <line x1={0} y1={0} x2={36} y2={10} stroke={INK} strokeWidth={6} />
        </g>
        {/* the door frame */}
        <rect x={-200} y={-200} width={280} height={2400} fill="#2E1C14" />
        <rect x={1000} y={-200} width={280} height={2400} fill="#2E1C14" />
        <rect x={60} y={-200} width={30} height={2400} fill="#4A2E1E" />
        <rect x={990} y={-200} width={30} height={2400} fill="#4A2E1E" />
        <Fig look={RAMU} pose={r} rimId="rimL" />
      </g>
      <VRain t={t} o={0.35} n={110} seed={13} />
      <Say y={340} t={t - 4} text="വെള്ളം കയറിയാൽ" size={76} />
      <Say y={480} t={t - 14} text="നീ ആദ്യം എന്ത് എടുക്കും?" size={80} color="#FFE27A" />
    </g>
  );
};

export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const ring = (x: number, y: number, rr: number, t0: number) => {
    const k = clamp((t - t0) / 6);
    if (k <= 0) return null;
    return <circle cx={x} cy={y} r={rr * (0.6 + 0.4 * k)} fill="none" stroke="#FFE27A" strokeWidth={7} strokeDasharray="18 14" opacity={0.9} transform={`rotate(${t * 2} ${x} ${y})`} />;
  };
  const r = life(at(540, 1640, 1.15, { yaw: kf(t, [[0, -0.4], [30, 0.4], [60, -0.2]]), look: kf(t, [[0, -0.7], [30, 0.7], [60, -0.3]]), headTilt: -8, ...faceAt(t, [[0, 'worried']]) }), t, 3);
  return (
    <g>
      <g transform={vcam(540, 1060, push(t, len, 1, 1.05))}>
        <rect x={-200} y={-200} width={1500} height={1260} fill="#5A3E34" />
        <rect x={-200} y={1040} width={1500} height={1400} fill="#7A2A22" />
        {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={540 + (i - 4) * 120} y1={1040} x2={540 + (i - 4) * 420} y2={2300} stroke="#5E1E18" strokeWidth={4} />)}
        <Bulb x={540} y={300} s={1.2} o={0.6} />
        {/* ammooma's photo with a garland */}
        <g transform="translate(820 640)">
          <rect x={-90} y={-110} width={180} height={220} fill="#3A2A20" stroke={INK} strokeWidth={6} />
          <rect x={-70} y={-90} width={140} height={180} fill="#C8B898" />
          <circle cx={0} cy={-20} r={40} fill="#8A7A62" />
          {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-90 + i * 16.4} cy={110 + Math.sin(i / 11 * Math.PI) * 40} r={11} fill="#F0A030" />)}
        </g>
        {/* the TV on its stand */}
        <rect x={110} y={900} width={260} height={160} fill="#6E4430" stroke={INK} strokeWidth={6} />
        <rect x={120} y={720} width={240} height={170} rx={10} fill="#18161E" stroke={INK} strokeWidth={6} />
        <rect x={136} y={736} width={208} height={138} fill="#2A3A5A" opacity={0.6} />
        {/* the table: certificate file and phone */}
        <rect x={720} y={1180} width={300} height={36} fill="#6E4430" stroke={INK} strokeWidth={6} />
        {[740, 990].map((x) => <rect key={x} x={x} y={1216} width={18} height={180} fill="#4A2E1E" />)}
        <rect x={750} y={1110} width={150} height={70} fill="#E8B860" stroke={INK} strokeWidth={5} transform="rotate(-4 825 1145)" />
        <rect x={920} y={1150} width={70} height={30} rx={6} fill="#14121C" />
        {/* the cat on a plastic chair */}
        <g transform="translate(220 1340)">
          <rect x={-90} y={-10} width={180} height={24} rx={8} fill="#3E7C8A" stroke={INK} strokeWidth={5} />
          {[-80, 70].map((x) => <rect key={x} x={x} y={14} width={14} height={150} fill="#3E7C8A" stroke={INK} strokeWidth={4} />)}
          <rect x={-90} y={-170} width={20} height={170} fill="#3E7C8A" stroke={INK} strokeWidth={4} />
          <ellipse cx={0} cy={-40} rx={70} ry={38} fill="#E8A23E" stroke={INK} strokeWidth={5} />
          <circle cx={56} cy={-70} r={30} fill="#E8A23E" stroke={INK} strokeWidth={5} />
          <path d="M 40 -96 l 6 -22 l 12 16 M 64 -96 l 10 -20 l 6 20" stroke={INK} strokeWidth={5} fill="#E8A23E" />
          <path d="M 48 -70 q 6 4 12 0 M 64 -70 q 6 4 12 0" stroke={INK} strokeWidth={4} fill="none" />
        </g>
        <Fig look={RAMU} pose={r} rimId="rimR" />
        {ring(240, 800, 170, 6)}
        {ring(820, 640, 170, 16)}
        {ring(860, 1150, 150, 26)}
        {ring(260, 1290, 150, 46)}
      </g>
      <Say y={340} text="വെള്ളം കയറിയാൽ" size={76} />
      <Say y={480} text="നീ ആദ്യം എന്ത് എടുക്കും?" size={80} color="#FFE27A" />
    </g>
  );
};

// ------------------------------------------------------------------ E: day 20, the well
const FloodWell: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Yard t={t} id={id} hy={1150} hs={0.85} wl={1150} hx={420} />
    <RainRings t={t} y0={1170} y1={1900} n={20} />
    <Palm x={1000} y={1260} s={0.9} t={t} lean={-40} />
    <Well x={760} y={1440} s={0.95} />
    <g transform="translate(0 0)"><Water t={t + 9} y={1470} muddy rough={0.3} /></g>
    {/* overflow spilling off the rim */}
    {[-1, 1].map((d) => (
      <path key={d} d={`M ${760 + d * 140} 1440 q ${d * 50} 0 ${d * 70} 40`} stroke="#A08C62" strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray="20 14" strokeDashoffset={-t * 4} />
    ))}
  </g>
);
const appuSit = (t: number, happy: number): P => life(at(640, 1430 + 140 * 1.0 * 0.9, 1.0, {
  yaw: 0.7, facing: 1, look: 0.6, legL: { a: 80, b: -80 }, legR: { a: 74, b: -70 },
  armR: { a: kf(t, [[0, 70], [happy, 70], [happy + 4, 120]]), b: -10 }, armL: { a: 60, b: -20 },
  ...faceAt(t, [[0, 'neutral'], [happy, 'happy']]),
}), t, 4);
const Rod: React.FC<{ pose: P; t: number; bite: number }> = ({ pose, t, bite }) => {
  const h = handAt(pose, 'R');
  const bend = clamp((t - bite) / 4) * 60;
  const tip = { x: h.x + 330, y: h.y - 160 + bend };
  return (
    <g>
      <path d={`M ${h.x} ${h.y} Q ${h.x + 200} ${h.y - 150 + bend * 0.3} ${tip.x} ${tip.y}`} stroke="#8A6A3A" strokeWidth={9} fill="none" strokeLinecap="round" />
      <line x1={tip.x} y1={tip.y} x2={tip.x + 10} y2={1560} stroke="#E8E0CC" strokeWidth={3} />
    </g>
  );
};

export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const a = appuSit(t, 99);
  const r = life(at(330, 1150, 0.55, { yaw: 0.3, look: 0.6, armR: { a: 150, b: -20 }, ...faceAt(t, [[0, 'worried']]) }), t, 1);
  const h = handAt(r, 'R');
  return (
    <g>
      <g transform={vcam(560, 1200, push(t, len, 1, 1.05))}>
        <FloodWell t={t} id="e1" />
        <Fig look={RAMU} pose={r} rimId="rimR" />
        <Umbrella x={h.x} y={h.y - 70} s={0.55} c="#2A2A40" />
        <Fig look={APPU} pose={a} rimId="rimL" />
        <Rod pose={a} t={t} bite={99} />
        <circle cx={1010} cy={1560 + Math.sin(t / 5) * 4} r={10} fill="#D8282A" stroke={INK} strokeWidth={3} />
      </g>
      <VRain t={t} o={0.45} n={140} />
      <TimeTag t={t - 2} label="ദിവസം" value="20" />
    </g>
  );
};

export const E2: React.FC<ShotProps> = ({ t }) => {
  const a = appuSit(t, 36);
  const fy = kf(t, [[0, 1600], [26, 1600], [34, 1330], [44, 1280], [56, 1310]]);
  return (
    <g>
      <g transform={vcam(820, 1380, 1.85)}>
        <FloodWell t={t} id="e2" />
        <Fig look={APPU} pose={a} rimId="rimL" />
        <Rod pose={a} t={t} bite={26} />
        {t > 25 ? <Fish x={1000} y={fy} s={1.1} dir={-1} rot={kf(t, [[26, -60], [36, -10], [56, 20]]) + Math.sin(t) * 8} c="#B8C8D8" /> : null}
        {t > 24 && t < 42 ? <Ripple x={1010} y={1580} r={40 + (t - 24) * 4} /> : null}
        {t > 28 ? <Drops x={1000} y={fy + 20} t={t} n={8} w={120} /> : null}
      </g>
      <VRain t={t} o={0.4} n={110} seed={17} />
    </g>
  );
};

// ------------------------------------------------------------------ F: day 40, inside
export const F1: React.FC<ShotProps> = ({ t, len }) => {
  const wl = kf(t, [[0, 1500], [len, 1460]]);
  const m = life(at(600, 1560, 1.25, {
    yaw: 0.5, facing: 1, look: 0.4, tilt: kf(t, [[0, 10], [30, -4]]),
    armL: { a: kf(t, [[0, 120], [30, 160]]), b: -20 }, armR: { a: kf(t, [[0, 120], [30, 165]]), b: -20 }, ...faceAt(t, [[0, 'worried']]),
  }), t, 6);
  const mh = handAt(m, 'R');
  const r = life(at(880, 1300, 1.15, {
    yaw: -0.3, look: -0.5, armL: { a: 165, b: 6 }, armR: { a: 165, b: -6 }, ...faceAt(t, [[0, 'worried']]),
  }), t, 2);
  const rh = handAt(r, 'R');
  return (
    <g>
      <g transform={vcam(540, 1100, push(t, len, 1, 1.05))}>
        <rect x={-200} y={-200} width={1500} height={1700} fill="#5A3E34" />
        {/* the open door with the rain outside */}
        <rect x={40} y={700} width={320} height={800} fill="#1A2034" stroke={INK} strokeWidth={8} />
        <g transform="translate(40 700)"><rect width={320} height={800} fill="#2A2440" /><Glow x={160} y={200} r={300} kind="cool" o={0.3} /></g>
        <rect x={350} y={700} width={40} height={800} fill="#6B4430" stroke={INK} strokeWidth={5} />
        <Bulb x={700} y={420} s={1.1} />
        {/* the wall calendar and a window */}
        <rect x={600} y={620} width={300} height={260} fill="#1A2034" stroke={INK} strokeWidth={8} />
        {[0, 1, 2, 3, 4].map((k) => <line key={k} x1={620 + k * 60} y1={620} x2={620 + k * 60} y2={880} stroke="#3A3446" strokeWidth={6} />)}
        <rect x={-200} y={1500} width={1500} height={900} fill="#7A2A22" />
        <Cot x0={760} x1={1120} y={1320} leg={200} />
        <Fig look={MOM} pose={m} rimId="rimR" />
        <RiceSack x={mh.x + 20} y={mh.y - 60} s={1.1} rot={-8} />
        <Fig look={RAMU} pose={r} rimId="rimL" />
        <SchoolBag x={rh.x - 40} y={rh.y - 90} s={0.9} rot={4} />
        {/* the water: over the threshold and across the floor */}
        <Water t={t} y={wl} muddy rough={0.2} />
        <path d={`M 40 1500 Q 200 ${1480 + Math.sin(t / 4) * 8} 360 1500 L 380 ${wl + 30} L 20 ${wl + 30} Z`} fill="#8A7650" opacity={0.8} />
        <RainRings t={t} x0={60} x1={340} y0={1510} y1={1560} n={6} />
        <SteelPlate x={kf(t, [[0, 260], [len, 420]])} y={wl + 40} s={0.8} rot={t} />
        <Chappal x={kf(t, [[0, 460], [len, 380]])} y={wl + 70} s={0.6} rot={100 + t} />
      </g>
      <TimeTag t={t - 2} label="ദിവസം" value="40" />
    </g>
  );
};

// ------------------------------------------------------------------ G: the twist, 2018
export const G1: React.FC<ShotProps> = ({ t, len }) => {
  const r = life(at(540, 2160, 3.2, {
    yaw: -0.1, look: kf(t, [[0, -0.3], [30, 0]]), headTilt: kf(t, [[0, 8], [30, -4]]), ...faceAt(t, [[0, 'worried'], [34, 'shock']]),
  }), t, 3, 0.6);
  return (
    <g>
      <g transform={vcam(540, 1080, push(t, len, 1.75, 1.6))}>
        <rect x={-200} y={-200} width={1500} height={2400} fill="#120A1C" />
        <Bolt x={820} y={-100} t={t} t0={15} h={900} />
        <Glow x={200} y={600} r={800} kind="red" o={0.5} />
        <Fig look={RAMU} pose={r} rimId="rimRed" />
      </g>
      <VRain t={t} o={0.45} n={140} seed={9} />
    </g>
  );
};

/** Roofs sunk to the tiles in muddy water, back to front. */
const Sunk: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <RainSky id={id} y1={1000} dim={0.3} />
    <Glow x={540} y={980} r={600} kind="warm" o={0.35} />
    <Water t={t} y={980} muddy />
    {[[220, 1120, 0.38], [860, 1160, 0.42], [540, 1420, 0.7]].map(([x, y, s], i) => (
      <g key={i}>
        <KHouse x={x} y={y} s={s} lit={0} />
        <Water t={t + i * 7} y={y - 300 * s} muddy rough={0.15} />
      </g>
    ))}
    <Palm x={60} y={1600} s={1.1} t={t} lean={60} />
    <Palm x={1040} y={1550} s={1.0} t={t + 20} lean={-50} />
    <Water t={t + 30} y={1500} muddy rough={0.3} />
    <RainRings t={t} y0={1000} y1={1900} n={18} />
  </g>
);

export const G2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={vcam(540, 1150, push(t, len, 1, 1.06))}>
      <Sunk t={t} id="g2" />
      <Boat x={kf(t, [[0, 420], [len, 640]])} y={1640} s={1.25} t={t} look={0.6} />
    </g>
    <VRain t={t} o={0.35} n={110} seed={5} />
    <FactCard t={t - 6} y={430} big={FACT.big} line={FACT.line} src={FACT.src} />
  </g>
);

export const G3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={vcam(540, 1080, push(t, len, 1, 1.05))}>
      <rect x={-200} y={-200} width={1500} height={2400} fill="#C8B490" />
      <rect x={-200} y={-200} width={1500} height={2400} fill="#2A1E36" opacity={0.45} />
      <Glow x={700} y={700} r={700} kind="warm" o={0.45} />
      <Aug2018 x={540} y={760} w={600} circle={clamp((t - 2) / 8) + clamp((t - 12) / 8) + clamp((t - 22) / 8)} mud={0.18} />
      {/* the mud line the flood left on the wall */}
      <rect x={-200} y={1450} width={1500} height={900} fill="#6A4E2E" opacity={0.55} />
      <path d={`M -200 1450 ${Array.from({ length: 30 }).map((_, i) => `L ${-200 + i * 52} ${1450 + rnd(6, i) * 18}`).join(' ')} L 1300 1450`} stroke="#4A3220" strokeWidth={8} fill="none" />
    </g>
    <FactCard t={99} y={430} big={FACT.big} line={FACT.line} src={FACT.src} />
  </g>
);

// ------------------------------------------------------------------ H: the comment question
export const H1: React.FC<ShotProps> = ({ t, len }) => {
  const a = life(at(760, 1640, 1.55, { yaw: -0.35, look: -0.4, armR: { a: 150, b: -20 }, ...faceAt(t, [[0, 'worried']]) }), t, 4);
  const h = handAt(a, 'R');
  const r = life(at(440, 1650, 1.6, { yaw: 0.05, look: kf(t, [[0, 0.5], [24, 0]]), headTilt: kf(t, [[0, -6], [24, 4]]), ...faceAt(t, [[0, 'worried'], [24, 'neutral']]) }), t, 1);
  return (
    <g>
      <g transform={vcam(560, 1200, push(t, len, 1.02, 1.08))}>
        <Sunk t={t} id="h1" />
        <Fig look={RAMU} pose={r} rimId="rimR" />
        <Fig look={APPU} pose={a} rimId="rimL" />
        <Umbrella x={h.x - 60} y={h.y - 200} s={1.9} rot={-14} c="#2A2A40" />
        {/* the terrace parapet */}
        <rect x={-200} y={1500} width={1500} height={600} fill="#6E6878" stroke={INK} strokeWidth={8} />
        <rect x={-200} y={1500} width={1500} height={30} fill="#9A94A6" />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${-120 + i * 160} 1532 q 10 ${60 + (i % 3) * 40} -6 ${120 + (i % 2) * 60}`} stroke="#3E4A3A" strokeWidth={14} fill="none" opacity={0.45} strokeLinecap="round" />)}
        {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={-200} y1={1600 + i * 70} x2={1300} y2={1600 + i * 70} stroke="#5A5466" strokeWidth={4} opacity={0.6} />)}
        <Kudam x={170} y={1470} s={1.1} />
        <SteelPlate x={930} y={1488} s={0.6} />
        <RainRings t={t} x0={-100} x1={1180} y0={1505} y1={1520} n={8} s={0.6} />
      </g>
      <VRain t={t} o={0.35} n={110} seed={2} />
      <Say y={330} t={t - 3} text="ആ ആഗസ്റ്റിൽ" size={84} />
      <Say y={470} t={t - 10} text="നീ എവിടെയായിരുന്നു?" size={88} color="#FFE27A" />
      <text x={540} y={590} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={46} fill="#F6EFE3" opacity={clamp((t - 24) / 8)}>കമന്റ് ചെയ്യൂ ↓</text>
    </g>
  );
};

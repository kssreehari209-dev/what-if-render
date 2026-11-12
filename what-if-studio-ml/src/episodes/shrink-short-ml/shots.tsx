// shrink-short-ml: "What if you shrank to half your size every time you slept?" 9:16. Ramu (black hoodie) and Appu.
// One halving a night: 80 cm, 20 cm, 5 cm, then a flu virus on day 24. The jokes stay in the picture.
import React from 'react';
import { faceAt, kf, clamp, ShotProps, FONT, Pose, LOOKS, Glow, Dust, rnd, walkPose, FitSay as Say, FactCard, TimeTag, AlarmClock } from '../../engine';
import { Fig, Palm, KHouse, Heart, Breath, headAt, handAt } from '../fly-ml/kit';
import { ground, vcam, TeaGlass } from '../phone-ml/kit';
import { SchoolBag, Laterite } from '../rain-short-ml/kit';

const RAMU = LOOKS.ramu;
const APPU = LOOKS.appu;
const INK = '#16121E';
type P = Partial<Pose>;
const at = (x: number, g: number, s: number, extra: P = {}): P => ({ x, y: ground(g, s), scale: s, ...extra });
const push = (t: number, len: number, a: number, b: number) => kf(t, [[0, a], [len, b]]);
const life = (p: P, t: number, seed = 0, amt = 0.5): P => ({
  ...p,
  squash: (p.squash ?? 0) + Math.sin(t / 9 + seed) * 0.018 * amt,
  tilt: (p.tilt ?? 0) + Math.sin(t / 23 + seed * 2) * 2.2 * amt,
  headTilt: (p.headTilt ?? 0) + Math.sin(t / 17 + seed * 3) * 3 * amt,
  sway: 8,
});
/** The top of a figure's head, so marks and steps can be sized to it. */
const topOf = (p: P) => headAt(p).y - 62 * (p.scale ?? 1);
const FACT = { big: '1,500', line: 'ചുണ്ടെലിയുടെ ഹൃദയമിടിപ്പ് / മിനിറ്റ് · നിന്റേത് 70', src: 'ഉറവിടം: Jürgens et al., J. Exp. Biol. 1996' };

// ------------------------------------------------------------------ sets
/** A Kerala room: lime-washed wall, red-oxide floor from `fy`, a barred window onto a palm. */
const Room: React.FC<{ t: number; fy: number; night?: boolean; win?: number }> = ({ t, fy, night = false, win = 160 }) => (
  <g>
    <rect x={-600} y={-600} width={2400} height={fy + 600} fill={night ? '#2C2844' : '#6A5468'} />
    <rect x={-600} y={-600} width={2400} height={fy + 600} fill="#F2C48A" opacity={night ? 0 : 0.08} />
    <g transform={`translate(${win} ${fy - 820})`}>
      <rect x={-10} y={-10} width={340} height={420} fill="#3A2418" />
      <rect x={0} y={0} width={320} height={400} fill={night ? '#0E1634' : '#F4A86A'} />
      {night ? <circle cx={230} cy={90} r={40} fill="#F1EBD0" /> : <circle cx={220} cy={300} r={70} fill="#FFE2A0" />}
      <Palm x={110} y={460} s={0.7} t={t} dark />
      {[64, 128, 192, 256].map((x) => <rect key={x} x={x - 5} y={0} width={10} height={400} fill="#2A1A12" />)}
      <rect x={-10} y={190} width={340} height={14} fill="#3A2418" />
    </g>
    {!night ? <Glow x={win + 160} y={fy - 620} r={700} kind="warm" o={0.55} /> : <Glow x={win + 230} y={fy - 730} r={420} kind="cool" o={0.4} />}
    <rect x={-600} y={fy} width={2400} height={1400} fill="#8A3324" />
    <rect x={-600} y={fy} width={2400} height={1400} fill="#000" opacity={night ? 0.45 : 0.12} />
    <rect x={-600} y={fy - 40} width={2400} height={40} fill="#5A2018" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={300 + i * 420} cy={fy + 160 + i * 60} rx={260} ry={18} fill="#F6CFA0" opacity={night ? 0.04 : 0.1} />)}
  </g>
);

/** A shrew, side on, facing left; about 1.1 x its `s` world units tall at the back. */
const Shrew: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const sniff = Math.sin(t * 1.4) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={150} ry={14} fill="#000" opacity={0.3} />
      <path d={`M 120 -30 Q 230 -40 ${280 + sniff} -10`} stroke="#6E5A54" strokeWidth={14} fill="none" strokeLinecap="round" />
      <ellipse cx={20} cy={-70} rx={130} ry={72} fill="#6E5A54" stroke={INK} strokeWidth={6} />
      <ellipse cx={30} cy={-40} rx={100} ry={36} fill="#8E7A70" opacity={0.6} />
      <path d={`M -90 -96 Q -150 -90 ${-205 + sniff} -60 Q -150 -40 -90 -40 Z`} fill="#6E5A54" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={-203 + sniff} cy={-60} r={9} fill="#E58A8A" />
      <circle cx={-110} cy={-80} r={10} fill="#0A0A10" />
      <circle cx={-113} cy={-83} r={3.5} fill="#FFF" />
      <ellipse cx={-70} cy={-118} rx={20} ry={16} fill="#8E6A66" stroke={INK} strokeWidth={5} />
      {[-180, -176].map((wy, i) => <line key={i} x1={-180 + sniff} y1={wy + 120 - i * 10} x2={-240 + sniff} y2={wy + 100 - i * 26} stroke="#D8CFC8" strokeWidth={2.5} />)}
      {[-60, 60].map((fx) => <ellipse key={fx} cx={fx} cy={-4} rx={22} ry={9} fill="#E0A8A0" stroke={INK} strokeWidth={4} />)}
    </g>
  );
};

/** The house cat's big head, front on, for the floor-level shots. `lick` 0..1 brings the tongue out. */
export const CatHead: React.FC<{ x: number; y: number; s?: number; lick?: number; look?: number; t: number }> = ({ x, y, s = 1, lick = 0, look = 0, t }) => {
  const body = '#3A3E57';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -230 -150 L -200 -360 L -70 -230 Z M 230 -150 L 200 -360 L 70 -230 Z" fill={body} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -200 -170 L -190 -300 L -110 -220 Z M 200 -170 L 190 -300 L 110 -220 Z" fill="#B87A8A" opacity={0.7} />
      <ellipse cx={0} cy={0} rx={290} ry={250} fill={body} stroke={INK} strokeWidth={8} />
      <ellipse cx={0} cy={110} rx={150} ry={100} fill="#52567A" />
      {[-1, 1].map((k) => (
        <g key={k} transform={`translate(${k * 110} -40)`}>
          <ellipse cx={0} cy={0} rx={70} ry={62} fill="#E8D86A" stroke={INK} strokeWidth={6} />
          <ellipse cx={look * 24} cy={8} rx={14} ry={50} fill="#0B0A10" />
          <circle cx={look * 24 - 18} cy={-22} r={11} fill="#FFF" opacity={0.9} />
        </g>
      ))}
      <path d="M -26 60 L 26 60 L 0 86 Z" fill="#E58A9A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 0 86 Q -40 130 -80 110 M 0 86 Q 40 130 80 110" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      {lick > 0 ? <path d={`M 26 112 Q ${70 + 20 * lick} ${120 + 60 * lick} ${50 + 70 * lick} ${100 + 20 * lick} Q 60 108 30 104 Z`} fill="#E06A7A" stroke={INK} strokeWidth={5} /> : null}
      {[-1, 1].map((k) => [0, 1, 2].map((i) => (
        <line key={`${k}${i}`} x1={k * 120} y1={70 + i * 22} x2={k * (330 + Math.sin(t / 9 + i) * 6)} y2={40 + i * 40} stroke="#D8D4E8" strokeWidth={4} opacity={0.8} />
      )))}
    </g>
  );
};

/** A flu virus: a sphere with spikes, slowly turning. */
const Virus: React.FC<{ x: number; y: number; r: number; t: number }> = ({ x, y, r, t }) => (
  <g transform={`translate(${x} ${y}) rotate(${t * 0.6})`}>
    {Array.from({ length: 22 }).map((_, i) => {
      const a = (i / 22) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      return (
        <g key={i}>
          <line x1={c * r * 0.9} y1={s * r * 0.9} x2={c * r * 1.32} y2={s * r * 1.32} stroke="#C84A3A" strokeWidth={r * 0.07} />
          <circle cx={c * r * 1.36} cy={s * r * 1.36} r={r * (i % 2 ? 0.09 : 0.12)} fill={i % 2 ? '#F2B04A' : '#E86A4A'} stroke={INK} strokeWidth={3} />
        </g>
      );
    })}
    <circle r={r} fill="#D8604A" stroke={INK} strokeWidth={7} />
    <circle cx={-r * 0.3} cy={-r * 0.32} r={r * 0.35} fill="#F29A6A" opacity={0.6} />
    {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={(rnd(3, i) - 0.5) * r * 1.3} cy={(rnd(5, i) - 0.5) * r * 1.3} r={r * 0.08} fill="#9A2E2A" opacity={0.7} />)}
  </g>
);

/** The baggy uniform shirt on a small Ramu: collar, placket, buttons, sleeves past the hands, the hem on the floor. */
const BigShirt: React.FC<{ p: P; floor: number; t: number }> = ({ p, floor, t }) => {
  const h = headAt(p);
  const s = p.scale ?? 1;
  const top = h.y + 78 * s;
  const sw = Math.sin(t / 3) * 10 * s;
  const w0 = 70 * s;
  const w1 = 120 * s;
  return (
    <g>
      <path d={`M ${h.x - w0} ${top} L ${h.x - w1 - 40 * s} ${top + 110 * s} L ${h.x - w1 - 10 * s} ${top + 150 * s} L ${h.x - w1 + 10 * s} ${floor + 4} Q ${h.x + sw} ${floor + 16} ${h.x + w1 + 30 * s} ${floor + 2} L ${h.x + w1 + 10 * s} ${top + 150 * s} L ${h.x + w1 + 40 * s} ${top + 110 * s} L ${h.x + w0} ${top} Z`}
        fill="#CFE2F4" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M ${h.x - w1 - 40 * s} ${top + 110 * s} L ${h.x - w1 - 80 * s} ${top + 330 * s} L ${h.x - w1 - 20 * s} ${top + 340 * s} L ${h.x - w1 + 4 * s} ${top + 160 * s} Z`} fill="#BCD3EA" stroke={INK} strokeWidth={5} />
      <path d={`M ${h.x + w1 + 40 * s} ${top + 110 * s} L ${h.x + w1 + 80 * s} ${top + 330 * s} L ${h.x + w1 + 20 * s} ${top + 340 * s} L ${h.x + w1 - 4 * s} ${top + 160 * s} Z`} fill="#BCD3EA" stroke={INK} strokeWidth={5} />
      <path d={`M ${h.x - w0} ${top} L ${h.x} ${top + 50 * s} L ${h.x + w0} ${top} L ${h.x + w0 - 10 * s} ${top - 18 * s} L ${h.x} ${top + 20 * s} L ${h.x - w0 + 10 * s} ${top - 18 * s} Z`} fill="#F2F8FF" stroke={INK} strokeWidth={5} />
      <line x1={h.x} y1={top + 50 * s} x2={h.x + sw * 0.3} y2={floor} stroke="#9EB8D2" strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={h.x + 10 * s} cy={top + 90 * s + i * ((floor - top - 120 * s) / 5)} r={7 * s} fill="#F6EFE3" stroke={INK} strokeWidth={2.5} />)}
      <rect x={h.x + 30 * s} y={top + 80 * s} width={50 * s} height={44 * s} fill="none" stroke="#9EB8D2" strokeWidth={4} />
    </g>
  );
};

// ------------------------------------------------------------------ A: the hook, waking up small
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const r = life(at(430, 1600, 0.62, { yaw: 0.25, look: 0.5, armL: { a: 30, b: 20 }, armR: { a: 40, b: -30 }, ...faceAt(t, [[0, 'shock']]) }), t, 1);
  return (
    <g>
      <g transform={vcam(540, 960, push(t, len, 1.04, 1))}>
        <Room t={t} fy={1120} win={-900} />
        {/* the bedside table and the alarm clock, towering */}
        <rect x={720} y={1000} width={420} height={600} fill="#4A2C20" stroke={INK} strokeWidth={8} />
        <AlarmClock x={900} y={1000} s={1.6} text="7:00" />
        <Glow x={900} y={900} r={300} kind="warm" o={0.3} />
        {/* the bed: sheet, the huge pillow with Ramu's old dent */}
        <rect x={-100} y={1280} width={900} height={800} fill="#E8DCC8" stroke={INK} strokeWidth={8} />
        <path d="M -60 1210 Q -80 1100 60 1080 L 660 1080 Q 780 1090 760 1220 Q 780 1330 660 1340 L 60 1340 Q -80 1330 -60 1210 Z" fill="#F4EEE2" stroke={INK} strokeWidth={8} />
        <ellipse cx={360} cy={1210} rx={220} ry={60} fill="#D8CCB8" />
        <path d="M -100 1540 Q 300 1500 800 1560 L 800 2100 L -100 2100 Z" fill="#3E6E8A" stroke={INK} strokeWidth={8} />
        <path d="M -100 1540 Q 300 1500 800 1560" stroke="#6A9AB4" strokeWidth={14} fill="none" />
        <ellipse cx={430} cy={1604} rx={60} ry={10} fill="#000" opacity={0.3} />
        <Fig look={RAMU} pose={r} rimId="rimR" />
      </g>
      <text x={540} y={250} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={12} fill="#FFE27A">WHAT IF...</text>
      <Say y={420} text="ഓരോ ഉറക്കത്തിലും" size={110} color="#FFB15A" />
      <Say y={570} text="പകുതിയായാൽ?" size={130} />
    </g>
  );
};

export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const r = life(at(560, 2500, 3.2, { yaw: -0.1, look: kf(t, [[0, -0.6], [24, 0.4]]), armL: { a: 20, b: 10 }, armR: { a: 20, b: -10 }, ...faceAt(t, [[0, 'shock'], [26, 'worried']]) }), t, 2);
  return (
    <g transform={vcam(540, 960, push(t, len, 1, 1.06))}>
      <rect x={-200} y={-200} width={1500} height={2400} fill="#EFE6D6" />
      {Array.from({ length: 30 }).map((_, i) => <line key={i} x1={-200} y1={i * 80} x2={1300} y2={i * 80 - 120} stroke="#D8CCB6" strokeWidth={6} />)}
      {Array.from({ length: 24 }).map((_, i) => <line key={`v${i}`} x1={i * 70 - 200} y1={-200} x2={i * 70 - 100} y2={2200} stroke="#E2D6C2" strokeWidth={4} />)}
      <path d={`M -100 600 Q 300 ${520 + Math.sin(t / 8) * 20} 700 640 T 1300 560`} stroke="#B8A890" strokeWidth={18} fill="none" strokeLinecap="round" />
      <Glow x={300} y={300} r={900} kind="warm" o={0.4} />
      <Fig look={RAMU} pose={r} rimId="rimR" />
    </g>
  );
};

// ------------------------------------------------------------------ B: day 1, 80 cm
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1640;
  const r = life(at(380, g, 1.25, { yaw: 0.45, look: 0.7, headTilt: -12, armL: { a: 10, b: 10 }, armR: { a: 14, b: -10 }, ...faceAt(t, [[0, 'worried']]) }), t, 3);
  const top = topOf(r);
  const old = g - 2 * (g - top);
  const draw = clamp((t - 4) / 12);
  return (
    <g>
      <g transform={vcam(540, 1100, push(t, len, 1.02, 1.08))}>
        <Room t={t} fy={g} win={-40} />
        {/* the door frame with amma's pencil marks */}
        <rect x={560} y={-200} width={130} height={g + 200} fill="#5A3420" stroke={INK} strokeWidth={8} />
        <rect x={690} y={-200} width={600} height={g + 200} fill="#24182A" />
        {[0.2, 0.32, 0.45, 0.6].map((k, i) => <line key={i} x1={575} x2={640} y1={g - (g - old) * (k + 0.38) / 1.0 + 0} y2={g - (g - old) * (k + 0.38)} stroke="#E8C890" strokeWidth={5} opacity={0.7} />)}
        <line x1={565} x2={680} y1={old} y2={old} stroke="#F6E2B0" strokeWidth={8} />
        <line x1={565} x2={565 + 115 * draw} y1={top} y2={top} stroke="#F6E2B0" strokeWidth={8} />
        {/* amma's hand with the pencil, from the right */}
        <g transform={`translate(${565 + 115 * draw + 20} ${top - 8})`}>
          <rect x={0} y={-10} width={260} height={56} rx={26} fill="#C26A7A" stroke={INK} strokeWidth={6} />
          <circle cx={0} cy={18} r={40} fill="#C69A74" stroke={INK} strokeWidth={6} />
          <path d="M -30 10 L -64 6 L -30 26 Z" fill="#E8C040" stroke={INK} strokeWidth={4} />
        </g>
        <path d={`M 470 ${old} L 470 ${top}`} stroke="#FFB15A" strokeWidth={5} strokeDasharray="14 12" opacity={clamp((t - 14) / 8)} />
        <Fig look={RAMU} pose={r} rimId="rimR" />
      </g>
      <TimeTag t={t - 2} label="ദിവസം 1 ·" value="80 cm" />
    </g>
  );
};

export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1600;
  const x = kf(t, [[0, 260], [len, 470]]);
  const r = walkPose(x, t * 0.5, g, 0.85, { ...faceAt(t, [[0, 'worried'], [40, 'oops']]), look: kf(t, [[0, 0.2], [38, 0.8]]) }, 1);
  const laugh = t > 58 ? Math.abs(Math.sin(t / 3)) : 0;
  const a = life(at(820, g + 30, 1.5, { yaw: -0.55, look: -0.6, tilt: kf(t, [[0, 0], [58, 0], [64, 26]]), armL: { a: 40, b: 60 }, armR: { a: 30 + laugh * 10, b: 80 }, squash: laugh * 0.03, ...faceAt(t, [[0, 'smug'], [58, 'happy']]) }), t, 5);
  return (
    <g transform={vcam(540, 1150, push(t, len, 1, 1.05))}>
      <rect x={-600} y={-600} width={2400} height={1700} fill="#F0A070" />
      <Glow x={540} y={900} r={900} kind="warm" o={0.5} />
      <Palm x={-60} y={1250} s={1.3} t={t} lean={60} />
      <Palm x={1120} y={1250} s={1.1} t={t + 20} lean={-60} />
      <KHouse x={380} y={1250} s={0.8} lit={0.4} door={1} />
      <rect x={-600} y={1250} width={2400} height={1400} fill="#6A4A34" />
      <Laterite x0={-200} x1={640} y0={g - 30} y1={g + 60} />
      {/* the gate */}
      <rect x={660} y={1340} width={24} height={300} fill="#3A2C3E" stroke={INK} strokeWidth={5} />
      <Fig look={APPU} pose={a} rimId="rimL" />
      <Fig look={RAMU} pose={r} rimId="rimR" />
      <BigShirt p={r} floor={g + 4} t={t} />
    </g>
  );
};

// ------------------------------------------------------------------ C: day 3, 20 cm, the bus
const BusSide: React.FC<{ g: number; stepTop: number; t: number }> = ({ g, stepTop, t }) => (
  <g>
    <rect x={520} y={-400} width={900} height={g - 40 + 400} fill="#B22E2A" stroke={INK} strokeWidth={10} />
    <rect x={520} y={360} width={900} height={110} fill="#F2E6C8" />
    <rect x={620} y={-300} width={420} height={600} fill="#2A1C24" stroke={INK} strokeWidth={8} />
    {/* the doorway and its first step, a wall at this size */}
    <rect x={610} y={stepTop - 30} width={520} height={30} fill="#5A5460" stroke={INK} strokeWidth={6} />
    <rect x={620} y={stepTop} width={500} height={g - stepTop - 10} fill="#7A7480" stroke={INK} strokeWidth={8} />
    {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={640 + i * 52} x2={640 + i * 52} y1={stepTop - 26} y2={stepTop - 4} stroke="#3A3440" strokeWidth={5} />)}
    <rect x={1000} y={-260} width={18} height={stepTop + 230} fill="#C8C2B0" stroke={INK} strokeWidth={4} />
    <circle cx={1300} cy={g - 60} r={160} fill="#1E1A26" stroke={INK} strokeWidth={8} />
    <circle cx={1300} cy={g - 60} r={60} fill="#8A8494" />
    <Glow x={830} y={0} r={420} kind="warm" o={0.25 + 0.05 * Math.sin(t / 5)} />
  </g>
);

export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1640;
  const r = life(at(380, g, 0.62, { yaw: 0.6, look: 0.6, headTilt: -20, armL: { a: 20, b: 10 }, armR: { a: kf(t, [[0, 20], [50, 20], [60, 130], [70, 120]]), b: -20 }, ...faceAt(t, [[0, 'neutral'], [44, 'worried']]) }), t, 1);
  const stepTop = g - 2 * (g - topOf(r));
  return (
    <g>
      <g transform={vcam(540, 1150, push(t, len, 1.0, 1.06))}>
        <rect x={-600} y={-600} width={2400} height={g + 600} fill="#E89A68" />
        <Palm x={180} y={1100} s={1.2} t={t} dark />
        <BusSide g={g} stepTop={stepTop} t={t} />
        <rect x={-600} y={g} width={2400} height={800} fill="#4A4250" />
        <rect x={-600} y={g} width={2400} height={14} fill="#2A2430" />
        <ellipse cx={380} cy={g + 4} rx={60} ry={9} fill="#000" opacity={0.35} />
        <SchoolBag x={headAt(r).x - 40 * 0.62} y={headAt(r).y + 150 * 0.62} s={0.4} />
        <Fig look={RAMU} pose={r} rimId="rimR" />
      </g>
      <TimeTag t={t - 2} label="ദിവസം 3 ·" value="20 cm" />
    </g>
  );
};

export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1700;
  const a = life(at(700, g, 1.9, { yaw: -0.5, look: -0.6, headTilt: 8, armR: { a: kf(t, [[0, 60], [12, 150], [16, 140]]), b: -10 }, armL: { a: 20, b: 20 }, ...faceAt(t, [[0, 'smug']]) }), t, 4);
  const h = handAt(a, 'R');
  const kick = Math.sin(t / 2.2);
  const rs = 0.62;
  const r: P = { x: h.x - 10, y: h.y + 170 * rs, scale: rs, yaw: 0.3, look: 0.4, tilt: Math.sin(t / 6) * 6, legL: { a: 20 + kick * 30, b: -40 }, legR: { a: -10 - kick * 30, b: -30 }, armL: { a: 60, b: 30 }, armR: { a: 50, b: -30 }, ...faceAt(t, [[0, 'oops']]) };
  return (
    <g transform={vcam(540, 1150, push(t, len, 1.08, 1.02))}>
      <rect x={-600} y={-600} width={2400} height={g + 600} fill="#E89A68" />
      <BusSide g={g + 60} stepTop={g - 300} t={t} />
      <rect x={-600} y={g} width={2400} height={800} fill="#4A4250" />
      <Fig look={APPU} pose={a} rimId="rimL" />
      <g transform={`rotate(${Math.sin(t / 5) * 5} ${h.x} ${h.y})`}>
        <Fig look={RAMU} pose={r} rimId="rimR" />
      </g>
      <circle cx={h.x} cy={h.y} r={16} fill={APPU.hand} stroke={INK} strokeWidth={4} />
    </g>
  );
};

// ------------------------------------------------------------------ D: the mid question
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1500;
  const r = life(({ x: 330, y: g - 14, scale: 0.75, yaw: 0.85, facing: 1, look: kf(t, [[0, 0.2], [40, -0.3], [80, 0.5]]), headTilt: -14, legL: { a: 80, b: -80 }, legR: { a: 74, b: -76 }, armL: { a: 30, b: 60 }, armR: { a: 20, b: 40 }, ...faceAt(t, [[0, 'neutral'], [70, 'smug']]) }) as P, t, 6);
  return (
    <g>
      <g transform={vcam(540, 1200, push(t, len, 1, 1.1))}>
        <Room t={t + 60} fy={1000} win={-900} />
        <rect x={-600} y={g} width={2400} height={900} fill="#6A4430" stroke={INK} strokeWidth={8} />
        <rect x={-600} y={g} width={2400} height={30} fill="#8A5E3E" />
        <ellipse cx={440} cy={g + 14} rx={260} ry={22} fill="#000" opacity={0.3} />
        <ellipse cx={440} cy={g - 4} rx={250} ry={46} fill="#B8BCC8" stroke={INK} strokeWidth={7} />
        <ellipse cx={440} cy={g - 8} rx={190} ry={30} fill="#D8DCE6" />
        <ellipse cx={400} cy={g - 12} rx={70} ry={10} fill="#FFF" opacity={0.5} />
        <TeaGlass x={830} y={g + 4} s={3.4} fill={0.8} t={t} steam />
        <Fig look={RAMU} pose={r} rimId="rimR" />
      </g>
      <Say y={420} text="ഇത്ര ചെറുതായാൽ," size={96} color="#6FD0E0" t={t - 2} />
      <Say y={560} text="നീ ആദ്യം എന്ത് ചെയ്യും?" size={96} t={t - 20} />
    </g>
  );
};

// ------------------------------------------------------------------ E: day 5, 5 cm, the cat
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1640;
  const r = life(at(330, g, 0.85, { yaw: 0.5, look: kf(t, [[0, 0.3], [60, 0.8]]), headTilt: kf(t, [[0, 0], [60, -24]]), armL: { a: 14, b: 10 }, armR: { a: 18, b: -10 }, ...faceAt(t, [[0, 'neutral'], [60, 'worried']]) }), t, 7);
  const lean = kf(t, [[0, 0], [len, 120]]);
  return (
    <g>
      <g transform={vcam(540, 1150, push(t, len, 1, 1.08))}>
        <Room t={t} fy={1300} win={-60} night={false} />
        <rect x={-600} y={g - 2} width={2400} height={900} fill="#8A3324" />
        {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={-100 + i * 260} cy={g + 40 + i * 30} rx={200} ry={10} fill="#F6CFA0" opacity={0.08} />)}
        <g transform={`translate(${-lean * 0.4} ${lean * 0.3})`}>
          <CatHead x={820} y={880} s={1.4} look={-0.6} t={t} />
          {[-1, 1].map((k) => <ellipse key={k} cx={760 + k * 190} cy={g - 40} rx={120} ry={70} fill="#3A3E57" stroke={INK} strokeWidth={8} />)}
        </g>
        <ellipse cx={330} cy={g + 4} rx={60} ry={9} fill="#000" opacity={0.35} />
        <Fig look={RAMU} pose={r} rimId="rimR" />
      </g>
      <TimeTag t={t - 2} label="ദിവസം 5 ·" value="5 cm" />
    </g>
  );
};

export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const lick = clamp((t - 30) / 6) * (1 - clamp((t - 52) / 8));
  const r = life(at(540, 1880, 0.9, { yaw: 0, look: 0, headTilt: -16, armL: { a: 60, b: 40 }, armR: { a: 60, b: -40 }, squash: t > 34 ? 0.05 : 0, ...faceAt(t, [[0, 'worried'], [34, 'shock']]) }), t, 8);
  return (
    <g transform={vcam(540, 1100, push(t, len, 1.02, 1.1))}>
      <rect x={-600} y={-600} width={2400} height={3200} fill="#3A2A34" />
      <CatHead x={540} y={820} s={1.85} lick={lick} look={0} t={t} />
      <rect x={-600} y={1880} width={2400} height={800} fill="#8A3324" />
      <ellipse cx={540} cy={1884} rx={70} ry={10} fill="#000" opacity={0.4} />
      <Fig look={RAMU} pose={r} rimId="rimR" />
    </g>
  );
};

// ------------------------------------------------------------------ F: the fact, a shrew the same size
export const F1: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1640;
  const r = life(at(300, g, 1, { yaw: 0.6, look: 0.8, armL: { a: 14, b: 10 }, armR: { a: 18, b: -10 }, ...faceAt(t, [[0, 'neutral'], [60, 'worried']]) }), t, 2);
  const sh = 1.65;
  return (
    <g>
      <g transform={vcam(540, 1200, push(t, len, 1, 1.06))}>
        <Room t={t + 120} fy={1260} win={560} />
        <rect x={-600} y={g - 2} width={2400} height={900} fill="#8A3324" />
        <ellipse cx={300} cy={g + 4} rx={70} ry={10} fill="#000" opacity={0.35} />
        <Fig look={RAMU} pose={r} rimId="rimR" />
        <Shrew x={720} y={g} s={sh} t={t} />
        <Heart x={720} y={g - 330} s={0.9} t={t} rate={5} />
        <Heart x={300} y={topOf(r) - 60} s={0.6} t={t} rate={0.9} />
      </g>
      <FactCard t={t - 56} y={470} {...FACT} />
    </g>
  );
};

export const F2: React.FC<ShotProps> = ({ t, len }) => {
  const sh = Math.sin(t * 2.6) * 6;
  const r = life(at(540 + sh, 2350, 2.8, { yaw: 0.1, look: -0.2, armL: { a: 12, b: 30 }, armR: { a: 12, b: -30 }, headTilt: sh * 0.5, ...faceAt(t, [[0, 'worried']]) }), t, 3);
  const hd = headAt(r);
  return (
    <g>
      <g transform={vcam(540, 1100, push(t, len, 1, 1.05))}>
        <rect x={-600} y={-600} width={2400} height={3200} fill="#3A3048" />
        <Glow x={540} y={900} r={700} kind="cool" o={0.4} />
        <Fig look={RAMU} pose={r} rimId="rimBlue" />
        <Breath x={hd.x - 60} y={hd.y + 90} t={t} dir={-1} />
      </g>
      <FactCard t={t + 30} y={470} {...FACT} />
    </g>
  );
};

// ------------------------------------------------------------------ G: the twist, never zero
export const G1: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1500;
  const n = 9;
  const reveal = (i: number) => clamp((t - i * 4) / 5);
  let x = 120;
  const figs: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const s = 1.5 / Math.pow(2, i);
    const k = reveal(i);
    if (k > 0) {
      const p = at(x, g, s * (0.6 + 0.4 * k), { yaw: 0.5, look: 0.8, ...faceAt(t, [[0, 'worried']]) });
      figs.push(<Fig key={i} look={RAMU} pose={p} rimId="rimR" />);
    }
    x += 230 * Math.pow(0.62, i) + 50 / (i + 1);
  }
  return (
    <g transform={vcam(540, 1150, push(t, len, 1, 1.12))}>
      <rect x={-600} y={-600} width={2400} height={3200} fill="#140E24" />
      <Glow x={x} y={g - 20} r={260 + Math.sin(t / 4) * 20} kind="warm" o={0.8} />
      <rect x={-600} y={g} width={2400} height={4} fill="#3A3058" />
      <Dust t={t} seed={4} x0={0} y0={900} w={1080} h={700} n={20} o={0.35} />
      {figs}
      <circle cx={x} cy={g - 6} r={5} fill="#FFE9B8" />
    </g>
  );
};

export const G2: React.FC<ShotProps> = ({ t, len }) => {
  const r = life({ x: 360, y: 1180 + Math.sin(t / 14) * 20, scale: 1.25, yaw: 0.5, look: 0.8, tilt: 10 + Math.sin(t / 18) * 8, legL: { a: 30, b: -40 }, legR: { a: -10, b: -20 }, armL: { a: 60, b: 20 }, armR: { a: 50, b: -40 }, ...faceAt(t, [[0, 'worried'], [70, 'shock']]) }, t, 5);
  return (
    <g>
      <g transform={vcam(540, 1150, push(t, len, 1, 1.1))}>
        <rect x={-600} y={-600} width={2400} height={3200} fill="#0E2430" />
        {Array.from({ length: 26 }).map((_, i) => <circle key={i} cx={rnd(7, i) * 1300 - 100} cy={rnd(9, i) * 2000 + Math.sin(t / 20 + i) * 20} r={6 + rnd(11, i) * 30} fill="#6FD0E0" opacity={0.08 + rnd(13, i) * 0.1} />)}
        <circle cx={540} cy={1150} r={560} fill="#3A8AA0" opacity={0.18} stroke="#9EE8F4" strokeWidth={8} />
        <path d="M 160 900 Q 240 700 420 640" stroke="#E8FBFF" strokeWidth={18} fill="none" opacity={0.5} strokeLinecap="round" />
        <Virus x={780} y={1180 - Math.sin(t / 14) * 20} r={150} t={t} />
        <Fig look={RAMU} pose={r} rimId="rimBlue" />
      </g>
      <TimeTag t={t - 2} label="ദിവസം" value="24" />
    </g>
  );
};

// ------------------------------------------------------------------ H: the comment question, tonight
export const H1: React.FC<ShotProps> = ({ t, len }) => {
  const g = 1600;
  const r = life(at(470, 1560, 1.45, { yaw: kf(t, [[0, 0.7], [30, 0.2]]), look: kf(t, [[0, 0.7], [30, 0]]), legL: { a: 82, b: -6 }, legR: { a: 80, b: -4 }, armL: { a: 10, b: 10 }, armR: { a: 14, b: -10 }, ...faceAt(t, [[0, 'worried'], [30, 'shock']]), blink: 0 }), t, 9);
  return (
    <g>
      <g transform={vcam(540, 1150, push(t, len, 1.04, 1.1))}>
        <Room t={t} fy={1300} night win={-900} />
        <Glow x={300} y={900} r={600} kind="cool" o={0.35} />
        <rect x={-100} y={1240} width={60} height={500} fill="#3A2418" stroke={INK} strokeWidth={6} />
        <rect x={-100} y={1500} width={1000} height={160} fill="#E8DCC8" stroke={INK} strokeWidth={8} />
        <rect x={-100} y={1660} width={1000} height={60} fill="#4A2C20" stroke={INK} strokeWidth={6} />
        <path d="M 40 1440 Q 0 1380 80 1370 L 260 1370 Q 320 1380 300 1450 Z" fill="#F4EEE2" stroke={INK} strokeWidth={7} />
        <Fig look={RAMU} pose={r} rimId="rimBlue" />
        <path d="M 150 1490 Q 520 1400 800 1450 L 800 1680 L 150 1680 Z" fill="#3E6E8A" stroke={INK} strokeWidth={8} />
        <rect x={780} y={1380} width={240} height={360} fill="#4A2C20" stroke={INK} strokeWidth={6} />
        <AlarmClock x={880} y={1380} s={0.8} text="11:59" />
        <Glow x={880} y={1330} r={260} kind="red" o={0.35} />
      </g>
      <Say y={420} text="ഇന്ന് രാത്രി," size={110} color="#FFB15A" t={t - 2} />
      <Say y={570} text="നീ ഉറങ്ങുമോ?" size={130} t={t - 20} />
    </g>
  );
};

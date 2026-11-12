// awake-short-ml: "What if you stayed awake for 11 days?" A native 9:16 Short, teasing the "humans never slept" long video.
// The facts are one real teenager's record from 1964; Pip acts them out in Kerala, and the jokes stay in the picture.
import React from 'react';
import { faceAt, kf, clamp, easeOut, backOut, ShotProps, FONT, Glow, Dust, Foreground, Pose, rnd, DizzyStars } from '../../engine';
import { Fig, Sky, Palm, headAt, handAt, PIP, MOM } from '../fly-ml/kit';
import { ground, vcam, UNCLE, Tache, Say, TeaGlass, Mundu, Cobweb } from '../phone-ml/kit';
import { Tusker } from '../monsoon-ml/kit';

const INK = '#1A1230';
type P = Partial<Pose>;
const push = (t: number, len: number, a: number, b: number) => kf(t, [[0, a], [len, b]]);
const at = (x: number, g: number, s: number, extra: P = {}): P => ({ x, y: ground(g, s), scale: s, ...extra });

/** How many days have gone: a pill near the top with eleven dots. */
const Day: React.FC<{ day: number; t: number }> = ({ day, t }) => {
  const k = backOut(clamp(t / 6));
  return (
    <g transform={`translate(540 310) scale(${k})`}>
      <rect x={-260} y={-84} width={520} height={168} rx={40} fill="#120E22" opacity={0.82} />
      <rect x={-260} y={-84} width={520} height={168} rx={40} fill="none" stroke="#FFB15A" strokeWidth={4} />
      <text y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3">ദിവസം <tspan fill="#FFB15A">{day}</tspan></text>
      {Array.from({ length: 11 }).map((_, i) => <circle key={i} cx={-200 + i * 40} cy={52} r={11} fill={i < day ? '#FFB15A' : '#4A4458'} />)}
    </g>
  );
};
/** The house at night: wall, floor from y 1450, the bulb, a window and a wall clock. */
const Home: React.FC<{ t: number; children?: React.ReactNode; bulb?: number }> = ({ t, children, bulb = 1 }) => (
  <g>
    <rect x={-300} y={-300} width={1700} height={1760} fill="#4A3E52" />
    <rect x={-300} y={1450} width={1700} height={800} fill="#33272E" />
    <rect x={-300} y={1444} width={1700} height={14} fill="#201822" />
    <rect x={90} y={540} width={300} height={380} fill="#10183A" stroke={INK} strokeWidth={8} />
    <circle cx={290} cy={640} r={42} fill="#F1EBD0" />
    {[240, 90].map((d) => <line key={d} x1={90 + d} x2={90 + d} y1={540} y2={920} stroke={INK} strokeWidth={6} />)}
    {children}
    <line x1={540} y1={-40} x2={540} y2={440} stroke={INK} strokeWidth={6} />
    <circle cx={540} cy={470} r={34} fill="#FFE9B8" />
    <Glow x={540} y={480} r={820} kind="warm" o={0.72 * bulb} />
    <Dust t={t} seed={3} x0={200} y0={500} w={700} h={700} n={18} o={0.4} />
  </g>
);
const Table: React.FC<{ y: number; x0?: number; x1?: number }> = ({ y, x0 = 80, x1 = 1000 }) => (
  <g>
    <rect x={x0 + 40} y={y + 26} width={30} height={500} fill="#3A2820" stroke={INK} strokeWidth={5} />
    <rect x={x1 - 70} y={y + 26} width={30} height={500} fill="#3A2820" stroke={INK} strokeWidth={5} />
    <rect x={x0} y={y} width={x1 - x0} height={34} fill="#7A5236" stroke={INK} strokeWidth={6} />
  </g>
);

// ============================================================ A. THE PREMISE, ALREADY GOING WRONG
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = at(350, 1760, 2.2, { yaw: 0.5, look: 0.2, headTilt: 6, armR: { a: 92, b: -16 }, ...faceAt(t, [[0, 'tired']]), blink: 0 });
  const h = handAt(p, 'R');
  const px = h.x + 150;
  return (
    <g transform={vcam(540, 1060, push(t, len, 1.05, 1))}>
      <Home t={t} />
      <Table y={1260} />
      <TeaGlass x={880} y={1260} s={1.7} fill={0.05} t={t} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      {/* the kettle, the tea going everywhere but the glass */}
      <g transform={`translate(${h.x + 30} ${h.y - 20}) rotate(26)`}>
        <rect x={-60} y={-70} width={150} height={130} rx={36} fill="#C8CCD8" stroke={INK} strokeWidth={6} />
        <path d="M 90 -36 L 170 -68 L 176 -40 L 90 -4 Z" fill="#C8CCD8" stroke={INK} strokeWidth={6} />
      </g>
      {Array.from({ length: 14 }).map((_, i) => { const ph = ((t * 22 + i * 40) % 380); return <circle key={i} cx={px + 40 + Math.sin(i) * 6} cy={h.y + ph * 0.86 - 40} r={13} fill="#A9622E" opacity={0.92} />; })}
      <ellipse cx={px + 44} cy={1262} rx={130 + Math.min(100, t * 1.2)} ry={13} fill="#A9622E" />
      <path d={`M ${px + 120} 1266 q 8 ${50 + Math.sin(t / 8) * 10} 2 ${120 + (t % 40)}`} stroke="#A9622E" strokeWidth={13} fill="none" strokeLinecap="round" />
      <text x={540} y={320} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={12} fill="#FFE27A">WHAT IF...</text>
      <Say y={470} text="പതിനൊന്ന് ദിവസം" size={92} color="#6FD0E0" />
      <Say y={610} text="ഉറങ്ങാതിരുന്നാൽ?" size={100} color="#FFFFFF" />
    </g>
  );
};
export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={vcam(540, 960, push(t, len, 1.02, 1.08))}>
    <rect x={-300} y={-300} width={1700} height={2500} fill="#C9A87A" />
    <rect x={-300} y={1360} width={1700} height={900} fill="#8A6A4E" />
    {[120, 480, 840].map((x) => <g key={x}><rect x={x - 130} y={620} width={260} height={360} fill="#E8D8B0" stroke={INK} strokeWidth={6} />{Array.from({ length: 7 }).map((_, i) => <rect key={i} x={x - 100} y={660 + i * 40} width={200 * (i % 3 === 2 ? 0.6 : 1)} height={11} fill="#8A7A5E" />)}</g>)}
    <Fig look={PIP} pose={at(540, 1600, 1.7, { yaw: 0.1, look: 0.1, armR: { a: 150, b: -12 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" />
    <rect x={120} y={1400} width={840} height={36} fill="#5E3C2A" stroke={INK} strokeWidth={6} />
    <rect x={160} y={1436} width={760} height={300} fill="#6E4A34" stroke={INK} strokeWidth={6} />
    <text x={540} y={1570} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#F6EFE3">സയൻസ് ഫെയർ</text>
    <rect x={-300} y={-300} width={1700} height={2500} fill="#A9722E" opacity={0.16} />
    <Say y={300} t={t - 2} text="1964" size={200} color="#FFE27A" />
    <Say y={480} t={t - 14} text="17 വയസ്സ്" size={100} />
    <Say y={1810} t={t - 34} text="264 മണിക്കൂർ" size={120} color="#FFE27A" />
  </g>
);

// ============================================================ B. THE DAYS
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const open = clamp((t - 34) / 10);
  const m: P = at(760, 1730, 1.7, { yaw: -0.5, look: -0.8, armL: { a: 72, b: -8 }, ...faceAt(t, [[0, 'neutral'], [50, 'shock']]) });
  const p: P = at(190, 1780, 1.5, { yaw: 0.4, look: 0.5, armR: { a: 76, b: -30 }, ...faceAt(t, [[0, 'tired']]) });
  const ph = handAt(p, 'R');
  return (
    <g transform={vcam(540, 1060, push(t, len, 1, 1.06))}>
      <Home t={t} />
      {/* the fridge, and what is in it */}
      <rect x={290} y={620} width={420} height={860} fill="#D8DEE4" stroke={INK} strokeWidth={7} />
      <rect x={312} y={648} width={376} height={806} fill="#F4F8FA" />
      {[930, 1180].map((y) => <rect key={y} x={312} y={y} width={376} height={12} fill="#B8C4CC" />)}
      <rect x={350} y={830} width={80} height={100} rx={14} fill="#E8D8A8" stroke={INK} strokeWidth={4} />
      <rect x={560} y={1040} width={100} height={140} fill="#E2A23E" stroke={INK} strokeWidth={4} />
      {/* his chappals on the milk shelf */}
      {[0, 1].map((i) => <g key={i} transform={`translate(${430 + i * 110} 912) rotate(${i ? 6 : -4})`}><ellipse rx={50} ry={17} fill="#3E7CA8" stroke={INK} strokeWidth={4} /><path d="M -8 -12 Q 14 -30 30 -8" stroke="#E4DCC8" strokeWidth={7} fill="none" /></g>)}
      <Glow x={500} y={1000} r={520 * open + 10} kind="cool" o={0.7 * open} />
      {/* the door swings from closed to open */}
      <g transform={`translate(710 620) scale(${1 - open * 0.84} 1)`}><rect x={-420} y={0} width={420} height={860} fill="#C8CED6" stroke={INK} strokeWidth={7} /><rect x={-390} y={330} width={18} height={150} fill="#7A8290" /></g>
      <Fig look={MOM} pose={m} rimId="rimL" />
      <Fig look={PIP} pose={p} rimId="rimR" />
      {/* the milk packet he is trying to wear */}
      <g transform={`translate(${ph.x + 10} ${ph.y + 18})`}><rect x={-44} y={-60} width={88} height={120} rx={10} fill="#EFF4FA" stroke={INK} strokeWidth={4} /><rect x={-44} y={-16} width={88} height={32} fill="#3E7CA8" /></g>
      <Day day={3} t={t - 2} />
    </g>
  );
};
const Goat: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={140} ry={15} fill="#000" opacity={0.3} />
    {[-80, -44, 54, 88].map((lx) => <rect key={lx} x={lx - 9} y={-92} width={18} height={92} fill="#E4DCC8" stroke={INK} strokeWidth={4} />)}
    <ellipse cx={0} cy={-122} rx={120} ry={56} fill="#F0E8D8" stroke={INK} strokeWidth={5} />
    <g transform={`translate(-130 -176) rotate(${Math.sin(t / 7) * 6})`}>
      <ellipse rx={46} ry={36} fill="#F0E8D8" stroke={INK} strokeWidth={5} />
      <path d="M -20 -30 Q -34 -66 -56 -70 M 10 -32 Q 12 -70 -6 -80" stroke="#8A7A5E" strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={-16} cy={-8} r={6} fill={INK} />
      <path d="M -30 28 q 2 28 -8 42" stroke="#D8CDB4" strokeWidth={8} fill="none" />
    </g>
  </g>
);
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const sign = t > 36;
  const p: P = at(420, 1660, 1.55, { yaw: 0.45, look: 0.6, tilt: 3, armR: sign ? { a: 92 + Math.sin(t / 2) * 6, b: -18 } : { a: 165, b: -8 }, armL: sign ? { a: 14, b: -6 } : { a: 160, b: -6 }, ...faceAt(t, [[0, 'tired'], [10, 'cool']]), blink: 0 });
  const h = handAt(p, 'R');
  return (
    <g transform={vcam(540, 1040, push(t, len, 1, 1.05))}>
      <Sky id="b2" mode="dusk" y0={0} y1={1240} />
      <Palm x={-40} y={1240} s={1.2} t={t} dark /><Palm x={1100} y={1240} s={1.1} t={t + 40} dark />
      {/* the stadium only he can see */}
      <g opacity={0.26}>
        <path d="M -200 1230 L -200 620 L 1300 620 L 1300 1230 Z" fill="#EDE6D6" />
        {Array.from({ length: 96 }).map((_, i) => <circle key={i} cx={-140 + (i % 16) * 88 + (Math.floor(i / 16) % 2) * 40} cy={670 + Math.floor(i / 16) * 88 + Math.sin(t / 3 + i) * 7} r={26} fill={['#C8352E', '#3E7CA8', '#E2B02C', '#2E7E5A'][i % 4]} />)}
      </g>
      {[[160, 660], [930, 720], [560, 620]].map(([x, y], i) => (t + i * 13) % 34 < 5 ? <Glow key={i} x={x} y={y} r={200} kind="warm" o={1} /> : null)}
      <rect x={-300} y={1230} width={1700} height={900} fill="#4E8A3E" />
      <rect x={-300} y={1230} width={1700} height={14} fill="#F6EFE3" opacity={0.6} />
      <Fig look={PIP} pose={p} rimId="rimR" shadow={0.5} />
      <Goat x={800} y={1680} s={1.45} t={t} />
      {sign ? <path d={`M ${h.x} ${h.y} q 26 -10 40 8 q 16 -18 34 -2`} stroke="#1E2A5E" strokeWidth={7} fill="none" /> : null}
      <Day day={4} t={t - 2} />
    </g>
  );
};
const Tree: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#1E4A2E' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-620} width={80} height={620} fill="#3A2A22" stroke={INK} strokeWidth={5} />
    {[[-110, -640, 190], [100, -680, 180], [0, -820, 220]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={c} stroke={INK} strokeWidth={5} />)}
  </g>
);
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 34);
  return (
    <g transform={vcam(540, 1060, push(t, len, 1.04, 1.1))}>
      <Home t={t + 40} />
      <g opacity={k}>
        <rect x={-300} y={-300} width={1700} height={2500} fill="#16321E" />
        {[[80, 1400, 1], [980, 1420, 1.1], [300, 1300, 0.66], [800, 1310, 0.7], [540, 1240, 0.46]].map(([x, y, s], i) => <Tree key={i} x={x} y={y} s={s} c={['#1E4A2E', '#26592E', '#2E6A3A'][i % 3]} />)}
        <path d="M 200 2000 Q 500 1500 500 1250 L 590 1250 Q 620 1500 1000 2000 Z" fill="#8A6A4A" />
        {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={rnd(3, i) * 1080} cy={1000 + rnd(4, i) * 700} r={3 + rnd(5, i) * 4} fill="#FFE9A8" opacity={0.5 + 0.4 * Math.sin(t / 8 + i)} />)}
        <Tusker x={850} y={1560} s={0.86} t={t} flip />
      </g>
      {/* the house's own things, still there in the forest */}
      <g transform="translate(240 1500)"><rect x={-130} y={-200} width={260} height={150} rx={8} fill="#14141C" stroke="#3A3A48" strokeWidth={5} /><rect x={-20} y={-50} width={40} height={50} fill="#3A2820" /><Glow x={0} y={-120} r={180} kind="cool" o={0.4} /></g>
      <Fig look={PIP} pose={at(540, 1840, 2.0, { yaw: 0.05, look: 0.0, headTilt: -6, armR: { a: 60, b: -24 }, armL: { a: 60, b: -24 }, ...faceAt(t, [[0, 'tired'], [40, 'shock']]) })} rimId="rimR" />
      <Day day={5} t={t - 2} />
    </g>
  );
};

// ============================================================ D. DAY 11
const SEVENS = ['100', '93', '86', '79', '72', '65'];
const Slate: React.FC<{ n: number; x?: number; y?: number; s?: number }> = ({ n, x = 540, y = 840, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-320} width={840} height={640} rx={14} fill="#1E3A34" stroke="#6E4E36" strokeWidth={22} />
    {SEVENS.slice(0, n).map((v, i) => (
      <text key={v} x={-220 + (i % 2) * 440} y={-140 + Math.floor(i / 2) * 200} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={150} fill={i === 5 ? '#FFB15A' : '#E8E4DA'}>{v}</text>
    ))}
  </g>
);
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const n = 1 + Math.min(4, Math.floor(t / 24));
  const d: P = at(860, 1800, 1.6, { yaw: -0.45, look: -0.6, armL: { a: 30, b: -40 } });
  return (
    <g transform={vcam(540, 1040, push(t, len, 1, 1.04))}>
      <Home t={t + 90} bulb={0.7} />
      <Slate n={n} y={800} s={0.9} />
      <Fig look={UNCLE} pose={d} rimId="rimL" />
      <Mundu pose={d} /><Tache pose={d} specs sides="#D8D4CC" />
      <Fig look={PIP} pose={at(240, 1800, 1.72, { yaw: 0.35, look: 0.3, tilt: 5 + Math.sin(t / 14) * 2, headTilt: 12, armR: { a: 18, b: -8 }, ...faceAt(t, [[0, 'tired']]), blink: 0.45 })} rimId="rimR" />
      <Day day={11} t={t - 2} />
    </g>
  );
};
export const D2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={vcam(540, 860, push(t, len, 1.3, 1.42))}>
    <Home t={t + 130} bulb={0.7} />
    <Slate n={6} y={860} s={1} />
    <Say y={1280} t={t - 12} text="ഇവിടെ നിന്നു" size={108} color="#FFE27A" />
  </g>
);
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 520, y: 1570, scale: 3.6, yaw: 0.05, look: 0, headTilt: 5, ...faceAt(t, [[0, 'tired']]), blink: 0.3 };
  const h = headAt(p);
  const fx = h.x + kf(t, [[20, 330], [70, 40]]);
  const fy = h.y + kf(t, [[20, -240], [70, 96]]);
  const wave = t > 74 ? Math.sin(t / 3) * 150 : 900;
  return (
    <g transform={vcam(540, 1020, push(t, len, 1, 1.05))}>
      <Home t={t + 150} bulb={0.6} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      {/* a fly lands on his nose; he doesn't notice */}
      <g transform={`translate(${fx} ${fy})`}><ellipse rx={18} ry={12} fill="#1A1622" /><path d={`M -6 -8 q -22 ${-16 + Math.sin(t * 2) * 8} -30 2 M 6 -8 q 22 ${-16 + Math.sin(t * 2) * 8} 30 2`} stroke="#E8E4DA" strokeWidth={5} fill="none" opacity={0.7} /></g>
      {/* someone waves a hand across his eyes */}
      <g transform={`translate(${540 + wave} ${h.y - 30})`}><circle r={90} fill="#C69A74" stroke={INK} strokeWidth={6} /><path d="M 60 40 L 700 340" stroke="#EFE8D8" strokeWidth={120} strokeLinecap="round" /></g>
    </g>
  );
};
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const st = clamp((t - 56) / 5);
  return (
    <g transform={vcam(540, 960, push(t, len, 1, 1.06))}>
      <rect x={-300} y={-300} width={1700} height={2500} fill="#1E1626" />
      <Glow x={540} y={900} r={760} kind="warm" o={0.34} />
      <g transform="translate(540 960) rotate(-4)">
        <rect x={-360} y={-470} width={720} height={940} rx={18} fill="#2E5E4E" stroke={INK} strokeWidth={8} />
        <rect x={-320} y={-430} width={640} height={860} fill="none" stroke="#E2B02C" strokeWidth={6} />
        <text y={-120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#E2B02C">റെക്കോർഡ്</text>
        <text y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#F6EFE3">ഉറങ്ങാതെ</text>
        <text y={140} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={60} fill="#F6EFE3">264 h</text>
      </g>
      {t > 56 ? <g transform={`translate(540 960) rotate(-14) scale(${1.5 - 0.5 * st})`} opacity={st}>
        <rect x={-340} y={-90} width={680} height={180} rx={18} fill="none" stroke="#FF4A3E" strokeWidth={16} />
        <text y={46} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FF4A3E">നിർത്തി</text>
      </g> : null}
      <Cobweb x={140} y={420} r={150} o={0.5} />
    </g>
  );
};
export const F1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={vcam(540, 1100, push(t, len, 1.02, 1))}>
    <Home t={t + 200} bulb={0.5} />
    <Table y={1320} />
    <Fig look={PIP} pose={at(540, 1820, 1.9, { yaw: 0.1, look: 0, tilt: 3, headTilt: 26, armR: { a: 80, b: -60 }, armL: { a: 80, b: -60 }, ...faceAt(t, [[0, 'tired']]), blink: 1 })} rimId="rimR" />
    <rect x={80} y={1320} width={920} height={34} fill="#7A5236" stroke={INK} strokeWidth={6} />
    {['Z', 'Z', 'Z'].map((z, i) => { const ph = ((t + i * 24) % 72) / 72; return <text key={i} x={690 + i * 40 + ph * 60} y={1000 - ph * 240} fontFamily={FONT.title} fontWeight={800} fontSize={64 + i * 22} fill="#BFE4F4" opacity={1 - ph}>{z}</text>; })}
    <Say y={460} t={t - 2} text="നീ ഏറ്റവും കൂടുതൽ" size={94} />
    <Say y={620} t={t - 8} text="എത്ര മണിക്കൂർ?" size={110} color="#FFB15A" />
  </g>
);

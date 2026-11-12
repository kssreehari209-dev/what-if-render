import React from 'react';
import {
  Hero, basePose, Pose, poseAt, faceAt, kf, clamp, easeOut, easeIn, backOut, camT, LOOKS, LEG_LEN,
  Kitchen, KITCHEN, stand, Bedroom, BEDROOM, WINDOW, Rooftop, Study, STUDY, Schematic, SCH, Arrow, DrawOn,
  Cat, Cookie, TitleCard, ShotProps, FONT, Expr,
} from '../../engine';
import { Dog, Crow, Bubble, Fish, Bowl, FaceIcon } from '../animals-ml/shots';

// Part 2 of animals-ml: the same rooftop, kitchen and bedroom, the same cast, a longer story.
const PIP = LOOKS.ramu;
const MO = LOOKS.appu;
const AMBER = '#FFB15A';
const ROOF_FEET = 840;
const roofPose = (x: number, s: number, p: Partial<Pose> = {}): Partial<Pose> => ({ x, y: ROOF_FEET - LEG_LEN * s, scale: s, ...p });
const face = (t: number, keys: [number, Expr][]) => faceAt(t, keys);
const Fig: React.FC<Omit<React.ComponentProps<typeof Hero>, 'pose'> & { pose: Partial<Pose> }> = ({ pose, ...rest }) => <Hero {...rest} pose={{ ...basePose, ...pose }} />;
/** legs and arms swinging, for a run */
const runLimbs = (t: number, k = 1): Partial<Pose> => {
  const s = Math.sin(t / 2.4);
  return { legL: { a: 30 * s * k, b: -20 }, legR: { a: -30 * s * k, b: -20 }, armL: { a: -40 * s * k, b: -40 }, armR: { a: 40 * s * k, b: -40 }, tilt: 8 * k };
};

/** A bubble placed and scaled in the shot. */
const Say: React.FC<{ x: number; y: number; s: number; t: number; text: string; size?: number; tx?: number; ty?: number; children?: React.ReactNode }> = ({ x, y, s, t, text, size = 70, tx = -60, ty = 150, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Bubble x={0} y={0} t={t} text={text} size={size} tailX={tx} tailY={ty}>{children}</Bubble>
  </g>
);

/** A schematic heading, top left. */
const Head: React.FC<{ text: string }> = ({ text }) => (
  <text x={180} y={170} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill={SCH.dim}>{text}</text>
);
const Big: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; t?: number; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, text, size = 120, color = SCH.line, t = 99, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} opacity={clamp(t / 6)}>{text}</text>
);
const Fade: React.FC<{ t: number; len: number; n?: number }> = ({ t, len, n = 14 }) =>
  t > len - n ? <rect x={-3000} y={-3000} width={8000} height={8000} fill="#000" opacity={clamp((t - (len - n)) / (n - 2))} /> : null;
/** the flashback grade: warm, washed, vignetted */
const Sepia: React.FC = () => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="#B5824A" opacity={0.3} />
    <radialGradient id="vig2" cx="50%" cy="50%" r="70%"><stop offset="55%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#1A0E04" stopOpacity={0.7} /></radialGradient>
    <rect x={-3000} y={-3000} width={8000} height={8000} fill="url(#vig2)" />
  </g>
);

// ---------- new props ----------
const Peanut: React.FC<{ x: number; y: number; s?: number; r?: number }> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M -16 0 C -16 -12 -4 -12 0 -6 C 4 -12 16 -12 16 0 C 16 12 4 12 0 6 C -4 12 -16 12 -16 0 Z" fill="#D9A866" stroke="#7A5530" strokeWidth={2.5} />
  </g>
);
const PeanutBowl: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }).map((_, i) => <Peanut key={i} x={-34 + (i % 5) * 17} y={-26 - Math.floor(i / 5) * 10} s={0.8} r={i * 37} />)}
    <Bowl x={0} y={0} s={1} />
  </g>
);
const Pebble: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={22} ry={15} fill="#9FD8E8" stroke="#1A1230" strokeWidth={3} />
    <path d="M -10 -6 L -2 -9" stroke="#FFF" strokeWidth={3} strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => {
      const a = (i * Math.PI) / 2 + t / 10;
      const k = 0.5 + 0.5 * Math.sin(t / 4 + i);
      return <line key={i} x1={Math.cos(a) * 30} y1={Math.sin(a) * 24} x2={Math.cos(a) * (36 + 10 * k)} y2={Math.sin(a) * (30 + 10 * k)} stroke="#FFF7C8" strokeWidth={3} strokeLinecap="round" />;
    })}
  </g>
);
const Kite: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t / 8) * 10})`}>
    <path d="M 0 -60 L 40 0 L 0 70 L -40 0 Z" fill="#E2574C" stroke="#1A1230" strokeWidth={4} />
    <path d="M 0 -60 L 0 70 M -40 0 L 40 0" stroke="#1A1230" strokeWidth={2} />
    <path d="M 0 70 q 20 30 0 60 q -20 30 0 60" stroke="#1A1230" strokeWidth={2} fill="none" />
  </g>
);
const Nest: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={60} ry={22} fill="#6B4A2E" />
    {[-40, -20, 0, 20, 40].map((dx, i) => <path key={i} d={`M ${dx - 24} ${-4 + (i % 2) * 8} L ${dx + 24} ${4 - (i % 2) * 8}`} stroke="#8C6440" strokeWidth={4} />)}
  </g>
);
/** a pole with a nest at the left end of the roof's wire */
const Pole: React.FC = () => (
  <g>
    <rect x={232} y={360} width={16} height={480} fill="#1A1622" />
    <rect x={200} y={370} width={80} height={10} fill="#1A1622" />
    <Nest x={240} y={356} s={0.9} />
  </g>
);
const Bee: React.FC<{ x: number; y: number; s?: number; r?: number; f: number }> = ({ x, y, s = 1, r = 0, f }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <ellipse cx={-6} cy={-22} rx={18} ry={12} fill="#DDEBFF" opacity={0.75} transform={`rotate(${Math.sin(f * 2) * 25} -6 -10)`} />
    <ellipse cx={10} cy={-22} rx={18} ry={12} fill="#DDEBFF" opacity={0.75} transform={`rotate(${-Math.sin(f * 2) * 25} 10 -10)`} />
    <ellipse cx={0} cy={0} rx={34} ry={20} fill="#F2C23A" stroke="#1A1230" strokeWidth={3} />
    <path d="M -10 -19 L -10 19 M 6 -19 L 6 19" stroke="#1A1230" strokeWidth={7} />
    <circle cx={30} cy={-2} r={12} fill="#1A1230" />
  </g>
);
const Elephant: React.FC<{ x: number; y: number; s?: number; f: number; flip?: boolean; call?: number }> = ({ x, y, s = 1, f, flip = false, call = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="none" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round">
    <path d="M -120 0 L -120 -40 Q -130 -150 -20 -150 Q 70 -150 80 -70 L 80 0" />
    <path d="M -100 0 L -100 -30 M 60 0 L 60 -30" />
    <circle cx={100} cy={-110} r={52} />
    <path d="M 70 -150 Q 30 -120 50 -60 Q 80 -70 90 -100" />
    <path d={`M 140 -90 Q 170 -40 ${150 + call * 20} ${-10 - call * 40}`} />
    <circle cx={118} cy={-120} r={5} fill={SCH.line} />
    <path d={`M -120 -100 q -30 ${10 + Math.sin(f / 6) * 6} -30 40`} />
  </g>
);
const Dolphin: React.FC<{ x: number; y: number; s?: number; f: number; flip?: boolean; color?: string }> = ({ x, y, s = 1, f, flip = false, color = SCH.line }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 8) * 8}) scale(${flip ? -s : s} ${s})`} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round">
    <path d="M -130 10 Q -60 -60 60 -30 Q 110 -20 140 0 Q 110 10 60 10 Q -40 30 -110 30 Z" />
    <path d="M -10 -44 L 10 -80 L 30 -36" />
    <path d="M -110 20 L -160 -10 L -150 30 L -160 60 Z" />
    <circle cx={90} cy={-12} r={5} fill={color} />
  </g>
);
const Rat: React.FC<{ x: number; y: number; s?: number; f: number; laugh?: number }> = ({ x, y, s = 1, f, laugh = 0 }) => (
  <g transform={`translate(${x} ${y + (laugh ? Math.abs(Math.sin(f / 2)) * -8 : 0)}) scale(${s})`} fill="none" stroke={SCH.line} strokeWidth={5}>
    <path d="M -70 0 Q -80 -70 0 -70 Q 70 -70 90 -10 L 110 0 Z" />
    <circle cx={30} cy={-74} r={20} />
    <circle cx={78} cy={-24} r={4} fill={SCH.line} />
    <path d={`M -70 -10 Q -140 ${-20 + Math.sin(f / 5) * 10} -170 30`} />
    {laugh ? <path d="M 80 -6 q 10 10 22 2" /> : null}
  </g>
);
const Person: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = SCH.line }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round">
    <circle cx={0} cy={-150} r={28} />
    <path d="M 0 -122 L 0 -50 M 0 -50 L -26 0 M 0 -50 L 26 0 M 0 -106 L -34 -70 M 0 -106 L 34 -70" />
  </g>
);
const CatIcon: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = SCH.line }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round">
    <path d="M -50 0 Q -60 -80 0 -80 Q 60 -80 50 0 Z" />
    <circle cx={0} cy={-110} r={36} />
    <path d="M -30 -134 L -26 -164 L -8 -144 M 30 -134 L 26 -164 L 8 -144" />
    <path d="M 50 -10 Q 100 -20 90 -80" />
  </g>
);
const Wave: React.FC<{ x: number; y: number; w: number; amp: number; per: number; t: number; color?: string; width?: number }> = ({ x, y, w, amp, per, t, color = SCH.live, width = 5 }) => {
  const pts: string[] = [];
  for (let i = 0; i <= w; i += 6) pts.push(`${x + i} ${y + Math.sin((i + t * 8) / per) * amp}`);
  return <path d={`M ${pts.join(' L ')}`} stroke={color} strokeWidth={width} fill="none" />;
};
const Rings: React.FC<{ x: number; y: number; t: number; max: number; color?: string; n?: number }> = ({ x, y, t, max, color = SCH.live, n = 4 }) => (
  <g fill="none" stroke={color} strokeWidth={4}>
    {Array.from({ length: n }).map((_, i) => {
      const p = (t / 40 + i / n) % 1;
      return <circle key={i} cx={x} cy={y} r={p * max} opacity={1 - p} />;
    })}
  </g>
);

// ---------- the wire of crows ----------
const WIRE = (x: number) => 430 + 70 * (1 - Math.pow((x - 960) / 860, 2));
const ROW = [300, 420, 540, 660, 780, 1140, 1260, 1380, 1500, 1620];
const WireCrows: React.FC<{ t: number; turn?: number; talk?: number[]; gone?: number }> = ({ t, turn = 1, talk = [], gone = 0 }) => (
  <g>
    <path d={`M 100 ${WIRE(100)} Q 960 ${WIRE(960) + 70} 1820 ${WIRE(1820)}`} stroke="#0E0C14" strokeWidth={4} fill="none" />
    {ROW.map((x, i) => {
      const k = clamp(turn * 1.4 - i * 0.04);
      const down = clamp(gone * 1.6 - i * 0.06);
      const y = WIRE(x) + 36 + easeIn(down) * (ROOF_FEET - WIRE(x) - 30);
      return <Crow key={i} x={x + down * (960 - x) * 0.4} y={y} s={0.75} f={t + i * 7} flip={x > 960 ? k < 0.5 : k > 0.5} look={k * 0.6} open={talk.includes(i) && Math.floor(t / 5) % 2 ? 1 : 0} />;
    })}
  </g>
);

// =========================================================== 1 cold open
// A1: wide, the wire of crows above Pip on the roof
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [{ f: 0, p: roofPose(960, 0.62, { look: 0.2 }) }, { f: 30, p: { headTilt: -8, look: -0.2 } }]);
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 570]]), kf(t, [[0, 1.25], [len, 1.4]]))}>
      <Rooftop t={t + 120} sunX={960} sunY={660} red={0.25} />
      <WireCrows t={t} turn={clamp(t / 30)} />
      <Fig look={PIP} pose={{ ...pip, ...face(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};
// A2: medium, along the wire, every head turned down at the camera
export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 520], [len, 760]]), 470, 2.6)}>
    <Rooftop t={t + 140} sunX={960} sunY={660} red={0.25} />
    <WireCrows t={t} turn={1} talk={[1, 3]} />
  </g>
);
// A3: close-up, Pip looking up, realising he can hear them
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 820, scale: 2.0, look: 0.2, headTilt: -10 } }, { f: 20, p: { look: -0.3, headTilt: -14 } }]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Rooftop t={t + 200} sunX={980} sunY={600} red={0.3} low={180} />
      <Fig look={PIP} pose={{ ...pose, ...face(t, [[0, 'worried'], [16, 'shock']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};
/** a crow close-up on the wire with a line of its own */
const crowSays = (text: string, flip: boolean, size = 70) => {
  const C: React.FC<ShotProps> = ({ t, len }) => {
    const x = flip ? 1260 : 660;
    return (
      <g transform={camT(x, WIRE(x) - 20, kf(t, [[0, 3.4], [len, 3.7]]))}>
        <g filter="url(#blur6)"><Rooftop t={t + 160} sunX={960} sunY={660} red={0.25} /></g>
        <path d={`M 100 ${WIRE(100)} Q 960 ${WIRE(960) + 70} 1820 ${WIRE(1820)}`} stroke="#0E0C14" strokeWidth={4} fill="none" />
        <Crow x={x} y={WIRE(x) + 36} s={0.75} f={t} flip={flip} look={0.5} open={t > 3 && Math.floor(t / 5) % 2 ? 1 : 0} />
        <Say x={x + (flip ? -10 : 10)} y={WIRE(x) - 95} s={0.32} t={t - 3} text={text} size={size} tx={flip ? 60 : -60} ty={150} />
      </g>
    );
  };
  return C;
};
export const A4 = crowSays('അവൻ തന്നെ!', false);
export const A5 = crowSays('ഉറപ്പാണോ?', true);
export const A6 = crowSays('ഞാൻ മറക്കില്ല.', false, 64);
// A7: extreme close-up, the third crow's eye, Pip's face reflected in it
export const A7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.15]], easeIn))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#1E1B26" />
    <circle cx={960} cy={540} r={330} fill="#F2D06B" />
    <circle cx={960} cy={540} r={kf(t, [[0, 150], [14, 120]])} fill="#111" />
    <g opacity={0.7}><FaceIcon x={960} y={540} s={0.6} color="#F6EFE3" /></g>
    <circle cx={880} cy={460} r={40} fill="#FFF" opacity={0.75} />
  </g>
);

// =========================================================== 2 title
export const T: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Rooftop t={t} sunX={960} sunY={690 - 40 * easeOut(clamp(t / 40))} red={0.15} />
    <WireCrows t={t} turn={0.3} />
    <TitleCard t={t} lines={['മൃഗങ്ങളോട് സംസാരിക്കാൻ പറ്റിയാലോ?', 'ഭാഗം 2: കാക്കകളുടെ രഹസ്യം']} accent="രഹസ്യം" accentT={40} size={88} />
    <Fade t={t} len={len} n={8} />
  </g>
);

// =========================================================== 3-5 home, the cat
const K_PIP = stand(KITCHEN, 0.6, 0.5);
const K_CAT = KITCHEN.P(0.36, 1, 0.55);
// B1: wide, Pip runs into the kitchen
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(1 - (t - 26) / 8);
  const pose = { x: kf(t, [[0, K_PIP.x + 520], [28, K_PIP.x]], easeOut), y: K_PIP.y, scale: K_PIP.scale, yaw: -0.6, look: -0.4, ...runLimbs(t, k) };
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 940]]), 600, 1.35)}>
      <Kitchen t={t + 20} id="bk1" />
      <Bowl x={K_CAT.x - 110} y={K_CAT.y} s={0.8} />
      <Cat x={K_CAT.x} y={K_CAT.y} mood="alert" f={t} />
      <Fig look={PIP} pose={{ ...pose, ...face(t, [[0, 'shock'], [30, 'worried']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};
// B2: close-up, low: the cat beside its empty bowl
export const B2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(K_CAT.x - 60, K_CAT.y - 80, kf(t, [[0, 3.2], [len, 3.5]]))}>
    <g filter="url(#blur6)"><Kitchen t={t + 60} id="bk2" /></g>
    <Bowl x={K_CAT.x - 110} y={K_CAT.y} s={0.8} />
    <Cat x={K_CAT.x} y={K_CAT.y} mood="alert" f={t} />
  </g>
);
// B3: medium over the cat, Pip asks; his own bubble with a crow in it
export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: K_PIP.x, y: K_PIP.y, scale: K_PIP.scale, yaw: -0.4, look: -0.8, armL: { a: 12, b: -8 }, armR: { a: 14, b: -10 } } },
    { f: 8, p: { armL: { a: 70, b: 60 }, armR: { a: 70, b: 60 }, headTilt: 6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(K_PIP.x - 120, K_PIP.y - 60, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <Kitchen t={t + 90} id="bk3" />
      <Cat x={K_CAT.x} y={K_CAT.y} mood="alert" f={t} />
      <Fig look={PIP} pose={{ ...pose, ...face(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <Say x={K_PIP.x - 40} y={K_PIP.y - 300} s={0.5} t={t - 6} text="എന്താ ദേഷ്യം?" size={70} tx={80} ty={150}>
        <g transform="translate(220 10) scale(0.7)"><Crow x={0} y={30} s={1} f={t} /></g>
      </Say>
    </g>
  );
};
// B4: close-up, the cat shuts its eyes: fish first
export const B4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(K_CAT.x - 30, K_CAT.y - 90, kf(t, [[0, 3.4], [len, 3.7]]))}>
    <g filter="url(#blur6)"><Kitchen t={t + 60} id="bk4" /></g>
    <Bowl x={K_CAT.x - 110} y={K_CAT.y} s={0.8} />
    <Cat x={K_CAT.x} y={K_CAT.y} mood={t > 4 ? 'sleep' : 'alert'} f={t} />
    <Say x={K_CAT.x - 30} y={K_CAT.y - 150} s={0.36} t={t - 10} text="മീൻ ആദ്യം." size={66} tx={-40} ty={150}>
      <Fish x={160} y={-4} s={1.3} />
    </Say>
  </g>
);
// B5: close-up, the cat wears a tiny crown: the meow is a way to rule us
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const drop = backOut(clamp((t - 4) / 10));
  return (
    <g transform={camT(K_CAT.x - 30, K_CAT.y - 90, kf(t, [[0, 3.3], [len, 3.6]]))}>
      <g filter="url(#blur6)"><Kitchen t={t + 60} id="bk5" /></g>
      <Cat x={K_CAT.x} y={K_CAT.y} mood="alert" f={t} />
      <g transform={`translate(${K_CAT.x - 4} ${K_CAT.y - 150 - (1 - drop) * 120})`}>
        <path d="M -34 0 L -34 -30 L -17 -12 L 0 -38 L 17 -12 L 34 -30 L 34 0 Z" fill="#F2C23A" stroke="#1A1230" strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};
// B6: medium, Pip tips a fish into the bowl
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: K_CAT.x + 160, y: K_PIP.y, scale: K_PIP.scale, yaw: -0.6, look: -0.8, tilt: -18, armL: { a: 70, b: 10 }, armR: { a: 30, b: 0 } } },
    { f: 10, p: { armL: { a: 50, b: 0 } }, ease: easeOut },
  ]);
  const fall = easeIn(clamp((t - 6) / 8));
  return (
    <g transform={camT(K_CAT.x, K_CAT.y - 160, kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Kitchen t={t + 100} id="bk6" />
      <Bowl x={K_CAT.x - 110} y={K_CAT.y} s={0.8} />
      <Fish x={K_CAT.x - 110} y={kf(fall, [[0, K_CAT.y - 200], [1, K_CAT.y - 28]])} s={0.8} />
      <Cat x={K_CAT.x} y={K_CAT.y} mood="alert" f={t} />
      <Fig look={PIP} pose={{ ...pose, ...face(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};
// B7: flashback, wide: two years ago Pip flies a kite on the roof, near the nest on the pole
export const B7: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [{ f: 0, p: roofPose(820, 0.62, { yaw: -0.3, look: -0.6, headTilt: -14, armL: { a: 150, b: 20 }, armR: { a: 30, b: 0 } }) }, { f: len, p: { x: 760 } }]);
  const kx = kf(t, [[0, 520], [len, 330]]);
  const ky = 300 + Math.sin(t / 10) * 20;
  const cx = kf(t, [[0, 760], [len, 700]]);
  return (
    <g transform={camT(cx, 600, 1.35)}>
      <Rooftop t={t + 300} sunX={1300} sunY={520} />
      <Pole />
      <path d={`M ${pip.x - 40} ${pip.y - 160} Q ${(kx + pip.x) / 2} ${ky + 200} ${kx} ${ky + 70}`} stroke="#1A1230" strokeWidth={2} fill="none" />
      <Kite x={kx} y={ky} t={t} />
      <Fig look={PIP} pose={{ ...pip, ...face(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <Sepia />
      <text x={cx - 600} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFF3DC">2 വർഷം മുമ്പ്</text>
    </g>
  );
};
// B8: flashback, close: the kite clips the nest; a baby crow tumbles off
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const fall = easeIn(clamp((t - 8) / 22));
  return (
    <g transform={camT(260, kf(t, [[0, 380], [len, 520]]), 3.0)}>
      <Rooftop t={t + 330} sunX={1300} sunY={520} />
      <Pole />
      <Kite x={kf(t, [[0, 520], [10, 300], [len, 160]])} y={kf(t, [[0, 300], [10, 340], [len, 280]])} t={t} />
      <g transform={`translate(${250 + fall * 40} ${340 + fall * 300}) rotate(${fall * 300})`}>
        <Crow x={0} y={0} s={0.35} f={t} open={1} />
      </g>
      <Sepia />
    </g>
  );
};
// B9: flashback, Pip's face; a frame locks round it, the crows remember
export const B9: React.FC<ShotProps> = ({ t, len }) => {
  const lock = clamp((t - 14) / 8);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Rooftop t={t + 360} sunX={1300} sunY={520} low={180} />
      <Fig look={PIP} pose={{ x: 960, y: 820, scale: 2.0, look: -0.2, ...face(t, [[0, 'oops']]) }} rimId="rimR" shadow={0} />
      <g opacity={lock}><rect x={800} y={160} width={320} height={380} fill="none" stroke={AMBER} strokeWidth={8} strokeDasharray="26 14" /></g>
      <Sepia />
    </g>
  );
};

// =========================================================== 6-8 Mo and the dog
// C1: wide, Pip runs up to Mo and the dog on Mo's roof
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(1 - (t - 24) / 8);
  const pip = { ...roofPose(kf(t, [[0, 380], [26, 820]], easeOut), 0.62, { yaw: 0.6, look: 0.5 }), ...runLimbs(t, k) };
  const mo = roofPose(1060, 0.62, { yaw: -0.3, look: -0.4 });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 700, 1.7)}>
      <Rooftop t={t + 400} sunX={1300} sunY={600} />
      <Dog x={1250} y={ROOF_FEET + 2} s={0.62} f={t} />
      <Fig look={PIP} pose={{ ...pip, ...face(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <Fig look={MO} pose={{ ...mo, ...face(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.6} />
    </g>
  );
};
// C2: close-up, low: the dog sniffs at Pip's shoes, sniff lines
export const C2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 780, kf(t, [[0, 2.6], [len, 2.8]]))}>
    <g filter="url(#blur6)"><Rooftop t={t + 420} sunX={1300} sunY={600} /></g>
    <Fig look={PIP} pose={{ ...roofPose(860, 0.62, { yaw: 0.5 }) }} rimId="rimR" shadow={0.6} />
    <Dog x={kf(t, [[0, 1080], [len, 1040]])} y={ROOF_FEET + 2} s={0.62} f={t} />
    {[0, 1, 2].map((i) => {
      const p = (t / 12 + i / 3) % 1;
      return <path key={i} d={`M ${1000 - p * 60} ${770 - i * 14} q 10 -8 20 0`} stroke="#FFF7E8" strokeWidth={3} fill="none" opacity={1 - p} />;
    })}
  </g>
);
/** the dog close-up with a line of its own */
const dogSays = (text: string, icon?: (t: number) => React.ReactNode, size = 66) => {
  const C: React.FC<ShotProps> = ({ t, len }) => (
    <g transform={camT(1180, 720, kf(t, [[0, 2.4], [len, 2.6]]))}>
      <g filter="url(#blur6)"><Rooftop t={t + 445} sunX={1300} sunY={600} /></g>
      <Dog x={1250} y={ROOF_FEET + 2} s={0.62} f={t} tell={clamp(t / 4)} />
      <Say x={1130} y={640} s={0.4} t={t - 2} text={text} size={size} tx={60} ty={150}>{icon ? icon(t) : null}</Say>
    </g>
  );
  return C;
};
const Egg = () => (
  <g transform="translate(170 0)"><ellipse cx={0} cy={0} rx={44} ry={30} fill="#FFF" stroke="#1A1230" strokeWidth={4} /><circle cx={0} cy={0} r={14} fill="#F2C23A" /></g>
);
const Shoe = () => (
  <g transform="translate(170 6)"><path d="M -50 10 L -50 -20 L 0 -20 L 50 0 L 50 10 Z" fill="#3AB8A0" stroke="#1A1230" strokeWidth={4} /></g>
);
export const C3a = dogSays('നീ പേടിച്ചിരിക്കുന്നു!', undefined, 58);
export const C3b = dogSays('മുട്ട!', Egg);
export const C3c = dogSays('കാക്ക തൊട്ടു!', Shoe, 62);
export const C4 = dogSays('ബിസ്കറ്റ്?', () => <Cookie x={160} y={-2} s={1.2} rot={-10} bite={1} seed={4} />);
export const C4b = dogSays('പോക്കറ്റിൽ 2!', () => <g><Cookie x={150} y={-2} s={1} seed={2} /><Cookie x={230} y={-2} s={1} seed={5} /></g>, 62);
export const C8 = dogSays('അവനും പേടി.', undefined, 66);
// C5: medium, Mo slaps a hand over his pocket, oops
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const mo = poseAt(t, [
    { f: 0, p: { x: 960, y: 800, scale: 1.7, yaw: -0.2, armR: { a: 14, b: 6 }, armL: { a: 14, b: 6 } } },
    { f: 5, p: { armR: { a: 40, b: 70 }, headTilt: 8, look: 0.6 }, ease: backOut },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 466} sunX={1250} sunY={560} low={260} />
      <Fig look={MO} pose={{ ...mo, ...face(t, [[0, 'neutral'], [4, 'oops']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};
// C6: two-shot, Mo asks what's wrong
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const mo = roofPose(1080, 1.1, { yaw: -0.4, look: -0.5, armL: { a: 40, b: 50 } });
  const pip = roofPose(800, 1.1, { yaw: 0.5, look: 0.5 });
  return (
    <g transform={camT(940, 560, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 480} sunX={1300} sunY={600} low={140} />
      <Fig look={PIP} pose={{ ...pip, ...face(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <Fig look={MO} pose={{ ...mo, ...face(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1250} y={280} s={0.8} t={t - 2} text="എന്താ പ്രശ്നം?" size={64} tx={-80} ty={150} />
    </g>
  );
};
// C6b: close-up, Pip: "crows", a crow icon in his bubble
export const C6b: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Rooftop t={t + 500} sunX={1300} sunY={600} low={180} />
    <Fig look={PIP} pose={{ x: 960, y: 820, scale: 2.0, yaw: 0.2, look: 0.4, ...face(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
    <Say x={1420} y={300} s={0.9} t={t - 1} text="കാക്കകൾ." size={64} tx={-90} ty={150}>
      <g transform="translate(200 20) scale(0.8)"><Crow x={0} y={30} s={1} f={t} /></g>
    </Say>
  </g>
);
// C7: medium, Mo doubled up laughing; the dog looks at him
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const shake = Math.sin(t / 1.6);
  const mo = roofPose(1060, 0.9, { yaw: -0.1, tilt: 10 + shake * 4, headTilt: -12 + shake * 4, armL: { a: 40, b: 60 }, armR: { a: 40, b: 60 } });
  return (
    <g transform={camT(1100, 640, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Rooftop t={t + 520} sunX={1300} sunY={600} />
      <Dog x={1300} y={ROOF_FEET + 2} s={0.62} f={t} />
      <Fig look={MO} pose={{ ...mo, ...face(t, [[0, 'happy']]), blink: 1 }} rimId="rimL" shadow={0.6} />
      {['ഹ', 'ഹ', 'ഹ'].map((h, i) => <text key={i} x={900 + i * 70} y={420 - i * 30 - (t % 10) * 2} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFF7E8" opacity={clamp((t - i * 4) / 4)}>{h}</text>)}
    </g>
  );
};

// =========================================================== 4 the meow (schematic)
// D1: two grown cats face each other: no meow between them, a red cross
export const D1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t + 20} id="d1" />
    <Head text="പൂച്ച ↔ പൂച്ച" />
    <CatIcon x={560} y={800} s={2} />
    <g transform="translate(1360 800) scale(-1 1)"><CatIcon x={0} y={0} s={2} /></g>
    <Big x={960} y={520} text="മ്യാവൂ" size={90} t={t - 4} color={SCH.dim} />
    <DrawOn d="M 800 420 L 1120 580" t={t - 14} dur={6} color="#E2574C" width={16} />
    <DrawOn d="M 1120 420 L 800 580" t={t - 18} dur={6} color="#E2574C" width={16} />
  </g>
);
// D2: the cat turns to a person: meow after meow flies their way
export const D2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t + 40} id="d2" />
    <Head text="പൂച്ച → മനുഷ്യൻ" />
    <CatIcon x={520} y={820} s={2} />
    <Person x={1400} y={880} s={2.2} />
    {Array.from({ length: 6 }).map((_, i) => {
      const p = (t / 36 + i / 6) % 1;
      return <text key={i} x={700 + p * 520} y={520 - Math.sin(p * Math.PI) * 120 + (i % 2) * 60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill={SCH.live} opacity={Math.sin(p * Math.PI)}>മ്യാവൂ</text>;
    })}
  </g>
);

// =========================================================== 7 the dog's nose (schematic)
// D3: bars: 300 million scent cells against our 6 million
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp((t - 6) / 30));
  const h = easeOut(clamp((t - 80) / 14));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t} id="d3" />
      <Head text="മണം പിടിക്കുന്ന കോശങ്ങൾ" />
      <line x1={300} y1={880} x2={1620} y2={880} stroke={SCH.dim} strokeWidth={4} />
      <rect x={560} y={880 - 600 * g} width={260} height={600 * g} fill={SCH.live} />
      <Big x={690} y={860 - 600 * g - 30} text={`${Math.round(30 * g)} കോടി`} size={70} color={SCH.glow} />
      <rect x={1100} y={880 - 12 * h} width={260} height={12 * h} fill={SCH.line} />
      <Big x={1230} y={840} text="60 ലക്ഷം" size={70} t={t - 80} />
      <g transform="translate(690 960) scale(0.5)"><Dog x={0} y={0} s={1} f={t} /></g>
      <Person x={1230} y={1060} s={0.6} />
    </g>
  );
};
// D4: a fear-sweat drop gives off a cloud of scent that drifts into the dog's nose
export const D4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t + 30} id="d4" />
    <Head text="പേടിയുടെ മണം" />
    <Person x={520} y={800} s={1.8} />
    <path d="M 600 420 q 14 24 0 36 q -14 -12 0 -36 Z" fill="#8FD3FF" />
    {Array.from({ length: 12 }).map((_, i) => {
      const p = (t / 50 + i / 12) % 1;
      return <circle key={i} cx={620 + p * 640} cy={450 + Math.sin(p * 9 + i) * 50 + p * 120} r={10 - p * 4} fill={SCH.live} opacity={0.9 - p * 0.5} />;
    })}
    <g transform="translate(1440 760) scale(1.6)"><Dog x={0} y={0} s={1} f={t} tell={clamp((t - 30) / 6)} /></g>
  </g>
);

// =========================================================== 9 the plan
const B_PIP = stand(BEDROOM, 0.45, 0.45);
const SILL = { x: (WINDOW.x0 + WINDOW.x1) / 2, y: WINDOW.y1 };
// E1: wide, Pip in his bedroom; a light-bulb idea pops over him
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: B_PIP.x, y: B_PIP.y, scale: B_PIP.scale, yaw: 0.2, look: 0, headTilt: 8 } },
    { f: 10, p: { headTilt: -8, armR: { a: 150, b: 10 } }, ease: backOut },
  ]);
  const bulb = backOut(clamp((t - 8) / 8));
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1040]]), 520, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <Bedroom t={t + 30} id="be1" />
      <Fig look={PIP} pose={{ ...pose, ...face(t, [[0, 'worried'], [10, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <g transform={`translate(${B_PIP.x} ${B_PIP.y - 300 * B_PIP.scale}) scale(${bulb})`}>
        <circle cx={0} cy={0} r={34} fill="#FFE27A" stroke="#1A1230" strokeWidth={4} />
        <rect x={-14} y={30} width={28} height={18} fill="#9A9AA8" stroke="#1A1230" strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={Math.cos(-Math.PI + i * 0.78) * 46} y1={Math.sin(-Math.PI + i * 0.78) * 46} x2={Math.cos(-Math.PI + i * 0.78) * 64} y2={Math.sin(-Math.PI + i * 0.78) * 64} stroke="#FFE27A" strokeWidth={5} />)}
      </g>
    </g>
  );
};
// E2: close-up, Pip; a thought bubble: a crow and a heart
export const E2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <g filter="url(#blur6)"><Bedroom t={t + 60} id="be2" /></g>
    <Fig look={PIP} pose={{ x: 900, y: 820, scale: 2.0, look: 0.5, headTilt: -6, ...face(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    <Say x={1400} y={320} s={1.0} t={t - 3} text="മാപ്പ്?" size={70} tx={-120} ty={150}>
      <g transform="translate(120 20) scale(0.7)"><Crow x={0} y={30} s={1} f={t} /></g>
      <path d="M 220 -10 c -10 -24 -44 -14 -30 12 l 30 28 l 30 -28 c 14 -26 -20 -36 -30 -12 z" fill="#E2574C" />
    </Say>
  </g>
);
// E3: wide, the study at night: Pip at the desk, books piling up
const S_PIP = stand(STUDY, 0.5, 0.4);
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: S_PIP.x, y: S_PIP.y, scale: S_PIP.scale, yaw: -0.5, look: -0.4, armL: { a: 70, b: 30 }, armR: { a: 60, b: 30 } } }, { f: 30, p: { headTilt: 8 } }]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Study t={t} id="se3" night />
      {Array.from({ length: Math.min(6, 1 + Math.floor(t / 6)) }).map((_, i) => (
        <rect key={i} x={S_PIP.x - 220 + (i % 2) * 8} y={S_PIP.y - 40 - i * 22} width={120} height={20} fill={['#C24E4E', '#3A7CA5', '#F2C23A', '#5AA05A', '#8A5AC2', '#E07A3A'][i]} stroke="#1A1230" strokeWidth={3} />
      ))}
      <Fig look={PIP} pose={{ ...pose, ...face(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// =========================================================== 10 bees
const fig8 = (p: number, cx: number, cy: number, r: number) => {
  const a = p * Math.PI * 2;
  return { x: cx + r * Math.sin(a), y: cy + r * Math.sin(a) * Math.cos(a) * 1.4 };
};
// D5: the waggle dance: a figure-eight drawn on, a bee running it
export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const p = (t / 70) % 1;
  const b = fig8(p, 960, 560, 300);
  const b2 = fig8(p + 0.005, 960, 560, 300);
  const pts = Array.from({ length: 61 }).map((_, i) => fig8(i / 60, 960, 560, 300));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t + 60} id="d5" />
      <Head text="തേനീച്ചയുടെ നൃത്തം" />
      <g transform="rotate(90 960 560)">
        <DrawOn d={`M ${pts.map((q) => `${q.x} ${q.y}`).join(' L ')}`} t={t - 2} dur={24} color={SCH.dim} width={5} />
        <Bee x={b.x} y={b.y} s={1.4} r={(Math.atan2(b2.y - b.y, b2.x - b.x) * 180) / Math.PI} f={t} />
      </g>
    </g>
  );
};
// D6: the dance's angle from straight up = the flowers' angle from the sun
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const a = kf(t, [[4, 0], [24, 40]], easeOut);
  const rad = (a * Math.PI) / 180;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t + 90} id="d6" />
      <Head text="ദിശ = പൂക്കളിലേക്കുള്ള വഴി" />
      <circle cx={960} cy={200} r={60} fill="#FFD36B" />
      <line x1={960} y1={860} x2={960} y2={300} stroke={SCH.dim} strokeWidth={4} strokeDasharray="16 12" />
      <line x1={960} y1={860} x2={960 + Math.sin(rad) * 560} y2={860 - Math.cos(rad) * 560} stroke={SCH.live} strokeWidth={8} />
      <path d={`M 960 700 A 160 160 0 0 1 ${960 + Math.sin(rad) * 160} ${860 - Math.cos(rad) * 160}`} stroke={SCH.glow} strokeWidth={5} fill="none" />
      <Big x={1080} y={660} text={`${Math.round(a)}°`} size={80} color={SCH.glow} anchor="start" />
      <g opacity={clamp((t - 24) / 6)} transform={`translate(${960 + Math.sin(rad) * 620} ${860 - Math.cos(rad) * 620})`}>
        {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={0} cy={-26} rx={16} ry={26} fill="#F28AB2" transform={`rotate(${r})`} />)}
        <circle cx={0} cy={0} r={16} fill="#F2C23A" />
      </g>
      <Bee x={960} y={860} s={1.2} r={a - 90} f={t} />
    </g>
  );
};
// D6b: the length of the waggle run = the distance
export const D6b: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp((t - 4) / 20));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t + 120} id="d6b" />
      <Head text="നീളം = ദൂരം" />
      <line x1={400} y1={540} x2={400 + 900 * g} y2={540} stroke={SCH.live} strokeWidth={10} />
      <Bee x={400 + 900 * g} y={540} s={1.3} f={t} />
      <Big x={400 + 900 * g} y={680} text={`${(g * 1.5).toFixed(1)} km`} size={70} color={SCH.glow} />
    </g>
  );
};
// D7: a Nobel medal, 1973
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const s = backOut(clamp((t - 2) / 10));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t + 150} id="d7" />
      <g transform={`translate(960 500) scale(${s})`}>
        <path d="M -60 -260 L 0 -150 L 60 -260" stroke={SCH.live} strokeWidth={22} fill="none" />
        <circle cx={0} cy={0} r={170} fill="#E6B94C" stroke="#8C6A1E" strokeWidth={10} />
        <circle cx={0} cy={0} r={130} fill="none" stroke="#8C6A1E" strokeWidth={4} />
        <text x={0} y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#6A4E12">1973</text>
      </g>
      <Big x={960} y={880} text="നോബൽ സമ്മാനം" size={80} t={t - 10} color={SCH.glow} />
    </g>
  );
};

// =========================================================== 11 elephants
// D8: an elephant rumbles; low waves roll out in wide rings
export const D8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 0.9]]))}>
    <Schematic t={t + 180} id="d8" />
    <Head text="ആനയുടെ മുരൾച്ച" />
    <Rings x={700} y={640} t={t} max={900} color={SCH.live} n={5} />
    <Elephant x={600} y={760} s={1.5} f={t} call={0.4} />
    <Wave x={1100} y={420} w={500} amp={60} per={70} t={t} />
    <Big x={1350} y={560} text="< 20 Hz" size={60} color={SCH.glow} t={t - 10} />
  </g>
);
// D8b: far away (km), a second elephant listens
export const D8b: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 2) / 30);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Schematic t={t + 210} id="d8b" />
      <Elephant x={300} y={760} s={0.8} f={t} call={0.4} />
      <Elephant x={1600} y={760} s={0.8} f={t} flip />
      <Wave x={420} y={620} w={1000 * k} amp={30} per={60} t={t} />
      <line x1={300} y1={860} x2={1600} y2={860} stroke={SCH.dim} strokeWidth={3} strokeDasharray="14 10" />
      <Big x={950} y={940} text={`${Math.round(k * 10)} km വരെ`} size={64} color={SCH.glow} />
    </g>
  );
};
// D9: one elephant calls; a name tag flies to just one of three
export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp((t - 8) / 20));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t + 240} id="d9" />
      <Head text="ആനകൾക്ക് പേരുണ്ട്" />
      <Elephant x={380} y={760} s={1.0} f={t} call={1} />
      {[1150, 1450, 1750].map((x, i) => <Elephant key={i} x={x} y={i === 1 ? 720 : 840} s={0.6} f={t + i * 9} flip />)}
      <g transform={`translate(${kf(p, [[0, 560], [1, 1450]])} ${520 - Math.sin(p * Math.PI) * 140})`}>
        <rect x={-110} y={-44} width={220} height={88} rx={16} fill={SCH.live} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#101A2A">പേര്</text>
      </g>
      {t > 30 ? <circle cx={1450} cy={620} r={150} fill="none" stroke={SCH.glow} strokeWidth={5} /> : null}
    </g>
  );
};

// =========================================================== 12 dolphins
// D10: three dolphins, each with its own whistle trace
export const D10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t + 270} id="d10" />
    <Head text="ഓരോ വിസിലും ഒരു പേര്" />
    {[0, 1, 2].map((i) => (
      <g key={i} opacity={clamp((t - i * 8) / 6)}>
        <Dolphin x={480} y={340 + i * 230} s={0.8} f={t + i * 11} color={[SCH.line, SCH.glow, SCH.live][i]} />
        <Wave x={760} y={320 + i * 230} w={760} amp={20 + i * 14} per={20 + i * 18} t={t} color={[SCH.line, SCH.glow, SCH.live][i]} />
      </g>
    ))}
  </g>
);
// D11: years count to 20; the old friend's whistle still matches: a tick
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const yrs = Math.min(20, Math.floor(kf(t, [[2, 0], [36, 20.99]])));
  const ok = t > 40;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t + 300} id="d11" />
      <Dolphin x={500} y={540} s={1.2} f={t} />
      <Big x={1300} y={560} text={`${yrs}`} size={220} color={ok ? SCH.glow : SCH.live} />
      <Big x={1300} y={660} text="വർഷം" size={64} />
      {ok ? <path d="M 1220 800 L 1280 860 L 1400 740" stroke="#7FE08A" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </g>
  );
};

// =========================================================== 13 the realisation
// E4: close-up, Pip in the study, the penny drops
export const E4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]], easeIn))}>
    <g filter="url(#blur6)"><Study t={t} id="se4" night /></g>
    <Fig look={PIP} pose={{ x: 960, y: 820, scale: 2.0, look: 0, headTilt: kf(t, [[0, 6], [12, -6]]), ...face(t, [[0, 'neutral'], [10, 'shock']]) }} rimId="rimR" shadow={0} />
  </g>
);
// D12: name tags pop on every animal: cat, dog, bee, elephant, dolphin, crow
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const items: [number, number, React.ReactNode][] = [
    [380, 460, <CatIcon x={0} y={60} s={0.9} />],
    [960, 460, <g transform="scale(0.55)"><Dog x={0} y={60} f={t} /></g>],
    [1540, 460, <Bee x={0} y={0} s={1.6} f={t} />],
    [380, 840, <Elephant x={-20} y={60} s={0.6} f={t} />],
    [960, 840, <Dolphin x={0} y={0} s={0.7} f={t} />],
    [1540, 840, <Crow x={0} y={30} s={1.4} f={t} />],
  ];
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Schematic t={t + 330} id="d12" />
      {items.map(([x, y, node], i) => {
        const s = backOut(clamp((t - i * 5) / 8));
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g transform={`scale(${s})`}>{node}</g>
            <g opacity={clamp((t - 30 - i * 3) / 6)}>
              <rect x={-90} y={-170} width={180} height={60} rx={14} fill={i === 5 ? SCH.live : SCH.dim} />
              <text x={0} y={-128} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#101A2A">പേര് ✓</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

// =========================================================== 14 crow facts
// D13: crows ring a fallen crow, scolding
export const D13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 0.98]]))}>
    <Schematic t={t + 360} id="d13" />
    <g transform="translate(960 640) rotate(180)" opacity={0.6}><Crow x={0} y={0} s={1.4} f={0} /></g>
    {Array.from({ length: 7 }).map((_, i) => {
      const a = Math.PI + (i / 6) * Math.PI;
      const r = kf(t, [[0, 700], [20, 380]], easeOut);
      const x = 960 + Math.cos(a) * r;
      const y = 660 + Math.sin(a) * r * 0.6;
      return <Crow key={i} x={x} y={y} s={1.1} f={t + i * 5} flip={x > 960} open={t > 20 && Math.floor((t + i * 2) / 4) % 2 ? 1 : 0} />;
    })}
  </g>
);
// D14: the place gets marked: a warning ring and a cross
export const D14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t + 390} id="d14" />
    <Head text="ഈ സ്ഥലം അപകടം" />
    <circle cx={960} cy={600} r={260} fill="none" stroke="#E2574C" strokeWidth={10} strokeDasharray="30 16" opacity={clamp(t / 6)} />
    <DrawOn d="M 840 480 L 1080 720" t={t - 6} dur={6} color="#E2574C" width={18} />
    <DrawOn d="M 1080 480 L 840 720" t={t - 10} dur={6} color="#E2574C" width={18} />
    <Crow x={1500} y={460} s={1.4} f={t} flip />
    <Arrow x0={1400} y0={420} x1={1700} y1={300} t={t - 14} dur={10} color={SCH.dim} bend={-0.2} />
  </g>
);
// D15: a crow hops to a person feeding it
export const D15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t + 420} id="d15" />
    <Head text="ഭക്ഷണം → സമ്മാനം" />
    <Person x={600} y={860} s={1.6} />
    <g opacity={clamp(t / 6)}>{[0, 1, 2].map((i) => <Peanut key={i} x={760 + i * 40} y={850} s={1.2} r={i * 50} />)}</g>
    <Crow x={kf(t, [[0, 1500], [18, 1100]], easeOut)} y={860 - Math.abs(Math.sin(t / 3)) * (t < 18 ? 30 : 0)} s={1.6} f={t} flip />
  </g>
);
// D15b: the gifts, one by one: a shiny pebble, a bottle cap, a bead
export const D15b: React.FC<ShotProps> = ({ t, len }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t + 450} id="d15b" />
      <g transform={`translate(560 540) scale(${pop(0) * 4})`}><Pebble x={0} y={0} t={t} /></g>
      <g transform={`translate(960 540) scale(${pop(24) * 3})`}>
        <circle cx={0} cy={0} r={34} fill="#C9C9D6" stroke="#1A1230" strokeWidth={4} />
        {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={Math.cos(i / 1.91) * 36} cy={Math.sin(i / 1.91) * 36} r={5} fill="#8A8A98" />)}
      </g>
      <g transform={`translate(1360 540) scale(${pop(40) * 3})`}>
        <circle cx={0} cy={0} r={28} fill="#E2574C" stroke="#1A1230" strokeWidth={4} />
        <circle cx={0} cy={0} r={8} fill="#101A2A" />
        <circle cx={-10} cy={-10} r={6} fill="#FFF" opacity={0.7} />
      </g>
      <text x={560} y={800} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill={SCH.line} opacity={clamp(pop(0))}>കല്ല്</text>
      <text x={960} y={800} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill={SCH.line} opacity={clamp(pop(24))}>അടപ്പ്</text>
      <text x={1360} y={800} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill={SCH.line} opacity={clamp(pop(40))}>മുത്ത്</text>
    </g>
  );
};
// D16: a crow bends a wire into a hook and lifts food out of a tube
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const bend = easeOut(clamp((t - 6) / 16));
  const lift = easeOut(clamp((t - 30) / 20));
  const y = kf(lift, [[0, 860], [1, 460]]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t + 480} id="d16" />
      <Head text="കൊളുത്ത് ഉണ്ടാക്കുന്ന കാക്ക" />
      <rect x={1060} y={380} width={120} height={500} fill="none" stroke={SCH.line} strokeWidth={6} />
      <rect x={1080} y={y - 40} width={80} height={44} rx={10} fill={SCH.live} />
      <path d={`M 1120 ${y} L 1120 ${y - 520} q ${-bend * 40} ${-bend * 10} ${-bend * 60} ${bend * 50}`} stroke={SCH.glow} strokeWidth={8} fill="none" />
      <g transform="translate(860 420)"><Crow x={0} y={0} s={2.6} f={t} flip /></g>
    </g>
  );
};
// D17: a crow beside a 7-year-old: the same score
export const D17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t + 510} id="d17" />
    <Crow x={620} y={720} s={3} f={t} flip />
    <Big x={960} y={600} text="=" size={180} t={t - 8} color={SCH.glow} />
    <Person x={1300} y={860} s={1.6} />
    <Big x={1300} y={300} text="7 വയസ്സ്" size={70} t={t - 12} />
  </g>
);

// =========================================================== 14c the sleepless night
// E5: wide, the bedroom at night, the lamp off; Pip awake, crows on the sill
export const E5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1060]]), 520, kf(t, [[0, 1.6], [len, 1.7]]))}>
    <Bedroom t={t + 30} id="be5" veil={0.7} lamp={0} />
    <Fig look={PIP} pose={{ x: B_PIP.x, y: B_PIP.y, scale: B_PIP.scale, yaw: 0.3, look: 0.6 + Math.sin(t / 20) * 0.3, ...face(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0.5} />
    {[0, 1, 2].map((i) => <Crow key={i} x={WINDOW.x0 + 60 + i * 70} y={SILL.y - 4} s={0.45} f={t + i * 9} flip={i % 2 === 0} />)}
  </g>
);
const sillCrows = (t: number) => [0, 1, 2].map((i) => <Crow key={i} x={WINDOW.x0 + 60 + i * 70} y={SILL.y - 4} s={0.45} f={t + i * 9} flip={i % 2 === 0} open={Math.floor((t + i * 6) / 5) % 3 === 0 ? 1 : 0} />);
// E6: close on the window: crows whisper, will he come tomorrow?
export const E6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(SILL.x, SILL.y - 90, kf(t, [[0, 3.2], [len, 3.5]]))}>
    <Bedroom t={t + 70} id="be6" veil={0.7} lamp={0} />
    {sillCrows(t)}
    <Say x={SILL.x - 40} y={SILL.y - 175} s={0.32} t={t - 6} text="...നാളെ വരുമോ?" size={60} tx={60} ty={150} />
  </g>
);
// E7: and if he does, what then?
export const E7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(SILL.x + 40, SILL.y - 90, kf(t, [[0, 3.4], [len, 3.6]]))}>
    <Bedroom t={t + 100} id="be7" veil={0.7} lamp={0} />
    {sillCrows(t)}
    <Say x={SILL.x + 60} y={SILL.y - 175} s={0.32} t={t - 2} text="...എന്ത് ചെയ്യും?" size={60} tx={-60} ty={150} />
  </g>
);

// =========================================================== 15-17 the apology (morning roof)
const MORN = { sunX: 1350, sunY: 360, cityLit: 0.3 };
// F1: wide, morning; Pip sets a bowl of peanuts on the roof
export const F1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: roofPose(900, 0.62, { yaw: 0.3, look: 0.3, tilt: 0 }) },
    { f: 12, p: { tilt: 30, armR: { a: 70, b: 0 } }, ease: easeOut },
    { f: 30, p: { tilt: 0, armR: { a: 10, b: -8 }, headTilt: -10 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.3], [len, 1.36]]))}>
      <Rooftop t={t + 600} {...MORN} />
      <WireCrows t={t} turn={0.8} />
      <PeanutBowl x={1010} y={ROOF_FEET} s={0.8} />
      <Fig look={PIP} pose={{ ...pose, ...face(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};
// F2: insert, the bowl heaped with peanuts
export const F2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1010, ROOF_FEET - 30, kf(t, [[0, 4.0], [len, 4.3]]))}>
    <g filter="url(#blur6)"><Rooftop t={t + 620} {...MORN} /></g>
    <PeanutBowl x={1010} y={ROOF_FEET} s={0.8} n={Math.min(9, 3 + Math.floor(t / 3))} />
  </g>
);
// F3: medium, low: Pip looks up to the wire and says sorry
export const F3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Rooftop t={t + 640} {...MORN} low={200} />
    <Fig look={PIP} pose={{ x: 960, y: 840, scale: 1.8, look: -0.2, headTilt: -14, armL: { a: 20, b: 30 }, armR: { a: 20, b: 30 }, ...face(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
    <Say x={1420} y={260} s={0.9} t={t - 2} text="ക്ഷമിക്കണം." size={70} tx={-100} ty={150} />
  </g>
);
// F3b: close-up, Pip, eyes down
export const F3b: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 480, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Rooftop t={t + 660} {...MORN} low={200} />
    <Fig look={PIP} pose={{ x: 960, y: 900, scale: 2.4, look: 0, headTilt: 10, ...face(t, [[0, 'worried']]), blink: kf(t, [[0, 0], [14, 0.5]]) }} rimId="rimR" shadow={0} />
  </g>
);
// F4: wide, the line of crows, silent, nobody moves
export const F4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.6], [len, 1.5]]))}>
    <Rooftop t={t + 680} {...MORN} />
    <WireCrows t={t * 0.2} turn={1} />
  </g>
);
// F5: Pip waiting; a clock face spins past two minutes
export const F5: React.FC<ShotProps> = ({ t, len }) => {
  const a = kf(t, [[0, 0], [len, 720]]);
  return (
    <g transform={camT(960, 520, 1.0)}>
      <Rooftop t={t + 700} {...MORN} low={200} />
      <Fig look={PIP} pose={{ x: 820, y: 840, scale: 1.8, look: -0.4, headTilt: -10, ...face(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <g transform="translate(1440 560)">
        <circle cx={0} cy={0} r={120} fill="#FFF7E8" stroke="#1A1230" strokeWidth={8} />
        <line x1={0} y1={0} x2={0} y2={-90} stroke="#1A1230" strokeWidth={8} strokeLinecap="round" transform={`rotate(${a})`} />
        <line x1={0} y1={0} x2={50} y2={0} stroke="#1A1230" strokeWidth={10} strokeLinecap="round" />
      </g>
    </g>
  );
};
// F6: medium, a big crow drops off the wire and lands by the bowl; an old scar on its wing
const Scar: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path d={`M ${x - 14 * s} ${y - 6 * s} L ${x + 14 * s} ${y + 6 * s}`} stroke="#C8B6A0" strokeWidth={4 * s} strokeLinecap="round" />
);
export const F6: React.FC<ShotProps> = ({ t, len }) => {
  const land = easeOut(clamp(t / 14));
  const x = kf(land, [[0, 1300], [1, 1140]]);
  const y = kf(land, [[0, 470], [1, ROOF_FEET]]);
  return (
    <g transform={camT(1060, 700, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <Rooftop t={t + 720} {...MORN} />
      <PeanutBowl x={1010} y={ROOF_FEET} s={0.8} />
      <Crow x={x} y={y} s={1.1} f={t} flip />
      <Scar x={x + 6} y={y - 40} s={1.1} />
    </g>
  );
};
// F6b: insert, the wing and its old scar
export const F6b: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1146, ROOF_FEET - 40, kf(t, [[0, 5.0], [len, 5.5]]))}>
    <Rooftop t={t + 740} {...MORN} />
    <Crow x={1140} y={ROOF_FEET} s={1.1} f={t} flip />
    <Scar x={1146} y={ROOF_FEET - 40} s={1.1} />
  </g>
);
// F7: close-up, the big crow speaks
export const F7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1120, ROOF_FEET - 90, kf(t, [[0, 3.0], [len, 3.2]]))}>
    <g filter="url(#blur6)"><Rooftop t={t + 760} {...MORN} /></g>
    <Crow x={1140} y={ROOF_FEET} s={1.1} f={t} flip look={0.4} open={Math.floor(t / 5) % 2 ? 1 : 0} />
    <Scar x={1146} y={ROOF_FEET - 40} s={1.1} />
    <Say x={1090} y={ROOF_FEET - 200} s={0.4} t={t - 2} text="അന്ന് വീണത് ഞാനാണ്." size={60} tx={60} ty={150} />
  </g>
);
// F8: medium, the crow picks up one peanut
export const F8: React.FC<ShotProps> = ({ t, len }) => {
  const dip = Math.sin(clamp((t - 4) / 12) * Math.PI);
  return (
    <g transform={camT(1060, 760, kf(t, [[0, 2.6], [len, 2.7]]))}>
      <Rooftop t={t + 780} {...MORN} />
      <PeanutBowl x={1010} y={ROOF_FEET} s={0.8} n={t > 10 ? 8 : 9} />
      <g transform={`rotate(${-dip * 30} 1140 ${ROOF_FEET})`}><Crow x={1140} y={ROOF_FEET} s={1.1} f={t} flip /></g>
      {t > 10 ? <Peanut x={1140 - 70} y={ROOF_FEET - 92} s={0.9} r={20} /> : null}
      <Scar x={1146} y={ROOF_FEET - 40} s={1.1} />
    </g>
  );
};
// F9: wide, it calls; the whole line comes down around Pip
export const F9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 620, kf(t, [[0, 1.3], [len, 1.4]]))}>
    <Rooftop t={t + 800} {...MORN} />
    <WireCrows t={t} turn={1} gone={clamp((t - 10) / 40)} />
    <PeanutBowl x={1010} y={ROOF_FEET} s={0.8} n={8} />
    <Crow x={1140} y={ROOF_FEET} s={0.75} f={t} flip open={t < 10 && Math.floor(t / 3) % 2 ? 1 : 0} />
    <Fig look={PIP} pose={{ ...roofPose(860, 0.62, { look: 0.3, headTilt: -8 }), ...face(t, [[0, 'shock'], [30, 'happy']]) }} rimId="rimR" shadow={0.6} />
  </g>
);
// F10: close-up, Pip grinning, crows around him; a chorus bubble
export const F10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Rooftop t={t + 820} {...MORN} low={180} />
    <Fig look={PIP} pose={{ x: 960, y: 820, scale: 2.0, look: 0.1, ...face(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    <Crow x={520} y={930} s={1.4} f={t} open={Math.floor(t / 5) % 2 ? 1 : 0} />
    <Crow x={1420} y={940} s={1.4} f={t + 5} flip open={Math.floor(t / 5) % 2 ? 0 : 1} />
    <Say x={960} y={180} s={0.9} t={t - 2} text="ഇവൻ നല്ലവനാണ്!" size={70} tx={300} ty={160} />
  </g>
);

// =========================================================== 18 the gift
// G1: close, the window sill in the morning: a shiny pebble left there
export const G1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(SILL.x, SILL.y - 40, kf(t, [[0, 3.6], [len, 3.9]]))}>
    <Bedroom t={t + 30} id="bg1" veil={0.3} />
    <Pebble x={SILL.x} y={SILL.y - 14} s={0.9} t={t} />
  </g>
);
const sillCat = (t: number, mood: 'alert' | 'peek') => (
  <g transform={`translate(${SILL.x - 80} ${SILL.y}) scale(0.8) translate(${-SILL.x + 80} ${-SILL.y})`}><Cat x={SILL.x - 80} y={SILL.y} mood={mood} f={t} /></g>
);
// G2: medium, the cat on the sill eyeing the pebble, unimpressed
export const G2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(SILL.x - 60, SILL.y - 60, kf(t, [[0, 2.8], [len, 3.0]]))}>
    <Bedroom t={t + 60} id="bg2" veil={0.3} />
    <Pebble x={SILL.x + 60} y={SILL.y - 14} s={0.9} t={t} />
    {sillCat(t, 'alert')}
  </g>
);
// G2b: the cat: and no fish for me?
export const G2b: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(SILL.x - 60, SILL.y - 80, kf(t, [[0, 3.2], [len, 3.4]]))}>
    <g filter="url(#blur6)"><Bedroom t={t + 90} id="bg2b" veil={0.3} /></g>
    <Pebble x={SILL.x + 60} y={SILL.y - 14} s={0.9} t={t} />
    {sillCat(t, 'peek')}
    <Say x={SILL.x - 70} y={SILL.y - 125} s={0.3} t={t - 2} text="എനിക്ക് മീൻ ഇല്ലേ?" size={64} tx={30} ty={150}>
      <Fish x={300} y={-4} s={1.3} />
    </Say>
  </g>
);

// =========================================================== 19-20 the hook: the walls
const WALL = { x: 960, y: 540 };
const rnd = (i: number) => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
// H1: wide, the bedroom at night again, Pip listening
export const H1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 520, kf(t, [[0, 1.6], [len, 1.75]]))}>
    <Bedroom t={t + 300} id="bh1" veil={0.78} lamp={0} />
    <Fig look={PIP} pose={{ x: B_PIP.x, y: B_PIP.y, scale: B_PIP.scale, yaw: -0.4, look: -0.8, headTilt: 6, ...face(t, [[0, 'worried']]) }} rimId="rimBlue" shadow={0.5} />
  </g>
);
/** pairs of eyes scattered in the dark wall; they blink */
const Eyes: React.FC<{ t: number; n: number }> = ({ t, n }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = 200 + rnd(i) * 1500;
      const y = 150 + rnd(i + 99) * 760;
      const on = clamp((t - i * 0.7) / 3) * (Math.floor((t + i * 7) / 40) % 6 === 5 ? 0 : 1);
      return <g key={i} opacity={on}><circle cx={x} cy={y} r={6} fill="#FFE27A" /><circle cx={x + 18} cy={y} r={6} fill="#FFE27A" /></g>;
    })}
  </g>
);
const Wall: React.FC<{ t: number }> = () => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#151626" />
    {[[200, 200, 500, 380], [500, 380, 470, 700], [900, 300, 1100, 520], [700, 800, 960, 860], [1400, 200, 1600, 450]].map(([a, b, c, d], i) => <path key={i} d={`M ${a} ${b} L ${c} ${d}`} stroke="#0A0A12" strokeWidth={8} />)}
  </g>
);
// H2: close, the wall: tiny feet scurrying, one pair of eyes
export const H2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(WALL.x, WALL.y, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Wall t={t} />
    <Eyes t={t} n={2} />
    {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={(t * 30 + i * 80) % 1920} cy={980 + (i % 2) * 14} r={5} fill="#3A3C58" />)}
  </g>
);
// H3: wide on the wall, hundreds of eyes open
export const H3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(WALL.x, WALL.y, kf(t, [[0, 1.4], [len, 1.0]]))}>
    <Wall t={t} />
    <Eyes t={t * 3} n={60} />
  </g>
);
// H4: the wall talks: a bubble from the dark
export const H4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(WALL.x, WALL.y, 1.0)}>
    <Wall t={t} />
    <Eyes t={99} n={60} />
    <Say x={960} y={300} s={1.1} t={t - 2} text="അവന് നമ്മളെ കേൾക്കാം!" size={60} tx={-200} ty={160} />
  </g>
);
// D18: schematic: a rat giggles when tickled
export const D18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t + 540} id="d18" />
    <Head text="എലികൾ ചിരിക്കും" />
    <Rat x={760} y={760} s={1.8} f={t} laugh={t > 10 ? 1 : 0} />
    <path d={`M 1300 ${640 + Math.sin(t / 3) * 8} q 30 -60 60 0 q -40 20 -60 0`} fill="#F6EFE3" opacity={0.6} />
    {t > 10 ? [0, 1, 2].map((i) => <text key={i} x={1000 + i * 90} y={500 - i * 40 - (t % 12) * 3} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={SCH.glow}>ഹി</text>) : null}
  </g>
);
// D18b: the frequency chart: human hearing stops at 20 kHz, the laugh is at 50
export const D18b: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp((t - 4) / 16));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t + 570} id="d18b" />
      <line x1={300} y1={760} x2={1640} y2={760} stroke={SCH.dim} strokeWidth={4} />
      <rect x={300} y={700} width={420 * g} height={60} fill={SCH.line} />
      <Big x={500} y={860} text="നമ്മൾ: 20 kHz" size={52} />
      <Wave x={1260} y={560} w={300} amp={50} per={6} t={t} color={SCH.live} />
      <line x1={1350} y1={640} x2={1350} y2={760} stroke={SCH.live} strokeWidth={6} opacity={g} />
      <Big x={1410} y={860} text="എലി: 50 kHz" size={52} color={SCH.glow} t={t - 10} />
    </g>
  );
};
// H5: the wall again, giggles pop in the dark
export const H5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(WALL.x, WALL.y, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Wall t={t} />
    <Eyes t={99} n={60} />
    {[[300, 300, 2], [900, 500, 6], [500, 750, 10], [1300, 250, 14], [1500, 700, 18]].map(([x, y, d], i) => (
      <text key={i} x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#FFE27A" opacity={clamp((t - d) / 4)}>ഹി ഹി</text>
    ))}
  </g>
);
// H6: close-up, Pip in the dark, wide-eyed
export const H6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.0], [len, 1.15]], easeIn))}>
    <g filter="url(#blur6)"><Bedroom t={t + 330} id="bh6" veil={0.8} lamp={0} /></g>
    <Fig look={PIP} pose={{ x: 960, y: 860, scale: 2.2, look: kf(t, [[0, -0.6], [20, 0.6]]), ...face(t, [[0, 'worried'], [12, 'shock']]) }} rimId="rimBlue" shadow={0} />
  </g>
);
// END: the next-episode card
export const END: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#0C0C16" />
    <Eyes t={99} n={30} />
    <text x={960} y={460} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={64} fill={SCH.dim} opacity={clamp(t / 8)}>അടുത്ത ഭാഗം</text>
    <g transform={`translate(960 600) scale(${backOut(clamp((t - 8) / 10))})`}>
      <text x={0} y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill={AMBER}>എലികളുടെ നഗരം</text>
    </g>
    <Fade t={t} len={len} n={20} />
  </g>
);

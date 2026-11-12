import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeIn, backOut, camT, LOOKS, LEG_LEN,
  Kitchen, KITCHEN, stand, Bedroom, BEDROOM, WINDOW, Rooftop, Schematic, SCH, Arrow, DrawOn,
  Cat, Cookie, TitleCard, ShotProps, FONT,
} from '../../engine';

const PIP = LOOKS.ramu;
const MO = LOOKS.appu;
const AMBER = '#FFB15A';
const ROOF_FEET = 840;
const roofPose = (x: number, s: number, p: Partial<Pose> = {}): Partial<Pose> => ({ x, y: ROOF_FEET - LEG_LEN * s, scale: s, ...p });

// ---------- the new cast: a dog and a crow, plus the speech bubble the power shows ----------
export const Dog: React.FC<{ x: number; y: number; s?: number; f: number; tell?: number }> = ({ x, y, s = 1, f, tell = 0 }) => {
  const wag = Math.sin(f / 2.2) * 18;
  const fur = '#B98A5A';
  const dark = '#8C6440';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={80} ry={10} fill="#000" opacity={0.25} />
      <path d={`M 58 -50 Q ${90 + wag} ${-90} ${80 + wag * 1.4} ${-110}`} stroke={fur} strokeWidth={12} fill="none" strokeLinecap="round" />
      {[-40, -18, 22, 46].map((lx, i) => <rect key={i} x={lx - 7} y={-34} width={14} height={36} rx={6} fill={i % 2 ? dark : fur} />)}
      <ellipse cx={0} cy={-52} rx={70} ry={30} fill={fur} />
      <g transform={`translate(-62 ${-84 - tell * 6}) rotate(${-tell * 10})`}>
        <circle cx={0} cy={0} r={32} fill={fur} />
        <ellipse cx={-30} cy={10} rx={22} ry={15} fill="#D7B48A" />
        <circle cx={-48} cy={6} r={7} fill="#1A1414" />
        <circle cx={-6} cy={-8} r={6} fill="#1A1414" />
        <circle cx={-4} cy={-10} r={2} fill="#FFF" />
        <path d="M 12 -20 Q 34 -10 26 26 Q 14 10 10 -12 Z" fill={dark} />
        {tell > 0.5 ? <path d="M -40 20 q 10 10 22 0" stroke="#1A1414" strokeWidth={3} fill="#C9545A" /> : null}
      </g>
    </g>
  );
};

export const Crow: React.FC<{ x: number; y: number; s?: number; f: number; look?: number; open?: number; flip?: boolean }> = ({ x, y, s = 1, f, look = 0, open = 0, flip = false }) => {
  const bob = Math.sin(f / 6) * 2;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`}>
      <path d="M 26 -30 L 70 -6 L 30 -10 Z" fill="#14121A" />
      <ellipse cx={0} cy={-34} rx={36} ry={24} fill="#1E1B26" />
      <path d="M -6 -50 Q 30 -48 40 -24 Q 10 -26 -6 -36 Z" fill="#2A2634" />
      <line x1={-6} y1={-12} x2={-10} y2={4} stroke="#55505E" strokeWidth={4} />
      <line x1={8} y1={-12} x2={10} y2={4} stroke="#55505E" strokeWidth={4} />
      <g transform={`translate(-30 ${-60}) rotate(${look * 20})`}>
        <circle cx={0} cy={0} r={20} fill="#1E1B26" />
        <path d={`M -16 -4 L -46 ${2} L -16 4 Z`} fill="#3A3644" />
        {open > 0 ? <path d={`M -16 4 L -40 ${8 + open * 8} L -16 8 Z`} fill="#3A3644" /> : null}
        <circle cx={-6} cy={-5} r={5} fill="#F2D06B" />
        <circle cx={-7} cy={-5} r={2.2} fill="#111" />
      </g>
    </g>
  );
};

/** A speech bubble popping out of an animal: the power made visible. */
export const Bubble: React.FC<{ x: number; y: number; t: number; text: string; size?: number; tailX?: number; tailY?: number; children?: React.ReactNode }> = ({ x, y, t, text, size = 64, tailX = -60, tailY = 120, children }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 6));
  const w = Math.max(220, text.length * size * 0.62 + 90) + (children ? 140 : 0);
  const h = size * 1.9;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M ${-30} ${h / 2 - 4} L ${tailX} ${tailY} L ${30} ${h / 2 - 4} Z`} fill="#FFF7E8" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="#FFF7E8" stroke="#1A1230" strokeWidth={5} />
      <path d={`M ${-27} ${h / 2 - 2} L ${tailX} ${tailY} L ${27} ${h / 2 - 2}`} fill="none" stroke="#1A1230" strokeWidth={5} strokeLinejoin="round" />
      <text x={children ? -60 : 0} y={size * 0.34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#1A1230">{text}</text>
      {children}
    </g>
  );
};

export const Fish: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={34} ry={18} fill="#7FB3D5" stroke="#1A1230" strokeWidth={4} />
    <path d="M 30 0 L 54 -18 L 54 18 Z" fill="#7FB3D5" stroke="#1A1230" strokeWidth={4} strokeLinejoin="round" />
    <circle cx={-18} cy={-4} r={4} fill="#1A1230" />
  </g>
);

export const Bowl: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-18} rx={46} ry={10} fill="#2A2630" />
    <path d="M -50 -18 L -40 4 L 40 4 L 50 -18 Z" fill="#C24E4E" />
    <ellipse cx={0} cy={-18} rx={50} ry={10} fill="none" stroke="#E07070" strokeWidth={3} />
  </g>
);

// ---------- kitchen beats ----------
const K_PIP = stand(KITCHEN, 0.6, 0.5);
const K_CAT = KITCHEN.P(0.36, 1, 0.55);

// S1: wide, the kitchen: the cat by its empty bowl turns and looks up at Pip
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: K_PIP.x + 40, y: K_PIP.y, scale: K_PIP.scale, yaw: -0.5, look: -0.6, armL: { a: 12, b: -8 }, armR: { a: 14, b: -10 } } },
    { f: 16, p: { x: K_PIP.x, look: -0.9, headTilt: 6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 930]]), 600, kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Kitchen t={t + 20} id="ak1" />
      <Bowl x={K_CAT.x - 110} y={K_CAT.y} s={0.8} />
      <Cat x={K_CAT.x} y={K_CAT.y} mood={t < 10 ? 'peek' : 'alert'} f={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// S2: close-up, low on the floor: the cat speaks, a bubble with a fish
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(K_CAT.x - 40, K_CAT.y - 90, kf(t, [[0, 3.4], [len, 3.7]]))}>
    <g filter="url(#blur6)"><Kitchen t={t + 60} id="ak2" /></g>
    <Bowl x={K_CAT.x - 110} y={K_CAT.y} s={0.8} />
    <Cat x={K_CAT.x} y={K_CAT.y} mood="alert" f={t} />
    <g transform={`translate(${K_CAT.x - 30} ${K_CAT.y - 150}) scale(0.42)`}>
      <Bubble x={0} y={0} t={t - 2} text="മീൻ!" size={70} tailX={-40} tailY={150}>
        <Fish x={120} y={-4} s={1.3} />
      </Bubble>
    </g>
  </g>
);

// S3: medium, Pip jolts back, shocked
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: K_PIP.x, y: K_PIP.y, scale: K_PIP.scale, yaw: -0.4, look: -0.8, armL: { a: 12, b: -8 }, armR: { a: 14, b: -10 } } },
    { f: 4, p: { x: K_PIP.x + 22, headTilt: -10, armL: { a: 60, b: 40 }, armR: { a: 70, b: 50 } }, ease: easeOut },
    { f: 8, p: { x: K_PIP.x + 18, headTilt: -6 } },
  ]);
  return (
    <g transform={camT(K_PIP.x - 20, K_PIP.y - 40, kf(t, [[0, 2.2], [len, 2.35]]))}>
      <Kitchen t={t + 90} id="ak3" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- rooftop beats: Mo and his dog ----------
// S4: wide, the roof at dusk: Mo eats, his dog sits beside him, Pip walks up
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const mo = poseAt(t, [{ f: 0, p: roofPose(1060, 0.62, { yaw: -0.3, armR: { a: 120, b: 100 }, armL: { a: 14, b: 6 } }) }, { f: 20, p: { armR: { a: 135, b: 110 } } }]);
  const pip = poseAt(t, [{ f: 0, p: roofPose(820, 0.62, { yaw: 0.4, look: 0.5 }) }, { f: len, p: { x: 760 } }]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 1000]]), 700, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Rooftop t={t} sunX={1300} sunY={620} />
      <Dog x={1250} y={ROOF_FEET + 2} s={0.62} f={t} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.6} />
    </g>
  );
};

// S5: close-up, the dog tells on Mo: a bubble with a biscuit and an arrow
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1180, 720, kf(t, [[0, 2.4], [len, 2.6]]))}>
    <g filter="url(#blur6)"><Rooftop t={t + 45} sunX={1300} sunY={620} /></g>
    <Dog x={1250} y={ROOF_FEET + 2} s={0.62} f={t} tell={clamp(t / 4)} />
    <g transform="translate(1130 640) scale(0.4)">
      <Bubble x={0} y={0} t={t - 1} text="അവൻ!" size={70} tailX={60} tailY={150}>
        <Cookie x={130} y={-2} s={1.2} rot={-10} bite={1} seed={4} />
      </Bubble>
    </g>
  </g>
);

// S6: medium, Mo caught: oops, crumbs on his jacket
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const mo = poseAt(t, [
    { f: 0, p: { x: 960, y: 800, scale: 1.7, yaw: -0.2, armR: { a: 130, b: 110 }, armL: { a: 14, b: 6 } } },
    { f: 6, p: { armR: { a: 40, b: 30 }, headTilt: 8, look: 0.6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 66} sunX={1250} sunY={560} low={260} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy'], [5, 'oops']]) }} rimId="rimL" shadow={0} />
      {[[-40, 30], [10, 60], [50, 20], [-10, 90]].map(([dx, dy], i) => (
        <circle key={i} cx={960 + dx} cy={640 + dy + kf(t, [[0, 0], [len, 12]])} r={7} fill="#C98B4A" />
      ))}
    </g>
  );
};

// ---------- bedroom: the crow at the window ----------
const SILL = { x: (WINDOW.x0 + WINDOW.x1) / 2, y: WINDOW.y1 };
const B_PIP = stand(BEDROOM, 0.45, 0.45);

// S7: wide, the bedroom at dusk: a crow lands on the sill, Pip turns
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const land = easeOut(clamp(t / 12));
  const pose = poseAt(t, [
    { f: 0, p: { x: B_PIP.x, y: B_PIP.y, scale: B_PIP.scale, yaw: -0.3, look: -0.2 } },
    { f: 14, p: { yaw: 0.5, look: 0.9, headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1120]]), 520, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <Bedroom t={t + 30} id="ab7" />
      <Crow x={SILL.x + (1 - land) * 180} y={SILL.y - (1 - land) * 120} s={0.9} f={t} flip />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [16, 'worried']]), blink: 0 }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// S8: close-up, the crow calls his name
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(SILL.x, SILL.y - 70, kf(t, [[0, 3.6], [len, 3.9]]))}>
    <g filter="url(#blur6)"><Bedroom t={t + 70} id="ab8" /></g>
    <Crow x={SILL.x} y={SILL.y} s={0.7} f={t} flip open={t > 8 && t < 30 ? 1 : 0} look={-0.2} />
    <g transform={`translate(${SILL.x - 60} ${SILL.y - 150}) scale(0.28)`}>
      <Bubble x={0} y={0} t={t - 8} text="പിപ്!" size={80} tailX={80} tailY={160} />
    </g>
  </g>
);

// ---------- S9: the title card on the roof ----------
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Rooftop t={t} sunX={960} sunY={690 - 40 * easeOut(clamp(t / 40))} />
    <Crow x={520} y={500} s={0.6} f={t} />
    <Dog x={1420} y={ROOF_FEET} s={0.55} f={t} />
    <TitleCard t={t} lines={['മൃഗങ്ങളോട്', 'സംസാരിക്കാൻ പറ്റിയാലോ?']} accent="പറ്റിയാലോ?" accentT={24} size={104} />
  </g>
);

// ---------- the turn, on the schematic ----------
export const FaceIcon: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = SCH.line }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={5}>
    <ellipse cx={0} cy={0} rx={90} ry={110} />
    <circle cx={-32} cy={-20} r={10} />
    <circle cx={32} cy={-20} r={10} />
    <path d="M -36 44 Q 0 66 36 44" />
  </g>
);

// S10: schematic: a crow scans a human face; the outline locks into its memory
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const scan = kf(t, [[6, 300], [40, 720]]);
  const lock = clamp((t - 44) / 8);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t} id="as10" />
      <text x={180} y={160} fontFamily={SCH.dim} fontSize={38} fill={SCH.dim} letterSpacing={4}>FACE RECOGNITION // CORVUS</text>
      <FaceIcon x={620} y={520} s={1.4} />
      {t > 6 && t < 44 ? <line x1={460} y1={scan} x2={780} y2={scan} stroke={SCH.live} strokeWidth={6} opacity={0.9} /> : null}
      <Arrow x0={820} y0={520} x1={1180} y1={520} t={t - 20} dur={14} color={SCH.live} bend={0} />
      <g transform="translate(1420 640)"><Crow x={0} y={0} s={4} f={t} flip /></g>
      <g opacity={lock}>
        <rect x={470} y={340} width={300} height={360} fill="none" stroke={AMBER} strokeWidth={6} strokeDasharray="22 12" />
        <text x={620} y={760} textAnchor="middle" fontFamily={SCH.dim} fontSize={40} fill={AMBER}>SAVED</text>
      </g>
    </g>
  );
};

// S10b: close-up on the crow's eye; the years count up past five
export const S10b: React.FC<ShotProps> = ({ t, len }) => {
  const yrs = Math.min(5, Math.floor(kf(t, [[4, 0], [40, 5.99]])));
  const plus = t > 44;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t + 40} id="as10b" />
      <circle cx={620} cy={540} r={230} fill="#0A1424" stroke={SCH.dim} strokeWidth={4} />
      <circle cx={620} cy={540} r={150} fill="#F2D06B" />
      <circle cx={620} cy={540} r={70} fill="#111" />
      <g opacity={0.85}><FaceIcon x={620} y={540} s={0.42} color="#F6EFE3" /></g>
      <circle cx={580} cy={500} r={22} fill="#FFF" opacity={0.8} />
      <text x={1060} y={470} fontFamily={SCH.dim} fontSize={38} fill={SCH.dim} letterSpacing={4}>MEMORY</text>
      <text x={1060} y={620} fontFamily={FONT.title} fontWeight={800} fontSize={170} fill={plus ? AMBER : SCH.live}>{yrs}{plus ? '+' : ''}</text>
      <text x={1060} y={700} fontFamily={SCH.dim} fontSize={48} fill={SCH.line}>YEARS</text>
    </g>
  );
};

// S11: schematic: one crow tells the others; the warning spreads across a network
const NET: [number, number][] = [[420, 560], [760, 360], [760, 760], [1100, 260], [1100, 560], [1100, 860], [1440, 400], [1440, 720]];
const LINKS: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [4, 6], [4, 7], [3, 6], [5, 7]];
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.05], [len, 0.98]]))}>
    <Schematic t={t + 80} id="as11" />
    <text x={180} y={160} fontFamily={SCH.dim} fontSize={38} fill={SCH.dim} letterSpacing={4}>WORD SPREADS // CROW TO CROW</text>
    {LINKS.map(([a, b], i) => {
      const at = 4 + (NET[a][0] - 420) / 30;
      return <DrawOn key={i} d={`M ${NET[a][0]} ${NET[a][1]} L ${NET[b][0]} ${NET[b][1]}`} t={t - at} dur={10} color={SCH.live} width={5} />;
    })}
    {NET.map(([x, y], i) => {
      const on = t > 4 + (x - 420) / 30;
      return (
        <g key={i} opacity={i === 0 || on ? 1 : 0.25}>
          <Crow x={x} y={y + 30} s={1.3} f={t + i * 5} open={on && Math.floor((t + i * 3) / 6) % 2 ? 1 : 0} flip={i % 2 === 0} />
        </g>
      );
    })}
    <g transform="translate(420 380) scale(0.4)"><FaceIcon x={0} y={0} color={AMBER} /></g>
  </g>
);

// ---------- the threat ----------
const WIRE = (x: number) => 430 + 70 * (1 - Math.pow((x - 960) / 860, 2));
const ROW = [300, 420, 540, 660, 780, 1140, 1260, 1380, 1500, 1620];

// S12: wide, a power line full of crows; one by one their heads turn to Pip
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [{ f: 0, p: roofPose(960, 0.62, { yaw: 0, look: 0 }) }, { f: 30, p: { headTilt: -6 } }]);
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Rooftop t={t + 120} sunX={960} sunY={660} red={0.25} />
      <path d={`M 100 ${WIRE(100)} Q 960 ${WIRE(960) + 70} 1820 ${WIRE(1820)}`} stroke="#0E0C14" strokeWidth={4} fill="none" />
      {ROW.map((x, i) => {
        const turn = clamp((t - 4 - i * 3) / 4);
        return <Crow key={i} x={x} y={WIRE(x) + 36} s={0.75} f={t + i * 7} flip={x > 960 ? turn < 0.5 : turn > 0.5} look={turn * 0.6} />;
      })}
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [24, 'worried']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// S13: close-up, Pip in the middle of the whispers, then black
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 820, scale: 2.0, yaw: 0, look: 0.3 } },
    { f: 20, p: { look: -0.3, headTilt: 4 } },
    { f: 40, p: { look: 0.4, headTilt: -4 } },
  ]);
  const words: [number, number, number, number][] = [[460, 260, 2, -8], [1460, 300, 8, 10], [400, 620, 14, 6], [1520, 640, 20, -6], [960, 160, 26, 0]];
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]], easeIn))}>
      <Rooftop t={t + 200} sunX={980} sunY={600} red={0.35} low={180} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [30, 'shock']]) }} rimId="rimR" shadow={0} />
      {words.map(([x, y, d, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(0.85)`}>
          <Bubble x={0} y={0} t={t - d} text="...പിപ്..." size={60} tailX={x < 960 ? 80 : -80} tailY={140} />
        </g>
      ))}
      {t > len - 14 ? <rect x={-2000} y={-2000} width={6000} height={6000} fill="#000" opacity={clamp((t - (len - 14)) / 12)} /> : null}
    </g>
  );
};

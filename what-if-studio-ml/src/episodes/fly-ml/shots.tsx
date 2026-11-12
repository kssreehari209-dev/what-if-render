import React from 'react';
import {
  poseAt, faceAt, kf, clamp, easeOut, easeIn, backOut, camT, rnd, LEG_LEN, Pose,
  Bedroom, BEDROOM, WINDOW, BedDuvet, bedSit, Kitchen, KITCHEN, KitchenIsland, islandTop, stand, Rooftop, Study,
  Schematic, SCH, DrawOn, Arrow, SchLabel, CountUp, TitleCard, ShotProps, FONT, Glow, Tag, Dial, DizzyStars, Sparkle,
  Foreground, FloatLabel, Stars, Moon, Haze, Skyline, Phone, Plate,
} from '../../engine';
import { SchoolBus, StreetSet } from '../animals3-ml/shots';
import {
  Fig, flyPose, risePose, hoverPose, Sky, Cloud, CloudRow, CloudSea, Palm, MangoTree, KHouse, Grass, Water, Boat,
  TeaHills, FlatBuilding, PlaneFront, BlackCar, Gust, SpeedLines, Rain, Bolt, Whiteout, Tunnel, Drops, Breath, Frost,
  Goggles, BlueHands, headAt, handAt, Radar, TV, NewsBar, Elephant, Goose, Hummingbird, Heart, SchHead, Big, Real,
  Fade, FadeIn, PIP, MO, SIS, MOM, SUIT,
} from './kit';

const feet = (y: number, s: number) => y - LEG_LEN * s; // hip y for feet on y
const shiver = (t: number, a = 3) => Math.sin(t * 2.7) * a;

// ============================================================ A. COLD OPEN: night above the clouds
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const p = hoverPose(960, 520, t, 0.85, { yaw: 0.2, look: 0.3, armL: { a: 30, b: -40 }, armR: { a: 30, b: -40 }, ...faceAt(t, [[0, 'worried']]) });
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 0.95], [len, 1.12]]))}>
      <Sky id="a1" mode="night" stars={60} t={t} moon={[1500, 220, 70]} />
      {/* city lights below, through gaps in the cloud */}
      {Array.from({ length: 50 }).map((_, i) => (
        <circle key={i} cx={-200 + rnd(2, i) * 2400} cy={820 + rnd(3, i) * 200} r={3 + rnd(4, i) * 4} fill="#FFC867" opacity={0.6 + 0.4 * Math.sin(t / 6 + i)} />
      ))}
      <Glow x={700} y={900} r={500} kind="warm" o={0.35} />
      <CloudSea t={t + 40} y={760} tone="night" />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <Breath x={headAt(p).x - 30} y={headAt(p).y + 20} t={t} />
    </g>
  );
};

export const A2: React.FC<ShotProps> = ({ t }) => {
  const p = hoverPose(960 + shiver(t), 560, t, 1, {
    yaw: 0.15, armL: { a: 28, b: -118 }, armR: { a: 28, b: -118 }, headTilt: -4,
    ...faceAt(t, [[0, 'worried'], [58, 'shock']]),
  });
  const h = headAt(p);
  return (
    <g transform={camT(960, 420, 2.4)}>
      <Sky id="a2" mode="night" stars={40} t={t} />
      <CloudRow t={t + 80} y={760} n={6} tone="night" speed={-0.8} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <Frost x={960} y={520} s={1} o={0.5} />
      <Breath x={h.x - 30} y={h.y + 24} t={t} />
    </g>
  );
};

export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.03 * Math.pow(30, clamp(t / len));
  const p = hoverPose(620, 760, t, 0.9, { yaw: 0.55, look: 0.8, armL: { a: 40, b: -30 }, armR: { a: 70, b: -20 }, ...faceAt(t, [[0, 'worried'], [20, 'shock']]) });
  return (
    <g transform={`${camT(960, 540, 1)} translate(${shiftShake(t, 40)} 0)`}>
      <Sky id="a3" mode="night" stars={50} t={t} />
      <CloudSea t={t + 120} y={820} tone="night" />
      <Glow x={1060} y={500} r={200 + s * 500} kind="warm" o={0.25 + s * 0.4} />
      <PlaneFront x={1060} y={500 + s * 40} s={s} t={t} />
      <Fig look={PIP} pose={p} rimId="rimR" />
    </g>
  );
};
const shiftShake = (t: number, from: number) => (t > from ? Math.sin(t * 3.1) * 8 * Math.min(1, (t - from) / 10) : 0);

// ============================================================ B. THE DEMOS
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const busX = kf(t, [[0, 1050], [len, 2500]], easeIn);
  const runX = kf(t, [[0, 220], [45, 760]], easeOut);
  const running = t < 45;
  const p: Partial<Pose> = running
    ? { x: runX, y: feet(640, 0.9) - Math.abs(Math.sin(t / 2.4)) * 10, scale: 0.9, yaw: 0.9, facing: 1, tilt: 10, legL: { a: 34 * Math.sin(t / 2.4), b: -30 }, legR: { a: -34 * Math.sin(t / 2.4), b: -30 }, armL: { a: -40 * Math.sin(t / 2.4), b: -50 }, armR: { a: 40 * Math.sin(t / 2.4), b: -50 }, expr: 'worried' }
    : { x: 760, y: feet(640, 0.9), scale: 0.9, yaw: 0.6, tilt: 4, look: 0.9, armL: { a: 8, b: -4 }, armR: { a: 8, b: -4 }, headTilt: 6, ...faceAt(t - 45, [[0, 'oops']]) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 520, 1.05)}>
      <StreetSet t={t} />
      <SchoolBus x={busX} y={700} s={0.9} t={t} />
      <Fig look={PIP} pose={p} shadow={0.6} />
      <Tag x={960} y={110} t={t - 2} text="3 ദിവസം മുമ്പ്" w={460} />
    </g>
  );
};

export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const up = 52; // ഉയരൂ lands about 1.7 s in
  const lift = kf(t, [[up, 0], [len, -520]], easeIn);
  const p: Partial<Pose> = t < up
    ? { x: 960, y: feet(640, 1), scale: 1, yaw: 0.1, armL: { a: 14, b: -10 }, armR: { a: 14, b: -10 }, blink: t > 8 ? 1 : 0, expr: 'neutral' }
    : risePose(960, feet(640, 1) + lift, t, 1, { ...faceAt(t - up, [[0, 'shock'], [14, 'happy']]), glint: 0.8 });
  return (
    <g transform={camT(960, kf(t, [[0, 470], [up, 440], [len, 260]]), kf(t, [[0, 1.9], [up, 2.1], [len, 1.6]]))}>
      <StreetSet t={t + 90} />
      <Fig look={PIP} pose={p} shadow={t < up ? 0.6 : 0} />
      <Gust x={960} y={640} t={t - up} />
    </g>
  );
};

export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const busX = kf(t, [[0, 500], [len, 900]]);
  const px = kf(t, [[0, 300], [len, 1500]]);
  return (
    <g transform={camT(960, 470, 0.9)}>
      <StreetSet t={t + 200} />
      <g transform="translate(1720 600)">
        <rect x={-180} y={-330} width={460} height={330} fill="#C9A26B" stroke="#1A1230" strokeWidth={6} />
        <rect x={-150} y={-390} width={400} height={70} fill="#A2432C" stroke="#1A1230" strokeWidth={6} />
        <text x={50} y={-342} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFF4DC">സ്കൂൾ</text>
      </g>
      <SchoolBus x={busX} y={700} s={0.8} t={t} />
      <Fig look={PIP} pose={flyPose(px, 260, t, 0.7, 1, { expr: 'happy' })} />
      <SpeedLines t={t} dir={1} o={0.3} n={10} />
    </g>
  );
};

/** The yard: house behind, mango tree left, coconut palm right. */
const Yard: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Sky id={id} mode="day" />
    <CloudRow t={t} y={180} n={4} tone="day" speed={-0.3} s={0.6} />
    <Palm x={200} y={760} s={0.8} t={t} lean={-40} />
    <KHouse x={960} y={760} s={0.75} />
    <Grass y={760} />
  </g>
);

export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const up = 76;
  const kite = { x: 470, y: 230 };
  const lift = kf(t, [[up, 0], [up + 40, -460], [len - 30, -460], [len, -300]], easeOut);
  const pip: Partial<Pose> = t < up
    ? { x: 700, y: feet(900, 0.9), scale: 0.9, yaw: -0.4, look: -0.6, headTilt: -10, ...faceAt(t, [[0, 'neutral']]) }
    : risePose(700 - clamp((t - up) / 40) * 160, feet(900, 0.9) + lift, t, 0.9, { armL: { a: 160, b: 0 }, ...faceAt(t - up, [[0, 'happy']]) });
  const hand = handAt(pip, 'L');
  const held = t > up + 40;
  return (
    <g transform={camT(800, 520, 1.0)}>
      <Yard t={t} id="b4" />
      <MangoTree x={420} y={900} s={0.85} t={t} />
      {/* the kite */}
      <g transform={`translate(${held ? hand.x : kite.x} ${held ? hand.y - 20 : kite.y}) rotate(${held ? -10 : 20 + Math.sin(t / 6) * 6})`}>
        <path d="M 0 -60 L 44 0 L 0 70 L -44 0 Z" fill="#E8573C" stroke="#1A1230" strokeWidth={5} />
        <line x1={0} y1={-60} x2={0} y2={70} stroke="#1A1230" strokeWidth={3} />
        <line x1={-44} y1={0} x2={44} y2={0} stroke="#1A1230" strokeWidth={3} />
        <path d={`M 0 70 q 20 30 0 60 q -20 30 0 60`} stroke="#F6EFE3" strokeWidth={4} fill="none" />
      </g>
      <Fig look={SIS} pose={{ x: 1040, y: feet(900, 0.62), scale: 0.62, yaw: -0.5, look: -0.7, armR: { a: 150, b: 0 }, handR: 'point', headTilt: -10, ...faceAt(t, [[0, 'worried'], [up + 10, 'shock']]) }} shadow={0.6} />
      <Fig look={PIP} pose={pip} shadow={t < up ? 0.6 : 0} />
      <Gust x={700} y={900} t={t - up} s={0.8} />
    </g>
  );
};

export const B5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(1040, kf(t, [[0, 640], [60, 620]]), 3.0)}>
    <Yard t={t + 200} id="b5" />
    <Fig look={SIS} pose={{ x: 1040, y: feet(900, 0.62), scale: 0.62, yaw: -0.2, look: -0.5, headTilt: -14, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 }, expr: 'shock' }} />
    <Sparkle x={980} y={560} t={t - 10} />
  </g>
);

export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const up = 88;
  const lift = kf(t, [[up, 0], [up + 26, -560]], easeIn);
  const palmX = 1400;
  const pip: Partial<Pose> = t < up
    ? { x: 1180, y: feet(900, 0.85), scale: 0.85, yaw: 0.3, look: -0.3, ...faceAt(t, [[0, 'neutral'], [40, 'smug']]) }
    : risePose(1260, feet(900, 0.85) + lift, t, 0.85, { ...faceAt(t - up, [[0, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 1000], [up, 1060], [len, 1150]]), kf(t, [[0, 560], [up, 560], [up + 26, 360]]), kf(t, [[0, 1.0], [len, 0.95]]))}>
      <Sky id="b6" mode="day" />
      <CloudRow t={t + 50} y={160} n={4} tone="day" speed={-0.3} s={0.6} />
      <KHouse x={560} y={900} s={0.75} />
      <Palm x={palmX} y={900} s={1.1} t={t} lean={30} />
      <Grass y={900} />
      <Fig look={MOM} pose={{ x: 820, y: feet(900, 0.85), scale: 0.85, yaw: 0.4, look: 0.5, armR: { a: 40, b: -60 }, ...faceAt(t, [[0, 'neutral'], [up + 8, 'shock']]) }} shadow={0.6} />
      {/* the knife in her hand */}
      <g transform={`translate(${handAt({ x: 820, y: feet(900, 0.85), scale: 0.85, yaw: 0.4, armR: { a: 40, b: -60 } }, 'R').x} ${handAt({ x: 820, y: feet(900, 0.85), scale: 0.85, yaw: 0.4, armR: { a: 40, b: -60 } }, 'R').y}) rotate(-30)`}>
        <rect x={-6} y={-60} width={12} height={50} rx={3} fill="#D8DEE8" stroke="#1A1230" strokeWidth={3} />
        <rect x={-7} y={-12} width={14} height={30} rx={4} fill="#5A3E2C" stroke="#1A1230" strokeWidth={3} />
      </g>
      <Fig look={PIP} pose={pip} shadow={t < up ? 0.6 : 0} />
      <Gust x={1260} y={900} t={t - up} s={0.8} />
    </g>
  );
};

export const B7: React.FC<ShotProps> = ({ t }) => {
  const p = hoverPose(1350, 230, t, 0.85, { yaw: -0.5, look: -0.6, armR: { a: 120, b: 30 }, ...faceAt(t, [[0, 'smug']]) });
  const h = handAt(p, 'R');
  return (
    <g transform={camT(1380, kf(t, [[0, 260], [60, 250]]), 1.7)}>
      <Sky id="b7" mode="day" />
      <CloudRow t={t + 300} y={150} n={4} tone="day" speed={-0.4} s={0.7} />
      <Palm x={1400} y={900} s={1.1} t={t + 120} lean={30} />
      <Fig look={PIP} pose={p} />
      <circle cx={h.x} cy={h.y - 10} r={30} fill="#9AB43A" stroke="#1A1230" strokeWidth={5} />
      <path d={`M ${h.x - 10} ${h.y - 40} l 10 -14 l 8 12`} stroke="#5A6E22" strokeWidth={5} fill="none" />
    </g>
  );
};

export const B8: React.FC<ShotProps> = ({ t }) => {
  const knifeY = kf(t, [[6, 0], [24, 330]], easeIn);
  const mp = { x: 900, y: feet(900, 0.85), scale: 0.85, yaw: 0.2, look: 0.4, headTilt: -14, armR: { a: 40, b: -60 }, armL: { a: 20, b: -40 }, expr: 'shock' as const };
  const h = handAt(mp, 'R');
  return (
    <g transform={camT(900, kf(t, [[0, 650], [40, 700]]), 2.3)}>
      <Sky id="b8" mode="day" />
      <KHouse x={560} y={900} s={0.75} />
      <Grass y={900} />
      <Fig look={MOM} pose={mp} />
      <g transform={`translate(${h.x} ${h.y + knifeY}) rotate(${-30 + clamp(t / 24) * 160})`}>
        <rect x={-6} y={-60} width={12} height={50} rx={3} fill="#D8DEE8" stroke="#1A1230" strokeWidth={3} />
        <rect x={-7} y={-12} width={14} height={30} rx={4} fill="#5A3E2C" stroke="#1A1230" strokeWidth={3} />
      </g>
    </g>
  );
};

export const B9: React.FC<ShotProps> = ({ t, len }) => {
  const up = 108;
  const pos = stand(BEDROOM, 0.72, 0.42);
  const lift = kf(t, [[up, 0], [len, -260]], easeIn);
  const p: Partial<Pose> = t < up
    ? { ...pos, yaw: 0.6, look: 0.8, ...faceAt(t, [[0, 'neutral'], [40, 'smug']]) }
    : risePose(pos.x + clamp((t - up) / 30) * 120, pos.y + lift, t, pos.scale, { yaw: 0.6, ...faceAt(t - up, [[0, 'happy']]), glint: 0.8 });
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1150]]), 470, 1.55)}>
      <Bedroom t={t} id="b9" lamp={1} />
      <Fig look={PIP} pose={p} rimId="rimBlue" shadow={t < up ? 0.5 : 0} />
      <Gust x={pos.x} y={pos.y + LEG_LEN * pos.scale} t={t - up} s={0.5} />
    </g>
  );
};

export const B10: React.FC<ShotProps> = ({ t, len }) => {
  // the camera rises with him: the house, the trees, then the clouds pass down the frame
  const rise = kf(t, [[0, 0], [len, 1500]], (k) => k);
  const p = risePose(960, 560, t, 0.75, { ...faceAt(t, [[0, 'happy'], [90, 'cool']]), look: 0.2 });
  return (
    <g>
      <g transform={`translate(0 ${rise})`}>
        <Sky id="b10" mode="night" y0={-1500} y1={1080} stars={70} t={t} />
        <KHouse x={960} y={1180} s={1.1} night lit={1} />
        <Palm x={300} y={1300} s={1.2} t={t} dark lean={-60} />
        <Palm x={1650} y={1300} s={1.3} t={t} dark lean={60} />
        <CloudRow t={t} y={-700} n={6} tone="night" speed={-0.5} s={1.2} />
        <CloudRow t={t + 60} y={-1100} n={5} tone="night" speed={-0.3} s={1} />
      </g>
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <SpeedLines t={t} vertical o={0.25} n={14} speed={-40} />
    </g>
  );
};

export const T: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Sky id="ttl" mode="dusk" />
    <CloudRow t={t + 500} y={760} n={6} tone="dusk" speed={-0.6} s={1.1} />
    <CloudRow t={t + 200} y={920} n={6} tone="dusk" speed={-1} s={1.4} />
    <Fig look={PIP} pose={flyPose(kf(t, [[0, 300], [len, 1650]]), 640, t, 0.55, 1, { expr: 'happy' })} rimId="rimR" />
    <TitleCard t={t} lines={['ഭാഗം 1', 'നിനക്ക് പറക്കാൻ പറ്റിയാലോ?']} accent="പറക്കാൻ" accentT={30} size={96} />
    <Fade t={t} len={len} n={8} />
  </g>
);

// ============================================================ C. THE RULES
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const wake = 46;
  const p: Partial<Pose> = {
    x: 900, y: 300 + Math.sin(t / 10) * 5, scale: 0.62, spin: -88, yaw: 0, armL: { a: 20, b: -20 }, armR: { a: 40, b: -30 }, legL: { a: 4, b: 10 }, legR: { a: -4, b: 14 },
    ...faceAt(t, [[0, 'neutral'], [wake, 'shock'], [150, 'oops']]), blink: t < wake ? 1 : 0,
  };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 900]]), kf(t, [[0, 470], [len, 430]]), kf(t, [[0, 1.05], [len, 1.3]]))}>
      <Bedroom t={t + 40} id="c1" lamp={0} duvet />
      <Glow x={1200} y={480} r={500} kind="warm" o={0.45} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      {t > wake ? <FloatLabel x={760} y={250} t={t - wake} text="!" size={90} /> : null}
    </g>
  );
};

const Rule: React.FC<{ y: number; t: number; icon: React.ReactNode; text: string; mark?: 'x' | 'check' }> = ({ y, t, icon, text, mark }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 8));
  return (
    <g transform={`translate(0 ${y})`} opacity={clamp(t / 4)}>
      <g transform={`translate(420 0) scale(${k})`}>{icon}</g>
      <text x={560} y={22} fontFamily={FONT.title} fontWeight={700} fontSize={64} fill={SCH.line}>{text}</text>
      {mark === 'x' ? <path d="M 1300 -30 L 1360 30 M 1360 -30 L 1300 30" stroke="#FF6A5A" strokeWidth={12} strokeLinecap="round" strokeDasharray={170} strokeDashoffset={170 * (1 - clamp((t - 8) / 5))} /> : null}
    </g>
  );
};

export const C2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [280, 1.05]]))}>
    <Schematic t={t} id="c2" />
    <SchHead text="നിയമങ്ങൾ" t={t} />
    <Rule y={330} t={t - 50} text="ഉയരൂ  →  നീ പൊങ്ങും" icon={<path d="M 0 40 L 0 -40 M -30 -10 L 0 -40 L 30 -10" stroke={SCH.live} strokeWidth={10} fill="none" strokeLinecap="round" />} />
    <Rule y={500} t={t - 150} text="നോക്കുന്നിടത്തേക്ക് പോകും" icon={<g><ellipse rx={46} ry={26} fill="none" stroke={SCH.live} strokeWidth={8} /><circle r={14} fill={SCH.live} /></g>} />
    <Rule y={670} t={t - 235} text="ചിറക്" mark="x" icon={<path d="M -40 10 Q -10 -50 40 -30 Q 10 -10 40 20 Q 0 10 -40 10 Z" fill="none" stroke={SCH.line} strokeWidth={6} />} />
    <Rule y={840} t={t - 258} text="എഞ്ചിൻ" mark="x" icon={<g><circle r={36} fill="none" stroke={SCH.line} strokeWidth={6} /><path d="M -20 -20 L 20 20 M 20 -20 L -20 20" stroke={SCH.line} strokeWidth={5} /></g>} />
  </g>
);

export const C3: React.FC<ShotProps> = ({ t }) => {
  const p = { x: 760, y: 640, scale: 1.1, yaw: 0.1, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 }, ...faceAt(t, [[0, 'neutral'], [80, 'worried']]) };
  return (
    <g transform={camT(960, 520, 1)}>
      <Schematic t={t} id="c3" />
      <SchHead text="പക്ഷേ ശരീരം പഴയതുതന്നെ" t={t} />
      <Fig look={PIP} pose={p} />
      <DrawOn d="M 900 380 L 1080 330" t={t - 80} />
      <SchLabel x={1100} y={340} t={t - 84} text="തണുപ്പ്" size={60} color={SCH.live} anchor="start" />
      <DrawOn d="M 900 520 L 1080 520" t={t - 100} />
      <SchLabel x={1100} y={540} t={t - 104} text="കാറ്റ്" size={60} color={SCH.live} anchor="start" />
      <DrawOn d="M 880 680 L 1080 710" t={t - 120} />
      <SchLabel x={1100} y={730} t={t - 124} text="വേദന" size={60} color={SCH.live} anchor="start" />
    </g>
  );
};

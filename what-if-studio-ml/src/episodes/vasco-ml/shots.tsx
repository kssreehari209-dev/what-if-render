import React from 'react';
import {
  poseAt, faceAt, kf, clamp, camT, shake, ShotProps, Foreground, TitleCard, FONT, Glow, Dial, Tag, DizzyStars, Sparkle,
  Schematic, SCH, DrawOn, SchLabel, CountUp, easeOut,
} from '../../engine';
import { Fig, PIP, MO, MangoTree, Boat, KHouse, Palm, handAt, headAt, Fade, Sky } from '../fly-ml/kit';
import {
  CAPT, PILOT, SAILOR, CapHat, Turban, Home, FLOORY, stood, KTable, KChair, PlateSide, KappaPlate, Chilli, CashewApple, Peppers,
  Caravel, Dhow, Sea, SeaBody, Shore, WordCard, Year,
} from './kit';

const TITLE: [string, string] = ['വാസ്കോ ഡ ഗാമ', 'വന്നില്ലായിരുന്നെങ്കിൽ?'];
const seat = (x: number, y: number, s: number, extra = {}) => ({
  x, y, scale: s, yaw: 0.72, facing: 1 as const, look: 0.7,
  legL: { a: 82, b: -82 }, legR: { a: 76, b: -76 }, armL: { a: 30, b: 14 }, armR: { a: 66, b: 12 }, ...extra,
});
const P0 = stood(0.34, 0.42);
const SEATY = FLOORY - 150;

/** The table scene everyone shares: Pip seated, the table, the plate. */
const Dining: React.FC<{ t: number; id: string; pose: object; table?: number; kappa?: number; veil?: number }> = ({ t, id, pose, table = 1, kappa = 1, veil }) => (
  <g>
    <Home t={t} id={id} veil={veil} />
    <KChair x={P0.x - 10} floor={FLOORY} seat={SEATY + 26} o={1} />
    <Fig look={PIP} pose={pose} shadow={0} />
    {table ? <KTable x={P0.x + 340} y={SEATY - 74} floor={FLOORY} /> : null}
    {table ? <PlateSide x={P0.x + 300} y={SEATY - 74} s={1.1} kappa={kappa} /> : null}
  </g>
);

// S1: the whole room at dusk, Mo in the doorway with a tea glass
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: seat(P0.x, SEATY, P0.scale, { armR: { a: 40, b: 10 } }) }, { f: 30, p: { armR: { a: 58, b: 10 } } }]);
  const mo = stood(0.05, 0.36);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 930]]), 590, kf(t, [[0, 0.98], [len, 1.04]]))}>
      <Dining t={t} id="v1" pose={{ ...pose, expr: 'happy' }} veil={0.3} />
      <Fig look={MO} pose={{ ...mo, yaw: 0.5, look: 0.6, armR: { a: 70, b: 60 } }} shadow={0.6} rimId="rimL" />
      {(() => { const h = handAt({ ...mo, yaw: 0.5, armR: { a: 70, b: 60 } }, 'R'); return <g transform={`translate(${h.x} ${h.y - 12})`}><path d="M -11 -26 L 11 -26 L 8 12 L -8 12 Z" fill="#E9D8B8" opacity={0.7} stroke="#8A7A5A" strokeWidth={2} /><path d="M -9 -12 L 9 -12 L 8 10 L -8 10 Z" fill="#9A5B2D" /></g>; })()}
      <Foreground blur={10}><path d="M 1480 1120 L 1600 760 Q 1740 700 1900 780 L 2000 1120 Z" fill="#0E0A14" opacity={0.85} /></Foreground>
    </g>
  );
};

// S2: top-down plate; the kappa goes in the pause before the word
export const S2: React.FC<ShotProps> = ({ t }) => {
  const reach = kf(t, [[0, 0], [30, 1]]);
  const grab = kf(t, [[46, 0], [56, 1]]);
  const gone = kf(t, [[40, 0], [45, 1]]);
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#4A2C20" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M -100 ${80 + i * 190} L 2000 ${40 + i * 196}`} stroke="#3A2218" strokeWidth={6} />)}
      <KappaPlate x={880} y={560} r={380} gone={gone} />
      {/* curry bowl at the side */}
      <circle cx={1520} cy={330} r={165} fill="#BCC3C9" stroke="#5E666E" strokeWidth={8} />
      <circle cx={1520} cy={330} r={132} fill="#C2452E" />
      <circle cx={1480} cy={300} r={22} fill="#E9A23A" opacity={0.7} />
      {/* the hand: from Pip's side, the left of frame */}
      <g transform={`translate(${kf(reach, [[0, -520], [1, 400]])} ${640})`}>
        <path d="M -600 40 L 300 30 Q 330 70 300 140 L -600 170 Z" fill="#2E2B3D" />
        <g transform={`translate(390 84) scale(${1 - grab * 0.2})`}>
          <ellipse cx={0} cy={0} rx={110} ry={86} fill="#E8C49C" stroke="#7A5A3C" strokeWidth={5} />
          <ellipse cx={22} cy={-82} rx={44} ry={28} fill="#E8C49C" stroke="#7A5A3C" strokeWidth={5} transform="rotate(-18)" />
        </g>
      </g>
      {t > 40 && t < 54 ? <Sparkle x={880} y={560} t={t - 40} s={3} /> : null}
      <Glow x={880} y={420} r={620} o={0.25} />
    </g>
  );
};

// S3: the curry loses its red; a chilli in a hat walks out with his suitcase
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pale = kf(t, [[30, 0], [44, 1]]);
  const red = `rgb(${Math.round(194 + pale * 36)}, ${Math.round(69 + pale * 140)}, ${Math.round(46 + pale * 90)})`;
  const cx = kf(t, [[76, 900], [len, 1700]], (v) => v);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.02], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#2A1A16" />
      <Glow x={960} y={200} r={900} o={0.3} />
      <rect x={-400} y={780} width={2720} height={700} fill="#4A2C20" />
      <path d="M -400 780 L 2320 780" stroke="#8A5C40" strokeWidth={6} />
      <path d="M 430 470 Q 450 800 960 800 Q 1470 800 1490 470 Z" fill="#AEB6BC" stroke="#5E666E" strokeWidth={8} />
      <ellipse cx={960} cy={470} rx={530} ry={110} fill="#C4CAD0" stroke="#5E666E" strokeWidth={8} />
      <ellipse cx={960} cy={476} rx={492} ry={92} fill={red} />
      {[[760, 462, 80, 30], [1100, 490, 100, 34], [960, 440, 66, 22]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#E9C8A0" stroke="#A8866A" strokeWidth={4} />)}
      {[[640, 496], [860, 512], [1240, 450]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#1A1014" />)}
      {t >= 72 ? <Chilli x={cx} y={kf(t, [[76, 480], [90, 450], [len, 745]], (v) => v)} s={1.25} t={t} /> : null}
      <Foreground blur={10}><ellipse cx={120} cy={1080} rx={360} ry={160} fill="#0E0A14" opacity={0.85} /></Foreground>
    </g>
  );
};

// S4: the hand lands; the table goes; Pip goes after it
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const gone = t >= 42;
  const pose = poseAt(t, [
    { f: 0, p: seat(P0.x, SEATY, P0.scale, { armR: { a: 74, b: 8 } }) },
    { f: 22, p: { armR: { a: 80, b: 4 } } },
    { f: 44, p: { spin: 0 } },
    { f: 56, p: { spin: 62, y: SEATY + 96, x: P0.x + 110, armR: { a: 150, b: 0 }, armL: { a: 130, b: 0 } } },
    { f: 60, p: { spin: 74, y: SEATY + 112, x: P0.x + 130 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [42, 'oops'], [56, 'shock']]);
  const drop = kf(t, [[42, 0], [54, 170]]);
  return (
    <g transform={camT(P0.x + 200, 620 + (t > 56 ? kf(t, [[56, 8], [62, 0]]) : 0), kf(t, [[0, 1.62], [len, 1.72]]))}>
      <Home t={t + 20} id="v4" />
      <KChair x={P0.x - 10} floor={FLOORY} seat={SEATY + 26} />
      <Fig look={PIP} pose={{ ...pose, ...face }} shadow={0} />
      {!gone ? <KTable x={P0.x + 340} y={SEATY - 74} floor={FLOORY} /> : null}
      <g transform={`translate(0 ${drop})`}><PlateSide x={P0.x + 300} y={SEATY - 74} s={1.1} kappa={0} /></g>
      {t >= 42 && t < 48 ? <Sparkle x={P0.x + 340} y={SEATY - 60} t={t - 42} s={3} /> : null}
    </g>
  );
};

// S5: Mo mid-sip; behind Mo, Pip's feet in the air
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const mo = stood(0.3, 0.6);
  const pose = poseAt(t, [{ f: 0, p: { ...mo, yaw: 0.5, look: 0.5, armR: { a: 120, b: 70 } } }, { f: 26, p: { look: -0.2 } }]);
  const face = faceAt(t, [[0, 'shock'], [34, 'worried']]);
  const hand = handAt({ ...pose }, 'R');
  const wig = Math.sin(t / 3) * 6;
  return (
    <g transform={camT(mo.x + 60, mo.y - 150, kf(t, [[0, 1.9], [len, 2.06]]))}>
      <Home t={t + 60} id="v5" veil={0.42} />
      {/* Pip, upside down on the floor behind Mo: still kicking */}
      <Fig look={PIP} pose={{ x: mo.x + 340, y: FLOORY - 170, scale: 0.74, spin: 180, yaw: 0.2, expr: 'dizzy', legL: { a: 14 + wig, b: 6 }, legR: { a: -14 - wig, b: 8 }, armL: { a: 70, b: 0 }, armR: { a: 70, b: 0 } }} shadow={0} />
      <Fig look={MO} pose={{ ...pose, ...face }} shadow={0} rimId="rimR" />
      <g transform={`translate(${hand.x} ${hand.y - 6})`}>
        <path d="M -22 -60 L 22 -60 L 16 20 L -16 20 Z" fill="#E9D8B8" opacity={0.65} stroke="#8A7A5A" strokeWidth={3} />
        <path d="M -18 -30 L 18 -30 L 15 16 L -15 16 Z" fill="#9A5B2D" />
      </g>
    </g>
  );
};

// S6: the ship that never made it
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1], [len, 1.05]]))}>
    <Sea t={t} id="v6" sunX={1460} />
    <Caravel x={kf(t, [[0, 520], [len, 760]], (v) => v)} y={680} s={0.72} t={t} o={kf(t, [[62, 1], [86, 0]])} />
    <Year t={t - 4} text="1498" />
    <Foreground blur={6}><path d="M -300 1140 Q 500 960 1200 1040 T 2300 1000 L 2300 1300 L -300 1300 Z" fill="#150E1E" opacity={0.9} /></Foreground>
  </g>
);

// S7: the shore with no ship on it; the title
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.02], [len, 1.06]]))}>
    <Shore t={t} id="v7" sunX={960} />
    <Boat x={1320} y={700} s={0.34} t={t} />
    <TitleCard t={t} lines={TITLE} accent="വന്നില്ലായിരുന്നെങ്കിൽ" accentT={70} size={112} y={206} gap={124} />
  </g>
);

// S8: the route
const AFRICA = 'M 430 330 Q 520 300 640 330 Q 760 320 860 372 Q 900 440 980 500 Q 960 560 900 620 Q 860 720 840 790 Q 780 900 700 950 Q 640 960 620 880 Q 590 760 580 640 Q 500 600 420 560 Q 340 500 360 420 Q 380 360 430 330 Z';
const EUROPE = 'M 420 250 L 470 180 L 640 170 L 760 210 L 860 270 Q 720 300 620 292 Q 500 300 420 250 Z';
const INDIA = 'M 1170 330 L 1460 320 L 1500 420 L 1390 500 L 1310 690 L 1270 700 L 1200 520 L 1140 430 Z';
const ROUTE = 'M 442 240 Q 300 420 300 620 Q 330 900 660 1000 Q 860 960 880 760 Q 880 690 870 640 Q 1060 610 1250 640';
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(910, 560, 1)}>
    <Schematic t={t} id="v8" />
    <path d={EUROPE} fill="#1C2C44" stroke={SCH.dim} strokeWidth={4} />
    <path d={AFRICA} fill="#1C2C44" stroke={SCH.dim} strokeWidth={4} />
    <path d={INDIA} fill="#1C2C44" stroke={SCH.dim} strokeWidth={4} />
    <DrawOn d={ROUTE} t={t - 4} dur={58} color={SCH.live} width={7} />
    <circle cx={442} cy={240} r={12} fill={SCH.line} />
    <SchLabel x={340} y={200} t={t - 2} text="ലിസ്ബൺ" size={42} />
    {t > 40 ? <circle cx={870} cy={640} r={12} fill={SCH.line} /> : null}
    <SchLabel x={1010} y={700} t={t - 42} text="മലിന്ദി" size={42} />
    {t > 60 ? <circle cx={1250} cy={640} r={14} fill={SCH.glow} /> : null}
    <SchLabel x={1480} y={640} t={t - 60} text="കോഴിക്കോട്" size={44} color={SCH.glow} />
  </g>
);

// S9: 170 men on the rail
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.02], [len, 1.12]]))}>
    <Sea t={t + 20} id="v9" horizon={760} sunX={420} />
    <Caravel x={1020} y={850} s={1.34} t={t} crew={26} />
    <g transform="translate(420 300)">
      <rect x={-200} y={-120} width={400} height={170} rx={18} fill="#0E0A16" opacity={0.7} />
      <CountUp x={0} y={20} t={t - 4} to={170} dur={34} size={130} />
    </g>
    <Foreground blur={6}><path d="M -300 1200 Q 700 1040 1400 1100 T 2300 1080 L 2300 1300 L -300 1300 Z" fill="#150E1E" opacity={0.85} /></Foreground>
  </g>
);

// S10: the same ship, going home with almost no one
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.12], [len, 1.04]]))}>
    <Sea t={t + 60} id="v10" mode="red" horizon={760} sunX={1500} />
    <Caravel x={kf(t, [[0, 1040], [len, 900]], (v) => v)} y={850} s={1.2} t={t} flip tatter={1} crew={5} />
    <g transform="translate(1500 300)">
      <rect x={-200} y={-120} width={400} height={170} rx={18} fill="#0E0A16" opacity={0.7} />
      <CountUp x={0} y={20} t={t - 14} to={55} dur={24} size={130} color="#FF5A4A" format={(v) => `~${Math.round(v)}`} />
    </g>
  </g>
);

// S11: the captain, the map, the compass that won't settle
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 860, y: 660, scale: 1.1, yaw: 0.4, look: 0.5, armR: { a: 60, b: 40 }, armL: { a: 60, b: 40 } } }, { f: 40, p: { look: -0.3, headTilt: -8 } }, { f: 74, p: { look: 0.6, headTilt: 8 } }]);
  const face = faceAt(t, [[0, 'worried'], [52, 'oops']]);
  const spin = kf(t, [[12, 0], [32, 90], [52, 180], [72, 270], [len, 360]]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Sea t={t + 40} id="v11" horizon={640} sunX={1500} />
      <rect x={-400} y={800} width={2720} height={700} fill="#4A2E20" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M -400 ${830 + i * 44} L 2320 ${830 + i * 44}`} stroke="#3A2218" strokeWidth={5} />)}
      <path d="M -400 790 L 2320 790" stroke="#8A5C40" strokeWidth={14} />
      <Fig look={CAPT} pose={{ ...pose, ...face }} shadow={0} />
      <CapHat pose={pose} />
      <g transform={`translate(${handAt(pose, 'R').x + 30} ${handAt(pose, 'R').y - 40}) rotate(${spin})`}>
        <rect x={-120} y={-86} width={240} height={172} fill="#E0CFA6" stroke="#6A4A2A" strokeWidth={4} />
        <path d="M -90 -40 Q -40 -70 0 -40 T 80 -30 M -60 30 Q 0 0 70 40" stroke="#6A4A2A" strokeWidth={5} fill="none" />
        <path d="M 74 54 l 18 18 M 92 54 l -18 18" stroke="#B32C2C" strokeWidth={6} />
      </g>
      <g transform="translate(1310 330)">
        <circle r={82} fill="#0E0A16" opacity={0.75} /><circle r={82} fill="none" stroke="#E9C46A" strokeWidth={6} />
        <g transform={`rotate(${t * 21})`}><path d="M 0 -62 L 13 0 L -13 0 Z" fill="#D9534F" /><path d="M 0 62 L 13 0 L -13 0 Z" fill="#E6DCC8" /></g>
      </g>
    </g>
  );
};

// S12: the jetty at Malindi
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const cap = poseAt(t, [{ f: 0, p: { x: 640, y: 618, scale: 0.92, yaw: 0.6, look: 0.8, armR: { a: 80, b: 26 }, armL: { a: 60, b: 20 } } }, { f: 20, p: { tilt: 8, armR: { a: 96, b: 30 } } }, { f: 44, p: { tilt: 14 } }]);
  const pil = poseAt(t, [{ f: 0, p: { x: 1180, y: 618, scale: 0.92, yaw: -0.5, look: -0.7, armL: { a: 16, b: 8 }, armR: { a: 16, b: 8 } } }, { f: 44, p: { armR: { a: 110, b: 10 } } }]);
  return (
    <g transform={camT(940, 520, kf(t, [[0, 1.02], [len, 1.1]]))}>
      <Sea t={t + 100} id="v12" horizon={560} sunX={1560} />
      <Dhow x={1660} y={620} s={0.8} t={t} />
      <Caravel x={120} y={610} s={0.56} t={t} />
      <rect x={-400} y={780} width={2720} height={40} fill="#6B4430" stroke="#1A1014" strokeWidth={5} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={-200 + i * 340} y={816} width={36} height={400} fill="#3E2418" />)}
      <Fig look={CAPT} pose={{ ...cap, expr: 'worried' }} shadow={0.6} />
      <CapHat pose={cap} />
      <Fig look={PILOT} pose={{ ...pil, expr: 'smug' }} shadow={0.6} rimId="rimL" />
      <Turban pose={pil} />
    </g>
  );
};

// S13: twenty-three days by the stars; the pilot works, the captain sleeps
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const days = Math.min(23, Math.max(1, Math.round(((t - 4) / 86) * 23)));
  const pil = { x: 1080, y: 640, scale: 0.8, yaw: -0.3, look: 0.1, headTilt: -14, armR: { a: 140 + Math.sin(t / 7) * 5, b: 10 }, armL: { a: 30, b: 16 } };
  const cap = { x: 640, y: 744, scale: 0.8, spin: 86, yaw: 0.2, blink: 1, armL: { a: 20, b: 10 }, armR: { a: 170, b: 10 }, legL: { a: 8, b: 4 }, legR: { a: -4, b: 8 } };
  return (
    <g transform={camT(920, 500, kf(t, [[0, 1.1], [len, 1.18]]))}>
      <Sea t={t} id="v13" mode="night" horizon={520} />
      <rect x={-400} y={720} width={2720} height={700} fill="#2E1E18" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M -400 ${760 + i * 54} L 2320 ${760 + i * 54}`} stroke="#1E1410" strokeWidth={5} />)}
      <path d="M -400 716 L 2320 716" stroke="#6A4632" strokeWidth={12} />
      <Glow x={1240} y={180} r={200} kind="cool" o={0.65} />
      <path d={`M 1240 120 l 12 44 l 44 12 l -44 12 l -12 44 l -12 -44 l -44 -12 l 44 -12 Z`} fill="#FFF4C8" />
      <path d="M 300 -300 Q 180 120 380 330 L 80 330 Q -40 120 40 -300 Z" fill="#141626" stroke="#080A14" strokeWidth={5} />
      <rect x={200} y={-300} width={26} height={1030} fill="#100C14" />
      <Fig look={PILOT} pose={{ ...pil, expr: 'neutral' }} shadow={0} rimId="rimBlue" />
      <Turban pose={pil} />
      <Fig look={CAPT} pose={{ ...cap, expr: 'tired' }} shadow={0} rimId="rimBlue" />
      <g opacity={0.8 + 0.2 * Math.sin(t / 8)}>
        {t % 40 > 8 ? <text x={470 + (t % 40)} y={660 - (t % 40)} fontFamily={FONT.ui} fontSize={46} fill="#BFD8FF">z</text> : null}
      </g>
      <Dial x={1560} y={320} p={days / 23} readout={String(days)} r={100} size={64} />
    </g>
  );
};

// S14: he says no
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const hx = t > 10 && t < 40 ? Math.sin((t - 10) / 3) * 0.4 : 0;
  const pil = poseAt(t, [{ f: 0, p: { x: 1090, y: 660, scale: 1.3, yaw: -0.5 + hx, look: -0.6, armL: { a: 16, b: 8 }, armR: { a: 16, b: 8 } } }, { f: 12, p: { armL: { a: 60, b: 90 }, armR: { a: 60, b: 90 } } }]);
  const cap = poseAt(t, [{ f: 0, p: { x: 540, y: 690, scale: 1.3, yaw: 0.6, look: 0.8, armR: { a: 70, b: 20 } } }, { f: 54, p: {} }, { f: 62, p: { tilt: 16, armR: { a: 12, b: 4 }, headTilt: 14 } }]);
  const face = faceAt(t, [[0, 'happy'], [56, 'shock']]);
  return (
    <g transform={camT(860, 400, kf(t, [[0, 1.42], [len, 1.52]]))}>
      <Sea t={t + 100} id="v14" horizon={600} sunX={1500} />
      <Fig look={CAPT} pose={{ ...cap, ...face }} shadow={0} />
      <CapHat pose={cap} droop={kf(t, [[56, 0], [66, 1]])} />
      <Fig look={PILOT} pose={{ ...pil, expr: 'cool' }} shadow={0} rimId="rimL" />
      <Turban pose={pil} />
    </g>
  );
};

// S15: the parangi mango leaves Mo's reach
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const gone = t >= 36;
  const pose = poseAt(t, [
    { f: 0, p: { x: 760, y: 690, scale: 1, yaw: 0.5, look: 0.8, headTilt: -14, armR: { a: 140, b: 6 } } },
    { f: 14, p: { y: 640, armR: { a: 150, b: 4 }, squash: -0.12 } },
    { f: 30, p: { y: 570, armR: { a: 152, b: 2 } } },
    { f: 38, p: { y: 566 } },
    { f: 52, p: { y: 740, squash: 0.3, armR: { a: 40, b: 10 }, spin: 0 } },
    { f: 60, p: { y: 690, squash: 0 } },
  ]);
  const face = faceAt(t, [[0, 'happy'], [37, 'shock'], [64, 'worried']]);
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <Sky id="v15" mode="dusk" y0={-200} y1={760} />
      <rect x={-400} y={830} width={2720} height={600} fill="#4A2E22" />
      <path d="M -400 830 Q 400 800 960 830 T 2320 820" stroke="#F2B27A" strokeWidth={4} fill="none" opacity={0.6} />
      <KHouse x={1520} y={832} s={0.78} lit={1} />
      <Palm x={1880} y={840} s={0.8} t={t} lean={-40} dark />
      <g transform="translate(120 830)"><MangoTree x={0} y={0} s={1.15} t={t} /></g>
      <path d="M 160 330 Q 620 190 1040 270" stroke="#4A3220" strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d="M 840 232 L 942 250" stroke="#4A3220" strokeWidth={12} strokeLinecap="round" />
      {[[420, 170, -12], [620, 150, 8], [820, 160, -10], [1000, 200, 14], [1090, 280, 24], [720, 280, -20], [520, 300, 10]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={120} ry={42} fill={i % 2 ? '#24542E' : '#2F6A3A'} stroke="#14241A" strokeWidth={3} transform={`rotate(${r} ${x} ${y})`} />)}
      {!gone ? <CashewApple x={940} y={330} s={1.3} /> : null}
      {t >= 36 && t < 44 ? <Sparkle x={940} y={320} t={t - 36} s={3} /> : null}
      <Fig look={MO} pose={{ ...pose, ...face }} shadow={t > 50 ? 0.6 : 0.2} />
      {t > 40 ? <Tag x={1330} y={170} t={t - 40} text="പറങ്കി" w={300} /> : null}
      {t > 80 ? <Tag x={1330} y={270} t={t - 80} text="= പോർച്ചുഗീസ്" w={560} /> : null}
    </g>
  );
};

// S16: the window goes, Pip's forehead meets the wall
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const bonk = t >= 24;
  const pose = poseAt(t, [{ f: 0, p: { x: 890, y: 630, scale: 0.72, yaw: 0, look: 0, armL: { a: 30, b: 10 }, armR: { a: 30, b: 10 } } }, { f: 22, p: { y: 618 } }, { f: 26, p: { y: 640, headTilt: 10 } }]);
  const face = faceAt(t, [[0, 'happy'], [26, 'dizzy']]);
  return (
    <g>
      <g transform={camT(900, 500, kf(t, [[0, 1.7], [len, 1.78]]))}>
        <Home t={t + 90} id="v16" win={t < 18 ? 1 : 0} veil={0.3} />
        <Fig look={PIP} pose={{ ...pose, ...face }} shadow={0} />
        {bonk ? <DizzyStars x={890} y={392} t={t} rx={80} ry={30} /> : null}
      </g>
      <WordCard t={t - 2} ml="ജനാല" pt="janela" />
    </g>
  );
};

// S17: a key that isn't there
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 880, y: 720, scale: 1.5, yaw: 0.7, look: 0.8, armR: { a: 90, b: 0 } } }, { f: 26, p: { armR: { a: 94, b: 0 }, handR: 'point' } }]);
  const face = faceAt(t, [[0, 'neutral'], [16, 'shock'], [30, 'worried']]);
  const h = handAt(pose, 'R');
  return (
    <g>
      <g transform={camT(980, 500, kf(t, [[0, 1.08], [len, 1.16]]))}>
        <rect x={-400} y={-400} width={2720} height={1880} fill="#54402F" />
        <Glow x={500} y={260} r={700} o={0.42} />
        <rect x={1120} y={-50} width={720} height={1240} fill="#6B4430" stroke="#2A1A14" strokeWidth={10} />
        <rect x={1180} y={40} width={600} height={400} fill="none" stroke="#4A2E20" strokeWidth={8} />
        <rect x={1180} y={520} width={600} height={500} fill="none" stroke="#4A2E20" strokeWidth={8} />
        <rect x={1150} y={438} width={110} height={160} rx={10} fill="#C9A85A" stroke="#6A4A1A" strokeWidth={5} />
        <circle cx={1205} cy={494} r={20} fill="#1A1014" /><rect x={1197} y={500} width={16} height={48} fill="#1A1014" />
        <Fig look={MO} pose={{ ...pose, ...face }} shadow={0} rimId="rimL" />
        {t < 14 ? (
          <g transform={`translate(${h.x + 40} ${h.y})`}>
            <circle cx={0} cy={0} r={24} fill="none" stroke="#E9C46A" strokeWidth={10} />
            <path d="M 24 0 L 100 0 M 84 0 L 84 22 M 100 0 L 100 16" stroke="#E9C46A" strokeWidth={10} />
          </g>
        ) : null}
        {t >= 13 && t < 21 ? <Sparkle x={h.x + 60} y={h.y} t={t - 13} s={2.4} /> : null}
        <Foreground blur={10}><path d="M 360 1200 Q 300 900 200 820 Q 330 840 400 1000 Q 400 800 480 720 Q 500 900 470 1200 Z" fill="#0E1A12" opacity={0.92} /></Foreground>
      </g>
      <WordCard t={t - 2} ml="ചാവി" pt="chave" />
    </g>
  );
};

// S18: the cupboard goes; everything in it lands on Pip
const CLOTHES = ['#B8433A', '#3E8C86', '#E9C46A', '#6A5A9A', '#D9CDB4', '#D9834A', '#4A7AA0', '#8A5A6A'];
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 1320, y: 690, scale: 0.92, yaw: 0.1, look: 0.2, headTilt: -8, armR: { a: 110, b: 10 } } }, { f: 22, p: {} }, { f: 28, p: { y: 700 } }]);
  const face = faceAt(t, [[0, 'neutral'], [22, 'shock']]);
  const cup = t < 20 ? 1 : 0;
  return (
    <g>
      <g transform={camT(1240, 540, kf(t, [[0, 1.3], [len, 1.36]]))}>
        <Home t={t + 110} id="v18" cup={cup} veil={0.3} />
        <Fig look={PIP} pose={{ ...pose, ...face }} shadow={0.6} />
        {t >= 20
          ? CLOTHES.map((c, i) => {
              const land = 24 + i * 1.2;
              const y = kf(t, [[20, 140 + (i % 3) * 60], [land, 640 - Math.floor(i / 3) * 56]], easeOut);
              const x = 1320 + ((i % 4) - 1.5) * 76;
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${(i % 3 - 1) * 16})`}>
                  <path d="M -96 -22 Q -50 -46 0 -34 Q 54 -46 96 -20 L 112 34 L 76 44 L 62 16 Q 0 34 -62 16 L -78 46 L -114 32 Z" fill={c} stroke="#1A1014" strokeWidth={4} strokeLinejoin="round" />
                  <path d="M -50 -10 Q 0 6 50 -12" stroke="#1A1014" strokeWidth={3} fill="none" opacity={0.4} />
                </g>
              );
            })
          : null}
      </g>
      <WordCard t={t - 2} ml="അലമാര" pt="armário" />
    </g>
  );
};

// S19: the word list
const PAIRS: [string, string][] = [['മേശ', 'mesa'], ['ജനാല', 'janela'], ['ചാവി', 'chave'], ['അലമാര', 'armário']];
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="v19" />
    {PAIRS.map(([ml, pt], i) => {
      const y = 280 + i * 170;
      const tt = t - i * 7;
      const k = clamp(tt / 6);
      return (
        <g key={ml} opacity={k} transform={`translate(${(1 - k) * -40} 0)`}>
          <text x={780} y={y} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill={SCH.line}>{ml}</text>
          <DrawOn d={`M 840 ${y - 30} L 1010 ${y - 30}`} t={tt - 4} dur={6} color={SCH.dim} width={5} />
          <text x={1070} y={y} fontFamily={FONT.ui} fontSize={72} fill={SCH.live}>{pt}</text>
        </g>
      );
    })}
  </g>
);

// S20: the laugh stops
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const a = stood(0.38, 0.5);
  const b = stood(0.62, 0.5);
  const dim = kf(t, [[10, 0], [44, 1]]);
  const f1 = faceAt(t, [[0, 'happy'], [22, 'neutral']]);
  const f2 = faceAt(t, [[0, 'happy'], [28, 'worried']]);
  return (
    <g transform={camT(960, a.y - 110, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Home t={t + 130} id="v20" />
      <Fig look={PIP} pose={{ ...a, yaw: 0.3, look: 0.2, ...f1 }} shadow={0.6} />
      <Fig look={MO} pose={{ ...b, yaw: -0.3, look: -0.2, ...f2 }} shadow={0.6} rimId="rimL" />
      <rect x={-1500} y={-1500} width={5000} height={4500} fill="#0A0814" opacity={0.7 * dim} />
    </g>
  );
};

// S21: 1502: the fleet comes back
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1], [len, 1.06]]))}>
    <Sea t={t} id="v21" mode="red" sunX={1520} />
    {[[260, 640, 0.42], [620, 660, 0.5], [1030, 690, 0.66], [1510, 730, 0.86]].map(([x, y, s], i) => (
      <Caravel key={i} x={x + t * 0.5} y={y} s={s} t={t + i * 9} dark />
    ))}
    <Year t={t - 8} text="1502" color="#FF9A7A" />
  </g>
);

// S22: the small ship and the big one
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.08], [len, 1.18]]))}>
    <Sea t={t + 100} id="v22" mode="red" sunX={1560} />
    <Dhow x={1260} y={700} s={1} t={t} dark crew={12} />
    <Caravel x={kf(t, [[0, 380], [len, 620]], (v) => v)} y={760} s={1.1} t={t} dark />
  </g>
);

// S23: one lamp in the hold; only shapes of people
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.02], [len, 1.1]]))}>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#0E0A10" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${-200 + i * 380} -100 Q ${760 + i * 70} 200 ${-200 + i * 380} 1200`} stroke="#1E1616" strokeWidth={14} fill="none" opacity={0.9} />)}
    <Glow x={960} y={560} r={520} o={0.7 + 0.05 * Math.sin(t / 3)} />
    <path d="M 930 560 L 990 560 L 970 610 L 950 610 Z" fill="#6A4A2A" /><path d="M 960 560 Q 948 530 960 506 Q 972 530 960 560 Z" fill="#FFC867" />
    {Array.from({ length: 13 }).map((_, i) => {
      const k = i - 6;
      const x = 960 + k * 136 + (k > 0 ? 40 : k < 0 ? -40 : 0);
      if (k === 0) return null;
      const h = 250 + (i % 3) * 26;
      const y = 830 - Math.abs(k) * 6;
      return (
        <g key={i}>
          <path d={`M ${x - 60} ${y} Q ${x - 56} ${y - h * 0.7} ${x} ${y - h * 0.74} Q ${x + 56} ${y - h * 0.7} ${x + 60} ${y} Z`} fill="#070508" />
          <circle cx={x} cy={y - h * 0.84} r={44} fill="#070508" />
        </g>
      );
    })}
    <rect x={-400} y={830} width={2720} height={600} fill="#090608" />
  </g>
);

// S24: a far-off fire on the water
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const f = 1 + 0.08 * Math.sin(t / 2.3);
  return (
    <g transform={camT(1120, 520, kf(t, [[0, 1], [len, 1.1]]))}>
      <Sea t={t} id="v24" mode="night" horizon={620} />
      <Glow x={1120} y={590} r={420 * f} kind="red" o={0.9} />
      <g filter="url(#blur16)">
        <path d="M 1110 520 Q 1060 330 1160 200 Q 1230 100 1170 -120" stroke="#05040A" strokeWidth={90} fill="none" opacity={0.7} />
      </g>
      <g transform={`translate(1120 626) scale(${0.9 * f} 0.9)`}>
        <path d="M -120 -20 L 130 -30 Q 110 16 60 20 L -70 20 Q -110 12 -120 -20 Z" fill="#060408" />
        <path d="M 0 -20 L 6 -190" stroke="#060408" strokeWidth={8} />
        <path d="M -104 -20 Q -120 -96 -60 -128 Q -48 -84 -20 -112 Q 0 -190 14 -210 Q 70 -120 74 -96 Q 104 -70 104 -24 Z" fill="#FF7A2A" />
        <path d="M -60 -22 Q -66 -66 -24 -84 Q -6 -60 12 -112 Q 44 -70 58 -24 Z" fill="#FFD27A" />
      </g>
      {Array.from({ length: 10 }).map((_, i) => {
        const w = 130 - i * 8 + Math.sin(t / 3 + i * 2) * 26;
        return <rect key={i} x={1120 - w / 2} y={648 + i * 15 + i * i} width={w} height={5} rx={3} fill="#FF8A3D" opacity={0.6 - i * 0.05} />;
      })}
    </g>
  );
};

// S25: that never happens: the same water, empty
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1120, 520, kf(t, [[0, 1.1], [len, 1.04]]))}>
    <Sea t={t} id="v25" horizon={620} sunX={1120} />
    <Boat x={1560} y={720} s={0.34} t={t} />
  </g>
);

// S26: Pip breathes out
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'neutral'], [30, 'happy'], [58, 'neutral']]);
  const pose = { x: 880, y: 640, scale: 1.5, yaw: 0.4, look: 0.5, armL: { a: 10, b: 6 }, armR: { a: 10, b: 6 } };
  return (
    <g transform={camT(910, 330, kf(t, [[0, 1.58], [len, 1.72]]))}>
      <g filter="url(#blur16)"><Shore t={t + 50} id="v26" /></g>
      <Fig look={PIP} pose={{ ...pose, ...face }} shadow={0} />
    </g>
  );
};

// S27: the reason they come
export const S27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.06], [len, 1.18]]))}>
    <Sky id="v27" mode="dusk" y0={-100} y1={1180} />
    <Glow x={1420} y={760} r={620} o={0.5} />
    <path d="M 860 -100 Q 900 540 840 1200" stroke="#4A3220" strokeWidth={70} fill="none" />
    <path d="M 860 -100 Q 900 540 840 1200" stroke="#6A4A30" strokeWidth={14} fill="none" />
    {[[640, 240, -28], [1110, 180, 24], [630, 640, -18], [1120, 640, 18]].map(([x, y, r], i) => (
      <path key={i} d={`M ${x - 180} ${y} Q ${x} ${y - 130} ${x + 180} ${y} Q ${x} ${y + 130} ${x - 180} ${y} Z`} fill={i % 2 ? '#2F6A3A' : '#24542E'} stroke="#14241A" strokeWidth={5} transform={`rotate(${r} ${x} ${y})`} />
    ))}
    <path d="M 880 80 Q 820 60 770 120 M 878 180 Q 940 170 980 260 M 876 200 Q 1100 150 1250 300" stroke="#5A7A3A" strokeWidth={7} fill="none" />
    <path d="M 1250 300 Q 1330 180 1460 200 Q 1370 300 1250 300 Z" fill="#2F6A3A" stroke="#14241A" strokeWidth={5} />
    <Peppers x={770} y={120} n={11} seed={3} s={1.1} />
    <Peppers x={980} y={260} n={13} seed={7} s={1.25} />
    <Peppers x={1250} y={300} n={9} seed={11} s={0.92} />
    <Foreground blur={10}><ellipse cx={1860} cy={980} rx={400} ry={360} fill="#0E1A12" opacity={0.92} /></Foreground>
  </g>
);

// S28: the horizon fills
export const S28: React.FC<ShotProps> = ({ t, len }) => {
  const up = (t0: number) => kf(t, [[t0, 150], [t0 + 26, 0]]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1], [len, 1.1]]))}>
      <Sea t={t} id="v28" horizon={640} sunX={280} />
      <g opacity={clamp(t / 8)}>
        <Caravel x={700} y={650 + up(4)} s={0.56} t={t} flag="dutch" />
        <Caravel x={1320} y={660 + up(24)} s={0.64} t={t + 30} flag="english" />
        <Caravel x={980} y={642 + up(52)} s={0.42} t={t + 60} flag="dutch" />
        <Caravel x={1620} y={646 + up(74)} s={0.44} t={t + 80} flag="english" />
      </g>
      <SeaBody t={t} id="v28b" y={700} sunX={280} />
    </g>
  );
};

// S29: from behind Pip and Mo: more on the way
export const S29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.05], [len, 1.16]]))}>
    <Shore t={t} id="v29" sunX={1500} />
    {[[1040, 586, 0.26], [1270, 594, 0.32], [760, 582, 0.22], [1540, 590, 0.28]].map(([x, y, s], i) => <Caravel key={i} x={x} y={y} s={s} t={t + i * 13} dark />)}
    <Foreground blur={6}>
      <circle cx={640} cy={620} r={150} fill="#0E0A14" />
      <path d="M 370 1200 Q 400 790 640 770 Q 880 790 910 1200 Z" fill="#0E0A14" />
      <circle cx={1270} cy={650} r={130} fill="#1A1420" />
      {[[-96, -66], [-40, -110], [32, -116], [96, -72], [120, -14], [-120, -10]].map(([dx, dy], i) => <circle key={i} cx={1270 + dx} cy={650 + dy} r={44} fill="#1A1420" />)}
      <path d="M 1040 1200 Q 1060 800 1270 790 Q 1480 800 1500 1200 Z" fill="#1A1420" />
    </Foreground>
  </g>
);

// S30: a sail in Pip's eye
export const S30: React.FC<ShotProps> = ({ t, len }) => {
  const pose = { x: 960, y: 700, scale: 1, yaw: 0, look: 0, expr: 'shock' as const, armL: { a: 10, b: 6 }, armR: { a: 10, b: 6 } };
  const h = headAt(pose);
  const z = kf(t, [[0, 3.6], [len - 26, 5.6]]);
  const grow = kf(t, [[6, 0.5], [len - 26, 1.2]]);
  return (
    <g>
      <g transform={camT(h.x, h.y - 4, z)}>
        <Sky id="v30" mode="dark" y0={100} y1={700} />
        <Fig look={PIP} pose={pose} shadow={0} />
        {[-22, 22].map((ex, i) => (
          <g key={i} transform={`translate(${h.x + ex} ${h.y - 4}) scale(${grow})`}>
            <path d="M -7 3 L 7 3 L 5 7 L -5 7 Z" fill="#FFD08A" />
            <rect x={-0.6} y={-9} width={1.2} height={12} fill="#FFD08A" />
            <path d="M -6 -7 L 6 -7 L 5 1 L -5 1 Z" fill="#FFF0D0" />
          </g>
        ))}
      </g>
      {t >= 108 ? <text x={1570} y={640} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={320 * (1 + 0.5 * (1 - clamp((t - 108) / 6)))} fill="#FFE27A" stroke="#1A1230" strokeWidth={14} paintOrder="stroke">?</text> : null}
      <Fade t={t} len={len} n={26} />
    </g>
  );
};

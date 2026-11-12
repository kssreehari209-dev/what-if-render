// nosleep-ml: "What if humans never slept again?" Long video, 16:9. Narration straight, jokes in the picture.
// Spine: day 12, 3 am, the tea shop is full and you can't remember the way home; twelve days back to see why.
import React from 'react';
import {
  faceAt, kf, clamp, camT, rnd, easeOut, Pose, ShotProps, FONT, Glow, Dust, Foreground, LightVeil, FocusRings, TitleCard,
  FitSay, FactCard, TimeTag, LOOKS, Look, Schematic, SchLabel, DrawOn, Arrow, CountUp, SCH, Classroom, Kid, KIDS, SchoolDesk,
  Bedroom, bedSit, BedDuvet, AlarmClock, Kitchen, KitchenIsland, KITCHEN, stand, islandTop, OpenBook, BookTower, Paper, Stars, Moon,
} from '../../engine';
import { Fig, Palm, Sky, headAt, handAt } from '../fly-ml/kit';
import { TEAMAN, UNCLE, CROWD, Mundu, Tache, TeaGlass, Bus } from '../phone-ml/kit';
import { DAD, GRAN, Fan, ScreenPhone, Arm } from '../monsoon-ml/kit';
import { Tumbler } from '../sea-ml/kit';
import {
  INK, feet, push, StreetLight, Kettle, Ball, Bat, Wickets, Board, Paaya, Switchboard, Bharani, MilkPacket, Pot, Fridge, Street,
  ChayaIn, Thattu, Hall, Veranda, Village, Dubai, HardHat, LifeBar, BrainIcon, Cells, RatCage, Globe, Jelly, SeaFloor, DeskNight, Bag,
} from './kit';

type P = Partial<Pose>;
const RAMU = LOOKS.ramu;
const APPU = LOOKS.appu;
const SIS = LOOKS.sis;
const MOM = LOOKS.mom;
const SUIT = LOOKS.suit;

/** A figure standing on ground g; mundu and moustache for the adult men. */
const Person: React.FC<{ look: Look; x: number; g: number; s: number; p?: P; rim?: string; mundu?: boolean; tache?: boolean; specs?: boolean; shadow?: number }> = ({
  look, x, g, s, p = {}, rim = 'rimR', mundu, tache, specs, shadow = 0.5,
}) => {
  const pose: P = { x, y: feet(g, s), scale: s, ...p };
  return (
    <g>
      <Fig look={look} pose={pose} rimId={rim} shadow={shadow} />
      {mundu ? <Mundu pose={pose} /> : null}
      {tache ? <Tache pose={pose} specs={specs} /> : null}
    </g>
  );
};
const Day: React.FC<{ t: number; label: string; value?: string }> = ({ t, label, value }) => <TimeTag t={t} label={label} value={value} cx={960} y={92} />;
const Fact: React.FC<{ t: number; big: string; line: string; src: string }> = ({ t, big, line, src }) => <FactCard t={t} big={big} line={line} src={src} cx={960} y={860} w={1180} />;
const Ask: React.FC<{ t: number; text: string; y?: number }> = ({ t, text, y = 150 }) => <FitSay t={t} text={text} x={960} y={y} size={96} maxW={1640} />;
const Soft: React.FC<{ children: React.ReactNode }> = ({ children }) => <Foreground blur={16}>{children}</Foreground>;

/** Red-rimmed eyes: two faint red arcs under the eyes of a figure's head. */
const RedEyes: React.FC<{ pose: P; o?: number }> = ({ pose, o = 0.8 }) => {
  const h = headAt(pose);
  const s = pose.scale ?? 1;
  const fx = h.x + (pose.yaw ?? 0) * 26 * s;
  return <g opacity={o}>{[-18, 18].map((d) => <path key={d} d={`M ${fx + d * s - 12 * s} ${h.y + 8 * s} q ${12 * s} ${8 * s} ${24 * s} 0`} stroke="#C8302A" strokeWidth={4 * s} fill="none" />)}</g>;
};
const pose = (x: number, g: number, s: number, p: P = {}): P => ({ x, y: feet(g, s), scale: s, ...p });

// ============================================================ A. COLD OPEN: DAY 12, 3 AM
const crowdAt = (t: number, n: number, x0: number, g: number, s: number, gap: number, seed = 1) => Array.from({ length: n }).map((_, i) => (
  <Person key={i} look={CROWD[(i + seed) % CROWD.length]} x={x0 + i * gap + rnd(seed, i) * 30} g={g + (i % 2) * 18} s={s} mundu={i % 2 === 0} tache={i % 3 !== 1}
    p={{ yaw: (rnd(seed + 1, i) - 0.5) * 1.4, armR: { a: 40 + (i % 3) * 30, b: -70 }, ...faceAt(t + i * 7, [[0, 'shock']]), blink: 0 }} />
));
export const A1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 900, 940), 560, push(t, len, 1.05, 1.12))}>
      <Street t={t + 300} id="a1">
        {crowdAt(t, 9, 420, 800, 0.55, 80, 3)}
        {crowdAt(t, 4, 300, 870, 0.62, 160, 7)}
        <Person look={RAMU} x={1080} g={880} s={0.62} p={{ yaw: -0.5, look: -0.6, ...faceAt(t, [[0, 'tired']]) }} rim="rimL" />
      </Street>
    </g>
    <Day t={t - 2} label="ദിവസം" value="12" />
  </g>
);
export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1380, 330, push(t, len, 3.0, 3.2))}>
    <ChayaIn t={t + 200} id="a2" clock={3} />
  </g>
);
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.3;
  const p = pose(900, 900, s, { yaw: 0.2, armL: { a: 150, b: -10 }, armR: { a: 30, b: -40 }, ...faceAt(t, [[0, 'cool']]) });
  const hl = handAt(p, 'L');
  const hr = handAt(p, 'R');
  return (
    <g transform={camT(push(t, len, 940, 960), 560, push(t, len, 1.35, 1.45))}>
      <ChayaIn t={t + 220} id="a3" front={<g>
        {crowdAt(t, 6, 300, 1180, 0.95, 260, 11)}
      </g>}>
        <Person look={TEAMAN} x={900} g={900} s={s} p={p} tache />
        <TeaGlass x={hl.x} y={hl.y + 10} s={0.8} fill={0.3} />
        <path d={`M ${hl.x + 6} ${hl.y + 14} Q ${hl.x + 30} ${(hl.y + hr.y) / 2} ${hr.x - 4} ${hr.y - 40}`} stroke="#C8925A" strokeWidth={10} fill="none" opacity={0.9} />
        <TeaGlass x={hr.x} y={hr.y + 10} s={0.8} fill={0.6 + Math.sin(t / 4) * 0.1} t={t} steam />
      </ChayaIn>
    </g>
  );
};
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(900, 1000, 1.6, { yaw: 0.35, look: 0.2, armR: { a: 120, b: -120 }, ...faceAt(t, [[0, 'shock']]), blink: 0 });
  const h = headAt(p);
  const sip = kf(t, [[0, 0], [40, 1], [70, 1], [90, 0]]);
  return (
    <g transform={camT(h.x + 60, h.y + 40, push(t, len, 3.1, 3.4))}>
      <ChayaIn t={t + 240} id="a4">
        <Person look={UNCLE} x={900} g={1000} s={1.6} p={p} tache specs mundu />
        <RedEyes pose={p} />
        <TeaGlass x={h.x + 70 + sip * 10} y={h.y + 90 - sip * 30} s={1.1} t={t} steam />
      </ChayaIn>
    </g>
  );
};
export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const up = kf(t, [[0, 0], [20, 1]], easeOut);
  const s = 1.15;
  const g = 1230 - up * 50;
  return (
    <g transform={camT(980, 680, push(t, len, 1.6, 1.7))}>
      <ChayaIn t={t + 260} id="a5" front={<g>
        <rect x={500} y={1000} width={900} height={30} fill="#7A4A2E" stroke={INK} strokeWidth={5} />
        <TeaGlass x={760} y={1000} s={1} fill={0.1} />
        <Person look={RAMU} x={1060} g={g} s={s} p={{ yaw: -0.4, look: -0.4, armR: { a: 30 + (1 - up) * 40, b: -60 }, squash: (1 - up) * 0.08, ...faceAt(t, [[0, 'tired']]) }} rim="rimL" />
      </g>}>
        <Person look={TEAMAN} x={560} g={880} s={1} p={{ yaw: 0.3, ...faceAt(t, [[0, 'neutral']]) }} tache />
      </ChayaIn>
    </g>
  );
};
export const A6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, push(t, len, 640, 620), push(t, len, 0.95, 1.0))}>
      <Street t={t + 320} id="a6" roads shelter={false}>
        <Person look={RAMU} x={960} g={960} s={0.45} p={{ yaw: 0, ...faceAt(t, [[0, 'worried']]) }} />
      </Street>
    </g>
  </g>
);
export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const look = kf(t, [[0, -0.8], [20, -0.8], [30, 0.8], [50, 0.8], [58, 0]]);
  const p = pose(960, 1300, 1.8, { yaw: look * 0.3, look, ...faceAt(t, [[0, 'worried'], [52, 'oops']]) });
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 60, push(t, len, 3.2, 3.5))}>
      <Street t={t + 340} id="a7" roads shelter={false}>
        <Person look={RAMU} x={960} g={1300} s={1.8} p={p} />
      </Street>
    </g>
  );
};

// ============================================================ B. TWELVE DAYS EARLIER
const BedRamu: React.FC<{ t: number; p?: P; clock: string; id: string; lamp?: number }> = ({ t, p = {}, clock, id, lamp = 1 }) => {
  const b = bedSit(0.22);
  return (
    <g>
      <Bedroom t={t} id={id} duvet={false} clock={clock} lamp={lamp} crossed={0} />
      <Fig look={RAMU} pose={{ ...b, yaw: 0.35, armL: { a: 20, b: -20 }, armR: { a: 20, b: -20 }, ...p }} rimId="rimR" />
      <BedDuvet knees={0.5} />
    </g>
  );
};
export const B1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 900, 880), 540, push(t, len, 1.0, 1.06))}>
      <BedRamu t={t + 50} id="b1" clock="05:58" p={{ ...faceAt(t, [[0, 'happy']]), blink: 0, look: 0.6 }} />
    </g>
    <Day t={t - 2} label="12 ദിവസം മുമ്പ്" />
  </g>
);
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const reach = kf(t, [[0, 0], [16, 1]], easeOut);
  return (
    <g transform={camT(960, 560, push(t, len, 1, 1.05))}>
      <rect x={-500} y={-500} width={3000} height={2200} fill="#2A2438" />
      <Glow x={1300} y={300} r={700} kind="warm" o={0.5} />
      <rect x={-500} y={760} width={3000} height={800} fill="#5A3A2A" stroke={INK} strokeWidth={8} />
      <AlarmClock x={960} y={760} s={2.2} text={t < 40 ? '05:59' : '06:00'} />
      <Arm from={[2300, 200]} to={[1340 - reach * 260, 520 + reach * 60]} c="#232327" skin="#E8C4A0" w={120} />
      {t > 40 && t < 48 ? <FocusRings x={960} y={600} t={t - 40} /> : null}
    </g>
  );
};
export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const st = kf(t, [[0, 0], [12, 1]], easeOut);
  return (
    <g transform={camT(760, 560, push(t, len, 1.8, 1.9))}>
      <BedRamu t={t + 90} id="b3" clock="06:00" p={{ armL: { a: 20 + st * 150, b: -10 }, armR: { a: 20 + st * 150, b: -10 }, ...faceAt(t, [[0, 'happy']]), squash: -0.04 * st }} />
    </g>
  );
};
export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.22);
  const p: P = { ...b, yaw: 0.2, look: kf(t, [[0, -0.4], [50, 0.5]]), ...faceAt(t, [[0, 'neutral']]), blink: 0 };
  const h = headAt(p);
  return (
    <g>
      <g transform={camT(h.x, h.y + 20, push(t, len, 2.8, 3.0))}>
        <Bedroom t={t + 140} id="b4" duvet={false} clock="02:47" lamp={0} crossed={0} />
        <Fig look={RAMU} pose={p} rimId="rimBlue" />
        <BedDuvet knees={0.5} />
      </g>
      <g opacity={0.9}><Fan x={960} y={40} s={1.6} spin={t * 22} /></g>
      <Glow x={960} y={400} r={600} kind="cool" o={0.25} />
    </g>
  );
};
export const B5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1.0, 1.08))}>
    <Village t={t + 30} id="b5" />
    {[[260, 690], [1680, 680], [1080, 840]].map(([x, g], i) => <Person key={i} look={CROWD[i]} x={x} g={g} s={0.32} p={{ yaw: 0.3, armR: { a: 150, b: -20 } }} mundu />)}
  </g>
);
export const B6: React.FC<ShotProps> = ({ t }) => <Globe t={t + 100} id="b6" />;
export const B7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, push(t, len, 620, 600), push(t, len, 1.0, 1.05))}>
      <Village t={t + 60} id="b7" />
    </g>
    <TitleCard t={t} lines={['ആരും ഇനി', 'ഉറങ്ങിയില്ലെങ്കിൽ?']} accent="ഉറങ്ങിയില്ലെങ്കിൽ?" y={190} size={110} />
  </g>
);

// ============================================================ C. THE FUN NIGHTS
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const sw = kf(t, [[0, 0], [30, 0], [40, 1]], easeOut);
  return (
    <g>
      <g transform={camT(push(t, len, 960, 1000), 600, push(t, len, 1.0, 1.06))}>
        <Street t={t + 400} id="c1">
          <Wickets x={1300} y={900} s={0.9} />
          <Person look={APPU} x={1230} g={900} s={0.6} p={{ yaw: -0.6, armR: { a: 120 - sw * 110, b: -30 }, armL: { a: 110 - sw * 100, b: -30 }, ...faceAt(t, [[0, 'cool']]) }} rim="rimL" />
          <Person look={RAMU} x={520} g={920} s={0.6} p={{ yaw: 0.6, armR: { a: kf(t, [[0, 20], [24, 170], [32, 60]]), b: -10 }, ...faceAt(t, [[0, 'happy']]) }} />
          {crowdAt(t, 3, 760, 790, 0.45, 110, 21)}
          <Ball x={kf(t, [[0, 600], [32, 600], [40, 1180], [60, 700]])} y={kf(t, [[0, 700], [32, 760], [40, 860], [60, 420]])} r={12} />
        </Street>
      </g>
      <Day t={t - 2} label="ആദ്യത്തെ രാത്രി" />
    </g>
  );
};
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 18);
  const bx = 300 + k * 1000;
  const by = 200 + 600 * Math.pow(k * 2 - 1, 2) - 300 * k;
  return (
    <g transform={camT(980, 560, push(t, len, 1.55, 1.65))}>
      <ChayaIn t={t + 280} id="c2">
        <Person look={TEAMAN} x={1000} g={890} s={1} p={{ yaw: 0.4, look: -0.5, ...faceAt(t, [[0, 'neutral'], [18, 'shock']]), armR: { a: t > 18 ? 140 : 30, b: -20 } }} tache />
        <Kettle x={1300} y={740} s={1.2} t={t} />
        {t < 18 ? <Ball x={bx} y={by} r={16} /> : <g>{[0, 1, 2, 3].map((i) => <path key={i} d={`M ${1340 + i * 18 - 27} 600 q ${(i - 1.5) * 20} -60 ${(i - 1.5) * 40} -80`} stroke="#F6EFE3" strokeWidth={6} fill="none" opacity={clamp(1 - (t - 18) / 30)} />)}</g>}
      </ChayaIn>
    </g>
  );
};
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const jump = Math.abs(Math.sin(t / 7)) * clamp(t / 6);
  const p = pose(960, 1300 - jump * 40, 1.6, { yaw: 0.2, armL: { a: 160, b: -10 }, armR: { a: 160, b: -10 }, ...faceAt(t, [[0, 'happy']]), squash: -0.05 * jump });
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 120, push(t, len, 2.4, 2.6))}>
      <Street t={t + 420} id="c3"><Person look={RAMU} x={960} g={1300 - jump * 40} s={1.6} p={p} /></Street>
    </g>
  );
};
export const C4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 920, 960), 560, push(t, len, 1.0, 1.05))}>
      <Thattu t={t + 30} id="c4" front={crowdAt(t, 7, 200, 980, 0.62, 230, 31)}>
        <Person look={APPU} x={900} g={800} s={0.62} p={{ yaw: 0.1, armR: { a: 70, b: -60 }, armL: { a: 60, b: -60 } }} rim="rimL" />
      </Thattu>
    </g>
    <Day t={t - 2} label="പുലർച്ചെ 3:00" />
  </g>
);
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const slap = Math.abs(Math.sin(t / 4));
  const p = pose(900, 900, 1.3, { yaw: 0.15, look: 0.2, armR: { a: 60 + slap * 60, b: -60 }, armL: { a: 60, b: -70 }, ...faceAt(t, [[0, 'cool']]) });
  return (
    <g transform={camT(920, 420, push(t, len, 2.0, 2.15))}>
      <Thattu t={t + 60} id="c5">
        <Person look={APPU} x={900} g={900} s={1.3} p={p} rim="rimL" />
        <ellipse cx={900 + slap * 40} cy={470 - slap * 40} rx={60} ry={14} fill="#E8C47A" stroke="#A07A3A" strokeWidth={3} />
      </Thattu>
    </g>
  );
};
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const paint = kf(t, [[0, 0], [10, 0], [50, 1]]);
  return (
    <g transform={camT(1110, 380, push(t, len, 3.4, 3.6))}>
      <Thattu t={t + 90} id="c6" board={paint} />
      <Arm from={[1500, 700]} to={[970 + paint * 260, 345]} c="#3A3446" skin="#26232F" w={50} />
    </g>
  );
};
const PHONE_ON_TABLE = { x: 1100, y: 790 };
export const C7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 960, 1000), 560, push(t, len, 1.0, 1.06))}>
      <Hall t={t + 10} id="c7" table>
        <g transform={`translate(${PHONE_ON_TABLE.x + Math.sin(t * 2) * 3} ${PHONE_ON_TABLE.y})`}>
          <rect x={-40} y={-14} width={80} height={14} rx={4} fill="#1A1A22" />
          <Glow x={0} y={-20} r={120} kind="cool" o={0.8} />
          {[0, 1].map((i) => <circle key={i} cx={0} cy={-20} r={30 + ((t * 2 + i * 20) % 40)} fill="none" stroke="#FFE27A" strokeWidth={4} opacity={1 - ((t * 2 + i * 20) % 40) / 40} />)}
        </g>
        <Person look={MOM} x={1500} g={960} s={0.85} p={{ yaw: -0.5, look: -0.6, ...faceAt(t, [[0, 'happy']]) }} rim="rimL" />
        <Person look={SIS} x={700} g={960} s={0.6} p={{ yaw: 0.5, look: 0.6, armR: { a: 150, b: -10 }, ...faceAt(t, [[0, 'happy']]) }} />
        <Person look={RAMU} x={1300} g={980} s={0.85} p={{ yaw: -0.3, ...faceAt(t, [[0, 'happy']]) }} rim="rimL" />
      </Hall>
    </g>
    <Day t={t - 2} label="രാത്രി 2:00" />
  </g>
);
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const squeeze = kf(t, [[0, 0], [30, 1]], easeOut);
  const heads: [Look, number, number, number, boolean?][] = [[GRAN, 820, 1060, 1.1, false], [MOM, 1100, 1060, 1.1], [SIS, 960, 1100, 0.85], [RAMU, 700 + squeeze * 60, 1080, 1.1], [APPU, 1260 - squeeze * 60, 1080, 1.1], [UNCLE, 1400 - squeeze * 80, 1060, 1.1, true]];
  return (
    <g transform={camT(980, 600, push(t, len, 1.7, 1.85))}>
      <Hall t={t + 40} id="c8">
        {heads.map(([l, x, g, s, m], i) => <Person key={i} look={l} x={x} g={g} s={s} tache={m} p={{ yaw: (960 - x) / 600, look: (960 - x) / 400, ...faceAt(t + i * 5, [[0, i % 2 ? 'happy' : 'shock']]), tilt: (960 - x) / 50 }} />)}
        <g transform="translate(960 640) rotate(-8)">
          <rect x={-46} y={-80} width={92} height={160} rx={14} fill="#14141C" stroke="#3A3A48" strokeWidth={4} />
          <rect x={-38} y={-68} width={76} height={136} rx={6} fill="#CFE6FF" />
          <Glow x={0} y={0} r={200} kind="cool" o={0.8} />
        </g>
      </Hall>
    </g>
  );
};
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const dp = pose(0, 300, 1.2, { yaw: 0, ...faceAt(t, [[0, 'shock'], [40, 'happy']]) });
  return (
    <g transform={camT(960, 540, push(t, len, 1.0, 1.06))}>
      <rect x={-500} y={-500} width={3000} height={2200} fill="#2A2438" />
      <Glow x={960} y={540} r={800} kind="cool" o={0.4} />
      <ScreenPhone x={960} y={560} s={1.35} id="c9" bg="#3A4A6A">
        <rect x={-200} y={-360} width={400} height={300} fill="#1A2440" />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-170 + i * 44} y={-300 + (i % 3) * 30} width={30} height={260} fill="#2A3460" />)}
        <g transform="translate(0 -40)">
          <Fig look={DAD} pose={dp} rimId="rimBlue" />
          <Tache pose={dp} />
        </g>
        <rect x={60} y={150} width={100} height={150} rx={10} fill="#5A3A3A" stroke="#F6EFE3" strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={80 + (i % 3) * 30} cy={190 + Math.floor(i / 3) * 50} r={14} fill={['#E8C4A0', '#26232F', '#C69A74', '#E8C4A0', '#B98562'][i]} />)}
      </ScreenPhone>
      <text x={960} y={140} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#F6EFE3">അച്ഛൻ, ദുബായ്</text>
    </g>
  );
};
export const C10: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="c10" />
    <LifeBar t={t} p={clamp((t - 60) / 90)} />
  </g>
);
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const open = kf(t, [[0, 0.2], [20, 1]], easeOut);
  return (
    <g>
      <g transform={camT(push(t, len, 960, 1000), 520, push(t, len, 1.4, 1.5))}>
        <Village t={t + 200} id="c11" />
        <rect x={-3000} y={760} width={8000} height={60} fill="#7A6A72" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={-200 + i * 110} y={776} width={50} height={36} rx={6} fill="#3A2C3E" />)}
        <rect x={-3000} y={820} width={8000} height={2000} fill="#4A3F52" />
        <Person look={RAMU} x={960} g={800} s={0.9} p={{ yaw: 0.1, look: 0.4, armL: { a: 30 + open * 90, b: -10 }, armR: { a: 30 + open * 90, b: -10 }, ...faceAt(t, [[0, 'happy']]) }} rim="rimBlue" />
      </g>
      <Fact t={t - 40} big="≈ 25 വർഷം" line="75 വയസ്സ് ജീവിച്ചാൽ, അതിൽ ഉറങ്ങുന്ന സമയം" src="ദിവസം 8 മണിക്കൂർ = 1/3 · CDC; കേരളം ആയുർദൈർഘ്യം ≈ 75 (SRS 2016-20)" />
    </g>
  );
};

// ============================================================ D. DAY 4: THE EXAM
const ExamRoom: React.FC<{ t: number; id: string; blank?: boolean; teacher?: P; children?: React.ReactNode }> = ({ t, id, children, teacher }) => (
  <g>
    <Classroom t={t} id={id} board={<g><text x={740} y={330} textAnchor="middle" fontFamily={FONT.hand} fontSize={64} fill="#E8E8DC">മോഡൽ പരീക്ഷ</text><text x={740} y={420} textAnchor="middle" fontFamily={FONT.hand} fontSize={44} fill="#E8E8DC">സമയം: 2½ മണിക്കൂർ</text></g>} />
    {teacher ? <Person look={UNCLE} x={560} g={760} s={0.55} p={teacher} tache specs mundu /> : null}
    {children}
  </g>
);
export const D1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(900, push(t, len, 520, 540), push(t, len, 0.95, 1.0))}>
      <ExamRoom t={t + 20} id="d1" teacher={{ yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'smug']]) }}>
        <Fig look={RAMU} pose={{ x: 1260, y: 760, scale: 1, yaw: -0.35, ...faceAt(t, [[0, 'cool']]) }} rimId="rimL" />
        <SchoolDesk x={1260} />
      </ExamRoom>
    </g>
    <Day t={t - 2} label="ദിവസം" value="4" />
  </g>
);
export const D2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(860, 560, push(t, len, 1.3, 1.4))}>
    <DeskNight t={t} id="d2" front={<g>
      <BookTower x={420} y={700} n={5} />
      <OpenBook x={800} y={690} w={300} turn={clamp((t % 60) / 20)} />
      <g transform="translate(1100 700) scale(1.4)"><Tumbler x={0} y={0} /></g>
    </g>}>
      <Person look={RAMU} x={820} g={860} s={1.15} p={{ yaw: 0.1, look: 0.6, headTilt: 8, armL: { a: 60, b: -80 }, armR: { a: 60, b: -80 }, ...faceAt(t, [[0, 'cool']]) }} />
    </DeskNight>
    <Day t={t - 2} label="തലേന്ന് രാത്രി 3:00" />
  </g>
);
export const D3: React.FC<ShotProps> = ({ t }) => {
  const land = kf(t, [[0, -500], [6, 0]], easeOut);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#7A5A3E" />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={-200} y1={i * 100} x2={2200} y2={i * 100 + 40} stroke="#6A4A32" strokeWidth={6} />)}
      <g transform={`translate(0 ${land})`}>
        <Paper x={960} y={540} w={620} rot={-3} done={false} fill={0} />
        <text x={960} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#2A2230" transform="rotate(-3 960 540)">ചോദ്യപേപ്പർ</text>
      </g>
      <Arm from={[2300, 1300]} to={[1420, 820]} c="#232327" skin="#E8C4A0" w={130} />
    </g>
  );
};
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 1260, y: 760, scale: 1, yaw: -0.2, look: kf(t, [[0, 0], [30, -0.3]]), ...faceAt(t, [[0, 'neutral'], [10, 'oops']]), armR: { a: 150, b: -150 } };
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 30, push(t, len, 3.2, 3.5))}>
      <ExamRoom t={t + 60} id="d4">
        <Fig look={RAMU} pose={p} rimId="rimL" />
        <SchoolDesk x={1260} />
      </ExamRoom>
      <line x1={h.x - 10} y1={h.y + 36} x2={h.x + 50} y2={h.y + 20} stroke="#2F6E9C" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};
export const D5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(900, 560, push(t, len, 1.05, 1.12))}>
    <ExamRoom t={t + 90} id="d5" teacher={{ yaw: 0.2, look: 0.6, armL: { a: 100, b: -60 }, armR: { a: 100, b: -60 }, ...faceAt(t, [[0, 'oops']]) }}>
      <g transform="translate(540 600) rotate(-6)"><rect x={-30} y={-40} width={60} height={80} fill="#F6F2E6" stroke={INK} strokeWidth={3} /></g>
      <Fig look={RAMU} pose={{ x: 1260, y: 760, scale: 1, yaw: -0.35, look: -0.2, ...faceAt(t, [[0, 'oops']]) }} rimId="rimL" />
      <SchoolDesk x={1260} />
      <Person look={APPU} x={1500} g={860} s={0.8} p={{ yaw: -0.6, look: -0.8, ...faceAt(t, [[0, 'oops']]) }} rim="rimL" />
    </ExamRoom>
    {[0, 1, 2].map((i) => <Kid key={i} x={420 + i * 280} y={980} s={1.1} look={KIDS[i]} turn={kf(t, [[0, 0], [30 + i * 10, 0.4]])} />)}
  </g>
);
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const x = 500 + t * 2.2;
  return (
    <g transform={camT(x + 100, 560, 1.5)}>
      <Street t={t + 500} id="d6" mode="dusk" shelter>
        <Person look={RAMU} x={x} g={900} s={0.9} p={{ yaw: 0.6, facing: 1, legL: { a: Math.sin(t / 5) * 22, b: 10 }, legR: { a: -Math.sin(t / 5) * 22, b: 10 }, look: -0.3, headTilt: -6, ...faceAt(t, [[0, 'worried']]) }} />
      </Street>
    </g>
  );
};
export const D7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d7" />
    <BrainIcon x={760} y={500} r={280} t={t} />
    <g opacity={clamp((t - 20) / 10)}>
      <rect x={1280} y={480} width={300} height={20} fill="none" stroke={SCH.line} strokeWidth={4} />
      <line x1={1300} y1={500} x2={1300} y2={640} stroke={SCH.line} strokeWidth={4} /><line x1={1560} y1={500} x2={1560} y2={640} stroke={SCH.line} strokeWidth={4} />
      <rect x={1380} y={380} width={100} height={100} fill="none" stroke={SCH.dim} strokeWidth={4} strokeDasharray="10 8" />
      <SchLabel x={1430} y={720} t={t - 30} text="രാത്രി ഷിഫ്റ്റ്: ആരുമില്ല" size={36} color={SCH.live} />
    </g>
    <Arrow x0={1040} y0={500} x1={1270} y1={490} t={t - 24} />
  </g>
);
export const D8: React.FC<ShotProps> = ({ t }) => {
  const stop = t > 120;
  return (
    <g>
      <Schematic t={t} id="d8" />
      <BrainIcon x={560} y={520} r={260} t={t} />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={1200} y={260 + i * 70} width={460} height={8} fill={SCH.dim} />)}
      {Array.from({ length: 10 }).map((_, i) => {
        const k = clamp(((t - 10 - i * 10) % 1000) / 24);
        const shelf = i % 8;
        const lands = !stop || i < 5;
        const x = 600 + (1240 + (i % 4) * 100 - 600) * (lands ? k : Math.min(k, 0.4));
        const y = 520 + (230 + shelf * 70 - 520) * (lands ? k : Math.min(k, 0.4));
        return t > 10 + i * 10 ? <rect key={i} x={x} y={y} width={70} height={30} fill={lands ? SCH.live : '#5A5A6A'} stroke={SCH.line} strokeWidth={2} opacity={lands ? 1 : 1 - clamp((t - 140) / 20)} /> : null;
      })}
      <SchLabel x={960} y={900} t={t - 20} text="ഉറക്കത്തിൽ: ഇന്നത്തെ ഓർമ്മ → സ്ഥിരം ഓർമ്മ" size={36} />
    </g>
  );
};
export const D9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(860, 520, push(t, len, 1.5, 1.6))}>
      <DeskNight t={t + 120} id="d9" front={<g>
        <OpenBook x={800} y={690} w={300} />
        {Array.from({ length: 8 }).map((_, i) => <text key={i} x={760 + (i % 4) * 30} y={650 + Math.max(0, t - 20 - i * 8) * 3} fontFamily={FONT.title} fontSize={30} fill="#3A2A22" opacity={clamp(1 - (t - 40 - i * 8) / 60)}>{'അആഇഈഉഊഎഏ'[i]}</text>)}
      </g>}>
        <Person look={RAMU} x={820} g={860} s={1.15} p={{ yaw: 0.1, look: 0.6, headTilt: 10, ...faceAt(t, [[0, 'worried']]) }} />
      </DeskNight>
    </g>
    <Fact t={t - 20} big="40%" line="ഒരു രാത്രി ഉറങ്ങാതിരുന്നാൽ പുതിയ ഓർമ്മ ഉണ്ടാക്കാനുള്ള കഴിവ് കുറയുന്നത്" src="Yoo et al., Nature Neuroscience, 2007" />
  </g>
);

// ============================================================ E. DAY 6 AND 7
const K_MOM = stand(KITCHEN, 0.45, 0.4);
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const top = islandTop(0.45, 0.3);
  return (
    <g>
      <g transform={camT(960, push(t, len, 560, 540), push(t, len, 1.0, 1.05))}>
        <Kitchen t={t + 30} id="e1" />
        <Fig look={MOM} pose={{ ...K_MOM, yaw: 0.2, look: 0.4, armR: { a: 50, b: -60 }, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" />
        <KitchenIsland stools={false} />
        <Pot x={top.x} y={top.y} s={0.5} t={t} />
      </g>
      <Day t={t - 2} label="ദിവസം" value="6" />
    </g>
  );
};
export const E2: React.FC<ShotProps> = ({ t }) => {
  const sp = Math.max(0, Math.sin(t / 7));
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#3A2E34" />
      <Glow x={960} y={400} r={800} kind="warm" o={0.45} />
      <rect x={-200} y={800} width={2400} height={500} fill="#5A5A64" stroke={INK} strokeWidth={6} />
      <Pot x={960} y={900} s={2.4} t={t} />
      <Arm from={[2200, -200]} to={[1100, 320 + sp * 60]} c="#8A5A6A" skin="#E8C4A0" w={110} />
      <path d={`M 1080 360 L 1000 520`} stroke="#F6F2EA" strokeWidth={4} strokeDasharray="4 18" opacity={sp} />
      {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={1000 + rnd(81, i) * 120} cy={420 + ((t * 8 + i * 30) % 260)} r={5} fill="#FFFFFF" opacity={sp} />)}
      <text x={1500} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#FFE27A" opacity={t > 40 ? 1 : 0}>× 2</text>
    </g>
  );
};
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { ...stand(KITCHEN, 0.65, 0.6, 0.45), yaw: -0.3, armR: { a: 140, b: -140 }, ...faceAt(t, [[0, 'neutral'], [16, 'dizzy']]) };
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 40, push(t, len, 3.0, 3.2))}>
      <Kitchen t={t + 60} id="e3" />
      <Fig look={SIS} pose={p} rimId="rimL" />
      <ellipse cx={h.x + 30} cy={h.y + 50} rx={26} ry={8} fill="#B8C0C8" stroke={INK} strokeWidth={3} />
      {t > 16 ? [0, 1, 2].map((i) => <path key={i} d={`M ${h.x - 60 + i * 60} ${h.y - 90} l ${-6 + i * 6} -30`} stroke="#F6EFE3" strokeWidth={5} opacity={clamp((t - 16) / 6)} />) : null}
    </g>
  );
};
export const E4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, 640, push(t, len, 1.25, 1.32))}>
    <Hall t={t + 120} id="e4" table>
      {[[860, MOM], [1020, SIS], [1180, RAMU], [1340, GRAN]].map(([x, l], i) => (
        <Person key={i} look={l as Look} x={x as number} g={950} s={(l as Look) === SIS ? 0.62 : 0.8} p={{ yaw: 0, look: 0, headTilt: 6, ...faceAt(t + i * 9, [[0, 'tired']]), armR: { a: 50, b: -70 } }} />
      ))}
      {[860, 1020, 1180, 1340].map((x) => <ellipse key={x} cx={x} cy={800} rx={60} ry={12} fill="#C8CCD4" stroke={INK} strokeWidth={3} />)}
    </Hall>
  </g>
);
export const E5: React.FC<ShotProps> = ({ t, len }) => {
  const open = kf(t, [[0, 0], [14, 1]], easeOut);
  return (
    <g transform={camT(960, 540, push(t, len, 1.0, 1.05))}>
      <rect x={-500} y={-500} width={3000} height={2200} fill="#5E5266" />
      <rect x={-500} y={900} width={3000} height={800} fill="#7A3B2E" />
      <Fridge x={620} y={900} s={1.1} open={open}>
        <Bharani x={0} y={-270} s={1.1} />
        <rect x={-110} y={-120} width={60} height={100} fill="#E8D8A8" stroke={INK} strokeWidth={3} />
      </Fridge>
      {/* the almirah, open, with the milk */}
      <g transform="translate(1420 900)">
        <ellipse cx={0} cy={6} rx={280} ry={18} fill="#000" opacity={0.35} />
        <rect x={-250} y={-680} width={500} height={680} fill="#7A8090" stroke={INK} strokeWidth={7} />
        <rect x={-230} y={-660} width={460} height={640} fill="#3A3446" />
        {[-460, -260].map((y) => <rect key={y} x={-230} y={y} width={460} height={10} fill="#5A5462" />)}
        {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={-200 + i * 80} y={-560} width={60} height={100} fill={['#B8423A', '#3E8C86', '#E9C46A', '#6E86A8', '#8A5A6A'][i]} stroke={INK} strokeWidth={3} />)}
        <MilkPacket x={-60} y={-270} s={1.1} />
        <Glow x={-60} y={-320} r={200} kind="cool" o={0.5 * clamp((t - 30) / 10)} />
      </g>
      {t > 30 ? <FocusRings x={1360} y={630} t={t - 30} /> : null}
    </g>
  );
};
export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(860, 950, 0.8, { yaw: 0.1, look: 0, ...faceAt(t, [[0, 'tired']]), blink: 0.3 });
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 20, push(t, len, 3.4, 3.7))}>
      <Hall t={t + 160} id="e6" table>
        <Fig look={MOM} pose={p} rimId="rimR" />
        <RedEyes pose={p} />
      </Hall>
    </g>
  );
};
export const E7: React.FC<ShotProps> = ({ t }) => {
  const night = clamp(t / 30);
  const stop = clamp((t - 110) / 30);
  return (
    <g>
      <Schematic t={t} id="e7" />
      <Cells t={t} gap={night * (1 - stop)} out={clamp((t - 30) / 70) * (1 - stop)} pile={stop} />
      <SchLabel x={960} y={960} t={t - 10} text={t < 110 ? 'ഉറക്കം: കോശങ്ങൾക്കിടയിൽ വഴി വലുതാകുന്നു, ചവറ് ഒഴുകിപ്പോകുന്നു' : 'ഉറക്കമില്ല: ചവറ് അവിടെത്തന്നെ'} size={36} color={t < 110 ? SCH.line : SCH.live} />
    </g>
  );
};
export const E8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 1300, 1340), 520, push(t, len, 1.5, 1.6))}>
      <Street t={t + 600} id="e8" mode="dusk" bags={Math.min(24, 4 + t / 6)}>
        <Person look={CROWD[1]} x={1650} g={820} s={0.6} p={{ yaw: -0.4, look: -0.6, ...faceAt(t, [[0, 'tired']]) }} mundu tache />
      </Street>
    </g>
    <Fact t={t - 30} big="60%" line="ഉറങ്ങുമ്പോൾ എലികളുടെ തലച്ചോറിൽ, ചവറ് ഒഴുകുന്ന വഴി വലുതാകുന്നത്" src="Xie et al., Science, 2013" />
  </g>
);
export const E9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1400, 560, push(t, len, 1.2, 1.25))}>
      <Street t={t + 700} id="e9" mode="dusk" bags={20}>
        {crowdAt(t, 5, 1480, 800, 0.55, 70, 41)}
        <Person look={RAMU} x={1830} g={810} s={0.56} p={{ yaw: -0.5, look: -0.8, ...faceAt(t, [[0, 'neutral']]) }} rim="rimL" />
        <Bus x={kf(t, [[0, 400], [60, 900]])} y={900} s={0.5} t={t} />
      </Street>
    </g>
    <Day t={t - 2} label="ദിവസം" value="7" />
  </g>
);
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const x = 700 + t * 18;
  return (
    <g transform={camT(1200, 560, 1.6)}>
      <Street t={t + 760} id="e10" mode="dusk" bags={20}>
        {crowdAt(t, 4, 1500, 820, 0.6, 80, 41)}
        <Bus x={x} y={940} s={0.75} t={t} />
        <g transform={`translate(${x + 330} 690)`}><circle r={26} fill="#C69A74" /><circle cx={-8} cy={-4} r={6} fill="#F6EFE3" /><circle cx={10} cy={-4} r={6} fill="#F6EFE3" /><circle cx={-8} cy={-4} r={2} fill={INK} /><circle cx={10} cy={-4} r={2} fill={INK} /><path d="M -12 10 q 12 4 24 0" stroke={INK} strokeWidth={3} fill="none" /><path d="M -12 6 q 12 -6 24 0" stroke="#1E1716" strokeWidth={5} /></g>
        {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={x - 500 - i * 40} y1={700 + i * 30} x2={x - 700 - i * 40} y2={700 + i * 30} stroke="#F6EFE3" strokeWidth={4} opacity={0.4} />)}
      </Street>
    </g>
  );
};
export const E11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 900, 1200), 600, 1.05)}>
    <Street t={t + 820} id="e11" mode="dusk" bags={20}>
      <Bus x={1700 + t * 6} y={900} s={0.55} t={t} />
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 600 + i * 120 + t * 5;
        const ph = t / 3 + i;
        const l = i === 0 ? APPU : i === 3 ? RAMU : CROWD[i % 5];
        return <Person key={i} look={l} x={x} g={900 + (i % 2) * 20} s={0.55} mundu={i % 3 === 1} tache={i % 3 === 1} rim={i === 0 ? 'rimL' : 'rimR'}
          p={{ yaw: 0.7, facing: 1, tilt: 10, legL: { a: Math.sin(ph) * 40, b: 30 }, legR: { a: -Math.sin(ph) * 40, b: 30 }, armL: { a: Math.sin(ph) * 50, b: -40 }, armR: { a: i === 2 ? 160 : -Math.sin(ph) * 50, b: -40 }, ...faceAt(t + i * 4, [[0, 'shock']]) }} />;
      })}
    </Street>
  </g>
);
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const pant = Math.sin(t / 4);
  const p = pose(960, 1300, 1.6, { yaw: 0.3, tilt: 14 + pant * 3, armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 }, look: 0.8, ...faceAt(t, [[0, 'tired']]) });
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 120, push(t, len, 2.4, 2.6))}>
      <Street t={t + 900} id="e12" mode="dusk" bags={20}><Person look={RAMU} x={960} g={1300} s={1.6} p={p} /></Street>
    </g>
  );
};

// ============================================================ MID QUESTION
export const M1: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(960, 1400, 1.9, { yaw: 0.2, look: 0.5, armR: { a: 150, b: -150 }, headTilt: -6, ...faceAt(t, [[0, 'neutral'], [40, 'smug']]) });
  const h = headAt(p);
  return (
    <g>
      <g transform={camT(h.x, h.y - 40, push(t, len, 2.5, 2.7))}>
        <rect x={-3000} y={-3000} width={8000} height={8000} fill="#3A3446" />
        <Glow x={h.x + 300} y={h.y - 200} r={700} kind="warm" o={0.5} />
        <Stars seed={3} x0={0} y0={-400} w={1920} h={600} t={t} n={30} />
        <Person look={RAMU} x={960} g={1400} s={1.9} p={p} />
      </g>
      <Ask t={t} text="ഒരു രാത്രി മുഴുവൻ ഉറങ്ങാതെ നീ ഇരുന്നത് എന്തിനായിരുന്നു?" y={150} />
    </g>
  );
};

// ============================================================ F. DAY 9: THE SUIT, ACHAN
const SuitOnTv: React.FC<{ t: number; s?: number }> = ({ t, s = 0.36 }) => {
  const p: P = { x: 160, y: feet(190, s), scale: s, yaw: 0, armR: { a: 100 + Math.sin(t / 6) * 20, b: -30 }, ...faceAt(t, [[0, 'smug']]) };
  return (
    <g clipPath="url(#suitTvClip)">
      <defs><clipPath id="suitTvClip"><rect x={0} y={0} width={320} height={190} /></clipPath></defs>
      <rect x={0} y={0} width={320} height={190} fill="#5A6A8A" />
      {[30, 120, 230].map((x, i) => <g key={i}><rect x={x} y={70} width={60} height={120} fill="#3A3A4A" /><rect x={x + 20} y={30} width={14} height={40} fill="#3A3A4A" />{[0, 1].map((k) => { const ph = ((t + k * 20 + i * 7) % 40) / 40; return <circle key={k} cx={x + 27} cy={30 - ph * 40} r={8 + ph * 10} fill="#9A9AA6" opacity={1 - ph} />; })}</g>)}
      <Fig look={SUIT} pose={p} rimId="rimR" />
      <Tache pose={p} />
      <rect x={0} y={150} width={320} height={40} fill="#B3202A" />
      <text x={160 - ((t * 2) % 200) + 100} y={178} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={20} fill="#FFF">ഇനി ഫാക്ടറികൾ 24 മണിക്കൂറും</text>
    </g>
  );
};
export const F1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 760, 720), 600, push(t, len, 1.1, 1.15))}>
      <Hall t={t + 200} id="f1" tv={<SuitOnTv t={t} />}>
        <Person look={MOM} x={900} g={980} s={0.85} p={{ yaw: -0.6, look: -0.8, ...faceAt(t, [[0, 'tired']]) }} rim="rimL" />
        <Person look={RAMU} x={1100} g={1000} s={0.85} p={{ yaw: -0.6, look: -0.8, ...faceAt(t, [[0, 'neutral']]) }} rim="rimL" />
        <Person look={SIS} x={760} g={990} s={0.6} p={{ yaw: -0.6, look: -0.8 }} rim="rimL" />
      </Hall>
    </g>
    <Day t={t - 2} label="ദിവസം" value="9" />
  </g>
);
export const F2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(380, 495, push(t, len, 4.2, 4.4))}>
    <Hall t={t + 230} id="f2" tv={<SuitOnTv t={t + 30} />} />
  </g>
);
export const F3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 380, 400), push(t, len, 470, 455), push(t, len, 5.4, 7.2))}>
    <Hall t={t + 260} id="f3" tv={<SuitOnTv t={t + 60} />} />
  </g>
);
export const F4: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(900, 900, 0.75, { yaw: 0.3, armR: { a: 40 + Math.abs(Math.sin(t / 8)) * 60, b: -80 }, ...faceAt(t, [[0, 'tired']]) });
  const h = headAt(p);
  return (
    <g>
      <g transform={camT(push(t, len, 960, 920), 600, push(t, len, 1.1, 1.2))}>
        <Dubai t={t} id="f4">
          <Person look={DAD} x={900} g={900} s={0.75} p={p} tache />
          <HardHat x={h.x} y={h.y} s={0.75} />
          {[600, 1200, 1400].map((x, i) => <Person key={x} look={CROWD[i]} x={x} g={880} s={0.55} p={{ yaw: 0.6, armR: { a: 60, b: -60 } }} />)}
        </Dubai>
      </g>
      <Day t={t - 2} label="ദുബായ്, രാത്രി 11:00" />
    </g>
  );
};
const AchanCall: React.FC<{ t: number; id: string; red?: number }> = ({ t, id, red = 1 }) => {
  const dp = pose(0, 260, 1.3, { yaw: 0.05, headTilt: Math.sin(t / 20) * 4, ...faceAt(t, [[0, 'tired']]), blink: 0.35 + Math.max(0, Math.sin(t / 15)) * 0.3 });
  const h = headAt(dp);
  return (
    <ScreenPhone x={0} y={0} s={1} id={id} bg="#2A2A36">
      <rect x={-200} y={-360} width={400} height={720} fill="#4A4A3E" />
      <rect x={-140} y={-300} width={120} height={160} fill="#6A6A5A" />
      <g transform="translate(0 -20)">
        <Fig look={DAD} pose={dp} rimId="rimBlue" />
        <Tache pose={dp} />
        <HardHat x={h.x} y={h.y} s={1.3} />
        <RedEyes pose={dp} o={red} />
      </g>
      <circle cx={0} cy={300} r={30} fill="#D83A3A" />
    </ScreenPhone>
  );
};
export const F5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#2A2438" />
    <Glow x={960} y={540} r={700} kind="cool" o={0.45} />
    <g transform={`translate(960 ${push(t, len, 560, 540)}) scale(${push(t, len, 1.35, 1.45)})`}><AchanCall t={t} id="f5" /></g>
  </g>
);
export const F6: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(900, 1300, 1.7, { yaw: 0.35, look: 0.6, headTilt: 6, ...faceAt(t, [[0, 'worried']]) });
  const h = headAt(p);
  return (
    <g transform={camT(h.x + 80, h.y + 40, push(t, len, 2.9, 3.1))}>
      <Hall t={t + 290} id="f6" lights={1}>
        <Person look={RAMU} x={900} g={1300} s={1.7} p={p} />
        <g transform={`translate(${h.x + 260} ${h.y + 160}) scale(0.35)`}><AchanCall t={t} id="f6p" /></g>
        <Glow x={h.x + 260} y={h.y + 160} r={300} kind="cool" o={0.6} />
      </Hall>
    </g>
  );
};
export const F7: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(760, 1060, 1.3, { yaw: 0.45, look: 0.6, armR: { a: 70, b: -90 }, ...faceAt(t, [[0, 'neutral'], [40, 'worried']]) });
  return (
    <g transform={camT(980, 520, push(t, len, 1.8, 1.9))}>
      <Hall t={t + 320} id="f7">
        <Person look={MOM} x={760} g={1060} s={1.3} p={p} />
        <g transform="translate(1180 520) scale(0.62)"><AchanCall t={t} id="f7p" /></g>
        <Glow x={1180} y={520} r={420} kind="cool" o={0.5} />
        {[0, 1].map((i) => t > 10 + i * 40 ? <text key={i} x={1340} y={360 + i * 70} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFE27A" opacity={clamp((t - 10 - i * 40) / 6)}>?</text> : null)}
      </Hall>
    </g>
  );
};
export const F8: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(760, 1060, 1.3, { yaw: 0.35, look: 0.3, headTilt: -4, ...faceAt(t, [[0, 'worried']]) });
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 30, push(t, len, 3.4, 3.7))}>
      <Hall t={t + 360} id="f8"><Person look={MOM} x={760} g={1060} s={1.3} p={p} /></Hall>
    </g>
  );
};

// ============================================================ G. DAY 11
export const G1: React.FC<ShotProps> = ({ t, len }) => {
  const laugh = Math.abs(Math.sin(t / 5));
  return (
    <g>
      <g transform={camT(1040, 640, push(t, len, 1.7, 1.8))}>
        <Hall t={t + 400} id="g1" wall={false}>
          <Person look={SIS} x={760} g={980 - laugh * 8} s={0.75} p={{ yaw: 0.6, look: 0.8, armL: { a: 70, b: -50 }, armR: { a: 110, b: -20 }, ...faceAt(t, [[0, 'happy']]), headTilt: laugh * 6 }} />
        </Hall>
      </g>
      <Day t={t - 2} label="ദിവസം" value="11" />
    </g>
  );
};
export const G2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 1000, 980), 560, push(t, len, 1.0, 1.08))}>
    <Hall t={t + 440} id="g2" wall={false}>
      <Person look={SIS} x={700} g={1000} s={0.6} p={{ yaw: 0.6, look: 0.8, ...faceAt(t, [[0, 'happy']]) }} />
      <Person look={MOM} x={1500} g={980} s={0.85} p={{ yaw: -0.6, look: -0.8, armR: { a: 40, b: -90 }, ...faceAt(t, [[0, 'shock']]) }} rim="rimL" />
      <Person look={RAMU} x={1660} g={1000} s={0.85} p={{ yaw: -0.6, look: -0.8, ...faceAt(t, [[0, 'shock']]) }} rim="rimL" />
    </Hall>
  </g>
);
export const G3: React.FC<ShotProps> = ({ t }) => {
  const off = kf(t, [[0, 0], [12, 1]]);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill={off > 0.9 ? '#2A2436' : '#6A5E72'} />
      <Switchboard x={960} y={560} s={2} off={off} />
      <Arm from={[2200, 1300]} to={[1200 - off * 500, 560]} c="#8A5A6A" skin="#E8C4A0" w={110} />
    </g>
  );
};
export const G4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, push(t, len, 1.1, 1.15))}>
    <Village t={t + 400} id="g4" ours={1 - clamp(t / 20)} />
  </g>
);
export const G5: React.FC<ShotProps> = ({ t, len }) => {
  const open = kf(t, [[0, 0], [60, 1]], easeOut);
  const p = pose(560 + open * 380, 860, 1.0, { yaw: 0.6, tilt: 30, armL: { a: 60, b: -20 }, armR: { a: 70, b: -20 }, ...faceAt(t, [[0, 'neutral']]) });
  return (
    <g transform={camT(980, 620, push(t, len, 1.5, 1.6))}>
      <Veranda t={t + 20} id="g5">
        <Paaya x={500} y={790} w={680} d={100} open={open} />
        <Person look={MOM} x={560 + open * 380} g={860} s={1.0} p={p} rim="rimBlue" />
      </Veranda>
    </g>
  );
};
export const G6: React.FC<ShotProps> = ({ t, len }) => {
  const p = pose(960, 1300, 1.8, { yaw: 0.2, look: 0.4, headTilt: -5, ...faceAt(t, [[0, 'neutral'], [60, 'happy']]) });
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 30, push(t, len, 3.0, 3.2))}>
      <Veranda t={t + 80} id="g6"><Person look={MOM} x={960} g={1300} s={1.8} p={p} rim="rimBlue" /></Veranda>
    </g>
  );
};

// ============================================================ H. DAY 12 AGAIN
export const H1: React.FC<ShotProps> = ({ t, len }) => {
  const reach = kf(t, [[0, 0], [24, 1]], easeOut);
  return (
    <g>
      <g transform={camT(960, push(t, len, 680, 660), push(t, len, 1.1, 1.15))}>
        <Street t={t + 1000} id="h1" roads shelter={false}>
          <Person look={RAMU} x={960} g={960} s={0.5} p={{ yaw: 0.4, look: 0.6, armR: { a: 20 + reach * 40, b: -10 }, ...faceAt(t, [[0, 'worried']]) }} />
          <Person look={APPU} x={1160 - reach * 80} g={960} s={0.5} p={{ yaw: -0.5, look: -0.6, armL: { a: 20 + reach * 50, b: -10 }, ...faceAt(t, [[0, 'neutral']]) }} rim="rimL" />
        </Street>
      </g>
      <Day t={t - 2} label="ദിവസം" value="12" />
    </g>
  );
};
export const H2: React.FC<ShotProps> = ({ t }) => {
  const x = 300 + t * 2.6;
  const ph = t / 5;
  const walk = (s: number): P => ({ yaw: 0.6, facing: 1, legL: { a: Math.sin(ph) * 22, b: 10 }, legR: { a: -Math.sin(ph) * 22, b: 10 }, ...faceAt(t, [[0, s ? 'neutral' : 'tired']]) });
  return (
    <g>
      <g transform={camT(x + 200, 560, 1.25)}>
        <Sky id="h2" mode="night" y0={-600} y1={800} />
        <Stars seed={44} x0={-400} y0={-500} w={3600} h={800} t={t} n={70} />
        <Moon x={x + 700} y={160} r={40} />
        {Array.from({ length: 12 }).map((_, i) => <Palm key={i} x={-200 + i * 320} y={760} s={0.9} t={t + i * 30} dark />)}
        <rect x={-3000} y={760} width={8000} height={3000} fill="#2A2A30" />
        <Person look={APPU} x={x + 120} g={900} s={0.8} p={{ ...walk(1), armL: { a: 40, b: -10 } }} rim="rimBlue" />
        <Person look={RAMU} x={x} g={900} s={0.8} p={{ ...walk(0), armR: { a: 50, b: -10 } }} rim="rimBlue" />
        <LightVeil id="h2v" lights={[[x + 700, 160, 600]]} o={0.35} />
      </g>
    </g>
  );
};
/** The family on their mats seen from high, lying with eyes closed. */
const Lying: React.FC<{ look: Look; x: number; y: number; s: number; open?: number; flip?: boolean }> = ({ look, x, y, s, open = 0, flip }) => (
  <g transform={`translate(${x} ${y}) rotate(${flip ? 90 : -90}) translate(${-x} ${-y})`}>
    <Fig look={look} pose={{ x, y, scale: s, yaw: 0, armL: { a: 8, b: 0 }, armR: { a: 8, b: 0 }, legL: { a: 2, b: 0 }, legR: { a: -2, b: 0 }, expr: 'neutral', blink: 1 - open }} rimId="rimBlue" />
  </g>
);
export const H3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 760, push(t, len, 1.4, 1.5))}>
    <Veranda t={t + 120} id="h3">
      <Paaya x={300} y={790} w={1300} d={100} />
      <Lying look={MOM} x={600} y={830} s={0.42} />
      <Lying look={SIS} x={900} y={830} s={0.32} />
      <Lying look={RAMU} x={1260} y={830} s={0.42} />
    </Veranda>
  </g>
);
export const H4: React.FC<ShotProps> = ({ t, len }) => {
  const open = t > 120 ? 1 : 0;
  return (
    <g transform={camT(1180, 830, push(t, len, 3.4, 3.8))}>
      <Veranda t={t + 160} id="h4">
        <Paaya x={300} y={790} w={1300} d={100} />
        <Lying look={RAMU} x={1260} y={830} s={0.42} open={open} />
      </Veranda>
      {t > 120 && t < 136 ? <g transform="translate(1180 830) scale(0.3) translate(-1180 -830)"><FocusRings x={1180} y={830} t={t - 120} /></g> : null}
    </g>
  );
};

// ============================================================ I. THE TWIST
export const I1: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="i1" />
    <RatCage x={720} y={420} s={1} t={t} />
    <SchLabel x={1420} y={300} t={t - 10} text="ഉറങ്ങാൻ വിടാത്ത എലി" size={40} />
    <CountUp x={1420} y={460} t={t - 20} to={32} dur={120} size={120} suffix=" ദിവസം" />
    <Fact t={t - 140} big="11-32 ദിവസം" line="പൂർണമായും ഉറക്കം കിട്ടാത്ത എലികൾ ജീവിച്ചത്" src="Rechtschaffen et al., Sleep, 1989" />
  </g>
);
export const I2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1180, 830, push(t, len, 3.8, 4.1))}>
    <Veranda t={t + 300} id="i2">
      <Paaya x={300} y={790} w={1300} d={100} />
      <Lying look={RAMU} x={1260} y={830} s={0.42} open={1} />
    </Veranda>
  </g>
);
export const I3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, push(t, len, 600, 620), push(t, len, 1.0, 1.06))}>
      <SeaFloor t={t} id="i3">
        <Jelly x={500} y={830} s={0.9} t={t} />
        <Jelly x={960} y={850} s={1.2} t={t + 20} c="#B8E0D8" />
        <Jelly x={1440} y={820} s={0.8} t={t + 40} />
      </SeaFloor>
    </g>
    <Fact t={t - 20} big="തലച്ചോർ: ഇല്ല" line="എന്നിട്ടും രാത്രി ഉറക്കം പോലൊരു അവസ്ഥ: Cassiopea ജെല്ലിഫിഷ്" src="Nath et al., Current Biology, 2017" />
  </g>
);
export const I4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 760, push(t, len, 2.4, 2.6))}>
    <SeaFloor t={t + 110} id="i4">
      <Jelly x={960} y={850} s={1.2} t={t * kf(t, [[0, 1], [len, 0.4]])} c="#B8E0D8" />
    </SeaFloor>
  </g>
);
export const I5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, push(t, len, 560, 600), push(t, len, 0.85, 0.95))}>
    <Veranda t={t + 400} id="i5">
      <Paaya x={300} y={790} w={1300} d={100} />
      <Lying look={MOM} x={600} y={830} s={0.42} open={1} />
      <Lying look={SIS} x={900} y={830} s={0.32} open={1} />
      <Lying look={RAMU} x={1260} y={830} s={0.42} open={1} />
    </Veranda>
  </g>
);
export const I6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1180, push(t, len, 860, 840), push(t, len, 2.4, 2.6))}>
      <Veranda t={t + 460} id="i6">
        <Paaya x={300} y={790} w={1300} d={100} />
        <Lying look={RAMU} x={1260} y={830} s={0.42} open={1} />
      </Veranda>
    </g>
    <Ask t={t} text="നിനക്ക് ഏറ്റവും നല്ല ഉറക്കം കിട്ടിയിട്ടുള്ളത് എവിടെ വെച്ചാണ്?" y={160} />
  </g>
);

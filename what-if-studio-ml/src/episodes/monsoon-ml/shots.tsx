import React from 'react';
import {
  faceAt, kf, clamp, camT, rnd, Pose, Kitchen, KITCHEN, KitchenIsland, islandTop, stand, Tabletop, Classroom, Kid,
  Schematic, SCH, DrawOn, Arrow, SchLabel, CountUp, PlantIcon, TitleCard, ShotProps, FONT, Glow, Tag, Gauge, DizzyStars,
  Foreground, FloatLabel, Stars, Moon, Cat, Sun, Dust, LightVeil, walkPose,
} from '../../engine';
import {
  Fig, Palm, MangoTree, KHouse, Water, FlatBuilding, BlackCar, Rain, Bolt, TV, NewsBar, Big, Fade, Drops, PIP, MO, SIS, MOM, SUIT, headAt,
  Cloud, CloudRow, Boat, Sky,
} from '../fly-ml/kit';
import { CROWD, Gate, Mundu, Cobweb, Spider, TeaGlass } from '../phone-ml/kit';
import {
  feet, mix, DAD, GRAN, SHOPKEEPER, FISHMAN, TODDLER, HSky, Land, Cracks, Bank, Kudam, Umbrella, Tanker, Tusker, Well, Fan, SteelPlate,
  Tank, Solar, Fish, Basket, Offer, ScreenPhone, Arm, Queue, CloudPuff,
} from './kit';

const INK = '#1A1230';
type P = Partial<Pose>;
const fig = (look: Parameters<typeof Fig>[0]['look'], x: number, g: number, s: number, extra: P = {}, rim = 'rimR', shadow = 0.5) => (
  <Fig look={look} pose={{ x, y: feet(g, s), scale: s, ...extra }} rimId={rim} shadow={shadow} />
);
const Soft: React.FC<{ children: React.ReactNode }> = ({ children }) => <Foreground blur={16}>{children}</Foreground>;
const push = (t: number, len: number, a: number, b: number) => kf(t, [[0, a], [len, b]]);

// ============================================================ shared scenes
/** The road outside the flats. Road from y 780, tanker and crowd added by the shot. */
const Street: React.FC<{ t: number; id: string; mode?: string; dry?: number }> = ({ t, id, mode = 'haze', dry = 0.85 }) => (
  <g>
    <Land t={t} id={id} mode={mode} dry={dry} y={640} sun={mode === 'rainy' ? [0, 0, 0] : [1560, 150, 90]} palms={[-120, 1950]} hills={false} />
    {[-60, 420, 1010, 1500].map((x, i) => <FlatBuilding key={x} x={x} y={700} s={0.92 + (i % 2) * 0.12} night={false} />)}
    <rect x={-3000} y={690} width={8000} height={36} fill="#9A8E86" stroke={INK} strokeWidth={3} />
    <rect x={-3000} y={726} width={8000} height={2000} fill="#5A5460" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-400 + i * 280} y={900} width={150} height={13} rx={4} fill="#EDE6D6" opacity={0.55} />)}
  </g>
);
/** The flat's kitchen, seen wide or close. */
const Flat: React.FC<{ t: number; id: string; veil?: number; children?: React.ReactNode }> = ({ t, id, veil = 0.42, children }) => (
  <g><Kitchen t={t + 40} id={id} veil={veil} />{children}</g>
);
/** The terrace: a parapet, the washing line and the sky. Floor y 860. */
const Terr: React.FC<{ t: number; id: string; night?: boolean; mode?: string; line?: boolean; dry?: number }> = ({ t, id, night, mode = 'blaze', line = true, dry = 0.35 }) => (
  <g>
    {night ? <g><HSky id={id} mode="night" /><Stars seed={4} x0={-200} y0={-100} w={2300} h={640} t={t} n={110} o={0.8} /><Moon x={1400} y={330} r={58} /><Glow x={1400} y={330} r={320} kind="cool" o={0.45} /></g>
      : <Land t={t} id={id} mode={mode} dry={dry} y={640} sun={[1580, 160, 90]} palms={[150, 1740]} />}
    <rect x={-3000} y={690} width={8000} height={110} fill={night ? '#3A3448' : '#A6968A'} stroke={INK} strokeWidth={5} />
    {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={-340 + i * 150} y={712} width={72} height={66} rx={7} fill={night ? '#262034' : '#6E6058'} />)}
    <rect x={-3000} y={800} width={8000} height={2000} fill={night ? '#2C2838' : '#8A7C76'} />
    {line ? <path d="M -120 330 Q 960 430 2040 330" stroke={INK} strokeWidth={5} fill="none" /> : null}
  </g>
);
const CLOTHES: [number, string][] = [[260, '#D9534F'], [430, '#F6EFE3'], [1240, '#3E8C86'], [1420, '#E4B84A']];
const Clothes: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {CLOTHES.map(([x, c], i) => (
      <rect key={i} x={x} y={368 - (i === 1 || i === 2 ? -6 : 0)} width={120} height={170} fill={c} stroke={INK} strokeWidth={4} transform={`rotate(${Math.sin(t / 18 + i) * 2.5} ${x} 372)`} />
    ))}
  </g>
);
/** The grandmother's yard: tiled house, well, mango tree, gate. Ground y 800. */
const Yard: React.FC<{ t: number; id: string; mode?: string; dry?: number; well?: boolean }> = ({ t, id, mode = 'dusk', dry = 0.85, well = true }) => (
  <g>
    <Land t={t} id={id} mode={mode} dry={dry} y={720} sun={mode === 'dusk' ? [420, 500, 110] : mode === 'grey' ? [0, 0, 0] : [1640, 190, 80]} palms={[-60, 1960]} />
    <KHouse x={1230} y={760} s={0.92} lit={mode === 'dusk' ? 1 : 0} door={0.3} />
    <MangoTree x={230} y={770} s={1.15} t={t} dark={dry > 0.6} />
    {well ? <Well x={640} y={720} s={0.72} /> : null}
  </g>
);
const Schem: React.FC<{ t: number; id: string; children?: React.ReactNode }> = ({ t, id, children }) => (
  <g><Schematic t={t} id={id} />{children}</g>
);
const PENINSULA = 'M 330 -60 L 620 240 L 690 470 L 760 700 L 830 900 L 890 960 L 960 900 L 1100 720 L 1250 540 L 1420 330 L 1560 -60 Z';
const KERALA = 'M 742 650 L 790 648 L 900 906 L 884 950 L 836 896 Z';
const Map: React.FC<{ t: number; heat?: number; kerala?: number }> = ({ t, heat = 0, kerala = 0.7 }) => (
  <g>
    <path d={PENINSULA} fill={mix('#1E3048', '#5E3020', heat)} stroke={SCH.line} strokeWidth={5} />
    <path d={KERALA} fill={SCH.live} opacity={kerala} stroke={SCH.live} strokeWidth={3} />
    {heat > 0 ? <Glow x={1000} y={300} r={560} kind="warm" o={0.5 * heat} /> : null}
    {heat > 0 ? <Sun x={1560} y={150} r={70} t={t} /> : null}
  </g>
);
/** The coast in section: sea on the left, the Ghats on the right. */
const Ghats: React.FC<{ t: number; rain?: number }> = ({ t, rain = 0 }) => (
  <g>
    <rect x={-100} y={800} width={760} height={320} fill="#1E5A7A" />
    {[0, 1, 2].map((i) => <path key={i} d={`M -100 ${820 + i * 50} Q 300 ${808 + i * 50 + Math.sin(t / 10 + i) * 6} 660 ${820 + i * 50}`} stroke="#6FB4C8" strokeWidth={3} fill="none" opacity={0.6} />)}
    <path d="M 640 800 L 900 780 L 1120 640 L 1260 400 L 1370 300 L 1500 380 L 1720 520 L 2040 560 L 2040 1120 L 640 1120 Z" fill="#2E4A3A" stroke={SCH.line} strokeWidth={5} />
    <Big x={1520} y={700} text="പശ്ചിമഘട്ടം" size={56} t={99} />
    <Cloud x={1060} y={260} s={0.9} {...{ lit: '#C4D0E2', body: '#7E8CA8', shade: '#465070' }} />
    <Cloud x={1320} y={170} s={0.7} {...{ lit: '#C4D0E2', body: '#7E8CA8', shade: '#465070' }} />
    {rain > 0 ? Array.from({ length: 46 }).map((_, i) => { const x = 900 + rnd(2, i) * 620; const y = 320 + ((t * 13 + rnd(3, i) * 420) % 420); return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 34} stroke="#9CD4FF" strokeWidth={5} strokeLinecap="round" />; }) : null}
  </g>
);
const RainCol: React.FC<{ t: number; level: number; children?: React.ReactNode }> = ({ t, level, children }) => {
  const m = 330; // world units a metre
  const top = 960 - level * m;
  return (
    <g>
      <line x1={760} x2={760} y1={960} y2={960 - 2.2 * m} stroke={SCH.line} strokeWidth={4} />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <line x1={730} x2={760} y1={960 - k * m} y2={960 - k * m} stroke={SCH.line} strokeWidth={4} />
          <SchLabel x={700} y={972 - k * m} t={99} text={`${k} m`} size={34} anchor="end" />
        </g>
      ))}
      <line x1={760} x2={1500} y1={960} y2={960} stroke={SCH.line} strokeWidth={4} />
      {children}
      <rect x={780} y={top} width={700} height={960 - top} fill="#3E9CC8" opacity={0.55} />
      <path d={`M 780 ${top} Q 960 ${top - 9 * Math.sin(t / 9)} 1130 ${top} T 1480 ${top}`} stroke="#BFEFFF" strokeWidth={5} fill="none" />
    </g>
  );
};
const Passbook: React.FC<{ rows: [string, string][]; live?: number; t: number }> = ({ rows, live = -1 }) => (
  <g>
    <rect x={430} y={110} width={1060} height={860} rx={10} fill="#E9E2D0" stroke={INK} strokeWidth={6} />
    <rect x={430} y={110} width={1060} height={120} fill="#1F5C4A" />
    <text x={960} y={196} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#F6EFE3">കേരളം: മഴ അക്കൗണ്ട്</text>
    {rows.map(([a, b], i) => (
      <g key={i}>
        <text x={490} y={330 + i * 120} fontFamily={FONT.title} fontWeight={700} fontSize={58} fill={INK}>{a}</text>
        <text x={1430} y={330 + i * 120} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={58} fill={i === live ? '#C2312A' : '#2A4A3A'}>{b}</text>
        <line x1={480} x2={1440} y1={356 + i * 120} y2={356 + i * 120} stroke="#B8AE96" strokeWidth={3} />
      </g>
    ))}
  </g>
);
const TearCal: React.FC<{ x: number; y: number; s?: number; month: string; day: string }> = ({ x, y, s = 1, month, day }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-210} y={-250} width={420} height={500} rx={10} fill="#F4EDDC" stroke={INK} strokeWidth={6} />
    <rect x={-210} y={-250} width={420} height={120} fill="#C2312A" />
    <text textAnchor="middle" y={-164} fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#F6EFE3">{month}</text>
    <text textAnchor="middle" y={110} fontFamily={FONT.title} fontWeight={800} fontSize={230} fill={INK}>{day}</text>
  </g>
);
const Blur: React.FC<{ t: number; id: string; x?: number; y?: number; z?: number; veil?: number }> = ({ t, id, x = 860, y = 520, z = 2.4, veil = 0.45 }) => (
  <Soft><g transform={camT(x, y, z)}><Kitchen t={t} id={id} veil={veil} /></g></Soft>
);

// ============================================================ A. COLD OPEN
const TapMacro: React.FC<{ t: number; id: string; salt?: number; len: number }> = ({ t, id, salt = 0, len }) => (
  <g transform={camT(960, 540, push(t, len, 1, 1.08))}>
    <Blur t={t} id={id} z={2.8} y={500} />
    <Glow x={1320} y={260} r={760} kind="warm" o={0.75} />
    <rect x={878} y={520} width={72} height={700} fill="#CFEAFA" opacity={0.85} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={888 + i * 14} y={520 + ((t * 26 + i * 90) % 520)} width={7} height={120} rx={3} fill="#FFFFFF" opacity={0.8} />)}
    <path d="M 1700 -40 L 1700 150 Q 1700 210 1640 210 L 1010 210 Q 900 216 884 330 L 870 520 L 960 520 L 978 360 Q 986 320 1030 320 L 1640 320 Q 1810 320 1810 150 L 1810 -40 Z" fill="#B8BEC8" stroke={INK} strokeWidth={8} />
    <path d="M 1740 -40 L 1740 150 Q 1740 240 1640 240 L 1020 240" stroke="#F1F4F8" strokeWidth={14} fill="none" opacity={0.75} />
    <rect x={1260} y={110} width={180} height={100} rx={12} fill="#9EA4B0" stroke={INK} strokeWidth={8} />
    <rect x={1200} y={70} width={300} height={54} rx={22} fill="#D2D6DE" stroke={INK} strokeWidth={8} />
    <ellipse cx={914} cy={1030} rx={420} ry={80} fill="#7A8290" stroke={INK} strokeWidth={8} />
    <ellipse cx={914} cy={1030} rx={330} ry={52} fill="#343A48" />
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={914 + Math.cos(t / 3 + i) * (80 + i * 26)} cy={1010 - Math.abs(Math.sin(t / 4 + i * 2)) * 70} r={12} fill="#CFEAFA" />)}
    {salt ? Array.from({ length: 34 }).map((_, i) => <rect key={i} x={840 + rnd(3, i) * 170} y={470 + rnd(4, i) * 54} width={16} height={16} fill="#FFFFFF" opacity={0.85} transform={`rotate(${rnd(5, i) * 90} ${870 + rnd(3, i) * 120} 500)`} />) : null}
  </g>
);
export const A1: React.FC<ShotProps> = ({ t, len }) => <TapMacro t={t} id="a1" len={len} />;
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const k = stand(KITCHEN, 0.42, 0.34);
  const p: P = { x: k.x, y: k.y, scale: k.scale, yaw: -0.55, look: -0.2, headTilt: -8, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, blink: 1 };
  const h = headAt(p);
  return (
    <g transform={camT(h.x - 30, h.y + 30, push(t, len, 2.7, 2.9))}>
      <Flat t={t} id="a2"><Fig look={PIP} pose={p} rimId="rimL" /></Flat>
      <Arm from={[h.x + 150, h.y + 330]} to={[h.x - 58, h.y + 74]} w={22} />
      <g transform={`rotate(-34 ${h.x - 76} ${h.y + 44})`}><path d={`M ${h.x - 104} ${h.y - 8} L ${h.x - 96} ${h.y + 76} L ${h.x - 56} ${h.y + 76} L ${h.x - 48} ${h.y - 8} Z`} fill="#BFE3F2" opacity={0.75} stroke={INK} strokeWidth={4} /></g>
    </g>
  );
};
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const k = stand(KITCHEN, 0.56, 0.34);
  const p: P = { x: k.x, y: k.y, scale: k.scale, yaw: -0.75, look: -0.6, tilt: -10, headTilt: -10, armL: { a: 62, b: -10 }, armR: { a: 46, b: -40 }, ...faceAt(t, [[0, 'shock']]) };
  const h = headAt(p);
  const cat = islandTop(0.3, 0.1);
  return (
    <g transform={camT(h.x - 180, h.y + 110, 1.75)}>
      <Flat t={t} id="a3"><Fig look={PIP} pose={p} rimId="rimL" /><KitchenIsland /><Cat x={cat.x} y={cat.y} mood="alert" f={t} /></Flat>
      {Array.from({ length: 34 }).map((_, i) => {
        const u = clamp((t - 2 - rnd(3, i) * 10) / 12);
        const a = -0.35 + rnd(4, i) * 0.8;
        return <circle key={i} cx={h.x - 62 - u * (230 + rnd(5, i) * 90) * Math.cos(a)} cy={h.y + 44 + u * (140 * u + rnd(6, i) * 60 - 26) + Math.sin(a) * 40 * u} r={3.5 + rnd(7, i) * 7} fill="#BFE3F2" opacity={u > 0 && u < 1 ? 0.9 : 0.75} />;
      })}
      <Drops x={cat.x} y={cat.y - 90} t={t} n={8} w={120} />
    </g>
  );
};
export const A4: React.FC<ShotProps> = ({ t }) => {
  const jump = Math.sin(clamp((t - 6) / 30) * Math.PI);
  return (
    <g>
      <Tabletop edge={1300} kind="stone" />
      <Glow x={1500} y={160} r={760} kind="warm" o={0.45} />
      <ellipse cx={960} cy={590} rx={320} ry={320} fill="#000" opacity={0.28} />
      <circle cx={960} cy={560} r={310} fill="#C8CED8" stroke={INK} strokeWidth={7} />
      <circle cx={960} cy={560} r={268} fill="#3E86A8" />
      <circle cx={960} cy={560} r={268} fill="none" stroke="#EDE6D6" strokeWidth={12} strokeDasharray="10 22" />
      <path d="M 790 480 Q 850 440 920 470" stroke="#BFEFFF" strokeWidth={8} fill="none" opacity={0.7} strokeLinecap="round" />
      <g transform={`translate(0 ${-jump * 110})`}><Fish x={960} y={570} s={1.9} c="#D6E2EC" /></g>
      {jump > 0.15 ? <Drops x={960} y={500} t={t} n={7} w={200} /> : null}
    </g>
  );
};
export const A5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 780, push(t, len, 0.72, 0.78))}>
    <Street t={t} id="a5" />
    <Tanker x={kf(t, [[0, 700], [len, 1040]])} y={990} s={0.62} t={t} />
    <Queue x={560} y={1016} n={6} gap={118} s={0.42} looks={[...CROWD, MOM]} t={t} />
    <Foreground blur={10}>
      <rect x={-900} y={1250} width={3700} height={40} fill="#20182A" />
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={-860 + i * 170} y={1270} width={26} height={380} fill="#20182A" />)}
    </Foreground>
  </g>
);
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 560], [len, 760]]);
  const p = walkPose(x, t * 0.9, 900, 1.05, { expr: 'worried', look: 0.6, tilt: 13, armL: { a: 54 + Math.sin(t * 0.9) * 26, b: -50 }, armR: { a: 42, b: -78 } }, 1);
  const hand = { x: p.x + 90, y: p.y - 34 };
  return (
    <g transform={camT(x + 190, 610, 1.4)}>
      <Street t={t + 30} id="a6" />
      <Tanker x={1410} y={930} s={1.0} t={t * 3} />
      <Fig look={MOM} pose={p} rimId="rimR" shadow={0.5} />
      <Kudam x={hand.x} y={hand.y} s={0.72} rot={18} />
      <CloudPuff x={x - 160} y={900} s={0.65} o={0.5} />
      <Foreground blur={10}><rect x={-300} y={1000} width={500} height={300} fill="#141018" /></Foreground>
    </g>
  );
};
const CalShot: React.FC<{ t: number; len: number; id: string; month: string; day: string }> = ({ t, len, id, month, day }) => (
  <g>
    <Blur t={t} id={id} z={2.5} x={1100} />
    <Glow x={700} y={200} r={700} kind="warm" o={0.4} />
    <g transform={`rotate(${Math.sin(t / 14) * 1.2} 960 120)`}><TearCal x={960} y={540} s={1.45 + (t / len) * 0.06} month={month} day={day} /></g>
    <circle cx={960} cy={120} r={12} fill="#6A6A76" stroke={INK} strokeWidth={4} />
  </g>
);
export const A7: React.FC<ShotProps> = ({ t, len }) => <CalShot t={t} len={len} id="a7" month="ഡിസംബർ" day="14" />;
export const A8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1, 1.07))}>
    <Land t={t} id="a8" mode="rainy" dry={0} y={640} sun={[0, 0, 0]} palms={[120, 1760]} />
    <KHouse x={1180} y={700} s={0.72} lit={1} />
    <Water t={t} y={770} />
    <Boat x={620} y={790} s={0.9} t={t} />
    <Palm x={330} y={760} s={1.4} t={t} />
    <Rain t={t} o={0.6} />
  </g>
);

// ============================================================ B. JUNE 1
const Bag: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-48} y={-74} width={96} height={136} rx={26} fill="#2F7E7C" stroke={INK} strokeWidth={5} />
    <rect x={-34} y={0} width={68} height={46} rx={8} fill="#E9A23B" stroke={INK} strokeWidth={4} />
  </g>
);
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 700], [len, 1080]]);
  return (
    <g transform={camT(960, 590, 1)}>
      <Street t={t} id="b1" mode="morning" dry={0.1} />
      <Bag x={x - 40} y={760} s={0.75} />
      <Fig look={PIP} pose={walkPose(x, t * 0.55, 880, 0.8, { expr: 'happy', look: 0.5 }, 1)} rimId="rimR" shadow={0.5} />
      {[0, 1, 2].map((i) => <Fig key={i} look={CROWD[i]} pose={walkPose(x - 280 - i * 170, t * 0.55 + i, 856, 0.62, {}, 1)} shadow={0.4} />)}
      <Umbrella x={x - 620} y={760} s={0.5} closed />
    </g>
  );
};
export const B2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1.03, 1.1))}>
    <Tabletop edge={1300} />
    <Glow x={1540} y={200} r={760} kind="warm" o={0.55} />
    <Bag x={560} y={520} s={3.1} />
    <g transform="translate(1000 460) rotate(-8)">
      {[0, 76].map((dx) => <g key={dx}><ellipse cx={dx} cy={0} rx={36} ry={104} fill="#3E6E8C" stroke={INK} strokeWidth={5} /><path d={`M ${dx - 28} -30 Q ${dx} -80 ${dx + 28} -30`} stroke="#E9A23B" strokeWidth={12} fill="none" /></g>)}
    </g>
    <Umbrella x={1400} y={560} s={2.2} rot={22} closed />
  </g>
);
export const B3: React.FC<ShotProps> = ({ t }) => {
  const a = stand(KITCHEN, 0.42, 0.4);
  const b = stand(KITCHEN, 0.66, 0.4);
  const n = 1 + Math.min(2, Math.floor(t / 34));
  const pip: P = { ...a, yaw: 0.65, look: 0.5, ...faceAt(t, [[0, 'neutral'], [70, 'tired']]) };
  return (
    <g transform={camT(980, 590, 1.75)}>
      <Flat t={t} id="b3">
        <Bag x={a.x - 54} y={a.y - 8} s={0.86} />
        <Fig look={PIP} pose={pip} rimId="rimR" />
        {Array.from({ length: n }).map((_, i) => <Umbrella key={i} x={a.x - 150 + i * 44} y={a.y - 150} s={0.8} rot={-24 + i * 14} c={['#1E1E2C', '#7A2E4E', '#2E5C8A'][i]} closed />)}
        <Fig look={MOM} pose={{ ...b, yaw: -0.65, look: -0.5, armL: { a: 72, b: -16 }, expr: 'smug' }} rimId="rimL" />
        <KitchenIsland stools={false} />
        <Umbrella x={b.x - 150} y={b.y - 96} s={0.8} rot={78} c="#2E7A4E" closed />
      </Flat>
    </g>
  );
};
export const B4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1, 1.06))}>
    <HSky id="b4" mode="blaze" y1={1100} />
    <Sun x={1450} y={210} r={110} t={t} />
    <Glow x={1450} y={210} r={620} kind="warm" o={0.6} />
    <FlatBuilding x={300} y={1260} s={1.6} night={false} />
    {fig(PIP, 960, 1520, 2.1, { yaw: 0.3, look: 0.4, headTilt: -16, expr: 'neutral' }, 'rimR', 0)}
    <Foreground blur={10}><Palm x={1720} y={1420} s={2.2} t={t} dark /></Foreground>
  </g>
);
export const B5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <HSky id="b5" mode="blaze" y1={1500} />
    <Sun x={1400} y={280} r={120} t={t} />
    <Glow x={1400} y={280} r={700} kind="warm" o={0.6} />
    <Cloud x={kf(t, [[0, 700], [len, 480]])} y={420} s={kf(t, [[0, 0.3], [len, 0.08]])} {...{ lit: '#FFFFFF', body: '#EAF2F8', shade: '#BFD0E0' }} />
    <Foreground blur={6}>
      <path d="M -40 1120 Q 240 700 -40 340 L -200 340 L -200 1120 Z" fill="#163822" />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M -20 ${460 + i * 90} Q ${180 + i * 12} ${380 + i * 70} ${300 + i * 22} ${520 + i * 80}`} stroke="#1C4A2C" strokeWidth={26} fill="none" strokeLinecap="round" />)}
    </Foreground>
  </g>
);
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const dx = kf(t, [[0, -40], [len, 70]]);
  const kids = [
    { x: 300, l: CROWD[0], c: '#1E1E2C' }, { x: 560, l: CROWD[1], c: '#7A2E4E' }, { x: 820, l: PIP, c: '#2E5C8A' },
    { x: 1080, l: CROWD[2], c: '#1E1E2C' }, { x: 1340, l: CROWD[3], c: '#2E7A4E' },
  ];
  return (
    <g transform={camT(960, 560, 1)}>
      <Land t={t} id="b6" dry={0.12} y={700} sun={[1620, 170, 120]} palms={[-40, 1960]} />
      {kids.map((k, i) => (
        <g key={i}>
          <Bag x={k.x + dx - 34} y={708} s={0.62} />
          <Fig look={k.l} pose={walkPose(k.x + dx, t * 0.5 + i, 820, 0.62, { expr: i === 2 ? 'tired' : 'neutral', armR: { a: 90, b: -96 } }, 1)} rimId="rimR" shadow={0.6} />
          <Umbrella x={k.x + dx + 32} y={560} s={0.86} c={k.c} />
        </g>
      ))}
      {/* Mo, last, has gone all the way: raincoat and all */}
      {(() => {
        const mx = 1590 + dx;
        return (
          <g>
            <Fig look={MO} pose={walkPose(mx, t * 0.5 + 6, 820, 0.62, { expr: 'tired' }, 1)} rimId="rimR" shadow={0.6} />
            <path d={`M ${mx - 42} 620 Q ${mx} 586 ${mx + 42} 620 L ${mx + 62} 790 L ${mx - 62} 790 Z`} fill="#E9C21E" stroke={INK} strokeWidth={5} opacity={0.97} />
            <Drops x={mx} y={600} t={t} n={4} w={70} color="#BFEFFF" />
          </g>
        );
      })()}
    </g>
  );
};
export const T: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Land t={t} id="ttl" mode="dusk" dry={0.9} y={800} sun={[960, 640, 160]} palms={[140, 1780]} />
    <Cracks x={200} y={850} w={1500} h={200} />
    <Umbrella x={1240} y={760} s={0.9} rot={-16} c="#1E1E2C" />
    {fig(PIP, 700, 900, 0.7, { yaw: 0.5, look: 0.5, headTilt: -8 }, 'rimR', 0.5)}
    <TitleCard t={t} lines={['കാലവർഷം', 'വന്നില്ലെങ്കിൽ?']} accent="വന്നില്ലെങ്കിൽ?" accentT={30} size={120} />
    <Fade t={t} len={len} n={8} />
  </g>
);

// ============================================================ C. HOW THE RAIN GETS HERE
export const C1: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="c1">
    <Map t={t} heat={clamp(t / 40)} kerala={0.35} />
    <Big x={1500} y={520} text="ചൂട്" size={92} color={SCH.live} t={t - 20} />
  </Schem>
);
export const C2: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="c2">
    <Map t={t} heat={1} kerala={0.35} />
    {[0, 1, 2, 3].map((i) => <Arrow key={i} x0={120 + i * 110} y0={1040 - i * 40} x1={590 + i * 56} y1={760 - i * 130} t={t - i * 7} dur={18} color="#6FD0E8" />)}
    <Big x={300} y={640} text="ഈർപ്പമുള്ള കാറ്റ്" size={62} color="#6FD0E8" t={t - 24} />
  </Schem>
);
export const C3: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="c3">
    <Ghats t={t} />
    <DrawOn d="M 120 660 Q 620 640 860 660 Q 1060 660 1190 430" t={t} dur={40} color="#6FD0E8" width={11} />
    <Arrow x0={1120} y0={560} x1={1230} y1={350} t={t - 34} dur={10} color="#6FD0E8" />
    {fig(PIP, 790, 790, 0.3, { yaw: -0.5, look: -0.6, expr: 'happy' }, 'rimR', 0)}
  </Schem>
);
export const C4: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="c4">
    <Ghats t={t} rain={1} />
    <Umbrella x={790} y={700} s={0.34} c="#1E1E2C" />
    {fig(PIP, 790, 790, 0.3, { yaw: -0.5, expr: 'happy' }, 'rimR', 0)}
  </Schem>
);
export const C5: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="c5">
    <Map t={t} heat={0.5} kerala={0.9} />
    {[0, 1, 2].map((i) => <DrawOn key={i} d={`M ${120 + i * 120} ${1040 - i * 34} Q ${560 + i * 70} ${820 - i * 80} ${330 + i * 66} ${420 - i * 120}`} t={t - i * 7} dur={30} color="#6FD0E8" width={9} />)}
    {[0, 1, 2].map((i) => <Arrow key={i} x0={370 + i * 60} y0={500 - i * 120} x1={320 + i * 66} y1={410 - i * 120} t={t - 28 - i * 7} dur={6} color="#6FD0E8" />)}
    <Tag x={1000} y={770} t={t - 40} text="✕" w={120} />
  </Schem>
);

// ============================================================ D. THE FORECAST
const Screen: React.FC<{ t: number; id: string; x: number; y: number; s: number; day: number; month: string; wilt: number }> = ({ t, id, x, y, s, day, month, wilt }) => (
  <TV x={x} y={y} s={s} id={id}>
    <rect width={760} height={430} fill="#1C3060" />
    <path d="M 0 90 L 760 40 L 760 340 L 0 340 Z" fill="#274784" />
    <g transform="translate(380 0)">
      <Fig look={SUIT} pose={{ x: 0, y: 270, scale: 0.62, yaw: 0.12, look: 0.1, tilt: wilt * 14, headTilt: wilt * 18, armR: { a: 40, b: -90 }, expr: wilt > 0.5 ? 'tired' : 'happy' }} rimId="rimR" shadow={0} />
      <Umbrella x={50 + wilt * 50} y={100 + wilt * 44} s={0.76} rot={wilt * 40} c="#3E3E52" />
      {wilt > 0.6 ? <Cobweb x={118} y={60} r={70} o={0.8} /> : null}
    </g>
    <g transform="translate(610 74)">
      <rect x={-92} y={-44} width={184} height={88} rx={8} fill="#F4EDDC" />
      <text textAnchor="middle" y={14} fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#1A1230">{month} {day}</text>
    </g>
    <NewsBar t={0} text="" /><text x={456} y={398} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={36} fill="#FFF">കാലവർഷം രണ്ട് ദിവസത്തിനകം</text>
  </TV>
);
export const D1: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1)}>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#3A3048" />
    <rect x={-100} y={760} width={2200} height={500} fill="#2A2234" />
    <rect x={420} y={690} width={1080} height={60} fill="#5A3E2C" stroke={INK} strokeWidth={5} />
    <rect x={1560} y={170} width={280} height={360} fill="#E8C98E" stroke={INK} strokeWidth={8} />
    <Glow x={1700} y={340} r={520} kind="warm" o={0.6} />
    <Screen t={t} id="d1" x={580} y={180} s={1} day={6} month="ജൂൺ" wilt={0} />
    <Glow x={960} y={420} r={720} kind="cool" o={0.45} />
    <LightVeil id="d1v" lights={[[960, 400, 560], [1700, 340, 300]]} o={0.32} />
    <Foreground blur={6}>
      <rect x={120} y={940} width={1680} height={260} rx={40} fill="#1A1422" />
      <circle cx={700} cy={850} r={118} fill="#191320" />
      <circle cx={1180} cy={850} r={118} fill="#191320" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={1090 + i * 30} cy={750 + (i % 2) * 26} r={46} fill="#191320" />)}
    </Foreground>
  </g>
);
export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / len);
  const dates: [string, number][] = [['ജൂൺ', 7], ['ജൂൺ', 13], ['ജൂൺ', 22], ['ജൂൺ', 29], ['ജൂലൈ', 6], ['ജൂലൈ', 15]];
  const [m, d] = dates[Math.min(5, Math.floor(p * 6))];
  return <g transform={camT(960, 540, 1)}><rect x={-100} y={-100} width={2200} height={1300} fill="#0C0C12" /><Screen t={t} id="d2" x={160} y={40} s={2.1} day={d} month={m} wilt={p} /></g>;
};

// ============================================================ E. THE FUN PART
const PERF: Record<string, P> = { happy: { expr: 'happy' } };
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 620], [len, 1120]]);
  return (
    <g transform={camT(960, 560, 1)}>
      <Land t={t} id="e1" dry={0.2} y={700} palms={[140, 1720]} />
      <Palm x={1400} y={720} s={0.85} t={t + 90} />
      <rect x={-3000} y={760} width={8000} height={120} fill="#C8AE82" />
      <Bag x={x - 34} y={720} s={0.7} />
      <Fig look={PIP} pose={walkPose(x, t * 0.55, 840, 0.72, { ...PERF.happy, look: 0.4 }, 1)} rimId="rimR" shadow={0.6} />
      <Fig look={MO} pose={walkPose(x + 180, t * 0.55 + 2, 840, 0.72, { ...PERF.happy, look: -0.3 }, 1)} rimId="rimR" shadow={0.6} />
    </g>
  );
};
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const t0 = len - 72; // the jump starts as the line ends, so it lands in the pause
  const up = Math.sin(clamp((t - t0) / 34) * Math.PI);
  const land = t > t0 + 34;
  return (
    <g transform={camT(960, 560, 1.6)}>
      <Land t={t + 200} id="e2" dry={0.25} y={640} palms={[1320]} />
      <rect x={-3000} y={700} width={8000} height={420} fill="#C8AE82" />
      <ellipse cx={980} cy={780} rx={170} ry={36} fill="#A88E64" />
      {fig(PIP, 660, 780, 0.8, { yaw: 0.6, look: 0.5, expr: land ? 'smug' : 'neutral' }, 'rimR', 0.5)}
      {fig(MO, 980, 790 - up * 190, 0.8, land ? { yaw: 0.1, armL: { a: 30, b: -10 }, armR: { a: 30, b: -10 }, expr: 'oops', squash: 0.1 } : { yaw: 0.3, armL: { a: 140, b: 0 }, armR: { a: 140, b: 0 }, legL: { a: 40, b: -60 }, legR: { a: -30, b: -50 }, expr: 'happy' }, 'rimR', land ? 0.5 : 0.2)}
      {land ? <g><CloudPuff x={880} y={780} s={1.1 + (t - t0 - 34) / 50} o={0.86} /><CloudPuff x={1090} y={770} s={1 + (t - t0 - 34) / 60} o={0.8} /></g> : null}
    </g>
  );
};
const Stumps: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{[-18, 0, 18].map((d) => <rect key={d} x={d - 4} y={-110} width={8} height={110} fill="#E9D8A8" stroke={INK} strokeWidth={2} />)}</g>
);
const Bat: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-9} y={-70} width={18} height={80} fill="#5A3E2C" stroke={INK} strokeWidth={4} />
    <rect x={-30} y={6} width={60} height={200} rx={12} fill="#E2C080" stroke={INK} strokeWidth={5} />
  </g>
);
export const E3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 0.98, 1.05))}>
    <Land t={t} id="e3" dry={0.45} y={620} sun={[960, 130, 130]} palms={[80, 1840]} />
    <rect x={500} y={660} width={920} height={300} fill="#C8AE82" opacity={0.7} />
    <Stumps x={1320} y={780} s={1} />
    <Stumps x={620} y={760} s={0.8} />
    {fig(PIP, 1240, 800, 0.7, { yaw: -0.6, look: -0.6, armL: { a: 64, b: -30 }, armR: { a: 64, b: -40 } }, 'rimR', 0.7)}
    <Bat x={1176} y={716} s={0.65} rot={18} />
    {fig(MO, 720, 780, 0.64, { yaw: 0.65, look: 0.5, armR: { a: 170, b: 0 }, armL: { a: 30, b: -40 }, legL: { a: 34, b: -10 }, legR: { a: -28, b: -30 }, expr: 'tired' }, 'rimR', 0.7)}
    <circle cx={kf(t, [[0, 810], [len, 1050]])} cy={kf(t, [[0, 500], [len * 0.7, 690], [len, 620]])} r={12} fill="#B02A2A" stroke={INK} strokeWidth={3} />
    <Foreground blur={6}>{Array.from({ length: 6 }).map((_, i) => <rect key={i} x={1660 + i * 44} y={520} width={18} height={560} fill="#1E1A28" />)}</Foreground>
  </g>
);
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 880, y: 744, scale: 0.9, spin: 88, yaw: 0.2, armL: { a: 100, b: -10 }, armR: { a: 60, b: -10 }, legL: { a: 10, b: 0 }, legR: { a: -6, b: 0 }, expr: 'dizzy' };
  const h = headAt(p);
  return (
    <g transform={camT(960, 640, push(t, len, 1.65, 1.8))}>
      <Land t={t + 80} id="e4" dry={0.5} y={560} sun={[1280, 240, 120]} hills={false} />
      <rect x={-3000} y={640} width={8000} height={700} fill="#C8AE82" />
      <Cracks x={560} y={760} w={760} h={100} c="#8A6E48" o={0.7} />
      <Fig look={MO} pose={p} rimId="rimR" shadow={0.3} />
      <DizzyStars x={h.x} y={h.y - 40} t={t} rx={80} ry={30} />
      {/* an egg, frying on the bat */}
      <g transform="translate(1210 762) rotate(82)"><Bat x={0} y={0} s={1.2} /></g>
      <ellipse cx={1120} cy={750} rx={66} ry={23} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      <ellipse cx={1120} cy={744} rx={23} ry={12} fill="#F1B93C" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${1090 + i * 28} ${702 - ((t + i * 11) % 30)} q 10 -14 0 -30`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.6} />)}
    </g>
  );
};
export const E5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(760, 540, 1.3)}>
    <Terr t={t} id="e5" />
    <Clothes t={t} />
    {fig(MOM, 780, 840, 1.0, { yaw: -0.5, look: -0.3, armL: { a: 158, b: 4 }, armR: { a: 150, b: 8 }, expr: 'happy' }, 'rimR', 0.4)}
    <rect x={610} y={380} width={120} height={170} fill="#8C6EB8" stroke={INK} strokeWidth={4} />
      </g>
);
export const E6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.1)}>
    <Terr t={t + 40} id="e6" />
    <Clothes t={t} />
    {/* the shirt, dried so stiff it stands up by itself */}
    <g transform={`translate(1240 830) rotate(${Math.sin(t / 7) * 1})`}>
      <ellipse cx={0} cy={6} rx={90} ry={12} fill="#000" opacity={0.3} />
      <path d="M -60 -220 L -130 -190 L -106 -120 L -62 -136 L -62 0 L 62 0 L 62 -136 L 106 -120 L 130 -190 L 60 -220 Q 0 -190 -60 -220 Z" fill="#8C6EB8" stroke={INK} strokeWidth={5} />
    </g>
    {fig(MOM, 780, 850, 0.92, { yaw: 0.3, look: 0.4, armL: { a: 150 + Math.sin(t / 5) * 14, b: 20 }, armR: { a: 150 - Math.sin(t / 5) * 14, b: 20 }, legL: { a: 18, b: -16 }, legR: { a: -14, b: -8 }, tilt: Math.sin(t / 5) * 6, expr: 'happy' }, 'rimR', 0.4)}
    <FloatLabel x={1240} y={560} t={(t % 40) - 2} text="♪" size={80} color="#FFE27A" />
    <Cat x={380} y={845} mood="alert" f={t + len} />
  </g>
);
export const E7: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(880, 460, 1.1)}>
    <Classroom t={t} id="e7" board={<g><Cloud x={720} y={350} s={0.5} /><path d="M 560 240 L 880 450 M 880 240 L 560 450" stroke="#E4544A" strokeWidth={14} strokeLinecap="round" /></g>} />
  </g>
);
export const E8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Blur t={t} id="e8" z={2} x={1200} y={500} veil={0.6} />
    <ScreenPhone x={880} y={540} s={1.36} rot={-4} id="e8">
      <rect x={-175} y={-340} width={350} height={78} fill="#2C4A86" />
      <text x={0} y={-288} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#FFF">ജില്ലാ കളക്ടർ</text>
      <g transform={`translate(0 -176) rotate(${t * 9})`}>{Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={Math.cos(i * 0.785) * 40} cy={Math.sin(i * 0.785) * 40} r={7} fill="#2C4A86" opacity={0.2 + i * 0.1} />)}</g>
      <rect x={-146} y={-90} width={292} height={150} rx={10} fill="#E4E8F0" />
      <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#1A1230">അവധി ഇല്ല</text>
      <rect x={-120} y={8} width={240} height={14} rx={6} fill="#C0C6D2" />
      <rect x={-146} y={90} width={292} height={150} rx={10} fill="#E4E8F0" />
      <text x={0} y={150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#1A1230">അവധി ഇല്ല</text>
      <rect x={-120} y={188} width={240} height={14} rx={6} fill="#C0C6D2" />
    </ScreenPhone>
    <Arm from={[1820, 1180]} to={[990, 420]} w={118} c="#4A5A3A" skin="#C08C68" />
    <Cobweb x={1130} y={250} r={260} o={0.75} />
  </g>
);
const Shop: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Land t={t} id={id} dry={0.5} y={700} palms={[60, 1880]} sun={[210, 150, 80]} />
    <rect x={-3000} y={760} width={8000} height={1000} fill="#6A6470" />
    <rect x={380} y={230} width={1160} height={560} fill="#8A7468" stroke={INK} strokeWidth={6} />
    <rect x={340} y={200} width={1240} height={70} fill="#7A2E2E" stroke={INK} strokeWidth={6} />
    <text x={960} y={254} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3">കുട മഹൽ</text>
    <rect x={440} y={300} width={1040} height={460} fill="#2C2432" />
    {Array.from({ length: 14 }).map((_, i) => <Umbrella key={i} x={490 + (i % 7) * 150} y={350 + Math.floor(i / 7) * 180} s={0.5} c={['#1E1E2C', '#7A2E4E', '#2E5C8A', '#2E7A4E'][i % 4]} closed />)}
    <path d="M 340 270 L 280 340 L 1640 340 L 1580 270 Z" fill="#B07E3E" stroke={INK} strokeWidth={5} />
    <Cobweb x={440} y={340} r={170} o={0.85} />
    <Cobweb x={1480} y={340} r={140} o={0.85} />
    <Cobweb x={1190} y={190} r={110} o={0.6} />
    <rect x={740} y={700} width={440} height={100} fill="#4A3A36" stroke={INK} strokeWidth={5} />
    {fig(SHOPKEEPER, 1040, 790, 0.72, { yaw: -0.3, headTilt: 14, armL: { a: 20, b: -80 }, armR: { a: 20, b: -80 }, expr: 'tired', blink: 1 }, 'rimR', 0.4)}
    <Umbrella x={1100} y={500} s={1} c="#1E1E2C" rot={8} />
  </g>
);
export const E9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, push(t, len, 0.96, 1.02))}>
    <Shop t={t} id="e9" />
    {fig(CROWD[1], kf(t, [[0, 120], [len, 420]]), 900, 0.7, walkPose(0, t * 0.5, 900, 0.7, {}, 1), 'rimR', 0.5)}
  </g>
);
export const E10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1040, 500, 2.6)}>
    <Shop t={t + 60} id="e10" />
    <Spider x={1016} y={kf(t, [[0, 400], [len, 505]])} top={300} s={0.9} />
  </g>
);

// ============================================================ F. THE COST
export const F1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 570, push(t, len, 1, 1.08))}>
    <Land t={t} id="f1" mode="dusk" dry={0.45} y={480} sun={[500, 370, 100]} palms={[120, 1830]} />
    <FlatBuilding x={1120} y={510} s={0.9} night />
    <path d="M -300 560 L 560 560 Q 640 720 720 830 L 1300 830 Q 1400 720 1460 560 L 2300 560 L 2300 1300 L -300 1300 Z" fill="#8A6A48" stroke={INK} strokeWidth={5} />
    <rect x={714} y={790} width={590} height={46} fill="#7E9CA0" stroke={INK} strokeWidth={3} />
    <rect x={714} y={790} width={590} height={8} fill="#F4C98C" opacity={0.75} />
    <rect x={600} y={718} width={820} height={7} fill="#5E4832" opacity={0.75} />
    <path d="M 640 690 L 1380 690" stroke="#5E4832" strokeWidth={6} opacity={0.5} />
    {fig(PIP, 1020, 826, 0.82, { yaw: -0.3, look: -0.4, headTilt: 12, expr: 'worried', armL: { a: 14, b: -10 }, armR: { a: 14, b: -10 } }, 'rimL', 0)}
    <rect x={930} y={792} width={190} height={44} fill="#7E9CA0" opacity={0.75} />
  </g>
);
export const F2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1110, 520, push(t, len, 1.9, 2.02))}>
    <Terr t={t} id="f2" night line={false} />
    {fig(PIP, 960, 840, 1, { yaw: 0.45, look: 0.65, headTilt: 5, expr: 'worried' }, 'rimBlue', 0)}
    <Foreground blur={10}><path d="M 560 760 L 720 680 L 700 860 Z" fill="#141018" /></Foreground>
  </g>
);
export const F3: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="f3">
    <RainCol t={t} level={kf(t, [[0, 0.2], [60, 2]])}>{fig(PIP, 1130, 960, 1.62, { yaw: 0.2, expr: 'worried', look: 0.1 }, 'rimR', 0)}</RainCol>
    <Big x={1680} y={330} text="2 മീറ്റർ" size={84} color={SCH.live} t={t - 40} />
  </Schem>
);
export const F4: React.FC<ShotProps> = ({ t }) => {
  const p: P = { x: 1130, y: feet(944, 1.62), scale: 1.62, yaw: 0.45, look: 0.3, headTilt: -10, armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 }, expr: 'shock' };
  const h = headAt(p);
  return (
    <Schem t={t} id="f4">
      <RainCol t={t} level={2}>
        <Fig look={PIP} pose={p} rimId="rimR" />
        <path d={`M ${h.x + 62} ${h.y + 26} L ${h.x + 76} ${h.y - 220} L ${h.x + 46} ${h.y - 220}`} stroke="#F1B93C" strokeWidth={14} fill="none" strokeLinecap="round" />
        <rect x={h.x - 76} y={h.y - 42} width={146} height={52} rx={18} fill="#2A2A3A" stroke="#F1B93C" strokeWidth={6} />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={h.x + 40 + i * 13} cy={h.y - 70 - ((t * 3 + i * 40) % 140)} r={7 + i} fill="none" stroke="#BFEFFF" strokeWidth={3} />)}
      </RainCol>
    </Schem>
  );
};
export const F5: React.FC<ShotProps> = ({ t }) => {
  const m = [18, 26, 44, 120, 240, 680, 660, 420, 260, 300, 160, 40];
  const n = ['ജ', 'ഫെ', 'മാ', 'ഏ', 'മേ', 'ജൂ', 'ജൂ', 'ഓ', 'സെ', 'ഒ', 'ന', 'ഡി'];
  return (
    <Schem t={t} id="f5">
      {m.map((v, i) => {
        const hot = i >= 5 && i <= 8;
        const h = v * 1.05 * clamp((t - i * 2) / 16);
        return (
          <g key={i}>
            <rect x={320 + i * 108} y={900 - h} width={78} height={h} fill={hot ? '#6FD0E8' : SCH.dim} opacity={hot ? 1 : 0.6} />
            <text x={359 + i * 108} y={960} textAnchor="middle" fontFamily={FONT.title} fontSize={38} fill={SCH.line}>{n[i]}</text>
          </g>
        );
      })}
      <Big x={1450} y={300} text="⅔" size={200} color="#6FD0E8" t={t - 26} />
      <Big x={1450} y={380} text="ഈ നാല് മാസം" size={58} t={t - 30} />
    </Schem>
  );
};
export const F6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 0.98, 1.04))}>
    <Tabletop edge={1300} />
    <Glow x={260} y={140} r={700} kind="warm" o={0.45} />
    <Passbook t={t} rows={[['ഈ നാല് മാസം', '+ 2,018 mm']]} />
    <Big x={960} y={700} text="ഒരു കൊല്ലത്തെ നിക്ഷേപം" size={60} color="#2A4A3A" />
  </g>
);
export const F7: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="f7">
    <Big x={960} y={190} text="മഴ അക്കൗണ്ട്" size={90} color="#6FD0E8" t={t} />
    {[420, 960, 1500].map((x, i) => <Arrow key={i} x0={960} y0={250} x1={x} y1={470} t={t - 8 - i * 6} dur={12} color="#6FD0E8" bend={0.05} />)}
    <g transform="translate(420 680) scale(0.76)"><Well x={0} y={0} s={1} /></g>
    <Big x={420} y={940} text="കിണർ" size={58} t={t - 16} />
    <path d="M 760 560 Q 860 640 960 620 T 1160 700" stroke="#6FD0E8" strokeWidth={36} fill="none" strokeLinecap="round" />
    <Big x={960} y={940} text="പുഴ" size={58} t={t - 22} />
    <PlantIcon x={1500} y={650} kind="dam" on={1} t={t} s={2.1} />
    <Big x={1500} y={940} text="ഡാം" size={58} t={t - 28} />
  </Schem>
);
export const F8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1.16, 1.24))}>
    <Tabletop edge={1300} />
    <Glow x={260} y={140} r={700} kind="warm" o={0.32} />
    <Passbook t={t} rows={[['ഈ നാല് മാസം', '0 mm']]} live={0} />
    {[0, 1, 2, 3].map((i) => <Cobweb key={i} x={1460} y={124} r={240} o={0.1 + 0.16 * i} />)}
  </g>
);
export const F9: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="f9">
    <g transform="translate(-1000 -1320) scale(2.1)"><path d={PENINSULA} fill="#1E3048" stroke={SCH.line} strokeWidth={3} /><path d={KERALA} fill="#3A2A20" stroke={SCH.live} strokeWidth={2.5} /></g>
    {Array.from({ length: 14 }).map((_, i) => {
      const u = i / 13;
      return <circle key={i} cx={606 + u * 230 + (i % 2) * 22} cy={40 + u * 620 + 0} r={clamp((t - i * 3) / 5) * 15} fill={SCH.live} />;
    })}
    <SchLabel x={1500} y={230} t={t - 8} text="2016" size={110} />
    <Big x={1500} y={380} text="മഴ −34%" size={84} color={SCH.live} t={t - 18} />
    <Big x={1500} y={490} text="14 ജില്ലകളും വരൾച്ചയിൽ" size={50} t={t - 48} />
  </Schem>
);
const Sea: React.FC<{ t: number; up: number }> = ({ t, up }) => (
  <g>
    <rect x={-100} y={-100} width={2200} height={380} fill="#1A2C48" />
    <rect x={-100} y={280} width={1500} height={900} fill="#1C6E9A" />
    <path d="M 1300 280 L 1500 280 L 1660 620 L 1800 1180 L 2100 1180 L 2100 -100 L 1500 -100 L 1440 280 Z" fill="#6A5038" />
    <path d={`M -100 ${1180} L -100 ${880 - up * 60} Q 700 ${820 - up * 60} 1300 ${420} L 1560 ${640} L 1660 1180 Z`} fill="#124466" opacity={0.95} />
    {[0, 1, 2, 3].map((i) => <Arrow key={i} x0={560 + i * 170} y0={1000 - i * 40} x1={1000 + i * 90} y1={560 + i * 20 - i * 60} t={t - i * 6} dur={20} color="#6FD0E8" bend={0.25} />)}
    <Arrow x0={1400} y0={190} x1={560} y1={190} t={t - 6} dur={16} color="#F6EFE3" bend={0.04} />
    <Big x={300} y={180} text="കാറ്റ്" size={62} t={t - 18} />
    <Big x={420} y={1000} text="തണുത്ത വെള്ളം" size={58} color="#6FD0E8" t={t - 22} />
  </g>
);
export const F10: React.FC<ShotProps> = ({ t }) => <Schem t={t} id="f10"><Sea t={t} up={clamp(t / 50)} /></Schem>;
export const F11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1, 1.06))}>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#1C6E9A" />
    <Glow x={1300} y={-40} r={900} kind="warm" o={0.5} />
    {Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={rnd(2, i) * 1920} cy={rnd(3, i) * 1080 + Math.sin(t / 12 + i) * 8} r={3 + rnd(4, i) * 6} fill="#BFF0B0" opacity={0.75} />)}
    {Array.from({ length: 10 }).map((_, i) => <Fish key={i} x={260 + rnd(6, i) * 1400 + ((t * 2) % 90)} y={200 + rnd(7, i) * 700} s={1.1 + rnd(8, i) * 0.9} c="#C8D8E4" flip={i % 3 === 0} />)}
  </g>
);
const Market: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Land t={t} id={id} mode="dusk" dry={0.7} y={600} sun={[1580, 400, 90]} hills={false} palms={[1880]} />
    <rect x={-3000} y={640} width={8000} height={1000} fill="#6A5C58" />
    <rect x={220} y={200} width={36} height={560} fill="#3A2C2A" />
    <rect x={1490} y={200} width={36} height={560} fill="#3A2C2A" />
    <path d="M 120 240 L 1620 240 L 1700 150 L 200 150 Z" fill="#2E5C8A" stroke={INK} strokeWidth={5} />
    <rect x={250} y={660} width={1250} height={150} fill="#5A3E2C" stroke={INK} strokeWidth={6} />
    <rect x={250} y={640} width={1250} height={30} fill="#8A6A4C" stroke={INK} strokeWidth={5} />
  </g>
);
export const F12: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(860, 580, 1.42)}>
    <Market t={t} id="f12" />
    {fig(FISHMAN, 620, 720, 0.88, { yaw: 0.35, look: 0.5, headTilt: 12, expr: 'tired', armL: { a: 18, b: -8 }, armR: { a: 18, b: -8 } }, 'rimR', 0)}
    <rect x={250} y={660} width={1250} height={150} fill="#5A3E2C" stroke={INK} strokeWidth={6} />
    <rect x={250} y={640} width={1250} height={30} fill="#8A6A4C" stroke={INK} strokeWidth={5} />
    <Basket x={880} y={600} s={1.1} fish={3} />
    <Cat x={1160} y={636} mood="alert" f={t} />
  </g>
);
const Dam: React.FC<{ t: number; id: string; level: number }> = ({ t, id, level }) => {
  const y = 760 + (1 - level) * 240;
  return (
    <g>
      <Land t={t} id={id} mode="haze" dry={0.75} y={560} sun={[420, 150, 80]} />
      <path d="M -400 1200 L -400 560 L 460 520 L 620 1000 L 1320 1000 L 1480 520 L 2320 560 L 2320 1200 Z" fill="#7E6A52" stroke={INK} strokeWidth={5} />
      <path d={`M 500 620 Q 960 ${760} 1440 620 L 1440 1040 L 500 1040 Z`} fill="#BEB8A8" stroke={INK} strokeWidth={6} />
      {[680, 760, 840].map((yy) => <path key={yy} d={`M 520 ${yy - 60} Q 960 ${yy + 80} 1420 ${yy - 60}`} stroke="#A49E8E" strokeWidth={5} fill="none" />)}
      <rect x={-400} y={y} width={2800} height={900} fill="#3E7C8A" />
      <rect x={-400} y={y} width={2800} height={7} fill="#BFEFFF" opacity={0.75} />
      <rect x={-400} y={700} width={2800} height={Math.max(0, y - 700)} fill="#C9BDA4" opacity={0.45} />
    </g>
  );
};
export const F13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 620, push(t, len, 0.9, 1))}><Dam t={t} id="f13" level={kf(t, [[0, 0.75], [len, 0.25]])} /></g>
    <Gauge x={1400} y={110} p={kf(t, [[0, 0.72], [len, 0.22]])} label="IDUKKI" danger={0.2} />
  </g>
);
export const F14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(760, 840, push(t, len, 1.5, 1.6))}>
    <Dam t={t + 90} id="f14" level={0.14} />
    <rect x={-400} y={940} width={2800} height={300} fill="#A8927A" />
    <Cracks x={200} y={950} w={1100} h={150} />
    <g transform="rotate(-7 700 960)"><Boat x={700} y={950} s={1.1} t={0} /></g>
    {/* a pylon with nothing to carry */}
    <path d="M 1120 1000 L 1180 560 L 1240 1000 M 1140 840 L 1220 840 M 1100 620 L 1260 620 M 1120 690 L 1240 690" stroke="#3A3A48" strokeWidth={8} fill="none" />
  </g>
);
const Candle: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-9} y={-72} width={18} height={72} fill="#F4EDDC" stroke={INK} strokeWidth={3} />
    <ellipse cx={Math.sin(t / 3) * 2} cy={-92} rx={10} ry={22} fill="#FFD27E" />
    <ellipse cx={0} cy={-86} rx={5} ry={11} fill="#FFFFFF" />
  </g>
);
const Blackout: React.FC<{ t: number; id: string; children?: React.ReactNode }> = ({ t, id, children }) => {
  const c = islandTop(0.5, 0.2);
  return (
    <g>
      <Kitchen t={t} id={id} veil={0.84} />
      <Fan x={960} y={250} s={0.8} spin={0} />
      {children}
      <KitchenIsland stools={false} />
      <Candle x={c.x} y={c.y} t={t} s={0.9} />
      <Glow x={c.x} y={c.y - 70} r={500} kind="warm" o={0.85} />
    </g>
  );
};
export const F15: React.FC<ShotProps> = ({ t, len }) => {
  const a = stand(KITCHEN, 0.32, 0.4);
  const b = stand(KITCHEN, 0.68, 0.4);
  const on = t < len * 0.18;
  return (
    <g transform={camT(960, 590, 1.2)}>
      <Blackout t={t} id="f15">
        <Fig look={SIS} pose={{ ...a, scale: a.scale * 0.72, y: a.y + 26, yaw: 0.5, look: 0.4, expr: 'worried' }} rimId="rimR" />
        <Fig look={MOM} pose={{ ...b, yaw: -0.5, look: -0.4, expr: 'tired' }} rimId="rimL" />
      </Blackout>
      {on ? <rect x={-100} y={-100} width={2200} height={1300} fill="#FFE2A8" opacity={0.2} /> : null}
    </g>
  );
};
export const F16: React.FC<ShotProps> = ({ t }) => {
  const a = stand(KITCHEN, 0.44, 0.4);
  const p: P = { ...a, yaw: 0.25, look: 0.4, headTilt: -16, armL: { a: 14, b: -10 }, armR: { a: 12, b: -8 }, expr: 'tired' };
  const h = headAt(p);
  return (
    <g transform={camT(h.x + 90, h.y - 20, 2.2)}>
      <Blackout t={t} id="f16"><Fig look={MO} pose={p} rimId="rimR" /></Blackout>
      <Fan x={h.x + 230} y={h.y - 150} s={0.8} spin={0} />
      <Arm from={[h.x + 40, h.y + 300]} to={[h.x + 150, h.y - 34]} w={30} c="#5A6A3A" skin="#C08C68" />
      <SteelPlate x={h.x + 170} y={h.y - 66 + Math.sin(t) * 7} s={0.8} rot={Math.sin(t) * 16} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${h.x + 210 + i * 12} ${h.y - 86 - i * 20} q 26 -12 42 2`} stroke="#F6EFE3" strokeWidth={4} fill="none" opacity={0.5} />)}
    </g>
  );
};
const List: React.FC<{ x: number; y: number; s?: number; struck: number }> = ({ x, y, s = 1, struck }) => {
  const items = ['അവിയൽ', 'തോരൻ', 'പച്ചടി', 'കിച്ചടി', 'പായസം', 'ചോറ്'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-150} y={-230} width={300} height={460} fill="#F4EDDC" stroke={INK} strokeWidth={5} />
      {items.map((it, i) => (
        <g key={i}>
          <text x={0} y={-160 + i * 68} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={40} fill={INK}>{it}</text>
          {i < struck ? <line x1={-110} x2={110} y1={-172 + i * 68} y2={-172 + i * 68} stroke="#C2312A" strokeWidth={8} /> : null}
        </g>
      ))}
    </g>
  );
};
export const F17: React.FC<ShotProps> = ({ t, len }) => {
  const a = stand(KITCHEN, 0.5, 0.4);
  const flower = (r: number, c: string) => <ellipse cx={1490} cy={950} rx={r} ry={r * 0.42} fill={c} stroke={INK} strokeWidth={2} />;
  return (
    <g transform={camT(960, 610, push(t, len, 1.02, 1.08))}>
      <Kitchen t={t} id="f17" veil={0.4} />
      <Fig look={DAD} pose={{ ...a, yaw: 0, look: -0.1, headTilt: 7, expr: 'tired' }} rimId="rimR" />
      <KitchenIsland stools={false} />
      {flower(170, '#D9534F')}{flower(126, '#F1B93C')}{flower(80, '#F6EFE3')}{flower(36, '#D9534F')}
    </g>
  );
};
const PriceTag: React.FC<{ x: number; t: number; text: string; icon: React.ReactNode }> = ({ x, t, text, icon }) => (
  <g>
    <g transform={`translate(${x} 620)`}>{icon}</g>
    <Big x={x} y={880} text={text} size={70} t={t} color="#F6EFE3" />
    {t > 6 ? <g transform={`translate(${x} ${300 - clamp(t / 40) * 60})`}><path d="M 0 -80 L 70 20 L 26 20 L 26 100 L -26 100 L -26 20 L -70 20 Z" fill="#E4544A" stroke={INK} strokeWidth={5} /></g> : null}
  </g>
);
export const F18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Tabletop edge={1300} />
    <Glow x={960} y={120} r={900} kind="warm" o={0.42} />
    <PriceTag x={400} t={t} text="അരി" icon={<g><path d="M -120 120 L -100 -130 L 100 -130 L 120 120 Z" fill="#E9DEC4" stroke={INK} strokeWidth={6} /><ellipse cx={0} cy={-128} rx={100} ry={22} fill="#F6EFE3" stroke={INK} strokeWidth={5} /></g>} />
    <PriceTag x={960} t={t - 22} text="പച്ചക്കറി" icon={<g><ellipse cx={-54} cy={30} rx={70} ry={60} fill="#7A2E5E" stroke={INK} strokeWidth={6} /><circle cx={70} cy={30} r={70} fill="#D9534F" stroke={INK} strokeWidth={6} /><path d="M -120 -40 Q -20 -130 110 -60" stroke="#3E8C4E" strokeWidth={24} fill="none" strokeLinecap="round" /></g>} />
    <PriceTag x={1520} t={t - 44} text="വാഴയില" icon={<path d="M -150 110 Q -130 -130 160 -120 Q 170 80 -150 110 Z" fill="#3E8C4E" stroke={INK} strokeWidth={6} />} />
  </g>
);
export const F19: React.FC<ShotProps> = ({ t, len }) => {
  const a = stand(KITCHEN, 0.5, 0.4);
  const p: P = { ...a, yaw: 0.28, look: 0.9, headTilt: 12, expr: 'tired' };
  const h = headAt(p);
  return (
    <g transform={camT(h.x + 150, h.y + 110, push(t, len, 2.1, 2.3))}>
      <Kitchen t={t} id="f19" veil={0.5} />
      <Fig look={DAD} pose={p} rimId="rimR" />
      <KitchenIsland stools={false} />
      <List x={h.x + 320} y={h.y + 200} s={0.8} struck={Math.min(5, Math.floor(t / 22) + 1)} />
      <Arm from={[h.x + 520, h.y + 500]} to={[h.x + 380, h.y + 340]} w={30} c="#6E86A8" skin="#B98562" />
    </g>
  );
};
export const F20: React.FC<ShotProps> = ({ t }) => {
  const k = clamp((t - 12) / 8);
  return (
    <g>
      <Tabletop edge={1300} />
      <Glow x={1500} y={150} r={760} kind="warm" o={0.4} />
      <path d="M 260 200 Q 760 60 1760 150 Q 1780 620 1660 910 Q 800 1000 220 880 Q 170 500 260 200 Z" fill="#3E8C4E" stroke={INK} strokeWidth={6} />
      <path d="M 240 540 Q 900 500 1740 540" stroke="#2E6A3A" strokeWidth={12} fill="none" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${320 + i * 112} 530 Q ${370 + i * 112} ${i % 2 ? 300 : 760} ${420 + i * 112} ${i % 2 ? 200 : 880}`} stroke="#2E6A3A" strokeWidth={4} fill="none" opacity={0.6} />)}
      <ellipse cx={920} cy={590} rx={210} ry={100} fill="#F4EDDC" stroke={INK} strokeWidth={5} />
      {[0, 1, 2, 3].map((i) => {
        const a = (i * 90 + 45) * (Math.PI / 180);
        return (
          <g key={i} transform={`translate(${1320 + Math.cos(a) * 38 * k} ${500 + Math.sin(a) * 38 * k})`}>
            <path d={`M 0 0 L ${Math.cos(a - 0.78) * 120} ${Math.sin(a - 0.78) * 120} A 120 120 0 0 1 ${Math.cos(a + 0.78) * 120} ${Math.sin(a + 0.78) * 120} Z`} fill="#EBD08A" stroke={INK} strokeWidth={4} />
          </g>
        );
      })}
      <Arm from={[1930, 1100]} to={[1530, 680]} w={110} c="#6E86A8" skin="#B98562" />
    </g>
  );
};
export const F21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 620, push(t, len, 1.08, 1))}>
    <Land t={t} id="f21" dry={1} y={520} sun={[1500, 170, 90]} palms={[1800]} mode="haze" />
    <Cracks x={-260} y={570} w={2440} h={160} />
    <Cracks x={-300} y={690} w={2500} h={230} seed={9} />
    <Cracks x={-300} y={840} w={2500} h={340} seed={13} />
    {[-80, 180, 420].map((x, i) => <path key={i} d={`M ${x} 650 l 8 -56 M ${x + 20} 652 l 4 -46 M ${x + 40} 650 l -6 -42`} stroke="#A68A5A" strokeWidth={6} fill="none" />)}
    <g transform="translate(1020 640)">
      <line x1={0} y1={0} x2={0} y2={-230} stroke="#4A3224" strokeWidth={14} />
      <line x1={-110} y1={-170} x2={110} y2={-170} stroke="#4A3224" strokeWidth={12} />
      <circle cx={0} cy={-260} r={38} fill="#C8A87E" stroke={INK} strokeWidth={5} />
      <path d="M -60 -170 L 60 -170 L 44 -60 L -44 -60 Z" fill="#6E5A4E" stroke={INK} strokeWidth={4} />
    </g>
  </g>
);
const Crop: React.FC<{ t: number; id: string; kind: 'pepper' | 'cardamom' }> = ({ t, id, kind }) => (
  <g transform={camT(960, 540, 1.04)}>
    <Land t={t} id={id} mode="haze" dry={1} y={840} sun={[300, 200, 80]} hills={kind === 'pepper'} />
    {kind === 'pepper' ? (
      <g>
        <rect x={830} y={-40} width={230} height={1000} fill="#4E3A2C" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <path d={`M ${845 + (i % 2) * 190} ${40 + i * 85} Q ${960} ${80 + i * 85} ${1045 - (i % 2) * 190} ${120 + i * 85}`} stroke="#6E5038" strokeWidth={13} fill="none" />
            <path d={`M ${i % 2 ? 840 : 1050} ${70 + i * 85} q ${i % 2 ? -90 : 90} 18 ${i % 2 ? -110 : 110} 96`} stroke="#8A6E4E" strokeWidth={6} fill="none" />
            <ellipse cx={i % 2 ? 730 : 1160} cy={170 + i * 85} rx={13} ry={36} fill="#3A2A1E" transform={`rotate(${i % 2 ? 16 : -16} ${i % 2 ? 730 : 1160} ${170 + i * 85})`} />
          </g>
        ))}
      </g>
    ) : (
      Array.from({ length: 34 }).map((_, i) => {
        const x = 110 + (i % 12) * 150 + rnd(3, i) * 60;
        const l = 200 + rnd(4, i) * 240;
        return <path key={i} d={`M ${x} 900 Q ${x + (rnd(5, i) - 0.3) * 160} ${900 - l} ${x + (rnd(6, i) - 0.3) * 330} ${900 - l * 0.6}`} stroke={mix('#7A5A34', '#3E2A1E', rnd(7, i))} strokeWidth={15 + rnd(8, i) * 9} fill="none" strokeLinecap="round" />;
      })
    )}
    <Foreground blur={10}><path d="M -40 1100 L -40 780 Q 240 860 380 1100 Z" fill="#241A16" /></Foreground>
  </g>
);
export const F22: React.FC<ShotProps> = ({ t }) => <Crop t={t} id="f22" kind="pepper" />;
export const F23: React.FC<ShotProps> = ({ t }) => <Crop t={t} id="f23" kind="cardamom" />;
export const F24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 590, push(t, len, 1, 1.07))}>
    <Land t={t} id="f24" mode="dusk" dry={0.9} y={560} sun={[1420, 420, 110]} />
    {[60, 300, 1680, 1860].map((x, i) => <path key={i} d={`M ${x} 640 L ${x + 10} 240 M ${x + 8} 380 L ${x + 90} 280 M ${x + 6} 420 L ${x - 70} 320`} stroke="#3A2C28" strokeWidth={18 - i * 2} fill="none" strokeLinecap="round" />)}
    <ellipse cx={940} cy={800} rx={640} ry={160} fill="#8A6E4C" stroke="#5E4832" strokeWidth={6} />
    <ellipse cx={960} cy={830} rx={200} ry={40} fill="#5A6E62" />
    <Cracks x={420} y={700} w={1000} h={180} />
    <Tusker x={1160} y={760} s={0.8} t={t} />
    <Tusker x={700} y={720} s={0.44} t={t + 30} flip c="#5E5868" />
  </g>
);
export const F25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 650, push(t, len, 0.98, 1.05))}>
    <Street t={t + 40} id="f25" />
    <Tanker x={1510} y={900} s={0.72} t={0} />
    <Queue x={1040} y={900} n={4} gap={120} s={0.72} looks={[CROWD[0], MOM, CROWD[3], CROWD[2]]} t={t} />
    <Tusker x={320} y={910} s={0.72} t={t} flip pot={false} />
    <Kudam x={590} y={892} s={0.72} />
    <Foreground blur={10}><rect x={1820} y={700} width={360} height={500} fill="#1A1422" /></Foreground>
  </g>
);
const Lorry: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={430} ry={22} fill="#000" opacity={0.3} />
    <rect x={-400} y={-120} width={640} height={40} fill="#2A2A36" stroke={INK} strokeWidth={5} />
    <rect x={-400} y={-250} width={590} height={130} fill="#8A4A32" stroke={INK} strokeWidth={6} />
    <rect x={-350} y={-340} width={200} height={90} fill="#3E6E8C" stroke={INK} strokeWidth={5} />
    <rect x={-130} y={-380} width={120} height={130} fill="#6E5A4E" stroke={INK} strokeWidth={5} />
    <circle cx={90} cy={-310} r={60} fill="#D9A23E" stroke={INK} strokeWidth={5} />
    <path d="M 205 -280 L 330 -280 Q 410 -270 420 -190 L 424 -80 L 205 -80 Z" fill="#2E7A4E" stroke={INK} strokeWidth={6} />
    <path d="M 240 -252 L 330 -252 Q 372 -242 382 -196 L 240 -196 Z" fill="#BFE3F2" stroke={INK} strokeWidth={5} />
    {[-280, -130, 310].map((wx) => <g key={wx}><circle cx={wx} cy={-46} r={50} fill="#17141E" stroke={INK} strokeWidth={5} /><circle cx={wx} cy={-46} r={21} fill="#8A8A96" /></g>)}
  </g>
);
export const F26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1, 1.05))}>
    <Land t={t} id="f26" mode="dusk" dry={0.8} y={640} sun={[1560, 450, 110]} palms={[80, 1880]} />
    <KHouse x={380} y={700} s={0.6} lit={0} />
    <rect x={-3000} y={740} width={8000} height={600} fill="#7A6A58" />
    <Lorry x={1200} y={870} s={0.86} />
    {fig(DAD, 620, 890, 0.72, { yaw: 0.6, look: 0.5, armL: { a: 80, b: -30 }, armR: { a: 80, b: -30 }, expr: 'tired' }, 'rimR', 0.5)}
    <rect x={646} y={660} width={130} height={110} fill="#B8894E" stroke={INK} strokeWidth={5} />
    {fig(MO, 340, 900, 0.72, { yaw: 0.5, look: 0.6, headTilt: 12, expr: 'tired' }, 'rimR', 0.5)}
  </g>
);
export const F27: React.FC<ShotProps> = ({ t }) => {
  const mo: P = { x: 1160, y: feet(1000, 1.2), scale: 1.2, yaw: -0.55, look: -0.7, headTilt: 8, armL: { a: 70, b: -14 }, expr: 'tired' };
  const pip: P = { x: 720, y: feet(1000, 1.2), scale: 1.2, yaw: 0.55, look: 0.7, armR: { a: 66, b: -14 }, expr: 'worried' };
  return (
    <g transform={camT(940, 470, 1.55)}>
      <Land t={t + 30} id="f27" mode="dusk" dry={0.8} y={640} sun={[1000, 470, 120]} />
      <Fig look={PIP} pose={pip} rimId="rimR" />
      <Fig look={MO} pose={mo} rimId="rimL" />
      <Bat x={960} y={776} s={0.9} rot={84} />
      <Foreground blur={10}><path d="M 1320 1100 L 1420 620 L 1600 620 L 1600 1100 Z" fill="#141018" /></Foreground>
    </g>
  );
};
export const F28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1)}>
    <Land t={t + 60} id="f28" mode="dusk" dry={0.85} y={640} sun={[1420, 520, 100]} palms={[110, 1840]} />
    <rect x={-3000} y={740} width={8000} height={600} fill="#7A6A58" />
    <Lorry x={kf(t, [[0, 1200], [len, 1450]])} y={720} s={0.26} />
    {fig(PIP, 620, 880, 0.72, { yaw: 0.4, look: 0.7, armL: { a: 10, b: -8 }, expr: 'tired' }, 'rimR', 0.7)}
    <Bat x={536} y={716} s={0.62} rot={4} />
  </g>
);
export const F29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 590, push(t, len, 1, 1.06))}>
    <Yard t={t} id="f29" mode="grey" well={false} />
    {[300, 520, 1040, 1480].map((x, i) => fig(CROWD[i], x, 860 + (i % 2) * 20, 0.66, { yaw: 0.2, look: 0.2, headTilt: -16, armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 }, expr: 'happy' }, 'rimR', 0.4))}
    {fig(PIP, 780, 900, 0.74, { yaw: 0.25, headTilt: -16, armL: { a: 110, b: 0 }, armR: { a: 110, b: 0 }, expr: 'happy' }, 'rimR', 0.4)}
    <Rain t={t} o={0.34} n={80} />
  </g>
);
export const F30: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1, 1.1))}>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#A88E64" />
    <Glow x={400} y={100} r={900} kind="warm" o={0.25} />
    <Cracks x={0} y={80} w={1800} h={900} seed={6} c="#2A1C12" />
    <Cracks x={0} y={120} w={1800} h={900} seed={15} c="#2A1C12" />
    {Array.from({ length: 16 }).map((_, i) => {
      const ph = (t + i * 13) % 60;
      return <ellipse key={i} cx={200 + rnd(2, i) * 1500} cy={150 + rnd(3, i) * 800} rx={36 + ph * 0.5} ry={18 + ph * 0.25} fill="#5E4830" opacity={Math.max(0, 1 - ph / 42)} />;
    })}
    <Rain t={t} o={0.3} n={50} slant={0.1} />
  </g>
);

// ============================================================ G. THE SALT
const River: React.FC<{ t: number; p: number }> = ({ t, p }) => {
  const nose = 160 + p * 1010;
  return (
    <g>
      <rect x={-100} y={-100} width={2200} height={1300} fill="#1C2C42" />
      <rect x={-100} y={560} width={2200} height={560} fill="#2E6A8C" />
      <path d={`M -100 1120 L -100 640 Q ${nose * 0.6} 680 ${nose} 1020 L ${nose + 90} 1120 Z`} fill={SCH.live} opacity={0.75} />
      {[0, 1, 2].map((i) => <path key={i} d={`M -100 ${600 + i * 16} Q 700 ${590 + i * 14 + Math.sin(t / 10) * 5} 1800 ${600 + i * 16}`} stroke="#8CC4D8" strokeWidth={3} fill="none" opacity={0.5} />)}
      <path d="M -100 1120 L 2100 1120 L 2100 1040 Q 1100 1070 -100 1090 Z" fill="#5E4A38" />
      <path d="M 1500 560 L 1560 330 L 1760 330 L 1800 560 Z" fill="#54606E" stroke={SCH.line} strokeWidth={4} />
      <rect x={1560} y={560} width={26} height={270} fill="#8A96A6" />
      <Big x={1660} y={290} text="ആലുവ" size={62} t={99} />
      <Big x={220} y={520} text="കടൽ" size={68} color={SCH.live} t={99} />
      <Big x={1100} y={520} text="പെരിയാർ" size={68} color="#BFEFFF" t={99} />
    </g>
  );
};
export const G1: React.FC<ShotProps> = ({ t, len }) => <Schem t={t} id="g1"><River t={t} p={kf(t, [[0, 0.1], [len, 0.75]])} /></Schem>;
export const G2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1, 1.05))}>
    <Land t={t} id="g2" mode="dusk" dry={0.7} y={640} sun={[1660, 420, 100]} palms={[140]} hills={false} />
    <Water t={t} y={760} />
    {[1040, 1280, 1520, 1760].map((x, i) => <FlatBuilding key={x} x={x} y={700} s={0.78 + (i % 2) * 0.1} night={false} />)}
    <rect x={160} y={560} width={260} height={190} fill="#5A6470" stroke={INK} strokeWidth={6} />
    <path d="M 420 690 L 1560 690" stroke="#3A4C60" strokeWidth={30} />
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={460 + ((t * 7 + i * 190) % 1090)} cy={690} r={10} fill="#BFEFFF" />)}
  </g>
);
export const G3: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="g3"><g transform="translate(0 130)">
    <g transform="translate(600 300)">
      <rect x={-220} y={-160} width={440} height={330} rx={16} fill="#2A3C54" stroke={SCH.line} strokeWidth={5} />
      <circle cx={0} cy={0} r={118} fill="#16243A" stroke={SCH.line} strokeWidth={5} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * 1.57 + clamp(t / 60) * 3) * 100} y2={Math.sin(i * 1.57 + clamp(t / 60) * 3) * 100} stroke={SCH.line} strokeWidth={10} />)}
    </g>
    <path d="M 820 300 L 1100 300 M 820 400 L 1100 400" stroke={SCH.dim} strokeWidth={8} />
    <CountUp x={1400} y={360} t={t} to={1000} dur={60} size={150} color={SCH.live} suffix="" />
    <SchLabel x={1400} y={450} t={t - 10} text="ppm SALT" size={40} />
    <Tag x={600} y={700} t={t - 56} text="STOP" mark="x" w={260} />
    <SchLabel x={1400} y={620} t={t - 20} text="LIMIT 200" size={40} color={SCH.dim} />
    <Big x={1400} y={120} text="2016 നവംബർ" size={60} t={t - 72} color="#FFD27E" />
  </g></Schem>
);
export const G4: React.FC<ShotProps> = ({ t, len }) => <TapMacro t={t + 400} id="g4" salt={1} len={len} />;

// ============================================================ H. THE WELL
export const H1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 570, push(t, len, 1, 1.05))}>
    <Yard t={t} id="h1" />
    <BlackCar x={-900} y={0} s={0} />
    {fig(MOM, 860, 880, 0.64, { yaw: 0.6, expr: 'tired' }, 'rimR', 0.5)}
    {fig(PIP, 1010, 890, 0.66, { yaw: 0.6, look: 0.4, expr: 'worried' }, 'rimR', 0.5)}
    {fig(SIS, 1120, 880, 0.48, { yaw: 0.6 }, 'rimR', 0.5)}
    <Kudam x={760} y={870} s={0.5} />
  </g>
);
export const H2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(760, 500, push(t, len, 1.4, 1.52))}>
    <Yard t={t + 30} id="h2" well={false} />
    <Well x={640} y={560} s={1.25} />
    {fig(GRAN, 1000, 800, 0.86, { yaw: -0.5, look: -0.5, armL: { a: 76, b: -26 }, expr: 'neutral' }, 'rimL', 0.4)}
    <Foreground blur={10}><path d="M -40 1100 L -40 500 Q 160 700 280 1100 Z" fill="#141018" /></Foreground>
  </g>
);
export const H3: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="h3">
    {Array.from({ length: 140 }).map((_, i) => {
      const x = 170 + (i % 20) * 80;
      const y = 200 + Math.floor(i / 20) * 96;
      const dead = clamp((t - 30 - rnd(3, i) * 70) / 6);
      return <circle key={i} cx={x} cy={y} r={25} fill={mix('#3E9CC8', '#5E4A38', dead)} stroke={SCH.line} strokeWidth={3} opacity={i === 76 ? 1 : 0.9} />;
    })}
  </Schem>
);
export const H4: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#7A6242" />
    <circle cx={960} cy={540} r={500} fill="#A2583E" stroke={INK} strokeWidth={8} />
    <circle cx={960} cy={540} r={400} fill="#0A070C" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={960} cy={540} r={330 - i * 62} fill="none" stroke="#2A1C22" strokeWidth={7} />)}
    <line x1={1940} y1={120} x2={960} y2={540} stroke="#D8C08E" strokeWidth={10} />
    <circle cx={960} cy={540} r={7 + (t % 40) / 7} fill="#D8C08E" />
    <Arm from={[2040, 220]} to={[1560, 280]} w={120} c="#EFE8D8" skin="#C69A74" />
  </g>
);
export const H5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#04060C" />
    <Glow x={960} y={560} r={720} kind="cool" o={0.6} />
    {[0, 1, 2, 3].map((i) => {
      const r = ((t * 7 + i * 120) % 480);
      return <ellipse key={i} cx={960} cy={560} rx={r} ry={r * 0.33} fill="none" stroke="#BFEFFF" strokeWidth={6} opacity={1 - r / 480} />;
    })}
    <circle cx={960} cy={560} r={15} fill="#E8F8FF" />
  </g>
);
export const H6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 590, push(t, len, 1, 1.05))}>
    <Yard t={t + 60} id="h6" mode="morning" />
    <Queue x={1010} y={900} n={7} gap={150} s={0.66} looks={[...CROWD, SHOPKEEPER, FISHMAN]} dir={-1} t={t} />
    {fig(GRAN, 760, 880, 0.66, { yaw: 0.6, look: 0.6, armR: { a: 70, b: -20 }, expr: 'happy' }, 'rimR', 0.4)}
  </g>
);
export const H7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1180, 620, push(t, len, 1.28, 1.2))}>
    <Yard t={t + 80} id="h7" mode="morning" />
    <Queue x={760} y={920} n={3} gap={160} s={0.72} looks={[CROWD[3], SHOPKEEPER, FISHMAN]} dir={-1} t={t} />
    <Tusker x={1570} y={930} s={0.68} t={t} pot />
  </g>
);
const Gatepost: React.FC<{ t: number; id: string; car: number }> = ({ t, id, car }) => (
  <g>
    <Yard t={t + 90} id={id} mode="haze" />
    <rect x={-3000} y={870} width={8000} height={500} fill="#7A6A58" />
    <Gate x={520} y={880} open={1} />
    <BlackCar x={car} y={990} s={1} t={t} />
  </g>
);
export const H8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 690, 1.05)}>
    <Gatepost t={t} id="h8" car={kf(t, [[0, 2400], [Math.min(50, len), 1240]])} />
    <Foreground blur={10}><ellipse cx={120} cy={1260} rx={560} ry={200} fill="#141018" /></Foreground>
  </g>
);
export const H9: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(1080, 620, 1.55)}>
    <Gatepost t={t + 30} id="h9" car={1500} />
    {fig(SUIT, 1090, 960, 0.98, { yaw: -0.55, look: -0.6, armL: { a: 74, b: -16 }, expr: 'smug' }, 'rimL', 0.4)}
  </g>
);
export const H10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft><g transform={camT(960, 620, 1.8)}><Yard t={t} id="h10" mode="haze" /></g></Soft>
    <Arm from={[2040, 620]} to={[1190, 560]} w={110} c="#3A3A48" skin="#D9B48E" />
    <g transform={`translate(0 ${kf(t, [[0, 40], [len * 0.5, 0]])})`}><Offer x={830} y={540} s={1.6} rot={-3} /></g>
  </g>
);
export const H11: React.FC<ShotProps> = ({ t, len }) => {
  const tip = clamp((t - 24) / Math.max(20, len - 34));
  const p: P = { x: 950, y: feet(900, 1), scale: 1, yaw: 0.2, look: 0.2, tilt: tip * tip * 72, expr: tip > 0.1 ? 'dizzy' : 'shock', armL: { a: 16, b: -8 }, armR: { a: 16, b: -8 } };
  const h = headAt(p);
  return (
    <g transform={camT(1020, 560, 1.6)}>
      <Yard t={t + 110} id="h11" mode="haze" />
      <Fig look={DAD} pose={p} rimId="rimR" shadow={0.4} />
      {tip > 0.1 ? <DizzyStars x={h.x} y={h.y - 60} t={t} rx={72} ry={26} /> : null}
      {tip < 0.5 ? <g transform={`translate(${h.x + 260} ${h.y + 40}) scale(0.7)`}><Offer x={0} y={0} rot={6} /></g> : null}
    </g>
  );
};
export const H12: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: feet(1000, 1), scale: 1, yaw: 0.45, look: 0.75, headTilt: 7, expr: 'worried' };
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 30, push(t, len, 2.8, 2.95))}>
      <Soft><g transform={camT(760, 420, 1.1)}><Yard t={t} id="h12" mode="dusk" /></g></Soft>
      <Fig look={SIS} pose={p} rimId="rimR" />
    </g>
  );
};
export const H13: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 600, 1)}>
    <Yard t={t + 130} id="h13" mode="dusk" />
    <Queue x={720} y={880} n={7} gap={170} s={0.6} looks={[CROWD[1], FISHMAN, CROWD[0], SHOPKEEPER, CROWD[3]]} dir={-1} t={t} />
    <Foreground blur={16}>
      <circle cx={260} cy={720} r={230} fill="#17121E" />
      <rect x={-60} y={900} width={640} height={360} rx={100} fill="#17121E" />
    </Foreground>
  </g>
);
export const H14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft><g transform={camT(960, 700, 1.7)}><Yard t={t} id="h14" mode="dusk" /></g></Soft>
    <Glow x={420} y={620} r={700} kind="warm" o={0.42} />
    <g transform={`translate(960 590) scale(${push(t, len, 1, 1.12)}) translate(-960 -590)`}>
      <Offer x={960} y={520} s={1.9} rot={2} />
      <Arm from={[960, 1260]} to={[960, 800]} w={120} c="#2E2A3E" />
    </g>
  </g>
);

// ============================================================ I. YEAR THREE
export const I1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 590, push(t, len, 1.08, 1))}>
    <Land t={t} id="i1" mode="haze" dry={1} y={620} sun={[1440, 170, 90]} palms={[280, 1660]} />
    <KHouse x={960} y={690} s={0.52} />
    <Cracks x={-200} y={720} w={2300} h={330} seed={21} />
    <Big x={960} y={330} text="മൂന്നാം വർഷം" size={110} color="#F6EFE3" t={t - 4} />
  </g>
);
export const I2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g transform={`translate(${-(t * 5) % 1800} 0)`}><g transform="scale(1 1)"><Land t={t} id="i2" mode="haze" dry={1} y={640} sun={[3000, 0, 0]} palms={[260, 1500, 2600]} /></g></g>
    <rect x={-100} y={-100} width={2200} height={260} fill="#242030" />
    <rect x={-100} y={860} width={2200} height={340} fill="#242030" />
    <rect x={-100} y={-100} width={210} height={1300} fill="#1C1826" />
    <rect x={1680} y={-100} width={340} height={1300} fill="#1C1826" />
    <rect x={880} y={160} width={40} height={700} fill="#1C1826" />
    <line x1={110} x2={1680} y1={420} y2={420} stroke="#1C1826" strokeWidth={16} />
    <Foreground blur={6}>
      <circle cx={1450} cy={560} r={200} fill="#2A2536" />
      <rect x={1240} y={760} width={500} height={420} rx={120} fill="#2A2536" />
    </Foreground>
    <path d="M 1270 500 Q 1262 440 1320 386" stroke="#F4C98C" strokeWidth={8} fill="none" opacity={0.75} strokeLinecap="round" />
  </g>
);
export const I3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 570, push(t, len, 1, 1.06))}>
    <Land t={t} id="i3" mode="haze" dry={1} y={520} sun={[1400, 160, 90]} palms={[80, 1840]} />
    {Array.from({ length: 28 }).map((_, i) => {
      const row = Math.floor(i / 7);
      const s = 0.6 + row * 0.32;
      return <Solar key={i} x={140 + (i % 7) * (240 + row * 40) - row * 110} y={600 + row * row * 62 + row * 34} s={s} />;
    })}
    <Foreground blur={10}>{[-100, 40, 180].map((x) => <path key={x} d={`M ${x} 1100 q 16 -80 -8 -150`} stroke="#6A5238" strokeWidth={24} fill="none" />)}</Foreground>
  </g>
);
const Roofs: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <Land t={t} id={id} mode="haze" dry={1} y={760} sun={[1500, 170, 90]} hills palms={[60]} />
    {[[210, 720], [650, 660], [1120, 700], [1590, 650]].map(([x, y], i) => (
      <g key={i}>
        <rect x={x - 200} y={y} width={400} height={700} fill={['#B09A82', '#9A8678', '#A68C70', '#B4A08A'][i]} stroke={INK} strokeWidth={5} />
        <rect x={x - 216} y={y - 18} width={432} height={26} fill="#7E7064" stroke={INK} strokeWidth={4} />
        <Tank x={x} y={y - 18} s={0.86} />
        {[0, 1].map((k) => <rect key={k} x={x - 130 + k * 150} y={y + 70} width={110} height={130} fill="#3A3444" stroke={INK} strokeWidth={4} />)}
      </g>
    ))}
  </g>
);
export const I4: React.FC<ShotProps> = ({ t, len }) => <g transform={camT(960, 560, push(t, len, 1, 1.06))}><Roofs t={t} id="i4" /></g>;
export const I5: React.FC<ShotProps> = ({ t }) => {
  const q = (u: number) => [(1 - u) ** 2 * 400 + 2 * u * (1 - u) * 780 + u * u * 1118, (1 - u) ** 2 * 560 + 2 * u * (1 - u) * 300 + u * u * 505];
  return (
    <g transform={camT(770, 500, 1.5)}>
      <Roofs t={t + 40} id="i5" />
      {fig(NBR2, 350, 702, 0.6, { yaw: 0.6, look: 0.7, headTilt: -6, armR: { a: 76, b: -18 }, expr: 'smug' }, 'rimR', 0)}
      <path d="M 400 560 Q 780 300 1118 505" stroke="#E4544A" strokeWidth={10} fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => { const [x, y] = q(1 - (((t * 0.03) + i * 0.2) % 1)); return <circle key={i} cx={x} cy={y} r={7} fill="#BFEFFF" />; })}
    </g>
  );
};
export const I6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1.06, 1))}>
    <Land t={t} id="i6" mode="dusk" dry={1} y={640} sun={[1600, 470, 100]} hills={false} />
    <Water t={t} y={770} />
    {[300, 640, 980].map((x, i) => (
      <g key={x}>
        <rect x={x - 130} y={420 - i * 30} width={260} height={380 + i * 30} fill="#6E7884" stroke={INK} strokeWidth={6} />
        <ellipse cx={x} cy={420 - i * 30} rx={130} ry={26} fill="#8A96A6" stroke={INK} strokeWidth={5} />
      </g>
    ))}
    <rect x={1120} y={500} width={460} height={300} fill="#54606E" stroke={INK} strokeWidth={6} />
    <path d="M -100 620 L 1120 620 M 180 560 L 1120 560" stroke="#3A4C60" strokeWidth={20} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1160 + i * 82} y={540} width={50} height={60} fill="#FFC867" />)}
    <path d="M 1500 500 L 1500 310 L 1540 310 L 1540 500 Z" fill="#54606E" stroke={INK} strokeWidth={5} />
    <CloudPuff x={1530} y={270} s={0.8} c="#C8BCB0" o={0.8} />
    <rect x={360} y={70} width={1200} height={150} rx={24} fill="#141018" opacity={clamp((t - len * 0.3) / 8) * 0.72} />
    <Big x={960} y={170} text="ചെന്നൈ: ദിവസം 36 കോടി ലിറ്റർ" size={64} color="#FFD27E" t={t - len * 0.3} />
  </g>
);
export const I7: React.FC<ShotProps> = ({ t, len }) => {
  const a = stand(KITCHEN, 0.28, 0.5);
  const unroll = clamp(t / (len * 0.75));
  return (
    <g transform={camT(960, 620, 1.1)}>
      <Kitchen t={t} id="i7" veil={0.4} />
      <Fig look={DAD} pose={{ ...a, yaw: 0.6, look: 0.8, headTilt: 12, armR: { a: 66, b: -10 }, armL: { a: 54, b: -10 }, expr: 'shock' }} rimId="rimR" />
      <path d={`M ${a.x + 86} ${a.y - 18} Q ${a.x + 180} ${a.y + 210} ${a.x + 240} ${a.y + 280} L ${a.x + 240 + unroll * 960} ${a.y + 280 + unroll * 300} L ${a.x + 240 + unroll * 960 + 140} ${a.y + 260 + unroll * 300} L ${a.x + 330} ${a.y + 240} Q ${a.x + 220} ${a.y + 160} ${a.x + 160} ${a.y - 26} Z`} fill="#F4EDDC" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={a.x + 280 + i * unroll * 105} x2={a.x + 330 + i * unroll * 105} y1={a.y + 280 + i * unroll * 33} y2={a.y + 280 + i * unroll * 33} stroke="#9A8E78" strokeWidth={5} />)}
      <Tag x={a.x + 420} y={a.y - 120} t={t - 16} text="₹₹₹" w={210} />
    </g>
  );
};
export const I8: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(800, 430, 1.25)}>
    <Classroom t={t} id="i8" board={<g><path d="M 450 500 Q 620 360 760 440 Q 880 330 1040 500 Z" fill="#E2C080" /><circle cx={920} cy={270} r={44} fill="#F1B93C" /><path d="M 590 470 L 590 340 M 590 340 q 34 -40 70 0 M 590 340 q -34 -40 -70 0" stroke="#7A9A4E" strokeWidth={9} fill="none" /></g>} />
  </g>
);

// ============================================================ J. THE DAY IT COMES
export const J1: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  return (
    <g transform={camT(960, 560, push(t, len, 1, 1.08))}>
      <Land t={t} id="j1" mode="haze" dry={1} y={640} sun={[1440, 180, 80]} palms={[160, 1770]} />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#1C2230" opacity={k * 0.7} />
      <CloudRow t={t} y={kf(t, [[0, -160], [len, 170]])} n={7} s={1.5} tone="storm" speed={-0.8} seed={3} />
      <CloudRow t={t} y={kf(t, [[0, -280], [len, 40]])} n={7} s={1.8} tone="storm" speed={-0.5} seed={8} />
      {fig(PIP, 960, 880, 0.82, { yaw: 0.2, headTilt: -14, look: 0.3, expr: 'shock' }, 'rimR', 0.4)}
    </g>
  );
};
export const J2: React.FC<ShotProps> = ({ t, len }) => {
  const y = kf(t, [[0, -60], [28, 690]]);
  const hit = t >= 28;
  return (
    <g transform={camT(960, 560, push(t, len, 1, 1.1))}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#343E52" />
      <Glow x={1300} y={100} r={700} kind="cool" o={0.4} />
      {[[560, 330, -14], [760, 250, -4], [960, 240, 5], [1150, 300, 14]].map(([x, y, r], i) => <rect key={i} x={x - 72} y={y} width={144} height={460} rx={72} fill="#D0A67E" stroke={INK} strokeWidth={8} transform={`rotate(${r} ${x} ${y + 400})`} />)}
      <path d="M 1300 860 L 1610 560 Q 1690 520 1720 590 L 1500 1000 Z" fill="#D0A67E" stroke={INK} strokeWidth={8} />
      <ellipse cx={870} cy={880} rx={430} ry={330} fill="#D0A67E" stroke={INK} strokeWidth={8} />
      <rect x={460} y={800} width={840} height={500} fill="#D0A67E" />
      <path d="M 610 760 Q 860 810 1180 750" stroke="#AE8660" strokeWidth={8} fill="none" />
      <path d="M 640 860 Q 880 900 1140 850" stroke="#AE8660" strokeWidth={7} fill="none" />
      {!hit ? <path d={`M 960 ${y - 56} Q 996 ${y + 6} 960 ${y + 32} Q 924 ${y + 6} 960 ${y - 56} Z`} fill="#BFEFFF" stroke={INK} strokeWidth={4} /> : (
        <g>
          <ellipse cx={940} cy={720} rx={78} ry={36} fill="#BFEFFF" stroke={INK} strokeWidth={4} opacity={0.9} />
          <ellipse cx={916} cy={708} rx={20} ry={8} fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
};
export const J3: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: feet(980, 1.1), scale: 1.1, yaw: 0.2, look: 0.1, armL: { a: 70, b: -40 }, armR: { a: 40, b: -30 }, ...faceAt(t, [[0, 'worried']]) };
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 90, push(t, len, 2, 2.2))}>
      <Soft><g transform={camT(960, 500, 1.2)}><Land t={t} id="j3" mode="grey" dry={1} y={640} sun={[0, 0, 0]} palms={[300, 1600]} /></g></Soft>
      <Fig look={TODDLER} pose={p} rimId="rimBlue" />
      <path d={`M ${h.x - 34} ${h.y + 14} q -6 22 2 40 M ${h.x + 26} ${h.y + 14} q 6 22 -2 40`} stroke="#9CD4FF" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Rain t={t} o={0.3} n={40} />
    </g>
  );
};
export const J4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 620, push(t, len, 0.98, 1.05))}>
    <Street t={t} id="j4" mode="rainy" dry={1} />
    <rect x={-200} y={720} width={2400} height={700} fill="#3C4656" opacity={0.75} />
    {[250, 560, 830, 1110, 1400, 1660].map((x, i) => fig([...CROWD, MO][i], x, 900 + (i % 2) * 42, 0.8, { yaw: i % 2 ? -0.2 : 0.2, headTilt: -14, armL: { a: 150 + Math.sin(t / 4 + i) * 10, b: 10 }, armR: { a: 150 - Math.sin(t / 4 + i) * 10, b: 10 }, expr: 'happy' }, 'rimBlue', 0.3))}
    <Rain t={t} o={0.72} n={170} />
  </g>
);
export const J5: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: feet(1000, 1), scale: 1, yaw: 0.25, look: 0.3, headTilt: -10, expr: 'happy' };
  const h = headAt(p);
  return (
    <g transform={camT(h.x, h.y + 40, push(t, len, 2.8, 3))}>
      <Soft><g transform={camT(960, 620, 1.2)}><Street t={t} id="j5" mode="rainy" dry={1} /></g></Soft>
      <Fig look={MOM} pose={p} rimId="rimBlue" />
      <path d={`M ${h.x - 28} ${h.y + 8} q -6 26 2 44 M ${h.x + 38} ${h.y + 8} q 6 24 -2 40`} stroke="#9CD4FF" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Rain t={t} o={0.5} n={70} />
    </g>
  );
};
export const J6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1, 1.1))}>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#1E1824" />
    <rect x={420} y={40} width={1080} height={1000} fill="#3A2820" stroke={INK} strokeWidth={8} />
    <rect x={470} y={90} width={980} height={900} fill="#16121A" />
    <line x1={470} y1={190} x2={1450} y2={190} stroke="#8A8A96" strokeWidth={9} />
    {[620, 1200, 1320].map((x, i) => <path key={x} d={`M ${x} 190 q 0 -26 18 -22 M ${x + 18} 190 l -90 76 L ${x - 76} 620 L ${x + 110} 620 L ${x + 110} 266 Z`} fill={['#4A3A52', '#3E4E5A', '#54403A'][i]} stroke={INK} strokeWidth={4} />)}
    <Umbrella x={930} y={350} s={2} closed c="#6A6E92" />
    <Cobweb x={1000} y={210} r={190} o={0.85} />
    <Cobweb x={470} y={90} r={230} o={0.6} />
    <Glow x={960} y={480} r={420} kind="cool" o={0.35} />
    <path d="M 1500 40 L 1500 1040 L 1640 1100 L 1640 -20 Z" fill="#2E2018" stroke={INK} strokeWidth={6} />
  </g>
);
export const J7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Soft><g transform={camT(960, 620, 1.3)}><Street t={t} id="j7" mode="rainy" dry={1} /></g></Soft>
    <ScreenPhone x={960} y={560} s={1.32} id="j7" bg="#E6E0D6">
      <rect x={-175} y={-340} width={350} height={82} fill="#1F5C4A" />
      <circle cx={-128} cy={-300} r={26} fill="#5A6A3A" stroke="#FFF" strokeWidth={3} />
      <rect x={-92} y={-310} width={150} height={20} rx={8} fill="#FFFFFF" opacity={0.8} />
      {t > 30 ? <g><rect x={-142} y={-90} width={180} height={120} rx={22} fill="#FFFFFF" stroke="#C0B8AC" strokeWidth={3} /><text x={-52} y={-8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#1A1230">മഴ</text></g> : null}
    </ScreenPhone>
    <Rain t={t} o={0.3} n={50} />
  </g>
);
export const J8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(760, 500, push(t, len, 1.6, 1.8))}>
    <Land t={t} id="j8" mode="rainy" dry={1} y={760} sun={[0, 0, 0]} />
    <path d="M 760 760 L 1200 380 L 1420 220 L 1700 340 L 2300 760 Z" fill="#6E5840" stroke={INK} strokeWidth={5} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${1050 + i * 140} ${700 - i * 50} l 8 -38 M ${1070 + i * 140} ${704 - i * 50} l -6 -30`} stroke="#3A2C24" strokeWidth={6} />)}
    {fig(PIP, 640, 880, 1, { yaw: 0.55, look: 0.9, expr: 'worried' }, 'rimBlue', 0.4)}
    <Rain t={t} o={0.55} n={120} />
    <Foreground blur={10}><rect x={80} y={760} width={150} height={460} fill="#120E18" /></Foreground>
  </g>
);
export const J9: React.FC<ShotProps> = ({ t }) => (
  <Schem t={t} id="j9">
    <path d="M 0 1060 L 0 930 L 500 860 L 880 560 L 1180 250 L 1430 180 L 1760 460 L 1920 560 L 1920 1060 Z" fill="#4A4C58" stroke={SCH.line} strokeWidth={5} />
    <path d={`M 480 780 L 860 480 L 1160 180 L 1440 106 L 1800 400 L 1920 480 L 1920 560 L 1760 460 L 1430 180 L 1180 250 L 880 560 L 500 860 Z`} fill="#A08458" stroke={INK} strokeWidth={4} />
    <Big x={1120} y={760} text="പാറ" size={84} t={t - 4} color="#F6EFE3" />
    <Big x={680} y={460} text="അയഞ്ഞ മണ്ണ്" size={68} color="#FFD27E" t={t - 40} />
    <Big x={1720} y={230} text="വേരില്ല" size={72} color={SCH.live} t={t - 100} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${860 + i * 130} ${470 - i * 90} l -18 76 M ${860 + i * 130} ${470 - i * 90} l 20 60`} stroke="#3A2A1E" strokeWidth={6} opacity={clamp((t - 90) / 10)} />)}
  </Schem>
);
export const J10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 0.96, 1.2))}>
    <Sky id="j10" mode="storm" />
    <path d="M -300 1100 L 380 760 L 860 260 L 1120 120 L 1440 380 L 2200 860 L 2200 1300 L -300 1300 Z" fill="#3A3028" stroke={INK} strokeWidth={5} />
    <path d="M 760 420 L 1120 120 L 1300 260 L 1140 560 L 940 780 Z" fill="#54442E" />
    <Bolt x={1500} y={-40} t={t} t0={Math.floor(t / 50) * 50 + 8} />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={160 + (i % 8) * 150 + rnd(3, i) * 40} y={950 + Math.floor(i / 8) * 80} width={80} height={66} fill={rnd(4, i) > 0.4 ? '#FFC867' : '#2C2438'} stroke={INK} strokeWidth={3} />)}
    <Rain t={t} o={0.8} n={190} />
  </g>
);
export const END: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Sky id="end" mode="storm" />
    <path d="M -300 1100 L 380 760 L 860 260 L 1120 120 L 1440 380 L 2200 860 L 2200 1300 L -300 1300 Z" fill="#241E1C" />
    <Rain t={t} o={0.6} n={120} />
    <text x={960} y={500} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#F6EFE3" stroke={INK} strokeWidth={10} paintOrder="stroke" opacity={clamp(t / 8)}>ആ മല എത്ര നേരം നിൽക്കും?</text>
    <text x={960} y={620} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={56} fill="#FFD27E" stroke={INK} strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 14) / 8)}>നീയാണെങ്കിൽ കിണർ വിൽക്കുമോ?</text>
    <Fade t={t} len={len} n={16} />
  </g>
);

// ============================================================ real facts
export const D3: React.FC<ShotProps> = ({ t, len }) => (
  <Schem t={t} id="d3">
    <g transform="translate(-1000 -1320) scale(2.1)"><path d={PENINSULA} fill="#1E3048" stroke={SCH.line} strokeWidth={3} /><path d={KERALA} fill="#2E4A3A" stroke={SCH.line} strokeWidth={2.5} /></g>
    {Array.from({ length: 14 }).map((_, i) => {
      const u = i / 13;
      const dead = clamp((t - len * 0.74 - i * 2) / 6);
      return <circle key={i} cx={606 + u * 230 + (i % 2) * 22} cy={40 + u * 620} r={clamp((t - 30 - i * 3) / 5) * 15} fill={mix('#6FD0E8', SCH.live, dead)} stroke={INK} strokeWidth={2} />;
    })}
    <Big x={1360} y={420} text="14 കേന്ദ്രങ്ങൾ" size={90} t={t - 30} />
    <Big x={1360} y={550} text="60% ഇടത്ത് മഴ" size={70} color="#6FD0E8" t={t - len * 0.16} />
    <Big x={1360} y={650} text="2 ദിവസം തുടർച്ചയായി" size={60} color="#6FD0E8" t={t - len * 0.3} />
    <Big x={1360} y={860} text="ഇത്തവണ: 0" size={104} color={SCH.live} t={t - len * 0.76} />
  </Schem>
);
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const pour = clamp((t - 14) / 10) * (1 - clamp((t - len * 0.62) / 8));
  const lvl = clamp((t - 22) / (len * 0.5));
  return (
    <g transform={camT(860, 620, 1.3)}>
      <Land t={t} id="d4" dry={0.45} y={700} sun={[1580, 170, 90]} palms={[80, 1760]} />
      <path d="M 900 716 L 1066 716 L 1030 776 L 936 776 Z" fill="#C8D4DE" stroke={INK} strokeWidth={5} />
      <rect x={936} y={776} width={94} height={130} fill="#E8EFF4" stroke={INK} strokeWidth={5} />
      <rect x={941} y={901 - lvl * 92} width={84} height={lvl * 92} fill="#6FB4E0" />
      {[0, 1, 2].map((i) => <line key={i} x1={1004} x2={1026} y1={806 + i * 30} y2={806 + i * 30} stroke={INK} strokeWidth={3} />)}
      {fig(MO, 660, 910, 1.05, { yaw: 0.6, look: t > len * 0.68 ? -0.8 : 0.7, armR: { a: 74, b: -20 }, expr: t > len * 0.68 ? 'worried' : 'smug' }, 'rimR', 0.5)}
      <g transform={`rotate(${pour * 78} 806 690)`}><path d="M 776 600 L 836 600 L 830 690 L 782 690 Z" fill="#D8E4EC" stroke={INK} strokeWidth={5} /></g>
      {pour > 0.7 ? <path d="M 892 672 Q 940 676 968 730" stroke="#6FB4E0" strokeWidth={9} fill="none" strokeLinecap="round" /> : null}
    </g>
  );
};
export const F9b: React.FC<ShotProps> = ({ t, len }) => (
  <Schem t={t} id="f9b">
    <Big x={680} y={250} text="2023 ആഗസ്റ്റ്" size={92} t={t - 6} />
    <Big x={680} y={560} text="6 cm" size={270} color={SCH.live} t={t - 26} />
    <Big x={680} y={740} text="1901 മുതൽ ഏറ്റവും കുറവ്" size={62} t={t - len * 0.45} />
    <ellipse cx={1460} cy={906} rx={250} ry={38} fill="#3E9CC8" opacity={0.9} />
    {fig(PIP, 1460, 910, 1.3, { yaw: -0.25, look: 0.3, headTilt: 8, expr: 'worried' }, 'rimR', 0)}
    <ellipse cx={1460} cy={914} rx={220} ry={22} fill="#6FD0E8" opacity={0.75} />
  </Schem>
);
export const F9c: React.FC<ShotProps> = ({ t, len }) => {
  const rows: [string, number, number][] = [['2016', 0.34, 6], ['2023', 0.36, 20], ['ഇത്തവണ', 1, len * 0.48]];
  return (
    <Schem t={t} id="f9c">
      {rows.map(([n, p, d], i) => {
        const y = 270 + i * 220;
        const k = clamp((t - d) / 14);
        return (
          <g key={n}>
            <Big x={530} y={y + 54} text={n} size={70} anchor="end" color={i === 2 ? SCH.live : SCH.line} t={t - d + 8} />
            <rect x={590} y={y} width={1000} height={84} fill="#6FD0E8" opacity={clamp((t - d + 8) / 6)} />
            <rect x={590 + 1000 * (1 - p * k)} y={y} width={1000 * p * k} height={84} fill={SCH.live} />
          </g>
        );
      })}
    </Schem>
  );
};
export const F11b: React.FC<ShotProps> = ({ t, len }) => {
  const a = clamp((t - len * 0.26) / 16) * 620;
  const on = clamp((t - len * 0.6) / 10);
  return (
    <Schem t={t} id="f11b">
      <Big x={960} y={130} text="കേരളത്തിലെ മത്തി" size={72} t={t - 4} />
      <line x1={260} x2={1660} y1={920} y2={920} stroke={SCH.line} strokeWidth={5} />
      <rect x={430} y={920 - a} width={320} height={a} fill="#6FD0E8" stroke={INK} strokeWidth={4} />
      <rect x={1170} y={920 - 6 * on} width={320} height={6 * on} fill={SCH.live} />
      <Big x={590} y={1000} text="2012" size={64} t={t - len * 0.26} />
      <Big x={590} y={260} text="4,00,000 ടൺ" size={70} t={t - len * 0.34} />
      <Big x={1330} y={1000} text="2021" size={64} t={t - len * 0.6} />
      <Big x={1330} y={760} text="3,500 ടൺ" size={82} color={SCH.live} t={t - len * 0.64} />
      {on > 0.5 ? <Fish x={1330} y={880} s={0.6} /> : null}
    </Schem>
  );
};
export const F14b: React.FC<ShotProps> = ({ t, len }) => {
  const p = kf(t, [[0, 0.7], [len * 0.42, 0.2]]);
  return (
    <Schem t={t} id="f14b">
      <rect x={300} y={250} width={380} height={640} rx={14} fill="#16243A" stroke={SCH.line} strokeWidth={5} />
      <rect x={306} y={884 - 628 * p} width={368} height={628 * p} fill="#3E9CC8" />
      <Big x={490} y={190} text="ഇടുക്കി, 2017" size={64} t={t - 4} />
      <Big x={490} y={720} text={`${Math.round(p * 100)}%`} size={110} color={SCH.line} t={t - 6} />
      <Big x={1290} y={480} text="₹2,000 കോടി" size={130} color={SCH.live} t={t - len * 0.56} />
      <Big x={1290} y={600} text="വൈദ്യുതി വാങ്ങാൻ അധികം" size={58} t={t - len * 0.62} />
    </Schem>
  );
};
export const F23b: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Crop t={t + 60} id="f23b" kind="cardamom" />
    <rect x={410} y={70} width={1100} height={270} rx={24} fill="#141018" opacity={0.74} />
    <Big x={960} y={190} text="ഏലം: 25% വരെ നഷ്ടം" size={78} color="#FFD27E" t={t - len * 0.35} />
    <Big x={960} y={290} text="സ്പൈസസ് ബോർഡ് കണക്ക്, 2016" size={46} t={t - len * 0.55} />
  </g>
);
const LAKES = ['പുഴൽ', 'ചെമ്പരമ്പാക്കം', 'ചോളവരം', 'പൂണ്ടി'];
export const G5: React.FC<ShotProps> = ({ t, len }) => (
  <Schem t={t} id="g5">
    <Big x={960} y={190} text="ചെന്നൈ, 2019" size={100} t={t - 4} />
    {LAKES.map((n, i) => {
      const x = 330 + i * 420;
      const r = kf(t, [[len * 0.3 + i * 8, 150], [len * 0.82, 30 + i * 6]]);
      return (
        <g key={n}>
          <circle cx={x} cy={520} r={160} fill="#5E4A38" stroke={SCH.line} strokeWidth={5} />
          <circle cx={x} cy={520} r={r} fill="#3E9CC8" />
          <Big x={x} y={780} text={n} size={46} t={t - 14 - i * 5} />
        </g>
      );
    })}
  </Schem>
);
const Wagon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={-50} width={410} height={30} fill="#2A2A36" stroke={INK} strokeWidth={4} />
    <rect x={18} y={-186} width={374} height={136} rx={66} fill="#8A4A3A" stroke={INK} strokeWidth={5} />
    <rect x={186} y={-208} width={38} height={24} fill="#6A382C" stroke={INK} strokeWidth={4} />
    {[70, 340].map((c) => <circle key={c} cx={c} cy={-14} r={24} fill="#1E1E2C" stroke="#54546A" strokeWidth={5} />)}
  </g>
);
export const G6: React.FC<ShotProps> = ({ t, len }) => {
  const x0 = kf(t, [[0, 1500], [len, -1500]]);
  const tail = x0 + 300 + 5 * 430;
  const rx = tail + 130;
  const p = walkPose(rx, t * 0.9, 880, 0.9, { expr: 'worried', look: -0.6, tilt: -13, armL: { a: 42, b: -78 }, armR: { a: 54 + Math.sin(t * 0.9) * 26, b: -50 } }, -1);
  return (
    <g transform={camT(960, 600, 1)}>
      <Land t={t} id="g6" mode="haze" dry={0.9} y={640} sun={[1600, 170, 90]} palms={[60, 1800]} />
      <rect x={-300} y={830} width={2600} height={60} fill="#7A6E66" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-300 + i * 90} y={830} width={22} height={60} fill="#4E443E" />)}
      <rect x={-300} y={836} width={2600} height={8} fill="#2A2A36" /><rect x={-300} y={872} width={2600} height={8} fill="#2A2A36" />
      <rect x={-300} y={890} width={2600} height={400} fill="#A08A70" />
      <g transform={`translate(${x0} 850)`}>
        <path d="M 0 -30 L 0 -170 Q 0 -200 40 -200 L 180 -200 L 180 -260 L 290 -260 L 290 -30 Z" fill="#2E5C8A" stroke={INK} strokeWidth={5} />
        <rect x={198} y={-240} width={72} height={54} fill="#FFC867" stroke={INK} strokeWidth={4} />
        {[70, 220].map((c) => <circle key={c} cx={c} cy={-14} r={30} fill="#1E1E2C" stroke="#54546A" strokeWidth={5} />)}
      </g>
      {[0, 1, 2, 3, 4].map((i) => <Wagon key={i} x={x0 + 300 + i * 430} y={850} />)}
      <Fig look={CROWD[0]} pose={p} rimId="rimR" shadow={0.5} />
      <Kudam x={p.x - 84} y={p.y - 34} s={0.6} rot={-18} />
      <rect x={520} y={60} width={880} height={210} rx={24} fill="#141018" opacity={clamp((t - len * 0.36) / 8) * 0.74} />
      <Big x={960} y={160} text="25 ലക്ഷം ലിറ്റർ" size={84} color="#6FD0E8" t={t - len * 0.36} />
      <Big x={960} y={240} text="ഒരു യാത്രയിൽ" size={50} t={t - len * 0.42} />
    </g>
  );
};
export const I3b: React.FC<ShotProps> = ({ t, len }) => (
  <Schem t={t} id="i3b">
    <Ghats t={t} rain={1} />
    {[1600, 1680, 1770, 1850, 1920].map((x, i) => <path key={x} d={`M ${x} ${556} l 0 -56 M ${x} ${530} l -24 -24 M ${x} ${520} l 22 -28`} stroke="#A08458" strokeWidth={6} fill="none" opacity={clamp((t - len * 0.22 - i * 3) / 6)} />)}
    <Big x={1680} y={240} text="ചിന്നാർ" size={84} color="#FFD27E" t={t - len * 0.24} />
    <Big x={1640} y={350} text="≈ 500 mm" size={64} color={SCH.live} t={t - len * 0.56} />
    <Big x={420} y={330} text="കേരളം" size={76} t={t - len * 0.7} />
    <Big x={420} y={440} text="≈ 2,860 mm" size={76} color="#6FD0E8" t={t - len * 0.7} />
  </Schem>
);
export const J9b: React.FC<ShotProps> = ({ t, len }) => (
  <Schem t={t} id="j9b">
    <Rain t={t} o={0.35} n={110} />
    <Big x={960} y={220} text="2018 ആഗസ്റ്റ് 15–17" size={92} t={t - len * 0.1} />
    <CountUp x={960} y={560} t={t - len * 0.42} to={414} dur={50} size={230} color={SCH.live} suffix=" mm" />
    <Big x={960} y={700} text="3 ദിവസം" size={76} t={t - len * 0.3} />
    <Big x={960} y={880} text="35 ഓളം ഡാമുകളുടെ ഷട്ടർ തുറന്നു" size={64} color="#FFD27E" t={t - len * 0.68} />
  </Schem>
);
const NBR2 = CROWD[1];
void Dust; void Mundu; void Sun;

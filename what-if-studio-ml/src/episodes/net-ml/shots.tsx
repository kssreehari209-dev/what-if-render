// net-ml: "What if the internet went off for a month?" Long video, 16:9. The narration stays straight; the jokes are in
// the picture. Everything turns on one thing: you can't remember your father's Dubai number.
import React from 'react';
import {
  faceAt, kf, clamp, camT, rnd, easeOut, backOut, Pose, ShotProps, FONT, Glow, Dust, Foreground, LightVeil, Stars, Moon, Sun, FocusRings, DizzyStars, FloatLabel, TitleCard,
  Kitchen, KITCHEN, KitchenIsland, islandTop, stand, Bedroom, BedDuvet, bedSit, LAMP, Classroom, Schematic, SCH, DrawOn, Arrow, SchLabel, CountUp, Tabletop,
} from '../../engine';
import { Fig, Palm, KHouse, Sky, FlatBuilding, BlackCar, Water, Bolt, Big, Fade, FadeIn, PIP, MO, SIS, MOM, SUIT, headAt, handAt } from '../fly-ml/kit';
import { UNCLE, NBR, TEAMAN, CROWD, Mundu, Tache, QRStand, CashSign, ChayaFront, Counter, AtmKiosk, BusShelter, Bus, TeaGlass, Carrom, Towers, Cobweb, Spider } from '../phone-ml/kit';
import { DAD, GRAN, SHOPKEEPER, HSky, Land, ScreenPhone, Arm, SteelPlate, Fan } from '../monsoon-ml/kit';
import { Fish, Suitcase, ChinaNet } from '../ice-short-ml/kit';
import {
  INK, fig, Say, Spinner, NoNet, Booth, Line, Kavala, BoothIn, DeskPhone, Keypad, Handset, CallRings, ChatHead, Bubble, Router, Roofs, Coconut, Paper, ReelFrame, Placard,
  Sack, EPos, Shop, SeaBed, Cable, Crab, Volcano, Radio, PostBox, Letter, HamRig, Aerial, Bunk, Frame, Pills, Notes, Deed, Pen, DiaryShut, DiaryOpen, Hospital,
} from './kit';

type P = Partial<Pose>;
/** The day or place pill per shot, drawn by index.tsx outside the camera: [text, frames in]. */
export const CHIPS: Record<string, [string, number]> = {
  A1: ['ദിവസം 19', 3], B1: ['19 ദിവസം മുമ്പ്', 2], C1: ['ദിവസം 1', 2], C3: ['ദിവസം 2', 2], C8: ['ദിവസം 3 · ഉച്ച', 46], D1: ['ദിവസം 3', 2], D6: ['ദിവസം 3 · വൈകുന്നേരം', 2],
  D8: ['ദിവസം 5', 2], D10: ['2022 ജനുവരി', 2], E5: ['ടോംഗ · 2022 ജനുവരി', 2], E8: ['മണിപ്പൂർ · 2023', 2], F1: ['ദിവസം 10', 2], F3: ['2018 പ്രളയം', 2], G1: ['ദിവസം 14', 2],
  G8: ['ദിവസം 18', 2], H8: ['ദിവസം 19', 2], J1: ['ദിവസം 30', 2],
};
const push = (t: number, len: number, a: number, b: number) => kf(t, [[0, a], [len, b]]);
const Soft: React.FC<{ children: React.ReactNode }> = ({ children }) => <Foreground blur={16}>{children}</Foreground>;
const Dark: React.FC<{ o?: number }> = ({ o = 1 }) => <rect x={-3000} y={-3000} width={8000} height={8000} fill="#0A0814" opacity={o} />;
const Sch: React.FC<{ t: number; id: string; children?: React.ReactNode }> = ({ t, id, children }) => <g><Schematic t={t} id={id} />{children}</g>;

// the terrace at dusk, floor from y 800
const Terr: React.FC<{ t: number; id: string; night?: boolean }> = ({ t, id, night }) => (
  <g>
    {night ? <g><Sky id={id} mode="night" /><Stars seed={4} x0={-200} y0={-100} w={2300} h={640} t={t} n={110} o={0.8} /><Moon x={1400} y={250} r={58} /><Glow x={1400} y={250} r={320} kind="cool" o={0.45} /></g>
      : <g><Sky id={id} mode="dusk" y0={-100} y1={820} /><Sun x={1420} y={590} r={110} t={t} /><Glow x={1420} y={590} r={560} kind="warm" o={0.6} /></g>}
    {[-60, 200, 1720].map((x, i) => <Palm key={x} x={x} y={760} s={0.82 + i * 0.1} t={t + i * 40} dark />)}
    <rect x={-3000} y={690} width={8000} height={110} fill={night ? '#3A3448' : '#6E5A62'} stroke={INK} strokeWidth={5} />
    {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={-340 + i * 150} y={712} width={72} height={66} rx={7} fill={night ? '#262034' : '#3E3040'} />)}
    <rect x={-3000} y={800} width={8000} height={2000} fill={night ? '#2C2838' : '#4A3C4A'} />
  </g>
);
// a home's front room in the evening, the bulb at (960, 180), floor from y 830
const Room: React.FC<{ t: number; id: string; children?: React.ReactNode; bulb?: number }> = ({ t, id, children, bulb = 1 }) => (
  <g>
    <rect x={-3000} y={-1000} width={8000} height={1830} fill="#4E4250" />
    <rect x={-3000} y={830} width={8000} height={2000} fill="#3A2C30" />
    <rect x={-3000} y={826} width={8000} height={12} fill="#231A24" />
    {children}
    <line x1={960} y1={-40} x2={960} y2={160} stroke={INK} strokeWidth={5} />
    <circle cx={960} cy={180} r={26} fill="#FFE9B8" />
    <Glow x={960} y={190} r={640} kind="warm" o={0.7 * bulb} />
    <LightVeil id={`rm${id}`} lights={[[960, 300, 640]]} o={0.42} />
    <Dust t={t} seed={3} x0={500} y0={180} w={900} h={500} n={18} o={0.4} />
  </g>
);
// the tea shop world (a 1080-wide set): frame it at zoom 1.14
const TeaCam = (t: number, len: number, cx = 540) => camT(cx, 1040, push(t, len, 1.14, 1.2));

// ============================================================ A. THE COLD OPEN: DAY 19, THE BOOTH
export const A1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 1020, 960), 560, push(t, len, 1.16, 1))}>
    <Kavala t={t} id="a1" />
    <Booth x={1240} y={745} s={0.92} />
    <Line x0={1120} g0={762} s0={0.46} x1={-120} g1={1000} s1={1.05} n={15} t={t} />
    <Line x0={-380} g0={1000} s0={1.05} x1={-500} g1={1010} s1={1.05} n={2} t={t} seed={5} />
    <Say t={t - 96} x={420} y={260} text="മുന്നൂറ് പേർ" size={84} color="#FFE27A" />
  </g>
);
export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 620, push(t, len, 1.75, 1.9))}>
    <Kavala t={t + 80} id="a2" />
    <Booth x={1310} y={780} s={1} />
    {fig(CROWD[1], 480, 880, 1, { yaw: 0.6, look: 0.5, expr: 'tired', armR: { a: 16, b: -10 } })}
    {fig(UNCLE, 720, 880, 1, { yaw: 0.6, look: 0.6, tilt: 5, expr: 'tired', blink: 1 })}
    <Mundu pose={{ x: 720, y: 880 - 212, scale: 1, yaw: 0.6 }} />
    {fig(PIP, 1000, 880, 1, { yaw: 0.65, look: 0.8, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, ...faceAt(t, [[0, 'tired']]) })}
    <Placard x={760} y={410} s={0.6} text="4 മണിക്കൂർ" />
    <FloatLabel x={1020} y={430} t={(t + 20) % 70} text="💧" size={1} />
    <Soft><g transform={`translate(${60 + t * 0.2} 0)`}>{fig(CROWD[3], 120, 1240, 2, { yaw: 0.5 }, 'rimR', 0)}</g></Soft>
  </g>
);
export const A3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, 520, push(t, len, 1.02, 1.12))}>
    <BoothIn t={t} />
    <DeskPhone x={1260} y={650} s={1} />
    {fig(PIP, 860, 1110, 1.5, { yaw: 0.6, look: 0.7, ...faceAt(t, [[0, 'worried']]), armR: { a: 40, b: -30 } }, 'rimL', 0)}
    <Say t={t - 72} x={1320} y={150} text="അമ്മ ആശുപത്രിയിൽ" size={56} color="#F6EFE3" />
  </g>
);
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const up = kf(t, [[0, 0], [24, 1]], easeOut);
  const fx = kf(t, [[46, 1300], [76, 1020]], easeOut);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#2E2028" />
      <Glow x={960} y={540} r={800} kind="warm" o={0.25} />
      <g opacity={1 - clamp((t - 40) / 8)}>
        <DeskPhone x={960} y={940} s={2.4} off />
        <Handset x={960} y={560 - up * 500} s={2.3} />
        <Arm from={[1700, 1300 - up * 300]} to={[1160, 620 - up * 490]} />
      </g>
      <g opacity={clamp((t - 40) / 8)}>
        <Keypad x={860} y={540} s={1.28} />
        <Arm from={[2100, 1300]} to={[fx + 160, 610]} w={130} />
      </g>
    </g>
  );
};
export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: 830, scale: 2.7, yaw: 0.25, look: 0.1, ...faceAt(t, [[0, 'neutral'], [46, 'shock']]) };
  const h = headAt(p);
  return (
    <g transform={camT(960, 470, push(t, len, 1, 1.14))}>
      <BoothIn t={t + 30} />
      <Glow x={960} y={500} r={720} kind="red" o={0.2} />
      <Fig look={PIP} pose={p} rimId="rimL" />
      <g transform={`translate(${h.x} ${h.y}) scale(0.5) translate(${-h.x} ${-h.y})`}><FocusRings x={h.x} y={h.y} t={t - 46} r0={200} /></g>
    </g>
  );
};
export const A6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#17121E" />
    <Glow x={700} y={540} r={700} kind="cool" o={0.4} />
    <ScreenPhone x={640} y={560} s={1.32} rot={-3} id="a6" bg="#E6E0D4">
      <ChatHead />
      <Bubble y={-190} text="മോനേ, കഴിച്ചോ?" size={32} />
      <Bubble y={-50} text="കഴിച്ചു അച്ഛാ" me ticks={2} size={32} />
      <Spinner x={0} y={210} r={48} t={t} c="#5A6478" />
    </ScreenPhone>
    <g transform="translate(1340 330)">
      <Say x={0} y={0} t={t - 12} text="നാട്ടിലെ പഴയ നമ്പർ" size={54} />
      <Say x={0} y={290} t={t - 118} text="ദുബായ്" size={90} color="#FFB15A" />
      <Say x={0} y={420} t={t - 148} text="+971 ? ? ? ? ?" size={80} color="#FF5A4A" />
    </g>
  </g>
);
export const A7: React.FC<ShotProps> = ({ t }) => {
  const hit = t > 78 ? 1 : 0;
  const knock = Math.sin(clamp((t - 64) / 14) * Math.PI * 3) * 20;
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#E8C98E" />
      <Line x0={1600} g0={740} s0={0.5} x1={1100} g1={1040} s1={1} n={6} t={t} seed={4} face={-1} />
      {fig(NBR, 960, 1220, 2, { yaw: -0.15, look: -0.1, armR: { a: 150 + knock, b: -38 }, expr: 'shock', tilt: 2 })}
      <path d="M 300 -100 L 620 1200 M 1200 -100 L 1560 1200" stroke="#fff" strokeOpacity={0.3} strokeWidth={46} />
      <rect x={-200} y={-200} width={330} height={1500} fill="#1E1620" />
      <rect x={1790} y={-200} width={330} height={1500} fill="#1E1620" />
      <Soft>{fig(PIP, 330, 1560, 3.1, { yaw: 0.8, look: 0.8 }, 'rimL', 0)}</Soft>
      {hit ? <Fade t={t} len={100} n={18} /> : null}
    </g>
  );
};

// ============================================================ B. THE PREMISE: 19 DAYS EARLIER
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.22);
  const p: P = { ...b, yaw: 0.45, look: 0.5, armR: { a: 70, b: -44 }, armL: { a: 50, b: -40 }, ...faceAt(t, [[0, 'happy']]) };
  const h = handAt(p, 'R');
  return (
    <g transform={camT(push(t, len, 880, 780), 560, push(t, len, 1, 1.5))}>
      <Bedroom t={t} id="b1" duvet={false} clock="23:30" lamp={0.2} veil={0.5} />
      <Fig look={PIP} pose={p} rimId="rimBlue" />
      <BedDuvet />
      <rect x={h.x - 14} y={h.y - 42} width={30} height={56} rx={5} fill="#BFE4F4" stroke={INK} strokeWidth={3} />
      <Glow x={h.x} y={h.y - 10} r={220} kind="cool" o={0.7} />
    </g>
  );
};
export const B2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#0E0C18" />
    <Glow x={960} y={540} r={640} kind="cool" o={0.45} />
    <ScreenPhone x={960} y={540} s={1.36} id="b2" bg="#2A2040">
      <circle cx={0} cy={-40} r={120} fill="#F0905E" />
      <path d="M -175 340 L -175 160 Q 0 90 175 160 L 175 340 Z" fill="#1A1230" />
      <g transform="translate(0 -30)">{fig(MO, 0, 160, 0.6, { armR: { a: 150, b: -40 }, armL: { a: 120, b: 30 }, legL: { a: 24, b: 10 }, expr: 'cool', glasses: 1 }, 'rimR', 0)}</g>
      <rect x={-175} y={-340} width={350} height={680} fill="#000" opacity={t > 26 ? 0.55 : 0} />
      {t > 26 ? <Spinner x={0} y={-10} r={62} t={t} /> : null}
    </ScreenPhone>
  </g>
);
// the shelf with the router, the wall behind it
const RouterSet: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#3A3448" />
    <rect x={-400} y={700} width={2800} height={46} fill="#5E4230" stroke={INK} strokeWidth={5} />
    <rect x={-400} y={746} width={2800} height={800} fill="#262034" />
    <path d="M 1500 700 C 1560 840 1400 900 1460 1100" stroke="#14101C" strokeWidth={10} fill="none" />
    <Glow x={960} y={560} r={720} kind="cool" o={0.3} />
    {[0, 1, 2].map((i) => <rect key={i} x={1560 + i * 44} y={560} width={34} height={140} fill={['#C8352E', '#E2B02C', '#2F6E9C'][i]} stroke={INK} strokeWidth={4} />)}
    <LightVeil id={id} lights={[[1000, 540, 620]]} o={0.4} />
  </g>
);
export const B3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, push(t, len, 1.02, 1.14))}>
    <RouterSet t={t} id="b3v" />
    <Router x={1160} y={700} s={1.5} t={t} dead />
    {fig(PIP, 650, 1250, 2, { yaw: 0.55, look: 0.6, armR: { a: 70 + Math.sin(t / 5) * 8, b: -18 }, ...faceAt(t, [[0, 'worried'], [70, 'oops']]) }, 'rimBlue', 0)}
    <NoNet x={1160} y={410} t={t - 10} s={1.1} />
  </g>
);
export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const hits = [54, 70];
  const k = hits.reduce((a, h) => Math.max(a, t >= h && t < h + 10 ? 1 - (t - h) / 10 : 0), 0);
  const ax = 1620 - k * 300;
  return (
    <g transform={camT(1120, 620 + k * 8, 2)}>
      <RouterSet t={t + 60} id="b4v" />
      <Router x={1120} y={700 + k * 6} s={1.5} t={t} dead droop={clamp((t - 70) / 8)} />
      <Arm from={[2100, 300]} to={[ax - 280, 560 + (1 - k) * -160]} w={120} />
      {t > 78 ? <g transform="translate(1120 560) scale(0.55) translate(-1120 -560)"><DizzyStars x={1120} y={560} t={t} /></g> : null}
    </g>
  );
};
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1.5], [len, 0.62]]);
  return (
    <g transform={camT(960, 640, z)}>
      <rect x={-3000} y={-3000} width={8000} height={8000} fill="#10142A" />
      <Sky id="b5" mode="night" y0={-900} y1={900} />
      <Stars seed={7} x0={-900} y0={-700} w={3800} h={1200} t={t} n={140} o={0.8} />
      <rect x={-3000} y={840} width={8000} height={3000} fill="#141A1E" />
      {[-1260, -420, 400, 1540, 2380, 3000].map((x, i) => <KHouse key={x} x={x} y={860} s={0.86 + (i % 2) * 0.08} lit={0.7} night />)}
      {[-1700, -860, 1000, 1980, 2840].map((x, i) => <Palm key={x} x={x} y={860} s={1.2} t={t + i * 20} dark />)}
      <KHouse x={960} y={860} s={1} lit={1} night />
      {[[960, 300, 8], [-420, 420, 34], [400, 420, 44], [1540, 420, 52], [-1260, 420, 72], [2380, 420, 80]].map(([x, y, d], i) => <NoNet key={i} x={x} y={y} s={1.3} t={t - d} />)}
    </g>
  );
};
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const sweep = kf(t, [[6, -1], [len - 10, 1.2]]);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#050818" />
      <Stars seed={9} x0={0} y0={0} w={1920} h={1080} t={t} n={120} o={0.8} />
      <circle cx={960} cy={560} r={430} fill="#0E2A4E" stroke="#2F6E9C" strokeWidth={5} />
      {[-0.6, -0.2, 0.2, 0.6].map((k) => <ellipse key={k} cx={960} cy={560} rx={430 * Math.sqrt(1 - k * k) * 0.999} ry={32} transform={`translate(0 ${k * 430})`} fill="none" stroke="#1E4A7E" strokeWidth={3} />)}
      {[0.25, 0.6, 0.95].map((k) => <ellipse key={k} cx={960} cy={560} rx={430 * k} ry={430} fill="none" stroke="#1E4A7E" strokeWidth={3} />)}
      {Array.from({ length: 70 }).map((_, i) => {
        const a = rnd(3, i) * Math.PI * 2;
        const r = Math.sqrt(rnd(4, i)) * 410;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        const on = x / 430 > sweep;
        return <circle key={i} cx={960 + x} cy={560 + y} r={on ? 7 : 4} fill={on ? '#FFD27E' : '#26304A'} />;
      })}
    </g>
  );
};
export const T: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1.06, 1))}>
    <Terr t={t} id="tt" night />
    {fig(PIP, 760, 880, 0.9, { yaw: 0.2, look: 0.1, armR: { a: 165, b: -8 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'worried']]) }, 'rimBlue')}
    <rect x={824} y={280} width={26} height={46} rx={4} fill="#14141C" stroke="#3A3A48" strokeWidth={3} />
    <TitleCard t={t} lines={['ഇന്റർനെറ്റ്', 'ഒരു മാസം നിന്നാൽ?']} accent="മാസം" size={132} y={160} gap={140} />
  </g>
);

// ============================================================ C. THE FUN PART
export const C1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, push(t, len, 520, 570), push(t, len, 1.04, 1.2))}>
    <Sky id="c1" mode="dusk" y0={-100} y1={700} />
    <Sun x={1500} y={430} r={90} t={t} />
    <Glow x={1500} y={430} r={500} kind="warm" o={0.6} />
    <Roofs t={t} />
  </g>
);
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const fall = kf(t, [[66, -160], [82, 300]], (x) => x * x);
  const hit = t >= 82;
  const sway = Math.sin(t / 14) * 3;
  const p: P = { x: 830, y: 500, scale: 1.25, yaw: 0.4, look: 0.1, tilt: sway, armR: { a: 172, b: -6 }, armL: { a: 70, b: -30 }, legL: { a: 60, b: 80 }, legR: { a: 30, b: 90 }, ...faceAt(t, [[0, 'worried'], [83, 'dizzy']]) };
  const h = handAt(p, 'R');
  const hd = headAt(p);
  return (
    <g>
      <Sky id="c2" mode="dusk" y0={-100} y1={1300} />
      <Glow x={1500} y={760} r={700} kind="warm" o={0.5} />
      <path d="M 730 1300 Q 800 800 780 420 L 880 420 Q 910 800 900 1300 Z" fill="#3E2A2E" stroke={INK} strokeWidth={6} />
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${760} ${500 + i * 86} q 60 16 130 0`} stroke="#2A1C22" strokeWidth={6} fill="none" />)}
      {[-160, -120, -60, -20, 30, 200, 240].map((a, i) => <path key={i} d={`M 830 360 q ${Math.cos(a / 57) * 300} ${Math.sin(a / 57) * 240 - 90} ${Math.cos(a / 57) * 620} ${Math.sin(a / 57) * 300 + 180 + sway * 3}`} stroke={i % 2 ? '#1E3A2E' : '#26492F'} strokeWidth={34} fill="none" strokeLinecap="round" />)}
      <Fig look={MO} pose={p} rimId="rimR" />
      <rect x={h.x - 13} y={h.y - 46} width={28} height={50} rx={4} fill="#14141C" stroke="#3A3A48" strokeWidth={3} />
      {!hit ? <Coconut x={hd.x + 6} y={fall} r={44} /> : <g transform={`translate(${kf(t, [[82, hd.x + 6], [120, hd.x + 420]])} ${kf(t, [[82, 200], [120, 1200]])})`}><Coconut x={0} y={0} r={44} /></g>}
      {hit ? <g transform={`translate(${hd.x} ${hd.y - 70}) scale(0.6) translate(${-hd.x} ${-hd.y + 70})`}><DizzyStars x={hd.x} y={hd.y - 70} t={t} /></g> : null}
      <NoNet x={h.x + 120} y={h.y - 30} t={t - 8} s={1.1} />
    </g>
  );
};
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t % 70, [[0, 840], [34, 1320], [70, 840]]);
  const by = 640 - Math.sin(((t % 70) / 35) * Math.PI) * 180;
  return (
    <g transform={camT(960, 560, push(t, len, 1, 1.08))}>
      <Land t={t} id="c3" mode="morning" dry={0.15} y={560} sun={[1660, 150, 80]} palms={[60, 240, 1740, 1900]} />
      <path d="M 40 900 Q 960 800 1880 900" stroke="#fff" strokeOpacity={0.14} strokeWidth={14} fill="none" />
      {[880, 906, 932].map((x) => <rect key={x} x={x} y={560} width={9} height={110} fill="#E8DCC0" stroke={INK} strokeWidth={2} />)}
      {fig(PIP, 800, 690, 0.72, { yaw: 0.6, look: 0.7, armR: { a: 80, b: -10 }, armL: { a: 70, b: -14 }, ...faceAt(t, [[0, 'happy']]) })}
      <path d="M 870 590 L 930 500" stroke="#C9A06A" strokeWidth={15} strokeLinecap="round" transform={`rotate(${Math.sin(t / 8) * 18} 860 600)`} />
      {fig(MO, 1320, 690, 0.72, { yaw: -0.6, look: -0.7, armL: { a: 120, b: -14 }, ...faceAt(t, [[0, 'happy']]) })}
      {[[1090, 780, 0.8], [520, 760, 0.7], [1520, 800, 0.84], [300, 830, 0.86], [1720, 720, 0.66]].map(([x, g, s], i) => <g key={i}>{fig(CROWD[i], x, g, s, { yaw: i % 2 ? -0.5 : 0.5, armR: { a: 40 + Math.sin(t / 7 + i) * 40, b: -20 }, expr: 'happy' })}</g>)}
      <circle cx={bx} cy={by} r={13} fill="#C8352E" stroke={INK} strokeWidth={3} />
    </g>
  );
};
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const rip = 74;
  const r = clamp((t - rip) / 10);
  const pull = t < rip ? Math.sin(t / 3) * 16 : 0;
  const a: P = { x: 210 + pull - r * 90, y: 1508 - 212 * 1.4, scale: 1.4, yaw: 0.55, look: 0.6, armR: { a: 88, b: -6 }, armL: { a: 80, b: -8 }, tilt: -5 - r * 7, ...faceAt(t, [[0, 'worried'], [rip + 2, 'shock'], [rip + 26, 'neutral']]) };
  const b: P = { x: 870 + pull + r * 90, y: 1508 - 212 * 1.4, scale: 1.4, yaw: -0.55, look: -0.6, armL: { a: 88, b: -6 }, armR: { a: 80, b: -8 }, tilt: 5 + r * 7, ...faceAt(t, [[0, 'worried'], [rip + 2, 'shock'], [rip + 26, 'neutral']]) };
  return (
    <g transform={TeaCam(t, len)}>
      <ChayaFront t={t} />
      <Counter t={t} />
      <Fig look={UNCLE} pose={a} rimId="rimR" /><Mundu pose={a} /><Tache pose={a} specs sides="#D8D4CC" />
      <Fig look={NBR} pose={b} rimId="rimL" /><Mundu pose={b} c="#3E6E8C" border="#2A4E66" /><Tache pose={b} />
      {t < rip ? <Paper x={540 + pull} y={1290} s={1.1} w={420} /> : <g><Paper x={400 + pull - r * 150} y={1310} s={1.06} w={220} rot={-8 * r} /><Paper x={680 + r * 150} y={1310} s={1.06} w={220} rot={186 * clamp((t - rip - 20) / 8)} /></g>}
    </g>
  );
};
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const m: P = { x: 660, y: 880 - 212 * 0.84, scale: 0.84, yaw: 0.6, look: 0.8, armR: { a: 168, b: -6 }, ...faceAt(t, [[0, 'neutral']]) };
  const hk = t > 110 ? 1 : 0;
  const hm: P = { x: 1130, y: 800 - 212 * 0.5 - 40, scale: 0.92, yaw: -0.55, look: -0.7, legL: { a: 78, b: -78 }, legR: { a: 78, b: -78 }, armL: { a: 20 + hk * 118, b: hk ? -100 : -20 }, armR: { a: 16, b: -14 }, ...faceAt(t, [[0, 'neutral'], [110, 'tired']]) };
  const hh = handAt(m, 'R');
  return (
    <g transform={camT(push(t, len, 900, 960), 560, push(t, len, 1.06, 1.12))}>
      <Land t={t} id="c5" mode="dusk" dry={0.2} y={700} sun={[220, 470, 90]} palms={[-40, 1920]} />
      <KHouse x={1420} y={790} s={1.05} lit={1} door={0.4} />
      <rect x={1030} y={790} width={280} height={18} fill="#6E4E36" stroke={INK} strokeWidth={4} />
      <rect x={1040} y={720} width={18} height={92} fill="#4A3628" /><rect x={1280} y={720} width={18} height={92} fill="#4A3628" />
      <Line x0={-300} g0={840} s0={0.62} x1={520} g1={880} s1={0.82} n={8} t={t} seed={6} />
      <Fig look={MO} pose={m} rimId="rimR" />
      <Placard x={hh.x + 10} y={hh.y - 20} s={0.84} text="വൈഫൈ" text2="പാസ്‌വേഡ്?" w={330} />
      <Fig look={UNCLE} pose={hm} rimId="rimL" />
      <Tache pose={hm} specs sides="#D8D4CC" />
      <Mundu pose={{ ...hm, y: (hm.y as number) + 30 }} />
      <Placard x={1560} y={640} s={0.74} text="സംശയം?" text2="ഇവിടെ" c="#F2C53D" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={980 - (i % 2) * 8} y={760 - i * 24} width={92} height={22} fill={['#C8352E', '#2F6E9C', '#2E7E5A'][i % 3]} stroke={INK} strokeWidth={3} />)}
    </g>
  );
};
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const swipe = 118;
  const up = kf(t, [[swipe, 0], [swipe + 9, 1300]], (x) => x * x);
  const dance = Math.sin(t / 5);
  const m: P = { x: 700, y: 900 - 212 * 1.05, scale: 1.05, yaw: 0.15, look: 0.1, tilt: dance * 8, armR: { a: 130 + dance * 34, b: -40 }, armL: { a: 120 - dance * 34, b: 34 }, legL: { a: 18 + dance * 14, b: 14 }, legR: { a: -18 + dance * 14, b: 14 }, glasses: 1, ...faceAt(t, [[0, 'cool']]) };
  const gArm = t > swipe - 26;
  const ga = kf(t, [[swipe - 26, 30], [swipe - 6, 90], [swipe + 6, 168]]);
  const g: P = { x: 1240, y: 900 - 212 * 0.95, scale: 0.95, yaw: -0.6, look: -0.7, armL: { a: gArm ? ga : 14, b: -8 }, handL: 'point', ...faceAt(t, [[0, 'tired'], [swipe + 16, 'smug']]) };
  return (
    <g transform={camT(960, 540, push(t, len, 1.02, 1.1))}>
      <Land t={t} id="c6" mode="dusk" dry={0.2} y={640} sun={[1660, 420, 90]} palms={[-30, 1950]} hills={false} />
      <rect x={-3000} y={760} width={8000} height={2000} fill="#5A5460" />
      <g transform="translate(960 900) scale(0.88) translate(-540 -1540)" opacity={1}><g transform="translate(540 1540)"><BusShelter x={0} y={0} /></g></g>
      <g transform={`translate(0 ${-up})`}>
        <Fig look={MO} pose={m} rimId="rimR" />
        <ReelFrame x={700} y={640} s={0.82} />
      </g>
      <Fig look={GRAN} pose={g} rimId="rimL" />
      <Mundu pose={g} />
      {fig(CROWD[3], 1440, 900, 0.95, { yaw: -0.5, look: -0.7, expr: 'neutral' }, 'rimL')}
      {fig(CROWD[0], 280, 910, 0.98, { yaw: 0.5, look: 0.7, expr: t > swipe + 10 ? 'shock' : 'neutral' })}
      {t > swipe + 2 && t < swipe + 22 ? <path d={`M 700 ${620 - (t - swipe) * 20} v 300`} stroke="#fff" strokeWidth={22} opacity={0.5} strokeLinecap="round" /> : null}
    </g>
  );
};
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const a = stand(KITCHEN, 0.36, 0.4);
  const b = stand(KITCHEN, 0.56, 0.4);
  const c = stand(KITCHEN, 0.72, 0.4);
  const up = clamp((t - 30) / 8);
  return (
    <g transform={camT(980, 520, push(t, len, 1.4, 1.52))}>
      <Kitchen t={t + 40} id="c7" veil={0.4} />
      <Fig look={PIP} pose={{ ...a, yaw: 0.4, look: 0.5, headTilt: 14 - up * 14, armR: { a: 40, b: -60 }, ...faceAt(t, [[0, 'neutral'], [34, 'happy']]) }} rimId="rimR" />
      <Fig look={SIS} pose={{ ...c, scale: c.scale * 0.72, y: c.y + 36, yaw: -0.4, look: -0.6, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" />
      <Fig look={MOM} pose={{ ...b, yaw: -0.3, look: -0.7, armR: { a: 50, b: -40 }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" />
      <KitchenIsland stools={false} />
      {[0.34, 0.44, 0.66].map((u, i) => { const p = islandTop(u, 0.3); return <g key={i}><SteelPlate x={p.x} y={p.y} s={0.6} /></g>; })}
      {(() => { const p = islandTop(0.52, 0.5); return <g><rect x={p.x - 38} y={p.y - 8} width={76} height={18} rx={5} fill="#14141C" stroke="#3A3A48" strokeWidth={3} /><Cobweb x={p.x - 30} y={p.y - 6} r={46} /></g>; })()}
    </g>
  );
};
export const C8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1.12, 1.26))}>
    <Terr t={t + 40} id="c8" />
    <g transform="translate(960 800) scale(0.82) translate(-960 -800)"><Carrom x={960} y={700} s={1} t={t} /></g>
    {fig(PIP, 690, 920, 0.95, { yaw: 0.5, look: 0.5, armR: { a: 66, b: -34 }, ...faceAt(t, [[0, 'happy']]) })}
    {fig(MO, 1230, 920, 0.95, { yaw: -0.5, look: -0.5, armL: { a: 66, b: -34 }, ...faceAt(t, [[0, 'happy']]) }, 'rimR')}
  </g>
);

// ============================================================ D. THE TURN: MONEY, RATION, PAY
const teaPip = (t: number, extra: P): P => ({ x: 300, y: 1508 - 212 * 1.4, scale: 1.4, yaw: 0.55, look: 0.6, ...extra });
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const p = teaPip(t, { armR: { a: kf(t, [[34, 18], [52, 92]], easeOut), b: -8 }, ...faceAt(t, [[0, 'happy']]) });
  const h = handAt(p, 'R');
  return (
    <g transform={TeaCam(t, len, 500)}>
      <ChayaFront t={t} />
      {fig(TEAMAN, 700, 1400, 1.2, { yaw: -0.5, look: -0.6, armL: { a: 30, b: -40 } }, 'rimL', 0)}
      <Counter t={t} />
      <QRStand x={560} y={1140} s={0.42} />
      <TeaGlass x={380} y={1140} s={1.1} fill={0.1} t={t} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <rect x={h.x - 16} y={h.y - 52} width={34} height={62} rx={5} fill="#14141C" stroke="#3A3A48" strokeWidth={3} />
    </g>
  );
};
export const D2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Tabletop edge={1300} />
    <g transform="translate(1320 960) scale(1.5)"><QRStand x={0} y={0} /></g>
    <Arm from={[-300, 1300]} to={[520, 760]} w={130} />
    <ScreenPhone x={640} y={520} s={1.24} rot={8} id="d2" bg="#17121E">
      <Spinner x={0} y={-70} r={72} t={t} />
      <text y={90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FF7A6A">നെറ്റ്‌വർക്ക് ഇല്ല</text>
    </ScreenPhone>
  </g>
);
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const po = clamp((t - 8) / 8);
  const p = teaPip(t, { x: 420, armR: { a: 22, b: -8 }, armL: { a: 22, b: -8 }, ...faceAt(t, [[0, 'oops'], [50, 'worried']]) });
  const glare = t > 52;
  const my = 1000 - t * 2.4;
  return (
    <g transform={camT(560, 1060, push(t, len, 1.5, 1.72))}>
      <ChayaFront t={t + 60} />
      {fig(TEAMAN, 760, 1400, 1.2, { yaw: -0.5, look: -0.6, armL: { a: 90, b: -8 }, handL: 'open', expr: glare ? 'smug' : 'neutral' }, 'rimL', 0)}
      <Tache pose={{ x: 760, y: 1400 - 212 * 1.2, scale: 1.2, yaw: -0.5 }} />
      <Counter t={t + 60} />
      <QRStand x={640} y={1140} s={0.42} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <path d={`M 356 ${1222 + po * 6} q -34 ${po * 66} 14 ${po * 76} q 26 ${-po * 18} 6 ${-po * 76} Z M 484 ${1222 + po * 6} q 34 ${po * 66} -14 ${po * 76} q -26 ${-po * 18} -6 ${-po * 76} Z`} fill="#EFE8D8" stroke={INK} strokeWidth={4} />
      {t > 22 ? <g transform={`translate(${420 + Math.sin(t / 3) * 34} ${1250 - (t - 22) * 4})`}><path d={`M 0 0 q -20 ${-14 + Math.sin(t) * 10} -30 2 q 12 12 30 -2 q 20 ${-14 + Math.sin(t) * 10} 30 2 q -12 12 -30 -2`} fill="#C9B69A" stroke={INK} strokeWidth={2} /></g> : null}
    </g>
  );
};
export const D4: React.FC<ShotProps> = ({ t }) => (
  <Sch t={t} id="d4">
    <SchLabel x={960} y={190} t={t - 2} text="ഒക്ടോബർ 2026 · യുപിഐ ഇടപാടുകൾ" size={52} anchor="middle" />
    <CountUp x={960} y={600} t={t - 60} to={2547} dur={70} size={270} color={SCH.glow} suffix=" കോടി" />
    <SchLabel x={960} y={900} t={t - 120} text="ചായ മുതൽ ചിട്ടി വരെ" size={46} color={SCH.dim} anchor="middle" />
  </Sch>
);
export const D5: React.FC<ShotProps> = ({ t, len }) => (
  <Sch t={t + 200} id="d5">
    {Array.from({ length: 16 * 8 }).map((_, i) => {
      const x = 240 + (i % 16) * 96;
      const y = 300 + Math.floor(i / 16) * 72;
      const die = 40 + rnd(5, i) * (len - 40);
      return <circle key={i} cx={x} cy={y} r={15} fill={t < die ? SCH.glow : '#26304A'} />;
    })}
    <Say y={210} text="ഒരു ദിവസം 82 കോടി" size={100} color="#F6EFE3" />
  </Sch>
);
export const D6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 1100, 1000), 560, push(t, len, 1.08, 1))}>
    <Kavala t={t + 120} id="d6" mode="dusk" sun={[420, 420, 90]} />
    <g transform="translate(1500 790) scale(0.86)"><AtmKiosk x={0} y={0} /></g>
    <Line x0={1320} g0={800} s0={0.68} x1={-200} g1={990} s1={1.1} n={14} t={t} seed={12} />
    {/* a man who came prepared: a mat and a pillow */}
    <rect x={560} y={1010} width={360} height={36} rx={8} fill="#2E7E5A" stroke={INK} strokeWidth={4} />
    <ellipse cx={600} cy={998} rx={50} ry={22} fill="#EFE8D8" stroke={INK} strokeWidth={4} />
    <circle cx={622} cy={972} r={32} fill="#C69A74" stroke={INK} strokeWidth={4} />
    <path d="M 650 980 Q 780 950 900 1006 L 650 1012 Z" fill="#7A5A8C" stroke={INK} strokeWidth={4} />
  </g>
);
export const D7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#232C3E" />
    <rect x={420} y={90} width={1080} height={760} rx={26} fill="#3A4256" stroke={INK} strokeWidth={8} />
    <rect x={500} y={160} width={920} height={500} rx={10} fill={t > 26 ? '#0E2238' : '#1E5A9C'} stroke={INK} strokeWidth={6} />
    {t > 26 ? <Say y={460} text="പണമില്ല" size={170} color="#FF5A4A" t={t - 26} /> : <Spinner x={960} y={410} r={70} t={t} />}
    <Glow x={960} y={410} r={700} kind="cool" o={0.4} />
    <rect x={640} y={720} width={640} height={44} rx={8} fill="#14141C" />
    {t > 60 ? <g transform={`translate(0 ${kf(t, [[60, -30], [78, 10]], easeOut)})`}><Spider x={960} y={760} top={722} s={1.3} /></g> : null}
    <Soft>{fig(PIP, 1720, 1460, 3, { yaw: -0.8, look: -0.8 }, 'rimBlueL', 0)}</Soft>
  </g>
);
const RationIn: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <rect x={-400} y={-300} width={2800} height={1900} fill="#5A4A3E" />
    {[300, 520].map((y) => <rect key={y} x={-400} y={y} width={2800} height={20} fill="#3A2C22" />)}
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={160 + i * 134} y={200} width={94} height={100} rx={6} fill={['#C9842E', '#D9B45A', '#8A5A3E'][i % 3]} opacity={0.6} />)}
    <Sack x={300} y={830} s={1.3} /><Sack x={560} y={850} s={1.4} /><Sack x={1660} y={830} s={1.3} /><Sack x={430} y={620} s={1.1} /><Sack x={1540} y={640} s={1} label="ഗോതമ്പ്" />
    <Glow x={960} y={100} r={800} kind="warm" o={0.6} />
    <LightVeil id={id} lights={[[960, 300, 700]]} o={0.32} />
  </g>
);
export const D8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1, 1.1))}>
    <RationIn t={t} id="d8v" />
    {fig(SHOPKEEPER, 980, 1000, 1, { yaw: -0.4, look: -0.5, armL: { a: 44, b: -40 }, ...faceAt(t, [[0, 'worried']]) }, 'rimL', 0)}
    <rect x={500} y={800} width={1000} height={400} fill="#5E3C2A" stroke={INK} strokeWidth={6} />
    <rect x={480} y={780} width={1040} height={28} fill="#8A5E3E" stroke={INK} strokeWidth={5} />
    <EPos x={1160} y={782} s={0.72} t={t} />
    {fig(MOM, 330, 1120, 1.24, { yaw: 0.55, look: 0.7, armR: { a: 60, b: -24 }, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0)}
  </g>
);
export const D9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#5E3C2A" />
    <g transform="translate(960 1060) scale(3.2)"><EPos x={0} y={0} t={t} /></g>
    <Arm from={[-300, 1320]} to={[kf(t, [[0, 640], [14, 830]], easeOut), 800]} c="#C87A8E" skin="#D0A67E" w={118} />
  </g>
);
export const D10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Sky id="d10" mode="dusk" y0={0} y1={820} />
    <rect x={-200} y={760} width={2400} height={500} fill="#3A3440" />
    {Array.from({ length: 10 }).map((_, i) => {
      const down = [1, 3, 4, 6, 8, 9].includes(i);
      const ix = [1, 3, 4, 6, 8, 9].indexOf(i);
      return <Shop key={i} x={126 + i * 185} y={770} s={1} shut={down ? kf(t, [[80 + ix * 26, 0], [98 + ix * 26, 1]], easeOut) : 0} />;
    })}
    <Say y={320} t={t - 200} text="60% ലേറെ കടകൾ അടഞ്ഞു" size={92} color="#FFE27A" />
    <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={46} fill="#F6EFE3" opacity={0.8}>ഒരു മെഷീൻ തകരാർ മാത്രം</text>
  </g>
);
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const flip = clamp((t - 8) / 10);
  const dp: P = { yaw: -0.45, look: -0.3, armL: { a: 70, b: -60 }, ...faceAt(t, [[0, 'neutral'], [100, 'worried']]) };
  const dh = handAt({ x: 1240, y: 960 - 212 * 1.36, scale: 1.36, ...dp }, 'L');
  return (
    <g transform={camT(960, 520, push(t, len, 1.04, 1.2))}>
      <Room t={t} id="d11">
        <g transform="translate(620 430)">
          <rect x={-170} y={-230} width={340} height={440} fill="#F6EFE3" stroke={INK} strokeWidth={6} />
          <rect x={-170} y={-230} width={340} height={80} fill="#C8352E" />
          <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={250} fill="#1A1230">{flip > 0.5 ? 1 : 30}</text>
        </g>
      </Room>
      {fig(DAD, 1240, 960, 1.36, dp, 'rimL', 0)}
      <rect x={dh.x - 17} y={dh.y - 52} width={34} height={60} rx={5} fill="#14141C" stroke="#3A3A48" strokeWidth={3} />
    </g>
  );
};
export const D12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1, 1.1))}>
    <rect x={-400} y={-300} width={2800} height={1900} fill="#4A4A5A" />
    <rect x={-400} y={700} width={2800} height={900} fill="#3A3644" />
    {[300, 700, 1100, 1500].map((x) => <g key={x}><rect x={x - 90} y={110} width={180} height={230} fill="#BFE4F4" opacity={0.5} stroke={INK} strokeWidth={5} /><Fan x={x} y={70} s={0.5} spin={t} /></g>)}
    {[0, 1, 2].map((r) => Array.from({ length: 6 }).map((_, i) => {
      const s = 0.58 + r * 0.2;
      const x = 180 + i * 310 + (r % 2) * 90;
      const g = 690 + r * 150;
      return <g key={`${r}${i}`}>
        {fig(CROWD[(i + r) % 5], x, g, s, { yaw: 0.2, look: 0, armR: { a: 40, b: -70 }, armL: { a: 40, b: -70 }, expr: 'neutral', headTilt: 9 })}
        <rect x={x - 120 * s} y={g - 90 * s} width={240 * s} height={18} fill="#6E4E36" stroke={INK} strokeWidth={3} />
        <Glow x={x} y={g - 120 * s} r={60} kind="cool" o={0.5} />
      </g>;
    }))}
    <Say y={230} t={t - 20} text="5 ലക്ഷത്തിലേറെ ശമ്പളം" size={92} color="#FFE27A" />
    <Say y={980} t={t - 180} text="മെസേജ്: 0" size={84} color="#FF7A6A" />
  </g>
);
export const D13: React.FC<ShotProps> = ({ t }) => (
  <Sch t={t} id="d13">
    <SchLabel x={960} y={180} t={t - 2} text="കേരള ബജറ്റ് · 2017" size={54} anchor="middle" />
    <g transform="translate(420 520)" opacity={clamp((t - 60) / 8)}>
      <path d="M 0 -130 Q 92 -10 92 44 A 92 92 0 0 1 -92 44 Q -92 -10 0 -130 Z" fill="none" stroke="#6FD0E0" strokeWidth={9} />
      <text y={210} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3">വെള്ളം</text>
    </g>
    <g transform="translate(960 520)" opacity={clamp((t - 78) / 8)}>
      <path d="M -130 -20 H 130 Q 120 110 0 110 Q -120 110 -130 -20 Z M -90 -20 Q 0 -130 90 -20" fill="none" stroke="#FFE27A" strokeWidth={9} />
      <text y={210} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3">ഭക്ഷണം</text>
    </g>
    <g transform="translate(1500 520)" opacity={clamp((t - 96) / 8)}>
      {[0, 1, 2].map((i) => <path key={i} d={`M ${-120 + i * 40} ${-i * 34 - 2} A ${120 - i * 40} ${120 - i * 40} 0 0 1 ${120 - i * 40} ${-i * 34 - 2}`} transform={`translate(0 ${i * 34 + 60})`} fill="none" stroke={SCH.glow} strokeWidth={10} strokeLinecap="round" />)}
      <circle cy={70} r={15} fill={SCH.glow} />
      <text y={210} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3">ഇന്റർനെറ്റ്</text>
    </g>
    <Say y={960} t={t - 130} text="അടിസ്ഥാന അവകാശം" size={84} color={SCH.glow} />
  </Sch>
);

// ============================================================ E. WHERE IT ACTUALLY IS
export const E1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 640], [len, 420]]), push(t, len, 1.2, 1))}>
    <Terr t={t + 100} id="e1" />
    {fig(PIP, 800, 930, 1, { yaw: 0.3, look: 0.2, headTilt: -10, armR: { a: 18, b: -10 }, ...faceAt(t, [[0, 'worried']]) })}
    {fig(MO, 1090, 930, 1, { yaw: -0.3, look: -0.2, headTilt: 10, ...faceAt(t, [[0, 'worried']]) })}
    <Say y={210} t={t - 68} text="ആകാശത്തല്ല" size={110} color="#FF7A6A" />
    {t > 68 ? <path d="M 660 150 L 1260 230" stroke="#FF4A3E" strokeWidth={12} strokeLinecap="round" opacity={clamp((t - 70) / 5)} /> : null}
  </g>
);
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const dy = kf(t, [[0, 0], [58, 1260]], easeOut);
  return (
    <g>
      <g transform={`translate(0 ${-dy})`}>
        <Sky id="e2" mode="dusk" y0={-300} y1={380} />
        <Water t={t} y={380} />
        <g transform="translate(0 1260)">
          <SeaBed id="e2b" t={t} y={880} />
          <Cable y={830} t={t} />
          {[[1100, 500, 1.4, -1], [1400, 300, 1, -1]].map(([x, y, s, d], i) => <g key={i}><Fish x={(x as number) - t * 2 * (i + 1)} y={y} s={s} dir={d as 1 | -1} c={i ? '#6FD0E0' : '#E8A23E'} /></g>)}
          {/* the one who stopped to look at it */}
          {t > 60 ? <g transform={`translate(${kf(t, [[60, 2100], [100, 1240]], easeOut)} 740)`}><Fish x={0} y={0} s={1.6} dir={-1} c="#E8703E" /></g> : null}
        </g>
      </g>
    </g>
  );
};
const NODES: [number, number, string][] = [[300, 360, 'യൂറോപ്പ്'], [760, 620, 'ഗൾഫ്'], [1190, 690, 'ഇന്ത്യ'], [1640, 780, 'സിംഗപ്പൂർ'], [1660, 330, 'ജപ്പാൻ'], [190, 800, 'ആഫ്രിക്ക']];
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [5, 1], [5, 2], [0, 5]];
  return (
    <Sch t={t} id="e3">
      {links.map(([a, b], i) => {
        const [x0, y0] = NODES[a];
        const [x1, y1] = NODES[b];
        const d = `M ${x0} ${y0} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2 + 90} ${x1} ${y1}`;
        return <DrawOn key={i} d={d} t={t - 8 - i * 7} dur={20} color="#6FD0E0" width={6} />;
      })}
      {NODES.map(([x, y, n], i) => <g key={n} opacity={clamp((t - i * 5) / 7)}><circle cx={x} cy={y} r={20} fill={SCH.glow} /><text x={x} y={y - 38} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F6EFE3">{n}</text></g>)}
      <Say y={230} t={t - 60} text="99%" size={180} color={SCH.glow} />
      <SchLabel x={960} y={1000} t={t - 90} text="രാജ്യങ്ങൾക്കിടയിലെ ഡാറ്റ, കടലിനടിയിലൂടെ" size={44} anchor="middle" />
    </Sch>
  );
};
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const ear = t > 40;
  return (
    <g transform={camT(push(t, len, 900, 1040), 600, push(t, len, 1.02, 1.16))}>
      <Sky id="e4" mode="dusk" y0={0} y1={640} />
      <Sun x={560} y={510} r={80} t={t} />
      <Water t={t} y={600} />
      <g transform="translate(540 -640) scale(0.74)"><ChinaNet bx={260} by={1560} /></g>
      <path d="M -300 880 Q 800 700 2400 760 V 1600 H -300 Z" fill="#C9A87A" stroke={INK} strokeWidth={5} />
      {/* the cable comes out of the sea to a small grey hut */}
      <path d="M 300 760 Q 860 930 1500 860" stroke="#14141C" strokeWidth={26} fill="none" />
      <path d="M 300 760 Q 860 930 1500 860" stroke="#3E4256" strokeWidth={16} fill="none" />
      <rect x={1470} y={640} width={320} height={240} fill="#8A8E9C" stroke={INK} strokeWidth={6} />
      <rect x={1580} y={720} width={90} height={160} fill="#4A4E5C" stroke={INK} strokeWidth={5} />
      <Placard x={1630} y={620} s={0.7} text="കേബിൾ" w={300} />
      {fig(MO, 860, 1020, 0.98, { yaw: 0.2, tilt: ear ? 62 : 0, look: 0.3, ...faceAt(t, [[0, 'neutral'], [70, 'shock']]), armR: { a: 40, b: -40 } }, 'rimR', 0)}
      <Crab x={1090} y={886} s={1.1} t={t} />
      <Say y={210} t={t - 14} x={1030} text="കൊച്ചി · തിരുവനന്തപുരം" size={72} color="#FFE27A" />
    </g>
  );
};
export const E5: React.FC<ShotProps> = ({ t, len }) => {
  const e = kf(t, [[56, 0.02], [150, 1]], easeOut);
  return (
    <g transform={camT(960, 560, push(t, len, 1.04, 1))}>
      <Sky id="e5" mode="storm" y0={0} y1={760} />
      <Water t={t} y={760} rough={2} night />
      <Volcano x={1100} y={790} e={e} t={t} />
      {t > 90 ? <Bolt x={980} y={120} t={t} t0={100} seed={3} h={520} /> : null}
      {t > 90 ? <Bolt x={1320} y={100} t={t} t0={132} seed={6} h={480} /> : null}
    </g>
  );
};
export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const snap = 22;
  const s = clamp((t - snap) / 10);
  return (
    <g transform={camT(960, 680, push(t, len, 1.2, 1.3))}>
      <SeaBed id="e6" t={t} y={880} dark={0.15} />
      <g transform={`translate(${-s * 80} ${s * 22})`}><Cable y={820} t={t} pulse={1 - s} x1={940} w={46} /></g>
      <g transform={`translate(${s * 80} ${s * 22})`}><Cable y={816} t={t} pulse={0} x0={980} w={46} /></g>
      {t > snap && t < snap + 24 ? <g><Glow x={960} y={826} r={340} kind="warm" o={1 - (t - snap) / 24} /><circle cx={960} cy={826} r={(t - snap) * 8} fill="none" stroke="#FFE9A8" strokeWidth={6} opacity={1 - (t - snap) / 24} /></g> : null}
      <Say y={430} t={t - 6} text="ആകെ ഒരു കേബിൾ" size={88} color="#F6EFE3" />
    </g>
  );
};
export const E7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 580, push(t, len, 1, 1.12))}>
    <Sky id="e7" mode="night" y0={0} y1={760} />
    <Stars seed={3} x0={0} y0={0} w={1920} h={640} t={t} n={120} o={0.8} />
    <Water t={t} y={760} night />
    <path d="M 340 800 Q 960 590 1580 800 Z" fill="#3A3644" stroke={INK} strokeWidth={5} />
    <Palm x={640} y={730} s={0.72} t={t} dark /><Palm x={1320} y={740} s={0.62} t={t + 40} dark />
    {fig(CROWD[0], 960, 690, 0.56, { yaw: 0.1, armR: { a: 168, b: -6 }, ...faceAt(t, [[0, 'worried']]) }, 'rimBlue', 0.3)}
    <Say y={230} t={t - 8} text="5 ആഴ്ച" size={150} color="#FFE27A" />
  </g>
);
export const E8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1, 1.08))}>
    <Land t={t} id="e8" mode="grey" dry={0.12} y={690} sun={[0, 0, 0]} palms={[]} />
    <path d="M -300 900 Q 960 720 2300 930 V 1500 H -300 Z" fill="#3E5E44" stroke={INK} strokeWidth={4} />
    {fig(CROWD[4], 780, 880, 0.96, { yaw: 0.4, look: 0.1, armR: { a: 168, b: -6 }, ...faceAt(t, [[0, 'worried']]) })}
    <rect x={846} y={500} width={26} height={46} rx={4} fill="#14141C" stroke="#3A3A48" strokeWidth={3} />
    <g transform="translate(1320 430)">
      <CountUp x={0} y={0} t={t - 130} to={83} dur={50} size={220} color="#FFE27A" />
      <Say x={0} y={110} t={t - 150} text="ദിവസം" size={80} />
    </g>
  </g>
);
export const E9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 500, push(t, len, 1.06, 1.2))}>
    <Classroom t={t} id="e9" empty />
    <Say x={800} y={160} t={t - 16} text="പരീക്ഷ കഴിഞ്ഞു" size={88} color="#FF9A7A" />
    {t > 50 ? <Cobweb x={1120} y={700} r={90} /> : null}
  </g>
);

// ============================================================ F. THE OLD WORLD COMES BACK
export const F1: React.FC<ShotProps> = ({ t, len }) => {
  const dn = kf(t, [[6, -180], [64, 380]], easeOut);
  const puff = clamp((t - 112) / 40);
  return (
    <g transform={camT(960, 500, push(t, len, 1.04, 1.16))}>
      <Room t={t + 40} id="f1">
        <rect x={700} y={-120} width={520} height={120} fill="#14101C" stroke={INK} strokeWidth={5} />
      </Room>
      <line x1={960} y1={-40} x2={960} y2={dn} stroke="#C9B69A" strokeWidth={5} />
      <Radio x={960} y={dn + 200} s={1} t={t} on={t > 140 ? 1 : 0} />
      {t > 112 && t < 170 ? [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={760 + i * 100 + puff * (i - 2) * 50} cy={500 - puff * 90 - i * 8} r={24 + puff * 54} fill="#D8C8B0" opacity={0.5 * (1 - puff)} />) : null}
      {fig(PIP, 500, 1020, 1.26, { yaw: 0.6, look: 0.4, headTilt: -8, armR: { a: 88, b: -34 }, ...faceAt(t, [[0, 'neutral'], [140, 'happy']]) }, 'rimR', 0)}
      {fig(GRAN_LOOK, 1420, 1020, 1.2, { yaw: -0.55, look: -0.5, ...faceAt(t, [[0, 'happy']]) }, 'rimL', 0)}
    </g>
  );
};
const GRAN_LOOK = GRAN;
export const F2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1120, 620, push(t, len, 1.36, 1.5))}>
    <Kavala t={t + 200} id="f2" mode="morning" sun={[240, 170, 80]} />
    <g transform="translate(0 40)">
      <PostBox x={1360} y={830} s={1.1} />
      {Array.from({ length: 16 }).map((_, i) => <Letter key={i} x={1180 + rnd(3, i) * 380} y={880 - rnd(4, i) * 50} rot={(rnd(5, i) - 0.5) * 60} />)}
      <g transform={`translate(0 ${Math.sin(t / 3) * 3})`}><Letter x={1360} y={520} rot={8} /><Letter x={1320} y={500} rot={-12} /><Letter x={1404} y={494} rot={20} /></g>
      <Line x0={1180} g0={880} s0={0.86} x1={420} g1={940} s1={1.04} n={6} t={t} seed={9} />
    </g>
  </g>
);
export const F3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 560, push(t, len, 1, 1.1))}>
    <Terr t={t} id="f3" night />
    <Aerial x={1540} y={820} t={t} />
    <rect x={840} y={800} width={480} height={22} fill="#6E4E36" stroke={INK} strokeWidth={4} />
    <rect x={860} y={822} width={16} height={130} fill="#4A3628" /><rect x={1284} y={822} width={16} height={130} fill="#4A3628" />
    <HamRig x={1080} y={800} s={0.92} t={t} />
    {fig(NBR, 720, 960, 1, { yaw: 0.55, look: 0.7, armR: { a: 76, b: -16 }, ...faceAt(t, [[0, 'neutral']]) }, 'rimBlue')}
    <path d="M 650 580 Q 720 500 790 580" stroke="#1E1A28" strokeWidth={10} fill="none" />
    <Line x0={560} g0={950} s0={0.84} x1={-220} g1={980} s1={0.98} n={6} t={t} seed={7} />
  </g>
);
export const F4: React.FC<ShotProps> = ({ t, len }) => {
  const up = clamp((t - 96) / 14);
  const sx = kf(t, [[126, 1260], [168, 2100]]);
  return (
    <g transform={camT(1130, 520, push(t, len, 1.16, 1.3))}>
      <Kavala t={t + 300} id="f4" />
      <Booth x={1130} y={800} s={1.06} web={1 - up} lit={up} />
      {/* the old shutter */}
      <g transform={`translate(0 ${-up * 480})`}>
        <rect x={960} y={280} width={340} height={520} fill="#6A6E7C" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={960} x2={1300} y1={300 + i * 32} y2={300 + i * 32} stroke="#4A4E5C" strokeWidth={4} />)}
      </g>
      {fig(PIP, 780, 880, 1, { yaw: 0.6, look: 0.7, ...faceAt(t, [[0, 'worried'], [110, 'happy']]) })}
      {fig(TEAMAN, 1000, 880, 1, { yaw: 0.5, look: 0.5, armR: { a: 110 - up * 40, b: -10 }, tilt: 8 - up * 8 })}
      {t > 120 ? <g transform={`translate(${sx} 800)`}><Spider x={0} y={0} top={760} s={1.1} /><Suitcase x={40} y={10} s={0.3} /></g> : null}
      <Say x={730} y={230} t={t - 2} text="വിദേശ വിളി: ഇല്ല" size={58} color="#FF7A6A" />
    </g>
  );
};
export const F5: React.FC<ShotProps> = ({ t, len }) => {
  const s = Math.floor(t / 6) % 60;
  return (
    <g transform={camT(1540, 300, push(t, len, 2.5, 2.8))}>
      <BoothIn t={t} meter={`00:${String(s).padStart(2, '0')}`} />
    </g>
  );
};

// ============================================================ G. THE GULF
export const G1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(860, 560, push(t, len, 1.12, 1.24))}>
    <Land t={t} id="g1" mode="haze" dry={0.4} y={640} sun={[1660, 180, 90]} palms={[-40, 1900]} />
    <KHouse x={1320} y={770} s={0.98} lit={0} door={0.3} />
    <rect x={-400} y={790} width={1160} height={18} fill="#A6968A" stroke={INK} strokeWidth={4} />
    <rect x={-400} y={700} width={1140} height={92} fill="#8E8074" stroke={INK} strokeWidth={4} />
    {fig(MOM, 800, 910, 1.02, { yaw: -0.55, look: -0.8, armL: { a: 44, b: -24 }, ...faceAt(t, [[0, 'worried']]) }, 'rimR')}
  </g>
);
export const G2: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / 60);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0C1028" />
      <Stars seed={5} x0={0} y0={0} w={1920} h={560} t={t} n={80} o={0.7} />
      <g transform="translate(-40 -880) scale(0.72 1.1) translate(0 -80)"><Towers t={t} y={1800} /></g>
      <Palm x={1660} y={1000} s={1.1} t={t} dark />
      <KHouse x={1420} y={1010} s={0.6} lit={1} night />
      {Array.from({ length: 7 }).map((_, i) => {
        const k = ((t * 0.012 + i / 7) % 1);
        const x = 620 + 760 * k;
        const y = 760 - Math.sin(k * Math.PI) * 330;
        return <g key={i} transform={`translate(${x} ${y}) scale(0.32)`}><Notes x={0} y={0} n={1} /></g>;
      })}
      <Say x={960} y={190} t={t - 6} text="22 ലക്ഷം മലയാളികൾ" size={96} color="#F6EFE3" />
      <Say x={960} y={1000} t={t - 110} text="₹2,16,893 കോടി · 2023" size={92} color="#FFE27A" />
    </g>
  );
};
export const G3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 440, push(t, len, 1.1, 1.3))}>
    <Room t={t} id="g3" bulb={0.75}>
      <Frame x={960} y={420} s={1.1} />
      <path d="M 700 830 h 520" stroke="#231A24" strokeWidth={4} />
    </Room>
    {/* the plastic chair where he sits on visits */}
    <path d="M 640 700 L 620 900 M 800 700 L 820 900" stroke="#A82C26" strokeWidth={14} />
    <path d="M 610 690 Q 720 650 830 690 L 826 730 Q 720 700 616 730 Z" fill="#C8352E" stroke={INK} strokeWidth={4} />
  </g>
);
export const G4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 570, push(t, len, 1.04, 1.16))}>
    <rect x={-400} y={-300} width={2800} height={1900} fill="#3E4656" />
    <rect x={-400} y={880} width={2800} height={900} fill="#2C3040" />
    <g><rect x={1240} y={180} width={440} height={340} fill="#0C1028" stroke={INK} strokeWidth={6} /><g transform="translate(1240 -1240) scale(0.42 1)"><Towers t={t} y={1760} /></g></g>
    <rect x={1240} y={520} width={440} height={16} fill="#6A6E7C" />
    <Bunk x={700} y={880} s={1.14} />
    <Bunk x={-160} y={880} s={1.14} />
    <rect x={1320} y={700} width={260} height={180} fill="#6E4E36" stroke={INK} strokeWidth={5} />
    <Suitcase x={1450} y={700} s={0.9} c="#2F6E9C" />
    {fig(DAD, 640, 880, 1.06, { yaw: 0.35, look: 0.2, headTilt: 12, legL: { a: 78, b: -78 }, legR: { a: 78, b: -78 }, y: 650, armR: { a: 44, b: -80 }, armL: { a: 44, b: -80 }, ...faceAt(t, [[0, 'tired']]) }, 'rimBlue', 0)}
    <Glow x={720} y={590} r={220} kind="cool" o={0.7} />
    <LightVeil id="g4v" lights={[[720, 580, 420], [1460, 340, 340]]} o={0.42} />
  </g>
);
export const G5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#0E0C18" />
    <Glow x={960} y={540} r={640} kind="cool" o={0.4} />
    <ScreenPhone x={960} y={540} s={1.38} id="g5" bg="#E6E0D4">
      <ChatHead name="വീട്" sub="ഓൺലൈൻ അല്ല" />
      <Bubble y={-60} text="എല്ലാവരും ഓക്കെയല്ലേ?" ticks={1} me size={23} />
    </ScreenPhone>
    <Say x={1500} y={560} t={t - 18} text="✓" size={230} color="#8E98A8" />
    <Say x={420} y={600} t={t - 18} text="1 ടിക്ക്" size={92} color="#F6EFE3" />
  </g>
);
export const G6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 620, push(t, len, 1.44, 1.56))}>
    <rect x={-400} y={-300} width={2800} height={1900} fill="#1E1A28" />
    <rect x={-400} y={800} width={2800} height={900} fill="#3E2A1E" stroke={INK} strokeWidth={6} />
    <g transform="translate(1270 790)">
      <rect x={-20} y={-30} width={40} height={30} fill="#C9A06A" /><path d="M -46 -30 L -26 -120 L 26 -120 L 46 -30 Z" fill="#E8C86A" stroke={INK} strokeWidth={4} />
      <Glow x={0} y={-80} r={520} kind="warm" o={0.8} />
    </g>
    {fig(MOM, 780, 980, 1.34, { yaw: 0.45, look: 0.5, headTilt: 12, armR: { a: 66 + Math.sin(t / 7) * 8, b: -46 }, armL: { a: 62, b: -40 }, ...faceAt(t, [[0, 'worried'], [90, 'tired']]) }, 'rimR', 0)}
    <rect x={560} y={800} width={840} height={400} fill="#3E2A1E" />
    <rect x={540} y={790} width={880} height={22} fill="#6E4E36" stroke={INK} strokeWidth={4} />
    <Notes x={960} y={780} s={0.72} n={Math.max(1, 3 - Math.floor(t / 60))} />
    <LightVeil id="g6v" lights={[[1200, 700, 620]]} o={0.34} />
  </g>
);
export const G7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Tabletop edge={1300} />
    <g transform={`translate(960 520) scale(${push(t, len, 1.2, 1.3)}) translate(-960 -520)`}>
      <Pills x={960} y={520} s={1.3} rot={-6} left={4} />
      <Say y={920} t={t - 30} text="ഒന്നിടവിട്ട ദിവസം" size={78} color="#F6EFE3" />
    </g>
  </g>
);
export const G8: React.FC<ShotProps> = ({ t, len }) => {
  const fall = 70;
  const spin = Math.max(0, 1 - (t - fall) / 34);
  const wob = Math.sin(t * 0.8) * spin * 22;
  const a = stand(KITCHEN, 0.5, 0.35);
  return (
    <g transform={camT(960, 600, push(t, len, 1.08, 1.16))}>
      <Kitchen t={t + 200} id="g8" veil={0.56} red={0.3} />
      <rect x={-300} y={830} width={2500} height={700} fill="#1E1A28" opacity={0.75} />
      {t < fall ? <Fig look={MOM} pose={{ ...a, yaw: -0.3, look: -0.1, tilt: -kf(t, [[20, 0], [fall, 9]]), headTilt: kf(t, [[20, 0], [fall, 14]]), ...faceAt(t, [[0, 'tired']]), armR: { a: 50, b: -40 } }} rimId="rimR" /> : <g>
        <path d="M 1920 1120 L 1190 900" stroke="#C87A8E" strokeWidth={90} strokeLinecap="round" />
        <circle cx={1170} cy={892} r={46} fill="#D0A67E" stroke={INK} strokeWidth={5} />
        <g transform={`translate(780 900) scale(1 ${0.45 + Math.abs(Math.cos(t * 0.5)) * spin * 0.5}) rotate(${wob})`}><SteelPlate x={0} y={0} s={2.1} /></g>
      </g>}
      <Fade t={t} len={len} n={16} />
    </g>
  );
};

// ============================================================ H. THE HOSPITAL AND THE PAPER
export const H1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1, 1.12))}>
    <rect x={-400} y={-300} width={2800} height={1900} fill="#C8D0D0" />
    <rect x={-400} y={780} width={2800} height={900} fill="#8A9496" />
    <rect x={320} y={130} width={420} height={120} rx={8} fill="#2E7E5A" stroke={INK} strokeWidth={5} />
    <text x={530} y={214} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3">റിസപ്ഷൻ</text>
    {fig(SHOPKEEPER, 960, 800, 0.96, { yaw: 0.2, look: 0.1, headTilt: 9, armR: { a: 40, b: -70 }, ...faceAt(t, [[0, 'tired']]) }, 'rimR', 0)}
    <rect x={320} y={650} width={1280} height={420} fill="#5A6A72" stroke={INK} strokeWidth={6} />
    <rect x={300} y={630} width={1320} height={32} fill="#8A9AA2" stroke={INK} strokeWidth={5} />
    <rect x={480} y={460} width={250} height={170} fill="#14141C" stroke={INK} strokeWidth={6} />
    <Cobweb x={490} y={470} r={110} />
    <rect x={820} y={596} width={340} height={36} fill="#7A2E1E" stroke={INK} strokeWidth={4} />
    <rect x={1240} y={590} width={280} height={40} fill="#E8DCC0" stroke={INK} strokeWidth={3} />
    <CashTag t={t - 130} />
    {fig(SIS, 1660, 1100, 1, { yaw: -0.5, look: -0.7, ...faceAt(t, [[0, 'worried']]) }, 'rimL', 0)}
    {fig(PIP, 1460, 1120, 1.3, { yaw: -0.55, look: -0.7, ...faceAt(t, [[0, 'worried']]) }, 'rimL', 0)}
  </g>
);
const CashTag: React.FC<{ t: number }> = ({ t }) => <Say x={1230} y={210} t={t} text="ഐസിയു: മുൻകൂർ കാശ്" size={62} color="#C8352E" />;
export const H2: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 2300], [40, 1420]], easeOut);
  return (
    <g transform={camT(960, 560, push(t, len, 1, 1.08))}>
      <Land t={t} id="h2" mode="dusk" dry={0.3} y={620} sun={[260, 420, 90]} palms={[-20, 1900]} hills={false} />
      <Hospital x={600} y={760} s={0.9} />
      <rect x={-3000} y={760} width={8000} height={2000} fill="#4A4450" />
      <rect x={1040} y={420} width={60} height={360} fill="#8A7A6E" stroke={INK} strokeWidth={5} />
      <BlackCar x={cx} y={920} s={1.14} t={t} lights={1} />
      {t > 52 ? fig(SUIT, 1150, 960, 1.04, { yaw: -0.3, look: -0.3, ...faceAt(t, [[0, 'smug']]), armL: { a: 10, b: -6 } }, 'rimR') : null}
    </g>
  );
};
export const H3: React.FC<ShotProps> = ({ t, len }) => {
  const open = clamp((t - 6) / 12);
  return (
    <g transform={camT(980, 620, push(t, len, 1.5, 1.66))}>
      <Land t={t + 30} id="h3" mode="dusk" dry={0.3} y={620} sun={[260, 420, 90]} hills={false} />
      <rect x={-3000} y={760} width={8000} height={2000} fill="#4A4450" />
      <BlackCar x={1320} y={820} s={1.2} t={0} />
      {fig(SUIT, 760, 960, 1.14, { yaw: 0.4, look: 0.6, armR: { a: 66, b: -30 }, ...faceAt(t, [[0, 'smug']]) }, 'rimR', 0)}
      <g transform="translate(1040 780)">
        <rect x={-160} y={-20} width={320} height={120} fill="#3A2A22" stroke={INK} strokeWidth={6} />
        <path d={`M -160 -20 L -160 ${-20 - open * 110} L 160 ${-20 - open * 110} L 160 -20 Z`} fill="#4E3A30" stroke={INK} strokeWidth={6} />
        {[-100, 0, 100].map((x) => <Notes key={x} x={x} y={-8} s={0.36} n={4} />)}
        <Glow x={0} y={-20} r={320} kind="warm" o={0.7 * open} />
      </g>
    </g>
  );
};
export const H4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1.02, 1.12))}>
    <Land t={t + 60} id="h4" mode="dusk" dry={0.3} y={740} sun={[1700, 620, 100]} hills={false} />
    {fig(PIP, 460, 1200, 1.74, { yaw: 0.55, look: 0.7, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0)}
    {fig(SUIT, 1500, 1200, 1.74, { yaw: -0.55, look: -0.7, armL: { a: 84, b: -6 }, ...faceAt(t, [[0, 'smug']]) }, 'rimL', 0)}
    <g transform={`translate(${kf(t, [[6, 1220], [30, 1040]], easeOut)} 640) rotate(-6) scale(0.5)`}><Deed x={0} y={0} s={1} /></g>
    <Say x={960} y={150} t={t - 44} text="ഇന്ന് തന്നെ പണം" size={84} color="#FFE27A" />
  </g>
);
export const H5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#1A1420" />
    <Glow x={960} y={540} r={760} kind="warm" o={0.35} />
    <g transform={`translate(1270 ${kf(t, [[0, 950], [len, 880]])})`}>
      <KHouse x={0} y={0} s={0.74} lit={1} door={0.2} />
    </g>
    <Deed x={620} y={560} s={push(t, len, 1, 1.08)} rot={-4} />
  </g>
);
export const H6: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 760, y: 1010, scale: 2.1, yaw: 0.4, look: 0.8, armR: { a: 20, b: -10 }, ...faceAt(t, [[0, 'neutral'], [60, 'worried']]) };
  const s: P = { x: 1090, y: 1000, scale: 1.5, yaw: -0.45, look: -0.7, headTilt: -8, armL: { a: 58, b: -12 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={camT(960, 560, push(t, len, 1.02, 1.14))}>
      <Sky id="h6" mode="dusk" y0={-100} y1={920} />
      <Hospital x={1400} y={980} s={1.1} />
      <rect x={-3000} y={900} width={8000} height={2000} fill="#4A4450" />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Fig look={SIS} pose={s} rimId="rimL" />
    </g>
  );
};
export const H7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(760, 800, push(t, len, 1.5, 1.74))}>
    <rect x={-200} y={-200} width={2400} height={1800} fill="#1A1420" />
    <Deed x={620} y={560} s={1} rot={0} />
    <Pen x={kf(t, [[0, 540], [60, 500]])} y={kf(t, [[0, 780], [60, 842]])} s={1.2} />
    <g transform="translate(0 0)"><Arm from={[1600, 1500]} to={[700, 620]} w={120} /></g>
  </g>
);
export const H8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, 520, push(t, len, 1.12, 1.02))}>
    <BoothIn t={t + 60} />
    <DeskPhone x={1260} y={650} s={1} off />
    {fig(PIP, 860, 1110, 1.5, { yaw: 0.6, look: 0.7, ...faceAt(t, [[0, 'shock']]) }, 'rimL', 0)}
    <Handset x={980} y={640} s={0.62} rot={84} />
  </g>
);

// ============================================================ I. BACK AT THE BOOTH
export const I1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(760, 600, push(t, len, 1.08, 1.24))}>
    <Kavala t={t + 40} id="i1" />
    <Booth x={1400} y={760} s={1} />
    {fig(PIP, 1130 - t * 0.4, 860, 1.06, { yaw: -0.5, look: -0.3, headTilt: 10, ...faceAt(t, [[0, 'worried']]) }, 'rimL')}
    <Line x0={930} g0={850} s0={0.92} x1={-200} g1={1000} s1={1.18} n={9} t={t} seed={11} />
  </g>
);
export const I2: React.FC<ShotProps> = ({ t, len }) => {
  const ph = t * 0.6;
  const x = kf(t, [[0, -160], [len, 860]]);
  const sw = Math.sin(ph) * 34;
  const pose: P = { x, y: 960 - 212 * 0.8, scale: 0.8, yaw: 0.7, look: 0.8, tilt: 8, armR: { a: 54, b: -74 }, armL: { a: -sw + 10, b: -40 }, legL: { a: sw, b: 30 }, legR: { a: -sw, b: 30 }, ...faceAt(t, [[0, 'worried']]) };
  const h = handAt(pose, 'R');
  return (
    <g transform={camT(x + 200, 620, 1.3)}>
      <Kavala t={t + 80} id="i2" />
      <Fig look={SIS} pose={pose} rimId="rimR" shadow={0.5} />
      <DiaryShut x={h.x + 8} y={h.y - 8} s={0.8} rot={12} />
    </g>
  );
};
export const I3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1, 1.08))}>
    <rect x={-400} y={-300} width={2800} height={1900} fill="#3A2820" />
    <DiaryOpen t={t} rows={[['അമ്മാവൻ', '0471-24••••'], ['കുഞ്ഞമ്മ', '0484-23••••'], ['ഡോക്ടർ', '0495-27••••'], ['റേഷൻ കട', '0481-25••••'], ['ചിട്ടി ചേട്ടൻ', '94••• •••••'], ['ട്യൂഷൻ സാർ', '98••• •••••']]} />
  </g>
);
export const I4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1320, 240, push(t, len, 1.46, 1.8))}>
    <rect x={-400} y={-300} width={2800} height={1900} fill="#3A2820" />
    <DiaryOpen t={t + 99} rows={[['', ''], ['അച്ഛൻ, ദുബായ്', '00971 5• ••• ••••']]} hi={1} size={70} />
  </g>
);
export const I5: React.FC<ShotProps> = ({ t, len }) => {
  const k = kf(t, [[6, 0], [60, 1]], easeOut);
  return (
    <g transform={camT(960, 620, push(t, len, 1.02, 1.1))}>
      <Kavala t={t + 120} id="i5" />
      <Booth x={1500} y={760} s={0.98} />
      <g transform={`translate(0 ${70 - k * 70})`}><Line x0={1320} g0={800} s0={0.66} x1={-200} g1={830} s1={0.8} n={10} t={t} seed={3} /></g>
      <g transform={`translate(0 ${-70 + k * 70})`}><Line x0={1300} g0={1000} s0={0.92} x1={-200} g1={1040} s1={1.1} n={8} t={t} seed={8} /></g>
      {fig(PIP, kf(t, [[0, 300], [len, 1240]]), 900, 0.9, { yaw: 0.7, look: 0.8, armR: { a: 16, b: -20 }, legL: { a: Math.sin(t * 0.5) * 22, b: 18 }, legR: { a: -Math.sin(t * 0.5) * 22, b: 18 }, ...faceAt(t, [[0, 'neutral']]) })}
      {fig(SIS, kf(t, [[0, 160], [len, 1090]]), 900, 0.66, { yaw: 0.7, look: 0.8, legL: { a: Math.sin(t * 0.6) * 24, b: 18 }, legR: { a: -Math.sin(t * 0.6) * 24, b: 18 }, ...faceAt(t, [[0, 'happy']]) })}
    </g>
  );
};
export const I6: React.FC<ShotProps> = ({ t, len }) => {
  const key = Math.floor(t / 7);
  const idx = [10, 10, 8, 6, 0, 4, 1, 3, 2][key % 9];
  const fx = -170 + (idx % 3) * 170;
  const fy = -260 + Math.floor(idx / 3) * 170;
  const m = Math.max(0, Math.floor((t - 36) / 7));
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#2E2028" />
      <Keypad x={700} y={540} s={1.28} lit={idx} />
      <Arm from={[2000, 1300]} to={[700 + fx * 1.28 + 100, 540 + fy * 1.28 + 60]} w={120} />
      <g transform="translate(1480 180)">
        <rect x={-260} y={-90} width={520} height={180} rx={14} fill="#14101A" stroke={INK} strokeWidth={6} />
        <text y={46} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={120} fill="#FF3A2E">{`00:${String(m).padStart(2, '0')}`}</text>
        <Glow x={0} y={0} r={270} kind="red" o={0.3} />
      </g>
    </g>
  );
};
export const I7: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 900, y: 880, scale: 2.8, yaw: 0.45, look: 0.5, headTilt: 7, ...faceAt(t, [[0, 'worried']]) };
  const h = headAt(p);
  const ring = [0, 36, 72].some((a) => t >= a && t < a + 24);
  return (
    <g transform={camT(960, 500, push(t, len, 1, 1.16))}>
      <BoothIn t={t + 90} />
      <Fig look={PIP} pose={p} rimId="rimL" />
      <Handset x={h.x + 150} y={h.y + 40} s={0.9} rot={84} />
      {ring ? <CallRings x={h.x + 230} y={h.y - 110} t={t} /> : null}
    </g>
  );
};
export const I8: React.FC<ShotProps> = ({ t, len }) => {
  const up = clamp((t - 30) / 8);
  return (
    <g>
      <g clipPath="url(#i8l)">
        <defs><clipPath id="i8l"><path d="M -100 -100 H 1000 L 900 1200 H -100 Z" /></clipPath></defs>
        <g transform="translate(-140 60) scale(0.82)"><BoothIn t={t} /></g>
        {fig(PIP, 500, 1060, 1.66, { yaw: 0.45, look: 0.5, ...faceAt(t, [[0, 'worried'], [46, 'happy']]) }, 'rimL', 0)}
        <Handset x={640} y={620} s={0.5} rot={84} />
      </g>
      <g clipPath="url(#i8r)">
        <defs><clipPath id="i8r"><path d="M 1010 -100 H 2100 V 1200 H 910 Z" /></clipPath></defs>
        <rect x={900} y={-200} width={1200} height={1500} fill="#3E4656" />
        <g transform="translate(600 0)"><Bunk x={700} y={880} s={1.14} /></g>
        {fig(DAD, 1420, 1100, 1.5, { yaw: -0.5, look: -0.5, armL: { a: 150 * up + 20, b: -130 * up }, ...faceAt(t, [[0, 'tired'], [34, 'shock'], [60, 'happy']]) }, 'rimBlueL', 0)}
        <rect x={1320} y={500 - up * 40} width={28} height={54} rx={5} fill="#14141C" stroke="#3A3A48" strokeWidth={3} />
        {t < 30 ? <CallRings x={1330} y={520} t={t} /> : null}
        <LightVeil id="i8v" lights={[[1420, 520, 480]]} o={0.32} />
      </g>
      <path d="M 1000 -100 L 905 1200" stroke="#120E22" strokeWidth={14} />
    </g>
  );
};
export const I9: React.FC<ShotProps> = ({ t, len }) => {
  const torn = clamp((t - 44) / 12);
  return (
    <g transform={camT(960, 560, push(t, len, 1.02, 1.1))}>
      <Land t={t + 90} id="i9" mode="dusk" dry={0.3} y={740} sun={[1700, 620, 100]} hills={false} />
      {fig(SUIT, 1540, 1200, 1.74, { yaw: -0.55, look: -0.7, ...faceAt(t, [[0, 'smug'], [50, 'shock']]) }, 'rimL', 0)}
      {fig(PIP, 320, 1200, 1.74, { yaw: 0.55, look: 0.7, ...faceAt(t, [[0, 'neutral'], [46, 'cool']]) }, 'rimR', 0)}
      <Deed x={920} y={560} s={0.72} torn={torn} rot={-3} />
      <Say y={190} t={t - 8} text="ഒപ്പിടരുത്" size={100} color="#FFE27A" />
    </g>
  );
};
export const I10: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t, [[0, 2600], [66, 1120]], easeOut);
  return (
    <g transform={camT(960, 560, push(t, len, 1.02, 1.08))}>
      <Kavala t={t + 40} id="i10" mode="morning" sun={[260, 170, 80]} />
      <g transform="translate(0 0)"><Bus x={bx} y={920} s={0.86} t={t / 4} dir={-1} /></g>
      {t > 74 ? fig(UNCLE, 720, 950, 1, { yaw: 0.5, look: 0.6, armR: { a: 16, b: -12 }, ...faceAt(t, [[0, 'happy']]) }) : null}
      {t > 74 ? <g transform="translate(830 860)"><Notes x={0} y={0} s={0.4} n={6} /></g> : null}
      {fig(PIP, 300, 960, 1, { yaw: 0.5, look: 0.7, ...faceAt(t, [[0, 'worried'], [80, 'happy']]) })}
      {fig(SIS, 170, 960, 0.72, { yaw: 0.5, look: 0.7, ...faceAt(t, [[0, 'happy']]) })}
    </g>
  );
};

// ============================================================ J. IT COMES BACK
export const J1: React.FC<ShotProps> = ({ t, len }) => {
  const big = t > 58;
  const n = Math.floor(kf(t, [[58, 0], [len, 4312]]));
  return (
    <g>
      <Tabletop edge={1300} kind="wood" />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0A0814" opacity={0.6} />
      <g transform={`translate(${big ? Math.sin(t * 2.3) * 16 : t > 12 && t < 20 ? Math.sin(t * 2.3) * 10 : 0} ${big ? Math.cos(t * 2.9) * 10 : 0})`}>
        <ScreenPhone x={960} y={560} s={1.2} id="j1" bg={t > 12 ? '#1E2A3E' : '#0E0E14'}>
          {t > 12 ? <text y={-40} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={78} fill="#F6EFE3">{n.toLocaleString('en-IN')}</text> : null}
          {big ? <text y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFE27A">മെസേജുകൾ</text> : null}
        </ScreenPhone>
      </g>
      <Glow x={960} y={560} r={640} kind="cool" o={t > 12 ? 0.5 : 0.1} />
    </g>
  );
};
export const J2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#0E0C18" />
    <Glow x={960} y={540} r={640} kind="cool" o={0.4} />
    <ScreenPhone x={960} y={540} s={1.38} id="j2" bg="#E6E0D4">
      <ChatHead />
      <rect x={-90} y={-190} width={180} height={40} rx={12} fill="#CFD8E0" />
      <text y={-160} textAnchor="middle" fontFamily={FONT.title} fontSize={24} fill="#3A4256">30 ദിവസം മുമ്പ്</text>
      <Bubble y={-120} text="എല്ലാവരും ഓക്കെയല്ലേ?" size={24} />
    </ScreenPhone>
  </g>
);
export const J3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 680, push(t, len, 1.08, 1.34))}>
    <SeaBed id="j3" t={t} y={880} dark={0.62} />
    <Cable y={820} t={t} pulse={t % 40 < 26 ? 0.75 : 0.1} />
    <Say y={620} t={t - 140} text="?" size={240} color="#F6EFE3" />
  </g>
);
export const J4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, push(t, len, 1.1, 1.26))}>
    <Tabletop edge={1300} />
    <g transform="translate(560 470)"><rect x={-110} y={-180} width={220} height={360} rx={24} fill="#14141C" stroke="#3A3A48" strokeWidth={5} /></g>
    <g transform="translate(1160 510) scale(0.46) translate(-960 -550)"><DiaryOpen t={99} rows={[['അമ്മ', '••••• •••••'], ['അച്ഛൻ', '00971 •• ••• ••••']]} /></g>
    <Pen x={1300} y={500} s={1.1} rot={30} />
  </g>
);
export const J5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#0E0A18" />
    <Glow x={960} y={520} r={760} kind="warm" o={0.22} />
    <g opacity={0.35}><Keypad x={960} y={560} s={1.2} lit={Math.floor(t / 9) % 12} /></g>
    <Say y={460} t={t - 4} text="നിനക്ക് എത്ര നമ്പർ" size={124} color="#F6EFE3" />
    <Say y={650} t={t - 10} text="ഓർമ്മയുണ്ട്?" size={150} color="#FFB15A" />
  </g>
);

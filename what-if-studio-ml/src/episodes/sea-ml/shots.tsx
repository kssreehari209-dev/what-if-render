// sea-ml: "What if the sea rose one metre overnight?" Long video, 16:9. Narration straight, jokes in the picture.
// Spine: day 40, you row over your own drowned field to fetch Amma's seed sack from the loft; forty days back to
// find out why.
import React from 'react';
import {
  faceAt, kf, clamp, camT, rnd, easeOut, backOut, Pose, ShotProps, FONT, Glow, Dust, Foreground, LightVeil, FocusRings, FloatLabel, TitleCard,
  FitSay, FactCard, TimeTag, LOOKS, Look, Cone,
} from '../../engine';
import { Fig, Palm, KHouse, Water, Rain, Drops, PIP, MO, SIS, MOM, SUIT, headAt, handAt } from '../fly-ml/kit';
import { FISHMAN, Arm, Fish, Well } from '../monsoon-ml/kit';
import { UNCLE, CROWD, TEAMAN, Mundu, Tache, TeaGlass, BusShelter, Gate } from '../phone-ml/kit';
import { Paper, Deed, Radio } from '../net-ml/kit';
import { Cot, SchoolBag, Laterite } from '../rain-short-ml/kit';
import {
  INK, fig, push, Streak, Rings, Heaven, Drowned, Field, VallamIn, Vallam, Oar, rowerPose, Loft, SeedSack, Ladder, Lantern, Camp, Bench, Charuvam, Tumbler, Almirah,
  Photo, Junction, Tetrapod, TetraWall, Coast, AppuIn, Bund, Skyline, Pokkali, WhiteCar, KeralaMap, KochiMap, Section, Graph,
} from './kit';

type P = Partial<Pose>;
const APPUMA: Look = { ...LOOKS.mom, skin: '#A0704F', skinShade: '#885C40', hand: '#A0704F', jacket: '#2E7A6A', jacketShade: '#235E52', hair: '#1E1716' };
const DAD = FISHMAN;
const Soft: React.FC<{ children: React.ReactNode }> = ({ children }) => <Foreground blur={16}>{children}</Foreground>;
const Day: React.FC<{ t: number; label: string; value?: string }> = ({ t, label, value }) => <TimeTag t={t} label={label} value={value} cx={960} y={92} />;
const Fact: React.FC<{ t: number; big: string; line: string; src: string }> = ({ t, big, line, src }) => <FactCard t={t} big={big} line={line} src={src} cx={960} y={860} w={1180} />;
const Ask: React.FC<{ t: number; text: string; y?: number }> = ({ t, text, y = 150 }) => <FitSay t={t} text={text} x={960} y={y} size={100} maxW={1600} />;
const skin = (l: Look) => l.skin;

/** Someone in the boat: inside, rower, oar, hull. */
const Rowing: React.FC<{ x: number; y: number; s: number; t: number; look?: Look; extra?: P; rim?: string; oar?: boolean; children?: React.ReactNode }> = ({ x, y, s, t, look = PIP, extra = {}, rim = 'rimR', oar = true, children }) => {
  const p = rowerPose(x, y, s, t, extra);
  const h = handAt(p, 'R');
  return (
    <g>
      <VallamIn x={x} y={y} s={s} />
      {children}
      <Fig look={look} pose={p} rimId={rim} />
      {oar ? <Oar from={[h.x - 30 * s, h.y - 120 * s]} to={[h.x + 120 * s, y + 70 * s]} s={s} /> : null}
      <Vallam x={x} y={y} s={s} />
      <Rings x={h.x + 120 * s} y={y + 20 * s} t={t} s={s * 0.8} />
    </g>
  );
};
/** A wall calendar we can read: month cells, crosses, a circled harvest day. */
const Cal: React.FC<{ x: number; y: number; s?: number; crossed: number; ring?: number; stop?: number }> = ({ x, y, s = 1, crossed, ring = 24, stop = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-250} width={400} height={500} fill="#F2EADA" stroke={INK} strokeWidth={6} />
    <rect x={-200} y={-250} width={400} height={110} fill="#B8423A" />
    <text x={0} y={-190} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3">ചിങ്ങം</text>
    <text x={0} y={-152} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3">ജോസ് ടെക്സ്റ്റൈൽസ്, ആലപ്പുഴ</text>
    {Array.from({ length: 30 }).map((_, i) => {
      const cx = -168 + (i % 7) * 56;
      const cy = -100 + Math.floor(i / 7) * 70;
      return (
        <g key={i}>
          <text x={cx} y={cy} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={i % 7 === 0 ? '#B8423A' : '#2A2230'}>{i + 1}</text>
          {i < crossed ? <path d={`M ${cx - 20} ${cy - 30} L ${cx + 20} ${cy + 8} M ${cx + 20} ${cy - 30} L ${cx - 20} ${cy + 8}`} stroke="#C8302A" strokeWidth={5} strokeLinecap="round" /> : null}
          {i === ring - 1 ? <g><ellipse cx={cx} cy={cy - 10} rx={30} ry={26} fill="none" stroke="#2E7A3A" strokeWidth={5} /><text x={cx} y={cy + 34} textAnchor="middle" fontFamily={FONT.title} fontSize={18} fill="#2E7A3A">കൊയ്ത്ത്</text></g> : null}
        </g>
      );
    })}
    {stop ? <rect x={-200} y={-250} width={400} height={500} fill="#000" opacity={0} /> : null}
  </g>
);
/** A hand-held phone glowing. */
const PhoneGlow: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g>
    <Glow x={x} y={y} r={200 * s} kind="cool" o={0.6} />
    <rect x={x - 22 * s} y={y - 40 * s} width={44 * s} height={80 * s} rx={8 * s} fill="#CFE6FF" stroke={INK} strokeWidth={4 * s} transform={`rotate(${rot} ${x} ${y})`} />
  </g>
);
/** A shoe and a trouser leg hanging into frame from the top, toe at (x, y). */
const Toe: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-900} width={140} height={760} fill="#232327" stroke={INK} strokeWidth={8} />
    <path d="M -90 -170 L 90 -170 L 110 -40 Q 120 20 40 20 L -80 20 Q -110 20 -100 -40 Z" fill="#2F8C8C" stroke={INK} strokeWidth={8} />
    <path d="M -100 0 L 110 0" stroke="#F2EADA" strokeWidth={14} />
  </g>
);
/** Someone standing in water: draw the figure, then the water covers them below lv. */
const Wading: React.FC<{ look: Look; x: number; g: number; s: number; extra?: P; rim?: string }> = ({ look, x, g, s, extra = {}, rim = 'rimR' }) => fig(look, x, g, s, extra, rim, 0);

// ============================================================ A. COLD OPEN: DAY 40
export const A1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 1000, 1040), 560, push(t, len, 1.05, 1.1))}>
      <Drowned t={t + 200} id="a1" lv={650} />
      <Rowing x={620 + t * 1.2} y={760} s={0.85} t={t + 200} />
    </g>
    <Day t={t - 2} label="ദിവസം" value="40" />
  </g>
);
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const x = 700;
  const p = rowerPose(x, 760, 0.85, t + 260, { ...faceAt(t, [[0, 'neutral']]), look: 0.7, headTilt: -4 });
  const h = headAt(p);
  return (
    <g transform={camT(h.x + 40, h.y + 40, push(t, len, 2.9, 3.1))}>
      <Drowned t={t + 260} id="a2" lv={650} />
      <Rowing x={x} y={760} s={0.85} t={t + 260} extra={{ look: 0.7, headTilt: -4 }} />
      <Drops x={h.x + 160} y={h.y + 220} t={t} n={6} w={60} />
    </g>
  );
};
export const A3: React.FC<ShotProps> = ({ t }) => {
  const dip = kf(t, [[0, -200], [14, 420], [40, 470]], easeOut);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#1E4A52" />
      <g opacity={0.55}>
        <path d="M -200 760 Q 600 700 1100 740 T 2200 700 L 2200 820 Q 1400 800 900 840 T -200 860 Z" fill="#3A2C22" />
        {Array.from({ length: 50 }).map((_, i) => (
          <path key={i} d={`M ${-150 + i * 46} ${300 + (i % 5) * 100} q ${-10} -40 ${-20 + Math.sin(t / 10 + i) * 6} -70`} stroke="#4E7A3A" strokeWidth={8} fill="none" strokeLinecap="round" />
        ))}
      </g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#2A6A7A" opacity={0.35} />
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${rnd(1, i) * 2000} ${rnd(2, i) * 1100} q 40 ${-10 + Math.sin(t / 8 + i) * 8} 80 0`} stroke="#BFE6EA" strokeWidth={4} fill="none" opacity={0.4} />)}
      <Oar from={[1500, -300]} to={[1100, dip]} s={2.4} />
      <Rings x={1150} y={dip - 140} t={t + 10} s={2} />
    </g>
  );
};
export const A4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 900, 1000), 640, 1.15)}>
    <Drowned t={t + 300} id="a4" lv={700} house={[1500, 860, 0.5]} palms={[[160, 1040, 1.4], [620, 960, 1.15], [1060, 920, 1], [1820, 1000, 1.3]]} tips={false} />
    <Rowing x={1300} y={800} s={0.4} t={t + 300} />
  </g>
);
export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const bump = kf(t, [[0, 0], [16, 1], [22, 0.85]], easeOut);
  return (
    <g transform={camT(980, 540, push(t, len, 1.6, 1.7))}>
      <Drowned t={t + 340} id="a5" lv={600} house={[1180, 900, 1.5]} palms={[[300, 900, 0.9]]} tips={false} />
      <Rowing x={300 + bump * 300} y={700} s={0.9} t={t + 340} extra={{ ...faceAt(t, [[0, 'neutral'], [18, 'worried']]) }} />
    </g>
  );
};
export const A6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 640, push(t, len, 2.2, 2.35))}>
    <Camp t={t + 100} id="a6">
      {fig(MOM, 900, 1120, 1.4, { yaw: 0.4, look: 0.5, ...faceAt(t, [[0, 'worried']]), armR: { a: 30, b: -40 } }, 'rimR', 0)}
      <Lantern x={1300} y={720} s={1.2} t={t} />
    </Camp>
  </g>
);
export const A7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1250, 580, push(t, len, 1.5, 1.65))}>
    <Loft t={t + 60} id="a7">
      <SeedSack x={1360} y={860} s={1.2} id="a7" />
    </Loft>
  </g>
);
export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const inn = kf(t, [[0, 0], [30, 1]], easeOut);
  return (
    <g transform={camT(960, 520, push(t, len, 1.35, 1.45))}>
      <Heaven t={t} id="a8" mode="dusk" hy={1200} />
      {/* the upstairs wall with its window, water to the sill */}
      <Laterite x0={-200} x1={2200} y0={120} y1={1300} seed={4} />
      <rect x={720} y={300} width={460} height={420} fill="#120C10" stroke={INK} strokeWidth={10} />
      <Glow x={950} y={520} r={260} kind="cool" o={0.2} />
      {fig(PIP, 940 - inn * 60, 860, 1, { yaw: 0.2, tilt: 30 + inn * 20, look: 0.5, armL: { a: 150, b: -10 }, armR: { a: 140, b: -20 }, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0)}
      {[760, 860, 960, 1060, 1150].map((x) => <rect key={x} x={x} y={300} width={14} height={420} fill="#5A3A26" opacity={0} />)}
      <rect x={700} y={700} width={500} height={40} fill="#6E4A30" stroke={INK} strokeWidth={6} />
      <Water t={t} y={720} />
      <rect x={-3000} y={720} width={8000} height={3000} fill="#5A2A48" opacity={0.3} />
      <Rings x={960} y={740} t={t} />
    </g>
  );
};
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const up = kf(t, [[0, 0], [len, 1]]);
  return (
    <g transform={camT(960, 560, 1)}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#22161C" />
      <rect x={700} y={-40} width={520} height={200} fill="#3A2420" stroke={INK} strokeWidth={8} />
      <Glow x={960} y={60} r={420} kind="warm" o={0.55} />
      <Ladder x={960} y0={1300} y1={60} w={240} />
      {fig(PIP, 960, 1060 - up * 160, 1.25, { yaw: 0, look: 0, armL: { a: 165, b: -10 }, armR: { a: 175, b: 0 }, legL: { a: -40, b: 70 }, legR: { a: 10, b: 10 }, ...faceAt(t, [[0, 'neutral']]) }, 'rimL', 0)}
      <Soft><rect x={-200} y={980} width={2400} height={400} fill="#0E0A0E" /></Soft>
      <Dust t={t} seed={4} x0={700} y0={0} w={520} h={500} n={18} o={0.5} />
    </g>
  );
};
export const A10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 600, push(t, len, 1.25, 1.35))}>
    <Loft t={t + 200} id="a10">
      {fig(PIP, 760, 900, 1, { yaw: 0.6, look: 0.8, tilt: 12, ...faceAt(t, [[0, 'worried']]), armR: { a: 40, b: -30 } }, 'rimR', 0.6)}
      <SeedSack x={1360} y={860} s={0.9} id="a10" />
    </Loft>
  </g>
);
export const A11: React.FC<ShotProps> = ({ t }) => {
  const reach = kf(t, [[0, 0], [12, 1], [16, 0.96]], easeOut);
  return (
    <g>
      <g transform="translate(960 1400) scale(4.2) translate(0 0)">
        <SeedSack x={0} y={0} s={1} id="a11" />
      </g>
      <Glow x={1300} y={200} r={700} kind="warm" o={0.35} />
      <Arm from={[-300, 1100]} to={[200 + reach * 620, 1200 - reach * 560]} c="#232327" skin={skin(PIP)} w={150} />
      <LightVeil id="a11v" lights={[[1100, 500, 700]]} o={0.35} />
    </g>
  );
};
export const A12: React.FC<ShotProps> = ({ t, len }) => {
  const wet = kf(t, [[0, 0.1], [10, 0.55]], easeOut);
  const p: P = { x: 640, y: 760, scale: 2.4, yaw: 0.5, look: 0.9, ...faceAt(t, [[0, 'worried'], [8, 'shock']]) };
  const h = headAt(p);
  return (
    <g transform={camT(960, 520, push(t, len, 1, 1.08))}>
      <Loft t={t + 300} id="a12" gx={1500}>
        <SeedSack x={1300} y={1120} s={2.2} wet={wet} id="a12" />
        <Fig look={PIP} pose={p} rimId="rimRed" />
      </Loft>
      <Glow x={960} y={600} r={800} kind="red" o={0.25} />
      <g transform={`translate(${h.x} ${h.y}) scale(0.45) translate(${-h.x} ${-h.y})`}><FocusRings x={h.x} y={h.y} t={t - 8} r0={200} /></g>
    </g>
  );
};

// ============================================================ B. FORTY DAYS EARLIER
export const B1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 1000, 960), 560, push(t, len, 1.1, 1))}>
      <Field t={t} id="b1" mode="night" cl={900} />
      <FloatLabel x={600} y={700} t={(t + 10) % 80} text="♪" size={40} color="#CDE6EA" />
    </g>
    <Day t={t - 2} label="40 ദിവസം മുമ്പ്" />
  </g>
);
const Home: React.FC<{ t: number; id: string; children?: React.ReactNode }> = ({ t, id, children }) => (
  <g>
    <rect x={-3000} y={-3000} width={8000} height={3830} fill="#5A4A50" />
    <Laterite x0={-200} x1={2200} y0={-200} y1={830} seed={7} />
    <rect x={-3000} y={-3000} width={8000} height={3830} fill="#4A3A44" opacity={0.55} />
    <rect x={-3000} y={830} width={8000} height={3000} fill="#7A3A2A" />
    <rect x={-3000} y={826} width={8000} height={12} fill="#2A1A1A" />
    <rect x={200} y={180} width={260} height={320} fill="#14203A" stroke="#5A3A26" strokeWidth={14} />
    {[265, 330, 395].map((x) => <line key={x} x1={x} y1={180} x2={x} y2={500} stroke="#2A2230" strokeWidth={8} />)}
    <rect x={1500} y={240} width={220} height={160} fill="#E8D8A8" stroke={INK} strokeWidth={5} />
    <text x={1610} y={340} textAnchor="middle" fontFamily={FONT.title} fontSize={40} fill="#7A2E1E">ഗുരുവായൂരപ്പൻ</text>
    {children}
    <line x1={960} y1={-60} x2={960} y2={130} stroke={INK} strokeWidth={5} />
    <circle cx={960} cy={150} r={24} fill="#FFE9B8" />
    <Glow x={960} y={170} r={620} kind="warm" o={0.7} />
    <LightVeil id={`hm${id}`} lights={[[960, 320, 600]]} o={0.42} />
    <Dust t={t} seed={3} x0={500} y0={180} w={900} h={500} n={14} o={0.35} />
  </g>
);
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const reach = kf(t, [[0, 0], [14, 1]], easeOut);
  return (
    <g transform={camT(1000, 500, push(t, len, 1.7, 1.8))}>
      <Home t={t} id="b2">
        <Cal x={1200} y={460} s={0.7} crossed={9 + (t > 20 ? 1 : 0)} />
        {fig(MOM, 900, 960, 1, { yaw: 0.55, look: 0.7, armR: { a: 60 + reach * 70, b: -20 }, ...faceAt(t, [[0, 'happy']]) })}
      </Home>
    </g>
  );
};
export const B3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#4A3A44" />
    <Glow x={700} y={200} r={900} kind="warm" o={0.5} />
    <g transform={camT(960, 560, push(t, len, 1, 1.06))}>
      <Cal x={960} y={560} s={1.9} crossed={10} />
      <Arm from={[1900, 1300]} to={[1210 - kf(t, [[0, 0], [20, 1]], easeOut) * 60, 520]} c="#8A5A6A" skin={skin(MOM)} w={90} />
    </g>
  </g>
);
export const B4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, push(t, len, 1.9, 2))}>
    <Field t={t + 100} id="b4" mode="night" cl={900} />
    {fig(PIP, 960, 950, 1, { yaw: 0.35, look: 0.6, headTilt: 8, legL: { a: 30, b: 10 }, legR: { a: 20, b: 0 }, armR: { a: 40, b: -90 }, armL: { a: 30, b: -80 }, ...faceAt(t, [[0, 'neutral']]) }, 'rimBlue', 0)}
    <PhoneGlow x={1030} y={700} s={0.8} rot={-10} />
  </g>
);
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const lv = kf(t, [[0, 820], [len * 0.6, 700]]);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0C1022" />
      <Glow x={1500} y={200} r={700} kind="cool" o={0.4} />
      <Toe x={960} y={720} s={1.3} />
      <Water t={t} y={lv} night />
      <rect x={-3000} y={lv} width={8000} height={3000} fill="#0C1A2E" opacity={0.3} />
      <Streak x={1400} y={lv + 6} t={t} c="#C8D8F0" o={0.5} h={300} />
      {lv < 740 ? <Rings x={960} y={lv + 8} t={t} s={1.6} /> : null}
    </g>
  );
};
export const B6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 620, push(t, len, 1.3, 1.2))}>
    <Field t={t + 160} id="b6" mode="night" cl={kf(t, [[0, 860], [len, 770]])} />
  </g>
);
export const B7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 900, 1000), 560, 1.05)}>
    <Drowned t={t} id="b7" mode="dawn" lv={690} house={[1150, 900, 0.85]} palms={[[260, 920, 0.95], [580, 870, 0.8], [1720, 900, 0.9]]} />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${400 + i * 90 + t * 3} ${260 + i * 30} q 14 -12 28 0 q 14 -12 28 0`} stroke="#2A2230" strokeWidth={5} fill="none" />)}
  </g>
);
export const B8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, push(t, len, 1, 1.04))}>
    <Drowned t={t + 130} id="b8" mode="dawn" lv={720} house={[1350, 940, 0.75]} />
    <Rowing x={500} y={830} s={0.6} t={t} extra={{ look: 0.9 }} />
    <TitleCard t={t} lines={['കടൽ ഒരു മീറ്റർ', 'പൊങ്ങിയാൽ?']} accent="പൊങ്ങിയാൽ?" size={140} y={200} gap={150} />
  </g>
);

// ============================================================ C. DAY 1: THE FUN
export const C1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 760, 860), 560, 1.1)}>
      <Junction t={t} id="c1" lv={780}
        children={<g>
          <rect x={60} y={420} width={30} height={420} fill="#5A5A62" /><rect x={600} y={420} width={30} height={420} fill="#5A5A62" />
          <rect x={30} y={360} width={630} height={90} rx={10} fill="#2E5A8A" stroke={INK} strokeWidth={6} />
          <text x={345} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3">ഗവ. എൽ.പി. സ്കൂൾ</text>
          <rect x={250} y={500} width={200} height={110} fill="#F2EADA" stroke={INK} strokeWidth={5} />
          <text x={350} y={570} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#B8423A">അവധി</text>
        </g>}
        front={<g>
          {[[300, 0.55, 2], [520, 0.5, 4], [760, 0.6, 1]].map(([x, s, c], i) => {
            const bob = Math.sin(t / 7 + i * 2) * 8;
            return <g key={i}>{fig(CROWD[c as number], x as number, 1020 + bob, s as number, { yaw: 0.2, armL: { a: 150 + Math.sin(t / 5 + i) * 20, b: -20 }, armR: { a: 40, b: -30 }, ...faceAt(0, [[0, 'happy']]) }, 'rimR', 0)}</g>;
          })}
          <Water t={t + 30} y={870} />
          <rect x={-3000} y={870} width={8000} height={3000} fill="#6A5A3A" opacity={0.3} />
          {[300, 520, 760].map((x, i) => <Rings key={x} x={x} y={880} t={t + i * 9} />)}
        </g>}
      />
    </g>
    <Day t={t - 2} label="ദിവസം" value="1" />
  </g>
);
export const C2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 900, 1000), 600, 1.6)}>
    <Junction t={t + 120} id="c2" lv={790} children={<g transform="translate(-200 0)"><BusShelter x={600} y={830} /></g>} />
    <Rowing x={760 + t * 2} y={880} s={0.85} t={t} extra={{ ...faceAt(t, [[0, 'happy']]) }}>
      <SchoolBag x={760 + t * 2 - 70} y={880 - 220} s={0.9} rot={-10} />
    </Rowing>
  </g>
);
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const hand = kf(t, [[0, 0], [24, 1]], easeOut);
  return (
    <g transform={camT(1100, 560, push(t, len, 1.2, 1.3))}>
      <Junction t={t + 200} id="c3" lv={760}
        children={<g>
          <defs><clipPath id="c3w"><rect x={1080} y={360} width={200} height={150} /></clipPath></defs>
          <g clipPath="url(#c3w)">{fig(TEAMAN, 1180, 760, 0.7, { yaw: -0.1, look: 0.3, ...faceAt(t, [[0, 'happy']]) }, 'rimR', 0)}</g>
          <Tache pose={{ x: 1180, y: feet2(760, 0.7), scale: 0.7, yaw: -0.1 }} />
        </g>}
        front={<g>
          <Arm from={[1200, 470]} to={[1180 + hand * 10, 520 + hand * 120]} c="#E4DCC8" skin={skin(TEAMAN)} w={36} />
          <TeaGlass x={1190} y={680 + (1 - hand) * -100} s={0.5} steam t={t} />
          <Rowing x={1240} y={880} s={0.8} t={t} oar={false} extra={{ yaw: 0.2, look: 0, armR: { a: 150, b: -10 }, armL: { a: 30, b: -40 }, ...faceAt(t, [[0, 'happy']]) }} />
        </g>}
      />
    </g>
  );
};
const feet2 = (g: number, s: number) => g - 140 * s;
export const C4: React.FC<ShotProps> = ({ t }) => {
  const k = kf(t, [[0, 0], [30, 1]], easeOut);
  return (
    <g>
      <Soft><Junction t={t + 240} id="c4" lv={760} /></Soft>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#1A1220" opacity={0.25} />
      <Arm from={[1300, -200]} to={[1000, 330 + k * 60]} c="#E4DCC8" skin={skin(TEAMAN)} w={130} />
      <Arm from={[700, 1400]} to={[920, 640 - k * 120]} c="#232327" skin={skin(PIP)} w={130} />
      <TeaGlass x={960} y={600 - k * 40} s={2.8} steam t={t} />
    </g>
  );
};
export const C5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <defs><clipPath id="c5l"><rect x={-200} y={-200} width={1158} height={1500} /></clipPath><clipPath id="c5r"><rect x={962} y={-200} width={1200} height={1500} /></clipPath></defs>
    <g clipPath="url(#c5l)"><g transform="translate(-480 0)"><g transform={camT(560, 560, 2)}>
      <Drowned t={t + 400} id="c5a" mode="day" lv={700} house={[800, 880, 0.6]} tips={false} />
      {fig(PIP, 520, 820, 1, { yaw: 0.5, look: 0.5, armR: { a: 50, b: -110 }, ...faceAt(t, [[0, 'happy']]) }, 'rimR', 0)}
      <PhoneGlow x={600} y={560} s={0.8} />
    </g></g></g>
    <g clipPath="url(#c5r)"><g transform="translate(480 0)"><g transform={camT(1400, 560, 2)}>
      <Coast t={t} id="c5b" hx={1700} />
      {fig(MO, 1400, 820, 1, { yaw: -0.5, look: -0.5, armL: { a: 50, b: -110 }, ...faceAt(t, [[0, 'happy']]) }, 'rimL', 0.5)}
      <PhoneGlow x={1320} y={560} s={0.8} />
    </g></g></g>
    <rect x={954} y={-200} width={12} height={1500} fill="#F6EFE3" />
  </g>
);
export const C6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, push(t, len, 1.2, 1.3))}>
    <Coast t={t} id="c6" hx={1700} lv={2000}>
      <BusShelter x={900} y={860} />
      <rect x={1250} y={520} width={16} height={330} fill="#5A5A62" />
      <rect x={1180} y={460} width={160} height={70} rx={8} fill="#2E6E4A" stroke={INK} strokeWidth={5} />
      <text x={1260} y={508} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#F6EFE3">ചെല്ലാനം</text>
      <VallamIn x={900} y={860} s={1} />
      {fig(DAD, 760, 870, 0.85, { yaw: 0.3, look: 0.2, legL: { a: 80, b: -90 }, legR: { a: 80, b: -90 }, armR: { a: 70, b: -60 }, ...faceAt(t, [[0, 'cool']]) }, 'rimR', 0)}
      <Tache pose={{ x: 760, y: feet2(870, 0.85), scale: 0.85, yaw: 0.3 }} />
      <Paper x={850} y={620} s={0.6} rot={-8} />
      {fig(MO, 1040, 870, 0.85, { yaw: -0.2, look: -0.3, legL: { a: 80, b: -90 }, legR: { a: 80, b: -90 }, armL: { a: 150, b: -20 }, ...faceAt(t, [[0, 'happy']]) }, 'rimL', 0)}
      <Vallam x={900} y={880} s={1} c="#2E6E8C" />
      <Water t={t} y={900} />
    </Coast>
  </g>
);
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const spin = t * 3;
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#2E6A72" />
      {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M ${rnd(1, i) * 2000} ${rnd(2, i) * 1100} q 40 ${Math.sin(t / 8 + i) * 8} 80 0`} stroke="#BFE6EA" strokeWidth={4} fill="none" opacity={0.4} />)}
      {/* the house edge with tiles, top of frame */}
      <path d="M -200 -200 L 2200 -200 L 2200 140 L -200 220 Z" fill="#A2432C" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M -200 ${-120 + i * 40} L 2200 ${-160 + i * 40}`} stroke="#7A2E1E" strokeWidth={6} />)}
      <circle cx={1500} cy={800} r={46} fill="#5C3E28" stroke={INK} strokeWidth={5} />
      <path d="M 300 700 q 40 -20 90 0 q -40 20 -90 0" fill="#4E7A3A" />
      <g transform={`translate(960 640) rotate(${spin}) translate(-960 -640)`}>
        <Rings x={960} y={660} t={t} s={2.4} />
        <Charuvam x={960} y={640} s={1.5} />
        {fig(SIS, 960, 760, 0.95, { yaw: 0, look: Math.sin(t / 6) * 0.6, armL: { a: 120, b: -20 }, armR: { a: 120, b: -20 }, legL: { a: 60, b: -70 }, legR: { a: -60, b: 70 }, ...faceAt(t, [[0, 'happy']]) }, 'rimR', 0)}
        <path d="M 660 640 Q 960 800 1260 640 Q 1260 700 960 770 Q 660 700 660 640 Z" fill="#B8BEC6" stroke={INK} strokeWidth={6} />
      </g>
      <Glow x={1500} y={-100} r={900} kind="warm" o={0.35} />
    </g>
  );
};
export const C8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 560, push(t, len, 1.6, 1.7))}>
    <Junction t={t + 300} id="c8" lv={2000}
      front={<g>
        {Wading({ look: UNCLE, x: 700, g: 960, s: 1, extra: { yaw: 0.3, look: 0.3, tilt: -6, armR: { a: 70, b: -60 }, ...faceAt(t, [[0, 'happy']]) } })}
        <Tache pose={{ x: 700, y: feet2(960, 1), scale: 1, yaw: 0.3 }} specs sides="#C8C4C0" />
        {Wading({ look: CROWD[1], x: 1000, g: 960, s: 0.95, extra: { yaw: -0.2, armL: { a: 90, b: -40 }, ...faceAt(t, [[0, 'happy']]) } })}
        {Wading({ look: CROWD[3], x: 1300, g: 960, s: 1, extra: { yaw: -0.4, look: -0.5, tilt: 8, ...faceAt(t, [[0, 'happy']]) } })}
        <Water t={t} y={800} />
        <rect x={-3000} y={800} width={8000} height={3000} fill="#6A5A3A" opacity={0.3} />
        <path d={`M 560 ${830 + Math.sin(t / 6) * 6} q 120 -16 260 4 q -110 30 -260 -4`} fill="#EFE8D8" opacity={0.85} />
        <FloatLabel x={1000} y={520} t={t % 60} text="ഹ" size={0} />
      </g>}
    />
  </g>
);
export const C9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(980, 480, push(t, len, 1, 1.06))}><KeralaMap t={t} id="c9" /></g>
    <Fact t={t - 10} big="590 കി.മീ കടൽത്തീരം" line="പതിനാലിൽ ഒമ്പത് ജില്ലകളും കടലോരത്ത്" src="Keltron Coastal Cell · CMFRI" />
  </g>
);

// ============================================================ D. DAY 3: SALT
const WellYard: React.FC<{ t: number; id: string; children?: React.ReactNode }> = ({ t, id, children }) => (
  <g>
    <Heaven t={t} id={id} mode="day" hy={480} sun={[1500, 200]} />
    <Laterite x0={-600} x1={2600} y0={360} y1={720} seed={2} />
    <rect x={-600} y={340} width={3200} height={30} fill="#7A4A32" stroke={INK} strokeWidth={5} />
    <Palm x={1650} y={720} s={0.75} t={t} />
    <rect x={-3000} y={720} width={8000} height={3000} fill="#6E5A44" />
    <path d="M -3000 900 L 5000 880" stroke="#5A8A9A" strokeWidth={0} />
    <rect x={-3000} y={960} width={8000} height={3000} fill="#4E6E72" opacity={0.6} />
    {children}
  </g>
);
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const sip = kf(t, [[0, 0], [30, 1]], easeOut);
  const p: P = { x: 1050, y: feet2(900, 1.1), scale: 1.1, yaw: -0.5, look: -0.2, headTilt: -sip * 10, armR: { a: 20 + sip * 90, b: -60 - sip * 40 }, ...faceAt(t, [[0, 'neutral']]) };
  const hnd = handAt(p, 'R');
  return (
    <g>
      <g transform={camT(900, 560, push(t, len, 1.5, 1.6))}>
        <WellYard t={t} id="d1">
          <Well x={640} y={800} s={1} />
          <Fig look={MOM} pose={p} rimId="rimL" />
          <Tumbler x={hnd.x} y={hnd.y + 20} s={0.7} />
        </WellYard>
      </g>
      <Day t={t - 2} label="ദിവസം" value="3" />
    </g>
  );
};
export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 1000, y: 820, scale: 2.4, yaw: -0.5, look: -0.3, headTilt: 10, ...faceAt(t, [[0, 'neutral'], [4, 'oops']]) };
  const h = headAt(p);
  return (
    <g transform={camT(980, 480, push(t, len, 1, 1.05))}>
      <WellYard t={t + 40} id="d2" />
      <Fig look={MOM} pose={p} rimId="rimL" />
      {t > 4 ? <Drops x={h.x - 160} y={h.y + 40} t={t - 4} n={14} w={200} color="#CDE6EA" /> : null}
    </g>
  );
};
export const D3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Soft><WellYard t={t + 80} id="d3" /></Soft>
    <g transform="translate(0 0)">
      <rect x={300} y={760} width={1400} height={400} fill="#C87A58" stroke={INK} strokeWidth={8} />
      <Tumbler x={960} y={780} s={3.6} salt={clamp(t / 6)} />
    </g>
    <Glow x={1300} y={200} r={700} kind="warm" o={0.4} />
  </g>
);
export const D4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(980, 520, push(t, len, 1, 1.05))}><Section t={t} id="d4" /></g>
    <Fact t={t - 10} big="1 – 2 മീറ്റർ താഴെ" line="കുട്ടനാട്ടിലെ വയലുകൾ കടൽനിരപ്പിനും താഴെ" src="FAO GIAHS (2013) · RAS, Integrated Vision for Kuttanad" />
  </g>
);
export const D5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 900, 1020), 520, 1.05)}><Bund t={t} id="d5" seaLv={680} lakeLv={700} /></g>
    <Fact t={t - 10} big="1976 മുതൽ" line="ഉപ്പുവെള്ളം തടയാൻ തണ്ണീർമുക്കം ബണ്ട്" src="Thanneermukkom Bund: built 1974, working since 1976" />
  </g>
);
export const D6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, push(t, len, 1.1, 1.2))}>
    <Bund t={t + 200} id="d6" close seaLv={kf(t, [[0, 640], [len, 600]])} lakeLv={600} />
    {[300, 1500].map((x, i) => <Rings key={x} x={x} y={612} t={t + i * 15} s={1.2} />)}
  </g>
);
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const y = clamp(t / (len * 0.8));
  const col = (k: number) => {
    const g = [110, 158, 70], yl = [200, 170, 60];
    const m = clamp(y * 1.3 - k * 0.3);
    return `rgb(${g.map((v, i) => Math.round(v + (yl[i] - v) * m)).join(',')})`;
  };
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#3E5A3A" />
      <Glow x={1500} y={150} r={900} kind="warm" o={0.4} />
      {Array.from({ length: 22 }).map((_, i) => {
        const x = -60 + i * 96;
        const sw = Math.sin(t / 14 + i) * 10;
        return (
          <g key={i} fill="none" strokeLinecap="round">
            <path d={`M ${x} 1200 Q ${x - 30} 700 ${x - 120 + sw} ${250 + (i % 4) * 60}`} stroke={col(i % 3)} strokeWidth={34} />
            <path d={`M ${x} 1200 Q ${x - 30} 700 ${x - 120 + sw} ${250 + (i % 4) * 60}`} stroke={INK} strokeWidth={3} opacity={0.4} />
          </g>
        );
      })}
      <Water t={t} y={940} />
      <Day t={t - 2} label="ദിവസം" value="5" />
    </g>
  );
};
export const D8: React.FC<ShotProps> = ({ t }) => {
  const down = kf(t, [[0, 0], [24, 1]], easeOut);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#4A3A44" />
      <Glow x={700} y={200} r={900} kind="warm" o={0.4} />
      <Cal x={1000} y={540} s={1.9} crossed={12} />
      <Arm from={[1900, 1300]} to={[1260 + down * 200, 640 + down * 420]} c="#8A5A6A" skin={skin(MOM)} w={90} />
      <rect x={1240 + down * 200} y={600 + down * 420} width={14} height={110} rx={6} fill="#2A4A8A" transform={`rotate(${20 + down * 50} ${1247 + down * 200} ${650 + down * 420})`} />
    </g>
  );
};
export const D9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, push(t, len, 1.4, 1.3))}>
    <Field t={t + 300} id="d9" mode="dusk" cl={820} yellow={1} houseLit={0} />
    {fig(MOM, 860, 805, 0.5, { yaw: 0.8, look: 0.4, ...faceAt(t, [[0, 'tired']]) }, 'rimR', 0.5)}
    {fig(PIP, 960, 805, 0.5, { yaw: 0.8, look: 0.4, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0.5)}
  </g>
);

// ============================================================ E. DAY 7: CHELLANAM
export const E1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 1000, 960), 560, 1)}>
      <Heaven t={t} id="e1" mode="day" hy={560} sun={[1600, 220]} />
      <Water t={t} y={600} />
      <g transform="translate(-60 0)"><ChinaNetLite /></g>
      <Rowing x={900 + t * 1.5} y={860} s={0.75} t={t} />
    </g>
    <Day t={t - 2} label="ദിവസം" value="7" />
  </g>
);
const ChinaNetLite: React.FC = () => (
  <g>
    <path d="M 120 1100 L 480 300 M 260 1100 L 480 300" stroke="#3A2A22" strokeWidth={22} strokeLinecap="round" />
    <path d="M 480 300 L 220 620 M 480 300 L 760 600" stroke="#3A2A22" strokeWidth={12} />
    <path d="M 220 620 Q 480 820 760 600" fill="#E8E0CC" fillOpacity={0.08} stroke="#E8E0CC" strokeWidth={5} />
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${220 + i * 67} ${620 - i * 2.5} Q ${480 + (i - 4) * 30} 760 ${480 + (i - 4) * 10} 770`} stroke="#E8E0CC" strokeWidth={2} opacity={0.5} fill="none" />)}
  </g>
);
export const E2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 860, 1060), 560, 1.05)}>
    <Coast t={t} id="e2" hx={1500} />
    {fig(PIP, 700, 900, 0.7, { yaw: -0.2, look: -0.5, ...faceAt(t, [[0, 'neutral']]) }, 'rimR', 0.5)}
    {fig(MO, 840, 900, 0.7, { yaw: -0.5, look: -0.6, armL: { a: 120, b: -10 }, ...faceAt(t, [[0, 'neutral']]) }, 'rimR', 0.5)}
  </g>
);
export const E3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 700, 900), 600, 2.2)}>
      <Coast t={t + 100} id="e3" hx={1500} />
      <TetraWall y={720} x0={-200} x1={2400} s={1.6} seed={9} />
    </g>
    <Fact t={t - 10} big="7.3 കി.മീ · ₹344 കോടി" line="ചെല്ലാനത്തെ ടെട്രാപോഡ് കടൽഭിത്തി, ഒന്നാം ഘട്ടം" src="KIIFB funding · built by ULCCS" />
  </g>
);
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const lift = kf(t, [[20, 0], [50, 1]], easeOut);
  return (
    <g transform={camT(980, 560, push(t, len, 1.3, 1.4))}>
      <AppuIn t={t} id="e4" lv={900}
        children={<g>
          <Cot x0={1000} x1={1700} y={860} leg={160} />
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={1100 + i * 110} cy={680 - (i % 2) * 30} rx={60} ry={40} fill={i % 2 ? '#C8CED6' : '#9A5A3A'} stroke={INK} strokeWidth={5} />)}
          {fig(APPUMA, 900, 930, 1, { yaw: 0.6, look: 0.6, armR: { a: 70 + lift * 40, b: -20 }, armL: { a: 60 + lift * 40, b: -20 }, ...faceAt(t, [[0, 'tired']]) }, 'rimR', 0)}
          <ellipse cx={1010 + lift * 40} cy={600 - lift * 40} rx={60} ry={40} fill="#C8CED6" stroke={INK} strokeWidth={5} />
          {fig(MO, 560, 930, 0.95, { yaw: 0.3, look: 0.4, ...faceAt(t, [[0, 'neutral']]) }, 'rimR', 0)}
        </g>}
      />
    </g>
  );
};
export const E5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, push(t, len, 1.05, 1.15))}>
    <Coast t={t + 200} id="e5" hx={1450} lv={kf(t, [[0, 1100], [len * 0.45, 830]], easeOut)}>
      {fig(PIP, 700, 900, 0.75, { yaw: 0.1, look: 0.1, ...faceAt(t, [[0, 'neutral'], [30, 'shock']]) }, 'rimR', 0)}
      {fig(MO, 860, 900, 0.75, { yaw: -0.1, look: 0, ...faceAt(t, [[0, 'neutral'], [34, 'shock']]) }, 'rimL', 0)}
    </Coast>
  </g>
);
export const E6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 560, push(t, len, 1.3, 1.4))}>
    <AppuIn t={t + 100} id="e6" lv={760}
      children={<g>{fig(MO, 1000, 1000, 1.05, { yaw: 0.1, look: -0.6, ...faceAt(t, [[0, 'tired']]), blink: 0.4 }, 'rimR', 0)}</g>}
      front={<g>
        {[[0, 840, 1, false], [1, 900, 0.8, true], [2, 980, 1.2, false]].map(([i, y, s, f]) => {
          const x = ((t * (3 + (i as number)) + (i as number) * 700) % 2600) - 300;
          return <g key={i as number} opacity={0.85}><Fish x={f ? 1920 - x : x} y={(y as number) + Math.sin(t / 6 + (i as number)) * 8} s={s as number} flip={f as boolean} c="#C8D8E0" /></g>;
        })}
      </g>}
    />
  </g>
);
export const E7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1040, 520, push(t, len, 1, 1.06))}><KochiMap t={t} id="e7" p={clamp((t - 20) / (len * 0.6))} /></g>
    <Fact t={t - 10} big="169 ച.കി.മീ" line="കടൽ ഒരു മീറ്റർ പൊങ്ങിയാൽ കൊച്ചിയിൽ വെള്ളത്തിനടിയിൽ" src="National Institute of Oceanography (Murali & Dinesh Kumar)" />
  </g>
);
export const E8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, push(t, len, 1.05, 1.12))}>
      <Heaven t={t} id="e8" mode="dusk" hy={760} sun={[1500, 520]} />
      <Skyline y={840} t={t} />
      <Water t={t} y={kf(t, [[0, 900], [len, 820]])} />
      <rect x={-3000} y={820} width={8000} height={3000} fill="#3A2A48" opacity={0.25} />
    </g>
    <Fact t={t - 10} big="43 ച.കി.മീ" line="അതിൽ നഗരം മാത്രം" src="National Institute of Oceanography (Murali & Dinesh Kumar)" />
  </g>
);
export const Q1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(900, 600, push(t, len, 1.7, 1.8))}>
      <Coast t={t + 300} id="q1" hx={1600} sunset />
      {fig(PIP, 900, 820, 1, { yaw: -0.4, look: -0.6, headTilt: -8, legL: { a: 80, b: -80 }, legR: { a: 70, b: -70 }, armL: { a: 30, b: -60 }, ...faceAt(t, [[0, 'neutral']]) }, 'rimL', 0)}
      <Tetrapod x={1000} y={810} s={1.4} rot={30} />
      <Tetrapod x={760} y={830} s={1.3} rot={80} />
    </g>
    <Ask t={t - 4} y={130} text="നീ അവസാനമായി കടലിൽ" /><Ask t={t - 8} y={250} text="കാല് നനച്ചത് ഏത് ബീച്ചിൽ?" />
  </g>
);

// ============================================================ F. DAY 10: THE RESCUE
export const F1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 1100, 1040), 560, 1.2)}>
      <Drowned t={t} id="f1" mode="night" lv={kf(t, [[0, 760], [len, 700]])} house={[1150, 900, 0.85]} lit={1} />
      <Rain t={t} o={0.45} />
    </g>
    <Day t={t - 2} label="ദിവസം" value="10" />
  </g>
);
export const F2: React.FC<ShotProps> = ({ t, len }) => {
  const beam = kf(t, [[0, -0.3], [len, 0.3]]);
  return (
    <g transform={camT(960, 560, push(t, len, 1.35, 1.45))}>
      <rect x={-3000} y={-3000} width={8000} height={8000} fill="#0C1022" />
      <KHouse x={960} y={980} s={1.6} night lit={0.4} door={0.6} />
      {fig(MOM, 860, 820, 0.85, { yaw: 0.5, look: 0.7, armR: { a: 40, b: -30 }, ...faceAt(t, [[0, 'worried']]) }, 'rimBlue', 0)}
      {fig(SIS, 980, 820, 0.6, { yaw: 0.5, look: 0.8, ...faceAt(t, [[0, 'worried']]) }, 'rimBlue', 0)}
      {fig(PIP, 1100, 820, 0.85, { yaw: 0.6, look: 0.9, ...faceAt(t, [[0, 'neutral'], [20, 'shock']]) }, 'rimBlue', 0)}
      <Water t={t} y={830} night />
      <Rain t={t} o={0.35} />
      <Cone d={`M 2400 ${300 + beam * 400} L 1100 ${560 + beam * 300} L 1100 ${700 + beam * 300} L 2400 ${900 + beam * 400} Z`} o={0.6} />
    </g>
  );
};
const BigBoat: React.FC<{ x: number; y: number; s?: number; t: number; dir?: 1 | -1; children?: React.ReactNode }> = ({ x, y, s = 1, t, dir = 1, children }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 8) * 6}) scale(${s * dir} ${s})`}>
    {children}
    <path d="M -480 -140 L 460 -140 L 520 -220 Q 520 -60 400 20 L -420 20 Q -500 -40 -480 -140 Z" fill="#2E6E8C" stroke={INK} strokeWidth={7} />
    <path d="M -470 -110 L 480 -110" stroke="#F2EADA" strokeWidth={10} />
    <text x={0} y={-40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#F2EADA" transform={dir < 0 ? 'scale(-1 1)' : undefined}>സെന്റ് ആന്റണി</text>
    <rect x={-560} y={-220} width={80} height={160} fill="#3A3A42" stroke={INK} strokeWidth={5} />
    <circle cx={500} cy={-240} r={16} fill="#FFE8A0" />
  </g>
);
export const F3: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, -300], [len, 600]], easeOut);
  return (
    <g transform={camT(960, 560, 1.15)}>
      <Drowned t={t + 120} id="f3" mode="night" lv={700} house={[1300, 900, 0.85]} lit={1} />
      <Glow x={x + 500} y={560} r={300} kind="warm" o={0.6} />
      <BigBoat x={x} y={820} s={0.7} t={t}>
        {fig(DAD, -470, -150, 1, { yaw: 0.5, look: 0.5, armL: { a: 60, b: -20 }, ...faceAt(t, [[0, 'neutral']]) }, 'rimR', 0)}
      </BigBoat>
      <Rain t={t} o={0.35} />
    </g>
  );
};
export const F4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 900, 1020), 540, 1.05)} filter="url(#f4sepia)">
      <defs><filter id="f4sepia" filterUnits="userSpaceOnUse" x={-3000} y={-3000} width={8000} height={8000}><feColorMatrix type="matrix" values="0.5 0.4 0.2 0 0.02  0.4 0.4 0.2 0 0.0  0.3 0.3 0.2 0 0  0 0 0 1 0" /></filter></defs>
      <Heaven t={t} id="f4" mode="day" hy={500} />
      {[[-100, 0.55], [500, 0.5], [1100, 0.55], [1700, 0.5]].map(([x, s], i) => <KHouse key={i} x={x} y={760} s={s} />)}
      <Water t={t} y={620} muddy />
      {[0, 1, 2, 3].map((i) => <Rowing key={i} x={-100 + i * 600 + t * 1.5} y={780 + (i % 2) * 110} s={0.75} t={t + i * 20} look={CROWD[i % 4]} />)}
    </g>
    <Day t={t - 2} label="2018 പ്രളയം" />
    <Fact t={t - 10} big="65,000 പേർ" line="669 വള്ളങ്ങളിൽ മത്സ്യത്തൊഴിലാളികൾ രക്ഷിച്ചവർ" src="Fisheries Minister J. Mercykutty Amma, via PTI, Aug 2018" />
  </g>
);
export const F5: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: 820, scale: 2.6, yaw: 0.3, look: 0.4, ...faceAt(t, [[0, 'tired']]), blink: 0.25 };
  return (
    <g transform={camT(960, 470, push(t, len, 1, 1.08))}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0C1022" />
      <Glow x={1500} y={400} r={700} kind="warm" o={0.4} />
      <Fig look={DAD} pose={p} rimId="rimR" />
      <Tache pose={p} />
      <Rain t={t} o={0.4} />
    </g>
  );
};
export const F6: React.FC<ShotProps> = ({ t }) => {
  const k = kf(t, [[0, 0], [24, 1]], easeOut);
  return (
    <g>
      <Home t={t} id="f6"><Almirah x={960} y={1060} s={1.8} open={1} /></Home>
      <Deed x={960 + k * 300} y={460 + k * 200} s={1.1} rot={-10} />
      <Arm from={[2000, 1300]} to={[1200 + k * 200, 520 + k * 200]} c="#8A5A6A" skin={skin(MOM)} w={110} />
    </g>
  );
};
export const F7: React.FC<ShotProps> = ({ t }) => {
  const p: P = { x: 960, y: 900, scale: 2.4, yaw: 0.2, look: -0.3, armL: { a: 40, b: -110 }, armR: { a: 40, b: -110 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={camT(960, 520, 1)}>
      <Home t={t} id="f7" />
      <Fig look={SIS} pose={p} rimId="rimR" />
      <SchoolBag x={960} y={1000} s={2.4} rot={-4} />
    </g>
  );
};
export const F8: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 900], [len, 300]]);
  return (
    <g transform={camT(960, 560, 1.1)}>
      <Drowned t={t + 160} id="f8" mode="night" lv={700} house={[1300, 900, 0.85]} lit={0.6} />
      <BigBoat x={x} y={820} s={0.62} t={t} dir={-1}>
        {fig(MOM, -200, -150, 0.9, { yaw: 0.6, look: 0.8, ...faceAt(t, [[0, 'worried']]) }, 'rimBlue', 0)}
        {fig(SIS, -40, -150, 0.65, { yaw: 0.6, look: 0.8, ...faceAt(t, [[0, 'worried']]) }, 'rimBlue', 0)}
        {fig(PIP, 120, -150, 0.9, { yaw: 0.7, look: 0.9, ...faceAt(t, [[0, 'worried']]) }, 'rimBlue', 0)}
        {fig(DAD, 420, -150, 0.9, { yaw: -0.5, look: -0.5 }, 'rimBlue', 0)}
      </BigBoat>
      <Rain t={t} o={0.3} />
    </g>
  );
};
export const F9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, push(t, len, 1.1, 1.18))}>
    <Camp t={t} id="f9">
      <Bench x={1100} y={800} w={600} />
      <Fig look={PIP} pose={{ x: 1400, y: 760, scale: 0.8, spin: -88, blink: 1, expr: 'tired', armL: { a: 30, b: -40 }, legL: { a: 10, b: 0 } }} rimId="rimR" />
      {fig(MOM, 500, 960, 0.75, { yaw: 0.4, legL: { a: 80, b: -90 }, legR: { a: 80, b: -90 }, ...faceAt(t, [[0, 'tired']]) }, 'rimR', 0)}
      {fig(UNCLE, 250, 960, 0.75, { yaw: 0.5, blink: 1, legL: { a: 80, b: -90 }, legR: { a: 80, b: -90 } }, 'rimR', 0)}
      {fig(CROWD[2], 1800, 960, 0.75, { yaw: -0.5, legL: { a: 80, b: -90 }, legR: { a: 80, b: -90 } }, 'rimL', 0)}
      <Lantern x={960} y={840} s={1} t={t} />
    </Camp>
  </g>
);
export const F10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 620, push(t, len, 1.6, 1.7))}>
    <Camp t={t + 200} id="f10">
      {fig(UNCLE, 700, 1060, 0.9, { yaw: 0.5, look: 0.5, tilt: 10, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0)}
      <Tache pose={{ x: 700, y: feet2(1060, 0.9), scale: 0.9, yaw: 0.5 }} specs sides="#C8C4C0" />
      {fig(MOM, 1240, 1060, 0.85, { yaw: -0.5, look: -0.5, tilt: -8, ...faceAt(t, [[0, 'worried']]) }, 'rimL', 0)}
      {fig(PIP, 1000, 1080, 0.9, { yaw: 0, look: 0, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0)}
      <rect x={760} y={780} width={420} height={40} fill="#7A4E32" stroke={INK} strokeWidth={5} />
      <Radio x={960} y={780} s={0.8} t={t} on={1} />
      <Lantern x={1300} y={780} s={0.8} t={t} />
    </Camp>
  </g>
);
export const F11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#1A1220" />
    <Glow x={960} y={600} r={800} kind="warm" o={0.4} />
    <Radio x={760} y={980} s={2.2} t={t} on={1} />
    {['മുംബൈ', 'ചെന്നൈ', 'ധാക്ക'].map((c, i) => (t > 6 + i * 28 ? (
      <g key={c} transform={`translate(${1420} ${280 + i * 200}) scale(${backOut(clamp((t - 6 - i * 28) / 8))})`}>
        <rect x={-210} y={-70} width={420} height={120} rx={60} fill="#120E22" opacity={0.85} stroke="#6FD0E0" strokeWidth={4} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3">{c}</text>
      </g>
    ) : null))}
  </g>
);

// ============================================================ G. DAY 20: THE MAN IN THE TIE
const Gateway: React.FC<{ t: number; id: string; children?: React.ReactNode }> = ({ t, id, children }) => (
  <g>
    <Heaven t={t} id={id} mode="day" hy={600} sun={[300, 260]} />
    <Palm x={1750} y={820} s={0.8} t={t} />
    <rect x={-3000} y={600} width={8000} height={260} fill="#E2D2B0" opacity={0} />
    <rect x={300} y={360} width={1300} height={460} fill="#D8C49A" stroke={INK} strokeWidth={6} />
    <path d="M 260 370 L 950 230 L 1640 370 Z" fill="#A2432C" stroke={INK} strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={360 + i * 210} y={460} width={130} height={170} fill="#2A3A4A" stroke={INK} strokeWidth={5} />)}
    <rect x={500} y={660} width={900} height={70} fill="#2E5A8A" stroke={INK} strokeWidth={5} />
    <text x={950} y={710} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3">ദുരിതാശ്വാസ ക്യാമ്പ് · ഗവ. ഹൈസ്കൂൾ</text>
    <rect x={-3000} y={820} width={8000} height={3000} fill="#8A7A62" />
    {children}
  </g>
);
export const G1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 1000, 960), 600, 1.05)}>
      <Gateway t={t} id="g1">
        <Gate x={300} y={860} open={1} />
        <WhiteCar x={kf(t, [[0, 2300], [40, 1400]], easeOut)} y={960} s={0.9} />
        {t > 40 ? fig(SUIT, 960, 980, 0.9, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'smug']]) }, 'rimR', 0.6) : null}
        {t > 40 ? <Tache pose={{ x: 960, y: feet2(980, 0.9), scale: 0.9, yaw: 0.4 }} /> : null}
        {fig(CROWD[1], 420, 980, 0.8, { yaw: 0.6, look: 0.7, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0.5)}
        {fig(UNCLE, 600, 980, 0.8, { yaw: 0.6, look: 0.7, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0.5)}
      </Gateway>
    </g>
    <Day t={t - 2} label="ദിവസം" value="20" />
  </g>
);
export const G2: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 900, y: 840, scale: 2.4, yaw: 0.4, look: 0.5, armR: { a: 75, b: -10 }, ...faceAt(t, [[0, 'smug']]) };
  const hnd = handAt(p, 'R');
  return (
    <g transform={camT(980, 480, push(t, len, 1, 1.06))}>
      <Soft><Gateway t={t + 80} id="g2" /></Soft>
      <Fig look={SUIT} pose={p} rimId="rimR" />
      <Tache pose={p} />
      <Paper x={hnd.x + 60} y={hnd.y} s={1.2} rot={-6} />
    </g>
  );
};
export const G3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#3A3446" />
    <Glow x={960} y={400} r={900} kind="warm" o={0.4} />
    <g transform="translate(960 560) rotate(-3)">
      <rect x={-460} y={-420} width={920} height={840} fill="#F2EADA" stroke={INK} strokeWidth={6} />
      <text x={0} y={-320} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#2A2230">ഭൂമി വിൽപ്പന കരാർ</text>
      {[0, 1, 2].map((i) => <rect key={i} x={-380} y={-260 + i * 50} width={760 - i * 120} height={14} rx={7} fill="#C8C0B0" />)}
      <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.title} fontSize={50} fill="#5A5262">വില / സെന്റ്</text>
      <text x={0} y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#7A7282">₹ 2,00,000</text>
      {t > 10 ? <path d={`M -250 40 L ${-250 + clamp((t - 10) / 8) * 500} 30`} stroke="#C8302A" strokeWidth={12} strokeLinecap="round" /> : null}
      {t > 24 ? <text x={0} y={200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#C8302A" transform={`translate(0 200) scale(${backOut(clamp((t - 24) / 8))}) translate(0 -200)`}>₹ 20,000</text> : null}
      <path d="M 120 330 q 60 -40 100 0 t 100 0" stroke="#2A4A8A" strokeWidth={6} fill="none" />
    </g>
  </g>
);
export const G4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, push(t, len, 1.4, 1.5))}>
    <Camp t={t + 400} id="g4" morning>
      <rect x={700} y={780} width={600} height={40} fill="#7A4E32" stroke={INK} strokeWidth={5} />
      <rect x={740} y={820} width={20} height={200} fill="#5A3826" /><rect x={1240} y={820} width={20} height={200} fill="#5A3826" />
      {[0, 1, 2].map((i) => <rect key={i} x={800 + i * 140} y={760} width={110} height={30} fill="#F2EADA" stroke={INK} strokeWidth={3} transform={`rotate(${-4 + i * 4} ${855 + i * 140} 775)`} />)}
      {[CROWD[1], UNCLE, CROWD[3], CROWD[2]].map((l, i) => <g key={i}>{fig(l, 600 - i * 170, 1060, 0.9 - i * 0.04, { yaw: 0.6, look: 0.5, tilt: i === 0 ? 14 : 0, armR: i === 0 ? { a: 70, b: -30 } : { a: 10, b: -8 }, ...faceAt(t, [[0, 'tired']]) }, 'rimR', 0.4)}</g>)}
    </Camp>
  </g>
);
export const G5: React.FC<ShotProps> = ({ t, len }) => {
  const look = kf(t, [[0, 0], [20, 1]], easeOut);
  const p: P = { x: 820, y: 840, scale: 2, yaw: 0.2, look: 0.2, tilt: -8, headTilt: look * 14, armL: { a: 40 + look * 60, b: -110 * look }, ...faceAt(t, [[0, 'smug'], [24, 'cool']]) };
  const hnd = handAt(p, 'L');
  return (
    <g transform={camT(980, 520, push(t, len, 1, 1.06))}>
      <Soft><Gateway t={t + 120} id="g5" /></Soft>
      <WhiteCar x={1250} y={1180} s={1.6} />
      <Fig look={SUIT} pose={p} rimId="rimR" />
      <Tache pose={p} />
      <circle cx={hnd.x} cy={hnd.y - 10} r={18} fill="#D8B860" stroke={INK} strokeWidth={4} />
    </g>
  );
};
export const G6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 1250, 1350), 560, 1.4)}>
      <Coast t={t + 400} id="g6" hx={1400}>
        {fig(DAD, 1120, 860, 0.8, { yaw: 0.2, look: 0.2, ...faceAt(t, [[0, 'tired']]) }, 'rimR', 0.5)}
        <Tache pose={{ x: 1120, y: feet2(860, 0.8), scale: 0.8, yaw: 0.2 }} />
        {fig(APPUMA, 1260, 860, 0.75, { yaw: 0.1, ...faceAt(t, [[0, 'worried']]) }, 'rimR', 0.5)}
        {fig(MO, 1660, 860, 0.7, { yaw: -0.3, look: -0.4, ...faceAt(t, [[0, 'neutral']]) }, 'rimL', 0.5)}
      </Coast>
    </g>
    <Fact t={t - 10} big="₹10 ലക്ഷം" line="കടലിന്റെ 50 മീറ്ററിനുള്ളിലെ കുടുംബങ്ങൾക്ക് മാറിത്താമസിക്കാൻ · പുനർഗേഹം, 2019 മുതൽ" src="Kerala Fisheries Department · Punargeham scheme" />
  </g>
);
export const G7: React.FC<ShotProps> = ({ t, len }) => {
  const give = kf(t, [[0, 0], [30, 1]], easeOut);
  const p: P = { x: 820, y: feet2(1060, 1.2), scale: 1.2, yaw: 0.5, look: 0.6, armR: { a: 40 + give * 45, b: -10 }, ...faceAt(t, [[0, 'neutral']]) };
  const hnd = handAt(p, 'R');
  return (
    <g transform={camT(980, 560, push(t, len, 1.5, 1.6))}>
      <Camp t={t + 500} id="g7" morning>
        {fig(SUIT, 1400, 1060, 1.1, { yaw: -0.5, look: -0.6, ...faceAt(t, [[0, 'smug'], [30, 'oops']]) }, 'rimL', 0.4)}
        <Tache pose={{ x: 1400, y: feet2(1060, 1.1), scale: 1.1, yaw: -0.5 }} />
        <Fig look={MOM} pose={p} rimId="rimR" />
        <Paper x={hnd.x + 40} y={hnd.y - 10} s={0.6} rot={10} />
      </Camp>
    </g>
  );
};
export const G8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#2A2026" />
    <Glow x={960} y={400} r={900} kind="warm" o={0.35} />
    <g transform={camT(960, 540, push(t, len, 1, 1.08))}>
      <Photo x={400} y={200} w={1120} h={640} id="g8">
        <rect x={0} y={0} width={1120} height={300} fill="#D8C8A8" />
        <path d="M 0 300 L 1120 280 L 1120 640 L 0 640 Z" fill="#8A7A5A" />
        <path d="M 0 420 Q 400 380 560 420 T 1120 400 L 1120 640 L 0 640 Z" fill="#A08A62" />
        {[[220, 0.7], [520, 0.8], [820, 0.7]].map(([x, s], i) => (
          <g key={i}>
            {fig(GRANDPA, x as number, 540, s as number, { yaw: 0.5, tilt: 20, armR: { a: 120, b: -30 }, armL: { a: 100, b: -40 }, expr: 'tired' }, 'rimR', 0)}
            <Mundu pose={{ x: x as number, y: feet2(540, s as number), scale: s as number, yaw: 0.5 }} />
            <line x1={(x as number) + 60} y1={300} x2={(x as number) + 120} y2={520} stroke="#4A3A2A" strokeWidth={8} />
          </g>
        ))}
        <text x={1080} y={620} textAnchor="end" fontFamily={FONT.hand} fontSize={34} fill="#3A2A1A">കായൽ നിലം · 1940</text>
      </Photo>
    </g>
  </g>
);
const GRANDPA: Look = { ...UNCLE, jacket: '#EFE8D8', jacketShade: '#D2C8B2' };
export const G9: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: 900, scale: 2.4, yaw: 0.35, look: 0.6, headTilt: -6, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={camT(960, 470, push(t, len, 1, 1.06))}>
      <Camp t={t + 600} id="g9"><Lantern x={1500} y={900} s={1.4} t={t} /></Camp>
      <Fig look={SIS} pose={p} rimId="rimR" />
    </g>
  );
};
export const G10: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: 820, scale: 2.5, yaw: -0.3, look: -0.4, headTilt: 6, ...faceAt(t, [[0, 'tired']]), blink: 0.45 };
  return (
    <g transform={camT(960, 470, push(t, len, 1.04, 1))}>
      <Camp t={t + 700} id="g10"><Lantern x={500} y={900} s={1.4} t={t} /></Camp>
      <Fig look={MOM} pose={p} rimId="rimL" />
    </g>
  );
};
export const G11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 560, push(t, len, 1.5, 1.6))}>
    <Camp t={t + 800} id="g11" morning>
      {fig(MOM, 800, 1060, 1.1, { yaw: 0.5, look: 0.6, armR: { a: 95, b: -5 }, handR: 'point', ...faceAt(t, [[0, 'neutral']]) }, 'rimR', 0.4)}
      {fig(PIP, 1250, 1060, 1.1, { yaw: -0.5, look: -0.6, headTilt: Math.sin(clamp((t - 30) / 20) * Math.PI) * 10, ...faceAt(t, [[0, 'worried'], [40, 'neutral']]) }, 'rimL', 0.4)}
    </Camp>
  </g>
);
export const G12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 900, 1000), 560, 1.05)}>
    <Drowned t={t + 500} id="g12" lv={650} />
    <Rowing x={300 + t * 2} y={780} s={0.7} t={t} />
  </g>
);

// ============================================================ H. THE SACK
export const H1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1320, 640, push(t, len, 2, 2.1))}>
    <Loft t={t + 400} id="h1" gx={1250}>
      <SeedSack x={1320} y={880} s={1.2} wet={0.5} open={clamp(t / 20)} id="h1" />
    </Loft>
  </g>
);
export const H2: React.FC<ShotProps> = ({ t, len }) => {
  const x = 820;
  return (
    <g transform={camT(900, 600, push(t, len, 1.8, 1.9))}>
      <Drowned t={t + 600} id="h2" lv={650} />
      <Rowing x={x} y={780} s={0.9} t={0} oar={false} extra={{ armL: { a: 50, b: -100 }, armR: { a: 50, b: -100 }, tilt: 8, look: 0.3, ...faceAt(t, [[0, 'tired']]) }}>
        <SeedSack x={x + 70} y={780 - 70} s={0.4} wet={0.5} id="h2" />
      </Rowing>
      <SeedSack x={x + 70} y={780 - 70} s={0.4} wet={0.5} id="h2b" />
    </g>
  );
};
export const H3: React.FC<ShotProps> = ({ t, len }) => {
  const up = kf(t, [[0, 0], [24, 1]], easeOut);
  const p: P = { x: 980, y: feet2(1060, 1.3), scale: 1.3, yaw: 0.4, look: 0.4, headTilt: up * 12, armR: { a: 40 + up * 60, b: -60 - up * 40 }, ...faceAt(t, [[0, 'neutral']]) };
  const hnd = handAt(p, 'R');
  return (
    <g transform={camT(1000, 560, push(t, len, 1.6, 1.7))}>
      <Camp t={t + 900} id="h3" morning>
        <SeedSack x={1400} y={1040} s={0.8} wet={0.5} open={1} id="h3" />
        <Fig look={DAD} pose={p} rimId="rimR" />
        <Tache pose={p} />
        {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={hnd.x + (rnd(2, i) - 0.5) * 50} cy={hnd.y - 10 + (rnd(3, i) - 0.5) * 20} rx={7} ry={4} fill="#E8C870" stroke="#8A6A2A" strokeWidth={1.5} />)}
      </Camp>
    </g>
  );
};
export const H4: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: 830, scale: 2.5, yaw: 0.2 + Math.sin(t / 5) * 0.15 * clamp(1 - t / 60), look: 0.2, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g transform={camT(960, 470, push(t, len, 1, 1.06))}>
      <Camp t={t + 1000} id="h4" morning />
      <Fig look={DAD} pose={p} rimId="rimR" />
      <Tache pose={p} />
    </g>
  );
};
export const H5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(push(t, len, 900, 1000), 560, 1.05)}><Pokkali t={t} id="h5" /></g>
    <Fact t={t - 10} big="പൊക്കാളി" line="ഉപ്പുവെള്ളം കയറുന്ന പാടങ്ങളിൽ വളരുന്ന നെല്ല് · എറണാകുളം, ആലപ്പുഴ, തൃശ്ശൂർ" src="GI-tagged Kerala rice · Mongabay India, 2021" />
  </g>
);
export const H6: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: 820, scale: 2.5, yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'tired'], [50, 'happy']]) };
  return (
    <g transform={camT(960, 470, push(t, len, 1.06, 1))}>
      <Camp t={t + 1100} id="h6" morning />
      <Fig look={MOM} pose={p} rimId="rimR" />
      <Glow x={1300} y={300} r={600} kind="warm" o={0.35} />
    </g>
  );
};

// ============================================================ I. THE TWIST
export const I1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(push(t, len, 1000, 940), 600, 1.05)}>
    <Field t={t + 400} id="i1" mode="dusk" cl={900} />
    {fig(PIP, 760, 820, 0.42, { yaw: 0.6, ...faceAt(t, [[0, 'neutral']]) }, 'rimR', 0.4)}
  </g>
);
export const I2: React.FC<ShotProps> = ({ t, len }) => {
  const p: P = { x: 960, y: 830, scale: 2.4, yaw: 0.1, look: 0, ...faceAt(t, [[0, 'neutral']]) };
  return (
    <g transform={camT(960, 470, push(t, len, 1, 1.1))}>
      <Soft><Field t={t + 500} id="i2" mode="dusk" cl={900} /></Soft>
      <Fig look={PIP} pose={p} rimId="rimR" />
    </g>
  );
};
export const I3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(980, 470, 1)}><Graph t={t} id="i3" p0={clamp(t / 60)} p1={0} /></g>
    <Fact t={t - 10} big="20 സെ.മീ" line="1901 മുതൽ 2018 വരെ കടൽ ഉയർന്നത്" src="IPCC AR6, Working Group I, 2021" />
  </g>
);
export const I4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(980, 470, 1)}><Graph t={t + 60} id="i4" p0={1} p1={clamp(t / 60)} /></g>
    <Fact t={t - 10} big="ഒരു മീറ്ററോളം" line="2100-ഓടെ, ലോകം ഏറ്റവും കൂടുതൽ പുക തുപ്പിയാൽ" src="IPCC AR6: very high emissions, 0.63–1.01 m by 2100 (vs 1995–2014)" />
  </g>
);
export const I5: React.FC<ShotProps> = ({ t, len }) => {
  const lv = kf(t, [[0, 840], [len * 0.7, 700]]);
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#2A1838" />
      <Glow x={1400} y={300} r={800} kind="warm" o={0.5} />
      <Toe x={960} y={720} s={1.3} />
      <Water t={t} y={lv} />
      <rect x={-3000} y={lv} width={8000} height={3000} fill="#5A2A48" opacity={0.35} />
      <Streak x={1400} y={lv + 6} t={t} h={300} />
      {lv < 740 ? <Rings x={960} y={lv + 8} t={t} s={1.6} /> : null}
    </g>
  );
};
export const I6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(980, 640, push(t, len, 1.25, 1.35))}>
      <Field t={t + 600} id="i6" mode="dusk" cl={880} />
      {fig(PIP, 960, 950, 0.7, { yaw: 0.35, look: 0.5, legL: { a: 30, b: 10 }, legR: { a: 20, b: 0 }, ...faceAt(t, [[0, 'neutral']]) }, 'rimR', 0)}
    </g>
    <Ask t={t - 6} y={130} text="നിന്റെ വീട്ടിൽ നിന്ന്" /><Ask t={t - 10} y={250} text="കടലിലേക്കോ കായലിലേക്കോ എത്ര ദൂരം?" />
  </g>
);

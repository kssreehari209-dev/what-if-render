// phone-ml: "What if everyone in Kerala put their phones down for a week?" A native 9:16 Short, drawn in a 1080 x 1920
// world (vcam centres it), people and text kept in the middle of the frame, clear of the Shorts UI. The narration stays
// straight; every joke is in the picture.
import React from 'react';
import {
  faceAt, clamp, easeOut, backOut, ShotProps, FONT, Glow, Tag, Phone, SCH, Foreground, rnd, Sparkle, DizzyStars,
} from '../../engine';
import { Sky, Palm, KHouse, Fig, handAt, headAt, kf, PIP, MO, MOM, Fade, FadeIn } from '../fly-ml/kit';
import {
  ground, vcam, TEAMAN, UNCLE, NBR, BRO, CROWD, Mundu, Tache, Say, DayChip, TeaGlass, GlassTower, BackYard, Sink, ChayaFront,
  Counter, QRStand, CashSign, SchBg, DotField, RoadSet, AtmKiosk, JunctionBoard, Cobweb, Spider, RoseCard, Cycle, Gate,
  Pocket, BusShelter, Bus, Album, Terrace, Carrom, Veranda, Towers, CallArcs,
} from './kit';

const walkArm = (t: number, a = 18) => ({ armL: { a: Math.sin(t / 5) * a, b: -10 }, armR: { a: -Math.sin(t / 5) * a, b: -10 } });

// ============================================================ A. COLD OPEN: washing up for a ten-rupee tea
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const s = 2.3;
  const scrub = Math.sin(t / 2.2);
  const p = { x: 400, y: ground(1760, s), scale: s, yaw: 0.45, look: 0.5, armR: { a: 62 + scrub * 8, b: -58 }, armL: { a: 58 - scrub * 6, b: -66 }, ...faceAt(t, [[0, 'worried']]) };
  const hand = handAt(p, 'R');
  return (
    <g transform={vcam(540, 960, kf(t, [[0, 1.06], [len, 1]]))}>
      <BackYard t={t} id="a1" />
      <GlassTower x={820} y={1480} rows={13} s={1.05} sway={0.25} wide={4} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <TeaGlass x={hand.x + 12} y={hand.y + 54} s={1.8} fill={0} />
      {[0, 1, 2].map((i) => <circle key={i} cx={hand.x - 30 + i * 34} cy={hand.y - 18 - ((t * 2 + i * 14) % 40)} r={13 + i * 2} fill="#F6FBFD" opacity={0.8} />)}
      <Sink x={400} y={1420} s={1.75} t={t} />
    </g>
  );
};

export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={vcam(540, 1000, kf(t, [[0, 1], [len, 1.08]]))}>
    <rect x={-300} y={-200} width={1700} height={2400} fill="#2B1C24" />
    <Glow x={280} y={520} r={520} kind="warm" o={0.8} />
    <Glow x={860} y={880} r={300} kind="warm" o={0.3} />
    <rect x={-300} y={1290} width={1700} height={900} fill="#6A4630" />
    <rect x={-300} y={1290} width={1700} height={22} fill="#936A48" />
    <TeaGlass x={540} y={1340} s={4.4} t={t + 40} steam />
    <Say y={560} text="₹10" size={190} color="#FFE27A" t={t - 2} />
  </g>
);

export const A3: React.FC<ShotProps> = ({ t }) => {
  const s = 1.8;
  const out = clamp((t - 20) / 6);
  const p = { x: 280, y: ground(1820, s), scale: s, yaw: 0.5, look: 0.6, armL: { a: 16, b: -4 }, armR: { a: 12, b: -4 }, ...faceAt(t, [[0, 'neutral'], [20, 'oops']]) };
  const m = { x: 640, y: 1240, scale: 1.6, yaw: -0.55, look: -0.7, headTilt: 3, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 }, ...faceAt(t, [[0, 'neutral']]) };
  return (
    <g>
      <ChayaFront t={t + 30} />
      <Fig look={TEAMAN} pose={m} rimId="rimL" />
      <Tache pose={m} />
      <Counter t={t + 30} />
      <TeaGlass x={420} y={1142} s={1.2} fill={0.08} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      {[-52, 58].map((d, i) => (
        <path key={i} d={`M ${p.x + d - 22} ${p.y + 12} h 44 q 8 ${out * 76} -22 ${out * 86} q -30 ${-out * 10} -22 ${-out * 86} Z`} fill="#EDE6D6" stroke="#14121C" strokeWidth={5} opacity={out > 0 ? 1 : 0} />
      ))}
    </g>
  );
};

/** Clean glasses stacked on a tray: three standing on it at (x, y), two standing on those, rims touching bases. */
const TrayGlasses: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const w = 22; // half a glass at the rim
  const h = 56;
  const one = (cx: number, by: number) => (
    <path key={`${cx}-${by}`} d={`M ${cx - w * 0.8} ${by} L ${cx - w} ${by - h} L ${cx + w} ${by - h} L ${cx + w * 0.8} ${by} Z`} fill="#DDEFF5" fillOpacity={0.62} stroke="#FFFFFF" strokeWidth={3.5} strokeLinejoin="round" />
  );
  return <g>{[-48, 0, 48].map((d) => one(x + d, y))}{[-24, 24].map((d) => one(x + d, y - h))}</g>;
};

export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.72;
  const tray = kf(t, [[44, 1320], [64, 1010]], easeOut);
  const rows = t > 66 ? 21 : 19;
  const sway = 0.2 + Math.sin(t / 6) * (t > 66 ? 0.5 : 0.1);
  const m = { x: tray, y: ground(1670, 0.9), scale: 0.9, yaw: -0.6, look: -0.6, armL: { a: 80, b: -4 }, armR: { a: 10, b: -8 }, ...faceAt(t, [[0, 'smug']]) };
  const th = handAt(m, 'L');
  const p = { x: 300, y: ground(1600, s), scale: s, yaw: 0.5, look: 0.4, armR: { a: 60 + Math.sin(t / 2.2) * 8, b: -50 }, ...faceAt(t, [[0, 'tired'], [70, 'shock']]) };
  return (
    <g>
      <BackYard t={t + 40} id="a4" />
      <GlassTower x={590} y={1480} rows={rows} s={0.74} sway={sway} wide={6} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Sink x={300} y={1470} s={0.6} t={t} />
      {t > 40 ? (
        <g>
          <Fig look={TEAMAN} pose={m} rimId="rimL" />
          <Tache pose={m} />
          <Mundu pose={m} />
          <rect x={th.x - 164} y={th.y - 6} width={176} height={16} rx={6} fill="#B8B4BC" stroke="#1A1230" strokeWidth={4} />
          {t < 68 ? <TrayGlasses x={th.x - 76} y={th.y - 6} /> : null}
        </g>
      ) : null}
    </g>
  );
};

// ============================================================ T. THE TITLE
export const T: React.FC<ShotProps> = ({ t, len }) => {
  const on = 1 - clamp((t - 82) / 10);
  return (
    <g>
      <Sky id="ttl" mode="dusk" y0={0} y1={1500} />
      <Glow x={540} y={1240} r={520} kind="warm" o={0.6} />
      {[-30, 170, 930, 1090].map((x, i) => <Palm key={i} x={x} y={1560} s={1.7 - (i % 2) * 0.35} t={t + i * 30} dark />)}
      <rect x={-100} y={1540} width={1280} height={500} fill="#141018" />
      <text x={540} y={420} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={12} fill="#FFE27A" opacity={clamp(t / 6)}>WHAT IF...</text>
      <Say y={640} text="ഒരാഴ്ച ഫോൺ" size={124} color="#FF8A3D" t={t - 2} />
      <Say y={800} text="ഇല്ലെങ്കിൽ?" size={136} color="#FFFFFF" t={t - 7} />
      <Phone x={540} y={1250} w={260} on={on} caller="" f={t} rot={kf(t, [[0, -8], [len, -4]])} />
    </g>
  );
};

// ============================================================ B. DAY 1: UPI GONE
export const B1: React.FC<ShotProps> = ({ t }) => {
  const k = backOut(clamp((t - 60) / 7));
  const y = 1100 - (1 - clamp((t - 60) / 7)) * 900;
  return (
    <g>
      <g transform={vcam(540, 1080, 1.35)}>
        <ChayaFront t={t + 60} />
        <Counter t={t + 60} />
        <QRStand x={400} y={1142} s={1.1} />
        <TeaGlass x={720} y={1142} s={1.1} t={t} />
      </g>
      {t > 58 ? <CashSign x={400 * 1.35 - 0 + 0} y={y} s={1.5 * k} rot={-7 + (1 - k) * 12} /> : null}
      <DayChip day={1} t={t} />
    </g>
  );
};

export const B2: React.FC<ShotProps> = ({ t }) => {
  const n = Math.min(80, Math.floor(clamp((t - 18) / 22) * 80));
  return (
    <g>
      <SchBg id="b2" />
      <DotField t={t} />
      <text x={540} y={380} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill={SCH.live}>{n} കോടി</text>
      <text x={540} y={470} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={52} fill={SCH.line}>ഇടപാട് / ദിവസം</text>
    </g>
  );
};

export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const out = clamp((t - 34) / 18);
  return (
    <g>
      <g transform={vcam(kf(t, [[0, 540], [20, 330]]), kf(t, [[0, 960], [20, 1440]]), kf(t, [[0, 1], [20, 1.7]]))}>
        <SchBg id="b3" />
        <DotField t={t + 40} out={out} />
      </g>
      <Say y={480} text="കേരളം" size={130} color={out > 0.1 ? '#E4544A' : '#FF8A3D'} t={t - 4} />
    </g>
  );
};

export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 520], [len - 14, 2420]]);
  const fig = (i: number, x: number) => {
    const p = { x, y: ground(1520, 0.9), scale: 0.9, yaw: -0.5, look: -0.3, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, expr: (['tired', 'worried', 'neutral'] as const)[i % 3], blink: 0 };
    return <Fig key={i} look={CROWD[i % 5]} pose={p} rimId="rimR" />;
  };
  return (
    <g transform={vcam(cx, 1320, 1.3)}>
      <RoadSet t={t} id="b4" />
      <AtmKiosk x={150} y={1500} />
      {[420, 590, 760].map((x, i) => fig(i, x))}
      {/* a chair brought from home */}
      <g transform="translate(930 1520)">
        <path d="M -60 0 L -46 -110 M 60 0 L 46 -110 M -60 -110 L 60 -110 M -56 -110 L -70 -220" stroke="#D9B45A" strokeWidth={13} fill="none" strokeLinecap="round" />
      </g>
      <Fig look={CROWD[3]} pose={{ x: 930, y: 1400, scale: 0.9, yaw: -0.8, facing: -1, look: -0.4, legL: { a: 82, b: -82 }, legR: { a: 78, b: -82 }, armR: { a: 40, b: -60 }, expr: 'smug' }} rimId="rimR" />
      {[1100, 1270].map((x, i) => fig(i + 3, x))}
      {/* a tiffin: lunch in the queue */}
      <Fig look={CROWD[0]} pose={{ x: 1440, y: ground(1520, 0.9), scale: 0.9, yaw: -0.5, armR: { a: 74, b: -74 }, armL: { a: 54, b: -50 }, expr: 'happy' }} rimId="rimR" />
      <rect x={1390} y={1310} width={70} height={80} rx={8} fill="#C8CCD2" stroke="#1A1230" strokeWidth={5} />
      {/* asleep on a mat, pillow and all */}
      <rect x={1560} y={1500} width={330} height={26} rx={6} fill="#C9A24A" stroke="#1A1230" strokeWidth={4} />
      <rect x={1770} y={1468} width={110} height={38} rx={18} fill="#EDE6D6" stroke="#1A1230" strokeWidth={4} />
      <Fig look={CROWD[2]} pose={{ x: 1740, y: 1486, scale: 0.85, spin: 90, yaw: 0.1, armL: { a: 6, b: 0 }, armR: { a: 6, b: 0 }, legL: { a: 2, b: 0 }, legR: { a: -2, b: 0 }, expr: 'neutral', blink: 1 }} rimId="rimR" />
      {[0, 1, 2].map((i) => {
        const ph = ((t + i * 14) % 42) / 42;
        return <text key={i} x={1850 + ph * 40} y={1410 - ph * 70} fontFamily={FONT.ui} fontWeight={800} fontSize={44 - i * 6} fill="#F6EFE3" opacity={1 - ph}>z</text>;
      })}
      {[2000, 2170, 2340].map((x, i) => fig(i + 5, x))}
      <JunctionBoard x={2520} y={1430} />
      {[2640, 2810, 2980, 3150].map((x, i) => fig(i + 8, x))}
    </g>
  );
};

// ============================================================ C. DAY 2: THE UNCLE WILL NOT STOP
export const C1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={vcam(540, 1040, kf(t, [[0, 1.12], [len, 1]]))}>
      <rect x={-300} y={-200} width={1700} height={2400} fill="#26202E" />
      <Glow x={200} y={660} r={700} kind="warm" o={0.55} />
      <rect x={-300} y={1000} width={1700} height={1300} fill="#6A4630" />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={-300} x2={1400} y1={1080 + i * 150} y2={1050 + i * 150} stroke="#5A3A28" strokeWidth={5} />)}
      <Phone x={540} y={1300} w={330} rot={-82} f={t} />
      <Cobweb x={170} y={1090} r={560} o={0.85} />
      <Spider x={760} top={-100} y={kf(t, [[0, 780], [74, 1170]], easeOut)} s={1.5} />
    </g>
    <DayChip day={2} t={t} />
  </g>
);

const Bubble: React.FC<{ y: number; x?: number; w?: number; t: number; icon: 'rose' | 'fwd' }> = ({ y, x = 300, w = 480, t, icon }) => {
  const m = clamp(t / 5);
  return (
    <g>
      <rect x={x} y={y} width={w} height={210} rx={30} fill="#3A4256" stroke="#5E6A84" strokeWidth={4} />
      {icon === 'rose' ? (
        <g transform={`translate(${x + w / 2} ${y + 104})`}>
          <path d="M 0 30 L 0 92" stroke="#6E9A7E" strokeWidth={10} opacity={0.6} />
          <circle r={56} fill="#9A7084" /><circle cx={-22} cy={12} r={30} fill="#AC8094" /><circle cx={22} cy={12} r={30} fill="#AC8094" />
        </g>
      ) : (
        <path transform={`translate(${x + w / 2 - 74} ${y + 110})`} d="M 0 44 Q 16 -20 90 -20 L 90 -56 L 150 0 L 90 56 L 90 18 Q 40 18 0 44 Z" fill="#7E8DA6" />
      )}
      {t > 0 ? (
        <path d={`M ${x + 40} ${y + 26} L ${x + 40 + (w - 80) * m} ${y + 26 + 158 * m} M ${x + w - 40} ${y + 26} L ${x + w - 40 - (w - 80) * m} ${y + 26 + 158 * m}`} stroke="#E4544A" strokeWidth={17} strokeLinecap="round" />
      ) : null}
    </g>
  );
};

export const C2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-100} y={-100} width={1280} height={2120} fill="#141220" />
    <Glow x={540} y={960} r={900} kind="cool" o={0.28} />
    <rect x={150} y={320} width={780} height={1300} rx={70} fill="#1C1E2A" stroke="#4A4E60" strokeWidth={10} />
    <rect x={190} y={360} width={700} height={140} rx={30} fill="#2A3040" />
    <circle cx={270} cy={430} r={46} fill="#5E6A84" />
    <text x={340} y={448} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#C8CCD8">ഫാമിലി ഗ്രൂപ്പ്</text>
    <Bubble y={620} t={t - 8} icon="rose" />
    <Bubble y={920} x={240} t={t - 38} icon="fwd" />
    <rect x={190} y={1440} width={700} height={100} rx={50} fill="#2A3040" />
  </g>
);

const dawnHouse = (t: number, id: string) => (
  <g>
    <Sky id={id} mode="dusk" y0={-100} y1={1420} />
    <circle cx={880} cy={980} r={110} fill="#FFD27E" />
    <Glow x={880} y={980} r={560} kind="warm" o={0.6} />
    <Palm x={-20} y={1430} s={1.5} t={t} dark />
    <Palm x={1110} y={1430} s={1.3} t={t + 40} dark />
    <KHouse x={540} y={1380} s={0.86} lit={0.5} />
    <rect x={-300} y={1380} width={1700} height={800} fill="#3A3238" />
  </g>
);

export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, -240], [34, 330]], easeOut);
  const s = 0.95;
  const u = { x: x + 10, y: 1400, scale: s, yaw: 0.55, look: 0.5, tilt: 8, legL: { a: 52 + Math.sin(t / 3) * 16, b: -60 }, legR: { a: 30 - Math.sin(t / 3) * 16, b: -60 }, armR: { a: 72, b: -12 }, armL: { a: 68, b: -14 }, ...faceAt(t, [[0, 'smug']]) };
  return (
    <g>
      {dawnHouse(t, 'c3')}
      <Gate x={640} y={1580} open={0} />
      <Cycle x={x} y={1680} s={1.05} t={x / 18} />
      <Fig look={UNCLE} pose={u} rimId="rimR" />
      <Tache pose={u} c="#D6D2DA" specs sides="#C9C6CE" />
      <Mundu pose={{ ...u, y: u.y + 10, scale: s * 0.9 }} />
      {t > 36 ? <Sparkle x={x + 130} y={1370} t={t - 36} /> : null}
    </g>
  );
};

export const C4: React.FC<ShotProps> = ({ t }) => {
  const s = 1.7;
  const reach = kf(t, [[0, 40], [10, 88]], easeOut);
  const u = { x: 300, y: ground(1860, s), scale: s, yaw: 0.6, look: 0.6, armR: { a: reach, b: -6 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'happy']]) };
  const p = { x: 830, y: ground(1860, s), scale: s, yaw: -0.55, look: -0.5, headTilt: -4, armL: { a: 54, b: -12 }, armR: { a: 8, b: -6 }, ...faceAt(t, [[0, 'tired']]) };
  const h = handAt(u, 'R');
  return (
    <g>
      <g transform={vcam(540, 960, 1)}>{dawnHouse(t + 60, 'c4')}</g>
      <rect x={-100} y={1000} width={1280} height={1000} fill="#000" opacity={0.25} />
      <Fig look={PIP} pose={p} rimId="rimL" />
      <Fig look={UNCLE} pose={u} rimId="rimR" />
      <Tache pose={u} c="#D6D2DA" specs sides="#C9C6CE" />
      <Mundu pose={u} />
      <RoseCard x={h.x + 80} y={h.y - 14} s={0.36} rot={6} />
    </g>
  );
};

export const C5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-100} y={-100} width={1280} height={2120} fill="#2A1E2A" />
    <Glow x={540} y={960} r={820} kind="warm" o={0.6} />
    <RoseCard x={540} y={980} s={backOut(clamp(t / 7)) * 1.5} rot={-3} />
    <Sparkle x={180} y={420} t={t} />
    <Sparkle x={910} y={1500} t={t - 6} />
  </g>
);

// ============================================================ D. DAY 3: THE POCKET
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const stop = 44;
  const x = kf(t, [[0, 260], [stop, 520]]);
  const s = 1.45;
  const p = { x, y: ground(1740, s) + (t < stop ? Math.abs(Math.sin(t / 5)) * -8 : 0), scale: s, yaw: 0.6, look: t > stop ? 0.0 : 0.5, legL: { a: t < stop ? Math.sin(t / 5) * 26 : 4, b: -8 }, legR: { a: t < stop ? -Math.sin(t / 5) * 26 : -4, b: -8 }, ...walkArm(t < stop ? t : 0), ...faceAt(t, [[0, 'neutral'], [stop + 2, 'shock']]) };
  return (
    <g>
      <g transform={vcam(kf(t, [[0, 840], [len, 1000]]), 1200, 1)}><RoadSet t={t} id="d1" /></g>
      <Fig look={PIP} pose={p} rimId="rimR" />
      <DayChip day={3} t={t} />
    </g>
  );
};

export const D2: React.FC<ShotProps> = ({ t }) => {
  const buzz = t < 34 ? 1 : 1 - clamp((t - 34) / 8);
  const hx = kf(t, [[26, 1300], [36, 560]], easeOut);
  return (
    <g>
      <Pocket t={t} buzz={buzz} />
      {t > 24 ? (
        <g transform={`translate(${hx} 1020)`}>
          <path d="M 0 -80 L 700 -120 L 700 120 L 0 80 Z" fill="#2E2B3D" stroke="#121019" strokeWidth={8} />
          <circle cx={-10} cy={0} r={130} fill="#E9C7A0" stroke="#121019" strokeWidth={7} />
          <path d="M -140 40 q -50 -80 16 -120" stroke="#121019" strokeWidth={7} fill="#E9C7A0" />
        </g>
      ) : null}
    </g>
  );
};

export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const s = 2.3;
  const p = { x: 470, y: ground(1860, s), scale: s, yaw: 0.5, look: 0.9, headTilt: 6, armR: { a: 70, b: -42 }, ...faceAt(t, [[0, 'worried']]) };
  const hd = handAt(p, 'R');
  return (
    <g>
      <g transform={vcam(1120, 1000, 1.4)}><g filter="url(#blur6)"><RoadSet t={t + 40} id="d3" /></g></g>
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Say x={hd.x + 40} y={hd.y - 90} text="?" size={150} color="#FFE27A" t={t - 6} />
    </g>
  );
};

export const D4: React.FC<ShotProps> = ({ t }) => {
  const slap = t >= 20;
  const row: [number, number, number][] = [[130, 1620, 1], [350, 1700, 1.1], [760, 1660, 1.05], [960, 1750, 1.18], [550, 1810, 1.25]];
  return (
    <g>
      <g transform={vcam(1400, 1200, 1)}><RoadSet t={t + 100} id="d4" /></g>
      {row.map(([x, g, s], i) => {
        const p = { x, y: ground(g, s), scale: s, yaw: i % 2 ? -0.4 : 0.4, look: 0, armR: { a: slap ? 4 : 10, b: slap ? -14 : -8 }, armL: { a: slap ? 4 : 10, b: slap ? -14 : -8 }, ...faceAt(t, [[0, 'neutral'], [20, 'shock']]) };
        return (
          <g key={i}>
            <Fig look={i === 4 ? PIP : i === 2 ? MOM : CROWD[i]} pose={p} rimId="rimR" />
            {slap && t < 42 ? <path d={`M ${x - 76 * s} ${p.y + 6} q -22 34 0 72 M ${x + 76 * s} ${p.y + 6} q 22 34 0 72`} stroke="#FFE27A" strokeWidth={8} fill="none" strokeLinecap="round" /> : null}
          </g>
        );
      })}
      <Tag x={540} y={500} t={t - 26} text="ഫാന്റം വൈബ്രേഷൻ" w={760} />
    </g>
  );
};

// ============================================================ E. DAY 4: THE BUS STOP
const stopCrowd = (t: number, x0 = 0) => {
  const a = { x: x0 + 180, y: ground(1520, 1), scale: 1, yaw: 0.6, look: 0.6, armL: { a: 12, b: -4 }, armR: { a: 46 + Math.sin(t / 6) * 14, b: -40 }, ...faceAt(t, [[0, 'happy']]) };
  const b = { x: x0 + 380, y: ground(1520, 1), scale: 1, yaw: -0.5, look: -0.5, armL: { a: 54, b: -30 }, ...faceAt(t, [[0, 'happy']]) };
  const c = { x: x0 + 690, y: ground(1540, 1), scale: 1, yaw: 0.5, look: 0.4, armR: { a: 66, b: -34 }, armL: { a: 66, b: -34 }, ...faceAt(t, [[0, 'smug']]) };
  const d = { x: x0 + 900, y: ground(1540, 1), scale: 1, yaw: -0.5, look: -0.2, headTilt: 5, ...faceAt(t, [[0, 'tired']]) };
  const h = handAt(c, 'R');
  return (
    <g>
      <Fig look={CROWD[1]} pose={a} rimId="rimR" />
      <Fig look={MOM} pose={b} rimId="rimL" />
      <Fig look={UNCLE} pose={c} rimId="rimR" />
      <Tache pose={c} c="#D6D2DA" specs sides="#C9C6CE" />
      <Mundu pose={c} />
      <Fig look={CROWD[3]} pose={d} rimId="rimL" />
      <Album x={h.x + 26} y={h.y - 8} s={0.95} />
    </g>
  );
};

export const E1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={vcam(540, kf(t, [[0, 1190], [len, 1210]]), kf(t, [[0, 1.02], [len, 1.08]]))}>
      <Sky id="e1" mode="dusk" y0={-100} y1={1360} />
      <Glow x={200} y={1040} r={520} kind="warm" o={0.55} />
      {[-40, 1100].map((x, i) => <Palm key={i} x={x} y={1400} s={1.3} t={t + i * 30} dark />)}
      <rect x={-200} y={1360} width={1500} height={900} fill="#3C3442" />
      <BusShelter x={540} y={1510} />
      {stopCrowd(t)}
    </g>
    <DayChip day={4} t={t} />
  </g>
);

export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.95;
  const shake = t > 18 ? Math.sin(t / 3) * 6 : 0;
  const p = { x: 280, y: ground(1880, s), scale: s, yaw: 0.62, look: 0.6, armR: { a: 72 + shake, b: -6 }, ...faceAt(t, [[0, 'happy']]) };
  const n = { x: 790, y: ground(1880, s), scale: s, yaw: -0.62, look: -0.6, armL: { a: 72 - shake, b: -6 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g>
      <g transform={vcam(540, 1100, 1.5)}>
        <g filter="url(#blur6)">
          <Sky id="e2" mode="dusk" y0={-100} y1={1360} />
          <rect x={-200} y={1360} width={1500} height={900} fill="#3C3442" />
          <BusShelter x={540} y={1510} />
        </g>
      </g>
      <Glow x={540} y={1040} r={520} kind="warm" o={0.3} />
      <Fig look={NBR} pose={n} rimId="rimL" />
      <Tache pose={n} />
      <Fig look={PIP} pose={p} rimId="rimR" />
    </g>
  );
};

export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t, [[0, -300], [len, 1700]]);
  return (
    <g transform={vcam(540, 1210, 1.05)}>
      <Sky id="e3" mode="dusk" y0={-100} y1={1360} />
      <rect x={-200} y={1360} width={1500} height={900} fill="#3C3442" />
      <BusShelter x={540} y={1510} />
      {stopCrowd(t + 60)}
      <Bus x={bx} y={1790} s={0.8} t={t} />
      {[0, 1, 2].map((i) => <circle key={i} cx={bx - 500 - i * 90} cy={1760 - i * 10} r={40 + i * 26} fill="#9A8E9E" opacity={0.3 - i * 0.08} />)}
    </g>
  );
};

// ============================================================ F. DAY 5: THE WIN
export const F1: React.FC<ShotProps> = ({ t }) => {
  const a = clamp((t - 14) / 60) * 150;
  const r = 340;
  const end = ((a - 90) * Math.PI) / 180;
  return (
    <g>
      <SchBg id="f1" />
      <g transform="translate(540 1060)">
        <circle r={r + 30} fill="none" stroke={SCH.line} strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => {
          const q = (i * Math.PI) / 6;
          return <line key={i} x1={Math.cos(q) * r} y1={Math.sin(q) * r} x2={Math.cos(q) * (r + 20)} y2={Math.sin(q) * (r + 20)} stroke={SCH.line} strokeWidth={8} />;
        })}
        {a > 0 ? <path d={`M 0 0 L 0 ${-r} A ${r} ${r} 0 0 1 ${Math.cos(end) * r} ${Math.sin(end) * r} Z`} fill={SCH.live} opacity={0.55} /> : null}
        <line x1={0} y1={0} x2={Math.cos(end) * (r - 20)} y2={Math.sin(end) * (r - 20)} stroke={SCH.line} strokeWidth={12} strokeLinecap="round" />
        <circle r={20} fill={SCH.line} />
      </g>
      <Say y={480} text={`${Math.round(a / 30)} മണിക്കൂർ`} size={130} color={SCH.live} t={t - 2} />
      <Say y={590} text="ദിവസവും ഫോണിൽ" size={62} color={SCH.line} t={t - 6} />
    </g>
  );
};

export const F2: React.FC<ShotProps> = ({ t }) => {
  const s = 1.25;
  const n = Math.min(35, Math.floor(clamp((t - 10) / 40) * 35));
  const p = { x: 240, y: 1420, scale: s, yaw: 0.65, look: 0.6, legL: { a: 82, b: -84 }, legR: { a: 78, b: -84 }, armR: { a: 66, b: -14 }, ...faceAt(t, [[0, 'happy']]) };
  const m = { x: 840, y: 1420, scale: s, yaw: -0.65, facing: -1 as const, look: -0.6, legL: { a: 82, b: -84 }, legR: { a: 78, b: -84 }, armL: { a: 54, b: -20 }, ...faceAt(t, [[0, 'smug']]) };
  return (
    <g>
      <Terrace t={t} id="f2" />
      <Fig look={MO} pose={m} rimId="rimL" />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Carrom x={540} y={1420} s={1.1} t={t} />
      <Say y={520} text={`+${n} മണിക്കൂർ`} size={126} color="#FFE27A" t={t - 2} />
    </g>
  );
};

// ============================================================ G. DAY 6: THE VERANDA, THE GULF
export const G1: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.5;
  const p = { x: 360, y: 1190, scale: s, yaw: 0.6, look: t > 70 ? 0.8 : 0.5, legL: { a: 82, b: -82 }, legR: { a: 78, b: -82 }, armL: { a: 30, b: -40 }, armR: { a: 34, b: -40 }, ...faceAt(t, [[0, 'neutral']]) };
  return (
    <g>
      <g transform={vcam(kf(t, [[0, 500], [len, 470]]), 1080, kf(t, [[0, 1], [len, 1.12]]))}>
        <Veranda t={t} id="g1" />
        <Fig look={MOM} pose={p} rimId="rimR" />
        <Phone x={640} y={1198} w={120} rot={88} f={t} />
      </g>
      <DayChip day={6} t={t} />
    </g>
  );
};

export const G2: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.9;
  const p = { x: 500, y: ground(1860, s), scale: s, yaw: 0.45, look: 0.6, ...faceAt(t, [[0, 'neutral'], [46, 'worried']]) };
  const h = headAt(p);
  return (
    <g>
      <g transform={vcam(540, 960, kf(t, [[0, 1.02], [len, 1.1]]))}>
        <Sky id="g2" mode="night" y0={-100} y1={1500} stars={40} t={t} />
        <Towers t={t} />
        <rect x={-300} y={1500} width={1700} height={900} fill="#0E1228" />
      </g>
      <Fig look={BRO} pose={p} rimId="rimBlue" />
      <Tache pose={p} />
      {/* the phone at his ear, drawn after the head (the rig's hand can't reach it) */}
      <path d={`M ${h.x + 40} ${h.y + 250} L ${h.x + 104} ${h.y + 34}`} stroke="#2F7E7C" strokeWidth={62} strokeLinecap="round" />
      <Phone x={h.x + 96} y={h.y + 6} w={78} rot={8} on={0.8} caller="" f={t} />
      <circle cx={h.x + 112} cy={h.y + 54} r={34} fill={BRO.skin} stroke="#16121E" strokeWidth={5} />
      <rect x={130} y={1530} width={820} height={18} fill="#8E97AC" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={150 + i * 110} y={1548} width={12} height={400} fill="#8E97AC" />)}
      <rect x={-20} y={340} width={1120} height={390} fill="#0A0C20" opacity={0.62 * clamp(t / 8)} />
      <Tag x={540} y={420} t={t - 8} text="വിളിക്കുന്നു... അമ്മ" w={680} />
      <Say y={590} text="22 ലക്ഷം മലയാളികൾ" size={82} color="#FFE27A" t={t - 18} />
      <Say y={690} text="കടലിനക്കരെ" size={70} color="#F6EFE3" t={t - 24} />
    </g>
  );
};

export const H1: React.FC<ShotProps> = ({ t }) => {
  const n = Math.min(22, Math.floor(clamp((t - 8) / 30) * 22));
  return (
    <g>
      <SchBg id="h1" />
      <CallArcs t={t} p={clamp((t - 6) / 60)} />
      <Say y={380} text={`${n} ലക്ഷം മലയാളികൾ`} size={92} color={SCH.live} t={t - 2} />
      <Say y={540} text="ഗൾഫ്" size={60} color={SCH.line} />
      <Say x={930} y={1500} text="കേരളം" size={60} color={SCH.line} />
    </g>
  );
};

export const H2: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.6;
  return (
    <g transform={vcam(600, 1340, kf(t, [[0, 1.15], [len, 1.3]]))}>
      <rect x={-300} y={-300} width={1700} height={2600} fill="#1A1622" />
      <Glow x={920} y={760} r={640} kind="warm" o={0.5} />
      <rect x={-300} y={1270} width={1700} height={1000} fill="#6A3226" />
      <rect x={-300} y={1270} width={1700} height={24} fill="#8A4A38" />
      <Phone x={430} y={1400} w={260} rot={82} f={t} />
      {/* amma's hand, resting beside it, not touching it */}
      <path d="M 1400 1160 L 1000 1300" stroke="#8A5A6A" strokeWidth={120} strokeLinecap="round" />
      <ellipse cx={950} cy={1316} rx={78} ry={46} fill="#E9C7A0" stroke="#14121C" strokeWidth={6} />
      <Foreground blur={10}><rect x={-300} y={1600} width={1700} height={700} fill="#0E0A12" /></Foreground>
    </g>
  );
};

export const END: React.FC<ShotProps> = ({ t }) => {
  const wake = 38;
  const on = clamp((t - wake) / 6);
  const q = 44;
  return (
    <g>
      <rect x={-100} y={-100} width={1280} height={2120} fill="#0E0C1E" />
      <Glow x={540} y={1340} r={720 * on + 1} kind="cool" o={0.65 * on} />
      <Phone x={540} y={1420} w={kf(t, [[0, 320], [130, 380]])} on={on} caller="?" buzz={on > 0.9 ? 1 : 0} f={t} />
      {t < wake + 4 ? <DayChip day={7} t={t} /> : null}
      <Say y={560} text="നീ ആദ്യം" size={120} color="#F6EFE3" t={t - q} />
      <Say y={730} text="ആരെ വിളിക്കും?" size={118} color="#FFE27A" t={t - q - 6} />
      {t > q + 40 ? <Tag x={540} y={880} t={t - q - 40} text="കമന്റിൽ പറ" w={440} /> : null}
    </g>
  );
};

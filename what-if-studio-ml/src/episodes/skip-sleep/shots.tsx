import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, settle, camT, LOOKS, LEG_LEN, HEAD, toWorld,
  Bedroom, BedDuvet, BEDROOM, bedSit, bedTop, LAMP, stand, Study, Desk, Tabletop, Rooftop, Schematic, SCH, SchLabel, CountUp, Arrow, DrawOn,
  AlarmClock, OpenBook, BookTower, LaptopBack, Foreground, Glow, Dust, Sparkle, FloatLabel, FocusRings, TitleCard, ShotProps,
} from '../../engine';

// "What if you could skip sleep forever?" Nineteen shots on three sets (the bedroom at night, the study at night, the
// rooftop at sunrise) and the schematic. The power: tired lids snap wide open with a cyan glint (SKIP), and the clock
// runs on without him. Each shot is a pure function of its own clock t.

const PIP = LOOKS.ramu;
const MO = LOOKS.appu;
const CYAN = '#8FF0FF';

// where things sit in the bedroom
const CLOCK = BEDROOM.P(0.455, 0.78, 0.075);
const PIP_BED = bedSit(0.22);
const MO_BED = bedSit(0.2);
const BEAN = BEDROOM.P(0.74, 1, 0.5);
const BEAN_S = BEDROOM.s(0.5) / BEDROOM.s(0.085);

/** Pip sitting up in bed, the laptop on his knees, both hands on it. */
const pipInBed = (extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: PIP_BED.x, y: PIP_BED.y, scale: PIP_BED.scale, yaw: 0.2, look: 0.1, headTilt: 6,
  armL: { a: 38, b: 52 }, armR: { a: 38, b: 52 }, ...extra,
});
/** A head-and-shoulders close-up: head centre at (hx, hy), scale sc. */
const closeUp = (hx: number, hy: number, sc: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: hx, y: hy - HEAD.y * sc, scale: sc, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, ...extra,
});
/** A world-space glint pair over a head (for when the room has gone dark around him). */
const EyeGlint: React.FC<{ x: number; y: number; s: number; o: number }> = ({ x, y, s, o }) => (
  <g opacity={o}>
    <Glow x={x} y={y} r={90 * s} kind="cool" o={0.7} />
    <circle cx={x - 15 * s} cy={y} r={5 * s} fill={CYAN} style={{ filter: `drop-shadow(0 0 ${6 * s}px ${CYAN})` }} />
    <circle cx={x + 15 * s} cy={y} r={5 * s} fill={CYAN} style={{ filter: `drop-shadow(0 0 ${6 * s}px ${CYAN})` }} />
  </g>
);
/** The bedroom, blurred and scaled up behind a close-up. */
const SoftBedroom: React.FC<{ t: number; id: string; tx: number; ty: number; s: number; lamp?: number; clock?: string; dark?: number }> = ({ t, id, tx, ty, s, lamp = 1, clock = '00:00', dark = 0.25 }) => (
  <g>
    <g filter="url(#blur16)">
      <g transform={`translate(${tx} ${ty}) scale(${s})`}>
        <Bedroom t={t} id={id} lamp={lamp} clock={clock} crossed={0} />
      </g>
    </g>
    <rect x={-200} y={-200} width={2320} height={1480} fill="#07040C" opacity={dark} />
  </g>
);

// ---------- S1: macro insert: the bedside clock flips to midnight ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(CLOCK.x - 8, CLOCK.y - 34, kf(t, [[0, 5.2], [len, 5.6]]))}>
    <g filter="url(#blur6)">
      <Bedroom t={t + 10} id="b1" clock="00:00" crossed={0} />
    </g>
    <Glow x={LAMP.x} y={LAMP.y + 40} r={160} o={0.5} />
    <AlarmClock x={CLOCK.x} y={CLOCK.y} s={0.34} text={t < 22 ? '23:59' : '00:00'} />
  </g>
);

// ---------- S2: medium, in bed: one more level, the laptop's light on his tired face ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const nod = Math.max(0, Math.sin(t / 5)) * 6;
  const pose = pipInBed({ headTilt: 8 + nod, ...faceAt(t, [[0, 'tired']]), blink: t > 22 ? 0.4 : 0 });
  return (
    <g transform={camT(kf(t, [[0, PIP_BED.x + 60], [len, PIP_BED.x + 50]]), PIP_BED.y - 40, kf(t, [[0, 2.5], [len, 2.65]]))}>
      <Bedroom t={t + 30} id="b2" duvet={false} clock="00:00" crossed={0} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      <BedDuvet knees={1} />
      <LaptopBack x={PIP_BED.x + 6} y={PIP_BED.y + 34 * PIP_BED.scale} w={120 * PIP_BED.scale} glow={0.9 + 0.1 * Math.sin(t * 1.3)} />
    </g>
  );
};

// ---------- S3: extreme close-up: SKIP, the tired eyes snap open with a cyan glint ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 7 * (1 + 0.03 * clamp(t / len));
  const snap = t >= 19;
  const pose = closeUp(960, 560, sc, { yaw: 0.15, look: 0, headTilt: snap ? 0 : 7 + 4 * clamp(t / 16), ...faceAt(t, [[0, 'tired'], [19, 'shock']]), blink: snap ? 0 : 0.35 * clamp(t / 18) });
  return (
    <g transform={snap ? `translate(${Math.sin(t * 3) * 4 * clamp(1 - (t - 19) / 6)} 0)` : undefined}>
      <SoftBedroom t={t + 60} id="b3" tx={-900} ty={-700} s={2.4} />
      <Glow x={960} y={1000} r={600} kind="cool" o={0.5} />
      <Hero look={PIP} pose={{ ...pose, glint: snap ? 1 : 0 }} rimId="rimBlue" shadow={0} />
      {snap ? <FocusRings x={960} y={520} t={t - 19} r0={140} color={CYAN} /> : null}
    </g>
  );
};

// ---------- S4: wide, the bedroom: he wins, both arms up in bed ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...pipInBed({ yaw: 0.1, look: 0 }) } },
    { f: 3, p: { squash: 0.06 } },
    { f: 8, p: { armL: { a: 150, b: 12 }, armR: { a: 150, b: 12 }, squash: -0.04, headTilt: -6 }, ease: easeOut },
    { f: 12, p: { armL: { a: 142, b: 18 }, armR: { a: 142, b: 18 }, squash: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 905]]), 540, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Bedroom t={t + 90} id="b4" duvet={false} clock="00:01" crossed={0} veil={0.32} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]), glint: 0.6 }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
      <LaptopBack x={PIP_BED.x + 6} y={PIP_BED.y + 34 * PIP_BED.scale} w={120 * PIP_BED.scale} glow={1} />
      <Sparkle x={PIP_BED.x + 40} y={PIP_BED.y - 200 * PIP_BED.scale} t={t - 8} s={0.6} />
    </g>
  );
};

// ---------- S5: macro insert, low: 03:00 ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`rotate(-4 960 540)`}>
    <g transform={camT(CLOCK.x + 30, CLOCK.y - 60, kf(t, [[0, 4.4], [len, 4.7]]))}>
      <g filter="url(#blur6)">
        <Bedroom t={t + 120} id="b5" clock="03:00" crossed={0} />
      </g>
      <Glow x={LAMP.x} y={LAMP.y + 40} r={190} o={0.55} />
      <AlarmClock x={CLOCK.x} y={CLOCK.y} s={0.34} text="03:00" />
    </g>
  </g>
);

// ---------- S6: medium, the study at night: big test, a tower of books, he's fading ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 712, yaw: 0.35, look: 0.5, headTilt: 6, tilt: 4, armL: { a: 30, b: 60 }, armR: { a: 44, b: 70 } } },
    { f: len, p: { headTilt: 18, tilt: 12 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 970]]), 600, kf(t, [[0, 1.8], [len, 1.9]]))}>
      <Study t={t + 40} id="st6" night />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]), blink: t > 20 ? 0.5 : 0 }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} laptop={false} />
      <BookTower x={1150} y={694} n={7} s={0.8} />
      <OpenBook x={930} y={700} w={190} />
      <Foreground blur={10}>
        <path d="M 520 1000 Q 560 820 470 700 Q 430 840 400 1000 Z" fill="#0E0E18" />
      </Foreground>
    </g>
  );
};

// ---------- S7: close-up, the study: SKIP, he sits bolt upright ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.2;
  const up = easeOut(clamp((t - 19) / 5));
  const pose = closeUp(880, 520 - 30 * up, sc, { yaw: 0.35, look: 0.5, tilt: 10 * (1 - up), headTilt: 14 * (1 - up), ...faceAt(t, [[0, 'tired'], [19, 'shock']]), blink: t < 19 ? 0.4 : 0 });
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-1100 -900) scale(2.4)">
          <Study t={t + 80} id="st7" night />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.25} />
      <Glow x={1500} y={300} r={700} o={0.4} />
      <Hero look={PIP} pose={{ ...pose, glint: t >= 19 ? 1 : 0 }} rimId="rimR" shadow={0} />
      {t >= 19 ? <FocusRings x={880} y={500 - 30 * up} t={t - 19} r0={120} color={CYAN} /> : null}
    </g>
  );
};

// ---------- S8: top-down over the desk: the pages flip by in a blur, finished books pile up ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const done = Math.min(10, 1 + Math.floor(t / 3));
  return (
    <g transform={`translate(960 540) rotate(${3 - t * 0.05}) scale(${1.02 + t * 0.002}) translate(-960 -540)`}>
      <Tabletop edge={1400} />
      <Glow x={760} y={380} r={760} o={0.4} />
      {/* the lamp's base at the top left, a mug, a pencil */}
      <circle cx={180} cy={140} r={120} fill="#2A2026" />
      <circle cx={180} cy={140} r={60} fill="#3A2E34" />
      <circle cx={1650} cy={860} r={90} fill="#000" opacity={0.3} />
      <circle cx={1640} cy={850} r={82} fill="#4A5A7A" />
      <circle cx={1640} cy={850} r={62} fill="#2A1A14" />
      <rect x={300} y={880} width={300} height={14} rx={7} fill="#E9C46A" transform="rotate(-18 450 887)" />
      {/* the finished books, closed, piling up on the right */}
      {Array.from({ length: done }).map((_, i) => (
        <g key={i} transform={`translate(${1420 + Math.sin(i * 2.1) * 20} ${430 - i * 4}) rotate(${Math.sin(i * 1.7) * 9})`}>
          <rect x={-150} y={-105} width={300} height={210} rx={8} fill="#000" opacity={0.3} transform="translate(8 8)" />
          <rect x={-150} y={-105} width={300} height={210} rx={8} fill={['#7A4A4A', '#4A5A7A', '#8A7A4A', '#4A6A5A', '#6A4A6A'][i % 5]} />
          <rect x={-150} y={-105} width={22} height={210} rx={6} fill="#000" opacity={0.25} />
        </g>
      ))}
      <g transform="translate(860 700) scale(1)">
        <OpenBook x={0} y={0} w={1000} turn={(t * 0.55) % 1} />
      </g>
      {/* a motion smear over the turning pages */}
      <ellipse cx={860} cy={480} rx={420} ry={160} fill="#FFF8EA" opacity={0.08 + 0.06 * Math.sin(t * 2.4)} />
    </g>
  );
};

// ---------- S9: wide, the bedroom: Mo has the bed and is fast asleep; Pip on the beanbag, wide awake ----------
const S9_PIP = (t: number): Pose => ({
  ...basePose, x: BEAN.x + 6 * BEAN_S, y: BEAN.y - 70 * BEAN_S * PIP_BED.scale, scale: PIP_BED.scale * BEAN_S, yaw: -0.7, facing: -1, look: -0.8,
  legL: { a: 80, b: -80 }, legR: { a: 74, b: -84 }, armL: { a: 30, b: 50 }, armR: { a: 36, b: 56 }, headTilt: Math.sin(t / 14) * 2,
});
const moAsleep = (t: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: MO_BED.x, y: MO_BED.y, scale: MO_BED.scale, yaw: 0.25, look: 0, headTilt: -16 + Math.sin(t / 18) * 2,
  armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, expr: 'neutral', blink: 1, ...extra,
});
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 930], [len, 940]]), 560, kf(t, [[0, 1.02], [len, 1.06]]))}>
    <Bedroom t={t + 150} id="b9" duvet={false} clock="01:12" crossed={0} veil={0.32} />
    <Hero look={MO} pose={moAsleep(t)} rimId="rimR" shadow={0} />
    <BedDuvet knees={1} />
    <Hero look={PIP} pose={{ ...S9_PIP(t), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.4} />
  </g>
);

// ---------- S10: close-up: Mo, out cold, head lolling ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 5;
  const loll = kf(t, [[0, -10], [len, -22]], easeIn);
  return (
    <g>
      <SoftBedroom t={t + 190} id="b10" tx={-500} ty={-1000} s={2.6} clock="01:20" />
      <Glow x={1500} y={500} r={700} o={0.45} />
      <Hero look={MO} pose={closeUp(900, 540 + 6 * Math.sin(t / 8), sc, { yaw: 0.3, look: 0, headTilt: loll, expr: 'neutral', blink: 1 })} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S11: extreme close-up in the dark: SKIP, Pip's eyes wide and glinting, not blinking ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 6.4], [len, 7.4]]);
  const pose = closeUp(1000, 560, sc, { yaw: -0.25, look: -0.6, headTilt: -3, ...faceAt(t, [[0, 'neutral']]), blink: 0 });
  return (
    <g>
      <SoftBedroom t={t + 230} id="b11" tx={-1300} ty={-900} s={2.6} dark={0.5} clock="02:40" />
      <Glow x={300} y={600} r={800} o={0.3} />
      <Hero look={PIP} pose={{ ...pose, glint: t >= 20 ? 1 : 0.3 }} rimId="rimBlueL" shadow={0} />
    </g>
  );
};

// ---------- S12: over Pip's shoulder: Mo asleep beyond; the clock races through the night ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const mins = 60 + (360 - 60) * clamp(t / (len - 6));
  const read = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(Math.floor(mins % 60)).padStart(2, '0')}`;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 760], [len, 775]]), 590, kf(t, [[0, 2.2], [len, 2.3]]))}>
        <Bedroom t={t + 270} id="b12" duvet={false} clock={read} crossed={0} />
        <Hero look={MO} pose={moAsleep(t + 40, { headTilt: kf(t, [[0, -16], [30, 12], [len, 14]]) })} rimId="rimR" shadow={0} />
        <BedDuvet knees={1} />
        <Glow x={CLOCK.x} y={CLOCK.y - 20} r={70} kind="red" o={0.7} />
        <AlarmClock x={CLOCK.x} y={CLOCK.y} s={0.3} text={read} />
      </g>
      {/* Pip's hooded head and shoulder, close and dark, filling the right third of the frame */}
      <Foreground blur={16}>
        <g transform="translate(150 0)">
        <path d="M 1180 1100 Q 1200 760 1420 700 Q 1660 650 1760 800 Q 1900 860 1980 1100 Z" fill="#100E18" />
        <circle cx={1500} cy={560} r={250} fill="#15121E" />
        <path d="M 1290 470 Q 1330 300 1500 300" stroke="#9FD8FF" strokeWidth={8} fill="none" opacity={0.35} />
        </g>
      </Foreground>
    </g>
  );
};

// ---------- S13: the title, wide on the roof at sunrise: he never went to bed ----------
const ROOF_FEET = 840;
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: ROOF_FEET - LEG_LEN * 0.62, scale: 0.62, yaw: 0, armL: { a: 20, b: 6 }, armR: { a: 20, b: 6 } } },
    { f: 16, p: {} },
    { f: 24, p: { armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Rooftop t={t} sunX={960} sunY={760 - 90 * easeOut(clamp(t / 60))} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]), glint: 0.5 }} rimId="rimR" shadow={0.6} />
      <TitleCard t={t} lines={['WHAT IF YOU COULD', 'SKIP SLEEP FOREVER?']} accent="FOREVER" accentT={34} size={100} y={170} />
    </g>
  );
};

// ---------- S14: medium, low angle: a long stretch in the sunrise; eight hours, free ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 790, scale: 1.8, yaw: 0.2, look: 0.3, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 } } },
    { f: 4, p: { squash: 0.04 } },
    { f: 12, p: { armL: { a: 132, b: 4 }, armR: { a: 132, b: 4 }, squash: -0.04, headTilt: -8, tilt: -4 }, ease: easeOut },
    { f: 40, p: { armL: { a: 126, b: 8 }, armR: { a: 126, b: 8 }, squash: 0, headTilt: -4, tilt: -2 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 66} sunX={1300} sunY={600} low={260} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <FloatLabel x={1360} y={420} t={t - 8} text="+8 HOURS" size={86} />
    </g>
  );
};

// ---------- S15: medium close-up on the roof: he tries to shut his eyes, and they won't stay shut ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6;
  const tries = [[4, 20], [30, 46]];
  let blink = 0;
  for (const [a, b] of tries) {
    if (t >= a && t < b) blink = 0.9 * easeIn(clamp((t - a) / (b - a - 2)));
  }
  const snapped = (t >= 20 && t < 25) || t >= 46;
  const pose = closeUp(980, 520, sc, { yaw: 0.2, look: 0.1, headTilt: blink * 6, ...faceAt(t, [[0, 'neutral'], [21, 'worried']]), blink });
  return (
    <g transform={snapped ? `translate(${Math.sin(t * 3.1) * 3} 0)` : undefined}>
      <g filter="url(#blur16)">
        <g transform="translate(-700 -560) scale(2)">
          <Rooftop t={t + 120} sunX={1100} sunY={560} low={180} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.15} />
      <Hero look={PIP} pose={{ ...pose, glint: snapped ? 1 : 0 }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S16: schematic: between brain cells, the gap opens up while you sleep: +60% ----------
const Cell: React.FC<{ x: number; y: number; r: number; side: 1 | -1; t: number }> = ({ x, y, r, side, t }) => {
  const d = Array.from({ length: 18 }).map((_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const rr = r * (1 + 0.05 * Math.sin(a * 3 + side) + 0.015 * Math.sin(t / 6 + i));
    return `${i ? 'L' : 'M'} ${x + Math.cos(a) * rr} ${y + Math.sin(a) * rr * 1.1}`;
  }).join(' ') + ' Z';
  return (
    <g>
      <path d={d} fill="#1C2C44" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={x - side * r * 0.2} cy={y - r * 0.1} r={r * 0.28} fill="none" stroke={SCH.dim} strokeWidth={5} />
      {[-1, 1].map((k) => (
        <path key={k} d={`M ${x - side * r * 0.9} ${y + k * r * 0.5} q ${-side * r * 0.5} ${k * r * 0.2} ${-side * r * 0.7} ${k * r * 0.6}`} stroke={SCH.line} strokeWidth={5} fill="none" strokeLinecap="round" />
      ))}
    </g>
  );
};
const gapAt = (open: number) => 70 + 110 * open;
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp((t - 30) / 30));
  const gap = gapAt(open);
  const r = 230;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sch16" />
      <SchLabel x={960} y={150} t={t - 2} text="THE SPACE BETWEEN BRAIN CELLS" size={50} />
      <Cell x={960 - gap / 2 - r} y={520} r={r} side={1} t={t} />
      <Cell x={960 + gap / 2 + r} y={520} r={r} side={-1} t={t} />
      {/* the gap itself, glowing as it opens */}
      <rect x={960 - gap / 2} y={300} width={gap} height={440} fill={SCH.live} opacity={0.12 + 0.2 * open} />
      <path d={`M ${960 - gap / 2 + 10} 780 L ${960 + gap / 2 - 10} 780`} stroke={SCH.live} strokeWidth={6} />
      <path d={`M ${960 - gap / 2 + 10} 765 L ${960 - gap / 2 + 10} 795 M ${960 + gap / 2 - 10} 765 L ${960 + gap / 2 - 10} 795`} stroke={SCH.live} strokeWidth={6} />
      <SchLabel x={960} y={860} t={t - 8} text={open < 0.5 ? 'AWAKE: 14%' : 'ASLEEP: 23%'} size={56} color={open < 0.5 ? SCH.line : SCH.live} />
      {t > 52 ? <CountUp x={1600} y={300} t={t - 52} to={60} dur={20} size={120} suffix="%" format={(v) => `+${Math.round(v)}%`} /> : null}
      <SchLabel x={960} y={1000} t={t - 20} text="SLEEP STUDY · XIE ET AL., SCIENCE, 2013" size={26} color={SCH.dim} />
    </g>
  );
};

// ---------- S17: schematic: waste washes out through the open gap ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const gap = gapAt(1);
  const r = 230;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.05], [len, 1.12]])}) translate(-960 -540)`}>
      <Schematic t={t + 94} id="sch17" />
      <Cell x={960 - gap / 2 - r} y={520} r={r} side={1} t={t + 94} />
      <Cell x={960 + gap / 2 + r} y={520} r={r} side={-1} t={t + 94} />
      <rect x={960 - gap / 2} y={300} width={gap} height={440} fill={SCH.live} opacity={0.3} />
      {Array.from({ length: 26 }).map((_, i) => {
        const start = rnd(i, 1) * 14;
        const p = clamp((t - start) / 22);
        const x = 960 + (rnd(i, 2) - 0.5) * gap * 0.7;
        const y = 280 + p * 640 + rnd(i, 3) * 40;
        return p > 0 && p < 1 ? <circle key={i} cx={x} cy={y} r={8 + rnd(i, 4) * 8} fill={SCH.live} opacity={1 - p * 0.6} style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }} /> : null;
      })}
      <Arrow x0={960} y0={760} x1={960} y1={940} t={t - 4} color={SCH.live} bend={0} />
      <SchLabel x={1240} y={900} t={t - 6} text="WASTE, WASHED OUT" size={50} color={SCH.live} />
    </g>
  );
};

// ---------- S18: extreme close-up: "That's real." Pip, worried, the light turning red ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.6 * (1 + 0.04 * clamp(t / len));
  const red = 0.4 * clamp(t / len);
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-600 -560) scale(2)">
          <Rooftop t={t + 200} sunX={980} sunY={600} red={red} low={180} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Hero look={PIP} pose={closeUp(960, 600, sc, { yaw: 0.12, look: 0.1, ...faceAt(t, [[0, 'worried']]) })} rimId={t > len * 0.5 ? 'rimRed' : 'rimR'} shadow={0} />
    </g>
  );
};

// ---------- S19: wide, night again, pushing in: the lamp flickers and dies; only his eyes are left ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const flick = t < 38 ? 1 : t < 72 ? (rnd(Math.floor(t / 2), 9) > 0.45 ? 1 : 0.15) : 0;
  const dark = t < 72 ? 0 : easeOut(clamp((t - 72) / 6)) * 0.78;
  const pose = pipInBed({ yaw: 0.05, look: 0, headTilt: 0, armL: { a: 20, b: 30 }, armR: { a: 20, b: 30 }, ...faceAt(t, [[0, 'worried']]) });
  const head = toWorld(pose, { x: HEAD.x, y: HEAD.y });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, PIP_BED.x + 20]]), kf(t, [[0, 540], [len, PIP_BED.y - 120]]), kf(t, [[0, 1.0], [len, 2.1]], easeIn))}>
      <Bedroom t={t + 330} id="b19" duvet={false} clock="04:12" crossed={0} lamp={flick} veil={0.38} />
      <Hero look={PIP} pose={{ ...pose, glint: 1 }} rimId={dark > 0 ? 'rimRed' : 'rimR'} shadow={0} />
      <BedDuvet knees={1} />
      <rect x={-400} y={-400} width={2720} height={1880} fill="#05030A" opacity={dark} />
      <AlarmClock x={CLOCK.x} y={CLOCK.y} s={0.3} text="04:12" on={dark > 0 ? 1 : 0} />
      <EyeGlint x={head.x + 6 * pose.scale} y={head.y + 4 * pose.scale} s={pose.scale} o={dark / 0.78} />
    </g>
  );
};

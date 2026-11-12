import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, rnd, settle, camT, LOOKS, LEG_LEN, HEAD, walkPose, hipGround,
  Kitchen, KitchenIsland, stand, KITCHEN, Tabletop, Study, Desk, Classroom, SchoolDesk, Stairwell, Banister, Rooftop, Schematic, SCH, SchLabel, CountUp, Arrow, DrawOn,
  AlarmClock, Plate, Cat, Foreground, Glow, Dust, Haze, Sun, DuskSky, Sparkle, FocusRings, PasteIn, TitleCard, ShotProps,
} from '../../engine';

// "What if you could teleport by blinking?" Eighteen shots on five sets (study, kitchen, classroom, stairwell,
// rooftop), the schematic, and a polar ice field drawn here. The power: he shuts his eyes and folds into a cyan ring
// (BLINK), then pops in somewhere else with a ring. Each shot is a pure function of its own clock t.

/** Every word drawn on screen, so a translated cut (blink-ml) can reuse the same shots with its own text. */
export const BLINK_TEXT = {
  title: ['WHAT IF YOU COULD', 'TELEPORT BY BLINKING?'] as [string, string],
  accent: 'BLINKING',
  titleSize: 92,
  titleGap: 89,
  titleY: 170,
  flingAt: 26, // S18's frame where he's flung: just after the last word
  anywhere: 'ANYWHERE ON EARTH',
  spins: 'EARTH SPINS',
  equator: 'EQUATOR',
  speedOf: "THE EQUATOR'S SPEED",
  over: 'OVER 1,600',
  pole: 'POLE: 0 KM/H',
  you: 'YOU: 1,674 KM/H',
};
export type BlinkText = typeof BLINK_TEXT;
export const BlinkTextCtx = React.createContext<BlinkText>(BLINK_TEXT);
const useText = () => React.useContext(BlinkTextCtx);

const PIP = LOOKS.ramu;
const MO = LOOKS.appu;
const CYAN = '#8FF0FF';

/** A head-and-shoulders close-up: head centre at (hx, hy), scale sc. */
const closeUp = (hx: number, hy: number, sc: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: hx, y: hy - HEAD.y * sc, scale: sc, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, ...extra,
});

/** The blink out: before t = 0 the thing as it is; then it squeezes thin and folds into (x, y) in 5 frames, a ring
 * snaps shut on the spot and a pinch of sparks flies out. */
const BlinkOut: React.FC<{ x: number; y: number; t: number; r?: number; children: React.ReactNode }> = ({ x, y, t, r = 120, children }) => {
  if (t < 0) return <g>{children}</g>;
  const p = easeIn(clamp(t / 5));
  const sx = 1 - p;
  const sy = 1 - 0.6 * p + 0.25 * Math.sin(p * Math.PI);
  return (
    <g>
      {p < 1 ? (
        <g transform={`translate(${x} ${y}) scale(${sx} ${sy}) translate(${-x} ${-y})`} style={{ filter: `drop-shadow(0 0 ${8 + 20 * p}px ${CYAN}) brightness(${1 + 1.2 * p})` }}>
          {children}
        </g>
      ) : null}
      {t < 12 ? <circle cx={x} cy={y} r={r * (1.4 - easeOut(clamp(t / 8)) * 1.3)} fill="none" stroke={CYAN} strokeWidth={8} opacity={1 - clamp((t - 6) / 6)} /> : null}
      {t >= 4 && t < 16
        ? Array.from({ length: 10 }).map((_, i) => {
            const a = rnd(7, i) * Math.PI * 2;
            const d = r * (0.2 + 1.1 * easeOut(clamp((t - 4) / 12))) * (0.6 + rnd(9, i) * 0.6);
            return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={r * 0.04 * (1 - (t - 4) / 12)} fill={CYAN} style={{ filter: `drop-shadow(0 0 6px ${CYAN})` }} />;
          })
        : null}
      {t >= 3 && t < 9 ? <Glow x={x} y={y} r={r * 1.6} kind="cool" o={0.8 * (1 - (t - 3) / 6)} /> : null}
    </g>
  );
};

/** A set, blurred and scaled up behind a close-up. */
const Soft: React.FC<{ tx: number; ty: number; s: number; dark?: number; children: React.ReactNode }> = ({ tx, ty, s, dark = 0.25, children }) => (
  <g>
    <g filter="url(#blur16)">
      <g transform={`translate(${tx} ${ty}) scale(${s})`}>{children}</g>
    </g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#07040C" opacity={dark} />
  </g>
);

// ---------- S1: medium, the study at dusk: an empty plate, Pip looks off toward the kitchen ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 712, yaw: 0.35, look: 0.5, armL: { a: 14, b: -6 }, armR: { a: 40, b: 60 }, headTilt: 6 } },
    { f: 8, p: {} },
    { f: 13, p: { yaw: -0.3, look: -0.9, headTilt: -4 }, ease: easeOut },
    { f: 16, p: { yaw: -0.25, look: -1 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), 590, kf(t, [[0, 1.8], [len, 1.9]]))}>
      <Study t={t + 20} id="st1" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [12, 'oops']]) }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} />
      <Plate x={1110} y={690} s={0.8} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={1085 + i * 17} cy={684 + (i % 2) * 4} r={3} fill="#9A6234" />
      ))}
      <Foreground blur={10}>
        <path d="M 1500 1000 Q 1380 800 1430 600 Q 1470 800 1580 980 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// ---------- S2: extreme close-up: BLINK, eyes squeeze shut, he folds into a ring ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.4 * (1 + 0.03 * clamp(t / len));
  const pose = closeUp(960, 560, sc, { yaw: -0.2, look: -0.3, headTilt: kf(t, [[0, 0], [4, 5]]), ...faceAt(t, [[0, 'oops'], [3, 'smug']]), blink: t >= 3 ? 1 : 0 });
  return (
    <g>
      <Soft tx={-900} ty={-760} s={2.4}>
        <Study t={t + 50} id="st2" />
      </Soft>
      <Glow x={1300} y={300} r={700} o={0.35} />
      <BlinkOut x={960} y={560} t={t - 7} r={260}>
        <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      </BlinkOut>
    </g>
  );
};

// ---------- S3: wide, the kitchen: he pops in by the fridge, grinning; the cat jolts awake ----------
const S3_STAND = stand(KITCHEN, 0.84, 0.36);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S3_STAND.x, y: S3_STAND.y, scale: S3_STAND.scale, yaw: 0.2, look: 0.2, armL: { a: 30, b: 20 }, armR: { a: 30, b: 20 }, squash: 0.08 } },
    { f: 6, p: { squash: 0, armR: { a: 130, b: 20 } }, ease: easeOut },
    { f: 10, p: { armR: { a: 122, b: 26 } } },
  ]);
  const cat = KITCHEN.P(0.12, 0.72, 0.075);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Kitchen t={t + 70} id="k3" veil={0.34} />
      <Cat x={cat.x} y={cat.y} mood={t > 6 ? 'alert' : 'sleep'} f={t} />
      <PasteIn x={S3_STAND.x} y={S3_STAND.y - 40} t={t - 2} color={CYAN} ring={130}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
      </PasteIn>
      <KitchenIsland />
      <Sparkle x={S3_STAND.x + 80} y={S3_STAND.y - 190 * S3_STAND.scale} t={t - 9} s={0.6} />
    </g>
  );
};

// ---------- S4: macro insert, high angle: the alarm clock flips to 09:00 ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const late = t >= 14;
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Tabletop edge={900} />
      <Glow x={1250} y={300} r={760} o={0.32} />
      <rect x={1340} y={720} width={420} height={60} rx={8} fill="#5A3A4A" transform="rotate(-8 1550 750)" />
      <rect x={1330} y={660} width={430} height={60} rx={8} fill="#3E5A6A" transform="rotate(-5 1550 690)" />
      <g transform="rotate(-14 260 300)">
        <rect x={60} y={200} width={360} height={240} rx={14} fill="#E9DFC8" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={90} y={236 + i * 36} width={260 - (i % 2) * 70} height={10} rx={5} fill="#9A8E78" />
        ))}
      </g>
      <g transform={late ? `translate(${Math.sin(t * 2.6) * 6 * clamp(1 - (t - 14) / 10)} 0)` : undefined}>
        <AlarmClock x={960} y={600} s={2.5} text={late ? '09:00' : '08:59'} />
      </g>
      {late ? <Glow x={960} y={520} r={420} kind="red" o={0.35 * (1 - clamp((t - 14) / 16))} /> : null}
    </g>
  );
};

// ---------- S5: medium, the study: bag on, shock, then BLINK: gone in a ring ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.1, look: 0, armL: { a: 30, b: 50 }, armR: { a: 30, b: 50 }, squash: 0.04 } },
    { f: 3, p: { armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 }, squash: 0 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Study t={t + 160} id="st5" />
      <BlinkOut x={960} y={580} t={t - 8} r={180}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [4, 'cool']]), blink: t >= 5 ? 1 : 0 }} rimId="rimR" shadow={0} />
        {/* the bag strap across his chest */}
        <path d="M 936 606 L 990 708" stroke="#6A4A2A" strokeWidth={12} strokeLinecap="round" />
      </BlinkOut>
      <Foreground blur={10}>
        <path d="M 300 1000 Q 420 760 380 600 Q 330 760 220 980 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// ---------- S6: wide, the empty classroom: he pops in at his desk, first one there ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1260, y: 760 - LEG_LEN * 1.0 + 2, scale: 1.0, yaw: -0.35, look: -0.4, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 }, squash: 0.08 } },
    { f: 6, p: { squash: 0 }, ease: easeOut },
    { f: 12, p: { armL: { a: 160, b: 120 }, armR: { a: 160, b: 120 }, tilt: -6, look: -0.8 }, ease: easeOut },
    { f: 16, p: { tilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), 520, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Classroom t={t + 240} id="cls6" empty />
      <PasteIn x={1260} y={560} t={t - 2} color={CYAN} ring={150}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [11, 'smug']]) }} rimId="rimL" shadow={0} />
      </PasteIn>
      <SchoolDesk x={1260} />
      <Sparkle x={1360} y={420} t={t - 12} s={0.7} />
    </g>
  );
};

// ---------- S7: wide, side-on: Mo walks down the stairs and looks back up: nobody ----------
const SC = 0.9;
export const S7: React.FC<ShotProps> = ({ t }) => {
  const x = lerp(700, 860, clamp(t / 20));
  const stop = t >= 14;
  const turn = easeOut(clamp((t - 12) / 6));
  const base = walkPose(x, (stop ? 14 : t) * 0.6, hipGround, SC);
  const mo: Pose = { ...base, yaw: lerp(1, 0.2, turn), look: lerp(0.6, -1, turn), headTilt: -6 * turn };
  return (
    <g transform={camT(kf(t, [[0, 700], [33, 680]]), 420, 1.15)}>
      <Stairwell t={t + 200} id="sw7" />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'neutral'], [16, 'worried']]) }} rimId="rimL" shadow={0.5} />
      <Banister />
    </g>
  );
};

// ---------- S8: extreme close-up, profile: BLINK at the top of the stairs ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6 * (1 + 0.03 * clamp(t / len));
  const pose = closeUp(900, 560, sc, { yaw: 0.75, look: 0.8, ...faceAt(t, [[0, 'smug']]), blink: t >= 3 ? 1 : 0 });
  return (
    <g>
      <Soft tx={-300} ty={-500} s={2.2}>
        <Stairwell t={t + 240} id="sw8" />
      </Soft>
      <Glow x={300} y={200} r={700} o={0.35} />
      <BlinkOut x={900} y={560} t={t - 7} r={240}>
        <Hero look={PIP} pose={pose} rimId="rimL" shadow={0} />
      </BlinkOut>
    </g>
  );
};

// ---------- S9: medium two-shot: Mo turns back round and Pip is right behind him ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const moX = 860;
  const jolt = t >= 12 ? settle(t - 12, 10, 1.8, 5) : 0;
  const mo: Pose = {
    ...walkPose(moX, 14 * 0.6, hipGround, SC),
    yaw: t < 10 ? 0.2 : -0.55, look: t < 10 ? -1 : -1, armL: { a: t >= 12 ? 50 : 10, b: t >= 12 ? 60 : -6 }, armR: { a: t >= 12 ? 50 : 10, b: t >= 12 ? 60 : -6 },
    tilt: t >= 12 ? 8 + jolt : 0,
  };
  const pipX = 735;
  const pip = poseAt(t, [
    { f: 0, p: { ...walkPose(pipX, 0, hipGround, SC), yaw: 0.8, look: 0.9, tilt: 10, armL: { a: 14, b: -6 }, armR: { a: 20, b: 10 } } },
    { f: 16, p: { tilt: 14, headTilt: 6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 795]]), 470, kf(t, [[0, 1.85], [len, 1.95]]))}>
      <Stairwell t={t + 260} id="sw9" />
      <PasteIn x={pipX} y={hipGround(pipX) - 170} t={t - 2} color={CYAN} ring={110}>
        <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.5} />
      </PasteIn>
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'neutral'], [11, 'shock']]) }} rimId="rimL" shadow={0.5} />
      {t >= 12 ? <g transform={`translate(${moX - 10} ${hipGround(moX) - 300}) scale(0.4) translate(${-(moX - 10)} ${-(hipGround(moX) - 300)})`}><FocusRings x={moX - 10} y={hipGround(moX) - 300} t={t - 12} r0={30} color="#FFE7B3" /></g> : null}
      <Banister />
    </g>
  );
};

// ---------- S10: the title, wide on the roof at dusk; he pops onto the roof ----------
const ROOF_FEET = 840;
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const T = useText();
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: ROOF_FEET - LEG_LEN * 0.62, scale: 0.62, yaw: 0, armL: { a: 20, b: 6 }, armR: { a: 20, b: 6 }, squash: 0.08 } },
    { f: 8, p: { squash: 0 }, ease: easeOut },
    { f: 22, p: {} },
    { f: 28, p: { armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Rooftop t={t} sunX={960} sunY={690 - 40 * easeOut(clamp(t / 40))} />
      <PasteIn x={960} y={ROOF_FEET - 70} t={t - 4} color={CYAN} ring={90}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
      </PasteIn>
      <TitleCard t={t} lines={T.title} accent={T.accent} accentT={36} size={T.titleSize} gap={T.titleGap} y={T.titleY} />
    </g>
  );
};

// ---------- the globe for the schematic shots ----------
/** A line globe at (cx, cy), radius r, turned by `rot` degrees about its axis; `eq` lights the equator (0..1). */
const Globe: React.FC<{ cx: number; cy: number; r: number; rot: number; t: number; eq?: number; draw?: number }> = ({ cx, cy, r, rot, t, eq = 0, draw = 1 }) => {
  const meridians = Array.from({ length: 12 }).map((_, i) => {
    const a = (((i * 30 + rot) % 180) + 180) % 180; // 0..180: the meridian's angle round the axis
    const rx = Math.abs(Math.cos((a * Math.PI) / 180)) * r;
    const front = a > 90 ? 1 : 0;
    return { rx, side: Math.cos((a * Math.PI) / 180) > 0 ? 1 : 0, front, key: i };
  });
  return (
    <g opacity={draw}>
      <circle cx={cx} cy={cy} r={r} fill="#0E1A30" stroke={SCH.line} strokeWidth={5} />
      {meridians.map((m) => (
        <path key={m.key} d={`M ${cx} ${cy - r} A ${m.rx} ${r} 0 0 ${m.side} ${cx} ${cy + r}`} stroke={SCH.dim} strokeWidth={2.5} fill="none" opacity={0.7} />
      ))}
      {[-60, -30, 30, 60].map((lat) => {
        const y = cy - Math.sin((lat * Math.PI) / 180) * r;
        const w = Math.cos((lat * Math.PI) / 180) * r;
        return <ellipse key={lat} cx={cx} cy={y} rx={w} ry={w * 0.12} stroke={SCH.dim} strokeWidth={2.5} fill="none" opacity={0.7} />;
      })}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.12} stroke={eq > 0 ? SCH.live : SCH.dim} strokeWidth={2.5 + 6 * eq} fill="none" style={eq > 0 ? { filter: `drop-shadow(0 0 ${14 * eq}px ${SCH.glow})` } : undefined} />
      {/* the axis and the North Pole */}
      <path d={`M ${cx} ${cy - r - 60} L ${cx} ${cy - r}`} stroke={SCH.line} strokeWidth={4} strokeDasharray="10 8" />
      <circle cx={cx} cy={cy - r} r={9} fill={SCH.line} />
      <circle cx={cx + Math.sin(t / 5) * 0} cy={cy} r={0} />
    </g>
  );
};
const G = { x: 960, y: 560, r: 330 };
/** A pin on the globe's face at (u, v): u -1..1 across, v -1..1 down. */
const pinAt = (u: number, v: number) => ({ x: G.x + u * G.r, y: G.y + v * G.r });

// ---------- S11: schematic: cyan pins pop in all over the globe: anywhere ----------
const PINS = [[-0.5, -0.45], [0.3, -0.55], [0.62, -0.1], [-0.2, 0.05], [0.15, 0.4], [-0.62, 0.3], [0.45, 0.5], [-0.05, -0.75], [0.75, 0.2], [-0.4, 0.65]];
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const T = useText();
  return (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
    <Schematic t={t} id="sch11" />
    <Globe cx={G.x} cy={G.y} r={G.r} rot={t * 0.6} t={t} />
    {PINS.map(([u, v], i) => {
      const p = pinAt(u, v);
      return (
        <PasteIn key={i} x={p.x} y={p.y} t={t - 2 - i * 2.5} color={CYAN} ring={34}>
          <path d={`M ${p.x} ${p.y} Q ${p.x - 22} ${p.y - 30} ${p.x} ${p.y - 52} Q ${p.x + 22} ${p.y - 30} ${p.x} ${p.y} Z`} fill={CYAN} style={{ filter: `drop-shadow(0 0 8px ${CYAN})` }} />
          <circle cx={p.x} cy={p.y - 34} r={8} fill={SCH.ground} />
        </PasteIn>
      );
    })}
    <SchLabel x={960} y={160} t={t - 4} text={T.anywhere} size={56} />
  </g>
  );
};

// ---------- S12: medium, low angle on the roof: the grin fades ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 790, scale: 1.8, yaw: 0.3, look: 0.4, armL: { a: 16, b: 6 }, armR: { a: 16, b: 6 }, headTilt: -4 } },
    { f: 10, p: {} },
    { f: 16, p: { look: 0.8, headTilt: 8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 66} sunX={1250} sunY={560} low={260} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [12, 'neutral']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S13: schematic: the globe turns, a curved arrow round it: EARTH SPINS ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const T = useText();
  return (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1.04], [len, 1]])}) translate(-960 -540)`}>
    <Schematic t={t + 40} id="sch13" />
    <Globe cx={G.x} cy={G.y} r={G.r} rot={20 + t * 3} t={t} />
    <DrawOn d={`M ${G.x - G.r - 60} ${G.y + 60} Q ${G.x} ${G.y + 200} ${G.x + G.r + 60} ${G.y + 60}`} t={t - 2} dur={10} color={SCH.live} width={8} />
    {t > 12 ? <path d={`M ${G.x + G.r + 30} ${G.y + 40} L ${G.x + G.r + 70} ${G.y + 60} L ${G.x + G.r + 36} ${G.y + 92}`} stroke={SCH.live} strokeWidth={8} fill="none" strokeLinejoin="round" /> : null}
    <SchLabel x={960} y={160} t={t - 4} text={T.spins} size={64} />
  </g>
  );
};

// ---------- S14: schematic: the equator lights up, a dot rides it with speed streaks ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const T = useText();
  const eq = easeOut(clamp(t / 10));
  const ph = -1.1 + t * 0.055;
  const dx = G.x + Math.sin(ph) * G.r;
  const dy = G.y + Math.cos(ph) * G.r * 0.12;
  const front = Math.cos(ph) > 0;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -${kf(t, [[0, 540], [len, 580]])})`}>
      <Schematic t={t + 70} id="sch14" />
      <Globe cx={G.x} cy={G.y} r={G.r} rot={50 + t * 3} t={t} eq={eq} />
      {front ? (
        <g>
          {[1, 2, 3, 4].map((k) => (
            <circle key={k} cx={G.x + Math.sin(ph - k * 0.07) * G.r} cy={G.y + Math.cos(ph - k * 0.07) * G.r * 0.12} r={14 - k * 2.5} fill={SCH.glow} opacity={0.5 - k * 0.1} />
          ))}
          <circle cx={dx} cy={dy} r={16} fill={CYAN} style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }} />
        </g>
      ) : null}
      <SchLabel x={G.x + G.r + 40} y={G.y + 12} t={t - 6} text={T.equator} size={40} color={SCH.live} anchor="start" />
    </g>
  );
};

// ---------- S15: schematic: 1,674 km/h counts up ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const T = useText();
  return (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
    <Schematic t={t + 110} id="sch15" />
    <g opacity={0.35}>
      <Globe cx={G.x} cy={G.y + 40} r={G.r} rot={100 + t * 3} t={t} eq={1} />
    </g>
    <CountUp x={960} y={590} t={t - 2} to={1674} dur={34} size={200} suffix=" KM/H" />
    <SchLabel x={960} y={700} t={t - 8} text={T.speedOf} size={44} color={SCH.dim} />
    <SchLabel x={960} y={250} t={t - 34} text={T.over} size={64} color={SCH.live} />
  </g>
  );
};

// ---------- S16: extreme close-up: "That's real." Pip, worried, the light turning red ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.6 * (1 + 0.04 * clamp(t / len));
  const red = 0.4 * clamp(t / len);
  const pose = closeUp(960, 720, sc, { yaw: 0.12, look: 0.1, ...faceAt(t, [[0, 'worried']]) });
  return (
    <g>
      <Soft tx={-600} ty={-560} s={2} dark={0.22}>
        <Rooftop t={t + 200} sunX={980} sunY={600} red={red} low={180} />
      </Soft>
      <Hero look={PIP} pose={pose} rimId={t > len * 0.5 ? 'rimRed' : 'rimR'} shadow={0} />
    </g>
  );
};

// ---------- S17: schematic: his dot hops from the equator to the North Pole and keeps going ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const T = useText();
  const start = { x: G.x - 40, y: G.y + G.r * 0.12 };
  const pole = { x: G.x, y: G.y - G.r };
  const hop = easeOut(clamp((t - 8) / 8));
  const atPole = t >= 16;
  const fly = atPole ? easeIn(clamp((t - 18) / 18)) : 0;
  const dot = atPole ? { x: pole.x + fly * 700, y: pole.y } : { x: lerp(start.x, pole.x, hop), y: lerp(start.y, pole.y, hop) - Math.sin(hop * Math.PI) * 200 };
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t + 180} id="sch17" />
      <Globe cx={G.x} cy={G.y} r={G.r} rot={150 + t * 3} t={t} eq={0.6} />
      <DrawOn d={`M ${start.x} ${start.y} Q ${start.x - 60} ${pole.y - 140} ${pole.x} ${pole.y}`} t={t - 6} dur={10} color={CYAN} width={4} />
      {atPole
        ? [1, 2, 3, 4, 5].map((k) => <path key={k} d={`M ${dot.x - 30 - k * 40} ${dot.y - 20 + k * 8} L ${dot.x - 30} ${dot.y - 20 + k * 8}`} stroke={CYAN} strokeWidth={5} opacity={0.6 * fly} />)
        : null}
      {t >= 2 ? <circle cx={dot.x} cy={dot.y} r={18} fill={CYAN} style={{ filter: `drop-shadow(0 0 12px ${CYAN})` }} /> : null}
      <SchLabel x={pole.x - 30} y={pole.y - 80} t={t - 16} text={T.pole} size={40} color={SCH.dim} anchor="end" />
      <SchLabel x={pole.x + 60} y={pole.y + 70} t={t - 20} text={T.you} size={50} color={SCH.live} anchor="start" />
    </g>
  );
};

// ---------- S18: wide, polar ice at dusk: he pops onto the ice and is flung sideways out of frame ----------
const ICE_Y = 640;
const IceField: React.FC<{ t: number; id: string; red: number }> = ({ t, id, red }) => (
  <g>
    <DuskSky id={`${id}sky`} horizonY={ICE_Y} red={red} />
    <Sun x={1500} y={ICE_Y - 20} r={110} t={t} red={red > 0.5 ? 1 : 0} />
    {/* far pressure ridges */}
    <path d={`M -400 ${ICE_Y} L 120 ${ICE_Y - 40} L 300 ${ICE_Y - 12} L 620 ${ICE_Y - 55} L 900 ${ICE_Y - 8} L 1260 ${ICE_Y - 36} L 1700 ${ICE_Y - 6} L 2320 ${ICE_Y - 30} L 2320 ${ICE_Y + 20} L -400 ${ICE_Y + 20} Z`} fill="#7E86A8" />
    <defs>
      <linearGradient id={`${id}ice`} x1="0" y1={ICE_Y} x2="0" y2="1300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C9C3D8" />
        <stop offset="35%" stopColor="#9C9AB8" />
        <stop offset="100%" stopColor="#3A3854" />
      </linearGradient>
    </defs>
    <rect x={-400} y={ICE_Y + 10} width={2720} height={900} fill={`url(#${id}ice)`} />
    {/* the sun's long path on the ice, and blue drifts */}
    <path d={`M 1420 ${ICE_Y + 12} L 1580 ${ICE_Y + 12} L 1900 1300 L 1000 1300 Z`} fill="#FFC88A" opacity={0.22} />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = rnd(3, i) * 2200 - 140;
      const y = ICE_Y + 40 + rnd(4, i) * 420;
      const w = 120 + rnd(5, i) * 260;
      return <ellipse key={i} cx={x} cy={y} rx={w} ry={w * 0.08} fill="#5E5C80" opacity={0.45} />;
    })}
    {[[260, 700, 1], [1700, 760, 1.4], [520, 900, 1.8]].map(([x, y, s], i) => (
      <path key={i} d={`M ${x - 60 * s} ${y} L ${x - 20 * s} ${y - 40 * s} L ${x + 10 * s} ${y - 18 * s} L ${x + 50 * s} ${y - 52 * s} L ${x + 80 * s} ${y} Z`} fill="#B8B6D2" stroke="#6E6C90" strokeWidth={3} />
    ))}
    <Haze y={ICE_Y - 60} h={200} o={0.3} />
    <Glow x={1500} y={ICE_Y - 20} r={700} o={0.4} />
    <Dust t={t * 3} seed={11} x0={-200} y0={300} w={2300} h={700} n={70} o={0.7} />
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const T = useText();
  const feet = 870;
  const F = T.flingAt;
  const fling = easeIn(clamp((t - F) / 10));
  const x = 760 + fling * 1500;
  const pose: Pose = {
    ...basePose, x, y: feet - LEG_LEN * 1.0 - fling * 80, scale: 1.0, yaw: -0.2, look: t < 8 ? -0.5 : 0.2, headTilt: t >= 8 && t < F ? 10 : 0,
    tilt: t < F ? 0 : -30 * clamp((t - F) / 3), spin: t < F + 2 ? 0 : (t - F - 2) * 22,
    armL: t < F - 1 ? { a: 30, b: 30 } : { a: 160, b: 20 }, armR: t < F - 1 ? { a: 30, b: 30 } : { a: 150, b: 10 },
    squash: t < 6 ? 0.06 * (1 - t / 6) : 0,
    ...faceAt(t, [[0, 'neutral'], [8, 'worried'], [F - 2, 'shock']]),
  };
  const red = 0.7 * clamp((t - F) / 24);
  return (
    <g transform={camT(kf(t, [[0, 900], [F, 840], [F + 14, 1180], [len, 1260]]), kf(t, [[0, 640], [len, 700]]), kf(t, [[0, 1.25], [F, 1.4], [F + 14, 1.1], [len, 1.35]]))}>
      <IceField t={t} id="ice18" red={red} />
      {/* the gouge he leaves in the snow, and the spray */}
      {t >= F ? <path d={`M 760 ${feet} L ${Math.min(x, 2300)} ${feet + 4}`} stroke="#5E5C80" strokeWidth={10} strokeLinecap="round" opacity={0.7} /> : null}
      {t >= F && t < F + 30
        ? Array.from({ length: 16 }).map((_, i) => {
            const k = (t - F - i * 0.6) / 14;
            if (k < 0 || k > 1) return null;
            const sx = 760 + rnd(21, i) * (Math.min(x, 2300) - 760);
            return <circle key={i} cx={sx - k * 60} cy={feet - 20 - k * (80 + rnd(22, i) * 120) + k * k * 120} r={8 + rnd(23, i) * 10} fill="#E6E2F2" opacity={0.85 * (1 - k)} />;
          })
        : null}
      {t >= F && x < 2400
        ? [0, 1, 2, 3, 4].map((k) => <path key={k} d={`M ${x - 140 - k * 70} ${feet - 260 + k * 50} L ${x - 60} ${feet - 260 + k * 50}`} stroke="#F6EFE3" strokeWidth={6} opacity={0.6} strokeLinecap="round" />)
        : null}
      <PasteIn x={760} y={feet - 140} t={t - 2} color={CYAN} ring={110}>
        <Hero look={PIP} pose={pose} rimId={red > 0.2 ? 'rimRed' : 'rimR'} shadow={t < F ? 0.6 : 0} />
      </PasteIn>
      <Foreground blur={10}>
        <path d="M -100 1100 L -100 960 Q 200 900 420 980 L 520 1100 Z" fill="#1E1C30" />
      </Foreground>
    </g>
  );
};

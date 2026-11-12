import React from 'react';
import {
  LightVeil, DrawOn,
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, camT, LOOKS,
  Study, Desk, Rooftop, Schematic, SCH, Arrow, SchLabel, CountUp,
  Mug, Paper, PaperStack, Foreground, TitleCard, ShotProps, Tag, UI, Glow,
} from '../../engine';

const PIP = LOOKS.ramu;
const AMBER = '#FFB15A';
const CYAN = '#7FD4FF';

// ---------- S1: wide, morning study: Pip at desk with hot tea ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.35, look: 0.5, armL: { a: 16, b: -12 }, armR: { a: 22, b: -18 } } },
    { f: 12, p: { armR: { a: 45, b: -6 } } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [14, 'neutral']]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), 640, kf(t, [[0, 1.35], [len, 1.4]]))}>
      <Study t={t + 20} id="gml_s1" />
      <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0.7} />
      <Desk x0={520} x1={1400} y={700} />
      <g transform="translate(780 670) scale(0.9)">
        <Mug x={0} y={0} rot={0} f={t} />
      </g>
      <Paper x={1120} y={676} />
      <Foreground blur={8}>
        <path d="M 220 1080 L 340 760 L 460 1080 Z" fill="#0A0914" opacity={0.6} />
      </Foreground>
    </g>
  );
};

// ---------- S2: insert, close-up tabletop: tea cup and tea droplets drift upward ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const lift = kf(t, [[0, 0], [len, -85]]);
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <rect x={200} y={300} width={1520} height={500} fill="#241E1C" rx={12} />
      <line x1={200} y1={720} x2={1720} y2={720} stroke="#4A3D36" strokeWidth={6} />
      {/* Floating mug */}
      <g transform={`translate(0 ${lift})`}>
        <g transform="translate(960 640) scale(1.8)">
          <Mug x={0} y={0} rot={0} f={t} />
        </g>
        {/* Floating tea droplet spheres */}
        {[
          [930, 520, 14, 0],
          [970, 480, 18, 4],
          [920, 430, 10, 8],
          [1000, 390, 12, 12],
          [950, 340, 16, 16],
        ].map(([bx, by, r, delay], i) => {
          const dy = kf(t, [[delay, 0], [delay + 16, -110]]);
          const o = clamp((t - delay) / 6);
          return (
            <g key={i} transform={`translate(0 ${dy})`} opacity={o}>
              <circle cx={bx} cy={by} r={r} fill="#C66928" stroke="#FFE27A" strokeWidth={2} />
              <circle cx={bx - r * 0.3} cy={by - r * 0.3} r={r * 0.35} fill="#FFF" opacity={0.7} />
            </g>
          );
        })}
      </g>
      <Tag x={960} y={260} t={t - 6} text="GRAVITY: 0.0g" w={320} />
    </g>
  );
};

// ---------- S3: medium, Pip looks at the floating tea in awe ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.4, look: 0.8, headTilt: -6, armL: { a: 12, b: -20 }, armR: { a: 30, b: -40 } } },
    { f: 12, p: { headTilt: -10, armR: { a: 50, b: -50 } } },
  ]);
  const face = faceAt(t, [[0, 'shock']]);
  const floatMugY = kf(t, [[0, 560], [len, 480]]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 580, kf(t, [[0, 2.0], [len, 2.2]]))}>
      <Study t={t + 60} id="gml_s3" />
      <Hero look={PIP} pose={{ ...pose, ...face, glint: 0.8, glintColor: CYAN }} rimId="rimR" shadow={0.4} />
      <g transform={`translate(1080 ${floatMugY})`}>
        <g transform="scale(1.1)">
          <Mug x={0} y={0} rot={-12} f={t} />
        </g>
        <circle cx={-10} cy={-40} r={10} fill="#C66928" opacity={0.85} />
      </g>
    </g>
  );
};

// ---------- S4: wide, Pip and chair floating toward ceiling ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const lift = kf(t, [[0, 0], [len, -260]]);
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712 + lift, yaw: 0.1, armL: { a: 40, b: 20 }, armR: { a: -40, b: 20 }, legL: { a: 15, b: 25 }, legR: { a: -15, b: 25 } } },
    { f: len, p: { headTilt: 8, armL: { a: 60, b: 30 }, armR: { a: -60, b: 30 } } },
  ]);
  const face = faceAt(t, [[0, 'shock'], [12, 'oops']]);
  return (
    <g transform={camT(960, kf(t, [[0, 620], [len, 520]]), kf(t, [[0, 1.25], [len, 1.35]]))}>
      <Study t={t + 100} id="gml_s4" />
      {/* Floating desk objects */}
      <g transform={`translate(0 ${lift * 0.7})`}>
        <Desk x0={520} x1={1400} y={700} />
        <PaperStack x={640} y={670} n={4} />
      </g>
      <g transform={`translate(0 ${lift})`}>
        {/* Floating chair */}
        <rect x={900} y={680} width={120} height={18} fill="#3A2C20" rx={4} />
        <rect x={890} y={560} width={20} height={130} fill="#3A2C20" rx={4} />
      </g>
      <Hero look={PIP} pose={{ ...pose, ...face, y: 712 + lift }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S5: medium, Pip walking on ceiling looking down ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const walkX = kf(t, [[0, 780], [len, 1140]]);
  const pose = poseAt(t, [
    { f: 0, p: { x: walkX, y: 280, spin: 180, yaw: 0.7, armL: { a: 20, b: -10 }, armR: { a: -20, b: -10 }, legL: { a: 30, b: 20 }, legR: { a: -30, b: 15 } } },
    { f: len, p: { spin: 180, armL: { a: -25, b: -10 }, armR: { a: 25, b: -10 } } },
  ]);
  const face = faceAt(t, [[0, 'smug']]);
  return (
    <g transform={camT(kf(t, [[0, 920], [len, 1020]]), 340, 1.7)}>
      <Study t={t + 140} id="gml_s5" />
      <line x1={300} y1={190} x2={1600} y2={190} stroke="#C8B89A" strokeWidth={8} />
      <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
      <Tag x={960} y={420} t={t - 4} text="CEILING WALK" w={320} />
    </g>
  );
};

// ---------- S6: wide, looking out window: city cars and trees lift into sky ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const liftCars = kf(t, [[0, 0], [len, -280]]);
  const liftTrees = kf(t, [[0, 0], [len, -160]]);
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 480]]), kf(t, [[0, 1.05], [len, 1.15]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141E30" />
      <rect x={0} y={350} width={1920} height={730} fill="#243B55" opacity={0.6} />
      <circle cx={1500} cy={300} r={140} fill="#FFB15A" opacity={0.4} />
      <path d="M 100 800 L 100 520 L 280 520 L 280 800 M 340 800 L 340 460 L 520 460 L 520 800 M 600 800 L 600 580 L 800 580 L 800 800 Z" fill="#0F172A" />
      <path d="M 1100 800 L 1100 480 L 1320 480 L 1320 800 M 1400 800 L 1400 540 L 1650 540 L 1650 800 Z" fill="#0F172A" />

      {/* Floating trees */}
      <g transform={`translate(0 ${liftTrees})`}>
        <g transform="translate(420 720)">
          <rect x={-12} y={0} width={24} height={90} fill="#3E2723" rx={6} />
          <circle cx={0} cy={-30} r={65} fill="#1B4D3E" />
        </g>
        <g transform="translate(1480 690)">
          <rect x={-14} y={0} width={28} height={100} fill="#3E2723" rx={6} />
          <circle cx={0} cy={-35} r={80} fill="#2E5A44" />
        </g>
      </g>

      {/* Floating cars */}
      <g transform={`translate(0 ${liftCars})`}>
        <g transform="translate(860 760) rotate(-14)">
          <rect x={-110} y={-30} width={220} height={60} rx={18} fill="#E53935" />
          <rect x={-60} y={-60} width={120} height={35} rx={10} fill="#B71C1C" />
          <circle cx={-65} cy={30} r={22} fill="#212121" />
          <circle cx={65} cy={30} r={22} fill="#212121" />
        </g>
        <g transform="translate(1220 720) rotate(18)">
          <rect x={-100} y={-25} width={200} height={55} rx={16} fill="#1E88E5" />
          <rect x={-50} y={-52} width={100} height={30} rx={8} fill="#0D47A1" />
          <circle cx={-55} cy={28} r={20} fill="#212121" />
          <circle cx={55} cy={28} r={20} fill="#212121" />
        </g>
      </g>

      <path d="M 0 0 L 1920 0 L 1920 1080 L 0 1080 Z M 220 120 L 220 960 L 1700 960 L 1700 120 Z" fill="#0B0914" />
      <line x1={960} y1={120} x2={960} y2={960} stroke="#1A1424" strokeWidth={24} />
      <line x1={220} y1={540} x2={1700} y2={540} stroke="#1A1424" strokeWidth={24} />
    </g>
  );
};

// ---------- S7: title card in Malayalam: ഗുരുത്വാകർഷണം വിപരീതമായാലോ? ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#090814" />
    <Rooftop t={t} red={0.3} />
    <TitleCard t={t} lines={['ഗുരുത്വാകർഷണം', 'വിപരീതമായാലോ?']} accent="വിപരീതമായാലോ?" accentT={18} size={118} />
  </g>
);

// ---------- S8: schematic part 1: Earth surface & upward trajectory formula ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const alt = Math.round(kf(t, [[0, 0], [len, 1200]]));
  return (
    <g>
      <Schematic t={t} id="gml_s8" />
      <text x={180} y={160} fontFamily={SCH.dim} fontSize={38} fill={SCH.dim} letterSpacing={4}>
        INVERTED KINEMATICS // 30 SECONDS
      </text>

      <DrawOn d="M 380 820 Q 640 760 900 520 Q 1120 320 1440 220" t={t} dur={35} color={SCH.live} width={8} />
      <Arrow x0={400} y0={820} x1={400} y1={540} t={t} dur={15} color={CYAN} bend={0} />

      <text x={430} y={670} fontFamily={SCH.dim} fontSize={42} fill={CYAN}>
        -g = 9.8 m/s²
      </text>
      <text x={960} y={420} fontFamily={SCH.dim} fontSize={56} fill={SCH.line} fontWeight={700}>
        h = ½ g t²
      </text>

      <g transform="translate(1380 620)">
        <rect x={-20} y={-60} width={420} height={140} rx={16} fill="#08101E" stroke={SCH.grid} strokeWidth={4} />
        <text x={20} y={-10} fontFamily={SCH.dim} fontSize={28} fill={SCH.dim}>
          ALTITUDE (h)
        </text>
        <text x={20} y={48} fontFamily={SCH.dim} fontSize={54} fill={AMBER} fontWeight={700}>
          +{alt} m
        </text>
      </g>
    </g>
  );
};

// ---------- S9: schematic part 2: altitude meter surges past 4.4 KILOMETERS ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const km = (kf(t, [[0, 1.2], [len, 4.41]])).toFixed(2);
  const vel = Math.round(kf(t, [[0, 420], [len, 1058]]));
  return (
    <g>
      <Schematic t={t + 40} id="gml_s9" />
      <text x={180} y={160} fontFamily={SCH.dim} fontSize={38} fill={SCH.dim} letterSpacing={4}>
        PEAK ALTITUDE AT t = 30s
      </text>

      <g transform="translate(420 320)">
        <rect x={0} y={0} width={280} height={540} fill="#0A1424" stroke={SCH.dim} strokeWidth={3} rx={8} />
        <rect x={0} y={540 - (Number(km) / 5) * 540} width={280} height={(Number(km) / 5) * 540} fill={SCH.live} opacity={0.6} />
        <line x1={-30} y1={540 - (4.41 / 5) * 540} x2={310} y2={540 - (4.41 / 5) * 540} stroke="#FFF" strokeWidth={5} strokeDasharray="10 8" />
        <text x={330} y={540 - (4.41 / 5) * 540 + 10} fontFamily={SCH.dim} fontSize={36} fill="#FFE27A" fontWeight={700}>
          4.4 km (TROPOSPHERE)
        </text>
      </g>

      <g transform="translate(1080 440)">
        <text x={0} y={0} fontFamily={SCH.dim} fontSize={34} fill={SCH.dim}>
          TOTAL ELEVATION REACHED
        </text>
        <text x={0} y={90} fontFamily={SCH.dim} fontSize={96} fill={SCH.live} fontWeight={700}>
          {km} KM
        </text>
        <text x={0} y={180} fontFamily={SCH.dim} fontSize={38} fill={CYAN}>
          VELOCITY: {vel} km/h
        </text>
        <rect x={-10} y={220} width={480} height={60} rx={12} fill="#FF4A4A" opacity={0.2} />
        <text x={18} y={262} fontFamily={SCH.dim} fontSize={32} fill="#FF5A4A" fontWeight={700}>
          WARNING: SUB-ORBITAL FREE-FALL
        </text>
      </g>
    </g>
  );
};

// ---------- S10: wide, 4 km high sky: Pip and city debris floating in clouds ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 520, yaw: 0.2, armL: { a: 45, b: 20 }, armR: { a: -45, b: 20 }, legL: { a: 20, b: 15 }, legR: { a: -20, b: 15 } } },
    { f: len, p: { armL: { a: 60, b: 10 }, armR: { a: -60, b: 10 } } },
  ]);
  const face = faceAt(t, [[0, 'shock']]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.1], [len, 1.2]]))}>
      <rect width={1920} height={1080} fill="#091322" />
      <ellipse cx={960} cy={1650} rx={1400} ry={700} fill="#102A45" stroke="#1D4E75" strokeWidth={6} />
      {[
        [200, 420, 260],
        [750, 680, 320],
        [1400, 360, 280],
        [1650, 620, 220],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx + (t * 2) % 200} cy={cy} r={r} fill="#FFFFFF" opacity={0.12} filter="blur(30px)" />
      ))}

      <g transform={`translate(${kf(t, [[0, 420], [len, 440]])} ${kf(t, [[0, 640], [len, 620]])}) rotate(${t * 0.8})`}>
        <rect x={-80} y={-20} width={160} height={40} rx={12} fill="#E53935" />
      </g>
      <g transform={`translate(${kf(t, [[0, 1420], [len, 1400]])} ${kf(t, [[0, 580], [len, 560]])}) rotate(${-t * 0.6})`}>
        <rect x={-40} y={-40} width={80} height={80} rx={8} fill="#4E342E" />
      </g>

      <Hero look={PIP} pose={{ ...pose, ...face, y: 520 }} rimId="rimR" shadow={0} />
      <Tag x={960} y={220} t={t} text="ALTITUDE: 4,410 METERS" w={460} />
    </g>
  );
};

// ---------- S11: close-up, Pip's eye & countdown timer 00:30 -> 00:31 ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 680, yaw: 0.1, headTilt: 4 } },
    { f: len, p: { headTilt: 8 } },
  ]);
  const face = faceAt(t, [[0, 'worried'], [20, 'shock']]);
  const sec = t < 22 ? '00:30' : '00:31';
  const secColor = t < 22 ? AMBER : '#FF4A4A';
  return (
    <g transform={camT(960, 460, kf(t, [[0, 2.7], [len, 3.1]]))}>
      <rect width={1920} height={1080} fill="#080C14" />
      <Hero look={PIP} pose={{ ...pose, ...face, glint: 1.0, glintColor: secColor }} rimId="rimR" shadow={0} />
      <g transform="translate(960 310)">
        <rect x={-190} y={-45} width={380} height={90} rx={20} fill="#050810" stroke={secColor} strokeWidth={5} />
        <text textAnchor="middle" y={18} fontFamily="Bricolage Grotesque, Impact, sans-serif" fontSize={62} fill={secColor} fontWeight={700} letterSpacing={6}>
          {sec}
        </text>
      </g>
    </g>
  );
};

// ---------- S12: wide plummet: sudden gravity return cliffhanger ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const fallY = kf(t, [[0, 220], [len, 1180]], easeIn);
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: fallY, spin: 180, yaw: 0, armL: { a: 160, b: 10 }, armR: { a: -160, b: 10 }, legL: { a: 15, b: 10 }, legR: { a: -15, b: 10 } } },
    { f: len, p: { spin: 180, armL: { a: 175, b: 0 }, armR: { a: -175, b: 0 } } },
  ]);
  const face = faceAt(t, [[0, 'shock']]);
  return (
    <g transform={camT(960, 540, 1.1)}>
      <rect width={1920} height={1080} fill="#060910" />
      {[240, 480, 720, 960, 1200, 1440, 1680].map((x, i) => (
        <line key={i} x1={x} y1={(t * 40 + i * 150) % 1080} x2={x} y2={((t * 40 + i * 150) % 1080) + 180} stroke="#FFF" strokeWidth={4} opacity={0.35} />
      ))}
      <Hero look={PIP} pose={{ ...pose, ...face, y: fallY }} rimId="rimR" shadow={0} />
      {t > len - 10 ? <rect width={1920} height={1080} fill="#000" opacity={clamp((t - (len - 10)) / 10)} /> : null}
    </g>
  );
};

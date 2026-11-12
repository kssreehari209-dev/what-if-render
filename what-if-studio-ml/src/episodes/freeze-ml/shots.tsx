import React from 'react';
import {
  LightVeil, DrawOn,
  Hero, basePose, poseAt, faceAt, kf, clamp, camT, LOOKS,
  Study, Desk, Schematic, SCH, Arrow, SchLabel, CountUp,
  Mug, Paper, PaperStack, Foreground, TitleCard, ShotProps, Tag, UI, Glow, HudChip, FocusRings, FONT,
  Classroom, SchoolDesk, Kid, KIDS, CLS, Rooftop
} from '../../engine';

const PIP = LOOKS.ramu;
const CYAN = '#00F2FE';
const ICE_BLUE = '#A5F3FC';
const AMBER = '#FFB15A';
const RED = '#FF3B30';

// ---------- S1: wide, study: Pip knocks tea mug off desk ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.35, look: 0.5, armL: { a: 16, b: -12 }, armR: { a: 20, b: -15 } } },
    { f: 8, p: { yaw: 0.45, look: 0.8, armR: { a: 48, b: -6 } } },
    { f: 20, p: { yaw: 0.4, look: 0.9, armR: { a: 65, b: 0 } } }
  ]);
  const face = faceAt(t, [[0, 'neutral'], [14, 'shock']]);
  const tipRot = kf(t, [[0, 0], [12, 0], [len, 42]]);
  const tipX = kf(t, [[12, 0], [len, 35]]);
  const tipY = kf(t, [[12, 0], [len, 65]]);

  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), 640, kf(t, [[0, 1.3], [len, 1.36]]))}>
      <Study t={t + 10} id="fz_s1" />
      <Hero look={PIP} pose={{ ...basePose, ...pose, ...face }} rimId="rimR" shadow={0.7} />
      <Desk x0={520} x1={1400} y={700} />
      <g transform={`translate(${1160 + tipX} ${665 + tipY}) rotate(${tipRot}) scale(0.95)`}>
        <Mug x={0} y={0} rot={0} f={t} />
      </g>
      <Paper x={860} y={676} />
      <PaperStack x={720} y={670} n={3} />
      <Foreground blur={8}>
        <path d="M 180 1080 L 320 780 L 440 1080 Z" fill="#0A0914" opacity={0.65} />
      </Foreground>
    </g>
  );
};

// ---------- S2: insert, tabletop: falling tea mug & drops freeze in mid-air ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1.75)}>
      <rect x={200} y={260} width={1520} height={560} fill="#241E1C" rx={12} />
      <line x1={200} y1={720} x2={1720} y2={720} stroke="#4A3D36" strokeWidth={6} />

      {/* Frozen Tilted Mug suspended in air */}
      <g transform="translate(960 480) rotate(35) scale(1.6)">
        <Mug x={0} y={0} rot={0} f={0} />
      </g>

      {/* Suspended Frozen Tea Droplets */}
      {[
        [910, 440, 9], [880, 410, 7], [930, 380, 8], [860, 460, 6],
        [950, 340, 5], [890, 360, 7], [840, 430, 5], [920, 310, 6]
      ].map(([dx, dy, r], i) => (
        <g key={i}>
          <circle cx={dx} cy={dy} r={r} fill="#9A5B2D" stroke={CYAN} strokeWidth={2} />
          <circle cx={dx - 2} cy={dy - 2} r={r * 0.4} fill="#FFF" opacity={0.7} />
          {/* Crystalline freeze glint */}
          <circle cx={dx} cy={dy} r={r + 4} fill="none" stroke={CYAN} strokeWidth={1.5} opacity={0.8} />
        </g>
      ))}

      {/* Freeze Shockwave Waveform */}
      <FocusRings x={960} y={480} t={t} r0={40} color={CYAN} />

      {/* Time-Freeze Chip */}
      <g transform="translate(960 220)">
        <rect x={-140} y={-30} width={280} height={60} rx={16} fill="#0F172A" stroke={CYAN} strokeWidth={3} />
        <circle cx={-90} cy={0} r={8} fill={CYAN} style={{ filter: `drop-shadow(0 0 6px ${CYAN})` }} />
        <text x={10} y={9} textAnchor="middle" fontFamily={FONT.mono} fontSize={28} fontWeight="bold" fill={CYAN}>
          TIME FROZEN
        </text>
      </g>

      <LightVeil id="fz_s2" lights={[[960, 480, 300]]} o={0.3} />
    </g>
  );
};

// ---------- S3: medium, study: Pip smiling smugly, holding cup under frozen droplets ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 640, yaw: 0.3, look: 0.4, armL: { a: 15, b: -20 }, armR: { a: 52, b: -28 } } },
    { f: len, p: { x: 960, y: 636, yaw: 0.32, look: 0.45, armR: { a: 54, b: -26 } } },
  ]);
  const face = faceAt(t, [[0, 'smug']]);

  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.55], [len, 1.62]]))}>
      <Study t={t + 40} id="fz_s3" />
      <Hero look={PIP} pose={{ ...basePose, ...pose, ...face }} rimId="rimR" shadow={0.8} />
      
      {/* Caught mug in Pip's hand */}
      <g transform="translate(1085 530) scale(0.95)">
        <Mug x={0} y={0} rot={0} f={0} />
      </g>

      {/* Suspended frozen droplets hovering above mug */}
      {[
        [1080, 470, 7], [1095, 440, 6], [1070, 420, 5], [1105, 390, 6]
      ].map(([px, py, r], i) => (
        <g key={i}>
          <circle cx={px} cy={py} r={r} fill="#9A5B2D" stroke={CYAN} strokeWidth={2} />
          <circle cx={px - 2} cy={py - 2} r={r * 0.4} fill="#FFF" opacity={0.7} />
        </g>
      ))}

      <Tag x={960} y={260} t={t - 2} text="t = 0.00 s" mark="check" markT={8} w={240} />
    </g>
  );
};

// ---------- S4: wide, classroom: hard exam, teacher pacing ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(900, 500, kf(t, [[0, 1.1], [len, 1.15]]))}>
      <Classroom t={t + 20} id="fz_s4" board="EXAM: SOLVE 1 TO 10" />
      
      {/* Teacher pacing near board */}
      <g transform="translate(680 540)">
        <Hero
          look={LOOKS.suit}
          pose={{
            ...basePose,
            x: 0,
            y: 0,
            yaw: -0.6,
            look: -0.6,
            armL: { a: 25, b: -10 },
            armR: { a: -30, b: -20 },
            legL: { a: 20, b: -10 },
            legR: { a: -20, b: 15 }
          }}
          rimId="rimL"
          shadow={0.6}
        />
      </g>

      {/* Stress sweat droplets on kids */}
      <g opacity={0.85}>
        <circle cx={820} cy={590} r={4} fill={CYAN} />
        <circle cx={1180} cy={590} r={4} fill={CYAN} />
      </g>
    </g>
  );
};

// ---------- S5: over-the-shoulder, classroom: Pip copying answers from frozen student ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1040, y: 720, yaw: -0.4, look: -0.6, armL: { a: 45, b: -15 }, armR: { a: 55, b: -30 } } },
    { f: len, p: { x: 1020, y: 715, yaw: -0.45, look: -0.7, armL: { a: 50, b: -20 }, armR: { a: 60, b: -25 } } }
  ]);
  const pipFace = faceAt(t, [[0, 'smug']]);

  return (
    <g transform={camT(920, 600, 1.65)}>
      <Classroom t={0} id="fz_s5" />

      {/* Frozen student at desk */}
      <g transform="translate(620 740)">
        <Kid x={0} y={0} s={1.1} look={KIDS[0]} turn={0.2} />
      </g>
      <SchoolDesk x={620} />

      {/* Exam paper with answers on topper desk */}
      <g transform="translate(620 680)">
        <Paper x={0} y={0} done />
        {/* A+ mark in glowing green */}
        <text x={30} y={-10} fontFamily={FONT.ui} fontSize={32} fontWeight="bold" fill="#10B981">
          A+ (100%)
        </text>
      </g>

      {/* Pip leaning over casually, taking notes */}
      <Hero look={PIP} pose={{ ...basePose, ...pipPose, ...pipFace }} rimId="rimR" shadow={0.8} />

      {/* Suspended chalk dust from teacher in background */}
      {[
        [450, 480], [470, 460], [440, 440], [480, 430]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="#FFF" opacity={0.8} />
      ))}

      {/* Blurred foreground silhouette for OTS depth */}
      <Foreground blur={12}>
        <path d="M 1200 1080 Q 1320 620 1600 580 L 1920 620 L 1920 1080 Z" fill="#0A0914" opacity={0.8} />
      </Foreground>
    </g>
  );
};

// ---------- S6: wide low-angle, rooftop: Pip walking out onto dusk roof ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pipX = kf(t, [[0, 680], [len, 860]]);

  return (
    <g transform={camT(960, 600, 1.25)}>
      <Rooftop t={0} id="fz_s6" low={60} sunX={1120} sunY={540} />
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: pipX,
          y: 770,
          yaw: 0.7,
          look: 0.8,
          armL: { a: 20, b: -10 },
          armR: { a: -25, b: 15 },
          legL: { a: -15, b: 20 },
          legR: { a: 25, b: -10 },
          expr: 'neutral'
        }}
        rimId="rimR"
        shadow={0.8}
      />
    </g>
  );
};

// ---------- S7: insert close-up, sky: bird frozen mid-flap in air ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const handReach = kf(t, [[0, 180], [18, 0], [len, 0]]);

  return (
    <g transform={camT(960, 540, 1.8)}>
      {/* Twilight Sky gradient */}
      <rect x={200} y={150} width={1520} height={780} fill="#1E1B4B" rx={16} />
      <rect x={200} y={480} width={1520} height={450} fill="#311042" opacity={0.6} rx={16} />

      {/* Frozen Bird in flight */}
      <g transform="translate(900 460) scale(1.4)">
        {/* Bird Body */}
        <ellipse cx={0} cy={0} rx={45} ry={22} fill="#1E293B" stroke="#0F172A" strokeWidth={5} />
        <circle cx={35} cy={-8} r={16} fill="#1E293B" stroke="#0F172A" strokeWidth={4} />
        {/* Beak */}
        <polygon points="48,-12 65,-6 48,0" fill="#F59E0B" />
        {/* Frozen Wing Upward */}
        <path d="M -10 -15 Q 10 -95 60 -105 Q 30 -50 15 -15 Z" fill="#334155" stroke="#0F172A" strokeWidth={5} />
        {/* Frozen Wing Downward */}
        <path d="M -15 15 Q -5 70 35 75 Q 15 35 5 15 Z" fill="#0F172A" stroke="#0F172A" strokeWidth={4} />
        {/* Frozen feathers & air wavelets */}
        <line x1={-30} y1={-10} x2={-65} y2={-5} stroke="#334155" strokeWidth={4} />
        <line x1={-30} y1={5} x2={-60} y2={10} stroke="#334155" strokeWidth={4} />
      </g>

      {/* Cyan Crystalline suspension aura around bird */}
      <ellipse cx={900} cy={460} rx={120} ry={90} fill="none" stroke={CYAN} strokeWidth={3} strokeDasharray="16 8" opacity={0.8} />

      {/* Pip's sleeve and hand entering frame to gently tap the frozen wing */}
      <g transform={`translate(${1320 - handReach} 410) scale(1.4)`}>
        <path d="M 120 40 L -20 10 L -20 -10 L 120 -30 Z" fill="#1C1829" stroke="#0D0B14" strokeWidth={6} />
        {/* Pip's mitten tapping wing tip */}
        <circle cx={-25} cy={0} r={22} fill="#E8D8C8" stroke="#1A1230" strokeWidth={5} />
        <circle cx={-35} cy={-6} r={10} fill="#E8D8C8" stroke="#1A1230" strokeWidth={4} />
        {/* Touch sparkle */}
        {t >= 18 ? <FocusRings x={-40} y={-10} t={t - 18} r0={15} color={CYAN} /> : null}
      </g>

      <Tag x={900} y={260} t={t - 4} text="VELOCITY = 0 m/s" mark="check" markT={10} w={320} />
    </g>
  );
};

// ---------- S8: wide, title card: "സമയം നിശ്ചലമാക്കാൻ കഴിഞ്ഞാലോ?" ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1)}>
      {/* Background twilight skyline */}
      <rect width={1920} height={1080} fill="#090A15" />
      <circle cx={960} cy={540} r={480} fill="#1E1B4B" opacity={0.4} />

      {/* Giant frozen clock behind title */}
      <g transform="translate(960 480) scale(1.8)" opacity={0.25}>
        <circle cx={0} cy={0} r={160} fill="none" stroke={CYAN} strokeWidth={8} />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <line
            key={i}
            x1={0}
            y1={-150}
            x2={0}
            y2={-130}
            stroke={CYAN}
            strokeWidth={i % 3 === 0 ? 8 : 4}
            transform={`rotate(${deg})`}
          />
        ))}
        {/* Frozen hands at 10:10:00 */}
        <line x1={0} y1={0} x2={-45} y2={-75} stroke="#FFF" strokeWidth={10} strokeLinecap="round" />
        <line x1={0} y1={0} x2={60} y2={-90} stroke="#FFF" strokeWidth={7} strokeLinecap="round" />
        <line x1={0} y1={20} x2={0} y2={-110} stroke={RED} strokeWidth={4} />
        <circle cx={0} cy={0} r={14} fill={CYAN} />
      </g>

      {/* Main Title Card text */}
      <TitleCard
        t={t}
        lines={["സമയം നിശ്ചലമാക്കാൻ", "കഴിഞ്ഞാലോ?"]}
        accent="കഴിഞ്ഞാലോ"
        size={110}
      />
    </g>
  );
};

// ---------- S9: schematic, dark grid: photon speed dropping to 0 m/s ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const cSpeed = Math.max(0, Math.round(300000 - (t / 40) * 300000));

  return (
    <g transform={camT(960, 540, 1)}>
      <Schematic t={t} id="fz_s9" title="PHYSICS: PHOTON PROPAGATION VELOCITY" />

      {/* Speedometer Gauge */}
      <g transform="translate(560 520)">
        <rect x={-240} y={-160} width={480} height={320} rx={20} fill="#0B132B" stroke="#1C2541" strokeWidth={5} />
        <text x={0} y={-80} textAnchor="middle" fontFamily={FONT.mono} fontSize={28} fill="#94A3B8">
          SPEED OF LIGHT (c)
        </text>
        <text
          x={0}
          y={30}
          textAnchor="middle"
          fontFamily={FONT.mono}
          fontSize={68}
          fontWeight="bold"
          fill={cSpeed === 0 ? RED : CYAN}
          style={{ filter: `drop-shadow(0 0 16px ${cSpeed === 0 ? RED : CYAN})` }}
        >
          {cSpeed.toLocaleString()}
        </text>
        <text x={0} y={90} textAnchor="middle" fontFamily={FONT.mono} fontSize={32} fill="#CBD5E1">
          km / second
        </text>
      </g>

      {/* Photon wave stopping animation */}
      <g transform="translate(1260 520)">
        <rect x={-320} y={-160} width={640} height={320} rx={20} fill="#0B132B" stroke="#1C2541" strokeWidth={5} />
        <text x={0} y={-90} textAnchor="middle" fontFamily={FONT.mono} fontSize={26} fill="#94A3B8">
          PHOTON WAVE PACKET (dt = 0)
        </text>
        
        {/* Light ray path */}
        <line x1={-260} y1={20} x2={260} y2={20} stroke="#334155" strokeWidth={6} strokeDasharray="12 12" />
        
        {/* Frozen Photons */}
        {[-180, -90, 0, 90, 180].map((px, i) => (
          <g key={i} transform={`translate(${px} 20)`}>
            <circle cx={0} cy={0} r={14} fill={CYAN} style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }} />
            <line x1={-18} y1={0} x2={18} y2={0} stroke="#FFF" strokeWidth={3} />
            <line x1={0} y1={-18} x2={0} y2={18} stroke="#FFF" strokeWidth={3} />
          </g>
        ))}

        <text x={0} y={95} textAnchor="middle" fontFamily={FONT.mono} fontSize={28} fill={RED} fontWeight="bold">
          STATUS: STATIONARY (FROZEN)
        </text>
      </g>

      <Tag x={960} y={840} t={t - 8} text="dx / dt = 0" mark="cross" markT={14} w={280} />
    </g>
  );
};

// ---------- S10: insert close-up, eye / photons stopping outside pupil ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1.6)}>
      <rect x={200} y={150} width={1520} height={780} fill="#050811" rx={16} />
      
      {/* Eye Cross-Section Graphic */}
      <g transform="translate(1180 540)">
        {/* Cornea & Pupil */}
        <path d="M 0 -220 A 240 240 0 0 1 0 220 Z" fill="#0F172A" stroke="#334155" strokeWidth={6} />
        <ellipse cx={20} cy={0} rx={35} ry={110} fill="#000" stroke={CYAN} strokeWidth={4} />
        <text x={120} y={10} fontFamily={FONT.mono} fontSize={32} fill="#94A3B8">
          RETINA
        </text>
      </g>

      {/* Photons stopping abruptly before reaching pupil */}
      <g transform="translate(680 540)">
        <line x1={-300} y1={0} x2={160} y2={0} stroke={RED} strokeWidth={8} />
        {/* Barrier line representing stopped time boundary */}
        <line x1={160} y1={-180} x2={160} y2={180} stroke={RED} strokeWidth={6} strokeDasharray="16 10" />
        
        {/* Photons piled up and halted */}
        {[60, 90, 120, 150].map((px, i) => (
          <circle key={i} cx={px} cy={0} r={12} fill="#FF4444" style={{ filter: 'drop-shadow(0 0 8px #FF0000)' }} />
        ))}
        
        <text x={-60} y={-50} fontFamily={FONT.mono} fontSize={28} fill="#FF6B6B">
          PHOTONS CANNOT ENTER
        </text>
      </g>

      {/* Warning Box */}
      <g transform="translate(960 840)">
        <rect x={-260} y={-35} width={520} height={70} rx={16} fill="#3B0707" stroke={RED} strokeWidth={3} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT.mono} fontSize={28} fontWeight="bold" fill="#FCA5A5">
          RESULT: TOTAL BLINDNESS
        </text>
      </g>
    </g>
  );
};

// ---------- S11: medium close-up, dark void: Pip horrified as vision cuts to black ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const darkness = kf(t, [[0, 0.4], [len, 0.95]]);
  const face = faceAt(t, [[0, 'shock'], [12, 'worried']]);

  return (
    <g transform={camT(960, 520, 2.2)}>
      {/* Total Blackness background */}
      <rect width={1920} height={1080} fill="#020204" />
      
      {/* Pip clutching face/eyes */}
      <g opacity={1 - darkness * 0.7}>
        <Hero
          look={PIP}
          pose={{
            ...basePose,
            x: 960,
            y: 620,
            yaw: 0.1,
            look: 0,
            armL: { a: 45, b: -45 },
            armR: { a: -45, b: 45 },
            ...face
          }}
          rimId="rimRed"
          shadow={0}
        />
      </g>

      {/* Darkness closing in vignette */}
      <rect width={1920} height={1080} fill="#000" opacity={darkness} />

      {/* Audio visualization of silence/heartbeat pulse */}
      <g transform="translate(960 920)" opacity={0.8}>
        <text x={0} y={0} textAnchor="middle" fontFamily={FONT.mono} fontSize={32} fill="#EF4444" fontWeight="bold">
          [ OPTICAL SIGNAL: 0% ]
        </text>
      </g>
    </g>
  );
};

// ---------- S12: medium, rigid air matrix: air molecules locked into solid lattice ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const pipStruggle = Math.sin(t * 0.8) * 3;

  return (
    <g transform={camT(960, 540, 1.4)}>
      <rect width={1920} height={1080} fill="#040914" />

      {/* Pip frozen mid-step */}
      <g transform={`translate(${pipStruggle} 0)`}>
        <Hero
          look={PIP}
          pose={{
            ...basePose,
            x: 960,
            y: 720,
            yaw: 0.5,
            look: 0.5,
            armL: { a: 30, b: -10 },
            armR: { a: -35, b: 20 },
            legL: { a: -20, b: 25 },
            legR: { a: 30, b: -15 },
            expr: 'shock'
          }}
          rimId="rimRed"
          shadow={0.5}
        />
      </g>

      {/* Rigid 3D Molecular Lattice Grid of Air Molecules */}
      <g opacity={0.75}>
        {[
          [680, 480], [780, 420], [880, 360], [980, 420], [1080, 480], [1180, 420],
          [720, 600], [820, 540], [920, 480], [1020, 540], [1120, 600], [1220, 540],
          [680, 720], [780, 660], [880, 600], [980, 660], [1080, 720], [1180, 660]
        ].map(([nx, ny], i) => (
          <g key={i}>
            {/* Rigid connecting bonds */}
            <line x1={nx} y1={ny} x2={nx + 60} y2={ny - 30} stroke={CYAN} strokeWidth={2} />
            <line x1={nx} y1={ny} x2={nx + 60} y2={ny + 30} stroke={CYAN} strokeWidth={2} />
            {/* Nitrogen / Oxygen Molecules */}
            <circle cx={nx} cy={ny} r={10} fill="#0284C7" stroke={ICE_BLUE} strokeWidth={3} />
            <circle cx={nx - 3} cy={ny - 3} r={3} fill="#FFF" />
          </g>
        ))}
      </g>

      {/* Science Data Readout */}
      <g transform="translate(960 220)">
        <rect x={-340} y={-45} width={680} height={90} rx={18} fill="#091E3A" stroke={CYAN} strokeWidth={4} />
        <text x={0} y={-8} textAnchor="middle" fontFamily={FONT.mono} fontSize={28} fill="#E0F2FE">
          AIR DENSITY: 2.7 × 10¹⁹ MOLECULES / cm³
        </text>
        <text x={0} y={30} textAnchor="middle" fontFamily={FONT.mono} fontSize={24} fontWeight="bold" fill={RED}>
          RIGID CRYSTAL: ZERO COMPLIANCE (SOLID WALL)
        </text>
      </g>
    </g>
  );
};

// ---------- S13: close-up, dark void: Pip clutching chest, unable to inhale ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = Math.sin(t * 0.4) * 0.05;

  return (
    <g transform={camT(960, 460, 2.5 + pulse)}>
      <rect width={1920} height={1080} fill="#020202" />

      {/* Pip clutching chest desperately */}
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 960,
          y: 600,
          yaw: 0.1,
          look: 0.2,
          armL: { a: 40, b: -60 },
          armR: { a: -40, b: 60 },
          expr: 'shock'
        }}
        rimId="rimRed"
        shadow={0}
      />

      {/* Suffocation Warning */}
      <g transform="translate(960 840)">
        <rect x={-240} y={-35} width={480} height={70} rx={16} fill="#450A0A" stroke="#DC2626" strokeWidth={3} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT.mono} fontSize={30} fontWeight="bold" fill="#F87171">
          OXYGEN INTAKE: 0.0 L/s
        </text>
      </g>
    </g>
  );
};

// ---------- S14: wide cliffhanger, dark silhouette: silent suspended world ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1)}>
      {/* Dusk skyline silhouette */}
      <rect width={1920} height={1080} fill="#030712" />
      <circle cx={960} cy={540} r={400} fill="#1E1B4B" opacity={0.3} />

      {/* Frozen city silhouette */}
      {[120, 320, 520, 720, 920, 1120, 1320, 1520, 1720].map((bx, i) => (
        <rect key={i} x={bx} y={480 + (i % 4) * 40} width={160} height={600} fill="#0B0F19" />
      ))}

      {/* Pip's solitary silhouette frozen on rooftop */}
      <g transform="translate(960 780)">
        <Hero
          look={PIP}
          pose={{
            ...basePose,
            x: 0,
            y: 0,
            yaw: 0.6,
            look: 0.6,
            armL: { a: 15, b: -10 },
            armR: { a: 45, b: -20 },
            expr: 'shock'
          }}
          rimId="rimRed"
          shadow={0.5}
        />
      </g>

      {/* Ticking clock stopping graphic */}
      <g transform="translate(960 280)">
        <rect x={-200} y={-35} width={400} height={70} rx={16} fill="#0F172A" stroke="#334155" strokeWidth={3} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT.mono} fontSize={32} fontWeight="bold" fill="#E2E8F0">
          TIME: -- : -- : --
        </text>
      </g>

      {/* Final threat question in Malayalam */}
      <g transform="translate(960 940)">
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fontFamily={FONT.title}
          fontSize={44}
          fontWeight="bold"
          fill="#FFF"
          style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.6))' }}
        >
          നിങ്ങൾക്ക് തിരിച്ചെത്താൻ കഴിയുമോ?
        </text>
      </g>
    </g>
  );
};

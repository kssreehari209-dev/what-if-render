import React from 'react';
import { staticFile } from 'remotion';
import {
  LightVeil, DrawOn,
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, camT, LOOKS,
  Study, Desk, Schematic, SCH, Arrow, SchLabel, CountUp,
  Mug, Paper, PaperStack, Foreground, TitleCard, ShotProps, Tag, UI, Glow, HudChip, FocusRings, FONT,
} from '../../engine';

const PIP = LOOKS.ramu;
const CYAN = '#00F2FE';
const AMBER = '#FFB15A';
const RED = '#FF3B30';

// ---------- S1: wide, morning study: Pip at desk, teacup starts to tip ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.35, look: 0.5, armL: { a: 16, b: -12 }, armR: { a: 20, b: -15 } } },
    { f: 8, p: { yaw: 0.45, look: 0.8, armR: { a: 45, b: -5 } } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [6, 'shock']]);
  const tipRot = kf(t, [[0, 0], [4, 0], [len, 38]]);
  const tipX = kf(t, [[4, 0], [len, 35]]);
  const tipY = kf(t, [[4, 0], [len, 55]]);

  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), 640, kf(t, [[0, 1.32], [len, 1.38]]))}>
      <Study t={t + 10} id="sp_s1" />
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

// ---------- S2: insert, tabletop: falling teacup snatched at 10x hypersonic speed ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const mugY = kf(t, [[0, 340], [11, 620], [len, 620]]);
  const mugRot = kf(t, [[0, 15], [11, 45], [len, 0]]);
  const handX = kf(t, [[0, 1400], [8, 1400], [11, 980], [len, 980]]);
  const caught = t >= 11;

  return (
    <g transform={camT(960, 540, 1.75)}>
      <rect x={200} y={260} width={1520} height={560} fill="#241E1C" rx={12} />
      <line x1={200} y1={720} x2={1720} y2={720} stroke="#4A3D36" strokeWidth={6} />

      {/* Trailing speed blur lines */}
      {t >= 7 && t <= 14 ? (
        <g opacity={0.8}>
          {[480, 520, 560, 600].map((ly, i) => (
            <line
              key={i}
              x1={handX - 250 - i * 40}
              y1={ly}
              x2={handX + 120}
              y2={ly}
              stroke={CYAN}
              strokeWidth={4 + i * 2}
              strokeDasharray="40 20"
              opacity={0.65}
            />
          ))}
        </g>
      ) : null}

      {/* Falling / Caught Mug */}
      <g transform={`translate(960 ${mugY}) rotate(${mugRot}) scale(1.6)`}>
        <Mug x={0} y={0} rot={0} f={t} />
      </g>

      {/* Ghost afterimage hands */}
      {t >= 8 && t <= 12 ? (
        <>
          <g transform={`translate(${handX + 180} 580) scale(1.3)`} opacity={0.25}>
            <circle cx={0} cy={0} r={40} fill={CYAN} />
            <rect x={-20} y={-10} width={80} height={20} rx={10} fill={CYAN} />
          </g>
          <g transform={`translate(${handX + 90} 590) scale(1.3)`} opacity={0.45}>
            <circle cx={0} cy={0} r={40} fill={CYAN} />
            <rect x={-20} y={-10} width={80} height={20} rx={10} fill={CYAN} />
          </g>
        </>
      ) : null}

      {/* Main snatching hand */}
      <g transform={`translate(${handX} 600) scale(1.3)`}>
        <path d="M -20 -15 L 45 -15 Q 65 -15 65 15 L -20 15 Z" fill="#E8D8C8" stroke="#1A1230" strokeWidth={6} />
        <circle cx={45} cy={0} r={28} fill="#E8D8C8" stroke="#1A1230" strokeWidth={6} />
      </g>

      {/* Sonic shockwave on catch */}
      {caught ? <FocusRings x={960} y={620} t={t - 11} r0={50} color={CYAN} /> : null}

      <LightVeil id="sp_s2" lights={[[960, 600, 280]]} o={0.35} />
    </g>
  );
};

// ---------- S3: medium, study: Pip holding caught mug, amazed victory ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 640, yaw: 0.25, look: 0.4, armL: { a: 15, b: -20 }, armR: { a: 52, b: -28 } } },
    { f: len, p: { x: 960, y: 636, yaw: 0.28, look: 0.45, armR: { a: 54, b: -26 } } },
  ]);
  const face = faceAt(t, [[0, 'shock'], [8, 'happy']]);

  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.55], [len, 1.62]]))}>
      <Study t={t + 40} id="sp_s3" />
      <Hero look={PIP} pose={{ ...basePose, ...pose, ...face }} rimId="rimR" shadow={0.8} />
      {/* Caught mug in Pip's hand */}
      <g transform="translate(1085 530) scale(0.95)">
        <Mug x={0} y={0} rot={0} f={t} />
      </g>
      {/* Cyan speed dissipation particles */}
      {[
        [1060, 520, 10], [1110, 490, 8], [1075, 460, 6], [1125, 430, 7], [1050, 400, 5]
      ].map(([px, py, r], i) => {
        const dy = (t * 4 + i * 16) % 180;
        const op = clamp(1 - dy / 180);
        return <circle key={i} cx={px} cy={py - dy} r={r} fill={CYAN} opacity={op * 0.7} style={{ filter: `drop-shadow(0 0 8px ${CYAN})` }} />;
      })}
      <Tag x={960} y={260} t={t - 4} text="0.05 SEC" mark="check" markT={10} w={240} />
    </g>
  );
};

// ---------- S4: insert, desk: homework solved in supersonic seconds ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const blurShake = Math.sin(t * 1.8) * 6;
  const timerSec = Math.max(6, Math.round(60 - (t / len) * 54));

  return (
    <g transform={camT(960, 540, 1.5)}>
      <rect x={180} y={120} width={1560} height={840} fill="#2A2422" rx={16} />
      <rect x={440} y={200} width={760} height={680} fill="#FDFBF7" rx={8} stroke="#D6CEC2" strokeWidth={4} />

      {/* Equations on homework sheet */}
      <g transform={`translate(${blurShake} 0)`}>
        <DrawOn d="M 490 280 L 1100 280" t={t} dur={6} color="#2B3A42" width={4} />
        <DrawOn d="M 490 350 L 850 350 M 900 340 L 1050 340" t={t - 2} dur={6} color="#2B3A42" width={4} />
        <DrawOn d="M 490 430 L 1080 430" t={t - 4} dur={8} color="#2B3A42" width={4} />
        <DrawOn d="M 490 510 L 780 510 M 820 500 L 1110 500" t={t - 6} dur={7} color="#2B3A42" width={4} />
        <DrawOn d="M 490 590 L 980 590" t={t - 8} dur={6} color="#2B3A42" width={4} />
        <DrawOn d="M 490 670 L 1060 670" t={t - 10} dur={8} color="#0B6623" width={6} />
      </g>

      {/* Hypersonic Hand + Pencil blur */}
      <g transform={`translate(${820 + Math.sin(t * 3) * 120} ${560 + Math.cos(t * 2) * 60})`}>
        <line x1={-30} y1={-60} x2={20} y2={20} stroke="#E5A93C" strokeWidth={14} strokeLinecap="round" />
        <line x1={20} y1={20} x2={35} y2={45} stroke="#333" strokeWidth={8} strokeLinecap="round" />
        <circle cx={-10} cy={-20} r={32} fill="#E8D8C8" stroke="#1A1230" strokeWidth={5} />
        {/* Sonic friction spark */}
        <circle cx={35} cy={45} r={12 + (t % 4) * 4} fill="#FFE27A" opacity={0.8} />
      </g>

      {/* Digital Timer / Clock Display */}
      <g transform="translate(1320 320)">
        <rect x={-140} y={-70} width={280} height={140} rx={24} fill="#10141E" stroke="#2B384E" strokeWidth={5} />
        <text x={0} y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={54} fill={CYAN} style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }}>
          {timerSec < 10 ? `0${timerSec}:00` : `${timerSec}:00`}
        </text>
        <text x={0} y={-38} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#7E8DA6">
          TIME REMAINING
        </text>
      </g>

      <Tag x={1320} y={540} t={t - 6} text="60m → 6m" mark="check" markT={12} w={280} />
    </g>
  );
};

// ---------- S5: wide, street at dusk: Pip sprinting at 250 km/h, cars frozen ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pipX = kf(t, [[0, -100], [len, 2100]]);

  return (
    <g transform={camT(960, 540, 1.05)}>
      {/* Sky and City background */}
      <rect width={1920} height={700} fill="#141E30" />
      <rect y={680} width={1920} height={400} fill="#1C1B20" />
      <line x1={0} y1={860} x2={1920} y2={860} stroke="#FFE27A" strokeWidth={10} strokeDasharray="60 40" />

      {/* City Skyline */}
      {[80, 240, 420, 640, 850, 1100, 1340, 1580, 1780].map((bx, i) => (
        <rect key={i} x={bx} y={320 - (i % 3) * 60} width={140} height={420} fill="#0B101D" />
      ))}

      {/* Streetlamps */}
      {[300, 950, 1600].map((lx, i) => (
        <g key={i}>
          <line x1={lx} y1={420} x2={lx} y2={740} stroke="#444" strokeWidth={8} />
          <path d={`M ${lx} 420 Q ${lx + 30} 380 ${lx + 60} 380`} fill="none" stroke="#444" strokeWidth={8} />
          <circle cx={lx + 60} cy={390} r={16} fill="#FFE27A" style={{ filter: 'drop-shadow(0 0 16px #FFA500)' }} />
        </g>
      ))}

      {/* Frozen Car on street */}
      <g transform="translate(1250 780)">
        <rect x={-180} y={-70} width={360} height={90} rx={20} fill="#3B4A6B" />
        <path d="M -110 -70 L -60 -130 L 80 -130 L 130 -70 Z" fill="#202A3D" />
        <circle cx={-100} cy={20} r={36} fill="#111" stroke="#555" strokeWidth={8} />
        <circle cx={100} cy={20} r={36} fill="#111" stroke="#555" strokeWidth={8} />
        {/* Frozen exhaust bubble */}
        <circle cx={195} cy={-10} r={14} fill="#889" opacity={0.6} />
      </g>

      {/* Hypersonic Pip & Speed Ghost Afterimages */}
      {[-240, -160, -80, 0].map((dx, i) => {
        const op = 0.25 + i * 0.25;
        const isGhost = i < 3;
        return (
          <g
            key={i}
            transform={`translate(${pipX + dx} 790)`}
            opacity={op}
            style={isGhost ? { filter: `drop-shadow(0 0 12px ${CYAN})` } : undefined}
          >
            {/* Speed streak rays */}
            <line x1={-180} y1={-70} x2={40} y2={-70} stroke={CYAN} strokeWidth={4} />
            <line x1={-120} y1={-20} x2={60} y2={-20} stroke={CYAN} strokeWidth={6} />
            <Hero
              look={PIP}
              pose={{
                ...basePose,
                x: 0,
                y: 0,
                yaw: 0.9,
                look: 0.9,
                armL: { a: 75, b: 20 },
                armR: { a: -60, b: -40 },
                legL: { a: -55, b: 60 },
                legR: { a: 65, b: 20 },
              }}
              rimId="rimR"
              shadow={0.5}
            />
          </g>
        );
      })}

      <HudChip f={t} label="250 KM/H" icon="dot" />
    </g>
  );
};

// ---------- S6: wide, title card ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      {/* Background with dusk gradient and sonic rings */}
      <rect width={1920} height={1080} fill="#0E1322" />
      <circle cx={960} cy={680} r={550} fill="#18233C" opacity={0.7} />

      {/* Expanding sonic shock rings */}
      {[0, 8, 16].map((offset, i) => {
        const r = ((t + offset * 8) % 40) * 25;
        const op = clamp(1 - r / 1000);
        return <circle key={i} cx={960} cy={720} r={r} fill="none" stroke={CYAN} strokeWidth={5} opacity={op * 0.65} />;
      })}

      {/* Pip in centered low sprinter ready pose */}
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 960,
          y: 720,
          yaw: 0.05,
          look: 0.0,
          armL: { a: 35, b: -20 },
          armR: { a: -35, b: 20 },
          legL: { a: 25, b: -10 },
          legR: { a: -25, b: 10 },
        }}
        rimId="rimR"
        shadow={0.9}
      />

      <TitleCard
        t={t}
        lines={['മനുഷ്യർക്ക്', 'പത്തിരട്ടി വേഗത ലഭിച്ചാലോ?']}
        accent="വേഗത ലഭിച്ചാലോ?"
        accentT={14}
        y={210}
        size={110}
        gap={120}
      />
      <HudChip f={t} label="10X SPEED" icon="dot" />
    </g>
  );
};

// ---------- S7: schematic: kinetic energy = 100x ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="sp_s7" />

      {/* Header title */}
      <SchLabel x={960} y={150} t={t} text="ചലനോർജ്ജ സൂത്രവാക്യം (KINETIC ENERGY)" size={42} color={SCH.line} />

      {/* Formula Box */}
      <g transform="translate(960 260)">
        <rect x={-260} y={-50} width={520} height={100} rx={16} fill="#142138" stroke={CYAN} strokeWidth={4} />
        <text x={0} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={50} fill="#F6EFE3" letterSpacing={4}>
          E = ½ · m · v²
        </text>
      </g>

      {/* Left Node: Speed 10x */}
      <g transform="translate(520 540)">
        <rect x={-180} y={-80} width={360} height={160} rx={18} fill="#162540" stroke="#4FACFE" strokeWidth={4} />
        <SchLabel x={0} y={-20} t={t - 2} text="വേഗത (VELOCITY)" size={28} color="#7E8DA6" />
        <SchLabel x={0} y={40} t={t - 4} text="10 × v" size={56} color={CYAN} />
      </g>

      {/* Arrow pointing to energy */}
      <Arrow x0={720} y0={540} x1={1180} y1={540} t={t - 4} color={AMBER} bend={0} />

      {/* Right Node: Kinetic Energy 100x */}
      <g transform="translate(1380 540)">
        <rect x={-200} y={-90} width={400} height={180} rx={22} fill="#241E1C" stroke={AMBER} strokeWidth={6} />
        <SchLabel x={0} y={-30} t={t - 6} text="ഊർജ്ജം (ENERGY: 10²)" size={28} color="#FFE27A" />
        <CountUp x={0} y={45} t={t - 8} to={100} dur={20} size={76} color={AMBER} suffix="x" />
      </g>

      {/* Bottom Summary Label */}
      <SchLabel
        x={960}
        y={820}
        t={t - 10}
        text="വേഗത 10 ഇരട്ടിയായാൽ ഊർജ്ജം 100 ഇരട്ടി!"
        size={44}
        color="#FFB15A"
      />
    </g>
  );
};

// ---------- S8: insert, ground: sneaker sole burning from friction ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const sparkSeed = Math.floor(t * 1.5);

  return (
    <g transform={camT(960, 540, 1.45)}>
      {/* Asphalt pavement */}
      <rect x={150} y={200} width={1620} height={680} fill="#18181A" rx={12} />
      {/* Heavy black skid mark */}
      <path d="M 200 660 L 1150 660" stroke="#0A0A0C" strokeWidth={60} strokeLinecap="round" />
      <path d="M 400 660 L 1150 660" stroke="#FF4500" strokeWidth={10} opacity={0.7} />

      {/* Sneaker Sole - 2D Flat Image Cutout */}
      <g transform="translate(1080 590) rotate(-15)">
        <image
          href={staticFile('speed-ml/assets/flat_sneaker.png')}
          x={-200}
          y={-100}
          width={400}
          height={194}
          style={{ filter: 'drop-shadow(0 0 16px rgba(255,100,50,0.6))' }}
        />
      </g>

      {/* Friction Heat & Fire Sparks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const sx = 1050 - rnd(sparkSeed + i, 1) * 350;
        const sy = 650 - rnd(sparkSeed + i, 2) * 110;
        const sr = 3 + rnd(sparkSeed + i, 3) * 8;
        return (
          <circle
            key={i}
            cx={sx}
            cy={sy}
            r={sr}
            fill={i % 2 === 0 ? '#FFE27A' : '#FF5A4A'}
            style={{ filter: 'drop-shadow(0 0 8px #FF5A4A)' }}
          />
        );
      })}

      {/* Billowing friction smoke */}
      {[0, 1, 2, 3].map((i) => {
        const smX = 850 - i * 90 - (t * 6) % 120;
        const smY = 620 - i * 35;
        return <circle key={i} cx={smX} cy={smY} r={35 + i * 16} fill="#666" opacity={0.45 - i * 0.08} />;
      })}

      <Tag x={1400} y={380} t={t - 2} text="350 °C" w={200} />
      <SchLabel x={960} y={800} t={t - 4} text="തീവ്ര ഘർഷണം (EXTREME FRICTION)" size={36} color="#FFE27A" />
    </g>
  );
};

// ---------- S9: medium, street: Pip trips on small crack ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const trip = t >= 6;
  const pitchAngle = kf(t, [[0, 0], [6, 0], [len, 48]]);
  const pose = poseAt(t, [
    { f: 0, p: { x: 880, y: 720, yaw: 0.85, look: 0.8, armL: { a: 45, b: 10 }, armR: { a: -50, b: -20 }, legL: { a: -40, b: 40 }, legR: { a: 40, b: 10 } } },
    { f: len, p: { x: 1040, y: 760, yaw: 0.95, look: 0.9, armL: { a: 85, b: 40 }, armR: { a: -85, b: -40 }, legL: { a: -70, b: 60 }, legR: { a: 70, b: 30 } } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [6, 'shock']]);

  return (
    <g transform={camT(960, 600, 1.4)}>
      <rect width={1920} height={1080} fill="#141926" />
      <line x1={0} y1={820} x2={1920} y2={820} stroke="#444" strokeWidth={10} />

      {/* Tiny 2cm crack in road */}
      <path d="M 880 815 L 895 828 L 915 818" stroke="#FFE27A" strokeWidth={6} fill="none" />

      {/* Impact Shock Burst on Trip */}
      {trip ? (
        <g>
          <circle cx={900} cy={820} r={kf(t, [[6, 10], [len, 240]])} fill="none" stroke="#FF3B30" strokeWidth={8} opacity={clamp(1 - (t - 6) / (len - 6))} />
          <FocusRings x={900} y={820} t={t - 6} r0={40} color="#FFA500" />
        </g>
      ) : null}

      <g transform={`rotate(${pitchAngle} 880 720)`}>
        <Hero look={PIP} pose={{ ...basePose, ...pose, ...face }} rimId="rimRed" shadow={0.8} />
      </g>
    </g>
  );
};

// ---------- S10: schematic: human stumble = 70 km/h car crash ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="sp_s10" />

      <SchLabel x={960} y={140} t={t} text="ആഘാത തുല്യത (IMPACT EQUIVALENCE)" size={42} color={SCH.line} />

      {/* Left side: Human 70kg at 70 m/s */}
      <g transform="translate(480 440)">
        <rect x={-200} y={-160} width={400} height={320} rx={20} fill="#16233B" stroke={CYAN} strokeWidth={4} />
        <Hero look={PIP} pose={{ ...basePose, x: 0, y: 40, yaw: 0.8, look: 0.8, armL: { a: 40, b: 0 }, armR: { a: -40, b: 0 } }} rimId="rimR" shadow={0} />
        <SchLabel x={0} y={-100} t={t - 2} text="മനുഷ്യൻ (70 KG @ 70 M/S)" size={24} color="#7E8DA6" />
        <SchLabel x={0} y={110} t={t - 4} text="171.5 KILOJOULES" size={32} color={CYAN} />
      </g>

      {/* Center Equals Sign */}
      <g transform="translate(960 440)">
        <circle cx={0} cy={0} r={60} fill="#24151B" stroke={RED} strokeWidth={5} />
        <text x={0} y={22} textAnchor="middle" fontFamily={FONT.ui} fontSize={70} fill={RED} fontWeight={900}>
          =
        </text>
      </g>

      {/* Right side: 890kg car at 70 km/h */}
      <g transform="translate(1440 440)">
        <rect x={-220} y={-160} width={440} height={320} rx={20} fill="#2A1B1C" stroke={AMBER} strokeWidth={5} />
        {/* 2D Flat Crashed Car Cutout Asset */}
        <image
          href={staticFile('speed-ml/assets/flat_crash_car.png')}
          x={-180}
          y={-65}
          width={360}
          height={202}
          style={{ filter: 'drop-shadow(0 0 14px rgba(255,138,61,0.5))' }}
        />
        <SchLabel x={0} y={-100} t={t - 4} text="കാർ അപകടം (890 KG)" size={24} color="#7E8DA6" />
        <SchLabel x={0} y={115} t={t - 6} text="70 KM/H CRASH" size={34} color={AMBER} />
      </g>

      {/* Bottom Truth Tag */}
      <SchLabel x={960} y={780} t={t - 8} text="ഇത് സത്യമാണ് (THAT'S REAL)" size={48} color="#FF5A4A" />
      <SchLabel x={960} y={850} t={t - 10} text="ചെറിയൊരു തട്ടൽ പോലും മാരകമായ കാർ അപകടത്തിന് തുല്യം" size={30} color="#F6EFE3" />
    </g>
  );
};

// ---------- S11: close-up, street: Pip's terrified face in sonic cone ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'shock'], [len, 'shock']]);

  return (
    <g transform={camT(960, 480, 2.7)}>
      <rect width={1920} height={1080} fill="#120D18" />

      {/* Hypersonic speed lines radiating from center */}
      {Array.from({ length: 24 }).map((_, i) => {
        const ang = (i * Math.PI * 2) / 24;
        const r1 = 300 + (t * 15 + i * 20) % 500;
        const r2 = r1 + 180;
        return (
          <line
            key={i}
            x1={960 + Math.cos(ang) * r1}
            y1={480 + Math.sin(ang) * r1}
            x2={960 + Math.cos(ang) * r2}
            y2={480 + Math.sin(ang) * r2}
            stroke={CYAN}
            strokeWidth={3}
            opacity={0.4}
          />
        );
      })}

      {/* Sonic compression shock cone around head */}
      <path
        d="M 960 260 Q 720 380 640 680 M 960 260 Q 1200 380 1280 680"
        fill="none"
        stroke={CYAN}
        strokeWidth={8}
        opacity={0.75}
        style={{ filter: `drop-shadow(0 0 16px ${CYAN})` }}
      />

      <Hero
        look={PIP}
        pose={{ ...basePose, x: 960, y: 720, yaw: 0.1, look: 0.0, armL: { a: 20, b: 0 }, armR: { a: -20, b: 0 }, ...face }}
        rimId="rimRed"
        shadow={0}
      />
    </g>
  );
};

// ---------- S12: wide, street: Desperate braking / Cliffhanger ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const pushZoom = kf(t, [[0, 1.2], [len, 1.45]]);

  return (
    <g transform={camT(960, 600, pushZoom)}>
      <rect width={1920} height={1080} fill="#120A10" />
      <line x1={0} y1={820} x2={1920} y2={820} stroke="#3A2D35" strokeWidth={12} />

      {/* Burning braking skid marks on asphalt */}
      <path d="M 300 825 L 940 825" stroke="#FF3300" strokeWidth={24} strokeLinecap="round" opacity={0.8} />
      <path d="M 300 840 L 960 840" stroke="#FF7700" strokeWidth={18} strokeLinecap="round" opacity={0.8} />

      {/* Approaching 2D Flat Concrete Barrier Cutout on right */}
      <g transform="translate(1420 520)">
        <image
          href={staticFile('speed-ml/assets/flat_barrier.png')}
          x={0}
          y={0}
          width={400}
          height={272}
          style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.85))' }}
        />
      </g>

      {/* Pip frantically braking: leaning way back */}
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 950,
          y: 770,
          yaw: 0.7,
          look: 0.85,
          armL: { a: -75, b: -30 },
          armR: { a: -80, b: -40 },
          legL: { a: 65, b: -20 },
          legR: { a: 50, b: -15 },
        }}
        rimId="rimRed"
        shadow={0.8}
      />

      {/* Smoke and fire erupting from feet */}
      {[0, 1, 2, 4].map((i) => (
        <circle key={i} cx={930 - i * 40} cy={815 - i * 15} r={20 + i * 12} fill="#FF4500" opacity={0.7 - i * 0.12} />
      ))}

      {/* Cliffhanger threat text */}
      <g transform={`translate(960 260) scale(${clamp(t / 8)})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontSize={68}
          fontWeight={900}
          fill="#FF3B30"
          stroke="#1A0A0E"
          strokeWidth={10}
          paintOrder="stroke"
          style={{ filter: 'drop-shadow(0 0 24px rgba(255,59,48,0.7))' }}
        >
          നിങ്ങൾക്ക് നിൽക്കാൻ കഴിയുമോ?
        </text>
      </g>
    </g>
  );
};

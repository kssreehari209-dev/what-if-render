// amazon-ml: "What if you tried to cross the Amazon in an auto?" A style test: the journey documentary, native 9:16.
// A real road, a real distance, a trip counter running through the film; the narration stays straight and the jokes
// sit in the picture.
import React from 'react';
import { faceAt, clamp, easeOut, backOut, ShotProps, FONT, Glow, rnd } from '../../engine';
import { Sky, Water, Rain, Bolt, Fig, handAt, headAt, kf, PIP, MO } from '../fly-ml/kit';
import { ground, vcam, Say, TeaGlass } from '../phone-ml/kit';
import {
  INK, Wheel, Auto, AutoBack, Canopy, Trunk, Vine, Jungle, Mud, MudFront, Clods, Eyes, CanopySea, Raft, Zap, Eel, Phone, SkyRiver, Vapour, Umbrella,
  Camel, Dune, Grains, SA_PATH, FOREST_PATH, AFRICA_PATH, KERALA_PATH, keralaAt, MapBg, TripChip, Sign,
} from './kit';

const Splat: React.FC<{ x: number; y: number; s?: number; k?: number }> = ({ x, y, s = 1, k = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * k})`} fill="#6A3E28">
    <ellipse cx={-10} cy={4} rx={60} ry={46} />
    <circle cx={46} cy={-30} r={20} /><circle cx={-62} cy={-34} r={15} /><circle cx={40} cy={44} r={15} />
    <path d="M -30 40 q 6 70 16 74 q 10 -4 12 -72 Z" />
  </g>
);

/** Pip at the back, pushing, up to his knees. */
const pushPose = (x: number, g: number, s: number, t: number) => ({
  x, y: ground(g, s), scale: s, yaw: 0.8, look: 0.5, tilt: 24 + Math.sin(t / 6) * 2, armR: { a: 96, b: -14 }, armL: { a: 88, b: -10 }, legL: { a: 30, b: 22 }, legR: { a: -24, b: 10 },
});

const Stuck: React.FC<{ t: number; id: string; night?: boolean }> = ({ t, id, night }) => {
  const s = 1.2;
  const shakeX = Math.sin(t * 1.9) * 3;
  const mo = { x: -50, y: -208, scale: 0.54, yaw: 0.5, look: -0.2, armR: { a: 74, b: -92 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, night ? 'tired' : 'cool']]) };
  const hand = handAt(mo, 'R');
  const p = pushPose(200, 1500, 1.25, t);
  return (
    <g>
      <Jungle t={t} id={id} y={1250} mode={night ? 'night' : 'dusk'} sun={[720, 800]} />
      <Mud y={1240} night={night} />
      <Vine x={880} y={-20} l={760} t={t} c={night ? '#050A08' : '#0E1A16'} seed={2} />
      <Vine x={170} y={-20} l={560} t={t + 30} c={night ? '#050A08' : '#0E1A16'} seed={5} />
      <Auto x={610 + shakeX} y={1470} s={s} rot={-3} spin={t * 34} mud={0.75} lamp={!night}>
        <Fig look={MO} pose={mo} rimId="rimR" />
        <TeaGlass x={hand.x + 4} y={hand.y + 18} s={0.62} fill={0.75} t={t} steam />
      </Auto>
      <Fig look={PIP} pose={{ ...p, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" />
      <MudFront y={1440} t={t} night={night} />
      <Clods x={460} y={1420} t={t} pow={0.8} n={12} />
    </g>
  );
};

// ============================================================ A. THE PREMISE, ALREADY GOING WRONG
export const A1: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stuck t={t} id="a1" />
    <Eyes x={930} y={1120} s={0.8} t={t} seed={1} />
    <Say y={470} text="ഓട്ടോയിൽ" size={118} t={t - 4} />
    <Say y={620} text="ആമസോൺ?" size={136} color="#FFC84A" t={t - 8} />
  </g>
);

export const A2: React.FC<ShotProps> = ({ t }) => {
  const hit = clamp((t - 24) / 3);
  const s = 2.6;
  const p = { x: 300, y: 1150, scale: s, yaw: 0.72, look: 0.8, tilt: 10, armR: { a: 84, b: -20 }, armL: { a: 70, b: -20 }, ...faceAt(t, [[0, 'neutral'], [24, 'tired']]) };
  const h = headAt(p);
  return (
    <g transform={`translate(0 ${t >= 24 && t < 32 ? Math.sin(t * 3) * 8 : 0})`}>
      <Jungle t={t + 40} id="a2" y={900} />
      <rect x={-100} y={880} width={1300} height={1100} fill="#6A3A26" />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Wheel x={830} y={1470} r={290} spin={t * 60} mud />
      <MudFront y={1600} t={t} />
      <Clods x={670} y={1490} t={t} pow={1.5} n={36} />
      {t >= 24 ? (
        <g>
          <Splat x={h.x + 40} y={h.y} s={2.1} k={backOut(hit)} />
          <Splat x={h.x - 90} y={h.y + 130} s={1.3} k={hit} />
          <circle cx={h.x + 30} cy={h.y - 26} r={22} fill="#F4EEDC" /><circle cx={h.x + 34} cy={h.y - 24} r={8} fill={INK} />
          <circle cx={h.x + 104} cy={h.y - 26} r={22} fill="#F4EEDC" /><circle cx={h.x + 108} cy={h.y - 24} r={8} fill={INK} />
        </g>
      ) : null}
    </g>
  );
};

// ============================================================ B. THE SIZE OF IT
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1.5], [len, 0.95]]);
  return (
    <g>
      <g transform={vcam(540, 1100, z)}>
        <CanopySea t={t} />
        <path d="M 420 -700 Q 620 -100 500 400 T 560 1100 T 480 1900 T 600 2800" stroke="#8A4A2E" strokeWidth={13} fill="none" />
        <g transform="translate(556 1090)"><rect x={-9} y={-15} width={18} height={30} rx={4} fill="#E8B52E" stroke={INK} strokeWidth={3} /><Glow x={0} y={-30} r={60} o={0.8} /></g>
        <ellipse cx={200} cy={700} rx={500} ry={120} fill="#F4E4D0" opacity={0.1} /><ellipse cx={860} cy={1500} rx={520} ry={130} fill="#F4E4D0" opacity={0.12} />
      </g>
      <rect width={1080} height={1920} fill="#F07A3C" opacity={0.1} />
      <Say y={560} text="പച്ച നരകം" size={150} color="#A8F07A" t={t - 8} />
    </g>
  );
};

export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.round(clamp((t - 4) / 50) * 140);
  const tiles: React.ReactNode[] = [];
  let k = 0;
  for (let r = 0; r < 11; r++) for (let c = 0; c < 21; c++) {
    const on = rnd(3, r * 21 + c) * 150 < n + 8;
    if (on) tiles.push(<path key={k} d={KERALA_PATH} transform={`translate(${74 + c * 22 + (r % 2) * 11} ${92 + r * 31}) scale(0.03)`} fill="#FFD86A" stroke="#1E4A33" strokeWidth={22} />);
    k++;
  }
  return (
    <g>
      <MapBg id="b2" />
      <g transform={`translate(540 960) scale(${kf(t, [[0, 1.66], [len, 1.76]])}) translate(-315 -310)`}>
        <path d={SA_PATH} fill="#5E5A48" stroke="#A8A28A" strokeWidth={3} strokeLinejoin="round" />
        <clipPath id="b2f"><path d={FOREST_PATH} /></clipPath>
        <path d={FOREST_PATH} fill="#1E6A3E" />
        <g clipPath="url(#b2f)">{tiles}</g>
        <path d={FOREST_PATH} fill="none" stroke="#7FE08A" strokeWidth={3} />
      </g>
      <Say y={380} text={`${n}`} size={210} color="#FFD86A" t={t} />
      <Say y={520} text="കേരളം" size={110} t={t} />
      <Say y={1560} text="ആമസോൺ: 55 ലക്ഷം ച.കി.മീ" size={58} color="#BFEFC8" t={t - 16} />
    </g>
  );
};

// ============================================================ C. THE ROAD
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, -300], [len, 860]]);
  const p = { x: 100, y: -208, scale: 0.54, yaw: 0.72, look: 0.8, armR: { a: 66, b: -30 }, armL: { a: 60, b: -28 }, ...faceAt(t, [[0, 'happy']]) };
  const mo = { x: -50, y: -208, scale: 0.54, yaw: -0.3, look: -0.8, armL: { a: 150 + Math.sin(t / 3) * 16, b: -20 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g>
      <Sky id="c1" mode="dusk" y0={0} y1={1160} />
      <Glow x={760} y={920} r={520} o={0.7} />
      <Water t={t} y={1060} />
      {Array.from({ length: 13 }).map((_, i) => (
        <g key={i}>
          <rect x={-40 + i * 92} y={1070 - 90 - rnd(4, i) * 240} width={82} height={90 + rnd(4, i) * 240} fill={i % 2 ? '#3A2A52' : '#2E2346'} />
          {Array.from({ length: 6 }).map((__, j) => <rect key={j} x={-26 + i * 92 + (j % 2) * 34} y={1050 - Math.floor(j / 2) * 44 - rnd(5, i) * 60} width={18} height={20} fill="#FFC870" opacity={rnd(6, i * 6 + j) > 0.4 ? 0.9 : 0.15} />)}
        </g>
      ))}
      <Canopy y={1230} seed={41} c="#1C3226" hi="#D98A4A" r={90} h={40} n={20} />
      <Mud y={1250} />
      <Sign x={250} y={1000} s={1} top="മനാസ്" sub="കി.മീ 0" />
      <Auto x={x} y={1560} s={1.05} spin={t * 30} lamp>
        <Fig look={MO} pose={mo} rimId="rimL" />
        <Fig look={PIP} pose={p} rimId="rimR" />
      </Auto>
      <TripChip km={0} t={t} />
    </g>
  );
};

export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  const s = 1.05 * (1 - k) ** 1.4 + 0.16;
  const y = 1640 - (1640 - 860) * (1 - (1 - k) ** 1.6);
  return (
    <g>
      <Sky id="c2" mode="dusk" y0={0} y1={860} />
      <Glow x={540} y={800} r={760} o={0.95} />
      <circle cx={540} cy={790} r={84} fill="#FFD9A0" />
      {/* walls of forest, closing to the vanishing point */}
      {[[-1, '#16301F'], [1, '#132A1C']].map(([d, c], i) => (
        <g key={i}>
          {Array.from({ length: 13 }).map((_, j) => {
            const q = j / 12;
            const x = 540 + (d as number) * (60 + q ** 1.5 * 640);
            const r = 34 + q * q * 240;
            return <circle key={j} cx={x} cy={850 - r * 1.6 + q * 300} r={r} fill={c as string} />;
          })}
          <path d={`M 540 860 L ${540 + (d as number) * 1100} 2000 L ${540 + (d as number) * 1100} 200 Z`} fill={c as string} opacity={0.2} />
        </g>
      ))}
      <path d="M 520 850 L 560 850 L 1160 1920 L -80 1920 Z" fill="#7A4630" />
      <path d="M 540 860 V 1920" stroke="#E4B078" strokeWidth={10} strokeDasharray="60 70" strokeDashoffset={-t * 16} opacity={0.5} />
      <AutoBack x={540} y={y} s={s} t={t} />
      <TripChip km={kf(t, [[0, 2], [len, 60]])} t={99} />
      <Say y={570} text="885 കി.മീ" size={150} color="#FFC84A" t={t - 12} />
    </g>
  );
};

export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const down = clamp((t - 8) / 66);
  const up = clamp((t - 86) / 34);
  const k = (down - up * 0.5);
  const [ax, ay] = keralaAt(k);
  const trail: string[] = [];
  for (let u = 0; u <= down + 0.001; u += 0.04) { const [a, b] = keralaAt(u); trail.push(`${a} ${b}`); }
  const X = (x: number) => 300 + x * 1.5;
  const Y = (y: number) => 440 + y * 1.14;
  return (
    <g>
      <MapBg id="c3" a="#0B1830" b="#0F2A3E" />
      <g transform="translate(300 440) scale(1.5 1.14)">
        <path d={KERALA_PATH} fill="#2F7A4A" stroke="#BFEFC8" strokeWidth={3} strokeLinejoin="round" />
        <path d={`M ${trail.join(' L ')}`} stroke="#FFC84A" strokeWidth={5} fill="none" strokeDasharray="14 10" />
      </g>
      <circle cx={X(45)} cy={Y(14)} r={15} fill="#F6EFE3" /><circle cx={X(245)} cy={Y(982)} r={15} fill="#F6EFE3" />
      <text x={X(45) + 34} y={Y(14) - 24} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3" stroke="#120E22" strokeWidth={7} paintOrder="stroke">കാസർഗോഡ്</text>
      <text x={X(245) - 34} y={Y(982) + 74} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3" stroke="#120E22" strokeWidth={7} paintOrder="stroke">തിരുവനന്തപുരം</text>
      <g transform={`translate(${X(ax)} ${Y(ay)}) scale(0.26)`}>
        <Auto x={0} y={60} s={1} dir={up > 0 ? -1 : 1} spin={t * 30} lamp={false} />
      </g>
      <Say y={330} text="580 + 305 = 885" size={84} color="#FFC84A" t={t - 90} />
      <Say y={330} text="ഏകദേശം 580 കി.മീ" size={84} color="#FFC84A" t={t > 88 ? -1 : t - 30} />
    </g>
  );
};

// ============================================================ D. THE MUD AND THE RAIN
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const b = Math.abs(Math.sin(t / 5)) * 34;
  const rot = Math.sin(t / 4) * 5;
  const tea = (t % 26) / 26;
  const p = { x: 100, y: -208, scale: 0.54, yaw: 0.72, look: 0.8, armR: { a: 66, b: -30 }, armL: { a: 60, b: -28 }, ...faceAt(t, [[0, 'worried']]) };
  const mo = { x: -50, y: -208, scale: 0.54, yaw: 0.5, look: 0.2, armR: { a: 74, b: -92 }, armL: { a: 40, b: -40 }, ...faceAt(t, [[0, 'shock']]) };
  const h = handAt(mo, 'R');
  return (
    <g>
      <g transform={vcam(540, 1120, kf(t, [[0, 1.08], [len, 1.16]]))}>
        <Jungle t={t} id="d1" y={1140} pan={-t * 14} />
        <Mud y={1130} scroll={-t * 34} />
        <Auto x={520} y={1480 - b} s={1.2} rot={rot} spin={t * 40} mud={0.55}>
          <Fig look={MO} pose={mo} rimId="rimR" />
          <Fig look={PIP} pose={p} rimId="rimR" />
          <TeaGlass x={h.x + 4} y={h.y + 18} s={0.62} fill={0.2} t={t} />
          <ellipse cx={h.x + 8} cy={h.y - 40 - tea * 90} rx={18} ry={26} fill="#B8783C" opacity={1 - tea * 0.4} />
          <circle cx={h.x + 40} cy={h.y - 90 - tea * 80} r={9} fill="#B8783C" />
        </Auto>
        <Clods x={380} y={1460} t={t} pow={1.1} n={26} />
        <MudFront y={1490} t={t} />
      </g>
      <TripChip km={kf(t, [[0, 240], [len, 300]])} t={99} />
      <Say y={560} text="400 കി.മീ ചെളി" size={106} color="#FFB07A" t={t - 12} />
    </g>
  );
};

export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const rot = Math.sin(t / 11) * 4;
  const swing = Math.sin(t / 5);
  const by = 1450 + Math.sin(t / 9) * 12;
  const mo = { x: -70, y: -398, scale: 0.72, yaw: -0.6, look: -0.5, tilt: -12, legL: { a: 78, b: 70 }, legR: { a: 84, b: 76 }, armL: { a: 62 + swing * 18, b: -14 }, armR: { a: 48 + swing * 18, b: -26 }, ...faceAt(t, [[0, 'tired']]) };
  const pipP = { x: 100, y: -208, scale: 0.54, yaw: 0.5, look: 0.3, armR: { a: 66, b: -30 }, armL: { a: 60, b: -28 }, ...faceAt(t, [[0, 'worried']]) };
  const h = handAt(mo, 'L');
  return (
    <g>
      <Jungle t={t} id="d2" y={1050} mode="storm" />
      <Bolt x={320} y={0} t={t} t0={1} h={840} />
      <Water t={t} y={1030} muddy rough={0.7} />
      <Auto x={590} y={by} s={1.08} rot={rot} lamp>
        <Fig look={PIP} pose={pipP} rimId="rimR" />
      </Auto>
      {/* the flood has him up on the roof; his paddle is a road sign */}
      <g transform={`translate(590 ${by}) rotate(${rot}) scale(1.08)`}>
        <g transform={`translate(${h.x} ${h.y}) rotate(${26 + swing * 16})`}>
          <rect x={-8} y={-40} width={16} height={420} fill="#6A5A48" stroke={INK} strokeWidth={3} />
          <rect x={-74} y={350} width={148} height={104} rx={8} fill="#1E5A3A" stroke="#F2EEE2" strokeWidth={5} />
          <text y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#F6EFE3">319</text>
        </g>
        <Fig look={MO} pose={mo} rimId="rimL" />
      </g>
      <rect x={-20} y={1440} width={1120} height={520} fill="#3E3428" opacity={0.86} />
      <Water t={t + 9} y={1440} muddy night rough={0.5} />
      <Rain t={t} o={0.72} n={220} />
      <TripChip km={kf(t, [[0, 305], [len, 310]])} t={99} />
      <Say y={560} text="6 മാസം: വഴിയില്ല" size={100} color="#9CD4FF" t={t - 18} />
    </g>
  );
};

// ============================================================ E. THE RIVER
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const lunge = easeOut(clamp((t - 12) / 8));
  const m = { x: 395, y: -44, scale: 0.95, yaw: 0.75, look: 0.5, armL: { a: 24, b: -10 }, armR: { a: 34, b: -14 }, legL: { a: 72, b: -72 }, legR: { a: 62, b: -66 }, ...faceAt(t, [[0, 'cool']]) };
  const p = { x: 110 + lunge * 50, y: ground(0, 1.05), scale: 1.05, yaw: 0.8, look: 0.7, tilt: 10 + lunge * 22, armR: { a: 40 + lunge * 56, b: -6 }, armL: { a: 30 + lunge * 50, b: -6 }, ...faceAt(t, [[0, 'neutral'], [12, 'shock']]) };
  return (
    <g>
      <g transform={vcam(540, 1160, kf(t, [[0, 1.04], [len, 1.12]]))}>
        <Jungle t={t + 90} id="e1" y={1030} sun={[300, 700]} />
        <Water t={t} y={1040} />
        <Glow x={300} y={1060} r={340} o={0.6} />
        <Raft x={430} y={1430} s={1.02} t={t} over={<Fig look={MO} pose={m} rimId="rimL" />}>
          <Auto x={-225} y={2} s={0.82} spin={0} mud={0.7} lamp={false} />
          <Fig look={PIP} pose={p} rimId="rimR" />
        </Raft>
        <Water t={t + 6} y={1490} />
      </g>
      <TripChip km={kf(t, [[0, 372], [len, 372]])} t={99} />
    </g>
  );
};

export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp(t / 40));
  const head = 1640 - up * 690;
  const zap = t >= 40;
  return (
    <g>
      <rect x={-50} y={-50} width={1180} height={2020} fill="#0B2A30" />
      <rect x={-50} y={-50} width={1180} height={440} fill="#E08A58" />
      <Water t={t} y={380} />
      <rect x={-50} y={410} width={1180} height={1540} fill="#0E3640" />
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${-40 + i * 220} 420 L ${60 + i * 220} 1500 L ${150 + i * 220} 1500 L ${60 + i * 220} 420 Z`} fill="#6FD0E0" opacity={0.05} />)}
      {/* weed on the bed */}
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${i * 76} 1960 Q ${i * 76 + Math.sin(t / 12 + i) * 40} 1760 ${i * 76 + Math.sin(t / 9 + i) * 30} ${1660 + rnd(2, i) * 100}`} stroke="#123C2C" strokeWidth={22} fill="none" strokeLinecap="round" />)}
      {/* Mo's foot, in from the top */}
      <g transform={`translate(600 ${Math.sin(t / 8) * 10})`}>
        <path d="M -30 -40 L -30 620 M 30 -40 L 30 620" stroke="#3C4A34" strokeWidth={0} />
        <rect x={-46} y={-40} width={92} height={560} fill="#4A5A3C" stroke={INK} strokeWidth={6} />
        <path d="M -46 520 h 92 v 60 Q 46 650 150 660 Q 180 700 130 716 L -46 716 Z" fill="#A9775A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>
      <Eel x={500} y0={2120} y1={head} t={t} w={104} amp={150} />
      {zap ? (
        <g>
          <Zap x1={500} y1={head - 60} x2={640} y2={700} t={t} seed={3} w={9} />
          <Zap x1={450} y1={head + 40} x2={160} y2={1120} t={t} seed={8} />
          <Zap x1={560} y1={head + 40} x2={960} y2={1180} t={t} seed={13} />
          <Glow x={520} y={head} r={520} kind="cool" o={0.75} />
        </g>
      ) : null}
      <Say y={1420} text="860 വോൾട്ട്" size={150} color="#BFF4FF" t={t - 26} />
    </g>
  );
};

export const E3: React.FC<ShotProps> = ({ t }) => {
  const burnt = t >= 78;
  const pct = clamp((t - 20) / 44);
  const m = { x: 330, y: ground(1400, 1.5), scale: 1.5, yaw: 0.55, look: 0.5, armR: { a: 74, b: -30 }, armL: { a: 12, b: -6 }, legL: { a: 8, b: 6 }, legR: { a: -6, b: 6 }, ...faceAt(t, [[0, 'happy'], [78, 'dizzy']]) };
  const hand = handAt(m, 'R');
  const hd = headAt(m);
  return (
    <g>
      <Jungle t={t + 90} id="e3" y={1040} sun={[820, 760]} />
      <Water t={t} y={1050} />
      <rect x={-60} y={1400} width={1220} height={60} fill="#6A4A30" stroke={INK} strokeWidth={6} />
      <Fig look={MO} pose={m} rimId="rimR" />
      <Phone x={hand.x + 30} y={hand.y - 30} s={1.3} pct={pct} rot={8} />
      <path d={`M ${hand.x + 30} ${hand.y + 82} Q ${hand.x + 180} ${hand.y + 300} 760 1250`} stroke="#E8E2D4" strokeWidth={8} fill="none" />
      <Eel x={800} y0={1760} y1={1160} t={t} w={110} amp={60} mood="cross" />
      <Water t={t + 7} y={1500} />
      {t > 20 && t < 78 ? <Zap x1={hand.x + 120} y1={hand.y + 200} x2={760} y2={1250} t={t} seed={5} w={5} /> : null}
      {burnt ? (
        <g>
          <Zap x1={hd.x} y1={hd.y - 130} x2={760} y2={1250} t={t} seed={9} w={9} />
          {[0, 1, 2].map((i) => <circle key={i} cx={hd.x + Math.sin(t / 5 + i) * 26} cy={hd.y - 150 - ((t * 5 + i * 40) % 130)} r={22 + i * 9} fill="#6A6470" opacity={0.6} />)}
        </g>
      ) : null}
      {/* the two numbers */}
      <g transform="translate(90 430)">
        <text fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3" stroke="#120E22" strokeWidth={7} paintOrder="stroke">വീട്ടിലെ കറന്റ്</text>
        <rect y={24} width={900 * (230 / 860) * clamp(t / 12)} height={64} rx={12} fill="#FFC84A" />
        <text x={270} y={76} fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFC84A" stroke="#120E22" strokeWidth={7} paintOrder="stroke">230 V</text>
        <text y={176} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3" stroke="#120E22" strokeWidth={7} paintOrder="stroke">മീൻ</text>
        <rect y={200} width={900 * clamp((t - 6) / 16)} height={64} rx={12} fill="#6FE0FF" />
        <text x={720} y={252} fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#0E2A30">860 V</text>
      </g>
    </g>
  );
};

// ============================================================ F. THE RIVER IN THE SKY
export const F1: React.FC<ShotProps> = ({ t, len }) => {
  const k = kf(t, [[0, 0], [len, 1]]);
  return (
    <g>
      <g transform={vcam(540, 960, kf(t, [[0, 1.1], [len, 1]]))}>
      <Sky id="f1" mode="dusk" y0={-300} y1={1300} />
      <SkyRiver y={520 - k * 30} t={t} h={210} amp={60} o={clamp(t / 16)} />
      {/* trunks seen from the ground, closing overhead */}
      {[[-60, 270, 170], [180, 390, 90], [1140, 810, 170], [900, 690, 90]].map(([b, top, w], i) => (
        <path key={i} d={`M ${b - w} 1980 L ${top - w * 0.14} -80 L ${top + w * 0.14} -80 L ${b + w} 1980 Z`} fill={i % 2 ? '#1C3226' : '#0E1E18'} />
      ))}
      <circle cx={80} cy={-20} r={330} fill="#0C1C16" /><circle cx={1010} cy={-30} r={340} fill="#0C1C16" /><circle cx={540} cy={-160} r={300} fill="#12281E" />
      <Vine x={340} y={0} l={420} t={t} seed={3} /><Vine x={760} y={0} l={330} t={t + 40} seed={7} />
      {/* the two of them, looking up from the auto */}
      <path d="M -40 1920 L -40 1600 Q 540 1490 1120 1600 L 1120 1920 Z" fill="#E8B52E" stroke={INK} strokeWidth={8} />
      <Fig look={PIP} pose={{ x: 360, y: 1680, scale: 1.8, yaw: 0.2, look: 0.1, headTilt: -14, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" />
      <Fig look={MO} pose={{ x: 720, y: 1680, scale: 1.8, yaw: -0.2, look: -0.1, headTilt: 14, armR: { a: kf(t, [[0, 12], [22, 12], [32, 158]]), b: -8 }, handR: 'point', ...faceAt(t, [[0, 'shock']]) }} rimId="rimL" />
      <path d="M -40 1800 Q 540 1720 1120 1800 L 1120 1990 L -40 1990 Z" fill="#1C1C24" />
      </g>
      <TripChip km={420} t={99} />
    </g>
  );
};

export const F2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Sky id="f2" mode="dusk" y0={0} y1={1500} />
    <Glow x={820} y={1200} r={620} o={0.9} />
    <SkyRiver y={640} t={t + 74} h={170} amp={60} />
    <Vapour y0={1320} y1={760} t={t} n={120} />
    <Canopy y={1420} seed={51} c="#1E3F2C" hi="#FFB060" r={120} h={110} n={16} />
    <Canopy y={1620} seed={52} c="#142E20" hi="#8FB04E" r={120} h={70} n={14} />
    <Say y={420} text="2000 കോടി ടൺ" size={104} color="#BFEFFF" t={t - 32} />
    <Say y={540} text="ഒരു ദിവസം" size={72} t={t - 32} />
  </g>
);

export const F2b: React.FC<ShotProps> = ({ t }) => {
  const s = 4.2;
  const p = { x: 360, y: 1800, scale: s, yaw: 0.45, look: 0.7, headTilt: -10, armR: { a: 62, b: -66 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'neutral'], [18, 'shock']]) };
  const h = handAt(p, 'R');
  const gy = h.y + 66;
  return (
    <g>
      <g transform={vcam(620, 1100, kf(t, [[0, 1], [73, 1.08]]))}>
      <Jungle t={t + 60} id="f2b" y={1300} sun={[820, 860]} />
      <rect x={-20} y={0} width={1120} height={1920} fill="#14281F" opacity={0.25} />
      <Fig look={MO} pose={p} rimId="rimR" />
      <TeaGlass x={h.x + 10} y={gy} s={2.6} fill={kf(t, [[0, 0.85], [60, 0.1]])} t={t} />
      {Array.from({ length: 9 }).map((_, i) => {
        const k = ((t / 40 + i / 9) % 1);
        return <ellipse key={i} cx={h.x + 10 + Math.sin(k * 6 + i) * 36} cy={gy - 130 - k * 700} rx={16 - k * 5} ry={22 - k * 6} fill="#B8783C" stroke={INK} strokeWidth={3} opacity={t > 6 ? 1 : 0} />;
      })}
      </g>
    </g>
  );
};

export const F3: React.FC<ShotProps> = ({ t }) => {
  const m = { x: 470, y: ground(1270, 1.3), scale: 1.3, yaw: 0.45, look: 0.5, armR: { a: 40, b: 10 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'cool']]) };
  const hnd = handAt(m, 'R');
  return (
    <g>
      <Sky id="f3" mode="dusk" y0={0} y1={1240} />
      <SkyRiver y={520} t={t + 150} h={180} amp={46} />
      <Vapour y0={1400} y1={700} t={t} n={70} />
      <Canopy y={1120} seed={61} c="#1E3A2C" hi="#D98A4A" r={80} h={50} n={20} />
      <rect x={-20} y={1270} width={1120} height={100} fill="#4E3020" />
      <Water t={t} y={1340} muddy />
      <Fig look={MO} pose={m} rimId="rimR" />
      <Umbrella x={hnd.x + 10} y={hnd.y + 130} s={1.25} rot={180} />
      <Vapour y0={1540} y1={hnd.y + 330} t={t} n={46} seed={17} x0={hnd.x - 220} w={460} r={13} />
      <Say y={470} text="2000" size={130} color="#E4F8FF" t={t - 4} />
      <Say y={1640} text="1700" size={130} color="#E8C888" t={t - 24} />
      <text x={540} y={1712} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={46} fill="#F6EFE3" stroke="#120E22" strokeWidth={6} paintOrder="stroke">കോടി ടൺ / ദിവസം</text>
    </g>
  );
};

// ============================================================ G. THE DESERT THAT FEEDS IT
export const G1: React.FC<ShotProps> = ({ t }) => {
  const a = -82 + 76 * (0.5 - 0.5 * Math.cos(clamp((t - 12) / 40) * Math.PI)) * 2;
  const r = (d: number) => [540 + Math.sin((d * Math.PI) / 180) * 1100, 1520 - Math.cos((d * Math.PI) / 180) * 1100];
  const [ax, ay] = r(-82);
  const [bx, by] = r(a);
  return (
    <g>
      <Jungle t={t + 60} id="g1" y={1500} sun={[300, 900]} />
      <rect x={-20} y={0} width={1120} height={1920} fill="#0E1810" opacity={0.3} />
      {/* behind the glass */}
      <Fig look={PIP} pose={{ x: 320, y: 1400, scale: 2.05, yaw: 0.1, look: 0.2, armR: { a: 22, b: -12 }, ...faceAt(t, [[0, 'neutral'], [50, 'shock']]) }} rimId="rimR" />
      <Fig look={MO} pose={{ x: 760, y: 1400, scale: 2.05, yaw: -0.1, look: -0.2, ...faceAt(t, [[0, 'tired'], [50, 'shock']]) }} rimId="rimL" />
      {/* the sand on the glass, swept off by the wiper */}
      <mask id="g1m">
        <rect x={-40} y={-40} width={1160} height={2000} fill="#fff" />
        <path d={`M 540 1520 L ${ax} ${ay} A 1100 1100 0 0 1 ${bx} ${by} Z`} fill="#000" />
      </mask>
      <g mask="url(#g1m)">
        <rect x={-20} y={300} width={1120} height={1320} fill="#E8B878" />
        {Array.from({ length: 90 }).map((_, i) => <circle key={i} cx={rnd(3, i) * 1080} cy={320 + rnd(4, i) * 1260} r={8 + rnd(5, i) * 20} fill={i % 2 ? '#D49C5C' : '#F2CE94'} opacity={0.6} />)}
      </g>
      <path d={`M 540 1520 L ${bx} ${by}`} stroke="#141418" strokeWidth={22} strokeLinecap="round" />
      {/* the auto's frame */}
      <rect x={-40} y={-20} width={1160} height={330} fill="#E8B52E" stroke={INK} strokeWidth={8} />
      <path d="M -40 1560 Q 540 1490 1120 1560 L 1120 1980 L -40 1980 Z" fill="#1C1C24" stroke={INK} strokeWidth={8} />
      <circle cx={540} cy={1520} r={30} fill="#3A3640" />
      <Grains x0={-20} y0={280} w={1120} h={1300} t={t} n={110} vx={-3} vy={7} />
      <TripChip km={455} t={99} y={190} />
    </g>
  );
};

export const G2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Sky id="g2" mode="dusk" y0={0} y1={1160} />
    <Glow x={340} y={980} r={640} o={0.9} />
    <circle cx={340} cy={960} r={100} fill="#FFD9A0" />
    <Dune y={1080} c="#C8703A" amp={60} ph={0.6} />
    <Dune y={1250} c="#A85430" amp={90} ph={2.1} />
    <Grains x0={-40} y0={820} w={1160} h={560} t={t} n={140} vx={-16} vy={-3} c="#F4CE8E" />
    <Camel x={kf(t, [[0, 700], [len, 620]])} y={1270} s={1.05} dir={-1} t={t} />
    <Dune y={1500} c="#7A3626" amp={70} ph={3.6} />
    <Say y={520} text="സഹാറ" size={190} color="#FFC84A" t={t - 3} />
  </g>
);

export const G3: React.FC<ShotProps> = ({ t, len }) => {
  const P = (u: number): [number, number] => {
    const [x0, y0, x1, y1, x2, y2] = [690, 340, 380, 470, 240, 1010];
    return [(1 - u) ** 2 * x0 + 2 * u * (1 - u) * x1 + u * u * x2, (1 - u) ** 2 * y0 + 2 * u * (1 - u) * y1 + u * u * y2];
  };
  const reach = clamp(t / 34);
  return (
    <g>
      <MapBg id="g3" a="#0A1A38" b="#123A58" />
      <g transform={`translate(-62 40) scale(${kf(t, [[0, 0.9], [len, 0.92]])})`}>
        <path d={AFRICA_PATH} fill="#5E5A48" stroke="#A8A28A" strokeWidth={3} strokeLinejoin="round" />
        <path d="M 620 340 Q 780 230 1060 300 L 1090 470 Q 880 500 700 500 Z" fill="#D8A25A" />
      </g>
      <g transform="translate(-30 800) scale(1)">
        <path d={SA_PATH} fill="#5E5A48" stroke="#A8A28A" strokeWidth={3} strokeLinejoin="round" />
        <path d={FOREST_PATH} fill="#1E6A3E" />
      </g>
      <Glow x={290} y={1100} r={300} o={t > 30 ? 0.5 : 0} />
      {Array.from({ length: 90 }).map((_, i) => {
        const u = ((t * 0.016 + i / 90) % 1) * reach;
        const [x, y] = P(u);
        return <circle key={i} cx={x + (rnd(3, i) - 0.5) * 120} cy={y + (rnd(4, i) - 0.5) * 120} r={5 + rnd(5, i) * 9} fill="#F2C27A" opacity={0.85} />;
      })}
      <Say y={250} x={690} text="സഹാറ" size={70} t={t} />
      <Say y={1090} x={250} text="ആമസോൺ" size={60} t={t - 26} />
      <Say y={1330} x={750} text="2.75 കോടി ടൺ" size={84} color="#FFC84A" t={t - 44} />
      <Say y={1425} x={750} text="ഓരോ വർഷവും" size={64} t={t - 48} />
    </g>
  );
};

export const G4: React.FC<ShotProps> = ({ t }) => {
  const sneeze = t >= 16;
  const k = clamp((t - 16) / 6);
  const s = 2.2;
  const p = { x: 520, y: 1400, scale: s, yaw: 0.3, look: 0.4, headTilt: sneeze ? 8 : -6, ...faceAt(t, [[0, 'tired'], [16, 'shock']]) };
  const h = headAt(p);
  return (
    <g>
      <Jungle t={t + 80} id="g4" y={1230} sun={[820, 840]} />
      <Mud y={1220} />
      <Camel x={kf(t, [[0, 960], [34, 780]])} y={1250} s={0.55} dir={-1} t={t} c="#C89A6A" />
      <Fig look={MO} pose={p} rimId="rimR" />
      {/* the heap on him, gone with the sneeze */}
      <g opacity={1 - k} transform={`translate(0 ${-k * 60})`}>
        <path d={`M ${h.x - 280} ${h.y + 60} Q ${h.x} ${h.y - 420} ${h.x + 280} ${h.y + 60} Z`} fill="#E8B878" stroke="#C49458" strokeWidth={5} />
        <path d="M 120 1960 Q 520 1000 960 1960 Z" fill="#E8B878" />
      </g>
      {sneeze ? <Grains x0={-40} y0={400} w={1160} h={1400} t={t} n={180} vx={-30 * (1 - k * 0.5)} vy={-10} r={7} /> : null}
    </g>
  );
};

// ============================================================ H. BACK WHERE WE STARTED
export const H1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={vcam(540, 1160, kf(t, [[0, 0.98], [len, 1.1]]))}>
      <Stuck t={t + 200} id="h1" night />
      <Eyes x={920} y={1120} s={0.8} t={t} seed={1} />
      <Eyes x={140} y={1060} s={0.6} t={t} seed={3} />
      <Eyes x={510} y={1000} s={0.5} t={t} seed={5} />
      <Eyes x={740} y={1030} s={0.42} t={t} seed={7} />
    </g>
    <TripChip km={485} t={99} />
    <Say y={560} text="400 കി.മീ ബാക്കി" size={102} color="#FFC84A" t={t - 8} />
  </g>
);

export const H2: React.FC<ShotProps> = ({ t, len }) => {
  const fare = 7282 + Math.floor(t / 4) * 15;
  return (
    <g>
      <rect x={-20} y={-20} width={1120} height={1960} fill="#0C0A10" />
      <Glow x={540} y={920} r={760} kind="red" o={0.4} />
      <g transform={vcam(540, 900, kf(t, [[0, 1], [len, 1.14]]))}>
      <rect x={140} y={640} width={800} height={520} rx={36} fill="#23232C" stroke="#4A4656" strokeWidth={8} />
      <rect x={190} y={700} width={700} height={250} rx={14} fill="#100406" stroke={INK} strokeWidth={6} />
      <text x={540} y={880} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill="#FF3A2E">₹{fare.toLocaleString('en-IN')}</text>
      <text x={540} y={1050} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={62} fill="#CFC6B4">മീറ്റർ ഓടുന്നുണ്ട്</text>
      <circle cx={240} cy={1100} r={16} fill={Math.floor(t / 8) % 2 ? '#FF3A2E' : '#4A1612'} />
      </g>
    </g>
  );
};

export const H3: React.FC<ShotProps> = ({ t, len }) => {
  const s = 4.6;
  const glance = kf(t, [[0, 0], [30, 0], [37, 1], [52, 1], [59, 0]]);
  const p = { x: 520, y: 1800, scale: s, yaw: 0.05 + glance * 0.34, look: glance * 0.8, headTilt: glance * 5, armR: { a: 12, b: -6 }, armL: { a: 12, b: -6 }, ...faceAt(t, [[0, 'tired'], [32, 'worried'], [58, 'tired']]) };
  const h = headAt(p);
  return (
    <g>
      <g transform={vcam(540, 1100, kf(t, [[0, 1], [len, 1.1]]))}>
      <Jungle t={t + 240} id="h3" y={1300} mode="night" />
      <Eyes x={kf(t, [[0, 900], [len, 860]])} y={760} s={kf(t, [[0, 0.8], [len, 1.5]])} t={t} seed={2} />
      <Eyes x={150} y={840} s={0.7} t={t} seed={6} />
      <Glow x={460} y={880} r={560} o={0.5} />
      <Fig look={PIP} pose={p} rimId="rimR" />
      <Splat x={h.x - 130} y={h.y + 40} s={1.3} />
      <Splat x={h.x + 150} y={h.y + 130} s={0.8} />
      </g>
      <Say y={420} text="ഇറങ്ങി തള്ളുമോ?" size={104} color="#FFC84A" t={t - 26} />
    </g>
  );
};

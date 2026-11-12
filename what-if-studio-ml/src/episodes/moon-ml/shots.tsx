import React from 'react';
import { Hero, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, rnd, camT, LOOKS, LEG_LEN, Glow, TitleCard, ShotProps, SCH, FONT } from '../../engine';

// "What if the Moon vanished?" - the first 30 seconds of the long cut. Night rooftop, a drawn sea, a wobbling globe.
const PIP = LOOKS.ramu;
const MO = LOOKS.appu;
const FEET = 840;
const hip = (s: number) => FEET - LEG_LEN * s;
export const MOON_TITLE: [string, string] = ['ചന്ദ്രൻ ഒറ്റ രാത്രികൊണ്ട്', 'മറഞ്ഞാലോ?'];

/** The night sky: gradient, stars, the Moon (moon 0..1 shrinks it away), a skyline and a parapet. */
const Night: React.FC<{ t: number; moon?: number; moonX?: number; moonY?: number; lights?: number; id: string }> = ({ t, moon = 1, moonX = 1320, moonY = 300, lights = 1, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#050A1C" />
        <stop offset="0.7" stopColor="#14214A" />
        <stop offset="1" stopColor="#2A2F63" />
      </linearGradient>
      <radialGradient id={`${id}halo`}>
        <stop offset="0" stopColor="#CFE4FF" stopOpacity={0.55} />
        <stop offset="1" stopColor="#CFE4FF" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1600} fill={`url(#${id}sky)`} />
    {Array.from({ length: 90 }).map((_, i) => (
      <circle key={i} cx={-200 + rnd(3, i) * 2300} cy={-100 + rnd(5, i) * 760} r={1.4 + rnd(7, i) * 2.2} fill="#F6EFE3" opacity={0.45 + 0.4 * Math.sin(t / 14 + i)} />
    ))}
    {moon > 0.01 ? (
      <g opacity={clamp(moon * 2)}>
        <circle cx={moonX} cy={moonY} r={520 * moon} fill={`url(#${id}halo)`} />
        <circle cx={moonX} cy={moonY} r={140 * moon} fill="#F4EFDD" />
        {[[-40, -30, 26], [38, 20, 34], [-10, 58, 18], [52, -52, 16]].map(([dx, dy, r], i) => (
          <circle key={i} cx={moonX + dx * moon} cy={moonY + dy * moon} r={r * moon} fill="#D9D2B8" opacity={0.7} />
        ))}
      </g>
    ) : null}
    <g fill="#0A1024">
      {Array.from({ length: 16 }).map((_, i) => {
        const h = 120 + rnd(11, i) * 220;
        return <rect key={i} x={-100 + i * 140} y={720 - h} width={120} height={h + 200} />;
      })}
    </g>
    {Array.from({ length: 16 }).flatMap((_, i) =>
      Array.from({ length: 5 }).map((__, j) => (
        <rect key={`${i}-${j}`} x={-80 + i * 140 + (j % 2) * 48} y={600 - rnd(11, i) * 220 + j * 46} width={22} height={22} fill="#FFD27A" opacity={rnd(2, i * 7 + j) > 0.45 ? 0.85 * lights : 0} />
      ))
    )}
    <rect x={-400} y={FEET} width={2720} height={400} fill="#0D1530" />
    <rect x={-400} y={FEET - 6} width={2720} height={12} fill="#27325E" />
  </g>
);

const stand = (x: number, s: number, yaw: number, look = 0.5) => ({ ...basePose, x, y: hip(s), scale: s, yaw, look, armL: { a: 8, b: 4 }, armR: { a: 8, b: 4 } });
const title = (txt: string, y: number, size: number, color: string, op: number) => (
  <text x={960} y={y} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={size} fill={color} stroke="#02040C" strokeWidth={10} paintOrder="stroke" opacity={op}>
    {txt}
  </text>
);

export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 0.95], [len, 1.05]]))}>
    <Night t={t} id="n1" />
    <Hero look={PIP} pose={{ ...stand(760, 0.55, 0.4, 0.8), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
    <Hero look={MO} pose={{ ...stand(900, 0.55, 0.4, 0.8), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
  </g>
);

export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const sway = Math.sin(t / 20) * 2;
  return (
    <g transform={camT(kf(t, [[0, 780], [len, 840]]), 640, 1.9)}>
      <Night t={t} id="n2" />
      <Hero look={PIP} pose={{ ...stand(700, 0.9, 0.5, 0.8), headTilt: -4 + sway, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...stand(900, 0.9, 0.5, 0.8), headTilt: 4 - sway, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1320, kf(t, [[0, 360], [len, 310]]), kf(t, [[0, 1.8], [len, 2.4]]))}>
    <Night t={t} id="n3" />
    <Glow x={1320} y={300} r={420} kind="cool" o={0.4} />
  </g>
);

export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 600, kf(t, [[0, 2.3], [len, 2.7]]))}>
    <Night t={t} id="n4" moon={1 - easeIn(clamp((t - 6) / 10))} />
    <Hero look={PIP} pose={{ ...stand(700, 0.9, 0.3, 0.9), ...faceAt(t, [[0, 'happy'], [10, 'shock']]) }} rimId="rimR" shadow={0} />
    <Hero look={MO} pose={{ ...stand(900, 0.9, -0.1, 0.9), ...faceAt(t, [[0, 'happy'], [11, 'shock']]) }} rimId="rimR" shadow={0} />
  </g>
);

export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, 420, kf(t, [[0, 1.1], [len, 1.3]]))}>
    <Night t={t} id="n5" moon={0} lights={0.9} />
    <Hero look={PIP} pose={{ ...stand(760, 0.55, 0.4, 0.9), ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0.3} />
    <Hero look={MO} pose={{ ...stand(900, 0.55, 0.4, 0.9), ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0.3} />
    <circle cx={1320} cy={300} r={150} fill="none" stroke="#7E8DA6" strokeWidth={3} strokeDasharray="10 14" opacity={0.5 * clamp(t / 10)} />
  </g>
);

export const S6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Night t={t} id="n6" moon={0} lights={0.9} />
    <rect x={-400} y={-400} width={2720} height={1600} fill="#050A1C" opacity={0.35} />
    <Hero look={PIP} pose={{ ...stand(760, 0.55, 0.4, 0.9), ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0.3} />
    <Hero look={MO} pose={{ ...stand(900, 0.55, 0.4, 0.9), ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0.3} />
    <TitleCard t={t} lines={MOON_TITLE} accent="മറഞ്ഞാലോ" accentT={30} size={96} gap={118} y={230} />
  </g>
);

export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.25]]))}>
    <Night t={t} id="n7" moon={0} lights={kf(t, [[0, 1], [len, 0.15]])} />
    <rect x={-400} y={-400} width={2720} height={1600} fill="#02040C" opacity={kf(t, [[0, 0.1], [len, 0.7]])} />
    {title('ഇരുട്ട്', 300, 110, '#F6EFE3', clamp(t / 8))}
  </g>
);

/** The sea: a wave line whose level lurches (the tide gone wrong), a pier post and a Moon-less sky. */
export const S8: React.FC<ShotProps> = ({ t }) => {
  const lvl = 700 - 130 * Math.sin(t / 9) * clamp(t / 20) - 20 * Math.sin(t / 3);
  const wave = (y: number, ph: number, amp: number) => {
    let d = `M -100 1200 L -100 ${y}`;
    for (let x = -100; x <= 2020; x += 40) d += ` L ${x} ${y + Math.sin(x / 90 + t / 6 + ph) * amp}`;
    return d + ' L 2020 1200 Z';
  };
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1600} fill="#060C22" />
      {Array.from({ length: 60 }).map((_, i) => (
        <circle key={i} cx={rnd(3, i) * 1920} cy={rnd(5, i) * 500} r={1.5 + rnd(7, i) * 2} fill="#F6EFE3" opacity={0.6} />
      ))}
      <rect x={1500} y={380} width={40} height={900} fill="#2A2018" />
      <rect x={1420} y={380} width={200} height={26} fill="#3A2E22" />
      <path d={wave(lvl, 0, 18)} fill="#14407A" opacity={0.95} />
      <path d={wave(lvl + 50, 2, 14)} fill="#0E2E5E" />
      {title('വേലിയേറ്റം തെറ്റുന്നു', 190, 96, '#7FD4FF', clamp(t / 8))}
      <g transform={`translate(260 ${lvl - 60})`} opacity={clamp(t / 10)}>
        <path d="M0 0 L0 -90 M-24 -66 L0 -90 L24 -66" stroke="#FFE27A" strokeWidth={8} fill="none" strokeLinecap="round" transform={`scale(1 ${Math.cos(t / 9) > 0 ? -1 : 1})`} />
      </g>
    </g>
  );
};

/** The globe on its tilted axis; the tilt starts at 23.4 degrees and then wobbles wildly. */
export const S9: React.FC<ShotProps> = ({ t }) => {
  const wob = clamp((t - 10) / 40);
  const tilt = 23.4 + wob * (38 * Math.sin(t / 7) + 20 * Math.sin(t / 3.1));
  const cx = 960, cy = 570, r = 250;
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1600} fill={SCH.ground} />
      <line x1={cx} y1={cy - r - 130} x2={cx} y2={cy + r + 130} stroke={SCH.dim} strokeWidth={2} opacity={0.5} />
      <g transform={`rotate(${tilt} ${cx} ${cy})`}>
        <line x1={cx} y1={cy - r - 110} x2={cx} y2={cy + r + 110} stroke={SCH.live} strokeWidth={6} strokeDasharray="14 12" />
        <circle cx={cx} cy={cy} r={r} fill="#0E1A30" stroke={SCH.line} strokeWidth={5} />
        {[0.35, 0.7].map((k) => (
          <ellipse key={k} cx={cx} cy={cy} rx={r * k} ry={r} fill="none" stroke={SCH.dim} strokeWidth={2.5} />
        ))}
        {[-0.55, 0, 0.55].map((k) => (
          <ellipse key={k} cx={cx} cy={cy + k * r} rx={r * Math.sqrt(1 - k * k)} ry={r * 0.12} fill="none" stroke={k === 0 ? SCH.live : SCH.dim} strokeWidth={k === 0 ? 5 : 2.5} />
        ))}
      </g>
      {title('ഭൂമി ആടുന്നു', 120, 96, '#F6EFE3', clamp(t / 8))}
    </g>
  );
};

export const S10: React.FC<ShotProps> = ({ t }) => {
  const n = Math.round(lerp(0, 23.4, easeOut(clamp(t / 24))) * 10) / 10;
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1600} fill={SCH.ground} />
      <text x={960} y={520} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={300} fill="#FFE27A" stroke="#02040C" strokeWidth={14} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 30px rgba(255,138,61,0.5))' }}>
        {n.toFixed(1)}°
      </text>
      {title('ഭൂമിയുടെ ചരിവ്', 680, 84, '#F6EFE3', clamp((t - 12) / 8))}
      {title('ചന്ദ്രൻ പിടിച്ചുനിർത്തുന്നു', 800, 64, '#7FD4FF', clamp((t - 26) / 8))}
    </g>
  );
};

export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [len, 830]]), 640, kf(t, [[0, 2.2], [len, 2.8]]))}>
    <Night t={t} id="n11" moon={0} lights={0.3} />
    <Hero look={PIP} pose={{ ...stand(720, 0.9, 0.2, 0.2), ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
    <Hero look={MO} pose={{ ...stand(930, 0.9, -0.2, -0.2), ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
  </g>
);

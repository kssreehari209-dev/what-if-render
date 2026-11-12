// test-ml: a 10 s pipeline test. "What if the monsoon skipped June 1?" Ramu waits under an umbrella; Appu helps.
import React from 'react';
import { faceAt, kf, clamp, ShotProps, FONT, Pose, LOOKS } from '../../engine';
import { Fig, Sky, Palm, KHouse, handAt, Drops } from '../fly-ml/kit';
import { ground, vcam, Say } from '../phone-ml/kit';
import { Umbrella } from '../amazon-ml/kit';
import { FactCard, Mug } from './kit';

const RAMU = LOOKS.ramu;
const APPU = LOOKS.appu;
type P = Partial<Pose>;
const at = (x: number, g: number, s: number, extra: P = {}): P => ({ x, y: ground(g, s), scale: s, ...extra });
const push = (t: number, len: number, a: number, b: number) => kf(t, [[0, a], [len, b]]);
/** Idle life on any pose: breathing, a slow weight shift, a small head drift. Seeded so two figures never sync. */
const life = (p: P, t: number, seed = 0, amt = 0.5): P => ({
  ...p,
  squash: (p.squash ?? 0) + Math.sin(t / 9 + seed) * 0.018 * amt,
  tilt: (p.tilt ?? 0) + Math.sin(t / 23 + seed * 2) * 2.2 * amt,
  headTilt: (p.headTilt ?? 0) + Math.sin(t / 17 + seed * 3) * 3 * amt,
  sway: 8,
});

/** The dry yard at dusk: sky, palms, the tiled house, cracked earth from y 1500. */
const Yard: React.FC<{ t: number; id: string; houseX?: number }> = ({ t, id, houseX = 760 }) => (
  <g>
    <Sky id={id} mode="dusk" y0={-300} y1={1500} />
    <Palm x={60} y={1500} s={1.4} t={t} lean={50} />
    <Palm x={1040} y={1500} s={1.2} t={t + 30} lean={-60} />
    <KHouse x={houseX} y={1500} s={1.1} />
    <rect x={-300} y={1490} width={1700} height={800} fill="#B88A5A" />
    {[[120, 1600], [420, 1700], [760, 1640], [300, 1820], [880, 1800]].map(([x, y], i) => (
      <path key={i} d={`M ${x - 90} ${y} l 40 -14 l 30 20 l 46 -18 l 40 16`} stroke="#7A5634" strokeWidth={5} fill="none" />
    ))}
  </g>
);

export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={vcam(540, 1080, push(t, len, 1.04, 1))}>
    <Yard t={t} id="s1" />
    <Fig look={RAMU} pose={life(at(540, 1760, 1.6, {
      yaw: kf(t, [[0, 0.1], [40, -0.1]]), look: kf(t, [[0, 0], [30, -0.4]]),
      headTilt: kf(t, [[0, -8], [16, -20]]),
            ...faceAt(t, [[0, 'worried']]) }), t, 1)} rimId="rimR" />
    <text x={540} y={300} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={12} fill="#FFE27A">WHAT IF...</text>
    <Say y={450} text="ജൂൺ ഒന്നിന്" size={96} color="#6FD0E0" />
    <Say y={590} text="മഴ വന്നില്ലെങ്കിലോ?" size={92} />
  </g>
);

export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const bob = 0;
  const r: P = life(at(420, 1820 - bob, 1.9, { yaw: 0.3, look: kf(t, [[0, 0.2], [30, 0.8]]), headTilt: -10, armR: { a: 150, b: -20 }, ...faceAt(t, [[0, 'happy']]) }), t, 2);
  const h = handAt(r, 'R');
  const m: P = life(at(860, 1840, 1.7, { yaw: -0.5, look: kf(t, [[0, -0.6], [34, -0.9]]), headTilt: kf(t, [[0, 0], [34, 6]]), ...faceAt(t, [[0, 'smug']]) }), t, 5);
  return (
    <g transform={vcam(540, 1100, push(t, len, 1, 1.05))}>
      <Yard t={t} id="s2" houseX={900} />
      <Fig look={APPU} pose={m} rimId="rimL" />
      <Fig look={RAMU} pose={r} rimId="rimR" />
      <Umbrella x={h.x} y={h.y - 120} s={1.5} rot={-6} />
      <FactCard t={t - 4} big="ജൂൺ 1" line="കേരളത്തിൽ മൺസൂൺ എത്തുന്ന ദിവസം" src="ഉറവിടം: IMD" />
    </g>
  );
};

export const S2b: React.FC<ShotProps> = ({ t }) => {
  const tip = clamp((t - 8) / 8);
  const hop = kf(t, [[0, 0], [16, 0], [21, 14], [27, 0]]);
  const r: P = life(at(420, 2050 - hop, 2.6, { yaw: 0.2, look: kf(t, [[0, 0.1], [14, 0.6]]), headTilt: kf(t, [[0, -16], [18, -24], [30, -12]]),
    squash: kf(t, [[0, 0], [14, 0.03], [18, -0.03], [27, 0.02], [31, 0]]),
    armR: { a: 150, b: -20 },     ...faceAt(t, [[0, 'neutral'], [18, 'happy']]) }), t, 3);
  const h = handAt(r, 'R');
  const m: P = life(at(800, 2120, 2.2, { yaw: -0.6, look: -0.5,
    armL: { a: kf(t, [[0, 40], [4, 30], [10, 172], [14, 166]]), b: kf(t, [[0, 60], [10, 6]]) },
    tilt: kf(t, [[0, 0], [4, 4], [12, -6], [24, -3]]), ...faceAt(t, [[0, 'smug']]) }), t, 6);
  const mh = handAt(m, 'L');
  return (
    <g transform={vcam(560, 900, 1)}>
      <Sky id="s2b" mode="dusk" y0={-300} y1={1600} />
      <Palm x={1000} y={1700} s={1.6} t={t} lean={-50} />
      <Fig look={APPU} pose={m} rimId="rimL" />
      <Mug x={mh.x - 30} y={mh.y - 60} rot={-tip * 120} s={1.8} />
      {tip > 0.5 ? <Drops x={mh.x - 180} y={mh.y - 30} t={t} n={22} w={300} /> : null}
      <Fig look={RAMU} pose={r} rimId="rimR" />
      <Umbrella x={h.x} y={h.y - 150} s={2} rot={-4} />
      <FactCard t={99} big="ജൂൺ 1" line="കേരളത്തിൽ മൺസൂൺ എത്തുന്ന ദിവസം" src="ഉറവിടം: IMD" />
    </g>
  );
};

export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const mo3: P = life(at(780, 1700, 1.1, { yaw: -0.3, look: 0.2, headTilt: -14,
    armL: { a: kf(t, [[0, 10], [18, 10], [26, 70]]), b: kf(t, [[18, -8], [26, 80]]) }, armR: { a: kf(t, [[0, 10], [18, 10], [26, 70]]), b: kf(t, [[18, -8], [26, 80]]) },
    ...faceAt(t, [[0, 'worried']]) }), t, 4);
  return (
  <g transform={vcam(540, 1000, push(t, len, 1.1, 1))}>
    <Yard t={t} id="s3" />
    <Fig look={APPU} pose={mo3} rimId="rimL" />
    <Fig look={RAMU} pose={life(at(400, 1720, 1.2, { yaw: kf(t, [[0, 0.2], [30, -0.2]]), look: kf(t, [[0, 0], [30, -0.6]]), headTilt: kf(t, [[0, -8], [12, -22]]),
      armR: { a: kf(t, [[0, 60], [8, 10]]), b: -4 }, squash: kf(t, [[0, 0], [8, 0.05], [14, 0]]), ...faceAt(t, [[0, 'shock']]) }), t, 1)} rimId="rimR" />
    <Umbrella x={600} y={1690} s={0.8} rot={95} />
  </g>
  );
};

export const S3b: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={vcam(540, 1150, push(t, len, 1, 1.08))}>
    <Sky id="s3b" mode="dusk" y0={-300} y1={1900} />
    <Palm x={1020} y={2000} s={1.8} t={t} lean={-60} />
    <Fig look={RAMU} pose={life(at(540, 2500, 3.2, { yaw: 0.05, look: kf(t, [[0, 0], [30, -0.3]]), headTilt: kf(t, [[0, -6], [40, 2]]), ...faceAt(t, [[0, 'shock'], [30, 'worried']]) }), t, 2)} rimId="rimR" />
    <Say y={420} t={t - 2} text="നീ ആദ്യം" size={96} />
    <Say y={560} t={t - 6} text="എന്ത് ചെയ്യും?" size={110} color="#FFE27A" />
    <text x={540} y={700} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={46} fill="#F6EFE3" opacity={clamp((t - 14) / 8)}>കമന്റ് ചെയ്യൂ ↓</text>
  </g>
);

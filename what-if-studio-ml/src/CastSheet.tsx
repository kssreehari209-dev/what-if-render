import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, Pose, LOOKS, CastName, KitDefs, SetDefs, Study, FONT } from './engine';

// The cast sheet: every costume on the one rig, front and three-quarter, over a soft set so contrast is judged in
// place, plus a row of acting poses. Render it after adding or changing a look:
//   npx remotion still src/index.ts Cast out/cast.png

const Label: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#F6EFE3" letterSpacing={2}>
    {text}
  </text>
);
const P = (o: Partial<Pose>): Pose => ({ ...basePose, ...o });
// Only the current cast is shown. The old pip looks and Mo stay in the rig so older episodes still render.
const NAMES: Partial<Record<CastName, string>> = { ramu: 'RAMU (HERO)', appu: 'APPU (FRIEND)', sis: 'SISTER', mom: 'MUM', suit: 'THE SUIT' };

export const CastSheet: React.FC = () => {
  const cast = Object.keys(NAMES) as CastName[];
  const row1 = 215;
  const row2 = 610;
  const row3 = 890;
  const poses: { name: string; p: Partial<Pose> }[] = [
    { name: 'thinking', p: { armR: { a: 120, b: 110 }, armL: { a: -10, b: -70 }, headTilt: 8, expr: 'worried', yaw: 0.2 } },
    { name: 'shrug', p: { armL: { a: 40, b: 80 }, armR: { a: 40, b: 80 }, headTilt: -10, expr: 'oops' } },
    { name: 'point', p: { armR: { a: 95, b: -5 }, armL: { a: 10, b: -8 }, look: 1, yaw: 0.35, expr: 'smug', handR: 'point' } },
    { name: 'cheer', p: { armL: { a: 135, b: 20 }, armR: { a: 135, b: 20 }, expr: 'happy', squash: -0.05 } },
    { name: 'shock', p: { armL: { a: 60, b: 40 }, armR: { a: 60, b: 40 }, expr: 'shock', yaw: -0.3, look: -0.6 } },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: '#14101C' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <KitDefs />
        <SetDefs />
        <g filter="url(#blur10)">
          <Study t={0} id="cast" />
        </g>
        <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
        {cast.map((c, i) => {
          const x = 250 + i * 355;
          const small = c === 'sis' ? 0.46 : 0.6;
          return (
            <g key={c}>
              <Hero look={LOOKS[c]} pose={P({ x, y: row1 + (0.6 - small) * 140, scale: small, yaw: i % 2 ? -0.35 : 0.35, look: i % 2 ? -0.5 : 0.5, expr: 'happy' })} shadow={0.6} />
              <Label x={x} y={row1 + 135} text={NAMES[c] ?? c} />
            </g>
          );
        })}
        {([['ramu', row2], ['appu', row3]] as const).map(([who, row]) =>
          poses.map((q, i) => (
            <g key={who + q.name}>
              <Hero look={LOOKS[who]} pose={P({ x: 300 + i * 330, y: row - 60, scale: 0.56, ...q.p })} shadow={0.6} />
              <Label x={300 + i * 330} y={row + 50} text={`${who.toUpperCase()}: ${q.name.toUpperCase()}`} />
            </g>
          )),
        )}
      </svg>
    </AbsoluteFill>
  );
};

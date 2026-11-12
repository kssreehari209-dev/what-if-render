import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, LOOKS, KitDefs, SetDefs, Glow, Pose, FitSay } from '../../engine';
import { CatHead } from './shots';

// Vertical thumbnail for the shrink Short: the house cat's face over a 5 cm Ramu, the title between them.
//   npx remotion still src/index.ts ThumbShrinkShort out/brand/thumb-shrink-short-ml.png
const ramu: Pose = { ...basePose, x: 540, y: 1800 - 140 * 1.1, scale: 1.1, yaw: 0, look: 0, headTilt: -18, expr: 'shock', armL: { a: 60, b: 40 }, armR: { a: 60, b: -40 } };

export const ThumbShrinkShort: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#2A1E2C' }}>
    <svg width="100%" height="100%" viewBox="0 0 1080 1920">
      <KitDefs />
      <SetDefs />
      <rect width={1080} height={1920} fill="#3A2A34" />
      <Glow x={540} y={420} r={800} kind="warm" o={0.35} />
      <CatHead x={540} y={470} s={1.7} lick={0.8} look={0} t={10} />
      <rect x={0} y={1800} width={1080} height={120} fill="#8A3324" />
      <ellipse cx={540} cy={1804} rx={90} ry={12} fill="#000" opacity={0.4} />
      <Glow x={540} y={1650} r={420} kind="red" o={0.3} />
      <Hero look={LOOKS.ramu} pose={ramu} rimId="rimR" shadow={0} />
      <FitSay y={1040} text="ഓരോ ഉറക്കത്തിലും" size={130} color="#FFC46B" />
      <FitSay y={1210} text="പകുതിയായാൽ?" size={160} />
    </svg>
  </AbsoluteFill>
);

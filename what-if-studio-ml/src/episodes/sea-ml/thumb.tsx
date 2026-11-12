import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, LOOKS, KitDefs, SetDefs, Glow, FitSay, Pose } from '../../engine';
import { Drowned, Vallam, VallamIn, rowerPose } from './kit';

// Thumbnail for "കടൽ ഒരു മീറ്റർ പൊങ്ങിയാൽ?": Ramu in a vallam over his own drowned field, only the red-tile roof left.
//   npx remotion still src/index.ts ThumbSea out/brand/thumb-sea-ml.png
const ramu: Pose = { ...basePose, ...rowerPose(520, 1000, 2.1, 0, { yaw: 0.35, look: 0.8, headTilt: -8, expr: 'shock', armL: { a: 30, b: -60 }, armR: { a: 40, b: -50 } }) } as Pose;

export const ThumbSea: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#24173F' }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <KitDefs />
      <SetDefs />
      <Drowned t={60} id="thumb" lv={760} house={[1450, 1060, 1.15]} palms={[[1000, 1000, 1.1], [1880, 1040, 1.2]]} tips={false} />
      <Glow x={520} y={560} r={600} kind="red" o={0.3} />
      <VallamIn x={520} y={1000} s={2.1} />
      <Hero look={LOOKS.ramu} pose={ramu} rimId="rimRed" shadow={0} />
      <Vallam x={520} y={1000} s={2.1} />
      <FitSay t={99} x={1300} y={230} text="കടൽ 1 മീറ്റർ" size={170} color="#FFC46B" maxW={1100} />
      <FitSay t={99} x={1300} y={400} text="പൊങ്ങിയാൽ?" size={150} color="#F6EFE3" maxW={1000} />
    </svg>
  </AbsoluteFill>
);

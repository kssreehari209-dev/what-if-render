import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, LOOKS, KitDefs, SetDefs, Glow, FONT, Pose } from '../../engine';
import { Sky, CloudSea, PlaneFront, Goggles } from './kit';

// Thumbnail for "What If You Could Fly? Part 1": the cold open, Pip above the clouds with a plane coming straight at him.
//   npx remotion still src/index.ts ThumbFly out/brand/thumb-fly.png
const pip: Pose = { ...basePose, x: 430, y: 1120, scale: 2.2, yaw: 0.3, look: 0.7, headTilt: -10, expr: 'shock', armL: { a: 60, b: 50 }, armR: { a: 60, b: 50 } };

export const ThumbFly: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#060918' }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <KitDefs />
      <SetDefs />
      <Sky id="thumb" mode="night" stars={90} t={40} />
      <CloudSea t={140} y={640} tone="night" />
      <Glow x={1300} y={300} r={900} kind="warm" o={0.45} />
      <PlaneFront x={1300} y={300} s={1.05} t={0} bank={-7} />
      <Glow x={430} y={620} r={520} kind="red" o={0.3} />
      <Hero look={LOOKS.ramu} pose={pip} rimId="rimRed" shadow={0} />
      <Goggles pose={pip} />
      <text x={1290} y={790} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={138} fill="#FFC46B" stroke="#0B0816" strokeWidth={18} paintOrder="stroke">
        എനിക്ക് പറക്കാം!
      </text>
      <text x={1290} y={925} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#F6EFE3" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">
        പക്ഷേ ശ്വാസമില്ല!
      </text>
    </svg>
  </AbsoluteFill>
);

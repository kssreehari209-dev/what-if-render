import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, LOOKS, KitDefs, SetDefs, Glow, FONT, Pose } from '../../engine';
import { Sky, CloudSea, PlaneFront, Goggles } from './kit';

// Vertical thumbnail for the fly Short: the plane coming down on Pip, with the title between them.
//   npx remotion still src/index.ts ThumbFlyShort out/brand/thumb-fly-short.png
const pip: Pose = { ...basePose, x: 540, y: 1960, scale: 2.5, yaw: 0.15, look: 0.2, headTilt: -14, expr: 'shock', armL: { a: 60, b: 50 }, armR: { a: 60, b: 50 } };

export const ThumbFlyShort: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#060918' }}>
    <svg width="100%" height="100%" viewBox="0 0 1080 1920">
      <KitDefs />
      <SetDefs />
      <Sky id="thumbS" mode="night" stars={90} t={40} />
      <CloudSea t={140} y={1500} tone="night" />
      <Glow x={540} y={430} r={800} kind="warm" o={0.5} />
      <PlaneFront x={540} y={430} s={0.85} t={0} bank={-7} />
      <Glow x={540} y={1450} r={520} kind="red" o={0.3} />
      <Hero look={LOOKS.ramu} pose={pip} rimId="rimRed" shadow={0} />
      <Goggles pose={pip} />
      <text x={540} y={880} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFC46B" stroke="#0B0816" strokeWidth={18} paintOrder="stroke">
        പറക്കാൻ
      </text>
      <text x={540} y={1050} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFC46B" stroke="#0B0816" strokeWidth={18} paintOrder="stroke">
        പറ്റിയാലോ?
      </text>
      <text x={540} y={1190} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#F6EFE3" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">
        നേരെ വിമാനം!
      </text>
    </svg>
  </AbsoluteFill>
);

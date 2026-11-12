import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, LOOKS, KitDefs, SetDefs, Glow, FONT, Pose } from '../../engine';
import { Street } from './kit';

// Thumbnail for "What if humans never slept again?": Ramu wide-eyed at 3 am in front of the packed tea shop.
//   npx remotion still src/index.ts ThumbNoSleep out/brand/thumb-nosleep-ml.png
const ramu: Pose = { ...basePose, x: 480, y: 1000, scale: 2.4, yaw: 0.25, look: 0.5, expr: 'shock', blink: 0, armL: { a: 150, b: -150 }, armR: { a: 150, b: -150 } };

export const ThumbNoSleep: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#060918' }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <KitDefs />
      <SetDefs />
      <g transform="translate(960 540) scale(1.25) translate(-1100 -520)">
        <Street t={300} id="thumb" />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#060918" opacity={0.25} />
      <Glow x={480} y={560} r={560} kind="red" o={0.35} />
      <Hero look={LOOKS.ramu} pose={ramu} rimId="rimRed" shadow={0} />
      <g transform="translate(1480 250)">
        <circle r={150} fill="#E8E0CC" stroke="#0B0816" strokeWidth={16} />
        <line x1={0} y1={0} x2={84} y2={0} stroke="#0B0816" strokeWidth={18} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={-120} stroke="#0B0816" strokeWidth={12} strokeLinecap="round" />
        <circle r={14} fill="#0B0816" />
      </g>
      <text x={1290} y={720} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFC46B" stroke="#0B0816" strokeWidth={20} paintOrder="stroke">
        12 ദിവസം
      </text>
      <text x={1290} y={880} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F6EFE3" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">
        ആരും ഉറങ്ങിയില്ല!
      </text>
    </svg>
  </AbsoluteFill>
);

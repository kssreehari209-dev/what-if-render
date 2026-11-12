import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, LOOKS, KitDefs, SetDefs, Glow, Pose, FitSay } from '../../engine';
import { Sky, Palm, KHouse, Water } from '../fly-ml/kit';
import { Umbrella } from '../monsoon-ml/kit';
import { VRain, RainRings, Frog, PaperBoat } from './kit';

// Vertical thumbnail for the rain Short: Ramu chest-deep in the flood under his umbrella, a frog on his hood,
// the tiled house sinking behind, the title in the sky. All text through FitSay, so it can never clip.
//   npx remotion still src/index.ts ThumbRainShort out/brand/thumb-rain-short-ml.png
const ramu: Pose = { ...basePose, x: 560, y: 1500, scale: 2.6, yaw: 0.12, look: 0.1, headTilt: -8, expr: 'shock', armR: { a: 150, b: -18 }, armL: { a: 40, b: 40 } };

export const ThumbRainShort: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#140C26' }}>
    <svg width="100%" height="100%" viewBox="0 0 1080 1920">
      <KitDefs />
      <SetDefs />
      <Sky id="thumbR" mode="dusk" y0={-200} y1={1300} />
      <rect x={0} y={0} width={1080} height={1920} fill="#160E2A" opacity={0.3} />
      <Glow x={540} y={1150} r={700} kind="warm" o={0.45} />
      <Palm x={-20} y={1300} s={1.3} t={10} lean={80} />
      <Palm x={1110} y={1300} s={1.2} t={40} lean={-80} />
      <KHouse x={540} y={1450} s={1.0} lit={1} />
      <Water t={12} y={1180} muddy rough={0.4} />
      <Hero look={LOOKS.ramu} pose={ramu} rimId="rimR" shadow={0} />
      <Umbrella x={890} y={760} s={2.1} rot={-12} c="#2A2A40" />
      <Frog x={500} y={790} s={0.75} pop={1} />
      <Water t={30} y={1430} muddy rough={0.5} />
      <RainRings t={20} y0={1440} y1={1900} n={18} s={1.4} />
      <PaperBoat x={230} y={1560} s={2} rot={-8} />
      <VRain t={30} o={0.55} n={170} />
      <FitSay y={330} text="40 ദിവസം" size={190} color="#FFC46B" maxW={980} />
      <FitSay y={520} text="തോരാതെ മഴ!" size={140} color="#F6EFE3" maxW={980} />
    </svg>
  </AbsoluteFill>
);

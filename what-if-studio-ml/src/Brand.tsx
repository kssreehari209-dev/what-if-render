import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Crow } from './episodes/animals-ml/shots';
import { Hero, basePose, Pose, LOOKS, LEG_LEN, KitDefs, SetDefs, Rooftop, Glow, Dust, Bokeh, Stars, camT, FONT } from './engine';

// Channel branding, drawn on the same rig and sets as the episodes:
//   npx remotion still src/index.ts Banner out/brand/banner.png   (2560x1440, YouTube's banner size)
//   npx remotion still src/index.ts Logo out/brand/logo.png       (800x800, shown as a circle)
// The banner is drawn in the 1920x1080 frame and scaled up 4:3; YouTube's all-device safe area
// (1546x423 of 2560x1440) is x 380-1540, y 381-698 in that frame, so the title and the cast sit inside it.

const FEET = 840;
const P = (x: number, s: number, o: Partial<Pose>): Pose => ({ ...basePose, x, y: FEET - LEG_LEN * s, scale: s, ...o });
const GOLD = '#FFC46B';
const CREAM = '#F6EFE3';

export const Banner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#120E26' }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <KitDefs />
      <SetDefs />
      <g transform={camT(960, 690, 1)}>
        <Rooftop t={30} sunX={1290} sunY={600} />
        <Stars seed={4} x0={-400} y0={-80} w={2720} h={300} t={30} n={50} o={0.55} />
        <Glow x={1290} y={600} r={520} kind="warm" o={0.35} />
        <Hero look={LOOKS.ramu} pose={P(1150, 0.66, { yaw: 0.45, look: 0.9, armR: { a: 128, b: -6 }, armL: { a: 10, b: -8 }, handR: 'point', headTilt: -6, expr: 'happy' })} rimId="rimR" shadow={0.6} />
        <Hero look={LOOKS.appu} pose={P(1440, 0.66, { yaw: -0.4, look: -0.6, armL: { a: 60, b: 40 }, armR: { a: 60, b: 40 }, headTilt: 5, expr: 'shock' })} rimId="rimL" shadow={0.6} />
        <Dust t={30} seed={7} x0={900} y0={380} w={800} h={420} n={40} o={0.55} />
        <Bokeh seed={9} n={10} x0={-300} y0={300} w={2500} h={500} t={30} o={0.18} />
      </g>
      {/* title block, left half of the safe area, with a dark wash so it reads over the sky */}
      <defs>
        <radialGradient id="bnWash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#120E26" stopOpacity={0.55} />
          <stop offset="1" stopColor="#120E26" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={700} cy={540} rx={520} ry={260} fill="url(#bnWash)" />
      <text x={700} y={548} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill={CREAM} stroke="#0B0816" strokeWidth={12} paintOrder="stroke" letterSpacing={-2}>
        What If<tspan fill={GOLD}>?</tspan>
      </text>
      <text x={700} y={622} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={54} fill={GOLD} stroke="#0B0816" strokeWidth={8} paintOrder="stroke">
        അങ്ങനെ സംഭവിച്ചാലോ?
      </text>
      <text x={700} y={672} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={CREAM} opacity={0.85} letterSpacing={3}>
        മലയാളം  ·  ശാസ്ത്രം  ·  ആനിമേഷൻ
      </text>
    </svg>
  </AbsoluteFill>
);

export const Logo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#120E26' }}>
    <svg width="100%" height="100%" viewBox="560 40 800 800">
      <KitDefs />
      <SetDefs />
      <g filter="url(#blur6)">
        <Rooftop t={30} sunX={1080} sunY={560} />
      </g>
      <Glow x={1020} y={420} r={420} kind="warm" o={0.45} />
      <Hero look={LOOKS.ramu} pose={{ ...basePose, x: 900, y: 780, scale: 2.35, yaw: 0.35, look: 0.8, headTilt: -8, expr: 'happy', armR: { a: 150, b: -10 }, handR: 'point' }} rimId="rimR" shadow={0} />
      <text x={1150} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={300} fill={GOLD} stroke="#0B0816" strokeWidth={16} paintOrder="stroke" transform="rotate(12 1150 340)">
        ?
      </text>
    </svg>
  </AbsoluteFill>
);

// Thumbnail for "What If You Could Talk to Animals? Part 2": two wires packed with crows all staring at Pip.
//   npx remotion still src/index.ts ThumbCrows out/brand/thumb-crows.png
const wireY = (x: number, y0: number) => y0 + 60 * (1 - Math.pow((x - 960) / 1100, 2));
export const ThumbCrows: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#120E26' }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <KitDefs />
      <SetDefs />
      <Rooftop t={200} sunX={1500} sunY={640} red={0.35} low={180} />
      <rect x={0} y={0} width={1920} height={1080} fill="#1A0612" opacity={0.25} />
      {[150, 380].map((y0, w) => (
        <g key={w}>
          <path d={`M -40 ${wireY(-40, y0)} Q 960 ${wireY(960, y0) + 60} 1960 ${wireY(1960, y0)}`} stroke="#0E0C14" strokeWidth={5} fill="none" />
          {Array.from({ length: 13 }).map((_, i) => {
            const x = 40 + i * 150 + w * 75;
            return <Crow key={i} x={x} y={wireY(x, y0) + 30 + (w ? 8 : 0)} s={w ? 0.9 : 0.72} f={i * 13 + w * 5} flip={false} look={-0.6} open={(i + w) % 4 === 0 ? 1 : 0} />;
          })}
        </g>
      ))}
      <Glow x={430} y={560} r={520} kind="red" o={0.35} />
      <Hero look={LOOKS.ramu} pose={{ ...basePose, x: 430, y: 1120, scale: 2.2, yaw: 0.3, look: 0.7, headTilt: -14, expr: 'shock', armL: { a: 60, b: 50 }, armR: { a: 60, b: 50 } }} rimId="rimRed" shadow={0} />
      <text x={1290} y={790} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill={GOLD} stroke="#0B0816" strokeWidth={18} paintOrder="stroke">
        100 കാക്കകൾ
      </text>
      <text x={1290} y={920} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill={CREAM} stroke="#0B0816" strokeWidth={14} paintOrder="stroke">
        എന്നെ നോക്കുന്നു!
      </text>
    </svg>
  </AbsoluteFill>
);

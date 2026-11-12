import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, LOOKS, KitDefs, SetDefs, Glow, FONT, Pose } from '../engine';

/*
 * ThumbTemplate — Reusable BOGY thumbnail generator for What If Malayalam.
 *
 * BOGY = Blue, Orange, Green, Yellow — the colors that POP against YouTube's
 * red/white/black interface. Every thumbnail uses one of three BOGY palettes.
 *
 * Usage in an episode's thumb.tsx:
 *
 *   import { ThumbBOGY } from '../../ThumbTemplate';
 *   export const ThumbMyEp = () => (
 *     <ThumbBOGY
 *       palette="blue-orange"
 *       line1="3 വാക്ക്"
 *       line2="ശാസ്ത്രം!"
 *       pip={{ ...basePose, x: 400, y: 950, scale: 2.4, expr: 'shock' }}
 *       pipLook="ramu"
 *       scene={<MySceneBackground />}
 *     />
 *   );
 *
 * Render:  npx remotion still src/index.ts ThumbMyEp out/brand/thumb-myep.png
 */

// ---- BOGY Palettes (never use red, white, or black as primary — those are YouTube's colors) ----
export const BOGY = {
  'blue-orange': {
    bg: '#0A1628',         // deep navy
    glow: '#FF8C00',       // orange glow
    text1: '#FF8C00',      // orange primary text
    text2: '#FFD700',      // gold accent text
    stroke: '#050D1A',     // near-black stroke
    rim: 'rimR',           // warm rim light
    glowKind: 'warm' as const,
  },
  'green-yellow': {
    bg: '#0A1F18',         // deep forest
    glow: '#00FF88',       // neon green glow
    text1: '#FFEE00',      // yellow primary text
    text2: '#00FF88',      // green accent text
    stroke: '#051210',     // near-black stroke
    rim: 'rimR',
    glowKind: 'warm' as const,
  },
  'orange-blue': {
    bg: '#1A0A00',         // deep warm brown
    glow: '#00BFFF',       // electric blue glow
    text1: '#FF6B00',      // warm orange primary text
    text2: '#00BFFF',      // electric blue accent text
    stroke: '#0A0500',     // near-black stroke
    rim: 'rimRed',
    glowKind: 'red' as const,
  },
} as const;

export type BOGYPalette = keyof typeof BOGY;

interface ThumbBOGYProps {
  /** Which BOGY palette: 'blue-orange' | 'green-yellow' | 'orange-blue' */
  palette: BOGYPalette;
  /** Line 1: 2-3 Malayalam words, large. Must be readable at 128px. */
  line1: string;
  /** Line 2: 1-2 Malayalam words, accent color. */
  line2: string;
  /** Pip's pose (use basePose spread with overrides). */
  pip: Pose;
  /** Which look for the hero: 'ramu' or 'appu'. Defaults to 'ramu'. */
  pipLook?: keyof typeof LOOKS;
  /** Optional SVG scene elements behind Pip (sky, room, etc). */
  scene?: React.ReactNode;
  /** Text anchor X for the text block. Default: 1290 (right side). */
  textX?: number;
  /** Y for line 1. Default: 790. */
  textY1?: number;
  /** Y for line 2. Default: 920. */
  textY2?: number;
  /** Font size for line 1. Default: 150. */
  fontSize1?: number;
  /** Font size for line 2. Default: 100. */
  fontSize2?: number;
  /** Whether this is a vertical (9:16) thumbnail. */
  vertical?: boolean;
}

export const ThumbBOGY: React.FC<ThumbBOGYProps> = ({
  palette,
  line1,
  line2,
  pip,
  pipLook = 'ramu',
  scene,
  textX,
  textY1,
  textY2,
  fontSize1,
  fontSize2,
  vertical = false,
}) => {
  const p = BOGY[palette];
  const W = vertical ? 1080 : 1920;
  const H = vertical ? 1920 : 1080;

  // Default text positions: right side for 16:9, center-bottom for 9:16
  const tx = textX ?? (vertical ? W / 2 : 1290);
  const ty1 = textY1 ?? (vertical ? 1500 : 790);
  const ty2 = textY2 ?? (vertical ? 1650 : 920);
  const fs1 = fontSize1 ?? (vertical ? 120 : 150);
  const fs2 = fontSize2 ?? (vertical ? 88 : 100);
  const sw1 = Math.round(fs1 * 0.12);
  const sw2 = Math.round(fs2 * 0.14);

  return (
    <AbsoluteFill style={{ backgroundColor: p.bg }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <KitDefs />
        <SetDefs />
        {scene}
        <Glow x={pip.x} y={pip.y - 300} r={520} kind={p.glowKind} o={0.35} />
        <Hero look={LOOKS[pipLook]} pose={pip} rimId={p.rim} shadow={0} />
        <text
          x={tx} y={ty1}
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={fs1}
          fill={p.text1}
          stroke={p.stroke}
          strokeWidth={sw1}
          paintOrder="stroke"
        >
          {line1}
        </text>
        <text
          x={tx} y={ty2}
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={fs2}
          fill={p.text2}
          stroke={p.stroke}
          strokeWidth={sw2}
          paintOrder="stroke"
        >
          {line2}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// test-ml's own pieces: the house fact card (upper third in a Short) and a steel mug.
import React from 'react';
import { clamp, backOut, FONT } from '../../engine';

/** The one fact card: dark rounded panel, big accent number, one Malayalam line, small source. */
export const FactCard: React.FC<{ t: number; big: string; line: string; src: string; y?: number }> = ({ t, big, line, src, y = 420 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  return (
    <g transform={`translate(540 ${y}) scale(${k})`}>
      <rect x={-460} y={-150} width={920} height={300} rx={36} fill="#120E22" opacity={0.88} />
      <rect x={-460} y={-150} width={920} height={300} rx={36} fill="none" stroke="#FFB15A" strokeWidth={5} />
      <text y={-20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FFB15A">{big}</text>
      <text y={64} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={44} fill="#F6EFE3">{line}</text>
      <text y={122} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#A99FB8">{src}</text>
    </g>
  );
};
export const Mug: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-40} y={-50} width={80} height={100} rx={8} fill="#B8C0CC" stroke="#1A1230" strokeWidth={5} />
    <path d="M 40 -24 q 30 0 30 24 q 0 24 -30 24" stroke="#1A1230" strokeWidth={6} fill="none" />
  </g>
);


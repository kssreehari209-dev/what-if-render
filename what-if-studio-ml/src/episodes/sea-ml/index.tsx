import React from 'react';
import { defineEpisode, Timeline, ShotMap, ShotProps } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

// every shot id in the timeline, drawn by the component of the same name in shots.tsx
const Missing: React.FC<ShotProps> = () => <rect x={0} y={0} width={1920} height={1080} fill="#300" />;
const tl = timeline as Timeline;
const map: ShotMap = {};
// a slow drift on every shot, alternating in and out, so nothing sits still
const drift = (C: React.FC<ShotProps>, out: boolean): React.FC<ShotProps> => (p) => {
  const k = Math.min(1, p.t / Math.max(1, p.len));
  // longer shots move more: up to 7% push and a 40 px pan, eased, so a silent picture beat keeps travelling
  const amt = Math.min(1, p.len / 150);
  const e = k * k * (3 - 2 * k);
  const z = 1 + (0.025 + 0.045 * amt) * (out ? 1 - e : e);
  const dx = (out ? -1 : 1) * 40 * amt * (e - 0.5);
  return <g transform={`translate(${960 + dx} 540) scale(${z}) translate(-960 -540)`}><C {...p} /></g>;
};
tl.segments.forEach((s, i) => { map[s.shot] = drift((shots as unknown as ShotMap)[s.shot] ?? Missing, i % 2 === 1); });

export const seaMl = defineEpisode('SeaMl', { timeline: tl, shots: map, looks: {} });

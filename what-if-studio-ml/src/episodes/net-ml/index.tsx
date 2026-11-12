import React from 'react';
import { defineEpisode, Timeline, ShotMap, ShotProps } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { Chip } from './kit';

// every shot id in the timeline, drawn by the component of the same name in shots.tsx
const Missing: React.FC<ShotProps> = () => <rect x={0} y={0} width={1920} height={1080} fill="#300" />;
const tl = timeline as Timeline;
const map: ShotMap = {};
// every shot gets a slow drift, alternating in and out, so nothing sits still however quiet the pose
const drift = (C: React.FC<ShotProps>, out: boolean, id: string): React.FC<ShotProps> => (p) => {
  const k = Math.min(1, p.t / Math.max(1, p.len));
  const z = 1 + 0.04 * (out ? 1 - k : k);
  const chip = shots.CHIPS[id];
  return <g><g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}><C {...p} /></g>{chip ? <Chip t={p.t - chip[1]} text={chip[0]} /> : null}</g>;
};
tl.segments.forEach((s, i) => { map[s.shot] = drift((shots as unknown as ShotMap)[s.shot] ?? Missing, i % 2 === 1, s.shot); });

export const netMl = defineEpisode('NetMl', { timeline: tl, shots: map, looks: {} });

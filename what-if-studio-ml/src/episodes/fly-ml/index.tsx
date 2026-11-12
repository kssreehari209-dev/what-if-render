import React from 'react';
import { defineEpisode, Timeline, ShotMap, ShotProps } from '../../engine';
import timeline from './timeline.json';
import * as shots1 from './shots';
import * as shots2 from './shots2';
const shots = { ...shots1, ...shots2 };

// every shot id in the timeline, drawn by the component of the same name in shots.tsx
const Missing: React.FC<ShotProps> = () => <rect x={0} y={0} width={1920} height={1080} fill="#300" />;
const tl = timeline as Timeline;
const map: ShotMap = {};
for (const s of tl.segments) map[s.shot] = (shots as unknown as ShotMap)[s.shot] ?? Missing;

export const flyMl = defineEpisode('FlyMl', { timeline: tl, shots: map, looks: {} });

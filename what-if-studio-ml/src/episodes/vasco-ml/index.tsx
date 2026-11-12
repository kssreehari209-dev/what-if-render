import React from 'react';
import { defineEpisode, Timeline, ShotMap, ShotProps } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

const Missing: React.FC<ShotProps> = () => <rect x={0} y={0} width={1920} height={1080} fill="#300" />;
const tl = timeline as Timeline;
const map: ShotMap = {};
for (const s of tl.segments) map[s.shot] = (shots as unknown as ShotMap)[s.shot] ?? Missing;

export const vascoMl = defineEpisode('VascoMl', { timeline: tl, shots: map, looks: {} });

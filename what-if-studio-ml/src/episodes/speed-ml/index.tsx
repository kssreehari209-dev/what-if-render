import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12 } from './shots';

const speedLook: LookDef = {
  grade: (lv) => `saturate(${1 + 0.25 * lv}) contrast(${1 + 0.12 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="10X SPEED" icon="dot" />,
};

export const speedMl = defineEpisode('SpeedMl', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12 },
  looks: { speed: speedLook },
});

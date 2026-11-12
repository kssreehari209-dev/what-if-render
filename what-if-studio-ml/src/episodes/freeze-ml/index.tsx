import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14 } from './shots';

const freezeLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.3 * lv}) contrast(${1 + 0.15 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="TIME FROZEN" icon="dot" />,
};

export const freezeMl = defineEpisode('FreezeMl', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14 },
  looks: { freeze: freezeLook },
});

import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, Dial } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19 } from './shots';

// The power's look: while a skip runs the picture cools and brightens a touch, a SKIP chip blinks and a dial counts
// the hours of sleep he just skipped.
const skipLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.15 * lv}) hue-rotate(${-10 * lv}deg) brightness(${1 + 0.06 * lv})`,
  Overlay: ({ f, p }) => {
    const hrs = 8 * p;
    const read = `+${Math.floor(hrs)}:${String(Math.floor((hrs % 1) * 60)).padStart(2, '0')}`;
    return (
      <g>
        <HudChip f={f} label="SKIP" icon="skip" />
        <Dial p={p} readout={read} />
      </g>
    );
  },
};

export const skipSleep = defineEpisode('SkipSleep', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19 },
  looks: { skip: skipLook },
});

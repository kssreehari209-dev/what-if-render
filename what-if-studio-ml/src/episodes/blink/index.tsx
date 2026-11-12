import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18 } from './shots';

// The power's look: while a blink runs the picture cools and lifts a touch and a BLINK chip blinks; the fold into
// the ring and the pop-in are drawn in the shots (BlinkOut, PasteIn), the flashes are fx cues.
const blinkLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.15 * lv}) hue-rotate(${-10 * lv}deg) brightness(${1 + 0.05 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="BLINK" icon="dot" />,
};

export const blink = defineEpisode('Blink', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18 },
  looks: { blink: blinkLook },
});

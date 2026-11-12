import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, ShotProps } from '../../engine';
import timeline from './timeline.json';
import * as EN from '../blink/shots';
import { BLINK_TEXT, BlinkText, BlinkTextCtx } from '../blink/shots';

// The Malayalam cut of "blink": the same eighteen shots, retimed to the Malayalam voice, with every word on screen
// in Malayalam (the numbers and KM/H stay as they are).
const ML: BlinkText = {
  ...BLINK_TEXT,
  title: ['കണ്ണ് ചിമ്മിയാൽ', 'ടെലിപോർട്ട് ചെയ്താലോ?'],
  accent: 'ടെലിപോർട്ട്',
  titleSize: 84,
  titleGap: 118,
  titleY: 140,
  flingAt: 43,
  anywhere: 'ഭൂമിയിൽ എവിടേക്കും',
  spins: 'ഭൂമി കറങ്ങുന്നു',
  equator: 'ഭൂമധ്യരേഖ',
  speedOf: 'ഭൂമധ്യരേഖയുടെ വേഗം',
  over: '1,600-ൽ കൂടുതൽ',
  pole: 'ധ്രുവം: 0 KM/H',
  you: 'നീ: 1,674 KM/H',
};

const inMl = (Shot: React.FC<ShotProps>): React.FC<ShotProps> => (p) => (
  <BlinkTextCtx.Provider value={ML}>
    <Shot {...p} />
  </BlinkTextCtx.Provider>
);

const blinkLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.15 * lv}) hue-rotate(${-10 * lv}deg) brightness(${1 + 0.05 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="ബ്ലിങ്ക്" icon="dot" />,
};

const ids = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18'] as const;
const shots = Object.fromEntries(ids.map((id) => [id, inMl(EN[id])]));

export const blinkMl = defineEpisode('BlinkMl', {
  timeline: timeline as Timeline,
  shots,
  looks: { blink: blinkLook },
});

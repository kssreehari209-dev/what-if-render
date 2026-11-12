import React from 'react';
import { defineEpisode, Timeline, LookDef, TapeLines, HudChip, Dial, FONT } from '../../engine';
import timeline from './timeline.json';
import { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh11, Sh12, titleShot } from '../rewind/shots';

// The Malayalam cut of "rewind": the same twelve shots, retimed to the Malayalam voice, with the title and the HUD
// in Malayalam (the stopwatch digits and the 10 stay as they are).
const Sh10 = titleShot({ lines: ['എപ്പോൾ വേണമെങ്കിലും', '10 സെക്കൻഡ് റിവൈൻഡ് ചെയ്താലോ?'], accent: '10', size: 84, gap: 118, y: 140 });

const rewindLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.45 * lv}) contrast(${1 + 0.1 * lv}) hue-rotate(${-14 * lv}deg)`,
  jitter: 5,
  Overlay: ({ f, p, n }) => {
    const secs = 10 * (1 - p);
    const read = `-${String(Math.floor(secs)).padStart(2, '0')}.${String(Math.floor((secs % 1) * 100)).padStart(2, '0')}`;
    return (
      <g>
        <TapeLines f={f} />
        <HudChip f={f} label="റിവൈൻഡ്" icon="rewind" />
        <Dial p={1 - p} readout={read} />
        <text x={1820} y={1010} textAnchor="end" fontFamily={FONT.ui} fontSize={28} fill="#F6EFE3" opacity={0.6}>
          {`ടേക്ക് ${n + 2}`}
        </text>
      </g>
    );
  },
};

export const rewindMl = defineEpisode('RewindMl', {
  timeline: timeline as Timeline,
  shots: { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh10, Sh11, Sh12 },
  looks: { rewind: rewindLook },
});

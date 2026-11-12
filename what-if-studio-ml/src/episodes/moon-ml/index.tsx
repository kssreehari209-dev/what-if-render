import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11 } from './shots';

export const moonMl = defineEpisode('MoonMl', {
  timeline: (timeline as unknown) as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11 },
  looks: {},
});

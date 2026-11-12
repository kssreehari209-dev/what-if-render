import { defineEpisode, Timeline, Reframe, VerticalExtras, Word } from '../../engine';
import words from './words.json';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S10b, S11, S12, S13 } from './shots';

export const animalsMl = defineEpisode('AnimalsMl', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S10b, S11, S12, S13 },
  looks: {},
});

// The 9:16 cut: per shot, the point of the 16:9 frame to centre and its scale (1.78 fills the height).
export const animalsMlVertical: Reframe = {
  S1: { x: 880, s: 1.25 }, S2: { x: 1000, s: 1.6, y: 480 }, S3: { x: 1130, s: 1.6 }, S4: { x: 1040, s: 1.15 },
  S5: { x: 980, s: 1.5 }, S6: { x: 1000, s: 1.6 }, S7: { x: 930, s: 1.2 }, S8: { x: 800, s: 1.6, y: 470 },
  S9: { x: 975, s: 0.72, y: 330 }, S10: { x: 1040, s: 0.82 }, S10b: { x: 830, s: 1.15 }, S11: { x: 960, s: 0.78 },
  S12: { x: 1000, s: 1.4 }, S13: { x: 960, s: 0.85 },
};

export const animalsMlExtras: VerticalExtras = {
  words: words as Word[],
  header: ['മൃഗങ്ങളോട്', 'സംസാരിക്കാൻ പറ്റിയാലോ?'],
  noHeader: ['S9'],
  hot: ['മീൻ', 'ബിസ്കറ്റ്', 'പേര്', 'അഞ്ച്', 'വർഷത്തിലധികം', 'സത്യമാണ്', 'നിന്നെക്കുറിച്ചാണ്'],
};

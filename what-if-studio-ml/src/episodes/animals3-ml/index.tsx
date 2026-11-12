import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const animals3Ml = defineEpisode('Animals3Ml', {
  timeline: timeline as Timeline,
  shots: {
    A1: shots.A1, A2: shots.A2, A3: shots.A3, A4: shots.A4,
    T: shots.T,
    B1: shots.B1, B2: shots.B2, B3: shots.B3, B4: shots.B4,
    D1: shots.D1, D2: shots.D2, D3: shots.D3, D4: shots.D4,
    B5: shots.B5, B6: shots.B6,
    D5: shots.D5, D6: shots.D6,
    C1: shots.C1, C2: shots.C2, C3: shots.C3, C4: shots.C4, C5: shots.C5, C6: shots.C6,
    D7: shots.D7, D8: shots.D8, D9: shots.D9, D10: shots.D10,
    E1: shots.E1, E2: shots.E2, E3: shots.E3, E4: shots.E4, E5: shots.E5, E6: shots.E6,
    F1: shots.F1, F2: shots.F2, F3: shots.F3, F4: shots.F4, F5: shots.F5, F6: shots.F6,
    G1: shots.G1, G2: shots.G2, G3: shots.G3, G4: shots.G4, G5: shots.G5, G6: shots.G6,
    END: shots.END
  },
  looks: {},
});

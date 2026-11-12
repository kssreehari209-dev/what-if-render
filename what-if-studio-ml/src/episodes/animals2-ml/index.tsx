import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const animals2Ml = defineEpisode('Animals2Ml', {
  timeline: timeline as Timeline,
  shots: {
    A1: shots.A1, A2: shots.A2, A3: shots.A3, A4: shots.A4, A5: shots.A5, A6: shots.A6, A7: shots.A7,
    T: shots.T,
    B1: shots.B1, B2: shots.B2, B3: shots.B3, B4: shots.B4, D1: shots.D1, D2: shots.D2,
    B5: shots.B5, B6: shots.B6, B7: shots.B7, B8: shots.B8, B9: shots.B9,
    C1: shots.C1, C2: shots.C2, C3a: shots.C3a, C3b: shots.C3b, C3c: shots.C3c,
    D3: shots.D3, D4: shots.D4,
    C4: shots.C4, C4b: shots.C4b, C5: shots.C5, C6: shots.C6, C6b: shots.C6b, C7: shots.C7, C8: shots.C8,
    E1: shots.E1, E2: shots.E2, E3: shots.E3,
    D5: shots.D5, D6: shots.D6, D6b: shots.D6b, D7: shots.D7, D8: shots.D8, D8b: shots.D8b,
    D9: shots.D9, D10: shots.D10, D11: shots.D11,
    E4: shots.E4,
    D12: shots.D12, D13: shots.D13, D14: shots.D14, D15: shots.D15, D15b: shots.D15b,
    D16: shots.D16, D17: shots.D17,
    E5: shots.E5, E6: shots.E6, E7: shots.E7,
    F1: shots.F1, F2: shots.F2, F3: shots.F3, F3b: shots.F3b, F4: shots.F4,
    F5: shots.F5, F6: shots.F6, F6b: shots.F6b, F7: shots.F7, F8: shots.F8, F9: shots.F9, F10: shots.F10,
    G1: shots.G1, G2: shots.G2, G2b: shots.G2b,
    H1: shots.H1, H2: shots.H2, H3: shots.H3, H4: shots.H4,
    D18: shots.D18, D18b: shots.D18b,
    H5: shots.H5, H6: shots.H6,
    END: shots.END
  },
  looks: {},
});

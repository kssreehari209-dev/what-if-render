// The registry: add each new episode here (one import, one entry).
import { rewind } from './rewind';
import { copyPaste } from './copy-paste';
import { skipSleep } from './skip-sleep';
import { blink } from './blink';
import { blinkMl } from './blink-ml';
import { rewindMl } from './rewind-ml';
import { moonMl } from './moon-ml';
import { gravityMl } from './gravity-ml';
import { animalsMl } from './animals-ml';
import { speedMl } from './speed-ml';
import { animals2Ml } from './animals2-ml';
import { animals3Ml } from './animals3-ml';
import { flyMl } from './fly-ml';
import { flyShortMl } from './fly-short-ml';
import { freezeMl } from './freeze-ml';
import { vascoMl } from './vasco-ml';
import { phoneMl } from './phone-ml';
import { iceShortMl } from './ice-short-ml';
import { monsoonMl } from './monsoon-ml';
import { amazonMl } from './amazon-ml';
import { netMl } from './net-ml';
import { awakeShortMl } from './awake-short-ml';
import { testMl } from './test-ml';
import { rainShortMl } from './rain-short-ml';
import { shrinkShortMl } from './shrink-short-ml';
import { seaMl } from './sea-ml';
import { nosleepMl } from './nosleep-ml';

export const EPISODES = [rewind, copyPaste, skipSleep, blink, blinkMl, rewindMl, moonMl, gravityMl, speedMl, animalsMl, animals2Ml, animals3Ml, flyMl, flyShortMl, freezeMl, vascoMl, phoneMl, iceShortMl, monsoonMl, amazonMl, netMl, awakeShortMl, testMl, rainShortMl, shrinkShortMl, seaMl, nosleepMl];

// 9:16 cuts: <Id>Vertical compositions (1080x1920), reframed per shot.
import { animalsMlVertical, animalsMlExtras } from './animals-ml';
export const VERTICALS = [{ ep: animalsMl, frame: animalsMlVertical, extras: animalsMlExtras }];

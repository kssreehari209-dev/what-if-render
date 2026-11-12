import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import { EPISODES, VERTICALS } from './episodes';
import { Vertical, Sheet, sheetSize } from './engine';
import { CastSheet } from './CastSheet';
import { Banner, Logo, ThumbCrows } from './Brand';
import { ThumbFly } from './episodes/fly-ml/thumb';
import { ThumbSea } from './episodes/sea-ml/thumb';
import { ThumbNoSleep } from './episodes/nosleep-ml/thumb';
import { ThumbFlyShort } from './episodes/fly-short-ml/thumb';
import { ThumbRainShort } from './episodes/rain-short-ml/thumb';
import { ThumbShrinkShort } from './episodes/shrink-short-ml/thumb';

// Every episode gets two compositions: <Id> (the film) and <Id>Board (one frame per shot, at its key frame, for the
// storyboard) and <Id>Sheet (the live storyboard: every shot at once, redrawn on save). Cast renders the cast sheet.
//   npx remotion studio src/index.ts --port 3430

// An episode may set its own frame size (fly-short-ml is a native 9:16 Short).
const dims = (e: object) => ('width' in e && 'height' in e ? { width: (e as { width: number }).width, height: (e as { height: number }).height } : {});

export const Root: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      {EPISODES.map((e) => (
        <React.Fragment key={e.id}>
          <Composition id={e.id} component={e.Main} durationInFrames={Math.max(1, e.total)} {...common} {...dims(e)} />
          <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={Math.max(1, e.shotCount)} {...common} {...dims(e)} />
          {/* the live storyboard: all shots at their key frames, redrawn on save, with a text-clipping check */}
          <Composition id={`${e.id}Sheet`} component={() => <Sheet ep={e} />} durationInFrames={Math.max(1, e.shotCount)} fps={STUDIO.fps} width={sheetSize(e).width} height={sheetSize(e).height} />
        </React.Fragment>
      ))}
      {VERTICALS.map(({ ep, frame, extras }) => (
        <Composition key={ep.id} id={`${ep.id}Vertical`} component={() => <Vertical ep={ep} tl={ep.timeline} frame={frame} extras={extras} />} durationInFrames={ep.total} width={1080} height={1920} fps={STUDIO.fps} />
      ))}
      <Composition id="Cast" component={CastSheet} durationInFrames={1} {...common} />
      <Composition id="Banner" component={Banner} durationInFrames={1} width={2560} height={1440} fps={STUDIO.fps} />
      <Composition id="ThumbCrows" component={ThumbCrows} durationInFrames={1} {...common} />
      <Composition id="ThumbFly" component={ThumbFly} durationInFrames={1} {...common} />
      <Composition id="ThumbSea" component={ThumbSea} durationInFrames={1} {...common} />
      <Composition id="ThumbNoSleep" component={ThumbNoSleep} durationInFrames={1} {...common} />
      <Composition id="ThumbFlyShort" component={ThumbFlyShort} durationInFrames={1} width={1080} height={1920} fps={STUDIO.fps} />
      <Composition id="ThumbShrinkShort" component={ThumbShrinkShort} durationInFrames={1} width={1080} height={1920} fps={STUDIO.fps} />
      <Composition id="ThumbRainShort" component={ThumbRainShort} durationInFrames={1} width={1080} height={1920} fps={STUDIO.fps} />
      <Composition id="Logo" component={Logo} durationInFrames={1} width={800} height={800} fps={STUDIO.fps} />
    </>
  );
};

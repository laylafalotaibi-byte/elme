import type { Timeline } from './types';

/** Total film length in frames: scenes overlap during their cross-dissolves. */
export const totalDuration = (timeline: Timeline) =>
  timeline.scenes.reduce((sum, scene, i) => sum + scene.durationInFrames - (i === 0 ? 0 : scene.transitionIn), 0);

/** Global start frame of each scene (useful for docs and debugging). */
export const sceneStarts = (timeline: Timeline) => {
  let cursor = 0;
  return timeline.scenes.map((scene, i) => {
    if (i > 0) cursor -= scene.transitionIn;
    const start = cursor;
    cursor += scene.durationInFrames;
    return { id: scene.id, start, end: cursor };
  });
};

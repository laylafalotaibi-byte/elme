import type { Timeline, TimelineScene } from './types';

const overlap = (scene: TimelineScene) => (scene.transitionIn.type === 'fade' ? scene.transitionIn.frames : 0);

/** Total film length in frames: scenes overlap only during dissolves. */
export const totalDuration = (timeline: Timeline) =>
  timeline.scenes.reduce((sum, scene, i) => sum + scene.durationInFrames - (i === 0 ? 0 : overlap(scene)), 0);

/** Global start/end frame of each scene (for docs and debugging). */
export const sceneStarts = (timeline: Timeline) => {
  let cursor = 0;
  return timeline.scenes.map((scene, i) => {
    if (i > 0) cursor -= overlap(scene);
    const start = cursor;
    cursor += scene.durationInFrames;
    return { id: scene.id, start, end: cursor };
  });
};

/** Campaign length rule: approximately 60–75 s at 30 fps. */
export const MIN_FRAMES = 60 * 30;
export const MAX_FRAMES = 75 * 30;

/** Throws at load time if a story's timeline breaks the campaign rules. */
export const validateTimeline = (timeline: Timeline): Timeline => {
  const total = totalDuration(timeline);
  if (total < MIN_FRAMES || total > MAX_FRAMES) {
    throw new Error(`Timeline is ${(total / 30).toFixed(1)} s — the campaign format is 60–75 s.`);
  }
  for (const scene of timeline.scenes) {
    if (scene.transitionIn.type === 'fade' && (scene.transitionIn.frames < 6 || scene.transitionIn.frames > 20)) {
      throw new Error(`Scene ${scene.id}: dissolves must be 6–20 frames.`);
    }
  }
  return timeline;
};

/**
 * Text-safe window for a scene: copy should only be on screen (fully revealed) between
 * these local frames so nothing is mid-reveal during a dissolve.
 */
export const textSafeWindow = (timeline: Timeline, id: TimelineScene['id']) => {
  const i = timeline.scenes.findIndex((s) => s.id === id);
  const scene = timeline.scenes[i];
  const next = timeline.scenes[i + 1];
  return { start: overlap(scene), end: scene.durationInFrames - (next ? overlap(next) : 0) - 10 };
};

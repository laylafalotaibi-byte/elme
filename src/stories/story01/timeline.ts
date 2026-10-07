import type { Timeline } from '../../campaign/types';

/**
 * STORY 01 — Timeline (30 fps)
 * Scenes overlap by `transitionIn` frames (cross-dissolve), so the film length is
 * sum(durations) − sum(transitions). Scene-internal beats live in each scene template.
 */
export const story01Timeline: Timeline = {
  scenes: [
    { id: 'person', previewId: 'S01-Person', durationInFrames: 180, transitionIn: 0 },
    { id: 'before', previewId: 'S02-Before', durationInFrames: 285, transitionIn: 12 },
    { id: 'pain', previewId: 'S03-Pain', durationInFrames: 255, transitionIn: 20 },
    { id: 'question', previewId: 'S04-Question', durationInFrames: 165, transitionIn: 15 },
    { id: 'reveal', previewId: 'S05-Reveal', durationInFrames: 270, transitionIn: 15 },
    { id: 'workflow', previewId: 'S06-Workflow', durationInFrames: 240, transitionIn: 15 },
    { id: 'after', previewId: 'S07-After', durationInFrames: 210, transitionIn: 15 },
    { id: 'impact', previewId: 'S08-Impact', durationInFrames: 225, transitionIn: 15 },
    { id: 'human', previewId: 'S09-Human', durationInFrames: 165, transitionIn: 15 },
    { id: 'final', previewId: 'S10-Final', durationInFrames: 315, transitionIn: 15 },
  ],
};

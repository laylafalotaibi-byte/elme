import type { Timeline } from '../../campaign/types';
import { validateTimeline } from '../../campaign/timeline';

/**
 * STORY 01 — Timeline (30 fps)
 * Hard cuts by default. Into Scenes 09 and 10 a short dip (out to a colour and back) marks
 * time passing without double-exposing his face. Film length = Σ durations − Σ dip frames. Scene-internal beats are documented in
 * docs/STORYBOARD.md and implemented in each scene template.
 */
export const story01Timeline: Timeline = validateTimeline({
  scenes: [
    { id: 'person', beat: 'PERSON', previewId: 'S01-Person', durationInFrames: 180, transitionIn: { type: 'cut' } },
    { id: 'before', beat: 'PROBLEM', previewId: 'S02-Before', durationInFrames: 225, transitionIn: { type: 'cut' } },
    { id: 'pain', beat: 'PROBLEM', previewId: 'S03-Pain', durationInFrames: 240, transitionIn: { type: 'cut' } },
    { id: 'question', beat: 'INITIATIVE', previewId: 'S04-Question', durationInFrames: 195, transitionIn: { type: 'cut' } },
    { id: 'reveal', beat: 'INITIATIVE', previewId: 'S05-Reveal', durationInFrames: 300, transitionIn: { type: 'cut' } },
    { id: 'workflow', beat: 'BETTER WAY', previewId: 'S06-Workflow', durationInFrames: 210, transitionIn: { type: 'cut' } },
    { id: 'after', beat: 'BETTER WAY', previewId: 'S07-After', durationInFrames: 210, transitionIn: { type: 'cut' } },
    { id: 'impact', beat: 'IMPACT', previewId: 'S08-Impact', durationInFrames: 170, transitionIn: { type: 'cut' } },
    { id: 'human', beat: 'PERSON', previewId: 'S09-Human', durationInFrames: 210, transitionIn: { type: 'dip', frames: 10, color: '#E6DED2' } },
    { id: 'final', beat: 'IMPACT', previewId: 'S10-Final', durationInFrames: 330, transitionIn: { type: 'dip', frames: 10, color: '#0B0C0E' } },
  ],
});

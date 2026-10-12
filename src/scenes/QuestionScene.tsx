import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { useStory } from '../campaign/StoryContext';
import { LIGHT, mixLight } from '../campaign/light';
import { colors, type } from '../campaign/theme';
import { ease, span } from '../campaign/motion';
import { HeroShot } from '../components/set/HeroShot';
import { World } from '../components/fx/World';
import { MaskedReveal } from '../components/typography/Reveal';
import { Realign } from './before/Realign';
import { splitTwo } from './before/shared';
import { S04 } from './before/timing';
import type { SceneProps } from './types';

/**
 * Scene 04 — The Question (INITIATIVE) · 195 f · light dimmed → dark → black.
 * The turning point; the strongest, quietest frame of the film. Beats: before/timing.ts · S04.
 *
 *   0–32    The frozen clutter quietly re-aligns into a grid of identical, repeating cycles
 *           (a glide over ≈ 30 f, every card < 50 px/f; the pattern is still at the cut).
 *   32–72   Hard cut → Hero shot (close), held still — 40 f. Only grain moves. He stops.
 *   72–86   Fade to near-black.
 *   86–108  The question rises as one thought, line by line, centred, in the human voice;
 *           it lands by 108 and holds 87 f (7 words need 72 f from the start of the reveal: 109).
 *   108–195 Hold. Nothing moves except grain. No camera move on the type.
 */
export const QuestionScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const [q1, q2] = splitTwo(story.question.text);
  const Q = S04.question;

  if (frame < S04.hero[0]) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.ink }}>
        <Realign frame={frame} />
      </AbsoluteFill>
    );
  }

  const heroFade = 1 - span(frame, S04.fade, ease.inOut);
  const light = mixLight(LIGHT.dimmed, LIGHT.dark, 0.85);
  const q = { ...type.displayXL, color: colors.textOnDark, whiteSpace: 'nowrap' as const };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <World kind="void" />
      {heroFade > 0 ? (
        <AbsoluteFill style={{ opacity: heroFade }}>
          {/* held still: no push, no drift — he stops */}
          <HeroShot light={light} framing="close" screenGlow={0.5} />
          {/* the room has gone dark: only the screen's rim on him remains */}
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 90% at 62% 46%, rgba(11,12,14,0.32), rgba(11,12,14,0.72) 100%)' }} />
        </AbsoluteFill>
      ) : null}
      {frame >= Q.start && frame < durationInFrames ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', transform: 'translateY(-14px)' }}>
            <MaskedReveal start={Q.start} duration={Q.duration} distance={0.85} block>
              <span style={q}>{q1}</span>
            </MaskedReveal>
            {q2 ? (
              <MaskedReveal start={Q.start + Q.lineStagger} duration={Q.duration} distance={0.85} block>
                <span style={q}>{q2}</span>
              </MaskedReveal>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

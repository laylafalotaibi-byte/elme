import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { useStory } from '../campaign/StoryContext';
import { LIGHT, mixLight } from '../campaign/light';
import { colors, type } from '../campaign/theme';
import { ease, mapClamp } from '../campaign/motion';
import { HeroShot } from '../components/set/HeroShot';
import { World } from '../components/fx/World';
import { MaskedReveal } from '../components/typography/Reveal';
import { Realign } from './before/Realign';
import { splitTwo } from './before/shared';
import type { SceneProps } from './types';

/**
 * Scene 04 — The Question (INITIATIVE) · 195 f · light dimmed → dark → black.
 * The turning point; the strongest, quietest frame of the film.
 *
 *   0–36    The frozen clutter quietly re-aligns into a grid of identical, repeating cycles.
 *   36–63   Hard cut → Hero shot (close), held still. Only grain moves. He stops.
 *   63–77   Fade to near-black.
 *   75–97   The question rises as one thought, line by line, centred, in the human voice
 *           (≈ 11 f earlier than the storyboard's 86 so it holds its full reading time:
 *           7 words → 1.5 s + 1.75 s = 97.5 f; it lands by 97 and holds 98 f to the cut).
 *   97–end  Hold. Nothing moves except grain. No camera move on the type.
 */
/** The question rises as the last of the picture fades; it lands by 97 and holds ≥ 3.25 s (98 f). */
const QUESTION_IN = 75;

export const QuestionScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const [q1, q2] = splitTwo(story.question.text);

  if (frame < 36) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.ink }}>
        {/* settles by ≈ f29, so the finished pattern holds still for a beat before the cut */}
        <Realign frame={frame} start={1} duration={24} />
      </AbsoluteFill>
    );
  }

  const heroFade = 1 - mapClamp(frame, [63, 77], [0, 1], ease.inOut);
  const light = mixLight(LIGHT.dimmed, LIGHT.dark, 0.85);
  const q = { ...type.displayXL, color: colors.textOnDark, whiteSpace: 'nowrap' as const };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <World kind="void" />
      {heroFade > 0 ? (
        <AbsoluteFill style={{ opacity: heroFade }}>
          <HeroShot light={light} framing="close" screenGlow={0.5} />
          {/* the room has gone dark: only the screen's rim on him remains */}
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 90% at 62% 46%, rgba(11,12,14,0.32), rgba(11,12,14,0.72) 100%)' }} />
        </AbsoluteFill>
      ) : null}
      {frame >= QUESTION_IN && frame < durationInFrames ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', transform: 'translateY(-14px)' }}>
            <MaskedReveal start={QUESTION_IN} duration={18} distance={0.85} block>
              <span style={q}>{q1}</span>
            </MaskedReveal>
            {q2 ? (
              <MaskedReveal start={QUESTION_IN + 4} duration={18} distance={0.85} block>
                <span style={q}>{q2}</span>
              </MaskedReveal>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

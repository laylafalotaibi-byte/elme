import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors, type } from '../campaign/theme';
import { LIGHT } from '../campaign/light';
import { ease, lerp, mapClamp, progress } from '../campaign/motion';
import { useStory } from '../campaign/StoryContext';
import { HeroShot } from '../components/set/HeroShot';
import { MaskedReveal } from '../components/typography/Reveal';
import { RichLine } from './final/RichLine';
import { S09 } from './final/timing';
import type { SceneProps } from './types';

/**
 * Scene 09 — The Human Outcome · PERSON · light warm daylight. 210 f, 10 f dissolve in/out.
 *
 *   0 → 210   Back to him: hero shot, a slow even push from medium towards close (picture
 *             layer only — the type never scales).
 *   0 – 12    Dissolve in. No type.
 *   14 → 38   "He wasn't asked to build it." rises in the space he is looking into.
 *   38 – 90   It holds; nothing new (the pause).
 *   90 → 112  It steps back; "He saw a problem." rises beneath it.
 *   132 → 154 Both step back; "And found *a better way.*" rises — *a better way* in the
 *             human voice, orange. The warm key on his face lifts a little as it lands.
 *   154 → 210 Hold (46 f still before the dissolve into Scene 10, 56 f in all).
 */

const LINE_SIZE = 72;
const TEXT_X = 924;
/** Top of each line; the answer sits a beat lower than the two statements. */
const LINE_TOP = [350, 456, 588];

export const HumanScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const lines = story.human.lines;

  const push = lerp(S09.push.from, S09.push.to, mapClamp(frame, [0, durationInFrames - 1], [0, 1]));
  const key = lerp(S09.key.from, S09.key.to, progress(frame, S09.key.at, S09.key.dur, ease.inOut));

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* picture: the push centres on his eye line, so his profile stays where it is */}
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '31% 44%' }}>
        <HeroShot light={LIGHT.warmDay} framing="medium" keyLight={key} />
      </AbsoluteFill>

      {/* type: in the space he is looking into */}
      {lines.map((text, i) => {
        const beat = S09.lines[i];
        if (!beat) return null;
        const next = S09.lines[i + 1];
        const dim = next ? progress(frame, next.at, 22, ease.inOut) : 0;
        const opacity = lerp(1, S09.dimTo[i] ?? 0.4, dim);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: TEXT_X,
              top: LINE_TOP[i] ?? LINE_TOP[LINE_TOP.length - 1] + (i - LINE_TOP.length + 1) * 100,
              ...type.displayM,
              fontSize: LINE_SIZE,
              color: colors.textOnLight,
              whiteSpace: 'nowrap',
              opacity,
            }}
          >
            <MaskedReveal start={beat.at} duration={beat.dur}>
              <RichLine text={text} emphasis="serifAccent" />
            </MaskedReveal>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

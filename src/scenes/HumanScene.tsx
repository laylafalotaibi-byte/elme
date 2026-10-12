import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors, fonts, type } from '../campaign/theme';
import { LIGHT } from '../campaign/light';
import { ease, lerp, mapClamp, progress } from '../campaign/motion';
import { useStory } from '../campaign/StoryContext';
import { HeroShot, HERO_TEXT_SAFE } from '../components/set/HeroShot';
import { MaskedReveal } from '../components/typography/Reveal';
import { RichLine } from './final/RichLine';
import { breakLines } from './final/lines';
import { em, richMeasurer, useTypeReady, type FontSpec } from './final/close-measure';
import { S09 } from './final/timing';
import type { SceneProps } from './types';

/**
 * Scene 09 — The Human Outcome · PERSON · light warm daylight. 210 f; enters on a 10 f dip
 * to warm paper and leaves on a 10 f dip to ink (from 200) — no double exposure of his face.
 *
 *   0 → 210   Back to him: hero shot, a slow even push from medium towards close (picture
 *             layer only — the type never scales).
 *   0 – 10    Dip in. No type.
 *   14 → 38   "He wasn't asked to build it." rises in the space he is looking into.
 *   38 – 90   It holds; nothing new (the pause).
 *   90 → 112  It steps back; "He saw a problem." rises beneath it.
 *   132 → 154 Both step back; "And found *a better way.*" rises — *a better way* in the
 *             human voice, orange. The warm key on his face lifts a little as it lands.
 *   154 → 200 Hold (46 f still), then the dip to ink.
 *
 * Each line wraps inside a measured width (the text-safe space in front of him), balanced,
 * so a later story's longer line stays in frame; the block stays centred on his eye line.
 */

const LINE: FontSpec = { family: fonts.sans, weight: type.displayM.fontWeight, size: 72, tracking: em(type.displayM.letterSpacing) };
const TEXT_X = 924;
/** The space he is looking into: from TEXT_X to the right edge of the hero text-safe area. */
const MEASURE = HERO_TEXT_SAFE.medium.x + HERO_TEXT_SAFE.medium.w - TEXT_X;
/** Vertical centre of the block (Story 01: lines at 350 / 456 / 588). */
const CENTRE_Y = 507;
/** Space before each sentence; the answer sits a beat lower than the two statements. */
const SENTENCE_GAP = 30;
const ANSWER_GAP = 56;

export const HumanScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const lines = story.human.lines;

  const measurer = useMemo(() => richMeasurer(LINE), []);
  const ready = useTypeReady(measurer.specs);
  const sentences = useMemo(() => lines.map((text) => breakLines(text, MEASURE, richMeasurer(LINE))), [lines, ready]);

  const push = lerp(S09.push.from, S09.push.to, mapClamp(frame, [0, durationInFrames - 1], [0, 1]));
  const key = lerp(S09.key.from, S09.key.to, progress(frame, S09.key.at, S09.key.dur, ease.inOut));

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* picture: the push centres on his eye line, so his profile stays where it is */}
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '31% 44%' }}>
        <HeroShot light={LIGHT.warmDay} framing="medium" keyLight={key} />
      </AbsoluteFill>

      {/* type: in the space he is looking into */}
      <div
        style={{
          position: 'absolute',
          left: TEXT_X,
          top: 0,
          width: MEASURE,
          height: CENTRE_Y * 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ...type.displayM,
          fontSize: LINE.size,
          color: colors.textOnLight,
        }}
      >
        {sentences.map((sentence, i) => {
          const beat = S09.lines[i];
          if (!beat) return null;
          const next = S09.lines[i + 1];
          const dim = next ? progress(frame, next.at, 22, ease.inOut) : 0;
          const opacity = lerp(1, S09.dimTo[i] ?? 0.4, dim);
          const gap = i === 0 ? 0 : i === sentences.length - 1 ? ANSWER_GAP : SENTENCE_GAP;
          return (
            <div key={i} style={{ marginTop: gap, opacity }}>
              {sentence.map((text, li) => (
                <MaskedReveal key={li} block start={beat.at + li * S09.wrapStagger} duration={beat.dur}>
                  <RichLine text={text} emphasis="serifAccent" />
                </MaskedReveal>
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

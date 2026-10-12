import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors, type } from '../campaign/theme';
import { ease, mapClamp, progress } from '../campaign/motion';
import { LIGHT, mixLight, type Light } from '../campaign/light';
import { useStory } from '../campaign/StoryContext';
import { HeroShot, HERO_TEXT_SAFE } from '../components/set/HeroShot';
import { ScreenInsert } from '../components/set/Inserts';
import { LowerThird } from '../components/portrait/LowerThird';
import { LineReveal } from './workflow/LineReveal';
import { LearningInsert } from './workflow/LearningInsert';
import { InsertTitles } from './workflow/InsertTitles';
import { RoomLight } from './workflow/RoomLight';
import { S05 } from './workflow/timing';
import type { SceneProps } from './types';

/**
 * Scene 05 — The Unexpected Part · INITIATIVE · light black → warm key.
 *
 *   0–6      black
 *   6–20     CLOSE on him fades up and racks soft → sharp (→ 32); rim light only
 *   10       the documentary lower-third (only with an approved name; the draft shows the
 *            placeholder) settles on the right, clear of his silhouette
 *   20–34    silence: just him
 *   34→106   "He was a junior IT Support employee." — 86 px, a step up from Scene 01's 76,
 *            in the space he looks into (72 f on screen)
 *   96–106   picture and line fade to near-black
 *   108→190  "He had no previous automation experience." alone, 96 px, a little right of
 *            centre; from 120 a warm key slowly rises on him behind the type
 *   190      cut → screen insert in warm light: his notebook page, his notes, the paper
 *            form and a single record in miniature at either end of an empty page
 *   191→     supporting line settles at the bottom and stays (into Scene 06)
 *   195      LEARN.       his cursor reads a line of his notes, then turns to the page
 *   219      EXPERIMENT.  a dashed draft is drawn — then crossed out
 *   244–262  reverse shot: CLOSE on him, warm key, screen light on his face — he has seen
 *            it fail (EXPERIMENT stays across both cuts)
 *   262      back on the page: he is already drawing again
 *   265      BUILD.       a second draft; the dashes close
 *   289      IMPROVE.     he takes the line by the middle and it straightens
 *            (IMPROVE and the supporting line stay into Scene 06's first frames)
 *
 * The words sit above the middle of his line, where his hand is working.
 * Scene 06 opens on this scene's last frame (see workflow/sketch.ts, workflow/timing.ts).
 */

/** Rim light only: a dark room, the screen just off-frame. */
const RIM: Light = { exposure: 0.05, warmth: 0.3 };
/** Line 2 opens on near-black, then the warm key rises. */
const NEAR_BLACK: Light = { exposure: 0.02, warmth: 0.6 };
const END_B: Light = mixLight(NEAR_BLACK, LIGHT.warmKey, 0.62);

/** HeroShot's key (0…1.5): a clear warm key on the face, not a hotspot. */
const KEY = 1.15;

/** The size ladder of the film's narrator lines: Scene 01 76 → line 1 86 → line 2 96. */
const LINE1_SIZE = 86;
const LINE2_SIZE = 96;

/** Shot A: the close. Line 1 and the lower-third share one left edge in the space he looks into. */
const SHOT_A = { textX: HERO_TEXT_SAFE.close.x + 20, line1Top: 372, width: 820, lowerThirdY: 868 } as const;

/**
 * Shot B: reframed closer, scaled about the right edge so he moves left (the right edge stays
 * covered); line 2 sits slightly right of centre so it never crowds his profile.
 */
const SHOT_B = { scale: 1.21, lineOffsetX: 64 } as const;

/**
 * The reverse shot inside the insert: the close, pushed in about the right edge so his face
 * sits left of the word that persists over it (WORD_ANCHOR), in the light the key brought.
 */
const INTERCUT = { scale: 1.15, light: { exposure: 0.27, warmth: 0.86 } as Light, key: 1.05 } as const;

/** Line reveals land as one thought (stagger 2, duration 18) — a little quicker than dur.line, to buy hold time. */
const LINE_DUR = 18;

const HeroPart: React.FC = () => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const role = story.employee.title;

  // Shot A — the close: who he is.
  const aIn = progress(frame, S05.heroIn, S05.heroInDur, ease.inOut);
  const aOut = progress(frame, S05.fadeOut, S05.fadeOutEnd - S05.fadeOut, ease.inOut);
  const rack = mapClamp(frame, [S05.heroIn, S05.rackEnd], [16, 0], ease.inOut);
  const showA = frame >= S05.heroIn && frame < S05.fadeOutEnd + 1;

  // Shot B — behind line 2, the warm key rises.
  const key = mapClamp(frame, [S05.keyRise, S05.cut], [0, 1], ease.inOut);
  const bIn = mapClamp(frame, [S05.keyRise - 6, S05.keyRise + 56], [0, 1], ease.inOut);
  const lightB = mixLight(NEAR_BLACK, END_B, key);
  const pushB = mapClamp(frame, [S05.fadeOutEnd, S05.cut], [1, 1.045]);
  const showB = frame >= S05.fadeOutEnd;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {showA ? (
        <AbsoluteFill style={{ opacity: aIn * (1 - aOut) }}>
          <HeroShot light={RIM} framing="close" blur={rack} screenGlow={0.95} zoom={mapClamp(frame, [S05.heroIn, S05.fadeOutEnd], [1, 1.025])} />
        </AbsoluteFill>
      ) : null}
      {showA ? <LowerThird start={S05.lowerThird} exitAt={S05.fadeOut} tone="dark" x={SHOT_A.textX} y={SHOT_A.lowerThirdY} /> : null}
      {showA ? (
        <LineReveal
          text={story.reveal.lines[0]}
          start={S05.line1}
          stagger={2}
          duration={LINE_DUR}
          keepTogether={[role]}
          exitAt={S05.fadeOut}
          exitDuration={S05.fadeOutEnd - S05.fadeOut}
          style={{
            position: 'absolute',
            left: SHOT_A.textX,
            top: SHOT_A.line1Top,
            width: SHOT_A.width,
            ...type.displayM,
            fontSize: LINE1_SIZE,
            lineHeight: 1.06,
            color: colors.textOnDark,
          }}
        />
      ) : null}

      {showB ? (
        // Reframed after the fade: he sits further left and closer, looking into the line.
        <AbsoluteFill style={{ opacity: bIn }}>
          <AbsoluteFill style={{ transform: `scale(${SHOT_B.scale})`, transformOrigin: '100% 45%' }}>
            <HeroShot light={lightB} framing="medium" keyLight={KEY * key} screenGlow={0.3} blur={1.2} zoom={pushB} />
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}
      {showB ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <LineReveal
            text={story.reveal.lines[1]}
            start={S05.line2}
            stagger={2}
            duration={LINE_DUR}
            style={{
              width: 1180,
              textAlign: 'center',
              ...type.displayM,
              fontSize: LINE2_SIZE,
              lineHeight: 1.06,
              color: colors.textOnDark,
              marginTop: -10,
              // flex-centred: a left margin of 2·offset moves the block right by `offset`
              marginLeft: SHOT_B.lineOffsetX * 2,
            }}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/** The reverse shot: him, having seen the draft fail. Still; the slightest push. */
const Intercut: React.FC = () => {
  const frame = useCurrentFrame();
  const push = mapClamp(frame, [S05.intercut[0], S05.intercut[1]], [1, 1.012]);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <AbsoluteFill style={{ transform: `scale(${INTERCUT.scale})`, transformOrigin: '100% 50%' }}>
        <HeroShot light={INTERCUT.light} framing="close" keyLight={INTERCUT.key} screenGlow={1} zoom={push} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const InsertPart: React.FC = () => {
  const frame = useCurrentFrame();
  const onHim = frame >= S05.intercut[0] && frame < S05.intercut[1];
  return (
    <AbsoluteFill>
      {onHim ? (
        <Intercut />
      ) : (
        <>
          <ScreenInsert light={LIGHT.warmKey} />
          <LearningInsert />
          <RoomLight dim={1} day={0} />
        </>
      )}
      <InsertTitles tone={onHim ? 'dark' : 'light'} />
    </AbsoluteFill>
  );
};

export const RevealScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: colors.ink }}>{frame < S05.cut ? <HeroPart /> : <InsertPart />}</AbsoluteFill>;
};

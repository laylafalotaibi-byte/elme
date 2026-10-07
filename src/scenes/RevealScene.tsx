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
 *   0–10     black
 *   10–40    hero shot (medium) fades up and racks soft → sharp; rim light only;
 *            the documentary lower-third lands on his shoulder (the only time name and role appear)
 *   22–50→94 "He was a junior IT Support employee." in the space he looks into
 *   94–108   picture and line fade to near-black — silence
 *   110–138→198  "He had no previous automation experience." alone, one size up, a little
 *            right of centre; a warm key light slowly rises on him behind the type
 *   198      cut → screen insert in warm light: his notes, a blank canvas
 *   201→     supporting line settles at the bottom and stays
 *   207      LEARN.       his cursor reads a line of his notes, then traces the figure in them
 *   230      EXPERIMENT.  a dashed draft is drawn — then crossed out
 *   256      BUILD.       a second draft; the dashes close
 *   278→300  IMPROVE.     he takes the line by the middle and it straightens
 *            (IMPROVE and the supporting line stay into Scene 06's first frames)
 *
 * Scene 06 opens on this scene's last frame (see workflow/sketch.ts, workflow/timing.ts).
 */

/** Rim light only: a dark room, the screen just off-frame. */
const RIM: Light = { exposure: 0.05, warmth: 0.3 };
/** Line 2 opens on near-black, then the warm key rises. */
const NEAR_BLACK: Light = { exposure: 0.02, warmth: 0.6 };

/**
 * Shot B's room light runs FLOOR_B → END_B as the key rises; the darkness at the start comes
 * from an ink fade-up, not from the light. Why: HeroShot's SVG filters work in linearRGB at
 * 8 bits, so a warm near-black figure (channels ≈ 6–8, R > G > B) crosses the rounding
 * threshold one channel at a time and flashes maroon → olive → grey. FLOOR_B keeps every
 * figure channel ≥ 7 (it renders as a clean neutral). See sharedChangeRequests (HeroShot).
 */
const END_B: Light = mixLight(NEAR_BLACK, LIGHT.warmKey, 0.62);
const FLOOR_B: Light = { exposure: 0.17, warmth: 0.74 };

/**
 * HeroShot's key is tuned for a photo; on the silhouette placeholder it barely reads, so
 * it is driven past 1 here (see sharedChangeRequests).
 */
const KEY_GAIN = 2.3;

const LINE2_SIZE = 96; // one step above displayM (76), below displayL (112)

/**
 * Lower-third position. HeroShot's default (160, 860) straddles the silhouette's back edge
 * (half the role on the wall, half on his shoulder); set fully on his shoulder it reads cleanly.
 */
const LOWER_THIRD = { x: 290, y: 884 } as const;

/**
 * Shot B: reframed closer, scaled about the right edge so he moves left (the right edge stays
 * covered); line 2 sits slightly right of centre so it never crowds his profile.
 */
const SHOT_B = { scale: 1.21, lineOffsetX: 64 } as const;

/** Line reveals land as one thought (stagger 2, duration 18) — a little quicker than dur.line, to buy hold time. */
const LINE_DUR = 18;

const HeroPart: React.FC = () => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const role = story.employee.title;

  // Shot A — the reveal of who he is.
  const aIn = progress(frame, S05.heroIn, 16, ease.inOut);
  const aOut = progress(frame, S05.fadeOut, S05.fadeOutEnd - S05.fadeOut, ease.inOut);
  const rack = mapClamp(frame, [S05.heroIn, S05.rackEnd], [16, 0], ease.inOut);
  const showA = frame >= S05.heroIn && frame < S05.fadeOutEnd + 1;

  // Shot B — behind line 2, the warm key rises.
  const key = mapClamp(frame, [S05.keyRise, S05.cut], [0, 1], ease.inOut);
  const bIn = mapClamp(frame, [S05.keyRise - 6, S05.keyRise + 56], [0, 1], ease.inOut);
  const lightB = mixLight(FLOOR_B, END_B, key);
  const pushB = mapClamp(frame, [S05.fadeOutEnd, S05.cut], [1, 1.045]);
  const showB = frame >= S05.fadeOutEnd;

  const safe = HERO_TEXT_SAFE.medium;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {showA ? (
        <AbsoluteFill style={{ opacity: aIn * (1 - aOut) }}>
          <HeroShot light={RIM} framing="medium" blur={rack} screenGlow={0.95} zoom={mapClamp(frame, [S05.heroIn, S05.fadeOutEnd], [1.03, 1])} />
        </AbsoluteFill>
      ) : null}
      {showA ? <LowerThird start={S05.lowerThird} exitAt={S05.fadeOut} tone="dark" x={LOWER_THIRD.x} y={LOWER_THIRD.y} /> : null}
      {showA ? (
        <LineReveal
          text={story.reveal.lines[0]}
          start={S05.line1}
          stagger={2}
          duration={LINE_DUR}
          keepTogether={[role]}
          exitAt={S05.fadeOut}
          exitDuration={S05.fadeOutEnd - S05.fadeOut}
          style={{ position: 'absolute', left: safe.x + 30, top: 392, width: 820, ...type.displayM, color: colors.textOnDark }}
        />
      ) : null}

      {showB ? (
        // Reframed after the fade: he sits further left and closer, looking into the line.
        // Faded up from black with an ink overlay, NOT container opacity: a semi-transparent
        // layer around HeroShot's key-light filter group renders the silhouette maroon in Chrome.
        <AbsoluteFill>
          <AbsoluteFill style={{ transform: `scale(${SHOT_B.scale})`, transformOrigin: '100% 45%' }}>
            <HeroShot light={lightB} framing="medium" keyLight={KEY_GAIN * key} screenGlow={0.3} blur={1.2} zoom={pushB} />
          </AbsoluteFill>
          {bIn < 1 ? <AbsoluteFill style={{ backgroundColor: colors.ink, opacity: 1 - bIn }} /> : null}
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

const InsertPart: React.FC = () => (
  <AbsoluteFill>
    <ScreenInsert light={LIGHT.warmKey} />
    <LearningInsert />
    <RoomLight dim={1} day={0} />
    <InsertTitles />
  </AbsoluteFill>
);

export const RevealScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: colors.ink }}>{frame < S05.cut ? <HeroPart /> : <InsertPart />}</AbsoluteFill>;
};

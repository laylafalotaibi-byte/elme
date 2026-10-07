import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { LIGHT, roomPalette } from '../campaign/light';
import { envelope, mapClamp, progress, ease } from '../campaign/motion';
import { toneColors, type } from '../campaign/theme';
import { useStory } from '../campaign/StoryContext';
import { HERO_TEXT_SAFE, HeroShot } from '../components/set/HeroShot';
import { MaskedReveal } from '../components/typography/Reveal';
import { camTransform, OPENING_CAM, SCREEN_LAYOUT, type Cam } from './person/geometry';
import { OpeningWorkspace } from './person/OpeningSet';
import { S01 } from './person/timing';
import type { SceneProps } from './types';

/**
 * Scene 01 — The Person · PERSON · light normalDay · 180 f.
 *
 * An ordinary morning. Nothing is wrong yet. No titles, no kicker, no name plate.
 *
 *   0–34     Workspace over his shoulder, normal daylight, one slow drift. A calm screen;
 *            his pointer moves a little — he is working.
 *   34–52    The request lands top-right (the slot Scene 02 and Scene 07 reuse); a soft
 *            breath of screen light on his shoulder; his pointer drifts towards it.
 *   52       Cut → Hero shot (medium): he is reading.
 *   56–78    "Another device handover." rises into the space in front of him, holds alone.
 *   118–140  Line 1 steps back to 40 %; "Another manual process." rises beneath it.
 *   → 180    Hold (40 f). Roman type, no emphasis.
 */

/** One slow drift towards the screen (picture layer only). */
const DRIFT_TO: Cam = { scale: 1.032, x: -14, y: 6 };

/** Story lines sit just inside the hero text-safe area, at his eye line (medium framing). */
const TEXT_INSET = 40;
const TEXT_TOP = 404;

/**
 * His pointer. The Cursor springs from each key to the next over the gap between them, so
 * each key is where a move STARTS from; the last move is a slow drift that is still under
 * way at the cut.
 */
const OPENING_POINTER = (request: number, cut: number) => {
  const rest = SCREEN_LAYOUT.cursorRest;
  return [
    { frame: 0, ...rest },
    { frame: 4, ...rest },
    // he is working: small, unhurried moves inside his document
    { frame: 14, x: rest.x + 22, y: rest.y - 26 },
    { frame: 28, x: rest.x + 48, y: rest.y - 12 },
    // the request lands — his hand drifts towards it
    { frame: request + 4, x: rest.x + 44, y: rest.y - 16 },
    { frame: cut + 8, x: 852, y: 216 },
  ];
};

export const PersonScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const light = LIGHT.normalDay;
  const [line1, line2] = story.person.lines;

  if (frame < S01.cut) {
    const t = mapClamp(frame, [0, S01.cut], [0, 1]);
    const cam: Cam = {
      scale: OPENING_CAM.scale + (DRIFT_TO.scale - OPENING_CAM.scale) * t,
      x: OPENING_CAM.x + (DRIFT_TO.x - OPENING_CAM.x) * t,
      y: OPENING_CAM.y + (DRIFT_TO.y - OPENING_CAM.y) * t,
    };
    const flash = envelope(frame, S01.request, S01.request + 30, 5, 22) * 0.55;
    return (
      <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
        <AbsoluteFill style={camTransform(cam)}>
          <OpeningWorkspace light={light} flash={flash} requestStart={S01.request} cursor={{ keys: OPENING_POINTER(S01.request, S01.cut) }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // Hero shot — he is reading. Type sits in the space he is looking into.
  const zoom = S01.heroZoom.from + (S01.heroZoom.to - S01.heroZoom.from) * mapClamp(frame, [S01.cut, durationInFrames], [0, 1]);
  const tone = roomPalette(light).tone;
  const c = toneColors(tone);
  const dim = 1 - (1 - S01.line1Dim) * progress(frame, S01.line2.at, S01.line2.dur, ease.inOut);
  const safe = HERO_TEXT_SAFE.medium;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <HeroShot light={light} framing="medium" zoom={zoom} />
      {/* at his eye line, in the space he is looking into; wraps inside the safe area if a story's line is longer */}
      <div style={{ position: 'absolute', left: safe.x + TEXT_INSET, top: TEXT_TOP, width: safe.w - TEXT_INSET }}>
        <div style={{ opacity: dim }}>
          <MaskedReveal start={S01.line1.at} duration={S01.line1.dur} block style={{ ...type.displayM, color: c.text }}>
            {line1}
          </MaskedReveal>
        </div>
        <div style={{ marginTop: 14 }}>
          <MaskedReveal start={S01.line2.at} duration={S01.line2.dur} block style={{ ...type.displayM, color: c.text }}>
            {line2}
          </MaskedReveal>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { colors, type } from '../campaign/theme';
import { LIGHT } from '../campaign/light';
import { ease, lerp, mapClamp, progress } from '../campaign/motion';
import { useStory } from '../campaign/StoryContext';
import { DeskInsert } from '../components/set/Inserts';
import { MaskedReveal } from '../components/typography/Reveal';
import { ManualPile, PILE_LINE, PILE_POOL } from './final/ManualPile';
import { PaperWorld } from './final/PaperWorld';
import { EndCardPaced } from './final/EndCardPaced';
import { RichLine } from './final/RichLine';
import { splitLines } from './final/lines';
import { S10 } from './final/timing';
import type { SceneProps } from './types';

/**
 * Scene 10 — Final Message & End Card · IMPACT (sign-off). 330 f, 10 f dissolve in.
 *
 *   0 – 12    Dissolve in: a small pile of the old process on a dim desk, in a pool of
 *             light. No type.
 *   12 → 28   MANUAL rises beside it.
 *   28 → 54   One orange hairline glides across at an even pace. Behind it warm daylight
 *             comes up (a soft light front, not a slide wipe); each artefact it reaches
 *             straightens, drops onto the line and tips flat into his single orange line;
 *             the word wipes from MANUAL to AUTOMATED as the line crosses it (≈ 46).
 *   ≈48 – 60  Held: one line, one word.
 *   60 → 70   They leave; the warm paper world (Scene 06's) stays, window light drifting.
 *   72 → 94   "No previous automation experience." (centred)
 *   94 – 110  Pause.
 *   110 → 138 "Just curiosity, ownership, / and *the drive to improve.*" — two lines; only
 *             *the drive to improve* in the human voice. Line 1 steps back.
 *   138 – 190 Held (52 f).
 *   190       Hard cut to ink.
 *   190 →     End card builds in ≈ 34 f (rule → line word by word → orange full stop →
 *             tagline → meta) and holds still ≥ 3.5 s to the last frame.
 */

const WORD_X = 1100;
const WORD_BOX = 820;
const LINE_SIZE = 72;
/**
 * The light front. The hairline carries the light: everything behind it is in warm
 * daylight, and the light spills a little ahead of it (a soft edge of `FRONT` px) onto the
 * dim desk — so the line reads as the leading edge of the light, never as a shadow band.
 */
const FRONT = 190;
const SPILL_BEHIND = 24;

/** Frame position of the sweep. */
const sweepCurve = Easing.bezier(...S10.sweep.curve);
const sweepAt = (frame: number) => lerp(S10.sweep.x0, S10.sweep.x1, progress(frame, S10.sweep.at, S10.sweep.dur, sweepCurve));
/** Shutter: a moving hairline leaves a faint trail of half its travel per frame, as a camera would record it. */
const SHUTTER = 0.5;
/** Push at mid-sweep — fixed, so each artefact's fold frame never flickers with the camera. */
const HIT_PUSH = lerp(S10.push.from, S10.push.to, (S10.sweep.at + S10.sweep.dur / 2) / S10.push.until);

/**
 * Mask for the dim (BEFORE) layers: transparent behind the line, the dim desk ahead of it.
 * The spill only grows as the line comes into frame, so nothing is lit before it arrives.
 */
const frontMask = (x: number): React.CSSProperties => {
  const front = Math.max(1, Math.min(FRONT, x + SPILL_BEHIND));
  const mask = `linear-gradient(90deg, rgba(0,0,0,0) ${x - SPILL_BEHIND}px, rgba(0,0,0,0.5) ${x + front * 0.3}px, #000 ${x + front}px)`;
  return { WebkitMaskImage: mask, maskImage: mask };
};

/** MANUAL's own light front (word-local x): gone at the line, full strength a light-front away. */
const wordFade = (x: number): React.CSSProperties => {
  const mask = `linear-gradient(90deg, rgba(0,0,0,0) ${x}px, rgba(0,0,0,0.6) ${x + FRONT * 0.45}px, #000 ${x + FRONT}px)`;
  return { WebkitMaskImage: mask, maskImage: mask };
};

export const FinalScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const { from, to, lines } = story.final;

  // the sweep, in frame coordinates
  const sweepP = progress(frame, S10.sweep.at, S10.sweep.dur, sweepCurve);
  const sweepX = sweepAt(frame);
  const smear = Math.min(90, Math.max(0, (sweepX - sweepAt(frame - 1)) * SHUTTER));
  const hitAt = useMemo(() => {
    const table: number[] = [];
    for (let f = S10.sweep.at; f <= S10.sweep.at + S10.sweep.dur; f++) table.push(sweepAt(f));
    return (x: number) => {
      const i = table.findIndex((v) => v >= x);
      return S10.sweep.at + (i === -1 ? S10.sweep.dur : i);
    };
  }, []);

  // picture camera: a slow push on the pile / line (the type stays outside it)
  const push = lerp(S10.push.from, S10.push.to, mapClamp(frame, [0, S10.push.until], [0, 1]));
  const localSweep = 960 + (sweepX - 960) / push;
  const dimVisible = sweepP < 1;

  // AUTOMATED and his line leave together
  const out = progress(frame, S10.callbackOut, S10.callbackOutDur, ease.in);
  const callbackVisible = frame < S10.callbackOut + S10.callbackOutDur;

  // his line: forms behind the sweep, retracts to its centre as it leaves
  const mid = (PILE_LINE.x1 + PILE_LINE.x2) / 2;
  const lineEnd = Math.min(PILE_LINE.x2, localSweep - 60);
  const lx1 = lerp(PILE_LINE.x1, mid, out);
  const lx2 = lerp(lineEnd, mid, out);

  // final lines
  const [line2a, line2b] = splitLines(lines[1], 32);
  const line1Dim = lerp(1, S10.line1Dim, progress(frame, S10.line2.at, 22, ease.inOut));

  if (frame >= S10.cutToInk) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.ink }}>
        <EndCardPaced start={S10.endCard} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* AFTER: his paper world in warm daylight */}
      <PaperWorld drift={frame * 0.4} zoom={1 + frame * 0.00012} />

      {callbackVisible ? (
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 50%' }}>
          {/* BEFORE: the dim desk and its pool of light, ahead of the light front */}
          {dimVisible ? (
            <AbsoluteFill style={frontMask(localSweep)}>
              <DeskInsert light={LIGHT.dimmed} />
              <AbsoluteFill
                style={{
                  background: `radial-gradient(ellipse 620px 500px at ${PILE_POOL.x}px ${PILE_POOL.y}px, rgba(255,238,215,0.09) 0%, rgba(255,238,215,0) 72%)`,
                }}
              />
            </AbsoluteFill>
          ) : null}

          {/* his single line, forming behind the sweep */}
          {lineEnd > PILE_LINE.x1 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - progress(out, 0.6, 0.4) }}>
              <line x1={lx1} y1={PILE_LINE.y} x2={Math.max(lx1, lx2)} y2={PILE_LINE.y} stroke={colors.accent} strokeWidth={PILE_LINE.width} strokeLinecap="round" />
            </svg>
          ) : null}

          {/* the old pile, folding into it */}
          <ManualPile frame={frame} hitAt={(x) => hitAt(960 + (x - 960) * HIT_PUSH)} collapse={S10.collapse} />

          {/* dim light falling off around the pile, ahead of the light front */}
          {dimVisible ? (
            <AbsoluteFill
              style={{
                ...frontMask(localSweep),
                background: `radial-gradient(ellipse 560px 460px at ${PILE_POOL.x}px ${PILE_POOL.y}px, rgba(8,9,11,0.16) 0%, rgba(8,9,11,0.42) 62%, rgba(8,9,11,0.66) 100%)`,
              }}
            />
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* the sweep: one orange hairline (with its shutter trail while it moves) */}
      {sweepP > 0 && sweepX < 1940 ? (
        <>
          {smear > 2 ? (
            <div style={{ position: 'absolute', left: sweepX - 1 - smear, top: 0, width: smear, height: 1080, background: 'linear-gradient(90deg, rgba(242,107,33,0) 0%, rgba(242,107,33,0.22) 100%)' }} />
          ) : null}
          <div style={{ position: 'absolute', left: sweepX - 1, top: 0, width: 2, height: 1080, background: colors.accent }} />
        </>
      ) : null}

      {/* MANUAL → AUTOMATED: the word wipes with the line */}
      {callbackVisible ? (
        <div
          style={{
            position: 'absolute',
            left: WORD_X,
            top: PILE_LINE.y - 43,
            width: WORD_BOX,
            height: 100,
            ...type.displayM,
            letterSpacing: '-0.012em',
            whiteSpace: 'nowrap',
            opacity: 1 - out,
            transform: `translateY(${-14 * out}px)`,
          }}
        >
          {/* MANUAL dims away in the light spilling ahead of the line, so the swap reads as light, not a garbled word */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: WORD_BOX, color: colors.textOnDark, clipPath: `inset(0 0 0 ${Math.max(0, sweepX - WORD_X)}px)`, ...wordFade(sweepX - WORD_X) }}>
            <MaskedReveal start={S10.fromIn} duration={S10.fromDur}>
              {from}
            </MaskedReveal>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: WORD_BOX, color: colors.textOnLight, clipPath: `inset(0 ${Math.max(0, WORD_BOX - (sweepX - WORD_X))}px 0 0)` }}>
            {to}
          </div>
        </div>
      ) : null}

      {/* No previous automation experience. / Just curiosity, ownership, and the drive to improve. */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 350, textAlign: 'center', ...type.displayM, fontSize: LINE_SIZE, color: colors.textOnLight, opacity: line1Dim }}>
        <MaskedReveal start={S10.line1.at} duration={S10.line1.dur}>
          <RichLine text={lines[0]} />
        </MaskedReveal>
      </div>
      {[line2a, line2b].map((text, i) =>
        text ? (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 480 + i * 86, textAlign: 'center', ...type.displayM, fontSize: LINE_SIZE, color: colors.textOnLight }}>
            <MaskedReveal start={S10.line2.at + i * S10.line2.stagger} duration={S10.line2.dur}>
              <RichLine text={text} emphasis="serif" />
            </MaskedReveal>
          </div>
        ) : null,
      )}
    </AbsoluteFill>
  );
};

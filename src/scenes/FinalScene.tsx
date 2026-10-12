import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors, fonts, type } from '../campaign/theme';
import { LIGHT } from '../campaign/light';
import { ease, glide, lerp, mapClamp, progress, span } from '../campaign/motion';
import { useStory } from '../campaign/StoryContext';
import { DeskInsert } from '../components/set/Inserts';
import { MaskedReveal } from '../components/typography/Reveal';
import { EndCard } from '../components/endcard/EndCard';
import { CALLBACK, callbackLayout, ManualPile, PILE_POOL } from './final/ManualPile';
import { PaperWorld } from './final/PaperWorld';
import { RichLine } from './final/RichLine';
import { breakLines } from './final/lines';
import { em, richMeasurer, textWidth, useTypeReady, type FontSpec } from './final/close-measure';
import { S10 } from './final/timing';
import type { SceneProps } from './types';

/**
 * Scene 10 — Final Message & End Card · IMPACT (sign-off). 330 f, enters on a 10 f dip to ink.
 *
 *   0 – 10    Dip in: a small pile of the old process on a dim desk, in a pool of light.
 *             No type.
 *   12 → 28   MANUAL (display L) rises beside it — his line's place and the word sit centred
 *             in frame as one group.
 *   24 → 48   One orange hairline glides across. Behind it warm daylight comes up (a soft
 *             light front, not a slide wipe); each artefact it reaches straightens, drops
 *             onto the line and tips flat into his single orange line — except one unsigned
 *             form, which squares up and rests below the line (paper reduced, not gone). The
 *             word wipes from MANUAL to AUTOMATED as the line crosses it (≈ 34 → 43).
 *   ≈43 – 64  Held: one line, one word, one sheet.
 *   64 → 72   They leave; the warm paper world (Scene 06's) stays, window light drifting.
 *   74 → 94   "No previous automation experience." (centred)
 *   94 – 104  Pause.
 *   104 → 132 "Just curiosity, ownership, / and *the drive to improve.*" — balanced lines in a
 *             measured width; only *the drive to improve* in the human voice. Line 1 steps back.
 *   132 – 190 Held (58 f).
 *   190       Hard cut to ink.
 *   190 →     End card builds in ≈ 32 f (rule → line word by word → orange full stop →
 *             tagline → meta) and holds still 108 f to the last frame.
 */

/**
 * The light front. The hairline carries the light: everything behind it is in warm
 * daylight, and the light spills a little ahead of it (a soft edge of `FRONT` px) onto the
 * dim desk — so the line reads as the leading edge of the light, never as a shadow band.
 */
const FRONT = 190;
const SPILL_BEHIND = 24;
/** MANUAL's own light front: its letters fade only this far ahead of the line. */
const WORD_FRONT = 100;
/**
 * MANUAL burns out in the light spill just before the line reaches its first letter (from
 * this far ahead of it to just past it), so AUTOMATED wipes on into clean space and no
 * frame ever mixes the two words.
 */
const WORD_BURN = { from: -150, to: 10 } as const;

/** MANUAL / AUTOMATED: display L, fitted down (never up) if a story's word is longer. */
const WORD: FontSpec = { family: fonts.sans, weight: type.displayL.fontWeight, size: 120, tracking: -0.02 };
const WORD_MAX_WIDTH = 760;

/** Final lines: display M at 72, centred, wrapped inside a measured width. */
const LINE: FontSpec = { family: fonts.sans, weight: type.displayM.fontWeight, size: 72, tracking: em(type.displayM.letterSpacing) };
const LINE_MEASURE = 1120;
/** Vertical centre of the block of final lines (Story 01: line 1 at 350, line 2 at 480 / 566). */
const LINES_CENTRE_Y = 496;
/** Between the lines of one sentence / between the two sentences. */
const LINE_GAP = 10;
const SENTENCE_GAP = 54;

/** Frame position of the sweep. */
const sweepEase = glide(S10.sweep.v, S10.sweep.v);
const sweepAt = (frame: number) => lerp(S10.sweep.x0, S10.sweep.x1, progress(frame, S10.sweep.at, S10.sweep.dur, sweepEase));
/** Shutter: a moving hairline leaves a faint trail of half its travel per frame, as a camera would record it. */
const SHUTTER = 0.5;
/** Push at mid-sweep — fixed, so each artefact's fold frame never flickers with the camera. */
const HIT_PUSH = lerp(S10.push.from, S10.push.to, (S10.sweep.at + S10.sweep.dur / 2) / S10.push.until);

/** Frame at which the sweep reaches frame-x. */
const hitTable = (() => {
  const table: number[] = [];
  for (let f = S10.sweep.at; f <= S10.sweep.at + S10.sweep.dur; f++) table.push(sweepAt(f));
  return (x: number) => {
    const i = table.findIndex((v) => v >= x);
    return S10.sweep.at + (i === -1 ? S10.sweep.dur : i);
  };
})();

/**
 * Mask for the dim (BEFORE) layers: transparent behind the line, the dim desk ahead of it.
 * The spill only grows as the line comes into frame, so nothing is lit before it arrives.
 */
const frontMask = (x: number): React.CSSProperties => {
  const front = Math.max(1, Math.min(FRONT, x + SPILL_BEHIND));
  const mask = `linear-gradient(90deg, rgba(0,0,0,0) ${x - SPILL_BEHIND}px, rgba(0,0,0,0.5) ${x + front * 0.3}px, #000 ${x + front}px)`;
  return { WebkitMaskImage: mask, maskImage: mask };
};

/** MANUAL's own light front (word-local x): gone at the line, full strength a short way ahead. */
const wordFade = (x: number): React.CSSProperties => {
  const mask = `linear-gradient(90deg, rgba(0,0,0,0) ${x}px, rgba(0,0,0,0.6) ${x + WORD_FRONT * 0.45}px, #000 ${x + WORD_FRONT}px)`;
  return { WebkitMaskImage: mask, maskImage: mask };
};

export const FinalScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const { from, to, lines } = story.final;

  // measured type: the word's size and the group's centring, and the final lines' breaks
  const measurer = useMemo(() => richMeasurer(LINE), []);
  const ready = useTypeReady(useMemo(() => [WORD, ...measurer.specs], [measurer]));
  const word = useMemo(() => {
    const natural = Math.max(textWidth(from, WORD), textWidth(to, WORD));
    const size = natural > WORD_MAX_WIDTH ? WORD.size * (WORD_MAX_WIDTH / natural) : WORD.size;
    return { size, width: natural * (size / WORD.size) };
    // re-measure once the faces are in
  }, [from, to, ready]);
  const finalLines = useMemo(() => lines.map((text) => breakLines(text, LINE_MEASURE, richMeasurer(LINE))), [lines, ready]);
  const layout = callbackLayout(word.width);
  const origin = { x: layout.cx, y: layout.cy };
  const wordBox = Math.ceil(word.width + word.size * 0.4);

  // the sweep, in frame coordinates
  const sweepP = progress(frame, S10.sweep.at, S10.sweep.dur, sweepEase);
  const sweepX = sweepAt(frame);
  const smear = Math.min(90, Math.max(0, (sweepX - sweepAt(frame - 1)) * SHUTTER));

  // picture camera: a slow push on the pile / line (the type stays outside it)
  const push = lerp(S10.push.from, S10.push.to, mapClamp(frame, [0, S10.push.until], [0, 1]));
  const localSweep = 960 + (sweepX - 960) / push;
  const dimVisible = sweepP < 1;

  // AUTOMATED, his line and the sheet leave together
  const outSpan = [S10.callbackOut, S10.callbackOut + S10.callbackOutDur] as const;
  const out = span(frame, outSpan, ease.in);
  const callbackVisible = frame < outSpan[1];

  // his line: forms behind the sweep, retracts to its centre as it leaves
  const lineEnd = Math.min(layout.x2, localSweep - 60);
  const lx1 = lerp(layout.x1, layout.cx, out);
  const lx2 = lerp(lineEnd, layout.cx, out);
  const pool = { x: layout.cx + PILE_POOL.dx, y: layout.cy + PILE_POOL.dy };

  // MANUAL's burn-out as the light reaches it
  const manualLeft = 1 - mapClamp(sweepX - layout.wordX, [WORD_BURN.from, WORD_BURN.to], [0, 1], ease.inOut);

  // final lines
  const beats = [S10.line1, S10.line2];
  const line1Dim = lerp(1, S10.line1Dim, progress(frame, S10.line2.at, 22, ease.inOut));

  if (frame >= S10.cutToInk) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.ink }}>
        <EndCard start={S10.endCard} />
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
                  background: `radial-gradient(ellipse 620px 500px at ${pool.x}px ${pool.y}px, rgba(255,238,215,0.09) 0%, rgba(255,238,215,0) 72%)`,
                }}
              />
            </AbsoluteFill>
          ) : null}

          {/* the old pile: folding into his line; one sheet squares up and stays */}
          <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${10 * out}px)` }}>
            <ManualPile frame={frame} origin={origin} hitAt={(x) => hitTable(960 + (x - 960) * HIT_PUSH)} collapse={S10.collapse} settle={S10.settle} />
          </AbsoluteFill>

          {/* his single line, forming behind the sweep (over the folding pile, so it is what they become) */}
          {lineEnd > layout.x1 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - progress(out, 0.6, 0.4) }}>
              <line x1={lx1} y1={layout.cy} x2={Math.max(lx1, lx2)} y2={layout.cy} stroke={colors.accent} strokeWidth={CALLBACK.lineWidth} strokeLinecap="round" />
            </svg>
          ) : null}

          {/* dim light falling off around the pile, ahead of the light front */}
          {dimVisible ? (
            <AbsoluteFill
              style={{
                ...frontMask(localSweep),
                background: `radial-gradient(ellipse 560px 460px at ${pool.x}px ${pool.y}px, rgba(8,9,11,0.16) 0%, rgba(8,9,11,0.42) 62%, rgba(8,9,11,0.66) 100%)`,
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

      {/* MANUAL → AUTOMATED: the word wipes with the line (outside the push — display type never scales) */}
      {callbackVisible ? (
        <div
          style={{
            position: 'absolute',
            left: layout.wordX,
            // cap height centred on his line
            top: layout.cy - word.size * 0.5,
            width: wordBox,
            height: word.size * 1.2,
            ...type.displayL,
            fontSize: word.size,
            letterSpacing: `${WORD.tracking}em`,
            whiteSpace: 'nowrap',
            opacity: 1 - out,
            transform: `translateY(${-14 * out}px)`,
          }}
        >
          {/* MANUAL dims away in the light spilling just ahead of the line, so the swap reads as light, never a garbled word */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: wordBox, color: colors.textOnDark, opacity: manualLeft, clipPath: `inset(0 0 0 ${Math.max(0, sweepX - layout.wordX)}px)`, ...wordFade(sweepX - layout.wordX) }}>
            <MaskedReveal start={S10.fromIn} duration={S10.fromDur}>
              {from}
            </MaskedReveal>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: wordBox, color: colors.textOnLight, clipPath: `inset(0 ${Math.max(0, wordBox - (sweepX - layout.wordX))}px 0 0)` }}>
            {to}
          </div>
        </div>
      ) : null}

      {/* No previous automation experience. / Just curiosity, ownership, and the drive to improve. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: LINES_CENTRE_Y * 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          ...type.displayM,
          fontSize: LINE.size,
          color: colors.textOnLight,
        }}
      >
        {finalLines.map((sentence, si) => {
          const beat = beats[si];
          if (!beat) return null;
          const stagger = 'stagger' in beat ? beat.stagger : 6;
          return (
            <div key={si} style={{ marginTop: si ? SENTENCE_GAP : 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: LINE_GAP, opacity: si === 0 ? line1Dim : 1 }}>
              {sentence.map((text, li) => (
                // the measure decides the breaks; the CSS width is only a safety net
                <div key={li} style={{ maxWidth: LINE_MEASURE * 1.06, textAlign: 'center' }}>
                  <MaskedReveal start={beat.at + li * stagger} duration={beat.dur}>
                    <RichLine text={text} emphasis="serif" />
                  </MaskedReveal>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

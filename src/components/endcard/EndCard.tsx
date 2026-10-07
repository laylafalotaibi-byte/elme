import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, layout, toneColors, type, type Tone } from '../../campaign/theme';
import { ease, progress, springAt, springs } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { MaskedReveal } from '../typography/Reveal';

/**
 * Campaign end card — identical layout for every story; only the story number, sector,
 * optional tagline and optional logo change (all from the story config).
 *
 *   WE FOUND A
 *   BETTER WAY.            ← full stop in accent orange, lands last
 *   Small improvements can create meaningful impact.
 *   ───────────────────────────────────────────────
 *   Story 01                          Corporate Technology
 *
 * Paced to the design system (§10): the whole card builds in ≤ 35 f, then holds still.
 *   0       the rule starts to draw (30 f)
 *   2 → 32  the line rises word by word (3 f stagger, 18 f each)
 *   +8      the orange full stop lands after the last word starts (spring)
 *   then    tagline, and Story / sector 2 f later (12 f each)
 */

export const storyNumberLabel = (n: number) => String(n).padStart(2, '0');

const PACE = {
  rule: 30,
  wordStart: 2,
  wordStagger: 2,
  wordDur: 18,
  /** Full stop, after the last word starts. */
  periodAfter: 8,
  tagline: { after: 0, dur: 12 },
  meta: { after: 2, dur: 12 },
} as const;

/** Frames from `start` until every part of the card is still. */
export const endCardBuild = (wordCount: number) => {
  const lastWordAt = PACE.wordStart + (wordCount - 1) * PACE.wordStagger;
  const periodAt = lastWordAt + PACE.periodAfter;
  return Math.max(lastWordAt + PACE.wordDur, periodAt + PACE.meta.after + PACE.meta.dur, periodAt + 12, PACE.rule);
};

/** Split the campaign line into two balanced lines (longer line first). */
const splitLine = (line: string): [string[], string[]] => {
  const words = line.trim().replace(/\.$/, '').split(/\s+/);
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut), words.slice(cut)];
};

export const EndCard: React.FC<{ start?: number; tone?: Tone }> = ({ start = 0, tone = 'dark' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { story } = useStory();
  const { campaign } = story;
  const c = toneColors(tone);
  const f = frame - start;

  const [lineA, lineB] = splitLine(campaign.endLine);
  const hasPeriod = campaign.endLine.trim().endsWith('.');
  const lastWordAt = PACE.wordStart + (lineA.length + lineB.length - 1) * PACE.wordStagger;
  const periodAt = lastWordAt + PACE.periodAfter;
  const period = springAt(f, fps, periodAt, springs.busy);
  const rule = progress(f, 0, PACE.rule, ease.inOut);
  const tagline = progress(f, periodAt + PACE.tagline.after, PACE.tagline.dur);
  const meta = progress(f, periodAt + PACE.meta.after, PACE.meta.dur);

  let wordIndex = 0;
  const renderWords = (words: string[]) =>
    words.map((w, i) => {
      const at = start + PACE.wordStart + wordIndex++ * PACE.wordStagger;
      return (
        <React.Fragment key={`${w}-${i}`}>
          <MaskedReveal start={at} duration={PACE.wordDur}>
            {w}
          </MaskedReveal>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      );
    });

  return (
    <AbsoluteFill style={{ padding: `${layout.marginY}px ${layout.marginX}px` }}>
      <div style={{ position: 'absolute', left: layout.marginX, top: 250, ...type.displayL, fontSize: 156, lineHeight: 0.98, letterSpacing: '-0.04em', color: c.text }}>
        <div>{renderWords(lineA)}</div>
        <div>
          {renderWords(lineB)}
          {hasPeriod ? (
            <span
              style={{
                display: 'inline-block',
                // the full stop is its own span (it lands last), so restore the Y–period kerning by hand
                marginLeft: '-0.07em',
                color: colors.accent,
                opacity: Math.min(1, period * 2),
                transform: `translateY(${(1 - period) * 18}px) scale(${0.6 + 0.4 * period})`,
                transformOrigin: '50% 80%',
              }}
            >
              .
            </span>
          ) : null}
        </div>
      </div>

      {campaign.tagline ? (
        <div
          style={{
            position: 'absolute',
            left: layout.marginX,
            top: 610,
            fontFamily: fonts.serif,
            fontStyle: 'italic',
            fontSize: 48,
            fontWeight: 300,
            lineHeight: 1.2,
            color: c.muted,
            opacity: tagline,
            transform: `translateY(${(1 - tagline) * 12}px)`,
          }}
        >
          {campaign.tagline}
        </div>
      ) : null}

      <div style={{ position: 'absolute', left: layout.marginX, right: layout.marginX, bottom: 150 }}>
        <div style={{ height: 1, background: c.line, width: `${rule * 100}%` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, opacity: meta }}>
          <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em', color: c.text }}>
            {campaign.storyLabel} {storyNumberLabel(campaign.storyNumber)}
          </span>
          {campaign.logo ? (
            <Img src={staticFile(campaign.logo)} style={{ height: 40, objectFit: 'contain' }} />
          ) : (
            <span style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 30, letterSpacing: '-0.01em', color: c.muted }}>{campaign.sector}</span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

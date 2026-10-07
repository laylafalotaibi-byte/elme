import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { colors, fonts, layout, toneColors, type, type Tone } from '../../campaign/theme';
import { ease, progress, springAt, springs } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { MaskedReveal } from '../typography/Reveal';

/**
 * Campaign end card — identical layout for every story; only the story number, sector,
 * optional tagline and optional logo change (all from the story config).
 *
 *   STORY 01 — CORPORATE TECHNOLOGY
 *   WE FOUND A
 *   BETTER WAY.            ← full stop in accent orange, lands last
 *   Small improvements can create meaningful impact.
 *   ───────────────────────────────────────────────
 *   01                                Corporate Technology
 */

export const storyNumberLabel = (n: number) => String(n).padStart(2, '0');

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
  const wordStart = 14;
  const wordStagger = 5;
  const lastWordAt = wordStart + (lineA.length + lineB.length - 1) * wordStagger;
  const periodAt = lastWordAt + 16;
  const period = springAt(f, fps, periodAt, springs.busy);
  const rule = progress(f, 4, 40, ease.inOut);
  const kicker = progress(f, 6, 22);
  const tagline = progress(f, periodAt + 10, 26);
  const meta = progress(f, periodAt + 18, 26);

  let wordIndex = 0;
  const renderWords = (words: string[]) =>
    words.map((w, i) => {
      const at = start + wordStart + wordIndex++ * wordStagger;
      return (
        <React.Fragment key={`${w}-${i}`}>
          <MaskedReveal start={at} duration={24}>
            {w}
          </MaskedReveal>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      );
    });

  return (
    <AbsoluteFill style={{ padding: `${layout.marginY}px ${layout.marginX}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: kicker, transform: `translateY(${(1 - kicker) * 8}px)` }}>
        <span style={{ width: 7, height: 7, borderRadius: 7, background: colors.accent }} />
        <span style={{ ...type.kicker, color: c.muted }}>
          Story {storyNumberLabel(campaign.storyNumber)} — {campaign.sector}
        </span>
      </div>

      <div style={{ position: 'absolute', left: layout.marginX, top: 300, ...type.displayL, fontSize: 150, lineHeight: 0.98, letterSpacing: '-0.04em', color: c.text }}>
        <div>{renderWords(lineA)}</div>
        <div>
          {renderWords(lineB)}
          {hasPeriod ? (
            <span
              style={{
                display: 'inline-block',
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
            top: 650,
            fontFamily: fonts.serif,
            fontStyle: 'italic',
            fontSize: 46,
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
            Story {storyNumberLabel(campaign.storyNumber)}
          </span>
          {campaign.logo ? (
            <Img src={staticFile(campaign.logo)} style={{ height: 40, objectFit: 'contain' }} />
          ) : (
            <span style={{ ...type.label, fontSize: 15, color: c.muted }}>{campaign.sector}</span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

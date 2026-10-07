import React from 'react';
import { colors, fonts } from '../../campaign/theme';

/**
 * Copy can wrap words in *asterisks* to switch to the campaign's "human voice"
 * (Newsreader italic). The asterisks are never rendered.
 */

export type Segment = { text: string; emphasis: boolean };

export const parseRich = (text: string): Segment[] => {
  const parts = text.split('*');
  return parts
    .map((part, i) => ({ text: part, emphasis: i % 2 === 1 }))
    .filter((s) => s.text.length > 0);
};

export type EmphasisStyle = 'serif' | 'serifAccent' | 'accent' | 'none';

export const emphasisStyle = (style: EmphasisStyle): React.CSSProperties => {
  switch (style) {
    case 'serif':
      return { fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 300, letterSpacing: '-0.015em' };
    case 'serifAccent':
      return { fontFamily: fonts.serif, fontStyle: 'italic', fontWeight: 300, letterSpacing: '-0.015em', color: colors.accent };
    case 'accent':
      return { color: colors.accent };
    case 'none':
      return {};
  }
};

/**
 * Splits rich text into word tokens (keeping each word's emphasis flag) so word-by-word
 * reveals can still honour emphasis.
 */
export const richWords = (text: string): Segment[] =>
  parseRich(text).flatMap((seg) =>
    seg.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ text: word, emphasis: seg.emphasis })),
  );

export const RichText: React.FC<{ text: string; emphasis?: EmphasisStyle; style?: React.CSSProperties }> = ({
  text,
  emphasis = 'serif',
  style,
}) => (
  <span style={style}>
    {parseRich(text).map((seg, i) =>
      seg.emphasis ? (
        <span key={i} style={emphasisStyle(emphasis)}>
          {seg.text}
        </span>
      ) : (
        <React.Fragment key={i}>{seg.text}</React.Fragment>
      ),
    )}
  </span>
);

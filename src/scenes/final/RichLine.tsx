import React from 'react';
import { emphasisStyle, parseRich, type EmphasisStyle } from '../../components/typography/RichText';

/**
 * RichText with an optical size match: Newsreader Light italic sits visibly smaller than
 * Inter Tight at the same pixel size, so the human-voice words are set ≈ 8 % larger to
 * read as the same line, not a footnote. Same emphasis tokens as the shared RichText.
 */
export const RichLine: React.FC<{ text: string; emphasis?: EmphasisStyle; optical?: number }> = ({ text, emphasis = 'serif', optical = 1.08 }) => (
  <span>
    {parseRich(text).map((seg, i) =>
      seg.emphasis ? (
        <span key={i} style={{ ...emphasisStyle(emphasis), fontSize: `${optical}em`, lineHeight: 1 }}>
          {seg.text}
        </span>
      ) : (
        <React.Fragment key={i}>{seg.text}</React.Fragment>
      ),
    )}
  </span>
);

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { dur as durations, ease, progress, stagger as staggers } from '../../campaign/motion';
import { emphasisStyle, type EmphasisStyle, richWords } from './RichText';

/**
 * Masked reveals — the campaign's only text entrance. Content rises from behind an
 * invisible mask; nothing types, bounces or flies in.
 */

type ExitSpec = { at: number; duration?: number };

const exitValues = (frame: number, exit?: ExitSpec) => {
  if (!exit) return { opacity: 1, y: 0 };
  const p = progress(frame, exit.at, exit.duration ?? durations.exit, ease.in);
  return { opacity: 1 - p, y: -0.18 * p };
};

/** Padding/margin pair that lets a masked line keep its descenders and italic overhang. */
export const MASK_PADDING = { padding: '0.06em 0.12em 0.16em 0.04em', margin: '-0.06em -0.12em -0.16em -0.04em' } as const;

/** Mask wrapper that leaves room for descenders and italic overhang. */
export const Mask: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span
    style={{
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'top',
      ...MASK_PADDING,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Reveals one block (a line, a label, any node) from behind a mask. */
export const MaskedReveal: React.FC<{
  start: number;
  duration?: number;
  /** Rise distance in em. */
  distance?: number;
  exit?: ExitSpec;
  children: React.ReactNode;
  style?: React.CSSProperties;
  block?: boolean;
}> = ({ start, duration = durations.line, distance = 1.05, exit, children, style, block = false }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, duration, ease.out);
  const out = exitValues(frame, exit);
  return (
    <Mask style={{ display: block ? 'block' : 'inline-block', ...style }}>
      <span
        style={{
          display: block ? 'block' : 'inline-block',
          transform: `translateY(${(1 - p) * distance + out.y}em)`,
          opacity: Math.min(1, p * 1.4) * out.opacity,
        }}
      >
        {children}
      </span>
    </Mask>
  );
};

/**
 * Word-by-word masked reveal for rich text (supports *emphasis*). Words wrap naturally,
 * so the parent controls width and alignment.
 */
export const WordReveal: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  duration?: number;
  emphasis?: EmphasisStyle;
  exit?: ExitSpec;
  style?: React.CSSProperties;
}> = ({ text, start, stagger = staggers.word, duration = durations.word, emphasis = 'serif', exit, style }) => {
  const frame = useCurrentFrame();
  const words = richWords(text);
  const out = exitValues(frame, exit);
  return (
    <span style={{ ...style, opacity: out.opacity, display: 'inline', transform: undefined }}>
      {words.map((word, i) => {
        const p = progress(frame, start + i * stagger, duration, ease.out);
        return (
          <React.Fragment key={i}>
            <Mask>
              <span
                style={{
                  display: 'inline-block',
                  transform: `translateY(${(1 - p) * 1.05 + out.y}em)`,
                  opacity: Math.min(1, p * 1.5),
                  ...(word.emphasis ? emphasisStyle(emphasis) : {}),
                }}
              >
                {word.text}
              </span>
            </Mask>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </span>
  );
};

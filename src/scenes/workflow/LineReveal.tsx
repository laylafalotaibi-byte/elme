import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ease, progress } from '../../campaign/motion';

/**
 * A line that rises as one thought: every word rises from its own mask with a very small
 * stagger, so wrapped lines rise together. Unlike the shared WordReveal it can keep a
 * phrase (e.g. the role "IT Support") unbroken, and it balances the wrap.
 */
export const tokenize = (text: string, keepTogether: string[] = []) => {
  let marked = text;
  keepTogether.filter(Boolean).forEach((phrase) => {
    marked = marked.split(phrase).join(phrase.replace(/\s+/g, '\u0000'));
  });
  return marked.split(/\s+/).filter(Boolean).map((t) => t.replace(/\u0000/g, ' '));
};

export const lineRevealEnd = (text: string, start: number, stagger = 2, duration = 22, keepTogether: string[] = []) =>
  start + Math.max(0, tokenize(text, keepTogether).length - 1) * stagger + duration;

export const LineReveal: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  duration?: number;
  keepTogether?: string[];
  /** Fade/rise out: starts at `exitAt`, lasts `exitDuration`. */
  exitAt?: number;
  exitDuration?: number;
  style?: React.CSSProperties;
  /** Render at this frame instead of the current one. */
  frame?: number;
}> = ({ text, start, stagger = 2, duration = 22, keepTogether = [], exitAt, exitDuration = 14, style, frame: frameOverride }) => {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const tokens = tokenize(text, keepTogether);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, exitDuration, ease.in);
  return (
    <div style={{ textWrap: 'balance', opacity: 1 - out, ...style } as React.CSSProperties}>
      {tokens.map((token, i) => {
        const p = progress(frame, start + i * stagger, duration, ease.out);
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'top',
                padding: '0.06em 0.1em 0.16em 0.04em',
                margin: '-0.06em -0.1em -0.16em -0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 1.05 - out * 0.18}em)`, opacity: Math.min(1, p * 1.5) }}>{token}</span>
            </span>
            {i < tokens.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colors, toneColors, type, type Tone, type TypeStyle } from '../../campaign/theme';
import { progress } from '../../campaign/motion';

/** Applies a campaign type style and tone colour. */
export const Text: React.FC<{
  variant: TypeStyle;
  tone?: Tone;
  color?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  as?: 'div' | 'span';
}> = ({ variant, tone = 'dark', color, children, style, as = 'div' }) => {
  const Tag = as;
  return <Tag style={{ ...type[variant], color: color ?? toneColors(tone).text, margin: 0, ...style }}>{children}</Tag>;
};

/**
 * Kicker — small mono label with an optional orange signal dot and a hairline that draws
 * in. Used for story / section labels.
 */
export const Kicker: React.FC<{
  text: string;
  start?: number;
  tone?: Tone;
  dot?: boolean;
  rule?: number;
  style?: React.CSSProperties;
}> = ({ text, start = 0, tone = 'dark', dot = true, rule = 0, style }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, 20);
  const r = progress(frame, start + 6, 30);
  const c = toneColors(tone);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: p, ...style }}>
      {dot ? <span style={{ width: 7, height: 7, borderRadius: 7, background: colors.accent, flexShrink: 0 }} /> : null}
      <span style={{ ...type.kicker, color: c.muted, transform: `translateX(${(1 - p) * -8}px)` }}>{text}</span>
      {rule > 0 ? <span style={{ height: 1, width: rule * r, background: c.line, marginLeft: 6 }} /> : null}
    </div>
  );
};

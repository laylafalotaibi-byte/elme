import React from 'react';
import { colors } from '../../campaign/theme';

/**
 * Hairline glyphs drawn in SVG (the bundled font subsets do not include →, ✓ etc., and
 * drawn glyphs keep stroke weights consistent with the rest of the line work).
 * `draw` 0…1 animates the stroke.
 */

type GlyphProps = { size?: number; color?: string; strokeWidth?: number; draw?: number; style?: React.CSSProperties };

const dash = (length: number, draw = 1) => ({ strokeDasharray: length, strokeDashoffset: length * (1 - draw) });

export const ArrowRight: React.FC<GlyphProps & { length?: number }> = ({ size = 18, length, color = 'currentColor', strokeWidth = 1.6, draw = 1, style }) => {
  const w = length ?? size * 1.4;
  const h = size;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', ...style }}>
      <line x1={0} y1={h / 2} x2={w - 1} y2={h / 2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" style={dash(w, draw)} />
      <polyline
        points={`${w - h * 0.32},${h * 0.2} ${w - 1},${h / 2} ${w - h * 0.32},${h * 0.8}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={draw > 0.85 ? 1 : 0}
      />
    </svg>
  );
};

export const ArrowVertical: React.FC<GlyphProps & { direction: 'up' | 'down' }> = ({ size = 18, color = colors.accent, strokeWidth = 1.8, direction, style }) => (
  <svg width={size * 0.7} height={size} viewBox="0 0 14 20" style={{ overflow: 'visible', transform: direction === 'down' ? 'rotate(180deg)' : undefined, ...style }}>
    <line x1={7} y1={19} x2={7} y2={2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <polyline points="2,7 7,2 12,7" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Check: React.FC<GlyphProps> = ({ size = 16, color = colors.accent, strokeWidth = 1.8, draw = 1, style }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ overflow: 'visible', ...style }}>
    <polyline points="2.5,8.5 6.5,12.2 13.5,4" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={dash(18, draw)} />
  </svg>
);

/** The ┌ corner bracket used on metric pop-ups and annotations. */
export const CornerBracket: React.FC<{ size?: number; color?: string; draw?: number; strokeWidth?: number }> = ({ size = 14, color = 'currentColor', draw = 1, strokeWidth = 1.2 }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible', display: 'block' }}>
    <polyline
      points={`0,${size} 0,0 ${size},0`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      style={dash(size * 2, draw)}
    />
  </svg>
);

export const Dot: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 7, color = colors.accent, style }) => (
  <span style={{ display: 'inline-block', width: size, height: size, borderRadius: size, background: color, flexShrink: 0, ...style }} />
);

/** A hairline that draws from one point to another (absolute coordinates inside its parent). */
export const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number; draw?: number; color?: string; dashed?: boolean; width?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  draw = 1,
  color = 'currentColor',
  dashed = false,
  width = 1,
}) => {
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width={1} height={1}>
      <line
        x1={x1}
        y1={y1}
        x2={x1 + (x2 - x1) * draw}
        y2={y1 + (y2 - y1) * draw}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? '3 4' : undefined}
      />
      {draw > 0.98 ? <circle cx={x2} cy={y2} r={2.5} fill={color} /> : null}
    </svg>
  );
};

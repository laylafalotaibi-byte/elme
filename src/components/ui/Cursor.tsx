import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../campaign/theme';

/**
 * His cursor — the human presence on screen. Moves with eased, slightly overshooting
 * paths, hesitates, and clicks with a small ripple. Coordinates are in whatever space
 * the cursor is rendered in (usually the 1280×800 screen canvas).
 */
export type CursorKey = { frame: number; x: number; y: number };

export const Cursor: React.FC<{
  keys: CursorKey[];
  clicks?: number[];
  /** Show a text caret instead of the pointer (idle typing state). */
  caret?: boolean;
  scale?: number;
  color?: string;
  start?: number;
  end?: number;
}> = ({ keys, clicks = [], caret = false, scale = 1, color = '#111', start = -Infinity, end = Infinity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || frame > end || keys.length === 0) return null;

  // Position: spring between consecutive keys (slight overshoot = a human hand).
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const prev = keys[i - 1];
    const next = keys[i];
    if (frame < prev.frame) break;
    const p = spring({ frame: frame - prev.frame, fps, config: { damping: 18, stiffness: 90, mass: 0.9 }, durationInFrames: Math.max(8, next.frame - prev.frame) });
    x = prev.x + (next.x - prev.x) * p;
    y = prev.y + (next.y - prev.y) * p;
  }

  const lastClick = clicks.filter((c) => c <= frame).pop();
  const since = lastClick === undefined ? Infinity : frame - lastClick;
  const press = since < 8 ? interpolate(since, [0, 3, 8], [1, 0.86, 1]) : 1;
  const ripple = since < 18 ? since / 18 : 1;

  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', transform: `scale(${scale})`, transformOrigin: '0 0' }}>
      {since < 18 ? (
        <div
          style={{
            position: 'absolute',
            left: -22 * ripple,
            top: -22 * ripple,
            width: 44 * ripple,
            height: 44 * ripple,
            borderRadius: 999,
            border: `1.5px solid ${colors.accent}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      {caret ? (
        <div style={{ width: 2, height: 26, background: color, opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0, transform: 'translate(-1px, -13px)' }} />
      ) : (
        <svg width={26} height={30} viewBox="0 0 26 30" style={{ transform: `scale(${press})`, transformOrigin: '2px 2px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))' }}>
          <path d="M2 2 L2 23 L7.5 17.5 L11.5 27 L15 25.5 L11 16.5 L19 16.5 Z" fill={color} stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};

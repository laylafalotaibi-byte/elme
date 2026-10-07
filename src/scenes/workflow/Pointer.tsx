import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../campaign/theme';

/**
 * His cursor, positioned explicitly every frame (it rides the tip of a line as he draws).
 * Same pointer shape and click ripple as the shared <Cursor>, which springs between keys
 * and so cannot follow a path exactly.
 */
export const Pointer: React.FC<{
  x: number;
  y: number;
  /** Frames at which he clicks / presses. */
  clicks?: number[];
  /** Held down (dragging / drawing) 0…1 — a slight press. */
  down?: number;
  opacity?: number;
  scale?: number;
  frame?: number;
}> = ({ x, y, clicks = [], down = 0, opacity = 1, scale = 1.5, frame: frameOverride }) => {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  if (opacity <= 0.001) return null;
  const last = clicks.filter((c) => c <= frame).pop();
  const since = last === undefined ? Infinity : frame - last;
  const click = since < 8 ? interpolate(since, [0, 3, 8], [1, 0.86, 1]) : 1;
  const press = click * (1 - 0.08 * down);
  const ripple = since < 18 ? since / 18 : 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', opacity, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
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
      <svg width={26} height={30} viewBox="0 0 26 30" style={{ display: 'block', transform: `scale(${press})`, transformOrigin: '2px 2px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.22))' }}>
        <path d="M2 2 L2 23 L7.5 17.5 L11.5 27 L15 25.5 L11 16.5 L19 16.5 Z" fill="#111" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

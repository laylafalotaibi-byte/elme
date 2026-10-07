import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * His cursor — the human presence on screen. Moves with eased, slightly overshooting
 * paths, hesitates, and clicks with a small ripple. Coordinates are in whatever space
 * the cursor is rendered in (usually the 1280×800 screen canvas).
 *
 * Keys: each key is where a move STARTS; the move runs from that key's frame towards the
 * next key. A move interrupted by the next key continues from wherever it got to (no jump).
 * Alternatively pass `path(frame)` to drive the position yourself.
 *
 * Above ~60 px/frame a faint shutter smear is drawn behind the pointer, so fast moves read
 * as motion rather than strobing.
 */
export type CursorKey = { frame: number; x: number; y: number };
type Pt = { x: number; y: number };

const TRAIL_FROM = 60;
const TRAIL_STEPS = [0.12, 0.24, 0.36, 0.48, 0.6];

const keyPosition = (keys: CursorKey[], frame: number, fps: number): Pt => {
  let pos: Pt = { x: keys[0].x, y: keys[0].y };
  for (let i = 1; i < keys.length; i++) {
    const prev = keys[i - 1];
    const next = keys[i];
    if (frame < prev.frame) break;
    const from = pos;
    const p = spring({ frame: frame - prev.frame, fps, config: { damping: 18, stiffness: 90, mass: 0.9 }, durationInFrames: Math.max(8, next.frame - prev.frame) });
    // where this move is now — or where it had got to when the next move started
    const atNextStart = spring({ frame: next.frame - prev.frame, fps, config: { damping: 18, stiffness: 90, mass: 0.9 }, durationInFrames: Math.max(8, next.frame - prev.frame) });
    const t = i < keys.length - 1 && frame >= next.frame ? atNextStart : p;
    pos = { x: from.x + (next.x - from.x) * t, y: from.y + (next.y - from.y) * t };
    if (frame < next.frame) break;
  }
  return pos;
};

const Arrow: React.FC<{ color: string; press?: number; opacity?: number }> = ({ color, press = 1, opacity = 1 }) => (
  <svg
    width={26}
    height={30}
    viewBox="0 0 26 30"
    style={{ position: 'absolute', left: 0, top: 0, opacity, transform: `scale(${press})`, transformOrigin: '2px 2px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))' }}
  >
    <path d="M2 2 L2 23 L7.5 17.5 L11.5 27 L15 25.5 L11 16.5 L19 16.5 Z" fill={color} stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
  </svg>
);

export const Cursor: React.FC<{
  keys?: CursorKey[];
  /** Drive the position directly instead of using keys. */
  path?: (frame: number) => Pt;
  clicks?: number[];
  /** Show a text caret instead of the pointer (idle typing state). */
  caret?: boolean;
  scale?: number;
  color?: string;
  /** Click ripple colour — neutral by default; the accent is kept for meaningful clicks. */
  rippleColor?: string;
  start?: number;
  end?: number;
  opacity?: number;
}> = ({ keys = [], path, clicks = [], caret = false, scale = 1, color = '#111', rippleColor = 'rgba(20,21,22,0.45)', start = -Infinity, end = Infinity, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || frame > end || (!path && keys.length === 0)) return null;

  const at = (f: number): Pt => (path ? path(f) : keyPosition(keys, f, fps));
  const pos = at(frame);
  const prev = at(frame - 1);
  const speed = Math.hypot(pos.x - prev.x, pos.y - prev.y);
  const smear = caret ? 0 : Math.min(1, Math.max(0, (speed - TRAIL_FROM) / 110));

  const lastClick = clicks.filter((c) => c <= frame).pop();
  const since = lastClick === undefined ? Infinity : frame - lastClick;
  const press = since < 8 ? interpolate(since, [0, 3, 8], [1, 0.86, 1]) : 1;
  const ripple = since < 18 ? since / 18 : 1;

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity }}>
      {smear > 0.02
        ? TRAIL_STEPS.map((dt, k) => {
            const p = at(frame - dt);
            return (
              <div key={k} style={{ position: 'absolute', left: p.x, top: p.y, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
                <Arrow color={color} opacity={smear * 0.2 * (1 - k / TRAIL_STEPS.length)} />
              </div>
            );
          })
        : null}
      <div style={{ position: 'absolute', left: pos.x, top: pos.y, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        {since < 18 ? (
          <div
            style={{
              position: 'absolute',
              left: -22 * ripple,
              top: -22 * ripple,
              width: 44 * ripple,
              height: 44 * ripple,
              borderRadius: 999,
              border: `1.5px solid ${rippleColor}`,
              opacity: 1 - ripple,
            }}
          />
        ) : null}
        {caret ? (
          <div style={{ width: 2, height: 26, background: color, opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0, transform: 'translate(-1px, -13px)' }} />
        ) : (
          <Arrow color={color} press={press} />
        )}
      </div>
    </div>
  );
};

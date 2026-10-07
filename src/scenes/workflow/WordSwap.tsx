import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ease, progress } from '../../campaign/motion';

/**
 * One word at a time in one place: each word rises from behind a mask and, when the next
 * arrives, lifts slightly and fades — it is replaced, never stacked. The outgoing word is
 * gone before the incoming one clears its mask, so the two never collide in the same slot.
 */
export const WordSwap: React.FC<{
  words: string[];
  /** Frame at which each word starts to rise. */
  starts: number[];
  /** Rise duration. */
  duration?: number;
  /** How long the outgoing word takes to leave (it starts leaving `lead` frames before the next arrives). */
  exitDuration?: number;
  lead?: number;
  style?: React.CSSProperties;
  /** Render at this frame instead of the current one (Scene 06 holds Scene 05's last frame). */
  frame?: number;
}> = ({ words, starts, duration = 16, exitDuration = 7, lead = 5, style, frame: frameOverride }) => {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  return (
    <div style={{ position: 'relative', ...style }}>
      {words.map((word, i) => {
        const start = starts[i];
        if (start === undefined || frame < start) return null;
        const next = starts[i + 1];
        const pIn = progress(frame, start, duration, ease.out);
        const pOut = next === undefined ? 0 : progress(frame, next - lead, exitDuration, ease.inOut);
        if (pOut >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              overflow: 'hidden',
              padding: '0.06em 0.12em 0.16em 0.04em',
              margin: '-0.06em -0.12em -0.16em -0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                transform: `translateY(${(1 - pIn) * 1.05 - pOut * 0.28}em)`,
                opacity: Math.min(1, pIn * 1.4) * (1 - pOut),
              }}
            >
              {word}
            </div>
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, toneColors, type, type Tone } from '../../campaign/theme';
import { ease, progress, springAt, springs } from '../../campaign/motion';
import { Dot } from '../glyphs/Glyphs';

/**
 * Floating contextual annotation — a premium UI tag, not a PowerPoint label.
 * Small mono text in a hairline pill, signal dot, optional leader to what it describes.
 */
export const Annotation: React.FC<{
  text: string;
  x: number;
  y: number;
  start: number;
  exitAt?: number;
  tone?: Tone;
  /** Leader line end point relative to the chip's left-centre. */
  leader?: { x: number; y: number };
  busy?: boolean;
}> = ({ text, x, y, start, exitAt, tone = 'dark', leader, busy = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start) return null;
  const s = springAt(frame, fps, start, busy ? springs.busy : springs.calm);
  const lead = progress(frame, start + 6, 14, ease.inOut);
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, 12, ease.in);
  const c = toneColors(tone);
  const dark = tone === 'dark';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: Math.min(1, s * 1.3) * (1 - exit),
        transform: `translateY(${(1 - s) * 8}px) scale(${0.94 + 0.06 * s})`,
        transformOrigin: 'left center',
      }}
    >
      {leader ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
          <line x1={0} y1={0} x2={leader.x * lead} y2={leader.y * lead} stroke={c.faint} strokeWidth={1} />
          {lead > 0.98 ? <circle cx={leader.x} cy={leader.y} r={2.5} fill={colors.accent} /> : null}
        </svg>
      ) : null}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          transform: 'translateY(-50%)',
          padding: '9px 14px 9px 12px',
          borderRadius: 999,
          background: dark ? 'rgba(24,26,30,0.78)' : 'rgba(251,250,247,0.85)',
          boxShadow: `0 0 0 1px ${dark ? 'rgba(255,255,255,0.12)' : colors.stoneLine}, 0 10px 24px -12px rgba(0,0,0,0.5)`,
          backdropFilter: 'blur(10px)',
          whiteSpace: 'nowrap',
        }}
      >
        <Dot size={6} />
        <span style={{ ...type.label, fontSize: 13, color: c.text }}>{text}</span>
      </div>
    </div>
  );
};

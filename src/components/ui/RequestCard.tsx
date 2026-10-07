import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, radii, shadows, toneColors, type, type Tone } from '../../campaign/theme';
import { progress, springAt, springs } from '../../campaign/motion';
import type { RequestCard as RequestCardData } from '../../campaign/types';
import { Check } from '../glyphs/Glyphs';

/**
 * The incoming request notification. The same card opens Scene 01 (BEFORE) and Scene 07
 * (AFTER) — same trigger, different experience.
 */
export const RequestCard: React.FC<{
  data: RequestCardData;
  x: number;
  y: number;
  start: number;
  tone?: Tone;
  width?: number;
  /** Replace the status chip with a resolved tick at this frame. */
  resolvedAt?: number;
  resolvedLabel?: string;
  busy?: boolean;
  style?: React.CSSProperties;
}> = ({ data, x, y, start, tone = 'dark', width = 540, resolvedAt, resolvedLabel = 'Done', busy = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = springAt(frame, fps, start, busy ? springs.busy : springs.calm);
  const pulse = progress(frame, start + 6, 26);
  const resolved = resolvedAt === undefined ? 0 : progress(frame, resolvedAt, 16);
  const c = toneColors(tone);
  const dark = tone === 'dark';
  if (frame < start) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        opacity: Math.min(1, s * 1.4),
        transform: `translateX(${(1 - s) * 48}px)`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 18,
          padding: '22px 24px 22px 22px',
          borderRadius: radii.card,
          background: dark ? 'rgba(30,33,37,0.92)' : colors.paperRaised,
          boxShadow: `0 0 0 1px ${dark ? 'rgba(255,255,255,0.09)' : colors.stoneLine}, ${dark ? shadows.dark : shadows.light}`,
        }}
      >
        <div style={{ position: 'relative', width: 10, height: 10, marginTop: 8, flexShrink: 0 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 10, background: colors.accent, opacity: 1 - resolved }} />
          <span
            style={{
              position: 'absolute',
              inset: -10 * pulse,
              borderRadius: 30,
              border: `1px solid ${colors.accent}`,
              opacity: (1 - pulse) * 0.8 * (1 - resolved),
            }}
          />
          {resolved > 0 ? (
            <span style={{ position: 'absolute', left: -4, top: -4, opacity: resolved }}>
              <Check size={18} draw={resolved} />
            </span>
          ) : null}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
            <div style={{ ...type.body, fontWeight: 500, color: c.text, fontSize: 23 }}>{data.title}</div>
            <div style={{ ...type.label, fontSize: 11, color: c.muted }}>Now</div>
          </div>
          <div style={{ ...type.label, fontSize: 12, color: c.muted, marginTop: 10, letterSpacing: '0.1em' }}>{data.meta}</div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '5px 9px',
                borderRadius: 4,
                color: resolved > 0.5 ? c.muted : colors.accent,
                background: resolved > 0.5 ? 'transparent' : colors.accentSoft,
                boxShadow: resolved > 0.5 ? `0 0 0 1px ${c.line}` : undefined,
              }}
            >
              {resolved > 0.5 ? resolvedLabel : data.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

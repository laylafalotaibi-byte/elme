import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colors, fonts, toneColors, type, type Tone } from '../../campaign/theme';
import { ease, progress } from '../../campaign/motion';
import { findMetric, resolveMetric } from '../../campaign/metrics';
import { useStory } from '../../campaign/StoryContext';
import type { ResolvedMetric } from '../../campaign/types';
import { ArrowRight, ArrowVertical, CornerBracket } from '../glyphs/Glyphs';

/**
 * Metric pop-up — a minimal data overlay, not a dashboard card.
 *
 *   ┌ LABEL
 *     Value            (single · from → to · qualitative text)
 *     [TO VERIFY]      (draft composition only, when the value is a placeholder)
 *
 * Sequence: bracket draws → label → value rises → optional leader line draws.
 */

export type MetricPopupProps = {
  /** A resolved metric, or pass `metricId` to resolve from the story's metrics config. */
  metric?: ResolvedMetric;
  metricId?: string;
  x: number;
  y: number;
  start: number;
  /** Frame at which the pop-up starts to leave. */
  exitAt?: number;
  tone?: Tone;
  intent?: 'before' | 'after';
  /** Leader line to an anchor point, relative to the pop-up's top-left corner. */
  leader?: { x: number; y: number };
  /** Optional caption under the value. */
  caption?: string;
  valueSize?: number;
  width?: number;
};

const Value: React.FC<{ metric: ResolvedMetric; size: number; color: string; muted: string; p: number }> = ({ metric, size, color, muted, p }) => {
  const rise = { transform: `translateY(${(1 - p) * 1}em)`, opacity: Math.min(1, p * 1.4), display: 'inline-flex', alignItems: 'center', gap: size * 0.28 };
  const mask: React.CSSProperties = { overflow: 'hidden', padding: '0.04em 0.1em 0.14em 0', margin: '-0.04em -0.1em -0.14em 0', display: 'block' };
  const valueStyle: React.CSSProperties = { ...type.metricValue, fontSize: size, color, whiteSpace: 'nowrap' };

  if (metric.kind === 'fromTo') {
    return (
      <div style={{ ...mask, fontSize: size }}>
        <span style={{ ...rise, ...valueStyle }}>
          <span style={{ color: muted }}>{metric.from}</span>
          <ArrowRight size={size * 0.42} length={size * 0.75} color={colors.accent} strokeWidth={2} />
          <span>{metric.to}</span>
        </span>
      </div>
    );
  }
  const textSize = metric.kind === 'text' ? Math.round(size * 0.74) : size;
  return (
    <div style={{ ...mask, fontSize: textSize }}>
      <span style={{ ...rise, ...valueStyle, fontSize: textSize, letterSpacing: metric.kind === 'text' ? '-0.02em' : valueStyle.letterSpacing }}>
        {metric.direction ? <ArrowVertical direction={metric.direction} size={textSize * 0.62} /> : null}
        <span>{metric.value}</span>
      </span>
    </div>
  );
};

export const MetricPopup: React.FC<MetricPopupProps> = ({
  metric: metricProp,
  metricId,
  x,
  y,
  start,
  exitAt,
  tone = 'light',
  intent = 'after',
  leader,
  caption,
  valueSize = 56,
  width = 520,
}) => {
  const frame = useCurrentFrame();
  const { metrics, mode, story } = useStory();
  const metric = metricProp ?? resolveMetric(findMetric(metrics, metricId ?? ''), mode);
  const c = toneColors(tone);

  const bracket = progress(frame, start, 10, ease.out);
  const label = progress(frame, start + 4, 12);
  const value = progress(frame, start + 8, 18);
  const lead = progress(frame, start + 10, 18, ease.inOut);
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, 14, ease.in);
  if (frame < start) return null;

  const isPlaceholder = metric.status === 'placeholder';

  return (
    <div style={{ position: 'absolute', left: x, top: y, width, opacity: 1 - exit, transform: `translateY(${-8 * exit}px)` }}>
      {leader ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width={1} height={1}>
          <line x1={0} y1={0} x2={leader.x * lead} y2={leader.y * lead} stroke={c.faint} strokeWidth={1} />
          {lead > 0.98 ? <circle cx={leader.x} cy={leader.y} r={3} fill={intent === 'before' ? colors.accent : c.text} /> : null}
        </svg>
      ) : null}
      <div style={{ position: 'absolute', left: 0, top: 0, color: intent === 'before' ? colors.accent : c.muted }}>
        <CornerBracket size={16} draw={bracket} color="currentColor" strokeWidth={1.5} />
      </div>
      <div style={{ paddingLeft: 28, paddingTop: 0 }}>
        {metric.label ? (
          <div style={{ ...type.label, color: c.muted, opacity: label, transform: `translateX(${(1 - label) * -6}px)`, marginTop: -3 }}>{metric.label}</div>
        ) : null}
        <div style={{ marginTop: metric.label ? 14 : -4 }}>
          <Value metric={metric} size={valueSize} color={c.text} muted={c.muted} p={value} />
        </div>
        {isPlaceholder && mode === 'draft' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, opacity: value }}>
            <span style={{ height: 0, width: 120, borderTop: `1px dashed ${colors.accent}` }} />
            <span style={{ fontFamily: fonts.mono, fontSize: 14, letterSpacing: '0.14em', color: colors.accent, border: `1px solid ${colors.accent}`, padding: '4px 8px' }}>
              {story.ui.toVerify}
            </span>
          </div>
        ) : null}
        {caption ? <div style={{ ...type.caption, fontWeight: 400, color: c.muted, marginTop: 10, opacity: value }}>{caption}</div> : null}
      </div>
    </div>
  );
};

/** Pain indicator for BEFORE scenes: same anatomy, value is fact wording with a direction glyph. */
export const IndicatorPopup: React.FC<Omit<MetricPopupProps, 'metric' | 'metricId' | 'intent'> & { label: string; value: string; direction?: 'up' | 'down' }> = ({
  label,
  value,
  direction,
  ...rest
}) => (
  <MetricPopup
    {...rest}
    intent="before"
    tone={rest.tone ?? 'dark'}
    valueSize={rest.valueSize ?? 44}
    metric={{ id: label, label, status: 'qualitative', kind: 'text', value, direction }}
  />
);

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { colors, toneColors, type Tone } from '../../campaign/theme';
import { ease, progress } from '../../campaign/motion';
import type { Indicator } from '../../campaign/types';
import { IndicatorPopup } from '../../components/ui/MetricPopup';

/**
 * A pain indicator pinned to real objects: the shared IndicatorPopup (┌ LABEL ↓ value)
 * plus one or more hairline leaders from its bracket corner to the objects it describes
 * (the shared popup takes a single leader; RECORDS needs two — one per record place).
 * Leaders should leave the corner upwards or to the left so they never cross the copy.
 */
export const PinnedIndicator: React.FC<{
  indicator: Indicator | undefined;
  x: number;
  y: number;
  start: number;
  exitAt?: number;
  tone?: Tone;
  /** Anchor points, in the same coordinate space as x/y. */
  targets: Array<{ x: number; y: number }>;
  valueSize?: number;
  /** Leader draw duration (frames) — keep the whole build ≥ 10 f clear of a cut. */
  leadDuration?: number;
}> = ({ indicator, x, y, start, exitAt, tone = 'dark', targets, valueSize = 44, leadDuration = 18 }) => {
  const frame = useCurrentFrame();
  if (!indicator || frame < start) return null;
  const c = toneColors(tone);
  const lead = progress(frame, start + 10, leadDuration, ease.inOut);
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, 14, ease.in);
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity: 1 - exit }} width={1} height={1}>
        {targets.map((t, i) => {
          const p = progress(frame, start + 10 + i * 3, leadDuration, ease.inOut);
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + (t.x - x) * p} y2={y + (t.y - y) * p} stroke={c.faint} strokeWidth={1.2} />
              {p > 0.98 ? <circle cx={t.x} cy={t.y} r={3.5} fill={colors.accent} /> : null}
            </g>
          );
        })}
        {lead > 0 ? <circle cx={x} cy={y} r={1.5} fill={c.faint} /> : null}
      </svg>
      <IndicatorPopup label={indicator.label} value={indicator.value} direction={indicator.direction} x={x} y={y} start={start} exitAt={exitAt} tone={tone} valueSize={valueSize} />
    </>
  );
};

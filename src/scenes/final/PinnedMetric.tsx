import React from 'react';
import { findMetric, resolveMetric } from '../../campaign/metrics';
import { useStory } from '../../campaign/StoryContext';
import type { Tone } from '../../campaign/theme';
import type { RenderMode, MetricConfig } from '../../campaign/types';
import { MetricPopup } from '../../components/ui/MetricPopup';
import type { Pt } from './geometry';

/**
 * A <MetricPopup> pinned to a process object with a straight hairline leader that leaves
 * its ┌ corner — so the leader never crosses the pop-up's own type:
 *
 *   side 'below' — the pop-up hangs under the object; the leader rises from the corner.
 *   side 'above' — the pop-up sits over the object; the leader drops from the corner down
 *                  the pop-up's left edge (type starts 28 px in), past the body, to the object.
 *   side 'right' — the pop-up hangs to the right of the object; the leader runs level from
 *                  the corner back to it (•——┌), like the step words off his line in Scene 06.
 *
 * The body height depends on the render mode (the draft adds a label, a taller [X] value
 * and a TO VERIFY row), so 'above' placements are measured from the resolved metric and
 * the gap below the body stays the same in the final film and in the MetricsDraft.
 */

/** Height (px) of a MetricPopup body — mirrors MetricPopup's layout (valueSize 56). */
export const popupBodyHeight = (metrics: MetricConfig[], metricId: string, mode: RenderMode, valueSize = 56) => {
  const m = resolveMetric(findMetric(metrics, metricId), mode);
  const valueH = m.kind === 'text' ? Math.round(valueSize * 0.74) : valueSize;
  const top = m.label ? -3 + 24 + 14 : -4;
  const verify = m.status === 'placeholder' && mode === 'draft' ? 10 + 26 : 0;
  return top + valueH + verify;
};

export type Placement = {
  side: 'above' | 'below' | 'right';
  /**
   * 'above' / 'below': horizontal offset of the ┌ corner from the anchor (keep |dx| small:
   * ≤ 20 px to the right). 'right': vertical offset of the corner (0 = a level leader).
   */
  dx: number;
  /**
   * 'below': corner distance under the anchor. 'above': clear space between body and anchor.
   * 'right': length of the level leader, anchor → corner.
   */
  gap: number;
};

export const PinnedMetric: React.FC<{
  metricId: string;
  /** The object, in frame coordinates (already through the scene camera). */
  anchor: Pt;
  placement: Placement;
  start: number;
  exitAt?: number;
  tone?: Tone;
}> = ({ metricId, anchor, placement, start, exitAt, tone = 'light' }) => {
  const { metrics, mode } = useStory();
  const body = popupBodyHeight(metrics, metricId, mode);
  const corner =
    placement.side === 'right'
      ? { x: anchor.x + placement.gap, y: anchor.y + placement.dx }
      : { x: anchor.x + placement.dx, y: anchor.y + (placement.side === 'below' ? placement.gap : -(body + placement.gap)) };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${corner.x}px, ${corner.y}px)` }}>
      <MetricPopup metricId={metricId} x={0} y={0} start={start} exitAt={exitAt} tone={tone} leader={{ x: anchor.x - corner.x, y: anchor.y - corner.y }} />
    </div>
  );
};

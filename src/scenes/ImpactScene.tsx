import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { LIGHT, mixLight } from '../campaign/light';
import { mapClamp } from '../campaign/motion';
import { useStory } from '../campaign/StoryContext';
import { MetricPopup } from '../components/ui/MetricPopup';
import { AFTER_LAYOUT, AFTER_POINTER_HOME, CARD_H, OPENING_CAM, SCREEN_LAYOUT, camPoint, camTransform, screenPoint, type Cam, type Pt } from './person/geometry';
import { AFTER_RESOLVED, DESK_SHEET, OpeningWorkspace } from './person/OpeningSet';
import { s08Exit, s08Start } from './final/timing';
import type { SceneProps } from './types';

/**
 * Scene 08 — Impact · IMPACT · 170 f. Continues from the very frame Scene 07 ends on: the same
 * over-the-shoulder shot, the same resolved request, his line through the human approval into
 * one record, the single sheet on a clear desk. The light warms a little; the picture drifts.
 *
 * Six impact pop-ups (story.impact.sequence) arrive one at a time, at most two on screen. They
 * hang in the open wall space — never on the screen glass, never on him — with a hairline
 * leader to the process object they describe:
 *   timeSaved → the request · manualSteps → his line · processingTime → his line, start to end ·
 *   paper → the desk sheet · manualEmails → the request's quiet status · errorRisk → the record
 */

type Slot = { x: number; y: number; width: number; align: 'left' | 'right' };

/** Room-space slots (frame px): two on the wall left of the monitor, one on the desk beside the sheet. */
const SLOTS = {
  wallTop: { x: 620 - 500, y: 118, width: 500, align: 'right' },
  wallLow: { x: 620 - 500, y: 300, width: 500, align: 'right' },
  deskSide: { x: 1500 - 300, y: 924, width: 300, align: 'right' },
} satisfies Record<string, Slot>;

type PinKey = 'request' | 'line' | 'flow' | 'desk' | 'status' | 'record';

/** Process objects on his screen (canvas → frame through the monitor's perspective) and on his desk. */
const PINS: Record<PinKey, Pt> = (() => {
  const R = SCREEN_LAYOUT.request;
  const { line1, line2, record } = AFTER_LAYOUT;
  return {
    request: screenPoint({ x: R.x + 2, y: R.y + 46 }),
    line: screenPoint({ x: line1.x, y: (line1.y1 + line1.y2) / 2 }),
    flow: screenPoint({ x: line2.x, y: (line2.y1 + line2.y2) / 2 }),
    desk: { x: DESK_SHEET.x + 30, y: DESK_SHEET.y + 22 },
    status: screenPoint({ x: R.x + 2, y: R.y + CARD_H - 30 }),
    record: screenPoint({ x: record.x, y: record.y + record.h * 0.4 }),
  };
})();

/** Where each metric sits and what it points at; metrics not listed take the next free pair. */
const LAYOUT: Record<string, { pin: PinKey; slot: keyof typeof SLOTS }> = {
  timeSaved: { pin: 'request', slot: 'wallTop' },
  manualSteps: { pin: 'line', slot: 'wallLow' },
  processingTime: { pin: 'flow', slot: 'wallTop' },
  paper: { pin: 'desk', slot: 'deskSide' },
  manualEmails: { pin: 'status', slot: 'wallLow' },
  errorRisk: { pin: 'record', slot: 'wallTop' },
};
const FALLBACK: Array<{ pin: PinKey; slot: keyof typeof SLOTS }> = [
  { pin: 'request', slot: 'wallTop' },
  { pin: 'line', slot: 'wallLow' },
];

/** The picture: from Scene 07's last frame, one slow, even drift towards his screen. */
const CAM_FROM: Cam = OPENING_CAM;
const CAM_TO: Cam = { scale: 1.045, x: -18, y: 6 };

export const ImpactScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const t = mapClamp(frame, [0, durationInFrames - 1], [0, 1]);
  const cam: Cam = {
    scale: CAM_FROM.scale + (CAM_TO.scale - CAM_FROM.scale) * t,
    x: CAM_FROM.x + (CAM_TO.x - CAM_FROM.x) * t,
    y: CAM_FROM.y + (CAM_TO.y - CAM_FROM.y) * t,
  };
  const light = mixLight(LIGHT.afterDay, LIGHT.warmDay, t);
  const ids = story.impact.sequence;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={camTransform(cam)}>
        <OpeningWorkspace
          light={light}
          requestStart={-200}
          resolveAt={-180}
          after={AFTER_RESOLVED}
          cursor={{ keys: [{ frame: 0, ...AFTER_POINTER_HOME }] }}
        />
      </AbsoluteFill>

      {ids.map((id, i) => {
        const place = LAYOUT[id] ?? FALLBACK[i % FALLBACK.length];
        const slot = SLOTS[place.slot];
        const anchor = camPoint(cam, PINS[place.pin]);
        const originX = slot.align === 'right' ? slot.x + slot.width : slot.x;
        return (
          <MetricPopup
            key={`${id}-${i}`}
            metricId={id}
            x={slot.x}
            y={slot.y}
            width={slot.width}
            align={slot.align}
            valueSize={slot.width <= 300 ? 44 : 56}
            start={s08Start(i)}
            exitAt={s08Exit(i, ids.length)}
            leader={{ x: anchor.x - originX, y: anchor.y - slot.y }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

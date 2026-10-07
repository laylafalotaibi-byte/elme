import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { LIGHT } from '../campaign/light';
import { mapClamp } from '../campaign/motion';
import { useStory } from '../campaign/StoryContext';
import { Workspace } from '../components/set/Workspace';
import { camPoint, camTransform, lerpCam } from './final/geometry';
import { DeskSheet, IMPACT_PINS, ImpactScreen, type PinKey } from './final/ImpactSet';
import { PinnedMetric, type Placement } from './final/PinnedMetric';
import { S08, s08Start } from './final/timing';
import type { SceneProps } from './types';

/**
 * Scene 08 — Impact · IMPACT · light warm daylight. 170 f, hard cut in, dissolves out.
 *
 *   0 → 170   A calm AFTER workspace, over his shoulder. On his screen, already resolved:
 *             the request (Scene 07's card, "Submitted digitally"), his thin orange line
 *             running straight down from it into one record — vertical, as in Scenes 06–07 —
 *             and one quiet notification; a clear desk with a single squared sheet. Nothing
 *             moves but one slow, even drift of the picture.
 *   10 + 22n  Six impact pop-ups (story.impact.sequence: 10, 32, 54, 76, 98, 120), one at a
 *             time, each pinned with a hairline leader to a process object — never to him.
 *             At most two on screen: the oldest leaves as the third arrives. The last is
 *             fully built by 148 and holds through the dissolve (160–170).
 *
 *   timeSaved → the request · manualSteps → his line · processingTime → the end of his line ·
 *   paper → the desk sheet · manualEmails → the notification · errorRisk → the record
 *
 * Pop-ups on his line hang to its right on level leaders (as the step words did in Scene 06),
 * staggered in depth so two never stack like a list. The final film shows the approved
 * qualitative wording; the MetricsDraft shows the [X] placeholders + TO VERIFY (placements
 * are measured per mode, so both fit). Pop-ups sit outside the camera (translated with
 * their objects, never scaled).
 */

/** Which object each metric is pinned to; metrics not listed take the next free object. */
const PIN_FOR_METRIC: Record<string, PinKey> = {
  timeSaved: 'item',
  manualSteps: 'line',
  processingTime: 'lineEnd',
  paper: 'desk',
  manualEmails: 'note',
  errorRisk: 'record',
};
const PIN_ORDER: PinKey[] = ['item', 'line', 'lineEnd', 'desk', 'note', 'record'];

/**
 * How a pop-up sits against each object. Objects on his line take a level leader and hang
 * to its right (as the step words did in Scene 06); the desk sheet and the notification
 * carry theirs above. Chosen so that any two pop-ups on screen together never overlap, in
 * the final film and in the MetricsDraft.
 */
const PLACEMENT: Record<PinKey, Placement> = {
  item: { side: 'right', dx: 0, gap: 46 },
  line: { side: 'right', dx: 0, gap: 56 },
  // a longer level leader: out into the open screen, so it never stacks under the line's pop-up like a list
  lineEnd: { side: 'right', dx: 0, gap: 330 },
  desk: { side: 'above', dx: 0, gap: 150 },
  note: { side: 'above', dx: 0, gap: 40 },
  record: { side: 'right', dx: 0, gap: 56 },
};

const assignPins = (ids: string[]) => {
  const used = new Set<PinKey>();
  const wanted = ids.map((id) => PIN_FOR_METRIC[id]);
  wanted.forEach((k) => k && used.add(k));
  return ids.map((_id, i) => {
    const k = wanted[i];
    if (k && wanted.indexOf(k) === i) return k;
    const free = PIN_ORDER.find((p) => !used.has(p));
    if (!free) return null;
    used.add(free);
    return free;
  });
};

export const ImpactScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();

  const cam = lerpCam(S08.cam.from, S08.cam.to, mapClamp(frame, [0, durationInFrames - 1], [0, 1]));
  const ids = story.impact.sequence.slice(0, PIN_ORDER.length);
  const pins = assignPins(ids);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* picture: one slow, even drift */}
      <AbsoluteFill style={{ transform: camTransform(cam), transformOrigin: '50% 50%' }}>
        <Workspace light={LIGHT.warmDay} screen={<ImpactScreen />} desk={<DeskSheet />} />
      </AbsoluteFill>

      {/* impact, pinned to the process */}
      {ids.map((id, i) => {
        const pin = pins[i];
        if (!pin) return null;
        const start = s08Start(i);
        const exitAt = i + 2 < ids.length ? s08Start(i + 2) - S08.exitLead : undefined;
        return <PinnedMetric key={`${id}-${i}`} metricId={id} anchor={camPoint(cam, IMPACT_PINS[pin])} placement={PLACEMENT[pin]} start={start} exitAt={exitAt} />;
      })}
    </AbsoluteFill>
  );
};

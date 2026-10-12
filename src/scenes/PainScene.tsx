import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { useStory } from '../campaign/StoryContext';
import { LIGHT } from '../campaign/light';
import { colors, layout, type } from '../campaign/theme';
import { ease, mapClamp, span } from '../campaign/motion';
import { DeskInsert } from '../components/set/Inserts';
import { HeroShot } from '../components/set/HeroShot';
import { SystemWindow } from '../components/ui/artifacts/SystemWindow';
import { MaskedReveal } from '../components/typography/Reveal';
import { CLUTTER_HEIGHT, ClutterScreen, clutterItem, typedFieldRect } from './before/ClutterScreen';
import { PaperPile, PaperStack, PhoneEmails, STACK, pilePin, stackPin } from './before/PainSet';
import { PinnedIndicator } from './before/Pinned';
import { DeskLight, RecordChip } from './before/props';
import { DeskPlane, ScreenShot } from './before/ScreenShot';
import { canvasToFrame, pushCam, splitTwo, type Cam } from './before/shared';
import { PAIN_INDICATORS, S03_DESK, S03_LINE, S03_SCREEN, S03_SHOT, type PainRole } from './before/timing';
import type { SceneProps } from './types';

/**
 * Scene 03 — The Pain (PROBLEM, felt) · 240 f · light dimmed.
 *
 * Slower. One line at a time, each on its own shot; indicators pinned to real objects
 * (never in a row), never more than two on screen. Beats: before/timing.ts · S03.
 *
 *   0–48    Desk: one single paper form, in focus.            "The task wasn't difficult." (2)
 *   48–84   The camera pulls back: the same form is one of a stack of identical forms, other
 *           hands' forms piled beside it, emails behind; line 1 steps back to 40 %.
 *                                                              "But repeating it every day…" (52/56)
 *   86–140  Settled. TIME ↓ pinned to the stack (86, on 54 f) · EFFORT ↑ to the pile (98, on 42 f).
 *   140–150 Cut → Hero shot (close): he looks at it. Silence.
 *   150–240 The monitor in the dark room (the same screen Scene 02 left, soft) — the screen is
 *           the only light; the last field is typed by hand (156…196, with a hesitation).  "And every manual step created another
 *           opportunity for error." (151/155, on 89 f) · RISK ↑ on the typed field (188) ·
 *           RECORDS on both record places (198).
 */

const TEXT_X = layout.marginX;
const LINE = { ...type.displayM, color: colors.textOnDark, whiteSpace: 'nowrap' as const };
const LINEAR = Easing.linear;

/** The indicator pinned to an object, by role. */
const useIndicator = (role: PainRole) => useStory().story.pain.indicators[PAIN_INDICATORS[role]];

/* -------------------------------------------------------------- desk shot */

/** Camera over the (tilted) desk: world point `focus` lands on frame point `at`. */
const deskCamera = (frame: number) => {
  const t = span(frame, S03_DESK.pullBack, ease.inOut);
  const scale = 1.62 + (1 - 1.62) * t;
  const focus = { x: STACK.x, y: STACK.y };
  // Close framing sits far enough right that the loose pile is fully out of frame: the first
  // shot is one form, simple — nothing else bright in the picture.
  const at = { x: 1420 + (STACK.x - 1420) * t, y: 430 + (STACK.y - 430) * t };
  // a breath of movement while it holds close
  const drift = span(frame, S03_DESK.hold, LINEAR) * 0.015 * (1 - t);
  return { scale: scale * (1 + drift), focus, at };
};

const DeskShot: React.FC<{ frame: number }> = ({ frame }) => {
  const { story } = useStory();
  const light = LIGHT.dimmed;
  const cam = deskCamera(frame);
  const spread = span(frame, S03_DESK.spread, ease.inOut);
  const dof = 6 * (1 - span(frame, S03_DESK.pullBack, ease.inOut));
  const [l2a, l2b] = splitTwo(story.pain.lines[1]);
  const step = mapClamp(frame, S03_DESK.line1Back as [number, number], [1, 0.4], ease.inOut);
  const time = useIndicator('stack');
  const effort = useIndicator('pile');
  return (
    <AbsoluteFill>
      <DeskInsert light={light}>
        <DeskPlane tilt={11}>
          <AbsoluteFill
            style={{
              transform: `translate(${cam.at.x - cam.focus.x * cam.scale}px, ${cam.at.y - cam.focus.y * cam.scale}px) scale(${cam.scale})`,
              transformOrigin: '0 0',
            }}
          >
            {/* depth of field: at first only the one form is sharp */}
            <div style={{ filter: dof > 0.05 ? `blur(${dof.toFixed(2)}px)` : undefined }}>
              <PhoneEmails />
              <PaperPile />
            </div>
            <PaperStack spread={spread} />
          </AbsoluteFill>
          <DeskLight light={light} pool={{ x: 58, y: 36 }} spread={58} />
          {/* both start after the camera has settled, so their pins (laid out at camera 1) sit on the objects */}
          <PinnedIndicator indicator={time} x={stackPin.x + 78} y={stackPin.y - 70} start={S03_DESK.time} leadDuration={S03_DESK.lead} targets={[{ x: stackPin.x - 6, y: stackPin.y + 8 }]} />
          <PinnedIndicator indicator={effort} x={pilePin.x - 220} y={pilePin.y + 84} start={S03_DESK.effort} leadDuration={S03_DESK.lead} targets={[{ x: pilePin.x, y: pilePin.y }]} />
        </DeskPlane>
      </DeskInsert>
      {/* copy: flat, never inside the camera */}
      <div style={{ position: 'absolute', left: TEXT_X, top: 664, opacity: step }}>
        <MaskedReveal start={S03_DESK.line1} duration={S03_LINE.duration} block>
          <span style={LINE}>{story.pain.lines[0]}</span>
        </MaskedReveal>
      </div>
      <div style={{ position: 'absolute', left: TEXT_X, top: 772 }}>
        <MaskedReveal start={S03_DESK.line2[0]} duration={S03_LINE.duration} block>
          <span style={LINE}>{l2a}</span>
        </MaskedReveal>
        {l2b ? (
          <MaskedReveal start={S03_DESK.line2[1]} duration={S03_LINE.duration} block>
            <span style={LINE}>{l2b}</span>
          </MaskedReveal>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- screen shot */

/**
 * The same screen as the end of Scene 02 (his settled clutter, soft), with the newest System
 * 800 window and the record's two places sharp in front — exactly where they sit in the pile.
 */
const SYS = clutterItem('sys3');
const REC = clutterItem('rec1');
const RECORD_PLACES = REC.kind === 'records' ? { a: REC.a, b: REC.b, w: REC.w } : { a: { x: 200, y: 612 }, b: { x: 800, y: 590 }, w: 320 };
const RECORD_H = CLUTTER_HEIGHT.records;
/**
 * Pulled back: the whole monitor, its bezel and the dark room around it; the screen sits
 * high so the line reads in light type on the dark band below it.
 */
const SCREEN_CAM: Cam = { zoom: 0.62, focus: { x: 640, y: 538 } };
/** The room: edges ≥ 60 % dark, a soft spill on the wall, the screen a touch below full. */
const ROOM = { vignette: 0.82, spill: 0.14, screenLevel: 0.78 } as const;
/** Where line 3 sits: on the dark band under the monitor. */
const LINE3_TOP = 836;

const ScreenShotPain: React.FC<{ frame: number; end: number }> = ({ frame, end }) => {
  const { story } = useStory();
  const a = story.before.artifacts;
  const cam = pushCam(frame, S03_SHOT.screen[0], end, SCREEN_CAM, S03_SCREEN.push);
  const [l3a, l3b] = splitTwo(story.pain.lines[2]);
  const risk = useIndicator('typedField');
  const records = useIndicator('records');

  // Typing the last field by hand — half, a hesitation, the rest.
  const total = a.system.fields.reduce((n, f) => n + f.value.length, 0);
  const lastLen = a.system.fields[a.system.fields.length - 1]?.value.length ?? 0;
  const half = Math.ceil(lastLen / 2);
  const typedLast = Math.floor(span(frame, S03_SCREEN.typing.first, LINEAR) * half) + Math.floor(span(frame, S03_SCREEN.typing.second, LINEAR) * (lastLen - half));
  const typing = total ? (total - lastLen + typedLast) / total : 1;

  const field = typedFieldRect(SYS);
  const { a: placeA, b: placeB, w: recW } = RECORD_PLACES;
  // RISK sits to the right of the window; its leader drops down-left onto the typed field.
  const fieldPin = canvasToFrame({ x: field.x + field.w - 30, y: field.y + field.h }, cam);
  const riskAt = canvasToFrame({ x: SYS.x + SYS.w + 30, y: field.y - 82 }, cam);
  // RECORDS sits just under the gap between the two places; one leader to each.
  const recAt = canvasToFrame({ x: placeB.x - 20, y: placeB.y + RECORD_H + 34 }, cam);
  const aPin = canvasToFrame({ x: placeA.x + recW - 30, y: placeA.y + RECORD_H }, cam);
  const bPin = canvasToFrame({ x: placeB.x + 24, y: placeB.y + RECORD_H }, cam);

  return (
    <ScreenShot
      light={LIGHT.dimmed}
      cam={cam}
      tilt={{ x: 3, y: -7 }}
      overscan={false}
      room={ROOM}
      backBlur={6}
      back={<ClutterScreen frame={0} settled except={[SYS.id, REC.id]} />}
      front={
        <>
          <SystemWindow name={a.system.name} title={a.system.title} fields={a.system.fields} tag={a.system.tag} typing={typing} tone="light" width={SYS.w} style={{ position: 'absolute', left: SYS.x, top: SYS.y }} />
          <RecordChip place={a.records.buckets[1] ?? a.records.buckets[0] ?? ''} fileName={a.records.fileName} width={recW} style={{ position: 'absolute', left: placeB.x, top: placeB.y }} />
          <RecordChip place={a.records.buckets[0] ?? ''} fileName={a.records.fileName} width={recW} style={{ position: 'absolute', left: placeA.x, top: placeA.y }} />
        </>
      }
      overlay={
        <>
          {/* the dark band under the monitor carries the line */}
          <AbsoluteFill style={{ pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(4,5,7,0) 70%, rgba(4,5,7,0.55) 100%)' }} />
          <div style={{ position: 'absolute', left: TEXT_X, top: LINE3_TOP }}>
            <MaskedReveal start={S03_SCREEN.line3[0]} duration={S03_LINE.duration} block>
              <span style={LINE}>{l3a}</span>
            </MaskedReveal>
            {l3b ? (
              <MaskedReveal start={S03_SCREEN.line3[1]} duration={S03_LINE.duration} block>
                <span style={LINE}>{l3b}</span>
              </MaskedReveal>
            ) : null}
          </div>
        </>
      }
    >
      <PinnedIndicator indicator={risk} x={riskAt.x} y={riskAt.y} start={S03_SCREEN.risk} tone="light" targets={[fieldPin]} />
      <PinnedIndicator indicator={records} x={recAt.x} y={recAt.y} start={S03_SCREEN.records} tone="light" targets={[bPin, aPin]} leadDuration={S03_SCREEN.recordsLead} />
    </ScreenShot>
  );
};

/* -------------------------------------------------------------- scene */

export const PainScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  let shot: React.ReactNode;
  if (frame < S03_SHOT.desk[1]) {
    shot = <DeskShot frame={frame} />;
  } else if (frame < S03_SHOT.hero[1]) {
    // He looks at it. Silence — nothing new enters.
    shot = <HeroShot light={LIGHT.dimmed} framing="close" zoom={1 + 0.006 * span(frame, S03_SHOT.hero, LINEAR)} />;
  } else {
    shot = <ScreenShotPain frame={frame} end={durationInFrames} />;
  }
  return <AbsoluteFill style={{ backgroundColor: '#000' }}>{shot}</AbsoluteFill>;
};

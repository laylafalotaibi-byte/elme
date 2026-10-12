import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { LIGHT } from '../campaign/light';
import { colors } from '../campaign/theme';
import { ease, envelope, progress } from '../campaign/motion';
import { useStory } from '../campaign/StoryContext';
import { BeforeClutter, DESK_PILE } from './before/BeforeSet';
import { CLUTTER, typedFieldRect } from './before/ClutterScreen';
import { CompareChip, SideLabel, type ChipSpec } from './person/CompareChip';
import { AFTER_LAYOUT, AFTER_POINTER_HOME, cardPoint, OPENING_CAM, SCREEN_LAYOUT, camTransform, reviewOptionCenter, screenPoint, statusEndPoint, type Pt } from './person/geometry';
import { DESK_SHEET, OpeningWorkspace, type AfterFlowState } from './person/OpeningSet';
import { reviewDecision } from '../campaign/copy';
import type { StoryConfig } from '../campaign/types';
import { S07 } from './person/timing';
import type { SceneProps } from './types';

/**
 * Scene 07 — After Automation · BETTER WAY · light afterDay · 210 f.
 *
 * A match cut of Scene 01's opening: the same framing, the same request, the same moment —
 * a different experience.
 *
 *   0–18     The same request lands in the same place; his hand reaches it as it settles.
 *   18       One click: "Submitted digitally".
 *   24–58    His line runs down to the review node; the options appear and a person decides
 *            (a click on "Approve" at 58) — approval is never automatic.
 *   58–82    Only then does the line continue and the one record get generated.
 *   82–92    Stillness.
 *   92–110   One orange line wipes across the same shot → split screen
 *            (LEFT = Scene 02's final cluttered frame, RIGHT = this calm frame).
 *   108–188  Comparison chips in pairs, one on each side, never aligned or linked.
 *            System 800 only ever on the BEFORE side.
 *   192–208  The split folds away: chips fade, the line slides off to the left and the calm
 *            frame fills the screen — Scene 08 continues from exactly this frame.
 */

/** Horizontal offset of each picture inside its half of the split (frame px). */
const DX_BEFORE = -520;
const DX_AFTER = 0;
const SPLIT_X = 960;

const shift = (p: Pt, dx: number): Pt => ({ x: p.x + dx, y: p.y });

/* -------------------------------------------------------------- BEFORE pins */

const clutter = (id: string) => CLUTTER.find((c) => c.id === id);

/** A point on a clutter item (canvas offsets from its top-left), in BEFORE-half frame coords. */
const onClutter = (id: string, local: Pt, fallback: Pt): Pt => {
  const item = clutter(id);
  const p = item ? { x: item.x + local.x, y: item.y + local.y } : fallback;
  return shift(screenPoint(p), DX_BEFORE);
};

const beforePins = () => {
  const pile = DESK_PILE[0] ?? { x: 1430, y: 884 };
  const rec = clutter('rec1');
  const recA = rec && rec.kind === 'records' ? rec.a : { x: 200, y: 612 };
  const sys = clutter('sys3');
  const field = sys ? typedFieldRect(sys) : { x: 606, y: 502, w: 284, h: 36 };
  return {
    paper: shift({ x: pile.x - 40, y: pile.y + 22 }, DX_BEFORE),
    emails: onClutter('email3', { x: 64, y: 24 }, { x: 182, y: 180 }),
    followUps: onClutter('follow2', { x: 120, y: 34 }, { x: 146, y: 466 }),
    // the System 800 field being typed by hand
    updates: shift(screenPoint({ x: field.x + 64, y: field.y + field.h / 2 }), DX_BEFORE),
    // the same file in two places: the "Emails" copy and an attachment on a forwarded email
    recordsA: shift(screenPoint({ x: recA.x + 60, y: recA.y + 14 }), DX_BEFORE),
    recordsB: onClutter('fwd1', { x: 77, y: 124 }, { x: 637, y: 644 }),
  };
};

/* -------------------------------------------------------------- AFTER pins */

const afterPins = (status: string) => {
  const { line1, record } = AFTER_LAYOUT;
  return {
    submission: shift(screenPoint(statusEndPoint(status)), DX_AFTER),
    flow: shift(screenPoint({ x: line1.x, y: (line1.y1 + line1.y2) / 2 + 10 }), DX_AFTER),
    record: shift(screenPoint({ x: record.x + record.w, y: record.y + record.h * 0.45 }), DX_AFTER),
    notifications: shift(screenPoint({ x: cardPoint.dot.x + 40, y: SCREEN_LAYOUT.request.y }), DX_AFTER),
    desk: shift({ x: DESK_SHEET.x + 40, y: DESK_SHEET.y + 26 }, DX_AFTER),
  };
};

/* -------------------------------------------------------------- chips */

const buildChips = (before: string[], after: string[], status: string): ChipSpec[] => {
  const b = beforePins();
  const a = afterPins(status);
  const left: Array<Omit<ChipSpec, 'text' | 'side'>> = [
    // Paper → the pile at the desk edge (kept ≥ 80 px clear of the bottom edge)
    { at: { x: b.paper.x - 118, y: b.paper.y + 66 }, attach: 'right', anchors: [b.paper], from: { x: -8, y: 10 }, rotate: -1.2 },
    // Emails → the stacked emails (chip on the dark wall above the screen)
    { at: { x: b.emails.x - 40, y: 120 }, attach: 'bottom', anchors: [b.emails], from: { x: 10, y: -8 }, rotate: 1 },
    // Manual follow-ups → the ping at the screen edge (pill kept ≈ 80 px inside the frame edge)
    { at: { x: b.followUps.x - 30, y: b.followUps.y + 58 }, attach: 'top', anchors: [b.followUps], from: { x: -10, y: 6 }, rotate: -0.8 },
    // Manual updates → the System 800 field typed by hand (BEFORE side only)
    { at: { x: b.updates.x + 60, y: b.updates.y - 140 }, attach: 'bottom', anchors: [b.updates], from: { x: 8, y: 8 }, rotate: 1.3 },
    // Fragmented records → the same file, in two places
    { at: { x: (b.recordsA.x + b.recordsB.x) / 2 + 4, y: b.recordsA.y + 94 }, attach: 'top', anchors: [b.recordsA, b.recordsB], from: { x: 0, y: 10 }, rotate: -1 },
  ];
  const right: Array<Omit<ChipSpec, 'text' | 'side'>> = [
    // Digital submission → the resolved status
    { at: { x: a.submission.x - 18, y: a.submission.y + 70 }, attach: 'left', anchors: [a.submission] },
    // Automated flow → his line
    { at: { x: a.flow.x + 64, y: a.flow.y + 18 }, attach: 'left', anchors: [a.flow] },
    // Centralized record → the one record
    { at: { x: a.record.x + 56, y: a.record.y + 30 }, attach: 'left', anchors: [a.record] },
    // Automatic notifications → the request that arrived by itself
    { at: { x: a.notifications.x + 40, y: a.notifications.y - 84 }, attach: 'left', anchors: [a.notifications] },
    // Clean process → the clear desk (kept ≥ 70 px clear of the bottom edge)
    { at: { x: a.desk.x - 70, y: a.desk.y + 56 }, attach: 'right', anchors: [a.desk] },
  ];
  const chips: ChipSpec[] = [];
  const n = Math.max(before.length, after.length);
  for (let i = 0; i < n; i++) {
    if (before[i] && left[i]) chips.push({ ...left[i], text: before[i], side: 'before' });
    if (after[i] && right[i]) chips.push({ ...right[i], text: after[i], side: 'after' });
  }
  return chips;
};

/* -------------------------------------------------------------- scene */

/** His pointer: submit the request, then decide at the review node, then back to his work. */
const AFTER_POINTER = (story: StoryConfig) => {
  const rest = SCREEN_LAYOUT.cursorRest;
  const submit = { x: cardPoint.status.x + 30, y: cardPoint.status.y + 4 };
  const decision = reviewDecision(story);
  const approve = decision ? reviewOptionCenter(decision.options, 0) : submit;
  return {
    keys: [
      { frame: 0, ...rest },
      { frame: 5, ...rest },
      { frame: S07.click - 2, ...submit },
      { frame: S07.click + 8, x: submit.x - 40, y: submit.y + 60 },
      // he reads the options, then decides
      { frame: S07.decideClick - 12, x: approve.x - 6, y: approve.y + 4 },
      { frame: S07.decideClick + 8, x: approve.x - 2, y: approve.y + 6 },
      { frame: S07.decideClick + 22, ...AFTER_POINTER_HOME },
    ],
    clicks: [S07.click, S07.decideClick],
    rippleColor: colors.accent,
  };
};

export const AfterScene: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { story } = useStory();
  const cmp = story.after.comparison;

  const flow: AfterFlowState = {
    line1: progress(frame, S07.line1.at, S07.line1.dur, ease.inOut),
    node: progress(frame, S07.node.at, S07.node.dur, ease.out),
    options: progress(frame, S07.options.at, S07.options.dur, ease.out),
    decided: progress(frame, S07.decided.at, S07.decided.dur, ease.out),
    line2: progress(frame, S07.line2.at, S07.line2.dur, ease.inOut),
    record: progress(frame, S07.record.at, S07.record.dur, ease.out),
  };
  // The split folds away before the cut so Scene 08 continues from the calm frame.
  const outro = progress(frame, S07.outro.at, S07.outro.dur, ease.inOut);
  const flash = envelope(frame, S07.request, S07.request + 28, 5, 20) * 0.4;

  const wipeAt = (f: number) => progress(f, S07.wipe.at, S07.wipe.dur, ease.inOut);
  const outroAt = (f: number) => progress(f, S07.outro.at, S07.outro.dur, ease.inOut);
  const lineAt = (f: number) => -4 + (SPLIT_X + 4) * wipeAt(f) * (1 - outroAt(f));
  const wipe = wipeAt(frame);
  const lineX = lineAt(frame);
  // Mid-wipe the line travels up to ≈ 145 px per frame; a 2 px line would strobe. A trailing
  // smear the length of half a frame's travel (a 180° shutter) reads as motion blur, and is
  // zero whenever the line is at rest.
  const smear = Math.max(0, (lineX - lineAt(frame - 1)) * 0.5);
  const split = frame >= S07.wipe.at && outro < 1;

  const chips = buildChips(cmp.before, cmp.after, story.after.status);
  // Pairs: one chip per side at the same moment. The spacing tightens only if a longer list
  // would not have landed before the split folds away.
  const pairs = Math.ceil(chips.length / 2);
  const room = Math.min(durationInFrames, S07.outro.at) - S07.chips.build - 4 - S07.chips.first;
  const spacing = pairs > 1 ? Math.min(S07.chips.spacing, Math.floor(room / (pairs - 1))) : 0;
  const startOf = (i: number) => S07.chips.first + Math.floor(i / 2) * spacing;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      {/* AFTER — the calm frame (the right half once split) */}
      <AbsoluteFill style={{ transform: `translateX(${DX_AFTER * wipe}px)` }}>
        <AbsoluteFill style={camTransform(OPENING_CAM)}>
          <OpeningWorkspace
            light={LIGHT.afterDay}
            flash={flash}
            requestStart={S07.request}
            resolveAt={S07.resolve}
            cursor={AFTER_POINTER(story)}
            after={flow}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* BEFORE — Scene 02's final frame, revealed behind the orange line */}
      {split ? (
        <AbsoluteFill style={{ clipPath: `inset(0px ${1920 - lineX}px 0px 0px)` }}>
          <AbsoluteFill style={{ transform: `translateX(${DX_BEFORE}px)` }}>
            <BeforeClutter drift />
          </AbsoluteFill>
          {/* the lit edge of his shoulder, cropped by the reframe, falls back into shadow */}
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse 34% 30% at 0% 100%, rgba(9,10,12,0.92) 0%, rgba(9,10,12,0.6) 45%, rgba(9,10,12,0) 100%)' }} />
        </AbsoluteFill>
      ) : null}

      {/* the orange line — his line, dividing then from now */}
      {split && smear > 3 ? (
        <div
          style={{
            position: 'absolute',
            left: lineX - 1 - smear,
            top: 0,
            width: smear,
            height: 1080,
            background: 'linear-gradient(90deg, rgba(242,107,33,0) 0%, rgba(242,107,33,0.16) 100%)',
          }}
        />
      ) : null}
      {split ? <div style={{ position: 'absolute', left: lineX - 1, top: 0, width: 2, height: 1080, background: colors.accent }} /> : null}

      <AbsoluteFill style={{ opacity: 1 - outro }}>
      {split ? (
        <>
          <SideLabel text={cmp.beforeLabel} x={SPLIT_X - 32} y={64} align="right" tone="dark" start={S07.labels} />
          <SideLabel text={cmp.afterLabel} x={SPLIT_X + 32} y={64} align="left" tone="light" start={S07.labels} />
        </>
      ) : null}

      {chips.map((spec, i) => {
        // the next chip on the same side arrives two slots later
        const next = chips.findIndex((c, j) => j > i && c.side === spec.side && startOf(j) > startOf(i));
        return (
          <CompareChip
            key={`${spec.side}-${spec.text}`}
            spec={spec}
            start={startOf(i)}
            dimAt={next === -1 ? undefined : startOf(next)}
          />
        );
      })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

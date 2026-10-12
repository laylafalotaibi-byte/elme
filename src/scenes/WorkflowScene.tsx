import React from 'react';
import { AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { colors, type } from '../campaign/theme';
import { ease, glide, progress, span, springAt, springs } from '../campaign/motion';
import { LIGHT, roomPalette } from '../campaign/light';
import { useStory } from '../campaign/StoryContext';
import { reviewDecision } from '../campaign/copy';
import { ScreenInsert } from '../components/set/Inserts';
import { MetricPopup } from '../components/ui/MetricPopup';
import { Cursor } from '../components/ui/Cursor';
import { MASK_PADDING } from '../components/typography/Reveal';
import { LearningInsert } from './workflow/LearningInsert';
import { InsertTitles } from './workflow/InsertTitles';
import { RoomLight } from './workflow/RoomLight';
import { FoldingArtefacts } from './workflow/FoldingArtefacts';
import { END_FRAMING, project, stepTimes, nodeYs, workflowCamera, worldTransform, type Cam } from './workflow/camera';
import { SITE_ORIGINS_X, SPINE, branchEnd, branchPath, sitePath, sketchLineAtCut, swingLine, type Pt } from './workflow/sketch';
import { S05_END, S05_LAST, S06 } from './workflow/timing';
import type { SceneProps } from './types';

/**
 * Scene 06 — Building the Solution · BETTER WAY · light warm daylight.
 *
 *   0–18     Scene 05 continues: IMPROVE and the supporting line hold (≥ their reading
 *            time), then leave; the notes, page and drafts clear
 *   3–30     his straightened line turns orange and swings vertical; warm daylight fills the room
 *   14–41    hairlines converge from off-frame into the top of the line — "Sites" (31 → 52)
 *   29–52    the camera pushes in on the top of the line …
 *   43–150   … and tracks down it. One step at a time: each big word arrives as the camera
 *            reaches its tick on the line, and as it leaves, its name settles small beside
 *            the tick and stays — every step stays named from its arrival to the end:
 *            SUBMIT 43 (the paper form, filled in, flattens into it) · TRIGGER 58 ·
 *            REVIEW 73 — his hand comes in from the frame edge (69), the options rise (77),
 *            his click resolves it to the first option (90); only then does the line move
 *            on (95) · GENERATE RECORD 108 · CENTRALIZE 123 (scattered files, out of focus,
 *            merge into one) · NOTIFY 138 (the email collapses into it) → branches (140)
 *            to the two targets (148)
 *   138–172  one pull-back from NOTIFY to the whole line, all six steps named
 *   156/166  impact pinned to the process: sites at the convergence (as it comes back into
 *            frame), records at CENTRALIZE
 *   → 210    hold
 *
 * No travelling token, no kicker, no sub-labels besides the review options. System 800 never
 * appears. Type and pop-ups sit outside the scaling camera, at projected positions.
 */

/** The big step word as the camera reaches it (displayM, uppercase as the brief writes it). */
const STEP_WORD: React.CSSProperties = { ...type.displayM, letterSpacing: '-0.012em', textTransform: 'uppercase', whiteSpace: 'nowrap' };
/** The name that stays beside its tick: caption size and weight, lightly tracked — a note on his line, not a UI stepper. */
const STEP_LABEL: React.CSSProperties = { ...type.caption, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const LABEL_INK = '#2A2825';

const PENCIL = '#2B2A27';
/** MetricPopup: distance from its top to the middle of its value row (label 20 px + 14 gap + value). */
const POPUP_VALUE_MID = 56;
/** Impact pop-ups: width, and the gap (world px) between their right edge and his line. */
const POPUP_W = 520;
const POPUP_GAP = { sites: 190, records: 90 } as const;
/** Tick on his line at each step (world px): a short mark off the line, towards the step's name. */
const TICK = { length: 11, width: 2.4 } as const;

/** Masked rise / exit for a single line of type (frame-local). */
const Rise: React.FC<{
  frame: number;
  start: number;
  exitAt?: number;
  duration?: number;
  exitDuration?: number;
  exitEasing?: (t: number) => number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ frame, start, exitAt, duration = 16, exitDuration = 10, exitEasing = ease.inOut, children, style }) => {
  if (frame < start) return null;
  const p = progress(frame, start, duration, ease.out);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, exitDuration, exitEasing);
  if (out >= 1) return null;
  return (
    <div style={{ position: 'absolute', overflow: 'hidden', ...MASK_PADDING, ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 1.05 - out * 0.5}em)`, opacity: Math.min(1, p * 1.4) * (1 - out) }}>{children}</div>
    </div>
  );
};

/** His hand at REVIEW, in frame space: in from the bottom edge, onto the option, click, and away out of frame. */
const reviewHand = (cam: (f: number) => Cam, target: (c: Cam) => Pt) => (f: number): Pt => {
  const at = target(cam(f));
  const from = { x: at.x + 300, y: 1080 + 60 };
  const away = { x: at.x + 420, y: 1080 + 80 };
  const arrive = progress(f, S06.reviewPointer, S06.approveClick - 3 - S06.reviewPointer, glide(0, 0));
  const leave = progress(f, S06.reviewResume + 2, 18, glide(0, 0.6));
  return {
    x: from.x + (at.x - from.x) * arrive + (away.x - at.x) * leave,
    y: from.y + (at.y - from.y) * arrive + (away.y - at.y) * leave,
  };
};

export const WorkflowScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { story } = useStory();
  const steps = story.workflow.steps;
  const targets = story.workflow.notifyTargets;
  const [inWorkflowA, inWorkflowB] = story.impact.inWorkflow;
  const decision = reviewDecision(story);

  const ys = nodeYs(steps.length);
  const times = stepTimes(steps.length);
  const holdAfter = decision ? decision.index : null;
  const camAt = (f: number) => workflowCamera(f, ys, times, holdAfter);
  const cam = camAt(frame);
  const nodes: Pt[] = ys.map((y) => ({ x: SPINE.x, y }));
  const P = (p: Pt) => project(cam, p);

  // Light: from Scene 05's warm, low-key screen to warm daylight on paper.
  const day = span(frame, S06.daylight);
  const paperDay = roomPalette(LIGHT.warmDay).screen;

  // Scene 05 leaves: its page clears; its words hold their reading time, then leave before the swinging line reaches them.
  const clear = span(frame, S06.clear);
  const titlesOut = span(frame, S06.titlesOut, ease.in);

  // His line: turns orange, swings vertical.
  const orange = span(frame, S06.orange);
  const swing = span(frame, S06.swing);
  const line = swingLine(swing);
  const lineColor = interpolateColors(orange, [0, 1], [PENCIL, colors.accent]);
  const lineWidth = sketchLineAtCut().strokeWidth + (SPINE.strokeWidth - sketchLineAtCut().strokeWidth) * swing;

  // Steps: one big word at a time while tracking. As it leaves (the next is about to arrive),
  // its name settles small beside its tick and stays — never two big words side by side.
  const wordExit = (i: number) => (i < steps.length - 1 ? times[i + 1] - 4 : S06.lastWordOut);
  const labelP = (i: number) => progress(frame, wordExit(i) + S06.labelDelay, S06.labelSettle, ease.out);
  const tickAt = (i: number) => (i === 0 ? S06.paperFold[1] - 4 : times[i]);

  // REVIEW: the options — a human decision, resolved by his click to the chosen one.
  const options = decision?.options ?? [];
  const decided = progress(frame, S06.approveClick + 1, 8, ease.inOut);

  // Branches.
  const branch = span(frame, S06.branches);
  const sitesP = (i: number) => progress(frame, S06.sites[0] + i * 3, 18, ease.inOut);

  // Where the review options sit, relative to the REVIEW tick (frame px).
  const optionsAt = (c: Cam): Pt => {
    const at = holdAfter === null ? { x: 0, y: 0 } : project(c, nodes[holdAfter]);
    return { x: at.x + 54, y: at.y + 46 };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: paperDay }}>
      {/* Scene 05's screen, giving way to the paper world */}
      <AbsoluteFill style={{ opacity: 1 - day }}>
        <ScreenInsert light={LIGHT.warmKey} />
      </AbsoluteFill>
      {clear < 1 ? <LearningInsert clear={clear} hideLine frame={S05_LAST} /> : null}

      {/* World: his line, the sites, the steps, the old artefacts */}
      <AbsoluteFill style={{ transform: worldTransform(cam), transformOrigin: '0 0' }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {SITE_ORIGINS_X.map((x0, i) => {
            const p = sitesP(i);
            if (p <= 0) return null;
            const d = sitePath(x0);
            const ev = evolvePath(p, d);
            return <path key={i} d={d} fill="none" stroke="rgba(20,21,22,0.34)" strokeWidth={1.3} strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />;
          })}
          {swing < 1 ? (
            <line x1={line.a.x} y1={line.a.y} x2={line.b.x} y2={line.b.y} stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" />
          ) : (
            <line x1={SPINE.x} y1={SPINE.top} x2={SPINE.x} y2={SPINE.bottom} stroke={colors.accent} strokeWidth={SPINE.strokeWidth} strokeLinecap="round" />
          )}
          {([-1, 1] as const).map((side) => {
            if (branch <= 0) return null;
            const d = branchPath(side);
            const ev = evolvePath(branch, d);
            const end = branchEnd(side);
            return (
              <g key={side}>
                <path d={d} fill="none" stroke={colors.accent} strokeWidth={SPINE.strokeWidth * 0.8} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
                {branch > 0.97 ? <circle cx={end.x} cy={end.y} r={3.6} fill={colors.accent} /> : null}
              </g>
            );
          })}
          {/* a tick on his line at each step, drawn as the camera reaches it */}
          {nodes.map((n, i) => {
            const k = springAt(frame, fps, tickAt(i), springs.calm);
            if (k <= 0.01) return null;
            return <line key={i} x1={n.x} y1={n.y} x2={n.x + TICK.length * k} y2={n.y} stroke={colors.accent} strokeWidth={TICK.width} strokeLinecap="round" />;
          })}
        </svg>
        <FoldingArtefacts nodes={nodes} />
      </AbsoluteFill>

      <RoomLight dim={1 - day} day={day} drift={frame * 0.25} />

      {/* Scene 05's words, continuing, then leaving */}
      {titlesOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - titlesOut, transform: `translateY(${-14 * titlesOut}px)` }}>
          <InsertTitles frame={S05_END + frame} />
        </AbsoluteFill>
      ) : null}

      {/* Sites — a small label where the hairlines meet his line; it leaves before the push carries it off the top edge */}
      {(() => {
        const at = P({ x: SPINE.x, y: SPINE.top });
        return (
          <Rise frame={frame} start={S06.sitesLabel} exitAt={S06.sitesLabelOut} duration={14} style={{ left: at.x + 26, top: at.y - 14 }}>
            <span style={{ ...type.label, color: colors.mutedOnLight }}>{story.workflow.sitesLabel}</span>
          </Rise>
        );
      })()}

      {/* Steps: the big word arrives with the camera; as it leaves, its name settles beside the tick and stays */}
      {steps.map((step, i) => {
        const at = P(nodes[i]);
        const l = labelP(i);
        return (
          <React.Fragment key={step.label}>
            {/* ease.out exit: mostly gone by the time its label starts to settle (no double exposure) */}
            <Rise frame={frame} start={times[i]} exitAt={wordExit(i)} duration={S06.wordRise} exitDuration={S06.wordExit} exitEasing={ease.out} style={{ left: at.x + 50, top: at.y - 46 }}>
              <span style={{ ...STEP_WORD, color: colors.textOnLight }}>{step.label}</span>
            </Rise>
            {l > 0 ? (
              <div style={{ position: 'absolute', left: at.x + 26, top: at.y - 16, opacity: Math.min(1, l * 1.3), transform: `translateY(${(1 - l) * 12}px)` }}>
                <span style={{ ...STEP_LABEL, color: LABEL_INK }}>{step.label}</span>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* REVIEW: the options, resolved by his click */}
      {holdAfter !== null && options.length > 0
        ? (() => {
            const { x: left, y: top } = optionsAt(cam);
            return (
              <>
                <Rise frame={frame} start={S06.reviewCaption} exitAt={wordExit(holdAfter)} duration={14} style={{ left, top }}>
                  <span style={{ ...type.caption, display: 'inline-flex', gap: 14, whiteSpace: 'nowrap' }}>
                    {options.map((opt, k) => (
                      <React.Fragment key={opt}>
                        {k > 0 ? <span style={{ color: colors.mutedOnLight, opacity: 1 - decided }}>/</span> : null}
                        <span
                          style={{
                            color: k === 0 ? interpolateColors(decided, [0, 1], [colors.mutedOnLight, colors.textOnLight]) : colors.mutedOnLight,
                            opacity: k === 0 ? 1 : 1 - decided,
                          }}
                        >
                          {opt}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                </Rise>
                <Cursor
                  path={reviewHand(camAt, (c) => {
                    const o = optionsAt(c);
                    return { x: o.x + 46, y: o.y + 22 };
                  })}
                  clicks={[S06.approveClick]}
                  scale={1.5}
                  start={S06.reviewPointer}
                  end={S06.reviewResume + 22}
                />
              </>
            );
          })()
        : null}

      {/* NOTIFY → the two targets */}
      {([-1, 1] as const).map((side, k) => {
        const name = targets[k];
        if (!name) return null;
        const at = P(branchEnd(side));
        return (
          <Rise key={side} frame={frame} start={S06.targets + k * 3} duration={14} style={{ left: at.x - 150, top: at.y + 14, width: 300, textAlign: 'center' }}>
            <span style={{ ...type.caption, color: colors.mutedOnLight, whiteSpace: 'nowrap' }}>{name}</span>
          </Rise>
        );
      })}

      {/* Impact, pinned to the process: mirrored (┐), to the left of the line, reading towards it */}
      {inWorkflowA
        ? (() => {
            // value row level with the point where the sites converge, clear of the site hairlines
            const at = P({ x: SPINE.x - POPUP_GAP.sites, y: SPINE.top - POPUP_VALUE_MID / END_FRAMING.s });
            return <MetricPopup metricId={inWorkflowA} x={at.x - POPUP_W} y={at.y} width={POPUP_W} align="right" start={S06.sitesMetric} tone="light" />;
          })()
        : null}
      {inWorkflowB
        ? (() => {
            // value row level with CENTRALIZE
            const at = P({ x: SPINE.x - POPUP_GAP.records, y: nodes[Math.min(4, nodes.length - 1)].y - POPUP_VALUE_MID / END_FRAMING.s });
            return <MetricPopup metricId={inWorkflowB} x={at.x - POPUP_W} y={at.y} width={POPUP_W} align="right" start={S06.recordsMetric} tone="light" />;
          })()
        : null}
    </AbsoluteFill>
  );
};

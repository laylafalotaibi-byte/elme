import React from 'react';
import { AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { colors, type } from '../campaign/theme';
import { ease, progress, springAt, springs } from '../campaign/motion';
import { LIGHT, roomPalette } from '../campaign/light';
import { useStory } from '../campaign/StoryContext';
import { ScreenInsert } from '../components/set/Inserts';
import { MetricPopup } from '../components/ui/MetricPopup';
import { LearningInsert } from './workflow/LearningInsert';
import { InsertTitles } from './workflow/InsertTitles';
import { RoomLight } from './workflow/RoomLight';
import { FoldingArtefacts } from './workflow/FoldingArtefacts';
import { Pointer } from './workflow/Pointer';
import { END_FRAMING, project, stepTimes, nodeYs, workflowCamera, worldTransform } from './workflow/camera';
import { SITE_ORIGINS_X, SPINE, branchEnd, branchPath, sitePath, sketchLineAtCut, swingLine, type Pt } from './workflow/sketch';
import { S05_LAST, S06 } from './workflow/timing';
import type { SceneProps } from './types';

/**
 * Scene 06 — Building the Solution · BETTER WAY · light warm daylight.
 *
 *   0–30     Scene 05's last frame: his straightened line turns orange and swings vertical;
 *            the notes and drafts clear; the room fills with warm daylight
 *   16–42    hairlines converge from off-frame into the top of the line — "Sites"
 *   32–56    the camera pushes in on the top of the line …
 *   40–150   … and tracks down it. One step at a time, each arriving as the camera reaches
 *            it and leaving upward as the next arrives (a small label stays on the line):
 *            SUBMIT 40 (the paper form flattens into it) · TRIGGER 57 ·
 *            REVIEW 74 — "Approve / Reject"; his click resolves it to Approve (88) and only
 *            then does the line move on (94) · GENERATE RECORD 110 ·
 *            CENTRALIZE 127 (scattered files merge into one) ·
 *            NOTIFY 144 (the email collapses into it) → branches to the two targets
 *   148–174  one pull-back: the whole line, all six steps
 *   160/172  impact pinned to the process: sites at the convergence, records at CENTRALIZE
 *   → 210    hold
 *
 * No travelling token, no kicker, no sub-labels besides Approve / Reject. System 800 never
 * appears. Type and pop-ups sit outside the scaling camera, at projected positions.
 */

const STEP_WORD: React.CSSProperties = { ...type.displayM, letterSpacing: '-0.012em', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const STEP_LABEL: React.CSSProperties = { ...type.title, fontSize: 30, letterSpacing: '0.045em', textTransform: 'uppercase', whiteSpace: 'nowrap' };

const PENCIL = '#2B2A27';
/** MetricPopup: distance from its top to the middle of its value row (label 20 px + 14 gap + value). */
const POPUP_VALUE_MID = 56;

/** Masked rise / exit for a single line of type (frame-local). */
const Rise: React.FC<{ frame: number; start: number; exitAt?: number; duration?: number; exitDuration?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  frame,
  start,
  exitAt,
  duration = 16,
  exitDuration = 10,
  children,
  style,
}) => {
  if (frame < start) return null;
  const p = progress(frame, start, duration, ease.out);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, exitDuration, ease.inOut);
  if (out >= 1) return null;
  return (
    <div style={{ position: 'absolute', overflow: 'hidden', padding: '0.06em 0.12em 0.16em 0.04em', margin: '-0.06em -0.12em -0.16em -0.04em', ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 1.05 - out * 0.5}em)`, opacity: Math.min(1, p * 1.4) * (1 - out) }}>{children}</div>
    </div>
  );
};

export const WorkflowScene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { story } = useStory();
  const steps = story.workflow.steps;
  const targets = story.workflow.notifyTargets;
  const [inWorkflowA, inWorkflowB] = story.impact.inWorkflow;

  const ys = nodeYs(steps.length);
  const times = stepTimes(steps.length);
  const decision = steps.findIndex((s) => Boolean(s.caption));
  const holdAfter = decision >= 0 ? decision : null;
  const cam = workflowCamera(frame, ys, times, holdAfter);
  const nodes: Pt[] = ys.map((y) => ({ x: SPINE.x, y }));
  const P = (p: Pt) => project(cam, p);

  // Light: from Scene 05's warm, low-key screen to warm daylight on paper.
  const day = progress(frame, S06.daylight[0], S06.daylight[1] - S06.daylight[0], ease.inOut);
  const paperDay = roomPalette(LIGHT.warmDay).screen;

  // Scene 05 leaves.
  const clear = progress(frame, S06.clear[0], S06.clear[1] - S06.clear[0], ease.inOut);
  // IMPROVE (and the supporting line) only land a few frames before Scene 05 ends: let them
  // stay while the line starts to turn, then leave as it swings.
  const titlesOut = progress(frame, S06.titlesOut[0], S06.titlesOut[1] - S06.titlesOut[0], ease.in);

  // His line: turns orange, swings vertical.
  const orange = progress(frame, S06.orange[0], S06.orange[1] - S06.orange[0], ease.inOut);
  const swing = progress(frame, S06.swing[0], S06.swing[1] - S06.swing[0], ease.inOut);
  const line = swingLine(swing);
  const lineColor = interpolateColors(orange, [0, 1], [PENCIL, colors.accent]);
  const lineWidth = sketchLineAtCut().strokeWidth + (SPINE.strokeWidth - sketchLineAtCut().strokeWidth) * swing;

  // Steps: one big word at a time while tracking; the small labels settle together on the pull-back.
  // The outgoing word is half gone as the next starts to rise, so two step words never sit
  // side by side like a list.
  const wordExit = (i: number) => (i < steps.length - 1 ? times[i + 1] - 4 : S06.lastWordOut);
  const labelP = (i: number) => {
    const s = i === steps.length - 1 ? S06.lastLabel : S06.labels;
    return progress(frame, s[0], s[1] - s[0], ease.out);
  };

  // REVIEW: Approve / Reject — a human decision.
  const options = holdAfter !== null ? (steps[holdAfter].caption ?? '').split('/').map((s) => s.trim()).filter(Boolean) : [];
  const decided = progress(frame, S06.approveClick + 1, 8, ease.inOut);

  // Branches.
  const branch = progress(frame, S06.branches[0], S06.branches[1] - S06.branches[0], ease.inOut);

  const sitesP = (i: number) => progress(frame, S06.sites[0] + i * 3, 18, ease.inOut);

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
                {branch > 0.97 ? <circle cx={end.x} cy={end.y} r={4.5} fill={colors.accent} /> : null}
              </g>
            );
          })}
          {nodes.map((n, i) => {
            const k = springAt(frame, fps, i === 0 ? S06.paperFold[1] - 4 : times[i], springs.calm);
            if (k <= 0.01) return null;
            return <circle key={i} cx={n.x} cy={n.y} r={6.5 * k} fill={paperDay} stroke={colors.accent} strokeWidth={2.4} />;
          })}
        </svg>
        <FoldingArtefacts nodes={nodes} />
      </AbsoluteFill>

      <RoomLight dim={1 - day} day={day} drift={frame * 0.25} />

      {/* Scene 05's type, leaving */}
      {titlesOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - titlesOut, transform: `translateY(${-14 * titlesOut}px)` }}>
          <InsertTitles frame={S05_LAST} />
        </AbsoluteFill>
      ) : null}

      {/* Sites — a small label where the hairlines meet his line; the impact pop-up replaces it */}
      {(() => {
        const at = P({ x: SPINE.x, y: SPINE.top });
        return (
          <Rise frame={frame} start={S06.sitesLabel} exitAt={S06.sitesLabelOut} duration={14} style={{ left: at.x + 26, top: at.y - 14 }}>
            <span style={{ ...type.label, color: colors.mutedOnLight }}>{story.workflow.sitesLabel}</span>
          </Rise>
        );
      })()}

      {/* Steps: the word arrives as the camera reaches it, leaves upward, a small label stays */}
      {steps.map((step, i) => {
        const at = P(nodes[i]);
        return (
          <React.Fragment key={step.label}>
            <Rise frame={frame} start={times[i]} exitAt={wordExit(i)} duration={12} exitDuration={8} style={{ left: at.x + 50, top: at.y - 46 }}>
              <span style={{ ...STEP_WORD, color: colors.textOnLight }}>{step.label}</span>
            </Rise>
            {labelP(i) > 0 ? (
              <div style={{ position: 'absolute', left: at.x + 30, top: at.y - 19, opacity: labelP(i), transform: `translateY(${(1 - labelP(i)) * 10}px)` }}>
                <span style={{ ...STEP_LABEL, color: colors.textOnLight }}>{step.label}</span>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* REVIEW: Approve / Reject, resolved by his click */}
      {holdAfter !== null && options.length > 0
        ? (() => {
            const at = P(nodes[holdAfter]);
            const left = at.x + 54;
            const top = at.y + 46;
            const start = S06.reviewCaption;
            return (
              <>
                <Rise frame={frame} start={start} exitAt={wordExit(holdAfter)} duration={14} style={{ left, top }}>
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
                {(() => {
                  const target = { x: left + 46, y: top + 22 };
                  const tIn = progress(frame, start - 2, S06.approveClick - start - 1, ease.inOut);
                  const from = { x: target.x + 360, y: target.y + 300 };
                  const away = progress(frame, S06.reviewResume, 12, ease.in);
                  const pos = { x: from.x + (target.x - from.x) * tIn + away * 40, y: from.y + (target.y - from.y) * tIn + away * 30 };
                  const vis = progress(frame, start, 6) * (1 - away);
                  return <Pointer x={pos.x} y={pos.y} clicks={[S06.approveClick]} opacity={vis} />;
                })()}
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

      {/* Impact, pinned to the process */}
      {inWorkflowA
        ? (() => {
            // value row level with the point where the sites converge
            const at = P({ x: SPINE.x - 560, y: SPINE.top - POPUP_VALUE_MID / END_FRAMING.s });
            return <MetricPopup metricId={inWorkflowA} x={at.x} y={at.y} start={S06.sitesMetric} tone="light" />;
          })()
        : null}
      {inWorkflowB
        ? (() => {
            // value row level with CENTRALIZE
            const at = P({ x: SPINE.x - 560, y: nodes[Math.min(4, nodes.length - 1)].y - POPUP_VALUE_MID / END_FRAMING.s });
            return <MetricPopup metricId={inWorkflowB} x={at.x} y={at.y} start={S06.recordsMetric} tone="light" />;
          })()
        : null}
    </AbsoluteFill>
  );
};

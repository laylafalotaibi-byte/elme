import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, radii, shadows, type } from '../../campaign/theme';
import { ease, progress, springAt, springs } from '../../campaign/motion';
import type { Light } from '../../campaign/light';
import type { RequestCard as RequestData } from '../../campaign/types';
import { reviewDecision } from '../../campaign/copy';
import { useStory } from '../../campaign/StoryContext';
import { Workspace } from '../../components/set/Workspace';
import { Cursor, type CursorKey } from '../../components/ui/Cursor';
import { Check } from '../../components/glyphs/Glyphs';
import { Mask } from '../../components/typography/Reveal';
import { AFTER_LAYOUT, CARD, CARD_H, REVIEW_GAP, SCREEN_LAYOUT, STATUS_FONT_SIZE, type Pt } from './geometry';
import { ForegroundFigure } from './Shoulder';

/**
 * The opening shot shared by Scene 01 (BEFORE, a normal day), Scene 07 (AFTER) and
 * Scene 08 (IMPACT — the same AFTER frame, resolved): the same Workspace framing, the same
 * calm screen, the same request landing in the same place. Only the light and what happens
 * after the request arrives differ.
 */

const hairline = colors.stoneLine;

/** Skeleton text lines — prop texture nobody needs to read. */
const Lines: React.FC<{ widths: number[]; gap: number; height?: number; color?: string }> = ({ widths, gap, height = 6, color = 'rgba(20,21,22,0.085)' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>
    {widths.map((w, i) => (
      <div key={i} style={{ width: `${w}%`, height, borderRadius: height, background: color }} />
    ))}
  </div>
);

/** His desktop: the same faint top bar as Scene 02's screen, so the shots cut together. */
const DesktopBar: React.FC = () => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 26, background: 'rgba(20,21,22,0.035)', borderBottom: '1px solid rgba(20,21,22,0.06)' }} />
    <div style={{ position: 'absolute', left: 18, top: 9, width: 54, height: 8, borderRadius: 4, background: 'rgba(20,21,22,0.08)' }} />
    <div style={{ position: 'absolute', right: 18, top: 9, width: 30, height: 8, borderRadius: 4, background: 'rgba(20,21,22,0.08)' }} />
  </>
);

/** His own work: a quiet, generic document window. No product chrome, nothing legible. */
const WorkWindow: React.FC = () => {
  const w = SCREEN_LAYOUT.window;
  return (
    <div
      style={{
        position: 'absolute',
        left: w.x,
        top: w.y,
        width: w.w,
        height: w.h,
        borderRadius: radii.window,
        background: colors.paperRaised,
        boxShadow: `0 0 0 1px ${hairline}, 0 18px 40px -30px rgba(40,30,20,0.35)`,
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 46, borderBottom: `1px solid ${hairline}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14 }}>
        <div style={{ width: 132, height: 8, borderRadius: 8, background: 'rgba(20,21,22,0.10)' }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 44, height: 8, borderRadius: 8, background: 'rgba(20,21,22,0.07)' }} />
      </div>
      <div style={{ padding: '40px 46px 0 46px' }}>
        <div style={{ width: '52%', height: 14, borderRadius: 4, background: 'rgba(20,21,22,0.16)' }} />
        <div style={{ height: 30 }} />
        <Lines widths={[100, 96, 100, 71]} gap={15} />
        <div style={{ height: 34 }} />
        <Lines widths={[100, 92, 98, 100, 58]} gap={15} />
        <div style={{ height: 38 }} />
        {/* a quiet block he is working through */}
        <div style={{ borderTop: `1px solid ${hairline}` }}>
          {[64, 48, 72, 56].map((wd, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 44, borderBottom: `1px solid ${hairline}` }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, boxShadow: `inset 0 0 0 1.5px rgba(20,21,22,0.16)` }} />
              <div style={{ width: `${wd}%`, height: 6, borderRadius: 6, background: 'rgba(20,21,22,0.085)' }} />
            </div>
          ))}
        </div>
        <div style={{ height: 34 }} />
        <Lines widths={[100, 84]} gap={15} />
      </div>
    </div>
  );
};

/**
 * The device-handover request, as it lands on his screen — the one request card of Scenes
 * 01, 07 and 08 (a local variant of the shared RequestCard: same anatomy, no time label,
 * and a status row large enough to read when it resolves in Scene 07). Its only orange is
 * the signal dot; the action chip is neutral.
 */
export const HandoverCard: React.FC<{
  data: RequestData;
  /** Frame the card starts to arrive. */
  start: number;
  /** Frame the status resolves (Scene 07 only). */
  resolveAt?: number;
  resolvedText?: string;
}> = ({ data, start, resolveAt, resolvedText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start) return null;
  const r = SCREEN_LAYOUT.request;
  const s = springAt(frame, fps, start, springs.calm);
  const pulse = progress(frame, start + 6, 30);
  // The action chip clears first, then the status rises in its place (no cross-fade mush).
  // (inOut, not in: an ease-in fade back-loads the exit and the chip ghosts under the rising status)
  const chipOut = resolveAt === undefined ? 0 : progress(frame, resolveAt, 5, ease.inOut);
  const resolved = resolveAt === undefined ? 0 : progress(frame, resolveAt + 5, 14, ease.out);
  const dotOut = resolveAt === undefined ? 0 : progress(frame, resolveAt, 8, ease.inOut);
  const check = resolveAt === undefined ? 0 : progress(frame, resolveAt + 4, 14, ease.inOut);

  return (
    <div
      style={{
        position: 'absolute',
        left: r.x,
        top: r.y,
        width: r.w,
        height: CARD_H,
        opacity: Math.min(1, s * 1.4),
        transform: `translateX(${(1 - s) * 48}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radii.card,
          background: colors.paperRaised,
          boxShadow: `0 0 0 1px ${hairline}, ${shadows.light}`,
        }}
      />
      {/* signal dot → (Scene 07) a quiet check */}
      <div style={{ position: 'absolute', left: CARD.dot.x - 5, top: CARD.dot.y - 5, width: 10, height: 10 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: 10, background: colors.accent, opacity: 1 - dotOut, transform: `scale(${1 - 0.6 * dotOut})` }} />
        <span
          style={{
            position: 'absolute',
            inset: -12 * pulse,
            borderRadius: 40,
            border: `1px solid ${colors.accent}`,
            opacity: (1 - pulse) * 0.75 * (1 - dotOut),
          }}
        />
        {check > 0 ? (
          <span style={{ position: 'absolute', left: -5, top: -5 }}>
            <Check size={20} draw={check} color={colors.textOnLight} strokeWidth={1.8} />
          </span>
        ) : null}
      </div>
      <div style={{ position: 'absolute', left: CARD.textX, right: 24, top: CARD.padTop }}>
        {/* 25 canvas px ≈ 20.7 px on frame: the request must be readable (≥ 20 px) */}
        <div style={{ ...type.body, fontWeight: 500, fontSize: 25, lineHeight: 1.3, color: colors.textOnLight, whiteSpace: 'nowrap' }}>{data.title}</div>
        <div style={{ ...type.label, fontSize: 12, color: colors.mutedOnLight, marginTop: 10, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{data.meta}</div>
      </div>
      {/* status row */}
      <div style={{ position: 'absolute', left: CARD.textX, top: CARD.statusY - 16, height: 32, display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '5px 9px',
            borderRadius: 4,
            color: colors.mutedOnLight,
            boxShadow: `inset 0 0 0 1px ${hairline}`,
            opacity: 1 - chipOut,
            whiteSpace: 'nowrap',
          }}
        >
          {data.status}
        </span>
      </div>
      {resolvedText && resolved > 0 ? (
        <div style={{ position: 'absolute', left: CARD.textX, top: CARD.statusY - 18, height: 36, overflow: 'hidden' }}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: STATUS_FONT_SIZE,
              letterSpacing: '-0.01em',
              lineHeight: '36px',
              color: colors.textOnLight,
              whiteSpace: 'nowrap',
              transform: `translateY(${(1 - resolved) * 36}px)`,
              opacity: Math.min(1, resolved * 1.4),
            }}
          >
            {resolvedText}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ AFTER: his line */

/**
 * The state of the AFTER flow, each 0…1: his line from the request down to the review
 * node, the node, its options, the human decision, the line on to the record, the record.
 */
export type AfterFlowState = { line1: number; node: number; options: number; decided: number; line2: number; record: number };

/** Everything already resolved (Scene 08, and Scene 07 once its flow has run). */
export const AFTER_RESOLVED: AfterFlowState = { line1: 1, node: 1, options: 1, decided: 1, line2: 1, record: 1 };

const LINE_W = 2.6;

/** A vertical stretch of his line, drawn top → bottom, with a small dot growing at its tip as it arrives. */
const LineRun: React.FC<{ x: number; y1: number; y2: number; draw: number; tip?: boolean }> = ({ x, y1, y2, draw, tip = false }) => {
  if (draw <= 0) return null;
  const y = y1 + (y2 - y1) * draw;
  const dot = tip ? Math.max(0, Math.min(1, (draw - 0.85) / 0.15)) : 0;
  return (
    <>
      <line x1={x} y1={y1} x2={x} y2={y} stroke={colors.accent} strokeWidth={LINE_W} strokeLinecap="round" />
      {dot > 0 ? <circle cx={x} cy={y} r={4.5 * dot} fill={colors.accent} /> : null}
    </>
  );
};

/**
 * REVIEW — a human decision on his line: a small ring with the options beside it. His click
 * resolves it: the chosen option comes forward, the others leave, the ring fills.
 */
const ReviewNode: React.FC<{ options: string[]; chosen: string; node: number; reveal: number; decided: number }> = ({ options, chosen, node, reveal, decided }) => {
  const { x, y, r, textDx, fontSize } = AFTER_LAYOUT.review;
  if (node <= 0) return null;
  const ink = colors.textOnLight;
  return (
    <>
      <svg width={1280} height={800} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <circle cx={x} cy={y} r={r * node} fill={colors.paperRaised} stroke={colors.accent} strokeWidth={2.2} />
        {decided > 0 ? <circle cx={x} cy={y} r={(r - 2.2) * decided} fill={colors.accent} /> : null}
      </svg>
      {reveal > 0 ? (
        <div style={{ position: 'absolute', left: x + textDx, top: y - fontSize * 0.62, height: fontSize * 1.3, display: 'flex', alignItems: 'center' }}>
          <Mask>
            <span
              style={{
                ...type.caption,
                fontSize,
                display: 'inline-flex',
                gap: REVIEW_GAP,
                whiteSpace: 'nowrap',
                transform: `translateY(${(1 - reveal) * 1.05}em)`,
                opacity: Math.min(1, reveal * 1.4),
              }}
            >
              {options.map((opt, k) => {
                const isChosen = opt === chosen;
                return (
                  <React.Fragment key={opt}>
                    {k > 0 ? <span style={{ color: colors.mutedOnLight, opacity: 1 - decided }}>/</span> : null}
                    <span style={{ color: isChosen ? ink : colors.mutedOnLight, opacity: isChosen ? 0.62 + 0.38 * decided : 1 - decided }}>{opt}</span>
                  </React.Fragment>
                );
              })}
            </span>
          </Mask>
        </div>
      ) : null}
    </>
  );
};

/** The one record his line arrives at — generated only after the decision. */
const RecordDoc: React.FC<{ p: number }> = ({ p }) => {
  const rec = AFTER_LAYOUT.record;
  if (p <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: rec.x, top: rec.y, width: rec.w, height: rec.h, opacity: Math.min(1, p * 1.2), transform: `translateY(${(1 - p) * 10}px)` }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: colors.paperRaised,
          borderRadius: 4,
          boxShadow: `0 0 0 1px ${hairline}, 0 22px 40px -28px rgba(70,48,24,0.35), 0 4px 10px -6px rgba(70,48,24,0.12)`,
          clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
        }}
      />
      <div style={{ position: 'absolute', right: 0, top: 0, width: 22, height: 22, background: 'linear-gradient(225deg, rgba(0,0,0,0) 50%, #ECE7DE 50%)', boxShadow: '-1px 1px 0 rgba(20,21,22,0.08)' }} />
      <div style={{ position: 'absolute', left: 18, right: 18, top: 26 }}>
        <div style={{ width: '50%', height: 6, borderRadius: 6, background: 'rgba(20,21,22,0.22)' }} />
        <div style={{ height: 16 }} />
        <Lines widths={[100, 90, 100, 62]} gap={10} height={4} color="rgba(20,21,22,0.11)" />
        <div style={{ height: 18 }} />
        <Lines widths={[100, 76]} gap={10} height={4} color="rgba(20,21,22,0.11)" />
      </div>
    </div>
  );
};

/**
 * AFTER: his thin orange line from the request straight down, through the review node (a
 * person approves or rejects), into one record. Without a decision step in the story's
 * workflow the line runs straight from the request to the record.
 */
export const AfterFlow: React.FC<{ flow: AfterFlowState }> = ({ flow }) => {
  const { story } = useStory();
  const decision = reviewDecision(story);
  const { line1, line2 } = AFTER_LAYOUT;
  return (
    <>
      <svg width={1280} height={800} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {decision ? (
          <>
            <LineRun x={line1.x} y1={line1.y1} y2={line1.y2} draw={flow.line1} />
            <LineRun x={line2.x} y1={line2.y1} y2={line2.y2} draw={flow.line2} tip />
          </>
        ) : (
          <LineRun x={line1.x} y1={line1.y1} y2={line2.y2} draw={flow.line2} tip />
        )}
      </svg>
      {decision ? <ReviewNode options={decision.options} chosen={decision.chosen} node={flow.node} reveal={flow.options} decided={flow.decided} /> : null}
      <RecordDoc p={flow.record} />
    </>
  );
};

/* ------------------------------------------------------------------ desk */

/** The single squared sheet on his desk (frame coordinates): paper reduced, not gone. */
export const DESK_SHEET = { x: 1528, y: 900, w: 176, h: 206, tilt: 70 } as const;

/** A point on the desk sheet's near-left edge (frame) — where a pin can attach. */
export const DESK_SHEET_PIN: Pt = { x: DESK_SHEET.x + 14, y: DESK_SHEET.y + 26 };

export const DeskSheet: React.FC<{ light: Light }> = ({ light }) => {
  // paper catches the room's light; it never outshines the screen
  const lit = 0.66 + light.exposure * 0.26;
  return (
    <div
      style={{
        position: 'absolute',
        left: DESK_SHEET.x,
        top: DESK_SHEET.y,
        width: DESK_SHEET.w,
        height: DESK_SHEET.h,
        transform: `perspective(700px) rotateX(${DESK_SHEET.tilt}deg) rotateZ(-2deg)`,
        transformOrigin: '50% 0%',
        filter: `brightness(${lit.toFixed(3)})`,
      }}
    >
      <div style={{ position: 'absolute', inset: '6px -8px -10px -8px', borderRadius: 6, background: 'rgba(40,30,20,0.24)', filter: 'blur(9px)' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(100deg, #F4F1EA 0%, #E6E1D7 100%)',
          borderRadius: 1.5,
          boxShadow: 'inset 0 0 0 1px rgba(20,21,22,0.05)',
          padding: '20px 22px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '46%', height: 10, background: 'rgba(20,21,22,0.24)' }} />
        <div style={{ height: 1.5, background: 'rgba(20,21,22,0.3)', margin: '16px 0 18px' }} />
        <Lines widths={[100, 100, 100, 64]} gap={18} height={3} color="rgba(20,21,22,0.13)" />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ the shot */

export type OpeningPointer = {
  keys?: CursorKey[];
  path?: (frame: number) => Pt;
  clicks?: number[];
  /** Ripple colour — neutral unless the click means something (see Cursor). */
  rippleColor?: string;
};

/**
 * The opening Workspace: his shoulder, the calm screen, the request landing top-right.
 * Scene 01 renders it plain; Scene 07 adds the resolve and his flow; Scene 08 renders it
 * fully resolved (requestStart / resolveAt in the past, `after={AFTER_RESOLVED}`).
 *
 * `figureOffset` (Scenes 07–08): draw his shoulder on its own layer, shifted by this many
 * px (foreground parallax for the split screen; 0 = exactly where Workspace draws it).
 */
export const OpeningWorkspace: React.FC<{
  light: Light;
  flash?: number;
  requestStart: number;
  resolveAt?: number;
  /** His pointer on the screen canvas (omit for no pointer). */
  cursor?: OpeningPointer;
  after?: AfterFlowState;
  figureOffset?: number;
}> = ({ light, flash = 0, requestStart, resolveAt, cursor, after, figureOffset }) => {
  const { story } = useStory();
  const ownFigure = figureOffset !== undefined;
  return (
    <>
      <Workspace
        light={light}
        flash={flash}
        figure={!ownFigure}
        screen={
          <>
            <DesktopBar />
            <WorkWindow />
            {after ? <AfterFlow flow={after} /> : null}
            <HandoverCard data={story.person.request} start={requestStart} resolveAt={resolveAt} resolvedText={resolveAt === undefined ? undefined : story.after.status} />
            {cursor ? <Cursor keys={cursor.keys} path={cursor.path} clicks={cursor.clicks} rippleColor={cursor.rippleColor} /> : null}
          </>
        }
        desk={<DeskSheet light={light} />}
      />
      {ownFigure ? <ForegroundFigure light={light} flash={flash} offsetX={figureOffset} /> : null}
    </>
  );
};

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, radii, shadows, type } from '../../campaign/theme';
import { ease, progress, springAt, springs } from '../../campaign/motion';
import type { Light } from '../../campaign/light';
import type { RequestCard as RequestData } from '../../campaign/types';
import { useStory } from '../../campaign/StoryContext';
import { Workspace } from '../../components/set/Workspace';
import { Cursor, type CursorKey } from '../../components/ui/Cursor';
import { Check } from '../../components/glyphs/Glyphs';
import { AFTER_LAYOUT, CARD, CARD_H, SCREEN_LAYOUT, STATUS_FONT_SIZE } from './geometry';

/**
 * The opening shot shared by Scene 01 (BEFORE, a normal day) and Scene 07 (AFTER):
 * the same Workspace framing, the same calm screen, the same request landing in the same
 * place. Only the light and what happens after the request arrives differ.
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
 * The device-handover request, as it lands on his screen (a local variant of the shared
 * RequestCard: same anatomy, no time label, and a status row large enough to read when
 * it resolves in Scene 07).
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
            color: colors.accent,
            background: colors.accentSoft,
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

/** AFTER: his thin orange line from the request straight down into one record. */
export const AfterFlow: React.FC<{ draw: number; record: number }> = ({ draw, record }) => {
  const { line, record: rec } = AFTER_LAYOUT;
  const y2 = line.y1 + (line.y2 - line.y1) * draw;
  // the end dot grows as the line arrives (no one-frame pop)
  const endDot = Math.max(0, Math.min(1, (draw - 0.85) / 0.15));
  return (
    <>
      {draw > 0 ? (
        <svg width={1280} height={800} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line x1={line.x} y1={line.y1} x2={line.x} y2={y2} stroke={colors.accent} strokeWidth={2.6} strokeLinecap="round" />
          {endDot > 0 ? <circle cx={line.x} cy={y2} r={4.5 * endDot} fill={colors.accent} /> : null}
        </svg>
      ) : null}
      {record > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: rec.x,
            top: rec.y,
            width: rec.w,
            height: rec.h,
            opacity: record,
            transform: `translateY(${(1 - record) * 10}px)`,
          }}
        >
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
      ) : null}
    </>
  );
};

/** The single squared sheet on his desk (frame coordinates): paper reduced, not gone. */
export const DESK_SHEET = { x: 1528, y: 900, w: 176, h: 206, tilt: 70 } as const;

const DeskSheet: React.FC<{ light: Light }> = ({ light }) => {
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

/**
 * The opening Workspace: his shoulder, the calm screen, the request landing top-right.
 * Scene 01 and Scene 07 both render this; Scene 07 adds the resolve and his line.
 *
 * Reuse (e.g. a later AFTER shot that should match Scene 07's resolved screen):
 *   <OpeningWorkspace light={…} requestStart={-100} resolveAt={-100} after={{ draw: 1, record: 1 }} />
 */
export const OpeningWorkspace: React.FC<{
  light: Light;
  flash?: number;
  requestStart: number;
  resolveAt?: number;
  /** His pointer on the screen canvas (omit for no pointer). */
  cursor?: { keys: CursorKey[]; clicks?: number[] };
  after?: { draw: number; record: number };
}> = ({ light, flash = 0, requestStart, resolveAt, cursor, after }) => {
  const { story } = useStory();
  return (
    <Workspace
      light={light}
      flash={flash}
      screen={
        <>
          <DesktopBar />
          <WorkWindow />
          {after ? <AfterFlow draw={after.draw} record={after.record} /> : null}
          <HandoverCard data={story.person.request} start={requestStart} resolveAt={resolveAt} resolvedText={resolveAt === undefined ? undefined : story.after.status} />
          {cursor ? <Cursor keys={cursor.keys} clicks={cursor.clicks} /> : null}
        </>
      }
      desk={<DeskSheet light={light} />}
    />
  );
};

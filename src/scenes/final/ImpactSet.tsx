import React from 'react';
import { colors, fonts, radii, shadows, type } from '../../campaign/theme';
import { useStory } from '../../campaign/StoryContext';
import { Check } from '../../components/glyphs/Glyphs';
import { screenPoint, type Pt } from './geometry';

/**
 * Scene 08's set: the calm AFTER workspace. Everything is already resolved — the request
 * (submitted digitally), his thin orange line running straight DOWN from it into one record
 * (the same vertical line as Scenes 06 and 07, the same card anatomy as Scene 07's resolved
 * request), one quiet notification, and a clear desk with a single squared sheet (paper is
 * reduced, not gone).
 *
 * The flow sits in the left of the screen so the impact pop-ups can hang to the right of it,
 * the way the step words hung off his line in Scene 06.
 *
 * Screen elements are laid out on the 1280×800 screen canvas; the desk sheet in frame
 * coordinates. `IMPACT_PINS` exposes the frame position of each process object so the
 * impact pop-ups can be pinned to it.
 */

/** Card anatomy — mirrors Scene 07's resolved request (check · title · meta · status row). */
const CARD = { padTop: 22, check: { x: 27, y: 35 }, textX: 50, statusY: 116 } as const;

/** Screen-canvas layout (1280×800). */
export const IMPACT_SCREEN = {
  card: { x: 96, y: 64, w: 540, h: 150 },
  /** His line: from under the card's check, straight down into the record. */
  line: { x: 96 + CARD.check.x, y1: 64 + 150 + 2, y2: 64 + 150 + 2 + 256 },
  record: { x: 96 + CARD.check.x - 58, y: 64 + 150 + 2 + 256 + 8, w: 116, h: 142 },
  note: { x: 742, y: 682, w: 404, h: 66 },
} as const;

/** The single sheet on the desk (frame coordinates, before perspective). */
export const DESK_SHEET = { x: 716, y: 898, w: 190, h: 222, tilt: 72 } as const;

export type PinKey = 'item' | 'line' | 'lineEnd' | 'desk' | 'note' | 'record';

const S = IMPACT_SCREEN;

/** Frame position (before the scene camera) of each process object a pop-up can be pinned to. */
export const IMPACT_PINS: Record<PinKey, Pt> = {
  // the right edge of the submitted request, at its middle
  item: screenPoint({ x: S.card.x + S.card.w + 3, y: S.card.y + S.card.h / 2 }),
  // his line, in its upper half
  line: screenPoint({ x: S.line.x + 3, y: S.line.y1 + 40 }),
  // the end of his line, just above the record it arrives at
  lineEnd: screenPoint({ x: S.line.x + 3, y: S.line.y2 - 24 }),
  // the sheet's far edge (perspective: the far edge sits a little below DESK_SHEET.y)
  desk: { x: DESK_SHEET.x + 56, y: DESK_SHEET.y + 20 },
  // top edge of the notification
  note: screenPoint({ x: S.note.x + 40, y: S.note.y }),
  // the right edge of the record, at its middle
  record: screenPoint({ x: S.record.x + S.record.w + 3, y: S.record.y + S.record.h * 0.5 }),
};

const hairline = colors.stoneLine;
const raised = (radius: number): React.CSSProperties => ({
  position: 'absolute',
  background: colors.paperRaised,
  borderRadius: radius,
  boxShadow: `0 0 0 1px ${hairline}, 0 22px 40px -28px rgba(70,48,24,0.35), 0 4px 10px -6px rgba(70,48,24,0.12)`,
});

/** Skeleton text lines — prop texture nobody needs to read. */
const Lines: React.FC<{ widths: number[]; gap: number; height?: number; color?: string }> = ({ widths, gap, height = 4, color = 'rgba(20,21,22,0.10)' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>
    {widths.map((w, i) => (
      <div key={i} style={{ width: `${w}%`, height, borderRadius: height, background: color }} />
    ))}
  </div>
);

/** What is on his screen in Scene 08 (1280×800 canvas). */
export const ImpactScreen: React.FC = () => {
  const { story } = useStory();
  const request = story.person.request;
  const { card, line, record, note } = S;

  return (
    <>
      {/* light falling across the screen — keeps it a lit surface, not a flat slab */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 75% 85% at 28% 40%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%, rgba(90,64,40,0.07) 100%)',
        }}
      />
      {/* the quiet frame of a desktop — the same faint top bar as Scenes 01 / 07, no product chrome */}
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 26, background: 'rgba(20,21,22,0.035)', borderBottom: '1px solid rgba(20,21,22,0.06)' }} />
      <div style={{ position: 'absolute', left: 18, top: 9, width: 54, height: 8, borderRadius: 4, background: 'rgba(20,21,22,0.08)' }} />
      <div style={{ position: 'absolute', right: 18, top: 9, width: 30, height: 8, borderRadius: 4, background: 'rgba(20,21,22,0.08)' }} />

      {/* the request, resolved: the same card he clicked in Scene 07 */}
      <div style={{ position: 'absolute', left: card.x, top: card.y, width: card.w, height: card.h }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: radii.card, background: colors.paperRaised, boxShadow: `0 0 0 1px ${hairline}, ${shadows.light}` }} />
        <div style={{ position: 'absolute', left: CARD.check.x - 10, top: CARD.check.y - 10 }}>
          <Check size={20} color={colors.textOnLight} strokeWidth={1.8} />
        </div>
        <div style={{ position: 'absolute', left: CARD.textX, right: 24, top: CARD.padTop }}>
          <div style={{ ...type.body, fontWeight: 500, fontSize: 23, lineHeight: 1.35, color: colors.textOnLight, whiteSpace: 'nowrap' }}>{request.title}</div>
          <div style={{ ...type.label, fontSize: 12, color: colors.mutedOnLight, marginTop: 10, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{request.meta}</div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: CARD.textX,
            top: CARD.statusY - 18,
            fontFamily: fonts.sans,
            fontWeight: 500,
            fontSize: 25,
            letterSpacing: '-0.01em',
            lineHeight: '36px',
            color: colors.textOnLight,
            whiteSpace: 'nowrap',
          }}
        >
          {story.after.status}
        </div>
      </div>

      {/* his line: from the request straight down into the record */}
      <svg width={1280} height={800} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={line.x} y1={line.y1} x2={line.x} y2={line.y2} stroke={colors.accent} strokeWidth={2.6} strokeLinecap="round" />
        <circle cx={line.x} cy={line.y2} r={4.5} fill={colors.accent} />
      </svg>

      {/* the record: one document, in one place */}
      <div style={{ position: 'absolute', left: record.x, top: record.y, width: record.w, height: record.h }}>
        <div
          style={{
            ...raised(4),
            inset: 0,
            clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
          }}
        />
        {/* folded corner */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 22,
            height: 22,
            background: 'linear-gradient(225deg, rgba(0,0,0,0) 50%, #ECE7DE 50%)',
            boxShadow: '-1px 1px 0 rgba(20,21,22,0.08)',
          }}
        />
        <div style={{ position: 'absolute', left: 18, right: 18, top: 26 }}>
          <div style={{ width: '50%', height: 6, borderRadius: 6, background: 'rgba(20,21,22,0.22)' }} />
          <div style={{ height: 16 }} />
          <Lines widths={[100, 90, 100, 62]} gap={10} color="rgba(20,21,22,0.11)" />
          <div style={{ height: 18 }} />
          <Lines widths={[100, 76]} gap={10} color="rgba(20,21,22,0.11)" />
        </div>
      </div>

      {/* one quiet notification: the people who needed to know, told */}
      <div
        style={{
          ...raised(33),
          left: note.x,
          top: note.y,
          width: note.w,
          height: note.h,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 28px',
          boxSizing: 'border-box',
        }}
      >
        <Check size={18} color={colors.mutedOnLight} strokeWidth={1.8} />
        <span style={{ fontFamily: fonts.sans, fontSize: 24, fontWeight: 500, letterSpacing: '-0.005em', color: colors.mutedOnLight, whiteSpace: 'nowrap' }}>
          {story.workflow.notifyTargets.join('  ·  ')}
        </span>
      </div>
    </>
  );
};

/** One squared sheet lying on the clear desk (frame coordinates; goes in <Workspace desk>). */
export const DeskSheet: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: DESK_SHEET.x,
      top: DESK_SHEET.y,
      width: DESK_SHEET.w,
      height: DESK_SHEET.h,
      transform: `perspective(700px) rotateX(${DESK_SHEET.tilt}deg)`,
      transformOrigin: '50% 0%',
    }}
  >
    {/* contact shadow on the desk */}
    <div style={{ position: 'absolute', inset: '6px -8px -10px -8px', borderRadius: 6, background: 'rgba(60,40,22,0.22)', filter: 'blur(9px)' }} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        // room-lit paper: brighter towards the window, never brighter than the screen
        background: 'linear-gradient(100deg, #F4EFE6 0%, #EAE3D8 100%)',
        borderRadius: 1.5,
        boxShadow: 'inset 0 0 0 1px rgba(20,21,22,0.05)',
        padding: '20px 24px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '48%', height: 10, background: 'rgba(20,21,22,0.24)' }} />
      <div style={{ height: 1.5, background: 'rgba(20,21,22,0.3)', margin: '16px 0 18px' }} />
      <Lines widths={[100, 100, 100, 66]} gap={18} height={3} color="rgba(20,21,22,0.13)" />
    </div>
  </div>
);

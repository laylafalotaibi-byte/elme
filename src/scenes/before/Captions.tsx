import React from 'react';
import { useCurrentFrame } from 'remotion';
import { toneColors, type, type Tone } from '../../campaign/theme';
import { ease, progress } from '../../campaign/motion';
import { Annotation } from '../../components/ui/Annotation';
import { Mask } from '../../components/typography/Reveal';
import { ANNOTATION, CAPTION } from './timing';

type Pt = { x: number; y: number };

/**
 * Step caption — the step's name, set small on its own artefact (no rail, no numbers):
 * a hairline that draws, then the word rising from a mask. Built in 8 f (BEFORE shots are
 * short; a caption must be complete well before its cut).
 */
export const StepCaption: React.FC<{
  text: string | null;
  x: number;
  y: number;
  start: number;
  tone?: Tone;
  /** Right-align to x instead of left. */
  alignRight?: boolean;
}> = ({ text, x, y, start, tone = 'light', alignRight = false }) => {
  const frame = useCurrentFrame();
  if (!text || frame < start) return null;
  const c = toneColors(tone);
  const rule = progress(frame, start, CAPTION.rule, ease.out);
  const word = progress(frame, start + CAPTION.wordDelay, CAPTION.word, ease.out);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transform: alignRight ? 'translateX(-100%)' : undefined,
        flexDirection: alignRight ? 'row-reverse' : 'row',
      }}
    >
      <span style={{ width: 26 * rule, height: 1.5, background: c.text, opacity: 0.55 }} />
      <Mask>
        <span
          style={{
            display: 'inline-block',
            ...type.caption,
            color: c.text,
            whiteSpace: 'nowrap',
            transform: `translateY(${(1 - word) * 1.05}em)`,
            opacity: Math.min(1, word * 1.5),
          }}
        >
          {text}
        </span>
      </Mask>
    </div>
  );
};

/* ------------------------------------------------------------------ annotations */

/** Geometry of the shared <Annotation> pill (22 px caption, padding 11/18/11/15, 8 px dot, 12 px gap). */
const PILL = { halfH: 24, dotX: 19, padL: 15 + 8 + 12, padR: 18, fontSize: 22 } as const;

/** The leader is drawn on whatever the pill points across: a lit screen or desk, or the dark room. */
const LEADER = {
  light: { line: 'rgba(20,21,22,0.55)', dot: 'rgba(20,21,22,0.78)', ring: 'rgba(251,250,247,0.9)' },
  dark: { line: 'rgba(242,240,235,0.5)', dot: 'rgba(242,240,235,0.85)', ring: 'rgba(11,12,14,0.8)' },
} as const;

/**
 * An annotation pop-up pinned to the object it describes: the shared <Annotation> pill
 * (verbatim copy, neutral dot) plus a hairline leader that draws from the pill to a dot on
 * the object. Laid out in the coordinate space of the shot it lives in, so it belongs to
 * that shot — it leaves with it on the cut.
 *
 *   at      the pill's left-centre (align 'left') or right-centre (align 'right')
 *   target  the point on the object
 *   from    where the leader leaves the pill: its end ('side'), or from under/over its dot
 *   ground  what the leader crosses (a lit screen / desk → a dark hairline; the dark room → light)
 */
export const PinnedAnnotation: React.FC<{
  text: string | undefined;
  at: Pt;
  target: Pt;
  start: number;
  align?: 'left' | 'right';
  from?: 'side' | 'top' | 'bottom';
  /** Already in place (continuity when we cut back to the same framing). */
  held?: boolean;
  tone?: Tone;
  ground?: 'light' | 'dark';
}> = ({ text, at, target, start, align = 'left', from = 'side', held = false, tone = 'dark', ground = 'light' }) => {
  const frame = useCurrentFrame();
  if (!text || (!held && frame < start)) return null;
  const g = LEADER[ground];
  const right = align === 'right';
  const lead = held ? 1 : progress(frame, start + ANNOTATION.leadDelay, ANNOTATION.lead, ease.inOut);
  const dotX = right ? at.x - 24 : at.x + PILL.dotX;
  const origin = from === 'side' ? at : { x: dotX, y: at.y + (from === 'top' ? -PILL.halfH : PILL.halfH) };
  const pillStart = held ? -1000 : start;
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width={1} height={1}>
        {lead > 0 ? (
          <line
            x1={origin.x}
            y1={origin.y}
            x2={origin.x + (target.x - origin.x) * lead}
            y2={origin.y + (target.y - origin.y) * lead}
            stroke={g.line}
            strokeWidth={1.25}
          />
        ) : null}
        {lead > 0.98 ? <circle cx={target.x} cy={target.y} r={3.2} fill={g.dot} stroke={g.ring} strokeWidth={1.2} /> : null}
      </svg>
      {right ? (
        // Right-aligned: an invisible copy of the text sizes the wrapper to the pill's width.
        <div style={{ position: 'absolute', left: at.x, top: at.y, transform: 'translateX(-100%)' }}>
          <span
            style={{
              display: 'block',
              height: 0,
              overflow: 'hidden',
              visibility: 'hidden',
              whiteSpace: 'nowrap',
              ...type.caption,
              fontSize: PILL.fontSize,
              paddingLeft: PILL.padL,
              paddingRight: PILL.padR,
            }}
          >
            {text}
          </span>
          <Annotation text={text} x={0} y={0} start={pillStart} tone={tone} busy />
        </div>
      ) : (
        <Annotation text={text} x={at.x} y={at.y} start={pillStart} tone={tone} busy />
      )}
    </>
  );
};

import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { cutPath, getLength, getPointAtLength } from '@remotion/paths';
import { colors, shadows } from '../../campaign/theme';
import { ease, glide, mapClamp, progress, span } from '../../campaign/motion';
import { useStory } from '../../campaign/StoryContext';
import { Cursor } from '../../components/ui/Cursor';
import { PaperForm } from '../../components/ui/artifacts/PaperForm';
import { FileChip } from '../../components/ui/artifacts/FileChip';
import { CROSS_OUT, CROSS_POINTS, DRAFT_1, DRAFT_2, INSERT_CAMERA, SKETCH, STRAIGHT, curveToPath, lerpCurve, type Pt } from './sketch';
import { S05, S05_LAST } from './timing';

/**
 * Scene 05's screen insert, after the cut: a quiet notebook page. His notes on the right
 * (a page he is reading — text only), and on the page the two ends of his problem in
 * miniature — the paper form and a single record — with his drafts between them: a
 * learner's sketches, not an expert's diagram.
 *
 * Picture layers sit under one slow push (INSERT_CAMERA) and a rack focus (notes → page).
 * Scene 06 renders this frozen on Scene 05's last frame and clears it (`clear`), drawing
 * the line itself.
 */

const PENCIL = '#2B2A27';
const PANE = { x: 1452, y: 168, w: 600, h: 680, pad: 48 } as const;
/** Ruled page: one rule every RULE px, offset so his line runs between two rules. */
const RULE = { gap: 46, offset: 14 } as const;
/** Speed (px/frame) above which the shared Cursor draws its shutter trail. */
const TRAIL_FROM = 60;
/** A reading highlight — neutral (orange is kept for his line). */
const HIGHLIGHT = 'rgba(150,128,96,0.2)';

const D1 = curveToPath(DRAFT_1);
const D2 = curveToPath(DRAFT_2);
const D1_LEN = getLength(D1);
const D2_LEN = getLength(D2);
const [X1, X2] = CROSS_OUT;
const X1_LEN = getLength(X1);
const X2_LEN = getLength(X2);
const DASH = 11;

/** The slow push on the insert's picture (1 at the cut → INSERT_CAMERA.zoomEnd on the last frame). */
export const insertZoom = (frame: number) =>
  1 + (INSERT_CAMERA.zoomEnd - 1) * mapClamp(frame, [S05.cut, S05_LAST], [0, 1], (t) => t * (1.6 - 0.6 * t));

type Key = { f: number; x: number; y: number; v?: number };

/** Path through keys (frame → position), gliding through keys with v > 0. */
const along = (frame: number, keys: Key[]): Pt => {
  if (frame <= keys[0].f) return { x: keys[0].x, y: keys[0].y };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (frame <= b.f) {
      const t = mapClamp(frame, [a.f, b.f], [0, 1], glide(a.v ?? 0, b.v ?? 0));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last.x, y: last.y };
};

const at = (d: string, len: number, p: number): Pt => {
  const pt = getPointAtLength(d, Math.max(0.01, len * p));
  return pt ? { x: pt.x, y: pt.y } : { x: 0, y: 0 };
};

/** Drawing a draft: an even hand (peak 1.25× average), not a whip. */
const DRAW = glide(0.5, 0.5);
/** Crossing out: a quick, nearly even slash that slows a little at the end. */
const SLASH = glide(0.7, 0.3);

/* ------------------------------------------------------------------ the page */

/** Abstract text: rows of word-shaped bars (nobody should read them — no invented copy). */
type Row = { y: number; w: number };
const NOTES: Row[][] = [
  [{ y: 54, w: 410 }, { y: 82, w: 420 }, { y: 110, w: 310 }],
  [{ y: 166, w: 416 }, { y: 194, w: 384 }, { y: 222, w: 424 }, { y: 250, w: 252 }],
  [{ y: 306, w: 402 }, { y: 334, w: 420 }, { y: 362, w: 296 }],
  [{ y: 418, w: 412 }, { y: 446, w: 366 }, { y: 474, w: 424 }, { y: 502, w: 214 }],
  [{ y: 558, w: 388 }, { y: 586, w: 198 }],
];

const TextRows: React.FC<{ rows: Row[]; seed: string; highlight?: (i: number) => number }> = ({ rows, seed, highlight }) => (
  <>
    {rows.map((row, i) => {
      const words: Array<{ x: number; w: number }> = [];
      let x = 0;
      let j = 0;
      while (x < row.w - 20) {
        const w = Math.min(row.w - x, 24 + random(`${seed}-${i}-${j}`) * 72);
        words.push({ x, w });
        x += w + 10;
        j++;
      }
      const h = highlight ? highlight(i) : 0;
      return (
        <React.Fragment key={i}>
          {h > 0 ? <div style={{ position: 'absolute', left: -8, top: row.y - 9, width: (row.w + 16) * h, height: 28, borderRadius: 4, background: HIGHLIGHT }} /> : null}
          {words.map((wd, k) => (
            <div key={k} style={{ position: 'absolute', left: wd.x, top: row.y, width: wd.w, height: 10, borderRadius: 5, background: 'rgba(20,21,22,0.17)' }} />
          ))}
        </React.Fragment>
      );
    })}
  </>
);

/** Reading beat: the first line of his notes is read over READ_LINE. */
const READ_LINE = [S05.read[0] + 1, S05.read[1] - 1] as const;
const NOTE_LINE_1 = { from: { x: PANE.x + PANE.pad + 4, y: PANE.y + PANE.pad + NOTES[0][0].y + 5 }, to: { x: PANE.x + PANE.pad + 290, y: PANE.y + PANE.pad + NOTES[0][0].y + 9 } } as const;

/** His notes: a page he is reading. Text only — no figures. */
const NotesPane: React.FC<{ frame: number }> = ({ frame }) => {
  const read = (i: number) => (i === 0 ? progress(frame, READ_LINE[0], READ_LINE[1] - READ_LINE[0], ease.inOut) * (1 - progress(frame, S05.draft1[0] - 1, 14)) : 0);
  return (
    <div
      style={{
        position: 'absolute',
        left: PANE.x,
        top: PANE.y,
        width: PANE.w,
        height: PANE.h,
        borderRadius: 14,
        background: colors.paperRaised,
        boxShadow: `0 0 0 1px ${colors.stoneLine}, ${shadows.light}`,
      }}
    >
      <div style={{ position: 'absolute', left: PANE.pad, top: PANE.pad, width: 430 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 200, height: 14, borderRadius: 7, background: 'rgba(20,21,22,0.36)' }} />
        {NOTES.map((rows, k) => (
          <TextRows key={k} seed={`notes-${k}`} rows={rows} highlight={k === 0 ? read : undefined} />
        ))}
      </div>
    </div>
  );
};

/** A quiet ruled page — his notebook — fading out towards the edges of the screen. */
const NotebookPage: React.FC<{ opacity: number }> = ({ opacity }) => {
  const mask = 'radial-gradient(ellipse 72% 70% at 46% 52%, #000 55%, rgba(0,0,0,0) 100%)';
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${RULE.gap - 1}px, rgba(84,70,52,0.085) ${RULE.gap - 1}px, rgba(84,70,52,0.085) ${RULE.gap}px)`,
        backgroundPosition: `0 ${RULE.offset}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
};

/** The two ends of his problem, in miniature: the film's own paper form and a single record. */
const MiniArtefacts: React.FC = () => {
  const { story } = useStory();
  const a = story.before.artifacts;
  const FORM = { w: 300, k: 0.36 };
  const RECORD = { w: 236, k: 0.62 };
  return (
    <>
      <div style={{ position: 'absolute', left: SKETCH.form.x, top: SKETCH.form.y, transform: `translate(-50%, -50%) rotate(-3deg) scale(${FORM.k})`, transformOrigin: '50% 50%' }}>
        <PaperForm {...a.form} fill={1} sign={0} width={FORM.w} style={{ boxShadow: '0 30px 40px -24px rgba(40,30,20,0.5), 0 4px 10px rgba(40,30,20,0.18)' }} />
      </div>
      <div style={{ position: 'absolute', left: SKETCH.record.x, top: SKETCH.record.y - 3, transform: `translate(-50%, -50%) scale(${RECORD.k})`, transformOrigin: '50% 50%' }}>
        <FileChip location="" fileName={a.records.fileName} tone="light" width={RECORD.w} />
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ his hand */

/**
 * His cursor at any (fractional) frame: reads, turns to the page, draws, crosses out,
 * draws again and straightens. Sampled at fractional frames by <Cursor> for its shutter trail.
 */
export const cursorAt = (f: number): Pt => {
  if (f < S05.draft1[0]) {
    return along(f, [
      { f: S05.cut, x: NOTE_LINE_1.from.x + 40, y: NOTE_LINE_1.from.y + 46 },
      { f: READ_LINE[0], ...NOTE_LINE_1.from, v: 0.4 },
      { f: READ_LINE[1], ...NOTE_LINE_1.to },
      { f: S05.read[1], x: NOTE_LINE_1.to.x - 4, y: NOTE_LINE_1.to.y + 6 },
      // he turns to the page: one quick move that runs straight into the first stroke
      { f: S05.draft1[0], ...SKETCH.start, v: 0.4 },
    ]);
  }
  if (f <= S05.draft1[1]) return at(D1, D1_LEN, span(f, S05.draft1, DRAW));
  if (f < S05.cross1[0]) return along(f, [{ f: S05.draft1[1], ...SKETCH.end }, { f: S05.cross1[0], ...CROSS_POINTS.first.from, v: 0.5 }]);
  if (f <= S05.cross1[1]) return at(X1, X1_LEN, span(f, S05.cross1, SLASH));
  if (f < S05.cross2[0]) return along(f, [{ f: S05.cross1[1], ...CROSS_POINTS.first.to, v: 0.3 }, { f: S05.cross2[0], ...CROSS_POINTS.second.from, v: 0.5 }]);
  if (f <= S05.cross2[1]) return at(X2, X2_LEN, span(f, S05.cross2, SLASH));
  if (f < S05.draft2[0]) return along(f, [{ f: S05.cross2[1], ...CROSS_POINTS.second.to, v: 0.3 }, { f: S05.draft2[0], ...SKETCH.start }]);
  if (f <= S05.draft2[1]) return at(D2, D2_LEN, span(f, S05.draft2, DRAW));
  const lineD = curveToPath(lerpCurve(DRAFT_2, STRAIGHT, span(f, S05.straighten)));
  const mid = at(lineD, getLength(lineD), 0.5);
  if (f < S05.grab[1]) return along(f, [{ f: S05.draft2[1], ...SKETCH.end }, { f: S05.grab[1], ...mid }]);
  return mid;
};

export const LearningInsert: React.FC<{
  /** 0 = Scene 05 as shot; 1 = page, notes, artefacts, drafts and cursor cleared away (Scene 06). */
  clear?: number;
  /** Scene 06 draws the line itself. */
  hideLine?: boolean;
  /** Render at this frame instead of the current one (Scene 06 holds Scene 05's last frame). */
  frame?: number;
}> = ({ clear = 0, hideLine = false, frame: frameOverride }) => {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const keep = 1 - clear;
  const zoom = insertZoom(frame);

  // Rack focus: his notes are sharp while he reads, then focus pulls to the page.
  const toCanvas = progress(frame, S05.read[1], 14, ease.inOut);
  const paneBlur = 5 * toCanvas;
  const canvasBlur = 2.6 * (1 - toCanvas);

  // Draft 1: drawn (dashed), crossed out, then pushed back.
  const p1 = span(frame, S05.draft1, DRAW);
  const px1 = span(frame, S05.cross1, SLASH);
  const px2 = span(frame, S05.cross2, SLASH);
  const draft1Opacity = interpolate(span(frame, S05.draft1Fade), [0, 1], [1, 0.16]);

  // Draft 2 → committed → straightened.
  const p2 = span(frame, S05.draft2, DRAW);
  const solid = span(frame, S05.solidify);
  const straight = span(frame, S05.straighten);
  const lineD = curveToPath(lerpCurve(DRAFT_2, STRAIGHT, straight));
  const shown = p2 >= 1 ? lineD : p2 > 0 ? cutPath(D2, D2_LEN * p2) : null;
  const gap = DASH * (1 - solid);
  const blur = (px: number) => (px > 0.05 ? `blur(${px}px)` : undefined);
  const prev = cursorAt(frame - 1);
  const now = cursorAt(frame);
  const motionBlur = 1.4 * Math.min(1, Math.max(0, (Math.hypot(now.x - prev.x, now.y - prev.y) - TRAIL_FROM) / 110));

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${INSERT_CAMERA.origin.x}px ${INSERT_CAMERA.origin.y}px` }}>
      <NotebookPage opacity={keep} />
      <div style={{ opacity: keep, transform: `translateX(${clear * 40}px)`, filter: blur(paneBlur) }}>
        <NotesPane frame={frame} />
      </div>

      <AbsoluteFill style={{ opacity: keep, filter: blur(canvasBlur) }}>
        <MiniArtefacts />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: blur(canvasBlur) }}>
        <g opacity={keep * draft1Opacity}>
          {p1 > 0 ? <path d={p1 >= 1 ? D1 : cutPath(D1, D1_LEN * p1)} fill="none" stroke={PENCIL} strokeWidth={2.8} strokeDasharray={`${DASH} ${DASH}`} strokeLinecap="round" /> : null}
          {px1 > 0 ? <path d={px1 >= 1 ? X1 : cutPath(X1, X1_LEN * px1)} fill="none" stroke={PENCIL} strokeWidth={3.4} strokeLinecap="round" /> : null}
          {px2 > 0 ? <path d={px2 >= 1 ? X2 : cutPath(X2, X2_LEN * px2)} fill="none" stroke={PENCIL} strokeWidth={3.4} strokeLinecap="round" /> : null}
        </g>
        {!hideLine && shown ? (
          <path
            d={shown}
            fill="none"
            stroke={PENCIL}
            strokeWidth={2.8 + (SKETCH.strokeWidth - 2.8) * solid}
            strokeDasharray={gap > 0.05 ? `${DASH} ${gap}` : undefined}
            strokeLinecap="round"
          />
        ) : null}
      </svg>

      {/*
        His hand. The shared cursor draws its shutter trail on the few fast moves; a matching
        motion blur on the layer (only while fast) lets that trail read as smear, not as copies.
      */}
      <AbsoluteFill style={{ filter: blur(motionBlur) }}>
        <Cursor path={frameOverride === undefined ? cursorAt : () => cursorAt(frameOverride)} scale={1.5} opacity={keep} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

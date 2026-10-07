import React from 'react';
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from 'remotion';
import { cutPath, getLength, getPointAtLength } from '@remotion/paths';
import { colors, shadows } from '../../campaign/theme';
import { ease, mapClamp, progress } from '../../campaign/motion';
import { CROSS_OUT, CROSS_POINTS, DRAFT_1, DRAFT_2, INSERT_CAMERA, SKETCH, STRAIGHT, curveToPath, lerpCurve, type Pt } from './sketch';
import { Pointer } from './Pointer';
import { S05, S05_LAST } from './timing';

/**
 * Scene 05's screen insert, after the cut: his notes on the right (a page he is reading,
 * with the small figure he is learning from), a blank canvas with the two ends of his
 * problem, and his drafts — a learner's sketches, not an expert's diagram.
 *
 * Picture layers sit under one slow push (INSERT_CAMERA) and a rack focus (notes → canvas).
 * Scene 06 renders this frozen on Scene 05's last frame and clears it (`clear`), drawing
 * the line itself.
 */

const PENCIL = '#2B2A27';
const PANE = { x: 1452, y: 168, w: 600, h: 680, pad: 48 } as const;

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

/**
 * Easing with given start / end velocities (relative to the segment's average speed): a hand
 * keeps moving through a key instead of stopping dead at each one (v = 0 → it settles there).
 * Peak speed of glide(0, 0) is 1.5× the average — far gentler than ease.inOut for long moves.
 */
const glide = (v0: number, v1: number) => Easing.bezier(1 / 3, v0 / 3, 2 / 3, 1 - v1 / 3);

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

const span = (frame: number, s: readonly [number, number], easing = ease.inOut) => progress(frame, s[0], s[1] - s[0], easing);

/** Drawing a draft: an even hand (peak 1.5× average), not a whip. */
const DRAW = glide(0, 0);
/** Crossing out: a quick, nearly even slash that slows a little at the end. */
const SLASH = glide(0.7, 0.3);

/** Abstract text: rows of word-shaped bars (nobody should read them — no invented copy). */
const TextRows: React.FC<{ rows: Array<{ y: number; w: number }>; seed: string; highlight?: (i: number) => number }> = ({ rows, seed, highlight }) => (
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
          {h > 0 ? <div style={{ position: 'absolute', left: -8, top: row.y - 9, width: (row.w + 16) * h, height: 28, borderRadius: 4, background: colors.accentSoft }} /> : null}
          {words.map((wd, k) => (
            <div key={k} style={{ position: 'absolute', left: wd.x, top: row.y, width: wd.w, height: 10, borderRadius: 5, background: 'rgba(20,21,22,0.17)' }} />
          ))}
        </React.Fragment>
      );
    })}
  </>
);

/** His notes: a page he is reading, with the small figure he is trying to reproduce. */
const NotesPane: React.FC<{ frame: number }> = ({ frame }) => {
  // He reads the first line (highlighted as his cursor passes), then studies the figure.
  const reading: Array<readonly [number, number]> = [READ.line];
  const read = (i: number) => {
    const s = reading[i];
    if (!s) return 0;
    return progress(frame, s[0], s[1] - s[0], ease.inOut) * (1 - progress(frame, S05.draft1[0] - 1, 14));
  };
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
      <div style={{ position: 'absolute', left: PANE.pad, top: PANE.pad, width: 420 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 200, height: 14, borderRadius: 7, background: 'rgba(20,21,22,0.44)' }} />
        <TextRows seed="notes-a" rows={[{ y: 54, w: 410 }, { y: 82, w: 420 }, { y: 110, w: 310 }]} highlight={read} />
        {/* the figure he is learning from */}
        <div style={{ position: 'absolute', left: 0, top: 150, width: 420, height: 160, borderRadius: 10, background: 'rgba(20,21,22,0.035)', boxShadow: `inset 0 0 0 1px ${colors.stoneLine}` }}>
          <svg width={420} height={160} style={{ position: 'absolute', inset: 0 }}>
            <rect x={58} y={64} width={32} height={32} rx={6} fill="none" stroke="rgba(20,21,22,0.62)" strokeWidth={1.8} />
            <rect x={330} y={64} width={32} height={32} rx={6} fill="none" stroke="rgba(20,21,22,0.62)" strokeWidth={1.8} />
            <line x1={98} y1={80} x2={322} y2={80} stroke="rgba(20,21,22,0.62)" strokeWidth={1.8} />
          </svg>
        </div>
        <TextRows seed="notes-b" rows={[{ y: 350, w: 416 }, { y: 378, w: 370 }, { y: 406, w: 424 }, { y: 434, w: 240 }]} />
        <TextRows seed="notes-c" rows={[{ y: 488, w: 400 }, { y: 516, w: 330 }, { y: 544, w: 190 }]} />
      </div>
    </div>
  );
};

/** A learner's dashed placeholder box with a tiny glyph (a form → a record). */
const SketchBox: React.FC<{ x: number; y: number; size: number; glyph: 'form' | 'record' }> = ({ x: cx, y: cy, size, glyph }) => {
  const x = cx - size / 2;
  const y = cy - size / 2;
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={12} fill="none" stroke={PENCIL} strokeOpacity={0.72} strokeWidth={2.2} strokeDasharray="8 7" />
      {glyph === 'form' ? (
        <g stroke={PENCIL} strokeOpacity={0.6} strokeWidth={1.9} fill="none" strokeLinecap="round">
          <rect x={cx - 14} y={cy - 19} width={28} height={38} rx={2.5} />
          <line x1={cx - 7} y1={cy - 8} x2={cx + 7} y2={cy - 8} />
          <line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} />
          <line x1={cx - 7} y1={cy + 8} x2={cx + 2} y2={cy + 8} />
        </g>
      ) : (
        <g stroke={PENCIL} strokeOpacity={0.6} strokeWidth={1.9} fill="none" strokeLinejoin="round">
          <rect x={cx - 9} y={cy - 20} width={28} height={36} rx={2.5} />
          <rect x={cx - 17} y={cy - 12} width={28} height={36} rx={2.5} fill={colors.paperRaised} />
        </g>
      )}
    </g>
  );
};

/* ------------------------------------------------------------------ his hand */

/** Notes-pane landmarks (frame coordinates before the push): line 1, the figure's two boxes. */
const NOTE_LINE_1 = { from: { x: PANE.x + PANE.pad + 4, y: 278 }, to: { x: PANE.x + PANE.pad + 284, y: 282 } } as const;
const FIGURE = { a: { x: PANE.x + PANE.pad + 76, y: 448 }, b: { x: PANE.x + PANE.pad + 342, y: 450 } } as const;

/** Reading beats: line 1 is read over READ.line, then the figure is traced, then he goes to the canvas. */
const READ = {
  line: [S05.read[0] + 1, S05.read[0] + 8] as const,
  figure: [S05.read[0] + 13, S05.read[1]] as const,
};

/**
 * His cursor at any (fractional) frame: reads, studies the figure, draws, crosses out, draws
 * again and straightens. Sampled at fractional frames for the motion trail.
 */
export const cursorAt = (f: number): { pos: Pt; down: number } => {
  if (f < S05.draft1[0]) {
    return {
      pos: along(f, [
        { f: S05.cut, x: NOTE_LINE_1.from.x + 32, y: NOTE_LINE_1.from.y + 40 },
        { f: READ.line[0], ...NOTE_LINE_1.from, v: 0.5 },
        { f: READ.line[1], ...NOTE_LINE_1.to, v: 0.25 },
        { f: READ.figure[0], ...FIGURE.a, v: 0.35 },
        { f: READ.figure[1], ...FIGURE.b },
        { f: S05.draft1[0], ...SKETCH.start },
      ]),
      down: 0,
    };
  }
  if (f <= S05.draft1[1]) return { pos: at(D1, D1_LEN, span(f, S05.draft1, DRAW)), down: 1 };
  if (f < S05.cross1[0]) return { pos: along(f, [{ f: S05.draft1[1], ...SKETCH.end }, { f: S05.cross1[0], ...CROSS_POINTS.first.from, v: 0.5 }]), down: 0 };
  if (f <= S05.cross1[1]) return { pos: at(X1, X1_LEN, span(f, S05.cross1, SLASH)), down: 1 };
  if (f < S05.cross2[0]) return { pos: along(f, [{ f: S05.cross1[1], ...CROSS_POINTS.first.to, v: 0.3 }, { f: S05.cross2[0], ...CROSS_POINTS.second.from, v: 0.5 }]), down: 0 };
  if (f <= S05.cross2[1]) return { pos: at(X2, X2_LEN, span(f, S05.cross2, SLASH)), down: 1 };
  if (f < S05.draft2[0]) return { pos: along(f, [{ f: S05.cross2[1], ...CROSS_POINTS.second.to, v: 0.3 }, { f: S05.draft2[0], ...SKETCH.start }]), down: 0 };
  if (f <= S05.draft2[1]) return { pos: at(D2, D2_LEN, span(f, S05.draft2, DRAW)), down: 1 };
  const lineD = curveToPath(lerpCurve(DRAFT_2, STRAIGHT, span(f, S05.straighten)));
  const mid = at(lineD, getLength(lineD), 0.5);
  if (f < S05.grab[1]) return { pos: along(f, [{ f: S05.draft2[1], ...SKETCH.end }, { f: S05.grab[1], ...mid }]), down: 0 };
  return { pos: mid, down: f < S05.straighten[1] + 2 ? 1 : 0 };
};

/** Speed (px/frame) above which a faint motion smear is drawn behind the pointer (a shutter, not an effect). */
const TRAIL_FROM = 60;
const TRAIL_STEPS = [0.12, 0.24, 0.36, 0.48, 0.6];

export const LearningInsert: React.FC<{
  /** 0 = Scene 05 as shot; 1 = notes, boxes, drafts and cursor cleared away (Scene 06). */
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

  // Rack focus: his notes are sharp while he reads, then focus pulls to the canvas.
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

  // His hand, with a faint trail on the few fast moves (a camera's motion blur, not an effect).
  const cursor = cursorAt(frame);
  const prev = cursorAt(frame - 1).pos;
  const speed = Math.hypot(cursor.pos.x - prev.x, cursor.pos.y - prev.y);
  const blur = Math.min(1, Math.max(0, (speed - TRAIL_FROM) / 110));
  // a short smear across the last ~2/3 frame (shutter), densest near the pointer
  const trail = blur > 0.02 ? TRAIL_STEPS.map((dt, k) => ({ p: cursorAt(frame - dt).pos, o: blur * 0.2 * (1 - k / TRAIL_STEPS.length) })) : [];

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${INSERT_CAMERA.origin.x}px ${INSERT_CAMERA.origin.y}px` }}>
      {/* a blank canvas: the faintest dot grid */}
      <AbsoluteFill
        style={{
          opacity: keep,
          backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(20,21,22,0.12) 1.4px, rgba(0,0,0,0) 1.7px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '4px 12px',
        }}
      />
      <div style={{ opacity: keep, transform: `translateX(${clear * 40}px)`, filter: paneBlur > 0.05 ? `blur(${paneBlur}px)` : undefined }}>
        <NotesPane frame={frame} />
      </div>

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: canvasBlur > 0.05 ? `blur(${canvasBlur}px)` : undefined }}>
        <g opacity={keep}>
          <SketchBox {...SKETCH.boxA} glyph="form" />
          <SketchBox {...SKETCH.boxB} glyph="record" />
          <g opacity={draft1Opacity}>
            {p1 > 0 ? <path d={p1 >= 1 ? D1 : cutPath(D1, D1_LEN * p1)} fill="none" stroke={PENCIL} strokeWidth={2.8} strokeDasharray={`${DASH} ${DASH}`} strokeLinecap="round" /> : null}
            {px1 > 0 ? <path d={px1 >= 1 ? X1 : cutPath(X1, X1_LEN * px1)} fill="none" stroke={PENCIL} strokeWidth={3.4} strokeLinecap="round" /> : null}
            {px2 > 0 ? <path d={px2 >= 1 ? X2 : cutPath(X2, X2_LEN * px2)} fill="none" stroke={PENCIL} strokeWidth={3.4} strokeLinecap="round" /> : null}
          </g>
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

      {trail.length > 0 ? (
        // one soft layer, so it reads as shutter smear rather than "pointer trails"
        <AbsoluteFill style={{ filter: 'blur(1.6px)' }}>
          {trail.map((t, k) => (
            <Pointer key={k} x={t.p.x} y={t.p.y} down={cursor.down} opacity={keep * t.o} frame={frame} />
          ))}
        </AbsoluteFill>
      ) : null}
      <Pointer x={cursor.pos.x} y={cursor.pos.y} down={cursor.down} opacity={keep} frame={frame} />
    </AbsoluteFill>
  );
};

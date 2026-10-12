import { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';
import { fonts } from '../../campaign/theme';
import type { Segment } from '../../components/typography/RichText';

/**
 * Type measurement for the closing scenes (09–10), so display lines wrap inside a measured
 * width instead of running off frame when a future story's copy is longer.
 *
 * Widths come from a canvas with the campaign's own faces. The faces are registered with
 * the document only once they have loaded (see @remotion/fonts), so `useTypeReady` holds the
 * frame (delayRender) until the faces it needs are present, then re-renders with real
 * metrics. Every captured frame is therefore measured with the bundled fonts — deterministic.
 */

export type FontSpec = {
  /** CSS family list (theme `fonts.*`). */
  family: string;
  weight: number;
  /** px */
  size: number;
  italic?: boolean;
  /** Letter spacing in em (CSS `letter-spacing`). */
  tracking?: number;
};

/** Parse a CSS letter-spacing in em (e.g. '-0.03em') → -0.03. */
export const em = (value: string | number | undefined) => (typeof value === 'number' ? value : value ? parseFloat(value) || 0 : 0);

const cssFont = (f: FontSpec) => `${f.italic ? 'italic ' : ''}${f.weight} ${f.size}px ${f.family}`;
const firstFamily = (family: string) => family.split(',')[0].trim().replace(/^["']|["']$/g, '');

const faceLoaded = (f: FontSpec) => {
  if (typeof document === 'undefined' || !document.fonts) return true;
  const name = firstFamily(f.family);
  let found = false;
  document.fonts.forEach((face) => {
    if (found) return;
    if (
      face.family.replace(/["']/g, '') === name &&
      String(face.weight) === String(f.weight) &&
      (face.style === 'italic') === Boolean(f.italic) &&
      face.status === 'loaded'
    ) {
      found = true;
    }
  });
  return found;
};

/** Gives up after this long and measures with whatever is there (the CSS fallback still wraps). */
const FONT_WAIT_MS = 8000;

const waitForFaces = (specs: FontSpec[]) =>
  new Promise<void>((resolve) => {
    const t0 = Date.now();
    const tick = () => {
      if (specs.every(faceLoaded) || Date.now() - t0 > FONT_WAIT_MS) resolve();
      else setTimeout(tick, 16);
    };
    tick();
  });

/**
 * True once the faces in `specs` are loaded. Until then it holds the render, and releases it
 * only after the re-render with real metrics has committed.
 */
export const useTypeReady = (specs: FontSpec[]): boolean => {
  const [hold] = useState(() => {
    const ok = specs.every(faceLoaded);
    return { ok, handle: ok ? null : delayRender('Measuring display type (closing scenes)'), released: false };
  });
  const [ready, setReady] = useState(hold.ok);
  const release = () => {
    if (hold.handle === null || hold.released) return;
    hold.released = true;
    continueRender(hold.handle);
  };
  // wait for the faces (specs are fixed per scene); never leave the render waiting on unmount
  useEffect(() => {
    if (hold.handle === null) return;
    let alive = true;
    waitForFaces(specs).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
      release();
    };
  }, []);
  // release only after the re-render with real metrics has committed
  useEffect(() => {
    if (ready) release();
  }, [ready]);
  return ready;
};

let ctx: CanvasRenderingContext2D | null | undefined;
const cache = new Map<string, number>();

/** Rendered width of `text` (kerned, with letter spacing) in px. */
export const textWidth = (text: string, f: FontSpec): number => {
  const key = `${cssFont(f)}|${f.tracking ?? 0}|${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (ctx === undefined) ctx = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  const chars = [...text].length;
  let width: number;
  if (ctx) {
    ctx.font = cssFont(f);
    width = ctx.measureText(text).width + (f.tracking ?? 0) * f.size * chars;
  } else {
    width = chars * f.size * 0.56;
  }
  // only cache real metrics
  if (faceLoaded(f)) cache.set(key, width);
  return width;
};

/**
 * Measures rich-text words for the display lines of Scenes 09–10: Inter Tight for the
 * narrator, Newsreader Light italic (set `optical` × larger, as RichLine does) for the
 * human-voice words.
 */
export const richMeasurer = (base: FontSpec, optical = 1.08) => {
  const human: FontSpec = { family: fonts.serif, weight: 300, size: base.size * optical, italic: true, tracking: -0.015 };
  return {
    word: (seg: Segment) => textWidth(seg.text, seg.emphasis ? human : base),
    space: textWidth(' ', base),
    specs: [base, human],
  };
};

export type Measurer = ReturnType<typeof richMeasurer>;

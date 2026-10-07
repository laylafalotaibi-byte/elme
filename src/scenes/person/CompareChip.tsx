import React from 'react';
import { random, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts, type } from '../../campaign/theme';
import { ease, progress, springAt, springs } from '../../campaign/motion';
import type { Pt } from './geometry';

/**
 * Scene 07's comparison chip: a hairline pill pinned to a real object on its side of the
 * split. BEFORE chips are dark glass, arrive with a busy settle and drift restlessly
 * (≤ 2 px, slow); AFTER chips are paper, arrive calmly on one axis and stay still.
 *
 * `at` is the attach point the leaders start from, in frame coordinates:
 *   left   — the chip's left-centre      right  — its right-centre
 *   top    — its top-centre              bottom — its bottom-centre
 */
export type ChipSide = 'before' | 'after';
export type ChipAttach = 'left' | 'right' | 'top' | 'bottom';

export type ChipSpec = {
  text: string;
  side: ChipSide;
  at: Pt;
  attach: ChipAttach;
  anchors: Pt[];
  /** Direction the chip settles from (BEFORE only), px. */
  from?: Pt;
  /** Small resting rotation (BEFORE only, ±1.5°). */
  rotate?: number;
};

/** Pill height (px). */
export const CHIP_H = 50;

const restless = (frame: number, seed: string, amp: number) => {
  const p1 = 52 + random(`${seed}-a`) * 40;
  const p2 = 74 + random(`${seed}-b`) * 36;
  const ph = random(`${seed}-c`) * Math.PI * 2;
  return {
    x: amp * Math.sin((frame / p1) * Math.PI * 2 + ph),
    y: amp * 0.7 * Math.sin((frame / p2) * Math.PI * 2 + ph * 1.7),
  };
};

const placement = (attach: ChipAttach): { left: number; top: number; tx: string; origin: string } => {
  switch (attach) {
    case 'left':
      return { left: 0, top: -CHIP_H / 2, tx: '0', origin: 'left center' };
    case 'right':
      return { left: 0, top: -CHIP_H / 2, tx: '-100%', origin: 'right center' };
    case 'top':
      return { left: 0, top: 0, tx: '-50%', origin: 'center top' };
    case 'bottom':
      return { left: 0, top: -CHIP_H, tx: '-50%', origin: 'center bottom' };
  }
};

export const CompareChip: React.FC<{
  spec: ChipSpec;
  start: number;
  /** Frame the chip steps back (the next chip on its side has arrived). */
  dimAt?: number;
}> = ({ spec, start, dimAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start) return null;
  const before = spec.side === 'before';

  const s = springAt(frame, fps, start, before ? springs.busy : springs.calm);
  const appear = Math.min(1, progress(frame, start, before ? 8 : 12) * 1.1);
  const lead = progress(frame, start + 3, 11, ease.inOut);
  // the pin dot settles in as the leader arrives (no one-frame pop)
  const pin = progress(frame, start + 11, 5, ease.out);
  const dim = dimAt === undefined ? 0 : progress(frame, dimAt, 14, ease.inOut);

  // Stepping back keeps the pill (so it never turns into a grey blob); text and leader recede.
  const pillAlpha = 1 - (before ? 0.06 : 0.2) * dim;
  const textAlpha = 1 - (before ? 0.5 : 0.46) * dim;
  const leadAlpha = 1 - 0.6 * dim;

  const from = before ? spec.from ?? { x: 0, y: 10 } : { x: 0, y: 12 };
  const d = before ? restless(frame, spec.text, 1.8) : { x: 0, y: 0 };
  const tx = from.x * (1 - s) + d.x;
  const ty = from.y * (1 - s) + d.y;
  const place = placement(spec.attach);

  // BEFORE leaders cross both the bright screen and the dark room: a mid-grey reads on both.
  const line = before ? '#8C9097' : 'rgba(20,21,22,0.40)';
  const dotFill = before ? '#C9CCD1' : colors.textOnLight;
  const dotEdge = before ? 'rgba(10,11,13,0.75)' : 'rgba(255,255,255,0.9)';
  const attach = { x: spec.at.x + d.x, y: spec.at.y + d.y };

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: leadAlpha * appear }}>
        {spec.anchors.map((a, i) => {
          const x2 = attach.x + (a.x - attach.x) * lead;
          const y2 = attach.y + (a.y - attach.y) * lead;
          return (
            <g key={i}>
              <line x1={attach.x} y1={attach.y} x2={x2} y2={y2} stroke={line} strokeWidth={1.5} />
              {pin > 0 ? <circle cx={a.x} cy={a.y} r={3.6 * (0.4 + 0.6 * pin)} fill={dotFill} stroke={dotEdge} strokeWidth={1.2} opacity={pin} /> : null}
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: spec.at.x + place.left,
          top: spec.at.y + place.top,
          height: CHIP_H,
          transform: `translate(${tx}px, ${ty}px) translateX(${place.tx}) rotate(${before ? (spec.rotate ?? 0) * s : 0}deg) scale(${before ? 0.94 + 0.06 * s : 1})`,
          transformOrigin: place.origin,
          opacity: appear,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 21px 0 18px',
          borderRadius: 999,
          whiteSpace: 'nowrap',
          background: before ? `rgba(20,22,26,${(0.9 * pillAlpha).toFixed(3)})` : `rgba(251,250,247,${(0.97 * pillAlpha).toFixed(3)})`,
          boxShadow: before
            ? `0 0 0 1px rgba(255,255,255,${(0.14 * pillAlpha).toFixed(3)}), 0 14px 28px -14px rgba(0,0,0,0.7)`
            : `0 0 0 1px ${colors.stoneLine}, 0 16px 30px -18px rgba(70,48,24,${(0.4 * pillAlpha).toFixed(3)})`,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: textAlpha }}>
          {before ? (
            <span style={{ width: 8, height: 8, borderRadius: 8, background: colors.mutedOnDark, flexShrink: 0 }} />
          ) : (
            <span style={{ width: 9, height: 9, borderRadius: 9, boxShadow: `inset 0 0 0 1.6px ${colors.textOnLight}`, flexShrink: 0 }} />
          )}
          <span style={{ ...type.caption, fontSize: 24, color: before ? colors.textOnDark : colors.textOnLight }}>{spec.text}</span>
        </span>
      </div>
    </div>
  );
};

/** Small Before / After label at the top of each half. */
export const SideLabel: React.FC<{ text: string; x: number; y: number; align: 'left' | 'right'; tone: 'dark' | 'light'; start: number }> = ({ text, x, y, align, tone, start }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, 14, ease.out);
  if (frame < start) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(${align === 'right' ? '-100%' : '0'}) translateY(${(1 - p) * 8}px)`,
        opacity: p,
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: tone === 'dark' ? 'rgba(242,240,235,0.72)' : colors.mutedOnLight,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

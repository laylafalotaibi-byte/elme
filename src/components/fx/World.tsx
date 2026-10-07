import React from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../campaign/theme';

/**
 * Full-bleed "worlds" — the lighting of BEFORE, AFTER, the void of the Question and the
 * warm-dark of Learning. Soft light pools only; no gradients that read as glow.
 */
export type WorldKind = 'before' | 'after' | 'void' | 'warm';

const worldStyle: Record<WorldKind, React.CSSProperties> = {
  before: {
    backgroundColor: colors.graphite,
    backgroundImage: [
      'radial-gradient(ellipse 60% 55% at 30% 28%, rgba(255,255,255,0.055), rgba(255,255,255,0) 70%)',
      'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)',
    ].join(','),
  },
  after: {
    backgroundColor: colors.paper,
    backgroundImage: [
      'radial-gradient(ellipse 65% 60% at 64% 30%, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%)',
      'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(60,45,30,0.06) 100%)',
    ].join(','),
  },
  void: {
    backgroundColor: colors.ink,
    backgroundImage: 'radial-gradient(ellipse 50% 45% at 50% 50%, rgba(255,255,255,0.025), rgba(255,255,255,0) 75%)',
  },
  warm: {
    backgroundColor: colors.warmDark,
    backgroundImage: [
      'radial-gradient(ellipse 55% 50% at 62% 40%, rgba(255,214,170,0.07), rgba(255,214,170,0) 72%)',
      'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.25) 100%)',
    ].join(','),
  },
};

export const World: React.FC<{ kind: WorldKind; opacity?: number; style?: React.CSSProperties }> = ({ kind, opacity = 1, style }) => (
  <AbsoluteFill style={{ ...worldStyle[kind], opacity, ...style }} />
);

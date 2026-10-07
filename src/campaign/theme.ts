import type { CSSProperties } from 'react';

/**
 * Campaign design tokens — shared by every story in "We Found A Better Way".
 * See docs/DESIGN_SYSTEM.md for the reasoning behind each value.
 */

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

export const colors = {
  ink: '#0B0C0E',
  graphite: '#15171A',
  graphiteRaised: '#1E2125',
  graphiteLine: 'rgba(255,255,255,0.10)',
  warmDark: '#1C1814',
  paper: '#F3F1EC',
  paperRaised: '#FBFAF7',
  stone: '#E4DFD6',
  stoneLine: 'rgba(20,21,22,0.12)',
  textOnDark: '#F2F0EB',
  mutedOnDark: '#8D9199',
  faintOnDark: 'rgba(242,240,235,0.32)',
  textOnLight: '#141516',
  mutedOnLight: '#6F6A62',
  faintOnLight: 'rgba(20,21,22,0.28)',
  accent: '#F26B21',
  accentSoft: 'rgba(242,107,33,0.14)',
} as const;

export type Tone = 'dark' | 'light';

/** Text colours for a given background tone. */
export const toneColors = (tone: Tone) =>
  tone === 'dark'
    ? { text: colors.textOnDark, muted: colors.mutedOnDark, faint: colors.faintOnDark, line: colors.graphiteLine, surface: colors.graphiteRaised }
    : { text: colors.textOnLight, muted: colors.mutedOnLight, faint: colors.faintOnLight, line: colors.stoneLine, surface: colors.paperRaised };

export const fonts = {
  sans: '"Inter Tight", "Helvetica Neue", Arial, sans-serif',
  serif: '"Instrument Serif", Georgia, "Times New Roman", serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace',
} as const;

/** Typographic scale (px at 1920×1080). */
export const type = {
  displayXL: { fontFamily: fonts.serif, fontSize: 148, lineHeight: 1.02, letterSpacing: '-0.02em', fontWeight: 400 },
  displayL: { fontFamily: fonts.sans, fontSize: 112, lineHeight: 1.0, letterSpacing: '-0.035em', fontWeight: 600 },
  displayM: { fontFamily: fonts.sans, fontSize: 76, lineHeight: 1.06, letterSpacing: '-0.03em', fontWeight: 500 },
  bodyL: { fontFamily: fonts.sans, fontSize: 40, lineHeight: 1.25, letterSpacing: '-0.01em', fontWeight: 400 },
  title: { fontFamily: fonts.sans, fontSize: 30, lineHeight: 1.2, letterSpacing: '-0.01em', fontWeight: 500 },
  body: { fontFamily: fonts.sans, fontSize: 22, lineHeight: 1.35, letterSpacing: '0em', fontWeight: 400 },
  small: { fontFamily: fonts.sans, fontSize: 17, lineHeight: 1.35, letterSpacing: '0em', fontWeight: 400 },
  kicker: { fontFamily: fonts.mono, fontSize: 17, lineHeight: 1.2, letterSpacing: '0.16em', fontWeight: 500, textTransform: 'uppercase' },
  label: { fontFamily: fonts.mono, fontSize: 14, lineHeight: 1.2, letterSpacing: '0.14em', fontWeight: 500, textTransform: 'uppercase' },
  metricValue: { fontFamily: fonts.sans, fontSize: 52, lineHeight: 1.0, letterSpacing: '-0.03em', fontWeight: 500 },
} satisfies Record<string, CSSProperties>;

export type TypeStyle = keyof typeof type;

/** Layout grid: 12 columns inside safe margins. */
export const layout = {
  marginX: 160,
  marginY: 120,
  gutter: 32,
  /** x position of column n (0-based) on a 12-col grid inside the margins */
  col: (n: number) => 160 + n * ((1920 - 320 + 32) / 12),
} as const;

export const radii = {
  card: 10,
  chip: 999,
  window: 12,
} as const;

export const shadows = {
  dark: '0 30px 60px -20px rgba(0,0,0,0.55), 0 10px 20px -10px rgba(0,0,0,0.4)',
  light: '0 30px 60px -28px rgba(40,30,20,0.28), 0 8px 18px -10px rgba(40,30,20,0.16)',
  paper: '0 24px 48px -24px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.25)',
} as const;

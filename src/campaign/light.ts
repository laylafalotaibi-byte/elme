import { interpolateColors } from 'remotion';

/**
 * Light is the emotional arc of the film — not a dark/light theme switch.
 *
 *   exposure 0 … 1  — how much daylight is in the room (0 = dim, 1 = full daylight)
 *   warmth   0 … 1  — colour of that light (0 = neutral-cool, 1 = warm)
 *
 * Arc for Story 01 (see docs/DESIGN_SYSTEM.md §4):
 *   01 normal day → 02–03 the room darkens as the work piles up → 04 near-black →
 *   05 a warm key light comes up on him → 06–09 warm daylight → 07 = Scene 01's light, warmer.
 */
export type Light = { exposure: number; warmth: number };

export const LIGHT = {
  /** Scene 01: an ordinary day — neutral, mid-key, slightly cool. */
  normalDay: { exposure: 0.74, warmth: 0.18 },
  /** Scene 02 end / Scene 03: the room has dimmed around the work. */
  dimmed: { exposure: 0.16, warmth: 0.12 },
  /** Scene 04: near-black. */
  dark: { exposure: 0.02, warmth: 0.1 },
  /** Scene 05: warm key light — his decision brings the light. */
  warmKey: { exposure: 0.38, warmth: 0.95 },
  /** Scene 06, 08, 09: warm daylight. */
  warmDay: { exposure: 0.92, warmth: 0.8 },
  /** Scene 07: Scene 01's light, a little warmer and brighter. */
  afterDay: { exposure: 0.86, warmth: 0.55 },
} as const satisfies Record<string, Light>;

export const mixLight = (a: Light, b: Light, t: number): Light => ({
  exposure: a.exposure + (b.exposure - a.exposure) * t,
  warmth: a.warmth + (b.warmth - a.warmth) * t,
});

type Swatch = {
  wall: string;
  wallHi: string;
  desk: string;
  deskHi: string;
  figure: string;
  window: string;
  screen: string;
  screenSpill: string;
};

const dimNeutral: Swatch = {
  wall: '#101215', wallHi: '#1C1F24', desk: '#0C0D10', deskHi: '#16181C', figure: '#040506',
  window: 'rgba(150,170,200,0.05)', screen: '#E9ECEF', screenSpill: 'rgba(200,215,235,0.30)',
};
const dimWarm: Swatch = {
  wall: '#15110D', wallHi: '#261E17', desk: '#100D0A', deskHi: '#1C1712', figure: '#050403',
  window: 'rgba(255,200,150,0.06)', screen: '#F3EEE6', screenSpill: 'rgba(255,214,170,0.32)',
};
const dayNeutral: Swatch = {
  wall: '#B9BCBF', wallHi: '#DADCDD', desk: '#A3A29F', deskHi: '#C2C0BB', figure: '#15171A',
  window: 'rgba(255,255,255,0.55)', screen: '#F4F5F6', screenSpill: 'rgba(235,242,250,0.22)',
};
const dayWarm: Swatch = {
  wall: '#D5C9B9', wallHi: '#F0E8DC', desk: '#BBAA94', deskHi: '#D9CBB7', figure: '#1D1814',
  window: 'rgba(255,240,220,0.60)', screen: '#F8F5F0', screenSpill: 'rgba(255,236,210,0.22)',
};

const mix = (a: string, b: string, t: number) => interpolateColors(Math.max(0, Math.min(1, t)), [0, 1], [a, b]);

const mixSwatch = (a: Swatch, b: Swatch, t: number): Swatch =>
  Object.fromEntries((Object.keys(a) as Array<keyof Swatch>).map((k) => [k, mix(a[k], b[k], t)])) as Swatch;

/** Room colours for a given light state. */
export const roomPalette = (light: Light) => {
  const dim = mixSwatch(dimNeutral, dimWarm, light.warmth);
  const day = mixSwatch(dayNeutral, dayWarm, light.warmth);
  const swatch = mixSwatch(dim, day, light.exposure);
  return {
    ...swatch,
    /** Which text tone reads on this room. */
    tone: (light.exposure > 0.5 ? 'light' : 'dark') as 'light' | 'dark',
  };
};

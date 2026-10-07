import { MONITOR, SCREEN_SCALE } from '../../components/set/Workspace';

/**
 * Geometry helpers for Scenes 08–10.
 *
 * `screenPoint` maps a point on the 1280×800 screen canvas to frame coordinates the way
 * <Workspace> actually draws it: the monitor is tilted with
 * `perspective(2600px) rotateY(-5deg)` around its left-centre, so the right side of the
 * screen is nearer the lens (up to ≈ 36 px wider and ≈ 13 px taller than the flat
 * `screenToFrame` mapping). Leaders pinned to on-screen objects need the tilted position.
 */

export type Pt = { x: number; y: number };

const PERSPECTIVE = 2600;
const ROTATE_Y = (-5 * Math.PI) / 180;
const ORIGIN: Pt = { x: MONITOR.x, y: MONITOR.y + MONITOR.h / 2 };

export const screenPoint = (p: Pt): Pt => {
  // monitor-local, relative to the transform origin (left centre)
  const mx = MONITOR.bezel + p.x * SCREEN_SCALE;
  const my = MONITOR.bezel + p.y * SCREEN_SCALE - MONITOR.h / 2;
  // rotateY, then perspective divide
  const x1 = mx * Math.cos(ROTATE_Y);
  const z1 = -mx * Math.sin(ROTATE_Y);
  const w = 1 - z1 / PERSPECTIVE;
  return { x: ORIGIN.x + x1 / w, y: ORIGIN.y + my / w };
};

/** A virtual camera on a full-frame picture layer: scale about the frame centre, then translate. */
export type Cam = { scale: number; x: number; y: number };

export const camPoint = (cam: Cam, p: Pt): Pt => ({
  x: 960 + (p.x - 960) * cam.scale + cam.x,
  y: 540 + (p.y - 540) * cam.scale + cam.y,
});

export const camTransform = (cam: Cam) => `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`;

export const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({
  scale: a.scale + (b.scale - a.scale) * t,
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

import { screenToFrame } from '../../components/set/Workspace';

/**
 * Geometry helpers for Scenes 08–10: the shared perspective-correct screen mapping and a
 * simple virtual camera for full-frame picture layers.
 */

export type Pt = { x: number; y: number };

/** Screen canvas point → frame point (perspective-correct; shared with <Workspace>). */
export const screenPoint = (p: Pt): Pt => screenToFrame(p);

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

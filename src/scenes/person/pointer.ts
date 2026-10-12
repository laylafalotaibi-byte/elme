import { glide, span } from '../../campaign/motion';
import type { Pt } from './geometry';

/** A waypoint for his pointer: be at (x, y) at frame f (screen canvas coordinates). */
export type Waypoint = { f: number; x: number; y: number };

/**
 * A pointer path for <Cursor path>: each move glides from rest to rest between two
 * waypoints (peak speed 1.5× its average — nothing teleports, nothing strobes). Before the
 * first waypoint it waits at the first; after the last it rests there.
 */
export const glidePath =
  (points: ReadonlyArray<Waypoint>) =>
  (frame: number): Pt => {
    if (points.length === 0) return { x: 0, y: 0 };
    if (frame <= points[0].f) return { x: points[0].x, y: points[0].y };
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (frame <= b.f) {
        const t = span(frame, [a.f, b.f], glide(0, 0));
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      }
    }
    const last = points[points.length - 1];
    return { x: last.x, y: last.y };
  };

import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ease } from '../../campaign/motion';

/**
 * Virtual camera. Wrap a scene (or a layer of it) to get a slow, eased push / drift.
 * Nest several cameras with different amounts for parallax depth: background layers
 * move least, foreground layers most.
 */
export type CameraKey = { frame: number; scale?: number; x?: number; y?: number; rotate?: number };

export const useCamera = (keys: CameraKey[], easing: (t: number) => number = ease.inOut) => {
  const frame = useCurrentFrame();
  const frames = keys.map((k) => k.frame);
  const pick = (prop: 'scale' | 'x' | 'y' | 'rotate', fallback: number) => {
    if (keys.length === 1) return keys[0][prop] ?? fallback;
    return interpolate(
      frame,
      frames,
      keys.map((k) => k[prop] ?? fallback),
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing },
    );
  };
  return { scale: pick('scale', 1), x: pick('x', 0), y: pick('y', 0), rotate: pick('rotate', 0) };
};

export const Camera: React.FC<{
  keys: CameraKey[];
  easing?: (t: number) => number;
  /** Transform origin, e.g. "50% 50%". */
  origin?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ keys, easing, origin = '50% 50%', children, style }) => {
  const cam = useCamera(keys, easing);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale}) rotate(${cam.rotate}deg)`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Convenience: a single slow push from `from` to `to` scale across `duration` frames. */
export const SlowPush: React.FC<{
  duration: number;
  from?: number;
  to?: number;
  x?: [number, number];
  y?: [number, number];
  origin?: string;
  children: React.ReactNode;
}> = ({ duration, from = 1, to = 1.04, x = [0, 0], y = [0, 0], origin, children }) => (
  <Camera
    origin={origin}
    keys={[
      { frame: 0, scale: from, x: x[0], y: y[0] },
      { frame: duration, scale: to, x: x[1], y: y[1] },
    ]}
    easing={(t) => t * (2 - t) * 0.5 + t * 0.5}
  >
    {children}
  </Camera>
);

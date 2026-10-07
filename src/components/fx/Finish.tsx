import React, { useId } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * Film finish layers: animated grain, vignette and cinematic letterbox. Pure SVG/CSS.
 */

/**
 * Film grain: four seeded noise tiles, changing every 3 frames (≈10 fps) so it reads as
 * texture rather than per-frame noise that bloats the encode.
 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.045 }) => {
  const frame = useCurrentFrame();
  const seed = [11, 37, 73, 97][Math.floor(frame / 3) % 4];
  const id = `grain-${useId().replace(/:/g, '')}-${seed}`;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 960 540" preserveAspectRatio="none">
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="960" height="540" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Soft vignette; strength 0…1. */
export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.5, color = '0,0,0' }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(${color},0) 55%, rgba(${color},${0.55 * strength}) 100%)`,
    }}
  />
);

/** Global finish applied over every composition. */
export const FilmFinish: React.FC = () => (
  <>
    <Vignette strength={0.32} />
    <Grain />
  </>
);

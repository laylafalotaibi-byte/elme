import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../campaign/theme';
import { ease, progress } from '../../campaign/motion';

/**
 * Film finish layers: animated grain, vignette and cinematic letterbox. Pure SVG/CSS.
 */

/** Animated film grain. Re-seeds every frame; rendered at half resolution and scaled up. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.075 }) => {
  const frame = useCurrentFrame();
  const seed = (frame * 7919) % 1000;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 960 540" preserveAspectRatio="none">
        <filter id={`grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="960" height="540" filter={`url(#grain-${seed})`} />
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

/** Cinematic letterbox bars that ease in/out. `amount` 0…1 maps to bar height. */
export const Letterbox: React.FC<{ start: number; end?: number; height?: number; inDuration?: number; outDuration?: number }> = ({
  start,
  end,
  height = 110,
  inDuration = 30,
  outDuration = 24,
}) => {
  const frame = useCurrentFrame();
  const pin = progress(frame, start, inDuration, ease.inOut);
  const pout = end === undefined ? 0 : progress(frame, end - outDuration, outDuration, ease.inOut);
  const h = height * pin * (1 - pout);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: h, background: colors.ink }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h, background: colors.ink }} />
    </AbsoluteFill>
  );
};

/** Global finish applied over every composition. */
export const FilmFinish: React.FC = () => (
  <>
    <Vignette strength={0.32} />
    <Grain />
  </>
);

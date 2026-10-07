import React from 'react';
import { AbsoluteFill } from 'remotion';

/**
 * Light falling on his screen / the paper world (Scenes 05 → 06). Not glow: neutral-warm
 * falloff only, ≤ 15 % opacity per layer.
 *
 *  - `dim`  0…1  the warm, low-key room of Scene 05 (edges fall off into warm shadow)
 *  - `day`  0…1  warm daylight filling the room in Scene 06 (window light from the upper
 *                left, the faint shadow of a window frame drifting across)
 */
export const RoomLight: React.FC<{ dim: number; day: number; drift?: number }> = ({ dim, day, drift = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {dim > 0 ? (
      <AbsoluteFill
        style={{
          // a warm lamp off-frame left: light falls across the screen and away to the right
          background: [
            `linear-gradient(98deg, rgba(255,226,186,${0.1 * dim}) 0%, rgba(255,226,186,0) 34%, rgba(40,24,10,0) 52%, rgba(40,24,10,${0.2 * dim}) 100%)`,
            `radial-gradient(ellipse 90% 80% at 40% 46%, rgba(40,24,10,0) 58%, rgba(40,24,10,${0.18 * dim}) 100%)`,
          ].join(','),
        }}
      />
    ) : null}
    {day > 0 ? (
      <>
        <AbsoluteFill
          style={{
            background: `linear-gradient(118deg, rgba(255,251,242,${0.6 * day}) 0%, rgba(255,251,242,${0.22 * day}) 34%, rgba(255,251,242,0) 62%)`,
          }}
        />
        {/* the soft shadow of a window frame on the paper — barely there */}
        <div
          style={{
            position: 'absolute',
            left: -300 + drift,
            top: -400,
            width: 3000,
            height: 2200,
            transform: 'rotate(-24deg)',
            transformOrigin: '0 0',
            opacity: day,
            background: `linear-gradient(90deg, rgba(120,88,56,0) 0px, rgba(120,88,56,0.05) 120px, rgba(120,88,56,0.05) 150px, rgba(120,88,56,0) 270px, rgba(120,88,56,0) 820px, rgba(120,88,56,0.04) 920px, rgba(120,88,56,0.04) 950px, rgba(120,88,56,0) 1050px)`,
            filter: 'blur(24px)',
          }}
        />
      </>
    ) : null}
  </AbsoluteFill>
);

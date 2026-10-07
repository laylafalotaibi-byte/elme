import React from 'react';
import { AbsoluteFill } from 'remotion';
import { LIGHT, roomPalette } from '../../campaign/light';

/**
 * The warm paper world his line lives in (Scene 06's world), lit like a real surface:
 * daylight from the upper left, the soft shadow of a window frame drifting slowly across,
 * a gentle falloff to the edges. Neutral-warm light only, ≤ 15 % per layer — no glow.
 */
export const PaperWorld: React.FC<{ drift?: number; zoom?: number; style?: React.CSSProperties }> = ({ drift = 0, zoom = 1, style }) => {
  const paper = roomPalette(LIGHT.warmDay).screen;
  return (
    <AbsoluteFill style={{ backgroundColor: paper, overflow: 'hidden', transform: zoom !== 1 ? `scale(${zoom})` : undefined, ...style }}>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(118deg, rgba(255,251,242,0.6) 0%, rgba(255,251,242,0.2) 36%, rgba(255,251,242,0) 62%)',
        }}
      />
      {/* window-frame shadow on the paper — barely there, slowly moving */}
      <div
        style={{
          position: 'absolute',
          left: -520 + drift,
          top: -620,
          width: 3400,
          height: 2600,
          transform: 'rotate(-23deg)',
          transformOrigin: '0 0',
          background:
            'linear-gradient(90deg, rgba(118,86,54,0) 0px, rgba(118,86,54,0.09) 150px, rgba(118,86,54,0.09) 200px, rgba(118,86,54,0) 340px, rgba(118,86,54,0) 980px, rgba(118,86,54,0.07) 1080px, rgba(118,86,54,0.07) 1115px, rgba(118,86,54,0) 1225px)',
          filter: 'blur(26px)',
        }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 78% at 48% 46%, rgba(90,64,40,0) 58%, rgba(90,64,40,0.11) 100%)' }} />
    </AbsoluteFill>
  );
};

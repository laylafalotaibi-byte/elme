import React from 'react';
import { AbsoluteFill } from 'remotion';
import { roomPalette, type Light } from '../../campaign/light';
import { SCREEN_CANVAS } from './Workspace';

/**
 * Insert shots — the reverse of the HeroShot. What he sees:
 *  - ScreenInsert: his monitor, full frame (digital half of the process)
 *  - DeskInsert:   his desk from above (paper half of the process)
 */

/** His screen, full frame. Children use the same 1280×800 canvas as <Workspace screen>. */
export const ScreenInsert: React.FC<{
  light: Light;
  children?: React.ReactNode;
  /** Extra zoom into the canvas (1 = canvas fills the frame width). */
  zoom?: number;
  /** Canvas point to keep centred while zooming. */
  focus?: { x: number; y: number };
  blur?: number;
  screenColor?: string;
}> = ({ light, children, zoom = 1, focus = { x: 640, y: 400 }, blur = 0, screenColor }) => {
  const pal = roomPalette(light);
  const base = 1920 / SCREEN_CANVAS.w; // 1.5
  const scale = base * zoom;
  const x = 960 - focus.x * scale;
  const y = 540 - focus.y * scale;
  return (
    <AbsoluteFill style={{ backgroundColor: screenColor ?? pal.screen, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SCREEN_CANVAS.w,
          height: SCREEN_CANVAS.h,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          transformOrigin: '0 0',
          filter: blur ? `blur(${blur / scale}px)` : undefined,
        }}
      >
        {children}
      </div>
      {/* glass + edge falloff so it reads as a screen, not a slide */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(115deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 30%), radial-gradient(ellipse 85% 85% at 50% 50%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.12) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/** His desk from above. Children are laid out in frame coordinates. */
export const DeskInsert: React.FC<{ light: Light; children?: React.ReactNode }> = ({ light, children }) => {
  const pal = roomPalette(light);
  return (
    <AbsoluteFill style={{ backgroundColor: pal.desk, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 90% at 22% 18%, ${pal.deskHi}, rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,${0.12 + (1 - light.exposure) * 0.3}) 100%)`,
        }}
      />
      {/* window light falling across the desk */}
      <div style={{ position: 'absolute', left: -200, top: -300, width: 900, height: 1700, background: pal.window, filter: 'blur(90px)', transform: 'rotate(18deg)', opacity: 0.6 }} />
      {children}
    </AbsoluteFill>
  );
};

/** A plain pen, lying on the desk. */
export const Pen: React.FC<{ x: number; y: number; rotate?: number; length?: number }> = ({ x, y, rotate = -28, length = 300 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: length, height: 14, transform: `rotate(${rotate}deg)`, transformOrigin: '0 50%' }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: 7, background: 'linear-gradient(180deg, #2B2E33, #121315 70%)', boxShadow: '0 10px 14px -6px rgba(0,0,0,0.45)' }} />
    <div style={{ position: 'absolute', right: -18, top: 3, width: 22, height: 8, background: 'linear-gradient(90deg, #8E9095, #C9CBCE)', clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
  </div>
);

/** A phone lying on the desk; children render on its screen (stacked notifications etc.). */
export const Phone: React.FC<{ x: number; y: number; rotate?: number; children?: React.ReactNode; shake?: number }> = ({ x, y, rotate = 8, children, shake = 0 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 240,
      height: 480,
      borderRadius: 34,
      background: '#0C0D0F',
      boxShadow: '0 0 0 1.5px #2A2C30, 0 28px 40px -18px rgba(0,0,0,0.6)',
      transform: `rotate(${rotate + shake}deg)`,
      padding: 10,
    }}
  >
    <div style={{ width: '100%', height: '100%', borderRadius: 26, background: '#16181B', overflow: 'hidden', position: 'relative' }}>{children}</div>
  </div>
);

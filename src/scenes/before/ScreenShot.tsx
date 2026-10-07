import React from 'react';
import { AbsoluteFill } from 'remotion';
import { roomPalette, type Light } from '../../campaign/light';
import { SCREEN_CANVAS } from '../../components/set/Workspace';
import { ScreenDesktop } from './props';
import { camScale, type Cam } from './shared';

/**
 * Screen insert with a lens — a local variant of <ScreenInsert>:
 *  - the screen is a physical plane seen at a slight angle (`tilt`), not a flat slide;
 *  - a sharp front layer (the step being shown) over a soft back layer (what piled up);
 *  - the room's light falls off at the edges as it dims (the screen becomes the only light).
 * Same 1280×800 canvas and camera maths as shared.canvasToFrame. Children are laid out in
 * frame coordinates ON the plane (so captions stay attached to their artefact).
 */
export type Tilt = { x: number; y: number };

/** Monitor bezel width around the screen canvas (canvas px). */
const BEZEL = 14;

export const ScreenShot: React.FC<{
  light: Light;
  cam: Cam;
  back?: React.ReactNode;
  front?: React.ReactNode;
  /** Defocus of the back layer, in frame px. */
  backBlur?: number;
  /** Plane angle in degrees (rotateX, rotateY). */
  tilt?: Tilt;
  /** Extra edge fall-off 0…1 (defaults from the light: dimmer room → stronger). */
  falloff?: number;
  /** Frame-space content on the plane (captions, pins). */
  children?: React.ReactNode;
  /** Frame-space content above the plane, unaffected by the tilt (story lines). */
  overlay?: React.ReactNode;
}> = ({ light, cam, back, front, backBlur = 3, tilt = { x: 0, y: 0 }, falloff, children, overlay }) => {
  const pal = roomPalette(light);
  const s = camScale(cam);
  const tx = 960 - cam.focus.x * s;
  const ty = 540 - cam.focus.y * s;
  const fall = falloff ?? Math.max(0, Math.min(1, (0.8 - light.exposure) / 0.65));
  const canvas: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_CANVAS.w,
    height: SCREEN_CANVAS.h,
    transform: `translate(${tx}px, ${ty}px) scale(${s})`,
    transformOrigin: '0 0',
  };
  const angled = tilt.x !== 0 || tilt.y !== 0;
  // Overscan so the angled plane always covers the frame.
  const over = angled ? 1 + (Math.abs(tilt.x) + Math.abs(tilt.y)) * 0.012 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: pal.wall, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: angled ? `perspective(2400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${over})` : undefined,
          transformOrigin: '50% 50%',
        }}
      >
        <div style={canvas}>
          {/* the monitor's edge: when the camera reaches it, the bezel and the room show */}
          <div
            style={{
              position: 'absolute',
              left: -BEZEL,
              top: -BEZEL,
              width: SCREEN_CANVAS.w + BEZEL * 2,
              height: SCREEN_CANVAS.h + BEZEL * 2,
              borderRadius: 16,
              background: '#0E0F11',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 90px -30px rgba(0,0,0,0.7)',
            }}
          />
          <div style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_CANVAS.w, height: SCREEN_CANVAS.h, overflow: 'hidden', borderRadius: 3, backgroundColor: pal.screen }}>
            <div style={{ position: 'absolute', inset: 0, filter: backBlur > 0 ? `blur(${(backBlur / s).toFixed(3)}px)` : undefined }}>
              <ScreenDesktop />
              {back}
            </div>
            {front ? <div style={{ position: 'absolute', inset: 0 }}>{front}</div> : null}
            {/* glass: a faint diagonal reflection */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(112deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.04) 100%)' }} />
          </div>
        </div>
        {children}
      </AbsoluteFill>
      {/* lens fall-off; as the room dims the screen becomes the only light */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 74% 80% at 50% 47%, rgba(0,0,0,0) 48%, rgba(6,8,12,${(0.12 + fall * 0.46).toFixed(3)}) 100%)`,
        }}
      />
      {overlay}
    </AbsoluteFill>
  );
};

/**
 * Desk plane: the desk insert seen at a slight angle (top recedes), with a little depth
 * of field towards the far edge. Children in desk-world frame coordinates.
 */
export const DeskPlane: React.FC<{ tilt?: number; children: React.ReactNode }> = ({ tilt = 14, children }) => (
  <AbsoluteFill style={{ transform: `perspective(2600px) rotateX(${tilt}deg) scale(${1 + tilt * 0.012})`, transformOrigin: '50% 58%' }}>{children}</AbsoluteFill>
);

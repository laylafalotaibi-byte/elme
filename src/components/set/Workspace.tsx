import React, { useId } from 'react';
import { AbsoluteFill, Img, interpolateColors, staticFile } from 'remotion';
import { colors, fonts } from '../../campaign/theme';
import { useStory } from '../../campaign/StoryContext';
import { roomPalette, type Light } from '../../campaign/light';
import { OTS_COLLAR, OTS_FIGURE } from '../portrait/silhouettes';

/**
 * Workspace — the over-the-shoulder shot. Foreground: his shoulder and the back of his
 * head, out of focus. Midground: his monitor (the digital half of the process). Bottom:
 * the edge of his desk (the paper half). The room's light follows the story's light arc.
 *
 * Screen content is laid out in a 1280×800 canvas (SCREEN_CANVAS) and mapped onto the
 * monitor. Desk-edge content is laid out in frame coordinates inside DESK_STRIP.
 */

export const MONITOR = { x: 640, y: 150, w: 1080, h: 676, bezel: 10 } as const;
export const SCREEN_CANVAS = { w: 1280, h: 800 } as const;
export const SCREEN_RECT = {
  x: MONITOR.x + MONITOR.bezel,
  y: MONITOR.y + MONITOR.bezel,
  w: MONITOR.w - MONITOR.bezel * 2,
  h: MONITOR.h - MONITOR.bezel * 2,
} as const;
export const SCREEN_SCALE = SCREEN_RECT.w / SCREEN_CANVAS.w;
export const DESK_STRIP = { y: 872, h: 1080 - 872 } as const;

/** The monitor's tilt, applied about its left-centre (see the monitor <div> below). */
const MONITOR_PERSPECTIVE = 2600;
const MONITOR_ROTATE_Y = -5;

/**
 * Map a point on the 1280×800 screen canvas to frame coordinates exactly as the monitor
 * is drawn (perspective(2600px) rotateY(-5deg) about its left-centre — the right side of
 * the screen is nearer the lens). Use it to pin leaders and pop-ups to on-screen objects.
 */
export const screenToFrame = (p: { x: number; y: number }) => {
  const rad = (MONITOR_ROTATE_Y * Math.PI) / 180;
  const mx = MONITOR.bezel + p.x * SCREEN_SCALE;
  const my = MONITOR.bezel + p.y * SCREEN_SCALE - MONITOR.h / 2;
  const x1 = mx * Math.cos(rad);
  const z1 = -mx * Math.sin(rad);
  const w = 1 - z1 / MONITOR_PERSPECTIVE;
  return { x: MONITOR.x + x1 / w, y: MONITOR.y + MONITOR.h / 2 + my / w };
};

export const Workspace: React.FC<{
  light: Light;
  /** Content shown on his monitor, laid out in the 1280×800 screen canvas. */
  screen?: React.ReactNode;
  /** Content resting on the desk edge (frame coordinates). */
  desk?: React.ReactNode;
  /** Show his shoulder/head in the foreground. */
  figure?: boolean;
  /** Depth of field: which plane is sharp. */
  focus?: 'screen' | 'desk' | 'figure';
  /** Momentary extra screen light (e.g. a notification arriving), 0…1. */
  flash?: number;
  /** Screen background colour override. */
  screenColor?: string;
  style?: React.CSSProperties;
}> = ({ light, screen, desk, figure = true, focus = 'screen', flash = 0, screenColor, style }) => {
  const pal = roomPalette(light);
  const { story, mode } = useStory();
  const uid = `ots-${useId().replace(/:/g, '')}`;
  const backPhoto = story.employee.backPhoto;
  const figureLit = interpolateColors(0.1 + light.exposure * 0.06, [0, 1], [pal.figure, pal.screen]);
  const screenBlur = focus === 'screen' ? 0 : focus === 'desk' ? 3 : 6;
  const figureBlur = focus === 'figure' ? 1.5 : 11;
  const dimness = 1 - light.exposure;

  return (
    <AbsoluteFill style={{ backgroundColor: pal.wall, overflow: 'hidden', ...style }}>
      {/* Wall + window light */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, ${pal.wall} 0%, ${pal.wallHi} 55%, ${pal.wall} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: -120,
          width: 360,
          height: 1100,
          background: `linear-gradient(90deg, ${pal.window}, rgba(0,0,0,0) 80%)`,
          filter: 'blur(50px)',
        }}
      />
      {/* Screen spill on the wall */}
      <div
        style={{
          position: 'absolute',
          left: MONITOR.x - 260,
          top: MONITOR.y - 200,
          width: MONITOR.w + 520,
          height: MONITOR.h + 380,
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${pal.screenSpill}, rgba(0,0,0,0) 70%)`,
          opacity: 0.35 + dimness * 0.65 + flash * 0.4,
        }}
      />

      {/* Desk */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: DESK_STRIP.y,
          bottom: 0,
          background: `linear-gradient(180deg, ${pal.deskHi} 0%, ${pal.desk} 100%)`,
          boxShadow: `0 -1px 0 ${pal.deskHi}`,
        }}
      />

      {/* Monitor stand */}
      <div
        style={{
          position: 'absolute',
          left: MONITOR.x + MONITOR.w / 2 - 38,
          top: MONITOR.y + MONITOR.h - 6,
          width: 76,
          height: DESK_STRIP.y - (MONITOR.y + MONITOR.h) + 16,
          background: 'linear-gradient(90deg, #1A1C20, #2A2D32 50%, #17191C)',
          filter: `blur(${screenBlur * 0.5}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: MONITOR.x + MONITOR.w / 2 - 150,
          top: DESK_STRIP.y + 4,
          width: 300,
          height: 22,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 40%, #2C2F34, #15171A 70%)',
          filter: `blur(${screenBlur * 0.5}px)`,
        }}
      />

      {/* Monitor */}
      <div
        style={{
          position: 'absolute',
          left: MONITOR.x,
          top: MONITOR.y,
          width: MONITOR.w,
          height: MONITOR.h,
          borderRadius: 14,
          background: '#0E0F11',
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px -30px rgba(0,0,0,${0.35 + dimness * 0.4})`,
          transform: `perspective(${MONITOR_PERSPECTIVE}px) rotateY(${MONITOR_ROTATE_Y}deg)`,
          transformOrigin: 'left center',
          filter: screenBlur ? `blur(${screenBlur}px)` : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: MONITOR.bezel,
            top: MONITOR.bezel,
            width: SCREEN_RECT.w,
            height: SCREEN_RECT.h,
            borderRadius: 4,
            overflow: 'hidden',
            background: screenColor ?? pal.screen,
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_CANVAS.w, height: SCREEN_CANVAS.h, transform: `scale(${SCREEN_SCALE})`, transformOrigin: '0 0' }}>
            {screen}
          </div>
          {/* glass: faint reflection + light falloff */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 35%), radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.08) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Keyboard, low on the desk */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: DESK_STRIP.y + 70,
          width: 520,
          height: 34,
          borderRadius: 6,
          background: `linear-gradient(180deg, ${pal.deskHi}, ${pal.desk})`,
          boxShadow: `0 0 0 1px rgba(0,0,0,0.18), 0 10px 18px -8px rgba(0,0,0,${0.25 + dimness * 0.3})`,
          transform: 'perspective(900px) rotateX(55deg)',
          filter: 'blur(1.2px)',
        }}
      />

      {/* Desk-edge items */}
      {desk ? <AbsoluteFill style={{ filter: focus === 'desk' ? undefined : 'blur(1.5px)' }}>{desk}</AbsoluteFill> : null}

      {/* Foreground: his shoulder and the back of his head */}
      {figure && backPhoto ? (
        // An approved over-the-shoulder photo (employee.backPhoto), kept out of focus like the placeholder.
        <Img
          src={staticFile(backPhoto)}
          style={{
            position: 'absolute',
            left: -190,
            top: 452,
            width: 920,
            height: 700,
            objectFit: 'cover',
            filter: `blur(${figureBlur}px) grayscale(0.9) brightness(${0.35 + light.exposure * 0.45})`,
          }}
        />
      ) : figure ? (
        <svg
          viewBox="0 0 920 700"
          style={{ position: 'absolute', left: -190, top: 452, width: 920, height: 700, overflow: 'visible', filter: `blur(${figureBlur}px)` }}
        >
          <defs>
            <linearGradient id={`${uid}-fig`} x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stopColor={pal.figure} />
              <stop offset="0.7" stopColor={pal.figure} />
              <stop offset="1" stopColor={figureLit} />
            </linearGradient>
            {/* Screen light on the edges that face the monitor (his ear, jaw, shoulder line). */}
            <filter id={`${uid}-rim`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feOffset in="SourceAlpha" dx="-12" dy="2" result="shifted" />
              <feComposite in="SourceAlpha" in2="shifted" operator="out" result="edge" />
              <feGaussianBlur in="edge" stdDeviation="3.5" result="edgeBlur" />
              <feFlood floodColor={pal.screen} floodOpacity={0.3 + dimness * 0.45 + flash * 0.3} />
              <feComposite in2="edgeBlur" operator="in" />
            </filter>
          </defs>
          <path d={OTS_FIGURE} fill={`url(#${uid}-fig)`} />
          <path d={OTS_COLLAR} stroke={figureLit} strokeWidth={6} fill="none" opacity={0.5} />
          <path d={OTS_FIGURE} fill="#000" filter={`url(#${uid}-rim)`} />
        </svg>
      ) : null}
      {figure && !backPhoto && mode === 'draft' ? (
        <div
          style={{
            position: 'absolute',
            left: 40,
            bottom: 40,
            fontFamily: fonts.mono,
            fontSize: 18,
            letterSpacing: '0.12em',
            color: pal.tone === 'light' ? colors.mutedOnLight : colors.mutedOnDark,
            border: `1px dashed ${pal.tone === 'light' ? colors.faintOnLight : colors.faintOnDark}`,
            padding: '5px 9px',
          }}
        >
          {story.ui.photoPlaceholder}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

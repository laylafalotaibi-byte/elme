import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { colors, fonts } from '../../campaign/theme';
import { roomPalette, type Light } from '../../campaign/light';
import { useStory } from '../../campaign/StoryContext';
import { PROFILE_HAIR, PROFILE_HEAD, PROFILE_TORSO } from '../portrait/silhouettes';

/**
 * HeroShot — the full-bleed shot of the person, looking right towards his screen.
 * The screen is just off-frame right; its light rims his profile. Text sits in the
 * negative space on the right.
 *
 * With `employee.photo` set, the approved photo fills the frame (see docs/DESIGN_SYSTEM.md
 * §5 for the photo spec). Without it, a soft back-lit profile silhouette stands in.
 */

export type HeroFraming = 'medium' | 'close';

const FRAMING: Record<HeroFraming, { scale: number; x: number; y: number }> = {
  // profile viewBox is 400×500 → placed and scaled inside 1920×1080
  medium: { scale: 2.15, x: 90, y: 110 },
  close: { scale: 3.3, x: -120, y: -110 },
};

/** Text-safe region for each framing (right of the face). */
export const HERO_TEXT_SAFE: Record<HeroFraming, { x: number; y: number; w: number; h: number }> = {
  medium: { x: 860, y: 140, w: 900, h: 800 },
  close: { x: 980, y: 140, w: 800, h: 800 },
};

export const HeroShot: React.FC<{
  light: Light;
  framing?: HeroFraming;
  /** Warm front key light on his face, 0…1 (Scene 05: his decision brings the light). */
  keyLight?: number;
  /** Rack focus: blur on the person in px. */
  blur?: number;
  /** Extra scale for slow pushes (≤ 1.06). */
  zoom?: number;
  /** Brightness of the off-frame screen light, 0…1. */
  screenGlow?: number;
  style?: React.CSSProperties;
}> = ({ light, framing = 'medium', keyLight = 0, blur = 0, zoom = 1, screenGlow = 1, style }) => {
  const { story, mode } = useStory();
  const { photo, focalPoint } = story.employee;
  const pal = roomPalette(light);
  const f = FRAMING[framing];
  const id = `hero-${framing}`;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: pal.wall, ...style }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '35% 45%' }}>
        {photo ? (
          <>
            <Img
              src={staticFile(photo)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
                filter: `grayscale(${0.92 - light.warmth * 0.1}) sepia(${light.warmth * 0.22}) brightness(${0.45 + light.exposure * 0.6 + keyLight * 0.12}) contrast(1.08) blur(${blur}px)`,
              }}
            />
            <AbsoluteFill
              style={{
                background:
                  pal.tone === 'dark'
                    ? 'linear-gradient(90deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 75%)'
                    : 'linear-gradient(90deg, rgba(255,255,255,0) 40%, rgba(250,246,240,0.55) 80%)',
              }}
            />
          </>
        ) : (
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
              <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={pal.wall} />
                <stop offset="1" stopColor={pal.wallHi} />
              </linearGradient>
              <radialGradient id={`${id}-spill`} cx="1" cy="0.45" r="0.75">
                <stop offset="0" stopColor={pal.screenSpill} stopOpacity={screenGlow} />
                <stop offset="1" stopColor={pal.screenSpill} stopOpacity={0} />
              </radialGradient>
              <linearGradient id={`${id}-fig`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={pal.figure} />
                <stop offset="1" stopColor={pal.figure} />
              </linearGradient>
              <radialGradient id={`${id}-key`} cx="0.62" cy="0.42" r="0.5">
                <stop offset="0" stopColor="#FFD3A6" stopOpacity={0.22 * keyLight} />
                <stop offset="0.7" stopColor="#FFD3A6" stopOpacity={0.06 * keyLight} />
                <stop offset="1" stopColor="#FFD3A6" stopOpacity={0} />
              </radialGradient>
              <filter id={`${id}-keysoft`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={6 / f.scale} />
              </filter>
              {/* Organic edge: breaks the perfect vector outline so it reads as a photographed figure. */}
              <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={4} result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.2} xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation={(1.6 + blur) / f.scale} />
              </filter>
              {/* Rim light from the screen on his right-facing edge — thin, scale-aware. */}
              <filter id={`${id}-rim`} x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={4} result="noise" />
                <feDisplacementMap in="SourceAlpha" in2="noise" scale={3.2} xChannelSelector="R" yChannelSelector="G" result="alpha" />
                <feOffset in="alpha" dx={-5 / f.scale} dy={1.5 / f.scale} result="shifted" />
                <feComposite in="alpha" in2="shifted" operator="out" result="edge" />
                <feGaussianBlur in="edge" stdDeviation={2.2 / f.scale} result="edgeBlur" />
                <feFlood floodColor={pal.screen} floodOpacity={(0.3 + 0.35 * screenGlow * (1 - light.exposure * 0.5)) * (1 - keyLight * 0.4)} />
                <feComposite in2="edgeBlur" operator="in" />
              </filter>
              <filter id={`${id}-bokeh`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="38" />
              </filter>
              <clipPath id={`${id}-clip`}>
                <path d={PROFILE_HEAD} />
                <path d={PROFILE_TORSO} />
                <path d={PROFILE_HAIR} />
              </clipPath>
            </defs>

            {/* Room behind him, out of focus */}
            <rect width="1920" height="1080" fill={`url(#${id}-wall)`} />
            <g filter={`url(#${id}-bokeh)`}>
              <rect x="120" y="-100" width="70" height="1300" fill={pal.window} />
              <rect x="260" y="-100" width="36" height="1300" fill={pal.window} />
              {/* the screen he is looking at, just off-frame right */}
              <rect x="1780" y="180" width="420" height="640" rx="20" fill={pal.screen} opacity={0.75 * screenGlow} />
            </g>
            <rect width="1920" height="1080" fill={`url(#${id}-spill)`} />

            <g transform={`translate(${f.x} ${f.y}) scale(${f.scale})`}>
              <g filter={`url(#${id}-soft)`}>
                <path d={PROFILE_TORSO} fill={`url(#${id}-fig)`} />
                <path d={PROFILE_HEAD} fill={`url(#${id}-fig)`} />
                <path d={PROFILE_HAIR} fill={`url(#${id}-fig)`} />
              </g>
              {keyLight > 0 ? (
                <g clipPath={`url(#${id}-clip)`} filter={`url(#${id}-keysoft)`}>
                  <ellipse cx={245} cy={215} rx={120} ry={150} fill={`url(#${id}-key)`} />
                </g>
              ) : null}
              <g filter={`url(#${id}-rim)`} opacity={blur > 4 ? 0.5 : 1}>
                <path d={PROFILE_TORSO} fill="#000" />
                <path d={PROFILE_HEAD} fill="#000" />
                <path d={PROFILE_HAIR} fill="#000" />
              </g>
            </g>
          </svg>
        )}
      </AbsoluteFill>
      {mode === 'draft' && !photo ? (
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 40,
            fontFamily: fonts.mono,
            fontSize: 12,
            letterSpacing: '0.14em',
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

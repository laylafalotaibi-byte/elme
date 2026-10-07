import React, { useId } from 'react';
import { AbsoluteFill, Img, interpolateColors, staticFile } from 'remotion';
import { colors, fonts } from '../../campaign/theme';
import { roomPalette, type Light } from '../../campaign/light';
import { useStory } from '../../campaign/StoryContext';
import { PROFILE_COLLAR, PROFILE_EAR, PROFILE_HAIR, PROFILE_HEAD, PROFILE_TORSO } from '../portrait/silhouettes';

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

/** How much tighter the 'close' framing crops an approved photo. */
const PHOTO_CLOSE_SCALE = 1.45;

/** Text-safe region for each framing (right of the face). */
export const HERO_TEXT_SAFE: Record<HeroFraming, { x: number; y: number; w: number; h: number }> = {
  medium: { x: 860, y: 140, w: 900, h: 800 },
  close: { x: 980, y: 140, w: 800, h: 800 },
};

export const HeroShot: React.FC<{
  light: Light;
  framing?: HeroFraming;
  /**
   * Warm front key light on his face (Scene 05: his decision brings the light).
   * 0 = rim only, 1 = a clear key; clamped to 0…1.5.
   */
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
  const id = `hero-${framing}-${useId().replace(/:/g, '')}`;
  const key = Math.max(0, Math.min(1.5, keyLight));
  // The side of him that faces the screen catches a little light; the far side stays dark.
  const rimOpacity = Math.max(0, (0.42 + 0.4 * screenGlow * (1 - light.exposure * 0.45)) * (1 - Math.min(1, key) * 0.3));
  const figureLit = interpolateColors(0.09 + light.exposure * 0.06, [0, 1], [pal.figure, pal.screen]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: pal.wall, ...style }}>
      <AbsoluteFill
        style={{
          // A real photo has no separate close-up, so 'close' tightens around the focal point.
          transform: `scale(${zoom * (photo && framing === 'close' ? PHOTO_CLOSE_SCALE : 1)})`,
          transformOrigin: photo ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : '35% 45%',
        }}
      >
        {photo ? (
          <>
            <Img
              src={staticFile(photo)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
                filter: `grayscale(${0.92 - light.warmth * 0.1}) sepia(${light.warmth * 0.22}) brightness(${0.45 + light.exposure * 0.6 + key * 0.12}) contrast(1.08) blur(${blur}px)`,
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
              {/* Out-of-focus room, drawn as soft gradients (cheaper than blurring shapes). */}
              <linearGradient id={`${id}-window`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={pal.window} stopOpacity={0} />
                <stop offset="0.5" stopColor={pal.window} />
                <stop offset="1" stopColor={pal.window} stopOpacity={0} />
              </linearGradient>
              <radialGradient id={`${id}-screen`} cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor={pal.screen} stopOpacity={0.8 * screenGlow} />
                <stop offset="0.55" stopColor={pal.screen} stopOpacity={0.55 * screenGlow} />
                <stop offset="1" stopColor={pal.screen} stopOpacity={0} />
              </radialGradient>
              {/* Figure tone: darkest on the far side, lifted where the screen light reaches. */}
              <linearGradient id={`${id}-fig`} gradientUnits="userSpaceOnUse" x1="120" y1="0" x2="300" y2="0">
                <stop offset="0" stopColor={pal.figure} />
                <stop offset="0.55" stopColor={pal.figure} />
                <stop offset="1" stopColor={figureLit} />
              </linearGradient>
              <radialGradient id={`${id}-key`} gradientUnits="userSpaceOnUse" cx="248" cy="200" r="88">
                <stop offset="0" stopColor="#FFD3A6" stopOpacity={0.46 * key} />
                <stop offset="0.6" stopColor="#FFD3A6" stopOpacity={0.16 * key} />
                <stop offset="1" stopColor="#FFD3A6" stopOpacity={0} />
              </radialGradient>
              <radialGradient id={`${id}-keyspill`} gradientUnits="userSpaceOnUse" cx="300" cy="390" r="90">
                <stop offset="0" stopColor="#FFD3A6" stopOpacity={0.22 * key} />
                <stop offset="1" stopColor="#FFD3A6" stopOpacity={0} />
              </radialGradient>
              {/*
                One filter for the whole figure (one noise pass): an organic, photographed edge;
                a directional rim of screen light on the edges that face the screen (dx only, so
                the back of his head stays dark); and a soft light-wrap onto the face plane.
              */}
              <filter id={`${id}-figure`} colorInterpolationFilters="sRGB" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={4} result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.4} xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation={(1.4 + blur) / f.scale} result="body" />
                <feColorMatrix in="displaced" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="alpha" />
                <feOffset in="alpha" dx={-7 / f.scale} dy={0} result="shifted" />
                <feComposite in="alpha" in2="shifted" operator="out" result="edge" />
                <feGaussianBlur in="edge" stdDeviation={1.8 / f.scale} result="edgeSoft" />
                <feFlood floodColor={pal.screen} floodOpacity={rimOpacity} />
                <feComposite in2="edgeSoft" operator="in" result="rim" />
                <feOffset in="alpha" dx={-22 / f.scale} dy={0} result="shiftedWide" />
                <feComposite in="alpha" in2="shiftedWide" operator="out" result="wrapEdge" />
                <feGaussianBlur in="wrapEdge" stdDeviation={9 / f.scale} result="wrapSoft" />
                <feComposite in="wrapSoft" in2="alpha" operator="in" result="wrapIn" />
                <feFlood floodColor={pal.screen} floodOpacity={rimOpacity * 0.28} />
                <feComposite in2="wrapIn" operator="in" result="wrap" />
                <feMerge>
                  <feMergeNode in="body" />
                  <feMergeNode in="wrap" />
                  <feMergeNode in="rim" />
                </feMerge>
              </filter>
              <filter id={`${id}-keysoft`} colorInterpolationFilters="sRGB" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation={8 / f.scale} />
              </filter>
              <clipPath id={`${id}-clip`}>
                <path d={PROFILE_HEAD} />
                <path d={PROFILE_TORSO} />
                <path d={PROFILE_HAIR} />
                <path d={PROFILE_COLLAR} />
              </clipPath>
            </defs>

            {/* Room behind him, out of focus */}
            <rect width="1920" height="1080" fill={`url(#${id}-wall)`} />
            <rect x="40" y="0" width="230" height="1080" fill={`url(#${id}-window)`} />
            <rect x="230" y="0" width="120" height="1080" fill={`url(#${id}-window)`} opacity={0.6} />
            <ellipse cx="2000" cy="500" rx="420" ry="460" fill={`url(#${id}-screen)`} />
            <rect width="1920" height="1080" fill={`url(#${id}-spill)`} />

            <g transform={`translate(${f.x} ${f.y}) scale(${f.scale})`}>
              <g filter={`url(#${id}-figure)`}>
                <path d={PROFILE_TORSO} fill={`url(#${id}-fig)`} />
                <path d={PROFILE_HEAD} fill={`url(#${id}-fig)`} />
                <path d={PROFILE_HAIR} fill={`url(#${id}-fig)`} />
                <path d={PROFILE_COLLAR} fill={`url(#${id}-fig)`} />
              </g>
              <g clipPath={`url(#${id}-clip)`}>
                {/* ear and collar: barely-there tonal detail, not drawn features */}
                <path d={PROFILE_EAR} stroke={figureLit} strokeWidth={2.2} fill="none" opacity={0.5} filter={`url(#${id}-keysoft)`} />
                <path d="M206 300 C214 314 224 326 233 332" stroke={figureLit} strokeWidth={1.6} fill="none" opacity={0.45} />
                {key > 0 ? (
                  <g filter={`url(#${id}-keysoft)`}>
                    <ellipse cx={252} cy={204} rx={78} ry={104} fill={`url(#${id}-key)`} />
                    <ellipse cx={300} cy={392} rx={96} ry={70} fill={`url(#${id}-keyspill)`} />
                  </g>
                ) : null}
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

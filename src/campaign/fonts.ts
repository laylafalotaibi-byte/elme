import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

/**
 * Loads the three campaign voices from public/fonts (SIL OFL 1.1, bundled locally so
 * renders never depend on a network font service). `loadFont` holds the render until
 * each face is ready.
 */
const faces: Array<{ family: string; file: string; weight: string; style?: string }> = [
  { family: 'Inter Tight', file: 'inter-tight-latin-400-normal.woff2', weight: '400' },
  { family: 'Inter Tight', file: 'inter-tight-latin-500-normal.woff2', weight: '500' },
  { family: 'Inter Tight', file: 'inter-tight-latin-600-normal.woff2', weight: '600' },
  { family: 'Instrument Serif', file: 'instrument-serif-latin-400-normal.woff2', weight: '400' },
  { family: 'Instrument Serif', file: 'instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic' },
  { family: 'JetBrains Mono', file: 'jetbrains-mono-latin-400-normal.woff2', weight: '400' },
  { family: 'JetBrains Mono', file: 'jetbrains-mono-latin-500-normal.woff2', weight: '500' },
];

let loaded = false;

export const loadCampaignFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const face of faces) {
    loadFont({
      family: face.family,
      url: staticFile(`fonts/${face.file}`),
      weight: face.weight,
      style: face.style ?? 'normal',
    });
  }
};

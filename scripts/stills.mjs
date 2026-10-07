#!/usr/bin/env node
/**
 * Render review stills (and optional contact sheet) for any composition.
 *
 *   node scripts/stills.mjs --comp S02-Before --frames 0,60,120,200 [--scale 0.5] [--out out/stills] [--draft] [--sheet]
 *   node scripts/stills.mjs --comp Story01 --every 60 --sheet
 *
 * Bundles once, opens one browser, renders every requested frame as JPEG.
 * --sheet also writes <comp>-sheet.jpg (a tiled contact sheet, via ffmpeg) — handy for review.
 * Set REMOTION_BROWSER_EXECUTABLE to use a locally installed Chrome / headless shell.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer';

const args = process.argv.slice(2);
const get = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const has = (name) => args.includes(`--${name}`);

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const compId = get('comp');
if (!compId) {
  console.error('Usage: node scripts/stills.mjs --comp <id> (--frames 0,30,60 | --every 30) [--scale 0.5] [--out dir] [--draft] [--sheet]');
  process.exit(1);
}
const scale = Number(get('scale', '0.5'));
const outDir = path.resolve(root, get('out', 'out/stills'));
fs.mkdirSync(outDir, { recursive: true });

const pwShell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? (fs.existsSync(pwShell) ? pwShell : null);

const t0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), enableCaching: false });
const browser = await openBrowser('chrome', { browserExecutable });
try {
  const inputProps = has('draft') ? { mode: 'draft' } : {};
  const composition = await selectComposition({ serveUrl, id: compId, inputProps, puppeteerInstance: browser, browserExecutable });

  let frames;
  if (get('every')) {
    const step = Number(get('every'));
    frames = [];
    for (let f = 0; f < composition.durationInFrames; f += step) frames.push(f);
    frames.push(composition.durationInFrames - 1);
  } else {
    frames = (get('frames', '0') || '0').split(',').map((f) => Number(f.trim()));
  }
  frames = [...new Set(frames.filter((f) => f >= 0 && f < composition.durationInFrames))].sort((a, b) => a - b);

  const written = [];
  for (const frame of frames) {
    const output = path.join(outDir, `${compId}-f${String(frame).padStart(4, '0')}.jpg`);
    await renderStill({
      composition,
      serveUrl,
      output,
      frame,
      scale,
      imageFormat: 'jpeg',
      jpegQuality: 85,
      inputProps,
      puppeteerInstance: browser,
      browserExecutable,
      overwrite: true,
    });
    written.push(output);
    console.log(`frame ${frame} → ${path.relative(root, output)}`);
  }

  if (has('sheet') && written.length > 1) {
    const cols = Math.min(4, written.length);
    const rows = Math.ceil(written.length / cols);
    const sheet = path.join(outDir, `${compId}-sheet.jpg`);
    const listFile = path.join(outDir, `${compId}-sheet.txt`);
    // Pad to a full grid by repeating the last frame.
    const padded = [...written];
    while (padded.length < cols * rows) padded.push(written[written.length - 1]);
    const inputs = padded.flatMap((f) => ['-i', f]);
    const w = Math.round(1920 * scale * 0.5);
    const filters = padded.map((_, i) => `[${i}:v]scale=${w}:-1,drawtext=text='${frames[Math.min(i, frames.length - 1)]}':x=8:y=8:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`).join(';');
    const layout = padded.map((_, i) => `${(i % cols) === 0 ? '0' : Array.from({ length: i % cols }, () => 'w0').join('+')}_${Math.floor(i / cols) === 0 ? '0' : Array.from({ length: Math.floor(i / cols) }, () => 'h0').join('+')}`).join('|');
    try {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', `${filters};${padded.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${padded.length}:layout=${layout}`, '-frames:v', '1', '-q:v', '3', sheet]);
      console.log(`sheet → ${path.relative(root, sheet)}`);
    } catch (e) {
      console.warn('Contact sheet failed (ffmpeg drawtext/xstack unavailable?):', e.message);
    }
    if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
  }
} finally {
  await browser.close({ silent: true });
}
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

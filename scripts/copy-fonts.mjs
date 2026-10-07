// Copies the open-licensed (SIL OFL 1.1) campaign fonts from @fontsource into public/fonts.
// Run once after `npm install` if public/fonts is missing: `npm run fonts`.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'public', 'fonts');
fs.mkdirSync(out, { recursive: true });

const files = [
  ['inter-tight', 'inter-tight-latin-400-normal.woff2'],
  ['inter-tight', 'inter-tight-latin-500-normal.woff2'],
  ['inter-tight', 'inter-tight-latin-600-normal.woff2'],
  ['newsreader', 'newsreader-latin-300-normal.woff2'],
  ['newsreader', 'newsreader-latin-300-italic.woff2'],
  ['newsreader', 'newsreader-latin-400-normal.woff2'],
  ['newsreader', 'newsreader-latin-400-italic.woff2'],
  ['jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff2'],
  ['jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff2'],
];

for (const [pkg, file] of files) {
  fs.copyFileSync(path.join(root, 'node_modules', '@fontsource', pkg, 'files', file), path.join(out, file));
}
for (const pkg of new Set(files.map(([p]) => p))) {
  const license = path.join(root, 'node_modules', '@fontsource', pkg, 'LICENSE');
  if (fs.existsSync(license)) fs.copyFileSync(license, path.join(out, `LICENSE-${pkg}.txt`));
}
console.log(`Copied ${files.length} font files to ${path.relative(root, out)}`);

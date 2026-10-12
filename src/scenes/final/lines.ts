import { richWords, type Segment } from '../../components/typography/RichText';

/**
 * Line-breaking for the display copy of Scenes 09–10. Story lines come from config as one
 * string; a line is set on as few lines as fit a measured width, broken where the sentence
 * breathes (after a comma) and balanced in length — never by the browser's greedy wrap,
 * which would leave an orphan. Measurement lives in close-measure.ts.
 */

/** Re-serialise word tokens as rich text, keeping *emphasis* runs together. */
const serialise = (words: Segment[]) => {
  const out: string[] = [];
  let i = 0;
  while (i < words.length) {
    if (!words[i].emphasis) {
      out.push(words[i].text);
      i++;
      continue;
    }
    const run: string[] = [];
    while (i < words.length && words[i].emphasis) run.push(words[i++].text);
    out.push(`*${run.join(' ')}*`);
  }
  return out.join(' ');
};

export type WordMeasure = { word: (seg: Segment) => number; space: number };

/** Most lines a single story line may take before we stop balancing and simply wrap. */
const MAX_LINES = 4;

/** Short words that should start the next line rather than end this one. */
const WEAK_ENDINGS = /^(a|an|the|to|of|in|on|at|by|for|with|and|or|but|no|his|her|its|their)$/i;

/** All ways to choose `k` sorted break positions from 1…n-1. */
function* combinations(n: number, k: number, start = 1, acc: number[] = []): Generator<number[]> {
  if (acc.length === k) {
    yield acc;
    return;
  }
  for (let i = start; i <= n - 1 - (k - acc.length - 1); i++) yield* combinations(n, k, i + 1, [...acc, i]);
}

/**
 * Break rich text into the fewest lines that fit `maxWidth`; among those, the most balanced
 * (shortest longest line), preferring breaks after punctuation, keeping a human-voice phrase
 * whole where possible and never stranding a single word. Returns rich-text lines.
 */
export const breakLines = (text: string, maxWidth: number, measure: WordMeasure): string[] => {
  const words = richWords(text);
  const n = words.length;
  if (n === 0) return [];
  const w = words.map(measure.word);
  const width = (a: number, b: number) => w.slice(a, b).reduce((s, x) => s + x, 0) + measure.space * (b - a - 1);
  if (n === 1 || width(0, n) <= maxWidth) return [text];

  for (let lines = 2; lines <= Math.min(n, MAX_LINES); lines++) {
    let best: number[] | null = null;
    let bestScore = Infinity;
    for (const cuts of combinations(n, lines - 1)) {
      const edges = [0, ...cuts, n];
      let longest = 0;
      let penalty = 0;
      let fits = true;
      for (let l = 0; l < lines; l++) {
        const lw = width(edges[l], edges[l + 1]);
        if (lw > maxWidth) {
          fits = false;
          break;
        }
        longest = Math.max(longest, lw);
        // a lone word on a line reads as an orphan
        if (edges[l + 1] - edges[l] === 1 && n >= 3) penalty += 0.3 * maxWidth;
      }
      if (!fits) continue;
      for (const c of cuts) {
        const last = words[c - 1].text;
        if (/[,;:.!?–—]$/.test(last)) penalty -= 0.08 * maxWidth; // breathe after punctuation
        if (words[c - 1].emphasis && words[c].emphasis) penalty += 0.2 * maxWidth; // keep the human voice whole
        if (WEAK_ENDINGS.test(last)) penalty += 0.25 * maxWidth; // never leave "a", "the", "to"… hanging at a line end
      }
      const score = longest + penalty;
      if (score < bestScore) {
        bestScore = score;
        best = cuts;
      }
    }
    if (best) {
      const edges = [0, ...best, n];
      return edges.slice(0, -1).map((a, l) => serialise(words.slice(a, edges[l + 1])));
    }
  }

  // very long copy: greedy wrap (still inside the width)
  const out: Segment[][] = [[]];
  let lw = 0;
  words.forEach((word, i) => {
    const add = (out[out.length - 1].length ? measure.space : 0) + w[i];
    if (out[out.length - 1].length && lw + add > maxWidth) {
      out.push([word]);
      lw = w[i];
    } else {
      out[out.length - 1].push(word);
      lw += add;
    }
  });
  return out.map(serialise);
};

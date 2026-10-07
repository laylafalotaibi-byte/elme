import { richWords, type Segment } from '../../components/typography/RichText';

/**
 * Line-breaking for display copy. Story lines come from config as one string; long ones
 * are set on two lines, broken where the sentence breathes (after a comma) and balanced
 * in length — never by the browser's wrap, which would leave an orphan.
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

/** Split rich text into one or two lines (two when it is longer than `maxChars`). */
export const splitLines = (text: string, maxChars: number): string[] => {
  const words = richWords(text);
  const plainLength = words.reduce((n, w) => n + w.text.length, 0) + Math.max(0, words.length - 1);
  if (words.length < 3 || plainLength <= maxChars) return [text];

  let best = 1;
  let bestScore = Infinity;
  let left = -1;
  for (let i = 1; i < words.length; i++) {
    left += words[i - 1].text.length + 1;
    const right = plainLength - left - 1;
    let score = Math.abs(left - right);
    // breathe after punctuation; never strand a single short word
    if (/[,;:]$/.test(words[i - 1].text)) score -= 10;
    if (i === 1 || i === words.length - 1) score += 20;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return [serialise(words.slice(0, best)), serialise(words.slice(best))];
};

import type { MetricConfig } from '../../campaign/types';

/**
 * STORY 01 — Impact metrics
 * -------------------------
 * NO NUMBER IN THIS FILE IS VERIFIED YET. Do not invent values.
 *
 * To publish a verified figure, set `verified`, e.g.
 *   verified: { value: '+35%' }                 (format: 'single')
 *   verified: { from: '12', to: '3' }           (format: 'fromTo')
 *
 * Until then:
 *   - the final composition (Story01) shows the qualitative `fallback` wording;
 *   - the draft composition (Story01-MetricsDraft) shows the `placeholder` slot with a
 *     "TO VERIFY" tag, so reviewers can see what still needs a number.
 *
 * Fallback wording comes from the brief's approved list or from facts stated in the brief.
 */
export const story01Metrics: MetricConfig[] = [
  {
    id: 'timeSaved',
    label: 'Time saved',
    format: 'single',
    verified: null,
    placeholder: { value: '[X]% / [X] hrs' },
    fallback: 'Less Manual Work',
  },
  {
    id: 'manualSteps',
    label: 'Manual steps',
    format: 'fromTo',
    verified: null,
    placeholder: { from: '[X]', to: '[X]' },
    fallback: 'Reduced Repetitive Work',
  },
  {
    id: 'processingTime',
    label: 'Processing time',
    format: 'fromTo',
    verified: null,
    placeholder: { from: '[Before]', to: '[After]' },
    fallback: 'Faster Processing',
  },
  {
    // Brief fact: reduced dependency on paper. Only change to "Eliminated" if verified.
    id: 'paper',
    label: 'Paper',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: 'Reduced',
    direction: 'down',
  },
  {
    // Brief fact: consolidated data across multiple sites. Site count is not known yet.
    id: 'sites',
    label: 'Sites',
    format: 'single',
    verified: null,
    placeholder: { value: '[X] connected' },
    fallback: 'One Consistent Process',
  },
  {
    // Brief fact: centralized record storage.
    id: 'records',
    label: 'Records',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: 'Centralized',
  },
  {
    id: 'errorRisk',
    label: 'Error risk',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: 'Reduced',
    direction: 'down',
  },
  {
    // Brief fact: reduced dependency on manual emails.
    id: 'manualEmails',
    label: 'Manual emails',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: 'Reduced',
    direction: 'down',
  },
];

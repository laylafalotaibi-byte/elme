import type { MetricConfig } from '../../campaign/types';

/**
 * STORY 01 — Impact metrics
 * -------------------------
 * NO NUMBER IN THIS FILE IS VERIFIED YET. Do not invent values.
 *
 * To publish a verified figure, set `verified` WITH its source, e.g.
 *   verified: { value: '+[X]%', source: 'Asset Team log, Q3' }        (format: 'single')
 *   verified: { from: '[X]', to: '[X]', source: '…' }                  (format: 'fromTo')
 *
 * Until then:
 *   - Story01 (final) shows the qualitative `fallback` (approved wording from the brief or
 *     a stated fact), with a label only where label and wording agree;
 *   - Story01-MetricsDraft shows `label` + the `placeholder` slot tagged TO VERIFY.
 *
 * Where they appear: story.config.ts → impact.inWorkflow (Scene 06) and
 * impact.sequence (Scene 08). All metrics stay editable here even if not sequenced.
 */
export const story01Metrics: MetricConfig[] = [
  {
    id: 'timeSaved',
    label: 'Time saved',
    format: 'single',
    verified: null,
    placeholder: { value: '[X]% / [X] hrs' },
    fallback: { label: null, value: 'Less Manual Work' },
  },
  {
    id: 'manualSteps',
    label: 'Manual steps',
    format: 'fromTo',
    verified: null,
    placeholder: { from: '[X]', to: '[X]' },
    fallback: { label: null, value: 'Reduced Repetitive Work' },
  },
  {
    id: 'processingTime',
    label: 'Processing time',
    format: 'fromTo',
    verified: null,
    placeholder: { from: '[Before]', to: '[After]' },
    fallback: { label: null, value: 'Faster Processing' },
  },
  {
    // Brief fact: reduced dependency on paper. Say "Eliminated" only if verified.
    id: 'paper',
    label: 'Paper',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: { label: 'Paper', value: 'Reduced' },
    direction: 'down',
  },
  {
    // Brief fact: reduced dependency on manual emails.
    id: 'manualEmails',
    label: 'Manual emails',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: { label: 'Manual emails', value: 'Reduced' },
    direction: 'down',
  },
  {
    id: 'errorRisk',
    label: 'Error risk',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: { label: null, value: 'Better Accuracy' },
  },
  {
    // Brief fact: consolidated data across multiple sites. The site count is not known yet.
    id: 'sites',
    label: 'Sites',
    format: 'single',
    verified: null,
    placeholder: { value: '[X] connected' },
    fallback: { label: 'Multiple sites', value: 'One Consistent Process' },
  },
  {
    // Brief fact: centralized record storage.
    id: 'records',
    label: 'Records',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: { label: 'Records', value: 'Centralized' },
  },
  {
    // Brief fact: better process consistency and accountability. Not sequenced by default.
    id: 'accountability',
    label: 'Accountability',
    format: 'single',
    verified: null,
    placeholder: null,
    fallback: { label: null, value: 'Improved Accountability' },
  },
];

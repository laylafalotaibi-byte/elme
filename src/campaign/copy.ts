import type { StoryConfig } from './types';

/**
 * The review decision, derived from the workflow step whose caption lists the options
 * (Story 01: REVIEW · "Approve / Reject"). The first option is the one his click resolves to.
 * Returns null when a story's workflow has no decision step.
 */
export const reviewDecision = (story: StoryConfig) => {
  const index = story.workflow.steps.findIndex((s) => (s.caption ?? '').includes('/'));
  if (index === -1) return null;
  const step = story.workflow.steps[index];
  const options = (step.caption ?? '').split('/').map((o) => o.trim()).filter(Boolean);
  return { index, label: step.label, options, chosen: options[0] };
};

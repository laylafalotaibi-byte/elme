import type { StoryConfig } from '../../campaign/types';

/**
 * STORY 01 — Device handover & asset registration
 * ------------------------------------------------
 * Every on-screen word of Story 01 lives here. Edit copy here, never inside scenes.
 *
 * Story copy (lines, annotations, indicators, workflow steps, before/after items, end
 * card) is verbatim from docs/BRIEF.md. Prop microcopy in `before.artifacts`, the
 * request card and the after `status` is ADDED and generic — have it approved.
 *
 * Fact guardrails (docs/BRIEF.md): the new workflow does NOT update System 800
 * automatically; paper is reduced, not eliminated; REVIEW is a human approve/reject
 * decision; no number appears unless verified in metrics.config.ts.
 *
 * *Asterisks* set words in the human voice (Newsreader italic) — use sparingly.
 */
export const story01: StoryConfig = {
  id: 'story-01',

  campaign: {
    name: 'We Found A Better Way',
    endLine: 'WE FOUND A BETTER WAY.',
    sector: 'Corporate Technology',
    storyNumber: 1,
    tagline: 'Small improvements can create meaningful impact.',
    logo: null,
  },

  // Replace before the final render. name: null → the final film shows no name.
  // Photo: drop the file in public/employee/ and set e.g. photo: 'employee/story01.jpg'.
  employee: {
    name: null,
    title: 'IT Support',
    team: null,
    photo: null,
    focalPoint: { x: 0.38, y: 0.4 },
  },

  ui: {
    namePlaceholder: '[Employee Name]',
    photoPlaceholder: 'PHOTO PLACEHOLDER',
    toVerify: 'TO VERIFY',
  },

  person: {
    request: {
      title: 'New device handover request',
      meta: 'Device delivery · Asset registration',
      status: 'Action required',
    },
    lines: ['Another device handover.', 'Another manual process.'],
  },

  before: {
    steps: [
      { label: 'Paper Form', artifact: 'paperForm' },
      { label: 'Signature', artifact: 'signature' },
      { label: 'Email', artifact: 'email' },
      { label: 'Follow-up', artifact: 'followUp' },
      { label: 'Manual System Update', artifact: 'systemUpdate' },
      { label: 'File / Record', artifact: 'files' },
      { label: 'Another Email', artifact: 'anotherEmail' },
      { label: 'Repeat', artifact: 'repeat' },
    ],
    annotations: ['Manual', 'Repeated Daily', 'Paper-Based', 'Multiple Follow-ups', 'High Manual Effort', 'Risk of Human Error'],
    artifacts: {
      form: {
        title: 'Device Handover Form',
        fields: ['Employee', 'Device', 'Site'],
        signatureLabel: 'Signature',
      },
      email: {
        to: 'Asset Team',
        subject: 'Device handover',
        preview: 'Handover form completed.',
      },
      followUp: {
        subject: 'Re: Device handover',
        message: 'Any update on this?',
      },
      system: {
        name: 'System 800',
        title: 'Asset update',
        fields: [
          { label: 'Asset', value: 'Device' },
          { label: 'Assigned to', value: 'Employee' },
          { label: 'Site', value: 'Site' },
          { label: 'Status', value: 'Delivered' },
        ],
        tag: 'Manual entry',
      },
      records: {
        buckets: ['Emails', 'Files'],
        fileName: 'handover_form.pdf',
      },
      anotherEmail: {
        subject: 'Fwd: Device handover',
        preview: 'Sharing again for the record.',
      },
      siteTag: 'Site',
    },
  },

  pain: {
    lines: [
      'The task wasn’t difficult.',
      'But repeating it every day was costing time.',
      'And every manual step created another opportunity for error.',
    ],
    indicators: [
      { label: 'Time', direction: 'down', value: 'Lost to repetitive work' },
      { label: 'Effort', direction: 'up', value: 'Manual handling' },
      { label: 'Risk', direction: 'up', value: 'Human error' },
      { label: 'Records', value: 'Fragmented' },
    ],
  },

  question: {
    text: 'Why are we still doing this manually?',
  },

  reveal: {
    lines: ['He was a junior IT Support employee.', 'He had no previous automation experience.'],
    words: ['LEARN.', 'EXPERIMENT.', 'BUILD.', 'IMPROVE.'],
    support: 'He started learning what he needed to solve the problem himself.',
  },

  workflow: {
    steps: [
      { label: 'Submit' },
      { label: 'Trigger' },
      { label: 'Review', caption: 'Approve / Reject' },
      { label: 'Generate Record' },
      { label: 'Centralize' },
      { label: 'Notify' },
    ],
    // No count is shown: the site lines read as "multiple sites".
    sitesLabel: 'Sites',
    notifyTargets: ['Asset Team', 'Employee'],
  },

  after: {
    status: 'Submitted digitally',
    comparison: {
      beforeLabel: 'Before',
      afterLabel: 'After',
      before: ['Paper', 'Emails', 'Manual follow-ups', 'Manual updates', 'Fragmented records'],
      after: ['Digital submission', 'Automated flow', 'Centralized record', 'Automatic notifications', 'Clean process'],
    },
  },

  impact: {
    inWorkflow: ['sites', 'records'],
    sequence: ['timeSaved', 'manualSteps', 'processingTime', 'paper', 'manualEmails', 'errorRisk'],
  },

  human: {
    lines: ['He wasn’t asked to build it.', 'He saw a problem.', 'And found *a better way.*'],
  },

  final: {
    from: 'MANUAL',
    to: 'AUTOMATED',
    lines: ['No previous automation experience.', 'Just curiosity, ownership, and *the drive to improve.*'],
  },

  // Off until royalty-free files are supplied in public/audio/. Cues are locked to scene frames.
  audio: {
    music: null,
    musicVolume: 0.5,
    cues: [
      { scene: 'person', frame: 36, file: null, note: 'Soft notification tick as the request arrives' },
      { scene: 'before', frame: 0, file: null, note: 'Ticks quicken with each loop of the old process' },
      { scene: 'question', frame: 36, file: null, note: 'Hard cut to silence' },
      { scene: 'reveal', frame: 110, file: null, note: 'A single sustained note enters on “no previous automation experience”' },
      { scene: 'final', frame: 0, file: null, note: 'Music resolves on the end-card full stop' },
    ],
  },
};

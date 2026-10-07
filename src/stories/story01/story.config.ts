import type { StoryConfig } from '../../campaign/types';

/**
 * STORY 01 — Device handover & asset registration
 * ------------------------------------------------
 * Every on-screen word of Story 01 lives here. Edit copy here, never inside scenes.
 *
 * Facts are taken verbatim from docs/BRIEF.md. Do not add capabilities the brief does not
 * list (e.g. the new workflow does NOT update System 800 automatically, and paper is
 * reduced — not eliminated).
 *
 * *Asterisks* set words in the campaign's human voice (serif italic).
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

  // Replace with the approved name, title and photo before the final render.
  // Photo: drop the file in public/employee/ and set e.g. photo: 'employee/story01.jpg'.
  employee: {
    name: '[Employee Name]',
    title: 'IT Support',
    team: 'Corporate Technology',
    photo: null,
    focalPoint: { x: 0.5, y: 0.34 },
  },

  person: {
    kicker: 'Story 01 — Corporate Technology',
    request: {
      title: 'New device handover request',
      meta: 'Device delivery · Asset registration',
      status: 'Action required',
    },
    lines: ['Another device handover.', 'Another *manual* process.'],
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
    annotations: [
      { text: 'Manual', step: 0, delay: 14 },
      { text: 'Paper-Based', step: 1, delay: 12 },
      { text: 'Multiple Follow-ups', step: 3, delay: 12 },
      { text: 'Repeated Daily', step: 7, delay: 6 },
      { text: 'High Manual Effort', step: 7, delay: 30 },
      { text: 'Risk of Human Error', step: 7, delay: 52 },
    ],
    artifacts: {
      form: {
        title: 'Device Handover Form',
        fields: ['Employee', 'Device', 'Serial No.', 'Site', 'Date'],
        signatureLabel: 'Signature',
      },
      email: {
        from: 'IT Support',
        to: 'Asset Team',
        subject: 'Device handover — signed form attached',
        preview: 'Please find the signed handover form attached.',
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
          { label: 'Serial No.', value: '••••••••' },
          { label: 'Assigned to', value: 'Employee' },
          { label: 'Site', value: '••••' },
        ],
      },
      files: {
        title: 'Handover records',
        locations: ['Email attachments', 'Shared folder', 'Local files'],
        fileName: 'handover_form_signed.pdf',
      },
      anotherEmail: {
        subject: 'Fwd: Re: Device handover',
        preview: 'Forwarding again for the record.',
      },
      repeat: {
        label: 'Repeat',
        sites: ['Another site', 'Another site', 'Another site'],
      },
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
    lines: ['He was a junior IT Support employee.', 'He had *no previous automation experience.*'],
    words: ['LEARN.', 'EXPERIMENT.', 'BUILD.', 'IMPROVE.'],
    support: 'He started learning what he needed to solve the problem himself.',
    sketchLabels: ['Try', 'Test', 'Adjust', 'Test again'],
  },

  workflow: {
    kicker: 'The new workflow',
    steps: [
      { label: 'Submit', caption: 'Digital submission' },
      { label: 'Trigger', caption: 'Workflow starts automatically' },
      { label: 'Review', caption: 'Approve / Reject' },
      { label: 'Generate Record', caption: 'Required record generated' },
      { label: 'Centralize', caption: 'One central record' },
      { label: 'Notify', caption: 'Asset Team & employee' },
    ],
    // Count is visual only (it reads as "multiple sites"); no site count is shown on screen.
    sources: { label: 'Site', count: 3, caption: 'Multiple sites' },
    notifyTargets: ['Asset Team', 'Employee'],
  },

  after: {
    progress: [
      'Submitted digitally',
      'Workflow triggered',
      'Reviewed & approved',
      'Record generated',
      'Centralized',
      'Asset Team notified',
      'Employee notified',
    ],
    comparison: {
      beforeLabel: 'Before',
      afterLabel: 'After',
      before: ['Paper', 'Emails', 'Manual follow-ups', 'Manual updates', 'Fragmented records'],
      after: ['Digital submission', 'Automated flow', 'Centralized record', 'Automatic notifications', 'Clean process'],
    },
  },

  impact: {
    kicker: 'Impact',
    waves: [
      ['timeSaved', 'manualSteps', 'processingTime', 'paper'],
      ['sites', 'records', 'errorRisk', 'manualEmails'],
    ],
  },

  human: {
    lines: ['He wasn’t asked to build it.', 'He saw a problem.', 'And found *a better way.*'],
  },

  final: {
    from: 'MANUAL',
    to: 'AUTOMATED',
    lines: ['No previous automation experience.', 'Just *curiosity, ownership,* and *the drive to improve.*'],
  },
};

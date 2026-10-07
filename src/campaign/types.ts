/**
 * Story schema for the "We Found A Better Way" campaign.
 *
 * A story = one employee, one problem, one better way. Every on-screen word lives in a
 * StoryConfig; every impact figure lives in a MetricConfig list. Scene templates read
 * these and never hard-code copy.
 *
 * Copy may wrap words in *asterisks* to set them in the campaign's "human voice"
 * (serif italic) — see RichText.
 */

export type RenderMode = 'final' | 'draft';

export type Campaign = {
  /** Campaign name, used in metadata. */
  name: string;
  /** End-card line, constant across the campaign. */
  endLine: string;
  /** Sector shown on kicker and end card. */
  sector: string;
  /** Story number in the series (1 → "Story 01"). */
  storyNumber: number;
  /** Optional end-card tagline (set to null to hide). */
  tagline: string | null;
  /** Optional approved logo file inside public/ (null = no logo). */
  logo: string | null;
};

export type Employee = {
  /** Display name. Placeholder until approved. */
  name: string;
  /** Role line, e.g. "IT Support". */
  title: string;
  /** Team / sector line. */
  team: string;
  /** Photo path inside public/ (e.g. "employee/story01.jpg"), or null for the silhouette placeholder. */
  photo: string | null;
  /** Point of interest in the photo (0…1), keeps the face framed in every crop. */
  focalPoint: { x: number; y: number };
};

export type RequestCard = {
  title: string;
  meta: string;
  status: string;
};

export type BeforeArtifactKind =
  | 'paperForm'
  | 'signature'
  | 'email'
  | 'followUp'
  | 'systemUpdate'
  | 'files'
  | 'anotherEmail'
  | 'repeat';

export type BeforeStep = {
  /** Label on the step rail, verbatim from the brief. */
  label: string;
  artifact: BeforeArtifactKind;
};

export type Annotation = {
  text: string;
  /** Index of the step the annotation belongs to. */
  step: number;
  /** Extra frames after the step starts. */
  delay?: number;
};

export type BeforeArtifacts = {
  form: { title: string; fields: string[]; signatureLabel: string };
  email: { from: string; to: string; subject: string; preview: string };
  followUp: { subject: string; message: string };
  system: { name: string; title: string; fields: Array<{ label: string; value: string }> };
  files: { title: string; locations: string[]; fileName: string };
  anotherEmail: { subject: string; preview: string };
  repeat: { label: string; sites: string[] };
};

export type Indicator = {
  label: string;
  /** Direction glyph shown before the value. */
  direction?: 'up' | 'down';
  value: string;
};

export type WorkflowStep = {
  label: string;
  caption: string;
};

export type StoryConfig = {
  id: string;
  campaign: Campaign;
  employee: Employee;

  /** Scene 01 — PERSON */
  person: {
    kicker: string;
    request: RequestCard;
    lines: [string, string];
  };

  /** Scene 02 — PROBLEM */
  before: {
    steps: BeforeStep[];
    annotations: Annotation[];
    artifacts: BeforeArtifacts;
  };

  /** Scene 03 — PROBLEM (felt) */
  pain: {
    lines: string[];
    indicators: Indicator[];
  };

  /** Scene 04 — INITIATIVE (the question) */
  question: {
    text: string;
  };

  /** Scene 05 — INITIATIVE (the unexpected part) */
  reveal: {
    lines: [string, string];
    words: string[];
    support: string;
    /** Labels on the learner's sketch drafts behind the words. */
    sketchLabels: string[];
  };

  /** Scene 06 — BETTER WAY (the workflow) */
  workflow: {
    kicker: string;
    steps: WorkflowStep[];
    sources: { label: string; count: number; caption: string };
    notifyTargets: string[];
  };

  /** Scene 07 — BETTER WAY (same moment, after) */
  after: {
    progress: string[];
    comparison: {
      beforeLabel: string;
      afterLabel: string;
      before: string[];
      after: string[];
    };
  };

  /** Scene 08 — IMPACT */
  impact: {
    kicker: string;
    /** Metric ids, in waves. Each wave appears one pop-up at a time. */
    waves: string[][];
  };

  /** Scene 09 — PERSON (human outcome) */
  human: {
    lines: [string, string, string];
  };

  /** Scene 10 — final message */
  final: {
    from: string;
    to: string;
    lines: [string, string];
  };
};

/* ------------------------------------------------------------------ metrics */

export type MetricFormat = 'single' | 'fromTo';

export type MetricConfig = {
  id: string;
  /** Label above the value (rendered uppercase). */
  label: string;
  format: MetricFormat;
  /**
   * Verified value(s). Leave null until the number has been verified by the business.
   * single → { value: '+35%' } · fromTo → { from: '12', to: '3' }
   */
  verified: { value: string } | { from: string; to: string } | null;
  /** Placeholder shown in the draft composition while unverified. Null = no number expected. */
  placeholder: { value: string } | { from: string; to: string } | null;
  /** Qualitative wording shown in the final render while unverified. */
  fallback: string;
  /** Optional direction glyph. */
  direction?: 'up' | 'down';
};

export type ResolvedMetric =
  | { id: string; label: string; status: 'verified' | 'placeholder'; kind: 'single'; value: string; direction?: 'up' | 'down' }
  | { id: string; label: string; status: 'verified' | 'placeholder'; kind: 'fromTo'; from: string; to: string; direction?: 'up' | 'down' }
  | { id: string; label: string; status: 'qualitative'; kind: 'text'; value: string; direction?: 'up' | 'down' };

/* ----------------------------------------------------------------- timeline */

/** The ten beats of the campaign storytelling DNA. */
export type SceneId =
  | 'person'
  | 'before'
  | 'pain'
  | 'question'
  | 'reveal'
  | 'workflow'
  | 'after'
  | 'impact'
  | 'human'
  | 'final';

export type TimelineScene = {
  id: SceneId;
  /** Composition id used when the scene is previewed on its own. */
  previewId: string;
  durationInFrames: number;
  /** Cross-dissolve from the previous scene (frames). Ignored for the first scene. */
  transitionIn: number;
};

export type Timeline = {
  scenes: TimelineScene[];
};

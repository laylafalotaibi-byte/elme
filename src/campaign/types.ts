/**
 * Story schema for the "We Found A Better Way" campaign.
 *
 * A story = one employee, one problem, one better way. Every on-screen word lives in a
 * StoryConfig; every impact figure lives in a MetricConfig list; every timing lives in a
 * Timeline. Scene templates read these and never hard-code copy.
 *
 * Copy may wrap words in *asterisks* to set them in the campaign's "human voice"
 * (Newsreader italic) — see RichText. Use it sparingly (≤ 3 moments per film).
 */

export type RenderMode = 'final' | 'draft';

export type Campaign = {
  /** Campaign name, used in metadata. */
  name: string;
  /** End-card line, constant across the campaign. */
  endLine: string;
  /** Sector shown on the end card. */
  sector: string;
  /** Story number in the series (1 → "Story 01"). */
  storyNumber: number;
  /** Optional end-card tagline (null hides it). */
  tagline: string | null;
  /** Optional approved logo file inside public/ (null = no logo). */
  logo: string | null;
};

export type Employee = {
  /** Display name — null until approved (the final film then shows no name; the draft shows a placeholder). */
  name: string | null;
  /** Role line, e.g. "IT Support". */
  title: string;
  /** Optional team line (null hides it). */
  team: string | null;
  /**
   * Photo path inside public/ (e.g. "employee/story01.jpg"), or null for the silhouette
   * placeholder. Spec: landscape, ≥ 3840 px wide, at his own desk, window light, looking
   * at his screen (not the lens), negative space on the right.
   */
  photo: string | null;
  /** Point of interest in the photo (0…1), keeps the face framed in every crop. */
  focalPoint: { x: number; y: number };
};

/** Small system labels used by the draft composition and shared UI. */
export type UiStrings = {
  namePlaceholder: string;
  photoPlaceholder: string;
  toVerify: string;
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
  /** Step name, verbatim from the brief (shown as a small caption on its artefact). */
  label: string;
  artifact: BeforeArtifactKind;
};

/**
 * Prop text on the BEFORE artefacts. This is ADDED MICROCOPY (not in the brief): keep it
 * generic, never put names, dates, counts or product names on props, and have it approved.
 */
export type BeforeArtifacts = {
  form: { title: string; fields: string[]; signatureLabel: string };
  email: { to: string; subject: string; preview: string };
  followUp: { subject: string; message: string };
  system: { name: string; title: string; fields: Array<{ label: string; value: string }>; tag: string };
  records: { buckets: string[]; fileName: string };
  anotherEmail: { subject: string; preview: string };
  /** Uncounted tag marking that the same process restarts at another site. */
  siteTag: string;
};

export type Indicator = {
  label: string;
  /** Direction glyph shown before the value. */
  direction?: 'up' | 'down';
  value: string;
};

export type WorkflowStep = {
  label: string;
  /** Optional sub-label (Story 01 uses it only for REVIEW: "Approve / Reject"). */
  caption?: string;
};

export type AudioCue = {
  /** Scene and local frame the cue is locked to. */
  scene: SceneId;
  frame: number;
  /** File in public/ (royalty-free). null = not supplied yet. */
  file: string | null;
  volume?: number;
  /** What the cue is, e.g. "soft notification tick". */
  note: string;
};

export type StoryConfig = {
  id: string;
  campaign: Campaign;
  employee: Employee;
  ui: UiStrings;

  /** Scene 01 — PERSON: an ordinary day, the request arrives. */
  person: {
    request: RequestCard;
    lines: [string, string];
  };

  /** Scene 02 — PROBLEM: the old process, repeating. */
  before: {
    steps: BeforeStep[];
    /** Floating annotation pop-ups, verbatim from the brief. */
    annotations: string[];
    artifacts: BeforeArtifacts;
  };

  /** Scene 03 — PROBLEM, felt. */
  pain: {
    lines: [string, string, string];
    indicators: Indicator[];
  };

  /** Scene 04 — INITIATIVE: the question. */
  question: {
    text: string;
  };

  /** Scene 05 — INITIATIVE: the unexpected part. */
  reveal: {
    lines: [string, string];
    words: string[];
    support: string;
  };

  /** Scene 06 — BETTER WAY: the workflow he built. */
  workflow: {
    steps: WorkflowStep[];
    sitesLabel: string;
    notifyTargets: string[];
  };

  /** Scene 07 — BETTER WAY: the same moment, after. */
  after: {
    status: string;
    comparison: {
      beforeLabel: string;
      afterLabel: string;
      before: string[];
      after: string[];
    };
  };

  /** Scenes 06 + 08 — IMPACT: metric ids in the order they appear. */
  impact: {
    /** Pinned in Scene 06's final reveal. */
    inWorkflow: string[];
    /** Scene 08, one at a time, at most two on screen. */
    sequence: string[];
  };

  /** Scene 09 — PERSON: the human outcome. */
  human: {
    lines: [string, string, string];
  };

  /** Scene 10 — sign-off. */
  final: {
    from: string;
    to: string;
    lines: [string, string];
  };

  /** Optional sound (off until files are supplied). */
  audio: {
    music: string | null;
    musicVolume: number;
    cues: AudioCue[];
  };
};

/* ------------------------------------------------------------------ metrics */

export type MetricFormat = 'single' | 'fromTo';

type Verified = ({ value: string } | { from: string; to: string }) & {
  /** Who verified the figure / where it comes from. Required to publish a number. */
  source: string;
};

export type MetricConfig = {
  id: string;
  /** Label shown with a verified number (and with the [X] placeholder in the draft). */
  label: string;
  format: MetricFormat;
  /** Verified value(s) + source. Leave null until the number has been verified. */
  verified: Verified | null;
  /** Placeholder shown in the draft composition while unverified. Null = no number expected. */
  placeholder: { value: string } | { from: string; to: string } | null;
  /**
   * What the final film shows while unverified: approved qualitative wording, with a label
   * only where label and wording agree (e.g. RECORDS · Centralized). label null = value only.
   */
  fallback: { label: string | null; value: string };
  /** Optional direction glyph for the fallback (e.g. ↓ Reduced). */
  direction?: 'up' | 'down';
};

export type ResolvedMetric =
  | { id: string; label: string | null; status: 'verified' | 'placeholder'; kind: 'single'; value: string; direction?: 'up' | 'down' }
  | { id: string; label: string | null; status: 'verified' | 'placeholder'; kind: 'fromTo'; from: string; to: string; direction?: 'up' | 'down' }
  | { id: string; label: string | null; status: 'qualitative'; kind: 'text'; value: string; direction?: 'up' | 'down' };

/* ----------------------------------------------------------------- timeline */

/** The ten scene templates. */
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

/** The campaign storytelling DNA. */
export type DnaBeat = 'PERSON' | 'PROBLEM' | 'INITIATIVE' | 'BETTER WAY' | 'IMPACT';

export type TimelineScene = {
  id: SceneId;
  beat: DnaBeat;
  /** Composition id used when the scene is previewed on its own. */
  previewId: string;
  durationInFrames: number;
  /** How the scene enters: a hard cut (default) or a short cross-dissolve of N frames. */
  transitionIn: { type: 'cut' } | { type: 'fade'; frames: number };
};

export type Timeline = {
  scenes: TimelineScene[];
};

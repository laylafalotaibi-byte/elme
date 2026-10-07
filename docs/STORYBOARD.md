# Story 01 — Storyboard

**Campaign:** We Found A Better Way · Corporate Technology
**Story:** Device handover & asset registration
**Hero:** a junior IT Support employee (name, title and photo are placeholders in `src/stories/story01/story.config.ts`)
**Format:** 1920×1080 · 16:9 · 30 fps · ≈72 s (2,173 frames)
**Arc:** PERSON → PROBLEM → FRUSTRATION → QUESTION → LEARNING → SOLUTION → BEFORE/AFTER → IMPACT
**Campaign DNA:** PERSON → PROBLEM → INITIATIVE → BETTER WAY → IMPACT

> The employee is the hero. The automation is the enabler.
> The problem is the process, never the person.

All copy below is taken verbatim from the brief. No metric values are invented: every
number is an editable placeholder (`[X]`) that falls back to approved qualitative wording
until a verified value is supplied (see *Metric pop-up* in `DESIGN_SYSTEM.md`).

---

## Timeline at a glance

Scenes are joined with short cross-dissolves (12–20 frames), so each scene overlaps
the previous one slightly. Durations live in `src/stories/story01/timeline.ts`.

| #  | Scene                 | DNA         | World        | Global start | Length | Feeling                      |
|----|-----------------------|-------------|--------------|--------------|--------|------------------------------|
| 01 | The Person            | PERSON      | Soft dark    | 0:00.0       | 6.0 s  | Normal day, quiet            |
| 02 | Before Automation     | PROBLEM     | Dark, dense  | 0:05.6       | 9.5 s  | Repetitive, fragmented       |
| 03 | The Pain              | PROBLEM     | Dark, slowed | 0:14.4       | 8.5 s  | Heavy, reflective            |
| 04 | The Question          | INITIATIVE  | Black void   | 0:22.4       | 5.5 s  | Stillness, clarity           |
| 05 | The Unexpected Part   | INITIATIVE  | Dark → warm  | 0:27.4       | 9.0 s  | Surprise → curiosity         |
| 06 | Building the Solution | BETTER WAY  | Dark → light | 0:35.9       | 8.0 s  | Order emerging               |
| 07 | After Automation      | BETTER WAY  | Light        | 0:43.4       | 7.0 s  | Calm, controlled             |
| 08 | Impact                | IMPACT      | Light        | 0:49.9       | 7.5 s  | Confident, measured          |
| 09 | The Human Outcome     | PERSON      | Light, warm  | 0:56.9       | 5.5 s  | Personal, proud (not loud)   |
| 10 | Final Message + End   | BETTER WAY  | Dark ↔ light | 1:01.9       | 10.5 s | Resolve, campaign signature  |

Total ≈ 72.4 s.

---

## Recurring visual anchors

1. **The Portrait** — an editorial portrait frame of the employee (photo slot). Until a
   real, approved photo is dropped in, a soft back-lit studio silhouette stands in. The
   portrait is how we "return to the same employee" in Scenes 01, 02, 03, 05, 07, 08, 09.
2. **The Workspace** — the process lives as floating UI artefacts in a shallow depth
   field around the portrait: the handover form, the signature, emails, follow-ups,
   the System 800 update window, scattered files. In BEFORE they pile up and overlap;
   in AFTER they collapse into one aligned flow.
3. **The Request** — the same "New device handover request" notification opens
   Scene 01 and Scene 07. Same trigger, different experience.

---

## Scene 01 — The Person (0:00 · 180 f)

**Purpose:** meet him on an ordinary day; nothing is wrong yet.

| Local frames | Picture | Copy |
|---|---|---|
| 0–30 | Fade up from black on a soft graphite backdrop. The portrait card sits left of centre; very slow camera push-in (1.00 → 1.04 over the scene). Small campaign kicker top-left. | `STORY 01 — CORPORATE TECHNOLOGY` (mono kicker) |
| 20–45 | Name plate settles under the portrait. | `[Employee Name]` · `IT Support · Corporate Technology` |
| 40–70 | A single notification glides in beside the portrait, orange signal dot pulses once. | `New device handover request` · `Device delivery · Asset registration` |
| 75–118 | Large line rises from a mask, left-aligned in the right column. | **"Another device handover."** |
| 118–180 | First line dims to 35 %; second line rises beneath it. The word *manual* is set in the serif italic. | **"Another manual process."** |

**Camera:** single, slow push. **Motion:** calm — this is the "normal" baseline.

---

## Scene 02 — Before Automation (0:05.6 · 285 f)

**Purpose:** feel the repetition. The workspace fills up around him.

The portrait shrinks to the centre of the frame. A thin **step rail** runs along the
bottom edge and highlights the current step; each step drops its artefact into the space
around him. Artefacts overlap, sit at small rotations (±3°) and on three depth planes
(back planes slightly blurred).

| Local frames | Step on rail | Artefact that appears |
|---|---|---|
| 0–30   | Paper Form | Paper "Device Handover Form" sheet (Employee / Device / Serial No. / Site / Date / Signature lines) |
| 30–60  | Signature | A signature stroke draws itself on the form's signature line |
| 60–90  | Email | Email card — To: Asset Team · "Device handover — signed form attached" |
| 90–120 | Follow-up | Reply card "Re: Device handover" + a short "Any update on this?" ping |
| 120–150 | Manual System Update | "System 800" window, fields filled in by a typing cursor |
| 150–175 | File / Record | Files split across three places: Email attachments · Shared folder · Local files |
| 175–200 | Another Email | "Fwd: Re: Device handover" card |
| 200–285 | Repeat | The rail loops back to *Paper Form*; the artefact set duplicates — more paper, more emails, more notifications, more follow-ups — offset and denser. Slow push-in; the employee is now surrounded. |

**Annotation chips** (premium UI annotations, mono, small, with a hairline leader):
`Manual` (f 20) · `Paper-Based` (f 45) · `Multiple Follow-ups` (f 105) · `Repeated Daily` (f 205) ·
`High Manual Effort` (f 230) · `Risk of Human Error` (f 250).

**Tone guardrails:** no comedy, no exaggerated chaos, no sad face. The person stays composed;
the *process* is what multiplies.

---

## Scene 03 — The Pain (0:14.4 · 255 f)

**Purpose:** slow down and name the cost.

The clutter freezes and drifts back out of focus (blur + dim). Motion slows to the
longest easing in the film. Lines stack editorially, each previous line dimming.

| Local frames | Copy |
|---|---|
| 10–75   | "The task wasn't difficult." |
| 75–150  | "But repeating it every day was costing time." |
| 150–255 | "And every manual step created another opportunity for error." |

**Pain indicators** (same metric pop-up component, *before* intent), staggered from f 110:

```
┌ TIME        ┌ EFFORT          ┌ RISK          ┌ RECORDS
↓ Lost to     ↑ Manual          ↑ Human error   Fragmented
  repetitive    handling
  work
```

---

## Scene 04 — The Question (0:22.4 · 165 f)

**Purpose:** the turning point. Give it room.

| Local frames | Picture | Copy |
|---|---|---|
| 0–40 | The last of the clutter dissolves piece by piece; a tight, still crop of the portrait remains — he stops and looks at the process differently. Thin cinematic letterbox bars ease in. | — |
| 40–80 | Portrait fades to near-black. The question rises word by word, centred, in the large serif. | **"Why are we still doing this manually?"** |
| 80–165 | Hold. Only a 2 % scale drift. Nothing else moves. | — |

This is the quietest, most spacious frame of the film.

---

## Scene 05 — The Unexpected Part (0:27.4 · 270 f)

**Purpose:** reveal who solved it — and that he had to learn first.

| Local frames | Picture | Copy |
|---|---|---|
| 0–70 | Portrait returns (left), name plate visible. Line centred-right. | "He was a junior IT Support employee." |
| 70–135 | Pause, then the reveal; an orange hairline underlines *no previous automation experience*. | **"He had no previous automation experience."** |
| 135–205 | Background warms (graphite → warm dark). Four words land one by one, ~15 f apart. Behind them, faint sketch-like flow drafts draw, get crossed out, and redraw — learning, testing, iteration. | **LEARN. EXPERIMENT. BUILD. IMPROVE.** |
| 205–270 | Supporting line beneath. | "He started learning what he needed to solve the problem himself." |

**Guardrail:** no code walls, no "expert developer" tropes. Drafts look like a learner's
sketches: dashed boxes, a crossed-out attempt, a "test" tick after a few tries.

---

## Scene 06 — Building the Solution (0:35.9 · 240 f)

**Purpose:** the mess becomes a clean workflow the viewer understands in seconds.

| Local frames | Picture |
|---|---|
| 0–50 | The BEFORE artefacts (form, emails, window, files) fly in from the edges, straighten, shrink and snap into six evenly spaced nodes. Background cross-fades from graphite to warm paper. |
| 50–150 | A single orange line draws left → right through the nodes; each label appears as the line reaches it. |
| 150–240 | A small token travels the whole path in one smooth move. Several site nodes on the left feed lines into SUBMIT; at NOTIFY the line branches to *Asset Team* and *Employee*. |

```
SITE ─┐
SITE ─┼─▶ SUBMIT ─▶ TRIGGER ─▶ REVIEW ─▶ GENERATE RECORD ─▶ CENTRALIZE ─▶ NOTIFY ─┬─ Asset Team
SITE ─┘                         approve / reject                                  └─ Employee
```

Node sub-labels (facts from the brief only): *Digital submission* · *Workflow starts
automatically* · *Approve / Reject* · *Required record generated* · *One central record* ·
*Asset Team & employee*. Site nodes carry no count — they read as "multiple sites".

Kicker: `THE NEW WORKFLOW`.

---

## Scene 07 — After Automation (0:43.4 · 210 f)

**Purpose:** the same employee, the same request — a completely different experience.

| Local frames | Picture |
|---|---|
| 0–90 | Exact layout of Scene 01, now in the light world: portrait left, the same "New device handover request" notification arrives. Instead of paperwork, a single aligned column completes calmly: `Submitted digitally ✓` → `Workflow triggered ✓` → `Reviewed & approved ✓` → `Record generated ✓` → `Centralized ✓` → `Asset Team notified ✓` · `Employee notified ✓`. |
| 90–210 | A vertical divider sweeps in from the right to form a split screen. **BEFORE** (left, graphite, crowded, faster jittery motion) vs **AFTER** (right, paper, whitespace, still). |

Split-screen lists (verbatim from the brief):

| BEFORE | AFTER |
|---|---|
| Paper | Digital submission |
| Emails | Automated flow |
| Manual follow-ups | Centralized record |
| Manual updates | Automatic notifications |
| Fragmented records | Clean process |

---

## Scene 08 — Impact (0:49.9 · 225 f)

**Purpose:** business impact that complements the story without dominating it.

The portrait sits centre-left, light world, lots of whitespace. Metric pop-ups appear one
at a time around him with hairline leaders, in two calm waves (never all at once):

| Wave | Local frames | Metric | Placeholder (draft) | Final render until verified |
|---|---|---|---|---|
| A | 10  | TIME SAVED      | `[X]%` / `[X] hrs`       | Less Manual Work |
| A | 30  | MANUAL STEPS    | `[X] → [X]`              | Reduced Repetitive Work |
| A | 50  | PROCESSING TIME | `[Before] → [After]`     | Faster Processing |
| A | 70  | PAPER           | —                        | Reduced |
| B | 115 | SITES           | `[X] connected`          | One Consistent Process |
| B | 135 | RECORDS         | —                        | Centralized |
| B | 155 | ERROR RISK      | —                        | Reduced |
| B | 175 | MANUAL EMAILS   | —                        | Reduced |

Wave A recedes (fade to 0) as wave B arrives, keeping the frame uncluttered.
Values are driven by `src/stories/story01/metrics.config.ts`; the
`Story01-MetricsDraft` composition shows the `[X]` slots with a *TO VERIFY* tag.

---

## Scene 09 — The Human Outcome (0:56.9 · 165 f)

**Purpose:** land the real story — a person who chose to improve things.

Portrait large and warm, slow push-in to a closer crop. Copy left-aligned beside it.

| Local frames | Copy |
|---|---|
| 8–55   | "He wasn't asked to build it." |
| 55–68  | *(pause)* |
| 68–105 | "He saw a problem." |
| 105–165 | "And found *a better way.*" — *a better way* in the serif italic, orange. |

---

## Scene 10 — Final Message & End Card (1:01.9 · 315 f)

| Local frames | Picture | Copy |
|---|---|---|
| 0–60 | Graphite frame with **MANUAL** in large type. An orange hairline sweeps across; behind it the frame turns to paper and the word becomes **AUTOMATED**. | MANUAL → AUTOMATED |
| 60–110 | Centred. | "No previous automation experience." |
| 110–175 | *(pause)* then | "Just *curiosity, ownership,* and *the drive to improve.*" |
| 175–315 | **End card** (see `DESIGN_SYSTEM.md`): kicker, campaign line, story meta, optional tagline. Hold ≥ 3.5 s. | `WE FOUND A BETTER WAY.` · `Story 01` · `Corporate Technology` · *Small improvements can create meaningful impact.* |

---

## Fact fidelity checklist

- The hero is a **junior IT Support** employee with **no previous automation experience**
  who learned independently and built the workflow. He was **not asked** to build it.
- BEFORE shows only the listed pains: paper forms, physical signatures, repetitive emails,
  manual System 800 updates, follow-ups with the Asset Team, records spread across emails
  and files, repetition across multiple sites.
- AFTER shows only the listed capabilities: digital submission, automated triggering,
  review with approval/rejection, automatic record generation, centralized storage,
  consolidated multi-site data, notifications to the Asset Team and to the employee,
  fewer manual emails, less paper, better consistency and accountability.
- AFTER does **not** claim System 800 is updated automatically, does not claim paper is
  eliminated, and shows no product logos.
- No number appears on screen unless it is entered as a verified value in
  `metrics.config.ts`.

# Story 01 — Storyboard (v2)

**Campaign:** We Found A Better Way · Corporate Technology
**Story:** Device handover & asset registration
**Hero:** a junior IT Support employee (name / photo are config placeholders — `src/stories/story01/story.config.ts`)
**Format:** 1920×1080 · 16:9 · 30 fps · **75.0 s (2,250 frames)**
**Arc:** PERSON → PROBLEM → FRUSTRATION → QUESTION → LEARNING → SOLUTION → BEFORE/AFTER → IMPACT
**Campaign DNA:** PERSON → PROBLEM → INITIATIVE → BETTER WAY → IMPACT

> The employee is the hero. The automation is the enabler. The problem is the process, never the person.

**Copy rule.** All *story* copy (lines, annotations, indicators, step names, before/after
items, end card) is verbatim from `docs/BRIEF.md`. A small amount of *prop microcopy* is
added (the request notification, email subjects, form field names, the after status line);
it is generic, lives in `story.config.ts`, and is flagged there for approval.
**Number rule.** No number appears on screen unless it is entered as verified (with a source)
in `metrics.config.ts`. Props carry no dates, times, counts, badges or multipliers.

> **What changed from v1** (after an adversarial review for fact fidelity, creative direction
> and timing): the hero is no longer a portrait card but is filmed with a shot / reverse-shot
> grammar; light (not a dark/light theme switch) carries the emotional arc; hard cuts replace
> blanket dissolves; Scene 07 is a match cut of Scene 01 instead of lists; the workflow is his
> own sketch line, vertical as the brief writes it; System 800 never appears in AFTER; REVIEW is
> visibly a human decision; every line now holds for its reading time, which brings the film to
> exactly 75 s.

---

## Timeline at a glance

Durations live in `src/stories/story01/timeline.ts` (validated in code: 60–75 s).

| #  | Scene | DNA | Light | Start | Length | In |
|----|-------|-----|-------|-------|--------|----|
| 01 | The Person | PERSON | normal day | 0:00.0 | 6.0 s (180 f) | — |
| 02 | Before Automation | PROBLEM | day → dimming | 0:06.0 | 7.5 s (225 f) | cut |
| 03 | The Pain | PROBLEM | dimmed | 0:13.5 | 8.0 s (240 f) | cut |
| 04 | The Question | INITIATIVE | dark → black | 0:21.5 | 6.5 s (195 f) | cut |
| 05 | The Unexpected Part | INITIATIVE | black → warm key | 0:28.0 | 10.0 s (300 f) | cut |
| 06 | Building the Solution | BETTER WAY | warm daylight | 0:38.0 | 7.0 s (210 f) | cut |
| 07 | After Automation | BETTER WAY | Scene 01's light, warmer | 0:45.0 | 7.0 s (210 f) | cut (match) |
| 08 | Impact | IMPACT | warm daylight | 0:52.0 | 5.7 s (170 f) | cut |
| 09 | The Human Outcome | PERSON | warm daylight | 0:57.3 | 7.0 s (210 f) | 10 f dissolve |
| 10 | Final Message + End Card | IMPACT (sign-off) | dark → warm → ink | 1:04.0 | 11.0 s (330 f) | 10 f dissolve |

Σ 2,270 f − 20 f of dissolve overlap = **2,250 f = 75.0 s**.

**Reading rule.** After a line is fully revealed it holds ≥ 1.5 s + 0.25 s per word (key moments
longer). Nothing is mid-reveal at a cut or inside a dissolve. One new thing at a time.

---

## Shot grammar (what the camera can see)

| Shot | Component | Use |
|---|---|---|
| **Workspace** (over-the-shoulder, wide) | `Workspace` | His shoulder and the back of his head out of focus in the foreground, his monitor sharp, the desk edge below. The room's light is the story's light. |
| **Screen insert** | `ScreenInsert` | What he sees on screen: the digital half of the process. |
| **Desk insert** (top-down) | `DeskInsert` | The paper half: forms, signatures, the pen, the phone. |
| **Hero shot** (medium / close profile) | `HeroShot` | Him, looking right towards his screen, lit by it. Text sits in the space he is looking into. |

Cutting between him and what he sees (shot / reverse-shot) lets a still figure *look at*,
*stop* and *decide* without an actor. His **cursor** (`Cursor`) is his hand on screen.

---

## Scene 01 — The Person · 180 f · light `normalDay`

An ordinary morning. Nothing is wrong yet. No titles, no name plate (they are held back for Scene 05).

| f | Picture | Copy |
|---|---|---|
| 0–36 | **Workspace**, normal daylight, slow drift. A calm screen; his cursor moves a little — he is working. | — |
| 36–56 | The request notification slides onto his screen (top right); a soft flash of screen light on his shoulder; the cursor drifts towards it. | *(prop)* New device handover request · Device delivery · Asset registration |
| 56 | **Cut → Hero shot** (medium), he is reading. | |
| 60–84 → 118 | Line rises into the space in front of him, holds. | **Another device handover.** |
| 118–130 | Pause. Nothing new enters. | |
| 130–152 → 180 | Line 1 dims to 40 %; line 2 rises beneath it and holds. Roman type — no emphasis. | **Another manual process.** |

---

## Scene 02 — Before Automation · 225 f · light `normalDay → dimmed`

The old process, felt as rhythm. No progress rail: each step's name is a small caption on its
own artefact. Cuts between screen, desk and workspace. The room darkens as the work piles up.

| f | Shot | Step (caption) | Artefact |
|---|---|---|---|
| 0–22 | Desk | Paper Form | The paper handover form slides onto the desk |
| 22–44 | Desk (close) | Signature | A signature draws itself; the pen |
| 44–66 | Screen | Email | Email to the Asset Team, sent |
| 66–88 | Screen | Follow-up | "Any update on this?" lands at the screen edge |
| 88–118 | Screen | Manual System Update | The System 800 window; one field typed by hand (1 char / 2 f) |
| 118–136 | Screen | File / Record | The record splits between two places: *Emails* · *Files* |
| 136–150 | Screen | Another Email | Fwd: Device handover |
| 150–215 | Workspace → fast inserts | Repeat | Match cut back to the same request arriving. The loop replays faster (≈ 8 f, then ≈ 4 f per step) and the layers **stack instead of clearing** — more paper, more emails, more notifications, more follow-ups. Each new cluster carries an uncounted **Site** tag: the same process restarting elsewhere. |
| 215–225 | Workspace | — | Held: he is surrounded; the room is dim; the screen is the only light. |

**Annotation pop-ups** (verbatim, title case, persisting, never covering the step being shown):
`Paper-Based` (12) · `Manual` (50) · `Multiple Follow-ups` (80) · `High Manual Effort` (108) ·
`Risk of Human Error` (126) · `Repeated Daily` (166).

Motion: faster entrances, springy settles, overlaps, small rotations on paper. Never comic,
never per-frame jitter. He stays composed; the process multiplies.

---

## Scene 03 — The Pain · 240 f · light `dimmed`

Slower. One line at a time, each on its own shot; indicators pinned to real objects, never in a row.

| f | Picture | Copy / indicators |
|---|---|---|
| 0–62 | Desk insert: one single paper form, in focus. Simple. | **The task wasn’t difficult.** (in 8) |
| 62–140 | The same form, now one of a stack of identical forms; emails stacked behind. | **But repeating it every day was costing time.** (in 66) · `TIME ↓ Lost to repetitive work` pinned to the stack (100) · `EFFORT ↑ Manual handling` pinned to the paper pile (114) |
| 140–156 | **Cut → Hero shot** (close): he looks at it. Silence. | — |
| 156–240 | Screen insert: the System 800 field being typed; the two record places. | **And every manual step created another opportunity for error.** (in 158) · `RISK ↑ Human error` pinned to the typed field (194) · `RECORDS Fragmented` pinned to the two record places (206) |

At most two indicators on screen at once (earlier ones leave as later ones arrive).

---

## Scene 04 — The Question · 195 f · light `dimmed → dark → black`

The turning point. The strongest, quietest frame of the film.

| f | Picture | Copy |
|---|---|---|
| 0–36 | The frozen clutter quietly re-aligns: rotated chaos straightens into a grid of identical, repeating cycles. The pile becomes a pattern — he sees the process differently. | — |
| 36–72 | **Hard cut → Hero shot** (close), held still. Only grain moves. He stops. | — |
| 72–86 | Fade to near-black. | — |
| 86–112 | The question rises as one thought (line by line, not word by word), centred, in the human voice (Newsreader Light). | **Why are we still doing this manually?** |
| 112–195 | Hold. Nothing moves except grain. No camera move on the type. | |

---

## Scene 05 — The Unexpected Part · 300 f · light `black → warm key`

The reveal: who solved it — and that he had to learn first.

| f | Picture | Copy |
|---|---|---|
| 0–12 | Black. | — |
| 12–40 | **Hero shot** (medium) racks from soft to sharp; rim light only. The documentary **lower-third** lands — the first and only time his name and role appear. | lower-third: *[name]* · IT Support |
| 24–50 → 92 | Line rises in the space in front of him. | **He was a junior IT Support employee.** |
| 92–108 | Picture and line fade to near-black. Silence. | — |
| 108–135 → 190 | Alone on a clean frame, one size larger, no underline. As it holds, a warm key light slowly rises on him behind the type. | **He had no previous automation experience.** |
| 190–196 | Cut → **Screen insert** in warm light: his notes, a blank canvas. | |
| 196 → 300 | Supporting line settles at the bottom and stays. | He started learning what he needed to solve the problem himself. |
| 204 | His cursor hovers, reads. | **LEARN.** |
| 228 | A dashed draft of a path is drawn — then crossed out. | **EXPERIMENT.** (replaces) |
| 252 | A second draft; the dashed line turns solid. | **BUILD.** (replaces) |
| 276 → 300 | The line straightens. | **IMPROVE.** (replaces, holds) |

The four words appear one at a time, each replacing the last, set at 76 px — learning, not a
motivational poster. Drafts look like a learner's sketches: no code, no expert tropes.

---

## Scene 06 — Building the Solution · 210 f · light `warm daylight`

His line becomes the workflow. Vertical, as the brief writes it.

| f | Picture | Copy |
|---|---|---|
| 0–24 | The straightened line from Scene 05 turns orange and swings vertical; the room fills with warm daylight. | — |
| 24–40 | Three or four hairlines converge from off-frame into the top of the line (no count). | `Sites` (small) |
| 40–150 | The camera tracks down the line. One step at a time, each word arriving as the line reaches it and leaving as the next arrives. As the line passes, old artefacts fold into it (the paper form flattens into a point at SUBMIT; scattered files merge into one at CENTRALIZE; the email collapses at NOTIFY). The System 800 window never becomes a step. | **SUBMIT** (40) · **TRIGGER** (58) · **REVIEW** (76) with `Approve / Reject` — a click resolves it to *Approve* (≈ 96): a human decision · **GENERATE RECORD** (108) · **CENTRALIZE** (126) · **NOTIFY** (144) → branches to `Asset Team` / `Employee` (148–160) |
| 150–176 | One pull-back reveals the whole line, all six steps, in a single gesture. | |
| 162 / 174 → 210 | Impact pop-ups pinned to the process: SITES at the convergence, RECORDS at CENTRALIZE. | `Multiple sites · One Consistent Process` · `Records · Centralized` |

No travelling token, no kicker, no sub-labels besides Approve / Reject. No product styling.

---

## Scene 07 — After Automation · 210 f · light `afterDay`

**Match cut of Scene 01**: same framing, same request, same moment. A different experience.

| f | Picture | Copy |
|---|---|---|
| 0–18 | Workspace, exactly Scene 01's framing, a little warmer. The same request arrives in the same place. | — |
| 18–40 | One click. A single calm status resolves on screen. No tick cascade. | *(prop)* Submitted digitally |
| 40–56 | Stillness. A clear desk, a quiet screen. Nothing happens — the absence is the point. | — |
| 56–74 | One orange line wipes across the same shot → split screen: **left** = Scene 02's final cluttered frame (dim), **right** = this calm frame. | `Before` · `After` (small) |
| 74–194 | Chips pinned to real objects, alternating sides, one at a time (≈ 12 f apart), earlier chips dimming. Two separate groups — no row pairing, no arrows between sides. | Left: Paper · Emails · Manual follow-ups · Manual updates · Fragmented records — Right: Digital submission · Automated flow · Centralized record · Automatic notifications · Clean process |
| 194–210 | Hold. | |

Left side motion: a restless slow drift and periodic interruptions (≤ 4 px, ≥ 20 f period).
Right side: still. System 800 appears only on the BEFORE side.

---

## Scene 08 — Impact · 170 f · light `warm daylight`

A calm AFTER workspace; pop-ups pinned to process objects (never to his body), one at a time,
at most two on screen.

| f | Metric (final film, until verified) | Pinned to |
|---|---|---|
| 10 | `┌ Less Manual Work` *(TIME SAVED [X]% / [X] hrs)* | the single item on his screen |
| 36 | `┌ Reduced Repetitive Work` *(MANUAL STEPS [X] → [X])* | the flow line |
| 62 | `┌ Faster Processing` *(PROCESSING TIME [Before] → [After])* | the end of the flow line |
| 88 | `┌ PAPER ↓ Reduced` | the clear desk |
| 114 | `┌ MANUAL EMAILS ↓ Reduced` | the quiet notification |
| 140 → 170 | `┌ Better Accuracy` *(ERROR RISK)* | the record |

Brackets show what the **MetricsDraft** composition displays instead: label + `[X]` slot +
*TO VERIFY*. A verified value (with source) replaces both.

---

## Scene 09 — The Human Outcome · 210 f · light `warm daylight`

Back to him. Hero shot, slow push from medium to close.

| f | Copy |
|---|---|
| 14–40 → 78 | **He wasn’t asked to build it.** |
| 78–96 | *(pause — nothing new)* |
| 96–114 → 140 | **He saw a problem.** |
| 140–165 → 210 | **And found *a better way.*** — *a better way* in the human voice, orange; holds ≥ 1.5 s. |

---

## Scene 10 — Final Message & End Card · 330 f

| f | Picture | Copy |
|---|---|---|
| 10–55 | Image callback: the old pile (dim) labelled **MANUAL**; one orange hairline sweeps across — behind it the pile collapses into the single orange line in warm light and the word becomes **AUTOMATED**. | MANUAL → AUTOMATED |
| 58–80 → 103 | Centred. | **No previous automation experience.** |
| 103–117 | *(pause)* | |
| 117–150 → 190 | Centred. Only *the drive to improve* in the human voice. | **Just curiosity, ownership, and *the drive to improve.*** |
| 190–225 | **End card** builds (rule → line word by word → the orange full stop lands last → tagline → meta). | **WE FOUND A BETTER WAY.** · *Small improvements can create meaningful impact.* · Story 01 · Corporate Technology |
| 225–330 | Still hold (3.5 s). | |

---

## Fact fidelity checklist (enforced in review)

- Hero: a **junior IT Support** employee, **no previous automation experience**, learned
  independently, built the workflow, **was not asked** to build it.
- BEFORE shows only the brief's pains: paper forms, physical signatures, repetitive emails,
  manual System 800 updates, follow-ups with the Asset Team, records spread across emails and
  files, repetition across multiple sites.
- AFTER shows only the brief's capabilities: digital submission, automated triggering, review
  with approval/rejection (a human decision), automatic record generation, centralized storage,
  consolidated multi-site data, notifications to the Asset Team and to the employee, fewer
  manual emails, less paper, better consistency and accountability.
- **System 800 never appears in any AFTER frame.** Paper is *reduced*, not eliminated. No
  clocks or "seconds later" compression that would imply a processing time.
- No product names, logos or recognisable product UI (Outlook, Forms, Excel, Power Automate).
- No number on screen unless verified with a source in `metrics.config.ts`.

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
| 09 | The Human Outcome | PERSON | warm daylight | 0:57.3 | 7.0 s (210 f) | 10 f dip (warm paper) |
| 10 | Final Message + End Card | IMPACT (sign-off) | dark → warm → ink | 1:04.0 | 11.0 s (330 f) | 10 f dip (ink) |

Σ 2,270 f − 20 f of dip overlap = **2,250 f = 75.0 s**.

**Reading rule.** From the moment a line starts to reveal, it stays on screen for at least
(words ÷ 3.5) s + 0.4 s; the key moments (the Question, "no previous automation experience",
"a better way", the end card) hold longer. Nothing is mid-reveal within 10 frames of a cut or
inside a dissolve. One new thing at a time.

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

> Frame numbers below are the beats as built. The source of truth is each scene's timing
> module: `src/scenes/person/timing.ts` (01, 07), `src/scenes/before/timing.ts` (02–04),
> `src/scenes/workflow/timing.ts` (05–06), `src/scenes/final/timing.ts` (08–10).

## Scene 01 — The Person · 180 f · light `normalDay`

An ordinary morning. Nothing is wrong yet. No titles, no name plate (held back for Scene 05).

| f | Picture | Copy |
|---|---|---|
| 0–34 | **Workspace**, normal daylight. A calm screen; his cursor moves a little — he is working. | — |
| 34–52 | The request slides onto his screen (top right); a soft flash of screen light on his shoulder; the cursor drifts to it. | *(prop)* New device handover request · Device delivery · Asset registration |
| 52 | **Cut → Hero shot** (medium): he is reading. | |
| 56 → 118 | Line rises into the space in front of him and holds alone (the pause). | **Another device handover.** |
| 118 → 180 | Line 1 steps back to 40 %; line 2 rises beneath it. Roman type. | **Another manual process.** |

---

## Scene 02 — Before Automation · 225 f · light `normalDay → dimmed`

The old process, felt as rhythm. No progress rail: each step's name is a small caption on its
own artefact, built in 8 f from the cut. The room darkens as the work piles up.

| f | Shot | Step (caption) | Artefact · annotation |
|---|---|---|---|
| 0–22 | Desk | Paper Form | The paper form slides in and is filled in · `Paper-Based` pinned to the form |
| 22–44 | Desk (close) | Signature | A signature draws itself; the pen |
| 44–66 | Screen | Email | Email to the Asset Team, sent · `Manual` pinned to the email |
| 66–88 | Screen | Follow-up | "Any update on this?" lands at the screen edge · `Multiple Follow-ups` pinned to it |
| 88–113 | Screen | Manual System Update | The System 800 window; the last field typed by hand · `Risk of Human Error` pinned to the field |
| 113–133 | Screen | File / Record | The record is split into two places: *Emails* · *Files* · `High Manual Effort` pinned to the System 800 window behind |
| 133–153 | Screen | Another Email | Fwd: Device handover |
| 153–175 | Workspace | Repeat | Match cut: the same request lands again in the same place, with an uncounted **Site** tag · `Repeated Daily` pinned to the cascade |
| 175–196 | Fast inserts (7 f) | — | Another site's form signed; an email; a follow-up — layers stack instead of clearing |
| 196–215 | Workspace | — | The last loop at 2–4 f per step; all six annotations land again on their objects around his screen |
| 215–225 | Workspace | — | Held: he is surrounded; the room is dim; the screen is the only light. |

Annotations are born inside the shot they describe and leave on its cut — never a screen-fixed
HUD. Motion stays sober: no per-frame jitter, every move under ≈ 50 px per frame.

---

## Scene 03 — The Pain · 240 f · light `dimmed`

Slower. One line at a time; indicators pinned to real objects, at most two on screen.

| f | Picture | Copy / indicators |
|---|---|---|
| 0–48 | Desk insert: one single paper form, in focus. | **The task wasn’t difficult.** (in 2) |
| 48–140 | The camera pulls back: the same form tops a stack of identical forms; emails stacked on his phone; a handled pile. | **But repeating it every day was costing time.** (in 52) · `TIME ↓ Lost to repetitive work` on the stack (85) · `EFFORT ↑ Manual handling` on the pile (98) |
| 140–150 | **Cut → Hero shot** (close): he looks at it. Silence. | — |
| 150–240 | His monitor in the dark room: the System 800 field typed by hand, with a hesitation; the two record places. | **And every manual step created another opportunity for error.** (in 150) · `RISK ↑ Human error` on the field (188) · `RECORDS Fragmented` on both places (198) |

---

## Scene 04 — The Question · 195 f · light `dimmed → dark → black`

The turning point. The strongest, quietest frame of the film.

| f | Picture | Copy |
|---|---|---|
| 0–31 | The frozen clutter quietly re-aligns into a grid of identical, repeating cycles as the view tips back — the pile becomes a pattern. | — |
| 32–72 | **Hard cut → Hero shot** (close), held still. He stops. | — |
| 72–86 | Fade to near-black. | — |
| 86 → 195 | The question rises line by line, centred, in the human voice (Newsreader Light), lands by ≈ 108 and holds. No camera move on the type. | **Why are we still doing this manually?** |

---

## Scene 05 — The Unexpected Part · 300 f · light `black → warm key`

| f | Picture | Copy |
|---|---|---|
| 6–32 | **Hero shot** (close) fades up and racks from soft to sharp; rim light only. The lower-third lands (only once a name is approved; the draft shows the placeholder). | lower-third: *[name]* · IT Support |
| 34 → 96 | After a held silence, line 1 — one step larger than Scene 01's lines. | **He was a junior IT Support employee.** |
| 96–106 | Picture and line fade to near-black. | — |
| 108 → 190 | Alone, one size larger again. A warm key light rises on him behind the type from 120. | **He had no previous automation experience.** |
| 190 | Cut → **Screen insert** in warm light: his notes on a quiet paper surface. | |
| 191 → | Supporting line, held into Scene 06. | He started learning what he needed to solve the problem himself. |
| 195 | His cursor reads his notes. | **LEARN.** |
| 219 | A dashed draft is drawn — then crossed out. **244–262: cut to him** (close, warm key): he has seen it fail. | **EXPERIMENT.** (held across the intercut) |
| 265 | Back on screen: a second draft; the dashes close. | **BUILD.** |
| 289 → | He straightens the line. | **IMPROVE.** |

Each word replaces the last and holds ≥ 21 f. The drafts are a learner's sketches: no code.

---

## Scene 06 — Building the Solution · 210 f · light `warm daylight`

His line becomes the workflow. Vertical, as the brief writes it.

| f | Picture | Copy |
|---|---|---|
| 0–40 | Scene 05's notes clear; the straightened line turns orange and swings vertical; the room fills with warm daylight. | — |
| 14–52 | Hairlines converge from off-frame into the top of the line (no count). | `Sites` (small) |
| 43 → 138 | The camera follows the line down. Each step arrives as a large word, then settles into a small label on the line that stays. Old artefacts fold into it as it passes: the (unsigned) paper form at SUBMIT, the two record places merging into one at CENTRALIZE, the email at NOTIFY. | **SUBMIT** (43) · **TRIGGER** (58) · **REVIEW** (73) — his hand enters, `Approve / Reject` rises, a click resolves it to *Approve* (90): a human decision · **GENERATE RECORD** (108) · **CENTRALIZE** (123) · **NOTIFY** (138) → `Asset Team` / `Employee` (148) |
| 138–172 | One pull-back reveals the whole line, every step already read. | |
| 156 / 166 → 210 | Impact pop-ups pinned to the process. | `Multiple sites · One Consistent Process` · `Records · Centralized` |

The System 800 window never becomes a step. No travelling token, no stepper rings.

---

## Scene 07 — After Automation · 210 f · light `afterDay`

**Match cut of Scene 01**: same framing, same request, same moment — a different experience.

| f | Picture | Copy |
|---|---|---|
| 0–18 | Exactly Scene 01's framing, a little warmer. The same request lands in the same place. | — |
| 18 | One click: the request is submitted. | *(prop)* Submitted digitally |
| 24–58 | His line runs down to a small review node; the options rise; **he decides** — a click on *Approve* (58). Approval is never automatic. | `Approve / Reject` → *Approve* |
| 58–82 | Only then does the line continue and the one record get generated. | — |
| 82–92 | Stillness. A quiet screen, a clear desk with one sheet. | — |
| 92–110 | One orange line wipes across the same shot → split screen: **left** = Scene 02's final cluttered frame, **right** = this calm frame. | `Before` · `After` (104) |
| 108–188 | Chips arrive in pairs (one per side, 17 f apart), pinned to real objects — two separate groups, never aligned or linked. | Left: Paper · Emails · Manual follow-ups · Manual updates · Fragmented records — Right: Digital submission · Automated flow · Centralized record · Automatic notifications · Clean process |
| 192–208 | The split folds away: chips fade, the line slides off left, the calm frame fills the screen. | |

System 800 appears only on the BEFORE side.

---

## Scene 08 — Impact · 170 f · light `afterDay → warmDay`

Continues from the exact frame Scene 07 ends on (same shot, card, line, record, desk sheet);
the light warms a little and the picture drifts towards his screen. Pop-ups hang in room space —
on the wall beside the monitor and on the desk — never on the screen glass or on him, with a
hairline to the object they describe. One every 22 f, at most two on screen, all gone by 158.

| f | Metric (final film, until verified) | Pinned to |
|---|---|---|
| 10 | `┌ Less Manual Work` *(TIME SAVED [X]% / [X] hrs)* | the request |
| 32 | `┌ Reduced Repetitive Work` *(MANUAL STEPS [X] → [X])* | his line |
| 54 | `┌ Faster Processing` *(PROCESSING TIME [Before] → [After])* | his line, through the approval |
| 76 | `┌ PAPER ↓ Reduced` | the single desk sheet |
| 98 | `┌ MANUAL EMAILS ↓ Reduced` | the request's quiet status |
| 120 | `┌ Better Accuracy` *(ERROR RISK)* | the record |

Brackets show what the **MetricsDraft** composition displays instead: label + `[X]` slot +
*TO VERIFY*. A verified value (with a source) replaces both.

---

## Scene 09 — The Human Outcome · 210 f · light `warm daylight` · enters on a 10 f dip to warm paper

Back to him. Hero shot, slow push from medium towards close; a warm key rises as the last line lands.

| f | Copy |
|---|---|
| 14 → | **He wasn’t asked to build it.** (holds alone — the pause) |
| 90 → | **He saw a problem.** |
| 132 → 200 | **And found *a better way.*** — *a better way* in the human voice, orange. |

---

## Scene 10 — Final Message & End Card · 330 f · enters on a 10 f dip to ink

| f | Picture | Copy |
|---|---|---|
| 12–24 | The old pile (dim), labelled **MANUAL** at display size. | MANUAL |
| 24–48 | One orange hairline sweeps across; behind it the pile folds into his single line in warm light — one form stays, squared into a single sheet — and the word becomes **AUTOMATED**. | AUTOMATED |
| 74 → | Centred. | **No previous automation experience.** |
| 104 → 190 | After a pause; only *the drive to improve* in the human voice. | **Just curiosity, ownership, and *the drive to improve.*** |
| 190 → 330 | Cut to ink. **End card** builds in ≈ 33 f (rule → line word by word → the orange full stop lands last → tagline → meta), then holds still. | **WE FOUND A BETTER WAY.** · *Small improvements can create meaningful impact.* · Story 01 · Corporate Technology |

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

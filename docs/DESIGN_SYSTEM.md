# We Found A Better Way — Campaign Design System

This system is shared by every story in the Corporate Technology campaign. Story 01
(device handover & asset registration) is the first implementation. A new story should
only need a new config folder — not new design decisions.

---

## 1. Principles

1. **The person is the hero; technology is the enabler.** Every scene that explains the
   process is bracketed by a scene that returns to the person.
2. **Make them feel it, don't explain it.** Density, rhythm and light carry the BEFORE /
   AFTER contrast; copy stays short.
3. **The problem is the process, never the person.** The employee is always composed and
   dignified. Clutter multiplies around him, not on him.
4. **Editorial, not presentation.** Big type, real negative space, one accent colour,
   hairlines instead of boxes. No icons where a word works.
5. **Honest numbers.** No figure appears on screen unless it was entered as verified.

---

## 2. Colour

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0B0C0E` | Void (Scene 04), deepest shadows |
| `graphite` | `#15171A` | BEFORE world background |
| `graphiteRaised` | `#1E2125` | BEFORE artefacts, cards on dark |
| `warmDark` | `#1C1814` | Learning / curiosity (Scene 05) |
| `paper` | `#F3F1EC` | AFTER world background |
| `paperRaised` | `#FBFAF7` | AFTER surfaces, the paper form sheet |
| `stone` | `#E4DFD6` | Hairlines and rules on light |
| `textOnDark` | `#F2F0EB` | Primary type on dark |
| `mutedOnDark` | `#8D9199` | Secondary type on dark |
| `textOnLight` | `#141516` | Primary type on light |
| `mutedOnLight` | `#6F6A62` | Secondary type on light |
| **`accent`** | **`#F26B21`** | Elm-inspired orange — signal dots, the workflow line, emphasis words, the end-card full stop |
| `accentSoft` | `rgba(242,107,33,0.14)` | Accent washes (rare) |

**Accent budget:** orange covers < 3 % of any frame. It marks *meaning* (a signal, the
better way, the line that connects), never decoration. No gradients, no glows, no neon.

---

## 3. Typography

Three voices, all free/open-licensed (SIL OFL) and bundled locally in `public/fonts`:

| Voice | Family | Role |
|---|---|---|
| **Narrator** | Inter Tight (400 / 500 / 600) | Story lines, headlines, labels |
| **Human** | Instrument Serif (regular + italic) | His inner voice and mindset: the Question, *manual*, *a better way*, *curiosity, ownership* |
| **System** | JetBrains Mono (400 / 500) | Process UI, kickers, annotations, metric labels |

| Style | Family | Size / line-height | Tracking | Use |
|---|---|---|---|---|
| `displayXL` | Instrument Serif | 148 / 1.02 | −0.02 em | The Question |
| `displayL` | Inter Tight 600 | 112 / 1.0 | −0.035 em | MANUAL / AUTOMATED, end-card line, LEARN… |
| `displayM` | Inter Tight 500 | 76 / 1.06 | −0.03 em | Narrative lines |
| `bodyL` | Inter Tight 400 | 40 / 1.25 | −0.01 em | Supporting lines |
| `title` | Inter Tight 500 | 30 / 1.2 | −0.01 em | Name plate, workflow labels |
| `body` | Inter Tight 400 | 22 / 1.35 | 0 | Artefact content |
| `kicker` | JetBrains Mono 500 | 17 / 1.2 | 0.16 em, UPPERCASE | Section / story labels |
| `label` | JetBrains Mono 500 | 14 / 1.2 | 0.14 em, UPPERCASE | Annotations, metric labels |

**Inline emphasis:** text in config may wrap words in `*asterisks*`; the `RichText`
component renders them in the Human voice (serif italic), optionally in accent orange.

**Reveal:** lines rise 0.6 em from behind a mask; words stagger 3–4 frames.
No typewriter effects on story lines (typing is reserved for the System 800 window).

---

## 4. BEFORE vs AFTER visual language

| | **BEFORE** (Scenes 01–04) | **AFTER** (Scenes 06–10) |
|---|---|---|
| Light | Soft dark graphite, cool, low key | Warm paper, high key, airy |
| Density | Many layers, overlapping artefacts, duplicates | One layer, generous whitespace |
| Geometry | Small rotations (±3°), uneven offsets, three depth planes with back-plane blur | Strict grid, no rotation, aligned baselines |
| Motion | Faster entrances (10–14 f), springy settles, interruptions from several directions, stagger 4–6 f | Slow, decisive entrances (24–36 f), single axis, stagger 8–12 f |
| Lines | Leader lines that cross and tangle | One continuous orange line |
| Notifications | Arrive from different edges, stack and overlap | Arrive in one column, resolve with a tick |
| Camera | Gradual push-in as pressure builds | Locked off or a slow, even drift |
| Accent | Only as alert signal dots | As the path of the better way |

Scene 05 (Learning) is the bridge: warm-dark, sketch lines, curiosity.

---

## 5. Employee visual treatment

**Component:** `EmployeePortrait` (+ `NamePlate`).

- **Photo slot.** `employee.photo` in the story config points to a file in `public/`
  (e.g. `employee/story01.jpg`). Swap the file, re-render — nothing else changes.
  `employee.focalPoint` keeps the face in frame across crops.
- **Treatment (with photo).** Monochrome base, gentle contrast lift, film grain, soft
  vignette. BEFORE scenes render it cooler and lower-key; AFTER scenes warmer and brighter.
  No beauty filters, no cut-outs, no stock look — a documentary portrait, not an ad.
- **Placeholder (no photo).** A back-lit studio silhouette: a soft-edged head-and-shoulders
  shape against a lit backdrop, rim-lit from one side, with grain. Anonymous and
  respectful; never cartoon, 3-D or illustrated features. The draft composition labels it
  `PHOTO PLACEHOLDER`.
- **Crops.** `portrait` (4:5 card), `close` (tighter, used in Scenes 04 and 09). Same
  source image, different framing; camera moves never exceed 6 % scale.
- **Name plate.** Name in `title`, role and team in `label` mono.
- **Language.** Copy refers to him as "he"; name and title live in config only.

---

## 6. Motion style

| Token | Value | Use |
|---|---|---|
| `ease.out` | `bezier(0.16, 1, 0.3, 1)` | Default entrance (expo-out) |
| `ease.inOut` | `bezier(0.65, 0, 0.35, 1)` | Camera, wipes, morphs |
| `ease.in` | `bezier(0.7, 0, 0.84, 0)` | Exits |
| `spring.calm` | damping 200 | AFTER settles, no overshoot |
| `spring.busy` | damping 16, stiffness 160 | BEFORE notification pops (tiny overshoot) |
| `dur.before` | 12 f | BEFORE entrances |
| `dur.after` | 28 f | AFTER entrances |
| `dur.line` | 22 f | Text line reveal |
| `dur.transition` | 12–20 f | Scene cross-dissolves |

- **Camera:** every scene wraps content in a `Camera` with slow scale/translate; foreground,
  midground and background layers move at different rates for depth (parallax).
- **Transitions:** cross-dissolves; a single orange-line wipe for MANUAL → AUTOMATED and
  the split-screen divider. Nothing else — no spins, zooms-through or flashy wipes.
- **Finish:** a subtle animated film grain and a light vignette over the whole film.
- **Pacing:** fastest in Scene 02, slowest in Scenes 03–04, steady and confident after.

---

## 7. Metric pop-up component

**Component:** `MetricPopup`. Driven by `metrics.config.ts`.

```
┌ TIME SAVED          ← corner bracket + mono label (14 px, tracked)
  +XX%                ← value in Inter Tight 52 px
  [ TO VERIFY ]       ← only in the draft composition, when unverified
```

**Anatomy:** hairline corner bracket · optional orange signal dot · label · value
(`single`, `fromTo` with `→`, or qualitative text) · optional direction glyph (↑ ↓) and
caption · optional hairline leader to an anchor point. No card background, no dashboard
chrome; max width ≈ 380 px.

**Data model (per metric):**

```ts
{
  id: 'timeSaved',
  label: 'TIME SAVED',
  verified: null,                // e.g. { value: '+35%' } — only when verified
  placeholder: '[X]% / [X] hrs', // shown in the draft composition
  fallback: 'Less Manual Work',  // shown in the final render until verified
}
```

**Display rule:** `verified` value → shown. Otherwise the final composition shows the
qualitative `fallback`; the `…-MetricsDraft` composition shows the `placeholder` with a
dashed underline and a `TO VERIFY` tag so reviewers can see exactly what is missing.

**Animation:** bracket draws (8 f) → label fades in (10 f) → value rises from a mask
(14 f) → leader line draws (16 f). Exit: fade with 8 px drift. Pop-ups are always
sequenced, never all at once.

**Intents:** `before` (pain indicators — glyphs ↑/↓ in accent, on dark) and `after`
(impact — on light).

---

## 8. Campaign end-card system

**Component:** `EndCard`, shared across stories.

```
STORY 01 — CORPORATE TECHNOLOGY                         ← kicker (mono)

WE FOUND A
BETTER WAY.                                             ← campaign line, the full stop in orange

Small improvements can create meaningful impact.        ← optional tagline (serif italic)
───────────────────────────────────────────────
01                                     Corporate Technology
```

- **Constant across the campaign:** campaign line, typography, colour, layout, motion.
- **Per story:** story number, sector, optional tagline, optional logo (`logo` slot,
  empty by default — add an approved brand file if required).
- **Motion:** rule draws → kicker fades → campaign line rises word by word → orange full
  stop lands last → tagline and meta fade. Hold ≥ 3.5 s.

---

## 9. Strictly avoided

AI glow · neon gradients · robots · brains · neural networks · holograms · generic AI or
"digital transformation" imagery · stock people · cartoon or 3-D characters · icon soup ·
PowerPoint diagrams · dense text · bullet walls · technical screenshots · product logos
(Microsoft Forms, Excel, Outlook, Power Automate) · confetti · cheesy success animations ·
excessive transitions.

---

## 10. Building the next story

1. Copy `src/stories/story01` to `src/stories/storyNN`.
2. Edit `story.config.ts` (employee, copy, process steps, before/after lists) and
   `metrics.config.ts` (labels, placeholders, verified values).
3. Adjust `timeline.ts` if the copy is longer or shorter.
4. Register the composition in `src/Root.tsx`.

The scene templates (`PersonScene`, `ProcessBeforeScene`, `StatementScene`,
`RevealScene`, `WorkflowScene`, `BeforeAfterScene`, `ImpactScene`, `HumanScene`,
`FinalScene`) read everything from config, so the storytelling DNA —
PERSON → PROBLEM → INITIATIVE → BETTER WAY → IMPACT — carries over automatically.

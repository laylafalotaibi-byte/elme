# We Found A Better Way — Campaign Design System (v2)

Shared by every story in the Corporate Technology campaign. Story 01 (device handover &
asset registration) is the first implementation. A new story should need a new config
folder — not new design decisions.

---

## 1. Principles

1. **The person is the hero; technology is the enabler.** Every stretch of process is
   bracketed by a return to him. The workflow is drawn as *his* line.
2. **Film, not slides.** Shots, not layouts: shot / reverse-shot, inserts, match cuts. No
   progress rails, no bullet lists, no dashboards, no diagrams that explain themselves.
3. **Make them feel it.** Density, rhythm and light carry BEFORE vs AFTER; copy stays short.
4. **The problem is the process, never the person.** He is always composed and dignified.
5. **Honest numbers.** No figure on screen unless verified, with a source.

---

## 2. Colour

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0B0C0E` | Near-black (Scene 04), end card |
| `graphite` / `graphiteRaised` | `#15171A` / `#1E2125` | Dark UI surfaces |
| `paper` / `paperRaised` | `#F3F1EC` / `#FBFAF7` | Warm light surfaces, the paper form |
| `textOnDark` / `mutedOnDark` | `#F2F0EB` / `#8D9199` | Type on dark |
| `textOnLight` / `mutedOnLight` | `#141516` / `#6F6A62` | Type on light |
| **`accent`** | **`#F26B21`** | Elm-inspired orange |

Room colours are not fixed tokens: they are computed from the **light state** (§3).

**Accent budget:** orange covers < 3 % of any frame and always *means* something: a signal
(the request), his line (the better way), the end-card full stop, the lower-third rule.

**Light, not glow.** No coloured glows, neon or decorative gradients. Neutral or warm-white
light falloff (radial/linear, ≤ 15 % opacity, unsaturated) is allowed — and needed — to model
real light: window light, monitor spill, rim light, a warm key.

---

## 3. Light is the emotional arc

Every set piece takes a `Light = { exposure 0…1, warmth 0…1 }` (`src/campaign/light.ts`).
The room, desk, screen spill, rim light and silhouette colours are interpolated from it.

| Scene | Light | Feeling |
|---|---|---|
| 01 | `normalDay` — neutral, mid-key, slightly cool | Everything looks normal |
| 02 | `normalDay → dimmed` as the work piles up | The process closes in |
| 03 | `dimmed` — the screen is the main light | Heavy, reflective |
| 04 | `dark → black` | Stillness |
| 05 | `black → warmKey` — a warm key light rises on him at "no previous automation experience" | *His* decision brings the light |
| 06, 08, 09 | `warmDay` | Clarity |
| 07 | `afterDay` — Scene 01's light, a little warmer and brighter | Same place, different experience |
| 10 | dim pile → warm line → ink end card | Resolve |

---

## 4. BEFORE vs AFTER language

| | **BEFORE** (02–03, left half of 07) | **AFTER** (06–09) |
|---|---|---|
| Density | Layers that stack instead of clearing; duplicates; overlap | One thing at a time; generous space |
| Geometry | Small rotations (±3°) on paper, uneven offsets | Aligned, no rotation |
| Motion | Faster entrances (10–14 f), springy settles (`spring.busy`), interruptions from different edges, loop that accelerates (≈ 21 → 8 → 4 f per step) | Slow, decisive (24–36 f), single axis, `spring.calm`, long holds |
| Lines | Leaders that cross | One continuous orange line — his |
| Notifications | Arrive from several edges, pile up | One arrives, resolves once |
| Camera | Cuts get quicker; gentle push as pressure builds | Locked off or one slow, even move |

Never: per-frame random jitter (use seeded `random()` and slow sine drift ≤ 4 px, ≥ 20 f period).

---

## 5. The hero — employee visual treatment

**Shot grammar.** The person is filmed, not framed:

| Shot | Component | What it shows |
|---|---|---|
| Over-the-shoulder | `Workspace` | Foreground: his shoulder and back of head (out of focus). Midground: his monitor (sharp). Bottom: desk edge. |
| Screen insert | `ScreenInsert` | What he sees on screen (1280×800 canvas shared with `Workspace`). |
| Desk insert | `DeskInsert` (+ `Pen`, `Phone`) | His desk from above: paper, signature. |
| Hero shot | `HeroShot` (`medium` / `close`) | His profile looking right, lit by the screen; type sits in the space he looks into (`HERO_TEXT_SAFE`). |
| His hand | `Cursor` | Eased, slightly overshooting moves, hesitations, a click ripple. |

**Photo slot.** Set `employee.photo` (file in `public/employee/`) and `employee.focalPoint`.
Photo spec: landscape, ≥ 3840 px wide, at his own desk, window light, looking at his screen
(not the lens), clear negative space on the right. Treatment follows the light state:
monochrome base, warmth → slight sepia, exposure → brightness, gentle contrast, grain.
No beauty filters, no cut-outs.

**Placeholder.** Until a photo is approved: a soft, back-lit profile silhouette with an organic
(displaced) edge and a thin rim of screen light. Anonymous and respectful — never a cartoon,
3-D character or avatar icon. The draft composition labels it `PHOTO PLACEHOLDER`.

**Name and role** appear once, as a documentary `LowerThird` in Scene 05. With no approved
name (`name: null`), the final film shows only the role; the draft shows `[Employee Name]`.

---

## 6. Typography

Three voices, all SIL OFL, bundled in `public/fonts`:

| Voice | Family | Role |
|---|---|---|
| **Narrator** | Inter Tight 400 / 500 / 600 | Story lines, step words, end card |
| **Human** | Newsreader Light (roman + italic) | Rationed to ≤ 3 moments: the Question, *a better way*, *the drive to improve*, and the end-card tagline |
| **System** | JetBrains Mono 500 | In-world UI only: form fields, System 800, metric labels, lower-third role |

| Style | Spec | Use |
|---|---|---|
| `displayXL` | Newsreader 300 · 128/1.04 · −0.025em | The Question |
| `displayL` | Inter Tight 600 · 112–156/1.0 · −0.035em | MANUAL / AUTOMATED, end-card line |
| `displayM` | Inter Tight 500 · 76/1.06 · −0.03em | Story lines, LEARN… IMPROVE, workflow steps |
| `bodyL` | Inter Tight 400 · 40/1.25 | Supporting line |
| `caption` | Inter Tight 500 · 26 | Annotation pop-ups, step captions (title case as written) |
| `label` / `kicker` | JetBrains Mono 500 · 20 · 0.12–0.14em · UPPERCASE | Metric labels, small in-world labels |
| `micro` | JetBrains Mono 500 · 12 | Prop texture nobody needs to read |

**Legibility floor:** anything the viewer must read is ≥ 20 px (it must survive a 960 px
player). **Reveal:** lines rise from behind a mask (`MaskedReveal`, `WordReveal`); display
type is never inside a scaling camera (no shimmer). No typewriter effects on story copy.

---

## 7. Motion & cutting

| Token | Value |
|---|---|
| `ease.out` | `bezier(0.16, 1, 0.3, 1)` — entrances |
| `ease.inOut` | `bezier(0.65, 0, 0.35, 1)` — camera, wipes, morphs |
| `ease.in` | `bezier(0.7, 0, 0.84, 0)` — exits |
| `spring.calm` / `spring.busy` | damping 200 / damping 16, stiffness 160 |
| `dur.line` | 22 f · word stagger 4 f |

**Cutting:** hard cuts by default, on action. **Match cuts** for 01 ↔ 07 and for the loop
restarts in 02. Dissolves (≤ 10 f) only where time passes (into 09 and 10). The **orange-line
wipe** is reserved for two moments: the Scene 07 split and Scene 10's MANUAL → AUTOMATED.

**Timing rules:** text appears only after any incoming dissolve and is fully revealed ≥ 10 f
before a cut; from the start of its reveal a line stays on screen ≥ (words ÷ 3.5) s + 0.4 s,
key moments longer; one new element at a time.

**Finish:** subtle film grain (four seeded tiles, changing every 3 frames, ≤ 5 % opacity) and a
light vignette over the whole film.

---

## 8. Annotation pop-ups (BEFORE)

`Annotation`: a hairline pill with a small orange signal dot and the brief's words exactly as
written (title case, 22 px Inter Tight). Optional hairline leader to the object it describes.
Springy entrance. They accumulate in Scene 02 — that accumulation *is* the multiplication.

---

## 9. Metric pop-up component

`MetricPopup` (impact) and `IndicatorPopup` (pain), driven by `metrics.config.ts`.

```
┌ TIME SAVED            ← hairline corner bracket + mono label (20 px)
  +[X]%                 ← value, Inter Tight 56 px (single · from → to · qualitative)
  ┄┄┄┄ [TO VERIFY]      ← draft composition only, when the value is a placeholder
```

**Display rule.**
1. `verified` (value + `source`) → label + number.
2. Unverified, draft composition → label + `[X]` placeholder + *TO VERIFY*.
3. Unverified, final film → the approved qualitative `fallback`, **with a label only where
   label and wording agree** (`RECORDS · Centralized`, `PAPER ↓ Reduced`); otherwise the
   wording stands alone (`┌ Less Manual Work`). A quantitative label is never shown over a
   qualitative value.

**Anatomy:** bracket draws → label → value rises from a mask → optional leader draws (whole
build ≤ 24 f). `align="right"` mirrors it (┐, right-aligned) for pop-ups sitting to the left of
their object. No card background, no dashboard chrome, max width ≈ 520 px. Pop-ups are pinned
to *process objects* (never to his body), sequenced one at a time, at most two on screen.

---

## 10. Campaign end card

`EndCard` — identical for every story; only story number, sector, tagline and logo change.

```
WE FOUND A
BETTER WAY.                                  ← full stop in accent orange, lands last

Small improvements can create meaningful impact.   ← optional tagline (Newsreader Light italic)
──────────────────────────────────────────────────
Story 01                              Corporate Technology
```

Build ≤ 35 f (rule → words → full stop → tagline → meta), then a still hold ≥ 3.5 s.
Optional approved `logo` replaces the sector on the right; none by default.

---

## 11. Sound (optional slot)

`story.audio` holds a music bed and cue sounds (royalty-free files, none bundled). Cues are
locked to scene frames: request tick (01), quickening ticks (02), hard silence (04), a single
sustained note on "no previous automation experience" (05), the bed builds (06–09) and
resolves on the end-card full stop.

---

## 12. Strictly avoided

AI glow · neon gradients · robots · brains · neural networks · holograms · generic AI or
"digital transformation" imagery · stock people · cartoon or 3-D characters · icon soup ·
PowerPoint diagrams · progress steppers · dense text · bullet walls · technical screenshots ·
**product names, logos, brand colours or recognisable product UI** (Outlook reading panes,
Forms question cards, Excel grids, Power Automate card-and-connector flows) · numbers, dates,
unread badges or "×3" multipliers on props · confetti · cheesy success animations ·
tick-cascades · excessive transitions.

---

## 13. Building the next story

1. Copy `src/stories/story01` → `src/stories/storyNN`; edit `story.config.ts`,
   `metrics.config.ts`, `timeline.ts` (validated to 60–75 s).
2. Register it in `src/stories/index.ts` and `src/Root.tsx`.

The ten scene templates (`src/scenes/*`) read everything from config, so the DNA —
PERSON → PROBLEM → INITIATIVE → BETTER WAY → IMPACT — carries over. A story with a different
process supplies different artefacts and steps; the set pieces, light arc, typography, pop-ups
and end card stay the same.

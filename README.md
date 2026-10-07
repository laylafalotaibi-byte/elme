# We Found A Better Way — Corporate Technology campaign

Cinematic, story-driven internal campaign films built with **React + Remotion**.
Each story follows the campaign DNA: **PERSON → PROBLEM → INITIATIVE → BETTER WAY → IMPACT**.

**Story 01** — a junior IT Support employee with no previous automation experience who turned a
paper-and-email device handover / asset registration process into an automated workflow.

- Brief (source of truth): [`docs/BRIEF.md`](docs/BRIEF.md)
- Storyboard: [`docs/STORYBOARD.md`](docs/STORYBOARD.md)
- Design system: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)

## Quick start

```bash
npm install
npm run dev            # Remotion Studio — preview the film, each scene, and the component lab
npm run render         # → out/story-01-we-found-a-better-way.mp4 (final)
npm run render:draft   # → out/story-01-metrics-draft.mp4 (shows [X] metric placeholders)
```

Specs: 1920×1080 · 16:9 · 30 fps · ≈72 s. Fonts (SIL OFL) are bundled in `public/fonts`.
No paid assets, stock footage or product logos are used.

## Editing Story 01

| What | Where |
|---|---|
| All on-screen copy | `src/stories/story01/story.config.ts` |
| Employee name, title, photo | `employee` in `story.config.ts` (photo file goes in `public/employee/`) |
| Impact metrics (placeholders / verified values) | `src/stories/story01/metrics.config.ts` |
| Scene durations and cross-dissolves | `src/stories/story01/timeline.ts` |

**Metrics are never invented.** Each metric has `verified: null` until a verified value is
entered. The final film shows approved qualitative wording (e.g. "Less Manual Work"); the
`Story01-MetricsDraft` composition shows the `[X]` slots tagged *TO VERIFY*.

## Project structure

```
src/
  campaign/        design tokens, motion, fonts, types, story context, metric resolver
  components/      typography, portrait, metric pop-up, annotations, UI artefacts, end card, fx, camera
  scenes/          the ten reusable scene templates (one per storytelling beat)
  stories/story01/ copy, metrics and timeline for Story 01
  StoryFilm.tsx    assembles a story's scenes with cross-dissolves + film finish
  Root.tsx         compositions: Story01, Story01-MetricsDraft, per-scene previews, component lab
scripts/stills.mjs render review stills / contact sheets
```

## Adding Story 02

1. Copy `src/stories/story01` → `src/stories/story02` and edit the three config files.
2. Register it in `src/stories/index.ts` and add its compositions in `src/Root.tsx`.

## Rendering in a container without a downloadable Chrome

Set `REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell` before `npm run render`
(the stills script also auto-detects a Playwright headless shell).

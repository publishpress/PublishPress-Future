Release Runner is the local web page (`composer deploy`, `127.0.0.1:9876`) that takes a PublishPress plugin from `development` to a published release. It replaces the GitHub issue checklist. The page has one job: show the step that needs you now, what it will run, and whether it goes public. Use the components through `window.RR` and the tokens through `tokens.css`. The token names match the app's existing `styles.css`, so `scripts/release-runner/ui` can switch to `tokens.css` without renaming anything.

## Content fundamentals

- **Speak in the runner's own terms.** Steps, gates, phases, packages. Use step labels from the presets, phrased as the action or the check: "Create release-4.11.0 from development", "composer check:release".
- **Show the command.** Before anything publishes, show the exact shell command it will run (`command` in `ConfirmPublishDialog`), and keep the CLI form of the current step's action under its row (`cli`). Developers trust what they can read.
- **Versions have no "v".** Write `4.11.0` and `4.11.0-rc.2`. The tag must match the plugin `Version` header, so the UI never teaches the wrong form. Issue titles keep their template wording ("…for Release v4.11.0").
- **Sentence case, second person, no exclamation marks, no emoji.** "Waiting for PT-BR translation review", not "Waiting on translators! 🌍".
- **Name the consequence on publish steps:** "Tags master and triggers the deploy workflow. This cannot be undone from the runner."
- **Security releases:** never show vulnerability details in the UI or the log copy. Say "Security release" and no more.

## Visual foundations

**Colour.** The page is warm stone neutrals (`surface-page`, `surface-raised`, `surface-sunken`) with one brand colour, `pp-purple`, used for the current step, the progress fill and primary buttons. `pp-amber` is the shared PublishPress plugin accent (Future, Cart). In the app it appears only as `log-warn`. Its tinted cousins, `status-waiting-bg` and `status-waiting-fg`, mark a gate that needs a person. `pp-lavender` and `pp-indigo` come from the Cart artwork and are for brand moments only (the cover, marketing), never for UI states.

**Status is never colour alone.** Every state pairs a token with an icon and a word:

| State | Tokens | Icon | Word |
| --- | --- | --- | --- |
| pending | `status-pending-*` | dot | Pending |
| running | `status-running-*` | spinner | Running |
| waiting | `status-waiting-*` | hand | Needs you |
| done | `status-done-*` | check | Done |
| skipped | `status-skipped-*` | skip arrow | Skipped |
| failed | `status-failed-*` | X | Failed |

**Who acts.** `StepTypeTag` labels every row `auto`, `manual` or `confirm`. Confirm steps are the publish boundary. They use the ink-filled `publish` button with a lock, never `pp-purple`, so "next step" and "go public" never look alike. A dashed `PublishBoundary` rule sits right before *Merge into master*, where bare `run` stops.

**Type.** System UI stack (`--font-sans`) and system mono (`--font-mono`), as in the current app: it's a local developer tool and needs no web fonts. Use `title` for the app name, `panel-title` for dialogs and the empty state, `row` for step labels, `small` for instructions, `eyebrow` (uppercase) for phase names, and `badge` for status. Log text is `log` at 13px.

**Space and shape.** A 4px base: `space-xs` 4 · `space-sm` 8 · `space-md` 12 · `space-lg` 16 · `space-xl` 24 · `space-2xl` 32. Radii grow with the container: `radius-sm` for controls and the log, `radius-md` for step rows, `radius-lg` for the header, panel and dialogs, `radius-pill` for pills and badges. Separate surfaces with `border-subtle` hairlines. `shadow-sm` is for the header and `shadow-md` for the floating panel and dialogs.

**Layout.** One page, one column, no router. The `ReleaseHeader` sits on top and is sticky on desktop; on phones it scrolls away. Below it, the phase list (max 52rem wide). There is no side panel: the current step is its own row, outlined in `pp-purple`, with its action buttons in the row and its guide, live log, *Reopen from here* and CLI hint in the expanded body. Only the current step is expanded by default. The chevron is always the rightmost item in a row, after the action buttons.

**The log** is dark in both themes (`log-bg`) so output reads like a terminal. Colour lines by kind with `log-cmd`, `log-ok`, `log-warn`, `log-err` and `log-muted`.

**Focus and states.** Every control gets a solid 2px `focus-ring` outline, offset 2px. It is at least 5.6:1 on every surface in both themes and replaces the old 35% alpha ring. Hover moves fills one step toward `surface-sunken`. Disabled is 45% opacity, with a nearby reason. Inputs use `border-control`, which meets 3:1.

**Motion.** Only the running spinner (stopped under `prefers-reduced-motion`), plus a 150ms fade and 6px rise on dialogs. Nothing animates on its own otherwise.

**Dark theme.** Every token has a dark value. Dark applies under `[data-theme="dark"]` on `<html>`: the server writes it into `index.html` from `dev-workspace-cache/release-runner-ui.json` (the saved choice), else the page follows `prefers-color-scheme`, and `ThemeToggle` in the header switches it. `pp-purple` lightens to `#b3abe6`, so text on it turns dark (`text-inverse`). Status grounds become deep tints with light text.

## Iconography

There is no icon library in the app yet. `RR.Icon` draws a small set of 16px, 2px-stroke, round-cap line glyphs in `currentColor`: check, x, skip, dot, spinner, hand, lock, terminal, play, chevron, alert, shield, reopen, github. They were drawn for this system and are **not** taken from a PublishPress source. If the team adopts a set (Lucide matches the stroke style), swap the paths and keep the names. No emoji.

## Logos

The plugin icons (Future, Cart) are purple squares with an amber glyph and a white wordmark. The runner's UI doesn't show them; it identifies the plugin with the Edition pill and the composer package name.

## Implementation

The app implements this system in `scripts/release-runner/ui/src/`: `styles.css` holds the tokens and component styles (same class names as `components/bundle.css`), and `components.jsx` holds the React components (same names and props as `components/index.d.ts`). The page is one column: the current step's actions, log and footer live in its row (`StepRow`); there is no side panel. The theme is saved in `dev-workspace-cache/release-runner-ui.json` via `POST /api/ui-prefs`. The engine reports the `running` and `waiting` statuses, each step's `type`, and the resolved command through `/api/status`.

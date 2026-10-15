# Release Runner design system

Reference for agents and developers changing the release runner page (`scripts/release-runner/ui`). It was exported from the Release Runner design system artifact; the app's `styles.css` and `components.jsx` implement it.

## Read in this order

1. [brand-book.md](brand-book.md): copy rules, colour and status semantics, type, spacing, layout, iconography. Start here.
2. [tokens.json](tokens.json): every token, with light and dark values and a usage note. This is the source of truth for values.
3. [components/index.d.ts](components/index.d.ts): component names and props.
4. `components/<Name>/README.md`: when to use each component and what it needs.

## Rules for changes

- Use tokens by name (`var(--status-waiting-fg)`), never raw hex or pixel values. The names match the custom properties in `scripts/release-runner/ui/src/styles.css`.
- To change a value, edit `tokens.json` first, regenerate [tokens.css](tokens.css), then mirror the change in the app's `styles.css`.
- Status is always icon + word + colour, never colour alone.
- One column, no side panel: the current step's actions, log and footer live in its `StepRow`, and the chevron is always the rightmost item in a row.
- Publish steps (merge to `master`, GitHub release) use the `publish` button variant and `ConfirmPublishDialog`, below `PublishBoundary`.
- Text must keep 4.5:1 contrast on the grounds named in its token's usage note, in both themes.
- Theme: dark values apply under `[data-theme="dark"]` on `<html>`. The server writes the saved theme (`dev-workspace-cache/release-runner-ui.json`) into `index.html`; with none saved the page follows the OS setting. The header `ThemeToggle` switches it and saves via `POST /api/ui-prefs`.

## Files

| Path | What |
| --- | --- |
| `tokens.json` | Tokens: colour (light and dark), type, spacing, radius, shadow |
| `tokens.css` | The tokens as CSS custom properties and type classes, generated from `tokens.json` |
| `components/bundle.css` | Reference component styles (`rr-*` classes) |
| `components/bundle.js` | Reference React components as one classic script that sets `window.RR` |
| `components/<Name>/preview.html` | Live example of each component. Each preview expects `tokens.css`, `bundle.css`, React 18 and `bundle.js` to be loaded first, so they don't render when opened directly |
| `components/Cover/preview.html` | The system's cover image |

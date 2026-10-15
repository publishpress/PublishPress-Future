Switches the page between the light and dark themes.

**Provide:** `onChange(theme)` to save the choice. The app posts it to `/api/ui-prefs`, which writes `dev-workspace-cache/release-runner-ui.json`. The toggle sets `data-theme` on `<html>` itself.

- Put it at the right end of `ReleaseHeader`'s top row, so it shows whether or not a release is in progress.
- It shows a moon in light and a sun in dark, the icon for the theme it switches to, and its `aria-label` names that theme.
- The server stamps the saved theme on `<html>` when it serves `index.html`, so the page paints in it from the start. With nothing saved, an inline script follows `prefers-color-scheme`.

The Start release form: version (validated per preset), preset picker from `runnerPresets`, urgency, and optional beta/rc channel when the preset allows more than one.

**Provide:** `runnerPresets`, `presetMeta`, `defaultPreset` (from `/api/status`), `onStart({ version, urgency, preset, prereleaseChannel })`, and `onCancel`.

- Stable presets: base `MAJOR.MINOR.PATCH` only.
- Prerelease presets: same base version; suffix comes from runner state, not the input field.

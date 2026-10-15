Tells the user who acts on a step: the runner (`auto`), the user (`manual`), or the user with an explicit publish confirm (`confirm`).

**Provide:** `type`, matching `StepDefinition.type` in `presets/types.mjs`.

- Always show it on step rows. It answers "will Run do this for me?" before the user clicks.
- `confirm` is drawn in `text-primary` with a lock, the same signal as the `publish` button.

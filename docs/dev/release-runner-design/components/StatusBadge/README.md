Shows a step's state as an icon plus a word, never colour alone.

**Provide:** `status`: `pending` · `running` · `waiting` · `done` · `skipped` · `failed`. `label` is optional and overrides the word.

- `running` and `waiting` are new. The engine reports `running` while an auto step executes. `waiting` ("Needs you") is shown when a manual or confirm gate stops `run` with exit code 10.
- Inside `StepRow`, the full badge appears only on the current, failed, waiting or running rows. Every other row shows just the coloured dot, so the list stays quiet.
- Done and failed also differ in lightness and icon (check vs X), so they stay readable for colour-blind users.

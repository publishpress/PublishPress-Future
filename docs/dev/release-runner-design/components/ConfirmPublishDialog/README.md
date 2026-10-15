A type-to-confirm dialog for publish steps (merge to master, GitHub release).

**Provide:** `version`, an optional `title`, `description`, and `command`, plus `onConfirm` and `onCancel`.

- The publish button stays disabled until the typed text equals the version exactly. This is the UI version of `run --confirm <step>`.
- Show the exact command the step will run.

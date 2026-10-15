A full-width message for release-level conditions: security urgency, waiting on an external sign-in, or a failed run.

**Provide:** `tone` (`security` · `waiting` · `failed`), `title`, and `children` as one or two sentences.

- Security goes in the header for the whole release. Failed and waiting go above the step list and clear when the state changes.
- Don't use it for step instructions; those belong in the current `StepRow`'s `guide`.

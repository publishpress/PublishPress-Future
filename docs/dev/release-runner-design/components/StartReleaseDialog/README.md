The Start release form: a version with semver validation, urgency, the first package channel, and the read-only edition.

**Provide:** `edition` (from `detectEdition`), an optional starting `version`, `onStart({ version, urgency, channel })`, and `onCancel`. Rendered in place with a scrim; in the app, put the `rr-dialog` inside Radix `Dialog.Content`, or pass `inline={false}` for the dialog alone.

- Reject a "v" prefix and short versions as the user types; the hint shows the branch name that will be created.
- Edition stays read-only, as the spec requires.

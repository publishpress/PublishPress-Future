One checklist step. The current step also carries everything needed to act on it: action buttons in the row, and guide, live log, *Reopen from here* and CLI hint in its body.

**Provide:** `label`, `type`, `status`, `current`, plus:
- `guide`: the step's instructions (or its confirm/manual message when it has none).
- `note`: from `complete`/`skip --note`. Hide it when the same text is already in the log.
- For the current step only: `actions` (buttons, see below), `log` (a `LogPanel`), `onReopen`, `cli` (the CLI form, e.g. `run --confirm github_release`) and `busy`.
- `open`/`onOpenChange` for controlled use (Radix `Collapsible` in the app), or `defaultOpen`.

Actions by type, all `size="sm"`: `auto` → primary *Run* (*Run again* after a failure; a disabled *Running…* with a spinner while it runs); `manual` → primary *Done* plus ghost *Skip* (no Skip on `github_auth`); `confirm` → primary *Confirm*, or the `publish` button *Publish…* when the step is a publish step, which opens `ConfirmPublishDialog`.

- Order in the row, left to right: status dot, label, type tag, badge, actions, chevron. **The chevron is always the rightmost item.** It mirrors the row's trigger, and the trigger is the accessible control. On phones the actions drop to their own line and the chevron stays at the end of the first.
- Only the current step is expanded by default, and it gets the `pp-purple` outline.
- Skipped labels are struck through and done labels turn secondary.
- Rows without a body have no chevron.

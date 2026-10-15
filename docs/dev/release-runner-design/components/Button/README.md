Triggers one runner action; the variant tells the user how serious that action is.

**Provide:** `variant` (`primary` · `secondary` · `ghost` · `publish` · `link`), an optional `icon` (`play`, `check`, `lock`, `reopen`), `size="sm"` for header toolbars, `children` as the label, plus any native button props.

- **One `primary` per view.** It is the action for the current step: *Run until next gate*, *Mark done*, *Start*.
- **`publish` is only for confirm steps.** Use it for merging to `master` and creating the GitHub release. It is ink-filled with a lock, so it never looks like the everyday purple button. It opens `ConfirmPublishDialog`; it never runs the step directly.
- `ghost` is for Skip, Cancel and Abandon. Put an ellipsis on any label that opens a confirmation ("Skip…", "Abandon…").
- `link` is for reversible side actions such as *Reopen from here*.
- Labels are verbs in sentence case, naming the exact command when it helps: "Build package", not "Go".
- Don't disable a button without saying why nearby. Don't put two `primary` buttons side by side.

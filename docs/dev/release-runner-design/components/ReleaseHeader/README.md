The top of the page (sticky on desktop): what is being released, how far along it is, and what comes next.

**Provide:** `release` `{ version, edition, branch, prerelease?, gh?, urgency }`, `phases` (as for `PhaseProgress`), `next` (a badge plus the next step's label), and `actions` (secondary controls only, such as Abandon).

- The current step's actions live in its `StepRow`, not here. The header's *Next:* line only points to it.
- Without `release`, render the header with no pills and pair it with `EmptyState`.

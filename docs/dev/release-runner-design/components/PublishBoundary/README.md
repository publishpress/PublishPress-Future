A dashed rule with a lock, placed between the last private step and the first step that changes `master` or goes public.

**Provide:** nothing. `label` and `hint` override the copy.

- Place it inside the Release phase list, directly before the first `confirm` step (*Merge release-x into master*), which is exactly where bare `run` stops. Opening the PR stays above it.
- Use one per page, never more.

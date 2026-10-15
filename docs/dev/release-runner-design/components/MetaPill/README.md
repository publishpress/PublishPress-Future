A label and value pair for release facts in the header.

**Provide:** `label`, `value`, optional `tone` (`accent` for the version, `alert` for security urgency), and `mono` for versions and branch names.

- Order: Version, Edition, Urgency (only when security), Branch, Package (the prerelease, e.g. `rc.2`), GitHub account.
- Show versions without a leading "v". The tag name is `4.11.0`, so the UI says `4.11.0`.

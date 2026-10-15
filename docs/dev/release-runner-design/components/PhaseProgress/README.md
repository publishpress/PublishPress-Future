Progress across the whole release, with one segment per phase, sized by its step count.

**Provide:** `phases`: `[{ name, done, total, current? }]`. Skipped steps count as done.

- It replaces the single bar. With one segment per phase, the user can see that Localization is the long wait without reading the list.
- The `current` segment gets a purple outline, and the legend under the bar names the phase.

Live command output, dark in both themes, with lines coloured by kind.

**Provide:** `lines`, an array of strings or `{ kind, text }`, where `kind` is `cmd` · `ok` · `warn` · `err` · `meta`. Also `live` (shows the Live dot and sets `aria-live`), `maxHeight` (default 280), `title`, and `placeholder`.

- Map SSE lines as follows: the engine's echoed command → `cmd`, stderr → `err`, step boundaries and gate stops → `meta`.
- Auto-scroll only while the user is at the bottom.

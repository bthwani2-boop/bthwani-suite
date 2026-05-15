# ACCEPTANCE MATRIX — DSH V4

| Gate | Required before next step |
|---|---|
| V4-1 | Gap CSV valid, malformed rows zero, evidence written |
| V4-2 | All skeletons wired/blocked/deferred, TODO markers handled, dead/noise matrix exists |
| V4-3 | Frontend taxonomy organized or classified, no broken imports, no permanent deletion |
| V4-4 | Safe preliminary design baseline applied only within approved scope, no ui-kit source edits |
| V4-5 | Final human visual review gate outputs one allowed status |

## Hard blocker examples

- `dsh.openapi.yaml` edited.
- WLT source changed.
- ui-kit source changed without explicit owner approval.
- package/config/lockfile/CI changed.
- TypeScript fails.
- diff check fails.
- orphan skeletons remain unclassified.
- TODO/FIXME/XXX remain in changed DSH source without final blocker.
- final status uses PASS/CLOSED/100%.

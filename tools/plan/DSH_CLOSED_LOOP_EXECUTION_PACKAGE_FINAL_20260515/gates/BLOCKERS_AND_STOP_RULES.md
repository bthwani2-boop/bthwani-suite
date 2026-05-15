# Blockers and Stop Rules

Stop immediately and report `BLOCKED` if the task requires:

- deleting files permanently,
- renaming/moving before inventory/classification,
- touching WLT money semantics,
- editing `dsh.openapi.yaml` before Screen/API Matrix + Contract Gap Map,
- implementing API/backend/runtime,
- changing dependencies/lockfiles/config/CI/generated files,
- changing ui-kit without explicit approval,
- broad visual redesign,
- touching unrelated services,
- claiming PASS/CLOSED/100%,
- proceeding without evidence,
- proceeding with TypeScript failure,
- proceeding with unaccounted untracked files,
- proceeding without patch for review.

## Required BLOCKED output

```text
BLOCKED
reason:
file(s):
forbidden action:
safe next step:
evidence:
```

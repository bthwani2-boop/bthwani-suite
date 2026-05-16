# 10 — Agent Report Template

Use this exact shape.

```text
Decision: DONE | BLOCKED

Changed files:
- ...

Summary:
- ...

Platform control-plane clarity:
- YES/NO
- Evidence:

Verification:
- git status --short: PASS/FAIL
- git diff --name-status: PASS/FAIL
- git diff --check: PASS/FAIL
- pnpm -w exec tsc --noEmit: PASS/FAIL
- untracked files: NONE/LISTED
- platform guard: PASS/FAIL

Evidence ZIP:
tools/registry/runs/<SESSION_ID>/<SESSION_ID>.zip

Visual evidence:
- screenshot attached: YES/NO
- if NO: NEEDS_VISUAL_EVIDENCE

Blocked items:
- ...

Do not claim CLOSED unless all checks and screenshots are present.
```

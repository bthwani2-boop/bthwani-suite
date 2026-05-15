# Patch Review Protocol

After any loop with changes, upload:

- evidence ZIP from `tools/registry/runs/...`
- `LOCAL_CHANGE_REVIEW.patch`
- untracked file list
- TypeScript output
- screenshots if UI changed or visual review is requested

Review must check:

- changed files match loop scope,
- no forbidden files touched,
- no WLT finance leakage,
- no ui-kit drift,
- no API/backend/runtime work unless explicitly allowed,
- no OpenAPI edits before Screen/API Matrix,
- no screen-per-block fragmentation,
- no god-screen consolidation,
- all new docs/matrices have required headers,
- no hidden staged/untracked files,
- verification output is clean.

Possible decisions:

```text
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
```

Do not use `FINAL` or `100%`.

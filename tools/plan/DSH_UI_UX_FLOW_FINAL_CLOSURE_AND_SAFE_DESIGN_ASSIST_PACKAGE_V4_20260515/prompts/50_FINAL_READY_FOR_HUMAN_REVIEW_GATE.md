# V4-5 — FINAL READY FOR HUMAN VISUAL REVIEW GATE

## Purpose

Determine if the branch is actually ready for human final visual review.

## Allowed edits

Docs only:

- `dsh/docs/closure/DSH_READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_GATE.md`
- `dsh/docs/closure/DSH_FINAL_REMAINING_BLOCKERS.md`
- `dsh/docs/closure/DSH_FINAL_SCREEN_REVIEW_QUEUE.md`
- `dsh/docs/closure/DSH_V4_FINAL_EVIDENCE.md`

## Required checks

1. Gap integrity:
   - no malformed gap rows
   - no `NEEDS_SKELETON`
   - no unjustified `NEEDS_DESIGN`
   - no unaccounted `UNWIRED_SKELETON_BLOCKED`
   - every WLT/API blocker explicitly marked

2. Wiring:
   - every skeleton row classified
   - every wired file has proof
   - no source file exists only as orphan skeleton unless blocked/deferred

3. Frontend noise:
   - dead/noise candidates classified
   - no permanent deletion without evidence
   - god-file risks documented or reduced
   - no TODO/FIXME/XXX left in changed source unless final blocker

4. Design baseline:
   - every changed visual screen has design matrix row
   - no ui-kit source edit
   - no local design system
   - no random colors/hardcoded drift

5. Verification:
   - `git diff --check` clean
   - `pnpm -w exec tsc --noEmit` clean
   - untracked files accounted for
   - `LOCAL_CHANGE_REVIEW.patch` produced

## Required final files

- `DSH_READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_GATE.md`
- `DSH_FINAL_REMAINING_BLOCKERS.md`
- `DSH_FINAL_SCREEN_REVIEW_QUEUE.md`
- `DSH_V4_FINAL_EVIDENCE.md`

The gate file must end with exactly one of:

```text
READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_WITH_EVIDENCE
```

or

```text
BLOCKED_NOT_READY_FOR_HUMAN_VISUAL_REVIEW
```

No other final status is allowed.

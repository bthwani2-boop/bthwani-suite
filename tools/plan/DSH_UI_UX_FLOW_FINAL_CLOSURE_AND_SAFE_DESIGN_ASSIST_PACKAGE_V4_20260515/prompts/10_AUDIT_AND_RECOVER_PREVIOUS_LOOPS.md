# V4-1 — AUDIT AND RECOVER PREVIOUS LOOPS

## Purpose

Recover from weak Loops 4–5 and build an accurate state before any more source work.

## Allowed edits

- `dsh/docs/closure/DSH_MISSING_LOGIC_AND_UI_GAPS.csv`
- `dsh/docs/closure/DSH_V4_1_AUDIT_RECOVERY_EVIDENCE.md`
- `dsh/docs/closure/DSH_V4_CURRENT_STATE_SUMMARY.md`
- `dsh/docs/closure/DSH_NEXT_LOOP_PLAN.md`

## Forbidden

No source edits. No screen edits. No registry edits. No ui-kit. No WLT. No OpenAPI.

## Required work

1. Run the package script `AUDIT_DSH_UI_UX_FLOW_CLOSURE_V4.ps1`.
2. Fix malformed CSV rows in `DSH_MISSING_LOGIC_AND_UI_GAPS.csv`.
3. Validate every row has valid priority: `P0|P1|P2`.
4. Validate every row has valid status:
   - `WIRED_IN_FLOW_NEEDS_VISUAL_REVIEW`
   - `SKELETON_ADDED_NEEDS_VISUAL_REVIEW`
   - `NEEDS_SKELETON`
   - `NEEDS_DESIGN`
   - `UNWIRED_SKELETON_BLOCKED`
   - `BLOCKED_BY_WLT`
   - `BLOCKED_BY_CONTRACT`
   - `EXPLICITLY_DEFERRED_WITH_REASON`
   - `OWNER_DECISION_REQUIRED`
   - `READY_FOR_VISUAL_BASELINE`
5. Count unresolved rows and write evidence.
6. List source TODO/FIXME/XXX markers.
7. List unreferenced skeleton candidates.
8. List ui-kit diff if present; do not edit ui-kit.

## Gate

V4-1 is complete only if malformed rows are zero and evidence exists.

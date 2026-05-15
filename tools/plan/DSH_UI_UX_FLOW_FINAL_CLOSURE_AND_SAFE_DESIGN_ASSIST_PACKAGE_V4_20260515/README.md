# DSH UI/UX Flow Final Closure + Safe Design Assist Package V4

Branch: `ghb/0142-20260515-053913-verify-ui-kit-stability`
Generated: 2026-05-15

## Purpose

This package replaces the weak post-Loop execution behavior. It is designed to complete DSH UI/UX flow closure, remove frontend noise, validate wiring, classify or eliminate dead code/noise, and allow a controlled preliminary design baseline **without destructive redesign**.

Target outcome:

```text
READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_WITH_EVIDENCE
```

Not allowed outcome from the agent:

```text
PASS / CLOSED / FINAL / 100% / PRODUCTION READY
```

## Current audit facts from the uploaded branch ZIP

- Total files in ZIP snapshot: 1088
- `dsh/` files: 287
- `dsh/frontend/` files: 224
- `dsh/docs/closure/` files: 28
- Gap rows in `DSH_MISSING_LOGIC_AND_UI_GAPS.csv`: 54
- Gap status counts: {'SKELETON_ADDED_NEEDS_VISUAL_REVIEW': 31, 'NEEDS_SKELETON': 11, 'NEEDS_DESIGN': 11, 'P2': 1}
- Invalid/malformed gap row candidates: ['ML-039']
- TODO/FIXME/XXX markers under `dsh/frontend`: 21
- Unreferenced candidate skeleton files by static heuristic: 17

## How to use

Give the agent the following files in this order:

1. `commands/00_EXECUTE_FULL_REMAINING_CLOSURE_AND_SAFE_DESIGN.md`
2. `prompts/00_MASTER_NON_NEGOTIABLES.md`
3. `prompts/10_AUDIT_AND_RECOVER_PREVIOUS_LOOPS.md`
4. `prompts/20_CLOSE_WIRING_GAPS_AND_DEAD_NOISE.md`
5. `prompts/30_FRONTEND_TAXONOMY_REORGANIZATION_PLAN_AND_APPLY.md`
6. `prompts/40_SAFE_PRELIMINARY_DESIGN_BASELINE.md`
7. `prompts/50_FINAL_READY_FOR_HUMAN_REVIEW_GATE.md`

Run the audit script before and after:

```powershell
Set-Location -LiteralPath "C:thwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File "<EXTRACTED_PACKAGE>\scripts\AUDIT_DSH_UI_UX_FLOW_CLOSURE_V4.ps1"
```

## Final acceptance

The agent is allowed to reach only:

```text
READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_WITH_EVIDENCE
```

This means the remaining work for the owner is visual review and manual design judgement. It does not mean API/backend/runtime/WLT ledger closure.

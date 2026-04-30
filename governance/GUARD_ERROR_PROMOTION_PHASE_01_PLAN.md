---
generatedFrom: governance/GUARD_ERROR_PROMOTION_PHASE_01_PLAN.md
generatedAt: 2026-04-30T04:48:37.7557558+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Guard Error Promotion Phase 01 Plan

Status: CANONICAL_PROMOTION_PLAN
Owner: BThwani Governance
SourceEvidence: `C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_05_FIX_BATCH04_AND_EXPAND-20260429-231805`

## Phase 01 candidates

| Guard | Warnings | Owner | Prerequisite |
|---|---:|---|---|
| guard-legacy-forbidden-naming | 246 | BTHWANI_GOVERNANCE | Calibrate false positives and record accepted baseline |
| guard-package-internal-deep-import | 39 | ARCHITECTURE_OWNER | Calibrate false positives and record accepted baseline |
| guard-public-export-barrel-contract | 337 | ARCHITECTURE_OWNER | Calibrate false positives and record accepted baseline |
| guard-script-safety | 20 | GOVERNANCE_OWNER | Calibrate false positives and record accepted baseline |
| guard-uikit-tamagui-boundary | 185 | UI_SYSTEM_OWNER | Calibrate false positives and record accepted baseline |

## Non-negotiable rule

No warning class becomes Error until false positives, baseline, CI impact, owner decision, and rollback are documented.


---
generatedFrom: governance/GOVERNANCE_DEDICATED_MERGE_DELETE_PLAN.md
generatedAt: 2026-04-30T04:48:37.4952341+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Governance Dedicated Merge/Delete Plan

Status: CANONICAL_PLAN
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_12_DEDICATED_MERGE_DELETE_PLAN-20260430-004305
LastPlannedBy: GOVERNANCE_BATCH_12_DEDICATED_MERGE_DELETE_PLAN-20260430-004305

## Scope

Batch 12 is a dedicated decision plan. It does not delete, move, or merge files.

## Counts

| Decision | Count |
|---|---:|
| KEEP | 423 |
| MERGE_INTO_CANONICAL | 0 |
| LEDGER_ONLY | 5 |
| TRANSITIONAL_REFERENCE_ONLY | 8 |
| REMOVE_IN_DEDICATED_BATCH | 0 |
| UNCLASSIFIED | 0 |
| Active docs/governance references | 0 |

## Rule

No file is deleted in Batch 12. Any removal must be executed in Batch 13 with:

- explicit file list
- backup/rollback ZIP
- git diff --check
- pnpm -w exec tsc --noEmit
- all tools/guards/guard-*.mjs
- local commit
- push only after review

## Evidence

- C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_12_DEDICATED_MERGE_DELETE_PLAN-20260430-004305\batch12-dedicated-merge-delete-plan.csv
- C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_12_DEDICATED_MERGE_DELETE_PLAN-20260430-004305\batch12-rollback-requirements.csv


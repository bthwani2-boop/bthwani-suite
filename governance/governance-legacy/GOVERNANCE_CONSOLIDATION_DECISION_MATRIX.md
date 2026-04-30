---
generatedFrom: governance/GOVERNANCE_CONSOLIDATION_DECISION_MATRIX.md
generatedAt: 2026-04-30T04:48:37.4825933+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Governance Consolidation Decision Matrix

Status: CANONICAL_DECISION_MATRIX
Owner: BThwani Governance
LastStandardizedBy: GOVERNANCE_BATCH_09_RESCUE_STANDARDIZE_CLOSE-20260430-001242

## Current decision

Batch 09 does not delete or merge additional files. It standardizes the control plane and creates the classification basis for the next safe consolidation batch.

## Mandatory consolidation process

1. Inventory all related files.
2. Classify each file by owner and purpose.
3. Detect duplicates.
4. Detect contradictions.
5. Decide one of: KEEP, MERGE_INTO_CANONICAL, LEDGER_ONLY, TRANSITIONAL_REFERENCE_ONLY, REMOVE_IN_DEDICATED_BATCH.
6. Run diff-check, tsc, all guards.
7. Produce evidence pack.
8. Commit locally.
9. Push only after explicit approval.

## Forbidden in consolidation

- broad deletion without rollback
- moving files without owner proof
- merging docs without preserving evidence
- changing guard severity without a baseline
- changing GitHub workflows without explicit verification


# Legacy Reference Cleanup Matrix

Status: CANONICAL_CLEANUP_MATRIX
Owner: BThwani Governance
SourceEvidence: `C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_05_FIX_BATCH04_AND_EXPAND-20260429-231805`

## Cleanup families

| Family | Count | Decision | Next action |
|---|---:|---|---|
| docs/governance references | 101 | CLASSIFY_BEFORE_DELETE | Fix active blockers, keep policy references until deletion commit |
| docs/governance active blockers | 24 | BLOCKS_DELETION | Repoint/remove before deletion |
| legacy volatile evidence root references | 11 | CLEANUP_CANDIDATE | Repoint to tools/registry/runs or reject |
| legacy short-token candidates | 466 | CLEANUP_CANDIDATE | Classify, never blind replace |

## Rule

Cleanup must be one family at a time, with owner decision, reference scan, rollback, and evidence. No blind global replace.

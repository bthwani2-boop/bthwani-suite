# Legacy Reference Cleanup Matrix

Status: CANONICAL_CLEANUP_MATRIX
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_06_REMEDIATE_DOCS_REFS_V3-20260429-234031

## Cleanup families

| Family | Before | After | Decision | Next action |
|---|---:|---:|---|---|
| docs/governance active blockers | 24 | 1 | NOT_READY_ACTIVE_REFERENCES_EXIST | Final deletion readiness package if zero |
| source self references | 15 | 15 | ALLOWED_UNTIL_DELETION | Delete source root only in dedicated commit |

## Rule

Cleanup must be one family at a time, with owner decision, reference scan, rollback, and evidence. No blind global replace.

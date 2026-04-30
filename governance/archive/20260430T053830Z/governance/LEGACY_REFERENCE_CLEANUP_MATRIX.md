# Legacy Reference Cleanup Matrix

Status: CANONICAL_CLEANUP_MATRIX
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_06_REMEDIATE_DOCS_REFS_V3-20260429-234031

## Cleanup families

| Family | Before | After | Decision | Next action |
|---|---:|---:|---|---|
| legacy governance docs active code/script blockers | 24 | 0 | READY_FOR_DELETION_READINESS_PACKAGE | Dedicated deletion-readiness DryRun package next |
| source self references | 15 | 15 | ALLOWED_UNTIL_DELETION | Delete source root only in dedicated commit |

## Rule

Cleanup must be one family at a time, with owner decision, reference scan, rollback, and evidence. No blind global replace.

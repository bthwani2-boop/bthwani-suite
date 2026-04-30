---
generatedFrom: governance/GOVERNANCE_CLEANUP_CANDIDATES.md
generatedAt: 2026-04-30T04:48:37.4592352+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Governance Cleanup Candidates

Status: CANONICAL_LEDGER  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## Purpose

Track files that may be merged, archived, deprecated, or deleted later.

This file does not authorize deletion by itself.

## Candidate template

```text
Candidate ID:
Path:
Current status: ACTIVE / LEGACY_REFERENCE / TRANSITIONAL / DUPLICATE / TBD
Proposed action: MERGE / ARCHIVE / DEPRECATE / DELETE / KEEP / TBD
Reason:
Replacement:
Reference scan:
Risk:
Rollback:
Decision:
Evidence:
```

## Initial policy

No cleanup candidate should be deleted until:

```text
reference scan is complete
replacement target is verified
diff is reviewed
rollback is available
evidence is stored
decision is recorded
```

## Current package candidates

| Candidate ID | Path | Proposed action | Status | Reason |
|---|---|---|---|---|
| GOV-CLEANUP-TBD-001 | `docs/governance/` | TBD | TRANSITIONAL_REFERENCE_IF_PRESENT | Must not override `governance/`; useful content should be merged first |
| GOV-CLEANUP-TBD-002 | `governance/legacy-extracted/` | ARCHIVE_OR_DELETE_AFTER_REVIEW | LEGACY_REFERENCE_IF_PRESENT | Historical material only unless verified and merged |
| GOV-CLEANUP-TBD-003 | duplicate governance batch ledgers | ARCHIVE_OR_DELETE_AFTER_REVIEW | TBD | Keep only if needed as evidence; do not use as active policy |


---
generatedFrom: governance/CLEANUP_AND_DEPRECATION_POLICY.md
generatedAt: 2026-04-30T04:48:37.3787607+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Cleanup and Deprecation Policy

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Cleanup stance

Cleanup is allowed only when evidence proves it is safe.

Forbidden:

```text
blind global delete
blind global replace
mass rename without reference scan
delete before replacement is canonical
delete without rollback
delete based on file name only
```

## 2. Cleanup statuses

```text
ACTIVE
CANONICAL
LEGACY_REFERENCE
TRANSITIONAL
MERGE_CANDIDATE
DELETE_CANDIDATE
ARCHIVE_CANDIDATE
DEPRECATED
REJECTED
TBD
```

## 3. Delete candidate requirements

A file can become `DELETE_CANDIDATE` only when:

```text
role is understood
replacement exists or file is proven obsolete
references are scanned
consumers are understood
risk is documented
rollback path exists
```

## 4. Archive rule

Historical files may be archived when they contain useful context but are not active policy.

Archived files must not override canonical governance files.

## 5. Merge rule

Merge only verified non-duplicate truth.

When merging:

```text
identify source
identify target
resolve conflict
avoid duplicate policy
record decision
preserve evidence
```

## 6. Deprecation rule

Deprecated policy must state:

```text
what replaced it
when replaced
why replaced
how to verify no active dependency remains
```

## 7. Ledger files

Use:

```text
GOVERNANCE_MERGE_DECISIONS.md
GOVERNANCE_CLEANUP_CANDIDATES.md
```

No actual deletion is accepted without ledger and verification.


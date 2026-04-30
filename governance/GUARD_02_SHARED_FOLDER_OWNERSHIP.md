# GUARD-02 — Shared Folder Ownership Guard

## Purpose

GUARD-02 checks whether every `shared` folder has a valid architectural reason to exist.

It is based on:

```text
governance/03_PACKAGE_BOUNDARY_CONTRACT.md
governance/09_SHARED_FOLDER_GOVERNANCE.md
```

## What It Checks

- all folders named `shared`
- shared folder classification
- shared file consumer counts
- orphan shared files
- single-consumer shared files
- product/domain content inside app-shell shared folders
- service terms inside surface-owned shared folders
- surface-global terms inside service-owned shared folders
- local design-system patterns outside ui-kit shared folders
- ui-kit shared files that contain domain/product terms

## Outputs

```text
shared-folders-inventory.csv
shared-files-consumer-count.csv
shared-risk-report.csv
shared-remediation-queue.csv
import-resolution-report.csv
shared-risk-report.json
SUMMARY.md
status.txt
evidence.json
_HANDOFF.zip
```

## Decisions

```text
PASS_SHARED_STRUCTURE_CLEAN
READY_FOR_SHARED_REVIEW_WITH_WARNINGS
BLOCKED_BY_INVALID_SHARED_STRUCTURE
```

## Rule

This guard is CHECK-only.

It must not move, delete, rename, or refactor files.

The remediation queue is used to plan small scoped fixes only after owner and consumer proof.

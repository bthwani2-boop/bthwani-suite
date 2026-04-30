# GUARD-03 — Unused / Dead / Orphan Code Guard

## Purpose

GUARD-03 identifies unused, dead, orphan, duplicated, or unconsumed source files without deleting or modifying any product code.

It exists to reduce noise safely while protecting current progress.

## What It Checks

- source file inventory
- import-to-file consumer map
- export-to-consumer map
- orphan source file candidates
- orphan screens / UI files
- public exports with no direct consumers
- duplicate normalized file body candidates
- unresolved internal imports

## Outputs

```text
source-files-inventory.csv
imports-consumer-map.csv
exports-consumer-map.csv
unused-orphan-risk-report.csv
dead-code-remediation-queue.csv
unresolved-imports-report.csv
unused-orphan-risk-report.json
SUMMARY.md
status.txt
evidence.json
_HANDOFF.zip
```

## Decisions

```text
PASS_NO_UNUSED_OR_DEAD_CODE_RISKS
READY_FOR_DEAD_CODE_REVIEW_WITH_WARNINGS
BLOCKED_BY_DEAD_CODE_HIGH_RISK
```

## Non-Deletion Rule

GUARD-03 never deletes files.

No file may be deleted from GUARD-03 output without:

```text
zero-reference proof
runtime / route proof
public export proof
owner decision
rollback path
git diff --check PASS
pnpm -w exec tsc --noEmit PASS
GUARD-01 PASS
GUARD-02 PASS
GUARD-03 re-run
```

## Intended Workflow

1. Run GUARD-03.
2. Review `dead-code-remediation-queue.csv`.
3. Choose a small safe batch.
4. Apply move/merge/archive only after proof.
5. Re-run all guards.

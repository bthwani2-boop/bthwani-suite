---
generatedFrom: governance/GUARD_10_EVIDENCE_REGISTRY_RUNS_HYGIENE.md
generatedAt: 2026-04-30T04:48:37.6552798+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# GUARD-10 — Evidence / Registry Runs Hygiene Guard

## Purpose

GUARD-10 protects `tools/registry/runs` from evidence drift and ambiguous handoff artifacts.

It exists because a generic `_HANDOFF.zip` alone can be uploaded from the wrong run. Every evidence-producing script should create both:

```text
_HANDOFF.zip
SESSION_ID_HANDOFF.zip
```

## Scope

GUARD-10 checks evidence run folders for:

- `_HANDOFF.zip`
- a named handoff zip such as `SESSION_ID_HANDOFF.zip`
- `SUMMARY.md` or `summary.txt`
- `status.txt`
- `evidence.json`
- zero-byte evidence files

## Current Mode

CHECK-only and warning-first until baseline classification is complete.

## Non-negotiable Rule

This guard never deletes, moves, renames, rewrites, or compresses existing evidence runs. It only reports.

## Promotion Plan

After warning classification:

1. Missing named handoff should become an error for new evidence runs.
2. Missing status/evidence/summary should become an error for new evidence runs.
3. Legacy runs may remain accepted baseline if explicitly classified.

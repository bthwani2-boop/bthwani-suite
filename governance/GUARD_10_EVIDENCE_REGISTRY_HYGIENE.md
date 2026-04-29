# GUARD-10 — Evidence / Registry Runs Hygiene Guard

## Purpose

Ensure every evidence run under `tools/registry/runs` is reviewable, upload-safe, and not ambiguous.

## Mode

CHECK-only and warning-first until baseline review is complete.

## Checks

- `_HANDOFF.zip`
- `SESSION_ID_HANDOFF.zip`
- summary file
- status file
- evidence JSON

## Rule

No evidence deletion or migration. Findings are used to improve future run quality and avoid ambiguous `_HANDOFF.zip` uploads.

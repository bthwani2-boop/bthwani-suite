---
generatedFrom: governance/GUARD_24_EVIDENCE_TO_COMMIT_TRACEABILITY.md
generatedAt: 2026-04-30T04:48:37.7474991+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# GUARD-24 — Evidence-to-Commit Traceability

## Purpose

This guard is part of the BThwani governance hardening layer.

## Mode

CHECK-only and warning-first until baseline classification is complete.

## Rule

This guard must not delete, move, rename, rewrite production files, or activate CI by itself.

## Promotion

After warning classification, selected findings can be promoted from warning to error with precise allowlists.


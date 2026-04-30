---
generatedFrom: governance/GUARD_22_TEST_SMOKE_COVERAGE_PRESENCE.md
generatedAt: 2026-04-30T04:48:37.7369706+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# GUARD-22 — Test / Smoke Coverage Presence

## Purpose

This guard is part of the BThwani governance hardening layer.

## Mode

CHECK-only and warning-first until baseline classification is complete.

## Rule

This guard must not delete, move, rename, rewrite production files, or activate CI by itself.

## Promotion

After warning classification, selected findings can be promoted from warning to error with precise allowlists.


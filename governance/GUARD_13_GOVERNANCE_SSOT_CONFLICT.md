---
generatedFrom: governance/GUARD_13_GOVERNANCE_SSOT_CONFLICT.md
generatedAt: 2026-04-30T04:48:37.6747145+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# GUARD-13 — Governance SSOT Conflict

## Purpose

This guard is part of the BThwani governance hardening layer.

## Mode

CHECK-only and warning-first until baseline classification is complete.

## Rule

This guard must not delete, move, rename, rewrite production files, or activate CI by itself.

## Promotion

After warning classification, selected findings can be promoted from warning to error with precise allowlists.


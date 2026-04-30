---
generatedFrom: governance/GUARD_05_PACKAGE_INTERNAL_DEEP_IMPORT.md
generatedAt: 2026-04-30T04:48:37.6110626+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# GUARD-05 — Package Internal Deep Import Guard

## Purpose

Protect package boundaries by detecting imports that bypass public package APIs and reach internal implementation paths.

## Mode

CHECK-only and warning-first until baseline review is complete.

## Protects

- @bthwani/ui-kit public API
- @bthwani/surfaces public and approved subpath APIs
- internal `src`, `_internal`, `foundation`, `service-owned`, `surface-owned`, and similar segments

## Rule

No deep import should be treated as acceptable without explicit public export ownership.


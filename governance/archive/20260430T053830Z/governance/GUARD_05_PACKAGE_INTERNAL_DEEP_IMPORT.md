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

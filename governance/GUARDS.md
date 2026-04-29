# Governance Guards

## Purpose

This document defines the executable guard layer for BThwani governance.

`governance/` contains the rules.  
`tools/guards/` contains executable checks that prove or reject compliance.

## GUARD-01 — Governance Boundaries

Files:

```text
tools/guards/guard-governance-boundaries.mjs
tools/guards/guard-governance-boundaries.config.json
```

Run:

```powershell
node tools/guards/guard-governance-boundaries.mjs
```

Evidence output:

```text
tools/registry/runs/GUARD_01_GOVERNANCE_BOUNDARIES-{timestamp}
```

## Version 1.1.1 Calibration

GUARD-01B makes the guard practical:

- boundary/import violations remain blocking errors
- legacy tokens are warnings in this boundary guard
- legacy cleanup is handled later by a dedicated legacy guard/phase
- approved `@bthwani/surfaces/{surface}` public imports remain allowed
- governance policy wording does not count as a live source violation

## Blocking Errors in GUARD-01

These must remain errors:

```text
APP_OR_SHELL_DEEP_SURFACES_IMPORT
APP_RELATIVE_PACKAGE_IMPORT
PUBLIC_SURFACE_EXPORT_HAS_LOGIC
SURFACE_LOCAL_DESIGN_SYSTEM
UI_KIT_IMPORTS_SURFACE_OR_SHELL
MISSING_REQUIRED_GOVERNANCE_FILE
```

## Warning Queues

These are warnings in GUARD-01 and are not ignored:

```text
APP_USER_LEGACY
MCPW_LEGACY
OLD_EVIDENCE_ROOT
OLD_ACTIVE_BTH_PATH
NPM_COMMAND_REVIEW
SURFACE_HARDCODED_COLOR_REVIEW
UI_KIT_DOMAIN_CONTENT_CANDIDATE
DEEP_UI_KIT_IMPORT
APP_PRODUCT_CONTENT_CANDIDATE
```

They require later cleanup or classification, but should not block boundary guard adoption.

## Calibration Principle

Do not hide real source violations.

Allowed calibration:

- governance policy mentions
- guard config examples
- planned-retirement wording
- legacy warning queues

Not allowed calibration:

- active imports from apps/app-shells to `packages/surfaces/src`
- relative imports from apps into package internals
- ui-kit importing surfaces/app-shells
- surfaces defining local design systems
- logic inside `packages/surfaces/src/public`

## Current Policy

This guard is CHECK-only. It does not edit product files.

Do not connect it to CI until local boundary errors are resolved or explicitly accepted as blockers.

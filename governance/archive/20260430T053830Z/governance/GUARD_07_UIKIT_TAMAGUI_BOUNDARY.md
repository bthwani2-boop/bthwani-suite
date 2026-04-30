# GUARD-07 — UI-kit / Tamagui Boundary Guard

## Purpose

Enforce the BThwani UI boundary:

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

## Mode

CHECK-only and warning-first until baseline review is complete.

## Checks

- raw Tamagui imports outside `packages/ui-kit`
- @bthwani/ui-kit deep imports
- likely local design-system paths outside ui-kit

## Rule

No UI work should introduce local design systems or raw Tamagui imports outside ui-kit.

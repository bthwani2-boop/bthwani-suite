---
generatedFrom: governance/11_DSH_GOLDEN_SLICE_PROTOCOL.md
generatedAt: 2026-04-30T04:48:37.1985520+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# DSH Golden Slice Protocol

## Purpose

DSH is the first service golden slice after governance reaches the ready gate.

## Do Not Start Early

Do not start DSH implementation, cleanup, UI repair, API binding, or runtime work until governance has passed its final verification gate.

## Required DSH Sequence

```text
1. DSH Reality + Boundary Audit
2. DSH Logic / Flow Matrix
3. DSH Gap Map
4. DSH Screen Model Contract
5. Implement missing DSH logic surface-by-surface
6. UX / UI / RTL / State Closure
7. Technical cleanup + package boundary repair
8. API / Binding / Integration / Runtime / Backend closure
9. Final evidence gate
```

## Surfaces

DSH must be analyzed across:

- app-client
- app-partner
- app-captain
- app-field
- control-panel
- webapp / website only when product scope requires them

## Ownership

DSH service-owned surface code belongs under:

```text
packages/surfaces/src/service-owned/dsh/{surface}/...
```

Global surface shell code belongs under:

```text
packages/surfaces/src/surface-owned/{surface}/...
```

Apps remain shell-only.

## UI Identity

DSH must use the BThwani design system through `@bthwani/ui-kit` public exports. No local design system, random palette, or legacy visual drift is allowed.

## Evidence

Every DSH phase must produce an evidence pack and must not claim 100% closure without proof.


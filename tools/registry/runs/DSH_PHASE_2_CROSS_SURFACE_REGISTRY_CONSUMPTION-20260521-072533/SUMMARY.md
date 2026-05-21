# DSH Phase 2 — Cross-Surface Registry Consumption
## SESSION_ID: DSH_PHASE_2_CROSS_SURFACE_REGISTRY_CONSUMPTION-20260521-072533

**Date:** 2026-05-21  
**Branch:** ghb/0163-20260521-055416-gitattributes-dsh  
**Phase name:** DSH_PHASE_2_CROSS_SURFACE_REGISTRY_CONSUMPTION_AND_FLOW_ALIGNMENT

---

## Objective

Convert `dsh/frontend/shared/dsh-flow-registry.ts` from an unused SSoT baseline into a live SSoT
consumed by all 5 DSH surfaces (app-client, app-partner, app-captain, app-field, control-panel),
with WLT/finance as reference-only.

---

## Files Changed (7 files, 169 insertions, 7 deletions)

| File | Change | Reason |
|------|--------|--------|
| `dsh/frontend/shared/dsh-flow-registry.ts` | +23 lines | Added `getDshPrimaryFlowsForSurface` + `getDshContextualFlowsForSurface` utilities |
| `dsh/frontend/shared/index.ts` | +3 lines | Export two new Phase 2 utilities + session comment |
| `dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts` | +25 lines | `getDshClientFlowPolicy` bridge — client surface on-demand policy from central registry |
| `dsh/frontend/app-captain/contracts/dshCaptainBinding.contracts.ts` | +25 lines | `getDshCaptainFlowPolicy` bridge — captain surface on-demand policy from central registry |
| `dsh/frontend/app-field/screens/DshFieldReadinessEscalationScreen.tsx` | +14/-7 lines | `getDshFlowById` → `registryEscalationOwner` from registry SSoT; removed dead `Icon` import |
| `dsh/frontend/control-panel/operations/ExceptionsEscalationsScreen.tsx` | +39/-2 lines | `getDshEscalationFlows()` catalog section (read-only registry reference); fixed unused vars, removed console.log |
| `dsh/frontend/control-panel/shared/control-panel-surface.module.css` | +47 lines | CSS module classes for escalation catalog rows (no inline styles) |

---

## Registry Consumers: Before → After

| Surface | Before | After | Registry Function |
|---------|--------|-------|-------------------|
| app-partner | `isDshHiddenCompatFlow` guard ✅ | unchanged (Phase 1) | `isDshHiddenCompatFlow` |
| app-client | 0 ❌ | `getDshClientFlowPolicy` + `getDshFlowById` ✅ | registry on-demand policy bridge |
| app-captain | 0 ❌ | `getDshCaptainFlowPolicy` + `getDshFlowById` ✅ | registry on-demand policy bridge |
| app-field | 0 ❌ | `getDshFlowById` → `registryEscalationOwner` ✅ | escalation owner from registry SSoT |
| control-panel | 0 ❌ | `getDshEscalationFlows()` catalog ✅ | all escalation flows read-only display |

---

## Acceptance Criteria

| # | Criterion | Result |
|---|-----------|--------|
| 1 | All 5 surfaces have registry consumer | ✅ VERIFIED |
| 2 | No hidden-compat/internal/disabled as primary | ✅ VERIFIED |
| 3 | Finance-preview flows read-only | ✅ VERIFIED |
| 4 | getDshEscalationFlows() used by control-panel | ✅ VERIFIED |
| 5 | No Tamagui imports outside ui-kit | ✅ guard PASS (fail=0, warn=0) |
| 6 | No backend/API/database mutation | ✅ VERIFIED (frontend only) |
| 7 | No dependency/lockfile changes | ✅ VERIFIED |
| 8 | No duplicated owner/visibility/onDemand metadata | ✅ registry is SSoT for these fields |
| 9 | on-demand policy respected in new UI | ✅ VERIFIED |
| 10 | RTL correct in touched screens | ✅ direction: rtl preserved in CSS module |
| 11 | TypeScript passes | ✅ `tsc --noEmit` EXIT:0 |
| 12 | Guards pass | ✅ tamagui PASS, i18n PASS |
| 13 | `git diff --check` passes | ✅ EXIT:0 |
| 14 | Evidence zip exists | ✅ `DSH_PHASE_2_CROSS_SURFACE_REGISTRY_CONSUMPTION-20260521-072533.zip` |

---

## New Registry Utilities Added

```typescript
// dsh/frontend/shared/dsh-flow-registry.ts
getDshPrimaryFlowsForSurface(surfaceId: DshSurfaceId): readonly DshFlowRegistryEntry[]
getDshContextualFlowsForSurface(surfaceId: DshSurfaceId): readonly DshFlowRegistryEntry[]
```

Both are pure read-only array filters — no React, no UI, no side effects, no throws in render path.

---

## On-Demand Policy Summary

| Flow | Policy | Surface | Status |
|------|--------|---------|--------|
| client-order-tracking | summary-only | app-client | ✅ registry-sourced |
| client-cart-checkout | detail-on-open | app-client | ✅ registry-sourced |
| client-order-issue | evidence-on-open | app-client | ✅ registry-sourced |
| captain-order-pickup | detail-on-open | app-captain | ✅ registry-sourced |
| captain-proof-of-delivery | evidence-on-open | app-captain | ✅ PoD not eager-loaded |
| captain-map-navigation | summary-only | app-captain | ✅ registry-sourced |
| field-readiness-escalation | evidence-on-open | app-field | ✅ escalationOwner from registry |
| control-escalation-queue | detail-on-open | control-panel | ✅ read-only catalog display |

---

## Finance-Preview Safety

All 3 finance-preview flows (`partner-finance-bridge`, `partner-settlement-summary`,
`partner-commission-summary`) remain:
- `hiddenCompat: true`
- `onDemandPolicy: 'finance-preview-only'`
- `financialImpact: true`
- Displayed in control-panel escalation catalog as **read-only reference rows only**
- No WLT mutation path introduced in Phase 2

---

## Hidden-Compat Safety

- `isDshHiddenCompatFlow` guard in `PartnerSupportScreen.tsx` remains active (Phase 1 work unchanged)
- 8 hidden-compat flows remain hidden in all surface primary nav
- Control-panel escalation catalog shows them as reference-only (visibility column shows 'hidden-compat')

---

## What Remains for Phase 3

1. Route-driven integration tests (PROVEN_REACHABLE_BY_ROUTE — navigation test, not only route string)
2. `getDshEscalationFlows()` wired to live escalation queue (Phase 2 is read-only preview reference)
3. Color system audit: 12 DSH files with hardcoded color patterns (Phase 0 carry-forward)
4. 9 SUMMARY_ONLY_TBD flows need full screen binding (app-client, app-captain, app-field)
5. WLT CONTRACT_TBD: finance mutations blocked until WLT API contract is defined
6. `operations-support.preview.ts` partial duplication: further trimming once Phase 3 wires all field/captain flows to registry
7. `getDshEscalationFlowsForSurface(surfaceId)` utility (scoped escalation catalog per surface — deferred from Phase 2 as not required by any accepted consumer yet)

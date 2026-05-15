# DSH V6 Phase 5 — Safe Design Baseline Changelog

Date: 2026-05-15
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## Design baseline scope

Phase 5 covers all visual state additions made in V6. Each change is a minimum-viable state addition using only existing ui-kit components. No random colors, no local design system, no new brand palette.

---

## Screens with visual changes in V6

### 1. DshCheckoutIntentScreen.tsx — ML-010 + ML-015

**Change:**
- Added `quote-loading` state: `StateView stateId="loading"` with Arabic quote-loading message
- Added retry `Button` below `StateView` in `blocked` state (uses `tone="secondary"`)

**Design compliance:**
- Uses `StateView` from `@bthwani/ui-kit` (existing component, no source edit)
- Uses `Button` from `@bthwani/ui-kit` (existing component, no source edit)
- No hardcoded colors — all from ui-kit tokens
- No new screen or route created

---

### 2. DshFieldReadinessEscalationScreen.tsx — ML-004

**Change:**
- Added `pending-response` state: `StateView stateId="loading"` with Arabic waiting message
- Added `approved` state: `StateView stateId="success"` with success message + back CTA
- Added `rejected` state: `StateView stateId="blocked"` with retry CTA

**Design compliance:**
- All states use `StateView` from `@bthwani/ui-kit`
- Consistent with existing `loading` / `success` / `blocked` states already in the screen
- No new components, no new colors

---

### 3. OrdersInboxScreen.tsx (app-partner) — ML-021

**Change:**
- Extended `PartnerOrderStatus` type with `captain_assigned` and `captain_arriving`
- Extended `resolveStatusLabel` and `resolveStatusTone` functions

**Design compliance:**
- Visual rendering is unchanged — new statuses use existing `brand` tone (same as `handoff`)
- No new component, no new color, no layout change

---

### 4. DshCaptainOrdersScreen.tsx + captain-orders.preview-data.ts — ML-027

**Change:**
- Added `offer-accepting` state: `StateView stateId="loading"` with Arabic offer-accepting message
- Added `offer-accepted` state: `StateView stateId="success"` with Arabic confirmation

**Design compliance:**
- Uses `StateView` from `@bthwani/ui-kit`
- Consistent with existing `loading` / `delivered` / `empty` state patterns
- No new component, no new color

---

### 5. VisitEvidenceSection.tsx — ML-003 (new file)

**Design:**
- `sectionState === 'ready'`: renders list of evidence items with capture buttons
- `sectionState === 'uploading'`: `StateView stateId="loading"`
- `sectionState === 'complete'`: `StateView stateId="success"`
- `sectionState === 'error'`: `StateView stateId="error"` with retry

**Design compliance:**
- Uses `Box`, `Button`, `SectionHeader`, `StateView`, `Text` from `@bthwani/ui-kit`
- Uses `background="surfaceRaised"` and `radiusToken="md"` — ui-kit tokens
- No hardcoded colors

---

### 6. ItemApprovalSection.tsx — ML-053 (new file)

**Design compliance:**
- Uses `Box`, `Button`, `ListItem`, `Text` from `@bthwani/ui-kit`
- Uses `WebCompactSurfaceHeader` from `@bthwani/ui-kit/web`
- Background color `#F8FAFC` is consistent with existing CatalogAdoptionQueue.tsx pattern (same literal used there)
- No new brand palette

---

### 7. CatalogPublishingGateSection.tsx — ML-054 (new file)

**Design compliance:**
- Uses `Box`, `Button`, `KeyValueList`, `Text` from `@bthwani/ui-kit`
- Uses `WebCompactSurfaceHeader` from `@bthwani/ui-kit/web`
- No hardcoded random colors

---

## Screens NOT changed in Phase 5

All other screens (P0-06 StoreScreen, P0-17 DshCaptainPoDSubmissionScreen, etc.) were not changed — they are either already review-ready from prior loops or blocked by contracts.

---

## Design compliance summary

| Rule | Status |
|---|---|
| No ui-kit source edits | COMPLIED |
| No hardcoded random colors | COMPLIED — all ui-kit tokens or established literals |
| No local design system | COMPLIED |
| No new brand palette | COMPLIED |
| No free visual redesign | COMPLIED — minimum viable state additions only |
| No screen-per-block | COMPLIED |
| No route proliferation | COMPLIED |
| Every changed visual file documented here | YES |

```
PHASE_5_GATE: GREEN
```

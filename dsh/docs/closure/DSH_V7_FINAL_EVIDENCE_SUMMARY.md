# DSH V7 Final Evidence Summary

Date: 2026-05-16
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability

---

## Source Changes (git diff --stat HEAD -- dsh/frontend/)

```
dsh/frontend/app-captain/DshCaptainSurface.tsx     | 58 ++++++++++++++++++++
dsh/frontend/app-client/screens/StoreScreen.tsx    |  4 +-
dsh/frontend/app-field/data/field-stores.preview-data.ts    |  6 ++-
dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx      | 10 ++++
dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx |  9 ++++
dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx  | 14 +++++
dsh/frontend/control-panel/operations/AuditSupportSlaScreen.tsx       | 62 +++++++++++++---------
7 files changed, 135 insertions(+), 28 deletions(-)
```

Note: `StoreScreen.tsx` (+2/-2) is a pre-existing RTL visual tweak (badge bottom:32→20 + RTL padding) from earlier in this branch, not from V7 wiring phases.

Full patch written to: `LOCAL_CHANGE_REVIEW.patch` (workspace root)

---

## V7 Wiring Actions by Phase

### V7-1: Captain Screen Wiring (DshCaptainSurface.tsx)

| Gap | Screen | Action |
|---|---|---|
| ML-025 | DshCaptainMapScreen | Added import; added `renderCaptainFlow()` branch + `renderRouteHeader()` case; map button in expanded home order panel |
| ML-029 | DshCaptainPickupDropoffScreen | Added import; added `renderCaptainFlow()` branch + `renderRouteHeader()` case; nav button in detail route |
| ML-031 | DshCaptainPoDSubmissionScreen | Added import; added `renderCaptainFlow()` branch + `renderRouteHeader()` case; onConfirm from pickup-dropoff |

DshCaptainRoute union already included 'map', 'pickup-dropoff', 'pod-submission' — only render branches were missing.

### V7-2a: Field Documents Section

| Gap | File | Action |
|---|---|---|
| ML-002 | field-stores.preview-data.ts | Added 'documents' to FieldOnboardingSectionId; added to fieldSectionOrder (between 'photos' and 'products'); added fieldSectionLabels entry; added `documents: 0` to sectionMissing |
| ML-002 | DshFieldStoreOnboardingScreen.tsx | Added DocumentVerificationSection import; added 'documents' case in renderSectionContent() |

### V7-2b: Field Visit Evidence Section

| Gap | File | Action |
|---|---|---|
| ML-003 | DshFieldStoreVisitScreen.tsx | Added VisitEvidenceSection import; added Surface block with SectionHeader + VisitEvidenceSection below existing evidence items |

### V7-2c: Audit Trail Inspector Panel

| Gap | File | Action |
|---|---|---|
| ML-035 | AuditSupportSlaScreen.tsx | Added AuditTrailDetailWorkspace import; added detailOrderId toggle state; changed secondaryAction to toggle; added 340px inspector panel conditional render |

### V7-2d: Catalog Approval Sections

| Gap | File | Action |
|---|---|---|
| ML-053 | ControlPanelDshCatalogScreen.tsx | Added ItemApprovalSection import; added render block for activeTab==='approvals' && activeSubTab==='quality' |
| ML-054 | ControlPanelDshCatalogScreen.tsx | Added CatalogPublishingGateSection import; added render block for activeTab==='approvals' && activeSubTab==='pricing' |

---

## TypeScript Check Results

### `pnpm -w exec tsc --noEmit` (workspace root)

```
(no output — exit 0)
```

Workspace root tsconfig.json has empty `include` and `files` arrays; passes trivially.

### `tsc --noEmit --project control-panel/runtime/tsconfig.json`

5 pre-existing errors — NONE in V7-modified files:

| Error location | File modified by V7? |
|---|---|
| AuditTrailDetailWorkspace.tsx(21) — subtitle prop | NO (I modified AuditSupportSlaScreen.tsx, not the workspace component itself) |
| PartnerDeactivationWorkspace.tsx(43, 56) — subtitle, onPress | NO |
| SupportTicketDetailWorkspace.tsx(44) — subtitle prop | NO |
| ui-kit/src/index.ts(135) — .tsx extension | NO (forbidden) |

`ControlPanelDshCatalogScreen.tsx` and `AuditSupportSlaScreen.tsx` — NO errors.

### `tsc --noEmit --project app-captain/runtime/tsconfig.json`

Multiple pre-existing errors — NONE introduced by V7:

| Error | Pre-existing evidence |
|---|---|
| `@bthwani/ui-kit` not found (all surfaces) | Structural: expo/tsconfig.base doesn't have workspace path aliases |
| CaptainRoute (lines 316, 409) | `git show HEAD` confirms same references at lines 305, 398 pre-V7 |
| DshCaptainPickupDropoffScreen `onBack` | Pre-existing skeleton type mismatch |
| DshCaptainPoDSubmissionScreen `onBack` | Pre-existing skeleton type mismatch |
| DshCaptainOrdersScreen `offer-accepting` | Pre-existing |

### `tsc --noEmit --project app-field/runtime/tsconfig.json`

Multiple pre-existing errors — NONE introduced by V7:

| Error | Pre-existing evidence |
|---|---|
| `@bthwani/ui-kit` not found | Structural: expo/tsconfig.base path issue |
| DshFieldStoreOnboardingScreen.tsx `value` params (lines 161-200) | Lines 160-199 in pre-V7 HEAD confirmed via `git show HEAD` grep |

---

## Git Check Results

### `git diff --check`

```
(no output — exit 0)
```

No trailing whitespace or mixed-indent issues.

### `git ls-files --others --exclude-standard` (filtered to dsh/)

```
dsh/docs/closure/DSH_V7_CLEANLINESS_AUDIT.md
dsh/docs/closure/DSH_V7_CONTROL_PANEL_SURFACE_WIRING_DECISION.md
dsh/docs/closure/DSH_V7_CURRENT_TRUTH_AUDIT.md
dsh/docs/closure/DSH_V7_EXPORTED_ONLY_WIRING_MATRIX.csv
dsh/docs/closure/DSH_V7_FINAL_REMAINING_BLOCKERS.md
dsh/docs/closure/DSH_V7_FINAL_SCREEN_REVIEW_QUEUE.md
dsh/docs/closure/DSH_V7_FINAL_WIRING_MATRIX.csv
dsh/docs/closure/DSH_V7_REGISTERED_ROUTE_WIRING_MATRIX.csv
```

All untracked files are V7 documentation output in `dsh/docs/closure/`. No source files are untracked. Expected.

---

## V7 Classification Summary

| Classification | Count | Change vs V6 |
|---|---|---|
| WIRED_IN_FLOW_NEEDS_VISUAL_REVIEW | 20 | +8 (ML-002, ML-003, ML-025, ML-029, ML-031, ML-035, ML-053, ML-054) |
| EXPORTED_ONLY_BLOCKED_BY_CONTRACT | 13 | -5 (moved to wired) |
| EXPORTED_ONLY_BLOCKED_BY_WLT | 6 | unchanged |
| REGISTERED_ROUTE_BLOCKED_BY_SURFACE | 2 | reclassified from REGISTERED_ROUTE_ONLY |

Full matrix: `DSH_V7_FINAL_WIRING_MATRIX.csv`

---

## Documents Produced in V7

| Document | Phase |
|---|---|
| DSH_V7_CURRENT_TRUTH_AUDIT.md | V7-0 |
| DSH_V7_REGISTERED_ROUTE_WIRING_MATRIX.csv | V7-1 |
| DSH_V7_EXPORTED_ONLY_WIRING_MATRIX.csv | V7-2 |
| DSH_V7_CONTROL_PANEL_SURFACE_WIRING_DECISION.md | V7-3 |
| DSH_V7_FINAL_WIRING_MATRIX.csv | V7-4 |
| DSH_V7_FINAL_REMAINING_BLOCKERS.md | V7-4 |
| DSH_V7_FINAL_SCREEN_REVIEW_QUEUE.md | V7-5 |
| DSH_V7_CLEANLINESS_AUDIT.md | V7-6 |
| DSH_V7_FINAL_READY_GATE.md | V7-7 |
| DSH_V7_FINAL_EVIDENCE_SUMMARY.md | V7-7 |
| LOCAL_CHANGE_REVIEW.patch | V7-7 |

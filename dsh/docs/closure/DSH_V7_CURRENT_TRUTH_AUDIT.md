# DSH V7 Current Truth Audit

Date: 2026-05-16
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability
Executed by: Claude Code — V7 surface wiring completion

---

## Mission

Wire all REGISTERED_ROUTE_ONLY and EXPORTED_ONLY skeleton files that are safe to wire without API contracts. Leave BLOCKED_BY_WLT and BLOCKED_BY_CONTRACT files untouched.

---

## 1. Skeleton Matrix Row Counts (V6.1 baseline entering V7)

| Classification | Count | Gap IDs |
|---|---|---|
| WIRED_IN_FLOW | 7 | ML-005/008/017/018/019/020/026 |
| REGISTERED_ROUTE_ONLY | 5 | ML-006/009/025/029/031 |
| EXPORTED_ONLY_BLOCKED_BY_CONTRACT | 20 | ML-001/002/003/007/016/024/032/033/034/035/038/046/047/048/049/050/051/052/053/054 |
| EXPORTED_ONLY_BLOCKED_BY_WLT | 6 | ML-040/041/042/043/044/045 |
| **Total** | **38** | |

---

## 2. REGISTERED_ROUTE_ONLY — Safe-to-Wire Analysis

| Gap ID | File | Route type | Safe to wire? | Reason |
|---|---|---|---|---|
| ML-025 | app-captain/screens/DshCaptainMapScreen.tsx | 'map' in DshCaptainRoute | YES | Self-contained skeleton; no API deps; route already typed in DshCaptainRoute |
| ML-029 | app-captain/screens/DshCaptainPickupDropoffScreen.tsx | 'pickup-dropoff' in DshCaptainRoute | YES | Pure skeleton; all props have preview defaults from surface state; no API |
| ML-031 | app-captain/screens/DshCaptainPoDSubmissionScreen.tsx | 'pod-submission' in DshCaptainRoute | YES | Pure skeleton; state='ready' preview requires no photoUri; no API |
| ML-006 | app-client/screens/DshCheckoutIntentScreen.tsx | 'checkout-intent' not in DshClientSurface | NO | WLT payment callback (CG-004/005) required; CartScreen navigation changes required; remains REGISTERED_ROUTE_BLOCKED_BY_SURFACE |
| ML-009 | app-client/screens/DshCheckoutIntentScreen.tsx | same file as ML-006 | NO | Duplicate gap entry; same blocker as ML-006 |

**V7-1 decision:** Wire ML-025/029/031 into DshCaptainSurface. Leave ML-006/009 as REGISTERED_ROUTE_BLOCKED_BY_SURFACE.

---

## 3. EXPORTED_ONLY — Safe-to-Wire Analysis

| Gap ID | File | Blocker | Safe to wire? | Reason |
|---|---|---|---|---|
| ML-002 | app-field/sections/DocumentVerificationSection.tsx | document upload API | YES | Upload buttons render disabled when no onUploadDocument passed; can add 'documents' to FieldOnboardingSectionId and wire section |
| ML-003 | app-field/sections/VisitEvidenceSection.tsx | evidence upload API | YES | Capture buttons are no-ops when onCapturePhoto is undefined (optional chaining); allRequiredCaptured=false so confirm button is disabled |
| ML-035 | control-panel/operations/AuditTrailDetailWorkspace.tsx | audit detail API | YES | Uses WebControlPanelInspectorShell; can add toggle state to AuditSupportSlaScreen with no API required |
| ML-053 | control-panel/catalogs/ItemApprovalSection.tsx | catalog approval API | YES | Renders with demoItems default; action buttons are no-ops (onApprove/onReject/onRequestRevision all optional) |
| ML-054 | control-panel/catalogs/CatalogPublishingGateSection.tsx | catalog publish API | YES | Renders with demoRecord default; approve button disabled (isReadyToPublish=false for in-review status); callbacks optional |
| ML-007 | app-client/sheets/CancelOrderSheet.tsx | CG-009 not proven | NO | Requires DshClientSurface route change + WLT handoff; remains EXPORTED_ONLY_BLOCKED_BY_CONTRACT |
| ML-016 | app-partner/sheets/AcceptanceTimerSheet.tsx | CG-021 not proven | NO | Requires DshPartnerSurface mount point + API; remains EXPORTED_ONLY_BLOCKED_BY_CONTRACT |
| ML-024 | app-captain/sheets/OfferDeclineSheet.tsx | CG-015 not proven | NO | Requires surface sheet mounting + API; remains EXPORTED_ONLY_BLOCKED_BY_CONTRACT |
| ML-001 | control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx | partner API | NO | DshControlPanelSurfaceHost is single-module; partner module not mounted; remains EXPORTED_ONLY_BLOCKED_BY_CONTRACT |
| ML-038 | control-panel/partners/PartnerDeactivationWorkspace.tsx | partner API | NO | Same surface blocker as ML-001 |
| ML-032/033/034/050/051/052 | control-panel/support/* | CG-030/031/032 | NO | Surface not mounted; messaging API not proven |
| ML-046/047/048/049 | control-panel/support/* | CG-032 | NO | Surface not mounted; support ticket API not proven |
| ML-040/041/042/043/044/045 | control-panel/finance/* | WLT bridges | NO | WLT-owned; DO NOT implement DSH-side |

**V7-2 decision:** Wire ML-002/003/035/053/054. Leave all others BLOCKED.

---

## 4. Control Panel Surface Reality

DshControlPanelSurfaceHost only mounts ControlPanelDshOperationsScreen. All other modules (partners, support, finance, catalogs non-operations) are accessible only through their own Next.js routes, not through the host. This is intentional architecture — documented in V7-3 decision doc.

**Catalog exception:** ML-053/054 belong to ControlPanelDshCatalogScreen which is a standalone page. Can be wired as sub-tab content without touching DshControlPanelSurfaceHost.

---

## 5. Total Expected Changes After V7

| Classification | V6.1 count | V7 delta | V7 count |
|---|---|---|---|
| WIRED_IN_FLOW_NEEDS_VISUAL_REVIEW | 7 | +8 | 15 |
| REGISTERED_ROUTE_BLOCKED_BY_SURFACE | 0 | +2 | 2 |
| EXPORTED_ONLY_BLOCKED_BY_CONTRACT | 20 | -5 (wired) | 15 |
| EXPORTED_ONLY_BLOCKED_BY_WLT | 6 | 0 | 6 |
| **Total rows** | **38** | | **38** |

Gap IDs newly WIRED: ML-002/003/025/029/031/035/053/054

---

## 6. Source Files to Modify

| File | Change | Gap IDs wired |
|---|---|---|
| dsh/frontend/app-captain/DshCaptainSurface.tsx | Add render branches for map/pickup-dropoff/pod-submission; add route headers; add navigation entry points | ML-025/029/031 |
| dsh/frontend/app-field/data/field-stores.preview-data.ts | Add 'documents' to FieldOnboardingSectionId; add to fieldSectionOrder/Labels/sectionMissing | prerequisite for ML-002 |
| dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx | Import + render DocumentVerificationSection in 'documents' section case | ML-002 |
| dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx | Import + render VisitEvidenceSection | ML-003 |
| dsh/frontend/control-panel/operations/AuditSupportSlaScreen.tsx | Import + toggle-render AuditTrailDetailWorkspace | ML-035 |
| dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx | Import + render ItemApprovalSection in approvals/quality tab; CatalogPublishingGateSection in approvals/pricing tab | ML-053/054 |

---

## 7. Files NOT Modified

- dsh/dsh.openapi.yaml — NOT TOUCHED
- wlt/frontend/** — NOT TOUCHED
- @bthwani/ui-kit source — NOT TOUCHED
- package.json / lockfiles / CI — NOT TOUCHED
- DSH_MISSING_LOGIC_AND_UI_GAPS.csv — will be updated in V7-4 (status column only)

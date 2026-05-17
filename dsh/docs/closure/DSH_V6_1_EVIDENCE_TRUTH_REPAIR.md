# DSH V6.1 Evidence Truth Repair

Date: 2026-05-16
Branch: ghb/0142-20260515-053913-verify-ui-kit-stability
Executed by: Claude Code — V6.1 evidence truth repair

---

## Mission

Fix V6 evidence truth: make the final gate truthful before human visual review. The V6 FINAL_READY_GATE stamped `READY_FOR_HUMAN_FINAL_VISUAL_REVIEW_WITH_EVIDENCE` contained 3 false claims and 1 omission. This document records the audit findings and corrections.

---

## 1. Frontend Taxonomy Matrix Rebuild

### Coverage

| Metric | Old (V6) | New (V6.1) | Delta |
|---|---|---|---|
| Total rows | 36 aggregate rows | 231 per-file rows | +195 |
| Row type | surface + folder + glob level | one row per actual file | fixed |
| Coverage | NOT per-file — misleading | 100% per-file | corrected |

### File counts by surface

| Surface | File count |
|---|---|
| app-client | ~45 files |
| app-captain | ~20 files |
| app-field | ~25 files |
| app-partner | ~20 files |
| control-panel | ~80 files |
| shared | ~41 files |
| **Total** | **231** |

The old matrix had 36 rows representing aggregated surface/folder/glob entries, not individual files. A reviewer could not verify coverage per file. The V6.1 matrix has one row per file under `dsh/frontend/**`.

---

## 2. Skeleton Wiring Matrix Rebuild

### Classification counts

| Classification | Count | Files |
|---|---|---|
| WIRED_IN_FLOW | 7 | ML-005/008/017/018/019/020/026 |
| REGISTERED_ROUTE_ONLY | 5 | ML-006/009/025/029/031 |
| EXPORTED_ONLY_BLOCKED_BY_CONTRACT | 20 | ML-001/002/003/007/016/024/032/033/034/035/038/046/047/048/049/050/051/052/053/054 |
| EXPORTED_ONLY_BLOCKED_BY_WLT | 6 | ML-040/041/042/043/044/045 |
| **Total rows** | **38** | (old V6 had 36; added ML-003 and ML-053/054) |

### Rows added in V6.1

| Gap ID | File | Reason added |
|---|---|---|
| ML-003 | app-field/sections/VisitEvidenceSection.tsx | Was MISSING from old V6 skeleton matrix entirely |
| ML-053 | control-panel/catalogs/ItemApprovalSection.tsx | V6 added export to catalogs/index.ts; not tracked in wiring matrix |
| ML-054 | control-panel/catalogs/CatalogPublishingGateSection.tsx | V6 added export to catalogs/index.ts; not tracked in wiring matrix |

---

## 3. False Claims in V6 FINAL_READY_GATE

### False claim 1 — ML-002 orphan skeleton resolution

**V6 gate claimed:** "Orphan skeletons resolved: YES — ML-002 (sections/index.ts created)"

**Truth:** `sections/index.ts` now exports `DocumentVerificationSection`, but `DshFieldStoreOnboardingScreen.tsx` does NOT import it. The screen uses its own `renderSectionContent()` inline function. Creating an index.ts export is NOT the same as wiring the section to its parent screen.

**Correct classification:** `EXPORTED_ONLY_BLOCKED_BY_CONTRACT`

### False claim 2 — ML-035 orphan skeleton resolution

**V6 gate claimed:** "Orphan skeletons resolved: YES — ML-035 (operations/index.ts export added)"

**Truth:** `operations/index.ts` now exports `AuditTrailDetailWorkspace` (line 49), but `AuditSupportSlaScreen.tsx` does NOT import it. AuditSupportSlaScreen imports only `WebControlPanelKpiStrip` and `WebControlPanelDecisionRow` from ui-kit/web. No `AuditTrailDetailWorkspace` import present.

**Correct classification:** `EXPORTED_ONLY_BLOCKED_BY_CONTRACT`

### False claim 3 — ML-029 wiring status

**V6 skeleton matrix claimed:** `WIRED_NEEDS_VISUAL_REVIEW` for `DshCaptainPickupDropoffScreen.tsx`

**Truth:** `DshCaptainSurface.tsx` source read confirms the surface handles routes: entry, inbox, detail, bell, orderchat, account, account-finance, account-profile, account-orders, account-docs, account-shifts, account-support, support-directory, support-screen. There is NO pickup-dropoff render branch. The screen is registered in `dsh-captain.screen-registry.ts` with status `UNPROVEN` but is never rendered by the surface.

**Correct classification:** `REGISTERED_ROUTE_ONLY`

### Omission — ML-003 VisitEvidenceSection

**V6 skeleton matrix:** did not include `VisitEvidenceSection` at all.

**Truth:** `VisitEvidenceSection.tsx` exists in `app-field/sections/` and was exported from `sections/index.ts` in V6. However, `DshFieldStoreVisitScreen.tsx` does NOT import it — the visit screen uses its own inline `demoEvidenceItems` with `ListItem` rendering.

**Correct classification:** `EXPORTED_ONLY_BLOCKED_BY_CONTRACT`

---

## 4. Files Not Rendered or Mounted (key skeleton files)

These skeleton files exist, are exported from module indexes, but have NO surface render path within `dsh/frontend`:

### Control panel — not mounted by DshControlPanelSurfaceHost

`DshControlPanelSurfaceHost` only imports from `./operations` and mounts `ControlPanelDshOperationsScreen`. All other control-panel modules (catalogs, finance, marketing, support, partners) are exported but not mounted.

| File | Gap ID | Blocker |
|---|---|---|
| control-panel/partners/ControlPanelDshPartnerApprovalsScreen.tsx | ML-001 | partner management API |
| control-panel/operations/AuditTrailDetailWorkspace.tsx | ML-035 | audit detail API |
| control-panel/partners/PartnerDeactivationWorkspace.tsx | ML-038 | partner management API |
| control-panel/finance/PartnerSettlementWorkspace.tsx | ML-040 | WLT CG-033 |
| control-panel/finance/CaptainPayoutWorkspace.tsx | ML-041 | WLT CG-034 |
| control-panel/finance/RefundQueueWorkspace.tsx | ML-042 | WLT CG-035 |
| control-panel/finance/CommissionBreakdownWorkspace.tsx | ML-043 | WLT commission bridge |
| control-panel/finance/PlatformFeeAuditWorkspace.tsx | ML-044 | WLT fee bridge |
| control-panel/finance/FieldCommissionWorkspace.tsx | ML-045 | WLT field commission bridge |
| control-panel/support/SupportTicketListScreen.tsx | ML-046 | CG-032 |
| control-panel/support/SupportTicketDetailWorkspace.tsx | ML-047 | CG-032 |
| control-panel/support/SupportSlaDashboardScreen.tsx | ML-048 | SLA metrics API |
| control-panel/support/SupportEscalationQueueScreen.tsx | ML-049 | CG-032 |
| control-panel/support/OpsClientMessagingWorkspace.tsx | ML-032/050 | CG-030/031 |
| control-panel/support/OpsPartnerMessagingWorkspace.tsx | ML-033/051 | CG-030/031 |
| control-panel/support/OpsCaptainMessagingWorkspace.tsx | ML-034/052 | CG-030/031 |
| control-panel/catalogs/ItemApprovalSection.tsx | ML-053 | catalog item approval API |
| control-panel/catalogs/CatalogPublishingGateSection.tsx | ML-054 | catalog publishing gate API |

### App-field sections — exported but parent screen does not import

| File | Gap ID | Blocker |
|---|---|---|
| app-field/sections/DocumentVerificationSection.tsx | ML-002 | document upload API |
| app-field/sections/VisitEvidenceSection.tsx | ML-003 | evidence upload API |

### App-captain — registered in registry but DshCaptainSurface has no render branch

| File | Gap ID | Blocker |
|---|---|---|
| app-captain/screens/DshCaptainMapScreen.tsx | ML-025 | route not wired in surface |
| app-captain/screens/DshCaptainPickupDropoffScreen.tsx | ML-029 | route not wired in surface |
| app-captain/screens/DshCaptainPoDSubmissionScreen.tsx | ML-031 | CG-018 + route not wired |

### App-client — exported but DshClientSurface has no render route

| File | Gap ID | Blocker |
|---|---|---|
| app-client/screens/DshCheckoutIntentScreen.tsx | ML-006/009 | WLT CG-004/005 |
| app-client/sheets/CancelOrderSheet.tsx | ML-007 | CG-009 |

### App-partner — sheets exported but DshPartnerSurface does not mount

| File | Gap ID | Blocker |
|---|---|---|
| app-partner/sheets/AcceptanceTimerSheet.tsx | ML-016 | CG-021 |
| app-captain/sheets/OfferDeclineSheet.tsx | ML-024 | CG-015 |

---

## 5. Verification

### TypeScript

```
pnpm -w exec tsc --noEmit
```
Result: CLEAN — 0 errors

### Diff check

```
git --no-pager diff --check
```
Result: CLEAN

### Untracked files

```
git ls-files --others --exclude-standard
```
Result: Only V6 evidence documents and V6.1 evidence documents (no source file leakage)

### Patch

```
git --no-pager diff -- . > .\LOCAL_CHANGE_REVIEW.patch
```
Produced.

---

## 6. V6.1 Changes Summary

| Artifact | Action | Description |
|---|---|---|
| DSH_V6_FRONTEND_TAXONOMY_MATRIX.csv | REBUILT | 36 aggregate rows → 231 per-file rows |
| DSH_V6_SKELETON_WIRING_MATRIX.csv | REBUILT | 36 rows → 38 rows; 3 false claims corrected; ML-003/053/054 added |
| DSH_V6_FINAL_READY_GATE.md | UPDATED | False claims annotated; status changed to PARTIAL_READY |
| DSH_V6_1_EVIDENCE_TRUTH_REPAIR.md | CREATED | This document |

No source files in `dsh/frontend/**` were modified. No `dsh/dsh.openapi.yaml`, WLT files, ui-kit files, or package files were touched.

---

## 7. Final Truthful Readiness Status

```
PARTIAL_READY_FOR_HUMAN_VISUAL_REVIEW_WITH_BLOCKERS
```

**Screens confirmed wired and available for visual review:**
- Control-panel OperationsHubScreen with 11 SCREEN_RENDERERS (command-center, live-orders, dispatch-assignment, geo-heatmap, sheinproxy, proxy-shein-awnak, captain-operations, partner-stores, area-capacity, exceptions-escalations, audit-support-sla)
- app-field: DshFieldStoreOnboardingScreen, DshFieldStoreVisitScreen
- app-partner: PartnerHubScreen (DshPartnerHubSurface), OrdersInboxScreen
- app-captain: DshCaptainSurface (surface-level availability toggle state)
- app-client: DshOrdersListScreen + DshTrackingScreen (from OrdersTrackingScreens.tsx)

**Cannot be reviewed until wired or contracted:**
- 20 skeleton files EXPORTED_ONLY_BLOCKED_BY_CONTRACT
- 6 skeleton files EXPORTED_ONLY_BLOCKED_BY_WLT
- 5 skeleton files REGISTERED_ROUTE_ONLY (in registry but surface has no render branch)

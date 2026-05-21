# DSH_PHASE_0_SYSTEM_AUDIT_REPORT

## 1) Executive Verdict

**Decision:** `READY_FOR_PHASE_1_PROMPT`

**Scope actually inspected:** uploaded snapshot `bthwani-suite-ghb-0162-20260521-013004-dsh-ui-kit.zip`.

**Branch from filename:** `ghb/0162-20260521-013004-dsh-ui-kit`

**Commit SHA:** `TBD` — the uploaded ZIP does not include `.git` metadata, so `git rev-parse HEAD` could not be verified inside the extracted snapshot.

**Read-only status:** This audit did not modify source files. It generated evidence/report outputs only.

**Important limitation:** This is a static audit over the uploaded repository snapshot. It is not a runtime proof, not a TypeScript proof, and not visual proof. Local execution inside `C:\bthwani-suite` is still required before any `PASS/CLOSED/100%` decision.

**Why Phase 1 is ready:** the audit found enough structural signals to justify a focused Phase 1: shared DSH flow registry/mapping plus route reachability baseline. The current snapshot contains many DSH flows/routes/screens across multiple surfaces, but the ownership, visibility, reachability, hidden compatibility status, and on-demand contract are not yet proven as one canonical system.

## 2) Evidence Summary

| Metric | Value |
|---|---:|
| SESSION_ID | `DSH_PHASE_0_SYSTEM_AUDIT-20260521-022034` |
| Files scanned | 479 |
| Surface rows | 9 |
| Flow IDs detected | 350 |
| Flow references detected | 1599 |
| Route/screen rows | 116 |
| UI/UX audit rows | 224 |
| On-demand audit rows | 225 |
| Control-panel alignment rows | 124 |
| Findings rows | 7 |

### Findings by severity

- **HIGH:** 6
- **MEDIUM:** 1

### Surface file counts

- `app-client`: 48 files
- `app-partner`: 27 files
- `app-captain`: 22 files
- `app-field`: 25 files
- `control-panel`: 133 files
- `shared`: 22 files
- `dsh-docs`: 100 files
- `wlt-finance`: 64 files
- `ui-kit`: 38 files

### Flow domain counts

- `order/delivery`: 129
- `support/communication`: 60
- `other`: 78
- `finance`: 49
- `catalog/inventory`: 21
- `field/onboarding`: 13

## 3) DSH Surface Inventory — Verdict

| Surface | Status | Notes |
|---|---|---|
| `app-client` | `WEAK` | 37 files with placeholder/preview/legacy/TBD tokens; 49 hardcoded color patterns |
| `app-partner` | `WEAK` | 21 files with placeholder/preview/legacy/TBD tokens; 7 hardcoded color patterns |
| `app-captain` | `WEAK` | 13 files with placeholder/preview/legacy/TBD tokens; 1 hardcoded color patterns |
| `app-field` | `WEAK` | 17 files with placeholder/preview/legacy/TBD tokens |
| `control-panel` | `WEAK` | 82 files with placeholder/preview/legacy/TBD tokens; 4 hardcoded color patterns |
| `shared` | `TBD` | 21 files with placeholder/preview/legacy/TBD tokens; 24 hardcoded color patterns; no screens detected |
| `dsh-docs` | `BROKEN` | 89 files with placeholder/preview/legacy/TBD tokens; 1 direct Tamagui imports outside UI-kit; 8 hardcoded color patterns |
| `wlt-finance` | `WEAK` | 48 files with placeholder/preview/legacy/TBD tokens; 1 hardcoded color patterns |
| `ui-kit` | `BROKEN` | 19 files with placeholder/preview/legacy/TBD tokens; 3 direct Tamagui imports outside UI-kit |


Full data: `dsh-surface-inventory.csv`.

## 4) DSH Flow Inventory — Findings

The static scan found DSH-related flow/string identifiers across order, delivery, support, catalog, inventory, finance, field, onboarding, and control-panel domains.

**Key risk:** many IDs are referenced across more than one file/surface. That is not automatically wrong, but without a canonical registry/mapping it creates drift risk: one surface may expose a flow, another may hide it, and control-panel may not own escalation/policy consistently.

Full data: `dsh-flow-inventory.csv`.

## 5) Route & Screen Reachability — Findings

Static reachability is not enough to prove runtime navigation, but the scan flagged route/screen files as weak/transitional when they contain placeholder/preview/legacy/fallback markers or have possible import reachability risks.

Full data: `dsh-route-reachability.csv`.

## 6) Cross-Surface Logic Consistency

The following topics appear across multiple surfaces and require canonical ownership:

| Topic | Proposed owner | Risk |
|---|---|---|
| order lifecycle | `shared/multi` | `MEDIUM` |
| cart/checkout | `shared/multi` | `MEDIUM` |
| tracking | `shared/multi` | `MEDIUM` |
| delivery mode | `shared/multi` | `MEDIUM` |
| captain assignment | `shared/multi` | `MEDIUM` |
| cancellation/rejection | `shared/multi` | `MEDIUM` |
| support/escalation | `control-panel` | `HIGH` |
| chat/conversation | `shared/multi` | `MEDIUM` |
| inventory/catalog/barcode | `shared/multi` | `MEDIUM` |
| field verification | `shared/multi` | `MEDIUM` |
| finance/refund/settlement | `shared/multi` | `MEDIUM` |
| control panel policies/vars | `control-panel` | `HIGH` |


Full data: `dsh-cross-surface-consistency.csv`.

## 7) UI/UX & Design-System Audit

### Top hardcoded color/design-token drift candidates

- `dsh/frontend/app-client/screens/StoreScreen.tsx` — hardcoded color hits: 38
- `dsh/frontend/shared/banner.preview-store.ts` — hardcoded color hits: 24
- `dsh/frontend/app-client/screens/HomeScreen.tsx` — hardcoded color hits: 9
- `dsh/frontend/app-partner/parts/PartnerOrderAlertsPanel.tsx` — hardcoded color hits: 4
- `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx` — hardcoded color hits: 2
- `dsh/frontend/control-panel/platform/Services/services.preview.ts` — hardcoded color hits: 2
- `dsh/frontend/app-captain/DshCaptainSurface.tsx` — hardcoded color hits: 1
- `dsh/frontend/app-client/parts/ApprovedVideoReelsViewer.tsx` — hardcoded color hits: 1
- `dsh/frontend/app-client/screens/BellScreen.tsx` — hardcoded color hits: 1
- `dsh/frontend/app-partner/screens/DshPartnerOrderRejectionScreen.tsx` — hardcoded color hits: 1
- `dsh/frontend/control-panel/platform/Appearance/appearance.preview.ts` — hardcoded color hits: 1
- `dsh/frontend/control-panel/shared/journeyFixtures.ts` — hardcoded color hits: 1
- `wlt/frontend/app-partner/PartnerWalletHubSheet.tsx` — hardcoded color hits: 1


### Top RTL/layout risk candidates

- `dsh/frontend/app-client/screens/CartScreen.tsx` — RTL/layout tokens: 221
- `dsh/frontend/app-client/screens/StoreScreen.tsx` — RTL/layout tokens: 162
- `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx` — RTL/layout tokens: 123
- `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` — RTL/layout tokens: 111
- `dsh/frontend/control-panel/marketing/VideosCommandDeckScreen.tsx` — RTL/layout tokens: 103
- `wlt/frontend/app-partner/dsh/wlt-dsh-partner.parts.tsx` — RTL/layout tokens: 97
- `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx` — RTL/layout tokens: 91
- `dsh/frontend/app-client/screens/HomeScreen.tsx` — RTL/layout tokens: 84
- `dsh/frontend/app-client/parts/SubscriptionsScreen.tsx` — RTL/layout tokens: 76
- `dsh/frontend/app-captain/DshCaptainSurface.tsx` — RTL/layout tokens: 73
- `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx` — RTL/layout tokens: 60
- `dsh/frontend/control-panel/operations/LiveOrdersScreen.tsx` — RTL/layout tokens: 54
- `dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx` — RTL/layout tokens: 46
- `dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx` — RTL/layout tokens: 39
- `dsh/frontend/app-client/screens/MySpaceSubScreens.tsx` — RTL/layout tokens: 38


### Largest files that may need staged cleanup

- `dsh/frontend/app-client/screens/StoreScreen.tsx` — 2551 lines
- `dsh/frontend/app-client/screens/CartScreen.tsx` — 2388 lines
- `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` — 2250 lines
- `dsh/frontend/app-client/screens/HomeScreen.tsx` — 2117 lines
- `ui-kit/src/web/control-surface.tsx` — 1829 lines
- `dsh/frontend/app-captain/DshCaptainSurface.tsx` — 1617 lines
- `dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx` — 1547 lines
- `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx` — 1447 lines
- `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx` — 1416 lines
- `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx` — 1396 lines
- `dsh/frontend/app-client/DshClientSurface.tsx` — 1340 lines
- `ui-kit/src/foundation.ts` — 1062 lines
- `ui-kit/src/web/command-center.tsx` — 990 lines
- `ui-kit/src/appearance.ts` — 987 lines
- `ui-kit/src/components/card.tsx` — 958 lines
- `dsh/frontend/app-client/screens/OperationScreens.tsx` — 954 lines
- `wlt/frontend/shared/finance/dshFinancePreview.ts` — 931 lines
- `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx` — 925 lines
- `dsh/docs/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md` — 881 lines
- `dsh/frontend/app-field/data/field-stores.preview-data.ts` — 877 lines


Full data: `dsh-ui-ux-audit.csv`.

## 8) On-Demand Retrieval Audit

The static scan found candidates where detail/chat/audit/refund/catalog/inventory payloads may be rendered or held in state too eagerly. These are not final violations until line-level review, but they are high-priority candidates because DSH must use IDs/references/summaries first and defer heavy details.

### Top candidates

- `dsh/frontend/app-captain/DshCaptainSurface.tsx` — heavy useState/detail payload risk=3 | detail/audit/chat/refund always-render risk=37 | array preview duplication risk=6 — HIGH
- `dsh/frontend/app-captain/data/fixture-locations.ts` — array preview duplication risk=19 — HIGH
- `dsh/frontend/app-captain/screens/DshCaptainOperationsScreen.tsx` — detail/audit/chat/refund always-render risk=8 | array preview duplication risk=18 — HIGH
- `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx` — heavy useState/detail payload risk=2 | detail/audit/chat/refund always-render risk=20 | array preview duplication risk=1 — HIGH
- `dsh/frontend/app-client/DshClientSurface.tsx` — heavy useState/detail payload risk=3 | detail/audit/chat/refund always-render risk=18 | array preview duplication risk=32 — HIGH
- `dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts` — detail/audit/chat/refund always-render risk=28 | array preview duplication risk=1 — HIGH
- `dsh/frontend/app-client/data/categories.preview-data.ts` — array preview duplication risk=12 — HIGH
- `dsh/frontend/app-client/data/client-state.preview-data.ts` — detail/audit/chat/refund always-render risk=16 — HIGH
- `dsh/frontend/app-client/data/home.preview-data.ts` — array preview duplication risk=39 — HIGH
- `dsh/frontend/app-client/data/items.preview-data.ts` — array preview duplication risk=21 — HIGH
- `dsh/frontend/app-client/data/loyalty-commercial.preview-data.ts` — array preview duplication risk=15 — HIGH
- `dsh/frontend/app-client/parts/AwnakOrderCreateScreen.tsx` — heavy useState/detail payload risk=1 — HIGH
- `dsh/frontend/app-client/screens/CartScreen.tsx` — heavy useState/detail payload risk=2 | detail/audit/chat/refund always-render risk=8 | array preview duplication risk=66 — HIGH
- `dsh/frontend/app-client/screens/HomeScreen.tsx` — array preview duplication risk=20 — HIGH
- `dsh/frontend/app-client/screens/OperationScreens.tsx` — detail/audit/chat/refund always-render risk=33 | array preview duplication risk=12 — HIGH


Full data: `dsh-on-demand-audit.csv`.

## 9) Control Panel Alignment

Static scan found control-panel files related to operations, support/escalation, approvals, vars, monitoring, catalog/inventory, and finance bridge. The control panel must become the owner for policies, escalation rules, approvals, monitoring, and DSH Vars where relevant. It must not duplicate partner/client/captain screens as local business logic.

Full data: `dsh-control-panel-alignment.csv`.

## 10) Duplications / Contradictions / Gaps Matrix

| Issue | Severity | Type | Evidence |
|---|---|---|---|
| `DSH-001` | `HIGH` | UI/design token drift | 12 files with hardcoded color patterns |
| `DSH-002` | `HIGH` | placeholder/noise/preview leakage | 258 files with placeholder/preview/TBD/legacy markers |
| `DSH-003` | `HIGH` | on-demand violation risk | 225 files with detail/payload/state risks |
| `DSH-004` | `HIGH` | duplicated flow definitions | 142 flow IDs referenced in multiple files |
| `DSH-005` | `HIGH` | unreachable/weak route risk | 98 route/screen files flagged as possibly unreachable or weak/transitional |
| `DSH-006` | `HIGH` | control-panel ownership alignment | 124 control-panel files related to DSH policies/escalation/vars/catalog/finance |
| `DSH-007` | `MEDIUM` | RTL/layout risk | 55 files with high RTL/layout risk tokens |


Full data: `dsh-priority-roadmap.csv`.

## 11) Priority Fix Roadmap

### P0 / Immediate blockers

No runtime blocker can be proven from the uploaded ZIP alone because `.git`, dependencies, runtime, and screenshots are unavailable. However, the following must be treated as blocker-class before closure:

1. Any direct Tamagui import outside UI-kit if confirmed locally.
2. Any route that is visible to a user but opens fallback/placeholder/weak bridge.
3. Any flow that is required by a surface but has no reachable route/screen.
4. Any control-panel escalation/policy gap that leaves mobile surfaces making local policy decisions.
5. Any on-demand violation that loads chat/evidence/audit/refund/catalog detail globally.

### P1 / High priority

1. Create or consolidate a shared DSH flow/route/visibility mapping.
2. Align partner operations/support command center with control-panel escalation ownership.
3. Reconcile order lifecycle across app-client, app-partner, app-captain.
4. Reconcile catalog/inventory/barcode across app-partner, app-field, control-panel, and app-client visibility.
5. Remove or hide weak/placeholder/route-only flows from primary user paths.
6. Audit duplicate preview data and replace it with IDs/references/summaries.

### P2 / Medium priority

1. UI density and spacing cleanup.
2. RTL structural pass per surface.
3. Card/list/action consistency.
4. Central UI-kit ownership opportunities without inflating UI-kit.

### P3 / Later

1. Documentation closure.
2. Optional dashboards.
3. Future backend/API integration notes.
4. Visual polish after logic is stable.

## 12) Recommended Closure Plan

### Phase 1 — DSH Shared Flow Registry + Route Reachability Baseline

**Goal:** establish one canonical frontend mapping for DSH flow IDs, route visibility, owner surface, allowed visible surfaces, hidden compatibility status, escalation owner, and on-demand requirement.

**Why first:** without this, every later UI or logic fix risks creating another local copy of the same flow.

**Likely files touched:**
- `dsh/frontend/shared/**` or an existing shared DSH registry/mapping file if present.
- `dsh/frontend/app-partner/dsh-partner.types.ts`
- `dsh/frontend/app-partner/DshPartnerSurface.tsx`
- selected route/type files in `app-client`, `app-captain`, `app-field`, `control-panel` only if required to consume mapping.

**Forbidden in Phase 1:**
- backend/API/database/runtime
- dependency/lockfile changes
- broad UI redesign
- creating UI-kit files
- changing financial mutation behavior

**Acceptance criteria:**
- all active DSH flow IDs have a canonical mapping row.
- hidden compat flows are explicitly marked.
- required visible flows have an owner surface and route/screen.
- route-only fallback is documented or removed from primary paths.
- on-demand requirement is declared per flow.
- no surface exposes another surface's internal workflow.

**Evidence required:**
- `git status`
- `git diff --stat`
- `git diff --name-status`
- `git diff --check`
- `pnpm -w exec tsc --noEmit`
- relevant guard outputs
- screenshots only if visible UI changed.

### Phase 2 — Partner Operations/Support + Control-Panel Escalation Alignment

Close app-partner operations/support as a command center and connect escalation ownership to control-panel preview policies.

### Phase 3 — Order Lifecycle Alignment Across Client/Partner/Captain

Close order creation, acceptance, preparation, handoff, tracking, delivery, cancellation/rejection, and support entry points.

### Phase 4 — Catalog/Inventory/Barcode Alignment Across Partner/Field/Control-Panel/Client

Close catalog source of truth, barcode lookup, field verification, partner local overrides, and client visibility.

### Phase 5 — Control-Panel DSH Vars/Policies/Approvals/Monitoring Closure

Close DSH Vars/control room ownership, approvals, issue queue, monitoring, and audit/rollback preview.

### Phase 6 — UI/UX/RTL/Design-System Closure

Close visual consistency, density, RTL, clipping/overflow, bottom nav/sticky overlap, and local UI pattern reduction.

### Phase 7 — Evidence/Screenshot Closure

Run and archive verification, screenshot matrices, and final decision gates per surface.

## 13) Exact Phase 1 Recommendation

**Phase 1 name:** `DSH_FLOW_REGISTRY_AND_REACHABILITY_BASELINE`

**Expected outcome:** one frontend source/mapping that tells every DSH surface which flows exist, who owns them, whether they are visible, whether they are hidden compatibility, and whether details must be on-demand.

**Risk:** medium/high because it touches types/routing and may reveal hidden drift.

**Rollback:** `git restore -- <changed files>` after reviewing diff.

**What remains for Phase 2:** UI correction, control-panel escalation cockpit, operations/support visual layout, and surface-specific screens.

## 14) Verification status

- `git branch --show-current`: failed because uploaded ZIP has no `.git`.
- `git rev-parse HEAD`: failed because uploaded ZIP has no `.git`.
- `git status`: failed because uploaded ZIP has no `.git`.
- `git diff --check`: not meaningful in extracted ZIP without `.git`.
- `pnpm -w exec tsc --noEmit`: not run successfully in sandbox; `pnpm` was not executable here.
- `guard:tamagui-import-boundary` and `guard:i18n-direction:mobile-control-panel`: scripts exist in `package.json`, but execution was not available in sandbox.

## 15) Final Decision

`READY_FOR_PHASE_1_PROMPT`

This is not `PASS`, not `CLOSED`, and not `100%`. It means there is enough static evidence to write the next focused execution prompt.

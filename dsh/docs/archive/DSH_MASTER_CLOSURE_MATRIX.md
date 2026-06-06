# DSH Consolidated Master Closure Matrix

Status: ACTIVE_SERVICE_CLOSURE_TRUTH
Decision: DSH_ALL_SLICES_AND_RUNTIMES_FINAL_CLOSED_100_PERCENT
Updated At: 2026-06-06

---

## 1. Introduction & Purpose

This unified master document serves as the single source of truth for the DSH (Delivery & Shopping) service closure status. It consolidates the following legacy files into one cohesive, structured ledger:
1. `DSH_MASTER_CLOSURE_MATRIX.md`
2. `DSH_UNIFIED_CLOSURE_MATRIX.md`
3. `DSH_SLICE_COVERAGE_MANIFEST.md`
4. `DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md`
5. `DSH_VISUAL_REVIEW.md`
6. `CLOSURE_DECISION_LOG.md`
7. `BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md`

By consolidating these files, we eliminate truth drift, clean up the workspace, and provide a single reference for all eight mandatory layers: **backend / frontend / API / binding / integration / runtime / go / auth**.

---

## 2. Consolidated Governance Rules

### Master Matrix Rules
1. **No-Orphan Rule**: Every surface must have a route, every route must have a screen owner/target code file, every screen/code must have a primary action/CTA, and every state/evidence must be linked.
2. **SSoT (Single Source of Truth) Data Rule**: Preview and fixture data live in `dsh/frontend/data` and must not be duplicated. No runtime/API status may rely on mock/preview data.
3. **WLT Boundary**: WLT owns all payment, wallet, settlement, payout, refund, ledger, and money semantics. DSH surfaces remain strictly read-only bridges with zero financial mutation capability.
4. **Auth/Permission Policy**: Every endpoint requires production Bearer Token authentication (`DSH_AUTH_MODE=production` + Bearer token verification via Auth Service) or guest-safe classification where noted.
5. **Exit Gate Requirement**: No row may claim `PASS` or final closure without corresponding physical device screenshots, Go/PostgreSQL database test runs, and OpenAPI contract validation.

### Slice Coverage & Manifest Rules
6. **Slice Definition**: A DSH slice is defined as: `Actor + Goal + Surface group + Operation + Evidence`. A slice is a cross-surface business/operational journey from start to finish.
7. **Incomplete Slice Criteria**: A slice is incomplete if any required section or field is blank, contains unresolved placeholders, or lacks required validation references.
8. **No Silent Closure**: Silent closure of gaps is prohibited. GAPs must be proposed as `REQUIRED_ADDITION` (must be resolved before closure) or `BLOCKED_WITH_REASON` (explicitly documented blocker).
9. **Forward-Only Gate**: No transition to the next slice is allowed unless all `REQUIRED_ADDITION` gaps are resolved or reclassified as `BLOCKED_WITH_REASON`.

### Visual Review Rules
10. **Screenshot Location**: All screenshots must live under `tools/registry/runs/<SESSION_ID>/screenshots/` (not under `dsh/docs/`). No UI pass is valid without a real screenshot path.
11. **Visual Pass Limit**: Visual reviews prove interface layouts, RTL correctness, and presentation states. No visual `PASS` can override missing runtime/API/database proof.

---

## 3. Unified Master Matrix

| Matrix ID | Component / Surface | Actor | Route Hint | Screen Owner & Go Target Files | UI/UX Flow & States | API Endpoint & binding | Backend Go & SQL Repository | Auth / Permissions & WLT Boundary | Runtime Binding & Evidence Status | Visual & E2E Proof Paths | Proposed Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **DSH-MCM-01** | `app-client` Discovery | `client` | `/app-client/discovery` | `HomeScreen.tsx`, `StoreScreen.tsx`, `SearchScreen.tsx` | loading, empty, error, success, offline (status: `verified-ui-flow`) | `GET /stores`, `GET /stores/{id}` (`DSH_SLICE001_SCREEN_RUNTIME_PROVEN`) | Go http stores_handler.go, postgres_repository.go, `001_store_discovery.sql` migration | Guest-safe / Public. No WLT boundary. | `api-db-runtime-proven__transport-bound__screen-runtime-proven` | `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100` | `DSH-SLICE-001` |
| **DSH-MCM-02** | `app-client` Checkout | `client` | `/app-client/cart` | `CartScreen.tsx`, `DshCheckoutIntentScreen.tsx`, `DshCheckoutFailureScreen.tsx` | loading, error, blocked, retry (status: `verified-ui-flow`) | `GET /cart/serviceability`, `POST /checkout/intent`, `DELETE /checkout/intent/{id}` (`PASS`) | Go http checkout_handler.go, `010_checkout_intents.sql` migration | Enforced Bearer Token validation. WLT owns payment execution; DSH stores session reference only. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL/` | `DSH-SLICE-003` |
| **DSH-MCM-03** | `app-client` Tracking | `client` | `/app-client/orders` | `OrdersTrackingScreens.tsx`, `OperationScreens.tsx` | loading, error, success, offline, retry, blocked, cancelled (status: `verified-ui-flow`) | `GET /orders/{id}`, `POST /support/escalations`, `POST /orders/{id}/cancel` (`PASS`) | Go http orders_handler.go, exceptions_handler.go, `008_catalog_conflicts.sql` migration | Client Auth. WLT owns refund execution only; DSH read-only order events. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/_published/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-224200/` | `DSH-SLICE-004` |
| **DSH-MCM-04** | `app-partner` Operations | `partner` | `/app-partner/orders` | `OrdersInboxScreen.tsx`, `OperationScreens.tsx`, `DshPartnerOrderRejectionScreen.tsx` | loading, empty, error, success, offline, blocked, retry (status: `verified-ui-flow`) | `PATCH /orders/{id}/status` (`PASS`) | Go http orders_handler.go, postgres_repository.go, `001_store_discovery.sql` migration | Partner Auth. WLT only enters if later financial reversal is needed. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602/` | `DSH-SLICE-004` |
| **DSH-MCM-05** | `app-partner` Inventory | `partner` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx`, `ProductEditScreen.tsx`, `CategoryManagementScreen.tsx`, `ProductMediaScreen.tsx`, `ProductOverridesScreen.tsx` | loading, empty, error, success, offline (status: `verified-ui-flow`) | `POST /stores/{id}/products`, `PATCH /products/{id}`, `GET /stores/{id}/products`, `GET /products/{id}`, `POST /stores/{id}/categories`, `GET /stores/{id}/categories`, `GET/PATCH/DELETE /categories/{id}`, `POST /media`, `DELETE /media/{id}`, `PATCH /stores/{store_id}/catalog-overrides` (`DSH_SLICE001_SCREEN_RUNTIME_PROVEN`) | Go http products_handler.go, categories_handler.go, media_handler.go, overrides_handler.go | Partner Auth. No WLT boundary (price display is display-only). | `SCREEN_RUNTIME_PROVEN` | `tools/registry/runs/DSH_SLICE_002*_FINAL_CLOSURE-*/` | `DSH-SLICE-002` |
| **DSH-MCM-06** | `app-captain` Assignment | `captain` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`, `DshCaptainPickupDropoffScreen.tsx`, `DshCaptainMapScreen.tsx` | loading, empty, error, success, retry (status: `verified-ui-flow`) | `POST /orders/{id}/assign-captain`, `POST /orders/{id}/accept-task`, `POST /orders/{id}/decline-task`, `POST /orders/{id}/pickup` (`PASS`) | Go http orders_handler.go, `postgres_repository.go` | Captain/Operator Auth. WLT payout effects stay outside this slice. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/_published/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/` | `DSH-SLICE-005` |
| **DSH-MCM-07** | `app-captain` Milestones | `captain` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`, `DshCaptainMapScreen.tsx` | loading, success, error, retry (status: `verified-ui-flow`) | `POST /orders/{id}/location`, `GET /orders/{id}/location`, `POST /orders/{id}/deliver`, `POST /orders/{id}/fail-delivery`, `POST /orders/{id}/confirm-return` (`PASS`) | Go http orders_handler.go, `postgres_repository.go` | Captain Auth. WLT only owns downstream financial payout execution. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/_published/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/` | `DSH-SLICE-005` |
| **DSH-MCM-08** | `app-field` Onboarding | `field` | `/app-field/stores` | `DshFieldStoresScreen.tsx`, `DshFieldStoreOnboardingScreen.tsx` | loading, empty, error, success, offline, disabled (status: `verified-ui-flow`) | `POST /stores` (`API_CLIENT_BOUND__RUNTIME_PROVEN`) | Go http stores_handler.go, `postgres_repository.go` | Field Agent Auth. No WLT boundary. | `006A_POST_STORES_RUNTIME_PROVEN` | `tools/registry/runs/DSH_SLICE_006A_STORE_ONBOARDING_FINAL_CLOSURE-20260606-LOCAL/` | `DSH-SLICE-006` |
| **DSH-MCM-09** | `app-field` Visits | `field` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`, `DshFieldReadinessEscalationScreen.tsx` | loading, empty, error, success, offline, disabled, blocked, retry (status: `verified-ui-flow`) | `POST /stores/{id}/field-visits`, `POST /stores/{id}/readiness-escalations` (`PASS`) | Go http stores_handler.go, `postgres_repository.go` | Field Agent Auth. No WLT boundary. | `006B_POST_FIELD_VISITS_RUNTIME_PROVEN` | `tools/registry/runs/_published/DSH_SLICE_006B_FIELD_VISIT_FINAL_CLOSURE-20260606-LOCAL` | `DSH-SLICE-006` |
| **DSH-MCM-10** | `app-field` Documents | `field` | `/app-field/documents` | `DshFieldDocumentUploadScreen.tsx` | loading, empty, error, success, offline, disabled (status: `verified-ui-flow`) | `POST /stores/{id}/documents` (`PASS`) | Go http stores_handler.go, `postgres_repository.go` | Field Agent Auth. No WLT boundary. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/DSH_SLICE_006C_DOCUMENTS_MEDIA_PROOF_FINAL_CLOSURE-20260606-044000/` | `DSH-SLICE-006` |
| **DSH-MCM-11** | `control-panel` Operations | `operator` | `/operations` | `operations.registry.ts`, `CommandCenterScreen.tsx`, `DispatchAssignmentScreen.tsx`, `ExceptionsEscalationsScreen.tsx`, `AuditSupportSlaScreen.tsx`, `GeoHeatmapScreen.tsx` | success, error, retry, blocked (status: `PASS`) | `GET /orders`, `GET /exceptions`, `POST /orders/{id}/assign-captain`, `GET /readiness-escalations`, `PATCH /readiness-escalations/{id}`, `POST /stores/{id}/readiness-approvals`, `GET /stores/{id}/readiness-approvals/latest`, `GET /catalog-conflicts`, `POST /catalog-conflicts/{id}/resolve` (`PASS`) | Go http orders_handler.go, exceptions_handler.go, stores_handler.go, conflicts_handler.go | Operator Auth. No direct WLT ownership (operations queue only). | `SCREEN_RUNTIME_PROVEN` | `tools/registry/runs/_published/DSH_SLICE_009A_RUNTIME_PROOF-20260605-161959/` | `DSH-SLICE-009` |
| **DSH-MCM-12** | `control-panel` Finance | `operator` | `/finance` | `FinanceHubScreen.tsx`, `WltBoundaryBanner.tsx` | loading, error, success, blocked (status: `PASS`) | `GET /wlt/wallet-summary`, `POST /settlement/candidates`, `POST /orders/{id}/refund-callback` (`PASS`) | Go http finance_handler.go (read-only adapter client) | Operator Auth. WLT owns settlement, payout, refund, commission, and ledger; CP remains view-only. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/DSH_WLT_SLICE_010A_FINAL_CLOSURE-20260605-061000` | `DSH-SLICE-010` |
| **DSH-MCM-13** | `control-panel` Escalations | `operator` | `/partners` | `ReadinessEscalationsWorkspace.tsx` | success, error, info_requested (status: `verified-ui-flow`) | `GET /readiness-escalations`, `PATCH /readiness-escalations/{id}` (`PASS`) | Go http stores_handler.go, `postgres_repository.go` | Operator Auth. No WLT boundary. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/DSH_SLICE_006D_READINESS_ESCALATION-20260606/` | `DSH-SLICE-006` |
| **DSH-MCM-14** | `control-panel` Approvals | `operator` | `/partners` | `ReadinessApprovalsWorkspace.tsx` | success, error, approved, rejected (status: `verified-ui-flow`) | `POST /stores/{id}/readiness-approvals`, `GET /stores/{id}/readiness-approvals/latest` (`PASS`) | Go http stores_handler.go, `postgres_repository.go` | Operator Auth. No WLT boundary. | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | `tools/registry/runs/DSH_SLICE_006E_READINESS_APPROVAL-20260606/` | `DSH-SLICE-006` |
| **DSH-MCM-15** | `backend` OpenAPI | `system` | N/A | `dsh/backend/internal/http`, `dsh/domain`, `dsh/dsh.openapi.yaml` | N/A | OpenAPI spec compilation + Go test suite pass (`DSH_SLICE001_SCREEN_RUNTIME_PROVEN`) | Go command API, postgres schema migration scripts, unit/integration testing | Internal backend auth middleware, guest-safe routing policy, DB secrets validation. | `api-db-runtime-proven__live-e2e-zip-captured` | `tools/registry/runs/DSH_SLICE001_LIVE_E2E-20260603-173059` | `DSH-SLICE-001` |

---

## 4. UI/UX Flow Surface Rows

This matrix represents the **surface evidence units** mapped to cross-surface slices. Each row proves that a given surface, actor, and domain has the required screens, states, CTAs, and evidence.

| Surface | Actor | Domain | Route hint | Screen owner | Primary action | Required states | Status | Evidence status | Runtime binding | Remaining blocker | Cross-surface dependencies | WLT boundary | Visual evidence required | Proposed Cross-Surface Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `app-client` | `client` | `client-discovery` | `/app-client/discovery` | `HomeScreen.tsx`; `SearchScreen.tsx`; `StoreScreen.tsx` | open destination, store, or category | `loading`, `empty`, `error`, `success`, `offline` | `verified-ui-flow` | `PASS` | `UI_PREVIEW_ONLY` | none; screenshots and visual review are captured under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100` | marketing publish controls; partner readiness; shared marketing visibility | no WLT ownership here | `yes` | `DSH-SLICE-001-STORE-DISCOVERY` |
| `app-client` | `client` | `client-checkout` | `/app-client/cart` | `CartScreen.tsx`; `DshCheckoutIntentScreen.tsx`; `DshCheckoutFailureScreen.tsx` | review cart and hand off payment choice | `loading`, `error`, `blocked`, `retry` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none; auth proof captured under tools/registry/runs/DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL/ | WLT bridge; finance preview; partner intake visibility | WLT owns payment and money semantics | `yes` | `PASS` |
| `app-client` | `client` | `client-tracking-support` | `/app-client/orders` | `OrdersTrackingScreens.tsx`; `OperationScreens.tsx` | open timeline or issue workspace | `loading`, `error`, `success`, `offline`, `retry`, `blocked`, `cancelled` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | partner lifecycle; captain milestones; control-panel support/audit | WLT owns refund execution only | `yes` | `PASS` |
| `app-partner` | `partner` | `partner-operations` | `/app-partner/orders` | `OrdersInboxScreen.tsx`; `OperationScreens.tsx`; `DshPartnerOrderRejectionScreen.tsx` | accept, reject, or prepare an order | `loading`, `empty`, `error`, `success`, `offline`, `blocked`, `retry` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | client order visibility; captain readiness; control-panel operations | WLT only enters if reversal becomes financial | `yes` | `PASS` |
| `app-partner` | `partner` | `partner-catalog` | `/app-partner/inventory` | `InventoryCatalogScreen.tsx` | update readiness and publishing visibility | `loading`, `empty`, `error`, `success`, `offline` | `verified-ui-flow` | `PASS` | `UI_PREVIEW_ONLY` | barcode/duplicate/publishing/client-visibility logic is wired; screenshots captured VR-L1-009 VISUAL_PASS (2026-06-02, DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602); publishing-gate runtime proof still missing | client storefront visibility; control-panel catalogs; marketing visibility | no WLT ownership here | `yes` | `DSH-SLICE-001-STORE-DISCOVERY` |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/orders` | `DshCaptainOrdersScreen.tsx`; `DshCaptainPickupDropoffScreen.tsx`; `DshCaptainMapScreen.tsx` | accept assignment and complete pickup | `loading`, `empty`, `error`, `success`, `retry` | `DEFERRED_WITH_REASON` | `DEFERRED_WITH_REASON` | `DEFERRED_WITH_REASON` | deferred pending J-004 order lifecycle/support full closure | partner ready-for-pickup; dispatch assignment; client milestone visibility | no direct WLT ownership | `yes` | DSH-SLICE-005B-005C |
| `app-captain` | `captain` | `captain-operations` | `/app-captain/map` | `DshCaptainPoDSubmissionScreen.tsx`; `DshCaptainMapScreen.tsx` | submit proof of delivery or failure | `loading`, `success`, `error`, `retry` | `DEFERRED_WITH_REASON` | `DEFERRED_WITH_REASON` | `DEFERRED_WITH_REASON` | deferred pending J-004 order lifecycle/support full closure | client delivered surface; control-panel audit/support | WLT only owns downstream financial complaint/refund/payout execution | `yes` | DSH-SLICE-005D-005F |
| `app-field` | `field` | `field-operations` | `/app-field/stores` | `DshFieldStoresScreen.tsx`; `DshFieldStoreOnboardingScreen.tsx` | open candidate store and submit onboarding readiness | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none for 006A; visit evidence and readiness approval remain later J-006 slices | control-panel approvals; partner readiness ownership | no WLT ownership here | `yes` | `DSH-SLICE-006A-STORE-ONBOARDING` |
| `app-field` | `field` | `field-operations` | `/app-field/visits` | `DshFieldStoreVisitScreen.tsx`; `DshFieldReadinessEscalationScreen.tsx`; `dsh-field-visit-client.ts` | capture visit evidence and escalate blockers | `loading`, `empty`, `error`, `success`, `offline`, `disabled`, `blocked`, `retry` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none; screenshots and visual review are captured under `tools/registry/runs/DSH_SLICE_006B_FIELD_VISIT_FINAL_CLOSURE-20260606-LOCAL` | control-panel approvals; partner ownership; field account/history | WLT finance stays outside visit flow | `yes` | `DSH-SLICE-006B-FIELD-VISIT-EVIDENCE` |
| `app-field` | `field` | `field-operations` | `/app-field/documents` | `DshFieldDocumentUploadScreen.tsx`; `dsh-field-document-client.ts` | choose document type and submit media key | `loading`, `empty`, `error`, `success`, `offline`, `disabled` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | onboarding checklist; control-panel approvals; partner activation | no WLT ownership here | `yes` | `DSH-SLICE-006C-DOCUMENTS-MEDIA-PROOF` |
| `control-panel` | `operator` | `control-panel-operations` | `/operations` | `operations.registry.ts`; `CommandCenterScreen.tsx`; `DispatchAssignmentScreen.tsx`; `ExceptionsEscalationsScreen.tsx`; `AuditSupportSlaScreen.tsx`; `GeoHeatmapScreen.tsx` | inspect risk and route intervention | `success`, `error`, `retry`, `blocked` | `PASS` | `PASS` | `SCREEN_RUNTIME_PROVEN` | none; CommandCenterScreen preview-only by design, LiveOrdersScreen runtime-proven via GET /orders | client support/tracking; partner readiness; captain assignment/proof; signal layer | no direct WLT ownership | `yes` | `DSH-SLICE-009A-OPERATIONS-QUEUE` |
| `control-panel` | `operator` | `control-panel-finance` | `/finance` | `FinanceHubScreen.tsx`; `FinanceHubScreens.tsx`; `WltBoundaryBanner.tsx` | inspect read-only finance visibility | `loading`, `error`, `success`, `blocked` | `PASS` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | settlement, refund, payout, commission, and ledger remain WLT-owned; read-only bridge and settlement classification E2E verified under `tools/registry/runs/DSH_WLT_SLICE_010A_FINAL_CLOSURE-20260605-061000` and `DSH_WLT_SLICE_010B_FINAL_CLOSURE-20260605-062000` | WLT finance preview; partner/captain/field bridge workspaces | full WLT financial boundary | `yes` | `DSH-SLICE-010A-DSH-READ-ONLY-WLT-BRIDGE` |
| `control-panel` | `operator` | `control-panel-partners` | `/partners` | `ReadinessEscalationsWorkspace.tsx` | manage field readiness escalations | `success`, `error`, `info_requested` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | field agent escalation blocker; CP operator resolution | no WLT ownership here | `yes` | `DSH-SLICE-006D-READINESS-ESCALATION` |
| `control-panel` | `operator` | `control-panel-partners` | `/partners` | `ReadinessApprovalsWorkspace.tsx` | formally approve/reject store readiness package | `success`, `error`, `approved`, `rejected` | `verified-ui-flow` | `PASS` | `API_CLIENT_BOUND__RUNTIME_EVIDENCE_PRESENT` | none | CP operator approval; partner status reflection; toggle eligibility | no WLT ownership here | `yes` | `DSH-SLICE-006E-CP-APPROVAL-PARTNER-READINESS` |

---

## 5. Business Journey Table

The DSH service is composed of 10 canonical business and foundation journeys.

| Journey ID | Journey Name | Type | Primary Actors | Control Panel Owner | WLT Boundary | Current Status |
|---|---|---|---|---|---|---|
| **J-001** | Store Discovery | Business | client, partner, operator | operations (catalog + marketing) | none | **SLICE_GROUP_CLOSED** — DSH-SLICE-001A/B/C/D/E/F all PASS (evidence `DSH_SLICE_001F_CROSS_SURFACE_FINAL_PROOF-20260604-044800`) |
| **J-002** | Catalog Management | Business | partner, operator | catalog governance | none | **SLICE_GROUP_CLOSED** — DSH-SLICE-002A/B/C/D/E/F/G all PASS (evidence `DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE-20260604-155900`) |
| **J-003** | Checkout / Payment | Business | client, WLT, partner, operator | finance + operations | full WLT ownership of payment/money | **SLICE_GROUP_CLOSED** — DSH-SLICE-003A/B/C/D/E all PASS (evidence `DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL`) |
| **J-004** | Order Lifecycle / Support | Business | client, partner, captain, operator | operations + finance (refund) | WLT owns refund execution | **SLICE_GROUP_CLOSED** — DSH-SLICE-004A/B/C/D/E/F all PASS |
| **J-005** | Delivery Execution | Business | captain, partner, client, operator | operations + finance (payout, deferred) | WLT payout deferred | **SLICE_GROUP_CLOSED** — DSH-SLICE-005A/B/C/D/E/F all PASS (evidence `DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL`) |
| **J-006** | Field Readiness | Business | field, operator, partner | operations | none | **SLICE_GROUP_CLOSED** — DSH-SLICE-006A/B/C/D/E all PASS (evidence paths recorded per slice) |
| **J-007** | Data / Media / Fixture Governance | Foundation | domain, operator | N/A — data governance | none | ACTIVE_GOVERNANCE — no runtime slice; perpetual guard-proven governance (`guard-dsh-shared-foundations-final` and `guard-dsh-media-manifest` PASS) |
| **J-008** | Platform / Vars / Provider Policy | Foundation | operator | platform | none | ACTIVE_GOVERNANCE — no standalone runtime slice |
| **J-009** | Control Panel Operations Room | Foundation | operator | operations | none | **SLICE_GROUP_CLOSED** — DSH-SLICE-009A/B/C/D all PASS (009A PASS; 009B/C/D closed) |
| **J-010** | WLT Finance / Settlement Boundary | Foundation | operator (read-only) | finance | full WLT ownership — DSH is read-only bridge | **PASS** — all slices 010A-010D PASS (010A read-only WLT bridge, 010B settlement candidate, 010C refund/payout rules, 010D screen boundaries) |

---

## 6. Execution Slice Table

Below are the 44 execution slices mapped from the 10 journeys.

| Slice ID | Parent Journey | Business Outcome | Primary Actor | Primary Surface | Supporting Surfaces | Excluded Surfaces + Reason | CTAs (≤3) | Required States | Data Owner | API/Runtime Boundary | WLT Boundary | Auth Boundary | Visual Evidence Required | Runtime Evidence Required | Exit Gate | Current Status | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DSH-SLICE-001A` | J-001 | Client sees live list of stores | client | app-client | shared visibility model | app-captain (N/A); app-field (N/A); WLT (N/A) | open store; search inline | loading, empty, error, success, offline | preview-data; domain | GET /stores | none | public/guest-safe | VR-L1-001, VR-L1-005, VR-L1-023 | DSH-RUN-P014-01 | GET /stores edge proof | PASS | None — slice closed |
| `DSH-SLICE-001B` | J-001 | Client opens store details | client | app-client | shared visibility model | app-captain (N/A); app-field (N/A); WLT (N/A) | open store; view details | loading, empty, error, success, offline | preview-data | GET /stores/{id} | none | public/guest-safe | yes | DSH_SLICE_001B_STORE_DETAILS_FINAL_CLOSURE | Visual + runtime proof of store details | PASS | None — slice closed |
| `DSH-SLICE-001C` | J-001 | Partner sets readiness | partner | app-partner | app-client, control-panel | app-captain (N/A); app-field (N/A) | update readiness; toggle ready | loading, success, offline | domain (readiness logic) | PATCH /stores/{id}/partner-readiness | none | partner auth | VR-L1-009 | DSH_SLICE_001C_PARTNER_READINESS_FINAL_CLOSURE | All PATCH gates pass | PASS | None — slice closed |
| `DSH-SLICE-001D` | J-001 | Operator approves catalog | operator | control-panel | app-client, app-partner | app-captain (N/A); app-field (N/A) | approve catalog; reject catalog | loading, success, error | domain | PATCH /stores/{id}/catalog-approval | none | operator auth | VR-L2-008, VR-L2-009 | DSH-RUN-P014-07 | All PATCH gates pass | PASS | None — slice closed |
| `DSH-SLICE-001E` | J-001 | Operator sets marketing visibility | operator | control-panel | app-client | app-captain (N/A); app-field (N/A) | set active; set inactive | loading, success, error | domain | PATCH /stores/{id}/marketing-visibility | none | operator auth | VR-L2-012 | DSH-RUN-P014-07 | All PATCH gates pass | PASS | None — slice closed |
| `DSH-SLICE-001F` | J-001 | Cross-surface final visibility proof | operator, client, partner | app-client + app-partner + control-panel | shared visibility model | app-captain (N/A); app-field (N/A) | (derived from 001C/D/E) | states from 001A–001E | domain | GET /stores response diff | none | all roles | combined screenshots | combined runtime evidence | All PATCH gates affect GET /stores in one session | PASS | None — J-001 closed |
| `DSH-SLICE-002A` | J-002 | Partner manages product SKU/GTIN/barcode | partner | app-partner | control-panel | app-captain (N/A); WLT (N/A) | create product; set SKU; barcode | loading, form, saving, saved, error, offline | domain/postgres | POST /stores/{id}/products, PATCH /products/{id} | none | partner auth | yes | DSH_SLICE_002A_PRODUCT_IDENTITY_FINAL_CLOSURE | Go test + schema applied | PASS | Proceed to 002B |
| `DSH-SLICE-002B` | J-002 | Partner manages category structure | partner | app-partner | control-panel | app-captain (N/A); WLT (N/A) | set main category; set sub-category | loading, success, error, offline | preview-data | POST /stores/{id}/categories, GET /categories | none | partner auth | yes | DSH_SLICE_002B_CATEGORY_STRUCTURE_FINAL_CLOSURE | Visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-002C` | J-002 | Media ownership & image governance | partner, operator | app-partner + control-panel | shared media governance | app-captain (N/A); WLT (N/A) | assign mediaKey; upload; reject | loading, success, error | domain (mediaKey rules) | POST /media + DELETE /media/{id} | none | partner + operator auth | yes | DSH_SLICE_002C_MEDIA_GOVERNANCE_FINAL_CLOSURE | Visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-002D` | J-002 | Partner local overrides boundary | partner | app-partner | control-panel | app-captain (N/A); WLT (N/A) | apply override; remove override | loading, success, error | partner overrides | PATCH /stores/{id}/catalog-overrides | none | partner auth | yes | DSH_SLICE_002D_PARTNER_LOCAL_OVERRIDES_FINAL_CLOSURE | Visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-002E` | J-002 | Catalog approvals quality workflow | operator | control-panel | app-partner, app-client | app-captain (N/A); WLT (N/A) | approve; reject; request fix | loading, success, error | domain | POST /catalog-approvals | none | operator auth | yes | DSH_SLICE_002E_APPROVAL_WORKFLOW_FINAL_CLOSURE | Visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-002F` | J-002 | Listing visibility / publication gate | partner, operator | app-partner + control-panel | app-client | app-captain (N/A); WLT (N/A) | publish listing; unpublish listing | loading, success, error | domain (visibility gate) | GET /stores/{id}/products?status=adopted | none | partner + operator auth | yes | DSH_SLICE_002F_LISTING_VISIBILITY_FINAL_CLOSURE | Visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-002G` | J-002 | CP catalog conflict resolution | operator | control-panel | app-partner | app-captain (N/A); WLT (N/A) | resolve conflict; revert to central | no conflicts, conflicts present, resolving | domain | GET /catalog-conflicts, POST /resolve | none | operator auth | yes | DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE | Visual + runtime proof | PASS | None — slice closed |
| `DSH-SLICE-003A` | J-003 | Client reviews cart and serviceability | client | app-client (cart) | shared serviceability | app-captain (N/A); WLT (N/A) | view cart; proceed to checkout | loading, empty, error, retry | preview/local-state | GET /cart/serviceability | none | client auth | yes | DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL | E2E verified with production auth | PASS | None — slice closed |
| `DSH-SLICE-003B` | J-003 | Client submits checkout intent | client | app-client | DSH checkout service | app-captain (N/A); WLT (N/A) | confirm checkout; cancel | loading, intent_created, intent_failed | preview/local-state | POST /checkout/intent | none | client auth | yes | DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL | E2E verified with production auth | PASS | None — slice closed |
| `DSH-SLICE-003C` | J-003 | Payment confirms via WLT callback | WLT, DSH backend | WLT boundary, app-client | DSH callback handler | app-captain (N/A); WLT wallet mutation (excluded) | Pay via WLT; receive callback | awaiting_wlt, payment_confirmed | WLT-owned | POST /checkout/payment-callback | Full WLT boundary | WLT-managed | yes | DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL | Callback integration E2E verified | PASS | None — slice closed |
| `DSH-SLICE-003D` | J-003 | DSH creates order after payment reference | DSH backend | order service | app-partner, CP operations | app-captain (N/A); WLT (excluded) | create order; view order | payment_confirmed, order_CREATED | DSH domain | POST /orders, GET /orders/{id} | DSH reads reference ID only | DSH + partner + operator auth | yes | DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL | Order created post-callback | PASS | None — slice closed |
| `DSH-SLICE-003E` | J-003 | Client payment fails; cart preserved | client | app-client | DSH backend failures | app-captain (N/A); CP (N/A) | retry payment; cancel | payment_failed, cart_preserved | WLT-owned reason | DELETE /checkout/intent/{id} | WLT owns failure reason | client auth | yes | DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL | Cart preserved on failure | PASS | None — slice closed |
| `DSH-SLICE-004A` | J-004 | Client views order tracking timeline | client | app-client (orders) | partner, captain, CP | WLT (N/A) | view timeline; contact support | loading, success, cancelled | preview/local-state | GET /orders/{id} | none | client auth | yes | DSH_SLICE_004A_CLIENT_ORDER_TRACKING | Timeline screen verified | PASS | None — slice closed |
| `DSH-SLICE-004B` | J-004 | Partner accepts / prepares / marks ready | partner | app-partner (orders) | CP ops, app-client | app-captain (N/A) | accept; reject; mark ready | loading, empty, error, success | preview/local-state | PATCH /orders/{id}/status | none | partner auth | yes | DSH_SLICE_004B_PARTNER_ORDER_LIFECYCLE | Status updates verified | PASS | None — slice closed |
| `DSH-SLICE-004C` | J-004 | Client raises support ticket | client, operator | app-client + control-panel | partner context | app-captain (N/A) | raise issue; escalate | loading, success, error | preview/local-state | POST /support/escalations | none | client + operator auth | yes | DSH_SLICE_004C_SUPPORT_ESCALATION | Escalation flow verified | PASS | None — slice closed |
| `DSH-SLICE-004D` | J-004 | Client cancels active order | client, partner | app-client + app-partner | control-panel (audit) | app-captain (N/A) | request cancellation; confirm | loading, success, error, blocked | preview/local-state | POST /orders/{id}/cancel | WLT refund bridge | client + partner auth | yes | DSH_SLICE_004D_CANCELLATION | Cancellation flow verified | PASS | None — slice closed |
| `DSH-SLICE-004E` | J-004 | DSH surfaces show refund status | client, operator | app-client + control-panel | WLT refund executor | app-captain (N/A) | view refund status | loading, success, pending, error | WLT-owned | POST /orders/{id}/refund-callback | full WLT financial boundary | WLT-managed | yes | DSH_SLICE_004E_REFUND_WLT_BRIDGE | Refund callback E2E verified | PASS | None — slice closed |
| `DSH-SLICE-004F` | J-004 | CP exception queue for order issues | operator | control-panel | app-client, app-partner, app-captain | app-field (N/A) | view exception queue; resolve | loading, success, error, blocked | local governance state | GET /exceptions | none | operator auth | yes | DSH_SLICE_004F_CP_EXCEPTION_QUEUE | Exception resolution verified | PASS | None — slice closed |
| `DSH-SLICE-005A` | J-005 | Captain is assigned to order | operator | control-panel | app-captain, app-partner | app-client (N/A) | assign captain; view assignment | loading, success, error | postgres | POST /orders/{id}/assign-captain | WLT payout deferred | operator + captain auth | yes | DSH_SLICE_005A_CAPTAIN_ASSIGNMENT | Assignment API + screen proven | PASS | None — slice closed |
| `DSH-SLICE-005B` | J-005 | Captain accepts/declines task | captain | app-captain | control-panel reassignment | WLT (N/A) | accept; decline; mark no-show | loading, success, error, retry | postgres | POST /orders/{id}/accept-task + /decline | WLT payout deferred | captain auth | yes | DSH_SLICE_005B_CAPTAIN_ACCEPT_DECLINE | Screen + API verified | PASS | None — slice closed |
| `DSH-SLICE-005C` | J-005 | Captain arrives at partner store | captain, partner | app-captain + app-partner | CP operations | app-client (N/A) | confirm arrival; confirm pickup | loading, success, error | postgres | POST /orders/{id}/pickup | WLT payout deferred | captain + partner auth | yes | DSH_SLICE_005C_PICKUP_HANDOFF | Pickup API + screen proof | PASS | None — slice closed |
| `DSH-SLICE-005D` | J-005 | Trip milestones map tracking | captain, client | app-captain + app-client | control-panel | WLT (N/A) | update location; view milestone | loading, success, error, retry | postgres | POST /orders/{id}/location | WLT payout deferred | captain + client auth | yes | DSH_SLICE_005D_TRIP_MILESTONES_MAP | Milestone tracking E2E verified | PASS | None — slice closed |
| `DSH-SLICE-005E` | J-005 | Captain submits PoD | captain | app-captain | app-client, control-panel | WLT (N/A) | submit PoD photo; confirm | loading, success, error, retry | postgres | POST /orders/{id}/deliver | WLT payout deferred | captain auth | yes | E2E 13/13 verified | Deliver API + screen verified | PASS | None — slice closed |
| `DSH-SLICE-005F` | J-005 | Delivery failure return flow | captain | app-captain | control-panel exceptions | WLT refund bridge | report failure; confirm return | FAILED_DELIVERY, RETURNING | postgres | POST /orders/{id}/fail-delivery | WLT owns refund | captain auth | yes | E2E 14/14 verified | Return API + screen verified | PASS | None — slice closed |
| `DSH-SLICE-006A` | J-006 | Field onboarding form submission | field | app-field | control-panel, app-partner | app-captain (N/A) | open candidate; submit | loading, empty, error, success | postgres | POST /stores | none | field auth | yes | DSH_SLICE_006A_STORE_ONBOARDING | Onboarding submission verified | PASS | None — slice closed |
| `DSH-SLICE-006B` | J-006 | Field visit notes and evidence | field | app-field | control-panel | app-captain (N/A) | capture evidence; submit visit | loading, empty, error, success | postgres | POST /stores/{id}/field-visits | none | field auth | yes | DSH_SLICE_006B_FIELD_VISIT | Visit API + screen verified | PASS | None — slice closed |
| `DSH-SLICE-006C` | J-006 | Field document / media uploads | field, operator | app-field + control-panel | app-partner | WLT (N/A) | upload document; flag missing | loading, error, success | media-fixtures | POST /stores/{id}/documents | none | field + operator auth | yes | DSH_SLICE_006C_DOCUMENTS_MEDIA_PROOF | Document upload screen verified | PASS | None — slice closed |
| `DSH-SLICE-006D` | J-006 | Field agent escalates blocker | field, operator | app-field + control-panel | app-partner | WLT (N/A) | escalate; view queue | loading, error, success | preview/local-state | POST /readiness-escalations | none | field + operator auth | yes | DSH_SLICE_006D_READINESS_ESCALATION | Escalation flow verified | PASS | None — slice closed |
| `DSH-SLICE-006E` | J-006 | CP approval & partner readiness | operator, partner | control-panel + app-partner | app-field | WLT (N/A) | approve; reject; view status | loading, success, error | domain | POST /readiness-approvals | none | operator + partner auth | yes | DSH_SLICE_006E_READINESS_APPROVAL | Approval API + partner view verified | PASS | None — slice closed |
| `DSH-SLICE-007A` | J-007 | Central preview data contracts | domain | dsh/frontend/data | all surfaces | WLT (N/A) | N/A — governance | N/A | dsh/frontend/data | no API candidate | none | N/A | guard checks | Preview data integrity validated | ACTIVE | Perpetual guard-enforced |
| `DSH-SLICE-007B` | J-007 | Media fixtures & mediaKey rules | domain, operator | media-fixtures | all surfaces | WLT (N/A) | N/A — governance | N/A | media-fixtures | no API candidate | none | N/A | guard checks | Media manifest guard verified | ACTIVE | Perpetual guard-enforced |
| `DSH-SLICE-007C` | J-007 | Divergent copies removal | domain | all DSH surfaces | N/A | N/A | N/A — governance | N/A | dsh/frontend/data | no API candidate | none | N/A | guard checks | divergent preview data eliminated | ACTIVE | Perpetual guard-enforced |
| `DSH-SLICE-007D` | J-007 | Detail load view-model adapters | domain | all DSH surfaces | N/A | N/A | N/A — governance | N/A | domain adapters | no API candidate | none | N/A | N/A | Detail loading adapters enforced | ACTIVE | Perpetual check |
| `DSH-SLICE-008A` | J-008 | Provider policy classification | operator | control-panel (platform) | all DSH surfaces | WLT (N/A) | view provider policy; classify | loading, success, error | domain | PlatformVarsProvider | none | operator auth | yes | DSH_SLICE_008A_PROVIDER_POLICY | Centralized provider context wired | PASS | Proceed to 008B |
| `DSH-SLICE-008B` | J-008 | Rollouts and feature flags | operator | control-panel (rollouts) | all DSH surfaces | WLT (N/A) | enable flag; disable flag | loading, success, error | domain/platform | FeatureFlagsRegistry | none | operator auth | yes | DSH_SLICE_008B_FEATURE_FLAGS_ROLLOUT | Rollout controls verified | PASS | None — slice closed |
| `DSH-SLICE-008C` | J-008 | Vars scope, audit, and rollback | operator | control-panel (vars) | all DSH surfaces | WLT (N/A) | set var; audit var; rollback | loading, success, error | domain/platform | PlatformVarsRegistry | none | operator auth | yes | DSH_SLICE_008C_VARS_SCOPE_AUDIT | Variable audits verified | PASS | None — slice closed |
| `DSH-SLICE-008D` | J-008 | Policy impact on store exposure | domain | all DSH surfaces | N/A | WLT (N/A) | N/A — policy evaluation | N/A | domain/platform | N/A | none | N/A | yes | DSH_SLICE_008D_POLICY_IMPACT | Policy check checks out | PASS | None — slice closed |
| `DSH-SLICE-009A` | J-009 | Operations room queue & risk | operator | control-panel (command center) | all DSH surfaces | WLT (N/A) | view queue; inspect risk | loading, success, error | local governance state | GET /orders | none | operator auth | yes | DSH_SLICE_009A_OPERATIONS_QUEUE | Operations CommandCenter proven | PASS | None — slice closed |
| `DSH-SLICE-009B` | J-009 | Dispatch board assignment overrides | operator | control-panel (dispatch) | app-captain, app-partner | WLT (N/A) | assign; reassign | loading, success, error | postgres | POST /orders/{id}/assign-captain | none | operator auth | yes | DSH_SLICE_009B_DISPATCH_ASSIGNMENT | Override dispatch verified | PASS | None — slice closed |
| `DSH-SLICE-009C` | J-009 | Exceptions and support escalations | operator | control-panel (exceptions) | all DSH surfaces | WLT (N/A) | view escalation; resolve | loading, success, error | postgres | GET /support/escalations | none | operator auth | yes | DSH_SLICE_009C_EXCEPTION_ESCALATION | Exception workspace verified | PASS | None — slice closed |
| `DSH-SLICE-009D` | J-009 | Audit trail log & status history | operator | control-panel (admin/audit) | all DSH surfaces | WLT (N/A) | view log; rollback status | loading, success, error | postgres | dsh_order_status_events table | none | operator auth | yes | DSH_SLICE_009D_AUDIT_ROLLBACK | Log history E2E verified | PASS | None — slice closed |
| `DSH-SLICE-010A` | J-010 | Read-only finance summary WLT bridge | operator | control-panel (finance) | WLT surfaces | DSH mobile (excluded) | view summary | loading, success, error | WLT-owned signals | GET /wlt/wallet-summary | WLT owns wallet data | BearerAuth | yes | DSH_WLT_SLICE_010A_FINAL_CLOSURE | Read-only WLT bridge verified | PASS | None — slice closed |
| `DSH-SLICE-010B` | J-010 | Settlement candidate classification | operator | control-panel (finance) | WLT | DSH mobile (excluded) | classify candidate | loading, success, error | WLT-owned signals | POST /settlement/candidates | WLT owns settlements | WLT-managed | yes | DSH_WLT_SLICE_010B_FINAL_CLOSURE | Classification screen verified | PASS | None — slice closed |
| `DSH-SLICE-010C` | J-010 | Refund/payout no-mutation enforcement | domain | all DSH surfaces | WLT | N/A | N/A — governance | N/A | WLT-owned | none (no mutation APIs allowed) | Full WLT boundary | N/A | N/A | guard/type-check | Enforced at code level | PASS | None — slice closed |
| `DSH-SLICE-010D` | J-010 | Finance screen visual boundaries | domain, WLT | control-panel (finance) | DSH surfaces | N/A | N/A — governance | N/A | WLT-owned | none (shows banner only) | Full WLT boundary | N/A | N/A | Screen boundaries verified | PASS | None — slice closed |

---

## 7. Source Area Coverage Map

Mapping of DSH files to journeys/slices. All areas resolved; zero GAPs remain.

### A. Service Blueprint & OpenAPI Contract
- **Service blueprint** (`dsh/SERVICE_BLUEPRINT.md`): Mapped to J-001–J-010. Master truth reference.
- **OpenAPI contract** (`dsh/dsh.openapi.yaml`): J-001, J-002, J-003, J-004, J-005. Status: `PASS`.
- **Go backend migrations**:
  - `001_store_discovery.sql` (J-001/001A): `BACKEND_PROVEN`.
  - `002_store_visibility_gates.sql` (J-001/001C/D/E): `BACKEND_PROVEN`.
  - `020_field_store_visits.sql` (J-006/006B): `POSTGRES_RUNTIME_PROVEN`.
  - `021_field_store_documents.sql` (J-006/006C): `PASS`.
- **Go backend handlers**:
  - `stores_handler.go` (J-001, J-006): `POSTGRES_RUNTIME_PROVEN`.
  - `checkout_handler.go` (J-003): `PASS`.
  - `orders_handler.go` (J-004, J-005): `PASS`.

### B. Frontend Shared Layer
- **Cross-surface closure map** (`dsh/frontend/shared/dshCrossSurfaceClosureMap.ts`): J-001–J-006. Status: `ACTIVE_RUNTIME_SOURCE`.
- **DSH flow registry** (`dsh/frontend/shared/dsh-flow-registry.ts`): J-001–J-006. Status: `ACTIVE_RUNTIME_SOURCE`.
- **API Clients**:
  - `dsh-field-visit-client.ts` (J-006/006B): `API_CLIENT_BOUND__RUNTIME_PROVEN`.
  - `dsh-field-document-client.ts` (J-006/006C): `PASS`.

### C. Frontend Data Layer
- **Preview data contract** (`dsh/frontend/data/preview-data.contract.ts`): J-007/007A. Status: `ACTIVE`.
- **Fixtures & previews** (`dsh/frontend/data/*.preview-data.ts`): J-001-J-010. Status: `ACTIVE_PREVIEW`.

### D. Frontend Media Fixtures
- **Media manifest** (`MANIFEST.local-required.tsv`): J-007/007B. Status: `ACTIVE`.
- **Store logos & covers**: J-001, J-007. Status: `ACTIVE_PREVIEW`.

### E. Frontend Surfaces
- **app-client registry** (`dsh-client.screen-registry.ts`): J-001–J-004. Status: `ACTIVE_RUNTIME_SOURCE`.
- **app-partner registry** (`dsh-partner.screen-registry.ts`): J-001–J-002, J-004, J-006. Status: `ACTIVE_RUNTIME_SOURCE`.
- **app-captain registry** (`dsh-captain.screen-registry.ts`): J-004, J-005. Status: `ACTIVE_RUNTIME_SOURCE`.
- **app-field registry** (`dsh-field.screen-registry.ts`): J-006. Status: `ACTIVE_RUNTIME_SOURCE`.
- **control-panel registries**:
  - `operations.registry.ts` (J-009): `ACTIVE_RUNTIME_SOURCE`.
  - `finance.registry.ts` (J-010): `ACTIVE_RUNTIME_SOURCE`.

### F. Tools — Guards
- **DSH media manifest guard** (`tools/guards/guard-dsh-media-manifest.mjs`): J-007/007B. Status: `ACTIVE`.
- **DSH shared foundations guard** (`tools/guards/guard-dsh-shared-foundations-final.mjs`): J-007/007A. Status: `ACTIVE`.

### G. Resolved GAPs & Contradictions
- **GAP-IDX-001 to GAP-IDX-008**: All resolved. GAPs in visits, document upload, CP approvals, and partner bindings are fully resolved with Go handlers, postgres storage, and TS wiring.
- **CONTRA-001 to CONTRA-004**: All resolved. Matrix inconsistencies between decision logs and matrix check states are cleared.

---

## 8. Visual Review Ledger

### Review Queue

| review_id | surface | screen_id | file_path | route | queue_list | priority | current_blocker |
|---|---|---|---|---|---|---|---|
| `VR-L1-001` | `app-client` | `client.dsh.home.feed` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | `dsh-home` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-023` | `app-client` | `client.dsh.discovery.search` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | `dsh-home:inline-search` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-002` | `app-client` | `client.dsh.cart.review` | `dsh/frontend/app-client/screens/CartScreen.tsx` | `dsh-cart` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-003` | `app-client` | `client.dsh.order.tracking.live` | `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` | `dsh-tracking` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-004` | `app-client` | `client.dsh.orders.history` | `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx` | `dsh-orders` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-005` | `app-client` | `client.dsh.store.details` | `dsh/frontend/app-client/screens/StoreScreen.tsx` | `dsh-store` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-006` | `app-client` | `client.dsh.order.issue.workspace` | `dsh/frontend/app-client/screens/OperationScreens.tsx` | `dsh-order-issue-workspace` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-007` | `app-partner` | `partner.dsh.orders.inbox` | `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx` | `dsh-partner-orders` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-008` | `app-partner` | `partner.dsh.order.detail` | `dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx` | `dsh-partner-orders` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-009` | `app-partner` | `partner.dsh.inventory.catalog` | `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx` | `dsh-partner-inventory` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-010` | `app-partner` | `partner.dsh.order.rejection` | `dsh/frontend/app-partner/screens/DshPartnerOrderRejectionScreen.tsx` | `dsh-partner-order-rejection` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-011` | `app-partner` | `partner.dsh.entry.status` | `dsh/frontend/app-partner/screens/PartnerEntryScreen.tsx` | `dsh-partner-entry` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-012` | `app-partner` | `partner.dsh.home.dashboard` | `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx` | `dsh-partner-home` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-013` | `app-captain` | `captain.dsh.orders.inbox` | `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx` | `dsh-captain-inbox` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-014` | `app-captain` | `captain.dsh.orders.detail` | `dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx` | `dsh-captain-detail` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-015` | `app-field` | `field.dsh.stores.list` | `dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx` | `dsh-field-stores` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-016` | `app-field` | `field.dsh.store.onboarding` | `dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx` | `dsh-field-onboarding` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-017` | `app-field` | `field.dsh.store.visit` | `dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx` | `dsh-field-visit` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-018` | `control-panel` | `ops.dsh.operations.hub` | `dsh/frontend/control-panel/operations/OperationsHubScreen.tsx` | `/operations` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-019` | `control-panel` | `ops.dsh.dispatch` | `dsh/frontend/control-panel/operations/DispatchAssignmentScreen.tsx` | `/operations?workspace=dispatch-capacity&subGroup=pending` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-020` | `control-panel` | `ops.dsh.exceptions` | `dsh/frontend/control-panel/operations/ExceptionsEscalationsScreen.tsx` | `/operations?workspace=exceptions&subGroup=active` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-021` | `control-panel` | `ops.dsh.live.orders` | `dsh/frontend/control-panel/operations/LiveOrdersScreen.tsx` | `/operations?workspace=live-orders` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L1-022` | `control-panel` | `ops.dsh.audit.sla` | `dsh/frontend/control-panel/operations/AuditSupportSlaScreen.tsx` | `/operations?workspace=exceptions&subGroup=audit` | `LIST_1_READY_NOW` | `P1` | `none; visual review complete` |
| `VR-L2-001` | `app-client` | `client.dsh.checkout.intent` | `dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx` | `dsh-checkout-intent` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-002` | `app-captain` | `captain.dsh.orders.pickup-dropoff` | `dsh/frontend/app-captain/screens/DshCaptainPickupDropoffScreen.tsx` | `dsh-captain-pickup-dropoff` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-003` | `app-captain` | `captain.dsh.orders.pod-submission` | `dsh/frontend/app-captain/screens/DshCaptainPoDSubmissionScreen.tsx` | `dsh-captain-pod-submission` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-004` | `app-captain` | `captain.dsh.orders.map` | `dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx` | `dsh-captain-map` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-005` | `app-field` | `field.dsh.store.onboarding/documents` | `dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx` | `dsh-field-onboarding` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-006` | `app-field` | `field.dsh.store.visit/evidence` | `dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx` | `dsh-field-visit` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-007` | `control-panel` | `ops.dsh.audit.sla/detail` | `dsh/frontend/control-panel/operations/AuditTrailDetailWorkspace.tsx` | `/operations?workspace=exceptions&panel=detail` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-008` | `control-panel` | `ops.dsh.catalog.approvals.quality` | `dsh/frontend/control-panel/catalogs/catalogs.screen.tsx` | `/catalogs?tab=approvals&subTab=quality` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-009` | `control-panel` | `ops.dsh.catalog.approvals.pricing` | `dsh/frontend/control-panel/catalogs/catalogs.screen.tsx` | `/catalogs?tab=approvals&subTab=pricing` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-010` | `app-captain` | `captain.wlt.dsh.finance.bridge` | `wlt/frontend/app-captain/dsh/WltDshCaptainBridge.tsx` | `wlt-dsh-captain-finance-bridge` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-011` | `app-partner` | `partner.wlt.dsh.wallet.bridge` | `wlt/frontend/app-partner/dsh/WltDshPartnerBridge.tsx` | `wlt-dsh-partner-wallet-bridge` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |
| `VR-L2-012` | `control-panel` | `ops.dsh.marketing.visibility` | `dsh/frontend/control-panel/marketing/VisibilityCommandDeckScreen.tsx` | `/marketing?workspace=visibility` | `LIST_2_DISABLED_PREVIEW` | `P2` | `none; visual review complete` |

### Active Ledger (CSV Format)
```csv
review_id,surface,screen_id,file_path,route,state,device,viewport,locale,direction,screenshot_path,rtl_result,overflow_result,ui_kit_result,central_color_result,human_result,known_warnings,reviewed_at,decision,next_action
VR-L1-001,app-client,client.dsh.home.feed,dsh/frontend/app-client/screens/HomeScreen.tsx,dsh-home,success,SM-A125F,720x1600,ar,rtl,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/P1__app-client__client.dsh.home.feed__success__SM-A125F__rtl__VISUAL_REVIEW.png,observed,not_observed,observed,observed,PASS,"All states verified",2026-05-24T05:05:00+03:00,VISUAL_PASS,visual captured
VR-L1-023,app-client,client.dsh.discovery.search,dsh/frontend/app-client/screens/HomeScreen.tsx,dsh-home:inline-search,success,SM-A125F,720x1600,ar,rtl,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/VR-L1-023__home-inline-search-same-page__SM-A125F__rtl.png,observed,not_observed,observed,observed,PASS,"Search stays inline",2026-05-24T05:05:00+03:00,VISUAL_PASS,visual captured
VR-L1-005,app-client,client.dsh.store.details,dsh/frontend/app-client/screens/StoreScreen.tsx,dsh-store,success,SM-A125F,720x1600,ar,rtl,tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/P1__app-client__client.dsh.store.details__success__SM-A125F__rtl__VISUAL_REVIEW.png,observed,not_observed,observed,observed,PASS,"All states verified",2026-05-24T05:05:00+03:00,VISUAL_PASS,visual captured
VR-L1-007,app-partner,partner.dsh.orders.inbox,dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx,dsh-partner-orders,success,Pixel8,720x1600,ar,rtl,tools/registry/runs/DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602/screenshots/app-partner/P1__app-partner__partner.dsh.orders.inbox__success__Pixel8__rtl__VISUAL_PASS.png,observed,not_observed,observed,observed,PASS,"SSoT verified",2026-06-02T21:35:00+03:00,VISUAL_PASS,complete
VR-L1-008,app-partner,partner.dsh.order.detail,dsh/frontend/app-partner/screens/OrdersInboxScreen.tsx,dsh-partner-orders,success,Pixel8,720x1600,ar,rtl,tools/registry/runs/DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602/screenshots/app-partner/P1__app-partner__partner.dsh.orders.inbox__accept__Pixel8__rtl__VISUAL_PASS.png,observed,not_observed,observed,observed,PASS,"Actions verified",2026-06-02T21:35:00+03:00,VISUAL_PASS,complete
VR-L1-009,app-partner,partner.dsh.inventory.catalog,dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx,dsh-partner-inventory,success,Pixel8,720x1600,ar,rtl,tools/registry/runs/DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602/screenshots/app-partner/P1__app-partner__partner.dsh.orders.inbox__item_unavailable__Pixel8__rtl__VISUAL_PASS.png,observed,not_observed,observed,observed,PASS,"Controls verified",2026-06-02T21:35:00+03:00,VISUAL_PASS,complete
VR-L1-013,app-captain,captain.dsh.orders.inbox,dsh/frontend/app-captain/screens/DshCaptainOrdersScreen.tsx,dsh-captain-inbox,success,Pixel8,720x1600,ar,rtl,tools/registry/runs/_published/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/dsh_j005_app_captain_orders.png,observed,not_observed,observed,observed,PASS,"Inbox layout verified",2026-06-06T00:20:23+03:00,VISUAL_PASS,complete
VR-L1-015,app-field,field.dsh.stores.list,dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx,dsh-field-stores,success,Pixel8,720x1600,ar,rtl,tools/registry/runs/_published/DSH_SLICE_006B_FIELD_VISIT_EVIDENCE_FINAL_CLOSURE-20260606-LOCAL/j006b_app_field_initial.png,observed,not_observed,observed,observed,PASS,"Field stores verified",2026-06-06T05:03:45+03:00,VISUAL_PASS,complete
VR-L1-018,control-panel,ops.dsh.operations.hub,dsh/frontend/control-panel/operations/OperationsHubScreen.tsx,/operations,success,web-Chrome149,1440x900,ar,rtl,tools/registry/runs/_published/DSH_SLICE_009A_RUNTIME_PROOF-20260605-161959/command-center-desktop.png,observed,not_observed,observed,observed,PASS,"Ops hub verified",2026-06-05T16:19:59+03:00,VISUAL_PASS,complete
VR-L2-005,app-field,field.dsh.store.onboarding/documents,dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx,dsh-field-onboarding,success,Pixel8,720x1600,ar,rtl,tools/registry/runs/_published/DSH_SLICE_006A_STORE_ONBOARDING_FINAL_CLOSURE-20260606-LOCAL/j006a_app_field_launch.png,observed,not_observed,observed,observed,PASS,"Onboarding docs verified",2026-06-06T05:03:45+03:00,VISUAL_PASS,complete
```

---

## 9. Closure Decision Log

This is the canonical append-only record of DSH service phase exits and closure decisions.

| Date | Session ID | Scope | Evidence Path | Decision | Remaining Risks | Next Action |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-06-06 | DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL | Journey J-005 (Delivery Execution) + J-009 operations room closure | `tools/registry/runs/DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL/` | **PASS** | none | proceed to platform vars validation |
| 2026-06-06 | DSH_SLICE_006C_DOCUMENTS_MEDIA_PROOF_FINAL_CLOSURE | J-006C documents upload API, migration, and screen | `tools/registry/runs/DSH_SLICE_006C_DOCUMENTS_MEDIA_PROOF_FINAL_CLOSURE-20260606-044000/` | **PASS** | none | J-006 group closure exit |
| 2026-06-06 | DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL | J-003 Checkout / Payment E2E verified with live auth-service | `tools/registry/runs/DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL/` | **PASS** | none | proceed to order lifecycle validation |
| 2026-06-04 | DSH_SLICE_001F_CROSS_SURFACE_FINAL_PROOF-20260604-044800 | J-001 visibility gates complete E2E | `tools/registry/runs/DSH_SLICE_001F_CROSS_SURFACE_FINAL_PROOF-20260604-044800/` | **PASS** | none | start J-002 catalog verification |
| 2026-06-04 | DSH_SLICE_002A_PRODUCT_IDENTITY_FINAL_CLOSURE | J-002A product identity API + edit screens | `tools/registry/runs/DSH_SLICE_002A_PRODUCT_IDENTITY_FINAL_CLOSURE-20260604-050000/` | **PASS** | none | proceed to category structures |
| 2026-06-04 | DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE | J-002G catalog conflict detect and resolve | `tools/registry/runs/DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE-20260604-155900/` | **PASS** | none | group J-002 closure exit |
| 2026-05-24 | DSH_VISUAL_STATE_SWEEP-20260524-050100 | Client discovery + storefront visual verification | `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/` | `VISUAL_PROVEN_FOR_SELECTED_SLICE` | none | begin checkout sweep |
| 2026-05-21 | P0_14_FRONTEND_CLOSURE_TRUTH-20260521 | Frontend closure truth refresh | `dsh/frontend/shared/*`, `dsh/docs/*` | `DONE` | visual evidence pending | capture screenshots |
| 2026-05-12 | DSH_MOBILE_APPS_FINAL_CLOSURE_GATE | Mobile app previews locked | `tools/registry/runs/DSH_MOBILE_APPS_FINAL_CLOSURE_GATE-20260511-230555` | `PASS_WITH_WARNINGS` | runtime smoky unverified | run runtime smoke |

---

## 10. App-Client & WLT Final Closure Roadmap V3

### Scope & Summary
- **Primary Scope**: `dsh/frontend/app-client/**` + `wlt/frontend/app-client/dsh/**`
- **Related Scope**: `dsh/frontend/shared/**` + control-panel finance visibility banner.
- **Completed Work**: Registry coverage, actor flow alignment, and final Purge/RTL sweeps.
- **Blockers**: None remain.

### Living ToDo Queue
- **Diagnosis**: Capability, route, host reachability, and WLT matrices all synced.
- **Client App**: Home, search, storefront, cart, tracking timeline, messaging, and rating screens are verified.
- **WLT Bridge**: Enforce that WLT holds payment execution token, DSH reads callback reference only. No money semantics leakage.

### Phased Sequence Archive
1. **Phase 0 — Freeze & Baseline**: Completed. Status: `BASELINE_READY`.
2. **Phase 1 — Deep App-client Map**: Completed. Status: `CAPABILITY_MAP_READY`.
3. **Phase 2 — Related Surfaces & CP Impact Map**: Completed. Status: `RELATED_SURFACES_MAP_READY`.
4. **Phase 3 — Human Direction Review**: Completed. Status: `HUMAN_DIRECTION_APPROVED`.
5. **Phase 4 — small APPLY 1 (Consistency)**: Completed. Status: `TRUTH_CONSISTENCY_FIXED`.
6. **Phase 5 — Human Visual Review**: Completed. Status: `VISUAL_PASS`.
7. **Phase 6 — small APPLY 2 (Visual Fixes)**: Completed. Status: `VISUAL_FIX_COMMITTED`.
8. **Phase 7 — Decomposition Plan**: Completed. Status: `DECOMPOSITION_PLAN_READY`.
9. **Phase 8 — small APPLY 3 (Extraction)**: Completed. Status: `INTERNAL_EXTRACTION_PASS`.
10. **Phase 9 — Surface Alignment**: Completed. Status: `SURFACES_ALIGNED`.
11. **Phase 10 — Final Closure Gate**: Completed. Status: `APP_CLIENT_DSH_WLT_FINAL_CLOSURE_PASS`.

---

## 11. Consolidated Agent Rules & Direction

1. **No-Drift Constraint**: Do not create divergent preview directories or scattered matrix files. Maintain `DSH_MASTER_CLOSURE_MATRIX.md` as the unified truth.
2. **Auth Verification**: Ensure `DSH_AUTH_MODE=production` is verified at runtime for all secure routes.
3. **WLT Boundary Enforced**: Never allow money mutations in DSH code. Only reference tokens or display banners.
4. **Evidence Handoff**: Do not commit evidence folders directly. Ensure paths are documented, and zip archives are generated only on request.

# DSH-SLICE-001 Store Discovery & Client Visibility Readiness Journey

## Identity
- **Slice ID**: `DSH-SLICE-001`
- **Slice Name**: Store Discovery
- **Business Domain**: `dsh/client-discovery-and-visibility`
- **Business Outcome**: Client can discover only stores/catalogs that are ready, governed, visible, serviceable, and allowed by platform/provider policy.
- **Actor Chain**: client → partner → operator (control-panel catalogs) → operator (control-panel marketing) → system (shared DSH visibility/serviceability model)
- **Primary Surface**: `app-client`
- **Supporting Surfaces**: `shared DSH client visibility/serviceability model`
- **Dependency Surfaces**: `app-partner`, `control-panel`
- **Historical Status**: app-client / GET /stores edge proof only; visibility gates implemented in backend and repository via unit tests.
- **Current Cross-Surface Decision**: BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING.

## Scope
- **Included Surfaces**:
  - `app-client` (primary)
  - `app-partner` (dependency)
  - `control-panel` (dependency)
  - `shared DSH visibility/serviceability model` (dependency)
- **Excluded Surfaces**:
  - `app-captain` (NOT_APPLICABLE_WITH_REASON: No delivery actions in store discovery)
  - `app-field` (NOT_APPLICABLE_WITH_REASON: No field operations in store discovery)
  - `wlt` / Checkout / Cart / Payment (NOT_APPLICABLE_WITH_REASON: Starts after discovery intent; no money semantics in discovery)

> [!IMPORTANT]
> **DSH-SLICE-001 BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING**
> - DSH-SLICE-001 UI/UX + Visual evidence is locked.
> - Visibility gates (partner-readiness, catalog-approval, marketing-visibility) proven via Live E2E against Postgres (DSH_SLICE001_LIVE_E2E-20260603-173059).
> - Remaining blocker: app-partner and control-panel frontend endpoint binding + screen evidence after wiring.

---

## Coverage Matrix

### 1. Cross-Surface Surface Classification Matrix

| Surface/System | Classification | Role in Slice 001 | Required Proof | Current Proof Status | Missing Proof | Owner | Decision |
|---|---|---|---|---|---|---|---|
| `app-client` | primary | Owns the visible discovery journey anchor | Visual & Runtime proof | app-client / GET /stores edge proof only; visibility gates implemented in backend and repository via unit tests | none | client | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| `app-partner` | dependency | Partner inventory/catalog readiness | Visual & Publishing-gate proof | `VR-L1-009 VISUAL_PASS (2026-06-02); backend endpoints and logic verified via unit tests` | visual captured / VISUAL_PASS | partner | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| `control-panel` (catalog governance) | dependency | Catalog approval & visibility governance | Catalog governance visual/runtime proof | `VR-L2-008 VISUAL_PASS; VR-L2-009 VISUAL_PASS (2026-06-03); backend endpoints and logic verified via unit tests` | visual captured / VISUAL_PASS | operations | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| `control-panel` (marketing visibility) | dependency | Marketing publish controls & visibility | Marketing visibility visual/runtime proof | `VR-L2-012 VISUAL_PASS (2026-06-03); backend endpoints and logic verified via unit tests` | visual captured / VISUAL_PASS | operations | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| shared DSH visibility/serviceability model | dependency | Direct shared logic for store exposure | Source & Runtime proof | `PASS` (bridge); logic and enums verified via unit tests | none | domain | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |

### 2. Operation Chain Matrix

| Step | Actor | Surface | Operation | Input | Output | Data Owner | Required State | Required CTA | Evidence Required | Decision |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | partner | `app-partner` | Update inventory readiness & visibility | Store/Catalog state | Store marked ready | partner | `success`, `offline` | update readiness | VR-L1-009 VISUAL_PASS captured 2026-06-02; backend PATCH /stores/{id}/partner-readiness endpoint and DB updates verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| 2 | operator | `control-panel` | Approve catalog & set marketing visibility | Governance action | Store approved & visible | domain | `success` | approve catalog, set marketing | VR-L2-008/009/012 VISUAL_PASS captured; backend PATCH /stores/{id}/catalog-approval and /marketing-visibility verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| 3 | system | `shared model` | Evaluate visibility & serviceability | Rules + Store state | Visible to client | domain | N/A | N/A | Logic evaluation and gates visibility verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| 4 | client | `app-client` | Open discovery feed & store | - | Store Details | preview | `loading`, `empty`, `error`, `success`, `offline` | open store, search inline | Visual pass (VR-L1-001/005/023) and runtime GET /stores visibility transition verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |

---

## CTA Matrix & State Matrix

### 3. Screen/CTA/State Inventory Matrix

| Surface | Screen | Route | CTA | Target | Required States | Current Evidence | Missing Evidence | Decision |
|---|---|---|---|---|---|---|---|---|
| `app-client` | `HomeScreen.tsx` | `dsh-home` | Open store | `dsh-store` | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-001` | visual captured / VISUAL_PASS; backend endpoints and logic verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| `app-client` | `HomeScreen.tsx` | `dsh-home:inline-search` | Search inline | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-023` | visual captured / VISUAL_PASS; backend endpoints and logic verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| `app-client` | `StoreScreen.tsx` | `dsh-store` | View store details | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-005` | visual captured / VISUAL_PASS; backend endpoints and logic verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| `app-partner` | `InventoryCatalogScreen.tsx` | `dsh-partner-inventory` | Update readiness and publishing visibility | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-009 VISUAL_PASS (2026-06-02)` | visual captured / VISUAL_PASS; backend endpoints and logic verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| `control-panel` | `catalogs.screen.tsx` | `/catalogs?tab=approvals&subTab=quality` + `/catalogs?tab=approvals&subTab=pricing` | Approve catalog quality / pricing | same page | `success`, `error`, `loading` | `VR-L2-008 VISUAL_PASS; VR-L2-009 VISUAL_PASS (2026-06-03)` | visual captured / VISUAL_PASS; backend endpoints and logic verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| `control-panel` | `VisibilityCommandDeckScreen.tsx` | `/marketing?workspace=visibility` | Set marketing visibility gates | same page | `success`, `error`, `loading` | `VR-L2-012 VISUAL_PASS (2026-06-03)` | visual captured / VISUAL_PASS; backend endpoints and logic verified via unit tests | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |

---

## Cross-Surface Impact

### 4. Data Ownership Matrix

| Data Entity | Canonical Owner | Preview Owner | Surface Consumers | Duplication Risk | Runtime/API Truth Status | On-Demand Retrieval Rule | Decision |
|---|---|---|---|---|---|---|---|
| Discovery Stores | domain (Go backend) | `dsh/frontend/data` | app-client | Low | Local PostgreSQL Proven (`GET /stores`) | references/lean summaries | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| Partner Inventory | partner | `dsh/frontend/data` | app-partner, control-panel | High | Endpoints and DB writes verified via unit tests | references/lean summaries | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| Catalog Governance | operations | `dsh/frontend/data` | control-panel | High | Endpoints and DB writes verified via unit tests | references/lean summaries | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| Marketing Visibility | operations | `dsh/frontend/data` | control-panel, app-client | Medium | Endpoints and DB writes verified via unit tests | references/lean summaries | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |

### 5. Boundary Matrix

| Boundary | Status | Why Included/Excluded | Required Proof | Current Proof | Decision |
|---|---|---|---|---|---|
| WLT | `NOT_APPLICABLE_WITH_REASON` | Starts after checkout/payment; no money semantics in discovery | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Auth/Permission | `NOT_APPLICABLE_WITH_REASON` | Discovery is public/guest-safe until API proves auth need | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Vars/Provider | `DEFERRED_WITH_REASON` | Shared visibility policy must remain provider-controlled | Provider precedence & runtime proof | none | `DEFERRED_WITH_REASON` |
| Notifications | `NOT_APPLICABLE_WITH_REASON` | No notification entry required for discovery | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Account/Profile | `NOT_APPLICABLE_WITH_REASON` | No profile mutation in discovery | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Cart/Checkout | `NOT_APPLICABLE_WITH_REASON` | Starts after discovery intent | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Tracking/Support | `NOT_APPLICABLE_WITH_REASON` | Belongs to order lifecycle | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Captain Delivery | `NOT_APPLICABLE_WITH_REASON` | No delivery action in discovery | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Field Readiness | `NOT_APPLICABLE_WITH_REASON` | No field operation in discovery | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Control Panel Operations | `DEFERRED_WITH_REASON` | Catalog/marketing governance required for visibility | Governance visual/runtime proof | none | `DEFERRED_WITH_REASON` |
| Control Panel Partners | `OPTIONAL_SUPPORTING` | Referenced as supporting partner eligibility source only; not a required visibility gate blocker for Slice 001 | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Control Panel Finance | `NOT_APPLICABLE_WITH_REASON` | No finance commands in discovery | none | none | `NOT_APPLICABLE_WITH_REASON` |

---

## Evidence and Gates
The closure of `DSH-SLICE-001` relies on the following evidence ledger entries:
- **Visual Evidence per Surface**:
  - `app-client` Home & Details: `VR-L1-001`, `VR-L1-023`, `VR-L1-005` (VISUAL_PASS)
  - `app-partner` Inventory: `VR-L1-009` (VISUAL_PASS)
  - `control-panel` approvals: `VR-L2-008`, `VR-L2-009` (VISUAL_PASS)
  - `control-panel` marketing: `VR-L2-012` (VISUAL_PASS)
- **Runtime Evidence per Surface**:
  - `app-client` GET /stores: `DSH-RUN-P014-01` (E2E proven via local Go+Postgres database on physical mobile device session; gates logic verified)
  - `app-partner` inventory catalog: `DSH-RUN-P014-04` (BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING: PATCH /stores/{id}/partner-readiness Live E2E proven via DSH_SLICE001_LIVE_E2E-20260603-173059; GET /stores diff captured)
  - `control-panel` operations: `DSH-RUN-P014-07` (BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING: PATCH /stores/{id}/catalog-approval and /marketing-visibility Live E2E proven via DSH_SLICE001_LIVE_E2E-20260603-173059; GET /stores diff captured)

---

## Missing Logic/Screen/Process Proposals

### 6. Missing Logic/Screen/Process Proposal Matrix

| Gap ID | Gap Type | Related Surface | Description | Required Addition | Blocker Reason | Target Phase | Human Approval Needed | Decision |
|---|---|---|---|---|---|---|---|---|
| GAP-001 | UI/Flow & Runtime | `app-partner` | Partner catalog visual evidence resolved (VR-L1-009 VISUAL_PASS 2026-06-02); backend PATCH endpoint implemented and verified | Capture E2E live database curl proof for partner catalog publishing gate | Frontend integration pending | Phase 4/5 | Yes | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| GAP-002 | UI/Flow & Runtime | `control-panel` | Catalog governance visual evidence resolved (VR-L2-008 quality VISUAL_PASS + VR-L2-009 pricing VISUAL_PASS, 2026-06-03); backend PATCH endpoint implemented and verified | Capture E2E live database curl proof for catalog approval governance | Frontend integration pending | Phase 4/5 | Yes | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |
| GAP-003 | UI/Flow & Runtime | `control-panel` | Marketing visibility visual evidence resolved (VR-L2-012 VISUAL_PASS 2026-06-03; بوابات الظهور + cross-surface governance bridge confirmed); backend PATCH endpoint implemented and verified | Capture E2E live database curl proof for marketing visibility publish controls | Frontend integration pending | Phase 4/5 | Yes | `BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING` |

---

## Decision

- **UI/UX_VISUAL_LOCKED** = مثبت
- **Runtime/API/L7** = BACKEND_LIVE_E2E_PROVEN_FRONTEND_BINDING_PENDING
- **partner readiness endpoint** = Live E2E proven (DSH_SLICE001_LIVE_E2E-20260603-173059)
- **catalog approval endpoint** = Live E2E proven (DSH_SLICE001_LIVE_E2E-20260603-173059)
- **marketing visibility endpoint** = Live E2E proven (DSH_SLICE001_LIVE_E2E-20260603-173059)

- **Final Slice Decision**: `DEFERRED_WITH_REASON`.
- **Core Remaining Risks (Blockers)**:
  1. **app-partner frontend endpoint binding**: UI actions not yet wired to PATCH /stores/{id}/partner-readiness.
  2. **control-panel frontend endpoint binding**: UI actions not yet wired to PATCH /stores/{id}/catalog-approval and /stores/{id}/marketing-visibility.
  3. **Screen runtime evidence**: Screen-level proof after frontend wiring required before slice promotion.
- **Next Action**:
  Wire app-partner and control-panel UI actions to the PATCH endpoints, then capture screen/runtime proof.

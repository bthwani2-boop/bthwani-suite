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
- **Historical Status**: app-client / GET /stores edge proof only; not full cross-surface Slice 001 closure.
- **Current Cross-Surface Decision**: DSH-SLICE-001 UI_UX_VISUAL_LOCKED.

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
> **DSH-SLICE-001 UI_UX_VISUAL_LOCKED**
> - DSH-SLICE-001 UI/UX + Visual evidence is locked.
> - Runtime/API/L7 closure remains deferred until API binding and E2E cross-surface runtime proof are approved and proven.
> - Required runtime chain remains:
>   partner readiness → catalog approval → marketing visibility → shared visibility/serviceability model → app-client discovery result.

---

## Coverage Matrix

### 1. Cross-Surface Surface Classification Matrix

| Surface/System | Classification | Role in Slice 001 | Required Proof | Current Proof Status | Missing Proof | Owner | Decision |
|---|---|---|---|---|---|---|---|
| `app-client` | primary | Owns the visible discovery journey anchor | Visual & Runtime proof | app-client / GET /stores edge proof only; not full cross-surface Slice 001 closure | none | client | `DEFERRED_WITH_REASON` |
| `app-partner` | dependency | Partner inventory/catalog readiness | Visual & Publishing-gate proof | `VR-L1-009 VISUAL_PASS (2026-06-02, DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602)` | visual captured / VISUAL_PASS; runtime proof deferred | partner | `DEFERRED_WITH_REASON` |
| `control-panel` (catalog governance) | dependency | Catalog approval & visibility governance | Catalog governance visual/runtime proof | `VR-L2-008 VISUAL_PASS; VR-L2-009 VISUAL_PASS (2026-06-03, DSH_SLICE001_REALITY_SYNC-20260603)` | visual captured / VISUAL_PASS; runtime proof deferred | operations | `DEFERRED_WITH_REASON` |
| `control-panel` (marketing visibility) | dependency | Marketing publish controls & visibility | Marketing visibility visual/runtime proof | `VR-L2-012 VISUAL_PASS (2026-06-03, DSH_SLICE001_REALITY_SYNC-20260603)` | visual captured / VISUAL_PASS; runtime proof deferred | operations | `DEFERRED_WITH_REASON` |
| shared DSH visibility/serviceability model | dependency | Direct shared logic for store exposure | Source & Runtime proof | `PASS` (bridge) | E2E Cross-surface runtime logic | domain | `DEFERRED_WITH_REASON` |

### 2. Operation Chain Matrix

| Step | Actor | Surface | Operation | Input | Output | Data Owner | Required State | Required CTA | Evidence Required | Decision |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | partner | `app-partner` | Update inventory readiness & visibility | Store/Catalog state | Store marked ready | partner | `success`, `offline` | update readiness | VR-L1-009 VISUAL_PASS captured 2026-06-02 (DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602); runtime handoff deferred | `DEFERRED_WITH_REASON` |
| 2 | operator | `control-panel` | Approve catalog & set marketing visibility | Governance action | Store approved & visible | domain | `success` | approve catalog, set marketing | Visual & runtime handoff | `DEFERRED_WITH_REASON` |
| 3 | system | `shared model` | Evaluate visibility & serviceability | Rules + Store state | Visible to client | domain | N/A | N/A | Logic evaluation logs | `DEFERRED_WITH_REASON` |
| 4 | client | `app-client` | Open discovery feed & store | - | Store Details | preview | `loading`, `empty`, `error`, `success`, `offline` | open store, search inline | Visual & runtime (DSH-RUN-P014-01) | `DEFERRED_WITH_REASON` |

---

## CTA Matrix & State Matrix

### 3. Screen/CTA/State Inventory Matrix

| Surface | Screen | Route | CTA | Target | Required States | Current Evidence | Missing Evidence | Decision |
|---|---|---|---|---|---|---|---|---|
| `app-client` | `HomeScreen.tsx` | `dsh-home` | Open store | `dsh-store` | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-001` | visual captured / VISUAL_PASS; runtime proof deferred | `DEFERRED_WITH_REASON` |
| `app-client` | `HomeScreen.tsx` | `dsh-home:inline-search` | Search inline | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-023` | visual captured / VISUAL_PASS; runtime proof deferred | `DEFERRED_WITH_REASON` |
| `app-client` | `StoreScreen.tsx` | `dsh-store` | View store details | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-005` | visual captured / VISUAL_PASS; runtime proof deferred | `DEFERRED_WITH_REASON` |
| `app-partner` | `InventoryCatalogScreen.tsx` | `dsh-partner-inventory` | Update readiness and publishing visibility | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-009 VISUAL_PASS (2026-06-02, DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602)` | visual captured / VISUAL_PASS; runtime proof deferred | `DEFERRED_WITH_REASON` |
| `control-panel` | `catalogs.screen.tsx` | `/catalogs?tab=approvals&subTab=quality` + `/catalogs?tab=approvals&subTab=pricing` | Approve catalog quality / pricing | same page | `success`, `error`, `loading` | `VR-L2-008 VISUAL_PASS; VR-L2-009 VISUAL_PASS (2026-06-03)` | visual captured / VISUAL_PASS; runtime proof deferred | `DEFERRED_WITH_REASON` |
| `control-panel` | `VisibilityCommandDeckScreen.tsx` | `/marketing?workspace=visibility` | Set marketing visibility gates | same page | `success`, `error`, `loading` | `VR-L2-012 VISUAL_PASS (2026-06-03, DSH_SLICE001_REALITY_SYNC-20260603)` | visual captured / VISUAL_PASS; runtime proof deferred | `DEFERRED_WITH_REASON` |

---

## Cross-Surface Impact

### 4. Data Ownership Matrix

| Data Entity | Canonical Owner | Preview Owner | Surface Consumers | Duplication Risk | Runtime/API Truth Status | On-Demand Retrieval Rule | Decision |
|---|---|---|---|---|---|---|---|
| Discovery Stores | domain (Go backend) | `dsh/frontend/data` | app-client | Low | Local PostgreSQL Proven (`GET /stores`) | references/lean summaries | `DEFERRED_WITH_REASON` |
| Partner Inventory | partner | `dsh/frontend/data` | app-partner, control-panel | High | Unproven | references/lean summaries | `DEFERRED_WITH_REASON` |
| Catalog Governance | operations | `dsh/frontend/data` | control-panel | High | Unproven | references/lean summaries | `DEFERRED_WITH_REASON` |
| Marketing Visibility | operations | `dsh/frontend/data` | control-panel, app-client | Medium | Unproven | references/lean summaries | `DEFERRED_WITH_REASON` |

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
  - `app-client` GET /stores: `DSH-RUN-P014-01` (E2E proven via local Go+Postgres database on physical mobile device session)
  - `app-partner` inventory catalog: `DSH-RUN-P014-04` (HANDOFF_BLOCKED: accept/reject/ready buttons are UI preview-only; no backend API connection is proven)
  - `control-panel` operations: `DSH-RUN-P014-07` (HANDOFF_BLOCKED: catalog approval and marketing visibility actions are UI preview-only; no backend API connection is proven)

---

## Missing Logic/Screen/Process Proposals

### 6. Missing Logic/Screen/Process Proposal Matrix

| Gap ID | Gap Type | Related Surface | Description | Required Addition | Blocker Reason | Target Phase | Human Approval Needed | Decision |
|---|---|---|---|---|---|---|---|---|
| GAP-001 | UI/Flow & Runtime | `app-partner` | Partner catalog visual evidence resolved (VR-L1-009 VISUAL_PASS 2026-06-02); publishing-gate runtime proof still required | Capture runtime proof for partner catalog publishing gate | Runtime/API not ready — blocked until API binding approved | Phase 4/5 | Yes | `BLOCKED_WITH_REASON` |
| GAP-002 | UI/Flow & Runtime | `control-panel` | Catalog governance visual evidence resolved (VR-L2-008 quality VISUAL_PASS + VR-L2-009 pricing VISUAL_PASS, 2026-06-03); catalog runtime proof still required | Capture runtime proof for catalog approval governance | Runtime/API not ready — blocked until API binding approved | Phase 4/5 | Yes | `BLOCKED_WITH_REASON` |
| GAP-003 | UI/Flow & Runtime | `control-panel` | Marketing visibility visual evidence resolved (VR-L2-012 VISUAL_PASS 2026-06-03; بوابات الظهور + cross-surface governance bridge confirmed); marketing runtime proof still required | Capture runtime proof for marketing visibility publish controls | Runtime/API not ready — blocked until API binding approved | Phase 4/5 | Yes | `BLOCKED_WITH_REASON` |

---

## Decision

- **UI/UX_VISUAL_LOCKED** = مثبت
- **Runtime/API/L7** = DEFERRED_WITH_REASON
- **partner catalog/readiness endpoint** = blocker
- **catalog approval endpoint** = blocker
- **marketing visibility endpoint** = blocker

- **Final Slice Decision**: `DEFERRED_WITH_REASON` (Not CLOSED, not PASS).
- **Core Remaining Risks (Blockers)**:
  1. **partner catalog/readiness endpoint** is unimplemented.
  2. **catalog approval endpoint** is unimplemented.
  3. **marketing visibility endpoint** is unimplemented.
- **Next Action**:
  Prepare subsequent runtime/API slice to implement the three missing backend endpoints, or transition to DSH-SLICE-002 only after accepting that these blockers are explicitly deferred.

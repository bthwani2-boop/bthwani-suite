# DSH-SLICE-001 Store Discovery & Client Visibility Readiness Journey

#Slice: DSH-SLICE-001
Domain: dsh/client-discovery-and-visibility
Historical Status: L7_CLOSED for app-client discovery edge only.
Current Cross-Surface Decision: FULL_CROSS_SURFACE_REOPENED_FOR_PROOF.

Business outcome:
Client can discover only stores/catalogs that are ready, governed, visible, serviceable, and allowed by platform/provider policy.

## 1. Cross-Surface Surface Classification Matrix

| Surface/System | Classification | Role in Slice 001 | Required Proof | Current Proof Status | Missing Proof | Owner | Decision |
|---|---|---|---|---|---|---|---|
| `app-client` | primary | Owns the visible discovery journey anchor | Visual & Runtime proof | `PASS` (DSH-RUN-P014-01) | none | client | `PASS` |
| `app-partner` | dependency | Partner inventory/catalog readiness | Visual & Publishing-gate proof | `needs-visual-evidence` | Partner UI & Runtime evidence | partner | `DEFERRED_WITH_REASON` |
| `control-panel` (catalog governance) | dependency | Catalog approval & visibility governance | Catalog governance visual/runtime proof | `needs-visual-evidence` | Governance UI & Runtime evidence | operations | `DEFERRED_WITH_REASON` |
| `control-panel` (marketing visibility) | dependency | Marketing publish controls & visibility | Marketing visibility visual/runtime proof | `needs-visual-evidence` | Marketing UI & Runtime evidence | operations | `DEFERRED_WITH_REASON` |
| shared DSH visibility/serviceability model | dependency | Direct shared logic for store exposure | Source & Runtime proof | `PASS` (bridge) | E2E Cross-surface runtime logic | domain | `DEFERRED_WITH_REASON` |

## 2. Operation Chain Matrix

| Step | Actor | Surface | Operation | Input | Output | Data Owner | Required State | Required CTA | Evidence Required | Decision |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | partner | `app-partner` | Update inventory readiness & visibility | Store/Catalog state | Store marked ready | partner | `success`, `offline` | update readiness | Visual & runtime handoff | `DEFERRED_WITH_REASON` |
| 2 | operator | `control-panel` | Approve catalog & set marketing visibility | Governance action | Store approved & visible | domain | `success` | approve catalog, set marketing | Visual & runtime handoff | `DEFERRED_WITH_REASON` |
| 3 | system | `shared model` | Evaluate visibility & serviceability | Rules + Store state | Visible to client | domain | N/A | N/A | Logic evaluation logs | `DEFERRED_WITH_REASON` |
| 4 | client | `app-client` | Open discovery feed & store | - | Store Details | preview | `loading`, `empty`, `error`, `success`, `offline` | open store, search inline | Visual & runtime (DSH-RUN-P014-01) | `PASS` |

## 3. Screen/CTA/State Inventory Matrix

| Surface | Screen | Route | CTA | Target | Required States | Current Evidence | Missing Evidence | Decision |
|---|---|---|---|---|---|---|---|---|
| `app-client` | `HomeScreen.tsx` | `dsh-home` | Open store | `dsh-store` | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-001` | none | `PASS` |
| `app-client` | `HomeScreen.tsx` | `dsh-home:inline-search` | Search inline | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-023` | none | `PASS` |
| `app-client` | `StoreScreen.tsx` | `dsh-store` | View store details | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-005` | none | `PASS` |
| `app-partner` | `InventoryCatalogScreen.tsx` | `dsh-partner-inventory` | Update readiness and publishing visibility | same page | `loading`, `empty`, `error`, `success`, `offline` | none | Visual & runtime proof | `DEFERRED_WITH_REASON` |
| `control-panel` | `catalogs.screen.tsx` | `/catalogs` | Approve catalog / marketing | same page | `success`, `error`, `loading` | none | Visual & runtime proof | `DEFERRED_WITH_REASON` |

## 4. Data Ownership Matrix

| Data Entity | Canonical Owner | Preview Owner | Surface Consumers | Duplication Risk | Runtime/API Truth Status | On-Demand Retrieval Rule | Decision |
|---|---|---|---|---|---|---|---|
| Discovery Stores | domain (Go backend) | `dsh/frontend/data` | app-client | Low | Local PostgreSQL Proven (`GET /stores`) | references/lean summaries | `PASS` |
| Partner Inventory | partner | `dsh/frontend/data` | app-partner, control-panel | High | Unproven | references/lean summaries | `DEFERRED_WITH_REASON` |
| Catalog Governance | operations | `dsh/frontend/data` | control-panel | High | Unproven | references/lean summaries | `DEFERRED_WITH_REASON` |
| Marketing Visibility | operations | `dsh/frontend/data` | control-panel, app-client | Medium | Unproven | references/lean summaries | `DEFERRED_WITH_REASON` |

## 5. Boundary Matrix

| Boundary | Status | Why Included/Excluded | Required Proof | Current Proof | Decision |
|---|---|---|---|---|---|
| WLT | `NOT_APPLICABLE_WITH_REASON` | Starts after checkout/payment; no money semantics in discovery | none | none | `PASS` |
| Auth/Permission | `NOT_APPLICABLE_WITH_REASON` | Discovery is public/guest-safe until API proves auth need | none | none | `PASS` |
| Vars/Provider | `DEFERRED_WITH_REASON` | Shared visibility policy must remain provider-controlled | Provider precedence & runtime proof | none | `DEFERRED_WITH_REASON` |
| Notifications | `NOT_APPLICABLE_WITH_REASON` | No notification entry required for discovery | none | none | `PASS` |
| Account/Profile | `NOT_APPLICABLE_WITH_REASON` | No profile mutation in discovery | none | none | `PASS` |
| Cart/Checkout | `NOT_APPLICABLE_WITH_REASON` | Starts after discovery intent | none | none | `PASS` |
| Tracking/Support | `NOT_APPLICABLE_WITH_REASON` | Belongs to order lifecycle | none | none | `PASS` |
| Captain Delivery | `NOT_APPLICABLE_WITH_REASON` | No delivery action in discovery | none | none | `PASS` |
| Field Readiness | `NOT_APPLICABLE_WITH_REASON` | No field operation in discovery | none | none | `PASS` |
| Control Panel Operations | `DEFERRED_WITH_REASON` | Catalog/marketing governance required for visibility | Governance visual/runtime proof | none | `DEFERRED_WITH_REASON` |
| Control Panel Finance | `NOT_APPLICABLE_WITH_REASON` | No finance commands in discovery | none | none | `PASS` |

## 6. Missing Logic/Screen/Process Proposal Matrix

| Gap ID | Gap Type | Related Surface | Description | Required Addition | Blocker Reason | Target Phase | Human Approval Needed | Decision |
|---|---|---|---|---|---|---|---|---|
| GAP-001 | UI/Flow & Runtime | `app-partner` | Missing UI and flow evidence for catalog publishing readiness | Implement/capture visual evidence for partner catalog | Proof not yet captured | Phase 4/5 | Yes | `REQUIRED_ADDITION` |
| GAP-002 | UI/Flow & Runtime | `control-panel` | Missing UI and flow evidence for catalog governance | Implement/capture visual evidence for catalog governance | Proof not yet captured | Phase 4/5 | Yes | `REQUIRED_ADDITION` |
| GAP-003 | UI/Flow & Runtime | `control-panel` | Missing UI and flow evidence for marketing visibility | Implement/capture visual evidence for marketing visibility | Proof not yet captured | Phase 4/5 | Yes | `REQUIRED_ADDITION` |

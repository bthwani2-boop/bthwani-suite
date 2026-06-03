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
| `app-partner` | dependency | Partner inventory/catalog readiness | Visual & Publishing-gate proof | `VR-L1-009 VISUAL_PASS (2026-06-02, DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602)` | Publishing-gate runtime proof (visual captured; runtime deferred) | partner | `DEFERRED_WITH_REASON` |
| `control-panel` (catalog governance) | dependency | Catalog approval & visibility governance | Catalog governance visual/runtime proof | `VR-L2-008 VISUAL_PASS; VR-L2-009 VISUAL_PASS (2026-06-03, DSH_SLICE001_REALITY_SYNC-20260603)` | Runtime proof only (visual captured; runtime deferred) | operations | `DEFERRED_WITH_REASON` |
| `control-panel` (marketing visibility) | dependency | Marketing publish controls & visibility | Marketing visibility visual/runtime proof | `VR-L2-012 VISUAL_PASS (2026-06-03, DSH_SLICE001_REALITY_SYNC-20260603)` | Runtime proof only (visual captured; runtime deferred) | operations | `DEFERRED_WITH_REASON` |
| shared DSH visibility/serviceability model | dependency | Direct shared logic for store exposure | Source & Runtime proof | `PASS` (bridge) | E2E Cross-surface runtime logic | domain | `DEFERRED_WITH_REASON` |

## 2. Operation Chain Matrix

| Step | Actor | Surface | Operation | Input | Output | Data Owner | Required State | Required CTA | Evidence Required | Decision |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | partner | `app-partner` | Update inventory readiness & visibility | Store/Catalog state | Store marked ready | partner | `success`, `offline` | update readiness | VR-L1-009 VISUAL_PASS captured 2026-06-02 (DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602); runtime handoff deferred | `DEFERRED_WITH_REASON` |
| 2 | operator | `control-panel` | Approve catalog & set marketing visibility | Governance action | Store approved & visible | domain | `success` | approve catalog, set marketing | Visual & runtime handoff | `DEFERRED_WITH_REASON` |
| 3 | system | `shared model` | Evaluate visibility & serviceability | Rules + Store state | Visible to client | domain | N/A | N/A | Logic evaluation logs | `DEFERRED_WITH_REASON` |
| 4 | client | `app-client` | Open discovery feed & store | - | Store Details | preview | `loading`, `empty`, `error`, `success`, `offline` | open store, search inline | Visual & runtime (DSH-RUN-P014-01) | `PASS` |

## 3. Screen/CTA/State Inventory Matrix

| Surface | Screen | Route | CTA | Target | Required States | Current Evidence | Missing Evidence | Decision |
|---|---|---|---|---|---|---|---|---|
| `app-client` | `HomeScreen.tsx` | `dsh-home` | Open store | `dsh-store` | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-001` | none | `PASS` |
| `app-client` | `HomeScreen.tsx` | `dsh-home:inline-search` | Search inline | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-023` | none | `PASS` |
| `app-client` | `StoreScreen.tsx` | `dsh-store` | View store details | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-005` | none | `PASS` |
| `app-partner` | `InventoryCatalogScreen.tsx` | `dsh-partner-inventory` | Update readiness and publishing visibility | same page | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-009 VISUAL_PASS (2026-06-02, DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602)` | Runtime proof only (visual captured; publishing-gate runtime deferred) | `DEFERRED_WITH_REASON` |
| `control-panel` | `catalogs.screen.tsx` | `/catalogs?tab=approvals&subTab=quality` + `/catalogs?tab=approvals&subTab=pricing` | Approve catalog quality / pricing | same page | `success`, `error`, `loading` | `VR-L2-008 VISUAL_PASS; VR-L2-009 VISUAL_PASS (2026-06-03)` | Runtime proof only (visual captured) | `DEFERRED_WITH_REASON` |

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
| GAP-001 | UI/Flow & Runtime | `app-partner` | Partner catalog visual evidence resolved (VR-L1-009 VISUAL_PASS 2026-06-02); publishing-gate runtime proof still required | Capture runtime proof for partner catalog publishing gate | Runtime/API not ready — blocked until API binding approved | Phase 4/5 | Yes | `BLOCKED_WITH_REASON` |
| GAP-002 | UI/Flow & Runtime | `control-panel` | Catalog governance visual evidence resolved (VR-L2-008 quality VISUAL_PASS + VR-L2-009 pricing VISUAL_PASS, 2026-06-03); catalog runtime proof still required | Capture runtime proof for catalog approval governance | Runtime/API not ready — blocked until API binding approved | Phase 4/5 | Yes | `BLOCKED_WITH_REASON` |
| GAP-003 | UI/Flow & Runtime | `control-panel` | Marketing visibility visual evidence resolved (VR-L2-012 VISUAL_PASS 2026-06-03; بوابات الظهور + cross-surface governance bridge confirmed); marketing runtime proof still required | Capture runtime proof for marketing visibility publish controls | Runtime/API not ready — blocked until API binding approved | Phase 4/5 | Yes | `BLOCKED_WITH_REASON` |

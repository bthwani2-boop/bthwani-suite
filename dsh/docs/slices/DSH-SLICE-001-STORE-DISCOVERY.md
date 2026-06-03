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
- **Excluded Surfaces**:
  - `app-captain` (NOT_APPLICABLE_WITH_REASON: No delivery actions in store discovery)
  - `app-field` (NOT_APPLICABLE_WITH_REASON: No field operations in store discovery)
  - `wlt` / Checkout / Cart / Payment (NOT_APPLICABLE_WITH_REASON: Starts after discovery intent; no money semantics in discovery)
- **Control Panel Owner**: operations (catalog/marketing governance)
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON` (No money semantics in discovery)
- **Auth/Permission Boundary**: Public/guest-safe for client; auth deferred for governance/partner
- **Vars/Provider Boundary**: `DEFERRED_WITH_REASON` (Shared visibility policy must remain provider-controlled)
- **Notification Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Account/Profile Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Data Ownership**:
  - Discovery Stores: domain (Go backend) / `dsh/frontend/data` for preview
  - Partner Inventory: partner (app-partner) / `dsh/frontend/data` for preview
  - Catalog Governance: operations (control-panel) / `dsh/frontend/data` for preview
  - Marketing Visibility: operations (control-panel) / `dsh/frontend/data` for preview
- **API/Runtime Boundary**:
  - `app-client`: E2E bound to Go backend `GET /stores` (proven via ADB mobile runtime proof)
  - `app-partner`: Preview-only catalog controls; API candidate deferred due to missing partner catalog/readiness endpoint
  - `control-panel`: Preview-only approvals and marketing visibility; API candidates deferred due to missing catalog approval & marketing visibility endpoints

## Scope
The scope of `DSH-SLICE-001` is strictly limited to verifying the user journey where a client discovers available stores, performs inline searches, and views store details, subject to eligibility criteria controlled by partner catalog readiness, catalog quality/pricing governance approvals, and marketing visibility gates.
- **Visual Status**: All surfaces have complete visual review screenshots locked under `tools/registry/runs/`.
- **Runtime Status**: Frontend runtime transport and API bindings are only proven for `app-client` GET /stores. The cross-surface runtime flow remains deferred because the three necessary backend endpoints/handlers (partner readiness, catalog approval, marketing visibility command deck) are not implemented.

## Coverage Matrix

| Row ID | Surface | Route | Screen Owner | Actor | Primary Action | Decision |
|---|---|---|---|---|---|---|
| ROW-001-01 | `app-client` | `dsh-home` | `HomeScreen.tsx` | client | Open store | `PASS` |
| ROW-001-02 | `app-client` | `dsh-home:inline-search` | `HomeScreen.tsx` | client | Search inline | `PASS` |
| ROW-001-03 | `app-client` | `dsh-store` | `StoreScreen.tsx` | client | View store details | `PASS` |
| ROW-001-04 | `app-partner` | `dsh-partner-inventory` | `InventoryCatalogScreen.tsx` | partner | Update readiness & publishing visibility | `DEFERRED_WITH_REASON` |
| ROW-001-05 | `control-panel` | `/catalogs?tab=approvals&subTab=quality` | `catalogs.screen.tsx` | operator | Approve catalog quality | `DEFERRED_WITH_REASON` |
| ROW-001-06 | `control-panel` | `/catalogs?tab=approvals&subTab=pricing` | `catalogs.screen.tsx` | operator | Approve catalog pricing | `DEFERRED_WITH_REASON` |
| ROW-001-07 | `control-panel` | `/marketing?workspace=visibility` | `VisibilityCommandDeckScreen.tsx` | operator | Set marketing visibility gates | `DEFERRED_WITH_REASON` |

---

### Row-by-Row Field Details (27 Fields)

#### ROW-001-01: app-client home feed
- **Slice ID**: `DSH-SLICE-001`
- **Service**: DSH
- **Business Domain**: `dsh/client-discovery-and-visibility`
- **Actor**: client
- **Surface**: `app-client`
- **Route**: `dsh-home`
- **Screen Owner**: `HomeScreen.tsx`
- **Primary Action**: Open store
- **Secondary Actions**: View promo banners, scroll category feeds
- **CTA List**: open store, select category
- **Navigation Target**: `dsh-store`
- **Required States**: `loading`, `empty`, `error`, `success`, `offline`
- **Control Panel Entry**: None
- **Auth/Permission**: Public/guest-safe
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Vars/Provider Dependency**: None
- **Search Dependency**: None
- **Notification Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **Account/Profile Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **API Candidate**: `GET /stores`
- **Binding Status**: `PASS` (wired via `dsh-discovery-stores-transport.ts`)
- **Runtime Status**: `PASS` (E2E proven with local Go backend and Postgres database)
- **Visual Evidence**: `VR-L1-001` (VISUAL_PASS)
- **Git Evidence**: Git status and diff checks recorded under session `DSH_SLICE001_BACKEND_E2E-20260603`
- **Typecheck Evidence**: `pnpm -w exec tsc --noEmit` verified
- **Regression Evidence**: Post-decomposition sweep screenshots under `DSH_BATCH7_ADB_VISUAL_SWEEP-20260524-082321`
- **Decision**: `PASS`

#### ROW-001-02: app-client inline search
- **Slice ID**: `DSH-SLICE-001`
- **Service**: DSH
- **Business Domain**: `dsh/client-discovery-and-visibility`
- **Actor**: client
- **Surface**: `app-client`
- **Route**: `dsh-home:inline-search`
- **Screen Owner**: `HomeScreen.tsx`
- **Primary Action**: Search inline
- **Secondary Actions**: Clear search query
- **CTA List**: type search text, clear search
- **Navigation Target**: same page (inline search results)
- **Required States**: `loading`, `empty`, `error`, `success`, `offline`
- **Control Panel Entry**: None
- **Auth/Permission**: Public/guest-safe
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Vars/Provider Dependency**: None
- **Search Dependency**: Direct search interface query matching
- **Notification Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **Account/Profile Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **API Candidate**: `GET /stores`
- **Binding Status**: `PASS` (wired inline)
- **Runtime Status**: `PASS` (E2E proven with local Go backend and Postgres database)
- **Visual Evidence**: `VR-L1-023` (VISUAL_PASS)
- **Git Evidence**: Git status and diff checks recorded under session `DSH_SLICE001_BACKEND_E2E-20260603`
- **Typecheck Evidence**: `pnpm -w exec tsc --noEmit` verified
- **Regression Evidence**: Sweep screenshots under `DSH_BATCH7_ADB_VISUAL_SWEEP-20260524-082321`
- **Decision**: `PASS`

#### ROW-001-03: app-client store details
- **Slice ID**: `DSH-SLICE-001`
- **Service**: DSH
- **Business Domain**: `dsh/client-discovery-and-visibility`
- **Actor**: client
- **Surface**: `app-client`
- **Route**: `dsh-store`
- **Screen Owner**: `StoreScreen.tsx`
- **Primary Action**: View store details
- **Secondary Actions**: Browse product categories, view store info
- **CTA List**: open product card, view info panel
- **Navigation Target**: `dsh-store` (same page details)
- **Required States**: `loading`, `empty`, `error`, `success`, `offline`
- **Control Panel Entry**: None
- **Auth/Permission**: Public/guest-safe
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Vars/Provider Dependency**: None
- **Search Dependency**: Inline product search
- **Notification Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **Account/Profile Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **API Candidate**: `GET /stores/{id}`
- **Binding Status**: `PASS` (wired via `dsh-discovery-stores-transport.ts`)
- **Runtime Status**: `PASS` (E2E proven with local Go backend and Postgres database)
- **Visual Evidence**: `VR-L1-005` (VISUAL_PASS)
- **Git Evidence**: Git status and diff checks recorded under session `DSH_SLICE001_BACKEND_E2E-20260603`
- **Typecheck Evidence**: `pnpm -w exec tsc --noEmit` verified
- **Regression Evidence**: Sweep screenshots under `DSH_BATCH7_ADB_VISUAL_SWEEP-20260524-082321`
- **Decision**: `PASS`

#### ROW-001-04: app-partner inventory catalog readiness
- **Slice ID**: `DSH-SLICE-001`
- **Service**: DSH
- **Business Domain**: `dsh/client-discovery-and-visibility`
- **Actor**: partner
- **Surface**: `app-partner`
- **Route**: `dsh-partner-inventory`
- **Screen Owner**: `InventoryCatalogScreen.tsx`
- **Primary Action**: Update readiness & publishing visibility
- **Secondary Actions**: Update item stock, set catalog overrides
- **CTA List**: update readiness switch, toggle item availability
- **Navigation Target**: same page
- **Required States**: `loading`, `empty`, `error`, `success`, `offline`
- **Control Panel Entry**: None
- **Auth/Permission**: Partner credentials required (deferred)
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Vars/Provider Dependency**: `DEFERRED_WITH_REASON`
- **Search Dependency**: Barcode and item search
- **Notification Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **Account/Profile Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **API Candidate**: `PUT /partner/stores/readiness` (does not exist in Go backend)
- **Binding Status**: `DEFERRED_WITH_REASON`
- **Runtime Status**: `DEFERRED_WITH_REASON` (blocked by missing partner catalog/readiness endpoint; actions operate on preview/local-state only)
- **Visual Evidence**: `VR-L1-009` (VISUAL_PASS)
- **Git Evidence**: Sweep recorded under `DSH_PARTNER_SSOT_EVIDENCE_SWEEP-20260602`
- **Typecheck Evidence**: `pnpm -w exec tsc --noEmit` verified
- **Regression Evidence**: None
- **Decision**: `DEFERRED_WITH_REASON`

#### ROW-001-05: control-panel catalog quality approval
- **Slice ID**: `DSH-SLICE-001`
- **Service**: DSH
- **Business Domain**: `dsh/client-discovery-and-visibility`
- **Actor**: operator
- **Surface**: `control-panel`
- **Route**: `/catalogs?tab=approvals&subTab=quality`
- **Screen Owner**: `catalogs.screen.tsx`
- **Primary Action**: Approve catalog quality
- **Secondary Actions**: Edit catalog metadata, reject catalog
- **CTA List**: approve catalog quality button, reject catalog button
- **Navigation Target**: same page
- **Required States**: `loading`, `error`, `success`
- **Control Panel Entry**: `/catalogs?tab=approvals`
- **Auth/Permission**: Operator credentials required (deferred)
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Vars/Provider Dependency**: `DEFERRED_WITH_REASON`
- **Search Dependency**: Pending catalogs search
- **Notification Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **Account/Profile Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **API Candidate**: `POST /control-panel/catalogs/approvals/quality` (does not exist in Go backend)
- **Binding Status**: `DEFERRED_WITH_REASON`
- **Runtime Status**: `DEFERRED_WITH_REASON` (blocked by missing catalog-approval endpoint; actions operate on preview/local-state only)
- **Visual Evidence**: `VR-L2-008` (VISUAL_PASS)
- **Git Evidence**: Sweep recorded under `DSH_SLICE001_REALITY_SYNC-20260603`
- **Typecheck Evidence**: `pnpm -w exec tsc --noEmit` verified
- **Regression Evidence**: None
- **Decision**: `DEFERRED_WITH_REASON`

#### ROW-001-06: control-panel catalog pricing approval
- **Slice ID**: `DSH-SLICE-001`
- **Service**: DSH
- **Business Domain**: `dsh/client-discovery-and-visibility`
- **Actor**: operator
- **Surface**: `control-panel`
- **Route**: `/catalogs?tab=approvals&subTab=pricing`
- **Screen Owner**: `catalogs.screen.tsx`
- **Primary Action**: Approve catalog pricing
- **Secondary Actions**: Resolve pricing conflict, reject catalog
- **CTA List**: approve catalog pricing button, reject catalog button
- **Navigation Target**: same page
- **Required States**: `loading`, `error`, `success`
- **Control Panel Entry**: `/catalogs?tab=approvals`
- **Auth/Permission**: Operator credentials required (deferred)
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Vars/Provider Dependency**: `DEFERRED_WITH_REASON`
- **Search Dependency**: None
- **Notification Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **Account/Profile Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **API Candidate**: `POST /control-panel/catalogs/approvals/pricing` (does not exist in Go backend)
- **Binding Status**: `DEFERRED_WITH_REASON`
- **Runtime Status**: `DEFERRED_WITH_REASON` (blocked by missing catalog-approval endpoint; actions operate on preview/local-state only)
- **Visual Evidence**: `VR-L2-009` (VISUAL_PASS)
- **Git Evidence**: Sweep recorded under `DSH_SLICE001_REALITY_SYNC-20260603`
- **Typecheck Evidence**: `pnpm -w exec tsc --noEmit` verified
- **Regression Evidence**: None
- **Decision**: `DEFERRED_WITH_REASON`

#### ROW-001-07: control-panel marketing visibility gates
- **Slice ID**: `DSH-SLICE-001`
- **Service**: DSH
- **Business Domain**: `dsh/client-discovery-and-visibility`
- **Actor**: operator
- **Surface**: `control-panel`
- **Route**: `/marketing?workspace=visibility`
- **Screen Owner**: `VisibilityCommandDeckScreen.tsx`
- **Primary Action**: Set marketing visibility gates
- **Secondary Actions**: Toggle eligibility gateways
- **CTA List**: toggle eligibility switch, save visibility policies
- **Navigation Target**: same page
- **Required States**: `loading`, `error`, `success`
- **Control Panel Entry**: `/marketing`
- **Auth/Permission**: Operator credentials required (deferred)
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON`
- **Vars/Provider Dependency**: `DEFERRED_WITH_REASON`
- **Search Dependency**: Partner search
- **Notification Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **Account/Profile Dependency**: `NOT_APPLICABLE_WITH_REASON`
- **API Candidate**: `POST /control-panel/marketing/visibility` (does not exist in Go backend)
- **Binding Status**: `DEFERRED_WITH_REASON`
- **Runtime Status**: `DEFERRED_WITH_REASON` (blocked by missing marketing-visibility endpoint; actions operate on preview/local-state only)
- **Visual Evidence**: `VR-L2-012` (VISUAL_PASS)
- **Git Evidence**: Sweep recorded under `DSH_SLICE001_REALITY_SYNC-20260603`
- **Typecheck Evidence**: `pnpm -w exec tsc --noEmit` verified
- **Regression Evidence**: None
- **Decision**: `DEFERRED_WITH_REASON`

## CTA Matrix

| Surface | Screen / Route | CTA List | Navigation Target | Precondition | Decision / Status |
|---|---|---|---|---|---|
| `app-client` | `HomeScreen.tsx` (`dsh-home`) | Open store card | `dsh-store` | Store is marked ready, approved, and visible. | `PASS` |
| `app-client` | `HomeScreen.tsx` (`dsh-home:inline-search`) | Inline search query | same page inline feed | User inputs query. | `PASS` |
| `app-client` | `StoreScreen.tsx` (`dsh-store`) | View details | same page details | Store is selected. | `PASS` |
| `app-partner` | `InventoryCatalogScreen.tsx` (`dsh-partner-inventory`) | Update readiness switch | same page | Partner wants to toggle visibility. | `DEFERRED_WITH_REASON` |
| `control-panel` | `catalogs.screen.tsx` (`/catalogs?tab=approvals&subTab=quality`) | Approve quality | same page | Quality tab contains pending items. | `DEFERRED_WITH_REASON` |
| `control-panel` | `catalogs.screen.tsx` (`/catalogs?tab=approvals&subTab=pricing`) | Approve pricing | same page | Pricing tab contains pricing conflicts. | `DEFERRED_WITH_REASON` |
| `control-panel` | `VisibilityCommandDeckScreen.tsx` (`/marketing?workspace=visibility`) | Toggle visibility gateway | same page | Operator changes visibility policies. | `DEFERRED_WITH_REASON` |

## State Matrix

| Surface | Screen / Route | Required States | Visual Evidence ID | State Verification status |
|---|---|---|---|---|
| `app-client` | `HomeScreen.tsx` (`dsh-home`) | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-001` | **VISUAL_PASS**: verified visually in RTL layout |
| `app-client` | `HomeScreen.tsx` (`dsh-home:inline-search`) | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-023` | **VISUAL_PASS**: verified visually in RTL layout |
| `app-client` | `StoreScreen.tsx` (`dsh-store`) | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-005` | **VISUAL_PASS**: verified visually in RTL layout |
| `app-partner` | `InventoryCatalogScreen.tsx` (`dsh-partner-inventory`) | `loading`, `empty`, `error`, `success`, `offline` | `VR-L1-009` | **VISUAL_PASS**: verified visually in RTL layout |
| `control-panel` | `catalogs.screen.tsx` (`/catalogs?tab=approvals&subTab=quality`) | `loading`, `error`, `success` | `VR-L2-008` | **VISUAL_PASS**: verified visually in CP approvals |
| `control-panel` | `catalogs.screen.tsx` (`/catalogs?tab=approvals&subTab=pricing`) | `loading`, `error`, `success` | `VR-L2-009` | **VISUAL_PASS**: verified visually in CP pricing approvals |
| `control-panel` | `VisibilityCommandDeckScreen.tsx` (`/marketing?workspace=visibility`) | `loading`, `error`, `success` | `VR-L2-012` | **VISUAL_PASS**: verified visually in CP marketing hub |

## Cross-Surface Impact
- **WLT Boundary**: `NOT_APPLICABLE_WITH_REASON`. Store discovery processes occur entirely before checkout intent or payment transactions. There are no wallet balance checks, refund commands, or transaction creations in this slice.
- **Auth/Permission**: Discovery is public and guest-safe for the client. Operator and partner actions will require proper authentication scopes, which are currently deferred to runtime integration.
- **Vars/Provider Policy**: Visibility gates and platform serviceability constraints are controlled by provider policies, which must remain dynamically manageable at runtime.
- **Notification Impact**: No push notifications or messaging are triggered by discovery actions.
- **Account/Profile**: No profile creation or modification is required.
- **Data Handoff**: The primary handoff risk is catalog synchronization. A partner toggling readiness or an operator approving catalog details does not yet propagate to the Go PostgreSQL database, meaning changes do not dynamically update the client's GET /stores feed.

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

## Missing Logic/Screen/Process Proposals

| Proposal ID | Gap Type | Related Surface | Description | Required Addition | Blocker Reason | Target Phase | Status |
|---|---|---|---|---|---|---|---|
| GAP-001 | API / Runtime | `app-partner` | Partner catalog readiness API endpoint does not exist. Toggle readiness actions only mutate local UI preview state. | Create readiness PUT endpoint in Go backend and wire it to app-partner screen. | Blocked by missing backend API route. | Phase 4/5 | `BLOCKED_WITH_REASON` |
| GAP-002 | API / Runtime | `control-panel` | Catalog quality/pricing approval API endpoints do not exist. Approve/reject actions only mutate local CP preview state. | Create approval POST endpoints in Go backend and wire them to CP screen. | Blocked by missing backend API route. | Phase 4/5 | `BLOCKED_WITH_REASON` |
| GAP-003 | API / Runtime | `control-panel` | Marketing visibility publish control API endpoint does not exist. Visibility toggles do not write to shared database model. | Create marketing visibility POST endpoint in Go backend and wire it to CP Visibility command deck. | Blocked by missing backend API route. | Phase 4/5 | `BLOCKED_WITH_REASON` |

## Decision
- **Visual Evidence Status**: `UI_UX_VISUAL_LOCKED` (ثبت / Complete visual confirmation for all 7 routes)
- **Runtime/API/L7 Status**: `DEFERRED_WITH_REASON`
- **Final Slice Decision**: `DSH_SLICE001_UI_UX_VISUAL_LOCKED_RUNTIME_DEFERRED` (Not CLOSED, not PASS).
- **Core Remaining Blockers**:
  1. **Partner catalog/readiness endpoint** is unimplemented.
  2. **Catalog approval endpoint** is unimplemented.
  3. **Marketing visibility endpoint** is unimplemented.
- **Next Action**:
  Prepare subsequent runtime/API slice to implement the three missing backend endpoints, or transition to `DSH-SLICE-002` only after accepting that these blockers are explicitly deferred.

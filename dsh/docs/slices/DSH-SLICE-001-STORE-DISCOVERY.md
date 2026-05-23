# DSH-SLICE-001 Store Discovery

Status: ACTIVE_SLICE_MANIFEST
Decision: FIX_REQUIRED

Purpose:
Official coverage manifest for the first DSH slice: client discovery and storefront visibility across `HomeScreen`, `SearchScreen`, and `StoreScreen`.

## Identity

| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-001` |
| Service | `dsh` |
| Business Domain | `client-discovery` |
| Goal | Client can discover available stores, search, and open store details after the shared visibility gate allows exposure. |
| Primary Actor | `client` |
| Primary Surface | `app-client` |
| Primary Route Family | `dsh-home`; `dsh-search`; `dsh-store` |
| Live Flow Anchor | `client-discovery-closure` in `dsh/frontend/shared/dsh-flow-registry.ts` |
| UI Matrix Anchor | `client-discovery` row in `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` |
| API Matrix Anchor | `DSH-SAPI-P014-01` in `dsh/docs/SCREEN_API_MATRIX.md` |
| Runtime Matrix Anchor | `DSH-RUN-P014-01` in `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` |

## Scope

| Boundary | Decision | Reason |
|---|---|---|
| Included primary screens | `PASS` | `HomeScreen.tsx`, `SearchScreen.tsx`, and `StoreScreen.tsx` are the discovery/storefront owners in current registries. |
| Included primary routes | `PASS` | `dsh-home`, `dsh-search`, and `dsh-store` are registered in `dsh/frontend/app-client/dsh-client.routes.ts`. |
| Included dependency surfaces | `DEFERRED_WITH_REASON` | Partner catalog and control-panel catalog/marketing are dependencies to prove visibility, not primary slice owners. |
| Checkout intent | `NOT_APPLICABLE_WITH_REASON` | Checkout starts after discovery/store opening and belongs to a later cart/checkout slice. |
| WLT payment semantics | `NOT_APPLICABLE_WITH_REASON` | No WLT ownership in discovery; WLT starts after checkout intent/payment decisions. |
| Tracking/support | `NOT_APPLICABLE_WITH_REASON` | Tracking and support belong to order lifecycle slices. |
| Captain/field operations | `NOT_APPLICABLE_WITH_REASON` | No captain or field operational action is part of this discovery slice. |
| Finance mutation | `NOT_APPLICABLE_WITH_REASON` | DSH must not mutate wallet, ledger, settlement, refund, or fee truth. |

## Coverage Matrix

| Slice ID | Service | Business Domain | Actor | Surface | Route | Screen Owner | Primary Action | Secondary Actions | CTA List | Navigation Target | Required States | Control Panel Entry | Auth/Permission | WLT Boundary | Vars/Provider Dependency | Search Dependency | Notification Dependency | Account/Profile Dependency | API Candidate | Binding Status | Runtime Status | Visual Evidence | Git Evidence | Typecheck Evidence | Regression Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DSH-SLICE-001` | `dsh` | `client-discovery` | `client` | `app-client` | `dsh-home` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | Open discovery feed and available store/card entry. | filter by destination/category; open store; continue to search. | discovery store card; category entry; search entry | `dsh-search`; `dsh-store` | `loading`; `empty`; `error`; `success`; `offline` | dependency: control-panel marketing/catalog visibility only | public/guest-safe until API design proves auth need | no WLT ownership in discovery | shared visibility/serviceability policy must remain provider-controlled when runtime exists | depends on `dsh-search` route | no notification dependency in this slice | no account/profile dependency in this slice | candidate from `DSH-SAPI-P014-01`; no OpenAPI edit yet | `DEFERRED_WITH_REASON`: UI preview only until contract and typed client exist | `DEFERRED_WITH_REASON`: runtime source proof missing | `FIX_REQUIRED`: `VR-L1-001` still needs screenshot | `DEFERRED_WITH_REASON`: docs-only manifest; next evidence run must capture git state | `DEFERRED_WITH_REASON`: docs-only change does not require workspace typecheck | `DEFERRED_WITH_REASON`: regression proof after visual evidence | `FIX_REQUIRED` |
| `DSH-SLICE-001` | `dsh` | `client-discovery` | `client` | `app-client` | `dsh-search` | `dsh/frontend/app-client/screens/SearchScreen.tsx` | Search for a store/category from discovery. | refine query; open result; return to discovery. | search query; result row/card | `dsh-store`; `dsh-home` | `loading`; `empty`; `error`; `success`; `offline` | dependency: control-panel marketing/catalog visibility only | public/guest-safe until API design proves auth need | no WLT ownership in discovery | shared visibility/serviceability policy must remain provider-controlled when runtime exists | owned inside this slice through `dsh-search` | no notification dependency in this slice | no account/profile dependency in this slice | candidate from `DSH-SAPI-P014-01`; no OpenAPI edit yet | `DEFERRED_WITH_REASON`: UI preview only until contract and typed client exist | `DEFERRED_WITH_REASON`: runtime source proof missing | `FIX_REQUIRED`: `VR-L1-023` still needs screenshot | `DEFERRED_WITH_REASON`: docs-only manifest; next evidence run must capture git state | `DEFERRED_WITH_REASON`: docs-only change does not require workspace typecheck | `DEFERRED_WITH_REASON`: regression proof after visual evidence | `FIX_REQUIRED` |
| `DSH-SLICE-001` | `dsh` | `client-discovery` | `client` | `app-client` | `dsh-store` | `dsh/frontend/app-client/screens/StoreScreen.tsx` | Open store details after visibility gate allows exposure. | inspect serviceability; inspect catalog sections; continue toward cart later. | open store; open product/category section | later cart route is out of this slice | `loading`; `empty`; `error`; `success`; `offline` | dependency: control-panel marketing/catalog visibility only | public/guest-safe until API design proves auth need | no WLT ownership in discovery | shared visibility/serviceability policy must remain provider-controlled when runtime exists | depends on discovery/search entry | no notification dependency in this slice | no account/profile dependency in this slice | candidate from `DSH-SAPI-P014-01`; no OpenAPI edit yet | `DEFERRED_WITH_REASON`: UI preview only until contract and typed client exist | `DEFERRED_WITH_REASON`: runtime source proof missing | `FIX_REQUIRED`: `VR-L1-005` still needs screenshot | `DEFERRED_WITH_REASON`: docs-only manifest; next evidence run must capture git state | `DEFERRED_WITH_REASON`: docs-only change does not require workspace typecheck | `DEFERRED_WITH_REASON`: regression proof after visual evidence | `FIX_REQUIRED` |

## CTA Matrix

| CTA | Source Screen | Target | Preconditions | Owner Classification | Decision |
|---|---|---|---|---|---|
| Open search | `HomeScreen.tsx` | `dsh-search` | Discovery surface renders and search entry is visible. | primary slice CTA | `FIX_REQUIRED`: visual proof missing |
| Open store | `HomeScreen.tsx` or `SearchScreen.tsx` | `dsh-store` | Store passes shared client-visibility and serviceability gate. | primary slice CTA | `FIX_REQUIRED`: visual proof missing |
| Open category/destination | `HomeScreen.tsx` | discovery-filtered store list | Category/destination exists in preview state. | primary slice CTA | `FIX_REQUIRED`: visual proof missing |
| Continue beyond store | `StoreScreen.tsx` | later cart/checkout slice | User selects items and moves toward cart. | out of slice | `NOT_APPLICABLE_WITH_REASON`: cart/checkout is excluded from Slice 001 |

## State Matrix

| Screen Group | Required States | Visual Review IDs | Runtime Proof | Decision |
|---|---|---|---|---|
| `HomeScreen.tsx` | `loading`; `empty`; `error`; `success`; `offline` | `VR-L1-001` | `DSH-RUN-P014-01` says preview/local-state runtime proof is missing. | `FIX_REQUIRED` |
| `SearchScreen.tsx` | `loading`; `empty`; `error`; `success`; `offline` | `VR-L1-023` | `DSH-RUN-P014-01` says preview/local-state runtime proof is missing. | `FIX_REQUIRED` |
| `StoreScreen.tsx` | `loading`; `empty`; `error`; `success`; `offline` | `VR-L1-005` | `DSH-RUN-P014-01` says preview/local-state runtime proof is missing. | `FIX_REQUIRED` |

## Cross-Surface Impact

| Surface/System | Role In Slice | Owner Classification | Required Proof | Decision |
|---|---|---|---|---|
| `app-partner inventory readiness` | Dependency for client-visible catalog/store exposure. | dependency, not primary slice boundary | `partner.dsh.inventory.catalog` and publishing gate visual proof in a later or linked slice. | `DEFERRED_WITH_REASON` |
| `control-panel catalogs governance` | Dependency for catalog approval and visibility governance. | dependency, not primary slice boundary | catalog governance visual proof when Slice 001 moves toward runtime/API. | `DEFERRED_WITH_REASON` |
| `control-panel marketing visibility` | Dependency for marketing publish controls and shared visibility contract. | dependency, not primary slice boundary | marketing/catalog visibility evidence before runtime claim. | `DEFERRED_WITH_REASON` |
| shared client visibility/serviceability gate | Required gate before store exposure to the client. | shared DSH logic dependency | source proof from `resolveDshStoreClientVisibility()` and serviceability/runtime proof. | `FIX_REQUIRED` |
| `WLT` | No ownership in this slice. | out of scope | none for discovery; WLT starts after checkout/payment. | `NOT_APPLICABLE_WITH_REASON` |
| `auth` | No protected API is designed yet. | deferred platform dependency | define only when API candidate becomes contract work. | `DEFERRED_WITH_REASON` |
| `notifications` | No notification entry is required for discovery. | out of scope | none. | `NOT_APPLICABLE_WITH_REASON` |
| `vars/provider` | Future provider-controlled serviceability and visibility policy. | deferred runtime dependency | runtime/provider proof when moving past preview. | `DEFERRED_WITH_REASON` |
| `account/profile` | No account/profile operation in discovery. | out of scope | none. | `NOT_APPLICABLE_WITH_REASON` |

## Evidence and Gates

| Gate | Requirement | Current Evidence | Decision |
|---|---|---|---|
| Gate 1 Git | status, diff, name-status, diff-check, untracked scan in evidence run | docs-only implementation must capture `git --no-pager diff --check`; full evidence run not created here | `DEFERRED_WITH_REASON` |
| Gate 2 TypeScript / Build | targeted type/build only when source or contracts change | no source change in this manifest step | `NOT_APPLICABLE_WITH_REASON` |
| Gate 3 Architecture | Tamagui/ui-kit/service/binding guards when architecture is touched | no architecture/source change in this manifest step | `NOT_APPLICABLE_WITH_REASON` |
| Gate 4 Security | secret scan before runtime/API work | no secrets/runtime/API added here | `NOT_APPLICABLE_WITH_REASON` |
| Gate 5 Visual / RTL | screenshots, RTL, overflow, color-system proof | `VR-L1-001`, `VR-L1-023`, and `VR-L1-005` require screenshots | `FIX_REQUIRED` |
| Gate 6 OpenAPI | operationId, schemas, security, validation | `DSH-SAPI-P014-01` is candidate only; `dsh.openapi.yaml` must not be edited yet | `DEFERRED_WITH_REASON` |
| Gate 7 Runtime | request/response/log/screen-state proof | `DSH-RUN-P014-01` says runtime proof is missing | `FIX_REQUIRED` |
| Gate 8 Cross-Surface | client, partner, control-panel, WLT/Auth/Search/Vars impact | dependencies are classified in this manifest | `DEFERRED_WITH_REASON` |
| Gate 9 Regression | previous journey recheck after shared/contract/navigation/state changes | no shared/source change in this manifest step | `NOT_APPLICABLE_WITH_REASON` |
| Gate 10 Evidence Lock | evidence pack and decision record | no evidence pack created by this docs-only manifest seed | `DEFERRED_WITH_REASON` |

## Decision

Current slice decision: `FIX_REQUIRED`.

Explicit blockers:

- visual screenshots are missing for `HomeScreen`, `SearchScreen`, and `StoreScreen`,
- runtime source proof is missing for `DSH-RUN-P014-01`,
- `DSH-SAPI-P014-01` remains a candidate and does not justify editing `dsh/dsh.openapi.yaml`,
- partner catalog and control-panel catalog/marketing dependencies are classified but not visually proven.

Next allowed work:

Capture Slice 001 visual evidence for `VR-L1-001`, `VR-L1-023`, and `VR-L1-005`, then update this manifest and `dsh/docs/DSH_VISUAL_REVIEW.md` with real screenshot paths before any OpenAPI, binding, or runtime work.

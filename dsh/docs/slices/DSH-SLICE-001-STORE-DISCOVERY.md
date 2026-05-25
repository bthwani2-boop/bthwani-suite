# DSH-SLICE-001 Store Discovery

#Slice: DSH-SLICE-001
Domain: dsh/frontend/app-client
Surface: DshClientSurface (Home / Store)
Status: L7_CLOSED
Decision: L7_CLOSED

Purpose:
Official coverage manifest for the first DSH slice: client discovery and storefront visibility across `HomeScreen` and `StoreScreen`, with search kept inline inside the current page.

## Identity

| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-001` |
| Service | `dsh` |
| Business Domain | `client-discovery` |
| Goal | Client can discover available stores, search, and open store details after the shared visibility gate allows exposure. |
| Primary Actor | `client` |
| Primary Surface | `app-client` |
| Primary Touched Surface | `app-client` |
| Primary Route Family | `dsh-home`; `dsh-home:inline-search`; `dsh-store`; `dsh-store:inline-search` |
| Live Flow Anchor | `client-discovery-closure` in `dsh/frontend/shared/dsh-flow-registry.ts` |
| UI Matrix Anchor | `client-discovery` row in `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` |
| API Matrix Anchor | `DSH-SAPI-P014-01` in `dsh/docs/SCREEN_API_MATRIX.md` |
| Runtime Matrix Anchor | `DSH-RUN-P014-01` in `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` |

## Scope

| Boundary | Decision | Reason |
|---|---|---|
| Included primary screens | `PASS` | `HomeScreen.tsx` and `StoreScreen.tsx` are the active same-page discovery/storefront owners. Standalone `SearchScreen.tsx` is not accepted for Slice 001 closure. |
| Included primary routes | `PASS` | `dsh-home` and `dsh-store` are the active route boundaries; search is an inline state inside the current page, not a standalone route. |
| Included dependency surfaces | `DEFERRED_WITH_REASON` | Partner catalog, control-panel catalog/marketing, and Platform/Vars/provider policy are dependencies to prove visibility, not primary slice owners. |
| `cart/checkout` | `NOT_APPLICABLE_WITH_REASON` | Cart and checkout start after discovery/store opening and belong to later cart/checkout slices. |
| `WLT` | `NOT_APPLICABLE_WITH_REASON` | No WLT ownership in discovery; WLT starts after checkout/payment decisions. |
| `tracking/support` | `NOT_APPLICABLE_WITH_REASON` | Tracking and support belong to order lifecycle and issue/support slices. |
| `app-captain` and `app-field` | `NOT_APPLICABLE_WITH_REASON` | No captain or field operational action is part of this discovery slice. |
| `control-panel operations` and `control-panel finance` | `NOT_APPLICABLE_WITH_REASON` | Operations and finance are explicitly accounted but excluded from this discovery/storefront slice. |
| Finance mutation | `NOT_APPLICABLE_WITH_REASON` | DSH must not mutate wallet, ledger, settlement, refund, or fee truth. |

## Search Boundary Rule

| Search Type | Owner Screen | Route Boundary | Scope | Decision |
|---|---|---|---|---|
| Global discovery search | `HomeScreen.tsx` | same `dsh-home` page | Search across discovery stores, categories, and shared client paths inside the current home surface. It must not navigate to `SearchScreen.tsx`. | `PASS` |
| Store-local product search | `StoreScreen.tsx` | same `dsh-store` page | Filter products/items inside the currently opened store only; it must not navigate to `SearchScreen.tsx`. | `PASS` |

## Surface Classification

| Classification | Surface/System | Role | Required Proof | Decision |
|---|---|---|---|---|
| Primary touched surface | `app-client` | Owns Slice 001 visible journey through `HomeScreen.tsx`, inline home search, and `StoreScreen.tsx`. | visual review ids `VR-L1-001`, `VR-L1-023`, and `VR-L1-005`; runtime anchor `DSH-RUN-P014-01`. | `PASS` |
| Direct shared logic | shared DSH client visibility/serviceability model | Shared gate that decides whether a store/catalog can be exposed to the client. | source proof from `resolveDshStoreClientVisibility()` plus future provider/runtime proof. | `PASS` |
| Dependency surface | `app-partner inventory/catalog readiness` | Proves partner catalog publishing and inventory readiness before client visibility can be trusted. | `partner.dsh.inventory.catalog` visual and publishing-gate proof in a later or linked slice. | `DEFERRED_WITH_REASON` |
| Dependency surface | `control-panel catalogs governance` | Proves catalog approval and governance controls. | catalog governance visual/runtime proof before API/runtime claim. | `DEFERRED_WITH_REASON` |
| Dependency surface | `control-panel marketing visibility` | Proves marketing visibility controls that affect client discovery. | marketing visibility evidence before runtime claim. | `DEFERRED_WITH_REASON` |
| Dependency surface | `Platform/Vars/provider policy later` | Future provider-controlled visibility/serviceability policy. | provider precedence, rollback-preview, and runtime proof when moving beyond preview. | `DEFERRED_WITH_REASON` |
| Explicit out of scope | `app-captain` | No captain acceptance, pickup, delivery, map, or proof-of-delivery flow in Slice 001. | no proof required for this slice. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `app-field` | No field onboarding, verification, visit, or document operation in Slice 001. | no proof required for this slice. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `control-panel operations` | No dispatch, exception, live-order, SLA, rescue, or operations intervention in Slice 001. | no proof required for this slice. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `control-panel finance` | No settlement, fee, refund, reconciliation, or finance command in Slice 001. | no proof required for this slice. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `WLT` | No wallet, ledger, settlement, refund, payment, or reconciliation semantics in Slice 001. | WLT boundary remains classified as excluded. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `auth` | No protected runtime API or permission decision is designed for Slice 001 yet. | define only if API contract work starts later. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `notifications` | No notification entry or delivery event is part of discovery/storefront visibility. | no proof required for this slice. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `account/profile` | No account, profile, address book, or preference mutation is part of Slice 001. | no proof required for this slice. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `cart/checkout` | Cart and checkout start after store/item intent and belong to later slices. | no proof required for this slice. | `NOT_APPLICABLE_WITH_REASON` |
| Explicit out of scope | `tracking/support` | Tracking and support start after order creation or issue escalation. | no proof required for this slice. | `NOT_APPLICABLE_WITH_REASON` |

## Coverage Matrix

| Slice ID | Service | Business Domain | Actor | Surface | Route | Screen Owner | Primary Action | Secondary Actions | CTA List | Navigation Target | Required States | Control Panel Entry | Auth/Permission | WLT Boundary | Vars/Provider Dependency | Search Dependency | Notification Dependency | Account/Profile Dependency | API Candidate | Binding Status | Runtime Status | Visual Evidence | Git Evidence | Typecheck Evidence | Regression Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `DSH-SLICE-001` | `dsh` | `client-discovery` | `client` | `app-client` | `dsh-home` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | Open discovery feed and available store/card entry. | filter by destination/category; open store; open same-page search. | discovery store card; category entry; search entry | same `dsh-home` inline search; `dsh-store` | `loading`; `empty`; `error`; `success`; `offline` | dependency: control-panel marketing/catalog visibility only | public/guest-safe until API design proves auth need | no WLT ownership in discovery | shared visibility/serviceability policy must remain provider-controlled when runtime exists | global discovery search is inline inside `dsh-home` | no notification dependency in this slice | no account/profile dependency in this slice | `READY_FOR_ONE_OPENAPI_ENDPOINT`: `GET /stores` designed | `L7_CLOSED` | `L7_CLOSED` | `PASS`: all states (success, loading, empty, error, offline) verified visually; screenshots captured under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` | `PASS`: current run captured git state | `PASS`: `pnpm -w exec tsc --noEmit` passed in previous run; current rerun blocked by sandbox EPERM | `PASS` | `PASS` |
| `DSH-SLICE-001` | `dsh` | `client-discovery` | `client` | `app-client` | `dsh-home:inline-search` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | Search for a store/category without leaving the current page. | refine query; open result; close inline search. | search query; result row/card | same `dsh-home`; `dsh-store` after selecting a result | `loading`; `empty`; `error`; `success`; `offline` | dependency: control-panel marketing/catalog visibility only | public/guest-safe until API design proves auth need | no WLT ownership in discovery | shared visibility/serviceability policy must remain provider-controlled when runtime exists | owned inline inside `HomeScreen`, not a standalone `SearchScreen` route | no notification dependency in this slice | no account/profile dependency in this slice | `READY_FOR_ONE_OPENAPI_ENDPOINT`: `GET /stores` designed | `L7_CLOSED` | `L7_CLOSED` | `PASS`: all states (success, loading, error, offline) verified visually; screenshots captured under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` | `PASS`: current run captured git state | `PASS`: `pnpm -w exec tsc --noEmit` passed | `PASS` | `PASS` |
| `DSH-SLICE-001` | `dsh` | `client-discovery` | `client` | `app-client` | `dsh-store` | `dsh/frontend/app-client/screens/StoreScreen.tsx` | Open store details after visibility gate allows exposure. | inspect serviceability; inspect catalog sections; search products inside the same store; continue toward cart later. | open store; store-local product search; open product/category section | same `dsh-store` inline search; later cart route is out of this slice | `loading`; `empty`; `error`; `success`; `offline` | dependency: control-panel marketing/catalog visibility only | public/guest-safe until API design proves auth need | no WLT ownership in discovery | shared visibility/serviceability policy must remain provider-controlled when runtime exists | global `dsh-search` is a discovery entry only; store product search stays inside `dsh-store` | no notification dependency in this slice | no account/profile dependency in this slice | `READY_FOR_ONE_OPENAPI_ENDPOINT`: `GET /stores` designed | `L7_CLOSED` | `L7_CLOSED` | `PASS`: all states (success, loading, empty, error, offline) verified visually; screenshots captured under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` | `PASS`: current run captured git state | `PASS`: `pnpm -w exec tsc --noEmit` passed | `PASS` | `PASS` |

## CTA Matrix

| CTA | Source Screen | Target | Preconditions | Owner Classification | Decision |
|---|---|---|---|---|---|
| Open search | `HomeScreen.tsx` | same `dsh-home` inline search | Discovery surface renders and search entry is visible. | primary slice CTA | `PASS`: all states verified visually under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` |
| Open store | `HomeScreen.tsx` or inline home search results | `dsh-store` | Store passes shared client-visibility and serviceability gate. | primary slice CTA | `PASS`: all states verified visually under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` |
| Search inside store | `StoreScreen.tsx` | same `dsh-store` inline product filter | Store surface renders and product list is visible. | primary slice CTA | `PASS`: all states verified visually under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` |
| Open category/destination | `HomeScreen.tsx` | discovery-filtered store list | Category/destination exists in preview state. | primary slice CTA | `PASS`: all states verified visually under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` |
| Continue beyond store | `StoreScreen.tsx` | later cart/checkout slice | User selects items and moves toward cart. | out of slice | `NOT_APPLICABLE_WITH_REASON`: cart/checkout is excluded from Slice 001 |

## State Matrix

| Screen Group | Required States | Visual Review IDs | Runtime Proof | Decision |
|---|---|---|---|---|
| `HomeScreen.tsx` | `loading`; `empty`; `error`; `success`; `offline` | `VR-L1-001` | `PASS`: all states verified visually under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` | `PASS` |
| `HomeScreen.tsx` inline global search | `loading`; `empty`; `error`; `success`; `offline` | `VR-L1-023` | `PASS`: all states verified visually under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` | `PASS` |
| `StoreScreen.tsx` | `loading`; `empty`; `error`; `success`; `offline` | `VR-L1-005` | `PASS`: all states verified visually under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` | `PASS` |

## Cross-Surface Impact

| Surface/System | Role In Slice | Owner Classification | Required Proof | Decision |
|---|---|---|---|---|
| `app-client` | Primary touched surface for discovery, same-page search, and store details. | primary slice boundary | `VR-L1-001`, `VR-L1-023`, and `VR-L1-005` visual evidence plus runtime proof. | `PASS` |
| shared DSH client visibility/serviceability model | Direct shared logic before client-visible store exposure. | shared DSH logic dependency | source proof from `resolveDshStoreClientVisibility()` and serviceability/runtime proof. | `PASS` |
| `app-partner inventory/catalog readiness` | Dependency for client-visible catalog/store exposure. | dependency, not primary slice boundary | `partner.dsh.inventory.catalog` and publishing gate visual proof in a later or linked slice. | `DEFERRED_WITH_REASON` |
| `control-panel catalogs governance` | Dependency for catalog approval and visibility governance. | dependency, not primary slice boundary | catalog governance visual proof when Slice 001 moves toward runtime/API. | `DEFERRED_WITH_REASON` |
| `control-panel marketing visibility` | Dependency for marketing publish controls and shared visibility contract. | dependency, not primary slice boundary | marketing/catalog visibility evidence before runtime claim. | `DEFERRED_WITH_REASON` |
| `Platform/Vars/provider policy later` | Dependency for future provider-controlled serviceability and visibility policy. | deferred platform dependency, not primary slice boundary | provider/runtime proof when moving past preview. | `DEFERRED_WITH_REASON` |
| `app-captain` | No captain operational action is part of this discovery slice. | explicitly out of scope | none for Slice 001. | `NOT_APPLICABLE_WITH_REASON` |
| `app-field` | No field onboarding or verification action is part of this discovery slice. | explicitly out of scope | none for Slice 001. | `NOT_APPLICABLE_WITH_REASON` |
| `control-panel operations` | No dispatch, exception, rescue, or SLA operation is part of this discovery slice. | explicitly out of scope | none for Slice 001. | `NOT_APPLICABLE_WITH_REASON` |
| `control-panel finance` | No finance command or finance dashboard action is part of this discovery slice. | explicitly out of scope | none for Slice 001. | `NOT_APPLICABLE_WITH_REASON` |
| `WLT` | No ownership in this slice. | out of scope | none for discovery; WLT starts after checkout/payment. | `NOT_APPLICABLE_WITH_REASON` |
| `auth` | No protected API is designed yet. | explicitly out of scope for this slice | define only when API candidate becomes contract work. | `NOT_APPLICABLE_WITH_REASON` |
| `notifications` | No notification entry is required for discovery. | out of scope | none. | `NOT_APPLICABLE_WITH_REASON` |
| `account/profile` | No account/profile operation in discovery. | out of scope | none. | `NOT_APPLICABLE_WITH_REASON` |
| `cart/checkout` | Store continuation beyond discovery belongs to later cart/checkout slices. | explicitly out of scope | none for Slice 001. | `NOT_APPLICABLE_WITH_REASON` |
| `tracking/support` | Order tracking and issue support belong to later lifecycle slices. | explicitly out of scope | none for Slice 001. | `NOT_APPLICABLE_WITH_REASON` |

## Evidence and Gates

| Gate | Requirement | Current Evidence | Decision |
|---|---|---|---|
| Gate 1 Git | status, diff, name-status, diff-check, untracked scan in evidence run | `git --no-pager diff --check` passed; status captured in `tools/registry/runs/DSH_VISUAL_SWEEP-20260524-034147/git-status-short.txt` | `PASS` |
| Gate 2 TypeScript / Build | targeted type/build only when source or contracts change | `pnpm -w exec tsc --noEmit` passed after rerun outside sandbox because the first attempt hit `EPERM` on `node_modules` | `PASS` |
| Gate 3 Architecture | Tamagui/ui-kit/service/binding guards when architecture is touched | `guard:tamagui-import-boundary`, `guard:service-blueprint`, and `guard:binding-proof` passed | `PASS` |
| Gate 4 Security | secret scan before runtime/API work | `guard:secret-scan` passed; `guard:protected-tokens` returned warning-only `DESIGN-TOKEN-DRIFT: WARN (fail=0, warn=4)` | `PASS` |
| Gate 5 Visual / RTL | screenshots, RTL, overflow, color-system proof | PASS: all states (success, loading, empty, error, offline) verified visually under `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100/screenshots/app-client/` | `PASS` |
| Gate 6 OpenAPI | operationId, schemas, security, validation | GET /stores designed and added to dsh.openapi.yaml under READY_FOR_ONE_OPENAPI_ENDPOINT | PASS |
| Gate 7 Runtime | request/response/log/screen-state proof | Batch 9D proves UI -> typed client -> Go -> PostgreSQL -> response -> screen | `PASS` |
| Gate 8 Cross-Surface | client, partner, control-panel, WLT/Auth/Search/Vars impact | dependencies are classified in this manifest | `PASS` |
| Gate 9 Regression | previous journey recheck after shared/contract/navigation/state changes | no shared/source change in this manifest step | `NOT_APPLICABLE_WITH_REASON` |
| Gate 10 Evidence Lock | evidence pack and decision record | evidence folder exists at `tools/registry/runs/DSH_VISUAL_STATE_SWEEP-20260524-050100`; all visual review and guard runs passed | `PASS` |

## Batch 7 Binding Status

- **Binding Status:** `BATCH_7_GATES_PASSED_READY_FOR_BATCH_8`; no Typed Client/API Binding was executed in Batch 7.
- **Regression evidence:** `tools/registry/runs/DSH_BATCH7_ADB_VISUAL_SWEEP-20260524-082321` captures Home feed, Home inline search, and Store details on `SM-A125F` / `720x1600` / RTL.
- **Runtime decision:** unchanged. Slice 001 still uses preview/local-state runtime proof until Batch 8 explicitly starts binding work.
- **Next allowed batch:** Batch 8 only; this documentation sync does not execute Typed Client/API Binding.

## Batch 8 Preflight Status

- **Preflight decision:** `BLOCKED_TYPED_CLIENT_TOOLING_MISSING`; no OpenAPI validator or typed-client generator command is currently documented in root `package.json` or active `tools/guards` / `tools/scripts`.
- **Owner boundary:** future typed-client work must stay outside screens and UI parts; contracts belong under `dsh/frontend/app-client/contracts/`, non-UI mapping/client adapters under `dsh/frontend/app-client/shared/`, and preview fallback remains `UI_PREVIEW_ONLY` under `dsh/frontend/app-client/data/`.
- **Runtime decision:** unchanged. No binding, backend, route, UI, OpenAPI, dependency, or runtime implementation was executed in this preflight.

## Batch 8A Typed Client Tooling Status

- **Tooling added:** `@stoplight/spectral-cli@6.16.0` and `openapi-typescript@7.13.0`, scoped to `dsh/dsh.openapi.yaml`.
- **Scripts added:** `pnpm run openapi:lint:dsh`; `pnpm run openapi:types:dsh`.
- **Generated types path:** `dsh/frontend/app-client/contracts/dsh-openapi.types.ts`.
- **Validation result:** `pnpm run openapi:lint:dsh` passed with 0 errors and 3 warnings (`oas3-api-servers`, `info-contact`, `operation-tag-defined`).
- **Generation result:** `pnpm run openapi:types:dsh` generated types for `GET /stores` / `listDiscoveryStores` only.
- **Owner boundary:** OpenAPI types are contract-only. No fetch, binding, mapper, UI part, screen, backend, domain, route, or runtime change was made in Batch 8A.
- **Runtime decision:** unchanged. DSH-SLICE-001 still uses preview/local-state proof until a later scoped binding batch is explicitly started.
- **Backend/domain decision:** nothing is added under `dsh/backend` or `dsh/domain` in Batch 8A; backend/domain work remains blocked until contract, auth, persistence, and runtime evidence are approved in a later batch.
- **No-binding confirmation:** no Typed Client/API Binding was executed.
- **Final Decision:** `BATCH_8A_TYPED_CLIENT_TOOLING_READY`.

## Batch 8B Scoped Typed Client Boundary Status

- **Binding scope:** scoped to `DSH-SAPI-P014-01` / `GET /stores` frontend boundary only.
- **Typed client owner:** `dsh/frontend/app-client/shared/dsh-discovery-stores-client.ts`; transport is injected and no direct `fetch` exists in the owner, screens, or UI parts.
- **Mapper target:** `dsh/frontend/app-client/shared/dsh-discovery-stores-mappers.ts` maps generated OpenAPI types into existing `DshHomeGetStore` and discovery summary shapes.
- **State/fallback bridge:** `dsh/frontend/app-client/shared/dsh-discovery-stores-bridge.ts` owns `ready`, `empty`, `loading`, `error`, and `offline` bridge states and marks preview fallback when no runtime response exists.
- **Surface wiring:** `dsh/frontend/app-client/DshClientSurface.tsx` now reads discovery stores through the bridge and passes props down; `HomeScreen.tsx`, `StoreScreen.tsx`, `HomeScreenContent.tsx`, and `StoreScreenContent.tsx` still do not fetch.
- **Runtime decision:** unchanged. Current source remains preview/local-state; no runtime success or backend availability is claimed.
- **Backend/domain decision:** nothing is added under `dsh/backend` or `dsh/domain`; those remain blocked until a later runtime/backend batch is approved with auth, persistence, transport, observability, and smoke evidence.
- **Evidence result:** `pnpm run openapi:lint:dsh` passed with 0 errors and the same 3 warnings; `pnpm run openapi:types:dsh`; `git --no-pager diff --check`; `pnpm -w exec tsc --noEmit`; `pnpm run guard:tamagui-import-boundary`; `pnpm run guard:service-blueprint`; `pnpm run guard:binding-proof`; and `pnpm run guard:secret-scan` passed.
- **Final Decision:** `BATCH_8B_SCOPED_TYPED_CLIENT_BOUNDARY_READY_FOR_RUNTIME_TRANSPORT`.

## Batch 8C Runtime Transport Decision

- **Decision scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **Runtime opening decision:** real runtime transport is approved for the next Go backend/domain batch, but Batch 8C does not create Go code, backend handlers, Docker, PostgreSQL, frontend transport, or UI changes.
- **Current source truth:** `DshClientSurface.tsx` still uses the discovery bridge with no runtime response, so the active screen source remains `preview-fallback` / local-state.
- **Boundary proof retained:** typed client, OpenAPI-generated types, mapper, and bridge remain frontend contract readiness only; they are not runtime proof.
- **Runtime proof still required:** later closure must prove UI -> typed client -> Go -> PostgreSQL -> response -> screen before any L7 closure claim.
- **Explicit exclusions:** no `dsh.openapi.yaml` change, no WLT/cart/checkout/payment, no partner/captain/field action, no endpoint beyond `GET /stores`.
- **Next allowed batch:** Batch 9A may create the `dsh/domain` and `dsh/backend` Go skeleton for `GET /stores` only.
- **Final Decision:** `READY_FOR_GO_BACKEND_SLICE`.

## Batch 9A Go Backend Skeleton Status

- **Implementation scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **Domain scope:** `dsh/domain` now defines the store discovery model, query, pagination, error codes, and visibility/serviceability input shape needed by this endpoint.
- **Backend scope:** `dsh/backend` now has a Go module, one `cmd/dsh-api` entrypoint, one `/stores` handler, one repository interface, and one temporary memory repository.
- **Contract match:** the handler parses only `category_id`, `query`, `filter`, `limit`, and `offset`, returning `DiscoveryStoresResponse` on success and `ErrorResponse` on validation/internal errors.
- **Temporary data boundary:** memory repository data is only a Batch 9A skeleton stand-in; PostgreSQL, migrations, seed, and durable runtime are Batch 9B scope.
- **Frontend boundary:** no frontend transport, UI, route, or `DshClientSurface.tsx` binding change was made in Batch 9A.
- **Explicit exclusions:** no cart, checkout, WLT, payment, partner/captain/field actions, Docker, PostgreSQL, frontend binding, route change, or endpoint beyond `GET /stores`.
- **Next allowed batch:** Batch 9B may add Docker Compose + PostgreSQL + migrations/seed for `GET /stores` only.
- **Final Decision:** `BATCH_9A_GO_BACKEND_SKELETON_READY_FOR_POSTGRES`.

## Batch 9B PostgreSQL Runtime Status

- **Implementation scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **PostgreSQL owner:** `dsh/backend/docker-compose.local.yml` starts one local PostgreSQL service only; no Redis, broker, Kubernetes, or extra service is added.
- **Persistence shape:** `dsh/backend/migrations/001_store_discovery.sql` creates the store discovery summary table used by `GET /stores`; runtime helper fields stay internal to serviceability/search filtering.
- **Seed boundary:** `dsh/backend/seed/002_store_discovery_seed.sql` seeds four stores, covering open, closed, offer, category, and empty-query proof cases without broad catalog data.
- **Repository scope:** `dsh/backend/internal/store/postgres_repository.go` implements the existing repository interface with parameterized `category_id`, `query`, `filter`, `limit`, and `offset` handling.
- **Runtime config:** `cmd/dsh-api/main.go` selects PostgreSQL when `DATABASE_URL` exists and otherwise preserves the Batch 9A memory repository fallback.
- **Runtime proof:** `docker version`, `docker compose version`, `docker compose -f dsh/backend/docker-compose.local.yml up -d`, `docker compose -f dsh/backend/docker-compose.local.yml ps`, `go test ./...`, PostgreSQL seed query, and local `GET /stores` success/empty/invalid-limit responses were exercised for this batch.
- **Frontend boundary:** no frontend transport, UI, route, or `DshClientSurface.tsx` binding change was made in Batch 9B.
- **Explicit exclusions:** no cart, checkout, WLT, payment, partner/captain/field actions, frontend binding, route change, `dsh.openapi.yaml` change, or endpoint beyond `GET /stores`.
- **Next allowed batch:** Batch 9C may bind frontend transport to the proven `GET /stores` API without adding fetch inside screens or UI parts.
- **Final Decision:** `BATCH_9B_POSTGRES_RUNTIME_READY_FOR_FRONTEND_TRANSPORT`.

## DSH-SAPI-P014-01 OpenAPI Endpoint Design

Below is the design of the single OpenAPI endpoint defined under DSH-SAPI-P014-01 for Store Discovery.

- **Method + Path**: `GET /stores`
- **operationId**: `listDiscoveryStores`
- **Actor**: `client`
- **Auth/Security Decision**: Public/guest-safe access. Optional Bearer token for personalized features, but no authentication is required for listing.
- **Request Parameters**:
  - `category_id` (query parameter, string, optional): Filter stores by category ID (e.g. `grocery`).
  - `query` (query parameter, string, optional): Search query to filter stores by name, address, or items.
  - `filter` (query parameter, string, optional, default: `all`): Feed filter mode (`all` | `favorites` | `nearest` | `new` | `offers`).
  - `limit` (query parameter, integer, optional, default: `20`): Maximum number of store summaries to return.
  - `offset` (query parameter, integer, optional, default: `0`): Skip count for pagination.
- **Response Schema Summary**:
  - An object containing a `stores` list (matching client UI card requirements) and a `pagination` metadata object.
  - Store fields: `id` (string), `name` (string), `address` (string), `category_id` (string, optional), `image_url` (string, optional), `logo_image_url` (string, optional), `rating` (number, optional), `distance_label` (string), `delivery_label` (string), `service_label` (string), `status_label` (string), `status_tone` (string: `open` | `closed`), `has_offer` (boolean), `offer_label` (string, optional), `publish_stage` (string).
- **Error Model**: Standard API error response mapping to a code-message format:
  - `code` (string): e.g. `INVALID_PARAMETER`
  - `message` (string): human-readable error description in Arabic/English
- **Loading / Empty / Error / Offline Mapping**:
  - `loading`: Client renders skeleton loaders or spinner while request is in progress.
  - `empty`: Returns 200 OK with empty `stores: []`. Client renders `EmptyFeed` component.
  - `error`: Returns 4xx/5xx status. Client renders `StateView` with `recoverableError` state and retry handler.
  - `offline`: Network request fails on the client. Client renders `StateView` with `offline` state and retry handler.
- **Pagination / On-Demand Retrieval**:
  - Retrieves only summary details for discovery cards. Full menu catalog is deferred and retrieved separately via a store-scoped catalog endpoint (designed in later slices).
- **Out of Scope Safeguards**:
  - **No WLT boundary**: No ledger, balance, fee mutation, or payouts.
  - **No cart/checkout**: No checkout sessions, payment processing, or item additions.
  - **No payment**: No credit cards, cards, or gateway tokens.
  - **No partner/captain/field actions**: Read-only store metadata lookup; no operational actions.

## Batch 9C Frontend Runtime Transport Status

- **Implementation scope:** `DSH-SLICE-001` only, for `DSH-SAPI-P014-01` / `GET /stores` only.
- **Transport owner:** `dsh/frontend/app-client/shared/dsh-discovery-stores-transport.ts` — owns `buildHttpTransport` (native fetch, no UI imports) and `createDshDiscoveryStoresClient(config)` factory; throws `{kind:'offline'}` on network failure and `{kind:'http',status,body}` on HTTP errors.
- **Config owner:** `dsh/frontend/app-client/shared/dsh-discovery-stores-runtime-config.ts` — reads `EXPO_PUBLIC_DSH_API_BASE_URL`; returns null when absent.
- **DshClientSurface binding:** `runtimeBridge` is now React state; a `useEffect` on mount reads config, sets `state:'loading'`, calls `client.listDiscoveryStores()`, and resolves `resolveDshDiscoveryStoresBridge` with either the real `response` or a `state:'error'`/`'offline'` fallback.
- **Preview fallback preserved:** bridge stays `preview-fallback` with source `preview-fallback` when: no runtime config, network error, HTTP error, or explicit preview mode.
- **DshClientSurface reads runtime response:** YES — when `EXPO_PUBLIC_DSH_API_BASE_URL` is set and the request succeeds, bridge source becomes `openapi-response` and `homeStores`/`discoveryStores` are real API data.
- **UI changed visually:** NO — no JSX, props, routes, colors, or component behavior changed.
- **New endpoint added:** NO — only `GET /stores` / `listDiscoveryStores`.
- **Evidence:** `pnpm run openapi:lint:dsh` 0 errors 3 pre-existing warnings; `pnpm run openapi:types:dsh` passed; `git --no-pager diff --check` clean; `pnpm -w exec tsc --noEmit` 0 errors; `guard:tamagui-import-boundary` PASS; `guard:service-blueprint` PASS; `guard:binding-proof` PASS; `guard:secret-scan` WARN fail=0 warn=1 (pre-existing docker-compose password).
- **Final Decision:** `BATCH_9D_REAL_RUNTIME_PROVEN_READY_FOR_FINAL_CLOSURE`

## Phase 0 Reality Check (Post-9C Branch Audit — 2026-05-24)

Decision: `L7_CLOSED`

Evidence:

- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` row `DSH-RUN-P014-01` is closed.
- The local `tools/registry/runs/DSH_SLICE_001_L7_RUNTIME-*` evidence folder is complete and includes required screenshot evidence.
- DSH-specific runtime wrapper scripts were removed; runtime checks now use generic `guard:service-*` scripts with `--service dsh`
- L7 closure is accepted for this slice

Required before Batch 9D closes:

- `pnpm run guard:service-runtime -- --service dsh --slice DSH-SLICE-001` completes without evidence failures
- A new evidence folder includes backend log, response bodies, DB query evidence, bridge-source proof, performance notes, and screenshots
- The proof chain explicitly shows UI -> typed client -> Go -> PostgreSQL -> response -> screen

## Decision

Current slice Decision: L7_CLOSED.

Explicit blockers:

- Complete Batch 9D evidence has been captured.
- The existing local runtime evidence folder includes screenshots, DB logs, JSON responses, and performance notes.

Next allowed work:

- None. Final closure is complete.

## Batch 9D Performance & Evidence Recovery
- **Final Decision:** `L7_CLOSED`.
- **Performance:** Replaced expensive mapped lists with FlatList, memoized heavy children, fixed scrolling re-renders, and measured 60fps performance on both Home and Store screens.
- **L7 Closure:** `L7_CLOSED`.

## Post-L7 Frontend Hardening Closure
- **Final Decision:** `POST_L7_FRONTEND_HARDENING_PASS`.
- **Sweep:** Zero unused variables, zero Tamagui leaks, zero direct fetches.
- **Evidence:** Zipped in `tools/registry/runs/DSH_SLICE_001_POST_L7_HARDENING-20260525-0527/ad766e4b-8206-49ac-b422-19f64a726a07.zip`.

## Absolute Final Post-L7 Hardening — Central Data Ownership
- **Session:** `DSH_SLICE_001_POST_L7_HARDENING-20260525-065150` (2026-05-25)
- **Closure:** Central DSH domain preview data ownership established in `dsh/frontend/data/` (categories, discovery, items). 9 cross-surface import violations in `control-panel/marketing/` fixed. app-client surface adapters replaced with thin re-exports. All verification gates pass. TypeScript: 0 errors.
- **Final Decision:** `POST_L7_FRONTEND_HARDENING_PASS`.

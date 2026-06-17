# DSH Full Repo Slice Coverage Index

Status: ACTIVE_COVERAGE_INDEX
Decision: COVERAGE_INDEX_ACTIVE__GAPS_DOCUMENTED
Version: 2026-06-04-v1

Purpose:
Full-repo coverage index that maps every DSH-related source area to a Journey/Slice, or classifies it OUT_OF_SCOPE_WITH_REASON. Any area without a slice mapping or classification = GAP.

This file does NOT implement runtime, backend, UI, or OpenAPI. It uses references, IDs, owners, and statuses only.
On-demand retrieval: no bulk content copy, no duplication of matrix rows. Cross-reference the source file.

Governance:

- `dsh/SERVICE_BLUEPRINT.md` â€” service boundaries and lifecycle truth
- `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md` â€” journey and slice planning authority
- `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` â€” surface evidence rows
- `dsh/docs/SCREEN_API_MATRIX.md` â€” API candidate and binding readiness rows
- `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` â€” runtime proof rows
- `dsh/docs/CLOSURE_DECISION_LOG.md` â€” append-only decision log
- `dsh/docs/DSH_VISUAL_REVIEW.md` â€” visual evidence ledger

---

## Journey Map Reference

| Journey ID | Journey Name | Type |
|---|---|---|
| J-001 | Store Discovery | Business |
| J-002 | Catalog Management | Business |
| J-003 | Checkout / Payment | Business |
| J-004 | Order Lifecycle / Support | Business |
| J-005 | Delivery Execution | Business |
| J-006 | Field Readiness | Business |
| J-007 | Data / Media / Fixture Governance | Foundation |
| J-008 | Platform / Vars / Provider Policy | Foundation |
| J-009 | Control Panel Operations Room | Foundation |
| J-010 | WLT Finance / Settlement Boundary | Foundation |

Full execution slices: see `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md` Â§ Execution Slice Table.

---

## Source Area Coverage Map

### A. Service Blueprint & OpenAPI Contract

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Service blueprint | `dsh/SERVICE_BLUEPRINT.md` | J-001â€“J-010 | All slices | ACTIVE_REFERENCE | Master truth; read before any slice edit |
| OpenAPI contract | `dsh/dsh.openapi.yaml` | J-001, J-002, J-003, J-004, J-005 | 001A,001C,002*,003*,004* | DSH_SLICE001_AND_002_PASS | GET /stores + 3 PATCH gates + J-002 catalog management (J-003 checkout/payment demoted to IMPLEMENTATION_STARTED) |
| Go backend migrations | `dsh/backend/migrations/001_store_discovery.sql` | J-001 | DSH-SLICE-001A | BACKEND_PROVEN | Used in live E2E |
| Go backend migrations | `dsh/backend/migrations/002_store_visibility_gates.sql` | J-001 | DSH-SLICE-001C/D/E | BACKEND_PROVEN | Visibility gates proven |
| Go backend seed | `dsh/backend/seed/003_store_discovery_seed.sql` | J-001 | DSH-SLICE-001A | BACKEND_PROVEN | Seed data for E2E |
| Go backend handlers | `dsh/backend/internal/http/stores_handler.go` | J-001 | DSH-SLICE-001A,001C,001D,001E | BACKEND_PROVEN | GET /stores + 3 PATCH endpoints |
| Go backend handler tests | `dsh/backend/internal/http/stores_handler_test.go` | J-001 | DSH-SLICE-001A,001C,001D,001E | BACKEND_PROVEN | Unit tests pass |
| Go backend store repository | `dsh/backend/internal/store/store_repository.go` | J-001 | DSH-SLICE-001A | BACKEND_PROVEN | Interface |
| Go backend postgres repo | `dsh/backend/internal/store/postgres_repository.go` | J-001 | DSH-SLICE-001A | BACKEND_PROVEN | PostgreSQL implementation |
| Go backend memory repo | `dsh/backend/internal/store/memory_repository.go` | J-001 | DSH-SLICE-001A | BACKEND_PROVEN | In-memory fallback for tests |
| Field visit OpenAPI contract | `dsh/dsh.openapi.yaml` | J-006 | DSH-SLICE-006B | API_CONTRACT_ADDED | `POST /stores/{id}/field-visits` request/response schemas |
| Field document OpenAPI contract | `dsh/dsh.openapi.yaml` | J-006 | DSH-SLICE-006C | BLOCKED_WITH_REASON | `POST /stores/{id}/documents` + `CreateFieldDocumentRequest` + `FieldDocumentRecord` schemas |
| Field visit domain model | `dsh/domain/store_discovery.go` | J-006 | DSH-SLICE-006B | ACTIVE_BUILT | `CreateFieldVisitRequest` and `CreateFieldVisitResponse` |
| Field document domain model | `dsh/domain/store_discovery.go` | J-006 | DSH-SLICE-006C | BLOCKED_WITH_REASON | `CreateFieldDocumentRequest` and `FieldDocumentRecord` structs |
| Field visit backend route | `dsh/backend/internal/http/stores_handler.go`; `dsh/backend/internal/http/stores_handler_test.go` | J-006 | DSH-SLICE-006B | BACKEND_TESTED | Handler validation covers invalid JSON, missing summary, missing follow-up, and repository failure |
| Field document backend route | `dsh/backend/internal/http/stores_handler.go`; `dsh/backend/internal/http/stores_handler_test.go` | J-006 | DSH-SLICE-006C | BLOCKED_WITH_REASON | `POST /stores/{id}/documents` handler; validates kind, media_key; 400/500 tests pass |
| Field visit repository | `dsh/backend/internal/store/store_repository.go`; `dsh/backend/internal/store/postgres_repository.go`; `dsh/backend/internal/store/memory_repository.go` | J-006 | DSH-SLICE-006B | POSTGRES_LOCAL_PROVEN | Postgres persists submitted visit; memory repo fails explicitly until DATABASE_URL is set |
| Field document repository | `dsh/backend/internal/store/store_repository.go`; `dsh/backend/internal/store/postgres_repository.go`; `dsh/backend/internal/store/memory_repository.go` | J-006 | DSH-SLICE-006C | BLOCKED_WITH_REASON | `CreateFieldDocument` + `ListFieldDocuments`; memory stub errors; postgres persists and queries |
| Field visit migration | `dsh/backend/migrations/020_field_store_visits.sql` | J-006 | DSH-SLICE-006B | POSTGRES_LOCAL_PROVEN | Non-destructive runtime test applies the visit table and proves insert |
| Field document migration | `dsh/backend/migrations/021_field_store_documents.sql` | J-006 | DSH-SLICE-006C | BLOCKED_WITH_REASON | `dsh_field_store_documents` table; FK to stores; index on (store_id, created_at DESC) |
| Field visit runtime evidence test | `dsh/backend/internal/store/postgres_field_visit_runtime_test.go` | J-006 | DSH-SLICE-006B | OPTIONAL_RUNTIME_EVIDENCE | Skips by default; runs with `DSH_POSTGRES_RUNTIME_EVIDENCE=1` |
| Field document runtime evidence test | `dsh/backend/internal/store/postgres_field_document_runtime_test.go` | J-006 | DSH-SLICE-006C | BLOCKED_WITH_REASON | Skips by default; runs with `DSH_POSTGRES_RUNTIME_EVIDENCE=1`; proves insert + select |
| Go backend main | `dsh/backend/cmd/dsh-api/main.go` | J-001 | DSH-SLICE-001A | BACKEND_PROVEN | API entry point |
| Go backend client TS | `dsh/backend/client.ts`, `dsh/backend/src/client.ts` | J-001 | DSH-SLICE-001A | CANDIDATE | Typed client contract |
| Go backend contracts TS | `dsh/backend/contracts.ts`, `dsh/backend/src/contracts.ts` | J-001 | DSH-SLICE-001A | CANDIDATE | TS contract types |
| Backend docker compose | `dsh/backend/docker-compose.local.yml` | J-001 | DSH-SLICE-001A | BACKEND_PROVEN | Local Postgres for E2E |
| Backend README | `dsh/backend/README.md` | J-001 | DSH-SLICE-001A | OUT_OF_SCOPE_WITH_REASON: reference doc only, no slice action required |
| Go backend migrations | `dsh/backend/migrations/008_catalog_conflicts.sql` | J-002 | DSH-SLICE-002G | BACKEND_PROVEN | Catalog override conflicts schema |
| Go backend domain conflict | `dsh/domain/conflict.go` | J-002 | DSH-SLICE-002G | BACKEND_PROVEN | Domain definitions for catalog conflicts |
| Go backend conflicts handler | `dsh/backend/internal/http/conflicts_handler.go` | J-002 | DSH-SLICE-002G | BACKEND_PROVEN | HTTP endpoint handlers for list and resolve conflict |

### B. Frontend Shared Layer

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Cross-surface closure map | `dsh/frontend/shared/dshCrossSurfaceClosureMap.ts` | J-001â€“J-006 | All business slices | ACTIVE_RUNTIME_SOURCE | Live closure truth; read before any closure claim |
| DSH flow registry | `dsh/frontend/shared/dsh-flow-registry.ts` | J-001â€“J-006 | All business slices | ACTIVE_RUNTIME_SOURCE | Cross-surface flow definitions |
| Store visibility client | `dsh/frontend/shared/dsh-store-visibility-client.ts` | J-001 | DSH-SLICE-001C,001D,001E | DSH_SLICE001_SCREEN_RUNTIME_PROVEN | Typed client for 3 PATCH gates; screen proof captured in DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 |
| Store visibility transport | `dsh/frontend/shared/dsh-store-visibility-transport.ts` | J-001 | DSH-SLICE-001C,001D,001E | DSH_SLICE001_SCREEN_RUNTIME_PROVEN | HTTP transport for PATCH gates; screen proof captured in DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 |
| Discovery contract | `dsh/frontend/shared/dsh-discovery.contract.ts` | J-001 | DSH-SLICE-001A,001B | ACTIVE | Client-facing discovery contract |
| Client visibility model | `dsh/frontend/shared/dsh-client-visibility.model.ts` | J-001,J-002 | DSH-SLICE-001A,002F | ACTIVE | Visibility gate logic |
| Marketing visibility contract | `dsh/frontend/shared/marketing-visibility.contract.ts` | J-001,J-002 | DSH-SLICE-001E,002F | ACTIVE | Marketing publish gate |
| Store card commercial map | `dsh/frontend/shared/store-card-commercial-map.ts` | J-001,J-002 | DSH-SLICE-001B,002A | ACTIVE | Store card display mapping |
| DSH store builders | `dsh/frontend/shared/dsh-store-builders.ts` | J-001,J-002 | DSH-SLICE-001A,001B | ACTIVE | Store object builders |
| Catalog central adapter | `dsh/frontend/shared/catalog-central-adapter.ts` | J-002 | DSH-SLICE-002A,002B | ACTIVE | Catalog adapter |
| Catalog shared | `dsh/frontend/shared/catalog.ts` | J-002 | DSH-SLICE-002Aâ€“002G | ACTIVE | Catalog types and helpers |
| Product identity model | `dsh/frontend/shared/dsh-product-identity.model.ts` | J-002 | DSH-SLICE-002A | ACTIVE | SKU/GTIN/barcode identity |
| DSH store product card model | `dsh/frontend/shared/dshStoreProductCardModel.ts` | J-002 | DSH-SLICE-002A,002B | ACTIVE | Product card model |
| Order journey model | `dsh/frontend/shared/dsh-order-journey.model.ts` | J-004 | DSH-SLICE-004Aâ€“004F | ACTIVE | Order lifecycle model |
| Order preview contract | `dsh/frontend/shared/dsh-order-preview.contract.ts` | J-004 | DSH-SLICE-004A | ACTIVE | Order preview contract |
| Order lifecycle handoffs | `dsh/frontend/shared/dsh-order-lifecycle-handoffs.ts` | J-004 | DSH-SLICE-004B | ACTIVE | Handoff state machine |
| Delivery mode model | `dsh/frontend/shared/dsh-delivery-mode.model.ts` | J-005 | DSH-SLICE-005A | ACTIVE | Delivery mode types |
| Fulfillment surface visibility | `dsh/frontend/shared/dsh-fulfillment-surface-visibility.ts` | J-005 | DSH-SLICE-005Aâ€“005F | ACTIVE | Fulfillment visibility rules |
| Partner onboarding journey | `dsh/frontend/shared/dsh-partner-onboarding-journey.map.ts` | J-006 | DSH-SLICE-006Aâ€“006E | ACTIVE | Field/partner onboarding map |
| Partner activation model | `dsh/frontend/shared/dsh-partner-activation.model.ts` | J-006 | DSH-SLICE-006C,006E | ACTIVE | Partner activation state |
| Field visit contract | `dsh/frontend/shared/dsh-field-visit.contract.ts` | J-006 | DSH-SLICE-006B,006C | ACTIVE | Field visit contract |
| Field visit API client | `dsh/frontend/shared/dsh-field-visit-client.ts` | J-006 | DSH-SLICE-006B | API_CLIENT_BOUND__RUNTIME_PROVEN | Typed client for `POST /stores/{id}/field-visits`; stores evidence references only |
| Field document API client | `dsh/frontend/shared/dsh-field-document-client.ts` | J-006 | DSH-SLICE-006C | **PASS** | Typed client for `POST /stores/{id}/documents`; request/response types; offline/http error handling |
| CP operations contract | `dsh/frontend/shared/dsh-cp-operations.contract.ts` | J-009 | DSH-SLICE-009Aâ€“009D | ACTIVE | Control-panel ops contract |
| CP operations room | `dsh/frontend/shared/dsh-control-panel-operations-room.ts` | J-009 | DSH-SLICE-009A,009B | ACTIVE | Ops room model |
| CP platform contract | `dsh/frontend/shared/dsh-cp-platform.contract.ts` | J-008 | DSH-SLICE-008Aâ€“008D | ACTIVE | Platform/vars contract |
| CP administration contract | `dsh/frontend/shared/dsh-cp-administration.contract.ts` | J-008,J-009 | DSH-SLICE-008A,009D | ACTIVE | Admin contract |
| Operational contract | `dsh/frontend/shared/dsh-operational.contract.ts` | J-004,J-009 | DSH-SLICE-004F,009A | ACTIVE | Operational contract |
| Operational registry | `dsh/frontend/shared/dsh-operational-registry.ts` | J-009 | DSH-SLICE-009A | ACTIVE | Operational event registry |
| Operational preview adapter | `dsh/frontend/shared/dsh-operational-preview-adapter.ts` | J-009 | DSH-SLICE-009A | ACTIVE_PREVIEW | Preview-only; not runtime |
| Operational surface binding | `dsh/frontend/shared/dsh-operational-surface-binding.ts` | J-009 | DSH-SLICE-009A | ACTIVE | Surface binding |
| DSH role permission model | `dsh/frontend/shared/dsh-role-permission.model.ts` | J-008,J-009 | DSH-SLICE-008A,009A | ACTIVE | Role/permission model |
| DSH governance map | `dsh/frontend/shared/dsh-governance.map.ts` | J-008 | DSH-SLICE-008A | ACTIVE | Governance classification map |
| Signal layer model | `dsh/frontend/shared/dsh-signal-layer.model.ts` | J-009 | DSH-SLICE-009A | ACTIVE | Operations signal layer |
| WLT settlement bridge contract | `dsh/frontend/shared/dsh-wlt-settlement-bridge.contract.ts` | J-010 | DSH-SLICE-010A,010B | ACTIVE | Read-only WLT bridge contract |
| DSH finance preview model | `dsh/frontend/shared/dshFinancePreviewModel.ts` | J-010 | DSH-SLICE-010A | ACTIVE_PREVIEW | Preview-only finance model |
| Workflow | `dsh/frontend/shared/workflow.ts` | J-004,J-009 | DSH-SLICE-004B,009C | ACTIVE | Workflow state model |
| Commercial preview contract | `dsh/frontend/shared/commercial.preview-contract.ts` | J-002,J-003 | DSH-SLICE-002A,003A | ACTIVE_PREVIEW | Preview-only commercial contract |
| Resolve DSH image source | `dsh/frontend/shared/resolve-dsh-image-source.ts` | J-007 | DSH-SLICE-007A,007B | ACTIVE | Media source resolution |
| Resolve DSH public media path | `dsh/frontend/shared/resolve-dsh-public-media-path.ts` | J-007 | DSH-SLICE-007B | ACTIVE | Public media path resolver |
| DSH preview color | `dsh/frontend/shared/dsh-preview-color.ts` | J-007 | DSH-SLICE-007A | ACTIVE_PREVIEW | Preview color tokens |
| Index export | `dsh/frontend/shared/index.ts` | J-001â€“J-010 | All | ACTIVE | Public shared export |

### C. Frontend Data Layer

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Preview data contract | `dsh/frontend/data/legacy-preview/preview-data.contract.ts` | J-007 | DSH-SLICE-007A | ACTIVE | Contract for all preview data |
| Stores preview data | `dsh/frontend/data/legacy-preview/stores.preview-data.ts` | J-001,J-007 | DSH-SLICE-001A,007A | ACTIVE_PREVIEW | Preview store list |
| Categories preview data | `dsh/frontend/data/legacy-preview/categories.preview-data.ts` | J-002,J-007 | DSH-SLICE-002B,007A | ACTIVE_PREVIEW | Preview categories |
| Products preview data | `dsh/frontend/data/legacy-preview/products.preview-data.ts` | J-002,J-007 | DSH-SLICE-002A,007A | ACTIVE_PREVIEW | Preview products |
| Partner preview data | `dsh/frontend/data/legacy-preview/partner.preview-data.ts` | J-002,J-006,J-007 | DSH-SLICE-002A,006A,007A | ACTIVE_PREVIEW | Preview partner data |
| Orders preview data | `dsh/frontend/data/legacy-preview/orders.preview-data.ts` | J-004,J-007 | DSH-SLICE-004A,007A | ACTIVE_PREVIEW | Preview orders |
| Marketing preview data | `dsh/frontend/data/legacy-preview/marketing.preview-data.ts` | J-001,J-002,J-007 | DSH-SLICE-001E,002F,007A | ACTIVE_PREVIEW | Preview marketing banners |
| Offers preview data | `dsh/frontend/data/legacy-preview/offers.preview-data.ts` | J-002,J-007 | DSH-SLICE-002A,007A | ACTIVE_PREVIEW | Preview offers |
| Operational preview data | `dsh/frontend/data/legacy-preview/operational.preview-data.ts` | J-009,J-007 | DSH-SLICE-009A,007A | ACTIVE_PREVIEW | Preview ops data |
| Operational statuses preview | `dsh/frontend/data/legacy-preview/operational-statuses.preview-data.ts` | J-009,J-007 | DSH-SLICE-009A,007A | ACTIVE_PREVIEW | Preview operational statuses |
| Finance preview data | `dsh/frontend/data/legacy-preview/finance.preview-data.ts` | J-010,J-007 | DSH-SLICE-010A,007A | ACTIVE_PREVIEW | Preview finance data (read-only WLT bridge) |
| DSH finance preview | `dsh/frontend/data/legacy-preview/dshFinancePreview.ts` | J-010,J-007 | DSH-SLICE-010A,007A | ACTIVE_PREVIEW | Finance preview fixture |
| Wallet preview data | `dsh/frontend/data/legacy-preview/wallet.preview-data.ts` | J-010,J-007 | DSH-SLICE-010A,007A | ACTIVE_PREVIEW | Wallet read-only preview |
| Customers preview data | `dsh/frontend/data/legacy-preview/customers.preview-data.ts` | J-001,J-007 | DSH-SLICE-001A,007A | ACTIVE_PREVIEW | Preview customer data |
| Branches preview data | `dsh/frontend/data/legacy-preview/branches.preview-data.ts` | J-002,J-007 | DSH-SLICE-002A,007A | ACTIVE_PREVIEW | Preview branch data |
| Delivery modes preview data | `dsh/frontend/data/legacy-preview/delivery-modes.preview-data.ts` | J-005,J-007 | DSH-SLICE-005A,007A | ACTIVE_PREVIEW | Preview delivery modes |
| Subscriptions preview data | `dsh/frontend/data/legacy-preview/subscriptions.preview-data.ts` | J-008,J-007 | DSH-SLICE-008B,007A | ACTIVE_PREVIEW | Preview subscriptions |
| Platform preview data | `dsh/frontend/data/legacy-preview/platform.preview-data.ts` | J-008,J-007 | DSH-SLICE-008A,007A | ACTIVE_PREVIEW | Preview platform config |
| Publishing gates preview | `dsh/frontend/data/legacy-preview/publishing-gates.preview-data.ts` | J-001,J-002,J-007 | DSH-SLICE-001D,002F,007A | ACTIVE_PREVIEW | Preview publishing gates |
| Canonical preview data | `dsh/frontend/data/legacy-preview/canonical.preview-data.ts` | J-007 | DSH-SLICE-007A | ACTIVE | Canonical preview authority |
| Signals preview data | `dsh/frontend/data/legacy-preview/signals.preview-data.ts` | J-009,J-007 | DSH-SLICE-009A,007A | ACTIVE_PREVIEW | Preview signal data |
| Media preview data | `dsh/frontend/data/legacy-preview/media.preview-data.ts` | J-007 | DSH-SLICE-007B | ACTIVE_PREVIEW | Preview media fixtures |
| Support preview data | `dsh/frontend/data/legacy-preview/support.preview-data.ts` | J-004,J-007 | DSH-SLICE-004C,007A | ACTIVE_PREVIEW | Preview support data |
| Data index | `dsh/frontend/data/legacy-preview/index.ts` | J-007 | DSH-SLICE-007A | ACTIVE | Public data export |

### D. Frontend Media Fixtures

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Media fixtures README | `dsh/frontend/media-fixtures/README.md` | J-007 | DSH-SLICE-007B | ACTIVE_REFERENCE | Media governance rules |
| Media manifest | `dsh/frontend/media-fixtures/MANIFEST.local-required.tsv` | J-007 | DSH-SLICE-007B | ACTIVE | Local media manifest |
| Store logos | `dsh/frontend/media-fixtures/store_logos/**` | J-001,J-007 | DSH-SLICE-001B,007B | ACTIVE_PREVIEW | Preview store logos; governed by mediaKey rules |
| Store covers | `dsh/frontend/media-fixtures/stores/**` | J-001,J-007 | DSH-SLICE-001B,007B | ACTIVE_PREVIEW | Preview store covers |
| Product images | `dsh/frontend/media-fixtures/products/**` | J-002,J-007 | DSH-SLICE-002C,007B | ACTIVE_PREVIEW | Preview product images |
| Banners | `dsh/frontend/media-fixtures/banners/**` | J-001,J-007 | DSH-SLICE-001E,007B | ACTIVE_PREVIEW | Preview banners |
| Category main images | `dsh/frontend/media-fixtures/categories/main/**` | J-002,J-007 | DSH-SLICE-002B,007B | ACTIVE_PREVIEW | Preview main categories |
| Category sub images | `dsh/frontend/media-fixtures/categories/sub/**` | J-002,J-007 | DSH-SLICE-002B,007B | ACTIVE_PREVIEW | Preview sub categories |

### E. Frontend app-client

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Screen registry | `dsh/frontend/app-client/dsh-client.screen-registry.ts` | J-001â€“J-004 | 001A,003Aâ€“003E,004A | ACTIVE_RUNTIME_SOURCE | Live closure truth |
| Route definitions | `dsh/frontend/app-client/dsh-client.routes.ts` | J-001â€“J-004 | 001A,001B,003A,004A | ACTIVE | Route ownership |
| Client types | `dsh/frontend/app-client/dsh-client.types.ts` | J-001,J-003,J-004 | 001A,003A,004A | ACTIVE | Typed surface models |
| Index export | `dsh/frontend/app-client/index.ts` | J-001â€“J-004 | All client slices | ACTIVE | Public client export |
| Discovery stores client | `dsh/frontend/app-client/shared/dsh-discovery-stores-client.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Typed discovery client |
| Discovery stores transport | `dsh/frontend/app-client/shared/dsh-discovery-stores-transport.ts` | J-001 | DSH-SLICE-001A | ACTIVE_RUNTIME_PROVEN | GET /stores transport; E2E proven |
| Discovery stores runtime config | `dsh/frontend/app-client/shared/dsh-discovery-stores-runtime-config.ts` | J-001 | DSH-SLICE-001A | ACTIVE_RUNTIME_PROVEN | Runtime config for API base URL |
| Discovery stores mappers | `dsh/frontend/app-client/shared/dsh-discovery-stores-mappers.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Store data mappers |
| Discovery stores bridge | `dsh/frontend/app-client/shared/dsh-discovery-stores-bridge.ts` | J-001 | DSH-SLICE-001A | ACTIVE_RUNTIME_PROVEN | Bridge for runtime â†” preview |
| Store types | `dsh/frontend/app-client/contracts/dsh-store-types.ts` | J-001,J-002 | DSH-SLICE-001A,001B,002A | ACTIVE | Store type contracts |
| Store screen props | `dsh/frontend/app-client/contracts/dsh-store-screen-props.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Store screen prop types |
| Home screen props | `dsh/frontend/app-client/contracts/dsh-home-screen-props.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Home screen prop types |
| Home types | `dsh/frontend/app-client/contracts/dsh-home-types.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Home type definitions |
| OpenAPI types | `dsh/frontend/app-client/contracts/dsh-openapi.types.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Generated OpenAPI types |
| Client binding contracts | `dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts` | J-001â€“J-004 | All client slices | ACTIVE | Surface binding contracts |
| Store profile helper | `dsh/frontend/app-client/shared/store-profile.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Store profile display helper |
| Store formatting helper | `dsh/frontend/app-client/shared/store-formatting.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Store display formatting |
| Store search helpers | `dsh/frontend/app-client/shared/store-search-helpers.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Inline search helpers |
| Home search helpers | `dsh/frontend/app-client/shared/home-search-helpers.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Home search helpers |
| Home promo mappers | `dsh/frontend/app-client/shared/home-promo-mappers.ts` | J-001 | DSH-SLICE-001A,001E | ACTIVE | Promo/banner mapping |
| Store builders | `dsh/frontend/app-client/shared/store-builders.ts` | J-001 | DSH-SLICE-001A,001B | ACTIVE | Store item builders |
| Resolve dev media URL | `dsh/frontend/app-client/shared/resolve-dev-media-url.ts` | J-007 | DSH-SLICE-007B | ACTIVE | Dev media URL resolver |
| Category icon URL | `dsh/frontend/app-client/shared/get-dsh-category-icon-url.ts` | J-002 | DSH-SLICE-002B | ACTIVE | Category icon resolver |
| Menu item to product card | `dsh/frontend/app-client/shared/map-menu-item-to-product-card.ts` | J-002 | DSH-SLICE-002A | ACTIVE | Product card mapper |
| Resolve image source | `dsh/frontend/app-client/shared/resolve-image-source.ts` | J-007 | DSH-SLICE-007B | ACTIVE | Image source resolver |
| Home state hook | `dsh/frontend/app-client/hooks/useHomeState.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Home screen state hook |
| Debounce hook | `dsh/frontend/app-client/hooks/useDebounce.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Search debounce |
| Back handler hook | `dsh/frontend/app-client/hooks/useHomeBackHandler.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Back navigation handler |
| Store derived items hook | `dsh/frontend/app-client/hooks/useStoreDerivedItems.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Derived store items |
| Store gesture handlers | `dsh/frontend/app-client/hooks/useStoreGestureHandlers.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Gesture handlers |
| Store state hook | `dsh/frontend/app-client/hooks/useStoreState.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Store detail state |
| Store inline search hook | `dsh/frontend/app-client/hooks/useStoreInlineSearch.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Inline search state |
| Store measurement state | `dsh/frontend/app-client/hooks/useStoreMeasurementState.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Scroll/measurement state |
| Store preview state | `dsh/frontend/app-client/hooks/useStorePreviewState.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Preview state for store |
| Store shell derived state | `dsh/frontend/app-client/hooks/useStoreShellDerivedState.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Shell derived state |
| Home ticker state | `dsh/frontend/app-client/hooks/useHomeTickerState.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Ticker/promo state |
| Home video handlers | `dsh/frontend/app-client/hooks/useHomeVideoHandlers.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Video reels handler |
| Home promo handlers | `dsh/frontend/app-client/hooks/useHomePromoHandlers.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Promo interaction handler |
| Home screen styles | `dsh/frontend/app-client/parts/home/home-screen.styles.ts` | J-001 | DSH-SLICE-001A | ACTIVE | Home screen style tokens |
| Store screen styles | `dsh/frontend/app-client/parts/store/store-screen.styles.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Store screen style tokens |
| Store appearance chrome | `dsh/frontend/app-client/parts/store/store-appearance-chrome.ts` | J-001 | DSH-SLICE-001B | ACTIVE | Store chrome appearance |
| Sheets index | `dsh/frontend/app-client/sheets/index.ts` | J-001,J-003,J-004 | 001B,003A,004A | ACTIVE | Client sheets |

### F. Frontend app-partner

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Screen registry | `dsh/frontend/app-partner/dsh-partner.screen-registry.ts` | J-001â€“J-002,J-004,J-006 | 001C,002*,004B,006E | ACTIVE_RUNTIME_SOURCE | Live closure truth |
| Route definitions | `dsh/frontend/app-partner/dsh-partner.routes.ts` | J-001â€“J-002,J-004 | 001C,002A,004B | ACTIVE | Route ownership |
| Partner types | `dsh/frontend/app-partner/dsh-partner.types.ts` | J-001â€“J-002,J-004 | 001C,002A,004B | ACTIVE | Partner surface types |
| Partner binding contracts | `dsh/frontend/app-partner/contracts/dsh-partner-binding.contracts.ts` | J-001â€“J-002,J-004 | 001C,002*,004B | ACTIVE | Binding contracts |
| Index export | `dsh/frontend/app-partner/index.ts` | J-001â€“J-002,J-004,J-006 | All partner slices | ACTIVE | Public partner export |

### G. Frontend app-captain

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Screen registry | `dsh/frontend/app-captain/dsh-captain.screen-registry.ts` | J-004,J-005 | 004A,005Aâ€“005F | ACTIVE_RUNTIME_SOURCE | Live closure truth |
| Route definitions | `dsh/frontend/app-captain/dsh-captain.routes.ts` | J-005 | DSH-SLICE-005Aâ€“005F | ACTIVE | Captain routes |
| Captain types | `dsh/frontend/app-captain/dsh-captain.types.ts` | J-005 | DSH-SLICE-005Aâ€“005F | ACTIVE | Captain types |
| Captain binding contracts | `dsh/frontend/app-captain/contracts/dshCaptainBinding.contracts.ts` | J-005 | DSH-SLICE-005Aâ€“005F | ACTIVE | Captain binding contracts |
| Operation screen parts | `dsh/frontend/app-captain/parts/OperationScreen.ts` | J-005 | DSH-SLICE-005D | ACTIVE | Captain operation screen part |
| Sheets index | `dsh/frontend/app-captain/sheets/index.ts` | J-005 | DSH-SLICE-005B,005C | ACTIVE | Captain sheets |
| Index export | `dsh/frontend/app-captain/index.ts` | J-004,J-005 | All captain slices | ACTIVE | Public captain export |

### H. Frontend app-field

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Screen registry | `dsh/frontend/app-field/dsh-field.screen-registry.ts` | J-006 | DSH-SLICE-006Aâ€“006E | ACTIVE_RUNTIME_SOURCE | Live closure truth |
| Route definitions | `dsh/frontend/app-field/dsh-field.routes.ts` | J-006 | DSH-SLICE-006Aâ€“006E | ACTIVE | Field routes |
| Field types | `dsh/frontend/app-field/dsh-field.types.ts` | J-006 | DSH-SLICE-006Aâ€“006E | ACTIVE | Field types |
| Visit types | `dsh/frontend/app-field/types/DshFieldStoreVisitTypes.ts` | J-006 | DSH-SLICE-006B | ACTIVE | Visit evidence types |
| Field binding contracts | `dsh/frontend/app-field/contracts/dsh-field-binding.contracts.ts` | J-006 | DSH-SLICE-006Aâ€“006E | ACTIVE | Field binding contracts |
| Field surface onboarding API binding | `dsh/frontend/app-field/DshFieldSurface.tsx`; `dsh/frontend/shared/dsh-field-store-onboarding-client.ts` | J-006 | DSH-SLICE-006A | BLOCKED_WITH_REASON | Store onboarding submit bound to typed `POST /stores`; pending auth & database proof |
| Field surface visit API binding | `dsh/frontend/app-field/DshFieldSurface.tsx`; `dsh/frontend/shared/dsh-field-visit-client.ts`; `dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx`; `dsh/frontend/app-field/sections/VisitEvidenceSection.tsx` | J-006 | DSH-SLICE-006B | BLOCKED_WITH_REASON | Visit submit bound to typed `POST /stores/{id}/field-visits`; pending auth & database proof |
| Field surface document API binding | `dsh/frontend/app-field/DshFieldSurface.tsx`; `dsh/frontend/shared/dsh-field-document-client.ts`; `dsh/frontend/app-field/screens/DshFieldDocumentUploadScreen.tsx` | J-006 | DSH-SLICE-006C | BLOCKED_WITH_REASON | Document upload bound to typed `POST /stores/{id}/documents`; pending auth & database proof |
| Field document route registration | `dsh/frontend/app-field/dsh-field.routes.ts`; `dsh/frontend/app-field/dsh-field.screen-registry.ts`; `dsh/frontend/app-field/dsh-field.types.ts` | J-006 | DSH-SLICE-006C | BLOCKED_WITH_REASON | Route `dsh-field-document-upload` registered; pending auth & database proof |
| Field onboarding storage | `dsh/frontend/app-field/storage/field-onboarding.storage.ts` | J-006 | DSH-SLICE-006A | ACTIVE | Local onboarding storage |
| Sections index | `dsh/frontend/app-field/sections/index.ts` | J-006 | DSH-SLICE-006A,006B | ACTIVE | Field sections |
| Index export | `dsh/frontend/app-field/index.ts` | J-006 | All field slices | ACTIVE | Public field export |

### I. Frontend control-panel

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Operations registry | `dsh/frontend/control-panel/operations/operations.registry.ts` | J-009 | DSH-SLICE-009Aâ€“009D | ACTIVE_RUNTIME_SOURCE | Operations room registry |
| Operations index | `dsh/frontend/control-panel/operations/index.ts` | J-009 | DSH-SLICE-009Aâ€“009D | ACTIVE | Operations module export |
| Operations flow meta | `dsh/frontend/control-panel/operations/flow-meta.ts` | J-009 | DSH-SLICE-009A | ACTIVE | Operations flow metadata |
| Finance registry | `dsh/frontend/control-panel/finance/finance.registry.ts` | J-010 | DSH-SLICE-010Aâ€“010D | ACTIVE_RUNTIME_SOURCE | Finance registry (WLT bridge) |
| CP surface catalog | `dsh/frontend/control-panel/surface-catalog.ts` | J-001,J-002,J-009,J-010 | 001D,001E,002E,009A,010A | ACTIVE | CP surface catalog |
| Audit trail drawer | `dsh/frontend/control-panel/catalogs/drawers/audit-trail.drawer.tsx` | J-002 | DSH-SLICE-002G | ACTIVE | Audit log and live conflicts resolution UI |
| CP surface meta | `dsh/frontend/control-panel/surface-meta.ts` | J-008,J-009 | DSH-SLICE-008A,009A | ACTIVE | CP surface metadata |
| CP governance map | `dsh/frontend/control-panel/shared/dsh-control-panel-governance.map.ts` | J-008,J-009 | DSH-SLICE-008A,009A | ACTIVE | Governance map |
| CP shared index | `dsh/frontend/control-panel/shared/index.ts` | J-008,J-009 | All CP slices | ACTIVE | CP shared export |
| Platform index | `dsh/frontend/control-panel/platform/index.ts` | J-008 | DSH-SLICE-008Aâ€“008D | ACTIVE | Platform module export |
| Platform Vars | `dsh/frontend/control-panel/platform/Vars/index.ts` | J-008 | DSH-SLICE-008C | ACTIVE | Vars platform module |
| Platform Audit | `dsh/frontend/control-panel/platform/Audit/index.ts` | J-008,J-009 | DSH-SLICE-008A,009D | ACTIVE | Audit platform module |
| Platform Health | `dsh/frontend/control-panel/platform/Health/index.ts` | J-008 | DSH-SLICE-008A | ACTIVE | Health platform module |
| Platform Providers | `dsh/frontend/control-panel/platform/Providers/index.ts` | J-008 | DSH-SLICE-008A | ACTIVE | Providers platform module |
| Platform Providers types | `dsh/frontend/control-panel/platform/Providers/providers.types.ts` | J-008 | DSH-SLICE-008A | ACTIVE | Provider types |
| Platform Rollouts | `dsh/frontend/control-panel/platform/Rollouts/index.ts` | J-008 | DSH-SLICE-008B | ACTIVE | Rollouts/feature flags module |
| Platform Services | `dsh/frontend/control-panel/platform/Services/index.ts` | J-008 | DSH-SLICE-008A | ACTIVE | Services module |
| Platform Services types | `dsh/frontend/control-panel/platform/Services/services.types.ts` | J-008 | DSH-SLICE-008A | ACTIVE | Services types |
| Platform Appearance | `dsh/frontend/control-panel/platform/Appearance/index.ts` | J-008 | DSH-SLICE-008A | ACTIVE | Appearance platform module |
| Platform Appearance types | `dsh/frontend/control-panel/platform/Appearance/appearance.types.ts` | J-008 | DSH-SLICE-008A | ACTIVE | Appearance types |
| Administration index | `dsh/frontend/control-panel/administration/index.ts` | J-009 | DSH-SLICE-009D | ACTIVE | Admin module |
| Administration types | `dsh/frontend/control-panel/administration/administration.types.ts` | J-009 | DSH-SLICE-009D | ACTIVE | Admin types |
| Frontend index | `dsh/frontend/index.ts` | J-001â€“J-010 | All | ACTIVE | DSH frontend root export |

### J. Control Panel Runtime App (Next.js routes)

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Root page | `control-panel/runtime/app/page.tsx` | J-009 | DSH-SLICE-009A | ACTIVE | CP root page |
| Dashboard page | `control-panel/runtime/app/dashboard/page.tsx` | J-009 | DSH-SLICE-009A | ACTIVE | Dashboard route |
| Operations page | `control-panel/runtime/app/operations/page.tsx` | J-001,J-009 | DSH-SLICE-001D/E,009Aâ€“009D | ACTIVE | Operations route; catalog/marketing gates live here |
| Catalogs page | `control-panel/runtime/app/catalogs/page.tsx` | J-001,J-002 | DSH-SLICE-001D,002E,002F | ACTIVE | Catalogs governance route |
| Partners page | `control-panel/runtime/app/partners/page.tsx` | J-001,J-006 | DSH-SLICE-001C,006E | ACTIVE | Partners route |
| Finance page | `control-panel/runtime/app/finance/page.tsx` | J-010 | DSH-SLICE-010Aâ€“010D | BLOCKED_BY_WLT | Finance is WLT-owned read-only bridge |
| Marketing page | `control-panel/runtime/app/marketing/page.tsx` | J-001,J-002 | DSH-SLICE-001E,002F | ACTIVE | Marketing visibility route |
| Platform page | `control-panel/runtime/app/platform/page.tsx` | J-008 | DSH-SLICE-008Aâ€“008D | ACTIVE | Platform/vars/policy route |
| Administration page | `control-panel/runtime/app/administration/page.tsx` | J-009 | DSH-SLICE-009D | ACTIVE | Administration route |
| Support page | `control-panel/runtime/app/support/page.tsx` | J-004,J-009 | DSH-SLICE-004F,009C | ACTIVE | Support/escalation route |
| Community services page | `control-panel/runtime/app/community-services/page.tsx` | J-008 | DSH-SLICE-008A | OUT_OF_SCOPE_WITH_REASON: community services is not a DSH primary domain; classification pending community service journey definition |
| HR page | `control-panel/runtime/app/hr/page.tsx` | J-008 | OUT_OF_SCOPE_WITH_REASON: HR is outside DSH domain; governed separately |
| Layout | `control-panel/runtime/app/layout.tsx` | J-009 | DSH-SLICE-009A | ACTIVE | CP layout (shared) |

### K. WLT/DSH Bridge

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| WLT-DSH client bridge | `wlt/frontend/dsh/app-client/**` | J-003,J-010 | DSH-SLICE-003C,010A | ACTIVE_PREVIEW | WLT payment bridge for app-client; preview only |
| WLT-DSH partner bridge | `wlt/frontend/dsh/app-partner/**` | J-004,J-010 | DSH-SLICE-004E,010A | ACTIVE_PREVIEW | WLT partner wallet bridge; preview only |
| WLT-DSH captain bridge | `wlt/frontend/dsh/app-captain/**` | J-005,J-010 | DSH-SLICE-005F,010A | ACTIVE_PREVIEW | WLT captain payout bridge; preview only |
| WLT-DSH field bridge | `wlt/frontend/dsh/app-field/**` | J-006,J-010 | DSH-SLICE-006E,010A | ACTIVE_PREVIEW | WLT field commission bridge; preview only |
| WLT-DSH control-panel finance | `wlt/frontend/dsh/control-panel/**` | J-010 | DSH-SLICE-010Aâ€“010D | BLOCKED_BY_WLT | Full WLT finance ownership; DSH reads only |

### L. Tools â€” Guards

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| DSH media manifest guard | `tools/guards/guard-dsh-media-manifest.mjs` | J-007 | DSH-SLICE-007B | ACTIVE | Enforces media manifest integrity |
| DSH shared foundations guard | `tools/guards/guard-dsh-shared-foundations-final.mjs` | J-007,J-008 | DSH-SLICE-007A,008A | ACTIVE | Enforces shared foundation rules |

### M. Tools â€” Scripts

| Source Area | Path | Journey(s) | Slice(s) | Status | Notes |
|---|---|---|---|---|---|
| Exhaustive audit script | `tools/scripts/generate-dsh-exhaustive-audit.ps1` | J-007 | DSH-SLICE-007A | ACTIVE | Audit generation script |
| Catalog screenshot script | `tools/scripts/dsh-catalog-screenshot.mjs` | J-002 | DSH-SLICE-002E | ACTIVE | Catalog visual capture |
| Catalog click screenshot | `tools/scripts/dsh-catalog-click-screenshot.mjs` | J-002 | DSH-SLICE-002E | ACTIVE | Catalog click evidence |
| Catalog debug tabs | `tools/scripts/dsh-catalog-debug-tabs.mjs` | J-002 | DSH-SLICE-002E | ACTIVE | Catalog tab debug |
| Marketing screenshot | `tools/scripts/dsh-marketing-screenshot.mjs` | J-001,J-002 | DSH-SLICE-001E,002F | ACTIVE | Marketing visibility capture |

### N. DSH Docs (Reference/Governance â€” Not Journey-Mapped as Source Areas)

| Source Area | Path | Classification | Notes |
|---|---|---|---|
| Service Blueprint | `dsh/SERVICE_BLUEPRINT.md` | GOVERNANCE_REFERENCE | Master truth; not a slice itself |
| Docs README | `dsh/docs/README.md` | GOVERNANCE_REFERENCE | Docs index |
| Coverage Manifest | `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md` | GOVERNANCE_REFERENCE | Journey/slice authority |
| This Index | `dsh/docs/DSH_FULL_REPO_SLICE_COVERAGE_INDEX.md` | GOVERNANCE_REFERENCE | Full repo coverage map |
| UI/UX Flow Closure Matrix | `dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md` | EVIDENCE_REFERENCE | Surface evidence rows |
| Screen/API Matrix | `dsh/docs/SCREEN_API_MATRIX.md` | EVIDENCE_REFERENCE | API candidate and binding readiness rows |
| Runtime Evidence Matrix | `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | EVIDENCE_REFERENCE | Runtime proof rows |
| Closure Decision Log | `dsh/docs/CLOSURE_DECISION_LOG.md` | EVIDENCE_REFERENCE | Append-only log |
| Visual Review Ledger | `dsh/docs/DSH_VISUAL_REVIEW.md` | EVIDENCE_REFERENCE | Visual evidence queue |
| DSH-SLICE-001 Store Discovery | `dsh/docs/slices/journey-001-store-discovery/DSH-SLICE-001-STORE-DISCOVERY.md` | SLICE_MANIFEST | Parent slice for J-001; linked to 001Aâ€“001F |
| Control Panel Owner Decision | `dsh/docs/DSH_CONTROL_PANEL_SHARED_OWNER_DECISION.md` | GOVERNANCE_REFERENCE | CP ownership policy |
| Migration doc | `dsh/docs/archive/MIGRATION.md` | HISTORICAL_REFERENCE | Migration history |
| Command doc | `dsh/docs/archive/command.md` | HISTORICAL_REFERENCE | Deprecated; no branch-specific instructions allowed |
| WLT Roadmap V3 | `dsh/docs/archive/BTHWANI_DSH_CLIENT_WLT_FINAL_CLOSURE_ROADMAP_V3.md` | HISTORICAL_REFERENCE | App-client + WLT boundary history |
| Master Closure Matrix | `dsh/docs/archive/DSH_MASTER_CLOSURE_MATRIX.md` | HISTORICAL_REFERENCE | Retired consolidated closure matrix |
| Unified Closure Matrix | `dsh/docs/archive/DSH_UNIFIED_CLOSURE_MATRIX.md` | HISTORICAL_REFERENCE | Retired consolidated UI/UX and screen/API matrix |
| Operational Model Gap Map | `dsh/docs/archive/DSH_OPERATIONAL_OPERATING_MODEL_GAP_MAP.md` | GAP_REFERENCE | Operational model gap tracking |
| Operational Runtime API Slices Plan | `dsh/docs/archive/DSH_OPERATIONAL_RUNTIME_API_SLICES_PLAN.md` | PLANNING_REFERENCE | Future slice planning; not yet active |
| File Size Risk Matrix | `dsh/docs/archive/DSH_FILE_SIZE_RISK_MATRIX.md` | GOVERNANCE_REFERENCE | Screen refactoring risk matrix |

---

## GAP Rows

Areas found without a slice mapping or with evidence of missing classification:

| GAP ID | Area | Description | Required Action |
|---|---|---|---|
| GAP-IDX-001 | `dsh/docs/archive/DSH_OPERATIONAL_OPERATING_MODEL_GAP_MAP.md` | **RESOLVED 2026-06-06** â€” classified as GAP_REFERENCE / future operational contract planning. J-009Aâ€“009D are already PASS in the slice manifest; this reference does not reopen closed runtime slices. | No current slice action required; use only as future operational-contract input |
| GAP-IDX-002 | `dsh/docs/archive/DSH_OPERATIONAL_RUNTIME_API_SLICES_PLAN.md` | **RESOLVED 2026-06-06** â€” classified as PLANNING_REFERENCE. It maps future runtime/API candidates by operational slice and explicitly states that it does not add backend, OpenAPI, generated clients, local demo data, or UI routes. | No current slice action required; future API work must open a dedicated slice |
| GAP-IDX-003 | `control-panel/runtime/app/community-services/page.tsx` | **RESOLVED 2026-06-06** â€” classified OUT_OF_SCOPE_WITH_REASON. Community services route is not a DSH primary domain and remains governed by community-service ownership, not DSH slice closure. | No DSH slice action required |
| GAP-IDX-004 | `dsh/docs/archive/DSH_FILE_SIZE_RISK_MATRIX.md` | **RESOLVED 2026-06-06** â€” classified GOVERNANCE_REFERENCE / historical decomposition audit. Current truth states the DSH-SLICE-001 Home/Store decomposition is complete and no execution slice remains open. | No current slice action required |
| GAP-IDX-006 | `dsh/frontend/control-panel/finance/finance.registry.ts` â€” `FinanceHubScreen.tsx`, `FinanceHubScreens.tsx` | **RESOLVED 2026-06-06** â€” finance registry and screens are mapped to J-010 / DSH-SLICE-010Aâ€“010D in this index and manifest. WLT remains the financial source of truth; DSH displays read-only bridge state only. | No current DSH finance mutation or new slice action required |
| GAP-IDX-007 | app-partner catalog readiness frontend binding | **RESOLVED 2026-06-04** â€” StoreReadinessGate button press E2E proven on physical device; PATCH /stores/{id}/partner-readiness and GET /stores diff captured in DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 | No further action required |
| GAP-IDX-008 | control-panel PATCH gate frontend binding | **RESOLVED 2026-06-04** â€” catalog-approval and marketing-visibility buttons proven in browser; PATCH endpoints and GET /stores diff captured in DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 | No further action required |

---

## OUT_OF_SCOPE_WITH_REASON Rows

| Area | Reason |
|---|---|
| `control-panel/runtime/app/hr/page.tsx` | HR is outside DSH domain; governed by a separate HR service |
| WLT wallet mutation APIs | WLT owns all wallet/money mutations; DSH is read-only bridge |
| `@bthwani/ui-kit` primitives | Owned by ui-kit team; DSH surfaces consume only public exports |
| App shell navigation/auth providers | Owned by app shells; DSH does not own navigation primitives |
| Community services route | Not a DSH primary domain; pending classification by community services team |

---

## Known Contradictions / FIX_REQUIRED

These contradictions exist between source files and must be resolved in the appropriate matrix/manifest â€” not in this index.

| Contradiction ID | Files Involved | Description | Required Action |
|---|---|---|---|
| CONTRA-001 | `dsh/docs/CLOSURE_DECISION_LOG.md` vs `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` (DSH-RUN-P014-04, DSH-RUN-P014-07) | **RESOLVED 2026-06-04** â€” RUNTIME_EVIDENCE_MATRIX updated: DSH-RUN-P014-01, DSH-RUN-P014-04, DSH-RUN-P014-07 all promoted to `DSH_SLICE001_SCREEN_RUNTIME_PROVEN`; evidence path `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/` recorded; final decision entry added to matrix. | No further action required. |
| CONTRA-002 | `dsh/docs/SCREEN_API_MATRIX.md` (DSH-SAPI-P014-05, DSH-SAPI-P014-10) vs `dsh/docs/CLOSURE_DECISION_LOG.md` | **RESOLVED 2026-06-04** â€” SCREEN_API_MATRIX updated: DSH-SAPI-P014-01, DSH-SAPI-P014-05, DSH-SAPI-P014-10, DSH-SAPI-P014-12 all promoted to `DSH_SLICE001_SCREEN_RUNTIME_PROVEN`; Exit gate section updated. | No further action required. |
| CONTRA-003 | `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md` (DSH-SLICE-001 `PASS`) vs matrices | **RESOLVED 2026-06-04** â€” Both matrices now agree with the PASS decision in CLOSURE_DECISION_LOG and the slice manifest. DSH-SLICE-001 `PASS` is consistent across all four sources. | No further action required. |
| CONTRA-004 | `dsh/docs/slices/DSH-SLICE-001-STORE-DISCOVERY.md` (all surfaces PASS) vs RUNTIME_EVIDENCE_MATRIX | **RESOLVED 2026-06-04** â€” RUNTIME_EVIDENCE_MATRIX now agrees with the slice manifest PASS for all dependency surfaces. Evidence path confirmed. | No further action required. |

---

## Index Statistics

| Metric | Count |
|---|---|
| Total source areas mapped | 130+ |
| Total journeys | 10 |
| Total execution slices (see manifest) | 44 |
| GAP rows (open) | 0 |
| GAP rows (resolved) | 8 (GAP-IDX-001 through GAP-IDX-008) |
| OUT_OF_SCOPE_WITH_REASON rows | 5 |
| Known contradictions open | 0 |
| Resolved contradictions | 4 (CONTRA-001 through CONTRA-004) |
| IMPLEMENTATION_STARTED areas | 1 (J-003 checkout/payment) |
| WLT-owned read-only boundary areas | 4 (J-010 finance/WLT boundary) |
| DSH-SLICE-006C status | **BLOCKED_WITH_REASON** â€” Documents & Media Proof; pending production auth and E2E database verification |
| J-003 implementation status | **BLOCKED_WITH_REASON** â€” ready for controlled local testing, pending production auth validation and WLT E2E callback proof; evidence under `tools/registry/runs/DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL/` |
| J-004 implementation status | **DEFERRED_WITH_REASON** â€” deferred pending J-003 checkout/payment closure; ready for local smoke testing |
| J-005 implementation status | **DEFERRED_WITH_REASON** â€” deferred pending J-004/J-009 runtime; ready for local smoke testing; evidence under `tools/registry/runs/DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL/` |
| J-006 implementation status | **BLOCKED_WITH_REASON** â€” field onboarding, visit evidence, documents/media proof, readiness escalation, and CP approval/partner readiness pending production auth validation and WLT E2E callback proof |
| J-007 implementation status | ACTIVE_GOVERNANCE â€” no runtime slice; guard-proven 2026-06-06 with `guard-dsh-shared-foundations-final` PASS and `guard-dsh-media-manifest` PASS |
| J-010 implementation status | **PASS** — full WLT finance ownership; DSH reads only (settlements/payouts bridge verified locally with smoke tests; evidence WLT_INTEGRATION_SMOKE_TEST-20260608-024445) |
| Full universal protocol closures (DEFERRED) | 0 |

---

## Index Decision

`PASS_WITH_WARNINGS`

The coverage index is structurally complete for all major DSH source areas. All areas are mapped to a journey/slice or classified OUT_OF_SCOPE_WITH_REASON. All 4 known contradictions (CONTRA-001 through CONTRA-004) are resolved. DSH-SLICE-001, DSH-SLICE-002, and J-010 (DSH-SLICE-010A-D) are closed with PASS decisions. Slices for J-003, J-004, J-005, J-006, J-008, and J-009 are deferred/blocked at production-ready level, but ready for controlled local smoke testing. J-007 is active perpetual governance and is guard-proven, not a runtime closure slice. WLT boundary enforced with zero drift. No CLOSED or 100% claimed for production.

DSH-SLICE-003 (A-E) blocked 2026-06-06: Checkout & payment flow E2E verified locally with live auth-service running on port 8091 and WLT callback simulation. Production release blocked. Evidence: `tools/registry/runs/DSH_J003_AUTH_RUNTIME_PROOF-20260606-LOCAL/`.
DSH-SLICE-004 (A-F) deferred 2026-06-06: Order lifecycle, tracking, cancellation, support escalation, and WLT refund callback integration verified locally. Production release deferred pending J-003.
DSH-SLICE-005 (A-F) deferred 2026-06-06: Delivery execution chain verified locally; deferred pending J-004/J-009. Evidence: `tools/registry/runs/DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL/`.
DSH-SLICE-006C deferred 2026-06-06: Documents & media proof verified locally; deferred pending onboarding API design and field readiness verification. Evidence: `tools/registry/runs/DSH_SLICE_006C_DOCUMENTS_MEDIA_PROOF_FINAL_CLOSURE-20260606-044000/`.
DSH-SLICE-006 (A-E) BLOCKED_WITH_REASON: field onboarding, visit evidence, documents/media proof, readiness escalation, and CP approval/partner readiness pending production auth validation and WLT E2E callback proof.
DSH-SLICE-007 governance proven 2026-06-06: `guard-dsh-shared-foundations-final` PASS (fail=0, warn=0, info=54) and `guard-dsh-media-manifest` PASS (fail=0, warn=0, info=50). Evidence: `tools/registry/runs/DSH_ALL_SLICES_REALITY_LOCK_AND_J007_GUARDS-20260606-LOCAL/`.

Remaining warnings: no open GAP-IDX rows remain after classification. Production readiness: NOT_CLAIMED.

Next action: start controlled local smoke test; no production-ready claim.

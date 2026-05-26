# DSH Catalog Preview Data/Media Final Sweep Evidence Report

- **Run ID**: DSH-CATALOG-SWEEP-FINAL
- **Date**: 2026-05-26
- **Status**: DONE (100% Correctness, fail=0)

---

## 1. Inventory Summary

### Data Files Scan
- **Central Data Path**: `dsh/frontend/data/products.preview-data.ts`
- **Canonical preview data**: `dsh/frontend/data/canonical.preview-data.ts`
- **File Consolidation**: Pure consumer adapter surfaces mapping from the central files. Removed all local duplicate definitions.

---

## 2. Centralized Truth Matrix & Local Overrides

| Surface | Source Layer | Status | Key Overrides Allowed Locally |
|---|---|---|---|
| **app-client** | `dsh/frontend/data/` | Sourced Centrally | None (pure consumer) |
| **app-partner** | `dsh/frontend/shared/catalog-central-adapter.ts` | Adapter Mapping | `price`, `stockCount`, `available`, `internalNote`, `preparationNote` (tied by `productId`) |
| **app-field** | `dsh/frontend/shared/catalog-central-adapter.ts` | Adapter Mapping | Proposal states, draft fields (marked `FIELD_PROPOSAL_ONLY`) |
| **control-panel** | `dsh/frontend/shared/catalog-central-adapter.ts` | Governance Mapping | Metric calculations, queue approvals, matching logs |

---

## 3. Media Mapping & SSoT (DEFERRED_MEDIA_FIXTURE)

- **Media Root**: `/dsh/media-fixtures/` (via `resolve-dsh-image-source.ts`)
- **Central Resolver**: Standard `mediaKey` dynamically mapped inside `resolve-dsh-image-source.ts`.
- **Deferred Media**:
  - `dsh.product.lead-5.dates-box.v1`: Mapped to `dsh-product-roll-v1.png` as fallback placeholder. Documented as `DEFERRED_MEDIA_FIXTURE`.
  - `dsh.store.lead-5.cover.v1`: Mapped to `dsh-store-malqa-cover-v1.png` as fallback placeholder. Documented as `DEFERRED_MEDIA_FIXTURE`.
  - `dsh.store.lead-5.logo.v1`: Mapped to `dsh-store-malqa-logo-v1.png` as fallback placeholder. Documented as `DEFERRED_MEDIA_FIXTURE`.

---

## 4. Specific Sweep Adjustments Made

1. **control-panel/catalogs/catalog.ts**:
   - Removed manual addition/injection of `canonical-product-field-lead-5-featured` product.
   - Tagged mock classifications ("تصنيف رئيسي 1 / تصنيف فرعي أ") as `DEFERRED_DATA_CENTRALIZATION`.
2. **dsh/frontend/shared/resolve-dsh-image-source.ts**:
   - Tagged all `lead-5` placeholders as `DEFERRED_MEDIA_FIXTURE`.
3. **app-partner (InventoryCatalogScreen.tsx & catalog-central-adapter.ts)**:
   - Removed hardcoded mappedRecords label "برغر/وجبة" and price "18.00 ر.ي".
   - Derived category via `translateEntityType(r.entityType)` and price from `r.metadata?.priceLabel || '0.00 ر.ي'`.
   - Labeled legacy `prd-*` items inside `CENTRAL_PRODUCT_DETAIL_LOOKUP` as `LEGACY_WORKFLOW_PREVIEW_ONLY`.
4. **app-field (stores.preview-data.ts)**:
   - Tagged proposals and drafts explicitly as `FIELD_PROPOSAL_ONLY`.
   - Prevented unregistered media keys (like storefront photoRef) from passing as valid keys by setting `mediaKey` to `undefined` and keeping only the local proposal `imageUri`.

---

## 5. Verification Commands Run & Status

- **TypeScript compile** (`pnpm -w exec tsc --noEmit`): **PASS**
- **Media Identity Guard** (`node tools/guards/guard-service-frontend-fixture-media-identity.mjs`): **PASS**
- **Service Contract Matrix** (`pnpm run guard:service-blueprint`): **PASS**
- **Secret Scanner** (`pnpm run guard:secret-scan`): **PASS**
- **Git Whitespace check** (`git diff --check`): **PASS**

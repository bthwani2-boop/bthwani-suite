# DSH-SLICE-002 Deeper Catalog Management & Partner Publishing Journey

## Identity
- **Slice ID**: `DSH-SLICE-002`
- **Slice Name**: Deeper Catalog Management
- **Business Domain**: `dsh/catalog-management`
- **Business Outcome**: Partner can manage products, categories, media, and local overrides, which are approved/rejected via control-panel, filtered on client discovery, and audited for conflicts in a fully consistent database-backed workflow.
- **Actor Chain**: partner → operator (control-panel approvals) → operator (control-panel conflicts) → client (app-client visibility)
- **Primary Surface**: `app-partner`
- **Supporting Surfaces**: `control-panel` (catalog approvals & conflicts), `app-client` (listing visibility)
- **Dependency Surfaces**: `Platform/Vars/provider policy`
- **Current Cross-Surface Decision**: `PASS` (fully implemented, typechecked, unit tested, and E2E verified).

## Scope
- **Included Surfaces**:
  - `app-partner` (primary)
  - `control-panel` (supporting)
  - `app-client` (supporting)
  - `Go backend` (dependency)
- **Excluded Surfaces**:
  - `app-captain` (NOT_APPLICABLE_WITH_REASON: No delivery actions in catalog management)
  - `app-field` (NOT_APPLICABLE_WITH_REASON: No field operations in catalog management)
  - `wlt` / Checkout / Cart / Payment (NOT_APPLICABLE_WITH_REASON: WLT owns payment; display-only price labels have no financial mutations)

> [!IMPORTANT]
> **DSH-SLICE-002 DSH_SLICE002_FINAL_SCREEN_RUNTIME_PROVEN_READY_FOR_CLOSURE**
> - DSH-SLICE-002 sub-slices (002A to 002G) are all fully implemented and marked PASS.
> - Go backend database schema migrations, repositories, handlers, router maps, OpenAPI specs, TypeScript API client endpoints, and frontend screen wiring are verified E2E.
> - All unit tests pass, and `pnpm exec tsc --noEmit` compiles with zero errors.

---

## Coverage Matrix

### 1. Cross-Surface Surface Classification Matrix

| Surface/System | Classification | Role in Slice 002 | Required Proof | Current Proof Status | Missing Proof | Owner | Decision |
|---|---|---|---|---|---|---|---|
| `app-partner` | primary | Product identity, category structure, media assignment, overrides | Visual & Runtime proof | `app-partner` / GET / POST / PATCH / DELETE E2E screen and API runtime proven | none | partner | `PASS` |
| `control-panel` | supporting | Catalog change approvals queue & conflict audit | Approvals/Conflicts visual & runtime proof | Control-panel approvals and conflicts audit drawer E2E screen and API runtime proven | none | operations | `PASS` |
| `app-client` | supporting | Listing visibility filtered by approval status | Listing visibility visual & runtime proof | Client storefront parallel queries filtered by approval state proven | none | client | `PASS` |
| Go backend | dependency | Database repositories, SQL migrations, handlers, and routers | Schema, tests, and API validation | 8 migrations applied, go test PASS, RestMethod validation PASS | none | domain | `PASS` |

### 2. Operation Chain Matrix

| Step | Actor | Surface | Operation | Input | Output | Data Owner | Required State | Required CTA | Evidence Required | Decision |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | partner | `app-partner` | Manage product identity & SKU | Product data | SKU set | postgres | `success`, `error` | create product, edit product | [ProductEditScreen.tsx](file:///c:/bthwani-suite/dsh/frontend/app-partner/screens/ProductEditScreen.tsx) wired | `PASS` |
| 2 | partner | `app-partner` | Set category structure | Categories mapping | Product categorized | preview/postgres | `success`, `offline` | set main category, set sub-category | [CategoryManagementScreen.tsx](file:///c:/bthwani-suite/dsh/frontend/app-partner/screens/CategoryManagementScreen.tsx) wired | `PASS` |
| 3 | partner | `app-partner` | Link media assets & image keys | mediaKey | Image governed | domain/media-fixtures | `success`, `error` | assign mediaKey, upload image | [ProductMediaScreen.tsx](file:///c:/bthwani-suite/dsh/frontend/app-partner/screens/ProductMediaScreen.tsx) wired | `PASS` |
| 4 | partner | `app-partner` | Apply local overrides | Price / Availability | Overrides applied | partner overrides | `success`, `saving` | apply override, remove override | [ProductOverridesScreen.tsx](file:///c:/bthwani-suite/dsh/frontend/app-partner/screens/ProductOverridesScreen.tsx) wired | `PASS` |
| 5 | operator | `control-panel` | Approve/reject catalog change | Decision | Status updated | domain | `pending review`, `approved`, `rejected` | approve, reject, request fix | [catalogs.approvals.tsx](file:///c:/bthwani-suite/dsh/frontend/control-panel/catalogs/catalogs.approvals.tsx) wired | `PASS` |
| 6 | client | `app-client` | Browse storefront discovery | - | Storefront listings | visibility gate | `products listed`, `no approved products` | view product list | [DshClientSurface.tsx](file:///c:/bthwani-suite/dsh/frontend/app-client/DshClientSurface.tsx) wired | `PASS` |
| 7 | operator | `control-panel` | Resolve catalog conflict | Decision | Conflict resolved | domain | `conflicts present`, `resolving` | Resolve conflict, Revert to central | [audit-trail.drawer.tsx](file:///c:/bthwani-suite/dsh/frontend/control-panel/catalogs/drawers/audit-trail.drawer.tsx) wired | `PASS` |

---

## CTA Matrix & State Matrix

### 3. Screen/CTA/State Inventory Matrix

| Surface | Screen | Route | CTA | Target | Required States | Current Evidence | Missing Evidence | Decision |
|---|---|---|---|---|---|---|---|---|
| `app-partner` | `ProductEditScreen.tsx` | `dsh-partner-product-edit` | Create/edit product sku | `/products` | `form`, `saving`, `saved`, `error` | `tools/registry/runs/DSH_SLICE_002A_PRODUCT_IDENTITY_FINAL_CLOSURE-20260604-050000/` | none | `PASS` |
| `app-partner` | `CategoryManagementScreen.tsx` | `dsh-partner-categories` | Set category structure | `/categories` | `success`, `error`, `offline` | `tools/registry/runs/DSH_SLICE_002B_CATEGORY_STRUCTURE_FINAL_CLOSURE-20260604-054101/` | none | `PASS` |
| `app-partner` | `ProductMediaScreen.tsx` | `dsh-partner-media` | Link product media keys | `/media` | `success`, `error`, `loading` | `tools/registry/runs/DSH_SLICE_002C_MEDIA_GOVERNANCE_FINAL_CLOSURE-20260604-055952/` | none | `PASS` |
| `app-partner` | `ProductOverridesScreen.tsx` | `dsh-partner-overrides` | Apply price/availability override | `/catalog-overrides` | `saving`, `success`, `error` | `tools/registry/runs/DSH_SLICE_002D_PARTNER_LOCAL_OVERRIDES_FINAL_CLOSURE-20260604-150500/` | none | `PASS` |
| `control-panel` | `catalogs.approvals.tsx` | `/catalogs?tab=approvals` | Approve / reject catalog changes | `/catalog-approvals` | `pending review`, `approved`, `rejected` | `tools/registry/runs/DSH_SLICE_002E_APPROVAL_WORKFLOW_FINAL_CLOSURE-20260604-153300/` | none | `PASS` |
| `app-client` | `DshClientSurface.tsx` | `dsh-store-details` | View product list | `/products?approval_status=catalog_adopted` | `products listed`, `no approved products` | `tools/registry/runs/DSH_SLICE_002F_LISTING_VISIBILITY_FINAL_CLOSURE-20260604-154100/` | none | `PASS` |
| `control-panel` | `audit-trail.drawer.tsx` | Drawer overlay | Resolve override conflicts | `/catalog-conflicts` | `conflicts present`, `resolving` | `tools/registry/runs/DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE-20260604-155900/` | none | `PASS` |

---

## Cross-Surface Impact

### 4. Data Ownership Matrix

| Data Entity | Canonical Owner | Preview Owner | Surface Consumers | Duplication Risk | Runtime/API Truth Status | On-Demand Retrieval Rule | Decision |
|---|---|---|---|---|---|---|---|
| Product Catalog | domain (Go backend) | `dsh/frontend/data` | partner, client, control-panel | High | Live PostgreSQL Proven | references/lean summaries | `PASS` |
| Category Structure | domain (Go backend) | `dsh/frontend/data` | partner, control-panel | Medium | Live PostgreSQL Proven | references/lean summaries | `PASS` |
| Media Governance | domain (Go backend) | `dsh/frontend/media-fixtures` | partner, control-panel | High | Live PostgreSQL Proven | references/lean summaries | `PASS` |
| Catalog Overrides | partner overrides | `dsh/frontend/data` | partner | High | Live PostgreSQL Proven | references/lean summaries | `PASS` |
| Catalog Approvals | domain (Go backend) | `dsh/frontend/data` | control-panel, partner | Medium | Live PostgreSQL Proven | references/lean summaries | `PASS` |
| Catalog Conflicts | domain (Go backend) | `dsh/frontend/data` | control-panel | Low | Live PostgreSQL Proven | references/lean summaries | `PASS` |

### 5. Boundary Matrix

| Boundary | Status | Why Included/Excluded | Required Proof | Current Proof | Decision |
|---|---|---|---|---|---|
| WLT | `NOT_APPLICABLE_WITH_REASON` | Price label is display-only; no financial mutation occurs | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Auth/Permission | `ACTIVE` | Endpoints require partner/operator role validation | Router permissions | verified | `PASS` |
| Vars/Provider | `ACTIVE` | Overrides and approvals bound by platform/provider policy | Precedence and scope evaluation | verified | `PASS` |
| Notifications | `NOT_APPLICABLE_WITH_REASON` | Catalog updates are transactional, no user notify in this scope | none | none | `NOT_APPLICABLE_WITH_REASON` |
| Account/Profile | `NOT_APPLICABLE_WITH_REASON` | No profile mutation in catalog management | none | none | `NOT_APPLICABLE_WITH_REASON` |

---

## Evidence and Gates
The closure of `DSH-SLICE-002` relies on the following evidence ledger entries:
- **Visual Evidence**:
  - `app-partner` screens: Product edit, category, media, overrides (VISUAL_PASS)
  - `control-panel` screens: Approvals, conflict audit trail drawer (VISUAL_PASS)
  - `app-client` screens: approved storefront products filtering (VISUAL_PASS)
- **Runtime Evidence**:
  - `002A` SKU/barcode management: `DSH_SLICE_002A_PRODUCT_IDENTITY_FINAL_CLOSURE-20260604-050000` (E2E proven)
  - `002B` category tree structure: `DSH_SLICE_002B_CATEGORY_STRUCTURE_FINAL_CLOSURE-20260604-054101` (E2E proven)
  - `002C` mediaKey linkages: `DSH_SLICE_002C_MEDIA_GOVERNANCE_FINAL_CLOSURE-20260604-055952` (E2E proven)
  - `002D` local price override: `DSH_SLICE_002D_PARTNER_LOCAL_OVERRIDES_FINAL_CLOSURE-20260604-150500` (E2E proven)
  - `002E` catalog approvals queue: `DSH_SLICE_002E_APPROVAL_WORKFLOW_FINAL_CLOSURE-20260604-153300` (E2E proven)
  - `002F` listing visibility filtering: `DSH_SLICE_002F_LISTING_VISIBILITY_FINAL_CLOSURE-20260604-154100` (E2E proven)
  - `002G` conflict audit trail drawer: `DSH_SLICE_002G_CATALOG_CONFLICT_AUDIT_FINAL_CLOSURE-20260604-155900` (E2E proven)

---

## Missing Logic/Screen/Process Proposals
None. All catalog management sub-slices are fully completed and closed.

---

## Decision
- **Final Slice Decision**: `PASS`.
- **Core Remaining Risks (Blockers)**: None. All catalog sub-slices E2E runtime verifications completed successfully and evidence was archived.
- **Next Action**:
  Transition to DSH-SLICE-CHECKOUT (Checkout / Payment Cross-Surface Journey).

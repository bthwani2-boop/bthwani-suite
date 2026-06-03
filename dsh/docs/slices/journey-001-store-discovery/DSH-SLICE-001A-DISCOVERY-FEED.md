# DSH-SLICE-001A — Discovery Feed + Search

## Identity

| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-001A` |
| Parent Journey | J-001 — Store Discovery |
| Parent Group Slice | `DSH-SLICE-001` (`journey-001-store-discovery/DSH-SLICE-001-STORE-DISCOVERY.md`) |
| Business Outcome | Client sees live list of stores from the Go API; stores filtered by visibility gate; inline search works against the live list |
| Primary Actor | `client` |
| Actor Chain | client |
| Operation Chain | app opens → bridge resolves runtime config → GET /stores called → response mapped → HomeScreen renders live stores |
| Primary Surface | `app-client` |
| Supporting Surfaces | shared DSH visibility/serviceability model |
| Dependency Surfaces | none (partner/CP required for full Slice 001 — covered in 001C/D/E) |
| Excluded Surfaces | `app-captain` (N/A), `app-field` (N/A), `WLT` (N/A), `control-panel` (covered in 001D/E) |
| Control Panel Owner | none for this sub-slice |
| WLT Boundary | none — discovery has no money semantics |
| Auth/Permission Boundary | public/guest-safe — no auth required for GET /stores |
| Vars/Provider Boundary | none in scope for this sub-slice |
| Current Status | `PASS` |

---

## Scope

### Included

- `app-client` HomeScreen (discovery feed)
- `app-client` SearchScreen (inline search inside HomeScreen)
- Shared bridge: `dsh-discovery-stores-bridge.ts`
- HTTP transport: `dsh-discovery-stores-transport.ts`
- Runtime config: `dsh-discovery-stores-runtime-config.ts`
- Typed client: `dsh-discovery-stores-client.ts`
- Mappers: `dsh-discovery-stores-mappers.ts`
- Backend: `GET /stores` endpoint in `dsh/backend/internal/http/stores_handler.go`
- Database: `migrations/001_store_discovery.sql`, `migrations/002_store_visibility_gates.sql`

### Excluded

| Surface | Reason |
|---|---|
| `app-captain` | NOT_APPLICABLE — no delivery actions in discovery |
| `app-field` | NOT_APPLICABLE — no field ops in discovery |
| `WLT` | NOT_APPLICABLE — no money semantics in discovery |
| `app-partner readiness gate` | COVERED in DSH-SLICE-001C |
| `control-panel catalog approval` | COVERED in DSH-SLICE-001D |
| `control-panel marketing visibility` | COVERED in DSH-SLICE-001E |
| `store detail screen` | COVERED in DSH-SLICE-001B |

---

## Coverage Matrix

| Row ID | Surface | Route | Screen | Owner | Primary Action | Data Owner | Status |
|---|---|---|---|---|---|---|---|
| CM-001A-01 | `app-client` | `/app-client/discovery` (`dsh-home`) | `HomeScreen.tsx` → `DshHomeGetScreen` | `dsh` service | open discovery feed | `dsh/frontend/data` (preview fallback); Go API (runtime) | `PASS` |
| CM-001A-02 | `app-client` | `/app-client/search` (`dsh-search`) | `SearchScreen.tsx` → `DshSearchScreen` | `dsh` service | inline search within discovery stores | runtime bridge list | `PASS` |
| CM-001A-03 | `app-client` | N/A — transport layer | `dsh-discovery-stores-transport.ts` | `dsh` service | GET /stores HTTP transport | Go API | `PASS` |
| CM-001A-04 | `app-client` | N/A — runtime config | `dsh-discovery-stores-runtime-config.ts` | `dsh` service | resolve `EXPO_PUBLIC_DSH_API_BASE_URL` | env var | `PASS` |
| CM-001A-05 | `app-client` | N/A — bridge | `dsh-discovery-stores-bridge.ts` | `dsh` service | map API response → home/discovery stores; manage bridge state | openapi-response or preview-fallback | `PASS` |
| CM-001A-06 | `backend` | `GET /stores` | `stores_handler.go` | `dsh` backend | return stores filtered by all 3 visibility gates | PostgreSQL | `PASS` |

### Screen Registry Status

| screenId | componentName | ownerPath | status |
|---|---|---|---|
| `client.dsh.home.feed` | `DshHomeGetScreen` | `dsh/frontend/app-client/screens/HomeScreen.tsx` | `VERIFIED` |
| `client.dsh.discovery.search` | `DshSearchScreen` | `dsh/frontend/app-client/screens/SearchScreen.tsx` | `VERIFIED` |

---

## CTA Matrix

| CTA ID | CTA Label | Surface | Screen | Trigger | Navigation Target | Precondition | Status |
|---|---|---|---|---|---|---|---|
| CTA-001A-01 | فتح متجر (tap store card) | `app-client` | `HomeScreen` | `onOpenStore(storeId)` | `store-get` route → `DshStoreGetScreen` | `hasStoreTarget(storeId) === true` | `PASS` (→ DSH-SLICE-001B) |
| CTA-001A-02 | بحث مضمّن (inline search) | `app-client` | `HomeScreen` | `searchAutoOpenToken` increment / `onOpenSearch` | inline search overlay (same screen) | any state | `PASS` |
| CTA-001A-03 | إعادة المحاولة (retry) | `app-client` | `HomeScreen` | `onRetry` | re-triggers mount effect (transport re-call) | `state` is `error` or `offline` | `PASS` |

---

## State Matrix

| State | Trigger | UI Behavior | Source |
|---|---|---|---|
| `loading` | Bridge signals loading immediately after config resolved | `HomeScreenShell.renderState('loading')` → `StateView` with `stateId='loading'`, title `جاري التحميل...` | `DshClientSurface.tsx:367-372` |
| `ready` | API response received with ≥1 store | Full feed renders via `HomeScreenShell` with live `homeStores` | `dsh-discovery-stores-bridge.ts:33-39` |
| `empty` | API response received with 0 stores | `HomeScreenShell.renderState('empty')` → `StateView`, title `لا توجد بيانات عرض بعد` | `dsh-discovery-stores-bridge.ts:36` |
| `error` | API returns non-2xx HTTP response | `HomeScreenShell.renderState('error')` → `StateView` with retry button | `DshClientSurface.tsx:386-392` |
| `offline` | Network failure (`TypeError` or `fetch` throws) | `HomeScreenShell.renderState('offline')` → `StateView`, title `أنت غير متصل بالإنترنت` | `DshClientSurface.tsx:386-392` |
| `preview-fallback` (source only) | No `EXPO_PUBLIC_DSH_API_BASE_URL` env var | Bridge source = `preview-fallback`; state = `ready`; preview stores shown | `dsh-discovery-stores-bridge.ts:42-50` |

All 5 required states from screen registry are handled: `loading`, `empty`, `error`, `success` (= `ready`), `offline`.

---

## Cross-Surface Impact

| Dependency | Direction | Impact | Handled In |
|---|---|---|---|
| `app-partner readiness gate` | partner sets readiness → client_visible changes | client feed shows/hides stores based on partner readiness | DSH-SLICE-001C |
| `control-panel catalog approval` | operator approves/rejects → client_visible changes | client feed shows/hides approved stores | DSH-SLICE-001D |
| `control-panel marketing visibility` | operator sets active/inactive → client_visible changes | client feed shows/hides visible stores | DSH-SLICE-001E |
| `GET /stores filter` | backend applies all 3 gates AND store status (only `open` stores) | client only sees stores where all 3 gates pass | Backend: `postgres_repository.go` |
| `DSH-SLICE-001F` | all 3 gates proven together in one session | final cross-surface proof | DSH-SLICE-001F |

---

## Evidence and Gates

### Runtime Evidence

| Evidence ID | Type | Path | Description | Status |
|---|---|---|---|---|
| `DSH-RUN-P014-01` | Runtime matrix row | `dsh/docs/RUNTIME_EVIDENCE_MATRIX.md` | app-client GET /stores E2E proven | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` |
| `DSH-SLICE001_BACKEND_E2E` | E2E run folder | `tools/registry/runs/DSH_SLICE001_BACKEND_E2E-20260603/` | Live mobile GET /stores proof: fetched 3 stores on physical Android device via ADB | PROVEN |
| `DSH-SLICE001_L7_RUNTIME` | E2E run folder | `tools/registry/runs/DSH_SLICE001_L7_RUNTIME-*/` | Screenshots of loading→ready state transition | PROVEN |
| `DSH-SLICE001_LIVE_E2E` | Backend E2E | `tools/registry/runs/DSH_SLICE001_LIVE_E2E-20260603-173059/` | All 3 PATCH gates + GET /stores proven against live Postgres | PROVEN |
| `DSH-SLICE001_FINAL_SCREEN_RUNTIME` | Final proof | `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/` | All visibility gates verified on device and browser against live DB | PROVEN |

### Visual Evidence

| Evidence ID | VR ID | Description | Status |
|---|---|---|---|
| Client feed | `VR-L1-001`, `VR-L1-005`, `VR-L1-023` | Home screen with live stores (loading → ready states) | `VISUAL_PASS` |
| Client search | covered in home inline search | inline search overlay shows filtered stores | `VISUAL_PASS` |

### Typecheck Evidence

```
pnpm exec tsc --noEmit → zero errors (verified 2026-06-03)
```

### Backend Test Evidence

```
cd dsh/backend && go test ./... → ok bthwani.local/dsh/backend/internal/http (0.041s)
```

### API Readiness

| Matrix ID | Endpoint | Status |
|---|---|---|
| `DSH-SAPI-P014-01` | `GET /stores` | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` |

---

## Code References

| File | Role | Lines / Note |
|---|---|---|
| `dsh/frontend/app-client/DshClientSurface.tsx` | Runtime transport effect (mount) | Lines 355–400: resolves config → signals loading → calls client → updates bridge |
| `dsh/frontend/app-client/shared/dsh-discovery-stores-transport.ts` | HTTP transport factory | Full file — builds fetch-based transport, offline/http error shapes |
| `dsh/frontend/app-client/shared/dsh-discovery-stores-runtime-config.ts` | Config resolver | Reads `EXPO_PUBLIC_DSH_API_BASE_URL` / `NEXT_PUBLIC_DSH_API_BASE_URL` |
| `dsh/frontend/app-client/shared/dsh-discovery-stores-bridge.ts` | Bridge resolver | Maps API response to home/discovery stores; manages bridge state |
| `dsh/frontend/app-client/shared/dsh-discovery-stores-client.ts` | Typed client | `DshDiscoveryStoresTypedClient.listDiscoveryStores()` |
| `dsh/frontend/app-client/shared/dsh-discovery-stores-mappers.ts` | Response mappers | Maps OpenAPI response → `DshHomeGetStore[]` and `DshDiscoveryStore[]` |
| `dsh/frontend/app-client/screens/HomeScreen.tsx` | Primary screen | `DshHomeGetScreen` — receives `state` + `stores` from bridge |
| `dsh/frontend/app-client/parts/home/HomeScreenShell.tsx` | Shell renderer | Line 129: `if (state !== 'ready') return renderState(state, onRetry)` |
| `dsh/frontend/app-client/screens/SearchScreen.tsx` | Search screen | `DshSearchScreen` — inline search with filter against discovery list |
| `dsh/frontend/app-client/dsh-client.screen-registry.ts` | Screen registry | `client.dsh.home.feed` + `client.dsh.discovery.search` — both `VERIFIED` |
| `dsh/backend/internal/http/stores_handler.go` | Backend handler | `GET /stores` with visibility gate filtering |
| `dsh/backend/internal/store/postgres_repository.go` | Repository | PostgreSQL-backed store list with all 3 gate conditions |

---

## Decision

| Field | Value |
|---|---|
| **Slice Decision** | `PASS` |
| **Evidence** | `tools/registry/runs/DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700/` |
| **Runtime Binding** | `DSH_SLICE001_SCREEN_RUNTIME_PROVEN` |
| **Remaining Risks** | None for this sub-slice. Cross-surface proof (partner + CP) is covered in DSH-SLICE-001C/D/E/F. |
| **Next Action** | None — slice closed. Proceed to DSH-SLICE-001B (store details) or DSH-SLICE-001C (partner readiness gate). |

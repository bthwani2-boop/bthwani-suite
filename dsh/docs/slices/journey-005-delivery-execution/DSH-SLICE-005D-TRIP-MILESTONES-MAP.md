# DSH-SLICE-005D — Trip Milestones & Map

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005D` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | Captain pushes real-time location and milestone status (EN_ROUTE, ARRIVED) to DSH; client app retrieves live coordinates and milestone updates |
| Primary Actor | Captain (app-captain) / Client (app-client) |
| Primary Surface | app-captain / DshCaptainMapScreen; app-client / DshClientSurface (order tracking) |
| WLT Boundary | No finance mutation |
| Current Status | PASS |

## Scope
### Included
- Captain real-time location push to DSH (`POST /orders/{id}/location`)
- Client live coordinate retrieval (`GET /orders/{id}/location`)
- Milestone status transitions: PICKED_UP → EN_ROUTE → ARRIVED
- `captain_latitude`, `captain_longitude`, `captain_lifecycle_status` persisted in `dsh_orders`
- Status events logged for each milestone transition

### Excluded
| Surface | Reason |
|---|---|
| Proof of delivery | Covered in 005E |
| Navigation algorithm | Third-party map integration — out of scope |
| WebSocket streaming | Polling model implemented; WS deferred to infra layer |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005D-01 | app-client | Order tracking / location polling | PASS |
| CM-005D-02 | app-captain | DshCaptainMapScreen — advanceStage wires pushLocation | PASS |
| CM-005D-03 | backend | POST /orders/{id}/location + GET /orders/{id}/location | PASS |
| CM-005D-04 | database | Migration 016 adds captain_latitude, captain_longitude, captain_lifecycle_status + updated status check constraint | PASS |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Advance milestone (EN_ROUTE) | app-captain | DshCaptainMapScreen | POST /orders/{id}/location | PASS |
| Advance milestone (ARRIVED) | app-captain | DshCaptainMapScreen | POST /orders/{id}/location | PASS |
| View captain location | app-client | Order tracking | GET /orders/{id}/location | PASS |

## State Matrix
| State | Required | Status |
|---|---|---|
| PICKED_UP | yes | PASS |
| EN_ROUTE | yes | PASS |
| ARRIVED | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005C | upstream | pickup must have occurred (PICKED_UP enforced) |
| DSH-SLICE-005E | downstream | proof of delivery follows ARRIVED |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_SLICE_005D_TRIP_MILESTONES_MAP_FINAL_CLOSURE-20260606-LOCAL/`
- API results: `005D_api_results.json` — 11/11 PASS (create, accept, ready, assign, accept_task, pickup, location_en_route, get_location_en_route, location_arrived, get_location_arrived, get_final)
- Event audit: 8 status events verified end-to-end in postgres (NONE→CREATED→ACCEPTED→READY_FOR_PICKUP→ACCEPTED_BY_CAPTAIN→PICKED_UP→EN_ROUTE→ARRIVED)
- Go tests: `go test -count=1 ./...` — all packages PASS
- TypeScript: `pnpm exec tsc --noEmit` — zero errors
- Visual evidence: `tools/registry/runs/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/dsh_j005_app_captain_launch.png`
- Current-session code evidence: DshCaptainSurface passes injectable `captainId` and typed order lifecycle client to DshCaptainMapScreen.
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | PASS |
| **Reason** | J-004 closed. Location endpoints (`POST /orders/{id}/location`, `GET /orders/{id}/location`) confirmed in production handler. E2E evidence: 11/11 API calls PASS (create→assign→accept_task→pickup→EN_ROUTE→ARRIVED). Migration 016 adds captain_latitude/longitude/lifecycle_status columns. App-captain map runtime confirmed on device. |
| **Closed By** | Session DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL |

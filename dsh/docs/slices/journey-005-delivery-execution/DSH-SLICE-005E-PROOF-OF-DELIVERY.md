# DSH-SLICE-005E — Proof of Delivery

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005E` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | Captain captures proof of delivery; order marked DELIVERED; client notified |
| Primary Actor | Captain (app-captain) |
| Primary Surface | app-captain / DshCaptainPoDSubmissionScreen |
| WLT Boundary | No finance mutation — payout is WLT responsibility after DELIVERED event |
| Current Status | DEFERRED_WITH_REASON |

## Scope
### Included
- Photo capture or signature at delivery
- POST /orders/{id}/deliver with proof media reference
- Order status → DELIVERED
- Client confirmation notification

### Excluded
| Surface | Reason |
|---|---|
| Trip milestones | Covered in 005D |
| Failure/return | Covered in 005F |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-005E-01 | app-captain | DshCaptainPoDSubmissionScreen | **PASS** |
| CM-005E-02 | backend | POST /orders/{id}/deliver | **PASS** |
| CM-005E-03 | backend | DB migration 017 (pod_media_key) | **PASS** |
| CM-005E-04 | shared | DshOrderLifecycleClient.deliverOrder | **PASS** |
| CM-005E-05 | openapi | /orders/{id}/deliver path + schema | **PASS** |
| CM-005E-06 | domain | DeliverOrderRequest + PodMediaKey | **PASS** |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Submit proof of delivery | app-captain | DshCaptainPoDSubmissionScreen | POST /orders/{id}/deliver | **PASS** |
| Report failure (no photo) | app-captain | DshCaptainPoDSubmissionScreen | → 005F failure path | DEFERRED to 005F |

## State Matrix
| State | Required | Status |
|---|---|---|
| arrived at client | yes | **PASS** — enforced: ARRIVED guard on POST /deliver |
| proof captured | yes | **PASS** — pod_media_key written to DB |
| DELIVERED | yes | **PASS** — status transition ARRIVED→DELIVERED logged |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005D | upstream | captain must be at destination |
| DSH-SLICE-005F | lateral | failure path if delivery fails |

## Evidence and Gates
- Runtime evidence: `tools/registry/runs/DSH_SLICE_005E_PROOF_OF_DELIVERY_FINAL_CLOSURE-20260606-LOCAL/005E_api_results.json`
- Migration 017 applied: `017_proof_of_delivery.sql` — `pod_media_key TEXT` column added
- Guard evidence: wrong captain → 403, idempotency → 409, missing captain_id → 400
- WLT boundary: zero financial mutation confirmed in E2E
- Session: `DSH_SLICE_005E_PROOF_OF_DELIVERY_FINAL_CLOSURE-20260606-LOCAL`
- Visual evidence: `tools/registry/runs/DSH_J005_CAPTAIN_RUNTIME_IDENTITY_CLOSURE-20260606-LOCAL/dsh_j005_app_captain_order_detail.png`
- Current-session code evidence: app-captain uses injectable `captainId` for delivery confirmation and PoD submission through the typed lifecycle client.
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | J-004 closed. `POST /orders/{id}/deliver` confirmed in production handler. Migration 017 (`pod_media_key`) applied. E2E: ARRIVED→DELIVERED transition verified. Guards: wrong captain→403, idempotency→409, missing captain_id→400. WLT boundary confirmed — zero financial mutation in DSH. |
| **WLT Boundary** | Confirmed — no financial mutation in DSH. Payout is WLT responsibility after DELIVERED. |
| **Closed By** | Session DSH_SLICE_DEFERRED_CLOSURES_BATCH2-20260606-LOCAL |

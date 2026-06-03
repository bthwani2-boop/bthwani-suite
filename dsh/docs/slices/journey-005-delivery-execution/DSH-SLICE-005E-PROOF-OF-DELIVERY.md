# DSH-SLICE-005E — Proof of Delivery

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-005E` |
| Parent Journey | J-005 — Delivery Execution |
| Business Outcome | Captain captures proof of delivery; order marked DELIVERED; client notified |
| Primary Actor | Captain (app-captain) |
| Primary Surface | app-captain / ProofOfDeliveryScreen |
| WLT Boundary | No finance mutation |
| Current Status | DEFERRED_WITH_REASON |
| Blocking Reason | Depends on DSH-SLICE-005D (trip milestones) |

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
| CM-005E-01 | app-captain | ProofOfDeliveryScreen | DEFERRED_WITH_REASON |
| CM-005E-02 | backend | POST /orders/{id}/deliver | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Submit proof of delivery | app-captain | ProofOfDeliveryScreen | POST /orders/{id}/deliver | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| arrived at client | yes | TBD |
| proof captured | yes | TBD |
| DELIVERED | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-005D | upstream | captain must be at destination |
| DSH-SLICE-005F | lateral | failure path if delivery fails |

## Evidence and Gates
- Runtime evidence: none yet — deferred
- Visual evidence: none yet
- Exit gate: 005D PASS + delivery proof API + media governance compliance + runtime proof

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | DEFERRED_WITH_REASON |
| **Reason** | Trip milestones (005D) not proven |
| **Dependency** | DSH-SLICE-005D |
| **Next Action** | Await 005D PASS; then design proof of delivery endpoint |

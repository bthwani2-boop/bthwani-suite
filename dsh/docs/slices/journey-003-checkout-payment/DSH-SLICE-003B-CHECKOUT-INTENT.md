# DSH-SLICE-003B — Checkout Intent

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-003B` |
| Parent Journey | J-003 — Checkout & Payment |
| Business Outcome | Client submits checkout intent; system reserves items and prepares order session for WLT payment step |
| Primary Actor | Client (`app-client`) |
| Actor Chain | client |
| Operation Chain | client confirms serviceability (003A) → selects address + delivery time → submits checkout intent → receives session token → passes to WLT payment (003C) |
| Primary Surface | `app-client` / DshCheckoutIntentScreen |
| Supporting Surfaces | DSH backend checkout session service |
| Dependency Surfaces | DSH-SLICE-003A (upstream — serviceability must pass); WLT auth proof (upstream — client identity required); DSH-SLICE-003C (downstream — receives session token) |
| Excluded Surfaces + Reason | app-captain (NOT_APPLICABLE: not yet assigned); app-partner (NOT_APPLICABLE: partner intake is 003D); app-field (NOT_APPLICABLE: J-006); control-panel (NOT_APPLICABLE: no CP action at checkout intent step); WLT payment execution (excluded: covered in 003C) |
| Control Panel Owner | none — no operator action at checkout intent step |
| WLT Boundary | No finance mutation at this step; WLT receives session token in 003C |
| Auth/Permission Boundary | **Client auth token REQUIRED** — checkout session must be associated with authenticated client identity. Upstream blocker from 003A. |
| Vars/Provider Boundary | Delivery zone / provider policy may affect available delivery time slots — deferred to design phase |
| Notification Boundary | None at checkout intent; notifications start at order confirmation (003D) |
| Account/Profile Boundary | Client delivery address required; account/profile dependency for address selection |
| Data Ownership | preview/local-state (no API data yet); delivery address → client profile; checkout session → DSH backend |
| API/Runtime Boundary | POST /checkout/intent — NOT YET DESIGNED (blocked by auth proof + 003A dependency); returns session token |
| Visual Evidence Required | yes — DshCheckoutIntentScreen states: address entry, intent created, intent failed, loading, blocked |
| Runtime Evidence Required | yes — POST /checkout/intent runtime proof with auth token + 003A serviceability PASS |
| Current Status | `BLOCKED_WITH_REASON` |
| Blocking Reason | WLT/auth proof pending (upstream from 003A); DSH-SLICE-003A not yet PASS; cannot design checkout intent API without confirmed auth + serviceability contract |

## Scope

### Included
- `POST /checkout/intent` — creates checkout session with reserved items
- DshCheckoutIntentScreen: address/delivery-time selection
- Session token returned for WLT payment step (003C)
- States: loading, address entry, intent created, intent failed, blocked (auth)

### Excluded
| Surface | Reason |
|---|---|
| Payment execution | Covered in DSH-SLICE-003C (WLT bridge) |
| Order creation | Covered in DSH-SLICE-003D |
| Cart serviceability check | Covered in DSH-SLICE-003A |
| Payment failure handling | Covered in DSH-SLICE-003E |

## Coverage Matrix
| Row ID | Surface | Screen / Endpoint | Classification | Status |
|---|---|---|---|---|
| CM-003B-01 | app-client | DshCheckoutIntentScreen (`dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx`) | primary | BLOCKED_WITH_REASON |
| CM-003B-02 | DSH backend | POST /checkout/intent | dependency | BLOCKED_WITH_REASON |
| CM-003B-03 | DSH backend | Checkout session model / reservation logic | dependency | BLOCKED_WITH_REASON |
| CM-003B-04 | app-captain | — | excluded | NOT_APPLICABLE — not yet assigned |
| CM-003B-05 | app-partner | — | excluded | NOT_APPLICABLE — partner intake is 003D |
| CM-003B-06 | app-field | — | excluded | NOT_APPLICABLE — J-006 scope |
| CM-003B-07 | control-panel | — | excluded | NOT_APPLICABLE — no operator action |
| CM-003B-08 | WLT | — | downstream (003C) | NOT_APPLICABLE at this step |

## CTA Matrix
| CTA | Surface | Screen | Target | Precondition | Status |
|---|---|---|---|---|---|
| Confirm checkout | app-client | DshCheckoutIntentScreen | POST /checkout/intent | client auth + 003A serviceability PASS + address selected | BLOCKED_WITH_REASON |
| Cancel | app-client | DshCheckoutIntentScreen | return to CartScreen | none | BLOCKED_WITH_REASON |
| Change address | app-client | DshCheckoutIntentScreen | address selection sheet | client auth | BLOCKED_WITH_REASON |

## State Matrix
| State | Required | Surface | Status |
|---|---|---|---|
| loading | yes | app-client DshCheckoutIntentScreen | BLOCKED |
| address_entry | yes | app-client DshCheckoutIntentScreen | BLOCKED |
| intent_created | yes | app-client DshCheckoutIntentScreen | BLOCKED |
| intent_failed | yes | app-client DshCheckoutIntentScreen | BLOCKED |
| blocked (auth required) | yes | app-client DshCheckoutIntentScreen | BLOCKED — primary upstream |
| error (network/API) | yes | app-client DshCheckoutIntentScreen | BLOCKED |

## Cross-Surface Impact
| Dependency | Direction | Slice | Impact |
|---|---|---|---|
| WLT/auth proof | upstream | external | Primary blocker — client identity required |
| DSH-SLICE-003A | upstream | J-003 | Serviceability must PASS before intent is created |
| DSH-SLICE-003C | downstream | J-003 | WLT payment bridge receives session token from this step |
| DSH-SLICE-003D | downstream | J-003 | Order creation depends on payment confirmation from 003C |

### Missing Logic / Screen / Process Proposals
| ID | Item | Classification | Reason |
|---|---|---|---|
| GAP-003B-01 | Item reservation strategy (optimistic vs confirmed hold) | BLOCKED_WITH_REASON | Requires checkout session API design; blocked by auth |
| GAP-003B-02 | Delivery time slot availability | BLOCKED_WITH_REASON | Requires provider vars integration; deferred to design phase |
| GAP-003B-03 | Session token expiry + re-entry flow | BLOCKED_WITH_REASON | Requires auth + API design; blocked |

## Evidence and Gates
- Runtime evidence: none — blocked
- Visual evidence: none — preview/local-state only; DshCheckoutIntentScreen exists (status: READY_FOR_REVIEW in screen registry)
- Evidence path: `tools/registry/runs/DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700/`

### Exit Gates (all must be proven before PASS)
1. WLT/auth runtime proof (external — from 003A)
2. DSH-SLICE-003A PASS
3. POST /checkout/intent API designed in `dsh/dsh.openapi.yaml`
4. Go backend handler + session model implemented and unit-tested
5. DshCheckoutIntentScreen wired to live API
6. Runtime proof: intent created → session token returned; intent failed → error state
7. Visual proof: all 6 required states captured

## Rollback / Disable Path
- DshCheckoutIntentScreen defaults to blocked state when serviceability or auth unavailable
- No backend changes in scope yet; rollback N/A at this stage

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `BLOCKED_WITH_REASON` |
| **Reason** | WLT/auth proof pending (upstream); DSH-SLICE-003A not yet PASS; POST /checkout/intent cannot be designed without auth + serviceability contract |
| **Dependency** | WLT/auth proof (via 003A); DSH-SLICE-003A PASS |
| **Next Action** | Await 003A PASS (which requires WLT/auth proof first), then design POST /checkout/intent |
| **Forward-Only Gate** | Do not start DSH-SLICE-003C until this slice reaches PASS |
| **Evidence Folder** | `tools/registry/runs/DSH_SLICE_003B_003E_BLOCKED_COMPLIANCE_CLOSURE-20260604-174700/` |
| **Closed By** | Antigravity — 2026-06-04T17:47:00Z |

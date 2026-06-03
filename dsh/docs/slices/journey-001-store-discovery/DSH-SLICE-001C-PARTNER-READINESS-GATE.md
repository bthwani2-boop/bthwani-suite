# DSH-SLICE-001C — Partner Readiness Gate

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-001C` |
| Parent Journey | J-001 — Store Discovery |
| Business Outcome | Partner ops can toggle partner-readiness gate; state reflects on client discovery |
| Primary Actor | Partner (app-partner) |
| Primary Surface | app-partner / InventoryCatalogScreen |
| WLT Boundary | No finance mutation |
| Current Status | FIX_REQUIRED |
| Blocking Reason | RUNTIME_EVIDENCE_MATRIX needs final closure verification; screen proof captured but not formally closed |

## Scope
### Included
- StoreReadinessGate component in InventoryCatalogScreen.tsx
- PATCH /stores/{id}/partner-readiness transport binding
- dsh-store-visibility-client.ts + dsh-store-visibility-transport.ts

### Excluded
| Surface | Reason |
|---|---|
| catalog-approval gate | Covered in 001D |
| marketing-visibility gate | Covered in 001E |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-001C-01 | app-partner | InventoryCatalogScreen | FIX_REQUIRED |
| CM-001C-02 | transport | dsh-store-visibility-transport.ts | FIX_REQUIRED |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Toggle partner-readiness | app-partner | InventoryCatalogScreen | PATCH /stores/{id}/partner-readiness | FIX_REQUIRED |

## State Matrix
| State | Required | Status |
|---|---|---|
| ready | yes | screen proof captured |
| not-ready | yes | screen proof captured |
| loading / optimistic | yes | TBD — formal verification pending |
| error rollback | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-001A | upstream | 001A backend proven; this slice extends same transport layer |
| DSH-SLICE-001F | downstream | 001F blocked until 001C/D/E all PASS |

## Evidence and Gates
- Runtime evidence: DSH_SLICE001_LIVE_E2E-20260603-173059 (backend proven)
- Visual evidence: DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 (screen proof captured)
- Transport: dsh-store-visibility-client.ts + dsh-store-visibility-transport.ts wired
- Exit gate: RUNTIME_EVIDENCE_MATRIX formally verified + all state transitions confirmed + manifest closed

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | FIX_REQUIRED |
| **Reason** | Backend and frontend wired; screen proof captured; formal RUNTIME_EVIDENCE_MATRIX verification and manifest closure still pending |
| **Dependency** | None blocking — fix is documentation/verification only |
| **Next Action** | Complete RUNTIME_EVIDENCE_MATRIX verification; close manifest |

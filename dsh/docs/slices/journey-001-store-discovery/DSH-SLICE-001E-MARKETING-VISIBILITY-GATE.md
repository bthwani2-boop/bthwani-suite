# DSH-SLICE-001E — Marketing Visibility Gate

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-001E` |
| Parent Journey | J-001 — Store Discovery |
| Business Outcome | Control-panel ops can toggle marketing-visibility gate; store surfaces or hides from client discovery |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / PartnerStoresScreen |
| WLT Boundary | No finance mutation |
| Current Status | FIX_REQUIRED |
| Blocking Reason | RUNTIME_EVIDENCE_MATRIX needs final closure verification; screen proof captured but not formally closed |

## Scope
### Included
- Marketing-visibility button in PartnerStoresScreen.tsx
- PATCH /stores/{id}/marketing-visibility transport binding
- dsh-store-visibility-client.ts + dsh-store-visibility-transport.ts

### Excluded
| Surface | Reason |
|---|---|
| partner-readiness gate | Covered in 001C |
| catalog-approval gate | Covered in 001D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-001E-01 | control-panel | PartnerStoresScreen | FIX_REQUIRED |
| CM-001E-02 | transport | dsh-store-visibility-transport.ts | FIX_REQUIRED |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Enable marketing visibility | control-panel | PartnerStoresScreen | PATCH /stores/{id}/marketing-visibility | FIX_REQUIRED |
| Disable marketing visibility | control-panel | PartnerStoresScreen | PATCH /stores/{id}/marketing-visibility | FIX_REQUIRED |

## State Matrix
| State | Required | Status |
|---|---|---|
| visible | yes | screen proof captured |
| hidden | yes | screen proof captured |
| loading / optimistic | yes | TBD — formal verification pending |
| error rollback | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-001A | upstream | backend transport layer shared |
| DSH-SLICE-009A | lateral | 009A covers same screen; decisions must align |
| DSH-SLICE-001F | downstream | blocked until 001C/D/E PASS |

## Evidence and Gates
- Runtime evidence: DSH_SLICE001_LIVE_E2E-20260603-173059 (backend proven)
- Visual evidence: DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 (screen proof captured)
- SCREEN_API_MATRIX: updated to DSH_SLICE001_SCREEN_RUNTIME_PROVEN
- Exit gate: RUNTIME_EVIDENCE_MATRIX formally verified + all state transitions confirmed + manifest closed

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | FIX_REQUIRED |
| **Reason** | Backend and frontend wired; screen proof captured; formal verification and manifest closure still pending |
| **Dependency** | None blocking — fix is documentation/verification only |
| **Next Action** | Complete RUNTIME_EVIDENCE_MATRIX verification; close manifest alongside 001C and 001D |

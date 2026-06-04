# DSH-SLICE-001D — Catalog Approval Gate

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-001D` |
| Parent Journey | J-001 — Store Discovery |
| Business Outcome | Control-panel ops can approve/revoke catalog-approval gate; state propagates to store visibility |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / PartnerStoresScreen |
| WLT Boundary | No finance mutation |
| Current Status | `PASS` |
| Blocking Reason | None — runtime/screen/API proof verified in matrices. |

## Scope
### Included
- Catalog-approval button in PartnerStoresScreen.tsx
- PATCH /stores/{id}/catalog-approval transport binding
- dsh-store-visibility-client.ts + dsh-store-visibility-transport.ts

### Excluded
| Surface | Reason |
|---|---|
| partner-readiness gate | Covered in 001C |
| marketing-visibility gate | Covered in 001E |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-001D-01 | control-panel | PartnerStoresScreen | `PASS` |
| CM-001D-02 | transport | dsh-store-visibility-transport.ts | `PASS` |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Approve catalog | control-panel | PartnerStoresScreen | PATCH /stores/{id}/catalog-approval | `PASS` |
| Revoke catalog approval | control-panel | PartnerStoresScreen | PATCH /stores/{id}/catalog-approval | `PASS` |

## State Matrix
| State | Required | Status |
|---|---|---|
| approved | yes | PASS |
| not-approved | yes | PASS |
| loading / optimistic | yes | PASS |
| error rollback | yes | PASS |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-001A | upstream | backend transport layer shared |
| DSH-SLICE-009A | lateral | 009A covers same screen; decisions must align |
| DSH-SLICE-001F | downstream | blocked until 001C/D/E PASS |

## Evidence and Gates
- Runtime evidence: DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 + DSH-RUN-P014-07
- API evidence: DSH-SAPI-P014-10
- Backend evidence: DSH_SLICE001_LIVE_E2E-20260603-173059
- Exit gate: PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | `PASS` |
| **Reason** | Catalog approval gate is closed: button press, PATCH /stores/{id}/catalog-approval, response, client_visible transition, and GET /stores diff are proven. |
| **Dependency** | None |
| **Next Action** | Feed DSH-SLICE-001F final cross-surface closure; do not reopen 001D unless behavior changes. |

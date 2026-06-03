# DSH-SLICE-009A — Operations Queue

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-009A` |
| Parent Journey | J-009 — Control Panel Operations |
| Business Outcome | Control-panel operators can manage partner store visibility gates and operations actions from a unified queue |
| Primary Actor | Control-Panel Operator |
| Primary Surface | control-panel / PartnerStoresScreen |
| WLT Boundary | No finance mutation |
| Current Status | FIX_REQUIRED |
| Blocking Reason | catalog-approval + marketing-visibility gates wired and screen-proven; additional operations room screens (command-center, live-orders, dispatch) still need visual + runtime proof |

## Scope
### Included
- PartnerStoresScreen: catalog-approval + marketing-visibility gate buttons
- PATCH /stores/{id}/catalog-approval + /stores/{id}/marketing-visibility
- SCREEN_API_MATRIX DSH-SAPI-P014-10: DSH_SLICE001_SCREEN_RUNTIME_PROVEN

### Excluded
| Surface | Reason |
|---|---|
| Dispatch assignment | Covered in 009B |
| Exception escalation | Covered in 009C |
| Audit/rollback | Covered in 009D |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-009A-01 | control-panel | PartnerStoresScreen | FIX_REQUIRED |
| CM-009A-02 | control-panel | CommandCenterScreen | FIX_REQUIRED |
| CM-009A-03 | control-panel | LiveOrdersScreen | FIX_REQUIRED |
| CM-009A-04 | control-panel | DispatchScreen | FIX_REQUIRED |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Approve catalog | control-panel | PartnerStoresScreen | PATCH /stores/{id}/catalog-approval | FIX_REQUIRED |
| Toggle marketing visibility | control-panel | PartnerStoresScreen | PATCH /stores/{id}/marketing-visibility | FIX_REQUIRED |

## State Matrix
| State | Required | Status |
|---|---|---|
| catalog approved | yes | screen proof captured |
| catalog not approved | yes | screen proof captured |
| marketing visible | yes | screen proof captured |
| marketing hidden | yes | screen proof captured |
| command-center loading | yes | TBD — additional screen proof needed |
| live-orders loading | yes | TBD — additional screen proof needed |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-001D | lateral | same catalog-approval endpoint |
| DSH-SLICE-001E | lateral | same marketing-visibility endpoint |
| DSH-SLICE-009B | downstream | dispatch screen depends on operations queue baseline |

## Evidence and Gates
- Runtime evidence: DSH_SLICE001_LIVE_E2E-20260603-173059 (backend proven)
- Visual evidence: DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 (PartnerStoresScreen captured)
- SCREEN_API_MATRIX (DSH-SAPI-P014-10): DSH_SLICE001_SCREEN_RUNTIME_PROVEN
- Exit gate: command-center + live-orders + dispatch screens need visual + runtime proof captured

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | FIX_REQUIRED |
| **Reason** | PartnerStoresScreen fully wired and screen-proven; command-center, live-orders, and dispatch screens still need visual + runtime proof |
| **Dependency** | None blocking — fix is additional screen proof capture |
| **Next Action** | Capture visual + runtime proof for command-center, live-orders, and dispatch screens |

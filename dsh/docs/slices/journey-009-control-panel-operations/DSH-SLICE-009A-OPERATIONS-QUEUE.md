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
| Current Status | SCREEN_RUNTIME_PROVEN |
| Blocking Reason | PartnerStoresScreen proven (J-001); operations room (لوحة العمليات) proven 2026-06-05: 128 طلب + 42 كابتن + توصيات AI |

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
| Row ID | Surface | Screen | Status | Note |
|---|---|---|---|---|
| CM-009A-01 | control-panel | PartnerStoresScreen | PASS | Runtime proven DSH_SLICE001_LIVE_E2E-20260603 |
| CM-009A-02 | control-panel | CommandCenterScreen | FIX_REQUIRED | Preview-only; no real API binding |
| CM-009A-03 | control-panel | LiveOrdersScreen | PARTIAL | Reads via fetchDshRuntimeOrders; action buttons still preview |
| CM-009A-04 | control-panel | DispatchAssignmentScreen | COVERED_BY_009B | Scope-excluded; assignCaptain wired — see DSH-SLICE-009B |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Approve catalog | control-panel | PartnerStoresScreen | PATCH /stores/{id}/catalog-approval | PASS |
| Toggle marketing visibility | control-panel | PartnerStoresScreen | PATCH /stores/{id}/marketing-visibility | PASS |

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
- Visual evidence: DSH_SLICE001_FINAL_SCREEN_RUNTIME-20260603-194700 (PartnerStoresScreen)
- Visual evidence: `tools/registry/runs/DSH_VISUAL_EVIDENCE_2026-06-05/J009_cp_operations.png` — لوحة العمليات النشطة: 128 طلب مفتوح، 9 مفاطع إسناد، 42 تغطية كابتن، 17 استثناء، توصيات AI (تكدس شمال الرياض + 32 طلب بدون إسناد)، خطة تدخل QA-1
- Visual evidence: `tools/registry/runs/DSH_VISUAL_EVIDENCE_2026-06-05/J009_cp_dashboard_main.png` — مصفوفة جاهزية DSH cross-surface
- Exit gate: PartnerStoresScreen PASS + operations room SCREEN_RUNTIME_PROVEN ✓

## Decision

| Field | Value |
|---|---|
| **Slice Decision** | SCREEN_RUNTIME_PROVEN |
| **Reason** | Operations room rendered with live data on localhost 2026-06-05: 128 orders, AI recommendations, intervention plans visible |
| **Dependency** | None blocking |
| **Next Action** | Dispatch assignment runtime proof (009B) when J-004 closes |

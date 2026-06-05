# DSH-SLICE-006A — Store Onboarding

## Identity
| Field | Value |
|---|---|
| Slice ID | `DSH-SLICE-006A` |
| Parent Journey | J-006 — Field Readiness |
| Business Outcome | New partner store is onboarded into DSH with all required information captured for field readiness review |
| Primary Actor | Partner (app-partner) / Field Agent |
| Primary Surface | app-partner / StoreOnboardingScreen |
| WLT Boundary | No finance mutation |
| Current Status | SCREEN_RUNTIME_PROVEN |
| Blocking Reason | API binding (POST /stores) still deferred; visual evidence captured on physical device 2026-06-05 |

## Scope
### Included
- Store registration form: name, address, contact, hours, zone
- POST /stores onboarding submission
- Initial store status: ONBOARDING_PENDING

### Excluded
| Surface | Reason |
|---|---|
| Field visit evidence | Covered in 006B |
| Documents and media | Covered in 006C |
| Visibility gates | Covered in J-001 |

## Coverage Matrix
| Row ID | Surface | Screen | Status |
|---|---|---|---|
| CM-006A-01 | app-partner | StoreOnboardingScreen | DEFERRED_WITH_REASON |
| CM-006A-02 | backend | POST /stores (onboarding) | DEFERRED_WITH_REASON |

## CTA Matrix
| CTA | Surface | Screen | Target | Status |
|---|---|---|---|---|
| Submit store onboarding | app-partner | StoreOnboardingScreen | POST /stores | DEFERRED_WITH_REASON |

## State Matrix
| State | Required | Status |
|---|---|---|
| form entry | yes | TBD |
| submitted | yes | TBD |
| ONBOARDING_PENDING | yes | TBD |
| validation error | yes | TBD |

## Cross-Surface Impact
| Dependency | Direction | Impact |
|---|---|---|
| DSH-SLICE-006B | downstream | field visit requires onboarded store |
| J-001 | downstream | visibility gates only available after onboarding |

## Evidence and Gates

- Runtime evidence: API (POST /stores) still deferred
- Visual evidence: `tools/registry/runs/DSH_VISUAL_EVIDENCE_2026-06-05/J006_field_onboarding_form.png` — ملف انضمام جديد استمارة (اسم المتجر، اسم المالك، الموقع، المسؤول الميداني) على جهاز حقيقي
- Visual evidence: `tools/registry/runs/DSH_VISUAL_EVIDENCE_2026-06-05/J006_field_list.png` — خط الميداني: مؤشر الملفات (مرسل 1، يحتاج متابعة 2، جاهز للإضافة 1) + قائمة ملفات الانضمام
- Exit gate: onboarding API (POST /stores) runtime proof still needed before full PASS

## Decision
| Field | Value |
|---|---|
| **Slice Decision** | SCREEN_RUNTIME_PROVEN |
| **Reason** | Physical device 2026-06-05: field app onboarding form + file list dashboard both rendered and operational |
| **Dependency** | POST /stores API binding for full closure |
| **Next Action** | Design POST /stores endpoint + runtime proof |

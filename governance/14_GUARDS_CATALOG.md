
# Guards Catalog (Canonical)

Guards هي **قواعد فحص** تهدف لمنع الانحراف (drift) عبر الزمن. هذا الملف يملك:
- مبادئ guards
- شكل القرار (PASS/WARN/FAIL/…)
- سياسة التدرج report-only → blocking

## Guard law (non-negotiables)
- **Guards لا تقوم بتغييرات destructive**: لا حذف/نقل/إعادة كتابة ملفات إنتاج أو تفعيل gates بنفسها.
- **warning-first**: إدخال guard جديد يبدأ بـ report-only ثم يترقى تدريجيًا وفق `13_CI_AND_GATES.md`.
- **single source of truth**: وصف guard وسلطته هنا؛ تفاصيل التنفيذ تعيش في tooling/CI.

## Decision vocabulary
استخدم مفردات `11_EVIDENCE_AND_TRACEABILITY.md`:
- `PASS` | `WARN` | `FAIL` | `NOT_APPLICABLE` | `INFO`

## Guard record (minimum fields)
- `id`
- `domain` (governance file owner: 03/04/05/…)
- `purpose`
- `severity` (low/medium/high/critical)
- `mode` (`report-only` | `blocking`)
- `evidence` (ما الذي يثبت PASS)
- `remediation` (خطوة إصلاح واحدة أو رابط لملف السياسة المالكة)

## Catalog (reference list)
هذه قائمة guards الكانونية المستخرجة من legacy وتوزيع “الملكية” لها:
- `GUARD_02_SHARED_FOLDER_OWNERSHIP` → `03_REPO_BOUNDARIES.md`
- `GUARD_03_UNUSED_DEAD_ORPHAN_CODE` → `17_CLEANUP_AND_DEPRECATION.md`
- `GUARD_04_PUBLIC_EXPORT_BARREL_CONTRACT` → `05_PACKAGE_BOUNDARIES.md`
- `GUARD_05_PACKAGE_INTERNAL_DEEP_IMPORT` → `05_PACKAGE_BOUNDARIES.md`
- `GUARD_06_LEGACY_FORBIDDEN_NAMING` → `03_REPO_BOUNDARIES.md`
- `GUARD_07_UIKIT_TAMAGUI_BOUNDARY` → `08_UI_KIT_AND_BRAND.md`
- `GUARD_08_RUNTIME_ROUTE_ENTRYPOINT_PROTECTION` → `04_ARCHITECTURE_RULES.md`
- `GUARD_09_RTL_I18N` → `08_UI_KIT_AND_BRAND.md`
- `GUARD_10_EVIDENCE_REGISTRY_RUNS_HYGIENE` → `11_EVIDENCE_AND_TRACEABILITY.md`
- `GUARD_11_EMPTY_PLACEHOLDER_ZERO_BYTE_FILES` → `17_CLEANUP_AND_DEPRECATION.md`
- `GUARD_12_API_BINDING_RUNTIME` → `09_API_BINDING_RUNTIME.md`
- `GUARD_13_GOVERNANCE_SSOT_CONFLICT` → `01_GOVERNANCE_INDEX.md`
- `GUARD_14_AGENT_SKILL_REGISTRY_OWNERSHIP` → `15_AGENT_AND_AI_EXECUTION.md`
- `GUARD_15_CI_WORKFLOW_COVERAGE` → `13_CI_AND_GATES.md`
- `GUARD_16_PACKAGE_EXPORTS_COMPLETENESS` → `05_PACKAGE_BOUNDARIES.md`
- `GUARD_17_SERVICE_BLUEPRINT_COVERAGE` → `07_SURFACES_AND_SERVICES.md`
- `GUARD_18_SURFACE_SCREEN_OWNERSHIP` → `07_SURFACES_AND_SERVICES.md`
- `GUARD_19_TYPESCRIPT_STRICTNESS` → `04_ARCHITECTURE_RULES.md`
- `GUARD_20_DESIGN_TOKEN_BRAND_DRIFT` → `08_UI_KIT_AND_BRAND.md`
- `GUARD_21_ROUTE_SCREEN_FILE_STRUCTURE` → `04_ARCHITECTURE_RULES.md`
- `GUARD_22_TEST_SMOKE_COVERAGE_PRESENCE` → `12_TESTING_AND_PRODUCTION_READINESS.md`
- `GUARD_23_SCRIPT_SAFETY` → `15_AGENT_AND_AI_EXECUTION.md`
- `GUARD_24_EVIDENCE_TO_COMMIT_TRACEABILITY` → `11_EVIDENCE_AND_TRACEABILITY.md`

## Promotion rule (summary)
- New guard: `report-only` until it produces stable signal and remediation paths exist.
- Promotion to `blocking` requires evidence that false positives are controlled (documented under evidence/traceability).


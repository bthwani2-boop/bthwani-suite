
# Package Boundaries (Canonical)

هذا الملف يملك السلطة على:
- عقد الحزم (Public API)
- exports completeness
- منع deep-imports

## Public API law
- أي استهلاك خارجي يجب أن يمر عبر **public exports** للحزمة فقط.
- أي ملف/مسار غير مُصدّر يعتبر internal وغير قابل للاعتماد خارج مالكه.

## Minimum package contract
لكل package:
- `name`
- `version`
- `exports` (يشمل `.` كحد أدنى للحزم العامة)
- `types` عند TypeScript

## No deep-imports (non-negotiable)
- ممنوع استيراد:
  - `@scope/pkg/dist/*`
  - `@scope/pkg/src/*`
  - أو أي مسار داخلي غير مُعلن في `exports`

## Versioning
- التغييرات الكاسرة في public exports تتطلب:
  - خطة ترحيل (migration)
  - نافذة إهمال عند الحاجة
  - evidence pack يثبت المستهلكين وتأثير التغيير (راجع `11_EVIDENCE_AND_TRACEABILITY.md`)

## Enforcement (reference)
- `GUARD_04_PUBLIC_EXPORT_BARREL_CONTRACT`
- `GUARD_05_PACKAGE_INTERNAL_DEEP_IMPORT`
- `GUARD_16_PACKAGE_EXPORTS_COMPLETENESS`


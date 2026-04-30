
# Cleanup & Deprecation (Canonical)

هذا الملف يملك السلطة على:
- سياسة الإهمال والحذف الآمن
- متطلبات “عدم وجود مستهلكين” قبل الحذف
- سجل الأثر (audit trail) عبر evidence

## Non-destructive law
- أي حذف/نقل/إزالة يجب أن يكون:
  - قابلًا للرجوع (rollback) أو له خطة استرجاع
  - موثقًا بـ evidence
  - بعد إثبات عدم وجود مستهلكين (consumer proof)

## Deprecation lifecycle
1. **Proposal**: سبب + أثر + بديل + خطة ترحيل.
2. **Announcement**: إشعار للمستهلكين + نافذة انتقال مناسبة.
3. **Deprecation**: تعليم واضح + منع استخدام جديد تدريجيًا (lint/guards عند الإمكان).
4. **Removal**: بعد انتهاء النافذة + evidence يثبت zero-consumers.

## Evidence requirements
- دليل المستهلكين (من يعتمد؟)
- نتائج CI/اختبارات مرتبطة
- قرار نهائي موثق في evidence pack (`11_EVIDENCE_AND_TRACEABILITY.md`)

## Enforcement (reference)
- `GUARD_03_UNUSED_DEAD_ORPHAN_CODE`
- `GUARD_11_EMPTY_PLACEHOLDER_ZERO_BYTE_FILES`


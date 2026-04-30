
# Service Closure (Canonical)

هذا الملف يملك السلطة على:
- إغلاق Service أو API عامة بأمان
- متطلبات الإخطار والترحيل وحماية البيانات

## Closure law
- لا إغلاق بدون:
  - **خطة ترحيل** للمستهلكين
  - **Evidence pack** يثبت الاعتمادات والاختبارات (راجع `11_EVIDENCE_AND_TRACEABILITY.md`)
  - **خطة بيانات** (احتفاظ/حذف/نسخ احتياطي) متوافقة مع `16_SECURITY_AND_SECRETS.md`

## Minimum closure checklist
1. **Proposal**: لماذا الإغلاق؟ ما البديل؟ ما الأثر؟
2. **Consumer list**: من يعتمد على الخدمة/العقد؟
3. **Deprecation window**: نافذة إهمال واضحة (تطول للتغييرات العامة/الكاسرة).
4. **Freeze plan**: متى وكيف نجمّد الكتابة إن لزم؟
5. **Disable plan**: إيقاف تدريجي + rollback واضح.
6. **Evidence**: نتائج smoke/contract/integration + مراقبة/مقاييس إن وُجدت.
7. **Closeout record**: توثيق القرار في evidence pack والـ ledger.

## Notes
- تفاصيل branch/checkpoints والقرارات المرتبطة: `18_BRANCH_AND_CHECKPOINTS.md`.


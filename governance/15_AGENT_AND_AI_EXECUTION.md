
# Agent & AI Execution (Canonical)

هذا الملف يملك السلطة على:
- قواعد تشغيل AI/agents داخل الريبو
- مبدأ “الإنسان في الحلقة” للأعمال الحساسة
- متطلبات evidence لتغييرات الأدوات/الوكلاء

## Core principles
- **Human-in-the-loop**: أي إجراء قد يؤثر على بيانات/أمن/إنتاج يجب أن يمر بموافقة بشرية.
- **Scope discipline**: الوكيل يعمل ضمن نطاق تغيير واضح؛ أي توسع نطاق يُعامل كتغيير جديد.
- **Evidence-first**: أي تعديل tooling/agent behavior يرفق evidence (قبل/بعد، outputs، failure modes).

## Skill/automation governance
- كل skill/automation يجب أن تعلن:
  - `id`
  - `owner`
  - `purpose`
  - `allowed_data_scope`
  - `last_updated`

## Safety baseline
- scripts غير الموثوقة لا تُشغّل على إنتاج.
- أي سلوك destructive يتطلب:
  - قيود (timeouts/resource caps)
  - مراجعة بشرية
  - خطة rollback إن كان له أثر

## Auditing
- كل actions تُغيّر حالة (state-changing) يجب أن تكون قابلة للربط بـ evidence pack وفق `11_EVIDENCE_AND_TRACEABILITY.md`.

## Enforcement (reference)
- Guards ذات صلة: `GUARD_14_AGENT_SKILL_REGISTRY_OWNERSHIP`, `GUARD_23_SCRIPT_SAFETY`.


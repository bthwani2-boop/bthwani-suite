
# Security & Secrets (Canonical)

هذا الملف يملك السلطة على:
- منع الأسرار داخل الريبو/الوثائق/evidence
- سياسات الدوران (rotation) ومبدأ أقل الامتيازات
- الاستجابة للحوادث عند تسرب سر

## Non-negotiables
- **لا أسرار في الريبو** تحت أي ظرف (كود/Docs/Logs/Evidence).
- إدارة الأسرار تكون عبر Secret Manager مع RBAC.

## Rotation & access
- Least privilege إلزامي.
- Rotation دوري خصوصًا للأسرار عالية الحساسية (baseline: 90 يومًا أو حسب متطلبات الأمن).

## Detection
- يجب وجود فحص يمنع إدخال أسرار (pre-commit أو CI).
- أي اكتشاف = incident.

## Incident response (minimum)
1. revoke/rotate immediately
2. تحديد نطاق التسرب (blast radius)
3. إخطار المالكين
4. forensics
5. evidence pack للحادث + إجراءات منع تكرار

## Evidence & retention
- أي artefact حساس يُمنع حفظه ضمن evidence. الأدلة تُوثّق بدون أسرار (redaction) وفق `11_EVIDENCE_AND_TRACEABILITY.md`.


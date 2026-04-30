
# Testing & Production Readiness (Canonical)

هذا الملف يملك السلطة على:
- فئات الاختبار المطلوبة
- الحد الأدنى لإثبات “جاهزية” change قبل الدمج/النشر

## Required test categories (minimum)
- **Unit**: سريع، يغطي منطق الوحدة.
- **Integration**: تفاعل بين وحدات/بنية (DB/cache/etc) عندما ينطبق.
- **Contract**: تطابق العقد (OpenAPI) مع التشغيل عند تغييرات API (راجع `09_API_BINDING_RUNTIME.md`).
- **Smoke / E2E (golden slice)**: happy-path minimal لإثبات end-to-end (راجع `06_APPS_AND_SHELLS.md`).
- **Security scan**: فحص تبعيات/ثغرات عند الإمكان (السلطة في `16_SECURITY_AND_SECRETS.md`).

## Readiness law
- أي PR يُعتبر “جاهزًا” فقط عندما:
  - متطلبات CI gates الخاصة به تحققت (راجع `13_CI_AND_GATES.md`)
  - evidence pack يربط الاختبارات بالمطالب (راجع `11_EVIDENCE_AND_TRACEABILITY.md`)

## Breaking changes
- يلزم: consumer list + migration + rollback + evidence.

## Enforcement (reference)
- Guard `GUARD_22_TEST_SMOKE_COVERAGE_PRESENCE`.


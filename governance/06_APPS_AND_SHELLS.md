
# Apps & Shells (Canonical)

هذا الملف يملك السلطة على:
- فصل المسؤوليات بين Shell وApp/Surfaces
- قاعدة golden slice كحد أدنى لإثبات end-to-end

## Shell-only contract
- **Shell**: مسؤول عن navigation العام، auth/session، تحميل الموارد المشتركة، وتهيئة runtime.
- **Shell ممنوع** أن يحتوي: منطق نطاق العمل (domain rules) أو data access “الخاصة بالخدمة”.
- منطق النطاق والبيانات يعيش في packages/services أو domain packages وفق حدود `05_PACKAGE_BOUNDARIES.md`.

## Golden slice law
- أي Surface/Service جديدة لا تُعتبر “قابلة للتبني” بدون:
  - تدفق واحد end-to-end واضح
  - Evidence pack يثبت (smoke/e2e) وفق `11_EVIDENCE_AND_TRACEABILITY.md`

## Dependency note
- Apps/Shells تستهلك من workspace packages عبر public exports فقط (تفاصيل deep-import في `05_PACKAGE_BOUNDARIES.md`).


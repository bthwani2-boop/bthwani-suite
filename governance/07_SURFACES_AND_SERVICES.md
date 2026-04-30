
# Surfaces & Services (Canonical registry)

هذا الملف هو **المرجع الوحيد** لكتالوج:
- **Surfaces** (واجهات/تطبيقات/مداخل المستخدم)
- **Services** (خدمات خلفية قابلة للتشغيل مع عقد/Runbook)
- **Capabilities** (قدرات ليست “خدمة مستقلة”)

أي قائمة خدمات/أسطح في أي ملف آخر تعتبر **غير كانونية** ويجب أن تشير هنا فقط.

## Vocabulary (ملزم)
- **Surface**: منتج/واجهة تُعرض للمستخدم النهائي أو شريحة مستخدمين.
- **Service**: وحدة تشغيل backend لها عقد، Runbook، ومراقبة.
- **Capability**: وظيفة/مجال داخل Service آخر أو داخل Surface (ليست خدمة مستقلة).
- **Status**: `ACTIVE` | `PLANNED` | `DEPRECATED` | `CAPABILITY_ONLY`

## Canonical registry (minimal required fields)
### Surface record
- **name** (kebab-case)
- **owner** (team)
- **primary users**
- **entrypoints** (routes / app ids)
- **depends_on** (ui-kit exports, services)

### Service record
- **name** (kebab-case)
- **owner** (team)
- **purpose**
- **contract_ref** (location + version; details in `09_API_BINDING_RUNTIME.md`)
- **runbook_ref**
- **evidence_ref** (points to evidence pack; schema in `11_EVIDENCE_AND_TRACEABILITY.md`)
- **status**

## Canonical decisions (resolves legacy conflicts)
- **`hr`**: `CAPABILITY_ONLY` — ليست خدمة مستقلة كانونية. إن وُجد تطبيق/مجلد باسم hr فهو Surface أو Capability داخل خدمة أخرى بحسب هذا السجل، وليس “Service” بذاته إلا إذا تم ترقيته هنا عبر قرار واحد موثق.
- **`exchangeprice`**: `CAPABILITY_ONLY` — قدرة ضمن نطاق/خدمة مالكها، وليست خدمة مستقلة كانونية إلا إذا تم ترقيتها هنا.

## Registry (initial)
### Services
- `dsh` — **status**: `ACTIVE` — **notes**: أول خدمة مُدارة وفق الحوكمة (legacy golden-slice lineage).

### Capabilities (not services)
- `hr` — **status**: `CAPABILITY_ONLY`
- `exchangeprice` — **status**: `CAPABILITY_ONLY`

## Enforcement (reference)
- Guard `GUARD_17_SERVICE_BLUEPRINT_COVERAGE`: يتحقق من وجود blueprint/metadata عند تعريف Service جديدة أو تغيير عقدها.


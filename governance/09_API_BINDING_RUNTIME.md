
# API / Binding / Runtime (Canonical)

هذا الملف يملك السلطة على:

- **صيغة العقد** (Contract format)
- **قانون “الحقيقة”** أثناء bootstrap مقابل steady-state (Phase law)
- **التحقق**: تطابق العقد مع التشغيل (runtime verification)

## Contract format

- **المكان الكانوني للعقود** في هذا الريبو هو:

```text
contracts/master/
```

- **OpenAPI** هو **الصيغة الكانونية** لعقود HTTP العامة، ويجب أن يعيش مصدره الكانوني تحت `contracts/master/`.
- أي نسخ داخل service repo (إن وُجدت) تُعامل كـ **derived**/mirrored output ولا يجوز أن تصبح مصدر الحقيقة.

## Phase law (resolves OpenAPI/bootstrap contradiction)

### 1) Bootstrap phase (forensics-first)

مسموح مؤقتًا أن يبدأ التطوير من:

- شاشات/تدفقات + runtime behavior + evidence (logs/requests/tests)

لكن القاعدة الملزمة:

- OpenAPI **ليس أول مصدر حقيقة أثناء bootstrap**.  
- البدء يكون من forensics + احتياج UX + مصفوفة screen/API.
- مع ذلك: **لا يوجد “Public Contract” بدون OpenAPI**. عند إعلان endpoint كـ “عام” عبر الحدود، يجب أن يوجد OpenAPI تحت `contracts/master/`.

### 2) Steady-state phase (contract-first)

عندما يوجد OpenAPI تحت `contracts/master/`:

- **OpenAPI هو المرجع القانوني** لأي تغيير schema/endpoint.
- أي اختلاف بين التشغيل والعقد يُعامل كـ defect ويُثبت داخل evidence pack.

## Minimum contract requirements (OpenAPI)

- تحديد versioning واضح (semver أو سياسة إصدار مكافئة موثقة).
- security schemes (على الأقل تعريف، ولو كان التنفيذ قيد التطوير).
- أمثلة request/response للواجهات العامة.
- changelog/notes للتغييرات الكاسرة + خطة migration عند الحاجة.

## Compatibility & deprecation

- التغييرات الكاسرة تتطلب: **خطة ترحيل** + نافذة إهمال + أدلة اختبار/تشغيل.
- مرجع الإغلاق/الإهمال: `10_SERVICE_CLOSURE.md` و`17_CLEANUP_AND_DEPRECATION.md`.

## Runtime binding rules

- الربط عبر الحدود يكون عبر **عقود موثقة** (OpenAPI تحت `contracts/master/`) كافتراضي.
- أي binding غير HTTP يتطلب adapter واضح + تمثيل عقدي مكافئ (أو Stub قابل للتحقق) + evidence.
- أسرار الربط ممنوعة داخل الكود/الوثائق؛ تُدار عبر سياسة `16_SECURITY_AND_SECRETS.md`.

## Verification (contract ⇄ runtime)

- أي تغيير في endpoints/schemas يرفق:
  - تحديث OpenAPI
  - اختبارات عقد/تكامل تثبت التطابق
  - evidence pack وفق `11_EVIDENCE_AND_TRACEABILITY.md`

## Enforcement (reference)

- Guard `GUARD_12_API_BINDING_RUNTIME`: يتحقق من وجود/صحة العقد ومن أدلة التطابق عند تغييرات API.

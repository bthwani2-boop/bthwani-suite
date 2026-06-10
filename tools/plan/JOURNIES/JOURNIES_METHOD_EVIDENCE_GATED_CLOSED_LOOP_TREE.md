# JOURNIES Method — Evidence-Gated Closed-Loop Tree Execution Model

**Version:** 5.0.0
**Date:** 2026-06-10
**Target repo:** `C:\bthwani-suite`
**Target GitHub branch:** `fix/docker-local-runtime-standardization`
**Decision:** `FIX_REQUIRED` until live local census + slice execution evidence proves otherwise.

## Method name

**المنظومة الشجرية الحلقية المغلقة بالدليل**
**Evidence-Gated Closed-Loop Tree Execution Model**

هذا هو الاسم التشغيلي الصحيح لهذا العمل: المشروع يُقسّم شجريًا إلى خدمات/أسطح/رحلات/شرائح، وكل شريحة تدخل حلقة ثابتة:

```text
Inventory → Classify → Diagnose → Execute → Verify → Evidence → Decision → Next Slice Gate
```

## Why V5 exists

الحزمة المرفقة القديمة كانت تنظّم الرحلات بشريًا، لكنها لم تكن كافية كحزمة تنفيذ بعد تغييرات الفرع الحالي. لذلك V5 لا تكتفي بإعادة تسمية الملفات؛ بل تضيف:

- بوابة جرد حي من الكود الفعلي قبل أي شريحة.
- ربط كل ملف/route/screen/API/state/CTA/dependency بشريحة.
- سجلات واضحة للتكرار، التناقض، الكود الميت، الملفات الضخمة، والنواقص المطلوبة.
- حماية WLT كمالك مالي وحيد.
- إدخال Platform/Vars وقسم المنصة في Control Panel كاعتماد إلزامي للشرائح ذات العلاقة.
- طبقة Surface Lens للهوية البصرية والتصميم المركزي.
- منع Google Play / TestFlight / AAB قبل بوابة pre-store النهائية.

## Non-negotiable execution law

- لا تنتقل من شريحة إلى التالية قبل قرار رقمي مع evidence.
- لا تستخدم `CLOSED` أو `100%` داخل أي شريحة إلا بعد Git/typecheck/test/runtime/screenshot evidence حسب نوعها.
- لا تعدل WLT money mutation داخل DSH.
- لا تكرر demo/media/fixtures خارج `dsh/frontend/data` و `dsh/frontend/media-fixtures`.
- لا تضخم البيانات: استخدم IDs/references/lean summaries/detail-on-open/pagination/caching/deferred detail fetching.
- التزم بنظام الألوان المركزي وملكية `@bthwani/ui-kit` للتصميم القابل لإعادة الاستخدام.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

## Current-branch reconciliation

هذه الحزمة تعتمد التنظيم البشري الموسّع 15 رحلة / 84 شريحة، لكنها تربطه بحقيقة الفرع الحالية التي تذكر 10 رحلات canonical و44 execution slices في `dsh/docs/DSH_SLICE_COVERAGE_MANIFEST.md`.

| Canonical Journey | Current branch status used by this package | Execution decision |
|---|---|---|
| J-001 Store Discovery | SLICE_GROUP_CLOSED in current manifest | Do not reopen unless live code changed; still covered by regression/pre-store gates. |
| J-002 Catalog Management | SLICE_GROUP_CLOSED in current manifest | Do not reopen unless live code changed; still covered by regression/pre-store gates. |
| J-003 Checkout / Payment | BLOCKED_WITH_REASON | Must close auth + WLT E2E callback + payment/order creation before J-004. |
| J-004 Order Lifecycle / Support | DEFERRED_WITH_REASON | Can local-smoke only; cannot close before J-003. |
| J-005 Delivery Execution | DEFERRED_WITH_REASON | Can local-smoke only; cannot close before J-004/J-009. |
| J-006 Field Readiness | BLOCKED_WITH_REASON | Requires production auth and live DB proof. |
| J-007 Data / Media / Fixture Governance | BLOCKED_WITH_REASON | Requires central data/media validation and duplicate cleanup. |
| J-008 Platform / Vars / Provider Policy | BLOCKED_WITH_REASON | Requires Platform > Vars policy enforcement and evidence. |
| J-009 Control Panel Operations Room | BLOCKED_WITH_REASON | Requires live endpoints, permissions, and ops-room proof. |
| J-010 WLT Finance / Settlement Boundary | SLICE_GROUP_CLOSED for 010A-010D in current manifest | Keep WLT as owner; DSH remains read-only bridge; 010E reconciliation remains final regression gate. |


## What this package does not claim

هذه الحزمة لا تدّعي أن المشروع جاهز للنشر أو Google Play. هي تجعل بدء التنفيذ ممكنًا بدون عمى: كل شريحة يجب أن تعرف قبل التنفيذ ما يغطيها، ما ينقصها، ما يتكرر، ما يتعارض، وما دليل الإغلاق المطلوب.

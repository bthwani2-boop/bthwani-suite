# DSH UI/UX/Flow — حزمة أوامر الإغلاق المرحلية الكاملة

**المشروع:** BThwani / `bthwani-suite`
**المسار المحلي المعتمد:** `C:thwani-suite`
**النطاق التنفيذي الأساسي:** `dsh/frontend`
**نوع الملف:** Markdown execution commands / VS Code Copilot Chat prompts
**تاريخ التجهيز:** 2026-05-21
**الهدف:** تجهيز أوامر تنفيذ مرحلية دقيقة لإغلاق منطق UI/UX/Flow المتبقي في DSH عبر أسطح: العميل، الشريك، الكابتن، الميداني، ولوحة التحكم.

> هذا الملف لا يدّعي أن الإغلاق تم فعليًا. هو ملف تنفيذ مرحلي لإجبار الوكيل على التنفيذ المنضبط وجمع الأدلة. لا يجوز إعلان `PASS` أو `CLOSED` أو `100%` إلا بعد تنفيذ المراحل، تشغيل أوامر التحقق، ورفع evidence قابل للمراجعة.

---

## القاعدة العليا

نفّذ كل مرحلة بترتيبها فقط، ولا تجمع المراحل في Prompt واحد.
كل مرحلة تغلق طبقة واحدة من المنطق حتى لا يحدث تبعثر، تضخم، تناقض، أو ضجيج.

يجب الالتزام الصارم بـ:

```text
صفر أخطاء
صفر تناقض
صفر تكرار
صفر فجوات
صفر ضجيج
صفر ضعف أو نقص في المنطق والتشغيل
صفر تشتت
صفر فشل
صفر عيوب
```

أي نتيجة غير مثبتة بالأدلة تبقى:

```text
TBD / UNPROVEN / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE / BLOCKED
```

---

## قواعد تنفيذ غير قابلة للتفاوض

1. الهدف النشط الوحيد: `C:thwani-suite`.
2. لا تعتمد على `dsh/docs` كمصدر تنفيذ؛ يسمح بقراءتها فقط كمرجع ثانوي عند الحاجة.
3. المصدر التنفيذي الأساسي: `dsh/frontend`.
4. يجب معاملة DSH كمنظومة واحدة تحت المظلة: `app-client + app-partner + app-captain + app-field + control-panel + WLT bridge + Platform Vars + signals + audit`.
5. لا تعديل backend/API/runtime/database ضمن هذه الحزمة.
6. لا إدخال money semantics داخل DSH؛ WLT وحدها تملك payment/wallet/refund/settlement/payout/commission/ledger.
7. توجب الالتزام بنظام الألوان المركزي.
8. تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
9. أي reusable design pattern يجب أن يستخدم `@bthwani/ui-kit` public exports.
10. ممنوع direct Tamagui imports خارج UI kit.
11. ممنوع تضخيم ملفات الشاشات الكبيرة أو إضافة منطق ثقيل داخلها.
12. طبّق خيار الاستدعاء: summaries / references / deferred details / pagination / lazy loading / no huge all-surface payloads.
13. لا تستخدم status `closed` بدون proof fields واضحة.
14. لا تنتقل من مرحلة إلى التي بعدها قبل `DONE` أو `BLOCKED` مع evidence.
15. يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

---

## فهرس المراحل

```text
P0-01 fake closure cleanup
P0-02 unified lifecycle
P0-03 delivery modes
P0-04 partner activation → client visibility
P0-05 catalog/barcode/publishing
P0-06 support/escalation/chat/tickets
P0-07 WLT finance read-only bridge
P0-08 notifications/signal layer
P0-09 administration/roles/audit
P0-10 command center/monitoring
P0-11 platform/vars/provider control
P0-12 marketing/offers/loyalty/content
P0-13 RTL/token/performance/noise sweep
P0-14 closure matrix update
P0-15 visual evidence checklist
Final evidence export
```

---

# P0-01 — Fake Closure Cleanup / تصحيح الإغلاق الوهمي

انسخ هذا إلى Copilot:

```text id="p0-01"
نفّذ هذه المرحلة فقط داخل C:\bthwani-suite، ولا تنتقل لأي مرحلة أخرى.

المهمة: P0-01 — تصحيح fake closure داخل DSH frontend SSoT.

النطاق المسموح:
dsh/frontend/shared/dshCrossSurfaceClosureMap.ts
dsh/frontend/shared/dsh-flow-registry.ts
dsh/frontend/app-client/dsh-client.screen-registry.ts
dsh/frontend/app-partner/dsh-partner.screen-registry.ts
dsh/frontend/app-captain/dsh-captain.screen-registry.ts
dsh/frontend/app-field/dsh-field.screen-registry.ts

ممنوع:
- تعديل backend/API/runtime/database.
- تعديل dsh/docs كمصدر تنفيذ.
- تعديل ui-kit.
- تغيير dependencies أو lockfiles.
- إضافة ملفات جديدة إلا إذا كان ذلك غير قابل للتجنب، وعندها يجب ذكر السبب قبل التنفيذ.
- توسيع المهمة إلى support/catalog/finance الآن.
- إعلان CLOSED/PASS/100%.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

المطلوب:
1. افحص كل استخدام لـ status: 'closed' أو أي status يوحي بالإغلاق النهائي داخل الملفات المحددة.
2. إذا كان runtimeBindingStatus = UI_PREVIEW_ONLY أو لا يوجد visual evidence field واضح، فممنوع status closed.
3. استبدل closed بحالة أدق من هذه الحالات:
   - preview-ready
   - needs-visual-evidence
   - needs-cross-surface-proof
   - blocked-by-contract
   - blocked-by-wlt
   - verified-ui-flow فقط إذا كان هناك proof field واضح.
4. أضف حقول proof metadata عند الحاجة:
   - routeProof
   - screenProof
   - stateCoverageProof
   - visualEvidenceStatus
   - crossSurfaceProof
   - remainingUiFlowGap
5. لا تكسر TypeScript.
6. حافظ على dsh/frontend كمنظومة واحدة تحت المظلة:
   app-client + app-partner + app-captain + app-field + control-panel.
7. توجب الالتزام بنظام الألوان المركزي.
8. تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
9. لا تستخدم أو تذكر أي مسار/ريبو قديم باسم bth؛ الريبو الحالي والمعتمد فقط هو C:\bthwani-suite.

التحقق:
شغّل:
git --no-pager diff --check
pnpm -w exec tsc --noEmit

أعطني:
- changed files
- كل status تم تغييره ولماذا
- أي status بقي closed ولماذا مع proof
- verification output
- decision: DONE أو BLOCKED فقط، لا تقل PASS أو CLOSED
```

---
## الحكم المختصر

**لا يجوز اعتبار DSH UI/UX/Flow مغلقة 100% الآن.**
حسب GitHub الحالي، DSH حالتها الرسمية ما زالت `NEEDS_VISUAL_EVIDENCE`، وكل الأسطح الخمسة `UI_PREVIEW_ONLY`: العميل، الشريك، الكابتن، الميداني، ولوحة التحكم. كذلك Binding/Runtime/Backend ليست مغلقة، وProduction Readiness = `BLOCKED`.

المطلوب الآن ليس “تحسين شكل”، بل **إغلاق رحلة تشغيلية كاملة**: كل Actor يعرف ماذا يفعل، كل Surface تعرض حالته الصحيحة، كل CTA له معنى، كل خطأ له علاج، كل ماليات تمر عبر WLT، وكل شاشة لها دليل بصري وتشغيلي.

---

## تعريف الإغلاق الحقيقي لـ DSH UI/UX/Flow

DSH تعتبر مغلقة من جانب UI/UX/Flow فقط إذا تحقق الآتي لكل رحلة:

1. **Surface ownership مثبت**: هل الشاشة تخص DSH أم App Shell أم WLT أم Control Panel.
2. **Route/host مثبت**: الشاشة فعليًا مربوطة في السطح الصحيح.
3. **Primary CTA واضح**: إجراء رئيسي واحد في كل حالة.
4. **State coverage كامل**: loading / empty / error / success / offline / disabled / blocked / retry.
5. **RTL صحيح**: النص، الأيقونات، الاتجاه، الـ chevrons، ترتيب الصفوف، ومحاذاة النص.
6. **Visual evidence موجود**: screenshots حقيقية لكل حالة أساسية، وليس ادعاء.
7. **Flow continuity مثبت**: العميل → الشريك → الكابتن → الميداني/العمليات → الدعم/المالية/التقييم.
8. **No drift**: لا ألوان عشوائية، لا أنماط محلية، لا مكونات مكررة خارج UI kit.
9. **No fake closure**: لا API/runtime/backend claim داخل مرحلة UI/UX فقط.
10. **Evidence pack**: كل نتيجة لها دليل داخل `tools/registry/runs`.

هذا يتطابق مع ملف DSH نفسه: “لا يتم قبول أي صف UI/UX/Flow بعد preview-only إلا بعد إثبات ownership، route/host، file/screen، CTA، states، RTL/visual proof، runtime evidence أو blocker صريح”.

---

## تشخيص الوضع الحالي من GitHub

### 1. DSH لديها lifecycle واضح، لكنه ليس مثبتًا Runtime

الرحلة الرسمية الحالية هي:

`discovery → storefront → cart → checkout_intent → payment_by_WLT → order_created → partner_intake → partner_accept/reject → partner_prepare → partner_ready → captain_assignment → pickup → out_for_delivery → dropoff → proof_of_delivery → delivered → rating → control_panel_audit`

هذا جيد كـ **نموذج تدفق**، لكنه لا يكفي للإغلاق؛ لأن نفس الملف يقول إن UI/UX/Flow = `NEEDS_VISUAL_EVIDENCE`، وRuntime = `RUNTIME_UNPROVEN`، وBackend = `NOT_READY_FOR_API`.

### 2. الأسطح الخمسة موجودة لكنها Preview-only

الأسطح المطلوبة رسميًا:

| السطح         | الدور                                                 |
| ------------- | ----------------------------------------------------- |
| app-client    | تصفح، متجر، سلة، دفع، تتبع، دعم، تقييم                |
| app-partner   | استقبال الطلب، قبول/رفض، تجهيز، تسليم                 |
| app-captain   | استلام مهمة، الوصول، الالتقاط، التسليم، إثبات التسليم |
| app-field     | تأهيل الشريك، الزيارات، التحقق، جاهزية التشغيل        |
| control-panel | عمليات، شركاء، دعم، مالية، تدقيق                      |

ملف DSH يصرح أن كل هذه الأسطح ما زالت `UI_PREVIEW_ONLY`.

### 3. هناك 13 Flow رئيسية يجب إغلاقها

ملف `UI_UX_FLOW_CLOSURE_MATRIX.md` يسجل 13 رحلة: discovery/promos، storefront، catalog، cart، checkout، order creation، partner preparation، captain assignment/delivery، tracking، support/refund/exception، rating، control-panel operations، field onboarding. وكلها مرتبطة بقرار `NEEDS_VISUAL_EVIDENCE` أو blockers مثل WLT/Auth.

### 4. الإغلاق البصري هو البلوك الأكبر الآن

ملف Visual Review يطلب screenshots محددة لأسطح DSH الخمسة، ويذكر أن next action هو فتح كل سطح في dev environment، أخذ screenshots للحالات الذهبية، وضعها تحت `tools/registry/runs/DSH_VISUAL_SMOKE_{DATE}/`، ثم تحديث قائمة المراجعة.

---

## أفضل الممارسات التي يجب تحويلها إلى معايير DSH

من جانب UX العام، Nielsen Norman Group يضع قواعد أساسية مثل: وضوح حالة النظام، لغة المستخدم الواقعية، حرية التراجع، الاتساق، منع الأخطاء، تقليل الاعتماد على الذاكرة، والحد الأدنى من الضجيج البصري. هذه ليست نظرية فقط؛ هي صالحة مباشرة لـ DSH لأن الرحلة فيها مال، طلبات، حالات تشغيلية، أخطاء، ومستخدمين متعددين. ([Nielsen Norman Group][1])

من جانب Checkout وDelivery، Baymard يوضح أن متوسط cart abandonment يصل إلى 70.19%، وأن مشاكل تصميم checkout نفسها قد تكون سببًا مباشرًا في ترك المستخدم للطلب. كما يربط تحسين checkout بتقليل التعقيد، تقليل الحقول، وضوح التوصيل والاستلام، مراجعة الطلب، التأكيد، معالجة الأخطاء، والـ feedback أثناء التفاعل. ([Baymard Institute][2])

من جانب Accessibility، WCAG 2.2 يجب أن تكون جزءًا من الإغلاق: focus visible، focus order، target size، بدائل للسحب drag، consistent navigation/help، error identification، error prevention قبل العمليات المالية، redundant entry، وaccessible authentication. ([W3C][3])

والنص المرفق منك يركز على نفس الخلاصة: واجهات بسيطة وواضحة، friction-free، mobile-friendly، research-backed، patterns ثابتة مثل onboarding، progressive disclosure، multi-step flows، feedback/error recovery، empty states، وقياس النجاح.

---

# قائمة معايير الإغلاق 100% لـ DSH UI/UX/Flow

## A. معايير المنظومة والملكية

| المعيار               | يجب أن يتحقق                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| DSH كمنظومة واحدة     | لا يتم تعديل app-client وحده إذا كان القرار يؤثر على partner/captain/control-panel/WLT             |
| Owner واضح            | كل شاشة مصنفة: DSH / App Shell / WLT integration / Control Panel                                   |
| UI kit authority      | أي مكون متكرر يجب أن يأتي من `@bthwani/ui-kit` أو يثبت سبب بقائه محليًا                            |
| WLT boundary          | الدفع، الرسوم، الخصومات، الاسترداد، التسوية، العمولة، المحفظة ليست ملك DSH؛ DSH يعرضها فقط عبر WLT |
| No runtime claim      | مرحلة UI/UX لا تدعي backend/API/runtime جاهزية                                                     |
| Evidence before claim | أي `CLOSED / PASS / READY / 100%` ممنوع بدون screenshots + git/tsc/diff evidence                   |

---

## B. معايير رحلة العميل app-client

| الرحلة                   | معيار الإغلاق                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Discovery                | يعرض المتاجر/العروض/الأقسام بشكل واضح، مع loading/empty/error/offline                         |
| Storefront               | يوضح حالة المتجر: مفتوح، مغلق، مشغول، خارج النطاق، لا يقبل طلبات                              |
| Catalog/Product          | بحث/فلترة/تصنيف بدون ضجيج، لا نتائج = اقتراحات بديلة                                          |
| Barcode/Product Identity | المنتج مربوط بهوية واضحة؛ الباركود يظهر كقيمة تشغيلية عند الحاجة وليس كزينة                   |
| Cart                     | السلة تعرض العناصر، الكميات، البدائل، غير المتاح، الرسوم المتوقعة، وتعديل سريع                |
| Delivery mode            | واضح هل الطلب: توصيل بثواني، توصيل المتجر، استلام ذاتي                                        |
| Checkout intent          | قبل التنفيذ يوجد ملخص نهائي قوي: المنتجات، الموقع، طريقة التوصيل، الرسوم، الخصم، الوقت، الدفع |
| Order tracking           | timeline واضح، ليس رقم طلب فقط؛ يعرض “ماذا يحدث الآن” و”ما الخطوة التالية”                    |
| Support                  | الدعم متاح داخل سياق الطلب، لا يخرج المستخدم إلى صفحة عامة مبهمة                              |
| Rating                   | يظهر بعد التسليم فقط، مع سبب واضح وبدون إزعاج                                                 |

**قاعدة خاصة:** لا توجد شاشة Checkout بدون Review/Confirm قبل أي التزام مالي؛ WCAG يطلب في العمليات المالية إما قابلية الرجوع أو التحقق أو التأكيد قبل الإرسال. ([W3C][3])

---

## C. معايير رحلة الشريك app-partner

| الرحلة             | معيار الإغلاق                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Onboarding         | يوضح مرحلة الشريك: draft / submitted / under review / marketing approved / active / rejected |
| Store availability | toggle واضح للحالة التشغيلية، مع أثره على ظهور المتجر للعميل                                 |
| Order intake       | الطلب الجديد يعرض العناصر، الوقت، خيار التوصيل، الدفع، ملاحظات العميل، موقع التسليم/الاستلام |
| Accept/Reject      | القبول والرفض لا يتمان بدون سبب/تأكيد عند الحاجة                                             |
| Preparation        | حالات: accepted / preparing / item unavailable / ready / handed off                          |
| Catalog identity   | تعديل المنتج والسعر والباركود يتم بسرعة، بدون إدخال يدوي مرهق عند توفر scan                  |
| Handoff            | يوضح هل التسليم للكابتن أو للعميل أو لمندوب المتجر                                           |
| Exceptions         | عنصر غير متوفر، تأخير، إغلاق المتجر، رفض الطلب: لكل حالة مسار علاج واضح                      |
| Finance preview    | يعرض مستحقات/رسوم كعرض فقط من WLT، بدون منطق مالي محلي                                       |

---

## D. معايير رحلة الكابتن app-captain

| الرحلة         | معيار الإغلاق                                                        |
| -------------- | -------------------------------------------------------------------- |
| Availability   | واضح هل الكابتن متاح، مشغول، غير متصل، في مهمة                       |
| Assignment     | المهمة تعرض المسار، المتجر، قيمة المهمة، الوقت، نوع التسليم، ملاحظات |
| Accept/Decline | الرفض له سبب مختصر، والقبول ينقل الحالة فورًا                        |
| Pickup         | وصول للمتجر، انتظار، استلام، مشكلة في الاستلام                       |
| Navigation     | الخريطة للكابتن فقط حسب contract الحالي؛ لا heatmap للعميل أو الشريك |
| Dropoff        | وصول للعميل، تسليم، فشل تسليم، إعادة محاولة                          |
| PoD            | إثبات التسليم واضح ومناسب: تأكيد، صورة/رمز/توقيع حسب السياسة لاحقًا  |
| Support        | كابتن يستطيع فتح مشكلة من نفس الرحلة، لا من صفحة منفصلة مبهمة        |

WCAG 2.2 يطلب أن أي وظيفة تعتمد على drag يمكن تنفيذها بطريقة single pointer بدون drag، لذلك أي swipe/drag للكابتن أو البطاقات يجب أن يكون له بديل نقر واضح. ([W3C][3])

---

## E. معايير app-field

| الرحلة                   | معيار الإغلاق                                                           |
| ------------------------ | ----------------------------------------------------------------------- |
| Store onboarding         | الزيارة، الوثائق، الموقع، الصور، جاهزية الشريك كلها في flow واضح        |
| Document verification    | رفع/رفض/إعادة رفع الوثائق بحالات مفهومة                                 |
| Visit result             | نتيجة الزيارة: جاهز، يحتاج متابعة، مرفوض، escalated                     |
| Handoff to control-panel | لا يبقى قرار التفعيل غامضًا؛ ينتقل إلى لوحة التحكم كحالة قابلة للمراجعة |
| Field finance display    | أي عمولة/تعويض يظهر من WLT فقط، لا حساب محلي داخل DSH                   |

---

## F. معايير control-panel

| المجال            | معيار الإغلاق                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| Operations        | مشاهدة الطلبات، الحالات، الاستثناءات، التدخل، SLA                                                     |
| Partner approvals | approve / reject / activate / deactivate بمبرر وسجل تدقيق                                             |
| Dispatch          | التعيين، إعادة التعيين، فشل التعيين، ضغط المناطق                                                      |
| Support           | قائمة تذاكر، تفاصيل، escalation، SLA، محادثة مرتبطة بالطلب                                            |
| Finance bridge    | settlement/refund/payout/commission كـ WLT visibility لا DSH ownership                                |
| Audit             | كل قرار حساس له actor/time/reason/evidence                                                            |
| Vars/Policies     | أي سياسة تشغيلية قابلة للتغيير يجب أن تكون واضحة المصدر، النطاق، precedence، preview impact، rollback |
| Command Center    | Monitoring لا يخلط بين heatmap للكابتن وبين dispatch admin heatmap                                    |

---

## G. معايير Navigation وInformation Architecture

| المعيار                | الامتثال المطلوب                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| لا صفحات يتيمة         | كل شاشة لها route/host واضح                                                                       |
| لا tabs مكررة          | التبويبات لا تفتح صفحات خاطئة/فارغة/مكررة                                                         |
| back behavior          | الرجوع لا يكسر الرحلة ولا يخرج المستخدم من flow حساس                                              |
| one primary CTA        | كل حالة لها CTA واحد رئيسي واضح                                                                   |
| progressive disclosure | التفاصيل الثقيلة تظهر عند الحاجة وليس دفعة واحدة                                                  |
| contextual help        | المساعدة داخل سياق المشكلة، لا صفحة عامة فقط                                                      |
| consistent navigation  | العناصر المتكررة بنفس الترتيب عبر الأسطح؛ WCAG يطلب اتساق navigation/help عند التكرار. ([W3C][3]) |

---

## H. معايير المحتوى واللغة والـ Microcopy

| المعيار           | الامتثال المطلوب                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------- |
| لغة المستخدم      | “طلبك قيد التجهيز” أفضل من مصطلحات داخلية مثل `partner_prepare`                           |
| لا جمل مبهمة      | كل حالة تقول: ماذا حدث؟ ماذا ينتظر؟ ماذا يستطيع المستخدم فعله؟                            |
| error text        | لا أكواد تقنية؛ رسالة + سبب + إجراء علاج                                                  |
| confirmation copy | قبل الدفع/الإلغاء/الرفض/التسليم يجب أن يكون النص واضحًا                                   |
| Arabic RTL        | لا وسطية عشوائية للنصوص العربية داخل rows، ولا فصل الأيقونة عن النص بـ space-between خاطئ |

---

## I. معايير Accessibility وMobile

| المعيار          | الامتثال المطلوب                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------- |
| touch target     | الحد الأدنى WCAG AA هو 24×24 CSS px، والأفضل عمليًا للأجهزة 44×44 عند الإمكان. ([W3C][3])   |
| focus visible    | أي عنصر قابل للتنقل بالكيبورد له focus واضح. ([W3C][3])                                     |
| focus order      | ترتيب التنقل يحافظ على المعنى والمنطق. ([W3C][3])                                           |
| drag alternative | أي drag/swipe له زر أو فعل بديل. ([W3C][3])                                                 |
| redundant entry  | لا تطلب من المستخدم إعادة إدخال معلومة سبق إدخالها؛ إما auto-populate أو select. ([W3C][3]) |
| accessible auth  | لا تجعل الدخول يعتمد على اختبار ذاكرة/لغز بدون بديل أو مساعدة. ([W3C][3])                   |

---

## J. معايير Checkout وOrder Completion

| المعيار                | الامتثال المطلوب                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| تقليل الحقول           | Baymard يوضح أن عدد الحقول أهم من عدد الخطوات؛ متوسط 2024 هو 5.1 خطوات و11.3 حقل، و18% يتركون بسبب التعقيد. ([Baymard Institute][4]) |
| address simplification | Address Line 2 لا يظهر افتراضيًا؛ يظهر كرابط اختياري عند الحاجة. ([Baymard Institute][4])                                            |
| coupon field           | لا تجعل حقل الكوبون يسرق انتباه المستخدم؛ الأفضل collapsed أو تطبيق تلقائي للخصومات. ([Baymard Institute][4])                        |
| order review           | قبل “تنفيذ الطلب” يجب عرض مراجعة نهائية قابلة للتعديل. Baymard يخصص Order Review كجزء أساسي من checkout. ([Baymard Institute][2])    |
| delivery clarity       | Shipping/Store Pickup لها guidelines مستقلة لأنها تؤثر مباشرة على قرار الشراء. ([Baymard Institute][2])                              |
| validation persistence | الأخطاء لا تمسح مدخلات المستخدم، وتوجهه للحل. ([Baymard Institute][2])                                                               |

---

## K. معايير الأداء والإحساس بالسرعة

| المعيار                    | الامتثال المطلوب                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| skeleton states            | تستخدم عند تحميل المتاجر/المنتجات/الطلبات بدل شاشة فارغة                                                              |
| optimistic feedback        | عند إضافة للسلة/قبول الطلب/استلام المهمة يظهر feedback فوري                                                           |
| no blocking without reason | إذا تعطل زر، يجب توضيح السبب                                                                                          |
| offline mode               | يظهر بوضوح ما يمكن وما لا يمكن فعله بدون اتصال                                                                        |
| no heavy eager loading     | تطبيق مبدأ “خيار الاستدعاء”: لا تحميل كامل لكل البيانات في كل سطح؛ استخدم summaries/IDs/lazy details/pagination/cache |

---

## L. معايير منع التكرار والضجيج

| المعيار                       | الامتثال المطلوب                                                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| no duplicate screens          | لا توجد شاشة تؤدي نفس الغرض باسم مختلف                                                                                             |
| no dead flows                 | أي route لا يصل إليه المستخدم أو لا يخدم flow يتم تصنيفه                                                                           |
| no local design systems       | لا buttons/cards/filters/sheets محلية قابلة لإعادة الاستخدام خارج UI kit                                                           |
| no giant unsafe rewrites      | الملفات الكبيرة مثل StoreScreen وOrdersTracking وCart يجب تعديلها بشرائح ضيقة فقط؛ الملف الحالي نفسه يسجلها كـ High-Risk Screens.  |
| no scattered state vocabulary | حالات الطلب والتوصيل والدعم يجب أن تكون موحدة بين العميل والشريك والكابتن والعمليات                                                |

---

# مصفوفة إغلاق نهائية حسب المجالات التي ذكرتها

| المجال                                 | قرار الإغلاق المطلوب                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Partner Onboarding → Client Visibility | لا يظهر الشريك للعميل إلا بعد approval/activation واضحين في CP، وحالة ظهوره مفهومة في app-partner         |
| Catalog / Barcode / Product Identity   | المنتج له identity ثابتة، barcode scan متاح حيث يخدم الإدخال/التعديل، ولا توجد هوية منتج متضاربة          |
| Order Lifecycle                        | lifecycle موحد عبر العميل/الشريك/الكابتن/CP، وكل حالة لها label وCTA وnext step                           |
| Delivery Modes / Dispatch / Handoff    | توصيل بثواني/توصيل المتجر/استلام ذاتي واضحة قبل الدفع وبعد الطلب، والتعيين/التسليم لا يختلط               |
| Support / Escalation / Chat            | الدعم مرتبط بالطلب والفاعل والحالة، وليس صندوق عام منفصل                                                  |
| Finance / WLT                          | DSH لا يحسب المال؛ WLT هو مصدر الحقيقة، وDSH يعرض فقط                                                     |
| Marketing / Offers / Content           | العروض لا تربك checkout؛ الخصم يظهر تلقائيًا أو بشكل منخفض الضجيج                                         |
| Platform / Vars / Policies             | السياسات قابلة للمعاينة، النطاق، precedence، impact simulation، rollback preview                          |
| Administration / Roles / Audit         | كل قرار حساس له RBAC + audit trail                                                                        |
| Notifications / Inbox                  | كل Actor يستقبل إشعارًا له فعل واضح، وليس إشعارًا معلوماتيًا بلا CTA                                      |
| Command Center / Monitoring            | monitoring/dispatch/SLA/heatmap في CP فقط؛ Captain map scoped للمهمة                                      |
| Final DSH Closure Sweep                | لا إغلاق إلا بعد screenshot matrix + route/state/CTA matrix + no duplicate/dead/noise + tsc/diff evidence |

---

## معيار PASS الحقيقي

DSH UI/UX/Flow تصل إلى **PASS** فقط عندما تكون النتيجة كالتالي:

```text
DSH_UI_UX_FLOW_CLOSURE = PASS
Surfaces = app-client + app-partner + app-captain + app-field + control-panel
All flows = visual evidence attached
All primary CTAs = verified
All states = covered
RTL = verified by screenshots
Accessibility = verified
WLT boundary = respected
No local design drift = verified
No duplicate/dead/noise blockers = verified
Runtime/backend/API = explicitly out of scope or separately proven
Evidence root = tools/registry/runs/{SESSION_ID}
```

**القرار الحالي:** `FIX_REQUIRED / NEEDS_VISUAL_EVIDENCE`
السبب: GitHub نفسه لا يثبت الإغلاق الكامل، بل يثبت أن المرحلة جاهزة للمراجعة البصرية البشرية، وأن الإغلاق الكامل ما زال محجوبًا بالأدلة البصرية والتشغيلية.

[1]: https://www.nngroup.com/articles/ten-usability-heuristics/ "10 Usability Heuristics for User Interface Design - NN/G"
[2]: https://baymard.com/checkout-usability "E-Commerce Cart & Checkout Usability Research – Baymard"
[3]: https://www.w3.org/TR/WCAG22/ "Web Content Accessibility Guidelines (WCAG) 2.2"
[4]: https://baymard.com/blog/checkout-flow-average-form-fields "Checkout Optimization: Minimize Form Fields – Baymard"


---

# معايير القرار بعد رفع الـ Evidence

بعد تنفيذ المراحل ورفع evidence يجب إصدار قرار واحد فقط:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

## لا يجوز PASS إلا إذا تحقق كل ما يلي

```text
1. جميع الملفات المعدلة داخل النطاق المسموح.
2. لا توجد ملفات غير متتبعة غير مفسرة.
3. لا توجد staged changes غير مرفوعة للمراجعة.
4. git diff --check يمر.
5. pnpm -w exec tsc --noEmit يمر أو يرفق سبب BLOCKED واضح.
6. لا توجد hardcoded colors أو local palettes داخل dsh/frontend بلا مبرر.
7. لا توجد direct Tamagui imports خارج ui-kit.
8. لا توجد money semantics داخل DSH.
9. WLT boundary محترم بالكامل.
10. lifecycle موحد عبر كل الأسطح.
11. delivery modes لا تتناقض بين client/partner/captain/control-panel.
12. support/tickets/escalation لها UI flow واضح وليست skeleton فارغة.
13. catalog/barcode/publishing لها approval + publishing + visibility gates.
14. notifications/signals لها route/action/entity/recipient.
15. roles/audit/permissions تغطي القرارات الحساسة.
16. command center يعرض monitoring cockpit ولا يصبح source truth جديد.
17. visual evidence checklist موجود، والنتيجة البصرية لا تُقبل بدون screenshots.
```

## القرار الافتراضي قبل الصور

```text
NEEDS_VISUAL_EVIDENCE
```

لأن UI/UX/Flow لا يغلق بصريًا بدون screenshots حقيقية لكل الأسطح والحالات الأساسية.

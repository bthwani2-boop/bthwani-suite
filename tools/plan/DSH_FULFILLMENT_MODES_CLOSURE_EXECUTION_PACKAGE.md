# حزمة إغلاق أوضاع تنفيذ/توصيل DSH — Fulfillment Modes Closure Package

**Document type:** تنفيذ مرحلي / تشخيص جنائي / حزمة إغلاق تشغيلية ومالية وتقنية
**Project:** BThwani / `bthwani-suite`
**Canonical local repo:** `C:\bthwani-suite`
**Default GitHub mode:** READ-ONLY unless explicitly requested
**Scope:** DSH + WLT + Client App + Partner App + Captain App + Field App + Control Panel Operations/Partners/Finance/Support/Vars
**Status:** Execution package — لا يمثل إغلاقًا فعليًا إلا بعد الأدلة والاختبارات واللقطات البصرية.

---

## 0. معيار الدقة والصرامة

يجب تنفيذ هذه الحزمة **بدقة رقمية كاملة 100% كهدف تحقق**، مع التزام صارم بـ:

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

الغرض هو ضمان **الأدق، الأقوى، الأفضل، والأنسب** دون أي ضعف أو نقص، وبمنهجية **حقيقية، منطقية، تشغيلية، مالية، وتقنية** قابلة للتحقق بالأدلة.

لا يجوز ادعاء `PASS` أو `CLOSED` أو `100%` إلا بعد اكتمال كل مراحل التنفيذ، مرور أوامر التحقق، وتوفر لقطات بصرية لكل سطح متأثر.

---

## 1. التشخيص الحاكم

هذه ليست “خيار UI في شاشة المتجر” فقط. هذه **مصفوفة تشغيل ومال وتسوية ومسؤولية** داخل DSH/WLT. تجاهلها سيكسر:

- الطلبات.
- العمليات.
- الشركاء.
- موصل الشريك.
- الكباتن.
- الدعم.
- المالية.
- العمولات.
- التسويات.
- التتبع.
- الإشعارات.
- التطبيق الميداني.
- إعدادات Platform/Vars.

## 1.1 ما ظهر من تحليل الريبو الحالي

يوجد جزء من الفكرة لكنه غير موحّد:

- عقد العميل يحتوي أصلًا على `pickup | partner_delivery | bthwani_delivery` ضمن `DshClientFulfillmentMode`، وهذا قريب من المطلوب.
- شاشة المتجر تستخدم مفردات مختلفة مثل `delivery | pickup | store_delivery`، وهذا يخلق انحرافًا مبكرًا في المصدر.
- شاشة الطلبات تستخدم تقسيمًا آخر: `fulfillmentType: delivery | pickup` مع `deliveryProvider: bthwani | store`، ثم تعرض “توصيل بثواني / توصيل المتجر / استلام بنفسي”.
- ماليًا: DSH يملك المتجر، السلة، الطلب، التوصيل، التتبع، الدعم، وتفضيلات التوصيل؛ لكن WLT يملك كل معاني المال، المحافظ، العمولات، الخصومات، الاستردادات، التسويات، والإغلاقات المالية.
- ملف تفصيل العمولة في لوحة التحكم ما زال skeleton ومعلقًا على WLT، لذلك منطق العمولات حسب وضع التنفيذ غير مغلق.

## 1.2 دليل سياقي من السوق

النموذج ليس استثناءً؛ منصات السوق الكبيرة تدعم أكثر من نمط تنفيذ:

- مطاعم/متاجر لديها أسطولها أو موصلوها الخاصون.
- منصة تدير توصيلها عبر كباتنها.
- استلام العميل بنفسه.
- عمولات تختلف حسب الشريك، الموقع، الفئة، الأداء التشغيلي، والقيمة المضافة.

هذا يؤكد أن أوضاع التنفيذ يجب أن تكون عقدًا تشغيليًا وماليًا، لا مجرد Tabs في واجهة المتجر.

---

## 2. القرار الحاكم: القيم Canonical الوحيدة

اعتمد ثلاثة أوضاع فقط كحقيقة نهائية داخل DSH:

| القيمة canonical | الاسم العربي | المسؤول التشغيلي | هل يوجد كابتن بثواني؟ | الأثر المالي |
|---|---|---|---|---|
| `bthwani_delivery` | توصيل بثواني | DSH Operations + Captain | نعم | عمولة منصة + رسوم توصيل + تسوية كابتن + تسوية شريك عبر WLT |
| `partner_delivery` | توصيل المتجر/الشريك | Partner / Store Courier | لا | عمولة منصة حسب اتفاق هذا الوضع + تسوية شريك، دون كابتن بثواني |
| `pickup` | استلام بنفسي | العميل + المتجر | لا | عمولة منصة حسب اتفاق pickup، غالبًا لا رسوم توصيل إلا إذا وجدت سياسة مثبتة |

## 2.1 الممنوع

```text
ممنوع استخدام delivery كقيمة نهائية لأنها مبهمة.
ممنوع استخدام store_delivery كقيمة نهائية؛ يسمح بها فقط alias انتقالي داخل mapper واضح.
ممنوع خلط fulfillmentType + deliveryProvider بطريقة تنتج معنى غير موحّد.
ممنوع إظهار captain في partner_delivery أو pickup.
ممنوع احتساب captain payout في partner_delivery أو pickup.
ممنوع احتساب deliveryFee في pickup إلا بسياسة مثبتة.
ممنوع التعامل مع العمولة كرقم global واحد لكل المتاجر.
```

---

## 3. نموذج التشغيل حسب الوضع

## 3.1 `bthwani_delivery` — توصيل بثواني

**المسؤول:** DSH Operations + Captain
**العميل يرى:** “سيقوم كابتن بثواني بتوصيل الطلب.”
**الشريك يرى:** “جهّز الطلب لتسليمه لكابتن بثواني.”
**الكابتن يرى:** طلب قابل للاستلام والتوصيل.
**العمليات ترى:** queue يحتاج dispatch/captain assignment.
**الدعم يرى:** المسؤول الحالي قد يكون المتجر أو الكابتن أو العمليات حسب المرحلة.
**المالية/WLT:**

- subtotal.
- deliveryFee.
- platformCommission.
- captainPayout.
- partnerNet.
- settlement.

## 3.2 `partner_delivery` — توصيل الشريك/المتجر

**المسؤول:** Partner / Store Courier
**العميل يرى:** “المتجر مسؤول عن توصيل الطلب.”
**الشريك يرى:** “عيّن موصل الشريك وجهّز الطلب للخروج.”
**الكابتن:** لا يرى الطلب إطلاقًا.
**العمليات ترى:** queue متابعة شريك، لا dispatch captain.
**الدعم يرى:** المسؤول هو الشريك/موصل الشريك/المتجر حسب المرحلة.
**المالية/WLT:**

- subtotal.
- deliveryFee إن كان الشريك يفرضها أو السياسة تسمح.
- platformCommission حسب اتفاق الشريك والوضع.
- partnerCourierCost إن كان preview/contract متاحًا.
- partnerNet.
- settlement.

## 3.3 `pickup` — استلام بنفسي

**المسؤول:** العميل + المتجر
**العميل يرى:** “اذهب إلى المتجر لاستلام طلبك.”
**الشريك يرى:** “جهّز الطلب لاستلام العميل.”
**الكابتن:** لا يرى الطلب إطلاقًا.
**العمليات ترى:** لا dispatch؛ متابعة جاهزية المتجر وإشعار العميل فقط.
**الدعم يرى:** لا كابتن ولا موصل.
**المالية/WLT:**

- subtotal.
- platformCommission حسب اتفاق pickup.
- no deliveryFee unless policy says otherwise.
- partnerNet.
- settlement.

---

## 4. نموذج العمولات والتسويات

العمولة ليست رقمًا عامًا. يجب أن تكون:

```text
commissionRate = by partner + fulfillmentMode + optional category/product override + validity + negotiation basis
```

مثال توضيحي فقط، وليس رقمًا حقيقيًا:

| الشريك | `partner_delivery` | `bthwani_delivery` | `pickup` |
|---|---:|---:|---:|
| مطعم 1 | 1% | 10% | 2% |
| مطعم 2 | 3% | 15% | 5% |

## 4.1 قاعدة الملكية المالية

```text
DSH يعرض ويجسر.
WLT يملك المال والعمولات والتسويات والدفاتر المالية.
```

لا يجوز إضافة ledger semantics داخل DSH. أي شاشة DSH تعرض finance يجب أن تكون `bridge/read-only/preview` حتى يثبت WLT endpoint.

---

## 5. مصفوفة أثر الأسطح

| السطح | المطلوب حسب mode |
|---|---|
| app-client Store | عرض الأوضاع المتاحة للمتجر فقط، لا افتراض الثلاثة دائمًا |
| app-client Cart | حمل الوضع المختار، تسعير حي، رسوم توصيل حسب الوضع |
| app-client Orders/Tracking | عرض mode-aware copy، عدم ذكر كابتن في pickup/partner_delivery |
| app-client Notifications | إشعارات حسب المسؤول الحقيقي |
| app-partner | تجهيز/تسليم حسب mode، وإظهار موصل الشريك في partner_delivery |
| app-captain | لا يرى إلا `bthwani_delivery` |
| app-field | عرض الأوضاع والعمولات المتفق عليها مع المتجر read-only/preview |
| control-panel Operations | queues/tabs حسب الأوضاع الثلاثة |
| control-panel Partners | إعداد enabled modes + commission per mode |
| control-panel Finance | WLT bridge للعمولات والتسويات حسب mode |
| control-panel Support | تحديد المسؤول حسب الوضع والمرحلة |
| Platform/Vars | preview policy + precedence global/region/partner/store/category |

---

## 6. قواعد التصميم والتنفيذ

```text
Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only.
```

- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- أي reusable/repeatable design يجب أن يكون مركزيًا في @bthwani/ui-kit، لكن لا تضف ملفات ui-kit جديدة إلا إذا ثبت أن الحاجة غير قابلة للتفاوض وتمت موافقة الإنسان.
- لا hardcoded colors.
- لا local design system.
- RTL كامل: النص يمين، icon/text كتلة يمينية، action/chevron في الجهة المقابلة.
- لا تستخدم أي repo/path قديم باسم bth كهدف نشط؛ الهدف المعتمد هو `C:\bthwani-suite` فقط.

---

# 7. حزمة التنفيذ المرحلية

لا تنفذ كأمر واحد. كل مرحلة تتوقف وتطلب موافقة صريحة للمرحلة التالية.

---

## المرحلة 0 — تشخيص جنائي READ-ONLY

```text
نفّذ المرحلة 0 فقط: تحليل READ-ONLY شامل لأوضاع تنفيذ/توصيل DSH بدون تعديل أي ملف.

المسار:
C:\bthwani-suite

اعمل على الفرع المحلي الحالي فقط، ولا تذكر اسم الفرع داخل التقرير.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

النطاق المطلوب فحصه:
- dsh/frontend/app-client/
- dsh/frontend/app-partner/
- dsh/frontend/app-captain/
- dsh/frontend/app-field/
- dsh/frontend/control-panel/
- wlt/frontend/
- dsh/docs/
- .agents/skills/ ذات العلاقة بـ DSH/WLT/operations/finance/vars

ابحث عن:
- fulfillmentMode
- deliveryMode
- deliveryProvider
- fulfillmentType
- pickup
- partner_delivery
- bthwani_delivery
- store_delivery
- delivery
- توصيل المتجر
- توصيل بثواني
- استلم بنفسك
- commission
- settlement
- payout
- WLT
- partner courier
- captain

المطلوب:
1. احصر كل المفردات الحالية لأوضاع التوصيل والتنفيذ.
2. حدد التناقضات بين StoreScreen وCartScreen وOrdersTrackingScreens وapp-partner وapp-captain وcontrol-panel operations/partners/finance/support وWLT bridge.
3. حدد أين يتم استخدام delivery كمصطلح مبهم.
4. حدد هل يوجد partner_delivery في العقود لكنه غير مطبق في الشاشات.
5. حدد أين تظهر عمولات/تسويات DSH/WLT وهل هي UI_PREVIEW_ONLY أو BLOCKED_BY_WLT.
6. حدد أين يجب أن تظهر التبويبات الرئيسية في لوحة التحكم: الكل، توصيل بثواني، توصيل الشريك، استلام بنفسي.
7. حدد أثر كل وضع على العميل، الشريك، موصل الشريك، الكابتن، العمليات، الدعم، المالية/WLT، التطبيق الميداني.
8. لا تعدّل أي ملف.
9. لا تضف ملفات.
10. لا تغيّر API/backend/runtime.

اخرج بتقرير قصير:
- المفردة canonical المقترحة.
- المفردات القديمة/المربكة التي يجب تحويلها.
- الملفات المتأثرة حسب السطح.
- المخاطر.
- خطة المرحلة 1.
- اكتب STOP وانتظر موافقة صريحة.
```

---

## المرحلة 1 — تثبيت قاموس Canonical واحد

```text
نفّذ المرحلة 1 فقط: تثبيت قاموس موحّد لأوضاع تنفيذ DSH بدون تغيير UI واسع.

المسار:
C:\bthwani-suite

اعمل على الفرع المحلي الحالي فقط، ولا تذكر اسم الفرع داخل التقرير.

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

النطاق:
- dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts
- أي ملف types/shared موجود يملك fulfillment/delivery vocabulary
- لا تعدّل الشاشات إلا إذا كان تعديل type import ضروريًا لمنع كسر TypeScript

المطلوب:
1. اعتمد القيم canonical:
   - pickup
   - partner_delivery
   - bthwani_delivery
2. لا تستخدم delivery كقيمة نهائية لأنها مبهمة.
3. لا تستخدم store_delivery كقيمة نهائية؛ إن كانت موجودة فحوّلها alias انتقالي فقط داخل mapper واضح.
4. أضف helper محلي/مشترك إن كان موجودًا مكان مناسب:
   - label بالعربي
   - icon semantic
   - operationalOwner
   - financialOwner
   - requiresCaptain
   - requiresPartnerCourier
   - requiresCustomerPickup
5. لا تضف backend/API.
6. لا تغيّر lockfiles.
7. لا تنشئ design system محلي.

معايير القبول:
- يوجد مصدر واحد واضح لأوضاع التنفيذ.
- القيم الثلاث لا تتناقض مع العقود الحالية.
- لا يوجد كسر TypeScript.
- لا يوجد تغيير بصري كبير.

بعد التنفيذ:
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

اعرض فقط:
- الملفات التي تغيّرت.
- القيم canonical.
- aliases الانتقالية إن وجدت.
- نتيجة الأوامر.
- STOP للمرحلة 2.
```

---

## المرحلة 2 — تطبيق العميل: المتجر والسلة والطلب

```text
نفّذ المرحلة 2 فقط: توحيد أوضاع التنفيذ داخل تطبيق العميل DSH.

المسار:
C:\bthwani-suite

النطاق:
- dsh/frontend/app-client/screens/StoreScreen.tsx
- dsh/frontend/app-client/screens/CartScreen.tsx
- dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx
- dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts عند الحاجة فقط
- dsh/frontend/app-client/data/ preview فقط عند الحاجة

المطلوب:
1. شاشة المتجر:
   - اعرض فقط الأوضاع التي يدعمها المتجر.
   - لا تفترض أن كل متجر لديه كل الخيارات.
   - الخيارات:
     - توصيل بثواني = bthwani_delivery
     - توصيل المتجر = partner_delivery
     - استلام بنفسي = pickup
2. كل خيار يجب أن يوضح للعميل:
   - من سيقوم بالتوصيل/الاستلام.
   - هل توجد رسوم توصيل.
   - ETA أو حالة غير متاح.
3. عند اختيار الوضع:
   - ينتقل إلى السلة والطلب بنفس القيمة canonical.
   - لا يتحول إلى delivery مبهمة.
4. CartScreen:
   - ملخص الطلب يعرض وضع التنفيذ الحالي.
   - سعر التوصيل يتغير حسب الوضع.
   - pickup لا يعرض رسوم توصيل إلا إذا توجد رسوم خدمة مثبتة.
   - partner_delivery يوضح أن المتجر مسؤول عن التوصيل.
   - bthwani_delivery يوضح أن كابتن بثواني مسؤول.
5. OrdersTracking:
   - تاريخ الطلبات والتتبع يعرض mode canonical label.
   - لا تستخدم split مربك بين fulfillmentType/deliveryProvider إلا لو صار adapter داخلي واضح.
6. لا backend/API/runtime.
7. لا route جديد.
8. لا hardcoded colors.
9. توجب الالتزام بنظام الألوان المركزي.
10. تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.

معايير القبول:
- اختيار العميل لا يضيع بين المتجر والسلة والتتبع.
- لا يظهر خيار غير متاح لمتجر لا يدعمه.
- لا يوجد تضارب بين رسوم التوصيل ووضع التنفيذ.
- RTL صحيح.
- screenshots مطلوبة للثلاثة أوضاع.

بعد التنفيذ:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

STOP للمرحلة 3.
```

---

## المرحلة 3 — تطبيق الشريك وموصل الشريك

```text
نفّذ المرحلة 3 فقط: دعم partner_delivery داخل تطبيق الشريك بدون بناء نظام كامل جديد.

المسار:
C:\bthwani-suite

النطاق:
- dsh/frontend/app-partner/
- app-partner/
- أي screen registry/routes للشريك عند الحاجة

المطلوب:
1. في طلبات الشريك، اعرض وضع التنفيذ بوضوح:
   - pickup: جهّز الطلب لاستلام العميل.
   - partner_delivery: جهّز الطلب وعيّن موصل الشريك.
   - bthwani_delivery: جهّز الطلب لتسليمه لكابتن بثواني.
2. أضف/فعّل مفهوم موصل الشريك كـ preview-only إذا لا يوجد backend:
   - اسم الموصل.
   - حالة التعيين.
   - جاهز للخروج.
   - تم التسليم من طرف الشريك.
3. لا تستخدم app-captain لتوصيل الشريك.
4. لا تجعل توصيل الشريك يظهر كأنه كابتن بثواني.
5. لا تغيّر API/backend/runtime.
6. لا تضف dependencies.

معايير القبول:
- الشريك يعرف مسؤوليته حسب mode.
- partner_delivery لا يذهب إلى captain flow.
- bthwani_delivery يظل ينتظر كابتن بثواني.
- pickup ينتظر العميل.
- لا يوجد UI مضلل.

تحقق:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

STOP للمرحلة 4.
```

---

## المرحلة 4 — تطبيق الكابتن

```text
نفّذ المرحلة 4 فقط: عزل تطبيق الكابتن بحيث لا يستقبل إلا bthwani_delivery.

المسار:
C:\bthwani-suite

النطاق:
- dsh/frontend/app-captain/
- app-captain/

المطلوب:
1. لا تعرض في تطبيق الكابتن أي طلب:
   - pickup
   - partner_delivery
2. الكابتن يرى فقط:
   - bthwani_delivery
3. كل inbox/task/detail/map/pickup/dropoff يجب أن يفترض أن المسؤول هو كابتن بثواني.
4. إذا ظهرت بيانات preview لطلب partner_delivery داخل captain، صححها.
5. لا backend/API/runtime.

معايير القبول:
- لا يوجد partner_delivery في captain inbox.
- لا يوجد pickup في captain inbox.
- كل طلب للكابتن هو bthwani_delivery فقط.
- التتبع والمالية لا تخلط بين موصل الشريك وكابتن بثواني.

تحقق ثم STOP.
```

---

## المرحلة 5 — لوحة التحكم: العمليات

```text
نفّذ المرحلة 5 فقط: توحيد أوضاع التنفيذ داخل عمليات DSH في لوحة التحكم.

المسار:
C:\bthwani-suite

النطاق:
- dsh/frontend/control-panel/operations/
- dsh/frontend/control-panel/dashboard/ عند الحاجة
- أي shared operations preview data

المطلوب:
1. أضف تبويبات/فلاتر رئيسية في العمليات:
   - الكل
   - توصيل بثواني
   - توصيل الشريك
   - استلام بنفسي
2. كل بطاقة/صف طلب في العمليات يعرض:
   - fulfillmentMode
   - المسؤول الحالي
   - nextAction
   - SLA
   - هل يحتاج captain
   - هل يحتاج partner courier
   - هل ينتظر العميل للاستلام
3. bthwani_delivery:
   - يحتاج dispatch/captain assignment.
4. partner_delivery:
   - يحتاج متابعة الشريك وموصل الشريك، لا dispatch captain.
5. pickup:
   - يحتاج جاهزية المتجر وإشعار العميل، لا dispatch.
6. الدعم والاستثناءات يجب أن تكون داخل سياق الوضع.
7. لا backend/API/runtime.
8. لا routes جديدة إلا إذا موجودة ومثبتة.

معايير القبول:
- العمليات لا تخلط الطلبات.
- كل وضع له queue واضح.
- لا يوجد زر “تعيين كابتن” لطلبات partner_delivery أو pickup.
- لا يوجد UI يخفي المسؤولية التشغيلية.

تحقق ثم STOP.
```

---

## المرحلة 6 — لوحة التحكم: الشركاء + التطبيق الميداني

```text
نفّذ المرحلة 6 فقط: جعل أوضاع التنفيذ جزءًا من إعدادات/اتفاق الشريك.

المسار:
C:\bthwani-suite

النطاق:
- dsh/frontend/control-panel/partners/
- dsh/frontend/app-field/
- أي partner onboarding/eligibility preview data

المطلوب:
1. في الشركاء:
   - اعرض enabledFulfillmentModes لكل متجر.
   - لا تفترض أن المتجر يدعم كل الأوضاع.
2. لكل mode:
   - enabled/disabled
   - commissionRate
   - settlementBasis
   - validity
   - negotiation note
   - operational readiness
3. في التطبيق الميداني:
   - اعرض الأوضاع المتفق عليها مع المتجر.
   - اعرض العمولة المتفق عليها لكل وضع.
   - اجعلها read-only/preview إن لم يوجد backend.
4. لا تجعل field app يملك المال؛ هو يعرض الاتفاق فقط.
5. لا backend/API/runtime.

معايير القبول:
- كل متجر يمكن أن يدعم subset من الأوضاع.
- العمولة ليست global.
- العمولة مرتبطة بالشريك + الوضع + الفئة/المنتج عند الحاجة.
- لا يوجد hardcoded commission عام.

تحقق ثم STOP.
```

---

## المرحلة 7 — WLT والمالية والعمولات

```text
نفّذ المرحلة 7 فقط: توحيد عرض العمولات والتسويات حسب وضع التنفيذ، كـ UI/preview bridge فقط.

المسار:
C:\bthwani-suite

النطاق:
- dsh/frontend/control-panel/finance/
- wlt/frontend/
- dsh/frontend/app-captain/data/*finance*
- dsh/frontend/app-field/*finance*
- أي WLT DSH bridge preview

المطلوب:
1. لا تنفذ ledger حقيقي.
2. لا backend/API/runtime.
3. اعرض نموذج مالي واضح لكل fulfillmentMode:
   - subtotal
   - deliveryFee
   - platformCommission
   - partnerNet
   - captainPayout إن كان bthwani_delivery فقط
   - partnerCourierCost إن كان partner_delivery فقط وكان preview متاحًا
   - pickup has no deliveryFee unless policy says otherwise
4. commissionRate يكون:
   - per partner
   - per fulfillmentMode
   - قابل للتمديد حسب category/product
5. WLT هو مالك المال:
   - لا تضف ledger semantics داخل DSH.
6. أي شاشة DSH تعرض finance يجب أن تكون bridge/read-only إن لم يثبت WLT endpoint.

معايير القبول:
- لا توجد عمولة واحدة عامة لكل المتاجر.
- لا يتم احتساب captain payout في partner_delivery أو pickup.
- لا يتم احتساب deliveryFee في pickup إلا بسياسة مثبتة.
- لا توجد تسوية مالية خارج WLT.

تحقق ثم STOP.
```

---

## المرحلة 8 — الدعم والإشعارات والتتبع

```text
نفّذ المرحلة 8 فقط: توحيد الدعم والتتبع والإشعارات حسب وضع التنفيذ.

المسار:
C:\bthwani-suite

النطاق:
- dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx
- dsh/frontend/app-client/screens/NotificationsScreen.tsx
- dsh/frontend/control-panel/support/ أو operations support sections
- dsh/frontend/app-partner/
- dsh/frontend/app-captain/

المطلوب:
1. bthwani_delivery:
   - العميل يراسل/ينبه الكابتن داخل الطلب.
   - العمليات ترى captain assignment.
2. partner_delivery:
   - العميل يتواصل عبر قناة الطلب/الدعم، لكن لا يظهر كابتن بثواني.
   - الشريك/موصل الشريك مسؤول.
3. pickup:
   - لا كابتن ولا موصل.
   - العميل يرى “الطلب جاهز للاستلام”.
4. الإشعارات يجب أن تعرض mode-aware copy.
5. الدعم يجب أن يعرف المسؤول:
   - captain
   - partner courier
   - store
   - client pickup
6. لا OTP للعميل إلا إذا تم اعتماده صراحة لاحقًا.
7. لا API/backend/runtime.

معايير القبول:
- لا يظهر “الكابتن” في pickup أو partner_delivery.
- لا يظهر “موصل الشريك” في bthwani_delivery.
- كل بلاغ يذهب للسياق الصحيح.

تحقق ثم STOP.
```

---

## المرحلة 9 — Vars / Platform policy

```text
نفّذ المرحلة 9 فقط: ربط أوضاع التنفيذ بسياسات Platform/Vars كعرض تحكمي preview-only.

المسار:
C:\bthwani-suite

النطاق:
- dsh/frontend/control-panel/platform/Vars/
- dsh/frontend/control-panel/platform/
- tools/guards/guard-dsh-platform-vars-v3.mjs عند الحاجة فحص فقط

المطلوب:
1. اعرض سياسات قابلة للتحكم لاحقًا:
   - defaultAvailableFulfillmentModes
   - allowPartnerDelivery
   - allowBthwaniDelivery
   - allowPickup
   - commissionPolicyPreview
   - deliveryFeePolicyPreview
   - captainDispatchRequiredByMode
2. لا تنفذ mutation.
3. لا backend/API/runtime/database/env/provider switching.
4. اجعلها preview/control-room clarity فقط.
5. توضح precedence:
   - global default
   - region
   - partner
   - store
   - product/category override

معايير القبول:
- لا توجد قيم hardcoded مبعثرة.
- واضح أين ستدار السياسات لاحقًا.
- لا يوجد توسيع backend.

تحقق ثم STOP.
```

---

## المرحلة 10 — Loop الإغلاق

```text
نفّذ مرحلة Loop الإغلاق فقط بعد اكتمال المراحل السابقة.

المسار:
C:\bthwani-suite

المطلوب:
1. شغّل فحص شامل:
   - ابحث عن delivery/store_delivery/fulfillmentType/deliveryProvider/commission/pickup/partner_delivery/bthwani_delivery
2. صنّف كل occurrence:
   - canonical
   - alias transitional
   - bug
   - docs only
   - preview only
3. أصلح أي bug داخل النطاق.
4. شغّل:
   git --no-pager status --short
   git --no-pager diff --check
   pnpm -w exec tsc --noEmit
5. اطلب screenshots لكل سطح:
   - app-client store/cart/orders/tracking
   - app-partner orders
   - app-captain inbox
   - app-field store agreement
   - control-panel operations
   - control-panel partners
   - control-panel finance
   - control-panel support/notifications إن وجدت
6. لا تدّعي PASS/CLOSED/100% بدون أدلة.

اخرج بقرار:
- DONE إن مرّت الأدلة.
- BLOCKED إن وُجد نقص.
- FIX_REQUIRED إن بقيت أخطاء.
```

---

# 8. Loop ضمان الإغلاق

بعد كل مرحلة:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

ثم يجب تقديم:

```text
- الملفات التي تغيّرت.
- سبب كل تغيير.
- ما تم منعه.
- نتيجة git status.
- نتيجة diff check.
- نتيجة tsc.
- screenshots عند UI.
- DONE أو BLOCKED أو FIX_REQUIRED فقط.
- STOP قبل الانتقال للمرحلة التالية.
```

## 8.1 Loop البحث الإجباري في مرحلة الإغلاق

```text
ابحث عن:
- delivery
- store_delivery
- fulfillmentType
- deliveryProvider
- fulfillmentMode
- deliveryMode
- pickup
- partner_delivery
- bthwani_delivery
- commission
- settlement
- payout
- captain
- partner courier
```

صنّف كل occurrence:

```text
canonical
alias transitional
bug
docs only
preview only
obsolete/dead/noise
```

أي occurrence يصنف `bug` يجب إصلاحه قبل الإغلاق.

---

# 9. تعريف الإغلاق النهائي

لا يعتبر هذا الموضوع مغلقًا إلا إذا ثبت بالأدلة أن:

1. المفردات موحدة: `pickup | partner_delivery | bthwani_delivery`.
2. كل متجر يمكنه دعم subset من الأوضاع.
3. العميل لا يرى خيارات غير متاحة.
4. الطلب يحمل الوضع من المتجر → السلة → الدفع → التتبع → الإشعارات.
5. عمليات DSH تملك queues حسب الوضع.
6. الشريك يرى مسؤوليته حسب الوضع.
7. الكابتن لا يرى إلا `bthwani_delivery`.
8. موصل الشريك لا يختلط مع كابتن بثواني.
9. WLT هو مالك العمولات والتسويات.
10. العمولة per partner + per mode وليست global.
11. التطبيق الميداني يعرض الاتفاقات المتفق عليها.
12. الدعم يعرف المسؤول حسب الوضع.
13. لا توجد قيم مبهمة مثل `delivery` كحقيقة نهائية.
14. لا توجد ألوان/تصميم محلي خارج `@bthwani/ui-kit`.
15. `tsc` و`diff --check` يمران.
16. توجد screenshots لكل سطح متأثر.
17. لا توجد ملفات untracked غير محسوبة.
18. لا توجد staged changes غير مراجعة.
19. لا توجد تغييرات خارج النطاق.
20. لا توجد قيم مالية hardcoded أو global commission مضللة.

---

# 10. مراجع داخلية يجب احترامها

- `dsh/SERVICE_BLUEPRINT.md`
- `dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts`
- `dsh/frontend/app-client/screens/StoreScreen.tsx`
- `dsh/frontend/app-client/screens/CartScreen.tsx`
- `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx`
- `dsh/docs/SCREEN_API_MATRIX.md`
- `dsh/frontend/control-panel/finance/CommissionBreakdownWorkspace.tsx`
- `AI_ASSISTED_DEVELOPMENT_GOVERNANCE_SOP.md`
- `BTHWANI_CHATGPT_SMART_DELIVERY_SOP.md`

---

# 11. مراجع خارجية سياقية

هذه المراجع سياقية لدعم منطق السوق فقط، وليست مصدر تنفيذ داخل الريبو:

1. Axios — Uber Eats widened service to restaurants that already deliver.
   https://www.axios.com/2019/09/10/exclusive-uber-eats-widens-service-to-eateries-that-already-deliver
2. Business Insider — DoorDash CEO on end-to-end food delivery complexity.
   https://www.businessinsider.com/doordash-ceo-robotaxis-self-driving-cars-not-ready-food-delivery-2025-8
3. Food & Wine — DoorDash fee/commission agreement example.
   https://www.foodandwine.com/news/doordash-mcdonalds-slow-delivery-wrong-items-commission-agreement

---

# 12. القرار التنفيذي

هذه الحزمة **لا تُغلق في خطوة واحدة**.
تُغلق عبر مراحل، كل مرحلة لها نطاق، تحقق، أدلة، صور، ثم توقف.
الإغلاق النهائي لا يحدث إلا بعد Loop الإغلاق ومرور جميع الأدلة.

```text
Recommended first action:
نفّذ المرحلة 0 فقط.
```

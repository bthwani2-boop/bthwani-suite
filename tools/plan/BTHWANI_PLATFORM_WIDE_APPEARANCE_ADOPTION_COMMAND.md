# BThwani Global Appearance System — أمر تنفيذ شامل من الألف إلى الياء

## القرار

هذه النسخة هي الصياغة المصححة الشاملة.
المطلوب ليس `dsh` فقط، وليس تطبيق العميل فقط، وليس الموبايل فقط. المطلوب اعتماد نمط **Light Premium / Dark Glass** على كل ما يرتبط بمنصة BThwani من الألف إلى الياء:

- كل تطبيقات الموبايل.
- لوحة التحكم.
- الويب أب.
- الموقع.
- كل الخدمات والسطوح service-owned.
- كل الشاشات والصفحات.
- كل المكونات التي تظهر للمستخدم.
- كل حالات light/dark بطريقة موحدة من `@bthwani/ui-kit`.

---

## أمر التنفيذ للوكيل

```text
نفّذ هذا الطلب داخل C:\bthwani-suite على الفرع الحالي:
ghb/0140-20260514-202147-dsh

نفّذ تنفيذًا مرحليًا صارمًا ومغلقًا بالأدلة. لا تنتقل من مرحلة إلى التي بعدها إلا بعد تحققها. المطلوب اعتماد نظام BThwani Appearance System لكل ما يرتبط بالمنصة من الألف إلى الياء: الموبايل، الويب، لوحة التحكم، الخدمات، السطوح، الشاشات، الصفحات، والمكونات الظاهرة للمستخدم.

هذا ليس خاصًا بخدمة dsh فقط.
هذا ليس خاصًا بتطبيق العميل فقط.
هذا ليس خاصًا بالموبايل فقط.
هذا نهج منصة كامل، ويجب أن يكون منظمًا ومركزيًا وقابلًا للتوسع من @bthwani/ui-kit فقط.

الهدف النهائي:
اعتماد نمطين رسميين في كل واجهات BThwani:
1) فاتح أبيض / Light Premium
2) داكن زجاجي / Dark Glass

وذلك عبر:
- source of truth موحد لكل تطبيق/سطح.
- تبويب/قسم "المظهر" في الحساب/الإعدادات لكل تطبيق أو سطح له حساب/إعدادات.
- تطبيق فعلي للمظهر على كل الشاشات والصفحات داخل النطاق.
- عدم ترك أي شاشة خارج النظام.
- عدم إنشاء design system محلي.
- عدم استخدام ألوان عشوائية.
- عدم كسر RTL.
- عدم كسر TypeScript.
- عدم إحداث ضجيج أو إعادة تصميم عشوائية.

النطاق الشامل:

A) تطبيقات الموبايل:
- app-client/runtime
- app-partner/runtime
- app-captain/runtime
- app-field/runtime

B) الويب ولوحة التحكم:
- control-panel/runtime
- webapp/runtime
- website/runtime

C) حزم الخدمات والسطوح:
- dsh
- wlt
- knz
- arb
- amn
- esf
- mrf
- snd
- kwd
- أي service-owned screens أو surfaces داخل هذه الحزم أو مستهلكة من التطبيقات والويب.

D) كل الشاشات والصفحات:
- home
- marketplace/discovery
- store/merchant details
- products
- categories
- offers/promos
- orders
- checkout
- payment
- address
- account
- settings
- support
- forms
- tables
- dashboards
- reports
- operational screens
- partner/captain/field workflows
- كل صفحة أو شاشة قابلة للوصول في المنصة.

السياق الحاسم:
- BThwani Appearance / Glass Foundation موجود داخل @bthwani/ui-kit.
- المسار الحالي للحزمة هو ui-kit واسمها الرسمي @bthwani/ui-kit.
- استخدم public exports فقط من @bthwani/ui-kit.
- ممنوع direct Tamagui import خارج @bthwani/ui-kit.
- ممنوع local design system.
- ممنوع local tokens/local palettes.
- ممنوع hardcoded random colors.
- ممنوع استخدام أو ذكر أي repo/path قديم باسم bth؛ الريبو الحالي فقط C:\bthwani-suite.
- القاعدة المعمارية: Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui داخليًا داخل ui-kit فقط.

قاعدة الشاشات والصفحات الجديدة — Future Screens Contract:
أي شاشة/صفحة/Surface/Component جديد يتم إنشاؤه لاحقًا في أي جزء من المنصة يجب أن يتبع BThwani Appearance System تلقائيًا من لحظة إنشائه.

المطلوب لأي شاشة جديدة:
- يجب أن تستهلك المظهر من provider/source الرسمي.
- يجب أن تدعم lightPremium و darkGlass من البداية.
- lightPremium = فاتح افتراضيًا بالكامل، ولا Glass إلا إذا حدده الإنسان/المطور صراحة أثناء تصميم الشاشة.
- darkGlass = داكن مضبوط بالكامل، مع glass حسب role وليس بشكل عشوائي.
- يجب استخدام @bthwani/ui-kit public exports فقط.
- ممنوع إنشاء ألوان محلية أو theme محلي أو tokens محلية.
- ممنوع direct Tamagui خارج @bthwani/ui-kit.
- ممنوع hardcoded hex إلا لحالة موثقة ومؤقتة ومعتمدة.
- يجب أن تكون RTL-correct من البداية.
- يجب ألا تحتوي نصًا داكنًا فوق خلفية داكنة أو بطاقة بيضاء صلبة داخل darkGlass.
- يجب ألا تتجاوز أنماط الحواف الزجاجية/rim-light الرسمية.
- يجب أن تمر TypeScript و diff check.
- أي شاشة جديدة لا تدعم light/dark من البداية تعتبر غير مكتملة ولا تُقبل كـ DONE.

تعريف المظهرين النهائي:

1) Light Premium / فاتح أبيض
- هو الافتراضي في كل المنصة.
- كل شيء في المنصة يكون فاتحًا افتراضيًا.
- الخلفيات white / off-white.
- البطاقات والأسطح الأساسية فاتحة وواضحة.
- النصوص الأساسية deepBlue #0A2F5C.
- CTA والحالة المختارة orange #FF500D.
- الجداول والنماذج والإعدادات والحسابات تكون واضحة وعملية.
- لا تجعل أي شاشة glass افتراضيًا في الوضع الفاتح.
- أي Glass في الوضع الفاتح لا يقرره الوكيل. يحدده الإنسان/المطور أثناء مراجعة وتصميم شاشة بعينها.
- إذا لم توجد تعليمات بشرية صريحة لعنصر معين في الوضع الفاتح، فالقيمة الافتراضية له: فاتح واضح وليس زجاجيًا.
- مسموح فقط بلمعة خفيفة جدًا/rim-light ناعم من tokens الرسمية عند الحاجة، دون تحويل السطح إلى glass كامل.

2) Dark Glass / داكن زجاجي
- عند اختيار داكن زجاجي، كل المنصة تتحول إلى مظهر داكن مضبوط.
- ليس المطلوب أن يصبح كل عنصر glass كثيف.
- المطلوب: dark everywhere + role-based glass/dark premium surfaces.
- كل خلفية عامة تصبح dark premium.
- كل نص يصبح readable white / near-white.
- كل card/surface يتحول إلى dark premium أو glass حسب دوره.
- الشاشات التجارية/البصرية تستخدم glass بشكل أوضح:
  - home
  - marketplace
  - stores
  - products
  - offers
  - banners
  - category chips
  - floating actions
  - hero sections
- الشاشات الوظيفية تستخدم dark premium readable surfaces، لا glass مزعج:
  - account
  - settings
  - checkout
  - payment
  - address
  - support
  - forms
  - tables
  - dashboards
  - reports
  - operational tasks
- لوحة التحكم في darkGlass يجب أن تكون dark premium عملية ومقروءة، لا لوحة glass مزعجة.
- ممنوع black flat theme.
- ممنوع نص داكن على خلفية داكنة.
- ممنوع بطاقة بيضاء صلبة داخل darkGlass إلا إذا كانت حالة خاصة مثبتة ومبررة.
- ممنوع glass فوق glass بشكل يضعف القراءة.

تعريف الحواف الزجاجية البارزة / Glass Rim-light:
الحواف الزجاجية البارزة هي إطار ضوئي شفاف وناعم يعطي العناصر عمقًا وفخامة.
- في Light Premium: تكون خفيفة جدًا كلمعة راقية، لا تجعل السطح زجاجيًا بالكامل.
- في Dark Glass: تكون أوضح كـ rim-light زجاجي يبرز الطبقات بدون ثقل بصري.
- يجب أن تأتي من tokens/roles/variants الرسمية في @bthwani/ui-kit مثل glassBorder / borderStrong / shadowSoft / shadowPremium أو ما يعادلها.
- ممنوع حدود برتقالية ثقيلة.
- ممنوع glow مبالغ.
- ممنوع blur ثقيل يضر الأداء.
- ممنوع إضافة مكتبة blur جديدة بدون موافقة صريحة.

سياسة تقليل الضجيج:
- المطلوب تعميم المظهر عبر provider/tokens/theme-level قدر الإمكان.
- ممنوع إعادة تصميم كل شاشة يدويًا.
- تعديل screen-level مسموح فقط لإصلاح كسر واضح:
  - خلفية خاطئة.
  - نص غير مقروء.
  - card أبيض داخل darkGlass.
  - hardcoded color.
  - overflow/clipping.
  - RTL break.
  - duplicate component.
  - عنصر لا يستجيب للمظهر.
- لا تغيّر flow أو routing إلا بأضيق حد لازم لإظهار المظهر أو إصلاح كسر واضح.

سياسة التخزين:
اختيار المظهر يجب أن يكون محفوظًا فعليًا لكل تطبيق/سطح.

للموبايل:
- ابحث أولًا هل @react-native-async-storage/async-storage موجودة مسبقًا في package.json أو مستخدمة في الكود.
- إذا لم تكن موجودة وكان التخزين الدائم مطلوبًا للموبايل، يسمح فقط بإضافة:
  @react-native-async-storage/async-storage@3.0.2
- الإضافة تكون من جذر الريبو فقط وبـ --filter للتطبيق الذي يحتاجها.
- لا تستخدم pnpm -w add لهذه الحزمة.
- لا تضفها لكل التطبيقات دفعة واحدة إلا إذا ثبت أن كل تطبيق يحتاجها فعلًا.
- لا تضف أي dependency أخرى.
- إذا تمت الإضافة، يجب أن يقتصر تغيير dependencies على package.json للتطبيق المعني + pnpm-lock.yaml فقط.

أوامر الإضافة المسموحة عند الحاجة فقط:
pnpm --filter @bthwani/app-client add @react-native-async-storage/async-storage@3.0.2
pnpm --filter @bthwani/app-partner add @react-native-async-storage/async-storage@3.0.2
pnpm --filter @bthwani/app-captain add @react-native-async-storage/async-storage@3.0.2
pnpm --filter @bthwani/app-field add @react-native-async-storage/async-storage@3.0.2

للوحة التحكم والويب:
- استخدم localStorage آمن ومحمي من SSR/client boundary.
- لا تضف dependency للتخزين في control-panel/webapp/website.

Phase 0 — Read-only Discovery قبل أي تعديل:
افحص كل النطاقات التالية:

Mobile:
- app-client/runtime
- app-partner/runtime
- app-captain/runtime
- app-field/runtime

Web:
- control-panel/runtime
- webapp/runtime
- website/runtime

Services/surfaces:
- dsh
- wlt
- knz
- arb
- amn
- esf
- mrf
- snd
- kwd

ابحث عن:
- App.tsx
- index.ts
- shell
- composition
- root provider
- RootProviders
- UiKitProvider
- BThwaniAppearanceProvider
- account
- profile
- settings
- حسابي
- الحساب
- الإعدادات
- المظهر
- appearance
- theme
- home
- store
- merchant
- order
- checkout
- payment
- address
- support
- forms
- tables
- dashboard
- @bthwani/ui-kit

قبل أي تعديل اعرض:
- لكل تطبيق/سطح: أين root/provider.
- لكل تطبيق/سطح: أين الحساب/الإعدادات.
- هل توجد شاشة حساب جاهزة أم يجب إنشاء قسم بسيط.
- هل يوجد storage helper جاهز.
- ما الملفات التي ستلمسها فقط.
- سبب لمس كل ملف.
- هل ستحتاج dependency تخزين للموبايل أم لا.
إذا لم تستطع تحديد المالك الحقيقي لشاشة/حساب، اكتب BLOCKED لذلك السطح فقط ولا تخمّن.

Phase 1 — توحيد Contract المظهر:
أنشئ adapter صغيرًا لكل سطح أو shared adapter في نطاق مسموح، بشرط ألا يتحول إلى design system محلي.

المطلوب:
- مصدر حقيقة واحد لكل سطح لاختيار المظهر.
- mode type من @bthwani/ui-kit:
  BThwaniAppearanceMode
- القيم الوحيدة:
  lightPremium
  darkGlass
- default = lightPremium.
- provider يلف التطبيق/السطح من root آمن.
- لا تكسر language/direction/navigation/safe-area.
- لا تجعل الحساب يستخدم state منفصل عن root provider.
- لا duplicate providers غير ضروري.

Phase 2 — تبويب/قسم "المظهر":
في كل تطبيق/سطح له حساب أو إعدادات يجب أن يظهر قسم واضح:

العنوان:
"المظهر"

الخيار الأول:
"فاتح أبيض"
الوصف:
"واجهة فاتحة واضحة، والزجاج يظهر فقط فيما يحدده المطور أثناء مراجعة الشاشات"

الخيار الثاني:
"داكن زجاجي"
الوصف:
"مظهر داكن فاخر مع حواف زجاجية وطبقات واضحة بدون إزعاج بصري"

قواعد UI:
- استخدم AppearanceOptionCard من @bthwani/ui-kit إن كان مناسبًا.
- إذا لم يناسب، استخدم Card/Chip/Button/Text/Surface الرسمية من @bthwani/ui-kit.
- لا تنشئ بطاقة تصميم محلية إذا يمكن استخدام ui-kit.
- الخيار المحدد واضح.
- الضغط يغيّر المظهر فورًا ويحفظه.
- RTL صحيح:
  - النص العربي يمين.
  - الأيقونة والنص في نفس cluster.
  - لا space-between يفصل الأيقونة عن النص.
- إذا لا توجد شاشة حساب/إعدادات في تطبيق معين:
  - أنشئ شاشة/قسم حساب بسيط جدًا باسم "حسابي" أو "الإعدادات" حسب نمط التطبيق.
  - أضف داخله "المظهر".
  - لا تضف وظائف حساب وهمية أو نصوص كثيرة.
  - لا تغير routing بشكل واسع؛ استخدم أضيق مكان ظاهر/متاح في التطبيق.

Phase 3 — تعميم Light Premium:
عند اختيار lightPremium:
- كل التطبيق/السطح يبقى فاتحًا افتراضيًا.
- لا تضف glass في الوضع الفاتح إلا إذا كان محددًا صراحة من الإنسان أو موجودًا مسبقًا ومقبولًا.
- الهدف: baseline light نظيف وموحد.
- كل الخلفيات والبطاقات والنماذج والجداول والصفحات تكون فاتحة ومقروءة.
- لا تظهر أي شاشة dark وهي في lightPremium.
- لا تفرض زجاج على الشاشات الوظيفية في lightPremium.

Phase 4 — تعميم Dark Glass / Dark Premium:
عند اختيار darkGlass:
- كل تطبيق/سطح يتحول إلى داكن.
- كل شاشة تحصل على خلفية dark premium.
- كل نص readable.
- كل card/surface يستخدم dark premium أو glass حسب role.
- الشاشات التجارية/البصرية تستخدم glass أو dark glass أكثر.
- الشاشات الوظيفية والجداول والنماذج تستخدم dark premium readable surfaces.
- لوحة التحكم تكون عملية ومقروءة، لا glass كثيف.
- لا black flat.
- لا white cards صلبة داخل darkGlass إلا بحالة مثبتة ومبررة.
- لا ضعف تباين.
- لا overflow/clipping.
- لا glass مزعج خلف النصوص الطويلة أو المدخلات.

Phase 5 — تطبيقات الموبايل الأربعة:
نفّذ بالتتابع، ولا تنتقل للتطبيق التالي إلا بعد تحقق التطبيق الحالي:

1) app-client
- root provider
- حسابي/المظهر
- حفظ الاختيار
- تطبيق light/dark على كل شاشاته القابلة للوصول
- مراجعة شاشات التجارة والمتجر
- منع تكرار خيارات التوصيل إن وجدت

2) app-partner
- root provider
- حسابي/المظهر
- حفظ الاختيار
- تطبيق light/dark على كل شاشاته
- إدارة المتجر/الطلبات تكون dark premium readable في darkGlass

3) app-captain
- root provider
- حسابي/المظهر
- حفظ الاختيار
- تطبيق light/dark على كل شاشاته
- الخرائط/المهام/الطلبات لا تتحول إلى glass مزعج

4) app-field
- root provider
- حسابي/المظهر
- حفظ الاختيار
- تطبيق light/dark على كل شاشاته
- الزيارات/النماذج/التقارير تكون readable

Phase 6 — الويب ولوحة التحكم:
نفّذ بالتتابع:

1) control-panel/runtime
- الحساب/الإعدادات → المظهر
- lightPremium = لوحة فاتحة واضحة
- darkGlass = لوحة dark premium عملية
- الجداول والنماذج لا تكون glass كثيف
- localStorage آمن مع client boundary
- لا تكسر Next/SSR
- لا تكسر sidebar/navigation/IA

2) webapp/runtime
- المظهر ينعكس على كل صفحات webapp
- lightPremium فاتح افتراضي
- darkGlass dark premium / glass حسب role
- لا تكسر SSR/client boundary

3) website/runtime
- المظهر ينعكس على كل صفحات website إذا كان الموقع يحتوي user-facing theme control أو يمكن ربطه بمصدر مظهر
- إن لم يكن لدى website حساب/إعدادات، لا تخترع تدفق حساب كبير
- أنشئ فقط mechanism آمن لاستهلاك المظهر إذا كان موجودًا، أو اكتب BLOCKED/DEFERRED لهذا السطح مع السبب

Phase 7 — الخدمات والسطوح:
راجع كل خدمة/سطح:
- dsh
- wlt
- knz
- arb
- amn
- esf
- mrf
- snd
- kwd

المطلوب:
- أي شاشة service-owned مستخدمة داخل التطبيقات/الويب يجب أن تستهلك tokens/appearance من @bthwani/ui-kit أو من provider الأعلى.
- لا تترك service-owned screen بألوان hardcoded تكسر darkGlass.
- لا تنشئ theme محلي داخل الخدمة.
- لا تجعل التنفيذ محصورًا في dsh.
- إذا كانت خدمة غير مستخدمة بصريًا حاليًا، وثّق ذلك كـ NO_VISIBLE_SURFACE بدل تعديل عشوائي.
- إذا كانت الخدمة تملك شاشة أو surface، يجب أن تدعم lightPremium و darkGlass حسب القواعد أعلاه.

Phase 8 — منع التكرار والانحراف:
تحقق في كل تطبيق/سطح:
- لا أكثر من قسم "المظهر".
- لا أكثر من source of truth.
- لا duplicate provider غير ضروري.
- لا hardcoded colors.
- لا deep imports من ui-kit.
- لا direct Tamagui خارج ui-kit.
- لا local theme system.
- لا screen-specific theme mapping متكرر.
- لا نص عربي بمحاذاة خاطئة.
- لا icon/text cluster مكسور.
- لا overflow/clipping.
- لا نص داكن على خلفية داكنة.
- لا بطاقة بيضاء صلبة داخل darkGlass بدون سبب.
- لا اختلاف غير مبرر بين light/dark إلا اللون/السطح/الحدود/الظل حسب tokens.

Phase 9 — Verification:
بعد التنفيذ شغّل:

git --no-pager status --short
git --no-pager diff --stat
git --no-pager diff --name-status
git --no-pager diff --check
pnpm -w exec tsc --noEmit

ثم شغّل إن وجدت scripts مناسبة:
pnpm run guard:tamagui-import-boundary
pnpm run guard:i18n-direction:mobile-control-panel

لا تدّعِ نجاح guard إذا لم يتم تشغيله فعليًا.

Phase 10 — Evidence / Screenshots المطلوبة:
اطلب مني بعد التشغيل لقطات شاشة لكل التالي:

Mobile:
1) app-client حسابي/المظهر — light
2) app-client حسابي/المظهر — dark
3) app-client شاشة تجارية/رئيسية أو متجر — light
4) app-client شاشة تجارية/رئيسية أو متجر — dark

5) app-partner حسابي/المظهر — light/dark
6) app-partner شاشة وظيفية — dark

7) app-captain حسابي/المظهر — light/dark
8) app-captain شاشة طلب/مهمة — dark

9) app-field حسابي/المظهر — light/dark
10) app-field شاشة زيارة/نموذج — dark

Web/control:
11) control-panel الحساب/المظهر — light
12) control-panel الحساب/المظهر — dark
13) control-panel صفحة جدول/نموذج — dark
14) webapp صفحة رئيسية/وظيفية — light/dark
15) website صفحة ظاهرة — light/dark إن كان surface قابلًا للتبديل

Services:
16) لقطة واحدة على الأقل لأي service-owned screen تظهر من غير dsh إن وجدت
17) dsh screen بعد التبديل إن كانت dsh ضمن المسار المرئي الحالي

Acceptance Criteria:
اكتب DONE فقط إذا:
- كل تطبيقات الموبايل الأربعة + control-panel + webapp + website + كل service-owned visible surfaces ضمن النظام.
- كل سطح له حساب/إعدادات يحتوي "المظهر".
- كل سطح يحتوي خيارين فقط: فاتح أبيض / داكن زجاجي.
- lightPremium هو الافتراضي.
- lightPremium يجعل كل شيء فاتحًا افتراضيًا.
- darkGlass يجعل كل شيء داكنًا مضبوطًا.
- الشاشات التجارية تستخدم glass/dark glass عند darkGlass بشكل أنيق.
- الشاشات الوظيفية تستخدم dark premium readable عند darkGlass.
- اختيار المستخدم محفوظ لكل تطبيق/سطح.
- لا يوجد source of truth مكرر.
- لا يوجد design system محلي.
- لا direct Tamagui خارج ui-kit.
- لا hardcoded random colors.
- أي شاشة/صفحة/Surface/Component جديد تمت إضافته ضمن التنفيذ يدعم lightPremium و darkGlass من البداية.
- لا تُقبل أي شاشة جديدة إذا كانت مرتبطة بثيم واحد فقط.
- لا تُقبل أي شاشة جديدة إذا استخدمت local theme أو hardcoded colors أو direct Tamagui خارج ui-kit.
- لا تغييرات خارج النطاق.
- لا dependency changes غير مصرح بها.
- diff check PASS.
- TypeScript PASS.
- guards المطلوبة PASS إذا تم تشغيلها.
- تم طلب screenshots المطلوبة.
- أي خدمة لا تملك visible surface موثقة بوضوح كـ NO_VISIBLE_SURFACE.

اكتب BLOCKED إذا:
- لم تجد root/provider آمن لتطبيق/سطح.
- لم تستطع حفظ الاختيار بدون dependency، ولم تكن dependency التخزين مصرح بها وفق السياسة.
- احتجت تعديل جذري في routing.
- احتجت تعديل backend/API/contracts.
- فشل TypeScript بسبب التعديل.
- احتجت تعديل خارج النطاق.
- لم تستطع جعل darkGlass مقروءًا في شاشة وظيفية بدون إعادة تصميم كبيرة.
- لم تستطع تحديد مالك شاشة/سطح ولا يوجد دليل.

المخرجات النهائية:
- DONE أو BLOCKED.
- جدول حسب السطح:
  app-client: DONE/BLOCKED/NO_VISIBLE_SURFACE + الملفات
  app-partner: DONE/BLOCKED/NO_VISIBLE_SURFACE + الملفات
  app-captain: DONE/BLOCKED/NO_VISIBLE_SURFACE + الملفات
  app-field: DONE/BLOCKED/NO_VISIBLE_SURFACE + الملفات
  control-panel: DONE/BLOCKED + الملفات
  webapp: DONE/BLOCKED/DEFERRED + الملفات
  website: DONE/BLOCKED/DEFERRED + الملفات
  dsh/wlt/knz/arb/amn/esf/mrf/snd/kwd: DONE/BLOCKED/NO_VISIBLE_SURFACE + الملفات
- أين تم ربط provider/state لكل سطح.
- أين تم حفظ اختيار المستخدم لكل سطح.
- أين أُضيف قسم "المظهر" لكل سطح.
- هل تمت إضافة @react-native-async-storage/async-storage؟ وأين ولماذا؟
- نتائج أوامر التحقق.
- قائمة screenshots المطلوبة للمراجعة البصرية.

لا تدّعِ PASS / CLOSED / 100% بدون Git evidence + TypeScript + screenshots.
نفّذ هذا الطلب تنفيذًا كاملًا وجذريًا من الألف إلى الياء داخل النطاق المحدد، ولا تتوقف إلا بعد إغلاقه بالأدلة، بصفر فجوات، صفر نقص، صفر تكرار، صفر أخطاء، وبدون الانتقال لأي مهمة أخرى.
```

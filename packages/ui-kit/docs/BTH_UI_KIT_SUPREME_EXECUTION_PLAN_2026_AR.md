<!-- markdownlint-disable MD024 -->

# BTH UI Kit Supreme Execution Plan — 2026

## الخطة التنفيذية المرحلية الصارمة لبناء الحزمة السيادية من الصفر

## 0) الحكم التنفيذي

هذه الخطة لا تبني شاشات.
هذه الخطة تبني **النظام الذي ستولد منه كل الشاشات لاحقًا**.

أي تنفيذ خارج هذا الترتيب يعتبر انحرافًا.
أي توسع في الشاشات قبل اكتمال الحزمة الأساسية يعتبر سابقًا لأوانه.

**الهدف النهائي:**

بناء `@bthwani/ui-kit` كـ **Single Design Operating System** لكل واجهات المنصة المستقبلية.

---

## 1) قواعد تشغيل الخطة

### 1.1 ما الذي نعتبره الآن؟

- الشاشات الحالية = صفر تصميميًا
- لا نأخذ أي شاشة حالية كمرجع جمالي أو بنيوي
- المرجع الوحيد هو النظام المطلوب بناؤه داخل `ui-kit`

### 1.2 ما الذي يُمنع أثناء هذه الخطة؟

- منع توسيع الشاشات كمرجع للحزمة
- منع ترقية patterns من الشاشات قبل اكتمال المراحل المناسبة
- منع إنشاء shared UI authority خارج `ui-kit`
- منع بناء families مشتركة داخل apps أو surfaces
- منع second token/theme/direction system

### 1.3 قاعدة الانتقال بين المراحل

لا تنتقل أي مرحلة إلى التالية إلا إذا:

- اكتملت المهام الأساسية
- تحققت معايير التحقق
- لا توجد blockers مفتوحة في نفس المرحلة
- لا يوجد التفاف محلي يخرق السيادة المركزية

---

## 2) ترتيب التنفيذ الأعلى

### المراحل الكبرى

1. Phase A — Sovereign Authority Lock
2. Phase B — Token OS
3. Phase C — Theme OS
4. Phase D — Direction & Language OS
5. Phase E — Root & Foundation OS
6. Phase F — Primitive OS
7. Phase G — Core Interaction Components OS
8. Phase H — State & Feedback OS
9. Phase I — Navigation & Overlay OS
10. Phase J — Data Display OS
11. Phase K — Quality Proof OS
12. Phase L — Pattern Promotion Gate
13. Phase M — Screen Entry Law

---

## 3) Phase A — Sovereign Authority Lock

## الهدف

ختم السلطة الحاكمة للحزمة ومنع أي UI authority موازية خارجها.

## المطلوب تنفيذه

- اعتماد blueprint السيادي كمرجع أعلى
- تثبيت ownership law
- تثبيت public API law
- تثبيت no-drift law
- تثبيت pattern promotion law
- تثبيت forbidden local authority law
- تثبيت acceptance gate law

## To-Do

- إنشاء/اعتماد ملف parent authority نهائي واحد
- إنشاء/تحديث ملف component constitution النهائي
- إنشاء/تحديث accessibility law النهائي
- إنشاء/تحديث token governance law
- إنشاء/تحديث pattern promotion contract
- إنشاء/تحديث quality gates/rubric/templates
- حسم precedence order بين كل الوثائق

## معايير التحقق

- يوجد parent authority واحد فقط
- لا توجد وثيقتان متنافستان على نفس السلطة
- كل وثيقة متخصصة تشير صراحة إلى parent authority
- توجد قاعدة صريحة تمنع shared UI authority خارج `ui-kit`
- توجد قاعدة صريحة تمنع business logic داخل `ui-kit`

## PASS

- authority map واضح ومختوم
- precedence order واضح
- لا يوجد ambiguity في الملكية

## FAIL

- وجود أكثر من parent authority
- تضارب ملكية بين `ui-kit` و`surfaces` أو `apps`
- غياب قانون منع الانحراف

---

## 4) Phase B — Token OS

## الهدف

بناء نظام tokens صناعي وموحد وقابل للنقل والتوليد.

## المطلوب تنفيذه

- raw scales
- semantic tokens
- aliases
- interaction state tokens
- light/dark/high-contrast contexts support
- layout/breakpoint tokens
- elevation/z-index tokens
- motion tokens
- data-viz tokens

## To-Do

- تعريف domains كاملة للتوكنز
- فصل raw عن semantic بوضوح
- تعريف naming law ثابت
- تعريف alias strategy
- تصميم source schema موحد
- تعريف exports targets للويب والموبايل
- تعريف fallback and deprecation rules

## نطاق التوكنز الإلزامي

- colors
- typography
- spacing
- sizing
- radius
- borders
- opacity
- elevation
- motion
- z-index
- safe area
- breakpoints
- interaction states
- chart/data colors

## معايير التحقق

- لا يوجد second token system خارج `ui-kit`
- كل semantic colors تأتي من token source
- كل scales موحدة باسم وقاعدة ثابتة
- لا يوجد خلط بين raw وsemantic
- التوكنز قابلة للتصدير للويب والموبايل
- التوكنز تسمح بوجود multiple contexts without duplication

## PASS

- token source واحد ومفهوم وقابل للتوليد
- semantic mapping واضح
- readiness للـ CSS/RN outputs

## FAIL

- token files مبعثرة بلا source موحد
- ألوان/spacing/radius كنظام موجودة خارج `ui-kit`
- خلط raw/semantic بشكل فوضوي

---

## 5) Phase C — Theme OS

## الهدف

بناء نظام theme مركزي كامل لكل المنصة.

## المطلوب تنفيذه

- light
- dark
- high-contrast
- system/auto mode
- semantic role mapping
- runtime theme resolution hooks
- web CSS vars output
- RN theme object output

## To-Do

- تعريف theme contract النهائي
- ربط theme contract بالتوكنز
- بناء resolver للمودات
- بناء mapping لسياقات القراءة
- بناء output adapter للويب
- بناء output adapter للموبايل
- تعريف fallback behavior

## معايير التحقق

- لا توجد theme contracts محلية خارج `ui-kit`
- كل theme reads تمر عبر `ui-kit`
- dark/light/high-contrast موجودة رسميًا
- الثيم لا يعتمد على hardcoded local colors
- يمكن تبديل الثيم مركزيًا من نقطة واحدة

## PASS

- theme system مركزي ومتكامل
- semantic roles واضحة ومستقرة

## FAIL

- وجود local dark mode systems
- local semantic color maps
- theme switching يقتضي تغييرًا محليًا في كل surface

---

## 6) Phase D — Direction & Language OS

## الهدف

بناء ownership مركزي كامل لـ RTL/LTR و ar/en.

## المطلوب تنفيذه

- dir ownership
- logical start/end rules
- mirroring rules
- Arabic/English typography mapping
- alignment defaults
- number/date/currency display guidance
- long-label resilience

## To-Do

- تعريف direction contract
- تعريف hooks/helpers الرسمية
- تعريف icon mirroring matrix
- تعريف text alignment laws
- تعريف language-aware typography rules
- تعريف formatting visual rules

## معايير التحقق

- لا توجد local direction systems
- لا توجد local RTL helper families
- كل قرارات الاتجاه تأتي من `ui-kit`
- العربية والإنجليزية متساويتان في الوضوح
- لا تنكسر الواجهة عند تبديل dir/lang

## PASS

- direction ownership كامل داخل `ui-kit`
- لا توجد local patches متكررة

## FAIL

- وجود `isRTL` محلي كنظام بديل
- screen-level directional styling كنمط متكرر
- RTL support شكلي فقط

---

## 7) Phase E — Root & Foundation OS

## الهدف

بناء الجذور والـ foundation المشتركة التي تملك baseline المنصة كاملة.

## المطلوب تنفيذه

- root composition
- provider composition
- web document/body baseline
- mobile app root baseline
- safe-area baseline
- status bar baseline
- overlay host الحقيقي
- focus/reduced-motion/touch helpers

## To-Do

- تثبيت web root adapter
- تثبيت mobile root adapter
- بناء provider tree مركزي
- بناء portal/overlay stack manager فعلي
- بناء safe area wrappers
- بناء status bar policy
- بناء foundation helpers

## معايير التحقق

- 100% من roots تستهلك `ui-kit`
- 0 root provider trees محلية
- overlay host واحد فقط
- body/root visual baseline موحد
- foundation behavior لا يتكرر محليًا

## PASS

- roots موحدة
- provider composition مركزية
- overlay/portal stack مملوك من `ui-kit`

## FAIL

- roots محلية متفرقة
- local providers
- overlay hosts متعددة

---

## 8) Phase F — Primitive OS

## الهدف

بناء الطبقة الأولى التي يجب أن تُبنى فوقها كل شاشة.

## المطلوب تنفيذه

- Box
- Surface
- Text
- Divider
- Stack
- Inline
- Grid
- Scroll wrappers
- SafeArea wrappers
- Focus wrappers
- Visually hidden helpers

## To-Do

- تعريف semantic primitives بوضوح
- ربط كل primitive بالتوكنز والثيم والاتجاه
- تعريف props law
- تعريف style law
- تعريف anti-usage patterns

## معايير التحقق

- كل primitive مرتبط بالتوكنز والثيم والاتجاه
- لا توجد base wrappers محلية بديلة
- يمكن بناء أي composition أساسي من هذه primitives

## PASS

- primitives تكفي كبنية أولية لكل شاشة
- لا يوجد drift في الأساسيات

## FAIL

- primitives مجرد wrappers ضعيفة بلا value
- استمرار بناء base wrappers محلية

---

## 9) Phase G — Core Interaction Components OS

## الهدف

بناء عائلات المكونات المشتركة الأساسية.

## المطلوب تنفيذه

### Action/Input families

- Button
- IconButton
- TextField
- TextArea
- SearchField
- Select/Picker
- SegmentedControl
- Checkbox
- Radio
- Switch
- Chip/Tag/Badge
- Stepper/QuantityControl

## To-Do

- تعريف semantic purpose لكل family
- تعريف all states لكل family
- تعريف accessible behavior
- تعريف visual hierarchy
- تعريف destructive/quiet/secondary variants
- تعريف loading/disabled/error behavior

## معايير التحقق

- 0 duplicate shared families خارج `ui-kit`
- كل family لها purpose واضح
- كل family لها states كاملة
- لا يوجد ambiguity في hierarchy
- كل family قابلة للاستخدام عبر web/mobile

## PASS

- component families مستقرة وموثقة
- behavior and hierarchy واضحان

## FAIL

- تكرار local shared families
- عدم اكتمال الحالات
- غموض في semantics

---

## 10) Phase H — State & Feedback OS

## الهدف

بناء نظام الحالات المشتركة للمنصة كلها.

## المطلوب تنفيذه

- Loading
- Skeleton
- Empty
- NoResults
- Error
- RecoverableError
- Success
- Warning
- Offline
- Unauthorized
- Forbidden
- NotFound
- Retry blocks
- Inline validation
- Stale-data indicators

## To-Do

- تعريف state catalog
- تعريف copy structure للحالات
- تعريف CTA law للحالات
- تعريف visual semantics للحالات
- تعريف أين تُستخدم كل حالة
- تعريف anti-usage rules

## معايير التحقق

- 0 duplicated state shells خارج `ui-kit`
- state grammar ثابتة
- error recovery واضح
- loading/empty/offline states لا تُخترع محليًا

## PASS

- state system موحد وجاهز للاستخدام

## FAIL

- كل شاشة تخترع حالاتها الخاصة
- تكرار local empty/loading/error families

---

## 11) Phase I — Navigation & Overlay OS

## الهدف

بناء navigation families وoverlay system بشكل مركزي.

## المطلوب تنفيذه

### Navigation

- AppBar / PageHeader
- BottomNavigation
- Tabs
- SideNavigation
- Breadcrumb
- FilterBar
- CommandBar/SearchBar

### Overlays

- Dialog
- BottomSheet
- ModalSheet
- Popover
- Menu
- Toast/Snackbar
- AlertDialog
- Confirmation flows

## To-Do

- تعريف hierarchy وقوانين الاستخدام
- تعريف overlay stacking
- تعريف dismiss behavior
- تعريف back/close semantics
- تعريف keyboard/focus behavior
- تعريف navigation roles per platform

## معايير التحقق

- 0 overlay hosts محلية
- 0 second navigation systems مشتركة خارج `ui-kit`
- behavior واضح ومتناسق
- shell/navigation rules موحدة

## PASS

- overlays and navigation governed centrally

## FAIL

- overlay behavior محلي ومتباين
- navigation families متكررة أو متضاربة

---

## 12) Phase J — Data Display OS

## الهدف

بناء عائلات عرض البيانات المشتركة.

## المطلوب تنفيذه

- Card families
- Stat cards
- List rows
- Key-value rows
- Table/DataGrid
- Metric blocks
- Timeline/Activity blocks
- Money presentation blocks
- State labels / status pills
- Entity summary blocks

## To-Do

- تعريف semantic purpose لكل family
- تعريف density modes
- تعريف scan hierarchy
- تعريف responsive behavior
- تعريف empty/loading behavior للعائلات البيانية

## معايير التحقق

- families قابلة لإعادة الاستخدام فعليًا
- المعلومات قابلة للمسح البصري بسرعة
- العرض لا ينهار بين mobile/web
- money/status displays منضبطة مركزيًا

## PASS

- data display system واضح وقوي

## FAIL

- cards/list/table patterns محلية ومبعثرة
- data display غير متسق

---

## 13) Phase K — Quality Proof OS

## الهدف

بناء بيئة إثبات جودة الحزمة نفسها.

## المطلوب تنفيذه

- component lab
- docs site
- token reference
- state gallery
- accessibility review pages
- interaction tests
- visual regression
- screenshot baselines
- usage / anti-usage examples

## To-Do

- بناء stories لكل family أساسية
- بناء state permutations
- بناء token documentation
- بناء theme/direction demos
- بناء accessibility scenarios
- بناء regression pipeline

## معايير التحقق

- يمكن فحص كل family بمعزل
- يمكن فحص جميع states
- يوجد visual proof
- يوجد interaction proof
- يوجد accessibility proof
- لا تعتمد الحزمة على الثقة أو الانطباع فقط

## PASS

- quality proof حي ومستخدم فعليًا

## FAIL

- الحزمة بلا lab أو proof system
- claims بلا evidence

---

## 14) Phase L — Pattern Promotion Gate

## الهدف

السماح بترقية screen patterns إلى shared authority فقط عند استحقاقها.

## المطلوب تنفيذه

- rule for promotion
- evidence thresholds
- semantic stability test
- anti-usage boundaries
- de-duplication review

## شروط الترقية

لا يترقى أي pattern إلى `ui-kit` إلا إذا:

- تكرر فعليًا عبر أكثر من screen/surface/service
- ثبت معناه الدلالي
- لم يكن business-specific
- كان reusable دون تشويه النظام
- وُثّق usage وanti-usage
- اجتاز review وcleanup

## Families المرشحة لاحقًا

- ListScreenShell
- DetailShell
- FormShell
- DashboardShell
- WorkspaceShell
- CommandCenterShell
- Review/ConfirmShell
- Map/LiveActivityShell

## PASS

- patterns لا تُرقّى إلا بدليل

## FAIL

- رفع patterns لمجرد التشابه الشكلي أو الاستعجال

---

## 15) Phase M — Screen Entry Law

## الهدف

ضمان أن كل شاشة مستقبلية تدخل من بوابة النظام لا خارجه.

## المطلوب تنفيذه

- screen intake template
- design gate input
- acceptance rubric
- usage of approved primitives/components/patterns only
- forbid freeform local design systems

## التسلسل الإلزامي لأي شاشة جديدة

1. Variant
2. Archetype
3. Core job
4. Primary action
5. Required states
6. Reuse map
7. Accessibility plan
8. RTL/LTR plan
9. Gate review
10. Only then implementation

## PASS

- لا شاشة خارج القانون

## FAIL

- بناء شاشة مباشرة من الذوق أو الحاجة السريعة

---

## 16) معايير النجاح النهائية للخطة

### Success Criteria for the Package

- authority sealed
- token OS complete
- theme OS complete
- direction/language OS complete
- root/foundation OS complete
- primitives complete
- core interaction families complete
- state system complete
- navigation/overlay system complete
- data display families complete
- quality proof OS live
- pattern promotion gate active
- no-drift regime enforced

### Success Criteria for Governance

- 0 shared UI authorities outside `ui-kit`
- 0 second token/theme/direction systems
- 0 duplicated shared families outside `ui-kit`
- 100% root ownership centralized
- 100% shared UI consumed from `ui-kit`

### Success Criteria for Future Screen Readiness

- أي شاشة جديدة يمكن بناؤها من النظام دون اختراع نظام محلي
- أي تحسين عام ينعكس مركزيًا
- أي drift يُكتشف ويُمنع مبكرًا

---

## 17) التحذير الحاسم

أكبر خطأ ممكن الآن هو:

- التوسع في الشاشات قبل ختم الحزمة
- أو بناء حزمة شكلية جميلة لكن غير سيادية
- أو بناء components كثيرة بدون governance
- أو بناء design system من دون proof OS

هذا سيعيد نفس المشكلة لاحقًا:

- drift
- duplication
- inconsistent UX
- local patches
- collapse under growth

---

## 18) الخلاصة النهائية

الترتيب الصحيح ليس:

- نبني شاشات كثيرة ثم نحاول توحيدها لاحقًا

الترتيب الصحيح هو:

- نبني النظام السيادي أولًا
- ثم ندخل أي شاشة مستقبلية من خلاله فقط

## الصياغة النهائية الحاكمة

> Build the UI Kit first as the sovereign design operating system, then allow every future screen to exist only through that system.

<!-- markdownlint-enable MD024 -->

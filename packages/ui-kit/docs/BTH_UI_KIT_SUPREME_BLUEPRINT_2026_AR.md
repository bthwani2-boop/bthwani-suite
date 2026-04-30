# bthwani UI Kit Supreme Blueprint — 2026

> NOTE (example-only): This blueprint contains canonical branding identifiers. Do not embed runtime secrets in docs. Replace runtime tokens with placeholders like `__BTHWANI_*__` and manage secrets via vault/CI. Proposed placeholder replacements are in kdt/merge-run/.../proposed/remediations/patches/

## النسخة السيادية الصفرية النهائية لبناء أقوى حزمة UI Kit للمنصة كاملة

## 0) الحكم التنفيذي النهائي

نعم، تم أخذ هدف **أقوى وأفضل واجهات عصرية وفاخرة وحديثة وذكية وسهلة ومبهرة** في الاعتبار بالكامل داخل هذه النسخة.

لكن بصياغة معيارية صحيحة:

- لا نعتمد على ادعاء إنشائي مثل: "سنكون الأفضل عالميًا".
- نعتمد على بناء **نظام تصميم وتشغيل واجهات** يجعل الوصول إلى هذا المستوى ممكنًا وقابلًا للقياس والفرض والتحقق.
- الهدف هنا هو: **أعلى مستوى عملي ومقاس من جودة الواجهات وتجربة المستخدم عبر كل أسطح bthwani**.

هذه الوثيقة لا تعتبر الشاشات الحالية مرجعًا.

**الاعتماد الرسمي في هذه النسخة:**

- تعامل كل الشاشات الحالية كأنها غير موجودة تصميميًا.
- تعتبر الحزمة المرجعية الناتجة هنا هي **Source of Truth** التي ستُبنى عليها كل شاشة مستقبلًا.
- لا تُسمح أي شاشة جديدة خارج هذا النظام.

---

## 1) الهدف الحقيقي من الحزمة

هذه الحزمة ليست مجلد مكونات.

هذه الحزمة يجب أن تصبح:

- نظام تشغيل تصميمي للمنصة
- السلطة البصرية الوحيدة المشتركة
- السلطة السلوكية الوحيدة المشتركة
- السلطة الوحيدة للـ tokens / themes / direction / root composition / states / shared patterns
- النظام الذي يضمن أن أي شاشة جديدة تخرج بنفس الجودة، ونفس السلاسة، ونفس الرقي، ونفس سهولة الاستخدام

**القاعدة الحاكمة:**

> No shared UI authority outside `@bthwani/ui-kit`.

لكن في المقابل:

> No business logic authority inside `@bthwani/ui-kit`.

أي أن `ui-kit` يملك **كيف يبدو الشيء وكيف يتصرف بصريًا وتفاعليًا**، بينما التطبيقات والخدمات تملك **ماذا يفعل الشيء ومتى ولماذا**.

---

## 2) النتيجة المستهدفة من هذه الحزمة

الحزمة النهائية يجب أن تضمن أن كل واجهات المنصة تكون:

- عصرية وحديثة فعلًا
- فخمة وراقية بدون ابتذال بصري
- ذكية في تقليل الخطوات والحمل الذهني
- سهلة جدًا في الفهم والتنفيذ
- سريعة في الوصول للفعل الأساسي
- متناسقة عبر كل التطبيقات والويب
- RTL-first مع ar/en على مستوى حقيقي لا شكلي
- قابلة للتوسع بدون انهيار بصري أو سلوكي
- قابلة للضبط من مكان مركزي واحد
- قابلة للقياس والاختبار قبل اعتماد أي شاشة

### الترجمة العملية لهذا الهدف

لا يكفي أن تكون الشاشة جميلة.

الشاشة المقبولة يجب أن تكون:

- جميلة
- واضحة
- سهلة
- قابلة للوصول
- منضبطة بالنظام
- قابلة للصيانة
- قابلة للتوسع
- قابلة للتحسين المركزي

---

## 3) المرجع العالمي الذي تُبنى عليه هذه النسخة

هذه النسخة تُبنى على مبادئ منسجمة مع أحدث المراجع الرسمية العالمية في:

- Human Interface Guidance من Apple
- Material Design 3 كمنظومة قابلة للتكييف لا للتقليد الأعمى
- WCAG 2.2 كمعيار وصولية أساسي
- Design Tokens Community Group كاتجاه معياري لتوحيد التوكنز وتبادلها بين الأدوات والمنصات

لكن bthwani لا ينسخ أي نظام منها كما هو.

**القرار السيادي:**

- نستفيد من أفضل ما في هذه الأنظمة
- نعيد صياغته داخل نظام bthwani الخاص
- ننتج هوية وتجربة موحدة ومناسبة لسوقنا ومنصتنا

---

## 4) الفلسفة العليا لتجربة المستخدم

### 4.1 مبادئ غير قابلة للتفاوض

1. الوضوح قبل الإبهار
2. الفعل قبل الزخرفة
3. الانسياب قبل الكثافة
4. الثقة قبل الاستعراض
5. التناسق قبل التنوع الشكلي
6. النظام قبل الارتجال
7. القابلية للتوسع قبل الحلول السريعة
8. الوصولية جزء من الجودة، لا إضافة لاحقة
9. RTL والعربية جزء من الأصل، لا patch لاحق
10. كل قرار تصميمي يجب أن يقلل التردد والخطأ والزمن للوصول إلى الهدف

### 4.2 تعريف الفخامة الصحيح

الفخامة هنا لا تعني:

- الزجاجية المبالغ فيها
- الظلال الثقيلة
- الحركة الاستعراضية
- تكديس المؤثرات

الفخامة الصحيحة تعني:

- هدوء بصري راقٍ
- نسب ومسافات دقيقة
- hierarchy قوي
- توازن لوني ذكي
- مكونات ذات حضور وثقة
- سلاسة في الانتقال والعمل
- إحساس premium بدون ضجيج

### 4.3 تعريف الذكاء الصحيح

الذكاء هنا لا يعني تعقيدًا أو كثرة خصائص.

الذكاء هنا يعني:

- الافتراضي الصحيح
- أقل عدد خطوات ممكن
- كشف تدريجي للمعلومات
- أعلى وضوح للحالة الحالية
- اقتراح الفعل التالي بشكل طبيعي
- حذف كل ما لا يخدم المهمة الحالية

---

## 5) القانون الأعلى للحزمة

## bthwani UI Kit Sovereignty Law

يجب أن يملك `@bthwani/ui-kit` حصريًا:

- root UI composition
- theme system
- token system
- direction engine
- typography system
- spacing / radius / elevation / motion scales
- primitives
- shared components
- shared state shells
- shared overlays
- shared navigation families
- shared layout laws
- shared responsive laws
- shared accessibility UI behaviors
- shared micro-interaction behaviors
- shared screen patterns التي تمت ترقيتها نظاميًا

وتملك التطبيقات والأسطح فقط:

- route composition
- screen composition
- feature content
- business logic
- view-model logic
- data binding
- service-specific decisions
- local one-off composition غير المرقاة بعد إلى النظام

---

## 6) ما الذي يجب أن تضمنه الحزمة فعليًا

الحزمة يجب أن تضمن من مكان واحد فقط:

- شكل الأزرار
- شكل الحقول
- hierarchy النصوص
- سلوك الثيم
- سلوك dark/light/high-contrast
- سلوك RTL/LTR
- safe areas
- overlay stacking
- loading/empty/error/offline families
- screen shell rhythm
- spacing cadence
- card grammar
- list density
- headers
- feedback language patterns
- motion discipline
- focus/hover/pressed/disabled semantics

ويجب ألا تكتفي الحزمة بتحسين الشكل، بل يجب أن تفرض مركزيًا:

- وضوح المهمة الأساسية
- وضوح الفعل الرئيسي
- تقليل الخطوات غير الضرورية
- تقليل الحمل الذهني
- وضوح الحالات واكتمالها
- سهولة التعافي من الخطأ
- اتساق السلوك بين كل الشاشات

ويجب أن تكون مصممة لمنع الانحراف قبل حدوثه، لا للسماح به ثم محاولة إصلاحه لاحقًا، ولذلك يجب أن تمنع:

- local styling systems
- shared components outside `ui-kit`
- الشاشات العشوائية أو غير المنهجية
- التنافس بين أكثر من primary action
- الزحام والضجيج البصري

**الاختبار الحاسم:**

إذا احتاج تحسين بصري أو سلوكي عام إلى تعديل 7 تطبيقات أو 20 شاشة يدويًا، فالحزمة ليست مالكة فعليًا بعد.

---

## 7) طبقات النظام النهائية المطلوبة

## Layer 0 — Authority OS

هذه الطبقة تحكم كل شيء ولا تتكرر خارج `ui-kit`:

- parent authority
- design gate contract
- component constitution
- accessibility law
- microcopy law
- token governance law
- pattern promotion law
- cleanup law
- review rubric
- template library

## Layer 1 — Token OS

يجب أن تملك الحزمة نظام tokens صناعيًا كاملًا يشمل:

- raw scales
- semantic tokens
- aliases
- modes
- density levels
- interaction states
- elevation tiers
- z-index tiers
- spacing scale
- radius scale
- typography scale
- motion scale
- border scale
- opacity scale
- data-viz tokens
- chart semantics
- safe-area/layout tokens
- breakpoints and adaptive tokens

### متطلب معياري مهم

يجب أن يُبنى token source بصيغة قابلة للنقل والتوليد، لا مجرد ملفات مبعثرة داخل الكود.

## Layer 2 — Theme OS

يجب أن تدعم الحزمة مركزيًا:

- light theme
- dark theme
- high-contrast theme
- system/auto resolution
- product/environment brand mapping عند الحاجة
- semantic color mapping
- CSS vars output
- React Native theme object output

## Layer 3 — Direction & Language OS

يجب أن تدير الحزمة مركزيًا:

- `dir`
- logical start/end
- alignment defaults
- icon mirroring rules
- row/column mirroring laws
- Arabic/English typography mapping
- number/date/currency visual treatment
- long-label resilience

## Layer 4 — Foundation OS

تشمل:

- providers
- root composition
- safe-area baselines
- status bar behavior
- html/body baseline
- body classes / CSS vars binding
- accessibility helpers
- reduced-motion helpers
- focus-ring helpers
- touch-target helpers
- responsive/layout primitives

## Layer 5 — Primitive OS

الحد الأدنى:

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

## Layer 6 — Interaction Components OS

الحد الأدنى النهائي:

- Button family
- IconButton
- FAB where needed
- TextField
- TextArea
- SearchField
- Select / Picker
- SegmentedControl
- Checkbox
- Radio
- Switch
- Chip
- Tag
- Badge
- QuantityStepper
- Date/Time input primitives where needed

## Layer 7 — State & Feedback OS

الحد الأدنى النهائي:

- Loading states
- Skeleton states
- Empty states
- No-results states
- Error blocks
- Recoverable error states
- Inline validation
- Success confirmations
- Warning banners
- Offline blocks
- Unauthorized / Forbidden / NotFound blocks
- Retry patterns
- Stale-data indicators

## Layer 8 — Navigation OS

الحد الأدنى النهائي:

- Mobile top bar
- Page header
- Bottom navigation
- Tabs
- Segmented navigation
- Side navigation
- Breadcrumbs where relevant
- Filter bars
- Command/search bar
- Section navigation laws

## Layer 9 — Overlay OS

الحد الأدنى النهائي:

- Dialog
- Bottom sheet
- Modal sheet
- Popover
- Menu
- Toast / Snackbar
- Alert dialog
- Confirmation flows
- Overlay host / portal / stack manager

## Layer 10 — Data Display OS

الحد الأدنى النهائي:

- Card families
- Stat cards
- List rows
- Key-value rows
- Table / DataGrid
- Timeline / Activity blocks
- Metric blocks
- Money presentation blocks
- Status pills / state labels
- Entity summary blocks

## Layer 11 — Screen Pattern OS

هذه لا تُرقّى إلا إذا ثبتت فعليًا من الشاشات:

- ListScreenShell
- DetailShell
- FormShell
- DashboardShell
- WorkspaceShell
- CommandCenterShell
- Review/ConfirmShell
- Map/LiveActivityShell

## Layer 12 — Quality Proof OS

هذه طبقة إلزامية وليست اختيارية:

- component lab
- token reference pages
- state gallery
- accessibility review pages
- interaction tests
- visual baselines
- screenshot regression
- documentation site
- usage and anti-usage examples

---

## 8) متطلبات التجربة الفاخرة والحديثة والذكية

## 8.1 فخامة بصرية منضبطة

يجب أن توفر الحزمة:

- hierarchy قوي جدًا
- contrast واضح ومحترم
- أسطح نظيفة ومتدرجة بذكاء
- shadows/elevation منضبطة
- radii دقيقة ومتناسقة
- مظهر premium calm
- micro-motion راقٍ جدًا وليس صاخبًا

## 8.2 سهولة استخدام عالية جدًا

يجب أن تفرض الحزمة:

- primary CTA واضح في كل سياق
- أقل عدد نقرات ممكن للمهمة الأساسية
- progressive disclosure
- no clutter
- no duplicate choices
- no competing primaries
- defaults ذكية
- recoverability واضحة

## 8.3 ذكاء تشغيلي داخل الواجهة

يجب أن تسمح الحزمة بأنماط ذكية مثل:

- next-best-action blocks
- contextual assistance
- inline hints غير المزعجة
- explainable AI prompts when needed
- prefill/smart defaults

لكن تمنع:

- AI noise
- fake smartness
- distracting assistant UI
- أي سلوك يسرق الانتباه من المهمة الأساسية

## 8.4 ثقة وتجربة مريحة

يجب أن تضمن الحزمة:

- أزرار واضحة النتائج
- حالات واضحة جدًا
- feedback سريع وواضح
- عدم مفاجأة المستخدم بتغيرات غير متوقعة
- صياغة microcopy هادئة ومحددة ومحترمة

---

## 9) القانون الذهبي لبناء أي شاشة مستقبلية

أي شاشة جديدة يجب أن تمر بهذا التسلسل:

1. تحديد variant
2. تحديد archetype
3. تحديد core job
4. تحديد primary action
5. تحديد required states
6. تحديد reusable primitives/components/patterns من `ui-kit`
7. تحديد ما إن كانت تحتاج pattern جديدًا أم لا
8. المرور عبر design gate
9. المرور عبر accessibility gate
10. المرور عبر consistency/pattern gate
11. عدم بدء التنفيذ قبل اكتمال ذلك

**ممنوع**:

- تصميم شاشة مباشرة من الذوق
- اختراع spacing محلي
- اختراع hierarchy محلي
- اختراع state shells محلية
- إدخال raw visual logic كنظام مستقل

---

## 10) قانون الترقية إلى shared patterns

ليس كل شيء يتكرر مرتين يجب أن يترقى تلقائيًا.

الترقية إلى `ui-kit` لا تتم إلا عند توفر الشروط التالية كلها:

- تكرار حقيقي عبر أكثر من شاشة أو أكثر من surface أو أكثر من service
- ثبات دلالي semantic stability
- عدم كونه business-specific composition
- إمكانية إعادة استخدامه دون تشويه النظام
- وجود retained-screen evidence
- وجود anti-usage boundaries واضحة

إذا لم تتحقق هذه الشروط:

- يبقى Local Composition
- ولا يُرفع إلى shared authority بعد

---

## 11) القوانين القطعية التي يجب فرضها

### 11.1 ممنوعات قطعية

إذا وُجد أي مما يلي، فالمركزية مكسورة:

- local ThemeProvider
- local DirectionProvider
- local token system
- local semantic color map كنظام
- local shared Button family
- local shared Card/Input family
- local overlay host
- local duplicated state shells
- deep imports إلى internals داخل `ui-kit`
- root provider trees محلية موازية
- second design system بأي شكل

### 11.2 ممنوعات تصميمية

- أكثر من primary action متنافسة في نفس القرار
- كثافة معلومات بلا hierarchy
- decorative motion في decision zones
- reliance on color alone
- placeholder-only labels
- local RTL patches بدل ownership مركزي
- visual inconsistency بين الشاشات المتقاربة وظيفيًا

### 11.3 ممنوعات معمارية

- business logic داخل `ui-kit`
- service-owned widgets داخل `ui-kit` قبل إثبات reuse
- raw value systems خارج token authority
- pattern promotion بدون evidence

---

## 12) معايير PASS الرقمية للحزمة نفسها

لكي نعلن أن `ui-kit` أصبح سياديًا بحق، يجب الوصول إلى الحالة التالية:

### 12.1 مركزية السلطة

- 0 shared UI authorities خارج `ui-kit`
- 0 local root provider trees موازية
- 0 local theme systems
- 0 local direction systems
- 0 second token systems

### 12.2 مركزية الاستهلاك

- 100% من الجذور تستهلك root adapters من `ui-kit`
- 100% من shared primitives تأتي من `ui-kit`
- 100% من shared component families تأتي من `ui-kit`
- 100% من shared state shells تأتي من `ui-kit`
- 100% من RTL/LTR ownership تأتي من `ui-kit`
- 100% من theme/token ownership تأتي من `ui-kit`

### 12.3 نضج الحزمة

- documented public API
- token build pipeline
- light/dark/high-contrast support
- component lab حي
- stories/state gallery
- accessibility verification
- visual regression baseline
- interaction test coverage للعائلات الحرجة

### 12.4 صلاحية التوسع

- أي تحسين عام في typography/theme/spacing/button states/cards/headers يجب أن ينعكس تلقائيًا على كل المستهلكين ضمن scope الـ shared authority
- أي مكون جديد يجب أن يدخل عبر constitution + review + proof

### 12.5 قابلية القياس والقبول

- لا شاشة تُقبل إلا إذا اجتازت gates واضحة
- لا شاشة تُقبل إلا إذا كانت مكتملة الحالات
- لا شاشة تُقبل إلا إذا كانت منسجمة مع الهوية
- لا شاشة تُقبل إلا إذا كانت RTL/ar + en صحيحة
- لا شاشة تُقبل إلا إذا كانت accessible وقابلة للتوسع

---

## 13) معايير PASS للشاشة الواحدة

لا تُعتمد أي شاشة مستقبلية إلا إذا حققت حدًا أدنى من المعايير التالية:

- واضحة خلال ثوانٍ قليلة
- primary action واضح بلا لبس
- states كاملة
- Arabic/English parity سليمة
- RTL/LTR correctness سليمة
- accessibility سليمة
- لا يوجد drift بصري أو سلوكي عن النظام
- المكونات كلها من الحزمة أو compositions قانونية فوقها
- لا يوجد ازدحام أو قرارات متنافسة
- يمكن تحسينها مركزيًا لاحقًا دون كسرها

---

## 14) قياسات تجربة المستخدم التي يجب أن تبني عليها الحزمة

الحزمة نفسها يجب أن تُصمم لتدفع كل شاشة نحو هذه النتائج:

- تقليل زمن الوصول لأول فعل ذي معنى
- تقليل عدد الخطوات للمهمة الأساسية
- رفع سرعة الفهم
- تقليل التردد
- تقليل الأخطاء القابلة للتجنب
- رفع وضوح الحالة الحالية
- رفع وضوح النتيجة المتوقعة من كل CTA
- جعل recovery path واضحًا جدًا
- الحفاظ على الراحة البصرية عبر الجلسات الطويلة

هذه القياسات يجب أن تظهر في:

- review rubric
- screen templates
- acceptance gates
- usability review

---

## 15) نظام Typography النهائي المطلوب

لأن المنصة عربية/إنجليزية وRTL-first، يجب أن يكون typography system متقدمًا، لا مجرد font sizes.

يجب أن يشمل:

- text roles واضحة جدًا
- display/headline/title/body/label/caption families
- responsive scaling rules
- Arabic-first readability tuning
- English parity
- line-height law
- letter-spacing law عند الحاجة
- number styling law
- money/price emphasis law
- data density text variants
- long label resilience

**الهدف:**

الواجهة يجب أن تبدو premium وواضحة وسهلة في العربية كما في الإنجليزية، لا أن تكون نسخة مترجمة فقط.

---

## 16) نظام Layout & Density النهائي المطلوب

يجب أن تفرض الحزمة قوانين layout ثابتة:

- spacing cadence
- section rhythm
- content width laws
- card density laws
- list density laws
- header/content/action separation
- compact/comfortable/dense modes where relevant
- touch-safe density on mobile
- scan-efficient density on web/control surfaces

هذا ضروري لتحقيق:

- الفخامة
- السرعة
- الوضوح
- سهولة المسح البصري

---

## 17) نظام Motion النهائي المطلوب

الحركة يجب أن تكون:

- meaningful
- short
- supportive
- calm
- never decorative in decision zones
- reduced-motion aware

ويجب أن يشمل:

- enter/exit durations
- emphasis transitions
- feedback micro-motion
- sheet/dialog transitions
- loading motion discipline
- interruptive motion guardrails

---

## 18) الوصولية ليست اختيارًا

يجب أن يُبنى النظام من البداية ليحترم:

- WCAG 2.2 كخط أساس
- keyboard/focus safety حيث ينطبق
- touch target safety
- semantics and accessible names
- contrast
- dynamic text / reflow resilience
- screen-reader readiness
- color-independent meaning
- reduced-motion respect
- mobile accessibility guidance where relevant

أي فخامة أو جمال بصري يخالف هذه القواعد يعتبر فشلًا، لا نجاحًا.

---

## 19) ما الذي يجب أن نفعله الآن فعليًا

بما أننا نتعامل مع الشاشات الحالية كأنها صفر، فالترتيب الصحيح هو:

### Phase A — Seal the Sovereign Authority

- اعتماد هذه الوثيقة كمرجع أعلى
- ختم ownership model
- ختم public API rules
- ختم no-drift rules
- ختم pattern promotion rules

### Phase B — Build Token & Theme OS

- تصميم token source صناعي
- بناء semantic token system
- بناء light/dark/high-contrast
- بناء CSS/RN outputs

### Phase C — Build Foundation & Root OS

- root adapters
- providers
- direction engine
- accessibility helpers
- safe-area/layout baseline
- overlay host الحقيقي

### Phase D — Build Primitive & Core Component OS

- primitives
- button family
- input family
- state family
- navigation primitives
- overlay primitives
- data display basics

### Phase E — Build Quality Proof OS

- component lab
- stories
- token docs
- state gallery
- a11y review pages
- visual regression
- interaction tests

### Phase F — Begin Screen Design From This System Only

- أي شاشة جديدة تبدأ من الحزمة فقط
- لا يُسمح بالشاشات الحرة أو المحلية خارجها

---

## 20) المبدأ النهائي الذي يجب اعتماده

نحن لا نريد "حزمة جيدة".

نحن نريد:

- حزمة شاملة
- حزمة كاملة
- حزمة منظمة
- حزمة معيارية
- حزمة قابلة للقياس
- حزمة تمنع الانحراف
- حزمة تنتج واجهات جميلة وسهلة وراقية وذكية بشكل متكرر، لا بالصدفة

## الصياغة الحاكمة النهائية

> `@bthwani/ui-kit` must become the single design operating system for every future bthwani screen.

والمعنى العملي لهذه الجملة:

- لا شاشة خارج النظام
- لا مكون مشترك خارج النظام
- لا ثيم خارج النظام
- لا اتجاه خارج النظام
- لا tokens خارج النظام
- لا state shells خارج النظام
- لا shared patterns خارج النظام
- لا قبول لأي واجهة ما لم تمر عبر النظام

## الجملة الحاكمة الحاسمة

> The UI Kit must not merely enable good screens; it must make weak screens difficult to produce and impossible to approve.

والمعنى العملي لها:

- الحزمة يجب أن تفرض الجودة لا أن تقترحها فقط
- الشاشة الضعيفة أو العشوائية يجب أن تصبح خارجة عن القانون منذ مرحلة الدخول
- أي تحسين عام يجب أن ينعكس مركزيًا على كل الشاشات
- أي توسع لاحق يجب أن يولد من نفس العائلة ونفس القواعد ونفس الهوية

---

## 21) الخلاصة التنفيذية النهائية

نعم، **تم أخذ هدف أقوى وأفضل وأجمل وأسهل وأفخم وأذكى واجهات وتجربة مستخدم في الاعتبار بالكامل**.

وفي هذه النسخة الجديدة تم تثبيت القرار التالي:

- نهمل الشاشات الحالية عمليًا
- نبني `ui-kit` أولًا كنظام سيادي كامل
- نجعل كل شاشة مستقبلية ابنًا مباشرًا لهذا النظام
- نقيس الجودة قبل الاعتماد
- نمنع أي drift أو اختراع محلي خارج الحزمة

هذه ليست وثيقة تحسين package.

هذه وثيقة **تأسيس النظام الأعلى الذي سيولد كل واجهات المنصة لاحقًا**.

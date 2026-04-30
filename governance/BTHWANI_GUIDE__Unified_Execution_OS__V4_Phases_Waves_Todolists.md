---
generatedFrom: governance/BTHWANI_GUIDE__Unified_Execution_OS__V4_Phases_Waves_Todolists.md
generatedAt: 2026-04-30T04:48:37.3388761+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Extracted Legacy Governance — BTHWANI GUIDE

Status: LEGACY_EXTRACTED_CANONICAL_REVIEW
Source: `docs/governance/BTHWANI_GUIDE__Unified_Execution_OS__V4_Phases_Waves_Todolists.md`
Source SHA256: `d24572a7d564cfddbd00ec7d49643c206556a1cc08340a29901f2022a4f2265e`
Extraction session: `FIX_LEGACY_EXTRACTED_METADATA_SAFE-20260429-220722`

## Extraction Rule

This file preserves rich content from docs/governance/ before the legacy root is deleted later.

This is not final canonical policy by itself. Any rule inside this extracted file must be promoted explicitly into a canonical governance file before it becomes active truth.

---

# BTHWANI GUIDE

## Unified Execution Operating System — V4

### الدليل التنفيذي اليدوي الدقيق — نسخة V4 المبنية على: مرحلة واضحة + موجات واضحة + TodoList واضحة + معايير تحقق واضحة

---

# 0. وضع هذا الملف

هذا الملف هو نسخة تنفيذية مدمجة هدفها:

- دمج أقوى ما في الدليل zero-base
- دمج أقوى ما في دليل service execution pack
- دمج أقوى ما في الدليل الموحّد canonical
- تقديمها بقالب بسيط جدًا وسهل القراءة والتنفيذ اليدوي

هذا الملف **ليس** شرحًا نظريًا عامًا.
وهذا الملف **ليس** مجرد outline.
وهذا الملف **ليس** مجرد قانون عام بلا خطوات.

هذا الملف وظيفته أن يجيب بوضوح على:
- ما الذي أفعله الآن؟
- ما الذي لا أفعله الآن؟
- ما الملفات التي يجب أن توجد؟
- ما الذي يجب أن ينجز داخل كل موجة؟
- كيف أعرف أني نجحت؟
- متى أنتقل للمرحلة التالية؟

---

# 1. القانون التنفيذي الحاكم

الترتيب الحاكم للمشروع هو:

**Foundation → UX / Flows / Screens → Screen/API Matrix → Gap Map → Master OpenAPI → Generate/Verify → Binding → Runtime Truth → Runtime Mode → Production-like Verification → Evidence / Sign-off**

ممنوع:
- API-first
- Binding-first
- Runtime-first
- Big-Bang
- Full-stack-first
- فتح عدة خدمات استهلاكية عميقة في نفس الوقت
- claim بلا evidence
- الانتقال بين المراحل بلا تحقق

---

# 2. شجرة الريبو القياسية المختصرة

```text
bthwani-suite/
├─ apps/
│  ├─ mobile/
│  │  ├─ app-client/
│  │  ├─ app-partner/
│  │  ├─ app-captain/
│  │  └─ app-field/
│  └─ web/
│     ├─ control-panel/
│     ├─ webapp/
│     └─ website/
├─ services/
│  ├─ dsh/
│  ├─ wlt/
│  ├─ snd/
│  ├─ kwd/
│  ├─ esf/
│  ├─ mrf/
│  ├─ amn/
│  ├─ arb/
│  └─ knz/
├─ packages/
│  ├─ ui-kit/
│  ├─ surfaces/
│  ├─ api-types/
│  └─ api-clients/
├─ contracts/
│  ├─ master/
│  │  └─ Master_OpenAPI.yaml
│  └─ changes/
├─ docs/
│  ├─ bootstrap/
│  ├─ architecture/
│  └─ services/
├─ governance/
├─ kdt/
│  └─ volatile/registry/runs/
├─ runtime/
│  └─ local/
└─ root files...
```

---

# 3. الملكية القياسية

- `apps/*` = shells only
- `packages/ui-kit` = design system only
- `packages/surfaces` = screens / flows / view composition
- `packages/api-types` = generated types only
- `packages/api-clients` = generated clients / thin adapters only
- `services/<service-id>` = runtime truth and operational logic
- `contracts/master/Master_OpenAPI.yaml` = API source of truth
- `runtime/local` = local runtime execution plane
- `docs/services/<service-id>` = operating pack التنفيذي للخدمة

---

# 4. حزمة الخدمة القياسية

لكل خدمة يجب أن يكون داخل:
`docs/services/<service-id>/`

على الأقل:

- `00_SERVICE_PROFILE.md`
- `01_ACTOR_CONTEXT_MATRIX.md`
- `02_OPERATION_REGISTRY.csv`
- `03_JOURNEY_MAP.md`
- `04_SCREEN_REGISTRY.csv`
- `05_SCREEN_RATIONALIZATION.md`
- `06_SCREEN_PURPOSE_LOCK.csv`
- `07_BUILD_QUEUE.csv`
- `SERVICE_BLUEPRINT.md`
- `09_WAVE_MAP.md`
- `10_UI_KIT_PREREQS.csv`
- `11_CODE_TARGETS.csv`
- `12_STATE_COVERAGE.csv`
- `13_SCREEN_API_MATRIX.csv`
- `14_GAP_MAP.md`
- `15_CONTRACT_DELTAS.md`
- `16_GENERATE_VERIFY.md`
- `17_BINDING_TARGETS.csv`
- `18_RUNTIME_TARGETS.csv`
- `19_PROOF_PLAN.md`
- `20_CLOSURE_REPORT.md`

---

# 5. القالب البسيط المستخدم في كل مرحلة

كل مرحلة في هذا الملف ستمشي هكذا:

## الهدف
ما معنى المرحلة ولماذا نحتاجها الآن.

## الناتج المطلوب
ما الملفات أو القرارات أو المخرجات التي يجب أن توجد بعد انتهاء المرحلة.

## الموجات
كل مرحلة تحتوي موجات بسيطة وواضحة.
وفي كل موجة يوجد فقط:
- **ماذا ننجز**
- **TodoList**
- **معايير تحقق**
- **شرط العبور**

## ممنوعات المرحلة
ما الذي لا يجب أن يحدث الآن.

هذا القالب بسيط، لكنه دقيق.

---

# 6. القالب البسيط للموجة

## اسم الموجة
### ماذا ننجز
وصف مباشر جدًا لما يجب أن يحصل.

### TodoList
- [ ] ...
- [ ] ...
- [ ] ...
- [ ] ...

### معايير تحقق
- ...
- ...
- ...

### شرط العبور
جملة قصيرة تحدد متى يسمح بالانتقال.

---

# 7. المراحل التنفيذية

# PHASE 00 — REPO RESET DECISION

## الهدف

حسم القرار النهائي: البناء من الصفر داخل `bthwani-suite`، ومنع أي خلط بين خط البناء الحالي وأي مرجع آخر.

## الناتج المطلوب

- docs/bootstrap/00_REPO_RESET_DECISION.md
- docs/bootstrap/01_BUILD_MODE_LOCK.md
- docs/bootstrap/02_OUT_OF_SCOPE_NOW.md
- evidence root initialized

## Wave 00-A — قرار خط البناء

### ماذا ننجز

نحدد بوضوح أين سنبني وما الذي يعتبر المرجع التنفيذي الوحيد.

### TodoList

- [ ] اكتب قرارًا صريحًا بأن `bthwani-suite` هو خط البناء الرسمي.
- [ ] اكتب أن البناء يبدأ من Foundation وليس من Features.
- [ ] اكتب أن أي مرجع خارجي لا يملك authority على التنفيذ.
- [ ] احفظ القرار داخل `docs/bootstrap/00_REPO_RESET_DECISION.md`.

### معايير تحقق

- يوجد ملف قرار واحد وواضح.
- لا توجد صياغة مزدوجة لخط البناء.
- اسم الريبو الرسمي مثبت.

### شرط العبور

لا تنتقل حتى تصبح جملة القرار مفهومة بلا التباس.

## Wave 00-B — قفل الممنوعات المبكرة

### ماذا ننجز

نحدد ما الذي لا يجوز فعله من اليوم الأول.

### TodoList

- [ ] اكتب قائمة الممنوعات: لا API-first، لا Binding-first، لا Runtime-first.
- [ ] اكتب أن Full-stack غير مسموح مبكرًا.
- [ ] اكتب أن الشاشات لا تبدأ قبل القانون والهيكل.
- [ ] احفظ ذلك في `docs/bootstrap/02_OUT_OF_SCOPE_NOW.md`.

### معايير تحقق

- الممنوعات مكتوبة صراحة.
- لا توجد استثناءات فضفاضة.
- القائمة تمنع القفز المبكر بوضوح.

### شرط العبور

لا تنتقل إذا كانت الممنوعات ما زالت عامة أو رخوة.

## Wave 00-C — تهيئة evidence root

### ماذا ننجز

إنشاء الجذر الذي ستسجل فيه الأدلة والنتائج لاحقًا.

### TodoList

- [ ] أنشئ `tools/registry/runs/`.
- [ ] ثبّت أن كل دليل لاحق سيشار له من هذا الجذر.
- [ ] سجل session البداية إن لزم.
- [ ] أنشئ ملفًا بسيطًا يثبت جاهزية الجذر.

### معايير تحقق

- المسار موجود فعليًا.
- مكان الأدلة معروف من الآن.
- لا يوجد غموض حول مكان الحفظ.

### شرط العبور

لا تنتقل حتى يصبح evidence root موجودًا وجاهزًا.

## ممنوعات المرحلة

- لا features
- لا screens
- لا contracts تفصيلية
- لا binding
- لا runtime

---

# PHASE 01 — REPO SKELETON

## الهدف

إنشاء شجرة الريبو الأساسية الصغيرة والواضحة بدون تضخيم مبكر.

## الناتج المطلوب

- apps/
- services/
- packages/
- contracts/
- docs/
- governance/
- kdt/
- runtime/
- root config files

## Wave 01-A — جذور المشروع

### ماذا ننجز

إنشاء المجلدات العليا فقط.

### TodoList

- [ ] أنشئ `apps/` و`services/` و`packages/`.
- [ ] أنشئ `contracts/` و`docs/` و`governance/`.
- [ ] أنشئ `kdt/` و`runtime/`.
- [ ] لا تملأها ببنى فرعية كثيرة الآن.

### معايير تحقق

- كل الجذور الأساسية موجودة.
- لا توجد جذور عشوائية مثل misc/common/temp.
- الشجرة ما زالت صغيرة وواضحة.

### شرط العبور

لا تنتقل إذا ظهرت جذور غامضة أو غير مالكة.

## Wave 01-B — ملفات الجذر

### ماذا ننجز

إنشاء root files اللازمة فقط.

### TodoList

- [ ] أنشئ `README.md`.
- [ ] أنشئ `package.json` و`pnpm-workspace.yaml` و`tsconfig.base.json` و`.gitignore`.
- [ ] اجعلها minimal وواضحة.
- [ ] امنع أي إعداد ثقيل لا نحتاجه الآن.

### معايير تحقق

- ملفات الجذر موجودة.
- لا تحتوي على setup متضخم.
- الورك سبيس مفهومة.

### شرط العبور

لا تنتقل إذا أصبحت ملفات الجذر أضخم من الحاجة.

## Wave 01-C — حجز المسارات الصحيحة

### ماذا ننجز

تجهيز أماكن البناء اللاحق دون ملئها مبكرًا.

### TodoList

- [ ] احجز مكان `apps/mobile/*` و`apps/web/*`.
- [ ] احجز مكان `packages/ui-kit` و`packages/surfaces` و`packages/api-*`.
- [ ] احجز `contracts/master/` و`docs/services/`.
- [ ] اترك معظمها reserved الآن.

### معايير تحقق

- المسارات موجودة.
- لا يوجد business code مبكر.
- الأماكن الصحيحة للحزم والخدمات معروفة.

### شرط العبور

لا تنتقل إذا بدأت ببناء features فعلية داخل هذه الأماكن.

## ممنوعات المرحلة

- لا apps كاملة
- لا services كاملة
- لا runtime stack
- لا CI ثقيلة
- لا tests واسعة

---

# PHASE 02 — MASTER FOUNDATION MINIMAL

## الهدف

إغلاق القانون الأدنى للمنصة: ownership, catalogs, boundaries, build order.

## الناتج المطلوب

- ownership law
- service catalog
- surface catalog
- openapi law
- direction/i18n law
- repo boundary law
- build order law

## Wave 02-A — ownership + catalogs

### ماذا ننجز

تحديد من يملك ماذا، وما الخدمات والأسطح الرسمية.

### TodoList

- [ ] أنشئ `governance/00_OWNERSHIP.md`.
- [ ] أنشئ `governance/01_SERVICE_CATALOG.md`.
- [ ] أنشئ `governance/02_SURFACE_CATALOG.md`.
- [ ] ثبت الأسماء الرسمية للأسطح والخدمات.

### معايير تحقق

- ownership مكتوبة بوضوح.
- service catalog موجودة.
- surface catalog موجودة.
- `app-field` مذكورة صراحة كsurface رسمية.

### شرط العبور

لا تنتقل إذا بقيت أي طبقة بلا owner أو أي surface بلا إدراج.

## Wave 02-B — القوانين الحاكمة

### ماذا ننجز

تثبيت القوانين التي تمنع الفوضى لاحقًا.

### TodoList

- [ ] أنشئ `governance/03_OPENAPI_SOVEREIGNTY.md`.
- [ ] أنشئ `governance/04_DIRECTION_I18N_OWNERSHIP.md`.
- [ ] أنشئ `governance/05_REPO_BOUNDARY.md`.
- [ ] أنشئ `governance/06_PACKAGE_RESPONSIBILITIES.md`.

### معايير تحقق

- قانون OpenAPI واضح.
- قانون اللغة/الاتجاه واضح.
- حدود apps/packages/services/contracts واضحة.

### شرط العبور

لا تنتقل إذا كان يمكن تفسير الملكية بأكثر من طريقة.

## Wave 02-C — ترتيب البناء

### ماذا ننجز

تثبيت الترتيب الرسمي للمشروع كله.

### TodoList

- [ ] أنشئ `governance/07_BUILD_ORDER.md`.
- [ ] ثبت التسلسل: Foundation → UX → Matrix → Gap → OpenAPI → Generate/Verify → Binding → Runtime → Proof.
- [ ] أضف قاعدة عدم القفز بين المراحل.
- [ ] أضف قاعدة الخدمة الرئيسية الواحدة في العمق.

### معايير تحقق

- build order موجودة.
- لا توجد مرحلتان متنافستان على نفس الدور.
- قانون الخدمة الأساسية الواحدة واضح.

### شرط العبور

لا تنتقل إذا لم يصبح ترتيب البناء مرجعًا واحدًا واضحًا.

## ممنوعات المرحلة

- لا logic فعلية
- لا screens
- لا generated layers
- لا contracts تفصيلية

---

# PHASE 03 — UI KIT FOUNDATION

## الهدف

تأسيس ui-kit foundation القابلة للبناء بدون تضخيم أو business logic.

## الناتج المطلوب

- tokens
- direction layer
- primitives
- state shells
- ui-kit constitution

## Wave 03-A — token constitution

### ماذا ننجز

بناء طبقة التصميم الأساسية فقط.

### TodoList

- [ ] أنشئ `packages/ui-kit/src/tokens/`.
- [ ] ضع colors وspacing وtypography وradius وshadows وmotion basics.
- [ ] اجعل كل token ذات معنى واضح.
- [ ] اكتب `README` أو constitution مختصر يشرح المالك والحدود.

### معايير تحقق

- tokens الأساسية موجودة.
- لا يوجد tokens عشوائية بلا معنى.
- الأساس كافٍ لكنه غير متضخم.

### شرط العبور

لا تنتقل إذا بدأت بإضافة patterns أو widgets قبل أوانها.

## Wave 03-B — direction + primitives

### ماذا ننجز

قفل الاتجاه واللبنات الأولى.

### TodoList

- [ ] أنشئ `direction/`.
- [ ] أنشئ `primitives/` الأساسية.
- [ ] ثبت أن اللغة والاتجاه central ownership.
- [ ] امنع أي local direction logic متناثرة.

### معايير تحقق

- direction layer موجودة.
- primitives الأساسية موجودة.
- لا يوجد direction hacks محلية.

### شرط العبور

لا تنتقل إذا كانت direction ownership ما زالت موزعة.

## Wave 03-C — states foundation

### ماذا ننجز

إنشاء state shells الأساسية لكل الشاشات لاحقًا.

### TodoList

- [ ] أنشئ `states/LoadingState` و`EmptyState` و`ErrorState` و`SuccessState`.
- [ ] اجعلها generic.
- [ ] لا تدخل business text أو service-specific logic.
- [ ] ثبت أن هذه states هي baseline وليست كل الحالات النهائية.

### معايير تحقق

- state shells موجودة.
- generic وليست service-specific.
- جاهزة للاستهلاك لاحقًا.

### شرط العبور

لا تنتقل إذا كانت state shells مرتبطة بخدمة معينة.

## ممنوعات المرحلة

- لا DSH cards
- لا partner widgets
- لا captain tiles
- لا business logic
- لا variants كثيرة

---

# PHASE 04 — FIRST SERVICE SELECTION

## الهدف

اختيار خدمة واحدة فقط تدخل التنفيذ العميق الآن.

## الناتج المطلوب

- service selection
- service profile
- primary job
- non-goals

## Wave 04-A — اختيار الخدمة

### ماذا ننجز

اختيار خدمة البداية بقرار واعٍ.

### TodoList

- [ ] أنشئ `packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md/00_SERVICE_SELECTION.md` أو ما يعادلها للخدمة المختارة.
- [ ] اشرح لماذا هذه الخدمة هي الأولى.
- [ ] اثبت أنها تكشف أكبر قدر من القيمة والأنماط.
- [ ] اثبت أننا لن نبدأ بخدمتين استهلاكيتين عميقتين معًا.

### معايير تحقق

- خدمة واحدة فقط مختارة.
- السبب واضح.
- لا توجد خدمة ثانية منافسة في العمق.

### شرط العبور

لا تنتقل إذا كانت هناك خدمتان مرشحتان فعليًا بنفس الوقت.

## Wave 04-B — ملف الخدمة

### ماذا ننجز

تعريف الخدمة على مستوى الأعمال، لا التنفيذ.

### TodoList

- [ ] أنشئ `01_SERVICE_PROFILE.md`.
- [ ] اكتب primary job.
- [ ] اكتب secondary jobs بشكل مختصر.
- [ ] اكتب non-goals.

### معايير تحقق

- service profile موجود.
- primary job واضحة.
- non-goals واضحة.

### شرط العبور

لا تنتقل إذا ظلت الخدمة مجرد اسم بلا هدف واضح.

## Wave 04-C — scope phase lock

### ماذا ننجز

ربط الخدمة المختارة بنطاق هذه المرحلة فقط.

### TodoList

- [ ] حدد ما الذي سندخله الآن في هذه الخدمة.
- [ ] حدد ما الذي لن ندخله الآن.
- [ ] اكتب ذلك داخل non-goals أو scope note.
- [ ] امنع تضخم الخدمة قبل Foundationsها.

### معايير تحقق

- نطاق الخدمة الحالية واضح.
- خارج النطاق موثق.
- لا توجد توسعات صامتة.

### شرط العبور

لا تنتقل إذا بقي scope غامضًا أو متسعًا بلا ضابط.

## ممنوعات المرحلة

- لا service ثانية في العمق
- لا screens بعد
- لا API بعد
- لا Binding بعد

---

# PHASE 05 — SERVICE FOUNDATION PACK

## الهدف

تعريف actors, operations, lifecycle, and surface coverage للخدمة المختارة.

## الناتج المطلوب

- actor-context matrix
- operations catalog
- status lifecycle
- surface matrix
- operation-surface coverage

## Wave 05-A — actors + lifecycle

### ماذا ننجز

تحديد من يستخدم الخدمة وما lifecycle المنطقي لها.

### TodoList

- [ ] أنشئ `04_ACTOR_CONTEXT_MATRIX.csv`.
- [ ] أنشئ `06_STATUS_LIFECYCLE.md`.
- [ ] اكتب actors الأساسيين والثانويين.
- [ ] اكتب status lifecycle مختصرة وواضحة.

### معايير تحقق

- actors محددون.
- status lifecycle موجودة.
- لا توجد حالات متشابهة بلا فرق.

### شرط العبور

لا تنتقل إذا بقي actor غير معروف أو status مبهمة.

## Wave 05-B — operation registry

### ماذا ننجز

حصر العمليات الرسمية فقط.

### TodoList

- [ ] أنشئ `05_OPERATIONS_CATALOG.csv`.
- [ ] اكتب operation_id وpurpose وprimary actor وstate effect.
- [ ] امنع العمليات الضبابية أو المكررة.
- [ ] لا تدخل operations غير مثبتة الحاجة.

### معايير تحقق

- operations واضحة.
- لا duplicates.
- لكل operation purpose وstate effect.

### شرط العبور

لا تنتقل إذا بقيت operations ضبابية أو مزدوجة.

## Wave 05-C — surface coverage

### ماذا ننجز

تحديد أين تعيش العملية وعلى أي surface تظهر.

### TodoList

- [ ] أنشئ `07_SURFACE_MATRIX.csv` و`08_OPERATION_SURFACE_COVERAGE.csv`.
- [ ] صنف كل surface إلى REQUIRED/OPTIONAL/OUT لكل خدمة.
- [ ] حدد موقع `app-field` صراحة هنا.
- [ ] امنع silence حول أي surface.

### معايير تحقق

- كل surface مصنفة.
- app-field مصنفة صراحة.
- كل operation لها coverage واضحة.

### شرط العبور

لا تنتقل إذا بقيت أي surface بلا تصنيف أو أي operation بلا surface.

## ممنوعات المرحلة

- لا screens
- لا API
- لا runtime
- لا silence حول app-field

---

# PHASE 06 — JOURNEY LOCK

## الهدف

رسم الرحلات الأساسية قبل تسمية الشاشات.

## الناتج المطلوب

- primary journey
- fast journey
- partner journey
- captain journey
- staff journey
- failure/recovery journey

## Wave 06-A — رحلات القيمة الأساسية

### ماذا ننجز

رسم primary flow وfast flow.

### TodoList

- [ ] أنشئ `09_FLOW_MAP_PRIMARY.md`.
- [ ] أنشئ `10_FLOW_MAP_FAST.md`.
- [ ] حدد من يدخل أولًا ومن يرى ماذا ومتى.
- [ ] اجعل الرحلة تدور حول العملية، لا حول الشاشات بعد.

### معايير تحقق

- primary flow واضحة.
- fast flow أقصر من primary حيث يلزم.
- الخطوات مرتبة منطقيًا.

### شرط العبور

لا تنتقل إذا كانت الرحلات ما تزال عبارة عن شاشات مبعثرة بلا تسلسل.

## Wave 06-B — رحلات الأسطح التشغيلية

### ماذا ننجز

رسم partner/captain/staff journeys.

### TodoList

- [ ] أنشئ `11_FLOW_MAP_PARTNER.md` و`12_FLOW_MAP_CAPTAIN.md` و`13_FLOW_MAP_STAFF.md`.
- [ ] حدد action queue لكل actor.
- [ ] حدد أين يحتاج task-first behavior.
- [ ] حدد متى تتدخل control-panel.

### معايير تحقق

- رحلات partner/captain/staff واضحة.
- يوجد next action واضح لكل surface.

### شرط العبور

لا تنتقل إذا بقيت الرحلات التشغيلية وصفًا عامًّا بلا تسلسل.

## Wave 06-C — failure/recovery

### ماذا ننجز

رسم الفشل والاستعادة مبكرًا.

### TodoList

- [ ] أنشئ `14_FLOW_MAP_FAILURE_RECOVERY.md`.
- [ ] اكتب ما الفشل المحتمل ومن يراه.
- [ ] اكتب ما retry/escalation/support path.
- [ ] امنع happy-path thinking فقط.

### معايير تحقق

- failure path واضحة.
- recovery path واضحة.
- يوجد owner واضح لحالات الفشل.

### شرط العبور

لا تنتقل إذا لم تستطع وصف ما يحدث عند الفشل.

## ممنوعات المرحلة

- لا screens code
- لا routes code
- لا endpoint design

---

# PHASE 07 — SCREEN INVENTORY & RATIONALIZATION

## الهدف

منع تضخم الشاشات وتحويل الخطوات الصغيرة إلى الشكل الصحيح.

## الناتج المطلوب

- screen catalog
- rationalization decisions
- route candidates
- screen notes

## Wave 07-A — screen census

### ماذا ننجز

حصر كل الوحدات المرشحة على الأسطح المختلفة.

### TodoList

- [ ] أنشئ `15_SCREEN_CATALOG.csv`.
- [ ] احصر screens وsheets وmodals وsections وinline steps المحتملة.
- [ ] سمِّ كل وحدة باسم مرشح واضح.
- [ ] اربطها مبدئيًا بالsurface والpurpose المحتملة.

### معايير تحقق

- كل الوحدات المرشحة محصورة.
- لا توجد وحدات بلا اسم أو surface.

### شرط العبور

لا تنتقل إذا بقيت بعض الوحدات خارج الجرد.

## Wave 07-B — rationalization decisions

### ماذا ننجز

القرار: keep/merge/convert/internal/reject.

### TodoList

- [ ] أنشئ `16_SCREEN_RATIONALIZATION.csv`.
- [ ] لكل وحدة قرر إن كانت route فعلًا أو لا.
- [ ] حول ما يجب أن يكون sheet/modal/section.
- [ ] امنح سببًا لكل قرار.

### معايير تحقق

- كل وحدة لها decision.
- الأسباب مكتوبة.
- route inflation بدأت تنخفض.

### شرط العبور

لا تنتقل إذا بقيت الشاشات المكررة بلا قرار.

## Wave 07-C — route candidates

### ماذا ننجز

حصر الـ routes الحقيقية فقط.

### TodoList

- [ ] أنشئ `17_ROUTE_CANDIDATES.md`.
- [ ] اكتب ما يجب أن يبقى route.
- [ ] اكتب ما يجب ألا يكون route.
- [ ] أضف `18_SCREEN_NOTES.md` لأي حالات مشكوك فيها.

### معايير تحقق

- route candidates واضحة.
- ما ليس route واضح أيضًا.

### شرط العبور

لا تنتقل إذا كان ما يزال كل شيء مرشحًا ليصبح route.

## ممنوعات المرحلة

- لا navigation code
- لا stacks
- لا screens implementation

---

# PHASE 08 — FAMILY + PURPOSE LOCK

## الهدف

إعطاء كل شاشة هوية وغرضًا وCTA واضحة.

## الناتج المطلوب

- family map
- purpose lock
- click budgets
- ui-kit expansion candidates

## Wave 08-A — family map

### ماذا ننجز

تحديد family الصحيحة لكل شاشة.

### TodoList

- [ ] أنشئ `19_SCREEN_FAMILY_MAP.csv`.
- [ ] صنف الشاشات: Entry/List/Detail/Form/Review/Tracking/... إلخ.
- [ ] امنح سببًا واضحًا لكل family.
- [ ] امنع الشاشة متعددة الهوية.

### معايير تحقق

- كل شاشة لها family واحدة واضحة.
- family ليست عشوائية.

### شرط العبور

لا تنتقل إذا بقيت أي شاشة بلا family واضحة.

## Wave 08-B — purpose + CTA

### ماذا ننجز

قفل purpose وCTA الأساسية.

### TodoList

- [ ] أنشئ `20_SCREEN_PURPOSE_LOCK.csv`.
- [ ] لكل شاشة اكتب purpose واحدة واضحة.
- [ ] اكتب primary CTA وsecondary actions إن وجدت.
- [ ] اكتب max visible blocks وadvanced hidden decisions إذا لزم.

### معايير تحقق

- كل شاشة لها purpose واحدة.
- كل شاشة لها CTA رئيسية.
- لا توجد شاشة تعمل كل شيء.

### شرط العبور

لا تنتقل إذا كانت أي شاشة ما تزال multitask بلا ضبط.

## Wave 08-C — click budgets + ui-kit clues

### ماذا ننجز

ربط البساطة بالحركة القادمة ل ui-kit.

### TodoList

- [ ] أنشئ `21_CLICK_BUDGETS.csv`.
- [ ] أنشئ `22_UI_KIT_EXPANSION_CANDIDATES.md`.
- [ ] حدد أين يجب أن تكون الرحلة 1–2 taps.
- [ ] استخرج patterns المرشحة من الشاشات نفسها.

### معايير تحقق

- click budgets موجودة.
- أول قائمة patterns مرشحة موجودة.

### شرط العبور

لا تنتقل إذا لم تظهر أي علاقة بين screens وui-kit القادمة.

## ممنوعات المرحلة

- لا API
- لا Binding
- لا Runtime

---

# PHASE 09 — FLOW COMPRESSION

## الهدف

تقصير الرحلات وتقليل عدد الخطوات والroutes.

## الناتج المطلوب

- flow compression note
- route minimization rules
- before-after metrics
- screen conversion decisions

## Wave 09-A — before/after review

### ماذا ننجز

مقارنة الرحلات قبل الضغط وبعده.

### TodoList

- [ ] أنشئ `23_FLOW_COMPRESSION.md`.
- [ ] أنشئ `25_FLOW_BEFORE_AFTER.csv`.
- [ ] حدد عدد الشاشات والخطوات قبل/بعد.
- [ ] حدد أين يمكن تقليل الخطوات دون إضرار بالوضوح.

### معايير تحقق

- قبل/بعد موثقة.
- يوجد انخفاض فعلي أو مبرر واضح لعدم الانخفاض.

### شرط العبور

لا تنتقل إذا لم تستطع إثبات أن التدفق أصبح أبسط.

## Wave 09-B — route minimization

### ماذا ننجز

تثبيت ما يبقى route وما يتحول إلى شيء أخف.

### TodoList

- [ ] أنشئ `24_ROUTE_MINIMIZATION_RULES.md`.
- [ ] اكتب قواعد واضحة لما يستحق route.
- [ ] حول التأكيدات الصغيرة والاختيارات الصغيرة إلى sheets/modals.
- [ ] راجع أثر ذلك على click budgets.

### معايير تحقق

- route rules موجودة.
- الأشياء الصغيرة لم تعد screens بلا داع.

### شرط العبور

لا تنتقل إذا استمرت route clutter.

## Wave 09-C — conversion decisions

### ماذا ننجز

قفل قرارات التحويل النهائية.

### TodoList

- [ ] أنشئ `26_SCREEN_CONVERSION_DECISIONS.csv`.
- [ ] سجل لكل candidate ما تحوّل إليه بالضبط.
- [ ] أضف السبب.
- [ ] ثبت أن القرار سيؤثر لاحقًا على screens code.

### معايير تحقق

- قرارات التحويل نهائية وواضحة.
- كل conversion لها target form واضح.

### شرط العبور

لا تنتقل إذا بقيت conversion decisions مؤجلة بلا سبب.

## ممنوعات المرحلة

- لا navigation implementation
- لا deep-linking
- لا route tree code

---

# PHASE 10 — STATE LOCK

## الهدف

تغطية كل الحالات السلوكية قبل الدخول للعقد التفصيلية.

## الناتج المطلوب

- state coverage matrix
- state rules
- display decisions
- copy notes

## Wave 10-A — state coverage

### ماذا ننجز

بناء matrix شاملة لكل شاشة.

### TodoList

- [ ] أنشئ `27_STATE_COVERAGE_MATRIX.csv`.
- [ ] لكل شاشة حدد loading/empty/error/success/offline/disabled/retry وغيرها.
- [ ] لا تكتفِ بالحالات السعيدة.
- [ ] اربط الحالة بالشاشة مباشرة.

### معايير تحقق

- كل شاشة لها حالات واضحة.
- لا توجد شاشة happy-path only.

### شرط العبور

لا تنتقل إذا بقيت أي شاشة بلا state coverage.

## Wave 10-B — display mode decisions

### ماذا ننجز

تحديد كيف تظهر كل حالة.

### TodoList

- [ ] أنشئ `28_STATE_RULES.md`.
- [ ] أنشئ `29_STATE_DISPLAY_DECISIONS.csv`.
- [ ] حدد متى تكون الحالة full screen ومتى block ومتى inline.
- [ ] امنع تحويل كل حالة إلى route مستقلة.

### معايير تحقق

- طرق عرض الحالات واضحة.
- لا state-as-screen anti-pattern.

### شرط العبور

لا تنتقل إذا كانت طرق عرض الحالات ما تزال ارتجالية.

## Wave 10-C — copy + CTA notes

### ماذا ننجز

تثبيت النصوص وردود الفعل.

### TodoList

- [ ] أنشئ `30_STATE_COPY_NOTES.md`.
- [ ] حدد الرسائل الأساسية في empty/error/offline/retry.
- [ ] حدد CTA المناسبة لكل حالة.
- [ ] حدد tone بسيط وواضح.

### معايير تحقق

- لكل حالة رسالة مناسبة.
- retry/support guidance واضحة عند الحاجة.

### شرط العبور

لا تنتقل إذا كانت الحالات بلا copy أو CTA مناسبة.

## ممنوعات المرحلة

- لا response shapes حقيقية بعد
- لا hooks
- لا runtime truth

---

# PHASE 11 — UI KIT EXPANSION FROM REAL SCREENS

## الهدف

نقل patterns المتكررة والحقيقية فقط إلى ui-kit.

## الناتج المطلوب

- ui kit expansion plan
- pattern extraction matrix
- pattern rebuild decisions
- generic patterns in ui-kit

## Wave 11-A — pattern extraction

### ماذا ننجز

استخراج ما تكرر فعليًا في الشاشات.

### TodoList

- [ ] أنشئ `31_UI_KIT_EXPANSION_PLAN.md`.
- [ ] راجع screens وstates وclick budgets.
- [ ] استخرج patterns المرشحة مثل StatusChip وBottomActionBar وSectionBlock.
- [ ] لا تقترح patterns خيالية.

### معايير تحقق

- patterns المرشحة ناتجة من الشاشات الحقيقية.
- لا speculative patterns.

### شرط العبور

لا تنتقل إذا كانت القائمة ناتجة من التخمين لا من الشاشات.

## Wave 11-B — extraction matrix

### ماذا ننجز

تحديد أين ظهرت كل pattern وهل تستحق ui-kit.

### TodoList

- [ ] أنشئ `32_PATTERN_EXTRACTION_MATRIX.csv`.
- [ ] لكل pattern سجل أين ظهرت وعدد مرات الظهور.
- [ ] حدد هل هي generic وهل تستحق ui-kit.
- [ ] أبعد ما هو business-specific.

### معايير تحقق

- لكل pattern source واضح.
- generic vs business-specific محسومة.

### شرط العبور

لا تنتقل إذا بقيت patterns service-specific داخل القائمة.

## Wave 11-C — rebuild decisions

### ماذا ننجز

قفل قرار كيف تُبنى داخل ui-kit.

### TodoList

- [ ] أنشئ `33_PATTERN_REBUILD_DECISIONS.csv`.
- [ ] حدد إن كانت pattern ستبنى clean أو تحتاج فقط اقتباس فكرة.
- [ ] ابنِ pattern generic داخل `packages/ui-kit/src/patterns/`.
- [ ] امنع business logic داخلها.

### معايير تحقق

- patterns دخلت ui-kit كgeneric reusable.
- لا business logic داخل ui-kit patterns.

### شرط العبور

لا تنتقل إذا ظهرت أسماء patterns مرتبطة بالخدمة نفسها.

## ممنوعات المرحلة

- لا DSH-specific widgets في ui-kit
- لا business logic
- لا noisy variants

---

# PHASE 12 — SCREEN/API MATRIX

## الهدف

تحديد data/actions المطلوبة من الشاشات قبل تغيير العقود.

## الناتج المطلوب

- screen api matrix
- data/action requirements
- request count review
- endpoint intent notes

## Wave 12-A — data/action mapping

### ماذا ننجز

لكل شاشة: ما البيانات وما الأفعال التي تحتاجها؟

### TodoList

- [ ] أنشئ `34_SCREEN_API_MATRIX.csv`.
- [ ] لكل شاشة اكتب required_data وrequired_actions.
- [ ] اكتب العملية المرتبطة بالشاشة.
- [ ] لا تكتب endpoint نهائية بعد.

### معايير تحقق

- كل شاشة لها data/action needs واضحة.
- الاحتياج مكتوب من منظور الشاشة لا من منظور endpoint.

### شرط العبور

لا تنتقل إذا بقيت أي شاشة بلا data/action profile.

## Wave 12-B — request pressure review

### ماذا ننجز

اكتشاف الضغط الحالي أو المتوقع على requests.

### TodoList

- [ ] أنشئ `36_REQUEST_COUNT_REVIEW.csv`.
- [ ] قدّر عدد requests الحالية أو المتوقعة لكل شاشة.
- [ ] اكتشف أين نحتاج summary endpoint أو aggregation.
- [ ] سجل overfetch risk.

### معايير تحقق

- request counts مدروسة.
- overfetch risks واضحة.
- الحاجة إلى summary/action واضحة.

### شرط العبور

لا تنتقل إذا بقيت الشاشة ثقيلة من غير تفسير.

## Wave 12-C — endpoint intent notes

### ماذا ننجز

تحويل الاحتياج إلى نية تعاقدية أولية فقط.

### TodoList

- [ ] أنشئ `35_DATA_ACTION_REQUIREMENTS.md`.
- [ ] أنشئ `37_ENDPOINT_INTENT_NOTES.md`.
- [ ] اكتب ما إذا كانت الشاشة تحتاج summary أو detail أو action intent.
- [ ] لا تحول هذه النوايا إلى OpenAPI قبل Gap Map.

### معايير تحقق

- endpoint intents واضحة.
- ما زلنا لم نقفز إلى العقد الفعلية.

### شرط العبور

لا تنتقل إذا بدأت مرحلة العقود من هنا مباشرة دون Gap Map.

## ممنوعات المرحلة

- لا OpenAPI update بعد
- لا generated clients
- لا Binding

---

# PHASE 13 — GAP MAP

## الهدف

تحويل احتياجات الشاشات إلى فجوات عقدية واضحة ومصنفة.

## الناتج المطلوب

- gap map
- gap decisions
- contract change candidates
- overfetch underfit notes

## Wave 13-A — gap discovery

### ماذا ننجز

استخراج الفجوات من matrix.

### TodoList

- [ ] أنشئ `38_GAP_MAP.md`.
- [ ] مر على صفوف matrix واحدًا واحدًا.
- [ ] حدد missing shapes وmissing actions وmissing summaries.
- [ ] افصل كل gap عن الأخرى.

### معايير تحقق

- الفجوات مكتوبة فرديًا.
- لا توجد gaps عامة بلا تفصيل.

### شرط العبور

لا تنتقل إذا كانت gaps ما تزال عبارات إنشائية عامة.

## Wave 13-B — gap classification

### ماذا ننجز

تحديد severity والقرار الأولي لكل gap.

### TodoList

- [ ] أنشئ `39_GAP_DECISIONS.csv`.
- [ ] صنف gap إلى OPENAPI_CHANGE_REQUIRED أو غيره.
- [ ] سجل why لكل قرار.
- [ ] أضف `41_OVERFETCH_UNDERFIT_NOTES.md` للحالات الخاصة.

### معايير تحقق

- لكل gap severity وdecision واضحان.
- underfit/overfetch موثقة.

### شرط العبور

لا تنتقل إذا بقيت الفجوات بلا قرار.

## Wave 13-C — change candidates

### ماذا ننجز

تجميع مرشحات التعديل قبل لمس العقد.

### TodoList

- [ ] أنشئ `40_CONTRACT_CHANGE_CANDIDATES.md`.
- [ ] اجمع التغييرات المرشحة فقط.
- [ ] امنع أي contract change غير مرتبطة بgap موثقة.
- [ ] راجع traceability من الشاشة إلى gap إلى candidate.

### معايير تحقق

- كل candidate لها أصل واضح.
- لا تغييرات تعاقدية عشوائية.

### شرط العبور

لا تنتقل إذا ظهرت change candidates بلا أصل من matrix/gap.

## ممنوعات المرحلة

- لا تعديل Master OpenAPI قبل نهاية هذه المرحلة
- لا clients
- لا binding

---

# PHASE 14 — MASTER OPENAPI UPDATE

## الهدف

تحديث `Master_OpenAPI.yaml` فقط بما ثبتت الحاجة إليه.

## الناتج المطلوب

- openapi changeset
- operation parity
- schema parity
- updated master openapi

## Wave 14-A — operation parity

### ماذا ننجز

مراجعة العمليات المطلوبة مقابل ما هو موجود في الماستر.

### TodoList

- [ ] أنشئ `43_OPENAPI_OPERATION_PARITY.csv`.
- [ ] لكل operation مطلوبة اكتب exists/needs_add/needs_update.
- [ ] اربط كل operation بحاجة UX واضحة.
- [ ] امنع إضافة operations لأننا نظن أنها قد تنفع لاحقًا.

### معايير تحقق

- operation parity واضحة.
- كل operation لها rationale من الشاشات.

### شرط العبور

لا تنتقل إذا وجدت operations مضافة بلا أصل UX.

## Wave 14-B — schema parity

### ماذا ننجز

مراجعة schemas المطلوبة للشاشات والqueues والتفاصيل.

### TodoList

- [ ] أنشئ `44_OPENAPI_SCHEMA_PARITY.csv`.
- [ ] لكل schema مطلوبة اكتب exists/needs_add/needs_update.
- [ ] حدد لماذا تحتاجها الشاشة أو الـ flow.
- [ ] امنع schema inflation.

### معايير تحقق

- schema parity واضحة.
- كل schema لها سبب وجود.

### شرط العبور

لا تنتقل إذا أصبحت schema list متضخمة بلا screen demand.

## Wave 14-C — changeset freeze

### ماذا ننجز

توثيق وتجميد التعديل التعاقدي.

### TodoList

- [ ] أنشئ `42_OPENAPI_CHANGESET.md`.
- [ ] حدّث `contracts/master/Master_OpenAPI.yaml`.
- [ ] وحد error shapes.
- [ ] امنع rogue endpoints وأي raw contract drift.

### معايير تحقق

- changeset موثقة.
- الماستر محدثة بشكل traceable.
- error shapes متسقة.

### شرط العبور

لا تنتقل إذا تم تعديل الماستر بلا تغييرات موثقة.

## ممنوعات المرحلة

- لا hooks
- لا screens code
- لا runtime
- لا generate قبل التحديث

---

# PHASE 15 — GENERATE / VERIFY

## الهدف

تحويل العقد إلى طبقات generated قابلة للاستهلاك والتحقق.

## الناتج المطلوب

- generate plan
- generate verify report
- operation generation status
- schema generation status
- error shape review

## Wave 15-A — generation plan

### ماذا ننجز

تحديد ما الذي سيولد وإلى أين.

### TodoList

- [ ] أنشئ `45_GENERATE_VERIFY_PLAN.md`.
- [ ] حدد أن المصدر هو `contracts/master/Master_OpenAPI.yaml`.
- [ ] حدد أن الناتج المستهدف هو `packages/api-types` و`packages/api-clients`.
- [ ] حدد checks التحقق المطلوبة.

### معايير تحقق

- خطة التوليد واضحة.
- المصدر والوجهة محددان.

### شرط العبور

لا تنتقل إذا كان التوليد ما يزال بلا خطة أو وجهة.

## Wave 15-B — generation status

### ماذا ننجز

تتبع ما إذا كانت العمليات والschemas وclients قد تولدت كما ينبغي.

### TodoList

- [ ] أنشئ `47_OPERATION_GENERATION_STATUS.csv`.
- [ ] أنشئ `48_SCHEMA_GENERATION_STATUS.csv`.
- [ ] سجل حالة التوليد والتحقق لكل operation/schema.
- [ ] املأ `46_GENERATE_VERIFY_REPORT.md` تدريجيًا.

### معايير تحقق

- حالة كل operation/schema معروفة.
- التقرير يعكس الواقع.

### شرط العبور

لا تنتقل إذا كان التوليد ناجحًا ظاهريًا فقط بلا تتبع.

## Wave 15-C — error shape review

### ماذا ننجز

التأكد أن error shapes مفهومة وقابلة للاستهلاك.

### TodoList

- [ ] أنشئ `49_ERROR_SHAPE_REVIEW.md`.
- [ ] راجع validation/not found/forbidden/upstream وغيرها.
- [ ] امنع errors المتباينة بلا مبرر.
- [ ] ثبت أين تحتاج الواجهة normalization لاحقًا.

### معايير تحقق

- error shapes راجعت.
- لا توجد فوضى أخطاء صامتة.

### شرط العبور

لا تنتقل إذا كانت errors ما تزال متضاربة أو غير مفهومة.

## ممنوعات المرحلة

- لا binding واسعة
- لا hand-written clients
- لا bypass للتوليد

---

# PHASE 16 — API PACKAGES

## الهدف

تنظيم `api-types` و`api-clients` كطبقة استهلاك نظيفة.

## الناتج المطلوب

- api-types package status
- api-clients package status
- client consumption rules
- organized package exports

## Wave 16-A — api-types package

### ماذا ننجز

تجهيز الحزمة الأولى للأنواع المولدة.

### TodoList

- [ ] أنشئ بنية `packages/api-types/src/`.
- [ ] رتب exports بشكل واضح حسب الخدمة.
- [ ] أنشئ `50_API_TYPES_PACKAGE_STATUS.md`.
- [ ] امنع أي business logic هنا.

### معايير تحقق

- `api-types` منظمة وواضحة.
- لا business logic داخلها.

### شرط العبور

لا تنتقل إذا كانت الحزمة تحمل أكثر من دورها.

## Wave 16-B — api-clients package

### ماذا ننجز

تجهيز الحزمة الثانية للclients المولدة/thin adapters.

### TodoList

- [ ] أنشئ بنية `packages/api-clients/src/`.
- [ ] رتب exports حسب الخدمة.
- [ ] أنشئ `51_API_CLIENTS_PACKAGE_STATUS.md`.
- [ ] اجعل adapters thin فقط عند الحاجة.

### معايير تحقق

- `api-clients` منظمة وواضحة.
- لا raw fetch helpers متناثرة.

### شرط العبور

لا تنتقل إذا ظهرت business orchestration داخل clients.

## Wave 16-C — consumption rules

### ماذا ننجز

تثبيت كيف تستهلك الشاشات هذه الحزم لاحقًا.

### TodoList

- [ ] أنشئ `52_CLIENT_CONSUMPTION_RULES.md`.
- [ ] ثبت أن screens/hooks لا تستهلك raw fetch.
- [ ] ثبت أن الاستهلاك يكون عبر generated client أو thin adapter فقط.
- [ ] امنع duplicate local clients.

### معايير تحقق

- قواعد الاستهلاك واضحة.
- لا باب مفتوح للفوضى لاحقًا.

### شرط العبور

لا تنتقل إذا كانت screens ما تزال تستطيع فتح client محلية أو fetch متناثرة.

## ممنوعات المرحلة

- لا runtime logic
- لا screen-specific logic
- لا local fetch helpers

---

# PHASE 17 — FIRST BINDING

## الهدف

إثبات أول Binding chain clean وصغيرة ومفهومة.

## الناتج المطلوب

- first binding scope
- binding chain map
- binding rules
- binding verify checklist
- first screen+viewmodel+client chain

## Wave 17-A — first binding scope

### ماذا ننجز

اختيار نطاق الربط الأول فقط.

### TodoList

- [ ] أنشئ `53_FIRST_BINDING_SCOPE.md`.
- [ ] اختر Screen أو Flow صغيرة واحدة فقط.
- [ ] اربطها بعملية واحدة أو سياق صغير.
- [ ] امنع ربط الخدمة كلها دفعة واحدة.

### معايير تحقق

- scope صغيرة وواضحة.
- لا يوجد توسع مبكر.

### شرط العبور

لا تنتقل إذا كانت أول binding أكبر من اللازم.

## Wave 17-B — first chain implementation

### ماذا ننجز

ربط أول Screen إلى أول ViewModel إلى أول Client clean.

### TodoList

- [ ] أنشئ أو حدّث screen واحدة في `packages/surfaces`.
- [ ] أنشئ أول viewmodel/hook نظيفة.
- [ ] اربطها بـ api-client أو thin adapter.
- [ ] وثق السلسلة في `54_BINDING_CHAIN_MAP.csv`.

### معايير تحقق

- السلسلة الأولى تعمل منطقيًا.
- لا raw fetch.
- الشاشة لا تملك truth خاصة بها.

### شرط العبور

لا تنتقل إذا كانت الشاشة أو hook تقومان بأكثر من دورهما.

## Wave 17-C — binding rules + verify

### ماذا ننجز

قفل القواعد قبل التوسع.

### TodoList

- [ ] أنشئ `55_BINDING_RULES.md`.
- [ ] أنشئ `56_BINDING_VERIFY_CHECKLIST.md`.
- [ ] راجع no raw fetch / no contract drift / state handling.
- [ ] ثبت أن أول chain سليمة.

### معايير تحقق

- verify checklist مملوءة.
- القواعد مكتوبة.
- أول chain clean.

### شرط العبور

لا تنتقل إذا كانت أول chain فيها bypass أو drift.

## ممنوعات المرحلة

- لا كل DSH دفعة واحدة
- لا كل surfaces
- لا full runtime

---

# PHASE 18 — SAFE BINDING EXPANSION

## الهدف

توسيع Binding بشكل مدروس لا ينفلت.

## الناتج المطلوب

- binding expansion plan
- expansion order
- parity checklist
- raw fetch violations file
- scope lock

## Wave 18-A — expansion order

### ماذا ننجز

تحديد أي flows أو surfaces تتوسع بعد الأولى.

### TodoList

- [ ] أنشئ `57_BINDING_EXPANSION_PLAN.md`.
- [ ] أنشئ `58_BINDING_EXPANSION_ORDER.csv`.
- [ ] رتب التوسع: flow-by-flow أو surface-by-surface حسب القيمة.
- [ ] اشترط verify بعد كل خطوة.

### معايير تحقق

- ترتيب التوسع واضح.
- كل خطوة توسع لها سبب.

### شرط العبور

لا تنتقل إذا كان التوسع ما يزال بلا ترتيب أو scope.

## Wave 18-B — parity + violations

### ماذا ننجز

مراقبة الانحرافات أثناء التوسع.

### TodoList

- [ ] أنشئ `59_BINDING_PARITY_CHECKLIST.md`.
- [ ] أنشئ `60_RAW_FETCH_VIOLATIONS.md`.
- [ ] سجل أي bypass أو raw fetch فورًا.
- [ ] قارن chain الجديدة بالقواعد المثبتة.

### معايير تحقق

- أي violation تُوثق فورًا.
- لا raw fetch تمر بصمت.
- parity تُراجع مع كل توسع.

### شرط العبور

لا تنتقل إذا كانت violations تتكاثر بلا إغلاق.

## Wave 18-C — scope lock

### ماذا ننجز

منع binding من التحول إلى فوضى واسعة.

### TodoList

- [ ] أنشئ `61_BINDING_SCOPE_LOCK.md`.
- [ ] اكتب ما المسموح ربطه الآن.
- [ ] اكتب ما الممنوع ربطه الآن.
- [ ] ثبت متى يسمح بالانتقال إلى runtime truth work.

### معايير تحقق

- scope binding واضحة.
- الممنوعات مكتوبة.
- التوسع ما زال منضبطًا.

### شرط العبور

لا تنتقل إذا فقدت السيطرة على scope الحالية.

## ممنوعات المرحلة

- لا 4 أسطح دفعة واحدة بلا حاجة
- لا service ثانية deep
- لا runtime truth مزيفة

---

# PHASE 19 — RUNTIME TRUTH LOCK

## الهدف

تحديد الحقيقة التشغيلية الوحيدة لكل operation وربطها بسلوك واجهتها.

## الناتج المطلوب

- runtime truth register
- truth source classification
- fallback elimination report
- runtime availability rules
- truth source decisions

## Wave 19-A — truth registry

### ماذا ننجز

تسجيل المصدر المتوقع أو الحالي لكل operation.

### TodoList

- [ ] أنشئ `62_RUNTIME_TRUTH_REGISTER.csv`.
- [ ] لكل operation اكتب truth_source وsource_type وis_canonical.
- [ ] اترك TBD فقط عند الحاجة الصادقة.
- [ ] امنع اليقين الزائف.

### معايير تحقق

- كل operation لها صف في truth register.
- TBD تستخدم بصدق لا كتهرب.

### شرط العبور

لا تنتقل إذا بقيت operations كثيرة بلا أي تصور لمصدر الحقيقة.

## Wave 19-B — classification + fallbacks

### ماذا ننجز

تصنيف كل مصدر ومعالجة fallbackات الخطيرة.

### TodoList

- [ ] أنشئ `63_TRUTH_SOURCE_CLASSIFICATION.csv`.
- [ ] أنشئ `64_FALLBACK_ELIMINATION_REPORT.md`.
- [ ] صنف mock/fixture/seed/preview/runtime truth بدقة.
- [ ] سجل أي fallback خفية كـ blocker.

### معايير تحقق

- التصنيف واضح.
- أي fallback موثقة.
- fixture truth لا تمر كحقيقة تشغيلية.

### شرط العبور

لا تنتقل إذا كانت fixture أو mock تتصرف كحقيقة فعلية.

## Wave 19-C — availability + decisions

### ماذا ننجز

تحديد كيف تتصرف الواجهة عند غياب الحقيقة التشغيلية.

### TodoList

- [ ] أنشئ `65_RUNTIME_AVAILABILITY_RULES.md`.
- [ ] أنشئ `66_TRUTH_SOURCE_DECISIONS.md`.
- [ ] حدد retry/guidance/empty/error behavior عند غياب truth.
- [ ] ثبت القرار النهائي لكل مصدر فعال.

### معايير تحقق

- سلوك الواجهة عند غياب الحقيقة واضح.
- truth decisions موثقة.

### شرط العبور

لا تنتقل إذا كان سؤال 'من أين تأتي الحقيقة؟' ما يزال بلا جواب.

## ممنوعات المرحلة

- لا claim readiness
- لا fallback صامتة
- لا truth مزدوجة

---

# PHASE 20 — RUNTIME MODE

## الهدف

تشغيل أقل stack لازم فقط بحسب المرحلة.

## الناتج المطلوب

- runtime mode policy
- runtime mode decisions
- allowed expansion note
- runtime blockers

## Wave 20-A — policy

### ماذا ننجز

كتابة قانون R0/R1/R2/R3/R4 بوضوح.

### TodoList

- [ ] أنشئ `67_RUNTIME_MODE_POLICY.md`.
- [ ] اكتب تعريف كل mode بوضوح.
- [ ] اكتب متى تستخدم كل mode.
- [ ] اكتب الممنوعات، خاصة Full-stack-as-default.

### معايير تحقق

- runtime mode policy واضحة.
- لا يوجد غموض بين preview وproof.

### شرط العبور

لا تنتقل إذا كانت modes ما تزال مجرد أسماء.

## Wave 20-B — decisions per task

### ماذا ننجز

ربط كل نشاط runtime mode المناسبة له.

### TodoList

- [ ] أنشئ `68_RUNTIME_MODE_DECISIONS.csv`.
- [ ] لكل نشاط اكتب current_phase وallowed_runtime_mode.
- [ ] اجعل القرارات مرتبطة بالمرحلة والنطاق.
- [ ] امنع القفز المبكر إلى R4.

### معايير تحقق

- لكل نشاط mode مناسبة.
- لا overscaling بلا مبرر.

### شرط العبور

لا تنتقل إذا كان يمكن تبرير modeين متناقضتين لنفس النشاط.

## Wave 20-C — expansion + blockers

### ماذا ننجز

تحديد متى يسمح بتوسيع stack ومتى يصبح ذلك blocker.

### TodoList

- [ ] أنشئ `69_ALLOWED_RUNTIME_EXPANSION.md`.
- [ ] أنشئ `70_RUNTIME_BLOCKERS.md`.
- [ ] حدد متى يسمح بإضافة api-host أو media أو stack أوسع.
- [ ] حدد ما الذي يوقف التوسع.

### معايير تحقق

- runtime expansion rules موجودة.
- blockers runtime واضحة.

### شرط العبور

لا تنتقل إذا أصبح توسيع stack قرارًا مزاجيًا.

## ممنوعات المرحلة

- لا full stack default
- لا R4 مبكرًا
- لا تشغيل كل شيء دائمًا

---

# PHASE 21 — PRODUCTION-LIKE VERIFICATION

## الهدف

إثبات flow حيّة end-to-end داخل canonical local stack.

## الناتج المطلوب

- production-like checklist
- happy path report
- failure path report
- recovery path report
- staff workflow report
- persistence verify
- runtime evidence index

## Wave 21-A — happy + failure proof

### ماذا ننجز

إثبات happy path والفشل الأساسي.

### TodoList

- [ ] أنشئ `71_PRODUCTION_LIKE_CHECKLIST.csv`.
- [ ] أنشئ `72_HAPPY_PATH_REPORT.md`.
- [ ] أنشئ `73_FAILURE_PATH_REPORT.md`.
- [ ] نفذ happy path وفشلًا واضحًا وسجل الأدلة.

### معايير تحقق

- happy path موثقة.
- failure path موثقة.
- الـ checklist بدأت تمتلئ.

### شرط العبور

لا تنتقل إذا لم تثبت happy path والفشل معًا.

## Wave 21-B — recovery + staff proof

### ماذا ننجز

إثبات التعافي وتدخل الـ control-panel أو staff عند الحاجة.

### TodoList

- [ ] أنشئ `74_RECOVERY_PATH_REPORT.md`.
- [ ] أنشئ `75_STAFF_WORKFLOW_REPORT.md`.
- [ ] اختبر recovery path فعلية.
- [ ] اختبر staff/control-panel intervention path.

### معايير تحقق

- recovery موثقة.
- staff workflow موثقة.
- الأسطح المتدخلة معروفة.

### شرط العبور

لا تنتقل إذا كان التعافي أو تدخل staff ما يزال نظريًا فقط.

## Wave 21-C — persistence + runtime evidence

### ماذا ننجز

إثبات أن البيانات حقيقية ومستمرة وأن الأدلة مفهرسة.

### TodoList

- [ ] أنشئ `76_PERSISTENCE_VERIFY.md`.
- [ ] أنشئ `77_FINAL_RUNTIME_EVIDENCE_INDEX.md`.
- [ ] اختبر persistence الفعلية.
- [ ] اجمع روابط الأدلة الأساسية للحالة production-like.

### معايير تحقق

- persistence مثبتة.
- evidence index موجودة.
- لا fixture truth داخل live path.

### شرط العبور

لا تنتقل إذا لم تصبح الحقيقة التشغيلية مثبتة فعليًا.

## ممنوعات المرحلة

- لا design preview treated as proof
- لا seed demo treated as runtime truth
- لا PASS بلا أدلة

---

# PHASE 22 — EVIDENCE & FINAL SIGN-OFF

## الهدف

تجميع الدليل النهائي وإصدار الحالة الصريحة الصادقة.

## الناتج المطلوب

- evidence map
- guards report
- verify gate
- final signoff
- service seal status
- remaining gaps
- scope completion summary

## Wave 22-A — evidence map

### ماذا ننجز

جمع كل ما أنجز وربطه داخل خريطة واحدة.

### TodoList

- [ ] أنشئ `78_EVIDENCE_MAP.md`.
- [ ] اربط outputs من UX/contracts/binding/runtime/proof.
- [ ] تأكد أن كل claim لها دليل واضح.
- [ ] اجمع references في مكان واحد.

### معايير تحقق

- Evidence Map شاملة.
- لا claim بلا link أو دليل.

### شرط العبور

لا تنتقل إذا بقيت الأدلة مبعثرة.

## Wave 22-B — guards + verify gate

### ماذا ننجز

تقييم الحراس والقرار التقني قبل الختم.

### TodoList

- [ ] أنشئ `79_GUARDS_REPORT.md`.
- [ ] أنشئ `80_VERIFY_GATE.md`.
- [ ] املأ guards: no raw fetch / no drift / no fake readiness / no duplicate truth source وغيرها.
- [ ] أصدر PASS أو PARTIAL أو BLOCKED أو FAIL بصدق.

### معايير تحقق

- guards واضحة.
- verify gate صريحة.
- الحالة لا تدعي أكثر مما ثبت.

### شرط العبور

لا تنتقل إذا كانت الحالة النهائية ما تزال إنشائية أو مترددة.

## Wave 22-C — signoff + remaining gaps

### ماذا ننجز

إصدار الختم النهائي ضمن النطاق الحقيقي فقط.

### TodoList

- [ ] أنشئ `81_FINAL_SIGNOFF.md`.
- [ ] أنشئ `82_SERVICE_SEAL_STATUS.yaml`.
- [ ] أنشئ `83_REMAINING_GAPS.md` و`84_SCOPE_COMPLETION_SUMMARY.md`.
- [ ] حدد ما اكتمل وما لم يكتمل وما هو خارج النطاق.

### معايير تحقق

- الختم النهائي صريح.
- remaining gaps ظاهرة وليست مخفية.
- النطاق موضح بدقة.

### شرط العبور

لا تعتبر المرحلة ناجحة إذا كان signoff يخفي gaps أو يوسّع النطاق زورًا.

## ممنوعات المرحلة

- لا hide gaps
- لا claim full readiness بلا scope
- لا تحويل PARTIAL إلى PASS بالكلام

---

# 8. الخلاصة التنفيذية القصيرة

إذا أردت أن تعرف دائمًا أين أنت، فاسأل نفسك فقط:

1. هل ما أفعله الآن Foundation أم UX أم Contract أم Binding أم Runtime أم Proof؟
2. هل هذه المرحلة لها ملفاتها ومخرجاتها بالفعل؟
3. هل كل موجة فيها TodoList واضحة؟
4. هل معايير التحقق مكتوبة؟
5. هل يوجد شرط عبور واضح؟
6. هل هناك شيء ممنوع الآن وأنا على وشك فعله؟

إذا كانت الإجابة على أي واحدة من هذه الأسئلة هي:
- لا أعرف
- ربما
- لاحقًا
- سنرى

فهذا يعني أن المرحلة لم تُغلق بعد.

---

# 9. الجملة الحاكمة الأخيرة

ابنِ `bthwani-suite` من الصفر على أساس قانون واضح، وهيكل واضح، وخدمة واحدة عميقة، ومراحل بسيطة لكن صارمة، وموجات صغيرة لها TodoList واضحة ومعايير تحقق واضحة، حتى يصبح التنفيذ اليدوي ممكنًا لك خطوة بخطوة دون ضجيج أو قفز أو ادعاء جاهزية قبل أوانها.

---


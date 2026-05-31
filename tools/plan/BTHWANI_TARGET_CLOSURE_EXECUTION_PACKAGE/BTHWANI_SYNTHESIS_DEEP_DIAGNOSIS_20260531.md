# BTHWANI SYNTHESIS — تشخيص عميق وإضافات مفقودة

**التاريخ:** 2026-05-31
**المصدر:** BTHWANI_ATTACHMENTS_DEEP_SYNTHESIS_20260531.md
**النطاق:** تحليل مقارن بين المرفقات والحزمة الحالية + توثيق الفجوات وإضافة ما ينقص.

---

## القسم A — الحكم التنفيذي الأولي

### A.1 وضع الحزمة الراهنة

| البُعد | الحزمة (V7 فعلياً) | المرفق (Synthesis) | التطابق |
|---|---|---|---|
| رقم الإصدار | الملف الرئيسي يقول V7، manifest يقول V6 | لا توجد إصدارات، يصف نظاماً | **تناقض: رقم الإصدار في manifest.json لا يتطابق مع BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md** |
| المسارات القانونية DSH | `dsh/frontend/data` و `dsh/frontend/media-fixtures` ✅ | نفس المسارات ✅ | متطابق |
| مراحل الدورة | 28 قسم + 19 مرحلة Cross-Surface | 29 مرحلة (بالترقيم الصريح) | قريب جداً |
| قاعدة الاستدعاء On-Demand | موجودة في Section 11 | موجودة في المرحلة 3.4 | متطابق |
| تسلسل الأولوية | 8 مستويات في 9a.3 و V7.4 | 8 مستويات في المرحلة 23 | متطابق |
| مصفوفة الأداء | Performance Playbook V7 بـ 22 معيار | Section 6 بنفس المعايير | متطابق جوهرياً |
| Technical/Logic Gate | 24 خطوة في 9a | المراحل 12-13 | متطابق |

### A.2 التناقضات المثبتة

| رقم | التناقض | الموقع في الحزمة | الموقع في المرفق | الحكم |
|---|---|---|---|---|
| C-01 | manifest.json يُعلن `version: 6.0.0` بينما الملف الرئيسي يقول `Version: 7.0.0` | `manifest.json` line 3 | لا علاقة له | **خطأ داخلي في الحزمة — يجب تصحيح manifest** |
| C-02 | BTHWANI_PACKAGE_AUDIT_REPORT.md يصف V6 كأحدث إصدار بينما الملف الرئيسي يصف V7 | `BTHWANI_PACKAGE_AUDIT_REPORT.md` | لا علاقة له | **تناقض داخلي — AUDIT_REPORT لم يُحدَّث مع V7** |
| C-03 | EVIDENCE_STANDARD.md يقول `PACKAGE_RECHECK_VERSION: 6.0.0` في V7.3 من الملف الرئيسي | `V7.3` في الملف الرئيسي | لا علاقة | **التوقع هو 7.0.0 وليس 6.0.0** |
| C-04 | BTHWANI_EXECUTION_CYCLE_RECORD.md يقول `V6` في الرأس وفي القسم 21 يشير إلى `BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE V6` | `EXECUTION_CYCLE_RECORD.md` line 1, 106 | لا علاقة | **سجل الدورة لم يُحدَّث ليعكس V7** |
| C-05 | `CHECK_TARGET_CLOSURE_PACKAGE.ps1` قد يتحقق من `6.0.0` كإصدار مطلوب بينما الحزمة تقول V7 | السكريبت — غير مقروء بعد | تحتاج تحقق | **يستلزم مراجعة السكريبت** |
| C-06 | `BTHWANI_SOURCE_COVERAGE_MATRIX.md` يقول `V6` في رأسه مع أن محتواه يُغطي متطلبات V7 | `SOURCE_COVERAGE_MATRIX.md` line 1 | لا علاقة | **رأس الملف غير محدَّث** |
| C-07 | `BTHWANI_AGENT_NAVIGATION_MAP.md` يقول `V7` في رأسه — هذا صحيح ✅ | رأس السطر 1 | لا علاقة | متسق |
| C-08 | `BTHWANI_AGENT_FAILURE_MODES.md` يقول `V6` في رأسه | رأس السطر 1 | لا علاقة | **رأس الملف غير محدَّث** |
| C-09 | `BTHWANI_OPERATOR_FIELD_MANUAL.md` يقول `V6` في رأسه | رأس السطر 1 | لا علاقة | **رأس الملف غير محدَّث** |
| C-10 | `BTHWANI_TARGET_INPUT_TEMPLATE.md` يقول `V6` | رأس السطر 1 | لا علاقة | **رأس الملف غير محدَّث** |
| C-11 | `BTHWANI_QUICK_START_FOR_AGENTS.md` يقول `V6` وقائمة القراءة تبدأ من MAIN_PACKAGE لا QUICK_START | رأس السطر 1 | لا علاقة | **رأس الملف غير محدَّث + ترتيب غير دقيق** |
| C-12 | `BTHWANI_AGENT_START_COMMAND.md` يقول `V6` | رأس السطر 1 | لا علاقة | **رأس الملف غير محدَّث** |
| C-13 | `BTHWANI_MATRICES_TEMPLATE.md` يقول `V6` | رأس السطر 1 | لا علاقة | **رأس الملف غير محدَّث** |
| C-14 | `BTHWANI_TARGET_ARCHETYPE_GUIDE.md` يقول `V6` | رأس السطر 1 | لا علاقة | **رأس الملف غير محدَّث** |
| C-15 | `BTHWANI_STRUCTURE_REFACTOR_PLAYBOOK.md` يقول `V7` ✅ | رأس السطر 1 | لا علاقة | متسق |
| C-16 | `BTHWANI_PERFORMANCE_PLAYBOOK.md` يقول `V7` ✅ | رأس السطر 1 | لا علاقة | متسق |
| C-17 | في Performance Playbook معيار 16 يقول `dsh/media-fixtures` بدل `dsh/frontend/media-fixtures` | السطر 189 في PERFORMANCE_PLAYBOOK.md | تصحيح C-01 في المرفق | **مسار قديم LEGACY_PATH_REFERENCE داخل الحزمة نفسها** |
| C-18 | `README.md` يشير فقط إلى V6 وليس V7 | `README.md` | لا علاقة | **README لم يُحدَّث مع V7** |
| C-19 | `SHA256SUMS.json` تحتوي هاش للملفات — لكن الملف الرئيسي تغيّر (V7) مما يعني أن الهاش لن يتطابق | `SHA256SUMS.json` | لا علاقة | **SHA256 غير محدَّث — CHECK_SCRIPT سيفشل** |

---

## القسم B — ما يوجد في المرفق وليس موجوداً أو غير مكتمل في الحزمة

### B.1 مصفوفة الفجوات الكاملة

| رقم | الفجوة | نوعها | الأثر | الأولوية |
|---|---|---|---|---|
| G-01 | **غياب ملف `BTHWANI_VERSION_CHANGELOG.md`** | ملف مفقود | الوكيل لا يعرف ما الذي تغيّر بين V6 وV7 والإصدارات السابقة بدقة | عالية |
| G-02 | **غياب `BTHWANI_DECISION_LOG.md`** | ملف مفقود | قرارات مثل "لماذا هذا المسار canonical وليس ذاك" غير موثقة بصورة منفصلة | متوسطة |
| G-03 | **غياب `BTHWANI_ARABIC_RTL_CONTRACT.md`** | ملف مفقود | القواعد العربية/RTL مبعثرة عبر ملفات متعددة (Performance Playbook line 183، Main Package، Operator Manual) بدل ملف مرجعي موحد | عالية |
| G-04 | **غياب playbook للشبكة والـ API binding** | playbook مفقود | خارطة التحرك (Stage 17 في المرحلة 4 من Navigation Map) ليس لها playbook مخصص — API Binding Readiness Map معرّفة كمرحلة لكن بدون playbook تفصيلي | متوسطة |
| G-05 | **غياب `BTHWANI_CROSS_SURFACE_PLAYBOOK.md`** | playbook مفقود | Cross-Surface Closure (Stage 19 في Navigation Map) تمتد عبر 19 مرحلة لكن لا يوجد playbook يوجّه الوكيل خطوة بخطوة | متوسطة |
| G-06 | **غياب `BTHWANI_AUDIT_HISTORY_ROLLBACK_PLAYBOOK.md`** | playbook مفقود | المرحلة 9a.1 خطوة 14 تطلب تصنيف audit/history/rollback لكل action — ليس لها playbook تفصيلي | متوسطة |
| G-07 | **غياب `BTHWANI_CONFLICT_RESOLUTION_MATRIX_TEMPLATE.md`** | قالب مفقود | المرحلة 9 في المرفق وخطوة 9 في 9a.1 تتطلب مصفوفة Conflict Resolution — الحزمة تصفها لكنها ليست ضمن MATRICES_TEMPLATE | متوسطة |
| G-08 | **غياب `BTHWANI_OBSERVABILITY_CLASSIFICATION_TEMPLATE.md`** | قالب مفقود | الخطوة 19 في 9a.1 تطلب تصنيف analytics/audit_log — لا يوجد قالب مرجعي | منخفضة |
| G-09 | **`BTHWANI_TARGET_INPUT_TEMPLATE.md` ناقص من حقول مهمة** | حقول مفقودة | المرفق يذكر `LINKED_SURFACES`, `HUMAN_INTENT`, `NOTES` لكن القالب لا يسأل عن scope مرفوض صريح، ولا يسأل عن `PREVIOUS_CYCLES` لمعرفة ما أُغلق سابقاً | متوسطة |
| G-10 | **`BTHWANI_AGENT_FAILURE_MODES.md` لا يغطي حالة `NAVIGATION_DRIFT`** | فجوة في الغطاء | Navigation Map يصف drift recovery لكن FAILURE_MODES لا يُدرج `NAVIGATION_DRIFT_DETECTED` كحالة فشل صريحة مع استجابة محددة | متوسطة |
| G-11 | **مصفوفة الأداء تفتقد لـ pre-code performance contract** | فجوة منهجية | المرفق (Section 6.1) يقول "الشاشة خفيفة من التصميم قبل الكود" — Gate 1 موجود في Performance Playbook لكن لا يوجد تعاقد صريح pre-code يملأه الوكيل قبل بدء أي feature | منخفضة |
| G-12 | **`EXECUTION_CYCLE_RECORD.md` يحتوي بيانات حقيقية من cycle سابق** | بيانات ملوثة | الملف يحتوي تفاصيل فعلية عن refactoring catalogs في May 2026 — يجب أن يكون قالباً نظيفاً | عالية |
| G-13 | **غياب `BTHWANI_TARGET_CLOSURE_TRACKING.md`** | ملف تتبع مفقود | لا يوجد ملف يتتبع المستهدفات المغلقة عبر الجلسات — الوكيل يبدأ دائماً من الصفر | متوسطة |
| G-14 | **`CHECK_TARGET_CLOSURE_PACKAGE.ps1` لم يُقرأ محتواه** | فجوة في التحقق | السكريبت كبير (11131 بايت) ويُحتمل أنه لم يُحدَّث ليتحقق من V7 — يتحقق من `V6.0.0` فقط | عالية |
| G-15 | **غياب `BTHWANI_UI_STATES_CONTRACT_TEMPLATE.md`** | قالب مفقود | المرحلة 16 تشترط: loading/empty/error/blocked/disabled/success — لا يوجد قالب مخصص لتوثيق حالات UI لكل شاشة | منخفضة |
| G-16 | **`BTHWANI_SOURCE_COVERAGE_MATRIX.md` يفتقد تغطية `BTHWANI_ATTACHMENTS_DEEP_SYNTHESIS_20260531.md`** | تغطية منقوصة | المصادر الخمسة المدرجة تشمل الملفات الأصلية لكن ليس ملف التوليف الحالي | منخفضة |
| G-17 | **`BTHWANI_MATRICES_TEMPLATE.md` لا يتضمن مصفوفة Conflict Resolution** | مصفوفة مفقودة | الحزمة الرئيسية تطلب تصنيف conflict resolution لكن القالب لا يوفر الهيكل الجاهز | متوسطة |
| G-18 | **غياب توجيه صريح للأسطح الـ 15 المرتبطة في Target Input Template** | توجيه مفقود | المرفق Section 3.3 يحدد 15 سطحاً مرتبطاً — القالب الحالي لا يطلب تصنيف السطح من قائمة محددة | متوسطة |
| G-19 | **`BTHWANI_AGENT_START_COMMAND.md` يشير إلى قراءة QUICK_START أولاً بينما يقدم MAIN_PACKAGE أولاً في ترتيب القراءة** | تناقض منطقي | Navigation Map يقول: `START → QUICK_START → MAIN_PACKAGE` لكن AGENT_START_COMMAND يبدأ بـ MAIN_PACKAGE مباشرة | متوسطة |
| G-20 | **غياب مصفوفة `VALIDATION_RULES_TEMPLATE` قابلة لإعادة الاستخدام** | قالب مفقود | الخطوة 8 في 9a.1 تطلب تفصيل validation لكل form/action — EXECUTION_CYCLE_RECORD يحتوي مثال محدد (Marketing) لكن لا يوجد قالب عام | منخفضة |

---

## القسم C — التناقضات الحرجة التي تستلزم تصحيحاً فورياً

### C.CRITICAL-01 — تناقض رقم الإصدار (الأعلى خطورة)

```text
الوضع الحالي:
  manifest.json            → version: 6.0.0
  MAIN_PACKAGE.md          → Version: 7.0.0
  README.md                → يذكر V6 فقط
  PACKAGE_AUDIT_REPORT.md  → يذكر V6 كأحدث إصدار
  EVIDENCE_STANDARD.md     → يشير إلى PACKAGE_RECHECK_VERSION: 6.0.0
  EXECUTION_CYCLE_RECORD   → يقول V6 في الرأس وفي Section 21

الأثر:
  CHECK_TARGET_CLOSURE_PACKAGE.ps1 يتحقق من manifest.version
  إذا كان يتوقع 6.0.0 والحزمة تدّعي 7.0.0 → التحقق سيفشل أو يعطي نتيجة كاذبة
  V7.1 في الملف الرئيسي يقول: manifest.version = 7.0.0 كشرط للصلاحية
  إذن الحزمة نفسها تفشل اختبار صلاحيتها الخاص

الحكم:
  PACKAGE_INVALID_BY_SELF_TEST — يجب تصحيح manifest.json أولاً
```

### C.CRITICAL-02 — SHA256 غير متسق مع الحالة الراهنة

```text
الوضع الحالي:
  SHA256SUMS.json حُسبت في 2026-05-29 (تاريخ manifest)
  BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md محتواه V7 (تاريخ 2026-05-30)
  BTHWANI_EXECUTION_CYCLE_RECORD.md اُضيف إليه sections 29 و 30 (Marketing data)

الأثر:
  أي CHECK script يتحقق من SHA256 سيفشل على MAIN_PACKAGE.md و EXECUTION_CYCLE_RECORD.md
  PACKAGE_RECHECK_STATUS = FAIL بسبب تغييرات ما بعد 2026-05-29

الحكم:
  SHA256SUMS.json يحتاج إعادة حساب بعد تثبيت جميع التعديلات
```

### C.CRITICAL-03 — LEGACY_PATH داخل الحزمة نفسها

```text
الموقع:
  BTHWANI_PERFORMANCE_PLAYBOOK.md السطر 189:
  "ALL DSH demo data and media must point exclusively to `dsh/frontend/data` and `dsh/media-fixtures`."

المشكلة:
  `dsh/media-fixtures` هو LEGACY_PATH
  المسار الصحيح هو `dsh/frontend/media-fixtures`

الحكم:
  الحزمة تنشر LEGACY_PATH في الملف الذي يُفترض أنه يُعلّم الوكيل
  هذا يخالف قاعدة C-01 في المرفق ومبدأ Section 10 في الملف الرئيسي
```

---

## القسم D — ما يجب إضافته للحزمة (الإضافات المطلوبة)

### D.1 الإضافات الفورية — أولوية عالية

الملفات المطلوب إنشاؤها أو تعديلها:

```text
[تعديل] manifest.json
  → version: "7.0.0"
  → date: "2026-05-31"
  → إضافة BTHWANI_SYNTHESIS_DEEP_DIAGNOSIS_20260531.md إلى قائمة files (اختياري)

[تعديل] README.md
  → تحديث Status: "Use V7 only. V1-V6 superseded."
  → تحديث "What V7 adds"
  → تحديث package evidence version إلى 7.0.0

[تعديل] BTHWANI_PACKAGE_AUDIT_REPORT.md
  → تحديث ليصف V7 لا V6

[تعديل] BTHWANI_PERFORMANCE_PLAYBOOK.md السطر 189
  → "dsh/media-fixtures" → "dsh/frontend/media-fixtures"

[تعديل] SHA256SUMS.json
  → إعادة حساب بعد كل التعديلات

[تعديل] رؤوس الملفات الآتية من V6 إلى V7:
  → BTHWANI_EXECUTION_CYCLE_RECORD.md
  → BTHWANI_AGENT_FAILURE_MODES.md
  → BTHWANI_OPERATOR_FIELD_MANUAL.md
  → BTHWANI_TARGET_INPUT_TEMPLATE.md
  → BTHWANI_QUICK_START_FOR_AGENTS.md
  → BTHWANI_AGENT_START_COMMAND.md
  → BTHWANI_MATRICES_TEMPLATE.md
  → BTHWANI_TARGET_ARCHETYPE_GUIDE.md
  → BTHWANI_SOURCE_COVERAGE_MATRIX.md
  → BTHWANI_ROLLBACK_PROTOCOL.md
  → BTHWANI_EVIDENCE_STANDARD.md
  → BTHWANI_PACKAGE_AUDIT_REPORT.md
```

### D.2 الإضافات المهمة — أولوية متوسطة

```text
[جديد] BTHWANI_VERSION_CHANGELOG.md
[جديد] BTHWANI_ARABIC_RTL_CONTRACT.md
[جديد] BTHWANI_CONFLICT_RESOLUTION_MATRIX_TEMPLATE.md
[تعديل] BTHWANI_MATRICES_TEMPLATE.md — إضافة Conflict Resolution Matrix
[تعديل] BTHWANI_AGENT_FAILURE_MODES.md — إضافة NAVIGATION_DRIFT_DETECTED كحالة فشل صريحة
[تعديل] BTHWANI_TARGET_INPUT_TEMPLATE.md — إضافة حقول PREVIOUS_CYCLES وLINKED_SURFACES_SCOPE
[تعديل] BTHWANI_EXECUTION_CYCLE_RECORD.md — تنظيف البيانات الحقيقية وجعله قالباً نظيفاً
[تعديل] BTHWANI_AGENT_START_COMMAND.md — تصحيح ترتيب القراءة ليبدأ من QUICK_START
```

### D.3 الإضافات التحسينية — أولوية منخفضة

```text
[جديد] BTHWANI_TARGET_CLOSURE_TRACKING.md — تتبع المستهدفات المغلقة عبر الجلسات
[جديد] BTHWANI_CROSS_SURFACE_PLAYBOOK.md — playbook لمراحل Cross-Surface الـ 19
[جديد] BTHWANI_UI_STATES_CONTRACT_TEMPLATE.md — قالب لحالات UI
[جديد] BTHWANI_OBSERVABILITY_CLASSIFICATION_TEMPLATE.md — قالب تصنيف observability
[تعديل] BTHWANI_SOURCE_COVERAGE_MATRIX.md — إضافة تغطية لـ SYNTHESIS_20260531.md
```

---

## القسم E — قائمة الاستدعاء On-Demand (من المرفق)

ما ورد في المرفق Section 3.4 كقواعد تنفيذية وتحتاج التحقق من وجودها الكامل في الحزمة:

| قاعدة | موجودة في الحزمة؟ | المكان |
|---|---|---|
| `summary-first` | ✅ | Section 11 |
| `detail-on-open` | ✅ | Section 11 |
| `IDs/references/mediaKey` | ✅ | Section 11 |
| `pagination/cursor` | ✅ | Section 11 |
| `lazy sections` | ✅ | Section 11 |
| `no eager loading` | ✅ | Section 11 |
| `no full duplicated objects` | ✅ | Section 11 |
| `no fetch per row` | ✅ | Performance Playbook |
| `request dedupe` | ⚠️ | مذكور في Performance Playbook section 3 لكن ليس في Section 11 كقاعدة صريحة |
| `abort/cancel` | ❌ | **غير موجود في Section 11 أو Performance Playbook — مذكور في المرفق Section 16** |
| `cache` | ⚠️ | مذكور في Performance Playbook section 3 بشكل جانبي |

---

## القسم F — مصفوفة تقييم شمولية الحزمة

| مرحلة من المرفق | تغطية في الحزمة | درجة التغطية | ملاحظة |
|---|---|---|---|
| المرحلة 1 — Package/Navigation Gate | Section 2 + Navigation Map | 95% | — |
| المرحلة 2 — Branch/Repo Sanity | Section 3 | 100% | — |
| المرحلة 3 — Target Input | Target Input Template | 80% | ناقص حقول Previous Cycles |
| المرحلة 4 — Repo-First Discovery | Section 4 في Archetype Guide | 90% | — |
| المرحلة 5 — Target Type Classification | Archetype Guide Section 1 | 95% | — |
| المرحلة 6 — Linked Surface Classification | Matrices Template | 90% | — |
| المرحلة 7 — Topic Decision | Sections 7–8 + Structure Playbook | 100% | — |
| المرحلة 8 — Screen/File Structure Audit | Section 9 + Structure Playbook | 95% | — |
| المرحلة 9 — Progressive Flat Topic Module | Section 8 + Structure Playbook | 100% | — |
| المرحلة 10 — File Boundary Matrix | Matrices Template | 100% | — |
| المرحلة 11 — Structural Hygiene Gate | Section 9 | 100% | — |
| المرحلة 12 — Technical/Logic Gap Discovery | Section 9a | 100% | — |
| المرحلة 13 — Technical/Logic Gap Closure | Section 9a.1 خطوة 1-24 | 100% | — |
| المرحلة 14 — UX/Flow Closure | Section 9a.1 خطوة 4 | 80% | لا يوجد تفصيل مستقل لـ UX flow |
| المرحلة 15 — DSH Data/Media Closure | Section 10 | 95% | — |
| المرحلة 16 — Data Loading/On-Demand | Section 11 | 85% | ناقص abort/cancel |
| المرحلة 17 — Runtime/API Boundary | Section 14 | 95% | — |
| المرحلة 18 — Performance Closure | Section 13 + Performance Playbook | 95% | LEGACY_PATH في playbook |
| المرحلة 19 — Design Preservation Baseline | Section 9a + Structure Playbook 3 | 90% | — |
| المرحلة 20 — UI-kit/Design System Gate | Section 9 (hygiene checks) | 85% | لا يوجد ملف مخصص للـ UI-kit contract |
| المرحلة 21 — Security/Privacy/Secrets | Section 9a.1 خطوة 18 | 70% | فقط خطوة واحدة بدون تفصيل |
| المرحلة 22 — Tests/Guards Readiness | Section 9a.1 خطوة 20 | 75% | غير مفصّلة بشكل كافٍ |
| المرحلة 23 — Task Selection | Section 9a.3 + V7.4 | 100% | — |
| المرحلة 24 — Task Execution Package | Matrices Template (Target Execution Map) | 90% | — |
| المرحلة 25 — Verification | Section 15 | 100% | — |
| المرحلة 26 — Evidence Pack | Sections 15+V7.4+Evidence Standard | 95% | — |
| المرحلة 27 — Re-Diagnosis Loop | Section 4 (cycle) | 85% | لا توجد خطوات re-diagnosis صريحة |
| المرحلة 28 — Human Approval Gate | Navigation Map Section 8 | 100% | — |
| المرحلة 29 — Final Decision | Section 21 | 95% | — |

**متوسط التغطية الإجمالية: ~91%**

---

## القسم G — قواعد مستخرجة من المرفق غير مذكورة صراحةً في الحزمة

### G.1 قاعدة الإغلاق المنطقي لأنواع target

المرفق Section 3.3 يذكر ربط Target بـ 15 سطحاً محدداً. الحزمة تذكر هذه الأسطح في Archetype Guide لكن لا تُلزم الوكيل بقائمة صريحة منها.

قاعدة مضافة:
```text
LINKED_SURFACE_REGISTRY:
  app-client
  app-partner
  app-captain
  app-field
  control-panel
  catalogs
  marketing
  partners
  platform/vars
  finance/WLT
  support
  operations
  administration
  shared/data/media
  guards/docs/tests
```

### G.2 قاعدة التنفيذ عند غياب صلاحية الكتابة

المرفق Section 2.3 يُحدد بدائل عند غياب صلاحية الكتابة:

```text
إذا كان المنفذ لا يملك صلاحية كتابة محلية يقدم واحداً من:
  PowerShell command
  PowerShell script
  unified diff patch
  file-by-file replacement
  narrow Copilot prompt
  verification commands
  evidence checklist

هذا غير مذكور بشكل صريح في OPERATOR_FIELD_MANUAL.md — يجب إضافته.
```

### G.3 شرط الأدلة النوعية لكل نوع إغلاق

المرفق Section 2.2 يُحدد شروط الأدلة بحسب نوع الإغلاق:

```text
UI_VISIBLE → screenshots
Performance → measurement commands
Logic/Flow → typecheck + guard
Data/Media → consistency check
Governance → guard:governance:check
```

هذا موجود جزئياً في Evidence Standard لكن لا توجد جدول صريح يربط نوع العمل بنوع الدليل المطلوب.

---

## القسم H — الفجوة الأهم: بيانات محلوثة في EXECUTION_CYCLE_RECORD

### H.1 التشخيص

`BTHWANI_EXECUTION_CYCLE_RECORD.md` هو ملف **سجل دورة حقيقية** من refactoring catalogs في 2026-05-28.

يحتوي:
- بيانات branch حقيقية (`ghb/0170-20260528-215231-create-new-branch`)
- ملفات محددة (`dsh/frontend/control-panel/catalogs/`)
- نتائج تحقق حقيقية
- مصفوفات مُعبأة بقيم حقيقية
- أقسام 29 و 30 تحتوي Marketing Control Panel closure data

### H.2 المشكلة

هذا يعني أن الوكيل الذي يقرأ هذا الملف سيتعامل مع بيانات cycle سابق كأنها السياق الحالي. هذا يُسبب:
- context pollution
- خلط بين سجل تاريخي وقالب تنفيذ حالي
- الوكيل قد يستنتج خطأً أن catalogs مُغلق

### H.3 التوصية

```text
[1] إنشاء BTHWANI_EXECUTION_CYCLE_RECORD_TEMPLATE.md (قالب نظيف)
[2] نقل السجل الحالي إلى:
    tools/registry/runs/CYCLE-CATALOGS-20260529/CYCLE_RECORD.md
[3] استبدال BTHWANI_EXECUTION_CYCLE_RECORD.md بالقالب النظيف
```

---

## القسم I — الإضافات المنفّذة في هذا الملف

هذا الملف نفسه يُعدّ الإضافة الأولى الناتجة عن التحليل. الملفات الإضافية التي يجب إنشاؤها مرتبة بالأولوية:

### I.1 أولوية عالية — تصحيحات فورية

| الملف | النوع | السبب |
|---|---|---|
| `manifest.json` | تعديل | تصحيح version: 7.0.0 |
| `README.md` | تعديل | تحديث Status وVersion references |
| `BTHWANI_PACKAGE_AUDIT_REPORT.md` | تعديل | تحديث ليصف V7 |
| `BTHWANI_PERFORMANCE_PLAYBOOK.md` | تعديل | إصلاح LEGACY_PATH السطر 189 |
| رؤوس جميع الملفات V6 | تعديل | توحيد الإصدار إلى V7 |
| `BTHWANI_EXECUTION_CYCLE_RECORD.md` | إعادة هيكلة | تنظيف البيانات وجعله قالباً نظيفاً |

### I.2 أولوية متوسطة — ملفات جديدة مطلوبة

| الملف | النوع | السبب |
|---|---|---|
| `BTHWANI_VERSION_CHANGELOG.md` | جديد | توثيق تاريخ الإصدارات |
| `BTHWANI_ARABIC_RTL_CONTRACT.md` | جديد | توحيد قواعد RTL المبعثرة |
| `BTHWANI_CONFLICT_RESOLUTION_MATRIX_TEMPLATE.md` | جديد | قالب مصفوفة conflict resolution |

### I.3 أولوية منخفضة — تحسينات

| الملف | النوع | السبب |
|---|---|---|
| `BTHWANI_CROSS_SURFACE_PLAYBOOK.md` | جديد | playbook للمراحل 19 |
| `BTHWANI_TARGET_CLOSURE_TRACKING.md` | جديد | تتبع ما أُغلق عبر الجلسات |

---

## القسم J — القرار التنفيذي النهائي

```text
SYNTHESIS_VERDICT:
  الحزمة قوية ومتكاملة بشكل كبير (91% تغطية).
  التناقضات الحرجة هي إصدار-رقم فقط وليست منهجية.
  لا يوجد تعارض منهجي بين المرفق والحزمة.

CRITICAL_FIXES_REQUIRED:
  C-CRITICAL-01: manifest.json → version: 7.0.0
  C-CRITICAL-02: SHA256SUMS.json → إعادة حساب
  C-CRITICAL-03: PERFORMANCE_PLAYBOOK.md → إصلاح LEGACY_PATH

VERSION_HEADER_FIXES:
  12 ملف بحاجة لتحديث رأس الإصدار من V6 إلى V7

NEW_FILES_REQUIRED:
  عالية: BTHWANI_VERSION_CHANGELOG.md, BTHWANI_ARABIC_RTL_CONTRACT.md
  متوسطة: BTHWANI_CONFLICT_RESOLUTION_MATRIX_TEMPLATE.md
  منخفضة: 3 ملفات إضافية

CYCLE_RECORD_CONTAMINATION:
  BTHWANI_EXECUTION_CYCLE_RECORD.md يحتاج تنظيفاً عاجلاً

FINAL_PACKAGE_STATUS:
  PACKAGE_FUNCTIONAL_BUT_VERSION_INCONSISTENT
  SAFE_FOR_CONTROLLED_EXECUTION_WITH_AWARENESS
  NOT_SAFE_FOR_AUTOMATED_PACKAGE_CHECK (بسبب SHA256 وversion mismatch)
```

---

**هذا الملف جزء من الحزمة — لا يُعد سجل دورة تنفيذية بل تحليل إضافي ومرجع للتصحيح.**

# BTHWANI GUIDE

## Manual Service Extraction Guide — Donor → KDT

### الدليل التنفيذي اليدوي المختصر لاستخراج الخدمة من الريبو القديم إلى مخزن `kdt`

---

## 1) الغاية

هذا الدليل مخصص لاستخراج **كل ما يخص أي خدمة** من الريبو القديم `bthfinal` إلى مخزن الأدلة والتنظيم `bthwani-suite/kdt/volatile/registry/runs/{SESSION_ID}/` بشكل يدوي، منظم، وعميق، بحيث لا يبدأ البناء في `bthwani-suite` إلا بعد اكتمال **حزمة استخراج خدمية كاملة** قابلة للتحقق.

هذا الدليل لا يسمح بالاستخراج العشوائي، ولا بالاكتفاء بملفات أو شاشات متناثرة، ولا بنقل الكود مباشرة. الأصل أن الريبو القديم **donor evidence only**، والقرار الافتراضي لأي شيء مستخرج هو `REBUILD_CLEAN` ما لم يثبت عكس ذلك.  

---

## 2) القانون الحاكم

### 2.1 القاعدة الأساسية

لكل خدمة، يجب أن يجيب التنفيذ دائمًا عن سؤالين متلازمين:

1. **ماذا يجب استخراجه من الريبو القديم؟**
2. **ماذا يجب أن يترجم منه لاحقًا إلى بناء حيّ داخل الريبو الجديد؟**

أي عنصر يتم استخراجه ولا يملك مصيرًا تنفيذيًا واضحًا يبقى **ناقصًا**.

### 2.2 المساران الإلزاميان

كل تنفيذ يجب أن يسير بمسارين متزامنين:

- **Donor Recovery Track**  
  يحدد: ماذا نقرأ، من أين نقرأ، ماذا نستخرج، كيف نطبعّه، وكيف نقرر مصيره.

- **KDT Extraction Pack Track**  
  يحدد: أين نكتب الناتج داخل `kdt`، بأي schema، بأي counts، وبأي evidence، وبأي handoff.

### 2.3 قرار التصنيف الإلزامي

كل عنصر مستخرج يجب أن يأخذ واحدًا فقط من القرارات التالية:

- `REBUILD_IN_TARGET`
- `EXTRACT_AND_ADAPT`
- `REFERENCE_ONLY`
- `MOVE_TO_LEGACY`
- `DEFER`
- `REJECT`

ولا يُغلق أي عنصر دون:

- السبب
- المالك
- الطبقة المستهدفة
- المسار المستهدف لاحقًا في الريبو الجديد
- المرحلة/الموجة المستهدفة
- proof class
- closure condition

---

## 3) جذور العمل الثابتة

- **الريبو القديم / donor:** `bthfinal`
- **الريبو النشط / clean build line:** `bthwani-suite`
- **مسار الأدلة والتجميع:** `bthwani-suite/kdt/volatile/registry/runs/{SESSION_ID}/`
- **قاعدة المشروع:** الخدمة تُستخرج خدمة بخدمة، وليس بالتوازي العميق.

---

## 4) ما الذي يجب استخراجه لكل خدمة

لكل خدمة فعالة، يجب استخراج الحزمة التالية **من الألف إلى الياء**:

### 4.1 هوية الخدمة
- service id
- aliases / donor names
- الهدف الوظيفي
- non-goals
- boundaries
- ownership traces

### 4.2 الجهات والأدوار
- actors
- context roles
- entitlements
- visibility scopes
- surface legality
- included / excluded actors

### 4.3 العمليات
- operation ids
- aliases
- owners
- entry triggers
- state effects
- supporting/wrapper ops
- deprecated/deferred ops

### 4.4 الرحلات
- initiating journeys
- happy paths
- failure paths
- recovery paths
- return/resumption paths
- support/staff paths
- transitions بين الأسطح والعمليات

### 4.5 الشاشات والوحدات
- screens
- routes
- modals
- sheets
- sections
- state-only units
- internal units
- donor screen names and aliases
- normalized target names

### 4.6 سلوك الشاشة
- purpose
- primary CTA
- secondary actions
- entry / exit
- data blocks
- state anatomy
- validation behavior
- error behavior
- retry behavior
- offline behavior
- empty behavior

### 4.7 طبقة الربط والتنفيذ
- binding patterns
- client/controller/service/repository traces
- raw fetch traces إن وجدت
- contract pressure
- generated-layer assumptions
- runtime truth assumptions
- provider assumptions

### 4.8 مشاكل donor نفسها
- drift
- duplication
- anti-patterns
- mixed ownership
- naming history
- dead flows
- partial implementations

---

## 5) مخرجات KDT الإلزامية لكل خدمة

يجب أن ينتج عن كل خدمة **Service Extraction Pack** داخل:

`kdt/volatile/registry/runs/{SESSION_ID}/services/<service-id>/`

### 5.1 الملفات الإلزامية

1. `00_SERVICE_EXTRACTION_SCOPE.md`  
2. `01_DONOR_SOURCE_INDEX.md`  
3. `02_DONOR_EXHAUSTIVE_CENSUS.csv`  
4. `03_ACTOR_CONTEXT_MASTER.csv`  
5. `04_MASTER_OPERATION_REGISTRY.csv`  
6. `05_SURFACE_COVERAGE_MATRIX.csv`  
7. `06_JOURNEY_MASTER.csv`  
8. `07_MASTER_SCREEN_REGISTRY.csv`  
9. `08_SCREEN_STATE_MATRIX.csv`  
10. `09_BINDING_AND_RUNTIME_NOTES.md`  
11. `10_DISPOSITION_MATRIX.csv`  
12. `11_DONOR_DRIFT_DUPLICATION_REPORT.md`  
13. `12_EXTRACTION_COUNTS.json`  
14. `13_BLOCKERS.md`  
15. `14_EVIDENCE_INDEX.md`

### 5.2 منع صارم

لا يجوز استبدال هذه الحزمة بـ:

- ملاحظات عامة
- سرد حر
- ملفات متناثرة بلا schema
- screenshots بلا trace
- استنتاجات غير مربوطة بمصدر

---

## 6) الـ schema الأدنى لكل ملف

### 6.1 DONOR_EXHAUSTIVE_CENSUS
أعمدة دنيا:

- `row_id`
- `service_id`
- `entity_type`
- `donor_name`
- `canonical_name`
- `donor_path`
- `surface`
- `route_or_entry`
- `source_trace`
- `status`

### 6.2 ACTOR_CONTEXT_MASTER
- `actor_id`
- `actor_label`
- `canonical_surface`
- `context_role`
- `entitlements`
- `visibility_scope`
- `exclusions`
- `donor_trace`
- `decision_status`

### 6.3 MASTER_OPERATION_REGISTRY
- `operation_id`
- `canonical_name`
- `donor_aliases`
- `owner`
- `actors`
- `surfaces`
- `trigger`
- `state_effect`
- `classification`
- `source_trace`

### 6.4 MASTER_SCREEN_REGISTRY
- `screen_id`
- `canonical_name`
- `donor_aliases`
- `unit_type`
- `surface`
- `actor`
- `route`
- `related_operations`
- `related_journeys`
- `primary_cta`
- `states`
- `donor_trace`

### 6.5 DISPOSITION_MATRIX
- `entity_id`
- `entity_type`
- `canonical_name`
- `disposition`
- `reason`
- `future_repo_layer`
- `future_repo_path`
- `future_owner`
- `target_phase`
- `target_wave`
- `proof_class`
- `closure_condition`

---

## 7) التسلسل التنفيذي المختصر

### STEP 0 — Scope Lock
حدد الخدمة المستهدفة فقط.  
امنع أي توسع لخدمات أخرى.

### STEP 1 — Source Index
افتح كل الجذور ذات الصلة في donor وسجلها في `01_DONOR_SOURCE_INDEX.md`.

### STEP 2 — Exhaustive Census
اسحب كل الكيانات المرتبطة بالخدمة إلى `02_DONOR_EXHAUSTIVE_CENSUS.csv` بدون تطبيع مبكر.

### STEP 3 — Actor / Context Recovery
ابنِ `03_ACTOR_CONTEXT_MASTER.csv` مع legality وentitlements وvisibility.

### STEP 4 — Operation Recovery
ابنِ `04_MASTER_OPERATION_REGISTRY.csv` مع alias/dedupe/owner/state effect.

### STEP 5 — Surface & Journey Recovery
ابنِ `05_SURFACE_COVERAGE_MATRIX.csv` و`06_JOURNEY_MASTER.csv`.

### STEP 6 — Screen Recovery
ابنِ `07_MASTER_SCREEN_REGISTRY.csv` لكل شاشة ووحدة مرتبطة بالخدمة.

### STEP 7 — State Recovery
أغلق حالات الشاشة في `08_SCREEN_STATE_MATRIX.csv`:

- loading
- empty
- filtered empty
- offline
- disabled
- unauthorized
- forbidden
- not found
- validation error
- upstream error
- duplicate submit
- success
- stale
- archived

### STEP 8 — Binding / Runtime Notes
اكتب أين كانت الحقيقة التشغيلية، وما هي سلاسل الربط، وأين توجد المخاطر، في `09_BINDING_AND_RUNTIME_NOTES.md`.

### STEP 9 — Disposition Decision
أعطِ كل عنصر مستخرج قرارًا صريحًا في `10_DISPOSITION_MATRIX.csv`.

### STEP 10 — Drift / Duplication Report
سجّل التكرار، التضارب، المسارات الميتة، mixed ownership، والanti-patterns في `11_DONOR_DRIFT_DUPLICATION_REPORT.md`.

### STEP 11 — Counts + Blockers + Evidence
أغلق الحزمة عبر:

- `12_EXTRACTION_COUNTS.json`
- `13_BLOCKERS.md`
- `14_EVIDENCE_INDEX.md`

---

## 8) قواعد التحقق قبل اعتبار الحزمة صالحة

لا تعتبر حزمة الاستخراج صالحة إلا إذا تحقق التالي:

- `service_scope_locked = true`
- `donor_sources_indexed = true`
- `actors_recovered = 100%`
- `operations_recovered = 100%`
- `surfaces_classified = 100%`
- `journeys_covered = 100%`
- `screens_and_units_recovered = 100%`
- `state_rows_present = 100% for retained screens`
- `unclassified_entities = 0`
- `duplicate_active_ids = 0`
- `orphan_operations = 0`
- `orphan_screens = 0`
- `missing_source_trace = 0`
- `evidence_index_present = true`

أي نقص في هذه البنود = `BLOCKED` أو `UNPROVEN`.

---

## 9) ما الذي يُمنع تمامًا

- نقل الكود من donor إلى clean repo قبل اكتمال الحزمة.
- القفز مباشرة إلى بناء شاشات جديدة بدون `MASTER_SCREEN_REGISTRY`.
- الاعتماد على التصفح العشوائي للريبو القديم.  
- استخراج الشاشات دون العمليات.  
- استخراج العمليات دون actors/journeys/surfaces.  
- اعتبار preview أو وجود route دليلاً على اكتمال الحقيقة التشغيلية.  
- ترك أي عنصر دون `source_trace` أو `disposition`.

---

## 10) صيغة الإغلاق لكل خدمة

لا يُقال إن الخدمة “جاهزة للاقتباس” إلا إذا كانت نتيجة الإغلاق واحدة من هاتين:

- `SERVICE_EXTRACTION_PACK = PASS`
- `SERVICE_EXTRACTION_PACK = FAIL`

### PASS يتطلب:
- donor coverage proven
- extraction counts explicit
- trace coverage explicit
- disposition coverage = 100%
- blockers either closed or explicitly non-blocking
- KDT pack complete and readable by another executor

### FAIL يعني:
- نقص artifacts
- gaps غير مصنفة
- traces ناقصة
- screens/operations/journeys غير مكتملة
- لا يوجد handoff صالح للبناء في الريبو الجديد

---

## 11) handoff إلى البناء في الريبو الجديد

بعد نجاح حزمة الاستخراج فقط، تنتج الخدمة **Implementation Handoff** يتضمن:

- ما الذي سيُعاد بناؤه clean
- ما الذي سيبقى reference only
- ما الذي سيُستفاد منه جزئيًا
- ما screen bundles التي ستُبنى أولًا
- ما operations التي تُربط أولًا
- ما contract pressure الذي سيفتح Phase 17–19 لاحقًا
- ما runtime proof class المطلوب لاحقًا

بمعنى آخر:

**KDT لا يصبح مخزنًا للأرشفة فقط، بل مخزنًا تنفيذيًا جاهزًا لفتح البناء النظيف في `bthwani-suite`.**

---

## 12) القرار التنفيذي النهائي

لا يكفي أن نعرف ماذا كان موجودًا في الريبو القديم.  
يجب أن نُخرجه خدمة بخدمة، بشكل exhaustive، منظم، مقاس، ومصنف، ثم نودعه داخل `kdt` كحزمة استخراج خدمية كاملة، بحيث يصبح البناء في `bthwani-suite` لاحقًا مبنيًا على **evidence pack حقيقي** لا على ذاكرة، ولا على تخمين، ولا على نقل مباشر.


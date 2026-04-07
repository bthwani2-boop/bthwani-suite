# BTHWANI GUIDE

## Unified Manual — Service Extraction + KDT Evidence + docs/services Execution Operating Pack

### الدليل التنفيذي اليدوي الموحّد لاستخراج أي خدمة من donor وتحويلها إلى مسار تنفيذ كامل داخل `docs/services`

---

## 0) Document Character

هذا الملف هو **دليل واحد موحّد** يدمج ثلاثة أمور في مرجع واحد:

1. **استخراج الخدمة من donor**
2. **بناء حزمة أدلة واستخراج داخل `kdt`**
3. **تحويل الخدمة داخل `docs/services/<service-id>` إلى Service Execution Operating Pack كامل**

هذا الملف ليس ملخصًا، وليس قائمة ملفات، وليس مجرد قانون عام.

هذا الملف يجب أن يكون قادرًا على توجيه التنفيذ لأي خدمة من البداية إلى النهاية، بحيث يجيب بوضوح عن:

- ماذا نقرأ من donor
- ماذا نستخرج
- أين نكتب الناتج في `kdt`
- كيف نقرر مصير كل عنصر
- كيف نحول الناتج إلى targets داخل الريبو الجديد
- كيف نجعل `docs/services/<service-id>` نقطة التشغيل الوحيدة للخدمة
- كيف نبدأ بالشاشة الأولى
- كيف نتحرك عبر الموجات
- كيف نفتح code action
- متى ننتقل إلى contract / binding / runtime / proof
- وكيف نغلق الخدمة بشكل قانوني

---

## 1) الغاية

الغاية ليست فقط تجميع ما في donor، ولا فقط وصف ما سنبنيه.

الغاية هي أن أي خدمة تمر بالناتج التالي:

### Output A — Donor Truth
الحقيقة المستخرجة من الريبو القديم.

### Output B — KDT Evidence Pack
حزمة extraction + counts + traces + blockers + dispositions داخل:

`bthwani-suite/kdt/volatile/registry/runs/{SESSION_ID}/services/<service-id>/`

### Output C — docs/services Execution Operating Pack
حزمة تشغيل تنفيذية كاملة داخل:

`C:\Users\b\Documents\GitHub\bthwani-suite\docs\services\<service-id>\`

بحيث يصبح هذا المسار الأخير هو المرجع التنفيذي اليومي الوحيد للخدمة.

---

## 2) القانون الحاكم

### 2.1 donor law
- `bthfinal` = donor evidence-only
- donor ليس build line
- donor لا يُنقل wholesale
- القرار الافتراضي لأي carryover = `REBUILD_CLEAN`

### 2.2 clean repo law
- `bthwani-suite` = active clean build line
- البناء الحقيقي يتم هنا
- الحاجة في الريبو الجديد هي التي تقود donor recovery، وليس العكس

### 2.3 service-by-service law
- التنفيذ العميق يتم خدمة بخدمة
- لا deep parallel execution across services

### 2.4 dual-track law
كل خدمة يجب أن تسير بمسارين متزامنين:

- **KDT Evidence Track**
- **docs/services Execution Track**

### 2.5 operating-pack law
`docs/services/<service-id>` لا يجوز أن يبقى Build Pack عام.
بل يجب أن يتحول إلى:

**Service Execution Operating Pack**

### 2.6 no-item-without-destination law
أي extraction item يجب أن يملك:
- disposition
- future repo layer
- future repo path
- future owner
- build phase/wave
- proof class
- closure condition

أي item بلا هذا = ناقص.

---

## 3) الجذور الثابتة

- donor root: `bthfinal`
- active repo root: `bthwani-suite`
- KDT evidence root: `bthwani-suite/kdt/volatile/registry/runs/{SESSION_ID}/`
- service execution root: `C:\Users\b\Documents\GitHub\bthwani-suite\docs\services\<service-id>\`

---

## 4) المسارات الثلاثة

## Track 1 — Donor Recovery
يجيب:
- ماذا نقرأ
- من أين نقرأ
- ماذا نستخرج
- ما aliases
- ما drift
- ما الذي يجب تطبيعه

## Track 2 — KDT Evidence Pack
يجيب:
- ما rows المستخرجة
- ما counts
- ما traces
- ما blockers
- ما contradictions
- ما dispositions

## Track 3 — docs/services Execution Operating Pack
يجيب:
- ماذا سنبني
- أين سنبنيه
- بأي ownership
- ما أول شاشة
- ما build queue
- ما waves
- ما targets
- ما gates
- متى نفتح contract/binding/runtime/proof

---

## 5) ماذا يجب استخراجه من donor لكل خدمة

لكل خدمة يجب استخراج التالي 100%:

### 5.1 Service Identity
- service id
- donor aliases
- service purpose
- non-goals
- boundaries
- ownership traces

### 5.2 Actors / Contexts
- actors
- roles
- entitlements
- visibility rules
- surface legality
- included / excluded actors

### 5.3 Operations
- canonical operation candidates
- donor aliases
- owners
- entry triggers
- state effects
- supporting ops
- deprecated ops

### 5.4 Journeys
- happy paths
- failure paths
- recovery paths
- support paths
- transitions across surfaces and operations

### 5.5 Screens / Units
- screens
- routes
- modals
- sheets
- sections
- internal units
- state-only units
- donor names
- canonical normalized names

### 5.6 Screen Behavior
- purpose
- primary CTA
- secondary actions
- entry / exit
- displayed blocks
- state anatomy
- validation behavior
- error behavior
- retry behavior
- offline behavior
- empty behavior

### 5.7 Binding / Runtime / Contract Pressure
- binding patterns
- client/controller/service/repository traces
- raw fetch traces
- contract pressure
- generated-layer assumptions
- runtime truth assumptions
- provider assumptions

### 5.8 Donor Defects
- duplication
- drift
- mixed ownership
- dead flows
- partial implementations
- anti-patterns

---

## 6) KDT Evidence Pack الإلزامي

لكل خدمة يجب أن ينتج داخل:

`kdt/volatile/registry/runs/{SESSION_ID}/services/<service-id>/`

الملفات التالية:

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

### KDT minimum schemas

#### DONOR_EXHAUSTIVE_CENSUS
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

#### ACTOR_CONTEXT_MASTER
- `actor_id`
- `actor_label`
- `canonical_surface`
- `context_role`
- `entitlements`
- `visibility_scope`
- `exclusions`
- `donor_trace`
- `decision_status`

#### MASTER_OPERATION_REGISTRY
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

#### MASTER_SCREEN_REGISTRY
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

#### DISPOSITION_MATRIX
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

## 7) docs/services Execution Operating Pack الإلزامي

أي خدمة يجب أن تحتوي داخل:

`docs/services/<service-id>/`

على البنية التالية:

```text
/docs/services/<service-id>/
  00_README.md
  01_SERVICE_EXECUTION_CHARTER.md
  02_IMPLEMENTATION_SCOPE.md
  03_REPO_TARGET_OWNERSHIP.md
  04_EXTRACTION_TO_IMPLEMENTATION_MAP.csv
  05_SERVICE_CANONICAL_MODEL.md
  06_SURFACE_CLASSIFICATION.md
  07_OPERATION_CATALOG.csv
  08_JOURNEY_CATALOG.csv
  09_SCREEN_REGISTRY.csv
  10_SCREEN_WAVES.md
  11_FIRST_SCREEN_RULE.md
  12_BUILD_SEQUENCE.md
  13_BUILD_QUEUE.csv
  14_UI_KIT_REQUIREMENTS.csv
  15_ROUTE_AND_NAV_TARGETS.csv
  16_COMPONENT_TARGETS.csv
  17_VIEWMODEL_AND_CLIENT_TARGETS.csv
  18_SERVICE_METHOD_TARGETS.csv
  19_CONTRACT_DELTAS.md
  20_BINDING_TARGETS.csv
  21_RUNTIME_TARGETS.csv
  22_STATE_AND_EDGE_CASE_MATRIX.csv
  23_ACCEPTANCE_GATES.md
  24_TEST_AND_PROOF_PLAN.md
  25_BLOCKERS_AND_DEFERRED.md
  26_HANDOFF_FROM_KDT.md
  /waves/
  /screens/
```

---

## 8) طبقات `docs/services/<service-id>`

## 8.1 Service Law Layer
تشمل:
- `00_README.md`
- `01_SERVICE_EXECUTION_CHARTER.md`
- `02_IMPLEMENTATION_SCOPE.md`
- `03_REPO_TARGET_OWNERSHIP.md`
- `05_SERVICE_CANONICAL_MODEL.md`
- `06_SURFACE_CLASSIFICATION.md`

الغرض:
- تثبيت هوية الخدمة
- الحدود
- non-goals
- ownership
- السطوح الداخلة والخارجة

## 8.2 Build Queue Layer
تشمل:
- `10_SCREEN_WAVES.md`
- `11_FIRST_SCREEN_RULE.md`
- `12_BUILD_SEQUENCE.md`
- `13_BUILD_QUEUE.csv`

الغرض:
- تحديد أول شاشة
- تحديد ترتيب الموجات
- تحديد ترتيب التنفيذ item-by-item

## 8.3 Screen Delivery Layer
تشمل:
- `09_SCREEN_REGISTRY.csv`
- `14_UI_KIT_REQUIREMENTS.csv`
- `15_ROUTE_AND_NAV_TARGETS.csv`
- `16_COMPONENT_TARGETS.csv`
- `22_STATE_AND_EDGE_CASE_MATRIX.csv`
- `/screens/`

الغرض:
- جعل كل شاشة قابلة للتنفيذ المستقل
- ربط الشاشة بملفاتها وحالاتها ومتطلباتها

## 8.4 Operation / Binding / Contract Layer
تشمل:
- `07_OPERATION_CATALOG.csv`
- `08_JOURNEY_CATALOG.csv`
- `17_VIEWMODEL_AND_CLIENT_TARGETS.csv`
- `18_SERVICE_METHOD_TARGETS.csv`
- `19_CONTRACT_DELTAS.md`
- `20_BINDING_TARGETS.csv`
- `21_RUNTIME_TARGETS.csv`

الغرض:
- ربط العمليات بالشاشات والرحلات
- تحديد targets الخلفية والـ client/viewmodel
- فتح contract/binding/runtime بشكل قانوني

## 8.5 Verification / Closure Layer
تشمل:
- `23_ACCEPTANCE_GATES.md`
- `24_TEST_AND_PROOF_PLAN.md`
- `25_BLOCKERS_AND_DEFERRED.md`
- `26_HANDOFF_FROM_KDT.md`

الغرض:
- إغلاق كل خطوة وكل موجة بشكل قانوني
- ربط pack التنفيذ بحزمة الأدلة في `kdt`

---

## 9) العقد الإلزامي لكل ملف شاشة

كل ملف داخل `/screens/` يجب أن يحتوي على:

1. `Screen Identity`
2. `Purpose`
3. `Actor`
4. `Surface`
5. `Canonical Route`
6. `Entry Points`
7. `Exit Points`
8. `Primary CTA`
9. `Secondary Actions`
10. `Required Data`
11. `Displayed Blocks`
12. `Section Order`
13. `Interaction Rules`
14. `Validation Rules`
15. `Empty / Error / Loading / Offline / Disabled States`
16. `Dependent Operations`
17. `Required UI-Kit Pieces`
18. `Local vs Shared Ownership`
19. `Files To Create / Files To Touch`
20. `Acceptance Gate`
21. `Deferred Items`
22. `Notes from donor extraction`

أي شاشة لا تحتوي هذه العقدة لا تعتبر قابلة للتنفيذ اليومي.

---

## 10) قاعدة أول شاشة

يجب أن يوجد ملف:

`11_FIRST_SCREEN_RULE.md`

ويجب أن يحدد:
- لماذا هذه الشاشة هي الأولى
- ما قيمة الكشف التي تقدمها للخدمة
- ما dependencies التي لا تحتاجها بعد
- ما الذي تفتحه بعدها
- ما الذي يجب أن يكون جاهزًا في `ui-kit` قبلها
- ما الذي تمنع فتحه مبكرًا

### معايير اختيار أول شاشة
يجب أن تكون:
- عالية القيمة الكشفية للخدمة
- منخفضة الاعتماد على runtime الكامل
- كاشفة لاحتياجات `ui-kit`
- فاتحة للشاشات التالية
- غير معتمدة على contract finalization المبكر

---

## 11) الموجات عقود تنفيذ وليست عناوين

كل خدمة يجب أن تُقسم إلى موجات حقيقية.
كل ملف داخل `/waves/` يجب أن يحتوي على:

1. `Wave Identity`
2. `Wave Goal`
3. `Why This Wave Exists`
4. `Included Screen Bundles`
5. `Included Operation Families`
6. `UI-Kit Prerequisites`
7. `Repo Code Touch Targets`
8. `Dependencies`
9. `Hard Stops`
10. `Acceptance Gate`
11. `What Opens Next Wave`
12. `What Remains Deferred`

### قاعدة التسمية الدنيا
- `W00_FOUNDATION`
- `W01_<FIRST_ACTIVE_BUNDLE>`
- `W02_<NEXT_BUNDLE>`
- ...
- `W08_BINDING_AND_CONTRACT` عند الحاجة
- `W09_RUNTIME_AND_PROOF` عند الحاجة

---

## 12) Build Queue إلزامي

يجب أن يوجد:

`13_BUILD_QUEUE.csv`

### الأعمدة الإلزامية
- `queue_order`
- `wave_id`
- `item_id`
- `item_type`
- `canonical_name`
- `surface`
- `owner_layer`
- `target_repo_path`
- `files_to_touch`
- `depends_on`
- `opens_next`
- `ui_kit_prereq`
- `contract_prereq`
- `binding_prereq`
- `runtime_prereq`
- `acceptance_gate`
- `status`
- `blocked_by`
- `notes`

هذا الملف هو queue التنفيذ الفعلي، وبدونه يبقى الدليل نصًا عامًا فقط.

---

## 13) الربط الصريح بمسارات الكود

لا يكفي القول إن الخدمات تذهب للخدمات، والشاشات للسطوح، والمشترك إلى `ui-kit`.

بل يجب أن يتحول ذلك إلى targets صريحة في:

- `03_REPO_TARGET_OWNERSHIP.md`
- `04_EXTRACTION_TO_IMPLEMENTATION_MAP.csv`
- `15_ROUTE_AND_NAV_TARGETS.csv`
- `16_COMPONENT_TARGETS.csv`
- `17_VIEWMODEL_AND_CLIENT_TARGETS.csv`
- `18_SERVICE_METHOD_TARGETS.csv`
- `20_BINDING_TARGETS.csv`

### الطبقات المستهدفة الإلزامية
كل item يجب أن يكون واضحًا هل يذهب إلى:
- `packages/ui-kit`
- `packages/surfaces`
- `services/<service-id>`
- `contracts/master`
- thin shells فقط داخل `apps/mobile/*` و`apps/web/*`

أي item بلا `target path` و`owner layer` يعتبر غير قابل للتنفيذ.

---

## 14) ui-kit prerequisites تُقفل قبل الشاشة

يجب أن يوجد:

`14_UI_KIT_REQUIREMENTS.csv`

### الأعمدة الإلزامية
- `screen_or_wave_id`
- `required_token_group`
- `required_layout_primitives`
- `required_cards`
- `required_inputs`
- `required_feedback_patterns`
- `required_navigation_patterns`
- `required_sheet_modal_patterns`
- `required_state_shells`
- `missing_now`
- `must_build_before_screen`
- `status`

لا يجوز البدء بالشاشة ثم العودة لمعالجة نقص `ui-kit`.  
بل يجب أن يُسجل النقص هنا كـ prerequisite رسمي.

---

## 15) فصل viewmodel / client / service method

يجب أن يوجد:

### `17_VIEWMODEL_AND_CLIENT_TARGETS.csv`
- `screen_id`
- `viewmodel_id`
- `hook_or_controller_name`
- `target_package_or_app`
- `api_client_needed`
- `read_models`
- `write_actions`
- `error_normalization_required`
- `status`

### `18_SERVICE_METHOD_TARGETS.csv`
- `operation_id`
- `service_method_name`
- `target_service_path`
- `input_shape`
- `output_shape`
- `policy_notes`
- `audit_trace_required`
- `idempotency_required`
- `runtime_truth_class`
- `status`

بدون هذا الفصل يبقى chain التنفيذ ناقصًا.

---

## 16) contract / binding / runtime تُفتح بوقت قانوني فقط

### `19_CONTRACT_DELTAS.md`
يحدد:
- ما delta المطلوب على العقود
- لماذا لا يُفتح الآن أو لماذا أصبح مسموحًا
- ما pressure evidence الذي فتحه

### `20_BINDING_TARGETS.csv`
يحدد:
- canonical chain لكل عملية
- raw bypasses الممنوعة
- chain verification rules

### `21_RUNTIME_TARGETS.csv`
يحدد:
- preview-only
- fixture-backed
- bind-ready
- runtime-ready
- proof-ready

### القاعدة الحاكمة
لا يجوز فتح `19–21` كطبقة تنفيذية كاملة إلا بعد:
- نضوج screen work المطلوب
- نضوج operation mapping
- وضوح الضغط العقدي

---

## 17) الحالات وحواف السلوك مركزية

يجب أن يوجد:

`22_STATE_AND_EDGE_CASE_MATRIX.csv`

### الأعمدة الإلزامية
- `screen_id`
- `loading_state`
- `empty_state`
- `filtered_empty_state`
- `disabled_state`
- `offline_state`
- `validation_error_state`
- `upstream_failure_state`
- `retry_state`
- `stale_state`
- `partial_state`
- `success_state`
- `notes`

هذا الملف هو المرجع المركزي لاكتمال screen state coverage.

---

## 18) gates ثلاثية الطبقات إلزامية

يجب أن يوجد:

`23_ACCEPTANCE_GATES.md`

ويحتوي على:

### Gate A — Document Readiness
يتحقق من:
- extraction mapped
- ownership fixed
- screen file complete
- dependencies known

### Gate B — Code Readiness
يتحقق من:
- ui-kit prerequisites done
- route target fixed
- file target fixed
- no unresolved blocker

### Gate C — Close Readiness
يتحقق من:
- state coverage complete
- review passed
- binding readiness recorded
- proof path known

لا يجوز الانتقال من item إلى item أو من wave إلى wave بدون gate result صريح.

---

## 19) test / proof plan داخل نفس المسار

يجب أن يوجد:

`24_TEST_AND_PROOF_PLAN.md`

ويغطي:
- visual proof
- interaction proof
- state proof
- routing proof
- binding proof
- runtime proof
- propagation proof عند الحاجة

---

## 20) handoff من `kdt` إلى `docs/services`

يجب أن يوجد:

`26_HANDOFF_FROM_KDT.md`

ويحتوي على:
- مسار KDT pack
- counts summary
- donor coverage summary
- unresolved contradictions
- approved build targets
- deferred items
- blockers inherited

`docs/services/<service-id>` لا يبدأ من الصفر الذهني، بل من handoff صريح.

---

## 21) خطوات الإعداد لأي خدمة

### STEP 1 — إنشاء مسار الخدمة
أنشئ:
- `kdt/.../services/<service-id>/`
- `docs/services/<service-id>/`

### STEP 2 — إغلاق extraction pack
ابنِ حزمة `kdt` الكاملة أولًا.

### STEP 3 — إنشاء execution operating pack
أنشئ كل ملفات `docs/services/<service-id>` الإلزامية.

### STEP 4 — قفل first screen + waves + build queue
لا يبدأ الكود قبل هذه الثلاثية.

### STEP 5 — قفل screen files + ui-kit prereqs + targets
لا تبدأ أي شاشة قبل ملفها وPrereqsها وTargetsها.

### STEP 6 — فتح code action عبر queue
كل item يمر عبر Gate A ثم B ثم C.

### STEP 7 — فتح contract/binding/runtime حين يسمح المسار
لا يُقفز إليها مبكرًا.

### STEP 8 — handoff / closure
كل موجة وكل خدمة تُغلق بدليل واضح.

---

## 22) ما الذي يُمنع صراحة

- Build Pack عام بلا `waves/`
- Build Pack عام بلا `screens/`
- عدم وجود `13_BUILD_QUEUE.csv`
- عدم وجود `11_FIRST_SCREEN_RULE.md`
- عدم وجود `14_UI_KIT_REQUIREMENTS.csv`
- عدم وجود targets صريحة لملفات الكود
- Screen file ناقص أو عام
- فتح contract/binding/runtime قبل نضوج الشاشات
- القفز بين العناصر خارج queue
- اعتبار preview دليل proof
- نقل donor code مباشرة قبل اكتمال KDT pack
- ترك item بلا `source_trace` أو بلا `disposition`

---

## 23) معيار الإغلاق النهائي

### KDT PASS
يتطلب:
- donor coverage proven
- extraction counts explicit
- trace coverage explicit
- actors/ops/journeys/screens covered
- blockers explicit
- evidence index present

### docs/services PASS
يتطلب:
- law files present
- waves present
- screen files present
- build queue present
- ui-kit requirements present
- route/component/viewmodel/service targets present
- binding/runtime targets present
- acceptance gates present
- test/proof plan present
- handoff from `kdt` present

### القرار النهائي
- `SERVICE_EXECUTION_PACK = PASS`
- أو `SERVICE_EXECUTION_PACK = FAIL`

---

## 24) القرار التنفيذي النهائي

لا يكفي أن نعرف ماذا كان موجودًا في donor.
ولا يكفي أن نكتب mapping عام للبناء في الريبو الجديد.

بل يجب أن تتحول أي خدمة إلى:

1. **حقيقة مستخرجة ومثبتة داخل `kdt`**
2. **Operating Pack تنفيذي كامل داخل `docs/services/<service-id>`**

بحيث تصبح الخدمة لاحقًا قابلة للتنفيذ اليومي الحقيقي من:

- أول donor trace
- إلى أول screen file
- إلى أول wave
- إلى build queue
- إلى code touch targets
- إلى contract/binding/runtime/proof
- إلى الإغلاق النهائي

دون الرجوع إلى donor كل مرة، ودون الاعتماد على شرح عام أو تفسير جديد.


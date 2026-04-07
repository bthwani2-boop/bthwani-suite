# BTHWANI GUIDE

## Zero-Base Platform Execution Operating System — Final Integrated Manual

### الدليل التنفيذي اليدوي السيادي النهائي لبناء المنصة من الصفر وتشغيلها وتجريبها حتى الإغلاق النهائي

---

# 1. CANONICAL STATUS

هذا الملف هو المرجع التنفيذي اليدوي النهائي المعتمد لبناء منصة `bthwani-suite` من الصفر بالكامل.

هذا الملف:
- donor-free
- migration-free
- manual-first
- execution-first
- evidence-bound
- phase-locked
- gate-driven
- closure-driven

هذا الملف ليس outline، وليس ملخصًا، وليس draft تعليميًا.
بل هو **Operating System** للتنفيذ.

إذا تعارض أي ملف آخر مع هذا الملف، فهذا الملف هو المرجع الأعلى.

---

# 2. ABSOLUTE QUALITY STANDARD

كل ما في هذا الدليل يجب أن يعمل تحت هذا المعيار:

- صفر أخطاء
- صفر تناقض
- صفر تكرار غير مبرر
- صفر فجوات صامتة
- صفر ضجيج
- صفر تشتت
- صفر تقدم وهمي
- صفر إغلاق وهمي
- صفر اعتماد على assumptions مخفية
- صفر انتقال مرحلة بلا gate
- صفر claim بلا evidence

أي عنصر غير مثبت أو غير مكتمل يصنف فقط:
- `BLOCKED`
- `GAP`
- `UNPROVEN`

ولا توجد لغة رخوة مثل:
- تقريبًا جاهز
- جيد بما يكفي
- شبه مغلق

---

# 3. THE NEW BUILD LAW

## 3.1 The Only Build Mode

الوضع المعتمد هو:

`ZERO_BASE_MANUAL_BUILD`

## 3.2 Meaning

- لا donor
- لا old/new linking
- لا extraction from old repo
- لا migration path
- لا reuse مفترض
- لا copy-as-is logic
- لا reference-to-old as execution input

## 3.3 What Is Allowed

- البناء من الصفر داخل `bthwani-suite`
- تأسيس architecture من الصفر
- تأسيس `ui-kit` من الصفر
- تأسيس contracts من الصفر
- تأسيس services من الصفر
- تأسيس screens and flows من الصفر
- تأسيس runtime local من الصفر
- إثبات التشغيل والتجريب من الصفر

---

# 4. FINAL PLATFORM TARGET

المنصة المستهدفة يجب أن تحتوي على:

## 4.1 Mobile Apps
- `apps/mobile/app-client`
- `apps/mobile/app-partner`
- `apps/mobile/app-captain`
- `apps/mobile/app-field`

## 4.2 Web Surfaces
- `apps/web/website`
- `apps/web/webapp`
- `apps/web/control-panel`

## 4.3 Shared Packages
- `packages/ui-kit`
- `packages/surfaces`
- `packages/api-types`
- `packages/api-clients`
- shared platform packages only if genuinely needed

## 4.4 Services Layer
- `services/<service-id>` بحسب حدود المنصة الفعلية

## 4.5 Contracts Layer
- `contracts/master`

## 4.6 Runtime Layer
- `runtime/local`

## 4.7 Governance + Evidence
- `docs/`
- `kdt/volatile/registry/runs/{SESSION_ID}/`

---

# 5. PLATFORM OWNERSHIP LAW

## 5.1 Apps
الـ apps shells only.
لا تملك business truth.

## 5.2 Services
الخدمات تملك service truth.

## 5.3 UI Kit
`packages/ui-kit` تملك:
- design tokens
- typography
- spacing
- colors
- primitives
- reusable states
- direction-aware primitives

ولا تملك service-specific business logic.

## 5.4 Surfaces
`packages/surfaces` تملك:
- screen implementation
- surface composition
- view state composition
- layout orchestration per surface

## 5.5 Contracts
`contracts/master` تملك canonical contract truth.

## 5.6 Runtime
`runtime/local` يملك execution truth المحلي.

## 5.7 Forbidden
ممنوع:
- business truth in app shell
- runtime behavior hidden in shared package بلا ملكية صحيحة
- service methods inside ui-kit
- app owning core contract truth
- multiple owners لنفس الحقيقة

---

# 6. REPO TARGET STRUCTURE

```text
bthwani-suite/
  apps/
    mobile/
      app-client/
      app-partner/
      app-captain/
      app-field/
    web/
      website/
      webapp/
      control-panel/
  services/
    <service-id>/
  packages/
    ui-kit/
    surfaces/
    api-types/
    api-clients/
  contracts/
    master/
  runtime/
    local/
  docs/
    00-foundation/
    01-architecture/
    02-ui-kit/
    03-domain/
    04-contracts/
    05-runtime/
    06-proof/
    surfaces/
    services/
    platform/
  governance/
  kdt/
    volatile/
      registry/
        runs/
```

---

# 7. EXECUTION META-RULES

## 7.1 No Phase Skipping
لا انتقال دون gate صريح.

## 7.2 No Screen Without Screen File
لا شاشة بلا ملف شاشة.

## 7.3 No Wave Without Wave File
لا موجة بلا ملف موجة.

## 7.4 No Queue-less Execution
لا تنفيذ خارج queue.

## 7.5 No UI Kit Inflation Before Need
`ui-kit` تبدأ مبكرًا، لكن لا تُنفخ نظريًا.

## 7.6 No API Before Screen Maturity
لا API تفصيلية قبل نضوج الشاشات والstates.

## 7.7 No Binding Before Matrix + Gap + Generate
لا binding قبل:
- screen/api matrix
- gap map
- contract update
- generate/verify

## 7.8 No Runtime Big-Bang
لا full runtime stack من البداية.

## 7.9 No Final Close Without Proof Ladder
لا final close بلا proof ladder مكتمل.

---

# 8. THE CENTRAL EXECUTION SPINE

هذا هو العمود الفقري الصحيح للدليل:

1. Zero-Base Reset
2. Repo Foundation
3. Master Foundation Minimal
4. UI Kit Foundation
5. Surface Skeletons
6. Screen Operating System
7. Screens / Flows
8. UI Kit Expansion from real screens
9. State Lock
10. Screen/API Matrix
11. Gap Map
12. Contract Update
13. Generate / Verify
14. Binding Lock
15. Runtime Truth Lock
16. Runtime Mode Policy
17. Production-like Verification
18. Evidence / Final Sign-off

هذا الترتيب ليس اقتراحًا؛ بل قانون تنفيذ.

---

# 9. REQUIRED DOCUMENT ROOTS

## 9.1 Foundation Docs
- `docs/00-foundation/`

## 9.2 Architecture Docs
- `docs/01-architecture/`

## 9.3 UI Kit Docs
- `docs/02-ui-kit/`

## 9.4 Domain Docs
- `docs/03-domain/`

## 9.5 Contract Docs
- `docs/04-contracts/`

## 9.6 Runtime Docs
- `docs/05-runtime/`

## 9.7 Proof Docs
- `docs/06-proof/`

## 9.8 Surface Packs
- `docs/surfaces/<surface-id>/`

## 9.9 Service Packs
- `docs/services/<service-id>/`

كل هذه الجذور جزء من التنفيذ، لا مجرد أرشيف.

---

# 10. PHASE MAP

- PHASE 00 — Zero-Base Reset
- PHASE 01 — Repo Foundation
- PHASE 02 — Master Foundation Minimal
- PHASE 03 — Architecture Lock
- PHASE 04 — UI Kit Foundation
- PHASE 05 — Shared Packages Foundation
- PHASE 06 — Domain Lock
- PHASE 07 — Contracts Foundation
- PHASE 08 — Runtime Model Foundation
- PHASE 09 — Surface Skeletons
- PHASE 10 — Screen Operating System
- PHASE 11 — Screen Design / Flow Build
- PHASE 12 — UI Kit Expansion From Real Screens
- PHASE 13 — State Lock
- PHASE 14 — Screen/API Matrix
- PHASE 15 — Gap Map
- PHASE 16 — Contract Update
- PHASE 17 — Generate / Verify
- PHASE 18 — Binding Lock
- PHASE 19 — Runtime Truth Lock
- PHASE 20 — Runtime Mode Policy
- PHASE 21 — Production-like Verification
- PHASE 22 — Evidence / Final Sign-off
- PHASE 23 — Surface-by-Surface Completion Lock
- PHASE 24 — Final Platform Close

---

# PHASE 00 — ZERO-BASE RESET

## Purpose
قفل القرار النهائي: البناء من الصفر فقط.

## Outputs
- `docs/00-foundation/00_ZERO_BASE_DECISION.md`
- `docs/00-foundation/01_PLATFORM_SURFACE_REGISTRY.md`
- `docs/00-foundation/02_BUILD_MODE_LAW.md`
- evidence under `kdt/.../phase-00/`

## Exact Manual Steps
1. اكتب قرارًا صريحًا بأن `bthwani-suite` هو خط البناء الرسمي.
2. ثبت الأسطح السبعة بالأسماء النهائية.
3. ثبت أن البناء donor-free.
4. ثبت أن execution يبدأ من foundation وليس من features.

## Hard Stops
- أي donor coupling
- أي ambiguity في surface set

## Acceptance Gate
- build mode explicit = yes
- surfaces explicit = yes
- donor reliance = no

## Handoff
إلى `PHASE 01`

---

# PHASE 01 — REPO FOUNDATION

## Purpose
إنشاء root نظيف وصغير وواضح قبل أي feature work.

## Outputs
- root workspace files
- root folder structure
- `docs/00-foundation/03_WORKSPACE_FOUNDATION.md`

## Exact Manual Steps
1. أنشئ root files فقط اللازمة.
2. أنشئ roots الأساسية:
   - apps
   - services
   - packages
   - contracts
   - docs
   - governance
   - kdt
3. لا تنشئ screens ولا services كاملة بعد.
4. لا تنشئ runtime stack بعد.
5. ثبت naming and path conventions.

## Hard Stops
- screens مبكرة
- services implementations مبكرة
- runtime env مبكر

## Acceptance Gate
- root coherent = yes
- no premature implementation = yes

---

# PHASE 02 — MASTER FOUNDATION MINIMAL

## Purpose
إغلاق الدستور الأدنى للريبو الجديد لمنع الفوضى.

## Outputs
- `governance/00_OWNERSHIP.md`
- `governance/01_SERVICE_CATALOG.md`
- `governance/02_SURFACE_CATALOG.md`
- `governance/03_OPENAPI_SOVEREIGNTY.md`
- `governance/04_DIRECTION_I18N_OWNERSHIP.md`
- `governance/05_REPO_BOUNDARY.md`
- `governance/06_PACKAGE_RESPONSIBILITIES.md`
- `governance/07_BUILD_ORDER.md`

## Exact Manual Steps
1. عرف ownership لكل layer.
2. عرف service catalog الأولي.
3. عرف surface catalog.
4. ثبت openapi sovereignty.
5. ثبت direction/i18n ownership.
6. ثبت repo boundary.
7. ثبت package responsibilities.
8. ثبت build order law.

## Hard Stops
- app owning truth
- package owning runtime behavior غلط
- undefined ownership

## Acceptance Gate
- governance minimal complete = yes
- ownership conflicts = 0

---

# PHASE 03 — ARCHITECTURE LOCK

## Purpose
تعريف معمارية المنصة بشكل لا لبس فيه.

## Outputs
- `docs/01-architecture/00_PLATFORM_ARCHITECTURE.md`
- `docs/01-architecture/01_LAYER_OWNERSHIP.md`
- `docs/01-architecture/02_APP_BOUNDARIES.md`
- `docs/01-architecture/03_PACKAGE_BOUNDARIES.md`
- `docs/01-architecture/04_SERVICE_BOUNDARIES.md`
- `docs/01-architecture/05_RUNTIME_BOUNDARIES.md`

## Exact Manual Steps
1. صمم layer map.
2. اربط كل layer بowner.
3. عرف code placement law.
4. عرف runtime boundaries.
5. عرف thin-shell law.

## Acceptance Gate
- architecture explicit = yes
- layer ambiguity = 0

---

# PHASE 04 — UI KIT FOUNDATION

## Purpose
تأسيس `packages/ui-kit` بشكل minimal but real.

## Outputs
- foundational tokens
- foundational primitives
- `docs/02-ui-kit/00_UI_KIT_CONSTITUTION.md`
- `docs/02-ui-kit/01_TOKEN_MODEL.md`
- `docs/02-ui-kit/02_COMPONENT_FAMILIES.md`
- `docs/02-ui-kit/03_DIRECTION_LANGUAGE_LAW.md`
- `docs/02-ui-kit/04_STATE_SHELLS.md`

## Exact Manual Steps
1. صمم token model.
2. صمم typography/spacing/colors/radius/shadows.
3. اقفل direction ownership.
4. ابنِ primitives الأساسية.
5. ابنِ state shells الأساسية.
6. امنع service widgets.

## Hard Stops
- speculative inflation
- duplicated local styling
- service-specific components داخل ui-kit

## Acceptance Gate
- ui-kit foundation usable = yes
- direction ownership centralized = yes

---

# PHASE 05 — SHARED PACKAGES FOUNDATION

## Purpose
تأسيس الحزم المشتركة غير التصميمية.

## Outputs
- `packages/surfaces` base
- `packages/api-types` base
- `packages/api-clients` base
- `docs/01-architecture/06_SHARED_PACKAGE_MODEL.md`

## Exact Manual Steps
1. جهز surface package skeleton.
2. جهز api packages skeleton.
3. ثبت import boundaries.
4. امنع hidden ownership.

## Acceptance Gate
- packages resolve = yes
- boundaries lawful = yes

---

# PHASE 06 — DOMAIN LOCK

## Purpose
قفل language/domain models.

## Outputs
- `docs/03-domain/00_DOMAIN_GLOSSARY.md`
- `docs/03-domain/01_ACTOR_MODEL.md`
- `docs/03-domain/02_ENTITY_MODEL.md`
- `docs/03-domain/03_RELATION_MODEL.md`
- `docs/03-domain/04_STATUS_MODEL.md`
- `docs/03-domain/05_ERROR_MODEL.md`

## Exact Manual Steps
1. عرف actors.
2. عرف entities.
3. عرف relations.
4. عرف status model.
5. عرف error model.

## Acceptance Gate
- vocabulary unified = yes
- status/error model coherent = yes

---

# PHASE 07 — CONTRACTS FOUNDATION

## Purpose
بناء contracts foundation بدون overdesign مبكر.

## Outputs
- `contracts/master/00_INTRO.md`
- `contracts/master/01_ENTITY_SCHEMAS.md`
- `contracts/master/02_OPERATION_FAMILIES.md`
- `contracts/master/03_ERROR_STATUS.md`
- `contracts/master/04_AUTH_CONTEXT.md`
- `contracts/master/05_RUNTIME_VARIABLES.md`

## Exact Manual Steps
1. ثبت entity schemas.
2. ثبت operation families.
3. ثبت error/status shapes.
4. ثبت auth/context shapes.
5. ثبت runtime variables placeholders.

## Acceptance Gate
- contracts foundation coherent = yes
- no rogue contract inflation = yes

---

# PHASE 08 — RUNTIME MODEL FOUNDATION

## Purpose
تحديد فلسفة runtime المحلي قبل assembly.

## Outputs
- `docs/05-runtime/00_RUNTIME_MODEL.md`
- `docs/05-runtime/01_ENV_MODEL.md`
- `docs/05-runtime/02_DATA_PLANE.md`
- `docs/05-runtime/03_MEDIA_STORAGE.md`
- `docs/05-runtime/04_HEALTH_MODEL.md`

## Exact Manual Steps
1. عرف truth model.
2. عرف env strategy.
3. عرف data/media/storage roles.
4. عرف health checks.

## Acceptance Gate
- runtime model explicit = yes

---

# PHASE 09 — SURFACE SKELETONS

## Purpose
بناء skeletons فعلية للأسطح السبعة.

## Outputs Per Surface
- shell
- root routes
- layout baseline
- loading shell
- error shell
- not-found shell where relevant
- route registry

## Exact Manual Steps
1. أنشئ shell لكل surface.
2. ثبت entry root.
3. ثبت layout family.
4. ثبت fallback pages baseline.
5. ثبت baseline navigation.

## Acceptance Gate
- all seven shells boot = yes
- route roots explicit = yes

---

# PHASE 10 — SCREEN OPERATING SYSTEM

## Purpose
بناء النظام التشغيلي للشاشات قبل تنفيذ الشاشات.

## Required Per Surface
- screen registry
- screen waves
- first screen rule
- build sequence
- build queue
- ui-kit requirements
- route/nav targets
- component targets
- state matrix
- acceptance gates
- `/screens/`
- `/waves/`

## Exact Manual Steps
1. احصر screen families.
2. حدد first screen.
3. حدد waves.
4. حدد queue.
5. حدد ui-kit prerequisites.
6. حدد route/component targets.
7. حدد state coverage matrix.
8. حدد gates.

## Acceptance Gate
- no screen without screen file = yes
- no wave without wave file = yes
- no queue ambiguity = yes

---

# PHASE 11 — SCREEN DESIGN / FLOW BUILD

## Purpose
بناء الشاشات والتدفقات الفعلية across surfaces.

## Core Screen Law
لكل شاشة يجب إغلاق:
- family
- purpose
- primary CTA
- secondary actions
- entry
- exit
- displayed blocks
- states
- dependent operations
- files to create / touch
- acceptance gate

## Flow Law
لا route clutter.
لا screen inflation.
يجب تطبيق:
- rationalization
- flow compression
- click-budget thinking

## Exact Manual Steps
1. ابدأ first screen only.
2. ابنِ screen file أولًا.
3. ابنِ screen implementation ثانيًا.
4. أغلق states.
5. أغلق transitions.
6. move next by queue only.

## Acceptance Gate
- screen purpose explicit = yes
- primary CTA explicit = yes
- full states explicit = yes

---

# PHASE 12 — UI KIT EXPANSION FROM REAL SCREENS

## Purpose
توسيع `ui-kit` فقط من الحاجة الحقيقية التي كشفتها الشاشات.

## Expansion Inputs
- active screens
- repeated patterns
- duplicated local components discovered during surface work

## Expansion Outputs
- card families
- list patterns
- filter/search patterns
- sheet/modal patterns
- review blocks
- CTA bars
- header patterns
- section shells
- task-first patterns

## Exact Manual Steps
1. استخرج الاحتياج من screens الحالية.
2. لا تضف شيئًا نظريًا.
3. ابنِ reusable patterns clean.
4. ارجع بالشاشات لاستهلاكها.

## Acceptance Gate
- ui-kit growth driven by real screens = yes
- speculative variants = 0

---

# PHASE 13 — STATE LOCK

## Purpose
قفل حالات الشاشات قبل API التفصيلية.

## Required States Per Screen
- loading
- empty
- filtered empty
- offline
- disabled
- unauthorized
- forbidden where relevant
- not found
- upstream error
- validation error
- success
- stale
- archived / closed where relevant

## Exact Manual Steps
1. اكتب state matrix.
2. اربط state behavior بكل شاشة.
3. اربط UI shells بالحالات.
4. لا تنتقل قبل state completeness.

## Acceptance Gate
- state coverage complete for active screens = yes

---

# PHASE 14 — SCREEN/API MATRIX

## Purpose
تحديد احتياج الـ API بناءً على screen maturity لا قبلها.

## Required Matrix Fields
- screen id
- required data
- required actions
- current request count
- overfetch risks
- need for summary endpoint
- need for action endpoint
- need for aggregation endpoint

## Exact Manual Steps
1. حدد data needs لكل شاشة.
2. حدد action needs.
3. اكتشف request inefficiency.
4. استخرج required API shapes.

## Acceptance Gate
- API demand driven by screens = yes
- overfetch awareness explicit = yes

---

# PHASE 15 — GAP MAP

## Purpose
كشف الفجوة بين UX demand وcontract foundation الحالية.

## Gap Types
- missing operation
- missing field
- wrong shape
- wrong aggregation
- overfetch
- rogue field
- status mismatch
- error mismatch

## Exact Manual Steps
1. قارن screen/api matrix مع العقود الحالية.
2. سجل gaps.
3. صنف severity.
4. حدد required deltas.

## Acceptance Gate
- gaps explicit = yes
- no hidden contract deficiency = yes

---

# PHASE 16 — CONTRACT UPDATE

## Purpose
تحديث canonical contracts لخدمة UX الصحيح.

## Outputs
- openapi changeset
- schema updates
- operation updates
- error/status unification

## Exact Manual Steps
1. حدث canonical operations.
2. حدث request/response shapes.
3. امنع rogue endpoints.
4. امنع raw-fetch-driven contract drift.

## Acceptance Gate
- contracts serve final UX intention = yes

---

# PHASE 17 — GENERATE / VERIFY

## Purpose
تحويل العقود إلى packages فعلية قابلة للاستهلاك.

## Outputs
- generated `api-types`
- generated `api-clients`
- verify report
- parity notes
- drift notes

## Exact Manual Steps
1. generate types.
2. generate clients.
3. verify parity.
4. verify drift absence.
5. verify implementation fit.

## Acceptance Gate
- generated layers reproducible = yes
- drift acceptable = 0 on claimed scope

---

# PHASE 18 — BINDING LOCK

## Purpose
ربط الشاشات بالـ clients والخدمات عبر chains صريحة.

## Binding Chain Law
`Screen -> ViewModel/Hook -> API Client -> Controller/Proxy -> Service -> Repository -> Runtime Truth -> Audit/Trace`

## Rule
عملية واحدة = chain واحدة.

## Outputs
- binding chain map
- active flow binding status
- raw fetch audit

## Exact Manual Steps
1. عرف chain لكل operation active.
2. اربط screen files بالchain.
3. أزل bypasses.
4. ثبت proof path.

## Acceptance Gate
- one chain per active operation = yes
- bypass ambiguity = 0

---

# PHASE 19 — RUNTIME TRUTH LOCK

## Purpose
إغلاق سؤال الحقيقة التشغيلية.

## Must Define
- real live truth source
- allowed seed/demo behavior
- forbidden mock/fixture truth
- fallback elimination
- UI behavior عند عدم توفر runtime
- provider/control-plane ownership where relevant

## Outputs
- truth source register
- fallback elimination report
- runtime truth notes

## Acceptance Gate
- single truth per active operation = yes
- silent fallback = 0

---

# PHASE 20 — RUNTIME MODE POLICY

## Purpose
تشغيل أقل stack ممكن بحسب المرحلة.

## Modes
- `R0` = surface only / design review
- `R1` = surface + limited API need
- `R2` = media/storage need added
- `R3` = post-binding expanded runtime
- `R4` = production-like proof only

## Rule
- no full stack from day one
- no production-like mode before final verification window

## Outputs
- runtime mode policy per phase
- runtime escalation rules

## Acceptance Gate
- mode discipline explicit = yes
- overscaled runtime use = 0 for claimed phase

---

# PHASE 21 — PRODUCTION-LIKE VERIFICATION

## Purpose
إثبات أن المنصة تعمل فعليًا end-to-end على scopeها المعلن.

## Verify
- happy path
- failure path
- recovery path
- staff path where relevant
- persistence
- local domains
- runtime health
- no stale compose
- no runtime fixtures

## Outputs
- prod-like proof
- runtime health report
- E2E notes
- persistence verification

## Acceptance Gate
- production-like proof explicit = yes
- no fake readiness = yes

---

# PHASE 22 — EVIDENCE / FINAL SIGN-OFF

## Purpose
تجميع الأدلة وإغلاق كل سطح وكل طبقة على claimed scope.

## Outputs
- final evidence index
- UI proof
- contract proof
- binding proof
- runtime proof
- guard report
- final sign-off package

## Acceptance Gate
- evidence complete = yes
- unresolved critical gap in claimed scope = 0

---

# PHASE 23 — SURFACE-BY-SURFACE COMPLETION LOCK

## Purpose
منع claim platform close إذا كان بعض الأسطح غير مغلقة فعليًا.

## Required Per Surface
- shell proof
- route proof
- state proof
- interaction proof
- binding status
- runtime status
- blocker status

## Outputs
- `docs/06-proof/07_SURFACE_COMPLETION_LOCK.csv`

## Acceptance Gate
- every claimed surface has explicit completion status = yes

---

# PHASE 24 — FINAL PLATFORM CLOSE

## Purpose
إغلاق المنصة كلها قانونيًا.

## Final Close Conditions
- all seven surfaces accounted for
- claimed scope complete
- shells boot
- core flows proven
- contract/binding/runtime/proof closed on claimed scope
- blockers classified
- final handoff explicit

## Outputs
- `docs/FINAL_PLATFORM_CLOSE.md`
- `docs/FINAL_SCOPE_COVERAGE.md`
- `docs/FINAL_BLOCKERS.md`
- `docs/FINAL_HANDOFF.md`

## Final Decision
- `PLATFORM_BUILD = PASS`
- أو `PLATFORM_BUILD = FAIL`

---

# 11. SURFACE EXECUTION CONTRACT

لكل surface من الأسطح السبعة يجب أن يوجد pack يحتوي على:

- `00_SURFACE_CHARTER.md`
- `01_SCREEN_REGISTRY.csv`
- `02_WAVES.md`
- `03_FIRST_SCREEN_RULE.md`
- `04_BUILD_SEQUENCE.md`
- `05_BUILD_QUEUE.csv`
- `06_UI_KIT_REQUIREMENTS.csv`
- `07_ROUTE_AND_NAV_TARGETS.csv`
- `08_COMPONENT_TARGETS.csv`
- `09_STATE_AND_EDGE_CASE_MATRIX.csv`
- `10_ACCEPTANCE_GATES.md`
- `/screens/`
- `/waves/`

بدون ذلك لا يعتبر السطح execution-ready.

---

# 12. SCREEN FILE CONTRACT

كل ملف شاشة يجب أن يحتوي على:

1. Screen Identity
2. Purpose
3. Actor
4. Surface
5. Canonical Route
6. Entry Points
7. Exit Points
8. Primary CTA
9. Secondary Actions
10. Required Data
11. Displayed Blocks
12. Section Order
13. Interaction Rules
14. Validation Rules
15. Empty / Error / Loading / Offline / Disabled States
16. Dependent Operations
17. Required UI-Kit Pieces
18. Local vs Shared Ownership
19. Files To Create / Files To Touch
20. Acceptance Gate
21. Deferred Items
22. Notes

---

# 13. WAVE FILE CONTRACT

كل موجة يجب أن تحتوي على:

1. Wave Identity
2. Wave Goal
3. Why This Wave Exists
4. Included Screen Bundles
5. Included Operation Families
6. UI-Kit Prerequisites
7. Repo Code Touch Targets
8. Dependencies
9. Hard Stops
10. Acceptance Gate
11. Opens Next
12. Deferred Items

---

# 14. BUILD QUEUE CONTRACT

كل queue row يجب أن يحتوي على:

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

ولا تنفيذ خارج queue.

---

# 15. GATE LAW

## Gate A — Document Readiness
- file exists
- purpose explicit
- targets explicit
- dependencies explicit

## Gate B — Code Readiness
- ui-kit prereqs done
- route target fixed
- file target fixed
- no unresolved blocker يمنع التنفيذ

## Gate C — Close Readiness
- states covered
- review passed
- next dependency opened lawfully
- proof path known

لا ينتقل أي item أو أي موجة بدون gate result.

---

# 16. HARD STOPS ACROSS THE WHOLE MANUAL

- donor logic
- screen without screen file
- wave without wave file
- queue row ناقص
- ui-kit gap غير مسجل
- route clutter غير معالج
- API قبل screen maturity
- binding قبل generate/verify
- runtime proof قبل binding lock
- fake close
- preview treated as proof

---

# 17. PROOF LADDER

## L1 — Boot Proof
كل surface يفتح.

## L2 — Route Proof
المسارات الأساسية قابلة للوصول.

## L3 — State Proof
loading / empty / error / disabled / offline / success.

## L4 — Interaction Proof
primary CTA + required secondary actions.

## L5 — Flow Proof
happy / failure / recovery.

## L6 — Binding Proof
screen to service chain works.

## L7 — Runtime Proof
truth source / persistence / retrieval تعمل بحسب scope.

## L8 — Cross-Surface Proof
التناسق across relevant surfaces.

لا final close بدون ladder واضح.

---

# 18. WHAT THIS MANUAL IS MEANT TO GUARANTEE

إذا طُبق هذا الدليل كما هو، فيجب أن يضمن:

- بناء المنصة من الصفر بالكامل
- معمارية نظيفة
- ownership واضح
- `ui-kit` موحدة وقوية
- surfaces execution-ready
- screens operationally defined
- contracts driven by UX need
- binding disciplined
- runtime truth disciplined
- production-like verification possible
- final closure auditable

---

# 19. FINAL EXECUTIVE STATEMENT

هذا الملف ليس مجرد guide.
هذا ليس مجرد plan.
هذا ليس مجرد framework.

هذا هو:

**Zero-Base Platform Execution Operating System**

لبناء `bthwani-suite` من الصفر بالكامل، من أول قرار، إلى آخر shell، إلى آخر screen، إلى آخر contract، إلى آخر binding، إلى آخر runtime proof، إلى final close.


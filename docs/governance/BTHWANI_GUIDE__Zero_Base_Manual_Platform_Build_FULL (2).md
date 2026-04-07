# BTHWANI GUIDE

## Zero-Base Manual Platform Build — Full Sovereign Execution Manual

### الدليل التنفيذي اليدوي السيادي الكامل لبناء المنصة من الصفر — من الألف إلى الياء حتى التشغيل والتجريب والإغلاق

---

# 0. CANONICAL STATUS

هذا الملف هو الدليل التنفيذي اليدوي المعتمد لبناء منصة `bthwani-suite` من الصفر بالكامل، بدون donor، وبدون migration، وبدون ربط مع أي مستودع قديم.

هذا الملف:
- عملي
- تنفيذي
- يدوي
- طويل ومقصود أن يكون طويلًا
- تفصيلي
- قابل للتطبيق
- قابل للتحقق
- مبني على إغلاق الفجوات لا على اختصارها

هذا الملف لا يهدف إلى الشرح المختصر، بل إلى ضبط التنفيذ من البداية إلى النهاية.

---

# 1. ABSOLUTE QUALITY STANDARD

كل ما في هذا الدليل يجب أن يُنفذ تحت هذا المعيار:

- صفر أخطاء
- صفر تناقض
- صفر تكرار غير مبرر
- صفر فجوات صامتة
- صفر ضجيج
- صفر تشتت
- صفر فشل ادعائي
- صفر placeholder completion
- صفر انتقال غير قانوني بين المراحل
- صفر claim بلا evidence

أي شيء غير مثبت أو غير مكتمل لا يوصف بأنه “جيد” أو “شبه جاهز”، بل يصنف فقط:

- `BLOCKED`
- `GAP`
- `UNPROVEN`

---

# 2. THE NEW BUILD LAW

## 2.1 Build Mode

الوضع المعتمد الآن هو:

`ZERO_BASE_MANUAL_BUILD`

## 2.2 What This Means

- لا donor recovery
- لا old-to-new linking
- لا selective salvage من مستودع قديم
- لا extraction track
- لا migration assumptions
- لا historical coupling

## 2.3 What Is Allowed

- البناء داخل `bthwani-suite` فقط
- تعريف architecture من الصفر
- بناء كل layer بملكية واضحة
- تأسيس `ui-kit` من الصفر
- تأسيس الشاشات من الصفر
- تأسيس العقود من الصفر
- تأسيس الربط من الصفر
- تأسيس runtime local من الصفر
- التحقق والتجريب من الصفر

---

# 3. FINAL PLATFORM TARGET

المنصة المستهدفة يجب أن تحتوي على:

## 3.1 Mobile Apps
- `apps/mobile/app-client`
- `apps/mobile/app-partner`
- `apps/mobile/app-captain`
- `apps/mobile/app-field`

## 3.2 Web Surfaces
- `apps/web/website`
- `apps/web/webapp`
- `apps/web/control-panel`

## 3.3 Shared Packages
- `packages/ui-kit`
- `packages/surfaces`
- `packages/api-types`
- `packages/api-clients`
- shared platform packages only if proven necessary

## 3.4 Services Layer
- `services/<service-id>` بحسب التقسيم الحقيقي للمنصة

## 3.5 Contracts Layer
- `contracts/master`

## 3.6 Runtime Layer
- `runtime/local`

## 3.7 Governance + Evidence
- `docs/`
- `kdt/volatile/registry/runs/{SESSION_ID}/`

---

# 4. PLATFORM OWNERSHIP LAW

## 4.1 Apps
التطبيقات والويب shells فقط.
لا تملك service truth.

## 4.2 Services
الخدمات تملك service truth.

## 4.3 UI Kit
`packages/ui-kit` يملك reusable primitives فقط.

## 4.4 Surfaces Package
`packages/surfaces` يملك screen implementations والsurface composition.

## 4.5 Contracts
`contracts/master` يملك canonical API law.

## 4.6 Runtime
`runtime/local` يملك local truth execution path.

## 4.7 Forbidden
ممنوع:
- business truth داخل shell app
- service logic داخل `ui-kit`
- hidden cross-layer ownership
- ضخ features مباشرة داخل apps دون ownership map

---

# 5. EXECUTION META-RULES

## 5.1 No Blind Parallelism
لا deep parallelism عشوائي.
لكن يسمح بالتوازي المنضبط إذا كانت dependencies مغلقة صراحة.

## 5.2 No Phase Skipping
لا انتقال إلى مرحلة لاحقة دون gate صريح.

## 5.3 No Screen Without Screen File
لا تُبنى شاشة بدون ملف شاشة مستقل.

## 5.4 No Wave Without Wave File
لا تُبنى موجة بدون ملف موجة مستقل.

## 5.5 No Queue-less Execution
لا تنفيذ فعلي خارج build queue.

## 5.6 No Binding Before Flow Maturity
لا binding قبل نضوج الشاشات والflows.

## 5.7 No Runtime Proof Before Binding Lock
لا proof runtime قبل قفل binding paths.

---

# 6. REQUIRED DOC ROOTS

يجب أن يُبنى مع الدليل النظام الوثائقي التالي:

```text
/docs/
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
/kdt/volatile/registry/runs/{SESSION_ID}/
```

ويجب أن يُنظر إلى `docs/` كجزء من التنفيذ، وليس تعليقًا خارجيًا عليه.

---

# 7. PHASE MAP

هذا الدليل يعتمد المراحل التالية:

- PHASE 00 — Zero-Base Reset Law
- PHASE 01 — Platform Scope Lock
- PHASE 02 — Repo & Workspace Foundation
- PHASE 03 — Governance, Paths, and Evidence Law
- PHASE 04 — Architecture Lock
- PHASE 05 — UI Kit Constitution and Foundation
- PHASE 06 — Shared Platform Packages Foundation
- PHASE 07 — Domain Model Lock
- PHASE 08 — Contracts Foundation
- PHASE 09 — Runtime Model Foundation
- PHASE 10 — Surface Skeletons
- PHASE 11 — Screen Operating System
- PHASE 12 — app-client Build
- PHASE 13 — app-partner Build
- PHASE 14 — app-captain Build
- PHASE 15 — app-field Build
- PHASE 16 — website Build
- PHASE 17 — webapp Build
- PHASE 18 — control-panel Build
- PHASE 19 — Service Implementation Layer
- PHASE 20 — Contract Finalization + Generate/Verify
- PHASE 21 — Binding Lock
- PHASE 22 — Local Runtime Assembly
- PHASE 23 — Test / Try / Proof Ladder
- PHASE 24 — Hardening, Stabilization, and Final Close

---

# PHASE 00 — ZERO-BASE RESET LAW

## Purpose
تثبيت أن البناء من الصفر فقط.

## Why This Phase Exists
لمنع أي donor leakage أو عودة إلى التفكير بالربط.

## Inputs
- repo root
- platform naming

## Outputs
- `docs/00-foundation/00_ZERO_BASE_DECISION.md`
- `docs/00-foundation/01_SURFACE_REGISTRY.md`
- `docs/00-foundation/02_BUILD_MODE_LAW.md`
- evidence under `kdt/.../phase-00/`

## Manual Procedure
1. ثبت القرار: zero-base only.
2. ثبت أسماء الأسطح السبعة.
3. ثبت أن work line = `bthwani-suite` فقط.
4. ثبت منع donor-based planning.

## Hard Stops
- أي إشارة إلى old/new link
- أي غموض في surface naming

## Acceptance Gate
- build mode explicit = yes
- surface registry explicit = yes
- donor reliance = no

## Handoff
إلى `PHASE 01`

---

# PHASE 01 — PLATFORM SCOPE LOCK

## Purpose
تعريف ما الذي يشمله البناء وما الذي لا يشمله.

## Outputs
- `docs/platform/00_PLATFORM_SCOPE.md`
- `docs/platform/01_INCLUDED_SURFACES.md`
- `docs/platform/02_EXCLUDED_SCOPE.md`
- `docs/platform/03_SUCCESS_CRITERIA.md`

## Manual Procedure
1. حدد الأسطح السبعة رسميًا.
2. حدد shared packages.
3. حدد أن النطاق يشمل التشغيل والتجريب، لا build-only.
4. حدد non-goals الأولية.

## Acceptance Gate
- included scope explicit
- excluded scope explicit
- success criteria explicit

---

# PHASE 02 — REPO & WORKSPACE FOUNDATION

## Purpose
تجهيز monorepo clean قابل للتشغيل والبناء.

## Outputs
- root `package.json`
- `pnpm-workspace.yaml`
- `nx.json`
- `tsconfig.base.json`
- lint / format / test configs
- path alias policy
- package naming law
- `docs/00-foundation/03_WORKSPACE_FOUNDATION.md`

## Manual Procedure
1. ثبت package manager.
2. ثبت workspace structure.
3. ثبت path aliasing.
4. ثبت minimal scripts law.
5. تأكد أن repo can install/resolve/compile baseline.

## Hard Stops
- unresolved workspace boundaries
- broken root scripts
- ambiguous package ownership

## Acceptance Gate
- workspace installable
- workspace compilable baseline
- root config coherent

---

# PHASE 03 — GOVERNANCE, PATHS, AND EVIDENCE LAW

## Purpose
إغلاق قوانين المسارات، الحوكمة، والأدلة.

## Outputs
- `docs/00-foundation/04_PATH_LAW.md`
- `docs/00-foundation/05_EVIDENCE_LAW.md`
- `docs/00-foundation/06_STATUS_VOCABULARY.md`
- `docs/00-foundation/07_GATE_LAW.md`
- `docs/00-foundation/08_CLOSURE_LAW.md`

## Manual Procedure
1. ثبت أن كل claim يحتاج evidence.
2. ثبت vocabulary: PASS / FAIL / BLOCKED / GAP / UNPROVEN.
3. ثبت gate/result law.
4. ثبت evidence root policy.

## Acceptance Gate
- no ambiguous status vocabulary
- evidence law explicit
- closure law explicit

---

# PHASE 04 — ARCHITECTURE LOCK

## Purpose
تعريف architecture النهائي للمنصة من حيث layers وownership.

## Outputs
- `docs/01-architecture/00_PLATFORM_ARCHITECTURE.md`
- `docs/01-architecture/01_LAYER_OWNERSHIP.md`
- `docs/01-architecture/02_APP_BOUNDARIES.md`
- `docs/01-architecture/03_SERVICE_BOUNDARIES.md`
- `docs/01-architecture/04_PACKAGE_BOUNDARIES.md`
- `docs/01-architecture/05_RUNTIME_BOUNDARIES.md`

## Manual Procedure
1. اقفل layer ownership.
2. عرف boundaries.
3. امنع mixed ownership.
4. عرف legal code placement.

## Acceptance Gate
- every layer owned
- every layer bounded
- no catch-all ownership

---

# PHASE 05 — UI KIT CONSTITUTION AND FOUNDATION

## Purpose
بناء `packages/ui-kit` كأساس موحّد للمنصة قبل الشاشات الثقيلة.

## Outputs
- `packages/ui-kit` foundation
- `docs/02-ui-kit/00_UI_KIT_CONSTITUTION.md`
- `docs/02-ui-kit/01_TOKEN_MODEL.md`
- `docs/02-ui-kit/02_COMPONENT_FAMILIES.md`
- `docs/02-ui-kit/03_DIRECTION_AND_LANGUAGE_LAW.md`
- `docs/02-ui-kit/04_STATE_SHELLS.md`

## Mandatory Foundation Elements
- color tokens
- typography
- spacing scale
- radius/shadows
- motion baseline
- icons law
- rtl/ltr ownership
- layout primitives
- card families
- button families
- input families
- feedback patterns
- sheet/modal patterns
- loading/empty/error shells

## Manual Procedure
1. عرف design constitution.
2. ابنِ tokens.
3. ابنِ primitives.
4. ابنِ baseline components.
5. اقفل direction/language ownership.
6. امنع service-specific business components.

## Hard Stops
- local styling drift before foundation closes
- neutral direction ownership

## Acceptance Gate
- reusable ui-kit usable by all surfaces
- direction ownership centralized
- state shells present

---

# PHASE 06 — SHARED PLATFORM PACKAGES FOUNDATION

## Purpose
بناء الحزم المشتركة اللازمة لكل الأسطح.

## Outputs
- `packages/surfaces` skeleton
- `packages/api-types` skeleton
- `packages/api-clients` skeleton
- optional platform packages only if justified
- `docs/01-architecture/06_SHARED_PACKAGE_MODEL.md`

## Manual Procedure
1. ثبت `packages/surfaces` كأساس شاشات.
2. ثبت `api-types` و`api-clients`.
3. امنع تضخم الحزم.
4. ثبت import law.

## Acceptance Gate
- packages resolve
- boundaries lawful
- no business truth inside wrong package

---

# PHASE 07 — DOMAIN MODEL LOCK

## Purpose
بناء language/domain model موحد للمنصة قبل التفاصيل التنفيذية اللاحقة.

## Outputs
- `docs/03-domain/00_DOMAIN_GLOSSARY.md`
- `docs/03-domain/01_ACTOR_MODEL.md`
- `docs/03-domain/02_ENTITY_MODEL.md`
- `docs/03-domain/03_RELATION_MODEL.md`
- `docs/03-domain/04_STATUS_MODEL.md`
- `docs/03-domain/05_ERROR_MODEL.md`

## Manual Procedure
1. عرف actors.
2. عرف entities.
3. عرف statuses.
4. عرف errors.
5. عرف العلاقات الأساسية.

## Acceptance Gate
- vocabulary unified
- entity model coherent
- status/error semantics reusable

---

# PHASE 08 — CONTRACTS FOUNDATION

## Purpose
بناء contracts foundation من الصفر بدون API overreach مبكر.

## Outputs
- `contracts/master/00_INTRO.md`
- `contracts/master/01_ACTOR_CONTEXT.md`
- `contracts/master/02_ENTITY_SCHEMAS.md`
- `contracts/master/03_OPERATION_FAMILIES.md`
- `contracts/master/04_ERROR_STATUS.md`
- `contracts/master/05_RUNTIME_VARIABLES.md`

## Manual Procedure
1. عرف canonical entities.
2. عرف request/response philosophy.
3. عرف error/status shapes.
4. ثبت runtime variables placeholders lawfully.

## Hard Stops
- API-first overdesign
- screen-disconnected contract sprawl

## Acceptance Gate
- contracts foundation coherent
- no over-commitment before flows mature

---

# PHASE 09 — RUNTIME MODEL FOUNDATION

## Purpose
تعريف local runtime philosophy مبكرًا قبل assembly النهائي.

## Outputs
- `docs/05-runtime/00_RUNTIME_MODEL.md`
- `docs/05-runtime/01_ENV_MODEL.md`
- `docs/05-runtime/02_LOCAL_DATA_PLANE.md`
- `docs/05-runtime/03_MEDIA_AND_STORAGE.md`
- `docs/05-runtime/04_HEALTH_MODEL.md`

## Manual Procedure
1. عرف local truth model.
2. عرف env model.
3. عرف data/media/storage expectations.
4. عرف health checks.

## Acceptance Gate
- runtime model explicit
- env model explicit
- health model explicit

---

# PHASE 10 — SURFACE SKELETONS

## Purpose
بناء shells للأسطح السبعة مع routing baseline.

## Outputs
- root shell per surface
- global layout per surface
- loading shell
- error shell
- not-found shell where relevant
- route root registry per surface
- navigation baseline

## Files To Produce
- `docs/surfaces/app-client/00_SHELL.md`
- `docs/surfaces/app-partner/00_SHELL.md`
- `docs/surfaces/app-captain/00_SHELL.md`
- `docs/surfaces/app-field/00_SHELL.md`
- `docs/surfaces/website/00_SHELL.md`
- `docs/surfaces/webapp/00_SHELL.md`
- `docs/surfaces/control-panel/00_SHELL.md`

## Acceptance Gate
- all seven surfaces boot
- shell route roots explicit
- baseline navigation stable

---

# PHASE 11 — SCREEN OPERATING SYSTEM

## Purpose
إنشاء النظام التشغيلي للشاشات قبل بناء الشاشات نفسها.

## Required Structure Per Surface
لكل سطح يجب إنشاء:

- `01_SCREEN_REGISTRY.csv`
- `02_SCREEN_WAVES.md`
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

## Screen File Contract
كل screen file يجب أن يحتوي على:
- Screen Identity
- Purpose
- Actor
- Surface
- Route
- Entry / Exit
- Primary CTA
- Secondary Actions
- Required Data
- Displayed Blocks
- Interaction Rules
- Validation Rules
- Full States
- Dependent Operations
- Required UI-Kit Pieces
- Files To Create / Files To Touch
- Acceptance Gate
- Deferred Items

## Acceptance Gate
- no screen without file
- no wave without file
- no queue ambiguity

---

# PHASE 12 — APP-CLIENT BUILD

## Purpose
بناء تطبيق العميل من الصفر حتى flow أساسي قابل للتشغيل والتجريب.

## Required Waves
- W00 foundation
- W01 entry/discovery
- W02 listing/detail
- W03 cart/review
- W04 checkout/submission
- W05 tracking/history
- W06 profile/support basics

## Mandatory Screen Families
- home / entry
- discovery/listing
- entity detail
- cart
- checkout
- order tracking
- history / status views
- profile / settings / support where in scope

## Manual Procedure
1. اقفل first screen.
2. ابنِ screens wave-by-wave.
3. أغلق states قبل next wave.
4. حدّد targets لكل screen.
5. امنع binding المبكر.

## Acceptance Gate
- core user loop reachable
- state coverage complete for active screens
- queue rows closed for claimed scope

---

# PHASE 13 — APP-PARTNER BUILD

## Purpose
بناء تطبيق الشريك من entry إلى operational workspace.

## Required Waves
- W00 foundation
- W01 entry/workspace
- W02 inbox/listing
- W03 detail/actions
- W04 status/availability
- W05 catalog/product management if in scope
- W06 reports/basic analytics if in scope

## Acceptance Gate
- partner primary workspace reachable
- primary actions workable
- edge states covered

---

# PHASE 14 — APP-CAPTAIN BUILD

## Purpose
بناء تطبيق الكابتن من queue إلى execution.

## Required Waves
- W00 foundation
- W01 queue
- W02 task detail
- W03 transition/status actions
- W04 execution/navigation
- W05 confirmation/proof/close if in scope

## Acceptance Gate
- task loop complete
- execution flow coherent
- transition states explicit

---

# PHASE 15 — APP-FIELD BUILD

## Purpose
بناء تطبيق field حسب operational jobs scope.

## Required Waves
- W00 foundation
- W01 entry/job list
- W02 job detail
- W03 action forms
- W04 capture/reporting
- W05 submit/close

## Acceptance Gate
- field primary job loop complete
- capture/submit paths proven for claimed scope

---

# PHASE 16 — WEBSITE BUILD

## Purpose
بناء الموقع التسويقي العام.

## Required Waves
- W00 foundation
- W01 landing
- W02 service/value sections
- W03 trust/social proof
- W04 app links/download
- W05 faq/contact/legal

## Acceptance Gate
- website coherent
- responsive baseline okay
- public information flow complete

---

# PHASE 17 — WEBAPP BUILD

## Purpose
بناء webapp كنسخة ويب تشغيلية حسب نطاقها الحقيقي.

## Required Waves
- W00 foundation
- W01 entry/auth shell
- W02 discovery/listing
- W03 detail/request flow
- W04 tracking/history/profile

## Acceptance Gate
- webapp primary loop reachable
- route/state behavior coherent

---

# PHASE 18 — CONTROL-PANEL BUILD

## Purpose
بناء `control-panel` كـ single web control plane.

## Required IA Domains
- Dashboard
- Operations
- Finance
- Catalogs
- Support
- Partners
- Marketing
- Control

## Required Waves
- W00 IA + foundation
- W01 dashboard shell
- W02 operations workspace
- W03 finance workspace
- W04 catalogs workspace
- W05 support workspace
- W06 partners workspace
- W07 marketing workspace
- W08 control/admin workspace

## Manual Procedure
1. ابنِ IA أولًا.
2. ابنِ sections كworkspaces، لا noise dashboards.
3. اجعل كل section task-first.
4. امنع app-cluster thinking؛ هو web app واحد.

## Acceptance Gate
- IA domains clear
- routes work
- workspaces الأساسية قابلة للتصفح والتجريب

---

# PHASE 19 — SERVICE IMPLEMENTATION LAYER

## Purpose
بناء backend/service methods فقط بعد أن تفتحها flows والشاشات فعليًا.

## Outputs
- service roots
- methods/handlers/repos/policies
- service docs per domain
- evidence notes

## Mandatory Service Files
لكل service root:
- `00_SERVICE_CHARTER.md`
- `01_OPERATION_CATALOG.csv`
- `02_METHOD_TARGETS.csv`
- `03_POLICY_REQUIREMENTS.md`
- `04_RUNTIME_NOTES.md`

## Acceptance Gate
- methods demanded by real flows
- policies explicit
- ownership clean

---

# PHASE 20 — CONTRACT FINALIZATION + GENERATE/VERIFY

## Purpose
تحويل flow pressure إلى canonical contracts ثم generated layers.

## Outputs
- final contract deltas
- generated types
- generated clients
- verification report

## Manual Procedure
1. اجمع screen/api pressure.
2. عدّل canonical contracts.
3. regen types/clients.
4. verify reproducibility.
5. close drift.

## Acceptance Gate
- contracts match actual flow demand
- generated layers reproducible
- no manual drift in generated outputs

---

# PHASE 21 — BINDING LOCK

## Purpose
ربط الشاشات بالخدمات عبر chains قانونية وواضحة.

## Required Per Active Flow
- screen target
- route target
- viewmodel/hook
- api client
- service method
- runtime target class
- proof expectations

## Mandatory Outputs
- `docs/06-proof/00_BINDING_CHAIN_MAP.csv`
- `docs/06-proof/01_RAW_FETCH_AUDIT.md`
- `docs/06-proof/02_ACTIVE_FLOW_BINDING_STATUS.csv`

## Acceptance Gate
- one lawful primary chain per active operation
- bypasses classified/eliminated on active scope

---

# PHASE 22 — LOCAL RUNTIME ASSEMBLY

## Purpose
تشغيل local platform حقيقةً وربط الأسطح بها.

## Outputs
- local infra config
- env files
- seeds
- runtime runbook
- health report

## Manual Procedure
1. assemble local data plane.
2. assemble API host.
3. assemble media/storage.
4. wire env vars.
5. boot services.
6. connect surfaces.
7. capture health evidence.

## Acceptance Gate
- local stack boots
- required services reachable
- surfaces connect to lawful runtime

---

# PHASE 23 — TEST / TRY / PROOF LADDER

## Purpose
إثبات التشغيل والتجريب الحقيقي end-to-end للمنصة.

## Proof Ladder

### L1 — Boot Proof
كل surface يفتح بدون crash.

### L2 — Route Proof
المسارات الأساسية قابلة للوصول.

### L3 — State Proof
loading / empty / error / disabled / offline / success.

### L4 — Interaction Proof
primary CTA + required secondary actions.

### L5 — Flow Proof
happy / failure / recovery loops.

### L6 — Binding Proof
screen → client → service works.

### L7 — Runtime Proof
data truth / persistence / retrieval تعمل بحسب scope.

### L8 — Cross-Surface Proof
التناسق عبر الأسطح الفعالة.

## Outputs
- `docs/06-proof/03_SURFACE_TEST_MATRIX.csv`
- `docs/06-proof/04_FLOW_TEST_MATRIX.csv`
- `docs/06-proof/05_RUNTIME_HEALTH.md`
- `docs/06-proof/06_CROSS_SURFACE_PROOF.md`

## Acceptance Gate
- all claimed surfaces tested
- all claimed flows tested
- blockers explicit

---

# PHASE 24 — HARDENING, STABILIZATION, AND FINAL CLOSE

## Purpose
إغلاق المنصة قانونيًا بعد ثبوت البناء والتشغيل والتجريب.

## Required Final Conditions
- seven surfaces present
- shells boot
- primary flows proven
- binding proven on active flows
- runtime local proven
- blockers classified
- claimed scope complete
- no critical unresolved contradiction in claimed close

## Final Outputs
- `docs/FINAL_PLATFORM_CLOSE.md`
- `docs/FINAL_SCOPE_COVERAGE.md`
- `docs/FINAL_BLOCKERS.md`
- `docs/FINAL_HANDOFF.md`
- final evidence index under `kdt/.../phase-24/`

## Final Decision
- `PLATFORM_BUILD = PASS`
- أو `PLATFORM_BUILD = FAIL`

---

# 8. SURFACE EXECUTION RULES

لكل سطح من الأسطح السبعة يجب أن يوجد على الأقل:

- shell file
- wave files
- screen files
- build queue
- ui-kit requirements
- route targets
- component targets
- state matrix
- acceptance gates
- proof matrix

ولا يجوز claim أن surface “تم بناؤه” إذا كان shell موجودًا فقط.

---

# 9. SCREEN EXECUTION RULES

لكل شاشة:

- لا code touch بدون screen file
- لا close بدون state coverage
- لا binding بدون defined chain
- لا acceptance بدون gate result

### Minimum Files To Touch Record
يجب أن يحتوي كل screen file على:
- target files to create
- target files to update
- shared package dependencies
- route target
- ownership target

---

# 10. BUILD QUEUE LAW

لكل سطح ولكل subsystem يجب أن يوجد queue واضح.

### Minimum Queue Columns
- queue order
- wave id
- item id
- item type
- canonical name
- owner layer
- target path
- files to touch
- depends on
- opens next
- blocked by
- acceptance gate
- current status

لا تنفيذ خارج queue.

---

# 11. GATE LAW

كل item يمر على الأقل بـ:

## Gate A — Document Readiness
- file exists
- purpose explicit
- targets explicit
- dependencies explicit

## Gate B — Code Readiness
- ui-kit prereqs closed
- route target fixed
- file target fixed
- no unresolved blocker يمنع التنفيذ

## Gate C — Close Readiness
- states covered
- review passed
- next dependency opened lawfully
- proof path known

---

# 12. HARD STOPS ACROSS THE WHOLE MANUAL

- العودة لأي donor logic
- بناء شاشة بلا ملف شاشة
- بناء موجة بلا ملف موجة
- queue row ناقص
- ui-kit gap غير مسجل
- فتح binding مبكرًا
- فتح runtime proof مبكرًا
- claim close بلا evidence
- claim success لأن preview اشتغل فقط

---

# 13. WHAT THIS MANUAL IS DESIGNED TO GUARANTEE

إذا طُبق هذا الدليل كما هو، فيجب أن يضمن:

- منصة كاملة من الصفر
- معمارية واضحة
- ملكية واضحة
- حزمة UI مركزية قوية
- أسطح سبعة سليمة
- شاشات قابلة للتنفيذ اليومي
- services مبنية بحسب demand حقيقي
- contracts ناتجة عن الحاجة لا عن التخمين
- binding law واضح
- runtime local حقيقي
- تشغيل وتجريب مثبت
- final close قابل للتدقيق

---

# 14. FINAL EXECUTIVE STATEMENT

هذا الدليل ليس outline.
هذا ليس مجرد plan.
هذا ليس مجرد مرجع تنظيمي.

هذا هو:

**Manual Platform Construction Operating System**

لبناء `bthwani-suite` من الصفر بالكامل، من أول قرار إلى آخر proof، ومن أول shell إلى آخر screen، ومن أول contract إلى آخر binding، ومن أول boot إلى final close.


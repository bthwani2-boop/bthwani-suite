# Tools Guards Catalog

هذا الملف فهرس تشغيل مشتق فقط. مصدر policy يبقى في `governance/` و`.agents/`.

## Active guards

| Guard | Purpose | Owner policy | When it runs | Outputs | Mode |
|---|---|---|---|---|---|
| `guard-governance-boundaries.mjs` | يتحقق من سلامة `tools/guards/` نفسها: manifest/file/config alignment، منع legacy refs، ومنع subfolders غير المسموح بها | `governance/03_REPO_BOUNDARIES.md`, `governance/14_GUARDS_CATALOG.md` | دائمًا (alwaysRun) | `.json`, `.md` | `blocking` |
| `guard-agent-global-authority.mjs` | يتحقق من authority split الخاصة بـ `.agents/` و`AGENTS.md` ويمنع عودة `.github/skills` أو mirrors القديمة | `AGENTS.md`, `.agents/AUTHORITY_BOUNDARY.md`, `.agents/UPDATE_POLICY.md` | مع أي تعديل agent/governance/guards أو قبل مراجعة تغييرات agent-related | `.json`, `.md` | `blocking` |
| `guard-ui-architecture-boundary.mjs` | يمنع Tamagui المباشر خارج `ui-kit` ويمنع deep imports إلى `ui-kit/src` | `governance/08_UI_KIT_AND_BRAND.md` | مع تغييرات UI أو imports أو boundaries | `.json`, `.md` | `blocking` |
| `guard-design-token-drift.mjs` | يرصد raw hex colors خارج `ui-kit` لتصنيف drift البصري | `governance/08_UI_KIT_AND_BRAND.md` | مع تغييرات UI/CSS/TSX | `.json`, `.md` | `advisory` |
| `guard-ui-kit-central-design-ownership.mjs` | يرصد المكونات القابلة للمركزية، أنظمة التصميم المحلية، وimports التصميم المحلية خارج `@bthwani/ui-kit` | `governance/08_UI_KIT_AND_BRAND.md`, `governance/14_GUARDS_CATALOG.md` | مع تغييرات UI/UX أو components أو screen/surface patterns | `.json`, `.md` | `advisory` |
| `guard-live-code-organization-hygiene.mjs` | يرصد مجلدات scatter/common/utils الغامضة، التسمية القديمة/المؤقتة، الملفات الكبيرة المختلطة، التجزئة الزائدة، وexports الأيتام | `governance/03_REPO_BOUNDARIES.md`, `governance/14_GUARDS_CATALOG.md` | مع أي تغيير في الكود (triggerAnyChange) | `.json`, `.md` | `advisory` |
| `guard-service-contract-matrix.mjs` | يتحقق من وجود service blueprint وOpenAPI placeholder لكل root service canonical | `governance/10_SERVICE_CLOSURE.md` | مع تغييرات service closure أو governance baseline | `.json`, `.md` | `advisory` |
| `guard-api-binding-runtime.mjs` | يرصد data-bound screens التي تبدو ناقصة state coverage أو binding hints | `governance/09_API_BINDING_RUNTIME.md` | مع تغييرات binding/runtime/screen state | `.json`, `.md` | `advisory` |
| `guard-evidence-registry-runs-hygiene.mjs` | يتحقق من hygiene لمجلد `tools/registry/runs` ومنع `_HANDOFF.zip` كقاعدة جديدة | `governance/11_EVIDENCE_AND_TRACEABILITY.md` | مع تغييرات evidence/runners/registry أو أثناء مراجعة handoff | `.json`, `.md` | `advisory` |
| `guard-workflow-ci-parity.mjs` | يراجع أن workflows الحالية ما زالت تشغّل runner الصحيحة للحراس | `governance/13_CI_AND_GATES.md` | مع تغييرات runners أو workflows | `.json`, `.md` | `blocking` |
| `guard-secret-scan.mjs` | يتحقق من أنماط secrets الواضحة داخل الملفات النصية المتعقبة | `governance/16_SECURITY_AND_SECRETS.md` | مع أي تغيير (triggerAnyChange) | `.json`, `.md` | `blocking` |

## Generic Service Guards

تقرأ حراس runtime الإعداد من `tools/guards/guard-service-runtime.config.json`. لإضافة خدمة جديدة، أضف مدخلًا في `services` وشغّل الحارس مع `--service <id>` بدون إنشاء wrapper خاص بالخدمة.

| الحارس | الوصف | Owner policy | متى يعمل | Outputs | الوضع |
|---|---|---|---|---|---|
| `guard-service-go-runtime.mjs` | يتحقق من ملفات Go الأساسية، route scope المصرّح، repository interface، PostgreSQL repository، ويشغّل `go test ./...` داخل backend الخدمة | `governance/09_API_BINDING_RUNTIME.md`, `governance/10_SERVICE_CLOSURE.md` | مع تغييرات backend/runtime أو قبل إثبات runtime slice | `.json`, `.md` | `blocking` |
| `guard-service-postgres-runtime.mjs` | يتحقق من Compose PostgreSQL-only، migration/seed files، وأن الجداول محصورة في نطاق الخدمة المسجّل | `governance/09_API_BINDING_RUNTIME.md`, `governance/10_SERVICE_CLOSURE.md` | مع تغييرات DB schema أو local runtime compose | `.json`, `.md` | `blocking` |
| `guard-service-l7-closure.mjs` | يمنع closure claim بلا evidence، ويفشل عند evidence ناقص، خصوصًا غياب screenshot أو chain proof | `governance/10_SERVICE_CLOSURE.md`, `governance/11_EVIDENCE_AND_TRACEABILITY.md` | قبل أي L7/runtime closure أو عند مراجعة evidence folder | `.json`, `.md` | `blocking` |
| `guard-service-runtime.mjs` | يشغّل حراس Go/PostgreSQL/L7 العامة بالتتابع لنفس `--service` و`--slice` | `governance/09_API_BINDING_RUNTIME.md`, `governance/10_SERVICE_CLOSURE.md`, `governance/11_EVIDENCE_AND_TRACEABILITY.md` | قبل اعتماد runtime evidence لأي service slice | `.json`, `.md` | `blocking` |
| `guard-platform-vars-control.mjs` | يقرأ نطاقات الخدمات من config ويمنع تشتت mutable policy وماليات WLT خارج المالك المحدد | `governance/20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md`, `governance/22_DSH_GOLDEN_SLICE.md` | مع تغييرات Vars/provider/control-panel أو بروفايل DSH/finance/release | `.json`, `.md` | `audit` |
| `guard-cross-service-operating-model.mjs` | diagnoses service journeys, operations, UX logic, permissions, WLT finance boundaries, Vars policy, observability, evidence, and unsafe closure claims against benchmark profiles | `governance/10_SERVICE_CLOSURE.md`, `governance/09_API_BINDING_RUNTIME.md`, `governance/20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md`, `governance/benchmark-profiles/cross-service-operating-model.profile.json` | with service/journey/operation closure work or before unsafe closure claims | `.json`, `.md` | `blocking` |

## Runners

- `RUN_GOVERNANCE_GUARDS.ps1` يشغّل guards ذات `runner = governance`.
- `RUN_AGENT_GUARDS.ps1` wrapper خفيف يشغّل guards ذات `runner = agent`.

## Guard routing (Selection)

`RUN_GOVERNANCE_GUARDS.ps1` يدعم ثلاثة أوضاع:

| الوضع | الاستخدام | السلوك |
|---|---|---|
| `Auto` (افتراضي) | `guard:governance` أو `-Selection Auto` | يختار الحراس بناءً على الملفات المتغيرة في worktree + الحراس ذات `alwaysRun=true` دائمًا. في CI بلا ملفات متغيرة يعود إلى All. |
| `All` | `guard:governance:all` أو `-Selection All` | يشغّل كل حراس البروفايل المحدد بغض النظر عن الملفات. |
| `Selected` | `-Selection Selected -GuardIds GUARD_X,GUARD_Y` | يشغّل الحراس المحددة صراحةً فقط. |

أعمدة routing في `guard-manifest.json`:

- `alwaysRun`: يُشمل دائمًا في Auto حتى بلا ملفات متغيرة.
- `triggerAnyChange`: يُشمل إذا وُجد أي ملف متغير.
- `triggerPaths`: مسارات glob تُفعّل الحارس إذا تطابق أي ملف متغير.
- `triggerExtensions`: امتدادات مطلوبة إضافةً لتطابق المسار.
- `selectionTier`: تصنيف منطقي (core, ui, service, security, agent, ci, evidence, hygiene, manual, v3).

## Notes

- `guard-manifest.json` هو الفهرس التنفيذي الرسمي.
- `_guard-common.mjs` retained كـ common compatibility helper.
- `lib/guard-utils.mjs` هو utility layer الأساسي للحراس الحالية.

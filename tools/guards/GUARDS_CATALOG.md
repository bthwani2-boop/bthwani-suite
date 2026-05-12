# Tools Guards Catalog

هذا الملف فهرس تشغيل مشتق فقط. مصدر policy يبقى في `governance/` و`.agents/`.

## Active guards

| Guard | Purpose | Owner policy | When it runs | Outputs | Mode |
|---|---|---|---|---|---|
| `guard-governance-boundaries.mjs` | يتحقق من سلامة `tools/guards/` نفسها: manifest/file/config alignment، منع legacy refs، ومنع subfolders غير المسموح بها | `governance/03_REPO_BOUNDARIES.md`, `governance/14_GUARDS_CATALOG.md` | مع أي تعديل في الحراس أو runners أو catalog | `.json`, `.md` | `blocking` |
| `guard-agent-global-authority.mjs` | يتحقق من authority split الخاصة بـ `.agents/` و`AGENTS.md` ويمنع عودة `.github/skills` أو mirrors القديمة | `AGENTS.md`, `.agents/AUTHORITY_BOUNDARY.md`, `.agents/UPDATE_POLICY.md` | مع أي تعديل agent/governance/guards أو قبل مراجعة تغييرات agent-related | `.json`, `.md` | `blocking` |
| `guard-ui-architecture-boundary.mjs` | يمنع Tamagui المباشر خارج `ui-kit` ويمنع deep imports إلى `ui-kit/src` | `governance/08_UI_KIT_AND_BRAND.md` | مع تغييرات UI أو imports أو boundaries | `.json`, `.md` | `blocking` |
| `guard-design-token-drift.mjs` | يرصد raw hex colors خارج `ui-kit` لتصنيف drift البصري | `governance/08_UI_KIT_AND_BRAND.md` | مع تغييرات UI/CSS/TSX | `.json`, `.md` | `advisory` |
| `guard-service-contract-matrix.mjs` | يتحقق من وجود service blueprint وOpenAPI placeholder لكل root service canonical | `governance/10_SERVICE_CLOSURE.md` | مع تغييرات service closure أو governance baseline | `.json`, `.md` | `advisory` |
| `guard-api-binding-runtime.mjs` | يرصد data-bound screens التي تبدو ناقصة state coverage أو binding hints | `governance/09_API_BINDING_RUNTIME.md` | مع تغييرات binding/runtime/screen state | `.json`, `.md` | `advisory` |
| `guard-evidence-registry-runs-hygiene.mjs` | يتحقق من hygiene لمجلد `tools/registry/runs` ومنع `_HANDOFF.zip` كقاعدة جديدة | `governance/11_EVIDENCE_AND_TRACEABILITY.md` | مع تغييرات evidence/runners/registry أو أثناء مراجعة handoff | `.json`, `.md` | `advisory` |
| `guard-workflow-ci-parity.mjs` | يراجع أن workflows الحالية ما زالت تشغّل runner الصحيحة للحراس | `governance/13_CI_AND_GATES.md` | مع تغييرات runners أو workflows | `.json`, `.md` | `blocking` |
| `guard-secret-scan.mjs` | يتحقق من أنماط secrets الواضحة داخل الملفات النصية المتعقبة | `governance/16_SECURITY_AND_SECRETS.md` | مع أي تغييرات config/script/source حساسة | `.json`, `.md` | `blocking` |

## Runners

- `RUN_GOVERNANCE_GUARDS.ps1` يشغّل guards ذات `runner = governance`.
- `RUN_AGENT_GUARDS.ps1` wrapper خفيف يشغّل guards ذات `runner = agent`.

## Notes

- `guard-manifest.json` هو الفهرس التنفيذي الرسمي.
- `_guard-common.mjs` retained كـ common compatibility helper.
- `lib/guard-utils.mjs` هو utility layer الأساسي للحراس الحالية.

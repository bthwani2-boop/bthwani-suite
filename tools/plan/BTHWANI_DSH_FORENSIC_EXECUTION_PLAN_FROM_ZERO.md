# BThwani / DSH — Forensic Execution Plan From Zero

**Repo:** `C:\bthwani-suite`  
**GitHub:** `bthwani2-boop/bthwani-suite`  
**Branch under review:** `ghb/0126-20260509-210858-dsh-ui-kit`  
**Decision:** `FIX_REQUIRED`  
**Mode:** Zero-based forensic review → baseline readiness → DSH screen/file inventory → narrow correction → evidence gate.  
**Scope:** Frontend/UI/UX/Flow/Screen classification only, unless a phase explicitly says “audit only” for backend/runtime/security topics.

---

## 0. Why the previous approach was incomplete

The prior DSH command file was useful, but incomplete because it started too close to the DSH screen tree. The practical baseline must be inserted before DSH execution.

Correct order:

```text
Current branch discovery
→ Baseline readiness audits
→ CHECK / Guard / Contract decisions
→ DSH zero-based screen/file inventory
→ DSH naming/classification contract from evidence
→ narrow UI/UX/Flow corrections
→ visual + Git + TypeScript evidence
```

Incorrect order:

```text
DSH screen tree directly
→ rename/move/refactor
→ then try to add governance later
```

This plan merges:

1. `BTHWANI_PRACTICAL_EXECUTION_BASELINE_V1.md`
2. `BTHWANI_DSH_BASELINE_READINESS_GUARDS_ADDENDUM.md`
3. `DSH_ZERO_BASED_FRONTEND_REVIEW_AND_CLOSURE_COMMANDS.md`
4. Current GitHub branch evidence
5. Governance evidence from:
   - `governance/PLATFORM_BLUEPRINT.md`
   - `governance/TECH_STACK_LOCK.md`
   - `governance/BTHWANI_FINAL_MERGED_ENGINEERING_BASELINE_V1.md`

---

## 1. Forensic branch reality observed from GitHub

Remote branch `ghb/0126-20260509-210858-dsh-ui-kit` exists and is ahead of `main` by 100 commits in GitHub compare. This means the branch is heavily changed and must not be treated as a small UI patch.

High-risk observations from compare evidence:

| Area | Observed risk | Why it matters |
|---|---|---|
| Control Panel routes | Many `control-panel/runtime/app/operations/dsh/...` pages removed | Route semantics may have changed; must verify redirects and entrypoints. |
| Shell | `control-panel/shell/ControlPanelSurfaceHost.tsx` changed heavily | Shell regression risk remains high; visual proof required. |
| DSH frontend flattening | Many files moved from nested folders to flat surface roots | Naming/tree proposal must be evidence-based; no further mass move. |
| App client | `DshHomeGetScreen.tsx` added with very large line count | Giant file risk; split later only with importer/exporter evidence. |
| App partner | Workspace files renamed but still use `WorkspaceContent` style | Rename is not urgent unless it reduces confusion with proof. |
| App field | `FieldSurfaceHost.tsx` still lacks clear `Dsh` prefix | Naming breach candidate; do not rename until consumer proof exists. |
| Control Panel finance/marketing/operations files | Some added files in compare appear as zero-addition | Must verify locally if they are empty, generated placeholders, or compare artifact. |
| DSH docs | Several docs were added | Good direction, but docs do not prove implementation closure. |
| Heatmap | `GeoHeatmapScreen.tsx` exists in control-panel operations | Correct placement for admin operations map; does not prove app-captain scoped map. |
| Language | `operations.registry.ts` still contains `Open operations` | Arabic/i18n closure is not complete. |

Local truth may differ from remote because the user may have unpushed local changes. Every command below starts by proving local branch and worktree state.

---

## 2. Correct interpretation of the user’s practical baseline

The practical baseline is not an implementation checklist. It is a readiness layer.

### 2.1 Allowed now

```text
- Readiness audits
- CHECK / Guard / Contract proposals
- DSH screen/file inventory
- UI/UX/Flow classification
- narrow DSH frontend fixes
- visual evidence gathering
```

### 2.2 Blocked unless separately approved later

```text
- React Compiler activation
- Go backend implementation
- API contract expansion
- typed API client generation
- backend binding
- database / PostgreSQL
- Redis / Valkey
- Docker runtime implementation
- OpenTelemetry / Sentry implementation
- production readiness claims
```

### 2.3 React Compiler decision

```text
React 19 exists.
React Compiler must be audited first.
If later enabled, first pilot = control-panel/runtime only.
No global enablement.
No mobile enablement before Expo/Metro audit.
```

### 2.4 Go decision

```text
Go is backend/API/workers candidate only.
Go is not UI.
No Go implementation before foundation audit.
```

### 2.5 UI Kit decision

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

Tamagui is current internal dependency only; do not expand it as target architecture.

---

## 3. Correct heatmap rule

Allowed map contexts:

| Surface | Rule |
|---|---|
| `control-panel/operations` | Full admin live dispatch map allowed. Focus: orders, captain presence, store pressure, commitment risk, zone load, dispatch recommendations. |
| `app-captain` | Captain-scoped route/map allowed only if needed by captain journey. It must not expose all captains or admin fleet intelligence. |
| `app-client` | No heatmap. Tracking only. |
| `app-partner` | No heatmap. Own store queue/readiness only. |
| `app-field` | No heatmap. Assigned visit/store context only. |

---

## 4. Strict execution policy

- Do not combine phases into one wide command.
- Do not move/rename/delete before inventory and consumer proof.
- Do not use broad “fix everything” commands.
- Do not accept screenshot-less UI closure.
- Do not accept `tsc` alone as UI proof.
- Do not proceed from one command to the next when `git diff --check` or `tsc` fails.
- Do not declare `PASS/CLOSED/100%` unless all gates and evidence are present.

---

# PHASE A — Baseline Readiness Before DSH

## COMMAND A0 — Current Stack + Governance Reality Audit

```text
Inspect only. Do not edit files.

Repo: C:\bthwani-suite

Task:
تحقق رقميًا من واقع الستاك الحالي والحكومة قبل أي تنفيذ في DSH.

Must inspect:
- package.json
- pnpm-workspace.yaml
- ui-kit/package.json
- control-panel/runtime/package.json
- app-client/runtime/package.json
- app-partner/runtime/package.json
- app-captain/runtime/package.json
- app-field/runtime/package.json
- governance/BTHWANI_FINAL_MERGED_ENGINEERING_BASELINE_V1.md
- governance/TECH_STACK_LOCK.md
- governance/PLATFORM_BLUEPRINT.md
- dsh/SERVICE_BLUEPRINT.md

Required report:
1) Confirm current versions from package files:
   - React
   - React DOM
   - React Native
   - Expo
   - Next
   - Nx
   - TypeScript
   - pnpm
   - Tamagui
2) Classify each item:
   - CURRENT_DEPENDENCY
   - TARGET_STACK
   - DEPRECATED_TARGET
   - NOT_STARTED
   - NEEDS_READINESS_AUDIT
3) Confirm:
   - React 19 exists.
   - Next 16 exists.
   - Expo 54 exists.
   - Nx exists.
   - Tamagui exists but is internal to ui-kit only.
4) Detect contradictions:
   - current branch vs governance branch references
   - current dependency vs target stack
   - Tamagui current dependency vs deprecated target
   - frontend/UI closure before API/binding/backend
5) Output a baseline readiness matrix.

Forbidden:
- No edits.
- No implementation.
- No dependency changes.
- No PASS/CLOSED claim.
```

---

## COMMAND A1 — Frontend / React / Next Readiness Audit

```text
Inspect only. Do not enable React Compiler or change Next config.

Repo: C:\bthwani-suite

Task:
افحص جاهزية Frontend / React / Next كـ readiness فقط، ثم حوّل النتائج إلى CHECK/Guard recommendations.

Scope:
- package.json
- pnpm-lock.yaml
- control-panel/runtime
- webapp/runtime
- website/runtime
- ui-kit
- dsh/frontend/control-panel
- next.config.*
- babel.config.*
- tsconfig*.json
- eslint config files

Check:
1) React Compiler readiness:
   - package/plugin presence
   - Next config support
   - Babel plugin presence/order
   - rules-of-react violations risk
   - candidate scope: control-panel/runtime only
   - do not enable globally
2) ESLint / Rules of React:
   - detect eslint config
   - detect react hooks/rules coverage
   - recommend guard command only
3) Next server/client boundary:
   - broad "use client" usage
   - client boundary at large route/screen level
   - server-first opportunities
4) Next Cache Components / PPR:
   - readiness only
   - no activation
5) Turbopack FS cache:
   - check current dev/build commands
   - recommend only if safe
6) Bundle Analyzer:
   - check whether configured
   - recommend guard/budget only
7) next/image:
   - detect raw <img> in web/control-panel/website/webapp
8) next/font:
   - detect font centralization
9) next/script:
   - detect raw scripts
10) Metadata / OG / sitemap / robots:
   - detect baseline presence
11) Core Web Vitals:
   - recommend LCP/INP/CLS measurement path
12) Performance budgets:
   - recommend JS/images/API/render budgets

Return:
- findings by path
- risk: BLOCKER/HIGH/MEDIUM/LOW
- recommended CHECK/Guard names
- exact first safe pilot if any

Forbidden:
- No React Compiler activation.
- No Next config changes.
- No package changes.
- No code edits.
```

---

## COMMAND A2 — CSS / HTML / RTL / A11y Readiness Audit

```text
Inspect only. Do not edit files.

Repo: C:\bthwani-suite

Task:
افحص CSS / HTML / RTL / A11y وتحويلها إلى guardable checks.

Scope:
- ui-kit/src
- control-panel/runtime
- control-panel/shell
- dsh/frontend
- webapp/runtime
- website/runtime

Check:
1) CSS logical properties:
   - left/right/margin-left/margin-right/padding-left/padding-right in RTL contexts
   - recommend inline-start/end conversion plan
2) CSS tokens:
   - random colors
   - local token systems
   - spacing/font drift
3) CSS Cascade Layers:
   - readiness only
   - no adoption yet
4) Container Queries:
   - identify cards/widgets that would benefit
   - readiness only
5) Stylelint / CSS guard:
   - detect existing config
   - propose guard
6) Semantic HTML:
   - clickable div risk
   - missing button/nav/main/label/table semantics
7) html lang/dir:
   - verify root/layout handling
8) dir="auto":
   - identify mixed text areas needing it
9) Accessibility:
   - keyboard/focus/labels/contrast
10) Visual regression:
   - list required screenshot surfaces

Return:
- findings by file path
- recommended guard names
- required visual evidence matrix

Forbidden:
- No edits.
- No style rewrites.
```

---

## COMMAND A3 — UI Kit / Tamagui / Design Authority Audit

```text
Inspect only. Do not edit files.

Repo: C:\bthwani-suite

Task:
افحص سلطة ui-kit وTamagui والهوية البصرية قبل أي تصحيح DSH.

Scope:
- ui-kit
- dsh/frontend
- control-panel/shell
- app-client/runtime
- app-partner/runtime
- app-captain/runtime
- app-field/runtime
- control-panel/runtime

Check:
1) @bthwani/ui-kit usage boundaries.
2) Tamagui imports outside ui-kit.
3) local design systems outside ui-kit.
4) duplicate components:
   - buttons
   - cards
   - tabs
   - headers
   - queues
   - status tags
   - map primitives
5) BThwani colors:
   - #0A2F5C
   - #FF500D
   - #FFFFFF
   - semantic state tones only
6) RTL correctness in shared primitives.
7) state coverage:
   - loading
   - empty
   - error
   - success
   - offline
   - disabled
8) Tamagui Compiler readiness:
   - readiness only after ui-kit is stable
   - no activation

Return:
- duplicate map
- boundary violations
- proposed ui-kit primitive ownership
- do-not-expand list

Forbidden:
- No ui-kit refactor.
- No Tamagui compiler activation.
- No design rewrite.
```

---

## COMMAND A4 — Screen / Flow / Binding / Integration Contract Audit

```text
Inspect only. Do not edit files.

Repo: C:\bthwani-suite

Task:
افحص جاهزية عقود الشاشات والـ flow والـ binding والـ integration لكل DSH surfaces.

Scope:
- dsh/frontend/app-client
- dsh/frontend/app-partner
- dsh/frontend/app-captain
- dsh/frontend/app-field
- dsh/frontend/control-panel
- dsh/frontend/shared
- dsh/docs
- dsh/SERVICE_BLUEPRINT.md

Required checks:
1) Screen Contract exists or missing:
   - screenId
   - surface
   - service
   - ownerPath
   - route/routeKey
   - params
   - entrypoints
   - exits
   - permissions
   - uiKitDependencies
   - bindingInputs
   - bindingOutputs
   - integrationSource
   - states
   - rtlContract
   - visualEvidence
   - verification
   - status
2) Screen Registry exists or missing.
3) Route Contract exists or missing.
4) Flow Transition Matrix exists or missing.
5) Params Contract exists or missing.
6) Binding Contract exists or missing.
7) Integration Contract exists or missing.
8) no direct screen import.
9) no random route strings.
10) no fake binding.
11) no integration inside UI.
12) ownerPath per screen.
13) visual + runtime evidence requirements.

Return:
- contract coverage matrix
- missing contracts by screen/surface
- gap map
- recommended first contract-only command

Forbidden:
- No binding implementation.
- No API.
- No runtime.
- No code edits.
```

---

## COMMAND A5 — Go / Backend Foundation Audit Only

```text
Inspect only. Do not implement Go.

Repo: C:\bthwani-suite

Task:
افحص جاهزية Go/backend foundation فقط. لا تنشئ Go code.

Scope:
- governance/TECH_STACK_LOCK.md
- governance/PLATFORM_BLUEPRINT.md
- dsh/SERVICE_BLUEPRINT.md
- root repo files
- any existing backend folders
- OpenAPI files

Check:
1) Go is backend/API/workers candidate only.
2) Go is not for UI.
3) go.work/module strategy exists or missing.
4) service template exists or missing.
5) OpenAPI or Connect/Protobuf decision exists or missing.
6) migrations strategy exists or missing.
7) sqlc/ent/SQL disciplined decision exists or missing.
8) gofmt/go vet/golangci-lint readiness.
9) gosec/govulncheck readiness.
10) observability readiness.
11) Docker/local runtime readiness.
12) implementation remains blocked until foundation audit is approved.

Return:
- Go foundation gap map
- do-not-implement decision
- first safe next step

Forbidden:
- No Go files.
- No backend implementation.
- No package/dependency changes.
```

---

## COMMAND A6 — API / Domain / Data Safety Gap Audit

```text
Inspect only. Do not edit contracts.

Repo: C:\bthwani-suite

Task:
افحص API / Domain / Data safety readiness كـ gap map فقط.

Scope:
- master.openapi.yaml
- auth.openapi.yaml
- dsh/dsh.openapi.yaml
- wlt/wlt.openapi.yaml
- dsh/SERVICE_BLUEPRINT.md
- wlt/SERVICE_BLUEPRINT.md
- governance/PLATFORM_BLUEPRINT.md

Check:
1) API contracts exist and status.
2) Contract tests exist or missing.
3) API versioning exists or missing.
4) Backend validation policy exists or missing.
5) State machines for:
   - orders
   - payment
   - wallet
   - captain assignment
6) Idempotency for sensitive operations.
7) Outbox pattern.
8) Event versioning.
9) Retry / DLQ for workers.
10) Money safety:
    - integer minor units
    - no float
    - currency code
11) Timezone:
    - UTC storage
    - local display
12) DB migrations.
13) DB indexing/query plan.
14) Backup/restore drill.
15) Concurrency/race protection.
16) Cache invalidation.
17) Search/filter/pagination contract.

Return:
- API/domain/data safety matrix
- gaps by severity
- what remains blocked before backend work

Forbidden:
- No OpenAPI edits.
- No DB code.
- No backend code.
```

---

## COMMAND A7 — Security / Privacy / Compliance Audit

```text
Inspect only. Do not implement security code.

Repo: C:\bthwani-suite

Task:
افحص Security / Privacy / Compliance readiness كـ audit فقط.

Scope:
- governance
- auth.openapi.yaml
- master.openapi.yaml
- dsh
- wlt
- control-panel/runtime
- app runtimes
- CI/workflows if present

Check:
1) Threat modeling coverage for:
   - login
   - payment
   - wallet
   - control-panel
   - webhooks
   - uploads
2) OWASP ASVS for web.
3) OWASP API Top 10 for API.
4) OWASP MASVS for mobile.
5) OWASP SAMM for SDLC.
6) RBAC.
7) Object-level authorization.
8) Multi-tenancy isolation.
9) Audit logs.
10) Rate limiting:
    - OTP
    - payment
    - search
    - coupon
11) Secrets management.
12) Secrets rotation.
13) CSP/security headers.
14) PII classification.
15) Data retention.
16) PCI scope.
17) File upload safety.
18) Supply-chain security.
19) SBOM/SLSA before production.

Return:
- security readiness matrix
- P0/P1 blockers
- no-implementation verdict

Forbidden:
- No implementation.
- No dependency change.
- No config change.
```

---

## COMMAND A8 — Runtime / Ops / Release Readiness Audit

```text
Inspect only. Do not implement runtime tooling.

Repo: C:\bthwani-suite

Task:
افحص Runtime / Ops / Release readiness كـ audit فقط.

Scope:
- governance
- package.json
- pnpm-workspace.yaml
- app runtimes
- control-panel/runtime
- docker files if present
- tools/scripts
- tools/guards
- CI/workflows

Check:
1) Observability:
   - logs
   - metrics
   - traces
   - request_id
2) OpenTelemetry readiness.
3) Health/readiness endpoints.
4) Local runtime parity.
5) Docker readiness for local DB/Redis/queue/providers.
6) Config control plane.
7) Feature flags.
8) Kill switches.
9) Incident response.
10) Release checklist.
11) Rollback/hotfix policy.
12) Expo runtimeVersion.
13) EAS Update discipline.
14) RN New Architecture readiness.
15) Expo Orbit usefulness.
16) Sentry/error monitoring before production.

Return:
- runtime readiness matrix
- allowed later implementation order
- blockers

Forbidden:
- No runtime implementation.
- No Docker implementation.
- No dependency changes.
```

---

## COMMAND A9 — AI / Governance / Evidence Guard Audit

```text
Inspect only, then propose guards.

Repo: C:\bthwani-suite

Task:
حوّل قائمة AI/Governance/Evidence إلى guards/contracts قابلة للتنفيذ.

Scope:
- governance
- tools/guards
- tools/scripts
- package.json scripts
- .github/workflows
- dsh/docs

Check:
1) current branch discovery is required.
2) pnpm-workspace.yaml as current structure source.
3) forbidden old paths guard.
4) CHECK before APPLY.
5) Git evidence.
6) git diff --check.
7) pnpm -w exec tsc --noEmit after code changes.
8) screenshots for UI.
9) patch handoff for sensitive changes.
10) Evidence ZIP for important scripts.
11) ADR / decision log for major decisions.
12) no PASS/CLOSED/100 without evidence.

Return:
- existing guards
- missing guards
- proposed guard ids
- suggested package.json script names
- no implementation yet unless user explicitly asks.

Forbidden:
- No guard implementation unless separately requested.
- No package.json changes.
```

---

## COMMAND A10 — Consolidated Baseline Readiness Matrix

```text
Inspect and generate report only. Do not edit implementation files.

Repo: C:\bthwani-suite

Task:
اجمع نتائج BASELINE-00 إلى BASELINE-09 في مصفوفة واحدة تحدد ماذا يسمح بتنفيذه الآن وماذا يبقى محظورًا.

Required input:
- latest audit outputs under tools/registry/runs

Create report:
- tools/registry/runs/BTHWANI_BASELINE_READINESS_MATRIX-{timestamp}/BTHWANI_BASELINE_READINESS_MATRIX.md

Required sections:
1) Frontend / React / Next
2) CSS / HTML / RTL / A11y
3) UI Kit / Tamagui / Design
4) Screen / Flow / Binding / Integration
5) Go / Backend Foundation
6) API / Domain / Data Safety
7) Security / Privacy / Compliance
8) Runtime / Ops / Release
9) AI / Governance / Evidence
10) DSH-specific allowed next actions
11) DSH-specific forbidden actions

For every item include:
- status: PASS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NOT_STARTED
- evidence path
- next safe action
- whether implementation is allowed now: YES/NO

Final rule:
- Only UI/UX/Flow and screen/file classification fixes may proceed now.
- React Compiler activation, Go backend, API binding, database, runtime, Docker, observability, and production readiness remain blocked until their audits pass and the user approves a separate narrow task.
```

---

# PHASE B — DSH Zero-Based Forensic Inventory

## COMMAND B0 — Read-only DSH Governance + Branch Reality Audit

```text
Inspect only. Do not edit files.

Repo: C:\bthwani-suite

Task:
ابدأ DSH من الصفر بعد baseline readiness. اقرأ الحوكمة والفرع الحالي ثم أنتج تقرير واقع، لا خطة نظرية.

Must read:
- governance/PLATFORM_BLUEPRINT.md
- governance/TECH_STACK_LOCK.md
- governance/BTHWANI_FINAL_MERGED_ENGINEERING_BASELINE_V1.md
- dsh/SERVICE_BLUEPRINT.md
- dsh/frontend/README.md
- pnpm-workspace.yaml
- package.json
- ui-kit/package.json
- control-panel/runtime/package.json
- app-client/runtime/package.json
- app-partner/runtime/package.json
- app-captain/runtime/package.json
- app-field/runtime/package.json

Required report:
1) current branch
2) current commit
3) git status
4) current workspace paths from pnpm-workspace.yaml
5) forbidden old paths found in docs/prompts/code
6) DSH service status:
   - UI/UX/Flow
   - Binding
   - Integration
   - Runtime
   - Backend
   - Evidence
7) immediate blockers before implementation.

Return:
- verdict: FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE
- exact file paths inspected
- no edits.
```

---

## COMMAND B1 — Deep Screen/File Inventory Generator

```text
Inspect only. Do not edit files.

Repo: C:\bthwani-suite

Task:
اعمل جردًا رقميًا لكل ملفات DSH frontend الحالية، ثم صنّفها حسب الدور الحقيقي.

Scope:
- dsh/frontend/app-client
- dsh/frontend/app-partner
- dsh/frontend/app-captain
- dsh/frontend/app-field
- dsh/frontend/control-panel
- dsh/frontend/shared
- dsh/_archive/frontend
- control-panel/shell
- ui-kit/src

Required output:
Create a markdown report only under:
- tools/registry/runs/DSH_SCREEN_FILE_INVENTORY-{timestamp}/DSH_SCREEN_FILE_INVENTORY.md

Report columns:
- file path
- file name
- extension
- surface
- service
- actor
- detected kind:
  SurfaceHost / ScreenEntry / ScreenAggregator / Panel / Workspace / Deck / Queue / Model / Fixture / Adapter / Registry / Catalog / Shared / Archive / Unknown
- exported symbols
- imported by count if detectable
- imports from ui-kit yes/no
- Tamagui direct import yes/no
- contains React component yes/no
- contains multiple exported screens yes/no
- contains inline styles yes/no
- contains scroll component yes/no
- contains English user-facing text risk yes/no
- contains route/query logic yes/no
- contains preview/mock/fixture data yes/no
- suspected owner path
- status:
  KEEP / SPLIT_LATER / MOVE_LATER / RENAME_LATER / ARCHIVE_ONLY / DELETE_CANDIDATE / BLOCKED

Also report:
1) giant files > 500 lines
2) files exporting multiple Screen components
3) folders named screens with non-screen content
4) root-level .tsx files that may need future slice classification
5) archive/current truth conflicts
6) empty or placeholder files
7) duplicate names in old/new locations
8) possible broken barrels.

Forbidden:
- Do not modify code.
- Do not rename files.
- Do not delete files.
- Do not create target tree.
- Report only.
```

---

## COMMAND B2 — Screen/File Naming Contract Proposal From Evidence

```text
Inspect and document only. Do not move or rename files.

Repo: C:\bthwani-suite

Task:
بناءً على تقرير الجرد الرقمي فقط، اقترح naming/classification contract جديد واقعي، لا شجرة مثالية.

Required input:
- latest tools/registry/runs/DSH_SCREEN_FILE_INVENTORY-*/DSH_SCREEN_FILE_INVENTORY.md

Create:
- tools/registry/runs/DSH_NAMING_CLASSIFICATION_PLAN-{timestamp}/DSH_NAMING_CLASSIFICATION_PLAN.md

Required sections:
1) Current facts:
   - actual files count by surface
   - actual screen entries count
   - aggregators count
   - panels/workspaces/decks/queues count
2) Naming rules:
   - SurfaceHost
   - ScreenEntry
   - Panel
   - Workspace
   - Deck
   - Queue
   - Model
   - Fixture
   - Adapter
   - Registry
   - Shared
3) Do not rename list:
   - files with active imports
   - files used by runtime shells
   - files that would create churn
4) Rename later candidates:
   - only when consumer/import proof exists
5) Split later candidates:
   - giant files / multi-screen files
6) Move later candidates:
   - only when owner/import/export evidence exists
7) Forbidden transformations:
   - no mass FSD tree
   - no blind folders
   - no screens/ folder rebuild unless current branch evidence supports it
8) Proposed target taxonomy:
   - status as DESIGN_PROPOSAL_ONLY, not implementation.

Forbidden:
- no edits outside the report
- no move/rename/delete
- no broad refactor
```

---

# PHASE C — Narrow DSH Corrections Only

## COMMAND C0 — Classification-Safe Fixes Only

```text
Execute only classification-safe fixes. Do not redesign UI.

Repo: C:\bthwani-suite

Task:
أصلح المخالفات الآمنة فقط التي لا تغيّر التصميم الحالي ولا تنقل ملفات.

Allowed files:
- dsh/frontend/**/index.ts
- dsh/frontend/**/surface-catalog.ts
- dsh/frontend/**/surface-meta.ts
- dsh/frontend/**/flow-meta.ts
- dsh/frontend/control-panel/**/registry.ts
- dsh/frontend/control-panel/**/operations.registry.ts
- dsh/frontend/control-panel/shared/*.ts
- dsh/docs/*.md

Allowed fixes:
1) Replace export * with explicit exports.
2) Fix wrong user-facing labels only.
3) Add missing metadata/classification where file already exists.
4) Add comments only when needed to mark:
   - UI_PREVIEW_ONLY
   - NEEDS_BINDING_LATER
   - DO_NOT_RENAME_WITHOUT_IMPORT_PROOF
5) Fix broken import/export caused by existing barrels.
6) No visual changes.

Forbidden:
- no file moves
- no renames
- no deleting
- no redesign
- no backend/API/runtime
- no changing app flows
- no Tamagui outside ui-kit
- no new tree folders

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- classification fixes
- verification output
```

---

## COMMAND C1 — Heatmap Placement Correction

```text
Execute heatmap placement correction only.

Repo: C:\bthwani-suite

Task:
صحّح قاعدة الخريطة الحية/الحرارية في DSH.

Allowed files:
- dsh/SERVICE_BLUEPRINT.md
- dsh/docs/UI_UX_FLOW_CLOSURE_MATRIX.md
- dsh/frontend/control-panel/operations/GeoHeatmapScreen.tsx
- dsh/frontend/control-panel/operations/geo-heatmap.preview-data.ts
- dsh/frontend/control-panel/operations/operations.registry.ts
- dsh/frontend/app-captain/**/*.tsx
- dsh/frontend/app-captain/**/*.ts
- dsh/frontend/control-panel/shared/*.ts
- dsh/frontend/control-panel/shared/*.tsx
- ui-kit/src/web/control-surface.tsx

Required:
1) Control Panel operations:
   - live operational dispatch map allowed.
   - focus: orders + captain presence + store pressure + commitment risk + zone load.
2) App Captain:
   - captain-scoped map allowed only if flow requires.
   - show only current captain task context:
     route to store, route to customer, assigned order, pickup/delivery proof.
3) App Client:
   - no heatmap.
   - only order tracking if needed.
4) App Partner:
   - no heatmap.
   - only own store queue/readiness.
5) App Field:
   - no heatmap.
   - only assigned visit/store context.
6) Remove or reclassify any wrong heatmap references in app-client/app-partner/app-field.
7) No map SDK.
8) No dependency.
9) No admin-only data inside app-captain.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- heatmap placement audit
- no-wrong-heatmap evidence
- verification output
```

---

## COMMAND C2 — Control Panel Viewport + Whitespace Fix

```text
Execute control-panel viewport and whitespace fixes only. Preserve current visual design as much as possible.

Repo: C:\bthwani-suite

Scope:
- ui-kit/src/web/control-surface.tsx
- ui-kit/src/web/command-center.tsx
- control-panel/shell
- dsh/frontend/control-panel/**/*.tsx
- dsh/frontend/control-panel/**/*.css

Required:
1) Detect and fix desktop internal scroll sources in control-panel workbenches.
2) Detect and fix giant empty-space causes:
   - minHeight 400px
   - hero/landing block
   - oversized card with little content
   - queue without inspector/detail
3) Preserve current design vocabulary.
4) Do not invent new visual system.
5) Use ui-kit control-panel primitives where already available.
6) Each control-panel section should fit desktop viewport via:
   - compact header
   - max 5 rows visible
   - compact pager
   - inspector/detail panel
   - tabs/chips
7) No route changes.
8) No backend/API/runtime.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- removed scroll sources
- removed whitespace sources
- visual risk notes
- verification output
```

---

## COMMAND C3 — Functional Tabs and Duplicate Content Closure

```text
Execute tabs/filters duplicate-content closure only.

Repo: C:\bthwani-suite

Scope:
- dsh/frontend/control-panel/dashboard
- dsh/frontend/control-panel/operations
- dsh/frontend/control-panel/finance
- dsh/frontend/control-panel/support
- dsh/frontend/control-panel/catalogs
- dsh/frontend/control-panel/partners
- dsh/frontend/control-panel/marketing
- dsh/frontend/control-panel/control

Required:
1) Every primary tab changes content/view.
2) Every secondary tab changes visible rows, filter, or inspector context.
3) Every tertiary filter changes results.
4) No duplicate content between tabs.
5) No placeholder "قريباً".
6) No English user-facing labels.
7) Do not redesign.
8) Do not move files.
9) Do not add route pages.
10) Use existing preview typed rows if no backend data.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- tab coverage table:
  section | primary tabs | secondary tabs | tertiary filters | all functional yes/no
- duplicate content removed
- verification output
```

---

## COMMAND C4 — Four Apps UI/UX/Flow Closure Without Tree Rewrite

```text
Execute actor-app UI/UX/Flow closure only. Do not restructure folders.

Repo: C:\bthwani-suite

Scope:
- dsh/frontend/app-client
- dsh/frontend/app-partner
- dsh/frontend/app-captain
- dsh/frontend/app-field
- dsh/frontend/shared

Required:
1) app-client:
   - discovery
   - store/products
   - cart
   - checkout
   - order tracking
   - support
   - rating
   - no heatmap
2) app-partner:
   - orders queue
   - accept/reject
   - preparation
   - ready for pickup
   - item issue
   - store readiness
   - catalog/inventory
   - no heatmap
3) app-captain:
   - offers
   - accept/reject
   - order details
   - route to store
   - arrived at store
   - pickup
   - route to customer
   - delivery
   - proof upload
   - support/chat
   - captain-scoped map only if required
4) app-field:
   - store activation
   - visit
   - evidence
   - issue report
   - escalation
   - no heatmap
5) Each screen:
   - primary action one clear action
   - secondary action limited
   - loading/empty/error/disabled/success where applicable
   - RTL correct
   - no duplicate content
6) Preserve current design.
7) No folder tree rewrite.
8) No backend/API/runtime.
9) No deep imports between apps/control-panel.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files grouped by app
- flow coverage by app
- heatmap scope confirmation
- verification output
```

---

## COMMAND C5 — Language / RTL / Visual Noise Closure

```text
Execute language/RTL/noise closure only.

Repo: C:\bthwani-suite

Scope:
- dsh/frontend/app-client
- dsh/frontend/app-partner
- dsh/frontend/app-captain
- dsh/frontend/app-field
- dsh/frontend/control-panel
- ui-kit/src/web
- control-panel/shell

Required:
1) Remove or translate visible English:
   Geo, Hub, Core, Live, Manual, Crew, Stores, Capacity, Risk, Proof,
   Open operations, Loading operations preview, Nothing to show yet,
   delayed pickups, pressure, owner surface, Support queue,
   Dashboard, Finance, Marketing, Catalogs, Partners when user-facing.
2) Replace visible SLA with:
   - الالتزام
   - زمن الالتزام
   - مخاطر الالتزام
3) Remove control-panel emoji icons.
4) Remove premiumGlass/glass/glow/purple/#8b5cf6 from control-panel.
5) RTL:
   - text right
   - icon + label together
   - action opposite
   - rail right
   - no horizontal overflow
6) Preserve current design intent.
7) No backend/API/runtime.

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- changed files
- terms replaced
- RTL fixes
- verification output
```

---

## COMMAND C6 — Anti-Bloat and Boundary Gate

```text
Inspect and fix only boundary/bloat regressions.

Repo: C:\bthwani-suite

Scope:
- dsh/frontend
- ui-kit/src
- control-panel/shell

Required checks:
1) no Tamagui outside ui-kit
2) no export *
3) no new any/as any
4) no local design system outside ui-kit
5) no DSH domain data inside ui-kit
6) no deep imports between actor apps and control-panel
7) no false runtime claim
8) no admin heatmap in app-client/app-partner/app-field
9) no fleet/admin intelligence in app-captain
10) no duplicated screen/file classification
11) no unnecessary new folders
12) no dead imports
13) no zero-byte placeholder screens
14) no archive/current truth conflict

Allowed fix:
- small fixes only
- no redesign
- no move/rename/delete unless zero-consumer proof is explicit in report
- no backend/API/runtime

Run:
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit

Return:
- PASS/BLOCKED per check
- changed files
- remaining risks
- verification output
```

---

# PHASE D — Evidence and Closure

## COMMAND D0 — Final Evidence ZIP

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Continue"
$RunId = "BTHWANI_DSH_ZERO_BASELINE_FINAL_GATE-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$Out = Join-Path "tools\registry\runs" $RunId
New-Item -ItemType Directory -Force -Path $Out | Out-Null

git --no-pager branch --show-current | Tee-Object -FilePath (Join-Path $Out "00_branch.txt")
git rev-parse HEAD | Tee-Object -FilePath (Join-Path $Out "00_head.txt")
Get-Content .\pnpm-workspace.yaml | Tee-Object -FilePath (Join-Path $Out "00_workspace.txt")
git --no-pager status --short | Tee-Object -FilePath (Join-Path $Out "01_git_status_short.txt")
git --no-pager diff --stat | Tee-Object -FilePath (Join-Path $Out "02_git_diff_stat.txt")
git --no-pager diff --name-status | Tee-Object -FilePath (Join-Path $Out "03_git_name_status.txt")
git --no-pager diff --check | Tee-Object -FilePath (Join-Path $Out "04_git_diff_check.txt")
pnpm -w exec tsc --noEmit *> (Join-Path $Out "05_tsc_noemit.txt")

$Roots = @(
  "governance",
  "ui-kit\src",
  "control-panel\shell",
  "dsh\frontend\app-client",
  "dsh\frontend\app-partner",
  "dsh\frontend\app-captain",
  "dsh\frontend\app-field",
  "dsh\frontend\control-panel",
  "dsh\frontend\shared"
)

$Files = Get-ChildItem -Path $Roots -Recurse -Include *.ts,*.tsx,*.css,*.md -File -ErrorAction SilentlyContinue

$Checks = @(
  @{ name = "tamagui_outside_uikit"; pattern = "from ['\" + '"' + "]tamagui['\" + '"' + "]|from ['\" + '"' + "]@tamagui"; expectZero = $true },
  @{ name = "export_star"; pattern = "export\s+\*"; expectZero = $true },
  @{ name = "any_usage"; pattern = "\bas\s+any\b|:\s*any\b"; expectZero = $true },
  @{ name = "false_runtime_claims"; pattern = "runtime truth|production-like truth|CONNECTED_RUNTIME|LIVE_BINDING"; expectZero = $true },
  @{ name = "visible_english_terms"; pattern = "Open operations|Loading operations preview|Nothing to show yet|delayed pickups|pressure|owner surface|Support queue|Dashboard|Finance|Marketing|Catalogs|Partners|Geo|Hub|Core|Live|Manual|Crew|Stores|Capacity|Risk|Proof"; expectZero = $true },
  @{ name = "old_visual_noise"; pattern = "premiumGlass|glass|glow|purple|#8b5cf6|🎧|💰|⚙️"; expectZero = $true },
  @{ name = "control_panel_scroll_x"; pattern = "overflow-x\s*:\s*auto|overflow-x\s*:\s*scroll"; expectZero = $true },
  @{ name = "control_panel_scroll_y"; pattern = "overflow-y\s*:\s*auto|overflow-y\s*:\s*scroll"; expectZero = $true },
  @{ name = "large_empty_space"; pattern = "minHeight:\s*['\" + '"' + "]?400px|min-height:\s*400px|hero|Hero|قريباً"; expectZero = $true }
)

$Audit = foreach ($c in $Checks) {
  $matches = $Files | Select-String -Pattern $c.pattern -ErrorAction SilentlyContinue
  [pscustomobject]@{
    check = $c.name
    count = @($matches).Count
    status = if ($c.expectZero -and @($matches).Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
    sample = (@($matches) | Select-Object -First 20 | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
  }
}

$Audit | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $Out "06_static_audit.json")
$Audit | Format-Table -AutoSize | Tee-Object -FilePath (Join-Path $Out "06_static_audit_table.txt")

$HeatmapFiles = $Files | Select-String -Pattern "heatmap|Heatmap|خريطة حرارية|خريطة حية|MapCanvas|MapPin|RouteLine" -ErrorAction SilentlyContinue

$ForbiddenHeatmap = $HeatmapFiles | Where-Object {
  $_.Path -match "\\dsh\\frontend\\app-client\\" -or
  $_.Path -match "\\dsh\\frontend\\app-partner\\" -or
  $_.Path -match "\\dsh\\frontend\\app-field\\"
}

$AdminLeakInCaptain = $Files | Where-Object { $_.Path -match "\\dsh\\frontend\\app-captain\\" } |
  Select-String -Pattern "all captains|fleet|zone load|admin|operator|control-panel|أسطول|كل الكباتن|ضغط المناطق|لوحة التحكم" -ErrorAction SilentlyContinue

$HeatmapAudit = @(
  [pscustomobject]@{
    check = "forbidden_heatmap_in_client_partner_field"
    count = @($ForbiddenHeatmap).Count
    status = if (@($ForbiddenHeatmap).Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
    sample = (@($ForbiddenHeatmap) | Select-Object -First 20 | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
  },
  [pscustomobject]@{
    check = "admin_or_fleet_leakage_in_captain"
    count = @($AdminLeakInCaptain).Count
    status = if (@($AdminLeakInCaptain).Count -eq 0) { "PASS" } else { "FIX_REQUIRED" }
    sample = (@($AdminLeakInCaptain) | Select-Object -First 20 | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line.Trim())" }) -join "`n"
  }
)

$HeatmapAudit | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 (Join-Path $Out "07_heatmap_scope_audit.json")
$HeatmapAudit | Format-Table -AutoSize | Tee-Object -FilePath (Join-Path $Out "07_heatmap_scope_audit_table.txt")

git --no-pager diff -- . > (Join-Path $Out "LOCAL_CHANGE_REVIEW.patch")
git ls-files --others --exclude-standard > (Join-Path $Out "UNTRACKED_FILES.txt")

Compress-Archive -Path (Join-Path $Out "*") -DestinationPath (Join-Path $Out "$RunId.zip") -Force

Write-Host ""
Write-Host "AUDIT_FOLDER=$Out"
Write-Host "AUDIT_ZIP=$(Join-Path $Out "$RunId.zip")"
```

---

## Final Acceptance Matrix

Do not mark closed unless all gates are proven:

| Gate | Required |
|---|---:|
| Baseline readiness matrix generated | PASS |
| DSH screen/file inventory generated | PASS |
| Naming/classification plan generated | PASS |
| No blind tree rewrite | PASS |
| `git diff --check` | 0 errors |
| `pnpm -w exec tsc --noEmit` | 0 errors |
| Tamagui outside ui-kit | 0 |
| export star | 0 |
| new `any/as any` | 0 |
| false runtime claim | 0 |
| visible English user-facing DSH UI | 0 |
| control-panel internal horizontal scroll | 0 |
| control-panel internal vertical scroll | 0 |
| large empty-space sources | 0 |
| heatmap in app-client | 0 |
| heatmap in app-partner | 0 |
| heatmap in app-field | 0 |
| admin/fleet heatmap leakage in app-captain | 0 |
| control-panel operations live map | visual proof |
| app-captain scoped map | visual proof if present/required |
| app-client flow coverage | PASS |
| app-partner flow coverage | PASS |
| app-captain flow coverage | PASS |
| app-field flow coverage | PASS |
| screenshots required | all relevant surfaces |

Allowed final decisions only:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

---

## Final operating conclusion

The correct next action is **not** a screen-tree refactor.  
The correct next action is:

```text
A0 → A10
then B0 → B2
then C0 → C6 only where evidence proves the gap
then D0
```

React Compiler, Go backend, API binding, Docker, database, observability, and production readiness remain blocked until their readiness audits pass and the user approves a separate narrow implementation task.

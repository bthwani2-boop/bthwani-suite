# BThwani / DSH — Mandatory Baseline Readiness Guards Addendum

**Purpose:** This addendum must be inserted before the zero-based DSH frontend review/closure commands.  
**Reason:** The DSH frontend closure cannot be treated as a screen-tree/UI task only. The project baseline requires readiness checks for React/Next/Expo/Nx/Tamagui, CSS/HTML/RTL/A11y, ui-kit authority, Screen/Flow/Binding/Integration contracts, Go/backend foundation, API/domain/data safety, security/privacy, runtime/ops/release, and evidence governance.

---

## Correct Interpretation

Do **not** activate React Compiler, Go backend, API binding, database, Redis/Valkey, Docker runtime, observability stack, or production tooling directly from this list.

The practical decision is:

```text
Readiness audit first → CHECK / Guard / Contract → narrow implementation only after evidence.
```

This addendum converts the practical baseline into executable AI-agent commands.

---

## Mandatory Placement in the DSH Closure Plan

Run these commands **before** the zero-based DSH screen/file restructuring commands:

1. `BASELINE-00` — Current Stack + Governance Reality Audit
2. `BASELINE-01` — Frontend / React / Next Readiness Audit
3. `BASELINE-02` — CSS / HTML / RTL / A11y Readiness Audit
4. `BASELINE-03` — UI Kit / Tamagui / Design Authority Audit
5. `BASELINE-04` — Screen / Flow / Binding / Integration Contract Audit
6. `BASELINE-05` — Go / Backend Foundation Audit Only
7. `BASELINE-06` — API / Domain / Data Safety Gap Audit
8. `BASELINE-07` — Security / Privacy / Compliance Audit
9. `BASELINE-08` — Runtime / Ops / Release Readiness Audit
10. `BASELINE-09` — AI / Governance / Evidence Guard Audit
11. `BASELINE-10` — Consolidated Baseline Readiness Matrix

After these are done, continue with DSH zero-based screen/file inventory and UI/UX/Flow correction.

---

# BASELINE-00 — Current Stack + Governance Reality Audit

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

# BASELINE-01 — Frontend / React / Next Readiness Audit

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

# BASELINE-02 — CSS / HTML / RTL / A11y Readiness Audit

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

# BASELINE-03 — UI Kit / Tamagui / Design Authority Audit

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

# BASELINE-04 — Screen / Flow / Binding / Integration Contract Audit

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

# BASELINE-05 — Go / Backend Foundation Audit Only

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

# BASELINE-06 — API / Domain / Data Safety Gap Audit

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

# BASELINE-07 — Security / Privacy / Compliance Audit

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

# BASELINE-08 — Runtime / Ops / Release Readiness Audit

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

# BASELINE-09 — AI / Governance / Evidence Guard Audit

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

# BASELINE-10 — Consolidated Baseline Readiness Matrix

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

## Final Decision Rule

After this addendum, the DSH zero-based frontend review must not start from a screen tree. It must start from:

```text
Current branch discovery
→ baseline readiness audits
→ DSH file/screen inventory
→ naming/classification proposal
→ narrow UI/UX/Flow fixes
→ visual evidence
→ patch/evidence review
```

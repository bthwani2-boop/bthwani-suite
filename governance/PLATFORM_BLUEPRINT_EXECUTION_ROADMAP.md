---
generatedFrom: governance/PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md
generatedAt: 2026-04-30T04:48:37.8317776+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Extracted Legacy Governance — PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md

Status: LEGACY_EXTRACTED_CANONICAL_REVIEW
Source: `docs/governance/PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md`
Source SHA256: `f657d82ef788d87174d7392e0d2cfb9887df95c26b1201eb51cbb0d05fe7713f`
Extraction session: `FIX_LEGACY_EXTRACTED_METADATA_SAFE-20260429-220722`

## Extraction Rule

This file preserves rich content from docs/governance/ before the legacy root is deleted later.

This is not final canonical policy by itself. Any rule inside this extracted file must be promoted explicitly into a canonical governance file before it becomes active truth.

---
# PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md

**Version:** 2.0 regenerated-final
**Date:** 2026-04-29
**Repository:** `bthwani2-boop/bthwani-suite`
**Canonical local target:** `C:\bthwani-suite`
**Execution mode:** READ-ONLY execution roadmap. This file defines the sequence; it does not modify the repository.

---

## 0. Execution Philosophy

BThwani must be closed through evidence-based phases, not broad prompts or scattered screen edits.

Rules:

```text
No assumptions.
No blind delete.
No blind replace.
No repo-wide rewrite.
No local design systems.
No screens in apps.
No service bodies in app-shells.
No direct screen-to-backend.
No API/binding before contract truth.
No CLOSED without evidence.
```

Every phase must include:

```text
Goal
Scope
Inputs
Forbidden
CHECK
FORENSICS
APPLY
VERIFY
Evidence output
Acceptance criteria
Rollback strategy
Definition of Done
BLOCKED conditions
```

---

## Phase 0 — Repo Truth and Baseline

### Goal

Prove branch, workspace, scripts, package reality, and current state.

### Scope

```text
C:\bthwani-suite
package.json
pnpm-workspace.yaml
nx.json
apps
packages
services
contracts
governance
docs/governance
tools
```

### Forbidden

```text
No edits
No commits
No branch creation
No PR
No deletion
No rename
No APPLY
```

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git --no-pager status --short
git --no-pager log --oneline -n 20
git branch --list
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### FORENSICS

Produce:

```text
branch-reality-report.md
repo-baseline-report.md
workspace-map.md
scripts-inventory.md
tooling-report.md
```

### Evidence output

```text
tools/registry/runs/{SESSION_ID}/phase-0
```

### Definition of Done

- Active branch proven.
- Workspace scope proven.
- Baseline status captured.
- No APPLY performed.

### BLOCKED if

- Branch cannot be proven.
- TypeScript cannot run and reason is not captured.
- Workspace files cannot be read.

---

## Phase 1 — Governance and SSoT Cleanup

### Goal

Reconcile `governance` and `docs/governance`.

### Scope

```text
governance
docs/governance
.github
tools/scripts
README/docs
```

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File governance,docs\governance,.github,tools -ErrorAction SilentlyContinue |
  Select-Object FullName
```

### FORENSICS

Produce:

```text
governance-inventory.md
governance-duplicates.md
governance-conflicts.md
legacy-policy-map.md
ssot-decision-log.md
```

### APPLY

Allowed only after proof:

- Move canonical standards to `governance`.
- Mark `docs/governance` transitional/deprecated.
- Update references.
- Preserve history and avoid breaking links.

### VERIFY

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### Definition of Done

- One canonical SSoT.
- Transitional docs classified.
- Evidence root fixed.
- No conflicting policy remains unclassified.

---

## Phase 2 — Architecture and Ownership Lock

### Goal

Lock ownership before UI/Flow/API work.

### Scope

```text
apps/*
packages/app-shells
packages/surfaces
packages/ui-kit
packages/api-types
packages/api-clients
contracts
services
```

### Contract

```text
apps = shell/host only
app-shells = root/shell behavior
surfaces = screens/flows/experiences
ui-kit = reusable design authority
api-types = contract-derived types
api-clients = contract-derived clients
services = backend/domain
```

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx -Pattern "@bthwani|../|../../|fetch\(|process\.env|localhost|192\.168" -ErrorAction SilentlyContinue
```

### FORENSICS

Produce:

```text
app-shell-purity-report.md
app-shells-boundary-report.md
surfaces-boundary-report.md
ui-kit-authority-report.md
api-boundary-report.md
deep-imports-report.md
public-exports-report.md
shared-folder-governance-report.md
screen-file-model-report.md
orphan-dead-noise-report.md
```

### APPLY

- Move misplaced screens after owner proof.
- Replace private imports with public exports.
- Reclassify fragmented screens into parts.
- Do not delete until zero-consumer proof.

### VERIFY

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### Definition of Done

- Every package has a clear role.
- All boundary breaches classified.
- No private/deep import remains unclassified.

---

## Phase 3 — UI Kit and Design System Hardening

### Goal

Make `@bthwani/ui-kit` the only reusable design authority.

### Scope

```text
packages/ui-kit
packages/surfaces
packages/app-shells
apps
```

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx -Pattern "#0A2F5C|#FF500D|#[0-9A-Fa-f]{6}|StyleSheet|Button|Card|Header|TopBar|Tamagui" -ErrorAction SilentlyContinue
```

### FORENSICS

Produce:

```text
ui-kit-export-map.md
local-design-system-report.md
hardcoded-colors-report.md
component-duplication-report.md
rtl-helper-report.md
state-components-report.md
```

### APPLY

- Promote reusable components to UI Kit.
- Replace duplicate local UI.
- Keep Tamagui internal to UI Kit.
- Repair public exports.

### VERIFY

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run tamagui:check
```

### Definition of Done

- No reusable design family outside UI Kit.
- Brand palette uses tokens.
- RTL helpers centralized.
- UI Kit exports stable.

---

## Phase 4 — Apps and Surfaces Alignment

### Goal

Make apps shell-only and surfaces the owner of screens/flows.

### Apps

```text
app-client
app-partner
app-captain
app-field
control-panel
webapp
website
```

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File apps,packages\app-shells,packages\surfaces |
  Select-Object FullName
```

### FORENSICS

Produce per surface:

```text
<surface>-shell-report.md
<surface>-surface-map.md
<surface>-route-map.md
<surface>-service-consumption-report.md
```

### APPLY

- Move screen bodies out of apps.
- Move service screens to service-owned.
- Move general surface screens to surface-owned.
- Keep app-shells as shell/root only.

### VERIFY

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### Definition of Done

- Apps shell-only.
- App-shells contain no service bodies.
- Surfaces own screens/flows.
- Public exports stable.

---

## Phase 5 — Services Closure

### Goal

Close services as vertical slices, starting with DSH.

### Order

```text
1. DSH
2. WLT
3. ARB / AMN
4. KNZ
5. ESF / MRF / SND / KWD
```

### Required report per service

```text
SERVICE_CONTRACT.md
SURFACE_MATRIX.md
FLOW_MATRIX.md
GAP_MAP.md
SCREEN_MODEL_REPORT.md
OWNERSHIP_MATRIX.md
UI_UX_RTL_STATE_REPORT.md
CONTRACT_API_REPORT.md
BINDING_REPORT.md
INTEGRATION_REPORT.md
RUNTIME_REPORT.md
BACKEND_SERVICE_REPORT.md
SECURITY_REPORT.md
OBSERVABILITY_REPORT.md
TEST_REPORT.md
CLOSURE_PLAN.md
```

### DSH required closure

```text
customer discovery/order/payment/tracking
partner intake/prepare/handoff
captain pickup/delivery
field support if proven
control-panel operations/governance
WLT payment relation
contract/API/binding
security/audit
tests/E2E
```

### VERIFY

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:i18n-direction
pnpm run guard:i18n-direction:mobile-control-panel
```

### Definition of Done

- Every flow has owner path.
- Every P0 gap has decision.
- No service screen hidden in app/shell.
- API/binding status classified.

---

## Phase 6 — API / Contracts / Binding

### Goal

Close the contract-to-screen data path.

### Chain

```text
Contract/OpenAPI
→ Generated API Types
→ Generated API Clients
→ Binding Adapter / View Model
→ Surface Screen
```

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File contracts,packages,services -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match 'openapi|swagger|contract|api|client|types|schema|dto' } |
  Select-Object FullName
```

### FORENSICS

Produce:

```text
contract-authority-report.md
openapi-inventory-report.md
operation-id-stability-report.md
api-types-authority-report.md
api-clients-authority-report.md
binding-owner-map.md
direct-screen-api-report.md
runtime-provider-report.md
api-gap-map.md
```

### APPLY

- Add/repair contract operation.
- Regenerate API types/clients.
- Move direct API calls into binding adapter.
- Centralize runtime provider.
- Mark unsupported live flows as BLOCKED.

### VERIFY

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### Definition of Done

- Contract authority proven.
- API types/clients generated or classified.
- No screen owns backend URL/env.
- DSH P0 API/binding gaps closed or BLOCKED.

---

## Phase 7 — End-to-End Flows

### Goal

Verify full cross-surface flows.

### Flows

```text
onboarding
login/session
service discovery
store browse
cart
checkout
payment
wallet
order creation
partner acceptance
partner preparation
captain assignment
captain pickup
tracking
delivery
rating
support
refunds
notifications
admin monitoring
marketing approval
service activation
```

### FORENSICS

Produce:

```text
end-to-end-flow-map.md
cross-surface-transition-map.md
dsh-order-lifecycle-report.md
payment-wallet-flow-report.md
notification-support-flow-report.md
admin-monitoring-flow-report.md
```

### APPLY

One flow at a time only.

### VERIFY

```powershell
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```

### Definition of Done

- Every flow has entry, state, exit, owner.
- Every cross-surface transition has counterpart.
- Every P0 flow has test strategy.

---

## Phase 8 — Runtime / Build / Verification

### Goal

Make local runtime production-like and reproducible.

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
pnpm -w exec tsc --noEmit
pnpm nx run-many --target=build --projects=control-panel,webapp,website,app-client,app-partner,app-captain,app-field --parallel=7
```

### FORENSICS

Produce:

```text
runtime-provider-map.md
environment-report.md
build-report.md
mobile-dev-client-report.md
web-runtime-report.md
port-risk-report.md
fixture-runtime-report.md
```

### Definition of Done

- Runtime modes documented.
- Build status known.
- Mobile dev-client path canonical.
- No hidden fixture dependency.
- No hardcoded LAN/IP in production path.

---

## Phase 9 — Quality Gates

### Gates

```text
Scope Gate
Branch Reality Gate
Path Gate
Import/Export Gate
TypeScript Gate
Design Authority Gate
RTL Gate
State Coverage Gate
API Contract Gate
Binding Gate
Integration Gate
Runtime Gate
Security Gate
Test Gate
No Duplication Gate
No Legacy Drift Gate
Evidence Gate
```

### Required commands

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm run guard:i18n-direction
pnpm run guard:i18n-direction:mobile-control-panel
```

### Definition of Done

- Every gate is DONE/BLOCKED.
- Every BLOCKED item has owner and next action.
- No skipped gates.

---

## Phase 10 — Security / RBAC / Privacy / Audit

### Goal

Protect customer, partner, captain, field, admin, payment, and control-panel actions.

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx,.\**\*.json -Pattern "auth|role|permission|rbac|abac|secret|token|audit|privacy|mask|webhook|rate" -ErrorAction SilentlyContinue
```

### FORENSICS

Produce:

```text
security-surface-map.md
role-permission-matrix.md
dsh-action-permission-matrix.md
payment-security-report.md
control-panel-audit-report.md
secrets-leakage-report.md
privacy-masking-report.md
```

### Definition of Done

- Every mutation has authorization classification.
- Payment/WLT has security gate.
- Control-panel actions audited.
- No secret-like string remains unclassified.

---

## Phase 11 — Observability / Monitoring / Incident Readiness

### Goal

Make production diagnosis possible.

### FORENSICS

Produce:

```text
observability-map.md
critical-event-map.md
error-boundary-report.md
health-check-report.md
incident-runbook.md
monitoring-gap-map.md
```

### Definition of Done

- P0 flows observable.
- Errors map to UI states.
- Runtime health known.
- Incident runbook exists.

---

## Phase 12 — Testing / E2E / Visual / RTL

### Goal

Prove behavior.

### Layers

```text
static
typecheck
unit
contract
binding
integration
E2E
visual
RTL
accessibility
performance smoke
```

### Minimum DSH tests

```text
client checkout happy path
client checkout failure path
payment disabled/unavailable/insufficient
partner accept/reject
partner ready
captain pickup/delivery
control-panel monitor/intervention
WLT/payment relation
RTL smoke
offline/error/empty states
```

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Get-ChildItem -Recurse -Force -File . |
  Where-Object { $_.Name -match 'test|spec|e2e|playwright|jest|vitest|detox|maestro|a11y' } |
  Select-Object FullName
```

### Definition of Done

- Test runner identified or `[TBD]`.
- P0 flows have test path.
- No production closure without E2E strategy.

---

## Phase 13 — Performance / Accessibility / Quality

### Goal

Ensure speed, accessibility, and quality.

### CHECK

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
Select-String -Path .\**\*.ts,.\**\*.tsx -Pattern "accessibilityLabel|aria-|FlatList|ScrollView|Image|memo|useMemo|useCallback|lazy|Suspense" -ErrorAction SilentlyContinue
```

### Reports

```text
performance-risk-report.md
accessibility-report.md
mobile-list-performance-report.md
media-loading-report.md
quality-gate-report.md
```

### Definition of Done

- Large lists classified.
- Critical controls accessible.
- Media fallback exists.
- No P0 performance trap.

---

## Phase 14 — Production Readiness and Final Closure

### Goal

Decide GO/BLOCKED.

### Commands

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git branch --show-current
git --no-pager status --short
git --no-pager diff --check
pnpm -w exec tsc --noEmit
pnpm nx run-many --target=build --projects=control-panel,webapp,website,app-client,app-partner,app-captain,app-field --parallel=7
```

### Final reports

```text
production-readiness-report.md
release-risk-register.md
rollback-plan.md
deployment-config-report.md
operator-runbook.md
final-go-no-go-report.md
```

### CLOSED definition

`CLOSED` is allowed only if:

- Branch reality proven.
- Working tree understood.
- TypeScript passes.
- Builds pass or blockers documented.
- UI/UX/Flow closed.
- API/contract/binding closed.
- Runtime/backend/data status closed or out of scope with evidence.
- Security gates pass.
- Observability exists.
- Tests/E2E strategy exists.
- Rollback exists.
- Evidence pack complete.

If any condition fails:

```text
FINAL_STATUS: BLOCKED
```

---

## Master Deliverables

```text
PLATFORM_BLUEPRINT.md
PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md
branch-reality-report.md
platform-ownership-matrix.md
surface-service-matrix.md
dsh-flow-matrix.md
dsh-gap-map.md
ui-kit-authority-report.md
contract-api-report.md
binding-report.md
integration-report.md
runtime-report.md
security-report.md
test-report.md
production-readiness-report.md
```

---

## Final Rule

The execution order is:

```text
Truth
→ Ownership
→ Flow
→ Gap
→ Screen Model
→ UI/UX/RTL/State
→ Cleanup
→ Contract/API
→ Binding
→ Integration
→ Runtime
→ Backend/Data
→ Security
→ Observability
→ Testing
→ Performance/Accessibility
→ Production
→ Evidence
```

No shortcut is valid without evidence.


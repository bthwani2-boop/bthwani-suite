# BThwani Platform Blueprint

**Status:** Canonical Governance Support Blueprint
**Owner:** `Platform Governance Synthesis`

## Purpose

This file is the single platform-wide execution blueprint for continuing BThwani development across the current governance package.

It combines platform-wide operating law with DSH baseline-readiness discipline into one current file.

It owns:

- cross-owner execution order,
- baseline sequencing before implementation,
- the DSH-first continuation model,
- allowed-versus-blocked advancement rules,
- and the minimum proof needed before platform claims move forward.

It does not replace the numbered governance owner files, and it must not duplicate `.agents/` execution instructions or `tools/guards/` implementation details.

## What this file decides

- the order in which platform work may proceed,
- the baseline readiness program required before deeper implementation,
- the minimum DSH-first delivery sequence,
- the recommended service-expansion order after DSH,
- the cross-file proof required before stronger readiness claims.

## What this file does not decide

- service-specific truth already owned by `{service}/SERVICE_BLUEPRINT.md`,
- agent prompts, skills, or adapters,
- guard implementation logic,
- raw OpenAPI text, generated clients, or runtime code,
- branch-local completion claims without evidence.

## Non-negotiable platform facts

- Local repo root is `C:\bthwani-suite`.
- `governance/` decides policy, scope, acceptance, and decision vocabulary.
- `.agents/` executes agent behavior and adapters; it does not redefine governance policy.
- Root adapters connect external tooling back to `.agents/`.
- `tools/guards/` verifies policy programmatically; it does not invent policy.
- `tools/registry/runs/{SESSION_ID}/` stores evidence and historical review output.
- BThwani is a multi-service modular-monolith monorepo.
- Apps and surfaces are shells; services own service truth.
- `@bthwani/ui-kit` owns design authority; Tamagui is internal to ui-kit only.
- WLT is the only financial truth path.
- Backend target is Go, but backend implementation remains blocked until baseline, contract, and slice approval exist.
- DSH is the first golden slice and the first full multi-surface closure target.

## Cross-owner authority map

| Topic | Canonical owner |
|---|---|
| platform truth and service catalog | `02_PLATFORM_SSOT.md` |
| roots, boundaries, and retired paths | `03_REPO_BOUNDARIES.md` |
| architecture placement and ownership | `04_ARCHITECTURE_RULES.md` |
| package boundaries and public exports | `05_PACKAGE_BOUNDARIES.md` |
| app and shell boundaries | `06_APPS_AND_SHELLS.md` |
| surfaces and services | `07_SURFACES_AND_SERVICES.md` |
| ui-kit, brand, and RTL | `08_UI_KIT_AND_BRAND.md` |
| contracts, binding, and runtime | `09_API_BINDING_RUNTIME.md` |
| service closure protocol | `10_SERVICE_CLOSURE.md` |
| evidence and traceability | `11_EVIDENCE_AND_TRACEABILITY.md` |
| testing and production readiness | `12_TESTING_AND_PRODUCTION_READINESS.md` |
| CI and gating behavior | `13_CI_AND_GATES.md` |
| guard catalog | `14_GUARDS_CATALOG.md` |
| agent-execution boundaries | `15_AGENT_AND_AI_EXECUTION.md` |
| security and secrets | `16_SECURITY_AND_SECRETS.md` |
| branch and checkpoint rules | `18_BRANCH_AND_CHECKPOINTS.md` |
| control-panel operating model | `19_CONTROL_PANEL_AND_OPERATING_MODEL.md` |
| mutable policy and provider control | `20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md` |
| DSH golden-slice acceptance | `22_DSH_GOLDEN_SLICE.md` |
| warnings and false positives | `23_WARNINGS_AND_FALSE_POSITIVES.md` |
| roadmap and traceability discipline | `24_TRACEABILITY_AND_ROADMAP.md` |
| target stack and backend direction | `TECH_STACK_LOCK.md` |
| historical source accounting | `99_LEGACY_MERGE_LEDGER.md` |

This file coordinates those owners. It must not silently override them.

## Current workspace truth

### Active roots from `pnpm-workspace.yaml`

```text
webapp/runtime
website/runtime
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
ui-kit
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

### Active surface fleet

```text
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
webapp/runtime
website/runtime
```

### Active service fleet

```text
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

### Retired or non-canonical patterns

- `docs/governance` as active authority
- retired GitHub-side agent roots
- nested mobile/web roots from older layouts
- `packages/*` as the active surface/app-shell truth
- any path not proven by the current branch and `pnpm-workspace.yaml`

If a path appears in planning material but is not proven in the current branch, classify it as `STALE_PATH`, `DONOR_ONLY`, or `NEEDS_EVIDENCE` before any mutation.

## Platform continuation doctrine

1. Do not treat "finish the platform" as one giant implementation batch.
2. Work by governed vertical slices, not by uncontrolled parallel expansion.
3. Close DSH first because it proves multi-surface behavior, WLT financial boundaries, control-panel operations, and evidence discipline.
4. No UI, API, backend, or runtime work may outrun its inventory and owner map.
5. No contract expansion without a screen/flow need and a documented gap.
6. No binding expansion without an approved contract boundary.
7. No backend or database work before the slice is contract-bound and runtime intent is clear.
8. No production or closure claim without evidence.
9. Do not split this blueprint back into parallel platform and DSH-baseline governance files.

## Mandatory execution ladder

1. Reality check.
   Confirm branch, worktree, active roots, touched owners, and whether the task is platform-wide, service-specific, surface-specific, runtime-specific, or governance-only.
2. Baseline readiness.
   Complete the relevant baseline tracks in this file before deeper implementation.
3. Service and surface inventory.
   Confirm or update the service blueprint, surface matrix, screen matrix, flow matrix, state model, and owner paths.
4. UI/UX/flow closure.
   Fix route purpose, CTA clarity, state coverage, RTL, ui-kit authority, and shell-versus-service ownership.
5. Contract and gap approval.
   Only now expand Screen/API Matrix, Gap Map, and OpenAPI when the gap is proven.
6. Typed binding.
   Bind one bounded slice through approved clients or contract boundaries.
7. Runtime proof.
   Verify live or dev behavior for the slice, including failure and recovery where relevant.
8. Backend and data implementation.
   Only after the relevant baseline, contract, and slice gates are satisfied.
9. Security and release hardening.
   RBAC, privacy, audit, observability, rollback, and readiness discipline.
10. Evidence and decision.
    Produce the evidence pack, classify remaining risks, and return one canonical decision only.

No stage may leapfrog earlier stages by convenience.

## Baseline readiness program

One central fact is non-negotiable: DSH closure must not start from a screen tree alone.

The correct baseline program is below. Each track must produce inspectable output before the next higher-risk category becomes allowed.

| Track | What it proves | Primary owner files | Required output | Unlocks | Still blocked after this track |
|---|---|---|---|---|---|
| `B00` current stack and governance reality | current roots, current framework reality, target-stack reality, and owner-file alignment are understood | `03`, `15`, `TECH_STACK_LOCK.md`, `02` | baseline reality matrix | narrow planning and scope selection | dependency changes, stack migration, implementation by assumption |
| `B01` frontend, React, Next, Expo readiness | current frontend and web/mobile runtime posture is known | `08`, `12`, `19`, `TECH_STACK_LOCK.md` | readiness findings plus guard recommendations | UI/UX work on confirmed roots | React Compiler activation, broad Next config changes, global framework experiments |
| `B02` CSS, HTML, RTL, accessibility readiness | logical CSS, semantics, direction, and screenshot obligations are known | `08`, `12` | RTL/accessibility matrix plus required visual-evidence list | shared UI correction and visual review scope | broad style rewrites without inventory proof |
| `B03` ui-kit, Tamagui, and design authority | shared UI ownership, duplicate primitives, and Tamagui boundary violations are known | `08`, `15` | boundary and duplicate map | ui-kit consolidation planning and safe shared UI repair | Tamagui expansion, compiler activation, local design-system growth |
| `B04` screen, flow, binding, and integration contracts | each DSH surface can name screens, owners, routes, states, and binding needs | `10`, `22`, `09` | contract coverage matrix plus gap map | contract-only updates and bounded binding preparation | fake binding, route guessing, runtime jumps, API-by-assumption |
| `B05` Go and backend foundation | backend direction is governed as a foundation problem, not a coding shortcut | `TECH_STACK_LOCK.md`, `09`, `16` | Go foundation gap map | backend-foundation planning | Go code, DB migrations, workers, queues, API handlers |
| `B06` API, domain, and data safety | state machine, idempotency, money, time, versioning, and data-safety gaps are explicit | `09`, `10`, `20`, `02` | safety matrix | approved contract decisions and data-safety planning | backend/data implementation without approved slice proof |
| `B07` security, privacy, and compliance | auth, RBAC, PII, audit, upload, and rate-limit gaps are explicit | `16`, `12` | security blocker matrix | scoped hardening backlog | production-readiness claims, exposure of sensitive flows |
| `B08` runtime, ops, and release readiness | runtime evidence, rollback, config, monitoring, and release discipline are explicit | `12`, `13`, `19` | runtime readiness matrix | scoped runtime work and release planning | Docker/observability/prod rollout by default |
| `B09` AI, governance, evidence, and guards | scope control, guard coverage, and evidence discipline are explicit | `11`, `14`, `15`, `18` | guard and evidence plan | safe agent-assisted delivery | policy invention inside `.agents/` or `tools/guards/` |
| `B10` consolidated readiness matrix | the prior tracks are combined into one platform decision set | `11`, `12`, `14`, `22`, `24` | one consolidated readiness matrix with next-safe actions | first safe implementation task selection | broad platform-wide activation without bounded slice approval |

## DSH-first continuation program

DSH remains the first proof service because it exercises the widest cross-surface operating chain:

- customer discovery and ordering,
- partner acceptance and preparation,
- captain assignment and delivery execution,
- field onboarding and operational readiness,
- control-panel monitoring and intervention,
- WLT-backed payment and settlement boundaries.

### DSH mandatory surfaces

| Actor | Surface | Minimum governed purpose |
|---|---|---|
| client | `app-client/runtime` | browse, cart, checkout, track, rate |
| partner | `app-partner/runtime` | receive, accept, prepare, manage store operations |
| captain | `app-captain/runtime` | accept task, pickup, deliver, prove completion |
| field | `app-field/runtime` | onboard, verify, and operationalize partner readiness |
| operator | `control-panel/runtime` | monitor, intervene, configure, and audit |
| finance | `control-panel/runtime` via WLT | monitor settlement, refund, reconciliation, and wallet-backed side effects |

### DSH minimum closure chain

```text
store discovery
store details
cart
checkout
payment decision through WLT
order creation
partner acceptance and preparation
captain assignment
pickup
delivery
completion and rating
refund or issue path
operations intervention
```

### DSH stage order

| Stage | Outcome | Required proof before moving on |
|---|---|---|
| `D1` inventory | all DSH screens, routes, sheets, states, and owner paths are known across all required surfaces | screen matrix and route inventory |
| `D2` flow contract | actor transitions, permissions, exits, and recovery states are explicit | flow matrix and permission map |
| `D3` UI/UX closure | state coverage, RTL, ui-kit authority, and shell/service ownership are corrected | screenshots, RTL review, owner proof |
| `D4` contract closure | Screen/API Matrix, Gap Map, and needed OpenAPI boundaries are explicit | contract and gap evidence |
| `D5` bounded binding | one approved flow chain is bound through typed client or approved interface | typecheck plus binding evidence |
| `D6` runtime proof | happy path, failure path, and recovery behavior are proven where in scope | runtime evidence and logs |
| `D7` operations proof | control-panel operation, audit trail, and rollback are explicit | operations matrix and evidence |
| `D8` WLT boundary proof | all DSH money-touching flows use WLT-owned truth only | WLT-linked evidence and no-violation proof |
| `D9` closure decision | DSH can claim gated advancement without fake completeness | evidence pack plus one canonical decision |

DSH closure is not achieved by finishing one app only. The governing proof is cross-surface.

## Recommended platform rollout after DSH

The recommended sequence below should be followed unless current repo evidence later proves a better order:

1. close DSH as the first golden slice across client, partner, captain, field, and control panel,
2. close the WLT financial path required by DSH money-touching flows,
3. close the DSH and WLT operational control-panel lanes, including audit and mutable policy handling,
4. advance `arb` and `amn` through one bounded vertical slice each,
5. advance `knz` only within WLT-approved financial boundaries when money becomes enabled,
6. expand community services (`esf`, `mrf`, `snd`, `kwd`) one service at a time under the established community-services model.

This order prevents the platform from expanding faster than its financial, operational, and evidence discipline.

## Allowed now

- governance cleanup, owner mapping, and cross-file sequencing work,
- service-blueprint and screen/flow/state inventory work,
- route, screen, and ownership classification,
- UI/UX/RTL/state closure in the current approved frontend stack,
- contract-gap identification and contract updates when justified by an approved gap,
- one bounded typed-binding slice after `B04` proof exists,
- runtime evidence for an already-approved bounded slice,
- ledger and evidence maintenance.

## Blocked until separate evidence-backed approval

- React Compiler activation,
- broad Next.js, Expo, or Nx configuration experiments,
- Tamagui expansion outside `ui-kit` or treating Tamagui as target architecture,
- Go handlers, DB tables, migrations, workers, or queue consumers before `B05` and `B06` are satisfied,
- Redis/Valkey, Docker runtime, observability stack, or release tooling as default work,
- financial behavior outside WLT,
- multi-service wide binding jumps,
- broad cleanup without owner and consumer proof,
- any claim that the platform is complete, production-ready, or fully closed without evidence.

## Exit criteria for stronger advancement claims

### DSH ready for deeper binding

Requires:

- `B00` through `B04`,
- DSH screen matrix,
- DSH flow matrix,
- DSH gap map,
- ui-kit and RTL proof for affected surfaces.

### DSH ready for backend slice implementation

Requires:

- one bounded flow with UI/UX closure,
- approved contract gap,
- `B05` and `B06` with no unresolved blocker for the slice,
- explicit WLT routing for any financial effect.

### Service ready for closure claim

Requires:

- service blueprint current,
- closure matrices current,
- relevant gates from `10`, `11`, `12`, `14`, and the service owner file satisfied,
- runtime evidence for enabled flows,
- no unresolved ownership contradiction.

### Platform ready to move beyond DSH-first mode

Requires:

- DSH closed across the governed surfaces,
- WLT financial path proven for DSH-origin financial flows,
- control-panel operations and audit paths proven for the enabled DSH/WLT actions,
- the baseline method shown to be reusable without ad-hoc rule invention.

## Evidence and decision discipline

Any material change driven by this blueprint must still obey:

- `11_EVIDENCE_AND_TRACEABILITY.md` for pack shape,
- `12_TESTING_AND_PRODUCTION_READINESS.md` for verification depth,
- `14_GUARDS_CATALOG.md` for enforceable checks,
- `15_AGENT_AND_AI_EXECUTION.md` for automation boundaries,
- `18_BRANCH_AND_CHECKPOINTS.md` for branch-state proof.

Minimum local proof remains:

```powershell
git --no-pager status --short
git --no-pager diff --check
```

When the task changes code, config, or runtime-relevant behavior, add the applicable typecheck, build, test, runtime, and screenshot evidence required by the owner files.

No decision language outside the canonical governance vocabulary is allowed.

## Canonical references

- `governance/02_PLATFORM_SSOT.md`
- `governance/03_REPO_BOUNDARIES.md`
- `governance/08_UI_KIT_AND_BRAND.md`
- `governance/09_API_BINDING_RUNTIME.md`
- `governance/10_SERVICE_CLOSURE.md`
- `governance/11_EVIDENCE_AND_TRACEABILITY.md`
- `governance/12_TESTING_AND_PRODUCTION_READINESS.md`
- `governance/14_GUARDS_CATALOG.md`
- `governance/15_AGENT_AND_AI_EXECUTION.md`
- `governance/19_CONTROL_PANEL_AND_OPERATING_MODEL.md`
- `governance/20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md`
- `governance/22_DSH_GOLDEN_SLICE.md`
- `governance/24_TRACEABILITY_AND_ROADMAP.md`
- `governance/TECH_STACK_LOCK.md`

## Final operating summary

```text
Platform work starts from current-root reality.
Baseline readiness comes before deep implementation.
DSH is the first full closure proof.
WLT is the only financial truth path.
ui-kit owns design authority.
Go is the backend target, not a default immediate implementation step.
Guards verify policy; they do not define it.
Evidence is required before stronger readiness claims.
This file is the single merged execution blueprint for platform continuation.
```

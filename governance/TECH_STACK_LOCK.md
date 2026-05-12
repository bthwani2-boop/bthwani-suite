# TECH STACK LOCK

## 1. Status

- Status: `CANONICAL GOVERNANCE DECISION`
- Scope: governance-only architecture lock
- Implementation state: `NOT STARTED`
- Migration state: `NOT COMPLETE`
- This file records the target BThwani stack and the rules for moving toward it.

## 2. Scope

This file governs the locked target technology stack for BThwani.

It applies to:

- backend platform choice
- frontend, mobile, and control-panel stack choice
- database and cache/queue direction
- AI/data language policy
- macro architecture direction

It does not authorize implementation work.

## 3. Canonical Target Stack

- Backend Core = Go
- Frontend = TypeScript + React + React Native + Expo + Next.js
- Database = PostgreSQL
- Cache/Queue = Valkey or Redis
- AI/Data = Python only when a proven AI/Data requirement exists; otherwise TBD/NEEDS_CONFIRMATION
- Architecture = Modular Monolith first, Services later by evidence

> [!NOTE]
> Docker Desktop and Docker Compose are classified as **Local Operating Tooling** (LOP). They are not approved as production architecture targets at this phase.

This is the target stack lock for future planning and controlled migration.

## 4. Current Branch Reality

The current repo and branch context still use:

- TypeScript
- React
- React Native
- Expo
- Next.js
- pnpm
- Nx

That current reality is acknowledged as existing branch state only.
It does not override the target stack in this document.

Tamagui may exist currently as a dependency in the repo.
That current dependency state is acknowledged, but Tamagui is not part of the target architecture.

## 5. Explicit Non-Goals

- Do not start implementation.
- Do not claim the migration is complete.
- Do not treat this file as code delivery.
- Do not remove Tamagui now.
- Do not change package managers, workspace layout, or repo shape as part of this lock.
- Do not introduce backend, API, worker, contract, client, or service code.
- Do not add runtime or platform configs for the target stack yet.

## 6. Migration Rules

1. Treat this file as the authoritative target-stack decision until superseded by a later governance decision with evidence.
2. Any future move toward the target stack must be staged and evidence-based.
3. Preserve current working frontend and workspace technologies until a specific migration step is approved.
4. Do not mix governance locking with implementation conversion.
5. Record each migration step only after the required evidence exists.

## 7. Tamagui Decision

Tamagui is classified here as:

- `CURRENT_DEPENDENCY`
- `DEPRECATED_TARGET`
- `FUTURE_REMOVAL_PLAN_REQUIRED`

Rules:

- Do not remove Tamagui now.
- Do not expand Tamagui usage as part of the target architecture.
- Do not treat Tamagui as a future target-stack component.
- Any eventual removal must be planned separately and justified by evidence.
- Tamagui is allowed only as a current internal `@bthwani/ui-kit` implementation dependency.
- Apps and services must not import Tamagui directly.
- Future removal or retention requires evidence.

## 8. Python AI/Data Decision

Python is not a default target-language commitment for the full stack.

Policy:

- Python is allowed only when a proven AI/Data requirement exists.
- Until that proof exists, Python remains `TBD/NEEDS_CONFIRMATION`.
- No AI/Data implementation work may start from this file alone.

## 9. Database and Cache Decision

Database policy:

- PostgreSQL is the locked database target.

Cache/queue policy:

- Valkey or Redis is the locked cache/queue target.
- **Target later by evidence**: Redis/Valkey are not required now and are not required for Smart Ticker v1.

Rules:

- Do not introduce PostgreSQL or Redis/Valkey code or configuration now.
- Do not infer a specific operational topology from this lock alone.
- Do not create database migrations, schemas, queue workers, or client bindings yet.

## 10. Modular Monolith First Rule

Architecture policy:

- Start with a Modular Monolith.
- Move to Services only later, and only by evidence.

Rules:

- Do not begin with service sprawl.
- Do not split ownership into services before the monolith evidence baseline exists.
- Service extraction requires explicit evidence that the split is justified.
- The default migration posture is consolidation first, decomposition later.

## 11. Evidence Requirements Before Implementation

Before any implementation begins, the following evidence is required:

1. A confirmed migration inventory for the affected domains.
2. A gap analysis showing current-state versus target-stack impact.
3. A scoped plan that names the smallest safe first step.
4. Proof that the step does not violate current governance or dependency constraints.
5. A separate decision for any Tamagui removal work.
6. A separate decision for any Python adoption work.
7. A separate decision for any database or cache configuration work.

Without this evidence, implementation remains blocked.

> [!IMPORTANT]
> This file alone does not authorize implementation. Implementation requires:
> 1. UI/UX/Flow gate PASS.
> 2. Screen/API Matrix + Gap Map.
> 3. OpenAPI Contract approval.
> 4. Approved vertical slice definition.

## 12. Forbidden Actions

- Do not edit any implementation file.
- Do not edit `package.json`.
- Do not edit `pnpm-workspace.yaml`.
- Do not edit `tsconfig.base.json`.
- Do not remove Tamagui.
- Do not create Go, Rust, Python, PostgreSQL, Redis, or Valkey code.
- Do not rename or move folders.
- Do not delete files.
- Do not modify dependencies or lockfiles.
- Do not perform broad refactors.
- Do not continue to another task.
- Do not claim target-stack completion from this governance lock.

## 13. Final Lock Summary

The BThwani target stack is locked as follows:

- Backend Core = Go
- Frontend = TypeScript + React + React Native + Expo + Next.js
- Database = PostgreSQL
- Cache/Queue = Valkey or Redis
- AI/Data = Python only when a proven AI/Data requirement exists; otherwise TBD/NEEDS_CONFIRMATION
- Architecture = Modular Monolith first, Services later by evidence

Current repo reality remains transitional and does not change this decision.
Tamagui remains a current dependency only, not a target-architecture commitment, and it requires a future removal plan before any elimination is approved.

---

## 14. Tooling Decision Table

This table defines the mandatory local toolset and the repo-level artifacts for the Local Operating Platform (LOP).

| Category | Item | Status | Rule |
|---|---|---|---|
| **Required Now** | Docker Desktop | Mandatory | Local Operating Tooling only. |
| | Go SDK | Mandatory | Backend core development. |
| | Git | Mandatory | Version control. |
| | Node.js | Mandatory | Frontend/Tooling runtime. |
| | pnpm | Mandatory | Package management. |
| | PowerShell | Mandatory | Scripting and verification. |
| **Repo-level (when approved)** | `docker-compose.local.yml` | Approved | Local runtime orchestration. |
| | OpenAPI YAML | Approved | Technical contract source. |
| | Swagger UI container | Approved | Contract visualization. |
| | PowerShell verify scripts | Approved | Automation and smoke testing. |
| **Conditional Later** | PostgreSQL | Conditional | Required for first persisted vertical slice. |
| | MinIO | Conditional | Required for media/banner storage. |
| | Redis/Valkey | Conditional | Required for proven cache/queue/pubsub needs. |
| **Not Now** | Postman / Newman | Forbidden | Do not add to repo or rely on for LOP-1. |
| | Kubernetes | Forbidden | Production orchestration is out of scope. |
| | Message Broker | Forbidden | RabbitMQ/Kafka are deferred. |
| | Notification Engine | Forbidden | Deferred. |
| | Analytics Engine | Forbidden | Deferred. |

---

## 15. Screen / UI / UX / Flow / Binding / Integration Baseline

**Governance-only. This section does not authorize implementation.**

Implementation state: `NOT STARTED`. No code, no routes, no dependencies, no runtime changes.

---

### 15.1 Current Structure Discovery Gate

Before any UI / UX / Flow / Binding / Integration work may begin, the following must be proven by reading the repository:

1. Read `pnpm-workspace.yaml` and confirm the active workspace packages.
2. Read each relevant `package.json` and confirm current framework versions.
3. Do not assume any path that has not been confirmed in the current branch.

**Retired path patterns — must not be used as active implementation scope:**

```text
apps/mobile/*
apps/web/*
packages/surfaces
packages/app-shells
packages/ui-kit
webapp
website
```

**Active verified paths — use only paths confirmed present in `pnpm-workspace.yaml`:**

```text
webapp/runtime
website/runtime
app-client/runtime
app-partner/runtime
app-captain/runtime
app-field/runtime
control-panel/runtime
ui-kit
dsh  |  wlt  |  knz  |  arb  |  amn  |  esf  |  mrf  |  snd  |  kwd
```

If a path appears in `pnpm-workspace.yaml` but the local directory does not exist, classify it as `STALE_OR_DISABLED_PATH` and exclude it from implementation scope.

---

### 15.2 Screen Flow Binding Integration Contract (SFBIC)

Every screen, navigation change, binding, or integration must have a contract before any implementation is approved. The contract must include:

| Field | Status |
|---|---|
| `screenId` | Required |
| `surface` | Required |
| `service` | Required or TBD |
| `ownerPath` | Required |
| `route` / `routeKey` | Required or N/A |
| `params` | Required |
| `entrypoints` | Required or TBD |
| `exits` | Required or TBD |
| `permissions` | Required for protected screens |
| `uiKitDependencies` | Required |
| `bindingInputs` | Required or TBD |
| `bindingOutputs` | Required or TBD |
| `integrationSource` | Required or TBD |
| `states` | `loading / empty / error / success / offline / disabled` |
| `rtlContract` | Required |
| `visualEvidence` | Required when UI changes |
| `verification` | Required |
| `status` | `CONFIRMED / GAP / TBD / BLOCKED` |

Unknown fields must be marked `TBD` — they must not be hidden.

---

### 15.3 Merge-Safe Rule

A screen or navigation/binding/integration change must not be merged unless:

- `ownerPath` is known.
- `route` and `params` are known or explicitly marked `TBD` with documented risk.
- `entrypoints` and `exits` are known or `TBD` with documented risk.
- `bindingInputs` and `bindingOutputs` are known or `TBD` with documented risk.
- `integrationSource` is known or `TBD` with documented risk.
- All required `states` (loading / empty / error / success / offline / disabled) are addressed.
- `git diff` is clean and `typecheck` has been run.
- Visual evidence is provided if the UI changed.

---

### 15.4 Execution Boundary

This file is a governance decision file. It locks stack and scope; it does not define agent prompts, tool skills, or implementation choreography.

- `governance/` decides stack, scope, and acceptance.
- `15_AGENT_AND_AI_EXECUTION.md` owns agent-execution boundaries.
- `.agents/` owns operational agent instructions and adapters.
- `tools/guards/` verifies the policy programmatically.
- Historical operating material belongs in `99_LEGACY_MERGE_LEDGER.md` or evidence packs, not here.

---

### 15.5 Future Implementation Minimum Evidence

Any future implementation task that relies on this lock must:

- prove current roots from `pnpm-workspace.yaml`,
- prove current framework/package versions from the active branch,
- keep scope narrow and explicit,
- document unknowns as `TBD`,
- avoid direct screen-to-screen imports without a contract,
- avoid raw Tamagui imports outside `ui-kit`,
- avoid backend/runtime changes during a UI-only task,
- provide `git --no-pager status --short` and `git --no-pager diff --check`,
- provide applicable type/build/runtime/visual evidence for the changed scope.

No implementation task may claim completion from this file alone.

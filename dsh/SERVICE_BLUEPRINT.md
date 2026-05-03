# DSH Service Blueprint

Status: ACTIVE
Canonical owner root: dsh
Previous owner root: packages/surfaces/src/service-owned/dsh
Current implementation root: dsh/frontend
Current truth file: dsh/SERVICE_BLUEPRINT.md
Migration status: ROOTED_UNPROVEN / NOT CLOSED
Purpose: Single canonical living control file for DSH service truth during root-service migration.

This file is now the canonical DSH service blueprint.

id: dsh
name: DSH
owner: dsh
public_export_path: dsh/index.ts
screens_matrix: TBD
flow_matrix: TBD
evidence_root: TBD
closure_decision: NOT CLOSED

Do not add noisy screen lists, stale generated names, or unverified future claims.

---

## 1. Service Identity

| Field | Value |
|---|---|
| Service | DSH |
| Service Meaning | Delivery & Shopping |
| Canonical owner root | dsh |
| Previous owner root | packages/surfaces/src/service-owned/dsh |
| Previous owner status | BRIDGED |
| Current truth file | dsh/SERVICE_BLUEPRINT.md |
| Frontend implementation root | root-owned: `dsh/frontend` |
| Last migration phase | Root pilot with partial frontend slice move and runtime-preserving bridges |

---

## 2. Non-Negotiable Rules

| Rule | Status |
|---|---|
| No deletion of legacy compatibility path without evidence | REQUIRED |
| No Binding truth before Binding phase evidence | REQUIRED |
| No Integration truth before Integration phase evidence | REQUIRED |
| No API truth before API/Contract phase evidence | REQUIRED |
| No full DSH closure claim while only partial migration exists | REQUIRED |
| No service-internal move into app roots | REQUIRED |
| No stale package-owned blueprint as canonical truth | REQUIRED |

---

## 3. Surface Status Matrix

| Surface | UI / UX / Flow | Binding | Integration | API / Contract | Current Status |
|---|---:|---:|---:|---:|---|
| app-client | CLOSED / PASS | TBD | TBD | TBD | Runtime-preserving package ownership retained |
| app-captain | TBD | TBD | TBD | TBD | Migrated to root / not verified |
| app-partner | TBD | TBD | TBD | TBD | Migrated to root / not verified |
| app-field | TBD | TBD | TBD | TBD | Migrated to root / not verified |
| control-panel | PARTIAL | TBD | TBD | TBD | Migrated to root / partial verification only |

---

## 4. Current Phase Truth

| Area | Status | Notes |
|---|---|---|
| Root skeleton | ACTIVE | `dsh/` exists as canonical service root. |
| SERVICE_BLUEPRINT ownership | MOVED | Canonical truth is now this file. |
| Package blueprint | HISTORICAL | Old package path is not canonical truth. |
| Root OpenAPI | SCAFFOLD / TBD | `dsh/dsh.openapi.yaml` exists without fake API truth. |
| Frontend slice move | PARTIAL | `app-partner`, `app-captain`, `app-field`, and `control-panel` are rooted under `dsh/frontend`. |
| Backend | ACTIVE_SCAFFOLD | `dsh/backend/contracts.ts` and `dsh/backend/client.ts` are the service-local backend entrypoints. |
| Domain | TBD | No root domain migration claimed. |
| Media fixtures | ACTIVE | Seed media now lives under `dsh/media-fixtures/assets/seed/dsh/` and is resolved by `@bthwani/media-fixtures`. |
| Full DSH closure | NOT CLOSED | Migration in progress. |

---

## 5. Current Verified Decision

| Field | Value |
|---|---|
| Verified closure | DSH app-client UX/UI/Flow remains unproven |
| Verified scope | dsh/frontend/app-client |
| App-client TypeScript | PASS |
| Raw surfaces TypeScript | N/A |
| Full DSH closure | NOT CLOSED |

---

## 6. Migration Boundary

Root-owned frontend slices live under `dsh/frontend`.
Any legacy compatibility path must be treated as historical unless an evidence pack proves it is still required.

---

## 7. OpenAPI Boundary

Current root contract file:

```text
dsh/dsh.openapi.yaml
```

Status remains:

```text
TBD / UNPROVEN
```

No endpoint truth is closed in this phase.

---

## 8. Evidence Rule

Every future DSH migration step must reference an evidence pack under:

```text
tools/registry/runs/{SESSION_ID}
```

No future phase may claim frontend slice move completion, Binding, Integration, API closure, or full DSH closure without verification.

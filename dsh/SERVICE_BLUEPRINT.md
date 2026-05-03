# DSH Service Blueprint

Status: ACTIVE
Canonical owner root: dsh
Previous owner root: packages/surfaces/src/service-owned/dsh
Current implementation root: MIXED_ROOT_AND_PACKAGE
Current truth file: dsh/SERVICE_BLUEPRINT.md
Migration status: IN_PROGRESS / BRIDGED
Purpose: Single canonical living control file for DSH service truth during root-service migration.

This file is now the canonical DSH service blueprint.

The previous package-owned path remains as a bridge note only:

```text
packages/surfaces/src/service-owned/dsh/SERVICE_BLUEPRINT.md
```

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
| Frontend implementation root | mixed: `dsh/frontend` + `packages/surfaces/src/service-owned/dsh` |
| Last migration phase | Root pilot with partial frontend slice move and runtime-preserving bridges |

---

## 2. Non-Negotiable Rules

| Rule | Status |
|---|---|
| No deletion of packages/surfaces/src/service-owned/dsh before bridges are no longer needed | REQUIRED |
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
| Package blueprint | BRIDGED | Old file remains as a pointer only. |
| Root OpenAPI | SCAFFOLD / TBD | `dsh/dsh.openapi.yaml` exists without fake API truth. |
| Frontend slice move | PARTIAL / BRIDGED | `app-partner`, `app-captain`, `app-field`, and `control-panel` moved to `dsh/frontend`; `app-client` and `shared` remain package-owned for Metro runtime compatibility. |
| Backend | TBD | No root backend migration claimed. |
| Domain | TBD | No root domain migration claimed. |
| Media fixtures | TBD | Root media-fixtures folder exists; no service-owned move claimed. |
| Full DSH closure | NOT CLOSED | Migration in progress. |

---

## 5. Current Verified Decision

| Field | Value |
|---|---|
| Verified closure | DSH app-client UX/UI/Flow closure accepted |
| Verified scope | packages/surfaces/src/service-owned/dsh/app-client |
| App-client TypeScript | PASS |
| Raw surfaces TypeScript | FAIL outside closure scope |
| Full DSH closure | NOT CLOSED |

---

## 6. Migration Boundary

Detailed plan v2 required moving the actual frontend slices into:

```text
dsh/frontend/app-client
dsh/frontend/app-partner
dsh/frontend/app-captain
dsh/frontend/app-field
dsh/frontend/control-panel
```

That move is completed for `app-partner`, `app-captain`, `app-field`, and `control-panel` in this turn.
`app-client` and the supporting `shared` directory were returned to the package-owned path after runtime evidence proved Metro resolution breakage when owned directly from `dsh/frontend`.

Current bridge rule:

```text
old imports must keep working
package-owned paths may remain active where runtime evidence requires them
bridges must stay in place
```

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

# DSH Root Service Blueprint

Status: BRIDGE_READY
Service: DSH
Service meaning: Delivery & Shopping
Target owner root: dsh
Current implementation root: packages/surfaces/src/service-owned/dsh
Current truth status: BRIDGED / NOT MOVED
Migration phase: Phase 3 pilot

---

## 1. Decision

This file introduces the root DSH owner surface and bridge entrypoint.

It does not move implementation.

The current implementation remains under:

```text
packages/surfaces/src/service-owned/dsh
```

The current root pilot target is:

```text
dsh
```

The root bridge export is:

```text
dsh/index.ts
```

---

## 2. Non-Negotiable Rules

| Rule | Status |
|---|---|
| Do not delete packages/surfaces/src/service-owned/dsh yet | REQUIRED |
| Do not rewrite existing DSH imports as part of this pilot | REQUIRED |
| Do not claim full DSH closure | REQUIRED |
| Keep Binding as TBD until evidence exists | REQUIRED |
| Keep Integration as TBD until evidence exists | REQUIRED |
| Keep API/Contract as TBD until evidence exists | REQUIRED |
| Preserve current DSH SERVICE_BLUEPRINT truth under packages | REQUIRED |

---

## 3. Current Phase Truth

| Area | Status | Notes |
|---|---|---|
| Root scaffold | CREATED | Root compact structure exists under `dsh/`. |
| Root bridge export | ACTIVE | `dsh/index.ts` re-exports current DSH implementation. |
| Frontend implementation | NOT MOVED | Current implementation remains under packages. |
| Backend implementation | TBD | No backend migration claimed. |
| Domain model | TBD | No root domain migration claimed. |
| OpenAPI | SCAFFOLD / TBD | Root `dsh.openapi.yaml` is placeholder only. |
| Binding | TBD | Not promoted as truth. |
| Integration | TBD | Not promoted as truth. |
| Full DSH closure | NOT CLOSED | Pilot only. |

---

## 4. Target Compact Structure

```text
dsh
├── SERVICE_BLUEPRINT.md
├── dsh.openapi.yaml
├── index.ts
├── frontend
├── backend
├── domain
├── media-fixtures
└── docs
```

---

## 5. Evidence Rule

Every future DSH migration step must reference an evidence pack under:

```text
tools/registry/runs/{SESSION_ID}
```

No future phase may replace this scaffold with moved implementation claims unless imports, TypeScript, and runtime proof exist.

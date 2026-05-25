# Testing and Production Readiness

**Status:** Canonical Governance Payload v2
**Owner:** `Quality Governance`

## Test categories

| Category | Required when | Evidence |
|---|---|---|
| TypeScript | TS/TSX/config/export impact | targeted typecheck for the affected project/path; workspace `tsc` only for high-risk, release, broad architecture, or explicit human request |
| Lint | a direct lint question exists or an affected-project lint target is available | targeted lint output or NOT_RUN_REASON; workspace lint only on explicit PR/release/human request |
| Unit | pure logic changed | test output |
| Integration | API/client/service binding changed | integration output |
| Contract | OpenAPI/schema/client changed | contract test output |
| Runtime | behavior changed | logs/manual reproduction |
| Visual | UI changed | screenshots |
| Mobile device | mobile navigation/native behavior changed | device evidence |
| Build | release/deploy/config changed | build output |

## Baseline commands

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
# Then choose the minimum targeted gate justified by the Smart Execution Budget.
```

## Smart Execution Budget

Evidence and verification are human-requested and task-specific. The canonical evidence law is in [`governance/11_EVIDENCE_AND_TRACEABILITY.md`](11_EVIDENCE_AND_TRACEABILITY.md).

**Verification by change impact — choose only applicable gates:**

- `docs / policy / agents / governance only` → Git proof only (`git status`, `git diff --name-status`, `git diff --check`). No tsc, no build, no lint, no evidence pack.
- `TS/TSX / config / exports affected` → targeted typecheck for the affected project/path only. Workspace `tsc` only on explicit human request, release, or broad architecture change. Otherwise record `NOT_RUN_REASON`.
- `UI visible change` → screenshots required; targeted type verification when needed.
- `runtime / behavior changed` → runtime smoke or log evidence.
- `release / deploy / native / dependency changed` → build output required.
- No workspace `tsc`, no `run-many`, no `all guards`, no evidence pack by default.

## Production readiness dimensions

A feature is not production-ready until these are understood:

- data plane,
- auth and permissions,
- error handling,
- observability,
- rollback,
- provider/config policy,
- seed/migration state,
- fixtures exit path,
- performance risk,
- security risk,
- support/ops path.

## Fixture law

Fixtures may support development, but fixture success is not runtime success. Any feature relying on fixtures must be marked `BOOTSTRAP`, `DEMO`, or `TBD`, not `CLOSED`.

## Mobile readiness

Mobile work must classify:

```text
JS-only
Metro/bundler
native/dev-client rebuild
dependency/native module rebuild
```

Expo Dev Client is canonical. Expo Go is not acceptance evidence.

## Web/control-panel readiness

Control-panel readiness requires:

- route loads,
- action state,
- permission state,
- audit/log path for operations,
- no huge page-scroll replacement for control-room workflows,
- responsive density appropriate for web-first admin.

## Readiness decision

Use:

```text
READY_FOR_PR
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
NEEDS_EVIDENCE
```

Never use `READY` without exact evidence.

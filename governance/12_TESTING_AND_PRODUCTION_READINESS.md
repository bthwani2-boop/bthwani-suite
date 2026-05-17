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

- LOW: terminal-only, docs tiny, prompt-only, text-only, port checks, or git-status work. Gates: `git status` and `git diff --check` only when writes occurred. No default full lint, workspace `tsc`, guards, registry evidence, or ZIP.
- MEDIUM: one file or a few targeted files. Gates: `git status`, `git diff --check`, and targeted syntax/type/lint only when directly justified. No workspace lint by default.
- UI_VISIBLE: visible UI changes. Gates: `git diff --check`, targeted TS/type verification when needed, and screenshot/RTL notes.
- HIGH: governance, agents, guards, scripts, ui-kit exports, architecture, or other multi-file sensitive work. Gates: `git status`, `git diff --check`, targeted guards, PowerShell syntax validation for modified `.ps1`, and registry evidence only when the risk justifies it. ZIP is opt-in only.
- COMMIT/PUSH: before commit, run `git status` and staged `git diff --check` only. Let hooks run. If a hook fails, fix only the specific failure.

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

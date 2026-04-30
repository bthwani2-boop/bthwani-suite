# Testing and Production Readiness

**Status:** Canonical Governance Payload v2
**Owner:** `Quality Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 17_TESTING_AND_PRODUCTION_READINESS, VERIFICATION_MATRIX, LOCAL_PRODUCTION_READINESS

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Test categories

| Category | Required when | Evidence |
|---|---|---|
| TypeScript | any TS/TSX/config impact | `pnpm -w exec tsc --noEmit` |
| Lint | code style/static checks exist | lint output or not-run reason |
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
pnpm -w exec tsc --noEmit
```

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

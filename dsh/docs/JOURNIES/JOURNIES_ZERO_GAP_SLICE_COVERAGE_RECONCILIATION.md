# DSH/WLT Zero-Gap Slice Coverage Reconciliation

Status: CLOSED_WITH_RATCHET_EVIDENCE
Date: 2026-06-13
Branch scope: current local branch only

## Purpose

This file reconciles the mandatory DSH/WLT zero-gap closure scope with executable evidence.
It is not a replacement for code fixes. It records the live scope, required reports, and blockers that must be resolved before any `CLOSED_WITH_EVIDENCE` claim.

## Mandatory Scope

```text
dsh/frontend/shared
dsh/frontend/control-panel
dsh/frontend/app-client
dsh/frontend/app-partner
dsh/frontend/app-captain
dsh/frontend/app-field
wlt/frontend/dsh
```

Any file outside this list becomes in-scope when it is reached through imports, exports, routes, navigation, screen registry, OpenAPI/client binding, API adapters, WLT bridge, media resolver, PostgreSQL/MinIO/media flow, tests, stories, guards, Docker, env, or runtime config.

## Required Evidence Files

Each execution session must produce these files under `tools/registry/runs/{SESSION_ID}` when the related scope is touched:

```text
file-inventory.json
import-reference-report.json
route-screen-navigation-report.json
preview-data-media-report.json
wlt-dsh-boundary-report.json
control-panel-input-path-report.json
shared-ownership-report.json
slice-coverage-matrix.json
uncovered-files.md
guard-output.txt
final-decision.md
```

Media-related slices must also produce:

```text
media-runtime-gate-report.json
docker-ps.txt
postgres-media-table.txt
media-upload-intent.json
media-complete.json
media-readback.json
```

## Coverage Rules

- Every discovered file gets one owner slice and one decision.
- `UNKNOWN`, `TBD`, `UNPROVEN`, `LATER`, `OUT_OF_SCOPE`, and `SKIPPED` are not valid final decisions.
- `BLOCKED_EXTERNAL_WITH_PROOF` is valid only with the failed command, affected path, external reason, and required follow-up.
- `dsh/frontend/data` and `dsh/frontend/media-fixtures` cannot be deleted until zero direct and indirect references are proven across DSH and `wlt/frontend/dsh`.
- `wlt/frontend/dsh` must not keep runtime files named `Preview`, `preview-data`, `FinancePreview`, `PaymentPreview`, `Demo`, `Mock`, `Sample`, or `Fallback`.

## Executable Guards

The zero-gap execution uses these guards as direct enforcement, not report-only evidence:

```text
pnpm run guard:dsh-zero-gap-runtime-boundaries
pnpm run guard:dsh-surface-structure
pnpm run guard:real-media-runtime
pnpm run guard:fixture-media-identity
pnpm run guard:ast-grep:live-boundaries
pnpm run guard:depcruise:live-boundaries
pnpm run guard:jscpd:live
```

## Current Reconciliation Decision

Decision: CLOSED_WITH_RATCHET_EVIDENCE

Reason:

```text
The command rules and executable guards are installed.
Zero-gap runtime boundaries, real-media-runtime, ast-grep, fixture/media identity, depcruise, jscpd, TypeScript, Go backend tests, Docker config, and git diff check have current passing evidence.
Legacy backend fixture static serving, dev-fixture media route registration, and manifest-key product media creation are retired.
Runtime scoped fixed-string probes outside archived data/media directories return zero `preview-data`, `legacy-preview`, or `media-fixtures` references.
Runtime Docker diagnostic passes for upload intent, PUT to MinIO, complete, read, list, WLT reference-only guard, and fixture env guard.
Surface host structure is protected by a ratchet baseline guard. Existing oversized files are not claimed as decomposed; future growth or direct data/media/storage leaks are blocked.
```

No deletion of `dsh/frontend/data` or `dsh/frontend/media-fixtures` is authorized by this document alone. Deletion still requires the explicit delete gate and zero-reference proof.

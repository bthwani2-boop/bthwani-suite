---
name: bthwani-api-contract-client-boundary
description: Verify API contracts, api-types, api-clients, request/response/error states, and binding readiness before UI or runtime integration.
version: 2026.05.17-v1
---

# bthwani-api-contract-client-boundary

## Purpose

Prevent UI from inventing API truth.

## Steps

1. Identify contract source: OpenAPI/AsyncAPI/schema/types/client/governance.
2. Confirm request, response, errors, auth, pagination, retry, loading, empty, offline states.
3. Reject fixture-only data as runtime truth.
4. Require client/types owner proof before binding.
5. Mark missing API as `TBD_API_CONTRACT` instead of guessing.

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; do not use npm/npx shims for local execution.
- Read `pnpm-workspace.yaml` before choosing active roots.
- `.agents` is operational guidance; `governance/` is project truth and service/application specialization.
- Do not create mirrors, bridges, long copied donor docs, or duplicate skills.
- Do not modify dependencies, lockfiles, CI, secrets, native config, backend/runtime/API, or generated files unless explicitly in scope.
- No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` claim without Git diff, verification output, and evidence.
- Unknowns must be `TBD`, `UNPROVEN`, or `BLOCKED`.

## Output contract

```text
skill:
scope:
governance_sources:
evidence_used:
findings:
risks:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```

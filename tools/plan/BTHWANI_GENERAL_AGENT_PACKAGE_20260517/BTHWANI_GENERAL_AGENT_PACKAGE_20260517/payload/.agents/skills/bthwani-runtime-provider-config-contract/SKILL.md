---
name: bthwani-runtime-provider-config-contract
description: Review runtime providers, provider switching, env/config exposure, local-stack readiness, and preview-vs-runtime boundaries.
version: 2026.05.17-v1
---

# bthwani-runtime-provider-config-contract

## Purpose

Separate UI preview/control-room concepts from live runtime provider mutation.

## Steps

1. Identify provider category and owner.
2. Determine whether change is preview-only or runtime-effective.
3. Verify env/secrets are not exposed or hardcoded.
4. Confirm local-stack and provider control governance before runtime binding.
5. Block runtime claims without smoke evidence and rollback.

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

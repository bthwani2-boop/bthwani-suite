---
name: bthwani-platform-vars-control-contract
description: Control DSH/platform vars, feature flags, provider controls, precedence, simulation, audit, and rollback-preview scope. Use for any vars/provider/configurable behavior task.
version: 2026.05.17-v1
---

# bthwani-platform-vars-control-contract

## Purpose

Prevent hardcoded/scattered configurable behavior and keep variable control explicit.

## Steps

1. Classify scope: `UI_ONLY`, `PREVIEW_ONLY`, `BINDING_READY`, `RUNTIME_MUTATION`, or `API_BACKEND`.
2. Identify variable owner, precedence, scope, default, override rules, provider effect, and audit/rollback preview.
3. Use `governance/domains/vars` and service governance for details.
4. For DSH Platform/Vars UI stage, do not implement backend/runtime/env/provider switching unless explicitly requested.
5. Flag hardcoded behavior, duplicated config, scattered constants, and unclear precedence.

## Required output fields

```text
var:
owner:
scope:
default:
overrides:
provider_effect:
simulation_impact:
audit_rollback:
status:
```

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; use the safest documented launcher; npx is allowed when documented or safest and justified in evidence.
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
---
name: bthwani-operations-dispatch-contract
description: Review operational workflows, manual requests, dispatch, captain/field/partner tasks, SLA, escalation, evidence, and control-panel operations.
version: 2026.05.17-v1
---

# bthwani-operations-dispatch-contract

## Purpose

Make operational flows practical and accountable.

## Steps

1. Identify request type and operational owner.
2. Define states, handoffs, actor permissions, SLA, escalation, evidence, and failure recovery.
3. Distinguish manual request, delivery request, purchase request, field task, partner task, and captain task.
4. Do not collapse different services into one ambiguous flow.
5. Keep service-specific logic in governance.

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

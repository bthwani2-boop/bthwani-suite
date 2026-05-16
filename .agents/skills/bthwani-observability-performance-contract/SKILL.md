---
name: bthwani-observability-performance-contract
description: Review logs, metrics, traces, performance risk, runtime visibility, error reporting, and user-impact evidence.
version: 2026.05.17-v1
---

# bthwani-observability-performance-contract

## Purpose

Make behavior observable and avoid hidden degradation.

## Steps

1. Identify performance/observability concern.
2. Define measurable evidence: load time, render cost, request latency, error rate, logs, traces, screenshots, profiling, or smoke output.
3. Avoid noisy logs and sensitive data.
4. Require before/after evidence when performance is claimed.

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
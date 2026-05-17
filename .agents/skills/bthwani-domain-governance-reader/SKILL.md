---
name: bthwani-domain-governance-reader
description: Route any BThwani task to the correct governance truth before execution. Use whenever a task touches a service, app, surface, domain, policy, finance, runtime, UI, or operational flow.
version: 2026.05.17-v1
---

# bthwani-domain-governance-reader

## Purpose

Keep `.agents` general and use `governance/` for domain truth.

## Steps

1. Identify task domain: service, surface, finance, marketing, catalog, operations, UI-kit, security, release, runtime, API, data, or observability.
2. Locate matching governance docs.
3. If docs are missing, return `NEEDS_GOVERNANCE_SOURCE` and propose the minimal governance path.
4. Do not invent service-specific behavior inside a skill.
5. Use governance facts to constrain execution.

## Governance path examples

```text
governance/services/
governance/surfaces/
governance/domains/
governance/ui-kit/
governance/security/
governance/release/
governance/runtime/
governance/agents/
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
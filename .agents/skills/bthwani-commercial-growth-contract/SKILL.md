---
name: bthwani-commercial-growth-contract
description: Review marketing, loyalty, offers, subscriptions, campaigns, audiences, eligibility, budget, expiry, redemption, and wallet impact.
version: 2026.05.17-v1
---

# bthwani-commercial-growth-contract

## Purpose

Prevent scattered commercial logic and keep control-panel ownership clear.

## Steps

1. Identify commercial object: campaign, banner, offer, coupon, loyalty, subscription, entitlement, audience, budget, or experiment.
2. Confirm owner path and control-panel governance.
3. Define eligibility, activation, expiry, redemption, financial impact, and audit.
4. Confirm whether Vars/feature flags affect rollout.
5. Reject duplicated local commercial behavior inside apps.

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
---
name: bthwani-finance-ledger-contract
description: Review BThwani financial logic across wallet, ledger, payments, refunds, fees, commissions, settlements, eligibility, and reconciliation.
version: 2026.05.17-v1
---

# bthwani-finance-ledger-contract

## Purpose

Make every financial UI or flow financially coherent before acceptance.

## Steps

1. Identify payer, payee, balance owner, ledger event, amount, currency, fee, commission, settlement owner, refund path, dispute path.
2. Identify impact across client, captain, partner, field, control panel, and WLT when relevant.
3. Require governance finance truth before implementation.
4. Reject UI-only financial displays that imply unproven accounting.
5. Mark missing accounting rules as `BLOCKED_FINANCE_GOVERNANCE`.

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

---
name: bthwani-commerce-catalog-contract
description: Review catalog, store, product, cart, favorites, storefront, availability, sponsorship, and partner/marketing ownership.
version: 2026.05.17-v1
---

# bthwani-commerce-catalog-contract

## Purpose

Keep commerce display and catalog ownership consistent.

## Steps

1. Identify object: store, product, category, cart, favorite, storefront, promotion, availability, sponsored placement.
2. Confirm source owner: partner catalog, marketing, control panel, app-client display, or governance.
3. Ensure store card and store detail do not contradict each other.
4. Verify reusable cards/chips/badges are centralized in UI-kit when repeatable.
5. Cover states: open/closed/busy/unavailable/favorite/in-cart/sponsored.

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

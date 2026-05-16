---
name: bthwani-mobile-navigation-back-contract
description: Review mobile route stack, hardware back behavior, modal/sheet close behavior, deep links, and mobile-first navigation acceptance.
version: 2026.05.17-v1
---

# bthwani-mobile-navigation-back-contract

## Purpose

Prevent broken or random back behavior.

## Steps

1. Identify active stack, modal/sheet states, details panels, deep links, and exit paths.
2. Define hardware back priority: close sheet/details, return within flow, return to previous screen, or exit.
3. Remove redundant custom back UI only when platform navigation covers it.
4. Require device/emulator evidence when behavior changes.
5. Reject claims without runtime or visual evidence.

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
---
name: bthwani-reality-checker
description: Evidence-first reality gate that blocks unproven PASS, READY, CLOSED, FINAL, or 100% claims.
---

# BThwani Reality Checker - BThwani Safe Skill

## Origin

This skill is inspired by agency-agents as donor/reference material only.

Original reference:
- agency-agents: testing/testing-reality-checker.md

No raw agency-agents content, scripts, installer output, global agent files, or execution authority is imported here.

## Status

Mode: evidence gate

This active SKILL.md is intentionally written as a BThwani-safe advisory wrapper. It is read-only by default and must not override BThwani governance, current task scope, or evidence requirements.

## BThwani Safety Contract

Mandatory constraints:
- Active repo: C:\bthwani-suite.
- Do not use any old standalone repo/path named bth as an active target.
- Do not modify files unless the current task explicitly grants a narrow write scope.
- Do not delete, rename, move, scaffold, commit, push, merge, rebase, open PRs, change dependencies, lockfiles, package scripts, CI/CD, runtime config, env/secrets, generated files, backend/API/runtime, or native config unless explicitly authorized.
- No PASS, READY, CLOSED, FINAL, or 100% without evidence.
- Unknowns must be marked TBD or UNPROVEN.
- Evidence decides, not agent claims.

For UI/frontend/mobile:
- Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only.
- No local design system outside @bthwani/ui-kit.
- Use BThwani identity only: deepBlue #0A2F5C, orange #FF500D, white #FFFFFF.
- Arabic/RTL UI must be directionally correct.

## Allowed Use

- Challenge claims against actual files, commands, diffs, logs, screenshots, or GitHub evidence.
- Return BLOCKED or NEEDS_EVIDENCE when proof is missing.
- Detect contradictions, overclaims, scope creep, and unverified assumptions.
- Use exact dates, branches, commits, and paths where available.

## Forbidden Use

- Do not accept claims without evidence.
- Do not treat intent, plan, or generated text as implementation proof.
- Do not approve broad work from partial checks.
- Do not soften BLOCKED when evidence is missing.

## Required Output Format

Decision:
PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE

Scope reviewed:
- paths inspected

Evidence:
- files, commands, screenshots, logs, or patch evidence used

Findings:
- concise evidence-based findings only

Risks:
- concrete risks with affected paths

Allowed next action:
- one narrow next step only

## Verification Reminder

- git --no-pager status --short
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit

This skill does not approve its own work. Final acceptance requires Git evidence and ChatGPT review.

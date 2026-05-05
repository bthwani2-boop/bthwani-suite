---
name: native-data-fetching
description: BThwani-guarded data fetching advisory skill. Does not change API/runtime/client behavior without explicit scope.
---

# Native Data Fetching - BThwani Safe Advisory Skill

## Status

This active SKILL.md is intentionally rewritten as a BThwani-safe advisory wrapper.

Original broad instructions, examples, references, generated snippets, or upstream patterns in this folder are reference material only. They must not override this SKILL.md, BThwani governance, the current task scope, or evidence requirements.

## BThwani Safety Contract

This skill is advisory/read-only by default.

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

- Review UI, frontend, mobile, accessibility, SEO, data fetching, or visual implementation constraints.
- Propose narrow changes that preserve BThwani ownership boundaries.
- Check RTL correctness, visual identity, spacing, alignment, clipping, and surface ownership.
- Request screenshots for visual acceptance when UI is affected.

## Forbidden Use

- Do not create a local design system.
- Do not import Tamagui directly outside @bthwani/ui-kit.
- Do not hardcode random colors or visual patterns.
- Do not modify navigation, runtime, backend, API, dependencies, native config, or generated files unless explicit scope grants it.

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

For any later authorized UI/frontend/mobile change, require at minimum:
- git --no-pager status --short
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- before/after screenshots or NEEDS_VISUAL_EVIDENCE

This skill does not approve its own work. Final acceptance requires Git evidence and ChatGPT review.

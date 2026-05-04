---
name: typescript-advanced-types
description: Light advisory guidance for TypeScript types in BThwani. Does not edit code by default.
---

# Typescript Advanced Types - BThwani Safe Advisory Skill

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

- Inspect and explain only inside the current task scope.
- Provide advisory guidance, warnings, and narrow verification commands.
- Help interpret TypeScript, Nx, Next.js, React, or composition patterns from repo evidence.

## Forbidden Use

- Do not edit files, dependencies, lockfiles, package scripts, generated files, CI, runtime config, backend/API/runtime, native config, or workflows unless explicit scope grants it.
- Do not broaden from advisory guidance into implementation.

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

For any later authorized code change, require at minimum:
- git --no-pager status --short
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit

This skill does not approve its own work. Final acceptance requires Git evidence and ChatGPT review.

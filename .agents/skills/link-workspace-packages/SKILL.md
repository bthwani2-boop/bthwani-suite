---
name: link-workspace-packages
description: Read-only advisory review for workspace package linking. Does not edit package files or lockfiles.
---

# Link Workspace Packages - BThwani Safe Advisory Skill

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

- Inspect existing files and report risks.
- Explain backend, API, runtime, CI, deployment, Expo, Nx, or workspace concerns only from inspected evidence.
- Suggest narrow next steps and verification commands.
- Mark unknowns as TBD or UNPROVEN.

## Forbidden Use

- Do not scaffold, generate, install, upgrade, deploy, link packages, edit workflows, edit package files, edit lockfiles, edit native config, or implement backend/API/runtime code.
- Do not use this skill as a builder.
- Do not open reference files as active instructions unless the user explicitly asks for reference review.

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

For any later authorized runtime/config/backend/CI/Nx/Expo change, require at minimum:
- git --no-pager status --short
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- targeted build/test/runtime evidence when relevant

This skill does not approve its own work. Final acceptance requires Git evidence and ChatGPT review.

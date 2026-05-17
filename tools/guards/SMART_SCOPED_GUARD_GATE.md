# Smart Scoped Guard Gate

## Purpose

This is a guidance contract only. It does not execute commands.

Use this file when the user asks an agent to validate changed files with the existing BThwani guards, then commit/push only if the scoped checks pass.

The goal is to prevent blind execution, full workspace lint, full workspace typecheck, unnecessary evidence folders, unnecessary ZIPs, repeated wait loops, and duplicate guard execution.

## Core Principle

Do not create a new execution layer.

Do not replace:

- tools/guards/RUN_BTHWANI_GUARDS_V3.ps1
- tools/guards/RUN_GOVERNANCE_GUARDS.ps1
- tools/GHB_COMMIT_PUSH_CURRENT_BRANCH.ps1
- Git hooks
- project governance files
- agent skills

This file only explains how agents should choose and sequence the existing tools.

## Required Strategy

Use Smart Scoped Guard Gate:

1. Detect the changed files.
2. Classify the changed-file scope.
3. Select the minimum relevant gates.
4. Run existing guards only when justified.
5. Fix only failures caused by files inside the requested scope.
6. Commit/push only after scoped gates pass.
7. Do not create ZIP unless explicitly requested.
8. Do not run full lint, full workspace typecheck, full build, or all guards for simple changes.

## Scope Detection

Default scope is the current Git change set:

- git --no-pager status --short
- git --no-pager diff --name-only
- git --no-pager diff --cached --name-only

Exclude generated or review artifacts:

- tools/registry/runs/**
- LOCAL_CHANGE_REVIEW.patch
- node_modules/**
- .next/**
- dist/**
- build/**
- coverage/**
- .turbo/**

## Risk Matrix

### LOW

Examples:

- terminal-only task
- tiny docs edit
- prompt-only edit
- text-only edit
- port check
- git status/check only

Minimum gates:

- git --no-pager status --short
- git --no-pager diff --check when writes occurred

Forbidden by default:

- workspace lint
- workspace tsc
- full guards
- evidence folder
- ZIP
- reading all skills
- repeated wait-loop messages

### MEDIUM

Examples:

- one changed file
- few targeted changed files
- small script or TypeScript edit
- small UI edit without broad architecture effect

Minimum gates:

- git --no-pager status --short
- git --no-pager diff --name-status
- git --no-pager diff --check

Add only when directly justified:

- targeted syntax check
- targeted lint if safe and specific
- targeted typecheck if safe and specific

Do not run workspace lint by default.

### UI_VISIBLE

Examples:

- screen/layout/RTL/overflow/design behavior changed

Minimum gates:

- git --no-pager diff --check
- targeted TypeScript/type verification only when justified
- screenshot or visual notes
- RTL/overflow/spacing notes

Suggested guard when relevant:

- powershell -NoProfile -ExecutionPolicy Bypass -File "tools\guards\RUN_BTHWANI_GUARDS_V3.ps1" -Profile ui -Phase UI_UX_FLOW -Mode Ratchet

Do not pass -CreateZip unless explicitly requested.

### GOVERNANCE_AGENT_GUARD_SCRIPT

Examples:

- AGENTS.md
- CLAUDE.md
- GEMINI.md
- .agents/**
- governance/**
- tools/guards/**
- tools/scripts/**
- .husky/**
- package.json

Minimum gates:

- git --no-pager status --short
- git --no-pager diff --name-status
- git --no-pager diff --check
- PowerShell syntax check only for modified .ps1/.psm1 files

Suggested guard when relevant:

- powershell -NoProfile -ExecutionPolicy Bypass -File "tools\guards\RUN_BTHWANI_GUARDS_V3.ps1" -Profile governance -Phase GOVERNANCE -Mode Ratchet

Do not pass -CreateZip unless explicitly requested.

### MIXED

If changed files span multiple domains, run each needed guard once only.

Example:

- governance file + UI file:
  1. governance / GOVERNANCE / Ratchet
  2. ui / UI_UX_FLOW / Ratchet

Do not run all guards blindly.

## Commit and Push Rule

Before commit:

- git --no-pager status --short
- git add -- scoped files only
- git --no-pager diff --cached --check

Then commit.

Do not manually rerun pre-commit or pre-push hooks. Let Git hooks run naturally.

If a hook fails, fix only the specific failure. Do not expand the task scope.

## ZIP and Evidence Rule

No ZIP by default.

No evidence folder for low-risk work.

Use an evidence folder only when:

- high-risk governance/guard/script work requires local review
- the user explicitly requests evidence
- the task needs a reviewable audit trail

Create ZIP only when:

- the user explicitly requests ZIP
- one upload artifact is actually needed

## Agent Output Rule

Do not emit repeated wait-loop messages.

Forbidden by default:

- I will continue to wait
- I will wait for up to 60 more seconds
- repeated monitoring updates without new evidence

Use concise status and final result only.

## Decision Vocabulary

Use one of:

- PASS
- PASS_WITH_WARNINGS
- FIX_REQUIRED
- BLOCKED
- NEEDS_EVIDENCE
- NEEDS_VISUAL_EVIDENCE

Never claim PASS, CLOSED, FINAL, READY, or 100% without scoped diff check, relevant guard result, clean staged diff before commit, and successful commit/push when requested.
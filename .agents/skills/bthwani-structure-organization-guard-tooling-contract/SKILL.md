---
name: bthwani-structure-organization-guard-tooling-contract
description: Use the installed structure, duplication, monorepo, file-size, performance-bloat, and security-hygiene tooling to diagnose organization gaps without auto-moving files or treating heuristic reports as final truth.
version: 2026.06.11-v1
---

# bthwani-structure-organization-guard-tooling-contract

## Purpose

Use this skill to diagnose and control file/folder organization, duplicate code, inconsistent structure between apps, oversized files, monorepo hygiene, performance bloat caused by structure, and security hygiene related to repository organization.

This skill is diagnostic and guard-oriented. It does not authorize mass rename, automatic folder moves, or broad refactors without evidence and scoped commits.

## Trigger contexts

Use this skill when the task asks about:

1. Organizing files and folders.
2. Standardizing folder structures across apps and services.
3. Detecting duplicate code or copy/paste drift.
4. Detecting oversized files, giant screens, or mixed-responsibility modules.
5. Detecting unused files, unused exports, or dead dependencies.
6. Reviewing `shared`, `common`, `utils`, `helpers`, `temp`, `old`, `copy`, or archive-like folders.
7. Performance bloat caused by large files, duplicated logic, imports, or poor structure.
8. Security hygiene related to secrets, accidental evidence files, generated outputs, or unsafe repo organization.

## Non-trigger contexts

Do not use this skill when:

1. The task is only visual design, UI-kit ownership, Tamagui, or raw design tokens.
2. The task is only feature logic, user journey, API contract, or Cucumber behavior.
3. The task is only prose editing or documentation style.
4. The task asks for a single isolated code edit with no organization impact.

## Required sources

Read the smallest sufficient set:

1. `.agents/INDEX.md`
2. `.agents/GRAPHIFY.md` when dependency or ownership discovery is needed.
3. `.agents/skills/bthwani-graphify-query-first/SKILL.md` when the task spans many files.
4. `.agents/skills/bthwani-test-quality-gates-contract/SKILL.md`
5. `.agents/skills/bthwani-secure-runtime-and-secrets-contract/SKILL.md` when security hygiene is involved.
6. `tools/guards/GUARDS_CATALOG.md`
7. `tools/guards/guard-manifest.json`
8. `package.json`

## Allowed commands

Run from repo root:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
```

Tool health:

```powershell
pnpm exec ls-lint --version
pnpm exec jscpd --version
pnpm exec sherif --version
pnpm exec knip --version
pnpm exec depcruise --version
```

Existing BThwani organization/security guards:

```powershell
pnpm run guard:code-hygiene
pnpm run guard:secret-scan
```

Dependency and unused-code diagnostics:

```powershell
pnpm exec knip
pnpm exec depcruise --version
```

Generated-output safety scan:

```powershell
git grep -n -E "graphify-out|\.tamagui|tools/registry/runs|tools\\registry\\runs|logicify-out|logic-graph-out" -- `
  dsh/frontend `
  wlt/frontend `
  app-client/runtime `
  app-partner/runtime `
  app-captain/runtime `
  app-field/runtime `
  control-panel/runtime `
  webapp/runtime `
  website/runtime `
  ":!**/node_modules/**" `
  ":!**/.next/**" `
  ":!**/dist/**" `
  ":!**/build/**" `
  ":!**/.tamagui/**" `
  ":!**/docs/**" `
  ":!graphify-out/**" `
  ":!tools/registry/runs/**"
```

## Rules

* Treat `ls-lint`, `jscpd`, `sherif`, `knip`, and `dependency-cruiser` as diagnostic tools first.
* Do not enable strict blocking mode on a legacy codebase before baseline and ratchet planning.
* Do not mass-rename files or folders without import/routing impact analysis.
* Do not merge unrelated cleanup with feature/runtime changes.
* Prefer report-only, advisory-first, then ratchet, then strict.
* Keep commits separate:

  * tooling install
  * config/scaffold
  * baseline report
  * targeted cleanup
  * strict enforcement
* Do not treat duplicate findings as automatic deletion candidates.
* Do not delete files just because they are unused until ownership and runtime reachability are checked.
* Do not move screens/components/hooks/adapters without route/import verification.
* Do not put local evidence paths into runtime code.
* Do not claim PASS, CLOSED, READY, SAFE, FINAL, or 100% without guard output, diff check, and scoped evidence.

## Organization completeness model

A folder or feature area is not considered organized until these are proven or explicitly classified:

1. Clear owner.
2. Clear purpose.
3. Consistent folder naming.
4. Consistent file naming.
5. No unjustified `shared/common/utils` dumping.
6. No unmanaged `old/temp/copy/archive` content in runtime paths.
7. No giant mixed-responsibility files without decomposition plan.
8. No duplicate code above accepted threshold without consolidation plan.
9. No orphan exports or unused files unless intentionally retained.
10. No generated/cache/evidence output imported by runtime.
11. No secrets or local artifacts in tracked runtime paths.
12. No performance bloat caused by avoidable duplication or heavy imports.

## Tools mapping

```text
ls-lint:
  filenames and directory names

jscpd:
  copy/paste and duplicate code

sherif:
  monorepo and package consistency

knip:
  unused files, exports, dependencies

dependency-cruiser:
  import boundaries and dependency graph

guard:code-hygiene:
  BThwani-specific organization hygiene

guard:secret-scan:
  BThwani-specific secret hygiene
```

## Output contract

```text
skill: bthwani-structure-organization-guard-tooling-contract
scope:
roots_checked:
tools_checked:
guards_run:
naming_findings:
duplication_findings:
large_file_findings:
dead_code_findings:
monorepo_findings:
security_hygiene_findings:
performance_bloat_findings:
generated_output_reference_findings:
unknowns:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE
next_action:
```

---
name: bthwani-graphify-query-first
description: Use the local Graphify knowledge graph before broad raw-file searching for BThwani repository architecture, ownership, routing, dependency, and cross-surface questions.
version: 2026.06.12-v2
---

# bthwani-graphify-query-first

## Purpose

Use `graphify-out/graph.json` as a local navigation layer before broad raw-file searching.
This skill reduces wasted token usage and helps agents find the smallest relevant file set before reading code.

For journey/slice execution, start each CHECK phase with Graphify outputs to understand scope, reduce context, identify impacted files and relationships, and surface gaps, duplicates, dead files, and dependency paths. Then run only the analysis or quality tools that the slice context proves necessary. Graphify leads the toolchain: repomix may reduce context, madge may inspect dependency cycles, react-scanner may inspect component usage, ast-grep may detect structural patterns, dependency-cruiser may check boundaries, TypeScript may validate types, style and token tools may validate design constraints, Playwright or Cucumber may validate behavior, Spectral and OpenAPI tooling may validate contracts, knip may signal unused code, ls-lint may check naming, jscpd may detect duplication, and sherif may check monorepo consistency. Graphify and every follow-up tool must feed a practical decision for the current slice; they must not produce disconnected reports or trigger broad tool runs without a scoped reason.

## Trigger contexts

Use this skill when the task asks about:

1. where something lives in the repo,
2. how two files, modules, screens, surfaces, routes, imports, exports, or governance areas connect,
3. architecture, ownership, dependency, routing, UI-kit boundary, DSH data/media, or cross-surface impact,
4. executing journeys and nested slices where identifying scope, dependencies, duplication, dead files, or paths is required.

## Non-trigger contexts

Do not use this skill when:

1. the user provided one exact file and only asks to rewrite text in that file,
2. the task is pure UI visual review from a screenshot with no repo lookup,
3. `graphify-out/graph.json` is missing or known stale and the task is to repair Graphify itself.

## Required commands

Run from the active repo root:

    Set-Location -LiteralPath "C:\bthwani-suite"

For focused discovery:

    graphify query "<focused question>"

For relationship checks:

    graphify path "<A>" "<B>"

For one concept:

    graphify explain "<concept>"

## Rules

- **Query First**: Always use Graphify before broad `grep`, `rg`, or large file reads when the question is about repo structure or relationships.
- **Limit Inputs**: Restrict input context before reading raw files or running heavy tools.
- **Define Scope**: Identify impacted files and relationships before `APPLY`.
- **Navigation layer only**: Treat `graphify-out/` as an analysis and navigation layer only, not a runtime source and not final evidence.
- **Subordinate Tooling**: Run appropriate quality and analysis tools only after Graphify, as dictated by the slice context, rather than running them comprehensively or randomly.
- **Connected Reports**: Treat analysis and quality tools as subordinate to the Graphify/Slice context, and translate their output directly into actionable decisions (files to read, next tools to run, risks, blockers, or next action).
- **Prevent Idle Tool Runs**: Never run analysis/quality tools comprehensively without a scoped reason.
- **No False Closure**: Do not declare `PASS`, `READY`, `CLOSED`, `SAFE`, `FINAL`, or `100%` based on Graphify output alone.
- **Integration**: Link Graphify insights directly with the following guard contracts when checking boundaries:
  - [bthwani-design-guard-tooling-contract](file:///c:/bthwani-suite/.agents/skills/bthwani-design-guard-tooling-contract/SKILL.md)
  - [bthwani-logic-graph-guard-tooling-contract](file:///c:/bthwani-suite/.agents/skills/bthwani-logic-graph-guard-tooling-contract/SKILL.md)
  - [bthwani-structure-organization-guard-tooling-contract](file:///c:/bthwani-suite/.agents/skills/bthwani-structure-organization-guard-tooling-contract/SKILL.md)
- **Local Hook**: Keep `graphify-out/` as a local generated cache unless explicitly approved. For normal maintenance, update using `graphify update .`.

## Tools Under Command of Graphify

Graphify does not replace other tools; rather, it determines when and why they should run. The following tools should be executed only when the slice context proves a clear need:

- `repomix`: Prepare a concise, scoped context representation to reduce token usage and prompt inputs.
- `madge`: Inspect dependency cycles and analyze module relationship graphs.
- `react-scanner`: Scan for component usage patterns and UI surface references.
- `@ast-grep/cli`: Detect specific structural patterns, violations, and layout rules.
- `dependency-cruiser`: Validate architectural boundaries and dependency rules.
- `typescript/tsc`: Validate types and compile safety when code changes warrant it.
- `stylelint`: Validate CSS rules and patterns.
- `style-dictionary`: Manage and validate design tokens and constraints if the slice touches styling/design system.
- `@playwright/test`: Validate end-to-end user behavior and UI runtime constraints.
- `@stoplight/spectral-cli`: Validate OpenAPI schemas and API contract compliance.
- `openapi-typescript`: Generate or verify TypeScript definitions from OpenAPI specifications.
- `@cucumber/cucumber`: Run behavior-driven tests to validate journey logic.
- `knip`: Signal unused files or exports (used as a hint, not as an automatic deletion trigger).
- `@ls-lint/ls-lint`: Verify file and folder naming conventions.
- `jscpd`: Detect code duplication across files.
- `sherif`: Audit monorepo package configuration and dependency consistency.
- Any other custom or project-specific tool that serves the journey/slice context.

Executing any of these tools must be justified by the initial Graphify analysis or slice scope, and their output must immediately feed into the decision-making loop for the current slice.

## Output contract

```text
skill: bthwani-graphify-query-first
scope:
journey_or_slice:
graphify_question:
graphify_commands:
graphify_result_summary:
impacted_files:
impacted_relationships:
tools_recommended_next:
tools_selected:
tools_skipped:
tool_selection_reason:
tool_outputs_summary:
files_to_read_next:
risks:
blocked_or_unknown:
decision: NEEDS_TOOL / NEEDS_FILE_READ / NEEDS_EVIDENCE / FIX_REQUIRED / BLOCKED / PASS_WITH_WARNINGS
next_action:
```

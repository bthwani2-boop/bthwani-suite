---
name: bthwani-graphify-query-first
description: Use the local Graphify knowledge graph for context, navigation, and cross-file relationship discovery only. Graphify is not a toolchain leader. Use bthwani-evidence-gate-router-contract to select tools and guards.
version: 2026.06.13-v3
---

# bthwani-graphify-query-first

## Role

Graphify is a **context and navigation layer only**.

Graphify helps agents discover where things live, how files relate, and which files are in scope. It does not lead the toolchain, does not coordinate other tools, and does not prove acceptance.

For tool and guard selection, use `bthwani-evidence-gate-router-contract` instead.

## Trigger contexts

Use this skill when the task asks:

1. Where does something live in the repo?
2. How do two files, modules, screens, surfaces, routes, imports, exports, or governance areas connect?
3. What is the cross-surface impact of a change?
4. Which files are in scope before reading code or running targeted analysis tools?

## Non-trigger contexts

Do NOT use this skill when:

1. The file scope is already known from the task or prior context.
2. The task is text-only, docs-only, agents-only, or governance-only with no code impact.
3. The task requires type proof → use `tsc`.
4. The task requires security proof → use Semgrep / Trivy / Checkov / CodeQL (at PR/release).
5. The task requires runtime proof → use Playwright / Cucumber.
6. The task requires UI proof → use screenshots / react-scanner / Playwright.
7. The task requires API contract proof → use Spectral / openapi-typescript.
8. The task requires dependency safety proof → use dependency-cruiser / madge / sherif.
9. `graphify-out/graph.json` is missing or known stale and the task is to repair Graphify itself.

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

- **Context only**: Graphify narrows scope. It does not lead or coordinate tools.
- **Not for every task**: Use Graphify only when cross-file scope is unknown or a relationship question is present.
- **No default update**: Do not run `graphify update .` by default. Run it only when code structure or imports changed AND subsequent steps in the same session need accurate graph navigation AND there is explicit justification.
- **Navigation layer only**: Treat `graphify-out/` as a navigation layer only — not runtime source, not final evidence, not acceptance proof.
- **No false closure**: Do not declare `PASS`, `READY`, `CLOSED`, `SAFE`, `FINAL`, or `100%` based on Graphify output alone.
- **No tool orchestration**: Graphify does not determine which analysis tools run. Tool selection is done by `bthwani-evidence-gate-router-contract`.
- **Limit Inputs**: Restrict input context before reading raw files or running any tool.

## Tool selection after Graphify

After using Graphify to narrow scope, route to `bthwani-evidence-gate-router-contract` to select the minimum correct tool set. Do not choose tools based on Graphify output alone.

## Output contract

```text
skill: bthwani-graphify-query-first
scope:
graphify_question:
graphify_commands:
graphify_result_summary:
impacted_files:
impacted_relationships:
scope_narrowed: yes | no
next_skill: bthwani-evidence-gate-router-contract
files_to_read_next:
risks:
blocked_or_unknown:
decision: NEEDS_TOOL | NEEDS_FILE_READ | NEEDS_EVIDENCE | FIX_REQUIRED | BLOCKED | PASS_WITH_WARNINGS
next_action:
```

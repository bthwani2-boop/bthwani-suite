---
name: bthwani-graphify-query-first
description: Use the local Graphify knowledge graph before broad raw-file searching for BThwani repository architecture, ownership, routing, dependency, and cross-surface questions.
version: 2026.05.31-v1
---

# bthwani-graphify-query-first

## Purpose

Use `graphify-out/graph.json` as a local navigation layer before broad raw-file searching.

This skill reduces wasted token usage and helps agents find the smallest relevant file set before reading code.

## Trigger contexts

Use this skill when the task asks about:

1. where something lives in the repo,
2. how two files, modules, screens, surfaces, routes, imports, exports, or governance areas connect,
3. architecture, ownership, dependency, routing, UI-kit boundary, DSH data/media, or cross-surface impact.

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

- Use Graphify before broad `grep`, `rg`, or large file reads when the question is about repo structure or relationships.
- Keep the query narrow and task-specific.
- Treat Graphify as navigation only, not final proof.
- Read exact owner files before recommending or implementing changes.
- Do not claim PASS, CLOSED, READY, FINAL, SAFE, or 100% from Graphify output alone.
- Final acceptance still requires Git evidence, verification output, and visual evidence for UI work when relevant.
- Keep `graphify-out/` as local generated cache unless the human explicitly approves tracking it.
- Do not run full semantic extraction unless explicitly requested.
- For normal maintenance, use the local hook/update path based on `graphify update .`.

## Output contract

    skill: bthwani-graphify-query-first
    scope:
    graphify_question:
    graphify_command:
    graphify_result_summary:
    exact_files_to_read_next:
    unknowns:
    decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE
    next_action:

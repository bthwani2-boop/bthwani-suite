---
name: bthwani-design-guard-tooling-contract
description: Use the installed design guard toolchain to diagnose UI-kit ownership, design-token drift, Tamagui boundary, component usage, dependency boundaries, visual-state readiness, and generated design outputs without treating generated caches as runtime truth.
version: 2026.06.11-v1
---

# bthwani-design-guard-tooling-contract

## Purpose

Use this skill to route design/tooling tasks through the installed design guard toolchain while keeping `ui-kit` as the design source of truth.

This skill is for diagnosis, guard execution, evidence collection, and scoped remediation planning. It is not a license to rewrite UI or declare visual closure without evidence.

## Trigger contexts

Use this skill when the task asks about:

1. Design Guard setup, verification, scaffold, or tool health.
2. `react-scanner`, `ast-grep`, `dependency-cruiser`, `stylelint`, `style-dictionary`, Playwright visual/smoke evidence, or Tamagui guard usage.
3. `graphify-out/`, `.tamagui/`, `tamagui.generated.css`, raw hex drift, direct Tamagui imports, UI-kit ownership, or generated-output safety.

## Non-trigger contexts

Do not use this skill when:

1. The task is pure business logic, API contract, finance ledger, dispatch flow, or feature-gap review with no design/tooling impact.
2. The user asks only to edit Arabic/English prose.
3. The task is to implement backend/runtime behavior unrelated to UI boundaries or visual evidence.

## Required sources

Read the smallest sufficient set:

1. `.agents/INDEX.md`
2. `.agents/GRAPHIFY.md` only when structure/relationship discovery is needed.
3. `.agents/skills/bthwani-ui-kit-surface-contract/SKILL.md`
4. `.agents/skills/bthwani-frontend-design-excellence-contract/SKILL.md`
5. `.agents/skills/bthwani-test-quality-gates-contract/SKILL.md` when verification scope is unclear.
6. `tools/guards/GUARDS_CATALOG.md` and `tools/guards/guard-manifest.json` when selecting existing guards.

## Allowed commands

Run from the repo root:

    Set-Location -LiteralPath "C:\bthwani-suite"

Tool health:

    pnpm react-scanner --version
    pnpm ast-grep --version
    pnpm depcruise --version
    pnpm stylelint --version
    pnpm style-dictionary --version
    pnpm playwright --version

Design guard checks when relevant:

    pnpm run guard:tamagui-import-boundary
    pnpm run guard:design-token-drift
    pnpm run guard:ui-kit-central-design-ownership

Generated-output safety scan:

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

## Rules

- Treat `ui-kit` as the canonical design source of truth.
- Treat `graphify-out/`, `.tamagui/`, `tamagui.generated.css`, and `tools/registry/runs/` as generated/cache/evidence outputs, not runtime truth.
- Do not import generated outputs into runtime.
- Do not use raw hex outside approved design-token ownership without classification.
- Do not use direct Tamagui imports outside the approved UI-kit boundary.
- Do not claim PASS, CLOSED, READY, SAFE, FINAL, or 100% without Git diff, guard output, runtime-only generated-output scan, and visual evidence when UI is affected.
- Prefer targeted guard execution over full workspace builds unless release/runtime scope requires broader gates.
- Keep fixes separate: tool install, guard scaffold, runtime cleanup, and UI fixes must be separate commits unless the human explicitly asks otherwise.

## Examples

Trigger examples:

1. "ØªØ­Ù‚Ù‚ Ù‡Ù„ Ø£Ø¯ÙˆØ§Øª Ø§Ù„ØªØµÙ…ÙŠÙ… Ù…Ø«Ø¨ØªØ© ÙˆØªØ¹Ù…Ù„."
2. "Ù‡Ù„ Ø­Ø°Ù `.tamagui` Ø£Ùˆ `graphify-out` ÙŠØ¶Ø± runtimeØŸ"
3. "Ø±Ø§Ø¬Ø¹ raw hex ÙˆTamagui imports Ø®Ø§Ø±Ø¬ ui-kit."

Non-trigger examples:

1. "ØµØº Ø¥Ø¹Ù„Ø§Ù† ØªØ³ÙˆÙŠÙ‚ÙŠ."
2. "ØµÙ…Ù… Ø³ÙŠØ§Ø³Ø© Ø¹Ù…ÙˆÙ„Ø§Øª WLT."
3. "Ø§ÙƒØªØ¨ endpoint Go Ù„Ù„Ø·Ù„Ø¨."

## Output contract

```text
skill: bthwani-design-guard-tooling-contract
scope:
design_tools_checked:
generated_outputs_checked:
guards_run:
runtime_reference_findings:
visual_evidence_required: yes/no
findings:
risks:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```

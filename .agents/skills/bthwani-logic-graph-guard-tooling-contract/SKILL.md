---
name: bthwani-logic-graph-guard-tooling-contract
description: Use open-source logic and behavior tooling to diagnose feature, journey, screen, API, state, and evidence gaps across BThwani surfaces without treating heuristic output as final proof.
version: 2026.06.11-v1
---

# bthwani-logic-graph-guard-tooling-contract

## Purpose

Use this skill to diagnose operational logic gaps across applications, sections, pages, tabs, interfaces, APIs, user-visible states, and cross-surface journeys.

This skill routes logic review through open-source tooling and BThwani manifests. It does not claim that a feature is complete unless implementation, API binding, runtime behavior, and evidence all align.

## Trigger contexts

Use this skill when the task asks about:

1. Missing features, missing logic, missing screens, missing states, or incomplete user-visible behavior.
2. Cucumber/Gherkin behavior specs, Spectral/OpenAPI rules, Playwright journey proof, `ast-grep` logic rules, or dependency-boundary checks.
3. DSH/WLT/captain/partner/field/control-panel journey completeness, WLT finance boundaries, or feature-to-screen-to-API-to-test coverage.

## Non-trigger contexts

Do not use this skill when:

1. The task is only visual design quality, color/token drift, or Tamagui boundary review.
2. The task is only prose cleanup or document style.
3. The task asks for a single isolated code edit with no feature/journey impact.

## Required sources

Read the smallest sufficient set:

1. `.agents/INDEX.md`
2. `.agents/skills/bthwani-integrated-system-umbrella-contract/SKILL.md`
3. `.agents/skills/bthwani-screen-flow-binding-contract/SKILL.md`
4. `.agents/skills/bthwani-api-contract-client-boundary/SKILL.md`
5. `.agents/skills/bthwani-test-quality-gates-contract/SKILL.md`
6. Domain skills only when relevant: finance, catalog, operations, commercial growth, security, performance.
7. `tools/guards/GUARDS_CATALOG.md` and `tools/guards/guard-manifest.json` when selecting existing guards.
8. OpenAPI files and feature/journey manifests that own the target scope.

## Allowed commands

Run from the repo root:

    Set-Location -LiteralPath "C:\bthwani-suite"

Tool health:

    pnpm spectral --version
    pnpm cucumber-js --version
    pnpm ast-grep --version
    pnpm playwright --version
    pnpm depcruise --version
    pnpm knip --version

Existing logic-adjacent guards when relevant:

    pnpm run guard:binding-proof
    pnpm run guard:operating-model
    pnpm run guard:service-runtime
    pnpm run guard:platform-vars

OpenAPI checks when relevant:

    pnpm run openapi:lint:auth
    pnpm run openapi:lint:dsh
    pnpm run openapi:lint:wlt

Behavior checks when relevant:

    pnpm cucumber-js --version

Runtime-generated-output safety scan:

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

## Logic completeness model

A feature is not complete until the following are proven or explicitly classified:

1. Feature owner and actor.
2. User-visible surface: app, section, page, tab, screen, or interface.
3. Required user-visible states: loading, empty, error, disabled, retry, success, permission when applicable.
4. API contract or documented reason that the feature is local/static/deferred.
5. Runtime data binding.
6. Cross-surface impact.
7. WLT/DSH ownership boundary for money, ledger, settlement, refund, fee, and reconciliation.
8. Test or behavior evidence: Cucumber/Gherkin, Playwright, integration test, or explicit BLOCKED_WITH_REASON.
9. Evidence is linked by evidence id or manifest reference, not by local generated path inside runtime code.

## Rules

- Use Cucumber/Gherkin for expected behavior language when defining what the user must see or do.
- Use Spectral for OpenAPI contract quality and API gap checks.
- Use `ast-grep` for code-pattern logic rules.
- Use Playwright for user-visible journey proof.
- Use dependency-cruiser for ownership and boundary checks.
- Use Knip to detect unused/stranded screens, exports, and dependencies.
- Do not install Semgrep through pnpm on Windows by default; use it only after the project chooses pipx, uv, Docker, or another explicit runner.
- Treat heuristics as findings, not final truth.
- Mark unknowns as TBD, UNPROVEN, BLOCKED, NEEDS_EVIDENCE, or NEEDS_VISUAL_EVIDENCE.
- Do not claim PASS, CLOSED, READY, SAFE, FINAL, or 100% without implementation evidence, API proof, runtime proof, and Git verification.

## Examples

Trigger examples:

1. "Ø­Ø¯Ø¯ Ù…Ø§ Ø§Ù„Ù…Ù†Ø·Ù‚ Ø§Ù„Ù†Ø§Ù‚Øµ ÙÙŠ ÙƒÙ„ ØªØ·Ø¨ÙŠÙ‚ ÙˆÙ‚Ø³Ù…."
2. "Ù‡Ù„ checkout Ù…ÙƒØªÙ…Ù„ Ù…Ù† Ø§Ù„Ø´Ø§Ø´Ø© Ø¥Ù„Ù‰ API Ø¥Ù„Ù‰ WLTØŸ"
3. "Ø£Ø±ÙŠØ¯ feature gap matrix Ù„ÙƒÙ„ ØµÙØ­Ø© ÙˆØªØ¨ÙˆÙŠØ¨."

Non-trigger examples:

1. "Ø±Ø§Ø¬Ø¹ Ø£Ù„ÙˆØ§Ù† Ø§Ù„ÙˆØ§Ø¬Ù‡Ø© ÙÙ‚Ø·."
2. "Ù†Ø¸Ù raw hex Ø®Ø§Ø±Ø¬ ui-kit."
3. "ØµØ­Ø­ ØµÙŠØ§ØºØ© Ø¹Ø±Ø¨ÙŠØ© ÙÙŠ Ù…Ø³ØªÙ†Ø¯."

## Output contract

```text
skill: bthwani-logic-graph-guard-tooling-contract
scope:
feature_or_journey:
surfaces_checked:
api_contracts_checked:
behavior_specs_checked:
runtime_binding_findings:
wlt_boundary_findings:
missing_user_visible_states:
missing_features:
evidence_used:
unknowns:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```

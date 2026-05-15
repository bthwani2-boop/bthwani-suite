# DSH Closed-Loop Execution Package — FINAL v2

**Date:** 2026-05-15
**Target repo:** `C:\bthwani-suite`
**Target branch:** `ghb/0142-20260515-053913-verify-ui-kit-stability`
**Mode:** local agent execution only; GitHub remains read-only unless the user explicitly requests write actions.
**Purpose:** drive DSH from fragmented preview/service material toward `READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE` through closed loops.

## Non-negotiable truth

This package is the strictest execution handoff for the agent. It is designed to avoid:
- blind cleanup,
- screen-per-block fragmentation,
- god-screen consolidation,
- forgotten lifecycle points,
- WLT finance leakage,
- Field being incorrectly inserted into order flow,
- noisy docs,
- premature OpenAPI/backend/runtime work,
- and verbal closure claims without evidence.

The package **does not permit the agent to declare final product closure**. The only acceptable final target before the user's design review is:

```text
READY_FOR_HUMAN_VISUAL_REVIEW_WITH_EVIDENCE
```

Final visual/product acceptance still requires:
- evidence ZIP,
- patch review,
- TypeScript output,
- untracked/staged accounting,
- and screenshots/manual visual review by the user.

## Snapshot facts used to tune this package

From the uploaded branch ZIP scope scan:
- scanned scope files: `320`
- `dsh/` files: `240`
- `dsh/frontend/` files: `205`
- `dsh/docs` files: `24`
- screen candidates: `72`
- preview/fixture files: `32`

These numbers mean inventory must happen before cleanup or implementation.

## Execution order

1. Give the agent `prompts/00_MASTER_AGENT_SYSTEM_PROMPT.md`.
2. Execute `commands/MASTER_EXECUTION_COMMAND.md`.
3. Run one loop at a time only:
   - Loop 0: rules and docs-noise control.
   - Loop 1: total existing inventory.
   - Loop 2: global lifecycle coverage.
   - Loop 3: missing logic/UI/API-gap mapping.
   - Loop 4: add missing logic skeletons only.
   - Loop 5: organize only after coverage is proven.
   - Loop 6: visual review readiness.
4. After every loop, run `commands/POST_LOOP_EVIDENCE_COMMAND.ps1`.
5. Review generated evidence and patch before proceeding.
6. Never accept `PASS/CLOSED/100%` from the agent. Accept only controlled statuses.

## Package files

- `prompts/00_MASTER_AGENT_SYSTEM_PROMPT.md`
- `prompts/10_LOOP_0_DOCS_NOISE_AND_AGENT_CONTEXT.md`
- `prompts/20_LOOP_1_TOTAL_EXISTING_COVERAGE_INVENTORY.md`
- `prompts/30_LOOP_2_GLOBAL_DSH_LIFECYCLE_COVERAGE.md`
- `prompts/40_LOOP_3_MISSING_LOGIC_AND_UI_GAP_MAP.md`
- `prompts/50_LOOP_4_ADD_MISSING_LOGIC_SKELETONS_ONLY.md`
- `prompts/60_LOOP_5_ORGANIZE_AFTER_COVERAGE.md`
- `prompts/70_LOOP_6_READY_FOR_HUMAN_VISUAL_REVIEW.md`
- `scripts/CHECK_DSH_TOTAL_COVERAGE_INVENTORY.ps1`
- `scripts/VERIFY_DSH_LOOP_GATE.ps1`
- `commands/MASTER_EXECUTION_COMMAND.md`
- `commands/POST_LOOP_EVIDENCE_COMMAND.ps1`
- `gates/ACCEPTANCE_CRITERIA.md`
- `gates/BLOCKERS_AND_STOP_RULES.md`
- `reviews/PATCH_REVIEW_PROTOCOL.md`
- `reviews/VISUAL_REVIEW_PROTOCOL.md`
- `templates/*.csv`

# Agent Change Ledger

This ledger records governed updates to agent and skill files for `bthwani-suite`.

Use this file when:

- an agent file changes
- a skill file changes
- a governance rule for agent behavior changes
- a validation checklist changes

Do not use this file for unrelated product implementation changes.

## Change Record Template

Copy this block for every accepted update.

### Template Metadata

- Date:
- Author:
- Files changed:
- Change type: `guard` | `clarification` | `deduplication` | `contradiction-fix` | `scope-tightening` | `validation` | `rollback`

### Template Rationale

- Trigger:
- Observed problem:
- Why existing rules were insufficient:

### Template Change Summary

- Added:
- Updated:
- Removed:

### Template Safety Checks

- Duplicate-rule check: `PASS` | `FAIL`
- Contradiction check: `PASS` | `FAIL`
- Scope expansion check: `PASS` | `FAIL`
- Noise check: `PASS` | `FAIL`
- Minimal-patch check: `PASS` | `FAIL`

### Template Expected Effect

- What failure or ambiguity this change should prevent:
- What behavior becomes stricter or clearer:

### Template Verification

- Validation method:
- Result:
- Residual risk or [TBD]:

### Template Rollback

- Safe rollback path:
- When rollback should be considered:

## Active Entries

### AGENT-2026-04-11-002

- Date: 2026-04-11
- Author: GitHub Copilot
- Files changed: `.github/agents/bthwani-surface-core-lossless.agent.md`, `.github/agents/bthwani-suite-core-steward.agent.md`, `.github/skills/bthwani-workspace-boundaries/SKILL.md`, `.github/skills/bthwani-task-contracts/SKILL.md`, `.github/skills/bthwani-slice-orchestration/SKILL.md`, `.github/skills/bthwani-violation-audit/SKILL.md`, `.github/skills/bthwani-unified-experience-review/SKILL.md`, `tools/scripts/validate-agent-governance.mjs`, `package.json`, `docs/governance/AGENT_CHANGE_LEDGER.md`
- Change type: `scope-tightening`

#### AGENT-2026-04-11-002 Rationale

- Trigger: The surface agent had grown into a monolithic manual with repeated laws that should be selectively loaded as skills instead of remaining always-on.
- Observed problem: Core routing, detailed workflow rules, target-fit contracts, violation audit rules, and slice orchestration rules were all packed into the canonical agent file, increasing token cost and duplicate-governance risk.
- Why existing rules were insufficient: The repo already had several specialized skills, but the core agent still duplicated detailed policy and there was no automated guard to detect regressions in the governance structure.

#### AGENT-2026-04-11-002 Change Summary

- Added: `bthwani-workspace-boundaries`, `bthwani-task-contracts`, `bthwani-slice-orchestration`, and `bthwani-violation-audit` skills; automated governance validation script; `guard:agent-governance` package script.
- Updated: `bthwani-surface-core-lossless.agent.md` into a thin canonical routing core; `bthwani-suite-core-steward.agent.md` with explicit surface-governance delegation; `bthwani-unified-experience-review` to fix the stale eight-item reference.
- Removed: detailed duplicated laws from the canonical surface agent core after relocating them to skill files.

#### AGENT-2026-04-11-002 Safety Checks

- Duplicate-rule check: `PASS`
- Contradiction check: `PASS`
- Scope expansion check: `PASS`
- Noise check: `PASS`
- Minimal-patch check: `PASS`

#### AGENT-2026-04-11-002 Expected Effect

- What failure or ambiguity this change should prevent: monolithic-agent drift, duplicated governance across agent and skills, stale contract language, and unvalidated regressions in the thin-core architecture.
- What behavior becomes stricter or clearer: the agent core now routes; skills now own domain detail; governance validation now checks the canonical core, required BTHWANI skills, and the governance documents before acceptance.

#### AGENT-2026-04-11-002 Verification

- Validation method: diagnostics on changed files plus `pnpm guard:agent-governance`.
- Result: `PASS`
- Residual risk or [TBD]: `bthwani-suite-core-steward.agent.md` still contains broader bootstrap governance outside this surface refactor; it now delegates surface authority correctly, but a future dedicated bootstrap-agent compression pass may still be beneficial.

#### AGENT-2026-04-11-002 Rollback

- Safe rollback path: restore the previous canonical agent body and remove the new skill files and validation script as one governance batch.
- When rollback should be considered: if future usage shows the routing core became too thin to discover the correct skill set reliably.

### AGENT-2026-04-11-001

- Date: 2026-04-11
- Author: GitHub Copilot
- Files changed: `.github/agents/bthwani-surface-core-lossless.agent.md`, `.github/skills/bthwani-unified-experience-review/SKILL.md`, `docs/governance/AGENT_CHANGE_LEDGER.md`, `docs/governance/AGENT_UPDATE_VALIDATION_CHECKLIST.md`
- Change type: `validation`

#### AGENT-2026-04-11-001 Rationale

- Trigger: Need governed, safe, ongoing improvement of agent behavior during live usage.
- Observed problem: The repo had strong quality laws, but no explicit self-improvement protocol, no mandatory ledger, and no dedicated validation checklist for agent-file changes.
- Why existing rules were insufficient: They governed slice quality and review quality, but did not fully govern how the agent itself evolves.

#### AGENT-2026-04-11-001 Change Summary

- Added: governed self-improvement law, precision-without-fiction law, validation gate, change ledger, validation checklist.
- Updated: unified review skill to require ledger and checklist coverage for governance updates.
- Removed: nothing.

#### AGENT-2026-04-11-001 Safety Checks

- Duplicate-rule check: `PASS`
- Contradiction check: `PASS`
- Scope expansion check: `PASS`
- Noise check: `PASS`
- Minimal-patch check: `PASS`

#### AGENT-2026-04-11-001 Expected Effect

- What failure or ambiguity this change should prevent: silent policy drift, duplicate rules, contradictory policy edits, and untracked agent self-modification.
- What behavior becomes stricter or clearer: agent governance updates now require explicit reason, explicit validation, and explicit logging.

#### AGENT-2026-04-11-001 Verification

- Validation method: file diagnostics plus targeted search for inserted governance markers.
- Result: `PASS`
- Residual risk or [TBD]: future governance updates still depend on correct human or agent judgment when classifying whether a rule is genuinely new.

#### AGENT-2026-04-11-001 Rollback

- Safe rollback path: revert only the specific governance sections or checklist entries introduced by this change.
- When rollback should be considered: if a later rule proves redundant, contradictory, or too heavy for the governed workflow.

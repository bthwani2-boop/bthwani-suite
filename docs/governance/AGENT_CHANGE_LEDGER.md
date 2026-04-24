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

### AGENT-2026-04-24-001

- Date: 2026-04-24
- Author: GitHub Copilot
- Files changed: `governance/EXECUTION_LAW.md`, `.github/agents/platform-agent-os-2026-v3-additive/Policies/bth.token.rename.alias.policy.md`, `AGENTS.md`, `.github/agents/bthwani-platform-master-orchestrator-2026-v3-additive.agent.md`, `.github/agents/bthwani-suite-core-steward.agent.md`, `.github/agents/bthwani-surface-core-lossless.agent.md`, `.github/agents/platform-agent-os-2026-v3-additive/OS/MASTER_ORCHESTRATOR.md`, `docs/governance/AGENT_CHANGE_LEDGER.md`
- Change type: `guard`

#### AGENT-2026-04-24-001 Rationale

- Trigger: Bth/bth/BTH rename and normalization work needed an explicit file-by-file policy so future agents do not treat it as a blind global replace.
- Observed problem: the repo already had legacy-name normalization guidance, but it did not spell out the per-file analysis, alias, backup, verification, and rollback workflow for token-specific renames.
- Why existing rules were insufficient: the prior naming laws covered target normalization and legacy donor handling, but they did not fully gate BTH-token refactors that can affect brand, package, repo, or consumer-facing identifiers.

#### AGENT-2026-04-24-001 Change Summary

- Added: a canonical BTH token rename and alias policy file with required workflow, direct-rename gate, alias gate, and short card.
- Updated: root and agent-level instructions to point at the canonical policy and enforce file-by-file handling.
- Removed: nothing.

#### AGENT-2026-04-24-001 Safety Checks

- Duplicate-rule check: `PASS`
- Contradiction check: `PASS`
- Scope expansion check: `PASS`
- Noise check: `PASS`
- Minimal-patch check: `PASS`

#### AGENT-2026-04-24-001 Expected Effect

- What failure or ambiguity this change should prevent: blind global replacements, unsafe brand or package renames, and premature alias removal for BTH-token changes.
- What behavior becomes stricter or clearer: future agents must analyze one file at a time, classify token scope before changing it, and keep aliases only for compatibility.

#### AGENT-2026-04-24-001 Verification

- Validation method: markdown review of the new policy and instruction references.
- Result: `PASS`
- Residual risk or [TBD]: any future agent file that bypasses the root or orchestrator instructions may still need the same reference added locally.

#### AGENT-2026-04-24-001 Rollback

- Safe rollback path: remove the new policy file and the added instruction references, then delete this ledger entry.
- When rollback should be considered: if the policy needs to be re-scoped, renamed, or centralized in a different canonical governance file.

### AGENT-2026-04-18-001

- Date: 2026-04-18
- Author: GitHub Copilot
- Files changed: `.github/agents/bthwani-platform-master-orchestrator-2026-v3-additive.agent.md`, `docs/governance/AGENT_CHANGE_LEDGER.md`
- Change type: `guard`

#### AGENT-2026-04-18-001 Rationale

- Trigger: The master orchestrator needed an explicit routing anchor, a mandatory output contract, and a non-placeholder source of truth for brand hex values.
- Observed problem: The agent file stated the 100/100 law and source precedence, but it did not yet force the route decision to resolve against the routing index or require a fixed report shape.
- Why existing rules were insufficient: The prior wording allowed the same high-level intent to be interpreted without a precise base profile, output contract, or ui-kit source reference.

#### AGENT-2026-04-18-001 Change Summary

- Added: routing authority, routing discipline, and output contract sections in `.github/agents/bthwani-platform-master-orchestrator-2026-v3-additive.agent.md`.
- Updated: the brand identity law to require exact hex values from ui-kit token source files.
- Removed: the `[TBD]` placeholder wording from the brand identity law.

#### AGENT-2026-04-18-001 Safety Checks

- Duplicate-rule check: `PASS`
- Contradiction check: `PASS`
- Scope expansion check: `PASS`
- Noise check: `PASS`
- Minimal-patch check: `PASS`

#### AGENT-2026-04-18-001 Expected Effect

- What failure or ambiguity this change should prevent: unanchored routing decisions, inconsistent final output shape, and placeholder brand values in a master governance agent.
- What behavior becomes stricter or clearer: the orchestrator must resolve against the routing index first, then report the chosen route, evidence, and decision in a stable structure.

#### AGENT-2026-04-18-001 Verification

- Validation method: markdown review of the updated agent file and syntax/error check on the edited file.
- Result: `PASS`
- Residual risk or [TBD]: future routing additions may still need a dedicated expansion to keep the routing index and agent body synchronized.

#### AGENT-2026-04-18-001 Rollback

- Safe rollback path: remove the three added sections and restore the previous brand identity wording in the agent file, then delete this ledger entry.
- When rollback should be considered: if the routing index later changes shape or if the output contract must be re-harmonized with another canonical governance file.

### AGENT-2026-04-12-001

- Date: 2026-04-12
- Author: GitHub Copilot
- Files changed: `governance/OWNERSHIP.md`, `docs/governance/AGENT_CHANGE_LEDGER.md`
- Change type: `scope-tightening`

#### AGENT-2026-04-12-001 Rationale

- Trigger: The repo needed one explicit governing rule to resolve `surface-owned` versus `service-owned` placement without repeated interpretation.
- Observed problem: The ownership docs already named the boundaries, but they did not yet include a concise decision matrix for app-wide versus service-specific artifacts.
- Why existing rules were insufficient: The current ownership language described who owns which area, but not the exact test for classifying shared app surfaces versus service-owned surfaces.

#### AGENT-2026-04-12-001 Change Summary

- Added: a dedicated `surface-owned` vs `service-owned` rule, a fast decision test, and a global boundary rule inside `governance/OWNERSHIP.md`.
- Updated: the governance ledger to record the rule addition.
- Removed: nothing.

#### AGENT-2026-04-12-001 Safety Checks

- Duplicate-rule check: `PASS`
- Contradiction check: `PASS`
- Scope expansion check: `PASS`
- Noise check: `PASS`
- Minimal-patch check: `PASS`

#### AGENT-2026-04-12-001 Expected Effect

- What failure or ambiguity this change should prevent: repeated debates about whether app-wide account, notifications, settings, support, or shell behavior belongs in `surface-owned` or `service-owned`.
- What behavior becomes stricter or clearer: reusable app-wide truth now defaults to `surface-owned`, while service-specific truth must justify a separate `service-owned` home.

#### AGENT-2026-04-12-001 Verification

- Validation method: manual governance review of the updated markdown structure and rule placement.
- Result: `PASS`
- Residual risk or [TBD]: future rules may still need matching updates in other governance files if a new exception surface is formally introduced.

#### AGENT-2026-04-12-001 Rollback

- Safe rollback path: remove the new section from `governance/OWNERSHIP.md` and delete this ledger entry.
- When rollback should be considered: if the rule is later duplicated in a stronger canonical location or if a contradiction emerges with a future ownership policy.

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

### AGENT-2026-04-11-003

- Date: 2026-04-11
- Author: GitHub Copilot
- Files changed: `.github/agents/bthwani-surface-core-lossless.agent.md`, `.github/agents/AGENT_ROUTING_INDEX.md`, `.github/agents/base-profiles/PROFILE_ANALYZE_FIRST_PASS.md`, `.github/agents/base-profiles/PROFILE_BUILD_SLICE.md`, `.github/agents/base-profiles/PROFILE_DONOR_TRACE_RECONSTRUCT.md`, `.github/agents/base-profiles/PROFILE_READY_PACK.md`, `.github/agents/base-profiles/PROFILE_INFRA_WORKSPACE_LINK.md`, `.github/agents/overlays/OVERLAY_DESIGN_REVIEW.md`, `.github/agents/overlays/OVERLAY_UX_FLOW_REVIEW.md`, `.github/agents/overlays/OVERLAY_USER_REVIEW_GATES.md`, `.github/agents/overlays/OVERLAY_VIOLATION_AUDIT.md`, `tools/scripts/validate-agent-governance.mjs`, `docs/governance/AGENT_CHANGE_LEDGER.md`
- Change type: `clarification`

#### AGENT-2026-04-11-003 Rationale

- Trigger: A stronger external manual showed a cleaner routing architecture based on one base profile plus optional overlays.
- Observed problem: The thin core already removed most domain detail, but it still listed skills as a flat set instead of encoding explicit routing layers and isolation rules.
- Why existing rules were insufficient: They preserved brevity, but did not yet formalize the minimal-load decision tree that keeps token usage consistently low across task types.

#### AGENT-2026-04-11-003 Change Summary

- Added: agent routing index, base profile files, overlay files, and validator coverage for those routing assets.
- Updated: canonical surface kernel to route through one base profile plus minimal overlays.
- Removed: flat always-visible skill routing list from the canonical kernel.

#### AGENT-2026-04-11-003 Safety Checks

- Duplicate-rule check: `PASS`
- Contradiction check: `PASS`
- Scope expansion check: `PASS`
- Noise check: `PASS`
- Minimal-patch check: `PASS`

#### AGENT-2026-04-11-003 Expected Effect

- What failure or ambiguity this change should prevent: overloading the kernel with too many simultaneously visible routing options, mixing infra linking with design governance, and loading expensive review logic when the task does not justify it.
- What behavior becomes stricter or clearer: routing now starts from a single base intent, then adds overlays only when proven necessary.

#### AGENT-2026-04-11-003 Verification

- Validation method: file diagnostics plus `pnpm guard:agent-governance` after adding routing assets and validator checks.
- Result: `PASS`
- Residual risk or [TBD]: live use will still be the final test for whether the chosen base-profile taxonomy is sufficiently exhaustive.

#### AGENT-2026-04-11-003 Rollback

- Safe rollback path: remove the added routing assets and restore the previous flat skill-routing section in the canonical kernel.
- When rollback should be considered: if base-profile routing proves harder to maintain than the value it saves in token usage.

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

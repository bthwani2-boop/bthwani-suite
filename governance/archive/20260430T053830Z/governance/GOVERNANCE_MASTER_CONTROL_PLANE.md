# BThwani Governance Master Control Plane

Status: CANONICAL_MASTER_CONTROL_PLANE
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_11_REBUILD_CONTROL_PLANE_AND_GUARDS-20260430-003134
LastRebuiltBy: GOVERNANCE_BATCH_11_REBUILD_CONTROL_PLANE_AND_GUARDS-20260430-003134

## Purpose

This file is the top-level routing authority for governance, guards, evidence, agents, skills, workflows, and canonicalization decisions.

## Canonical roots

| Root | Role | Rule |
|---|---|---|
| governance/ | Canonical policy, standards, decisions, ledgers, indexes | Human-readable authority |
| tools/guards/ | Executable guard checks | Must be runnable and evidence-backed |
| tools/scripts/ | Controlled automation and diagnostics | Must be scope-safe |
| tools/registry/runs/ | Evidence output | Generated proof only |
| .github/workflows/ | CI/CD enforcement | Enforcement, not policy authorship |
| .github/agents/ | Agent contracts | Derived from governance |
| .github/skills/ | Skill contracts | Derived from governance |
| .cursor/rules/ | IDE rules | Derived from governance |

## Current verified counts

| Metric | Count |
|---|---:|
| Governance-related files scanned | 431 |
| Guard files scanned | 25 |
| Script files scanned | 55 |
| Agent/skill/rule files scanned | 209 |
| Workflow files scanned | 4 |
| Active docs/governance references | 0 |
| Classified candidates | 190 |
| Unclassified candidates | 0 |

## Closure rule

No governance or guard work may be called 100% closed unless all of the following are true:

- git diff --check passes
- pnpm -w exec tsc --noEmit passes
- all tools/guards/guard-*.mjs pass
- evidence pack exists under tools/registry/runs
- active docs/governance references are zero
- every duplicate/contradiction candidate is either resolved or explicitly classified with a follow-up decision
- GitHub contains the final commit after push
- CI status is checked when available

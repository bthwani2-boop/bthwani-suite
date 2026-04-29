# Governance Finalization Protocol

Status: CANONICAL_PROTOCOL
Owner: BThwani Governance
LastStandardizedBy: GOVERNANCE_BATCH_09_RESCUE_STANDARDIZE_CLOSE-20260430-001242

## Final closure gates

Governance may be called closed only when:

- git status is understood
- git diff --check passes
- pnpm -w exec tsc --noEmit passes
- all tools/guards guard-*.mjs pass
- no active docs/governance references remain
- evidence pack exists under tools/registry/runs
- local commit exists
- GitHub branch contains the commit after push
- CI status is checked when available

## Decision vocabulary

Allowed decisions:

- PASS
- PASS_WITH_WARNINGS
- FIX_REQUIRED
- BLOCKED
- READY_FOR_PR
- REVERT_REQUIRED
- NEEDS_EVIDENCE
- NEEDS_VISUAL_EVIDENCE

## Push rule

GitHub push is a separate operation and must not be hidden inside standardization scripts.

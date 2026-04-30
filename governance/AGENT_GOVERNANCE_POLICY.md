# Agent Governance Policy

Status: TRANSITIONAL_ALIAS
Owner: BThwani Governance
CanonicalTarget: `14_AGENT_EXECUTION_RULES.md`

## Reason This File Still Exists

This path remains only because active references in `.github/**` and `tools/scripts/**` still point to it during control-plane cleanup.

Its former live authority has been merged into the canonical agent execution rules file.

## Non-Authority Rule

This file must not introduce new rules for:

- execution modes
- prompt standards
- patch review
- batching
- evidence handoff
- final decision vocabulary

Use `14_AGENT_EXECUTION_RULES.md` instead.

## Deletion Gate

This alias may be removed only after:

- reference repair is complete
- the action is recorded in `GOVERNANCE_REORGANIZATION_LEDGER.md`
- no active consumer still depends on this path

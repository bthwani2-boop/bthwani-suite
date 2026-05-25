# BThwani Agent Authority Boundary

## Source precedence

1. User instruction and safety policy.
2. Current branch and current repo files.
3. Canonical governance under `governance/`.
4. Active operational guidance under `.agents/`.
5. Donor snapshots and deleted-history extraction as read-only reconstruction sources.
6. External patterns as optional inspiration only.

## Responsibility split

- Governance decides project policy, service details, app details, domain logic, and stack direction.
- `.agents` gives reusable operational methods for all agents.
- Adapters connect Claude/Codex/Copilot/Gemini/Cursor/OpenCode back to `.agents`.
- Guards verify rules programmatically.
- Evidence records local reality and review history.

## Non-negotiable boundaries

- No bridges.
- No mirrors.
- No direct restore of deleted agent trees.
- No governance duplication inside tool adapters.
- No long copied donor or external docs inside active agent files.
- Donor files are extraction sources only, not active authority.
- Skills must be general and executable across BThwani.
- Service/application specialization belongs in `governance/`, not inside `.agents` skills.

## Execution budget

Canonical law: [`governance/15_AGENT_AND_AI_EXECUTION.md`](../governance/15_AGENT_AND_AI_EXECUTION.md).

- Read the narrowest 1–2 relevant skills only; do not open the full catalog.
- No full lint, workspace `tsc`, all guards, evidence pack, or ZIP by default.
- Evidence form and size are determined by human request and task nature — not by task class alone.
- No repetitive wait-loop chatter; one timed wait notice maximum.

## Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` without Git diff, verification, and evidence.

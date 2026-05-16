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

## Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` without Git diff, verification, and evidence.

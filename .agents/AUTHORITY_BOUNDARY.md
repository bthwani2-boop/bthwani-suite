# BThwani Agent Authority Boundary

## Source precedence

1. User instruction and safety policy.
2. Current branch and current repo files.
3. Canonical governance under `governance/`.
4. Active operational guidance under `.agents/`.
5. Donor snapshots and deleted-history extraction as read-only reconstruction sources.
6. External patterns as optional inspiration only.

## Responsibility split

- Governance decides project policy and stack direction.
- `.agents` executes operational guidance for agents.
- Root entry adapters connect tool-specific entry files back to `.agents`.
- Guards verify rules programmatically.
- Evidence records history and review artifacts.

## Non-negotiable boundaries

- No bridges.
- No mirrors.
- No direct restore of deleted agent trees.
- No governance duplication inside tool adapters.
- No long copied donor or external docs inside active agent files.
- Donor files are extraction sources only, not active authority.

## Active roots

Treat the current flat workspace roots from `pnpm-workspace.yaml` as the live target set unless the current branch proves otherwise.

## Acceptance rule

No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.


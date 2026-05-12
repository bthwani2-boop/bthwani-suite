# Agent and AI Execution

**Status:** Canonical Governance Payload v2
**Owner:** `Execution Governance`

## Purpose

This file defines governance boundaries for agent-assisted work. It is not a prompt library, skill mirror, or tool-specific operating manual.

## Boundary split

- `governance/` decides policy, scope, acceptance, and decision vocabulary.
- `.agents/` executes agent instructions, skills, and adapters.
- root adapters and tool entry files connect external tooling back to `.agents/`.
- `tools/guards/` verifies compliance programmatically.
- `tools/registry/runs/{SESSION_ID}/` stores evidence and historical review output.

## Anti-duplication law

- Governance must not duplicate `.agents/` skills, prompts, or tool-entry instructions.
- `.agents/` must not redefine platform policy owned by governance.
- Retired GitHub-side agent roots are invalid as active agent authority.

## Minimum acceptance

Agent-assisted work must keep approved scope, owner-file boundaries, diff proof, and required evidence.

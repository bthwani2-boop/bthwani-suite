# Agent Update Validation Checklist
**Status:** Canonical governance guard support file
**Owner:** Agent Governance
**Canonical repo:** C:\bthwani-suite
**Canonical governance root:** governance/
**Active owner file:** governance/15_AGENT_AND_AI_EXECUTION.md
## Required Ledger
Agent changes must be recorded in AGENT_CHANGE_LEDGER.md.
## Checklist
- Changed agent/profile/overlay/skill path is known.
- Canonical owner file under governance/ is known.
- No duplicate headings.
- No broad fix-everything routing.
- AGENT_CHANGE_LEDGER.md has a matching entry.
- pnpm -w run guard:agent-governance passes.
- git --no-pager diff --check passes.
- Evidence pack exists under tools/registry/runs/{SESSION_ID}/.
## Non-Authority Notice
This file supports the guard. It does not override governance/15_AGENT_AND_AI_EXECUTION.md.

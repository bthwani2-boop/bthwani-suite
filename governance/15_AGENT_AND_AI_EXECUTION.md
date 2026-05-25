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

## Smart execution budget

- `Use relevant skills` means read only the narrowest 1-2 relevant skills. Do not open the full skill catalog unless direct evidence shows that more context is required.
- LOW and MEDIUM work must not default to full lint, workspace `tsc`, all guards, registry evidence, or ZIP creation.
- HIGH work such as governance, agents, guards, scripts, architecture, or other multi-file sensitive changes may justify targeted guards, PowerShell syntax validation for modified `.ps1`, and a registry evidence folder.
- COMMIT/PUSH preparation should stop at `git status` and staged `git diff --check`; let hooks run instead of replaying them manually.
- Repetitive wait-loop chatter is forbidden. One timed wait notice is allowed only when a specific blocking operation is in progress.

الجدول الكامل للـ task classes (LOW / MEDIUM / UI_VISIBLE / HIGH / COMMIT/PUSH) وحجم الدليل المقابل لكل class محدد في [`governance/11_EVIDENCE_AND_TRACEABILITY.md`](11_EVIDENCE_AND_TRACEABILITY.md). لا تعد تعريفه هنا.

## Minimum acceptance

Agent-assisted work must keep approved scope, owner-file boundaries, diff proof, and required evidence.

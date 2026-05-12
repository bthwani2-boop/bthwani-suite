---
name: bthwani-agent-governance-execution
description: Enforce scoped execution, forensics, verification, and evidence for agent-related work.
version: 2026.05.12-v3
---
# Purpose
Run agent, adapter, governance-adjacent, or evidence work through the required BThwani execution flow.
# When to use
- any task that touches `AGENTS.md`, `.agents/**`, `.github/copilot-instructions.md`, `.codex/**`, `.cursor/**`, `opencode.json`, `governance/**`, or `tools/guards/**`
# Inputs
- task scope
- touched paths
- verification commands
- evidence session id when files change
# Steps
1. CHECK current Git state and relevant files.
2. FORENSICS the current and deleted sources before rewriting structure.
3. DRYRUN any risky script or workflow before applying it.
4. APPLY only inside the approved scope.
5. VERIFY with diff, check, and type or build evidence when relevant.
6. Export PATCH and EVIDENCE artifacts for review.
# Forbidden actions
- commit, push, PR, merge, or GitHub write without explicit approval
- dependency or lockfile changes outside scope
- broad refactors while doing agent-only or governance-only work
# Required evidence
- `git --no-pager status --short`
- `git --no-pager diff --check`
- scope lock and command log
- registry evidence zip when files change
# Output contract
```text
method:
scope:
changed_files:
diff_check:
typecheck:
evidence_zip:
untracked_files:
decision: DONE / BLOCKED
```
# Governance references
- `governance/03_REPO_BOUNDARIES.md`
- `.agents/AUTHORITY_BOUNDARY.md`
- `.agents/UPDATE_POLICY.md`
# Acceptance rule
No `PASS`, `CLOSED`, `FINAL`, or `100%` without Git diff, verification, and evidence.

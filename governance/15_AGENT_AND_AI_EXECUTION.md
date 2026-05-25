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

## Universal agent constraints

These rules apply to every agent and every AI tool operating in `C:\bthwani-suite`.

**Reading:**

- Read `AGENTS.md`, `.agents/AUTHORITY_BOUNDARY.md`, the relevant adapter, the relevant `governance/` source, and 1–2 relevant skills only.
- Do not open `.agents/SKILL_CATALOG.md` or `.agents/README.md` unless skill selection is genuinely unclear or direct evidence requires it.
- Do not read all of `.agents/`, `governance/`, or any skills catalog by default.

**Skills:**

- `Use relevant skills` means read only the narrowest 1–2 skills that materially help the task.
- Do not open unrelated skills.
- Do not invoke broad skill bundles for targeted work.

**Evidence — canonical law in [`governance/11_EVIDENCE_AND_TRACEABILITY.md`](11_EVIDENCE_AND_TRACEABILITY.md):**

- Evidence form and size are determined by human request and task nature.
- Task classification (LOW / MEDIUM / UI_VISIBLE / HIGH / COMMIT/PUSH) estimates execution risk only — it does not determine fixed evidence size or prescribe fixed evidence tiers.
- Minimum proof after any local write: `git status`, `git diff --name-status`, `git diff --check`.
- No evidence pack (registry folder) by default.
- No ZIP by default.
- Registry folder `tools/registry/runs/{SESSION_ID}/` only when the human requests it or the workflow is sensitive and proven: patch review, checkpoint, CI, release, guard runner, scripted change.
- ZIP only when the human explicitly requests it or one upload artifact is practically needed.
- docs/policy/agents/governance-only work requires Git proof only — no tsc, no build, no evidence pack.

**Verification:**

- workspace `tsc` only for release, broad architecture, config/export risk, or explicit human request.
- No full lint, no `run-many`, no `all guards` by default.
- Targeted typecheck for affected project/path only when TS/TSX/config/exports are touched.
- UI changes require screenshots.
- Runtime/behavior changes require runtime evidence.

**Output:**

- No long reports or summaries unless explicitly requested by the human.
- No repetitive wait-loop chatter. One timed wait notice is the maximum when a real blocking operation is in progress.

**Heavy commands — opt-in only when explicitly requested or scope-proven:**

- `pnpm run serve:surfaces` / `pnpm run build:surfaces`
- `pnpm run build:mobile-control-panel`
- `pnpm nx run-many --target=build` / `pnpm nx run-many --target=serve`
- `pnpm run guard:governance:all`

No agent may run these automatically for a docs, policy, agent, or governance-only change.

## Smart execution budget

- LOW and MEDIUM work must not default to full lint, workspace `tsc`, all guards, registry evidence, or ZIP creation.
- HIGH work (governance, agents, guards, scripts, architecture, multi-file sensitive) may justify targeted guards, PowerShell syntax validation for modified `.ps1`, and a registry evidence folder — only when the risk is real and the human has not said otherwise.
- COMMIT/PUSH preparation stops at `git status` and staged `git diff --check`; let hooks run instead of replaying them manually.

## Minimum acceptance

Agent-assisted work must keep approved scope, owner-file boundaries, diff proof, and required evidence.

---
name: bthwani-evidence-gate-router-contract
description: Select the minimum set of guards and tools for any BThwani task. Use before choosing any analysis tool. Prevents all-tools-at-once runs, Graphify leadership, and unjustified Heavy gate execution.
version: 2026.06.13-v1
---

# bthwani-evidence-gate-router-contract

## Purpose

Route every agent task to the correct minimum gate tier and tool set.
This skill replaces the pattern of running all tools by default, treating Graphify as an orchestrator, or defaulting to Heavy gate checks on daily work.

## Trigger

Use this skill whenever:
- Selecting which tools or guards to run for a task
- A task touches more than one file or surface
- A task requires a guard decision (type, design, structure, API, runtime, security)
- A previous agent step ran too many tools or claimed PASS without evidence

Do NOT use this skill for:
- Pure text or docs changes with zero code impact (use git diff --check only)
- Single-file text rewrites with no cross-file impact

## Step 1 — Classify the Task

| Class | Trigger |
|---|---|
| LOW | Docs, prompts, text-only, port checks, git-status, zero code writes |
| MEDIUM | 1–few targeted code files, no cross-surface change |
| UI_VISIBLE | Any visible UI change (mobile or web) |
| HIGH | Governance, agents, guards, scripts, ui-kit exports, multi-surface, architecture |
| COMMIT/PUSH | Pre-commit or pre-push only |

## Step 2 — Select Gate Tier

See `.agents/EVIDENCE_GATE_ROUTER.md` for the full gate-tier definition.

**Fast Gate** (LOW): `git status` + `git diff --check` only.

**Scoped Gate** (MEDIUM / UI_VISIBLE / HIGH):
- `git status`, `git diff --check`
- Targeted `tsc` if TS files changed
- Select 1–2 domain contract skills from the list below
- Optional Graphify if cross-file scope is unknown

**Heavy Gate** (PR / Release / Security-sensitive only):
- Full suite + CodeQL / SonarQube / Semgrep / Trivy / Checkov
- Requires explicit human request or release criteria

## Step 3 — Select Minimum Tools

Do NOT run all tools. Select only what the task and gate tier justify.

Use `guard-manifest.json` (when present) as the routing source for domain guards.
Use `package.json` scripts as the execution interface.

### Design / UI (Scoped Gate)
- `@ast-grep/cli` — structural pattern detection
- `@tamagui/cli` — Tamagui boundary validation
- `react-scanner` — component usage scan
- `style-dictionary` — design token validation
- `stylelint` — CSS rule validation
- `dependency-cruiser` — boundary checking
- `babel-plugin-react-compiler` / `eslint-plugin-react-compiler` — compiler lint

### Journey / Runtime (Scoped → Heavy)
- `@playwright/test` — Scoped: smoke only; Heavy: full suite
- `@cucumber/cucumber` — Scoped: targeted scenario; Heavy: full suite

### Structure / Organization (Scoped Gate)
- `@ls-lint/ls-lint` — naming conventions
- `jscpd` — duplication detection
- `knip` — unused file/export signal
- `madge` — dependency cycle inspection
- `sherif` — monorepo package consistency
- `repomix` — context compression before heavy reads

### API (Scoped Gate)
- `@stoplight/spectral-cli` — OpenAPI contract validation
- `openapi-typescript` — type generation/verification

### Build / Workspace (Scoped Gate)
- `typescript` / `tsc` — type safety (targeted, not workspace-wide by default)
- `nx` — task execution via `pnpm nx`
- `next` / `expo` — surface build validation when explicitly needed

### Heavy Gates — Blocked except at PR / Release / Security
- CodeQL
- SonarQube
- Semgrep
- Trivy
- Checkov

## Step 4 — Graphify Usage Decision

Use Graphify ONLY when:
- The file scope is unknown and requires cross-file discovery
- The task involves dependency paths, import/export chains, or cross-surface impact
- The task asks "where does X live?" or "what is connected to Y?"

Do NOT use Graphify when:
- File scope is already known (file list in the task or previous context)
- The task is text/docs/agents/governance-only
- The task requires type, security, runtime, or contract proof (use dedicated tools)

Do NOT run `graphify update .` by default. Run `graphify update .` or a focused update only when:
- The task modified code structure or imports AND
- Subsequent steps in the same session require accurate graph navigation AND
- There is explicit justification

Do NOT claim PASS / READY / CLOSED / SAFE / FINAL / 100% from Graphify output alone.

## Step 5 — Produce Evidence

Normalized evidence for required tasks:

```text
tools/registry/runs/{SESSION_ID}/
  decision.txt          ← gate tier + tools selected + justification
  evidence-summary.json ← findings per tool
  tool-selection.json   ← tools selected vs skipped + reason
  blocking-findings.csv ← any blocking issue per file
  full-logs/            ← raw tool output
  before/               ← pre-change file backups
```

Evidence pack is mandatory for: HIGH / PR / Release / explicit human request.
Evidence pack is NOT required for: LOW / MEDIUM docs-only / agents-only.

## Rules

- No tool runs without a gate-tier justification.
- No Graphify as orchestrator or leader.
- No graphify update . by default.
- No Heavy gate tools on daily / docs / agents / governance work.
- No PASS / CLOSED / READY / FINAL / SAFE / 100% without evidence pack.
- guard-manifest.json is the routing source for domain guards when present.
- package.json scripts are the execution interface, not raw CLI invocation.

## Output Contract

```text
skill: bthwani-evidence-gate-router-contract
task_class: LOW | MEDIUM | UI_VISIBLE | HIGH | COMMIT_PUSH
gate_tier: Fast | Scoped | Heavy
graphify_needed: yes | no
graphify_reason: <blank if no>
tools_selected: []
tools_skipped: []
tool_selection_reason: <per tool>
domain_contracts_selected: []
evidence_required: yes | no
evidence_path: tools/registry/runs/{SESSION_ID}/
blocking_findings: []
decision: PROCEED | NEEDS_EVIDENCE | FIX_REQUIRED | BLOCKED
next_action: <one-line>
```

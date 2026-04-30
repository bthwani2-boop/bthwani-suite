---
generatedFrom: governance/14_AGENT_EXECUTION_RULES.md
generatedAt: 2026-04-30T04:48:37.2173273+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Agent Execution Rules

Status: CANONICAL_POLICY
Owner: BThwani Governance
Scope: AI execution, scope control, batching, prompt quality, patch review, evidence handoff, and stop conditions

## Purpose

This contract controls all AI-assisted development behavior in `C:\bthwani-suite`.

It applies to ChatGPT, GitHub Copilot, VS Code agents, Cursor, Cline, Codex-like agents, DeepSeek-like coding agents, local scripts prepared by AI, and any future agent workflow.

## Authority

`governance/` is the canonical source of truth.

Agent/editor rule files under `.agents`, `.github/agents`, `.github/skills`, `.cursor`, or similar paths must derive from this contract. They must not override it.

## Canonical Repo Facts

| Item | Decision |
|---|---|
| Active local repo | `C:\bthwani-suite` |
| Active GitHub repo | `bthwani2-boop/bthwani-suite` |
| Evidence root | `tools/registry/runs/{SESSION_ID}/` |
| Package manager | `pnpm` |

Do not use or revive any old standalone repo/path named `bth` as active truth.

Allowed current names:

- `bthwani`
- `BThwani`
- `@bthwani/*`
- `bthwani-suite`

## Canonical Execution Modes

Every AI task must declare or imply one mode:

| Mode | Meaning | Write Allowed |
|---|---|---|
| READ_ONLY_AUDIT | analyze, inventory, classify, no writes | No |
| CHECK | run validation only | No product/source writes |
| FORENSICS | collect evidence and reports | Evidence only |
| PLAN | produce plans, prompts, or scoped instructions | Output artifact only |
| APPLY | write approved scoped changes | Yes, allowlist only |
| VERIFY | verify prior changes | Evidence only |
| REVIEW | review patch or evidence | No source writes |
| RUNTIME_VERIFY | run app, route, build, or smoke proof | Evidence only |

Historical wording such as `READ-ONLY` should be interpreted as `READ_ONLY_AUDIT`.

Never mix audit-only and write modes in the same instruction unless the write scope is explicitly listed.

## Required Task Declaration

Every non-trivial AI task must declare:

- repo root
- current branch expectation when branch matters
- allowed files
- forbidden files or roots
- allowed actions
- forbidden actions
- verification commands
- evidence root
- final decision vocabulary
- next step

No agent may silently expand scope.

## Mandatory Scope And Verification Rules

Every APPLY must define:

- allowed files
- forbidden roots
- pre-checks
- backup or rollback path when sensitive
- post-checks
- evidence pack
- final decision status

If allowed files are not explicit, the agent must not write.

## Evidence And Handoff Rule

Every meaningful AI-assisted run must produce evidence under:

```text
tools/registry/runs/{SESSION_ID}/
```

Minimum handoff outputs:

```text
SUMMARY.md
status.txt
evidence.json
commands.log
_HANDOFF.zip
{SESSION_ID}_HANDOFF.zip
```

Branch/evidence workflow details are owned by `02_BRANCH_AND_EVIDENCE_POLICY.md`.

Evidence pack schema details are owned by `18_EVIDENCE_PACK_STANDARD.md`.

## Patch Review Rule

For sensitive local code or governance changes, prefer patch handoff:

```powershell
git --no-pager diff > LOCAL_CHANGE_REVIEW.patch
git --no-pager status --short > LOCAL_CHANGE_STATUS.txt
git ls-files --others --exclude-standard > LOCAL_UNTRACKED_FILES.txt
```

Untracked files are not included in plain `git diff`; they must be listed separately.

Sensitive scopes include:

- scripts
- guards
- CI
- deletion
- migration
- auth/security
- payment/wallet
- public contracts
- shared architecture
- mass refactors

Before accepting a sensitive change:

- inspect changed paths
- inspect untracked paths
- verify no forbidden scope was touched
- run `git --no-pager diff --check`
- run `pnpm -w exec tsc --noEmit` when applicable
- preserve rollback path

## Forbidden Agent Behavior

Agents must not, unless a human explicitly approves the exact scope:

- delete files without zero-reference proof
- move files without owner/consumer proof
- rename files without import/reference proof
- commit
- push
- force push
- merge
- open PR
- close PR
- change remote branch state
- edit workflows broadly
- modify CI, guards, or scripts outside explicit scope
- perform blind global replace
- run broad formatting over unrelated files
- touch DSH during governance repair
- touch apps, packages, or product source during governance-only phases
- claim `CLOSED`, `READY`, `FINAL`, or `100%` without evidence

## Stop Conditions

Execution must stop on:

- wrong branch
- dirty working tree outside expected scope
- missing expected file
- unexpected staged file
- diff-check failure
- typecheck failure
- guard `Errors > 0`
- missing evidence handoff
- unclassified destructive action

## Batching And Acceleration Rule

Acceleration is allowed only by bundling cohesive tasks.

A valid batch shares:

- same owner
- same root
- same risk class
- same verification path
- same commit purpose

Preferred batch sizes:

- docs and policies: 3 to 8 files
- guards and configs: 2 to 5 related files
- service work: one service at a time
- UI work: one screen or flow cluster at a time
- deletions: one deletion family at a time with rollback

Invalid bundles include:

- governance docs plus UI redesign plus API binding
- multiple services without a service matrix
- deletion plus unrelated refactor
- CI hardening plus unrelated feature work

## Broad Prompt Ban And Prompt Standard

Do not give agents broad execution tasks such as:

```text
fix everything
clean the repo
close all gaps
refactor all files
make it 100%
```

unless the task is explicitly decomposed into narrow phases with allowed files and verification.

Large work must be split into smaller phases with one owner and one evidence gate.

Prompts for weaker coding agents must be:

- narrow
- direct
- low ambiguity
- low noise
- path-specific
- measurable
- evidence-driven
- impossible to interpret as repo-wide cleanup

Each prompt should include:

```text
Target repo: C:\bthwani-suite
Scope:
Allowed files:
Forbidden:
Architecture rule:
Verification:
Evidence:
Final decision:
```

## Promotion From Legacy-Extracted

Rules from `governance/archive/legacy-extracted/` become canonical only when they are:

- extracted into a canonical file under `governance/`
- deduplicated
- scoped
- verified
- recorded in `GOVERNANCE_REORGANIZATION_LEDGER.md`

No legacy-extracted file is final policy by itself.

## UI / UX Agent Rule

For UI work, agents must enforce:

- BThwani visual DNA
- deepBlue `#0A2F5C`
- orange `#FF500D`
- white `#FFFFFF`
- RTL-correct Arabic layout
- no random colors
- no local design systems
- `@bthwani/ui-kit` public exports
- Tamagui used internally inside ui-kit only

## Architecture Rule

```text
Screen / Surface / App -> @bthwani/ui-kit public exports -> Tamagui internally inside ui-kit only
```

Apps remain shell-only. app-shells remain shell/root behavior only. surfaces own screens, flows, and experiences. ui-kit owns reusable design.

## Final Decision Vocabulary

The only canonical final closure decisions are:

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

Workflow markers such as `READY_FOR_NEXT_PHASE` may exist in plans or evidence packs, but they are not final closure decisions.

## Agent File Alignment

Actual `.agents`, `.github/agents`, `.github/skills`, `.cursor`, workflow, or tool alignment must be done in later phases only.

Derived files must point back to this policy instead of restating parallel authority.


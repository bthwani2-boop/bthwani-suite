# Agent Execution Rules

## Purpose

This contract controls all AI-assisted development behavior in `C:\bthwani-suite`.

It applies to ChatGPT, GitHub Copilot, VS Code agents, Cursor, Cline, Codex-like agents, DeepSeek-like coding agents, local scripts prepared by AI, and any future agent workflow.

## Authority

`governance/` is the canonical source of truth.

Agent/editor rule files under `.agents`, `.github/agents`, `.github/skills`, `.cursor`, or similar paths must derive from this contract. They must not override it.

## Canonical Repo

| Item | Decision |
|---|---|
| Active local repo | `C:\bthwani-suite` |
| Active GitHub repo | `bthwani2-boop/bthwani-suite` |
| Evidence root | `tools/registry/runs/{SESSION_ID}` |
| Package manager | `pnpm` |

Do not use or revive any old standalone repo/path named `bth`.

Allowed current names:

- `bthwani`
- `BThwani`
- `@bthwani/*`
- `bthwani-suite`

## Execution Modes

Every AI task must declare or imply one mode:

| Mode | Meaning | Write Allowed |
|---|---|---|
| READ-ONLY | inspect only | No |
| CHECK | run validation only | No product/source writes |
| FORENSICS | collect evidence and reports | Evidence only |
| PLAN | produce plan/scripts/prompts | Output artifact only |
| APPLY | write approved scoped changes | Yes, allowlist only |
| VERIFY | verify prior changes | Evidence only |
| REVIEW | review patch/evidence | No source writes |

Never mix READ-ONLY and APPLY in the same instruction unless the apply scope is explicitly listed.

## Mandatory Scope Rules

Every APPLY must define:

- allowed files
- forbidden roots
- pre-checks
- backup or rollback path
- post-checks
- evidence pack
- final decision status

If allowed files are not explicit, the agent must not write.

## Forbidden Agent Behavior

Agents must not:

- delete files without zero-reference proof
- move files without owner/consumer proof
- rename files without import/reference proof
- commit
- push
- force push
- merge
- open PR
- close PR
- change branch state remotely
- edit workflows broadly
- perform blind global replace
- touch DSH during governance repair
- touch apps/packages/product source during SSoT-only phases
- claim CLOSED, READY, FINAL, or 100% without evidence

## Broad Prompt Ban

Do not give agents broad execution tasks such as:

```text
fix everything
clean the repo
close all gaps
refactor all files
make it 100%
```

unless the task is explicitly decomposed into narrow phases with allowed files and verification.

Large work must be split into small phases with one owner and one evidence gate.

## Current Governance Phase Rules

During governance APPLY phases:

- APPLY-01 writes only canonical SSoT skeleton files.
- APPLY-02 writes only architecture ownership contracts.
- APPLY-03 writes only CI/security/testing contracts.
- APPLY-04 writes only this agent execution contract.
- APPLY-05 writes only legacy retirement policy.
- Later phases may align actual agent files or tools only after their contracts exist.

## Copilot / Weak-Agent Prompt Standard

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

Apps remain shell-only. app-shells remain shell/root behavior only. surfaces own screens/flows/experiences. ui-kit owns reusable design.

## Evidence Rule

Every AI-assisted diagnostic or APPLY phase must produce an evidence pack under:

```text
tools/registry/runs/{SESSION_ID}
```

Minimum evidence:

```text
SUMMARY.md
status.txt
evidence.json
commands.log
git-status-before.txt
git-status-after.txt
git-diff-check-before.txt
git-diff-check-after.txt
tsc-noemit-before.txt
tsc-noemit-after.txt
```

## Patch Review Rule

For sensitive changes, use patch handoff:

```powershell
git --no-pager diff > LOCAL_CHANGE_REVIEW.patch
git --no-pager status --short > LOCAL_CHANGE_STATUS.txt
git ls-files --others --exclude-standard > LOCAL_UNTRACKED_FILES.txt
```

Untracked files are not included in plain `git diff`; they must be listed separately.

## Final Decision Vocabulary

Allowed decisions include:

```text
PASS
PASS_WITH_WARNINGS
READY_FOR_NEXT_PHASE
READY_FOR_DSH_FORENSICS
FIX_REQUIRED
BLOCKED
BLOCKED_BY_DIFF_CHECK
BLOCKED_BY_TSC
BLOCKED_BY_SCOPE_VIOLATION
BLOCKED_BY_MISSING_EVIDENCE
NEEDS_EVIDENCE
NEEDS_REVIEW
REVERT_REQUIRED
```

Do not claim closure beyond the evidence.

## Agent File Alignment

Actual `.agents`, `.github/agents`, `.github/skills`, `.cursor`, workflow, or tool alignment must be done in later phases only.

APPLY-04 creates this contract. It must not rewrite those files.

# Agent and AI Execution Governance

**Status:** Canonical Governance Payload v2
**Owner:** `AI Workflow Governance`
**Canonical repo:** `C:\bthwani-suite`
**Requested branch context:** `ghb/0107-20260430-225857-governance-packages`
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** 14_AGENT_EXECUTION_RULES, AI_EXECUTION_GOVERNANCE, BTHWANI_GUIDE, MASTER_EXECUTION_PLAYBOOK

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Authority model

ChatGPT analyzes, prepares execution packages, and reviews evidence. Copilot/VS Code agents execute locally only inside scope. Git evidence decides. No AI verbal claim is final.

## Delivery modes

| Mode | Use |
|---|---|
| `DECISION_ONLY` | analysis, diagnosis, recommendation |
| `TERMINAL_COMMAND` | quick checks, evidence, guards |
| `SINGLE_FILE` | one SOP/report/config/prompt |
| `ZIP_PACKAGE` | multiple files, scripts, payloads |
| `PATCH_HANDOFF` | sensitive local changes |
| `EVIDENCE_BUNDLE` | verification pack |
| `VISUAL_REVIEW` | screenshots/UI |
| `NO_ACTION` | unsafe or insufficient evidence |

## Prompt contract for weak agents

A prompt must include:

- exact repo path,
- exact target files/directories,
- allowed actions,
- forbidden actions,
- before-edit file intention,
- after-edit changed files,
- verification commands,
- evidence to return,
- no final `PASS/CLOSED/100%` claim.

## Forbidden agent behavior

- broad “fix everything” commands,
- touching unrelated files,
- deleting/moving/renaming without explicit permission,
- modifying dependencies/config/CI unless in scope,
- changing GitHub remotely without explicit user request,
- claiming success without evidence,
- continuing to another task.

## Script governance

Scripts are allowed when more deterministic than prompt-only execution. Write-capable scripts must have:

- purpose,
- scope,
- excluded paths,
- DryRun/Apply behavior when risky,
- backup/rollback note,
- evidence output,
- `_HANDOFF.zip` if writing to registry runs.

## Patch handoff

Use patch handoff when:

- Copilot changed files,
- scripts changed files,
- UI-kit/package boundaries changed,
- governance changed,
- deletion/move/refactor happened,
- user asks for review before commit.

## Final decision vocabulary

```text
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
BLOCKED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
NO_ACTION_REQUIRED
```

`NO_ACTION_REQUIRED` is allowed as workflow decision, but traceability row status should use `NOT_APPLICABLE`.

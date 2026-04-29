# Agent Governance Policy

Status: CANONICAL
Owner: BThwani Governance
Scope: AI agents, Copilot, ChatGPT, scripts, generated files, prompts, patch review, and evidence handoff

## 1. Purpose

This policy governs how AI-assisted work may analyze, edit, verify, commit, and report changes in `bthwani-suite`.

It exists to prevent vague execution, broad drift, hidden changes, duplicated work, broken ownership, unsafe scripts, and unsupported closure claims.

## 2. Execution modes

Allowed execution modes:

| Mode | Use |
|---|---|
| READ_ONLY_AUDIT | analysis, inventory, classification, no writes |
| WRITE_WITHOUT_COMMIT | create/update scoped files, verify, no commit |
| WRITE_AND_COMMIT_SCOPED | write scoped files, verify, commit scoped paths only |
| PATCH_REVIEW | user uploads patch or evidence zip for review |
| RUNTIME_VERIFY | run app/surface/build/smoke where applicable |

GitHub write operations are forbidden unless explicitly requested or the current package/script declares a scoped commit/push action.

## 3. Required agent behavior

Every agent task must declare:

- repo root
- current branch expectation
- allowed files
- forbidden files
- allowed actions
- forbidden actions
- verification commands
- evidence root
- final decision
- next step

No agent may silently expand scope.

## 4. Prompt quality standard

Agent prompts must be:

- narrow enough to execute correctly
- complete enough to prevent missing work
- precise enough for weak agents
- measurable by evidence
- free from old standalone repo/path references
- aligned with canonical architecture

For BThwani UI work, prompts must include the architecture rule:

```text
Screen / Surface / App → @bthwani/ui-kit public exports → Tamagui internally inside ui-kit only
```

## 5. Evidence handoff

Every meaningful run must produce:

- `SUMMARY.md`
- `status.txt`
- `evidence.json`
- `_HANDOFF.zip`
- `<SESSION_ID>_HANDOFF.zip`

The canonical evidence location is:

```text
tools/registry/runs/<SESSION_ID>/
```

When user upload is expected, a copy should be placed in Downloads.

## 6. Agent write restrictions

Forbidden without explicit scope:

- deleting files
- moving files
- renaming files
- modifying CI
- modifying guards
- modifying scripts
- modifying public contracts
- modifying payments/wallet/security/auth
- force push
- branch deletion
- broad formatting
- repo-wide refactor

Sensitive changes require patch review or an evidence package.

## 7. Review-before-claim rule

An AI-generated result is not accepted until verified by:

- git status
- diff check
- typecheck when applicable
- relevant guards
- runtime/visual proof when applicable
- evidence pack
- final decision

## 8. Final decisions

Agent outputs must map to:

- PASS
- PASS_WITH_WARNINGS
- FIX_REQUIRED
- BLOCKED
- READY_FOR_PR
- REVERT_REQUIRED
- NEEDS_EVIDENCE
- NEEDS_VISUAL_EVIDENCE

## 9. Anti-drift rule

Agents must not introduce:

- old standalone `bth` repo/path truth
- random colors
- local design systems
- direct Tamagui imports outside ui-kit
- fixtures as runtime truth
- unverified service completion claims
- untracked files without accounting

## 10. Acceleration rule

Acceleration is allowed only by bundling cohesive tasks.

Allowed bundles:

- multiple canonical governance standards
- related guard improvements
- related service blueprint repairs
- related documentation promotion
- related evidence/CI policy changes

Forbidden bundles:

- UI + API + unrelated guard + deletion in one commit
- broad cleanup without ownership proof
- dead-code deletion without traceability
- multiple services without service matrix

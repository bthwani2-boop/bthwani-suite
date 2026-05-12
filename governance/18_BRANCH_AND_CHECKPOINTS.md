# Branch and Checkpoints

**Status:** Canonical Governance Payload v2
**Owner:** `Branch Governance`
**Canonical repo:** `C:\bthwani-suite`
**Execution branch context:** runtime-detected from Git; do not hardcode branch truth.
**Source basis:** extracted and consolidated from `governance/` + `governance/governance-legacy/`
**Legacy families promoted here:** BRANCH_AND_CHECKPOINT_POLICY, 02_BRANCH_AND_EVIDENCE_POLICY, CHANGE_ENTRY_RULE

## Non-negotiable reading law

This file is not a slogan file. It is a control-plane rule file for BThwani. Any implementation, prompt, script, PR, branch, guard, or audit that touches this domain must follow this file and must produce evidence. No `PASS`, `READY`, `CLOSED`, `FINAL`, or `100%` claim is valid without evidence under `tools/registry/runs/{SESSION_ID}/`.


## Branch reality law

No branch status claim is valid without:

```powershell
git branch --show-current
git rev-parse --short HEAD
git --no-pager status --short
git --no-pager log --oneline -n 20
git ls-files --others --exclude-standard
```

## Supported branch families

| Family | Use |
|---|---|
| `main` | protected stable target |
| `ghb/*` | checkpoint/staged achievement branches |
| `governance/*` | governance-specific work |
| `feature/*` | feature work |
| `fix/*` | fixes |
| `chore/*` | maintenance |
| `release/*` | release stabilization |

## Divergence protocol

When local and remote diverge:

1. `git fetch origin`
2. inspect local-only commits,
3. inspect remote-only commits,
4. inspect cherry-pick equivalence,
5. create backup branch,
6. prefer rebase when remote is linear and safe,
7. do not force-push unless explicitly approved,
8. verify heads match after push.

## Safe divergence commands

```powershell
git --no-pager log --oneline origin/<branch>..HEAD
git --no-pager log --oneline HEAD..origin/<branch>
git --no-pager log --oneline --graph --left-right --cherry-pick HEAD...origin/<branch>
```

## Checkpoint required when

- governance changes,
- package public API changes,
- contracts/API/runtime changes,
- security posture changes,
- service closure claim is made,
- branch is prepared for PR/merge,
- deletion/cleanup occurred.

## Checkpoint evidence

```text
branch
head SHA
remote SHA
status
diff stat
diff check
typecheck
untracked
evidence root
risk summary
decision
```

## No-force law

Force-push is forbidden unless the user explicitly requests and evidence proves it is safe. Default is normal push after rebase/merge proof.

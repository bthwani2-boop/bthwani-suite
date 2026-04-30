---
generatedFrom: governance/AI_EXECUTION_GOVERNANCE.md
generatedAt: 2026-04-30T04:48:37.2787906+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# AI Execution Governance

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Authority model

ChatGPT chooses the safest execution method.

Copilot is a local execution helper only.

Git evidence decides.

No AI verbal claim is evidence.

## 2. Allowed delivery modes

```text
DECISION_ONLY
TERMINAL_COMMAND
SINGLE_FILE
ZIP_PACKAGE
PATCH_HANDOFF
EVIDENCE_BUNDLE
VISUAL_REVIEW
NO_ACTION
```

## 3. Method selection

Prefer the safest, most deterministic method:

| Situation | Preferred method |
|---|---|
| Decision only | ChatGPT analysis |
| Quick check | Terminal command |
| Single document | Single file |
| Multiple files | ZIP package |
| Deterministic repeated edit | Script/codemod with DryRun/Apply |
| Sensitive local change | Patch handoff |
| UI screenshot task | Visual review |
| Unsafe/ambiguous | No action / blocked |

## 4. Copilot scope contract

Copilot must not:

```text
widen scope
touch unrelated files
create/delete/rename/move files unless explicitly required
change dependencies
change lockfiles
change CI unless scoped
refactor broadly
claim PASS/CLOSED/100%
continue to another task
```

## 5. Script contract

Scripts must:

```text
state scope
support DryRun/Apply when write-capable
write evidence when relevant
not delete by default
not approve themselves
leave Git diff reviewable
```

PowerShell scripts for this repo must start with:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
```

## 6. Local truth

ChatGPT cannot see local uncommitted changes until the user uploads evidence.

GitHub is not proof of local uncommitted work.

## 7. Final review

After execution, acceptance depends on:

```text
git status
diff
untracked/staged accounting
verification output
guard output
screenshots/runtime logs when relevant
patch review
decision
```


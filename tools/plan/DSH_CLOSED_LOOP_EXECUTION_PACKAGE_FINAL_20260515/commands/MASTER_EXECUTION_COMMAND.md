# Master Execution Command

Paste this to the agent first.

```text
Read this package in order:

1. README.md
2. prompts/00_MASTER_AGENT_SYSTEM_PROMPT.md
3. gates/BLOCKERS_AND_STOP_RULES.md
4. gates/ACCEPTANCE_CRITERIA.md

Then execute only Loop 0 from:
prompts/10_LOOP_0_DOCS_NOISE_AND_AGENT_CONTEXT.md

Target repo:
C:\bthwani-suite

Current branch:
ghb/0142-20260515-053913-verify-ui-kit-stability

Do not execute Loop 1 until Loop 0 evidence is produced and reviewed.
Do not claim PASS/CLOSED/100%.
Return only DONE_LOCAL / BLOCKED / NEEDS_NEXT_LOOP.
```

## Optional inventory script before Loop 1

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
$Pkg = "<EXTRACTED_PACKAGE_PATH>"
$Script = Join-Path $Pkg "scripts\CHECK_DSH_TOTAL_COVERAGE_INVENTORY.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -File $Script
```

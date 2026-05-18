Set-Location -LiteralPath "C:\bthwani-suite"
$ErrorActionPreference = "Stop"
Set-StrictMode -Version 2.0

$Apply = $false
$SkipTypeCheck = $false
$NoPause = $false
$ScriptExitCode = 0
foreach ($Arg in $args) {
  if ($Arg -eq "-Apply") { $Apply = $true }
  if ($Arg -eq "-SkipTypeCheck") { $SkipTypeCheck = $true }
  if ($Arg -eq "-NoPause") { $NoPause = $true }
}

$IssueCode = "MERGE_EXTERNAL_AGENT_SKILLS_NO_CONFLICT"
$SessionId = "$IssueCode-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path ".\tools\registry\runs" $SessionId
$BackupRoot = Join-Path $RunRoot "backup"
$QuarantineRoot = Join-Path $RunRoot "quarantined-duplicate-skills"
$ZipPath = Join-Path $RunRoot "$SessionId.zip"

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$Failures = New-Object System.Collections.Generic.List[string]
$Warnings = New-Object System.Collections.Generic.List[string]
$Touched = New-Object System.Collections.Generic.List[string]
$Planned = New-Object System.Collections.Generic.List[string]

function Add-Failure {
  param([Parameter(Mandatory=$true)][string]$Message)
  $script:Failures.Add($Message) | Out-Null
}

function Add-Warning {
  param([Parameter(Mandatory=$true)][string]$Message)
  $script:Warnings.Add($Message) | Out-Null
}

function Add-Planned {
  param([Parameter(Mandatory=$true)][string]$Message)
  $script:Planned.Add($Message) | Out-Null
}

function Ensure-Directory {
  param([Parameter(Mandatory=$true)][string]$Path)
  if (!(Test-Path -LiteralPath $Path)) {
    if ($Apply) {
      New-Item -ItemType Directory -Force -Path $Path | Out-Null
    }
  }
}

function Ensure-Directory-Always {
  param([Parameter(Mandatory=$true)][string]$Path)
  if (!(Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

function Read-Text {
  param([Parameter(Mandatory=$true)][string]$Path)
  return [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $Path), [System.Text.Encoding]::UTF8)
}

function Normalize-Newline {
  param([Parameter(Mandatory=$true)][string]$Text)
  return (($Text -replace "`r`n", "`n") -replace "`r", "`n")
}

function Write-TextIfChanged {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Text,
    [Parameter(Mandatory=$true)][string]$Reason
  )

  $FullPath = Join-Path (Get-Location) $Path
  $Parent = Split-Path -Parent $FullPath

  $Current = $null
  if (Test-Path -LiteralPath $FullPath) {
    $Current = [System.IO.File]::ReadAllText($FullPath, [System.Text.Encoding]::UTF8)
  }

  $Desired = $Text.TrimEnd() + "`r`n"

  if ($Current -ne $Desired) {
    Add-Planned "$Path :: $Reason"
    if ($Apply) {
      Ensure-Directory-Always -Path $Parent

      if (Test-Path -LiteralPath $FullPath) {
        $BackupPath = Join-Path $BackupRoot $Path
        Ensure-Directory-Always -Path (Split-Path -Parent $BackupPath)
        Copy-Item -LiteralPath $FullPath -Destination $BackupPath -Force
      }

      [System.IO.File]::WriteAllText($FullPath, $Desired, $Utf8NoBom)
      $script:Touched.Add($Path) | Out-Null
    }
  }
}

function Upsert-Block {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$StartMarker,
    [Parameter(Mandatory=$true)][string]$EndMarker,
    [Parameter(Mandatory=$true)][string]$Block,
    [Parameter(Mandatory=$true)][string]$Reason
  )

  if (!(Test-Path -LiteralPath $Path)) {
    Add-Failure "Missing target skill for merge: $Path"
    return
  }

  $Text = Read-Text -Path $Path
  $CleanBlock = $Block.Trim()
  $Pattern = [regex]::Escape($StartMarker) + ".*?" + [regex]::Escape($EndMarker)

  if ($Text.Contains($StartMarker) -and $Text.Contains($EndMarker)) {
    $NewText = [regex]::Replace($Text, $Pattern, $CleanBlock, "Singleline")
  } else {
    $NewText = $Text.TrimEnd() + "`r`n`r`n" + $CleanBlock + "`r`n"
  }

  Write-TextIfChanged -Path $Path -Text $NewText -Reason $Reason
}

function Remove-Registry-Rows-Containing {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string[]]$Terms,
    [Parameter(Mandatory=$true)][string]$Reason
  )

  if (!(Test-Path -LiteralPath $Path)) {
    Add-Failure "Missing registry file: $Path"
    return
  }

  $Text = Read-Text -Path $Path
  $Lines = $Text -split "\r?\n"
  $Filtered = New-Object System.Collections.Generic.List[string]
  $RemovedCount = 0

  foreach ($Line in $Lines) {
    $Drop = $false
    foreach ($Term in $Terms) {
      if ($Line.Contains($Term)) {
        $Drop = $true
        break
      }
    }

    if ($Drop) {
      $RemovedCount += 1
    } else {
      $Filtered.Add($Line) | Out-Null
    }
  }

  if ($RemovedCount -gt 0) {
    $NewText = (($Filtered.ToArray()) -join "`r`n").TrimEnd() + "`r`n"
    Write-TextIfChanged -Path $Path -Text $NewText -Reason "$Reason; removed $RemovedCount stale/conflicting rows"
  }
}

function Ensure-Registry-Row {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Row,
    [Parameter(Mandatory=$true)][string[]]$AnchorCandidates,
    [Parameter(Mandatory=$true)][string]$Reason
  )

  if (!(Test-Path -LiteralPath $Path)) {
    Add-Failure "Missing registry file: $Path"
    return
  }

  $SkillName = [regex]::Match($Row, '`([^`]+)`').Groups[1].Value
  $Text = Read-Text -Path $Path

  if ($Text.Contains($SkillName)) {
    return
  }

  $BaseText = $Text.TrimEnd()
  $InsertAt = -1

  foreach ($Anchor in $AnchorCandidates) {
    if ([string]::IsNullOrWhiteSpace($Anchor)) {
      continue
    }
    $Index = $BaseText.IndexOf($Anchor, [System.StringComparison]::Ordinal)
    if ($Index -ge 0) {
      $InsertAt = $Index
      break
    }
  }

  if ($InsertAt -ge 0) {
    $Before = $BaseText.Substring(0, $InsertAt).TrimEnd()
    $After = $BaseText.Substring($InsertAt).TrimStart()
    $NewText = $Before + "`r`n" + $Row + "`r`n`r`n" + $After + "`r`n"
  } else {
    $NewText = $BaseText + "`r`n" + $Row + "`r`n"
  }

  Write-TextIfChanged -Path $Path -Text $NewText -Reason $Reason
}

function Invoke-Capture {
  param(
    [Parameter(Mandatory=$true)][string]$OutputFile,
    [Parameter(Mandatory=$true)][string]$CommandLine,
    [switch]$AllowFailure
  )

  $OutputPath = Join-Path $RunRoot $OutputFile
  "COMMAND: $CommandLine" | Set-Content -LiteralPath $OutputPath -Encoding UTF8

  $capturedLines = cmd.exe /c "$CommandLine" 2>&1
  $capturedLines | Out-File -LiteralPath $OutputPath -Append -Encoding UTF8
  $Code = $LASTEXITCODE

  "EXIT_CODE: $Code" | Add-Content -LiteralPath $OutputPath -Encoding UTF8

  if (($Code -ne 0) -and (-not $AllowFailure)) {
    Add-Failure "Command failed: $CommandLine"
  }

  if (($Code -ne 0) -and $AllowFailure) {
    Add-Warning "Command warning/failure captured: $CommandLine"
  }

  return $Code
}

function Validate-SkillFile {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$ExpectedName,
    [Parameter(Mandatory=$true)][bool]$MustExist
  )

  if (!(Test-Path -LiteralPath $Path)) {
    if ($MustExist) {
      Add-Failure "Missing skill file: $Path"
    }
    return
  }

  $Text = Read-Text -Path $Path
  $Lines = $Text -split "\r?\n"

  if ($Lines[0] -ne "---") {
    Add-Failure "Invalid YAML frontmatter start in $Path"
  }

  if ($Text -notmatch "name:\s*$([regex]::Escape($ExpectedName))") {
    Add-Failure "Expected frontmatter name not found in $Path"
  }

  if ($Text -match "source:\s*\[") {
    Add-Failure "Markdown link found inside YAML source field in $Path"
  }

  if ($Text -match '````') {
    Add-Failure "Four-backtick fence found in $Path"
  }

  if ($Text -match "contentReference") {
    Add-Failure "contentReference artifact found in $Path"
  }

  if ($Text -match "_HANDOFF") {
    Add-Warning "Risk term _HANDOFF appears in $Path"
  }
}

function Quarantine-DuplicateSkill {
  param(
    [Parameter(Mandatory=$true)][string]$SkillFolder,
    [Parameter(Mandatory=$true)][string]$Reason
  )

  if (!(Test-Path -LiteralPath $SkillFolder)) {
    return
  }

  Add-Planned "$SkillFolder :: quarantine duplicate/non-owner skill; $Reason"

  if ($Apply) {
    Ensure-Directory-Always -Path $QuarantineRoot
    $Leaf = Split-Path -Leaf $SkillFolder
    $Destination = Join-Path $QuarantineRoot $Leaf

    if (Test-Path -LiteralPath $Destination) {
      Remove-Item -LiteralPath $Destination -Recurse -Force
    }

    Move-Item -LiteralPath $SkillFolder -Destination $Destination -Force
    $script:Touched.Add("$SkillFolder -> $Destination") | Out-Null
  }
}

function Assert-No-Active-DuplicateSkill {
  param([Parameter(Mandatory=$true)][string[]]$ForbiddenSkillFolders)

  foreach ($Folder in $ForbiddenSkillFolders) {
    if (Test-Path -LiteralPath $Folder) {
      Add-Failure "Active duplicate skill remains after planned operation: $Folder"
    }
  }
}

try {
  Ensure-Directory-Always -Path $RunRoot
  Ensure-Directory-Always -Path $BackupRoot

  if (!(Test-Path -LiteralPath ".git")) {
    Add-Failure "Current directory is not a Git repository: C:\bthwani-suite"
    throw "Not a Git repository"
  }

  $RequiredFiles = @(
    "AGENTS.md",
    ".agents\README.md",
    ".agents\AUTHORITY_BOUNDARY.md",
    ".agents\INDEX.md",
    ".agents\SKILL_CATALOG.md",
    ".agents\UPDATE_POLICY.md",
    ".agents\skills\bthwani-ui-kit-surface-contract\SKILL.md",
    ".agents\skills\bthwani-agent-skill-authoring-contract\SKILL.md",
    ".agents\skills\bthwani-commercial-growth-contract\SKILL.md",
    ".agents\skills\bthwani-agent-registry-validator\SKILL.md"
  )

  foreach ($Required in $RequiredFiles) {
    if (!(Test-Path -LiteralPath $Required)) {
      Add-Failure "Missing required file: $Required"
    }
  }

  Invoke-Capture -OutputFile "git-status-before.txt" -CommandLine "git --no-pager status --short" -AllowFailure | Out-Null
  Invoke-Capture -OutputFile "git-diff-name-status-before.txt" -CommandLine "git --no-pager diff --name-status" -AllowFailure | Out-Null
  Invoke-Capture -OutputFile "untracked-before.txt" -CommandLine "git ls-files --others --exclude-standard" -AllowFailure | Out-Null

  if ($Failures.Count -gt 0) {
    throw "Preflight failed"
  }

  $StaleSkillFolders = @(
    ".agents\skills\bthwani-ui-ux-design-intelligence-contract",
    ".agents\skills\bthwani-ui-ux-pro-max-contract",
    ".agents\skills\bthwani-context-engineering-contract",
    ".agents\skills\bthwani-marketing-growth-contract"
  )

  foreach ($Folder in $StaleSkillFolders) {
    Quarantine-DuplicateSkill -SkillFolder $Folder -Reason "capability must be merged into existing owner skill, not kept as a separate active skill"
  }

  $UiUxBlock = @'
<!-- BTHWANI_EXTERNAL_UI_UX_PRO_MAX_ADAPTATION_START -->
## External adaptation: UI/UX design intelligence

Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
Mode: adapted-not-mirrored.

Use this adaptation only as visual reasoning support. It must not override BThwani design authority.

Additional UI/UX reasoning duties:

- Perform deep visual dissection before UI implementation.
- Identify screen purpose, hierarchy, primary CTA, interaction cost, tab pressure, sheet/modal behavior, scroll boundaries, and visual density.
- Check RTL at the concrete row level: icon and text in one right-side cluster, right-aligned Arabic copy, action or chevron on the opposite side, safe spacing, and no clipping.
- Check whether repeated UI belongs in existing `@bthwani/ui-kit` exports before local implementation.
- Check cross-surface impact when the same logic appears in app-client, app-partner, app-captain, app-field, control-panel, WLT/finance, DSH/operations, website, or webapp.
- Preserve the BThwani visual identity: premium, cohesive, low-noise, modern 2026, practical, fast, and clear.

Forbidden:

- no donor palette import
- no generic design-system copy
- no local design system
- no new UI-kit file unless the need is proven, non-negotiable, and explicitly human-approved
- no Tamagui import outside the approved UI-kit boundary unless repo evidence proves the exact layer allows it
- no visual PASS without screenshot evidence when visible UI changed
<!-- BTHWANI_EXTERNAL_UI_UX_PRO_MAX_ADAPTATION_END -->
'@

  $ContextBlock = @'
<!-- BTHWANI_EXTERNAL_CONTEXT_ENGINEERING_ADAPTATION_START -->
## External adaptation: context engineering

Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
Mode: adapted-not-mirrored.

Use this adaptation to keep skills, prompts, and execution packages minimal, high-signal, scoped, and evidence-driven.

Additional context duties:

- Treat context as finite and expensive.
- Use the smallest sufficient set of high-signal instructions.
- Prefer paths, owners, retrieval instructions, and exact contracts over copying long donor text.
- Remove duplicate, stale, contradictory, or low-signal instructions.
- Keep tool/skill routing unambiguous; if two skills overlap, choose the existing canonical owner with the narrowest correct scope.
- Keep examples few and canonical.
- Use sections such as Task, Scope, Allowed, Forbidden, Verification, Evidence, and Decision.
- Mark unknowns as TBD, UNPROVEN, BLOCKED, NEEDS_EVIDENCE, or NEEDS_VISUAL_EVIDENCE.
- Never claim PASS, CLOSED, READY, FINAL, SAFE, or 100% without evidence.

Packaging rule:

- Do not put Markdown links inside YAML frontmatter.
- Do not use nested code fences inside generated PowerShell scripts.
- Do not copy contentReference artifacts.
- Prefer deterministic scripts over broad prompts when exact file generation is safer.
<!-- BTHWANI_EXTERNAL_CONTEXT_ENGINEERING_ADAPTATION_END -->
'@

  $MarketingBlock = @'
<!-- BTHWANI_EXTERNAL_MARKETINGSKILLS_ADAPTATION_START -->
## External adaptation: marketing skills

Source: https://github.com/coreyhaines31/marketingskills
Mode: adapted-not-mirrored.

Use this adaptation inside the existing commercial-growth owner. Do not create a duplicate marketing skill.

Additional commercial-growth duties:

- Start with product, audience, positioning, and value proposition before copy or campaign work.
- Review CRO, onboarding, paywall, checkout, activation, retention, referrals, churn, lifecycle messages, loyalty, subscriptions, offers, coupons, campaigns, and experiments when relevant.
- Review SEO, ASO, content strategy, landing pages, app-store listing text, ad creative, and campaign copy when relevant.
- Review analytics, attribution, event names, metrics, experiment hypothesis, holdout/rollback, expiry, eligibility, and measurement plan.
- Check finance impact for any discount, coupon, subscription, wallet, ledger, settlement, refund, fee, budget, or redemption behavior.
- Route configurable campaign or offer behavior to Platform/Vars or the approved control-panel owner.
- Prevent duplicated commercial behavior across app-client, app-partner, control-panel, WLT/finance, DSH/operations, website, and webapp.

Forbidden:

- no hardcoded money-affecting marketing logic inside local screens
- no duplicate campaign/offer/subscription logic across surfaces
- no runtime/API/backend/database change unless explicitly requested
- no claim of conversion, SEO, ASO, retention, or revenue improvement without measurement evidence
<!-- BTHWANI_EXTERNAL_MARKETINGSKILLS_ADAPTATION_END -->
'@

  $StopSlopSkill = @'
---
name: bthwani-stop-slop-prose-contract
description: Remove AI-sounding prose, vague claims, filler, overstatement, generic phrasing, noisy reports, and weak Arabic or English copy from prompts, reports, UI copy, governance text, and marketing text.
version: 2026.05.18-v1
source: https://github.com/hardikpandya/stop-slop
source_mode: adapted-not-mirrored
---

# bthwani-stop-slop-prose-contract

## Purpose

Make BThwani writing direct, specific, evidence-aware, and low-noise.

Use this skill as a final prose-quality pass after the task-specific skill has determined the correct logic, owner, scope, and evidence requirements.

## Trigger when

- Writing or editing Copilot, Codex, Claude, Gemini, Cursor, or OpenCode prompts.
- Writing UI copy, Arabic labels, reports, PR summaries, evidence summaries, onboarding text, notifications, marketing copy, or governance text.
- The text is padded, dramatic, generic, falsely certain, repetitive, or unclear.
- The user asks for a stronger, more precise, less noisy command.

## Do not trigger when

- The user asks for a deliberately poetic, playful, or highly branded creative style.
- Exact legal, contractual, or quoted wording must be preserved.
- A short terminal command is enough and prose rewriting adds no value.

## Mandatory pre-execution reading

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

Read the relevant task skill first, then apply this skill as the final writing pass.

## Remove

- throat-clearing openers
- vague declarations
- false certainty
- business jargon with no operational meaning
- filler transitions
- repeated strong, complete, or 100% claims without evidence
- dramatic binary framing
- passive voice when active voice is clearer
- redundant adjectives
- generic AI phrasing
- long final reports when a short decision is enough
- unsupported claims of closure

## Keep

- direct commands
- exact paths
- exact owner and scope
- measurable acceptance criteria
- TBD, UNPROVEN, BLOCKED, NEEDS_EVIDENCE, NEEDS_VISUAL_EVIDENCE
- concise Arabic suitable for execution
- strict RTL wording when UI is involved
- evidence-first status language
- rollback and verification requirements when risk exists

## BThwani writing rules

- Do not claim PASS, CLOSED, READY, FINAL, SAFE, or 100% without evidence.
- Do not hide uncertainty.
- Do not add emotional filler.
- Do not over-explain when the user needs an execution command.
- Use concise closure language.
- For UI prompts, include concrete RTL and design-system contracts, not vague beauty wording.
- For multi-surface tasks, require a cross-surface impact map instead of mono-app wording.

## Output contract

```text
skill:
text_type:
removed_noise:
clarified_claims:
remaining_tbd:
final_text:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
```
'@

  Upsert-Block -Path ".agents\skills\bthwani-ui-kit-surface-contract\SKILL.md" `
    -StartMarker "<!-- BTHWANI_EXTERNAL_UI_UX_PRO_MAX_ADAPTATION_START -->" `
    -EndMarker "<!-- BTHWANI_EXTERNAL_UI_UX_PRO_MAX_ADAPTATION_END -->" `
    -Block $UiUxBlock `
    -Reason "merge external UI/UX design intelligence into existing UI-kit owner skill"

  Upsert-Block -Path ".agents\skills\bthwani-agent-skill-authoring-contract\SKILL.md" `
    -StartMarker "<!-- BTHWANI_EXTERNAL_CONTEXT_ENGINEERING_ADAPTATION_START -->" `
    -EndMarker "<!-- BTHWANI_EXTERNAL_CONTEXT_ENGINEERING_ADAPTATION_END -->" `
    -Block $ContextBlock `
    -Reason "merge context engineering into existing skill-authoring owner skill"

  Upsert-Block -Path ".agents\skills\bthwani-commercial-growth-contract\SKILL.md" `
    -StartMarker "<!-- BTHWANI_EXTERNAL_MARKETINGSKILLS_ADAPTATION_START -->" `
    -EndMarker "<!-- BTHWANI_EXTERNAL_MARKETINGSKILLS_ADAPTATION_END -->" `
    -Block $MarketingBlock `
    -Reason "merge marketingskills into existing commercial-growth owner skill"

  Write-TextIfChanged -Path ".agents\skills\bthwani-stop-slop-prose-contract\SKILL.md" `
    -Text $StopSlopSkill `
    -Reason "create only missing prose-quality skill; no overlap owner exists"

  $ConflictingTerms = @(
    "bthwani-ui-ux-design-intelligence-contract",
    "bthwani-ui-ux-pro-max-contract",
    "bthwani-context-engineering-contract",
    "bthwani-marketing-growth-contract"
  )

  Remove-Registry-Rows-Containing -Path ".agents\INDEX.md" -Terms $ConflictingTerms -Reason "remove stale rows for duplicate/non-owner skills from index"
  Remove-Registry-Rows-Containing -Path ".agents\SKILL_CATALOG.md" -Terms $ConflictingTerms -Reason "remove stale rows for duplicate/non-owner skills from catalog"

  Ensure-Registry-Row -Path ".agents\INDEX.md" `
    -Row '| `bthwani-stop-slop-prose-contract` | See `.agents/skills/bthwani-stop-slop-prose-contract/SKILL.md`. |' `
    -AnchorCandidates @("## Preserved external/generated skills", "## Adapters", "## Rule") `
    -Reason "register only new prose-quality skill"

  Ensure-Registry-Row -Path ".agents\SKILL_CATALOG.md" `
    -Row '| `bthwani-stop-slop-prose-contract` | Remove AI-sounding prose, filler, vague claims, noisy writing, and weak Arabic/English copy from prompts, reports, UI copy, governance text, and marketing text. | `governance/` according to task domain | prose cleanup + remaining TBD + final text |' `
    -AnchorCandidates @("All skills require evidence before acceptance.") `
    -Reason "catalog only new prose-quality skill"

  if ($Apply) {
    Assert-No-Active-DuplicateSkill -ForbiddenSkillFolders $StaleSkillFolders
  }

  Validate-SkillFile -Path ".agents\skills\bthwani-ui-kit-surface-contract\SKILL.md" -ExpectedName "bthwani-ui-kit-surface-contract" -MustExist $true
  Validate-SkillFile -Path ".agents\skills\bthwani-agent-skill-authoring-contract\SKILL.md" -ExpectedName "bthwani-agent-skill-authoring-contract" -MustExist $true
  Validate-SkillFile -Path ".agents\skills\bthwani-commercial-growth-contract\SKILL.md" -ExpectedName "bthwani-commercial-growth-contract" -MustExist $true
  Validate-SkillFile -Path ".agents\skills\bthwani-stop-slop-prose-contract\SKILL.md" -ExpectedName "bthwani-stop-slop-prose-contract" -MustExist $Apply

  $SourceMap = [ordered]@{
    session_id = $SessionId
    mode = $(if ($Apply) { "APPLY" } else { "DRY_RUN" })
    active_repo = "C:\bthwani-suite"
    changed_scope = ".agents"
    github_write = "not performed"
    policy = "Merge external capabilities into existing owner skills; create only stop-slop prose skill; quarantine duplicate/non-owner skill folders if present."
    owner_mapping = [ordered]@{
      "ui-ux-pro-max" = ".agents/skills/bthwani-ui-kit-surface-contract/SKILL.md"
      "anthropic-context-engineering" = ".agents/skills/bthwani-agent-skill-authoring-contract/SKILL.md"
      "marketingskills" = ".agents/skills/bthwani-commercial-growth-contract/SKILL.md"
      "stop-slop" = ".agents/skills/bthwani-stop-slop-prose-contract/SKILL.md"
    }
    external_sources = @(
      "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
      "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      "https://github.com/coreyhaines31/marketingskills",
      "https://github.com/hardikpandya/stop-slop"
    )
    planned_changes = $Planned
    touched = $Touched
    warnings = $Warnings
    failures = $Failures
  }

  ($SourceMap | ConvertTo-Json -Depth 12) | Set-Content -LiteralPath (Join-Path $RunRoot "source-map.json") -Encoding UTF8
  ($Planned | Sort-Object -Unique) | Set-Content -LiteralPath (Join-Path $RunRoot "planned-changes.txt") -Encoding UTF8
  ($Touched | Sort-Object -Unique) | Set-Content -LiteralPath (Join-Path $RunRoot "files-touched.txt") -Encoding UTF8
  ($Warnings | Sort-Object -Unique) | Set-Content -LiteralPath (Join-Path $RunRoot "warnings.txt") -Encoding UTF8
  ($Failures | Sort-Object -Unique) | Set-Content -LiteralPath (Join-Path $RunRoot "failures.txt") -Encoding UTF8

  if ($Apply) {
    Invoke-Capture -OutputFile "git-status-after.txt" -CommandLine "git --no-pager status --short" -AllowFailure | Out-Null
    Invoke-Capture -OutputFile "git-diff-name-status-agents.txt" -CommandLine "git --no-pager diff --name-status -- .agents" -AllowFailure | Out-Null
    Invoke-Capture -OutputFile "git-diff-check.txt" -CommandLine "git --no-pager diff --check" -AllowFailure | Out-Null
    Invoke-Capture -OutputFile "untracked-after.txt" -CommandLine "git ls-files --others --exclude-standard" -AllowFailure | Out-Null

    if (-not $SkipTypeCheck) {
      Invoke-Capture -OutputFile "tsc-noemit.txt" -CommandLine "pnpm -w exec tsc --noEmit" -AllowFailure | Out-Null
    } else {
      "SKIPPED_BY_USER" | Set-Content -LiteralPath (Join-Path $RunRoot "tsc-noemit.txt") -Encoding UTF8
      Add-Warning "TypeScript check skipped by -SkipTypeCheck"
    }
  }

  $Status = "DRY_RUN_COMPLETED"
  if ($Apply) {
    if ($Failures.Count -gt 0) {
      $Status = "APPLY_COMPLETED_WITH_FAILURES"
    } elseif ($Warnings.Count -gt 0) {
      $Status = "APPLY_COMPLETED_WITH_WARNINGS"
    } else {
      $Status = "APPLY_COMPLETED_LOCAL_ONLY"
    }
  }

  $Status | Set-Content -LiteralPath (Join-Path $RunRoot "status.txt") -Encoding UTF8

  @"
status: $Status
session_id: $SessionId
repo: C:\bthwani-suite
mode: $(if ($Apply) { "APPLY" } else { "DRY_RUN" })
changed_scope: .agents
github_write: none
commit: not performed
zip: $ZipPath

owner_mapping:
- ui-ux-pro-max -> .agents/skills/bthwani-ui-kit-surface-contract/SKILL.md
- Anthropic context engineering -> .agents/skills/bthwani-agent-skill-authoring-contract/SKILL.md
- marketingskills -> .agents/skills/bthwani-commercial-growth-contract/SKILL.md
- stop-slop -> .agents/skills/bthwani-stop-slop-prose-contract/SKILL.md

conflict_policy:
- no new UI/UX skill
- no new context-engineering skill
- no new marketing-growth skill
- only one new prose cleanup skill
- exact stale duplicate folders quarantined if present
- stale registry rows removed if present
- no external repository copied
- no mirror folders
- no bridge folders
- no GitHub write
- no commit
- no push

planned_changes:
$($Planned -join "`r`n")

touched_files:
$($Touched -join "`r`n")

warnings:
$($Warnings -join "`r`n")

failures:
$($Failures -join "`r`n")

manual_verification_after_apply:
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --name-status -- .agents
git --no-pager diff --check
pnpm -w exec tsc --noEmit

decision_note:
Final PASS/READY requires reviewing Git diff, generated evidence, and verification output.
"@ | Set-Content -LiteralPath (Join-Path $RunRoot "SUMMARY.md") -Encoding UTF8

  $Items = Get-ChildItem -LiteralPath $RunRoot -Force | Where-Object { $_.Name -ne "$SessionId.zip" }
  if ($Items.Count -gt 0) {
    Compress-Archive -LiteralPath $Items.FullName -DestinationPath $ZipPath -Force
  }

  Write-Host ""
  Write-Host $Status
  Write-Host "Session: $SessionId"
  Write-Host "Evidence: $RunRoot"
  Write-Host "ZIP: $ZipPath"
  Write-Host ""

  if (-not $Apply) {
    Write-Host "This was DRY_RUN. No repository files were changed."
    Write-Host "To apply:"
    Write-Host 'powershell -NoProfile -ExecutionPolicy Bypass -File ".\tools\APPLY_MERGE_EXTERNAL_AGENT_SKILLS_NO_CONFLICT.ps1" -Apply'
  } else {
    Write-Host "Manual verification:"
    Write-Host 'Set-Location -LiteralPath "C:\bthwani-suite"'
    Write-Host 'git --no-pager status --short'
    Write-Host 'git --no-pager diff --name-status -- .agents'
    Write-Host 'git --no-pager diff --check'
    Write-Host 'pnpm -w exec tsc --noEmit'
  }

  if ($Failures.Count -gt 0) {
    $ScriptExitCode = 1
    $global:LASTEXITCODE = 1
  } else {
    $ScriptExitCode = 0
    $global:LASTEXITCODE = 0
  }
}
catch {
  Add-Failure $_.Exception.Message

  Ensure-Directory-Always -Path $RunRoot
  $Failures | Set-Content -LiteralPath (Join-Path $RunRoot "failures.txt") -Encoding UTF8
  "FAIL" | Set-Content -LiteralPath (Join-Path $RunRoot "status.txt") -Encoding UTF8

  @"
status: FAIL
session_id: $SessionId
repo: C:\bthwani-suite
mode: $(if ($Apply) { "APPLY" } else { "DRY_RUN" })
error: $($_.Exception.Message)
evidence: $RunRoot
zip: $ZipPath
"@ | Set-Content -LiteralPath (Join-Path $RunRoot "SUMMARY.md") -Encoding UTF8

  $Items = Get-ChildItem -LiteralPath $RunRoot -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "$SessionId.zip" }
  if ($Items -and $Items.Count -gt 0) {
    Compress-Archive -LiteralPath $Items.FullName -DestinationPath $ZipPath -Force
  }

  Write-Host ""
  Write-Host "FAIL"
  Write-Host "Error: $($_.Exception.Message)"
  Write-Host "Evidence: $RunRoot"
  Write-Host "ZIP: $ZipPath"
  $ScriptExitCode = 1
  $global:LASTEXITCODE = 1
}

Write-Host ""
Write-Host "SCRIPT_FINISHED_NO_AUTO_EXIT"
Write-Host "ExitCode: $ScriptExitCode"
Write-Host "This script intentionally does not call exit, so it will not close your current PowerShell session."

if (-not $NoPause) {
  Write-Host ""
  Read-Host "Press Enter to return to PowerShell"
}

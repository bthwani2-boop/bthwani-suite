Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "AGENCY_AGENTS_DEEP_DIAGNOSIS_V2"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$SessionId = "$IssueCode-$Stamp"
$RepoRoot = (Get-Location).Path
$EvidenceRoot = Join-Path $RepoRoot "tools\registry\runs\$SessionId"
$CommandLog = Join-Path $EvidenceRoot "command-log.txt"
$HandoffZip = Join-Path $EvidenceRoot "_HANDOFF.zip"

$AgencyUrl = "https://github.com/msitarzewski/agency-agents.git"
$ExternalRoot = Join-Path $EvidenceRoot "_external"
$AgencyClone = Join-Path $ExternalRoot "agency-agents"

New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null
New-Item -ItemType Directory -Force -Path $ExternalRoot | Out-Null

function Write-Log {
  param([string]$Message)
  $Line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  Add-Content -LiteralPath $CommandLog -Value $Line -Encoding UTF8
  Write-Host $Message
}

function Invoke-Capture {
  param(
    [string]$Name,
    [string]$OutFile,
    [scriptblock]$Command
  )

  Write-Log "RUN: $Name"

  try {
    $Output = & $Command 2>&1 | Out-String
    Set-Content -LiteralPath $OutFile -Value $Output -Encoding UTF8
    Write-Log "OK: $Name"
    return $true
  } catch {
    $Output = $_ | Out-String
    Set-Content -LiteralPath $OutFile -Value $Output -Encoding UTF8
    Write-Log "FAIL: $Name"
    return $false
  }
}

function Read-TextSafe {
  param([string]$Path)
  try {
    if (Test-Path -LiteralPath $Path) {
      return [System.IO.File]::ReadAllText($Path)
    }
  } catch {}
  return ""
}

function Get-RelativePathSafe {
  param(
    [string]$FullName,
    [string]$Base
  )

  if (-not $Base) {
    $Base = $RepoRoot
  }

  try {
    if ($FullName.StartsWith($Base, [System.StringComparison]::OrdinalIgnoreCase)) {
      return $FullName.Substring($Base.Length).TrimStart([char[]]@("\","/"))
    }
  } catch {}

  return $FullName
}

function Get-FrontMatterValue {
  param(
    [string]$Content,
    [string]$Key
  )

  if (-not $Content) {
    return ""
  }

  $Match = [regex]::Match($Content, "(?ms)^---\s*(.*?)\s*---")
  if (-not $Match.Success) {
    return ""
  }

  $Fm = $Match.Groups[1].Value
  $Line = [regex]::Match($Fm, "(?m)^" + [regex]::Escape($Key) + "\s*:\s*(.+?)\s*$")
  if ($Line.Success) {
    return $Line.Groups[1].Value.Trim().Trim('"').Trim("'")
  }

  return ""
}

function Get-ApproxTokens {
  param([string]$Content)
  if (-not $Content) {
    return 0
  }
  return [int][math]::Ceiling($Content.Length / 4)
}

function Export-CsvSafe {
  param(
    [array]$Rows,
    [string]$Path,
    [string[]]$Headers
  )

  if ($Rows -and $Rows.Count -gt 0) {
    $Rows | Export-Csv -NoTypeInformation -Encoding UTF8 -LiteralPath $Path
  } else {
    Set-Content -LiteralPath $Path -Encoding UTF8 -Value ($Headers -join ",")
  }
}

function Get-RiskAssessment {
  param(
    [string]$Content,
    [string]$Path,
    [string]$Name
  )

  $HighTerms = @(
    "install.sh",
    "convert.sh",
    "commit",
    "push",
    "merge",
    "rebase",
    "force push",
    "open PR",
    "pull request",
    "deploy",
    "deployment",
    "CI/CD",
    ".github/workflows",
    "workflow",
    "secrets",
    "lockfile",
    "package.json",
    "pnpm add",
    "npm install",
    "dependencies",
    "scaffold",
    "generate",
    "create files",
    "delete files",
    "rename files",
    "move folders",
    "microservices",
    "GraphQL",
    "REST API",
    "database",
    "PostgreSQL",
    "MongoDB",
    "authentication",
    "authorization",
    "native",
    "EAS",
    "Expo upgrade",
    "production-ready",
    "production ready"
  )

  $UiTerms = @(
    "Frontend",
    "UI",
    "design system",
    "component library",
    "Tamagui",
    "React Native",
    "mobile",
    "Expo",
    "accessibility",
    "RTL",
    "layout",
    "screen"
  )

  $SafeTerms = @(
    "read-only",
    "read only",
    "advisory",
    "audit",
    "review",
    "evidence",
    "facts only",
    "do not modify",
    "inspect only",
    "TBD",
    "UNPROVEN"
  )

  $Signals = New-Object System.Collections.Generic.List[string]
  $Score = 0

  foreach ($Term in $HighTerms) {
    if ($Content -match [regex]::Escape($Term)) {
      $Signals.Add("HIGH_TERM:$Term")
      $Score += 5
    }
  }

  foreach ($Term in $UiTerms) {
    if ($Content -match [regex]::Escape($Term)) {
      $Signals.Add("UI_TERM:$Term")
      $Score += 2
    }
  }

  foreach ($Term in $SafeTerms) {
    if ($Content -match [regex]::Escape($Term)) {
      $Signals.Add("SAFE_TERM:$Term")
      $Score -= 2
    }
  }

  $HasSafetyContract = $Content -match "BThwani Safety Contract"
  $HasCanonicalRepo = $Content -match [regex]::Escape("C:\bthwani-suite")
  $HasUiKitRule = $Content -match [regex]::Escape("@bthwani/ui-kit")
  $HasReadOnly = $Content -match "read-only|read only|advisory|inspect only"
  $HasEvidenceRule = ($Content -match "PASS|READY|CLOSED|100%") -and ($Content -match "evidence|Evidence")

  if ($HasSafetyContract) {
    $Score -= 8
    $Signals.Add("HAS_BTHWANI_SAFETY_CONTRACT")
  }

  if ($HasCanonicalRepo) {
    $Score -= 2
    $Signals.Add("HAS_CANONICAL_REPO")
  }

  if ($HasUiKitRule) {
    $Score -= 2
    $Signals.Add("HAS_UI_KIT_RULE")
  }

  if ($HasReadOnly) {
    $Score -= 3
    $Signals.Add("HAS_READONLY_PATTERN")
  }

  if ($HasEvidenceRule) {
    $Score -= 2
    $Signals.Add("HAS_EVIDENCE_RULE")
  }

  $Level = "LOW"
  if ($Score -ge 18) {
    $Level = "CRITICAL"
  } elseif ($Score -ge 10) {
    $Level = "HIGH"
  } elseif ($Score -ge 4) {
    $Level = "MEDIUM"
  }

  return [pscustomobject]@{
    RiskScore = $Score
    RiskLevel = $Level
    Signals = (($Signals | Select-Object -Unique) -join " | ")
    HasSafetyContract = $HasSafetyContract
    HasCanonicalRepo = $HasCanonicalRepo
    HasUiKitRule = $HasUiKitRule
    HasReadOnlyPattern = $HasReadOnly
    HasEvidenceRule = $HasEvidenceRule
  }
}

function Classify-CurrentSkill {
  param(
    [string]$FolderName,
    [object]$Risk
  )

  $MustReadOnly = @(
    "nodejs-backend-patterns",
    "nodejs-best-practices",
    "expo-api-routes",
    "expo-cicd-workflows",
    "expo-deployment",
    "upgrading-expo",
    "next-upgrade",
    "nx-generate",
    "nx-import",
    "nx-plugins",
    "link-workspace-packages",
    "monitor-ci"
  )

  $NeedsUiGuards = @(
    "frontend-design",
    "sleek-design-mobile-apps",
    "building-native-ui",
    "native-data-fetching",
    "next-cache-components",
    "use-dom",
    "expo-dev-client",
    "accessibility",
    "seo"
  )

  $LightSafety = @(
    "typescript-advanced-types",
    "nx-run-tasks",
    "nx-workspace",
    "next-best-practices",
    "vercel-react-best-practices"
  )

  if ($MustReadOnly -contains $FolderName) {
    if ($Risk.HasSafetyContract -and $Risk.HasReadOnlyPattern) {
      return "OK_READONLY_GUARDED"
    }
    return "FIX_REQUIRED_REWRITE_TO_READONLY"
  }

  if ($NeedsUiGuards -contains $FolderName) {
    if ($Risk.HasSafetyContract -and $Risk.HasUiKitRule) {
      return "OK_UI_GUARDED"
    }
    return "FIX_REQUIRED_ADD_BTHWANI_UI_RTL_GUARDS"
  }

  if ($LightSafety -contains $FolderName) {
    if ($Risk.HasSafetyContract) {
      return "OK_WITH_SAFETY_CONTRACT"
    }
    return "WARN_ADD_LIGHT_SAFETY_CONTRACT"
  }

  if ($FolderName -match "^bthwani-") {
    if ($Risk.HasSafetyContract) {
      return "OK_BTHWANI_SKILL"
    }
    return "FIX_REQUIRED_BTHWANI_SKILL_MISSING_CONTRACT"
  }

  if ($Risk.RiskLevel -eq "CRITICAL" -or $Risk.RiskLevel -eq "HIGH") {
    return "REVIEW_HIGH_RISK_UNCLASSIFIED"
  }

  if (-not $Risk.HasSafetyContract) {
    return "WARN_UNCLASSIFIED_MISSING_CONTRACT"
  }

  return "REVIEW"
}

Write-Log "SESSION_ID: $SessionId"
Write-Log "REPO_ROOT: $RepoRoot"
Write-Log "EVIDENCE_ROOT: $EvidenceRoot"
Write-Log "MODE: READ_ONLY_DIAGNOSTIC_ONLY"

Invoke-Capture "git branch --show-current" (Join-Path $EvidenceRoot "git-branch.txt") { git branch --show-current } | Out-Null
Invoke-Capture "git rev-parse HEAD" (Join-Path $EvidenceRoot "git-head.txt") { git rev-parse HEAD } | Out-Null
Invoke-Capture "git --no-pager status --short" (Join-Path $EvidenceRoot "git-status.txt") { git --no-pager status --short } | Out-Null
Invoke-Capture "git --no-pager diff --stat" (Join-Path $EvidenceRoot "git-diff-stat.txt") { git --no-pager diff --stat } | Out-Null
Invoke-Capture "git --no-pager diff --name-status" (Join-Path $EvidenceRoot "git-diff-name-status.txt") { git --no-pager diff --name-status } | Out-Null
Invoke-Capture "git --no-pager diff --check" (Join-Path $EvidenceRoot "git-diff-check.txt") { git --no-pager diff --check } | Out-Null
Invoke-Capture "git ls-files --others --exclude-standard" (Join-Path $EvidenceRoot "git-untracked.txt") { git ls-files --others --exclude-standard } | Out-Null

Set-Content -LiteralPath (Join-Path $EvidenceRoot "tsc-noemit.txt") -Encoding UTF8 -Value "SKIPPED_BY_DESIGN: Diagnostic scan only. TypeScript check should run after APPLY changes."

$Branch = (Get-Content -LiteralPath (Join-Path $EvidenceRoot "git-branch.txt") -Raw).Trim()
$Head = (Get-Content -LiteralPath (Join-Path $EvidenceRoot "git-head.txt") -Raw).Trim()
$GitStatusText = (Get-Content -LiteralPath (Join-Path $EvidenceRoot "git-status.txt") -Raw).Trim()
$HasLocalChanges = $GitStatusText.Length -gt 0

$InstructionRoots = @(
  "AGENTS.md",
  "CLAUDE.md",
  "CODEX.md",
  "CONVENTIONS.md",
  ".github\copilot-instructions.md",
  ".github\instructions",
  ".github\agents",
  ".agents",
  ".codex",
  ".cursor",
  ".opencode",
  ".vscode"
)

$InstructionRows = @()

foreach ($Root in $InstructionRoots) {
  $Full = Join-Path $RepoRoot $Root

  if (Test-Path -LiteralPath $Full) {
    $Item = Get-Item -LiteralPath $Full -Force

    if ($Item.PSIsContainer) {
      $Files = Get-ChildItem -LiteralPath $Full -Recurse -File -Force -ErrorAction SilentlyContinue
      foreach ($File in $Files) {
        $Rel = Get-RelativePathSafe -FullName $File.FullName -Base $RepoRoot
        $Content = Read-TextSafe $File.FullName
        $Risk = Get-RiskAssessment -Content $Content -Path $Rel -Name $File.Name

        $InstructionRows += [pscustomobject]@{
          Root = $Root
          Path = $Rel
          Exists = $true
          SizeBytes = $File.Length
          ApproxTokens = Get-ApproxTokens $Content
          RiskLevel = $Risk.RiskLevel
          RiskScore = $Risk.RiskScore
          HasSafetyContract = $Risk.HasSafetyContract
          HasUiKitRule = $Risk.HasUiKitRule
          HasReadOnlyPattern = $Risk.HasReadOnlyPattern
          Signals = $Risk.Signals
        }
      }
    } else {
      $Rel = Get-RelativePathSafe -FullName $Item.FullName -Base $RepoRoot
      $Content = Read-TextSafe $Item.FullName
      $Risk = Get-RiskAssessment -Content $Content -Path $Rel -Name $Item.Name

      $InstructionRows += [pscustomobject]@{
        Root = $Root
        Path = $Rel
        Exists = $true
        SizeBytes = $Item.Length
        ApproxTokens = Get-ApproxTokens $Content
        RiskLevel = $Risk.RiskLevel
        RiskScore = $Risk.RiskScore
        HasSafetyContract = $Risk.HasSafetyContract
        HasUiKitRule = $Risk.HasUiKitRule
        HasReadOnlyPattern = $Risk.HasReadOnlyPattern
        Signals = $Risk.Signals
      }
    }
  } else {
    $InstructionRows += [pscustomobject]@{
      Root = $Root
      Path = $Root
      Exists = $false
      SizeBytes = 0
      ApproxTokens = 0
      RiskLevel = "MISSING"
      RiskScore = 0
      HasSafetyContract = $false
      HasUiKitRule = $false
      HasReadOnlyPattern = $false
      Signals = ""
    }
  }
}

Export-CsvSafe -Rows $InstructionRows -Path (Join-Path $EvidenceRoot "active-instruction-inventory.csv") -Headers @(
  "Root","Path","Exists","SizeBytes","ApproxTokens","RiskLevel","RiskScore","HasSafetyContract","HasUiKitRule","HasReadOnlyPattern","Signals"
)

$SkillsRoot = Join-Path $RepoRoot ".agents\skills"
$CurrentSkillRows = @()
$CurrentSkillSummary = New-Object System.Text.StringBuilder

if (Test-Path -LiteralPath $SkillsRoot) {
  $SkillDirs = Get-ChildItem -LiteralPath $SkillsRoot -Directory -Force -ErrorAction SilentlyContinue | Sort-Object Name

  foreach ($Dir in $SkillDirs) {
    $SkillFile = Join-Path $Dir.FullName "SKILL.md"
    $Exists = Test-Path -LiteralPath $SkillFile
    $Content = ""
    if ($Exists) {
      $Content = Read-TextSafe $SkillFile
    }

    $Rel = Get-RelativePathSafe -FullName $SkillFile -Base $RepoRoot
    $Name = Get-FrontMatterValue -Content $Content -Key "name"
    $Description = Get-FrontMatterValue -Content $Content -Key "description"
    $Risk = Get-RiskAssessment -Content $Content -Path $Rel -Name $Name
    $Classification = Classify-CurrentSkill -FolderName $Dir.Name -Risk $Risk
    $SizeBytes = 0
    if ($Exists) {
      $SizeBytes = (Get-Item -LiteralPath $SkillFile).Length
    }

    $CurrentSkillRows += [pscustomobject]@{
      Folder = $Dir.Name
      SkillFile = $Rel
      Exists = $Exists
      MetadataName = $Name
      Description = $Description
      SizeBytes = $SizeBytes
      ApproxTokens = Get-ApproxTokens $Content
      RiskLevel = $Risk.RiskLevel
      RiskScore = $Risk.RiskScore
      HasSafetyContract = $Risk.HasSafetyContract
      HasCanonicalRepo = $Risk.HasCanonicalRepo
      HasUiKitRule = $Risk.HasUiKitRule
      HasReadOnlyPattern = $Risk.HasReadOnlyPattern
      HasEvidenceRule = $Risk.HasEvidenceRule
      Classification = $Classification
      Signals = $Risk.Signals
    }

    [void]$CurrentSkillSummary.AppendLine(("## {0}" -f $Dir.Name))
    [void]$CurrentSkillSummary.AppendLine("")
    [void]$CurrentSkillSummary.AppendLine(("- File: {0}" -f $Rel))
    [void]$CurrentSkillSummary.AppendLine(("- Classification: {0}" -f $Classification))
    [void]$CurrentSkillSummary.AppendLine(("- Risk: {0} / Score {1}" -f $Risk.RiskLevel, $Risk.RiskScore))
    [void]$CurrentSkillSummary.AppendLine(("- Name: {0}" -f $Name))
    [void]$CurrentSkillSummary.AppendLine(("- Description: {0}" -f $Description))
    [void]$CurrentSkillSummary.AppendLine("")
  }
} else {
  $CurrentSkillRows += [pscustomobject]@{
    Folder = ".agents\skills"
    SkillFile = ".agents\skills"
    Exists = $false
    MetadataName = ""
    Description = ""
    SizeBytes = 0
    ApproxTokens = 0
    RiskLevel = "MISSING"
    RiskScore = 0
    HasSafetyContract = $false
    HasCanonicalRepo = $false
    HasUiKitRule = $false
    HasReadOnlyPattern = $false
    HasEvidenceRule = $false
    Classification = "MISSING_SKILLS_ROOT"
    Signals = ""
  }
}

Export-CsvSafe -Rows $CurrentSkillRows -Path (Join-Path $EvidenceRoot "current-skills-analysis.csv") -Headers @(
  "Folder","SkillFile","Exists","MetadataName","Description","SizeBytes","ApproxTokens","RiskLevel","RiskScore","HasSafetyContract","HasCanonicalRepo","HasUiKitRule","HasReadOnlyPattern","HasEvidenceRule","Classification","Signals"
)

Set-Content -LiteralPath (Join-Path $EvidenceRoot "current-skills-summary.md") -Encoding UTF8 -Value $CurrentSkillSummary.ToString()

$ExternalFetchStatus = "NOT_ATTEMPTED"
$ExternalCommit = ""
$ExternalError = ""

Write-Log "Fetching agency-agents into evidence only"

try {
  if (Get-Command git -ErrorAction SilentlyContinue) {
    $CloneOutput = git clone --depth 1 $AgencyUrl $AgencyClone 2>&1 | Out-String
    Set-Content -LiteralPath (Join-Path $EvidenceRoot "agency-agents-clone-output.txt") -Encoding UTF8 -Value $CloneOutput

    if (Test-Path -LiteralPath (Join-Path $AgencyClone ".git")) {
      $ExternalFetchStatus = "PASS_CLONED_TO_EVIDENCE"
      $ExternalCommit = (git -C $AgencyClone rev-parse HEAD 2>$null | Out-String).Trim()
    } else {
      $ExternalFetchStatus = "FAIL_CLONE_NO_GIT_DIR"
    }
  } else {
    $ExternalFetchStatus = "BLOCKED_GIT_NOT_FOUND"
  }
} catch {
  $ExternalFetchStatus = "BLOCKED_OR_FAILED"
  $ExternalError = ($_ | Out-String)
  Set-Content -LiteralPath (Join-Path $EvidenceRoot "agency-agents-clone-error.txt") -Encoding UTF8 -Value $ExternalError
}

$CandidateMap = @(
  [pscustomobject]@{ Source = "engineering\engineering-codebase-onboarding-engineer.md"; Original = "Codebase Onboarding Engineer"; Target = "bthwani-codebase-onboarding"; Mode = "ADOPT_SAFE_READONLY"; Reason = "Repo orientation, factual tracing, read-only mental model." },
  [pscustomobject]@{ Source = "engineering\engineering-code-reviewer.md"; Original = "Code Reviewer"; Target = "bthwani-patch-reviewer"; Mode = "ADOPT_SAFE_READONLY"; Reason = "Patch and diff review after Copilot or script execution." },
  [pscustomobject]@{ Source = "testing\testing-evidence-collector.md"; Original = "Evidence Collector"; Target = "bthwani-evidence-collector"; Mode = "ADOPT_SAFE_READONLY"; Reason = "Evidence gathering and verification discipline; replace generic commands." },
  [pscustomobject]@{ Source = "testing\testing-reality-checker.md"; Original = "Reality Checker"; Target = "bthwani-reality-checker"; Mode = "ADOPT_SAFE_READONLY"; Reason = "Blocks fantasy PASS and READY claims without evidence." },
  [pscustomobject]@{ Source = "engineering\engineering-software-architect.md"; Original = "Software Architect"; Target = "bthwani-architecture-auditor-readonly"; Mode = "ADOPT_SAFE_READONLY"; Reason = "Architecture analysis only; no refactor or apply." },
  [pscustomobject]@{ Source = "testing\testing-accessibility-auditor.md"; Original = "Accessibility Auditor"; Target = "bthwani-accessibility-auditor"; Mode = "ADOPT_SAFE_READONLY"; Reason = "Accessibility review with RTL, mobile, web, and ui-kit constraints." },
  [pscustomobject]@{ Source = "engineering\engineering-frontend-developer.md"; Original = "Frontend Developer"; Target = "bthwani-frontend-implementation-advisor"; Mode = "TRANSFORM_TO_SAFE_ADVISOR"; Reason = "UI implementation advisor only; no local design system or direct Tamagui outside ui-kit." },
  [pscustomobject]@{ Source = "engineering\engineering-mobile-app-builder.md"; Original = "Mobile App Builder"; Target = "bthwani-mobile-expo-advisor"; Mode = "TRANSFORM_TO_SAFE_ADVISOR"; Reason = "Expo and React Native diagnostic advisor only; no native, dependencies, EAS without explicit scope." },
  [pscustomobject]@{ Source = "engineering\engineering-backend-architect.md"; Original = "Backend Architect"; Target = "bthwani-backend-api-advisor-readonly"; Mode = "TRANSFORM_TO_SAFE_ADVISOR"; Reason = "Backend, API, and NestJS reviewer only; no runtime implementation." },
  [pscustomobject]@{ Source = "engineering\engineering-devops-automator.md"; Original = "DevOps Automator"; Target = "bthwani-devops-ci-auditor-readonly"; Mode = "TRANSFORM_TO_SAFE_ADVISOR"; Reason = "CI/CD audit only; no workflow, secrets, deploy writes." },
  [pscustomobject]@{ Source = "engineering\engineering-git-workflow-master.md"; Original = "Git Workflow Master"; Target = "bthwani-git-workflow-advisor-readonly"; Mode = "TRANSFORM_TO_SAFE_ADVISOR"; Reason = "Git command advisor only; no merge, rebase, push, delete, PR." },
  [pscustomobject]@{ Source = "engineering\engineering-rapid-prototyper.md"; Original = "Rapid Prototyper"; Target = "bthwani-prototype-planner-readonly"; Mode = "TRANSFORM_TO_SAFE_ADVISOR"; Reason = "Prototype planning only; no mock systems or files by default." },
  [pscustomobject]@{ Source = "specialized\agents-orchestrator.md"; Original = "Agents Orchestrator"; Target = "bthwani-agent-router-readonly"; Mode = "TRANSFORM_TO_SAFE_ADVISOR"; Reason = "Skill-selection router only; no automatic multi-agent delegation." },
  [pscustomobject]@{ Source = ""; Original = "Custom BThwani UI Boundary Reviewer"; Target = "bthwani-ui-boundary-reviewer"; Mode = "CUSTOM_BTHWANI_ONLY"; Reason = "Custom guard for Screen, Surface, App to ui-kit to Tamagui internally only, RTL, identity." }
)

$ExternalRows = @()
$CandidateRows = @()
$CandidateSummary = New-Object System.Text.StringBuilder

if ($ExternalFetchStatus -eq "PASS_CLONED_TO_EVIDENCE") {
  $MdFiles = Get-ChildItem -LiteralPath $AgencyClone -Recurse -File -Filter "*.md" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "\\.git\\" -and $_.FullName -notmatch "\\node_modules\\" }

  foreach ($File in $MdFiles) {
    $Rel = Get-RelativePathSafe -FullName $File.FullName -Base $AgencyClone
    $Content = Read-TextSafe $File.FullName
    $Name = Get-FrontMatterValue -Content $Content -Key "name"
    $Description = Get-FrontMatterValue -Content $Content -Key "description"
    if (-not $Name -and $Rel -eq "README.md") {
      $Name = "README"
    }

    $Risk = Get-RiskAssessment -Content $Content -Path $Rel -Name $Name

    $ExternalRows += [pscustomobject]@{
      SourcePath = $Rel
      MetadataName = $Name
      Description = $Description
      SizeBytes = $File.Length
      ApproxTokens = Get-ApproxTokens $Content
      RiskLevel = $Risk.RiskLevel
      RiskScore = $Risk.RiskScore
      HasReadOnlyPattern = $Risk.HasReadOnlyPattern
      Signals = $Risk.Signals
    }
  }
}

foreach ($Candidate in $CandidateMap) {
  $Exists = $false
  $Content = ""

  if ($Candidate.Source) {
    if ($ExternalFetchStatus -eq "PASS_CLONED_TO_EVIDENCE") {
      $Full = Join-Path $AgencyClone $Candidate.Source
      $Exists = Test-Path -LiteralPath $Full
      if ($Exists) {
        $Content = Read-TextSafe $Full
      }
    }
  } else {
    $Exists = $true
    $Content = "Custom BThwani-only skill. No direct agency-agents source file."
  }

  $Risk = Get-RiskAssessment -Content $Content -Path $Candidate.Source -Name $Candidate.Original

  $Decision = "REVIEW"
  if ($ExternalFetchStatus -ne "PASS_CLONED_TO_EVIDENCE" -and $Candidate.Source) {
    $Decision = "BLOCKED_EXTERNAL_SOURCE_NOT_FETCHED"
  } elseif ($Candidate.Mode -eq "CUSTOM_BTHWANI_ONLY") {
    $Decision = "CREATE_CUSTOM_BTHWANI_ONLY"
  } elseif ($Candidate.Mode -eq "TRANSFORM_TO_SAFE_ADVISOR") {
    $Decision = "TRANSFORM_TO_BTHWANI_SAFE"
  } elseif ($Candidate.Mode -eq "ADOPT_SAFE_READONLY") {
    if ($Risk.RiskLevel -eq "CRITICAL" -or $Risk.RiskLevel -eq "HIGH") {
      $Decision = "ADOPT_AFTER_BTHWANI_REWRITE"
    } else {
      $Decision = "ADOPT_SAFE"
    }
  }

  $CandidateRows += [pscustomobject]@{
    OriginalAgent = $Candidate.Original
    SourcePath = $Candidate.Source
    SourceExists = $Exists
    TargetBthwaniSkill = $Candidate.Target
    ProposedMode = $Candidate.Mode
    DiagnosticDecision = $Decision
    RiskLevel = $Risk.RiskLevel
    RiskScore = $Risk.RiskScore
    ApproxTokens = Get-ApproxTokens $Content
    HasReadOnlyPattern = $Risk.HasReadOnlyPattern
    Reason = $Candidate.Reason
    Signals = $Risk.Signals
  }

  [void]$CandidateSummary.AppendLine(("## {0}" -f $Candidate.Target))
  [void]$CandidateSummary.AppendLine("")
  [void]$CandidateSummary.AppendLine(("- Original: {0}" -f $Candidate.Original))
  [void]$CandidateSummary.AppendLine(("- Source: {0}" -f $Candidate.Source))
  [void]$CandidateSummary.AppendLine(("- Source exists: {0}" -f $Exists))
  [void]$CandidateSummary.AppendLine(("- Proposed mode: {0}" -f $Candidate.Mode))
  [void]$CandidateSummary.AppendLine(("- Diagnostic decision: {0}" -f $Decision))
  [void]$CandidateSummary.AppendLine(("- Risk: {0} / Score {1}" -f $Risk.RiskLevel, $Risk.RiskScore))
  [void]$CandidateSummary.AppendLine(("- Reason: {0}" -f $Candidate.Reason))
  [void]$CandidateSummary.AppendLine("")
}

Export-CsvSafe -Rows $ExternalRows -Path (Join-Path $EvidenceRoot "agency-agents-all-md-analysis.csv") -Headers @(
  "SourcePath","MetadataName","Description","SizeBytes","ApproxTokens","RiskLevel","RiskScore","HasReadOnlyPattern","Signals"
)

Export-CsvSafe -Rows $CandidateRows -Path (Join-Path $EvidenceRoot "agency-agents-bthwani-candidates.csv") -Headers @(
  "OriginalAgent","SourcePath","SourceExists","TargetBthwaniSkill","ProposedMode","DiagnosticDecision","RiskLevel","RiskScore","ApproxTokens","HasReadOnlyPattern","Reason","Signals"
)

Set-Content -LiteralPath (Join-Path $EvidenceRoot "agency-agents-candidate-summary.md") -Encoding UTF8 -Value $CandidateSummary.ToString()

$FixRequiredCurrent = @($CurrentSkillRows | Where-Object { $_.Classification -match "^FIX_REQUIRED|REVIEW_HIGH_RISK" })
$WarningsCurrent = @($CurrentSkillRows | Where-Object { $_.Classification -match "^WARN" })
$SafeCandidates = @($CandidateRows | Where-Object { $_.DiagnosticDecision -in @("ADOPT_SAFE","ADOPT_AFTER_BTHWANI_REWRITE","CREATE_CUSTOM_BTHWANI_ONLY") })
$TransformCandidates = @($CandidateRows | Where-Object { $_.DiagnosticDecision -eq "TRANSFORM_TO_BTHWANI_SAFE" })

$Status = "PASS_WITH_WARNINGS"
$Recommendation = "Prepare APPLY package only after review. Do not install or copy raw agency-agents."

if ($ExternalFetchStatus -ne "PASS_CLONED_TO_EVIDENCE") {
  $Status = "BLOCKED_PARTIAL"
  $Recommendation = "External agency-agents source was not fetched. Current repo diagnostics completed. Re-run with network/git access before adoption."
} elseif ($FixRequiredCurrent.Count -gt 0) {
  $Status = "FIX_REQUIRED"
  $Recommendation = "Current .agents skills contain items that need read-only/advisory rewrite or BThwani guards before adding new skills."
}

$RecommendationMd = @"
# Agency Agents Deep Diagnosis V2

## Decision

$Status

## Recommendation

$Recommendation

## External source

- URL: $AgencyUrl
- Fetch status: $ExternalFetchStatus
- External commit: $ExternalCommit
- Error: $ExternalError

## Current repo

- Repo: $RepoRoot
- Branch: $Branch
- Commit: $Head
- Local changes present: $HasLocalChanges

## Counts

- Current skills: $(@($CurrentSkillRows).Count)
- Current fix required: $($FixRequiredCurrent.Count)
- Current warnings: $($WarningsCurrent.Count)
- External markdown files analyzed: $(@($ExternalRows).Count)
- Candidate skills: $(@($CandidateRows).Count)
- Safe candidate additions: $($SafeCandidates.Count)
- Transformed candidate additions: $($TransformCandidates.Count)

## Review these files

- current-skills-analysis.csv
- current-skills-summary.md
- agency-agents-bthwani-candidates.csv
- agency-agents-candidate-summary.md
- active-instruction-inventory.csv
- evidence.json

## Next decision

Choose after ChatGPT review:

1. PREPARE_APPLY_PACKAGE_PHASE_1_ONLY
2. PREPARE_APPLY_PACKAGE_PHASE_1_AND_2
3. BLOCKED_NEEDS_MANUAL_REVIEW

## Non-negotiable

- Do not run install.sh.
- Do not run convert.sh.
- Do not copy all agents.
- Do not install global agents.
- Do not add raw Frontend, Backend, Mobile, DevOps, Git, Prototype, or Orchestrator agents.
- All BThwani skills must be read-only or advisory by default.
"@

Set-Content -LiteralPath (Join-Path $EvidenceRoot "recommendation-matrix.md") -Encoding UTF8 -Value $RecommendationMd

$EvidenceJson = [ordered]@{
  status = $Status
  recommendation = $Recommendation
  issue_code = $IssueCode
  session_id = $SessionId
  repo = $RepoRoot
  branch = $Branch
  commit_sha = $Head
  local_changes_present = $HasLocalChanges
  evidence_root = $EvidenceRoot
  handoff_zip = $HandoffZip
  mode = "READ_ONLY_DIAGNOSTIC_ONLY"
  external_source = @{
    url = $AgencyUrl
    fetch_status = $ExternalFetchStatus
    commit_sha = $ExternalCommit
    error = $ExternalError
  }
  counts = @{
    current_skills = @($CurrentSkillRows).Count
    current_fix_required = $FixRequiredCurrent.Count
    current_warnings = $WarningsCurrent.Count
    external_md_files = @($ExternalRows).Count
    candidate_skills = @($CandidateRows).Count
    safe_candidate_additions = $SafeCandidates.Count
    transformed_candidate_additions = $TransformCandidates.Count
  }
}

$EvidenceJson | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $EvidenceRoot "evidence.json") -Encoding UTF8

$Summary = @"
status: $Status
recommendation: $Recommendation
session_id: $SessionId
repo: $RepoRoot
branch: $Branch
commit_sha: $Head
local_changes_present: $HasLocalChanges
evidence_root: $EvidenceRoot
handoff_zip: $HandoffZip

external_source:
- url: $AgencyUrl
- fetch_status: $ExternalFetchStatus
- commit_sha: $ExternalCommit

counts:
- current_skills: $(@($CurrentSkillRows).Count)
- current_fix_required: $($FixRequiredCurrent.Count)
- current_warnings: $($WarningsCurrent.Count)
- external_md_files: $(@($ExternalRows).Count)
- candidate_skills: $(@($CandidateRows).Count)
- safe_candidate_additions: $($SafeCandidates.Count)
- transformed_candidate_additions: $($TransformCandidates.Count)

primary_files_to_review:
- recommendation-matrix.md
- current-skills-analysis.csv
- current-skills-summary.md
- agency-agents-bthwani-candidates.csv
- agency-agents-candidate-summary.md
- active-instruction-inventory.csv
- evidence.json

next_action:
- Upload _HANDOFF.zip to ChatGPT.
"@

Set-Content -LiteralPath (Join-Path $EvidenceRoot "summary.txt") -Encoding UTF8 -Value $Summary

if (Test-Path -LiteralPath $HandoffZip) {
  Remove-Item -LiteralPath $HandoffZip -Force
}

$ZipItems = Get-ChildItem -LiteralPath $EvidenceRoot -Force | Where-Object { $_.Name -ne "_external" } | Select-Object -ExpandProperty FullName
Compress-Archive -Path $ZipItems -DestinationPath $HandoffZip -Force

Write-Host ""
Write-Host "RESULT: $Status"
Write-Host "RECOMMENDATION: $Recommendation"
Write-Host "EVIDENCE_ROOT: $EvidenceRoot"
Write-Host "HANDOFF_ZIP: $HandoffZip"
Write-Host ""
Write-Host "UPLOAD THIS FILE:"
Write-Host $HandoffZip
Write-Host ""

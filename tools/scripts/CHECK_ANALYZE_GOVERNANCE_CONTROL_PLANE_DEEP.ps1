Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "CHECK_ANALYZE_GOVERNANCE_CONTROL_PLANE_DEEP"
$SessionId = "{0}-{1:yyyyMMdd-HHmmss}" -f $IssueCode, (Get-Date)
$RepoRoot = (Get-Location).Path
$RunRoot = Join-Path $RepoRoot ("tools\registry\runs\" + $SessionId)

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$SummaryPath = Join-Path $RunRoot "SUMMARY.txt"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$InventoryCsv = Join-Path $RunRoot "inventory.csv"
$GovernanceFilesCsv = Join-Path $RunRoot "governance-files.csv"
$ReferenceMapCsv = Join-Path $RunRoot "reference-map.csv"
$PrdSpecCsv = Join-Path $RunRoot "prd-spec-candidates.csv"
$ScriptRefCsv = Join-Path $RunRoot "script-reference-check.csv"
$StructureCsv = Join-Path $RunRoot "structure-readiness.csv"
$AgentFrontmatterCsv = Join-Path $RunRoot "agent-frontmatter-check.csv"
$CursorRulesCsv = Join-Path $RunRoot "cursor-rules-check.csv"
$TopFindingsCsv = Join-Path $RunRoot "top-findings.csv"

$HardBlockers = New-Object System.Collections.Generic.List[string]
$Warnings = New-Object System.Collections.Generic.List[string]
$Gaps = New-Object System.Collections.Generic.List[string]
$Notes = New-Object System.Collections.Generic.List[string]
$TopFindings = New-Object System.Collections.Generic.List[object]

function Add-Finding {
  param(
    [string]$Severity,
    [string]$Code,
    [string]$Message,
    [string]$Path = "",
    [string]$Recommendation = ""
  )

  $Item = [pscustomobject]@{
    severity = $Severity
    code = $Code
    message = $Message
    path = $Path
    recommendation = $Recommendation
  }

  $TopFindings.Add($Item) | Out-Null

  switch ($Severity) {
    "BLOCKER" { $HardBlockers.Add("$Code :: $Message :: $Path") | Out-Null }
    "WARNING" { $Warnings.Add("$Code :: $Message :: $Path") | Out-Null }
    "GAP" { $Gaps.Add("$Code :: $Message :: $Path") | Out-Null }
    default { $Notes.Add("$Code :: $Message :: $Path") | Out-Null }
  }
}

function Test-PathRelative {
  param([string]$RelativePath)
  return Test-Path -LiteralPath (Join-Path $RepoRoot $RelativePath)
}

function Get-RelPath {
  param([string]$FullPath)
  return $FullPath.Replace($RepoRoot + "\", "")
}

function Should-SkipPath {
  param([string]$FullPath)

  $Patterns = @(
    "\\node_modules\\",
    "\\.git\\",
    "\\.next\\",
    "\\dist\\",
    "\\build\\",
    "\\coverage\\",
    "\\.turbo\\",
    "\\.nx\\",
    "\\.venv\\",
    "\\tools\\registry\\runs\\"
  )

  foreach ($Pattern in $Patterns) {
    if ($FullPath -match $Pattern) {
      return $true
    }
  }

  return $false
}

function Is-TextCandidate {
  param([string]$FullPath)

  $Ext = [System.IO.Path]::GetExtension($FullPath).ToLowerInvariant()

  $Allowed = @(
    ".md", ".mdc", ".txt",
    ".json", ".jsonc",
    ".yml", ".yaml",
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".ps1", ".psm1",
    ".csv",
    ".toml"
  )

  return $Allowed -contains $Ext
}

function Read-TextSafe {
  param([string]$Path)

  try {
    $Info = Get-Item -LiteralPath $Path -ErrorAction Stop

    if ($Info.Length -gt 2097152) {
      return $null
    }

    if (-not (Is-TextCandidate -FullPath $Path)) {
      return $null
    }

    return Get-Content -LiteralPath $Path -Raw -ErrorAction Stop
  }
  catch {
    return $null
  }
}

function Get-HashSafe {
  param([string]$Path)

  try {
    if (Test-Path -LiteralPath $Path) {
      return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash
    }
  }
  catch {
    return $null
  }

  return $null
}

$RootsToInventory = @(
  ".github",
  ".github\workflows",
  ".github\agents",
  ".github\skills",
  ".github\prompts",
  ".cursor",
  ".cursor\rules",
  ".agents",
  ".opencode",
  ".codex",
  "apps",
  "apps\mobile",
  "apps\web",
  "services",
  "packages",
  "packages\ui-kit",
  "packages\app-shells",
  "packages\surfaces",
  "api-types",
  "api-clients",
  "contracts",
  "runtime",
  "docs",
  "governance\legacy-extracted",
  "governance",
  "tools",
  "tools\scripts",
  "tools\generators",
  "tools\checks",
  "tools\automation",
  "tools\registry",
  "kdt\volatile\registry"
)

$InventoryRows = foreach ($Root in $RootsToInventory) {
  $Full = Join-Path $RepoRoot $Root
  $Exists = Test-Path -LiteralPath $Full
  $FileCount = 0
  $DirCount = 0

  if ($Exists) {
    $FileCount = @(Get-ChildItem -LiteralPath $Full -Recurse -File -ErrorAction SilentlyContinue | Where-Object { -not (Should-SkipPath -FullPath $_.FullName) }).Count
    $DirCount = @(Get-ChildItem -LiteralPath $Full -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { -not (Should-SkipPath -FullPath $_.FullName) }).Count
  }

  [pscustomobject]@{
    path = $Root
    exists = $Exists
    fileCount = $FileCount
    dirCount = $DirCount
  }
}

$InventoryRows | Export-Csv -LiteralPath $InventoryCsv -NoTypeInformation -Encoding UTF8

foreach ($Required in @(".github\agents", ".github\skills", "tools\scripts", "packages\ui-kit", "packages\surfaces", "governance")) {
  $Row = $InventoryRows | Where-Object { $_.path -eq $Required } | Select-Object -First 1
  if (-not $Row -or -not $Row.exists) {
    Add-Finding -Severity "BLOCKER" -Code "MISSING_REQUIRED_ROOT" -Message "Required governance/agent execution root is missing." -Path $Required -Recommendation "Restore or create this root from verified source only."
  }
}

if (Test-PathRelative "governance\legacy-extracted") {
  Add-Finding -Severity "WARNING" -Code "TRANSITIONAL_DOCS_GOVERNANCE_EXISTS" -Message "governance/legacy-extracted exists as the transitional review area until deletion readiness is complete." -Path "governance\legacy-extracted" -Recommendation "Make governance/ the canonical control plane and migrate references evidence-first."
}

if (Test-PathRelative "tools\registry") {
  Add-Finding -Severity "WARNING" -Code "TOOLS_REGISTRY_EXISTS" -Message "tools/registry exists or is planned, but current SSoT evidence root is tools/registry/runs." -Path "tools\registry" -Recommendation "Do not switch registry root without explicit SSoT override."
}

if (-not (Test-PathRelative "kdt\volatile\registry")) {
  Add-Finding -Severity "BLOCKER" -Code "CANONICAL_EVIDENCE_ROOT_MISSING" -Message "Canonical evidence root kdt/volatile/registry is missing." -Path "kdt\volatile\registry" -Recommendation "Restore canonical evidence root before claiming governance closure."
}

$GovernanceScanRoots = @("governance", "governance\legacy-extracted")
$GovernanceRows = @()

foreach ($Root in $GovernanceScanRoots) {
  $FullRoot = Join-Path $RepoRoot $Root

  if (-not (Test-Path -LiteralPath $FullRoot)) {
    continue
  }

  $Files = Get-ChildItem -LiteralPath $FullRoot -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { -not (Should-SkipPath -FullPath $_.FullName) }

  foreach ($File in $Files) {
    $Text = Read-TextSafe -Path $File.FullName
    $Rel = Get-RelPath -FullPath $File.FullName

    $Kind = "UNKNOWN"
    if ($Rel -match "(?i)policy|policies") { $Kind = "POLICY" }
    elseif ($Rel -match "(?i)standard|standards") { $Kind = "STANDARD" }
    elseif ($Rel -match "(?i)decision|adr|log") { $Kind = "DECISION" }
    elseif ($Rel -match "(?i)checklist|gate") { $Kind = "CHECKLIST" }
    elseif ($Rel -match "(?i)prd|product|vision|objective|scope") { $Kind = "PRODUCT" }
    elseif ($Rel -match "(?i)spec|requirement|srs|brd") { $Kind = "SPEC" }
    elseif ($Rel -match "(?i)agent|skill|cursor") { $Kind = "AGENT_GOVERNANCE" }
    elseif ($Rel -match "(?i)playbook|guide|manual") { $Kind = "PLAYBOOK" }

    $HasPurpose = $false
    $HasOwner = $false
    $HasStatus = $false
    $HasTbd = $false

    if ($null -ne $Text) {
      $HasPurpose = $Text -match "(?i)purpose|الغرض|هدف"
      $HasOwner = $Text -match "(?i)owner|مالك"
      $HasStatus = $Text -match "(?i)status|الحالة|completeness|اكتمال"
      $HasTbd = $Text -match "(?i)\bTBD\b|OPEN|مفتوح|لاحق"
    }

    $GovernanceRows += [pscustomobject]@{
      path = $Rel
      root = $Root
      kind = $Kind
      bytes = $File.Length
      sha256 = Get-HashSafe -Path $File.FullName
      hasPurpose = $HasPurpose
      hasOwner = $HasOwner
      hasStatus = $HasStatus
      hasTbdOrOpenMarker = $HasTbd
    }
  }
}

$GovernanceRows | Export-Csv -LiteralPath $GovernanceFilesCsv -NoTypeInformation -Encoding UTF8

$GovernanceFileCount = @($GovernanceRows | Where-Object { $_.root -eq "governance" }).Count
$DocsGovernanceFileCount = @($GovernanceRows | Where-Object { $_.root -eq "governance\legacy-extracted" }).Count

if ($GovernanceFileCount -eq 0) {
  Add-Finding -Severity "BLOCKER" -Code "EMPTY_GOVERNANCE_ROOT" -Message "governance/ has no scanned files." -Path "governance" -Recommendation "Create canonical governance index and control files."
}

$CanonicalGovernanceExpected = @(
  "governance\GOVERNANCE_INDEX.md",
  "governance\SOURCE_PRECEDENCE.md",
  "governance\policies",
  "governance\standards",
  "governance\decisions",
  "governance\checklists"
)

foreach ($Expected in $CanonicalGovernanceExpected) {
  if (-not (Test-PathRelative $Expected)) {
    Add-Finding -Severity "GAP" -Code "CANONICAL_GOVERNANCE_SHAPE_GAP" -Message "Expected canonical governance control-plane item is missing." -Path $Expected -Recommendation "Add only after content is sourced from verified governance/spec material."
  }
}

$AllScanRoots = @(
  ".github\agents",
  ".github\skills",
  ".github\prompts",
  ".cursor\rules",
  ".agents\skills",
  ".opencode\skills",
  ".codex",
  "tools\scripts",
  "governance",
  "governance\legacy-extracted",
  "package.json",
  "pnpm-workspace.yaml",
  "nx.json",
  "README.md"
)

$ReferenceRows = @()

foreach ($Root in $AllScanRoots) {
  $Full = Join-Path $RepoRoot $Root

  if (-not (Test-Path -LiteralPath $Full)) {
    continue
  }

  $Files = @()

  if ((Get-Item -LiteralPath $Full).PSIsContainer) {
    $Files = Get-ChildItem -LiteralPath $Full -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { -not (Should-SkipPath -FullPath $_.FullName) }
  }
  else {
    $Files = @(Get-Item -LiteralPath $Full)
  }

  foreach ($File in $Files) {
    $Text = Read-TextSafe -Path $File.FullName
    if ($null -eq $Text) { continue }

    $Rel = Get-RelPath -FullPath $File.FullName

    $Patterns = [ordered]@{
      docs_governance = "docs[/\\]governance"
      governance = "(^|[^a-zA-Z0-9_.-])governance[/\\]"
      kdt_volatile_registry = "kdt[/\\]volatile[/\\]registry"
      tools_registry = "tools[/\\]registry"
      old_kdt_registry = "kdt[/\\]registry|kdt[/\\]volatileregistry"
      old_repo_bthfinal = "bthfinal"
      old_repo_documents_path = "C:\\Users\\b\\Documents\\GitHub\\bthwani-suite"
      canonical_repo_path = "C:\\bthwani-suite"
      app_user_legacy = "app-user"
      mcpw_legacy = "mcpw|Main Control Panel"
      service_owned_surfaces = "packages[/\\]surfaces[/\\]src[/\\]service-owned"
      direct_service_surfaces = "packages[/\\]surfaces[/\\]src[/\\](dsh|wlt|knz|arb|amn|esf|mrf|snd|kwd)"
      spec_kit = "\.specify|speckit|specify\.prompt|plan\.prompt|tasks\.prompt|implement\.prompt"
    }

    foreach ($Key in $Patterns.Keys) {
      $Matches = [regex]::Matches($Text, $Patterns[$Key])
      if ($Matches.Count -gt 0) {
        $ReferenceRows += [pscustomobject]@{
          path = $Rel
          referenceType = $Key
          count = $Matches.Count
        }
      }
    }
  }
}

$ReferenceRows | Export-Csv -LiteralPath $ReferenceMapCsv -NoTypeInformation -Encoding UTF8

$DocsGovRefs = @($ReferenceRows | Where-Object { $_.referenceType -eq "docs_governance" }).Count
if ($DocsGovRefs -gt 0) {
  Add-Finding -Severity "WARNING" -Code "DOCS_GOVERNANCE_REFERENCES_EXIST" -Message "Some files still reference legacy governance paths." -Path "reference-map.csv" -Recommendation "Migrate references to governance/ canonical policies or governance/legacy-extracted review artifacts only after central files are created."
}

$OldEvidenceRefs = @($ReferenceRows | Where-Object { $_.referenceType -eq "old_kdt_registry" }).Count
if ($OldEvidenceRefs -gt 0) {
  Add-Finding -Severity "BLOCKER" -Code "OLD_EVIDENCE_ROOT_REFERENCE" -Message "Old evidence root references found." -Path "reference-map.csv" -Recommendation "Replace only after verifying each reference context."
}

$ToolsRegistryRefs = @($ReferenceRows | Where-Object { $_.referenceType -eq "tools_registry" }).Count
if ($ToolsRegistryRefs -gt 0) {
  Add-Finding -Severity "WARNING" -Code "TOOLS_REGISTRY_REFERENCE_CONFLICT" -Message "tools/registry references found while canonical evidence root remains kdt/volatile/registry." -Path "reference-map.csv" -Recommendation "Keep tools/registry as proposal only unless SSoT override is approved."
}

$LegacyAppUserRefs = @($ReferenceRows | Where-Object { $_.referenceType -eq "app_user_legacy" }).Count
if ($LegacyAppUserRefs -gt 0) {
  Add-Finding -Severity "WARNING" -Code "LEGACY_APP_USER_REFERENCE" -Message "Legacy app-user references found." -Path "reference-map.csv" -Recommendation "Classify as legacy/archive or migrate to app-client if active."
}

$McpwRefs = @($ReferenceRows | Where-Object { $_.referenceType -eq "mcpw_legacy" }).Count
if ($McpwRefs -gt 0) {
  Add-Finding -Severity "WARNING" -Code "MCPW_ALIAS_REFERENCE" -Message "mcpw/Main Control Panel references found." -Path "reference-map.csv" -Recommendation "Ensure control-panel is canonical folder name; mcpw may remain alias only if documented."
}

$ServiceOwnedRefs = @($ReferenceRows | Where-Object { $_.referenceType -eq "service_owned_surfaces" }).Count
$DirectSurfaceRefs = @($ReferenceRows | Where-Object { $_.referenceType -eq "direct_service_surfaces" }).Count
if ($ServiceOwnedRefs -gt 0 -and $DirectSurfaceRefs -gt 0) {
  Add-Finding -Severity "WARNING" -Code "SURFACES_PATH_TAXONOMY_MIXED" -Message "Both service-owned and direct service surfaces path references exist." -Path "reference-map.csv" -Recommendation "Decide canonical taxonomy based on current repo evidence before migration."
}

$PrdPatterns = @(
  "PRD",
  "PRODUCT_REQUIREMENTS",
  "BRD",
  "SRS",
  "REQUIREMENTS",
  "SPEC",
  "MASTER_BUILD_SPEC",
  "PLATFORM_VISION",
  "PRODUCT_OBJECTIVES",
  "ACCEPTANCE",
  "SERVICE_PROFILE",
  "SURFACE_PROFILE"
)

$PrdSpecRows = @()

$AllFilesForPrd = Get-ChildItem -LiteralPath $RepoRoot -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object {
    -not (Should-SkipPath -FullPath $_.FullName) -and
    (Is-TextCandidate -FullPath $_.FullName)
  }

foreach ($File in $AllFilesForPrd) {
  $Rel = Get-RelPath -FullPath $File.FullName
  $Name = $File.Name

  $NameHit = $false
  foreach ($Pattern in $PrdPatterns) {
    if ($Name -match "(?i)$Pattern" -or $Rel -match "(?i)$Pattern") {
      $NameHit = $true
      break
    }
  }

  if (-not $NameHit) {
    continue
  }

  $Classification = "ACTIVE_OR_UNKNOWN"

  if ($Rel -match "surfaces-legacy-trash|legacy|trash|archive") {
    $Classification = "LEGACY_OR_ARCHIVE"
  }
  elseif ($Rel -match "^governance[\\/]") {
    $Classification = "GOVERNANCE_CANDIDATE"
  }
  elseif ($Rel -match "^docs[\\/]") {
    $Classification = "DOCS_CANDIDATE"
  }
  elseif ($Rel -match "^kdt[\\/]factory") {
    $Classification = "FACTORY_REQUEST"
  }

  $PrdSpecRows += [pscustomobject]@{
    path = $Rel
    classification = $Classification
    bytes = $File.Length
    sha256 = Get-HashSafe -Path $File.FullName
  }
}

$PrdSpecRows | Sort-Object classification, path | Export-Csv -LiteralPath $PrdSpecCsv -NoTypeInformation -Encoding UTF8

$GovernancePrdCandidates = @($PrdSpecRows | Where-Object { $_.classification -eq "GOVERNANCE_CANDIDATE" }).Count
$DocsPrdCandidates = @($PrdSpecRows | Where-Object { $_.classification -eq "DOCS_CANDIDATE" }).Count
$LegacyPrdCandidates = @($PrdSpecRows | Where-Object { $_.classification -eq "LEGACY_OR_ARCHIVE" }).Count

if ($GovernancePrdCandidates -eq 0) {
  Add-Finding -Severity "GAP" -Code "NO_PRD_SPEC_UNDER_GOVERNANCE" -Message "No PRD/SPEC candidate was found under governance/." -Path "governance" -Recommendation "Promote verified Master Build Spec material into governance/product, not raw legacy docs."
}

if ($LegacyPrdCandidates -gt 0) {
  Add-Finding -Severity "WARNING" -Code "LEGACY_PRD_SPEC_CANDIDATES_EXIST" -Message "PRD/SPEC-like files exist in legacy/archive areas." -Path "prd-spec-candidates.csv" -Recommendation "Do not adopt legacy candidates without conflict review."
}

$AgentRows = @()
$AgentRoot = Join-Path $RepoRoot ".github\agents"

if (Test-Path -LiteralPath $AgentRoot) {
  $AgentFiles = Get-ChildItem -LiteralPath $AgentRoot -Recurse -File -Filter "*.agent.md" -ErrorAction SilentlyContinue

  foreach ($Agent in $AgentFiles) {
    $FirstLine = Get-Content -LiteralPath $Agent.FullName -TotalCount 1 -ErrorAction SilentlyContinue
    $Rel = Get-RelPath -FullPath $Agent.FullName

    $IsValid = $FirstLine -eq "---"

    $AgentRows += [pscustomobject]@{
      path = $Rel
      firstLine = $FirstLine
      validFrontmatter = $IsValid
      sha256 = Get-HashSafe -Path $Agent.FullName
    }

    if (-not $IsValid) {
      Add-Finding -Severity "BLOCKER" -Code "BAD_AGENT_FRONTMATTER" -Message "Agent file does not begin with YAML frontmatter delimiter." -Path $Rel -Recommendation "Remove prefix before frontmatter with backup and verify."
    }
  }
}

$AgentRows | Export-Csv -LiteralPath $AgentFrontmatterCsv -NoTypeInformation -Encoding UTF8

$CursorRows = @()
$CursorRoot = Join-Path $RepoRoot ".cursor\rules"

if (Test-Path -LiteralPath $CursorRoot) {
  $CursorFiles = Get-ChildItem -LiteralPath $CursorRoot -Recurse -File -Filter "*.mdc" -ErrorAction SilentlyContinue

  foreach ($Rule in $CursorFiles) {
    $Text = Read-TextSafe -Path $Rule.FullName
    $Rel = Get-RelPath -FullPath $Rule.FullName
    $HasAlwaysApplyTrue = $false
    $HasAlwaysApplyFalse = $false
    $HasGlobs = $false

    if ($null -ne $Text) {
      $HasAlwaysApplyTrue = $Text -match "alwaysApply:\s*true"
      $HasAlwaysApplyFalse = $Text -match "alwaysApply:\s*false"
      $HasGlobs = $Text -match "globs:"
    }

    $CursorRows += [pscustomobject]@{
      path = $Rel
      alwaysApplyTrue = $HasAlwaysApplyTrue
      alwaysApplyFalse = $HasAlwaysApplyFalse
      hasGlobs = $HasGlobs
      sha256 = Get-HashSafe -Path $Rule.FullName
    }
  }
}

$CursorRows | Export-Csv -LiteralPath $CursorRulesCsv -NoTypeInformation -Encoding UTF8

$AlwaysApplyTrueCount = @($CursorRows | Where-Object { $_.alwaysApplyTrue }).Count
if ($AlwaysApplyTrueCount -gt 1) {
  Add-Finding -Severity "BLOCKER" -Code "MULTIPLE_CURSOR_ALWAYS_APPLY_RULES" -Message "More than one Cursor rule has alwaysApply:true." -Path ".cursor\rules" -Recommendation "Keep only kernel/sentinel alwaysApply:true."
}

if (@($CursorRows).Count -eq 0) {
  Add-Finding -Severity "GAP" -Code "NO_CURSOR_RULES_SCANNED" -Message "No Cursor rules found." -Path ".cursor\rules" -Recommendation "Add minimal scoped rules derived from governance/ only."
}

$ScriptRefRows = @()

$ScriptReferenceRoots = @(
  ".github\workflows",
  "package.json",
  ".github\prompts",
  ".cursor\rules",
  ".github\agents",
  ".github\skills"
)

foreach ($Root in $ScriptReferenceRoots) {
  $Full = Join-Path $RepoRoot $Root
  if (-not (Test-Path -LiteralPath $Full)) { continue }

  $Files = @()
  if ((Get-Item -LiteralPath $Full).PSIsContainer) {
    $Files = Get-ChildItem -LiteralPath $Full -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { -not (Should-SkipPath -FullPath $_.FullName) }
  }
  else {
    $Files = @(Get-Item -LiteralPath $Full)
  }

  foreach ($File in $Files) {
    $Text = Read-TextSafe -Path $File.FullName
    if ($null -eq $Text) { continue }

    $Rel = Get-RelPath -FullPath $File.FullName
    $Matches = [regex]::Matches($Text, "tools[/\\]scripts[/\\][A-Za-z0-9_.-]+\.(ps1|mjs|js|ts)")

    foreach ($Match in $Matches) {
      $ScriptRef = $Match.Value -replace "/", "\"
      $Exists = Test-Path -LiteralPath (Join-Path $RepoRoot $ScriptRef)

      $ScriptRefRows += [pscustomobject]@{
        referencedBy = $Rel
        script = $ScriptRef
        exists = $Exists
      }

      if (-not $Exists) {
        Add-Finding -Severity "BLOCKER" -Code "MISSING_REFERENCED_SCRIPT" -Message "A workflow/prompt/rule/agent references a missing script." -Path "$Rel -> $ScriptRef" -Recommendation "Restore from verified donor package or remove stale reference after proof."
      }
    }
  }
}

$ScriptRefRows | Sort-Object exists, script, referencedBy | Export-Csv -LiteralPath $ScriptRefCsv -NoTypeInformation -Encoding UTF8

$SpecKitSignals = @(
  ".specify",
  ".github\prompts\specify.prompt.md",
  ".github\prompts\plan.prompt.md",
  ".github\prompts\tasks.prompt.md",
  ".github\prompts\implement.prompt.md"
)

$SpecKitFound = @()
foreach ($Signal in $SpecKitSignals) {
  if (Test-PathRelative $Signal) {
    $SpecKitFound += $Signal
  }
}

if (@($SpecKitFound).Count -eq 0) {
  Add-Finding -Severity "WARNING" -Code "SPEC_KIT_NOT_FOUND" -Message "GitHub Spec Kit signals were not found." -Path ".specify / .github\prompts" -Recommendation "Do not add Spec Kit unless explicitly adopted; use governance/product Master Build Spec if preferred."
}

$ExpectedStructure = @(
  ".github\workflows",
  "apps\mobile\app-client",
  "apps\mobile\app-partner",
  "apps\mobile\app-captain",
  "apps\mobile\app-field",
  "apps\web\control-panel",
  "apps\web\webapp",
  "apps\web\website",
  "services\dsh",
  "services\wlt",
  "services\knz",
  "services\arb",
  "services\amn",
  "services\esf",
  "services\mrf",
  "services\snd",
  "services\kwd",
  "packages\ui-kit",
  "packages\app-shells",
  "packages\surfaces",
  "api-types",
  "api-clients",
  "contracts\master\openapi",
  "runtime\local",
  "docs\platform",
  "docs\architecture",
  "docs\services",
  "docs\design-system",
  "docs\operations",
  "docs\decisions",
  "governance\policies",
  "governance\standards",
  "governance\decisions",
  "governance\checklists",
  "tools\scripts",
  "tools\generators",
  "tools\checks",
  "tools\automation"
)

$StructureRows = foreach ($Expected in $ExpectedStructure) {
  $Exists = Test-PathRelative $Expected
  $Status = if ($Exists) { "EXISTS" } else { "MISSING_OR_NOT_YET_PHASED" }

  [pscustomobject]@{
    path = $Expected
    exists = $Exists
    status = $Status
  }
}

$StructureRows | Export-Csv -LiteralPath $StructureCsv -NoTypeInformation -Encoding UTF8

$MissingServices = @($StructureRows | Where-Object { $_.path -match "^services\\" -and -not $_.exists }).Count
if ($MissingServices -gt 0) {
  Add-Finding -Severity "GAP" -Code "SERVICES_ROOT_NOT_MATERIALIZED" -Message "Some or all service backend roots are not materialized." -Path "services" -Recommendation "Treat as future backend phase unless current phase requires backend implementation."
}

$MissingContracts = @($StructureRows | Where-Object { $_.path -match "^contracts\\" -and -not $_.exists }).Count
if ($MissingContracts -gt 0) {
  Add-Finding -Severity "GAP" -Code "CONTRACTS_ROOT_NOT_MATERIALIZED" -Message "Contracts root or master OpenAPI structure is not materialized." -Path "contracts" -Recommendation "Do not start master.openapi until phase gates require it and prerequisites are proven."
}

$MissingRuntime = @($StructureRows | Where-Object { $_.path -match "^runtime\\" -and -not $_.exists }).Count
if ($MissingRuntime -gt 0) {
  Add-Finding -Severity "GAP" -Code "RUNTIME_ROOT_NOT_MATERIALIZED" -Message "Runtime local structure is not materialized." -Path "runtime" -Recommendation "Keep runtime as target architecture until local stack phase begins."
}

$TopFindings | Export-Csv -LiteralPath $TopFindingsCsv -NoTypeInformation -Encoding UTF8

$Result = "PASS"
if ($HardBlockers.Count -gt 0) {
  $Result = "FAIL"
}
elseif ($Warnings.Count -gt 0 -or $Gaps.Count -gt 0) {
  $Result = "PASS_WITH_WARNINGS"
}

$Evidence = [ordered]@{
  sessionId = $SessionId
  repoRoot = $RepoRoot
  result = $Result
  counts = [ordered]@{
    inventoryRows = @($InventoryRows).Count
    governanceFiles = @($GovernanceRows).Count
    governanceRootFiles = $GovernanceFileCount
    docsGovernanceFiles = $DocsGovernanceFileCount
    referenceRows = @($ReferenceRows).Count
    prdSpecCandidates = @($PrdSpecRows).Count
    governancePrdSpecCandidates = $GovernancePrdCandidates
    docsPrdSpecCandidates = $DocsPrdCandidates
    legacyPrdSpecCandidates = $LegacyPrdCandidates
    agentFiles = @($AgentRows).Count
    cursorRules = @($CursorRows).Count
    scriptReferences = @($ScriptRefRows).Count
    missingScriptReferences = @($ScriptRefRows | Where-Object { -not $_.exists }).Count
    specKitSignalsFound = @($SpecKitFound).Count
    blockers = $HardBlockers.Count
    warnings = $Warnings.Count
    gaps = $Gaps.Count
  }
  files = [ordered]@{
    summary = $SummaryPath
    evidence = $EvidencePath
    inventory = $InventoryCsv
    governanceFiles = $GovernanceFilesCsv
    references = $ReferenceMapCsv
    prdSpecCandidates = $PrdSpecCsv
    scriptReferenceCheck = $ScriptRefCsv
    structureReadiness = $StructureCsv
    agentFrontmatterCheck = $AgentFrontmatterCsv
    cursorRulesCheck = $CursorRulesCsv
    topFindings = $TopFindingsCsv
  }
  blockers = @($HardBlockers)
  warnings = @($Warnings)
  gaps = @($Gaps)
}

$Evidence | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8

$Lines = New-Object System.Collections.Generic.List[string]

function Add-SummaryLine {
  param([string]$Text)
  $Lines.Add($Text) | Out-Null
}

Add-SummaryLine "SESSION_ID: $SessionId"
Add-SummaryLine "RUN_ROOT  : $RunRoot"
Add-SummaryLine "RESULT    : $Result"
Add-SummaryLine ""
Add-SummaryLine "COUNTS:"
Add-SummaryLine "- governance_root_files             : $GovernanceFileCount"
Add-SummaryLine "- docs_governance_files             : $DocsGovernanceFileCount"
Add-SummaryLine "- reference_rows                    : $(@($ReferenceRows).Count)"
Add-SummaryLine "- docs_governance_reference_files   : $DocsGovRefs"
Add-SummaryLine "- tools_registry_reference_files    : $ToolsRegistryRefs"
Add-SummaryLine "- prd_spec_candidates_total         : $(@($PrdSpecRows).Count)"
Add-SummaryLine "- prd_spec_candidates_governance    : $GovernancePrdCandidates"
Add-SummaryLine "- prd_spec_candidates_docs          : $DocsPrdCandidates"
Add-SummaryLine "- prd_spec_candidates_legacy        : $LegacyPrdCandidates"
Add-SummaryLine "- agent_files                       : $(@($AgentRows).Count)"
Add-SummaryLine "- cursor_rules                      : $(@($CursorRows).Count)"
Add-SummaryLine "- script_references                 : $(@($ScriptRefRows).Count)"
Add-SummaryLine "- missing_script_references         : $(@($ScriptRefRows | Where-Object { -not $_.exists }).Count)"
Add-SummaryLine "- spec_kit_signals_found            : $(@($SpecKitFound).Count)"
Add-SummaryLine "- blockers                          : $($HardBlockers.Count)"
Add-SummaryLine "- warnings                          : $($Warnings.Count)"
Add-SummaryLine "- gaps                              : $($Gaps.Count)"
Add-SummaryLine ""
Add-SummaryLine "BLOCKERS:"
if ($HardBlockers.Count -eq 0) {
  Add-SummaryLine "- none"
}
else {
  foreach ($Item in $HardBlockers) {
    Add-SummaryLine "- $Item"
  }
}
Add-SummaryLine ""
Add-SummaryLine "WARNINGS:"
if ($Warnings.Count -eq 0) {
  Add-SummaryLine "- none"
}
else {
  foreach ($Item in $Warnings) {
    Add-SummaryLine "- $Item"
  }
}
Add-SummaryLine ""
Add-SummaryLine "GAPS:"
if ($Gaps.Count -eq 0) {
  Add-SummaryLine "- none"
}
else {
  foreach ($Item in $Gaps) {
    Add-SummaryLine "- $Item"
  }
}
Add-SummaryLine ""
Add-SummaryLine "CANONICAL_DECISION_CHECK:"
Add-SummaryLine "- governance/ should be treated as the Governance Control Plane target."
Add-SummaryLine "- governance/legacy-extracted remains the transitional review area; legacy governance deletion requires separate readiness proof."
Add-SummaryLine "- tools/registry/runs remains the current canonical evidence root."
Add-SummaryLine "- tools/registry must not replace kdt/volatile/registry without explicit SSoT override."
Add-SummaryLine "- Spec Kit is not present unless signals are found above."
Add-SummaryLine "- Master Build Spec material should be promoted only after conflict review."
Add-SummaryLine ""
Add-SummaryLine "EVIDENCE_FILES:"
Add-SummaryLine "- $EvidencePath"
Add-SummaryLine "- $InventoryCsv"
Add-SummaryLine "- $GovernanceFilesCsv"
Add-SummaryLine "- $ReferenceMapCsv"
Add-SummaryLine "- $PrdSpecCsv"
Add-SummaryLine "- $ScriptRefCsv"
Add-SummaryLine "- $StructureCsv"
Add-SummaryLine "- $AgentFrontmatterCsv"
Add-SummaryLine "- $CursorRulesCsv"
Add-SummaryLine "- $TopFindingsCsv"
Add-SummaryLine "- $SummaryPath"

$Lines | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "CHECK_ANALYZE_GOVERNANCE_CONTROL_PLANE_DEEP" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SESSION_ID: $SessionId"
Write-Host "RUN_ROOT  : $RunRoot"

if ($Result -eq "FAIL") {
  Write-Host "RESULT    : FAIL" -ForegroundColor Red
}
elseif ($Result -eq "PASS_WITH_WARNINGS") {
  Write-Host "RESULT    : PASS_WITH_WARNINGS" -ForegroundColor Yellow
}
else {
  Write-Host "RESULT    : PASS" -ForegroundColor Green
}

Write-Host ""
Write-Host "TOP SUMMARY:" -ForegroundColor Cyan
Write-Host "- governance_root_files          : $GovernanceFileCount"
Write-Host "- docs_governance_files          : $DocsGovernanceFileCount"
Write-Host "- prd_spec_candidates_total      : $(@($PrdSpecRows).Count)"
Write-Host "- missing_script_references      : $(@($ScriptRefRows | Where-Object { -not $_.exists }).Count)"
Write-Host "- spec_kit_signals_found         : $(@($SpecKitFound).Count)"
Write-Host "- blockers                       : $($HardBlockers.Count)"
Write-Host "- warnings                       : $($Warnings.Count)"
Write-Host "- gaps                           : $($Gaps.Count)"

Write-Host ""
Write-Host "SUMMARY:" -ForegroundColor Cyan
Get-Content -LiteralPath $SummaryPath

Write-Host ""
Write-Host "DONE. Deep governance analysis evidence pack created." -ForegroundColor Green
Write-Host "SUMMARY: $SummaryPath" -ForegroundColor Cyan
Write-Host "JSON   : $EvidencePath" -ForegroundColor Cyan

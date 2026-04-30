Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
Set-StrictMode -Version Latest

$IssueCode = "CHECK_GIT_BRANCH_TRUTH_AND_CHECKPOINT_SAFETY"
$SessionId = "$IssueCode-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$RunRoot = Join-Path "C:\bthwani-suite\tools\registry\runs" $SessionId

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null

$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidencePath = Join-Path $RunRoot "evidence.json"
$CommandsLogPath = Join-Path $RunRoot "commands.log"
$StatusPath = Join-Path $RunRoot "status.txt"

$Findings = New-Object System.Collections.Generic.List[object]
$Commands = New-Object System.Collections.Generic.List[string]

function Add-CommandLog {
    param([string]$Command)
    [void]$Commands.Add($Command)
}

function Add-Finding {
    param(
        [string]$Level,
        [string]$Code,
        [string]$Message,
        [string]$Evidence
    )

    [void]$Findings.Add([pscustomobject]@{
        level = $Level
        code = $Code
        message = $Message
        evidence = $Evidence
    })
}

function Invoke-GitText {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments,
        [switch]$AllowFail
    )

    $commandText = "git $($Arguments -join ' ')"
    Add-CommandLog $commandText

    $output = & git @Arguments 2>&1
    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0 -and -not $AllowFail) {
        throw "$commandText failed with exit code $exitCode.`n$output"
    }

    return [pscustomobject]@{
        exitCode = $exitCode
        output = @($output)
    }
}

function Test-GitRef {
    param([string]$Ref)

    $result = Invoke-GitText -Arguments @("show-ref", "--verify", "--quiet", $Ref) -AllowFail
    return ($result.exitCode -eq 0)
}

function Normalize-BranchName {
    param([string]$Name)

    if ([string]::IsNullOrWhiteSpace($Name)) {
        return $Name
    }

    $value = $Name.Trim()

    if ($value -match "^origin/(.+)$") {
        return $Matches[1]
    }

    return $value
}

function Get-GhbNumber {
    param([string]$BranchName)

    $normalized = Normalize-BranchName $BranchName

    if ($normalized -match "^ghb/\((\d+)\)-") {
        return [int]$Matches[1]
    }

    if ($normalized -match "^ghb/(\d+)-") {
        return [int]$Matches[1]
    }

    return $null
}

function Get-AheadBehind {
    param(
        [string]$Base,
        [string]$Head
    )

    $result = Invoke-GitText -Arguments @("rev-list", "--left-right", "--count", "$Base...$Head") -AllowFail

    if ($result.exitCode -ne 0 -or -not $result.output -or [string]::IsNullOrWhiteSpace($result.output[0])) {
        return $null
    }

    $parts = ($result.output[0].ToString().Trim() -split "\s+")

    if ($parts.Count -lt 2) {
        return $null
    }

    return [pscustomobject]@{
        baseOnly = [int]$parts[0]
        headOnly = [int]$parts[1]
    }
}

try {
    Add-CommandLog "Set-Location -LiteralPath C:\bthwani-suite"

    $repoRootResult = Invoke-GitText -Arguments @("rev-parse", "--show-toplevel")
    $repoRoot = ($repoRootResult.output | Select-Object -First 1).ToString().Trim()

    if ($repoRoot -eq "C:\bthwani-suite") {
        Add-Finding "PASS" "REPO_ROOT_OK" "المسار الحالي صحيح." $repoRoot
    } else {
        Add-Finding "WARN" "REPO_ROOT_MISMATCH" "المسار الحالي داخل Git ليس C:\bthwani-suite." $repoRoot
    }

    $fetchResult = Invoke-GitText -Arguments @("fetch", "--prune", "origin") -AllowFail
    if ($fetchResult.exitCode -eq 0) {
        Add-Finding "PASS" "FETCH_ORIGIN_OK" "تم تحديث مراجع origin بنجاح." "git fetch --prune origin"
    } else {
        Add-Finding "WARN" "FETCH_ORIGIN_FAILED" "تعذر تحديث مراجع origin. سيتم التشخيص بالمراجع المحلية الحالية." ($fetchResult.output -join " ")
    }

    $currentBranchResult = Invoke-GitText -Arguments @("rev-parse", "--abbrev-ref", "HEAD")
    $currentBranch = ($currentBranchResult.output | Select-Object -First 1).ToString().Trim()

    if ([string]::IsNullOrWhiteSpace($currentBranch) -or $currentBranch -eq "HEAD") {
        Add-Finding "BLOCKED" "DETACHED_HEAD" "أنت في Detached HEAD. لا تعمل checkpoint قبل الرجوع إلى فرع واضح." $currentBranch
    } else {
        Add-Finding "PASS" "CURRENT_BRANCH_DETECTED" "تم تحديد الفرع الحالي." $currentBranch
    }

    $gitDirResult = Invoke-GitText -Arguments @("rev-parse", "--git-dir")
    $gitDir = ($gitDirResult.output | Select-Object -First 1).ToString().Trim()

    $mergeHead = Join-Path $gitDir "MERGE_HEAD"
    $cherryPickHead = Join-Path $gitDir "CHERRY_PICK_HEAD"
    $rebaseMerge = Join-Path $gitDir "rebase-merge"
    $rebaseApply = Join-Path $gitDir "rebase-apply"

    if (Test-Path -LiteralPath $mergeHead) {
        Add-Finding "BLOCKED" "MERGE_IN_PROGRESS" "يوجد merge غير مكتمل. لا تعمل checkpoint قبل إنهائه أو إلغائه." $mergeHead
    } else {
        Add-Finding "PASS" "NO_MERGE_IN_PROGRESS" "لا يوجد merge غير مكتمل." $mergeHead
    }

    if (Test-Path -LiteralPath $cherryPickHead) {
        Add-Finding "BLOCKED" "CHERRY_PICK_IN_PROGRESS" "يوجد cherry-pick غير مكتمل. لا تعمل checkpoint قبل إنهائه أو إلغائه." $cherryPickHead
    } else {
        Add-Finding "PASS" "NO_CHERRY_PICK_IN_PROGRESS" "لا يوجد cherry-pick غير مكتمل." $cherryPickHead
    }

    if ((Test-Path -LiteralPath $rebaseMerge) -or (Test-Path -LiteralPath $rebaseApply)) {
        Add-Finding "BLOCKED" "REBASE_IN_PROGRESS" "يوجد rebase غير مكتمل. لا تعمل checkpoint قبل إنهائه أو إلغائه." "$rebaseMerge / $rebaseApply"
    } else {
        Add-Finding "PASS" "NO_REBASE_IN_PROGRESS" "لا يوجد rebase غير مكتمل." "$rebaseMerge / $rebaseApply"
    }

    $statusResult = Invoke-GitText -Arguments @("status", "--porcelain")
    $changedLines = @($statusResult.output | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    $changedCount = $changedLines.Count

    if ($changedCount -eq 0) {
        Add-Finding "PASS" "WORKTREE_CLEAN" "لا توجد تغييرات غير محفوظة." "changed_count=0"
    } else {
        Add-Finding "INFO" "WORKTREE_HAS_CHANGES" "توجد تغييرات غير محفوظة. هذا طبيعي قبل checkpoint، لكنه لا يعني أن الفرع جاهز كمصدر حقيقة." "changed_count=$changedCount"
    }

    if ($currentBranch -eq "main") {
        Add-Finding "WARN" "CURRENT_BRANCH_IS_MAIN" "أنت تعمل على main. للمبتدئ الأفضل عدم العمل المباشر على main." "current_branch=$currentBranch"
    } elseif ($currentBranch -eq "stable/current-truth") {
        Add-Finding "PASS" "CURRENT_BRANCH_IS_STABLE_TRUTH" "أنت على فرع مصدر الحقيقة المرحلي." "current_branch=$currentBranch"
    } elseif ($currentBranch -match "^work/") {
        Add-Finding "PASS" "CURRENT_BRANCH_IS_WORK" "أنت على فرع عمل مناسب." "current_branch=$currentBranch"
    } elseif ($currentBranch -match "^ghb/") {
        Add-Finding "INFO" "CURRENT_BRANCH_IS_GHB" "أنت على فرع checkpoint. هذا مناسب للحماية، لكنه ليس مصدر حقيقة تلقائيًا." "current_branch=$currentBranch"
    } else {
        Add-Finding "INFO" "CURRENT_BRANCH_CUSTOM" "أنت على فرع باسم مخصص." "current_branch=$currentBranch"
    }

    $allRefsResult = Invoke-GitText -Arguments @("for-each-ref", "--format=%(refname:short)", "refs/heads", "refs/remotes/origin")
    $allRefs = @(
        $allRefsResult.output |
            ForEach-Object { $_.ToString().Trim() } |
            Where-Object { $_ -and $_ -ne "origin/HEAD" }
    )

    $localBranches = @($allRefs | Where-Object { $_ -notmatch "^origin/" })
    $remoteBranches = @($allRefs | Where-Object { $_ -match "^origin/" })

    Add-Finding "INFO" "BRANCH_COUNTS" "عدد الفروع المحلية والبعيدة." "local=$($localBranches.Count); remote=$($remoteBranches.Count)"

    $stableLocalExists = Test-GitRef "refs/heads/stable/current-truth"
    $stableRemoteExists = Test-GitRef "refs/remotes/origin/stable/current-truth"
    $mainLocalExists = Test-GitRef "refs/heads/main"
    $mainRemoteExists = Test-GitRef "refs/remotes/origin/main"

    if ($stableLocalExists -or $stableRemoteExists) {
        Add-Finding "PASS" "STABLE_CURRENT_TRUTH_EXISTS" "فرع stable/current-truth موجود." "local=$stableLocalExists; remote=$stableRemoteExists"
    } else {
        Add-Finding "WARN" "STABLE_CURRENT_TRUTH_MISSING" "لا يوجد فرع stable/current-truth. أنصح بإنشائه كمصدر حقيقة مرحلي بدل الاعتماد على آخر ghb فقط." "local=$stableLocalExists; remote=$stableRemoteExists"
    }

    if ($mainLocalExists -or $mainRemoteExists) {
        Add-Finding "PASS" "MAIN_EXISTS" "فرع main موجود." "local=$mainLocalExists; remote=$mainRemoteExists"
    } else {
        Add-Finding "BLOCKED" "MAIN_MISSING" "فرع main غير موجود محليًا ولا بعيدًا حسب المراجع الحالية." "local=$mainLocalExists; remote=$mainRemoteExists"
    }

    $ghbCandidates = New-Object System.Collections.Generic.List[object]

    foreach ($ref in $allRefs) {
        $normalized = Normalize-BranchName $ref
        $number = Get-GhbNumber $normalized

        if ($null -ne $number) {
            [void]$ghbCandidates.Add([pscustomobject]@{
                number = $number
                ref = $ref
                branch = $normalized
                isRemote = ($ref -match "^origin/")
            })
        }
    }

    $latestGhb = $ghbCandidates | Sort-Object number, ref -Descending | Select-Object -First 1

    if ($latestGhb) {
        Add-Finding "INFO" "LATEST_GHB_DETECTED" "تم تحديد أحدث فرع ghb حسب الرقم." "number=$($latestGhb.number); branch=$($latestGhb.branch); ref=$($latestGhb.ref)"
    } else {
        Add-Finding "WARN" "NO_GHB_BRANCHES_FOUND" "لم يتم العثور على فروع ghb مرقمة." "refs_checked=$($allRefs.Count)"
    }

    if ($mainLocalExists) {
        $currentVsMain = Get-AheadBehind -Base "main" -Head "HEAD"
        if ($null -ne $currentVsMain) {
            Add-Finding "INFO" "CURRENT_VS_MAIN" "مقارنة الفرع الحالي مع main." "main_only=$($currentVsMain.baseOnly); current_only=$($currentVsMain.headOnly)"
        }
    }

    if ($stableLocalExists) {
        $currentVsStable = Get-AheadBehind -Base "stable/current-truth" -Head "HEAD"
        if ($null -ne $currentVsStable) {
            Add-Finding "INFO" "CURRENT_VS_STABLE" "مقارنة الفرع الحالي مع stable/current-truth." "stable_only=$($currentVsStable.baseOnly); current_only=$($currentVsStable.headOnly)"
        }
    }

    if ($latestGhb -and $mainLocalExists) {
        $latestVsMain = Get-AheadBehind -Base "main" -Head $latestGhb.branch

        if ($null -ne $latestVsMain) {
            if ($latestVsMain.headOnly -gt 0) {
                Add-Finding "WARN" "MAIN_BEHIND_LATEST_GHB" "main يبدو متأخرًا عن أحدث ghb. لا تعتمد main كمصدر حقيقة قبل المراجعة أو الدمج." "main_only=$($latestVsMain.baseOnly); latest_ghb_only=$($latestVsMain.headOnly); latest=$($latestGhb.branch)"
            } else {
                Add-Finding "PASS" "MAIN_NOT_BEHIND_LATEST_GHB" "main ليس متأخرًا عن أحدث ghb حسب المقارنة المحلية." "main_only=$($latestVsMain.baseOnly); latest_ghb_only=$($latestVsMain.headOnly)"
            }
        }
    }

    $packageJsonPath = Join-Path $repoRoot "package.json"

    if (Test-Path -LiteralPath $packageJsonPath) {
        $packageJson = Get-Content -LiteralPath $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $scriptCount = 0

        if ($packageJson.scripts) {
            $scriptCount = @($packageJson.scripts.PSObject.Properties).Count

            foreach ($scriptProperty in $packageJson.scripts.PSObject.Properties) {
                $scriptName = $scriptProperty.Name
                $scriptValue = [string]$scriptProperty.Value

                $pathMatches = [regex]::Matches($scriptValue, "(tools[\\/][A-Za-z0-9_\-\.\\/]+)")

                foreach ($match in $pathMatches) {
                    $relativePath = $match.Groups[1].Value -replace "/", "\"
                    $absolutePath = Join-Path $repoRoot $relativePath

                    if (Test-Path -LiteralPath $absolutePath) {
                        Add-Finding "PASS" "SCRIPT_REFERENCED_FILE_EXISTS" "الملف المشار إليه داخل script موجود." "script=$scriptName; file=$relativePath"
                    } else {
                        Add-Finding "WARN" "SCRIPT_REFERENCED_FILE_MISSING" "يوجد script يشير إلى ملف غير موجود. هذا قد يكسر أوامر التحقق." "script=$scriptName; file=$relativePath"
                    }
                }
            }
        }

        Add-Finding "INFO" "ROOT_PACKAGE_SCRIPTS" "عدد scripts في package.json الجذري." "scripts=$scriptCount"
    } else {
        Add-Finding "BLOCKED" "ROOT_PACKAGE_JSON_MISSING" "package.json الجذري غير موجود." $packageJsonPath
    }

    $expectedPaths = @(
        "pnpm-workspace.yaml",
        "nx.json",
        "tsconfig.base.json",
        "packages\ui-kit\package.json",
        "packages\app-shells\package.json",
        "packages\surfaces\package.json",
        "packages\api-types\package.json",
        "packages\api-clients\package.json",
        "apps\mobile\app-client\package.json",
        "apps\mobile\app-partner\package.json",
        "apps\mobile\app-captain\package.json",
        "apps\mobile\app-field\package.json",
        "apps\web\control-panel\package.json"
    )

    foreach ($relativePath in $expectedPaths) {
        $absolutePath = Join-Path $repoRoot $relativePath

        if (Test-Path -LiteralPath $absolutePath) {
            Add-Finding "PASS" "EXPECTED_PATH_EXISTS" "مسار متوقع موجود." $relativePath
        } else {
            Add-Finding "WARN" "EXPECTED_PATH_MISSING" "مسار متوقع غير موجود في هذه المرحلة أو على هذا الفرع." $relativePath
        }
    }

    $blockedCount = @($Findings | Where-Object { $_.level -eq "BLOCKED" }).Count
    $warnCount = @($Findings | Where-Object { $_.level -eq "WARN" }).Count
    $passCount = @($Findings | Where-Object { $_.level -eq "PASS" }).Count
    $infoCount = @($Findings | Where-Object { $_.level -eq "INFO" }).Count

    $finalStatus = if ($blockedCount -gt 0) {
        "BLOCKED"
    } elseif ($warnCount -gt 0) {
        "WARNINGS"
    } else {
        "PASS"
    }

    $summary = New-Object System.Collections.Generic.List[string]

    [void]$summary.Add("# $IssueCode")
    [void]$summary.Add("")
    [void]$summary.Add("- Session: `$SessionId`")
    [void]$summary.Add("- Repo: `C:\bthwani-suite`")
    [void]$summary.Add("- Current branch: `$currentBranch`")
    [void]$summary.Add("- Final status: `$finalStatus`")
    [void]$summary.Add("- PASS: `$passCount`")
    [void]$summary.Add("- WARN: `$warnCount`")
    [void]$summary.Add("- BLOCKED: `$blockedCount`")
    [void]$summary.Add("- INFO: `$infoCount`")
    [void]$summary.Add("- Changed files count: `$changedCount`")
    [void]$summary.Add("- Local branches: `$($localBranches.Count)`")
    [void]$summary.Add("- Remote branches: `$($remoteBranches.Count)`")

    if ($latestGhb) {
        [void]$summary.Add("- Latest ghb: `$($latestGhb.branch)`")
    } else {
        [void]$summary.Add("- Latest ghb: `[TBD]`")
    }

    [void]$summary.Add("")
    [void]$summary.Add("## Findings")
    [void]$summary.Add("")

    foreach ($finding in $Findings) {
        [void]$summary.Add("- **$($finding.level)** `$($finding.code)` — $($finding.message)  ")
        [void]$summary.Add("  Evidence: `$($finding.evidence)`")
    }

    [void]$summary.Add("")
    [void]$summary.Add("## Recommended interpretation")
    [void]$summary.Add("")
    [void]$summary.Add("- `ghb/*` = checkpoint / حماية / أرشيف تقدم.")
    [void]$summary.Add("- `work/*` = عمل جاري.")
    [void]$summary.Add("- `stable/current-truth` = آخر حقيقة مرحلية مثبتة.")
    [void]$summary.Add("- `main` = الحقيقة الرسمية بعد الدمج والتحقق فقط.")
    [void]$summary.Add("")
    [void]$summary.Add("## Output files")
    [void]$summary.Add("")
    [void]$summary.Add("- Evidence JSON: `$EvidencePath`")
    [void]$summary.Add("- Commands log: `$CommandsLogPath`")
    [void]$summary.Add("- Status: `$StatusPath`")

    $summary -join "`r`n" | Set-Content -LiteralPath $SummaryPath -Encoding UTF8

    $evidence = [pscustomobject]@{
        issueCode = $IssueCode
        sessionId = $SessionId
        repoRoot = $repoRoot
        currentBranch = $currentBranch
        finalStatus = $finalStatus
        counts = @{
            pass = $passCount
            warn = $warnCount
            blocked = $blockedCount
            info = $infoCount
            changed = $changedCount
            localBranches = $localBranches.Count
            remoteBranches = $remoteBranches.Count
        }
        latestGhb = if ($latestGhb) { $latestGhb } else { $null }
        stableCurrentTruth = @{
            localExists = $stableLocalExists
            remoteExists = $stableRemoteExists
        }
        main = @{
            localExists = $mainLocalExists
            remoteExists = $mainRemoteExists
        }
        findings = @($Findings)
        commands = @($Commands)
        generatedAt = (Get-Date).ToString("o")
    }

    $evidence | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $EvidencePath -Encoding UTF8
    $Commands -join "`r`n" | Set-Content -LiteralPath $CommandsLogPath -Encoding UTF8
    $finalStatus | Set-Content -LiteralPath $StatusPath -Encoding UTF8

    Write-Host ""
    Write-Host "CHECK COMPLETE"
    Write-Host "status: $finalStatus"
    Write-Host "current_branch: $currentBranch"

    if ($latestGhb) {
        Write-Host "latest_ghb: $($latestGhb.branch)"
    }

    Write-Host "changed_count: $changedCount"
    Write-Host "summary: $SummaryPath"
    Write-Host "evidence: $EvidencePath"
    Write-Host ""
}
catch {
    "FAILED" | Set-Content -LiteralPath $StatusPath -Encoding UTF8

    $errorSummary = @(
        "# $IssueCode",
        "",
        "- Session: `$SessionId`",
        "- Final status: `FAILED`",
        "- Error: $($_.Exception.Message)"
    ) -join "`r`n"

    $errorSummary | Set-Content -LiteralPath $SummaryPath -Encoding UTF8
    $Commands -join "`r`n" | Set-Content -LiteralPath $CommandsLogPath -Encoding UTF8

    Write-Host ""
    Write-Host "CHECK FAILED"
    Write-Host $_.Exception.Message
    Write-Host "summary: $SummaryPath"
    Write-Host ""

    throw
}

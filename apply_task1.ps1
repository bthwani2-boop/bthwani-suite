Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$SessionId = "CONTROL_PANEL_SHELL_IA_TASK1-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$EvidenceRoot = Join-Path "tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Text
  )
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $Path).Path, $Text, $utf8NoBom)
}

function Capture {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][scriptblock]$Command
  )
  $outFile = Join-Path $EvidenceRoot $Name
  try {
    & $Command *>&1 | Tee-Object -FilePath $outFile
  } catch {
    $_ | Out-File -FilePath $outFile -Encoding utf8
    throw
  }
}

Capture "00_git-status-before.txt" { git --no-pager status --short }
Capture "01_git-diff-check-before.txt" { git --no-pager diff --check }

$hostFile = "control-panel\shell\ControlPanelSurfaceHost.tsx"
$runtimeFile = "control-panel\shell\runtime.data.ts"
$cssFile = "control-panel\shell\control-panel-shell.module.css"

foreach ($file in @($hostFile, $runtimeFile, $cssFile)) {
  if (-not (Test-Path -LiteralPath $file)) {
    throw "Required file not found: $file"
  }
  Copy-Item -LiteralPath $file -Destination (Join-Path $EvidenceRoot ("backup_" + ($file -replace '[\\/:*?""<>|]', '_'))) -Force
}

$hostContent = Get-Content -LiteralPath $hostFile -Raw -Encoding UTF8
$runtime = Get-Content -LiteralPath $runtimeFile -Raw -Encoding UTF8
$css = Get-Content -LiteralPath $cssFile -Raw -Encoding UTF8

# 1) Remove direct dependency on WebSignalCard because the shell no longer needs it for an unused local type.
$hostContent = $hostContent -replace "import \{\r?\n  WebCommandCenterFrame,\r?\n  WebSignalCard,\r?\n\} from '@bthwani/ui-kit/web';", "import { WebCommandCenterFrame } from '@bthwani/ui-kit/web';"
$hostContent = $hostContent -replace "\r?\ntype SignalTone = React\.ComponentProps<typeof WebSignalCard>\['tone'\];", ""

# 2) Add explicit shell action/status model close to the route contract.
$needle = "const allServiceTabId = 'all-services';"
$insert = @"
const allServiceTabId = 'all-services';

type ShellCommandStatus = {
  kind: 'ready' | 'search' | 'refresh' | 'alert' | 'filter' | 'blocked';
  label: string;
  description: string;
};

const renderedSectionIds = [
  'dashboard',
  'operations',
  'finance',
  'community-services',
  'support',
  'partners',
  'catalogs',
  'marketing',
  'platform',
  'administration',
] as const satisfies readonly ControlPanelSectionId[];

function hasRenderableSection(sectionId: ControlPanelSectionId) {
  return (renderedSectionIds as readonly string[]).includes(sectionId);
}
"@
if ($hostContent -notmatch [regex]::Escape("type ShellCommandStatus = {")) {
  $hostContent = $hostContent.Replace($needle, $insert)
}

# 3) Remove dead helpers that were not contributing to the shell contract.
$hostContent = [regex]::Replace(
  $hostContent,
  "\r?\nfunction getSectionServiceIds\(sectionId: string\) \{\r?\n  return controlPanelRuntimeData\.sections\.find\(\(sectionEntry\) => sectionEntry\.id === sectionId\)\?\.serviceIds \?\? \[\];\r?\n\}\r?\n\r?\nfunction countLiveCoverage\(serviceIds: readonly string\[\]\) \{\r?\n  return serviceIds\.filter\(\(serviceId\) => \{\r?\n    const serviceMeta = controlPanelRuntimeData\.services\.find\(\(service\) => service\.id === serviceId\);\r?\n    return serviceMeta && !serviceMeta\.placeholder;\r?\n  \}\)\.length;\r?\n\}\r?\n",
  "`r`n"
)

# 4) Add visible command status state.
$needle = "  const [isAppearanceMenuOpen, setIsAppearanceMenuOpen] = React.useState(false);"
$insert = @"
  const [isAppearanceMenuOpen, setIsAppearanceMenuOpen] = React.useState(false);
  const [commandStatus, setCommandStatus] = React.useState<ShellCommandStatus>({
    kind: 'ready',
    label: 'جاهز',
    description: 'الشل جاهز، وكل إجراء علوي يجب أن يترك أثرًا ظاهرًا داخل هذا الشريط.',
  });
"@
if ($hostContent -notmatch [regex]::Escape("const [commandStatus, setCommandStatus]")) {
  $hostContent = $hostContent.Replace($needle, $insert)
}

# 5) Add section ownership/status facts derived from runtime data.
$needle = "  const activeAppearance = appearanceOptions.find((option) => option.mode === mode) ?? appearanceOptions[0];"
$insert = @"
  const activeAppearance = appearanceOptions.find((option) => option.mode === mode) ?? appearanceOptions[0];
  const activeMission = controlPanelRuntimeData.missions.find((mission) => (
    mission.sectionId === activeSectionId && !mission.placeholder
  ));
  const activeSectionRuntime = controlPanelRuntimeData.sections.find((sectionEntry) => sectionEntry.id === activeSectionId);
  const activeSectionServiceIds = activeSectionRuntime?.serviceIds ?? [];
  const liveSectionServiceCount = activeSectionServiceIds.filter((serviceId) => {
    const serviceMeta = controlPanelRuntimeData.services.find((service) => service.id === serviceId);
    return serviceMeta && !serviceMeta.placeholder;
  }).length;
  const hasPrimarySectionContent = hasRenderableSection(activeSectionId);
  const sectionOwnershipLabel = activeMission
    ? `owner:${activeMission.ownerSectionId} / flow:${activeMission.flowId}`
    : 'owner:TBD / flow:TBD';
  const sectionCoverageLabel = activeSectionServiceIds.length > 0
    ? `${liveSectionServiceCount}/${activeSectionServiceIds.length} live services`
    : 'لا توجد خدمات مرتبطة';
  const shellStatusClassName = [
    styles.shellContractStatusPill,
    commandStatus.kind === 'blocked' ? styles.shellContractStatusPillBlocked : '',
    commandStatus.kind === 'alert' ? styles.shellContractStatusPillAlert : '',
  ].join(' ');
"@
if ($hostContent -notmatch [regex]::Escape("const activeMission = controlPanelRuntimeData.missions.find")) {
  $hostContent = $hostContent.Replace($needle, $insert)
}

# 6) Replace shell handlers so every top action and filter has a visible state/result.
$hostContent = [regex]::Replace(
  $hostContent,
  "  const handleSearchClick = React\.useCallback\(\(\) => undefined, \[\]\);",
  @"
  const handleSearchClick = React.useCallback(() => {
    setCommandStatus({
      kind: 'search',
      label: 'بحث القسم',
      description: `تم تفعيل بحث الشل داخل ${shellCopy.title}. لا يتم إنشاء route جديد؛ التفاصيل يجب أن تبقى داخل tabs/drawers/split panes الخاصة بالقسم.`,
    });
  }, [shellCopy.title]);
"@
)

$hostContent = [regex]::Replace(
  $hostContent,
  "  const handleRefreshClick = React\.useCallback\(\(\) => \{\r?\n    setAlertCount\(\(currentCount\) => \(currentCount > 0 \? currentCount - 1 : 0\)\);\r?\n  \}, \[\]\);",
  @"
  const handleRefreshClick = React.useCallback(() => {
    setAlertCount((currentCount) => (currentCount > 0 ? currentCount - 1 : 0));
    setCommandStatus({
      kind: 'refresh',
      label: 'تحديث محلي',
      description: `تم تحديث حالة الشل للقسم ${shellCopy.title} بدون API/backend/runtime mutation.`,
    });
  }, [shellCopy.title]);
"@
)

$hostContent = [regex]::Replace(
  $hostContent,
  "  const handleAlertClick = React\.useCallback\(\(\) => \{\r?\n    setSelectedServiceId\(allServiceTabId\);\r?\n    setAlertCount\(0\);\r?\n  \}, \[\]\);",
  @"
  const handleAlertClick = React.useCallback(() => {
    setSelectedServiceId(allServiceTabId);
    setAlertCount(0);
    setCommandStatus({
      kind: 'alert',
      label: 'تمت مراجعة التنبيهات',
      description: 'تمت إعادة فلتر الخدمات إلى الكل وتصفير مؤشر التنبيه داخل الشل.',
    });
  }, []);
"@
)

# 7) Replace raw top-filter setter with a real owner/status-aware handler.
$hostContent = $hostContent.Replace(
  "      onTopFilterSelect={setSelectedServiceId}",
  @"
      onTopFilterSelect={(serviceId) => {
        setSelectedServiceId(serviceId);
        const nextLabel = serviceId === allServiceTabId
          ? panelText.filters.allServices
          : getServiceLabel(uiText, serviceId);
        setCommandStatus({
          kind: 'filter',
          label: 'فلتر الخدمات',
          description: `تم حصر rail على ${nextLabel} مع الحفاظ على section ثابت وعدم إنشاء route إضافي.`,
        });
      }}
"@
)

# 8) Add breadcrumb/status strip and safe blocked state for any routed section without primary content.
$needle = "      <div className={styles.stageStack} dir={direction}>"
$insert = @"
      <div className={styles.stageStack} dir={direction}>
        <section className={styles.shellContractStrip} aria-live="polite">
          <nav className={styles.shellContractBreadcrumbs} aria-label="مسار لوحة التحكم">
            <span>{panelText.brandLabel}</span>
            <span aria-hidden="true">/</span>
            <strong>{shellCopy.title}</strong>
          </nav>

          <div className={styles.shellContractStatusCluster}>
            <span className={shellStatusClassName}>{commandStatus.label}</span>
            <span className={styles.shellContractStatusText}>{commandStatus.description}</span>
            <span className={styles.shellContractMeta}>{sectionOwnershipLabel}</span>
            <span className={styles.shellContractMeta}>{sectionCoverageLabel}</span>
          </div>
        </section>
"@
if ($hostContent -notmatch [regex]::Escape("styles.shellContractStrip")) {
  $hostContent = $hostContent.Replace($needle, $insert)
}

$needle = @"
        {activeSectionId === 'support' ? (
          <ControlPanelDshSupportQueueScreen />
        ) : null}

      </div>
"@
$insert = @"
        {activeSectionId === 'support' ? (
          <ControlPanelDshSupportQueueScreen />
        ) : null}

        {!hasPrimarySectionContent ? (
          <section className={styles.shellBoundaryState} role="status" aria-label="حالة حدود القسم">
            <span className={styles.shellBoundaryEyebrow}>حدود القسم</span>
            <h2 className={styles.shellBoundaryTitle}>{shellCopy.title}</h2>
            <p className={styles.shellBoundaryDescription}>
              هذا route موجود في خريطة الشل، لكنه لا يملك workspace قابلًا للعرض داخل العقد الحالي.
              لذلك لا يتم عرض واجهة ساكنة تدّعي التشغيل. يجب تحويل تفاصيله إلى tab/drawer/split pane داخل المالك الصحيح قبل اعتباره مغلقًا.
            </p>
            <button
              type="button"
              className={styles.shellBoundaryAction}
              onClick={() => {
                setCommandStatus({
                  kind: 'blocked',
                  label: 'قسم غير مكتمل',
                  description: `${shellCopy.title} يحتاج owner/workspace مثبت قبل تفعيل شاشة مستقلة.`,
                });
                router.push('/administration');
              }}
            >
              فتح الإدارة كمالك مؤقت
            </button>
          </section>
        ) : null}

      </div>
"@
if ($hostContent -match [regex]::Escape($needle)) {
  $hostContent = $hostContent.Replace($needle, $insert)
}

# 9) Remove duplicate section runtime record that makes ownership ambiguous.
$runtime = $runtime -replace "\r?\n  \{ id: 'community-services', serviceIds: \[\] \},", ""

# 10) Append shell contract strip CSS using only central CSS variables/tokens already exposed by ui-kit.
if ($css -notmatch [regex]::Escape(".shellContractStrip")) {
  $css += @"

.shellContractStrip {
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--bthwani-control-panel-border);
  border-radius: 14px;
  background: var(--bthwani-control-panel-surface);
  color: var(--bthwani-control-panel-text);
}

.shellContractBreadcrumbs {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--bthwani-control-panel-text-muted);
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.shellContractBreadcrumbs strong {
  color: var(--bthwani-control-panel-brand);
  font-weight: 900;
}

.shellContractStatusCluster {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.shellContractStatusPill,
.shellContractMeta {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
}

.shellContractStatusPill {
  background: var(--bthwani-brand-surface);
  color: var(--bthwani-brand);
}

.shellContractStatusPillBlocked {
  background: var(--bthwani-warning-surface);
  color: var(--bthwani-warning);
}

.shellContractStatusPillAlert {
  background: var(--bthwani-success-surface);
  color: var(--bthwani-success);
}

.shellContractStatusText {
  min-width: 0;
  overflow: hidden;
  color: var(--bthwani-control-panel-text-muted);
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shellContractMeta {
  background: var(--bthwani-control-panel-surface-inset);
  color: var(--bthwani-control-panel-text-muted);
}

.shellBoundaryState {
  display: grid;
  gap: 10px;
  align-content: center;
  justify-items: start;
  min-height: 280px;
  padding: 22px;
  border: 1px dashed var(--bthwani-control-panel-border-strong);
  border-radius: 18px;
  background: linear-gradient(180deg, var(--bthwani-control-panel-surface) 0%, var(--bthwani-control-panel-surface-raised) 100%);
}

.shellBoundaryEyebrow {
  color: var(--bthwani-brand);
  font-size: 12px;
  font-weight: 900;
}

.shellBoundaryTitle {
  margin: 0;
  color: var(--bthwani-control-panel-brand);
  font-size: 24px;
  font-weight: 900;
}

.shellBoundaryDescription {
  margin: 0;
  max-width: 72ch;
  color: var(--bthwani-control-panel-text-muted);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.8;
}

.shellBoundaryAction {
  appearance: none;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--bthwani-control-panel-border-strong);
  border-radius: 12px;
  background: var(--bthwani-control-panel-brand);
  color: var(--bthwani-brand-contrast);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 900;
}

@media (max-width: 1100px) {
  .shellContractStrip {
    grid-template-columns: 1fr;
  }

  .shellContractStatusCluster {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .shellContractStatusText {
    white-space: normal;
  }
}
"@
}

Write-Utf8NoBom -Path $hostFile -Text $hostContent
Write-Utf8NoBom -Path $runtimeFile -Text $runtime
Write-Utf8NoBom -Path $cssFile -Text $css

Capture "02_git-status-after-apply.txt" { git --no-pager status --short }
Capture "03_git-diff-stat-after-apply.txt" { git --no-pager diff --stat }
Capture "04_git-diff-name-status-after-apply.txt" { git --no-pager diff --name-status }
Capture "05_git-diff-check-after-apply.txt" { git --no-pager diff --check }

# Verification commands requested by the target contract. Failures are captured and summarized; the script does not claim READY.
$verification = @(
  @{ Name = "06_tsc-noemit.txt"; Command = { pnpm -w exec tsc --noEmit } },
  @{ Name = "07_guard-service-blueprint.txt"; Command = { pnpm run guard:service-blueprint } },
  @{ Name = "08_guard-secret-scan.txt"; Command = { pnpm run guard:secret-scan } }
)

$verificationFailures = @()
foreach ($item in $verification) {
  try {
    Capture $item.Name $item.Command
  } catch {
    $verificationFailures += $item.Name
  }
}

git --no-pager diff -- . > (Join-Path $EvidenceRoot "LOCAL_CHANGE_REVIEW.patch")
git ls-files --others --exclude-standard > (Join-Path $EvidenceRoot "LOCAL_CHANGE_UNTRACKED_FILES.txt")

$summary = @"
status: TASK1_APPLIED_LOCALLY_VERIFY_REVIEW_REQUIRED
session_id: $SessionId
repo: C:\bthwani-suite
target: Control Panel Shell / IA / Navigation Contract
changed_files:
- control-panel/shell/ControlPanelSurfaceHost.tsx
- control-panel/shell/runtime.data.ts
- control-panel/shell/control-panel-shell.module.css
task1_scope:
- make shell command actions visible and stateful
- add breadcrumb/status strip inside the shell
- remove duplicate community-services runtime row
- show blocked boundary state for routed sections without primary content
forbidden_not_touched:
- no GitHub write
- no backend/API/OpenAPI/DB/runtime mutation
- no package.json/lockfile
- no ui-kit file creation
verification_failures:
$($verificationFailures -join "`n")
next:
- Upload this evidence ZIP and screenshots after running the control panel.
"@
$summary | Out-File -FilePath (Join-Path $EvidenceRoot "SUMMARY.md") -Encoding utf8

$zipPath = Join-Path $EvidenceRoot "$SessionId.zip"
Compress-Archive -Path (Join-Path $EvidenceRoot "*") -DestinationPath $zipPath -Force

Write-Host ""
Write-Host "RESULT: TASK1_APPLIED_LOCALLY_VERIFY_REVIEW_REQUIRED"
Write-Host "Evidence: $EvidenceRoot"
Write-Host "ZIP: $zipPath"
if ($verificationFailures.Count -gt 0) {
  Write-Host "Verification failures captured:"
  $verificationFailures | ForEach-Object { Write-Host "- $_" }
} else {
  Write-Host "Verification commands completed without captured failures."
}

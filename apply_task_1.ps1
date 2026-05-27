Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"
$SessionId = "CONTROL_PANEL_SHELL_IA_CONTRACT-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$EvidenceRoot = Join-Path "tools\registry\runs" $SessionId
New-Item -ItemType Directory -Force -Path $EvidenceRoot | Out-Null

"ÙŠØ¬Ø¨ Ù‚Ø¨Ù„ Ø§Ù„ØªÙ†ÙÙŠØ° Ø§Ù„Ø§Ø·Ù„Ø§Ø¹ Ø¹Ù„Ù‰ Ù…Ù„ÙØ§Øª Ø§Ù„ÙˆÙƒÙ„Ø§Ø¡ ÙˆØ§Ù„Ù€ skills Ø°Ø§Øª Ø§Ù„Ø¹Ù„Ø§Ù‚Ø© ÙˆØªØ·Ø¨ÙŠÙ‚ Ù…Ø§ ÙŠØ®Øµ Ø§Ù„Ù…Ù‡Ù…Ø© Ù…Ù†Ù‡Ø§ Ø¨Ø¯Ù‚Ø©ØŒ ÙˆØ¹Ø¯Ù… Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ Ø¹Ù„Ù‰ Ø§Ù„Ø°Ø§ÙƒØ±Ø© Ø£Ùˆ Ø§Ù„Ø§ÙØªØ±Ø§Ø¶." |
  Set-Content -LiteralPath (Join-Path $EvidenceRoot "pre-execution-guard.txt") -Encoding UTF8

$Files = @(
  "control-panel\shell\runtime.data.ts",
  "control-panel\shell\ControlPanelSurfaceHost.tsx",
  "control-panel\shell\control-panel-shell.module.css"
)

foreach ($File in $Files) {
  if (-not (Test-Path -LiteralPath $File)) {
    throw "BLOCKED: missing expected file: $File"
  }
  Copy-Item -LiteralPath $File -Destination (Join-Path $EvidenceRoot (($File -replace '[\\/]', '__') + ".bak")) -Force
}

git --no-pager status --short | Set-Content -LiteralPath (Join-Path $EvidenceRoot "git-status-before.txt") -Encoding UTF8
git --no-pager diff --check | Set-Content -LiteralPath (Join-Path $EvidenceRoot "git-diff-check-before.txt") -Encoding UTF8

$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)

$RuntimeData = @'
export type ControlPanelSectionId =
  | 'dashboard'
  | 'operations'
  | 'finance'
  | 'community-services'
  | 'support'
  | 'partners'
  | 'catalogs'
  | 'marketing'
  | 'platform'
  | 'administration'
  | 'hr';

export type ControlPanelSectionHref = `/${ControlPanelSectionId}`;

export type ControlPanelDetailPolicy =
  | 'section-root-only'
  | 'query-workspace-drawer'
  | 'internal-tabs-drawers-split-panes';

export type ControlPanelDuplicateDomainPolicy =
  | 'section-root-is-owner'
  | 'redirect-legacy-to-section-root'
  | 'supporting-link-only';

export type ControlPanelRuntimeService = {
  id: string;
  label: string;
  statusKind: 'live' | 'reference';
  sections: ControlPanelSectionId[];
  placeholder: boolean;
};

export type ControlPanelRuntimeSection = {
  id: ControlPanelSectionId;
  href: ControlPanelSectionHref;
  serviceIds: string[];
  ownerKind: 'top-level-section';
  routeOwnership: 'route-owned-section';
  detailPolicy: ControlPanelDetailPolicy;
  duplicateDomainPolicy: ControlPanelDuplicateDomainPolicy;
  statusStripLabel: string;
  allowsRouteDetail: boolean;
};

export type ControlPanelRuntimeMission = {
  sectionId: ControlPanelSectionId;
  flowId: string;
  ownerSectionId: ControlPanelSectionId;
  dueKind: 'defined' | 'missing';
  placeholder: boolean;
};

export const allServiceFilterId = 'all-services' as const;

export const controlPanelTopLevelSectionIds = [
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
  'hr',
] as const satisfies readonly ControlPanelSectionId[];

export const controlPanelSectionRouteMap: Record<ControlPanelSectionId, ControlPanelSectionHref> = {
  dashboard: '/dashboard',
  operations: '/operations',
  finance: '/finance',
  'community-services': '/community-services',
  support: '/support',
  partners: '/partners',
  catalogs: '/catalogs',
  marketing: '/marketing',
  platform: '/platform',
  administration: '/administration',
  hr: '/hr',
};

const controlPanelServices: ControlPanelRuntimeService[] = [
  { id: 'dsh', label: 'DSH', statusKind: 'live', sections: ['dashboard', 'operations', 'catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr'], placeholder: false },
  { id: 'arb', label: 'ARB', statusKind: 'live', sections: ['operations', 'partners', 'support'], placeholder: false },
  { id: 'amn', label: 'AMN', statusKind: 'reference', sections: ['operations', 'support'], placeholder: true },
  { id: 'wlt', label: 'WLT', statusKind: 'live', sections: ['finance'], placeholder: false },
  { id: 'knz', label: 'KNZ', statusKind: 'live', sections: ['community-services'], placeholder: false },
  { id: 'kwd', label: 'KWD', statusKind: 'reference', sections: ['community-services'], placeholder: true },
  { id: 'esf', label: 'ESF', statusKind: 'reference', sections: ['community-services'], placeholder: true },
  { id: 'mrf', label: 'MRF', statusKind: 'reference', sections: ['community-services'], placeholder: true },
  { id: 'snd', label: 'SND', statusKind: 'reference', sections: ['community-services'], placeholder: true },
];

const controlPanelSections: ControlPanelRuntimeSection[] = [
  { id: 'dashboard', href: '/dashboard', serviceIds: ['dsh'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'section-root-only', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· Ø§Ù„ØªÙØ§ØµÙŠÙ„ Ø¯Ø§Ø®Ù„ ÙˆØ­Ø¯Ø§Øª Ø§Ù„Ø´Ù„', allowsRouteDetail: false },
  { id: 'operations', href: '/operations', serviceIds: ['dsh', 'arb', 'amn'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'query-workspace-drawer', duplicateDomainPolicy: 'redirect-legacy-to-section-root', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· workspace/query + drawer Ø¯Ø§Ø®Ù„ÙŠ', allowsRouteDetail: true },
  { id: 'finance', href: '/finance', serviceIds: ['wlt'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· Ø§Ù„ØªÙØ§ØµÙŠÙ„ Ø¯Ø§Ø®Ù„ tabs/drawers', allowsRouteDetail: false },
  { id: 'community-services', href: '/community-services', serviceIds: ['knz', 'kwd', 'esf', 'mrf', 'snd'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ù…Ø¬ØªÙ…Ø¹ Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§', allowsRouteDetail: false },
  { id: 'support', href: '/support', serviceIds: ['arb', 'amn'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· Ø§Ù„ØªØµØ¹ÙŠØ¯ Ø¯Ø§Ø®Ù„ queue/drawer', allowsRouteDetail: false },
  { id: 'partners', href: '/partners', serviceIds: ['dsh', 'arb'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· lifecycle Ø¯Ø§Ø®Ù„ tabs/drawers', allowsRouteDetail: false },
  { id: 'catalogs', href: '/catalogs', serviceIds: ['dsh'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· catalog detail Ø¯Ø§Ø®Ù„ pane/drawer', allowsRouteDetail: false },
  { id: 'marketing', href: '/marketing', serviceIds: ['dsh'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· campaigns Ø¯Ø§Ø®Ù„ tabs/drawers', allowsRouteDetail: false },
  { id: 'platform', href: '/platform', serviceIds: ['dsh'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· vars/config Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§', allowsRouteDetail: false },
  { id: 'administration', href: '/administration', serviceIds: ['dsh'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· approvals/roles Ø¯Ø§Ø®Ù„ÙŠÙ‹Ø§', allowsRouteDetail: false },
  { id: 'hr', href: '/hr', serviceIds: ['dsh'], ownerKind: 'top-level-section', routeOwnership: 'route-owned-section', detailPolicy: 'internal-tabs-drawers-split-panes', duplicateDomainPolicy: 'section-root-is-owner', statusStripLabel: 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· HR Ø¯Ø§Ø®Ù„ÙŠ ÙˆÙ„ÙŠØ³ service Ù…Ø³ØªÙ‚Ù„', allowsRouteDetail: false },
];

const controlPanelMissions: ControlPanelRuntimeMission[] = [
  { sectionId: 'dashboard', flowId: 'dsh-dashboard', ownerSectionId: 'dashboard', dueKind: 'defined', placeholder: false },
  { sectionId: 'operations', flowId: 'dsh-operations', ownerSectionId: 'operations', dueKind: 'defined', placeholder: false },
  { sectionId: 'finance', flowId: 'wlt-finance', ownerSectionId: 'finance', dueKind: 'defined', placeholder: false },
  { sectionId: 'community-services', flowId: 'knz-community-services', ownerSectionId: 'community-services', dueKind: 'defined', placeholder: false },
  { sectionId: 'support', flowId: 'arb-support', ownerSectionId: 'support', dueKind: 'defined', placeholder: false },
  { sectionId: 'partners', flowId: 'arb-partners', ownerSectionId: 'partners', dueKind: 'defined', placeholder: false },
  { sectionId: 'catalogs', flowId: 'dsh-catalogs', ownerSectionId: 'catalogs', dueKind: 'defined', placeholder: false },
  { sectionId: 'marketing', flowId: 'dsh-marketing', ownerSectionId: 'marketing', dueKind: 'defined', placeholder: false },
  { sectionId: 'platform', flowId: 'dsh-platform', ownerSectionId: 'platform', dueKind: 'defined', placeholder: false },
  { sectionId: 'administration', flowId: 'dsh-administration', ownerSectionId: 'administration', dueKind: 'defined', placeholder: false },
  { sectionId: 'hr', flowId: 'dsh-hr', ownerSectionId: 'hr', dueKind: 'defined', placeholder: false },
];

export function isControlPanelSectionId(sectionId: string): sectionId is ControlPanelSectionId {
  return (controlPanelTopLevelSectionIds as readonly string[]).includes(sectionId);
}

export function getControlPanelSectionContract(sectionId: string) {
  return controlPanelSections.find((section) => section.id === sectionId);
}

export const controlPanelRuntimeData = {
  services: controlPanelServices,
  sections: controlPanelSections,
  missions: controlPanelMissions,
} as const;
'@

[System.IO.File]::WriteAllText("control-panel\shell\runtime.data.ts", $RuntimeData, $Utf8NoBom)

$HostPath = "control-panel\shell\ControlPanelSurfaceHost.tsx"
$Host = [System.IO.File]::ReadAllText($HostPath).Replace("`r`n", "`n").Replace("`r", "`n")

$Host = $Host.Replace(
"import { controlPanelRuntimeData } from './runtime.data';",
"import {
  allServiceFilterId,
  controlPanelRuntimeData,
  controlPanelSectionRouteMap,
  controlPanelTopLevelSectionIds,
  getControlPanelSectionContract,
  isControlPanelSectionId,
  type ControlPanelSectionId,
} from './runtime.data';"
)

$OldHeaderBlock = @'
const phaseOneSectionIds = ['dashboard', 'operations', 'finance', 'community-services', 'support'] as const;
const hiddenSectionIds = ['catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr'] as const;
const primarySectionIds = [...phaseOneSectionIds, ...hiddenSectionIds] as const;

type ControlPanelSectionId = (typeof primarySectionIds)[number];
type PhaseOneSectionId = (typeof phaseOneSectionIds)[number];
type PrimarySectionHref = `/${ControlPanelSectionId}`;
type ControlPanelText = ReturnType<typeof useUiText>['controlPanel'];
type SignalTone = React.ComponentProps<typeof WebSignalCard>['tone'];
'@

$NewHeaderBlock = @'
const phaseOneSectionIds = ['dashboard', 'operations', 'finance', 'community-services', 'support'] as const;
const primarySectionIds = controlPanelTopLevelSectionIds;

type PhaseOneSectionId = (typeof phaseOneSectionIds)[number];
type PrimarySectionHref = `/${ControlPanelSectionId}`;
type ControlPanelText = ReturnType<typeof useUiText>['controlPanel'];
type SignalTone = React.ComponentProps<typeof WebSignalCard>['tone'];
'@

if (-not $Host.Contains($OldHeaderBlock)) { throw "BLOCKED: expected section id/type block not found." }
$Host = $Host.Replace($OldHeaderBlock, $NewHeaderBlock)

$Host = $Host.Replace("const allServiceTabId = 'all-services';", "const allServiceTabId = allServiceFilterId;")

$OldRouteMap = @'
const sectionRouteMap: Record<ControlPanelSectionId, PrimarySectionHref> = {
  dashboard: '/dashboard',
  operations: '/operations',
  finance: '/finance',
  'community-services': '/community-services',
  support: '/support',
  partners: '/partners',
  catalogs: '/catalogs',
  marketing: '/marketing',
  platform: '/platform',
  administration: '/administration',
  hr: '/hr',
};
'@

if (-not $Host.Contains($OldRouteMap)) { throw "BLOCKED: expected local route map block not found." }
$Host = $Host.Replace($OldRouteMap, "const sectionRouteMap = controlPanelSectionRouteMap;`n")

$Host = $Host.Replace(
"const handleSearchClick = React.useCallback(() => undefined, []);",
"const handleSearchClick = React.useCallback(() => {
    document.querySelector<HTMLInputElement>('.ui-web-command-strip__search-input')?.focus();
  }, []);"
)

$Anchor = "  const selectedServiceLabel = selectedServiceMeta ? getServiceLabel(uiText, selectedServiceMeta.id) : panelText.filters.allServices;`n  const activeAppearance = appearanceOptions.find((option) => option.mode === mode) ?? appearanceOptions[0];"
$Insert = @'
  const selectedServiceLabel = selectedServiceMeta ? getServiceLabel(uiText, selectedServiceMeta.id) : panelText.filters.allServices;
  const activeAppearance = appearanceOptions.find((option) => option.mode === mode) ?? appearanceOptions[0];
  const activeSectionContract = getControlPanelSectionContract(activeSectionId);
  const activeSectionServiceIds = getSectionServiceIds(activeSectionId);
  const liveCoverageCount = countLiveCoverage(activeSectionServiceIds);
  const sectionBreadcrumbLabel = `${panelText.brandLabel} / ${shellCopy.title}`;
  const sectionContractStatus = activeSectionContract?.statusStripLabel ?? 'Ù‚Ø³Ù… Ø«Ø§Ø¨Øª Â· Ø§Ù„ØªÙØ§ØµÙŠÙ„ Ø¯Ø§Ø®Ù„ Ø§Ù„Ø·Ø¨Ù‚Ø§Øª Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠØ©';
'@

if (-not $Host.Contains($Anchor)) { throw "BLOCKED: expected selectedService/appearance anchor not found." }
$Host = $Host.Replace($Anchor, $Insert)

$ProfileAnchor = "  const profileControl = (`n"
$RailStrip = @'
  const railContractStrip = (
    <div className={styles.railContractStrip} aria-label="Ø¹Ù‚Ø¯ Ù…Ù„Ø§Ø­Ø© Ø§Ù„Ù‚Ø³Ù… Ø§Ù„Ø­Ø§Ù„ÙŠ">
      <span className={styles.railContractBreadcrumb}>{sectionBreadcrumbLabel}</span>
      <span className={styles.railContractMeta}>
        {sectionContractStatus}
        {' Â· '}
        live {liveCoverageCount}/{activeSectionServiceIds.length}
      </span>
    </div>
  );

'@

if (-not $Host.Contains($ProfileAnchor)) { throw "BLOCKED: expected profileControl anchor not found." }
$Host = $Host.Replace($ProfileAnchor, $RailStrip + $ProfileAnchor)

$Host = $Host.Replace("const matchedSection = primarySectionIds.find((sectionId) => `/${sectionId}` === itemId);", "const matchedSection = primarySectionIds.find((sectionId) => `/${sectionId}` === itemId);")
$Host = $Host.Replace("        if (!matchedSection) {`n          return;`n        }", "        if (!matchedSection || !isControlPanelSectionId(matchedSection)) {`n          return;`n        }")
$Host = $Host.Replace("      railSupplementary={null}", "      railSupplementary={railContractStrip}")

[System.IO.File]::WriteAllText($HostPath, ($Host.TrimEnd() + "`n"), $Utf8NoBom)

$CssPath = "control-panel\shell\control-panel-shell.module.css"
$Css = [System.IO.File]::ReadAllText($CssPath)
if ($Css -notmatch "\.railContractStrip") {
  $CssAppend = @'

.railContractStrip {
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--bthwani-control-panel-border);
  background: var(--bthwani-control-panel-surface-inset);
  color: var(--bthwani-control-panel-text);
}

.railContractBreadcrumb {
  min-width: 0;
  overflow: hidden;
  color: var(--bthwani-control-panel-brand);
  font-size: 11px;
  font-weight: 900;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.railContractMeta {
  color: var(--bthwani-control-panel-text-muted);
  font-size: 10px;
  font-weight: 800;
  line-height: 1.6;
}
'@
  [System.IO.File]::WriteAllText($CssPath, ($Css.TrimEnd() + "`n" + $CssAppend.TrimStart()), $Utf8NoBom)
}

git --no-pager diff --stat | Set-Content -LiteralPath (Join-Path $EvidenceRoot "git-diff-stat-after.txt") -Encoding UTF8
git --no-pager diff --name-status | Set-Content -LiteralPath (Join-Path $EvidenceRoot "git-diff-name-status-after.txt") -Encoding UTF8
git --no-pager diff --check | Set-Content -LiteralPath (Join-Path $EvidenceRoot "git-diff-check-after.txt") -Encoding UTF8
git --no-pager status --short | Set-Content -LiteralPath (Join-Path $EvidenceRoot "git-status-after.txt") -Encoding UTF8

@"
status: TASK_1_APPLIED_LOCALLY_PENDING_VERIFICATION
target: Control Panel Shell / IA / Navigation Contract
changed_files:
- control-panel/shell/runtime.data.ts
- control-panel/shell/ControlPanelSurfaceHost.tsx
- control-panel/shell/control-panel-shell.module.css
blocked:
- no backend/API/DB/runtime mutation
- no package or lockfile change
- no ui-kit modification
next_verification:
- git --no-pager diff --check
- pnpm -w exec tsc --noEmit
- pnpm run guard:service-blueprint
- pnpm run guard:secret-scan
"@ | Set-Content -LiteralPath (Join-Path $EvidenceRoot "SUMMARY.md") -Encoding UTF8

Compress-Archive -Path (Join-Path $EvidenceRoot "*") -DestinationPath (Join-Path $EvidenceRoot "$SessionId.zip") -Force

Write-Host "RESULT: TASK_1_APPLIED_PENDING_VERIFICATION"
Write-Host "Evidence: $EvidenceRoot"
Write-Host "Zip: $(Join-Path $EvidenceRoot "$SessionId.zip")"

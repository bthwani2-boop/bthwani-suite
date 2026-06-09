import fs from 'node:fs';
import path from 'node:path';

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

const timestamp = getTimestamp();
const sessionId = `UI_IDENTITY_PHASE_3-${timestamp}`;
const root = process.cwd();
const runDir = path.join(root, 'tools/registry/runs', sessionId);
fs.mkdirSync(runDir, { recursive: true });

// Load reports
const ownershipPath = path.join(root, 'tools/guards/ownership-report.json');
const tokenDriftPath = path.join(root, 'tools/guards/token-drift.json');

const ownership = fs.existsSync(ownershipPath) ? JSON.parse(fs.readFileSync(ownershipPath, 'utf8')) : { issues: [] };
const tokenDrift = fs.existsSync(tokenDriftPath) ? JSON.parse(fs.readFileSync(tokenDriftPath, 'utf8')) : { issues: [] };

const allRawIssues = [...ownership.issues, ...tokenDrift.issues];
const classifiedIssues = [];

function getSurface(file) {
  const norm = file.replace(/\\/g, '/');
  if (norm.startsWith('app-client/') || norm.includes('/app-client/')) return 'app-client';
  if (norm.startsWith('app-partner/') || norm.includes('/app-partner/')) return 'app-partner';
  if (norm.startsWith('app-captain/') || norm.includes('/app-captain/')) return 'app-captain';
  if (norm.startsWith('app-field/') || norm.includes('/app-field/')) return 'app-field';
  if (norm.startsWith('control-panel/') || norm.includes('/control-panel/')) return 'control-panel';
  if (norm.startsWith('webapp/') || norm.includes('/webapp/')) return 'webapp';
  if (norm.startsWith('website/') || norm.includes('/website/')) return 'website';
  if (norm.startsWith('ui-kit/')) return 'ui-kit';
  if (norm.startsWith('dsh/')) return 'dsh';
  if (norm.startsWith('wlt/')) return 'wlt';
  return 'other';
}

function getPatternType(message) {
  const msg = message.toLowerCase();
  if (msg.includes('shadow')) return 'shadow-drift';
  if (msg.includes('createstyles') || msg.includes('makestyles') || msg.includes('getstyles') || msg.includes('designsystem')) return 'style-factory-drift';
  if (msg.includes('import')) return 'import-boundary';
  if (msg.includes('fontfamily')) return 'font-drift';
  if (msg.includes('stylesheet reusable') || msg.includes('stylesheet.create')) return 'stylesheet-recipe-drift';
  if (msg.includes('lane')) return 'lane-misuse';
  if (msg.includes('hex') || msg.includes('color')) return 'hex-color-drift';
  if (msg.includes('raster') || msg.includes('png') || msg.includes('jpg')) return 'raster-asset-drift';
  return 'other-drift';
}

function getExpectedOwner(patternType) {
  switch (patternType) {
    case 'shadow-drift': return 'ui-kit/foundation (shadowPresets)';
    case 'style-factory-drift': return 'ui-kit/foundation';
    case 'import-boundary': return 'ui-kit';
    case 'font-drift': return 'ui-kit/foundation (Text roles)';
    case 'stylesheet-recipe-drift': return 'ui-kit/foundation';
    case 'lane-misuse': return 'surface runtime boundary';
    case 'hex-color-drift': return 'ui-kit/foundation (color palette)';
    case 'raster-asset-drift': return 'ui-kit/foundation (SVG / media policy)';
    default: return 'ui-kit';
  }
}

function getSeverity(patternType, surface) {
  if (patternType === 'lane-misuse') return 'BLOCKER';
  if (patternType === 'font-drift') return 'HIGH';
  if (patternType === 'hex-color-drift') return 'MEDIUM';
  if (patternType === 'shadow-drift') return 'MEDIUM';
  if (patternType === 'style-factory-drift') return 'MEDIUM';
  if (patternType === 'import-boundary') return 'MEDIUM';
  if (patternType === 'raster-asset-drift') return 'LOW';
  return 'LOW';
}

function getSuggestedPhase(surface) {
  switch (surface) {
    case 'ui-kit': return 'Phase 4 (ui-kit contract hardening)';
    case 'app-client': return 'Phase 5 (app-client marketing)';
    case 'app-partner': return 'Phase 6 (partner/captain/field)';
    case 'app-captain': return 'Phase 6 (partner/captain/field)';
    case 'app-field': return 'Phase 6 (partner/captain/field)';
    case 'control-panel': return 'Phase 7 (control-panel operational)';
    case 'dsh': return 'Phase 7 (control-panel operational)';
    case 'wlt': return 'Phase 7 (control-panel operational)';
    case 'webapp': return 'Phase 8 (webapp/website readiness)';
    case 'website': return 'Phase 8 (webapp/website readiness)';
    default: return 'Phase 9 (isolation & cleanup)';
  }
}

function getSafeAction(patternType, evidence) {
  switch (patternType) {
    case 'shadow-drift': return 'Replace raw shadowOffset/shadowOpacity/shadowRadius with central shadowPresets or shadowByElevation.';
    case 'style-factory-drift': return 'Refactor createStyles to leverage ui-kit typography roles and central foundation tokens directly.';
    case 'import-boundary': return 'Replace deep local component imports with public exports from @bthwani/ui-kit.';
    case 'font-drift': return 'Remove direct fontFamily usage and wrap text in central ui-kit Text component using a standardized role.';
    case 'stylesheet-recipe-drift': return 'Move common component-like StyleSheet rules to ui-kit shared primitives.';
    case 'lane-misuse': return 'Refactor cross-runtime imports to use shared boundary models or clean interfaces.';
    case 'hex-color-drift': return `Replace hardcoded hex value (${evidence.split(': ').pop()}) with matching ui-kit token from foundation colors or semantic colors.`;
    case 'raster-asset-drift': return 'Convert raster asset to SVG icon or retrieve via central DSH/media fixture policy constant.';
    default: return 'Refactor to align with central brand guidelines in governance/08_UI_KIT_AND_BRAND.md.';
  }
}

for (const raw of allRawIssues) {
  const file = raw.file;
  const surface = getSurface(file);
  const patternType = getPatternType(raw.message);
  const ownerExpected = getExpectedOwner(patternType);
  const reusableOrScreen = file.includes('/screens/') || file.includes('Screen.tsx') ? 'screen-specific' : 'reusable';
  const experimentalOrProd = file.includes('demo') || file.includes('mock') || file.includes('fixture') || file.includes('preview') ? 'experimental' : 'production';
  const severity = getSeverity(patternType, surface);
  const suggestedPhase = getSuggestedPhase(surface);
  const safeAction = getSafeAction(patternType, raw.evidence || '');

  classifiedIssues.push({
    file,
    surface,
    patternType,
    ownerExpected,
    reusableOrScreen,
    experimentalOrProd,
    severity,
    suggestedPhase,
    safeAction,
    evidenceLine: raw.evidence || 'N/A'
  });
}

// Write JSON
fs.writeFileSync(
  path.join(runDir, 'inventory.json'),
  JSON.stringify({ sessionId, generatedAt: new Date().toISOString(), totalIssues: classifiedIssues.length, issues: classifiedIssues }, null, 2),
  'utf8'
);

// Write CSV
const csvHeaders = ['file', 'surface', 'patternType', 'ownerExpected', 'reusableOrScreen', 'experimentalOrProd', 'severity', 'suggestedPhase', 'safeAction', 'evidenceLine'];
const csvRows = [csvHeaders.join(',')];
for (const item of classifiedIssues) {
  const row = csvHeaders.map(h => {
    let val = String(item[h] ?? '').replace(/"/g, '""');
    if (val.includes(',') || val.includes('\n') || val.includes('"')) {
      val = `"${val}"`;
    }
    return val;
  });
  csvRows.push(row.join(','));
}
fs.writeFileSync(path.join(runDir, 'inventory.csv'), csvRows.join('\n'), 'utf8');

// Write MD
const mdLines = [
  `# BThwani UI Identity Design Drift Inventory — Phase 3`,
  ``,
  `**Session ID:** \`${sessionId}\``,
  `**Generated At:** ${new Date().toISOString()}`,
  `**Total Violations Documented:** ${classifiedIssues.length}`,
  ``,
  `## Summary of Severity`,
  `| Severity | Count |`,
  `|---|---|`,
  `| BLOCKER | ${classifiedIssues.filter(i => i.severity === 'BLOCKER').length} |`,
  `| HIGH | ${classifiedIssues.filter(i => i.severity === 'HIGH').length} |`,
  `| MEDIUM | ${classifiedIssues.filter(i => i.severity === 'MEDIUM').length} |`,
  `| LOW | ${classifiedIssues.filter(i => i.severity === 'LOW').length} |`,
  ``,
  `## Detailed Drift Catalog`,
  `| File | Surface | Type | Expected Owner | Scope | Env | Severity | Action | Evidence |`,
  `|---|---|---|---|---|---|---|---|---|`
];

for (const item of classifiedIssues) {
  mdLines.push(`| \`${item.file}\` | ${item.surface} | ${item.patternType} | ${item.ownerExpected} | ${item.reusableOrScreen} | ${item.experimentalOrProd} | **${item.severity}** | ${item.safeAction} | \`${item.evidenceLine}\` |`);
}

fs.writeFileSync(path.join(runDir, 'inventory.md'), mdLines.join('\n'), 'utf8');

console.log(`Inventory generated successfully in: ${runDir}`);
console.log(`Total issues: ${classifiedIssues.length}`);
console.log(`Session ID: ${sessionId}`);

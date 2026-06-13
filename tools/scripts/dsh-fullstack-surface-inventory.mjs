#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const token = process.argv[i];
  if (token.startsWith('--')) {
    const [key, inlineValue] = token.slice(2).split('=');
    args.set(key, inlineValue ?? process.argv[++i]);
  }
}

const outDir = path.resolve(root, args.get('out') ?? 'tools/registry/runs/DSH_WLT_FULLSTACK_SURFACE_UNIFICATION');
const scopeRoots = [
  'dsh/frontend/shared',
  'dsh/frontend/control-panel',
  'dsh/frontend/app-client',
  'dsh/frontend/app-partner',
  'dsh/frontend/app-captain',
  'dsh/frontend/app-field',
  'wlt/frontend/dsh',
  'dsh/domain',
  'dsh/backend',
  'wlt/domain',
  'wlt/backend',
];
const textExtensions = new Set(['.go', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.yaml', '.yml', '.md', '.css']);
const ignoredSegments = new Set(['.git', 'node_modules', 'dist', 'build', '.next', '.expo', 'coverage', 'graphify-out']);
const previewTerms = /\b(preview|demo|mock|sample|fixture|fallback|local-only|preview-only|currentPreviewValue|proposedPreviewValue|cart-preview|proof\.delivery\.preview)\b/i;
const importPattern = /^\s*(?:import|export)\s+(?:type\s+)?(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/gm;
const routePattern = /\b(route|screen|navigation|navigator|workspace|section|drawer|tab)\b/i;
const controlPanelInputPattern = /\b(create|update|upload|approve|reject|assign|rollback|audit|permission|media|store|product|category|field-readiness|operations)\b/i;
const wltBoundaryPattern = /\b(wallet|ledger|refund|settlement|payout|payment|balance|finance|WLT)\b/i;
const mediaRuntimePattern = /\b(upload intent|complete upload|dsh_media_assets|media runtime|MinIO|storage_key|media_id|mediaKey)\b/i;

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function walk(absDir, files = []) {
  if (!fs.existsSync(absDir)) return files;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    if (ignoredSegments.has(entry.name)) continue;
    const abs = path.join(absDir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, files);
    } else if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      files.push(abs);
    }
  }
  return files;
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function readText(abs) {
  try {
    return fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  } catch {
    return '';
  }
}

ensureDir(outDir);

const files = scopeRoots.flatMap((scopeRoot) => walk(path.join(root, scopeRoot)));
const fileInventory = [];
const importReferenceReport = [];
const routeScreenNavigationReport = [];
const previewDataMediaReport = [];
const sharedOwnershipReport = [];
const controlPanelInputPathReport = [];
const wltDshBoundaryReport = [];
const mediaRuntimeGateReport = [];
const uncoveredFiles = [];

for (const abs of files) {
  const rel = toPosix(path.relative(root, abs));
  const text = readText(abs);
  const lines = text ? text.split(/\r?\n/).length : 0;
  const owner =
    rel.startsWith('dsh/frontend/shared/') ? 'dsh-shared' :
    rel.startsWith('dsh/frontend/control-panel/') ? 'dsh-control-panel' :
    rel.startsWith('dsh/frontend/app-client/') ? 'dsh-client-surface' :
    rel.startsWith('dsh/frontend/app-partner/') ? 'dsh-partner-surface' :
    rel.startsWith('dsh/frontend/app-captain/') ? 'dsh-captain-surface' :
    rel.startsWith('dsh/frontend/app-field/') ? 'dsh-field-surface' :
    rel.startsWith('wlt/frontend/dsh/') ? 'wlt-dsh-bridge' :
    rel.startsWith('dsh/domain/') ? 'dsh-domain' :
    rel.startsWith('dsh/backend/') ? 'dsh-backend' :
    rel.startsWith('wlt/domain/') ? 'wlt-domain' :
    rel.startsWith('wlt/backend/') ? 'wlt-backend' :
    'unknown';

  const classification = {
    hasRouteSignal: routePattern.test(text),
    hasPreviewRuntimeSignal: previewTerms.test(text),
    hasControlPanelInputSignal: controlPanelInputPattern.test(text),
    hasWltBoundarySignal: wltBoundaryPattern.test(text),
    hasMediaRuntimeSignal: mediaRuntimePattern.test(text),
  };

  fileInventory.push({ path: rel, owner, extension: path.extname(rel), lines, ...classification });
  if (owner === 'unknown') uncoveredFiles.push(rel);

  importPattern.lastIndex = 0;
  let match;
  while ((match = importPattern.exec(text))) {
    importReferenceReport.push({ file: rel, line: lineOf(text, match.index), specifier: match[1] });
  }

  if (classification.hasRouteSignal) {
    routeScreenNavigationReport.push({ file: rel, owner, lines });
  }
  if (classification.hasPreviewRuntimeSignal) {
    const term = previewTerms.exec(text);
    previewDataMediaReport.push({ file: rel, owner, line: term ? lineOf(text, term.index) : 1, evidence: term?.[0] ?? 'preview-runtime-signal' });
  }
  if (owner === 'dsh-shared') {
    sharedOwnershipReport.push({
      file: rel,
      lines,
      classification: classification.hasWltBoundarySignal ? 'finance-boundary-or-read-model' : classification.hasMediaRuntimeSignal ? 'media-contract-or-adapter' : 'shared-contract-or-helper',
      needsReview: classification.hasPreviewRuntimeSignal || routePattern.test(text),
    });
  }
  if (owner === 'dsh-control-panel' && classification.hasControlPanelInputSignal) {
    controlPanelInputPathReport.push({ file: rel, lines, inputSignal: true, mediaSignal: classification.hasMediaRuntimeSignal, wltSignal: classification.hasWltBoundarySignal });
  }
  if (owner === 'wlt-dsh-bridge' || classification.hasWltBoundarySignal) {
    wltDshBoundaryReport.push({ file: rel, owner, lines, dshMayMutateMoney: /\b(createLedger|mutateWallet|approvePayout|executeRefund|settlePartner|settleCaptain|balance\s*=)\b/.test(text) });
  }
  if (classification.hasMediaRuntimeSignal || /\bmedia-fixtures|dsh\/frontend\/data|legacy-preview\b/i.test(text)) {
    mediaRuntimeGateReport.push({ file: rel, owner, lines, fixtureReference: /\bmedia-fixtures|dsh\/frontend\/data|legacy-preview\b/i.test(text) });
  }
}

const sliceCoverageMatrix = [
  { capability: 'Shared Runtime Foundation', requiredOwners: ['dsh-shared', 'dsh-control-panel', 'dsh-domain', 'dsh-backend', 'wlt-domain', 'wlt-backend', 'wlt-dsh-bridge'], status: 'INVENTORIED' },
  { capability: 'Platform Vars', requiredOwners: ['dsh-control-panel', 'dsh-shared'], status: 'TARGETED_FOR_J008' },
  { capability: 'Operations Room', requiredOwners: ['dsh-control-panel', 'dsh-shared', 'dsh-domain', 'dsh-backend', 'wlt-domain', 'wlt-backend', 'wlt-dsh-bridge'], status: 'TARGETED_FOR_J009' },
  { capability: 'Surface Runtime Cleanup', requiredOwners: ['dsh-client-surface', 'dsh-partner-surface', 'dsh-captain-surface', 'dsh-field-surface'], status: 'TARGETED_AFTER_FOUNDATION' },
];

function writeJson(name, value) {
  fs.writeFileSync(path.join(outDir, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

writeJson('file-inventory.json', fileInventory);
writeJson('slice-coverage-matrix.json', sliceCoverageMatrix);
writeJson('import-reference-report.json', importReferenceReport);
writeJson('route-screen-navigation-report.json', routeScreenNavigationReport);
writeJson('preview-data-media-report.json', previewDataMediaReport);
writeJson('shared-ownership-report.json', sharedOwnershipReport);
writeJson('control-panel-input-path-report.json', controlPanelInputPathReport);
writeJson('wlt-dsh-boundary-report.json', wltDshBoundaryReport);
writeJson('media-runtime-gate-report.json', mediaRuntimeGateReport);

fs.writeFileSync(
  path.join(outDir, 'uncovered-files.md'),
  [
    '# Uncovered Files',
    '',
    uncoveredFiles.length === 0 ? 'No files were outside the configured owner roots.' : uncoveredFiles.map((file) => `- ${file}`).join('\n'),
    '',
  ].join('\n'),
  'utf8',
);

writeJson('inventory-summary.json', {
  generatedAt: new Date().toISOString(),
  root,
  scopeRoots,
  fileCount: fileInventory.length,
  importReferenceCount: importReferenceReport.length,
  routeScreenNavigationCount: routeScreenNavigationReport.length,
  previewDataMediaSignalCount: previewDataMediaReport.length,
  sharedOwnershipCount: sharedOwnershipReport.length,
  controlPanelInputPathCount: controlPanelInputPathReport.length,
  wltDshBoundaryCount: wltDshBoundaryReport.length,
  mediaRuntimeGateSignalCount: mediaRuntimeGateReport.length,
  uncoveredFileCount: uncoveredFiles.length,
});

console.log(`DSH/WLT full-stack inventory written to ${toPosix(path.relative(root, outDir))}`);

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), mode: 'CHECK', jsonOut: '', mdOut: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--root') args.root = argv[++i];
    else if (token === '--mode') args.mode = argv[++i];
    else if (token === '--json-out') args.jsonOut = argv[++i];
    else if (token === '--md-out') args.mdOut = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token.startsWith('--mode=')) args.mode = token.slice('--mode='.length);
    else if (token.startsWith('--json-out=')) args.jsonOut = token.slice('--json-out='.length);
    else if (token.startsWith('--md-out=')) args.mdOut = token.slice('--md-out='.length);
  }
  return args;
}

const args = parseArgs();
const root = args.root;
const scopeRoots = [
  'dsh/frontend/shared',
  'dsh/frontend/control-panel',
  'dsh/frontend/app-client',
  'dsh/frontend/app-partner',
  'dsh/frontend/app-captain',
  'dsh/frontend/app-field',
  'wlt/frontend/dsh',
];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const ignoredSegments = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.expo', 'coverage', 'generated', '__generated__']);

const forbiddenText = [
  { id: 'absolute_dsh_frontend_data_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*dsh[\\/]+frontend[\\/]+data[^'"]*['"]/im },
  { id: 'absolute_dsh_frontend_media_fixtures_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*dsh[\\/]+frontend[\\/]+media-fixtures[^'"]*['"]/im },
  { id: 'relative_data_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*(?:\.\.\/){1,4}data(?:\/|['"])/im },
  { id: 'relative_media_fixtures_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*(?:\.\.\/){1,4}media-fixtures(?:\/|['"])/im },
  { id: 'legacy_preview_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*legacy-preview/i },
  { id: 'preview_data_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*(?:preview-data|operational-statuses\.preview-data)/im },
  { id: 'runtime_require_data_or_media_fixture', regex: /\brequire\(['"][^'"]*(?:dsh\/frontend\/data|dsh\/frontend\/media-fixtures|(?:\.\.\/){1,4}(?:data|media-fixtures))[^'"]*['"]\)/i },
  { id: 'runtime_preview_identity_token', regex: /\b(?:proof\.delivery\.preview|cart-preview|DSH_CAPTAIN_FALLBACK_ID|PLACEHOLDER_URI)\b/i },
  { id: 'standalone_surface_split_wording', regex: /standalone surface|فول ستاك منفصل/i },
];

const forbiddenWltRuntimeNames = /\b(?:Preview|preview-data|FinancePreview|PaymentPreview|Demo|Mock|Sample|Fallback)\b/;

const forbiddenWltAppToControlPanel = [
  {
    id: 'wlt_app_imports_wlt_control_panel',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*wlt[\\/]+frontend[\\/]+dsh[\\/]+control-panel[^'"]*['"]/im,
    onlyIn: /^wlt\/frontend\/dsh\/(app-client|app-partner|app-captain|app-field)\//,
    remediation: 'WLT app-* must not import from WLT control-panel. Use WLT shared read-models/adapters instead.',
  },
];

const forbiddenDshSharedImportsSurfaces = [
  {
    id: 'shared_imports_surface',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*dsh[\\/]+frontend[\\/]+(?:app-client|app-partner|app-captain|app-field|control-panel)[^'"]*['"]/im,
    onlyIn: /^dsh\/frontend\/shared\//,
    remediation: 'dsh/frontend/shared must not import from any DSH surface (app-* or control-panel).',
  },
];

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function walk(absDir, files = []) {
  if (!fs.existsSync(absDir)) return files;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    if (ignoredSegments.has(entry.name)) continue;
    const abs = path.join(absDir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, files);
    } else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
      files.push(abs);
    }
  }
  return files;
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const findings = [];
const files = scopeRoots.flatMap((scopeRoot) => walk(path.join(root, scopeRoot)));

for (const abs of files) {
  const rel = toPosix(path.relative(root, abs));
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');

  for (const rule of forbiddenText) {
    const match = rule.regex.exec(text);
    if (match) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: rel,
        line: lineNumber(text, match.index),
        evidence: match[0].slice(0, 180),
        remediation: 'Convert runtime usage to DSH API, Media Runtime API, Control Panel input, MinIO/S3 metadata, or WLT read-model path.',
      });
    }
  }

  if (rel.startsWith('wlt/frontend/dsh/') && forbiddenWltRuntimeNames.test(path.basename(rel))) {
    findings.push({
      severity: 'FAIL',
      rule: 'wlt_dsh_preview_runtime_filename',
      file: rel,
      line: 1,
      evidence: path.basename(rel),
      remediation: 'Rename runtime files to Summary, Session, or ReadModel, or isolate non-runtime files under test/story/dev-only.',
    });
  }

  for (const rule of forbiddenWltAppToControlPanel) {
    if (!rule.onlyIn.test(rel)) continue;
    const match = rule.regex.exec(text);
    if (match) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: rel,
        line: lineNumber(text, match.index),
        evidence: match[0].slice(0, 180),
        remediation: rule.remediation,
      });
    }
  }

  for (const rule of forbiddenDshSharedImportsSurfaces) {
    if (!rule.onlyIn.test(rel)) continue;
    const match = rule.regex.exec(text);
    if (match) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: rel,
        line: lineNumber(text, match.index),
        evidence: match[0].slice(0, 180),
        remediation: rule.remediation,
      });
    }
  }
}

const output = {
  guardId: 'GUARD_DSH_ZERO_GAP_RUNTIME_BOUNDARIES',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  scopeRoots,
  filesScanned: files.length,
  findings,
  failCount: findings.filter((f) => f.severity === 'FAIL').length,
  warnCount: findings.filter((f) => f.severity === 'WARN').length,
  infoCount: findings.filter((f) => f.severity === 'INFO').length,
};

console.log(JSON.stringify(output, null, 2));

if (args.jsonOut) {
  fs.writeFileSync(args.jsonOut, JSON.stringify(output, null, 2), 'utf8');
}
if (args.mdOut) {
  const md = [
    '# GUARD_DSH_ZERO_GAP_RUNTIME_BOUNDARIES',
    '',
    `status: ${output.status}`,
    `findings: ${output.findings.length}`,
    '',
    '| Severity | Rule | File | Evidence |',
    '|---|---|---|---|',
    ...findings.map((f) => `| ${f.severity} | ${f.rule} | ${f.file} | ${f.evidence} |`),
  ].join('\n');
  fs.writeFileSync(args.mdOut, md, 'utf8');
}

if (findings.length > 0) process.exitCode = 1;

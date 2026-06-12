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
const surfaceFiles = [
  { file: 'dsh/frontend/app-client/DshClientSurface.tsx', maxLines: 509 },
  { file: 'dsh/frontend/app-partner/DshPartnerSurface.tsx', maxLines: 783 },
  { file: 'dsh/frontend/app-captain/DshCaptainSurface.tsx', maxLines: 2221 },
  { file: 'dsh/frontend/app-field/DshFieldSurface.tsx', maxLines: 535 },
];
const forbiddenPatterns = [
  { id: 'runtime_data_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*(?:\.\.\/){1,4}data(?:\/|['"])/im },
  { id: 'runtime_media_fixtures_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*(?:\.\.\/){1,4}media-fixtures(?:\/|['"])/im },
  { id: 'runtime_media_fixture_require', regex: /\brequire\(['"][^'"]*(?:media-fixtures|(?:\.\.\/){1,4}data)[^'"]*['"]\)/i },
  { id: 'storage_direct_access', regex: /\b(?:localStorage|AsyncStorage|sessionStorage|indexedDB)\b/ },
];

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const findings = [];

for (const item of surfaceFiles) {
  const relative = item.file;
  const abs = path.join(root, relative);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).length;

  if (lines > item.maxLines) {
    findings.push({
      severity: 'FAIL',
      rule: 'surface_host_grew_beyond_baseline',
      file: toPosix(relative),
      line: 1,
      evidence: `${lines} lines > baseline ${item.maxLines}`,
      remediation: 'Do not add more logic to Surface host. Extract the new responsibility into state, routes, adapters, parts, screens, or contracts.',
    });
  }

  for (const rule of forbiddenPatterns) {
    const match = rule.regex.exec(text);
    if (match) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: toPosix(relative),
        line: lineNumber(text, match.index),
        evidence: match[0].slice(0, 180),
        remediation: 'Move runtime logic out of Surface host; keep only provider/controller mounting, context passing, route binding, registry binding, and ready handlers.',
      });
    }
  }
}

const output = {
  guardId: 'GUARD_DSH_SURFACE_STRUCTURE',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  filesScanned: surfaceFiles.length,
  mode: 'RATCHET_BASELINE',
  baselinePolicy: 'Existing oversized Surface hosts are not closed by this guard. The guard blocks growth and direct runtime data/media/storage leaks until scoped extraction slices reduce the baselines.',
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
    '# GUARD_DSH_SURFACE_STRUCTURE',
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

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
const uiOnlyRoots = [
  'dsh/frontend/app-captain',
  'dsh/frontend/app-client',
  'dsh/frontend/app-field',
  'dsh/frontend/app-partner',
  'dsh/frontend/control-panel',
  'wlt/frontend/dsh/app-captain',
  'wlt/frontend/dsh/app-client',
  'wlt/frontend/dsh/app-field',
  'wlt/frontend/dsh/app-partner',
  'wlt/frontend/dsh/control-panel',
];

const forbiddenFolderNames = new Set([
  'adapters',
  'models',
  'selectors',
  'storage',
  'runtime',
  'data',
  'policies',
  'state-machines',
]);

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function getSubdirectories(absDir, folders = []) {
  if (!fs.existsSync(absDir)) return folders;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const abs = path.join(absDir, entry.name);
      folders.push(abs);
      getSubdirectories(abs, folders);
    }
  }
  return folders;
}

function stripComments(text) {
  return text.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '');
}

function hasForbiddenRuntimeSignals(text) {
  const clean = stripComments(text);
  const runtimeSignals = [
    /\bcreate[A-Za-z0-9]+(?:Http|Typed)?Client\b/,
    /\b(?:list|update|delete|submit|upload|complete|confirm|request|create)(?:[A-Z][A-Za-z0-9]*)\s*\(/,
    /\bfetch\s*\(/,
    /\b(?:localStorage|sessionStorage|AsyncStorage)\b/,
    /\b(?:StateMachine|Lifecycle|ActiveOrderPhase|StoreCourierStage)\b/,
    /\b(?:Adapter|Runtime|Policy|mapRuntime|Date\.now)\b/,
    /\b(?:payment|refund|settlement|payout|ledger|wallet|topUp|requestSettlement)\b/i,
  ];
  return runtimeSignals.some((regex) => regex.test(clean));
}

const findings = [];

for (const relativeRoot of uiOnlyRoots) {
  const absRoot = path.join(root, relativeRoot);
  if (!fs.existsSync(absRoot)) continue;

  const folders = getSubdirectories(absRoot);

  for (const folder of folders) {
    const folderName = path.basename(folder);
    const relFolder = toPosix(path.relative(root, folder));

    // 1. Direct forbidden folders check
    if (forbiddenFolderNames.has(folderName)) {
      findings.push({
        severity: 'FAIL',
        rule: 'ui_only_contains_forbidden_folder',
        file: relFolder,
        evidence: `Folder named "${folderName}"`,
        remediation: `Move "${folderName}" folder to shared directory (dsh/frontend/shared or wlt/frontend/dsh/shared).`,
      });
      continue;
    }

    // 2. Contracts folder check: except type-only
    if (folderName === 'contracts') {
      const files = fs.readdirSync(folder, { withFileTypes: true });
      for (const file of files) {
        if (file.isFile()) {
          const ext = path.extname(file.name);
          if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
            const isTypeOnly = file.name.endsWith('.types.ts') || file.name.endsWith('.contract.ts') || file.name.endsWith('.contracts.ts') || file.name.endsWith('-props.ts') || file.name === 'index.ts';
            if (!isTypeOnly) {
              findings.push({
                severity: 'FAIL',
                rule: 'ui_only_contracts_contains_implementation',
                file: toPosix(path.relative(root, path.join(folder, file.name))),
                evidence: `File inside contracts folder is not type-only`,
                remediation: `Move contract implementations to shared directory. Contracts in UI roots must be type-only index or .types.ts.`,
              });
            }
          }
        }
      }
    }

    // 3. Hooks folder check: except visual hooks
    if (folderName === 'hooks') {
      const files = fs.readdirSync(folder, { withFileTypes: true });
      for (const file of files) {
        if (file.isFile()) {
          const ext = path.extname(file.name);
          if (['.ts', '.tsx'].includes(ext)) {
            const filePath = path.join(folder, file.name);
            const content = fs.readFileSync(filePath, 'utf8');
            if (hasForbiddenRuntimeSignals(content)) {
              findings.push({
                severity: 'FAIL',
                rule: 'ui_only_hooks_contains_runtime_logic',
                file: toPosix(path.relative(root, filePath)),
                evidence: `Hook file contains runtime/API/state logic`,
                remediation: `Move runtime hook to shared view-models, state-machines, or adapters. Only visual/display hooks are allowed in UI roots.`,
              });
            }
          }
        }
      }
    }
  }
}

const output = {
  guardId: 'GUARD_UI_ONLY_FILE_VOLUME',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  uiOnlyRoots,
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
    '# GUARD_UI_ONLY_FILE_VOLUME',
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

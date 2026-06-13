#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
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

const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const compatibilityExportOnly = /^\s*(?:export\s+\*\s+from\s+['"][^'"]*shared[^'"]*['"];?\s*|export\s+\{[\s\S]*?\}\s+from\s+['"][^'"]*shared[^'"]*['"];?\s*)+$/m;

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function walk(absDir, files = []) {
  if (!fs.existsSync(absDir)) return files;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const abs = path.join(absDir, entry.name);
    if (entry.isDirectory()) walk(abs, files);
    else if (entry.isFile() && extensions.has(path.extname(entry.name))) files.push(abs);
  }
  return files;
}

const rules = [
  {
    id: 'ui_only_creates_runtime_client',
    regex: /\bcreate[A-Za-z0-9]+(?:Http|Typed)?Client\b/g,
    remediation: 'Move runtime client construction to dsh/frontend/shared or wlt/frontend/dsh/shared and expose a UI binding hook/model.',
  },
  {
    id: 'ui_only_resolves_runtime_base_url',
    regex: /\bresolve[A-Za-z0-9]+BaseUrl\b/g,
    remediation: 'Resolve runtime base URLs in shared runtime/config code, not UI-only roots.',
  },
  {
    id: 'ui_only_direct_storage',
    regex: /\b(?:localStorage|sessionStorage|AsyncStorage)\b/g,
    remediation: 'Move persistence/storage access to shared runtime storage adapters.',
  },
  {
    id: 'ui_only_direct_env_read',
    regex: /\bprocess\.env\b|\benv\?\.(?:EXPO_PUBLIC_|NEXT_PUBLIC_)/g,
    remediation: 'Use PlatformVarsProvider/PlatformVarsRegistry from shared instead of direct env reads.',
  },
  {
    id: 'ui_only_direct_network_fetch',
    regex: /\bfetch\s*\(/g,
    remediation: 'Move direct network calls to shared clients/adapters.',
  },
];

const files = uiOnlyRoots.flatMap((relativeRoot) => walk(path.join(root, relativeRoot)));
const findings = [];

for (const abs of files) {
  const rel = toPosix(path.relative(root, abs));
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const stripped = text.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '').trim();
  const isSharedCompatibilityExport = compatibilityExportOnly.test(stripped);

  if (isSharedCompatibilityExport) continue;

  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    let match;
    while ((match = rule.regex.exec(text)) !== null) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: rel,
        line: lineNumber(text, match.index),
        evidence: match[0].slice(0, 160),
        remediation: rule.remediation,
      });
    }
  }
}

const output = {
  guardId: 'GUARD_UI_ONLY_ROOTS_OWNERSHIP',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  uiOnlyRoots,
  sharedOwners: [
    'dsh/frontend/shared',
    'wlt/frontend/dsh/shared',
  ],
  filesScanned: files.length,
  findings,
  failCount: findings.length,
};

console.log(JSON.stringify(output, null, 2));
if (findings.length > 0) process.exitCode = 1;

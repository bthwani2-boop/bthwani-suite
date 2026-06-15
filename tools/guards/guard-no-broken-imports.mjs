#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, lineNumber } from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const scopeRoots = [
  'dsh/frontend/app-client',
  'dsh/frontend/app-partner',
  'dsh/frontend/app-captain',
  'dsh/frontend/app-field',
  'dsh/frontend/control-panel',
  'dsh/frontend/shared',
  'wlt/frontend/dsh',
];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const ignoredSegments = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.expo', 'coverage']);

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function walk(absDir, files = []) {
  if (!fs.existsSync(absDir)) return files;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    if (ignoredSegments.has(entry.name)) continue;
    const abs = path.join(absDir, entry.name);
    if (entry.isDirectory()) walk(abs, files);
    else if (entry.isFile() && extensions.has(path.extname(entry.name))) files.push(abs);
  }
  return files;
}

const rules = [
  {
    id: 'missing_from_before_module_specifier',
    regex: /^\s*(?:import|export)\s+(?:type\s+)?(?:\{[^'"\r\n]+?\}|[A-Za-z0-9_$*\s{},]+)\s+[A-Za-z0-9_./@-]+';/gm,
  },
  {
    id: 'unquoted_from_module_specifier',
    regex: /^\s*(?:import|export)\s+.+?\s+from\s+[A-Za-z0-9_./@-]+';/gm,
  },
  {
    id: 'malformed_adapters_import',
    regex: /^\s*(?:import|export)\s+.+?\}\s+adapters\//gm,
  },
  {
    id: 'malformed_api_import',
    regex: /^\s*(?:import|export)\s+.+?\}\s+api\//gm,
  },
  {
    id: 'malformed_state_machine_import',
    regex: /^\s*(?:import|export)\s+.+?\}\s+state-machines\//gm,
  },
];

const report = createReport('GUARD_NO_BROKEN_IMPORTS', [
  'governance/03_REPO_BOUNDARIES.md',
  'governance/14_GUARDS_CATALOG.md'
]);

const files = scopeRoots.flatMap((scopeRoot) => walk(path.join(root, scopeRoot)));

for (const abs of files) {
  const relFile = toPosix(path.relative(root, abs));
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    let match;
    while ((match = rule.regex.exec(text)) !== null) {
      report.fail(
        relFile,
        'Use a valid ES import/export declaration with from and a quoted module specifier.',
        `${rule.id} (line ${lineNumber(text, match.index)}: ${match[0].trim().slice(0, 80)})`
      );
    }
  }
}

finalize(report, args);

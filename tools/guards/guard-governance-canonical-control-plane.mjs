#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = process.cwd();
const requiredFiles = [
  'governance/00_README.md',
  'governance/01_GOVERNANCE_INDEX.md',
  'governance/11_EVIDENCE_AND_TRACEABILITY.md',
  'governance/14_GUARDS_CATALOG.md',
  'governance/15_AGENT_AND_AI_EXECUTION.md',
  'governance/99_LEGACY_MERGE_LEDGER.md'
];

const errors = [];
const retiredParts = ['docs', 'governance'];
const retiredLiteral = retiredParts.join('/');

for (const rel of requiredFiles) {
  const full = path.join(repoRoot, rel);
  if (!fs.existsSync(full)) {
    errors.push(`MISSING_REQUIRED_GOVERNANCE_FILE: ${rel}`);
    continue;
  }
  const text = fs.readFileSync(full, 'utf8');
  if (!/^(?:\*\*)?Status:(?:\*\*)?/m.test(text)) errors.push(`MISSING_STATUS: ${rel}`);
  if (!/^(?:\*\*)?Owner:(?:\*\*)?/m.test(text)) errors.push(`MISSING_OWNER: ${rel}`);
}

if (fs.existsSync(path.join(repoRoot, retiredParts[0], retiredParts[1]))) {
  errors.push(`RETIRED_ROOT_EXISTS: ${retiredLiteral}`);
}

const tracked = execFileSync('git', ['ls-files'], { cwd: repoRoot, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map(p => p.replaceAll('\\', '/'));

const activeRefs = [];
for (const rel of tracked) {
  if (rel.startsWith('tools/registry/runs/')) continue;
  if (rel.startsWith('kdt/')) continue;
  if (rel.startsWith('governance/')) continue;
  if (rel.startsWith('tools/guards/')) continue;
  const full = path.join(repoRoot, rel);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) continue;
  const ext = path.extname(rel).toLowerCase();
  if (!['.md','.mdc','.txt','.json','.jsonc','.yml','.yaml','.ts','.tsx','.js','.jsx','.mjs','.cjs','.ps1','.psm1','.csv','.toml','.config'].includes(ext)) continue;
  const stat = fs.statSync(full);
  if (stat.size > 2 * 1024 * 1024) continue;
  const text = fs.readFileSync(full, 'utf8');
  if (text.includes(retiredLiteral) || text.includes(retiredParts.join('\\'))) {
    activeRefs.push(rel);
  }
}

if (activeRefs.length) {
  errors.push(`ACTIVE_RETIRED_GOVERNANCE_REFERENCES: ${activeRefs.join(', ')}`);
}

if (errors.length) {
  console.error('GUARD governance canonical control plane FAILED');
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log('GUARD governance canonical control plane PASS');
console.log(`RequiredFiles: ${requiredFiles.length}`);
console.log('ActiveRetiredGovernanceRefs: 0');

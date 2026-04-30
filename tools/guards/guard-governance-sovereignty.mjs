import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, exists, walkFiles, readText, rel } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('GOV-SOVEREIGNTY', 'governance/00_GOVERNANCE_INDEX.md');
const root = args.root;

const required = [
  'governance/README.md',
  'governance/00_GOVERNANCE_INDEX.md',
  'tools/guards/guard-manifest.json'
];

for (const file of required) {
  if (!exists(root, file)) report.fail(file, 'Required governance/guard file is missing.');
}

if (exists(root, 'docs/governance')) {
  report.warn('docs/governance', 'docs/governance exists. It must remain retired/reference only and must not override governance/.');
}

const manifestPath = path.join(root, 'tools/guards/guard-manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(readText(manifestPath));
    if (!String(manifest.policy_source_rule ?? '').includes('governance')) {
      report.fail('tools/guards/guard-manifest.json', 'Manifest must declare that governance is the policy source.');
    }
    for (const guard of manifest.guards ?? []) {
      if (!guard.policySource || !String(guard.policySource).startsWith('governance/')) {
        report.fail('tools/guards/guard-manifest.json', `Guard ${guard.id ?? guard.file} lacks a governance policySource.`);
      }
    }
  } catch (error) {
    report.fail('tools/guards/guard-manifest.json', `Invalid JSON: ${error.message}`);
  }
}

const files = walkFiles(root, { startDirs: ['apps', 'packages', 'services', 'tools/scripts', '.github', 'governance'] });
for (const file of files) {
  const relative = rel(root, file);
  if (relative.startsWith('tools/registry/runs/')) continue;
  if (['governance/README.md', 'governance/00_GOVERNANCE_INDEX.md', 'governance/GUARD_IMPLEMENTATION_MAP.md'].includes(relative)) continue;
  const text = readText(file);
  if (/docs[\\/]governance|docs\/governance/.test(text) && !relative.startsWith('governance/legacy-extracted/')) {
    report.warn(relative, 'Reference to retired docs/governance found. Update to governance/ if this is an active reference.');
  }
  if (relative.startsWith('tools/guards/') && relative.endsWith('.md') && relative !== 'tools/guards/README.md') {
    const headings = (text.match(/^#{1,3}\s+/gm) ?? []).length;
    if (headings > 8 || text.length > 6000) {
      report.warn(relative, 'Long markdown under tools/guards may contain policy text. Keep policy in governance/ and execution notes only here.');
    }
  }
}

finalize(report, args);

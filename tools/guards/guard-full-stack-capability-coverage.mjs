#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), strict: false, jsonOut: '', mdOut: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--strict') args.strict = true;
    else if (token === '--root') args.root = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token === '--json-out') args.jsonOut = argv[++i];
    else if (token.startsWith('--json-out=')) args.jsonOut = token.slice('--json-out='.length);
    else if (token === '--md-out') args.mdOut = argv[++i];
    else if (token.startsWith('--md-out=')) args.mdOut = token.slice('--md-out='.length);
  }
  return args;
}

const args = parseArgs();
const root = path.resolve(args.root);

function read(relative) {
  const abs = path.join(root, relative);
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8').replace(/^﻿/, '') : '';
}

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

const findings = [];

function add(severity, rule, file, evidence, remediation) {
  findings.push({ severity, rule, file: toPosix(file), evidence, remediation });
}

const REQUIRED_CAPABILITIES = [
  'foundation',
  'actor-auth-permissions',
  'catalog-store',
  'media-runtime',
  'cart-checkout',
  'order-lifecycle',
  'captain-delivery',
  'partner-operations',
  'field-readiness',
  'support-escalation',
  'wlt-finance-read-model',
  'control-panel-governance',
  'notifications',
];

const REQUIRED_SURFACES_PER_CAPABILITY = {
  'foundation': ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
  'actor-auth-permissions': ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
  'catalog-store': ['app-client', 'app-partner', 'app-field', 'control-panel'],
  'media-runtime': ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
  'cart-checkout': ['app-client', 'control-panel'],
  'order-lifecycle': ['app-client', 'app-partner', 'app-captain', 'control-panel'],
  'captain-delivery': ['app-captain', 'control-panel'],
  'partner-operations': ['app-partner', 'control-panel'],
  'field-readiness': ['app-field', 'control-panel'],
  'support-escalation': ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
  'wlt-finance-read-model': ['control-panel'],
  'control-panel-governance': ['control-panel'],
  'notifications': ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'],
};

const REQUIRED_CONTROL_PANEL_SECTIONS = [
  'dashboard', 'operations', 'support', 'finance', 'catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr',
];

const capabilityMap = read('dsh/frontend/shared/full-stack/bthwani-full-stack-capability.map.ts');
const capabilitiesFile = read('dsh/frontend/shared/full-stack/bthwani-full-stack-capabilities.ts');
const governanceMap = read('dsh/frontend/shared/control-panel/dsh-governance.map.ts');
const coverageTypesFile = read('dsh/frontend/shared/full-stack/bthwani-full-stack-coverage.types.ts');


if (!capabilityMap) {
  add('FAIL', 'capability_map_missing', 'dsh/frontend/shared/full-stack/bthwani-full-stack-capability.map.ts', 'file missing', 'Create the capability map with all 13 capabilities.');
}

if (!coverageTypesFile) {
  add('FAIL', 'coverage_types_missing', 'dsh/frontend/shared/full-stack/bthwani-full-stack-coverage.types.ts', 'file missing', 'Create the BthwaniFullStackCapabilityCoverageRow and BthwaniFullStackCoverageMatrix types.');
}

for (const capId of REQUIRED_CAPABILITIES) {
  if (!capabilitiesFile.includes(`'${capId}'`)) {
    add('FAIL', 'capability_id_missing_from_capabilities_file', 'dsh/frontend/shared/full-stack/bthwani-full-stack-capabilities.ts', capId, 'Add this capability ID to BTHWANI_FULL_STACK_CAPABILITIES array.');
  }

  if (capabilityMap && !capabilityMap.includes(`id: '${capId}'`)) {
    add('FAIL', 'capability_binding_missing_from_map', 'dsh/frontend/shared/full-stack/bthwani-full-stack-capability.map.ts', capId, 'Add a complete capability binding entry for this capability in BTHWANI_FULL_STACK_CAPABILITY_MAP.');
  }
}

for (const section of REQUIRED_CONTROL_PANEL_SECTIONS) {
  if (governanceMap && !new RegExp(`['"]${section}['"]`).test(governanceMap)) {
    add('FAIL', 'control_panel_section_missing_from_governance_map', 'dsh/frontend/shared/control-panel/dsh-governance.map.ts', section, 'Keep all 10 control-panel sections in the governance map.');
  }
}

if (governanceMap) {
  const forbiddenInMap = /\bpreview-only\b|financeReference:\s*['"]wlt-finance['"]/g;
  let m;
  while ((m = forbiddenInMap.exec(governanceMap))) {
    add('FAIL', 'governance_map_preview_or_legacy_reference', 'dsh/frontend/shared/control-panel/dsh-governance.map.ts', m[0], 'Replace preview-only or wlt-finance with wlt-read-model, wlt-reference-required, or blocked-by-policy.');
  }
}

const requiredFullStackFields = ['fullStackCapabilities', 'requiredSurfaces', 'inputOwnership', 'runtimeTruth'];
for (const field of requiredFullStackFields) {
  if (governanceMap && !governanceMap.includes(field)) {
    add('FAIL', 'governance_map_full_stack_field_missing', 'dsh/frontend/shared/control-panel/dsh-governance.map.ts', field, 'All governance section entries must include full-stack fields.');
  }
}

function writeFile(filePath, content) {
  if (!filePath) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildMarkdown(output) {
  const lines = [];
  lines.push(`# ${output.guardId}`);
  lines.push('');
  lines.push(`status: ${output.status}`);
  lines.push(`mode: ${output.mode}`);
  lines.push(`capabilitiesChecked: ${output.capabilitiesChecked}`);
  lines.push(`sectionsChecked: ${output.sectionsChecked}`);
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  if (output.findings.length === 0) {
    lines.push('No findings.');
  } else {
    lines.push('| Severity | Rule | File | Evidence | Remediation |');
    lines.push('|---|---|---|---|---|');
    for (const finding of output.findings) {
      lines.push(`| ${finding.severity} | ${finding.rule} | ${finding.file} | ${finding.evidence} | ${finding.remediation} |`);
    }
  }
  return lines.join('\n');
}

const output = {
  guardId: 'GUARD_FULL_STACK_CAPABILITY_COVERAGE',
  status: findings.some((f) => f.severity === 'FAIL') ? 'FAIL' : 'PASS',
  mode: args.strict ? 'STRICT' : 'CHECK',
  capabilitiesChecked: REQUIRED_CAPABILITIES.length,
  sectionsChecked: REQUIRED_CONTROL_PANEL_SECTIONS.length,
  findings,
  failCount: findings.filter((f) => f.severity === 'FAIL').length,
  warnCount: findings.filter((f) => f.severity === 'WARN').length,
};

console.log(`GUARD_FULL_STACK_CAPABILITY_COVERAGE: ${output.status} (fail=${output.failCount}, warn=${output.warnCount})`);
writeFile(args.jsonOut, JSON.stringify(output, null, 2));
writeFile(args.mdOut, buildMarkdown(output));

if (output.failCount > 0) process.exitCode = 1;

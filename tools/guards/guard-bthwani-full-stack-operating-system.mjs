#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), strict: false, notClosureEvidence: '', jsonOut: '', mdOut: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--strict') args.strict = true;
    else if (token === '--root') args.root = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token === '--json-out') args.jsonOut = argv[++i];
    else if (token.startsWith('--json-out=')) args.jsonOut = token.slice('--json-out='.length);
    else if (token === '--md-out') args.mdOut = argv[++i];
    else if (token.startsWith('--md-out=')) args.mdOut = token.slice('--md-out='.length);
    else if (token.startsWith('--not-closure-evidence=')) args.notClosureEvidence = token.slice('--not-closure-evidence='.length);
  }
  return args;
}

const args = parseArgs();
const root = path.resolve(args.root);

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function read(relative) {
  const abs = path.join(root, relative);
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '') : '';
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

if (args.notClosureEvidence) {
  const output = {
    guardId: 'GUARD_BTHWANI_FULL_STACK_OPERATING_SYSTEM',
    status: 'NOT_CLOSURE_EVIDENCE',
    scope: args.notClosureEvidence,
    findings: [],
    message: `${args.notClosureEvidence} is intentionally not accepted as full-stack closure evidence. Use runtime/visual proof selected for the capability instead.`,
  };
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

const findings = [];

function add(severity, rule, file, evidence, remediation, text = '', index = -1) {
  findings.push({
    severity,
    rule,
    file: toPosix(file),
    line: index >= 0 && text ? lineNumber(text, index) : null,
    evidence,
    remediation,
  });
}

function requireFile(relative) {
  const abs = path.join(root, relative);
  if (!fs.existsSync(abs)) {
    add('FAIL', 'required_full_stack_file_missing', relative, relative, 'Create the required full-stack governance/guard/shared file.');
    return '';
  }
  return read(relative);
}

const command = requireFile('dsh/docs/JOURNIES/command');
const commandAdditional = requireFile('dsh/docs/JOURNIES/command_additional');
const tasks = requireFile('dsh/docs/JOURNIES/tasks');
const operatingModel = requireFile('governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md');
const goldenSlice = requireFile('governance/22_DSH_GOLDEN_SLICE.md');
const serviceClosure = requireFile('governance/10_SERVICE_CLOSURE.md');
const governanceMap = requireFile('dsh/frontend/shared/dsh-governance.map.ts');
const capabilities = requireFile('dsh/frontend/shared/full-stack/bthwani-full-stack-capabilities.ts');
const capabilityMap = requireFile('dsh/frontend/shared/full-stack/bthwani-full-stack-capability.map.ts');
const packageJson = requireFile('package.json');
const depcruiseConfig = requireFile('tools/guards/design/configs/dependency-cruiser.live-boundaries.cjs');
const host = requireFile('dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx');

const requiredDocs = [
  ['command_full_stack_definition', command, 'dsh/docs/JOURNIES/command', /فول ستاك بثواني[\s\S]+DSH Backend[\s\S]+WLT finance bridge/],
  ['command_additional_capability_order', commandAdditional, 'dsh/docs/JOURNIES/command_additional', /Full-Stack Foundation[\s\S]+Final Full-Stack Regression/],
  ['tasks_capability_backlog', tasks, 'dsh/docs/JOURNIES/tasks', /capability_id[\s\S]+control_panel_section[\s\S]+closure_status/],
  ['operating_model_definition', operatingModel, 'governance/25_BTHWANI_FULL_STACK_OPERATING_MODEL.md', /Capability Closure Rule[\s\S]+WLT Boundary[\s\S]+Media Runtime Rule/],
  ['golden_slice_capability_matrix', goldenSlice, 'governance/22_DSH_GOLDEN_SLICE.md', /Full-Stack Capability Matrix[\s\S]+capability \| backend \| openapi/],
  ['service_closure_final_vocab', serviceClosure, 'governance/10_SERVICE_CLOSURE.md', /CLOSED_WITH_EVIDENCE[\s\S]+HARD_BLOCKED_EXTERNAL_ONLY/],
];

for (const [rule, text, file, regex] of requiredDocs) {
  if (!regex.test(text)) {
    add('FAIL', rule, file, 'required full-stack wording missing', 'Add the required BThwani full-stack closure contract.', text, 0);
  }
}

const requiredSections = ['dashboard', 'operations', 'support', 'finance', 'catalogs', 'partners', 'marketing', 'platform', 'administration', 'hr'];
for (const section of requiredSections) {
  if (!new RegExp(`['"]${section}['"]`).test(governanceMap)) {
    add('FAIL', 'governance_section_missing', 'dsh/frontend/shared/dsh-governance.map.ts', section, 'Keep current control-panel sections in the shared governance map.');
  }
  if (!new RegExp(`section === ['"]${section}['"]`).test(host) && section !== 'operations') {
    add('FAIL', 'host_section_missing', 'dsh/frontend/control-panel/DshControlPanelSurfaceHost.tsx', section, 'Host must route every current control-panel section.');
  }
}

for (const token of ['fullStackCapabilities', 'requiredSurfaces', 'inputOwnership', 'runtimeTruth']) {
  if (!governanceMap.includes(token)) {
    add('FAIL', 'governance_full_stack_field_missing', 'dsh/frontend/shared/dsh-governance.map.ts', token, 'Add full-stack governance fields to every section entry.');
  }
}

const forbiddenGovernance = /\bpreview-only\b|financeReference:\s*['"]wlt-finance['"]/g;
let match;
while ((match = forbiddenGovernance.exec(governanceMap))) {
  add('FAIL', 'governance_preview_or_legacy_finance_reference', 'dsh/frontend/shared/dsh-governance.map.ts', match[0], 'Use wlt-read-model, wlt-reference-required, or blocked-by-policy.', governanceMap, match.index);
}

const requiredCapabilities = [
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
for (const capability of requiredCapabilities) {
  if (!capabilities.includes(`'${capability}'`) || !capabilityMap.includes(`id: '${capability}'`)) {
    add('FAIL', 'capability_binding_missing', 'dsh/frontend/shared/full-stack', capability, 'Capability IDs and binding map must stay aligned.');
  }
  if (!tasks.includes(`capability_id: ${capability}`) && capability !== 'control-panel-governance') {
    add('FAIL', 'tasks_capability_missing', 'dsh/docs/JOURNIES/tasks', capability, 'Every full-stack capability must appear in the backlog with required task fields.');
  }
}

const depcruiseScript = /"guard:depcruise:live-boundaries"\s*:\s*"([^"]+)"/.exec(packageJson)?.[1] ?? '';
for (const segment of ['dsh/frontend/app-client', 'dsh/frontend/app-partner', 'dsh/frontend/app-captain', 'dsh/frontend/app-field', 'dsh/frontend/shared', 'dsh/frontend/control-panel', 'wlt/frontend/dsh', 'control-panel/runtime']) {
  if (!depcruiseScript.includes(segment)) {
    add('FAIL', 'depcruise_live_boundary_scope_missing', 'package.json', segment, 'guard:depcruise:live-boundaries must cover all DSH/WLT live surfaces.');
  }
}

for (const script of ['guard:test-coverage', 'guard:visual', 'guard:rtl-visual', 'guard:runtime-smoke']) {
  const scriptPattern = new RegExp(`"${script}"\\s*:\\s*"([^"]+)"`);
  const value = scriptPattern.exec(packageJson)?.[1] ?? '';
  if (!value.includes('--not-closure-evidence=')) {
    add('FAIL', 'report_only_script_can_be_misread_as_closure_evidence', 'package.json', script, 'Route report-only scripts through the full-stack not-closure-evidence guard or replace them with real guards.');
  }
}

for (const [rule, regex] of [
  ['shared_must_not_import_surfaces_rule_missing', /shared-must-not-import-surfaces/],
  ['surfaces_must_not_import_each_other_rule_missing', /surfaces-must-not-import-each-other/],
  ['no_runtime_data_media_fixtures_rule_missing', /no-runtime-data-media-fixtures/],
  ['wlt_dsh_bridge_only_rule_missing', /wlt-dsh-bridge-only/],
]) {
  if (!regex.test(depcruiseConfig)) {
    add('FAIL', rule, 'tools/guards/design/configs/dependency-cruiser.live-boundaries.cjs', rule, 'Add the full-stack dependency boundary rule.');
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

const entryFile = path.basename(process.argv[1]);
let guardId = 'GUARD_BTHWANI_FULL_STACK_OPERATING_SYSTEM';
if (entryFile === 'guard-dsh-control-panel-sections.mjs') {
  guardId = 'GUARD_DSH_CONTROL_PANEL_SECTIONS';
} else if (entryFile === 'guard-dsh-shared-ownership.mjs') {
  guardId = 'GUARD_DSH_SHARED_OWNERSHIP';
}

const output = {
  guardId,
  status: findings.some((f) => f.severity === 'FAIL') ? 'FAIL' : 'PASS',
  mode: args.strict ? 'STRICT' : 'CHECK',
  findings,
  failCount: findings.filter((f) => f.severity === 'FAIL').length,
  warnCount: findings.filter((f) => f.severity === 'WARN').length,
};

console.log(`${guardId}: ${output.status} (fail=${output.failCount}, warn=${output.warnCount})`);
writeFile(args.jsonOut, JSON.stringify(output, null, 2));
writeFile(args.mdOut, buildMarkdown(output));

if (output.failCount > 0) process.exitCode = 1;

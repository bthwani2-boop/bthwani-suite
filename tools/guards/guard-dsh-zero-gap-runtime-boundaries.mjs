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
  // WLT demo runtime IDs — hardcoded IDs that replace real subject/actor identifiers
  { id: 'wlt_demo_captain_id', regex: /['"`]captain-demo['"`]|DEFAULT_CAPTAIN_ID\s*=\s*['"`]captain/i },
  { id: 'wlt_demo_field_id', regex: /['"`]field-demo['"`]|DEFAULT_FIELD_AGENT_ID\s*=\s*['"`]field/i },
  { id: 'wlt_demo_client_id_runtime', regex: /DEFAULT_CLIENT_ID\s*=\s*['"`]client-demo['"`]/i },
  // WLT app imports from WLT control-panel financeContracts (must use ../shared instead)
  { id: 'wlt_app_imports_finance_contracts', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*control-panel[\\/]+financeContracts['"]/im },
  // Arabic preview/local wording in runtime app surfaces (not control-panel informational labels)
  { id: 'arabic_preview_local_wording', regex: /['"`][^'"`]*(?:معاينة محلية|محاكاة محلية|تعديل معاينة|مسار المعاينة المحلية)[^'"`]*['"`]/u, onlyIn: /^(?:dsh\/frontend\/(?:app-|shared)|wlt\/frontend\/dsh\/app-)/ },
  { id: 'skip_preview_ids_comment', regex: /\/\/\s*skip preview IDs/i },
  // MockAdminUser export from shared root (renamed to DshAdminUser — catches regression)
  { id: 'mock_admin_user_in_shared', regex: /MockAdminUser/i },
  // Payment/session IDs must never use Date.now() or Math.random() — use crypto.randomUUID() via payment-session-ids.ts
  { id: 'date_now_as_payment_id', regex: /(?:checkout_intent_id|idempotency_key|confirmation_ref)\s*:\s*`[^`]*Date\.now\(\)/i, onlyIn: /^(?:wlt\/frontend|dsh\/frontend)/ },
  { id: 'math_random_as_payment_id', regex: /(?:checkout_intent_id|idempotency_key|confirmation_ref)\s*:\s*`[^`]*Math\.random\(\)/i, onlyIn: /^(?:wlt\/frontend|dsh\/frontend)/ },
  // WLT OpenAPI types must live at wlt/frontend/dsh/shared/contracts/openapi/ not wlt/frontend/contracts/
  { id: 'wlt_openapi_wrong_location', regex: /from\s+['"][^'"]*wlt[\\/]frontend[\\/](?:dsh[\\/])?contracts[\\/]wlt-dsh-openapi\.types['"]/im, onlyIn: /^wlt\/frontend/ },
];

const forbiddenWltRuntimeNames = /\b(?:Preview|preview-data|FinancePreview|PaymentPreview|Demo|Mock|Sample|Fallback)\b/;

const forbiddenWltAppToControlPanel = [
  {
    id: 'wlt_app_imports_wlt_control_panel',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*wlt[\\/]+frontend[\\/]+dsh[\\/]+control-panel[^'"]*['"]/im,
    onlyIn: /^wlt\/frontend\/dsh\/(app-client|app-partner|app-captain|app-field)\//,
    remediation: 'WLT app-* must not import from WLT control-panel. Use WLT shared read-models/adapters instead.',
  },
  {
    id: 'wlt_app_imports_finance_contracts',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*control-panel[\\/]+financeContracts['"]/im,
    onlyIn: /^wlt\/frontend\/dsh\/(app-client|app-partner|app-captain|app-field)\//,
    remediation: 'WLT app-* must not import from financeContracts. Use ../shared types instead.',
  },
];

const forbiddenDshSharedImportsSurfaces = [
  {
    id: 'shared_imports_surface',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*dsh[\\/]+frontend[\\/]+(?:app-client|app-partner|app-captain|app-field|control-panel)[^'"]*['"]/im,
    onlyIn: /^dsh\/frontend\/shared\//,
    remediation: 'dsh/frontend/shared must not import from any DSH surface (app-* or control-panel).',
  },
  {
    id: 'ui_kit_in_dsh_shared',
    regex: /^\s*(?:import|export)\s+.*from\s+['"]@bthwani\/ui-kit['"]/im,
    onlyIn: /^dsh\/frontend\/shared\/(?!platform\/)/,
    remediation: 'dsh/frontend/shared must not import @bthwani/ui-kit. Move design components to ui-kit package or app-* surfaces.',
  },
  {
    id: 'cross_surface_import_captain_from_other',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*dsh[\\/]+frontend[\\/]+app-(?:client|partner|field)[^'"]*['"]/im,
    onlyIn: /^dsh\/frontend\/app-captain\//,
    remediation: 'app-captain must not import from other DSH app surfaces. Use dsh/frontend/shared instead.',
  },
  {
    id: 'cross_surface_import_client_from_other',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*dsh[\\/]+frontend[\\/]+app-(?:captain|partner|field)[^'"]*['"]/im,
    onlyIn: /^dsh\/frontend\/app-client\//,
    remediation: 'app-client must not import from other DSH app surfaces. Use dsh/frontend/shared instead.',
  },
  {
    id: 'cross_surface_import_partner_from_other',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*dsh[\\/]+frontend[\\/]+app-(?:captain|client|field)[^'"]*['"]/im,
    onlyIn: /^dsh\/frontend\/app-partner\//,
    remediation: 'app-partner must not import from other DSH app surfaces. Use dsh/frontend/shared instead.',
  },
  {
    id: 'cross_surface_import_field_from_other',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*dsh[\\/]+frontend[\\/]+app-(?:captain|client|partner)[^'"]*['"]/im,
    onlyIn: /^dsh\/frontend\/app-field\//,
    remediation: 'app-field must not import from other DSH app surfaces. Use dsh/frontend/shared instead.',
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
    if (rule.onlyIn && !rule.onlyIn.test(rel)) continue;
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

  // Guard: dsh/frontend/shared must not contain JSX (exception: platform/ context providers)
  if (
    rel.startsWith('dsh/frontend/shared/') &&
    (rel.endsWith('.tsx') || rel.endsWith('.jsx')) &&
    !rel.startsWith('dsh/frontend/shared/platform/')
  ) {
    findings.push({
      severity: 'FAIL',
      rule: 'jsx_in_dsh_shared',
      file: rel,
      line: 1,
      evidence: path.basename(rel),
      remediation: 'Move JSX components to @bthwani/ui-kit (reusable) or dsh/frontend/app-* (surface-specific). dsh/frontend/shared must be JSX-free.',
    });
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

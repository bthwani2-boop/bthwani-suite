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
const routeRendererFiles = [
  { file: 'dsh/frontend/app-client/DshClientRouteRenderer.tsx' },
];
const runtimeScreenFiles = [
  { file: 'dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx' },
];
const forbiddenPatterns = [
  { id: 'runtime_data_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*(?:\.\.\/){1,4}data(?:\/|['"])/im },
  { id: 'runtime_media_fixtures_import', regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*(?:\.\.\/){1,4}media-fixtures(?:\/|['"])/im },
  { id: 'runtime_media_fixture_require', regex: /\brequire\(['"][^'"]*(?:media-fixtures|(?:\.\.\/){1,4}data)[^'"]*['"]\)/i },
  { id: 'storage_direct_access', regex: /\b(?:localStorage|AsyncStorage|sessionStorage|indexedDB)\b/ },
  { id: 'captain_pod_preview_runtime_truth', regex: /\b(?:CAPTAIN_POD_PLACEHOLDER_URI|CAPTAIN_POD_MEDIA_KEY)\b|proof\.delivery\.preview|data:image\/png;base64/i },
  { id: 'captain_fallback_identity', regex: /\bDSH_CAPTAIN_FALLBACK_ID\b|CAP-0041|captain_id:\s*captainId\b|captainId\s*\?\?\s*['"]unknown['"]/ },
  { id: 'field_local_store_runtime_truth', regex: /\b(?:readFieldStoresLocal|writeFieldStoresLocal|FIELD_VISIT_EVIDENCE_ITEMS)\b/ },
  { id: 'partner_hardcoded_runtime_profile', regex: /جرين بول|store-1001|managerLabel:\s*['"]خالد['"]|locationLabel=\{`الرياض/ },
];
const forbiddenRouteRendererPatterns = [
  { id: 'route_renderer_cart_total_calculation', regex: /\b(?:parseCartItemPrice|cartSubtotal|deliveryFeeNum|cartTotal)\b/ },
  { id: 'route_renderer_payment_method_building', regex: /\bbuildPaymentMethodsList\b/ },
  { id: 'route_renderer_preview_identity', regex: /\bcart-preview\b|proof\.delivery\.preview/i },
  { id: 'route_renderer_hardcoded_address', regex: /مسقط، الخوير|جوار الجبل الجديد|العليا، طريق الملك فهد/ },
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

for (const item of runtimeScreenFiles) {
  const relative = item.file;
  const abs = path.join(root, relative);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');

  const screenRules = [
    { id: 'field_visit_demo_evidence_default', regex: /\bdemoEvidenceItems\b|front-signage-photo|owner-availability-note/ },
  ];

  for (const rule of screenRules) {
    const match = rule.regex.exec(text);
    if (match) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: toPosix(relative),
        line: lineNumber(text, match.index),
        evidence: match[0].slice(0, 180),
        remediation: 'Do not default runtime field visits to demo evidence. Pass evidence only from runtime media/read-model adapters.',
      });
    }
  }
}

for (const item of routeRendererFiles) {
  const relative = item.file;
  const abs = path.join(root, relative);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');

  for (const rule of forbiddenRouteRendererPatterns) {
    const match = rule.regex.exec(text);
    if (match) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: toPosix(relative),
        line: lineNumber(text, match.index),
        evidence: match[0].slice(0, 180),
        remediation: 'Keep route renderers as route-to-screen mapping only. Move pricing, payment, address, and identity logic into controllers or presenters.',
      });
    }
  }
}

const output = {
  guardId: 'GUARD_DSH_SURFACE_STRUCTURE',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  filesScanned: surfaceFiles.length + routeRendererFiles.length + runtimeScreenFiles.length,
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

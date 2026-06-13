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
  { file: 'dsh/frontend/app-client/DshClientSurface.tsx', maxLines: 360, maxState: 8, maxEffect: 2 },
  { file: 'dsh/frontend/app-partner/DshPartnerSurface.tsx', maxLines: 520, maxState: 8, maxEffect: 2 },
  { file: 'dsh/frontend/app-captain/DshCaptainSurface.tsx', maxLines: 950, maxState: 8, maxEffect: 2 },
  { file: 'dsh/frontend/app-field/DshFieldSurface.tsx', maxLines: 340, maxState: 8, maxEffect: 2 },
];
const routeRendererFiles = [
  { file: 'dsh/frontend/app-client/DshClientRouteRenderer.tsx', maxProps: 25 },
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
  { id: 'surface_api_side_effect', regex: /\b(?:fetch\s*\(|create[A-Za-z0-9]+(?:Http|Typed)?Client\b|list[A-Z][A-Za-z0-9]*\s*\(|update[A-Z][A-Za-z0-9]*\s*\(|delete[A-Z][A-Za-z0-9]*\s*\(|submit[A-Z][A-Za-z0-9]*\s*\(|upload[A-Z][A-Za-z0-9]*\s*\()/ },
  { id: 'surface_state_machine_or_lifecycle', regex: /\b(?:StateMachine|Lifecycle|lifecycle|statusMap|nextActionMap|ActiveOrderPhase|CaptainAvailabilityStatus|CaptainGpsStatus|CaptainAppMode|StoreCourierStage|DshCaptainPodState)\b/ },
  { id: 'surface_mapping_table', regex: /\b(?:Record<[^>]+>|statusMeta|availabilityStatusMeta|gpsStatusMeta|demandHeatZones|captainHeatZones|mapRuntime[A-Za-z0-9]*)\b/ },
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

function countMatches(text, regex) {
  return Array.from(text.matchAll(regex)).length;
}

function countJsxProps(text, tagName) {
  const matches = Array.from(text.matchAll(new RegExp(`<${tagName}\\b([\\s\\S]*?)(?:/>|>)`, 'gm')));
  return matches.reduce((max, match) => Math.max(max, countMatches(match[1], /^\s+[A-Za-z_$][A-Za-z0-9_$]*=/gm)), 0);
}

const findings = [];

// Strip import/export-from lines so that shared-path imports of type names
// do not trigger the state-machine or mapping-table rules.
// Importing from shared is allowed; defining or using locally is not.
function stripImportLines(text) {
  return text.replace(/^[ \t]*(?:import|export)\s[\s\S]*?from\s+['"][^'"]*['"][^\n]*/gm, '');
}

// Rules that should only scan code (not import declarations)
const importSensitiveRuleIds = new Set([
  'surface_state_machine_or_lifecycle',
  'surface_mapping_table',
]);

for (const item of surfaceFiles) {
  const relative = item.file;
  const abs = path.join(root, relative);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const textWithoutImports = stripImportLines(text);
  const lines = text.split(/\r?\n/).length;
  const stateCount = countMatches(text, /\b(?:React\.)?useState\s*</g) + countMatches(text, /\b(?:React\.)?useState\s*\(/g);
  const effectCount = countMatches(text, /\b(?:React\.)?useEffect\s*\(/g);

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
  if (stateCount > item.maxState) {
    findings.push({
      severity: 'FAIL',
      rule: 'surface_too_many_local_states',
      file: toPosix(relative),
      line: 1,
      evidence: `${stateCount} useState calls > max ${item.maxState}`,
      remediation: 'Move runtime/business state into shared controllers or view-model bindings; keep only visual modal/tab/sheet state in surfaces.',
    });
  }
  if (effectCount > item.maxEffect) {
    findings.push({
      severity: 'FAIL',
      rule: 'surface_too_many_runtime_effects',
      file: toPosix(relative),
      line: 1,
      evidence: `${effectCount} useEffect calls > max ${item.maxEffect}`,
      remediation: 'Move effects and runtime loading into shared binding hooks/controllers.',
    });
  }

  for (const rule of forbiddenPatterns) {
    const scanText = importSensitiveRuleIds.has(rule.id) ? textWithoutImports : text;
    const match = rule.regex.exec(scanText);
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
  const componentName = path.basename(relative, path.extname(relative));
  const propCount = countJsxProps(text, componentName);

  if (propCount > item.maxProps) {
    findings.push({
      severity: 'FAIL',
      rule: 'route_renderer_prop_fanout',
      file: toPosix(relative),
      line: 1,
      evidence: `${propCount} props > max ${item.maxProps}`,
      remediation: 'Pass grouped model/actions/context objects from shared bindings instead of flat prop fanout.',
    });
  }

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
  mode: 'STRICT_UI_ONLY_SURFACE_STRUCTURE',
  baselinePolicy: 'Surface hosts must be lightweight route/screen composition shells. Runtime, lifecycle, mapping, and business state belong in shared owners.',
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

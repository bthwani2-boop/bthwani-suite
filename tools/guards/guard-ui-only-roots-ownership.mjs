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
const configPath = path.join(root, 'tools/guards/guard-ui-only-roots-ownership.config.json');
let uiOnlyRoots = [
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
let allowlist = {};
let globalAllowRules = [];

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (Array.isArray(config.uiOnlyRoots)) {
      uiOnlyRoots = config.uiOnlyRoots;
    }
    if (config.allowlist && typeof config.allowlist === 'object') {
      allowlist = config.allowlist;
    }
    if (Array.isArray(config.globalAllowRules)) {
      globalAllowRules = config.globalAllowRules;
    }
  } catch (err) {
    console.warn('Error reading config file:', err);
  }
}

const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const compatibilityExportOnly = /^\s*(?:export\s+\*\s+from\s+['"][^'"]*shared[^'"]*['"];?\s*|export\s+\{[\s\S]*?\}\s+from\s+['"][^'"]*shared[^'"]*['"];?\s*)+$/m;
const generatedOrTypeOnlyFiles = [
  /(?:^|\/)(?:.*\.types|.*\.contract|.*\.contracts)\.ts$/,
  /(?:^|\/)index\.ts$/,
];

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

function stripComments(text) {
  return text.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '');
}

function isTypeOrIndexOnlyFile(rel, text) {
  if (!generatedOrTypeOnlyFiles.some((regex) => regex.test(rel))) return false;
  const executableSignals = /\b(?:React\.use|use[A-Z][A-Za-z0-9]*\s*\(|fetch\s*\(|create[A-Za-z0-9]+Client\b|Date\.now\s*\(|new\s+Date\s*\()/;
  return !executableSignals.test(text);
}

const rules = [
  {
    id: 'ui_only_creates_runtime_client',
    regex: /\bcreate[A-Za-z0-9]+(?:Http|Typed)?Client\b/g,
    remediation: 'Move runtime client construction to dsh/frontend/shared or wlt/frontend/dsh/shared and expose a UI binding hook/model.',
  },
  {
    id: 'ui_only_runtime_mutation_or_query_function',
    regex: /\b(?:list|update|delete|submit|upload|complete|confirm|request|create)(?:[A-Z][A-Za-z0-9]*)\s*\(/g,
    remediation: 'Move runtime query/mutation functions to shared clients, adapters, or state machines; UI-only roots may call binding props only.',
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
  {
    id: 'ui_only_state_machine_or_lifecycle',
    regex: /\b(?:StateMachine|Lifecycle|lifecycle|ActiveOrderPhase|CaptainAvailabilityStatus|CaptainGpsStatus|CaptainAppMode|StoreCourierStage|DshCaptainPodState|FieldDocumentPreviewStatus)\b/g,
    remediation: 'Move lifecycle/status/state-machine definitions to dsh/frontend/shared or wlt/frontend/dsh/shared.',
  },
  {
    id: 'ui_only_runtime_adapter_policy',
    regex: /\b(?:Adapter|Runtime|Policy|mapRuntime[A-Za-z0-9]*|runtime[A-Z][A-Za-z0-9]*)\b/g,
    remediation: 'Move runtime adapters and policy objects to shared ownership; keep UI-only roots as display bindings.',
  },
  {
    id: 'ui_only_status_or_next_action_map',
    regex: /\b(?:statusMap|nextActionMap|statusMeta|availabilityStatusMeta|gpsStatusMeta|demandHeatZones|captainHeatZones)\b/g,
    remediation: 'Move status maps, next-action maps, and operational metadata to shared view-models or policies.',
  },
  {
    id: 'ui_only_finance_runtime_logic',
    regex: /\b(?:payment|refund|settlement|payout|ledger|wallet|topUp|requestSettlement|formatWltYer|moneyPolicy|mutation)\b/gi,
    remediation: 'Move finance/payment/ledger logic to wlt/frontend/dsh/shared; UI-only roots may render finance bindings only.',
  },
  {
    id: 'ui_only_media_upload_logic',
    regex: /\b(?:media upload|createUploadIntent|completeUpload|uploadMedia|mediaKey|pod_media_key|document upload)\b/gi,
    remediation: 'Move media upload/document flows to shared media/runtime adapters.',
  },
  {
    id: 'ui_only_non_deterministic_runtime_id',
    regex: /\bDate\.now\s*\(/g,
    remediation: 'Move runtime ID/time generation to shared runtime adapters or inject from caller state.',
  },
  {
    id: 'ui_only_preview_demo_mock_fallback_runtime',
    regex: /\b(?:preview|demo|mock|sample|fallback|non-fatal|no-op)\b/gi,
    remediation: 'Do not hide runtime gaps in UI-only roots; move simulation/preview behavior behind explicit shared contracts.',
  },
  {
    id: 'ui_only_silent_or_noop_catch',
    regex: /catch\s*\([^)]*\)\s*\{\s*(?:\/\*[\s\S]*?\*\/\s*|\/\/[^\n]*\n\s*)?(?:return\s+undefined\s*;?\s*)?\}/g,
    remediation: 'Replace silent/no-op catch with shared error policy and visible binding state.',
  },
  {
    id: 'ui_only_forbidden_hooks',
    regex: /\buse(?:[A-Za-z0-9]*(?:Runtime|OrderExecution|MarketingState|RuntimeStores|PartnerOrders|CaptainOrder|FieldRuntimeActions))[A-Za-z0-9]*\b/g,
    remediation: 'Hook represents runtime state/business decisions; move to shared view-models or adapters.',
  },
  {
    id: 'ui_only_forbidden_functions',
    regex: /\b(?:createManualFieldStore|createManual[A-Za-z0-9]*)\b/g,
    remediation: 'Do not create manual runtime stores or drafts as live truth inside UI roots; move to shared adapters.',
  },
  {
    id: 'ui_only_arabic_fake_markers',
    regex: /\b(?:معاينة|محاكاة|محلي\s+فقط|لا\s+يطبق|تجريبي)\b/g,
    remediation: 'Do not use Arabic fake/preview runtime markers in UI roots; logic must be backed by real backend models.',
  },
];

const files = uiOnlyRoots.flatMap((relativeRoot) => walk(path.join(root, relativeRoot)));
const findings = [];

for (const abs of files) {
  const rel = toPosix(path.relative(root, abs));
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const stripped = stripComments(text).trim();
  const isSharedCompatibilityExport = compatibilityExportOnly.test(stripped);

  if (isSharedCompatibilityExport) continue;
  if (isTypeOrIndexOnlyFile(rel, stripped)) continue;

  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    let match;
    while ((match = rule.regex.exec(stripped)) !== null) {
      if (globalAllowRules.includes(rule.id)) {
        continue;
      }
      const allowedForFile = Object.entries(allowlist).find(([pattern]) => rel.includes(pattern));
      if (allowedForFile && allowedForFile[1].includes(rule.id)) {
        continue;
      }
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: rel,
        line: lineNumber(stripped, match.index),
        evidence: match[0].slice(0, 160),
        remediation: rule.remediation,
      });
    }
  }
}

const output = {
  guardId: 'GUARD_UI_ONLY_SURFACES',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  uiOnlyRoots,
  sharedOwners: [
    'dsh/frontend/shared',
    'wlt/frontend/dsh/shared',
  ],
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
    '# GUARD_UI_ONLY_SURFACES',
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

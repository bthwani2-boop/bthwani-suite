#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
const sessionId = `BTHWANI-UI-ONLY-RELOCATION-CLOSURE-${timestamp}`;
const outDir = path.join(root, 'tools/registry/runs', sessionId);
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
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
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

function decide(rel, text) {
  const clean = stripComments(text);
  const isWlt = rel.startsWith('wlt/frontend/dsh/');
  const isDshControl = rel.startsWith('dsh/frontend/control-panel/');
  const isStyle = rel.endsWith('.css');
  const isIndex = /\/index\.ts$/.test(rel);
  const isTypeOrContract = /\.(?:types|contract|contracts)\.ts$/.test(rel) || /\/models\/.+\.types\.ts$/.test(rel);
  const isScreenOrPart = /\/(?:screens|parts|sheets|components|sections|drawers)\/.+\.(?:tsx|jsx)$/.test(rel);
  const isSurfaceShell = /\/Dsh[A-Za-z]+Surface\.tsx$|Bridge\.tsx$|Host\.tsx$/.test(rel);
  const hasUi = /\.(?:tsx|jsx)$/.test(rel) || /\b(?:React\.|useState|useEffect|View|Text|Button|Card|Header|Badge|StyleSheet)\b/.test(clean);
  const hasWltFinance = /\b(?:payment|refund|settlement|payout|ledger|wallet|topUp|requestSettlement|formatWltYer|postingRules|subledger|makerChecker)\b/i.test(clean);
  const hasRuntime = /\b(?:fetch\s*\(|create[A-Za-z0-9]+(?:Http|Typed)?Client\b|list[A-Z][A-Za-z0-9]*\s*\(|update[A-Z][A-Za-z0-9]*\s*\(|delete[A-Z][A-Za-z0-9]*\s*\(|submit[A-Z][A-Za-z0-9]*\s*\(|upload[A-Z][A-Za-z0-9]*\s*\(|Runtime|Adapter|Policy|StateMachine|Lifecycle|mapRuntime|Date\.now\s*\(|preview|demo|mock|sample|fallback|non-fatal|no-op)\b/i.test(clean);
  const hasReusableUiSignal = hasUi && /\b(?:theme|tokens|colors|Button|Card|Header|Badge)\b/.test(clean);

  if (isIndex) {
    return { decision: 'KEEP_BINDING_ONLY', target: rel, reason: 'index/export surface; verify exported symbols stay UI binding only.' };
  }
  if (isStyle) {
    return { decision: 'KEEP_UI_ONLY', target: rel, reason: 'local surface styling is UI-owned unless later proven reusable across surfaces.' };
  }
  if (hasReusableUiSignal && !hasRuntime && !isScreenOrPart && !isSurfaceShell) {
    return { decision: 'MOVE_TO_UI_KIT', target: 'ui-kit', reason: 'contains reusable visual/design surface signals; requires human approval before moving.' };
  }
  if (isWlt && (hasWltFinance || hasRuntime) && !isScreenOrPart && !isSurfaceShell) {
    return { decision: 'MOVE_TO_WLT_DSH_SHARED', target: 'wlt/frontend/dsh/shared', reason: 'contains WLT finance/runtime/read-model ownership outside shared.' };
  }
  if (!isWlt && hasRuntime && !isScreenOrPart && !isSurfaceShell) {
    return { decision: 'MOVE_TO_DSH_SHARED', target: 'dsh/frontend/shared', reason: 'contains DSH runtime/business/adapter/policy ownership outside shared.' };
  }
  if ((isSurfaceShell || isDshControl) && (hasRuntime || hasWltFinance)) {
    return { decision: 'SPLIT_BY_CAPABILITY', target: isWlt ? 'wlt/frontend/dsh/shared' : 'dsh/frontend/shared', reason: 'mixed UI plus runtime/business logic; extract logic while preserving JSX layout.' };
  }
  if (isTypeOrContract && !hasRuntime) {
    return { decision: 'KEEP_BINDING_ONLY', target: rel, reason: 'type/contract file can remain only if it describes UI binding props, not runtime ownership.' };
  }
  if (isScreenOrPart || isSurfaceShell || hasUi) {
    return { decision: 'KEEP_UI_ONLY', target: rel, reason: 'presentational screen/part/shell; keep only after guard confirms no runtime ownership remains.' };
  }
  return { decision: 'MERGE_DUPLICATE', target: isWlt ? 'wlt/frontend/dsh/shared' : 'dsh/frontend/shared', reason: 'non-UI utility in UI-only root; merge into nearest shared owner or retire after reference proof.' };
}

const files = uiOnlyRoots.flatMap((relativeRoot) => walk(path.join(root, relativeRoot)));
const records = files.map((abs) => {
  const rel = toPosix(path.relative(root, abs));
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const decision = decide(rel, text);
  return {
    path: rel,
    ...decision,
    keep_wrapper: decision.decision === 'KEEP_BINDING_ONLY',
    reference_proof_required: ['MERGE_DUPLICATE', 'RETIRE_DEAD', 'MOVE_TO_DSH_SHARED', 'MOVE_TO_WLT_DSH_SHARED', 'SPLIT_BY_CAPABILITY'].includes(decision.decision),
  };
});

const summary = records.reduce((acc, record) => {
  acc[record.decision] = (acc[record.decision] ?? 0) + 1;
  return acc;
}, {});

const output = {
  sessionId,
  generated_at: new Date().toISOString(),
  roots: uiOnlyRoots,
  total_files: records.length,
  summary,
  records,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'file-ownership-matrix.json'), JSON.stringify(output, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'decision.txt'), [
  `session=${sessionId}`,
  'task_class=HIGH',
  'gate_tier=Scoped',
  'scope=UI-only ownership matrix for DSH/WLT app/control-panel roots',
  'zip=not-requested',
].join('\n'), 'utf8');

console.log(JSON.stringify({
  sessionId,
  output: toPosix(path.relative(root, path.join(outDir, 'file-ownership-matrix.json'))),
  total_files: output.total_files,
  summary,
}, null, 2));

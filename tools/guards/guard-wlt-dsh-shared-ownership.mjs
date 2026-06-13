#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appRoots = [
  'wlt/frontend/dsh/app-client',
  'wlt/frontend/dsh/app-partner',
  'wlt/frontend/dsh/app-captain',
  'wlt/frontend/dsh/app-field',
  'wlt/frontend/dsh/control-panel',
];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

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

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const rules = [
  {
    id: 'wlt_app_creates_typed_client',
    regex: /\bcreateWltDshTypedClient\b/g,
    remediation: 'WLT app-* must call WLT shared adapters/hooks, not construct typed clients.',
  },
  {
    id: 'wlt_app_maps_ledger_entries',
    regex: /\bWltLedgerEntry\b|\bentries\.map\(|\btransaction_type\b|\breference_type\b|\bledger[A-Z][A-Za-z0-9]*\b/g,
    remediation: 'Move ledger entry mapping into wlt/frontend/dsh/shared/read-models or shared/adapters.',
  },
  {
    id: 'wlt_app_computes_finance_snapshot',
    regex: /\bMath\.round\([^)]*amount|\breduce\([^)]*amount|\bpartner_payout\b|\bbalance\s*\*\s*100\b/g,
    remediation: 'Move finance snapshots and amount formatting into WLT shared.',
  },
  {
    id: 'wlt_app_exposes_finance_mutation',
    regex: /\bconfirmPaymentSession\b|\bcreateClientPaymentSession\b|\bcreateRefundCase\b|\bcreateSettlement\b|\btopUp\b|\brequestSettlement\b/g,
    remediation: 'Payment, refund, and settlement runtime decisions belong to WLT shared clients/policies.',
  },
  {
    id: 'wlt_app_owns_money_format_or_policy',
    regex: /\bformatWltYer\b|\bmoneyPolicy\b|\bfinance[A-Za-z0-9]*(?:Label|Policy|Contract)\b|\bpostingRules\b|\bsubledger\b|\bmakerChecker\b/g,
    remediation: 'Move money formatting, finance labels, posting rules, subledger, and maker-checker policy to WLT shared.',
  },
  {
    id: 'wlt_app_imports_control_panel',
    regex: /^\s*(?:import|export)\s+.*from\s+['"][^'"]*(?:dsh\/frontend\/control-panel|wlt\/frontend\/dsh\/control-panel|\/control-panel\/|\.\.\/control-panel)[^'"]*['"]/gm,
    remediation: 'WLT app-* must not import DSH control-panel or depend on WLT control-panel internals.',
  },
  {
    id: 'wlt_app_imports_contracts_directly_for_runtime',
    regex: /^\s*import\s+\{[^}]*createWltDshTypedClient[^}]*\}\s+from\s+['"]\.\.\/contracts['"]/gm,
    remediation: 'Typed runtime clients are owned by wlt/frontend/dsh/shared/clients.',
  },
];

const files = appRoots.flatMap((appRoot) => walk(path.join(root, appRoot)));
const findings = [];

for (const abs of files) {
  const rel = toPosix(path.relative(root, abs));
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    let match;
    while ((match = rule.regex.exec(text)) !== null) {
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
}

const output = {
  guardId: 'GUARD_WLT_DSH_UI_ONLY_BINDINGS',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  appRoots,
  filesScanned: files.length,
  findings,
  failCount: findings.length,
};

console.log(JSON.stringify(output, null, 2));
if (findings.length > 0) process.exitCode = 1;

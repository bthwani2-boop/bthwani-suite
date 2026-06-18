#!/usr/bin/env node
/**
 * GUARD: no-surface-model-god-hooks
 * Enforces that *.surface-model.ts files are orchestration-only:
 *   1. No direct fetch() / createXxxHttpClient() calls — must delegate to domain hooks/clients
 *   2. No direct business validation logic that belongs in a policy file
 *   3. No React.useState calls exceeding the per-file budget (delegation to sub-hooks is the pattern)
 *   4. File length must not exceed the line budget
 *
 * Authority: governance/15_AGENT_AND_AI_EXECUTION.md, .agents/AUTHORITY_BOUNDARY.md
 */
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

const SURFACE_MODEL_GLOB = /\.surface-model\.ts$/;
const SCAN_ROOTS = [
  'dsh/frontend/shared',
];

const MAX_LINES = 350;
const MAX_USE_STATE_DIRECT = 10;

const forbiddenPatterns = [
  {
    id: 'surface_model_direct_fetch',
    regex: /\bfetch\s*\(/g,
    message: 'Surface model must not call fetch() directly — delegate to a domain hook or HTTP client.',
  },
  {
    id: 'surface_model_creates_http_client',
    regex: /\bcreate[A-Za-z0-9]+(?:Http|Typed)Client\s*\(/g,
    message: 'Surface model must not instantiate HTTP clients directly — move to a domain hook (useFooRuntime).',
  },
  {
    id: 'surface_model_inline_api_side_effect',
    regex: /\baxios\s*\.\s*(?:get|post|put|patch|delete)\s*\(/g,
    message: 'Surface model must not call axios directly — delegate to a domain HTTP client.',
  },
  {
    id: 'surface_model_async_validate_pattern',
    regex: /\bawait\s+validate[A-Za-z0-9]*\s*\(/g,
    message: 'Surface model must not run async validation — extract to a policy/validator file.',
  },
];

function toPosix(v) { return String(v).replace(/\\/g, '/'); }

function walk(absDir, files = []) {
  if (!fs.existsSync(absDir)) return files;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'build', 'coverage'].includes(entry.name)) continue;
    const abs = path.join(absDir, entry.name);
    if (entry.isDirectory()) walk(abs, files);
    else if (entry.isFile() && SURFACE_MODEL_GLOB.test(entry.name)) files.push(abs);
  }
  return files;
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const findings = [];

for (const scanRoot of SCAN_ROOTS) {
  const files = walk(path.join(root, scanRoot));

  for (const abs of files) {
    const rel = toPosix(path.relative(root, abs));
    const text = fs.readFileSync(abs, 'utf8').replace(/^﻿/, '');
    const lines = text.split(/\r?\n/);

    // Rule 1: line budget
    if (lines.length > MAX_LINES) {
      findings.push({
        severity: 'WARN',
        rule: 'surface_model_too_large',
        file: rel,
        line: MAX_LINES + 1,
        evidence: `${lines.length} lines (budget: ${MAX_LINES})`,
        remediation: `Split surface model into topic sub-hooks. Surface models are orchestration only.`,
      });
    }

    // Rule 2: direct useState budget
    const useStateMatches = [...text.matchAll(/\bReact\.useState\b|\buseState\s*</g)];
    if (useStateMatches.length > MAX_USE_STATE_DIRECT) {
      findings.push({
        severity: 'WARN',
        rule: 'surface_model_too_many_direct_use_state',
        file: rel,
        line: lineNumber(text, useStateMatches[MAX_USE_STATE_DIRECT].index),
        evidence: `${useStateMatches.length} direct useState calls (budget: ${MAX_USE_STATE_DIRECT})`,
        remediation: `Extract state into domain sub-hooks (useFooState). Surface model should delegate, not own state.`,
      });
    }

    // Rule 3: forbidden patterns
    for (const rule of forbiddenPatterns) {
      const match = rule.regex.exec(text);
      rule.regex.lastIndex = 0;
      if (match) {
        findings.push({
          severity: 'FAIL',
          rule: rule.id,
          file: rel,
          line: lineNumber(text, match.index),
          evidence: match[0].slice(0, 120),
          remediation: rule.message,
        });
      }
    }
  }
}

const passed = findings.filter((f) => f.severity === 'PASS').length;
const warned = findings.filter((f) => f.severity === 'WARN').length;
const failed = findings.filter((f) => f.severity === 'FAIL').length;
const status = failed > 0 ? 'FAIL' : warned > 0 ? 'WARN' : 'PASS';

const result = {
  guard: 'GUARD_NO_SURFACE_MODEL_GOD_HOOKS',
  status,
  summary: `${failed} failures, ${warned} warnings across surface-model files`,
  findings,
};

if (args.jsonOut) {
  fs.mkdirSync(path.dirname(path.resolve(root, args.jsonOut)), { recursive: true });
  fs.writeFileSync(path.resolve(root, args.jsonOut), JSON.stringify(result, null, 2), 'utf8');
}

if (args.mdOut) {
  const lines = [
    `# GUARD_NO_SURFACE_MODEL_GOD_HOOKS — ${status}`,
    '',
    `**${result.summary}**`,
    '',
  ];
  if (findings.length === 0) {
    lines.push('All surface models pass orchestration-only checks.');
  } else {
    for (const f of findings) {
      lines.push(`- \`${f.severity}\` [${f.rule}] ${f.file}:${f.line} — ${f.evidence}`);
      lines.push(`  - _${f.remediation}_`);
    }
  }
  fs.mkdirSync(path.dirname(path.resolve(root, args.mdOut)), { recursive: true });
  fs.writeFileSync(path.resolve(root, args.mdOut), lines.join('\n'), 'utf8');
}

if (failed > 0) {
  process.stderr.write(`[GUARD_NO_SURFACE_MODEL_GOD_HOOKS] FAIL — ${failed} violations\n`);
  process.exit(1);
} else {
  process.stdout.write(`[GUARD_NO_SURFACE_MODEL_GOD_HOOKS] ${status} — ${result.summary}\n`);
  process.exit(0);
}

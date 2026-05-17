#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (let i=0; i<argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const n = argv[i+1];
      if (!n || n.startsWith('--')) args[k] = true;
      else { args[k] = n; i++; }
    } else args._.push(a);
  }
  return args;
}

export function normalizePath(p) { return p.replace(/\\/g, '/'); }

export function walk(root, opts = {}) {
  const excludes = new Set(opts.excludes || ['.git','node_modules','.next','dist','build','.expo','coverage','.turbo','.nx','tools/registry/runs','tools/plan']);
  const out = [];
  function rec(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      const rel = normalizePath(path.relative(root, full));
      if ([...excludes].some(x => rel === x || rel.startsWith(x + '/'))) continue;
      if (ent.isDirectory()) rec(full); else out.push(full);
    }
  }
  rec(root); return out;
}

export function isTextFile(file) {
  return /\.(md|txt|json|js|mjs|cjs|ts|tsx|yml|yaml|ps1|toml|css|scss|html|xml)$/i.test(file) || path.basename(file).startsWith('.gitignore');
}

export function readText(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return ''; }
}

export function createResult(guardId, args) {
  const findings = [];
  return {
    guardId,
    profile: args.profile || 'governance',
    phase: args.phase || 'UI_UX_FLOW',
    findings,
    add(severity, rule, file, message, line = null, remediation = '') {
      findings.push({ severity, rule, file: file ? normalizePath(path.relative(args.root || process.cwd(), file)) : null, line, message, remediation });
    },
    finalize() {
      const fail = findings.filter(f => f.severity === 'FAIL').length;
      const warn = findings.filter(f => f.severity === 'WARN').length;
      const info = findings.filter(f => f.severity === 'INFO').length;
      return { guardId, status: fail ? 'FAIL' : warn ? 'WARN' : 'PASS', failCount: fail, warnCount: warn, infoCount: info, findings };
    }
  };
}

export function writeOutputs(result, args) {
  const final = result.finalize ? result.finalize() : result;
  if (args['json-out']) fs.writeFileSync(args['json-out'], JSON.stringify(final, null, 2), 'utf8');
  if (args['md-out']) {
    const lines = [`# ${final.guardId}`, '', `- status: ${final.status}`, `- fail: ${final.failCount}`, `- warn: ${final.warnCount}`, `- info: ${final.infoCount}`, '', '| Severity | Rule | File | Line | Message |', '|---|---|---|---:|---|'];
    for (const f of final.findings || []) lines.push(`| ${f.severity} | ${f.rule} | ${f.file || ''} | ${f.line || ''} | ${(f.message || '').replace(/\|/g,'/')} |`);
    fs.writeFileSync(args['md-out'], lines.join('\n') + '\n', 'utf8');
  }
  if (final.status === 'FAIL') process.exitCode = 1;
}

export function lineOf(text, index) { return text.slice(0, index).split(/\r?\n/).length; }

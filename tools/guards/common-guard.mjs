#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const n = argv[i + 1];
      if (!n || n.startsWith('--')) {
        args[k] = true;
      } else {
        args[k] = n;
        i++;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

export function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

export function walk(root, opts = {}) {
  const excludes = new Set(opts.excludes || [
    '.git',
    'node_modules',
    '.next',
    'dist',
    'build',
    '.expo',
    'coverage',
    '.turbo',
    '.nx',
    '.tamagui',
    'tools/registry/runs',
    'tools/plan',
    'app-client/runtime',
    'app-partner/runtime',
    'app-captain/runtime',
    'app-field/runtime'
  ]);

  const out = [];

  function rec(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      const rel = normalizePath(path.relative(root, full));
      const segments = rel.split('/');

      if (segments.some((seg) => [
        '.git',
        'node_modules',
        '.next',
        'dist',
        'build',
        '.expo',
        'coverage',
        '.turbo',
        '.nx',
        '.tamagui'
      ].includes(seg))) {
        continue;
      }

      if ([...excludes].some((x) => rel === x || rel.startsWith(`${x}/`))) {
        continue;
      }

      if (ent.isDirectory()) {
        rec(full);
      } else {
        out.push(full);
      }
    }
  }

  rec(root);
  return out;
}

export function isTextFile(file) {
  return /\.(ts|tsx|js|jsx|mjs|cjs|json|md|css|scss|yml|yaml|txt|ps1|go|sql)$/i.test(file);
}

export function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

export function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

export function createResult(guardId) {
  const findings = [];

  return {
    guardId,
    findings,

    add(severity, rule, file, message, line = null, suggestion = null) {
      findings.push({ severity, rule, file, line, message, suggestion });
    },

    info(rule, file, message, line = null, suggestion = null) {
      this.add('INFO', rule, file, message, line, suggestion);
    },

    warn(rule, file, message, line = null, suggestion = null) {
      this.add('WARN', rule, file, message, line, suggestion);
    },

    fail(rule, file, message, line = null, suggestion = null) {
      this.add('FAIL', rule, file, message, line, suggestion);
    },

    finalize() {
      const failCount = findings.filter((f) => f.severity === 'FAIL').length;
      const warnCount = findings.filter((f) => f.severity === 'WARN').length;
      const infoCount = findings.filter((f) => f.severity === 'INFO').length;

      return {
        guardId,
        status: failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS',
        failCount,
        warnCount,
        infoCount,
        findings
      };
    }
  };
}

export function writeOutputs(result, args) {
  const final = result.finalize ? result.finalize() : result;

  if (args['json-out']) {
    fs.writeFileSync(args['json-out'], JSON.stringify(final, null, 2), 'utf8');
  }

  if (args['md-out']) {
    const lines = [
      `# ${final.guardId}`,
      '',
      `- status: ${final.status}`,
      `- fail: ${final.failCount}`,
      `- warn: ${final.warnCount}`,
      `- info: ${final.infoCount}`,
      '',
      '| Severity | Rule | File | Line | Message |',
      '|---|---|---|---:|---|'
    ];

    for (const f of final.findings || []) {
      lines.push(`| ${f.severity} | ${f.rule} | ${f.file || ''} | ${f.line || ''} | ${(f.message || '').replace(/\|/g, '/')} |`);
    }

    fs.writeFileSync(args['md-out'], `${lines.join('\n')}\n`, 'utf8');
  }

  if (final.status === 'FAIL') {
    process.exitCode = 1;
  }
}

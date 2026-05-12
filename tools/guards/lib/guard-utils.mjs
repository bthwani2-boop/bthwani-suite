import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

export const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.yml', '.yaml', '.toml', '.css', '.scss', '.txt', '.ps1'
]);

export const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

export const CURRENT_ACTIVE_START_DIRS = [
  'governance',
  '.agents',
  'tools/guards',
  '.github/workflows',
  'app-client/runtime',
  'app-partner/runtime',
  'app-captain/runtime',
  'app-field/runtime',
  'control-panel/runtime',
  'webapp/runtime',
  'website/runtime',
  'ui-kit',
  'dsh',
  'wlt',
  'knz',
  'arb',
  'amn',
  'esf',
  'mrf',
  'snd',
  'kwd'
];

const DEFAULT_SKIP_SEGMENTS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.expo', '.turbo', '.nx', 'android', 'ios'
]);

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), jsonOut: '', mdOut: '', mode: 'local' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--root') args.root = argv[++i];
    else if (token === '--json-out') args.jsonOut = argv[++i];
    else if (token === '--md-out') args.mdOut = argv[++i];
    else if (token === '--mode') args.mode = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token.startsWith('--json-out=')) args.jsonOut = token.slice('--json-out='.length);
    else if (token.startsWith('--md-out=')) args.mdOut = token.slice('--md-out='.length);
    else if (token.startsWith('--mode=')) args.mode = token.slice('--mode='.length);
    else throw new Error(`Unknown argument: ${token}`);
  }
  args.root = path.resolve(args.root);
  return args;
}

export function rel(root, filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

export function exists(root, relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

export function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

export function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

export function readTextSafe(filePath) {
  try { return readText(filePath); } catch { return ''; }
}

export function writeFileSafe(filePath, content) {
  if (!filePath) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

export function gitTrackedFiles(root) {
  const output = execFileSync('git', ['ls-files'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function shouldSkip(absPath, root) {
  const relative = rel(root, absPath);
  if (!relative || relative === '.') return false;
  const parts = relative.split('/');
  if (parts.some((part) => DEFAULT_SKIP_SEGMENTS.has(part))) return true;
  return relative.startsWith('tools/registry/runs/');
}

export function walkFiles(root, options = {}) {
  const startDirs = options.startDirs ?? CURRENT_ACTIVE_START_DIRS;
  const extensions = options.extensions ?? TEXT_EXTENSIONS;
  const files = [];

  for (const dir of startDirs) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    walk(abs);
  }

  return files;

  function walk(current) {
    if (shouldSkip(current, root)) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.has(ext)) files.push(abs);
    }
  }
}

export function createReport(guardId, policySource) {
  const issues = [];
  return {
    guardId,
    policySource,
    issues,
    fail(file, message, evidence = '') { issues.push({ severity: 'FAIL', file, message, evidence }); },
    warn(file, message, evidence = '') { issues.push({ severity: 'WARN', file, message, evidence }); },
    info(file, message, evidence = '') { issues.push({ severity: 'INFO', file, message, evidence }); },
  };
}

export function finalize(report, args) {
  const failCount = report.issues.filter((issue) => issue.severity === 'FAIL').length;
  const warnCount = report.issues.filter((issue) => issue.severity === 'WARN').length;
  const status = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';
  const output = {
    guardId: report.guardId,
    policySource: report.policySource,
    status,
    failCount,
    warnCount,
    infoCount: report.issues.filter((issue) => issue.severity === 'INFO').length,
    issues: report.issues,
    generatedAt: new Date().toISOString(),
  };

  writeFileSafe(args.jsonOut, JSON.stringify(output, null, 2));
  writeFileSafe(args.mdOut, toMarkdown(output));
  console.log(`${report.guardId}: ${status} (fail=${failCount}, warn=${warnCount})`);
  if (failCount > 0) process.exitCode = 1;
  return output;
}

function toMarkdown(output) {
  const lines = [];
  lines.push(`# ${output.guardId}`);
  lines.push('');
  lines.push(`status: ${output.status}`);
  lines.push(`policySource: ${Array.isArray(output.policySource) ? output.policySource.join(', ') : output.policySource}`);
  lines.push(`failCount: ${output.failCount}`);
  lines.push(`warnCount: ${output.warnCount}`);
  lines.push('');
  if (output.issues.length === 0) {
    lines.push('No issues found.');
  } else {
    lines.push('| Severity | File | Message | Evidence |');
    lines.push('|---|---|---|---|');
    for (const issue of output.issues) {
      lines.push(`| ${escapeMd(issue.severity)} | ${escapeMd(issue.file)} | ${escapeMd(issue.message)} | ${escapeMd(issue.evidence)} |`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

function escapeMd(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

export function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

export function isProbablyGeneratedPath(relativePath) {
  return /(^|\/)(generated|__generated__|fixtures?|mocks?)(\/|$)/i.test(relativePath)
    || /\.(lock|snap)$/i.test(relativePath)
    || relativePath === 'pnpm-lock.yaml';
}

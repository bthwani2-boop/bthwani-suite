
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function writeCsv(filePath, rows, headers = []) {
  const effectiveHeaders = headers.length > 0 ? headers : (rows[0] ? Object.keys(rows[0]) : []);
  if (effectiveHeaders.length === 0) {
    fs.writeFileSync(filePath, '', 'utf8');
    return;
  }
  const lines = [
    effectiveHeaders.map(csvEscape).join(','),
    ...rows.map((row) => effectiveHeaders.map((header) => csvEscape(row[header])).join(',')),
  ];
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readTextSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function gitLsFiles() {
  const output = execFileSync('git', ['ls-files'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function crc32(buffer) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = Array.from({ length: 256 }, (_, n) => {
      let c = n;
      for (let k = 0; k < 8; k += 1) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      return c >>> 0;
    });
  }
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeZip(zipPath, files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const file of files) {
    const name = path.basename(file);
    const data = fs.readFileSync(file);
    const compressed = deflateRawSync(data);
    const crc = crc32(data);
    const nameBuffer = Buffer.from(name, 'utf8');
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuffer, compressed);
    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(20, 6);
    header.writeUInt16LE(0, 8);
    header.writeUInt16LE(8, 10);
    header.writeUInt16LE(0, 12);
    header.writeUInt16LE(0, 14);
    header.writeUInt32LE(crc, 16);
    header.writeUInt32LE(compressed.length, 20);
    header.writeUInt32LE(data.length, 24);
    header.writeUInt16LE(nameBuffer.length, 28);
    header.writeUInt16LE(0, 30);
    header.writeUInt16LE(0, 32);
    header.writeUInt16LE(0, 34);
    header.writeUInt16LE(0, 36);
    header.writeUInt32LE(0, 38);
    header.writeUInt32LE(offset, 42);
    central.push(header, nameBuffer);
    offset += local.length + nameBuffer.length + compressed.length;
  }
  const centralSize = central.reduce((sum, item) => sum + item.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  fs.writeFileSync(zipPath, Buffer.concat([...chunks, ...central, end]));
}

function finishGuard({ evidenceRoot, decision, summary, evidence }) {
  fs.writeFileSync(path.join(evidenceRoot, 'SUMMARY.md'), summary, 'utf8');
  fs.writeFileSync(path.join(evidenceRoot, 'status.txt'), `${decision}\n`, 'utf8');
  fs.writeFileSync(path.join(evidenceRoot, 'evidence.json'), JSON.stringify(evidence, null, 2), 'utf8');
  const evidenceZip = path.join(evidenceRoot, `${path.basename(evidenceRoot)}.zip`);
  if (fs.existsSync(evidenceZip)) fs.rmSync(evidenceZip, { force: true });
  const files = fs.readdirSync(evidenceRoot)
    .filter((name) => name !== path.basename(evidenceZip))
    .map((name) => path.join(evidenceRoot, name));
  makeZip(evidenceZip, files);
  return { evidenceZip, handoffZip: evidenceZip, namedZip: evidenceZip };
}

function makeEvidenceRoot(prefix) {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
  const evidenceRoot = path.join(ROOT, 'tools', 'registry', 'runs', `${prefix}-${stamp}`);
  ensureDir(evidenceRoot);
  return evidenceRoot;
}

function isTrackedScanFile(file) {
  return /\.(ts|tsx|js|jsx|mjs|cjs|json|md|mdx|yml|yaml|ps1|css|scss)$/.test(file)
    && !file.startsWith('tools/registry/runs/')
    && !file.startsWith('node_modules/')
    && !file.startsWith('.git/');
}

const CONFIG_PATH = path.join(ROOT, 'tools', 'guards', 'guard-runtime-route-entrypoint-protection.config.json');

function latestGuard03Queue() {
  const runsRoot = path.join(ROOT, 'tools', 'registry', 'runs');
  if (!fs.existsSync(runsRoot)) return '';
  const candidates = fs.readdirSync(runsRoot)
    .filter((name) => name.startsWith('GUARD_03_UNUSED_DEAD_ORPHAN_CODE-'))
    .sort()
    .reverse();
  for (const name of candidates) {
    const queue = path.join(runsRoot, name, 'dead-code-remediation-queue.csv');
    if (fs.existsSync(queue)) return queue;
  }
  return '';
}

function fileMatchesAny(file, patterns) {
  return patterns.some((patternText) => new RegExp(patternText).test(file));
}

function main() {
  const config = readJson(CONFIG_PATH);
  const evidenceRoot = makeEvidenceRoot('GUARD_08_RUNTIME_ROUTE_ENTRYPOINT_PROTECTION');
  const tracked = gitLsFiles().filter(isTrackedScanFile);

  const protectedEntrypoints = [];
  const routePatterns = config.nextRoutePatterns ?? [];
  const runtimeNamePatterns = config.runtimeNamePatterns ?? [];
  const rootEntrypointPatterns = config.rootEntrypointPatterns ?? [];

  for (const file of tracked) {
    let kind = '';
    if (fileMatchesAny(file, routePatterns)) kind = 'NEXT_ROUTE_ENTRYPOINT';
    else if (fileMatchesAny(file, runtimeNamePatterns)) kind = 'RUNTIME_OR_SHELL_ENTRYPOINT';
    else if (fileMatchesAny(file, rootEntrypointPatterns)) kind = 'APP_ROOT_ENTRYPOINT';

    if (kind) {
      protectedEntrypoints.push({
        path: file,
        protection_kind: kind,
        reason: 'Protected from orphan/dead-code cleanup because direct import absence is not enough proof.',
      });
    }
  }

  const queuePath = latestGuard03Queue();
  const queueText = queuePath ? readTextSafe(queuePath) : '';
  const queueMatches = protectedEntrypoints
    .filter((item) => queueText.includes(item.path))
    .map((item) => ({
      path: item.path,
      protection_kind: item.protection_kind,
      source_queue: queuePath,
      severity: config.policy?.guard03ProtectedEntrypointSeverity ?? 'warning',
      reason: 'GUARD-03 queue references a runtime/route entrypoint candidate. Treat as protected until runtime proof exists.',
    }));

  writeCsv(path.join(evidenceRoot, 'protected-runtime-route-entrypoints.csv'), protectedEntrypoints, ['path','protection_kind','reason']);
  writeCsv(path.join(evidenceRoot, 'guard03-protected-entrypoint-overlap.csv'), queueMatches, ['path','protection_kind','source_queue','severity','reason']);
  writeCsv(path.join(evidenceRoot, 'issues.csv'), queueMatches, ['path','protection_kind','source_queue','severity','reason']);

  const errors = queueMatches.filter((item) => item.severity === 'error');
  const warnings = queueMatches.filter((item) => item.severity !== 'error');
  const decision = errors.length
    ? 'BLOCKED_BY_RUNTIME_ROUTE_ENTRYPOINT_RISK'
    : warnings.length
      ? 'READY_FOR_RUNTIME_ROUTE_ENTRYPOINT_REVIEW_WITH_WARNINGS'
      : 'PASS_RUNTIME_ROUTE_ENTRYPOINT_PROTECTION';

  const summary = `# GUARD-08 — Runtime / Route Entrypoint Protection Guard

Decision: ${decision}
EvidenceRoot: ${toPosix(path.relative(ROOT, evidenceRoot))}
GuardVersion: 1.0.0

## Counts

- FilesScanned: ${tracked.length}
- ProtectedEntrypoints: ${protectedEntrypoints.length}
- Guard03ProtectedEntrypointOverlaps: ${queueMatches.length}
- Errors: ${errors.length}
- Warnings: ${warnings.length}

## Rule

CHECK-only.
No delete.
No move.
No rename.
No orphan/dead-code cleanup is allowed for runtime or route entrypoints without runtime proof.
`;

  const zip = finishGuard({
    evidenceRoot,
    decision,
    summary,
    evidence: {
      decision,
      repo: ROOT,
      evidence_root: evidenceRoot,
      guard: 'GUARD-08_RUNTIME_ROUTE_ENTRYPOINT_PROTECTION',
      guard_version: '1.0.0',
      files_scanned: tracked.length,
      protected_entrypoints: protectedEntrypoints.length,
      guard03_protected_entrypoint_overlaps: queueMatches.length,
      errors: errors.length,
      warnings: warnings.length,
      check_only: true,
      no_delete: true,
      no_move: true,
      no_rename: true,
    },
  });

  console.log('');
  console.log('GUARD-08 Runtime / Route Entrypoint Protection Guard complete.');
  console.log(`Decision: ${decision}`);
  console.log(`EvidenceRoot: ${evidenceRoot}`);
  console.log(`HandoffZip: ${zip.handoffZip}`);
  console.log(`ProtectedEntrypoints: ${protectedEntrypoints.length}`);
  console.log(`Guard03ProtectedEntrypointOverlaps: ${queueMatches.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
}

main();

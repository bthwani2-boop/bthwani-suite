import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const ROOT = path.resolve(__dirname, '..', '..');

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function toPosix(value) {
  return value.split(path.sep).join('/');
}

export function readTextSafe(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return ''; }
}

export function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function gitLsFiles() {
  const output = execFileSync('git', ['ls-files'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let files = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  // Support running guards only on affected files/roots via env overrides
  const affectedFilesRaw = process.env.AFFECTED_FILES || '';
  const affectedRootsRaw = process.env.AFFECTED_ROOTS || '';

  if (affectedFilesRaw) {
    const listed = affectedFilesRaw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    // intersect with git-tracked files to avoid bogus paths
    const set = new Set(listed);
    files = files.filter((f) => set.has(f));
    return files;
  }

  if (affectedRootsRaw) {
    const roots = affectedRootsRaw.split(',').map((r) => r.trim()).filter(Boolean);
    if (roots.length) {
      files = files.filter((f) => {
        const top = f.includes('/') ? f.split('/')[0] : f.split('\\')[0];
        return roots.includes(top);
      });
    }
    return files;
  }

  return files;
}

export function isTextLike(file) {
  return /\.(ts|tsx|js|jsx|mjs|cjs|json|md|mdx|mdc|yml|yaml|toml|ps1|css|scss|txt)$/i.test(file);
}

export function isCodeLike(file) {
  return /\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(file);
}

export function isUiLike(file) {
  return /\.(tsx|jsx|css|scss)$/i.test(file);
}

export function defaultFileFilter(file) {
  return !file.startsWith('tools/registry/runs/')
    && !file.startsWith('node_modules/')
    && !file.startsWith('.git/')
    && !file.includes('/.next/')
    && !file.includes('/dist/')
    && !file.includes('/build/');
}

export function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function writeCsv(filePath, rows, headers = undefined) {
  const effectiveHeaders = headers ?? (rows[0] ? Object.keys(rows[0]) : []);
  if (!effectiveHeaders.length) {
    fs.writeFileSync(filePath, '', 'utf8');
    return;
  }
  const lines = [
    effectiveHeaders.map(csvEscape).join(','),
    ...rows.map((row) => effectiveHeaders.map((header) => csvEscape(row[header])).join(',')),
  ];
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function crc32(buffer) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = Array.from({ length: 256 }, (_, n) => {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      return c >>> 0;
    });
  }
  let crc = 0xffffffff;
  for (const byte of buffer) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export function makeZip(zipPath, files) {
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

export function makeEvidenceRoot(prefix) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
  const evidenceRoot = path.join(ROOT, 'tools', 'registry', 'runs', `${prefix}-${stamp}`);
  ensureDir(evidenceRoot);
  return evidenceRoot;
}

export function finishGuard({ evidenceRoot, decision, summary, evidence, issues, issueHeaders, issueFileName = 'issues.csv' }) {
  if (issues) writeCsv(path.join(evidenceRoot, issueFileName), issues, issueHeaders);
  if (issues && issueFileName !== 'issues.csv') writeCsv(path.join(evidenceRoot, 'issues.csv'), issues, issueHeaders);
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

export function runGuard({ guardId, guardName, prefix, configPath, collect }) {
  const config = readJson(path.join(ROOT, configPath));
  const evidenceRoot = makeEvidenceRoot(prefix);
  const result = collect({ config, evidenceRoot });
  const findings = result.findings ?? [];
  const errors = findings.filter((item) => item.severity === 'error');
  const warnings = findings.filter((item) => item.severity !== 'error');
  const decision = errors.length
    ? result.blockedDecision
    : warnings.length
      ? result.warningDecision
      : result.passDecision;

  const extraCounts = result.extraCounts ?? {};
  const countsMd = Object.entries({
    ...(result.baseCounts ?? {}),
    Findings: findings.length,
    Errors: errors.length,
    Warnings: warnings.length,
    ...extraCounts,
  }).map(([key, value]) => `- ${key}: ${value}`).join('\n');

  const summary = `# ${guardId} — ${guardName}

Decision: ${decision}
EvidenceRoot: ${toPosix(path.relative(ROOT, evidenceRoot))}
GuardVersion: ${config.version ?? '1.0.0'}

## Counts

${countsMd}

## Rule

CHECK-only. Warning-first. No files were modified by this guard.
`;

  const zip = finishGuard({
    evidenceRoot,
    decision,
    summary,
    evidence: {
      decision,
      repo: ROOT,
      evidence_root: evidenceRoot,
      guard: guardId,
      guard_version: config.version ?? '1.0.0',
      ...(result.baseCounts ?? {}),
      findings: findings.length,
      errors: errors.length,
      warnings: warnings.length,
      ...extraCounts,
      check_only: true,
      no_delete: true,
      no_move: true,
      no_rename: true,
    },
    issues: findings,
    issueHeaders: result.headers,
    issueFileName: result.issueFileName,
  });

  console.log('');
  console.log(`${guardId} ${guardName} complete.`);
  console.log(`Decision: ${decision}`);
  console.log(`EvidenceRoot: ${evidenceRoot}`);
  console.log(`HandoffZip: ${zip.handoffZip}`);
  console.log(`Findings: ${findings.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
}

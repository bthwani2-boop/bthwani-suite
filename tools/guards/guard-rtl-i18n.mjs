
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

const CONFIG_PATH = path.join(ROOT, 'tools', 'guards', 'guard-rtl-i18n.config.json');

function containsArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function main() {
  const config = readJson(CONFIG_PATH);
  const evidenceRoot = makeEvidenceRoot('GUARD_09_RTL_I18N');
  const tracked = gitLsFiles().filter(isTrackedScanFile);
  const findings = [];

  const scanExt = /\.(ts|tsx|js|jsx|mjs|cjs|json|md|mdx)$/;
  const localeAllowed = config.allowedLocalePathPatterns ?? [];

  for (const file of tracked.filter((item) => scanExt.test(item))) {
    const full = path.join(ROOT, file);
    const text = readTextSafe(full);
    const lines = text.split(/\r?\n/);
    const isLocaleAllowed = localeAllowed.some((patternText) => new RegExp(patternText).test(file));
    const isTestOrDoc = /(^|\/)(__tests__|test|tests|docs|governance)\//i.test(file) || /\.(md|mdx)$/.test(file);

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (containsArabic(trimmed) && !isLocaleAllowed && !isTestOrDoc) {
        findings.push({
          type: 'HARDCODED_ARABIC_TEXT_REVIEW',
          severity: config.policy?.hardcodedArabicSeverity ?? 'warning',
          file,
          line: index + 1,
          text: trimmed.slice(0, 240),
          reason: 'Arabic UI text outside approved locale/doc paths requires review for i18n ownership.',
        });
      }

      if (containsArabic(trimmed) && /\b(left|right|marginLeft|marginRight|paddingLeft|paddingRight|textAlign:\s*['"]left['"]|textAlign:\s*['"]right['"])\b/.test(trimmed)) {
        findings.push({
          type: 'RTL_DIRECTIONAL_STYLE_REVIEW',
          severity: config.policy?.rtlDirectionalStyleSeverity ?? 'warning',
          file,
          line: index + 1,
          text: trimmed.slice(0, 240),
          reason: 'Arabic/RTL line contains directional style or alignment token; verify RTL contract.',
        });
      }

      if (/(chevron-forward|chevron-back|arrow-forward|arrow-back|ChevronRight|ChevronLeft)/.test(trimmed) && containsArabic(text)) {
        findings.push({
          type: 'RTL_CHEVRON_ICON_REVIEW',
          severity: config.policy?.rtlChevronSeverity ?? 'warning',
          file,
          line: index + 1,
          text: trimmed.slice(0, 240),
          reason: 'Chevron/arrow appears in Arabic-containing file; verify RTL placement and semantics.',
        });
      }
    });
  }

  writeCsv(path.join(evidenceRoot, 'rtl-i18n-findings.csv'), findings, ['type','severity','file','line','text','reason']);
  writeCsv(path.join(evidenceRoot, 'issues.csv'), findings, ['type','severity','file','line','text','reason']);

  const errors = findings.filter((item) => item.severity === 'error');
  const warnings = findings.filter((item) => item.severity !== 'error');
  const decision = errors.length
    ? 'BLOCKED_BY_RTL_I18N_GUARD'
    : warnings.length
      ? 'READY_FOR_RTL_I18N_REVIEW_WITH_WARNINGS'
      : 'PASS_RTL_I18N_GUARD';

  const summary = `# GUARD-09 — RTL / i18n Guard

Decision: ${decision}
EvidenceRoot: ${toPosix(path.relative(ROOT, evidenceRoot))}
GuardVersion: 1.0.0

## Counts

- FilesScanned: ${tracked.length}
- RtlI18nFindings: ${findings.length}
- Errors: ${errors.length}
- Warnings: ${warnings.length}

## Rule

CHECK-only.
Warning-first.
No automatic text rewrite.
No automatic RTL transformation.
All Arabic/RTL UI changes require owner and visual proof.
`;

  const zip = finishGuard({
    evidenceRoot,
    decision,
    summary,
    evidence: {
      decision,
      repo: ROOT,
      evidence_root: evidenceRoot,
      guard: 'GUARD-09_RTL_I18N',
      guard_version: '1.0.0',
      files_scanned: tracked.length,
      rtl_i18n_findings: findings.length,
      errors: errors.length,
      warnings: warnings.length,
      check_only: true,
      no_delete: true,
      no_move: true,
      no_rename: true,
    },
  });

  console.log('');
  console.log('GUARD-09 RTL / i18n Guard complete.');
  console.log(`Decision: ${decision}`);
  console.log(`EvidenceRoot: ${evidenceRoot}`);
  console.log(`HandoffZip: ${zip.handoffZip}`);
  console.log(`RtlI18nFindings: ${findings.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
}

main();

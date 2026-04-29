import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const CONFIG_PATH = path.join(ROOT, 'tools', 'guards', 'guard-public-export-barrel-contract.config.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

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

function gitLsFiles() {
  const output = execFileSync('git', ['ls-files'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
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

function main() {
  const config = readJson(CONFIG_PATH);
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
  const evidenceRoot = path.join(ROOT, 'tools', 'registry', 'runs', `GUARD_04_PUBLIC_EXPORT_BARREL_CONTRACT-${stamp}`);
  ensureDir(evidenceRoot);

  const excludes = config.excludePathPrefixes ?? [];
  const tracked = gitLsFiles().filter((file) => {
    return (
      /\.(ts|tsx|js|jsx|json)$/.test(file) &&
      !excludes.some((prefix) => file.startsWith(prefix))
    );
  });

  const publicFiles = tracked
    .filter((file) => /^packages\/[^/]+\/src\/public\/.+\.(ts|tsx)$/.test(file))
    .map((file) => {
      const match = file.match(/^packages\/([^/]+)\//);
      return {
        package: match?.[1] ?? '',
        path: file,
        basename: path.basename(file).replace(/\.(ts|tsx)$/, ''),
        protected: 'true',
      };
    });

  const barrelFiles = tracked
    .filter((file) => /(^|\/)index\.(ts|tsx)$/.test(file))
    .map((file) => ({
      path: file,
      size_bytes: fs.statSync(path.join(ROOT, file)).size,
      protected: 'true',
    }));

  const exportStarFindings = [];
  for (const file of tracked.filter((item) => /\.(ts|tsx)$/.test(item))) {
    const full = path.join(ROOT, file);
    const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/^\s*export\s+\*\s+from\s+/.test(line)) {
        exportStarFindings.push({
          path: file,
          line: index + 1,
          finding: 'EXPORT_STAR',
          severity: config.policy?.exportStarSeverity ?? 'warning',
          text: line.trim(),
        });
      }
    });
  }

  const packageExports = [];
  for (const file of tracked.filter((item) => /^packages\/[^/]+\/package\.json$/.test(item))) {
    const pkgName = file.split('/')[1];
    const json = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    if (json.exports && typeof json.exports === 'object') {
      Object.entries(json.exports).forEach(([key, value]) => {
        packageExports.push({
          package: pkgName,
          export_key: key,
          export_value: JSON.stringify(value),
        });
      });
    }
  }

  const missingPublicExports = [];
  for (const file of publicFiles) {
    const exportsForPackage = packageExports.filter((item) => item.package === file.package);
    const expectedA = `./${file.basename}`;
    const expectedB = `./public/${file.basename}`;
    const hasExport = exportsForPackage.some((item) => {
      return (
        item.export_key === expectedA ||
        item.export_key === expectedB ||
        item.export_value.includes(file.path)
      );
    });

    if (!hasExport) {
      missingPublicExports.push({
        package: file.package,
        public_file: file.path,
        expected_export_a: expectedA,
        expected_export_b: expectedB,
        severity: config.policy?.missingPublicPackageExportSeverity ?? 'warning',
        reason: 'Public file exists but package.json exports did not directly map it.',
      });
    }
  }

  const warnings = [
    ...exportStarFindings.map((item) => ({ type: 'EXPORT_STAR', ...item })),
    ...missingPublicExports.map((item) => ({ type: 'MISSING_PUBLIC_PACKAGE_EXPORT_MAPPING', ...item })),
  ];

  const errors = [];
  const decision = errors.length
    ? 'BLOCKED_BY_PUBLIC_EXPORT_BARREL_CONTRACT'
    : warnings.length
      ? 'READY_FOR_PUBLIC_EXPORT_BARREL_REVIEW_WITH_WARNINGS'
      : 'PASS_PUBLIC_EXPORT_BARREL_CONTRACT';

  writeCsv(path.join(evidenceRoot, 'public-export-files.csv'), publicFiles, ['package', 'path', 'basename', 'protected']);
  writeCsv(path.join(evidenceRoot, 'barrel-files.csv'), barrelFiles, ['path', 'size_bytes', 'protected']);
  writeCsv(path.join(evidenceRoot, 'export-star-findings.csv'), exportStarFindings, ['path', 'line', 'finding', 'severity', 'text']);
  writeCsv(path.join(evidenceRoot, 'package-exports-map.csv'), packageExports, ['package', 'export_key', 'export_value']);
  writeCsv(path.join(evidenceRoot, 'missing-package-public-exports.csv'), missingPublicExports, ['package', 'public_file', 'expected_export_a', 'expected_export_b', 'severity', 'reason']);
  writeCsv(path.join(evidenceRoot, 'issues.csv'), warnings, ['type', 'path', 'line', 'finding', 'severity', 'text', 'package', 'public_file', 'expected_export_a', 'expected_export_b', 'reason']);

  const summary = `# GUARD-04 — Public Export / Barrel Contract Guard

Decision: ${decision}
EvidenceRoot: ${toPosix(path.relative(ROOT, evidenceRoot))}
GuardVersion: 1.0.0

## Counts

- PublicFiles: ${publicFiles.length}
- BarrelFiles: ${barrelFiles.length}
- ExportStarFindings: ${exportStarFindings.length}
- MissingPublicPackageExportMappings: ${missingPublicExports.length}
- Errors: ${errors.length}
- Warnings: ${warnings.length}

## Rule

CHECK-only.
No files changed.
No delete.
No move.
No rename.
No CI connection.
`;

  fs.writeFileSync(path.join(evidenceRoot, 'SUMMARY.md'), summary, 'utf8');
  fs.writeFileSync(path.join(evidenceRoot, 'status.txt'), `${decision}\n`, 'utf8');
  fs.writeFileSync(
    path.join(evidenceRoot, 'evidence.json'),
    JSON.stringify(
      {
        decision,
        repo: ROOT,
        evidence_root: evidenceRoot,
        handoff_zip: path.join(evidenceRoot, '_HANDOFF.zip'),
        guard: 'GUARD-04_PUBLIC_EXPORT_BARREL_CONTRACT',
        guard_version: '1.0.0',
        public_files: publicFiles.length,
        barrel_files: barrelFiles.length,
        export_star_findings: exportStarFindings.length,
        missing_public_package_export_mappings: missingPublicExports.length,
        errors: errors.length,
        warnings: warnings.length,
        check_only: true,
        no_delete: true,
        no_move: true,
        no_rename: true,
      },
      null,
      2,
    ),
    'utf8',
  );

  const handoffZip = path.join(evidenceRoot, '_HANDOFF.zip');
  const files = fs
    .readdirSync(evidenceRoot)
    .filter((name) => name !== '_HANDOFF.zip')
    .map((name) => path.join(evidenceRoot, name));
  makeZip(handoffZip, files);

  console.log('');
  console.log('GUARD-04 Public Export / Barrel Contract Guard complete.');
  console.log(`Decision: ${decision}`);
  console.log(`EvidenceRoot: ${evidenceRoot}`);
  console.log(`HandoffZip: ${handoffZip}`);
  console.log(`PublicFiles: ${publicFiles.length}`);
  console.log(`BarrelFiles: ${barrelFiles.length}`);
  console.log(`ExportStarFindings: ${exportStarFindings.length}`);
  console.log(`MissingPublicPackageExportMappings: ${missingPublicExports.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
}

main();

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const CONFIG_PATH = path.join(ROOT, 'tools', 'guards', 'guard-evidence-registry-runs-hygiene.config.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(filePath, rows, headers) {
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

function isExcludedRun(runName, patterns) {
  return (patterns ?? []).some((patternText) => new RegExp(patternText).test(runName));
}

function main() {
  const config = readJson(CONFIG_PATH);
  const registryRoot = path.join(ROOT, config.registryRoot ?? 'tools/registry/runs');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
  const evidenceRoot = path.join(registryRoot, `GUARD_10_EVIDENCE_REGISTRY_RUNS_HYGIENE-${stamp}`);
  ensureDir(evidenceRoot);

  const allRuns = fs.existsSync(registryRoot)
    ? fs.readdirSync(registryRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((name) => name !== path.basename(evidenceRoot))
        .filter((name) => !isExcludedRun(name, config.excludeRunNamePatterns))
        .sort()
        .reverse()
    : [];

  const runs = allRuns.slice(0, Number(config.maxRunsToScan ?? 250));
  const findings = [];

  for (const runName of runs) {
    const runPath = path.join(registryRoot, runName);
    const files = fs.readdirSync(runPath, { withFileTypes: true }).filter((entry) => entry.isFile());
    const names = new Set(files.map((entry) => entry.name));

    const hasGenericHandoff = names.has('_HANDOFF.zip');
    const hasNamedHandoff = names.has(`${runName}_HANDOFF.zip`) || files.some((entry) => entry.name.endsWith('_HANDOFF.zip') && entry.name !== '_HANDOFF.zip');
    const hasSummary = names.has('SUMMARY.md') || names.has('summary.txt');
    const hasStatus = names.has('status.txt');
    const hasEvidenceJson = names.has('evidence.json');

    const add = (type, severity, reason) => {
      findings.push({
        type,
        severity,
        run: runName,
        path: toPosix(path.relative(ROOT, runPath)),
        reason,
      });
    };

    if (!hasGenericHandoff) add('MISSING_GENERIC_HANDOFF_ZIP', config.policy?.missingGenericHandoffSeverity ?? 'warning', 'Run does not contain _HANDOFF.zip.');
    if (!hasNamedHandoff) add('MISSING_NAMED_HANDOFF_ZIP', config.policy?.missingNamedHandoffSeverity ?? 'warning', 'Run does not contain SESSION_ID_HANDOFF.zip or equivalent named handoff.');
    if (!hasSummary) add('MISSING_SUMMARY', config.policy?.missingSummarySeverity ?? 'warning', 'Run does not contain SUMMARY.md or summary.txt.');
    if (!hasStatus) add('MISSING_STATUS', config.policy?.missingStatusSeverity ?? 'warning', 'Run does not contain status.txt.');
    if (!hasEvidenceJson) add('MISSING_EVIDENCE_JSON', config.policy?.missingEvidenceJsonSeverity ?? 'warning', 'Run does not contain evidence.json.');
    if (hasGenericHandoff && !hasNamedHandoff) add('AMBIGUOUS_GENERIC_HANDOFF_ONLY', config.policy?.ambiguousGenericHandoffOnlySeverity ?? 'warning', 'Only generic _HANDOFF.zip exists; upload confusion risk remains.');

    for (const entry of files) {
      const full = path.join(runPath, entry.name);
      if (fs.statSync(full).size === 0) {
        add('ZERO_BYTE_EVIDENCE_FILE', config.policy?.zeroByteEvidenceFileSeverity ?? 'warning', `Evidence file is zero bytes: ${entry.name}`);
      }
    }
  }

  const errors = findings.filter((item) => item.severity === 'error');
  const warnings = findings.filter((item) => item.severity !== 'error');
  const decision = errors.length
    ? 'BLOCKED_BY_EVIDENCE_REGISTRY_RUNS_HYGIENE'
    : warnings.length
      ? 'READY_FOR_EVIDENCE_HYGIENE_REVIEW_WITH_WARNINGS'
      : 'PASS_EVIDENCE_REGISTRY_RUNS_HYGIENE_GUARD';

  writeCsv(path.join(evidenceRoot, 'registry-runs-hygiene-findings.csv'), findings, ['type', 'severity', 'run', 'path', 'reason']);
  writeCsv(path.join(evidenceRoot, 'issues.csv'), findings, ['type', 'severity', 'run', 'path', 'reason']);

  const summary = `# GUARD-10 — Evidence / Registry Runs Hygiene Guard

Decision: ${decision}
EvidenceRoot: ${toPosix(path.relative(ROOT, evidenceRoot))}
GuardVersion: 1.0.1

## Counts

- RunsAvailable: ${allRuns.length}
- RunsScanned: ${runs.length}
- Findings: ${findings.length}
- Errors: ${errors.length}
- Warnings: ${warnings.length}

## Rule

CHECK-only. Warning-first. No evidence files were modified.
`;

  fs.writeFileSync(path.join(evidenceRoot, 'SUMMARY.md'), summary, 'utf8');
  fs.writeFileSync(path.join(evidenceRoot, 'status.txt'), `${decision}\n`, 'utf8');
  fs.writeFileSync(path.join(evidenceRoot, 'evidence.json'), JSON.stringify({
    decision,
    repo: ROOT,
    evidence_root: evidenceRoot,
    guard: 'GUARD-10_EVIDENCE_REGISTRY_RUNS_HYGIENE',
    guard_version: '1.0.1',
    runs_available: allRuns.length,
    runs_scanned: runs.length,
    findings: findings.length,
    errors: errors.length,
    warnings: warnings.length,
    check_only: true,
    no_delete: true,
    no_move: true,
    no_rename: true,
  }, null, 2), 'utf8');

  const handoffZip = path.join(evidenceRoot, '_HANDOFF.zip');
  const namedZip = path.join(evidenceRoot, `${path.basename(evidenceRoot)}_HANDOFF.zip`);
  const files = fs.readdirSync(evidenceRoot)
    .filter((name) => !name.endsWith('_HANDOFF.zip') && name !== '_HANDOFF.zip')
    .map((name) => path.join(evidenceRoot, name));

  makeZip(handoffZip, files);
  fs.copyFileSync(handoffZip, namedZip);

  console.log('');
  console.log('GUARD-10 Evidence / Registry Runs Hygiene Guard complete.');
  console.log(`Decision: ${decision}`);
  console.log(`EvidenceRoot: ${evidenceRoot}`);
  console.log(`HandoffZip: ${handoffZip}`);
  console.log(`RunsScanned: ${runs.length}`);
  console.log(`Findings: ${findings.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
}

main();
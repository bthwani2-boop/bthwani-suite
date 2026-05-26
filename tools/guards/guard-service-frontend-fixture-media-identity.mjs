#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const GUARD_ID = 'GUARD_SERVICE_FRONTEND_FIXTURE_MEDIA_IDENTITY';
const OUTPUT_SEVERITY_REPORT = 'REPORT';
const OUTPUT_SEVERITY_BLOCKING = 'BLOCKING_ON_CHANGED_FILES';

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
    else throw new Error(`Unknown argument: ${token}`);
  }
  args.root = path.resolve(args.root);
  return args;
}

function toPosix(value) {
  return String(value ?? '').replace(/\\/g, '/');
}

function rel(root, filePath) {
  return toPosix(path.relative(root, filePath));
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function writeFile(filePath, content) {
  if (!filePath) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function gitLines(root, args) {
  try {
    const output = execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return output
      .split(/\r?\n/)
      .map((line) => toPosix(line.trim()))
      .filter(Boolean)
      .filter((line) => !/^(warning|hint|error|fatal):/i.test(line));
  } catch {
    return [];
  }
}

function getChangedFiles(root) {
  return new Set([
    ...gitLines(root, ['diff', '--name-only']),
    ...gitLines(root, ['diff', '--cached', '--name-only']),
    ...gitLines(root, ['ls-files', '--others', '--exclude-standard']),
  ]);
}

function hasPathPrefix(relative, prefix) {
  return relative === prefix || relative.startsWith(`${prefix}/`);
}

function isSkipped(relative, config) {
  const basename = path.posix.basename(relative);
  if ((config.lockfileNames ?? []).includes(basename)) return true;
  if ((config.skipPathPrefixes ?? []).some((prefix) => hasPathPrefix(relative, prefix))) return true;
  const segments = relative.split('/');
  return segments.some((segment) => (config.skipPathSegments ?? []).includes(segment));
}

function walkFiles(root, startDirs, config) {
  const extensions = new Set(config.scanFileExtensions ?? []);
  const files = [];
  for (const startDir of startDirs) {
    const abs = path.join(root, startDir);
    if (!fs.existsSync(abs)) continue;
    walk(abs);
  }
  return files;

  function walk(absDir) {
    let entries;
    try {
      entries = fs.readdirSync(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const abs = path.join(absDir, entry.name);
      const relative = rel(root, abs);
      if (isSkipped(relative, config)) continue;
      if (entry.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!entry.isFile()) continue;
      if (extensions.has(path.extname(entry.name).toLowerCase())) files.push(abs);
    }
  }
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function lineText(text, lineNumber) {
  return text.split(/\r?\n/)[Math.max(0, lineNumber - 1)] ?? '';
}

function normalizeIdentityName(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[\u0640]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function compilePatterns(patterns) {
  return (patterns ?? []).map((pattern) => new RegExp(pattern, 'i'));
}

function isAllowedFixtureFile(relative, service) {
  return compilePatterns(service.allowedFixtureFilePatterns).some((regex) => regex.test(relative));
}

function isAllowedMediaReference(value, relative, service) {
  const canonical = service.canonicalMediaRoot;
  if (value.includes(canonical) || value.startsWith(`${canonical}/`)) return true;
  return compilePatterns(service.allowedMediaReferencePatterns).some((regex) => regex.test(value) || regex.test(relative));
}

function isSurfaceFile(relative, service, config) {
  const afterRoot = relative.slice(service.serviceRoot.length + 1);
  return (config.surfaceRootSegments ?? []).some((segment) => afterRoot === `frontend/${segment}` || afterRoot.startsWith(`frontend/${segment}/`));
}

function isTestFixtureFile(relative, config) {
  return compilePatterns(config.testFilePatterns).some((regex) => regex.test(relative));
}

function hasCanonicalDataReference(text, service) {
  return text.includes(service.canonicalDataRoot) || text.includes('/data/') || /from\s+['"][^'"]*data[^'"]*['"]/.test(text);
}

function makeFinding({
  service,
  file,
  line = null,
  severity,
  status,
  pattern,
  reason,
  detectedValue,
  remediation,
  immediateCorrection,
  isChangedFile,
}) {
  return {
    service: service.serviceId,
    file,
    line,
    severity,
    status,
    pattern,
    reason,
    detectedValue: String(detectedValue ?? '').slice(0, 500),
    canonicalDataRoot: service.canonicalDataRoot,
    canonicalMediaRoot: service.canonicalMediaRoot,
    remediation,
    immediateCorrection,
    isChangedFile,
  };
}

function classifySeverity(isChangedFile, isTestFixture) {
  if (isChangedFile) return isTestFixture ? 'WARN' : 'FAIL';
  return isTestFixture ? 'INFO' : 'WARN';
}

function classifyStatus(severity) {
  return severity === 'FAIL' ? 'FIX_REQUIRED' : 'LEGACY_WARNING';
}

function expectedPathFinding(service, relativePath, kind, isChangedFile = false) {
  const severity = isChangedFile ? 'FAIL' : 'WARN';
  const kindLabel = kind.replace(/_/g, ' ');
  return makeFinding({
    service,
    file: relativePath,
    severity,
    status: 'TBD_UNVERIFIED_PATH',
    pattern: `${kind}_path_missing`,
    reason: `Configured ${kind} path is not present. The guard reports the expected canonical path and does not create it.`,
    detectedValue: relativePath,
    remediation: service.remediationTemplate,
    immediateCorrection: `Create or document ${relativePath} as the ${kindLabel} owner before adding independent frontend demo data or media.`,
    isChangedFile,
  });
}

function extractIdentities(text, relative, service, changedFiles) {
  const identities = [];
  const objectRegex = /\{[\s\S]{0,1800}?\}/g;
  const keys = service.identityKeys ?? [];
  let match;
  while ((match = objectRegex.exec(text))) {
    const block = match[0];
    if (!keys.some((key) => new RegExp(`\\b${key}\\b`).test(block))) continue;
    const name = firstField(block, ['name', 'nameAr', 'nameEn', 'title', 'titleAr', 'titleEn']);
    const id = firstField(block, ['id']);
    const slug = firstField(block, ['slug']);
    const barcode = firstField(block, ['barcode', 'sku']);
    if (!name && !id && !slug && !barcode) continue;
    identities.push({
      service: service.serviceId,
      file: relative,
      line: lineOf(text, match.index),
      isChangedFile: changedFiles.has(relative),
      name,
      normalizedName: normalizeIdentityName(name),
      id,
      slug,
      barcode,
      detectedValue: block.replace(/\s+/g, ' ').slice(0, 240),
    });
  }
  return identities;
}

function firstField(block, keys) {
  for (const key of keys) {
    const quoted = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]([^'"]{1,120})['"]`, 'i').exec(block);
    if (quoted) return quoted[1].trim();
    const bare = new RegExp(`['"]?${key}['"]?\\s*:\\s*([A-Za-z0-9_-]{1,120})`, 'i').exec(block);
    if (bare) return bare[1].trim();
  }
  return '';
}

function addIdentityConflictFindings(findings, identities, serviceById) {
  const byName = new Map();
  const byId = new Map();
  const bySlugOrBarcode = new Map();

  for (const identity of identities) {
    if (identity.normalizedName) pushMap(byName, `${identity.service}:${identity.normalizedName}`, identity);
    if (identity.id) pushMap(byId, `${identity.service}:${identity.id}`, identity);
    if (identity.slug) pushMap(bySlugOrBarcode, `${identity.service}:slug:${identity.slug}`, identity);
    if (identity.barcode) pushMap(bySlugOrBarcode, `${identity.service}:barcode:${identity.barcode}`, identity);
  }

  for (const group of byName.values()) {
    const ids = new Set(group.map((item) => item.id).filter(Boolean));
    if (group.length > 1 && ids.size > 1) {
      for (const item of group) {
        const service = serviceById.get(item.service);
        const severity = item.isChangedFile ? 'FAIL' : 'WARN';
        findings.push(makeFinding({
          service,
          file: item.file,
          line: item.line,
          severity,
          status: classifyStatus(severity),
          pattern: 'same_name_different_ids',
          reason: 'Similar Arabic/English identity names appear with different ids across frontend files.',
          detectedValue: item.detectedValue,
          remediation: service.remediationTemplate,
          immediateCorrection: 'Use one canonical entity id/reference from the service data root instead of redefining the identity in each surface.',
          isChangedFile: item.isChangedFile,
        }));
      }
    }
  }

  for (const group of byId.values()) {
    const names = new Set(group.map((item) => item.normalizedName).filter(Boolean));
    if (group.length > 1 && names.size > 1) {
      for (const item of group) {
        const service = serviceById.get(item.service);
        const severity = item.isChangedFile ? 'FAIL' : 'WARN';
        findings.push(makeFinding({
          service,
          file: item.file,
          line: item.line,
          severity,
          status: classifyStatus(severity),
          pattern: 'same_id_different_names',
          reason: 'The same id appears with different names, which can split demo identity across surfaces.',
          detectedValue: item.detectedValue,
          remediation: service.remediationTemplate,
          immediateCorrection: 'Normalize the identity in canonical service fixture data and consume it through shared ids/references.',
          isChangedFile: item.isChangedFile,
        }));
      }
    }
  }

  for (const group of bySlugOrBarcode.values()) {
    const names = new Set(group.map((item) => item.normalizedName).filter(Boolean));
    const ids = new Set(group.map((item) => item.id).filter(Boolean));
    if (group.length > 1 && (names.size > 1 || ids.size > 1)) {
      for (const item of group) {
        const service = serviceById.get(item.service);
        const severity = item.isChangedFile ? 'FAIL' : 'WARN';
        findings.push(makeFinding({
          service,
          file: item.file,
          line: item.line,
          severity,
          status: classifyStatus(severity),
          pattern: 'slug_or_barcode_conflict',
          reason: 'A slug, sku, or barcode maps to different names or ids across frontend fixtures.',
          detectedValue: item.detectedValue,
          remediation: service.remediationTemplate,
          immediateCorrection: 'Keep slugs, skus, and barcodes in canonical service data and reference them instead of redefining them locally.',
          isChangedFile: item.isChangedFile,
        }));
      }
    }
  }
}

function pushMap(map, key, value) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function scanFile({ text, relative, service, config, changedFiles }) {
  const findings = [];
  const isChangedFile = changedFiles.has(relative);
  const isAllowedFixture = isAllowedFixtureFile(relative, service);
  const isSurface = isSurfaceFile(relative, service, config);
  const isTestFixture = isTestFixtureFile(relative, config);
  const demoTerms = new RegExp(config.demoTermsPattern, 'i');
  const entityTerms = new RegExp(config.entityTermsPattern, 'i');
  const forbiddenLocalMockPatterns = compilePatterns(service.forbiddenLocalMockPatterns);
  const hasDemoIdentitySignal = forbiddenLocalMockPatterns.length > 0
    ? forbiddenLocalMockPatterns.every((regex) => regex.test(text))
    : demoTerms.test(text) && entityTerms.test(text);

  if (hasDemoIdentitySignal && !isAllowedFixture) {
    const severity = classifySeverity(isChangedFile, isTestFixture);
    findings.push(makeFinding({
      service,
      file: relative,
      line: firstSignalLine(text, [demoTerms, entityTerms]),
      severity,
      status: classifyStatus(severity),
      pattern: 'local_mock_or_fixture_identity',
      reason: 'Frontend file contains mock/fixture/demo identity terms outside the configured canonical fixture owner.',
      detectedValue: compact(lineText(text, firstSignalLine(text, [demoTerms, entityTerms]))),
      remediation: service.remediationTemplate,
      immediateCorrection: 'Replace local demo objects with ids/references from canonical service fixture data through an adapter or view model.',
      isChangedFile,
    }));
  }

  if (isSurface && hasDemoIdentitySignal && !hasCanonicalDataReference(text, service)) {
    const severity = classifySeverity(isChangedFile, isTestFixture);
    findings.push(makeFinding({
      service,
      file: relative,
      line: firstSignalLine(text, [demoTerms, entityTerms]),
      severity,
      status: classifyStatus(severity),
      pattern: 'surface_fixture_without_canonical_data_reference',
      reason: 'Surface-owned frontend file appears to define demo service identity without a clear canonical data reference.',
      detectedValue: compact(lineText(text, firstSignalLine(text, [demoTerms, entityTerms]))),
      remediation: service.remediationTemplate,
      immediateCorrection: 'Move the entity definition to canonical service fixture data and keep the surface limited to view-model consumption.',
      isChangedFile,
    }));
  }

  const mediaRegex = new RegExp(config.mediaReferencePattern, 'gi');
  let mediaMatch;
  while ((mediaMatch = mediaRegex.exec(text))) {
    const value = toPosix(mediaMatch[1]);
    const context = text.slice(Math.max(0, mediaMatch.index - 180), mediaMatch.index + 220);
    if (!/(media|image|img|asset|photo|logo|banner|fixture|demo|mock|sample|seed)/i.test(context)) continue;
    if (isAllowedMediaReference(value, relative, service)) continue;
    const severity = classifySeverity(isChangedFile, isTestFixture);
    findings.push(makeFinding({
      service,
      file: relative,
      line: lineOf(text, mediaMatch.index),
      severity,
      status: classifyStatus(severity),
      pattern: 'non_canonical_demo_media_reference',
      reason: 'Demo/service media reference points outside the configured canonical media root.',
      detectedValue: value,
      remediation: service.remediationTemplate,
      immediateCorrection: 'Reference canonical media by service-owned path or id; do not add local surface image paths for demo fixtures.',
      isChangedFile,
    }));
  }

  const inlineData = detectLargeInlineData(text, config);
  if (inlineData && !isAllowedFixture) {
    const severity = classifySeverity(isChangedFile, isTestFixture);
    findings.push(makeFinding({
      service,
      file: relative,
      line: inlineData.line,
      severity,
      status: classifyStatus(severity),
      pattern: 'large_inline_frontend_fixture_data',
      reason: 'Large object/array-style demo data appears inside frontend code instead of canonical service data.',
      detectedValue: inlineData.detectedValue,
      remediation: service.remediationTemplate,
      immediateCorrection: 'Store full fixture data centrally and pass lean summaries or ids to screens/surfaces.',
      isChangedFile,
    }));
  }

  return findings;
}

function firstSignalLine(text, patterns) {
  let best = null;
  for (const regex of patterns) {
    regex.lastIndex = 0;
    const match = regex.exec(text);
    if (match) best = best === null ? match.index : Math.min(best, match.index);
  }
  return best === null ? null : lineOf(text, best);
}

function compact(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function detectLargeInlineData(text, config) {
  const identityToken = new RegExp(config.entityTermsPattern, 'ig');
  const declarationRegex = /\b(?:const|let|var)\s+[A-Za-z0-9_$]*(?:mock|fixture|demo|sample|seed|product|category|store|branch|service)[A-Za-z0-9_$]*\s*=\s*(\[[\s\S]{0,12000}?\]|\{[\s\S]{0,12000}?\})/gi;
  let match;
  while ((match = declarationRegex.exec(text))) {
    const block = match[0];
    const lineSpan = block.split(/\r?\n/).length;
    if (lineSpan > (config.largeInlineDataMaxLineSpan ?? 120)) continue;
    const hits = [...block.matchAll(identityToken)].length;
    if (hits >= (config.largeInlineDataMinIdentityHits ?? 5)) {
      return {
        line: lineOf(text, match.index),
        detectedValue: compact(block.slice(0, 320)),
      };
    }
  }
  return null;
}

function buildMarkdown(output, config, pathFindings) {
  const lines = [];
  lines.push('# Repo-wide Service Frontend Fixture & Media Identity Consistency Guard');
  lines.push('');
  lines.push(`status: ${output.status}`);
  lines.push(`severity: ${output.severity}`);
  lines.push(`mode: ${output.mode}`);
  lines.push('');
  lines.push('## Services Scanned');
  lines.push('');
  lines.push(`servicesScanned: ${output.summary.servicesScanned}`);
  lines.push(`filesScanned: ${output.summary.filesScanned}`);
  lines.push(`findingsTotal: ${output.summary.findingsTotal}`);
  lines.push(`failCount: ${output.summary.failCount}`);
  lines.push(`warnCount: ${output.summary.warnCount}`);
  lines.push(`tbdPathCount: ${output.summary.tbdPathCount}`);
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  if (output.findings.length === 0) {
    lines.push('No findings.');
  } else {
    lines.push('| Severity | Status | Service | File | Line | Pattern | Changed | Reason |');
    lines.push('|---|---|---|---|---:|---|---|---|');
    for (const finding of output.findings) {
      lines.push(`| ${md(finding.severity)} | ${md(finding.status)} | ${md(finding.service)} | ${md(finding.file)} | ${finding.line ?? ''} | ${md(finding.pattern)} | ${finding.isChangedFile ? 'true' : 'false'} | ${md(finding.reason)} |`);
    }
  }
  lines.push('');
  lines.push('## TBD_UNVERIFIED_PATH');
  lines.push('');
  if (pathFindings.length === 0) {
    lines.push('No TBD path findings.');
  } else {
    lines.push('| Service | Path | Kind | Immediate correction |');
    lines.push('|---|---|---|---|');
    for (const finding of pathFindings) {
      lines.push(`| ${md(finding.service)} | ${md(finding.detectedValue)} | ${md(finding.pattern)} | ${md(finding.immediateCorrection)} |`);
    }
  }
  lines.push('');
  lines.push('## Immediate Corrections');
  lines.push('');
  if (output.remediation.length === 0) {
    lines.push('No immediate corrections required.');
  } else {
    for (const item of output.remediation) lines.push(`- ${item}`);
  }
  lines.push('');
  lines.push('## Canonical Ownership Map');
  lines.push('');
  lines.push('| Service | Service root | Canonical data root | Data status | Canonical media root | Media status |');
  lines.push('|---|---|---|---|---|---|');
  for (const service of config.serviceFixtureOwnershipMap ?? []) {
    lines.push(`| ${md(service.serviceId)} | ${md(service.serviceRoot)} | ${md(service.canonicalDataRoot)} | ${md(service.canonicalDataStatus)} | ${md(service.canonicalMediaRoot)} | ${md(service.canonicalMediaStatus)} |`);
  }
  lines.push('');
  lines.push('## False Positive Policy');
  lines.push('');
  lines.push('- Clear internal test fixtures are INFO or WARN unless a changed file adds frontend demo service identity drift.');
  lines.push('- Overrides must be recorded in this config, not as ad hoc code comments.');
  lines.push('- The guard is read-only and reports remediation paths; it does not create, move, rename, delete, or rewrite service files.');
  lines.push('');
  return lines.join('\n');
}

function md(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

const args = parseArgs();
const root = args.root;
const configPath = path.join(root, 'tools/guards/guard-service-frontend-fixture-media-identity.config.json');
const config = readJson(configPath);
const changedFiles = getChangedFiles(root);
const findings = [];
const remediation = new Set();
const serviceById = new Map();
const allIdentities = [];
let filesScanned = 0;

for (const service of config.serviceFixtureOwnershipMap ?? []) {
  serviceById.set(service.serviceId, service);

  if (!fs.existsSync(path.join(root, service.serviceRoot))) {
    findings.push(expectedPathFinding(service, service.serviceRoot, 'service_root'));
    continue;
  }
  if (!fs.existsSync(path.join(root, service.canonicalDataRoot))) {
    findings.push(expectedPathFinding(service, service.canonicalDataRoot, 'canonical_data'));
  }
  if (!fs.existsSync(path.join(root, service.canonicalMediaRoot))) {
    findings.push(expectedPathFinding(service, service.canonicalMediaRoot, 'canonical_media'));
  }

  const files = walkFiles(root, service.frontendScanRoots ?? [], config);
  for (const file of files) {
    const relative = rel(root, file);
    if (isSkipped(relative, config)) continue;
    filesScanned += 1;
    let text = '';
    try {
      text = readText(file);
    } catch {
      continue;
    }
    const fileFindings = scanFile({ text, relative, service, config, changedFiles });
    for (const finding of fileFindings) findings.push(finding);
    allIdentities.push(...extractIdentities(text, relative, service, changedFiles));
  }
}

addIdentityConflictFindings(findings, allIdentities, serviceById);

for (const finding of findings) {
  remediation.add(`${finding.service}: ${finding.immediateCorrection}`);
}

const failCount = findings.filter((finding) => finding.severity === 'FAIL').length;
const warnCount = findings.filter((finding) => finding.severity === 'WARN').length;
const infoCount = findings.filter((finding) => finding.severity === 'INFO').length;
const tbdPathCount = findings.filter((finding) => finding.status === 'TBD_UNVERIFIED_PATH').length;
const status = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';
const severity = failCount > 0 ? OUTPUT_SEVERITY_BLOCKING : OUTPUT_SEVERITY_REPORT;
const pathFindings = findings.filter((finding) => finding.status === 'TBD_UNVERIFIED_PATH');

const output = {
  guardId: GUARD_ID,
  status,
  severity,
  mode: 'CHECK',
  summary: {
    servicesScanned: (config.serviceFixtureOwnershipMap ?? []).length,
    filesScanned,
    findingsTotal: findings.length,
    failCount,
    warnCount,
    tbdPathCount,
  },
  findings,
  remediation: [...remediation],
  evidenceFiles: [],
  failCount,
  warnCount,
  infoCount,
};

writeFile(args.jsonOut, JSON.stringify(output, null, 2));
writeFile(args.mdOut, buildMarkdown(output, config, pathFindings));

console.log(`${GUARD_ID}: ${status} (fail=${failCount}, warn=${warnCount}, info=${infoCount})`);
if (failCount > 0) process.exitCode = 1;

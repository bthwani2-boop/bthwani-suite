import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), mode: 'CHECK', evidenceDir: '', jsonOut: '', mdOut: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--root') args.root = argv[++i];
    else if (token === '--mode') args.mode = argv[++i];
    else if (token === '--evidence-dir') args.evidenceDir = argv[++i];
    else if (token === '--json-out') args.jsonOut = argv[++i];
    else if (token === '--md-out') args.mdOut = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token.startsWith('--mode=')) args.mode = token.slice('--mode='.length);
    else if (token.startsWith('--evidence-dir=')) args.evidenceDir = token.slice('--evidence-dir='.length);
    else if (token.startsWith('--json-out=')) args.jsonOut = token.slice('--json-out='.length);
    else if (token.startsWith('--md-out=')) args.mdOut = token.slice('--md-out='.length);
    else throw new Error(`Unknown argument: ${token}`);
  }
  args.root = path.resolve(args.root);
  if (args.evidenceDir) args.evidenceDir = path.resolve(args.root, args.evidenceDir);
  if (args.jsonOut) args.jsonOut = path.resolve(args.root, args.jsonOut);
  if (args.mdOut) args.mdOut = path.resolve(args.root, args.mdOut);
  return args;
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function writeFile(filePath, content) {
  if (!filePath) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function rel(root, filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function normalizePath(value) {
  return String(value ?? '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\.\.\/media-fixtures\//, '')
    .replace(/^\/dsh\/media-fixtures\//, '')
    .trim();
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function walkFiles(root, startRelative, extensions) {
  const start = path.join(root, startRelative);
  const files = [];
  if (!fs.existsSync(start)) return files;
  const skip = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.expo', '.turbo', '.nx', 'legacy-preview']);
  function walk(current) {
    const relative = rel(root, current);
    if (relative.startsWith('tools/registry/runs/')) return;
    const parts = relative.split('/');
    if (parts.some((part) => skip.has(part))) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === 'resolve-dsh-image-source.ts' || entry.name === 'resolve-dsh-public-media-path.ts') continue;
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!entry.isFile()) continue;
      if (extensions.has(path.extname(entry.name).toLowerCase())) files.push(abs);
    }
  }
  walk(start);
  return files;
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function toCsv(rows, columns) {
  return `${[columns.join(','), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(','))].join('\n')}\n`;
}

function addIssue(issues, severity, id, type, filePath, evidence, requiredFix) {
  issues.push({ severity, id, type, path: filePath, evidence, requiredFix });
}

const args = parseArgs();
const root = args.root;
const evidenceDir = args.evidenceDir;

const manifestPath = 'dsh/frontend/media-fixtures/MANIFEST.local-required.tsv';
const rnResolverPath = 'dsh/frontend/shared/resolve-dsh-image-source.ts';
const webResolverPath = 'dsh/frontend/shared/resolve-dsh-public-media-path.ts';
const dataRoot = 'dsh/frontend/data';
const frontendRoot = 'dsh/frontend';

for (const required of [manifestPath, rnResolverPath, webResolverPath, dataRoot, 'dsh/frontend/media-fixtures']) {
  if (!fs.existsSync(path.join(root, required))) throw new Error(`Required path missing: ${required}`);
}

const issues = [];
const infos = [];

const manifestRows = [];
const manifestLines = readText(path.join(root, manifestPath)).split(/\r?\n/);
for (let i = 1; i < manifestLines.length; i += 1) {
  const line = manifestLines[i].trim();
  if (!line) continue;
  const [mediaKey, relativePath] = line.split('\t');
  if (!mediaKey || !relativePath) {
    addIssue(issues, 'FAIL', `MANIFEST_PARSE_${i + 1}`, 'manifest', manifestPath, `line ${i + 1}: ${line}`, 'Fix TSV row to mediaKey<TAB>relativePath.');
    continue;
  }
  manifestRows.push({ mediaKey: mediaKey.trim(), relativePath: normalizePath(relativePath), line: i + 1 });
}

const manifestByKey = new Map();
for (const row of manifestRows) {
  if (manifestByKey.has(row.mediaKey)) {
    addIssue(issues, 'FAIL', `MANIFEST_DUPLICATE_${row.mediaKey}`, 'manifest', manifestPath, `duplicate at line ${row.line}`, 'Keep exactly one canonical manifest row per mediaKey.');
  } else {
    manifestByKey.set(row.mediaKey, row);
  }
}

const rnRows = [];
{
  const text = readText(path.join(root, rnResolverPath));
  const pattern = /["'](?<key>dsh\.[^"']+)["']\s*:\s*require\(["'](?<relativePath>[^"']+)["']\)/g;
  for (const match of text.matchAll(pattern)) {
    rnRows.push({ resolver: 'react-native', mediaKey: match.groups.key, relativePath: normalizePath(match.groups.relativePath), path: rnResolverPath, line: lineNumber(text, match.index), coverage: 'explicit' });
  }
}

const webRows = [];
{
  const text = readText(path.join(root, webResolverPath));
  const explicitPattern = /["'](?<key>dsh\.[^"']+)["']\s*:\s*["'](?<relativePath>[^"']+)["']/g;
  for (const match of text.matchAll(explicitPattern)) {
    webRows.push({ resolver: 'web-public', mediaKey: match.groups.key, relativePath: normalizePath(match.groups.relativePath), path: webResolverPath, line: lineNumber(text, match.index), coverage: 'explicit' });
  }

  const supportsCategoryMain = text.includes("startsWith('dsh.category.main.')") || text.includes('startsWith("dsh.category.main.")');
  const supportsCategorySub = text.includes("startsWith('dsh.category.sub.')") || text.includes('startsWith("dsh.category.sub.")');
  const supportsBanner = text.includes("startsWith('dsh.banner.home.')") || text.includes('startsWith("dsh.banner.home.")');

  for (const row of manifestRows) {
    if (supportsCategoryMain && row.mediaKey.startsWith('dsh.category.main.')) {
      const id = row.mediaKey.slice('dsh.category.main.'.length).replace('.v1', '');
      webRows.push({ resolver: 'web-public', mediaKey: row.mediaKey, relativePath: `legacy-preview/categories/main/dsh-category-main-${id}-v1.png`, path: webResolverPath, line: 0, coverage: 'pattern' });
    }
    if (supportsCategorySub && row.mediaKey.startsWith('dsh.category.sub.')) {
      const id = row.mediaKey.slice('dsh.category.sub.'.length).replace('.v1', '');
      webRows.push({ resolver: 'web-public', mediaKey: row.mediaKey, relativePath: `legacy-preview/categories/sub/dsh-category-sub-${id}-v1.png`, path: webResolverPath, line: 0, coverage: 'pattern' });
    }
    if (supportsBanner && row.mediaKey.startsWith('dsh.banner.home.')) {
      const slug = row.mediaKey.replace('dsh.banner.home.', '').replace('.v1', '');
      webRows.push({ resolver: 'web-public', mediaKey: row.mediaKey, relativePath: `legacy-preview/banners/dsh-banner-home-${slug}-v1.png`, path: webResolverPath, line: 0, coverage: 'pattern' });
    }
  }
}

const rnByKey = new Map(rnRows.map((row) => [row.mediaKey, row]));
const webByKey = new Map(webRows.map((row) => [row.mediaKey, row]));

const sourceRefs = [];
const dshKeyPattern = /["'](?<key>dsh\.[A-Za-z0-9_.-]+\.v1)["']/g;
const scanRoots = ['dsh/frontend', 'app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel'];
for (const scanRoot of scanRoots) {
  for (const file of walkFiles(root, scanRoot, new Set(['.ts', '.tsx', '.js', '.jsx']))) {
    const fileRel = rel(root, file);
    const text = readText(file);
    for (const match of text.matchAll(dshKeyPattern)) {
      sourceRefs.push({ mediaKey: match.groups.key, path: fileRel, line: lineNumber(text, match.index) });
    }
  }
}
const sourceKeys = [...new Set(sourceRefs.map((row) => row.mediaKey))].sort();

for (const key of sourceKeys) {
  const first = sourceRefs.find((row) => row.mediaKey === key);
  if (!manifestByKey.has(key)) {
    addIssue(issues, 'FAIL', `DSH_KEY_NOT_IN_MANIFEST_${key}`, 'data/media', first.path, `${key} at line ${first.line}`, 'Use a canonical manifest mediaKey or add real manifest+resolver+asset proof.');
  }
  if (!rnByKey.has(key)) {
    addIssue(issues, 'FAIL', `DSH_KEY_NOT_IN_RN_RESOLVER_${key}`, 'adapter/media', rnResolverPath, `${key} from ${first.path}:${first.line}`, 'Add RN resolver coverage or use a covered key.');
  }
  if (!webByKey.has(key)) {
    addIssue(issues, 'FAIL', `DSH_KEY_NOT_IN_WEB_RESOLVER_${key}`, 'adapter/media', webResolverPath, `${key} from ${first.path}:${first.line}`, 'Add Web resolver coverage or use a covered key.');
  }
}

for (const row of [...rnRows, ...webRows]) {
  const manifest = manifestByKey.get(row.mediaKey);
  if (!manifest) {
    addIssue(issues, 'FAIL', `RESOLVER_KEY_NOT_IN_MANIFEST_${row.mediaKey}`, 'adapter/media', row.path, `${row.mediaKey} at line ${row.line}`, 'Remove resolver-only key or add canonical manifest row.');
    continue;
  }
  if (normalizePath(row.relativePath) !== normalizePath(manifest.relativePath)) {
    addIssue(issues, 'FAIL', `RESOLVER_PATH_MISMATCH_${row.resolver}_${row.mediaKey}`, 'adapter/media', row.path, `resolver=${row.relativePath}; manifest=${manifest.relativePath}`, 'Make resolver path match manifest path.');
  }
}

const rawPathRefs = [];
const allowedRawFiles = new Set([
  normalizePath(rnResolverPath),
  normalizePath(webResolverPath),
  'dsh/frontend/media-fixtures/README.md',
  'dsh/frontend/media-fixtures/MANIFEST.local-required.tsv',
]);
const rawPattern = /(["'`])(?:\/dsh\/media-fixtures\/|\.\.?\/media-fixtures\/)[^"'`]+?\1|require\((["'])(?:\.\.?\/media-fixtures\/)[^"']+?\2\)/g;
for (const scanRoot of scanRoots) {
  for (const file of walkFiles(root, scanRoot, new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']))) {
    const fileRel = normalizePath(rel(root, file));
    const text = readText(file);
    for (const match of text.matchAll(rawPattern)) {
      const line = lineNumber(text, match.index);
      const classification = allowedRawFiles.has(fileRel) ? 'allowed-owner' : 'leakage';
      rawPathRefs.push({ path: fileRel, line, classification, text: (text.split(/\r?\n/)[line - 1] ?? '').trim() });
      if (classification === 'leakage') {
        addIssue(issues, 'FAIL', `RAW_MEDIA_PATH_LEAK_${rawPathRefs.length}`, 'media/leakage', fileRel, `line ${line}`, 'Replace raw fixture path with mediaKey + shared resolver.');
      }
    }
  }
}

const scatteredPreviewStores = [];
for (const file of walkFiles(root, frontendRoot, new Set(['.ts', '.tsx', '.js', '.jsx']))) {
  const fileRel = rel(root, file);
  if (fileRel.startsWith('dsh/frontend/data/')) continue;
  const text = readText(file);
  const isPreviewStore = fileRel.endsWith('preview-store.ts') || fileRel.endsWith('preview-store.tsx');
  const hasSeededDemo = /\bseeded[A-Za-z0-9_]*\s*[:=]|\bSTORE_KEY\b|\bconst\s+[A-Za-z0-9_]*(Fixture|Fixtures|Preview|Data)\s*=/.test(text);
  const isAdapterOnly = /from ['"]\.\.\/data\//.test(text) && !/\bseeded[A-Za-z0-9_]*\s*[:=]|\bSTORE_KEY\b/.test(text);
  if (isPreviewStore && hasSeededDemo && !isAdapterOnly) {
    scatteredPreviewStores.push({ path: fileRel, reason: 'preview-store outside dsh/frontend/data contains seeded/local mutable preview data' });
    addIssue(issues, 'FAIL', `SCATTERED_PREVIEW_STORE_${scatteredPreviewStores.length}`, 'data/scattered', fileRel, 'preview-store owns local seeded/mutable data outside central data root', 'Move ownership to dsh/frontend/data and keep this file as adapter only.');
  }
}

const duplicateCandidates = [];
const byKey = new Map();
for (const ref of sourceRefs) {
  if (!byKey.has(ref.mediaKey)) byKey.set(ref.mediaKey, []);
  byKey.get(ref.mediaKey).push(ref);
}
for (const [key, refs] of byKey) {
  const paths = [...new Set(refs.map((row) => row.path))];
  if (refs.length > 1) {
    duplicateCandidates.push({ mediaKey: key, refCount: refs.length, paths: paths.join('|'), decision: 'INFO_ONLY_SHARED_MEDIA_OR_TASK3_ADAPTER_REVIEW' });
  }
}

for (const row of manifestRows) {
  if (!sourceKeys.includes(row.mediaKey)) {
    infos.push({ id: `MANIFEST_RESERVED_OR_UNUSED_${row.mediaKey}`, path: manifestPath, evidence: `${row.mediaKey} not directly referenced by scanned source`, note: 'Not failure; may be reserved or pattern/visual-only media.' });
  }
}

if (evidenceDir) {
  writeFile(path.join(evidenceDir, 'dsh-shared-foundations-gap-matrix.csv'), toCsv(issues, ['severity', 'id', 'type', 'path', 'evidence', 'requiredFix']));
  writeFile(path.join(evidenceDir, 'dsh-shared-foundations-source-refs.csv'), toCsv(sourceRefs, ['mediaKey', 'path', 'line']));
  writeFile(path.join(evidenceDir, 'dsh-shared-foundations-resolver-refs.csv'), toCsv([...rnRows, ...webRows], ['resolver', 'mediaKey', 'relativePath', 'path', 'line', 'coverage']));
  writeFile(path.join(evidenceDir, 'dsh-shared-foundations-raw-path-refs.csv'), toCsv(rawPathRefs, ['path', 'line', 'classification', 'text']));
  writeFile(path.join(evidenceDir, 'dsh-shared-foundations-scattered-preview-stores.csv'), toCsv(scatteredPreviewStores, ['path', 'reason']));
  writeFile(path.join(evidenceDir, 'dsh-shared-foundations-duplicate-candidates.csv'), toCsv(duplicateCandidates, ['mediaKey', 'refCount', 'paths', 'decision']));
  writeFile(path.join(evidenceDir, 'dsh-shared-foundations-manifest-keys.csv'), toCsv(manifestRows, ['mediaKey', 'relativePath', 'line']));
  writeFile(path.join(evidenceDir, 'dsh-shared-foundations-info.csv'), toCsv(infos, ['id', 'path', 'evidence', 'note']));
}

const failCount = issues.filter((issue) => issue.severity === 'FAIL').length;
const warnCount = issues.filter((issue) => issue.severity === 'WARN').length;
const status = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';

const output = {
  guardId: 'DSH-SHARED-FOUNDATIONS-FINAL',
  status,
  failCount,
  warnCount,
  infoCount: infos.length + duplicateCandidates.length,
  counts: {
    manifestKeys: manifestRows.length,
    scannedRefs: sourceRefs.length,
    scannedUniqueKeys: sourceKeys.length,
    rnResolverKeys: rnRows.length,
    webResolverKeys: webRows.length,
    rawPathRefs: rawPathRefs.length,
    scatteredPreviewStores: scatteredPreviewStores.length,
    duplicateCandidates: duplicateCandidates.length,
  },
  issues,
  infos,
  duplicateCandidates,
  generatedAt: new Date().toISOString(),
};
writeFile(args.jsonOut, JSON.stringify(output, null, 2));

const mdLines = [
  '# DSH-SHARED-FOUNDATIONS-FINAL',
  '',
  `status: ${status}`,
  `failCount: ${failCount}`,
  `warnCount: ${warnCount}`,
  `infoCount: ${output.infoCount}`,
  '',
  '| Severity | ID | Path | Evidence | Required fix |',
  '|---|---|---|---|---|',
  ...issues.map((issue) => `| ${issue.severity} | ${issue.id.replaceAll('|', '\\|')} | ${issue.path.replaceAll('|', '\\|')} | ${String(issue.evidence).replaceAll('|', '\\|')} | ${String(issue.requiredFix).replaceAll('|', '\\|')} |`),
  '',
];
writeFile(args.mdOut, mdLines.join('\n'));
console.log(`DSH-SHARED-FOUNDATIONS-FINAL: ${status} (fail=${failCount}, warn=${warnCount}, info=${output.infoCount})`);
if (failCount > 0) process.exitCode = 1;

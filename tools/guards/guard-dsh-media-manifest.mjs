import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv = process.argv.slice(2)) {
  const args = {
    root: process.cwd(),
    mode: 'CHECK',
    evidenceDir: '',
    jsonOut: '',
    mdOut: '',
  };
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

function walkFiles(root, startRelative, extensions) {
  const out = [];
  const start = path.join(root, startRelative);
  if (!fs.existsSync(start)) return out;
  const skip = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.expo', '.turbo', '.nx']);
  function walk(current) {
    const relative = rel(root, current);
    if (relative.startsWith('tools/registry/runs/')) return;
    const parts = relative.split('/');
    if (parts.some((part) => skip.has(part))) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.has(ext)) out.push(abs);
    }
  }
  walk(start);
  return out;
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function toCsv(rows, columns) {
  const lines = [columns.join(',')];
  for (const row of rows) lines.push(columns.map((column) => csvEscape(row[column])).join(','));
  return `${lines.join('\n')}\n`;
}

function addIssue(issues, severity, id, type, filePath, evidence, impact, requiredFix) {
  issues.push({ severity, id, type, path: filePath, evidence, impact, requiredFix });
}

const args = parseArgs();
const root = args.root;
const evidenceDir = args.evidenceDir;

const dataRoot = 'dsh/frontend/data';
const frontendRoot = 'dsh/frontend';
const manifestPath = 'dsh/frontend/media-fixtures/MANIFEST.local-required.tsv';
const rnResolverPath = 'dsh/frontend/shared/resolve-dsh-image-source.ts';
const webResolverPath = 'dsh/frontend/shared/resolve-dsh-public-media-path.ts';

const required = [dataRoot, manifestPath, rnResolverPath, webResolverPath];
for (const item of required) {
  if (!fs.existsSync(path.join(root, item))) throw new Error(`Required path missing: ${item}`);
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
    addIssue(issues, 'FAIL', `MANIFEST_PARSE_${i + 1}`, 'manifest', manifestPath, `line ${i + 1}: ${line}`, 'Manifest row is not parseable.', 'Use mediaKey<TAB>relativePath.');
    continue;
  }
  manifestRows.push({ mediaKey: mediaKey.trim(), relativePath: normalizePath(relativePath), line: i + 1 });
}

const manifestByKey = new Map();
for (const row of manifestRows) {
  if (manifestByKey.has(row.mediaKey)) {
    addIssue(issues, 'FAIL', `MANIFEST_DUPLICATE_${row.mediaKey}`, 'manifest', manifestPath, `duplicate key at line ${row.line}`, 'Duplicate media identity.', 'Keep one canonical manifest row.');
  } else {
    manifestByKey.set(row.mediaKey, row);
  }
}

const dataRefs = [];
const dataSeen = new Set();
const fieldPattern = /(?<field>mediaKey|imageUri|imageUrl|thumbnail|thumbnailUrl)\s*:\s*["'](?<key>dsh\.[^"']+)["']/g;
const stringPattern = /["'](?<key>dsh\.[A-Za-z0-9_.-]+\.v1)["']/g;

for (const file of walkFiles(root, dataRoot, new Set(['.ts', '.tsx', '.js', '.jsx']))) {
  const fileRel = rel(root, file);
  const text = readText(file);
  for (const match of text.matchAll(fieldPattern)) {
    const line = lineNumber(text, match.index);
    const row = { source: 'data-field', field: match.groups.field, mediaKey: match.groups.key, path: fileRel, line };
    const sig = `${row.source}|${row.field}|${row.mediaKey}|${row.path}|${row.line}`;
    if (!dataSeen.has(sig)) {
      dataSeen.add(sig);
      dataRefs.push(row);
    }
  }
  for (const match of text.matchAll(stringPattern)) {
    const line = lineNumber(text, match.index);
    const row = { source: 'data-string', field: 'stringLiteral', mediaKey: match.groups.key, path: fileRel, line };
    const sig = `${row.source}|${row.field}|${row.mediaKey}|${row.path}|${row.line}`;
    if (!dataSeen.has(sig)) {
      dataSeen.add(sig);
      dataRefs.push(row);
    }
  }
}

function parseRnResolver() {
  const rows = [];
  const text = readText(path.join(root, rnResolverPath));
  const pattern = /["'](?<key>dsh\.[^"']+)["']\s*:\s*require\(["'](?<relativePath>[^"']+)["']\)/g;
  for (const match of text.matchAll(pattern)) {
    rows.push({
      resolver: 'react-native',
      mediaKey: match.groups.key,
      relativePath: normalizePath(match.groups.relativePath),
      path: rnResolverPath,
      line: lineNumber(text, match.index),
      coverage: 'explicit',
    });
  }
  return rows;
}

function parseWebResolver() {
  const rows = [];
  const text = readText(path.join(root, webResolverPath));
  const pattern = /["'](?<key>dsh\.[^"']+)["']\s*:\s*["'](?<relativePath>[^"']+)["']/g;
  for (const match of text.matchAll(pattern)) {
    rows.push({
      resolver: 'web-public',
      mediaKey: match.groups.key,
      relativePath: normalizePath(match.groups.relativePath),
      path: webResolverPath,
      line: lineNumber(text, match.index),
      coverage: 'explicit',
    });
  }

  const supportsCategoryMain = text.includes("startsWith('dsh.category.main.')") || text.includes('startsWith("dsh.category.main.")');
  const supportsCategorySub = text.includes("startsWith('dsh.category.sub.')") || text.includes('startsWith("dsh.category.sub.")');
  const supportsBanner = text.includes("startsWith('dsh.banner.home.')") || text.includes('startsWith("dsh.banner.home.")');

  for (const row of manifestRows) {
    let relativePath = '';
    if (supportsCategoryMain && row.mediaKey.startsWith('dsh.category.main.')) {
      const id = row.mediaKey.slice('dsh.category.main.'.length).replace('.v1', '');
      relativePath = `categories/main/dsh-category-main-${id}-v1.png`;
    } else if (supportsCategorySub && row.mediaKey.startsWith('dsh.category.sub.')) {
      const id = row.mediaKey.slice('dsh.category.sub.'.length).replace('.v1', '');
      relativePath = `categories/sub/dsh-category-sub-${id}-v1.png`;
    } else if (supportsBanner && row.mediaKey.startsWith('dsh.banner.home.')) {
      const slug = row.mediaKey.replace('dsh.banner.home.', '').replace('.v1', '');
      relativePath = `banners/dsh-banner-home-${slug}-v1.png`;
    }

    if (relativePath) {
      rows.push({
        resolver: 'web-public',
        mediaKey: row.mediaKey,
        relativePath,
        path: webResolverPath,
        line: 0,
        coverage: 'pattern',
      });
    }
  }

  return rows;
}

const rnRows = parseRnResolver();
const webRows = parseWebResolver();
const resolverRows = [...rnRows, ...webRows];

const rnByKey = new Map(rnRows.map((row) => [row.mediaKey, row]));
const webByKey = new Map(webRows.map((row) => [row.mediaKey, row]));
const dataKeys = [...new Set(dataRefs.map((row) => row.mediaKey))].sort();

for (const key of dataKeys) {
  const occurrence = dataRefs.find((row) => row.mediaKey === key);
  if (!manifestByKey.has(key)) {
    addIssue(issues, 'FAIL', `DATA_KEY_NOT_IN_MANIFEST_${key}`, 'data/media', occurrence.path, `${occurrence.field}=${key} at line ${occurrence.line}`, 'Central data references undeclared media identity.', 'Use an existing canonical mediaKey or add a manifest row with a real asset.');
  }
  if (!rnByKey.has(key)) {
    addIssue(issues, 'FAIL', `DATA_KEY_NOT_IN_RN_RESOLVER_${key}`, 'adapter/media', rnResolverPath, `${key} from ${occurrence.path}:${occurrence.line}`, 'RN/mobile surfaces may fail to render fixture image.', 'Add RN resolver coverage or use an existing covered mediaKey.');
  }
  if (!webByKey.has(key)) {
    addIssue(issues, 'FAIL', `DATA_KEY_NOT_IN_WEB_RESOLVER_${key}`, 'adapter/media', webResolverPath, `${key} from ${occurrence.path}:${occurrence.line}`, 'Web/control-panel surfaces may fail to render fixture image.', 'Add web resolver coverage or use an existing covered mediaKey.');
  }
}

for (const row of resolverRows) {
  const manifest = manifestByKey.get(row.mediaKey);
  if (!manifest) {
    addIssue(issues, 'FAIL', `RESOLVER_KEY_NOT_IN_MANIFEST_${row.mediaKey}`, 'adapter/media', row.path, `${row.resolver} resolver key at line ${row.line}`, 'Resolver has undeclared media identity.', 'Add manifest row or remove resolver-only key.');
    continue;
  }
  if (normalizePath(row.relativePath) !== normalizePath(manifest.relativePath)) {
    addIssue(issues, 'FAIL', `RESOLVER_PATH_MISMATCH_${row.resolver}_${row.mediaKey}`, 'adapter/media', row.path, `${row.mediaKey}: resolver=${row.relativePath}, manifest=${manifest.relativePath}`, 'Same key resolves to different assets.', 'Make resolver path match manifest.');
  }
}

for (const row of manifestRows) {
  if (!dataKeys.includes(row.mediaKey)) {
    infos.push({
      id: `MANIFEST_RESERVED_OR_UNUSED_${row.mediaKey}`,
      type: 'media',
      path: manifestPath,
      evidence: `${row.mediaKey} exists in manifest but is not directly referenced by dsh/frontend/data`,
      note: 'Not a failure. May be reserved, resolver-only, brand, or generated-derived media.',
    });
  }
}

const rawPathRefs = [];
const allowedRawPathFiles = new Set([
  normalizePath(rnResolverPath),
  normalizePath(webResolverPath),
  normalizePath('dsh/frontend/media-fixtures/README.md'),
  normalizePath('dsh/frontend/media-fixtures/MANIFEST.local-required.tsv'),
]);

const literalRawPathPattern = /(["'`])(?:\/dsh\/media-fixtures\/|\.\.?\/media-fixtures\/)[^"'`]+?\1|require\((["'])(?:\.\.?\/media-fixtures\/)[^"']+?\2\)/g;
for (const file of walkFiles(root, frontendRoot, new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']))) {
  const fileRel = normalizePath(rel(root, file));
  const text = readText(file);
  for (const match of text.matchAll(literalRawPathPattern)) {
    const line = lineNumber(text, match.index);
    const lineText = text.split(/\r?\n/)[line - 1]?.trim() ?? '';
    const classification = allowedRawPathFiles.has(fileRel) ? 'allowed-owner' : 'leakage';
    rawPathRefs.push({ path: fileRel, line, classification, text: lineText });
    if (classification === 'leakage') {
      addIssue(issues, 'WARN', `RAW_MEDIA_PATH_LEAK_${rawPathRefs.length}`, 'media/leakage', fileRel, `line ${line}: ${lineText}`, 'Consumer bypasses mediaKey resolver.', 'Replace raw fixture path with mediaKey + shared resolver.');
    }
  }
}

const duplicateRows = [];
const byKey = new Map();
for (const ref of dataRefs.filter((row) => row.source === 'data-field')) {
  if (!byKey.has(ref.mediaKey)) byKey.set(ref.mediaKey, []);
  byKey.get(ref.mediaKey).push(ref);
}
for (const [key, refs] of byKey) {
  if (refs.length <= 1) continue;
  duplicateRows.push({
    mediaKey: key,
    refCount: refs.length,
    paths: [...new Set(refs.map((row) => row.path))].join('|'),
    lines: refs.map((row) => `${row.path}:${row.line}`).join('|'),
    decision: 'INFO_ONLY_TASK3_CANDIDATE',
  });
}

if (evidenceDir) {
  writeFile(path.join(evidenceDir, 'dsh-media-manifest-gap-matrix.csv'), toCsv(issues, ['severity', 'id', 'type', 'path', 'evidence', 'impact', 'requiredFix']));
  writeFile(path.join(evidenceDir, 'dsh-media-manifest-info.csv'), toCsv(infos, ['id', 'type', 'path', 'evidence', 'note']));
  writeFile(path.join(evidenceDir, 'dsh-media-manifest-data-refs.csv'), toCsv(dataRefs, ['source', 'field', 'mediaKey', 'path', 'line']));
  writeFile(path.join(evidenceDir, 'dsh-media-manifest-resolver-refs.csv'), toCsv(resolverRows, ['resolver', 'mediaKey', 'relativePath', 'path', 'line', 'coverage']));
  writeFile(path.join(evidenceDir, 'dsh-media-manifest-raw-path-refs.csv'), toCsv(rawPathRefs, ['path', 'line', 'classification', 'text']));
  writeFile(path.join(evidenceDir, 'dsh-media-manifest-duplicate-candidates.csv'), toCsv(duplicateRows, ['mediaKey', 'refCount', 'paths', 'lines', 'decision']));
  writeFile(path.join(evidenceDir, 'dsh-media-manifest-manifest-keys.csv'), toCsv(manifestRows, ['mediaKey', 'relativePath', 'line']));
}

const failCount = issues.filter((issue) => issue.severity === 'FAIL').length;
const warnCount = issues.filter((issue) => issue.severity === 'WARN').length;
const status = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';
const output = {
  guardId: 'DSH-MEDIA-MANIFEST',
  status,
  failCount,
  warnCount,
  infoCount: infos.length + duplicateRows.length,
  counts: {
    manifestKeys: manifestRows.length,
    dataRefs: dataRefs.length,
    dataUniqueKeys: dataKeys.length,
    rnResolverKeys: rnRows.length,
    webResolverKeys: webRows.length,
    rawPathRefs: rawPathRefs.length,
    duplicateCandidates: duplicateRows.length,
  },
  issues,
  infos,
  duplicateRows,
  generatedAt: new Date().toISOString(),
};

writeFile(args.jsonOut, JSON.stringify(output, null, 2));

const md = [
  '# DSH-MEDIA-MANIFEST',
  '',
  `status: ${output.status}`,
  `failCount: ${output.failCount}`,
  `warnCount: ${output.warnCount}`,
  `infoCount: ${output.infoCount}`,
  '',
  '| Severity | ID | Path | Evidence | Required fix |',
  '|---|---|---|---|---|',
  ...issues.map((issue) => `| ${issue.severity} | ${issue.id.replaceAll('|', '\\|')} | ${issue.path.replaceAll('|', '\\|')} | ${String(issue.evidence).replaceAll('|', '\\|')} | ${String(issue.requiredFix).replaceAll('|', '\\|')} |`),
  '',
].join('\n');
writeFile(args.mdOut, md);

console.log(`DSH-MEDIA-MANIFEST: ${status} (fail=${failCount}, warn=${warnCount}, info=${output.infoCount})`);
if (failCount > 0) process.exitCode = 1;
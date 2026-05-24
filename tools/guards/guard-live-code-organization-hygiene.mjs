import path from 'node:path';
import fs from 'node:fs';
import {
  parseArgs,
  createReport,
  finalize,
  walkFiles,
  readText,
  readJson,
  rel,
  CODE_EXTENSIONS,
  isProbablyGeneratedPath,
} from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const configPath = path.join(root, 'tools/guards/guard-live-code-organization-hygiene.config.json');
const config = readJson(configPath);

const report = createReport('GUARD_LIVE_CODE_ORGANIZATION_HYGIENE', [
  'governance/03_REPO_BOUNDARIES.md',
  'governance/14_GUARDS_CATALOG.md',
]);

const scatterBuckets = new Set((config.scatterBuckets ?? []).map((s) => String(s).toLowerCase()));
const oldTempNamingPatterns = config.oldTempNamingPatterns ?? [];
const largeFileSizeBytes = config.largeFileSizeBytes ?? 30000;
const tinyFileSizeBytes = config.tinyFileSizeBytes ?? 80;
const skipDirs = new Set(config.skipDirs ?? []);
const skipRelativePatterns = config.skipRelativePatterns ?? [];
const allowedScatterRoots = config.allowedScatterRoots ?? [];

const CODE_AND_MD_EXTENSIONS = new Set([...CODE_EXTENSIONS, '.md', '.mdx']);

function shouldSkipPath(relative) {
  if (isProbablyGeneratedPath(relative)) return true;
  if (skipRelativePatterns.some((p) => relative.includes(p))) return true;
  const parts = relative.split('/');
  for (const part of parts) {
    if (skipDirs.has(part)) return true;
  }
  return false;
}

function isAllowedScatterRoot(relative) {
  return allowedScatterRoots.some(
    (allowed) => relative === allowed || relative.startsWith(allowed + '/')
  );
}

// ── 1. Ambiguous scatter buckets ───────────────────────────────────────────────
// Detect directories whose basename is a vague shared/common/utils name and that
// contain more than one file (i.e. they are real accumulation buckets, not a
// deliberate single-file util module).
const scannedScatterDirs = new Set();

function checkScatterDir(absDir) {
  const relative = rel(root, absDir);
  if (shouldSkipPath(relative)) return;
  if (isAllowedScatterRoot(relative)) return;
  if (scannedScatterDirs.has(relative)) return;
  scannedScatterDirs.add(relative);

  const basename = path.basename(absDir).toLowerCase();
  if (!scatterBuckets.has(basename)) return;

  let fileCount = 0;
  try {
    const entries = fs.readdirSync(absDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) fileCount++;
    }
  } catch {
    return;
  }

  if (fileCount > 1) {
    report.warn(
      relative,
      `Ambiguous scatter directory '${basename}' contains ${fileCount} files. Ownership is unclear. Rename to a domain-specific folder or justify its scope.`,
      `dir: ${relative}`
    );
  }
}

// ── 2. Old / temp / copy naming ───────────────────────────────────────────────
function checkOldTempNaming(relative, filename) {
  for (const pattern of oldTempNamingPatterns) {
    if (filename.includes(pattern)) {
      report.warn(
        relative,
        `File has old/temp/copy naming pattern '${pattern}'. Remove, rename, or formally archive with owner justification.`,
        `file: ${relative}`
      );
      return; // report once per file
    }
  }
}

// ── 3. Large mixed-responsibility files ───────────────────────────────────────
function checkLargeFile(relative, absFile) {
  let stat;
  try {
    stat = fs.statSync(absFile);
  } catch {
    return;
  }
  if (stat.size > largeFileSizeBytes) {
    report.warn(
      relative,
      `File is large (${stat.size} bytes > ${largeFileSizeBytes} threshold). May carry mixed responsibilities. Review for decomposition or justify single-file size.`,
      `size: ${stat.size} bytes`
    );
  }
}

// ── 4. Tiny-file fragmentation ────────────────────────────────────────────────
function checkTinyFile(relative, absFile) {
  let stat;
  try {
    stat = fs.statSync(absFile);
  } catch {
    return;
  }
  if (stat.size > 0 && stat.size < tinyFileSizeBytes) {
    report.warn(
      relative,
      `File is tiny (${stat.size} bytes < ${tinyFileSizeBytes} threshold). May be over-fragmented. Merge with adjacent code or document why it is standalone.`,
      `size: ${stat.size} bytes`
    );
  }
}

// ── 5. Possible orphan exports ────────────────────────────────────────────────
// A file that has `export` but its basename is not obviously a named module
// (e.g. no clear domain prefix, named 'index' inside a scatter bucket).
function checkOrphanExport(relative, text) {
  const dir = path.dirname(relative);
  const basename = path.basename(dir).toLowerCase();
  if (!scatterBuckets.has(basename)) return;
  if (isAllowedScatterRoot(dir)) return;

  const hasExport = /(?:^|\n)\s*export\s+(?:default|const|function|class|type|interface)\b/.test(text);
  if (!hasExport) return;

  report.warn(
    relative,
    `File inside ambiguous '${basename}' directory exports symbols. Confirm ownership domain and move to a domain-named module.`,
    `dir: ${dir}`
  );
}

// ── Walk all source files ─────────────────────────────────────────────────────
const files = walkFiles(root, {
  startDirs: config.scanRoots,
  extensions: CODE_AND_MD_EXTENSIONS,
});

for (const file of files) {
  const relative = rel(root, file);
  if (shouldSkipPath(relative)) continue;

  const filename = path.basename(file);
  const ext = path.extname(file).toLowerCase();

  // Check parent directory for scatter bucket pattern
  checkScatterDir(path.dirname(file));

  // Old/temp naming check applies to all file types
  checkOldTempNaming(relative, filename);

  // Size checks apply to all matched files
  checkLargeFile(relative, file);
  checkTinyFile(relative, file);

  // Orphan export check applies only to code files
  if (CODE_EXTENSIONS.has(ext)) {
    const text = readText(file);
    checkOrphanExport(relative, text);
  }
}

finalize(report, args);

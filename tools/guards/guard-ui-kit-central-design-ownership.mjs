import path from 'node:path';
import {
  parseArgs,
  createReport,
  finalize,
  walkFiles,
  readText,
  readJson,
  rel,
  CODE_EXTENSIONS,
  lineNumber,
  isProbablyGeneratedPath,
} from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const configPath = path.join(root, 'tools/guards/guard-ui-kit-central-design-ownership.config.json');
const config = readJson(configPath);

const report = createReport(
  'GUARD_UI_KIT_CENTRAL_DESIGN_OWNERSHIP',
  ['governance/08_UI_KIT_AND_BRAND.md', 'governance/14_GUARDS_CATALOG.md']
);

const files = walkFiles(root, {
  startDirs: config.scanRoots,
  extensions: CODE_EXTENSIONS,
});

const reusableComponentNames = new Set(config.reusableComponentNames ?? []);
const localDesignObjectNames = new Set(config.localDesignObjectNames ?? []);
const localReusableImportPathSegments = new Set(config.localReusableImportPathSegments ?? []);
const skipRelativePatterns = config.skipRelativePatterns ?? [];

function isUiKit(relative) {
  return String(relative).startsWith('ui-kit/');
}

function shouldSkip(relative) {
  if (isProbablyGeneratedPath(relative)) return true;
  return skipRelativePatterns.some((pattern) => relative.includes(pattern));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findReusableComponentDeclarations(relative, text) {
  for (const name of reusableComponentNames) {
    const escaped = escapeRegExp(name);
    const patterns = [
      new RegExp(`(?:^|\\n)\\s*(?:export\\s+)?function\\s+${escaped}\\s*\\(`, 'g'),
      new RegExp(
        `(?:^|\\n)\\s*(?:export\\s+)?const\\s+${escaped}\\s*=\\s*(?:\\(|React\\.memo|memo\\(|forwardRef|React\\.forwardRef|\\w+)`,
        'g'
      ),
      new RegExp(`(?:^|\\n)\\s*(?:export\\s+)?class\\s+${escaped}\\b`, 'g'),
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const line = lineNumber(text, match.index);
        report.warn(
          relative,
          'Potential reusable design component declared outside ui-kit. Centralize in @bthwani/ui-kit or justify as service-specific composition.',
          `line ${line}: ${name}`
        );
      }
    }
  }
}

function findLocalDesignObjects(relative, text) {
  if (localDesignObjectNames.size === 0) return;
  const names = [...localDesignObjectNames].map(escapeRegExp).join('|');
  const objectPattern = new RegExp(
    `(?:^|\\n)\\s*(?:export\\s+)?(?:const|let|var)\\s+(${names})\\s*=\\s*\\{`,
    'gi'
  );

  let match;
  while ((match = objectPattern.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    report.warn(
      relative,
      'Potential local design-system object outside ui-kit. Move tokens/theme/visual constants to central ui-kit ownership.',
      `line ${line}: ${match[1]}`
    );
  }
}

function importedNamesFromClause(clause) {
  const names = new Set();
  const cleaned = clause
    .replace(/\btype\b/g, ' ')
    .replace(/\bas\b\s+\w+/g, ' ')
    .replace(/[{}*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  for (const part of cleaned.split(/[,\s]+/).filter(Boolean)) {
    if (/^[A-Z][A-Za-z0-9_]*$/.test(part)) names.add(part);
  }
  return names;
}

function localImportLooksReusable(spec) {
  if (!spec.startsWith('.')) return false;
  const normalized = spec.replace(/\\/g, '/').toLowerCase();
  return [...localReusableImportPathSegments].some((segment) => {
    const s = String(segment).toLowerCase();
    return (
      normalized.includes(`/${s}/`) ||
      normalized.endsWith(`/${s}`) ||
      normalized.includes(`${s}/`)
    );
  });
}

function findLocalReusableImports(relative, text) {
  const importRegex = /import\s+(?:type\s+)?([^'";]+?)\s+from\s+(['"])([^'"]+)\2/g;
  let match;
  while ((match = importRegex.exec(text)) !== null) {
    const clause = match[1];
    const spec = match[3];
    if (!spec.startsWith('.')) continue;
    const importedNames = importedNamesFromClause(clause);
    const hasReusableName = [...importedNames].some((name) => reusableComponentNames.has(name));
    const pathLooksReusable = localImportLooksReusable(spec);
    if (!hasReusableName && !pathLooksReusable) continue;
    const line = lineNumber(text, match.index);
    report.warn(
      relative,
      'Potential local reusable design import outside ui-kit public exports. Use @bthwani/ui-kit for reusable UI patterns.',
      `line ${line}: ${spec}`
    );
  }
}

function findLocalStyleFactories(relative, text) {
  const patterns = [
    { name: 'createStyles', regex: /(?:^|\n)\s*(?:export\s+)?(?:const|function)\s+createStyles\b/g },
    { name: 'makeStyles', regex: /(?:^|\n)\s*(?:export\s+)?(?:const|function)\s+makeStyles\b/g },
    { name: 'getStyles', regex: /(?:^|\n)\s*(?:export\s+)?(?:const|function)\s+getStyles\b/g },
    {
      name: 'designSystem',
      regex: /(?:^|\n)\s*(?:export\s+)?(?:const|let|var)\s+designSystem\s*=\s*\{/gi,
    },
  ];

  for (const item of patterns) {
    let match;
    while ((match = item.regex.exec(text)) !== null) {
      const line = lineNumber(text, match.index);
      report.warn(
        relative,
        'Potential local reusable style factory/design system outside ui-kit. Centralize reusable visual logic.',
        `line ${line}: ${item.name}`
      );
    }
  }
}

for (const file of files) {
  const relative = rel(root, file);
  if (isUiKit(relative) || shouldSkip(relative)) continue;
  const text = readText(file);
  findReusableComponentDeclarations(relative, text);
  findLocalDesignObjects(relative, text);
  findLocalReusableImports(relative, text);
  findLocalStyleFactories(relative, text);
}

finalize(report, args);

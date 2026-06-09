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

const allowedUiKitFiles = new Set(config.allowedUiKitFiles ?? []);

function findIconDrift(relative, text) {
  const iconImportRegex = /from\s+['"](@expo\/vector-icons|lucide-react|lucide-react-native|react-native-vector-icons|@tamagui\/lucide-icons)['"]/g;
  let match;
  while ((match = iconImportRegex.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    report.warn(
      relative,
      'Direct icon library import outside @bthwani/ui-kit. Use central Icon/IconButton/DirectionalIcon instead.',
      `line ${line}: ${match[1]}`
    );
  }
}

function findFontFamilyDrift(relative, text) {
  const fontFamilyRegex = /\bfontFamily\s*[:=]\s*['"`]([^'"`]+)['"`]/g;
  let match;
  while ((match = fontFamilyRegex.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    report.fail(
      relative,
      'Direct fontFamily property usage outside ui-kit. fontFamily is forbidden; consume central ui-kit Text roles instead.',
      `line ${line}: ${match[1]}`
    );
  }
}

function findTypographyPropertyDrift(relative, text) {
  const typographyKeysRegex = /\b(fontSize|fontWeight|lineHeight|letterSpacing)\s*[:=]\s*(\d+|['"`]\w+['"`])/g;
  let match;
  while ((match = typographyKeysRegex.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    report.warn(
      relative,
      'Potential direct typography property usage outside ui-kit. Prefer central ui-kit Text roles.',
      `line ${line}: ${match[1]} = ${match[2]}`
    );
  }
}

function findListPerformanceRisk(relative, text) {
  if (/List|FlatList|SectionList|ScrollView/i.test(text)) {
    const animationRegex = /\b(animation|transition|blur|shadowOffset|shadowRadius)\b/g;
    let match;
    while ((match = animationRegex.exec(text)) !== null) {
      const line = lineNumber(text, match.index);
      report.warn(
        relative,
        'Potential list performance risk: inline animation/blur/shadow properties detected in a file containing list elements.',
        `line ${line}: ${match[1]}`
      );
    }
  }
}


function findReusableStyleSheetRecipes(relative, text) {
  const styleKeysRegex = /StyleSheet\.create\(\s*\{[\s\S]*?\b(button|card|header|tab|badge|chip)\s*:/gi;
  let match;
  while ((match = styleKeysRegex.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    report.warn(
      relative,
      'Potential local StyleSheet reusable style key outside ui-kit. Move common styling to central ui-kit foundation.',
      `line ${line}: ${match[1]}`
    );
  }
}

function checkLaneMisuse(relative, text) {
  const laneImports = /import\s+.*?from\s+['"]\.\.\/\.\.\/(app-client|app-partner|app-captain|app-field|control-panel|webapp|website)\/runtime/g;
  let match;
  while ((match = laneImports.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    const targetLane = match[1];
    report.fail(
      relative,
      `Lane misuse: importing across different app runtimes is forbidden. Target lane: ${targetLane}`,
      `line ${line}: ${match[0]}`
    );
  }

  if (relative.startsWith('webapp/runtime') || relative.startsWith('website/runtime') || relative.startsWith('control-panel/runtime')) {
    const mobileSpecificRegex = /import\s+.*?from\s+['"](react-native|expo|@react-native\/[^'"]+)['"]/g;
    let mobMatch;
    while ((mobMatch = mobileSpecificRegex.exec(text)) !== null) {
      const line = lineNumber(text, mobMatch.index);
      report.fail(
        relative,
        'Web lane importing mobile-specific package (react-native/expo) is forbidden.',
        `line ${line}: ${mobMatch[1]}`
      );
    }
  }
}

function checkFreeDesignVars(relative, text) {
  const directHexRegex = /VAR_UI_[A-Z_]*?\s*=\s*['"]#[0-9a-fA-F]{3,8}['"]/g;
  let match;
  while ((match = directHexRegex.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    report.fail(
      relative,
      'Bypassing design policy by defining raw hex values in VAR settings is forbidden.',
      `line ${line}: ${match[0]}`
    );
  }
}

function findRawShadowDrift(relative, text) {
  const shadowRegex = /\b(shadowOffset|shadowRadius|shadowOpacity)\b/g;
  let match;
  while ((match = shadowRegex.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    report.warn(
      relative,
      'Raw inline shadow property usage outside ui-kit. Use central shadowPresets or shadowByElevation.',
      `line ${line}: ${match[1]}`
    );
  }
}

function findRasterAssetDrift(relative, text) {
  const rasterRegex = /import\s+.*?from\s+['"].*?\.(png|jpg|jpeg)['"]/g;
  let match;
  while ((match = rasterRegex.exec(text)) !== null) {
    const line = lineNumber(text, match.index);
    report.warn(
      relative,
      'Raster image (PNG/JPG) imported inside code. Prefer vector SVGs or central DSH/media policy constants.',
      `line ${line}: ${match[0]}`
    );
  }
}

for (const file of files) {
  const relative = rel(root, file);
  if (isUiKit(relative)) {
    if (!allowedUiKitFiles.has(relative) && !shouldSkip(relative)) {
      report.fail(
        relative,
        'ui-kit file inflation detected. Creating new ui-kit files is forbidden without explicit human approval.',
        `File not in allowed list: ${relative}`
      );
    }
    continue;
  }
  if (shouldSkip(relative)) continue;

  const text = readText(file);
  findReusableComponentDeclarations(relative, text);
  findLocalDesignObjects(relative, text);
  findLocalReusableImports(relative, text);
  findLocalStyleFactories(relative, text);
  findIconDrift(relative, text);
  findFontFamilyDrift(relative, text);
  findTypographyPropertyDrift(relative, text);
  findListPerformanceRisk(relative, text);
  findReusableStyleSheetRecipes(relative, text);
  checkLaneMisuse(relative, text);
  checkFreeDesignVars(relative, text);
  findRawShadowDrift(relative, text);
  findRasterAssetDrift(relative, text);
}

finalize(report, args);

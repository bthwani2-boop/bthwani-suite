import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const argDirs = process.argv.slice(2);
const SCAN_DIRS = argDirs.length > 0 ? argDirs : ['apps', 'packages'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.css']);

const forbiddenPatterns = [
  {
    name: 'Hardcoded direction prop on BthMobileRoot',
    regex: /<BthMobileRoot[^>]*\bdirection=/,
  },
  {
    name: 'Hardcoded direction prop on BthWebRootLayout',
    regex: /<BthWebRootLayout[^>]*\bdirection=/,
  },
  {
    name: 'Hardcoded direction prop on UiKitProvider',
    regex: /<UiKitProvider[^>]*\bdirection=/,
  },
  {
    name: 'Local direction override call',
    regex: /\bsetDirection\s*\(/,
  },
  {
    name: 'Direct getBthUiText usage outside ui-kit i18n/hook',
    regex: /\bgetBthUiText\s*\(/,
    allowPaths: [
      'ui-kit/src/foundation/i18n/BthUiTextCatalog.ts',
      'ui-kit/src/hooks/useUiText.ts',
    ],
  },
  {
    name: 'Global html dir selector inside shared web adapter CSS',
    regex: /html\[dir=['"](?:rtl|ltr)['"]\]/,
    includePaths: ['ui-kit/src/adapters/web/'],
  },
  {
    name: 'Caller-owned language click on shared command center frame',
    regex: /<BthWebCommandCenterFrame[^>]*\bonLanguageClick=/,
  },
  {
    name: 'Local language ownership in live control-panel web tree',
    regex: /\b(useUiLanguage\s*\(|toggleLanguage\s*\(|setLanguage\s*\()/,
    includePaths: [
      'control-panel/',
    ],
    excludePaths: [],
    allowPaths: [
      'ui-kit/src/providers.tsx',
      'control-panel/shell/ControlPanelSurfaceHost.tsx',
    ],
  },
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.next') {
        continue;
      }
      walk(abs, files);
      continue;
    }

    if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(abs);
    }
  }

  return files;
}

const sourceFiles = SCAN_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));
const violations = [];

for (const file of sourceFiles) {
  const relPath = path.relative(ROOT, file).replaceAll('\\', '/');
  const content = fs.readFileSync(file, 'utf8');

  for (const rule of forbiddenPatterns) {
    if (rule.includePaths && !rule.includePaths.some((allowedPrefix) => relPath.startsWith(allowedPrefix))) {
      continue;
    }

    if (rule.excludePaths && rule.excludePaths.some((blockedPrefix) => relPath.startsWith(blockedPrefix))) {
      continue;
    }

    if (rule.allowPaths && rule.allowPaths.includes(relPath)) {
      continue;
    }

    if (rule.regex.test(content)) {
      violations.push({
        file: relPath,
        rule: rule.name,
      });
    }
  }
}

if (violations.length > 0) {
  console.error('Central i18n/direction guard failed with violations:');
  for (const violation of violations) {
    console.error(`- [${violation.rule}] ${violation.file}`);
  }
  process.exit(1);
}

console.log('Central i18n/direction guard passed.');

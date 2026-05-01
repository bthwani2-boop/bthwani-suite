import path from 'node:path';
import { parseArgs, createReport, finalize, walkFiles, readText, rel, TEXT_EXTENSIONS, lineNumber, isProbablyGeneratedPath } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('DESIGN-TOKEN-DRIFT', 'governance/08_UI_KIT_AND_BRAND.md');
const root = args.root;
const files = walkFiles(root, { startDirs: ['apps', 'packages', 'services'], extensions: TEXT_EXTENSIONS });

const foundationPath = path.join(root, 'packages/ui-kit/src/foundation.ts');
const normalizeHex = (value) => value.toUpperCase();
const allowed = new Set([
  '#0A2F5C',
  '#FF500D',
  '#FFFFFF',
  '#000000',
  '#111111',
  '#222222',
  '#333333',
  '#444444',
  '#555555',
  '#666666',
  '#777777',
  '#888888',
  '#999999'
].map(normalizeHex));

for (const match of readText(foundationPath).matchAll(/#[0-9a-fA-F]{6}\b/g)) {
  allowed.add(normalizeHex(match[0]));
}

const hexRegex = /(?<![A-Za-z0-9_])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?![A-Za-z0-9_])/g;

for (const file of files) {
  const relative = rel(root, file);
  if (relative.startsWith('packages/ui-kit/') || isProbablyGeneratedPath(relative)) continue;
  const text = readText(file);
  let match;
  while ((match = hexRegex.exec(text)) !== null) {
    const hex = normalizeHex(match[0].length === 4
      ? `#${match[0][1]}${match[0][1]}${match[0][2]}${match[0][2]}${match[0][3]}${match[0][3]}`
      : match[0]);
    if (allowed.has(hex)) continue;
    const line = lineNumber(text, match.index);
    report.warn(relative, 'Hardcoded non-brand hex color outside ui-kit. Move to ui-kit tokens or justify centrally.', `line ${line}: ${hex}`);
  }
}

finalize(report, args);

import { parseArgs, createReport, finalize, walkFiles, readText, rel, TEXT_EXTENSIONS, lineNumber, isProbablyGeneratedPath } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('DESIGN-TOKEN-DRIFT', 'governance/GUARD_IMPLEMENTATION_MAP.md');
const root = args.root;
const files = walkFiles(root, { startDirs: ['apps', 'packages', 'services'], extensions: TEXT_EXTENSIONS });

const allowed = new Set(['#0A2F5C', '#FF500D', '#FFFFFF', '#fff', '#FFF', '#ffffff', '#000', '#000000', '#111', '#222', '#333', '#444', '#555', '#666', '#777', '#888', '#999']);
const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;

for (const file of files) {
  const relative = rel(root, file);
  if (relative.startsWith('packages/ui-kit/') || isProbablyGeneratedPath(relative)) continue;
  const text = readText(file);
  let match;
  while ((match = hexRegex.exec(text)) !== null) {
    const hex = match[0];
    if (allowed.has(hex)) continue;
    const line = lineNumber(text, match.index);
    report.warn(relative, 'Hardcoded non-brand hex color outside ui-kit. Move to ui-kit tokens or justify centrally.', `line ${line}: ${hex}`);
  }
}

finalize(report, args);

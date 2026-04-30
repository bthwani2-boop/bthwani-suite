import { parseArgs, createReport, finalize, walkFiles, readText, rel, CODE_EXTENSIONS, lineNumber } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('UI-ARCH-BOUNDARY', 'governance/GUARD_IMPLEMENTATION_MAP.md');
const root = args.root;
const files = walkFiles(root, { startDirs: ['apps', 'packages', 'services'], extensions: CODE_EXTENSIONS });

const importRegex = /(?:import\s+(?:[^'";]+?\s+from\s+)?|export\s+[^'";]+?\s+from\s+|require\s*\()(['"])([^'"]+)\1/g;

function allowedTamagui(relative) {
  return relative.startsWith('packages/ui-kit/')
    || /(^|\/)(tamagui\.config|tamagui\.build)\.[cm]?[tj]s$/.test(relative)
    || relative.endsWith('tamagui.config.ts')
    || relative.endsWith('tamagui.build.ts');
}

for (const file of files) {
  const relative = rel(root, file);
  const text = readText(file);
  let match;
  while ((match = importRegex.exec(text)) !== null) {
    const spec = match[2];
    const line = lineNumber(text, match.index);
    if ((spec === 'tamagui' || spec.startsWith('@tamagui/')) && !allowedTamagui(relative)) {
      report.fail(relative, 'Direct Tamagui import outside @bthwani/ui-kit boundary.', `line ${line}: ${spec}`);
    }
    if ((spec.includes('packages/ui-kit/src') || spec.startsWith('@bthwani/ui-kit/src')) && !relative.startsWith('packages/ui-kit/')) {
      report.fail(relative, 'Deep ui-kit import detected. Use @bthwani/ui-kit public exports only.', `line ${line}: ${spec}`);
    }
    if (/\b(ui-kit\/src\/|\.\.\/\.\.\/.*ui-kit\/src)/.test(spec) && !relative.startsWith('packages/ui-kit/')) {
      report.fail(relative, 'Relative/deep import into ui-kit source detected.', `line ${line}: ${spec}`);
    }
  }

  if (!relative.startsWith('packages/ui-kit/') && /(const|let)\s+(colors|tokens|theme)\s*=\s*\{/.test(text)) {
    report.warn(relative, 'Potential local design-system tokens/theme object outside ui-kit. Verify ownership.');
  }
}

finalize(report, args);

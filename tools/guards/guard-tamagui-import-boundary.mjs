import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, runGuard, readTextSafe } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD_TAMAGUI_IMPORT_BOUNDARY',
  guardName: 'Tamagui Import Boundary',
  prefix: 'GUARD_TAMAGUI_IMPORT_BOUNDARY',
  configPath: 'tools/guards/guard-tamagui-import-boundary.config.json',
  collect: ({ config }) => {
    const all = gitLsFiles();
    const roots = config.roots || ['apps', 'packages'];
    const exts = (config.extensions || []).map((e) => e.toLowerCase());

    const scanned = all.filter((f) => {
      const top = f.includes('/') ? f.split('/')[0] : f.split('\\')[0];
      const ext = f.includes('.') ? f.slice(f.lastIndexOf('.')).toLowerCase() : '';
      return roots.includes(top) && exts.includes(ext);
    });

    const directPattern = /from\s+['"]tamagui['"]|from\s+['"]@tamagui\//g;
    const findings = [];
    let totalDirect = 0;
    let outsideCount = 0;

    for (const f of scanned) {
      const txt = readTextSafe(path.join(ROOT, f));
      const lines = txt.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (directPattern.test(line)) {
          totalDirect++;
          const relative = f;
          const scope = relative.startsWith('packages/ui-kit/') ? 'ALLOWED_UIKIT' : 'BLOCKED_OUTSIDE_UIKIT';
          if (scope === 'BLOCKED_OUTSIDE_UIKIT') {
            outsideCount++;
            findings.push({ type: 'UNEXPECTED_TAMAGUI_IMPORT', severity: 'error', file: f, reason: `Direct Tamagui import outside ui-kit at L${i+1}: ${line.trim()}` });
          } else {
            findings.push({ type: 'ALLOWED_UIKIT_IMPORT', severity: 'warning', file: f, reason: `Tamagui import allowed inside ui-kit at L${i+1}` });
          }
        }
      }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'tamagui-import-findings.csv',
      baseCounts: { FilesScanned: scanned.length, DirectTamaguiImports: totalDirect, OutsideUiKit: outsideCount },
      blockedDecision: 'BLOCKED_TAMAGUI_IMPORT_VIOLATIONS',
      warningDecision: 'TAMAGUI_IMPORT_WARNINGS',
      passDecision: 'PASS_TAMAGUI_IMPORT_BOUNDARY',
    };
  },
});

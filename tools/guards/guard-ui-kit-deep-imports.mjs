#!/usr/bin/env node
import path from 'node:path';
import { ROOT, readJson, gitLsFiles, isCodeLike, defaultFileFilter, readTextSafe, runGuard } from './_guard-common.mjs';

function collect({ config, evidenceRoot }) {
  const files = gitLsFiles().filter(defaultFileFilter).filter(isCodeLike);
  const findings = [];

  const importRegex = /(?:from\s+|require\()\s*['"]([^'"]+)['"]/g;

  for (const file of files) {
    const abs = path.join(ROOT, file);
    const content = readTextSafe(abs);
    if (!content) continue;

    for (const m of content.matchAll(importRegex)) {
      const mod = m[1];
      const idx = m.index ?? 0;
      const line = content.slice(0, idx).split(/\r?\n/).length;

      // Direct tamagui imports
      if (mod === 'tamagui' || mod.startsWith('tamagui/')) {
        findings.push({
          type: 'TAMAGUI_IMPORT',
          severity: 'warning',
          file,
          reason: `Direct Tamagui import '${mod}' at L${line}`,
        });
        continue;
      }

      // @bthwani/ui-kit deep imports
      if (mod.startsWith('@bthwani/ui-kit')) {
        const rest = mod.slice('@bthwani/ui-kit'.length).replace(/^\//, '');
        const first = rest.split('/')[0] || '';
        const bannedTokens = ['src', 'internal', 'lib', 'components'];
        const allowed = (config.allowedSubpaths || []).map((s) => String(s));

        const isAllowed = allowed.includes(first);
        const looksBanned = bannedTokens.some((t) => rest.includes(t));

        if (!isAllowed || looksBanned) {
          findings.push({
            type: 'UIKIT_DEEP_IMPORT',
            severity: 'warning',
            file,
            reason: `Deep import '${mod}' at L${line} — avoid importing internals; use public exports from @bthwani/ui-kit or move adapter into packages/ui-kit`,
          });
        }
      }
    }
  }

  return {
    findings,
    headers: ['type', 'severity', 'file', 'reason'],
    baseCounts: { ScannedFiles: files.length },
    passDecision: 'PASS_UIKIT_IMPORT_BOUNDARY',
    warningDecision: 'UIKIT_IMPORT_WARNINGS',
    blockedDecision: 'BLOCKED_UIKIT_IMPORT',
    issueFileName: 'ui-kit-deep-imports-findings.csv',
  };
}

runGuard({
  guardId: 'GUARD_UIKIT_DEEP_IMPORTS',
  guardName: 'UI‑Kit deep imports & Tamagui direct import detector',
  prefix: 'GUARD_UIKIT_DEEP_IMPORTS',
  configPath: 'tools/guards/config-ui-kit-deep-imports.json',
  collect,
});

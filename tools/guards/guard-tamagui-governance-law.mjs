import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, runGuard, readTextSafe } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD_TAMAGUI_GOVERNANCE_LAW',
  guardName: 'Tamagui Governance Law',
  prefix: 'GUARD_TAMAGUI_GOVERNANCE_LAW',
  configPath: 'tools/guards/guard-tamagui-governance-law.config.json',
  collect: ({ config }) => {
    const lawPath = config.lawPath || 'governance/TAMAGUI_INTEGRATION_LAW.md';
    const allowedBuildFileName = config.allowedBuildFileName || 'tamagui.build.ts';
    const findings = [];

    const lawFull = path.join(ROOT, lawPath);
    if (!fs.existsSync(lawFull)) {
      findings.push({ type: 'MISSING_LAW_FILE', severity: 'error', file: lawPath, reason: 'Missing TAMAGUI_INTEGRATION_LAW.md' });
      return {
        findings,
        headers: ['type', 'severity', 'file', 'reason'],
        issueFileName: 'tamagui-law-findings.csv',
        baseCounts: { LawExists: 0 },
        blockedDecision: 'BLOCKED_MISSING_TAMAGUI_LAW',
        warningDecision: 'TAMAGUI_LAW_WARNINGS',
        passDecision: 'PASS_TAMAGUI_LAW',
      };
    }

    const lawText = readTextSafe(lawFull).toLowerCase();
    const requiredTerms = [
      'tamagui is approved only as a private implementation engine',
      'packages/ui-kit/**',
      'tamagui.build.ts',
      'exact-path build-time exception',
      'Tamaguiprovider must be owned by UI Kit only'.toLowerCase(),
      'foundation.ts is the design-token source of truth',
      'tamagui-config.ts is an adapter only',
      'any violation is a governance blocker'
    ];

    const missing = [];
    for (const term of requiredTerms) {
      if (!lawText.includes(term.toLowerCase())) missing.push(term);
    }
    for (const t of missing) findings.push({ type: 'MISSING_LAW_TERM', severity: 'error', file: lawPath, reason: `Missing law term: ${t}` });

    // Scan root-level code files for direct Tamagui imports
    const rootCodeFiles = gitLsFiles().filter((f) => !f.includes('/') && /\.(ts|tsx|js|jsx)$/.test(f));
    const directPattern = /from\s+['"]tamagui['"]|from\s+['"]@tamagui\//g;
    const rootHits = [];
    for (const f of rootCodeFiles) {
      const txt = readTextSafe(path.join(ROOT, f));
      if (directPattern.test(txt)) rootHits.push(f);
    }

    for (const f of rootHits) {
      if (f !== allowedBuildFileName) {
        findings.push({ type: 'UNEXPECTED_ROOT_TAMAGUI_IMPORT', severity: 'error', file: f, reason: 'Direct Tamagui import found in root-level file outside allowed build exception' });
      }
    }

    const blocked = missing.length > 0 || rootHits.some((f) => f !== allowedBuildFileName);
    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'tamagui-law-findings.csv',
      baseCounts: { RootCodeFilesScanned: rootCodeFiles.length, MissingLawTerms: missing.length, RootTamaguiHits: rootHits.length },
      blockedDecision: 'BLOCKED_TAMAGUI_LAW_VIOLATION',
      warningDecision: 'TAMAGUI_LAW_WARNINGS',
      passDecision: 'PASS_TAMAGUI_LAW',
    };
  },
});

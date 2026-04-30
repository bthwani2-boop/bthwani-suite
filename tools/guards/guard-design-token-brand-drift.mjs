import path from 'node:path';
import { ROOT, gitLsFiles, defaultFileFilter, isUiLike, readTextSafe, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-20_DESIGN_TOKEN_BRAND_DRIFT',
  guardName: 'Design Token / Brand Color Drift',
  prefix: 'GUARD_20_DESIGN_TOKEN_BRAND_DRIFT',
  configPath: 'tools/guards/guard-design-token-brand-drift.config.json',
  collect: ({ config }) => {
    const allowed = new Set((config.allowedHexColors ?? []).map((x) => x.toLowerCase()));
    const files = gitLsFiles().filter(defaultFileFilter).filter(isUiLike);
    const findings = [];
    for (const file of files) {
      const lines = readTextSafe(path.join(ROOT, file)).split(/\r?\n/);
      lines.forEach((line, i) => {
        const matches = line.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
        for (const color of matches) {
          if (!allowed.has(color.toLowerCase())) findings.push({ type: 'RAW_COLOR_OUTSIDE_BRAND_PALETTE', severity: 'warning', file, line: i + 1, color, reason: 'Raw hex color is not in approved BThwani palette.' });
        }
      });
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'line', 'color', 'reason'],
      issueFileName: 'design-token-brand-drift-findings.csv',
      baseCounts: { FilesScanned: files.length },
      blockedDecision: 'BLOCKED_BY_DESIGN_TOKEN_BRAND_DRIFT',
      warningDecision: 'READY_FOR_DESIGN_TOKEN_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_DESIGN_TOKEN_BRAND_DRIFT_GUARD',
    };
  },
});

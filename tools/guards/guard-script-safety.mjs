import path from 'node:path';
import { ROOT, gitLsFiles, defaultFileFilter, isTextLike, readTextSafe, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-23_SCRIPT_SAFETY',
  guardName: 'Script Safety',
  prefix: 'GUARD_23_SCRIPT_SAFETY',
  configPath: 'tools/guards/guard-script-safety.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles().filter(defaultFileFilter).filter((file) => /\.(ps1|mjs|js|cjs|sh|cmd|bat)$/i.test(file));
    const patterns = config.dangerPatterns ?? [];
    const findings = [];
    for (const file of files) {
      const lines = readTextSafe(path.join(ROOT, file)).split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const pattern of patterns) if (line.toLowerCase().includes(String(pattern).toLowerCase())) findings.push({ type: 'SCRIPT_DANGER_PATTERN_REVIEW', severity: 'warning', file, line: i + 1, pattern, reason: 'Potentially dangerous script operation requires review and evidence/rollback guard.' });
      });
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'line', 'pattern', 'reason'],
      issueFileName: 'script-safety-findings.csv',
      baseCounts: { FilesScanned: files.length },
      blockedDecision: 'BLOCKED_BY_SCRIPT_SAFETY',
      warningDecision: 'READY_FOR_SCRIPT_SAFETY_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_SCRIPT_SAFETY_GUARD',
    };
  },
});

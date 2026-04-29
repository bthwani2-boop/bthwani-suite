import path from 'node:path';
import { ROOT, gitLsFiles, defaultFileFilter, isTextLike, readTextSafe, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-13_GOVERNANCE_SSOT_CONFLICT',
  guardName: 'Governance SSOT Conflict',
  prefix: 'GUARD_13_GOVERNANCE_SSOT_CONFLICT',
  configPath: 'tools/guards/guard-governance-ssot-conflict.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles().filter(defaultFileFilter).filter((file) => isTextLike(file));
    const conflictPatterns = config.conflictPatterns ?? [];
    const findings = [];
    for (const file of files) {
      const text = readTextSafe(path.join(ROOT, file));
      const lines = text.split(/\r?\n/);
      lines.forEach((line, idx) => {
        for (const item of conflictPatterns) {
          if (line.includes(item.pattern)) {
            findings.push({ type: 'GOVERNANCE_SSOT_CONFLICT_REFERENCE', severity: 'warning', file, line: idx + 1, pattern: item.pattern, reason: item.reason });
          }
        }
      });
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'line', 'pattern', 'reason'],
      issueFileName: 'governance-ssot-conflict-findings.csv',
      baseCounts: { FilesScanned: files.length },
      blockedDecision: 'BLOCKED_BY_GOVERNANCE_SSOT_CONFLICT',
      warningDecision: 'READY_FOR_GOVERNANCE_SSOT_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_GOVERNANCE_SSOT_CONFLICT_GUARD',
    };
  },
});

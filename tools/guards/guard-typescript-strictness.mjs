import path from 'node:path';
import { ROOT, gitLsFiles, defaultFileFilter, isCodeLike, readTextSafe, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-19_TYPESCRIPT_STRICTNESS',
  guardName: 'TypeScript Strictness / any / ts-ignore',
  prefix: 'GUARD_19_TYPESCRIPT_STRICTNESS',
  configPath: 'tools/guards/guard-typescript-strictness.config.json',
  collect: () => {
    const files = gitLsFiles().filter(defaultFileFilter).filter(isCodeLike);
    const findings = [];
    const patterns = [
      ['TS_IGNORE', /@ts-ignore/],
      ['TS_NO_CHECK', /@ts-nocheck/],
      ['ANY_TYPE', /:\s*any\b|\bas\s+any\b|<any>/],
      ['ESLINT_DISABLE', /eslint-disable/],
    ];
    for (const file of files) {
      const lines = readTextSafe(path.join(ROOT, file)).split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const [type, regex] of patterns) if (regex.test(line)) findings.push({ type, severity: 'warning', file, line: i + 1, reason: 'TypeScript strictness escape hatch found.' });
      });
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'line', 'reason'],
      issueFileName: 'typescript-strictness-findings.csv',
      baseCounts: { FilesScanned: files.length },
      blockedDecision: 'BLOCKED_BY_TYPESCRIPT_STRICTNESS',
      warningDecision: 'READY_FOR_TYPESCRIPT_STRICTNESS_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_TYPESCRIPT_STRICTNESS_GUARD',
    };
  },
});

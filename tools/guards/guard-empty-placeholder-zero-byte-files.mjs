import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, defaultFileFilter, isTextLike, readTextSafe, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-11_EMPTY_PLACEHOLDER_ZERO_BYTE_FILES',
  guardName: 'Empty / Placeholder / Zero-byte Files',
  prefix: 'GUARD_11_EMPTY_PLACEHOLDER_ZERO_BYTE_FILES',
  configPath: 'tools/guards/guard-empty-placeholder-zero-byte-files.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles().filter(defaultFileFilter);
    const findings = [];
    const patterns = (config.placeholderPatterns ?? []).map((p) => new RegExp(`\\b${p.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i'));

    for (const file of files) {
      const full = path.join(ROOT, file);
      const stat = fs.statSync(full);
      if (stat.size === 0) {
        findings.push({ type: 'ZERO_BYTE_FILE', severity: 'warning', file, reason: 'Tracked file has zero bytes.' });
        continue;
      }
      if (!isTextLike(file) || stat.size > 250000) continue;
      const text = readTextSafe(full);
      const sample = text.slice(0, 4000);
      for (const regex of patterns) {
        if (regex.test(sample)) {
          findings.push({ type: 'PLACEHOLDER_OR_STUB_TEXT', severity: 'warning', file, reason: `Placeholder-like marker found: ${regex}` });
          break;
        }
      }
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'empty-placeholder-zero-byte-findings.csv',
      baseCounts: { FilesScanned: files.length },
      blockedDecision: 'BLOCKED_BY_EMPTY_PLACEHOLDER_FILES',
      warningDecision: 'READY_FOR_EMPTY_PLACEHOLDER_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_EMPTY_PLACEHOLDER_ZERO_BYTE_GUARD',
    };
  },
});

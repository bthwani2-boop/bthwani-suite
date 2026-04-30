import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, runGuard, makeEvidenceRoot } from './_guard-common.mjs';

function findCoverageSummaries(dir) {
  const results = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      const p = path.join(dir, it.name);
      if (it.isDirectory()) {
        if (it.name === 'node_modules' || it.name === '.git' || it.name === 'dist' || it.name === 'build') continue;
        results.push(...findCoverageSummaries(p));
      } else if (it.isFile() && it.name === 'coverage-summary.json') {
        results.push(p);
      }
    }
  } catch (e) {
    // ignore
  }
  return results;
}

runGuard({
  guardId: 'GUARD-22_TEST_COVERAGE_THRESHOLD',
  guardName: 'Test Coverage Threshold',
  prefix: 'GUARD_22_TEST_COVERAGE_THRESHOLD',
  configPath: 'tools/guards/guard-test-coverage-threshold.config.json',
  collect: ({ config, evidenceRoot }) => {
    const thresholds = config.thresholds ?? {};
    const findings = [];

    const coverageFiles = findCoverageSummaries(ROOT);
    if (!coverageFiles.length) {
      findings.push({ type: 'COVERAGE_NOT_FOUND', severity: 'warning', file: 'coverage', reason: 'No coverage-summary.json files found in repo. Run tests with coverage to produce reports.' });
      return {
        findings,
        headers: ['type', 'severity', 'file', 'reason'],
        issueFileName: 'coverage-findings.csv',
        baseCounts: { CoverageFilesFound: 0 },
        blockedDecision: 'BLOCKED_BY_MISSING_COVERAGE_REPORTS',
        warningDecision: 'COVERAGE_REPORTS_MISSING',
        passDecision: 'PASS_COVERAGE_NOT_APPLICABLE',
      };
    }

    let scanned = 0;
    for (const file of coverageFiles) {
      scanned += 1;
      try {
        const content = JSON.parse(fs.readFileSync(file, 'utf8'));
        const totals = content.total ?? content['total'] ?? content;
        const metrics = {
          statements: (totals.statements && totals.statements.pct) ?? (totals.statements && totals.statements.percent) ?? null,
          branches: (totals.branches && totals.branches.pct) ?? null,
          functions: (totals.functions && totals.functions.pct) ?? null,
          lines: (totals.lines && totals.lines.pct) ?? null,
        };
        for (const [m, pct] of Object.entries(metrics)) {
          if (pct == null) continue;
          const threshold = thresholds[m];
          if (typeof threshold === 'number' && pct < threshold) {
            findings.push({ type: 'COVERAGE_BELOW_THRESHOLD', severity: 'error', file, reason: `${m} ${pct}% < threshold ${threshold}%` });
          }
        }
      } catch (e) {
        findings.push({ type: 'BAD_COVERAGE_JSON', severity: 'warning', file, reason: `Failed to parse coverage summary: ${String(e.message)}` });
      }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'coverage-findings.csv',
      baseCounts: { CoverageFilesFound: scanned },
      blockedDecision: 'BLOCKED_BY_COVERAGE_THRESHOLD',
      warningDecision: 'COVERAGE_WARNINGS',
      passDecision: 'PASS_COVERAGE_THRESHOLD',
    };
  },
});

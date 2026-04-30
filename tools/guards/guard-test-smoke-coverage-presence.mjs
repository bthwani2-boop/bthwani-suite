import { gitLsFiles, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-22_TEST_SMOKE_COVERAGE_PRESENCE',
  guardName: 'Test / Smoke Coverage Presence',
  prefix: 'GUARD_22_TEST_SMOKE_COVERAGE_PRESENCE',
  configPath: 'tools/guards/guard-test-smoke-coverage-presence.config.json',
  collect: () => {
    const files = gitLsFiles();
    const roots = new Set();
    for (const file of files) {
      const m = file.match(/^(apps\/[^/]+\/[^/]+|packages\/[^/]+|services\/[^/]+)/);
      if (m) roots.add(m[1]);
    }
    const testFiles = files.filter((file) => /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(file) || file.includes('/__tests__/') || file.toLowerCase().includes('smoke'));
    const findings = [];
    for (const root of [...roots].sort()) {
      if (!testFiles.some((file) => file.startsWith(`${root}/`))) findings.push({ type: 'ROOT_WITHOUT_TEST_OR_SMOKE_COVERAGE', severity: 'warning', file: root, reason: 'App/package/service root has no visible test/spec/smoke file.' });
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'test-smoke-coverage-presence-findings.csv',
      baseCounts: { RootsScanned: roots.size, TestFilesSeen: testFiles.length },
      blockedDecision: 'BLOCKED_BY_TEST_SMOKE_COVERAGE_PRESENCE',
      warningDecision: 'READY_FOR_TEST_SMOKE_COVERAGE_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_TEST_SMOKE_COVERAGE_PRESENCE_GUARD',
    };
  },
});

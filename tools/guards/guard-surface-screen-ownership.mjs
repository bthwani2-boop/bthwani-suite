import { gitLsFiles, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-18_SURFACE_SCREEN_OWNERSHIP',
  guardName: 'Surface Screen Ownership',
  prefix: 'GUARD_18_SURFACE_SCREEN_OWNERSHIP',
  configPath: 'tools/guards/guard-surface-screen-ownership.config.json',
  collect: () => {
    const screens = gitLsFiles().filter((file) => /^packages\/surfaces\/src\/.*Screen\.(tsx|ts)$/.test(file));
    const findings = [];
    for (const file of screens) {
      const isServiceOwned = file.includes('/service-owned/');
      const isSurfaceOwned = file.includes('/surface-owned/');
      if (!isServiceOwned && !isSurfaceOwned) findings.push({ type: 'SCREEN_WITHOUT_CLEAR_SURFACE_OWNERSHIP', severity: 'warning', file, reason: 'Screen file is not under service-owned or surface-owned path.' });
      if (file.includes('/shared/')) findings.push({ type: 'SCREEN_IN_SHARED_PATH', severity: 'warning', file, reason: 'Screen under shared path risks ownership ambiguity.' });
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'surface-screen-ownership-findings.csv',
      baseCounts: { ScreensScanned: screens.length },
      blockedDecision: 'BLOCKED_BY_SURFACE_SCREEN_OWNERSHIP',
      warningDecision: 'READY_FOR_SURFACE_SCREEN_OWNERSHIP_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_SURFACE_SCREEN_OWNERSHIP_GUARD',
    };
  },
});

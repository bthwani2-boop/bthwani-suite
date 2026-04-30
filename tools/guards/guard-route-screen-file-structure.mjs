import { gitLsFiles, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-21_ROUTE_SCREEN_FILE_STRUCTURE',
  guardName: 'Route and Screen File Structure',
  prefix: 'GUARD_21_ROUTE_SCREEN_FILE_STRUCTURE',
  configPath: 'tools/guards/guard-route-screen-file-structure.config.json',
  collect: () => {
    const files = gitLsFiles();
    const findings = [];
    for (const file of files) {
      if (/\/page\.(tsx|ts)$/.test(file) && !file.startsWith('apps/')) findings.push({ type: 'NEXT_PAGE_OUTSIDE_APPS', severity: 'warning', file, reason: 'Next route page appears outside apps/.' });
      if (/Screen\.(tsx|ts)$/.test(file) && !/^packages\/surfaces\/src\//.test(file)) findings.push({ type: 'SCREEN_FILE_OUTSIDE_SURFACES', severity: 'warning', file, reason: 'Screen file appears outside packages/surfaces/src.' });
      if (/\/components\/.*Screen\.(tsx|ts)$/.test(file)) findings.push({ type: 'SCREEN_UNDER_COMPONENTS_FOLDER', severity: 'warning', file, reason: 'Screen file under components risks ownership and route confusion.' });
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'route-screen-file-structure-findings.csv',
      baseCounts: { FilesScanned: files.length },
      blockedDecision: 'BLOCKED_BY_ROUTE_SCREEN_FILE_STRUCTURE',
      warningDecision: 'READY_FOR_ROUTE_SCREEN_STRUCTURE_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_ROUTE_SCREEN_FILE_STRUCTURE_GUARD',
    };
  },
});

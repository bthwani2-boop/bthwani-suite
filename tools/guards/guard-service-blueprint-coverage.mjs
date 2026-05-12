import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-17_SERVICE_BLUEPRINT_COVERAGE',
  guardName: 'Service Blueprint Coverage',
  prefix: 'GUARD_17_SERVICE_BLUEPRINT_COVERAGE',
  configPath: 'tools/guards/guard-service-blueprint-coverage.config.json',
  collect: () => {
    const files = gitLsFiles();
    const canonicalServices = ['dsh', 'wlt', 'knz', 'arb', 'amn', 'esf', 'mrf', 'snd', 'kwd'];
    const findings = [];
    let servicesScanned = 0;
    for (const dir of canonicalServices.filter((service) => fs.existsSync(path.join(ROOT, service)))) {
      servicesScanned += 1;
      const blueprint = `${dir}/SERVICE_BLUEPRINT.md`;
      if (!files.includes(blueprint)) findings.push({ type: 'MISSING_SERVICE_BLUEPRINT', severity: 'warning', file: dir, reason: 'Service-owned surface lacks SERVICE_BLUEPRINT.md.' });
      else if (fs.statSync(path.join(ROOT, blueprint)).size === 0) findings.push({ type: 'EMPTY_SERVICE_BLUEPRINT', severity: 'warning', file: blueprint, reason: 'SERVICE_BLUEPRINT.md is zero bytes.' });
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'service-blueprint-coverage-findings.csv',
      baseCounts: { ServicesScanned: servicesScanned },
      blockedDecision: 'BLOCKED_BY_SERVICE_BLUEPRINT_COVERAGE',
      warningDecision: 'READY_FOR_SERVICE_BLUEPRINT_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_SERVICE_BLUEPRINT_COVERAGE_GUARD',
    };
  },
});

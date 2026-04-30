import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, runGuard, readTextSafe } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-17_SERVICE_BLUEPRINT_COMPLETENESS',
  guardName: 'Service Blueprint Completeness',
  prefix: 'GUARD_17_SERVICE_BLUEPRINT_COMPLETENESS',
  configPath: 'tools/guards/guard-service-blueprint-completeness.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles();
    const serviceDirs = new Set();
    for (const file of files) {
      const m = file.match(/^packages\/surfaces\/src\/service-owned\/([^/]+)\//);
      if (m) serviceDirs.add(`packages/surfaces/src/service-owned/${m[1]}`);
    }

    const required = config.requiredFields ?? [];
    const findings = [];
    for (const dir of [...serviceDirs].sort()) {
      const blueprint = `${dir}/SERVICE_BLUEPRINT.md`;
      if (!files.includes(blueprint)) {
        findings.push({ type: 'MISSING_SERVICE_BLUEPRINT', severity: 'error', file: dir, reason: 'Service-owned surface lacks SERVICE_BLUEPRINT.md.' });
        continue;
      }
      const fullPath = path.join(ROOT, blueprint);
      const txt = readTextSafe(fullPath);
      if (!txt) {
        findings.push({ type: 'EMPTY_SERVICE_BLUEPRINT', severity: 'error', file: blueprint, reason: 'SERVICE_BLUEPRINT.md is empty or unreadable.' });
        continue;
      }
      for (const field of required) {
        const re = new RegExp(`^\\s*${field}\\s*:\\s*.+$`, 'im');
        if (!re.test(txt)) {
          findings.push({ type: 'MISSING_BLUEPRINT_FIELD', severity: 'error', file: blueprint, reason: `Missing required field: ${field}` });
        }
      }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'service-blueprint-completeness.csv',
      baseCounts: { ServiceDirsScanned: serviceDirs.size },
      blockedDecision: 'BLOCKED_SERVICE_BLUEPRINT_MISSING_FIELDS',
      warningDecision: 'SERVICE_BLUEPRINT_INCOMPLETE_WARNINGS',
      passDecision: 'PASS_SERVICE_BLUEPRINT_COMPLETE',
    };
  },
});

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, runGuard, readTextSafe, defaultFileFilter } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-11_SECRET_SCAN',
  guardName: 'Secret Scan',
  prefix: 'GUARD_11_SECRET_SCAN',
  configPath: 'tools/guards/guard-secret-scan.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles().filter((f) => defaultFileFilter(f) && /\.(ts|tsx|js|jsx|mjs|cjs|json|env|txt|md|yaml|yml)$/.test(f));
    const findings = [];
    const patterns = config.patterns || {};
    const compiled = Object.entries(patterns).map(([k, v]) => ({ key: k, re: new RegExp(v, 'i') }));
    let scanned = 0;
    for (const f of files) {
      if (config.ignorePaths && config.ignorePaths.some((p) => f.startsWith(p))) continue;
      scanned += 1;
      if (scanned > (config.maxFiles || 2000)) break;
      try {
        const txt = readTextSafe(path.join(ROOT, f));
        for (const { key, re } of compiled) {
          if (re.test(txt)) {
            const severity = key === 'PRIVATE_KEY' ? 'error' : 'error';
            findings.push({ type: `SECRET_${key}`, severity, file: f, reason: `Pattern ${key} matched` });
          }
        }
        // low-confidence heuristics
        if (/password\s*[:=]\s*['\"]?[A-Za-z0-9\-_.]{8,}['\"]?/i.test(txt)) {
          findings.push({ type: 'SECRET_POSSIBLE_PASSWORD', severity: 'warning', file: f, reason: 'Possible password assignment found' });
        }
        if (/-----BEGIN [A-Z ]+PRIVATE KEY-----/.test(txt)) {
          findings.push({ type: 'SECRET_PRIVATE_KEY_BLOCK', severity: 'error', file: f, reason: 'Private key block found' });
        }
      } catch (e) { /* ignore read errors */ }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'secret-scan-findings.csv',
      baseCounts: { FilesScanned: scanned },
      blockedDecision: 'BLOCKED_BY_SECRET_SCAN',
      warningDecision: 'SECRET_WARNINGS',
      passDecision: 'PASS_SECRET_SCAN',
    };
  },
});

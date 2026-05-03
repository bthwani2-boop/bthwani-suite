import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, gitLsFiles, runGuard } from './_guard-common.mjs';

const canonicalServices = ['dsh', 'wlt', 'knz', 'arb', 'amn', 'esf', 'mrf', 'snd', 'kwd'];
const appRoots = ['app-client', 'app-partner', 'app-captain', 'app-field', 'control-panel', 'webapp', 'website', 'ui-kit'];

function gitChangedFilesRange() {
  try {
    const out = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], { cwd: ROOT, encoding: 'utf8' });
    return out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  } catch (e) {
    try { const out2 = execFileSync('git', ['diff', '--name-only', 'HEAD~1..HEAD'], { cwd: ROOT, encoding: 'utf8' }); return out2.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);} catch {return [];}
  }
}

runGuard({
  guardId: 'GUARD-09_RUNTIME_SMOKE_TEST',
  guardName: 'Runtime Smoke Test Proof',
  prefix: 'GUARD_09_RUNTIME_SMOKE_TEST',
  configPath: 'tools/guards/guard-runtime-smoke-test.config.json',
  collect: ({ config }) => {
    const changed = gitChangedFilesRange();
    const files = changed.length ? changed : gitLsFiles();
    const serviceDirs = new Set();
    for (const f of files) {
      for (const service of canonicalServices) {
        if (f === service || f.startsWith(`${service}/`)) {
          serviceDirs.add(service);
        }
      }
      for (const root of appRoots) {
        if (f === root || f.startsWith(`${root}/`)) {
          serviceDirs.add(root);
        }
      }
    }

    const findings = [];
    const runsRoot = path.join(ROOT, 'tools', 'registry', 'runs');
    const runDirs = fs.existsSync(runsRoot) ? fs.readdirSync(runsRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(runsRoot, d.name)).slice(-config.checkEvidenceRuns) : [];

    for (const sd of [...serviceDirs]) {
      let evidenceFound = false;
      for (const rd of runDirs) {
        try {
          const ej = path.join(rd, 'evidence.json');
          if (fs.existsSync(ej)) {
            const ejt = fs.readFileSync(ej, 'utf8').toLowerCase();
            if (config.evidenceKeywords.some((k) => ejt.includes(k)) || ejt.includes(path.basename(sd))) { evidenceFound = true; break; }
          }
        } catch (e) { /* ignore */ }
      }
      if (!evidenceFound) {
        findings.push({ type: 'MISSING_RUNTIME_SMOKE', severity: 'error', file: sd, reason: 'Service changed but no runtime smoke evidence (logs/screenshots) found in recent evidence runs.' });
      }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'runtime-smoke-findings.csv',
      baseCounts: { ServiceDirs: serviceDirs.size },
      blockedDecision: 'BLOCKED_BY_RUNTIME_SMOKE',
      warningDecision: 'RUNTIME_SMOKE_WARNINGS',
      passDecision: 'PASS_RUNTIME_SMOKE',
    };
  },
});

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, gitLsFiles, runGuard } from './_guard-common.mjs';

function gitChangedFilesRange() {
  try {
    const out = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], { cwd: ROOT, encoding: 'utf8' });
    return out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  } catch (e) {
    try {
      const out2 = execFileSync('git', ['diff', '--name-only', 'HEAD~1..HEAD'], { cwd: ROOT, encoding: 'utf8' });
      return out2.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    } catch (e2) {
      return [];
    }
  }
}

runGuard({
  guardId: 'GUARD-14_VISUAL_REGRESSION_EVIDENCE',
  guardName: 'Visual Regression Evidence',
  prefix: 'GUARD_14_VISUAL_REG_EVID',
  configPath: 'tools/guards/guard-visual-regression-evidence.config.json',
  collect: ({ config }) => {
    const changed = gitChangedFilesRange();
    const files = changed.length ? changed : gitLsFiles();
    const uiFiles = files.filter((f) => /\.(tsx|jsx|css|scss|png|jpg|jpeg)$/i.test(f) && (f.includes('packages/surfaces') || f.includes('apps/')));
    const serviceDirs = new Set();
    for (const f of uiFiles) {
      const m = f.match(/^packages\/surfaces\/src\/service-owned\/([^/]+)\//);
      if (m) serviceDirs.add(`packages/surfaces/src/service-owned/${m[1]}`);
      else if (f.includes('apps/')) serviceDirs.add('apps');
    }

    const findings = [];
    const runsRoot = path.join(ROOT, 'tools', 'registry', 'runs');
    const runDirs = fs.existsSync(runsRoot) ? fs.readdirSync(runsRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(runsRoot, d.name)).slice(-config.checkEvidenceRuns) : [];

    for (const sd of [...serviceDirs]) {
      let evidenceFound = false;
      for (const rd of runDirs) {
        try {
          const filesInRun = fs.readdirSync(rd);
          // direct screenshots
          if (filesInRun.some((n) => config.screenshotExtensions.some((ext) => n.toLowerCase().endsWith(ext)))) {
            evidenceFound = true;
            break;
          }
          const ej = path.join(rd, 'evidence.json');
          if (fs.existsSync(ej)) {
            const ejt = fs.readFileSync(ej, 'utf8');
            if (ejt.includes(sd) || ejt.includes(path.basename(sd))) { evidenceFound = true; break; }
          }
        } catch (e) { /* ignore */ }
      }
      if (!evidenceFound) {
        findings.push({ type: 'MISSING_VISUAL_EVIDENCE', severity: 'error', file: sd, reason: 'UI-affecting change detected but no visual evidence (screenshots) found in recent evidence runs.' });
      }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'visual-evidence-findings.csv',
      baseCounts: { UIFilesScanned: uiFiles.length, ServiceDirs: serviceDirs.size },
      blockedDecision: 'NEEDS_VISUAL_EVIDENCE',
      warningDecision: 'NEEDS_VISUAL_WARNINGS',
      passDecision: 'PASS_VISUAL_EVIDENCE',
    };
  },
});

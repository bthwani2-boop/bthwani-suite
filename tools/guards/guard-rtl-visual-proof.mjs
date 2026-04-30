import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, gitLsFiles, runGuard } from './_guard-common.mjs';

function gitChangedFilesRange() {
  try {
    const out = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], { cwd: ROOT, encoding: 'utf8' });
    return out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  } catch (e) {
    try { const out2 = execFileSync('git', ['diff', '--name-only', 'HEAD~1..HEAD'], { cwd: ROOT, encoding: 'utf8' }); return out2.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);} catch {return [];}
  }
}

runGuard({
  guardId: 'GUARD-09_RTL_VISUAL_PROOF',
  guardName: 'RTL Visual Proof',
  prefix: 'GUARD_09_RTL_VISUAL_PROOF',
  configPath: 'tools/guards/guard-rtl-visual-proof.config.json',
  collect: ({ config }) => {
    const changed = gitChangedFilesRange();
    const files = changed.length ? changed : gitLsFiles();
    const uiFiles = files.filter((f) => /\.(tsx|jsx|css|scss)$/i.test(f) && (f.includes('packages/surfaces') || f.includes('apps/')));
    const arabicFiles = [];
    for (const f of uiFiles) {
      try {
        const txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
        if (/[\u0600-\u06FF\u0750-\u077F]/.test(txt)) arabicFiles.push(f);
      } catch (e) { /* ignore */ }
    }

    const findings = [];
    if (!arabicFiles.length) return { findings, headers: ['type','severity','file','reason'], issueFileName: 'rtl-visual-findings.csv', baseCounts: { ArabicFiles: 0 }, blockedDecision: 'PASS_NO_RTL_CHANGES', warningDecision: 'PASS_NO_RTL_CHANGES', passDecision: 'PASS_NO_RTL_CHANGES' };

    const runsRoot = path.join(ROOT, 'tools', 'registry', 'runs');
    const runDirs = fs.existsSync(runsRoot) ? fs.readdirSync(runsRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(runsRoot, d.name)).slice(-config.checkEvidenceRuns) : [];

    for (const f of arabicFiles) {
      let evidenceFound = false;
      for (const rd of runDirs) {
        try {
          const ej = path.join(rd, 'evidence.json');
          if (fs.existsSync(ej)) {
            const ejt = fs.readFileSync(ej, 'utf8').toLowerCase();
            if (config.evidenceKeywords.some((k) => ejt.includes(k.toLowerCase())) || ejt.includes(path.basename(f).toLowerCase())) { evidenceFound = true; break; }
          }
          const filesInRun = fs.readdirSync(rd);
          if (filesInRun.some((n) => n.toLowerCase().includes('rtl') || n.toLowerCase().includes('arabic'))) { evidenceFound = true; break; }
        } catch (e) { /* ignore */ }
      }
      if (!evidenceFound) findings.push({ type: 'MISSING_RTL_VISUAL', severity: 'error', file: f, reason: 'RTL/Arabic content changed but no RTL visual evidence found in recent evidence runs.' });
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'rtl-visual-findings.csv',
      baseCounts: { ArabicFilesScanned: arabicFiles.length },
      blockedDecision: 'NEEDS_RTL_VISUAL_EVIDENCE',
      warningDecision: 'RTl_VISUAL_WARNINGS',
      passDecision: 'PASS_RTL_VISUAL_PROOF',
    };
  },
});

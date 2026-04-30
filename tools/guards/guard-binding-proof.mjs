import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, runGuard, readTextSafe } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-08_BINDING_PROOF',
  guardName: 'Binding Proof (API client + runtime evidence)',
  prefix: 'GUARD_08_BINDING_PROOF',
  configPath: 'tools/guards/guard-binding-proof.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles();
    const screenFiles = files.filter((f) => /Screen\.(tsx|ts|jsx|js)$/.test(f) && f.includes('packages/surfaces/src/service-owned/'));
    const findings = [];

    const evidenceRootBase = path.join(ROOT, 'tools', 'registry', 'runs');

    for (const file of screenFiles) {
      const full = path.join(ROOT, file);
      const txt = readTextSafe(full);
      // escape possible regex meta-characters in configured patterns
      const safePatterns = (config.dataImportPatterns || []).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const hasData = new RegExp(safePatterns.join('|'), 'i').test(txt);
      if (!hasData) continue; // UI-only screen, skip binding proof requirement

      // Attempt to find evidence that mentions the screen or path in evidence runs
      let evidenceFound = false;
      try {
        if (fs.existsSync(evidenceRootBase)) {
          const runDirs = fs.readdirSync(evidenceRootBase, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => path.join(evidenceRootBase, d.name));
          for (const rd of runDirs) {
            const ej = path.join(rd, 'evidence.json');
            if (!fs.existsSync(ej)) continue;
            const content = fs.readFileSync(ej, 'utf8');
            if (content.includes(file) || content.includes(path.basename(file))) {
              evidenceFound = true;
              break;
            }
          }
        }
      } catch (e) {
        // ignore
      }

      if (!evidenceFound) {
        findings.push({ type: 'MISSING_BINDING_EVIDENCE', severity: 'error', file, reason: 'Screen imports data but no binding/runtime evidence (logs/screenshots) found under tools/registry/runs.' });
      }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'binding-proof-findings.csv',
      baseCounts: { ScreenFilesScanned: screenFiles.length },
      blockedDecision: 'BLOCKED_BY_BINDING_PROOF',
      warningDecision: 'BINDING_PROOF_MISSING_WARNINGS',
      passDecision: 'PASS_BINDING_PROOF',
    };
  },
});

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, readTextSafe, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-24_EVIDENCE_TO_COMMIT_TRACEABILITY',
  guardName: 'Evidence-to-Commit Traceability',
  prefix: 'GUARD_24_EVIDENCE_TO_COMMIT_TRACEABILITY',
  configPath: 'tools/guards/guard-evidence-to-commit-traceability.config.json',
  collect: () => {
    const runsRoot = path.join(ROOT, 'tools', 'registry', 'runs');
    const runs = fs.existsSync(runsRoot) ? fs.readdirSync(runsRoot, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort().reverse().slice(0, 250) : [];
    const findings = [];
    for (const run of runs) {
      const runPath = path.join(runsRoot, run);
      const files = new Set(fs.readdirSync(runPath, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name));
      const hasCommitArtifact = files.has('git-commit.txt') || files.has('git-push.txt');
      const evidencePath = path.join(runPath, 'evidence.json');
      const evidenceText = readTextSafe(evidencePath);
      const hasCommitSha = /"commit_sha"\s*:\s*"[0-9a-f]{7,40}"/i.test(evidenceText) || /CommitSha:\s*[0-9a-f]{7,40}/i.test(readTextSafe(path.join(runPath, 'SUMMARY.md')));
      if (hasCommitArtifact && !hasCommitSha) findings.push({ type: 'COMMIT_RUN_WITHOUT_COMMIT_SHA_TRACE', severity: 'warning', run, path: `tools/registry/runs/${run}`, reason: 'Run has commit/push artifact but no commit_sha trace in evidence.json or SUMMARY.md.' });
    }
    return {
      findings,
      headers: ['type', 'severity', 'run', 'path', 'reason'],
      issueFileName: 'evidence-to-commit-traceability-findings.csv',
      baseCounts: { RunsScanned: runs.length },
      blockedDecision: 'BLOCKED_BY_EVIDENCE_TO_COMMIT_TRACEABILITY',
      warningDecision: 'READY_FOR_EVIDENCE_TRACEABILITY_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_EVIDENCE_TO_COMMIT_TRACEABILITY_GUARD',
    };
  },
});

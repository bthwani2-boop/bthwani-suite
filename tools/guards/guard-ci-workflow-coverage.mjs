import path from 'node:path';
import { ROOT, gitLsFiles, readTextSafe, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-15_CI_WORKFLOW_COVERAGE',
  guardName: 'CI Workflow Coverage',
  prefix: 'GUARD_15_CI_WORKFLOW_COVERAGE',
  configPath: 'tools/guards/guard-ci-workflow-coverage.config.json',
  collect: ({ config }) => {
    const workflows = gitLsFiles().filter((file) => file.startsWith('.github/workflows/') && /\.(yml|yaml)$/i.test(file));
    const allText = workflows.map((file) => readTextSafe(path.join(ROOT, file))).join('\n');
    const findings = [];
    for (const script of config.requiredGuardScripts ?? []) {
      if (!allText.includes(script)) {
        findings.push({ type: 'CI_MISSING_GUARD_SCRIPT_COVERAGE', severity: 'warning', file: '.github/workflows', guard_script: script, reason: 'Workflow does not reference this guard script yet.' });
      }
    }
    if (!/tsc\s+--noEmit/.test(allText)) findings.push({ type: 'CI_MISSING_TSC_NOEMIT', severity: 'warning', file: '.github/workflows', guard_script: 'tsc --noEmit', reason: 'Workflow does not visibly run TypeScript noEmit check.' });
    return {
      findings,
      headers: ['type', 'severity', 'file', 'guard_script', 'reason'],
      issueFileName: 'ci-workflow-coverage-findings.csv',
      baseCounts: { WorkflowsScanned: workflows.length },
      blockedDecision: 'BLOCKED_BY_CI_WORKFLOW_COVERAGE',
      warningDecision: 'READY_FOR_CI_WORKFLOW_COVERAGE_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_CI_WORKFLOW_COVERAGE_GUARD',
    };
  },
});

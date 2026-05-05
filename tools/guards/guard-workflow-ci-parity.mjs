import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, readTextSafe, exists } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('WORKFLOW-CI-PARITY', 'governance/13_CI_AND_GATES.md');
const root = args.root;

const baseline = '.github/workflows/governance-baseline.yml';
const guardWorkflow = '.github/workflows/governance-guards.yml';

if (!exists(root, baseline)) {
  report.fail(baseline, 'Governance baseline workflow is missing.');
} else {
  const text = readTextSafe(path.join(root, baseline));
  for (const required of ['gitleaks', 'dependency-cruiser', 'spectral']) {
    if (!text.toLowerCase().includes(required)) {
      report.warn(baseline, `Baseline workflow may be missing ${required}.`);
    }
  }
}

if (!exists(root, guardWorkflow)) {
  report.warn(guardWorkflow, 'Governance guards workflow is missing. Install this package or wire the runner into CI.');
} else {
  const text = readTextSafe(path.join(root, guardWorkflow));
  if (!text.includes('RUN_GOVERNANCE_GUARDS.ps1')) {
    report.fail(guardWorkflow, 'Governance guards workflow must invoke RUN_GOVERNANCE_GUARDS.ps1.');
  }
  if (!/pull_request:|push:|workflow_dispatch:/.test(text)) {
    report.warn(guardWorkflow, 'Workflow should run on PR/push/workflow_dispatch.');
  }
}

const packageJson = path.join(root, 'package.json');
if (fs.existsSync(packageJson)) {
  const text = readTextSafe(packageJson);
  if (!text.includes('guard:agent-governance') || !text.includes('guard:i18n-direction')) {
    report.warn('package.json', 'Existing package scripts may not expose all current guards. This package does not change package.json automatically.');
  }
}

finalize(report, args);

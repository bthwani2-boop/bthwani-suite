import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, readJson } from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const config = readJson(path.join(root, 'tools/guards/guard-evidence-registry-runs-hygiene.config.json'));
const report = createReport('EVIDENCE-REGISTRY-RUNS-HYGIENE', 'governance/11_EVIDENCE_AND_TRACEABILITY.md');

const registryRoot = path.join(root, config.registryRoot ?? 'tools/registry/runs');
if (!fs.existsSync(registryRoot)) {
  report.fail(config.registryRoot ?? 'tools/registry/runs', 'Evidence registry root is missing.');
  finalize(report, args);
  process.exit(process.exitCode ?? 1);
}

const excluded = (runName) => (config.excludeRunNamePatterns ?? []).some((pattern) => new RegExp(pattern).test(runName));
const runNames = fs.readdirSync(registryRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !excluded(name))
  .sort()
  .reverse()
  .slice(0, Number(config.maxRunsToScan ?? 120));

for (const runName of runNames) {
  const runPath = path.join(registryRoot, runName);
  const names = new Set(fs.readdirSync(runPath));
  const expectedZip = `${runName}.zip`;

  if (!names.has(expectedZip)) {
    report.warn(path.join(config.registryRoot, runName).replace(/\\/g, '/'), 'Run folder is missing the canonical {SESSION_ID}.zip.', expectedZip);
  }
  if (names.has('_HANDOFF.zip')) {
    report.warn(path.join(config.registryRoot, runName).replace(/\\/g, '/'), 'Legacy _HANDOFF.zip detected in evidence run.', '_HANDOFF.zip');
  }
  if (!names.has('SUMMARY.md')) {
    report.warn(path.join(config.registryRoot, runName).replace(/\\/g, '/'), 'Run folder is missing SUMMARY.md.');
  }
  if (!names.has('evidence.json')) {
    report.warn(path.join(config.registryRoot, runName).replace(/\\/g, '/'), 'Run folder is missing evidence.json.');
  }

  for (const name of names) {
    const full = path.join(runPath, name);
    if (!fs.statSync(full).isFile()) continue;
    if (fs.statSync(full).size === 0) {
      report.warn(path.join(config.registryRoot, runName, name).replace(/\\/g, '/'), 'Evidence file is zero bytes.');
    }
  }
}

finalize(report, args);

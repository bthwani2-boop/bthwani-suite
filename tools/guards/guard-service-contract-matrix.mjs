import path from 'node:path';
import { parseArgs, createReport, finalize, exists, readJson } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('SERVICE-CONTRACT-MATRIX', 'governance/10_SERVICE_CLOSURE.md');
const root = args.root;
const config = readJson(path.join(root, 'tools/guards/guard-service-contract-matrix.config.json'));
const canonicalServices = config.canonicalServices ?? [];

for (const service of canonicalServices) {
  const base = `${service}`;
  if (!exists(root, base)) {
    report.warn(base, 'Canonical service folder is missing. This may be acceptable before service implementation, but cannot be CLOSED.');
    continue;
  }
  if (!exists(root, `${base}/docs/SERVICE_BLUEPRINT.md`)) {
    report.warn(`${base}/docs/SERVICE_BLUEPRINT.md`, 'Service blueprint missing. Required before service closure.');
  }
  if (!exists(root, `${base}/${base}.openapi.yaml`)) {
    report.warn(`${base}/${base}.openapi.yaml`, 'Canonical OpenAPI contract placeholder missing for the root service.');
  }
}

finalize(report, args);

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, exists } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('SERVICE-CONTRACT-MATRIX', 'governance/10_SERVICE_CLOSURE.md');
const root = args.root;
const canonicalServices = ['dsh', 'wlt', 'knz', 'arb', 'amn', 'esf', 'mrf', 'snd', 'kwd'];
const legacyServicesRoot = path.join(root, 'packages', 'surfaces', 'src', 'service-owned');
const governedTemplateServices = ['demo-service'];
const forbiddenStandalone = ['exchangeprice', 'hr'];

if (fs.existsSync(legacyServicesRoot)) {
  const present = fs.readdirSync(legacyServicesRoot, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
  for (const name of forbiddenStandalone) {
    if (present.includes(name)) {
      report.fail(`legacy-nested-surface-root/${name}`, `${name} must not exist as a standalone canonical service.`);
    }
  }
  for (const name of present) {
    if (!canonicalServices.includes(name) && !governedTemplateServices.includes(name) && !name.startsWith('_')) {
      report.warn(`legacy-nested-surface-root/${name}`, 'Legacy compatibility-only service folder found. Canonical truth now lives at the root service folder.');
    }
  }
}

for (const service of canonicalServices) {
  const base = `${service}`;
  if (!exists(root, base)) {
    report.warn(base, 'Canonical service folder is missing. This may be acceptable before service implementation, but cannot be CLOSED.');
    continue;
  }
  if (!exists(root, `${base}/SERVICE_BLUEPRINT.md`)) {
    report.warn(`${base}/SERVICE_BLUEPRINT.md`, 'Service blueprint missing. Required before service closure.');
  }
  if (!exists(root, `${base}/service-meta.ts`) && !exists(root, `${base}/service-meta.json`)) {
    report.warn(`${base}/service-meta.ts`, 'Service meta missing. Required before service closure.');
  }
  if (!exists(root, `${base}/${base}.openapi.yaml`)) {
    report.warn(`${base}/${base}.openapi.yaml`, 'Canonical OpenAPI contract placeholder missing for the root service.');
  }
}

finalize(report, args);

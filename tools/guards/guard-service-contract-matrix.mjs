import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, exists } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('SERVICE-CONTRACT-MATRIX', 'governance/10_SERVICE_CLOSURE.md');
const root = args.root;
const servicesRoot = path.join(root, 'packages/surfaces/src/service-owned');
const canonicalServices = ['dsh', 'wlt', 'knz', 'arb', 'amn', 'esf', 'mrf', 'snd', 'kwd'];
const governedTemplateServices = ['demo-service'];
const forbiddenStandalone = ['exchangeprice', 'hr'];

if (!fs.existsSync(servicesRoot)) {
  report.warn('packages/surfaces/src/service-owned', 'Service-owned surfaces root is missing or not yet created.');
} else {
  const present = fs.readdirSync(servicesRoot, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
  for (const name of forbiddenStandalone) {
    if (present.includes(name)) {
      report.fail(`packages/surfaces/src/service-owned/${name}`, `${name} must not exist as a standalone canonical service.`);
    }
  }
  for (const name of present) {
    if (!canonicalServices.includes(name) && !governedTemplateServices.includes(name) && !name.startsWith('_')) {
      report.warn(`packages/surfaces/src/service-owned/${name}`, 'Non-canonical service folder found. Classify as TBD/legacy or add a governance decision.');
    }
  }
  for (const template of governedTemplateServices) {
    if (!present.includes(template)) continue;
    const base = `packages/surfaces/src/service-owned/${template}`;
    if (!exists(root, `${base}/SERVICE_BLUEPRINT.md`)) {
      report.warn(`${base}/SERVICE_BLUEPRINT.md`, 'Governed template service is missing its blueprint scaffold.');
    }
    if (!exists(root, `${base}/service-meta.ts`) && !exists(root, `${base}/service-meta.json`)) {
      report.warn(`${base}/service-meta.ts`, 'Governed template service is missing service metadata.');
    }
  }
  for (const service of canonicalServices) {
    const base = `packages/surfaces/src/service-owned/${service}`;
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
  }
}

finalize(report, args);

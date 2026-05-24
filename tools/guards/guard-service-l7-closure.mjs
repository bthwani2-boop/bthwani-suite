#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createReport, exists, finalize, readJson, readText, readTextSafe } from './lib/guard-utils.mjs';

function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), jsonOut: '', mdOut: '', mode: 'local', service: '', slice: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--root') args.root = argv[++i];
    else if (token === '--json-out') args.jsonOut = argv[++i];
    else if (token === '--md-out') args.mdOut = argv[++i];
    else if (token === '--mode') args.mode = argv[++i];
    else if (token === '--service') args.service = argv[++i];
    else if (token === '--slice') args.slice = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token.startsWith('--json-out=')) args.jsonOut = token.slice('--json-out='.length);
    else if (token.startsWith('--md-out=')) args.mdOut = token.slice('--md-out='.length);
    else if (token.startsWith('--mode=')) args.mode = token.slice('--mode='.length);
    else if (token.startsWith('--service=')) args.service = token.slice('--service='.length);
    else if (token.startsWith('--slice=')) args.slice = token.slice('--slice='.length);
    else throw new Error(`Unknown argument: ${token}`);
  }
  args.root = path.resolve(args.root);
  return args;
}

function findEvidenceFolders(root, prefix) {
  const runsDir = path.join(root, 'tools/registry/runs');
  if (!fs.existsSync(runsDir)) return [];
  return fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => ({ name: entry.name, absPath: path.join(runsDir, entry.name) }));
}

function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(abs));
    else if (entry.isFile()) out.push(abs);
  }
  return out;
}

function hasClosureClaim(text) {
  return /L7_CLOSED|LAYER_7_CLOSED|BATCH_9D_REAL_RUNTIME_PROVEN_READY_FOR_FINAL_CLOSURE|REAL_RUNTIME_PROVEN_READY_FOR_FINAL_CLOSURE|(?<!READY_FOR_)FINAL_CLOSURE/i.test(text);
}

function checkEvidenceFolder(report, folder, slice) {
  const files = walkFiles(folder.absPath);
  const basenames = new Set(files.map((file) => path.basename(file)));
  for (const required of slice.requiredEvidenceFiles ?? []) {
    if (!basenames.has(required)) {
      report.fail(`tools/registry/runs/${folder.name}`, `Required evidence file "${required}" is missing.`, 'Re-run the runtime proof and capture the full evidence pack.');
    }
  }

  const allText = files
    .filter((file) => /\.(txt|md|json|log)$/i.test(file))
    .map((file) => readTextSafe(file))
    .join('\n');

  for (const token of slice.requiredEvidenceText ?? []) {
    if (!new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(allText)) {
      report.fail(`tools/registry/runs/${folder.name}`, `Required evidence text "${token}" is missing.`, 'Capture explicit runtime proof text.');
    }
  }

  for (const token of slice.requiredChainTokens ?? []) {
    if (!new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(allText)) {
      report.fail(`tools/registry/runs/${folder.name}`, `Runtime chain token "${token}" is missing.`, 'Evidence must prove UI -> typed client -> Go -> PostgreSQL -> response -> screen.');
    }
  }

  if (slice.requiresScreenshot) {
    const screenshots = files.filter((file) => /\.(png|jpe?g|webp)$/i.test(file));
    if (screenshots.length === 0) {
      report.fail(`tools/registry/runs/${folder.name}`, 'Required screenshot evidence is missing.', 'Capture Home success plus empty/error/offline screenshots before closure.');
    }
  }
}

const args = parseArgs();
const report = createReport(`GUARD_SERVICE_L7_CLOSURE[${args.service || 'missing'}]`, [
  'governance/10_SERVICE_CLOSURE.md',
  'governance/11_EVIDENCE_AND_TRACEABILITY.md',
]);

if (!args.service) {
  report.fail('(args)', '--service <id> is required.', 'Example: node tools/guards/guard-service-l7-closure.mjs --service dsh --slice DSH-SLICE-001');
  finalize(report, args);
  process.exit();
}

const configPath = 'tools/guards/guard-service-runtime.config.json';
if (!exists(args.root, configPath)) {
  report.fail(configPath, 'Generic service runtime config is missing.', 'Create tools/guards/guard-service-runtime.config.json.');
  finalize(report, args);
  process.exit();
}

const config = readJson(path.join(args.root, configPath));
const service = config.services?.[args.service];
if (!service) {
  report.fail(configPath, `Service "${args.service}" is not registered.`, 'Add the service to guard-service-runtime.config.json.');
  finalize(report, args);
  process.exit();
}

const slices = args.slice ? { [args.slice]: service.slices?.[args.slice] } : (service.slices ?? {});
for (const [sliceId, slice] of Object.entries(slices)) {
  if (!slice) {
    report.fail(configPath, `Slice "${sliceId}" is not registered for service "${args.service}".`, 'Register the slice before checking it.');
    continue;
  }

  const docText = slice.docPath && exists(args.root, slice.docPath) ? readText(path.join(args.root, slice.docPath)) : '';
  const matrixText = slice.runtimeMatrixPath && exists(args.root, slice.runtimeMatrixPath) ? readText(path.join(args.root, slice.runtimeMatrixPath)) : '';
  const combinedDocs = `${docText}\n${matrixText}`;
  const closureClaimed = hasClosureClaim(combinedDocs);
  const proofPending = /E2E_PROOF_PENDING/i.test(combinedDocs);
  const folders = findEvidenceFolders(args.root, slice.evidenceFolderPrefix ?? '');

  if (closureClaimed && folders.length === 0) {
    report.fail(slice.docPath ?? sliceId, `[${sliceId}] Closure is claimed without a matching evidence folder.`, `Expected tools/registry/runs/${slice.evidenceFolderPrefix}<timestamp>/.`);
  }
  if (closureClaimed && proofPending) {
    report.fail(slice.runtimeMatrixPath ?? slice.docPath ?? sliceId, `[${sliceId}] Closure claim conflicts with E2E_PROOF_PENDING.`, 'Remove the closure claim or complete evidence first.');
  }
  if (!closureClaimed && folders.length === 0) {
    report.info(`tools/registry/runs/${slice.evidenceFolderPrefix ?? ''}*`, `[${sliceId}] No closure claim and no evidence folder were found.`, 'Pre-closure state is acceptable.');
  }
  for (const folder of folders) {
    checkEvidenceFolder(report, folder, slice);
  }
}

finalize(report, args);

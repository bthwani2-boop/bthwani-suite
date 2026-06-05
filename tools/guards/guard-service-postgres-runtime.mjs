#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createReport, exists, finalize, readJson, readText } from './lib/guard-utils.mjs';

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

function loadService(root, serviceId, report) {
  const configPath = 'tools/guards/guard-service-runtime.config.json';
  if (!exists(root, configPath)) {
    report.fail(configPath, 'Generic service runtime config is missing.', 'Create tools/guards/guard-service-runtime.config.json.');
    return null;
  }
  const config = readJson(path.join(root, configPath));
  const service = config.services?.[serviceId];
  if (!service) {
    report.fail(configPath, `Service "${serviceId}" is not registered.`, 'Add the service to guard-service-runtime.config.json.');
    return null;
  }
  return service;
}

function collectComposeServiceNames(text) {
  const lines = text.replace(/\t/g, '  ').split(/\r?\n/);
  const names = [];
  let inServices = false;
  for (const line of lines) {
    if (/^\s*#/.test(line) || /^\s*$/.test(line)) continue;
    if (/^services:\s*$/.test(line)) {
      inServices = true;
      continue;
    }
    if (inServices && /^\S/.test(line)) break;
    const match = inServices ? line.match(/^ {2}([A-Za-z0-9_.-]+):\s*(?:#.*)?$/) : null;
    if (match) names.push(match[1]);
  }
  return names;
}

function extractCreatedTables(sql) {
  return [...sql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?("?[\w.]+"?)/gi)]
    .map((match) => match[1].replace(/"/g, ''));
}

function extractInsertTables(sql) {
  return [...sql.matchAll(/INSERT\s+INTO\s+("?[\w.]+"?)/gi)]
    .map((match) => match[1].replace(/"/g, ''));
}

const args = parseArgs();
const report = createReport(`GUARD_SERVICE_POSTGRES_RUNTIME[${args.service || 'missing'}]`, [
  'governance/09_API_BINDING_RUNTIME.md',
  'governance/10_SERVICE_CLOSURE.md',
]);

if (!args.service) {
  report.fail('(args)', '--service <id> is required.', 'Example: node tools/guards/guard-service-postgres-runtime.mjs --service dsh');
  finalize(report, args);
  process.exit();
}

const service = loadService(args.root, args.service, report);
if (service) {
  if (!service.composePath || !exists(args.root, service.composePath)) {
    report.fail(service.composePath ?? '(composePath)', `Compose file is missing for service "${args.service}".`, 'Register or restore docker-compose.local.yml.');
  } else {
    const composeText = readText(path.join(args.root, service.composePath));
    const serviceNames = collectComposeServiceNames(composeText);
    const allowed = new Set(service.allowedComposeServices ?? []);
    if (serviceNames.length === 0) {
      report.fail(service.composePath, 'No docker compose services were detected.', 'Expected exactly the registered PostgreSQL service.');
    }
    for (const name of serviceNames) {
      if (!allowed.has(name)) {
        report.fail(service.composePath, `Unexpected compose service "${name}" detected.`, `Allowed services: ${[...allowed].join(', ')}`);
      }
    }
    if (!serviceNames.some((name) => /postgres/i.test(name)) && !/image:\s*postgres/i.test(composeText)) {
      report.fail(service.composePath, 'PostgreSQL service was not detected.', 'The local runtime compose must contain PostgreSQL only.');
    }
    for (const term of service.forbiddenComposeTerms ?? []) {
      if (new RegExp(`\\b${term}\\b`, 'i').test(composeText)) {
        report.fail(service.composePath, `Forbidden compose/runtime term "${term}" detected.`, 'Remove non-PostgreSQL dependencies from this slice compose file.');
      }
    }
  }

  const allowedTables = new Set(service.allowedTables ?? []);
  const requiredColumns = service.requiredTableColumns ?? [];
  const migrationSqlTexts = [];
  for (const rel of service.migrationFiles ?? []) {
    if (!exists(args.root, rel)) {
      report.fail(rel, 'Required migration file is missing.', 'Restore the registered migration file.');
      continue;
    }
    const sql = readText(path.join(args.root, rel));
    migrationSqlTexts.push(sql);
    const tables = extractCreatedTables(sql);
    const isAlterOnly = tables.length === 0 && /ALTER\s+TABLE/i.test(sql);
    if (tables.length === 0 && !isAlterOnly) {
      report.fail(rel, 'No CREATE TABLE or ALTER TABLE statement found.', 'Migration must define or extend the slice table.');
    }
    for (const table of tables) {
      if (!allowedTables.has(table)) report.fail(rel, `Unexpected table "${table}" created.`, `Allowed tables: ${[...allowedTables].join(', ')}`);
    }
  }
  // Check required columns across all migration files combined (columns may be added across CREATE + ALTER TABLE migrations)
  const combinedSql = migrationSqlTexts.join('\n');
  for (const column of requiredColumns) {
    if (!new RegExp(`\\b${column}\\b`, 'i').test(combinedSql)) {
      report.fail('(migrations combined)', `Required column "${column}" is missing across all migration files.`, 'Keep the table scoped to store discovery summary data.');
    }
  }

  for (const rel of service.seedFiles ?? []) {
    if (!exists(args.root, rel)) {
      report.fail(rel, 'Required seed file is missing.', 'Restore the registered seed file.');
      continue;
    }
    const sql = readText(path.join(args.root, rel));
    const tables = extractInsertTables(sql);
    if (tables.length === 0) report.fail(rel, 'No INSERT INTO statement found.', 'Seed must insert local proof data.');
    for (const table of tables) {
      if (!allowedTables.has(table)) report.fail(rel, `Seed inserts into unexpected table "${table}".`, `Allowed tables: ${[...allowedTables].join(', ')}`);
    }
  }

  for (const rel of [...(service.migrationFiles ?? []), ...(service.seedFiles ?? [])]) {
    if (exists(args.root, rel) && fs.statSync(path.join(args.root, rel)).size === 0) {
      report.fail(rel, 'Registered SQL file is empty.', 'Restore the SQL content.');
    }
  }
}

finalize(report, args);

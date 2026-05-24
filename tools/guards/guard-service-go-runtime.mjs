#!/usr/bin/env node
import path from 'node:path';
import { execFileSync } from 'node:child_process';
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

function collectAllowedRoutes(service, sliceId) {
  const routes = new Set();
  const slices = service.slices ?? {};
  const entries = sliceId ? [[sliceId, slices[sliceId]]] : Object.entries(slices);
  for (const [id, slice] of entries) {
    if (!slice) continue;
    for (const route of slice.allowedRoutes ?? []) routes.add(route);
  }
  return routes;
}

function collectRegisteredRoutes(text) {
  const routes = new Set();
  const patterns = [
    /mux\.Handle(?:Func)?\s*\(\s*"([^"]+)"/g,
    /http\.Handle(?:Func)?\s*\(\s*"([^"]+)"/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) routes.add(match[1]);
  }
  return [...routes];
}

const args = parseArgs();
const report = createReport(`GUARD_SERVICE_GO_RUNTIME[${args.service || 'missing'}]`, [
  'governance/09_API_BINDING_RUNTIME.md',
  'governance/10_SERVICE_CLOSURE.md',
]);

if (!args.service) {
  report.fail('(args)', '--service <id> is required.', 'Example: node tools/guards/guard-service-go-runtime.mjs --service dsh');
  finalize(report, args);
  process.exit();
}

const service = loadService(args.root, args.service, report);
if (service) {
  const requiredFiles = [
    service.goModPath,
    service.mainPath,
    service.repositoryInterfacePath,
    service.postgresRepositoryPath,
    ...(service.routeRegistrationPaths ?? []),
  ].filter(Boolean);

  for (const rel of requiredFiles) {
    if (!exists(args.root, rel)) report.fail(rel, `Required Go runtime file is missing for service "${args.service}".`, 'Restore or register the correct file.');
  }

  const allowedRoutes = collectAllowedRoutes(service, args.slice);
  if (args.slice && !service.slices?.[args.slice]) {
    report.fail('tools/guards/guard-service-runtime.config.json', `Slice "${args.slice}" is not registered for service "${args.service}".`, 'Register the slice before checking it.');
  }
  if (allowedRoutes.size === 0) {
    report.fail('tools/guards/guard-service-runtime.config.json', `No allowed routes are registered for service "${args.service}".`, 'Add allowedRoutes to the service slice config.');
  }

  const registeredRoutes = new Set();
  for (const rel of service.routeRegistrationPaths ?? []) {
    if (!exists(args.root, rel)) continue;
    for (const route of collectRegisteredRoutes(readText(path.join(args.root, rel)))) registeredRoutes.add(route);
  }
  if (registeredRoutes.size === 0) {
    report.fail(service.routeRegistrationPaths?.[0] ?? '(routeRegistrationPaths)', 'No registered Go HTTP routes were detected.', 'Use mux.Handle/mux.HandleFunc or add the route registration file to config.');
  }
  for (const route of registeredRoutes) {
    if (!allowedRoutes.has(route)) {
      report.fail(service.routeRegistrationPaths?.join(', ') ?? '(routes)', `Undocumented endpoint "${route}" is registered for service "${args.service}".`, `Allowed routes: ${[...allowedRoutes].join(', ')}`);
    }
  }

  if (service.repositoryInterfacePath && exists(args.root, service.repositoryInterfacePath)) {
    const text = readText(path.join(args.root, service.repositoryInterfacePath));
    if (!/type\s+Repository\s+interface\s*\{/.test(text)) {
      report.fail(service.repositoryInterfacePath, 'Repository interface is missing.', 'Expected type Repository interface { ... }.');
    }
    for (const method of service.repositoryRequiredMethods ?? []) {
      if (!new RegExp(`\\b${method}\\s*\\(`).test(text)) {
        report.fail(service.repositoryInterfacePath, `Repository method "${method}" is missing.`, 'Keep the repository interface aligned with the slice contract.');
      }
    }
  }

  if (service.postgresRepositoryPath && exists(args.root, service.postgresRepositoryPath)) {
    const text = readText(path.join(args.root, service.postgresRepositoryPath));
    for (const pattern of service.postgresRequiredPatterns ?? []) {
      if (!new RegExp(pattern).test(text)) {
        report.fail(service.postgresRepositoryPath, `PostgreSQL repository pattern "${pattern}" was not found.`, 'Keep PostgreSQL implementation behind the registered repository interface.');
      }
    }
  }

  if (service.backendPath && exists(args.root, service.backendPath)) {
    try {
      execFileSync('go', ['test', './...'], {
        cwd: path.join(args.root, service.backendPath),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120000,
      });
      report.info(service.backendPath, 'go test ./... passed.', '');
    } catch (error) {
      const output = `${error.stdout ?? ''}\n${error.stderr ?? ''}`.trim().slice(0, 1200);
      report.fail(service.backendPath, 'go test ./... failed or Go is unavailable.', output || 'No output captured.');
    }
  }
}

finalize(report, args);

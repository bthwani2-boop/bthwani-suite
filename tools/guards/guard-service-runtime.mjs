#!/usr/bin/env node
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), service: '', slice: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--root') args.root = argv[++i];
    else if (token === '--service') args.service = argv[++i];
    else if (token === '--slice') args.slice = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token.startsWith('--service=')) args.service = token.slice('--service='.length);
    else if (token.startsWith('--slice=')) args.slice = token.slice('--slice='.length);
  }
  args.root = path.resolve(args.root);
  return args;
}

const args = parseArgs();
const root = args.root;
const dir = path.dirname(fileURLToPath(import.meta.url));

if (!args.service) {
  console.error('GUARD_SERVICE_RUNTIME: --service <id> is required.');
  process.exit(1);
}

const guards = [
  'guard-service-go-runtime.mjs',
  'guard-service-postgres-runtime.mjs',
  'guard-service-l7-closure.mjs',
];

let failed = false;
for (const guard of guards) {
  const guardPath = path.join(dir, guard);
  const childArgs = [guardPath, '--root', root, '--service', args.service];
  if (args.slice) childArgs.push('--slice', args.slice);
  try {
    execFileSync(process.execPath, childArgs, { cwd: root, stdio: 'inherit' });
  } catch {
    failed = true;
  }
}

if (failed) {
  console.error(`GUARD_SERVICE_RUNTIME[${args.service}]: FAIL`);
  process.exit(1);
}

console.log(`GUARD_SERVICE_RUNTIME[${args.service}]: PASS`);

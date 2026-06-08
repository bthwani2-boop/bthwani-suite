#!/usr/bin/env node
/**
 * GUARD_SERVICE_WORKSPACE_MODEL
 * Policy source: governance/05_PACKAGE_BOUNDARIES.md, governance/PLATFORM_BLUEPRINT.md
 *
 * Enforces the BThwani monorepo workspace model:
 * - Central install from root only (single pnpm-lock.yaml)
 * - DSH and WLT are the only active workspace packages now
 * - Future services (knz/arb/amn/esf/mrf/snd/kwd) are reserved service slots with no package.json
 * - No node_modules or lockfiles inside any service directory
 * - pnpm-workspace.yaml must not activate future services as packages
 */
import path from 'node:path';
import fs from 'node:fs';
import { parseArgs, createReport, finalize, exists } from './lib/guard-utils.mjs';

const GUARD_ID = 'GUARD_SERVICE_WORKSPACE_MODEL';
const POLICY_SOURCES = [
  'governance/05_PACKAGE_BOUNDARIES.md',
  'governance/PLATFORM_BLUEPRINT.md',
];

const ACTIVE_SERVICES = ['dsh', 'wlt'];
const FUTURE_SERVICES = ['knz', 'arb', 'amn', 'esf', 'mrf', 'snd', 'kwd'];
const ALL_SERVICES = [...ACTIVE_SERVICES, ...FUTURE_SERVICES];
const LOCKFILE_NAMES = ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lockb'];

const args = parseArgs();
const report = createReport(GUARD_ID, POLICY_SOURCES);
const root = args.root;

// 1. Root workspace foundation files
if (!exists(root, 'package.json')) {
  report.fail('package.json', 'Root package.json missing. Central monorepo requires root package.json.');
}
if (!exists(root, 'pnpm-workspace.yaml')) {
  report.fail('pnpm-workspace.yaml', 'pnpm-workspace.yaml missing. This file is the single workspace roots source.');
}
if (!exists(root, 'pnpm-lock.yaml')) {
  report.fail('pnpm-lock.yaml', 'pnpm-lock.yaml missing. Single root lockfile required. Run pnpm install from root only.');
}

// 2. Active service packages — dsh and wlt must exist and have correct identity
for (const svc of ACTIVE_SERVICES) {
  const pkgRel = `${svc}/package.json`;
  if (!exists(root, pkgRel)) {
    report.fail(pkgRel, `Active service ${svc} is missing package.json. Required for pnpm workspace registration.`);
    continue;
  }
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(root, pkgRel), 'utf8'));
  } catch {
    report.fail(pkgRel, `Cannot parse ${pkgRel}.`);
    continue;
  }
  const expectedName = `@bthwani/${svc}`;
  if (pkg.name !== expectedName) {
    report.fail(pkgRel, `Package name mismatch. Expected "${expectedName}", found "${String(pkg.name)}".`);
  }
  // Orchestration-only packages should have no dependencies
  const depKeys = Object.keys(pkg.dependencies ?? {});
  const devDepKeys = Object.keys(pkg.devDependencies ?? {});
  if (depKeys.length > 0) {
    report.warn(pkgRel, `Orchestration package ${svc} declares dependencies. Only add if directly required by a verifiable script.`, `dependencies: ${depKeys.join(', ')}`);
  }
  if (devDepKeys.length > 0) {
    report.warn(pkgRel, `Orchestration package ${svc} declares devDependencies. Prefer root-level installation.`, `devDependencies: ${devDepKeys.join(', ')}`);
  }
}

// 3. Future reserved service slots must NOT have package.json
for (const svc of FUTURE_SERVICES) {
  if (exists(root, `${svc}/package.json`)) {
    report.fail(
      `${svc}/package.json`,
      `Future reserved service slot "${svc}" must not have a package.json until implementation begins. ` +
      `Remove ${svc}/package.json to keep it as a reserved slot and remove it from pnpm-workspace.yaml.`,
    );
  }
}

// 4. No node_modules or lockfiles inside any service directory
for (const svc of ALL_SERVICES) {
  if (!exists(root, svc)) continue;
  if (exists(root, `${svc}/node_modules`)) {
    report.fail(`${svc}/node_modules`, `node_modules found inside service "${svc}". Install only from the monorepo root.`);
  }
  for (const lf of LOCKFILE_NAMES) {
    if (exists(root, `${svc}/${lf}`)) {
      report.fail(`${svc}/${lf}`, `Lockfile "${lf}" found inside service "${svc}". Only the root pnpm-lock.yaml is allowed.`);
    }
  }
}

// 5. pnpm-workspace.yaml must not activate future services as workspace packages
if (exists(root, 'pnpm-workspace.yaml')) {
  const wsText = fs.readFileSync(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
  for (const svc of FUTURE_SERVICES) {
    // Detect active (uncommented) package entries for future services
    const activePattern = new RegExp(`^\\s+-\\s+${svc}\\s*$`, 'm');
    if (activePattern.test(wsText)) {
      report.fail(
        'pnpm-workspace.yaml',
        `pnpm-workspace.yaml activates future service "${svc}" as a workspace package. ` +
        `Comment out or remove this entry until ${svc} implementation begins and a real package.json exists.`,
      );
    }
  }
}

// 6. Governance must not instruct installation inside service directories
if (exists(root, 'governance')) {
  const govDir = path.join(root, 'governance');
  const govFiles = fs.readdirSync(govDir).filter((f) => f.endsWith('.md'));
  const installInsideServicePattern = /pnpm install.*(?:knz|arb|amn|esf|mrf|snd|kwd|dsh|wlt)\b(?![\s\S]{0,50}from.root)/gi;
  for (const f of govFiles) {
    const text = fs.readFileSync(path.join(govDir, f), 'utf8');
    if (installInsideServicePattern.test(text)) {
      report.warn(
        `governance/${f}`,
        `Possible instruction to run pnpm install inside a service directory found in governance. Verify this is not advising local install.`,
      );
    }
  }
}

finalize(report, args);

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, readJson, readTextSafe, walkFiles, rel, TEXT_EXTENSIONS } from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const config = readJson(path.join(root, 'tools/guards/guard-governance-boundaries.config.json'));
const report = createReport('GOVERNANCE-BOUNDARIES', ['governance/03_REPO_BOUNDARIES.md', 'governance/14_GUARDS_CATALOG.md']);

const guardsRoot = path.join(root, 'tools/guards');
const manifestPath = path.join(guardsRoot, 'guard-manifest.json');
const manifest = readJson(manifestPath);
const entries = Array.isArray(manifest.guards) ? manifest.guards : [];

for (const required of config.requiredGuardFiles ?? []) {
  if (!fs.existsSync(path.join(root, required))) {
    report.fail(required, 'Required tools/guards file is missing.');
  }
}

const childDirectories = fs.readdirSync(guardsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !(config.allowedDirectories ?? []).includes(name));
for (const dir of childDirectories) {
  report.fail(`tools/guards/${dir}`, 'Unexpected subdirectory inside tools/guards/.');
}

const ids = new Map();
const files = new Map();
const configs = new Map();

for (const entry of entries) {
  if (!entry.id) {
    report.fail('tools/guards/guard-manifest.json', 'Manifest entry missing id.');
    continue;
  }
  if (ids.has(entry.id)) {
    report.fail('tools/guards/guard-manifest.json', `Duplicate manifest id detected: ${entry.id}`);
  } else {
    ids.set(entry.id, true);
  }

  if (!entry.file) {
    report.fail('tools/guards/guard-manifest.json', `Manifest entry ${entry.id} missing file.`);
    continue;
  }
  if (files.has(entry.file)) {
    report.fail('tools/guards/guard-manifest.json', `Duplicate manifest file entry detected: ${entry.file}`);
  } else {
    files.set(entry.file, true);
  }

  if (!entry.purpose || !String(entry.purpose).trim()) {
    report.fail('tools/guards/guard-manifest.json', `Manifest entry ${entry.id} has no purpose text.`);
  }

  const ownerPolicies = Array.isArray(entry.ownerPolicy) ? entry.ownerPolicy : [entry.ownerPolicy].filter(Boolean);
  if (ownerPolicies.length === 0) {
    report.fail('tools/guards/guard-manifest.json', `Manifest entry ${entry.id} has no ownerPolicy.`);
  }
  for (const ownerPolicy of ownerPolicies) {
    if (!fs.existsSync(path.join(root, ownerPolicy))) {
      report.fail('tools/guards/guard-manifest.json', `Manifest ownerPolicy does not exist: ${ownerPolicy}`);
    }
  }

  if (entry.config) {
    configs.set(entry.config, true);
    if (!fs.existsSync(path.join(root, entry.config))) {
      report.fail('tools/guards/guard-manifest.json', `Manifest config does not exist: ${entry.config}`);
    }
  }

  if (!fs.existsSync(path.join(root, entry.file))) {
    report.fail('tools/guards/guard-manifest.json', `Manifest guard file does not exist: ${entry.file}`);
  }
}

const guardFiles = fs.readdirSync(guardsRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /^guard-.*\.mjs$/i.test(entry.name))
  .map((entry) => `tools/guards/${entry.name}`);
for (const guardFile of guardFiles) {
  if (!files.has(guardFile)) {
    report.fail(guardFile, 'Guard file has no manifest entry.');
  }
}

const configFiles = fs.readdirSync(guardsRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && (/^guard-.*\.config\.json$/i.test(entry.name) || /^config-.*\.json$/i.test(entry.name)))
  .map((entry) => `tools/guards/${entry.name}`);
for (const configFile of configFiles) {
  if (!configs.has(configFile)) {
    report.fail(configFile, 'Config file is not referenced by guard-manifest.json.');
  }
}

const docsOnlyFiles = new Set([
  'tools/guards/README.md',
  'tools/guards/GUARDS_CATALOG.md'
]);

const selfReferentialGuardFiles = new Set([
  'tools/guards/guard-agent-global-authority.mjs',
  'tools/guards/guard-bthwani-agent-package.mjs',
  'tools/guards/guard-governance-boundaries.mjs'
]);

const allowContext = (relative, lines, index) => {
  if (selfReferentialGuardFiles.has(relative)) return true;
  if (docsOnlyFiles.has(relative)) return true;
  if (relative.endsWith('.config.json')) return true;

  const line = lines[index] ?? '';
  if (/(regex\s*:|pattern\s*:|message\s*:|detail\s*:)/i.test(line)) {
    return true;
  }

  const windowStart = Math.max(0, index - 2);
  const windowEnd = Math.min(lines.length, index + 3);
  const windowText = lines.slice(windowStart, windowEnd).join(' ');
  return (config.allowContextPatterns ?? []).some((token) => windowText.includes(token));
};

const scanFiles = walkFiles(root, { startDirs: ['tools/guards'], extensions: TEXT_EXTENSIONS });

for (const file of scanFiles) {
  const relative = rel(root, file);
  const text = readTextSafe(file);
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const rule of config.forbiddenLineRules ?? []) {
      const regex = new RegExp(rule.pattern);
      if (!regex.test(line)) continue;
      if (allowContext(relative, lines, i)) continue;
      if (rule.severity === 'error') {
        report.fail(relative, rule.detail, `line ${i + 1}: ${line.trim()}`);
      } else {
        report.warn(relative, rule.detail, `line ${i + 1}: ${line.trim()}`);
      }
    }
  }
}

finalize(report, args);

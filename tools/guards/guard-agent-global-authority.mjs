import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, readJson, readTextSafe, walkFiles, rel, gitTrackedFiles, TEXT_EXTENSIONS } from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const config = readJson(path.join(root, 'tools/guards/guard-agent-global-authority.config.json'));
const report = createReport('AGENT-GLOBAL-AUTHORITY', ['AGENTS.md', '.agents/AUTHORITY_BOUNDARY.md', '.agents/UPDATE_POLICY.md']);

for (const required of config.requiredPaths ?? []) {
  if (!fs.existsSync(path.join(root, required))) {
    report.fail(required, 'Required agent authority file is missing.');
  }
}

for (const forbiddenRoot of config.forbiddenRoots ?? []) {
  if (fs.existsSync(path.join(root, forbiddenRoot))) {
    report.fail(forbiddenRoot, 'Retired agent root must not exist as an active source.');
  }
}

for (const tracked of gitTrackedFiles(root)) {
  if (tracked.startsWith('.agents/')) continue;
  if (tracked.endsWith('/SKILL.md') || tracked.includes('/skills/')) {
    report.fail(tracked, 'Skill content must not live outside .agents/.');
  }
}

const authorityRootFiles = new Set([
  'AGENTS.md',
  '.agents/README.md',
  '.agents/INDEX.md',
  '.agents/SKILL_CATALOG.md',
  '.agents/AUTHORITY_BOUNDARY.md',
  '.agents/UPDATE_POLICY.md'
]);

const isBthwaniOwnedSkill = (relative) =>
  /^\.agents\/skills\/bthwani-[^/]+\/SKILL\.md$/i.test(relative);

const isAdapterFile = (relative) =>
  relative.startsWith('.agents/adapters/');

const shouldScanAuthorityTerms = (relative) =>
  authorityRootFiles.has(relative) ||
  isBthwaniOwnedSkill(relative) ||
  isAdapterFile(relative);

const allowContext = (lines, index, currentSection) => {
  const windowStart = Math.max(0, index - 2);
  const windowEnd = Math.min(lines.length, index + 3);
  const windowText = lines.slice(windowStart, windowEnd).join(' ');

  if ((config.allowContextPatterns ?? []).some((token) => windowText.includes(token))) {
    return true;
  }

  if (/allowed when documented|documented or safest|safest documented launcher|justified in evidence/i.test(windowText)) {
    return true;
  }

  return (config.allowSectionPatterns ?? []).some((token) => currentSection.includes(token));
};

const forbiddenPatterns = [
  { code: 'RETIRED_GITHUB_SKILLS_REF', regex: /\.github\/skills/i, message: 'Retired .github/skills reference detected.' },
  { code: 'RETIRED_GITHUB_AGENTS_REF', regex: /\.github\/agents/i, message: 'Retired .github/agents reference detected.' },
  { code: 'RETIRED_OPENCODE_SKILLS_REF', regex: /\.opencode\/skills/i, message: 'Retired .opencode/skills reference detected.' },
  { code: 'LEGACY_HANDOFF_ZIP_RULE', regex: /_HANDOFF\.zip/i, message: 'Legacy _HANDOFF.zip naming rule detected.' },
  { code: 'NPM_EXECUTION_SHIM', regex: /\bnpx\b/i, message: 'npx reference detected in active agent source.' },
  { code: 'LEGACY_ACTIVE_PATH', regex: /(^|[^A-Za-z0-9_])(apps\/|packages\/)/, message: 'Legacy active path pattern detected in active agent source.' }
];

const textFiles = walkFiles(root, { startDirs: ['.agents'], extensions: TEXT_EXTENSIONS });
const agentsMdPath = path.join(root, 'AGENTS.md');
if (fs.existsSync(agentsMdPath)) textFiles.push(agentsMdPath);

for (const file of textFiles) {
  const relative = rel(root, file);

  if (!shouldScanAuthorityTerms(relative)) {
    continue;
  }

  const text = readTextSafe(file);
  const lines = text.split(/\r?\n/);
  let currentSection = '';

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (/^\s*#{1,6}\s+/.test(line)) {
      currentSection = line.replace(/^\s*#{1,6}\s+/, '').trim();
    }

    for (const pattern of forbiddenPatterns) {
      if (!pattern.regex.test(line)) continue;
      if (allowContext(lines, i, currentSection)) continue;
      report.fail(relative, pattern.message, `line ${i + 1}: ${line.trim()}`);
    }
  }
}

for (const adapterRoot of config.adapterRoots ?? []) {
  const absolute = path.join(root, adapterRoot);
  if (!fs.existsSync(absolute)) continue;

  const adapterFiles = walkFiles(root, { startDirs: [adapterRoot], extensions: TEXT_EXTENSIONS });

  for (const file of adapterFiles) {
    const relative = rel(root, file);
    const text = readTextSafe(file);
    const lines = text.split(/\r?\n/);

    if (lines.length > (config.maxAdapterLines ?? 160)) {
      report.warn(relative, 'Adapter file is longer than the lightweight adapter threshold.', `lines=${lines.length}`);
    }

    const governanceMentions = (text.match(/governance\//g) ?? []).length;
    if (governanceMentions > (config.maxGovernanceMentionsPerAdapter ?? 6)) {
      report.warn(relative, 'Adapter appears to duplicate governance references heavily.', `governanceMentions=${governanceMentions}`);
    }
  }
}

const agentFiles = walkFiles(root, { startDirs: ['.agents'], extensions: TEXT_EXTENSIONS });

for (const file of agentFiles) {
  const relative = rel(root, file);
  const base = path.basename(relative).toLowerCase();

  if ((config.forbiddenBridgeNamePatterns ?? []).some((pattern) => base.includes(pattern.toLowerCase()))) {
    report.fail(relative, 'Bridge-only file pattern detected inside .agents/.');
  }
}

finalize(report, args);

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptFilePath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptFilePath), '..', '..');

const canonicalAgentPath = path.join(repoRoot, '.github', 'agents', 'bthwani-surface-core-lossless.agent.md');
const routingIndexPath = path.join(repoRoot, '.github', 'agents', 'AGENT_ROUTING_INDEX.md');
const checklistPath = path.join(repoRoot, 'governance', 'AGENT_UPDATE_VALIDATION_CHECKLIST.md');
const ledgerPath = path.join(repoRoot, 'governance', 'AGENT_CHANGE_LEDGER.md');
const skillsRoot = path.join(repoRoot, '.github', 'skills');
const agentsRoot = path.join(repoRoot, '.github', 'agents');

const requiredBaseProfiles = [
  'PROFILE_ANALYZE_FIRST_PASS.md',
  'PROFILE_BUILD_SLICE.md',
  'PROFILE_DONOR_TRACE_RECONSTRUCT.md',
  'PROFILE_READY_PACK.md',
  'PROFILE_INFRA_WORKSPACE_LINK.md',
];

const requiredOverlays = [
  'OVERLAY_DESIGN_REVIEW.md',
  'OVERLAY_UX_FLOW_REVIEW.md',
  'OVERLAY_USER_REVIEW_GATES.md',
  'OVERLAY_VIOLATION_AUDIT.md',
];

const requiredSkillDirs = [
  'bthwani-workspace-boundaries',
  'bthwani-task-contracts',
  'bthwani-slice-orchestration',
  'bthwani-violation-audit',
  'bthwani-central-ui-kit-compliance',
  'bthwani-design-sovereignty',
  'bthwani-ux-flow-sovereignty',
  'bthwani-donor-escalation',
  'bthwani-donor-decomposition',
  'bthwani-interactive-review',
  'bthwani-unified-experience-review',
  'bthwani-ready-pack',
];

const forbiddenCanonicalHeadings = [
  '## Mandatory Header Law',
  '## Mandatory Request Classification',
  '## Violation Discovery Law',
  '## Anti-Pattern Conversion Law',
  '## Interactive Slice Execution Law',
  '## First-Slice Selection Law',
  '## Live Build Order Law',
  '## Service Order Guidance',
  '## New Repo Ownership Law',
  '## Naming Normalization Law',
  '## Repo Sovereignty Law',
];

const requiredCanonicalPhrases = [
  '## Routing Law',
  '### Base Profiles',
  '### Overlays',
  '.github/agents/AGENT_ROUTING_INDEX.md',
  'analyze.first-pass',
  'build.slice',
  'donor.trace-reconstruct',
  'ready.pack',
  'infra.workspace-link',
  'governance/AGENT_GOVERNANCE_POLICY.md',
  'governance/AGENT_CHANGE_LEDGER_POLICY.md',
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function walk(dirPath, matcher) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(entryPath, matcher));
      continue;
    }
    if (matcher(entryPath)) {
      results.push(entryPath);
    }
  }
  return results;
}

function parseFrontmatter(text, filePath) {
  const normalized = text.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    throw new Error(`${filePath}: missing YAML frontmatter`);
  }
  const block = match[1];
  const nameMatch = block.match(/^name:\s*(.+)$/m);
  const descriptionMatch = block.match(/^description:\s*(.+)$/m);
  if (!nameMatch) {
    throw new Error(`${filePath}: frontmatter missing name`);
  }
  if (!descriptionMatch) {
    throw new Error(`${filePath}: frontmatter missing description`);
  }
  return {
    name: nameMatch[1].trim().replace(/^['"]|['"]$/g, ''),
    description: descriptionMatch[1].trim().replace(/^['"]|['"]$/g, ''),
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function duplicateHeadings(text) {
  const counts = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith('#')) {
      continue;
    }
    const heading = line.trim();
    counts.set(heading, (counts.get(heading) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([heading]) => heading);
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, '/');
}

const governedSkillFiles = walk(skillsRoot, (filePath) => {
  if (!filePath.endsWith('SKILL.md')) {
    return false;
  }
  const folderName = path.basename(path.dirname(filePath));
  return folderName.startsWith('bthwani-');
});

const markdownFiles = [
  canonicalAgentPath,
  routingIndexPath,
  checklistPath,
  ledgerPath,
  ...governedSkillFiles,
  ...walk(agentsRoot, (filePath) => filePath.endsWith('.agent.md')),
  ...walk(path.join(agentsRoot, 'base-profiles'), (filePath) => filePath.endsWith('.md')),
  ...walk(path.join(agentsRoot, 'overlays'), (filePath) => filePath.endsWith('.md')),
];

try {
  for (const filePath of markdownFiles) {
    assert(fs.existsSync(filePath), `Missing required file: ${relative(filePath)}`);
    const text = readText(filePath);
    const duplicates = duplicateHeadings(text);
    assert(duplicates.length === 0, `${relative(filePath)}: duplicate headings found: ${duplicates.join(', ')}`);
  }

  const canonicalAgentText = readText(canonicalAgentPath);
  for (const phrase of requiredCanonicalPhrases) {
    assert(canonicalAgentText.includes(phrase), `Canonical agent missing required phrase: ${phrase}`);
  }
  for (const heading of forbiddenCanonicalHeadings) {
    assert(!canonicalAgentText.includes(heading), `Canonical agent still contains extracted section: ${heading}`);
  }

  for (const skillDir of requiredSkillDirs) {
    const filePath = path.join(skillsRoot, skillDir, 'SKILL.md');
    assert(fs.existsSync(filePath), `Missing required skill: .github/skills/${skillDir}/SKILL.md`);
  }

  for (const profileName of requiredBaseProfiles) {
    const filePath = path.join(agentsRoot, 'base-profiles', profileName);
    assert(fs.existsSync(filePath), `Missing required base profile: .github/agents/base-profiles/${profileName}`);
  }

  for (const overlayName of requiredOverlays) {
    const filePath = path.join(agentsRoot, 'overlays', overlayName);
    assert(fs.existsSync(filePath), `Missing required overlay: .github/agents/overlays/${overlayName}`);
  }

  const routingIndexText = readText(routingIndexPath);
  assert(routingIndexText.includes('Base Profile First'), 'Routing index must define base-profile-first routing');
  assert(routingIndexText.includes('Overlay Second'), 'Routing index must define overlay routing');
  for (const filePath of governedSkillFiles) {
    const text = readText(filePath);
    const frontmatter = parseFrontmatter(text, relative(filePath));
    assert(/use when/i.test(frontmatter.description), `${relative(filePath)}: description must include a 'use when' trigger phrase for skill discovery`);
    const folderName = path.basename(path.dirname(filePath));
    assert(frontmatter.name === folderName, `${relative(filePath)}: frontmatter name must match folder name`);
  }

  const checklistText = readText(checklistPath);
  assert(checklistText.includes('AGENT_CHANGE_LEDGER.md'), 'Checklist must reference the agent change ledger');

  const ledgerText = readText(ledgerPath);
  assert(/### AGENT-\d{4}-\d{2}-\d{2}-\d{3}/.test(ledgerText), 'Agent change ledger must contain at least one active change entry');

  console.log('Agent governance validation: PASS');
} catch (error) {
  console.error(`Agent governance validation: FAIL\n${error.message}`);
  process.exitCode = 1;
}

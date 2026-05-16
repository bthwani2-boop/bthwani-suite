#!/usr/bin/env node
/**
 * BThwani general agent package guard.
 * Read-only validation. Does not modify files.
 */
import fs from 'fs';
import path from 'path';

const repo = process.cwd();
const requiredSkills = [
  'bthwani-current-workspace-authority',
  'bthwani-agent-governance-execution',
  'bthwani-local-evidence-pack',
  'bthwani-patch-review-and-evidence',
  'bthwani-agent-restoration-forensics',
  'bthwani-domain-governance-reader',
  'bthwani-ui-kit-surface-contract',
  'bthwani-screen-flow-binding-contract',
  'bthwani-platform-vars-control-contract',
  'bthwani-runtime-provider-config-contract',
  'bthwani-api-contract-client-boundary',
  'bthwani-go-backend-target-boundary',
  'bthwani-data-fixture-simulation-contract',
  'bthwani-finance-ledger-contract',
  'bthwani-commercial-growth-contract',
  'bthwani-commerce-catalog-contract',
  'bthwani-operations-dispatch-contract',
  'bthwani-mobile-navigation-back-contract',
  'bthwani-security-secrets-privacy-contract',
  'bthwani-supply-chain-intake-contract',
  'bthwani-test-quality-gates-contract',
  'bthwani-release-runtime-gates',
  'bthwani-observability-performance-contract',
  'bthwani-agent-skill-authoring-contract',
  'bthwani-agent-registry-validator'
];

const forbiddenActiveDirs = [
  '.github/skills',
  '.github/agents',
  '.opencode/skills'
];

const riskTerms = [
  'npm install',
  'npx ',
  'pnpm add',
  'git push',
  'git commit',
  'force push',
  'rm -rf',
  '_HANDOFF.zip'
];

function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

const errors = [];
const warnings = [];

for (const dir of forbiddenActiveDirs) {
  if (exists(dir)) warnings.push(`FORBIDDEN_ACTIVE_DIR_PRESENT:${dir}`);
}

for (const s of requiredSkills) {
  const rel = `.agents/skills/${s}/SKILL.md`;
  if (!exists(rel)) {
    errors.push(`MISSING_SKILL:${rel}`);
    continue;
  }
  const text = read(rel);
  if (!/^---\s*[\s\S]*?name:\s*/.test(text)) errors.push(`MISSING_FRONTMATTER_NAME:${rel}`);
  if (!/^---\s*[\s\S]*?description:\s*/.test(text)) errors.push(`MISSING_FRONTMATTER_DESCRIPTION:${rel}`);
  if (!text.includes('governance/')) warnings.push(`NO_GOVERNANCE_POINTER:${rel}`);
  for (const term of riskTerms) {
    if (text.includes(term)) warnings.push(`RISK_TERM:${term}:${rel}`);
  }
}

for (const rel of [
  '.agents/README.md',
  '.agents/INDEX.md',
  '.agents/SKILL_CATALOG.md',
  '.agents/AUTHORITY_BOUNDARY.md',
  '.agents/UPDATE_POLICY.md',
  'governance/agents/GENERAL_AGENT_CAPABILITY_MAP.md',
  'governance/agents/SKILL_TO_GOVERNANCE_ROUTING.md',
  'governance/agents/DONOR_EXTRACTION_DECISION_MATRIX.md'
]) {
  if (!exists(rel)) errors.push(`MISSING_REQUIRED_FILE:${rel}`);
}

const result = {
  guard: 'guard-bthwani-agent-package',
  repo,
  checked_at: new Date().toISOString(),
  errors,
  warnings,
  status: errors.length ? 'FAIL' : warnings.length ? 'PASS_WITH_WARNINGS' : 'PASS'
};

console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);

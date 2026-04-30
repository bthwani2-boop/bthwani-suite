import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, readTextSafe, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-14_AGENT_SKILL_REGISTRY_OWNERSHIP',
  guardName: 'Agent / Skill Registry Ownership',
  prefix: 'GUARD_14_AGENT_SKILL_REGISTRY_OWNERSHIP',
  configPath: 'tools/guards/guard-agent-skill-registry-ownership.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles().filter((file) => (config.agentRoots ?? []).some((root) => file.startsWith(`${root}/`)));
    const findings = [];
    const dirs = new Map();

    for (const file of files) {
      const full = path.join(ROOT, file);
      const stat = fs.statSync(full);
      if (stat.size === 0) findings.push({ type: 'ZERO_BYTE_AGENT_SKILL_FILE', severity: 'warning', file, reason: 'Agent/skill registry file is zero bytes.' });
      const parts = file.split('/');
      const rootKey = parts[0] === '.agents' ? parts.slice(0, 3).join('/') : parts.slice(0, 3).join('/');
      if (!dirs.has(rootKey)) dirs.set(rootKey, []);
      dirs.get(rootKey).push(file);
    }

    for (const [dir, list] of dirs.entries()) {
      const hasSkill = list.some((file) => file.endsWith('/SKILL.md'));
      const hasAgent = list.some((file) => file.endsWith('.agent.md') || file.endsWith('/AGENTS.md'));
      const hasReadme = list.some((file) => file.endsWith('/README.md'));
      if (!hasSkill && !hasAgent && !hasReadme) {
        findings.push({ type: 'MISSING_AGENT_SKILL_REGISTRY_ENTRYPOINT', severity: 'warning', file: dir, reason: 'Agent/skill directory has no SKILL.md, AGENTS.md, README.md, or *.agent.md entrypoint.' });
      }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'agent-skill-registry-ownership-findings.csv',
      baseCounts: { FilesScanned: files.length, RegistryRootsSeen: dirs.size },
      blockedDecision: 'BLOCKED_BY_AGENT_SKILL_REGISTRY_OWNERSHIP',
      warningDecision: 'READY_FOR_AGENT_SKILL_REGISTRY_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_AGENT_SKILL_REGISTRY_OWNERSHIP_GUARD',
    };
  },
});

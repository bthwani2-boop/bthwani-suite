import path from 'node:path';
import { ROOT, gitLsFiles, defaultFileFilter, readTextSafe, sha256, runGuard } from './_guard-common.mjs';

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, ' ').replace(/[^\p{L}\p{N} ]/gu, '').trim();
}

runGuard({
  guardId: 'GUARD-12_DUPLICATE_DOCS_AGENT_SKILL_CONTENT',
  guardName: 'Duplicate Docs / Agent / Skill Content',
  prefix: 'GUARD_12_DUPLICATE_DOCS_AGENT_SKILL_CONTENT',
  configPath: 'tools/guards/guard-duplicate-docs-agent-skill-content.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles().filter(defaultFileFilter).filter((file) =>
      /\.(md|mdx|mdc)$/i.test(file) || file.includes('/agents/') || file.includes('/skills/')
    );
    const minLen = Number(config.minNormalizedLength ?? 40);
    const groups = new Map();
    for (const file of files) {
      const text = readTextSafe(path.join(ROOT, file));
      const norm = normalize(text);
      if (norm.length < minLen) continue;
      const hash = sha256(norm);
      if (!groups.has(hash)) groups.set(hash, []);
      groups.get(hash).push(file);
    }
    const findings = [];
    for (const [hash, list] of groups.entries()) {
      if (list.length < 2) continue;
      for (const file of list) {
        findings.push({ type: 'DUPLICATE_NORMALIZED_CONTENT', severity: 'warning', file, duplicate_group: hash.slice(0, 16), group_size: list.length, reason: 'Document/agent/skill content is normalized-duplicate with another file.' });
      }
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'duplicate_group', 'group_size', 'reason'],
      issueFileName: 'duplicate-docs-agent-skill-findings.csv',
      baseCounts: { FilesScanned: files.length },
      blockedDecision: 'BLOCKED_BY_DUPLICATE_DOCS_AGENT_SKILL_CONTENT',
      warningDecision: 'READY_FOR_DUPLICATE_CONTENT_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_DUPLICATE_DOCS_AGENT_SKILL_CONTENT_GUARD',
    };
  },
});

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, runGuard } from './_guard-common.mjs';

function gitChangedFilesRange() {
  try {
    const out = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], { cwd: ROOT, encoding: 'utf8' });
    const list = out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (list.length) return list;
  } catch (e) {
    // fallthrough
  }
  try {
    const out = execFileSync('git', ['diff', '--name-only', 'HEAD~1..HEAD'], { cwd: ROOT, encoding: 'utf8' });
    return out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
}

runGuard({
  guardId: 'GUARD-16_PATCH_REVIEW_SENSITIVE_CHANGES',
  guardName: 'Patch Review for Sensitive Changes',
  prefix: 'GUARD_16_PATCH_REVIEW_SENSITIVE_CHANGES',
  configPath: 'tools/guards/guard-patch-review-sensitive-changes.config.json',
  collect: ({ config }) => {
    const changed = gitChangedFilesRange();
    const findings = [];
    if (!changed.length) {
      return {
        findings,
        headers: ['type', 'severity', 'file', 'reason'],
        issueFileName: 'patch-review-findings.csv',
        baseCounts: { ChangedFiles: 0 },
        blockedDecision: 'PASS_NO_CHANGES',
        warningDecision: 'PASS_NO_CHANGES',
        passDecision: 'PASS_NO_CHANGES',
      };
    }

    const sensitive = config.sensitivePatterns ?? [];
    const indicators = config.patchIndicatorFiles ?? [];
    const commitMarker = config.commitMsgIndicator ?? 'PATCH:';

    const matches = changed.filter((f) => sensitive.some((p) => new RegExp(p).test(f)));
    if (!matches.length) {
      return {
        findings,
        headers: ['type', 'severity', 'file', 'reason'],
        issueFileName: 'patch-review-findings.csv',
        baseCounts: { ChangedFiles: changed.length, SensitiveHits: 0 },
        blockedDecision: 'PASS_NO_SENSITIVE_CHANGES',
        warningDecision: 'PASS_NO_SENSITIVE_CHANGES',
        passDecision: 'PASS_NO_SENSITIVE_CHANGES',
      };
    }

    // Check for patch evidence: commit message contains marker or a PATCH file exists near changes or root
    let commitMsg = '';
    try {
      commitMsg = execFileSync('git', ['log', '-1', '--pretty=%B'], { cwd: ROOT, encoding: 'utf8' });
    } catch (e) {
      commitMsg = '';
    }

    const commitHasMarker = commitMsg.includes(commitMarker);
    const rootHasPatch = indicators.some((name) => fs.existsSync(path.join(ROOT, name)));

    const perMatchNoPatch = [];
    for (const f of matches) {
      const d = path.dirname(path.join(ROOT, f));
      const localPatchExists = indicators.some((name) => fs.existsSync(path.join(d, name)));
      if (!commitHasMarker && !rootHasPatch && !localPatchExists) perMatchNoPatch.push(f);
    }

    for (const f of perMatchNoPatch) {
      findings.push({ type: 'MISSING_PATCH_REVIEW', severity: 'error', file: f, reason: 'Sensitive file changed without PATCH.md or commit PATCH: marker.' });
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'patch-review-findings.csv',
      baseCounts: { ChangedFiles: changed.length, SensitiveHits: matches.length, MissingPatchForSensitive: perMatchNoPatch.length },
      blockedDecision: perMatchNoPatch.length ? 'BLOCKED_BY_MISSING_PATCH_REVIEW' : 'PASS_PATCH_REVIEW_PRESENT',
      warningDecision: 'PATCH_REVIEW_WARNINGS',
      passDecision: 'PASS_PATCH_REVIEW_PRESENT',
    };
  },
});

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, runGuard, readTextSafe } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD_BTHWANI_PROTECTED_TOKENS',
  guardName: 'Bthwani Protected Tokens',
  prefix: 'GUARD_BTHWANI_PROTECTED_TOKENS',
  configPath: 'tools/guards/guard-bthwani-protected-tokens.config.json',
  collect: ({ config }) => {
    const all = gitLsFiles();
    const roots = config.roots || ['apps', 'packages', 'governance', '.github'];
    const exts = (config.extensions || []).map((e) => e.toLowerCase());

    const scanned = all.filter((f) => {
      const top = f.includes('/') ? f.split('/')[0] : f.split('\\')[0];
      const ext = f.includes('.') ? f.slice(f.lastIndexOf('.')).toLowerCase() : '';
      return roots.includes(top) && exts.includes(ext);
    });

    const findings = [];

    const protectedRe = /@bthwani\//g;
    const otherProtectedTokens = [
      /bthwani-suite/g,
      /bthwani-/g,
      /BThwani/g,
      /BTHWANI/g,
      /com\.bthwani/g,
      /\bbthwaniDirectionBootstrap\b/g,
      /__BTHWANI_[A-Z0-9_]+__/g,
    ];

    const damagedRe = /@wani\//gi;
    const damagedTokens = [
      /\bwani-suite\b/gi,
      /\bBwani\b/g,
      /\bBTHANI\b/g,
      /\bcom\.wani\b/gi,
      /\bbthDirectionBootstrap\b/gi,
      /\bwaniDirectionBootstrap\b/gi,
    ];

    const forbiddenRe = /\bBthTamaguiView\b|\bBthTamaguiText\b|\bBthTamaguiScrollView\b|\bPrimitiveTamaguiView\b|\bPrimitiveTamaguiText\b|\bPrimitiveTamaguiScrollView\b/g;

    let protectedCount = 0;
    let damagedCount = 0;
    let forbiddenCount = 0;

    for (const file of scanned) {
      const full = path.join(ROOT, file);
      const txt = readTextSafe(full);
      if (!txt) continue;
      const lines = txt.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(protectedRe) || otherProtectedTokens.some((r) => r.test(line))) {
          protectedCount++;
          findings.push({ type: 'PROTECTED_ALLOWED', severity: 'warning', file, reason: `Protected token allowed at L${i+1}: ${line.trim()}` });
        }
        if (damagedTokens.some((r) => r.test(line)) || damagedRe.test(line)) {
          damagedCount++;
          findings.push({ type: 'DAMAGED_PROTECTED_TOKEN', severity: 'error', file, reason: `Damaged protected token at L${i+1}: ${line.trim()}` });
        }
        if (forbiddenRe.test(line)) {
          forbiddenCount++;
          findings.push({ type: 'FORBIDDEN_TEMP_ALIAS', severity: 'error', file, reason: `Forbidden temporary alias at L${i+1}: ${line.trim()}` });
        }
      }
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'protected-tokens-findings.csv',
      baseCounts: { ScannedFiles: scanned.length, ProtectedMatches: protectedCount, DamagedMatches: damagedCount, ForbiddenMatches: forbiddenCount },
      blockedDecision: 'BLOCKED_PROTECTED_TOKENS',
      warningDecision: 'PROTECTED_TOKENS_WARNINGS',
      passDecision: 'PASS_PROTECTED_TOKENS',
    };
  },
});

Inspect only. Do not edit any file.

Task:
Review the BThwani general agent package after it is applied locally.

Scope:
- AGENTS.md BTHWANI_CURRENT_AGENT_CONTRACT block only
- .agents/**
- governance/agents/**
- tools/guards/guard-bthwani-agent-package.mjs

Check:
1. Every required general capability is covered by exactly one skill.
2. Service/application-specific rules are routed to governance, not embedded in skills.
3. No active mirrors under .github/skills, .github/agents, or .opencode/skills.
4. No direct restoration of old donor agent trees.
5. No npm/npx local execution instructions override pnpm rules.
6. Central color system phrase exists:
   - توجب الالتزام بنظام الألوان المركزي
7. Noise/scattering phrase exists:
   - تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر
8. Evidence and verification rules exist.
9. Scripts are scoped, dry-run safe, and write only intended paths.
10. Unknowns are marked as TBD/BLOCKED, not guessed.

Return:
- PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED
- exact file/path findings
- no code edits

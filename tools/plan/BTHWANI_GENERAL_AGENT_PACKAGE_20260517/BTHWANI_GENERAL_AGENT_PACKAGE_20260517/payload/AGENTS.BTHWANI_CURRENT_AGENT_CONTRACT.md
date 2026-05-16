<!-- BTHWANI_CURRENT_AGENT_CONTRACT_START -->

## BThwani current agent contract

This repo is `bthwani-suite`. The active local root is:

```text
C:\bthwani-suite
```

Read `pnpm-workspace.yaml` before choosing paths. Treat current flat workspace roots as active unless the current branch proves otherwise.

Global agent source:

- `.agents/`

Project truth source:

- `governance/`

Core laws:

- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local execution.
- Do not use npm/npx shims for local tool execution; prefer `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`.
- Evidence root is `tools/registry/runs/{SESSION_ID}`.
- New registry ZIPs must be named `{SESSION_ID}.zip`.
- Backend target is Go unless current repo evidence explicitly says otherwise.
- UI architecture: Screen / Surface / App -> `@bthwani/ui-kit` public exports -> Tamagui internally inside ui-kit only.
- Arabic/RTL UI must be directionally correct: icon+text cluster on the right, action/chevron opposite, right-aligned text, safe spacing, no clipping.
- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- Any reusable design belongs in approved design system / `@bthwani/ui-kit`.
- No new UI-kit files unless the need is non-negotiable, proven by evidence, and human-approved.
- Service/application/domain specialization belongs in `governance/`; `.agents` skills remain general.
- Do not claim `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` without Git diff, verification, and evidence.

Use these project-owned skills when relevant:

- `.agents/skills/bthwani-current-workspace-authority/SKILL.md`
- `.agents/skills/bthwani-agent-governance-execution/SKILL.md`
- `.agents/skills/bthwani-local-evidence-pack/SKILL.md`
- `.agents/skills/bthwani-patch-review-and-evidence/SKILL.md`
- `.agents/skills/bthwani-agent-restoration-forensics/SKILL.md`
- `.agents/skills/bthwani-domain-governance-reader/SKILL.md`
- `.agents/skills/bthwani-ui-kit-surface-contract/SKILL.md`
- `.agents/skills/bthwani-screen-flow-binding-contract/SKILL.md`
- `.agents/skills/bthwani-platform-vars-control-contract/SKILL.md`
- `.agents/skills/bthwani-runtime-provider-config-contract/SKILL.md`
- `.agents/skills/bthwani-api-contract-client-boundary/SKILL.md`
- `.agents/skills/bthwani-go-backend-target-boundary/SKILL.md`
- `.agents/skills/bthwani-data-fixture-simulation-contract/SKILL.md`
- `.agents/skills/bthwani-finance-ledger-contract/SKILL.md`
- `.agents/skills/bthwani-commercial-growth-contract/SKILL.md`
- `.agents/skills/bthwani-commerce-catalog-contract/SKILL.md`
- `.agents/skills/bthwani-operations-dispatch-contract/SKILL.md`
- `.agents/skills/bthwani-mobile-navigation-back-contract/SKILL.md`
- `.agents/skills/bthwani-security-secrets-privacy-contract/SKILL.md`
- `.agents/skills/bthwani-supply-chain-intake-contract/SKILL.md`
- `.agents/skills/bthwani-test-quality-gates-contract/SKILL.md`
- `.agents/skills/bthwani-release-runtime-gates/SKILL.md`
- `.agents/skills/bthwani-observability-performance-contract/SKILL.md`
- `.agents/skills/bthwani-agent-skill-authoring-contract/SKILL.md`
- `.agents/skills/bthwani-agent-registry-validator/SKILL.md`
- `.agents/skills/nx-workspace/SKILL.md`
- `.agents/skills/nx-generate/SKILL.md`
- `.agents/skills/nx-run-tasks/SKILL.md`

<!-- BTHWANI_CURRENT_AGENT_CONTRACT_END -->

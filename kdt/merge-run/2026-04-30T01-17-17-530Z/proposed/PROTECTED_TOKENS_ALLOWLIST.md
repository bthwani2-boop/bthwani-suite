# Protected Tokens Allowlist (auto-generated)

GeneratedAt: 2026-04-30T04:30:00Z
Source: tools/registry/runs/GUARD_BTHWANI_PROTECTED_TOKENS-20260430-013027/protected-tokens-findings.csv

Summary:
- Total findings: 945
- This document lists the top flagged files and provides an initial recommended action (ALLOW vs REVIEW) with a short rationale.

| File | Count | Recommended | Rationale |
|---|---:|---|---|
| governance/BTHWANI_PLATFORM_DSH_FULL_END_TO_END_ROADMAP_V2.md | 43 | ALLOW | Governance document referencing BThwani identity and internal agent flows — expected.
| .github/agents/Routing/AGENT_ROUTING_INDEX.md | 27 | ALLOW | Agent routing index intentionally references agent names/tokens.
| governance/PLATFORM_BLUEPRINT.md | 21 | ALLOW | Governance blueprint — approved references expected.
| .github/agents/bthwani-suite-core-steward.agent.md | 20 | ALLOW | Agent meta-file; protected tokens are authoritative here.
| .github/agents/bthwani-surface-core-lossless.agent.md | 18 | ALLOW | Agent definition file; allowed.
| governance/PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md | 17 | ALLOW | Governance execution roadmap.
| governance/TAMAGUI_INTEGRATION_LAW.md | 16 | ALLOW | Governance law/constraints for Tamagui integration.
| governance/TAMAGUI_UI_KIT_REACT_NATIVE_BRIDGE_CLASSIFICATION.json | 16 | ALLOW | Canonical governance artifact.
| governance/BTHWANI_MASTER_EXECUTION_PLAYBOOK__SINGLE_FILE.md | 11 | ALLOW | Master playbook; expected to reference tokens.
| .github/skills/bthwani-workspace-boundaries/SKILL.md | 11 | ALLOW | Skill documentation; token references expected.
| governance/AGENT_CHANGE_LEDGER.md | 11 | ALLOW | Governance ledger.
| governance/14_AGENT_EXECUTION_RULES.md | 11 | ALLOW | Governance rules.
| governance/01_PLATFORM_SSOT.md | 10 | ALLOW | Single source-of-truth governance doc.
| governance/WARNING_BASELINE_CLASSIFICATION_MATRIX.md | 9 | ALLOW | Governance matrix.
| .github/agents/bthwani-platform-master-orchestrator-2026-v3-additive.agent.md | 9 | ALLOW | Master orchestrator agent file.
| governance/GOVERNANCE_SSOT.md | 8 | ALLOW | Governance SSOT.
| governance/ARCHITECTURE_LOCK.md | 7 | ALLOW | Architecture lock — intentional tokens.
| governance/BTHWANI_GUIDE__Unified_Execution_OS__V4_Phases_Waves_Todolists.md | 7 | ALLOW | Guide referencing governance tokens.
| governance/REPO_BOUNDARY.md | 7 | ALLOW | Governance boundary doc.
| governance/GOVERNANCE_CLOSURE_STANDARD.md | 6 | ALLOW | Governance standard.
| governance/LEGACY_REFERENCE_CLEANUP_POLICY.md | 6 | ALLOW | Governance policy.
| .github/copilot-instructions.md | 6 | ALLOW | Repo agent instructions — expected references.
| governance/10_SERVICE_CLOSURE_PROTOCOL.md | 5 | ALLOW | Governance protocol.
| packages/app-shells/mobile/partner/PartnerSurfaceHost.tsx | 5 | REVIEW | Application code: requires manual review to ensure no secrets or accidental tokens used in runtime code.
| .github/agents/platform-agent-os-2026-v3-additive/OS/MASTER_ORCHESTRATOR.md | 5 | ALLOW | Agent doc.
| governance/GOVERNANCE_FILE_CLASSIFICATION_MATRIX.md | 5 | ALLOW | Governance matrix.
| governance/README.md | 5 | ALLOW | Governance README.
| .github/instructions/bthwani-gp.instructions.md | 5 | ALLOW | Instruction script wrapper; allowed.
| .github/agents/platform-agent-os-2026-v3-additive/Policies/agent.policy.json | 5 | ALLOW | Policy document.
| governance/BATCH_06_REFERENCE_REMEDIATION_LEDGER.md | 5 | ALLOW | Governance ledger.
| governance/GOVERNANCE_CANDIDATE_RESOLUTION_MATRIX.md | 5 | ALLOW | Governance matrix.
| governance/GUARD_06_LEGACY_FORBIDDEN_NAMING.md | 5 | ALLOW | Governance guard doc.
| governance/BATCH_08_FINAL_DELETION_LEDGER.md | 4 | ALLOW | Governance ledger.
| governance/07_UI_KIT_AUTHORITY_CONTRACT.md | 4 | ALLOW | Governance contract.
| .github/prompts/gp.prompt.md | 4 | ALLOW | Prompt/instructions file.
| .github/skills/bthwani-agent-os-2026-v3-brand-identity-guard/SKILL.md | 4 | ALLOW | Skill doc.
| .github/skills/bthwani-task-contracts/SKILL.md | 4 | ALLOW | Skill doc.
| .github/skills/bthwani-unified-experience-review/SKILL.md | 4 | ALLOW | Skill doc.
| governance/DOCS_GOVERNANCE_DELETION_READINESS_AUDIT.md | 4 | ALLOW | Governance audit.
| packages/ui-kit/docs/UIKIT_CANONICAL_STANDARD.md | 4 | REVIEW | Package-level docs referencing tokens; review for branding vs secrets.
| packages/ui-kit/docs/BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md | 4 | REVIEW | Package docs.
| packages/app-shells/index.ts | 4 | REVIEW | Package code; review required.
| packages/ui-kit/src/locales.ts | 4 | REVIEW | Locales may include brand strings — audit for PII/secrets.
| governance/GOVERNANCE_CLOSEOUT_ROADMAP.md | 4 | ALLOW | Governance roadmap.
| governance/GOVERNANCE_DEDICATED_MERGE_DELETE_PLAN.md | 4 | ALLOW | Governance plan.
| governance/GUARD_07_UIKIT_TAMAGUI_BOUNDARY.md | 3 | ALLOW | Governance guard.
| apps/mobile/app-partner/app.config.ts | 3 | REVIEW | App config file — confirm no secrets.
| apps/mobile/app-field/src/bootstrap/bthwaniDirectionBootstrap.js | 3 | REVIEW | Bootstrap code referencing token constants — verify.
| apps/mobile/app-field/package.json | 3 | REVIEW | Package manifest — verify scripts and config.

Recommendations / Next Actions:

1. ALLOW items: record as accepted by governance review and include them in a formal allow-list artifact. These are primarily governance docs, `.github/agents`, and `.github/skills` files where token references are expected.

2. REVIEW items: open each file and audit for accidental secrets or runtime tokens. For each REVIEW file, choose one of:
   - Redact sensitive literal tokens and replace with canonical placeholder (e.g., `__REDACTED__`) and store secrets in secure vault.
   - Move branding-only references to canonical governance docs if they are duplicated.
   - Confirm and record owner approval if the occurrence is legitimate.

3. Automated remediation plan (recommended):
   - Generate a proposed patch that adds an allowlist file under `proposed/` and edits REVIEW files with suggested safe placeholders (dry-run only).
   - Re-run guards and ensure SECRET_WARNINGS drop to 0 and PROTECTED_TOKENS_WARNINGS are reduced to accept-list delta.

4. Owner sign-off: do not apply non-dry-run merges until owners approve the allowlist and all REVIEW files are remediated.

5. Operational note: this allowlist is non-destructive and lives under the `kdt/merge-run/.../proposed/` folder for human review.

-- End of auto-generated allowlist --

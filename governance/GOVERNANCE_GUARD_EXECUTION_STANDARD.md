# Governance Guard Execution Standard

Status: CANONICAL_GUARD_STANDARD
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_11_REBUILD_CONTROL_PLANE_AND_GUARDS-20260430-003134
LastRebuiltBy: GOVERNANCE_BATCH_11_REBUILD_CONTROL_PLANE_AND_GUARDS-20260430-003134

## Guard lifecycle

Guards must run in layers:

1. During development
2. Before commit
3. At commit/staged review
4. Before push
5. In Pull Request / CI when available
6. Before final closure decision

## Current guard inventory

| Guard | Path | Status |
|---|---|---|
| guard-agent-skill-registry-ownership.mjs | tools/guards/guard-agent-skill-registry-ownership.mjs | CATALOGUED |
| guard-ci-workflow-coverage.mjs | tools/guards/guard-ci-workflow-coverage.mjs | CATALOGUED |
| guard-design-token-brand-drift.mjs | tools/guards/guard-design-token-brand-drift.mjs | CATALOGUED |
| guard-duplicate-docs-agent-skill-content.mjs | tools/guards/guard-duplicate-docs-agent-skill-content.mjs | CATALOGUED |
| guard-empty-placeholder-zero-byte-files.mjs | tools/guards/guard-empty-placeholder-zero-byte-files.mjs | CATALOGUED |
| guard-evidence-registry-hygiene.mjs | tools/guards/guard-evidence-registry-hygiene.mjs | CATALOGUED |
| guard-evidence-registry-runs-hygiene.mjs | tools/guards/guard-evidence-registry-runs-hygiene.mjs | CATALOGUED |
| guard-evidence-to-commit-traceability.mjs | tools/guards/guard-evidence-to-commit-traceability.mjs | CATALOGUED |
| guard-governance-boundaries.mjs | tools/guards/guard-governance-boundaries.mjs | CATALOGUED |
| guard-governance-ssot-conflict.mjs | tools/guards/guard-governance-ssot-conflict.mjs | CATALOGUED |
| guard-legacy-forbidden-naming.mjs | tools/guards/guard-legacy-forbidden-naming.mjs | CATALOGUED |
| guard-package-exports-completeness.mjs | tools/guards/guard-package-exports-completeness.mjs | CATALOGUED |
| guard-package-internal-deep-import.mjs | tools/guards/guard-package-internal-deep-import.mjs | CATALOGUED |
| guard-public-export-barrel-contract.mjs | tools/guards/guard-public-export-barrel-contract.mjs | CATALOGUED |
| guard-route-screen-file-structure.mjs | tools/guards/guard-route-screen-file-structure.mjs | CATALOGUED |
| guard-rtl-i18n.mjs | tools/guards/guard-rtl-i18n.mjs | CATALOGUED |
| guard-runtime-route-entrypoint-protection.mjs | tools/guards/guard-runtime-route-entrypoint-protection.mjs | CATALOGUED |
| guard-script-safety.mjs | tools/guards/guard-script-safety.mjs | CATALOGUED |
| guard-service-blueprint-coverage.mjs | tools/guards/guard-service-blueprint-coverage.mjs | CATALOGUED |
| guard-shared-folder-ownership.mjs | tools/guards/guard-shared-folder-ownership.mjs | CATALOGUED |
| guard-surface-screen-ownership.mjs | tools/guards/guard-surface-screen-ownership.mjs | CATALOGUED |
| guard-test-smoke-coverage-presence.mjs | tools/guards/guard-test-smoke-coverage-presence.mjs | CATALOGUED |
| guard-typescript-strictness.mjs | tools/guards/guard-typescript-strictness.mjs | CATALOGUED |
| guard-uikit-tamagui-boundary.mjs | tools/guards/guard-uikit-tamagui-boundary.mjs | CATALOGUED |
| guard-unused-dead-orphan-code.mjs | tools/guards/guard-unused-dead-orphan-code.mjs | CATALOGUED |

## Non-negotiable rules

- A guard must be executable.
- A guard must produce evidence or a clear decision.
- A guard must not silently mutate broad repo state.
- Warning baselines must not become hard failures without a dedicated batch.
- New guards must pass in the same batch that introduces them.

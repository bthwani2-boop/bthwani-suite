# Warning Baseline Classification Matrix

Status: CANONICAL_BASELINE_MATRIX
Owner: BThwani Governance
SourceEvidence: $EvidenceRoot
HeadBefore: $HeadBefore

## Summary

- TotalErrors: 0
- TotalWarnings: 11688
- GuardCount: 25

## Guard baseline

| Guard | Errors | Warnings | Classification | Owner | Target phase |
|---|---:|---:|---|---|---|
| guard-agent-skill-registry-ownership | 0 | 3 | NEEDS_OWNER_DECISION | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-ci-workflow-coverage | 0 | 25 | NEEDS_OWNER_DECISION | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-design-token-brand-drift | 0 | 1588 | NEEDS_OWNER_DECISION | UI_SYSTEM_OWNER | CI-WARNING-CLASSIFY |
| guard-duplicate-docs-agent-skill-content | 0 | 51 | NEEDS_FIX_AFTER_TRACEABILITY | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-empty-placeholder-zero-byte-files | 0 | 285 | NEEDS_FIX_AFTER_TRACEABILITY | BTHWANI_GOVERNANCE | CI-WARNING-CLASSIFY |
| guard-evidence-registry-hygiene | 0 | 1844 | NEEDS_OWNER_DECISION | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-evidence-registry-runs-hygiene | 0 | 500 | NEEDS_OWNER_DECISION | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-evidence-to-commit-traceability | 0 | 0 | PASS_NO_WARNINGS | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-governance-boundaries | 0 | 423 | NEEDS_OWNER_DECISION | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-governance-ssot-conflict | 0 | 97 | NEEDS_OWNER_DECISION | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-legacy-forbidden-naming | 0 | 246 | PROMOTE_TO_ERROR_LATER | BTHWANI_GOVERNANCE | CI-PROMOTE-SELECTED |
| guard-package-exports-completeness | 0 | 2 | NEEDS_OWNER_DECISION | ARCHITECTURE_OWNER | CI-WARNING-CLASSIFY |
| guard-package-internal-deep-import | 0 | 39 | PROMOTE_TO_ERROR_LATER | ARCHITECTURE_OWNER | CI-PROMOTE-SELECTED |
| guard-public-export-barrel-contract | 0 | 337 | PROMOTE_TO_ERROR_LATER | BTHWANI_GOVERNANCE | CI-PROMOTE-SELECTED |
| guard-route-screen-file-structure | 0 | 108 | NEEDS_OWNER_DECISION | BTHWANI_GOVERNANCE | CI-WARNING-CLASSIFY |
| guard-rtl-i18n | 0 | 5285 | NEEDS_OWNER_DECISION | BTHWANI_GOVERNANCE | CI-WARNING-CLASSIFY |
| guard-runtime-route-entrypoint-protection | 0 | 41 | NEEDS_OWNER_DECISION | BTHWANI_GOVERNANCE | CI-WARNING-CLASSIFY |
| guard-script-safety | 0 | 20 | PROMOTE_TO_ERROR_LATER | GOVERNANCE_OWNER | CI-PROMOTE-SELECTED |
| guard-service-blueprint-coverage | 0 | 0 | PASS_NO_WARNINGS | ARCHITECTURE_OWNER | CI-WARNING-CLASSIFY |
| guard-shared-folder-ownership | 0 | 16 | NEEDS_OWNER_DECISION | BTHWANI_GOVERNANCE | CI-WARNING-CLASSIFY |
| guard-surface-screen-ownership | 0 | 0 | PASS_NO_WARNINGS | ARCHITECTURE_OWNER | CI-WARNING-CLASSIFY |
| guard-test-smoke-coverage-presence | 0 | 12 | NEEDS_OWNER_DECISION | BTHWANI_GOVERNANCE | CI-WARNING-CLASSIFY |
| guard-typescript-strictness | 0 | 500 | NEEDS_OWNER_DECISION | GOVERNANCE_OWNER | CI-WARNING-CLASSIFY |
| guard-uikit-tamagui-boundary | 0 | 185 | PROMOTE_TO_ERROR_LATER | UI_SYSTEM_OWNER | CI-PROMOTE-SELECTED |
| guard-unused-dead-orphan-code | 0 | 81 | NEEDS_FIX_AFTER_TRACEABILITY | BTHWANI_GOVERNANCE | CI-WARNING-CLASSIFY |

## Rule

Warnings are not closure. They are baseline debt until classified, fixed, or promoted by owner-approved policy.

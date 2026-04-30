# Governance Guard Catalog

Status: CANONICAL_CATALOG
Owner: BThwani Governance
SourceEvidence: C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_11_REBUILD_CONTROL_PLANE_AND_GUARDS-20260430-003134
LastRebuiltBy: GOVERNANCE_BATCH_11_REBUILD_CONTROL_PLANE_AND_GUARDS-20260430-003134

## Summary

- Guard files scanned: 25
- Active docs/governance references: 0

| Guard | Purpose | Path |
|---|---|---|
| guard-agent-skill-registry-ownership.mjs | agent skill registry ownership | tools/guards/guard-agent-skill-registry-ownership.mjs |
| guard-ci-workflow-coverage.mjs | ci workflow coverage | tools/guards/guard-ci-workflow-coverage.mjs |
| guard-design-token-brand-drift.mjs | design token brand drift | tools/guards/guard-design-token-brand-drift.mjs |
| guard-duplicate-docs-agent-skill-content.mjs | duplicate docs agent skill content | tools/guards/guard-duplicate-docs-agent-skill-content.mjs |
| guard-empty-placeholder-zero-byte-files.mjs | empty placeholder zero byte files | tools/guards/guard-empty-placeholder-zero-byte-files.mjs |
| guard-evidence-registry-hygiene.mjs | evidence registry hygiene | tools/guards/guard-evidence-registry-hygiene.mjs |
| guard-evidence-registry-runs-hygiene.mjs | evidence registry runs hygiene | tools/guards/guard-evidence-registry-runs-hygiene.mjs |
| guard-evidence-to-commit-traceability.mjs | evidence to commit traceability | tools/guards/guard-evidence-to-commit-traceability.mjs |
| guard-governance-boundaries.mjs | governance boundaries | tools/guards/guard-governance-boundaries.mjs |
| guard-governance-ssot-conflict.mjs | governance ssot conflict | tools/guards/guard-governance-ssot-conflict.mjs |
| guard-legacy-forbidden-naming.mjs | legacy forbidden naming | tools/guards/guard-legacy-forbidden-naming.mjs |
| guard-package-exports-completeness.mjs | package exports completeness | tools/guards/guard-package-exports-completeness.mjs |
| guard-package-internal-deep-import.mjs | package internal deep import | tools/guards/guard-package-internal-deep-import.mjs |
| guard-public-export-barrel-contract.mjs | public export barrel contract | tools/guards/guard-public-export-barrel-contract.mjs |
| guard-route-screen-file-structure.mjs | route screen file structure | tools/guards/guard-route-screen-file-structure.mjs |
| guard-rtl-i18n.mjs | rtl i18n | tools/guards/guard-rtl-i18n.mjs |
| guard-runtime-route-entrypoint-protection.mjs | runtime route entrypoint protection | tools/guards/guard-runtime-route-entrypoint-protection.mjs |
| guard-script-safety.mjs | script safety | tools/guards/guard-script-safety.mjs |
| guard-service-blueprint-coverage.mjs | service blueprint coverage | tools/guards/guard-service-blueprint-coverage.mjs |
| guard-shared-folder-ownership.mjs | shared folder ownership | tools/guards/guard-shared-folder-ownership.mjs |
| guard-surface-screen-ownership.mjs | surface screen ownership | tools/guards/guard-surface-screen-ownership.mjs |
| guard-test-smoke-coverage-presence.mjs | test smoke coverage presence | tools/guards/guard-test-smoke-coverage-presence.mjs |
| guard-typescript-strictness.mjs | typescript strictness | tools/guards/guard-typescript-strictness.mjs |
| guard-uikit-tamagui-boundary.mjs | uikit tamagui boundary | tools/guards/guard-uikit-tamagui-boundary.mjs |
| guard-unused-dead-orphan-code.mjs | unused dead orphan code | tools/guards/guard-unused-dead-orphan-code.mjs |

## Guard-01 Governance Boundaries

Files:

```text
tools/guards/guard-governance-boundaries.mjs
tools/guards/guard-governance-boundaries.config.json
```

Default run command:

```powershell
node tools/guards/guard-governance-boundaries.mjs
```

Evidence output root:

```text
tools/registry/runs/GUARD_01_GOVERNANCE_BOUNDARIES-{timestamp}
```

### Current Calibration

`GUARD-01` is calibrated so that boundary and import violations remain blocking errors, while legacy token cleanup stays warning-first until dedicated cleanup batches close the baseline.

Blocking errors for this guard include:

```text
APP_OR_SHELL_DEEP_SURFACES_IMPORT
APP_RELATIVE_PACKAGE_IMPORT
PUBLIC_SURFACE_EXPORT_HAS_LOGIC
SURFACE_LOCAL_DESIGN_SYSTEM
UI_KIT_IMPORTS_SURFACE_OR_SHELL
MISSING_REQUIRED_GOVERNANCE_FILE
```

Warning queues for this guard include:

```text
APP_USER_LEGACY
MCPW_LEGACY
OLD_EVIDENCE_ROOT
OLD_ACTIVE_BTH_PATH
NPM_COMMAND_REVIEW
SURFACE_HARDCODED_COLOR_REVIEW
UI_KIT_DOMAIN_CONTENT_CANDIDATE
DEEP_UI_KIT_IMPORT
APP_PRODUCT_CONTENT_CANDIDATE
```

Calibration must not hide live source violations. This guard remains `CHECK`-only and must not mutate product files.

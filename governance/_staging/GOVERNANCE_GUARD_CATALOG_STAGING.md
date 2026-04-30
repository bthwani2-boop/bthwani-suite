---
generatedAt: 2026-04-30T04:52:00+03:00
note: STAGING guard catalog — collects all GUARD_*.md sources for review/merge
---

# GOV_GUARD_CATALOG (STAGING)

This staging file enumerates all `GUARD_*.md` files found in `governance/` for consolidation.

DO NOT EDIT THE ORIGINAL GUARD_*.md FILES YET. This file will be used to extract and normalize boilerplate and per-guard calibration data into a single canonical catalog and a separate execution-standard file.

## Guard source list

- governance/GUARD_02_SHARED_FOLDER_OWNERSHIP.md
- governance/GUARD_03_UNUSED_DEAD_ORPHAN_CODE.md
- governance/GUARD_04_PUBLIC_EXPORT_BARREL_CONTRACT.md
- governance/GUARD_05_PACKAGE_INTERNAL_DEEP_IMPORT.md
- governance/GUARD_06_LEGACY_FORBIDDEN_NAMING.md
- governance/GUARD_07_UIKIT_TAMAGUI_BOUNDARY.md
- governance/GUARD_08_RUNTIME_ROUTE_ENTRYPOINT_PROTECTION.md
- governance/GUARD_09_RTL_I18N.md
- governance/GUARD_10_EVIDENCE_REGISTRY_HYGIENE.md
- governance/GUARD_10_EVIDENCE_REGISTRY_RUNS_HYGIENE.md
- governance/GUARD_11_EMPTY_PLACEHOLDER_ZERO_BYTE_FILES.md
- governance/GUARD_12_DUPLICATE_DOCS_AGENT_SKILL_CONTENT.md
- governance/GUARD_13_GOVERNANCE_SSOT_CONFLICT.md
- governance/GUARD_14_AGENT_SKILL_REGISTRY_OWNERSHIP.md
- governance/GUARD_15_CI_WORKFLOW_COVERAGE.md
- governance/GUARD_16_PACKAGE_EXPORTS_COMPLETENESS.md
- governance/GUARD_17_SERVICE_BLUEPRINT_COVERAGE.md
- governance/GUARD_18_SURFACE_SCREEN_OWNERSHIP.md
- governance/GUARD_19_TYPESCRIPT_STRICTNESS.md
- governance/GUARD_20_DESIGN_TOKEN_BRAND_DRIFT.md
- governance/GUARD_21_ROUTE_SCREEN_FILE_STRUCTURE.md
- governance/GUARD_22_TEST_SMOKE_COVERAGE_PRESENCE.md
- governance/GUARD_23_SCRIPT_SAFETY.md
- governance/GUARD_ERROR_PROMOTION_PHASE_01_PLAN.md
- governance/GUARD_IMPLEMENTATION_MAP.md
- governance/GUARD_SEVERITY_PROMOTION_POLICY.md

## Next steps (recommended)

1. Extract canonical fields from each guard file: `title`, `purpose`, `mode`, `owner`, `calibration`, `exemptions`.
2. Normalize repeated boilerplate into `GOVERNANCE_GUARD_EXECUTION_STANDARD.md` (lifecycle rules, promotion phases, mode definitions).
3. Import guard-specific calibration and owners into `GOVERNANCE_GUARD_CATALOG.md` as the authoritative inventory.
4. Update `tools/guards/` configs to reference the new canonical paths before archiving old GUARD_*.md files.

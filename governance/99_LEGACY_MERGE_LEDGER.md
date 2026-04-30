# Legacy Merge Ledger

## Purpose

This ledger accounts for every source file in the uploaded governance package. It does not mean every sentence was copied verbatim. It means every source file was classified and mapped to a canonical owner so the legacy folder does not remain an active authority.

## Disposition vocabulary

- `PROMOTED`: rule family promoted into canonical owner files.
- `SUPERSEDED`: content replaced by stronger canonical policy.
- `ARCHIVED_REFERENCE`: retained as source evidence only.
- `REJECTED`: intentionally not adopted.

## Source inventory

| # | Source path | Kind | Lines | Words | SHA256 | Disposition | Canonical target |
|---:|---|---|---:|---:|---|---|---|

| 1 | `00_README.md` | `current-canonical` | 52 | 264 | `a9facd72f1bf4db0` | `SUPERSEDED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 2 | `01_GOVERNANCE_INDEX.md` | `current-canonical` | 42 | 318 | `327a9c568fe55ec3` | `SUPERSEDED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 3 | `02_PLATFORM_SSOT.md` | `current-canonical` | 36 | 215 | `a33fbec4a34bae4a` | `SUPERSEDED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 4 | `03_REPO_BOUNDARIES.md` | `current-canonical` | 30 | 160 | `9c7354684835fcf7` | `SUPERSEDED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 5 | `04_ARCHITECTURE_RULES.md` | `current-canonical` | 34 | 172 | `67fc41f61f81d989` | `SUPERSEDED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 6 | `05_PACKAGE_BOUNDARIES.md` | `current-canonical` | 36 | 126 | `26a6689d43ffbdd7` | `SUPERSEDED` | `05_PACKAGE_BOUNDARIES.md` |
| 7 | `06_APPS_AND_SHELLS.md` | `current-canonical` | 20 | 109 | `e921325060d0e511` | `SUPERSEDED` | `06_APPS_AND_SHELLS.md` |
| 8 | `07_SURFACES_AND_SERVICES.md` | `current-canonical` | 48 | 257 | `60b05404c7e510b1` | `SUPERSEDED` | `07_SURFACES_AND_SERVICES.md; 04_ARCHITECTURE_RULES.md` |
| 9 | `08_UI_KIT_AND_BRAND.md` | `current-canonical` | 37 | 155 | `0922b452cae1f386` | `SUPERSEDED` | `08_UI_KIT_AND_BRAND.md` |
| 10 | `09_API_BINDING_RUNTIME.md` | `current-canonical` | 69 | 326 | `b3c993b8b8a8fce1` | `SUPERSEDED` | `09_API_BINDING_RUNTIME.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 11 | `10_SERVICE_CLOSURE.md` | `current-canonical` | 25 | 120 | `397cbebdacc3e594` | `SUPERSEDED` | `10_SERVICE_CLOSURE.md; 22_DSH_GOLDEN_SLICE.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 12 | `11_EVIDENCE_AND_TRACEABILITY.md` | `current-canonical` | 121 | 449 | `d822448c8d3f7637` | `SUPERSEDED` | `11_EVIDENCE_AND_TRACEABILITY.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 13 | `12_TESTING_AND_PRODUCTION_READINESS.md` | `current-canonical` | 25 | 122 | `f4d28801e5a7ecd1` | `SUPERSEDED` | `12_TESTING_AND_PRODUCTION_READINESS.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 14 | `13_CI_AND_GATES.md` | `current-canonical` | 34 | 142 | `959e75efc5f28523` | `SUPERSEDED` | `13_CI_AND_GATES.md` |
| 15 | `14_GUARDS_CATALOG.md` | `current-canonical` | 56 | 268 | `5af52423221c321e` | `SUPERSEDED` | `14_GUARDS_CATALOG.md` |
| 16 | `15_AGENT_AND_AI_EXECUTION.md` | `current-canonical` | 34 | 148 | `5df7130d147c4171` | `SUPERSEDED` | `15_AGENT_AND_AI_EXECUTION.md` |
| 17 | `16_SECURITY_AND_SECRETS.md` | `current-canonical` | 30 | 132 | `0bc804fd04d4d0bf` | `SUPERSEDED` | `16_SECURITY_AND_SECRETS.md` |
| 18 | `17_CLEANUP_AND_DEPRECATION.md` | `current-canonical` | 29 | 127 | `d2247a2ee26a19b4` | `SUPERSEDED` | `17_CLEANUP_AND_DEPRECATION.md` |
| 19 | `18_BRANCH_AND_CHECKPOINTS.md` | `current-canonical` | 61 | 197 | `95997bc3b21b6ac0` | `SUPERSEDED` | `18_BRANCH_AND_CHECKPOINTS.md` |
| 20 | `99_LEGACY_MERGE_LEDGER.md` | `current-canonical` | 131 | 1289 | `ad048b9842c8990e` | `SUPERSEDED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 21 | `governance-legacy/00_GOVERNANCE_INDEX.md` | `legacy` | 143 | 886 | `27d3cb71c8880210` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 22 | `governance-legacy/01_PLATFORM_SSOT.md` | `legacy` | 118 | 461 | `d87915c9545d4387` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 23 | `governance-legacy/02_BRANCH_AND_EVIDENCE_POLICY.md` | `legacy` | 167 | 554 | `7433f0801f7af9d5` | `PROMOTED` | `18_BRANCH_AND_CHECKPOINTS.md` |
| 24 | `governance-legacy/03_PACKAGE_BOUNDARY_CONTRACT.md` | `legacy` | 127 | 811 | `3f795497553e3470` | `PROMOTED` | `05_PACKAGE_BOUNDARIES.md` |
| 25 | `governance-legacy/04_APPS_SHELL_ONLY_CONTRACT.md` | `legacy` | 99 | 449 | `d33cea39a1278be7` | `PROMOTED` | `06_APPS_AND_SHELLS.md` |
| 26 | `governance-legacy/06_SURFACES_OWNERSHIP_CONTRACT.md` | `legacy` | 99 | 293 | `40c718e53309e628` | `PROMOTED` | `07_SURFACES_AND_SERVICES.md; 04_ARCHITECTURE_RULES.md` |
| 27 | `governance-legacy/07_UI_KIT_AUTHORITY_CONTRACT.md` | `legacy` | 95 | 391 | `cb9808c4bdeef682` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md` |
| 28 | `governance-legacy/08_SCREEN_FILE_MODEL_CONTRACT.md` | `legacy` | 81 | 258 | `df924cfbd4560ba8` | `PROMOTED` | `07_SURFACES_AND_SERVICES.md; 04_ARCHITECTURE_RULES.md` |
| 29 | `governance-legacy/09_SHARED_FOLDER_GOVERNANCE.md` | `legacy` | 57 | 236 | `d4556fbe668b371a` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 30 | `governance-legacy/10_SERVICE_CLOSURE_PROTOCOL.md` | `legacy` | 373 | 1251 | `4689f6b9e152f569` | `PROMOTED` | `10_SERVICE_CLOSURE.md; 22_DSH_GOLDEN_SLICE.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 31 | `governance-legacy/11_DSH_GOLDEN_SLICE_PROTOCOL.md` | `legacy` | 64 | 218 | `5c852d451d21dfb3` | `PROMOTED` | `10_SERVICE_CLOSURE.md; 22_DSH_GOLDEN_SLICE.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 32 | `governance-legacy/12_API_BINDING_RUNTIME_PROTOCOL.md` | `legacy` | 102 | 379 | `6677f8c4b6c7ae07` | `PROMOTED` | `09_API_BINDING_RUNTIME.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 33 | `governance-legacy/13_CI_GATES_CONTRACT.md` | `legacy` | 114 | 510 | `11a5815a91b1c75e` | `PROMOTED` | `13_CI_AND_GATES.md` |
| 34 | `governance-legacy/14_AGENT_EXECUTION_RULES.md` | `legacy` | 356 | 1299 | `f91e137fc9c8e49b` | `PROMOTED` | `15_AGENT_AND_AI_EXECUTION.md` |
| 35 | `governance-legacy/16_SECURITY_AND_SECRETS_POLICY.md` | `legacy` | 83 | 330 | `e7e3bc31b8870cd3` | `PROMOTED` | `16_SECURITY_AND_SECRETS.md` |
| 36 | `governance-legacy/17_TESTING_AND_PRODUCTION_READINESS.md` | `legacy` | 145 | 496 | `5f3358a3b3b1391a` | `PROMOTED` | `12_TESTING_AND_PRODUCTION_READINESS.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 37 | `governance-legacy/18_EVIDENCE_PACK_STANDARD.md` | `legacy` | 153 | 465 | `7edcb30b2e2e64cd` | `PROMOTED` | `11_EVIDENCE_AND_TRACEABILITY.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 38 | `governance-legacy/19_PATCH_REVIEW_PROTOCOL.md` | `legacy` | 37 | 115 | `0c53a9b26e78b83b` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 39 | `governance-legacy/AGENT_CHANGE_LEDGER_POLICY.md` | `legacy` | 110 | 359 | `255a1ede01b2f08f` | `PROMOTED` | `15_AGENT_AND_AI_EXECUTION.md` |
| 40 | `governance-legacy/AGENT_GOVERNANCE_POLICY.md` | `legacy` | 38 | 126 | `44a830c79b0386d4` | `PROMOTED` | `15_AGENT_AND_AI_EXECUTION.md` |
| 41 | `governance-legacy/AGENT_UPDATE_VALIDATION_CHECKLIST.md` | `legacy` | 68 | 379 | `b316af9a43f56498` | `PROMOTED` | `15_AGENT_AND_AI_EXECUTION.md` |
| 42 | `governance-legacy/AI_EXECUTION_GOVERNANCE.md` | `legacy` | 106 | 274 | `208a8ec0632871be` | `PROMOTED` | `15_AGENT_AND_AI_EXECUTION.md` |
| 43 | `governance-legacy/API_CONTRACT_POLICY.md` | `legacy` | 122 | 324 | `eb2e4d4b330c4814` | `PROMOTED` | `09_API_BINDING_RUNTIME.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 44 | `governance-legacy/APPROVED_SURFACE_NAMING.md` | `legacy` | 39 | 135 | `2c0ba2341796623f` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 45 | `governance-legacy/ARCHITECTURE_GUARDRAILS.md` | `legacy` | 86 | 328 | `6b407fa29b327c33` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 46 | `governance-legacy/ARCHITECTURE_LOCK.md` | `legacy` | 176 | 970 | `62e2e2284536f531` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 47 | `governance-legacy/BRANCH_AND_CHECKPOINT_POLICY.md` | `legacy` | 96 | 222 | `d3f6c27b6e9a7be5` | `PROMOTED` | `18_BRANCH_AND_CHECKPOINTS.md` |
| 48 | `governance-legacy/BTHWANI_GUIDE__Unified_Execution_OS__V4_Phases_Waves_Todolists.md` | `legacy` | 2305 | 7413 | `c8b96ac10b84ba7d` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md` |
| 49 | `governance-legacy/BTHWANI_MASTER_EXECUTION_PLAYBOOK__SINGLE_FILE.md` | `legacy` | 1139 | 3790 | `5a0d073e90a3d3a6` | `PROMOTED` | `15_AGENT_AND_AI_EXECUTION.md` |
| 50 | `governance-legacy/BTHWANI_PLATFORM_DSH_FULL_END_TO_END_ROADMAP_V2.md` | `legacy` | 2621 | 8394 | `7e1c2e63fb65b3ef` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 51 | `governance-legacy/CHANGE_ENTRY_RULE.md` | `legacy` | 63 | 314 | `623b3c5274eac35f` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 52 | `governance-legacy/CI_GRADUAL_GATE_POLICY.md` | `legacy` | 69 | 251 | `7cc3f8750c3eb17c` | `PROMOTED` | `13_CI_AND_GATES.md` |
| 53 | `governance-legacy/CI_REPORT_ONLY_READINESS_PLAN.md` | `legacy` | 30 | 89 | `7b42aa48942199f0` | `PROMOTED` | `13_CI_AND_GATES.md` |
| 54 | `governance-legacy/CLEANUP_AND_DEPRECATION_POLICY.md` | `legacy` | 98 | 217 | `291cb36cd0df1f23` | `PROMOTED` | `17_CLEANUP_AND_DEPRECATION.md` |
| 55 | `governance-legacy/DIRECTION_I18N_OWNERSHIP.md` | `legacy` | 70 | 342 | `aa01dec0c976f923` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md` |
| 56 | `governance-legacy/DOCS_GOVERNANCE_ACTIVE_REFERENCE_REMEDIATION_PLAN.md` | `legacy` | 33 | 102 | `bd06846e7e0befd4` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 57 | `governance-legacy/DOCS_GOVERNANCE_DELETION_GATE_DECISION.md` | `legacy` | 31 | 112 | `78648805e74dad62` | `PROMOTED` | `13_CI_AND_GATES.md` |
| 58 | `governance-legacy/DOCS_GOVERNANCE_DELETION_READINESS_AUDIT.md` | `legacy` | 41 | 180 | `a11da81cf250d222` | `PROMOTED` | `17_CLEANUP_AND_DEPRECATION.md` |
| 59 | `governance-legacy/DOCS_GOVERNANCE_DELETION_READINESS_POLICY.md` | `legacy` | 62 | 227 | `6722e6ee1bbeb74e` | `PROMOTED` | `17_CLEANUP_AND_DEPRECATION.md` |
| 60 | `governance-legacy/EVIDENCE_AND_CLOSURE_GATES.md` | `legacy` | 147 | 271 | `9cb0d1e211e81456` | `PROMOTED` | `10_SERVICE_CLOSURE.md; 22_DSH_GOLDEN_SLICE.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 61 | `governance-legacy/EVIDENCE_PACK_TEMPLATE.md` | `legacy` | 56 | 220 | `b5608ee3cc09cd71` | `PROMOTED` | `11_EVIDENCE_AND_TRACEABILITY.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 62 | `governance-legacy/FLOW_API_BINDING_RUNTIME_GUARDRAILS.md` | `legacy` | 114 | 260 | `11236f0a14478cd2` | `PROMOTED` | `09_API_BINDING_RUNTIME.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 63 | `governance-legacy/GOVERNANCE_AUDIT_FALSE_POSITIVE_CLASSIFICATION.md` | `legacy` | 42 | 269 | `30fddd6e2545ed04` | `PROMOTED` | `23_WARNINGS_AND_FALSE_POSITIVES.md` |
| 64 | `governance-legacy/GOVERNANCE_CANDIDATE_RESOLUTION_MATRIX.md` | `legacy` | 31 | 115 | `32b3b2caae7772c6` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 65 | `governance-legacy/GOVERNANCE_CANONICAL.md` | `legacy` | 39 | 268 | `5581eee8556b6f43` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 66 | `governance-legacy/GOVERNANCE_CANONICALIZATION_QUEUE.md` | `legacy` | 31 | 70 | `3adaed6535fc8e68` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 67 | `governance-legacy/GOVERNANCE_CLEANUP_CANDIDATES.md` | `legacy` | 55 | 200 | `bd438af1f2be4d7b` | `PROMOTED` | `17_CLEANUP_AND_DEPRECATION.md` |
| 68 | `governance-legacy/GOVERNANCE_CLOSEOUT_ROADMAP.md` | `legacy` | 44 | 166 | `609a0652280830ba` | `PROMOTED` | `10_SERVICE_CLOSURE.md; 22_DSH_GOLDEN_SLICE.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 69 | `governance-legacy/GOVERNANCE_CLOSURE_DECISION.md` | `legacy` | 33 | 113 | `3c9d18643a38912f` | `PROMOTED` | `10_SERVICE_CLOSURE.md; 22_DSH_GOLDEN_SLICE.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 70 | `governance-legacy/GOVERNANCE_CLOSURE_STANDARD.md` | `legacy` | 371 | 1423 | `fab07c1534ac846a` | `PROMOTED` | `10_SERVICE_CLOSURE.md; 22_DSH_GOLDEN_SLICE.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 71 | `governance-legacy/GOVERNANCE_CONSOLIDATION_DECISION_MATRIX.md` | `legacy` | 35 | 140 | `ed93abc7b380da6c` | `PROMOTED` | `13_CI_AND_GATES.md` |
| 72 | `governance-legacy/GOVERNANCE_CONTROL_PLANE_STANDARD.md` | `legacy` | 161 | 759 | `54e57f6725e4b068` | `PROMOTED` | `19_CONTROL_PANEL_AND_OPERATING_MODEL.md` |
| 73 | `governance-legacy/GOVERNANCE_DEDICATED_MERGE_DELETE_PLAN.md` | `legacy` | 45 | 142 | `dc388f8d2f0d18fc` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 74 | `governance-legacy/GOVERNANCE_DEEP_DEDUP_ANALYSIS_MATRIX.md` | `legacy` | 37 | 148 | `c4aa139deca9837b` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 75 | `governance-legacy/GOVERNANCE_DUPLICATE_CONTRADICTION_REGISTER.md` | `legacy` | 29 | 108 | `4c381ccf98732d75` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 76 | `governance-legacy/GOVERNANCE_FILE_CLASSIFICATION_MATRIX.md` | `legacy` | 48 | 134 | `770f4bd6cce4da6d` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 77 | `governance-legacy/GOVERNANCE_FINALIZATION_PROTOCOL.md` | `legacy` | 42 | 127 | `d87cdda08a741306` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 78 | `governance-legacy/GOVERNANCE_GUARD_CATALOG.md` | `legacy` | 127 | 486 | `4853a3218b920622` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 79 | `governance-legacy/GOVERNANCE_GUARD_EXECUTION_STANDARD.md` | `legacy` | 37 | 150 | `525d6179fdead7db` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 80 | `governance-legacy/GOVERNANCE_MASTER_CONTROL_PLANE.md` | `legacy` | 55 | 289 | `366ae6a609f622eb` | `PROMOTED` | `19_CONTROL_PANEL_AND_OPERATING_MODEL.md` |
| 81 | `governance-legacy/GOVERNANCE_MERGE_DECISIONS.md` | `legacy` | 40 | 170 | `1284ff80425d7e12` | `PROMOTED` | `13_CI_AND_GATES.md` |
| 82 | `governance-legacy/GOVERNANCE_PACKAGE_MANIFEST.json` | `legacy` | 47 | 96 | `5e2ad45d16b53914` | `PROMOTED` | `05_PACKAGE_BOUNDARIES.md` |
| 83 | `governance-legacy/GOVERNANCE_REORGANIZATION_LEDGER.md` | `legacy` | 142 | 1351 | `f570a79787ca81fd` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 84 | `governance-legacy/GOVERNANCE_SSOT.md` | `legacy` | 157 | 308 | `a118fc6cedc50bf3` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 85 | `governance-legacy/GOVERNANCE_TECHNICAL_DEBT_PRIORITIZATION_MATRIX.md` | `legacy` | 21 | 111 | `15b5345b6ac94d62` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 86 | `governance-legacy/GUARDRAILS_INDEX.md` | `legacy` | 96 | 323 | `1d963285362a1a9d` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 87 | `governance-legacy/GUARDS.md` | `legacy` | 38 | 125 | `14dc470780272f0d` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 88 | `governance-legacy/GUARD_02_SHARED_FOLDER_OWNERSHIP.md` | `legacy` | 62 | 159 | `fa4193a8a10486ab` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 89 | `governance-legacy/GUARD_03_UNUSED_DEAD_ORPHAN_CODE.md` | `legacy` | 75 | 190 | `5f19f31e18a8a2c3` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 90 | `governance-legacy/GUARD_04_PUBLIC_EXPORT_BARREL_CONTRACT.md` | `legacy` | 64 | 218 | `ee6daf6043336fb6` | `PROMOTED` | `05_PACKAGE_BOUNDARIES.md` |
| 91 | `governance-legacy/GUARD_05_PACKAGE_INTERNAL_DEEP_IMPORT.md` | `legacy` | 25 | 88 | `f84b4d46af65174b` | `PROMOTED` | `05_PACKAGE_BOUNDARIES.md` |
| 92 | `governance-legacy/GUARD_06_LEGACY_FORBIDDEN_NAMING.md` | `legacy` | 26 | 67 | `45a33a107ae11d98` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 93 | `governance-legacy/GUARD_07_UIKIT_TAMAGUI_BOUNDARY.md` | `legacy` | 31 | 91 | `fbc4dffe86ba1050` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md` |
| 94 | `governance-legacy/GUARD_08_RUNTIME_ROUTE_ENTRYPOINT_PROTECTION.md` | `legacy` | 28 | 118 | `48230ee026301a36` | `PROMOTED` | `09_API_BINDING_RUNTIME.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 95 | `governance-legacy/GUARD_09_RTL_I18N.md` | `legacy` | 25 | 84 | `e6b92597672d2ee3` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md` |
| 96 | `governance-legacy/GUARD_10_EVIDENCE_REGISTRY_HYGIENE.md` | `legacy` | 27 | 82 | `da2afa7397dc596d` | `PROMOTED` | `11_EVIDENCE_AND_TRACEABILITY.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 97 | `governance-legacy/GUARD_10_EVIDENCE_REGISTRY_RUNS_HYGIENE.md` | `legacy` | 44 | 157 | `77f26880b047a05f` | `PROMOTED` | `11_EVIDENCE_AND_TRACEABILITY.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 98 | `governance-legacy/GUARD_11_EMPTY_PLACEHOLDER_ZERO_BYTE_FILES.md` | `legacy` | 23 | 79 | `b8f30631cb004894` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 99 | `governance-legacy/GUARD_12_DUPLICATE_DOCS_AGENT_SKILL_CONTENT.md` | `legacy` | 23 | 80 | `67bfe6d1d66bd3d5` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 100 | `governance-legacy/GUARD_13_GOVERNANCE_SSOT_CONFLICT.md` | `legacy` | 23 | 76 | `f15d3dca6cfc9b8d` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 101 | `governance-legacy/GUARD_14_AGENT_SKILL_REGISTRY_OWNERSHIP.md` | `legacy` | 23 | 78 | `7e243e260f9da598` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 102 | `governance-legacy/GUARD_15_CI_WORKFLOW_COVERAGE.md` | `legacy` | 23 | 76 | `51b049465d59d079` | `PROMOTED` | `13_CI_AND_GATES.md` |
| 103 | `governance-legacy/GUARD_16_PACKAGE_EXPORTS_COMPLETENESS.md` | `legacy` | 23 | 76 | `27432c8835e25a84` | `PROMOTED` | `05_PACKAGE_BOUNDARIES.md` |
| 104 | `governance-legacy/GUARD_17_SERVICE_BLUEPRINT_COVERAGE.md` | `legacy` | 23 | 76 | `9fa4a31226de0d2c` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 105 | `governance-legacy/GUARD_18_SURFACE_SCREEN_OWNERSHIP.md` | `legacy` | 23 | 76 | `3e088410f2698427` | `PROMOTED` | `07_SURFACES_AND_SERVICES.md; 04_ARCHITECTURE_RULES.md` |
| 106 | `governance-legacy/GUARD_19_TYPESCRIPT_STRICTNESS.md` | `legacy` | 23 | 79 | `059e997f508dff74` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 107 | `governance-legacy/GUARD_20_DESIGN_TOKEN_BRAND_DRIFT.md` | `legacy` | 23 | 79 | `d46c41ad6e0ffee1` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md` |
| 108 | `governance-legacy/GUARD_21_ROUTE_SCREEN_FILE_STRUCTURE.md` | `legacy` | 23 | 78 | `1cd700323198d771` | `PROMOTED` | `07_SURFACES_AND_SERVICES.md; 04_ARCHITECTURE_RULES.md` |
| 109 | `governance-legacy/GUARD_22_TEST_SMOKE_COVERAGE_PRESENCE.md` | `legacy` | 23 | 78 | `fa791e22418973a4` | `PROMOTED` | `12_TESTING_AND_PRODUCTION_READINESS.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 110 | `governance-legacy/GUARD_23_SCRIPT_SAFETY.md` | `legacy` | 23 | 75 | `e7cfb64171a3bacb` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 111 | `governance-legacy/GUARD_24_EVIDENCE_TO_COMMIT_TRACEABILITY.md` | `legacy` | 23 | 75 | `a4f57ea8bcf69275` | `PROMOTED` | `11_EVIDENCE_AND_TRACEABILITY.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 112 | `governance-legacy/GUARD_ERROR_PROMOTION_PHASE_01_PLAN.md` | `legacy` | 25 | 137 | `2d918ca5895b35d3` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 113 | `governance-legacy/GUARD_IMPLEMENTATION_MAP.md` | `legacy` | 54 | 244 | `84141c1c551a5da3` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 114 | `governance-legacy/GUARD_SEVERITY_PROMOTION_POLICY.md` | `legacy` | 65 | 224 | `6fafb9df7b5833df` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 115 | `governance-legacy/LEGACY_REFERENCE_CLEANUP_MATRIX.md` | `legacy` | 22 | 103 | `2c72d7d3877f6223` | `PROMOTED` | `17_CLEANUP_AND_DEPRECATION.md` |
| 116 | `governance-legacy/LEGACY_REFERENCE_CLEANUP_POLICY.md` | `legacy` | 74 | 287 | `61517a12809fc314` | `PROMOTED` | `17_CLEANUP_AND_DEPRECATION.md` |
| 117 | `governance-legacy/OPENAPI_SOVEREIGNTY.md` | `legacy` | 73 | 390 | `da03597d6a5ff99a` | `PROMOTED` | `09_API_BINDING_RUNTIME.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 118 | `governance-legacy/OPERATION_CATALOG_TEMPLATE.md` | `legacy` | 41 | 135 | `db6b4760decd53c0` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 119 | `governance-legacy/OWNERSHIP.md` | `legacy` | 109 | 369 | `4c11890ffb5accbf` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 120 | `governance-legacy/PLATFORM_BLUEPRINT.md` | `legacy` | 801 | 2693 | `dc29b3cb89b74a27` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 121 | `governance-legacy/PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md` | `legacy` | 936 | 1886 | `46fb30e03cf2463c` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 122 | `governance-legacy/PLATFORM_OPERATING_MODEL.md` | `legacy` | 327 | 1597 | `5665c6b81ea95336` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 123 | `governance-legacy/README.md` | `legacy` | 81 | 353 | `fabfcb240600abcf` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 124 | `governance-legacy/REPO_BOUNDARIES_AND_OWNERSHIP.md` | `legacy` | 89 | 277 | `30647bc3bf0aa5c5` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 125 | `governance-legacy/REPO_BOUNDARY.md` | `legacy` | 67 | 256 | `1d2bdf74bee6f48e` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 126 | `governance-legacy/RUNTIME_VERIFICATION_POLICY.md` | `legacy` | 107 | 351 | `fefde353608d9584` | `PROMOTED` | `09_API_BINDING_RUNTIME.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 127 | `governance-legacy/SCOPE_LOCK.md` | `legacy` | 76 | 288 | `c8e7871edd0aa818` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 128 | `governance-legacy/SECURITY_AND_SECRETS_GUARDRAILS.md` | `legacy` | 85 | 167 | `62833899f8b4e97a` | `PROMOTED` | `14_GUARDS_CATALOG.md` |
| 129 | `governance-legacy/SERVICE_BLUEPRINT_STANDARD.md` | `legacy` | 81 | 239 | `704f6e4ea5678c95` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 130 | `governance-legacy/SERVICE_BLUEPRINT_TEMPLATE.md` | `legacy` | 76 | 284 | `c6f509d9159ab318` | `PROMOTED` | `01_GOVERNANCE_INDEX.md; 99_LEGACY_MERGE_LEDGER.md` |
| 131 | `governance-legacy/SERVICE_CATALOG.md` | `legacy` | 64 | 355 | `60912693691c9075` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 132 | `governance-legacy/SERVICE_CLOSURE_GUARDRAILS.md` | `legacy` | 149 | 257 | `cbfc4ae6d56995c4` | `PROMOTED` | `10_SERVICE_CLOSURE.md; 22_DSH_GOLDEN_SLICE.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 133 | `governance-legacy/SURFACE_CATALOG.md` | `legacy` | 47 | 199 | `bdb19229ef59b6b2` | `PROMOTED` | `02_PLATFORM_SSOT.md; 07_SURFACES_AND_SERVICES.md` |
| 134 | `governance-legacy/TAMAGUI_INTEGRATION_LAW.md` | `legacy` | 188 | 660 | `1c0e5e663d7f767b` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md` |
| 135 | `governance-legacy/TAMAGUI_UI_KIT_REACT_NATIVE_BRIDGE_CLASSIFICATION.json` | `legacy` | 98 | 311 | `a5936a382eadb3c3` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md; 99_LEGACY_MERGE_LEDGER.md` |
| 136 | `governance-legacy/TOP_WARNING_FAMILY_ACTION_PLAN.md` | `legacy` | 30 | 225 | `f0437e3c86d70d87` | `PROMOTED` | `23_WARNINGS_AND_FALSE_POSITIVES.md` |
| 137 | `governance-legacy/TRACEABILITY_MATRIX.md` | `legacy` | 86 | 235 | `068808f12f7f9d1b` | `PROMOTED` | `11_EVIDENCE_AND_TRACEABILITY.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 138 | `governance-legacy/TRACEABILITY_MATRIX_STANDARD.md` | `legacy` | 150 | 573 | `bbcabafaf4e550c4` | `PROMOTED` | `11_EVIDENCE_AND_TRACEABILITY.md; 24_TRACEABILITY_AND_ROADMAP.md` |
| 139 | `governance-legacy/UI_UX_GUARDRAILS.md` | `legacy` | 135 | 315 | `7ff271e4b0c1adfe` | `PROMOTED` | `08_UI_KIT_AND_BRAND.md` |
| 140 | `governance-legacy/VERIFICATION_MATRIX.md` | `legacy` | 74 | 247 | `304e7155d28cac33` | `PROMOTED` | `12_TESTING_AND_PRODUCTION_READINESS.md; 21_RUNTIME_OBSERVABILITY_AND_PRODUCTION.md` |
| 141 | `governance-legacy/WARNING_BASELINE_CLASSIFICATION_MATRIX.md` | `legacy` | 67 | 561 | `d0bab65581a5d2be` | `PROMOTED` | `23_WARNINGS_AND_FALSE_POSITIVES.md` |
| 142 | `governance-legacy/WARNING_CLASSIFICATION_POLICY.md` | `legacy` | 87 | 347 | `12df66d24f7d3b07` | `PROMOTED` | `23_WARNINGS_AND_FALSE_POSITIVES.md` |

## Non-negotiable conclusion

After this package is installed, source files under `governance-legacy/` must not be treated as active policy. If retained, they are archive/reference only until removed by the cleanup gates in `17_CLEANUP_AND_DEPRECATION.md`.

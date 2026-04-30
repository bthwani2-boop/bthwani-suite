# Guards Catalog

## Canonical guard records

| ID | Domain | Severity | Purpose | Evidence |
|---|---|---|---|---|
| `GUARD_01_SCOPE_AND_PATH_LOCK` | `scope` | `blocking` | ensures changes stay within approved paths | changed file list, allow/deny match |
| `GUARD_02_SHARED_FOLDER_OWNERSHIP` | `architecture` | `blocking` | prevents shared folder ownership drift | shared path scan |
| `GUARD_03_UNUSED_DEAD_ORPHAN_CODE` | `cleanup` | `report-only` | detects dead/orphan code candidates | reference scan |
| `GUARD_04_PUBLIC_EXPORT_BARREL_CONTRACT` | `packages` | `blocking` | checks public exports/barrels | export scan |
| `GUARD_05_PACKAGE_INTERNAL_DEEP_IMPORT` | `packages` | `blocking` | detects forbidden deep imports | import scan |
| `GUARD_06_LEGACY_FORBIDDEN_NAMING` | `naming` | `blocking` | detects standalone legacy names except valid bthwani terms | token scan |
| `GUARD_07_UIKIT_TAMAGUI_BOUNDARY` | `ui` | `blocking` | ensures Tamagui stays inside ui-kit | import scan |
| `GUARD_08_RUNTIME_ROUTE_ENTRYPOINT_PROTECTION` | `runtime` | `blocking` | protects routes/entrypoints | route scan |
| `GUARD_09_RTL_I18N` | `ui` | `report-only` | detects RTL/i18n risks | screen scan |
| `GUARD_10_EVIDENCE_REGISTRY_RUNS_HYGIENE` | `evidence` | `blocking` | checks registry run artifacts | evidence folder scan |
| `GUARD_11_EMPTY_PLACEHOLDER_ZERO_BYTE_FILES` | `cleanup` | `blocking` | rejects empty placeholders | file size scan |
| `GUARD_12_API_BINDING_RUNTIME` | `api` | `blocking` | checks contract/binding/runtime evidence | contract/runtime scan |
| `GUARD_13_GOVERNANCE_SSOT_CONFLICT` | `governance` | `blocking` | detects duplicate/conflicting governance truth | docs scan |
| `GUARD_14_AGENT_SKILL_REGISTRY_OWNERSHIP` | `agents` | `report-only` | checks agents/skills registry ownership | registry scan |
| `GUARD_15_CI_WORKFLOW_COVERAGE` | `ci` | `blocking` | checks expected CI workflow coverage | workflow scan |
| `GUARD_16_PACKAGE_EXPORTS_COMPLETENESS` | `packages` | `blocking` | checks export completeness | package export scan |
| `GUARD_17_SERVICE_BLUEPRINT_COVERAGE` | `services` | `report-only` | checks service blueprint presence | service scan |
| `GUARD_18_SURFACE_SCREEN_OWNERSHIP` | `surfaces` | `blocking` | checks screen ownership placement | surface scan |
| `GUARD_19_TYPESCRIPT_STRICTNESS` | `typescript` | `blocking` | checks TS strictness/no unsafe suppressions | tsc + grep |
| `GUARD_20_DESIGN_TOKEN_BRAND_DRIFT` | `ui` | `report-only` | detects random colors/token drift | style scan |
| `GUARD_21_ROUTE_SCREEN_FILE_STRUCTURE` | `routes` | `report-only` | checks route/screen file model | route scan |
| `GUARD_22_TEST_SMOKE_COVERAGE_PRESENCE` | `testing` | `report-only` | detects missing smoke tests | test scan |
| `GUARD_23_SCRIPT_SAFETY` | `scripts` | `blocking` | checks script safety requirements | script scan |
| `GUARD_24_EVIDENCE_TO_COMMIT_TRACEABILITY` | `evidence` | `blocking` | maps evidence to commit/branch | evidence/commit scan |

## ID conflict resolution

Legacy guard IDs that conflict with this catalog are preserved in `99_LEGACY_MERGE_LEDGER.md` as source evidence but are not canonical IDs.

Specifically, legacy `GUARD_12_DUPLICATE_DOCS_AGENT_SKILL_CONTENT` is superseded by `GUARD_13_GOVERNANCE_SSOT_CONFLICT` plus docs/reference scans. Canonical `GUARD_12` is `GUARD_12_API_BINDING_RUNTIME`.

## Guard record requirements

Every implemented guard must define:

- ID
- domain
- purpose
- severity
- mode: blocking/report-only
- input paths
- excluded paths
- output files
- false-positive handling
- remediation
- owner
- evidence schema

## Guard acceptance

A guard is accepted only when it can run repeatedly, produce deterministic output, and be traced to a governance source.

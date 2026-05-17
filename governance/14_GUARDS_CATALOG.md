# Guards Catalog

**Status:** Canonical Governance Payload v2
**Owner:** `Guard Governance`

## Guard record schema

Every guard must have:

```text
id | domain | purpose | severity | mode | owner file | evidence | remediation | false-positive policy
```

## Canonical guard catalog

| ID | Domain | Purpose | Default severity | Acceptance evidence | Owner |
| --- | --- | --- | --- | --- | --- |
| GUARD_01_GOVERNANCE_ROOT | governance | active governance roots and retired-policy quarantine | BLOCKING | No parallel policy roots; historical material isolated | 00,03,99 |
| GUARD_02_SHARED_FOLDER_OWNERSHIP | architecture | shared folder ownership | BLOCKING | No ambiguous shared implementation buckets | 04 |
| GUARD_03_PACKAGE_BOUNDARY | packages | package import/export boundaries | BLOCKING | No deep imports, no direct Tamagui outside ui-kit | 05,08 |
| GUARD_04_APPS_SHELL_ONLY | apps | apps remain shells | BLOCKING | No service logic/design system in apps | 06 |
| GUARD_05_SURFACE_SERVICE_OWNERSHIP | surfaces | service-owned vs surface-owned correctness | BLOCKING | Feature placed in correct lane | 04,07 |
| GUARD_06_UI_KIT_AUTHORITY | ui | ui-kit central authority | BLOCKING | No local duplicate UI systems | 08 |
| GUARD_07_RTL_BRAND_VISUAL | ui | RTL/brand visual checks | REPORT/BLOCK | Screenshots prove RTL and brand compliance | 08 |
| GUARD_08_SCREEN_STATE_MODEL | ui/flow | loading/empty/error/success/offline/disabled | BLOCKING when flow closure | State model documented | 04,08,10 |
| GUARD_09_API_CONTRACT | api | OpenAPI and contract presence | BLOCKING for public APIs | Public endpoint has contract | 09 |
| GUARD_10_API_BINDING_RUNTIME | runtime | contract→client→surface→runtime chain | BLOCKING for runtime closure | Binding matrix and runtime evidence | 09,10 |
| GUARD_11_WLT_FINANCIAL_OWNER | finance | WLT-only money truth | BLOCKING | No money mutation outside WLT | 02,07,20 |
| GUARD_12_VAR_POLICY | runtime policy | mutable VAR/provider control | BLOCKING for mutable policy | No hardcoded mutable operational policy | 20 |
| GUARD_13_EVIDENCE_PACK | evidence | evidence pack shape | BLOCKING | Required evidence files and `{SESSION_ID}.zip` | 11 |
| GUARD_14_BRANCH_CHECKPOINT | git | branch/checkpoint readiness | BLOCKING | branch reality captured | 18 |
| GUARD_15_SECURITY_SECRETS | security | secrets/PII/auth/security | BLOCKING | No secrets; security evidence | 16 |
| GUARD_16_TESTING_READINESS | quality | testing and readiness | BLOCKING when applicable | Type/test/build/runtime evidence | 12 |
| GUARD_17_CI_GATES | ci | CI blocking/report-only correctness | BLOCKING | No unclassified failing gates | 13,23 |
| GUARD_18_AGENT_EXECUTION | agents | agent/script scope | BLOCKING for agent-driven changes | Scope, ownership, and evidence stay inside the approved boundary | 15 |
| GUARD_19_CLEANUP_DEPRECATION | cleanup | delete/archive/deprecation safety | BLOCKING | Inventory/reference/rollback | 17 |
| GUARD_20_CONTROL_PANEL | control-panel | web-first control room model | REPORT/BLOCK | No route/page sprawl; ops tied to services | 19 |
| GUARD_21_OBSERVABILITY | runtime | logs/metrics/errors/health | BLOCKING for prod readiness | Observable runtime evidence | 09 |
| GUARD_22_DSH_GOLDEN_SLICE | dsh | DSH end-to-end closure | BLOCKING for DSH closure | All surfaces and states evidenced | 22 |
| GUARD_23_WARNING_CLASSIFICATION | warnings | warnings and false positives | BLOCKING if unclassified | Warning owner/severity/expiry | 23 |
| GUARD_24_TRACEABILITY_ROADMAP | roadmap | traceability and phase discipline | REPORT/BLOCK | No task without phase/evidence | 24 |
| GUARD_25_SERVICE_BLUEPRINT | services | blueprint and operation catalog | BLOCKING for service closure | Blueprint exists and complete | 10 |

## Guard severity

| Severity | Meaning |
|---|---|
| BLOCKING | Must stop merge/closure until fixed or explicitly overridden. |
| REPORT | Does not block but must be documented. |
| INFO | Diagnostic only. |

## Guard output schema

```json
{
  "guardId": "GUARD_13_EVIDENCE_PACK",
  "mode": "CHECK",
  "status": "PASS | WARN | FAIL | INFO",
  "severity": "BLOCKING | REPORT | INFO",
  "ownerFile": "governance/11_EVIDENCE_AND_TRACEABILITY.md",
  "findings": [],
  "evidenceFiles": [],
  "remediation": []
}
```

## ID collision rule

Guard IDs must never be reused for a different meaning. If a historical file used a conflicting ID, the new catalog wins and the conflict is recorded in `99_LEGACY_MERGE_LEDGER.md`.

## Guard implementation rule

Guard scripts live under `tools/guards` or equivalent implementation roots. They verify this catalog; they do not invent policy. Changing a guard behavior requires updating this file or the owner file first.

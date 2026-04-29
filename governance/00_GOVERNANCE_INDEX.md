# Governance Index

This file is the canonical entry index for BThwani governance.

## Canonical Files

| File | Owner | Status | Purpose |
|---|---|---|---|
| `README.md` | governance | CANONICAL | Human entry point and authority statement. |
| `00_GOVERNANCE_INDEX.md` | governance | CANONICAL | Canonical file map and execution order. |
| `01_PLATFORM_SSOT.md` | governance | CANONICAL | Platform truth, canonical paths, ownership model, and transitional doc status. |
| `02_BRANCH_AND_EVIDENCE_POLICY.md` | governance | CANONICAL | Branch reality, evidence packs, verification gates, and no-closure rules. |
| `18_EVIDENCE_PACK_STANDARD.md` | governance | CANONICAL | Required evidence pack schema and status decisions. |
| `19_PATCH_REVIEW_PROTOCOL.md` | governance | CANONICAL | Patch handoff, untracked file accounting, and review rules. |

## Planned Contract Files

These are required in later APPLY phases, not APPLY-01:

| Planned File | Purpose |
|---|---|
| `03_PACKAGE_BOUNDARY_CONTRACT.md` | Global package/import boundary law. |
| `04_APPS_SHELL_ONLY_CONTRACT.md` | Apps as shell/host only. |
| `05_APP_SHELLS_CONTRACT.md` | app-shells ownership and forbidden domain/service content. |
| `06_SURFACES_OWNERSHIP_CONTRACT.md` | service-owned vs surface-owned ownership. |
| `07_UI_KIT_AUTHORITY_CONTRACT.md` | ui-kit reusable design authority. |
| `08_SCREEN_FILE_MODEL_CONTRACT.md` | screen file/folder model. |
| `09_SHARED_FOLDER_GOVERNANCE.md` | shared/common folder governance. |
| `10_SERVICE_CLOSURE_PROTOCOL.md` | service closure method. |
| `11_DSH_GOLDEN_SLICE_PROTOCOL.md` | DSH-first closure protocol. |
| `12_API_BINDING_RUNTIME_PROTOCOL.md` | contracts, API, binding, integration, and runtime order. |
| `13_CI_GATES_CONTRACT.md` | CI and guard requirements. |
| `14_AGENT_EXECUTION_RULES.md` | AI/Copilot/agent execution law. |
| `15_LEGACY_RETIREMENT_POLICY.md` | legacy drift retirement. |
| `16_SECURITY_AND_SECRETS_POLICY.md` | security, secrets, privacy, and audit. |
| `17_TESTING_AND_PRODUCTION_READINESS.md` | testing and production readiness. |

## Directory Roles

| Path | Role |
|---|---|
| `governance/` | Canonical governance SSoT. |
| `docs/governance/` | Transitional/reference/archive until reconciled. |
| `.github/workflows/` | CI enforcement, not governance authorship. |
| `tools/scripts/` | Executable checks/guards, not policy authorship. |
| `tools/guards/` | Guard definitions/wrappers if retained. |
| `.agents`, `.github/agents`, `.github/skills`, `.cursor` | Agent/editor rules derived from governance. |
| `tools/registry/runs/` | Evidence output only. |

## Execution Order

```text
GOV diagnostics -> APPLY-01 SSoT skeleton -> APPLY-02 contracts -> APPLY-03 CI/tools -> APPLY-04 agents -> APPLY-05 legacy -> APPLY-06 boundary queue -> APPLY-07 verification -> DSH forensics
```

## Current Gate

APPLY-01 may only update the six canonical files listed in this index. All other repair work must wait for its own phase.

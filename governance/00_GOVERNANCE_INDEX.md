# BThwani Governance Index

Status: CANONICAL_INDEX
Owner: BThwani Governance
LastStandardizedBy: GOVERNANCE_BATCH_09_RESCUE_STANDARDIZE_CLOSE-20260430-001242

## Canonical roots

| Root | Role |
|---|---|
| governance/ | Canonical governance control plane |
| tools/guards/ | Executable governance guard scripts |
| tools/scripts/ | Evidence, verification, and controlled automation scripts |
| tools/registry/runs/ | Canonical evidence run output |
| .github/workflows/ | CI/CD enforcement |
| .github/agents/ | GitHub agent instructions |
| .github/skills/ | GitHub skill instructions |
| .cursor/rules/ | Cursor local IDE rules |

## Retired roots

| Root | Status |
|---|---|
| docs/governance | RETIRED_AND_DELETED_LOCALLY |
| governance/legacy-extracted | TRANSITIONAL_REFERENCE_ONLY |

## Closure rule

No governance change is accepted without:

- clean git diff check
- TypeScript pass when code/scripts are involved
- all governance guards pass
- evidence pack under tools/registry/runs
- no active docs/governance references
- no GitHub push unless explicitly requested

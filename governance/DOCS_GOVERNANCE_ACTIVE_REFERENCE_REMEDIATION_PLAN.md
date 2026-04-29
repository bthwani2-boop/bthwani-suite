# Docs Governance Active Reference Remediation Plan

Status: CANONICAL_REMEDIATION_PLAN
Owner: BThwani Governance
SourceEvidence: `C:\bthwani-suite\tools\registry\runs\GOVERNANCE_BATCH_05_FIX_BATCH04_AND_EXPAND-20260429-231805`

## Decision

NOT_READY_ACTIVE_REFERENCES_EXIST

## Active blockers

| Path | Line | Proposed action | Sample |
|---|---:|---|---|
| `.github/agents/bthwani-platform-master-orchestrator-2026-v3-additive.agent.md` | 67 | REPOINT_OR_REMOVE_BEFORE_DELETE | 2. Current repo docs/governance/contracts. |
| `.github/agents/bthwani-surface-core-lossless.agent.md` | 146 | REPOINT_OR_REMOVE_BEFORE_DELETE | - `docs/governance/AGENT_UPDATE_VALIDATION_CHECKLIST.md` |
| `.github/agents/bthwani-surface-core-lossless.agent.md` | 147 | REPOINT_OR_REMOVE_BEFORE_DELETE | - `docs/governance/AGENT_CHANGE_LEDGER.md` |
| `.github/agents/platform-agent-os-2026-v3-additive/OS/MASTER_ORCHESTRATOR.md` | 37 | REPOINT_OR_REMOVE_BEFORE_DELETE | 2. Current repo docs/governance/contracts. |
| `.github/agents/platform-agent-os-2026-v3-additive/OS/SOURCE_PRECEDENCE.md` | 1 | REPOINT_OR_REMOVE_BEFORE_DELETE | # Source Precedence\n\nCurrent repo > current docs/governance > surfaces-legacy-trash read-only > bthfinal read-only > human. |
| `.github/skills/bthwani-unified-experience-review/SKILL.md` | 205 | REPOINT_OR_REMOVE_BEFORE_DELETE | - validation against `docs/governance/AGENT_UPDATE_VALIDATION_CHECKLIST.md` |
| `.github/skills/bthwani-unified-experience-review/SKILL.md` | 206 | REPOINT_OR_REMOVE_BEFORE_DELETE | - logging in `docs/governance/AGENT_CHANGE_LEDGER.md` |
| `.nx/workspace-data/file-map.json` | 4942 | REPOINT_OR_REMOVE_BEFORE_DELETE | "file": "docs/governance/AGENT_CHANGE_LEDGER.md", |
| `.nx/workspace-data/file-map.json` | 4946 | REPOINT_OR_REMOVE_BEFORE_DELETE | "file": "docs/governance/AGENT_UPDATE_VALIDATION_CHECKLIST.md", |
| `.nx/workspace-data/file-map.json` | 4950 | REPOINT_OR_REMOVE_BEFORE_DELETE | "file": "docs/governance/BTHWANI_GUIDE__Unified_Execution_OS__V4_Phases_Waves_Todolists.md", |
| `.nx/workspace-data/file-map.json` | 4954 | REPOINT_OR_REMOVE_BEFORE_DELETE | "file": "docs/governance/BTHWANI_MASTER_EXECUTION_PLAYBOOK__SINGLE_FILE.md", |
| `.nx/workspace-data/file-map.json` | 4958 | REPOINT_OR_REMOVE_BEFORE_DELETE | "file": "docs/governance/BTHWANI_PLATFORM_DSH_FULL_END_TO_END_ROADMAP_V2.md", |
| `.nx/workspace-data/file-map.json` | 4962 | REPOINT_OR_REMOVE_BEFORE_DELETE | "file": "docs/governance/PLATFORM_BLUEPRINT.md", |
| `.nx/workspace-data/file-map.json` | 4966 | REPOINT_OR_REMOVE_BEFORE_DELETE | "file": "docs/governance/PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md", |
| `tools/guards/guard-governance-boundaries.config.json` | 99 | REPOINT_OR_REMOVE_BEFORE_DELETE | "^docs/governance/", |
| `tools/guards/guard-governance-boundaries.config.json` | 133 | REPOINT_OR_REMOVE_BEFORE_DELETE | "^docs/governance/", |
| `tools/guards/guard-governance-boundaries.config.json` | 167 | REPOINT_OR_REMOVE_BEFORE_DELETE | "^docs/governance/", |
| `tools/guards/guard-governance-boundaries.config.json` | 201 | REPOINT_OR_REMOVE_BEFORE_DELETE | "^docs/governance/", |
| `tools/guards/guard-governance-ssot-conflict.config.json` | 10 | REPOINT_OR_REMOVE_BEFORE_DELETE | "pattern": "docs/governance", |
| `tools/scripts/CHECK_ANALYZE_GOVERNANCE_CONTROL_PLANE_DEEP.ps1` | 210 | REPOINT_OR_REMOVE_BEFORE_DELETE | Add-Finding -Severity "WARNING" -Code "TRANSITIONAL_DOCS_GOVERNANCE_EXISTS" -Message "docs/governance exists and must be treated as transitional until references are migrated." -Path "docs\governance" -Recommendation "Make governance/ the canonical control plane and migrate references evidence-first." |
| `tools/scripts/CHECK_ANALYZE_GOVERNANCE_CONTROL_PLANE_DEEP.ps1` | 373 | REPOINT_OR_REMOVE_BEFORE_DELETE | Add-Finding -Severity "WARNING" -Code "DOCS_GOVERNANCE_REFERENCES_EXIST" -Message "Some files still reference docs/governance." -Path "reference-map.csv" -Recommendation "Migrate references to governance/ only after central files are created." |
| `tools/scripts/CHECK_ANALYZE_GOVERNANCE_CONTROL_PLANE_DEEP.ps1` | 798 | REPOINT_OR_REMOVE_BEFORE_DELETE | Add-SummaryLine "- docs/governance should remain transitional until references are migrated." |
| `tools/scripts/validate-agent-governance.mjs` | 69 | REPOINT_OR_REMOVE_BEFORE_DELETE | 'docs/governance/AGENT_UPDATE_VALIDATION_CHECKLIST.md', |
| `tools/scripts/validate-agent-governance.mjs` | 70 | REPOINT_OR_REMOVE_BEFORE_DELETE | 'docs/governance/AGENT_CHANGE_LEDGER.md', |

## Execution rule

Fix active blockers before any deletion attempt. Deletion must be a separate commit with rollback evidence.

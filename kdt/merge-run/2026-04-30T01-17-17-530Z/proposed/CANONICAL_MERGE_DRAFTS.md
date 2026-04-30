# Canonical Merge Drafts — initial mapping (non-destructive)

GeneratedAt: 2026-04-30T04:35:00Z
Location: kdt/merge-run/2026-04-30T01-17-17-530Z/proposed/

Purpose
-------
This file documents the first-pass canonical merge drafts for the `governance/` corpus. All changes are draft-only and live under `proposed/` until owners sign off.

Merge rules (high level)
- Preserve source file frontmatter and metadata where present.
- When merging similar sections, prefer the most recent authoritative file (governance SSOT or master playbook) and keep a short provenance note listing sources.
- Deduplicate identical paragraphs; keep canonical phrasing and add source attributions in footnotes.
- Do not modify code samples; if a code sample includes sensitive literal values, mark for redaction (separate REVIEW step).

Initial canonical target mapping (examples)

1) `canonical/GOV_PLATFORM_OVERVIEW.md`
   - Sources:
     - governance/PLATFORM_BLUEPRINT.md
     - governance/PLATFORM_BLUEPRINT_EXECUTION_ROADMAP.md
     - governance/01_PLATFORM_SSOT.md
     - governance/GOVERNANCE_SSOT.md
   - Rationale: consolidate platform-level blueprints and SSOT guidance into one readable overview for consumers.

2) `canonical/GOV_AGENT_EXECUTION.md`
   - Sources:
     - governance/14_AGENT_EXECUTION_RULES.md
     - governance/AGENT_GOVERNANCE_POLICY.md
     - governance/AGENT_CHANGE_LEDGER.md
   - Rationale: unify agent execution rules, ledger references, and governance policies for agent authors.

3) `canonical/TAMAGUI_POLICY.md`
   - Sources:
     - governance/TAMAGUI_INTEGRATION_LAW.md
     - governance/TAMAGUI_UI_KIT_REACT_NATIVE_BRIDGE_CLASSIFICATION.json
     - governance/07_UI_KIT_AUTHORITY_CONTRACT.md
   - Rationale: centralize Tamagui boundaries and UI kit authority guidance.

4) `canonical/CODE_OF_CONDUCT_AND_CI_GATES.md`
   - Sources:
     - governance/13_CI_GATES_CONTRACT.md
     - governance/CI_GRADUAL_GATE_POLICY.md
     - governance/CI_REPORT_ONLY_READINESS_PLAN.md
   - Rationale: combine CI gate policy and execution guidance for reviewers.

Process
-------
1. Generate each canonical file under `proposed/canonical/` as a draft markdown file containing merged sections and source attributions.
2. Run internal diff/consistency checks and generate an evidence pack for each canonical draft (automated).  
3. Present drafts for owner review; accept or suggest edits.  
4. After owner approval and guard passes, create PR-ready patch that moves/copies canonical files into `governance/` and archives originals under `governance/archive/<timestamp>/`.

Next immediate step (current):
- Produce the first canonical draft file `canonical/GOV_PLATFORM_OVERVIEW.md` under `proposed/canonical/` using the listed sources (non-destructive). This will be a focused merge of the platform blueprints and SSOT docs.

-- End of drafts --

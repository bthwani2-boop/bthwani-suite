# BTHWANI AGENT NAVIGATION MAP — V7

This file is mandatory. It controls how the agent moves through the package without drift, confusion, or token waste.

## 1. Navigation principle

The agent must not open all `tools/plan` files at once.

The agent must move through the package in a fixed staged order:

```text
START
→ QUICK_START
→ MAIN_PACKAGE
→ NAVIGATION_MAP
→ OPERATOR_FIELD_MANUAL
→ TARGET_ARCHETYPE_GUIDE
→ MATRICES_TEMPLATE
→ ONE relevant playbook only
→ EXECUTION_CYCLE_RECORD
→ STOP FOR HUMAN APPROVAL
```

## 2. Mandatory read order

### Stage A — Start

Read only:

```text
BTHWANI_QUICK_START_FOR_AGENTS.md
```

Purpose:

```text
understand how to start
confirm current local branch only
confirm no commit / push / PR / merge
confirm package check evidence is required
```

Do not open other files before finishing this stage unless the quick start points to them.

### Stage B — Governing contract

Read:

```text
BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md
BTHWANI_AGENT_NAVIGATION_MAP.md
```

Purpose:

```text
understand rules, forbidden actions, 28-section output, evidence gates, final decisions
understand exact reading sequence
```

### Stage C — Operational understanding

Read:

```text
BTHWANI_OPERATOR_FIELD_MANUAL.md
BTHWANI_TARGET_ARCHETYPE_GUIDE.md
```

Purpose:

```text
understand target types
understand what to do first
avoid treating all targets the same
```

### Stage D — Required templates

Read:

```text
BTHWANI_MATRICES_TEMPLATE.md
BTHWANI_EXECUTION_CYCLE_RECORD.md
```

Purpose:

```text
know required matrices
know final cycle output shape
```

### Stage E — One playbook only

Open only the playbook required by evidence:

```text
If target involves structure/refactor/file movement:
  BTHWANI_STRUCTURE_REFACTOR_PLAYBOOK.md

If target involves performance/render/list/table/images/network:
  BTHWANI_PERFORMANCE_PLAYBOOK.md

If target involves agent drift/failure/invalid cycle:
  BTHWANI_AGENT_FAILURE_MODES.md

If target involves evidence or package recheck:
  EVIDENCE_STANDARD.md

If target involves rollback:
  ROLLBACK_PROTOCOL.md

If target involves source coverage:
  BTHWANI_SOURCE_COVERAGE_MATRIX.md
```

Do not open irrelevant playbooks.

## 3. Navigation states

The agent must declare one navigation state at the start of each cycle:

```text
NAVIGATION_STATE: STARTED
NAVIGATION_STAGE: QUICK_START / MAIN_PACKAGE / NAVIGATION_MAP / OPERATOR_MANUAL / ARCHETYPE / MATRICES / PLAYBOOK / EXECUTION / VERIFY / RE_DIAGNOSE / HUMAN_APPROVAL
NAVIGATION_DRIFT_RISK: none / low / medium / high
```

If confused:

```text
NAVIGATION_STATE: CONFUSED
NEXT_SAFE_NAVIGATION_STEP: [exact file to read next]
NO_APPLY_UNTIL_NAVIGATION_RECOVERED: yes
```

## 4. Token budget rule

The agent must not read all package files.

Allowed per cycle by default:

```text
mandatory core files: 5–6 files
playbooks: 1 relevant playbook
extra files: only with reason
```

If more files are opened:

```text
TOKEN_WASTE_RISK: yes
EXTRA_FILE_READ_REASON: [reason]
```

If files were opened randomly:

```text
NAVIGATION_DRIFT_DETECTED
CYCLE_INVALID_IF_SCOPE_CHANGED: yes
```

## 5. File opening decision table

| Need | Open this file | Do not open |
|---|---|---|
| Start agent | BTHWANI_QUICK_START_FOR_AGENTS.md | all files |
| Understand rules | BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md | playbooks first |
| Avoid drift | BTHWANI_AGENT_NAVIGATION_MAP.md | random browsing |
| Understand target type | BTHWANI_TARGET_ARCHETYPE_GUIDE.md | performance/structure playbooks yet |
| Build matrices | BTHWANI_MATRICES_TEMPLATE.md | source coverage unless needed |
| Structure/refactor | BTHWANI_STRUCTURE_REFACTOR_PLAYBOOK.md | performance playbook unless performance touched |
| Performance | BTHWANI_PERFORMANCE_PLAYBOOK.md | structure playbook unless files move |
| Failure/invalid cycle | BTHWANI_AGENT_FAILURE_MODES.md | broad repo scans |
| Evidence | EVIDENCE_STANDARD.md | rollback unless applying changes |
| Rollback | ROLLBACK_PROTOCOL.md | unrelated playbooks |
| Source traceability | BTHWANI_SOURCE_COVERAGE_MATRIX.md | all files |

## 6. Execution navigation timeline

The agent must move in this exact timeline within the package operations, AND must strictly adhere to the **Cross-Surface Closure Sequence (19 Stages)** when applying closure to the entire system.

**Package Operations Timeline:**
```text
01 Package Recheck
02 Current Branch Rule Status
03 Navigation State
04 Agents/Governance/Guards Fitness
05 Target Discovery
06 Target Type Classification
07 Linked Surface Classification
08 Benchmark or WEB_RESEARCH_UNAVAILABLE
09 Topic Matrices if file movement possible
10 Structural Hygiene
11 Gap / Boundary / Data / Runtime / Performance Matrices
12 Target Execution Map
13 Select One Task
14 Apply One Task or AUDIT_ONLY_ALLOWED_WITH_REASON
15 Verification
16 Re-Diagnosis
17 Human Approval Gate
18 Final Decision
```

**Cross-Surface Closure Sequence (The 19 Stages):**
Never skip or reorder these stages when targeting BThwani surfaces.
```text
0. Control Panel Shell / IA / Navigation Contract
1. Control Panel Global UI Grammar
2. DSH Shared Data / Media / Adapters
3. Platform / Vars / Provider Policy
4. Catalogs
5. Partners
6. Marketing
7. Operations
8. Finance / WLT Bridge
9. Support / Disputes / Escalations
10. Administration / Governance / Roles
11. Dashboard / Closure Evidence
12. app-client
13. app-partner
14. app-field
15. app-captain
16. Cross-Surface Consistency Sweep
17. API Binding Readiness Map
18. Visual Evidence Sweep
19. Cross-Surface Slices
```

Do not reorder unless a blocker requires stopping earlier.

## 7. No transition without gate

The agent may not move from one stage to the next unless the previous stage has a status:

```text
PASS
NOT_APPLICABLE_WITH_REASON
BLOCKED_WITH_REASON
AUDIT_ONLY_ALLOWED_WITH_REASON
```

Missing status means:

```text
NAVIGATION_GATE_MISSING
CYCLE_INVALID
```

## 8. Human approval stop

After verification and re-diagnosis:

```text
HUMAN_APPROVAL_REQUIRED_BEFORE_NEXT_TASK: yes
STOP_NOW: yes
```

No next task may begin in the same response.

## 9. Recovery from drift

If the agent realizes it drifted:

```text
NAVIGATION_DRIFT_DETECTED: yes
STOP_APPLYING: yes
RETURN_TO_FILE: BTHWANI_AGENT_NAVIGATION_MAP.md
REBUILD_CURRENT_STAGE: yes
HUMAN_APPROVAL_REQUIRED_BEFORE_CONTINUING: yes
```

## 10. Invalid navigation cases

These invalidate the cycle:

```text
opened all package files without reason
read playbooks before main package
started implementation before target type classification
selected Task 1 before structural hygiene
moved files before Topic Decision Matrix
started design before logic/data/flow/technical gates
continued after human approval gate
skipped re-diagnosis
ignored package check evidence
```

Decision:

```text
CYCLE_INVALID
```

## 11. Minimal command for weak agents

```text
Read only these files first, in order:
1. BTHWANI_QUICK_START_FOR_AGENTS.md
2. BTHWANI_TARGET_CLOSURE_EXECUTION_PACKAGE.md
3. BTHWANI_AGENT_NAVIGATION_MAP.md
4. BTHWANI_OPERATOR_FIELD_MANUAL.md
5. BTHWANI_TARGET_ARCHETYPE_GUIDE.md
6. BTHWANI_MATRICES_TEMPLATE.md

Then classify TARGET.
Then open only one relevant playbook.
Then run one closed cycle.
Then stop for human approval.
```

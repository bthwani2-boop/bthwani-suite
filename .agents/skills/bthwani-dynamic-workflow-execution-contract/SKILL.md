---
name: bthwani-dynamic-workflow-execution-contract
description: Use a dynamic workflow to classify tasks, select the right skill/tool, compare alternatives, verify decisions adversarially, and produce evidence-grounded execution without broad or random changes.
version: 2026.06.11-v1
---

# bthwani-dynamic-workflow-execution-contract

## Purpose

Use this skill to control how any BThwani execution task is analyzed, routed, executed, and verified.

This skill ensures that work is not handled as a single rigid path. Every task must be classified, routed to the right skill or tool, reviewed from the relevant operational viewpoints, verified against failure scenarios, and closed only with evidence.

اعمل بـ Dynamic Workflow: صنّف المشكلة، اختر الأداة أو المهارة، ولّد بدائل عند الحاجة، صفِّها بالحراس، قارنها، راجعها بمنظورات العميل والمنافس والميداني والكابتن والشريك والمشغل حسب صلة المهمة، ثم نفّذ تحققًا عكسيًا يحاول كسر القرار قبل التطبيق.

## Trigger contexts

Use this skill when the task involves any of the following:

1. Broad implementation or cleanup.
2. Multi-surface changes.
3. Design, logic, organization, security, performance, or integration risk.
4. Any task that could affect runtime behavior, UI, API contracts, data flow, WLT boundaries, or repository structure.
5. Any instruction asking for stronger accuracy, fewer gaps, fewer contradictions, or final execution quality.

## Non-trigger contexts

Do not use this skill when:

1. The user only asks for a short answer or explanation.
2. The task is pure text editing with no project execution.
3. The task has already been narrowed to a single safe command with no analysis needed.

## Required workflow

For every applicable task, follow this sequence:

1. Classify the task:
   - design
   - logic
   - API/OpenAPI
   - runtime
   - data/media
   - WLT finance boundary
   - organization/duplication
   - performance
   - security
   - evidence/verification

2. Select the right skill or tool:
   - design → `bthwani-design-guard-tooling-contract`
   - logic/API/runtime → `bthwani-logic-graph-guard-tooling-contract`
   - organization/duplication/performance/security hygiene → `bthwani-structure-organization-guard-tooling-contract`
   - repository relationships/context reduction → `bthwani-graphify-query-first`

3. Generate alternatives when more than one valid solution exists.

4. Filter alternatives through the relevant guards and constraints:
   - umbrella
   - on-demand retrieval
   - WLT finance ownership
   - `@bthwani/ui-kit` design authority
   - runtime safety
   - OpenAPI/API consistency
   - evidence requirements

5. Compare alternatives and choose the least risky, most maintainable, evidence-supported option.

6. Review from relevant viewpoints:
   - customer
   - competitor
   - field team
   - captain
   - partner
   - operator

7. Run adversarial verification:
   - What could break?
   - What import, route, API binding, runtime behavior, visual state, permission, data flow, or WLT boundary could be affected?
   - Is there hidden duplication, dead code, or unsupported fallback?
   - Is there a security or evidence leak?
   - Is the decision based on proof or assumption?

8. Execute only the minimum scoped change needed.

9. Verify with the smallest sufficient evidence set.

10. Return one clear decision:
   - PASS
   - PASS_WITH_WARNINGS
   - FIX_REQUIRED
   - BLOCKED
   - NEEDS_EVIDENCE

## Rules

- Do not perform broad changes when a scoped change is enough.
- Do not run every tool by default.
- Do not treat tool output as final truth without interpretation.
- Do not delete, move, merge, or rename files without dependency and runtime impact checks.
- Do not claim readiness, closure, safety, finality, or 100% without evidence.
- Do not allow design changes to bypass `@bthwani/ui-kit`.
- Do not allow WLT financial ownership to leak into DSH.
- Do not allow runtime code to depend on local analysis or evidence outputs.
- Prefer evidence-driven decisions over assumptions.

## Output contract

```text
skill: bthwani-dynamic-workflow-execution-contract
task_scope:
classification:
selected_skills:
selected_tools:
alternatives_considered:
filters_applied:
viewpoints_reviewed:
adversarial_verification:
decision:
evidence_required:
next_action:
```

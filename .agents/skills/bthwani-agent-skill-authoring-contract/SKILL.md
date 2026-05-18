---
name: bthwani-agent-skill-authoring-contract
description: Create or update BThwani skills with trigger clarity, minimal context burden, eval prompts, source attribution, and registry validation.
version: 2026.05.17-v1
---

# bthwani-agent-skill-authoring-contract

## Purpose

Make every skill precise, general, executable, and testable.

## Steps

1. Define capability, trigger contexts, non-trigger contexts, inputs, steps, forbidden actions, and output contract.
2. Keep `SKILL.md` concise; move large project truth to `governance/`.
3. Include 3 trigger examples and 3 non-trigger examples in design notes when creating a new skill.
4. Validate frontmatter: `name`, `description`, `version`.
5. Avoid duplicated skills and vague descriptions.
6. Run registry validator before acceptance.

## Universal BThwani constraints

- Active local repo: `C:\bthwani-suite`.
- GitHub is read-only unless the user explicitly requests write actions.
- Use PowerShell for local commands.
- Use `pnpm`, `pnpm exec`, `pnpm dlx`, or `pnpm nx`; use the safest documented launcher; npx is allowed when documented or safest and justified in evidence.
- Read `pnpm-workspace.yaml` before choosing active roots.
- `.agents` is operational guidance; `governance/` is project truth and service/application specialization.
- Do not create mirrors, bridges, long copied donor docs, or duplicate skills.
- Do not modify dependencies, lockfiles, CI, secrets, native config, backend/runtime/API, or generated files unless explicitly in scope.
- No `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` claim without Git diff, verification output, and evidence.
- Unknowns must be `TBD`, `UNPROVEN`, or `BLOCKED`.

## Output contract

```text
skill:
scope:
governance_sources:
evidence_used:
findings:
risks:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```

<!-- BTHWANI_EXTERNAL_CONTEXT_ENGINEERING_ADAPTATION_START -->
## External adaptation: context engineering

Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
Mode: adapted-not-mirrored.

Use this adaptation to keep skills, prompts, and execution packages minimal, high-signal, scoped, and evidence-driven.

Additional context duties:

- Treat context as finite and expensive.
- Use the smallest sufficient set of high-signal instructions.
- Prefer paths, owners, retrieval instructions, and exact contracts over copying long donor text.
- Remove duplicate, stale, contradictory, or low-signal instructions.
- Keep tool/skill routing unambiguous; if two skills overlap, choose the existing canonical owner with the narrowest correct scope.
- Keep examples few and canonical.
- Use sections such as Task, Scope, Allowed, Forbidden, Verification, Evidence, and Decision.
- Mark unknowns as TBD, UNPROVEN, BLOCKED, NEEDS_EVIDENCE, or NEEDS_VISUAL_EVIDENCE.
- Never claim PASS, CLOSED, READY, FINAL, SAFE, or 100% without evidence.

Packaging rule:

- Do not put Markdown links inside YAML frontmatter.
- Do not use nested code fences inside generated PowerShell scripts.
- Do not copy ChatGPT-style citation artifacts (e.g., source-reference tags injected by other AI systems).
- Prefer deterministic scripts over broad prompts when exact file generation is safer.
<!-- BTHWANI_EXTERNAL_CONTEXT_ENGINEERING_ADAPTATION_END -->

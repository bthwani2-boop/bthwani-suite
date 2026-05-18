---
name: bthwani-stop-slop-prose-contract
description: Remove AI-sounding prose, vague claims, filler, overstatement, generic phrasing, noisy reports, and weak Arabic or English copy from prompts, reports, UI copy, governance text, and marketing text.
version: 2026.05.18-v1
source: https://github.com/hardikpandya/stop-slop
source_mode: adapted-not-mirrored
---

# bthwani-stop-slop-prose-contract

## Purpose

Make BThwani writing direct, specific, evidence-aware, and low-noise.

Use this skill as a final prose-quality pass after the task-specific skill has determined the correct logic, owner, scope, and evidence requirements.

## Trigger when

- Writing or editing Copilot, Codex, Claude, Gemini, Cursor, or OpenCode prompts.
- Writing UI copy, Arabic labels, reports, PR summaries, evidence summaries, onboarding text, notifications, marketing copy, or governance text.
- The text is padded, dramatic, generic, falsely certain, repetitive, or unclear.
- The user asks for a stronger, more precise, less noisy command.

## Do not trigger when

- The user asks for a deliberately poetic, playful, or highly branded creative style.
- Exact legal, contractual, or quoted wording must be preserved.
- A short terminal command is enough and prose rewriting adds no value.

## Mandatory pre-execution reading

يجب قبل التنفيذ الاطلاع على ملفات الوكلاء والـ skills ذات العلاقة وتطبيق ما يخص المهمة منها بدقة، وعدم الاعتماد على الذاكرة أو الافتراض.

Read the relevant task skill first, then apply this skill as the final writing pass.

## Remove

- throat-clearing openers
- vague declarations
- false certainty
- business jargon with no operational meaning
- filler transitions
- repeated strong, complete, or 100% claims without evidence
- dramatic binary framing
- passive voice when active voice is clearer
- redundant adjectives
- generic AI phrasing
- long final reports when a short decision is enough
- unsupported claims of closure

## Keep

- direct commands
- exact paths
- exact owner and scope
- measurable acceptance criteria
- TBD, UNPROVEN, BLOCKED, NEEDS_EVIDENCE, NEEDS_VISUAL_EVIDENCE
- concise Arabic suitable for execution
- strict RTL wording when UI is involved
- evidence-first status language
- rollback and verification requirements when risk exists

## BThwani writing rules

- Do not claim PASS, CLOSED, READY, FINAL, SAFE, or 100% without evidence.
- Do not hide uncertainty.
- Do not add emotional filler.
- Do not over-explain when the user needs an execution command.
- Use concise closure language.
- For UI prompts, include concrete RTL and design-system contracts, not vague beauty wording.
- For multi-surface tasks, require a cross-surface impact map instead of mono-app wording.

## Output contract

```text
skill:
text_type:
removed_noise:
clarified_claims:
remaining_tbd:
final_text:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
```

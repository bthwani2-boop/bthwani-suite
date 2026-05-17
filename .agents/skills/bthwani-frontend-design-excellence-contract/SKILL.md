---
name: bthwani-frontend-design-excellence-contract
description: Enforce premium, modern, mobile-first, web-ready, RTL-correct, accessible, low-noise frontend design quality across all BThwani visible surfaces. Use for any UI/UX, frontend design, screen polish, visual hierarchy, mobile/web responsiveness, interaction state, empty/loading/error/success, dashboard, control-panel, webapp, website, or mobile app visual task.
version: 2026.05.17-v1
---

# bthwani-frontend-design-excellence-contract

## Purpose

Make every visible BThwani frontend experience premium, clear, practical, modern, RTL-correct, mobile-first, web-ready, accessible, low-noise, and strongly aligned with BThwani product quality.

This skill does not replace `bthwani-ui-kit-surface-contract`. Use both together:
- `bthwani-ui-kit-surface-contract` decides ownership, UI-kit boundaries, reusable design centralization, central color system, Tamagui boundary, and no local design systems.
- `bthwani-frontend-design-excellence-contract` decides whether the user-facing design itself is excellent, polished, usable, coherent, and visually worthy.

## Mandatory BThwani clauses

- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- Any reusable/repeatable frontend pattern must be centralized in the approved design system / `@bthwani/ui-kit`.
- Do not create new UI-kit files unless the need is non-negotiable, proven by evidence, and human-approved.
- Do not use this skill to hardcode random colors, local design systems, one-off visual hacks, or decorative noise.
- Service/application/surface-specific design truth belongs in `governance/`; this skill is a general execution and review contract.
- Visible UI changes require visual evidence. If screenshots, screen recordings, or visual inspection are missing, the decision must be `NEEDS_VISUAL_EVIDENCE`.

## Required design-quality checks

1. Intent and user job
   - Identify the screen purpose, primary user action, secondary actions, and expected outcome.
   - Remove unrelated content, duplicate choices, weak copy, and decision noise.

2. Information architecture
   - Confirm the page/screen structure is easy to scan.
   - Ensure one clear primary action and predictable navigation.
   - Use progressive disclosure for dense control-panel or operations screens.

3. Visual hierarchy
   - Confirm title, subtitle, primary action, important metrics, state, and next step are visually ordered.
   - Avoid equal-weight cards, random emphasis, noisy borders, and scattered visual accents.

4. Layout rhythm and spacing
   - Verify consistent spacing scale, section grouping, card rhythm, safe areas, and alignment.
   - Avoid cramped UI, floating elements, oversized gaps, clipping, overflow, and unbounded scroll.

5. Mobile-first and responsive web behavior
   - Mobile screens must prioritize thumb reach, safe area, hardware back behavior, and short vertical journeys.
   - Web/control-panel screens must use practical density, clear panes/tabs/drawers, and avoid long unstructured pages.
   - Tablet/desktop should not be a stretched mobile layout unless intentionally justified.

6. RTL and Arabic composition
   - Arabic/RTL UI must be directionally correct.
   - Icon + text cluster belongs together on the right side.
   - Chevrons/actions belong opposite the content cluster.
   - Text must align right unless a deliberate exception is justified.
   - No centered Arabic list-row text unless intentionally designed and visually proven.

7. Interaction states
   - Verify default, pressed, focused, disabled, selected, expanded, collapsed, loading, empty, error, success, offline, and permission-denied states where relevant.
   - Do not accept a component that only looks good in the happy path.

8. Accessibility and touch quality
   - Verify sufficient contrast, semantic labels, readable size, focus visibility, screen-reader names, touch target size, and keyboard/focus behavior where applicable.
   - Accessibility is a design-quality gate, not a later optional cleanup.

9. Motion and feedback
   - Motion must clarify hierarchy, continuity, and state change.
   - Avoid decorative motion, jank, excessive transitions, and feedback that delays task completion.

10. Visual identity and premium polish
   - Use BThwani central color tokens and approved semantic/tint/shade values.
   - Preserve deepBlue/orange/white identity through the central color system, not raw hardcoded-only restrictions.
   - A premium interface must feel calm, confident, cohesive, practical, and low-noise.

11. Evidence
   - For visible changes, require before/after screenshots or equivalent visual proof.
   - If visual evidence is unavailable, return `NEEDS_VISUAL_EVIDENCE`.
   - Do not claim `premium`, `modern`, `final`, `closed`, or `100%` based only on TypeScript or static diff.

## Required execution steps

1. Read `AGENTS.md`, `.agents/INDEX.md`, `.agents/SKILL_CATALOG.md`, and this skill.
2. Read `bthwani-ui-kit-surface-contract` for ownership/design-system boundaries.
3. Read the relevant `governance/` domain, service, or surface source.
4. Classify scope:
   - visual-only
   - visual plus interaction states
   - visual plus route/navigation
   - visual plus data/API binding
   - design-system centralization
5. Identify existing UI-kit exports before proposing any local UI.
6. Define acceptance criteria before editing.
7. Apply minimal targeted changes.
8. Verify with code gates and visual evidence.

## Must not

- Do not restore generic old `frontend-design`, `sleek-design-mobile-apps`, `building-native-ui`, `accessibility`, or `seo` skills as active skills.
- Do not copy long external design docs into `.agents`.
- Do not create duplicate skills for one service, app, or screen.
- Do not move service-specific design requirements into this skill; put them in `governance/`.
- Do not claim `PASS`, `CLOSED`, `FINAL`, `READY`, or `100%` without Git diff, verification output, and visual evidence for visible changes.

## Output contract

```text
skill:
scope:
governance_sources:
ui_kit_sources:
design_intent:
visual_hierarchy_findings:
rtl_findings:
state_coverage:
accessibility_findings:
visual_evidence:
risks:
decision: PASS / PASS_WITH_WARNINGS / FIX_REQUIRED / BLOCKED / NEEDS_EVIDENCE / NEEDS_VISUAL_EVIDENCE
next_action:
```

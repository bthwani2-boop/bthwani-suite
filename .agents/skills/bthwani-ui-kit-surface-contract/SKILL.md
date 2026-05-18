---
name: bthwani-ui-kit-surface-contract
description: Enforce BThwani UI-kit ownership, central color system, RTL correctness, reusable design centralization, and no visual drift. Use for any UI, UX, screen, surface, app, dashboard, mobile, web, or ui-kit task.
version: 2026.05.17-v1
---

# bthwani-ui-kit-surface-contract

## Purpose

Keep UI work anchored to `@bthwani/ui-kit` and BThwani design governance.

## Mandatory BThwani clauses

- توجب الالتزام بنظام الألوان المركزي.
- تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.
- Any reusable/repeatable design must be centralized in approved design system / `@bthwani/ui-kit`.
- Do not create new UI-kit files unless the need is non-negotiable, proven by evidence, and human-approved.
- Respect existing UI-kit files and reuse public exports first.
- Screen / Surface / App -> `@bthwani/ui-kit` public exports -> Tamagui internally inside ui-kit only.
- Raw Tamagui imports outside `ui-kit` are not accepted.
- Arabic/RTL UI must be directionally correct: icon+text same right-side cluster, text right-aligned, action/chevron opposite, safe spacing, no clipping.

## Steps

1. Confirm owner path.
2. Confirm UI-kit dependency path.
3. Verify color token usage and no random hardcoded palettes.
4. Verify RTL/LTR and accessibility contract.
5. Require visual evidence for visible changes.

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

<!-- BTHWANI_EXTERNAL_UI_UX_PRO_MAX_ADAPTATION_START -->
## External adaptation: UI/UX design intelligence

Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
Mode: adapted-not-mirrored.

Use this adaptation only as visual reasoning support. It must not override BThwani design authority.

Additional UI/UX reasoning duties:

- Perform deep visual dissection before UI implementation.
- Identify screen purpose, hierarchy, primary CTA, interaction cost, tab pressure, sheet/modal behavior, scroll boundaries, and visual density.
- Check RTL at the concrete row level: icon and text in one right-side cluster, right-aligned Arabic copy, action or chevron on the opposite side, safe spacing, and no clipping.
- Check whether repeated UI belongs in existing `@bthwani/ui-kit` exports before local implementation.
- Check cross-surface impact when the same logic appears in app-client, app-partner, app-captain, app-field, control-panel, WLT/finance, DSH/operations, website, or webapp.
- Preserve the BThwani visual identity: premium, cohesive, low-noise, modern 2026, practical, fast, and clear.

Forbidden:

- no donor palette import
- no generic design-system copy
- no local design system
- no new UI-kit file unless the need is proven, non-negotiable, and explicitly human-approved
- no Tamagui import outside the approved UI-kit boundary unless repo evidence proves the exact layer allows it
- no visual PASS without screenshot evidence when visible UI changed
<!-- BTHWANI_EXTERNAL_UI_UX_PRO_MAX_ADAPTATION_END -->

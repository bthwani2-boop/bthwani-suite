# CONTROL PANEL Visual Forensic Report (2026-03-29)

Design Direction: AI-Native Premium Command Center

## 1. Forensic Findings

1. Layout collapse and visual fragmentation were caused by an infrastructure mismatch, not only component styling.
2. CONTROL PANEL PostCSS pipeline did not run Tailwind utility generation, while screen code relied heavily on utility classes.
3. Shell geometry used compact legacy dimensions that amplified crowding and made the sidebar visually dominant.
4. Overview content had weak section framing, so action hierarchy was readable functionally but not premium visually.

## 2. Root Cause Matrix

| ID    | Symptom                                          | Root Cause                                                   | Impact |
| ----- | ------------------------------------------------ | ------------------------------------------------------------ | ------ |
| VF-01 | Huge dead space + compressed content composition | Tailwind utilities not compiled in CONTROL PANEL app build pipeline   | Severe |
| VF-02 | Header/sidebar felt legacy and noisy             | 52px topbar + narrow sidebar + hard separators               | Medium |
| VF-03 | Overview lacked command-center feel              | Section blocks missing premium framing and ambient hierarchy | Medium |

## 3. Executed Fixes

### Infrastructure

- Enabled Tailwind PostCSS plugin in CONTROL PANEL app pipeline.
- File: apps/web/control panel/postcss.config.js

### Shell

- Upgraded shell geometry to a premium command-surface layout.
- Header height: 64px, sidebar widths: 272px expanded / 72px collapsed.
- Added bounded content frame with max width 1560px and responsive inline padding.
- File: apps/web/control panel/src/shell/McpwShell.tsx

### Navigation

- Refined topbar controls to lower-noise, higher-clarity action tokens.
- Refined sidebar spacing/radii and interaction density while preserving progressive disclosure.
- Files:
  - packages/ui-kit/src/components/navigation/TopNavigationBar.tsx
  - packages/ui-kit/src/components/navigation/SideNavigation.tsx

### Overview Surface

- Added premium section framing and ambient visual hierarchy.
- Reinforced the one-primary-CTA contract and command-center composition.
- Localized heading from "Focus Strip" to Arabic-facing "شريط التركيز".
- File: packages/surfaces/src/web/control panel/home/McpwHomeScreenV2.tsx

## 4. Measurable Proof Anchors

- Flow/State/Component matrix: packages/surfaces/src/web/control panel/blueprints/FLOW_STATE_COMPONENT_MATRIX.json
- Click budget baseline vs target: packages/surfaces/src/web/control panel/blueprints/CLICK_BUDGET_BEFORE_AFTER.json
- Design contract: packages/surfaces/src/web/control panel/blueprints/AI_NATIVE_PREMIUM_COMMAND_CENTER_BLUEPRINT.md

## 5. UX Contract Verification

1. Primary operational action remains 1 click from overview.
2. Secondary paths remain <= 2 clicks via progressive disclosure.
3. Sidebar remains single-expand to reduce cognitive noise.
4. Reusable component contract preserved: KPI card, action row, workspace launch card.

## 6. Residual Risk

- Full monorepo has unrelated historical errors outside the CONTROL PANEL overview/shell scope.
- This execution validates the critical visual/runtime path only (CONTROL PANEL shell + overview + navigation).


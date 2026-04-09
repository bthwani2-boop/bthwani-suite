# UI Kit Proof Manifest

## Authority

- blueprint: packages/ui-kit/docs/BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md
- execution plan: packages/ui-kit/docs/BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md
- ownership: packages/ui-kit/docs/OWNERSHIP_AND_RULES.md

## Hosted Preview

- app: website
- route: /ui-kit

## Token Source

- authority package: @bthwani/ui-kit
- authority file: src/foundation/tokens/source.ts
- format: bth-token-source.v1
- version: 2026.04.09
- stage: phase-b-bootstrap

## Theme Modes

- light
- dark
- high-contrast

## Lab Theme Modes

- light
- dark
- high-contrast

## Component Lab Sections

### Token and Theme Outputs

Validates the current mode, direction, and output-backed theme surface contract.

- token outputs
- theme outputs
- web css variables
- native theme snapshot

### Actions and Fields

Covers the primary action hierarchy and input baseline.

- BthButton
- BthTextField
- BthSearchField
- BthSelectField

### Selector Families

Covers the shared selection grammar and directional behavior.

- BthChip
- BthCheckbox
- BthRadio
- BthSwitch
- BthSegmentedControl

### Navigation Families

Covers shared movement across sections, routes, and review surfaces.

- BthScreenHeader
- BthSectionHeader
- BthTabs

### Overlay Families

Covers shared confirmation and transient feedback surfaces.

- BthSheetFrame
- BthDialog
- BthToast

### Data Display Families

Covers reusable cards, summaries, lists, and structured tables.

- BthCard
- BthStatCard
- BthListItem
- BthKeyValueList
- BthDataTable

### State Families

Delegates to the shared state gallery for complete state-system review.

- BthStateView
- BthEmptyState
- BthStateGallery

## State Gallery

- languages: ar, en
- state ids: loading, empty, noResults, success, warning, recoverableError, blockingError, offline, unauthorized, notFound

## Generated Artifacts

- packages/ui-kit/docs/generated/token-output.css
- packages/ui-kit/docs/generated/theme-output.css
- packages/ui-kit/docs/generated/native-tokens.json
- packages/ui-kit/docs/generated/native-themes.json
- packages/ui-kit/docs/generated/proof-manifest.json
- packages/ui-kit/docs/generated/proof-manifest.md
- packages/ui-kit/docs/generated/component-lab.md
- packages/ui-kit/docs/generated/state-gallery.md
- packages/ui-kit/docs/generated/accessibility-report.json
- packages/ui-kit/docs/generated/accessibility-report.md
- packages/ui-kit/docs/generated/visual-regression/ui-kit-preview-light.png
- packages/ui-kit/docs/generated/visual-regression/ui-kit-preview-dark.png
- packages/ui-kit/docs/generated/visual-regression/ui-kit-preview-high-contrast.png
- packages/ui-kit/docs/generated/playwright-report/index.html

## Verification Targets

- ui-kit:typecheck
- ui-kit:build-outputs
- ui-kit:proof-visual
- ui-kit:proof

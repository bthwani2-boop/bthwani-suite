# Control Panel UI Grammar Checklist

> **Owner**: control-panel/shell
> **Guard**: `tools/guards/guard-control-panel-grammar.mjs`
> **Grammar source**: `control-panel/shell/ui-grammar-contract.ts`
> **Shared styles**: `dsh/frontend/control-panel/shared/control-panel-surface.module.css`

---

## Gate 1 — No showHero in operational sections

| Rule | File check |
|------|-----------|
| `showHero=true` forbidden in `dsh/frontend/control-panel/**` except shell allowlist | Guard auto-checks |
| Hero-like headers (large title block + KPI strip) are ONLY allowed in `overview` or `landing` tabs | Review per section |

**Status per section:**
- dashboard: ✅ compact header, no hero
- operations: ✅ compact header, no hero
- finance: ✅ compact header, no hero
- support: ✅ compact header, no hero
- partners: ✅ compact header, no hero
- catalogs: ✅ compact header, no hero
- marketing: ✅ compact header, no hero
- platform: ✅ compact header + demo warning banner (intentional)
- administration: ✅ compact header, no hero
- hr: ✅ compact header, no hero

---

## Gate 2 — No direct Tamagui import outside ui-kit

| Rule | Guard |
|------|-------|
| `from 'tamagui'` or `from '@tamagui/*'` forbidden outside `ui-kit/` | Guard auto-checks |

---

## Gate 3 — States coverage (loading / empty / error / blocked / success)

Each workbench that shows dynamic data **must** declare at least one non-ready state.

| Section | loading | empty | blocked | error | needs_backend |
|---------|---------|-------|---------|-------|---------------|
| dashboard | ✅ | ✅ | ✅ | — | — |
| operations | ✅ StateView | ✅ | ✅ resolveOperationsStateCopy | — | phase 5+ |
| finance | ✅ StateView | ✅ | — | — | phase 5+ |
| support | ✅ | ✅ (queue + inspector) | — | — | phase 5+ |
| partners | — | ✅ (inbox empty + N/A tabs) | — | — | phase 5+ |
| catalogs | — | ✅ (mapped N/A) | blocked Surface | — | phase 5+ |
| marketing | — | ✅ (no signals shown clearly) | ✅ governance note | — | phase 5+ |
| platform | ✅ demo warning | ✅ | ✅ preview-only banner | — | phase 5+ |
| administration | — | ✅ per tab | — | — | phase 5+ |
| hr | ✅ blocked Surface (reason + next action) | — | ✅ | — | **NEEDS_BACKEND** |

**Rule**: blocked state MUST state the reason and next action. Do not use a spinner with no end state.

---

## Gate 4 — Table/list toolbar grammar

| Rule | Enforcement |
|------|-------------|
| Max 5 visible actions per toolbar | Review manually per section |
| Bulk actions only appear when selection exists | Review per section |
| Filters/sort/search must produce a visible result | Review per section |
| refresh/action must leave a visible trace | Functional handler required |

**Status:**
- operations list (live-orders, dispatch): ✅ lane tabs + sub-filters + row actions
- support queue: ✅ primary + secondary tabs + decision rows
- partners inbox: ✅ lane tabs + sub-tabs + approve/reject/fix/activate
- marketing ticker: ✅ pause-all + add + publish + select (max 4 actions)
- finance hub: ✅ workspace tabs + subgroups

**No table with >5 visible actions detected.**

---

## Gate 5 — Micro actions grammar

| Rule | Enforcement |
|------|-------------|
| Every action has: handler OR disabled + reason | Per row |
| No icon-only action without aria-label | Per component |
| Detail view inside section uses split pane or inline state (no new route) | Per section |
| No duplicate actions for same result | Per section |

**Status:**
- Partners approval rows: ✅ handler + disabled conditions via `isAwaitingActivation` / `isAwaitingReview`
- Support rows: ✅ primary/secondary with `setSelectedId` handlers
- Operations rows: ✅ via `resolveOperationsStateCopy`
- HR buttons: ✅ all `disabled` with `disabled={true}` (no backend)

---

## Gate 6 — Drawer/split pane contract

| Pattern | Required |
|---------|----------|
| Details in same section → split pane or inline inspector | ✅ operations, support, partners |
| No route change for within-section detail | ✅ checked |
| Inspector panel shows empty/no-selection state | ✅ support inspector |

---

## Gate 7 — Density / card scale

| Section type | Required density |
|-------------|-----------------|
| Operational workbench (operations, support, dispatch) | `compact` |
| Settings / forms (administration, hr, platform vars) | `standard` |
| Overview / landing | `spacious` |

**Status**: All sections use shared CSS classes from `control-panel-surface.module.css` which encode the correct density per usage context.

---

## Gate 8 — Local design duplication

**Known large local CSS modules (tracked by guard):**
1. `dsh/frontend/control-panel/marketing/control-panel-marketing.module.css` — 69 selectors (WARN)
   - Reason: marketing screen is a specialist workbench with ticker/editor/preview that has no equivalent in shared primitives.
   - Duplicate risk: `.actionButton`, `.surfaceCard`, `.statusChip` — partially duplicates shared patterns.
   - Deferred: full migration requires ui-kit Button/Surface/Badge primitives mapping review. Not in scope without human approval.
2. `dsh/frontend/control-panel/platform/Vars/dsh-platform-vars.module.css` — 35 selectors (WARN)
   - Reason: specialist split-pane vars browser layout. Uses central tokens throughout. Acceptable specialist CSS.

**Rule**: Do NOT create new local CSS modules that re-implement: header, tabs, statusChip, actionButton, surfaceCard — these must reference shared primitives.

---

## Gate 9 — No command-center CSS override outside shell owner

| Rule | Guard |
|------|-------|
| `.ui-web-command-center` / `.ui-web-command-strip` only in `ui-kit/` or `control-panel/shell/` | Guard auto-checks |

---

## Grammar Contract Reference Requirement

Every hub screen file in `dsh/frontend/control-panel/*` MUST include one of:
- `import ... from '...ui-grammar-contract'`
- `import styles from '../shared/control-panel-surface.module.css'`
- A comment: `// Grammar contract reference — required by control-panel grammar guard.`

Guard checks: `ui-grammar-contract|control-panel-surface\.module\.css` pattern in hub files.

---

## Running the Guard

```bash
node tools/guards/guard-control-panel-grammar.mjs
```

Expected output: `CONTROL_PANEL_GRAMMAR_GUARD: PASS` with at most the two known WARN entries.
Any ERROR exits with code 1 and blocks merge.

---

## Regression Prevention

To prevent future regressions:
1. Run guard in CI (add to `pnpm run guard:control-panel-grammar` — deferred if package.json change needed).
2. Before any new control-panel section: copy from `ControlPanelDshWorkspaceFrame` pattern.
3. Before any new local CSS module: check if `control-panel-surface.module.css` already covers the need.
4. All blocked states must include: Arabic reason text + next action label.

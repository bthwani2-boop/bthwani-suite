/**
 * @file ui-grammar-contract.ts
 * @owner control-panel/shell
 * @description Central UI Grammar Contract for all BThwani Control Panel Sections.
 * All sections (operations, finance, catalogs, partners, marketing, platform, administration, hr, etc.)
 * must abide by these rules to prevent visual fragmentation and duplicated local designs.
 */

export const ControlPanelUiGrammar = {
  /**
   * Screen Density:
   * - compact: Default for operational workbenches (e.g. Orders, Finance lists)
   * - standard: Standard forms and administration settings
   * - spacious: For landing pages, overviews, or high-level hubs
   */
  density: ['compact', 'standard', 'spacious'] as const,

  /**
   * Card Scale:
   * - signal: Brief KPIs/status chips. No large empty cards without function.
   * - workbench: Table/list/grid owner.
   * - detail: Focused form/detail.
   * - audit: Status strips, logs, metadata.
   */
  cardScale: ['signal', 'workbench', 'detail', 'audit'] as const,

  /**
   * Hero Policy:
   * - Forbidden by default in operational sections.
   * - Used only for landing/overview pages securely anchored in DSH/Shell.
   */
  heroPolicy: 'hero_forbidden_in_operational_sections' as const,

  /**
   * Header Grammar:
   * - Brief `title` + `subtitle` + primary contextual `action` only if a handler exists.
   */
  headerRequirement: 'title_subtitle_primary_action_only' as const,

  /**
   * Workbench Grammar:
   * - Search/Filter/Sort/Pagination must have explicit state/result linked.
   * - No fake UI controls that don't do anything.
   */
  workbenchRules: {
    requiresStateAndResult: true,
  },

  /**
   * Table Toolbar Grammar:
   * - Maximum of 5 global actions. The rest go to overflow menus.
   * - Batch mode selection disables row inline actions.
   */
  tableToolbarMaxActions: 5,

  /**
   * Micro Actions Grammar:
   * - Inline actions must have a clear handler/target/result.
   * - If an action cannot be performed, it must be visually disabled with a clear `blocked reason`.
   */
  microActionsRules: {
    requireHandlerOrDisabledReason: true,
  },

  /**
   * Detail / Drawer Grammar:
   * - Details and light editing belong in a Drawer or Split Pane.
   * - DO NOT create a new route for a detail view inside the same section unless proven necessary.
   */
  detailViewPreference: 'drawer_or_split_pane' as const,

  /**
   * Status Strip Grammar:
   * - Audit info, status, last updated, source, and blocked reasons belong in a status strip
   *   anchored to the bottom or top of the workbench.
   */
  statusStripLocation: ['top', 'bottom'] as const,

  /**
   * State Grammar:
   * - Workbenches and flows must handle these states.
   */
  supportedStates: ['loading', 'empty', 'error', 'blocked', 'disabled', 'success'] as const,

  /**
   * Direction & Language Grammar:
   * - RTL Arabic default for UI.
   * - LTR for SKUs, GTINs, barcodes, and technical codes when needed.
   */
  direction: {
    default: 'rtl',
    technicalData: 'ltr',
  } as const,

  /**
   * Color Grammar:
   * - Central Color System only. No local random colors.
   */
  colorSystem: 'central_ui_kit_only' as const,

  /**
   * Search / Command CommandCenter Grammar:
   * - Must perform immediate smart local search.
   * - Must support sections, services, and action handlers.
   * - Keyboard control mapping: Down/Up to navigate, Enter to select, Escape to close.
   */
  searchGrammar: {
    requiresLocalIndex: true,
    requiresPrioritySorting: true,
    supportedTriggerKeys: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'] as const,
    localSearchRules: {
      type: 'local_command_search',
      queryResults: 'summary_only',
      onSelect: 'opens_details_or_navigates',
      noBackendClaim: true,
    },
  },
} as const;

export type ControlPanelScreenDensity = typeof ControlPanelUiGrammar.density[number];
export type ControlPanelCardScale = typeof ControlPanelUiGrammar.cardScale[number];
export type ControlPanelState = typeof ControlPanelUiGrammar.supportedStates[number];

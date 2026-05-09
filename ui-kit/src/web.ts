// ─── Website Lane ──────────────────────────────────────────────────────────────
// Use for: landing pages, marketing, public-facing pages.
export {
	WebMissionHeroCard,
	WebPageFrame,
	WebSectionCard,
	WebSignalCard,
} from './web/page-frame';
export {
	WebDocumentShell,
	WebRootBody,
	WebRootLayout,
	WebThemeStyle,
	buildWebRootMetadata,
} from './web/root-layout';

// ─── Control Panel Lane ────────────────────────────────────────────────────────
// Use for: staff operations, admin dashboards, control rooms only.
export {
	WebCommandCenterFrame,
	WebCommandStrip,
	WebRailServiceList,
	WebSegmentedTabs,
	// ControlPanel primitives
	WebControlPanelFrame,
	WebControlPanelKpiStrip,
	WebControlPanelWorkspaceTabs,
	WebControlPanelSubTabs,
	WebControlPanelDecisionRow,
	WebControlPanelRecommendation,
	WebControlPanelActionCluster,
	WebControlPanelInspectorShell,
	WebControlPanelStatusTag,
} from './web/index';
export type {
	WebControlPanelFrameProps,
	WebControlPanelKpiItem,
	WebControlPanelKpiStripProps,
	WebControlPanelKpiTone,
	WebControlPanelWorkspaceTabItem,
	WebControlPanelWorkspaceTabsProps,
	WebControlPanelSubTabItem,
	WebControlPanelSubTabsProps,
	WebControlPanelDecisionRowProps,
	WebControlPanelDecisionRowRisk,
	WebControlPanelRecommendationProps,
	WebControlPanelActionItem,
	WebControlPanelActionClusterProps,
	WebControlPanelInspectorShellProps,
	WebControlPanelStatusTone,
	WebControlPanelStatusTagProps,
} from './web/index';

// ─── Shared WebApp Components ─────────────────────────────────────────────────
// Use for: general app surfaces, forms, cards usable in both webapp and control panel.
export {
	WebControlActionButton,
	WebControlActionCard,
	WebControlDisclosureItem,
	WebControlSurfaceHeader,
	WebCompactSurfaceHeader,
	WebSystemSuggestion,
} from './web/index';

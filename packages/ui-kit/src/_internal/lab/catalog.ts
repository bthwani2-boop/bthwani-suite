export type BthComponentLabSection = {
  id: string;
  title: string;
  description: string;
  families: readonly string[];
};

export const bthComponentLabSections = Object.freeze<BthComponentLabSection[]>([
  {
    id: 'outputs',
    title: 'Token and Theme Outputs',
    description: 'Validates the current mode, direction, and output-backed theme surface contract.',
    families: ['token outputs', 'theme outputs', 'web css variables', 'native theme snapshot']
  },
  {
    id: 'actions-fields',
    title: 'Actions and Fields',
    description: 'Covers the primary action hierarchy and input baseline.',
    families: ['BthButton', 'BthTextField', 'BthSearchField', 'BthSelectField']
  },
  {
    id: 'selectors',
    title: 'Selector Families',
    description: 'Covers the shared selection grammar and directional behavior.',
    families: ['BthChip', 'BthCheckbox', 'BthRadio', 'BthSwitch', 'BthSegmentedControl']
  },
  {
    id: 'navigation',
    title: 'Navigation Families',
    description: 'Covers shared movement across sections, routes, and review surfaces.',
    families: ['BthScreenHeader', 'BthSectionHeader', 'BthTabs']
  },
  {
    id: 'overlays',
    title: 'Overlay Families',
    description: 'Covers shared confirmation and transient feedback surfaces.',
    families: ['BthSheetFrame', 'BthDialog', 'BthToast']
  },
  {
    id: 'display',
    title: 'Data Display Families',
    description: 'Covers reusable cards, summaries, lists, and structured tables.',
    families: ['BthCard', 'BthStatCard', 'BthListItem', 'BthKeyValueList', 'BthDataTable']
  },
  {
    id: 'states',
    title: 'State Families',
    description: 'Delegates to the shared state gallery for complete state-system review.',
    families: ['BthStateView', 'BthEmptyState', 'BthStateGallery']
  }
]);

export const bthLabThemeModes = Object.freeze(['light', 'dark', 'high-contrast'] as const);

export const bthProofArtifactFiles = Object.freeze([

] as const);
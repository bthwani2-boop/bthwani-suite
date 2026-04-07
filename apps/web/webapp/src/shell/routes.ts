export type WebappPreviewRoute = {
  id: string;
  candidateId: string;
  phase: 'surface-shell';
  status: 'placeholder';
};

export const webappPreviewRoutes: WebappPreviewRoute[] = [
  {
    id: 'webapp-entry-home',
    candidateId: 'webapp_entry_home',
    phase: 'surface-shell',
    status: 'placeholder',
  },
  {
    id: 'webapp-sections-overview',
    candidateId: 'webapp_sections_overview',
    phase: 'surface-shell',
    status: 'placeholder',
  },
  {
    id: 'webapp-screen-staging',
    candidateId: 'webapp_screen_staging',
    phase: 'surface-shell',
    status: 'placeholder',
  },
];
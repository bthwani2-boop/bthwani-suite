export type WebsitePreviewRoute = {
  id: string;
  candidateId: string;
  phase: 'surface-shell';
  status: 'placeholder';
};

export const websitePreviewRoutes: WebsitePreviewRoute[] = [
  {
    id: 'website-home-landing',
    candidateId: 'website_home_landing',
    phase: 'surface-shell',
    status: 'placeholder',
  },
  {
    id: 'website-page-map',
    candidateId: 'website_page_map',
    phase: 'surface-shell',
    status: 'placeholder',
  },
  {
    id: 'website-screen-staging',
    candidateId: 'website_screen_staging',
    phase: 'surface-shell',
    status: 'placeholder',
  },
];
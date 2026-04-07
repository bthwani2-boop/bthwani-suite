import { websitePreviewRoutes } from './routes';

export const websiteNavigationContainer = {
  kind: 'placeholder-navigation-container',
  surface: 'website',
  initialRouteId: 'website-home-landing',
  previewRouteIds: websitePreviewRoutes.map((route) => route.id),
  mode: 'browser-preview-shell',
} as const;
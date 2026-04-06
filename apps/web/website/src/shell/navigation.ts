import { websitePreviewRoutes } from './routes';

export const websiteNavigationContainer = {
  kind: 'placeholder-navigation-container',
  surface: 'website',
  initialRouteId: null,
  previewRouteIds: websitePreviewRoutes.map((route) => route.id),
  mode: 'browser-preview-shell',
} as const;
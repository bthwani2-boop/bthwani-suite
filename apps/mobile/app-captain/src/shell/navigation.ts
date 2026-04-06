import { appCaptainPreviewRoutes } from './routes';

export const appCaptainNavigationContainer = {
  kind: 'placeholder-navigation-container',
  surface: 'app-captain',
  initialRouteId: 'captain-offers-list',
  previewRouteIds: appCaptainPreviewRoutes.map((route) => route.id),
  mode: 'fixtures-only-preview',
} as const;
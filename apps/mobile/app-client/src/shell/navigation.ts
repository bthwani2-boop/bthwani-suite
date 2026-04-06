import { appClientPreviewRoutes } from './routes';

export const appClientNavigationContainer = {
  kind: 'placeholder-navigation-container',
  surface: 'app-client',
  initialRouteId: 'client-entry-discovery-home',
  previewRouteIds: appClientPreviewRoutes.map((route) => route.id),
  mode: 'fixtures-only-preview',
} as const;
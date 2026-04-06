import { webappPreviewRoutes } from './routes';

export const webappNavigationContainer = {
  kind: 'placeholder-navigation-container',
  surface: 'webapp',
  initialRouteId: null,
  previewRouteIds: webappPreviewRoutes.map((route) => route.id),
  mode: 'browser-preview-shell',
} as const;
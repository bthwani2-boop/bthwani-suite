import { controlPanelPreviewRoutes } from './routes';

export const controlPanelNavigationContainer = {
  kind: 'placeholder-navigation-container',
  surface: 'control-panel',
  initialRouteId: 'ops-orders-board',
  previewRouteIds: controlPanelPreviewRoutes.map((route) => route.id),
  mode: 'browser-preview-shell',
} as const;
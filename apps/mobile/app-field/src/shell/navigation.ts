import { appFieldPreviewRoutes } from './routes';

export const appFieldNavigationContainer = {
  kind: 'placeholder-navigation-container',
  surface: 'app-field',
  initialRouteId: 'field-activation-workspace',
  previewRouteIds: appFieldPreviewRoutes.map((route) => route.id),
  mode: 'fixtures-only-preview',
} as const;
import { appPartnerPreviewRoutes } from './routes';

export const appPartnerNavigationContainer = {
  kind: 'placeholder-navigation-container',
  surface: 'app-partner',
  initialRouteId: 'partner-orders-board',
  previewRouteIds: appPartnerPreviewRoutes.map((route) => route.id),
  mode: 'fixtures-only-preview',
} as const;
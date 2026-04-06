import { webappNavigationContainer } from './navigation';
import { webappPreviewRoutes } from './routes';
import { webappThemeConfig } from './theme';

export const webappShell = {
  appRoot: 'apps/web/webapp',
  service: 'generic-surface-shell',
  surface: 'webapp',
  shellStatus: 'thin-shell-only',
  phaseGate: 'surface-shell-ready-awaiting-service-classification',
  currentServiceExclusions: ['dsh'],
  theme: webappThemeConfig,
  assetLoading: {
    status: 'placeholder',
    sources: ['local-static-only'],
  },
  layout: {
    topLevelFrame: 'browser-public-webapp-shell',
    companionHandling: 'none-yet',
  },
  navigationContainer: webappNavigationContainer,
  previewRoutes: webappPreviewRoutes,
  constraints: [
    'no-bound-service-logic',
    'no-generated-api-client-wiring',
    'no-canonical-runtime-truth-access',
    'no-production-claims',
    'no-dsh-route-placeholders-while-dsh-is-out'
  ],
} as const;
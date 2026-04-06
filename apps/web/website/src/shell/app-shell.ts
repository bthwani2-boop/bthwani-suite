import { websiteNavigationContainer } from './navigation';
import { websitePreviewRoutes } from './routes';
import { websiteThemeConfig } from './theme';

export const websiteShell = {
  appRoot: 'apps/web/website',
  service: 'generic-surface-shell',
  surface: 'website',
  shellStatus: 'thin-shell-only',
  phaseGate: 'surface-shell-ready-awaiting-service-classification',
  currentServiceExclusions: ['dsh'],
  theme: websiteThemeConfig,
  assetLoading: {
    status: 'placeholder',
    sources: ['local-static-only'],
  },
  layout: {
    topLevelFrame: 'browser-website-shell',
    companionHandling: 'none-yet',
  },
  navigationContainer: websiteNavigationContainer,
  previewRoutes: websitePreviewRoutes,
  constraints: [
    'no-bound-service-logic',
    'no-generated-api-client-wiring',
    'no-canonical-runtime-truth-access',
    'no-production-claims',
    'no-dsh-route-placeholders-while-dsh-is-out'
  ],
} as const;
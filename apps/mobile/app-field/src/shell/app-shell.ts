import { appFieldNavigationContainer } from './navigation';
import { appFieldPreviewRoutes } from './routes';
import { appFieldThemeConfig } from './theme';

export const appFieldShell = {
  appRoot: 'apps/mobile/app-field',
  service: 'dsh',
  surface: 'app-field',
  shellStatus: 'thin-shell-only',
  phaseGate: 'Phase 12',
  optionalBranch: true,
  theme: appFieldThemeConfig,
  assetLoading: {
    status: 'placeholder',
    sources: ['local-static-only'],
  },
  layout: {
    safeArea: true,
    topLevelFrame: 'support-workspace-shell',
    companionHandling: 'sheet-placeholders-only',
  },
  navigationContainer: appFieldNavigationContainer,
  previewRoutes: appFieldPreviewRoutes,
  nonRouteCandidates: [
    'dsh_field_geo_pin_companion',
    'dsh_field_visit_log_companion'
  ],
  constraints: [
    'no-bound-service-logic',
    'no-generated-api-client-wiring',
    'no-canonical-runtime-truth-access',
    'no-production-claims'
  ],
} as const;
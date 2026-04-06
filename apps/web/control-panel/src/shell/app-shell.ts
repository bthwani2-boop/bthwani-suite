import { controlPanelNavigationContainer } from './navigation';
import { controlPanelPreviewRoutes } from './routes';
import { controlPanelThemeConfig } from './theme';

export const controlPanelShell = {
  appRoot: 'apps/web/control-panel',
  service: 'dsh',
  surface: 'control-panel',
  shellStatus: 'thin-shell-only',
  phaseGate: 'Phase 12',
  theme: controlPanelThemeConfig,
  assetLoading: {
    status: 'placeholder',
    sources: ['local-static-only'],
  },
  layout: {
    topLevelFrame: 'browser-control-plane-shell',
    companionHandling: 'sheet-and-state-placeholders-only',
  },
  navigationContainer: controlPanelNavigationContainer,
  previewRoutes: controlPanelPreviewRoutes,
  nonRouteCandidates: [
    'dsh_proxy_schedule_companion'
  ],
  constraints: [
    'no-bound-service-logic',
    'no-generated-api-client-wiring',
    'no-canonical-runtime-truth-access',
    'no-production-claims'
  ],
} as const;
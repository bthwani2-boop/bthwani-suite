import { appCaptainNavigationContainer } from './navigation';
import { appCaptainPreviewRoutes } from './routes';
import { appCaptainThemeConfig } from './theme';

export const appCaptainShell = {
  appRoot: 'apps/mobile/app-captain',
  service: 'dsh',
  surface: 'app-captain',
  shellStatus: 'thin-shell-only',
  phaseGate: 'Phase 12',
  theme: appCaptainThemeConfig,
  assetLoading: {
    status: 'placeholder',
    sources: ['local-static-only'],
  },
  layout: {
    safeArea: true,
    topLevelFrame: 'captain-execution-shell',
    companionHandling: 'sheet-and-inline-step-placeholders-only',
  },
  navigationContainer: appCaptainNavigationContainer,
  previewRoutes: appCaptainPreviewRoutes,
  nonRouteCandidates: [
    'dsh_captain_chat_companion',
    'dsh_captain_reject_action'
  ],
  constraints: [
    'no-bound-service-logic',
    'no-generated-api-client-wiring',
    'no-canonical-runtime-truth-access',
    'no-production-claims'
  ],
} as const;
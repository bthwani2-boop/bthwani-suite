import { appClientNavigationContainer } from './navigation';
import { appClientPreviewRoutes } from './routes';
import { appClientThemeConfig } from './theme';

export const appClientShell = {
  appRoot: 'apps/mobile/app-client',
  service: 'dsh',
  surface: 'app-client',
  shellStatus: 'thin-shell-only',
  phaseGate: 'Phase 12',
  theme: appClientThemeConfig,
  assetLoading: {
    status: 'placeholder',
    sources: ['local-static-only'],
  },
  layout: {
    safeArea: true,
    topLevelFrame: 'mobile-stack-shell',
    companionHandling: 'sheet-and-state-placeholders-only',
  },
  navigationContainer: appClientNavigationContainer,
  previewRoutes: appClientPreviewRoutes,
  nonRouteCandidates: [
    'dsh_client_order_chat_companion',
    'dsh_client_checkout_block_state',
    'dsh_client_cancelled_terminal_state'
  ],
  constraints: [
    'no-bound-service-logic',
    'no-generated-api-client-wiring',
    'no-canonical-runtime-truth-access',
    'no-production-claims'
  ],
} as const;
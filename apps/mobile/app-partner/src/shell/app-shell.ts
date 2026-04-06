import { appPartnerNavigationContainer } from './navigation';
import { appPartnerPreviewRoutes } from './routes';
import { appPartnerThemeConfig } from './theme';

export const appPartnerShell = {
  appRoot: 'apps/mobile/app-partner',
  service: 'dsh',
  surface: 'app-partner',
  shellStatus: 'thin-shell-only',
  phaseGate: 'Phase 12',
  theme: appPartnerThemeConfig,
  assetLoading: {
    status: 'placeholder',
    sources: ['local-static-only'],
  },
  layout: {
    safeArea: true,
    topLevelFrame: 'task-first-partner-shell',
    companionHandling: 'sheet-and-inline-step-placeholders-only',
  },
  navigationContainer: appPartnerNavigationContainer,
  previewRoutes: appPartnerPreviewRoutes,
  nonRouteCandidates: [
    'dsh_partner_chat_companion',
    'dsh_partner_handoff_action'
  ],
  constraints: [
    'no-bound-service-logic',
    'no-generated-api-client-wiring',
    'no-canonical-runtime-truth-access',
    'no-production-claims'
  ],
} as const;
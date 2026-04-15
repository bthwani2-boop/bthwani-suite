import { bthThemeModes } from '../../foundation/themes';
import { tokenSourceMetadata } from '../../foundation/tokens';
import { bthComponentLabSections, bthLabThemeModes, bthProofArtifactFiles } from '../lab/catalog';
import { bthStateIds } from '../../states';

export const bthUiKitProofManifest = {
  authority: {
    blueprint: 'packages/ui-kit/docs/BTH_UI_KIT_SUPREME_BLUEPRINT_2026_AR.md',
    executionPlan: 'packages/ui-kit/docs/BTH_UI_KIT_SUPREME_EXECUTION_PLAN_2026_AR.md',
    ownership: 'packages/ui-kit/docs/OWNERSHIP_AND_RULES.md'
  },
  hostedPreview: {
    app: 'website',
    route: '/ui-kit'
  },
  tokenSource: tokenSourceMetadata,
  themeModes: bthThemeModes,
  labThemeModes: bthLabThemeModes,
  componentLabSections: bthComponentLabSections,
  stateGallery: {
    languages: ['ar', 'en'],
    stateIds: bthStateIds
  },
  generatedArtifacts: bthProofArtifactFiles,
  verificationTargets: ['ui-kit:typecheck', 'ui-kit:build-outputs', 'ui-kit:proof-visual', 'ui-kit:proof']
} as const;
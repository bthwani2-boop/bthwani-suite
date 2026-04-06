import { dshAppCaptainFixtureLocations, dshAppCaptainPreviewRoutes } from './app-captain/index';
import { dshAppClientFixtureLocations, dshAppClientPreviewRoutes } from './app-client/index';
import { dshAppFieldFixtureLocations, dshAppFieldPreviewRoutes } from './app-field/index';
import { dshAppPartnerFixtureLocations, dshAppPartnerPreviewRoutes } from './app-partner/index';
import { dshControlPanelFixtureLocations, dshControlPanelPreviewRoutes } from './control-panel/index';

export const dshPhase12PreviewRoutes = [
  ...dshAppClientPreviewRoutes,
  ...dshAppPartnerPreviewRoutes,
  ...dshAppCaptainPreviewRoutes,
  ...dshAppFieldPreviewRoutes,
  ...dshControlPanelPreviewRoutes,
];

export const dshPhase12FixtureLocations = [
  ...dshAppClientFixtureLocations,
  ...dshAppPartnerFixtureLocations,
  ...dshAppCaptainFixtureLocations,
  ...dshAppFieldFixtureLocations,
  ...dshControlPanelFixtureLocations,
];
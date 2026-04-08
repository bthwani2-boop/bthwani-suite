import { dshAppCaptainFixtureLocations } from './app-captain/index';
import { dshAppClientFixtureLocations } from './app-client/index';
import { dshAppFieldFixtureLocations } from './app-field/index';
import { dshAppPartnerFixtureLocations } from './app-partner/index';
import { dshControlPanelFixtureLocations } from './control-panel/index';

export const dshPhase12FixtureLocations = [
  ...dshAppClientFixtureLocations,
  ...dshAppPartnerFixtureLocations,
  ...dshAppCaptainFixtureLocations,
  ...dshAppFieldFixtureLocations,
  ...dshControlPanelFixtureLocations,
];
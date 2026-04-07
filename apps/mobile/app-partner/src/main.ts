import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshAppPartnerFixtureLocations } from '@bthwani/surfaces';
import { appPartnerShell } from './shell/app-shell';

mountSurfaceBrowserApp({
  shell: appPartnerShell,
  fixtureLocations: dshAppPartnerFixtureLocations,
});
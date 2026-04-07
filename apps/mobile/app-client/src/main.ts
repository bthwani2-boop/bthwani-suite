import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshAppClientFixtureLocations } from '@bthwani/surfaces';
import { appClientShell } from './shell/app-shell';

mountSurfaceBrowserApp({
  shell: appClientShell,
  fixtureLocations: dshAppClientFixtureLocations,
});
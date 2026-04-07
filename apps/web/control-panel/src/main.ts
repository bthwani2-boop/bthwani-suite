import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshControlPanelFixtureLocations } from '@bthwani/surfaces';
import { controlPanelShell } from './shell/app-shell';

mountSurfaceBrowserApp({
  shell: controlPanelShell,
  fixtureLocations: dshControlPanelFixtureLocations,
});
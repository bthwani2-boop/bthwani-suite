import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshAppFieldFixtureLocations } from '@bthwani/surfaces';
import { appFieldShell } from './shell/app-shell';

mountSurfaceBrowserApp({
  shell: appFieldShell,
  fixtureLocations: dshAppFieldFixtureLocations,
});
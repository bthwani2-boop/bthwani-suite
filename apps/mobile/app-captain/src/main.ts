import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshAppCaptainFixtureLocations } from '@bthwani/surfaces';
import { appCaptainShell } from './shell/app-shell';

mountSurfaceBrowserApp({
  shell: appCaptainShell,
  fixtureLocations: dshAppCaptainFixtureLocations,
});
// Thin App wrapper for Expo (app-partner)
import { appPartnerShell } from './src/shell/app-shell';
import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshAppPartnerFixtureLocations } from '@bthwani/surfaces';

export default function App() {
  mountSurfaceBrowserApp({
    shell: appPartnerShell,
    fixtureLocations: dshAppPartnerFixtureLocations,
  });
  return null;
}

// Thin App wrapper for Expo (app-client)
import { appClientShell } from './src/shell/app-shell';
import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshAppClientFixtureLocations } from '@bthwani/surfaces';

export default function App() {
  mountSurfaceBrowserApp({
    shell: appClientShell,
    fixtureLocations: dshAppClientFixtureLocations,
  });
  return null;
}

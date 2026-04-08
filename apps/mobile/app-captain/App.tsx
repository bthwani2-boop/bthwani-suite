// Thin App wrapper for Expo (app-captain)
import { appCaptainShell } from './src/shell/app-shell';
import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshAppCaptainFixtureLocations } from '@bthwani/surfaces';

export default function App() {
  mountSurfaceBrowserApp({
    shell: appCaptainShell,
    fixtureLocations: dshAppCaptainFixtureLocations,
  });
  return null;
}

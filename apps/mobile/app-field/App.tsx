// Thin App wrapper for Expo (app-field)
import { appFieldShell } from './src/shell/app-shell';
import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { dshAppFieldFixtureLocations } from '@bthwani/surfaces';

export default function App() {
  mountSurfaceBrowserApp({
    shell: appFieldShell,
    fixtureLocations: dshAppFieldFixtureLocations,
  });
  return null;
}

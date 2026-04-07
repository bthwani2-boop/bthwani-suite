import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { webappShell } from './shell/app-shell';

mountSurfaceBrowserApp({
  shell: webappShell,
});
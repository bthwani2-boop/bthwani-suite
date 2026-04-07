import { mountSurfaceBrowserApp } from '@bthwani/surface-browser';
import { websiteShell } from './shell/app-shell';

mountSurfaceBrowserApp({
  shell: websiteShell,
});
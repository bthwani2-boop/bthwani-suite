import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { workspaceSurfaceCatalog, type WorkspaceSurfaceId } from '../../packages/surface-browser/src/workspace-surfaces';

type CreateSurfaceAppConfigOptions = {
  appRoot: string;
  surfaceId: WorkspaceSurfaceId;
};

const workspaceRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));

export function createSurfaceAppViteConfig({ appRoot, surfaceId }: CreateSurfaceAppConfigOptions) {
  const surfaceSpec = workspaceSurfaceCatalog[surfaceId];

  return defineConfig({
    root: path.resolve(workspaceRoot, appRoot),
    appType: 'spa',
    plugins: [react()],
    resolve: {
      alias: {
        '@bthwani/surface-browser': path.resolve(workspaceRoot, 'packages/surface-browser/src/index.ts'),
        '@bthwani/surfaces': path.resolve(workspaceRoot, 'packages/surfaces/src/index.ts'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      host: '0.0.0.0',
      port: surfaceSpec.port,
      strictPort: true,
      fs: {
        allow: [workspaceRoot],
      },
    },
    preview: {
      host: '0.0.0.0',
      port: surfaceSpec.port + 100,
      strictPort: true,
    },
    build: {
      outDir: path.resolve(workspaceRoot, 'dist', appRoot),
      emptyOutDir: true,
    },
  });
}
import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'ui-kit/src/**/*.{ts,tsx}',
    'dsh/frontend/**/*.{ts,tsx}',
    'wlt/frontend/**/*.{ts,tsx}',
    'control-panel/runtime/**/*.{ts,tsx}',
  ],
  ignore: [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/.tamagui/**',
    '**/graphify-out/**',
    '**/tools/registry/runs/**',
  ],
};

export default config;

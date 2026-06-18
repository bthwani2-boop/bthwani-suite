const base = require('./dependency-cruiser.design.cjs');

module.exports = {
  ...base,
  forbidden: [
    ...(base.forbidden ?? []),
    {
      name: 'shared-must-not-import-surfaces',
      from: { path: '^dsh/frontend/shared' },
      to: { path: '^dsh/frontend/(app-client|app-partner|app-captain|app-field|control-panel)' },
      severity: 'error',
    },
    {
      name: 'surfaces-must-not-import-each-other-app-client',
      from: { path: '^dsh/frontend/app-client' },
      to: { path: '^dsh/frontend/(app-partner|app-captain|app-field)' },
      severity: 'error',
    },
    {
      name: 'surfaces-must-not-import-each-other-app-partner',
      from: { path: '^dsh/frontend/app-partner' },
      to: { path: '^dsh/frontend/(app-client|app-captain|app-field)' },
      severity: 'error',
    },
    {
      name: 'surfaces-must-not-import-each-other-app-captain',
      from: { path: '^dsh/frontend/app-captain' },
      to: { path: '^dsh/frontend/(app-client|app-partner|app-field)' },
      severity: 'error',
    },
    {
      name: 'surfaces-must-not-import-each-other-app-field',
      from: { path: '^dsh/frontend/app-field' },
      to: { path: '^dsh/frontend/(app-client|app-partner|app-captain)' },
      severity: 'error',
    },
    {
      name: 'no-runtime-preview-data',
      from: {
        path: '^dsh/frontend/(shared|control-panel|app-client|app-partner|app-captain|app-field)',
      },
      to: {
        path: '^dsh/frontend/data',
      },
      severity: 'error',
    },
    {
      name: 'wlt-dsh-bridge-only',
      from: { path: '^dsh/frontend' },
      to: { path: '^wlt/(backend|domain)/' },
      severity: 'error',
    },
    {
      name: 'wlt-app-must-not-import-wlt-control-panel',
      from: { path: '^wlt/frontend/dsh/(app-client|app-partner|app-captain|app-field)' },
      to: { path: '^wlt/frontend/dsh/control-panel' },
      severity: 'error',
    },
    {
      name: 'control-panel-must-not-import-surface-internals',
      from: { path: '^dsh/frontend/control-panel' },
      to: { path: '^dsh/frontend/(app-client|app-partner|app-captain|app-field)/' },
      severity: 'error',
    },
    {
      name: 'dsh-must-not-own-money-mutation',
      from: { path: '^dsh/frontend/(shared|control-panel|app-client|app-partner|app-captain|app-field)' },
      to: {
        path: '^wlt/(backend|domain|frontend/dsh/app-)',
        pathNot: [
          '^wlt/frontend/dsh/shared',
          'Bridge',
          'ui-copy',
          'index'
        ],
      },
      severity: 'error',
    },
  ],
};

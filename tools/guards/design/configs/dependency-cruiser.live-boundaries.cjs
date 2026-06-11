const base = require('./dependency-cruiser.design.cjs');

module.exports = {
  ...base,
  forbidden: [
    ...(base.forbidden ?? []),
    {
      name: 'no-runtime-preview-data-imports-outside-approved-bridges',
      from: {
        path:
          '^dsh/frontend/(app-client/dsh-client\\.navigation-bridge\\.ts|app-client/adapters/|app-field/DshFieldSurface\\.tsx|app-field/storage/field-onboarding\\.storage\\.ts)',
      },
      to: {
        path:
          '^dsh/frontend/data/(?!preview-data\\.contract\\.ts$)',
      },
      severity: 'error',
    },
    {
      name: 'dsh-must-not-import-wlt-backend-or-domain-internals',
      from: { path: '^dsh/' },
      to: { path: '^wlt/(backend|domain)/' },
      severity: 'error',
    },
  ],
};

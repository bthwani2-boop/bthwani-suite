module.exports = {
  forbidden: [
    {
      name: 'no-direct-tamagui-outside-ui-kit',
      from: { pathNot: '^ui-kit/' },
      to: { path: '^(tamagui|@tamagui/)' },
      severity: 'error',
    },
    {
      name: 'no-runtime-generated-or-evidence-imports',
      from: { path: '^(dsh|wlt|app-client|app-partner|app-captain|app-field|control-panel|webapp|website)/' },
      to: { path: '^(graphify-out|\\.tamagui|tools/registry/runs|tools/analysis)' },
      severity: 'error',
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules|\\.git|\\.next|dist|build|coverage|\\.tamagui|graphify-out|tools/registry/runs' },
    tsPreCompilationDeps: true,
  },
};

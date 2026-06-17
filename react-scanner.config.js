module.exports = {
  crawlFrom: './dsh/frontend',
  exclude: [/node_modules/, /\.spec\./, /__tests__/, /data\//],
  includeSubComponents: true,
  importedFrom: /@bthwani\/ui-kit/,
  processors: [
    ['count-components-and-props', { outputTo: './graphify-out/react-scanner-report.json' }],
  ],
};

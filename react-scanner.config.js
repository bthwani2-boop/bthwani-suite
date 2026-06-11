module.exports = {
  crawlFrom: './dsh/frontend',
  exclude: [/node_modules/, /\.spec\./, /__tests__/, /data\//, /media-fixtures\//],
  includeSubComponents: true,
  importedFrom: /@bthwani\/ui-kit/,
  processors: [
    ['count-components-and-props', { outputTo: './graphify-out/react-scanner-report.json' }],
  ],
};

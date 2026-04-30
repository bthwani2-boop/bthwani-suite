module.exports = function createExpoBabelConfig(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
  };
};
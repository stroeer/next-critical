const merge = require('deepmerge');
const NextCriticalPlugin = require('./plugins/webpack/NextCriticalPlugin');
const BabelPresetPlugin = require('./plugins/babel');

module.exports = (nextConfig = {}) =>
  merge(nextConfig, {
    experimental: {
      plugins: true,
    },
    plugins: ['next-critical/plugins/next'],
    webpack: (config, options) => {
      config.plugins.push(new NextCriticalPlugin(options.buildId));
      options.defaultLoaders.babel.options.babelPresetPlugins.push(BabelPresetPlugin);

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });

const { SyncHook } = require('tapable');

/**
 * Patches a bug where the AutoDLLPlugin is missing this hook
 * It will throw an error in this line, saying "cannot call .call of undefined"
 *
 * https://github.com/asfktz/autodll-webpack-plugin/blob/546ccc450b13e4aad7da95d694e3c0a174b9ccfd/src/plugin.js#L87
 *
 * because it has not been initialized with this child compiler. So this plugin augments this line+
 *
 * https://github.com/asfktz/autodll-webpack-plugin/blob/546ccc450b13e4aad7da95d694e3c0a174b9ccfd/src/plugin.js#L57
 *
 * todo this may a more thorough investigation & bugifx, but the AutoDLLPlugin will be deprecated with Webpack 5 anyway
 **/
class FixOutputOptionsPlugin {
  pluginName = this.constructor.name;

  apply(compiler) {
    compiler.hooks.autodllStatsRetrieved = new SyncHook(['stats', 'source']);
  }
}

module.exports = FixOutputOptionsPlugin;

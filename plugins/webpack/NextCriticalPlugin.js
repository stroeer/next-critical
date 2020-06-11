const { resolve } = require('path');
const CriticalCompiler = require('./CriticalCompiler');

class NextCriticalWebpackPlugin {
  pluginName = this.constructor.name;
  dependencies = [];
  outputFile = undefined;

  constructor(buildId) {
    buildId = process.env.NODE_ENV === 'development' ? 'development' : buildId;
    const criticalFile = `.next/server/static/${buildId}/pages/_critical.js`;
    this.outputFile = resolve(process.cwd(), criticalFile);
  }

  apply(compiler) {
    this.extractCriticalDependencies(compiler);
    this.compileCriticalJs(compiler);
  }

  extractCriticalDependencies(compiler) {
    compiler.hooks.normalModuleFactory.tap(this.pluginName, factory => {
      factory.hooks.beforeResolve.tap(this.pluginName, result => this.checkExtract(result));
    });
  }

  compileCriticalJs(compiler) {
    compiler.hooks.afterCompile.tapPromise(this.pluginName, async compilation => {
      if (compilation.name !== 'client') return;
      const { dependencies, outputFile } = this;
      const criticalCompiler = new CriticalCompiler(compilation, { dependencies, outputFile });
      await criticalCompiler.run();
    });
  }

  checkExtract(result) {
    if (result && result.request && result.request.startsWith('next-critical/loader')) {
      this.extractDependency(result);
      return null;
    }
    return result;
  }

  extractDependency(result) {
    const [criticalDependency] = result.dependencies;
    const { originModule } = criticalDependency;
    const index = originModule.dependencies.indexOf(criticalDependency);
    originModule.dependencies.splice(index, 1);
    this.dependencies.push(criticalDependency);
  }
}

module.exports = NextCriticalWebpackPlugin;

const fs = require('fs');
const { promisify } = require('util');
const { basename } = require('path');
const tmp = require('tmp');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const FixOutputOptionsPlugin = require('./FixOutputOptionsPlugin');
const FixAutoDLLPluginPlugin = require('./FixAutoDLLPluginPlugin');

class CriticalCompiler {
  compilationName = 'next-critical';
  compilation = undefined;
  options = undefined;

  constructor(compilation, options) {
    this.compilation = compilation;
    this.options = options;
  }

  async run() {
    if (this.compilation.name === this.compilationName) return;
    const compiler = await this.getCompiler();
    const stats = await promisify(compiler.run.bind(compiler))();
    this.handleCompilationErrors(stats);
  }

  async getCompiler() {
    const plugins = await this.getPlugins();
    const output = { path: '/', filename: basename(this.options.outputFile) };
    const compiler = this.compilation.createChildCompiler(this.compilationName, output);
    plugins.forEach(plugin => plugin.apply(compiler));
    return compiler;
  }

  async getPlugins() {
    const entry = await this.createEntryFile();
    const { context } = this.compilation.options;
    const { outputFile } = this.options;
    return [
      new SingleEntryPlugin(context, entry, this.pluginName),
      new FixOutputOptionsPlugin({ outputFile }),
      new FixAutoDLLPluginPlugin(),
    ];
  }

  async createEntryFile() {
    const source = this.getEntryFileSource();
    const path = await promisify(tmp.file.bind(tmp))({ postfix: '.ts' });
    await fs.promises.writeFile(path, source, 'utf-8');
    return path;
  }

  getEntryFileSource() {
    return this.options.dependencies
      .map(({ request }) => request.replace(/^next-critical\/loader!/, ''))
      .map(r => `import "${r}";`)
      .join('\n');
  }

  handleCompilationErrors(stats) {
    const info = stats.toJson();
    info.warnings.forEach(warning => console.warn(warning));
    if (stats.hasErrors()) throw new Error(info.errors[0]);
  }
}

module.exports = CriticalCompiler;

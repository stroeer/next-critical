const { dirname } = require('path');
const NodeOutputFileSystem = require('webpack/lib/node/NodeOutputFileSystem');
const NodeWatchFileSystem = require('webpack/lib/node/NodeWatchFileSystem');

class FixOutputOptionsPlugin {
  pluginName = this.constructor.name;
  outputFile = undefined;

  constructor({ outputFile }) {
    this.outputFile = outputFile;
  }

  apply(compiler) {
    compiler.outputFileSystem = new NodeOutputFileSystem();
    compiler.watchFileSystem = new NodeWatchFileSystem();
    compiler.outputPath = dirname(this.outputFile);
  }
}

module.exports = FixOutputOptionsPlugin;
